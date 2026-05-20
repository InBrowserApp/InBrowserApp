const MAX_UUID = "ffffffff-ffff-ffff-ffff-ffffffffffff" as const
const MAX_UUID_HEX = "ffffffffffffffffffffffffffffffff" as const
const MAX_UUID_URN = `urn:uuid:${MAX_UUID}` as const

type MaxUuidRepresentation = Readonly<{
  canonical: typeof MAX_UUID
  rawHex: typeof MAX_UUID_HEX
  urn: typeof MAX_UUID_URN
}>

function getMaxUuid() {
  return MAX_UUID
}

function getMaxUuidRepresentations(): MaxUuidRepresentation {
  return {
    canonical: MAX_UUID,
    rawHex: MAX_UUID_HEX,
    urn: MAX_UUID_URN,
  }
}

function isMaxUuid(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^urn:uuid:/u, "")

  return (
    normalized === MAX_UUID || normalized.replaceAll("-", "") === MAX_UUID_HEX
  )
}

export {
  MAX_UUID,
  MAX_UUID_HEX,
  MAX_UUID_URN,
  getMaxUuid,
  getMaxUuidRepresentations,
  isMaxUuid,
}
