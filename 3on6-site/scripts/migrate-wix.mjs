#!/usr/bin/env node
/**
 * Wix → Sanity content migration for 3on6.com.
 *
 * Crawls the live Wix sitemap and pulls every page's text (headings, paragraphs,
 * lists, quotes, links, YouTube embeds) plus every blog post, converts it to
 * Portable Text, and maps it onto the Sanity documents this site uses — keeping
 * the same URLs.
 *
 *   npm run migrate:wix                 # crawl + write files for review (no Sanity writes)
 *   npm run migrate:wix -- --push       # also write into Sanity (needs SANITY_API_WRITE_TOKEN)
 *   npm run migrate:wix -- --only=/our-guarantee,/post/some-post   # just these paths
 *
 * Output (content/wix-export/):
 *   raw/<path>.json         everything extracted from each page, for review
 *   wix-import.ndjson       new pages + posts (import with `npm run import:wix`)
 *   patches.json            body/FAQ updates for the treatment pages (What is 3 on 6, 3 on 6 Plus)
 *   images.csv              every image URL found, by page, so you can grab them from Wix
 *   report.md               what was found, skipped, and needs a human look
 *
 *   ../wix/content.json     the same copy in the site's own content files — commit this
 *                           to GitHub and the site uses it, no Sanity needed
 *
 * Images are NOT migrated (listed in images.csv instead).
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import * as cheerio from 'cheerio'

const ORIGIN = process.env.WIX_ORIGIN || 'https://www.3on6.com'
const OUT = 'content/wix-export'
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]))
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 3on6Migration/1.0'
const DELAY = Number(args.delay || 600)

// Paths that map to structured docs in this site. Everything else becomes a `page`.
const TREATMENTS = ['what-is-3-on-6', '3-on-6-plus']
const LOCATIONS = []
// Pages rebuilt as dedicated routes / handled elsewhere — crawled for review but not imported as pages.
// Office pages come from content/providers.ts; their raw text is still saved for review.
const SKIP_IMPORT = new Set(['', 'blog', 'providers', 'provider', 'patient-stories', 'before-and-after', 'faq', 'guarantee', '3on6-vs-alternatives', 'our-story-mission'])
// Campaign / landing pages: imported with noindex so nothing breaks, but flagged in the report.
const LANDING = /^(lp-|follow-|no-pressure|advantagetran|refer-a-patient|[a-z]{2}-3on6-v-ao4|utah-3-on-6)/

mkdirSync(join(OUT, 'raw'), { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xml' } })
      if (r.ok) return await r.text()
      if (r.status === 404) return null
    } catch {}
    await sleep(1500 * (i + 1))
  }
  return null
}

// ---------------------------------------------------------------- sitemap --
async function discover() {
  if (args.only) return String(args.only).split(',').map((p) => ORIGIN + (p.startsWith('/') ? p : '/' + p))
  const urls = new Set()
  const index = await get(`${ORIGIN}/sitemap.xml`)
  const children = index ? [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : []
  for (const sm of children.length ? children : [`${ORIGIN}/pages-sitemap.xml`, `${ORIGIN}/blog-posts-sitemap.xml`, `${ORIGIN}/dynamic-office-sitemap.xml`]) {
    if (!sm.endsWith('.xml')) { urls.add(sm); continue }
    const xml = await get(sm)
    if (!xml) { console.warn('  ! could not read', sm); continue }
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) if (!m[1].endsWith('.xml')) urls.add(m[1])
    await sleep(DELAY)
  }
  // Fallback for the blog: walk /blog pagination if the posts sitemap was blocked.
  if (![...urls].some((u) => u.includes('/post/'))) {
    for (let page = 1; page < 30; page++) {
      const html = await get(page === 1 ? `${ORIGIN}/blog` : `${ORIGIN}/blog/page/${page}`)
      if (!html) break
      const found = [...html.matchAll(/href="(https?:\/\/[^"]+\/post\/[^"?#]+)"/g)].map((m) => m[1])
      const before = urls.size
      found.forEach((u) => urls.add(u))
      if (urls.size === before) break
      await sleep(DELAY)
    }
  }
  return [...urls].filter((u) => u.startsWith(ORIGIN.replace('www.', '')) || u.startsWith(ORIGIN))
}

// ------------------------------------------------------- html → portable --
let k = 0
const key = () => 'w' + (k++).toString(36)
const norm = (s) => s.replace(/​/g, '').replace(/\s+/g, ' ').trim()

function inline($, el, markDefs) {
  const spans = []
  const walk = (node, marks) => {
    if (node.type === 'text') { const t = node.data.replace(/\s+/g, ' '); if (t) spans.push({ _type: 'span', _key: key(), text: t, marks: [...marks] }); return }
    if (node.type !== 'tag') return
    const tag = node.name
    let m = marks
    if (tag === 'strong' || tag === 'b') m = [...m, 'strong']
    else if (tag === 'em' || tag === 'i') m = [...m, 'em']
    else if (tag === 'a') {
      let href = $(node).attr('href') || ''
      if (href.startsWith(ORIGIN) || href.startsWith(ORIGIN.replace('www.', ''))) href = href.replace(/^https?:\/\/(www\.)?3on6\.com/, '') || '/'
      if (href) { const id = key(); markDefs.push({ _key: id, _type: 'link', href }); m = [...m, id] }
    } else if (tag === 'br') { spans.push({ _type: 'span', _key: key(), text: '\n', marks: [] }); return }
    node.children?.forEach((c) => walk(c, m))
  }
  el.children?.forEach((c) => walk(c, []))
  // trim + merge
  if (spans.length) { spans[0].text = spans[0].text.trimStart(); spans[spans.length - 1].text = spans[spans.length - 1].text.trimEnd() }
  return spans.filter((s) => s.text)
}

function extract(html, url) {
  const $ = cheerio.load(html)
  const meta = {
    title: norm($('meta[property="og:title"]').attr('content') || $('title').text() || ''),
    description: norm($('meta[name="description"]').attr('content') || ''),
    ogImage: $('meta[property="og:image"]').attr('content') || '',
  }
  $('script,style,noscript,svg,iframe[src*="google.com/maps"]').remove()
  $('#SITE_HEADER, #SITE_FOOTER, header, footer, [data-testid="mobile-menu"], #WIX_ADS').remove()

  const isPost = url.includes('/post/')
  const scope = isPost ? ($('[data-hook="post-description"]').first().length ? $('[data-hook="post-description"]').first() : $('article').first()) : ($('#PAGES_CONTAINER').length ? $('#PAGES_CONTAINER') : $('main').length ? $('main') : $('body'))

  const blocks = [], images = [], videos = [], seen = new Set()
  scope.find('h1,h2,h3,h4,h5,h6,p,li,blockquote,img,iframe,wow-image img').each((_, el) => {
    const tag = el.name
    if (tag === 'img') {
      const src = $(el).attr('src') || $(el).attr('data-src') || ''
      if (src && !src.startsWith('data:')) images.push({ src: src.split('/v1/')[0], alt: $(el).attr('alt') || '' })
      return
    }
    if (tag === 'iframe') { const s = $(el).attr('src') || ''; const m = s.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/); if (m) videos.push(`https://www.youtube.com/watch?v=${m[1]}`); return }
    // Skip containers whose text is re-emitted by children
    if ((tag === 'p' || tag === 'li') && $(el).find('p,li,h1,h2,h3,h4').length) return
    const text = norm($(el).text())
    if (!text || text.length < 2) return
    const sig = tag[0] + text
    if (seen.has(sig)) return // Wix renders mobile + desktop copies of the same text
    seen.add(sig)
    const markDefs = []
    const children = inline($, el, markDefs)
    if (!children.length) return
    const style = /^h[1-6]$/.test(tag) ? (tag === 'h1' ? 'h1' : tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : 'h4') : tag === 'blockquote' ? 'blockquote' : 'normal'
    blocks.push({ _type: 'block', _key: key(), style, markDefs, children, ...(tag === 'li' ? { listItem: $(el).parent().is('ol') ? 'number' : 'bullet', level: 1 } : {}) })
  })
  // YouTube links that Wix renders as video players without iframes in SSR
  for (const m of html.matchAll(/youtube\.com\/(?:watch\?v=|embed\/)([\w-]{11})/g)) videos.push(`https://www.youtube.com/watch?v=${m[1]}`)

  // Post metadata
  const post = isPost ? {
    title: norm($('[data-hook="post-title"]').first().text()) || meta.title.replace(/\s*\|.*$/, ''),
    publishedAt: $('meta[property="article:published_time"]').attr('content') || $('time').first().attr('datetime') || null,
    category: norm($('[data-hook="category-label-list__item"], [data-hook="post-category-label"]').first().text()) || null,
    cover: meta.ogImage,
  } : null

  // FAQ heuristic: a heading or bold line ending in "?" followed by answer paragraphs.
  const faqs = []
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i], q = b.children.map((c) => c.text).join('')
    if (!q.trim().endsWith('?') || q.length > 180) continue
    const ans = []
    for (let j = i + 1; j < blocks.length && blocks[j].style === 'normal' && !blocks[j].children.map((c) => c.text).join('').trim().endsWith('?'); j++) ans.push(blocks[j].children.map((c) => c.text).join(''))
    if (ans.length) faqs.push({ _type: 'faqItem', _key: key(), question: norm(q), answer: norm(ans.join('\n\n')) })
  }

  // Drop the H1 from body (it becomes the title); keep the first paragraph as intro.
  const h1 = blocks.find((b) => b.style === 'h1')
  const body = blocks.filter((b) => b !== h1).map((b) => (b.style === 'h1' ? { ...b, style: 'h2' } : b))
  const intro = body.find((b) => b.style === 'normal' && !b.listItem)
  return {
    url, meta, post, faqs, images, videos: [...new Set(videos)],
    title: h1 ? norm(h1.children.map((c) => c.text).join('')) : meta.title.replace(/\s*\|.*$/, ''),
    intro: intro ? norm(intro.children.map((c) => c.text).join('')) : meta.description,
    body: [...body, ...[...new Set(videos)].map((v) => ({ _type: 'youtube', _key: key(), url: v }))],
  }
}

// ------------------------------------------------------------------- main --
const pathOf = (u) => new URL(u).pathname.replace(/^\/|\/$/g, '')
const id = (type, slug) => `${type}-${slug.replace(/[^a-z0-9-]/gi, '-')}`
const urls = await discover()
console.log(`Found ${urls.length} URLs on ${ORIGIN}`)

const ndjson = [], patches = [], imageRows = ['page,image_url,alt'], report = ['# Wix migration report', '', `Crawled ${new Date().toISOString()} from ${ORIGIN}`, '']
const failed = [], landing = [], skipped = []

for (const url of urls) {
  const path = pathOf(url)
  process.stdout.write(`  · /${path} … `)
  const html = await get(url)
  if (!html) { failed.push(path); console.log('failed'); continue }
  const d = extract(html, url)
  writeFileSync(join(OUT, 'raw', (path || 'home').replace(/\//g, '__') + '.json'), JSON.stringify(d, null, 2))
  d.images.forEach((im) => imageRows.push(`/${path},${im.src},"${(im.alt || '').replace(/"/g, "'")}"`))
  console.log(`${d.body.length} blocks, ${d.faqs.length} faqs, ${d.images.length} images`)

  const seo = { _type: 'seo', title: d.meta.title || undefined, description: d.meta.description || undefined, ...(LANDING.test(path) ? { noindex: true } : {}) }
  if (path.startsWith('post/')) {
    const slug = path.slice(5)
    ndjson.push({ _id: id('post', slug), _type: 'post', title: d.post.title, slug: { _type: 'slug', current: slug }, publishedAt: d.post.publishedAt || undefined,
      category: d.post.category || undefined, excerpt: d.meta.description || d.intro, body: d.body, legacyUrl: url, seo })
    if (d.post.cover) imageRows.push(`/${path},${d.post.cover},cover`)
  } else if (path.startsWith('office/')) {
    skipped.push(path)
  } else if (TREATMENTS.includes(path) || LOCATIONS.includes(path)) {
    const type = TREATMENTS.includes(path) ? 'treatment' : 'location'
    patches.push({ id: id(type, path), set: { body: d.body, ...(d.faqs.length ? { faqs: d.faqs } : {}), seo }, legacyUrl: url })
  } else if (SKIP_IMPORT.has(path)) {
    skipped.push(path)
  } else {
    if (LANDING.test(path)) landing.push(path)
    ndjson.push({ _id: id('page', path), _type: 'page', title: d.title, slug: { _type: 'slug', current: path }, intro: d.intro,
      body: d.body, faqs: d.faqs.length ? d.faqs : undefined, showConsult: !['privacy-policy', 'terms'].includes(path), legacyUrl: url, seo })
  }
  await sleep(DELAY)
}

const clean = (o) => JSON.parse(JSON.stringify(o))
// No-CMS mode: the site reads this file directly (lib/data.ts), so committing it to GitHub publishes the Wix copy.
mkdirSync('content/wix', { recursive: true })
const strip = ({ _id, _type, ...d }) => ({ ...d, slug: d.slug?.current ?? d.slug })
writeFileSync('content/wix/content.json', JSON.stringify(clean({
  crawledAt: new Date().toISOString(), origin: ORIGIN,
  pages: ndjson.filter((d) => d._type === 'page').map(strip),
  posts: ndjson.filter((d) => d._type === 'post').map(strip),
  patches: Object.fromEntries(patches.map((p) => [p.id, p.set])),
}), null, 2))
writeFileSync(join(OUT, 'wix-import.ndjson'), ndjson.map((d) => JSON.stringify(clean(d))).join('\n') + '\n')
writeFileSync(join(OUT, 'patches.json'), JSON.stringify(clean(patches), null, 2))
writeFileSync(join(OUT, 'images.csv'), imageRows.join('\n') + '\n')
report.push(`- **${ndjson.filter((d) => d._type === 'page').length} pages** and **${ndjson.filter((d) => d._type === 'post').length} blog posts** → wix-import.ndjson`,
  `- **${patches.length} treatment page bodies** → patches.json`,
  `- **${imageRows.length - 1} images** listed in images.csv (not migrated)`, '',
  '## Needs a look', '',
  failed.length ? `- Could not fetch: ${failed.map((p) => '`/' + p + '`').join(', ')}` : '- Every URL fetched.',
  landing.length ? `- Campaign/landing pages imported as **noindex** pages (decide keep / redirect): ${landing.map((p) => '`/' + p + '`').join(', ')}` : '',
  skipped.length ? `- Rebuilt as dedicated routes, text saved in raw/ only: ${skipped.map((p) => '`/' + (p || '') + '`').join(', ')}` : '',
  '- The FAQ tabs, treatment estimator and provider map load with JavaScript on Wix, so their text may be missing from raw/. Compare raw/faq.json with app/(site)/faq/page.tsx.',
  '- Office pages are skipped: provider details live in content/providers.ts (or the Provider documents in Sanity).',
  '- Skim raw/*.json for any repeated nav/footer text that slipped into a body.')
writeFileSync(join(OUT, 'report.md'), report.filter((l) => l !== '').join('\n') + '\n')
console.log(`\nDone → ${OUT}/ (see report.md)`)

// --------------------------------------------------------------- push --
if (args.push) {
  const { createClient } = await import('@sanity/client')
  const env = existsSync('.env.local') ? Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => l.split(/=(.*)/s).slice(0, 2))) : {}
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) { console.error('--push needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN'); process.exit(1) }
  const client = createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2025-01-01', token, useCdn: false })
  let tx = client.transaction()
  ndjson.forEach((d) => (tx = tx.createOrReplace(clean(d))))
  for (const p of patches) {
    const exists = await client.getDocument(p.id)
    if (exists) tx = tx.patch(p.id, (q) => q.set(clean(p.set)))
    else console.warn(`  ! ${p.id} not in Sanity yet — run the seed import first, then re-run --push`)
  }
  await tx.commit({ autoGenerateArrayKeys: true })
  console.log(`Pushed ${ndjson.length} docs and ${patches.length} patches to Sanity.`)
}
