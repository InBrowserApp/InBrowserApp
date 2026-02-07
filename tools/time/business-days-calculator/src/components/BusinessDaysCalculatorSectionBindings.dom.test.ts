import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, ref, type Ref } from 'vue'
import BusinessDaysCalculatorSection from './BusinessDaysCalculatorSection.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (key: string, initialValue: unknown) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key) as Ref<unknown>
    },
  }
})

const BusinessDaysRulesSectionStub = defineComponent({
  name: 'BusinessDaysRulesSection',
  props: [
    'weekdayMode',
    'weekdaySelection',
    'holidayList',
    'hasWorkingDays',
    'holidayInvalidCount',
    'holidayStatus',
  ],
  emits: ['update:weekdayMode', 'update:weekdaySelection', 'update:holidayList'],
  template: '<div class="rules-section-stub" />',
})

const BusinessDaysCountSectionStub = defineComponent({
  name: 'BusinessDaysCountSection',
  props: [
    'startDate',
    'endDate',
    'includeEndpoints',
    'businessDaysLabel',
    'totalDaysLabel',
    'weekendDaysLabel',
    'holidayDaysLabel',
    'isRangeReversed',
  ],
  emits: ['update:startDate', 'update:endDate', 'update:includeEndpoints'],
  template: '<div class="count-section-stub" />',
})

const BusinessDaysOffsetSectionStub = defineComponent({
  name: 'BusinessDaysOffsetSection',
  props: [
    'baseDate',
    'dayOffset',
    'includeStart',
    'hasWorkingDays',
    'addDateLabel',
    'subtractDateLabel',
  ],
  emits: ['update:baseDate', 'update:dayOffset', 'update:includeStart'],
  template: '<div class="offset-section-stub" />',
})

const keys = {
  startDate: 'tools:business-days-calculator:start-date',
  endDate: 'tools:business-days-calculator:end-date',
  baseDate: 'tools:business-days-calculator:base-date',
  dayOffset: 'tools:business-days-calculator:day-offset',
  includeEndpoints: 'tools:business-days-calculator:include-endpoints',
  includeStart: 'tools:business-days-calculator:include-start-add',
  weekdayMode: 'tools:business-days-calculator:weekday-mode',
  weekendDays: 'tools:business-days-calculator:weekend-days',
  holidays: 'tools:business-days-calculator:holidays',
}

const toTimestamp = (year: number, month: number, day: number) =>
  new Date(year, month, day).getTime()

const mountSection = () =>
  mount(BusinessDaysCalculatorSection, {
    global: {
      stubs: {
        BusinessDaysRulesSection: BusinessDaysRulesSectionStub,
        BusinessDaysCountSection: BusinessDaysCountSectionStub,
        BusinessDaysOffsetSection: BusinessDaysOffsetSectionStub,
      },
    },
  })

const setStorage = (overrides: Record<string, unknown> = {}) => {
  const defaults: Record<string, unknown> = {
    [keys.startDate]: toTimestamp(2024, 0, 1),
    [keys.endDate]: toTimestamp(2024, 0, 7),
    [keys.baseDate]: toTimestamp(2024, 0, 5),
    [keys.dayOffset]: 1,
    [keys.includeEndpoints]: true,
    [keys.includeStart]: false,
    [keys.weekdayMode]: 'weekend',
    [keys.weekendDays]: [0, 6],
    [keys.holidays]: '2024-01-01',
  }

  for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
    storage.set(key, ref(value))
  }
}

const getStored = <T>(key: string) => storage.get(key)?.value as T

describe('BusinessDaysCalculatorSection bindings', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('hydrates edge cases from storage and updates models from child events', async () => {
    setStorage({
      [keys.startDate]: null,
      [keys.endDate]: null,
      [keys.baseDate]: null,
      [keys.dayOffset]: Number.NaN,
      [keys.weekdayMode]: 'working',
      [keys.weekendDays]: [6, 0, 6],
      [keys.holidays]: '   ',
    })

    const wrapper = mountSection()
    await flushPromises()

    const rules = wrapper.findComponent(BusinessDaysRulesSectionStub)
    const count = wrapper.findComponent(BusinessDaysCountSectionStub)
    const offset = wrapper.findComponent(BusinessDaysOffsetSectionStub)

    expect(getStored<number[]>(keys.weekendDays)).toEqual([0, 6])
    expect(rules.props('weekdaySelection')).toEqual([1, 2, 3, 4, 5])
    expect(rules.props('holidayStatus')).toBeUndefined()
    expect(count.props('businessDaysLabel')).toBe('')
    expect(count.props('totalDaysLabel')).toBe('')
    expect(count.props('weekendDaysLabel')).toBe('')
    expect(count.props('holidayDaysLabel')).toBe('')
    expect(offset.props('addDateLabel')).toBe('')
    expect(offset.props('subtractDateLabel')).toBe('')

    rules.vm.$emit('update:weekdayMode', 'weekend')
    rules.vm.$emit('update:weekdaySelection', [6, 6, 5])
    rules.vm.$emit('update:weekdayMode', 'working')
    rules.vm.$emit('update:weekdaySelection', [1, 2, 3, 4, 5])
    rules.vm.$emit('update:holidayList', '2024-01-06')

    count.vm.$emit('update:startDate', toTimestamp(2024, 0, 1))
    count.vm.$emit('update:endDate', toTimestamp(2024, 0, 7))
    count.vm.$emit('update:includeEndpoints', true)

    offset.vm.$emit('update:baseDate', toTimestamp(2024, 0, 5))
    offset.vm.$emit('update:dayOffset', 2)
    offset.vm.$emit('update:includeStart', false)

    await flushPromises()

    expect(getStored<'weekend' | 'working'>(keys.weekdayMode)).toBe('working')
    expect(getStored<number[]>(keys.weekendDays)).toEqual([0, 6])
    expect(getStored<string>(keys.holidays)).toBe('2024-01-06')
    expect(getStored<number | null>(keys.startDate)).toBe(toTimestamp(2024, 0, 1))
    expect(getStored<number | null>(keys.endDate)).toBe(toTimestamp(2024, 0, 7))
    expect(getStored<boolean>(keys.includeEndpoints)).toBe(true)
    expect(getStored<number | null>(keys.baseDate)).toBe(toTimestamp(2024, 0, 5))
    expect(getStored<number | null>(keys.dayOffset)).toBe(2)
    expect(getStored<boolean>(keys.includeStart)).toBe(false)

    expect(count.props('businessDaysLabel')).toBe('5')
    expect(count.props('totalDaysLabel')).toBe('7')
    expect(count.props('weekendDaysLabel')).toBe('2')
    expect(count.props('holidayDaysLabel')).toBe('0')
    expect(offset.props('addDateLabel')).toBe('2024-01-09')
    expect(offset.props('subtractDateLabel')).toBe('2024-01-03')
  })
})
