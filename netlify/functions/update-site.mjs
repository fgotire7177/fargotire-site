// The "Update website" button in Airtable opens /.netlify/functions/update-site?key=...
// It starts a new production build so Airtable changes go live. Each build costs Netlify
// credits (15 on the Free plan, 300 a month), so it waits for a click instead of running on a timer.
// Needs NETLIFY_BUILD_HOOK_URL and UPDATE_SITE_KEY.

const page = (title, body, status = 200) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:0 20px;color:#1F2328;line-height:1.5}h1{font-size:28px;margin:0 0 8px}</style></head>
<body><h1>${title}</h1><p>${body}</p></body></html>`,
  { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
);

export default async (req) => {
  const key = new URL(req.url).searchParams.get("key");
  if (!process.env.UPDATE_SITE_KEY || key !== process.env.UPDATE_SITE_KEY) {
    return page("Not allowed", "This link is missing its key. Use the Update website button in Airtable.", 403);
  }
  if (!process.env.NETLIFY_BUILD_HOOK_URL) {
    return page("Not set up yet", "The build hook isn't configured in Netlify. Ask Jay.", 500);
  }
  const res = await fetch(process.env.NETLIFY_BUILD_HOOK_URL, { method: "POST", body: "{}" });
  if (!res.ok) return page("Something went wrong", `Netlify answered ${res.status}. Try again in a minute.`, 502);
  return page("Website update started", "It will be live in about a minute. You can close this tab.");
};
