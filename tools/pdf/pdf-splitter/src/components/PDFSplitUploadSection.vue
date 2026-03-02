<template>
  <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="8">
      <n-upload
        accept=".pdf,application/pdf"
        :show-file-list="false"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <DocumentPdf24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ labels.dragHint }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">{{ labels.localOnly }}</n-p>
        </n-upload-dragger>
      </n-upload>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import {
  NFlex,
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useMessage,
  type UploadFileInfo,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import DocumentPdf24Regular from '@vicons/fluent/DocumentPdf24Regular'
import { isPdfFile } from '../inspect-pdf'

const emit = defineEmits<{
  (event: 'upload', file: File): void
}>()

const message = useMessage()

const labels = {
  title: 'Upload PDF',
  dragHint: 'Click or drag to add a PDF file',
  localOnly: 'Files are processed locally in your browser.',
  onlyPdf: 'Only PDF files are allowed.',
}

const handleBeforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  const selectedFile = data.file.file
  if (!selectedFile) {
    return false
  }

  if (!isPdfFile(selectedFile)) {
    message.error(labels.onlyPdf)
    return false
  }

  emit('upload', selectedFile)
  return false
}
</script>
