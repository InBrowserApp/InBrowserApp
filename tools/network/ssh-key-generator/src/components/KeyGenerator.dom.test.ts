import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import KeyGenerator from './KeyGenerator.vue'

const generateSshKeyPairMock = vi.fn()

vi.mock('../ssh-keygen', () => ({
  generateSshKeyPair: (...args: unknown[]) => generateSshKeyPairMock(...args),
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
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
  })

  return {
    NSpace: Base,
    NFlex: Base,
    NButton,
    NIcon: Base,
    NAlert: Base,
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
    comment: {
      type: String,
      required: true,
    },
  },
  emits: ['update:algorithm', 'update:rsaKeySize', 'update:comment'],
  template: '<div class="options" />',
})

const KeyOutputStub = defineComponent({
  name: 'KeyOutput',
  props: {
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    algorithm: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  template: '<div class="output" />',
})

describe('KeyGenerator', () => {
  it('generates a key pair on mount with defaults', async () => {
    generateSshKeyPairMock.mockResolvedValue({
      publicKey: 'PUBLIC',
      privateKey: 'PRIVATE',
      fingerprint: 'FINGERPRINT',
    })

    const wrapper = mount(KeyGenerator, {
      global: {
        stubs: {
          KeyOptions: KeyOptionsStub,
          KeyOutput: KeyOutputStub,
        },
      },
    })

    await flushPromises()

    expect(generateSshKeyPairMock.mock.calls[0]).toEqual(['ed25519', '', 4096])
    expect(wrapper.findComponent(KeyOutputStub).exists()).toBe(true)
  })

  it('regenerates when options change', async () => {
    generateSshKeyPairMock.mockResolvedValue({
      publicKey: 'PUBLIC',
      privateKey: 'PRIVATE',
      fingerprint: 'FINGERPRINT',
    })

    const wrapper = mount(KeyGenerator, {
      global: {
        stubs: {
          KeyOptions: KeyOptionsStub,
          KeyOutput: KeyOutputStub,
        },
      },
    })

    await flushPromises()
    generateSshKeyPairMock.mockClear()

    const options = wrapper.findComponent(KeyOptionsStub)
    options.vm.$emit('update:algorithm', 'rsa')
    options.vm.$emit('update:rsaKeySize', 2048)
    options.vm.$emit('update:comment', 'alice')
    await nextTick()
    await flushPromises()

    const calls = generateSshKeyPairMock.mock.calls
    expect(calls[calls.length - 1]).toEqual(['rsa', 'alice', 2048])
  })

  it('shows errors when generation fails', async () => {
    generateSshKeyPairMock.mockRejectedValueOnce(new Error('boom'))

    const wrapper = mount(KeyGenerator, {
      global: {
        stubs: {
          KeyOptions: KeyOptionsStub,
          KeyOutput: KeyOutputStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('boom')
    expect(wrapper.findComponent(KeyOutputStub).exists()).toBe(false)
  })
})
