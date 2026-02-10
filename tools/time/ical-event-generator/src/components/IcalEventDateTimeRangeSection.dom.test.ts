import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IcalEventDateTimeRangeSection from './IcalEventDateTimeRangeSection.vue'

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

  const FormItemStub = defineComponent({
    name: 'FormItemStub',
    template: '<div><slot /><slot name="feedback" /></div>',
  })

  const NDatePicker = defineComponent({
    name: 'NDatePicker',
    props: {
      value: {
        type: Array,
        default: () => null,
      },
    },
    emits: ['update:value'],
    template: '<input @input="$emit(\'update:value\', [1, 2])" />',
  })

  return {
    NDatePicker,
    NFormItemGi: FormItemStub,
    NGrid: StubBase,
    NText: StubBase,
  }
})

describe('IcalEventDateTimeRangeSection', () => {
  it('renders range errors and all-day hint', () => {
    const wrapper = mount(IcalEventDateTimeRangeSection, {
      props: {
        dateRange: [1, 2],
        rangeErrorKey: 'end-before-start',
        isAllDay: true,
      },
    })

    expect(wrapper.text()).toContain('end-before-start')
    expect(wrapper.text()).toContain('all-day-end-hint')
  })

  it('emits date range updates', async () => {
    const wrapper = mount(IcalEventDateTimeRangeSection, {
      props: {
        dateRange: [1, 2],
        isAllDay: false,
      },
    })

    await wrapper.find('input').trigger('input')
    expect(wrapper.emitted('update:dateRange')?.[0]).toEqual([[1, 2]])
  })
})
