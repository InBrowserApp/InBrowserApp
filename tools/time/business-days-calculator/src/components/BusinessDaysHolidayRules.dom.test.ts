import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BusinessDaysHolidayRules from './BusinessDaysHolidayRules.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        if (typeof params?.count === 'number') {
          return `${key}:${params.count}`
        }
        return key
      },
    }),
  }
})

const mountHolidayRules = (overrideProps: Record<string, unknown> = {}) => {
  const onHolidayListUpdate = vi.fn()

  const wrapper = mount(BusinessDaysHolidayRules, {
    props: {
      holidayList: '',
      holidayInvalidCount: 0,
      holidayStatus: undefined,
      'onUpdate:holidayList': onHolidayListUpdate,
      ...overrideProps,
    },
  })

  return { wrapper, onHolidayListUpdate }
}

describe('BusinessDaysHolidayRules', () => {
  it('renders hints and updates holiday list text', async () => {
    const { wrapper, onHolidayListUpdate } = mountHolidayRules()

    expect(wrapper.text()).toContain('holiday-hint')
    expect(wrapper.text()).toContain('holiday-note')
    expect(wrapper.text()).not.toContain('invalid-holidays')

    const textArea = wrapper.get('textarea')
    expect(textArea.attributes('placeholder')).toBe('holiday-placeholder')

    await textArea.setValue('2026-01-15')
    expect(onHolidayListUpdate).toHaveBeenCalledWith('2026-01-15')
  })

  it('shows validation feedback when invalid holidays are present', () => {
    const { wrapper } = mountHolidayRules({
      holidayList: 'bad-date',
      holidayInvalidCount: 2,
      holidayStatus: 'error',
    })

    expect(wrapper.text()).toContain('invalid-holidays:2')
  })
})
