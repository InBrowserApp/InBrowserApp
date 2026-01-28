<template>
  <ToolSection>
    <n-button type="primary" :loading="generating" @click="emit('generate')">
      <template #icon>
        <n-icon :component="Key24Regular" />
      </template>
      {{ t('generateCsr') }}
    </n-button>
  </ToolSection>

  <n-alert v-show="errorMessage" type="error" :title="t('errorTitle')">
    {{ errorMessage }}
  </n-alert>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NIcon } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import Key24Regular from '@vicons/fluent/Key24Regular'

defineProps<{
  generating: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  (event: 'generate'): void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "generateCsr": "Generate CSR",
    "errorTitle": "Error"
  },
  "zh": {
    "generateCsr": "生成 CSR",
    "errorTitle": "错误"
  },
  "zh-CN": {
    "generateCsr": "生成 CSR",
    "errorTitle": "错误"
  },
  "zh-TW": {
    "generateCsr": "產生 CSR",
    "errorTitle": "錯誤"
  },
  "zh-HK": {
    "generateCsr": "產生 CSR",
    "errorTitle": "錯誤"
  },
  "es": {
    "generateCsr": "Generar CSR",
    "errorTitle": "Error"
  },
  "fr": {
    "generateCsr": "Générer un CSR",
    "errorTitle": "Erreur"
  },
  "de": {
    "generateCsr": "CSR erzeugen",
    "errorTitle": "Fehler"
  },
  "it": {
    "generateCsr": "Genera CSR",
    "errorTitle": "Errore"
  },
  "ja": {
    "generateCsr": "CSR を生成",
    "errorTitle": "エラー"
  },
  "ko": {
    "generateCsr": "CSR 생성",
    "errorTitle": "오류"
  },
  "ru": {
    "generateCsr": "Сгенерировать CSR",
    "errorTitle": "Ошибка"
  },
  "pt": {
    "generateCsr": "Gerar CSR",
    "errorTitle": "Erro"
  },
  "ar": {
    "generateCsr": "إنشاء CSR",
    "errorTitle": "خطأ"
  },
  "hi": {
    "generateCsr": "CSR बनाएँ",
    "errorTitle": "त्रुटि"
  },
  "tr": {
    "generateCsr": "CSR oluştur",
    "errorTitle": "Hata"
  },
  "nl": {
    "generateCsr": "CSR genereren",
    "errorTitle": "Fout"
  },
  "sv": {
    "generateCsr": "Generera CSR",
    "errorTitle": "Fel"
  },
  "pl": {
    "generateCsr": "Generuj CSR",
    "errorTitle": "Błąd"
  },
  "vi": {
    "generateCsr": "Tạo CSR",
    "errorTitle": "Lỗi"
  },
  "th": {
    "generateCsr": "สร้าง CSR",
    "errorTitle": "ข้อผิดพลาด"
  },
  "id": {
    "generateCsr": "Buat CSR",
    "errorTitle": "Kesalahan"
  },
  "he": {
    "generateCsr": "צור CSR",
    "errorTitle": "שגיאה"
  },
  "ms": {
    "generateCsr": "Jana CSR",
    "errorTitle": "Ralat"
  },
  "no": {
    "generateCsr": "Generer CSR",
    "errorTitle": "Feil"
  }
}
</i18n>
