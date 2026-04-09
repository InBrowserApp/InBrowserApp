import { DEFAULT_OPENAPI_TYPEGEN_OPTIONS } from "../core/openapi-typescript"
import { SAMPLE_OPENAPI_DOCUMENT } from "../sample-openapi"

const LARGE_OPENAPI_INPUT_THRESHOLD = 120_000

const STORAGE_KEYS = {
  openApiText: "tools:openapi-to-typescript-converter:openapi-text",
  options: "tools:openapi-to-typescript-converter:options",
} as const

export {
  DEFAULT_OPENAPI_TYPEGEN_OPTIONS,
  LARGE_OPENAPI_INPUT_THRESHOLD,
  SAMPLE_OPENAPI_DOCUMENT,
  STORAGE_KEYS,
}
