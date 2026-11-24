export const comicArchiveFormats = {
  cbr: {
    label: "CBR",
    archive: "RAR",
    decoder: "rar",
    extensions: [".cbr", ".rar"],
  },
  cb7: {
    label: "CB7",
    archive: "7z",
    decoder: "7z",
    extensions: [".cb7", ".7z"],
  },
} as const

export type ComicArchiveKind = keyof typeof comicArchiveFormats
