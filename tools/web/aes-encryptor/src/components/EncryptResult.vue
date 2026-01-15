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
        <n-popover trigger="click">
          <template #trigger>
            <n-button text>
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('download') }}
            </n-button>
          </template>
          <n-flex vertical :size="8">
            <n-button
              v-for="link in downloadLinks"
              :key="link.label"
              tag="a"
              text
              :href="link.url ?? undefined"
              :download="link.filename"
              :disabled="!link.url"
            >
              {{ link.label }}
            </n-button>
          </n-flex>
        </n-popover>
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
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import {
  NSpace,
  NAlert,
  NInput,
  NButton,
  NIcon,
  NPopover,
  NFlex,
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
const base64Content = computed(() => {
  if (props.outputMode === 'jwe') return ''
  return props.outputFormat === 'base64' ? props.result : hexToBase64(props.result)
})
const hexContent = computed(() => {
  if (props.outputMode === 'jwe') return ''
  return props.outputFormat === 'hex' ? props.result : base64ToHex(props.result)
})

const binaryBlob = computed(() => {
  if (!props.binary || props.outputMode === 'jwe') return null
  return new Blob([props.binary], { type: 'application/octet-stream' })
})
const base64Blob = computed(() => {
  if (props.outputMode === 'jwe') return null
  return new Blob([base64Content.value], { type: 'text/plain' })
})
const hexBlob = computed(() => {
  if (props.outputMode === 'jwe') return null
  return new Blob([hexContent.value], { type: 'text/plain' })
})
const jweBlob = computed(() => {
  if (props.outputMode !== 'jwe') return null
  return new Blob([props.result], { type: 'application/jose' })
})

const binaryUrl = useObjectUrl(binaryBlob)
const base64Url = useObjectUrl(base64Blob)
const hexUrl = useObjectUrl(hexBlob)
const jweUrl = useObjectUrl(jweBlob)

const downloadLinks = computed(() => {
  if (props.outputMode === 'jwe') {
    return [{ label: 'JWE (.jwe)', url: jweUrl.value, filename: 'encrypted.jwe' }]
  }
  const links = [
    { label: 'Binary (.bin)', url: binaryUrl.value, filename: 'encrypted.bin' },
    { label: 'Base64 (.txt)', url: base64Url.value, filename: 'encrypted.txt' },
    { label: 'Hex (.txt)', url: hexUrl.value, filename: 'encrypted.txt' },
  ]
  return props.binary ? links : links.slice(1)
})

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
