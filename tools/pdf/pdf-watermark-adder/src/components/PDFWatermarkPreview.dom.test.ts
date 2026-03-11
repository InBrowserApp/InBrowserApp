import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

const { usePdfWatermarkPreviewMock } = vi.hoisted(() => ({
  usePdfWatermarkPreviewMock: vi.fn(),
}))

vi.mock('./usePdfWatermarkPreview', () => ({
  usePdfWatermarkPreview: (props: unknown) => usePdfWatermarkPreviewMock(props),
}))

import PDFWatermarkPreview from './PDFWatermarkPreview.vue'

describe('PDFWatermarkPreview', () => {
  it('renders preview state and forwards pagination updates to the composable', async () => {
    const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
    const previewPage = ref(2)
    const totalPreviewPages = ref(3)
    const isRenderingPage = ref(false)
    const hasPreviewError = ref(false)
    const setPreviewPage = vi.fn()

    usePdfWatermarkPreviewMock.mockReturnValue({
      previewCanvasRef,
      previewPage,
      totalPreviewPages,
      isRenderingPage,
      hasPreviewError,
      setPreviewPage,
    })

    const wrapper = mount(PDFWatermarkPreview, {
      props: {
        title: 'Preview',
        hint: 'Inspect the current watermark placement.',
        loadFailed: 'Preview unavailable',
        file: new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
        pageCount: 4,
        rangeInput: '',
        rangeErrorCode: '',
        mode: 'text',
        text: 'CONFIDENTIAL',
        fontFamily: 'sans-serif',
        fontSize: 48,
        color: '#000000',
        opacity: 20,
        rotation: -35,
        position: 'center',
        offsetX: 0,
        offsetY: 0,
        imageFile: null,
        imageScale: 25,
      },
      global: {
        stubs: {
          ToolSectionHeader: defineComponent({
            name: 'ToolSectionHeader',
            template: '<h2><slot /></h2>',
          }),
        },
      },
    })

    expect(usePdfWatermarkPreviewMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Preview')
    expect(wrapper.text()).toContain('Inspect the current watermark placement.')
    expect(wrapper.find('[data-test="preview-page-canvas"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="preview-paper"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="preview-pagination"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="preview-error"]').exists()).toBe(false)

    const paginationItem = wrapper
      .findAll('.n-pagination-item--clickable')
      .find((node) => node.text() === '3')

    expect(paginationItem).toBeDefined()
    if (paginationItem) {
      await paginationItem.trigger('click')
    }
    expect(setPreviewPage).toHaveBeenCalledWith(3)

    isRenderingPage.value = true
    hasPreviewError.value = true
    totalPreviewPages.value = 1
    await nextTick()

    expect(wrapper.find('.preview-spin').exists()).toBe(true)
    expect(wrapper.get('[data-test="preview-error"]').text()).toContain('Preview unavailable')
    expect(wrapper.find('[data-test="preview-pagination"]').exists()).toBe(false)
  })
})
