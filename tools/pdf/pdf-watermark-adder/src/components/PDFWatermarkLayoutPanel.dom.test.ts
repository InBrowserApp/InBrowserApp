import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { SelectOption } from 'naive-ui'

vi.mock('naive-ui', () => {
  const passthrough = (name: string) =>
    defineComponent({
      name,
      inheritAttrs: false,
      template: '<div v-bind="$attrs"><slot /></div>',
    })

  const inputLike = (name: string) =>
    defineComponent({
      name,
      inheritAttrs: false,
      emits: ['update:value'],
      template: '<div v-bind="$attrs" />',
    })

  return {
    NFlex: passthrough('NFlex'),
    NGrid: passthrough('NGrid'),
    NGi: passthrough('NGi'),
    NFormItem: passthrough('NFormItem'),
    NSelect: inputLike('NSelect'),
    NInputNumber: inputLike('NInputNumber'),
    NSlider: inputLike('NSlider'),
    NText: passthrough('NText'),
    NColorPicker: inputLike('NColorPicker'),
  }
})

import PDFWatermarkLayoutPanel from './PDFWatermarkLayoutPanel.vue'

const fontFamilyOptions: SelectOption[] = [
  { label: 'Sans serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
]

const positionOptions: SelectOption[] = [
  { label: 'Center', value: 'center' },
  { label: 'Bottom right', value: 'bottom-right' },
  { label: 'Top left', value: 'top-left' },
]

const createProps = (
  overrides: Partial<InstanceType<typeof PDFWatermarkLayoutPanel>['$props']> = {},
) => ({
  positionLabel: 'Position',
  fontFamilyLabel: 'Font family',
  fontSizeLabel: 'Font size',
  colorLabel: 'Color',
  opacityLabel: 'Opacity',
  rotationLabel: 'Rotation',
  offsetXLabel: 'Offset X',
  offsetYLabel: 'Offset Y',
  imageScaleLabel: 'Image scale',
  fontFamilyOptions,
  positionOptions,
  mode: 'text' as const,
  fontFamily: 'sans-serif' as const,
  fontSize: 48,
  color: '#000000',
  opacity: 18,
  rotation: -35,
  position: 'center' as const,
  offsetX: 0,
  offsetY: 0,
  imageScale: 25,
  isGenerating: false,
  ...overrides,
})

describe('PDFWatermarkLayoutPanel', () => {
  it('renders text controls and emits text layout updates', async () => {
    const wrapper = mount(PDFWatermarkLayoutPanel, {
      props: createProps(),
    })

    expect(wrapper.find('[data-test="font-family-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="font-size-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="color-picker"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="opacity-slider"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="rotation-slider"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="image-scale-input"]').exists()).toBe(false)

    const [positionSelect, fontFamilySelect] = wrapper.findAllComponents({ name: 'NSelect' })
    await positionSelect!.vm.$emit('update:value', 'bottom-right')
    await positionSelect!.vm.$emit('update:value', 'invalid')
    await fontFamilySelect!.vm.$emit('update:value', 'serif')
    await fontFamilySelect!.vm.$emit('update:value', 'monospace')
    await fontFamilySelect!.vm.$emit('update:value', 'display')

    const [opacitySlider, rotationSlider] = wrapper.findAllComponents({ name: 'NSlider' })

    await opacitySlider!.vm.$emit('update:value', 24)
    await rotationSlider!.vm.$emit('update:value', -40)

    const [offsetXInput, offsetYInput, fontSizeInput] = wrapper.findAllComponents({
      name: 'NInputNumber',
    })
    await offsetXInput!.vm.$emit('update:value', 12)
    await offsetYInput!.vm.$emit('update:value', -8)
    await fontSizeInput!.vm.$emit('update:value', 64)
    await wrapper.getComponent({ name: 'NColorPicker' }).vm.$emit('update:value', '#336699')

    expect(wrapper.emitted('update-position')).toEqual([['bottom-right']])
    expect(wrapper.emitted('update-font-family')).toEqual([['serif'], ['monospace']])
    expect(wrapper.emitted('update-opacity')).toEqual([[24]])
    expect(wrapper.emitted('update-rotation')).toEqual([[-40]])
    expect(wrapper.emitted('update-offset-x')).toEqual([[12]])
    expect(wrapper.emitted('update-offset-y')).toEqual([[-8]])
    expect(wrapper.emitted('update-font-size')).toEqual([[64]])
    expect(wrapper.emitted('update-color')).toEqual([['#336699']])
  })

  it('renders image controls and emits image scale updates in image mode', async () => {
    const wrapper = mount(PDFWatermarkLayoutPanel, {
      props: createProps({
        mode: 'image',
      }),
    })

    expect(wrapper.find('[data-test="font-family-select"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="font-size-input"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="color-picker"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="opacity-slider"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="rotation-slider"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="image-scale-input"]').exists()).toBe(true)

    const [positionSelect] = wrapper.findAllComponents({ name: 'NSelect' })
    await positionSelect!.vm.$emit('update:value', 'top-left')

    const [opacitySlider, rotationSlider] = wrapper.findAllComponents({ name: 'NSlider' })

    await opacitySlider!.vm.$emit('update:value', 30)
    await rotationSlider!.vm.$emit('update:value', 15)

    const [offsetXInput, offsetYInput, imageScaleInput] = wrapper.findAllComponents({
      name: 'NInputNumber',
    })
    await offsetXInput!.vm.$emit('update:value', 4)
    await offsetYInput!.vm.$emit('update:value', 7)
    await imageScaleInput!.vm.$emit('update:value', 42)

    expect(wrapper.emitted('update-position')).toEqual([['top-left']])
    expect(wrapper.emitted('update-opacity')).toEqual([[30]])
    expect(wrapper.emitted('update-rotation')).toEqual([[15]])
    expect(wrapper.emitted('update-offset-x')).toEqual([[4]])
    expect(wrapper.emitted('update-offset-y')).toEqual([[7]])
    expect(wrapper.emitted('update-image-scale')).toEqual([[42]])
  })
})
