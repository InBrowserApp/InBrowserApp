import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('bip39-mnemonic-generator exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('bip39-mnemonic-generator')
    expect(toolInfo.path).toBe('/tools/random/bip39-mnemonic-generator')
    expect(toolInfo.tags).toEqual([
      'bip39',
      'mnemonic',
      'seed',
      'wallet',
      'entropy',
      'crypto',
      'random',
      'generator',
      'validator',
    ])
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('BIP39 Mnemonic Generator')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(index).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe(toolInfo.toolID)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })
})
