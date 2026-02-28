import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BusinessDaysHolidayRules from './BusinessDaysHolidayRules.vue'

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

    expect(wrapper.text()).toContain('Optional. Holidays on weekdays are excluded.')
    expect(wrapper.text()).toContain('Weekend holidays are already excluded by weekend settings.')
    expect(wrapper.text()).not.toContain('Invalid entries:')

    const textArea = wrapper.get('textarea')
    expect(textArea.attributes('placeholder')).toBe('2026-01-15 (YYYY-MM-DD), one per line')

    await textArea.setValue('2026-01-15')
    expect(onHolidayListUpdate).toHaveBeenCalledWith('2026-01-15')
  })

  it('shows validation feedback when invalid holidays are present', () => {
    const { wrapper } = mountHolidayRules({
      holidayList: 'bad-date',
      holidayInvalidCount: 2,
      holidayStatus: 'error',
    })

    expect(wrapper.text()).toContain('Invalid entries: 2')
  })
})
