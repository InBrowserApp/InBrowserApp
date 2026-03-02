export const PDF_ERROR = {
  Encrypted: 'encrypted-pdf',
  Invalid: 'invalid-pdf',
  SplitFailed: 'split-failed',
  WorkerUnsupported: 'worker-not-supported',
} as const

export type PdfErrorCode = (typeof PDF_ERROR)[keyof typeof PDF_ERROR]

export const isEncryptedPdfError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'EncryptedPDFError'
