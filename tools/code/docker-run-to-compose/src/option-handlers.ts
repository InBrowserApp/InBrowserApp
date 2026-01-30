import type { GpuConfig, ParsedRun } from './types'
import { splitKeyValue } from './utils'

export function applyMount(input: string, data: ParsedRun, warnings: string[]): void {
  const options = input.split(',').map((segment) => segment.trim())
  const mount: Record<string, string | boolean> = {}

  for (const option of options) {
    if (!option) {
      continue
    }
    if (option === 'readonly' || option === 'ro') {
      mount.readonly = true
      continue
    }
    if (option === 'rw') {
      mount.readonly = false
      continue
    }
    const [key, value] = splitKeyValue(option)
    if (value === undefined) {
      mount[key] = true
    } else {
      mount[key] = value
    }
  }

  const type = String(mount.type ?? 'bind')
  const source = String(mount.source ?? mount.src ?? '')
  const target = String(mount.target ?? mount.destination ?? mount.dst ?? '')

  if (!target) {
    warnings.push(`Skipped mount without a target: ${input}`)
    return
  }

  if (type === 'tmpfs') {
    const tmpfsSize =
      typeof mount['tmpfs-size'] === 'string'
        ? mount['tmpfs-size']
        : typeof mount.tmpfs_size === 'string'
          ? mount.tmpfs_size
          : undefined
    const tmpfsEntry = tmpfsSize ? `${target}:size=${tmpfsSize}` : target
    data.tmpfs.push(tmpfsEntry)
    return
  }

  const readOnly = mount.readonly === true
  if (!source) {
    data.volumes.push(readOnly ? `${target}:ro` : target)
    return
  }

  const volumeEntry = readOnly ? `${source}:${target}:ro` : `${source}:${target}`
  data.volumes.push(volumeEntry)
}

export function applyNetwork(value: string, data: ParsedRun): void {
  if (value === 'host' || value === 'none' || value === 'bridge') {
    data.networkMode = value
    return
  }
  data.networks.push(value)
}

export function parseGpus(input: string): GpuConfig {
  if (input === 'all') {
    return { count: 'all' }
  }

  if (/^\d+$/.test(input)) {
    return { count: Number.parseInt(input, 10) }
  }

  const config: GpuConfig = {}
  const parts = input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  let currentKey: string | null = null

  for (const part of parts) {
    if (part.includes('=')) {
      const [key, value] = splitKeyValue(part)
      currentKey = key
      if (!value) {
        continue
      }
      if (key === 'device') {
        config.deviceIds = value
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
        continue
      }
      if (key === 'count') {
        if (value === 'all') {
          config.count = 'all'
        } else if (/^\\d+$/.test(value)) {
          config.count = Number.parseInt(value, 10)
        }
      }
      continue
    }

    if (currentKey === 'device') {
      config.deviceIds = [...(config.deviceIds ?? []), part]
    }
  }

  return config
}

export function applyUlimit(
  input: string,
  ulimits: Record<string, { soft?: number; hard?: number } | number>,
): void {
  const [name, rawValue] = splitKeyValue(input)
  if (!rawValue) {
    return
  }
  if (rawValue.includes(':')) {
    const [softValue = '', hardValue = ''] = rawValue.split(':')
    const soft = Number.parseInt(softValue, 10)
    const hard = Number.parseInt(hardValue, 10)
    ulimits[name] = {
      soft: Number.isNaN(soft) ? undefined : soft,
      hard: Number.isNaN(hard) ? undefined : hard,
    }
    return
  }
  const parsed = Number.parseInt(rawValue, 10)
  if (!Number.isNaN(parsed)) {
    ulimits[name] = parsed
  }
}
