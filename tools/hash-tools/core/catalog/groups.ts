import type { HashToolGroup } from "../types"

const HASH_TOOL_GROUPS = [
  { id: "cryptographic" },
  { id: "password" },
  { id: "keyed" },
  { id: "checksum" },
] as const satisfies readonly HashToolGroup[]

export { HASH_TOOL_GROUPS }
