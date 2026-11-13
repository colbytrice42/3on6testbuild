'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { PROVIDER_COOKIE, PROVIDER_SRC_COOKIE } from '@/lib/providers'
import type { Tier } from '@/lib/types'

export type ProviderLite = { slug: string; name: string; tier: Tier; doctors: string[]; city: string; state: string; phoneDisplay?: string; phoneE164?: string; website?: string; lat?: number; lng?: number }

/** Shared booking state, so the hero card and the closing card never ask the same question twice.
 *  Only the non-identifying answers are kept in the browser (to resume a return visit). Name, phone and
 *  email are never stored. The provider is a slug from the cookie the middleware sets (nearest by IP) or
 *  the one the visitor picked. */
export const QUESTION_KEYS = ['smile_goal', 'familiarity', 'investment'] as const
const STORE = 'p3-consult-answers'
type Answers = Record<string, string>
type Ctx = {
  answers: Answers
  set: (k: string, v: string) => void
  submitted: boolean
  markSubmitted: () => void
  /** Bumps when the header CTA is pressed; the closing form jumps to the next unanswered step. */
  jump: number
  finish: () => void
  provider: string
  providers: ProviderLite[]
  chooseProvider: (slug: string) => void
}
const C = createContext<Ctx>({ answers: {}, set: () => {}, submitted: false, markSubmitted: () => {}, jump: 0, finish: () => {}, provider: '', providers: [], chooseProvider: () => {} })

const readCookie = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([a-z0-9-]+)`))?.[1] || ''

export function ConsultProvider({ children, providers = [] }: { children: ReactNode; providers?: ProviderLite[] }) {
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [jump, setJump] = useState(0)
  const [provider, setProvider] = useState('')
  const path = usePathname()
  useEffect(() => {
    const onPage = /^\/office\/([^/]+)/.exec(path)?.[1]
    const known = (s?: string) => !!s && providers.some((p) => p.slug === s)
    setProvider(known(onPage) ? onPage! : known(readCookie(PROVIDER_COOKIE)) ? readCookie(PROVIDER_COOKIE) : '')
  }, [path]) // eslint-disable-line react-hooks/exhaustive-deps
  const chooseProvider = (slug: string) => {
    const age = 60 * 60 * 24 * 30
    document.cookie = `${PROVIDER_COOKIE}=${slug}; path=/; max-age=${age}; samesite=lax`
    document.cookie = `${PROVIDER_SRC_COOKIE}=chosen; path=/; max-age=${age}; samesite=lax`
    setProvider(slug)
  }
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORE) || '{}'); if (saved && typeof saved === 'object') setAnswers(saved) } catch {}
  }, [])
  const set = (k: string, v: string) => setAnswers((a) => {
    const next = { ...a, [k]: v }
    try { localStorage.setItem(STORE, JSON.stringify(next)) } catch {}
    return next
  })
  const markSubmitted = () => { setSubmitted(true); try { localStorage.removeItem(STORE) } catch {} }
  const finish = () => {
    const el = document.getElementById('consult')
    el?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    setJump((n) => n + 1)
  }
  return <C.Provider value={{ answers, set, submitted, markSubmitted, jump, finish, provider, providers, chooseProvider }}>{children}</C.Provider>
}
export const useConsult = () => useContext(C)
