import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { execSync } from 'node:child_process'
import { writeFileSync, unlinkSync, mkdtempSync, rmSync, chmodSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateSshKeyPair, calculateFingerprint, type RsaKeySize } from './ssh-keygen'

// Check if ssh-keygen is available
let sshKeygenAvailable = false
try {
  execSync('which ssh-keygen', { stdio: 'pipe' })
  sshKeygenAvailable = true
} catch {
  sshKeygenAvailable = false
}

describe('SSH Key Generator', () => {
  describe('Ed25519 Key Generation', () => {
    it('should generate valid Ed25519 key pair', async () => {
      const comment = 'test@example.com'
      const keyPair = await generateSshKeyPair('ed25519', comment)

      expect(keyPair.publicKey).toMatch(/^ssh-ed25519 AAAA/)
      expect(keyPair.publicKey).toContain(comment)
      expect(keyPair.privateKey).toContain('-----BEGIN OPENSSH PRIVATE KEY-----')
      expect(keyPair.privateKey).toContain('-----END OPENSSH PRIVATE KEY-----')
      expect(keyPair.fingerprint).toMatch(/^SHA256:/)
    })

    it('should generate Ed25519 key without comment', async () => {
      const keyPair = await generateSshKeyPair('ed25519')

      expect(keyPair.publicKey).toMatch(/^ssh-ed25519 AAAA/)
      expect(keyPair.privateKey).toContain('-----BEGIN OPENSSH PRIVATE KEY-----')
    })

    it('should generate unique key pairs each time', async () => {
      const keyPair1 = await generateSshKeyPair('ed25519', 'test1@example.com')
      const keyPair2 = await generateSshKeyPair('ed25519', 'test2@example.com')

      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey)
      expect(keyPair1.privateKey).not.toBe(keyPair2.privateKey)
      expect(keyPair1.fingerprint).not.toBe(keyPair2.fingerprint)
    })
  })

  describe('RSA Key Generation', () => {
    const testCases: { keySize: RsaKeySize }[] = [
      { keySize: 2048 },
      { keySize: 3072 },
      { keySize: 4096 },
    ]

    testCases.forEach(({ keySize }) => {
      it(`should generate valid RSA-${keySize} key pair`, async () => {
        const comment = `test-rsa-${keySize}@example.com`
        const keyPair = await generateSshKeyPair('rsa', comment, keySize)

        expect(keyPair.publicKey).toMatch(/^ssh-rsa AAAA/)
        expect(keyPair.publicKey).toContain(comment)
        expect(keyPair.privateKey).toContain('-----BEGIN OPENSSH PRIVATE KEY-----')
        expect(keyPair.privateKey).toContain('-----END OPENSSH PRIVATE KEY-----')
        expect(keyPair.fingerprint).toMatch(/^SHA256:/)
      }, 30000) // RSA key generation can be slow
    })

    it('should generate an RSA key without comment and leading-zero JWK fields', async () => {
      const generateKeySpy = vi.spyOn(crypto.subtle, 'generateKey')
      const exportKeySpy = vi.spyOn(crypto.subtle, 'exportKey')

      generateKeySpy.mockResolvedValue({
        publicKey: {} as CryptoKey,
        privateKey: {} as CryptoKey,
      } as CryptoKeyPair)
      exportKeySpy
        .mockResolvedValueOnce({
          n: 'AAECAw',
          e: 'AQAB',
        } as JsonWebKey)
        .mockResolvedValueOnce({
          d: 'AAECAw',
          p: 'AAE',
          q: 'AAI',
          qi: 'AAM',
        } as JsonWebKey)

      try {
        const keyPair = await generateSshKeyPair('rsa', '', 2048)

        expect(keyPair.publicKey).toMatch(/^ssh-rsa AAAA/)
        expect(keyPair.publicKey.trim().split(' ')).toHaveLength(2)
        expect(keyPair.privateKey).toContain('-----BEGIN OPENSSH PRIVATE KEY-----')
        expect(keyPair.privateKey).toContain('-----END OPENSSH PRIVATE KEY-----')
        expect(keyPair.fingerprint).toMatch(/^SHA256:/)
      } finally {
        generateKeySpy.mockRestore()
        exportKeySpy.mockRestore()
      }
    })
  })

  describe('Fingerprint Calculation', () => {
    it('should calculate consistent fingerprint for same public key', async () => {
      const keyPair = await generateSshKeyPair('ed25519', 'test@example.com')
      const fingerprint1 = await calculateFingerprint(keyPair.publicKey)
      const fingerprint2 = await calculateFingerprint(keyPair.publicKey)

      expect(fingerprint1).toBe(fingerprint2)
      expect(fingerprint1).toBe(keyPair.fingerprint)
    })

    it('throws on invalid public key format', async () => {
      await expect(calculateFingerprint('invalid-public-key')).rejects.toThrow(
        'Invalid public key format',
      )
    })
  })
})

describe.skipIf(!sshKeygenAvailable)('SSH Key Generator - System Validation', () => {
  let tmpDir: string

  beforeAll(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'ssh-key-test-'))
  })

  it('should generate valid Ed25519 key verifiable by ssh-keygen', async () => {
    const comment = 'ed25519-test@example.com'
    const keyPair = await generateSshKeyPair('ed25519', comment)

    const keyPath = join(tmpDir, 'test_ed25519')
    const pubKeyPath = join(tmpDir, 'test_ed25519.pub')

    try {
      writeFileSync(keyPath, keyPair.privateKey)
      chmodSync(keyPath, 0o600)
      writeFileSync(pubKeyPath, keyPair.publicKey)

      // Validate public key format and get fingerprint
      const fingerprintOutput = execSync(`ssh-keygen -l -f "${pubKeyPath}"`, {
        encoding: 'utf-8',
      })
      expect(fingerprintOutput).toContain('ED25519')

      // Extract public key from private key (validates private key format)
      const extractedPub = execSync(`ssh-keygen -y -f "${keyPath}"`, {
        encoding: 'utf-8',
      })
      // Compare the key part (without comment) since ssh-keygen doesn't preserve comments when extracting
      const originalKeyPart = keyPair.publicKey.split(' ').slice(0, 2).join(' ')
      const extractedKeyPart = extractedPub.trim().split(' ').slice(0, 2).join(' ')
      expect(extractedKeyPart).toBe(originalKeyPart)
    } finally {
      try {
        unlinkSync(keyPath)
        unlinkSync(pubKeyPath)
      } catch {
        // Ignore cleanup errors
      }
    }
  })

  it('should generate valid RSA-4096 key verifiable by ssh-keygen', async () => {
    const comment = 'rsa-test@example.com'
    const keyPair = await generateSshKeyPair('rsa', comment, 4096)

    const keyPath = join(tmpDir, 'test_rsa')
    const pubKeyPath = join(tmpDir, 'test_rsa.pub')

    try {
      writeFileSync(keyPath, keyPair.privateKey)
      chmodSync(keyPath, 0o600)
      writeFileSync(pubKeyPath, keyPair.publicKey)

      // Validate public key format and get fingerprint
      const fingerprintOutput = execSync(`ssh-keygen -l -f "${pubKeyPath}"`, {
        encoding: 'utf-8',
      })
      expect(fingerprintOutput).toContain('RSA')
      expect(fingerprintOutput).toContain('4096')

      // Extract public key from private key (validates private key format)
      const extractedPub = execSync(`ssh-keygen -y -f "${keyPath}"`, {
        encoding: 'utf-8',
      })
      // Compare the key part (without comment)
      const originalKeyPart = keyPair.publicKey.split(' ').slice(0, 2).join(' ')
      const extractedKeyPart = extractedPub.trim().split(' ').slice(0, 2).join(' ')
      expect(extractedKeyPart).toBe(originalKeyPart)
    } finally {
      try {
        unlinkSync(keyPath)
        unlinkSync(pubKeyPath)
      } catch {
        // Ignore cleanup errors
      }
    }
  }, 60000) // RSA key generation and validation can be slow

  it('should generate fingerprint matching ssh-keygen output', async () => {
    const keyPair = await generateSshKeyPair('ed25519', 'fingerprint-test@example.com')

    const pubKeyPath = join(tmpDir, 'test_fingerprint.pub')

    try {
      writeFileSync(pubKeyPath, keyPair.publicKey)

      // Get fingerprint from ssh-keygen
      const fingerprintOutput = execSync(`ssh-keygen -l -f "${pubKeyPath}"`, {
        encoding: 'utf-8',
      })

      // Extract the SHA256 fingerprint from output like "256 SHA256:xxx user@host (ED25519)"
      const match = fingerprintOutput.match(/SHA256:([A-Za-z0-9+/=]+)/)
      expect(match).not.toBeNull()

      const sshKeygenFingerprint = `SHA256:${match![1]}`
      expect(keyPair.fingerprint).toBe(sshKeygenFingerprint)
    } finally {
      try {
        unlinkSync(pubKeyPath)
      } catch {
        // Ignore cleanup errors
      }
    }
  })

  // Cleanup temp directory after all tests
  afterAll(() => {
    try {
      rmSync(tmpDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
  })
})
