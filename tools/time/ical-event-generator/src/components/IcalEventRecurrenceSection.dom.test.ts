import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, onMounted } from 'vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h3><slot /></h3>',
})

const FrequencyStub = defineComponent({
  name: 'IcalEventRecurrenceFrequencySection',
  emits: ['update:recurrence-frequency', 'update:recurrence-interval'],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:recurrence-frequency', 'monthly')
      emit('update:recurrence-interval', 3)
    })
    return () => h('div', { 'data-testid': 'frequency' })
  },
})

const PatternStub = defineComponent({
  name: 'IcalEventRecurrencePatternSection',
  emits: [
    'update:recurrence-frequency',
    'update:recurrence-weekdays',
    'update:recurrence-month-day',
    'update:recurrence-month',
  ],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:recurrence-frequency', 'weekly')
      emit('update:recurrence-weekdays', ['MO', 'WE'])
      emit('update:recurrence-month-day', 12)
      emit('update:recurrence-month', 5)
    })
    return () => h('div', { 'data-testid': 'pattern' })
  },
})

const EndsStub = defineComponent({
  name: 'IcalEventRecurrenceEndsSection',
  emits: [
    'update:recurrence-frequency',
    'update:recurrence-end-mode',
    'update:recurrence-count',
    'update:recurrence-until-input',
  ],
  setup(_, { emit }) {
    onMounted(() => {
      emit('update:recurrence-frequency', 'daily')
      emit('update:recurrence-end-mode', 'count')
      emit('update:recurrence-count', 6)
      emit('update:recurrence-until-input', '2024-07-01')
    })
    return () => h('div', { 'data-testid': 'ends' })
  },
})

describe('IcalEventRecurrenceSection', () => {
  it('emits updates from child sections', async () => {
    const { default: IcalEventRecurrenceSection } = await import('./IcalEventRecurrenceSection.vue')

    const wrapper = mount(IcalEventRecurrenceSection, {
      props: {
        recurrenceFrequency: 'none',
        recurrenceInterval: 1,
        recurrenceWeekdays: [],
        recurrenceMonthDay: 1,
        recurrenceMonth: 1,
        recurrenceEndMode: 'never',
        recurrenceCount: 1,
        recurrenceUntilInput: '',
        recurrenceUntilStatus: 'success',
        recurrenceUntilErrorKey: undefined,
        isAllDay: false,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          IcalEventRecurrenceFrequencySection: FrequencyStub,
          IcalEventRecurrencePatternSection: PatternStub,
          IcalEventRecurrenceEndsSection: EndsStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('recurrence')

    const frequencyUpdates = wrapper.emitted('update:recurrenceFrequency') ?? []
    expect(frequencyUpdates[frequencyUpdates.length - 1]).toEqual(['daily'])

    expect(wrapper.emitted('update:recurrenceInterval')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:recurrenceWeekdays')?.[0]).toEqual([['MO', 'WE']])
    expect(wrapper.emitted('update:recurrenceMonthDay')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:recurrenceMonth')?.[0]).toEqual([5])
    expect(wrapper.emitted('update:recurrenceEndMode')?.[0]).toEqual(['count'])
    expect(wrapper.emitted('update:recurrenceCount')?.[0]).toEqual([6])
    expect(wrapper.emitted('update:recurrenceUntilInput')?.[0]).toEqual(['2024-07-01'])
  })
})
