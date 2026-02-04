import { describe, expect, it } from 'vitest'
import { applyMount, applyNetwork, applyUlimit, parseGpus } from './option-handlers'
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

describe('docker run option handlers', () => {
  it('handles mounts and tmpfs entries', () => {
    const data = createParsedRun()
    const warnings: string[] = []

    applyMount('type=tmpfs,target=/cache,tmpfs-size=64m', data, warnings)
    applyMount('source=/data,target=/var,readonly', data, warnings)
    applyMount('source=/logs,target=/var/log,rw', data, warnings)
    applyMount('target=/cache', data, warnings)
    applyMount('type=bind,target=/opt,propagation,', data, warnings)
    applyMount('source=/missing', data, warnings)

    expect(data.tmpfs).toEqual(['/cache:size=64m'])
    expect(data.volumes).toContain('/data:/var:ro')
    expect(data.volumes).toContain('/logs:/var/log')
    expect(data.volumes).toContain('/cache')
    expect(warnings).toContain('Skipped mount without a target: source=/missing')
  })

  it('applies network mode and named networks', () => {
    const data = createParsedRun()

    applyNetwork('host', data)
    applyNetwork('frontend', data)

    expect(data.networkMode).toBe('host')
    expect(data.networks).toEqual(['frontend'])
  })

  it('parses gpu config options', () => {
    expect(parseGpus('all')).toEqual({ count: 'all' })
    expect(parseGpus('2')).toEqual({ count: 2 })
    expect(parseGpus('count=2')).toEqual({})
    expect(parseGpus('device=GPU-1,1')).toEqual({ deviceIds: ['GPU-1', '1'] })
    expect(parseGpus('device=,0')).toEqual({ deviceIds: ['0'] })
    expect(parseGpus('count=all,device=0,1')).toEqual({
      count: 'all',
      deviceIds: ['0', '1'],
    })
  })

  it('applies ulimit values', () => {
    const ulimits: Record<string, { soft?: number; hard?: number } | number> = {}

    applyUlimit('nofile', ulimits)
    applyUlimit('nofile=10:20', ulimits)
    applyUlimit('nproc=64', ulimits)
    applyUlimit('stack=bad:30', ulimits)

    expect(ulimits.nofile).toEqual({ soft: 10, hard: 20 })
    expect(ulimits.nproc).toBe(64)
    expect(ulimits.stack).toEqual({ soft: undefined, hard: 30 })
  })
})
