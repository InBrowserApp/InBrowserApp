import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, isRef } from 'vue'
import ConversionResults from './ConversionResults.vue'
import type { GifToAnimatedWebpResult } from '../types'
const objectUrlState = { mode: 'available' as 'available' | 'missing' }
vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        if (objectUrlState.mode === 'missing') return null
        const value = isRef(source) ? source.value : source
        return value ? 'blob:download' : null
      }),
  }
})
vi.mock('@shared/ui/tool', () => ({
  ToolSection: { template: '<section><slot /></section>' },
  ToolSectionHeader: { template: '<header><slot /></header>' },
}))
vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  const { defineComponent } = await import('vue')
  const BaseStub = defineComponent({
    name: 'BaseStub',
    inheritAttrs: false,
    template: '<div><slot /></div>',
  })
  const ButtonStub = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    props: {
      tag: String,
      href: String,
      download: String,
      disabled: Boolean,
      loading: Boolean,
    },
    template:
      '<component :is="tag || \'button\'" :href="href" :download="download" :disabled="disabled"><slot name="icon" /><slot /></component>',
  })
  return {
    ...actual,
    NButton: ButtonStub,
    NIcon: BaseStub,
    NText: BaseStub,
  }
})
vi.mock('./ResultCard.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ResultCard',
      props: ['result'],
      template: '<div class="result-card">{{ result.outputName }}</div>',
    }),
  }
})
function createResult(name: string, fileSize: number, blobSize: number): GifToAnimatedWebpResult {
  const file = new File([new Uint8Array(fileSize)], `${name}.gif`, { type: 'image/gif' })
  const blob = new Blob([new Uint8Array(blobSize)], { type: 'image/webp' })
  return {
    file,
    blob,
    outputName: `${name}.webp`,
    originalWidth: 100,
    originalHeight: 80,
    outputWidth: 100,
    outputHeight: 80,
  }
}
const baseProps = {
  title: 'Results',
  countLabel: 'Count',
  downloadZipName: 'bundle.zip',
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
  beforeEach(() => {
    objectUrlState.mode = 'available'
  })
  it('renders single download button and zero savings', () => {
    const result = createResult('demo', 1000, 1000)
    const wrapper = mount(ConversionResults, {
      props: {
        ...baseProps,
        results: [result],
        zipBlob: null,
        isZipping: false,
      },
    })
    const downloadLink = wrapper.find('a[download="demo.webp"]')
    expect(downloadLink.exists()).toBe(true)
    expect(downloadLink.attributes('href')).toBe('blob:download')
    expect(wrapper.text()).toContain('Download WebP')
    expect(wrapper.text()).toContain('(0%)')
    expect(wrapper.findAll('a')).toHaveLength(1)
  })
  it('renders batch zip download and percentage with decimals', () => {
    const results = [createResult('a', 1000, 950), createResult('b', 1000, 950)]
    const wrapper = mount(ConversionResults, {
      props: {
        ...baseProps,
        results,
        zipBlob: new Blob(['zip']),
        isZipping: false,
      },
    })
    const zipLink = wrapper.find('a[download="bundle.zip"]')
    expect(zipLink.exists()).toBe(true)
    expect(zipLink.attributes('href')).toBe('blob:download')
    expect(wrapper.text()).toContain('Download ZIP')
    expect(wrapper.text()).toContain('(5.0%)')
  })
  it('disables batch zip download when the object url is missing', () => {
    objectUrlState.mode = 'missing'
    const results = [createResult('a', 1000, 1300), createResult('b', 1000, 1300)]
    const wrapper = mount(ConversionResults, {
      props: {
        ...baseProps,
        results,
        zipBlob: new Blob(['zip']),
        isZipping: false,
      },
    })
    const zipLink = wrapper.find('a[download="bundle.zip"]')
    expect(zipLink.exists()).toBe(true)
    expect(zipLink.attributes('href')).toBeUndefined()
    expect(zipLink.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('(-30%)')
  })
  it('keeps single download disabled when there is no single result blob', () => {
    const wrapper = mount(ConversionResults, {
      props: {
        ...baseProps,
        results: [],
        zipBlob: null,
        isZipping: false,
      },
    })
    const singleLink = wrapper.find('a[download="image.webp"]')
    expect(singleLink.exists()).toBe(true)
    expect(singleLink.attributes('href')).toBeUndefined()
    expect(singleLink.attributes('disabled')).toBeDefined()
  })
  it('falls back to default download state when there are no results', () => {
    objectUrlState.mode = 'missing'
    const wrapper = mount(ConversionResults, {
      props: {
        ...baseProps,
        results: [],
        zipBlob: null,
        isZipping: false,
      },
    })
    const singleLink = wrapper.find('a[download="image.webp"]')
    expect(singleLink.exists()).toBe(true)
    expect(singleLink.attributes('href')).toBeUndefined()
    expect(singleLink.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).not.toContain('Total saved')
  })
})
