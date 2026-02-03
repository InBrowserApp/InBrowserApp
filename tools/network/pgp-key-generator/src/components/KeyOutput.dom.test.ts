import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import KeyOutput from './KeyOutput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div><slot /></div>',
  })

  const NAlert = defineComponent({
    name: 'NAlert',
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    template: '<div class="alert">{{ title }}<slot /></div>',
  })

  return {
    NSpace: Base,
    NAlert,
  }
})

const PublicKeyStub = defineComponent({
  name: 'PublicKeySection',
  props: {
    value: { type: String, required: true },
    filename: { type: String, required: true },
  },
  template: '<div class="public-key" />',
})

const PrivateKeyStub = defineComponent({
  name: 'PrivateKeySection',
  props: {
    value: { type: String, required: true },
    filename: { type: String, required: true },
  },
  template: '<div class="private-key" />',
})

const RevocationStub = defineComponent({
  name: 'RevocationCertificateSection',
  props: {
    value: { type: String, required: true },
    filename: { type: String, required: true },
  },
  template: '<div class="revocation" />',
})

const FingerprintStub = defineComponent({
  name: 'FingerprintSection',
  props: {
    fingerprint: { type: String, required: true },
    keyId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  template: '<div class="fingerprint" />',
})

describe('KeyOutput', () => {
  it('computes filenames and shows warnings', () => {
    const wrapper = mount(KeyOutput, {
      props: {
        keyPair: {
          publicKey: 'PUBLIC',
          privateKey: 'PRIVATE',
          revocationCertificate: 'REVOCATION',
          fingerprint: 'FINGERPRINT',
          keyID: 'ABC123',
          userID: 'Alice',
        },
        passphraseProtected: false,
      },
      global: {
        stubs: {
          PublicKeySection: PublicKeyStub,
          PrivateKeySection: PrivateKeyStub,
          RevocationCertificateSection: RevocationStub,
          FingerprintSection: FingerprintStub,
        },
      },
    })

    expect(wrapper.findComponent(PublicKeyStub).props('filename')).toBe('pgp-public-abc123.asc')
    expect(wrapper.findComponent(PrivateKeyStub).props('filename')).toBe('pgp-private-abc123.asc')
    expect(wrapper.findComponent(RevocationStub).props('filename')).toBe(
      'pgp-revocation-abc123.asc',
    )

    expect(wrapper.text()).toContain('securityWarning')
    expect(wrapper.text()).toContain('unprotectedWarning')
  })

  it('omits the revocation section when not available', () => {
    const wrapper = mount(KeyOutput, {
      props: {
        keyPair: {
          publicKey: 'PUBLIC',
          privateKey: 'PRIVATE',
          revocationCertificate: '',
          fingerprint: 'FINGERPRINT',
          keyID: 'ABC123',
          userID: '',
        },
        passphraseProtected: true,
      },
      global: {
        stubs: {
          PublicKeySection: PublicKeyStub,
          PrivateKeySection: PrivateKeyStub,
          RevocationCertificateSection: RevocationStub,
          FingerprintSection: FingerprintStub,
        },
      },
    })

    expect(wrapper.findComponent(RevocationStub).exists()).toBe(false)
    expect(wrapper.text()).toContain('securityWarning')
    expect(wrapper.text()).not.toContain('unprotectedWarning')
  })
})
