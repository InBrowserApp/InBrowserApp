const commonServices = [0x180a, 0x180d, 0x180f, 0x1816, 0x181a]
const fullUuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/

export function requestedServices(input: string) {
  const services = new Set<string | number>(commonServices)
  for (const token of input
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean)) {
    if (/^(?:0x)?[0-9a-f]{4}$/.test(token)) {
      services.add(Number.parseInt(token, 16))
    } else if (fullUuid.test(token)) {
      services.add(token)
    } else {
      return null
    }
  }
  return [...services]
}

export function displayValue(value: DataView) {
  const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
  return {
    hex: Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
      .join(" ")
      .toUpperCase(),
    text: new TextDecoder().decode(bytes),
  }
}
