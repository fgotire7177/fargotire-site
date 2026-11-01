# Fargo Tire website rebuild: assessment and plan

Assessed 10/31/2026. Target stack: Airtable (content) + GitHub (code) + Netlify (hosting, forms) + Claude Code (build), same pattern as dakotaskyhook.com. End state: full handoff to the owner, Paul.

## Decisions (10/31/2026)

- **Goal from Paul:** look better and more professional than the last vendor's work; call out Specials; add and remove coupons by telling Claude; start an informational blog like dakotaskyhook.com's Land Buying Guide.
- **Job application removed.** No Employment page, no Applications or Openings tables. /employment/ redirects (301) to /contact-us/.
- **Quote / question form kept and expanded** (see Quote form below).
- **Name, one way everywhere:** "Fargo Tire Service". Matches the legal name minus "Inc." and how Goodyear, Tire Rack and other dealer listings show it. Confirm against the Google Business Profile name, which should match exactly; swap if it differs.
- **Font, placeholder until brand files arrive:** Barlow Condensed (bold, all caps) for the name and headings, Barlow for body text. Same family, free Google Font (SIL Open Font License), sturdy highway-sign look.
- **Retreading:** probably discontinued. Leave it off the site until Jay confirms.
- **Photos:** drone shots exist; ground shots to be taken (see list at bottom).
- **Brand colors (Paul's):** medium-dark blue, red, white, charcoal. No codes yet; Jay has a vinyl sample. Mockup stand-ins: blue #1D4F91, red #C62828, charcoal #24292E. Get the real codes from the vinyl label (Oracal/3M number), the sign shop, or a paint-counter scan.
- **Tire man:** the vintage cartoon (tux, bow tie, leaning on a tire stack) from fargotire.com/wp-content/uploads/2021/12/TireBoy-01.jpg, traced to a clean vector. Used in the header, homepage hero, browser tab icon and footer, always on a white circle with a red ring. Tagline next to him: "Boy, Have We Got Tires!" (exact wording on the current site).
- **Name font:** Barlow Condensed confirmed for the mockup (10/31).

## Mockup (10/31/2026)

Design canvas "Fargo Tire Service Website Mockup" (claude.ai artifact RzrD3jC7qj7eB2S8cgqaRo): Home, Specials, Hours & Location, Home at phone width, and the tab/home-screen icon. Specials, holiday dates and blog posts are samples. Brand colors and the holiday bar on/off are adjustable in each page's Tweaks.

## Claude Code starter kit (11/1/2026)

Delivered as fargotire-site-starter.zip: CLAUDE.md (working brief and specs), docs/KICKOFF.md (setup steps and one prompt per milestone), docs/PLAN.md (this plan), airtable/schema.json (13 tables in Airtable create-table shape) and seed.json (starter records; SAMPLE rows hidden), design/mockup (static HTML export and screenshots), assets (traced tire man, badge, favicon set). Phone fixes found while exporting: the wordmark and form fields overflowed at 390px (fixed on the canvas too); in the real build the nav becomes a Menu button, the specials strip scrolls sideways on phones, and a sticky Call/Quote bar is added.

## Build status (11/1/2026)

The full site was built in Cowork from the starter kit and tested against seed data: all pages, holiday bar, open-now line (Chicago time), coupon expiry, phone menu, sticky Call/Quote bar, quote form, JSON-LD, sitemap, redirects, both Netlify functions and the Airtable setup script. Delivered to the !FargoTire folder as fargotire-site. Not yet connected: Airtable base, Netlify site, GitHub repo, real form submissions. Next steps and Claude Code prompts: docs/KICKOFF.md.

## Holiday hours

- **Special Hours** table in Airtable: Date, End Date (optional, for multi-day), Label (e.g. Thanksgiving), Type (Closed / Closing Early / Opening Late / Special Hours), Opens, Closes, Show From (days ahead, default 14), Show.
- Homepage and every page: red bar at the very top when a row is within its Show From window; disappears after the date on its own (browser-side date check, no republish).
- Header "Open now / Closes at" line reads the same table, so on the day it says "Closed today for Thanksgiving".
- Hours page: regular weekly hours (today highlighted) plus an Upcoming Holiday Hours list.
- JSON-LD specialOpeningHoursSpecification built from the table.
- Paul can add rows himself or tell Claude ("we close at noon Christmas Eve").
- Google Business Profile special hours are separate and must still be set there; that's what Google Maps shows.

## Template review (10/31/2026)

Looked at regional and local tire/service sites in the built-in browser.

| Site | Verdict | Take | Leave |
|---|---|---|---|
| Sullivan Tire (sullivantire.com), New England, family-run since 1955 | **Primary model.** Cleanest, most professional | Offer cards across the very top with "Valid through" dates; simple hero with two buttons; "The Sullivan Tire Difference" icon grid for heritage and trust; seasonal services block; Blog in the main nav with category tabs; auto vs truck split in the header | Multi-location finder, online appointment system, newsletter popup, their green/slash branding |
| Pugh's Tire & Service Centers (pughstireservice.com), Greenville NC, since 1945 | **Secondary model** for promotions and tone | Promotions page: featured promo up top, then dashed-border text coupons with valid dates; "Request a Quote" button pinned in the header; heritage band ("Over 75 Years"); brand logo grid; review carousel | Fade-in animations that hide content until scroll; light gray body text with weak contrast |
| Northwest Tire (nwtire.com), North Dakota | Structure only | Four audience tiles: Car / Pickup / Truck-Commercial / Farm-Industrial. Fargo Tire has the same mix | Dated look, clip-art style |
| Black's Tire (blackstire.com) | Counterexample | | Banner-ad clutter, stacked promos |
| Bauer Built (bauerbuilt.com) | Counterexample | | Corporate fleet focus, heavy full-screen imagery |
| Les Schwab (lesschwab.com) | Local competitor, not a template | Note: three F-M stores open since April 2024; site geolocates to "South Fargo" | Loud chain promo style |

Copy the structure and patterns, not the words, photos, colors or logos.

## Proposed homepage (Sullivan structure, Fargo Tire content)

1. Utility bar: tap-to-call phone, today's hours, address with directions link
2. Header: wordmark, nav (Tires, Services, Commercial & Farm, Specials, Blog, About, Contact), "Request a Quote" button
3. Specials strip: up to 3 Featured coupons as cards with "Valid through" dates
4. Hero: drone or shop photo, one headline, two buttons (Request a Quote, Call)
5. Who we serve tiles: Cars & Pickups, Semi & Commercial, Farm & Ag, On-Site Service
6. "The Fargo Tire Service Difference" grid: family owned since 1950; walk-ins welcome; ASE-certified techs; on-site service with crane trucks; hard-to-find tires; free road hazard on passenger tires
7. Brand logo grid
8. Seasonal block, edited in Airtable (winter: changeover, siping, nitrogen; spring: alignment after pothole season; fall: harvest on-site service)
9. Latest 3 blog posts
10. Google reviews link
11. Footer: hours, map, name/address/phone, nav

## Specials and coupons by telling Claude

One **Coupons** table covers both. Fields: Title, Offer Type (Dollars Off / Percent Off / Special Price / Free), Amount, Applies To, Fine Print, Starts, Expires, Featured (shows in the homepage Specials strip), Show.

Flow after handoff: Paul tells his Claude "Add a coupon: $20 off an alignment, good through Dec 31." Claude, using the Airtable connector and a small Fargo Tire skill that knows the fields, asks only for what's missing, writes the record, and the site republishes. "Take the alignment coupon down" unticks Show. Expired coupons hide themselves in the browser on their date, so expiry never needs a republish.

Publish trigger options (test during build):
- Airtable automation on the Coupons table runs a script that calls the Netlify build hook. Airtable says Run a script works on all plans "with varying limitations"; Free allows 100 automation runs a month. Verify on the shop's Free workspace.
- Fallback: the "Update website" button, same as dakotaskyhook.com.

## Blog

Blog Posts table copied from the Dakota Skyhook base (Title, Address, Date, Show, Cover Photo, Summary, Search Title, Search Description, Text). Starter topics that fit Fargo: when to switch to winter tires in Fargo; siping on ice; why tire pressure drops when it gets cold; nitrogen in tires; farm tire foam fill; on-site truck and farm tire service during harvest; reading a tire sidewall for size.

## Quote form

Fields: Name, Phone, Email, Best way to reach you, What do you need (Passenger or light truck tires / Semi or commercial tires / Farm or ag tires / Service or repair / On-site service / Question), Vehicle or equipment, Tire size (optional, with "it's on the sidewall" help and an optional sidewall photo), Quantity, Message. Submissions go to the Leads table plus an email notice to the shop. Confirmation reads "request received", not a booked time.

## Verdict

Yes. This is a smaller job than dakotaskyhook.com: 6 pages, roughly 1,500 words, one form, no listings, no payments, no tire catalog, no booking. Every current feature maps cleanly onto the stack. The handoff requirement drives more of the decisions than the build does.

## Current site audit (fargotire.com)

**Platform:** WordPress + WPBakery Page Builder; Gravity Forms on the Employment page. Homepage content last modified 4/7/2021, About Us 2/9/2023. Footer year auto-updates to 2026, so it looks maintained when it isn't.

**Pages:** Home, About Us, Services, Coupons, Employment, Contact Us. URLs: /about-us/, /services/, /coupons/, /employment/, /contact-us/.

**Facts on file (from the site and Goodyear's dealer page):**
- Fargo Tire & Service Inc., 2020 Main Ave, Fargo, ND 58103
- Phone (701) 232-7177, toll free 800-365-2161, fax (701) 232-2939
- Hours (Goodyear dealer page, dealer-supplied, unverified): M-F 7:30a-5:30p, Sat 7:30a-12p, Sun closed
- Founded 1950; Duane "Andy" Anderson bought it 1972; sons Paul and Roger joined 1988 and run it
- Brands: Michelin, BFGoodrich, Uniroyal, Goodyear, Dunlop, Hercules, Titan
- Tire types: passenger, LT/SUV, medium truck, farm, industrial, OTR, ATV, lawn and garden, trailer, hard-to-find
- Services: computer balancing, 4-wheel and truck alignment (4 bays), Goodyear-rubber retreading (LT and truck), section repair, foam fill, nitrogen, siping, brakes/ABS, suspension, oil/lube/filter, batteries, wipers, roadside, on-site service with crane trucks, after-hours service, ASE techs, walk-ins, free road hazard on passenger tires

**Problems worth fixing:**
1. Hours appear nowhere on the site.
2. Phone is not on the homepage; no click-to-call header. For a tire shop, the phone call is the conversion.
3. Coupons page is four screenshots dated 2/24/2021, alt text is the filename. Offers are invisible to Google and AI search and are almost certainly expired.
4. No meta descriptions; homepage title is "Home - Fargo Tire"; no og:image.
5. No LocalBusiness/TireShop schema; no sitemap referenced in robots.txt.
6. Business name used three ways (Fargo Tire & Service Inc., Fargo Tire Service, Inc., Fargo Tire). Pick one for NAP consistency.
7. No map, no contact form, contact email hidden behind an "E-Mail Us" link.
8. Viewport disables pinch zoom (accessibility).
9. No photos of the shop, bays, or crane service trucks. The strongest differentiators (on-site truck/farm/OTR service, retreading, 76 years local) are text only.
10. The only form is a job application; no way to request a quote.
11. Employment page: "Inquire Within", and a Gravity Forms honeypot label ("This field is for validation purposes...") shows as a visible field.

## Target architecture (copy of dakotaskyhook-site)

- **GitHub:** private repo (e.g. fargotire-site). Claude Code works on branches and opens PRs; merge to main deploys.
- **Eleventy** static build. At build time it pulls Airtable tables, downloads attachments (Airtable attachment URLs expire, so never hotlink), optimizes images, writes HTML, JSON-LD, sitemap.xml.
- **Netlify:** hosting, Netlify Forms, two functions reused from dakotaskyhook: `submission-created` (form to Airtable) and `update-site` (Airtable "Update website" button triggers a build hook).
- **Airtable:** the owner's editing surface. Field descriptions written as plain-English instructions, same as the Dakota Skyhook base.

## Airtable base design

| Table | Purpose | Key fields |
|---|---|---|
| Site Text | Headlines and blurbs by name | Name, Text |
| Site Images | Logo, hero, about photos | Name, Image, Alt Text |
| Business Info | One row: NAP, phones, email, service area, Google Business Profile link | single record |
| Hours | Regular weekly hours | Day, Opens, Closes, Closed, Note |
| Special Hours | Holiday closures, early closes, late opens | Date, End Date, Label, Type, Opens, Closes, Show From, Show |
| Services | One row per service, generates its own page | Name, Slug, Category, Summary, Body, Photo, Order, Show |
| Brands | Logo strip | Brand, Logo, Link, Order, Show |
| Coupons | Specials and coupons | Title, Offer Type, Amount, Applies To, Fine Print, Starts, Expires, Featured, Show |
| Blog Posts | Informational posts | Same fields as the Dakota Skyhook Blog Posts table |
| FAQ | FAQ page and FAQPage schema | Question, Answer, Order, Show |
| Leads | Quote/question form submissions | Name, Phone, Email, Contact Pref, Need, Vehicle/Equipment, Tire Size, Quantity, Photo, Message, Received, Status |

## Page and URL plan

Keep the existing slugs: /, /about-us/, /services/, /coupons/ (labeled "Specials" in the nav), /contact-us/. /employment/ redirects to /contact-us/. Add:
- /services/<slug>/ per service (on-site truck tire service, farm tires, alignment, passenger and light truck tires, brakes, etc.; retreading only if still offered). This is the main SEO gain; each is a separate local search.
- /faq/
- /blog/ and /blog/<address>/
- Redirect /wp-admin, /wp-content/*, /feed/ and similar WordPress paths to home.

Sitewide: click-to-call header, hours and map in footer, TireShop + AutoRepair JSON-LD with openingHoursSpecification built from the Hours table, meta descriptions per page, og:image.

## Feature mapping

| Today | Rebuild |
|---|---|
| WPBakery pages | Eleventy templates, text from Site Text |
| Coupon screenshots | Coupons table, rendered as text, printable; Featured ones in the homepage Specials strip; expired coupons hidden in the browser by date so expiry needs no rebuild |
| Gravity Forms job app | Removed; /employment/ redirects to /contact-us/ |
| "E-Mail Us" link | Quote/question Netlify Form to Leads table plus email notice. Netlify only captures fields present in the built HTML, so no JS-added fields |
| Nothing | Hours, map, services pages, blog, FAQ, schema, sitemap |

Not in scope unless asked: online tire search and pricing (would be a third-party dealer widget embed), online booking (shop is walk-in; a "request a time" form covers it), live Google reviews widget (needs Places API key and billing; link to the profile instead).

## Free-tier math (after handoff, on the shop's own accounts)

- **Netlify Free:** 300 credits/month, hard cap. Production deploy 15 credits; bandwidth 20/GB; 2 per 10,000 requests; form submissions free; deploy previews free. A small local site uses maybe 30-60 credits in traffic, leaving room for about 15 "Update website" clicks a month. If credits run out, the site pauses until the next cycle. Pro is $20/month for 3,000 credits with auto recharge.
- **Airtable Free:** 1,000 records per base, 5 editors, 100 automation runs/month, 1,000 API calls/month per workspace (one-time 30-day grace, then blocked until the month resets). A build costs about one call per table, a form submission one call. Archive old Leads yearly.
- **GitHub Free:** private repos included.

## Handoff plan

Set ownership up on day one so handoff is a password change, not a migration.

1. Create a shop-controlled email (e.g. web@fargotire.com or a Gmail the owner controls). Use it for GitHub, Netlify, and Airtable.
2. Netlify: separate account for the shop, not Jay's Dakota Skyhook team. Self-service transfers need a shared Owner/Developer on both teams, and Free plans don't include team seats, so building in Jay's team means a support ticket or a re-import later. A separate team also keeps the two sites off one credit pool.
3. GitHub: repo created under the shop's account or a free org with Jay as collaborator. Repo transfer is easy later but forces relinking Netlify, so avoid it.
4. Airtable: base in the shop's workspace. The Airtable token used by the Netlify build must be created by the shop's Airtable user; a token tied to Jay breaks the build the day Jay is removed.
5. Domain and DNS stay with the shop's registrar. Check MX records before touching DNS; change only the web records (A/CNAME) so email is unaffected. Get access to the existing Google Search Console property (the site already has a verification tag) or re-verify by DNS.
6. Form notification emails go to the shop's address.
7. Leave behind: README and CLAUDE.md in the repo (how the build works, env vars, how to run Claude Code against it), and a one-page "How to update your website" guide covering the Airtable side.
8. Handoff day: owner changes passwords, enables 2FA, Jay removes himself from Airtable and GitHub, rotates the Airtable token and Netlify build hook secret.
9. Cancel the WordPress hosting and Gravity Forms license only after the new site has been live and indexed for a couple of weeks.

**Post-handoff reality:** content edits (hours, coupons, services, blog posts, photos) are self-serve in Airtable, or through Claude with the Airtable connector. Layout or design changes need code, meaning the owner runs Claude Code (needs a Claude subscription) or hires someone. Design the Airtable side so code changes are rare.

## Content to collect from the shop

- Confirmed hours and holiday schedule
- Preferred legal/display name
- Email for form notices and public display
- Photos: existing drone shots, plus ground shots of the storefront, bays, alignment rack, service trucks and cranes on a job, tire stock (passenger, truck, farm), staff if willing. Landscape, daylight, no customer plates
- Current coupons with real expiration dates
- Service area for on-site work; after-hours phone policy
- Brand logos (dealer programs usually supply approved files)
- Google Business Profile link and exact profile name
- Whether retreading is still offered
- Brand specifics (logo files, colors, font if any) from Jay
- Registrar and current host logins

## Open questions

- Paul wants to change coupons by talking to Claude, which means a Claude subscription on his side plus the Airtable connector. Confirm he's fine with that, or Jay keeps that piece.
- Is the Squarespace build from 10/18 retired by this plan?
