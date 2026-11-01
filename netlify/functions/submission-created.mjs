// Runs automatically after every verified Netlify Forms submission.
// Copies "quote" form submissions into the Airtable Leads table.
// Email notices come from Netlify's own form notification (set in the Netlify UI), not from here.
// Needs AIRTABLE_TOKEN (data.records:write) and AIRTABLE_BASE_ID.

const pick = (data, key) => (typeof data[key] === "string" ? data[key].trim() : "");

// Classic (v1) handler: Netlify event functions receive the submission as JSON in event.body.
export const handler = async (event) => {
  const { payload } = JSON.parse(event.body || "{}");
  if (!payload || payload.form_name !== "quote") return { statusCode: 200, body: "ignored" };

  const data = payload.data || {};
  const token = process.env.AIRTABLE_TOKEN;
  const base = process.env.AIRTABLE_BASE_ID;
  if (!token || !base) {
    console.error("submission-created: AIRTABLE_TOKEN or AIRTABLE_BASE_ID missing; lead not copied to Airtable.");
    return { statusCode: 500, body: "missing config" };
  }

  // File uploads arrive as an object with a url. If it can't be attached, keep the link in Message.
  const photo = data.photo && typeof data.photo === "object" && data.photo.url ? data.photo : null;
  let message = pick(data, "message");

  const fields = {
    "Name": pick(data, "name") || "(no name)",
    "Phone": pick(data, "phone"),
    "Email": pick(data, "email"),
    "Contact Pref": pick(data, "contact_pref") || undefined,
    "Need": pick(data, "need") || undefined,
    "Vehicle or Equipment": pick(data, "vehicle"),
    "Tire Size": pick(data, "tire_size"),
    "Quantity": Number.parseInt(pick(data, "quantity"), 10) || undefined,
    "Coupon": pick(data, "coupon"),
    "Page": pick(data, "page"),
    "Received": payload.created_at || new Date().toISOString(),
    "Status": "New"
  };
  if (photo) fields["Photo"] = [{ url: photo.url, filename: photo.filename || "sidewall-photo" }];
  fields["Message"] = message;

  const post = (body) => fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent("Leads")}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ records: [{ fields: body }], typecast: true })
  });

  let res = await post(fields);
  if (!res.ok && photo) {
    // Retry without the attachment, keeping the photo link in Message.
    delete fields["Photo"];
    fields["Message"] = `${message}\n\nPhoto: ${photo.url}`.trim();
    res = await post(fields);
  }
  if (!res.ok) {
    console.error("submission-created: Airtable error", res.status, await res.text());
    return { statusCode: 502, body: "airtable error" };
  }
  return { statusCode: 200, body: "ok" };
};
