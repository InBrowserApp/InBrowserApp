export function normalizeVolumeEntry(
  input: string,
  volumeNames: Set<string>
): string {
  const parts = splitVolume(input)
  const [first = "", second = "", mode] = parts

  if (parts.length === 1) {
    return input
  }

  if (parts.length === 2) {
    if (first && second && isContainerPath(first) && isVolumeMode(second)) {
      return `${first}:${second}`
    }
  }

  const source = first
  const target = second

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
  const [first = "", second = "", ...rest] = value.split(":")
  if (rest.length === 0) {
    return [first, second].filter(Boolean)
  }

  if (first && second && isWindowsPath(first, second)) {
    const source = `${first}:${second}`
    const [target = "", ...modeParts] = rest
    const mode = modeParts.join(":")

    return [source, target, mode].filter(Boolean)
  }

  const mode = rest.join(":")
  return [first, second, mode].filter(Boolean)
}

function isWindowsPath(first: string, second: string): boolean {
  return (
    /^[A-Za-z]$/.test(first) &&
    (second.startsWith("\\") || second.startsWith("/"))
  )
}

function isNamedVolume(value: string): boolean {
  if (value.startsWith(".") || value.startsWith("~")) {
    return false
  }
  if (value.includes("/") || value.includes("\\")) {
    return false
  }
  return true
}

function isContainerPath(value: string): boolean {
  return value.startsWith("/")
}

function isVolumeMode(value: string): boolean {
  return ["ro", "rw", "z", "Z", "cached", "delegated", "consistent"].includes(
    value
  )
}
