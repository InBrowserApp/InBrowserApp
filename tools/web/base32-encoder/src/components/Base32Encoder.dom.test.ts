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
import Base32Encoder from './Base32Encoder.vue'
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

describe('Base32Encoder', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('encodes text to Base32', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('foo')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('MZXW6===')
  })

  it('uses the default download name for text input', () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const link = wrapper.find('a[download]')

    expect(link.attributes('download')).toBe('encoded.base32.txt')
  })

  it('encodes uploaded files and derives a .b32 name', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['foo'], 'sample.txt', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('MZXW6===')
    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('sample.b32')
  })

  it('clears output when input is blank', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('')
    await flushPromises()

    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('')
    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('shows an error when reading a file fails', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['foo'], 'bad.txt', { type: 'text/plain' })
    vi.spyOn(file, 'arrayBuffer').mockRejectedValueOnce(new Error('read failed'))

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('')
    expect(wrapper.text()).toContain('Failed to read file')
  })

  it('falls back to file.b32 when file name is only an extension', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['foo'], '.txt', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('file.b32')
  })
})
