import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ParsedEntryDetails from './ParsedEntryDetails.vue'
import type { CertificateEntry, CertificateExtensions, PublicKeyEntry } from '../utils/types'

const OverviewStub = defineComponent({
  name: 'ParsedEntryOverviewSection',
  props: {
    isCertificate: {
      type: Boolean,
      required: true,
    },
    serialNumber: {
      type: String,
      default: undefined,
    },
    signatureAlgorithm: {
      type: String,
      default: undefined,
    },
    keyAlgorithm: {
      type: String,
      default: undefined,
    },
    keySize: {
      type: Number,
      default: undefined,
    },
    curve: {
      type: String,
      default: undefined,
    },
  },
  template:
    '<div data-testid="overview" :data-is-certificate="String(isCertificate)" :data-serial-number="serialNumber" :data-signature-algorithm="signatureAlgorithm" :data-key-algorithm="keyAlgorithm" :data-key-size="keySize" :data-curve="curve" />',
})

const SubjectIssuerStub = defineComponent({
  name: 'ParsedEntrySubjectIssuerSection',
  props: {
    subject: {
      type: String,
      required: true,
    },
    issuer: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="subject-issuer" :data-subject="subject" :data-issuer="issuer" />',
})

const ValidityStub = defineComponent({
  name: 'ParsedEntryValiditySection',
  props: {
    notBefore: {
      type: String,
      required: true,
    },
    notAfter: {
      type: String,
      required: true,
    },
  },
  template:
    '<div data-testid="validity" :data-not-before="notBefore" :data-not-after="notAfter" />',
})

const FingerprintsStub = defineComponent({
  name: 'ParsedEntryFingerprintsSection',
  props: {
    sha1: {
      type: String,
      required: true,
    },
    sha256: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="fingerprints" :data-sha1="sha1" :data-sha256="sha256" />',
})

const ExtensionsStub = defineComponent({
  name: 'ParsedEntryExtensionsSection',
  props: {
    extensions: {
      type: Object,
      required: true,
    },
  },
  template: '<div data-testid="extensions" />',
})

const certificateBase: CertificateEntry = {
  type: 'certificate',
  label: 'Certificate 1',
  subject: 'CN=example.com',
  issuer: 'CN=issuer',
  serialNumber: '01:02',
  notBefore: '2024-01-01',
  notAfter: '2025-01-01',
  signatureAlgorithm: 'RSA',
  publicKeyAlgorithm: 'RSA',
  publicKeySize: 2048,
  publicKeyCurve: 'P-256',
  fingerprints: {
    sha1: 'AA:BB',
    sha256: 'CC:DD',
  },
  extensions: {},
}

const publicKeyBase: PublicKeyEntry = {
  type: 'publicKey',
  label: 'Public Key 1',
  algorithm: 'EC',
  keySize: 256,
  curve: 'P-256',
  fingerprints: {
    sha1: 'EE:FF',
    sha256: '11:22',
  },
}

const mountDetails = (entry: CertificateEntry | PublicKeyEntry | Record<string, unknown>) =>
  mount(ParsedEntryDetails, {
    props: {
      entry: entry as unknown as CertificateEntry | PublicKeyEntry,
    },
    global: {
      stubs: {
        ParsedEntryOverviewSection: OverviewStub,
        ParsedEntrySubjectIssuerSection: SubjectIssuerStub,
        ParsedEntryValiditySection: ValidityStub,
        ParsedEntryFingerprintsSection: FingerprintsStub,
        ParsedEntryExtensionsSection: ExtensionsStub,
      },
    },
  })

const makeCertificate = (extensions: CertificateExtensions): CertificateEntry => ({
  ...certificateBase,
  extensions,
})

describe('ParsedEntryDetails', () => {
  it('renders certificate-specific sections and forwards certificate values', () => {
    const wrapper = mountDetails(
      makeCertificate({
        subjectAlternativeNames: ['DNS: example.com'],
      }),
    )

    const overview = wrapper.get('[data-testid="overview"]')
    expect(overview.attributes('data-is-certificate')).toBe('true')
    expect(overview.attributes('data-key-algorithm')).toBe('RSA')
    expect(overview.attributes('data-key-size')).toBe('2048')
    expect(overview.attributes('data-curve')).toBe('P-256')

    expect(wrapper.find('[data-testid="subject-issuer"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="validity"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="fingerprints"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="extensions"]').exists()).toBe(true)
  })

  it('renders public-key entries without certificate-only sections', () => {
    const wrapper = mountDetails(publicKeyBase)

    const overview = wrapper.get('[data-testid="overview"]')
    expect(overview.attributes('data-is-certificate')).toBe('false')
    expect(overview.attributes('data-key-algorithm')).toBe('EC')
    expect(overview.attributes('data-key-size')).toBe('256')
    expect(overview.attributes('data-curve')).toBe('P-256')

    const vm = wrapper.vm as unknown as { extensions: CertificateExtensions }
    expect(vm.extensions).toEqual({})

    expect(wrapper.find('[data-testid="subject-issuer"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="validity"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="extensions"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="fingerprints"]').exists()).toBe(true)
  })

  it('falls back safely for unexpected entry types', () => {
    const wrapper = mountDetails({
      type: 'unknown',
      label: 'Unknown',
      fingerprints: {
        sha1: 'AA',
        sha256: 'BB',
      },
    })

    const overview = wrapper.get('[data-testid="overview"]')
    expect(overview.attributes('data-is-certificate')).toBe('false')
    expect(overview.attributes('data-key-algorithm')).toBe('')
    expect(overview.attributes('data-key-size')).toBeUndefined()
    expect(overview.attributes('data-curve')).toBeUndefined()
    expect(wrapper.find('[data-testid="extensions"]').exists()).toBe(false)
  })

  it.each([
    { subjectAlternativeNames: ['DNS: example.com'] },
    { keyUsage: ['Digital Signature'] },
    { extendedKeyUsage: ['Server Auth'] },
    { basicConstraints: 'CA: false' },
    { subjectKeyIdentifier: 'AA:BB' },
    { authorityKeyIdentifier: 'CC:DD' },
  ])('shows extensions when at least one extension field exists: %j', (extensions) => {
    const wrapper = mountDetails(makeCertificate(extensions))
    expect(wrapper.find('[data-testid="extensions"]').exists()).toBe(true)
  })

  it('hides extensions when certificate extensions are empty', () => {
    const wrapper = mountDetails(makeCertificate({}))
    expect(wrapper.find('[data-testid="extensions"]').exists()).toBe(false)
  })
})
