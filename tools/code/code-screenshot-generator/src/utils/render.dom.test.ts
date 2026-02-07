import { afterEach, describe, expect, it, vi } from 'vitest'
import type { HLJSApi } from 'highlight.js'
import hljs from 'highlight.js/lib/core'
import { registerHighlightLanguages } from './languages'
import { DEFAULT_MONO_FONT, getBackgroundPreset, getThemeById } from './themes'
import {
  applyTokenStyles,
  buildCodeShotSvg,
  buildHtmlDocument,
  buildHtmlSnippet,
  buildLineNumbers,
  getBackgroundPreviewCss,
  getBackgroundPreviewSize,
  highlightToTokens,
  normalizeCode,
  tokensToLines,
  type BackgroundConfig,
  type CodeShotLayout,
  type StyledToken,
} from './render'

registerHighlightLanguages(hljs)

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('render helpers', () => {
  const theme = getThemeById('nebula')
  const background: BackgroundConfig = {
    type: 'preset',
    preset: getBackgroundPreset('aurora'),
  }
  const layout: CodeShotLayout = {
    fontSize: 16,
    lineHeight: 1.6,
    padding: 20,
    framePadding: 32,
    radius: 16,
    shadow: true,
    windowStyle: 'mac',
    showLineNumbers: true,
    tabSize: 2,
    fontFamily: DEFAULT_MONO_FONT,
  }

  it('normalizes code and handles token parsing fallbacks', () => {
    const normalized = normalizeCode('const x = 1\r\nconst y = 2')
    expect(normalized).toBe('const x = 1\nconst y = 2')

    const fakeHljs = {
      highlightAuto: vi.fn(() => ({
        value: '<span class="hljs-keyword">const</span><span> value</span><!-- ignored -->',
      })),
      highlight: vi.fn(() => {
        throw new Error('boom')
      }),
    } as unknown as HLJSApi

    expect(highlightToTokens(fakeHljs, '   ', 'auto', 'highlight')).toEqual([
      { text: '   ', classes: [] },
    ])

    const autoTokens = highlightToTokens(fakeHljs, 'const value', 'auto', 'highlight')
    expect(autoTokens).toEqual([
      { text: 'const', classes: ['hljs-keyword'] },
      { text: ' value', classes: [] },
    ])
    expect(fakeHljs.highlightAuto).toHaveBeenCalledTimes(1)

    const failed = highlightToTokens(fakeHljs, 'const value', 'javascript', 'highlight')
    expect(failed).toEqual([{ text: 'const value', classes: [] }])
  })

  it('supports plain mode, token styling, and line splitting', () => {
    const plainTokens = highlightToTokens(hljs, 'a\tb', 'javascript', 'plain')
    const styledPlain = applyTokenStyles(plainTokens, theme, 4)
    expect(styledPlain[0]?.text).toContain('    ')

    const styledTheme = {
      ...theme,
      tokenStyles: {
        ...theme.tokenStyles,
        keyword: {
          color: '#ff00aa',
          fontStyle: 'italic' as const,
          fontWeight: 700,
        },
      },
    }

    const styled = applyTokenStyles(
      [
        { text: '\tconst', classes: ['hljs', 'keyword'] },
        { text: '', classes: ['missing-class'] },
      ],
      styledTheme,
      2,
    )

    expect(styled[0]).toMatchObject({
      text: '  const',
      color: '#ff00aa',
      fontStyle: 'italic',
      fontWeight: 700,
    })
    expect(styled[1]).toMatchObject({
      text: '',
      color: theme.foreground,
      fontStyle: 'normal',
    })

    const lines = tokensToLines([
      { text: 'first\n\nthird', color: '#fff', fontStyle: 'normal' },
      { text: '', color: '#fff', fontStyle: 'normal' },
    ])
    expect(lines).toHaveLength(3)
    expect(lines[0]?.[0]?.text).toBe('first')
    expect(lines[1]).toEqual([])
    expect(lines[2]?.[0]?.text).toBe('third')

    expect(buildLineNumbers(3)).toEqual(['1', '2', '3'])
    expect(buildLineNumbers(0, 5)).toEqual(['5'])
  })

  it('builds svg outputs for multiple window and background modes', () => {
    const lines: StyledToken[][] = [
      [
        { text: '', color: '#ffffff', fontStyle: 'normal' },
        { text: 'emphasis', color: '#ffcc00', fontStyle: 'italic', fontWeight: 700 },
      ],
      [],
    ]

    const radialBackground = {
      type: 'preset',
      preset: {
        id: 'radial-test',
        type: 'radial',
        colors: ['#111111', '#333333'],
        focus: { x: 0.3, y: 0.7 },
      },
    } as BackgroundConfig

    const macOutput = buildCodeShotSvg(lines, layout, theme, radialBackground)
    expect(macOutput.svg).toContain('<radialGradient')
    expect(macOutput.svg).toContain('<circle')
    expect(macOutput.svg).toContain('filter="url(#shadow)"')

    const windowsLayout: CodeShotLayout = {
      ...layout,
      windowStyle: 'windows',
      showLineNumbers: false,
      shadow: false,
    }
    const linearBackground = {
      type: 'preset',
      preset: {
        id: 'linear-test',
        type: 'linear',
        colors: ['#001122', '#334455'],
      },
    } as BackgroundConfig

    const windowsOutput = buildCodeShotSvg(lines, windowsLayout, theme, linearBackground)
    expect(windowsOutput.svg).toContain('<linearGradient')
    expect(windowsOutput.svg).toContain('#f87171')
    expect(windowsOutput.svg).toContain('&#160;')
    expect(windowsOutput.svg).not.toContain('filter="url(#shadow)"')

    const plainWindowLayout: CodeShotLayout = {
      ...layout,
      windowStyle: 'none',
      showLineNumbers: false,
      shadow: false,
    }
    const transparentOutput = buildCodeShotSvg(lines, plainWindowLayout, theme, {
      type: 'transparent',
    })
    expect(transparentOutput.svg).not.toContain('#ff5f57')
    expect(transparentOutput.svg).not.toContain('#9ca3af')
  })

  it('falls back when width measurement cannot use document canvas APIs', () => {
    vi.stubGlobal('document', undefined)

    const noDocumentOutput = buildCodeShotSvg(
      [[{ text: 'fallback', color: '#fff', fontStyle: 'normal' }]],
      layout,
      theme,
      { type: 'none' },
    )

    expect(noDocumentOutput.width).toBeGreaterThan(0)
    expect(noDocumentOutput.height).toBeGreaterThan(0)
  })

  it('falls back when canvas context is missing', () => {
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(null as unknown as CanvasRenderingContext2D)

    const output = buildCodeShotSvg(
      [[{ text: 'fallback', color: '#fff', fontStyle: 'normal' }]],
      layout,
      theme,
      { type: 'solid', color: '#111111' },
    )

    expect(output.width).toBeGreaterThan(0)
    expect(output.height).toBeGreaterThan(0)
    expect(getContextSpy).toHaveBeenCalled()
  })

  it('builds html snippets and documents across style branches', () => {
    const htmlLines: StyledToken[][] = [
      [
        { text: 'alpha', color: '#ffffff', fontStyle: 'normal' },
        { text: 'beta', color: '#ff00aa', fontStyle: 'italic', fontWeight: 700 },
      ],
    ]

    const windowsSnippet = buildHtmlSnippet(
      htmlLines,
      {
        ...layout,
        windowStyle: 'windows',
        showLineNumbers: false,
        shadow: false,
      },
      theme,
      { type: 'transparent' },
    )

    expect(windowsSnippet).toContain('margin-left:auto')
    expect(windowsSnippet).toContain('background: transparent')
    expect(windowsSnippet).toContain('font-style: italic')
    expect(windowsSnippet).toContain('font-weight: 700')
    expect(windowsSnippet).not.toContain('user-select: none')

    const noneSnippet = buildHtmlSnippet(
      htmlLines,
      {
        ...layout,
        windowStyle: 'none',
      },
      theme,
      { type: 'none' },
    )

    expect(noneSnippet).toContain('background: none')
    expect(noneSnippet).not.toContain('gap:10px')

    const htmlDocument = buildHtmlDocument(noneSnippet, { type: 'none' })
    expect(htmlDocument).toContain('<!DOCTYPE html>')
    expect(htmlDocument).toContain('<body>')
  })

  it('creates preview background helpers for all background types', () => {
    const transparentBg: BackgroundConfig = { type: 'transparent' }
    expect(getBackgroundPreviewCss(transparentBg)).toContain('linear-gradient')
    expect(getBackgroundPreviewSize(transparentBg)).toBe('20px 20px')

    const solidBg: BackgroundConfig = { type: 'solid', color: '#000' }
    expect(getBackgroundPreviewCss(solidBg)).toBe('#000')
    expect(getBackgroundPreviewSize(solidBg)).toBe('cover')

    const noneBg: BackgroundConfig = { type: 'none' }
    expect(getBackgroundPreviewCss(noneBg)).toBe('none')
    expect(getBackgroundPreviewSize(noneBg)).toBe('auto')
  })
})
