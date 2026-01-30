<template>
  <NDescriptionsItem :label="t('status')">
    <NTag :type="isValid ? 'success' : 'error'" size="small">
      {{ isValid ? t('valid') : t('invalid') }}
    </NTag>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('country')">
    <NText depth="3">{{ countryDisplay }}</NText>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('registry')">
    <NTag :type="isCountryValid ? 'success' : 'warning'" size="small">
      {{ isCountryValid ? t('supported') : t('unknown') }}
    </NTag>
  </NDescriptionsItem>
</template>

<script setup lang="ts">
import { NDescriptionsItem, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  isValid: boolean
  isCountryValid: boolean
  countryDisplay: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "country": "Country",
    "registry": "Registry",
    "supported": "Supported",
    "unknown": "Unknown"
  },
  "zh": {
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "country": "国家",
    "registry": "注册表",
    "supported": "已支持",
    "unknown": "未知"
  },
  "zh-CN": {
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "country": "国家",
    "registry": "注册表",
    "supported": "已支持",
    "unknown": "未知"
  },
  "zh-TW": {
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "country": "國家",
    "registry": "登錄表",
    "supported": "已支援",
    "unknown": "未知"
  },
  "zh-HK": {
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "country": "國家",
    "registry": "登錄表",
    "supported": "已支援",
    "unknown": "未知"
  },
  "es": {
    "status": "Estado",
    "valid": "Válido",
    "invalid": "Inválido",
    "country": "País",
    "registry": "Registro",
    "supported": "Compatible",
    "unknown": "Desconocido"
  },
  "fr": {
    "status": "Statut",
    "valid": "Valide",
    "invalid": "Invalide",
    "country": "Pays",
    "registry": "Registre",
    "supported": "Pris en charge",
    "unknown": "Inconnu"
  },
  "de": {
    "status": "Status",
    "valid": "Gültig",
    "invalid": "Ungültig",
    "country": "Land",
    "registry": "Register",
    "supported": "Unterstützt",
    "unknown": "Unbekannt"
  },
  "it": {
    "status": "Stato",
    "valid": "Valido",
    "invalid": "Non valido",
    "country": "Paese",
    "registry": "Registro",
    "supported": "Supportato",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "status": "ステータス",
    "valid": "有効",
    "invalid": "無効",
    "country": "国",
    "registry": "レジストリ",
    "supported": "サポート済み",
    "unknown": "不明"
  },
  "ko": {
    "status": "상태",
    "valid": "유효",
    "invalid": "유효하지 않음",
    "country": "국가",
    "registry": "등록부",
    "supported": "지원됨",
    "unknown": "알 수 없음"
  },
  "ru": {
    "status": "Статус",
    "valid": "Действителен",
    "invalid": "Недействителен",
    "country": "Страна",
    "registry": "Реестр",
    "supported": "Поддерживается",
    "unknown": "Неизвестно"
  },
  "pt": {
    "status": "Status",
    "valid": "Válido",
    "invalid": "Inválido",
    "country": "País",
    "registry": "Registro",
    "supported": "Compatível",
    "unknown": "Desconhecido"
  },
  "ar": {
    "status": "الحالة",
    "valid": "صالح",
    "invalid": "غير صالح",
    "country": "الدولة",
    "registry": "السجل",
    "supported": "مدعوم",
    "unknown": "غير معروف"
  },
  "hi": {
    "status": "स्थिति",
    "valid": "मान्य",
    "invalid": "अमान्य",
    "country": "देश",
    "registry": "रजिस्ट्री",
    "supported": "समर्थित",
    "unknown": "अज्ञात"
  },
  "tr": {
    "status": "Durum",
    "valid": "Geçerli",
    "invalid": "Geçersiz",
    "country": "Ülke",
    "registry": "Kayıt",
    "supported": "Destekleniyor",
    "unknown": "Bilinmeyen"
  },
  "nl": {
    "status": "Status",
    "valid": "Geldig",
    "invalid": "Ongeldig",
    "country": "Land",
    "registry": "Register",
    "supported": "Ondersteund",
    "unknown": "Onbekend"
  },
  "sv": {
    "status": "Status",
    "valid": "Giltig",
    "invalid": "Ogiltig",
    "country": "Land",
    "registry": "Register",
    "supported": "Stöds",
    "unknown": "Okänd"
  },
  "pl": {
    "status": "Status",
    "valid": "Poprawny",
    "invalid": "Niepoprawny",
    "country": "Kraj",
    "registry": "Rejestr",
    "supported": "Obsługiwany",
    "unknown": "Nieznany"
  },
  "vi": {
    "status": "Trạng thái",
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ",
    "country": "Quốc gia",
    "registry": "Đăng ký",
    "supported": "Được hỗ trợ",
    "unknown": "Không rõ"
  },
  "th": {
    "status": "สถานะ",
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง",
    "country": "ประเทศ",
    "registry": "ทะเบียน",
    "supported": "รองรับ",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Tidak valid",
    "country": "Negara",
    "registry": "Registri",
    "supported": "Didukung",
    "unknown": "Tidak diketahui"
  },
  "he": {
    "status": "סטטוס",
    "valid": "תקין",
    "invalid": "לא תקין",
    "country": "מדינה",
    "registry": "רישום",
    "supported": "נתמך",
    "unknown": "לא ידוע"
  },
  "ms": {
    "status": "Status",
    "valid": "Sah",
    "invalid": "Tidak sah",
    "country": "Negara",
    "registry": "Pendaftaran",
    "supported": "Disokong",
    "unknown": "Tidak diketahui"
  },
  "no": {
    "status": "Status",
    "valid": "Gyldig",
    "invalid": "Ugyldig",
    "country": "Land",
    "registry": "Register",
    "supported": "Støttet",
    "unknown": "Ukjent"
  }
}
</i18n>
