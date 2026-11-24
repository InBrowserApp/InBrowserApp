export function usbHex(value: number, digits = 2) {
  return `0x${value.toString(16).toUpperCase().padStart(digits, "0")}`
}

export function usbVersion(major: number, minor: number, subminor: number) {
  return `${major}.${minor}.${subminor}`
}

export function deniedAccess(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "NotAllowedError" || error.name === "SecurityError")
  )
}
