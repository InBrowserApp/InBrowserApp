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
    const jsonInput = wrapper.findAll('textarea')[0]

    await jsonInput.setValue('{')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JSON')
  })

  it('shows an error when JSONPath is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = wrapper.findAll('textarea')[1]

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

    const queryInput = wrapper.findAll('textarea')[1]
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
    const jsonInput = wrapper.findAll('textarea')[0]
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
    const jsonInput = wrapper.findAll('textarea')[0]
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

    const jsonInput = wrapper.findAll('textarea')[0]
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

    const initialValue = (wrapper.findAll('textarea')[0].element as HTMLTextAreaElement).value

    await importButton.trigger('click')
    await flushPromises()

    const jsonInput = wrapper.findAll('textarea')[0]
    expect((jsonInput.element as HTMLTextAreaElement).value).toBe(initialValue)
  })
})
