import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { createI18n } from 'vue-i18n'
import ImageToPdfConverter from './ImageToPdfConverter.vue'

const messageMock = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
}

const composableMocks = vi.hoisted(() => ({
  useImageToPdfConverterMock: vi.fn(),
}))

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')

  return {
    ...actual,
    useMessage: () => messageMock,
  }
})

vi.mock('../composables/useImageToPdfConverter', () => ({
  useImageToPdfConverter: () => composableMocks.useImageToPdfConverterMock(),
}))

const UploadStub = defineComponent({
  name: 'ImageToPdfUploadSection',
  emits: ['add-file'],
  setup(_, { emit }) {
    const file = new File(['image'], 'receipt.jpg', { type: 'image/jpeg' })
    return {
      emitUpload: () => emit('add-file', file),
    }
  },
  template: '<button class="upload" @click="emitUpload">upload</button>',
})

const GenerateStub = defineComponent({
  name: 'ImageToPdfGenerateSection',
  emits: ['generate'],
  template: '<button class="generate" @click="$emit(\'generate\')">generate</button>',
})

const VoidStub = defineComponent({
  name: 'VoidStub',
  template: '<div />',
})

describe('ImageToPdfConverter', () => {
  beforeEach(() => {
    messageMock.success.mockClear()
    messageMock.error.mockClear()
    messageMock.warning.mockClear()
  })

  it('shows a warning when a duplicate file is added', async () => {
    const state = createComposableState()
    state.addFile.mockResolvedValue('duplicate')
    composableMocks.useImageToPdfConverterMock.mockReturnValue(state)

    const wrapper = mountConverter()
    await wrapper.get('.upload').trigger('click')
    await flushPromises()

    expect(messageMock.warning).toHaveBeenCalledWith('This image is already in the queue.')
  })

  it('shows an error when an invalid image is added', async () => {
    const state = createComposableState()
    state.addFile.mockResolvedValue('invalid-image')
    composableMocks.useImageToPdfConverterMock.mockReturnValue(state)

    const wrapper = mountConverter()
    await wrapper.get('.upload').trigger('click')
    await flushPromises()

    expect(messageMock.error).toHaveBeenCalledWith(
      'Failed to read this image. Please choose another file.',
    )
  })

  it('shows success after generating a PDF', async () => {
    const state = createComposableState()
    state.generate.mockResolvedValue({ success: true })
    composableMocks.useImageToPdfConverterMock.mockReturnValue(state)

    const wrapper = mountConverter()
    await wrapper.get('.generate').trigger('click')
    await flushPromises()

    expect(messageMock.success).toHaveBeenCalledWith('PDF created successfully.')
  })

  it('maps canvas export failures to the specific message', async () => {
    const state = createComposableState()
    state.generate.mockResolvedValue({ success: false, code: 'canvas-unavailable' })
    composableMocks.useImageToPdfConverterMock.mockReturnValue(state)

    const wrapper = mountConverter()
    await wrapper.get('.generate').trigger('click')
    await flushPromises()

    expect(messageMock.error).toHaveBeenCalledWith(
      'Your browser cannot export images to PDF in this environment.',
    )
  })
})

function mountConverter() {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: {} },
    missingWarn: false,
    fallbackWarn: false,
  })

  return mount(ImageToPdfConverter, {
    global: {
      plugins: [i18n],
      stubs: {
        ImageToPdfUploadSection: UploadStub,
        ImageToPdfQueue: VoidStub,
        ImageToPdfPageLayoutSection: VoidStub,
        ImageToPdfGenerateSection: GenerateStub,
      },
    },
  })
}

function createComposableState() {
  return {
    items: ref([]),
    options: ref({
      pageSize: 'a4',
      pageOrientation: 'auto',
      fitMode: 'contain',
      marginMm: 12,
      qualityPreset: 'balanced',
    }),
    isAddingFile: ref(false),
    isGenerating: ref(false),
    generationProgress: ref(null),
    resultBlob: ref<Blob | null>(null),
    resultFilename: ref('images.pdf'),
    resultUrl: ref<string | null>(null),
    canGenerate: ref(true),
    hasResult: ref(false),
    addFile: vi.fn(),
    rotateItem: vi.fn(),
    removeItem: vi.fn(),
    clearAll: vi.fn(),
    moveItem: vi.fn(),
    moveItemUp: vi.fn(),
    moveItemDown: vi.fn(),
    generate: vi.fn(),
  }
}
