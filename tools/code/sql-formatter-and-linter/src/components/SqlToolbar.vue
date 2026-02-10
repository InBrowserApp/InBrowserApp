<template>
  <n-flex align="center" justify="space-between" :wrap="true" :size="12">
    <n-flex align="center" :wrap="true" :size="12">
      <n-button text @click="$emit('import')">
        <template #icon>
          <n-icon :component="Document16Regular" />
        </template>
        {{ t('import-from-file') }}
      </n-button>
      <n-button text @click="$emit('sample')">
        <template #icon>
          <n-icon :component="ClipboardPaste16Regular" />
        </template>
        {{ t('use-sample') }}
      </n-button>
      <n-button text @click="$emit('clear')">
        <template #icon>
          <n-icon :component="Delete16Regular" />
        </template>
        {{ t('clear') }}
      </n-button>
    </n-flex>

    <n-flex align="center" :wrap="true" :size="12">
      <CopyToClipboardButton :content="formattedSql" />
      <n-button
        tag="a"
        text
        :disabled="!downloadUrl"
        :href="downloadUrl ?? undefined"
        :download="downloadFilename"
      >
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download-formatted') }}
      </n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import ClipboardPaste16Regular from '@vicons/fluent/ClipboardPaste16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'

defineProps<{
  formattedSql: string
  downloadUrl: string | null
  downloadFilename: string
}>()

defineEmits<{
  import: []
  sample: []
  clear: []
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "zh": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "zh-CN": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "zh-TW": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "zh-HK": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "es": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "fr": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "de": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "it": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "ja": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "ko": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "ru": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "pt": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "ar": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "hi": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "tr": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "nl": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "sv": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "pl": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "vi": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "th": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "id": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "he": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "ms": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "no": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  }
}
</i18n>
