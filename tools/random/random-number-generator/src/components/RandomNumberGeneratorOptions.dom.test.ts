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
  })

  it('emits apply-preset from presets', async () => {
    const wrapper = mount(RandomNumberGeneratorOptions, {
      props: baseProps,
    })

    await wrapper.get('[data-testid="preset-dice"]').trigger('click')

    expect(wrapper.emitted('apply-preset')).toEqual([['dice']])
  })
})
