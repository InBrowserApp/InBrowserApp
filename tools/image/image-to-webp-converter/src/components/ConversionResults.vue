<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>

    <n-flex vertical :size="16">
      <n-flex align="center" justify="space-between" :size="12">
        <n-text depth="3">{{ countLabel }}</n-text>
        <n-button
          v-if="isBatch"
          tag="a"
          type="primary"
          :href="zipUrl || undefined"
          :download="downloadZipName"
          :loading="isZipping"
          :disabled="!zipUrl || isZipping"
        >
          <template #icon>
            <n-icon><Archive24Regular /></n-icon>
          </template>
          {{ downloadZipLabel }}
        </n-button>
        <n-button
          v-else
          tag="a"
          type="primary"
          :href="singleUrl || undefined"
          :download="singleDownloadName"
          :disabled="!singleUrl"
        >
          <template #icon>
            <n-icon><ArrowDownload24Regular /></n-icon>
          </template>
          {{ downloadWebpLabel }}
        </n-button>
      </n-flex>

      <n-grid cols="1 s:2 l:3" :x-gap="16" :y-gap="16" responsive="screen">
        <n-gi v-for="result in results" :key="result.outputName">
          <ResultCard
            :result="result"
            :original-label="originalLabel"
            :output-label="outputLabel"
            :dimensions-label="dimensionsLabel"
            :file-size-label="fileSizeLabel"
          />
        </n-gi>
      </n-grid>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NButton, NFlex, NGi, NGrid, NIcon, NText } from 'naive-ui'
import ArrowDownload24Regular from '@vicons/fluent/ArrowDownload24Regular'
import Archive24Regular from '@vicons/fluent/Archive24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ResultCard from './ResultCard.vue'
import type { WebpConversionResult } from '../types'

const props = defineProps<{
  title: string
  countLabel: string
  results: WebpConversionResult[]
  zipBlob: Blob | null
  isZipping: boolean
  downloadZipName: string
  downloadWebpLabel: string
  downloadZipLabel: string
  originalLabel: string
  outputLabel: string
  dimensionsLabel: string
  fileSizeLabel: string
}>()

const isBatch = computed(() => props.results.length > 1)
const singleResult = computed(() => (props.results.length === 1 ? props.results[0] : null))
const singleDownloadName = computed(() => singleResult.value?.outputName ?? 'image.webp')
const singleUrl = useObjectUrl(computed(() => singleResult.value?.blob ?? null))
const zipUrl = useObjectUrl(toRef(props, 'zipBlob'))
</script>
