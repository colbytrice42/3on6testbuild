import type { SeedBlock } from './types'

let k = 0
const key = () => `k${(k++).toString(36)}`
const span = (text: string) => ({ _type: 'span', _key: key(), text, marks: [] })
const block = (style: string, text: string, listItem?: string) => ({
  _type: 'block', _key: key(), style, markDefs: [], children: [span(text)], ...(listItem ? { listItem, level: 1 } : {}),
})

/** Converts the simple seed body shape into Portable Text. Already-PT arrays pass through. */
export function toPortable(body: any[] | undefined): any[] {
  if (!body?.length) return []
  if (body[0]?._type) return body
  return (body as SeedBlock[]).flatMap((b) => [
    ...(b.h ? [block('h2', b.h)] : []),
    ...(b.p || []).map((t) => block('normal', t)),
    ...(b.list || []).map((t) => block('normal', t, 'bullet')),
  ])
}

/** "Dr. Traver Maxwell" → "Dr. Maxwell" (how patients refer to their doctor). */
export const drShort = (name: string) => {
  const parts = name.replace(/^Dr\.?\s*/i, '').trim().split(/\s+/)
  return `Dr. ${parts[parts.length - 1]}`
}
