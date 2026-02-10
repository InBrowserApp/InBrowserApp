import { describe, expect, it } from 'vitest'
import { IPInfoProviders } from './index'

describe('get-ip-info index', () => {
  it('exports providers in fallback order', () => {
    expect(IPInfoProviders.map((provider) => provider.name)).toEqual([
      'geojs.io',
      'ip.sb',
      'cloudflare-doh',
      'google-doh',
      'geojs.io-ptr',
    ])
  })

  it('exposes provider handlers', () => {
    for (const provider of IPInfoProviders) {
      expect(typeof provider.getIPInfo).toBe('function')
    }
  })
})
