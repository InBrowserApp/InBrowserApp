import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
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

const mountWithI18n = () =>
  mount(CertificatePublicKeyParserWithProvider, {
    global: {
      plugins: [i18n],
    },
  })

describe('CertificatePublicKeyParser', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('parses the default sample and renders results', async () => {
    const wrapper = mountWithI18n()
    await flushPromises()
    vi.advanceTimersByTime(200)
    await flushPromises()

    expect(wrapper.text()).toContain('Parsed Result')
    expect(wrapper.text()).toContain('Certificate 1')
  })

  it('shows a parse error for invalid input', async () => {
    const wrapper = mountWithI18n()
    await flushPromises()
    vi.advanceTimersByTime(200)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('not-a-cert')
    vi.advanceTimersByTime(200)
    await flushPromises()

    expect(wrapper.text()).toContain('Parsing Error')
    expect(wrapper.text()).toContain('Unrecognized input format')
  })
})
