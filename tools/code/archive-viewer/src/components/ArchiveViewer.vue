<template>
  <ToolSectionHeader>{{ labels.uploadTitle }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <template v-if="!archiveFile">
        <n-upload
          :accept="acceptedFormats"
          :default-upload="false"
          :show-file-list="false"
          @before-upload="handleBeforeUpload"
        >
          <n-upload-dragger>
            <n-flex vertical align="center" :size="8" style="padding: 12px 8px">
              <n-icon :component="FolderZip16Regular" size="40" :depth="3" />
              <n-text strong>{{ labels.uploadHint }}</n-text>
              <n-text depth="3">{{ labels.supportedFormats }}</n-text>
            </n-flex>
          </n-upload-dragger>
        </n-upload>
      </template>

      <template v-else>
        <n-flex justify="space-between" align="center" :size="12">
          <n-flex vertical :size="4">
            <n-text strong>{{ labels.selectedFile }}</n-text>
            <n-text>{{ archiveFile.name }}</n-text>
            <n-text depth="3">{{ archiveSizeSummary }}</n-text>
          </n-flex>
          <n-button @click="clearFile">
            <template #icon>
              <n-icon :component="ArrowUpload16Regular" />
            </template>
            {{ labels.selectNewFile }}
          </n-button>
        </n-flex>
      </template>

      <n-text depth="3">{{ labels.localNote }}</n-text>
    </n-flex>
  </ToolSection>

  <ToolSection v-if="isParsing">
    <n-flex align="center" :size="8">
      <n-spin size="small" />
      <n-text>{{ labels.parsingArchive }}</n-text>
    </n-flex>
  </ToolSection>

  <ToolSection v-if="archiveHandle && !isParsing && !errorMessage">
    <ToolSectionHeader>{{ labels.entriesTitle }}</ToolSectionHeader>
    <n-flex vertical :size="12">
      <n-flex align="center" :size="10">
        <n-breadcrumb>
          <n-breadcrumb-item
            v-for="breadcrumb in breadcrumbs"
            :key="breadcrumb.path || 'root'"
            @click="goToDirectory(breadcrumb.path)"
          >
            {{ breadcrumb.label }}
          </n-breadcrumb-item>
        </n-breadcrumb>

        <n-button
          v-if="canGoToParentDirectory"
          size="small"
          circle
          quaternary
          :aria-label="labels.goToParent"
          @click="goToParentDirectory"
        >
          <template #icon>
            <n-icon :component="ArrowUp16Regular" />
          </template>
        </n-button>
      </n-flex>

      <n-input v-model:value="search" clearable :placeholder="labels.searchPlaceholder" />

      <template v-if="rows.length">
        <n-data-table
          :columns="columns"
          :data="rows"
          :row-props="tableRowProps"
          :bordered="false"
          size="small"
        />
      </template>
      <template v-else>
        <n-empty :description="labels.emptyFolder" />
      </template>
    </n-flex>
  </ToolSection>

  <n-modal
    v-model:show="isPreviewModalVisible"
    :mask-closable="true"
    @after-leave="closePreviewModal"
  >
    <n-card
      closable
      role="dialog"
      style="width: min(860px, 92vw)"
      :title="selectedEntry?.path || labels.previewTitle"
      @close="closePreviewModal"
    >
      <template v-if="selectedEntry">
        <n-flex vertical :size="10">
          <n-flex justify="space-between" align="center" :size="10">
            <n-text depth="3">{{ formatBytes(selectedEntry.size) }}</n-text>

            <n-button
              v-if="selectedBlobUrl && selectedEntry.kind === 'file'"
              tag="a"
              type="primary"
              :href="selectedBlobUrl"
              :download="downloadName"
            >
              {{ labels.downloadEntry }}
            </n-button>
          </n-flex>

          <n-flex v-if="isLoadingPreview" align="center" :size="8">
            <n-spin size="small" />
            <n-text>{{ labels.loadingPreview }}</n-text>
          </n-flex>

          <n-image
            v-else-if="previewKind === 'image' && selectedBlobUrl"
            style="max-width: 100%; max-height: 60vh"
            object-fit="contain"
            :src="selectedBlobUrl"
            :alt="selectedEntry.path"
          />
          <n-code
            v-else-if="previewKind === 'text'"
            :code="previewText"
            :language="previewLanguage"
            :hljs="hljs"
            word-wrap
          />

          <n-alert v-else type="info">{{ previewText || labels.noPreview }}</n-alert>
        </n-flex>
      </template>
      <template v-else>
        <n-text depth="3">{{ labels.noSelection }}</n-text>
      </template>
    </n-card>
  </n-modal>

  <ToolSection v-if="errorMessage">
    <n-alert type="error" :title="labels.errorTitle">
      {{ errorMessage }}
    </n-alert>
  </ToolSection>
</template>

<script setup lang="ts">
import {
  NAlert,
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NCard,
  NCode,
  NDataTable,
  NEmpty,
  NFlex,
  NIcon,
  NImage,
  NInput,
  NModal,
  NSpin,
  NText,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import ArrowUp16Regular from '@vicons/fluent/ArrowUp16Regular'
import ArrowUpload16Regular from '@vicons/fluent/ArrowUpload16Regular'
import FolderZip16Regular from '@vicons/fluent/FolderZip16Regular'
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
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useArchiveViewer } from './use-archive-viewer'

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

const {
  acceptedFormats,
  archiveFile,
  archiveHandle,
  archiveSizeSummary,
  breadcrumbs,
  canGoToParentDirectory,
  closePreviewModal,
  columns,
  clearFile,
  downloadName,
  errorMessage,
  formatBytes,
  goToDirectory,
  goToParentDirectory,
  handleBeforeUpload,
  isLoadingPreview,
  isParsing,
  isPreviewModalVisible,
  labels,
  previewKind,
  previewLanguage,
  previewText,
  rows,
  search,
  selectedBlobUrl,
  selectedEntry,
  tableRowProps,
} = useArchiveViewer()
</script>
