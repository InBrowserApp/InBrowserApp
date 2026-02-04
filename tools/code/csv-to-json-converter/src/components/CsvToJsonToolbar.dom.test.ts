import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CsvToJsonToolbar from './CsvToJsonToolbar.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    name: 'ToolSection',
    template: '<section class="tool-section"><slot /></section>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button class="copy">{{ content }}</button>',
  },
}))

describe('CsvToJsonToolbar', () => {
  it('emits import and toggles settings with a download url', async () => {
    const onUpdateShowSettings = vi.fn()

    const wrapper = mount(CsvToJsonToolbar, {
      props: {
        renderedJson: '{"a":1}',
        downloadUrl: 'blob:example',
        showSettings: false,
        'onUpdate:showSettings': onUpdateShowSettings,
      },
    })

    const buttons = wrapper.findAll('button')
    const importButton = buttons.find((button) => button.text().includes('Import'))
    const settingsButton = buttons.find((button) => button.text().includes('Settings'))
    if (!importButton || !settingsButton) {
      throw new Error('Toolbar buttons not found')
    }

    await importButton.trigger('click')
    await settingsButton.trigger('click')

    expect(wrapper.emitted('import')).toBeTruthy()
    expect(onUpdateShowSettings).toHaveBeenCalledWith(true)

    const link = wrapper.find('a[download="converted.json"]')
    expect(link.attributes('href')).toBe('blob:example')
  })

  it('omits download href when url is missing', () => {
    const wrapper = mount(CsvToJsonToolbar, {
      props: {
        renderedJson: '{"a":1}',
        showSettings: false,
      },
    })

    const link = wrapper.find('a[download="converted.json"]')
    expect(link.attributes('href')).toBeUndefined()
  })
})
