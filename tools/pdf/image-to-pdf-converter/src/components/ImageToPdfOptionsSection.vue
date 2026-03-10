<template>
  <n-flex vertical :size="16">
    <ImageToPdfDocumentNameSection
      :output-name="options.outputName"
      @update:output-name="updateOption('outputName', $event)"
    />

    <ImageToPdfPageSettingsSection
      :page-size="options.pageSize"
      :page-orientation="options.pageOrientation"
      @update:page-size="updateOption('pageSize', $event)"
      @update:page-orientation="updateOption('pageOrientation', $event)"
    />

    <ImageToPdfLayoutSettingsSection
      :fit-mode="options.fitMode"
      :quality-preset="options.qualityPreset"
      :margin-mm="options.marginMm"
      @update:fit-mode="updateOption('fitMode', $event)"
      @update:quality-preset="updateOption('qualityPreset', $event)"
      @update:margin-mm="updateOption('marginMm', $event)"
    />
  </n-flex>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import type { ConverterOptions } from '../types'
import ImageToPdfDocumentNameSection from './ImageToPdfDocumentNameSection.vue'
import ImageToPdfPageSettingsSection from './ImageToPdfPageSettingsSection.vue'
import ImageToPdfLayoutSettingsSection from './ImageToPdfLayoutSettingsSection.vue'

const options = defineModel<ConverterOptions>('options', {
  required: true,
})

function updateOption<Key extends keyof ConverterOptions>(key: Key, value: ConverterOptions[Key]) {
  options.value = {
    ...options.value,
    [key]: value,
  }
}
</script>
