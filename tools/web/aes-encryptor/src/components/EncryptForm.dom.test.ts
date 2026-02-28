import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, defineComponent, nextTick, type Ref } from 'vue'
import EncryptForm from './EncryptForm.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

const aesMocks = vi.hoisted(() => ({
  encryptWithPassword: vi.fn(),
  encryptWithRawKey: vi.fn(),
  encryptJweWithPassword: vi.fn(),
  encryptJweWithRawKey: vi.fn(),
  isValidHex: vi.fn(),
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
    encryptWithPassword: aesMocks.encryptWithPassword,
    encryptWithRawKey: aesMocks.encryptWithRawKey,
    encryptJweWithPassword: aesMocks.encryptJweWithPassword,
    encryptJweWithRawKey: aesMocks.encryptJweWithRawKey,
    isValidHex: aesMocks.isValidHex,
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
  return {
    NSpace: Base,
    NButton,
    NIcon: Base,
  }
})

vi.mock('@vicons/fluent/LockClosed16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'LockClosedIcon',
      template: '<svg class="lock-closed" />',
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

const EncryptOptionsStub = defineComponent({
  name: 'EncryptOptions',
  props: ['outputMode', 'mode', 'keyLength', 'outputFormat', 'keyType'],
  emits: ['update:output-mode', 'update:mode', 'update:key-length', 'update:output-format'],
  template: '<div class="encrypt-options" />',
})

const AdvancedOptionsStub = defineComponent({
  name: 'AdvancedOptions',
  props: [
    'keyType',
    'outputMode',
    'ivLength',
    'pbkdf2Iterations',
    'pbkdf2Hash',
    'saltMode',
    'manualSalt',
    'ivMode',
    'manualIv',
  ],
  emits: [
    'update:pbkdf2-iterations',
    'update:pbkdf2-hash',
    'update:salt-mode',
    'update:manual-salt',
    'update:iv-mode',
    'update:manual-iv',
  ],
  template: '<div class="advanced-options" />',
})

const EncryptResultStub = defineComponent({
  name: 'EncryptResult',
  props: ['result', 'error', 'salt', 'iv', 'binary', 'outputMode', 'outputFormat'],
  template:
    '<div class="encrypt-result" :data-result="result" :data-error="error" :data-salt="salt" :data-iv="iv" :data-binary="binary ? \'yes\' : \'no\'" />',
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
  mount(EncryptForm, {
    global: {
      stubs: {
        TextOrFileInput: TextOrFileInputStub,
        KeyInput: KeyInputStub,
        EncryptOptions: EncryptOptionsStub,
        AdvancedOptions: AdvancedOptionsStub,
        EncryptResult: EncryptResultStub,
        ToolSection: ToolSectionStub,
        ToolSectionHeader: ToolSectionHeaderStub,
      },
    },
  })

describe('EncryptForm', () => {
  beforeEach(() => {
    storage.clear()
    vi.clearAllMocks()
    aesMocks.isValidHex.mockReturnValue(true)
  })

  it('forces raw output when switching to CTR mode', async () => {
    storage.set('tools:aes-encryptor:outputMode', ref('jwe'))
    storage.set('tools:aes-encryptor:mode', ref('GCM'))

    mountForm()

    const outputMode = storage.get('tools:aes-encryptor:outputMode') as Ref<string>
    const mode = storage.get('tools:aes-encryptor:mode') as Ref<string>

    mode.value = 'CTR'
    await nextTick()

    expect(outputMode.value).toBe('raw')
  })

  it('encrypts JWE with a password', async () => {
    aesMocks.encryptJweWithPassword.mockResolvedValue('jwe-token')

    storage.set('tools:aes-encryptor:keyType', ref('password'))
    storage.set('tools:aes-encryptor:password', ref('secret'))
    storage.set('tools:aes-encryptor:mode', ref('GCM'))
    storage.set('tools:aes-encryptor:keyLength', ref(256))
    storage.set('tools:aes-encryptor:outputMode', ref('jwe'))
    storage.set('tools:aes-encryptor:pbkdf2Iterations', ref(5555))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'hello')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.encryptJweWithPassword).toHaveBeenCalledWith('hello', 'secret', 'GCM', 256, {
      iterations: 5555,
    })

    const result = wrapper.find('.encrypt-result')
    expect(result.attributes('data-result')).toBe('jwe-token')
    expect(result.attributes('data-salt')).toBe('(embedded in JWE)')
    expect(result.attributes('data-iv')).toBe('(embedded in JWE)')
  })

  it('encrypts JWE with a raw key', async () => {
    aesMocks.encryptJweWithRawKey.mockResolvedValue('jwe-raw')

    storage.set('tools:aes-encryptor:keyType', ref('raw'))
    storage.set('tools:aes-encryptor:rawKey', ref('a'.repeat(32)))
    storage.set('tools:aes-encryptor:mode', ref('GCM'))
    storage.set('tools:aes-encryptor:keyLength', ref(128))
    storage.set('tools:aes-encryptor:outputMode', ref('jwe'))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'hello')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.encryptJweWithRawKey).toHaveBeenCalledWith('hello', 'a'.repeat(32), 'GCM', 128)

    const result = wrapper.find('.encrypt-result')
    expect(result.attributes('data-result')).toBe('jwe-raw')
  })

  it('encrypts raw output with password and manual salt/iv', async () => {
    aesMocks.encryptWithPassword.mockResolvedValue({
      output: 'out',
      salt: 'salt',
      iv: 'iv',
      binary: new ArrayBuffer(1),
    })

    storage.set('tools:aes-encryptor:keyType', ref('password'))
    storage.set('tools:aes-encryptor:password', ref('secret'))
    storage.set('tools:aes-encryptor:mode', ref('GCM'))
    storage.set('tools:aes-encryptor:keyLength', ref(256))
    storage.set('tools:aes-encryptor:outputMode', ref('raw'))
    storage.set('tools:aes-encryptor:outputFormat', ref('hex'))
    storage.set('tools:aes-encryptor:pbkdf2Iterations', ref(9999))
    storage.set('tools:aes-encryptor:pbkdf2Hash', ref('SHA-512'))

    const wrapper = mountForm()

    const file = new File([new Uint8Array([1, 2, 3])], 'data.bin', {
      type: 'application/octet-stream',
    })

    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', file)
    await nextTick()

    const advanced = wrapper.findComponent(AdvancedOptionsStub)
    advanced.vm.$emit('update:salt-mode', 'manual')
    advanced.vm.$emit('update:manual-salt', '0f0f')
    advanced.vm.$emit('update:iv-mode', 'manual')
    advanced.vm.$emit('update:manual-iv', '0102')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    const options = aesMocks.encryptWithPassword.mock.calls[0]?.[5] as {
      iterations?: number
      hash?: string
      salt?: Uint8Array
      iv?: Uint8Array
    }

    expect(aesMocks.encryptWithPassword).toHaveBeenCalledWith(
      expect.any(ArrayBuffer),
      'secret',
      'GCM',
      256,
      'hex',
      expect.any(Object),
    )
    expect(options.iterations).toBe(9999)
    expect(options.hash).toBe('SHA-512')
    expect(Array.from(options.salt ?? [])).toEqual([15, 15])
    expect(Array.from(options.iv ?? [])).toEqual([1, 2])

    const result = wrapper.find('.encrypt-result')
    expect(result.attributes('data-result')).toBe('out')
    expect(result.attributes('data-binary')).toBe('yes')
  })

  it('encrypts raw output with a raw key', async () => {
    aesMocks.encryptWithRawKey.mockResolvedValue({
      output: 'raw',
      salt: '',
      iv: 'iv',
      binary: null,
    })

    storage.set('tools:aes-encryptor:keyType', ref('raw'))
    storage.set('tools:aes-encryptor:rawKey', ref('a'.repeat(32)))
    storage.set('tools:aes-encryptor:mode', ref('CBC'))
    storage.set('tools:aes-encryptor:keyLength', ref(128))
    storage.set('tools:aes-encryptor:outputMode', ref('raw'))
    storage.set('tools:aes-encryptor:outputFormat', ref('base64'))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'data')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    expect(aesMocks.encryptWithRawKey).toHaveBeenCalledWith(
      'data',
      'a'.repeat(32),
      'CBC',
      128,
      'base64',
      { iv: undefined },
    )
  })

  it('reports encryption errors', async () => {
    aesMocks.encryptJweWithPassword.mockRejectedValue(new Error('boom'))

    storage.set('tools:aes-encryptor:keyType', ref('password'))
    storage.set('tools:aes-encryptor:password', ref('secret'))
    storage.set('tools:aes-encryptor:mode', ref('GCM'))
    storage.set('tools:aes-encryptor:keyLength', ref(256))
    storage.set('tools:aes-encryptor:outputMode', ref('jwe'))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'hello')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    const result = wrapper.find('.encrypt-result')
    expect(result.attributes('data-error')).toBe('boom')
  })

  it('stringifies non-Error encryption failures', async () => {
    aesMocks.encryptJweWithPassword.mockRejectedValue('boom-string')

    storage.set('tools:aes-encryptor:keyType', ref('password'))
    storage.set('tools:aes-encryptor:password', ref('secret'))
    storage.set('tools:aes-encryptor:mode', ref('GCM'))
    storage.set('tools:aes-encryptor:keyLength', ref(256))
    storage.set('tools:aes-encryptor:outputMode', ref('jwe'))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'hello')
    await nextTick()

    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()

    const result = wrapper.find('.encrypt-result')
    expect(result.attributes('data-error')).toBe('boom-string')
  })

  it('updates state when child components emit changes', async () => {
    const wrapper = mountForm()

    const keyType = storage.get('tools:aes-encryptor:keyType') as Ref<string>
    const password = storage.get('tools:aes-encryptor:password') as Ref<string>
    const rawKey = storage.get('tools:aes-encryptor:rawKey') as Ref<string>
    const outputMode = storage.get('tools:aes-encryptor:outputMode') as Ref<string>
    const mode = storage.get('tools:aes-encryptor:mode') as Ref<string>
    const keyLength = storage.get('tools:aes-encryptor:keyLength') as Ref<number>
    const outputFormat = storage.get('tools:aes-encryptor:outputFormat') as Ref<string>
    const pbkdf2Iterations = storage.get('tools:aes-encryptor:pbkdf2Iterations') as Ref<number>
    const pbkdf2Hash = storage.get('tools:aes-encryptor:pbkdf2Hash') as Ref<string>

    wrapper.findComponent(KeyInputStub).vm.$emit('update:key-type', 'raw')
    wrapper.findComponent(KeyInputStub).vm.$emit('update:password', 'next')
    wrapper.findComponent(KeyInputStub).vm.$emit('update:raw-key', 'abcd')

    wrapper.findComponent(EncryptOptionsStub).vm.$emit('update:output-mode', 'raw')
    wrapper.findComponent(EncryptOptionsStub).vm.$emit('update:mode', 'CTR')
    wrapper.findComponent(EncryptOptionsStub).vm.$emit('update:key-length', 128)
    wrapper.findComponent(EncryptOptionsStub).vm.$emit('update:output-format', 'hex')

    const advanced = wrapper.findComponent(AdvancedOptionsStub)
    advanced.vm.$emit('update:pbkdf2-iterations', 12345)
    advanced.vm.$emit('update:pbkdf2-hash', 'SHA-512')
    advanced.vm.$emit('update:salt-mode', 'manual')
    advanced.vm.$emit('update:manual-salt', '0f0f')
    advanced.vm.$emit('update:iv-mode', 'manual')
    advanced.vm.$emit('update:manual-iv', '0102')

    await nextTick()

    expect(keyType.value).toBe('raw')
    expect(password.value).toBe('next')
    expect(rawKey.value).toBe('abcd')
    expect(outputMode.value).toBe('raw')
    expect(mode.value).toBe('CTR')
    expect(keyLength.value).toBe(128)
    expect(outputFormat.value).toBe('hex')
    expect(pbkdf2Iterations.value).toBe(12345)
    expect(pbkdf2Hash.value).toBe('SHA-512')
  })

  it('disables encrypt when raw key is missing or invalid', async () => {
    storage.set('tools:aes-encryptor:keyType', ref('raw'))
    storage.set('tools:aes-encryptor:rawKey', ref(''))
    storage.set('tools:aes-encryptor:keyLength', ref(128))

    const wrapper = mountForm()
    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'data')
    await nextTick()

    const button = () => wrapper.find('button.n-button')
    expect(button().attributes('disabled')).toBeDefined()

    aesMocks.isValidHex.mockReturnValue(false)
    const rawKeyRef = storage.get('tools:aes-encryptor:rawKey') as Ref<string>
    rawKeyRef.value = 'zz'
    await nextTick()

    expect(button().attributes('disabled')).toBeDefined()

    aesMocks.isValidHex.mockReturnValue(true)
    rawKeyRef.value = 'aa'
    await nextTick()

    expect(button().attributes('disabled')).toBeDefined()
  })
})
