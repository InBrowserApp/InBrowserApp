import type { ToolManifest } from "@workspace/tool-sdk"
import { tool as base64EncoderDecoder } from "../../../../tools/base64-encoder-decoder/manifest"
import { tool as imageResizer } from "../../../../tools/image-resizer/manifest"
import { tool as jsonSchemaValidator } from "../../../../tools/json-schema-validator/manifest"

export const toolRegistry: readonly ToolManifest[] = [
  base64EncoderDecoder,
  imageResizer,
  jsonSchemaValidator,
]

export const toolRegistryBySlug: Record<string, ToolManifest> = {
  "base64-encoder-decoder": base64EncoderDecoder,
  "image-resizer": imageResizer,
  "json-schema-validator": jsonSchemaValidator,
}

export const toolRegistryById: Record<string, ToolManifest> = {
  "base64-encoder-decoder": base64EncoderDecoder,
  "image-resizer": imageResizer,
  "json-schema-validator": jsonSchemaValidator,
}
