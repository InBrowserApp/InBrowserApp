import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import KeyGenerator from './KeyGenerator.vue'

const generatePgpKeyPairMock = vi.fn()

vi.mock('../pgp-keygen', () => ({
  generatePgpKeyPair: (...args: unknown[]) => generatePgpKeyPairMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: <T>(_: string, initialValue: T) => ref(initialValue),
  }
})

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
    inheritAttrs: false,
    template: '<div><slot /><slot name="icon" /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template:
      '<button :disabled="disabled" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
  })

  return {
    NAlert: Base,
    NButton,
    NFlex: Base,
    NIcon: Base,
    NSpace: Base,
    NText: Base,
  }
})

const KeyOptionsStub = defineComponent({
  name: 'KeyOptions',
  props: {
    algorithm: {
      type: String,
      required: true,
    },
    rsaKeySize: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    passphrase: {
      type: String,
      required: true,
    },
    expirationDays: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'update:algorithm',
    'update:rsaKeySize',
    'update:name',
    'update:email',
    'update:comment',
    'update:passphrase',
    'update:expirationDays',
  ],
  template: '<div class="options" />',
})

const KeyOutputStub = defineComponent({
  name: 'KeyOutput',
  props: {
    keyPair: {
      type: Object,
      required: true,
    },
    passphraseProtected: {
      type: Boolean,
      required: true,
    },
  },
  template: '<div class="output" />',
})

describe('KeyGenerator', () => {
  it('shows identity hint when generating without name or email', async () => {
    const wrapper = mount(KeyGenerator, {
      global: {
        stubs: {
          KeyOptions: KeyOptionsStub,
          KeyOutput: KeyOutputStub,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()

    wrapper.findComponent({ name: 'NButton' }).vm.$emit('click')
    await nextTick()

    expect(wrapper.text()).toContain('identityHint')
    expect(generatePgpKeyPairMock).not.toHaveBeenCalled()
  })

  it('generates a key pair and shows output', async () => {
    generatePgpKeyPairMock.mockResolvedValueOnce({
      publicKey: 'PUBLIC',
      privateKey: 'PRIVATE',
      revocationCertificate: 'REVOCATION',
      fingerprint: 'FINGERPRINT',
      keyID: 'DEADBEEF',
      userID: 'Alice',
    })

    const wrapper = mount(KeyGenerator, {
      global: {
        stubs: {
          KeyOptions: KeyOptionsStub,
          KeyOutput: KeyOutputStub,
        },
      },
    })

    const options = wrapper.findComponent(KeyOptionsStub)
    options.vm.$emit('update:name', 'Alice')
    options.vm.$emit('update:passphrase', 'secret')
    await nextTick()

    wrapper.findComponent({ name: 'NButton' }).vm.$emit('click')
    await flushPromises()

    expect(generatePgpKeyPairMock).toHaveBeenCalledWith({
      name: 'Alice',
      email: '',
      comment: '',
      passphrase: 'secret',
      algorithm: 'ecc',
      rsaKeySize: 4096,
      expirationDays: 0,
    })

    const output = wrapper.findComponent(KeyOutputStub)
    expect(output.exists()).toBe(true)
    expect(output.props('passphraseProtected')).toBe(true)
  })

  it('shows errors from generation failures', async () => {
    generatePgpKeyPairMock.mockRejectedValueOnce(new Error('boom'))

    const wrapper = mount(KeyGenerator, {
      global: {
        stubs: {
          KeyOptions: KeyOptionsStub,
          KeyOutput: KeyOutputStub,
        },
      },
    })

    const options = wrapper.findComponent(KeyOptionsStub)
    options.vm.$emit('update:email', 'alice@example.com')
    await nextTick()

    wrapper.findComponent({ name: 'NButton' }).vm.$emit('click')
    await flushPromises()

    expect(wrapper.text()).toContain('boom')
  })
})
