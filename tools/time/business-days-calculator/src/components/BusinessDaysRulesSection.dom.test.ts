import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import BusinessDaysRulesSection from './BusinessDaysRulesSection.vue'

const BusinessDaysWeekdayRulesStub = defineComponent({
  name: 'BusinessDaysWeekdayRules',
  props: {
    hasWorkingDays: {
      type: Boolean,
      required: true,
    },
    weekdayMode: {
      type: String,
      required: true,
    },
    weekdaySelection: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:weekdayMode', 'update:weekdaySelection'],
  template: `
    <div class="weekday-rules">
      <button class="weekday-mode" @click="$emit('update:weekdayMode', 'working')">mode</button>
      <button class="weekday-selection" @click="$emit('update:weekdaySelection', [1, 2, 3])">selection</button>
      <span class="has-working-days">{{ hasWorkingDays }}</span>
    </div>
  `,
})

const BusinessDaysHolidayRulesStub = defineComponent({
  name: 'BusinessDaysHolidayRules',
  props: {
    holidayList: {
      type: String,
      required: true,
    },
    holidayInvalidCount: {
      type: Number,
      required: true,
    },
    holidayStatus: {
      type: String,
      default: undefined,
    },
  },
  emits: ['update:holidayList'],
  template: `
    <div class="holiday-rules">
      <button class="holiday-list" @click="$emit('update:holidayList', '2026-01-01')">holiday</button>
      <span class="holiday-status">{{ holidayStatus }}</span>
    </div>
  `,
})

const mountRulesSection = (overrideProps: Record<string, unknown> = {}) => {
  const onWeekdayModeUpdate = vi.fn()
  const onWeekdaySelectionUpdate = vi.fn()
  const onHolidayListUpdate = vi.fn()

  const wrapper = mount(BusinessDaysRulesSection, {
    props: {
      hasWorkingDays: true,
      holidayInvalidCount: 0,
      holidayStatus: 'success',
      weekdayMode: 'weekend',
      weekdaySelection: [0, 6],
      holidayList: '',
      'onUpdate:weekdayMode': onWeekdayModeUpdate,
      'onUpdate:weekdaySelection': onWeekdaySelectionUpdate,
      'onUpdate:holidayList': onHolidayListUpdate,
      ...overrideProps,
    },
    global: {
      stubs: {
        ToolSection: defineComponent({ template: '<section><slot /></section>' }),
        ToolSectionHeader: defineComponent({ template: '<h3><slot /></h3>' }),
        NFlex: defineComponent({ template: '<div><slot /></div>' }),
        BusinessDaysWeekdayRules: BusinessDaysWeekdayRulesStub,
        BusinessDaysHolidayRules: BusinessDaysHolidayRulesStub,
      },
    },
  })

  return { wrapper, onWeekdayModeUpdate, onWeekdaySelectionUpdate, onHolidayListUpdate }
}

describe('BusinessDaysRulesSection', () => {
  it('passes props to child sections and relays v-model updates', async () => {
    const { wrapper, onWeekdayModeUpdate, onWeekdaySelectionUpdate, onHolidayListUpdate } =
      mountRulesSection({ hasWorkingDays: false, holidayInvalidCount: 3, holidayStatus: 'error' })

    expect(wrapper.text()).toContain('Business Day Rules')
    expect(wrapper.find('.has-working-days').text()).toBe('false')
    expect(wrapper.find('.holiday-status').text()).toBe('error')

    await wrapper.get('.weekday-mode').trigger('click')
    await wrapper.get('.weekday-selection').trigger('click')
    await wrapper.get('.holiday-list').trigger('click')

    expect(onWeekdayModeUpdate).toHaveBeenCalledWith('working')
    expect(onWeekdaySelectionUpdate).toHaveBeenCalledWith([1, 2, 3])
    expect(onHolidayListUpdate).toHaveBeenCalledWith('2026-01-01')
  })
})
