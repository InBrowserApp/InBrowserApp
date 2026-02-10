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

    const missingFlags: Array<[string, string]> = [
      ['--name', 'Missing value for --name.'],
      ['--publish', 'Missing value for --publish.'],
      ['--env', 'Missing value for --env.'],
      ['--env-file', 'Missing value for --env-file.'],
      ['--volume', 'Missing value for --volume.'],
      ['--mount', 'Missing value for --mount.'],
      ['--network', 'Missing value for --network.'],
      ['--net', 'Missing value for --net.'],
      ['--restart', 'Missing value for --restart.'],
      ['--entrypoint', 'Missing value for --entrypoint.'],
      ['--workdir', 'Missing value for --workdir.'],
      ['--user', 'Missing value for --user.'],
      ['--hostname', 'Missing value for --hostname.'],
      ['--add-host', 'Missing value for --add-host.'],
      ['--label', 'Missing value for --label.'],
      ['--cap-add', 'Missing value for --cap-add.'],
      ['--cap-drop', 'Missing value for --cap-drop.'],
      ['--dns', 'Missing value for --dns.'],
      ['--dns-search', 'Missing value for --dns-search.'],
      ['--device', 'Missing value for --device.'],
      ['--security-opt', 'Missing value for --security-opt.'],
      ['--sysctl', 'Missing value for --sysctl.'],
      ['--log-driver', 'Missing value for --log-driver.'],
      ['--log-opt', 'Missing value for --log-opt.'],
      ['--health-cmd', 'Missing value for --health-cmd.'],
      ['--health-interval', 'Missing value for --health-interval.'],
      ['--health-timeout', 'Missing value for --health-timeout.'],
      ['--health-retries', 'Missing value for --health-retries.'],
      ['--health-start-period', 'Missing value for --health-start-period.'],
      ['--platform', 'Missing value for --platform.'],
      ['--ipc', 'Missing value for --ipc.'],
      ['--pid', 'Missing value for --pid.'],
      ['--shm-size', 'Missing value for --shm-size.'],
      ['--gpus', 'Missing value for --gpus.'],
      ['--cpus', 'Missing value for --cpus.'],
      ['--cpuset-cpus', 'Missing value for --cpuset-cpus.'],
      ['--memory', 'Missing value for --memory.'],
      ['--memory-swap', 'Missing value for --memory-swap.'],
      ['--expose', 'Missing value for --expose.'],
      ['--link', 'Missing value for --link.'],
      ['--tmpfs', 'Missing value for --tmpfs.'],
      ['--ulimit', 'Missing value for --ulimit.'],
    ]

    for (const [flag] of missingFlags) {
      parseLongOption([flag], 0, data, warnings)
    }

    for (const [, message] of missingFlags) {
      expect(warnings).toContain(message)
    }
  })

  it('handles inline values and unsupported flags', () => {
    const data = createParsedRun()
    const warnings: string[] = []

    parseLongOption([''], 0, data, warnings)
    parseLongOption(['--name=api'], 0, data, warnings)
    parseLongOption(['--publish=8080:80'], 0, data, warnings)
    parseLongOption(['--unsupported=1'], 0, data, warnings)
    parseLongOption(['--unsupported'], 0, data, warnings)

    expect(data.name).toBe('api')
    expect(data.ports).toEqual(['8080:80'])
    expect(warnings).toContain('Unsupported flag --unsupported was ignored.')
  })
})
