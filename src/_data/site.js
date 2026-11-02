// Site-wide constants. Business facts live in Airtable (Business Info), not here.
const TZ = "America/Chicago";

function chicagoToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

const url = process.env.URL && process.env.CONTEXT === "production" ? process.env.URL : "https://fargotire.com";

export default {
  url,
  // Until fargotire.com points at Netlify, production lives at *.netlify.app: keep that out of search results.
  preLaunch: new URL(url).hostname.endsWith(".netlify.app"),
  tz: TZ,
  // PREVIEW_DATE=YYYY-MM-DD (local testing only) pretends today is that date, at build and in the browser.
  today: process.env.PREVIEW_DATE || chicagoToday(),
  previewDate: process.env.PREVIEW_DATE || "",
  previewTime: process.env.PREVIEW_TIME || "",
  showSamples: process.env.SHOW_SAMPLES === "1",
  year: new Date().getFullYear()
};
