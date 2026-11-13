import type { Metadata, Viewport } from 'next'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/barlow-condensed/800.css'
import '@fontsource-variable/nunito-sans/opsz.css'
import './site.css'
import { getSettings } from '@/lib/data'

const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.3on6.com'
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    metadataBase: new URL(site),
    title: { default: s.seo?.title || '3 on 6 · More Natural Dental Implants', template: '%s · 3 on 6' },
    description: s.seo?.description || s.tagline,
    openGraph: { type: 'website', siteName: '3 on 6' },
    icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23193543'/><text x='50' y='68' font-family='Avenir Next Condensed,Arial Narrow,sans-serif' font-weight='700' font-size='52' text-anchor='middle' fill='%2365C7CF'>3/6</text></svg>" },
  }
}
export const viewport: Viewport = { themeColor: '#193543' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Brand type is Avenir Next (Condensed for headlines). Apple devices have it built in; everyone else gets
            Barlow Condensed + Nunito Sans, self-hosted (no Google Fonts request). Add licensed Avenir web fonts to use it everywhere. */}
      </head>
      <body>{children}</body>
    </html>
  )
}
