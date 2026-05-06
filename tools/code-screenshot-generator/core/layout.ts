import type { WindowStyle } from "./tokens"

type CodeShotLayout = Readonly<{
  fontSize: number
  lineHeight: number
  padding: number
  framePadding: number
  radius: number
  shadow: boolean
  windowStyle: WindowStyle
  showLineNumbers: boolean
  tabSize: number
  fontFamily: string
}>

type SvgOutput = Readonly<{
  svg: string
  width: number
  height: number
}>

type TextMeasurer = (text: string, font: string) => number

const estimateTextWidth: TextMeasurer = (text, font) => {
  const fontSizeMatch = /(\d+(?:\.\d+)?)px/.exec(font)
  const fontSize = fontSizeMatch ? Number(fontSizeMatch[1]) : 16
  return text.length * fontSize * 0.62
}

export { estimateTextWidth }
export type { CodeShotLayout, SvgOutput, TextMeasurer }
