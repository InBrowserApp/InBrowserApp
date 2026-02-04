import { describe, expect, it } from 'vitest'
import { parseShortOptions } from './short-options'
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

describe('docker run short options', () => {
  it('handles combined flags', () => {
    const data = createParsedRun()
    const warnings: string[] = []

    parseShortOptions(['-itd'], 0, data, warnings)

    expect(data.stdinOpen).toBe(true)
    expect(data.tty).toBe(true)
    expect(warnings).toContain('Detach mode (-d) is ignored in Compose.')
  })

  it('parses values and warns for unsupported flags', () => {
    const data = createParsedRun()
    const warnings: string[] = []
    const tokens = [
      '-p8080:80',
      '-e',
      'NODE_ENV=production',
      '-v',
      '/data:/data',
      '-w',
      '/app',
      '-u',
      '1000:1000',
      '-m',
      '512m',
      '-P',
      '-xvalue',
    ]

    let index = 0
    while (index < tokens.length) {
      index = parseShortOptions(tokens, index, data, warnings)
    }

    expect(data.ports).toEqual(['8080:80'])
    expect(data.environment).toEqual(['NODE_ENV=production'])
    expect(data.volumes).toEqual(['/data:/data'])
    expect(data.workdir).toBe('/app')
    expect(data.user).toBe('1000:1000')
    expect(data.memory).toBe('512m')
    expect(warnings).toContain('Publish-all (-P) is not supported in Compose.')
    expect(warnings).toContain('Unsupported short flag -x was ignored with value value.')
  })

  it('warns when values are missing', () => {
    const data = createParsedRun()
    const warnings: string[] = []

    const missingFlags: Array<[string, string]> = [
      ['-p', 'Missing value for -p.'],
      ['-e', 'Missing value for -e.'],
      ['-v', 'Missing value for -v.'],
      ['-w', 'Missing value for -w.'],
      ['-u', 'Missing value for -u.'],
      ['-m', 'Missing value for -m.'],
    ]

    for (const [flag] of missingFlags) {
      parseShortOptions([flag], 0, data, warnings)
    }

    for (const [, message] of missingFlags) {
      expect(warnings).toContain(message)
    }
  })

  it('handles single flags and empty tokens', () => {
    const data = createParsedRun()
    const warnings: string[] = []

    parseShortOptions([''], 0, data, warnings)
    parseShortOptions(['-i'], 0, data, warnings)
    parseShortOptions(['-x'], 0, data, warnings)

    expect(data.stdinOpen).toBe(true)
    expect(warnings).toContain('Unsupported short flag -x was ignored.')
  })
})
