export type OpenApiToTypescriptConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  openApiLabel: string
  openApiDescription: string
  openApiPlaceholder: string
  typescriptLabel: string
  typescriptDescription: string
  typescriptEmptyDescription: string
  invalidOpenApiLabel: string
  generationErrorLabel: string
  externalRefsLabel: string
  externalRefsDescription: string
  generationPausedHint: string
  generateNowLabel: string
  useSampleLabel: string
  clearLabel: string
  importFromFileLabel: string
  importFromUrlLabel: string
  hideUrlImportLabel: string
  importUrlFieldLabel: string
  importUrlDescription: string
  importUrlPlaceholder: string
  fetchUrlLabel: string
  fetchingUrlLabel: string
  optionsLabel: string
  optionsDescription: string
  allowAdditionalPropertiesLabel: string
  defaultNonNullableLabel: string
  propertiesRequiredByDefaultLabel: string
  useTypeAliasesLabel: string
  generateEnumsLabel: string
  pathParamsAsTypesLabel: string
  generateRootTypesLabel: string
  generatePathsEnumLabel: string
  generatePathParamHelpersLabel: string
  immutableTypesLabel: string
  excludeDeprecatedLabel: string
  includeHeaderCommentLabel: string
  copyTypesLabel: string
  copiedLabel: string
  downloadTypesLabel: string
  importUrlEmptyError: string
  importUrlInvalidError: string
  importUrlFetchError: string
  invalidDocumentMessage: string
  invalidDocumentWithMessage: string
  invalidRootMessage: string
  unsupportedVersionMessage: string
}>

export type OpenApiToTypescriptOutputState =
  | {
      state: "empty"
    }
  | {
      state: "generated"
      output: string
    }
  | {
      state: "parse-error"
      description: string
    }
  | {
      state: "external-refs"
      refs: string[]
    }
  | {
      state: "generate-error"
      description: string
    }
