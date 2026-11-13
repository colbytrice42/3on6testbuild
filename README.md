# 3 on 6 · Next.js + Sanity

This is the rebuilt 3on6.com. It uses the same stack as the Smile Clinic site: Next.js 15 (App Router), Sanity Studio at `/studio`, and Vercel for deploys. The app lives in the **`3on6-site/`** folder, and its full setup guide is `3on6-site/README.md`.

**It runs before Sanity is connected.** Until you set a project ID, every page renders the starter content in `3on6-site/content/seed.ts`, plus all 48 provider offices in `3on6-site/content/providers.ts`.

## What's in it

- **Brand:** Aqua `#65C7CF`, Dark Navy `#193543`, Highlight Yellow `#D8D82E`, Light Navy `#326A85`. Headlines are Avenir Next Condensed.
- **Consultation form:** three questions plus the visitor's provider and contact details, sent to HighLevel. It appears in the hero, on office and treatment pages, and at the end of every page.
- **Provider finder:** at `/providers`, with search, tier filters, a "Near me" sort and a US map. Each visitor is matched to their nearest office automatically.
- **Office pages:** all 48 at `/office/<slug>`. Old Wix links like `/office/smile-clinic-(utah)` redirect to them.
- **Same URLs as Wix:** `/what-is-3-on-6`, `/3-on-6-plus`, `/before-and-after`, `/patient-stories`, `/3on6-vs-alternatives`, `/faq`, `/guarantee`, `/our-story-mission`, `/blog` and `/post/<slug>`.

## 1 · Run it

```bash
cd 3on6-site
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000  ·  Studio at /studio
```

## 2 · Deploy (GitHub → Vercel)

1. In Vercel, choose **Add New → Project** and import this repo.
2. Set **Root Directory** to `3on6-site`. Vercel then detects Next.js on its own.
3. Add the env vars from `3on6-site/.env.example`. None are required for a first preview.
4. Deploy. Every push to `main` redeploys the site.

3on6.com stays on Wix until you point the domain at Vercel.

## 3 · Bring the Wix content across

Run these on your Mac, inside `3on6-site`:

```bash
npm run migrate:wix        # all 67 blog posts, privacy policy, terms → content/wix/content.json
npm run pull:wix-images    # logo, 29 before/afters, patient photos → public/img/3on6/
```

Commit the results and push. The site picks up the migrated copy without needing Sanity.

## 4 · Leads → HighLevel

Set `HL_TOKEN` and `HL_LOCATION` in Vercel for the 3 on 6 sub-account. Each lead is tagged:

- `3on6-website`
- `provider-<office>`
- `tier-<tier>`
- `channel-<channel>`
- one tag per answer

A note on each contact carries the office's name, doctor, phone and website. A HighLevel workflow on `provider-*` forwards each lead to its office. To test first, set `HL_TEST_TOKEN` and `HL_TEST_LOCATION`, which send every lead to a test sub-account.

## Before launch

- [ ] Run the two Wix scripts above
- [ ] Set `NEXT_PUBLIC_LOGO_SRC=/img/3on6/logo-white.png` (until then the logo is a text wordmark)
- [ ] Review the drafted FAQ answers (all tabs except Consultation) in `app/(site)/faq/page.tsx`
- [ ] Check the office map coordinates in `content/providers.ts`. They're city-level estimates.
- [ ] Confirm the 10-year cost figure ($3,500 vs $3,000 in the cost article)
- [ ] Add the HighLevel and tracking IDs in Vercel

## Map

```
3on6-site/
  app/(site)/page.tsx            home
  app/(site)/providers           provider finder      · office/[slug] office pages
  app/(site)/[...slug]           What is 3 on 6, 3 on 6 Plus, other pages
  app/(site)/post/[slug]         blog posts            · /blog with categories
  app/api/consult                form → HighLevel
  app/site.css                   design system (brand tokens at the top)
  components/                    Hero, BookingForm, ProviderFinder, UsMap, SmileFrames, VideoStory…
  content/providers.ts           all 48 offices
  content/seed.ts                starter content
  middleware.ts                  nearest-provider match + old Wix office redirects
  sanity/schemas                 content model
  scripts/                       seed, Wix migration, Wix image download
```
