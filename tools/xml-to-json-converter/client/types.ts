import type { XmlToJsonOptions } from "../core/convert-xml-to-json"

export type XmlToJsonConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  importFromFileLabel: string
  xmlLabel: string
  xmlDescription: string
  xmlPlaceholder: string
  jsonLabel: string
  jsonDescription: string
  downloadJsonLabel: string
  jsonEmptyDescription: string
  invalidXmlLabel: string
  optionsLabel: string
  optionsDescription: string
  indentSizeLabel: string
  indentSizeDescription: string
  compactLabel: string
  ignoreDeclarationLabel: string
  ignoreInstructionLabel: string
  ignoreAttributesLabel: string
  ignoreTextLabel: string
  ignoreCdataLabel: string
  ignoreDoctypeLabel: string
  ignoreCommentLabel: string
  trimLabel: string
  nativeTypeLabel: string
  alwaysArrayLabel: string
  alwaysChildrenLabel: string
  copyJsonLabel: string
  copiedLabel: string
}>

export type XmlToJsonOptionsStorageValue = Partial<XmlToJsonOptions>
