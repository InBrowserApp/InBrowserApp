import { describe, expect, it } from 'vitest'
import { parseOption } from './options'
import type { ParsedRun } from './types'

const createParsedRun = (): ParsedRun => ({
  command: [],
  environment: [],
  envFiles: [],
  ports: [],
  volumes: [],
  tmpfs: [],
  networks: [],
  extraHosts: [],
  labels: [],
  capAdd: [],
  capDrop: [],
  dns: [],
  dnsSearch: [],
  devices: [],
  securityOpt: [],
  sysctls: [],
  expose: [],
  links: [],
})

describe('docker run options parser', () => {
  it('skips empty tokens', () => {
    const data = createParsedRun()
    const warnings: string[] = []

    const nextIndex = parseOption([''], 0, data, warnings)

    expect(nextIndex).toBe(1)
    expect(warnings).toEqual([])
  })

  it('routes long and short options', () => {
    const data = createParsedRun()
    const warnings: string[] = []

    const longNext = parseOption(['--name', 'api'], 0, data, warnings)
    const shortNext = parseOption(['-p', '8080:80'], 0, data, warnings)

    expect(longNext).toBe(2)
    expect(shortNext).toBe(2)
    expect(data.name).toBe('api')
    expect(data.ports).toEqual(['8080:80'])
  })
})
