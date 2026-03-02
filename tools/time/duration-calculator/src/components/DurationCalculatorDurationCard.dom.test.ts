import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { DurationParts } from '../utils/duration'
import DurationCalculatorDurationCard from './DurationCalculatorDurationCard.vue'

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: defineComponent({
    name: 'CopyToClipboardButton',
    template: '<button data-testid="copy-button" />',
  }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template:
      '<input type="number" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    template: '<div><slot /><slot name="feedback" /></div>',
  })

  return {
    NInput,
    NInputNumber,
    NText: makeStub('NText'),
    NFlex: makeStub('NFlex'),
    NGrid: makeStub('NGrid'),
    NFormItemGi,
  }
})

describe('DurationCalculatorDurationCard', () => {
  const baseParts: DurationParts = {
    days: 0,
    hours: 1,
    minutes: 2,
    seconds: 3,
    milliseconds: 4,
  }

  it('updates ISO input and duration part models', () => {
    const wrapper = mount(DurationCalculatorDurationCard, {
      props: {
        durationIsoInput: 'PT1H2M3.004S',
        durationParts: baseParts,
        durationIsoStatus: 'success',
        durationIsoInvalid: true,
        normalizedDurationIso: 'PT1H2M3.004S',
      },
    })

    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'P1DT2H')

    const numberInputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    numberInputs[0]?.vm.$emit('update:value', 5)
    numberInputs[1]?.vm.$emit('update:value', 6)
    numberInputs[2]?.vm.$emit('update:value', 7)
    numberInputs[3]?.vm.$emit('update:value', 8)
    numberInputs[4]?.vm.$emit('update:value', 9)

    expect(wrapper.emitted('update:durationIsoInput')?.[0]).toEqual(['P1DT2H'])

    const durationUpdates = wrapper.emitted('update:durationParts')
    const lastDurationUpdate = durationUpdates?.[durationUpdates.length - 1]
    expect(lastDurationUpdate).toEqual([
      {
        days: 5,
        hours: 6,
        minutes: 7,
        seconds: 8,
        milliseconds: 9,
      },
    ])

    expect(wrapper.find('[data-testid="copy-button"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Invalid duration')
  })

  it('hides copy action when normalized ISO output is empty', () => {
    const wrapper = mount(DurationCalculatorDurationCard, {
      props: {
        durationIsoInput: 'PT0S',
        durationParts: baseParts,
        durationIsoStatus: undefined,
        durationIsoInvalid: false,
        normalizedDurationIso: '',
      },
    })

    expect(wrapper.find('[data-testid="copy-button"]').exists()).toBe(false)
  })
})
