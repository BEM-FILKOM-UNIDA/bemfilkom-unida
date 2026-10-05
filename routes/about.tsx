import { createFileRoute } from '@tanstack/react-router'
import { Intro } from '../components/sections/about/Intro'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return <Intro />
}