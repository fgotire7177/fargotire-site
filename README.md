# fargotire.com

The Fargo Tire Service website: Eleventy, with content in Airtable, hosted on Netlify. It will be replaced by an owner guide for Paul before handoff.

- **Start here:** `docs/KICKOFF.md` (next steps and the Claude Code prompts)
- **Working brief for Claude Code:** `CLAUDE.md`
- **Full plan, audit and handoff checklist:** `docs/PLAN.md`
- **Approved mockup:** `design/mockup/` (open the HTML files or the screenshots)
- **Airtable:** `airtable/schema.json` (tables) and `airtable/seed.json` (starter records)

## Run it locally

Needs Node 22.

```
npm install
npm run samples      # http://localhost:8080 with SAMPLE coupons, holiday rows and blog posts shown
npm run dev          # same, real data only (seed or Airtable)
npm run build        # writes _site/
```

Without `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` in `.env`, the site builds from `airtable/seed.json`. Copy `.env.example` to `.env` to set them.

Testing holiday hours: `PREVIEW_DATE=2026-11-26 PREVIEW_TIME=08:00 npm run samples` pretends it's Thanksgiving morning in Fargo. On Windows PowerShell, set the variables first:

```
$env:PREVIEW_DATE="2026-11-26"; $env:PREVIEW_TIME="08:00"; npm run samples
```
