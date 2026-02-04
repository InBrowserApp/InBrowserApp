import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotExportSection from './CodeShotExportSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  },
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

vi.mock('./CodeShotExportPanel.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'CodeShotExportPanel',
      props: {
        filename: {
          type: String,
          default: '',
        },
        svgMarkup: {
          type: String,
          default: '',
        },
        svgWidth: {
          type: Number,
          default: 0,
        },
        svgHeight: {
          type: Number,
          default: 0,
        },
        htmlSnippet: {
          type: String,
          default: '',
        },
        htmlDocument: {
          type: String,
          default: '',
        },
        jpgBackground: {
          type: String,
          default: '',
        },
        labels: {
          type: Object,
          default: () => ({}),
        },
      },
      emits: ['update:filename'],
      template: '<div data-testid="export-panel" />',
    }),
  }
})

describe('CodeShotExportSection', () => {
  it('builds export labels and forwards props', () => {
    const wrapper = mount(CodeShotExportSection, {
      props: {
        filename: 'code-shot',
        svgMarkup: '<svg />',
        svgWidth: 120,
        svgHeight: 80,
        htmlSnippet: '<div>snippet</div>',
        htmlDocument: '<html></html>',
        jpgBackground: '#000000',
      },
    })

    const panel = wrapper.findComponent({ name: 'CodeShotExportPanel' })
    expect(panel.props('svgWidth')).toBe(120)
    expect(panel.props('svgHeight')).toBe(80)

    const labels = panel.props('labels') as Record<string, string>
    expect(labels.fileName).toBe('exportFileName')
    expect(labels.exportError).toBe('exportError')
    expect(labels.copyHtml).toBe('exportCopyHtml')
  })

  it('emits filename updates from the panel', () => {
    const wrapper = mount(CodeShotExportSection, {
      props: {
        filename: 'code-shot',
        svgMarkup: '',
        svgWidth: 0,
        svgHeight: 0,
        htmlSnippet: '',
        htmlDocument: '',
        jpgBackground: '#000000',
      },
    })

    const panel = wrapper.findComponent({ name: 'CodeShotExportPanel' })
    panel.vm.$emit('update:filename', 'updated-name')
    expect(wrapper.emitted('update:filename')?.[0]).toEqual(['updated-name'])
  })
})
