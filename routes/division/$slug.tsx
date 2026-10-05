import { createFileRoute } from '@tanstack/react-router'
import { divisions } from '../../data/divisions'
import { Detail } from '../../components/sections/division/Detail'

export const Route = createFileRoute('/division/$slug')({
  component: Division,
})

function Division() {
  const { slug } = Route.useParams()
  const division = divisions.find((item) => item.slug === slug)

  if (!division) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold">Division not found</h1>
      </div>
    )
  }

  return <Detail division={division.name} />
}