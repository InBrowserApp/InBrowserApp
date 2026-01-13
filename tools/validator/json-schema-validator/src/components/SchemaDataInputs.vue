<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi
        :label="schemaLabel"
        :show-feedback="Boolean(schemaError)"
        :validation-status="schemaStatus"
      >
        <TextOrFileInput
          :value="schemaValue"
          :accept="accept"
          :placeholder="schemaPlaceholder"
          :status="schemaStatus"
          :wrap-with-form-item="false"
          @update:value="$emit('update:schemaValue', $event)"
        />
        <template v-if="schemaError" #feedback>
          <n-text type="error">{{ schemaError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi
        :label="dataLabel"
        :show-feedback="Boolean(dataError)"
        :validation-status="dataStatus"
      >
        <TextOrFileInput
          :value="dataValue"
          :accept="accept"
          :placeholder="dataPlaceholder"
          :status="dataStatus"
          :wrap-with-form-item="false"
          @update:value="$emit('update:dataValue', $event)"
        />
        <template v-if="dataError" #feedback>
          <n-text type="error">{{ dataError }}</n-text>
        </template>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFormItemGi, NGrid, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { TextOrFileInput } from '@shared/ui/base'

defineProps<{
  title: string
  schemaLabel: string
  dataLabel: string
  schemaPlaceholder: string
  dataPlaceholder: string
  schemaStatus?: 'success' | 'error'
  dataStatus?: 'success' | 'error'
  schemaError?: string
  dataError?: string
  schemaValue: string | File
  dataValue: string | File
}>()

defineEmits<{
  'update:schemaValue': [value: string | File]
  'update:dataValue': [value: string | File]
}>()

const accept = '.json,.txt'
</script>
