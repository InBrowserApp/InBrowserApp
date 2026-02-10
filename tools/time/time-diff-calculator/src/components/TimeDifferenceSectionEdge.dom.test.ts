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
    { label: 'Invalid', value: 'invalid-tz' },
  ],
}))

vi.mock('../utils/timeZone', () => ({
  formatInTimeZone: (_timestamp: number, timeZone: string) => `formatted-${timeZone}`,
  formatOffsetLabel: (offset: number) => `offset-${offset}`,
  getTimeZoneOffsetMs: () => 0,
  isTimeZoneSupported: (timeZone: string) => timeZone !== 'invalid-tz',
  parseDateTimeInput: (value: string) => {
    if (value.startsWith('valid')) {
      return {
        year: 2024,
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
  toUtcTimestamp: () => 1_700_000_000_000,
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

describe('TimeDifferenceSection edge cases', () => {
  it('handles unsupported zones, empty statuses, and end set-now updates', async () => {
    storageState.clear()
    storageState.set('tools:time-diff-calculator:start-input', ref(''))
    storageState.set('tools:time-diff-calculator:end-input', ref(''))
    storageState.set('tools:time-diff-calculator:start-timezone', ref('invalid-tz'))
    storageState.set('tools:time-diff-calculator:end-timezone', ref('invalid-tz'))

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

    expect(inputs.props('startTimeZone')).not.toBe('invalid-tz')
    expect(inputs.props('endTimeZone')).not.toBe('invalid-tz')
    expect(inputs.props('startStatus')).toBeUndefined()
    expect(inputs.props('endStatus')).toBeUndefined()

    inputs.vm.$emit('update:startTimeZone', 'invalid-tz')
    inputs.vm.$emit('update:endTimeZone', 'invalid-tz')
    inputs.vm.$emit('update:startInput', 'valid-start')
    inputs.vm.$emit('update:endInput', 'invalid-end')
    await nextTick()

    expect(inputs.props('startOffsetLabel')).toBe('')
    expect(inputs.props('endOffsetLabel')).toBe('')
    expect(inputs.props('endStatus')).toBe('error')
    expect(results.props('totalMilliseconds')).toBe('')
    expect(results.props('isoDuration')).toBe('')

    inputs.vm.$emit('set-now', 'end')
    await nextTick()

    expect(inputs.props('endInput')).toBe('formatted-invalid-tz')
  })
})
