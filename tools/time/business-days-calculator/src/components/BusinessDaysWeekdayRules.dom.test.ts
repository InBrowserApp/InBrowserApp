import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BusinessDaysWeekdayRules from './BusinessDaysWeekdayRules.vue'

const mountWeekdayRules = (overrideProps: Record<string, unknown> = {}) => {
  const onWeekdayModeUpdate = vi.fn()
  const onWeekdaySelectionUpdate = vi.fn()

  const wrapper = mount(BusinessDaysWeekdayRules, {
    props: {
      hasWorkingDays: true,
      weekdayMode: 'weekend',
      weekdaySelection: [0, 6],
      'onUpdate:weekdayMode': onWeekdayModeUpdate,
      'onUpdate:weekdaySelection': onWeekdaySelectionUpdate,
      ...overrideProps,
    },
  })

  return { wrapper, onWeekdayModeUpdate, onWeekdaySelectionUpdate }
}

describe('BusinessDaysWeekdayRules', () => {
  it('toggles selection hint and emits mode/selection updates', async () => {
    const { wrapper, onWeekdayModeUpdate, onWeekdaySelectionUpdate } = mountWeekdayRules()

    expect(wrapper.text()).toContain('Select which days are weekends.')

    await wrapper.get('input[type="radio"][value="working"]').setValue()
    expect(onWeekdayModeUpdate).toHaveBeenCalledWith('working')

    await wrapper.setProps({ weekdayMode: 'working' })
    expect(wrapper.text()).toContain('Select which days are working days.')

    const weekdayCheckboxes = wrapper.findAll('[role="checkbox"]')
    await weekdayCheckboxes[1]!.trigger('click')

    const calls = onWeekdaySelectionUpdate.mock.calls
    const lastSelection = calls[calls.length - 1]?.[0] as number[] | undefined
    expect(lastSelection).toEqual(expect.arrayContaining([0, 1, 6]))
    expect(lastSelection).toHaveLength(3)
    expect(weekdayCheckboxes).toHaveLength(7)
  })

  it('shows an error when no working days remain', () => {
    const { wrapper } = mountWeekdayRules({ hasWorkingDays: false })

    expect(wrapper.text()).toContain('No working days selected.')
  })
})
