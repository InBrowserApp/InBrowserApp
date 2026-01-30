export function normalizeVolumeEntry(input: string, volumeNames: Set<string>): string {
  const parts = splitVolume(input)
  if (parts.length === 1) {
    return input
  }
  if (parts.length === 2) {
    const target = parts[0] ?? ''
    const mode = parts[1] ?? ''
    if (target && mode && isContainerPath(target) && isVolumeMode(mode)) {
      return `${target}:${mode}`
    }
  }
  const source = parts[0] ?? ''
  const target = parts[1] ?? ''
  const mode = parts[2]

  if (!source || !target) {
    return input
  }

  if (source && isNamedVolume(source)) {
    volumeNames.add(source)
  }

  if (!mode) {
    return `${source}:${target}`
  }

  return `${source}:${target}:${mode}`
}

function splitVolume(value: string): string[] {
  const parts = value.split(':')
  if (parts.length <= 2) {
    return parts.filter(Boolean)
  }
  const first = parts[0] ?? ''
  const second = parts[1] ?? ''
  if (first && second && isWindowsPath(first, second)) {
    const source = `${first}:${second}`
    const target = parts[2]
    const mode = parts.slice(3).join(':') || undefined
    return [source, target, mode].filter(Boolean) as string[]
  }
  const mode = parts.slice(2).join(':') || undefined
  return [first, second, mode].filter(Boolean) as string[]
}

function isWindowsPath(first: string, second: string): boolean {
  return /^[A-Za-z]$/.test(first) && (second.startsWith('\\') || second.startsWith('/'))
}

function isNamedVolume(value: string): boolean {
  if (!value) {
    return false
  }
  if (value.startsWith('.') || value.startsWith('~')) {
    return false
  }
  if (value.includes('/') || value.includes('\\')) {
    return false
  }
  return true
}

function isContainerPath(value: string): boolean {
  return value.startsWith('/')
}

function isVolumeMode(value: string): boolean {
  return ['ro', 'rw', 'z', 'Z', 'cached', 'delegated', 'consistent'].includes(value)
}
