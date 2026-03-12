import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { SelectOption } from 'naive-ui'
import PDFWatermarkSettingsSection from './PDFWatermarkSettingsSection.vue'

const fontFamilyOptions: SelectOption[] = [
  { label: 'Sans serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
]

const positionOptions: SelectOption[] = [{ label: 'Center', value: 'center' }]

const ContentPanelStub = defineComponent({
  name: 'PDFWatermarkContentPanel',
  props: [
    'mode',
    'imageErrorMessage',
    'textPresets',
    'rangeInput',
    'text',
    'imageFile',
    'isGenerating',
  ],
  emits: [
    'update-mode',
    'update-range-input',
    'update-text',
    'preset-text',
    'upload-image',
    'clear-image',
  ],
  setup(_props, { emit }) {
    return {
      emit,
      emitUpload: () => emit('upload-image', new File(['png'], 'logo.png', { type: 'image/png' })),
    }
  },
  template: `
    <div data-test="content-panel">
      {{ mode }}|{{ imageErrorMessage }}|{{ textPresets.join(',') }}|{{ rangeInput }}|{{ text }}
      <button class="emit-mode" @click="emit('update-mode', 'image')" />
      <button class="emit-range" @click="emit('update-range-input', '1-3')" />
      <button class="emit-text" @click="emit('update-text', 'TOP SECRET')" />
      <button class="emit-preset" @click="emit('preset-text', 'DRAFT')" />
      <button class="emit-upload" @click="emitUpload" />
      <button class="emit-clear-image" @click="emit('clear-image')" />
    </div>
  `,
})

const LayoutPanelStub = defineComponent({
  name: 'PDFWatermarkLayoutPanel',
  props: ['mode', 'layoutMode', 'fontFamily', 'fontSize', 'color', 'imageScale', 'tileGapX'],
  emits: [
    'update-layout-mode',
    'update-position',
    'update-font-family',
    'update-font-size',
    'update-color',
    'update-opacity',
    'update-rotation',
    'update-offset-x',
    'update-offset-y',
    'apply-tile-preset',
    'update-tile-gap-x',
    'update-tile-gap-y',
    'update-image-scale',
  ],
  setup(_props, { emit }) {
    return { emit }
  },
  template: `
    <div data-test="layout-panel">
      {{ mode }}|{{ layoutMode }}|{{ fontFamily }}|{{ fontSize }}|{{ color }}|{{ imageScale }}|{{ tileGapX }}
      <button class="emit-layout-mode" @click="emit('update-layout-mode', 'tile')" />
      <button class="emit-position" @click="emit('update-position', 'bottom-right')" />
      <button class="emit-font-family" @click="emit('update-font-family', 'serif')" />
      <button class="emit-font-size" @click="emit('update-font-size', 60)" />
      <button class="emit-color" @click="emit('update-color', '#112233')" />
      <button class="emit-opacity" @click="emit('update-opacity', 22)" />
      <button class="emit-rotation" @click="emit('update-rotation', -40)" />
      <button class="emit-offset-x" @click="emit('update-offset-x', 12)" />
      <button class="emit-offset-y" @click="emit('update-offset-y', -8)" />
      <button class="emit-tile-preset" @click="emit('apply-tile-preset', 'dense')" />
      <button class="emit-tile-gap-x" @click="emit('update-tile-gap-x', 44)" />
      <button class="emit-tile-gap-y" @click="emit('update-tile-gap-y', 36)" />
      <button class="emit-image-scale" @click="emit('update-image-scale', 35)" />
    </div>
  `,
})

const PreviewStub = defineComponent({
  name: 'PDFWatermarkPreview',
  props: ['title', 'hint', 'mode', 'layoutMode', 'text', 'rangeInput', 'imageScale', 'tileGapX'],
  template:
    '<div data-test="preview-panel">{{ title }}|{{ hint }}|{{ mode }}|{{ layoutMode }}|{{ text }}|{{ rangeInput }}|{{ imageScale }}|{{ tileGapX }}</div>',
})

const createProps = (
  overrides: Partial<InstanceType<typeof PDFWatermarkSettingsSection>['$props']> = {},
) => ({
  title: 'Watermark Settings',
  modeLabel: 'Watermark type',
  textModeLabel: 'Text',
  imageModeLabel: 'Image',
  textContentLabel: 'Text content',
  imageContentLabel: 'Image content',
  textPlaceholder: 'Enter watermark text',
  uploadImageLabel: 'Upload image',
  replaceImageLabel: 'Replace image',
  clearImageLabel: 'Clear image',
  imageHint: 'Browser-supported images are accepted and converted to PNG when needed.',
  pageRangesLabel: 'Page ranges',
  pageRangesPlaceholder: '1-3,5',
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
  previewTitle: 'Live Preview',
  previewHint: 'Preview the watermark',
  previewLoadFailed: 'Preview unavailable',
  rangeErrorMessage: '',
  imageErrorMessage: '',
  textPresets: ['CONFIDENTIAL', 'DRAFT', 'INTERNAL'],
  fontFamilyOptions,
  positionOptions,
  file: new File(['pdf'], 'source.pdf', { type: 'application/pdf' }),
  pageCount: 6,
  imageFile: null,
  mode: 'text' as const,
  layoutMode: 'single' as const,
  rangeInput: '',
  rangeErrorCode: '',
  text: 'CONFIDENTIAL',
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

describe('PDFWatermarkSettingsSection', () => {
  it('passes props to child panels and forwards child events', async () => {
    const wrapper = mount(PDFWatermarkSettingsSection, {
      props: createProps({
        imageErrorMessage: 'Please upload a valid browser-supported watermark image.',
        rangeInput: '2-4',
      }),
      global: {
        stubs: {
          PDFWatermarkContentPanel: ContentPanelStub,
          PDFWatermarkLayoutPanel: LayoutPanelStub,
          PDFWatermarkPreview: PreviewStub,
        },
      },
    })

    expect(wrapper.get('[data-test="content-panel"]').text()).toContain(
      'Please upload a valid browser-supported watermark image.',
    )
    expect(wrapper.get('[data-test="content-panel"]').text()).toContain(
      'CONFIDENTIAL,DRAFT,INTERNAL',
    )
    expect(wrapper.get('[data-test="preview-panel"]').text()).toContain(
      'Live Preview|Preview the watermark|text|single|CONFIDENTIAL|2-4|25|70',
    )

    for (const selector of [
      '.emit-mode',
      '.emit-range',
      '.emit-text',
      '.emit-preset',
      '.emit-upload',
      '.emit-clear-image',
      '.emit-layout-mode',
      '.emit-position',
      '.emit-font-family',
      '.emit-font-size',
      '.emit-color',
      '.emit-opacity',
      '.emit-rotation',
      '.emit-offset-x',
      '.emit-offset-y',
      '.emit-tile-preset',
      '.emit-tile-gap-x',
      '.emit-tile-gap-y',
      '.emit-image-scale',
    ]) {
      await wrapper.get(selector).trigger('click')
    }

    expect(wrapper.emitted('update-mode')).toEqual([['image']])
    expect(wrapper.emitted('update-range-input')).toEqual([['1-3']])
    expect(wrapper.emitted('update-text')).toEqual([['TOP SECRET']])
    expect(wrapper.emitted('preset-text')).toEqual([['DRAFT']])
    expect(wrapper.emitted('upload-image')?.[0]?.[0]).toMatchObject({ name: 'logo.png' })
    expect(wrapper.emitted('clear-image')).toEqual([[]])
    expect(wrapper.emitted('update-layout-mode')).toEqual([['tile']])
    expect(wrapper.emitted('update-position')).toEqual([['bottom-right']])
    expect(wrapper.emitted('update-font-family')).toEqual([['serif']])
    expect(wrapper.emitted('update-font-size')).toEqual([[60]])
    expect(wrapper.emitted('update-color')).toEqual([['#112233']])
    expect(wrapper.emitted('update-opacity')).toEqual([[22]])
    expect(wrapper.emitted('update-rotation')).toEqual([[-40]])
    expect(wrapper.emitted('update-offset-x')).toEqual([[12]])
    expect(wrapper.emitted('update-offset-y')).toEqual([[-8]])
    expect(wrapper.emitted('apply-tile-preset')).toEqual([['dense']])
    expect(wrapper.emitted('update-tile-gap-x')).toEqual([[44]])
    expect(wrapper.emitted('update-tile-gap-y')).toEqual([[36]])
    expect(wrapper.emitted('update-image-scale')).toEqual([[35]])
    expect(wrapper.find('.n-alert').exists()).toBe(false)
  })

  it('renders the range error alert when the current page range is invalid', () => {
    const wrapper = mount(PDFWatermarkSettingsSection, {
      props: createProps({
        rangeErrorMessage: 'Page range is outside the PDF page count.',
      }),
      global: {
        stubs: {
          PDFWatermarkContentPanel: ContentPanelStub,
          PDFWatermarkLayoutPanel: LayoutPanelStub,
          PDFWatermarkPreview: PreviewStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Page range is outside the PDF page count.')
  })
})
