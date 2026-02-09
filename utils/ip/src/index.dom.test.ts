import { describe, expect, it } from 'vitest'
import { IPInfoProviders, getDomainIPs, getMyIPProviders, getMyIPv4, getMyIPv6 } from './index'

describe('ip utils index', () => {
  it('re-exports top-level ip helpers', () => {
    expect(Array.isArray(IPInfoProviders)).toBe(true)
    expect(Array.isArray(getMyIPProviders)).toBe(true)
    expect(typeof getDomainIPs).toBe('function')
    expect(typeof getMyIPv4).toBe('function')
    expect(typeof getMyIPv6).toBe('function')
  })
})
