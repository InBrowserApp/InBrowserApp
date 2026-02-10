import { describe, it, expect } from 'vitest'
import { tools } from './index'

describe('redirect tools', () => {
  it('lists external tools with required metadata', () => {
    expect(tools).toHaveLength(5)

    const ids = tools.map((tool) => tool.toolID)
    expect(ids).toEqual([
      'look-scanned',
      'tldr-inbrowser-app',
      'authenticator-inbrowser-app',
      'macaddress-inbrowser-app',
      'squoosh-app',
    ])

    tools.forEach((tool) => {
      expect(tool.external).toBe(true)
      expect(tool.features).toContain('offline')
      expect(tool.path.startsWith('https://')).toBe(true)
      expect(tool.meta.en?.name).toBeTruthy()
    })

    const squoosh = tools.find((tool) => tool.toolID === 'squoosh-app')
    expect(squoosh?.thirdParty).toBe(true)
  })
})
