type HashToolGroupId = "cryptographic" | "password" | "keyed" | "checksum"

type HashToolFilter = HashToolGroupId | "all"

type HashToolKindId =
  | "textFile"
  | "passwordHash"
  | "passwordVerify"
  | "keyDerivation"
  | "keyedHash"
  | "integrity"
  | "checksum"

type HashToolGroup = Readonly<{
  id: HashToolGroupId
}>

type HashTool = Readonly<{
  slug: string
  label: string
  group: HashToolGroupId
  kind: HashToolKindId
  tags: readonly string[]
}>

type HashToolSearchOptions = Readonly<{
  query: string
  group: HashToolFilter
}>

export type {
  HashTool,
  HashToolFilter,
  HashToolGroup,
  HashToolGroupId,
  HashToolKindId,
  HashToolSearchOptions,
}
