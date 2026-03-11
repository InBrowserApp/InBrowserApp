<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

    <n-space>
      <n-button
        v-for="option in options"
        :key="option.id"
        :type="option.id === presetId ? 'primary' : 'default'"
        secondary
        @click="presetId = option.id"
      >
        {{ option.label }}
      </n-button>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { CropPresetID } from '../types'

defineProps<{
  options: Array<{ id: CropPresetID; label: string }>
}>()

const presetId = defineModel<CropPresetID>('presetId', { required: true })
const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": { "title": "Aspect ratio" },
  "zh": { "title": "裁剪比例" },
  "zh-CN": { "title": "裁剪比例" },
  "zh-TW": { "title": "裁切比例" },
  "zh-HK": { "title": "裁切比例" },
  "es": { "title": "Aspect ratio" },
  "fr": { "title": "Aspect ratio" },
  "de": { "title": "Aspect ratio" },
  "it": { "title": "Aspect ratio" },
  "ja": { "title": "Aspect ratio" },
  "ko": { "title": "Aspect ratio" },
  "ru": { "title": "Aspect ratio" },
  "pt": { "title": "Aspect ratio" },
  "ar": { "title": "Aspect ratio" },
  "hi": { "title": "Aspect ratio" },
  "tr": { "title": "Aspect ratio" },
  "nl": { "title": "Aspect ratio" },
  "sv": { "title": "Aspect ratio" },
  "pl": { "title": "Aspect ratio" },
  "vi": { "title": "Aspect ratio" },
  "th": { "title": "Aspect ratio" },
  "id": { "title": "Aspect ratio" },
  "he": { "title": "Aspect ratio" },
  "ms": { "title": "Aspect ratio" },
  "no": { "title": "Aspect ratio" }
}
</i18n>
