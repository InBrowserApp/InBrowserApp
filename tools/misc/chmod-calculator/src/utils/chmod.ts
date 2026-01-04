/**
 * Convert numeric permission (e.g., "755") to symbolic notation (e.g., "rwxr-xr-x")
 */
export function numericToSymbolic(numeric: string): string {
  if (!isValidNumeric(numeric)) {
    return ''
  }

  const digits = numeric.padStart(3, '0').slice(-3)
  return digits
    .split('')
    .map((digit) => {
      const num = parseInt(digit, 10)
      const r = num & 4 ? 'r' : '-'
      const w = num & 2 ? 'w' : '-'
      const x = num & 1 ? 'x' : '-'
      return r + w + x
    })
    .join('')
}

/**
 * Convert symbolic notation (e.g., "rwxr-xr-x") to numeric permission (e.g., "755")
 */
export function symbolicToNumeric(symbolic: string): string {
  if (!isValidSymbolic(symbolic)) {
    return ''
  }

  const normalized = symbolic.replace(/\s/g, '')
  const result: number[] = []

  for (let i = 0; i < 3; i++) {
    const triplet = normalized.slice(i * 3, i * 3 + 3)
    let num = 0
    if (triplet[0] === 'r') num += 4
    if (triplet[1] === 'w') num += 2
    if (triplet[2] === 'x') num += 1
    result.push(num)
  }

  return result.join('')
}

/**
 * Validate numeric permission format (1-3 digits, each 0-7)
 */
export function isValidNumeric(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }
  const trimmed = value.trim()
  if (!/^[0-7]{1,3}$/.test(trimmed)) {
    return false
  }
  return true
}

/**
 * Validate symbolic permission format (9 characters: rwx pattern × 3)
 */
export function isValidSymbolic(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }
  const trimmed = value.trim().replace(/\s/g, '')
  if (trimmed.length !== 9) {
    return false
  }
  // Check pattern: [r-][w-][x-] repeated 3 times
  const pattern = /^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/
  return pattern.test(trimmed)
}

/**
 * Convert permissions object to numeric string
 */
export function permissionsToNumeric(permissions: {
  owner: { read: boolean; write: boolean; execute: boolean }
  group: { read: boolean; write: boolean; execute: boolean }
  others: { read: boolean; write: boolean; execute: boolean }
}): string {
  const calculate = (perm: { read: boolean; write: boolean; execute: boolean }) => {
    let num = 0
    if (perm.read) num += 4
    if (perm.write) num += 2
    if (perm.execute) num += 1
    return num
  }

  return `${calculate(permissions.owner)}${calculate(permissions.group)}${calculate(permissions.others)}`
}

/**
 * Convert numeric string to permissions object
 */
export function numericToPermissions(numeric: string): {
  owner: { read: boolean; write: boolean; execute: boolean }
  group: { read: boolean; write: boolean; execute: boolean }
  others: { read: boolean; write: boolean; execute: boolean }
} {
  const defaultPerm = { read: false, write: false, execute: false }
  const defaultResult = {
    owner: { ...defaultPerm },
    group: { ...defaultPerm },
    others: { ...defaultPerm },
  }

  if (!isValidNumeric(numeric)) {
    return defaultResult
  }

  const digits = numeric.padStart(3, '0').slice(-3).split('')
  const parse = (digit: string) => {
    const num = parseInt(digit, 10)
    return {
      read: (num & 4) !== 0,
      write: (num & 2) !== 0,
      execute: (num & 1) !== 0,
    }
  }

  return {
    owner: parse(digits[0] ?? '0'),
    group: parse(digits[1] ?? '0'),
    others: parse(digits[2] ?? '0'),
  }
}
