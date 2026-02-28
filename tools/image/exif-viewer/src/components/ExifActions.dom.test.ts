import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ExifActions from './ExifActions.vue'

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: { content: { type: String, required: true } },
  template: '<div class="copy" :data-content="content"><slot /></div>',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="tool-section"><slot /></section>',
})

const NFlexStub = defineComponent({
  name: 'NFlex',
  template: '<div class="n-flex"><slot /></div>',
})

describe('ExifActions', () => {
  it('formats exif data as JSON for copying', () => {
    const date = new Date('2023-01-01T00:00:00.000Z')
    const dateWithCustomJson = date as unknown as { toJSON: () => unknown }
    dateWithCustomJson.toJSON = () => date
    const binary = new ArrayBuffer(4)

    const wrapper = mount(ExifActions, {
      props: {
        exifData: {
          createdAt: date,
          payload: binary,
          camera: 'Canon',
        },
      },
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          ToolSection: ToolSectionStub,
          NFlex: NFlexStub,
        },
      },
    })

    const button = wrapper.findComponent(CopyToClipboardButtonStub)
    const content = button.props('content')

    expect(content).toContain('2023-01-01T00:00:00.000Z')
    expect(content).toContain('[Binary data: 4 bytes]')
    expect(content).toContain('Canon')
  })

  it('formats zero-length typed arrays as binary payloads', () => {
    const wrapper = mount(ExifActions, {
      props: {
        exifData: {
          payload: new Uint8Array(),
        },
      },
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          ToolSection: ToolSectionStub,
          NFlex: NFlexStub,
        },
      },
    })

    const button = wrapper.findComponent(CopyToClipboardButtonStub)
    expect(button.props('content')).toContain('[Binary data: 0 bytes]')
  })
})
