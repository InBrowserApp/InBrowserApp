import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NColorPicker, NFormItemGi, NSelect, NSlider, NSwitch } from 'naive-ui'
import BarcodeOptionsAppearance from './BarcodeOptionsAppearance.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    props: {
      label: {
        type: String,
        default: '',
      },
      showFeedback: {
        type: Boolean,
        default: true,
      },
    },
    template: '<div><slot /></div>',
  })

  const NSwitch = defineComponent({
    name: 'NSwitch',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template: '<button />',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  const NSlider = defineComponent({
    name: 'NSlider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 100,
      },
      step: {
        type: Number,
        default: 1,
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  const NColorPicker = defineComponent({
    name: 'NColorPicker',
    props: {
      value: {
        type: String,
        default: '',
      },
      modes: {
        type: Array,
        default: () => [],
      },
      size: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  return {
    NFormItemGi,
    NSwitch,
    NSelect,
    NSlider,
    NColorPicker,
  }
})

describe('BarcodeOptionsAppearance', () => {
  it('renders appearance options and emits updates', async () => {
    const wrapper = mount(BarcodeOptionsAppearance, {
      props: {
        displayValue: true,
        textAlign: 'center',
        textPosition: 'bottom',
        fontSize: 16,
        lineColor: '#111111',
        background: '#ffffff',
      },
    })

    const formItems = wrapper.findAllComponents(NFormItemGi)
    expect(formItems).toHaveLength(6)
    expect(formItems[0]?.props('label')).toBe('display-value')
    expect(formItems[1]?.props('label')).toBe('text-align')

    const toggles = wrapper.findComponent(NSwitch)
    expect(toggles.props('value')).toBe(true)

    const selects = wrapper.findAllComponents(NSelect)
    const alignOptions = selects[0]?.props('options') as Array<{ label: string; value: string }>
    const positionOptions = selects[1]?.props('options') as Array<{ label: string; value: string }>
    expect(alignOptions.map((option) => option.value)).toEqual(['left', 'center', 'right'])
    expect(positionOptions.map((option) => option.value)).toEqual(['top', 'bottom'])

    const slider = wrapper.findComponent(NSlider)
    expect(slider.props('min')).toBe(8)
    expect(slider.props('max')).toBe(48)
    expect(slider.props('step')).toBe(1)

    const colorPickers = wrapper.findAllComponents(NColorPicker)
    expect(colorPickers).toHaveLength(2)
    expect(colorPickers[0]?.props('modes')).toEqual(['hex'])
    expect(colorPickers[0]?.props('size')).toBe('small')

    await toggles.vm.$emit('update:value', false)
    expect(wrapper.emitted('update:display-value')).toEqual([[false]])
  })
})
