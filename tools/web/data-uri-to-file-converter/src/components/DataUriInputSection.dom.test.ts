import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DataUriInputSection from './DataUriInputSection.vue'

const NInputStub = defineComponent({
  props: {
    value: String,
    placeholder: String,
  },
  emits: ['update:value'],
  template:
    '<textarea :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
})

const ToolSectionStub = defineComponent({
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  template: '<h2><slot /></h2>',
})

const NTextStub = defineComponent({
  template: '<span><slot /></span>',
})

describe('DataUriInputSection', () => {
  it('emits updates and renders the placeholder', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(DataUriInputSection, {
      props: {
        dataUri: '',
        showError: false,
        'onUpdate:dataUri': onUpdate,
      },
      global: {
        stubs: {
          NInput: NInputStub,
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NText: NTextStub,
        },
      },
    })

    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('placeholder')).toBe('Paste Data URI here...')

    await textarea.setValue('data:text/plain;base64,SGVsbG8=')
    expect(onUpdate).toHaveBeenCalledWith('data:text/plain;base64,SGVsbG8=')
    expect(wrapper.text()).toContain('Data URI Input')
  })

  it('shows the error message when the input is invalid', () => {
    const wrapper = mount(DataUriInputSection, {
      props: {
        dataUri: 'oops',
        showError: true,
      },
      global: {
        stubs: {
          NInput: NInputStub,
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NText: NTextStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Invalid Data URI')
  })
})
