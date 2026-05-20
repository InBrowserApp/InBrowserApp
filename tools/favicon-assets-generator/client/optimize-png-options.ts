type OxipngOptions = Readonly<{
  interlace: boolean
  level: number
  optimiseAlpha: boolean
}>

const DEFAULT_OXIPNG_OPTIONS: OxipngOptions = {
  interlace: false,
  level: 2,
  optimiseAlpha: true,
}

export type { OxipngOptions }
export { DEFAULT_OXIPNG_OPTIONS }
