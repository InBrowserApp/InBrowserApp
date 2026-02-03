import { describe, expect, it } from 'vitest'
import { buildService } from './service-builder'
import type { ParsedRun } from './types'

const createParsedRun = (overrides: Partial<ParsedRun> = {}): ParsedRun => ({
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
  ...overrides,
})

describe('docker run service builder', () => {
  it('builds a service with resources and metadata', () => {
    const data = createParsedRun({
      name: 'My Service@sha256:abc',
      image: 'nginx:latest',
      command: ['node', 'server.js'],
      entrypoint: '/bin/sh',
      environment: ['NODE_ENV=production'],
      envFiles: ['.env'],
      ports: ['8080:80'],
      volumes: ['data:/var/lib/data'],
      tmpfs: ['/tmp'],
      networks: ['frontend'],
      restart: 'unless-stopped',
      workdir: '/app',
      user: '1000',
      hostname: 'api',
      extraHosts: ['db:127.0.0.1'],
      labels: ['com.example=1'],
      capAdd: ['NET_ADMIN'],
      capDrop: ['ALL'],
      dns: ['1.1.1.1'],
      dnsSearch: ['example.com'],
      devices: ['/dev/null'],
      securityOpt: ['seccomp=unconfined'],
      sysctls: ['net.core.somaxconn=1024', 'fs.protected_hardlinks=1'],
      expose: ['3000'],
      links: ['db'],
      logging: { driver: 'json-file', options: { 'max-size': '10m' } },
      healthcheck: {
        test: ['CMD-SHELL', 'curl -f http://localhost'],
        interval: '30s',
        timeout: '5s',
        retries: 3,
        startPeriod: '10s',
      },
      cpus: '1.5',
      memory: '512m',
      gpus: { count: 1, deviceIds: ['0'] },
      stdinOpen: true,
      tty: true,
      privileged: true,
      readOnly: true,
      init: true,
      ipc: 'host',
      pid: 'host',
      platform: 'linux/amd64',
      ulimits: { nofile: { soft: 1024, hard: 2048 } },
      cpuset: '0,1',
      memswap: '1g',
      shmSize: '64m',
    })

    const { serviceName, service, volumeNames } = buildService(data, new Map())

    expect(serviceName).toBe('my-service')
    expect(service.container_name).toBe('My Service@sha256:abc')
    expect(service.image).toBe('nginx:latest')
    expect(service.command).toEqual(['node', 'server.js'])
    expect(service.environment).toEqual(['NODE_ENV=production'])
    expect(service.env_file).toEqual(['.env'])
    expect(service.ports).toEqual(['8080:80'])
    expect(service.volumes).toEqual(['data:/var/lib/data'])
    expect(service.tmpfs).toEqual(['/tmp'])
    expect(service.networks).toEqual(['frontend'])
    expect(service.logging).toEqual({ driver: 'json-file', options: { 'max-size': '10m' } })
    expect(service.healthcheck).toMatchObject({ interval: '30s', retries: 3 })
    expect(service.deploy).toMatchObject({
      resources: {
        limits: { cpus: '1.5', memory: '512m' },
        reservations: {
          devices: [
            {
              capabilities: ['gpu'],
              count: 1,
              device_ids: ['0'],
            },
          ],
        },
      },
    })
    expect(volumeNames).toEqual(['data'])
  })

  it('honors network mode and healthcheck disable', () => {
    const data = createParsedRun({
      name: '!!!',
      image: 'redis:7',
      networks: ['frontend'],
      networkMode: 'host',
      healthcheck: { disable: true },
      sysctls: ['kernel.shmmax'],
    })

    const { serviceName, service } = buildService(data, new Map())

    expect(serviceName).toBe('service')
    expect(service.network_mode).toBe('host')
    expect(service.networks).toBeUndefined()
    expect(service.healthcheck).toEqual({ disable: true })
    expect(service.sysctls).toEqual(['kernel.shmmax'])
  })

  it('increments service names for duplicates', () => {
    const usedNames = new Map<string, number>()
    const data = createParsedRun({ image: 'nginx:latest' })

    const first = buildService(data, usedNames)
    const second = buildService(data, usedNames)

    expect(first.serviceName).toBe('nginx')
    expect(second.serviceName).toBe('nginx-2')
  })
})
