<template>
  <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex vertical :size="6">
        <n-text strong>{{ labels.rangeLabel }}</n-text>
        <n-flex :size="8" :wrap="false">
          <n-input
            :value="rangeInput"
            :placeholder="labels.rangePlaceholder"
            clearable
            @update:value="emit('update:range-input', $event)"
            @keydown.enter.prevent="emit('apply-range')"
          />
          <n-button type="primary" @click="emit('apply-range')">{{ labels.apply }}</n-button>
        </n-flex>
      </n-flex>

      <n-flex :size="8" wrap>
        <n-button tertiary @click="emit('select-all')">{{ labels.selectAll }}</n-button>
        <n-button tertiary @click="emit('select-odd')">{{ labels.selectOdd }}</n-button>
        <n-button tertiary @click="emit('select-even')">{{ labels.selectEven }}</n-button>
        <n-button tertiary @click="emit('clear-selection')">{{ labels.clear }}</n-button>
      </n-flex>

      <n-flex vertical :size="6">
        <n-text strong>{{ labels.outputName }}</n-text>
        <n-input :value="outputName" clearable @update:value="emit('update:output-name', $event)" />
      </n-flex>

      <n-flex vertical :size="6">
        <n-text strong>{{ labels.outputMode }}</n-text>
        <n-radio-group :value="outputMode" @update:value="emit('update:output-mode', $event)">
          <n-space vertical>
            <n-radio value="single">{{ labels.modeSingle }}</n-radio>
            <n-radio value="multiple">{{ labels.modeMultiple }}</n-radio>
          </n-space>
        </n-radio-group>
      </n-flex>

      <n-flex v-if="outputMode === 'multiple'" vertical :size="6">
        <n-text strong>{{ labels.splitStrategy }}</n-text>
        <n-radio-group :value="multipleMode" @update:value="emit('update:multiple-mode', $event)">
          <n-space vertical>
            <n-radio value="ranges">{{ labels.strategyRanges }}</n-radio>
            <n-radio value="pages">{{ labels.strategyPages }}</n-radio>
          </n-space>
        </n-radio-group>
      </n-flex>

      <n-alert type="info" :bordered="false">
        {{ labels.selectedPrefix }} {{ selectedCount }} / {{ pageCount }}
        {{ labels.selectedSuffix }}
      </n-alert>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NButton, NFlex, NInput, NRadio, NRadioGroup, NSpace, NText } from 'naive-ui'
import type { SplitMultipleMode, SplitOutputMode } from '../split-pdf.worker'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  pageCount: number
  selectedCount: number
  rangeInput: string
  outputName: string
  outputMode: SplitOutputMode
  multipleMode: SplitMultipleMode
}>()

const emit = defineEmits<{
  (event: 'update:range-input', value: string): void
  (event: 'update:output-name', value: string): void
  (event: 'update:output-mode', value: SplitOutputMode): void
  (event: 'update:multiple-mode', value: SplitMultipleMode): void
  (event: 'apply-range'): void
  (event: 'select-all'): void
  (event: 'select-odd'): void
  (event: 'select-even'): void
  (event: 'clear-selection'): void
}>()

const labels = {
  title: 'Select Pages',
  rangeLabel: 'Page ranges',
  rangePlaceholder: 'Examples: 1-3,5,8-10',
  apply: 'Apply',
  selectAll: 'All',
  selectOdd: 'Odd',
  selectEven: 'Even',
  clear: 'Clear',
  outputName: 'Output filename',
  outputMode: 'Output mode',
  modeSingle: 'Extract to one PDF',
  modeMultiple: 'Split to multiple PDFs',
  splitStrategy: 'Split strategy',
  strategyRanges: 'Split by range segments',
  strategyPages: 'Split by single page',
  selectedPrefix: 'Selected',
  selectedSuffix: 'pages.',
}
</script>
