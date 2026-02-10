import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CodeScreenshotGenerator from './CodeScreenshotGenerator.vue'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: unknown) => ref(initialValue),
    useDebounce: <T>(value: T) => value,
  }
})

vi.mock('../utils/languages', () => ({
  registerHighlightLanguages: vi.fn(),
}))

vi.mock('../utils/themes', () => ({
  DEFAULT_MONO_FONT: 'Test Mono',
  getThemeById: vi.fn((id: string) => ({ id, background: '#0a0a0a', foreground: '#ffffff' })),
  getBackgroundPreset: vi.fn((id: string) => ({ id, colors: ['#ffffff'] })),
}))

vi.mock('../utils/render', () => ({
  normalizeCode: (value: string) => value.trim(),
  highlightToTokens: vi.fn(() => ['tokens']),
  applyTokenStyles: vi.fn(() => ['styled']),
  tokensToLines: vi.fn(() => [{ tokens: ['line-1'] }, { tokens: ['line-2'] }]),
  buildLineNumbers: vi.fn((length: number) => Array.from({ length }, (_, index) => index + 1)),
  buildCodeShotSvg: vi.fn(() => ({ svg: '<svg />', width: 120, height: 80 })),
  buildHtmlSnippet: vi.fn(() => '<div>snippet</div>'),
  buildHtmlDocument: vi.fn((snippet: string) => `<!doctype html>${snippet}`),
}))

const CodeShotInputSection = defineComponent({
  name: 'CodeShotInputSection',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  emits: ['update:code'],
  template: '<div data-input />',
})

const CodeShotStyleSection = defineComponent({
  name: 'CodeShotStyleSection',
  props: {
    language: {
      type: String,
      default: 'auto',
    },
    renderMode: {
      type: String,
      default: 'highlight',
    },
    themeId: {
      type: String,
      default: 'nebula',
    },
    backgroundType: {
      type: String,
      default: 'preset',
    },
    backgroundPresetId: {
      type: String,
      default: 'aurora',
    },
    backgroundColor: {
      type: String,
      default: '#0f172a',
    },
    windowStyle: {
      type: String,
      default: 'mac',
    },
    showLineNumbers: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'update:language',
    'update:renderMode',
    'update:themeId',
    'update:backgroundType',
    'update:backgroundPresetId',
    'update:backgroundColor',
    'update:windowStyle',
    'update:showLineNumbers',
  ],
  template: '<div data-style />',
})

const CodeShotLayoutSection = defineComponent({
  name: 'CodeShotLayoutSection',
  props: {
    fontSize: {
      type: Number,
      default: 16,
    },
    lineHeight: {
      type: Number,
      default: 1.6,
    },
    cardPadding: {
      type: Number,
      default: 24,
    },
    framePadding: {
      type: Number,
      default: 48,
    },
    radius: {
      type: Number,
      default: 18,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
    tabSize: {
      type: Number,
      default: 2,
    },
    isBackgroundNone: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:fontSize',
    'update:lineHeight',
    'update:cardPadding',
    'update:framePadding',
    'update:radius',
    'update:shadow',
    'update:tabSize',
  ],
  template:
    '<div data-layout :data-frame-padding="framePadding" :data-shadow="shadow" :data-background-none="isBackgroundNone" />',
})

const CodeShotPreviewSection = defineComponent({
  name: 'CodeShotPreviewSection',
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
  template: '<div data-preview />',
})

const CodeShotExportSection = defineComponent({
  name: 'CodeShotExportSection',
  props: {
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
    filename: {
      type: String,
      default: '',
    },
  },
  emits: ['update:filename'],
  template: '<div data-export />',
})

const mountOptions = {
  global: {
    stubs: {
      NGrid: {
        template: '<div class="n-grid"><slot /></div>',
      },
      NGi: {
        template: '<div class="n-gi"><slot /></div>',
      },
      CodeShotInputSection,
      CodeShotStyleSection,
      CodeShotLayoutSection,
      CodeShotPreviewSection,
      CodeShotExportSection,
    },
  },
}

describe('CodeScreenshotGenerator', () => {
  it('passes computed preview and export props', () => {
    const wrapper = mount(CodeScreenshotGenerator, mountOptions)

    const preview = wrapper.getComponent({ name: 'CodeShotPreviewSection' })
    expect(preview.props('lines')).toHaveLength(2)
    expect(preview.props('lineNumbers')).toEqual([1, 2])

    const layout = preview.props('layout') as { fontFamily?: string }
    expect(layout.fontFamily).toBe('Test Mono')

    const theme = preview.props('theme') as { background?: string }
    expect(theme.background).toBe('#0a0a0a')

    const background = preview.props('background') as {
      type?: string
      preset?: { id: string; colors: string[] }
    }
    expect(background.type).toBe('preset')
    expect(background.preset).toEqual({ id: 'aurora', colors: ['#ffffff'] })

    const exportSection = wrapper.getComponent({ name: 'CodeShotExportSection' })
    expect(exportSection.props('svgMarkup')).toBe('<svg />')
    expect(exportSection.props('svgWidth')).toBe(120)
    expect(exportSection.props('svgHeight')).toBe(80)
    expect(exportSection.props('htmlSnippet')).toBe('<div>snippet</div>')
    expect(exportSection.props('htmlDocument')).toBe('<!doctype html><div>snippet</div>')
    expect(exportSection.props('jpgBackground')).toBe('')
    expect(exportSection.props('filename')).toBe('code-shot')
  })

  it('toggles layout padding and shadow when background is none', async () => {
    const wrapper = mount(CodeScreenshotGenerator, mountOptions)

    const layout = wrapper.getComponent({ name: 'CodeShotLayoutSection' })
    expect(layout.props('framePadding')).toBe(48)
    expect(layout.props('shadow')).toBe(true)
    expect(layout.props('isBackgroundNone')).toBe(false)

    const style = wrapper.getComponent({ name: 'CodeShotStyleSection' })
    style.vm.$emit('update:backgroundType', 'none')
    await nextTick()

    expect(layout.props('framePadding')).toBe(0)
    expect(layout.props('shadow')).toBe(false)
    expect(layout.props('isBackgroundNone')).toBe(true)

    style.vm.$emit('update:backgroundType', 'preset')
    await nextTick()

    expect(layout.props('framePadding')).toBe(48)
    expect(layout.props('shadow')).toBe(true)
    expect(layout.props('isBackgroundNone')).toBe(false)
  })

  it('updates transparent and solid backgrounds and handles undefined code', async () => {
    const wrapper = mount(CodeScreenshotGenerator, mountOptions)
    const style = wrapper.getComponent({ name: 'CodeShotStyleSection' })
    const input = wrapper.getComponent({ name: 'CodeShotInputSection' })

    style.vm.$emit('update:backgroundType', 'transparent')
    await nextTick()

    const transparentPreview = wrapper.getComponent({ name: 'CodeShotPreviewSection' })
    expect(transparentPreview.props('background')).toEqual({ type: 'transparent' })

    const transparentExport = wrapper.getComponent({ name: 'CodeShotExportSection' })
    expect(transparentExport.props('jpgBackground')).toBe('#0a0a0a')

    input.vm.$emit('update:code', undefined)
    await nextTick()

    style.vm.$emit('update:backgroundType', 'solid')
    await nextTick()

    const solidPreview = wrapper.getComponent({ name: 'CodeShotPreviewSection' })
    expect(solidPreview.props('background')).toEqual({ type: 'solid', color: '#0f172a' })

    const solidExport = wrapper.getComponent({ name: 'CodeShotExportSection' })
    expect(solidExport.props('jpgBackground')).toBe('')
  })

  it('applies section v-model updates from child emits', async () => {
    const wrapper = mount(CodeScreenshotGenerator, mountOptions)
    const style = wrapper.getComponent({ name: 'CodeShotStyleSection' })
    const layoutSection = wrapper.getComponent({ name: 'CodeShotLayoutSection' })
    const exportSection = wrapper.getComponent({ name: 'CodeShotExportSection' })

    style.vm.$emit('update:language', 'javascript')
    style.vm.$emit('update:renderMode', 'plain')
    style.vm.$emit('update:themeId', 'github-dark')
    style.vm.$emit('update:backgroundType', 'solid')
    style.vm.$emit('update:backgroundColor', '#112233')
    style.vm.$emit('update:windowStyle', 'none')
    style.vm.$emit('update:showLineNumbers', false)

    layoutSection.vm.$emit('update:fontSize', 20)
    layoutSection.vm.$emit('update:lineHeight', 1.9)
    layoutSection.vm.$emit('update:cardPadding', 30)
    layoutSection.vm.$emit('update:framePadding', 16)
    layoutSection.vm.$emit('update:radius', 14)
    layoutSection.vm.$emit('update:shadow', false)
    layoutSection.vm.$emit('update:tabSize', 4)

    style.vm.$emit('update:backgroundType', 'preset')
    style.vm.$emit('update:backgroundPresetId', 'sunset')
    exportSection.vm.$emit('update:filename', 'updated-shot')
    await nextTick()

    const preview = wrapper.getComponent({ name: 'CodeShotPreviewSection' })
    const layout = preview.props('layout') as {
      fontSize?: number
      lineHeight?: number
      padding?: number
      framePadding?: number
      radius?: number
      shadow?: boolean
      windowStyle?: string
      showLineNumbers?: boolean
      tabSize?: number
    }
    expect(layout.fontSize).toBe(20)
    expect(layout.lineHeight).toBe(1.9)
    expect(layout.padding).toBe(30)
    expect(layout.framePadding).toBe(16)
    expect(layout.radius).toBe(14)
    expect(layout.shadow).toBe(false)
    expect(layout.windowStyle).toBe('none')
    expect(layout.showLineNumbers).toBe(false)
    expect(layout.tabSize).toBe(4)

    const background = preview.props('background') as {
      type?: string
      preset?: { id: string; colors: string[] }
    }
    expect(background).toEqual({
      type: 'preset',
      preset: { id: 'sunset', colors: ['#ffffff'] },
    })

    const theme = preview.props('theme') as { id?: string }
    expect(theme.id).toBe('github-dark')
    expect(exportSection.props('filename')).toBe('updated-shot')
  })
})
