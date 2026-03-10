import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent } from 'vue'
import ConversionResults from './ConversionResults.vue'
import ImageToAvifNote from './ImageToAvifNote.vue'
import ImageToAvifResultsSection from './ImageToAvifResultsSection.vue'
import ResultCard from './ResultCard.vue'

const useObjectUrlMock = vi.hoisted(() =>
  vi.fn((source: { value: Blob | null } | undefined) =>
    computed(() => (source?.value ? 'blob:mock' : null)),
  ),
)

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useObjectUrl: useObjectUrlMock,
  }
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<header><slot /></header>',
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const baseStub = defineComponent({
    name: 'BaseStub',
    template: '<div><slot /></div>',
  })

  return {
    NButton: defineComponent({
      name: 'NButton',
      props: {
        disabled: Boolean,
        tag: String,
        href: String,
        download: String,
        loading: Boolean,
      },
      template:
        '<component :is="tag || \'button\'" :disabled="disabled" :href="href" :download="download"><slot name="icon" /><slot /></component>',
    }),
    NCard: baseStub,
    NFlex: baseStub,
    NGi: baseStub,
    NGrid: baseStub,
    NIcon: baseStub,
    NText: baseStub,
  }
})

function mountWithI18n(component: object, options: Record<string, unknown> = {}) {
  const optionGlobal = (options.global as Record<string, unknown> | undefined) ?? {}

  return mount(component as never, {
    ...options,
    global: {
      ...optionGlobal,
      stubs: {
        ToolSection: ToolSectionStub,
        ToolSectionHeader: ToolSectionHeaderStub,
        ...(optionGlobal.stubs as Record<string, unknown> | undefined),
      },
    },
  })
}

function createResult(outputName = 'image.avif', source = 'source', encoded = 'encoded') {
  return {
    file: new File([source], 'image.png', { type: 'image/png' }),
    blob: new Blob([encoded], { type: 'image/avif' }),
    outputName,
    originalWidth: 100,
    originalHeight: 50,
    outputWidth: 100,
    outputHeight: 50,
  }
}

describe('ResultCard', () => {
  beforeEach(() => {
    useObjectUrlMock.mockReset()
    useObjectUrlMock.mockImplementation((source: { value: Blob | null } | undefined) =>
      computed(() => (source?.value ? 'blob:mock' : null)),
    )
  })

  it('renders the file metadata and preview url', () => {
    const wrapper = mountWithI18n(ResultCard, {
      props: {
        result: createResult(),
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
      },
    })

    expect(wrapper.text()).toContain('image.avif')
    expect(wrapper.text()).toContain('Original')
    expect(wrapper.find('img').attributes('src')).toBe('blob:mock')
  })

  it('formats small savings with one decimal place', async () => {
    const wrapper = mountWithI18n(ResultCard, {
      props: {
        result: createResult('small.avif', '12345678901234567890', '1234567890123456789'),
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
      },
    })

    expect(wrapper.text()).toContain('Saved: 1 B (5.0%)')

    await wrapper.setProps({
      result: createResult('small.avif', '1234567890', '1234567890'),
    } as never)
    expect(wrapper.text()).toContain('Saved: 0 B (0%)')
  })

  it('hides the preview and handles zero-byte sources', () => {
    useObjectUrlMock.mockReturnValueOnce(computed(() => null))

    const wrapper = mountWithI18n(ResultCard, {
      props: {
        result: createResult('empty.avif', '', ''),
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Saved: 0 B (0%)')
  })
})

describe('ConversionResults and sections', () => {
  it('renders single and batch download actions', () => {
    const singleWrapper = mountWithI18n(ConversionResults, {
      props: {
        title: 'Results',
        countLabel: '1 result',
        results: [createResult()],
        zipBlob: null,
        isZipping: false,
        downloadZipName: 'images.zip',
        downloadAvifLabel: 'Download AVIF',
        downloadZipLabel: 'Download ZIP',
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
        totalSavedLabel: 'Total saved',
      },
    })

    expect(singleWrapper.text()).toContain('Download AVIF')

    const batchWrapper = mountWithI18n(ConversionResults, {
      props: {
        title: 'Results',
        countLabel: '2 results',
        results: [createResult('one.avif'), createResult('two.avif')],
        zipBlob: new Blob(['zip']),
        isZipping: true,
        downloadZipName: 'images.zip',
        downloadAvifLabel: 'Download AVIF',
        downloadZipLabel: 'Download ZIP',
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
        totalSavedLabel: 'Total saved',
      },
    })

    expect(batchWrapper.text()).toContain('Download ZIP')
    expect(batchWrapper.text()).toContain('Total saved')
  })

  it('formats total savings for small deltas and hides them for empty results', async () => {
    const wrapper = mountWithI18n(ConversionResults, {
      props: {
        title: 'Results',
        countLabel: '1 result',
        results: [createResult('tiny.avif', '12345678901234567890', '1234567890123456789')],
        zipBlob: null,
        isZipping: false,
        downloadZipName: 'images.zip',
        downloadAvifLabel: 'Download AVIF',
        downloadZipLabel: 'Download ZIP',
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
        totalSavedLabel: 'Total saved',
      },
    })

    expect(wrapper.text()).toContain('Total saved: 1 B (5.0%)')

    await wrapper.setProps({ results: [] } as never)
    expect(wrapper.text()).not.toContain('Total saved')
    expect(wrapper.find('a').attributes('download')).toBe('image.avif')
    expect(wrapper.find('a').attributes('href')).toBeUndefined()
  })

  it('disables the batch download action until a ZIP blob exists and formats 0% totals', () => {
    const wrapper = mountWithI18n(ConversionResults, {
      props: {
        title: 'Results',
        countLabel: '2 results',
        results: [
          createResult('one.avif', '1234', '1234'),
          createResult('two.avif', '5678', '5678'),
        ],
        zipBlob: null,
        isZipping: false,
        downloadZipName: 'images.zip',
        downloadAvifLabel: 'Download AVIF',
        downloadZipLabel: 'Download ZIP',
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
        totalSavedLabel: 'Total saved',
      },
    })

    const anchor = wrapper.find('a')
    expect(anchor.attributes('download')).toBe('images.zip')
    expect(anchor.attributes('href')).toBeUndefined()
    expect(wrapper.text()).toContain('Total saved: 0 B (0%)')
  })

  it('computes a zero-byte total even when the summary is hidden', () => {
    const wrapper = mountWithI18n(ConversionResults, {
      props: {
        title: 'Results',
        countLabel: '1 result',
        results: [createResult('zero.avif', '', '')],
        zipBlob: null,
        isZipping: false,
        downloadZipName: 'images.zip',
        downloadAvifLabel: 'Download AVIF',
        downloadZipLabel: 'Download ZIP',
        originalLabel: 'Original',
        outputLabel: 'Output',
        savedLabel: 'Saved',
        dimensionsLabel: 'Dimensions',
        fileSizeLabel: 'File size',
        totalSavedLabel: 'Total saved',
      },
    })

    expect((wrapper.vm as unknown as { totalSavedText: string }).totalSavedText).toBe('0 B (0%)')
    expect(wrapper.text()).not.toContain('Total saved')
  })

  it('builds localized labels in ImageToAvifResultsSection', () => {
    const wrapper = mountWithI18n(ImageToAvifResultsSection, {
      props: {
        results: [createResult()],
        zipBlob: null,
        isZipping: false,
        downloadZipName: 'images.zip',
      },
      global: {
        stubs: {
          ConversionResults: defineComponent({
            name: 'ConversionResults',
            props: ['title', 'downloadAvifLabel', 'downloadZipLabel'],
            template:
              '<div class="results-props">{{ title }}|{{ downloadAvifLabel }}|{{ downloadZipLabel }}</div>',
          }),
        },
      },
    })

    expect(wrapper.text()).toContain('Results')
    expect(wrapper.text()).toContain('Download AVIF')
    expect(wrapper.text()).toContain('Download AVIF ZIP')
  })

  it('renders the local note copy', () => {
    const wrapper = mountWithI18n(ImageToAvifNote)
    expect(wrapper.text()).toContain('Runs locally in your browser')
  })
})
