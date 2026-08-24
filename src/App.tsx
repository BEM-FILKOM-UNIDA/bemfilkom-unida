const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

function VideoBackground() {
  return (
    <video
      className="absolute inset-0 z-0 h-full w-full object-cover"
      src={VIDEO_SRC}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}

function Navbar() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
      <a href="#" className="block">
        <img
          src="/bem-logo.webp"
          alt="BEM FILKOM UNIDA"
          className="h-10 w-auto"
        />
      </a>
      <div className="hidden items-center gap-8 md:flex">
        <a
          href="#"
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          Your Time is Coming.
        </a>
      </div>
      <a
        href="#register"
        className="liquid-glass text-foreground cursor-pointer rounded-full px-6 py-2.5 text-sm transition-transform hover:scale-[1.03]"
      >
        Stay Tuned
      </a>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center px-4 pb-24 pt-24 text-center sm:px-6 sm:pb-32 sm:pt-36">
      <h1 className="animate-fade-rise text-foreground font-display max-w-7xl text-4xl font-normal leading-[0.95] tracking-[-1px] sm:text-6xl sm:tracking-[-2.46px] md:text-8xl">
        Coming Soon — Open Recruitment
      </h1>
      <p className="animate-fade-rise-delay text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:mt-8 sm:text-lg">
        BEM FILKOM UNIDA 2026 - 2027
      </p>
      <a
        href="#register"
        className="liquid-glass animate-fade-rise-delay-2 text-foreground mt-10 cursor-pointer rounded-full px-10 py-4 text-base transition-transform hover:scale-[1.03] active:scale-[0.98] sm:mt-12 sm:px-14 sm:py-5"
      >
        Stay Tuned
      </a>
    </section>
  )
}

import Register from './Register'
import { useEffect, useState } from 'react'

function App() {
  const [page, setPage] = useState<'home' | 'register'>('home')

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash === '#register' ? 'register' : 'home')
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (page === 'register') {
    return (
      <div className="bg-background relative h-dvh overflow-y-auto text-foreground antialiased">
        <VideoBackground />
        <Navbar />
        <Register />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-dvh overflow-hidden text-foreground antialiased">
      <VideoBackground />
      <Navbar />
      <Hero />
    </div>
  )
}

export default App
