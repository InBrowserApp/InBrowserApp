import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ConversionResults from './ConversionResults.vue'
import type { WebpConversionResult } from '../types'

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (blobRef: { value: Blob | null }) =>
      computed(() => (blobRef.value ? 'blob:mock' : '')),
  }
})

vi.mock('@vicons/fluent/ArrowDownload24Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Archive24Regular', () => ({ default: {} }))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div><slot /></div>',
  })

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div><slot /></div>',
  })

  const NGi = defineComponent({
    name: 'NGi',
    template: '<div><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span><slot /></span>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span><slot /></span>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: ['href', 'download', 'disabled', 'loading', 'tag', 'type'],
    template: '<a class="n-button" :href="href"><slot name="icon" /><slot /></a>',
  })

  return { NButton, NFlex, NGi, NGrid, NIcon, NText }
})

const ResultCardStub = defineComponent({
  name: 'ResultCard',
  props: ['result'],
  template: '<div class="result-card">{{ result.outputName }}</div>',
})

const makeResult = (
  name: string,
  originalSize: number,
  outputSize: number,
): WebpConversionResult => {
  const file = new File([new Uint8Array(originalSize)], name, { type: 'image/png' })
  const blob = new Blob([new Uint8Array(outputSize)], { type: 'image/webp' })
  return {
    file,
    blob,
    outputName: name.replace(/\.\w+$/, '.webp'),
    originalWidth: 100,
    originalHeight: 80,
    outputWidth: 90,
    outputHeight: 72,
  }
}

const baseProps = {
  title: 'Results',
  countLabel: 'Count',
  downloadZipName: 'images.zip',
  downloadWebpLabel: 'Download WebP',
  downloadZipLabel: 'Download ZIP',
  originalLabel: 'Original',
  outputLabel: 'Output',
  savedLabel: 'Saved',
  dimensionsLabel: 'Dimensions',
  fileSizeLabel: 'Size',
  totalSavedLabel: 'Total saved',
}

describe('ConversionResults', () => {
  it('renders single download and rounds larger savings', () => {
    const results = [makeResult('a.png', 1000, 800)]
    const wrapper = mount(ConversionResults, {
      props: {
        ...baseProps,
        results,
        zipBlob: null,
        isZipping: false,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h3><slot /></h3>' },
          ResultCard: ResultCardStub,
        },
      },
    })

    expect(wrapper.find('a.n-button').attributes('href')).toBe('blob:mock')
    expect(wrapper.text()).toContain('20%')
  })

  it('formats small savings with one decimal', () => {
    const results = [makeResult('b.png', 1000, 990)]
    const wrapper = mount(ConversionResults, {
      props: {
        ...baseProps,
        results,
        zipBlob: null,
        isZipping: false,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h3><slot /></h3>' },
          ResultCard: ResultCardStub,
        },
      },
    })

    expect(wrapper.text()).toContain('1.0%')
  })
})
