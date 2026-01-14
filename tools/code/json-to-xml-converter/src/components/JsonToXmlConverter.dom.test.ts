import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider, NSwitch } from 'naive-ui'
import JsonToXmlConverter from './JsonToXmlConverter.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonToXmlConverter))
  },
}

const getRenderedXml = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('JsonToXmlConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
  })

  it('renders XML from the default JSON', () => {
    const wrapper = mount(TestWrapper)
    const xml = getRenderedXml(wrapper)

    expect(xml).toContain('<name>Ali</name>')
    expect(xml).toContain('<age>30</age>')
  })

  it('shows an error for invalid JSON', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{')
    await flushPromises()

    expect(getRenderedXml(wrapper)).toContain('<!-- Invalid JSON -->')
  })

  it('toggles full tag output for empty elements', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{"empty":{}}')
    await flushPromises()

    expect(getRenderedXml(wrapper)).toMatch(/<empty\s*\/>/)

    const switches = wrapper.findAllComponents(NSwitch)
    const fullTagSwitch = switches[2]
    if (!fullTagSwitch) {
      throw new Error('Full tag switch not found')
    }
    await fullTagSwitch.vm.$emit('update:value', true)
    await flushPromises()

    expect(getRenderedXml(wrapper)).toContain('<empty></empty>')
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '{"name":{"_text":"Demo"}}',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('{"name":{"_text":"Demo"}}')
    expect(getRenderedXml(wrapper)).toContain('<name>Demo</name>')
  })
})
