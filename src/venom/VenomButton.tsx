import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'

import Eye from './Eye'
import { mountVenom } from './engine'
import './venom.css'

const LABELS = ['Get in touch', 'Will touch you'] as const

export default function VenomButton() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [clicked, setClicked] = useState(false)
  const label = LABELS[clicked ? 1 : 0]

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
        <MotionConfig reducedMotion="user">
          <button
            id="venom"
            className="venom"
            type="button"
            aria-label={label}
            aria-pressed={clicked}
            onClick={() => setClicked((v) => !v)}
          >
            <span className="venom-label">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="venom-label-text"
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="venom-eyes" aria-hidden="true">
              <Eye smirk={clicked} side="left" />
              <Eye smirk={clicked} side="right" />
            </span>
          </button>
        </MotionConfig>
        {/* kept for the vendored engine; hidden by CSS */}
        <button id="tuneToggle" type="button" aria-expanded="false" aria-controls="panel" className="tune-toggle" />
        <aside id="panel" className="panel" hidden aria-label="Physics tuning" />
      </div>
    </div>
  )
}
