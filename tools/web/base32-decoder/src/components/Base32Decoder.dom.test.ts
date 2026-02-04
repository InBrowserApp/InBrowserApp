import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        const value = isRef(source) ? source.value : source
        return value ? 'blob:mock' : null
      }),
  }
})

import { mount, flushPromises } from '@vue/test-utils'
import Base32Decoder from './Base32Decoder.vue'
import { TextOrFileInput } from '@shared/ui/base'
import { encodeBase32 } from '@utils/base32'

const mountOptions = {
  global: {
    stubs: {
      CopyToClipboardButton: {
        template: '<button />',
      },
    },
  },
}

describe('Base32Decoder', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('decodes Base32 text', async () => {
    const wrapper = mount(Base32Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('MZXW6===')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('foo')
  })

  it('shows an error for invalid Base32 text', async () => {
    const wrapper = mount(Base32Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('invalid')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid Base32 text')
  })

  it('decodes Base32 from uploaded files and derives a .bin name', async () => {
    const wrapper = mount(Base32Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['MZXW6==='], 'payload.b32', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('foo')
    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('payload.bin')
  })

  it('clears output and uses a default name for string inputs', async () => {
    const wrapper = mount(Base32Decoder, mountOptions)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('decoded.bin')

    const textareas = wrapper.findAll('textarea')
    await textareas[0]?.setValue('   ')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('')
    expect(link.attributes('href')).toBeUndefined()
    expect(wrapper.text()).not.toContain('Invalid Base32 text')
  })

  it('shows an error when reading a file fails', async () => {
    const wrapper = mount(Base32Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['MZXW6==='], 'bad.b32', { type: 'text/plain' })
    vi.spyOn(file, 'text').mockRejectedValueOnce(new Error('read failed'))

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('')
    expect(wrapper.text()).toContain('Failed to read file')
  })

  it('truncates long previews and shows the hint', async () => {
    const wrapper = mount(Base32Decoder, mountOptions)
    const longText = 'a'.repeat(2105)
    const encoded = encodeBase32(new TextEncoder().encode(longText))

    const textareas = wrapper.findAll('textarea')
    await textareas[0]?.setValue(encoded)
    await flushPromises()

    expect(textareas[1]?.element.value).toBe(`${longText.slice(0, 2000)}...`)
    expect(wrapper.text()).toContain('Preview truncated')
  })

  it('falls back to decoded.bin when file name is only an extension', async () => {
    const wrapper = mount(Base32Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['MZXW6==='], '.b32', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('decoded.bin')
  })
})
