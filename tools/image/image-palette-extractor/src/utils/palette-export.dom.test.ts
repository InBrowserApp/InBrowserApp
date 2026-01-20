import { describe, expect, it } from 'vitest'
import {
  formatPaletteAsCssVariables,
  formatPaletteAsHexList,
  formatPaletteAsJson,
  formatPaletteExport,
  getExportFileName,
  getExportMimeType,
} from './palette-export'

const colors = [
  { hex: '#112233', rgb: 'rgb(17, 34, 51)', hsl: 'hsl(210, 50%, 13%)', ratio: 0.6 },
  { hex: '#445566', rgb: 'rgb(68, 85, 102)', hsl: 'hsl(210, 20%, 33%)', ratio: 0.4 },
]

describe('palette-export', () => {
  it('formats hex list', () => {
    expect(formatPaletteAsHexList(colors)).toBe('#112233\n#445566')
  })

  it('formats CSS variables', () => {
    const output = formatPaletteAsCssVariables(colors)
    expect(output).toContain('--palette-1: #112233;')
    expect(output).toContain('--palette-2: #445566;')
  })

  it('formats JSON', () => {
    const output = formatPaletteAsJson(colors)
    const parsed = JSON.parse(output)
    expect(parsed[0]).toMatchObject({ hex: '#112233', ratio: 0.6 })
  })

  it('formats export by format', () => {
    expect(formatPaletteExport(colors, 'css')).toContain(':root')
    expect(formatPaletteExport(colors, 'json')).toContain('"hex"')
    expect(formatPaletteExport(colors, 'hex')).toBe('#112233\n#445566')
  })

  it('builds file names and mime types', () => {
    expect(getExportFileName('sample.png', 'css')).toBe('sample.css')
    expect(getExportFileName('palette', 'json')).toBe('palette.json')
    expect(getExportMimeType('json')).toBe('application/json')
  })
})
