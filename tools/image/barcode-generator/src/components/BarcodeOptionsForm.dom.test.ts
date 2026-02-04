import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BarcodeOptionsForm from './BarcodeOptionsForm.vue'
import BarcodeOptionsBasics from './BarcodeOptionsBasics.vue'
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

  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    props: {
      label: {
        type: String,
        default: '',
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
    NGrid: makeStub('NGrid'),
    NFormItemGi,
    NInput,
    NSelect,
    NSlider,
    NSwitch,
    NColorPicker,
  }
})

describe('BarcodeOptionsForm', () => {
  it('passes props and emits updates from child sections', async () => {
    const wrapper = mount(BarcodeOptionsForm, {
      props: {
        text: 'ABC',
        format: 'CODE128',
        width: 2,
        height: 80,
        margin: 5,
        displayValue: true,
        textAlign: 'center',
        textPosition: 'bottom',
        fontSize: 18,
        lineColor: '#111111',
        background: '#ffffff',
      },
    })

    const basics = wrapper.findComponent(BarcodeOptionsBasics)
    const appearance = wrapper.findComponent(BarcodeOptionsAppearance)

    expect(basics.props('text')).toBe('ABC')
    expect(basics.props('width')).toBe(2)
    expect(appearance.props('displayValue')).toBe(true)
    expect(appearance.props('textAlign')).toBe('center')

    await basics.vm.$emit('update:text', 'XYZ')
    await basics.vm.$emit('update:format', 'EAN8')
    await basics.vm.$emit('update:width', 4)
    await basics.vm.$emit('update:height', 120)
    await basics.vm.$emit('update:margin', 2)
    await appearance.vm.$emit('update:display-value', false)
    await appearance.vm.$emit('update:text-align', 'right')
    await appearance.vm.$emit('update:text-position', 'top')
    await appearance.vm.$emit('update:font-size', 16)
    await appearance.vm.$emit('update:line-color', '#222222')
    await appearance.vm.$emit('update:background', '#eeeeee')

    expect(wrapper.emitted('update:text')).toEqual([['XYZ']])
    expect(wrapper.emitted('update:format')).toEqual([['EAN8']])
    expect(wrapper.emitted('update:width')).toEqual([[4]])
    expect(wrapper.emitted('update:height')).toEqual([[120]])
    expect(wrapper.emitted('update:margin')).toEqual([[2]])
    expect(wrapper.emitted('update:display-value')).toEqual([[false]])
    expect(wrapper.emitted('update:text-align')).toEqual([['right']])
    expect(wrapper.emitted('update:text-position')).toEqual([['top']])
    expect(wrapper.emitted('update:font-size')).toEqual([[16]])
    expect(wrapper.emitted('update:line-color')).toEqual([['#222222']])
    expect(wrapper.emitted('update:background')).toEqual([['#eeeeee']])
  })
})
