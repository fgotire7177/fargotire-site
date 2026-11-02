// Runs automatically after every successful deploy. Sends the site's page list to IndexNow,
// so Bing and the other search engines that use it pick up changes quickly.
// Skips deploy previews and the pre-launch *.netlify.app address (that one is noindex anyway).
import indexnow from "../../src/_data/indexnow.js";

// Classic (v1) handler: Netlify event functions receive the deploy as JSON in event.body.
export const handler = async (event) => {
  const { payload } = JSON.parse(event.body || "{}");
  if (!payload || payload.context !== "production") return { statusCode: 200, body: "not production: skipped" };

  const site = payload.ssl_url || payload.url || "";
  const host = site ? new URL(site).hostname : "";
  if (!host || host.endsWith(".netlify.app")) return { statusCode: 200, body: "pre-launch: skipped" };

  const sitemap = await fetch(`https://${host}/sitemap.xml`).then((r) => (r.ok ? r.text() : "")).catch(() => "");
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .filter((u) => { try { return new URL(u).hostname === host; } catch { return false; } });
  if (!urlList.length) {
    console.error(`deploy-succeeded: no URLs found in https://${host}/sitemap.xml`);
    return { statusCode: 200, body: "no urls" };
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: indexnow.key, keyLocation: `https://${host}/${indexnow.key}.txt`, urlList })
  });
  // 200 or 202 means accepted. 403 means the key file at keyLocation didn't match.
  console.log(`deploy-succeeded: IndexNow answered ${res.status} for ${urlList.length} URLs`);
  return { statusCode: 200, body: `indexnow ${res.status}` };
};
