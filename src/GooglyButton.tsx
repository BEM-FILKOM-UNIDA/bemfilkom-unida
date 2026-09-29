import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useMotionValue, useSpring } from 'framer-motion'

// ponytail: showcase wrapper + "Hover eyes track cursor" hint + lucide Copy/Check
// + handleCopy + useTransform + promptContent dihapus — semuanya tidak pernah
// dirender (handleCopy tak pernah dipanggil), dan hint-nya bahasa dev untuk
// landing page publik.
function Eye({ smirk = false, side = 'left' }: { smirk?: boolean; side?: 'left' | 'right' }) {
  const eyeRef = useRef<HTMLDivElement>(null)
  const pupilX = useMotionValue(0)
  const pupilY = useMotionValue(0)

  // smooth physics
  const springX = useSpring(pupilX, { stiffness: 300, damping: 20 })
  const springY = useSpring(pupilY, { stiffness: 300, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return
      const rect = eyeRef.current.getBoundingClientRect()
      const eyeCenterX = rect.left + rect.width / 2
      const eyeCenterY = rect.top + rect.height / 2

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX)
      // ponytail: 9px & 18px tuned for the 28-32px eye below — retina merapat
      const distance = Math.min(9, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10)

      pupilX.set(Math.cos(angle) * distance)
      pupilY.set(Math.sin(angle) * distance)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [pupilX, pupilY])

  return (
    <motion.div
      ref={eyeRef}
      animate={smirk ? { scaleY: 0.42, rotate: side === 'left' ? -4 : 4 } : { scaleY: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white shadow-inner sm:h-8 sm:w-8"
    >
      {/* pupil: black dot normally, glowing red vertical slit when smirking */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{
          y: smirk ? 2 : 0,
          scaleX: smirk ? 0.5 : 1,
          scaleY: smirk ? 1.6 : 1,
          backgroundColor: smirk ? '#7A0000' : '#000000',
          boxShadow: smirk ? '0 0 6px 1px rgba(255,0,0,0.65)' : 'none',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="absolute h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
      />
      {/* angled evil brow, slants inward toward the center like a furrowed glare */}
      <motion.div
        initial={false}
        animate={{ height: smirk ? 18 : 0, rotate: smirk ? (side === 'left' ? 14 : -14) : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="pointer-events-none absolute -left-1.5 -right-1.5 -top-1 bg-[#0a0a0a]"
        style={{ transformOrigin: side === 'left' ? 'top right' : 'top left' }}
      />
    </motion.div>
  )
}

export default function GooglyButton() {
  const [clicked, setClicked] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <motion.button
        type="button"
        onClick={() => setClicked((prev) => !prev)}
        aria-pressed={clicked}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative flex cursor-pointer select-none items-center gap-2 rounded-full bg-black py-2 pl-4 pr-2 shadow-2xl sm:gap-3 sm:pl-5 sm:pr-2.5"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="relative mr-1 h-4 w-[82px] overflow-hidden sm:mr-1.5 sm:h-[18px] sm:w-[96px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={clicked ? 'clicked' : 'default'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center whitespace-nowrap text-xs font-semibold tracking-tight text-white sm:text-sm"
            >
              {clicked ? 'Will touch you' : 'Get in touch'}
            </motion.span>
          </AnimatePresence>
        </div>
        {/* decorative: button name comes from the label above */}
        <div className="flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
          <Eye smirk={clicked} side="left" />
          <Eye smirk={clicked} side="right" />
        </div>
      </motion.button>
    </MotionConfig>
  )
}
