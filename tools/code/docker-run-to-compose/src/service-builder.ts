import type { ComposeService, ParsedRun } from './types'
import { splitKeyValue } from './utils'
import { normalizeVolumeEntry } from './volume'

export function buildService(
  data: ParsedRun,
  usedNames: Map<string, number>,
): {
  serviceName: string
  service: ComposeService
  networkNames: string[]
  volumeNames: string[]
} {
  const networkNames = Array.from(new Set(data.networks))
  const volumeNames = new Set<string>()

  const serviceName = buildServiceName(data.name ?? data.image ?? 'service', usedNames)
  const service: ComposeService = {
    image: data.image,
  }

  if (data.name) {
    service.container_name = data.name
  }

  if (data.command.length) {
    service.command = data.command
  }

  if (data.entrypoint) {
    service.entrypoint = data.entrypoint
  }

  if (data.environment.length) {
    service.environment = data.environment
  }

  if (data.envFiles.length) {
    service.env_file = data.envFiles
  }

  if (data.ports.length) {
    service.ports = data.ports
  }

  if (data.volumes.length) {
    const volumeEntries = data.volumes.map((entry) => normalizeVolumeEntry(entry, volumeNames))
    service.volumes = volumeEntries
  }

  if (data.tmpfs.length) {
    service.tmpfs = data.tmpfs
  }

  if (data.networkMode) {
    service.network_mode = data.networkMode
  } else if (networkNames.length) {
    service.networks = networkNames
  }

  if (data.restart) {
    service.restart = data.restart
  }

  if (data.workdir) {
    service.working_dir = data.workdir
  }

  if (data.user) {
    service.user = data.user
  }

  if (data.hostname) {
    service.hostname = data.hostname
  }

  if (data.extraHosts.length) {
    service.extra_hosts = data.extraHosts
  }

  if (data.labels.length) {
    service.labels = data.labels
  }

  if (data.capAdd.length) {
    service.cap_add = data.capAdd
  }

  if (data.capDrop.length) {
    service.cap_drop = data.capDrop
  }

  if (data.dns.length) {
    service.dns = data.dns
  }

  if (data.dnsSearch.length) {
    service.dns_search = data.dnsSearch
  }

  if (data.devices.length) {
    service.devices = data.devices
  }

  if (data.securityOpt.length) {
    service.security_opt = data.securityOpt
  }

  if (data.sysctls.length) {
    service.sysctls = buildSysctlValue(data.sysctls)
  }

  if (data.expose.length) {
    service.expose = data.expose
  }

  if (data.links.length) {
    service.links = data.links
  }

  if (data.logging) {
    service.logging = data.logging
  }

  if (data.healthcheck) {
    service.healthcheck = buildHealthcheck(data.healthcheck)
  }

  if (data.stdinOpen) {
    service.stdin_open = true
  }

  if (data.tty) {
    service.tty = true
  }

  if (data.privileged) {
    service.privileged = true
  }

  if (data.readOnly) {
    service.read_only = true
  }

  if (data.init) {
    service.init = true
  }

  if (data.ipc) {
    service.ipc = data.ipc
  }

  if (data.pid) {
    service.pid = data.pid
  }

  if (data.platform) {
    service.platform = data.platform
  }

  if (data.ulimits && Object.keys(data.ulimits).length) {
    service.ulimits = data.ulimits
  }

  if (data.cpuset) {
    service.cpuset = data.cpuset
  }

  if (data.memswap) {
    service.memswap_limit = data.memswap
  }

  if (data.shmSize) {
    service.shm_size = data.shmSize
  }

  const deploy = buildDeploy(data)
  if (deploy) {
    service.deploy = deploy
  }

  return {
    serviceName,
    service,
    networkNames,
    volumeNames: Array.from(volumeNames),
  }
}

function buildDeploy(data: ParsedRun): Record<string, unknown> | undefined {
  const limits: Record<string, string> = {}
  if (data.cpus) {
    limits.cpus = data.cpus
  }
  if (data.memory) {
    limits.memory = data.memory
  }

  const resources: Record<string, unknown> = {}
  if (Object.keys(limits).length) {
    resources.limits = limits
  }

  if (data.gpus) {
    const device: Record<string, unknown> = {
      capabilities: ['gpu'],
    }
    if (data.gpus.count !== undefined) {
      device.count = data.gpus.count
    }
    if (data.gpus.deviceIds?.length) {
      device.device_ids = data.gpus.deviceIds
    }
    resources.reservations = {
      devices: [device],
    }
  }

  if (!Object.keys(resources).length) {
    return undefined
  }

  return {
    resources,
  }
}

function buildHealthcheck(health: {
  test?: string[]
  interval?: string
  timeout?: string
  retries?: number
  startPeriod?: string
  disable?: boolean
}): Record<string, unknown> {
  if (health.disable) {
    return { disable: true }
  }

  const output: Record<string, unknown> = {}
  if (health.test) {
    output.test = health.test
  }
  if (health.interval) {
    output.interval = health.interval
  }
  if (health.timeout) {
    output.timeout = health.timeout
  }
  if (health.retries !== undefined) {
    output.retries = health.retries
  }
  if (health.startPeriod) {
    output.start_period = health.startPeriod
  }
  return output
}

function buildSysctlValue(values: string[]): Record<string, string> | string[] {
  const map: Record<string, string> = {}
  const list: string[] = []

  for (const value of values) {
    const [key, val] = splitKeyValue(value)
    if (val === undefined) {
      list.push(value)
    } else {
      map[key] = val
    }
  }

  return list.length ? list : map
}

function buildServiceName(base: string, usedNames: Map<string, number>): string {
  const sanitized = sanitizeServiceName(base)
  const current = usedNames.get(sanitized) ?? 0
  if (current === 0) {
    usedNames.set(sanitized, 1)
    return sanitized
  }
  const next = current + 1
  usedNames.set(sanitized, next)
  return `${sanitized}-${next}`
}

function sanitizeServiceName(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/@.+$/, '')
    .replace(/:.+$/, '')
    .replace(/[^a-z0-9_.-]+/g, '-')
    .replace(/^-+/, '')

  if (!normalized) {
    return 'service'
  }

  return normalized
}
