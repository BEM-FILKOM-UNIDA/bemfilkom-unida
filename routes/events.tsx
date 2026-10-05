import { createFileRoute } from '@tanstack/react-router'
import { Intro } from '../components/sections/events/Intro'

export const Route = createFileRoute('/events')({
  component: Events,
})

function Events() {
  return <Intro />
}