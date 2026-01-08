import * as ed25519 from '@noble/ed25519'

export type KeyAlgorithm = 'ed25519' | 'rsa'
export type RsaKeySize = 2048 | 3072 | 4096

export interface SshKeyPair {
  publicKey: string
  privateKey: string
  fingerprint: string
}

// Helper: Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBufferLike): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary)
}

// Helper: Encode a string as SSH wire format (length-prefixed)
function encodeString(str: string): Uint8Array {
  const encoder = new TextEncoder()
  const strBytes = encoder.encode(str)
  const result = new Uint8Array(4 + strBytes.length)
  const view = new DataView(result.buffer)
  view.setUint32(0, strBytes.length, false) // big-endian
  result.set(strBytes, 4)
  return result
}

// Helper: Encode bytes as SSH wire format (length-prefixed)
function encodeBytes(bytes: Uint8Array): Uint8Array {
  const result = new Uint8Array(4 + bytes.length)
  const view = new DataView(result.buffer)
  view.setUint32(0, bytes.length, false) // big-endian
  result.set(bytes, 4)
  return result
}

// Helper: Encode an mpint (multi-precision integer) for SSH
function encodeMpint(bytes: Uint8Array): Uint8Array {
  // Remove leading zeros
  let start = 0
  while (start < bytes.length - 1 && bytes[start] === 0) {
    start++
  }
  bytes = bytes.slice(start)

  // Add leading zero if high bit is set (to indicate positive number)
  if (bytes[0]! & 0x80) {
    const padded = new Uint8Array(bytes.length + 1)
    padded[0] = 0
    padded.set(bytes, 1)
    bytes = padded
  }

  return encodeBytes(bytes)
}

// Helper: Concatenate Uint8Arrays
function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

// Helper: Generate random bytes
function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

// Helper: Calculate SHA256 fingerprint
async function sha256Fingerprint(data: Uint8Array): Promise<string> {
  // Use slice to create a standard ArrayBuffer from the Uint8Array
  const buffer = data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength,
  ) as ArrayBuffer
  const hash = await crypto.subtle.digest('SHA-256', buffer)
  const base64 = arrayBufferToBase64(hash)
  return `SHA256:${base64.replace(/=+$/, '')}`
}

// Calculate fingerprint from a public key string (ssh-ed25519 AAAA... or ssh-rsa AAAA...)
export async function calculateFingerprint(publicKey: string): Promise<string> {
  // Extract the base64-encoded blob from the public key
  const parts = publicKey.trim().split(' ')
  if (parts.length < 2) {
    throw new Error('Invalid public key format')
  }
  const base64Blob = parts[1]!

  // Decode base64 to bytes
  const binary = atob(base64Blob)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return sha256Fingerprint(bytes)
}

// ============================================
// Ed25519 Key Generation
// ============================================

export async function generateEd25519KeyPair(comment: string = ''): Promise<SshKeyPair> {
  // Generate Ed25519 key pair using @noble/ed25519
  const privateKeyBytes = ed25519.utils.randomPrivateKey()
  const publicKeyBytes = await ed25519.getPublicKeyAsync(privateKeyBytes)

  // Build OpenSSH public key format
  const publicKeyBlob = concatBytes(encodeString('ssh-ed25519'), encodeBytes(publicKeyBytes))
  const publicKeyBase64 = arrayBufferToBase64(publicKeyBlob.buffer)
  const publicKey = `ssh-ed25519 ${publicKeyBase64}${comment ? ` ${comment}` : ''}`

  // Build OpenSSH private key format (new format)
  const privateKey = buildOpenSshPrivateKey('ssh-ed25519', publicKeyBytes, privateKeyBytes, comment)

  // Calculate fingerprint
  const fingerprint = await sha256Fingerprint(publicKeyBlob)

  return { publicKey, privateKey, fingerprint }
}

// ============================================
// RSA Key Generation
// ============================================

export async function generateRsaKeyPair(
  keySize: RsaKeySize = 4096,
  comment: string = '',
): Promise<SshKeyPair> {
  // Generate RSA key pair using WebCrypto
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: keySize,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  )

  // Export keys to JWK format
  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey)
  const privateJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey)

  // Decode base64url JWK components
  const n = base64UrlToBytes(publicJwk.n!) // modulus
  const e = base64UrlToBytes(publicJwk.e!) // public exponent

  // Build OpenSSH public key format
  const publicKeyBlob = concatBytes(encodeString('ssh-rsa'), encodeMpint(e), encodeMpint(n))
  const publicKeyBase64 = arrayBufferToBase64(publicKeyBlob.buffer)
  const publicKey = `ssh-rsa ${publicKeyBase64}${comment ? ` ${comment}` : ''}`

  // Build OpenSSH private key format
  const d = base64UrlToBytes(privateJwk.d!) // private exponent
  const p = base64UrlToBytes(privateJwk.p!) // prime1
  const q = base64UrlToBytes(privateJwk.q!) // prime2
  // Note: dp (d mod p-1) and dq (d mod q-1) from JWK are not needed for OpenSSH format
  const qi = base64UrlToBytes(privateJwk.qi!) // coefficient (iqmp)

  const privateKey = buildOpenSshRsaPrivateKey(n, e, d, qi, p, q, comment)

  // Calculate fingerprint
  const fingerprint = await sha256Fingerprint(publicKeyBlob)

  return { publicKey, privateKey, fingerprint }
}

// Helper: Base64URL to Uint8Array
function base64UrlToBytes(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(base64 + padding)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// ============================================
// OpenSSH Private Key Format (New Format)
// ============================================

function buildOpenSshPrivateKey(
  keyType: string,
  publicKeyBytes: Uint8Array,
  privateKeyBytes: Uint8Array,
  comment: string,
): string {
  const AUTH_MAGIC = 'openssh-key-v1\0'
  const CIPHER_NONE = 'none'
  const KDF_NONE = 'none'
  const NUM_KEYS = 1

  // Generate checkint (random 32-bit value, repeated twice for verification)
  const checkint = randomBytes(4)

  // Build private section (unencrypted)
  // For Ed25519: checkint, checkint, keytype, pubkey, privkey+pubkey (64 bytes), comment, padding
  const privateSection = concatBytes(
    checkint,
    checkint,
    encodeString(keyType),
    encodeBytes(publicKeyBytes),
    encodeBytes(concatBytes(privateKeyBytes, publicKeyBytes)), // Ed25519 private key is 64 bytes (32 priv + 32 pub)
    encodeString(comment),
  )

  // Add padding to align to 8 bytes (cipher block size for none)
  const blockSize = 8
  const paddingLength = blockSize - (privateSection.length % blockSize)
  const padding = new Uint8Array(paddingLength)
  for (let i = 0; i < paddingLength; i++) {
    padding[i] = i + 1
  }
  const paddedPrivateSection = concatBytes(privateSection, padding)

  // Build public section
  const publicSection = concatBytes(encodeString(keyType), encodeBytes(publicKeyBytes))

  // Build the full key blob
  const encoder = new TextEncoder()
  const magicBytes = encoder.encode(AUTH_MAGIC)

  const keyBlob = concatBytes(
    magicBytes,
    encodeString(CIPHER_NONE),
    encodeString(KDF_NONE),
    encodeString(''), // KDF options (empty for none)
    new Uint8Array(new Uint32Array([NUM_KEYS]).buffer).reverse(), // big-endian uint32
    encodeBytes(publicSection),
    encodeBytes(paddedPrivateSection),
  )

  // Encode to base64 and format as PEM
  const base64 = arrayBufferToBase64(keyBlob.buffer)
  const lines = base64.match(/.{1,70}/g) || []
  return `-----BEGIN OPENSSH PRIVATE KEY-----\n${lines.join('\n')}\n-----END OPENSSH PRIVATE KEY-----\n`
}

function buildOpenSshRsaPrivateKey(
  n: Uint8Array,
  e: Uint8Array,
  d: Uint8Array,
  iqmp: Uint8Array,
  p: Uint8Array,
  q: Uint8Array,
  comment: string,
): string {
  const AUTH_MAGIC = 'openssh-key-v1\0'
  const CIPHER_NONE = 'none'
  const KDF_NONE = 'none'
  const NUM_KEYS = 1
  const keyType = 'ssh-rsa'

  // Generate checkint
  const checkint = randomBytes(4)

  // Build private section
  // RSA: checkint, checkint, keytype, n, e, d, iqmp, p, q, comment, padding
  const privateSection = concatBytes(
    checkint,
    checkint,
    encodeString(keyType),
    encodeMpint(n),
    encodeMpint(e),
    encodeMpint(d),
    encodeMpint(iqmp),
    encodeMpint(p),
    encodeMpint(q),
    encodeString(comment),
  )

  // Add padding
  const blockSize = 8
  const paddingLength = blockSize - (privateSection.length % blockSize)
  const padding = new Uint8Array(paddingLength)
  for (let i = 0; i < paddingLength; i++) {
    padding[i] = i + 1
  }
  const paddedPrivateSection = concatBytes(privateSection, padding)

  // Build public section
  const publicSection = concatBytes(encodeString(keyType), encodeMpint(e), encodeMpint(n))

  // Build the full key blob
  const encoder = new TextEncoder()
  const magicBytes = encoder.encode(AUTH_MAGIC)

  const keyBlob = concatBytes(
    magicBytes,
    encodeString(CIPHER_NONE),
    encodeString(KDF_NONE),
    encodeString(''), // KDF options
    new Uint8Array(new Uint32Array([NUM_KEYS]).buffer).reverse(), // big-endian uint32
    encodeBytes(publicSection),
    encodeBytes(paddedPrivateSection),
  )

  // Encode to base64 and format as PEM
  const base64 = arrayBufferToBase64(keyBlob.buffer)
  const lines = base64.match(/.{1,70}/g) || []
  return `-----BEGIN OPENSSH PRIVATE KEY-----\n${lines.join('\n')}\n-----END OPENSSH PRIVATE KEY-----\n`
}

// ============================================
// Main export function
// ============================================

export async function generateSshKeyPair(
  algorithm: KeyAlgorithm,
  comment: string = '',
  rsaKeySize: RsaKeySize = 4096,
): Promise<SshKeyPair> {
  if (algorithm === 'ed25519') {
    return generateEd25519KeyPair(comment)
  } else {
    return generateRsaKeyPair(rsaKeySize, comment)
  }
}
