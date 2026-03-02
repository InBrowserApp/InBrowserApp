import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import HexColorPicker from './HexColorPicker.vue'
import RgbColorPicker from './RgbColorPicker.vue'
import HslColorPicker from './HslColorPicker.vue'
import HsvColorPicker from './HsvColorPicker.vue'
import type { RGBA } from '../types'
vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content', 'size'],
    template: '<button class="copy" />',
  },
}))
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
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
  }
})
const ColorSectionStub = defineComponent({
  name: 'ColorSection',
  template:
    '<div class="color-section"><slot name="label-suffix" /><slot name="action" /><slot /></div>',
})
const mountPicker = (
  Component: typeof HexColorPicker,
  props: {
    rgba: RGBA
    showAlpha: boolean
  },
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
  it('handles additional hex formats and alpha fallbacks', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountPicker(
      HexColorPicker,
      { rgba: { r: 255, g: 0, b: 0, a: 0.5 }, showAlpha: false },
      onUpdate,
    )
    expect(wrapper.findComponent({ name: 'NColorPicker' }).props('value')).toBe('#FF0000')
    await wrapper.find('input').setValue('#0f08')
    await nextTick()
    const expandedShortHex = onUpdate.mock.lastCall?.[0] as RGBA
    expect(expandedShortHex.r).toBe(0)
    expect(expandedShortHex.g).toBe(255)
    expect(expandedShortHex.b).toBe(0)
    expect(expandedShortHex.a).toBeCloseTo(136 / 255, 6)
    await wrapper.find('input').setValue('#112233')
    await nextTick()
    expect(onUpdate).toHaveBeenLastCalledWith({ r: 17, g: 34, b: 51, a: 1 })
    await wrapper.find('input').setValue('#123456zz')
    await nextTick()
    expect(onUpdate).toHaveBeenLastCalledWith({ r: 18, g: 52, b: 86, a: 1 })
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
  it('renders rgba output, parses alpha, and ignores invalid rgb input', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountPicker(
      RgbColorPicker,
      { rgba: { r: 7, g: 8, b: 9, a: 0.1234 }, showAlpha: true },
      onUpdate,
    )
    expect(wrapper.findComponent({ name: 'NColorPicker' }).props('value')).toBe(
      'rgba(7, 8, 9, 0.12)',
    )
    await wrapper.find('input').setValue('rgba(10, 20, 30, 0.25)')
    await nextTick()
    expect(onUpdate).toHaveBeenLastCalledWith({ r: 10, g: 20, b: 30, a: 0.25 })
    onUpdate.mockClear()
    await wrapper.find('input').setValue('not-rgb')
    await nextTick()
    expect(onUpdate).not.toHaveBeenCalled()
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
  it('renders hsla values, parses alpha, and ignores invalid hsl input', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountPicker(
      HslColorPicker,
      { rgba: { r: 255, g: 0, b: 0, a: 0.75 }, showAlpha: true },
      onUpdate,
    )
    expect(wrapper.findComponent({ name: 'NColorPicker' }).props('value')).toBe(
      'hsla(0, 100%, 50%, 0.75)',
    )
    await wrapper.find('input').setValue('hsla(240, 100%, 50%, 0.4)')
    await nextTick()
    expect(onUpdate).toHaveBeenLastCalledWith({ r: 0, g: 0, b: 255, a: 0.4 })
    onUpdate.mockClear()
    await wrapper.find('input').setValue('bad-hsl')
    await nextTick()
    expect(onUpdate).not.toHaveBeenCalled()
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
  it('renders hsv without alpha, parses values, and ignores invalid hsv input', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountPicker(
      HsvColorPicker,
      { rgba: { r: 255, g: 0, b: 0, a: 0.4 }, showAlpha: false },
      onUpdate,
    )
    expect(wrapper.findComponent({ name: 'NColorPicker' }).props('value')).toBe(
      'hsv(0, 100%, 100%)',
    )
    await wrapper.find('input').setValue('hsv(120, 100%, 100%)')
    await nextTick()
    expect(onUpdate).toHaveBeenLastCalledWith({ r: 0, g: 255, b: 0, a: 1 })
    onUpdate.mockClear()
    await wrapper.find('input').setValue('bad-hsv')
    await nextTick()
    expect(onUpdate).not.toHaveBeenCalled()
  })
})
