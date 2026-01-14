import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider, NSwitch } from 'naive-ui'
import XmlToJsonConverter from './XmlToJsonConverter.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(XmlToJsonConverter))
  },
}

const getRenderedJson = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('XmlToJsonConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
  })

  it('renders JSON for the default XML', () => {
    const wrapper = mount(TestWrapper)
    const renderedJson = getRenderedJson(wrapper)

    expect(renderedJson).toContain('"note"')
    expect(renderedJson).toContain('"title"')
    expect(renderedJson).toContain('"Happy"')
    expect(renderedJson).toContain('"importance"')
  })

  it('shows an error when XML is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('<note><title></note>')
    await flushPromises()

    expect(getRenderedJson(wrapper)).toContain('// Invalid XML')
  })

  it('updates output when ignore attributes is enabled', async () => {
    const wrapper = mount(TestWrapper)
    const switches = wrapper.findAllComponents(NSwitch)
    const ignoreAttributesSwitch = switches[3]

    if (!ignoreAttributesSwitch) {
      throw new Error('Ignore attributes switch not found')
    }

    await ignoreAttributesSwitch.vm.$emit('update:value', true)
    await flushPromises()

    const renderedJson = getRenderedJson(wrapper)
    expect(renderedJson).not.toContain('"importance"')
    expect(renderedJson).not.toContain('"logged"')
  })

  it('imports XML from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '<note><title>Demo</title></note>',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('<note><title>Demo</title></note>')
    expect(getRenderedJson(wrapper)).toContain('"Demo"')
  })
})
