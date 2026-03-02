<template>
  <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex :size="8" :wrap="false" justify="space-between">
        <n-button tertiary @click="emit('reset')">{{ labels.reset }}</n-button>
        <n-button
          type="primary"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="emit('generate')"
        >
          {{ isGenerating ? labels.generating : labels.generate }}
        </n-button>
      </n-flex>

      <n-alert v-if="rangeErrorMessage" type="error" :title="rangeErrorMessage" />
      <n-alert v-if="generateErrorMessage" type="error" :title="generateErrorMessage" />

      <n-flex v-if="hasResult && downloadUrl" align="center" justify="space-between" :wrap="false">
        <n-text>
          {{ labels.resultReady }} {{ resultFileCount }}
          {{ resultFileCount === 1 ? labels.file : labels.files }}.
        </n-text>
        <n-button tag="a" type="primary" :href="downloadUrl" :download="resultFilename">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ labels.download }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NButton, NFlex, NIcon, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

defineProps<{
  isGenerating: boolean
  canGenerate: boolean
  rangeErrorMessage: string
  generateErrorMessage: string
  hasResult: boolean
  downloadUrl: string | null
  resultFilename: string
  resultFileCount: number
}>()

const emit = defineEmits<{
  (event: 'reset'): void
  (event: 'generate'): void
}>()

const labels = {
  title: 'Generate',
  reset: 'Reset',
  generating: 'Generating...',
  generate: 'Generate Result',
  resultReady: 'Result ready:',
  file: 'file',
  files: 'files',
  download: 'Download',
}
</script>
