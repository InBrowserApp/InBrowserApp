import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotPreview from './CodeShotPreview.vue'
import type { BackgroundConfig, CodeShotLayout, StyledToken } from '../utils/render'
import type { Theme } from '../utils/themes'
import { getBackgroundPreviewCss, getBackgroundPreviewSize } from '../utils/render'
import { themes } from '../utils/themes'

vi.mock('../utils/render', async () => {
  const actual = await vi.importActual<typeof import('../utils/render')>('../utils/render')
  return {
    ...actual,
    getBackgroundPreviewCss: vi.fn(() => 'linear-gradient(red, blue)'),
    getBackgroundPreviewSize: vi.fn(() => 'cover'),
  }
})

describe('CodeShotPreview', () => {
  it('renders layout styles, window controls, and lines', () => {
    const theme = themes[0] as Theme
    const layout: CodeShotLayout = {
      fontSize: 14,
      lineHeight: 1.5,
      padding: 24,
      framePadding: 20,
      radius: 8,
      shadow: true,
      windowStyle: 'mac',
      showLineNumbers: true,
      tabSize: 2,
      fontFamily: 'Fira Mono',
    }
    const background: BackgroundConfig = { type: 'solid', color: '#ffffff' }
    const lines: StyledToken[][] = [
      [
        { text: 'const ', color: '#fff', fontStyle: 'normal' },
        { text: 'value', color: '#0f0', fontStyle: 'italic', fontWeight: 'bold' },
      ],
      [],
    ]

    const wrapper = mount(CodeShotPreview, {
      props: {
        lines,
        lineNumbers: ['1', '2'],
        layout,
        theme,
        background,
      },
    })

    expect(getBackgroundPreviewCss).toHaveBeenCalledWith(background)
    expect(getBackgroundPreviewSize).toHaveBeenCalledWith(background)

    const preview = wrapper.find('.code-shot-preview').element as HTMLDivElement
    expect(preview.style.padding).toBe('20px')
    expect(preview.style.background).toBe('linear-gradient(red, blue)')
    expect(preview.style.backgroundSize).toBe('cover')
    expect(preview.style.borderRadius).toBe('20px')

    const card = wrapper.find('.code-shot-card').element as HTMLDivElement
    expect(card.style.borderRadius).toBe('8px')
    expect(card.style.boxShadow).toContain('rgba(15, 23, 42, 0.35)')

    const header = wrapper.find('.code-shot-header').element as HTMLDivElement
    expect(header.style.height).toBe('34px')
    expect(wrapper.find('.window-controls.mac').exists()).toBe(true)

    const body = wrapper.find('.code-shot-body').element as HTMLDivElement
    expect(body.style.padding).toBe('24px')
    expect(body.style.fontFamily).toContain('Fira Mono')
    expect(body.style.fontSize).toBe('14px')

    const lineNumbers = wrapper.findAll('.line-number')
    expect(lineNumbers).toHaveLength(2)
    expect(lineNumbers[0]?.text()).toBe('1')

    const tokens = wrapper.findAll('.code-token')
    expect(tokens).toHaveLength(2)
  })

  it('hides window controls and line numbers when disabled', () => {
    const theme = themes[0] as Theme
    const layout: CodeShotLayout = {
      fontSize: 16,
      lineHeight: 1.4,
      padding: 16,
      framePadding: 12,
      radius: 10,
      shadow: false,
      windowStyle: 'none',
      showLineNumbers: false,
      tabSize: 2,
      fontFamily: 'JetBrains Mono',
    }
    const background: BackgroundConfig = { type: 'none' }
    const lines: StyledToken[][] = [[{ text: 'line', color: '#fff', fontStyle: 'normal' }]]

    const wrapper = mount(CodeShotPreview, {
      props: {
        lines,
        lineNumbers: ['1'],
        layout,
        theme,
        background,
      },
    })

    expect(wrapper.find('.code-shot-header').exists()).toBe(false)
    expect(wrapper.find('.line-numbers').exists()).toBe(false)

    const card = wrapper.find('.code-shot-card').element as HTMLDivElement
    expect(card.style.boxShadow).toBe('none')
  })

  it('renders windows controls when window style is set to windows', () => {
    const theme = themes[0] as Theme
    const layout: CodeShotLayout = {
      fontSize: 15,
      lineHeight: 1.5,
      padding: 20,
      framePadding: 14,
      radius: 10,
      shadow: true,
      windowStyle: 'windows',
      showLineNumbers: false,
      tabSize: 2,
      fontFamily: 'JetBrains Mono',
    }
    const background: BackgroundConfig = { type: 'transparent' }
    const lines: StyledToken[][] = [[{ text: 'line', color: '#fff', fontStyle: 'normal' }]]

    const wrapper = mount(CodeShotPreview, {
      props: {
        lines,
        lineNumbers: ['1'],
        layout,
        theme,
        background,
      },
    })

    expect(wrapper.find('.window-controls.windows').exists()).toBe(true)
    expect(wrapper.find('.window-controls.mac').exists()).toBe(false)
  })
})
