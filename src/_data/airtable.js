// Loads every Airtable table once per build. Without AIRTABLE_TOKEN and AIRTABLE_BASE_ID it
// falls back to airtable/seed.json so local builds and deploy previews still work.
// Budget: Airtable Free allows 1,000 API calls a month. This file makes one call per table
// (plus one per extra 100 rows). Never call Airtable from templates.
import fs from "node:fs/promises";
import Image from "@11ty/eleventy-img";
import site from "./site.js";

const TABLES = ["Business Info", "Hours", "Special Hours", "Coupons", "Services", "Who We Serve", "Why Us", "Brands", "Blog Posts", "FAQ", "Site Text", "Site Images"];
const SAMPLE_TABLES = new Set(["Coupons", "Special Hours", "Blog Posts"]);
const CATEGORY_ORDER = ["Tires", "Commercial", "Farm", "On-Site", "Service & Repair"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const AP_MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

async function fetchTable(base, token, table) {
  const rows = [];
  let offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Airtable "${table}" failed: ${res.status} ${await res.text()}`);
    const json = await res.json();
    rows.push(...json.records.map((r) => ({ id: r.id, ...r.fields })));
    offset = json.offset;
  } while (offset);
  return rows;
}

// `npm run dev` and `npm run samples` rebuild on every save, which would cost 12 calls each time.
// While serving or watching, reuse the last read for 30 minutes. Plain builds (Netlify) always read fresh.
const CACHE_FILE = new URL("../../.cache/airtable.json", import.meta.url);
const CACHE_MINUTES = 30;

async function load() {
  const token = process.env.AIRTABLE_TOKEN;
  const base = process.env.AIRTABLE_BASE_ID;
  if (token && base) {
    const watching = ["serve", "watch"].includes(process.env.ELEVENTY_RUN_MODE);
    if (watching) {
      try {
        const cached = JSON.parse(await fs.readFile(CACHE_FILE, "utf8"));
        const age = Math.round((Date.now() - cached.savedAt) / 60000);
        if (cached.base === base && age < CACHE_MINUTES) {
          console.log(`[airtable] Using Airtable data read ${age} min ago (delete .cache/airtable.json to read again).`);
          return { source: "airtable", raw: cached.raw };
        }
      } catch { /* no cache yet */ }
    }
    const raw = {};
    for (const t of TABLES) raw[t] = await fetchTable(base, token, t);
    console.log(`[airtable] Read ${TABLES.length} tables from Airtable.`);
    if (watching) {
      await fs.mkdir(new URL("./", CACHE_FILE), { recursive: true });
      await fs.writeFile(CACHE_FILE, JSON.stringify({ base, savedAt: Date.now(), raw }));
    }
    return { source: "airtable", raw };
  }
  const raw = JSON.parse(await fs.readFile(new URL("../../airtable/seed.json", import.meta.url), "utf8"));
  console.log("[airtable] AIRTABLE_TOKEN or AIRTABLE_BASE_ID not set: using airtable/seed.json." + (site.showSamples ? " SHOW_SAMPLES is on." : ""));
  return { source: "seed", raw };
}

// ---------- helpers ----------
const byOrder = (a, b) => (a.Order ?? 9999) - (b.Order ?? 9999);
const first = (att) => (Array.isArray(att) && att.length ? att[0] : null);
const slug = (s) => String(s || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function toMinutes(t) {
  const m = String(t || "").trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s*m?\.?$/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (/p/i.test(m[3])) h += 12;
  return h * 60 + Number(m[2] || 0);
}

function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function dayDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAY_NAMES[dow]}, ${AP_MONTHS[m - 1]} ${d}`;
}

function money(n) {
  return Number.isInteger(n) ? String(n) : Number(n).toFixed(2);
}

function bigLine(c) {
  const n = typeof c.Amount === "number" ? c.Amount : null;
  switch (c["Offer Type"]) {
    case "Dollars Off": return n != null ? `$${money(n)} OFF` : "SPECIAL";
    case "Percent Off": return n != null ? `${money(n)}% OFF` : "SPECIAL";
    case "Special Price": return n != null ? `$${money(n)}` : "SPECIAL";
    case "Free": return "FREE";
    case "Rebate": return n != null ? `$${money(n)} REBATE` : "REBATE";
    default: return "SPECIAL";
  }
}

function holidayMessage(r) {
  if (r.Message) return r.Message;
  const label = r.Label || "Holiday hours";
  const when = dayDate(r.Date);
  const through = r["End Date"] && r["End Date"] !== r.Date ? ` through ${dayDate(r["End Date"])}` : "";
  switch (r.Type) {
    case "Closed": return `${label}: Closed ${when}${through}.`;
    case "Closing Early": return `${label}: Closing at ${r.Closes} ${when}.`;
    case "Opening Late": return `${label}: Opening at ${r.Opens} ${when}.`;
    case "Special Hours": return `${label}: Open ${r.Opens} to ${r.Closes} ${when}.`;
    default: return `${label}: Special hours ${when}.`;
  }
}

// Group Mon..Sun into lines like "Mon to Fri: 7:30 AM to 5:30 PM".
function hoursLines(hours) {
  const order = [1, 2, 3, 4, 5, 6, 0].map((d) => hours.find((h) => h.dow === d)).filter(Boolean);
  const label = (h) => (h.closed ? "Closed" : `${h.opens} to ${h.closes}`);
  const groups = [];
  for (const h of order) {
    const g = groups[groups.length - 1];
    if (g && g.text === label(h)) g.days.push(h);
    else groups.push({ text: label(h), days: [h] });
  }
  return groups.map((g) => {
    const a = g.days[0].day.slice(0, 3);
    const b = g.days[g.days.length - 1].day.slice(0, 3);
    return { days: g.days.length > 1 ? `${a} to ${b}` : a, text: g.text };
  });
}

async function image(att, widths = [480, 960, 1600]) {
  if (!att || !att.url) return null;
  const type = att.type || "";
  const isSvg = type.includes("svg") || /\.svg$/i.test(att.filename || "");
  const formats = isSvg ? ["svg"] : type.includes("png") ? ["webp", "png"] : ["webp", "jpeg"];
  try {
    const meta = await Image(att.url, {
      widths: isSvg ? ["auto"] : widths,
      formats,
      outputDir: "_site/media/",
      urlPath: "/media/",
      svgShortCircuit: true,
      filenameFormat: (id, src, width, format) => `${att.id || id}-${width}.${format}`,
      cacheOptions: { duration: "1d" }
    });
    const fallback = formats[formats.length - 1];
    const fb = meta[fallback];
    const big = fb[fb.length - 1];
    return {
      src: big.url,
      width: big.width,
      height: big.height,
      srcset: fb.map((e) => e.srcset).join(", "),
      type: fb[0].sourceType,
      sources: formats.slice(0, -1).map((f) => ({ type: meta[f][0].sourceType, srcset: meta[f].map((e) => e.srcset).join(", ") }))
    };
  } catch (e) {
    console.warn(`[airtable] Image skipped (${att.filename || att.url}): ${e.message}`);
    return null;
  }
}

// ---------- main ----------
export default async function () {
  const { source, raw } = await load();
  const today = site.today;
  const rows = (t) => raw[t] || [];
  const isShown = (t, r) => r.Show === true || (site.showSamples && SAMPLE_TABLES.has(t));
  const shown = (t) => rows(t).filter((r) => isShown(t, r)).sort(byOrder);

  const biz = rows("Business Info")[0] || {};
  const text = Object.fromEntries(rows("Site Text").map((r) => [r.Name, r.Text || ""]));

  const images = {};
  for (const r of rows("Site Images")) images[r.Name] = { img: await image(first(r.Image)), alt: r["Alt Text"] || "" };

  const hours = rows("Hours").slice().sort(byOrder).map((r) => ({
    day: r.Day,
    dow: DAY_NAMES.indexOf(r.Day),
    opens: r.Opens || "",
    closes: r.Closes || "",
    closed: Boolean(r.Closed) || !r.Opens || !r.Closes,
    note: r.Note || "",
    openMin: toMinutes(r.Opens),
    closeMin: toMinutes(r.Closes)
  }));

  const special = shown("Special Hours")
    .filter((r) => r.Date)
    .map((r) => {
      const end = r["End Date"] || r.Date;
      const lead = Number.isFinite(r["Show From Days"]) ? r["Show From Days"] : 14;
      return {
        label: r.Label || "",
        type: r.Type || "Closed",
        date: r.Date,
        end,
        start: addDays(r.Date, -lead),
        opens: r.Opens || "",
        closes: r.Closes || "",
        openMin: toMinutes(r.Opens),
        closeMin: toMinutes(r.Closes),
        message: holidayMessage(r),
        live: r.Date && addDays(r.Date, -lead) <= today && today <= end,
        sample: r.Show !== true
      };
    })
    .filter((r) => r.end >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const coupons = shown("Coupons")
    .filter((c) => !c.Expires || c.Expires >= today)
    .sort((a, b) => byOrder(a, b) || String(a.Expires || "9999").localeCompare(String(b.Expires || "9999")))
    .map((c, i) => ({
      id: `coupon-${slug(c["Applies To"] || c.Title)}-${i + 1}`,
      big: bigLine(c),
      appliesTo: c["Applies To"] || c.Title || "",
      details: c.Details || "",
      finePrint: c["Fine Print"] || "",
      starts: c.Starts || "",
      expires: c.Expires || "",
      featured: Boolean(c.Featured),
      // A special (like a manufacturer rebate) is something to ask about, not a printable coupon.
      // Kind wins when set; a blank Kind means Special for Rebates and Coupon for everything else.
      special: c.Kind === "Special" || (!c.Kind && c["Offer Type"] === "Rebate"),
      sample: c.Show !== true,
      requestLabel: `${bigLine(c)} ${c["Applies To"] || c.Title || ""}`.trim()
    }));

  const services = [];
  for (const r of shown("Services").filter((s) => s.Slug)) {
    // Up to 2 photos, shown side by side in the field's order. Photo Alt holds one description per photo, split by " | ".
    const photos = [];
    for (const att of (r.Photo || []).slice(0, 2)) {
      const img = await image(att);
      if (img) photos.push(img);
    }
    const alts = (r["Photo Alt"] || "").split(" | ").map((a) => a.trim());
    services.push({
      name: r.Name,
      slug: r.Slug,
      url: `/services/${r.Slug}/`,
      category: r.Category || "Service & Repair",
      summary: r.Summary || "",
      body: (r.Body || "").trim(),
      photo: photos[0] || null,
      photoAlt: alts[0],
      // ratio (width / height) sizes each photo's column, so 2 photos share one row at the same height, each whole.
      photos: photos.map((img, i) => ({ img, alt: alts[i] || alts[0], ratio: +(img.width / img.height).toFixed(3) })),
      searchTitle: r["Search Title"] || "",
      searchDescription: r["Search Description"] || ""
    });
  }
  const serviceGroups = CATEGORY_ORDER.map((name) => ({ name, items: services.filter((s) => s.category === name) })).filter((g) => g.items.length);

  const serve = [];
  for (const r of shown("Who We Serve")) serve.push({ title: r.Title, summary: r.Summary || "", link: r.Link || "/services/", photo: await image(first(r.Photo), [480, 960]), photoAlt: r["Photo Alt"] || "" });

  const brands = [];
  for (const r of shown("Brands")) brands.push({ name: r.Brand, link: r.Link || "", logo: await image(first(r.Logo), [320]) });

  const posts = [];
  for (const r of shown("Blog Posts").filter((p) => p.Address)) {
    posts.push({
      title: r.Title,
      address: r.Address,
      url: `/blog/${r.Address}/`,
      date: r.Date || "",
      category: r.Category || "",
      summary: r.Summary || "",
      text: (r.Text || "").trim(),
      cover: await image(first(r["Cover Photo"])),
      coverAlt: r["Cover Photo Alt"] || "",
      searchTitle: r["Search Title"] || "",
      searchDescription: r["Search Description"] || "",
      sample: r.Show !== true
    });
  }
  posts.sort((a, b) => (b.date || "0000").localeCompare(a.date || "0000"));

  const shownPostAddresses = new Set(posts.map((p) => p.address));
  const shownServiceSlugs = new Set(services.map((s) => s.slug));
  // Airtable rich text comes back with a trailing newline; trim it so it stays out of JSON-LD.
  const faq = shown("FAQ").map((r) => ({ q: r.Question, a: (r.Answer || "").trim() }));

  // ---- Structured data (search engines and AI search) ----
  const hhmm = (min) => (min == null ? null : `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`);
  const regular = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return hours.find((h) => h.dow === new Date(Date.UTC(y, m - 1, d)).getUTCDay() && !h.closed);
  };
  const shareImg = images.share_image && images.share_image.img ? new URL(images.share_image.img.src, site.url).toString() : `${site.url}/assets/icon-512.png`;
  const businessLd = {
    "@context": "https://schema.org",
    "@type": ["TireShop", "AutoRepair"],
    "@id": `${site.url}/#business`,
    name: biz.Name,
    legalName: biz["Legal Name"] || undefined,
    slogan: biz.Tagline || undefined,
    url: `${site.url}/`,
    telephone: biz.Phone,
    faxNumber: biz.Fax || undefined,
    email: biz["Public Email"] || undefined,
    foundingDate: biz.Founded ? String(biz.Founded) : undefined,
    logo: `${site.url}/assets/icon-512.png`,
    image: shareImg,
    address: { "@type": "PostalAddress", streetAddress: biz.Street, addressLocality: biz.City, addressRegion: biz.State, postalCode: biz.ZIP, addressCountry: "US" },
    areaServed: biz["Service Area"] || undefined,
    sameAs: [biz["Google Business Profile"], biz.Facebook].filter(Boolean),
    openingHoursSpecification: hours.filter((h) => !h.closed).map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${h.day}`, opens: hhmm(h.openMin), closes: hhmm(h.closeMin) })),
    specialOpeningHoursSpecification: special.filter((s) => !s.sample).map((s) => {
      const base = regular(s.date);
      let opens = "00:00", closes = "00:00";
      if (s.type === "Closing Early") { opens = hhmm(base ? base.openMin : s.openMin); closes = hhmm(s.closeMin); }
      else if (s.type === "Opening Late") { opens = hhmm(s.openMin); closes = hhmm(base ? base.closeMin : s.closeMin); }
      else if (s.type === "Special Hours") { opens = hhmm(s.openMin); closes = hhmm(s.closeMin); }
      return { "@type": "OpeningHoursSpecification", validFrom: s.date, validThrough: s.end, opens, closes };
    })
  };
  // Answers are markdown on the page; structured data gets plain text ("[waiting room](/waiting-room/)" becomes "waiting room").
  const plain = (s) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })) };

  return {
    source,
    biz,
    text,
    images,
    hours,
    hoursLines: hoursLines(hours),
    special,
    holidayLive: special.some((s) => s.live),
    coupons: coupons.filter((c) => !c.special),
    specials: coupons.filter((c) => c.special),
    featured: coupons.filter((c) => c.featured),
    services,
    serviceGroups,
    serve,
    whyUs: shown("Why Us").map((r) => ({ title: r.Title, text: r.Text || "", icon: r.Icon || "tire" })),
    brands,
    posts,
    faq,
    businessLd,
    faqLd,
    hiddenServices: rows("Services").filter((r) => r.Slug && !shownServiceSlugs.has(r.Slug)).map((r) => r.Slug),
    hiddenPosts: rows("Blog Posts").filter((r) => r.Address && !shownPostAddresses.has(r.Address)).map((r) => r.Address),
    clientHours: {
      tz: site.tz,
      previewDate: site.previewDate,
      previewTime: site.previewTime,
      week: hours.map((h) => ({ dow: h.dow, open: h.closed ? null : h.openMin, close: h.closed ? null : h.closeMin })),
      special: special.map((s) => ({ date: s.date, end: s.end, type: s.type, open: s.openMin, close: s.closeMin, label: s.label }))
    }
  };
}
