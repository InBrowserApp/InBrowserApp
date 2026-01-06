export type AesMode = 'GCM' | 'CBC' | 'CTR'
export type KeyLength = 128 | 192 | 256
export type KeyType = 'password' | 'raw'
export type OutputFormat = 'base64' | 'hex'
export type OutputMode = 'jwe' | 'raw'
export type InputFormat = 'base64' | 'hex' | 'binary'
export type Pbkdf2Hash = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export interface Pbkdf2Options {
  iterations?: number
  hash?: Pbkdf2Hash
}

export interface AdvancedOptions {
  salt?: Uint8Array // Manual salt (hex string will be converted before passing)
  iv?: Uint8Array // Manual IV (hex string will be converted before passing)
}

export interface EncryptOptions extends Pbkdf2Options, AdvancedOptions {}

export interface DecryptOptions extends Pbkdf2Options {
  // For Raw mode: whether to extract salt/iv from data or use manual input
  saltSource?: 'extract' | 'manual'
  ivSource?: 'extract' | 'manual'
  salt?: Uint8Array
  iv?: Uint8Array
}

export interface EncryptResult {
  // Main output (JWE string or encoded raw data)
  output: string
  // For display/logging purposes
  salt: string // hex
  iv: string // hex
  // Raw ciphertext without salt/iv prefix (for interoperability)
  ciphertext?: string // hex or base64
}

export interface AesConfig {
  mode: AesMode
  keyLength: KeyLength
  keyType: KeyType
  outputFormat: OutputFormat
}

export const IV_LENGTH: Record<AesMode, number> = {
  GCM: 12,
  CBC: 16,
  CTR: 16,
}

export const SALT_LENGTH = 16
export const PBKDF2_ITERATIONS = 100000
export const PBKDF2_HASH: Pbkdf2Hash = 'SHA-256'

// JWE algorithm mappings
export const PBES2_ALG: Record<KeyLength, string> = {
  128: 'PBES2-HS256+A128KW',
  192: 'PBES2-HS384+A192KW',
  256: 'PBES2-HS512+A256KW',
}

export const JWE_ENC_GCM: Record<KeyLength, string> = {
  128: 'A128GCM',
  192: 'A192GCM',
  256: 'A256GCM',
}

export const JWE_ENC_CBC: Record<KeyLength, string> = {
  128: 'A128CBC-HS256',
  192: 'A192CBC-HS384',
  256: 'A256CBC-HS512',
}
