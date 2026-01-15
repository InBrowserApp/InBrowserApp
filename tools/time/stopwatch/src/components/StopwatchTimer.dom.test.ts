import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import StopwatchTimer from './StopwatchTimer.vue'

const mountTimer = () => mount(StopwatchTimer)

const getElapsed = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-testid="elapsed"]').text()

const getTimerVm = (wrapper: ReturnType<typeof mount>) =>
  wrapper.vm as unknown as {
    start: () => void
    pause: () => void
    reset: () => void
    recordLap: () => void
  }

describe('StopwatchTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts, laps, pauses, and resets', async () => {
    const wrapper = mountTimer()
    const vm = getTimerVm(wrapper)

    expect(getElapsed(wrapper)).toBe('00:00:00.00')

    const start = wrapper.get('[data-testid="start"]')
    const pause = wrapper.get('[data-testid="pause"]')
    const lap = wrapper.get('[data-testid="lap"]')
    const reset = wrapper.get('[data-testid="reset"]')

    await start.trigger('click')
    vi.advanceTimersByTime(1234)
    await nextTick()

    expect(getElapsed(wrapper)).toBe('00:00:01.20')
    vm.start()
    await nextTick()

    await lap.trigger('click')
    await nextTick()

    expect(getElapsed(wrapper)).toBe('00:00:01.23')
    expect(wrapper.findAll('[data-testid="lap-row"]').length).toBe(1)
    expect(wrapper.get('[data-testid="laps-list"]').text()).toContain('00:00:01.23')

    await pause.trigger('click')
    vi.advanceTimersByTime(2000)
    await nextTick()

    expect(getElapsed(wrapper)).toBe('00:00:01.23')

    await reset.trigger('click')
    await nextTick()

    expect(getElapsed(wrapper)).toBe('00:00:00.00')
    expect(wrapper.find('[data-testid="lap-row"]').exists()).toBe(false)
  })

  it('resumes from a paused time', async () => {
    const wrapper = mountTimer()
    const start = wrapper.get('[data-testid="start"]')
    const pause = wrapper.get('[data-testid="pause"]')

    await start.trigger('click')
    vi.advanceTimersByTime(1500)
    await nextTick()

    await pause.trigger('click')
    vi.advanceTimersByTime(1000)
    await nextTick()

    await start.trigger('click')
    vi.advanceTimersByTime(500)
    await nextTick()

    expect(getElapsed(wrapper)).toBe('00:00:02.00')
  })

  it('ignores actions that are not allowed', async () => {
    const wrapper = mountTimer()
    const vm = getTimerVm(wrapper)
    const start = wrapper.get('[data-testid="start"]')
    const pause = wrapper.get('[data-testid="pause"]')
    const lap = wrapper.get('[data-testid="lap"]')

    vm.pause()
    vm.recordLap()
    await pause.trigger('click')
    await lap.trigger('click')
    await nextTick()

    expect(wrapper.find('[data-testid="lap-row"]').exists()).toBe(false)

    await start.trigger('click')
    await start.trigger('click')
    vi.advanceTimersByTime(200)
    await nextTick()

    expect(getElapsed(wrapper)).not.toBe('00:00:00.00')
  })
})
