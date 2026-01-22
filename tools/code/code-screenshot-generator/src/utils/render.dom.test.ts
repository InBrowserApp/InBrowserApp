import { describe, expect, it } from 'vitest'
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
} from './render'

registerHighlightLanguages(hljs)

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

  it('normalizes code and builds tokens', () => {
    const normalized = normalizeCode('const x = 1\r\nconst y = 2')
    expect(normalized).toBe('const x = 1\nconst y = 2')

    const tokens = highlightToTokens(hljs, normalized, 'javascript', 'highlight')
    expect(tokens.length).toBeGreaterThan(0)

    const styled = applyTokenStyles(tokens, theme, 2)
    const lines = tokensToLines(styled)
    expect(lines.length).toBeGreaterThan(1)
  })

  it('supports plain mode and tab expansion', () => {
    const tokens = highlightToTokens(hljs, 'a\tb', 'javascript', 'plain')
    const styled = applyTokenStyles(tokens, theme, 4)
    expect(styled[0].text).toContain('    ')
  })

  it('builds line numbers and exports', () => {
    const lineNumbers = buildLineNumbers(3)
    expect(lineNumbers).toEqual(['1', '2', '3'])

    const styled = applyTokenStyles(
      highlightToTokens(hljs, 'const a = 1', 'javascript', 'highlight'),
      theme,
      2,
    )
    const lines = tokensToLines(styled)

    const svgOutput = buildCodeShotSvg(lines, layout, theme, background)
    expect(svgOutput.svg).toContain('<svg')
    expect(svgOutput.width).toBeGreaterThan(0)
    expect(svgOutput.height).toBeGreaterThan(0)

    const snippet = buildHtmlSnippet(lines, layout, theme, background)
    expect(snippet).toContain('<pre')

    const document = buildHtmlDocument(snippet, background)
    expect(document).toContain('<!DOCTYPE html>')
  })

  it('creates preview background helpers', () => {
    const transparentBg: BackgroundConfig = { type: 'transparent' }
    expect(getBackgroundPreviewCss(transparentBg)).toContain('linear-gradient')
    expect(getBackgroundPreviewSize(transparentBg)).toBe('20px 20px')

    const solidBg: BackgroundConfig = { type: 'solid', color: '#000' }
    expect(getBackgroundPreviewCss(solidBg)).toBe('#000')
    expect(getBackgroundPreviewSize(solidBg)).toBe('cover')
  })
})
