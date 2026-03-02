import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItemGi, NInput, NSelect, NSlider } from 'naive-ui'
import BarcodeOptionsBasics from './BarcodeOptionsBasics.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  const NInput = defineComponent({
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
    },
    emits: ['update:value'],
    template: '<input />',
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
  return {
    ...actual,
    NFormItemGi: actual.NFormItemGi,
    NInput,
    NSelect,
    NSlider,
  }
})
describe('BarcodeOptionsBasics', () => {
  it('renders basic options and emits all model updates', async () => {
    const wrapper = mount(BarcodeOptionsBasics, {
      props: {
        text: 'ABC',
        format: 'EAN13',
        width: 2,
        height: 80,
        margin: 5,
      },
    })
    const formItems = wrapper.findAllComponents(NFormItemGi)
    expect(formItems).toHaveLength(5)
    expect(formItems[0]?.props('label')).toBe('Text')
    expect(formItems[1]?.props('label')).toBe('Format')
    const input = wrapper.findComponent(NInput)
    expect(input.props('value')).toBe('ABC')
    expect(input.props('placeholder')).toBe('Type content to encode...')
    const select = wrapper.findComponent(NSelect)
    const options = select.props('options') as Array<{
      label: string
      value: string
    }>
    expect(options.find((option) => option.value === 'CODE128')).toBeTruthy()
    expect(options.find((option) => option.value === 'EAN13')).toBeTruthy()
    const sliders = wrapper.findAllComponents(NSlider)
    expect(sliders).toHaveLength(3)
    expect(sliders[0]?.props('min')).toBe(1)
    expect(sliders[0]?.props('max')).toBe(8)
    expect(sliders[0]?.props('step')).toBe(1)
    expect(sliders[1]?.props('min')).toBe(20)
    expect(sliders[1]?.props('max')).toBe(300)
    expect(sliders[1]?.props('step')).toBe(2)
    expect(sliders[2]?.props('min')).toBe(0)
    expect(sliders[2]?.props('max')).toBe(30)
    expect(sliders[2]?.props('step')).toBe(1)
    const [widthSlider, heightSlider, marginSlider] = sliders
    if (!widthSlider || !heightSlider || !marginSlider) {
      throw new Error('Expected all slider components to be rendered')
    }
    await input.vm.$emit('update:value', 'XYZ')
    await select.vm.$emit('update:value', 'CODE39')
    await widthSlider.vm.$emit('update:value', 4)
    await heightSlider.vm.$emit('update:value', 120)
    await marginSlider.vm.$emit('update:value', 8)
    expect(wrapper.emitted('update:text')).toEqual([['XYZ']])
    expect(wrapper.emitted('update:format')).toEqual([['CODE39']])
    expect(wrapper.emitted('update:width')).toEqual([[4]])
    expect(wrapper.emitted('update:height')).toEqual([[120]])
    expect(wrapper.emitted('update:margin')).toEqual([[8]])
  })
})
