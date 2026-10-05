import { describe, expect, test } from 'bun:test'
import { divisions } from './divisions'

describe('divisions', () => {
  test('slugs are unique', () => {
    expect(new Set(divisions.map((item) => item.slug)).size).toBe(divisions.length)
  })

  test('slugs are url safe', () => {
    for (const item of divisions) {
      expect(item.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
  })

  test('names and descriptions are filled in', () => {
    for (const item of divisions) {
      expect({ name: item.name.trim(), description: item.description.trim() }).toEqual({
        name: item.name.trim(),
        description: item.description.trim(),
      })
      expect(item.name.trim().length).toBeGreaterThan(0)
      expect(item.description.trim().length).toBeGreaterThan(0)
    }
  })
})