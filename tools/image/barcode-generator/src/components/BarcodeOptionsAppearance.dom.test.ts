import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NColorPicker, NFormItemGi, NSelect, NSlider, NSwitch } from 'naive-ui'
import BarcodeOptionsAppearance from './BarcodeOptionsAppearance.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')

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
    NGrid: actual.NGrid,
    NFormItemGi: actual.NFormItemGi,
    NSwitch,
    NSelect,
    NSlider,
    NColorPicker,
  }
})

describe('BarcodeOptionsAppearance', () => {
  it('renders appearance options and emits every model update', async () => {
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
    expect(formItems[0]?.props('label')).toBe('Display value')
    expect(formItems[1]?.props('label')).toBe('Text align')

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

    const [textAlignSelect, textPositionSelect] = selects
    const [lineColorPicker, backgroundPicker] = colorPickers

    if (!textAlignSelect || !textPositionSelect || !lineColorPicker || !backgroundPicker) {
      throw new Error('Expected all appearance controls to be rendered')
    }

    await toggles.vm.$emit('update:value', false)
    await textAlignSelect.vm.$emit('update:value', 'right')
    await textPositionSelect.vm.$emit('update:value', 'top')
    await slider.vm.$emit('update:value', 24)
    await lineColorPicker.vm.$emit('update:value', '#123456')
    await backgroundPicker.vm.$emit('update:value', '#abcdef')

    expect(wrapper.emitted('update:display-value')).toEqual([[false]])
    expect(wrapper.emitted('update:text-align')).toEqual([['right']])
    expect(wrapper.emitted('update:text-position')).toEqual([['top']])
    expect(wrapper.emitted('update:font-size')).toEqual([[24]])
    expect(wrapper.emitted('update:line-color')).toEqual([['#123456']])
    expect(wrapper.emitted('update:background')).toEqual([['#abcdef']])
  })
})
