<template>
  <ToolSection v-if="result || resultBinary || error">
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <n-alert v-if="error" type="error" :title="t('error')">{{ error }}</n-alert>
    <template v-else>
      <n-tabs v-model:value="activeTab" type="line">
        <n-tab-pane name="text" :tab="t('textTab')">
          <n-input
            :value="result"
            type="textarea"
            readonly
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </n-tab-pane>
        <n-tab-pane name="hex" :tab="t('hexTab')">
          <n-input
            :value="resultHex"
            type="textarea"
            readonly
            :autosize="{ minRows: 3, maxRows: 10 }"
            style="font-family: monospace"
          />
        </n-tab-pane>
      </n-tabs>
      <n-space style="margin-top: 8px">
        <CopyToClipboardButton :content="activeTab === 'text' ? result : resultHex" />
        <n-popselect
          v-model:value="downloadType"
          :options="downloadOptions"
          trigger="click"
          @update:value="handleDownload"
        >
          <n-button text>
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('download') }}
          </n-button>
        </n-popselect>
      </n-space>
    </template>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NSpace, NAlert, NInput, NButton, NIcon, NPopselect, NTabs, NTabPane } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ArrowDownload16Regular } from '@shared/icons/fluent'

const props = defineProps<{
  result: string
  resultHex: string
  resultBinary: ArrayBuffer | null
  error: string
}>()

const { t } = useI18n()

const activeTab = ref<'text' | 'hex'>('text')
const downloadType = ref<string | null>(null)

const downloadOptions = [
  { label: 'Text (.txt)', value: 'text' },
  { label: 'Binary (.bin)', value: 'binary' },
]

function handleDownload(value: string) {
  if (!props.resultBinary) return

  if (value === 'text') {
    const blob = new Blob([props.result], { type: 'text/plain' })
    downloadBlob(blob, 'decrypted.txt')
  } else if (value === 'binary') {
    const blob = new Blob([props.resultBinary], { type: 'application/octet-stream' })
    downloadBlob(blob, 'decrypted.bin')
  }
  // Reset selection
  downloadType.value = null
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<i18n lang="json">
{
  "en": {
    "result": "Result",
    "textTab": "Text",
    "hexTab": "Hex",
    "error": "Error",
    "download": "Download"
  },
  "zh": {
    "result": "结果",
    "textTab": "文本",
    "hexTab": "十六进制",
    "error": "错误",
    "download": "下载"
  }
}
</i18n>
