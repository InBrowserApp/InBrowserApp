import { ExtendedKeyUsage, KeyUsageFlags } from '@peculiar/x509'

export const keyUsageLabels: Array<[number, string]> = [
  [KeyUsageFlags.digitalSignature, 'Digital Signature'],
  [KeyUsageFlags.nonRepudiation, 'Non Repudiation'],
  [KeyUsageFlags.keyEncipherment, 'Key Encipherment'],
  [KeyUsageFlags.dataEncipherment, 'Data Encipherment'],
  [KeyUsageFlags.keyAgreement, 'Key Agreement'],
  [KeyUsageFlags.keyCertSign, 'Key Cert Sign'],
  [KeyUsageFlags.cRLSign, 'CRL Sign'],
  [KeyUsageFlags.encipherOnly, 'Encipher Only'],
  [KeyUsageFlags.decipherOnly, 'Decipher Only'],
]

export const extendedKeyUsageLabels: Record<string, string> = {
  [ExtendedKeyUsage.serverAuth]: 'TLS Web Server Authentication',
  [ExtendedKeyUsage.clientAuth]: 'TLS Web Client Authentication',
  [ExtendedKeyUsage.codeSigning]: 'Code Signing',
  [ExtendedKeyUsage.emailProtection]: 'Email Protection',
  [ExtendedKeyUsage.timeStamping]: 'Time Stamping',
  [ExtendedKeyUsage.ocspSigning]: 'OCSP Signing',
}

const generalNameLabels: Record<string, string> = {
  dns: 'DNS',
  dn: 'DN',
  email: 'Email',
  ip: 'IP',
  url: 'URI',
  guid: 'GUID',
  upn: 'UPN',
  id: 'Registered ID',
}

export function formatGeneralName(type: string, value: string): string {
  const label = generalNameLabels[type] ?? type
  return `${label}: ${value}`
}

export function extractPemBlocks(input: string): Array<{ label: string; der: ArrayBuffer }> {
  const blocks: Array<{ label: string; der: ArrayBuffer }> = []
  const pattern = /-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g

  for (const match of input.matchAll(pattern)) {
    const label = match[1]?.trim()
    const body = match[2]?.replace(/[\r\n\s]/g, '')
    if (!label || !body) {
      continue
    }
    try {
      blocks.push({ label, der: base64ToArrayBuffer(body) })
    } catch {
      // Skip invalid blocks
    }
  }

  return blocks
}

export function isCertificateLabel(label: string): boolean {
  const normalized = label.toUpperCase()
  return normalized.includes('CERTIFICATE') && !normalized.includes('REQUEST')
}

export function isBase64Input(value: string): boolean {
  const cleaned = value.replace(/\s+/g, '')
  if (!cleaned) return false
  return /^[A-Za-z0-9+/=]+$/.test(cleaned)
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export async function computeFingerprints(buffer: ArrayBuffer): Promise<{
  sha1: string
  sha256: string
}> {
  const [sha1, sha256] = await Promise.all([
    crypto.subtle.digest('SHA-1', buffer),
    crypto.subtle.digest('SHA-256', buffer),
  ])

  return {
    sha1: formatHex(sha1),
    sha256: formatHex(sha256),
  }
}

export function formatHexString(value: string): string {
  const cleaned = value.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '')
  if (!cleaned) return value
  const pairs = cleaned.match(/.{1,2}/g)
  return pairs ? pairs.join(':').toUpperCase() : cleaned.toUpperCase()
}

function formatHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(':')
    .toUpperCase()
}
