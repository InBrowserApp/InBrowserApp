import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import URLComponentConverter from './URLComponentConverter.vue'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

const NInputStub = defineComponent({
  name: 'NInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  template:
    '<textarea class="n-input" :data-status="status" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
})

const stubs = {
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  NInput: NInputStub,
  NFlex: {
    template: '<div class="flex"><slot /></div>',
  },
  NText: {
    template: '<span class="text"><slot /></span>',
  },
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button class="copy" />',
  },
}

describe('URLComponentConverter', () => {
  it('initializes inputs and encodes plain text', async () => {
    const wrapper = mount(URLComponentConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea')
    expect(inputs).toHaveLength(2)
    expect(inputs[0]!.element.value).toBe('Hello World!')
    expect(inputs[1]!.element.value).toBe('Hello%20World!')

    await inputs[0]!.setValue('Hello Test')
    await nextTick()

    expect(inputs[1]!.element.value).toBe('Hello%20Test')
    expect(wrapper.text()).not.toContain('Invalid URL encoded text')
  })

  it('decodes encoded text into plain text', async () => {
    const wrapper = mount(URLComponentConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea')
    await inputs[1]!.setValue('hi%20there')
    await nextTick()

    expect(inputs[0]!.element.value).toBe('hi there')
  })

  it('flags invalid encoded text and logs an error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount(URLComponentConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea')
    await inputs[1]!.setValue('%E0%A4%A')
    await nextTick()

    expect(wrapper.text()).toContain('Invalid URL encoded text')
    expect(errorSpy).toHaveBeenCalledWith('Invalid URL encoded text')

    errorSpy.mockRestore()
  })
})
