import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import KeyOutput from './KeyOutput.vue'

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
    template: '<div class="alert"><span class="title">{{ title }}</span><slot /></div>',
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
    loading: { type: Boolean, default: false },
  },
  template: '<div class="public-key" />',
})

const PrivateKeyStub = defineComponent({
  name: 'PrivateKeySection',
  props: {
    value: { type: String, required: true },
    filename: { type: String, required: true },
    loading: { type: Boolean, default: false },
  },
  template: '<div class="private-key" />',
})

const FingerprintStub = defineComponent({
  name: 'FingerprintSection',
  props: {
    value: { type: String, required: true },
    loading: { type: Boolean, default: false },
  },
  template: '<div class="fingerprint" />',
})

describe('KeyOutput', () => {
  it('computes filenames for ed25519 keys', () => {
    const wrapper = mount(KeyOutput, {
      props: {
        publicKey: 'PUBLIC',
        privateKey: 'PRIVATE',
        fingerprint: 'FINGERPRINT',
        algorithm: 'ed25519',
        loading: false,
      },
      global: {
        stubs: {
          PublicKeySection: PublicKeyStub,
          PrivateKeySection: PrivateKeyStub,
          FingerprintSection: FingerprintStub,
        },
      },
    })

    expect(wrapper.findComponent(PublicKeyStub).props('filename')).toBe('id_ed25519.pub')
    expect(wrapper.findComponent(PrivateKeyStub).props('filename')).toBe('id_ed25519')
    expect(wrapper.text()).toContain('Security Warning')
    expect(wrapper.text()).toContain(
      'Never share your private key with anyone. Store it securely and consider using a passphrase for additional protection.',
    )
  })

  it('computes filenames for RSA keys', () => {
    const wrapper = mount(KeyOutput, {
      props: {
        publicKey: 'PUBLIC',
        privateKey: 'PRIVATE',
        fingerprint: 'FINGERPRINT',
        algorithm: 'rsa',
        loading: true,
      },
      global: {
        stubs: {
          PublicKeySection: PublicKeyStub,
          PrivateKeySection: PrivateKeyStub,
          FingerprintSection: FingerprintStub,
        },
      },
    })

    expect(wrapper.findComponent(PublicKeyStub).props('filename')).toBe('id_rsa.pub')
    expect(wrapper.findComponent(PrivateKeyStub).props('filename')).toBe('id_rsa')
    expect(wrapper.findComponent(PublicKeyStub).props('loading')).toBe(true)
    expect(wrapper.findComponent(PrivateKeyStub).props('loading')).toBe(true)
  })
})
