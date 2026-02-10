import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import TimeZoneConverterDetails from './TimeZoneConverterDetails.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const NDescriptions = defineComponent({
    name: 'NDescriptions',
    template: '<div class="n-descriptions"><slot /></div>',
  })

  const NDescriptionsItem = defineComponent({
    name: 'NDescriptionsItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    template: '<div class="desc-item"><span class="label">{{ label }}</span><slot /></div>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  return {
    NDescriptions,
    NDescriptionsItem,
    NFlex,
  }
})

const CopyToClipboardButtonStub = {
  name: 'CopyToClipboardButton',
  props: ['content'],
  template: '<button class="copy" :data-content="content" />',
}

describe('TimeZoneConverterDetails', () => {
  it('renders placeholders when values are empty', () => {
    const wrapper = mount(TimeZoneConverterDetails, {
      props: {
        isoString: '',
        utcString: '',
        unixMilliseconds: '',
        unixSeconds: '',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    expect(wrapper.text()).toContain('-')
    expect(wrapper.findAllComponents(CopyToClipboardButtonStub)).toHaveLength(0)
  })

  it('renders copy buttons for populated values', () => {
    const wrapper = mount(TimeZoneConverterDetails, {
      props: {
        isoString: '2024-01-01T00:00:00.000Z',
        utcString: 'Mon, 01 Jan 2024 00:00:00 GMT',
        unixMilliseconds: '1704067200000',
        unixSeconds: '1704067200',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    expect(wrapper.text()).toContain('iso-8601')
    expect(wrapper.findAllComponents(CopyToClipboardButtonStub)).toHaveLength(4)
  })
})
