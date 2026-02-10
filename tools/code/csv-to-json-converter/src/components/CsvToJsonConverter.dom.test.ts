import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider, NSwitch } from 'naive-ui'
import CsvToJsonConverter from './CsvToJsonConverter.vue'
import CsvToJsonSettingsAdvanced from './CsvToJsonSettingsAdvanced.vue'
import CsvToJsonSettingsBasics from './CsvToJsonSettingsBasics.vue'

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

const mountWrapper = () => mount(TestWrapper)

const getRenderedJson = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

const parseRenderedJson = (wrapper: ReturnType<typeof mount>) =>
  JSON.parse(getRenderedJson(wrapper)) as Array<Record<string, unknown>>

describe('CsvToJsonConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    storageKeys.forEach((key) => localStorage.removeItem(key))
  })

  it('renders JSON for the default CSV', () => {
    const wrapper = mountWrapper()
    const parsed = parseRenderedJson(wrapper) as Array<Record<string, string>>

    expect(parsed).toHaveLength(2)
    expect(parsed[0]).toMatchObject({ a: '1', b: '2', c: '3' })
    expect(parsed[1]).toMatchObject({ a: '4', b: '5', c: '6' })
  })

  it('shows an error when include regex is invalid', async () => {
    localStorage.setItem('csv2json:includeColumns', '[')

    const wrapper = mountWrapper()
    await flushPromises()

    expect(getRenderedJson(wrapper)).toContain('Invalid CSV')
  })

  it('uses custom headers when no-header is enabled', async () => {
    const wrapper = mountWrapper()
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

    const parsed = parseRenderedJson(wrapper) as Array<Record<string, string>>
    expect(parsed).toHaveLength(2)
    expect(parsed[0]).toMatchObject({ name: '1', age: '2' })
    expect(parsed[1]).toMatchObject({ name: '3', age: '4' })
  })

  it('renders persisted settings panels when enabled', () => {
    localStorage.setItem('csv2json:showSettings', 'true')

    const wrapper = mountWrapper()
    expect(wrapper.findComponent(CsvToJsonSettingsBasics).exists()).toBe(true)
    expect(wrapper.findComponent(CsvToJsonSettingsAdvanced).exists()).toBe(true)
  })

  it('filters columns using include and ignore patterns', () => {
    localStorage.setItem('csv2json:includeColumns', 'name|age')
    localStorage.setItem('csv2json:ignoreColumns', 'age')
    localStorage.setItem('csv2json:csvText', 'name,age,city\nJane,30,NY\nBob,40,SF')

    const wrapper = mountWrapper()
    const parsed = parseRenderedJson(wrapper) as Array<Record<string, string>>

    expect(parsed).toHaveLength(2)
    const first = parsed[0]
    if (!first) {
      throw new Error('Expected parsed row')
    }
    expect(Object.keys(first)).toEqual(['name'])
    expect(first).toMatchObject({ name: 'Jane' })
  })

  it('skips comments and empty lines when configured', () => {
    localStorage.setItem('csv2json:comments', '#')
    localStorage.setItem('csv2json:skipEmpty', 'greedy')
    localStorage.setItem('csv2json:csvText', 'name,age\n#skip,me\n\nJane,30\n\nBob,40\n')

    const wrapper = mountWrapper()
    const parsed = parseRenderedJson(wrapper) as Array<Record<string, string>>

    expect(parsed).toHaveLength(2)
    expect(parsed[0]).toMatchObject({ name: 'Jane' })
    expect(parsed[1]).toMatchObject({ name: 'Bob' })
  })

  it('honors preview, delimiter guessing, and skipped lines', () => {
    localStorage.setItem('csv2json:delimiter', 'auto')
    localStorage.setItem('csv2json:delimitersToGuess', '\\t,|,\\n')
    localStorage.setItem('csv2json:skipFirstNLines', '1')
    localStorage.setItem('csv2json:preview', '1')
    localStorage.setItem('csv2json:fastMode', 'true')
    localStorage.setItem('csv2json:csvText', 'skip,this\nname\tage\nJane\t30\nBob\t40')

    const wrapper = mountWrapper()
    const parsed = parseRenderedJson(wrapper) as Array<Record<string, string>>

    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toMatchObject({ name: 'Jane', age: '30' })
  })

  it('preserves whitespace when trim is disabled and checks types', () => {
    localStorage.setItem('csv2json:trim', 'false')
    localStorage.setItem('csv2json:checkType', 'true')
    localStorage.setItem('csv2json:csvText', ' name ,age\n Bob ,42')

    const wrapper = mountWrapper()
    const parsed = parseRenderedJson(wrapper) as Array<Record<string, unknown>>
    const row = parsed[0] ?? {}

    expect(Object.keys(row)).toContain(' name ')
    expect(row[' name ']).toBe(' Bob ')
    expect(row.age).toBe(42)
  })

  it('syncs settings updates from child components', async () => {
    localStorage.setItem('csv2json:showSettings', 'true')

    const wrapper = mountWrapper()
    await flushPromises()

    const basics = wrapper.findComponent(CsvToJsonSettingsBasics)
    const advanced = wrapper.findComponent(CsvToJsonSettingsAdvanced)
    expect(basics.exists()).toBe(true)
    expect(advanced.exists()).toBe(true)

    await basics.vm.$emit('update:quote', "'")
    await basics.vm.$emit('update:trim', false)
    await basics.vm.$emit('update:checkType', true)
    await basics.vm.$emit('update:skipEmpty', 'true')
    await basics.vm.$emit('update:escapeChar', '\\')
    await basics.vm.$emit('update:newline', '\n')

    await advanced.vm.$emit('update:preview', 1)
    await advanced.vm.$emit('update:comments', '#')
    await advanced.vm.$emit('update:fastMode', true)
    await advanced.vm.$emit('update:skipFirstNLines', 0)
    await advanced.vm.$emit('update:delimitersToGuessText', '\\t,|')
    await advanced.vm.$emit('update:includeColumns', 'a|b')
    await advanced.vm.$emit('update:ignoreColumns', 'b')
    await advanced.vm.$emit('update:spaces', 0)

    await flushPromises()

    expect(localStorage.getItem('csv2json:quote')).toBe("'")
    expect(localStorage.getItem('csv2json:trim')).toBe('false')
    expect(localStorage.getItem('csv2json:checkType')).toBe('true')
    expect(localStorage.getItem('csv2json:skipEmpty')).toBe('true')
    expect(localStorage.getItem('csv2json:escapeChar')).toBe('\\')
    expect(localStorage.getItem('csv2json:newline')).toBe('\n')
    expect(localStorage.getItem('csv2json:preview')).toBe('1')
    expect(localStorage.getItem('csv2json:comments')).toBe('#')
    expect(localStorage.getItem('csv2json:fastMode')).toBe('true')
    expect(localStorage.getItem('csv2json:skipFirstNLines')).toBe('0')
    expect(localStorage.getItem('csv2json:delimitersToGuess')).toBe('\\t,|')
    expect(localStorage.getItem('csv2json:includeColumns')).toBe('a|b')
    expect(localStorage.getItem('csv2json:ignoreColumns')).toBe('b')
    expect(localStorage.getItem('csv2json:spaces')).toBe('0')

    const parsed = parseRenderedJson(wrapper)
    expect(parsed).toHaveLength(1)
  })

  it('imports CSV from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => 'name,age\nJane,30',
    })

    const wrapper = mountWrapper()
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('name,age\nJane,30')

    const parsed = parseRenderedJson(wrapper) as Array<Record<string, string>>
    expect(parsed[0]).toMatchObject({ name: 'Jane', age: '30' })
  })
})
