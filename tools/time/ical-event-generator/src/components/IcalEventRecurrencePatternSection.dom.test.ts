import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IcalEventRecurrencePatternSection from './IcalEventRecurrencePatternSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const StubBase = defineComponent({
    name: 'StubBase',
    template: '<div><slot /></div>',
  })

  const NCheckboxGroup = defineComponent({
    name: 'NCheckboxGroup',
    emits: ['update:value'],
    template: '<div class="checkbox-group"><slot /></div>',
  })

  const NCheckbox = defineComponent({
    name: 'NCheckbox',
    template: '<label><slot /></label>',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: 1,
      },
    },
    emits: ['update:value'],
    template: '<input class="n-input-number" @input="$emit(\'update:value\', undefined)" />',
  })

  return {
    NCheckbox,
    NCheckboxGroup,
    NFlex: StubBase,
    NFormItemGi: StubBase,
    NGrid: StubBase,
    NInputNumber,
  }
})

describe('IcalEventRecurrencePatternSection', () => {
  it('emits weekday selections for weekly recurrence', () => {
    const wrapper = mount(IcalEventRecurrencePatternSection, {
      props: {
        recurrenceFrequency: 'weekly',
        recurrenceWeekdays: ['MO'],
        recurrenceMonthDay: 1,
        recurrenceMonth: 1,
      },
    })

    const group = wrapper.findComponent({ name: 'NCheckboxGroup' })
    group.vm.$emit('update:value', ['MO', 'WE'])

    expect(wrapper.emitted('update:recurrenceWeekdays')?.[0]).toEqual([['MO', 'WE']])
  })

  it('emits month day updates for monthly recurrence', () => {
    const wrapper = mount(IcalEventRecurrencePatternSection, {
      props: {
        recurrenceFrequency: 'monthly',
        recurrenceWeekdays: ['MO'],
        recurrenceMonthDay: 5,
        recurrenceMonth: 1,
      },
    })

    const input = wrapper.findComponent({ name: 'NInputNumber' })
    input.vm.$emit('update:value', undefined)

    expect(wrapper.emitted('update:recurrenceMonthDay')?.[0]).toEqual([1])
  })

  it('emits month and day updates for yearly recurrence', () => {
    const wrapper = mount(IcalEventRecurrencePatternSection, {
      props: {
        recurrenceFrequency: 'yearly',
        recurrenceWeekdays: ['MO'],
        recurrenceMonthDay: 10,
        recurrenceMonth: 6,
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    expect(inputs).toHaveLength(2)

    inputs[0]!.vm.$emit('update:value', undefined)
    inputs[1]!.vm.$emit('update:value', undefined)

    expect(wrapper.emitted('update:recurrenceMonth')?.[0]).toEqual([1])
    expect(wrapper.emitted('update:recurrenceMonthDay')?.[0]).toEqual([1])
  })
})
