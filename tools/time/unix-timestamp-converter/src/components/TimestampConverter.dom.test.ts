import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import TimestampConverter from './TimestampConverter.vue'

const { fixedMs } = vi.hoisted(() => ({
  fixedMs: Date.UTC(2024, 0, 1, 0, 0, 0),
}))

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useNow: () => ref(new Date(fixedMs)),
  }
})

const TimestampInputSectionStub = defineComponent({
  name: 'TimestampInputSection',
  props: {
    timestamp: {
      type: String,
      default: '',
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:timestamp', 'set-now'],
  template:
    '<div class="timestamp-input" :data-timestamp="timestamp" :data-valid="String(isValid)" />',
})

const TimestampUnitSectionStub = defineComponent({
  name: 'TimestampUnitSection',
  props: {
    unit: {
      type: String,
      default: '',
    },
    showDetected: {
      type: Boolean,
      default: false,
    },
    detectedUnit: {
      type: String,
      default: '',
    },
    digitCount: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:unit'],
  template:
    '<div class="timestamp-unit" :data-unit="unit" :data-show-detected="String(showDetected)" :data-detected-unit="detectedUnit" :data-digit-count="digitCount" />',
})

const TimestampDateSectionStub = defineComponent({
  name: 'TimestampDateSection',
  props: {
    date: {
      type: [Number, null],
      default: null,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    localDateString: {
      type: String,
      default: '',
    },
  },
  emits: ['update:date'],
  template:
    '<div class="timestamp-date" :data-date="String(date)" :data-valid="String(isValid)" :data-local="localDateString" />',
})

const TimestampDetailsSectionStub = defineComponent({
  name: 'TimestampDetailsSection',
  props: {
    isoString: {
      type: String,
      default: '',
    },
    utcString: {
      type: String,
      default: '',
    },
    dateValue: {
      type: [Number, null],
      default: null,
    },
    now: {
      type: Date,
      default: () => new Date(0),
    },
  },
  template:
    '<div class="timestamp-details" :data-iso="isoString" :data-utc="utcString" :data-date-value="String(dateValue)" :data-now="now.toISOString()" />',
})

const mountConverter = () =>
  mount(TimestampConverter, {
    global: {
      stubs: {
        TimestampInputSection: TimestampInputSectionStub,
        TimestampUnitSection: TimestampUnitSectionStub,
        TimestampDateSection: TimestampDateSectionStub,
        TimestampDetailsSection: TimestampDetailsSectionStub,
      },
    },
  })

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(fixedMs))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('TimestampConverter', () => {
  it('detects units and exposes computed props', async () => {
    const wrapper = mountConverter()

    const input = wrapper.find('.timestamp-input')
    expect(input.attributes('data-timestamp')).toBe(String(fixedMs))
    expect(input.attributes('data-valid')).toBe('true')

    const unitSection = wrapper.find('.timestamp-unit')
    expect(unitSection.attributes('data-unit')).toBe('auto')
    expect(unitSection.attributes('data-show-detected')).toBe('true')
    expect(unitSection.attributes('data-detected-unit')).toBe('milliseconds')
    expect(unitSection.attributes('data-digit-count')).toBe(String(String(fixedMs).length))

    const details = wrapper.find('.timestamp-details')
    expect(details.attributes('data-iso')).toBe(new Date(fixedMs).toISOString())
    expect(details.attributes('data-utc')).toBe(new Date(fixedMs).toUTCString())

    const inputStub = wrapper.findComponent(TimestampInputSectionStub)
    await inputStub.vm.$emit('update:timestamp', '1234567890')
    await nextTick()

    expect(unitSection.attributes('data-detected-unit')).toBe('seconds')
    expect(unitSection.attributes('data-digit-count')).toBe('10')
    expect(wrapper.find('.timestamp-date').attributes('data-date')).toBe('1234567890000')

    await inputStub.vm.$emit('update:timestamp', '1234567890123456')
    await nextTick()

    expect(unitSection.attributes('data-detected-unit')).toBe('nanoseconds')
    expect(unitSection.attributes('data-digit-count')).toBe('16')
    expect(wrapper.find('.timestamp-date').attributes('data-date')).toBe('1234567890')
  })

  it('converts timestamps on unit changes and handles set-now', async () => {
    const wrapper = mountConverter()
    const inputStub = wrapper.findComponent(TimestampInputSectionStub)
    const unitStub = wrapper.findComponent(TimestampUnitSectionStub)

    await unitStub.vm.$emit('update:unit', 'seconds')
    await nextTick()

    await inputStub.vm.$emit('update:timestamp', '10')
    await nextTick()

    await unitStub.vm.$emit('update:unit', 'nanoseconds')
    await nextTick()

    expect(wrapper.find('.timestamp-input').attributes('data-timestamp')).toBe('10000000000')
    expect(wrapper.find('.timestamp-date').attributes('data-date')).toBe('10000')

    await unitStub.vm.$emit('update:unit', 'seconds')
    await nextTick()

    await inputStub.vm.$emit('set-now')
    await nextTick()

    expect(wrapper.find('.timestamp-input').attributes('data-timestamp')).toBe(
      String(Math.floor(fixedMs / 1000)),
    )
  })

  it('hides details when the timestamp is invalid', async () => {
    const wrapper = mountConverter()
    const inputStub = wrapper.findComponent(TimestampInputSectionStub)

    await inputStub.vm.$emit('update:timestamp', '')
    await nextTick()

    expect(wrapper.find('.timestamp-details').exists()).toBe(false)
    expect(wrapper.find('.timestamp-input').attributes('data-valid')).toBe('false')
    expect(wrapper.find('.timestamp-unit').attributes('data-show-detected')).toBe('false')
    expect(wrapper.find('.timestamp-unit').attributes('data-digit-count')).toBe('0')
  })
})
