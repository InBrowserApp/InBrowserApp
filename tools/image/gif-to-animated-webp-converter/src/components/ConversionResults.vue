<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>

    <n-flex vertical :size="16">
      <n-flex align="center" justify="space-between" :size="12">
        <n-flex vertical :size="4">
          <n-text depth="3">{{ countLabel }}</n-text>
          <n-text v-if="showTotalSaved" depth="3">
            {{ totalSavedLabel }}: {{ totalSavedText }}
          </n-text>
        </n-flex>
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
            :saved-label="savedLabel"
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
import { filesize } from 'filesize'
import { NButton, NFlex, NGi, NGrid, NIcon, NText } from 'naive-ui'
import ArrowDownload24Regular from '@vicons/fluent/ArrowDownload24Regular'
import Archive24Regular from '@vicons/fluent/Archive24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ResultCard from './ResultCard.vue'
import type { GifToAnimatedWebpResult } from '../types'

const props = defineProps<{
  title: string
  countLabel: string
  results: GifToAnimatedWebpResult[]
  zipBlob: Blob | null
  isZipping: boolean
  downloadZipName: string
  downloadWebpLabel: string
  downloadZipLabel: string
  originalLabel: string
  outputLabel: string
  savedLabel: string
  dimensionsLabel: string
  fileSizeLabel: string
  totalSavedLabel: string
}>()

const isBatch = computed(() => props.results.length > 1)
const singleResult = computed(() => (props.results.length === 1 ? props.results[0] : null))
const singleDownloadName = computed(() => singleResult.value?.outputName ?? 'image.webp')
const singleUrl = useObjectUrl(computed(() => singleResult.value?.blob ?? null))
const zipUrl = useObjectUrl(toRef(props, 'zipBlob'))
const totalOriginalBytes = computed(() =>
  props.results.reduce((total, result) => total + result.file.size, 0),
)
const totalOutputBytes = computed(() =>
  props.results.reduce((total, result) => total + result.blob.size, 0),
)
const totalSavedText = computed(() =>
  formatSavedText(totalOriginalBytes.value, totalOutputBytes.value),
)
const showTotalSaved = computed(() => totalOriginalBytes.value > 0 && props.results.length > 0)

function formatSavedText(originalBytes: number, outputBytes: number) {
  const delta = originalBytes - outputBytes
  const sign = delta < 0 ? '-' : ''
  const absDelta = Math.abs(delta)
  const percent = originalBytes > 0 ? (absDelta / originalBytes) * 100 : 0
  const sizeText = `${sign}${filesize(absDelta) as string}`
  const percentText = `${sign}${formatPercent(percent)}%`
  return `${sizeText} (${percentText})`
}

function formatPercent(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value >= 10) return `${Math.round(value)}`
  return value.toFixed(1)
}
</script>
