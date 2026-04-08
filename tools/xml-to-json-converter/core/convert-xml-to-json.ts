import convert from "xml-js"

type XmlToJsonOptions = Readonly<{
  compact: boolean
  ignoreDeclaration: boolean
  ignoreInstruction: boolean
  ignoreAttributes: boolean
  ignoreText: boolean
  ignoreCdata: boolean
  ignoreDoctype: boolean
  ignoreComment: boolean
  trim: boolean
  nativeType: boolean
  alwaysArray: boolean
  alwaysChildren: boolean
  indentSize: number
}>

type ConvertXmlToJsonResult =
  | {
      state: "idle"
      json: string
    }
  | {
      state: "converted"
      json: string
    }
  | {
      state: "error"
      json: string
      message: string
    }

const DEFAULT_XML_TO_JSON_OPTIONS: XmlToJsonOptions = {
  compact: true,
  ignoreDeclaration: false,
  ignoreInstruction: false,
  ignoreAttributes: false,
  ignoreText: false,
  ignoreCdata: false,
  ignoreDoctype: false,
  ignoreComment: false,
  trim: false,
  nativeType: false,
  alwaysArray: false,
  alwaysChildren: false,
  indentSize: 2,
}

function clampIndentSize(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_XML_TO_JSON_OPTIONS.indentSize
  }

  return Math.min(8, Math.max(0, Math.round(value)))
}

function normalizeXmlToJsonOptions(
  options: Partial<XmlToJsonOptions> | undefined
): XmlToJsonOptions {
  return {
    compact:
      typeof options?.compact === "boolean"
        ? options.compact
        : DEFAULT_XML_TO_JSON_OPTIONS.compact,
    ignoreDeclaration:
      typeof options?.ignoreDeclaration === "boolean"
        ? options.ignoreDeclaration
        : DEFAULT_XML_TO_JSON_OPTIONS.ignoreDeclaration,
    ignoreInstruction:
      typeof options?.ignoreInstruction === "boolean"
        ? options.ignoreInstruction
        : DEFAULT_XML_TO_JSON_OPTIONS.ignoreInstruction,
    ignoreAttributes:
      typeof options?.ignoreAttributes === "boolean"
        ? options.ignoreAttributes
        : DEFAULT_XML_TO_JSON_OPTIONS.ignoreAttributes,
    ignoreText:
      typeof options?.ignoreText === "boolean"
        ? options.ignoreText
        : DEFAULT_XML_TO_JSON_OPTIONS.ignoreText,
    ignoreCdata:
      typeof options?.ignoreCdata === "boolean"
        ? options.ignoreCdata
        : DEFAULT_XML_TO_JSON_OPTIONS.ignoreCdata,
    ignoreDoctype:
      typeof options?.ignoreDoctype === "boolean"
        ? options.ignoreDoctype
        : DEFAULT_XML_TO_JSON_OPTIONS.ignoreDoctype,
    ignoreComment:
      typeof options?.ignoreComment === "boolean"
        ? options.ignoreComment
        : DEFAULT_XML_TO_JSON_OPTIONS.ignoreComment,
    trim:
      typeof options?.trim === "boolean"
        ? options.trim
        : DEFAULT_XML_TO_JSON_OPTIONS.trim,
    nativeType:
      typeof options?.nativeType === "boolean"
        ? options.nativeType
        : DEFAULT_XML_TO_JSON_OPTIONS.nativeType,
    alwaysArray:
      typeof options?.alwaysArray === "boolean"
        ? options.alwaysArray
        : DEFAULT_XML_TO_JSON_OPTIONS.alwaysArray,
    alwaysChildren:
      typeof options?.alwaysChildren === "boolean"
        ? options.alwaysChildren
        : DEFAULT_XML_TO_JSON_OPTIONS.alwaysChildren,
    indentSize: clampIndentSize(options?.indentSize),
  }
}

function getConvertXmlToJsonErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function convertXmlToJsonText(
  input: string,
  options?: Partial<XmlToJsonOptions>
): ConvertXmlToJsonResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      json: "",
    }
  }

  try {
    const normalizedOptions = normalizeXmlToJsonOptions(options)
    const { indentSize, ...convertOptions } = normalizedOptions

    return {
      state: "converted",
      json: convert.xml2json(input, {
        ...convertOptions,
        spaces: indentSize,
      }),
    }
  } catch (error) {
    return {
      state: "error",
      json: "",
      message: getConvertXmlToJsonErrorMessage(error),
    }
  }
}

export {
  DEFAULT_XML_TO_JSON_OPTIONS,
  clampIndentSize,
  convertXmlToJsonText,
  getConvertXmlToJsonErrorMessage,
  normalizeXmlToJsonOptions,
}
export type { XmlToJsonOptions }
