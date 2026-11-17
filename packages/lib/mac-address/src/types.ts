const REGISTRIES = ["MA-L", "MA-M", "MA-S", "IAB", "CID"] as const

type Registry = (typeof REGISTRIES)[number]

type Assignment = Readonly<{
  registry: Registry
  assignment: string
  organization: string
  address: string
}>

type Database = Readonly<{
  records: readonly Assignment[]
  updatedAt: string
}>

type ParsedMac = Readonly<{
  hex: string
  bits: number
  formatted: string
  kind: "universal" | "local" | "multicast" | "broadcast" | "zero" | "prefix"
}>

type MacQuery = Readonly<{
  q: string
  registry: Registry | "all"
  org: string
  page: number
}>

export { REGISTRIES }
export type { Assignment, Database, MacQuery, ParsedMac, Registry }
