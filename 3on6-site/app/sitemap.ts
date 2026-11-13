import type { MetadataRoute } from 'next'
import { allPaths, getPosts, getProviders } from '@/lib/data'
const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.3on6.com'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [paths, posts, providers] = await Promise.all([allPaths(), getPosts(), getProviders()])
  const fixed = ['', 'providers', 'patient-stories', 'before-and-after', '3on6-vs-alternatives', 'faq', 'guarantee', 'our-story-mission', 'blog']
  const noindex = new Set(['privacy-policy', 'terms'])
  return [
    ...fixed.map((p) => ({ url: `${base}/${p}` })),
    ...paths.filter((p) => !noindex.has(p)).map((p) => ({ url: `${base}/${p}` })),
    ...providers.map((p) => ({ url: `${base}/office/${p.slug}` })),
    // Only posts with a body (migrated); empty ones are noindexed.
    ...posts.filter((p) => p.body?.length).map((p) => ({ url: `${base}/post/${p.slug}`, lastModified: p.publishedAt })),
  ]
}
