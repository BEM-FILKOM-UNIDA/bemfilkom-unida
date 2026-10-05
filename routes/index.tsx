import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/sections/home/Hero'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <Hero />
}