export const presets = {
  quality: { maxSide: 2400, jpegQuality: 0.86 },
  balanced: { maxSide: 1650, jpegQuality: 0.74 },
  small: { maxSide: 1100, jpegQuality: 0.6 },
} as const

export type CompressionLevel = keyof typeof presets

export type CompressionRequest = {
  file: File
  level: CompressionLevel
}

export type CompressionResult =
  | { status: "compressed"; blob: Blob }
  | { status: "noSavings" | "signed" }
  | { status: "invalidPdf" | "encryptedPdf" | "compressionFailed" }
