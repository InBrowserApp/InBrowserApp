import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItemGi, NInput, NSelect, NSlider } from 'naive-ui'
import BarcodeOptionsBasics from './BarcodeOptionsBasics.vue'

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
    NFormItemGi,
    NInput,
    NSelect,
    NSlider,
  }
})

describe('BarcodeOptionsBasics', () => {
  it('renders basic options and format list', async () => {
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
    expect(formItems[0]?.props('label')).toBe('text')
    expect(formItems[1]?.props('label')).toBe('format')

    const input = wrapper.findComponent(NInput)
    expect(input.props('value')).toBe('ABC')
    expect(input.props('placeholder')).toBe('text-ph')

    const select = wrapper.findComponent(NSelect)
    const options = select.props('options') as Array<{ label: string; value: string }>
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

    await input.vm.$emit('update:value', 'XYZ')
    expect(wrapper.emitted('update:text')).toEqual([['XYZ']])
  })
})
