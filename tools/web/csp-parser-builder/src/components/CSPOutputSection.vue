<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-tabs v-model:value="activeTab" type="line">
        <n-tab-pane name="policy" :tab="t('policy-value')">
          <n-input
            :value="policyValue"
            class="monospace-output"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 14 }"
            readonly
          />
        </n-tab-pane>
        <n-tab-pane name="header" :tab="t('http-header')">
          <n-input
            :value="headerValue"
            class="monospace-output"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 14 }"
            readonly
          />
        </n-tab-pane>
        <n-tab-pane name="meta" :tab="t('meta-tag')">
          <n-input
            :value="metaValue"
            class="monospace-output"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 14 }"
            readonly
          />
        </n-tab-pane>
      </n-tabs>

      <n-flex align="center" justify="space-between">
        <n-text v-if="!activeContent" depth="3">{{ t('empty') }}</n-text>
        <n-flex align="center" :size="8">
          <CopyToClipboardButton :content="activeContent" :disabled="!activeContent" />
          <n-button
            tag="a"
            text
            :href="downloadHref"
            :download="downloadName"
            :disabled="!downloadHref"
          >
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('download') }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NInput, NSpace, NTabPane, NTabs, NText } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  policyValue: string
  headerValue: string
  metaValue: string
}>()

const activeTab = ref<'policy' | 'header' | 'meta'>('policy')
const { t } = useI18n()

const activeContent = computed(() => {
  switch (activeTab.value) {
    case 'header':
      return props.headerValue
    case 'meta':
      return props.metaValue
    default:
      return props.policyValue
  }
})

const downloadName = computed(() => {
  switch (activeTab.value) {
    case 'header':
      return 'content-security-policy.txt'
    case 'meta':
      return 'content-security-policy-meta.html'
    default:
      return 'content-security-policy.txt'
  }
})

const downloadBlob = computed(() =>
  activeContent.value
    ? new Blob([activeContent.value], { type: 'text/plain;charset=utf-8' })
    : null,
)
const downloadUrl = useObjectUrl(downloadBlob)
const downloadHref = computed(() => downloadUrl.value ?? undefined)
</script>

<style scoped>
.monospace-output :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "zh": {
    "title": "输出",
    "policy-value": "策略值",
    "http-header": "HTTP 标头",
    "meta-tag": "Meta 标签",
    "empty": "暂无可导出的输出。",
    "download": "下载"
  },
  "zh-CN": {
    "title": "输出",
    "policy-value": "策略值",
    "http-header": "HTTP 标头",
    "meta-tag": "Meta 标签",
    "empty": "暂无可导出的输出。",
    "download": "下载"
  },
  "zh-TW": {
    "title": "輸出",
    "policy-value": "策略值",
    "http-header": "HTTP 標頭",
    "meta-tag": "Meta 標籤",
    "empty": "目前沒有可匯出的輸出。",
    "download": "下載"
  },
  "zh-HK": {
    "title": "輸出",
    "policy-value": "策略值",
    "http-header": "HTTP 標頭",
    "meta-tag": "Meta 標籤",
    "empty": "目前沒有可匯出的輸出。",
    "download": "下載"
  },
  "es": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "fr": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "de": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "it": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "ja": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "ko": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "ru": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "pt": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "ar": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "hi": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "tr": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "nl": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "sv": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "pl": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "vi": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "th": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "id": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "he": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "ms": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  },
  "no": {
    "title": "Output",
    "policy-value": "Policy value",
    "http-header": "HTTP header",
    "meta-tag": "Meta tag",
    "empty": "No output to export yet.",
    "download": "Download"
  }
}
</i18n>
