'use client'
import { useEffect } from 'react'

/** HighLevel (LeadConnector) external tracking script for the 3 on 6 sub-account: page views and form
 *  submissions in HighLevel attribution. Off until NEXT_PUBLIC_HL_TRACKING_ID is set. */
const ID = process.env.NEXT_PUBLIC_HL_TRACKING_ID
const SRC = 'https://link.msgsndr.com/js/external-tracking.js'

export default function HighLevelTracking() {
  useEffect(() => {
    if (!ID || document.querySelector(`script[src="${SRC}"]`)) return
    const s = document.createElement('script')
    s.src = SRC; s.async = true; s.setAttribute('data-tracking-id', ID)
    document.body.appendChild(s)
  }, [])
  return null
}
