import { useEffect } from 'react'

import GooglyButton from './GooglyButton'
import PixelCloud from './PixelCloud'

function SkyBackground() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {/* ponytail: skyTop dinaikkan dari #3876ba ke #6ea8dc supaya teks gelap
          tetap AA di navbar; warna bawah persis seperti aslinya. */}
      <PixelCloud skyTopColor="#6ea8dc" skyBottomColor="#8cbfe8" />
    </div>
  )
}

function Navbar() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 short:py-2 sm:gap-6 sm:px-8 sm:py-6">
      <a href="#" className="block shrink-0">
        <img
          src="/bem-bar.webp"
          alt="BEM FILKOM UNIDA"
          width={160}
          height={192}
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
    <section className="relative z-10 flex flex-col items-center px-4 pb-24 pt-24 text-center short:pb-12 short:pt-12 sm:px-6 sm:pb-32 sm:pt-36">
      {/* ponytail: SEO keywords tanpa ubah visual — sr-only untuk crawler & screen reader */}
      <p className="sr-only">
        BEM FILKOM UNIDA — BEM Fakultas Ilmu Komputer Universitas Djuanda, Fakultas Ilmu Komputer
        Universitas Djuanda Bogor, Universitas Djuanda, KABINET EKAKARSA BEM FILKOM UNIDA Pengembangan Sumber Daya Mahasiswa
      </p>
      <h1 className="animate-fade-rise text-foreground font-display max-w-7xl text-4xl font-normal leading-[0.95] tracking-[-1px] sm:text-6xl sm:tracking-[-2.46px] md:text-7xl lg:text-8xl">
        <span className="inline">Under development</span>
      </h1>
      <p className="animate-fade-rise-delay text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:mt-6 sm:max-w-2xl sm:text-base md:text-lg">
        When yh diriku bisa bersamanya
      </p>
      <p className="animate-fade-rise-delay text-muted-foreground/60 mt-3 max-w-2xl text-xs tracking-wide sm:text-sm">
        BEM Fakultas Ilmu Komputer Universitas Djuanda Bogor
      </p>
      <div className="animate-fade-rise-delay-2 mt-10 short:mt-6 sm:mt-12">
        <GooglyButton />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 mt-auto flex flex-wrap items-center justify-center gap-1.5 px-4 py-5 text-center text-[10px] tracking-[0.14em] text-muted-foreground/70 sm:gap-2 sm:px-6 sm:py-6 sm:text-[11px]">
      <span>POWERED BY</span>
      {/* ponytail: ganti src ke /psdm-logo.webp saat file tersedia */}
      <img
        src="/bem-bar.webp"
        alt="KABINET EKAKARSA FILKOM UNIDA"
        width={160}
        height={192}
        loading="lazy"
        className="h-4 w-auto opacity-80 sm:h-5"
        onError={(e) => ((e.currentTarget.style.display = 'none'))}
      />
      <span className="font-medium tracking-[0.12em] text-muted-foreground">KABINET EKAKARSA</span>
    </footer>
  )
}

function App() {
  useEffect(() => {
    const preloader = document.getElementById('preloader')
    if (preloader) preloader.classList.add('hidden')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById('preloader')
      if (preloader) preloader.classList.add('hidden')
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-background flex min-h-dvh flex-col overflow-hidden text-foreground antialiased">
      <SkyBackground />
      <Navbar />
      <Hero />
      <Footer />
    </div>
  )
}

export default App
