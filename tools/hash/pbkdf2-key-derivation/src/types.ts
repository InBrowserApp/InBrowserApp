export type Pbkdf2Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
export type SaltFormat = 'utf-8' | 'hex' | 'base64'

export const ALGORITHM_OPTIONS: { label: string; value: Pbkdf2Algorithm }[] = [
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
]

export const SALT_FORMAT_OPTIONS: { label: string; value: SaltFormat }[] = [
  { label: 'UTF-8', value: 'utf-8' },
  { label: 'Hex', value: 'hex' },
  { label: 'Base64', value: 'base64' },
]
