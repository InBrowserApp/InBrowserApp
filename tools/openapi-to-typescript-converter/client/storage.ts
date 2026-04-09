import {
  DEFAULT_OPENAPI_TYPEGEN_OPTIONS,
  type OpenApiTypegenOptions,
} from "../core/openapi-typescript"

type OpenApiTypegenOptionsStorageValue = Partial<OpenApiTypegenOptions>

function parseStoredOptions(storedValue: string | null): OpenApiTypegenOptions {
  if (!storedValue) {
    return DEFAULT_OPENAPI_TYPEGEN_OPTIONS
  }

  try {
    const parsed = JSON.parse(storedValue) as OpenApiTypegenOptionsStorageValue

    return {
      additionalProperties:
        parsed.additionalProperties ??
        DEFAULT_OPENAPI_TYPEGEN_OPTIONS.additionalProperties,
      defaultNonNullable:
        parsed.defaultNonNullable ??
        DEFAULT_OPENAPI_TYPEGEN_OPTIONS.defaultNonNullable,
      propertiesRequiredByDefault:
        parsed.propertiesRequiredByDefault ??
        DEFAULT_OPENAPI_TYPEGEN_OPTIONS.propertiesRequiredByDefault,
      exportType:
        parsed.exportType ?? DEFAULT_OPENAPI_TYPEGEN_OPTIONS.exportType,
      enum: parsed.enum ?? DEFAULT_OPENAPI_TYPEGEN_OPTIONS.enum,
      pathParamsAsTypes:
        parsed.pathParamsAsTypes ??
        DEFAULT_OPENAPI_TYPEGEN_OPTIONS.pathParamsAsTypes,
      rootTypes: parsed.rootTypes ?? DEFAULT_OPENAPI_TYPEGEN_OPTIONS.rootTypes,
      makePathsEnum:
        parsed.makePathsEnum ?? DEFAULT_OPENAPI_TYPEGEN_OPTIONS.makePathsEnum,
      generatePathParams:
        parsed.generatePathParams ??
        DEFAULT_OPENAPI_TYPEGEN_OPTIONS.generatePathParams,
      immutable: parsed.immutable ?? DEFAULT_OPENAPI_TYPEGEN_OPTIONS.immutable,
      excludeDeprecated:
        parsed.excludeDeprecated ??
        DEFAULT_OPENAPI_TYPEGEN_OPTIONS.excludeDeprecated,
      includeHeader:
        parsed.includeHeader ?? DEFAULT_OPENAPI_TYPEGEN_OPTIONS.includeHeader,
    }
  } catch {
    return DEFAULT_OPENAPI_TYPEGEN_OPTIONS
  }
}

export { parseStoredOptions }
