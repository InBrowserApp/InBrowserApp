import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DurationCalculatorInputs from './DurationCalculatorInputs.vue'

describe('DurationCalculatorInputs', () => {
  it('forwards model updates and now events from child cards', async () => {
    const wrapper = mount(DurationCalculatorInputs, {
      props: {
        baseInput: '2024-01-01 00:00:00.000',
        baseTimeZone: 'UTC',
        durationIsoInput: 'PT1H',
        durationParts: {
          days: 0,
          hours: 1,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        },
        baseStatus: undefined,
        baseError: false,
        baseOffsetLabel: 'UTC+00:00',
        timeZoneOptions: [{ label: 'UTC', value: 'UTC' }],
        durationIsoStatus: undefined,
        durationIsoInvalid: false,
        normalizedDurationIso: 'PT1H',
      },
      global: {
        stubs: {
          DurationCalculatorBaseTimeCard: {
            template:
              '<div><button data-testid="base-input" @click="$emit(\'update:baseInput\', \'2024-02-03 04:05:06.007\')" /><button data-testid="base-time-zone" @click="$emit(\'update:baseTimeZone\', \'Asia/Tokyo\')" /><button data-testid="now" @click="$emit(\'now\')" /></div>',
          },
          DurationCalculatorDurationCard: {
            template:
              '<div><button data-testid="duration-iso" @click="$emit(\'update:durationIsoInput\', \'P2DT3H\')" /><button data-testid="duration-parts" @click="$emit(\'update:durationParts\', { days: 2, hours: 3, minutes: 4, seconds: 5, milliseconds: 6 })" /></div>',
          },
        },
      },
    })

    await wrapper.get('[data-testid="base-input"]').trigger('click')
    await wrapper.get('[data-testid="base-time-zone"]').trigger('click')
    await wrapper.get('[data-testid="duration-iso"]').trigger('click')
    await wrapper.get('[data-testid="duration-parts"]').trigger('click')
    await wrapper.get('[data-testid="now"]').trigger('click')

    expect(wrapper.emitted('update:baseInput')?.[0]).toEqual(['2024-02-03 04:05:06.007'])
    expect(wrapper.emitted('update:baseTimeZone')?.[0]).toEqual(['Asia/Tokyo'])
    expect(wrapper.emitted('update:durationIsoInput')?.[0]).toEqual(['P2DT3H'])
    expect(wrapper.emitted('update:durationParts')?.[0]).toEqual([
      {
        days: 2,
        hours: 3,
        minutes: 4,
        seconds: 5,
        milliseconds: 6,
      },
    ])
    expect(wrapper.emitted('now')).toHaveLength(1)
  })
})
