import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'

const storageState = new Map<string, ReturnType<typeof ref>>()

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (key: string, initialValue: string) => {
      if (storageState.has(key)) {
        return storageState.get(key)!
      }
      const entry = ref(initialValue)
      storageState.set(key, entry)
      return entry
    },
  }
})

vi.mock('../utils/timeZoneOptions', () => ({
  buildTimeZoneOptions: () => [
    { label: 'UTC (UTC+00:00)', value: 'UTC' },
    { label: 'Asia/Tokyo (UTC+09:00)', value: 'Asia/Tokyo' },
  ],
}))

vi.mock('../utils/timeZone', () => ({
  formatInTimeZone: (_timestamp: number, timeZone: string) => `formatted-${timeZone}`,
  formatOffsetLabel: () => 'UTC+00:00',
  getTimeZoneOffsetMs: () => 0,
  isTimeZoneSupported: () => true,
  parseDateTimeInput: (value: string) => {
    if (value.includes('start')) {
      return {
        year: 2000,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }
    }
    if (value.includes('end')) {
      return {
        year: 2001,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }
    }
    return null
  },
  toUtcTimestamp: (parts: { year: number }) => parts.year * 1000,
}))

const InputsStub = defineComponent({
  name: 'TimeDifferenceInputs',
  props: {
    startInput: {
      type: String,
      required: true,
    },
    endInput: {
      type: String,
      required: true,
    },
    startTimeZone: {
      type: String,
      required: true,
    },
    endTimeZone: {
      type: String,
      required: true,
    },
    startStatus: {
      type: String,
      default: undefined,
    },
    endStatus: {
      type: String,
      default: undefined,
    },
    startError: {
      type: Boolean,
      required: true,
    },
    endError: {
      type: Boolean,
      required: true,
    },
    startOffsetLabel: {
      type: String,
      required: true,
    },
    endOffsetLabel: {
      type: String,
      required: true,
    },
    timeZoneOptions: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'set-now',
    'update:startInput',
    'update:endInput',
    'update:startTimeZone',
    'update:endTimeZone',
  ],
  template: '<div class="inputs" />',
})

const ResultsStub = defineComponent({
  name: 'TimeDifferenceResults',
  props: {
    signedDurationLabel: {
      type: String,
      required: true,
    },
    absoluteDurationLabel: {
      type: String,
      required: true,
    },
    isoDuration: {
      type: String,
      required: true,
    },
    totalMilliseconds: {
      type: String,
      required: true,
    },
    totalSeconds: {
      type: String,
      required: true,
    },
    totalMinutes: {
      type: String,
      required: true,
    },
    totalHours: {
      type: String,
      required: true,
    },
    totalDays: {
      type: String,
      required: true,
    },
  },
  template: '<div class="results" />',
})

const SwapStub = defineComponent({
  name: 'TimeDifferenceSwapSection',
  emits: ['swap'],
  template: '<div class="swap" />',
})

describe('TimeDifferenceSection', () => {
  it('swaps values and updates computed outputs', async () => {
    storageState.clear()
    storageState.set('tools:time-diff-calculator:start-input', ref('start'))
    storageState.set('tools:time-diff-calculator:end-input', ref('end'))
    storageState.set('tools:time-diff-calculator:start-timezone', ref('UTC'))
    storageState.set('tools:time-diff-calculator:end-timezone', ref('Asia/Tokyo'))

    vi.resetModules()
    const { default: TimeDifferenceSection } = await import('./TimeDifferenceSection.vue')

    const wrapper = mount(TimeDifferenceSection, {
      global: {
        stubs: {
          TimeDifferenceInputs: InputsStub,
          TimeDifferenceResults: ResultsStub,
          TimeDifferenceSwapSection: SwapStub,
        },
      },
    })

    const inputs = wrapper.findComponent({ name: 'TimeDifferenceInputs' })
    const results = wrapper.findComponent({ name: 'TimeDifferenceResults' })

    expect(inputs.props('startInput')).toBe('start')
    expect(inputs.props('endInput')).toBe('end')
    expect(results.props('signedDurationLabel')).toBe('0d 00:00:01.000')
    expect(results.props('isoDuration')).toBe('PT1S')
    expect(results.props('totalMilliseconds')).toBe('1000')

    wrapper.findComponent({ name: 'TimeDifferenceSwapSection' }).vm.$emit('swap')
    await nextTick()

    expect(inputs.props('startInput')).toBe('end')
    expect(inputs.props('endInput')).toBe('start')
    expect(inputs.props('startTimeZone')).toBe('Asia/Tokyo')
    expect(inputs.props('endTimeZone')).toBe('UTC')
    expect(results.props('signedDurationLabel')).toBe('-0d 00:00:01.000')
    expect(results.props('isoDuration')).toBe('-PT1S')
    expect(results.props('totalMilliseconds')).toBe('-1000')

    inputs.vm.$emit('set-now', 'start')
    await nextTick()

    expect(inputs.props('startInput')).toBe('formatted-Asia/Tokyo')
  })
})
