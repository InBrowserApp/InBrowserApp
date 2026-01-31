<template>
  <NTag :type="checksumStatus.type" size="small">
    {{ checksumStatus.label }}
  </NTag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isCountrySupported: boolean
  isFormatValid: boolean
  isChecksumSupported: boolean
  isChecksumValid: boolean | null
}>()

const { t } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

type TagStatus = {
  label: string
  type: TagType
}

const checksumStatus = computed<TagStatus>(() => {
  if (!props.isCountrySupported || !props.isFormatValid) {
    return { label: t('notAvailable'), type: 'default' }
  }
  if (!props.isChecksumSupported) {
    return { label: t('notSupported'), type: 'info' }
  }
  return props.isChecksumValid
    ? { label: t('pass'), type: 'success' }
    : { label: t('fail'), type: 'error' }
})
</script>

<i18n lang="json">
{
  "en": {
    "pass": "Pass",
    "fail": "Fail",
    "notSupported": "Not supported",
    "notAvailable": "Not available"
  },
  "zh": {
    "pass": "通过",
    "fail": "失败",
    "notSupported": "不支持",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "pass": "通过",
    "fail": "失败",
    "notSupported": "不支持",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "pass": "通過",
    "fail": "失敗",
    "notSupported": "不支援",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "pass": "通過",
    "fail": "失敗",
    "notSupported": "不支援",
    "notAvailable": "不可用"
  },
  "es": {
    "pass": "Aprobado",
    "fail": "Fallido",
    "notSupported": "No compatible",
    "notAvailable": "No disponible"
  },
  "fr": {
    "pass": "Réussi",
    "fail": "Échec",
    "notSupported": "Non pris en charge",
    "notAvailable": "Non disponible"
  },
  "de": {
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "notSupported": "Nicht unterstützt",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "pass": "Superato",
    "fail": "Fallito",
    "notSupported": "Non supportato",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "pass": "合格",
    "fail": "不合格",
    "notSupported": "未対応",
    "notAvailable": "利用不可"
  },
  "ko": {
    "pass": "통과",
    "fail": "실패",
    "notSupported": "지원되지 않음",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "pass": "Пройдено",
    "fail": "Ошибка",
    "notSupported": "Не поддерживается",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "pass": "Aprovado",
    "fail": "Reprovado",
    "notSupported": "Não suportado",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "pass": "نجاح",
    "fail": "فشل",
    "notSupported": "غير مدعوم",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "pass": "पास",
    "fail": "फेल",
    "notSupported": "समर्थित नहीं",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "pass": "Geçti",
    "fail": "Kaldı",
    "notSupported": "Desteklenmiyor",
    "notAvailable": "Kullanılamıyor"
  },
  "nl": {
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "notSupported": "Niet ondersteund",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "pass": "Godkänd",
    "fail": "Underkänd",
    "notSupported": "Stöds inte",
    "notAvailable": "Inte tillgänglig"
  },
  "pl": {
    "pass": "Zaliczony",
    "fail": "Nieudany",
    "notSupported": "Nieobsługiwany",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "pass": "Đạt",
    "fail": "Không đạt",
    "notSupported": "Không được hỗ trợ",
    "notAvailable": "Không có sẵn"
  },
  "th": {
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "notSupported": "ไม่รองรับ",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "pass": "Lulus",
    "fail": "Gagal",
    "notSupported": "Tidak didukung",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "pass": "עבר",
    "fail": "נכשל",
    "notSupported": "לא נתמך",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "pass": "Lulus",
    "fail": "Gagal",
    "notSupported": "Tidak disokong",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "pass": "Bestått",
    "fail": "Ikke bestått",
    "notSupported": "Ikke støttet",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
