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
})
