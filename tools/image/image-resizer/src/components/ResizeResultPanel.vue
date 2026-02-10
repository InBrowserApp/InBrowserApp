<template>
  <ToolSection>
    <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>

    <n-grid cols="1 700:3" :x-gap="16" :y-gap="16">
      <n-grid-item>
        <n-statistic :label="labels.originalSize">
          {{ formattedOriginalSize }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="labels.resizedSize">
          {{ formattedResizedSize }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="labels.sizeChange"> {{ sizeChangePercent }}% </n-statistic>
      </n-grid-item>
    </n-grid>

    <n-grid cols="1 700:2" :x-gap="16" :y-gap="16" style="margin-top: 12px">
      <n-grid-item>
        <n-statistic :label="labels.originalDimensions">
          {{ originalDimensionLabel }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="labels.resizedDimensions">
          {{ resizedDimensionLabel }}
        </n-statistic>
      </n-grid-item>
    </n-grid>

    <n-flex style="margin-top: 16px">
      <n-button
        tag="a"
        type="primary"
        :href="downloadUrl"
        :download="result.outputName"
        style="width: 100%"
      >
        {{ labels.downloadImage }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize } from 'filesize'
import { NButton, NFlex, NGrid, NGridItem, NStatistic } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ResizeResult } from '../types'

interface ResultLabels {
  title: string
  originalSize: string
  resizedSize: string
  sizeChange: string
  originalDimensions: string
  resizedDimensions: string
  downloadImage: string
}

interface Props {
  originalFile: File
  result: ResizeResult
  downloadUrl: string
  labels: ResultLabels
}

const props = defineProps<Props>()

const formattedOriginalSize = computed(() => filesize(props.originalFile.size) as string)
const formattedResizedSize = computed(() => filesize(props.result.blob.size) as string)

const sizeChangePercent = computed(() => {
  if (props.originalFile.size <= 0) return '0'
  const change =
    ((props.result.blob.size - props.originalFile.size) / props.originalFile.size) * 100
  return change.toFixed(1)
})

const originalDimensionLabel = computed(
  () => `${props.result.originalWidth} × ${props.result.originalHeight}`,
)
const resizedDimensionLabel = computed(
  () => `${props.result.outputWidth} × ${props.result.outputHeight}`,
)
</script>
