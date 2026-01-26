<template>
  <n-card size="small">
    <n-flex vertical :size="8">
      <div class="preview-box">
        <img v-if="previewUrl" :src="previewUrl" :alt="result.outputName" class="preview-image" />
      </div>
      <n-text strong>{{ result.outputName }}</n-text>
      <n-text depth="3">{{ originalLabel }}: {{ originalLabelText }}</n-text>
      <n-text depth="3">{{ outputLabel }}: {{ outputLabelText }}</n-text>
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import { NCard, NFlex, NText } from 'naive-ui'
import type { WebpConversionResult } from '../types'

const props = defineProps<{
  result: WebpConversionResult
  originalLabel: string
  outputLabel: string
  dimensionsLabel: string
  fileSizeLabel: string
}>()

const blobRef = toRef(props, 'result')
const previewUrl = useObjectUrl(computed(() => blobRef.value.blob))

const originalLabelText = computed(() => {
  return `${props.dimensionsLabel}: ${props.result.originalWidth} × ${props.result.originalHeight} · ${
    props.fileSizeLabel
  }: ${filesize(props.result.file.size) as string}`
})

const outputLabelText = computed(() => {
  return `${props.dimensionsLabel}: ${props.result.outputWidth} × ${props.result.outputHeight} · ${
    props.fileSizeLabel
  }: ${filesize(props.result.blob.size) as string}`
})
</script>

<style scoped>
.preview-box {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--n-border-color);
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.preview-image {
  max-width: 100%;
  max-height: 160px;
  object-fit: contain;
  display: block;
}
</style>
