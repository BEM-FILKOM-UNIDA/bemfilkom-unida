export type NavItem = {
  to: string
  label: string
}

export const nav: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/division', label: 'Division' },
  { to: '/contact', label: 'Contact' },
]
