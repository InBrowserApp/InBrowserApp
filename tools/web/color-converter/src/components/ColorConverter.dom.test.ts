import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import ColorConverter from './ColorConverter.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, initialValue: unknown) => {
    if (!storage.has(key)) {
      storage.set(key, ref(initialValue))
    }
    return storage.get(key) as Ref<unknown>
  },
}))

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
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: ['value', 'size'],
      emits: ['update:value'],
      template: '<button class="n-switch" @click="$emit(\'update:value\', !value)" />',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div class="n-grid"><slot /></div>',
    }),
    NGi: defineComponent({
      name: 'NGi',
      template: '<div class="n-gi"><slot /></div>',
    }),
  }
})

const makePickerStub = (name: string) =>
  defineComponent({
    name,
    props: ['rgba', 'showAlpha'],
    emits: ['update:rgba'],
    template: `<div class="${name}" />`,
  })

const stubs = {
  HexColorPicker: makePickerStub('HexColorPicker'),
  RgbColorPicker: makePickerStub('RgbColorPicker'),
  HslColorPicker: makePickerStub('HslColorPicker'),
  HsvColorPicker: makePickerStub('HsvColorPicker'),
  HwbColorInput: makePickerStub('HwbColorInput'),
  LabColorInput: makePickerStub('LabColorInput'),
  LchColorInput: makePickerStub('LchColorInput'),
  CmykColorInput: makePickerStub('CmykColorInput'),
  KeywordSelect: makePickerStub('KeywordSelect'),
}

describe('ColorConverter', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('passes stored state to child components and reacts to updates', async () => {
    storage.set('tools:color-converter:show-alpha', ref(false))
    storage.set('tools:color-converter:rgba', ref({ r: 1, g: 2, b: 3, a: 0.4 }))

    const wrapper = mount(ColorConverter, {
      global: { stubs },
    })
    await nextTick()

    const hex = wrapper.findComponent({ name: 'HexColorPicker' })
    const rgb = wrapper.findComponent({ name: 'RgbColorPicker' })
    const hsl = wrapper.findComponent({ name: 'HslColorPicker' })

    expect(hex.props('showAlpha')).toBe(false)
    expect(rgb.props('rgba')).toEqual({ r: 1, g: 2, b: 3, a: 0.4 })

    rgb.vm.$emit('update:rgba', { r: 9, g: 8, b: 7, a: 1 })
    await nextTick()

    expect(hsl.props('rgba')).toEqual({ r: 9, g: 8, b: 7, a: 1 })

    const updateEmitters = [
      'HexColorPicker',
      'RgbColorPicker',
      'HslColorPicker',
      'HsvColorPicker',
      'HwbColorInput',
      'LabColorInput',
      'LchColorInput',
      'CmykColorInput',
      'KeywordSelect',
    ]

    for (const [index, name] of updateEmitters.entries()) {
      const nextColor = {
        r: 20 + index,
        g: 40 + index,
        b: 60 + index,
        a: 0.1 * ((index % 5) + 1),
      }
      wrapper.findComponent({ name }).vm.$emit('update:rgba', nextColor)
      await nextTick()
      expect(wrapper.findComponent({ name: 'HexColorPicker' }).props('rgba')).toEqual(nextColor)
    }

    wrapper.findComponent({ name: 'NSwitch' }).vm.$emit('update:value', true)
    await nextTick()

    expect(hex.props('showAlpha')).toBe(true)
  })
})
