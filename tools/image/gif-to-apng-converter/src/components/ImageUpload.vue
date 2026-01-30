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
        <UploadFileItem
          v-for="file in files"
          :key="fileKey(file)"
          :file="file"
          :remove-label="removeLabel"
          @remove="handleRemove(file)"
        />
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { NUpload, NUploadDragger, NIcon, NText, NP, NFlex, NButton } from 'naive-ui'
import Image24Regular from '@vicons/fluent/Image24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import UploadFileItem from './UploadFileItem.vue'

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

const message = useMessage()

const accept = 'image/gif'

const files = computed(() => props.files)

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function handleBeforeUpload(data: { file: UploadFileInfo }) {
  const selectedFile = data.file.file
  if (!selectedFile) return false

  if (!isValidGifFile(selectedFile)) {
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

function isValidGifFile(file: File) {
  if (file.type === 'image/gif') return true
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext === 'gif'
}
</script>
