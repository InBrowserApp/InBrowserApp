import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider, NSwitch } from 'naive-ui'
import Papa from 'papaparse'
import JsonToCsvConverter from './JsonToCsvConverter.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonToCsvConverter))
  },
}

const getCsvText = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('JsonToCsvConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
  })

  it('renders CSV for the default JSON', () => {
    const wrapper = mount(TestWrapper)
    const csvText = getCsvText(wrapper)
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    })

    expect(parsed.data).toHaveLength(2)
    expect(parsed.data[0]).toMatchObject({ a: '1', b: '2' })
    expect(parsed.data[1]).toMatchObject({ a: '3', b: '4' })
  })

  it('shows an error when JSON is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{')
    await flushPromises()

    expect(getCsvText(wrapper)).toContain('// Invalid JSON')
  })

  it('updates CSV when delimiter or header settings change', async () => {
    const wrapper = mount(TestWrapper)
    const settingsButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Settings'))

    expect(settingsButton).toBeTruthy()
    await settingsButton!.trigger('click')
    await flushPromises()

    const inputs = wrapper.findAll('input')
    const delimiterInput = inputs.find((input) => input.attributes('placeholder') === ',')
    if (!delimiterInput) {
      throw new Error('Delimiter input not found')
    }
    await delimiterInput.setValue(';')

    const quoteInput = inputs.find((input) => input.attributes('placeholder') === '"')
    if (!quoteInput) {
      throw new Error('Quote input not found')
    }
    await quoteInput.setValue("'")

    const switches = wrapper.findAllComponents(NSwitch)
    const headerSwitch = switches[0]
    if (!headerSwitch) {
      throw new Error('Header switch not found')
    }
    await headerSwitch.vm.$emit('update:value', false)

    const escapeSwitch = switches[1]
    if (!escapeSwitch) {
      throw new Error('Escape switch not found')
    }
    await escapeSwitch.vm.$emit('update:value', false)
    await flushPromises()

    const csvText = getCsvText(wrapper)
    expect(csvText).toContain(';')
    expect(csvText).toContain("'")
    expect(csvText).not.toContain('a')
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '[{"a":10,"b":20}]',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('[{"a":10,"b":20}]')
    expect(getCsvText(wrapper)).toContain('10')
  })
})
