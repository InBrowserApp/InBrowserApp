type JsonToXmlOptions = Readonly<{
  rootElementName: string
  arrayItemTag: string
  indentSize: number
  includeXmlDeclaration: boolean
  fullTagEmptyElement: boolean
}>

const DEFAULT_JSON_TO_XML_OPTIONS: JsonToXmlOptions = {
  rootElementName: "root",
  arrayItemTag: "item",
  indentSize: 2,
  includeXmlDeclaration: true,
  fullTagEmptyElement: false,
}

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>'
const XML_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9._-]*$/
const PROPERTY_FALLBACK_TAG = "property"

type ConvertJsonToXmlResult =
  | {
      state: "idle"
      xml: string
    }
  | {
      state: "converted"
      xml: string
    }
  | {
      state: "error"
      xml: string
      errorCode:
        | "invalid-json"
        | "invalid-root-element-name"
        | "invalid-array-item-tag"
      message: string
    }

function clampIndentSize(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_JSON_TO_XML_OPTIONS.indentSize
  }

  return Math.min(8, Math.max(0, Math.round(value)))
}

function normalizeJsonToXmlOptions(
  options: Partial<JsonToXmlOptions> | undefined
): JsonToXmlOptions {
  return {
    rootElementName:
      typeof options?.rootElementName === "string"
        ? options.rootElementName
        : DEFAULT_JSON_TO_XML_OPTIONS.rootElementName,
    arrayItemTag:
      typeof options?.arrayItemTag === "string"
        ? options.arrayItemTag
        : DEFAULT_JSON_TO_XML_OPTIONS.arrayItemTag,
    indentSize: clampIndentSize(options?.indentSize),
    includeXmlDeclaration:
      typeof options?.includeXmlDeclaration === "boolean"
        ? options.includeXmlDeclaration
        : DEFAULT_JSON_TO_XML_OPTIONS.includeXmlDeclaration,
    fullTagEmptyElement:
      typeof options?.fullTagEmptyElement === "boolean"
        ? options.fullTagEmptyElement
        : DEFAULT_JSON_TO_XML_OPTIONS.fullTagEmptyElement,
  }
}

function isValidXmlElementName(value: string) {
  return XML_NAME_PATTERN.test(value)
}

function getConvertJsonToXmlErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function escapeXmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function escapeXmlText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function formatAttributes(attributes?: Record<string, string>) {
  if (!attributes) {
    return ""
  }

  return Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${escapeXmlAttribute(value)}"`)
    .join("")
}

function renderEmptyElement(
  name: string,
  depth: number,
  options: JsonToXmlOptions,
  attributes?: Record<string, string>
) {
  const indent = options.indentSize > 0 ? " ".repeat(options.indentSize) : ""
  const prefix = options.indentSize > 0 ? indent.repeat(depth) : ""
  const attrs = formatAttributes(attributes)

  if (options.fullTagEmptyElement) {
    return `${prefix}<${name}${attrs}></${name}>`
  }

  return `${prefix}<${name}${attrs} />`
}

function renderPrimitiveElement(
  name: string,
  value: string | number | boolean,
  depth: number,
  options: JsonToXmlOptions,
  attributes?: Record<string, string>
) {
  const indent = options.indentSize > 0 ? " ".repeat(options.indentSize) : ""
  const prefix = options.indentSize > 0 ? indent.repeat(depth) : ""
  const attrs = formatAttributes(attributes)

  return `${prefix}<${name}${attrs}>${escapeXmlText(String(value))}</${name}>`
}

function wrapChildren(
  name: string,
  children: string[],
  depth: number,
  options: JsonToXmlOptions,
  attributes?: Record<string, string>
) {
  const indent = options.indentSize > 0 ? " ".repeat(options.indentSize) : ""
  const prefix = options.indentSize > 0 ? indent.repeat(depth) : ""
  const attrs = formatAttributes(attributes)

  if (options.indentSize === 0) {
    return `${prefix}<${name}${attrs}>${children.join("")}</${name}>`
  }

  return `${prefix}<${name}${attrs}>\n${children.join("\n")}\n${prefix}</${name}>`
}

function renderChildEntry(
  key: string,
  value: unknown,
  depth: number,
  options: JsonToXmlOptions
) {
  if (isValidXmlElementName(key)) {
    return renderElement(key, value, depth, options)
  }

  return renderElement(PROPERTY_FALLBACK_TAG, value, depth, options, {
    name: key,
  })
}

function renderElement(
  name: string,
  value: unknown,
  depth: number,
  options: JsonToXmlOptions,
  attributes?: Record<string, string>
): string {
  if (value === null) {
    return renderEmptyElement(name, depth, options, attributes)
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return renderEmptyElement(name, depth, options, attributes)
    }

    return wrapChildren(
      name,
      value.map((item) =>
        renderElement(options.arrayItemTag, item, depth + 1, options)
      ),
      depth,
      options,
      attributes
    )
  }

  if (typeof value === "object") {
    const entries = Object.entries(value)

    if (entries.length === 0) {
      return renderEmptyElement(name, depth, options, attributes)
    }

    return wrapChildren(
      name,
      entries.map(([key, childValue]) =>
        renderChildEntry(key, childValue, depth + 1, options)
      ),
      depth,
      options,
      attributes
    )
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return renderPrimitiveElement(name, value, depth, options, attributes)
  }

  return renderEmptyElement(name, depth, options, attributes)
}

function convertJsonToXmlText(
  input: string,
  options?: Partial<JsonToXmlOptions>
): ConvertJsonToXmlResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      xml: "",
    }
  }

  const normalizedOptions = normalizeJsonToXmlOptions(options)
  const rootElementName = normalizedOptions.rootElementName.trim()
  const arrayItemTag = normalizedOptions.arrayItemTag.trim()

  if (!isValidXmlElementName(rootElementName)) {
    return {
      state: "error",
      xml: "",
      errorCode: "invalid-root-element-name",
      message:
        "Root element names must start with a letter or underscore and use only letters, numbers, dots, hyphens, or underscores.",
    }
  }

  if (!isValidXmlElementName(arrayItemTag)) {
    return {
      state: "error",
      xml: "",
      errorCode: "invalid-array-item-tag",
      message:
        "Array item tags must start with a letter or underscore and use only letters, numbers, dots, hyphens, or underscores.",
    }
  }

  try {
    const parsed = JSON.parse(input)
    const xml = renderElement(rootElementName, parsed, 0, {
      ...normalizedOptions,
      rootElementName,
      arrayItemTag,
    })

    return {
      state: "converted",
      xml: normalizedOptions.includeXmlDeclaration
        ? normalizedOptions.indentSize === 0
          ? `${XML_DECLARATION}${xml}`
          : `${XML_DECLARATION}\n${xml}`
        : xml,
    }
  } catch (error) {
    return {
      state: "error",
      xml: "",
      errorCode: "invalid-json",
      message: getConvertJsonToXmlErrorMessage(error),
    }
  }
}

export {
  DEFAULT_JSON_TO_XML_OPTIONS,
  clampIndentSize,
  convertJsonToXmlText,
  getConvertJsonToXmlErrorMessage,
  isValidXmlElementName,
  normalizeJsonToXmlOptions,
}
export type { JsonToXmlOptions }
