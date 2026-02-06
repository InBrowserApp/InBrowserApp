import { describe, it, expect, beforeEach, vi } from 'vitest'

let objectUrlMissing = false

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: { value: Blob | null }) =>
      computed(() => {
        if (objectUrlMissing) return undefined
        return source.value ? 'blob:mock' : undefined
      }),
  }
})

import { mount, flushPromises } from '@vue/test-utils'
import Base16Decoder from './Base16Decoder.vue'
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

describe('Base16Decoder', () => {
  beforeEach(() => {
    localStorage.clear()
    objectUrlMissing = false
  })

  it('decodes hex to text', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('666F6F')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('foo')
  })

  it('derives a .bin name for uploaded files', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['666F6F'], 'sample.hex', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('foo')

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('sample.bin')
  })

  it('uses a decoded fallback name when the uploaded file has no name', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const namelessFile = {
      text: () => Promise.resolve('666F6F'),
    } as File

    await input.vm.$emit('update:value', namelessFile)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('decoded.bin')
  })

  it('falls back to decoded.bin for empty basenames', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const hiddenNameFile = {
      name: '.hex',
      text: () => Promise.resolve('666F6F'),
    } as File

    await input.vm.$emit('update:value', hiddenNameFile)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('decoded.bin')
  })

  it('shows an error for invalid hex', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('F')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid Hex text')
  })

  it('truncates long previews', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')
    const longHex = '61'.repeat(2001)

    await textareas[0]?.setValue(longHex)
    await flushPromises()

    expect(textareas[1]?.element.value.endsWith('...')).toBe(true)
    expect(wrapper.text()).toContain('Preview truncated')
  })

  it('omits the download href when object URL generation is unavailable', async () => {
    objectUrlMissing = true
    const wrapper = mount(Base16Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('666F6F')
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('href')).toBeUndefined()
  })

  it('ignores stale file read failures after a newer update', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)

    let rejectFileRead: ((reason?: unknown) => void) | null = null
    const staleFile = {
      name: 'stale.hex',
      text: () =>
        new Promise<string>((_resolve, reject) => {
          rejectFileRead = reject
        }),
    } as File

    await input.vm.$emit('update:value', staleFile)
    await input.vm.$emit('update:value', '626172')
    if (!rejectFileRead) throw new Error('Expected stale read reject callback')
    const rejectStaleRead = rejectFileRead as (reason?: unknown) => void
    rejectStaleRead(new Error('late failure'))
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    expect(textareas[1]?.element.value).toBe('bar')
    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('ignores stale successful file reads after a newer update', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)

    let resolveFileRead: ((value: string) => void) | null = null
    const slowFile = {
      name: 'slow.hex',
      text: () =>
        new Promise<string>((resolve) => {
          resolveFileRead = resolve
        }),
    } as File

    await input.vm.$emit('update:value', slowFile)
    await input.vm.$emit('update:value', '626172')
    if (!resolveFileRead) throw new Error('Expected stale read resolve callback')
    const resolveStaleRead = resolveFileRead as (value: string) => void
    resolveStaleRead('666F6F')
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    expect(textareas[1]?.element.value).toBe('bar')
  })

  it('shows an error when file reading fails', async () => {
    const wrapper = mount(Base16Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const badFile = {
      name: 'broken.hex',
      text: () => Promise.reject(new Error('nope')),
    } as File

    await input.vm.$emit('update:value', badFile)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to read file')
  })
})
