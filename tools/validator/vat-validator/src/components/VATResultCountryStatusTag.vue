<template>
  <NTag :type="countryStatus.type" size="small">
    {{ countryStatus.label }}
  </NTag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { VATValidationResult } from '../data/vat'

const { t } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

type TagStatus = {
  label: string
  type: TagType
}

const props = defineProps<{
  validationResult: VATValidationResult
}>()

const countryStatus = computed<TagStatus>(() => {
  if (!props.validationResult.countryCode) {
    return { label: t('notAvailable'), type: 'default' }
  }
  if (!props.validationResult.isCountryCodeValid) {
    return { label: t('invalidCode'), type: 'error' }
  }
  if (!props.validationResult.isCountrySupported) {
    return { label: t('unsupported'), type: 'warning' }
  }
  return { label: t('supported'), type: 'success' }
})
</script>

<i18n lang="json">
{
  "en": {
    "supported": "Supported",
    "unsupported": "Unsupported",
    "invalidCode": "Invalid code",
    "notAvailable": "Not available"
  },
  "zh": {
    "supported": "已支持",
    "unsupported": "不支持",
    "invalidCode": "代码无效",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "supported": "已支持",
    "unsupported": "不支持",
    "invalidCode": "代码无效",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "supported": "已支援",
    "unsupported": "不支援",
    "invalidCode": "代碼無效",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "supported": "已支援",
    "unsupported": "不支援",
    "invalidCode": "代碼無效",
    "notAvailable": "不可用"
  },
  "es": {
    "supported": "Compatible",
    "unsupported": "No compatible",
    "invalidCode": "Código inválido",
    "notAvailable": "No disponible"
  },
  "fr": {
    "supported": "Pris en charge",
    "unsupported": "Non pris en charge",
    "invalidCode": "Code invalide",
    "notAvailable": "Non disponible"
  },
  "de": {
    "supported": "Unterstützt",
    "unsupported": "Nicht unterstützt",
    "invalidCode": "Ungültiger Code",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "supported": "Supportato",
    "unsupported": "Non supportato",
    "invalidCode": "Codice non valido",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "supported": "対応",
    "unsupported": "未対応",
    "invalidCode": "無効なコード",
    "notAvailable": "利用不可"
  },
  "ko": {
    "supported": "지원됨",
    "unsupported": "지원되지 않음",
    "invalidCode": "잘못된 코드",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "supported": "Поддерживается",
    "unsupported": "Не поддерживается",
    "invalidCode": "Неверный код",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "supported": "Suportado",
    "unsupported": "Não suportado",
    "invalidCode": "Código inválido",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "supported": "مدعوم",
    "unsupported": "غير مدعوم",
    "invalidCode": "رمز غير صالح",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "supported": "समर्थित",
    "unsupported": "असमर्थित",
    "invalidCode": "अमान्य कोड",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "supported": "Destekleniyor",
    "unsupported": "Desteklenmiyor",
    "invalidCode": "Geçersiz kod",
    "notAvailable": "Kullanılamıyor"
  },
  "nl": {
    "supported": "Ondersteund",
    "unsupported": "Niet ondersteund",
    "invalidCode": "Ongeldige code",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "supported": "Stöds",
    "unsupported": "Stöds inte",
    "invalidCode": "Ogiltig kod",
    "notAvailable": "Inte tillgänglig"
  },
  "pl": {
    "supported": "Obsługiwany",
    "unsupported": "Nieobsługiwany",
    "invalidCode": "Nieprawidłowy kod",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "supported": "Được hỗ trợ",
    "unsupported": "Không được hỗ trợ",
    "invalidCode": "Mã không hợp lệ",
    "notAvailable": "Không có sẵn"
  },
  "th": {
    "supported": "รองรับ",
    "unsupported": "ไม่รองรับ",
    "invalidCode": "รหัสไม่ถูกต้อง",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "supported": "Didukung",
    "unsupported": "Tidak didukung",
    "invalidCode": "Kode tidak valid",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "supported": "נתמך",
    "unsupported": "לא נתמך",
    "invalidCode": "קוד לא תקין",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "supported": "Disokong",
    "unsupported": "Tidak disokong",
    "invalidCode": "Kod tidak sah",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "supported": "Støttet",
    "unsupported": "Ikke støttet",
    "invalidCode": "Ugyldig kode",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
