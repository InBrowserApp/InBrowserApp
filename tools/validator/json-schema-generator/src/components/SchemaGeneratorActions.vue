<template>
  <ToolSection>
    <n-flex align="center" justify="space-between" wrap>
      <n-flex align="center" wrap>
        <n-button text @click="emit('loadSample')">
          <template #icon>
            <n-icon :component="Wand16Regular" />
          </template>
          {{ t('actionsSample') }}
        </n-button>
      </n-flex>
      <n-flex align="center" wrap>
        <CopyToClipboardButton :content="schemaText" />
        <n-button
          tag="a"
          text
          :href="downloadUrl ?? undefined"
          download="schema.json"
          :disabled="!downloadUrl"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('actionsDownload') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NIcon } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Wand16Regular from '@vicons/fluent/Wand16Regular'

const { t } = useI18n()

defineProps<{
  schemaText: string
  downloadUrl?: string | null
}>()

const emit = defineEmits<{ (event: 'loadSample'): void }>()
</script>

<i18n lang="json">
{
  "en": {
    "actionsSample": "Use sample",
    "actionsDownload": "Download schema"
  },
  "zh": {
    "actionsSample": "使用示例",
    "actionsDownload": "下载 Schema"
  },
  "zh-CN": {
    "actionsSample": "使用示例",
    "actionsDownload": "下载 Schema"
  },
  "zh-TW": {
    "actionsSample": "使用範例",
    "actionsDownload": "下載 Schema"
  },
  "zh-HK": {
    "actionsSample": "使用範例",
    "actionsDownload": "下載 Schema"
  },
  "es": {
    "actionsSample": "Usar ejemplo",
    "actionsDownload": "Descargar esquema"
  },
  "fr": {
    "actionsSample": "Utiliser l'exemple",
    "actionsDownload": "Télécharger le schéma"
  },
  "de": {
    "actionsSample": "Beispiel verwenden",
    "actionsDownload": "Schema herunterladen"
  },
  "it": {
    "actionsSample": "Usa esempio",
    "actionsDownload": "Scarica schema"
  },
  "ja": {
    "actionsSample": "サンプルを使用",
    "actionsDownload": "スキーマをダウンロード"
  },
  "ko": {
    "actionsSample": "샘플 사용",
    "actionsDownload": "스키마 다운로드"
  },
  "ru": {
    "actionsSample": "Использовать пример",
    "actionsDownload": "Скачать схему"
  },
  "pt": {
    "actionsSample": "Usar exemplo",
    "actionsDownload": "Baixar esquema"
  },
  "ar": {
    "actionsSample": "استخدم مثالاً",
    "actionsDownload": "تنزيل المخطط"
  },
  "hi": {
    "actionsSample": "उदाहरण उपयोग करें",
    "actionsDownload": "स्कीमा डाउनलोड करें"
  },
  "tr": {
    "actionsSample": "Örnek kullan",
    "actionsDownload": "Şemayı indir"
  },
  "nl": {
    "actionsSample": "Voorbeeld gebruiken",
    "actionsDownload": "Schema downloaden"
  },
  "sv": {
    "actionsSample": "Använd exempel",
    "actionsDownload": "Ladda ner schema"
  },
  "pl": {
    "actionsSample": "Użyj przykładu",
    "actionsDownload": "Pobierz schemat"
  },
  "vi": {
    "actionsSample": "Dùng mẫu",
    "actionsDownload": "Tải schema"
  },
  "th": {
    "actionsSample": "ใช้ตัวอย่าง",
    "actionsDownload": "ดาวน์โหลดสคีมา"
  },
  "id": {
    "actionsSample": "Gunakan contoh",
    "actionsDownload": "Unduh skema"
  },
  "he": {
    "actionsSample": "השתמש בדוגמה",
    "actionsDownload": "הורד סכימה"
  },
  "ms": {
    "actionsSample": "Guna contoh",
    "actionsDownload": "Muat turun skema"
  },
  "no": {
    "actionsSample": "Bruk eksempel",
    "actionsDownload": "Last ned skjema"
  }
}
</i18n>
