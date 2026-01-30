<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('optionsTitle') }}</ToolSectionHeader>
    <n-flex align="center" :size="16" wrap>
      <n-flex align="center" :size="8">
        <n-switch
          :value="validateFormats"
          size="small"
          @update:value="$emit('update:validateFormats', $event)"
        />
        <span>{{ t('validateFormats') }}</span>
      </n-flex>
      <n-flex align="center" :size="8">
        <n-switch
          :value="allErrors"
          size="small"
          @update:value="$emit('update:allErrors', $event)"
        />
        <span>{{ t('allErrors') }}</span>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NSwitch } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'

defineProps<{
  validateFormats: boolean
  allErrors: boolean
}>()

defineEmits<{
  'update:validateFormats': [value: boolean]
  'update:allErrors': [value: boolean]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "optionsTitle": "Validation Options",
    "validateFormats": "Validate formats (email, uri, uuid)",
    "allErrors": "Show all errors"
  },
  "zh": {
    "optionsTitle": "校验选项",
    "validateFormats": "校验格式 (email, uri, uuid)",
    "allErrors": "显示全部错误"
  },
  "zh-CN": {
    "optionsTitle": "校验选项",
    "validateFormats": "校验格式 (email, uri, uuid)",
    "allErrors": "显示全部错误"
  },
  "zh-TW": {
    "optionsTitle": "驗證選項",
    "validateFormats": "驗證格式 (email, uri, uuid)",
    "allErrors": "顯示所有錯誤"
  },
  "zh-HK": {
    "optionsTitle": "驗證選項",
    "validateFormats": "驗證格式 (email, uri, uuid)",
    "allErrors": "顯示所有錯誤"
  },
  "es": {
    "optionsTitle": "Opciones de validación",
    "validateFormats": "Validar formatos (email, uri, uuid)",
    "allErrors": "Mostrar todos los errores"
  },
  "fr": {
    "optionsTitle": "Options de validation",
    "validateFormats": "Valider les formats (email, uri, uuid)",
    "allErrors": "Afficher toutes les erreurs"
  },
  "de": {
    "optionsTitle": "Validierungsoptionen",
    "validateFormats": "Formate prüfen (email, uri, uuid)",
    "allErrors": "Alle Fehler anzeigen"
  },
  "it": {
    "optionsTitle": "Opzioni di validazione",
    "validateFormats": "Valida formati (email, uri, uuid)",
    "allErrors": "Mostra tutti gli errori"
  },
  "ja": {
    "optionsTitle": "検証オプション",
    "validateFormats": "形式を検証 (email, uri, uuid)",
    "allErrors": "すべてのエラーを表示"
  },
  "ko": {
    "optionsTitle": "검증 옵션",
    "validateFormats": "형식 검증 (email, uri, uuid)",
    "allErrors": "모든 오류 표시"
  },
  "ru": {
    "optionsTitle": "Параметры проверки",
    "validateFormats": "Проверять форматы (email, uri, uuid)",
    "allErrors": "Показывать все ошибки"
  },
  "pt": {
    "optionsTitle": "Opções de validação",
    "validateFormats": "Validar formatos (email, uri, uuid)",
    "allErrors": "Mostrar todos os erros"
  },
  "ar": {
    "optionsTitle": "خيارات التحقق",
    "validateFormats": "تحقق من التنسيقات (email, uri, uuid)",
    "allErrors": "عرض جميع الأخطاء"
  },
  "hi": {
    "optionsTitle": "सत्यापन विकल्प",
    "validateFormats": "फॉर्मेट सत्यापित करें (email, uri, uuid)",
    "allErrors": "सभी त्रुटियां दिखाएँ"
  },
  "tr": {
    "optionsTitle": "Doğrulama seçenekleri",
    "validateFormats": "Biçimleri doğrula (email, uri, uuid)",
    "allErrors": "Tüm hataları göster"
  },
  "nl": {
    "optionsTitle": "Validatieopties",
    "validateFormats": "Formaten valideren (email, uri, uuid)",
    "allErrors": "Alle fouten tonen"
  },
  "sv": {
    "optionsTitle": "Valideringsalternativ",
    "validateFormats": "Validera format (email, uri, uuid)",
    "allErrors": "Visa alla fel"
  },
  "pl": {
    "optionsTitle": "Opcje walidacji",
    "validateFormats": "Waliduj formaty (email, uri, uuid)",
    "allErrors": "Pokaż wszystkie błędy"
  },
  "vi": {
    "optionsTitle": "Tùy chọn xác thực",
    "validateFormats": "Xác thực định dạng (email, uri, uuid)",
    "allErrors": "Hiển thị tất cả lỗi"
  },
  "th": {
    "optionsTitle": "ตัวเลือกการตรวจสอบ",
    "validateFormats": "ตรวจสอบรูปแบบ (email, uri, uuid)",
    "allErrors": "แสดงข้อผิดพลาดทั้งหมด"
  },
  "id": {
    "optionsTitle": "Opsi validasi",
    "validateFormats": "Validasi format (email, uri, uuid)",
    "allErrors": "Tampilkan semua kesalahan"
  },
  "he": {
    "optionsTitle": "אפשרויות אימות",
    "validateFormats": "אמת פורמטים (email, uri, uuid)",
    "allErrors": "הצג את כל השגיאות"
  },
  "ms": {
    "optionsTitle": "Pilihan pengesahan",
    "validateFormats": "Sahkan format (email, uri, uuid)",
    "allErrors": "Papar semua ralat"
  },
  "no": {
    "optionsTitle": "Valideringsalternativer",
    "validateFormats": "Valider formater (email, uri, uuid)",
    "allErrors": "Vis alle feil"
  }
}
</i18n>
