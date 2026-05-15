import type { HashTool } from "../types"

const KEYED_HASH_TOOLS = [
  {
    slug: "hmac-generator",
    label: "HMAC generator",
    group: "keyed",
    kind: "keyedHash",
    tags: ["hmac", "mac", "signature", "authentication"],
  },
  {
    slug: "highwayhash-hash-text-or-file",
    label: "HighwayHash",
    group: "keyed",
    kind: "keyedHash",
    tags: ["highwayhash", "keyed", "mac", "fast"],
  },
  {
    slug: "siphash-2-4-hash-text-or-file",
    label: "SipHash-2-4",
    group: "keyed",
    kind: "keyedHash",
    tags: ["siphash", "keyed", "hash-table", "dos"],
  },
  {
    slug: "siphash-128-2-4-hash-text-or-file",
    label: "SipHash-128-2-4",
    group: "keyed",
    kind: "keyedHash",
    tags: ["siphash", "128-bit", "keyed", "hash-table"],
  },
  {
    slug: "sri-hash-generator",
    label: "SRI hash generator",
    group: "keyed",
    kind: "integrity",
    tags: ["sri", "subresource", "integrity", "web"],
  },
] as const satisfies readonly HashTool[]

export { KEYED_HASH_TOOLS }
