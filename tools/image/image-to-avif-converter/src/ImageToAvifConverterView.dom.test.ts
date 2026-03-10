import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, ref } from 'vue'
import ImageToAvifConverterView from './ImageToAvifConverterView.vue'
import type { AvifConversionResult } from './types'

type UseAvifConversionFn = typeof import('./composables/useAvifConversion').useAvifConversion
type UseAvifConversionOptions = Parameters<UseAvifConversionFn>[0]
type UseAvifConversionReturn = ReturnType<UseAvifConversionFn>

const messageMock = {
  success: vi.fn(),
  error: vi.fn(),
}

const useAvifConversionMock = vi.hoisted(
  () =>
    vi.fn(
      () =>
        ({
          results: ref<AvifConversionResult[]>([]),
          zipBlob: ref<Blob | null>(null),
          error: ref(''),
          isConverting: ref(false),
          isZipping: ref(false),
          canConvert: computed(() => true),
          convertImages: vi.fn(),
        }) as UseAvifConversionReturn,
    ) as Mock<(options: UseAvifConversionOptions) => UseAvifConversionReturn>,
)

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  const { defineComponent } = await import('vue')

  return {
    ...actual,
    useMessage: () => messageMock,
    NAlert: defineComponent({
      name: 'NAlert',
      props: { type: String, showIcon: Boolean },
      template: '<div class="alert"><slot /></div>',
    }),
  }
})

vi.mock('./composables/useAvifConversion', () => ({
  useAvifConversion: useAvifConversionMock,
}))

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div class="page"><slot /></div>',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const UploadSectionStub = defineComponent({
  name: 'ImageToAvifUploadSection',
  props: ['files'],
  emits: ['update:files'],
  template: '<div class="upload-section" />',
})

const OptionsSectionStub = defineComponent({
  name: 'ImageToAvifOptionsSection',
  props: [
    'scale',
    'quality',
    'speed',
    'lossless',
    'advancedEnabled',
    'alphaQuality',
    'denoiseLevel',
    'sharpness',
    'subsample',
    'tune',
    'enableSharpYuv',
    'isConverting',
    'canConvert',
  ],
  emits: [
    'update:scale',
    'update:quality',
    'update:speed',
    'update:lossless',
    'update:advancedEnabled',
    'update:alphaQuality',
    'update:denoiseLevel',
    'update:sharpness',
    'update:subsample',
    'update:tune',
    'update:enableSharpYuv',
    'convert',
  ],
  template: `
    <div class="options-section">
      <span class="scale">{{ scale }}</span>
      <span class="quality">{{ quality }}</span>
      <span class="speed">{{ speed }}</span>
      <button class="update-scale" @click="$emit('update:scale', 80)">scale</button>
      <button class="update-quality" @click="$emit('update:quality', 92)">quality</button>
      <button class="update-speed" @click="$emit('update:speed', 4)">speed</button>
      <button class="update-lossless" @click="$emit('update:lossless', true)">lossless</button>
      <button class="update-advanced" @click="$emit('update:advancedEnabled', true)">advanced</button>
      <button class="update-alpha" @click="$emit('update:alphaQuality', 70)">alpha</button>
      <button class="update-denoise" @click="$emit('update:denoiseLevel', 2)">denoise</button>
      <button class="update-sharpness" @click="$emit('update:sharpness', 1)">sharpness</button>
      <button class="update-subsample" @click="$emit('update:subsample', '420')">subsample</button>
      <button class="update-tune" @click="$emit('update:tune', 'auto')">tune</button>
      <button class="update-sharp-yuv" @click="$emit('update:enableSharpYuv', true)">sharp-yuv</button>
      <button class="convert" @click="$emit('convert')">convert</button>
    </div>
  `,
})

const ResultsSectionStub = defineComponent({
  name: 'ImageToAvifResultsSection',
  props: ['results', 'zipBlob', 'isZipping', 'downloadZipName'],
  template: '<div class="results-section">{{ results.length }}</div>',
})

const NoteStub = defineComponent({
  name: 'ImageToAvifNote',
  template: '<div class="note">note</div>',
})

function mountView() {
  return mount(defineComponent({ render: () => h(ImageToAvifConverterView) }), {
    global: {
      stubs: {
        ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
        ToolSection: ToolSectionStub,
        ImageToAvifUploadSection: UploadSectionStub,
        ImageToAvifOptionsSection: OptionsSectionStub,
        ImageToAvifResultsSection: ResultsSectionStub,
        ImageToAvifNote: NoteStub,
      },
    },
  })
}

describe('ImageToAvifConverterView', () => {
  beforeEach(() => {
    useAvifConversionMock.mockClear()
    messageMock.success.mockClear()
    messageMock.error.mockClear()
  })

  it('passes the AVIF state into the composable', () => {
    mountView()

    expect(useAvifConversionMock).toHaveBeenCalledTimes(1)
    const mockCalls = useAvifConversionMock.mock.calls as [UseAvifConversionOptions][]
    const options = mockCalls[mockCalls.length - 1]?.[0]

    expect(options?.speed.value).toBe(6)
    expect(options?.quality.value).toBe(75)
    expect(options?.enableSharpYuv.value).toBe(false)
    expect(options?.messages.convertSuccess()).toBe('Conversion completed.')
    expect(options?.messages.convertFailed()).toBe('Failed to convert images. Please try again.')
    expect(options?.messages.partialFailed(2)).toBe('2 files failed to convert.')
    expect(options?.messages.zipFailed()).toBe('Failed to create the ZIP file.')
    expect(options?.messages.invalidImage()).toBe(
      'Failed to load the image. Please try another file.',
    )
    expect(options?.messages.canvasUnavailable()).toBe('Canvas is not available in this browser.')
  })

  it('shows options only after files are selected', async () => {
    const wrapper = mountView()

    expect(wrapper.find('.convert').exists()).toBe(false)

    const upload = wrapper.findComponent(UploadSectionStub)
    await upload.vm.$emit('update:files', [new File(['a'], 'image.png', { type: 'image/png' })])

    expect(wrapper.find('.convert').exists()).toBe(true)
  })

  it('updates the bound refs from the options section and triggers conversion', async () => {
    const convertImages = vi.fn()
    useAvifConversionMock.mockReturnValueOnce({
      results: ref<AvifConversionResult[]>([]),
      zipBlob: ref<Blob | null>(null),
      error: ref(''),
      isConverting: ref(false),
      isZipping: ref(false),
      canConvert: computed(() => true),
      convertImages,
    } as UseAvifConversionReturn)

    const wrapper = mountView()
    const upload = wrapper.findComponent(UploadSectionStub)
    await upload.vm.$emit('update:files', [new File(['a'], 'image.png', { type: 'image/png' })])

    await wrapper.find('.update-scale').trigger('click')
    await wrapper.find('.update-quality').trigger('click')
    await wrapper.find('.update-speed').trigger('click')
    await wrapper.find('.update-lossless').trigger('click')
    await wrapper.find('.update-advanced').trigger('click')
    await wrapper.find('.update-alpha').trigger('click')
    await wrapper.find('.update-denoise').trigger('click')
    await wrapper.find('.update-sharpness').trigger('click')
    await wrapper.find('.update-subsample').trigger('click')
    await wrapper.find('.update-tune').trigger('click')
    await wrapper.find('.update-sharp-yuv').trigger('click')
    await wrapper.find('.convert').trigger('click')

    const mockCalls = useAvifConversionMock.mock.calls as [UseAvifConversionOptions][]
    const options = mockCalls[mockCalls.length - 1]?.[0]
    expect(options?.scale.value).toBe(80)
    expect(options?.quality.value).toBe(92)
    expect(options?.speed.value).toBe(4)
    expect(options?.lossless.value).toBe(true)
    expect(options?.advancedEnabled.value).toBe(true)
    expect(options?.alphaQuality.value).toBe(70)
    expect(options?.denoiseLevel.value).toBe(2)
    expect(options?.sharpness.value).toBe(1)
    expect(options?.subsample.value).toBe('420')
    expect(options?.tune.value).toBe('auto')
    expect(options?.enableSharpYuv.value).toBe(true)
    expect(convertImages).toHaveBeenCalledTimes(1)
  })

  it('renders results and an error alert from the composable state', () => {
    useAvifConversionMock.mockReturnValueOnce({
      results: ref<AvifConversionResult[]>([
        {
          file: new File(['a'], 'a.png', { type: 'image/png' }),
          blob: new Blob(['a'], { type: 'image/avif' }),
          outputName: 'a.avif',
          originalWidth: 10,
          originalHeight: 10,
          outputWidth: 10,
          outputHeight: 10,
        },
      ]),
      zipBlob: ref(new Blob(['zip'])),
      error: ref('broken'),
      isConverting: ref(false),
      isZipping: ref(true),
      canConvert: computed(() => true),
      convertImages: vi.fn(),
    } as UseAvifConversionReturn)

    const wrapper = mountView()

    expect(wrapper.find('.results-section').text()).toContain('1')
    expect(wrapper.find('.alert').text()).toContain('broken')
  })
})
