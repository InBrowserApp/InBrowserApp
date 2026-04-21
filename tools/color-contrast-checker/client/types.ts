import type { RGBA } from "../core/color"

type ContrastCheckKey = "aa-normal" | "aa-large" | "aaa-normal" | "aaa-large"

type ContrastCheck = Readonly<{
  key: ContrastCheckKey
  pass: boolean
}>

type ColorContrastMessagesCatalog = Readonly<{
  optionsTitle: string
  foregroundLabel: string
  backgroundLabel: string
  swapLabel: string
  invalidColorMessage: string
  resultsTitle: string
  contrastRatioLabel: string
  aaNormalLabel: string
  aaLargeLabel: string
  aaaNormalLabel: string
  aaaLargeLabel: string
  passLabel: string
  failLabel: string
  invalidInputMessage: string
  alphaNote: string
  previewTitle: string
  normalTextLabel: string
  largeTextLabel: string
  sampleText: string
}>

type ColorContrastMessages = Readonly<
  ColorContrastMessagesCatalog & {
    meta: {
      name: string
      description: string
    }
  }
>

type ResolvedContrastColors = Readonly<{
  foreground: RGBA
  background: RGBA
}>

export type {
  ColorContrastMessages,
  ColorContrastMessagesCatalog,
  ContrastCheck,
  ContrastCheckKey,
  ResolvedContrastColors,
}
