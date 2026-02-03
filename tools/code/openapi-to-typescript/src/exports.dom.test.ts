import { describe, expect, it, vi } from 'vitest'

vi.mock('@vicons/fluent/BracesVariable20Regular', () => ({
  default: {},
}))

import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('openapi-to-typescript exports', () => {
  it('exposes tool metadata and routes', () => {
    expect(index.toolInfo.toolID).toBe(toolInfo.toolID)
    expect(routes[0]?.path).toBe(toolInfo.path)
    expect(routes[0]?.name).toBe(toolInfo.toolID)
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBeTruthy()
  })
})
