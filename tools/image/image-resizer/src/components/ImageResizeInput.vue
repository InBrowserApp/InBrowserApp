<template>
  <ToolSection>
    <ToolSectionHeader>{{ labels.uploadTitle }}</ToolSectionHeader>

    <template v-if="!file">
      <n-upload accept="image/*" @before-upload="handleBeforeUpload">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <Image24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ labels.dropHint }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ labels.supportedFormatsHint }}
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </template>

    <template v-else>
      <n-flex vertical :size="16">
        <n-flex align="center" :size="16">
          <n-image :src="previewUrl || ''" :alt="labels.previewAlt" width="160" />
          <n-flex vertical :size="4">
            <n-text strong>{{ file.name }}</n-text>
            <n-text depth="3">{{ filesize(file.size) }}</n-text>
            <n-text depth="3">{{ dimensionsText }}</n-text>
            <n-button size="small" @click="clearFile">
              <template #icon>
                <n-icon><Delete20Regular /></n-icon>
              </template>
              {{ labels.removeFile }}
            </n-button>
          </n-flex>
        </n-flex>
      </n-flex>
    </template>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NButton,
  NFlex,
  NIcon,
  NImage,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useMessage,
} from 'naive-ui'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import Image24Regular from '@vicons/fluent/Image24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import type { UploadFileInfo } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageDimensions } from '../types'

interface InputLabels {
  uploadTitle: string
  dropHint: string
  supportedFormatsHint: string
  removeFile: string
  onlyOneFile: string
  invalidFileType: string
  previewAlt: string
  dimensions: string
}

interface Props {
  dimensions: ImageDimensions | null
  labels: InputLabels
}

const props = defineProps<Props>()

const file = defineModel<File | null>('file', { required: true })

const message = useMessage()
const previewUrl = useObjectUrl(file)

const dimensionsText = computed(() => {
  const width = Math.max(1, props.dimensions?.width ?? 1)
  const height = Math.max(1, props.dimensions?.height ?? 1)
  return `${props.labels.dimensions}: ${width} × ${height}`
})

async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const selectedFile = data.file.file
  if (!selectedFile) return false

  if (data.fileList.length > 1) {
    message.error(props.labels.onlyOneFile)
    return false
  }

  if (!selectedFile.type.startsWith('image/')) {
    message.error(props.labels.invalidFileType)
    return false
  }

  file.value = selectedFile

  return false
}

function clearFile() {
  file.value = null
}
</script>
