import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import PaletteControls from './PaletteControls.vue'

const ToolSectionStub = {
  template: '<div><slot /></div>',
}

const ToolSectionHeaderStub = {
  template: '<div><slot /></div>',
}

const SelectStub = defineComponent({
  name: 'NSelect',
  props: ['options', 'value'],
  template: '<select data-test="sort" />',
})

const FormStub = defineComponent({
  name: 'NForm',
  template: '<form><slot /></form>',
})

const FormItemStub = defineComponent({
  name: 'NFormItem',
  props: ['label'],
  template: '<div><slot /></div>',
})

const SliderStub = defineComponent({
  name: 'NSlider',
  props: ['value'],
  template: '<select data-test="sort" />',
})

const InputNumberStub = defineComponent({
  name: 'NInputNumber',
  props: ['value'],
  template: '<select data-test="sort" />',
})

const RadioGroupStub = defineComponent({
  name: 'NRadioGroup',
  props: ['value'],
  template: '<div><slot /></div>',
})

const RadioButtonStub = defineComponent({
  name: 'NRadioButton',
  template: '<div><slot /></div>',
})

const SwitchStub = defineComponent({
  name: 'NSwitch',
  props: ['value'],
  template: '<select data-test="sort" />',
})

const FlexStub = defineComponent({
  name: 'NFlex',
  template: '<div><slot /></div>',
})

describe('PaletteControls', () => {
  it('renders palette settings and sort options', () => {
    const wrapper = mount(PaletteControls, {
      props: {
        options: {
          colorCount: 8,
          quality: 'balanced',
          sortBy: 'dominance',
          ignoreTransparent: true,
        },
        isLoading: false,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NSelect: SelectStub,
          'n-select': SelectStub,
          NForm: FormStub,
          NFormItem: FormItemStub,
          NSlider: SliderStub,
          NInputNumber: InputNumberStub,
          NRadioGroup: RadioGroupStub,
          NRadioButton: RadioButtonStub,
          NSwitch: SwitchStub,
          NFlex: FlexStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Palette Settings')
    expect(wrapper.text()).toContain('Colors')
  })
})
