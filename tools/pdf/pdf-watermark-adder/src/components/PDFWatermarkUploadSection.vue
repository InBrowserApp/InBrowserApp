<template>
  <ToolSection>
    <n-flex vertical :size="12">
      <input
        ref="fileInputRef"
        class="hidden-file-input"
        type="file"
        accept="application/pdf,.pdf"
        @change="handleFileInputChange"
      />

      <ToolSectionHeader>{{ title }}</ToolSectionHeader>

      <n-flex :size="12" align="center">
        <n-button
          data-test="choose-file-button"
          :loading="isLoadingDocument"
          :disabled="isGenerating"
          @click="triggerFileDialog"
        >
          <template #icon>
            <n-icon>
              <DocumentArrowUp20Regular />
            </n-icon>
          </template>
          {{ file ? replaceFileLabel : chooseFileLabel }}
        </n-button>
        <n-button
          v-if="file"
          data-test="clear-file-button"
          tertiary
          :disabled="isGenerating"
          @click="emit('clear-file')"
        >
          {{ clearFileLabel }}
        </n-button>
      </n-flex>

      <n-text depth="3">{{ privacyHint }}</n-text>

      <n-flex v-if="file" vertical :size="4" data-test="file-meta">
        <n-text>{{ fileNameText }}</n-text>
        <n-text>{{ pageCountText }}</n-text>
      </n-flex>

      <n-alert v-if="fileErrorMessage" type="error" :title="fileErrorMessage" />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NAlert, NButton, NFlex, NIcon, NText } from 'naive-ui'
import DocumentArrowUp20Regular from '@vicons/fluent/DocumentArrowUp20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  title: string
  chooseFileLabel: string
  replaceFileLabel: string
  clearFileLabel: string
  privacyHint: string
  fileNameText: string
  pageCountText: string
  fileErrorMessage: string
  file: File | null
  isLoadingDocument: boolean
  isGenerating: boolean
}>()

const emit = defineEmits<{
  (event: 'upload', file: File): void
  (event: 'clear-file'): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerFileDialog = (): void => {
  fileInputRef.value?.click()
}

const handleFileInputChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (!selectedFile) {
    return
  }

  emit('upload', selectedFile)
  target.value = ''
}
</script>

<style scoped>
.hidden-file-input {
  display: none;
}
</style>
