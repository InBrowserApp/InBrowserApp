import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NInputNumber, NMessageProvider } from 'naive-ui'
import Cuid2Generator from './Cuid2Generator.vue'
import {
  CUID2_DEFAULT_LENGTH,
  CUID2_MAX_COUNT,
  CUID2_MAX_LENGTH,
  isValidCuid2,
} from '../utils/cuid2'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(Cuid2Generator))
  },
}

describe('Cuid2Generator', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint32Array) => {
        buffer.fill(123456789)
        return buffer
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('generates CUID2 IDs with defaults', async () => {
    const wrapper = mount(TestWrapper)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value.trim()
    const lines = value.split('\n')

    expect(lines).toHaveLength(5)
    expect(lines[0]).toHaveLength(CUID2_DEFAULT_LENGTH)
    expect(isValidCuid2(lines[0] ?? '')).toBe(true)
  })

  it('generates CUID2 IDs with a custom length', async () => {
    const wrapper = mount(TestWrapper)

    const inputNumbers = wrapper.findAllComponents(NInputNumber)
    const countInput = inputNumbers.find((input) => input.props('max') === CUID2_MAX_COUNT)
    const lengthInput = inputNumbers.find((input) => input.props('max') === CUID2_MAX_LENGTH)

    if (!countInput || !lengthInput) {
      throw new Error('Expected input numbers were not found')
    }

    await countInput.vm.$emit('update:value', 3)
    await lengthInput.vm.$emit('update:value', 10)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value.trim()
    const lines = value.split('\n')

    expect(lines).toHaveLength(3)
    expect(lines[0]).toHaveLength(10)
    expect(isValidCuid2(lines[0] ?? '')).toBe(true)
  })

  it('normalizes invalid stored values', async () => {
    localStorage.setItem('tools:cuid2-generator:count', 'NaN')
    localStorage.setItem('tools:cuid2-generator:length', 'NaN')

    const wrapper = mount(TestWrapper)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value.trim()
    const lines = value.split('\n')

    expect(lines).toHaveLength(1)
    expect(lines[0]).toHaveLength(CUID2_DEFAULT_LENGTH)
  })
})
