import type { HashTool } from "../types"

const CHECKSUM_HASH_TOOLS = [
  {
    slug: "adler32-hash-text-or-file",
    label: "Adler-32",
    group: "checksum",
    kind: "checksum",
    tags: ["adler32", "checksum", "zlib"],
  },
  {
    slug: "cityhash64-hash-text-or-file",
    label: "CityHash64",
    group: "checksum",
    kind: "checksum",
    tags: ["cityhash", "64-bit", "non-cryptographic"],
  },
  {
    slug: "crc-checksum-calculator",
    label: "CRC checksum calculator",
    group: "checksum",
    kind: "checksum",
    tags: ["crc", "crc32", "checksum", "legacy"],
  },
  {
    slug: "murmurhash3-x64-128-hash-text-or-file",
    label: "MurmurHash3 x64 128-bit",
    group: "checksum",
    kind: "checksum",
    tags: ["murmurhash3", "x64", "128-bit", "non-cryptographic"],
  },
  {
    slug: "murmurhash3-x86-128-hash-text-or-file",
    label: "MurmurHash3 x86 128-bit",
    group: "checksum",
    kind: "checksum",
    tags: ["murmurhash3", "x86", "128-bit", "non-cryptographic"],
  },
  {
    slug: "murmurhash3-x86-32-hash-text-or-file",
    label: "MurmurHash3 x86 32-bit",
    group: "checksum",
    kind: "checksum",
    tags: ["murmurhash3", "x86", "32-bit", "non-cryptographic"],
  },
  {
    slug: "xxhash-xxh3-128-hash-text-or-file",
    label: "xxHash XXH3 128-bit",
    group: "checksum",
    kind: "checksum",
    tags: ["xxhash", "xxh3", "128-bit", "non-cryptographic"],
  },
  {
    slug: "xxhash-xxh3-64-hash-text-or-file",
    label: "xxHash XXH3 64-bit",
    group: "checksum",
    kind: "checksum",
    tags: ["xxhash", "xxh3", "64-bit", "non-cryptographic"],
  },
  {
    slug: "xxhash-xxh32-hash-text-or-file",
    label: "xxHash XXH32",
    group: "checksum",
    kind: "checksum",
    tags: ["xxhash", "xxh32", "32-bit", "non-cryptographic"],
  },
  {
    slug: "xxhash-xxh64-hash-text-or-file",
    label: "xxHash XXH64",
    group: "checksum",
    kind: "checksum",
    tags: ["xxhash", "xxh64", "64-bit", "non-cryptographic"],
  },
] as const satisfies readonly HashTool[]

export { CHECKSUM_HASH_TOOLS }
