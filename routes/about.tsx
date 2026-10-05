import { createFileRoute } from '@tanstack/react-router'
import { DivisionCards } from '../components/sections/about/DivisionCards'
import { Intro } from '../components/sections/about/Intro'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <>
      <Intro />
      <DivisionCards />
    </>
  )
}