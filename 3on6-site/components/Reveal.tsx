'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Adds .in to [data-in] and [data-stagger] children as they scroll into view. */
export default function Reveal() {
  const path = usePathname()
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-in]:not(.in)')
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => { e.classList.add('in'); e.querySelectorAll(':scope > *').forEach((c) => c.classList.add('in')) })
      return
    }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return
      const el = en.target as HTMLElement
      el.classList.add('in')
      const gap = Number(el.dataset.stagger || 0)
      if (el.hasAttribute('data-stagger')) Array.from(el.children).forEach((c, i) => setTimeout(() => c.classList.add('in'), i * gap))
      io.unobserve(el)
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [path])
  return null
}
