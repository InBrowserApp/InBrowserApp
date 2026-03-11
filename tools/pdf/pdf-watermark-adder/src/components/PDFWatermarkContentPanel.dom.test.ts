import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import PDFWatermarkContentPanel from './PDFWatermarkContentPanel.vue'

const createProps = (
  overrides: Partial<InstanceType<typeof PDFWatermarkContentPanel>['$props']> = {},
) => ({
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
  imageErrorMessage: '',
  textPresets: ['CONFIDENTIAL', 'DRAFT', 'INTERNAL'],
  imageFile: null,
  mode: 'text' as const,
  rangeInput: '',
  text: 'CONFIDENTIAL',
  isGenerating: false,
  ...overrides,
})

describe('PDFWatermarkContentPanel', () => {
  it('handles text mode inputs and preset actions', async () => {
    const wrapper = mount(PDFWatermarkContentPanel, {
      props: createProps(),
    })

    expect(wrapper.find('[data-test="text-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="image-upload-button"]').exists()).toBe(false)

    await wrapper.get('input[value="image"]').setValue()
    await wrapper.get('[data-test="range-input"] input').setValue('1-3')
    await wrapper.get('[data-test="text-input"] textarea').setValue('TOP SECRET')

    const presetButton = wrapper.findAll('button').find((button) => button.text() === 'DRAFT')
    expect(presetButton).toBeDefined()
    await presetButton!.trigger('click')

    expect(wrapper.emitted('update-mode')).toEqual([['image']])
    expect(wrapper.emitted('update-range-input')).toEqual([['1-3']])
    expect(wrapper.emitted('update-text')).toEqual([['TOP SECRET']])
    expect(wrapper.emitted('preset-text')).toEqual([['DRAFT']])
  })

  it('handles image uploads, invalid selections, and clear action in image mode', async () => {
    const wrapper = mount(PDFWatermarkContentPanel, {
      props: createProps({
        mode: 'image',
      }),
    })

    expect(wrapper.find('[data-test="text-input"]').exists()).toBe(false)
    await wrapper.get('input[value="text"]').setValue()
    expect(wrapper.emitted('update-mode')).toEqual([['text']])

    const fileInput = wrapper.get('input[type="file"]')
    const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, 'click')
    expect(fileInput.attributes('accept')).toBe('image/*')

    await wrapper.get('[data-test="image-upload-button"]').trigger('click')
    expect(clickSpy).toHaveBeenCalledTimes(1)

    const imageFile = new File(['png'], 'logo.png', { type: 'image/png' })
    Object.defineProperty(fileInput.element, 'files', {
      value: [imageFile],
      configurable: true,
    })

    await fileInput.trigger('change')
    expect(wrapper.emitted('upload-image')).toEqual([[imageFile]])

    Object.defineProperty(fileInput.element, 'files', {
      value: [],
      configurable: true,
    })

    await fileInput.trigger('change')
    expect(wrapper.emitted('upload-image')).toHaveLength(1)

    await wrapper.setProps({
      imageFile,
      imageErrorMessage: 'Please upload a valid browser-supported watermark image.',
    })

    expect(wrapper.text()).toContain('logo.png')
    expect(wrapper.text()).toContain('Please upload a valid browser-supported watermark image.')

    await wrapper.get('button:nth-of-type(2)').trigger('click')
    expect(wrapper.emitted('clear-image')).toEqual([[]])

    clickSpy.mockRestore()
  })
})
