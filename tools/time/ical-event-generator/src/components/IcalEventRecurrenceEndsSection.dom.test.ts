import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IcalEventRecurrenceEndsSection from './IcalEventRecurrenceEndsSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const StubBase = defineComponent({
    name: 'StubBase',
    template: '<div><slot /><slot name="feedback" /></div>',
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
    template:
      '<select :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    emits: ['update:value'],
    template: '<input class="n-input-number" @input="$emit(\'update:value\', undefined)" />',
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
    template:
      '<input class="n-input" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NFormItemGi: StubBase,
    NGrid: StubBase,
    NInput,
    NInputNumber,
    NSelect,
    NText: StubBase,
  }
})

describe('IcalEventRecurrenceEndsSection', () => {
  it('emits end mode updates from select changes', () => {
    const wrapper = mount(IcalEventRecurrenceEndsSection, {
      props: {
        recurrenceFrequency: 'weekly',
        recurrenceEndMode: 'never',
        recurrenceCount: 2,
        recurrenceUntilInput: '',
        isAllDay: false,
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    select.vm.$emit('update:value', 'until')

    expect(wrapper.emitted('update:recurrenceEndMode')?.[0]).toEqual(['until'])
  })

  it('emits count updates and renders count input', () => {
    const wrapper = mount(IcalEventRecurrenceEndsSection, {
      props: {
        recurrenceFrequency: 'weekly',
        recurrenceEndMode: 'count',
        recurrenceCount: 2,
        recurrenceUntilInput: '',
        isAllDay: false,
      },
    })

    expect(wrapper.find('.n-input-number').exists()).toBe(true)

    const input = wrapper.findComponent({ name: 'NInputNumber' })
    input.vm.$emit('update:value', undefined)

    expect(wrapper.emitted('update:recurrenceCount')?.[0]).toEqual([1])
  })

  it('shows until input and error messages', () => {
    const wrapper = mount(IcalEventRecurrenceEndsSection, {
      props: {
        recurrenceFrequency: 'weekly',
        recurrenceEndMode: 'until',
        recurrenceCount: 2,
        recurrenceUntilInput: '',
        recurrenceUntilStatus: 'error',
        recurrenceUntilErrorKey: 'invalid-date-time',
        isAllDay: false,
      },
    })

    const input = wrapper.find('.n-input')
    expect(input.attributes('placeholder')).toBe('YYYY-MM-DD HH:mm:ss')
    expect(wrapper.text()).toContain('Invalid date/time')

    const inputComponent = wrapper.findComponent({ name: 'NInput' })
    inputComponent.vm.$emit('update:value', '2024-01-02 12:00:00')
    expect(wrapper.emitted('update:recurrenceUntilInput')?.[0]).toEqual(['2024-01-02 12:00:00'])
  })

  it('uses date placeholder for all-day events', () => {
    const wrapper = mount(IcalEventRecurrenceEndsSection, {
      props: {
        recurrenceFrequency: 'weekly',
        recurrenceEndMode: 'until',
        recurrenceCount: 2,
        recurrenceUntilInput: '',
        isAllDay: true,
      },
    })

    expect(wrapper.find('.n-input').attributes('placeholder')).toBe('YYYY-MM-DD')
  })
})
