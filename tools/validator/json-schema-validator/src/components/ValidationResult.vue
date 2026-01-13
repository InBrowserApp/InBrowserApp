<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>
    <n-spin :show="loading">
      <n-alert v-if="schemaError" type="error" :bordered="false">
        {{ schemaError }}
      </n-alert>
      <n-alert v-else-if="statusType === 'info'" type="info" :bordered="false">
        {{ emptyMessage }}
      </n-alert>

      <n-descriptions :column="1" bordered label-placement="left">
        <n-descriptions-item :label="statusLabel">
          <n-tag :type="statusTagType" size="small">{{ statusValue }}</n-tag>
        </n-descriptions-item>
        <n-descriptions-item :label="draftLabel">
          <n-flex align="center" :size="8">
            <n-text code>{{ draftValue }}</n-text>
            <n-tag v-if="draftHint" type="info" size="small">{{ draftHint }}</n-tag>
          </n-flex>
        </n-descriptions-item>
        <n-descriptions-item :label="errorsLabel">
          <n-flex align="center" :size="8">
            <n-text>{{ errorsCount }}</n-text>
            <CopyToClipboardButton v-if="errorsCount > 0" :content="errorsJson" />
          </n-flex>
        </n-descriptions-item>
      </n-descriptions>

      <div v-if="errors.length" class="errors-table">
        <n-text depth="3">{{ errorsTitle }}</n-text>
        <n-data-table :columns="columns" :data="errors" :bordered="false" size="small" />
      </div>

      <n-text v-else-if="statusType === 'success'" depth="3">{{ noErrorsLabel }}</n-text>
    </n-spin>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import {
  NAlert,
  NDescriptions,
  NDescriptionsItem,
  NDataTable,
  NFlex,
  NTag,
  NText,
  NSpin,
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { JsonSchemaValidationError } from '@utils/json-schema'

type TagType = 'default' | 'success' | 'warning' | 'error' | 'info'

type ColumnLabels = {
  path: string
  message: string
  keyword: string
}

const props = defineProps<{
  title: string
  statusLabel: string
  statusValue: string
  statusType: 'success' | 'error' | 'info' | 'warning'
  draftLabel: string
  draftValue: string
  draftHint: string
  errorsLabel: string
  errorsCount: number
  errorsTitle: string
  errors: JsonSchemaValidationError[]
  errorsJson: string
  columnsLabels: ColumnLabels
  noErrorsLabel: string
  schemaError: string
  emptyMessage: string
  loading: boolean
}>()

const statusTagType = computed<TagType>(() => {
  if (props.statusType === 'info') return 'info'
  if (props.statusType === 'warning') return 'warning'
  if (props.statusType === 'error') return 'error'
  return 'success'
})

const columns = computed<DataTableColumns<JsonSchemaValidationError>>(() => [
  {
    title: props.columnsLabels.path,
    key: 'instancePath',
    render(row) {
      return h(NText, { code: true }, () => row.instancePath || '/')
    },
  },
  {
    title: props.columnsLabels.message,
    key: 'message',
  },
  {
    title: props.columnsLabels.keyword,
    key: 'keyword',
  },
])
</script>

<style scoped>
.errors-table {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}
</style>
