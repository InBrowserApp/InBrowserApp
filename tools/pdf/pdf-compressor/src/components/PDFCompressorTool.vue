<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <PDFUpload @upload-file="handleUpload" />
      <n-text depth="3">{{ t('localNote') }}</n-text>

      <n-alert
        v-if="file"
        data-test="selected-file"
        type="info"
        :title="t('selectedFile', { filename: file.name })"
      >
        <template v-if="isLoadingDocument">
          {{ t('inspecting') }}
        </template>
        <template v-else>
          {{ t('selectedMeta', { pages: pageCount ?? '--', size: formattedOriginalSize }) }}
        </template>
      </n-alert>
    </n-flex>
  </ToolSection>

  <ToolConfigHeader />
  <ToolSection>
    <n-flex vertical :size="16">
      <n-flex vertical :size="8">
        <n-text strong>{{ t('configTitle') }}</n-text>
        <n-radio-group v-model:value="preset" data-test="preset-group">
          <n-radio-button value="safe">{{ t('presetSafe') }}</n-radio-button>
          <n-radio-button value="balanced">{{ t('presetBalanced') }}</n-radio-button>
          <n-radio-button value="max-lossless">{{ t('presetMaxLossless') }}</n-radio-button>
        </n-radio-group>
        <n-text depth="3" data-test="preset-hint">{{ presetHint }}</n-text>
      </n-flex>

      <n-button
        tertiary
        data-test="advanced-toggle"
        @click="showAdvancedOptions = !showAdvancedOptions"
      >
        {{ showAdvancedOptions ? t('advancedToggleHide') : t('advancedToggleShow') }}
      </n-button>

      <n-collapse-transition :show="showAdvancedOptions">
        <n-form data-test="advanced-options" label-placement="top">
          <n-form-item :label="t('compressStreamsLabel')">
            <n-switch v-model:value="options.compressStreams" />
          </n-form-item>
          <n-form-item :label="t('recompressFlateLabel')">
            <n-switch v-model:value="options.recompressFlate" />
          </n-form-item>
          <n-form-item :label="t('objectStreamsLabel')">
            <n-radio-group v-model:value="options.objectStreams">
              <n-radio-button value="preserve">{{ t('objectStreamsPreserve') }}</n-radio-button>
              <n-radio-button value="generate">{{ t('objectStreamsGenerate') }}</n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item :label="t('compressionLevelLabel')">
            <n-flex vertical :size="8">
              <n-slider v-model:value="options.compressionLevel" :min="1" :max="9" :step="1" />
              <n-text depth="3">{{ t('compressionLevelHint') }}</n-text>
            </n-flex>
          </n-form-item>
          <n-form-item :label="t('linearizeLabel')">
            <n-flex vertical :size="8">
              <n-switch v-model:value="options.linearize" />
              <n-text depth="3">{{ t('linearizeHint') }}</n-text>
            </n-flex>
          </n-form-item>
        </n-form>
      </n-collapse-transition>

      <n-button
        type="primary"
        data-test="compress-action"
        :disabled="!canCompress"
        @click="compress"
      >
        {{ isCompressing ? t('compressingAction') : t('compressAction') }}
      </n-button>
    </n-flex>
  </ToolSection>

  <ToolSection v-if="errorMessage">
    <n-alert data-test="error-alert" type="error" :title="t('errorTitle')">
      {{ errorMessage }}
    </n-alert>
  </ToolSection>

  <ToolSection v-if="file && resultBlob && hasResult">
    <ToolSectionHeader>{{ t('resultTitle') }}</ToolSectionHeader>
    <n-flex vertical :size="16">
      <n-alert data-test="result-summary" :type="resultAlertType">
        {{ resultSummary }}
      </n-alert>

      <n-grid cols="1 700:4" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <n-statistic :label="t('originalSize')" :value="formattedOriginalSize" />
        </n-grid-item>
        <n-grid-item>
          <n-statistic :label="t('compressedSize')" :value="formattedCompressedSize" />
        </n-grid-item>
        <n-grid-item>
          <n-statistic :label="t('reduction')" :value="reductionPercent">
            <template #suffix>%</template>
          </n-statistic>
        </n-grid-item>
        <n-grid-item>
          <n-statistic :label="t('pageCountLabel')" :value="pageCount ?? '--'" />
        </n-grid-item>
      </n-grid>

      <n-tag v-if="options.linearize" data-test="linearized-badge" type="success" round>
        {{ t('linearizedBadge') }}
      </n-tag>

      <n-button
        tag="a"
        type="primary"
        data-test="download-link"
        :href="resultUrl ?? undefined"
        :download="resultFilename"
      >
        {{ t('downloadAction') }}
      </n-button>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('explainTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="8">
      <n-text>{{ t('explainParagraphOne') }}</n-text>
      <n-text depth="3">{{ t('explainParagraphTwo') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NCollapseTransition,
  NFlex,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NRadioButton,
  NRadioGroup,
  NSlider,
  NStatistic,
  NSwitch,
  NTag,
  NText,
} from 'naive-ui'
import { filesize } from 'filesize'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolConfigHeader, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { PDF_ERROR } from '../pdf-errors'
import { messages } from './locale/pdf-compressor-messages'
import { usePdfCompressor } from './usePdfCompressor'

const { t } = useI18n({ messages })
const showAdvancedOptions = ref(false)

const {
  file,
  pageCount,
  preset,
  options,
  isLoadingDocument,
  isCompressing,
  fileErrorCode,
  compressionErrorCode,
  resultBlob,
  resultUrl,
  resultFilename,
  canCompress,
  hasResult,
  handleUpload,
  compress,
} = usePdfCompressor()

const formattedOriginalSize = computed(() => filesize(file.value?.size ?? 0))
const formattedCompressedSize = computed(() => filesize(resultBlob.value?.size ?? 0))

const savedBytes = computed(() => {
  if (!file.value || !resultBlob.value) {
    return 0
  }

  return file.value.size - resultBlob.value.size
})

const reductionPercent = computed(() => {
  if (!file.value || !resultBlob.value || file.value.size === 0) {
    return 0
  }

  return Math.round((savedBytes.value / file.value.size) * 100)
})

const presetHint = computed(() => {
  if (preset.value === 'safe') {
    return t('presetSafeHint')
  }

  if (preset.value === 'max-lossless') {
    return t('presetMaxLosslessHint')
  }

  return t('presetBalancedHint')
})

const errorMessage = computed(() => {
  if (fileErrorCode.value === PDF_ERROR.Encrypted) {
    return t('errorEncrypted')
  }

  if (fileErrorCode.value === PDF_ERROR.Invalid) {
    return t('errorInvalid')
  }

  if (compressionErrorCode.value === PDF_ERROR.WorkerUnsupported) {
    return t('errorWorkerUnsupported')
  }

  if (compressionErrorCode.value === PDF_ERROR.CompressionFailed) {
    return t('errorCompressionFailed')
  }

  return ''
})

const resultAlertType = computed(() => {
  if (savedBytes.value > 0) {
    return 'success'
  }

  if (savedBytes.value < 0) {
    return 'warning'
  }

  return 'info'
})

const resultSummary = computed(() => {
  if (savedBytes.value > 0) {
    return t('resultSmaller', { size: filesize(savedBytes.value) })
  }

  if (savedBytes.value < 0) {
    return t('resultLarger', { size: filesize(Math.abs(savedBytes.value)) })
  }

  return t('resultSame')
})
</script>
