/** The 3 on 6 wordmark, set in Avenir Next Condensed so it stays sharp at any size and takes the
 *  current text colour (white on navy, navy on light). Swap in the official artwork with LOGO_SRC once
 *  `npm run pull:wix-images` has downloaded it (public/img/3on6/logo-white.png). */
const LOGO_SRC = process.env.NEXT_PUBLIC_LOGO_SRC || ''

export default function Logo({ className = '' }: { className?: string }) {
  if (LOGO_SRC) return <img className={`logo ${className}`} src={LOGO_SRC} alt="3 on 6" width={164} height={62} />
  return (
    <span className={`logo ${className}`} role="img" aria-label="3 on 6">
      <span aria-hidden="true" className="logo__n">3</span>
      <span aria-hidden="true" className="logo__on">on</span>
      <span aria-hidden="true" className="logo__n">6</span>
      <sup aria-hidden="true">™</sup>
    </span>
  )
}
