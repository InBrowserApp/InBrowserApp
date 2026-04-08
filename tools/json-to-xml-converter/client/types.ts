import type { JsonToXmlOptions } from "../core/convert-json-to-xml"

export type JsonToXmlConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  importFromFileLabel: string
  downloadXmlLabel: string
  jsonLabel: string
  jsonDescription: string
  xmlLabel: string
  xmlDescription: string
  xmlEmptyDescription: string
  jsonPlaceholder: string
  invalidJsonLabel: string
  invalidXmlTagLabel: string
  optionsLabel: string
  optionsDescription: string
  rootElementLabel: string
  rootElementDescription: string
  arrayItemTagLabel: string
  arrayItemTagDescription: string
  indentSizeLabel: string
  indentSizeDescription: string
  includeDeclarationLabel: string
  includeDeclarationDescription: string
  expandEmptyElementsLabel: string
  expandEmptyElementsDescription: string
  invalidRootElementNameMessage: string
  invalidArrayItemTagMessage: string
  copyXmlLabel: string
  copiedLabel: string
}>

export type JsonToXmlOptionsStorageValue = Partial<JsonToXmlOptions>
