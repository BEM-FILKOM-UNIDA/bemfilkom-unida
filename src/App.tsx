const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

function VideoBackground() {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    // ponytail: browser mobile suka mem-parkir video latar tanpa melanjutkan;
    // kick ulang play() tiap kejadian pause. Kalau iOS Low Power Mode tetap
    // menolak autoplay, satu-satunya obat adalah tap untuk play.
    const v = ref.current
    if (!v) return
    const resume = () => void v.play().catch(() => {})
    v.addEventListener('pause', resume)
    return () => v.removeEventListener('pause', resume)
  }, [])
  return (
    <video
      ref={ref}
      className="fixed inset-0 z-0 h-full w-full object-cover"
      src={VIDEO_SRC}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  )
}

function Navbar() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-8 sm:py-6">
      <a href="#" className="block shrink-0">
        <img
          src="/bem-logo.webp"
          alt="BEM FILKOM UNIDA"
          className="h-8 w-auto sm:h-10"
        />
      </a>
      <div className="hidden items-center gap-8 md:flex">
        <span className="text-muted-foreground whitespace-nowrap text-sm">BEM FILKOM UNIDA</span>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center px-4 pb-24 pt-24 text-center sm:px-6 sm:pb-32 sm:pt-36">
      {/* ponytail: SEO keywords tanpa ubah visual — sr-only untuk crawler & screen reader */}
      <p className="sr-only">
        BEM FILKOM UNIDA — BEM Fakultas Ilmu Komputer Universitas Djuanda, Fakultas Ilmu Komputer
        Universitas Djuanda Bogor, Universitas Djuanda, PSDM BEM FILKOM UNIDA Pengembangan Sumber Daya Mahasiswa
      </p>
      <h1 className="animate-fade-rise text-foreground font-display max-w-7xl text-4xl font-normal leading-[0.95] tracking-[-1px] sm:text-6xl sm:tracking-[-2.46px] md:text-8xl">
        <span className="block sm:inline">Open Recruitment</span>
      </h1>
      <p className="animate-fade-rise-delay text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:mt-8 sm:text-lg">
        Temukan ruang untuk belajar, berkontribusi, dan bekerja bersama.
      </p>
      <p className="animate-fade-rise-delay text-muted-foreground/60 mt-3 max-w-2xl text-xs tracking-wide sm:text-sm">
        BEM Fakultas Ilmu Komputer Universitas Djuanda Bogor
      </p>
      <a
        href="#register"
        className="liquid-glass animate-fade-rise-delay-2 text-foreground mt-10 cursor-pointer rounded-full px-7 py-2.5 text-sm transition-transform hover:scale-[1.03] active:scale-[0.98] sm:mt-12 sm:px-8 sm:py-3"
      >
        Daftar Sekarang
      </a>
    </section>
  )
}

import Register from './Register'
import { useEffect, useRef, useState } from 'react'

function Footer() {
  return (
    <footer className="relative z-10 mt-auto flex flex-wrap items-center justify-center gap-2 px-4 py-6 text-center text-[11px] tracking-[0.18em] text-muted-foreground/70 sm:py-8 sm:text-xs">
      <span>POWERED BY</span>
      {/* ponytail: ganti src ke /psdm-logo.webp saat file tersedia — fallback ke bem-logo */}
      <img
        src="/bem-logo.webp"
        alt="PSDM FILKOM UNIDA"
        className="h-5 w-auto opacity-80 sm:h-6"
        onError={(e) => ((e.currentTarget.style.display = 'none'))}
      />
      <span className="font-medium tracking-[0.14em] text-muted-foreground">PSDM FILKOM UNIDA</span>
    </footer>
  )
}

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
      <div className="bg-background relative flex min-h-dvh flex-col text-foreground antialiased">
        <VideoBackground />
        <Navbar />
        <Register />
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-dvh flex-col overflow-hidden text-foreground antialiased">
      <VideoBackground />
      <Navbar />
      <Hero />
      <Footer />
    </div>
  )
}

export default App
