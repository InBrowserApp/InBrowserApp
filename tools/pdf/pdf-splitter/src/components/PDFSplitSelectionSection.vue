<template>
  <section ref="headingAnchorRef" class="selection-heading-anchor">
    <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <n-flex vertical :size="6">
          <n-text strong>{{ labels.rangeLabel }}</n-text>
          <n-input
            :value="rangeInput"
            :placeholder="labels.rangePlaceholder"
            clearable
            @update:value="emit('update:range-input', $event)"
          />
        </n-flex>

        <n-flex :size="8" wrap>
          <n-button tertiary @click="emit('select-all')">{{ labels.selectAll }}</n-button>
          <n-button tertiary @click="emit('select-odd')">{{ labels.selectOdd }}</n-button>
          <n-button tertiary @click="emit('select-even')">{{ labels.selectEven }}</n-button>
          <n-button tertiary @click="emit('clear-selection')">{{ labels.clear }}</n-button>
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

        <n-button
          type="primary"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="emit('generate')"
        >
          {{ isGenerating ? labels.generating : labels.generate }}
        </n-button>

        <n-alert v-if="rangeErrorMessage" type="error" :title="rangeErrorMessage" />
        <n-alert v-if="generateErrorMessage" type="error" :title="generateErrorMessage" />

        <n-flex
          v-if="hasResult && downloadUrl"
          align="center"
          justify="space-between"
          :wrap="false"
        >
          <n-text>
            {{ labels.resultReady }} {{ resultFileCount }}
            {{ resultFileCount === 1 ? labels.file : labels.files }}.
          </n-text>
          <n-button tag="a" type="primary" :href="downloadUrl" :download="resultFilename">
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ labels.download }}
          </n-button>
        </n-flex>
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NAlert, NButton, NFlex, NIcon, NInput, NRadio, NRadioGroup, NSpace, NText } from 'naive-ui'
import type { SplitMultipleMode, SplitOutputMode } from '../split-pdf.worker'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

defineProps<{
  pageCount: number
  selectedCount: number
  rangeInput: string
  outputMode: SplitOutputMode
  multipleMode: SplitMultipleMode
  isGenerating: boolean
  canGenerate: boolean
  rangeErrorMessage: string
  generateErrorMessage: string
  hasResult: boolean
  downloadUrl: string | null
  resultFilename: string
  resultFileCount: number
}>()

const emit = defineEmits<{
  (event: 'update:range-input', value: string): void
  (event: 'update:output-mode', value: SplitOutputMode): void
  (event: 'update:multiple-mode', value: SplitMultipleMode): void
  (event: 'select-all'): void
  (event: 'select-odd'): void
  (event: 'select-even'): void
  (event: 'clear-selection'): void
  (event: 'generate'): void
}>()

const headingAnchorRef = ref<HTMLElement | null>(null)

const scrollToHeading = (): void => {
  const headingAnchor = headingAnchorRef.value
  if (!headingAnchor || typeof headingAnchor.scrollIntoView !== 'function') {
    return
  }

  headingAnchor.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

defineExpose({
  scrollToHeading,
})

const labels = {
  title: 'Select Pages',
  rangeLabel: 'Page ranges',
  rangePlaceholder: 'Examples: 1-3,5,8-10',
  selectAll: 'All',
  selectOdd: 'Odd',
  selectEven: 'Even',
  clear: 'Clear',
  outputMode: 'Output mode',
  modeSingle: 'Extract to one PDF',
  modeMultiple: 'Split to multiple PDFs',
  splitStrategy: 'Split strategy',
  strategyRanges: 'Split by range segments',
  strategyPages: 'Split by single page',
  selectedPrefix: 'Selected',
  selectedSuffix: 'pages.',
  generating: 'Generating...',
  generate: 'Generate Result',
  resultReady: 'Result ready:',
  file: 'file',
  files: 'files',
  download: 'Download',
}
</script>

<style scoped>
.selection-heading-anchor {
  scroll-margin-top: calc(var(--navbar-height) + 12px);
}
</style>
