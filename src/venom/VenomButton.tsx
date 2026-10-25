import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'

import Eye from './Eye'
import { mountVenom } from './engine'
import './venom.css'

export default function VenomButton() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [clicked, setClicked] = useState(false)
  const label = clicked ? 'Will touch you' : 'Get in touch'

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
      </div>
    </div>
  )
}
