import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import BusinessDaysCalculatorSection from './BusinessDaysCalculatorSection.vue'

type StorageSeed = {
  startDate: number
  endDate: number
  baseDate: number
  dayOffset: number
  weekdayMode: 'weekend' | 'working'
  weekendDays: number[]
  includeEndpoints: boolean
  includeStart: boolean
  holidays: string
}

const toTimestamp = (year: number, month: number, day: number) =>
  new Date(year, month, day).getTime()

const defaultSeed: StorageSeed = {
  startDate: toTimestamp(2024, 0, 1),
  endDate: toTimestamp(2024, 0, 7),
  baseDate: toTimestamp(2024, 0, 5),
  dayOffset: 1,
  weekdayMode: 'weekend',
  weekendDays: [0, 6],
  includeEndpoints: true,
  includeStart: false,
  holidays: '2024-01-01',
}

const seedStorage = (overrides: Partial<StorageSeed> = {}) => {
  const seed = { ...defaultSeed, ...overrides }
  localStorage.setItem('tools:business-days-calculator:start-date', String(seed.startDate))
  localStorage.setItem('tools:business-days-calculator:end-date', String(seed.endDate))
  localStorage.setItem('tools:business-days-calculator:base-date', String(seed.baseDate))
  localStorage.setItem('tools:business-days-calculator:day-offset', String(seed.dayOffset))
  localStorage.setItem('tools:business-days-calculator:weekday-mode', seed.weekdayMode)
  localStorage.setItem(
    'tools:business-days-calculator:weekend-days',
    JSON.stringify(seed.weekendDays),
  )
  localStorage.setItem(
    'tools:business-days-calculator:include-endpoints',
    String(seed.includeEndpoints),
  )
  localStorage.setItem(
    'tools:business-days-calculator:include-start-add',
    String(seed.includeStart),
  )
  localStorage.setItem('tools:business-days-calculator:holidays', seed.holidays)
  return seed
}

const BusinessDaysCalculatorSectionWithProvider = {
  render() {
    return h(NMessageProvider, () => h(BusinessDaysCalculatorSection))
  },
}

const mountSection = () => mount(BusinessDaysCalculatorSectionWithProvider)

describe('BusinessDaysCalculatorSection', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('computes range and add/subtract results from stored inputs', async () => {
    seedStorage()
    const wrapper = mountSection()
    await flushPromises()

    const codes = wrapper.findAll('code').map((node) => node.text())
    expect(codes).toEqual(['4', '7', '2', '1', '2024-01-08', '2024-01-04'])
  })

  it('counts the start date when enabled and reports invalid holidays', async () => {
    seedStorage({ includeStart: true, holidays: '2024-02-30' })
    const wrapper = mountSection()
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid entries: 1')

    const codes = wrapper.findAll('code').map((node) => node.text())
    expect(codes.slice(-2)).toEqual(['2024-01-05', '2024-01-05'])
  })

  it('shows an error when no working days are selected', async () => {
    seedStorage({ weekendDays: [0, 1, 2, 3, 4, 5, 6] })
    const wrapper = mountSection()
    await flushPromises()

    expect(wrapper.text()).toContain('No working days selected.')

    const codes = wrapper.findAll('code').map((node) => node.text())
    expect(codes.slice(-2)).toEqual(['-', '-'])
  })
})
