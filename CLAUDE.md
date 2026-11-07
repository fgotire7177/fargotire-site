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

- The Netlify project `fargotire-site` (shop's team) deploys `main` to https://fargotire.com (launched Nov. 7, 2026; before that only https://fargotire-site.netlify.app, which still serves the site). Production visitor access must stay public; protect previews only.

Launch (Nov. 7, 2026):
- 2 records were changed at GoDaddy: A `@` from the old WordPress host's 208.65.99.164 to Netlify's 75.2.60.5, and CNAME `www` from `@` to `fargotire-site.netlify.app`. NS, MX, both TXT and the `autodiscover` CNAME were left as they were, and checked unchanged afterwards.
- fargotire.com was then added in Netlify as the primary domain, so www.fargotire.com redirects to it. Netlify's certificate covering both names was issued at 3:27 PM.
- The deploy right after it (the "Farm" rename) turned off pre-launch mode.
- Netlify recommends www as primary when DNS stays elsewhere (the apex A record skips part of its CDN). For a local shop the bare domain is fine; switching later is one Netlify setting plus one deploy. Tested Nov. 2: pages, redirects and headers; a quote with a photo landed in Leads with the photo attached; the Update website link started a hook deploy.

Image pipeline (Nov. 5, 2026): all 7 shown Brands rows have a PNG in Logo (from Jay; the Toyo file arrived white on transparent and was made black so it shows on the white tiles). A local build from Airtable downloaded and resized them, and the Nov. 5 Netlify deploy did the same. SVGs or larger PNGs would look sharper on high-res phones.

Shop photos (Nov. 5, 2026): Jay said to place them where they fit best, and he and Paul will adjust. The originals are in Jay's OneDrive, !FargoTire\Pictures 1 (renamed from Pictures by Nov. 6). A one-off script made upright copies with metadata stripped, cropped to 16:10 for the home tiles and about 4:3 landscape for service pages, since service pages and blog covers show a photo at its own shape. 20 files went into Airtable, each with alt text:
- Home tiles: Cars, Semi, Farm and Off-the-road.
- Services: Passenger & LT, Winter Changeover, Tire Services, UTV/Trailer, Semi, Industrial & OTR, Retreading, Foam Fill, Alignment, Balancing, Repair & Rotation, Nitrogen.
- Site Images: `about_photo` is the pylon sign, so it replaces the tire man figure on About; `share_image` is the sign panel.
- Blog covers: nitrogen (shown), plus winter timing and foam-filled (hidden).
- Privacy: "shop area" was cropped to leave out a car with a readable plate. The nitrogen crop leaves out writing scratched on a post. Skipped: "customer stored tires 4" (customer names on tags) and IMG_9337.
- No photo yet for:
  - Oil and Warranty (Brakes, Steering and Siping got shop photos from Pictures 4; Farm Tires and Hard-to-Find got pictures from Pictures 5)
  - a current daylight storefront (the 2021 `store front.jpeg` is on About since Nov. 7)
- Five web-sized 2021 files may have come from the old site or Google; confirm the shop owns them. Of those, `middle door 7`, `alignment machine` and `tires upstairs` are in use, and so is `store front.jpeg` since Nov. 7 (Jay asked for it on About; its EXIF names Google, so it may be a Google Maps photo); `retread.jpeg` is not.

About page (Nov. 7, 2026, Jay):
- The jumping tire man (`partials/tireman-anim.njk`, shared with the home hero) sits under the history text, beside the sign photo. He's 300px wide there so he fits the space.
- Under both columns, full width, come Site Images rows named `about_wide_1`, `about_wide_2` and so on, in name order:
  - `about_wide_1`: the storefront, `store front.jpeg`, 1024px wide, so a little soft at full width.
  - `about_wide_2`: the mural on the side of the shop (`mural.JPG`, Pictures 1). The left 2% was cut to leave out a parked car's plate.
  - Add a row with the next number to add a photo.

Pictures 2 (Nov. 6, 2026), in !FargoTire\Pictures 2, placed the same way:
- `Service truck.JPG` (the shop's crane truck, no plate showing): the On-Site & Roadside home tile and service page.
- `wipers.jpg` (the Michelin wiper display): Batteries & Wiper Blades.
- `nitrogen.jpg` (a cleaner, wider shot of the Branick machine): replaced the old close-up on the Nitrogen page and the nitrogen post cover. The phone was tilted and pointed down, so at Jay's request it was straightened: the 4 corners of the machine's lime panel were mapped to a true rectangle, then it was cropped to 4:3. The crop again leaves out the scratched post.
- The 4 rebate flyers became Specials (see Coupons).
- Not used: `brakes.jpg` is tagged Getty Images and `oil change.jpeg` is tagged Adobe Stock, so both need a paid license. `strut.webp`, `tire siping.webp` and `hard to find tires.jpg` are web graphics with no source. `Dyna_TorqII350pGS.jpg` (a Goodyear farm tire product shot) is only 200px wide. `tire man.tif` is the video's first frame.

Pictures 4 (Nov. 6, 2026), in !FargoTire\Pictures 4 (Pictures 3 holds the same 6 files), placed the same way. The files carry no camera data.
- `brakes.jpg` (a new shop photo, not the Getty one): Brakes & ABS, cropped to 1.15:1 so the whole rotor fits.
- `Struts.jpg` (a very tall photo): Steering, Suspension, Shocks & Struts, cropped to 4:5 portrait to keep the whole spring and both control arms.
- `Tire siping.jpg` (a tire in the shop's siping machine): Tire Siping, 4:3.
- `Battery.jpg` (an ACDelco battery): Batteries & Wiper Blades, beside the wiper photo (Jay chose both). Since then a service page shows up to 2 photos side by side in one row (`.svc-photos`). Their order is the Photo field's order, and Photo Alt holds one description per photo, split by ` | `. Since Nov. 7, 2026 (Jay) each is shown whole, never cropped, at the same height: `service.njk` sizes each column by its photo's width/height (`ratio`), so a tall photo gets a narrower column. Before that both were cropped to 4:3, which cut On-Site's tall job-site photo too tight. Stacking them on 2 rows was tried, and Jay wanted one row back.
- On-Site & Roadside has a second photo (Nov. 7, 2026): the shop's truck at work on a job site, crane raised beside a customer's wheel loader. A tight square crop (`on-site-service-truck.png`) went up first. Then the full phone photo arrived in a new hidden Services row, "On site service truck" (`service-truck`, Show unticked, no page). Its web copy, `svc-onsite-jobsite.jpg`, trims only plain dirt at the bottom and replaced the square on the On-Site row. The hidden row can be deleted.
- Not used at first: `Hard to find tires.jpg` is a phone photo of a printed BFGoodrich vintage tire catalog page, so the artwork isn't the shop's. `Farm tire.jpg` is a Goodyear product shot only 174px wide.

Pictures 5 (Nov. 7, 2026) holds those same 2 files, and Jay asked for them on their pages:
- The catalog page is on Hard-to-Find Tires, uncropped (it's already about 4:3).
- The Goodyear farm tire is on Farm Tires at its own 174x230 size. A service photo under 480px wide shows centered at its own size (`.svc-photo--small`) instead of stretched. A product shot at least 1,200px wide, or a shop photo, would fill the column.

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

- Seed rows marked SAMPLE (Coupons, Special Hours) and the planned Blog Posts have Show unticked. The nitrogen post (`nitrogen-tire-inflation`) is written and shown. So is the winter tires post (`when-to-switch-to-winter-tires-fargo`, Nov. 5, 2026), which uses only facts from the Winter Tire Changeover page plus general tire advice. Paul should read it. With `SHOW_SAMPLES=1`, local builds treat hidden rows in those three tables as shown, so layouts can be checked. Never set it on Netlify.

Environment variables (document in `.env.example`, never commit values): `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_WORKSPACE_ID` (setup script only), `NETLIFY_BUILD_HOOK_URL`, `UPDATE_SITE_KEY`, and the local-only `SHOW_SAMPLES`, `PREVIEW_DATE`, `PREVIEW_TIME`.

The tire man art is repo assets (`assets/tireman-*`), not Airtable images, so it can't be deleted by accident.

## Pages and URLs

Keep the old WordPress slugs where they exist.

| URL | Page |
|---|---|
| `/` | Home |
| `/coupons/` | Specials and coupons (nav label "Specials") |
| `/hours/` | Hours and location (new) |
| `/services/` and `/services/<Slug>/` | Services index and one page per shown Services row |
| `/about-us/` | History (Site Text `about_history`), the jumping tire man, the sign photo, full-width photos (`about_wide_N`), Why Us |
| `/contact-us/` | Quote form, map, phones, address |
| `/blog/` and `/blog/<Address>/` | Blog list and posts |
| `/faq/` | FAQ |
| `/waiting-room/` | Waiting room photos (new, Nov. 5, 2026), linked from the FAQ answer "Do you have a waiting room?" |

Redirects (301): `/employment/` to `/contact-us/`; `/specials/` to `/coupons/`; `/wp-admin/*`, `/wp-login.php`, `/wp-content/*`, `/feed/*` to `/`; hidden blog posts to `/blog/`; hidden services to `/services/`.

## Design

- Match `design/mockup/*.html` and the screenshots next to them. That is the approved look. Layout follows Sullivan Tire's homepage structure; the coupons page follows Pugh's Tire. Never copy their words, photos, colors or logos.
- The name is **Fargo Tire Service**, written exactly that way in page text. The logo name in the header and footer is "Fargo Tire Service Inc." (Paul's own lockup, no comma). "Fargo Tire Service, Inc." appears only in the footer copyright and JSON-LD `legalName`.
- Fonts, all self-hosted from `@fontsource`:
  - Rouge Script, bolded, for the logo name.
  - Dancing Script 600 for the motto (the home page h1).
  - Barlow Condensed 600/700/800 for headings and buttons (uppercase); Barlow 400 to 700 for body.
  - Preload Barlow 400, Barlow Condensed 800 and Rouge Script on every page, plus Dancing Script on the home page.
- Every color lives in `tokens.css`. Paul's colors are king blue and white: `--blue #152A78` is Oracal 651 #049 King blue (sRGB 21, 42, 120), chosen Nov. 2, 2026. Others: `--red #C62828`, `--ink #24292E`, `--white #FFFFFF`, `--gray-50 #F3F4F6`, `--gray-200 #D9DDE2`, `--border #E3E6EA`, `--muted #4B5563`.
- Use red sparingly (Jay, Nov. 2): only the Request a Quote / Send request buttons, coupon amounts, the holiday bar and the Closed tag. Everything else that was red is blue.
- The tire man (since Nov. 5, 2026): Paul's color drawings, made into web files in `assets/` by a one-off script from his originals ("2024 tire man with saying.tif" and "tm.jpg", in Jay's OneDrive under !FargoTire\Tire Man). Paul: the speech-bubble one is the main one, the other is for everywhere else. All are on white, so he always sits on a white card or circle with a King blue edge, never straight on blue or charcoal. Use the `tireman(kind, alt, sizes, load)` macro in `partials/icons.njk`:
  - `anim` (`tireman-anim-*`, since Nov. 6, 2026): the last frame of `assets/tireman-anim.mp4` (Jay's `tire_guy.mp4`, 1080x1214, 6 seconds, no sound track), with him on the tires and a typed "BOY! Have we got TIRES!" bubble. It's the still in the home hero card (about 340px wide) and, since Nov. 7, 2026, on About under the history text (300px). Both use `partials/tireman-anim.njk`; set `tmLoad` before including it. The video sits over it (`.tireman-stage`). Behavior is in `site.js` under "Tire man":
    - Hovering plays it: he hops onto the tires, and as the bubble opens (2.8 seconds in) `assets/tireman-saying.mp3` says "BOY! HAVE THEY GOT TIRES!" once. The video ends at 6 seconds and holds the bubble for 1 second, then he hops again, until the cursor leaves. Leaving stops it and shows the still again. The timing is `SAY_AT` (2.72, because the voice starts 0.08 seconds into the clip) and `HOLD_MS` in `site.js`.
    - The clip is the first of the 5 takes in Dave's 15-second "BOY! HAVE THEY GOT TIRES! from dave.mp3" (Pictures 2): 0.7 to 2.95 seconds, cut on MP3 frame boundaries, 2.25 seconds and 90KB. Another take would be a new cut of that file.
    - Browsers allow sound only after a click or tap on the page, so until then a hover is silent. With a mouse, a click never stops it: it turns the sound on and starts the hop over, unless he's talking.
    - A round play button (added by JS, 48px) and a tap on the drawing start and stop it on phones and with the keyboard. It also stops when the tab is hidden or the card scrolls mostly out of view.
    - It plays even with reduced motion set (Jay asked for hover, and it only moves while pointed at). The video starts loading on the first mouse movement, so phones never download it unless tapped.
  - `hero` (`tireman-hero-*`): Paul's hand-lettered "BOY! Have we got TIRES" speech-bubble drawing. It was in the home hero card until Nov. 6, 2026, when `anim` replaced it. The files stay so it can go back.
  - `figure` (`tireman-*`): the other scan, with its loose lettering removed, on About when no `about_photo` is set (since Nov. 5, 2026 it is set to the pylon sign photo, so the figure isn't showing).
  - `bust` (`tireman-bust-*`): head and bow tie, square, in the round badges in the header (58px) and footer (96px).
  - `favicon.ico`, `icon-192.png`, `icon-512.png` (JSON-LD logo, default share image) and `apple-touch-icon.png` are the bust in a King blue ring.
  - The old black line art (`tireboy.svg`, `favicon.svg`) stays only because `design/mockup/` uses it.
- Paul's logo fonts are French Script (bold) for the name, written "Fargo Tire Service Inc.", and Freestyle Script for "Boy! Have we got tires!" and the motto "After the sale, it's our service that counts." Their Office licenses don't cover the web, so the site uses free look-alikes, chosen by Jay on Nov. 2: Rouge Script and Dancing Script. Jay plans to buy web licenses for the real fonts from Monotype. When the WOFF2 files arrive: add them to the repo, point the two `@font-face` rules and `--font-logo` / `--font-slogan` in `tokens.css` at them, update the preloads in `base.njk`, then remove `@fontsource/rouge-script` and `@fontsource/dancing-script`. The comparison is in `design/font-options.html`. On the site, script is for the logo name and the motto only; everything else stays Barlow.
- Home "This season" box (Site Text `season_title`, `season_text`, `season_items`): each line of `season_items` is `Label | /link/`, and each box links to that page. Lines without ` | ` show as plain boxes. Since Nov. 4, 2026 the 5 winter boxes link to Winter Tire Changeover (a new Services row), Tire Siping, Nitrogen Inflation, Batteries & Wiper Blades and Wheel Alignment. Each of those pages now has in-depth Body text. Per Jay, the shop stores customers' off-season tires (no price given).
- Tagline "Boy! Have we got tires!" and Motto "After the sale, it's our service that counts." (wording confirmed by Jay, Nov. 5, 2026; the pylon sign says "After the sale, it's the service that counts!") come from Business Info. Since Nov. 5, 2026 (Jay) the tagline is no longer text on the home page, because the tire man's speech bubble already says it: it stays in the hero image's alt text and the JSON-LD `slogan`. The motto is the home page h1 and also shows in the footer.
- Home page edits from Paul (Nov. 5, 2026):
  - The hero has only the Call button, because the header's Request a Quote button sits right above it.
  - The brands heading is Site Text `brands_heading` ("Brands we have in stock"), and `brands_text` under the tiles is bold at 21px (`.brands-note`).
- Service pages (every `/services/<Slug>/`) show only a Call button in the page body, with no Request a Quote button (Jay, Nov. 5, 2026). The header and the phone bar still have Request a Quote.
- Waiting room (Nov. 5, 2026):
  - The FAQ "Do you have a waiting room?" sits right after "Do I need an appointment?". Its answer links to `/waiting-room/` with markdown; FAQ structured data strips links to plain text.
  - The page text is Site Text `waiting_room_text`.
  - The photos are Site Images rows named `waiting_room_1`, `waiting_room_2` and so on, in name order. Add a row to add a photo. They are the waiting room and the front counter.
- Holiday bar preview without touching Airtable:
  - Run a `--watch` build so `.cache/airtable.json` is written.
  - In that file, set `Show: true` on the Special Hours row you want.
  - Build again with `--watch` and `PREVIEW_DATE`/`PREVIEW_TIME` within 30 minutes.
  - Delete `.cache/airtable.json` afterwards.
  - Chrome's command-line screenshots can't go narrower than about 500px, so take phone screenshots in the browser pane.
- The Tires group on /services/ ends with a "Tire Services" row (Nov. 5, 2026): flat repairs, computerized balancing and installation. Paul asked for a box called "Services"; it's named Tire Services so its page title and breadcrumb read clearly. After it comes "Wheels" (Order 67, Paul's wording: "Aftermarket wheels by various manufacturers are available by order."), with the XD wheel display board photo ("rim options 1").
- Phone layout changes from the mockup, which used placeholders here:
  1. Header nav becomes a Menu button that opens a full-width panel. The full desktop menu (6 links: Tires and Services, Specials, Hours, Blog, About, FAQ, at 17px with 14px gaps; since Nov. 4, 2026 one "Tires and Services" link to /services/ replaces Tires, Services and Commercial & Farm) needs about 1070px, so the Menu button takes over below 1100px. Adding a link means re-measuring that fit.
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

- Big line from Offer Type and Amount: `$20 OFF`, `10% OFF`, `$49.95`, `FREE`, or `$100 REBATE` (Offer Type "Rebate", added Nov. 4, 2026 for manufacturer rebates, so they don't read as money off at the counter). Whole amounts show no decimals.
- Card: big line, Applies To as the headline, Details, Fine Print (small), `Valid through Nov. 30, 2026`.
- Visible when Show is ticked and Starts (if set) is on or before today, and today is on or before Expires, in Chicago. Render `data-starts` and `data-expires` so JS hides expired and not-yet-started coupons without a rebuild.
- Home strip: Featured coupons, up to 3, by Order then Expires. Featured only picks the home strip: since Nov. 7, 2026 (Jay) `/coupons/` has no large "Featured special" card, which repeated a row already listed there.
- Kind (Coupons field, added Nov. 4, 2026): Coupon or Special. A Special (like the Goodyear rebate) is something to ask about, not a printable coupon. A blank Kind means Special for Offer Type Rebate and Coupon for everything else.
- Manufacturer rebates (Nov. 6, 2026, from the flyers in Pictures 2): Goodyear up to $100 (Paul's row; dates and details added), BFGoodrich $80, Michelin $80, and Cooper $70, or up to $140 with the Goodyear Credit Card. The Cooper big line shows the $70 every tire line gets, and Details explain the "up to". All 4 hide after Nov. 30, 2026. The flyer images aren't on the site: the Goodyear graphic is 255px wide and repeats the card text, and the other 3 are photos of paper forms.
- Goodyear has 2 rebate rows on purpose (Jay, Nov. 7, 2026): $100 and $200 on 4 select tires, the $200 one starting Nov. 7. Jay will send which tires each covers, for their Details.
- The 4 coupons added in Airtable Nov. 7 have no end date on purpose (Jay): 50% off nitrogen fill, 50% off balance and rotation, $10 off alignment, $5 off oil change. They show until Show is unticked. No shown coupon is Featured, so the home page has no specials strip.
- `airtable/seed.json` Coupons matches Airtable as of Nov. 7, 2026, except the hidden "4 Free Tires for Jay Manley" test row.
- `/coupons/`: "Specials and rebates" (solid cards with Request this special and Call, no Print), then "Coupons" (a grid with dashed borders). Each heading hides when it has nothing visible. The Site Text `specials_footer` line sits at the bottom.
- When nothing is visible: "No specials posted right now. Call (701) 232-7177 for today's deals."
- Each coupon gets "Print coupon" (a print stylesheet that prints only that coupon; Specials get Call instead) and "Request this special" (links to `/contact-us/?coupon=<title>#quote`, which fills the hidden Coupon field).
- Production never shows "Sample" badges. Sample rows in the seed have Show unticked.

### Quote form

- Netlify Form named `quote`, with a honeypot (`netlify-honeypot="bot-field"`). It appears on `/contact-us/` and at the bottom of the home page. Use the same name and fields in both places.
- Fields, matching the Leads table:
  - Name, Phone, Email
  - Contact Pref (Call/Text/Email)
  - Need (select): Passenger or light truck tires, Semi or commercial tires, Farm tires, Service or repair, Just a question. Since Nov. 4, 2026; the old Leads choices "Farm or ag tires" and "On-site service" can be deleted in Airtable.
  - Vehicle or Equipment, Tire Size, Quantity
  - Photo (one image, optional)
  - Message
  - Coupon (hidden), Page (hidden)
- Required (Jay, Nov. 4, 2026): Name, Vehicle or Equipment and Tire Size use `required`. Phone or Email needs at least one, enforced in `site.js` with `setCustomValidity` on Phone. Labels mark them with *.
- Netlify only captures fields present in the built HTML, so no JS-added fields.
- `submission-created` creates a Leads record: Received = now, Status = New, Page and Coupon filled. If the photo can't be attached cleanly, store its link in Message instead.
- Leads Status stages (Nov. 4, 2026): New, Contacted, In Process, Completed, Canceled (default New). Quoted, Won and Lost were renamed to the last 3, and Spam was removed. The Airtable interface "Quote Requests" (published, built by hand in the UI; the API can't create interfaces) has one Kanban page on Leads, stacked by Status, newest Received first. Cards show Name, Need, Phone, Vehicle or Equipment, Tire Size and Received. Dragging a card changes Status, and clicking one opens every field, editable. Nobody has been invited to it yet: Paul needs to be a base collaborator or an interface-only user (an editor seat, 5 on Free).
- Email notices come from an Airtable automation in the website base, "Email new quote requests": when a Leads record is created, a "Find records" step reads Business Info (Grid view, 1 record), then a Microsoft Outlook "Send email" step sends the lead's fields from web@fargotire.com to Business Info's **Form Notice Email** (since Nov. 5, 2026; web@fargotire.com for now, likely info@fargotire.com after launch). To change who gets quote emails, edit that field; no automation change needed. The email's "Open in Airtable" link is the trigger's Base record URL (fixed Nov. 5, 2026; before that it was typed-in text pointing at one old test lead). Netlify's own form email notices need its Pro plan, so they aren't used. No email code. Tested end to end Nov. 2, 2026. It uses Airtable automation runs (100 a month on Free).
- After sending, show the Site Text `quote_thanks` message.
- Add reCAPTCHA only if spam shows up.

### Publishing

- `update-site` function: called with `?key=UPDATE_SITE_KEY`, it POSTs to `NETLIFY_BUILD_HOOK_URL` and returns a small page saying "Website update started. It will be live in about a minute." Coupons, Special Hours, Blog Posts and Business Info each have an "Update Website" button field (Open URL, added by hand Nov. 2, 2026; the API can't create or read buttons) pointing at `https://fargotire-site.netlify.app/.netlify/functions/update-site?key=...`. If `UPDATE_SITE_KEY` ever changes, update all 4 buttons. After launch they can point at fargotire.com instead. Airtable's records API returns each button's full URL, key included, so scripts must never print whole records. (The key was rotated Nov. 2, 2026, after that happened once.)
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

- Confirm the regular hours with Paul. They come from Goodyear's listing. Holiday closures were confirmed by Jay on Nov. 4, 2026: New Year's Day, Memorial Day, Independence Day, Labor Day, Thanksgiving Day, Christmas Day (Site Text `holiday_closures`, listed on /hours/). The dated Special Hours rows that drive the holiday bar are still hidden samples. The after-hours note under Regular hours was removed Nov. 4 by emptying Business Info's After Hours Note.
- Logo files, if Paul has any.
- Public email, Google Business Profile URL, Facebook URL. (Quote emails go to web@fargotire.com; see Quote form.)
- The shop's Airtable Team trial ends about Nov. 16, 2026. Afterwards, send one test quote to confirm the Outlook email automation still runs on Free.
- Which Netlify plan the shop's team ended up on (Free: 300 credits; Personal: $9 a month, 1,000 credits). Update Limits to match.
- Photos: shop photos placed Nov. 5 and 6 (see Status), for Jay and Paul to adjust. Still needed: a bigger farm tire picture (a shop photo, or a Goodyear product shot at least 1,200px wide; the one on Farm Tires is 174px), a current daylight storefront at least 1,600px wide (the one on About is 1,024px), and shop photos (or licenses) for Oil and Warranty. Drone shots exist. Brand logos are in Airtable since Nov. 5.
- GoDaddy access: in hand (the web records were changed Nov. 7). The old WordPress host isn't needed anymore (Jay: only its DNS settings mattered).
- In Airtable, delete the unused Category choices "Farm & Ag" (Services) and "Farm & ag" (Blog Posts). Every row moved to "Farm" on Nov. 7, but the API can't remove choices. A row set to the old Services choice would drop out of the /services/ groups.

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
5. Performance and accessibility pass (Lighthouse mobile), Search Console prep. JSON-LD, sitemap, robots and headers are done.
   - Nov. 2, Lighthouse 12.8 mobile on the live site: perf 96 to 100, accessibility 100, best practices 100 on home, Specials, Services, a service page, About, Contact and the nitrogen post. SEO 69 everywhere only because of the pre-launch noindex. Hours scored perf 70 and a11y 95.
   - Fixed: the Hours status pill was near-white on white (`.page-hero p` overrode it), and the Google map loaded on page load. It now loads after the page loads, when its box nears the screen (`data-map-src` in `find-us.njk` plus `site.js`).
   - Netlify's injected "Powered by Netlify" badge covered the Request a Quote button in the phone bar. Turn it off in Project configuration, General, Powered by Netlify badge.
   - Lighthouse runs locally with `npx lighthouse@12` (CHROME_PATH set to Chrome). The free PageSpeed API often hits its shared daily quota.
6. Real content (Nov. 2: King blue, script fonts, motto and Paul's fact fixes done; retreading is offered and shown; the items kept from the old site that Paul didn't list stay, per Jay; first blog post, nitrogen in cold weather, published):
   - photos, logos, coupons, confirmed hours
   - `docs/paul-claude-instructions.md`
   - the owner guide in README.md
   - ~~an optional Airtable interface for Paul~~ done Nov. 4: "Quote Requests", a Kanban board of Leads (see Quote form)
7. Launch: ~~DNS cutover~~ (done Nov. 7, 2026, see Status), Search Console, Google Business Profile check, a week of watching, then handoff. Before launch, check that every coupon with Show ticked is meant for the public (the "4 Free Tires for Jay Manley" test coupon added Nov. 2 had Show unticked as of Nov. 6; delete it before launch). After fargotire.com is the primary domain in Netlify, trigger one deploy: that removes the pre-launch noindex, switches canonical URLs and the sitemap to fargotire.com, and runs IndexNow for the first time (check the function log for 200 or 202).
