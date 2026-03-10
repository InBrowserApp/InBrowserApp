import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from '../pdf-errors'
import PDFOrganizerToolbar from './PDFOrganizerToolbar.vue'

describe('PDFOrganizerToolbar', () => {
  const clickButton = async (wrapper: ReturnType<typeof mount>, label: string) => {
    const button = wrapper.findAll('button').find((item) => item.text() === label)
    expect(button, `missing button ${label}`).toBeTruthy()
    await button?.trigger('click')
  }

  it('renders summary, emits actions, and exposes download anchor', async () => {
    const wrapper = mount(PDFOrganizerToolbar, {
      props: {
        pageCount: 8,
        selectedCount: 3,
        hasChanges: true,
        canUndo: true,
        canRedo: true,
        isGenerating: false,
        canExport: true,
        hasResult: true,
        thumbnailSize: 'comfortable',
        downloadUrl: 'blob:demo',
        resultFilename: 'organized.pdf',
        generateErrorCode: '',
      },
    })

    expect(wrapper.text()).toContain('8')
    expect(wrapper.text()).toContain('3')

    await clickButton(wrapper, 'Undo')
    await clickButton(wrapper, 'Redo')
    await clickButton(wrapper, 'Select all')
    await clickButton(wrapper, 'Clear selection')
    await clickButton(wrapper, 'Rotate left')
    await clickButton(wrapper, 'Rotate right')
    await clickButton(wrapper, 'Delete selected')
    await clickButton(wrapper, 'Reset')
    await wrapper.get('input').setValue('5')
    await wrapper.get('input').trigger('change')
    await wrapper.get('input').trigger('blur')
    await wrapper.vm.$nextTick()
    await clickButton(wrapper, 'Jump')
    await clickButton(wrapper, 'Compact')
    await clickButton(wrapper, 'Export PDF')

    expect(wrapper.emitted('undo')).toBeTruthy()
    expect(wrapper.emitted('redo')).toBeTruthy()
    expect(wrapper.emitted('select-all')).toBeTruthy()
    expect(wrapper.emitted('clear-selection')).toBeTruthy()
    expect(wrapper.emitted('rotate-left')).toBeTruthy()
    expect(wrapper.emitted('rotate-right')).toBeTruthy()
    expect(wrapper.emitted('delete-selection')).toBeTruthy()
    expect(wrapper.emitted('reset')).toBeTruthy()
    expect(wrapper.emitted('jump-to-page')?.[0]).toEqual([5])
    expect(wrapper.emitted('set-thumbnail-size')?.[0]).toEqual(['compact'])
    expect(wrapper.emitted('export')).toBeTruthy()

    const anchor = wrapper.get('a[download="organized.pdf"]')
    expect(anchor.attributes('href')).toBe('blob:demo')
  })

  it('shows export error messages', () => {
    const wrapper = mount(PDFOrganizerToolbar, {
      props: {
        pageCount: 1,
        selectedCount: 0,
        hasChanges: false,
        canUndo: false,
        canRedo: false,
        isGenerating: false,
        canExport: true,
        hasResult: false,
        thumbnailSize: 'compact',
        resultFilename: '',
        generateErrorCode: PDF_ERROR.WorkerUnsupported,
      },
    })

    expect(wrapper.text()).toContain('does not support PDF export workers')
  })

  it('clamps jump targets, maps remaining error states, and exposes scrolling', async () => {
    const scrollIntoViewMock = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    })

    const wrapper = mount(PDFOrganizerToolbar, {
      props: {
        pageCount: 0,
        selectedCount: 0,
        hasChanges: false,
        canUndo: false,
        canRedo: false,
        isGenerating: false,
        canExport: false,
        hasResult: false,
        thumbnailSize: 'large',
        resultFilename: '',
        generateErrorCode: PDF_ERROR.Encrypted,
      },
    })

    expect(wrapper.text()).toContain('Please remove the owner password first')
    await clickButton(wrapper, 'Jump')
    expect(wrapper.emitted('jump-to-page')).toBeUndefined()

    await wrapper.setProps({
      pageCount: 2,
      generateErrorCode: PDF_ERROR.ExportFailed,
    })
    await wrapper.get('input').setValue('8')
    await wrapper.get('input').trigger('change')
    await wrapper.get('input').trigger('blur')
    await wrapper.vm.$nextTick()
    await clickButton(wrapper, 'Jump')
    expect(wrapper.emitted('jump-to-page')?.[0]).toEqual([2])
    expect(wrapper.text()).toContain('Failed to export organized PDF')
    ;(wrapper.vm as unknown as { scrollIntoView: () => void }).scrollIntoView()
    expect(scrollIntoViewMock).toHaveBeenCalled()
  })
})
