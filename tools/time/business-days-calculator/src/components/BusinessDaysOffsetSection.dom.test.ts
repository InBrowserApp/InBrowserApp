import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import BusinessDaysOffsetSection from './BusinessDaysOffsetSection.vue'

const DatePickerStub = defineComponent({
  name: 'DatePicker',
  emits: ['update:value'],
  template: '<button class="date-picker" @click="$emit(\'update:value\', 11)">date</button>',
})

const InputNumberStub = defineComponent({
  name: 'InputNumber',
  emits: ['update:value'],
  template: '<button class="day-offset" @click="$emit(\'update:value\', 7)">offset</button>',
})

const SwitchStub = defineComponent({
  name: 'SwitchStub',
  emits: ['update:value'],
  template: '<button class="include-start" @click="$emit(\'update:value\', true)">switch</button>',
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
  const onBaseDateUpdate = vi.fn()
  const onDayOffsetUpdate = vi.fn()
  const onIncludeStartUpdate = vi.fn()

  const wrapper = mount(BusinessDaysOffsetSection, {
    props: {
      baseDate: 10,
      dayOffset: 5,
      includeStart: false,
      hasWorkingDays: true,
      addDateLabel: '',
      subtractDateLabel: '',
      'onUpdate:baseDate': onBaseDateUpdate,
      'onUpdate:dayOffset': onDayOffsetUpdate,
      'onUpdate:includeStart': onIncludeStartUpdate,
      ...overrideProps,
    },
    global: {
      stubs: {
        DatePicker: DatePickerStub,
        NDatePicker: DatePickerStub,
        'n-date-picker': DatePickerStub,
        InputNumber: InputNumberStub,
        NInputNumber: InputNumberStub,
        'n-input-number': InputNumberStub,
        Switch: SwitchStub,
        NSwitch: SwitchStub,
        'n-switch': SwitchStub,
        CopyToClipboardButton: CopyButtonStub,
        'copy-to-clipboard-button': CopyButtonStub,
      },
    },
  })

  return { wrapper, onBaseDateUpdate, onDayOffsetUpdate, onIncludeStartUpdate }
}

describe('BusinessDaysOffsetSection', () => {
  it('renders fallback values and warning when no working days exist', () => {
    const { wrapper } = mountSection({
      hasWorkingDays: false,
      addDateLabel: '',
      subtractDateLabel: '',
    })

    expect(wrapper.text()).toContain('No working days selected.')
    expect(wrapper.text()).toContain('-')
    expect(wrapper.findAll('.copy-button')).toHaveLength(0)
  })

  it('shows result labels and emits updates from controls', async () => {
    const { wrapper, onBaseDateUpdate, onDayOffsetUpdate, onIncludeStartUpdate } = mountSection({
      addDateLabel: '2026-01-08',
      subtractDateLabel: '2025-12-30',
    })

    expect(wrapper.text()).toContain('2026-01-08')
    expect(wrapper.text()).toContain('2025-12-30')
    expect(wrapper.findAll('.copy-button')).toHaveLength(2)

    await wrapper.get('.date-picker').trigger('click')
    await wrapper.get('.day-offset').trigger('click')
    await wrapper.get('.include-start').trigger('click')

    expect(onBaseDateUpdate).toHaveBeenCalledWith(11)
    expect(onDayOffsetUpdate).toHaveBeenCalledWith(7)
    expect(onIncludeStartUpdate).toHaveBeenCalledWith(true)
  })
})
