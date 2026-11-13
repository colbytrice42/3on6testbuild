export type Link = { label: string; href: string }
export type NavGroup = Link & { children?: Link[] }
export type Faq = { question: string; answer: string; category?: string }
export type SeedBlock = { h?: string; p?: string[]; list?: string[] }
/** Portable Text, or the simple seed shape (converted by lib/data.ts). */
export type Body = any[]
export type ImageSrc = string | Record<string, any> | undefined
export type Seo = { title?: string; description?: string; image?: ImageSrc; noindex?: boolean }

export type Settings = {
  title: string; tagline?: string; email?: string; primaryCta?: string
  nav: NavGroup[]; footer?: NavGroup[]; social?: { platform: string; url: string }[]; footerNote?: string; seo?: Seo
}
export type Home = {
  eyebrow?: string; headline: string; subhead?: string; heroNote?: string; formTitle?: string
  compareHeading?: string; compareRows?: { label: string; ours: string; theirs: string }[]
  storiesHeading?: string; storiesIntro?: string; testimonials?: Testimonial[]
  beforeAfterHeading?: string; beforeAfterIntro?: string; beforeAfters?: BeforeAfter[]
  costHeading?: string; costIntro?: string; costRows?: { label: string; allOn4: string; threeOn6: string }[]; costFine?: string
  guaranteeHeading?: string; guaranteeLede?: string; guaranteePoints?: string[]; guaranteeFine?: string
  steps?: { title: string; text: string }[]
  boneHeading?: string; boneBody?: string
  seo?: Seo
}
export type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Licensed' | 'New'
export type Provider = {
  slug: string; name: string; tier: Tier; doctors: string[]
  street?: string; city: string; state: string; zip?: string
  phoneDisplay?: string; phoneE164?: string; website?: string
  lat?: number; lng?: number
  /** The old Wix URL segment (/office/<wixSlug>) — kept so old links redirect. */
  wixSlug?: string
  photo?: ImageSrc; intro?: string; order?: number; seo?: Seo
  /** false = hidden from the finder, sitemap and lead routing (e.g. a provider who left the network). */
  active?: boolean
}
export type Treatment = {
  slug: string; title: string; summary?: string; headline?: string; image?: ImageSrc
  highlights?: { label: string; text: string }[]; steps?: { title: string; text: string }[]
  body?: Body; faqs?: Faq[]; order?: number; seo?: Seo
}
export type Testimonial = { slug?: string; name: string; place?: string; treatment?: string; quote?: string; rating?: number; photo?: ImageSrc; videoUrl?: string; videoTitle?: string }
export type BeforeAfter = { slug?: string; title?: string; caption?: string; before: ImageSrc; after: ImageSrc; beforeAlt?: string; afterAlt?: string }
export type Page = {
  slug: string; title: string; eyebrow?: string; intro?: string; heroImage?: ImageSrc; body?: Body
  faqs?: Faq[]; faqsFrom?: string; cta?: Link; showConsult?: boolean; seo?: Seo
}
export type Post = {
  slug: string; title: string; publishedAt?: string; category?: string; excerpt?: string
  coverImage?: ImageSrc; body?: Body; seo?: Seo
}
export type Content = {
  settings: Settings; home: Home; providers: Provider[]; treatments: Treatment[]
  testimonials: Testimonial[]; beforeAfters: BeforeAfter[]; pages: Page[]; posts: Post[]
}
