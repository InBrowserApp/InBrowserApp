import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotPreviewSection from './CodeShotPreviewSection.vue'
import type { BackgroundConfig, CodeShotLayout, StyledToken } from '../utils/render'
import type { Theme } from '../utils/themes'
import { themes } from '../utils/themes'

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

vi.mock('./CodeShotPreview.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'CodeShotPreview',
      props: {
        lines: {
          type: Array,
          default: () => [],
        },
        lineNumbers: {
          type: Array,
          default: () => [],
        },
        layout: {
          type: Object,
          default: () => ({}),
        },
        theme: {
          type: Object,
          default: () => ({}),
        },
        background: {
          type: Object,
          default: () => ({}),
        },
      },
      template: '<div data-testid="preview" />',
    }),
  }
})

describe('CodeShotPreviewSection', () => {
  it('passes preview props to the renderer', () => {
    const theme = themes[0]
    if (!theme) {
      throw new Error('Expected themes to exist')
    }

    const lines: StyledToken[][] = [[{ text: 'const', color: '#fff', fontStyle: 'normal' }]]
    const lineNumbers = ['1']
    const layout: CodeShotLayout = {
      fontSize: 14,
      lineHeight: 1.5,
      padding: 16,
      framePadding: 12,
      radius: 8,
      shadow: true,
      windowStyle: 'mac',
      showLineNumbers: true,
      tabSize: 2,
      fontFamily: 'Fira Mono',
    }
    const background: BackgroundConfig = { type: 'solid', color: '#fff' }

    const wrapper = mount(CodeShotPreviewSection, {
      props: {
        lines,
        lineNumbers,
        layout,
        theme,
        background,
      },
    })

    const preview = wrapper.findComponent({ name: 'CodeShotPreview' })
    expect(preview.props('lines')).toEqual(lines)
    expect(preview.props('lineNumbers')).toEqual(lineNumbers)
    expect(preview.props('layout')).toEqual(layout)
    expect(preview.props('theme')).toEqual(theme as Theme)
    expect(preview.props('background')).toEqual(background)
  })
})
