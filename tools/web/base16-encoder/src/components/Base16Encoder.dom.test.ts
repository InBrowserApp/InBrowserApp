import { describe, it, expect, beforeEach, vi } from 'vitest'

let mockObjectUrl: string | undefined = 'blob:mock'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      if (source && typeof source === 'object' && 'value' in source) {
        void (source as { value: unknown }).value
      }
      return ref(mockObjectUrl)
    },
  }
})

import { mount, flushPromises } from '@vue/test-utils'
import Base16Encoder from './Base16Encoder.vue'
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

describe('Base16Encoder', () => {
  beforeEach(() => {
    localStorage.clear()
    mockObjectUrl = 'blob:mock'
  })

  it('encodes text to hex', async () => {
    const wrapper = mount(Base16Encoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('foo')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('666F6F')
  })

  it('uses the default download name for text input', () => {
    const wrapper = mount(Base16Encoder, mountOptions)
    const link = wrapper.find('a[download]')

    expect(link.attributes('download')).toBe('encoded.hex.txt')
  })

  it('encodes uploaded files and derives a .hex name', async () => {
    const wrapper = mount(Base16Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['foo'], 'sample.txt', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('666F6F')
    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('sample.hex')
  })

  it('falls back to file.hex when the file name base is empty', async () => {
    const wrapper = mount(Base16Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const hiddenNameFile = new File(['foo'], '.txt', { type: 'text/plain' })

    await input.vm.$emit('update:value', hiddenNameFile)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('file.hex')
  })

  it('falls back to file.hex when the input has no name', async () => {
    const wrapper = mount(Base16Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const namelessFile = {
      arrayBuffer: async () => new TextEncoder().encode('foo').buffer,
    } as File

    await input.vm.$emit('update:value', namelessFile)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('file.hex')
  })

  it('keeps the latest output when previous async reads resolve later', async () => {
    let resolveSlow!: (value: ArrayBuffer) => void
    let rejectSlow!: (reason?: unknown) => void

    const slowFile = {
      name: 'slow.bin',
      arrayBuffer: () =>
        new Promise<ArrayBuffer>((resolve, reject) => {
          resolveSlow = resolve
          rejectSlow = reject
        }),
    } as File

    const wrapper = mount(Base16Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const textareas = wrapper.findAll('textarea')

    await input.vm.$emit('update:value', slowFile)
    await input.vm.$emit('update:value', 'new')
    await flushPromises()

    resolveSlow(new TextEncoder().encode('old').buffer)
    rejectSlow(new Error('stale'))
    await flushPromises()

    expect(textareas[textareas.length - 1]?.element.value).toBe('6E6577')
    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('shows an error when file reading fails', async () => {
    const wrapper = mount(Base16Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const badFile = {
      name: 'broken.bin',
      arrayBuffer: () => Promise.reject(new Error('nope')),
    } as File

    await input.vm.$emit('update:value', badFile)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to read file')
  })

  it('omits download href when object url is unavailable', () => {
    mockObjectUrl = undefined
    const wrapper = mount(Base16Encoder, mountOptions)

    const link = wrapper.find('a[download]')
    expect(link.attributes('href')).toBeUndefined()
  })
})
