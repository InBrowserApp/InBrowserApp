import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import XmlFormatter from './XmlFormatter.vue'

const fileOpenMock = vi.fn()
const objectUrlState = { value: 'available' as 'available' | 'missing' }

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        if (objectUrlState.value === 'missing') {
          return null
        }

        const value = isRef(source) ? source.value : source
        return value ? 'blob:download' : null
      }),
  }
})

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const ToolbarStub = defineComponent({
  name: 'XmlFormatterToolbar',
  props: [
    'collapseContent',
    'downloadFileName',
    'downloadUrl',
    'errorColumn',
    'errorLine',
    'forceSelfClosingEmptyTag',
    'hasInvalidXml',
    'hasValidXml',
    'outputXml',
    'selectedIndentation',
    'selectedLineEnding',
    'selectedMode',
  ],
  template: '<div class="toolbar" />',
})

const PanelsStub = defineComponent({
  name: 'XmlFormatterPanels',
  props: [
    'errorColumn',
    'errorContext',
    'errorLine',
    'errorMessage',
    'isInvalid',
    'outputXml',
    'sourceXml',
  ],
  template: '<div class="panels" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsXmlFormatter',
  template: '<div class="what-is" />',
})

const mountWrapper = () =>
  mount(XmlFormatter, {
    global: {
      stubs: {
        XmlFormatterToolbar: ToolbarStub,
        XmlFormatterPanels: PanelsStub,
        WhatIsXmlFormatter: WhatIsStub,
      },
    },
  })

describe('XmlFormatter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlState.value = 'available'
  })

  it('passes formatted xml to the panels by default', () => {
    const wrapper = mountWrapper()
    const panels = wrapper.findComponent(PanelsStub)

    expect(panels.props('outputXml')).toContain("<title>XML Developer's Guide</title>")
    expect(panels.props('outputXml')).toContain('<catalog>')
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('switches to minified output when the toolbar mode changes', async () => {
    const wrapper = mountWrapper()
    const toolbar = wrapper.findComponent(ToolbarStub)

    await toolbar.vm.$emit('update:selected-mode', 'minified')
    await flushPromises()

    expect(toolbar.props('downloadFileName')).toBe('minified.xml')
    expect(wrapper.findComponent(PanelsStub).props('outputXml')).toContain(
      '<catalog><!-- Featured book --><book id="bk101">',
    )
  })

  it('applies toolbar option updates to formatting state', async () => {
    const wrapper = mountWrapper()
    const toolbar = wrapper.findComponent(ToolbarStub)

    await toolbar.vm.$emit('update:selected-indentation', 'tab')
    await toolbar.vm.$emit('update:selected-line-ending', 'crlf')
    await toolbar.vm.$emit('update:collapse-content', false)
    await toolbar.vm.$emit('update:force-self-closing-empty-tag', true)
    await flushPromises()

    expect(wrapper.findComponent(ToolbarStub).props('selectedIndentation')).toBe('tab')
    expect(wrapper.findComponent(ToolbarStub).props('selectedLineEnding')).toBe('crlf')
    expect(wrapper.findComponent(ToolbarStub).props('collapseContent')).toBe(false)
    expect(wrapper.findComponent(ToolbarStub).props('forceSelfClosingEmptyTag')).toBe(true)
    expect(wrapper.findComponent(PanelsStub).props('outputXml')).toContain('\r\n')
    expect(wrapper.findComponent(PanelsStub).props('outputXml')).toContain('<empty/>')
  })

  it('surfaces invalid xml state and error details', async () => {
    const wrapper = mountWrapper()
    const panels = wrapper.findComponent(PanelsStub)

    await panels.vm.$emit('update:source-xml', '<root><item></root>')
    await flushPromises()

    const toolbar = wrapper.findComponent(ToolbarStub)
    expect(toolbar.props('hasInvalidXml')).toBe(true)
    expect(panels.props('isInvalid')).toBe(true)
    expect(panels.props('errorLine')).toBe(1)
    expect(String(panels.props('errorMessage'))).toContain("Expected closing tag 'item'")
  })

  it('imports xml from a file', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '<root><imported /></root>',
    })

    const wrapper = mountWrapper()
    const toolbar = wrapper.findComponent(ToolbarStub)

    await toolbar.vm.$emit('import')
    await flushPromises()

    expect(wrapper.findComponent(PanelsStub).props('sourceXml')).toBe('<root><imported /></root>')
  })

  it('ignores file picker cancellation errors', async () => {
    fileOpenMock.mockRejectedValue(new Error('cancelled'))

    const wrapper = mountWrapper()
    const toolbar = wrapper.findComponent(ToolbarStub)
    const before = wrapper.findComponent(PanelsStub).props('sourceXml')

    await toolbar.vm.$emit('import')
    await flushPromises()

    expect(wrapper.findComponent(PanelsStub).props('sourceXml')).toBe(before)
  })

  it('clears the input and restores the example', async () => {
    const wrapper = mountWrapper()
    const toolbar = wrapper.findComponent(ToolbarStub)

    await toolbar.vm.$emit('clear')
    await flushPromises()
    expect(wrapper.findComponent(PanelsStub).props('sourceXml')).toBe('')
    expect(wrapper.findComponent(PanelsStub).props('outputXml')).toBe('')

    await toolbar.vm.$emit('use-example')
    await flushPromises()
    expect(String(wrapper.findComponent(PanelsStub).props('sourceXml'))).toContain(
      "XML Developer's Guide",
    )
  })

  it('passes through a missing object url when download urls are unavailable', () => {
    objectUrlState.value = 'missing'

    const wrapper = mountWrapper()
    expect(wrapper.findComponent(ToolbarStub).props('downloadUrl')).toBeUndefined()
  })
})
