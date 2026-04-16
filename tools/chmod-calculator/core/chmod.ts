type PermissionSet = {
  read: boolean
  write: boolean
  execute: boolean
}

type Permissions = {
  owner: PermissionSet
  group: PermissionSet
  others: PermissionSet
}

function numericToSymbolic(numeric: string): string {
  if (!isValidNumeric(numeric)) {
    return ""
  }

  const digits = numeric.trim().padStart(3, "0").slice(-3)

  return digits
    .split("")
    .map((digit) => {
      const num = Number.parseInt(digit, 10)
      const read = num & 4 ? "r" : "-"
      const write = num & 2 ? "w" : "-"
      const execute = num & 1 ? "x" : "-"
      return `${read}${write}${execute}`
    })
    .join("")
}

function symbolicToNumeric(symbolic: string): string {
  if (!isValidSymbolic(symbolic)) {
    return ""
  }

  const normalized = symbolic.trim().replace(/\s/g, "")
  const result: number[] = []

  for (let index = 0; index < 3; index += 1) {
    const triplet = normalized.slice(index * 3, index * 3 + 3)
    let value = 0

    if (triplet[0] === "r") value += 4
    if (triplet[1] === "w") value += 2
    if (triplet[2] === "x") value += 1

    result.push(value)
  }

  return result.join("")
}

function isValidNumeric(value: string): boolean {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^[0-7]{1,3}$/.test(value.trim())
}

function isValidSymbolic(value: string): boolean {
  if (!value || typeof value !== "string") {
    return false
  }

  return /^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(
    value.trim().replace(/\s/g, "")
  )
}

function permissionsToNumeric(permissions: Permissions): string {
  const toDigit = ({ read, write, execute }: PermissionSet) => {
    let value = 0
    if (read) value += 4
    if (write) value += 2
    if (execute) value += 1
    return value
  }

  return [
    toDigit(permissions.owner),
    toDigit(permissions.group),
    toDigit(permissions.others),
  ].join("")
}

function numericToPermissions(numeric: string): Permissions {
  const emptyPermissions = {
    read: false,
    write: false,
    execute: false,
  }
  const emptyResult = {
    owner: { ...emptyPermissions },
    group: { ...emptyPermissions },
    others: { ...emptyPermissions },
  }

  if (!isValidNumeric(numeric)) {
    return emptyResult
  }

  const digits = numeric.trim().padStart(3, "0").slice(-3).split("")
  const parseDigit = (digit: string): PermissionSet => {
    const value = Number.parseInt(digit, 10)
    return {
      read: (value & 4) !== 0,
      write: (value & 2) !== 0,
      execute: (value & 1) !== 0,
    }
  }

  return {
    owner: parseDigit(digits[0] ?? "0"),
    group: parseDigit(digits[1] ?? "0"),
    others: parseDigit(digits[2] ?? "0"),
  }
}

export {
  isValidNumeric,
  isValidSymbolic,
  numericToPermissions,
  numericToSymbolic,
  permissionsToNumeric,
  symbolicToNumeric,
}
