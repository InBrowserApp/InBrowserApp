export type SaltFormat = 'utf-8' | 'hex' | 'base64'

export const SALT_FORMAT_OPTIONS: { label: string; value: SaltFormat }[] = [
  { label: 'UTF-8', value: 'utf-8' },
  { label: 'Hex', value: 'hex' },
  { label: 'Base64', value: 'base64' },
]
