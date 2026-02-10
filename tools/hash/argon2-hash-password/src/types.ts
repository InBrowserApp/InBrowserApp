export type Argon2Algorithm = 'argon2id' | 'argon2i' | 'argon2d'

export const ALGORITHM_OPTIONS: { label: string; value: Argon2Algorithm }[] = [
  { label: 'Argon2id', value: 'argon2id' },
  { label: 'Argon2i', value: 'argon2i' },
  { label: 'Argon2d', value: 'argon2d' },
]
