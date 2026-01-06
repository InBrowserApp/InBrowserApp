<template>
  <ToolSection v-if="result || error">
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <n-alert v-if="error" type="error" :title="t('error')">{{ error }}</n-alert>
    <template v-else>
      <n-input
        :value="result"
        type="textarea"
        readonly
        :autosize="{ minRows: 3, maxRows: 10 }"
        style="font-family: monospace"
      />
      <n-space style="margin-top: 8px">
        <CopyToClipboardButton :content="result" />
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

      <n-collapse v-if="outputMode === 'raw'" style="margin-top: 12px">
        <n-collapse-item :title="t('parameterDetails')" name="params">
          <n-descriptions :column="1" label-placement="left">
            <n-descriptions-item label="Salt">
              <n-space align="center">
                <code>{{ salt }}</code>
                <CopyToClipboardButton :content="salt" size="tiny" />
              </n-space>
            </n-descriptions-item>
            <n-descriptions-item label="IV">
              <n-space align="center">
                <code>{{ iv }}</code>
                <CopyToClipboardButton :content="iv" size="tiny" />
              </n-space>
            </n-descriptions-item>
          </n-descriptions>
        </n-collapse-item>
      </n-collapse>
    </template>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NSpace,
  NAlert,
  NInput,
  NButton,
  NIcon,
  NPopselect,
  NCollapse,
  NCollapseItem,
  NDescriptions,
  NDescriptionsItem,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ArrowDownload16Regular } from '@shared/icons/fluent'
import type { OutputMode, OutputFormat } from '@utils/aes'

const props = defineProps<{
  result: string
  error: string
  salt: string
  iv: string
  binary: ArrayBuffer | null
  outputMode: OutputMode
  outputFormat: OutputFormat
}>()

const { t } = useI18n()

const downloadType = ref<string | null>(null)

const downloadOptions = computed(() => {
  if (props.outputMode === 'jwe') {
    return [{ label: 'JWE (.jwe)', value: 'jwe' }]
  }
  return [
    { label: 'Binary (.bin)', value: 'binary' },
    { label: 'Base64 (.txt)', value: 'base64' },
    { label: 'Hex (.txt)', value: 'hex' },
  ]
})

function handleDownload(value: string) {
  if (value === 'jwe') {
    downloadText(props.result, 'encrypted.jwe')
  } else if (value === 'binary' && props.binary) {
    downloadBinary(props.binary, 'encrypted.bin')
  } else if (value === 'base64') {
    const content = props.outputFormat === 'base64' ? props.result : hexToBase64(props.result)
    downloadText(content, 'encrypted.txt')
  } else if (value === 'hex') {
    const content = props.outputFormat === 'hex' ? props.result : base64ToHex(props.result)
    downloadText(content, 'encrypted.txt')
  }
  // Reset selection
  downloadType.value = null
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadBinary(data: ArrayBuffer, filename: string) {
  const blob = new Blob([data], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function hexToUint8Array(hex: string): Uint8Array {
  const cleanHex = hex.replace(/\s/g, '')
  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16)
  }
  return bytes
}

function hexToBase64(hex: string): string {
  const bytes = hexToUint8Array(hex)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function base64ToHex(base64: string): string {
  const binary = atob(base64)
  let hex = ''
  for (let i = 0; i < binary.length; i++) {
    hex += binary.charCodeAt(i).toString(16).padStart(2, '0')
  }
  return hex
}
</script>

<i18n lang="json">
{
  "en": {
    "result": "Result",
    "error": "Error",
    "download": "Download",
    "parameterDetails": "Parameter Details"
  },
  "zh": {
    "result": "结果",
    "error": "错误",
    "download": "下载",
    "parameterDetails": "参数详情"
  }
}
</i18n>
