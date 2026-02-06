import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RandomNumberGeneratorOptions from './RandomNumberGeneratorOptions.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  },
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: "<button type='button' @click=\"$emit('click')\"><slot /></button>",
    }),
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div class="n-alert"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      template: '<label><slot /></label>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: {
        value: {
          type: Number,
          default: 0,
        },
      },
      emits: ['update:value'],
      template:
        '<input :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
    }),
    NRadioButton: defineComponent({
      name: 'NRadioButton',
      template: '<button type="button"><slot /></button>',
    }),
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      emits: ['update:value'],
      template: '<div><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: {
        value: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:value'],
      template: '<button type="button" @click="$emit(\'update:value\', !value)" />',
    }),
  }
})

const baseProps = {
  inputStep: 1,
  inputPrecision: 0,
  maxCount: 100,
  maxDecimalPlaces: 6,
  rangeError: '',
  countError: '',
  minValue: 1,
  maxValue: 10,
  count: 1,
  allowRepeat: true,
  numberType: 'integer' as const,
  decimalPlaces: 2,
}

describe('RandomNumberGeneratorOptions', () => {
  it('toggles decimal places input based on number type', () => {
    const decimalWrapper = mount(RandomNumberGeneratorOptions, {
      props: {
        ...baseProps,
        numberType: 'decimal',
      },
    })

    expect(decimalWrapper.find('[data-testid="decimal-places"]').exists()).toBe(true)

    const integerWrapper = mount(RandomNumberGeneratorOptions, {
      props: baseProps,
    })

    expect(integerWrapper.find('[data-testid="decimal-places"]').exists()).toBe(false)
  })

  it('renders range and count errors', () => {
    const rangeWrapper = mount(RandomNumberGeneratorOptions, {
      props: {
        ...baseProps,
        rangeError: 'Range error',
      },
    })

    expect(rangeWrapper.text()).toContain('Range error')

    const countWrapper = mount(RandomNumberGeneratorOptions, {
      props: {
        ...baseProps,
        countError: 'Count error',
      },
    })

    expect(countWrapper.text()).toContain('Count error')

    const bothWrapper = mount(RandomNumberGeneratorOptions, {
      props: {
        ...baseProps,
        rangeError: 'Range error',
        countError: 'Count error',
      },
    })
    expect(bothWrapper.text()).toContain('Range error')
    expect(bothWrapper.text()).not.toContain('Count error')
  })

  it('emits apply-preset from presets', async () => {
    const wrapper = mount(RandomNumberGeneratorOptions, {
      props: baseProps,
    })

    await wrapper.get('[data-testid="preset-dice"]').trigger('click')

    expect(wrapper.emitted('apply-preset')).toEqual([['dice']])
  })

  it('emits updates for all option controls', async () => {
    const wrapper = mount(RandomNumberGeneratorOptions, {
      props: {
        ...baseProps,
        numberType: 'decimal',
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0]?.setValue('2')
    await inputs[1]?.setValue('20')
    await inputs[2]?.setValue('3')
    await inputs[3]?.setValue('4')

    await wrapper.findComponent({ name: 'NSwitch' }).trigger('click')
    wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'integer')

    expect(wrapper.emitted('update:minValue')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:maxValue')?.[0]).toEqual([20])
    expect(wrapper.emitted('update:count')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:decimalPlaces')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:allowRepeat')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:numberType')?.[0]).toEqual(['integer'])
  })
})
