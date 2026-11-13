import imageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null

/** Accepts a Sanity image object, a plain URL string, or nothing. Always returns a usable src or ''. */
export function img(source: unknown, width?: number): string {
  if (!source) return ''
  if (typeof source === 'string') return source
  const s = source as { url?: string; asset?: { url?: string; _ref?: string } }
  if (s.url) return s.url
  if (s.asset?.url) return s.asset.url
  if (builder && s.asset?._ref) {
    let b = builder.image(source as any).auto('format').fit('max')
    if (width) b = b.width(width)
    return b.url()
  }
  return ''
}
