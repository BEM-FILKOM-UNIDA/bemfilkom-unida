import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">BEM FILKOM UNIDA</h1>
      <p className="mt-4 text-lg">Content goes here — team to fill in.</p>
    </div>
  )
}
