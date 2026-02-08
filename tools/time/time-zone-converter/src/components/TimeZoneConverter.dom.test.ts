import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, type Ref } from 'vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, initialValue: unknown) => {
    if (!storage.has(key)) {
      storage.set(key, ref(initialValue))
    }
    return storage.get(key) as Ref<unknown>
  },
}))

const timeZoneUtils = vi.hoisted(() => ({
  formatInTimeZone: vi.fn((timestamp: number) => String(timestamp)),
  formatOffsetLabel: vi.fn((offset: number) => `UTC${offset}`),
  getSupportedTimeZones: vi.fn(() => ['UTC', 'America/New_York', 'Bad/Zone']),
  getTimeZoneOffsetMs: vi.fn((_timestamp: number, timeZone: string) => {
    if (timeZone === 'Bad/Zone') {
      throw new Error('bad')
    }
    return 0
  }),
  isTimeZoneSupported: vi.fn((timeZone: string) => timeZone !== 'Bad/Zone'),
  parseDateTimeInput: vi.fn((value: string) => {
    if (!value.trim()) return null
    const num = Number(value)
    if (Number.isNaN(num)) return null
    return { value: num }
  }),
  toUtcTimestamp: vi.fn((parts: { value: number }) => parts.value),
}))

vi.mock('../utils/timeZone', () => timeZoneUtils)

import TimeZoneConverter from './TimeZoneConverter.vue'

const TimeZoneConverterInputsStub = defineComponent({
  name: 'TimeZoneConverterInputs',
  props: [
    'fromInput',
    'toInput',
    'fromTimeZone',
    'toTimeZone',
    'fromStatus',
    'toStatus',
    'fromError',
    'toError',
    'fromOffsetLabel',
    'toOffsetLabel',
    'timeZoneOptions',
  ],
  emits: [
    'update:fromInput',
    'update:toInput',
    'update:fromTimeZone',
    'update:toTimeZone',
    'set-now',
    'mark-edited',
  ],
  template: `
    <div>
      <button data-testid="set-now-from" @click="$emit('set-now', 'from')" />
      <button data-testid="set-now-to" @click="$emit('set-now', 'to')" />
      <button data-testid="mark-from" @click="$emit('mark-edited', 'from')" />
      <button data-testid="mark-to" @click="$emit('mark-edited', 'to')" />
    </div>
  `,
})

const TimeZoneConverterSwapSectionStub = defineComponent({
  name: 'TimeZoneConverterSwapSection',
  emits: ['swap'],
  template: '<button data-testid="swap" @click="$emit(\'swap\')" />',
})

const TimeZoneConverterDetailsStub = defineComponent({
  name: 'TimeZoneConverterDetails',
  props: ['isoString', 'utcString', 'unixMilliseconds', 'unixSeconds'],
  template: '<div />',
})

const mountConverter = () =>
  mount(TimeZoneConverter, {
    global: {
      stubs: {
        TimeZoneConverterInputs: TimeZoneConverterInputsStub,
        TimeZoneConverterSwapSection: TimeZoneConverterSwapSectionStub,
        TimeZoneConverterDetails: TimeZoneConverterDetailsStub,
      },
    },
  })

const setStorage = (key: string, value: unknown) => {
  storage.set(key, ref(value))
}

const getStorageValue = (key: string) => (storage.get(key) as Ref<unknown>)?.value

describe('TimeZoneConverter', () => {
  beforeEach(() => {
    storage.clear()
    timeZoneUtils.formatInTimeZone.mockClear()
    timeZoneUtils.parseDateTimeInput.mockClear()
    timeZoneUtils.isTimeZoneSupported.mockImplementation(
      (timeZone: string) => timeZone !== 'Bad/Zone',
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('provides statuses and fallback options', () => {
    setStorage('tools:time-zone-converter:from-input', '')
    setStorage('tools:time-zone-converter:to-input', 'not-a-date')
    setStorage('tools:time-zone-converter:from-timezone', 'Bad/Zone')
    setStorage('tools:time-zone-converter:to-timezone', 'UTC')

    const wrapper = mountConverter()

    const inputs = wrapper.findComponent({ name: 'TimeZoneConverterInputs' })
    const props = inputs.props()

    expect(props.fromStatus).toBeUndefined()
    expect(props.toStatus).toBe('error')
    expect(props.fromError).toBe(false)
    expect(props.toError).toBe(true)

    const options = props.timeZoneOptions as Array<{ label: string; value: string }>
    expect(options.find((option) => option.value === 'Bad/Zone')?.label).toBe('Bad/Zone')
    expect(getStorageValue('tools:time-zone-converter:from-timezone')).not.toBe('Bad/Zone')
  })

  it('resets unsupported stored target zone and treats empty target input as unset', () => {
    setStorage('tools:time-zone-converter:from-input', '')
    setStorage('tools:time-zone-converter:to-input', '')
    setStorage('tools:time-zone-converter:from-timezone', 'UTC')
    setStorage('tools:time-zone-converter:to-timezone', 'Bad/Zone')

    const wrapper = mountConverter()
    const inputs = wrapper.findComponent({ name: 'TimeZoneConverterInputs' })

    expect(getStorageValue('tools:time-zone-converter:to-timezone')).not.toBe('Bad/Zone')
    expect(inputs.props('toStatus')).toBeUndefined()
  })

  it('falls back to UTC when the resolved time zone is unsupported', () => {
    setStorage('tools:time-zone-converter:from-input', '100')
    setStorage('tools:time-zone-converter:to-input', '200')

    const dateTimeFormatSpy = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ timeZone: 'Bad/Zone' }),
        }) as Intl.DateTimeFormat,
    )

    const wrapper = mountConverter()
    const inputs = wrapper.findComponent({ name: 'TimeZoneConverterInputs' })

    expect(inputs.props('fromTimeZone')).toBe('UTC')

    dateTimeFormatSpy.mockRestore()
  })

  it('falls back target defaults and reports invalid source status for unsupported candidates', () => {
    setStorage('tools:time-zone-converter:from-input', 'not-a-date')
    setStorage('tools:time-zone-converter:to-input', '200')

    const dateTimeFormatSpy = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ timeZone: 'America/Los_Angeles' }),
        }) as Intl.DateTimeFormat,
    )

    timeZoneUtils.isTimeZoneSupported.mockImplementation((timeZone: string) => {
      if (timeZone === 'UTC') return false
      return timeZone !== 'Bad/Zone'
    })

    const wrapper = mountConverter()
    const inputs = wrapper.findComponent({ name: 'TimeZoneConverterInputs' })

    expect(inputs.props('fromTimeZone')).toBe('America/Los_Angeles')
    expect(inputs.props('toTimeZone')).toBe('UTC')
    expect(inputs.props('fromStatus')).toBe('error')

    dateTimeFormatSpy.mockRestore()
  })

  it('swaps inputs and time zones', async () => {
    setStorage('tools:time-zone-converter:from-input', '')
    setStorage('tools:time-zone-converter:to-input', '200')
    setStorage('tools:time-zone-converter:from-timezone', 'UTC')
    setStorage('tools:time-zone-converter:to-timezone', 'America/New_York')

    const wrapper = mountConverter()

    await wrapper.get('[data-testid="swap"]').trigger('click')

    expect(getStorageValue('tools:time-zone-converter:from-timezone')).toBe('America/New_York')
    expect(getStorageValue('tools:time-zone-converter:to-timezone')).toBe('UTC')
    expect(getStorageValue('tools:time-zone-converter:from-input')).toBe('200')
    expect(getStorageValue('tools:time-zone-converter:to-input')).toBe('200')
  })

  it('sets now and updates the opposite input when source is from', async () => {
    setStorage('tools:time-zone-converter:from-input', '100')
    setStorage('tools:time-zone-converter:to-input', '200')
    setStorage('tools:time-zone-converter:from-timezone', 'UTC')
    setStorage('tools:time-zone-converter:to-timezone', 'America/New_York')

    vi.spyOn(Date, 'now').mockReturnValue(123456)

    const wrapper = mountConverter()

    await wrapper.get('[data-testid="set-now-from"]').trigger('click')

    expect(getStorageValue('tools:time-zone-converter:from-input')).toBe('123456')
    expect(getStorageValue('tools:time-zone-converter:to-input')).toBe('123456')
  })

  it('sets now and updates the opposite input when source is to', async () => {
    setStorage('tools:time-zone-converter:from-input', '100')
    setStorage('tools:time-zone-converter:to-input', '200')
    setStorage('tools:time-zone-converter:from-timezone', 'UTC')
    setStorage('tools:time-zone-converter:to-timezone', 'America/New_York')

    vi.spyOn(Date, 'now').mockReturnValue(456789)

    const wrapper = mountConverter()

    await wrapper.get('[data-testid="set-now-to"]').trigger('click')

    expect(getStorageValue('tools:time-zone-converter:to-input')).toBe('456789')
    expect(getStorageValue('tools:time-zone-converter:from-input')).toBe('456789')
  })

  it('propagates v-model updates and shows empty offset labels for unsupported zones', async () => {
    setStorage('tools:time-zone-converter:from-input', '100')
    setStorage('tools:time-zone-converter:to-input', '200')
    setStorage('tools:time-zone-converter:from-timezone', 'UTC')
    setStorage('tools:time-zone-converter:to-timezone', 'UTC')

    const wrapper = mountConverter()
    const inputs = wrapper.findComponent({ name: 'TimeZoneConverterInputs' })

    inputs.vm.$emit('update:fromInput', '111')
    inputs.vm.$emit('update:fromTimeZone', 'Bad/Zone')
    inputs.vm.$emit('update:toTimeZone', 'Bad/Zone')

    await wrapper.vm.$nextTick()

    expect(getStorageValue('tools:time-zone-converter:from-input')).toBe('111')
    expect(getStorageValue('tools:time-zone-converter:from-timezone')).toBe('Bad/Zone')
    expect(getStorageValue('tools:time-zone-converter:to-timezone')).toBe('Bad/Zone')
    expect(inputs.props('fromOffsetLabel')).toBe('')
    expect(inputs.props('toOffsetLabel')).toBe('')
  })

  it('uses the last edited input as the source', async () => {
    setStorage('tools:time-zone-converter:from-input', '100')
    setStorage('tools:time-zone-converter:to-input', '200')
    setStorage('tools:time-zone-converter:from-timezone', 'UTC')
    setStorage('tools:time-zone-converter:to-timezone', 'UTC')

    const wrapper = mountConverter()

    const inputs = wrapper.findComponent({ name: 'TimeZoneConverterInputs' })
    inputs.vm.$emit('update:toInput', '200')
    inputs.vm.$emit('mark-edited', 'to')

    await wrapper.vm.$nextTick()

    expect(getStorageValue('tools:time-zone-converter:from-input')).toBe('200')
  })

  it('keeps derived outputs empty when the edited source becomes invalid', async () => {
    setStorage('tools:time-zone-converter:from-input', '100')
    setStorage('tools:time-zone-converter:to-input', '200')
    setStorage('tools:time-zone-converter:from-timezone', 'UTC')
    setStorage('tools:time-zone-converter:to-timezone', 'UTC')

    const wrapper = mountConverter()
    const inputs = wrapper.findComponent({ name: 'TimeZoneConverterInputs' })
    const details = wrapper.findComponent({ name: 'TimeZoneConverterDetails' })

    inputs.vm.$emit('update:toInput', '')
    inputs.vm.$emit('mark-edited', 'to')

    await wrapper.vm.$nextTick()

    expect(details.props('isoString')).toBe('')
    expect(details.props('utcString')).toBe('')
    expect(details.props('unixMilliseconds')).toBe('')
    expect(details.props('unixSeconds')).toBe('')
  })
})
