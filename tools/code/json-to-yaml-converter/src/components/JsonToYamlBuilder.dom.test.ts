import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider } from 'naive-ui'
import JsonToYamlBuilder from './JsonToYamlBuilder.vue'

const fileOpenMock = vi.fn()
let objectUrlValue: string | undefined = 'blob:mock'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref(objectUrlValue),
  }
})

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonToYamlBuilder))
  },
}

const getRenderedYaml = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('JsonToYamlBuilder', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlValue = 'blob:mock'
  })

  it('renders YAML from the default JSON', () => {
    const wrapper = mount(TestWrapper)
    const renderedYaml = getRenderedYaml(wrapper)

    expect(renderedYaml).toContain('hello: world')
    expect(renderedYaml).toContain('items:')
    expect(renderedYaml).toContain('nested:')
  })

  it('shows an error when the input is invalid JSON or YAML', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{')
    await flushPromises()

    expect(getRenderedYaml(wrapper)).toMatch(/^# Invalid JSON or YAML/)
  })

  it('accepts YAML input and re-renders it', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('hello: world\nitems:\n  - 1')
    await flushPromises()

    const renderedYaml = getRenderedYaml(wrapper)
    expect(renderedYaml).toContain('hello: world')
    expect(renderedYaml).toContain('items:')
  })

  it('omits download href when object URL is unavailable', async () => {
    objectUrlValue = undefined
    const wrapper = mount(TestWrapper)
    await flushPromises()

    const downloadLink = wrapper.find('a[download="converted.yaml"]')
    expect(downloadLink.attributes('href')).toBeUndefined()
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '{"name":"demo"}',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('{"name":"demo"}')
    expect(getRenderedYaml(wrapper)).toContain('name: demo')
  })
})
