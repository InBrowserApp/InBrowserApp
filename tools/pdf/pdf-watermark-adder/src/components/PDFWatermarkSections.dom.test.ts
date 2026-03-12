import { defineComponent } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const makeStub = (name: string, template = '<div><slot /></div>') =>
    defineComponent({
      name,
      props: {
        label: {
          type: String,
          default: '',
        },
        title: {
          type: String,
          default: '',
        },
      },
      template,
    })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      tag: {
        type: String,
        default: 'button',
      },
      href: {
        type: String,
        default: undefined,
      },
      download: {
        type: String,
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template:
      '<component :is="tag" :href="href" :download="download" :disabled="disabled" v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /></component>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'text',
      },
    },
    emits: ['update:value'],
    template:
      '<textarea v-if="type === \'textarea\'" :value="value" :placeholder="placeholder" :disabled="disabled" v-bind="$attrs" @input="$emit(\'update:value\', $event.target.value)" /><input v-else :value="value" :placeholder="placeholder" :disabled="disabled" v-bind="$attrs" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: 0,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template:
      '<input type="number" :value="value" :disabled="disabled" v-bind="$attrs" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const NSlider = defineComponent({
    name: 'NSlider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template:
      '<input type="range" :value="value" :disabled="disabled" v-bind="$attrs" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: [String, Number],
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template:
      '<select :value="value" :disabled="disabled" v-bind="$attrs" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  })

  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div><slot /></div>',
  })

  const NRadioButton = defineComponent({
    name: 'NRadioButton',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    template: '<button type="button"><slot /></button>',
  })

  const NColorPicker = defineComponent({
    name: 'NColorPicker',
    props: {
      value: {
        type: String,
        default: '#000000',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template:
      '<input type="color" :value="value" :disabled="disabled" v-bind="$attrs" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NAlert: defineComponent({
      name: 'NAlert',
      props: {
        title: {
          type: String,
          default: '',
        },
      },
      template: '<div class="n-alert">{{ title }}</div>',
    }),
    NButton,
    NColorPicker,
    NFlex: makeStub('NFlex'),
    NForm: makeStub('NForm', '<form><slot /></form>'),
    NFormItem: makeStub('NFormItem', '<label><span>{{ label }}</span><slot /></label>'),
    NGi: makeStub('NGi'),
    NGrid: makeStub('NGrid'),
    NIcon: makeStub('NIcon'),
    NInput,
    NInputNumber,
    NRadioButton,
    NRadioGroup,
    NSelect,
    NSlider,
    NText: makeStub('NText', '<p><slot /></p>'),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')

  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h2><slot /></h2>',
    }),
  }
})

import PDFWatermarkContentPanel from './PDFWatermarkContentPanel.vue'
import PDFWatermarkGenerateSection from './PDFWatermarkGenerateSection.vue'
import PDFWatermarkLayoutPanel from './PDFWatermarkLayoutPanel.vue'
import PDFWatermarkSettingsSection from './PDFWatermarkSettingsSection.vue'
import PDFWatermarkUploadSection from './PDFWatermarkUploadSection.vue'

const globalMountOptions = {
  global: {
    stubs: {
      ArrowDownload16Regular: true,
      DocumentArrowUp20Regular: true,
      Sparkle16Filled: true,
    },
  },
}

describe('PDFWatermarkUploadSection', () => {
  it('triggers file picking, emits uploads, and supports clearing', async () => {
    const wrapper = mount(PDFWatermarkUploadSection, {
      props: {
        title: 'Upload PDF',
        chooseFileLabel: 'Upload PDF',
        replaceFileLabel: 'Replace PDF',
        clearFileLabel: 'Clear PDF',
        privacyHint: 'Local only',
        fileNameText: 'File name: sample.pdf',
        pageCountText: 'Page count: 5',
        fileErrorMessage: '',
        file: new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
        isLoadingDocument: false,
        isGenerating: false,
      },
      ...globalMountOptions,
    })

    expect(wrapper.text()).toContain('Replace PDF')
    expect(wrapper.get('[data-test="file-meta"]').text()).toContain('Page count: 5')

    const fileInput = wrapper.get('input[type="file"]')
    const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, 'click')

    await wrapper.get('[data-test="choose-file-button"]').trigger('click')
    expect(clickSpy).toHaveBeenCalledOnce()

    const uploadedFile = new File(['pdf'], 'next.pdf', { type: 'application/pdf' })
    Object.defineProperty(fileInput.element, 'files', {
      configurable: true,
      value: [uploadedFile],
    })
    await fileInput.trigger('change')

    expect(wrapper.emitted('upload')?.[0]).toEqual([uploadedFile])
    expect((fileInput.element as HTMLInputElement).value).toBe('')

    await wrapper.get('[data-test="clear-file-button"]').trigger('click')
    expect(wrapper.emitted('clear-file')).toHaveLength(1)
  })

  it('shows the default upload state and ignores empty file selections', async () => {
    const wrapper = mount(PDFWatermarkUploadSection, {
      props: {
        title: 'Upload PDF',
        chooseFileLabel: 'Upload PDF',
        replaceFileLabel: 'Replace PDF',
        clearFileLabel: 'Clear PDF',
        privacyHint: 'Local only',
        fileNameText: '',
        pageCountText: '',
        fileErrorMessage: 'Invalid PDF',
        file: null,
        isLoadingDocument: false,
        isGenerating: true,
      },
      ...globalMountOptions,
    })

    expect(wrapper.text()).toContain('Upload PDF')
    expect(wrapper.find('[data-test="file-meta"]').exists()).toBe(false)
    expect(wrapper.find('.n-alert').text()).toContain('Invalid PDF')

    const fileInput = wrapper.get('input[type="file"]')
    Object.defineProperty(fileInput.element, 'files', {
      configurable: true,
      value: [],
    })
    await fileInput.trigger('change')

    expect(wrapper.emitted('upload')).toBeUndefined()
  })
})

describe('PDFWatermarkContentPanel', () => {
  it('updates text mode fields and presets', async () => {
    const wrapper = mount(PDFWatermarkContentPanel, {
      props: {
        modeLabel: 'Mode',
        textModeLabel: 'Text',
        imageModeLabel: 'Image',
        textContentLabel: 'Text content',
        imageContentLabel: 'Image content',
        textPlaceholder: 'Enter text',
        uploadImageLabel: 'Upload image',
        replaceImageLabel: 'Replace image',
        clearImageLabel: 'Clear image',
        imageHint: 'PNG/JPG only',
        pageRangesLabel: 'Pages',
        pageRangesPlaceholder: '1-3',
        imageErrorMessage: '',
        textPresets: ['CONFIDENTIAL', 'DRAFT'],
        imageFile: null,
        mode: 'text',
        rangeInput: '',
        text: 'CONFIDENTIAL',
        isGenerating: false,
      },
      ...globalMountOptions,
    })

    const radioGroup = wrapper.getComponent({ name: 'NRadioGroup' })
    radioGroup.vm.$emit('update:value', 'image')
    radioGroup.vm.$emit('update:value', 'invalid')
    expect(wrapper.emitted('update-mode')).toEqual([['image']])

    await wrapper.get('[data-test="range-input"]').setValue('1-2')
    await wrapper.get('[data-test="text-input"]').setValue('TOP SECRET')

    expect(wrapper.emitted('update-range-input')?.[0]).toEqual(['1-2'])
    expect(wrapper.emitted('update-text')?.[0]).toEqual(['TOP SECRET'])

    const presetButton = wrapper.findAll('button').find((node) => node.text() === 'DRAFT')
    expect(presetButton).toBeDefined()
    if (presetButton) {
      await presetButton.trigger('click')
    }
    expect(wrapper.emitted('preset-text')?.[0]).toEqual(['DRAFT'])
  })

  it('handles image uploads and clearing in image mode', async () => {
    const imageFile = new File(['png'], 'logo.png', { type: 'image/png' })
    const wrapper = mount(PDFWatermarkContentPanel, {
      props: {
        modeLabel: 'Mode',
        textModeLabel: 'Text',
        imageModeLabel: 'Image',
        textContentLabel: 'Text content',
        imageContentLabel: 'Image content',
        textPlaceholder: 'Enter text',
        uploadImageLabel: 'Upload image',
        replaceImageLabel: 'Replace image',
        clearImageLabel: 'Clear image',
        imageHint: 'PNG/JPG only',
        pageRangesLabel: 'Pages',
        pageRangesPlaceholder: '1-3',
        imageErrorMessage: 'Bad image',
        textPresets: ['CONFIDENTIAL'],
        imageFile,
        mode: 'image',
        rangeInput: '1-3',
        text: '',
        isGenerating: false,
      },
      ...globalMountOptions,
    })

    expect(wrapper.text()).toContain('logo.png')
    expect(wrapper.find('.n-alert').text()).toContain('Bad image')

    const imageInput = wrapper.get('input[type="file"]')
    const clickSpy = vi.spyOn(imageInput.element as HTMLInputElement, 'click')
    await wrapper.get('[data-test="image-upload-button"]').trigger('click')
    expect(clickSpy).toHaveBeenCalledOnce()

    const nextImage = new File(['jpg'], 'stamp.jpg', { type: 'image/jpeg' })
    Object.defineProperty(imageInput.element, 'files', {
      configurable: true,
      value: [nextImage],
    })
    await imageInput.trigger('change')

    expect(wrapper.emitted('upload-image')?.[0]).toEqual([nextImage])
    expect((imageInput.element as HTMLInputElement).value).toBe('')

    const clearButton = wrapper.findAll('button').find((node) => node.text() === 'Clear image')
    expect(clearButton).toBeDefined()
    if (clearButton) {
      await clearButton.trigger('click')
    }

    expect(wrapper.emitted('clear-image')).toHaveLength(1)
  })
})

describe('PDFWatermarkLayoutPanel', () => {
  it('emits layout updates in text mode and ignores invalid select values', async () => {
    const wrapper = mount(PDFWatermarkLayoutPanel, {
      props: {
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
        fontFamilyOptions: [
          { label: 'Sans', value: 'sans-serif' },
          { label: 'Serif', value: 'serif' },
        ],
        positionOptions: [
          { label: 'Center', value: 'center' },
          { label: 'Bottom right', value: 'bottom-right' },
        ],
        mode: 'text',
        layoutMode: 'single',
        fontFamily: 'sans-serif',
        fontSize: 48,
        color: '#000000',
        opacity: 18,
        rotation: -35,
        position: 'center',
        offsetX: 0,
        offsetY: 0,
        tileGapX: 70,
        tileGapY: 60,
        imageScale: 28,
        isGenerating: false,
      },
      ...globalMountOptions,
    })

    const layoutGroup = wrapper.getComponent({ name: 'NRadioGroup' })
    layoutGroup.vm.$emit('update:value', 'tile')

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    selects[0]?.vm.$emit('update:value', 'bottom-right')
    selects[0]?.vm.$emit('update:value', 'invalid')
    selects[1]?.vm.$emit('update:value', 'serif')
    selects[1]?.vm.$emit('update:value', 'mono')

    expect(wrapper.emitted('update-layout-mode')?.[0]).toEqual(['tile'])
    expect(wrapper.emitted('update-position')).toEqual([['bottom-right']])
    expect(wrapper.emitted('update-font-family')).toEqual([['serif']])

    const sliders = wrapper.findAllComponents({ name: 'NSlider' })
    sliders[0]?.vm.$emit('update:value', 20)
    sliders[1]?.vm.$emit('update:value', -12)

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    inputs[0]?.vm.$emit('update:value', 8)
    inputs[1]?.vm.$emit('update:value', -6)
    inputs[2]?.vm.$emit('update:value', 60)

    expect(wrapper.emitted('update-opacity')?.[0]).toEqual([20])
    expect(wrapper.emitted('update-rotation')?.[0]).toEqual([-12])
    expect(wrapper.emitted('update-offset-x')?.[0]).toEqual([8])
    expect(wrapper.emitted('update-offset-y')?.[0]).toEqual([-6])
    expect(wrapper.emitted('update-font-size')?.[0]).toEqual([60])

    wrapper.getComponent({ name: 'NColorPicker' }).vm.$emit('update:value', '#336699')
    expect(wrapper.emitted('update-color')?.[0]).toEqual(['#336699'])
  })

  it('shows image scale controls in image mode', () => {
    const wrapper = mount(PDFWatermarkLayoutPanel, {
      props: {
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
        fontFamilyOptions: [{ label: 'Sans', value: 'sans-serif' }],
        positionOptions: [{ label: 'Center', value: 'center' }],
        mode: 'image',
        layoutMode: 'tile',
        fontFamily: 'sans-serif',
        fontSize: 48,
        color: '#000000',
        opacity: 18,
        rotation: -35,
        position: 'center',
        offsetX: 0,
        offsetY: 0,
        tileGapX: 70,
        tileGapY: 60,
        imageScale: 28,
        isGenerating: false,
      },
      ...globalMountOptions,
    })

    expect(wrapper.find('[data-test="font-size-input"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="image-scale-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tile-gap-x-slider"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tile-gap-y-slider"]').exists()).toBe(true)

    const [tileGapXSlider, tileGapYSlider] = wrapper.findAllComponents({ name: 'NSlider' })
    tileGapXSlider!.vm.$emit('update:value', 44)
    tileGapYSlider!.vm.$emit('update:value', 36)

    const [imageScaleInput] = wrapper.findAllComponents({ name: 'NInputNumber' }) as VueWrapper[]
    imageScaleInput!.vm.$emit('update:value', 42)
    expect(wrapper.emitted('update-tile-gap-x')?.[0]).toEqual([44])
    expect(wrapper.emitted('update-tile-gap-y')?.[0]).toEqual([36])
    expect(wrapper.emitted('update-image-scale')?.[0]).toEqual([42])
  })
})

describe('PDFWatermarkGenerateSection', () => {
  it('emits generation requests and renders the result link', async () => {
    const wrapper = mount(PDFWatermarkGenerateSection, {
      props: {
        title: 'Generate',
        generateLabel: 'Generate PDF',
        generatingLabel: 'Generating...',
        resultReadyLabel: 'Ready',
        downloadLabel: 'Download',
        generateErrorMessage: 'Generation failed',
        isGenerating: false,
        canGenerate: true,
        hasResult: true,
        resultUrl: 'blob:result',
        resultFilename: 'result.pdf',
      },
      ...globalMountOptions,
    })

    await wrapper.get('[data-test="generate-button"]').trigger('click')
    expect(wrapper.emitted('generate')).toHaveLength(1)
    expect(wrapper.find('.n-alert').text()).toContain('Generation failed')

    const downloadLink = wrapper.get('a')
    expect(downloadLink.attributes('href')).toBe('blob:result')
    expect(downloadLink.attributes('download')).toBe('result.pdf')
  })

  it('switches the primary button label while generating', () => {
    const wrapper = mount(PDFWatermarkGenerateSection, {
      props: {
        title: 'Generate',
        generateLabel: 'Generate PDF',
        generatingLabel: 'Generating...',
        resultReadyLabel: 'Ready',
        downloadLabel: 'Download',
        generateErrorMessage: '',
        isGenerating: true,
        canGenerate: false,
        hasResult: false,
        resultUrl: null,
        resultFilename: '',
      },
      ...globalMountOptions,
    })

    expect(wrapper.text()).toContain('Generating...')
    expect(wrapper.find('a').exists()).toBe(false)
  })
})

describe('PDFWatermarkSettingsSection', () => {
  it('passes props through to child sections and re-emits all updates', () => {
    const contentStub = defineComponent({
      name: 'PDFWatermarkContentPanel',
      props: ['mode', 'rangeInput', 'text', 'imageFile', 'imageErrorMessage'],
      emits: [
        'update-mode',
        'update-range-input',
        'update-text',
        'preset-text',
        'upload-image',
        'clear-image',
      ],
      template: '<div data-test="content-panel-stub" />',
    })

    const layoutStub = defineComponent({
      name: 'PDFWatermarkLayoutPanel',
      props: ['fontSize', 'position', 'layoutMode', 'tileGapX', 'imageScale'],
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
      template: '<div data-test="layout-panel-stub" />',
    })

    const previewStub = defineComponent({
      name: 'PDFWatermarkPreview',
      props: ['file', 'pageCount', 'rangeInput', 'position', 'layoutMode', 'tileGapX'],
      template: '<div data-test="preview-panel-stub" />',
    })

    const file = new File(['pdf'], 'sample.pdf', { type: 'application/pdf' })
    const imageFile = new File(['png'], 'logo.png', { type: 'image/png' })

    const wrapper = mount(PDFWatermarkSettingsSection, {
      props: {
        title: 'Settings',
        modeLabel: 'Mode',
        textModeLabel: 'Text',
        imageModeLabel: 'Image',
        textContentLabel: 'Text content',
        imageContentLabel: 'Image content',
        textPlaceholder: 'Enter text',
        uploadImageLabel: 'Upload image',
        replaceImageLabel: 'Replace image',
        clearImageLabel: 'Clear image',
        imageHint: 'PNG/JPG only',
        pageRangesLabel: 'Pages',
        pageRangesPlaceholder: '1-3',
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
        previewTitle: 'Preview',
        previewHint: 'Live preview',
        previewLoadFailed: 'Preview failed',
        rangeErrorMessage: 'Range invalid',
        imageErrorMessage: 'Image invalid',
        textPresets: ['CONFIDENTIAL', 'DRAFT'],
        fontFamilyOptions: [{ label: 'Sans', value: 'sans-serif' }],
        positionOptions: [{ label: 'Center', value: 'center' }],
        file,
        pageCount: 3,
        imageFile,
        mode: 'text',
        layoutMode: 'single',
        rangeInput: '1-2',
        rangeErrorCode: '',
        text: 'CONFIDENTIAL',
        fontFamily: 'sans-serif',
        fontSize: 48,
        color: '#000000',
        opacity: 18,
        rotation: -35,
        position: 'center',
        offsetX: 0,
        offsetY: 0,
        tileGapX: 70,
        tileGapY: 60,
        imageScale: 28,
        isGenerating: false,
      },
      global: {
        stubs: {
          PDFWatermarkContentPanel: contentStub,
          PDFWatermarkLayoutPanel: layoutStub,
          PDFWatermarkPreview: previewStub,
        },
      },
    })

    expect(wrapper.find('.n-alert').text()).toContain('Range invalid')
    expect(wrapper.getComponent(contentStub).props('mode')).toBe('text')
    expect(wrapper.getComponent(layoutStub).props('fontSize')).toBe(48)
    expect(wrapper.getComponent(previewStub).props('pageCount')).toBe(3)

    const content = wrapper.getComponent(contentStub)
    const layout = wrapper.getComponent(layoutStub)

    content.vm.$emit('update-mode', 'image')
    content.vm.$emit('update-range-input', '2-3')
    content.vm.$emit('update-text', 'DRAFT')
    content.vm.$emit('preset-text', 'INTERNAL')
    content.vm.$emit('upload-image', imageFile)
    content.vm.$emit('clear-image')

    layout.vm.$emit('update-layout-mode', 'tile')
    layout.vm.$emit('update-position', 'bottom-right')
    layout.vm.$emit('update-font-family', 'serif')
    layout.vm.$emit('update-font-size', 64)
    layout.vm.$emit('update-color', '#336699')
    layout.vm.$emit('update-opacity', 20)
    layout.vm.$emit('update-rotation', -45)
    layout.vm.$emit('update-offset-x', 8)
    layout.vm.$emit('update-offset-y', -6)
    layout.vm.$emit('apply-tile-preset', 'dense')
    layout.vm.$emit('update-tile-gap-x', 44)
    layout.vm.$emit('update-tile-gap-y', 36)
    layout.vm.$emit('update-image-scale', 40)

    expect(wrapper.emitted('update-mode')?.[0]).toEqual(['image'])
    expect(wrapper.emitted('update-range-input')?.[0]).toEqual(['2-3'])
    expect(wrapper.emitted('update-text')?.[0]).toEqual(['DRAFT'])
    expect(wrapper.emitted('preset-text')?.[0]).toEqual(['INTERNAL'])
    expect(wrapper.emitted('upload-image')?.[0]).toEqual([imageFile])
    expect(wrapper.emitted('clear-image')).toHaveLength(1)
    expect(wrapper.emitted('update-layout-mode')?.[0]).toEqual(['tile'])
    expect(wrapper.emitted('update-position')?.[0]).toEqual(['bottom-right'])
    expect(wrapper.emitted('update-font-family')?.[0]).toEqual(['serif'])
    expect(wrapper.emitted('update-font-size')?.[0]).toEqual([64])
    expect(wrapper.emitted('update-color')?.[0]).toEqual(['#336699'])
    expect(wrapper.emitted('update-opacity')?.[0]).toEqual([20])
    expect(wrapper.emitted('update-rotation')?.[0]).toEqual([-45])
    expect(wrapper.emitted('update-offset-x')?.[0]).toEqual([8])
    expect(wrapper.emitted('update-offset-y')?.[0]).toEqual([-6])
    expect(wrapper.emitted('apply-tile-preset')?.[0]).toEqual(['dense'])
    expect(wrapper.emitted('update-tile-gap-x')?.[0]).toEqual([44])
    expect(wrapper.emitted('update-tile-gap-y')?.[0]).toEqual([36])
    expect(wrapper.emitted('update-image-scale')?.[0]).toEqual([40])
  })
})
