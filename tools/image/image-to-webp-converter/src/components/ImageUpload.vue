<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>

    <n-upload
      :accept="accept"
      multiple
      :default-upload="false"
      :show-file-list="false"
      @before-upload="handleBeforeUpload"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <Image24Regular />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">{{ dragDropText }}</n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          {{ supportText }}
        </n-p>
      </n-upload-dragger>
    </n-upload>

    <n-flex v-if="files.length" vertical :size="12" style="margin-top: 16px">
      <n-flex align="center" justify="space-between" :size="12">
        <n-text depth="3">{{ selectedCountLabel }}</n-text>
        <n-button size="small" secondary @click="handleClearAll">
          <template #icon>
            <n-icon><Delete20Regular /></n-icon>
          </template>
          {{ clearAllLabel }}
        </n-button>
      </n-flex>

      <n-flex vertical :size="8">
        <n-flex
          v-for="file in files"
          :key="fileKey(file)"
          align="center"
          justify="space-between"
          :size="12"
        >
          <n-flex vertical :size="2">
            <n-text strong>{{ file.name }}</n-text>
            <n-text depth="3">{{ formatSize(file.size) }}</n-text>
          </n-flex>
          <n-button size="small" @click="handleRemove(file)">
            <template #icon>
              <n-icon><Delete20Regular /></n-icon>
            </template>
            {{ removeLabel }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { filesize } from 'filesize'
import type { UploadFileInfo } from 'naive-ui'
import { NUpload, NUploadDragger, NIcon, NText, NP, NFlex, NButton } from 'naive-ui'
import Image24Regular from '@vicons/fluent/Image24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const message = useMessage()

const props = defineProps<{
  files: File[]
  title: string
  dragDropText: string
  supportText: string
  selectedCountLabel: string
  removeLabel: string
  clearAllLabel: string
  invalidTypeMessage: string
  duplicateMessage: string
}>()

const emit = defineEmits<{
  'update:files': [files: File[]]
}>()

const accept = 'image/*'
const imageExtensions = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'bmp',
  'svg',
  'svgz',
  'tif',
  'tiff',
  'avif',
  'heic',
  'heif',
  'jfif',
])

const files = computed(() => props.files)

function formatSize(size: number) {
  return filesize(size) as string
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function handleBeforeUpload(data: { file: UploadFileInfo }) {
  const selectedFile = data.file.file
  if (!selectedFile) return false

  if (!isValidImageFile(selectedFile)) {
    message.error(props.invalidTypeMessage)
    return false
  }

  if (files.value.some((file) => fileKey(file) === fileKey(selectedFile))) {
    message.error(props.duplicateMessage)
    return false
  }

  emit('update:files', [...files.value, selectedFile])
  return false
}

function handleRemove(file: File) {
  emit(
    'update:files',
    files.value.filter((item) => fileKey(item) !== fileKey(file)),
  )
}

function handleClearAll() {
  emit('update:files', [])
}

function isValidImageFile(file: File) {
  if (file.type.startsWith('image/')) return true

  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext) return false
  return imageExtensions.has(ext)
}
</script>
