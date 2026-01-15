import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider } from 'naive-ui'
import JsonToTomlConverter from './JsonToTomlConverter.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonToTomlConverter))
  },
}

const getRenderedToml = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('JsonToTomlConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
  })

  it('renders TOML from the default JSON', () => {
    const wrapper = mount(TestWrapper)
    const renderedToml = getRenderedToml(wrapper)

    expect(renderedToml).toContain('title = "TOML Example"')
    expect(renderedToml).toContain('[owner]')
    expect(renderedToml).toContain('name = "Tom Preston-Werner"')
    expect(renderedToml).toMatch(/ports = \[\s*8001, 8001, 8002\s*\]/)
    expect(renderedToml).toContain('enabled = true')
  })

  it('shows an error when JSON is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{')
    await flushPromises()

    expect(getRenderedToml(wrapper)).toMatch(/^# Invalid JSON/)
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '{"project":"demo"}',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('{"project":"demo"}')
    expect(getRenderedToml(wrapper)).toContain('project = "demo"')
  })
})
