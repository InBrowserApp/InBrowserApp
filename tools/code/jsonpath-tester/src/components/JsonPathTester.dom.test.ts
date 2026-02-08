import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider, NSelect, NTabs } from 'naive-ui'
import JsonPathTester from './JsonPathTester.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonPathTester))
  },
}

const getTextarea = (wrapper: ReturnType<typeof mount>, index: number) => {
  const textareas = wrapper.findAll('textarea')
  const textarea = textareas[index]

  if (!textarea) {
    throw new Error(`Textarea at index ${index} not found`)
  }

  return textarea
}

const getOutputCode = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('JsonPathTester', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    localStorage.clear()
  })

  it('renders default JSONPath results', () => {
    const wrapper = mount(TestWrapper)
    const code = getOutputCode(wrapper)

    expect(code).toContain('Nigel Rees')
    expect(code).toContain('Evelyn Waugh')
  })

  it('shows an error when JSON is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const jsonInput = getTextarea(wrapper, 0)

    await jsonInput.setValue('{')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JSON')
  })

  it('handles non-Error JSON parse failures', async () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, 'parse')
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === '__boom__') {
          throw 'boom'
        }

        return originalParse(...args)
      })

    const wrapper = mount(TestWrapper)
    const jsonInput = getTextarea(wrapper, 0)

    await jsonInput.setValue('__boom__')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JSON: boom')

    parseSpy.mockRestore()
  })

  it('shows an error when JSONPath is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = getTextarea(wrapper, 1)

    await queryInput.setValue('$.store.book[?(@.price < )]')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JSONPath')
  })

  it('switches to paths output', async () => {
    const wrapper = mount(TestWrapper)
    const tabs = wrapper.findComponent(NTabs)

    await tabs.vm.$emit('update:value', 'paths')
    await flushPromises()

    const code = getOutputCode(wrapper)
    expect(code).toContain('store')
    expect(code).not.toContain('Nigel Rees')
  })

  it('updates the query from an example selection', async () => {
    const wrapper = mount(TestWrapper)
    const select = wrapper.findComponent(NSelect)

    await select.vm.$emit('update:value', '$.store.bicycle.color')
    await flushPromises()

    const queryInput = getTextarea(wrapper, 1)
    expect((queryInput.element as HTMLTextAreaElement).value).toBe('$.store.bicycle.color')
  })

  it('ignores empty example selections', async () => {
    const wrapper = mount(TestWrapper)
    const select = wrapper.findComponent(NSelect)

    await select.vm.$emit('update:value', null)
    await flushPromises()

    expect(wrapper.text()).toContain('JSONPath Query')
  })

  it('formats JSON when requested', async () => {
    const wrapper = mount(TestWrapper)
    const jsonInput = getTextarea(wrapper, 0)
    const formatButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Format JSON'))

    if (!formatButton) {
      throw new Error('Format JSON button not found')
    }

    await jsonInput.setValue('{"a":1}')
    await formatButton.trigger('click')

    expect((jsonInput.element as HTMLTextAreaElement).value).toContain('\n')
  })

  it('does not format invalid JSON', async () => {
    const wrapper = mount(TestWrapper)
    const jsonInput = getTextarea(wrapper, 0)
    const formatButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Format JSON'))

    if (!formatButton) {
      throw new Error('Format JSON button not found')
    }

    await jsonInput.setValue('{')
    await formatButton.trigger('click')

    expect((jsonInput.element as HTMLTextAreaElement).value).toBe('{')
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '{"name":"demo"}',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    if (!importButton) {
      throw new Error('Import button not found')
    }

    await importButton.trigger('click')
    await flushPromises()

    const jsonInput = getTextarea(wrapper, 0)
    expect((jsonInput.element as HTMLTextAreaElement).value).toBe('{"name":"demo"}')
  })

  it('ignores canceled file selection', async () => {
    fileOpenMock.mockRejectedValue(new Error('cancel'))

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    if (!importButton) {
      throw new Error('Import button not found')
    }

    const initialValue = (getTextarea(wrapper, 0).element as HTMLTextAreaElement).value

    await importButton.trigger('click')
    await flushPromises()

    const jsonInput = getTextarea(wrapper, 0)
    expect((jsonInput.element as HTMLTextAreaElement).value).toBe(initialValue)
  })

  it('shows the empty state when JSON input is cleared', async () => {
    const wrapper = mount(TestWrapper)
    const jsonInput = getTextarea(wrapper, 0)

    await jsonInput.setValue('  ')
    await flushPromises()

    expect(wrapper.text()).toContain('Enter JSON and a JSONPath query to see results')
    expect(wrapper.text()).not.toContain('Invalid JSON')
  })

  it('treats a whitespace query as empty', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = getTextarea(wrapper, 1)

    await queryInput.setValue('   ')
    await flushPromises()

    expect(wrapper.text()).toContain('Enter JSON and a JSONPath query to see results')
    expect(wrapper.text()).not.toContain('Invalid JSONPath')
  })
})
