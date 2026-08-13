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
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
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
      <button
        type="button"
        className="liquid-glass text-foreground cursor-pointer rounded-full px-6 py-2.5 text-sm transition-transform hover:scale-[1.03]"
      >
        Stay Tuned
      </button>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center px-6 pb-40 pt-32 text-center py-[90px]">
      <h1 className="animate-fade-rise text-foreground font-display max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] sm:text-7xl md:text-8xl">
        Coming Soon — Open Recruitment
      </h1>
      <p className="animate-fade-rise-delay text-muted-foreground mt-8 max-w-2xl text-base leading-relaxed sm:text-lg">
        BEM FILKOM UNIDA 2026 - 2027
      </p>
      <button
        type="button"
        className="liquid-glass animate-fade-rise-delay-2 text-foreground mt-12 cursor-pointer rounded-full px-14 py-5 text-base transition-transform hover:scale-[1.03]"
      >
        Stay Tuned
      </button>
    </section>
  )
}

export default function App() {
  return (
    <div className="bg-background min-h-screen overflow-hidden text-foreground antialiased">
      <VideoBackground />
      <Navbar />
      <Hero />
    </div>
  )
}
