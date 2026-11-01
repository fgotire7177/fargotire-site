# Next steps: you and Claude Code

## Where things stand (Nov. 1, 2026)

The whole site is built and runs on the starter data in `airtable/seed.json`:
- Home, Specials, Hours, every Services page, About, Contact, Blog, FAQ, Thanks, 404
- the holiday bar, the "Open now" line in Chicago time, coupon expiry
- the phone menu and the sticky Call/Quote bar
- the quote form, search data, sitemap and redirects
- both Netlify functions and the Airtable setup script

None of it is connected to real accounts yet. Everything left needs your logins or a decision, which is why it moves to Claude Code.

## Step 1: accounts (you, about 20 minutes)

Create these with a shop email Paul can get into (e.g. web@fargotire.com), not your own. Then handoff is just a password change.

1. **GitHub.**
   - Make an account or a free organization.
   - Create an empty private repo named `fargotire-site`.
   - Add yourself (jmanley966) as a collaborator.
2. **Airtable.**
   - Make an account and a workspace.
   - Copy the workspace ID: the `wsp...` part of the workspace URL.
   - Create a personal access token (Builder hub, Personal access tokens) with these scopes: `schema.bases:read`, `schema.bases:write`, `data.records:read`, `data.records:write`. Limit it to that workspace.
3. **Netlify.** Make an account. Nothing else yet.

## Step 2: open Claude Code on this folder and paste these, one at a time

### Prompt A: move it, run it, push it

```
Read CLAUDE.md and docs/KICKOFF.md. This folder is in OneDrive, which would sync the thousands of files npm installs, so copy it to C:\Users\jmanley\dev\fargotire-site and work only there from now on.
Run npm install, then npm run samples, and tell me the local URL so I can look at it.
Then git init on a main branch, commit everything ("Site built from starter kit"), add the remote <PASTE THE GITHUB REPO URL> and push.
```

### Prompt B: build the Airtable base

Before sending:
- Make a `.env` file from `.env.example` in the new folder.
- Fill in `AIRTABLE_TOKEN` and `AIRTABLE_WORKSPACE_ID`.

```
Run npm run airtable:setup. If Airtable rejects a field option, fix airtable/schema.json and try again (delete the half-made base first; tell me if I need to do that by hand).
Put the new base ID in .env as AIRTABLE_BASE_ID. Run npm run build reading Airtable, confirm the pages match the seed build, and tell me how many API calls one build makes.
```

### Prompt C: Netlify

First, in Netlify (signed in as the shop):
1. Add new site, Import from GitHub, pick `fargotire-site`. The build settings come from `netlify.toml`.
2. Site configuration, Environment variables: add `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID`, plus `UPDATE_SITE_KEY` (any long random string).
3. Build and deploy, Build hooks: create one named "Airtable", then add its URL as `NETLIFY_BUILD_HOOK_URL`. Trigger a deploy.
4. Forms, Form notifications: add an email notification for the `quote` form, sent to the shop's email.

```
The Netlify site is live at <PASTE THE .netlify.app URL>.
- Submit a test quote request with a photo and confirm a Leads row shows up in Airtable.
- Open the update-site link with the key and confirm a deploy starts.
- Then give me exact click-by-click steps to add an "Update website" button field (Open URL) to Coupons, Special Hours, Blog Posts and Business Info in Airtable. The API can't create button fields.
- Add IndexNow on deploy the way dakotaskyhook-site does it, if you can read that repo.
- Run Lighthouse (mobile) on the home page and fix anything under 90.
```

### Prompt D: real content and Paul's tools

When you have the photos, brand colors and Paul's answers:

```
I've added photos, confirmed hours, real coupons and holiday dates in Airtable, and Paul's brand colors are <CODES>. Put the colors in src/css/tokens.css, rebuild, check every page at 390 and 1440 wide, and list anything still missing.
Then write docs/paul-claude-instructions.md, so Paul can add or remove coupons and holiday hours by telling his own Claude (Airtable connector).
Finally, replace README.md with an owner guide for Paul: how to edit in Airtable, the Update website button, where quote requests go, and the free-plan limits.
```

### Prompt E: launch and handoff

```
Help me launch fargotire.com:
- read the current DNS and MX records and tell me exactly which records to change at the registrar so email keeps working
- add the domain in Netlify
- Search Console verification
- what to check in Paul's Google Business Profile, including holiday hours
- what to watch the first week
Then walk me through the handoff checklist in docs/PLAN.md.
```

## Things only you can get

- Paul's answers:
  - his hours
  - which holidays he closes
  - whether retreading is still offered
  - the email that should get quote requests
  - his Google Business Profile and Facebook links
- The brand color codes from the vinyl sample, and any logo files.
- Photos:
  - your drone shots
  - ground shots of the storefront, bays, crane trucks on a job, and tire stock
- Logins: the domain registrar and the current website host.
