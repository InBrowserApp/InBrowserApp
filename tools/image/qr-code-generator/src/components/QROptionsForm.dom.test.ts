import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QROptionsForm from './QROptionsForm.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div class="n-grid"><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: ['label', 'showFeedback'],
      template: '<div class="n-form-item-gi"><slot /></div>',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['value', 'options'],
      emits: ['update:value'],
      template: '<div class="n-select" />',
    }),
    NSlider: defineComponent({
      name: 'NSlider',
      props: ['value', 'min', 'max', 'step'],
      emits: ['update:value'],
      template: '<div class="n-slider" />',
    }),
    NColorPicker: defineComponent({
      name: 'NColorPicker',
      props: ['value', 'modes', 'showAlpha', 'size'],
      emits: ['update:value'],
      template: '<div class="n-color-picker" />',
    }),
  }
})

describe('QROptionsForm', () => {
  it('builds error correction options', () => {
    const wrapper = mount(QROptionsForm, {
      props: {
        errorCorrectionLevel: 'M',
        width: 256,
        margin: 2,
        dark: '#000000FF',
        light: '#FFFFFFFF',
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as Array<{ label: string; value: string }>

    expect(options).toHaveLength(4)
    expect(options[0]?.label).toBe('L')
  })
})
