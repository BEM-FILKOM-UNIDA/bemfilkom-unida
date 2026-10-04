import { Link } from '@tanstack/react-router'
import { nav, type NavItem } from '../../data/nav'

export function NavLinks({ links = nav }: { links?: NavItem[] }) {
  return (
    <nav className="flex flex-wrap gap-x-4 gap-y-1">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-slate-600 hover:text-black"
          activeProps={{ className: 'font-semibold text-black' }}
          activeOptions={{ exact: link.to === '/' }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export function NavbarHeader({ links = nav }: { links?: NavItem[] }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight">
          BEM FILKOM UNIDA
        </Link>
        <NavLinks links={links} />
      </div>
    </header>
  )
}
