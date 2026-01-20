import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref('blob:mock'),
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
