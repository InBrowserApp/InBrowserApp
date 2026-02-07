import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ExifCategorySection from './ExifCategorySection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NCollapseItem: defineComponent({
      name: 'NCollapseItem',
      props: { title: { type: String, default: '' }, name: { type: String, default: '' } },
      template: '<div class="collapse-item"><slot /></div>',
    }),
    NDescriptions: defineComponent({
      name: 'NDescriptions',
      template: '<div class="descriptions"><slot /></div>',
    }),
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      props: { label: { type: String, default: '' } },
      template: '<div class="description-item"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
  }
})

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: { content: { type: String, default: '' } },
  template: '<button class="copy">copy</button>',
})

describe('ExifCategorySection', () => {
  it('formats values for display', () => {
    const dateSpy = vi.spyOn(Date.prototype, 'toLocaleString').mockReturnValue('date-string')

    const wrapper = mount(ExifCategorySection, {
      props: {
        name: 'basic',
        title: 'Basic',
        data: {
          empty: null,
          intValue: 42,
          floatValue: 12.3,
          listValue: ['a', 'b'],
          objectValue: { foo: 'bar' },
          dateValue: new Date('2023-01-01T00:00:00Z'),
          binaryValue: new Uint8Array([1, 2, 3]),
          boolValue: true,
        },
      },
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    const text = wrapper.text()
    expect(text).toContain('-')
    expect(text).toContain('42')
    expect(text).toContain('12.3')
    expect(text).toContain('a, b')
    expect(text).toContain('{"foo":"bar"}')
    expect(text).toContain('date-string')
    expect(text).toContain('[Binary data: 3 bytes]')
    expect(text).toContain('true')

    dateSpy.mockRestore()
  })
})
