import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RemovePDFOwnerPasswordView from './RemovePDFOwnerPasswordView.vue'

const messageApi = {
  success: vi.fn(),
  error: vi.fn(),
}

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: { filename?: string }) => params?.filename ?? key,
    }),
  }
})

vi.mock('naive-ui', () => ({
  NButton: {
    props: ['href', 'download', 'tag', 'type'],
    template: '<a class="button" :href="href" :download="download"><slot /></a>',
  },
  NFlex: {
    template: '<div class="flex"><slot /></div>',
  },
  NIcon: {
    template: '<span class="icon" />',
  },
  useMessage: () => messageApi,
}))

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}))

vi.mock('@shared/ui/domain/pdf', () => ({
  PDFUpload: {
    name: 'PDFUpload',
    emits: ['upload-file'],
    template: '<button class="upload" />',
  },
}))

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (blobRef: { value: Blob | null }) =>
      computed(() => (blobRef.value ? 'blob:mock' : undefined)),
  }
})

const removePDFOwnerPassword = vi.fn()
vi.mock('@utils/pdf', () => ({
  removePDFOwnerPassword: (...args: unknown[]) => removePDFOwnerPassword(...args),
}))

vi.mock('./WhatIsPDFOwnerPassword.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

describe('RemovePDFOwnerPasswordView', () => {
  beforeEach(() => {
    messageApi.success.mockClear()
    messageApi.error.mockClear()
    removePDFOwnerPassword.mockReset()
  })

  it('shows the download button after a successful upload', async () => {
    const file = new File(['pdf'], 'test.pdf', { type: 'application/pdf' })
    removePDFOwnerPassword.mockResolvedValue(new Blob(['out']))

    const wrapper = mount(RemovePDFOwnerPasswordView)
    expect(wrapper.find('a.button').exists()).toBe(false)

    wrapper.findComponent({ name: 'PDFUpload' }).vm.$emit('upload-file', file)
    await flushPromises()

    expect(removePDFOwnerPassword).toHaveBeenCalledWith(file)
    expect(messageApi.success).toHaveBeenCalledWith('success')

    const link = wrapper.find('a.button')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('blob:mock')
    expect(link.attributes('download')).toBe('test.pdf')
  })

  it('falls back to the default filename when missing', async () => {
    const file = new File(['pdf'], '', { type: 'application/pdf' })
    removePDFOwnerPassword.mockResolvedValue(new Blob(['out']))

    const wrapper = mount(RemovePDFOwnerPasswordView)
    wrapper.findComponent({ name: 'PDFUpload' }).vm.$emit('upload-file', file)
    await flushPromises()

    const link = wrapper.find('a.button')
    expect(link.attributes('download')).toBe('output.pdf')
  })

  it('shows an error when processing fails', async () => {
    const file = new File(['pdf'], 'bad.pdf', { type: 'application/pdf' })
    removePDFOwnerPassword.mockRejectedValue(new Error('boom'))

    const wrapper = mount(RemovePDFOwnerPasswordView)
    wrapper.findComponent({ name: 'PDFUpload' }).vm.$emit('upload-file', file)
    await flushPromises()

    expect(messageApi.error).toHaveBeenCalledWith('boom')
    expect(wrapper.find('a.button').exists()).toBe(false)
  })
})
