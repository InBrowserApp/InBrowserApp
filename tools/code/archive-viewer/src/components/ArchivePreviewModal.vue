<template>
  <n-modal
    :show="show"
    :mask-closable="true"
    @update:show="handleUpdateShow"
    @after-leave="emit('after-leave')"
  >
    <n-card
      closable
      role="dialog"
      style="width: min(860px, 92vw)"
      :title="selectedEntry?.path || labels.previewTitle"
      @close="handleClose"
    >
      <template v-if="selectedEntry">
        <n-flex vertical :size="10">
          <n-flex justify="space-between" align="center" :size="10">
            <n-text depth="3">{{ formatBytes(selectedEntry.size) }}</n-text>

            <n-flex align="center" :size="8">
              <CopyToClipboardButton
                v-if="shouldShowCopyPreview"
                variant="text"
                :content="previewText"
              >
                <template #label>
                  {{ labels.copyPreview }}
                </template>
              </CopyToClipboardButton>

              <n-button
                v-if="selectedBlobUrl && selectedEntry.kind === 'file'"
                tag="a"
                text
                :href="selectedBlobUrl"
                :download="downloadName"
              >
                <template #icon>
                  <n-icon :component="ArrowDownload16Regular" />
                </template>
                {{ labels.downloadEntry }}
              </n-button>
            </n-flex>
          </n-flex>

          <n-scrollbar style="max-height: 80vh">
            <n-flex v-if="isLoadingPreview" align="center" :size="8">
              <n-spin size="small" />
              <n-text>{{ labels.loadingPreview }}</n-text>
            </n-flex>

            <div
              v-else-if="previewKind === 'image' && selectedBlobUrl"
              style="display: flex; justify-content: center; align-items: center; padding: 8px 0"
            >
              <img
                style="max-width: 100%; max-height: 76vh; object-fit: contain; display: block"
                :src="selectedBlobUrl"
                :alt="selectedEntry.path"
              />
            </div>

            <n-code
              v-else-if="previewKind === 'text'"
              :code="previewText"
              :language="previewLanguage"
              :hljs="hljs"
              show-line-numbers
              word-wrap
            />

            <n-alert v-else type="info">{{ previewText || labels.noPreview }}</n-alert>
          </n-scrollbar>
        </n-flex>
      </template>
      <template v-else>
        <n-text depth="3">{{ labels.noSelection }}</n-text>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NFlex,
  NIcon,
  NModal,
  NScrollbar,
  NSpin,
  NText,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import hljs from 'highlight.js/lib/core'
import bashLang from 'highlight.js/lib/languages/bash'
import cssLang from 'highlight.js/lib/languages/css'
import goLang from 'highlight.js/lib/languages/go'
import iniLang from 'highlight.js/lib/languages/ini'
import javaLang from 'highlight.js/lib/languages/java'
import javascriptLang from 'highlight.js/lib/languages/javascript'
import jsonLang from 'highlight.js/lib/languages/json'
import kotlinLang from 'highlight.js/lib/languages/kotlin'
import markdownLang from 'highlight.js/lib/languages/markdown'
import phpLang from 'highlight.js/lib/languages/php'
import plaintextLang from 'highlight.js/lib/languages/plaintext'
import pythonLang from 'highlight.js/lib/languages/python'
import rubyLang from 'highlight.js/lib/languages/ruby'
import rustLang from 'highlight.js/lib/languages/rust'
import sqlLang from 'highlight.js/lib/languages/sql'
import typescriptLang from 'highlight.js/lib/languages/typescript'
import xmlLang from 'highlight.js/lib/languages/xml'
import yamlLang from 'highlight.js/lib/languages/yaml'
import type { ArchiveEntry } from '../types'

type PreviewLabels = {
  previewTitle: string
  noSelection: string
  loadingPreview: string
  noPreview: string
  copyPreview: string
  downloadEntry: string
}

defineProps<{
  show: boolean
  selectedEntry: ArchiveEntry | null
  selectedBlobUrl?: string
  previewKind: 'none' | 'text' | 'image'
  previewText: string
  previewLanguage: string
  isLoadingPreview: boolean
  downloadName: string
  labels: PreviewLabels
  shouldShowCopyPreview: boolean
  formatBytes: (value: number) => string
}>()

const emit = defineEmits<{
  (event: 'update:show', value: boolean): void
  (event: 'after-leave'): void
}>()

hljs.registerLanguage('bash', bashLang)
hljs.registerLanguage('css', cssLang)
hljs.registerLanguage('go', goLang)
hljs.registerLanguage('ini', iniLang)
hljs.registerLanguage('java', javaLang)
hljs.registerLanguage('javascript', javascriptLang)
hljs.registerLanguage('json', jsonLang)
hljs.registerLanguage('kotlin', kotlinLang)
hljs.registerLanguage('markdown', markdownLang)
hljs.registerLanguage('php', phpLang)
hljs.registerLanguage('plaintext', plaintextLang)
hljs.registerLanguage('python', pythonLang)
hljs.registerLanguage('ruby', rubyLang)
hljs.registerLanguage('rust', rustLang)
hljs.registerLanguage('sql', sqlLang)
hljs.registerLanguage('typescript', typescriptLang)
hljs.registerLanguage('xml', xmlLang)
hljs.registerLanguage('yaml', yamlLang)

function handleClose() {
  emit('update:show', false)
}

function handleUpdateShow(value: boolean) {
  emit('update:show', value)
}
</script>
