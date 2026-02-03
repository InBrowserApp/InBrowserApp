import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import convert from 'color-convert'
import HwbColorInput from './HwbColorInput.vue'
import LabColorInput from './LabColorInput.vue'
import LchColorInput from './LchColorInput.vue'
import CmykColorInput from './CmykColorInput.vue'
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
    NInput: defineComponent({
      name: 'NInput',
      props: ['value', 'status'],
      emits: ['update:value', 'blur', 'keydown'],
      template:
        '<input class="n-input" :data-status="status" :value="value" @input="$emit(\'update:value\', $event.target.value)" @blur="$emit(\'blur\')" @keydown="$emit(\'keydown\', $event)" />',
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

const mountInput = (Component: typeof HwbColorInput, rgba: RGBA, onUpdate: (value: RGBA) => void) =>
  mount(Component, {
    props: {
      rgba,
      'onUpdate:rgba': onUpdate,
    },
    global: {
      stubs: {
        ColorSection: ColorSectionStub,
      },
    },
  })

describe('color input fields', () => {
  it('parses valid HWB values on blur', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountInput(HwbColorInput, { r: 255, g: 0, b: 0, a: 0.8 }, onUpdate)

    const [h, w, bk] = convert.rgb.hwb(255, 0, 0)
    expect(wrapper.find('input').element.value).toBe(`hwb(${h}, ${w}%, ${bk}%)`)

    await wrapper.find('input').setValue('hwb(120, 0%, 0%)')
    await wrapper.find('input').trigger('blur')
    await nextTick()

    const [r, g, b] = convert.hwb.rgb(120, 0, 0)
    expect(onUpdate).toHaveBeenCalledWith({ r, g, b, a: 0.8 })
  })

  it('resets invalid HWB values', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountInput(HwbColorInput, { r: 0, g: 0, b: 0, a: 1 }, onUpdate)

    await wrapper.find('input').setValue('hwb(999, 0%, 0%)')
    await nextTick()

    expect(wrapper.findComponent({ name: 'NInput' }).props('status')).toBe('error')

    await wrapper.find('input').trigger('blur')
    await nextTick()

    expect(wrapper.find('input').element.value).toBe('hwb(0, 0%, 100%)')
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('parses valid LAB values on blur', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountInput(LabColorInput, { r: 255, g: 0, b: 0, a: 0.5 }, onUpdate)

    await wrapper.find('input').setValue('lab(50, 0, 0)')
    await wrapper.find('input').trigger('blur')
    await nextTick()

    const [r, g, b] = convert.lab.rgb(50, 0, 0)
    expect(onUpdate).toHaveBeenCalledWith({ r, g, b, a: 0.5 })
  })

  it('resets invalid LAB values', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountInput(LabColorInput, { r: 255, g: 255, b: 255, a: 1 }, onUpdate)

    await wrapper.find('input').setValue('lab(999, 0, 0)')
    await nextTick()

    expect(wrapper.findComponent({ name: 'NInput' }).props('status')).toBe('error')

    await wrapper.find('input').trigger('blur')
    await nextTick()

    const [l, a, bVal] = convert.rgb.lab(255, 255, 255)
    expect(wrapper.find('input').element.value).toBe(
      `lab(${l.toFixed(1)}, ${a.toFixed(1)}, ${bVal.toFixed(1)})`,
    )
  })

  it('parses valid LCH values on blur', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountInput(LchColorInput, { r: 255, g: 0, b: 0, a: 1 }, onUpdate)

    await wrapper.find('input').setValue('lch(50, 40, 120)')
    await wrapper.find('input').trigger('blur')
    await nextTick()

    const [r, g, b] = convert.lch.rgb(50, 40, 120)
    expect(onUpdate).toHaveBeenCalledWith({ r, g, b, a: 1 })
  })

  it('resets invalid LCH values', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountInput(LchColorInput, { r: 0, g: 0, b: 0, a: 1 }, onUpdate)

    await wrapper.find('input').setValue('lch(10, -1, 500)')
    await nextTick()

    expect(wrapper.findComponent({ name: 'NInput' }).props('status')).toBe('error')

    await wrapper.find('input').trigger('blur')
    await nextTick()

    const [l, c, h] = convert.rgb.lch(0, 0, 0)
    expect(wrapper.find('input').element.value).toBe(
      `lch(${l.toFixed(1)}, ${c.toFixed(1)}, ${h.toFixed(1)})`,
    )
  })

  it('parses valid CMYK values on blur', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountInput(CmykColorInput, { r: 0, g: 0, b: 0, a: 0.9 }, onUpdate)

    await wrapper.find('input').setValue('cmyk(0, 0, 0, 0)')
    await wrapper.find('input').trigger('blur')
    await nextTick()

    const [r, g, b] = convert.cmyk.rgb(0, 0, 0, 0)
    expect(onUpdate).toHaveBeenCalledWith({ r, g, b, a: 0.9 })
  })

  it('resets invalid CMYK values', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountInput(CmykColorInput, { r: 255, g: 255, b: 255, a: 1 }, onUpdate)

    await wrapper.find('input').setValue('cmyk(200, 0, 0, 0)')
    await nextTick()

    expect(wrapper.findComponent({ name: 'NInput' }).props('status')).toBe('error')

    await wrapper.find('input').trigger('blur')
    await nextTick()

    const [c, m, y, k] = convert.rgb.cmyk(255, 255, 255)
    expect(wrapper.find('input').element.value).toBe(`cmyk(${c}%, ${m}%, ${y}%, ${k}%)`)
  })
})
