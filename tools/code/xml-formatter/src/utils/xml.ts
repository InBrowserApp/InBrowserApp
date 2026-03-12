import { XMLValidator, type ValidationError } from 'fast-xml-parser'
import xmlFormat from 'xml-formatter'

export type XmlOutputMode = 'formatted' | 'minified'
export type XmlIndentation = '2-spaces' | '4-spaces' | 'tab'
export type XmlLineEnding = 'lf' | 'crlf'

export interface XmlFormattingOptions {
  collapseContent: boolean
  forceSelfClosingEmptyTag: boolean
  indentation: XmlIndentation
  lineEnding: XmlLineEnding
  mode: XmlOutputMode
}

export type XmlValidationResult =
  | { valid: true }
  | {
      valid: false
      code: string
      message: string
      line: number
      column: number
    }

const indentationMap: Record<XmlIndentation, string> = {
  '2-spaces': '  ',
  '4-spaces': '    ',
  tab: '\t',
}

const lineSeparatorMap: Record<XmlLineEnding, string> = {
  lf: '\n',
  crlf: '\r\n',
}

export function getXmlIndentation(indentation: XmlIndentation): string {
  return indentationMap[indentation]
}

export function getXmlLineSeparator(lineEnding: XmlLineEnding): string {
  return lineSeparatorMap[lineEnding]
}

export function validateXml(xml: string): XmlValidationResult {
  const result = XMLValidator.validate(xml)

  if (result === true) {
    return { valid: true }
  }

  const error = (result as ValidationError).err

  return {
    valid: false,
    code: error.code,
    message: error.msg,
    line: error.line,
    column: error.col,
  }
}

export function getXmlErrorContext(xml: string, line: number, column: number, padding = 1): string {
  const lines = xml.split(/\r?\n/)
  const currentIndex = Math.min(Math.max(line - 1, 0), lines.length - 1)
  const start = Math.max(currentIndex - padding, 0)
  const end = Math.min(currentIndex + padding, lines.length - 1)
  const lineNumberWidth = String(end + 1).length
  const safeColumn = Math.max(column, 1)
  const context: string[] = []

  for (let index = start; index <= end; index += 1) {
    const lineNumber = String(index + 1).padStart(lineNumberWidth, ' ')
    context.push(`${lineNumber} | ${lines[index] ?? ''}`)

    if (index === currentIndex) {
      context.push(`${' '.repeat(lineNumberWidth)} | ${' '.repeat(safeColumn - 1)}^`)
    }
  }

  return context.join('\n')
}

export function formatXmlString(xml: string, options: XmlFormattingOptions): string {
  if (options.mode === 'minified') {
    return xmlFormat.minify(xml, {
      collapseContent: options.collapseContent,
      forceSelfClosingEmptyTag: options.forceSelfClosingEmptyTag,
      strictMode: true,
      throwOnFailure: true,
    })
  }

  return xmlFormat(xml, {
    collapseContent: options.collapseContent,
    forceSelfClosingEmptyTag: options.forceSelfClosingEmptyTag,
    indentation: getXmlIndentation(options.indentation),
    lineSeparator: getXmlLineSeparator(options.lineEnding),
    strictMode: true,
    throwOnFailure: true,
  })
}
