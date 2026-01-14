import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider, NSwitch } from 'naive-ui'
import CsvToJsonConverter from './CsvToJsonConverter.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const storageKeys = [
  'csv2json:csvText',
  'csv2json:spaces',
  'csv2json:showSettings',
  'csv2json:noheader',
  'csv2json:trim',
  'csv2json:checkType',
  'csv2json:headersText',
  'csv2json:delimiter',
  'csv2json:quote',
  'csv2json:includeColumns',
  'csv2json:ignoreColumns',
  'csv2json:skipEmpty',
  'csv2json:escapeChar',
  'csv2json:newline',
  'csv2json:preview',
  'csv2json:comments',
  'csv2json:fastMode',
  'csv2json:skipFirstNLines',
  'csv2json:delimitersToGuess',
]

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(CsvToJsonConverter))
  },
}

const getRenderedJson = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('CsvToJsonConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    storageKeys.forEach((key) => localStorage.removeItem(key))
  })

  it('renders JSON for the default CSV', () => {
    const wrapper = mount(TestWrapper)
    const parsed = JSON.parse(getRenderedJson(wrapper)) as Array<Record<string, string>>

    expect(parsed).toHaveLength(2)
    expect(parsed[0]).toMatchObject({ a: '1', b: '2', c: '3' })
    expect(parsed[1]).toMatchObject({ a: '4', b: '5', c: '6' })
  })

  it('shows an error when include regex is invalid', async () => {
    localStorage.setItem('csv2json:includeColumns', '[')

    const wrapper = mount(TestWrapper)
    await flushPromises()

    expect(getRenderedJson(wrapper)).toContain('Invalid CSV')
  })

  it('uses custom headers when no-header is enabled', async () => {
    const wrapper = mount(TestWrapper)
    const settingsButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Settings'))

    expect(settingsButton).toBeTruthy()

    await settingsButton!.trigger('click')
    await flushPromises()

    const headerInput = wrapper.find('input[placeholder="name,age,email"]')
    await headerInput.setValue('name,age')

    const delimiterInput = wrapper.find('input[placeholder=","]')
    await delimiterInput.setValue(';')

    const switches = wrapper.findAllComponents(NSwitch)
    const noHeaderSwitch = switches[0]
    if (!noHeaderSwitch) {
      throw new Error('No header switch not found')
    }

    await noHeaderSwitch.vm.$emit('update:value', true)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('1;2\n3;4')
    await flushPromises()

    const parsed = JSON.parse(getRenderedJson(wrapper)) as Array<Record<string, string>>
    expect(parsed).toHaveLength(2)
    expect(parsed[0]).toMatchObject({ name: '1', age: '2' })
    expect(parsed[1]).toMatchObject({ name: '3', age: '4' })
  })

  it('imports CSV from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => 'name,age\nJane,30',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('name,age\nJane,30')

    const parsed = JSON.parse(getRenderedJson(wrapper)) as Array<Record<string, string>>
    expect(parsed[0]).toMatchObject({ name: 'Jane', age: '30' })
  })
})
