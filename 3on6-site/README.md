# 3on6.com: Next.js + Sanity

This replaces the Wix site at 3on6.com. It is built on the same stack as the Smile Clinic rebuild (Next.js 15 App Router, Sanity Studio at `/studio`, Vercel), with the 3 on 6 brand:

- **Colors:** Aqua `#65C7CF`, Dark Navy `#193543`, Highlight Yellow `#D8D82E`, Light Navy `#326A85` (tokens at the top of `app/site.css`).
- **Type:** Avenir Next Condensed for headlines and Avenir Next for text. Apple devices have both built in. Everyone else gets Barlow Condensed and Nunito Sans, self-hosted, with no Google Fonts request. Add licensed Avenir web fonts to use Avenir everywhere.
- **Logo:** a text wordmark until you set `NEXT_PUBLIC_LOGO_SRC` (see step 4).

**It runs before Sanity is connected.** Until you set a project ID, every page renders `content/seed.ts` and `content/providers.ts`.

## What changed from the Wix site

- **A real lead path.** On Wix, every button went to the provider list and the site captured nothing. Now a three-question form (the same questions as the Meta lead form) appears in the hero, on treatment and office pages, and at the end of every page. It then confirms the visitor's provider and takes their contact details.
- **A provider finder.** All 48 offices are listed with tier, doctor, address and phone. Visitors can search by city, state, office or doctor, filter by tier, and sort by distance with "Near me". That uses the browser's location, only when pressed, and it is never stored. A US map shows every office.
- **A nearest-provider match.** The middleware guesses the visitor's nearest office from Vercel's IP location (same-state offices first) and saves only the office slug in a cookie. Opening an office page, picking one in the form, or a `?provider=<slug>` link overrides the guess, and that choice sticks.
- **Office pages** at the same URLs (`/office/<slug>`). Old Wix slugs such as `/office/smile-clinic-(utah)` and `/office/metro-dental-%26-implant-studio` redirect with a 308.
- **Every Wix URL is kept:** `/what-is-3-on-6`, `/3-on-6-plus`, `/providers`, `/before-and-after`, `/patient-stories`, `/3on6-vs-alternatives`, `/faq`, `/guarantee`, `/our-story-mission`, `/newsroom`, `/refer-a-doctor`, `/blog`, all 67 `/post/<slug>`, `/privacy-policy` and `/terms`.

## 1 · Run it

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000  ·  Studio at /studio
```

## 2 · Bring the Wix copy across

```bash
npm run migrate:wix                  # crawls 3on6.com → content/wix-export/ + content/wix/content.json
npm run migrate:wix -- --push        # also writes into Sanity (needs SANITY_API_WRITE_TOKEN)
```

- **Blog posts:** all 67 come across word-for-word. Until a post has a body, its page shows a TODO line, is set to noindex, and is left out of the sitemap.
- **Treatment pages:** the What is 3 on 6 and 3 on 6 Plus bodies and FAQs are patched in.
- **Rebuilt pages:** Patient Stories, Guarantee, FAQ, Alternatives, Story and Providers are rebuilt as their own pages. Their Wix text is saved to `raw/` for comparison only.
- **FAQ:** the Wix FAQ loads four of its five tabs with JavaScript. Only the Consultation answers are word-for-word. The rest are drafts, so check them against `raw/faq.json`.

## 3 · Connect Sanity (optional)

1. Run `npx sanity init --env .env.local`, or paste a project ID into `.env.local`.
2. Add CORS origins for localhost and the Vercel domain.
3. Load the starter content:
   ```bash
   npm run seed
   npm run import:seed
   ```

Provider offices then become editable Studio documents. These fields matter most:

- **Tier, doctors, phone:** edit them like any other field.
- **Latitude/longitude:** these drive "Near me" and the map dot.
- **active:** turn it off to hide an office everywhere (finder, form, sitemap).

## 4 · Images

The sandbox this was built in couldn't reach Wix's image server. Until you replace them, the before-and-after frames and the renders use the 3 on 6 images already in the Smile Clinic project, and the patient stories use their YouTube thumbnails.

```bash
npm run pull:wix-images   # downloads about 65 photos (logo, 29 before/afters, patient photos, models, story timeline) → public/img/3on6/
```

After that:

- **Logo:** set `NEXT_PUBLIC_LOGO_SRC=/img/3on6/logo-white.png`.
- **Before and afters:** each Wix photo is a single side-by-side image, not a separate before and after. To show them, upload them as Before & after documents, or add a simple gallery.

## 5 · Leads → HighLevel

Every lead goes to **one** HighLevel sub-account (`HL_TOKEN` / `HL_LOCATION`). For each lead, `/api/consult`:

1. **Upserts the contact** with name, phone and email only.
2. **Adds tags.** It only adds and never replaces:
   - `3on6-website`
   - `provider-<slug>`, or `provider-unmatched`
   - `tier-<tier>`
   - `channel-<channel>`
   - `web-<answer>` for each answer
3. **Sets the source.** This happens only for brand-new contacts.
4. **Fills the Simple Survey fields and writes a note.** The note carries the provider's name, doctor, city, phone and website, so whoever forwards the lead has it all.

Set `HL_TEST_TOKEN` + `HL_TEST_LOCATION` to send everything to a test sub-account first.

**Routing to offices** is a HighLevel workflow. The trigger is "Contact Tag Added: 3on6-website", and the workflow branches on `provider-*`: it emails or texts the office, or pushes the lead to the office's own sub-account if they use HighLevel.

## 6 · Deploy

1. Push to GitHub.
2. Import the repo in Vercel and add the env vars.
3. Point the domain at Vercel. Wix stays up until the DNS switch.

`/api/whereami` shows what location Vercel sees for your connection and which provider it maps to.
