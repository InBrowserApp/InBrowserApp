import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NDatePicker, NInputNumber, NMessageProvider, NRadioGroup } from 'naive-ui'
import KsuidGenerator from './KsuidGenerator.vue'
import { KSUID_EPOCH_SECONDS, KSUID_LENGTH, MAX_KSUID_TIMESTAMP } from '../utils/ksuid'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(KsuidGenerator))
  },
}

describe('KsuidGenerator', () => {
  const minUnixSeconds = KSUID_EPOCH_SECONDS
  const maxUnixSeconds = KSUID_EPOCH_SECONDS + MAX_KSUID_TIMESTAMP

  beforeEach(() => {
    localStorage.clear()
    let call = 0
    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint8Array) => {
        call += 1
        buffer.fill(call)
        return buffer
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('generates KSUIDs for a custom timestamp', async () => {
    const wrapper = mount(TestWrapper)

    const radioGroup = wrapper.findComponent(NRadioGroup)
    await radioGroup.vm.$emit('update:value', 'custom')
    await flushPromises()

    const datePicker = wrapper.findComponent(NDatePicker)
    await datePicker.vm.$emit('update:value', KSUID_EPOCH_SECONDS * 1000)

    const inputNumbers = wrapper.findAllComponents(NInputNumber)
    const countInput = inputNumbers.find((input) => input.props('min') === 1)
    const timestampInput = inputNumbers.find(
      (input) => input.props('min') === minUnixSeconds && input.props('max') === maxUnixSeconds,
    )

    if (!countInput || !timestampInput) {
      throw new Error('Expected input numbers were not found')
    }

    await countInput.vm.$emit('update:value', 2)
    await timestampInput.vm.$emit('update:value', KSUID_EPOCH_SECONDS)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value.trim()
    const lines = value.split('\n')

    expect(lines).toHaveLength(2)
    expect(lines[0]).toHaveLength(KSUID_LENGTH)
    expect(lines[1]).toHaveLength(KSUID_LENGTH)
    expect(lines[0]).not.toBe(lines[1])
    expect(wrapper.text()).toContain(String(KSUID_EPOCH_SECONDS))
  })

  it('shows an error for out-of-range timestamps', async () => {
    const wrapper = mount(TestWrapper)

    const radioGroup = wrapper.findComponent(NRadioGroup)
    await radioGroup.vm.$emit('update:value', 'custom')
    await flushPromises()

    const inputNumbers = wrapper.findAllComponents(NInputNumber)
    const timestampInput = inputNumbers.find(
      (input) => input.props('min') === minUnixSeconds && input.props('max') === maxUnixSeconds,
    )

    if (!timestampInput) {
      throw new Error('Timestamp input was not found')
    }

    await timestampInput.vm.$emit('update:value', KSUID_EPOCH_SECONDS - 1)
    await flushPromises()

    expect(wrapper.text()).toContain('Timestamp')

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('')
  })

  it('handles invalid timestamps and resets to now', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    localStorage.setItem('tools:ksuid-generator:timestamp-mode', 'custom')
    localStorage.setItem('tools:ksuid-generator:custom-unix-seconds', 'NaN')
    localStorage.setItem('tools:ksuid-generator:count', 'NaN')

    const wrapper = mount(TestWrapper)

    await flushPromises()

    expect(wrapper.text()).toContain('Invalid timestamp')

    const datePicker = wrapper.findComponent(NDatePicker)
    await datePicker.vm.$emit('update:value', null)

    const setNowButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Set to now'))

    expect(setNowButton).toBeTruthy()
    await setNowButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const lines = (textarea.element as HTMLTextAreaElement).value.split('\n')
    expect(lines[0]).toHaveLength(KSUID_LENGTH)
  })
})
