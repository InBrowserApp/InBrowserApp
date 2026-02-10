import { describe, expect, it } from 'vitest'
import { routes } from './routes'
import { tools } from './index'

describe('uuid exports', () => {
  it('exposes routes for uuid tools', () => {
    const paths = routes.map((route) => route.path)

    expect(paths).toEqual(
      expect.arrayContaining(['/tools/uuid-v4-generator', '/tools/uuid-decoder', '/tools/uuid']),
    )
  })

  it('exposes tool info entries', () => {
    const ids = tools.map((tool) => tool.toolID)

    expect(ids).toEqual(expect.arrayContaining(['uuid-v4-generator', 'uuid-decoder', 'uuid-tools']))
    expect(ids.length).toBeGreaterThan(10)
  })
})
