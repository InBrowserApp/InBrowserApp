import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ColorContrastInputSection from './ColorContrastInputSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const BlockStub = defineComponent({
  inheritAttrs: false,
  template: '<div v-bind="$attrs"><slot /></div>',
})

const InlineStub = defineComponent({
  inheritAttrs: false,
  template: '<span v-bind="$attrs"><slot /></span>',
})

const NButtonStub = defineComponent({
  name: 'NButton',
  inheritAttrs: false,
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
})

const NColorPickerStub = defineComponent({
  name: 'NColorPicker',
  inheritAttrs: false,
  props: ['value'],
  emits: ['update:value'],
  template:
    '<input v-bind="$attrs" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
})

const NFormItemStub = defineComponent({
  inheritAttrs: false,
  props: ['label', 'feedback', 'validationStatus'],
  template: '<label v-bind="$attrs"><span>{{ label }}</span><slot /></label>',
})

const stubs = {
  ToolSection: BlockStub,
  ToolSectionHeader: BlockStub,
  NButton: NButtonStub,
  'n-button': NButtonStub,
  NColorPicker: NColorPickerStub,
  'n-color-picker': NColorPickerStub,
  NFlex: BlockStub,
  'n-flex': BlockStub,
  NFormItem: NFormItemStub,
  'n-form-item': NFormItemStub,
  NGi: BlockStub,
  'n-gi': BlockStub,
  NGrid: BlockStub,
  'n-grid': BlockStub,
  NIcon: InlineStub,
  'n-icon': InlineStub,
}

type PickerWrapper = {
  vm: {
    $emit: (event: 'update:value', value: string) => void
  }
}

describe('ColorContrastInputSection', () => {
  it('emits model updates when picker values change', () => {
    const onForegroundUpdate = vi.fn()
    const onBackgroundUpdate = vi.fn()

    const wrapper = mount(ColorContrastInputSection, {
      props: {
        swatches: ['#111111', '#ffffff'],
        foregroundHex: '#111111',
        backgroundHex: '#ffffff',
        'onUpdate:foregroundHex': onForegroundUpdate,
        'onUpdate:backgroundHex': onBackgroundUpdate,
      },
      global: { stubs },
    })

    const foregroundPicker = wrapper.getComponent(
      '[data-testid="foreground-picker"]',
    ) as unknown as PickerWrapper
    const backgroundPicker = wrapper.getComponent(
      '[data-testid="background-picker"]',
    ) as unknown as PickerWrapper

    foregroundPicker.vm.$emit('update:value', '#11223344')
    backgroundPicker.vm.$emit('update:value', '#aabbccdd')

    expect(onForegroundUpdate).toHaveBeenLastCalledWith('#11223344')
    expect(onBackgroundUpdate).toHaveBeenLastCalledWith('#aabbccdd')
  })

  it('emits swap when the swap button is clicked', async () => {
    const wrapper = mount(ColorContrastInputSection, {
      props: {
        swatches: ['#111111', '#ffffff'],
        foregroundHex: '#111111',
        backgroundHex: '#ffffff',
      },
      global: { stubs },
    })

    await wrapper.get('[data-testid="swap-button"]').trigger('click')

    expect(wrapper.emitted('swap')).toHaveLength(1)
  })
})
