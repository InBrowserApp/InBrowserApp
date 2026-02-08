import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: ['content'],
      template: '<button class="copy" :data-content="content" />',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      props: ['label'],
      template: '<div class="desc-item" :data-label="label"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="flex"><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      props: ['code'],
      template: '<span class="text"><slot /></span>',
    }),
  }
})

import IBANResultFormats from './IBANResultFormats.vue'

describe('IBANResultFormats', () => {
  it('shows formatted strings and copy buttons when raw values exist', () => {
    const wrapper = mount(IBANResultFormats, {
      props: {
        normalized: 'GB29NWBK60161331926819',
        normalizedRaw: 'GB29NWBK60161331926819',
        formatted: 'GB29 NWBK 6016 1331 9268 19',
        formattedRaw: null,
        bban: 'NWBK60161331926819',
        bbanRaw: 'NWBK60161331926819',
      },
    })

    expect(wrapper.text()).toContain('GB29NWBK60161331926819')
    expect(wrapper.text()).toContain('GB29 NWBK 6016 1331 9268 19')
    expect(wrapper.text()).toContain('NWBK60161331926819')

    const copies = wrapper.findAll('.copy')
    expect(copies).toHaveLength(2)
    expect(copies[0]?.attributes('data-content')).toBe('GB29NWBK60161331926819')
    expect(copies[1]?.attributes('data-content')).toBe('NWBK60161331926819')
  })

  it('renders only available raw values for copy buttons', () => {
    const wrapper = mount(IBANResultFormats, {
      props: {
        normalized: 'GB29NWBK60161331926819',
        normalizedRaw: null,
        formatted: 'GB29 NWBK 6016 1331 9268 19',
        formattedRaw: 'GB29 NWBK 6016 1331 9268 19',
        bban: 'NWBK60161331926819',
        bbanRaw: undefined,
      },
    })

    const copies = wrapper.findAll('.copy')
    expect(copies).toHaveLength(1)
    expect(copies[0]?.attributes('data-content')).toBe('GB29 NWBK 6016 1331 9268 19')
  })
})
