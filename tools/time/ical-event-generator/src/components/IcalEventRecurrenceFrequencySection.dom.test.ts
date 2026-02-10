import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IcalEventRecurrenceFrequencySection from './IcalEventRecurrenceFrequencySection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const StubBase = defineComponent({
    name: 'StubBase',
    template: '<div><slot /></div>',
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
    NFormItemGi: StubBase,
    NGrid: StubBase,
    NInputNumber,
    NSelect,
  }
})

describe('IcalEventRecurrenceFrequencySection', () => {
  it('shows interval input only when recurrence is enabled', () => {
    const noneWrapper = mount(IcalEventRecurrenceFrequencySection, {
      props: {
        recurrenceFrequency: 'none',
        recurrenceInterval: 1,
      },
    })

    expect(noneWrapper.find('.n-input-number').exists()).toBe(false)

    const activeWrapper = mount(IcalEventRecurrenceFrequencySection, {
      props: {
        recurrenceFrequency: 'weekly',
        recurrenceInterval: 2,
      },
    })

    expect(activeWrapper.find('.n-input-number').exists()).toBe(true)
  })

  it('emits frequency and interval updates', async () => {
    const wrapper = mount(IcalEventRecurrenceFrequencySection, {
      props: {
        recurrenceFrequency: 'daily',
        recurrenceInterval: 2,
      },
    })

    await wrapper.find('select').setValue('monthly')
    expect(wrapper.emitted('update:recurrenceFrequency')?.[0]).toEqual(['monthly'])

    const input = wrapper.findComponent({ name: 'NInputNumber' })
    input.vm.$emit('update:value', undefined)
    expect(wrapper.emitted('update:recurrenceInterval')?.[0]).toEqual([1])
  })
})
