// Browser-side behavior. Everything date-related uses the shop's time zone (America/Chicago),
// never the visitor's, so the open-now line, holiday bar and coupon expiry are right everywhere.
(function () {
  "use strict";
  var dataEl = document.getElementById("hours-data");
  var H = dataEl ? JSON.parse(dataEl.textContent) : null;
  var TZ = (H && H.tz) || "America/Chicago";
  var SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function nowParts() {
    if (H && H.previewDate) {
      var t = (H.previewTime || "10:00").split(":");
      return { date: H.previewDate, min: Number(t[0]) * 60 + Number(t[1] || 0) };
    }
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { date: p.year + "-" + p.month + "-" + p.day, min: Number(p.hour) * 60 + Number(p.minute) };
  }
  function addDays(iso, n) {
    var a = iso.split("-").map(Number);
    return new Date(Date.UTC(a[0], a[1] - 1, a[2] + n)).toISOString().slice(0, 10);
  }
  function dow(iso) {
    var a = iso.split("-").map(Number);
    return new Date(Date.UTC(a[0], a[1] - 1, a[2])).getUTCDay();
  }
  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return (((h + 11) % 12) + 1) + ":" + (m < 10 ? "0" : "") + m + (h >= 12 ? " PM" : " AM");
  }

  var now = nowParts();
  var today = now.date;

  // ---- Open-now line ----
  function hoursFor(iso) {
    var base = null, d = dow(iso);
    (H.week || []).forEach(function (w) { if (w.dow === d && w.open != null && w.close != null) base = [w.open, w.close]; });
    var sp = null;
    (H.special || []).forEach(function (s) { if (s.date <= iso && iso <= s.end) sp = s; });
    if (!sp) return { hrs: base, label: null };
    if (sp.type === "Closed") return { hrs: null, label: sp.label };
    if (sp.type === "Closing Early") return { hrs: base && sp.close != null ? [base[0], sp.close] : base, label: sp.label };
    if (sp.type === "Opening Late") return { hrs: base && sp.open != null ? [sp.open, base[1]] : base, label: sp.label };
    if (sp.open != null && sp.close != null) return { hrs: [sp.open, sp.close], label: sp.label };
    return { hrs: base, label: sp.label };
  }
  function openStatus() {
    var t = hoursFor(today);
    if (t.hrs && now.min >= t.hrs[0] && now.min < t.hrs[1]) return "Open now · Closes " + fmt(t.hrs[1]);
    if (t.hrs && now.min < t.hrs[0]) return "Opens today at " + fmt(t.hrs[0]);
    for (var i = 1; i <= 14; i++) {
      var d = addDays(today, i), x = hoursFor(d);
      if (x.hrs) {
        var lead = !t.hrs && t.label ? "Closed today for " + t.label : "Closed now";
        return lead + " · Opens " + (i === 1 ? "tomorrow" : SHORT[dow(d)]) + " at " + fmt(x.hrs[0]);
      }
    }
    return "Call for hours";
  }
  if (H) {
    var status = openStatus();
    document.querySelectorAll("[data-open-status]").forEach(function (el) { el.textContent = status; });
    var td = dow(today);
    document.querySelectorAll(".hours-row[data-dow]").forEach(function (row) {
      if (Number(row.getAttribute("data-dow")) === td) {
        row.classList.add("is-today");
        var name = row.querySelector(".hours-day");
        if (name && !name.querySelector(".today-chip")) {
          var chip = document.createElement("span");
          chip.className = "today-chip";
          chip.textContent = "Today";
          name.appendChild(chip);
        }
      }
    });
  }

  // ---- Holiday bar: show rows whose window includes today, at most 2 ----
  var bar = document.querySelector(".holiday-bar");
  if (bar) {
    var shown = 0, more = false;
    bar.querySelectorAll(".holiday-line").forEach(function (line) {
      var inWindow = line.getAttribute("data-start") <= today && today <= line.getAttribute("data-end");
      if (inWindow && shown < 2) { line.hidden = false; shown++; }
      else { line.hidden = true; if (inWindow) more = true; }
    });
    var moreLink = bar.querySelector(".holiday-more");
    if (moreLink) moreLink.hidden = !more;
    bar.hidden = shown === 0;
  }

  // Past holidays drop off the Hours page list without a rebuild.
  document.querySelectorAll(".holiday-list li[data-end]").forEach(function (li) {
    if (li.getAttribute("data-end") < today) li.hidden = true;
  });

  // ---- Coupons: hide expired or not-yet-started; respect data-limit on a container ----
  var anyCoupon = false;
  document.querySelectorAll("[data-coupons]").forEach(function (box) {
    var limit = Number(box.getAttribute("data-limit") || 0), visible = 0;
    box.querySelectorAll("[data-expires]").forEach(function (c) {
      var starts = c.getAttribute("data-starts"), expires = c.getAttribute("data-expires");
      var live = (!starts || starts <= today) && (!expires || today <= expires);
      if (live && (!limit || visible < limit)) { c.hidden = false; visible++; } else { c.hidden = true; }
    });
    if (visible) anyCoupon = true;
    var hideWhenEmpty = box.closest("[data-hide-when-empty]");
    if (hideWhenEmpty) hideWhenEmpty.hidden = visible === 0;
  });
  document.querySelectorAll(".no-coupons").forEach(function (p) { p.hidden = anyCoupon; });

  // ---- Print one coupon ----
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-print-coupon]");
    if (!btn) return;
    var target = document.getElementById(btn.getAttribute("data-print-coupon"));
    if (!target) return;
    var section = target.closest("main > *");
    document.body.classList.add("printing-coupon");
    target.classList.add("print-target");
    if (section) section.classList.add("has-print-target");
    var done = function () {
      document.body.classList.remove("printing-coupon");
      target.classList.remove("print-target");
      if (section) section.classList.remove("has-print-target");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  });

  // ---- Mobile menu ----
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  // ---- Quote form: carry a coupon over from "Request this special", and record the page ----
  var params = new URLSearchParams(window.location.search);
  var coupon = params.get("coupon");
  document.querySelectorAll("form[name='quote']").forEach(function (form) {
    var page = form.querySelector("input[name='page']");
    if (page) page.value = window.location.pathname;
    // Phone or email: at least one. A custom message on Phone makes the browser stop the send and say so.
    var phone = form.querySelector("input[name='phone']");
    var email = form.querySelector("input[name='email']");
    if (phone && email) {
      var syncReach = function () {
        phone.setCustomValidity(phone.value.trim() || email.value.trim() ? "" : "Please enter a phone number or an email.");
      };
      phone.addEventListener("input", syncReach);
      email.addEventListener("input", syncReach);
      syncReach();
    }
    if (coupon) {
      var input = form.querySelector("input[name='coupon']");
      if (input) input.value = coupon.slice(0, 120);
      var note = form.querySelector(".quote-coupon");
      if (note) { note.hidden = false; note.querySelector("span").textContent = coupon.slice(0, 120); }
    }
  });

  // ---- Map: Google's embed pulls in about 17 requests, so add it after the page has loaded and only
  // when its box is about to scroll into view. Phones start native lazy iframes far too early. ----
  function addMaps() {
    document.querySelectorAll("[data-map-src]").forEach(function (box) {
      function load() {
        var frame = document.createElement("iframe");
        frame.src = box.getAttribute("data-map-src");
        frame.title = box.getAttribute("data-map-title") || "Map";
        frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
        box.replaceChildren(frame);
      }
      if (!("IntersectionObserver" in window)) { load(); return; }
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); load(); }
      }, { rootMargin: "300px 0px" });
      io.observe(box);
    });
  }
  if (document.readyState === "complete") addMaps();
  else window.addEventListener("load", addMaps);
})();
