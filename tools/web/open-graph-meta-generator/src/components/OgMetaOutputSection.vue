<template>
  <ToolSectionHeader>{{ t('outputTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-flex align="center" justify="space-between">
        <n-text depth="3">{{ t('outputTitle') }}</n-text>
        <n-flex align="center" :size="8">
          <CopyToClipboardButton v-if="hasOutput" :content="htmlContent" />
          <n-button
            tag="a"
            text
            :href="downloadHref"
            download="open-graph-meta-tags.html"
            :disabled="!downloadHref"
            data-testid="download-html"
          >
            {{ t('downloadHtml') }}
          </n-button>
        </n-flex>
      </n-flex>

      <n-text v-if="!hasOutput" depth="3">{{ t('outputEmpty') }}</n-text>

      <n-input
        :value="htmlContent"
        type="textarea"
        readonly
        :autosize="{ minRows: 10, maxRows: 24 }"
        data-testid="meta-output"
      />
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NButton, NFlex, NInput, NSpace, NText } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { messages } from '../locale/messages'

const props = defineProps<{
  htmlContent: string
}>()

const { t } = useI18n({ useScope: 'local', messages })

const hasOutput = computed(() => props.htmlContent.trim().length > 0)
const downloadBlob = computed(() => {
  if (!hasOutput.value) return null
  return new Blob([props.htmlContent], { type: 'text/html' })
})
const downloadUrl = useObjectUrl(downloadBlob)
const downloadHref = computed(() =>
  hasOutput.value ? (downloadUrl.value ?? undefined) : undefined,
)
</script>
