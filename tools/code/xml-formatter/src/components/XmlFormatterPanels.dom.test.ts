import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { NCode } from 'naive-ui'
import XmlFormatterPanels from './XmlFormatterPanels.vue'

describe('XmlFormatterPanels', () => {
  it('emits source updates and shows formatted output', async () => {
    const wrapper = mount(XmlFormatterPanels, {
      props: {
        errorColumn: undefined,
        errorContext: '',
        errorLine: undefined,
        errorMessage: '',
        isInvalid: false,
        outputXml: '<root/>',
        sourceXml: '<root/>',
      },
    })

    await wrapper.find('textarea').setValue('<root><item /></root>')

    expect(wrapper.emitted('update:source-xml')?.[0]).toEqual(['<root><item /></root>'])
    expect((wrapper.findComponent(NCode).props('code') as string) ?? '').toBe('<root/>')
  })

  it('shows invalid xml details and localized line information', () => {
    const wrapper = mount(XmlFormatterPanels, {
      props: {
        errorColumn: 7,
        errorContext: '1 | <root>\n  |       ^',
        errorLine: 1,
        errorMessage: 'Unexpected closing tag.',
        isInvalid: true,
        outputXml: '',
        sourceXml: '<root>',
      },
    })

    expect(wrapper.text()).toContain('Invalid XML')
    expect(wrapper.text()).toContain('Line 1, column 7')
    expect(wrapper.text()).toContain('Unexpected closing tag.')
    expect(wrapper.text()).toContain('Error context')
  })

  it('shows an empty state when there is no output yet', () => {
    const wrapper = mount(XmlFormatterPanels, {
      props: {
        errorColumn: undefined,
        errorContext: '',
        errorLine: undefined,
        errorMessage: '',
        isInvalid: false,
        outputXml: '',
        sourceXml: '',
      },
    })

    expect(wrapper.text()).toContain('Formatted or minified XML will appear here')
  })

  it('handles missing error coordinates without rendering a line label', () => {
    const wrapper = mount(XmlFormatterPanels, {
      props: {
        errorColumn: undefined,
        errorContext: '1 | <root>',
        errorLine: undefined,
        errorMessage: 'Unexpected closing tag.',
        isInvalid: true,
        outputXml: '',
        sourceXml: '<root>',
      },
    })

    expect(wrapper.text()).toContain('Unexpected closing tag.')
    expect(wrapper.text()).not.toContain('Line ')
  })
})
