import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import BusinessDaysCountSection from './BusinessDaysCountSection.vue'

const DatePickerStub = defineComponent({
  name: 'DatePicker',
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:value'],
  template: `
    <button class="date-picker" @click="$emit('update:value', (value ?? 0) + 1)">date</button>
  `,
})

const SwitchStub = defineComponent({
  name: 'SwitchStub',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:value'],
  template: `
    <button class="toggle-switch" @click="$emit('update:value', !value)">switch</button>
  `,
})

const CopyButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  template: '<button class="copy-button">{{ content }}</button>',
})

const mountSection = (overrideProps: Record<string, unknown> = {}) => {
  const onStartDateUpdate = vi.fn()
  const onEndDateUpdate = vi.fn()
  const onIncludeEndpointsUpdate = vi.fn()

  const wrapper = mount(BusinessDaysCountSection, {
    props: {
      startDate: 1,
      endDate: 2,
      includeEndpoints: true,
      businessDaysLabel: '',
      totalDaysLabel: '',
      weekendDaysLabel: '',
      holidayDaysLabel: '',
      isRangeReversed: false,
      'onUpdate:startDate': onStartDateUpdate,
      'onUpdate:endDate': onEndDateUpdate,
      'onUpdate:includeEndpoints': onIncludeEndpointsUpdate,
      ...overrideProps,
    },
    global: {
      stubs: {
        DatePicker: DatePickerStub,
        NDatePicker: DatePickerStub,
        'n-date-picker': DatePickerStub,
        Switch: SwitchStub,
        NSwitch: SwitchStub,
        'n-switch': SwitchStub,
        CopyToClipboardButton: CopyButtonStub,
        'copy-to-clipboard-button': CopyButtonStub,
      },
    },
  })

  return { wrapper, onStartDateUpdate, onEndDateUpdate, onIncludeEndpointsUpdate }
}

describe('BusinessDaysCountSection', () => {
  it('renders fallback placeholders when labels are empty', () => {
    const { wrapper } = mountSection()

    expect(wrapper.text()).not.toContain('End date is before start date')
    expect(wrapper.text()).toContain('-')
    expect(wrapper.findAll('.copy-button')).toHaveLength(0)
  })

  it('shows labels, copy buttons, and range warning when data is present', () => {
    const { wrapper } = mountSection({
      businessDaysLabel: '10',
      totalDaysLabel: '14',
      weekendDaysLabel: '3',
      holidayDaysLabel: '1',
      isRangeReversed: true,
    })

    expect(wrapper.text()).toContain('End date is before start date; results use swapped dates.')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('14')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.findAll('.copy-button')).toHaveLength(4)
  })

  it('emits date and endpoint updates from controls', async () => {
    const { wrapper, onStartDateUpdate, onEndDateUpdate, onIncludeEndpointsUpdate } = mountSection()

    const datePickers = wrapper.findAll('.date-picker')
    expect(datePickers).toHaveLength(2)

    await datePickers[0]!.trigger('click')
    await datePickers[1]!.trigger('click')
    await wrapper.get('.toggle-switch').trigger('click')

    expect(onStartDateUpdate).toHaveBeenCalledWith(2)
    expect(onEndDateUpdate).toHaveBeenCalledWith(3)
    expect(onIncludeEndpointsUpdate).toHaveBeenCalledWith(false)
  })
})
