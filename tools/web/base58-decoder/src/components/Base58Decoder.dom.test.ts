import { describe, it, expect, beforeEach, vi } from 'vitest'

const { useNullUrl } = vi.hoisted(() => ({ useNullUrl: { value: false } }))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: { value?: unknown } | null | undefined) => {
      if (source && typeof source === 'object' && 'value' in source) {
        void source.value
      }
      return ref(useNullUrl.value ? null : 'blob:mock')
    },
  }
})

import { mount, flushPromises } from '@vue/test-utils'
import { NSelect } from 'naive-ui'
import Base58Decoder from './Base58Decoder.vue'
import { TextOrFileInput } from '@shared/ui/base'
import { BASE58_ALPHABETS } from '@utils/base58'

const BITCOIN_ALPHABET = BASE58_ALPHABETS.bitcoin
const FLICKR_ALPHABET = BASE58_ALPHABETS.flickr
const HELLO_WORLD_BITCOIN = 'StV1DL6CwTryKyV'
const HELLO_WORLD_FLICKR = [...HELLO_WORLD_BITCOIN]
  .map((char) => FLICKR_ALPHABET.charAt(BITCOIN_ALPHABET.indexOf(char)))
  .join('')

const mountOptions = {
  global: {
    stubs: {
      CopyToClipboardButton: {
        template: '<button />',
      },
    },
  },
}

describe('Base58Decoder', () => {
  beforeEach(() => {
    localStorage.clear()
    useNullUrl.value = false
  })

  it('keeps output empty when stored text is empty', async () => {
    localStorage.setItem('tools:base58-decoder:text', '')
    const wrapper = mount(Base58Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await flushPromises()

    expect(textareas[1]?.element.value).toBe('')
  })

  it('decodes Base58 text using the selected alphabet', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const select = wrapper.findComponent(NSelect)
    const textareas = wrapper.findAll('textarea')

    await select.vm.$emit('update:value', 'flickr')
    await textareas[0]?.setValue(HELLO_WORLD_FLICKR)
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('hello world')
  })

  it('decodes Base58 text', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('StV1DL6CwTryKyV')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('hello world')
  })

  it('omits the download href when no object URL is available', () => {
    useNullUrl.value = true
    const wrapper = mount(Base58Decoder, mountOptions)
    const link = wrapper.find('a[download]')

    expect(link.attributes('href')).toBeUndefined()
  })

  it('shows an error for invalid Base58 text', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('invalid')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid Base58 text')
  })

  it('decodes Base58 from uploaded files and derives a .bin name', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['StV1DL6CwTryKyV'], 'payload.b58', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('hello world')
    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('payload.bin')
  })

  it('shows an error when file reading fails', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const badFile = {
      name: 'broken.bin',
      text: () => Promise.reject(new Error('fail')),
    }

    await input.vm.$emit('update:value', badFile)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to read file')
  })
  it('skips empty input', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('   ')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('')
  })

  it('ignores stale async results', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const textareas = wrapper.findAll('textarea')

    let resolveText: ((value: string) => void) | undefined
    const pending = new Promise<string>((resolve) => {
      resolveText = resolve
    })

    const slowFile = {
      name: 'slow.b58',
      text: () => pending,
    }

    await input.vm.$emit('update:value', slowFile)
    await textareas[0]?.setValue('StV1DL6CwTryKyV')
    await flushPromises()

    resolveText?.('JxF12TrwUP45BMd')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('hello world')
  })

  it('ignores stale errors from previous uploads', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const textareas = wrapper.findAll('textarea')

    let rejectText: ((reason?: unknown) => void) | undefined
    const pending = new Promise<string>((_, reject) => {
      rejectText = reject
    })

    const slowFile = {
      name: 'slow.b58',
      text: () => pending,
    }

    await input.vm.$emit('update:value', slowFile)
    await textareas[0]?.setValue('StV1DL6CwTryKyV')
    await flushPromises()

    rejectText?.(new Error('fail'))
    await flushPromises()

    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('uses fallback download names for edge cases', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)

    const namelessFile = {
      text: () => Promise.resolve('StV1DL6CwTryKyV'),
    }

    await input.vm.$emit('update:value', namelessFile)
    await flushPromises()

    expect(wrapper.find('a[download]').attributes('download')).toBe('decoded.bin')

    const emptyNameFile = new File(['StV1DL6CwTryKyV'], '.b58', { type: 'text/plain' })
    await input.vm.$emit('update:value', emptyNameFile)
    await flushPromises()

    expect(wrapper.find('a[download]').attributes('download')).toBe('decoded.bin')
  })

  it('keeps file input when stored text updates', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['StV1DL6CwTryKyV'], 'payload.b58', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const state = (
      wrapper.vm.$ as unknown as { setupState: { storedText: string; textOrFile: unknown } }
    ).setupState
    state.storedText = 'JxF12TrwUP45BMd'
    await flushPromises()

    expect(state.textOrFile instanceof File).toBe(true)
  })

  it('truncates long previews and shows the hint', async () => {
    const wrapper = mount(Base58Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')
    const longText = 'a'.repeat(2105)
    const { encodeBase58 } = await import('@utils/base58')
    const encoded = encodeBase58(new TextEncoder().encode(longText))

    await textareas[0]?.setValue(encoded)
    await flushPromises()

    expect(textareas[1]?.element.value.endsWith('...')).toBe(true)
    expect(wrapper.text()).toContain('Preview truncated')
  })
})
