import { describe, expect, test } from 'bun:test'
import { existsSync } from 'node:fs'
import { nav } from './nav'

const routeFile = (to: string) => (to === '/' ? 'routes/index.tsx' : `routes${to}.tsx`)

describe('nav', () => {
  test('targets are unique', () => {
    expect(new Set(nav.map((link) => link.to)).size).toBe(nav.length)
  })

  test('every target has a route file', () => {
    for (const link of nav) {
      expect({ to: link.to, exists: existsSync(routeFile(link.to)) }).toEqual({
        to: link.to,
        exists: true,
      })
    }
  })

  test('labels are filled in', () => {
    for (const link of nav) {
      expect(link.label.trim()).not.toBe('')
    }
  })
})