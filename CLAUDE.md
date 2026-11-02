# Fargo Tire Service website (fargotire.com)

Rebuild of fargotire.com for Fargo Tire Service, 2020 Main Ave, Fargo, ND 58103. Jay Manley is building it, then handing it over fully to the owner, Paul, who runs the shop with his brother Roger. Paul is not technical. Everything he will ever change lives in Airtable, so code changes after handoff should be rare.

Read `docs/PLAN.md` for the full audit, decisions and handoff plan. This file is the working brief.

## What Paul asked for

- A better, more professional look than the last vendor's site.
- Specials called out, and coupons he can add and remove easily, including by telling Claude ("$20 off an alignment, good through Dec 31").
- A banner for holiday hours (closed, closing early, opening late).
- An informational blog, like Jay's Land Buying Guide on dakotaskyhook.com.
- A way to request a quote or ask about tires and services. No job application.

## Stack

Same pattern as Jay's dakotaskyhook.com (GitHub repo `jmanley966/dakotaskyhook-site`). If you can read that repo, reuse its patterns instead of reinventing them: the Eleventy build that pulls Airtable, attachment downloading, the `update-site` and `submission-created` Netlify functions, `_redirects`/headers setup and IndexNow.

- Eleventy 3, Nunjucks templates, plain CSS with custom properties, a little vanilla JS. No client-side framework.
- Airtable is the CMS. Schema: `airtable/schema.json`. Starter records: `airtable/seed.json`.
- Netlify: hosting, Netlify Forms, Functions (Node 22).
- GitHub: one branch and PR per milestone. Deploy previews are free; production deploys cost credits (see Limits).

## Status (Nov. 1, 2026)

Built in Cowork and tested against the seed data at 390px, 1024px, 1200px and 1440px wide:
- Every page, plus the header, footer, utility bar, holiday bar and quote form.
- The open-now logic in Chicago time, coupon expiry, the phone menu and the sticky Call/Quote bar.
- JSON-LD, sitemap, robots and `_redirects`.
- Both Netlify functions. `submission-created` was tested with a mocked Airtable; `update-site` has not been run yet.
- `scripts/airtable-setup.mjs`.

Since then (Nov. 2, 2026):
- The repo is on GitHub at `fgotire7177/fargotire-site`.
- The Airtable base "Fargo Tire Service Website" (`app0Uq2vOASSgJXvu`, workspace `wspgEJFdTL9Nc4hm6`, shop's account) was created by `npm run airtable:setup` and holds the seed. A build from it costs 12 API calls (one per table) and matches the seed build page for page. The only exception is the order of undated hidden blog posts, which is whatever order Airtable returns.

- The Netlify project `fargotire-site` (shop's team) deploys `main` to https://fargotire-site.netlify.app. Production visitor access must stay public; protect previews only. Tested Nov. 2: pages, redirects and headers; a quote with a photo landed in Leads with the photo attached; the Update website link started a hook deploy.

Not yet run against real services:
- No real attachments have gone through the image pipeline.

Continue Milestone 4 (Airtable buttons, IndexNow) in the list at the bottom.

## Repo layout (as built)

```
eleventy.config.js       filters (dates, money, markdown), passthrough for assets, fonts, css, js
src/
  _data/airtable.js      reads all tables once per build (seed fallback), images, hours/holiday/coupon logic, JSON-LD
  _data/site.js          URL, time zone, today's date in Chicago, PREVIEW_DATE, SHOW_SAMPLES
  _includes/layouts/base.njk
  _includes/partials/    holiday-bar, utility-bar, header, footer, coupons (macros), quote-form, find-us, icons (macros)
  css/                   tokens.css (all colors and fonts), site.css, print.css
  js/site.js             open-now line, holiday bar, coupon expiry, print coupon, phone menu, coupon prefill
  index.njk coupons.njk hours.njk about-us.njk contact-us.njk faq.njk thanks.njk 404.njk
  services/ (index + one page per row)   blog/ (index + one page per post)
  sitemap.njk robots.njk redirects.njk
netlify/functions/       submission-created.mjs (form to Airtable Leads), update-site.mjs (Update website button), deploy-succeeded.mjs (IndexNow)
netlify.toml             build, Node 22, headers
scripts/airtable-setup.mjs   creates the base from airtable/schema.json and loads airtable/seed.json
assets/                  tire man art and icons, copied to /assets/
design/                  approved mockup: static HTML, screenshots, canvas source
```

Local commands:
- `npm run dev` serves with whatever data is available.
- `npm run samples` also shows the SAMPLE coupons, holiday rows and blog posts.
- `PREVIEW_DATE=2026-11-26 PREVIEW_TIME=08:00 npm run samples` pretends it's that day in Chicago, for testing the holiday bar and open-now line.

## Data loading

- `src/_data/airtable.js` reads every table at build with `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID`. If either is missing, load `airtable/seed.json` and log that it did, so local dev and deploy previews work without credentials.
- Keep rows with Show ticked; sort by Order.
- Download attachments at build and serve them from the site. Airtable attachment URLs expire after a couple of hours, so never hotlink them. Resize with `@11ty/eleventy-img` (WebP plus JPEG, about 480/960/1600 wide) and cache between builds.
- Airtable Free allows 1,000 API calls per month per workspace. A build costs one call per table (12 today) plus pagination. Never fetch per page, never poll.
- `npm run dev` and `npm run samples` rebuild on every save, so while serving or watching, `airtable.js` reuses its last read from `.cache/airtable.json` for 30 minutes. Delete that file to read again. Plain builds, including Netlify's, always read fresh.

- Seed rows marked SAMPLE (Coupons, Special Hours) and the planned Blog Posts have Show unticked. The nitrogen post (`nitrogen-tire-inflation`) is written and shown. With `SHOW_SAMPLES=1`, local builds treat hidden rows in those three tables as shown, so layouts can be checked. Never set it on Netlify.

Environment variables (document in `.env.example`, never commit values): `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_WORKSPACE_ID` (setup script only), `NETLIFY_BUILD_HOOK_URL`, `UPDATE_SITE_KEY`, and the local-only `SHOW_SAMPLES`, `PREVIEW_DATE`, `PREVIEW_TIME`.

The tire man is a repo asset (`assets/tireboy.svg`), not an Airtable image, so it can't be deleted by accident.

## Pages and URLs

Keep the old WordPress slugs where they exist.

| URL | Page |
|---|---|
| `/` | Home |
| `/coupons/` | Specials and coupons (nav label "Specials") |
| `/hours/` | Hours and location (new) |
| `/services/` and `/services/<Slug>/` | Services index and one page per shown Services row |
| `/about-us/` | History (Site Text `about_history`), Why Us, photo |
| `/contact-us/` | Quote form, map, phones, address |
| `/blog/` and `/blog/<Address>/` | Blog list and posts |
| `/faq/` | FAQ |

Redirects (301): `/employment/` to `/contact-us/`; `/specials/` to `/coupons/`; `/wp-admin/*`, `/wp-login.php`, `/wp-content/*`, `/feed/*` to `/`; hidden blog posts to `/blog/`; hidden services to `/services/`.

## Design

- Match `design/mockup/*.html` and the screenshots next to them. That is the approved look. Layout follows Sullivan Tire's homepage structure; the coupons page follows Pugh's Tire. Never copy their words, photos, colors or logos.
- The name is **Fargo Tire Service**, written exactly that way in page text. The logo name in the header and footer is "Fargo Tire Service Inc." (Paul's own lockup, no comma). "Fargo Tire Service, Inc." appears only in the footer copyright and JSON-LD `legalName`.
- Fonts, all self-hosted from `@fontsource`:
  - Rouge Script, bolded, for the logo name.
  - Dancing Script 600 for the tagline (the home page h1) and the motto.
  - Barlow Condensed 600/700/800 for headings and buttons (uppercase); Barlow 400 to 700 for body.
  - Preload Barlow 400, Barlow Condensed 800 and Rouge Script on every page, plus Dancing Script on the home page.
- Every color lives in `tokens.css`. Paul's colors are king blue and white: `--blue #152A78` is Oracal 651 #049 King blue (sRGB 21, 42, 120), chosen Nov. 2, 2026. Others: `--red #C62828`, `--ink #24292E`, `--white #FFFFFF`, `--gray-50 #F3F4F6`, `--gray-200 #D9DDE2`, `--border #E3E6EA`, `--muted #4B5563`.
- Use red sparingly (Jay, Nov. 2): only the Request a Quote / Send request buttons, coupon amounts, the holiday bar and the Closed tag. Everything else that was red is blue.
- The tire man (`assets/tireboy.svg`) is black line art with no fill, so he always sits on a white circle with a King blue ring (`assets/tireboy-badge.svg`, or a CSS circle around the SVG). Never put him straight onto blue or charcoal. The PNG and ICO icons are rendered from `assets/favicon.svg`.
- Paul's logo fonts are French Script (bold) for the name, written "Fargo Tire Service Inc.", and Freestyle Script for "Boy! Have we got tires!" and the motto "After the sales, it's our service that counts." Their Office licenses don't cover the web, so the site uses free look-alikes, chosen by Jay on Nov. 2: Rouge Script and Dancing Script. The comparison is in `design/font-options.html`. Script is for those three lines only; everything else stays Barlow. He appears in the header (about 60px), the home hero (about 380px, to the left of the tagline so his arm points at it), the footer (about 96px), and as the favicon and app icons (`assets/favicon.*`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`).
- Tagline "Boy! Have we got tires!" and Motto "After the sales, it's our service that counts." come from Business Info. The motto shows under the tagline on the home page and in the footer.
- Phone layout changes from the mockup, which used placeholders here:
  1. Header nav becomes a Menu button that opens a full-width panel.
  2. The home specials strip becomes a horizontal scroll-snap row, so the hero isn't pushed 1,000px down.
  3. A sticky bottom bar with Call and Request a Quote, with page padding so it never covers content.
- Accessibility: text contrast at least 4.5:1, never disable zoom, touch targets at least 44px, visible focus styles, real buttons and labels, alt text on every image.
- Copy rules: plain and friendly, no em dashes, no hype, numerals for numbers. Never invent facts (prices, hours, services, years, claims). If something isn't in Airtable or the seed, ask Jay.

## Behavior specs

### Open-now line (utility bar)

Computed in the browser in the shop's time zone, `America/Chicago`, using `Intl.DateTimeFormat` with `timeZone`. Never use the visitor's local time. The build embeds Hours and Special Hours as JSON. Outputs:

- `Open now · Closes 5:30 PM`
- `Opens today at 7:30 AM`
- `Closed now · Opens Mon at 7:30 AM` (or `tomorrow`)
- `Closed today for Thanksgiving · Opens tomorrow at 7:30 AM`

`design/canvas-source/Main.dc.html` (`openStatus()`) is a working reference, but it uses local time; fix that. Without JS, show the regular weekly hours.

### Holiday bar (top of every page)

- A Special Hours row shows when Show is ticked and today in Chicago falls between (Date minus Show From Days, default 14) and (End Date or Date).
- Several at once: one line each, soonest first, at most 2, then a "More holiday hours" link to `/hours/`.
- Text is Message if filled. Otherwise:
  - Closed: `Thanksgiving: Closed Thursday, Nov. 26.`
  - Closing Early: `Christmas Eve: Closing at 12:00 PM Thursday, Dec. 24.`
  - Opening Late: `Label: Opening at 10:00 AM Weekday, Mon. D.`
  - Special Hours: `Label: Open 9:00 AM to 1:00 PM Weekday, Mon. D.`
- Render rows at build with `data-start` and `data-end`; JS hides any outside their window, so nothing needs a rebuild to expire. The build also drops rows whose end date has passed.

### Coupons

- Big line from Offer Type and Amount: `$20 OFF`, `10% OFF`, `$49.95`, `FREE`. Whole amounts show no decimals.
- Card: big line, Applies To as the headline, Details, Fine Print (small), `Valid through Nov. 30, 2026`.
- Visible when Show is ticked and Starts (if set) is on or before today, and today is on or before Expires, in Chicago. Render `data-starts` and `data-expires` so JS hides expired and not-yet-started coupons without a rebuild.
- Home strip: Featured coupons, up to 3, by Order then Expires.
- `/coupons/`: the first Featured coupon as the large featured card, then a grid of all visible coupons with dashed borders.
- When nothing is visible: "No specials posted right now. Call (701) 232-7177 for today's deals."
- Each coupon gets "Print coupon" (a print stylesheet that prints only that coupon) and "Request this special" (links to `/contact-us/?coupon=<title>#quote`, which fills the hidden Coupon field).
- Production never shows "Sample" badges. Sample rows in the seed have Show unticked.

### Quote form

- Netlify Form named `quote`, with a honeypot (`netlify-honeypot="bot-field"`). It appears on `/contact-us/` and at the bottom of the home page. Use the same name and fields in both places.
- Fields, matching the Leads table:
  - Name, Phone, Email
  - Contact Pref (Call/Text/Email)
  - Need (select)
  - Vehicle or Equipment, Tire Size, Quantity
  - Photo (one image, optional)
  - Message
  - Coupon (hidden), Page (hidden)
- Netlify only captures fields present in the built HTML, so no JS-added fields.
- `submission-created` creates a Leads record: Received = now, Status = New, Page and Coupon filled. If the photo can't be attached cleanly, store its link in Message instead.
- Email notices come from an Airtable automation in the website base, "Email new quote requests": when a Leads record is created, a Microsoft Outlook "Send email" step sends the lead's fields and record link from web@fargotire.com to itself. Netlify's own form email notices need its Pro plan, so they aren't used. No email code. Tested end to end Nov. 2, 2026. It uses Airtable automation runs (100 a month on Free).
- After sending, show the Site Text `quote_thanks` message.
- Add reCAPTCHA only if spam shows up.

### Publishing

- `update-site` function: called with `?key=UPDATE_SITE_KEY`, it POSTs to `NETLIFY_BUILD_HOOK_URL` and returns a small page saying "Website update started. It will be live in about a minute." Coupons, Special Hours, Blog Posts and Business Info each have an "Update Website" button field (Open URL, added by hand Nov. 2, 2026; the API can't create or read buttons) pointing at `https://fargotire-site.netlify.app/.netlify/functions/update-site?key=...`. If `UPDATE_SITE_KEY` ever changes, update all 4 buttons. After launch they can point at fargotire.com instead.
- Optional, verify on the shop's Free Airtable plan: an automation on Coupons and Special Hours (record created, or Show changed) that runs a script calling the build hook. Free allows 100 automation runs a month.
- No scheduled rebuilds. Expiry is handled in the browser.

### Coupons and holiday hours by talking to Claude (later milestone)

Write `docs/paul-claude-instructions.md`: a short skill or instruction set for Paul's own Claude, which uses the Airtable connector.

- Adding: it asks only for what's missing (what it's on, dollars off / percent off / special price / free, the amount, expiry, optional details, fine print, featured). It writes a Coupons row with Show ticked, then tells Paul to click Update website (or triggers the automation).
- Removing: it unticks Show.
- Special Hours work the same way.

## SEO and AI search

- JSON-LD on every page with `@type: ["TireShop", "AutoRepair"]`:
  - name, legalName, url, telephone, address, geo, foundingDate 1950
  - openingHoursSpecification from Hours, specialOpeningHoursSpecification from visible Special Hours
  - logo, image, sameAs (Google Business Profile, Facebook)
- Other markup: FAQPage on `/faq/`, BlogPosting on posts, Service on service pages, BreadcrumbList on inner pages.
- Each page gets its own title and meta description, plus a canonical URL and Open Graph/Twitter tags using `share_image`.
- Title patterns:
  - Home: `Tires in Fargo, ND | Fargo Tire Service`
  - Service pages: `{Service} in Fargo, ND | Fargo Tire Service`
  - Search Title overrides either.
- `sitemap.xml`, `robots.txt` with the sitemap line, and IndexNow on deploy: `netlify/functions/deploy-succeeded.mjs` sends the sitemap's URLs to api.indexnow.org after each production deploy. The key is in `src/_data/indexnow.js` and is served at `/<key>.txt` by `src/indexnow-key.11ty.js`. It's public by design.
- Pre-launch: while production is on `*.netlify.app`, `site.preLaunch` puts `noindex` on every page and the IndexNow function skips. Both switch off by themselves once Netlify's primary domain is fargotire.com, after one redeploy.
- Performance: images sized and lazy-loaded below the fold, no layout shift, fonts preloaded. Target Lighthouse 95+ on mobile.

## Limits that bite

- **Netlify Free:** 300 credits a month, hard cap. A production deploy costs 15. If the credits run out, the site pauses until the next month. Batch merges, review on deploy previews, and keep "Update website" clicks to roughly 15 a month. Pro is $20 a month if needed.
- **Airtable Free:**
  - 1,000 records per base.
  - 1,000 API calls a month per workspace. After a one-time 30-day grace period, calls are blocked.
  - 100 automation runs a month.
  - 5 editors.

## Accounts and handoff

- Put every account in the shop's name from day one, using the shop email web@fargotire.com (backup: paul@fargotire.com):
  - GitHub repo under the shop's account, `fgotire7177`, with Jay as collaborator. Commits are authored as `Fargo Tire Service <web@fargotire.com>`.
  - The shop's own Netlify account, not Jay's Dakota Skyhook team. Free plans have no team seats, and moving a project needs a shared member.
  - The Airtable base in the shop's workspace.
- The `AIRTABLE_TOKEN` used by Netlify must be created by the shop's Airtable user. A token tied to Jay breaks the site the day he is removed.
- Netlify scans the repo and build output for environment variable values and fails the deploy if it finds one. `netlify.toml` omits only `AIRTABLE_BASE_ID` (an ID, not a credential). Never write the token, `UPDATE_SITE_KEY` or the build hook URL into any file in the repo.
- Never use Jay's Dakota Skyhook accounts for anything in this project. The Airtable and Netlify connectors in Jay's Claude are signed in to Dakota Skyhook, so don't use them here. Reach Airtable only with the shop's token in `.env`, and GitHub and Netlify only as the shop's accounts. Reading the `dakotaskyhook-site` code for patterns is fine.
- DNS stays at the current registrar. Check MX records before touching anything, and change only the web records (A/CNAME) so the shop's email keeps working. As of Nov. 1, 2026: DNS is at GoDaddy (`ns09`/`ns10.domaincontrol.com`); email is Microsoft 365 (MX `fargotire-com.mail.protection.outlook.com`, SPF `include:spf.protection.outlook.com -all`, TXT `MS=ms82426383`). Leave all of those alone. Get into the existing Google Search Console property, or re-verify by DNS.
- Before handoff:
  - Replace `README.md` with an owner guide: how to edit in Airtable, Update website, where leads go, who to call.
  - Keep this file current.
  - Follow the handoff checklist in `docs/PLAN.md`.

## How to work

- Ask Jay before inventing any fact. Facts in `airtable/seed.json` came from the current site, its About page and Goodyear's dealer listing.
- One branch and PR per milestone. In each PR, say what to check on the deploy preview.
- Minimal dependencies. No secrets in git. `.env` is in `.gitignore`.
- Test at 390px and 1440px wide before calling anything done.

## Open items (ask Jay)

- Confirm the hours and holiday closures with Paul. They come from Goodyear's listing.
- Logo files, if Paul has any.
- Public email, Google Business Profile URL, Facebook URL. (Quote emails go to web@fargotire.com; see Quote form.)
- The shop's Airtable Team trial ends about Nov. 16, 2026. Afterwards, send one test quote to confirm the Outlook email automation still runs on Free.
- Which Netlify plan the shop's team ended up on (Free: 300 credits; Personal: $9 a month, 1,000 credits). Update Limits to match.
- Photos (drone shots exist; ground shots coming) and dealer logo files.
- GoDaddy (registrar/DNS) and current host access.

## Milestones

1. ~~Scaffold, tokens and partials; Home, Specials and Hours from the seed.~~ Done.
2. ~~Create the Airtable base with `npm run airtable:setup` (shop's token), then confirm a build reads it and log the API call count.~~ Done Nov. 2: 12 calls per build.
3. ~~Services, About, Contact, Blog, FAQ, 404, redirects.~~ Done. Review the copy with Jay.
4. Netlify site and environment variables. Done Nov. 2, plus:
   - ~~a test quote (Leads row plus email notice)~~ done; the email comes from the Airtable automation
   - ~~Update website buttons in Airtable~~ done on all 4 tables
   - ~~test `update-site`~~ done
   - ~~IndexNow on deploy~~ built Nov. 2 (`deploy-succeeded`); it first runs after launch
   - ~~a noindex tag while the site is only on the netlify.app address~~ built Nov. 2
5. Performance and accessibility pass on the deploy preview (Lighthouse mobile), Search Console prep. JSON-LD, sitemap, robots and headers are done.
6. Real content (Nov. 2: King blue, script fonts, motto and Paul's fact fixes done; retreading is offered and shown; the items kept from the old site that Paul didn't list stay, per Jay; first blog post, nitrogen in cold weather, published):
   - photos, logos, coupons, confirmed hours
   - `docs/paul-claude-instructions.md`
   - the owner guide in README.md
   - an optional Airtable interface for Paul
7. Launch: DNS cutover, Search Console, Google Business Profile check, a week of watching, then handoff. After fargotire.com is the primary domain in Netlify, trigger one deploy: that removes the pre-launch noindex, switches canonical URLs and the sitemap to fargotire.com, and runs IndexNow for the first time (check the function log for 200 or 202).
