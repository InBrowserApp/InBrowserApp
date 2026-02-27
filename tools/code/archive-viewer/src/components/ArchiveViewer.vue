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
            <n-flex align="center" :size="8">
              <n-icon :component="FolderZip16Regular" />
              <n-text strong>{{ archiveFile.name }}</n-text>
            </n-flex>
            <n-text depth="3">{{ archiveSizeSummary }}</n-text>
          </n-flex>

          <n-button text @click="chooseAnotherArchive">
            <template #icon>
              <n-icon :component="ArrowUpload16Regular" />
            </template>
            {{ labels.selectNewFile }}
          </n-button>
        </n-flex>
      </template>

      <n-text v-if="!archiveFile" depth="3">{{ labels.localNote }}</n-text>
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
      <n-flex justify="space-between" align="center" :size="10">
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

        <n-button
          text
          :loading="isExportingAll"
          :disabled="!canExportAllEntries"
          @click="exportAllEntries"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ exportActionLabel }}
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

  <ArchivePreviewModal
    v-model:show="isPreviewModalVisible"
    :selected-entry="selectedEntry"
    :selected-blob-url="selectedBlobUrl"
    :preview-kind="previewKind"
    :preview-text="previewText"
    :preview-language="previewLanguage"
    :is-loading-preview="isLoadingPreview"
    :download-name="downloadName"
    :labels="labels"
    :should-show-copy-preview="shouldShowCopyPreview"
    :format-bytes="formatBytes"
    @after-leave="closePreviewModal"
  />

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
  NDataTable,
  NEmpty,
  NFlex,
  NIcon,
  NInput,
  NSpin,
  NText,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import ArrowUp16Regular from '@vicons/fluent/ArrowUp16Regular'
import ArrowUpload16Regular from '@vicons/fluent/ArrowUpload16Regular'
import FolderZip16Regular from '@vicons/fluent/FolderZip16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArchivePreviewModal from './ArchivePreviewModal.vue'
import { useArchiveViewer } from './use-archive-viewer'

const {
  acceptedFormats,
  archiveFile,
  archiveHandle,
  archiveSizeSummary,
  breadcrumbs,
  canExportAllEntries,
  canGoToParentDirectory,
  chooseAnotherArchive,
  closePreviewModal,
  columns,
  downloadName,
  errorMessage,
  exportActionLabel,
  exportAllEntries,
  formatBytes,
  goToDirectory,
  goToParentDirectory,
  handleBeforeUpload,
  isExportingAll,
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
  shouldShowCopyPreview,
  tableRowProps,
} = useArchiveViewer()
</script>
