import { defineComponent } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { SelectOption } from 'naive-ui'

vi.mock('naive-ui', () => {
  const passthrough = (name: string, template = '<div v-bind="$attrs"><slot /></div>') =>
    defineComponent({
      name,
      inheritAttrs: false,
      template,
    })

  const inputLike = (name: string) =>
    defineComponent({
      name,
      inheritAttrs: false,
      emits: ['update:value'],
      template: '<div v-bind="$attrs"><slot /></div>',
    })

  return {
    NButton: passthrough(
      'NButton',
      '<button type="button" :data-test="$attrs[\'data-test\']" :disabled="$attrs.disabled" @click="$emit(\'click\', $event)"><slot /></button>',
    ),
    NFlex: passthrough('NFlex'),
    NGrid: passthrough('NGrid'),
    NGi: passthrough('NGi'),
    NFormItem: passthrough('NFormItem'),
    NRadioButton: passthrough('NRadioButton'),
    NRadioGroup: inputLike('NRadioGroup'),
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
  layoutLabel: 'Layout',
  layoutSingleLabel: 'Single',
  layoutTileLabel: 'Tile',
  tilePresetLabel: 'Tile density',
  tilePresetSparseLabel: 'Sparse',
  tilePresetMediumLabel: 'Standard',
  tilePresetDenseLabel: 'Dense',
  tileGapHint: 'Smaller gaps create denser coverage.',
  tileGapXLabel: 'Horizontal spacing',
  tileGapYLabel: 'Vertical spacing',
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
  layoutMode: 'single' as const,
  fontFamily: 'sans-serif' as const,
  fontSize: 48,
  color: '#000000',
  opacity: 18,
  rotation: -35,
  position: 'center' as const,
  offsetX: 0,
  offsetY: 0,
  tileGapX: 70,
  tileGapY: 60,
  imageScale: 25,
  isGenerating: false,
  ...overrides,
})

describe('PDFWatermarkLayoutPanel', () => {
  it('renders single-layout text controls and emits updates', async () => {
    const wrapper = mount(PDFWatermarkLayoutPanel, {
      props: createProps(),
    })

    expect(wrapper.find('[data-test="layout-mode-group"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="position-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="offset-x-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="offset-y-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tile-gap-x-slider"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="tile-gap-y-slider"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="font-family-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="font-size-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="color-picker"]').exists()).toBe(true)

    const [layoutModeGroup] = wrapper.findAllComponents({ name: 'NRadioGroup' })
    await layoutModeGroup!.vm.$emit('update:value', 'tile')
    await layoutModeGroup!.vm.$emit('update:value', 'invalid')

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

    expect(wrapper.emitted('update-layout-mode')).toEqual([['tile']])
    expect(wrapper.emitted('update-position')).toEqual([['bottom-right']])
    expect(wrapper.emitted('update-font-family')).toEqual([['serif'], ['monospace']])
    expect(wrapper.emitted('update-opacity')).toEqual([[24]])
    expect(wrapper.emitted('update-rotation')).toEqual([[-40]])
    expect(wrapper.emitted('update-offset-x')).toEqual([[12]])
    expect(wrapper.emitted('update-offset-y')).toEqual([[-8]])
    expect(wrapper.emitted('update-font-size')).toEqual([[64]])
    expect(wrapper.emitted('update-color')).toEqual([['#336699']])
  })

  it('renders tiled image controls and emits tile updates', async () => {
    const wrapper = mount(PDFWatermarkLayoutPanel, {
      props: createProps({
        mode: 'image',
        layoutMode: 'tile',
      }),
    })

    expect(wrapper.find('[data-test="position-select"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="offset-x-input"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="offset-y-input"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="tile-gap-x-slider"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tile-gap-y-slider"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tile-preset-sparse"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tile-preset-medium"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tile-preset-dense"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="font-family-select"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="font-size-input"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="color-picker"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="image-scale-input"]').exists()).toBe(true)

    const [layoutModeGroup] = wrapper.findAllComponents({ name: 'NRadioGroup' })
    await layoutModeGroup!.vm.$emit('update:value', 'single')

    const presetButtons = wrapper.findAll('button')
    await presetButtons.find((button) => button.text() === 'Dense')?.trigger('click')

    const [tileGapXSlider, tileGapYSlider, opacitySlider, rotationSlider] =
      wrapper.findAllComponents({
        name: 'NSlider',
      })
    await opacitySlider!.vm.$emit('update:value', 30)
    await rotationSlider!.vm.$emit('update:value', 15)
    await tileGapXSlider!.vm.$emit('update:value', 44)
    await tileGapYSlider!.vm.$emit('update:value', 36)

    const [imageScaleInput] = wrapper.findAllComponents({ name: 'NInputNumber' }) as VueWrapper[]
    await imageScaleInput!.vm.$emit('update:value', 42)

    expect(wrapper.emitted('update-layout-mode')).toEqual([['single']])
    expect(wrapper.emitted('apply-tile-preset')).toEqual([['dense']])
    expect(wrapper.emitted('update-opacity')).toEqual([[30]])
    expect(wrapper.emitted('update-rotation')).toEqual([[15]])
    expect(wrapper.emitted('update-tile-gap-x')).toEqual([[44]])
    expect(wrapper.emitted('update-tile-gap-y')).toEqual([[36]])
    expect(wrapper.emitted('update-image-scale')).toEqual([[42]])
  })
})
