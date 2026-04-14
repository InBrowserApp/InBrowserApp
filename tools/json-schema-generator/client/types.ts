import type { JsonSchemaDraft } from "../core/generate-json-schema"

type JsonSchemaGeneratorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputTitle: string
  inputDescription: string
  inputPlaceholder: string
  outputTitle: string
  outputDescription: string
  outputEmpty: string
  invalidJson: string
  optionsTitle: string
  optionDraft: string
  optionInferRequired: string
  optionAllowAdditionalProperties: string
  optionDetectFormat: string
  useSampleLabel: string
  importFromFileLabel: string
  downloadSchemaLabel: string
  copySchemaLabel: string
  copiedLabel: string
}>

type JsonSchemaGeneratorOptions = {
  draft: JsonSchemaDraft
  inferRequired: boolean
  allowAdditionalProperties: boolean
  detectFormat: boolean
}

export type { JsonSchemaGeneratorMessages, JsonSchemaGeneratorOptions }
