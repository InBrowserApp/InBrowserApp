<template>
  <ToolSection>
    <XmlFormatterToolbar
      :collapse-content="collapseContent"
      :download-file-name="downloadFileName"
      :download-url="outputXml ? (downloadUrl ?? undefined) : undefined"
      :error-column="errorColumn"
      :error-line="errorLine"
      :force-self-closing-empty-tag="forceSelfClosingEmptyTag"
      :has-invalid-xml="hasInvalidXml"
      :has-valid-xml="hasValidXml"
      :output-xml="outputXml"
      :selected-indentation="selectedIndentation"
      :selected-line-ending="selectedLineEnding"
      :selected-mode="selectedMode"
      @clear="clearXml"
      @import="importFromFile"
      @update:collapse-content="collapseContent = $event"
      @update:force-self-closing-empty-tag="forceSelfClosingEmptyTag = $event"
      @update:selected-indentation="selectedIndentation = $event"
      @update:selected-line-ending="selectedLineEnding = $event"
      @update:selected-mode="selectedMode = $event"
      @use-example="useExample"
    />
  </ToolSection>

  <ToolSection>
    <XmlFormatterPanels
      :error-column="errorColumn"
      :error-context="errorContext"
      :error-line="errorLine"
      :error-message="errorMessage"
      :is-invalid="hasInvalidXml"
      :output-xml="outputXml"
      :source-xml="sourceXml"
      @update:source-xml="sourceXml = $event"
    />
  </ToolSection>

  <ToolSection>
    <WhatIsXmlFormatter />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { ToolSection } from '@shared/ui/tool'
import { fileOpen } from 'browser-fs-access'
import XmlFormatterPanels from './XmlFormatterPanels.vue'
import XmlFormatterToolbar from './XmlFormatterToolbar.vue'
import WhatIsXmlFormatter from './WhatIsXmlFormatter.vue'
import {
  formatXmlString,
  getXmlErrorContext,
  type XmlFormattingOptions,
  type XmlIndentation,
  type XmlLineEnding,
  type XmlOutputMode,
  validateXml,
} from '../utils/xml'

const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <!-- Featured book -->
  <book id="bk101">
    <title>XML Developer's Guide</title>
    <author>Gambardella, Matthew</author>
    <description><![CDATA[Deep dive into <xml> formatting.]]></description>
    <empty></empty>
  </book>
</catalog>`

const sourceXml = ref(defaultXml)
const selectedMode = ref<XmlOutputMode>('formatted')
const selectedIndentation = ref<XmlIndentation>('2-spaces')
const selectedLineEnding = ref<XmlLineEnding>('lf')
const collapseContent = ref(true)
const forceSelfClosingEmptyTag = ref(false)

const validationState = computed(() => {
  if (!sourceXml.value.trim()) {
    return { kind: 'empty' as const }
  }

  const validationResult = validateXml(sourceXml.value)

  if (validationResult.valid) {
    return { kind: 'valid' as const }
  }

  return {
    kind: 'invalid' as const,
    ...validationResult,
  }
})

const formattingOptions = computed<XmlFormattingOptions>(() => ({
  collapseContent: collapseContent.value,
  forceSelfClosingEmptyTag: forceSelfClosingEmptyTag.value,
  indentation: selectedIndentation.value,
  lineEnding: selectedLineEnding.value,
  mode: selectedMode.value,
}))

const outputXml = computed(() => {
  if (validationState.value.kind !== 'valid') {
    return ''
  }

  return formatXmlString(sourceXml.value, formattingOptions.value)
})

const hasValidXml = computed(() => validationState.value.kind === 'valid')
const hasInvalidXml = computed(() => validationState.value.kind === 'invalid')

const errorMessage = computed(() =>
  validationState.value.kind === 'invalid' ? validationState.value.message : '',
)

const errorLine = computed(() =>
  validationState.value.kind === 'invalid' ? validationState.value.line : undefined,
)

const errorColumn = computed(() =>
  validationState.value.kind === 'invalid' ? validationState.value.column : undefined,
)

const errorContext = computed(() => {
  if (validationState.value.kind !== 'invalid') {
    return ''
  }

  return getXmlErrorContext(sourceXml.value, errorLine.value ?? 1, errorColumn.value ?? 1)
})

const downloadBlob = computed(
  () => new Blob([outputXml.value], { type: 'application/xml;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

const downloadFileName = computed(() =>
  selectedMode.value === 'formatted' ? 'formatted.xml' : 'minified.xml',
)

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({
      extensions: ['.xml', '.svg', '.rss', '.plist', '.xsd', '.wsdl', '.txt'],
    })
    sourceXml.value = await file.text()
  } catch {
    // User cancelled file selection.
  }
}

function useExample() {
  sourceXml.value = defaultXml
}

function clearXml() {
  sourceXml.value = ''
}
</script>
