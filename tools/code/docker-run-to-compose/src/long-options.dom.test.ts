import { describe, expect, it } from 'vitest'
import { parseLongOption } from './long-options'
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

const runLongOptions = (tokens: string[]) => {
  const data = createParsedRun()
  const warnings: string[] = []
  let index = 0
  while (index < tokens.length) {
    index = parseLongOption(tokens, index, data, warnings)
  }
  return { data, warnings }
}

describe('docker run long options', () => {
  it('parses supported flags and warnings', () => {
    const { data, warnings } = runLongOptions([
      '--name',
      'api',
      '--publish',
      '8080:80',
      '--publish-all',
      '--env',
      'NODE_ENV=production',
      '--env-file',
      '.env',
      '--volume',
      './data:/data',
      '--mount',
      'type=tmpfs,target=/cache,tmpfs-size=64m',
      '--network',
      'frontend',
      '--net',
      'bridge',
      '--restart',
      'unless-stopped',
      '--entrypoint',
      '/bin/sh',
      '--workdir',
      '/app',
      '--user',
      '1000:1000',
      '--hostname',
      'api',
      '--add-host',
      'db:127.0.0.1',
      '--label',
      'com.example=1',
      '--cap-add',
      'NET_ADMIN',
      '--cap-drop',
      'ALL',
      '--dns',
      '1.1.1.1',
      '--dns-search',
      'example.com',
      '--device',
      '/dev/null',
      '--security-opt',
      'seccomp=unconfined',
      '--sysctl',
      'net.core.somaxconn=1024',
      '--log-driver',
      'json-file',
      '--log-opt',
      'max-size=10m',
      '--health-cmd',
      'curl -f http://localhost',
      '--health-interval',
      '30s',
      '--health-timeout',
      '5s',
      '--health-retries',
      '3',
      '--health-start-period',
      '10s',
      '--no-healthcheck',
      '--init',
      '--privileged',
      '--read-only',
      '--rm',
      '--pull',
      '--platform',
      'linux/amd64',
      '--ipc',
      'host',
      '--pid',
      'host',
      '--shm-size',
      '64m',
      '--gpus',
      'count=all,device=0,1',
      '--cpus',
      '2',
      '--cpuset-cpus',
      '0,1',
      '--memory',
      '512m',
      '--memory-swap',
      '1g',
      '--expose',
      '3000',
      '--link',
      'db',
      '--tmpfs',
      '/tmp',
      '--ulimit',
      'nofile=1024:2048',
      '--interactive',
      '--tty',
      '--detach',
      '--unknown',
      'value',
    ])

    expect(data.name).toBe('api')
    expect(data.ports).toEqual(['8080:80'])
    expect(data.environment).toEqual(['NODE_ENV=production'])
    expect(data.envFiles).toEqual(['.env'])
    expect(data.volumes).toEqual(['./data:/data'])
    expect(data.tmpfs).toEqual(['/cache:size=64m', '/tmp'])
    expect(data.networks).toEqual(['frontend'])
    expect(data.networkMode).toBe('bridge')
    expect(data.logging?.driver).toBe('json-file')
    expect(data.logging?.options['max-size']).toBe('10m')
    expect(data.healthcheck?.disable).toBe(true)
    expect(data.gpus).toEqual({ count: 'all', deviceIds: ['0', '1'] })
    expect(data.ulimits?.nofile).toEqual({ soft: 1024, hard: 2048 })
    expect(data.stdinOpen).toBe(true)
    expect(data.tty).toBe(true)
    expect(data.platform).toBe('linux/amd64')

    expect(warnings).toContain('Publish-all (--publish-all) is not supported in Compose.')
    expect(warnings).toContain('Auto-remove (--rm) has no Compose equivalent.')
    expect(warnings).toContain('Pull policy (--pull) is ignored in Compose output.')
    expect(warnings).toContain('Detach mode (--detach) is ignored in Compose.')
    expect(warnings).toContain('Unsupported flag --unknown was ignored with value value.')
  })

  it('warns when values are missing', () => {
    const data = createParsedRun()
    const warnings: string[] = []

    parseLongOption(['--name'], 0, data, warnings)
    parseLongOption(['--env'], 0, data, warnings)

    expect(warnings).toContain('Missing value for --name.')
    expect(warnings).toContain('Missing value for --env.')
  })
})
