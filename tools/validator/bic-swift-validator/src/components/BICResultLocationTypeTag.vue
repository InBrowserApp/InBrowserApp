<template>
  <NTag :type="locationTypeTag" size="small">{{ locationTypeLabel }}</NTag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

const props = defineProps<{
  locationCode?: string | null
  isTestBic: boolean
  isPassiveParticipant: boolean
}>()

const locationTypeLabel = computed(() => {
  if (!props.locationCode) return t('unknown')
  if (props.isTestBic) return t('test')
  if (props.isPassiveParticipant) return t('passive')
  return t('standard')
})

const locationTypeTag = computed<TagType>(() => {
  if (!props.locationCode) return 'default'
  if (props.isTestBic) return 'warning'
  if (props.isPassiveParticipant) return 'info'
  return 'success'
})
</script>

<i18n lang="json">
{
  "en": {
    "standard": "Standard",
    "test": "Test",
    "passive": "Passive",
    "unknown": "Unknown"
  },
  "zh": {
    "standard": "标准",
    "test": "测试",
    "passive": "被动",
    "unknown": "未知"
  },
  "zh-CN": {
    "standard": "标准",
    "test": "测试",
    "passive": "被动",
    "unknown": "未知"
  },
  "zh-TW": {
    "standard": "標準",
    "test": "測試",
    "passive": "被動",
    "unknown": "未知"
  },
  "zh-HK": {
    "standard": "標準",
    "test": "測試",
    "passive": "被動",
    "unknown": "未知"
  },
  "es": {
    "standard": "Estándar",
    "test": "Prueba",
    "passive": "Pasivo",
    "unknown": "Desconocido"
  },
  "fr": {
    "standard": "Standard",
    "test": "Test",
    "passive": "Passif",
    "unknown": "Inconnu"
  },
  "de": {
    "standard": "Standard",
    "test": "Test",
    "passive": "Passiv",
    "unknown": "Unbekannt"
  },
  "it": {
    "standard": "Standard",
    "test": "Test",
    "passive": "Passivo",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "standard": "標準",
    "test": "テスト",
    "passive": "受動",
    "unknown": "不明"
  },
  "ko": {
    "standard": "표준",
    "test": "테스트",
    "passive": "수동",
    "unknown": "알 수 없음"
  },
  "ru": {
    "standard": "Стандарт",
    "test": "Тестовый",
    "passive": "Пассивный",
    "unknown": "Неизвестно"
  },
  "pt": {
    "standard": "Padrão",
    "test": "Teste",
    "passive": "Passivo",
    "unknown": "Desconhecido"
  },
  "ar": {
    "standard": "قياسي",
    "test": "اختبار",
    "passive": "سلبي",
    "unknown": "غير معروف"
  },
  "hi": {
    "standard": "मानक",
    "test": "परीक्षण",
    "passive": "निष्क्रिय",
    "unknown": "अज्ञात"
  },
  "tr": {
    "standard": "Standart",
    "test": "Test",
    "passive": "Pasif",
    "unknown": "Bilinmeyen"
  },
  "nl": {
    "standard": "Standaard",
    "test": "Test",
    "passive": "Passief",
    "unknown": "Onbekend"
  },
  "sv": {
    "standard": "Standard",
    "test": "Test",
    "passive": "Passiv",
    "unknown": "Okänd"
  },
  "pl": {
    "standard": "Standard",
    "test": "Test",
    "passive": "Pasywny",
    "unknown": "Nieznany"
  },
  "vi": {
    "standard": "Tiêu chuẩn",
    "test": "Kiểm tra",
    "passive": "Thụ động",
    "unknown": "Không rõ"
  },
  "th": {
    "standard": "มาตรฐาน",
    "test": "ทดสอบ",
    "passive": "พาสซีฟ",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "standard": "Standar",
    "test": "Uji",
    "passive": "Pasif",
    "unknown": "Tidak diketahui"
  },
  "he": {
    "standard": "סטנדרטי",
    "test": "בדיקה",
    "passive": "פסיבי",
    "unknown": "לא ידוע"
  },
  "ms": {
    "standard": "Standard",
    "test": "Ujian",
    "passive": "Pasif",
    "unknown": "Tidak diketahui"
  },
  "no": {
    "standard": "Standard",
    "test": "Test",
    "passive": "Passiv",
    "unknown": "Ukjent"
  }
}
</i18n>
