import { useEffect, useRef } from 'react'

import { mountVenom } from './engine'
import './venom.css'

export default function VenomButton() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || host.dataset.venom) return
    host.dataset.venom = '1'
    mountVenom(host)
  }, [])

  return (
    <div className="venom-slot">
      <div ref={hostRef} className="venom-host">
        <canvas id="stage" aria-hidden="true" />
        <button id="venom" className="venom" type="button" aria-label="Get in touch">
          Get in touch
        </button>
        {/* kept for the vendored engine; hidden by CSS */}
        <p id="hint" className="hint" />
        <button id="tuneToggle" type="button" aria-expanded="false" aria-controls="panel" className="tune-toggle" />
        <aside id="panel" className="panel" hidden aria-label="Physics tuning" />
      </div>
    </div>
  )
}
