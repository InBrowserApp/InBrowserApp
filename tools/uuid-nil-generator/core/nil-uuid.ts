const NIL_UUID = "00000000-0000-0000-0000-000000000000" as const
const NIL_UUID_HEX = "00000000000000000000000000000000" as const
const NIL_UUID_URN = `urn:uuid:${NIL_UUID}` as const

type NilUuidRepresentation = Readonly<{
  canonical: typeof NIL_UUID
  rawHex: typeof NIL_UUID_HEX
  urn: typeof NIL_UUID_URN
}>

function getNilUuid() {
  return NIL_UUID
}

function getNilUuidRepresentations(): NilUuidRepresentation {
  return {
    canonical: NIL_UUID,
    rawHex: NIL_UUID_HEX,
    urn: NIL_UUID_URN,
  }
}

function isNilUuid(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^urn:uuid:/u, "")

  return (
    normalized === NIL_UUID || normalized.replaceAll("-", "") === NIL_UUID_HEX
  )
}

export {
  NIL_UUID,
  NIL_UUID_HEX,
  NIL_UUID_URN,
  getNilUuid,
  getNilUuidRepresentations,
  isNilUuid,
}
