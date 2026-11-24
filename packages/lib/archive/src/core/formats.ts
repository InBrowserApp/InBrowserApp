type FormatInfo = {
  label: string
  suffixes: readonly string[]
  tarSuffixes?: readonly string[]
  signatures?: readonly (readonly number[])[]
}

const archiveFormats = {
  zip: { label: "ZIP", suffixes: [".zip"] },
  tar: { label: "TAR", suffixes: [".tar"] },
  tgz: { label: "TGZ", suffixes: [".tar.gz", ".tgz"] },
  gz: { label: "GZ", suffixes: [".gz"] },
  "7z": {
    label: "7z",
    suffixes: [".7z"],
    signatures: [[0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]],
  },
  rar: {
    label: "RAR",
    suffixes: [".rar"],
    signatures: [
      [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00],
      [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00],
    ],
  },
  zstd: {
    label: "Zstandard",
    suffixes: [".zst", ".zstd"],
    tarSuffixes: [".tar.zst", ".tar.zstd", ".tzst"],
    signatures: [[0x28, 0xb5, 0x2f, 0xfd]],
  },
  xz: {
    label: "XZ",
    suffixes: [".xz"],
    tarSuffixes: [".tar.xz", ".txz"],
    signatures: [[0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00]],
  },
  bz2: {
    label: "BZIP2",
    suffixes: [".bz2"],
    tarSuffixes: [".tar.bz2", ".tbz", ".tbz2"],
    signatures: [[0x42, 0x5a, 0x68]],
  },
  lz4: {
    label: "LZ4",
    suffixes: [".lz4"],
    tarSuffixes: [".tar.lz4"],
    signatures: [
      [0x04, 0x22, 0x4d, 0x18],
      [0x02, 0x21, 0x4c, 0x18],
    ],
  },
  lzip: {
    label: "LZIP",
    suffixes: [".lz"],
    tarSuffixes: [".tar.lz", ".tlz"],
    signatures: [[0x4c, 0x5a, 0x49, 0x50]],
  },
  lzma: { label: "LZMA", suffixes: [".lzma"], tarSuffixes: [".tar.lzma"] },
  compress: {
    label: "UNIX compress",
    suffixes: [".z"],
    tarSuffixes: [".tar.z", ".taz"],
    signatures: [[0x1f, 0x9d]],
  },
  cpio: {
    label: "CPIO",
    suffixes: [".cpio"],
    signatures: [
      [0x30, 0x37, 0x30, 0x37, 0x30, 0x31], // newc
      [0x30, 0x37, 0x30, 0x37, 0x30, 0x32], // crc
      [0x30, 0x37, 0x30, 0x37, 0x30, 0x37], // odc
      [0xc7, 0x71],
      [0x71, 0xc7],
    ],
  },
  ar: {
    label: "AR",
    suffixes: [".a", ".ar", ".deb"],
    signatures: [[0x21, 0x3c, 0x61, 0x72, 0x63, 0x68, 0x3e, 0x0a]],
  },
  cab: {
    label: "CAB",
    suffixes: [".cab"],
    signatures: [[0x4d, 0x53, 0x43, 0x46]],
  },
  iso: { label: "ISO", suffixes: [".iso"] },
  lha: { label: "LHA", suffixes: [".lha", ".lzh"] },
} as const satisfies Record<string, FormatInfo>

type ArchiveFormat = keyof typeof archiveFormats
type ExtendedArchiveFormat = Exclude<
  ArchiveFormat,
  "zip" | "tar" | "gz" | "tgz"
>

const formatEntries = Object.entries(archiveFormats) as [
  ArchiveFormat,
  FormatInfo,
][]

const acceptedArchiveTypes = formatEntries
  .flatMap(([, { suffixes, tarSuffixes = [] }]) => [
    ...suffixes,
    ...tarSuffixes,
  ])
  .join(",")

export { acceptedArchiveTypes, archiveFormats, formatEntries }
export type { FormatInfo }
export type { ArchiveFormat, ExtendedArchiveFormat }
