import { Link } from '@tanstack/react-router'
import { divisions } from '../../../data/divisions'

export function DivisionCards() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold">Divisions</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {divisions.map((division) => (
          <li key={division.slug}>
            <Link
              to="/division/$slug"
              params={{ slug: division.slug }}
              className="block rounded-lg border p-4 hover:border-black"
            >
              <span className="font-semibold">{division.name}</span>
              <span className="mt-2 block text-sm text-slate-600">
                {division.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}