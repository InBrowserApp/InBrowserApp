import { describe, it, expect, vi, beforeEach } from 'vitest'

const messageApi = {
  success: vi.fn(),
  error: vi.fn(),
}

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')

  return {
    ...actual,
    useMessage: () => messageApi,
  }
})

vi.mock('@utils/pdf', () => ({
  mergePDFs: vi.fn(),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref<string | undefined>(undefined)
      watchEffect(() => {
        const value = isRef(source)
          ? source.value
          : typeof source === 'function'
            ? source()
            : source
        url.value = value ? 'blob:mock' : undefined
      })
      return url
    },
  }
})

import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import * as toolInfo from './info'
import { routes } from './routes'
import { toolInfo as indexToolInfo } from './index'
import MergePDFView from './MergePDFView.vue'
import { mergePDFs } from '@utils/pdf'

const mockedMerge = vi.mocked(mergePDFs)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

const BaseStub = defineComponent({
  name: 'BaseStub',
  inheritAttrs: false,
  template: '<div><slot /></div>',
})

const CardStub = defineComponent({
  name: 'NCard',
  inheritAttrs: false,
  template: '<div v-bind="$attrs"><slot /></div>',
})

const TextStub = defineComponent({
  name: 'NText',
  inheritAttrs: false,
  template: '<span v-bind="$attrs"><slot /></span>',
})

const AlertStub = defineComponent({
  name: 'NAlert',
  inheritAttrs: false,
  props: {
    title: String,
  },
  template: '<div v-bind="$attrs"><strong>{{ title }}</strong><slot /></div>',
})

const ButtonStub = defineComponent({
  name: 'NButton',
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    tag: String,
    href: String,
    download: String,
    loading: Boolean,
  },
  emits: ['click'],
  template:
    '<component :is="tag || \'button\'" :disabled="disabled" :href="href" :download="download" v-bind="$attrs" @click="disabled ? null : $emit(\'click\')"><slot /></component>',
})

const UploadStub = defineComponent({
  name: 'NUpload',
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    multiple: Boolean,
    showFileList: Boolean,
    accept: String,
  },
  emits: ['before-upload'],
  template: '<div v-bind="$attrs"><slot /></div>',
})

const UploadDraggerStub = defineComponent({
  name: 'NUploadDragger',
  inheritAttrs: false,
  template: '<div><slot /></div>',
})

const mountView = () =>
  mount(MergePDFView, {
    global: {
      plugins: [i18n],
      stubs: {
        ToolDefaultPageLayout: BaseStub,
        ToolSection: BaseStub,
        ToolSectionHeader: BaseStub,
        NAlert: AlertStub,
        NButton: ButtonStub,
        NCard: CardStub,
        NFlex: BaseStub,
        NIcon: BaseStub,
        NText: TextStub,
        NUpload: UploadStub,
        NUploadDragger: UploadDraggerStub,
      },
    },
  })

type UploadPayload = {
  file: { file?: File }
  fileList: Array<{ file?: File }>
}

type MergePdfViewVm = {
  handleBeforeUpload: (payload: UploadPayload) => Promise<boolean>
  moveFile: (index: number, direction: number) => void
  mergeFiles: () => Promise<void>
  removeFile: (index: number) => void
  clearFiles: () => void
}

const createPdfFile = (name: string) =>
  new File([new Uint8Array([1, 2, 3])], name, { type: 'application/pdf' })

beforeEach(() => {
  messageApi.success.mockClear()
  messageApi.error.mockClear()
  mockedMerge.mockReset()
})

describe('merge pdf tool metadata', () => {
  it('exports tool info metadata', () => {
    expect(toolInfo.toolID).toBe('merge-pdf')
    expect(toolInfo.path).toBe('/tools/merge-pdf')
    expect(toolInfo.features).toContain('offline')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
  })

  it('exports routes that match the tool path', async () => {
    expect(routes).toHaveLength(1)
    const route = routes[0]
    if (!route) {
      throw new Error('Missing route configuration')
    }

    expect(route.name).toBe(toolInfo.toolID)
    expect(route.path).toBe(toolInfo.path)
    expect(route.component).toBeTruthy()

    if (typeof route.component !== 'function') {
      throw new Error('Expected a lazy component loader')
    }

    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(indexToolInfo.toolID).toBe(toolInfo.toolID)
  })
})

describe('MergePDFView', () => {
  it('uploads, reorders, and merges PDF files', async () => {
    mockedMerge.mockResolvedValue(new Blob(['merged'], { type: 'application/pdf' }))

    const wrapper = mountView()
    const vm = wrapper.vm as unknown as MergePdfViewVm

    const first = createPdfFile('first.pdf')
    const second = createPdfFile('second.pdf')

    await vm.handleBeforeUpload({ file: { file: first }, fileList: [{ file: first }] })
    await vm.handleBeforeUpload({ file: { file: second }, fileList: [{ file: second }] })
    await flushPromises()

    const items = wrapper.findAll('[data-testid="pdf-file-item"]')
    expect(items).toHaveLength(2)
    expect(items[0]?.text()).toContain('first.pdf')
    expect(items[1]?.text()).toContain('second.pdf')

    vm.moveFile(0, -1)
    vm.moveFile(0, 1)
    await flushPromises()

    const reorderedItems = wrapper.findAll('[data-testid="pdf-file-item"]')
    expect(reorderedItems[0]?.text()).toContain('second.pdf')
    expect(reorderedItems[1]?.text()).toContain('first.pdf')

    const mergeButton = wrapper.find('[data-testid="merge-files"]')
    await mergeButton.trigger('click')
    await flushPromises()

    expect(mockedMerge).toHaveBeenCalledTimes(1)
    expect(mockedMerge).toHaveBeenCalledWith([second, first])
    expect(messageApi.success).toHaveBeenCalled()

    const downloadLink = wrapper.find('a[download]')
    expect(downloadLink.exists()).toBe(true)
    expect(downloadLink.attributes('download')).toBe('merged.pdf')
    expect(downloadLink.attributes('href')).toBe('blob:mock')
  })

  it('rejects non-PDF uploads and requires multiple files', async () => {
    const wrapper = mountView()
    const vm = wrapper.vm as unknown as MergePdfViewVm

    const invalidFile = new File(['note'], 'note.txt', { type: 'text/plain' })
    await vm.handleBeforeUpload({ file: { file: invalidFile }, fileList: [{ file: invalidFile }] })
    await flushPromises()

    expect(messageApi.error).toHaveBeenCalledWith('Only PDF files are allowed')
    expect(wrapper.findAll('[data-testid="pdf-file-item"]').length).toBe(0)
    messageApi.error.mockClear()

    const pdfFile = createPdfFile('single.pdf')
    await vm.handleBeforeUpload({ file: { file: pdfFile }, fileList: [{ file: pdfFile }] })
    await flushPromises()

    await vm.mergeFiles()

    expect(mockedMerge).not.toHaveBeenCalled()
    expect(messageApi.error).toHaveBeenCalledWith('At least two PDF files are required to merge')

    const removeButtons = wrapper.findAll('[data-testid="remove-file"]')
    const removeButton = removeButtons[0]
    if (!removeButton) {
      throw new Error('Expected a remove button')
    }
    await removeButton.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('[data-testid="pdf-file-item"]').length).toBe(0)

    const anotherPdf = createPdfFile('another.pdf')
    await vm.handleBeforeUpload({ file: { file: anotherPdf }, fileList: [{ file: anotherPdf }] })
    await flushPromises()

    const clearButton = wrapper.find('[data-testid="clear-files"]')
    await clearButton.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('[data-testid="pdf-file-item"]').length).toBe(0)
  })

  it('surfaces merge failures', async () => {
    mockedMerge.mockRejectedValueOnce(new Error('Boom'))

    const wrapper = mountView()
    const vm = wrapper.vm as unknown as MergePdfViewVm

    const first = createPdfFile('alpha.pdf')
    const second = createPdfFile('beta.pdf')

    await vm.handleBeforeUpload({ file: { file: first }, fileList: [{ file: first }] })
    await vm.handleBeforeUpload({ file: { file: second }, fileList: [{ file: second }] })
    await flushPromises()

    const mergeButton = wrapper.find('[data-testid="merge-files"]')
    await mergeButton.trigger('click')
    await flushPromises()

    expect(messageApi.error).toHaveBeenCalledWith('Boom')

    mockedMerge.mockRejectedValueOnce('failure')
    await mergeButton.trigger('click')
    await flushPromises()

    expect(messageApi.error).toHaveBeenCalledWith('Failed to merge PDFs')
  })
})
