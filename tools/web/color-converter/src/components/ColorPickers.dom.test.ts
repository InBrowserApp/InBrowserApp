import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import HexColorPicker from './HexColorPicker.vue'
import RgbColorPicker from './RgbColorPicker.vue'
import HslColorPicker from './HslColorPicker.vue'
import HsvColorPicker from './HsvColorPicker.vue'
import type { RGBA } from '../types'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content', 'size'],
    template: '<button class="copy" />',
  },
}))

vi.mock('@vicons/fluent/Info16Regular', () => ({ default: {} }))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NColorPicker: defineComponent({
      name: 'NColorPicker',
      props: ['value', 'showAlpha', 'modes', 'showPreview', 'swatches'],
      emits: ['update:value'],
      template:
        '<input class="n-color-picker" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NTooltip: defineComponent({
      name: 'NTooltip',
      template: '<div class="n-tooltip"><slot /><slot name="trigger" /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon" />',
    }),
  }
})

const ColorSectionStub = defineComponent({
  name: 'ColorSection',
  template:
    '<div class="color-section"><slot name="label-suffix" /><slot name="action" /><slot /></div>',
})

const mountPicker = (
  Component: typeof HexColorPicker,
  props: { rgba: RGBA; showAlpha: boolean },
  onUpdate: (value: RGBA) => void,
) =>
  mount(Component, {
    props: {
      ...props,
      'onUpdate:rgba': onUpdate,
    },
    global: {
      stubs: {
        ColorSection: ColorSectionStub,
      },
    },
  })

describe('color pickers', () => {
  it('renders hex with alpha and handles short hex updates', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountPicker(
      HexColorPicker,
      { rgba: { r: 255, g: 0, b: 0, a: 0.5 }, showAlpha: true },
      onUpdate,
    )

    expect(wrapper.findComponent({ name: 'NColorPicker' }).props('value')).toBe('#FF000080')

    await wrapper.find('input').setValue('#0f0')
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith({ r: 0, g: 255, b: 0, a: 1 })
  })

  it('renders rgb without alpha and parses rgb updates', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountPicker(
      RgbColorPicker,
      { rgba: { r: 1, g: 2, b: 3, a: 0.4 }, showAlpha: false },
      onUpdate,
    )

    expect(wrapper.findComponent({ name: 'NColorPicker' }).props('value')).toBe('rgb(1, 2, 3)')

    await wrapper.find('input').setValue('rgb(10, 20, 30)')
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith({ r: 10, g: 20, b: 30, a: 1 })
  })

  it('renders hsl values and converts updates', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountPicker(
      HslColorPicker,
      { rgba: { r: 255, g: 0, b: 0, a: 1 }, showAlpha: false },
      onUpdate,
    )

    expect(wrapper.findComponent({ name: 'NColorPicker' }).props('value')).toBe('hsl(0, 100%, 50%)')

    await wrapper.find('input').setValue('hsl(120, 100%, 50%)')
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith({ r: 0, g: 255, b: 0, a: 1 })
  })

  it('renders hsv values and converts updates', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountPicker(
      HsvColorPicker,
      { rgba: { r: 255, g: 0, b: 0, a: 0.75 }, showAlpha: true },
      onUpdate,
    )

    expect(wrapper.findComponent({ name: 'NColorPicker' }).props('value')).toBe(
      'hsva(0, 100%, 100%, 0.75)',
    )

    await wrapper.find('input').setValue('hsva(240, 100%, 100%, 0.5)')
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith({ r: 0, g: 0, b: 255, a: 0.5 })
  })
})
