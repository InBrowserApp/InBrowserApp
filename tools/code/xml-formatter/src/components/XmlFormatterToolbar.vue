<template>
  <n-flex vertical :size="12">
    <XmlFormatterActions
      :download-file-name="downloadFileName"
      :download-url="downloadUrl"
      :output-xml="outputXml"
      :selected-mode="selectedMode"
      @clear="$emit('clear')"
      @import="$emit('import')"
      @update:selected-mode="$emit('update:selected-mode', $event)"
      @use-example="$emit('use-example')"
    />

    <XmlFormatterOptions
      :collapse-content="collapseContent"
      :error-column="errorColumn"
      :error-line="errorLine"
      :force-self-closing-empty-tag="forceSelfClosingEmptyTag"
      :has-invalid-xml="hasInvalidXml"
      :has-valid-xml="hasValidXml"
      :selected-indentation="selectedIndentation"
      :selected-line-ending="selectedLineEnding"
      :selected-mode="selectedMode"
      @update:collapse-content="$emit('update:collapse-content', $event)"
      @update:force-self-closing-empty-tag="$emit('update:force-self-closing-empty-tag', $event)"
      @update:selected-indentation="$emit('update:selected-indentation', $event)"
      @update:selected-line-ending="$emit('update:selected-line-ending', $event)"
    />
  </n-flex>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import type { XmlIndentation, XmlLineEnding, XmlOutputMode } from '../utils/xml'
import XmlFormatterActions from './XmlFormatterActions.vue'
import XmlFormatterOptions from './XmlFormatterOptions.vue'

defineProps<{
  collapseContent: boolean
  downloadFileName: string
  downloadUrl?: string
  errorColumn?: number
  errorLine?: number
  forceSelfClosingEmptyTag: boolean
  hasInvalidXml: boolean
  hasValidXml: boolean
  outputXml: string
  selectedIndentation: XmlIndentation
  selectedLineEnding: XmlLineEnding
  selectedMode: XmlOutputMode
}>()

defineEmits<{
  (e: 'clear'): void
  (e: 'import'): void
  (e: 'update:collapse-content', value: boolean): void
  (e: 'update:force-self-closing-empty-tag', value: boolean): void
  (e: 'update:selected-indentation', value: XmlIndentation): void
  (e: 'update:selected-line-ending', value: XmlLineEnding): void
  (e: 'update:selected-mode', value: XmlOutputMode): void
  (e: 'use-example'): void
}>()
</script>
