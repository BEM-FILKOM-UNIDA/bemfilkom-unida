import { createFileRoute } from '@tanstack/react-router'
import { Intro } from '../components/sections/contact/Intro'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return <Intro />
}