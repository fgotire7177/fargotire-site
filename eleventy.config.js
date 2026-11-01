import markdownIt from "markdown-it";

try { process.loadEnvFile(); } catch { /* no .env file: fine */ }

const md = markdownIt({ html: false, linkify: true, typographer: false });

// AP-style month abbreviations: Jan. Feb. March April May June July Aug. Sept. Oct. Nov. Dec.
const AP_MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parts(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, dow };
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "assets/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js" });
  for (const w of [400, 500, 600, 700]) {
    eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/barlow/files/barlow-latin-${w}-normal.woff2`]: `fonts/barlow-${w}.woff2` });
  }
  for (const w of [600, 700, 800]) {
    eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-${w}-normal.woff2`]: `fonts/barlow-condensed-${w}.woff2` });
  }

  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("paras", (s) => String(s || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean));
  eleventyConfig.addFilter("lines", (s) => String(s || "").split(/\n/).map((p) => p.trim()).filter(Boolean));
  eleventyConfig.addFilter("apDate", (iso) => { if (!iso) return ""; const p = parts(iso); return `${AP_MONTHS[p.m - 1]} ${p.d}, ${p.y}`; });
  eleventyConfig.addFilter("dayDate", (iso) => { if (!iso) return ""; const p = parts(iso); return `${DAYS[p.dow]}, ${AP_MONTHS[p.m - 1]} ${p.d}`; });
  eleventyConfig.addFilter("shortDayDate", (iso) => { if (!iso) return ""; const p = parts(iso); return `${DAYS[p.dow].slice(0, 3)}, ${AP_MONTHS[p.m - 1]} ${p.d}`; });
  eleventyConfig.addFilter("tel", (phone) => "+1" + String(phone || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v ?? null).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("absUrl", (p, base) => new URL(p || "/", base).toString());
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("whereEq", (arr, key, val) => (arr || []).filter((x) => x[key] === val));
  eleventyConfig.addFilter("isoNow", () => new Date().toISOString());

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
