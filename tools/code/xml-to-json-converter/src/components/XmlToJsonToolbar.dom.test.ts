import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import XmlToJsonToolbar from './XmlToJsonToolbar.vue'

describe('XmlToJsonToolbar', () => {
  it('emits import and keeps download link when url exists', async () => {
    const wrapper = mount(XmlToJsonToolbar, {
      props: {
        renderedJson: '{"ok":true}',
        downloadUrl: 'blob:json',
      },
      global: {
        stubs: {
          CopyToClipboardButton: {
            name: 'CopyToClipboardButton',
            props: ['content'],
            template: '<button data-testid="copy" :data-content="content" />',
          },
        },
      },
    })

    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')

    expect(wrapper.emitted('import')).toHaveLength(1)

    const download = wrapper.get('a')
    expect(download.attributes('href')).toBe('blob:json')
    expect(download.attributes('download')).toBe('converted.json')
  })

  it('uses undefined href when download url is missing', () => {
    const wrapper = mount(XmlToJsonToolbar, {
      props: {
        renderedJson: '{"ok":true}',
        downloadUrl: null,
      },
      global: {
        stubs: {
          CopyToClipboardButton: {
            name: 'CopyToClipboardButton',
            props: ['content'],
            template: '<button data-testid="copy" :data-content="content" />',
          },
        },
      },
    })

    const download = wrapper.get('a')
    expect(download.attributes('href')).toBeUndefined()
    expect(download.attributes('disabled')).toBeDefined()
  })
})
