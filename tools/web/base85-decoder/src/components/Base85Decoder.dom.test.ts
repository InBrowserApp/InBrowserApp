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
import Base85Decoder from './Base85Decoder.vue'
import { TextOrFileInput } from '@shared/ui/base'

const ASCII85_HELLO_WORLD = 'BOu!rD]j7BEbo7'
const Z85_HELLO_WORLD = 'nm=QNz=Z<$y?aXj'

const mountOptions = {
  global: {
    stubs: {
      CopyToClipboardButton: {
        template: '<button />',
      },
    },
  },
}

describe('Base85Decoder', () => {
  beforeEach(() => {
    localStorage.clear()
    useNullUrl.value = false
  })

  it('keeps output empty when stored text is empty', async () => {
    localStorage.setItem('tools:base85-decoder:text', '')
    const wrapper = mount(Base85Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await flushPromises()

    expect(textareas[1]?.element.value).toBe('')
  })

  it('decodes ASCII85 text', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue(ASCII85_HELLO_WORLD)
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('hello world')
  })

  it('decodes Base85 text using the selected alphabet', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const select = wrapper.findComponent(NSelect)
    const textareas = wrapper.findAll('textarea')

    await select.vm.$emit('update:value', 'z85')
    await textareas[0]?.setValue(Z85_HELLO_WORLD)
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('HelloWorld!!')
  })

  it('shows an error for invalid ASCII85 text', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('invalid')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid Base85 text')
  })

  it('shows an error for invalid Z85 length', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const select = wrapper.findComponent(NSelect)
    const textareas = wrapper.findAll('textarea')

    await select.vm.$emit('update:value', 'z85')
    await textareas[0]?.setValue('abcd')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid Base85 text')
  })

  it('omits the download href when no object URL is available', () => {
    useNullUrl.value = true
    const wrapper = mount(Base85Decoder, mountOptions)
    const link = wrapper.find('a[download]')

    expect(link.attributes('href')).toBeUndefined()
  })

  it('decodes Base85 from uploaded files and derives a .bin name', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File([ASCII85_HELLO_WORLD], 'payload.a85', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('hello world')
    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('payload.bin')
  })

  it('shows an error when file reading fails', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
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
    const wrapper = mount(Base85Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('   ')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('')
  })

  it('ignores stale async results', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const textareas = wrapper.findAll('textarea')

    let resolveText: ((value: string) => void) | undefined
    const pending = new Promise<string>((resolve) => {
      resolveText = resolve
    })

    const slowFile = {
      name: 'slow.a85',
      text: () => pending,
    }

    await input.vm.$emit('update:value', slowFile)
    await textareas[0]?.setValue(ASCII85_HELLO_WORLD)
    await flushPromises()

    resolveText?.('87cURD]i,"Ebo7')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('hello world')
  })

  it('ignores stale errors from previous uploads', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const textareas = wrapper.findAll('textarea')

    let rejectText: ((reason?: unknown) => void) | undefined
    const pending = new Promise<string>((_, reject) => {
      rejectText = reject
    })

    const slowFile = {
      name: 'slow.a85',
      text: () => pending,
    }

    await input.vm.$emit('update:value', slowFile)
    await textareas[0]?.setValue(ASCII85_HELLO_WORLD)
    await flushPromises()

    rejectText?.(new Error('fail'))
    await flushPromises()

    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('uses fallback download names for edge cases', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)

    const namelessFile = {
      text: () => Promise.resolve(ASCII85_HELLO_WORLD),
    }

    await input.vm.$emit('update:value', namelessFile)
    await flushPromises()

    expect(wrapper.find('a[download]').attributes('download')).toBe('decoded.bin')

    const emptyNameFile = new File([ASCII85_HELLO_WORLD], '.a85', { type: 'text/plain' })
    await input.vm.$emit('update:value', emptyNameFile)
    await flushPromises()

    expect(wrapper.find('a[download]').attributes('download')).toBe('decoded.bin')
  })

  it('keeps file input when stored text updates', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File([ASCII85_HELLO_WORLD], 'payload.a85', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const state = (
      wrapper.vm.$ as unknown as { setupState: { storedText: string; textOrFile: unknown } }
    ).setupState
    state.storedText = '87cURD]i,"Ebo7'
    await flushPromises()

    expect(state.textOrFile instanceof File).toBe(true)
  })

  it('truncates long previews and shows the hint', async () => {
    const wrapper = mount(Base85Decoder, mountOptions)
    const textareas = wrapper.findAll('textarea')
    const longText = 'a'.repeat(2105)
    const { encodeBase85 } = await import('@utils/base85')
    const encoded = encodeBase85(new TextEncoder().encode(longText))

    await textareas[0]?.setValue(encoded)
    await flushPromises()

    expect(textareas[1]?.element.value.endsWith('...')).toBe(true)
    expect(wrapper.text()).toContain('Preview truncated')
  })
})
