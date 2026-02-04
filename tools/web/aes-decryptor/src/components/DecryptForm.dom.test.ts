import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, defineComponent, nextTick, type Ref } from 'vue'
import DecryptForm from './DecryptForm.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

const aesMocks = vi.hoisted(() => ({
  decryptWithPassword: vi.fn(),
  decryptWithRawKey: vi.fn(),
  decryptJweWithPassword: vi.fn(),
  decryptJweWithRawKey: vi.fn(),
  isJweFormat: vi.fn(),
  parseJweHeader: vi.fn(),
  getConfigFromJweEnc: vi.fn(),
}))

vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, initialValue: unknown) => {
    if (!storage.has(key)) {
      storage.set(key, ref(initialValue))
    }
    return storage.get(key) as Ref<unknown>
  },
}))

vi.mock('@utils/aes', async () => {
  const actual = await vi.importActual<typeof import('@utils/aes')>('@utils/aes')
  return {
    ...actual,
    decryptWithPassword: aesMocks.decryptWithPassword,
    decryptWithRawKey: aesMocks.decryptWithRawKey,
    decryptJweWithPassword: aesMocks.decryptJweWithPassword,
    decryptJweWithRawKey: aesMocks.decryptJweWithRawKey,
    isJweFormat: aesMocks.isJweFormat,
    parseJweHeader: aesMocks.parseJweHeader,
    getConfigFromJweEnc: aesMocks.getConfigFromJweEnc,
    arrayBufferToString: () => 'decoded-text',
    arrayBufferToHex: () => 'decoded-hex',
    arrayBufferToBase64: () => 'decoded-base64',
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
    template: '<div class="base"><slot /></div>',
  })
  const NButton = defineComponent({
    name: 'NButton',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template:
      '<button class="n-button" :disabled="disabled" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })
  const NTag = defineComponent({
    name: 'NTag',
    props: {
      type: {
        type: String,
        default: 'info',
      },
    },
    template: '<span class="n-tag" :data-type="type"><slot /></span>',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  return {
    NSpace: Base,
    NButton,
    NIcon: Base,
    NTag,
    NText,
  }
})

vi.mock('@vicons/fluent/LockOpen16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'LockOpenIcon',
      template: '<svg class="lock-open" />',
    }),
  }
})

const TextOrFileInputStub = defineComponent({
  name: 'TextOrFileInput',
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  template: '<div class="text-or-file-input" />',
})

const KeyInputStub = defineComponent({
  name: 'KeyInput',
  props: ['keyType', 'password', 'rawKey', 'keyLength'],
  emits: ['update:key-type', 'update:password', 'update:raw-key'],
  template: '<div class="key-input" />',
})

const DecryptOptionsStub = defineComponent({
  name: 'DecryptOptions',
  props: ['isJweMode', 'mode', 'keyLength', 'inputFormat'],
  emits: ['update:mode', 'update:key-length', 'update:input-format'],
  template: '<div class="decrypt-options" />',
})

const AdvancedOptionsStub = defineComponent({
  name: 'AdvancedOptions',
  props: ['isJweMode', 'keyType', 'pbkdf2Iterations', 'pbkdf2Hash'],
  emits: ['update:pbkdf2-iterations', 'update:pbkdf2-hash'],
  template: '<div class="advanced-options" />',
})

const DecryptResultStub = defineComponent({
  name: 'DecryptResult',
  props: ['result', 'resultHex', 'resultBinary', 'error'],
  template:
    '<div class="decrypt-result" :data-result="result" :data-hex="resultHex" :data-error="error" :data-binary="resultBinary ? \'yes\' : \'no\'" />',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="tool-section"><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h3 class="tool-section-header"><slot /></h3>',
})

const mountForm = () =>
  mount(DecryptForm, {
    global: {
      stubs: {
        TextOrFileInput: TextOrFileInputStub,
        KeyInput: KeyInputStub,
        DecryptOptions: DecryptOptionsStub,
        AdvancedOptions: AdvancedOptionsStub,
        DecryptResult: DecryptResultStub,
        ToolSection: ToolSectionStub,
        ToolSectionHeader: ToolSectionHeaderStub,
      },
    },
  })

describe('DecryptForm', () => {
  beforeEach(() => {
    storage.clear()
    vi.clearAllMocks()
  })

  it('detects JWE input and updates mode/key length', async () => {
    aesMocks.isJweFormat.mockReturnValue(true)
    aesMocks.parseJweHeader.mockReturnValue({
      enc: 'A256GCM',
      alg: 'PBES2-HS256+A128KW',
      p2c: 1000,
    })
    aesMocks.getConfigFromJweEnc.mockReturnValue({ mode: 'GCM', keyLength: 256 })

    storage.set('tools:aes-decryptor:mode', ref('CBC'))
    storage.set('tools:aes-decryptor:keyLength', ref(128))
    storage.set('tools:aes-decryptor:keyType', ref('password'))
    storage.set('tools:aes-decryptor:password', ref('secret'))
    storage.set('tools:aes-decryptor:rawKey', ref(''))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'jwe-token')
    await nextTick()

    expect(wrapper.find('.n-tag').attributes('data-type')).toBe('success')
    expect(wrapper.text()).toContain('GCM-256')
    expect(wrapper.text()).toContain('alg:')

    const mode = storage.get('tools:aes-decryptor:mode') as Ref<string>
    const keyLength = storage.get('tools:aes-decryptor:keyLength') as Ref<number>

    expect(mode.value).toBe('GCM')
    expect(keyLength.value).toBe(256)
  })

  it('decrypts base64 input with password', async () => {
    aesMocks.isJweFormat.mockReturnValue(false)
    aesMocks.parseJweHeader.mockReturnValue(null)
    aesMocks.getConfigFromJweEnc.mockReturnValue(null)
    aesMocks.decryptWithPassword.mockResolvedValue(new ArrayBuffer(4))

    storage.set('tools:aes-decryptor:keyType', ref('password'))
    storage.set('tools:aes-decryptor:password', ref('secret'))
    storage.set('tools:aes-decryptor:mode', ref('GCM'))
    storage.set('tools:aes-decryptor:keyLength', ref(256))
    storage.set('tools:aes-decryptor:inputFormat', ref('base64'))
    storage.set('tools:aes-decryptor:pbkdf2Iterations', ref(9999))
    storage.set('tools:aes-decryptor:pbkdf2Hash', ref('SHA-512'))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'Zm9v')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.decryptWithPassword).toHaveBeenCalledWith(
      'Zm9v',
      'secret',
      'GCM',
      256,
      'base64',
      {
        iterations: 9999,
        hash: 'SHA-512',
      },
    )

    const result = wrapper.find('.decrypt-result')
    expect(result.attributes('data-result')).toBe('decoded-text')
    expect(result.attributes('data-hex')).toBe('decoded-hex')
  })

  it('decrypts hex input with a raw key', async () => {
    aesMocks.isJweFormat.mockReturnValue(false)
    aesMocks.parseJweHeader.mockReturnValue(null)
    aesMocks.getConfigFromJweEnc.mockReturnValue(null)
    aesMocks.decryptWithRawKey.mockResolvedValue(new ArrayBuffer(2))

    storage.set('tools:aes-decryptor:keyType', ref('raw'))
    storage.set('tools:aes-decryptor:rawKey', ref('a'.repeat(32)))
    storage.set('tools:aes-decryptor:mode', ref('CBC'))
    storage.set('tools:aes-decryptor:keyLength', ref(128))
    storage.set('tools:aes-decryptor:inputFormat', ref('base64'))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'cafebabe')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.decryptWithRawKey).toHaveBeenCalledWith(
      'cafebabe',
      'a'.repeat(32),
      'CBC',
      128,
      'hex',
    )
  })

  it('handles binary file input by converting to base64', async () => {
    aesMocks.isJweFormat.mockReturnValue(false)
    aesMocks.parseJweHeader.mockReturnValue(null)
    aesMocks.getConfigFromJweEnc.mockReturnValue(null)
    aesMocks.decryptWithPassword.mockResolvedValue(new ArrayBuffer(1))

    storage.set('tools:aes-decryptor:keyType', ref('password'))
    storage.set('tools:aes-decryptor:password', ref('secret'))
    storage.set('tools:aes-decryptor:mode', ref('GCM'))
    storage.set('tools:aes-decryptor:keyLength', ref(256))
    storage.set('tools:aes-decryptor:inputFormat', ref('hex'))

    const wrapper = mountForm()
    const file = new File([new Uint8Array([1, 2, 3])], 'data.bin', {
      type: 'application/octet-stream',
    })

    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', file)
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.decryptWithPassword).toHaveBeenCalledWith(
      'decoded-base64',
      'secret',
      'GCM',
      256,
      'base64',
      expect.any(Object),
    )

    const inputFormat = storage.get('tools:aes-decryptor:inputFormat') as Ref<string>
    expect(inputFormat.value).toBe('base64')
  })

  it('syncs updates from child components', async () => {
    storage.set('tools:aes-decryptor:keyType', ref('password'))
    storage.set('tools:aes-decryptor:password', ref(''))
    storage.set('tools:aes-decryptor:rawKey', ref(''))
    storage.set('tools:aes-decryptor:mode', ref('GCM'))
    storage.set('tools:aes-decryptor:keyLength', ref(256))
    storage.set('tools:aes-decryptor:inputFormat', ref('base64'))
    storage.set('tools:aes-decryptor:pbkdf2Iterations', ref(1000))
    storage.set('tools:aes-decryptor:pbkdf2Hash', ref('SHA-256'))

    const wrapper = mountForm()

    wrapper.findComponent(KeyInputStub).vm.$emit('update:key-type', 'raw')
    wrapper.findComponent(KeyInputStub).vm.$emit('update:password', 'next')
    wrapper.findComponent(KeyInputStub).vm.$emit('update:raw-key', 'beef')
    wrapper.findComponent(DecryptOptionsStub).vm.$emit('update:mode', 'CBC')
    wrapper.findComponent(DecryptOptionsStub).vm.$emit('update:key-length', 128)
    wrapper.findComponent(DecryptOptionsStub).vm.$emit('update:input-format', 'hex')
    wrapper.findComponent(AdvancedOptionsStub).vm.$emit('update:pbkdf2-iterations', 1234)
    wrapper.findComponent(AdvancedOptionsStub).vm.$emit('update:pbkdf2-hash', 'SHA-512')

    await nextTick()

    expect((storage.get('tools:aes-decryptor:keyType') as Ref<string>).value).toBe('raw')
    expect((storage.get('tools:aes-decryptor:password') as Ref<string>).value).toBe('next')
    expect((storage.get('tools:aes-decryptor:rawKey') as Ref<string>).value).toBe('beef')
    expect((storage.get('tools:aes-decryptor:mode') as Ref<string>).value).toBe('CBC')
    expect((storage.get('tools:aes-decryptor:keyLength') as Ref<number>).value).toBe(128)
    expect((storage.get('tools:aes-decryptor:inputFormat') as Ref<string>).value).toBe('hex')
    expect((storage.get('tools:aes-decryptor:pbkdf2Iterations') as Ref<number>).value).toBe(1234)
    expect((storage.get('tools:aes-decryptor:pbkdf2Hash') as Ref<string>).value).toBe('SHA-512')
  })

  it('disables decrypt when raw key is missing or invalid', async () => {
    aesMocks.isJweFormat.mockReturnValue(false)

    storage.set('tools:aes-decryptor:keyType', ref('raw'))
    storage.set('tools:aes-decryptor:rawKey', ref(''))
    storage.set('tools:aes-decryptor:keyLength', ref(128))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'Zm9v')
    await nextTick()

    const button = wrapper.find('button.n-button')
    const buttonEl = button.element as HTMLButtonElement
    expect(buttonEl.disabled).toBe(true)

    const rawKey = storage.get('tools:aes-decryptor:rawKey') as Ref<string>
    rawKey.value = 'zz'
    await nextTick()
    expect(buttonEl.disabled).toBe(true)

    rawKey.value = 'aa'
    await nextTick()
    expect(buttonEl.disabled).toBe(true)
  })

  it('does not detect a format for invalid base64 input', async () => {
    aesMocks.isJweFormat.mockReturnValue(false)

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'not@@base64')
    await nextTick()

    expect(wrapper.find('.n-tag').exists()).toBe(false)
  })

  it('skips detected details when JWE header is missing', async () => {
    aesMocks.isJweFormat.mockReturnValue(true)
    aesMocks.parseJweHeader.mockReturnValue(null)
    aesMocks.getConfigFromJweEnc.mockReturnValue(null)

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'jwe-token')
    await nextTick()

    expect(wrapper.find('.n-tag').exists()).toBe(true)
    expect(wrapper.findAll('.n-text')).toHaveLength(1)
  })

  it('reads text files and decrypts with password', async () => {
    aesMocks.isJweFormat.mockReturnValue(false)
    aesMocks.decryptWithPassword.mockResolvedValue(new ArrayBuffer(1))

    storage.set('tools:aes-decryptor:keyType', ref('password'))
    storage.set('tools:aes-decryptor:password', ref('secret'))
    storage.set('tools:aes-decryptor:mode', ref('GCM'))
    storage.set('tools:aes-decryptor:keyLength', ref(256))
    storage.set('tools:aes-decryptor:inputFormat', ref('base64'))

    const wrapper = mountForm()
    const file = new File(['  Zm9v  '], 'data.txt', { type: 'text/plain' })

    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', file)
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.decryptWithPassword).toHaveBeenCalledWith(
      'Zm9v',
      'secret',
      'GCM',
      256,
      'base64',
      expect.any(Object),
    )
  })

  it('decrypts JWE input with password', async () => {
    aesMocks.isJweFormat.mockReturnValue(true)
    aesMocks.decryptJweWithPassword.mockResolvedValue(new ArrayBuffer(1))

    storage.set('tools:aes-decryptor:keyType', ref('password'))
    storage.set('tools:aes-decryptor:password', ref('secret'))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'jwe-token')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.decryptJweWithPassword).toHaveBeenCalledWith('jwe-token', 'secret')
  })

  it('decrypts JWE input with raw key', async () => {
    aesMocks.isJweFormat.mockReturnValue(true)
    aesMocks.decryptJweWithRawKey.mockResolvedValue(new ArrayBuffer(1))

    storage.set('tools:aes-decryptor:keyType', ref('raw'))
    storage.set('tools:aes-decryptor:rawKey', ref('a'.repeat(64)))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'jwe-token')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.decryptJweWithRawKey).toHaveBeenCalledWith('jwe-token', 'a'.repeat(64))
  })

  it('uses a fallback message for non-error failures', async () => {
    aesMocks.isJweFormat.mockReturnValue(false)
    aesMocks.decryptWithPassword.mockRejectedValue('boom')

    storage.set('tools:aes-decryptor:keyType', ref('password'))
    storage.set('tools:aes-decryptor:password', ref('secret'))
    storage.set('tools:aes-decryptor:mode', ref('GCM'))
    storage.set('tools:aes-decryptor:keyLength', ref(256))
    storage.set('tools:aes-decryptor:inputFormat', ref('base64'))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'Zm9v')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    const result = wrapper.find('.decrypt-result')
    expect(result.attributes('data-error')).toBe('decryptionFailed')
  })
})
