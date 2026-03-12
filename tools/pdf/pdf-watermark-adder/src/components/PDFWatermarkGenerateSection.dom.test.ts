import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PDFWatermarkGenerateSection from './PDFWatermarkGenerateSection.vue'

const createProps = (
  overrides: Partial<InstanceType<typeof PDFWatermarkGenerateSection>['$props']> = {},
) => ({
  title: 'Generate Result',
  generateLabel: 'Generate watermarked PDF',
  generatingLabel: 'Generating...',
  resultReadyLabel: 'Result ready:',
  downloadLabel: 'Download',
  generateErrorMessage: '',
  isGenerating: false,
  canGenerate: true,
  hasResult: false,
  resultUrl: null,
  resultFilename: 'output.pdf',
  ...overrides,
})

describe('PDFWatermarkGenerateSection', () => {
  it('emits generate and renders the result download link when available', async () => {
    const wrapper = mount(PDFWatermarkGenerateSection, {
      props: createProps({
        hasResult: true,
        resultUrl: 'blob:output',
      }),
    })

    await wrapper.get('[data-test="generate-button"]').trigger('click')
    expect(wrapper.emitted('generate')).toEqual([[]])

    const downloadLink = wrapper.get('a[download="output.pdf"]')
    expect(downloadLink.attributes('href')).toBe('blob:output')
    expect(wrapper.text()).toContain('Result ready:')
  })

  it('shows loading and error states and disables generation when it cannot run', () => {
    const wrapper = mount(PDFWatermarkGenerateSection, {
      props: createProps({
        isGenerating: true,
        canGenerate: false,
        generateErrorMessage: 'Failed to generate the watermarked PDF.',
      }),
    })

    expect(wrapper.text()).toContain('Generating...')
    expect(wrapper.text()).toContain('Failed to generate the watermarked PDF.')
    expect(wrapper.get('[data-test="generate-button"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('a[download="output.pdf"]').exists()).toBe(false)
  })
})
