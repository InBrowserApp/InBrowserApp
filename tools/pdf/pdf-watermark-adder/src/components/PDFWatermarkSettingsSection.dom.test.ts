import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { SelectOption } from 'naive-ui'
import PDFWatermarkSettingsSection from './PDFWatermarkSettingsSection.vue'

const fontFamilyOptions: SelectOption[] = [
  { label: 'Sans serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
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
  props: ['mode', 'fontFamily', 'fontSize', 'color', 'imageScale'],
  emits: [
    'update-position',
    'update-font-family',
    'update-font-size',
    'update-color',
    'update-opacity',
    'update-rotation',
    'update-offset-x',
    'update-offset-y',
    'update-image-scale',
  ],
  setup(_props, { emit }) {
    return { emit }
  },
  template: `
    <div data-test="layout-panel">
      {{ mode }}|{{ fontFamily }}|{{ fontSize }}|{{ color }}|{{ imageScale }}
      <button class="emit-position" @click="emit('update-position', 'bottom-right')" />
      <button class="emit-font-family" @click="emit('update-font-family', 'serif')" />
      <button class="emit-font-size" @click="emit('update-font-size', 60)" />
      <button class="emit-color" @click="emit('update-color', '#112233')" />
      <button class="emit-opacity" @click="emit('update-opacity', 22)" />
      <button class="emit-rotation" @click="emit('update-rotation', -40)" />
      <button class="emit-offset-x" @click="emit('update-offset-x', 12)" />
      <button class="emit-offset-y" @click="emit('update-offset-y', -8)" />
      <button class="emit-image-scale" @click="emit('update-image-scale', 35)" />
    </div>
  `,
})

const PreviewStub = defineComponent({
  name: 'PDFWatermarkPreview',
  props: ['title', 'hint', 'mode', 'text', 'rangeInput', 'imageScale'],
  template:
    '<div data-test="preview-panel">{{ title }}|{{ hint }}|{{ mode }}|{{ text }}|{{ rangeInput }}|{{ imageScale }}</div>',
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
  imageHint: 'PNG and JPG are supported.',
  pageRangesLabel: 'Page ranges',
  pageRangesPlaceholder: '1-3,5',
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
  imageScale: 25,
  isGenerating: false,
  ...overrides,
})

describe('PDFWatermarkSettingsSection', () => {
  it('passes props to child panels and forwards child events', async () => {
    const wrapper = mount(PDFWatermarkSettingsSection, {
      props: createProps({
        imageErrorMessage: 'Please upload a valid PNG or JPG watermark image.',
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
      'Please upload a valid PNG or JPG watermark image.',
    )
    expect(wrapper.get('[data-test="content-panel"]').text()).toContain(
      'CONFIDENTIAL,DRAFT,INTERNAL',
    )
    expect(wrapper.get('[data-test="preview-panel"]').text()).toContain(
      'Live Preview|Preview the watermark|text|CONFIDENTIAL|2-4|25',
    )

    for (const selector of [
      '.emit-mode',
      '.emit-range',
      '.emit-text',
      '.emit-preset',
      '.emit-upload',
      '.emit-clear-image',
      '.emit-position',
      '.emit-font-family',
      '.emit-font-size',
      '.emit-color',
      '.emit-opacity',
      '.emit-rotation',
      '.emit-offset-x',
      '.emit-offset-y',
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
    expect(wrapper.emitted('update-position')).toEqual([['bottom-right']])
    expect(wrapper.emitted('update-font-family')).toEqual([['serif']])
    expect(wrapper.emitted('update-font-size')).toEqual([[60]])
    expect(wrapper.emitted('update-color')).toEqual([['#112233']])
    expect(wrapper.emitted('update-opacity')).toEqual([[22]])
    expect(wrapper.emitted('update-rotation')).toEqual([[-40]])
    expect(wrapper.emitted('update-offset-x')).toEqual([[12]])
    expect(wrapper.emitted('update-offset-y')).toEqual([[-8]])
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
