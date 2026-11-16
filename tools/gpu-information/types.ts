import type messages from "./messages/en.json"

type GpuMessages = typeof messages
type GraphicsApi = "webgl" | "webgl2"
type ParameterValue = string | number | boolean | number[] | null
type GraphicsParameter = Readonly<{ name: string; value: ParameterValue }>
type ShaderPrecision = Readonly<{
  stage: "vertex" | "fragment"
  format: string
  rangeMin: number | null
  rangeMax: number | null
  precision: number | null
}>
type AvailableContext = Readonly<{
  api: GraphicsApi
  available: true
  vendor: string | null
  renderer: string | null
  unmaskedVendor: string | null
  unmaskedRenderer: string | null
  version: string | null
  shadingLanguage: string | null
  softwareRenderer: boolean
  attributes: GraphicsParameter[]
  limits: GraphicsParameter[]
  precision: ShaderPrecision[]
  extensions: string[]
}>
type GraphicsContext =
  | AvailableContext
  | Readonly<{
      api: GraphicsApi
      available: false
    }>
type GpuReport = Readonly<{
  capturedAt: string
  userAgent: string
  contexts: GraphicsContext[]
}>

export type {
  AvailableContext,
  GpuMessages,
  GpuReport,
  GraphicsApi,
  GraphicsContext,
  GraphicsParameter,
  ParameterValue,
  ShaderPrecision,
}
