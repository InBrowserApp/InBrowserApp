import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CodeShotExportPanel from './CodeShotExportPanel.vue'
import { rasterizeSvg } from '../utils/raster'

vi.mock('../utils/raster', () => ({
  rasterizeSvg: vi.fn(),
}))

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')

  return {
    useDebounceFn: (fn: () => void) => fn,
    useObjectUrl: (blobRef: { value?: Blob | null } | null | undefined) =>
      computed(() => (blobRef && 'value' in blobRef && blobRef.value ? 'blob:mock' : null)),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')

  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: {
        content: {
          type: String,
          default: '',
        },
        disabled: {
          type: Boolean,
          default: false,
        },
        variant: {
          type: String,
          default: 'tertiary',
        },
      },
      template: '<button type="button"><slot name="label" /></button>',
    }),
  }
})

vi.mock('@vicons/fluent/Image24Regular', () => ({
  default: defineComponent({ name: 'ImageIcon', template: '<span />' }),
}))
vi.mock('@vicons/fluent/Code24Regular', () => ({
  default: defineComponent({ name: 'CodeIcon', template: '<span />' }),
}))
vi.mock('@vicons/fluent/Document16Regular', () => ({
  default: defineComponent({ name: 'DocumentIcon', template: '<span />' }),
}))
vi.mock('@vicons/fluent/Copy24Regular', () => ({
  default: defineComponent({ name: 'CopyIcon', template: '<span />' }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div class="n-alert"><slot /></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      props: {
        tag: {
          type: String,
          default: 'button',
        },
        href: {
          type: String,
          default: undefined,
        },
        download: {
          type: String,
          default: undefined,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
        loading: {
          type: Boolean,
          default: false,
        },
      },
      template:
        '<component :is="tag" :href="href" :download="download" :data-disabled="disabled" :data-loading="loading"><slot /></component>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NFormItem: defineComponent({
      name: 'NFormItem',
      template: '<label><slot /></label>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon"><slot /></span>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template: '<input :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NRadioButton: defineComponent({
      name: 'NRadioButton',
      template: '<button type="button"><slot /></button>',
    }),
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      props: {
        value: {
          type: Number,
          default: 1,
        },
      },
      emits: ['update:value'],
      template: '<div><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

const labels = {
  fileName: 'File name',
  scale: 'Scale',
  rendering: 'Rendering',
  png: 'PNG',
  jpg: 'JPG',
  webp: 'WebP',
  svg: 'SVG',
  html: 'HTML',
  copySvg: 'Copy SVG',
  copyHtml: 'Copy HTML',
  exportError: 'Export failed',
}

beforeEach(() => {
  vi.mocked(rasterizeSvg).mockReset()
})

describe('CodeShotExportPanel', () => {
  it('skips raster generation when svg markup is missing', async () => {
    const wrapper = mount(CodeShotExportPanel, {
      props: {
        filename: '   ',
        svgMarkup: '',
        svgWidth: 0,
        svgHeight: 0,
        htmlSnippet: '',
        htmlDocument: '',
        jpgBackground: '#000000',
        labels,
      },
    })

    await flushPromises()

    expect(rasterizeSvg).not.toHaveBeenCalled()

    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    expect(buttons).toHaveLength(5)

    const downloads = buttons.map((button) => button.props('download'))
    expect(downloads).toEqual([
      'code-shot.png',
      'code-shot.jpg',
      'code-shot.webp',
      'code-shot.svg',
      'code-shot.html',
    ])

    buttons.forEach((button) => {
      expect(button.props('tag')).toBe('a')
      expect(button.props('disabled')).toBe(true)
    })
  })

  it('generates raster outputs and normalizes filenames', async () => {
    vi.mocked(rasterizeSvg).mockImplementation(async ({ format }: { format: string }) => {
      if (format === 'png') {
        return new Blob(['png'], { type: 'image/png' })
      }
      if (format === 'jpeg') {
        return new Blob(['jpg'], { type: 'image/jpeg' })
      }
      return new Blob(['webp'], { type: 'image/webp' })
    })

    const wrapper = mount(CodeShotExportPanel, {
      props: {
        filename: 'My / File',
        svgMarkup: '<svg />',
        svgWidth: 120,
        svgHeight: 80,
        htmlSnippet: '<div>snippet</div>',
        htmlDocument: '<html></html>',
        jpgBackground: '#000000',
        labels,
      },
    })

    await flushPromises()

    expect(rasterizeSvg).toHaveBeenCalledTimes(3)
    expect(rasterizeSvg).toHaveBeenCalledWith(
      expect.objectContaining({ format: 'png', scale: 2, width: 120, height: 80 }),
    )
    expect(rasterizeSvg).toHaveBeenCalledWith(
      expect.objectContaining({ format: 'jpeg', scale: 2, width: 120, height: 80 }),
    )
    expect(rasterizeSvg).toHaveBeenCalledWith(
      expect.objectContaining({ format: 'webp', scale: 2, width: 120, height: 80 }),
    )

    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const downloads = buttons.map((button) => button.props('download'))
    expect(downloads).toEqual([
      'My---File.png',
      'My---File.jpg',
      'My---File.webp',
      'My---File.svg',
      'My---File.html',
    ])
    buttons.forEach((button) => {
      expect(button.props('disabled')).toBe(false)
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', 'New Name')
    expect(wrapper.emitted('update:filename')?.[0]).toEqual(['New Name'])
  })

  it('shows errors when raster generation fails', async () => {
    vi.mocked(rasterizeSvg).mockRejectedValue(new Error('Boom'))

    const wrapper = mount(CodeShotExportPanel, {
      props: {
        filename: 'code-shot',
        svgMarkup: '<svg />',
        svgWidth: 120,
        svgHeight: 80,
        htmlSnippet: '<div>snippet</div>',
        htmlDocument: '<html></html>',
        jpgBackground: '#000000',
        labels,
      },
    })

    await flushPromises()

    const alert = wrapper.findComponent({ name: 'NAlert' })
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('Boom')

    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    buttons.slice(0, 3).forEach((button) => {
      expect(button.props('disabled')).toBe(true)
    })
  })
})
