<template>
  <section data-test="generate-section">
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <n-button
          data-test="generate-button"
          type="primary"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="emit('generate')"
        >
          <template #icon>
            <n-icon>
              <Sparkle16Filled />
            </n-icon>
          </template>
          {{ isGenerating ? generatingLabel : generateLabel }}
        </n-button>

        <n-alert v-if="generateErrorMessage" type="error" :title="generateErrorMessage" />

        <n-flex
          v-if="hasResult && resultUrl"
          align="center"
          justify="space-between"
          :wrap="true"
          :size="8"
        >
          <n-text>{{ resultReadyLabel }}</n-text>
          <n-button tag="a" type="primary" :href="resultUrl" :download="resultFilename">
            <template #icon>
              <n-icon>
                <ArrowDownload16Regular />
              </n-icon>
            </template>
            {{ downloadLabel }}
          </n-button>
        </n-flex>
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import { NAlert, NButton, NFlex, NIcon, NText } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Sparkle16Filled from '@vicons/fluent/Sparkle16Filled'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  title: string
  generateLabel: string
  generatingLabel: string
  resultReadyLabel: string
  downloadLabel: string
  generateErrorMessage: string
  isGenerating: boolean
  canGenerate: boolean
  hasResult: boolean
  resultUrl: string | null
  resultFilename: string
}>()

const emit = defineEmits<{
  (event: 'generate'): void
}>()
</script>
