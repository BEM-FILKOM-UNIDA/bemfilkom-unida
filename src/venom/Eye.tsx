import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Googly eye from the old pill button: the pupil leans toward the cursor.
export default function Eye({ smirk = false, side = 'left' }: { smirk?: boolean; side?: 'left' | 'right' }) {
  const eyeRef = useRef<HTMLDivElement>(null)
  const pupilX = useMotionValue(0)
  const pupilY = useMotionValue(0)
  const springX = useSpring(pupilX, { stiffness: 300, damping: 20 })
  const springY = useSpring(pupilY, { stiffness: 300, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return
      const rect = eyeRef.current.getBoundingClientRect()
      const eyeCenterX = rect.left + rect.width / 2
      const eyeCenterY = rect.top + rect.height / 2

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX)
      // 9px cap: just inside the 28px socket
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
      className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white shadow-inner"
    >
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
        className="absolute h-2.5 w-2.5 rounded-full"
      />
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
