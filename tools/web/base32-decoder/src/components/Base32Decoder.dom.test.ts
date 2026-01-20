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
import Base32Decoder from './Base32Decoder.vue'
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
})
