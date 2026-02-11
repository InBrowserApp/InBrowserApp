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
            <n-text depth="3">{{ formatBytes(archiveFile.size) }}</n-text>
          </n-flex>
          <n-button @click="clearFile">{{ labels.clearFile }}</n-button>
        </n-flex>

        <n-grid v-if="archiveHandle && !isParsing" cols="1 700:3" :x-gap="12" :y-gap="8">
          <n-grid-item>
            <n-text depth="3">{{ labels.archiveFormat }}</n-text>
            <n-text strong>{{ archiveHandle.format.toUpperCase() }}</n-text>
          </n-grid-item>
          <n-grid-item>
            <n-text depth="3">{{ labels.entryCount }}</n-text>
            <n-text strong>{{ entries.length }}</n-text>
          </n-grid-item>
          <n-grid-item>
            <n-text depth="3">{{ labels.totalUncompressed }}</n-text>
            <n-text strong>{{ formatBytes(totalUncompressedSize) }}</n-text>
          </n-grid-item>
        </n-grid>
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
  <template v-else></template>

  <ToolSection v-if="archiveHandle && !isParsing && !errorMessage">
    <ToolSectionHeader>{{ labels.entriesTitle }}</ToolSectionHeader>
    <n-flex vertical :size="12">
      <n-flex justify="space-between" align="center" :size="10">
        <n-button :disabled="!canGoToParentDirectory" size="small" @click="goToParentDirectory">
          <template #icon>
            <n-icon :component="ArrowUp16Regular" />
          </template>
          {{ labels.goToParent }}
        </n-button>

        <n-breadcrumb>
          <n-breadcrumb-item
            v-for="breadcrumb in breadcrumbs"
            :key="breadcrumb.path || 'root'"
            @click="goToDirectory(breadcrumb.path)"
          >
            {{ breadcrumb.label }}
          </n-breadcrumb-item>
        </n-breadcrumb>
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
  <template v-else></template>

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
            <template v-else></template>
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

          <n-input
            v-else-if="previewKind === 'text'"
            type="textarea"
            :value="previewText"
            readonly
            :autosize="{ minRows: 8, maxRows: 18 }"
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
  <template v-else></template>
</template>

<script setup lang="ts">
import {
  NAlert,
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NCard,
  NDataTable,
  NEmpty,
  NFlex,
  NGrid,
  NGridItem,
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
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useArchiveViewer } from './use-archive-viewer'

const {
  acceptedFormats,
  archiveFile,
  archiveHandle,
  breadcrumbs,
  canGoToParentDirectory,
  closePreviewModal,
  columns,
  clearFile,
  downloadName,
  entries,
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
  previewText,
  rows,
  search,
  selectedBlobUrl,
  selectedEntry,
  tableRowProps,
  totalUncompressedSize,
} = useArchiveViewer()
</script>
