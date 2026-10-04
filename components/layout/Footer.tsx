import { nav, type NavItem } from '../../data/nav'
import { NavLinks } from './NavbarHeader'

export function Footer({ links = nav }: { links?: NavItem[] }) {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-4 py-8 text-sm">
        <div>
          <p className="font-bold">BEM FILKOM UNIDA</p>
          <p className="text-slate-600">
            Badan Eksekutif Mahasiswa Fakultas Ilmu Komputer
          </p>
        </div>
        <NavLinks links={links} />
      </div>
      <p className="mx-auto max-w-5xl px-4 pb-6 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} BEM FILKOM UNIDA
      </p>
    </footer>
  )
}
