import { createFileRoute } from '@tanstack/react-router'
import { Intro } from '../components/sections/division/Intro'

export const Route = createFileRoute('/division')({
  component: Division,
})

function Division() {
  return <Intro />
}