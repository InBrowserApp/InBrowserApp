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
import Base58Encoder from './Base58Encoder.vue'
import { TextOrFileInput } from '@shared/ui/base'

const mountOptions = {
  global: {
    stubs: {
      CopyToClipboardButton: {
        template: '<button />',
      },
    },
  },
}

describe('Base58Encoder', () => {
  beforeEach(() => {
    localStorage.clear()
    useNullUrl.value = false
  })

  it('encodes text to Base58', async () => {
    const wrapper = mount(Base58Encoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('hello world')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('StV1DL6CwTryKyV')
  })

  it('uses the default download name for text input', () => {
    const wrapper = mount(Base58Encoder, mountOptions)
    const link = wrapper.find('a[download]')

    expect(link.attributes('download')).toBe('encoded.base58.txt')
  })

  it('omits the download href when no object URL is available', () => {
    useNullUrl.value = true
    const wrapper = mount(Base58Encoder, mountOptions)
    const link = wrapper.find('a[download]')

    expect(link.attributes('href')).toBeUndefined()
  })

  it('encodes uploaded files and derives a .b58 name', async () => {
    const wrapper = mount(Base58Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['hello world'], 'sample.txt', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('StV1DL6CwTryKyV')
    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('sample.b58')
  })

  it('shows an error when file reading fails', async () => {
    const wrapper = mount(Base58Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const badFile = {
      name: 'broken.bin',
      arrayBuffer: () => Promise.reject(new Error('fail')),
    }

    await input.vm.$emit('update:value', badFile)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to read file')
  })
  it('ignores stale async results', async () => {
    const wrapper = mount(Base58Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const textareas = wrapper.findAll('textarea')

    let resolveBuffer: ((value: ArrayBuffer) => void) | undefined
    const pending = new Promise<ArrayBuffer>((resolve) => {
      resolveBuffer = resolve
    })

    const slowFile = {
      name: 'slow.txt',
      arrayBuffer: () => pending,
    }

    await input.vm.$emit('update:value', slowFile)
    await textareas[0]?.setValue('hello world')
    await flushPromises()

    resolveBuffer?.(new TextEncoder().encode('ignored').buffer)
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('StV1DL6CwTryKyV')
  })

  it('ignores stale errors from previous uploads', async () => {
    const wrapper = mount(Base58Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const textareas = wrapper.findAll('textarea')

    let rejectBuffer: ((reason?: unknown) => void) | undefined
    const pending = new Promise<ArrayBuffer>((_, reject) => {
      rejectBuffer = reject
    })

    const slowFile = {
      name: 'slow.txt',
      arrayBuffer: () => pending,
    }

    await input.vm.$emit('update:value', slowFile)
    await textareas[0]?.setValue('hello world')
    await flushPromises()

    rejectBuffer?.(new Error('fail'))
    await flushPromises()

    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('uses fallback download names for edge cases', async () => {
    const wrapper = mount(Base58Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const encoder = new TextEncoder()

    const namelessFile = {
      arrayBuffer: () => Promise.resolve(encoder.encode('hello world').buffer),
    }

    await input.vm.$emit('update:value', namelessFile)
    await flushPromises()

    expect(wrapper.find('a[download]').attributes('download')).toBe('file.b58')

    const emptyNameFile = new File(['hello world'], '.b58', { type: 'text/plain' })
    await input.vm.$emit('update:value', emptyNameFile)
    await flushPromises()

    expect(wrapper.find('a[download]').attributes('download')).toBe('file.b58')
  })
})
