import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NMessageProvider } from 'naive-ui'
import { h } from 'vue'
import { createI18n } from 'vue-i18n'
import CertificatePublicKeyParser from './CertificatePublicKeyParser.vue'

const messages = {
  en: {
    inputTitle: 'Certificate or Public Key',
    inputPlaceholder: 'Paste PEM/DER content or drop a file...',
    inputHint:
      'Supported: X.509 certificates (PEM/DER) and PUBLIC KEY (SPKI). Multiple PEM blocks are supported.',
    resultsTitle: 'Parsed Result',
    parseErrorTitle: 'Parsing Error',
    warningsTitle: 'Warnings',
    invalidInput: 'Unrecognized input format. Provide PEM/DER data.',
    invalidPem: 'No valid PEM blocks found.',
    parseFailed: 'Unable to parse as a certificate or public key.',
    unsupportedPemBlock: 'Unsupported PEM block: {label}',
    certificateTab: 'Certificate {index}',
    publicKeyTab: 'Public Key {index}',
    certificate: 'Certificate',
    publicKey: 'Public Key',
    overview: 'Overview',
    subjectIssuer: 'Subject & Issuer',
    validity: 'Validity',
    keyAlgorithm: 'Key Algorithm',
    keySize: 'Key Size',
    curve: 'Curve',
    serialNumber: 'Serial Number',
    signatureAlgorithm: 'Signature Algorithm',
    subject: 'Subject',
    issuer: 'Issuer',
    notBefore: 'Not Before',
    notAfter: 'Not After',
    fingerprints: 'Fingerprints',
    fingerprintSha1: 'SHA-1',
    fingerprintSha256: 'SHA-256',
    extensions: 'Extensions',
    subjectAltName: 'Subject Alternative Name',
    keyUsage: 'Key Usage',
    extendedKeyUsage: 'Extended Key Usage',
    basicConstraints: 'Basic Constraints',
    subjectKeyIdentifier: 'Subject Key Identifier',
    authorityKeyIdentifier: 'Authority Key Identifier',
    notAvailable: 'Not available',
    bits: 'bits',
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
  missingWarn: false,
  fallbackWarn: false,
})

const CertificatePublicKeyParserWithProvider = {
  render() {
    return h(NMessageProvider, () => h(CertificatePublicKeyParser))
  },
}

const samplePem = `-----BEGIN CERTIFICATE-----
MIIBgTCCASegAwIBAgIUftI0mqWgxqcX9lWIS/FSiGXdbekwCgYIKoZIzj0EAwIw
FjEUMBIGA1UEAwwLZXhhbXBsZS5jb20wHhcNMjYwMTEzMDkxMTQ5WhcNMjcwMTEz
MDkxMTQ5WjAWMRQwEgYDVQQDDAtleGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqG
SM49AwEHA0IABLCYkUdrGAE8Kx15ZvhkqEvUPKLZyolQe9ySpKR/SdxsIk2GiLeb
V1YvmZpQ0ti51b7a8LE1sVbUA35GYnxdlZijUzBRMB0GA1UdDgQWBBQ36VA4D6ZE
UkQrQYbeEIF6deRE4TAfBgNVHSMEGDAWgBQ36VA4D6ZEUkQrQYbeEIF6deRE4TAP
BgNVHRMBAf8EBTADAQH/MAoGCCqGSM49BAMCA0gAMEUCIBYqVd8kI1xAIbgGDS8j
DGp+7YYIS154UJiV5nYAsNNeAiEAvKuZ5GUl+PwvetdfKjmrhGSuxUsNR/lxk8Fl
KyUxsKk=
-----END CERTIFICATE-----
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEsJiRR2sYATwrHXlm+GSoS9Q8otnK
iVB73JKkpH9J3GwiTYaIt5tXVi+ZmlDS2LnVvtrwsTWxVtQDfkZifF2VmA==
-----END PUBLIC KEY-----`

const mountWithI18n = () =>
  mount(CertificatePublicKeyParserWithProvider, {
    global: {
      plugins: [i18n],
    },
  })

let digestSpy: ReturnType<typeof vi.spyOn> | null = null

const waitForText = async (wrapper: ReturnType<typeof mountWithI18n>, text: string) => {
  await expect.poll(() => wrapper.text(), { timeout: 5000, interval: 50 }).toContain(text)
}

describe('CertificatePublicKeyParser', () => {
  beforeEach(() => {
    if (globalThis.crypto?.subtle?.digest) {
      digestSpy = vi
        .spyOn(globalThis.crypto.subtle, 'digest')
        .mockResolvedValue(new ArrayBuffer(0))
    } else {
      vi.stubGlobal('crypto', {
        subtle: {
          digest: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
        },
      })
    }
  })

  afterEach(() => {
    digestSpy?.mockRestore()
    digestSpy = null
    vi.unstubAllGlobals()
  })

  it('parses the default sample and renders results', async () => {
    const wrapper = mountWithI18n()
    const textarea = wrapper.find('textarea')
    await textarea.setValue(samplePem)
    await waitForText(wrapper, 'Parsed Result')

    expect(wrapper.text()).toContain('Parsed Result')
    expect(wrapper.text()).toContain('Certificate 1')
  })

  it('shows a parse error for invalid input', async () => {
    const wrapper = mountWithI18n()
    const textarea = wrapper.find('textarea')
    await textarea.setValue('not-a-cert')
    await waitForText(wrapper, 'Parsing Error')

    expect(wrapper.text()).toContain('Parsing Error')
    expect(wrapper.text()).toContain('Unrecognized input format')
  })
})
