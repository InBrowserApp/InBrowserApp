<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('fingerprint') }}</ToolSectionHeader>
    <n-input :value="value" readonly :loading="loading" style="font-family: monospace" />
    <n-flex :size="8" style="margin-top: 8px">
      <CopyToClipboardButton :text="value" />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NInput, NFlex } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  value: string
  loading?: boolean
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": { "fingerprint": "Fingerprint" },
  "zh": { "fingerprint": "指纹" },
  "zh-CN": { "fingerprint": "指纹" },
  "zh-TW": { "fingerprint": "指紋" },
  "zh-HK": { "fingerprint": "指紋" },
  "es": { "fingerprint": "Huella Digital" },
  "fr": { "fingerprint": "Empreinte" },
  "de": { "fingerprint": "Fingerabdruck" },
  "it": { "fingerprint": "Impronta Digitale" },
  "ja": { "fingerprint": "フィンガープリント" },
  "ko": { "fingerprint": "지문" },
  "ru": { "fingerprint": "Отпечаток" },
  "pt": { "fingerprint": "Impressão Digital" },
  "ar": { "fingerprint": "البصمة" },
  "hi": { "fingerprint": "फिंगरप्रिंट" },
  "tr": { "fingerprint": "Parmak İzi" },
  "nl": { "fingerprint": "Vingerafdruk" },
  "sv": { "fingerprint": "Fingeravtryck" },
  "pl": { "fingerprint": "Odcisk Palca" },
  "vi": { "fingerprint": "Dấu Vân Tay" },
  "th": { "fingerprint": "ลายนิ้วมือ" },
  "id": { "fingerprint": "Sidik Jari" },
  "he": { "fingerprint": "טביעת אצבע" },
  "ms": { "fingerprint": "Cap Jari" },
  "no": { "fingerprint": "Fingeravtrykk" }
}
</i18n>
