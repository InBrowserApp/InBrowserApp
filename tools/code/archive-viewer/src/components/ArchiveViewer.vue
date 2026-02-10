<template>
  <ToolSectionHeader>{{ labels.uploadTitle }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <template v-if="!archiveFile">
        <n-upload
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
    <ToolSectionHeader>{{ labels.summaryTitle }}</ToolSectionHeader>
    <n-grid cols="1 700:3" :x-gap="12" :y-gap="12">
      <n-grid-item>
        <n-statistic :label="labels.archiveFormat">{{
          archiveHandle.format.toUpperCase()
        }}</n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="labels.entryCount">{{ entries.length }}</n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="labels.totalUncompressed">{{
          formatBytes(totalUncompressedSize)
        }}</n-statistic>
      </n-grid-item>
    </n-grid>
  </ToolSection>
  <template v-else></template>

  <ToolSection v-if="archiveHandle && !isParsing && !errorMessage">
    <ToolSectionHeader>{{ labels.entriesTitle }}</ToolSectionHeader>
    <n-flex vertical :size="12">
      <n-input v-model:value="search" clearable :placeholder="labels.searchPlaceholder" />
      <n-data-table
        :columns="columns"
        :data="rows"
        :row-props="tableRowProps"
        :bordered="false"
        size="small"
      />
    </n-flex>
  </ToolSection>
  <template v-else></template>

  <ToolSection v-if="archiveHandle && !isParsing && !errorMessage">
    <ToolSectionHeader>{{ labels.previewTitle }}</ToolSectionHeader>
    <template v-if="!selectedEntry">
      <n-text depth="3">{{ labels.noSelection }}</n-text>
    </template>

    <template v-else>
      <n-flex vertical :size="10">
        <n-text strong>{{ selectedEntry.path }}</n-text>
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

        <n-flex v-if="isLoadingPreview" align="center" :size="8">
          <n-spin size="small" />
          <n-text>{{ labels.loadingPreview }}</n-text>
        </n-flex>

        <n-image
          v-else-if="previewKind === 'image' && selectedBlobUrl"
          style="max-width: 100%; max-height: 360px"
          object-fit="contain"
          :src="selectedBlobUrl"
          :alt="selectedEntry.path"
        />

        <n-input
          v-else-if="previewKind === 'text'"
          type="textarea"
          :value="previewText"
          readonly
          :autosize="{ minRows: 6, maxRows: 16 }"
        />

        <n-alert v-else type="info">{{ previewText || labels.noPreview }}</n-alert>
      </n-flex>
    </template>
  </ToolSection>
  <template v-else></template>

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
  NButton,
  NDataTable,
  NFlex,
  NGrid,
  NGridItem,
  NImage,
  NInput,
  NSpin,
  NStatistic,
  NText,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useArchiveViewer } from './use-archive-viewer'

const {
  archiveFile,
  archiveHandle,
  columns,
  clearFile,
  downloadName,
  entries,
  errorMessage,
  formatBytes,
  handleBeforeUpload,
  isLoadingPreview,
  isParsing,
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
