import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider, NSelect } from 'naive-ui'
import JmesPathTester from './JmesPathTester.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JmesPathTester))
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

describe('JmesPathTester', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    localStorage.clear()
  })

  it('renders default JMESPath results', () => {
    const wrapper = mount(TestWrapper)
    const code = getOutputCode(wrapper)

    expect(code).toContain('Smith')
    expect(code).toContain('Jones')
  })

  it('shows an error when JSON is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const jsonInput = getTextarea(wrapper, 0)

    await jsonInput.setValue('{')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JSON')
  })

  it('shows an error when JMESPath is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = getTextarea(wrapper, 1)

    await queryInput.setValue('people[?')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JMESPath')
  })

  it('updates the query from an example selection', async () => {
    const wrapper = mount(TestWrapper)
    const select = wrapper.findComponent(NSelect)

    await select.vm.$emit('update:value', 'orders[?total > `20`].id')
    await flushPromises()

    const queryInput = getTextarea(wrapper, 1)
    expect((queryInput.element as HTMLTextAreaElement).value).toBe('orders[?total > `20`].id')
  })

  it('ignores empty example selections', async () => {
    const wrapper = mount(TestWrapper)
    const select = wrapper.findComponent(NSelect)

    await select.vm.$emit('update:value', null)
    await flushPromises()

    expect(wrapper.text()).toContain('JMESPath Expression')
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

  it('reports results for scalar outputs', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = getTextarea(wrapper, 1)

    await queryInput.setValue('active')
    await flushPromises()

    expect(wrapper.text()).toContain('Results: 1')
    expect(getOutputCode(wrapper)).toContain('true')
  })

  it('reports empty array results', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = getTextarea(wrapper, 1)

    await queryInput.setValue('people[?age > `100`].first')
    await flushPromises()

    expect(wrapper.text()).toContain('Results: 0')
    expect(wrapper.text()).toContain('No results found')
  })

  it('reports null results', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = getTextarea(wrapper, 1)

    await queryInput.setValue('missing')
    await flushPromises()

    expect(wrapper.text()).toContain('Results: 0')
    expect(getOutputCode(wrapper)).toContain('null')
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '{"active":false}',
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
    expect((jsonInput.element as HTMLTextAreaElement).value).toBe('{"active":false}')
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
})
