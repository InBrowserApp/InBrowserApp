import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NInput, NInputNumber, NMessageProvider, NSelect } from 'naive-ui'
import NanoidGenerator from './NanoidGenerator.vue'
import { DEFAULT_NANOID_LENGTH, NANOID_MAX_COUNT, NANOID_MAX_LENGTH } from '../utils/nanoid'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(NanoidGenerator))
  },
}

describe('NanoidGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint8Array) => {
        for (let i = 0; i < buffer.length; i += 1) {
          buffer[i] = i
        }
        return buffer
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('generates NanoIDs with defaults', async () => {
    const wrapper = mount(TestWrapper)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value.trim()
    const lines = value.split('\n')

    expect(lines).toHaveLength(5)
    expect(lines[0]).toHaveLength(DEFAULT_NANOID_LENGTH)
  })

  it('generates NanoIDs with a custom alphabet', async () => {
    const wrapper = mount(TestWrapper)

    const select = wrapper.findComponent(NSelect)
    await select.vm.$emit('update:value', 'custom')
    await flushPromises()

    const inputNumbers = wrapper.findAllComponents(NInputNumber)
    const countInput = inputNumbers.find((input) => input.props('max') === NANOID_MAX_COUNT)
    const lengthInput = inputNumbers.find((input) => input.props('max') === NANOID_MAX_LENGTH)

    if (!countInput || !lengthInput) {
      throw new Error('Expected input numbers were not found')
    }

    await countInput.vm.$emit('update:value', 3)
    await lengthInput.vm.$emit('update:value', 8)

    const textInputs = wrapper.findAllComponents(NInput)
    const customAlphabetInput = textInputs.find(
      (input) => input.props('placeholder') === 'Enter custom alphabet...',
    )

    if (!customAlphabetInput) {
      throw new Error('Custom alphabet input was not found')
    }

    await customAlphabetInput.vm.$emit('update:value', 'abc')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value.trim()
    const lines = value.split('\n')

    expect(lines).toHaveLength(3)
    expect(lines[0]).toHaveLength(8)
    expect(lines[0]).toMatch(/^[abc]+$/)
  })

  it('shows an error for invalid custom alphabets', async () => {
    const wrapper = mount(TestWrapper)

    const select = wrapper.findComponent(NSelect)
    await select.vm.$emit('update:value', 'custom')
    await flushPromises()

    const textInputs = wrapper.findAllComponents(NInput)
    const customAlphabetInput = textInputs.find(
      (input) => input.props('placeholder') === 'Enter custom alphabet...',
    )

    if (!customAlphabetInput) {
      throw new Error('Custom alphabet input was not found')
    }

    await customAlphabetInput.vm.$emit('update:value', 'a')
    await flushPromises()

    expect(wrapper.text()).toContain('Alphabet must contain at least 2 unique characters')

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('')
  })

  it('rejects duplicate characters in custom alphabets', async () => {
    const wrapper = mount(TestWrapper)

    const select = wrapper.findComponent(NSelect)
    await select.vm.$emit('update:value', 'custom')
    await flushPromises()

    const textInputs = wrapper.findAllComponents(NInput)
    const customAlphabetInput = textInputs.find(
      (input) => input.props('placeholder') === 'Enter custom alphabet...',
    )

    if (!customAlphabetInput) {
      throw new Error('Custom alphabet input was not found')
    }

    await customAlphabetInput.vm.$emit('update:value', 'aab')
    await flushPromises()

    expect(wrapper.text()).toContain('Alphabet must not contain duplicate characters')

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('')
  })

  it('normalizes invalid stored values', async () => {
    localStorage.setItem('tools:nanoid-generator:count', 'NaN')
    localStorage.setItem('tools:nanoid-generator:length', 'NaN')

    const wrapper = mount(TestWrapper)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value.trim()
    const lines = value.split('\\n')

    expect(lines).toHaveLength(1)
    expect(lines[0]).toHaveLength(DEFAULT_NANOID_LENGTH)
  })
})
