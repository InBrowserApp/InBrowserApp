import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import DurationCalculatorSection from './DurationCalculatorSection.vue'
import type { DurationParts } from '../utils/duration'
import { formatInTimeZone } from '../utils/timeZone'

type StorageSeed = {
  baseTimeZone: string
  baseInput: string
  durationIso: string
  durationParts: DurationParts
}

const defaultSeed: StorageSeed = {
  baseTimeZone: 'UTC',
  baseInput: '2024-01-02 03:04:05.006',
  durationIso: 'PT1H2M3.004S',
  durationParts: {
    days: 0,
    hours: 1,
    minutes: 2,
    seconds: 3,
    milliseconds: 4,
  },
}

const seedStorage = (overrides: Partial<StorageSeed> = {}) => {
  const seed: StorageSeed = {
    ...defaultSeed,
    ...overrides,
    durationParts: {
      ...defaultSeed.durationParts,
      ...overrides.durationParts,
    },
  }
  localStorage.setItem('tools:duration-calculator:base-timezone', seed.baseTimeZone)
  localStorage.setItem('tools:duration-calculator:base-input', seed.baseInput)
  localStorage.setItem('tools:duration-calculator:duration-iso', seed.durationIso)
  localStorage.setItem(
    'tools:duration-calculator:duration-parts',
    JSON.stringify(seed.durationParts),
  )
  return seed
}

const DurationCalculatorSectionWithProvider = {
  render() {
    return h(NMessageProvider, () => h(DurationCalculatorSection))
  },
}

const mountSection = () => mount(DurationCalculatorSectionWithProvider)

describe('DurationCalculatorSection', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('computes add/subtract results from stored inputs', async () => {
    const seed = seedStorage()
    const wrapper = mountSection()
    await flushPromises()

    const baseTimestamp = Date.UTC(2024, 0, 2, 3, 4, 5, 6)
    const durationMs = 1 * 3600 * 1000 + 2 * 60 * 1000 + 3 * 1000 + 4
    const addedTimestamp = baseTimestamp + durationMs
    const subtractedTimestamp = baseTimestamp - durationMs

    const codes = wrapper.findAll('code').map((node) => node.text())
    expect(codes).toEqual([
      formatInTimeZone(addedTimestamp, seed.baseTimeZone),
      new Date(addedTimestamp).toISOString(),
      String(addedTimestamp),
      String(Math.floor(addedTimestamp / 1000)),
      formatInTimeZone(subtractedTimestamp, seed.baseTimeZone),
      new Date(subtractedTimestamp).toISOString(),
      String(subtractedTimestamp),
      String(Math.floor(subtractedTimestamp / 1000)),
    ])

    expect(wrapper.text()).toContain('UTC+00:00')
  })

  it('syncs duration parts when ISO input changes', async () => {
    seedStorage()
    const wrapper = mountSection()
    await flushPromises()

    const sectionVm = wrapper.findComponent(DurationCalculatorSection).vm as unknown as {
      durationParts: DurationParts
      durationIsoInput: string
    }

    sectionVm.durationIsoInput = 'P2DT3H4M5.006S'
    await flushPromises()

    expect(sectionVm.durationParts).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      milliseconds: 6,
    })
  })

  it('normalizes duration parts and updates ISO input', async () => {
    seedStorage()
    const wrapper = mountSection()
    await flushPromises()

    const sectionVm = wrapper.findComponent(DurationCalculatorSection).vm as unknown as {
      durationParts: DurationParts
      durationIsoInput: string
    }

    sectionVm.durationParts = {
      days: 0,
      hours: 0,
      minutes: 90,
      seconds: 0,
      milliseconds: 0,
    }
    await flushPromises()

    expect(sectionVm.durationParts).toEqual({
      days: 0,
      hours: 1,
      minutes: 30,
      seconds: 0,
      milliseconds: 0,
    })
    expect(sectionVm.durationIsoInput).toBe('PT1H30M')
  })

  it('shows validation errors for invalid inputs', async () => {
    seedStorage()
    const wrapper = mountSection()
    await flushPromises()

    const sectionVm = wrapper.findComponent(DurationCalculatorSection).vm as unknown as {
      baseInput: string
      durationIsoInput: string
      durationIsoError: string
    }
    sectionVm.baseInput = 'invalid'
    sectionVm.durationIsoInput = 'P'
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid date/time')
    expect(sectionVm.durationIsoError).toBe('Invalid duration')
  })

  it('updates the base time when clicking now', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-02T00:00:00.123Z'))

    seedStorage({ baseInput: '2024-01-01 00:00:00.000' })
    const wrapper = mountSection()
    await flushPromises()

    const nowButton = wrapper.findAll('button').find((button) => button.text().trim() === 'Now')
    expect(nowButton).toBeTruthy()
    await nowButton?.trigger('click')
    await flushPromises()

    const baseInput = wrapper.find('input[placeholder="YYYY-MM-DD HH:mm:ss.SSS"]')
      .element as HTMLInputElement
    expect(baseInput.value).toBe('2024-01-02 00:00:00.123')
  })
})
