import { describe, it, expect, vi } from 'vitest'
import { cityHash64WithSeed, parseCityHash64Seed } from './cityhash64'
import { routes } from './routes'
import * as toolInfo from './info'
import * as indexExports from './index'

vi.mock('./CityHash64HashTextOrFileView.vue', () => ({
  default: { name: 'CityHash64HashTextOrFileView' },
}))

describe('parseCityHash64Seed', () => {
  it('parses decimal and hex seeds', () => {
    expect(parseCityHash64Seed('42')).toEqual({ value: 42n, isValid: true })
    expect(parseCityHash64Seed('0x2a')).toEqual({ value: 42n, isValid: true })
    expect(parseCityHash64Seed('0X2A')).toEqual({ value: 42n, isValid: true })
  })

  it('treats empty input as zero', () => {
    expect(parseCityHash64Seed('')).toEqual({ value: 0n, isValid: true })
    expect(parseCityHash64Seed('   ')).toEqual({ value: 0n, isValid: true })
  })

  it('rejects invalid seeds', () => {
    expect(parseCityHash64Seed('nope')).toEqual({ value: 0n, isValid: false })
    expect(parseCityHash64Seed('-1')).toEqual({ value: 0n, isValid: false })
  })

  it('wraps seeds to uint64', () => {
    const seed = parseCityHash64Seed('18446744073709551616')
    expect(seed).toEqual({ value: 0n, isValid: true })
  })
})

describe('cityHash64WithSeed', () => {
  it('hashes with a seed value', () => {
    const hash = cityHash64WithSeed('hello world', 123n)
    expect(hash).toBe(6428291611287794170n)
  })

  it('returns uint64 output', () => {
    const hash = cityHash64WithSeed('hello world', 1n)
    expect(BigInt.asUintN(64, hash)).toBe(hash)
  })
})

describe('tool metadata', () => {
  it('exposes routes matching the tool path', () => {
    expect(routes[0]?.path).toBe(toolInfo.path)
  })

  it('loads the route component', async () => {
    const component = await routes[0]?.component?.()
    expect(component?.default).toBeDefined()
  })

  it('re-exports tool info from index', () => {
    expect(indexExports.toolInfo.toolID).toBe(toolInfo.toolID)
  })
})
