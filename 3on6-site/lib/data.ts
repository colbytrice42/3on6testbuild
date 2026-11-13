/**
 * One data layer for the whole site.
 * - Sanity configured  → GROQ queries (ISR, revalidates every 60s).
 * - Not configured yet → content/seed.ts + content/providers.ts, so the site runs on first deploy.
 * Migrated Wix copy (content/wix/content.json, written by `npm run migrate:wix`) is layered on top of the seed.
 */
import { cache } from 'react'
import { client } from '@/sanity/lib/client'
import { seed as starter } from '@/content/seed'
import wix from '@/content/wix/content.json'
import { toPortable } from './portable'
import type { BeforeAfter, Home, Page, Post, Provider, Settings, Testimonial, Treatment } from './types'

const W = wix as { pages?: any[]; posts?: any[]; patches?: Record<string, any> }
const patch = <T extends { slug: string }>(type: string, list: T[]) =>
  list.map((d) => ({ ...d, ...(W.patches?.[`${type}-${d.slug.replace(/[^a-z0-9-]/gi, '-')}`] ?? {}) }))
const overlay = <T extends { slug: string }>(base: T[], extra: any[] = []) => {
  const m = new Map(base.map((d) => [d.slug, d]))
  extra.forEach((d) => m.set(d.slug, { ...(m.get(d.slug) ?? {}), ...d }))
  return [...m.values()] as T[]
}
const seed = {
  ...starter,
  treatments: patch('treatment', starter.treatments),
  pages: overlay(starter.pages, W.pages),
  posts: overlay(starter.posts, W.posts),
}

const REVALIDATE = 60
/** Returns null (→ use seed) when Sanity isn't configured, errors, or has no matching content yet. */
async function q<T>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  if (!client) return null
  try {
    const r = await client.fetch<T>(query, params, { next: { revalidate: REVALIDATE } })
    if (r == null || (Array.isArray(r) && r.length === 0)) return null
    return r
  } catch (e) {
    console.error('[sanity]', e)
    return null
  }
}
/** Sanity docs win by slug; seed docs fill any gaps, so a half-migrated dataset never 404s a page. */
async function merged<T extends { slug: string }>(query: string, fallback: T[], sort?: (a: T, b: T) => number): Promise<T[]> {
  const live = (await q<T[]>(query)) ?? []
  const bySlug = new Map(fallback.map((d) => [d.slug, d]))
  live.filter((d) => d?.slug).forEach((d) => bySlug.set(d.slug, { ...(bySlug.get(d.slug) ?? {}), ...d }))
  const out = [...bySlug.values()]
  return sort ? out.sort(sort) : out
}
const byOrder = (a: { order?: number }, b: { order?: number }) => (a.order ?? 99) - (b.order ?? 99)

const slug = `"slug": slug.current`
const img = (f: string) => `"${f}": ${f}{..., asset->{url}}`

export const getSettings = cache(async (): Promise<Settings> =>
  (await q<Settings>(`*[_id=="siteSettings"][0]`)) ?? seed.settings)

export const getTestimonials = cache(async (): Promise<Testimonial[]> =>
  (await q<Testimonial[]>(`*[_type=="testimonial"]|order(order asc){..., ${img('photo')}}`)) ?? seed.testimonials)

export const getBeforeAfters = cache(async (): Promise<BeforeAfter[]> =>
  (await q<BeforeAfter[]>(`*[_type=="beforeAfter"]|order(order asc){..., ${img('before')}, ${img('after')}, "beforeAlt": before.alt, "afterAlt": after.alt}`)) ?? seed.beforeAfters)

/** Every provider, including inactive ones (page routing). */
export const getAllProviders = cache(async (): Promise<Provider[]> =>
  merged<Provider>(`*[_type=="provider"]{..., ${slug}, ${img('photo')}}`, seed.providers, byOrder))
/** Active providers: the finder, sitemap, form and nearest-provider blocks. */
export const getProviders = cache(async (): Promise<Provider[]> => (await getAllProviders()).filter((p) => p.active !== false))
export const getProvider = async (s: string) => (await getAllProviders()).find((p) => p.slug === s) ?? null

export const getTreatments = cache(async (): Promise<Treatment[]> =>
  merged<Treatment>(`*[_type=="treatment"]{..., ${slug}, ${img('image')}}`, seed.treatments, byOrder))

export const getHome = cache(async (): Promise<Home> => {
  const h = await q<Home>(`*[_id=="homePage"][0]{..., "testimonials": testimonials[]->{..., ${img('photo')}}, "beforeAfters": beforeAfters[]->{..., ${img('before')}, ${img('after')}, "beforeAlt": before.alt, "afterAlt": after.alt}}`)
  const home = h ?? seed.home
  return {
    ...seed.home, ...home,
    testimonials: home.testimonials?.length ? home.testimonials : await getTestimonials(),
    beforeAfters: home.beforeAfters?.length ? home.beforeAfters : (await getBeforeAfters()).slice(0, 3),
  }
})

export const getPages = cache(async (): Promise<Page[]> =>
  merged<Page>(`*[_type=="page"]{..., ${slug}, ${img('heroImage')}}`, seed.pages))

export const getPosts = cache(async (): Promise<Post[]> =>
  merged<Post>(`*[_type=="post"]{..., ${slug}, ${img('coverImage')}}`, seed.posts, (a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '')))

export async function getPost(s: string) {
  const p = (await getPosts()).find((x) => x.slug === s)
  return p ? { ...p, body: toPortable(p.body) } : null
}

/** Paths served by the catch-all route (treatment and generic pages). Dedicated routes are not listed here. */
export async function resolvePath(path: string) {
  const [treatments, pages] = await Promise.all([getTreatments(), getPages()])
  const t = treatments.find((x) => x.slug === path)
  if (t) return { kind: 'treatment' as const, doc: { ...t, body: toPortable(t.body) } }
  const p = pages.find((x) => x.slug === path)
  if (p) {
    const faqs = p.faqs?.length ? p.faqs : p.faqsFrom ? treatments.find((x) => x.slug === p.faqsFrom)?.faqs : undefined
    return { kind: 'page' as const, doc: { ...p, faqs, body: toPortable(p.body) } }
  }
  return null
}

export async function allPaths() {
  const [t, p] = await Promise.all([getTreatments(), getPages()])
  return [...t, ...p].map((x) => x.slug)
}
