<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-flex :wrap="true" :size="8">
        <n-button
          v-for="preset in presetButtons"
          :key="preset.id"
          secondary
          size="small"
          @click="$emit('apply-preset', preset.id)"
        >
          {{ preset.label }}
        </n-button>
      </n-flex>

      <n-flex :wrap="true" :size="16">
        <n-form-item :label="t('delivery')" :show-feedback="false">
          <n-select
            :value="delivery"
            :options="deliveryOptions"
            style="width: 180px"
            @update:value="$emit('update:delivery', $event)"
          />
        </n-form-item>

        <n-form-item :label="t('mode')" :show-feedback="false">
          <n-select
            :value="mode"
            :options="modeOptions"
            style="width: 220px"
            @update:value="$emit('update:mode', $event)"
          />
        </n-form-item>
      </n-flex>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NFormItem, NSelect, NSpace } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { CSPDelivery, CSPMode, CSPPresetID } from '@utils/csp'

defineProps<{
  delivery: CSPDelivery
  mode: CSPMode
}>()

defineEmits<{
  (e: 'update:delivery', value: CSPDelivery): void
  (e: 'update:mode', value: CSPMode): void
  (e: 'apply-preset', value: CSPPresetID): void
}>()

const { t } = useI18n()

const deliveryOptions = computed(() => [
  { label: t('http-header'), value: 'header' },
  { label: t('meta-tag'), value: 'meta' },
])

const modeOptions = computed(() => [
  { label: t('enforce'), value: 'enforce' },
  { label: t('report-only'), value: 'report-only' },
])

const presetButtons = computed<{ id: CSPPresetID; label: string }[]>(() => [
  { id: 'strict-starter', label: t('strict-starter') },
  { id: 'spa-starter', label: t('spa-starter') },
  { id: 'legacy-relaxed', label: t('legacy-relaxed') },
  { id: 'report-only-audit', label: t('report-only-audit') },
])
</script>

<i18n lang="json">
{
  "en": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "zh": {
    "title": "预设与上下文",
    "delivery": "交付方式",
    "mode": "模式",
    "http-header": "HTTP 标头",
    "meta-tag": "Meta 标签",
    "enforce": "强制执行",
    "report-only": "仅报告",
    "strict-starter": "严格起步版",
    "spa-starter": "SPA 起步版",
    "legacy-relaxed": "宽松兼容版",
    "report-only-audit": "仅报告审计版"
  },
  "zh-CN": {
    "title": "预设与上下文",
    "delivery": "交付方式",
    "mode": "模式",
    "http-header": "HTTP 标头",
    "meta-tag": "Meta 标签",
    "enforce": "强制执行",
    "report-only": "仅报告",
    "strict-starter": "严格起步版",
    "spa-starter": "SPA 起步版",
    "legacy-relaxed": "宽松兼容版",
    "report-only-audit": "仅报告审计版"
  },
  "zh-TW": {
    "title": "預設與內容",
    "delivery": "交付方式",
    "mode": "模式",
    "http-header": "HTTP 標頭",
    "meta-tag": "Meta 標籤",
    "enforce": "強制執行",
    "report-only": "僅報告",
    "strict-starter": "嚴格起步版",
    "spa-starter": "SPA 起步版",
    "legacy-relaxed": "寬鬆相容版",
    "report-only-audit": "僅報告稽核版"
  },
  "zh-HK": {
    "title": "預設與內容",
    "delivery": "交付方式",
    "mode": "模式",
    "http-header": "HTTP 標頭",
    "meta-tag": "Meta 標籤",
    "enforce": "強制執行",
    "report-only": "僅報告",
    "strict-starter": "嚴格起步版",
    "spa-starter": "SPA 起步版",
    "legacy-relaxed": "寬鬆相容版",
    "report-only-audit": "僅報告稽核版"
  },
  "es": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "fr": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "de": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "it": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "ja": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "ko": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "ru": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "pt": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "ar": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "hi": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "tr": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "nl": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "sv": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "pl": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "vi": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "th": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "id": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "he": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "ms": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  },
  "no": {
    "title": "Presets & Context",
    "delivery": "Delivery",
    "mode": "Mode",
    "http-header": "HTTP Header",
    "meta-tag": "Meta Tag",
    "enforce": "Enforce",
    "report-only": "Report-Only",
    "strict-starter": "Strict Starter",
    "spa-starter": "SPA Starter",
    "legacy-relaxed": "Legacy Relaxed",
    "report-only-audit": "Report-Only Audit"
  }
}
</i18n>
