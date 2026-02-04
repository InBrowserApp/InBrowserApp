import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ConversionOptionsActions from './ConversionOptionsActions.vue'

const ButtonStub = defineComponent({
  name: 'NButton',
  props: {
    disabled: Boolean,
    loading: Boolean,
  },
  emits: ['click'],
  template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
})

const FlexStub = defineComponent({
  name: 'NFlex',
  template: '<div><slot /></div>',
})

const IconStub = defineComponent({
  name: 'NIcon',
  template: '<span><slot /></span>',
})

describe('ConversionOptionsActions', () => {
  it('renders the idle label and emits convert', async () => {
    const wrapper = mount(ConversionOptionsActions, {
      props: {
        convertLabel: 'Convert',
        convertingLabel: 'Converting',
        isConverting: false,
        canConvert: true,
      },
      global: {
        stubs: {
          NButton: ButtonStub,
          NFlex: FlexStub,
          NIcon: IconStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Convert')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('convert')).toHaveLength(1)
  })

  it('renders the converting label and disables the button', () => {
    const wrapper = mount(ConversionOptionsActions, {
      props: {
        convertLabel: 'Convert',
        convertingLabel: 'Converting',
        isConverting: true,
        canConvert: false,
      },
      global: {
        stubs: {
          NButton: ButtonStub,
          NFlex: FlexStub,
          NIcon: IconStub,
        },
      },
    })

    const button = wrapper.find('button')
    expect(wrapper.text()).toContain('Converting')
    expect(button.attributes('disabled')).toBeDefined()
  })
})
