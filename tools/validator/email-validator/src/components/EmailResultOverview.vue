<template>
  <NDescriptions :column="1" bordered label-placement="left">
    <NDescriptionsItem :label="t('status')">
      <NTag :type="isValid ? 'success' : 'error'" size="small">
        {{ isValid ? t('valid') : t('invalid') }}
      </NTag>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('normalized')">
      <NFlex align="center" :size="8">
        <NText code>{{ normalized }}</NText>
        <CopyToClipboardButton v-if="normalizedRaw" :content="normalizedRaw" size="small" />
      </NFlex>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('localPart')">
      <NFlex align="center" :size="8">
        <NText code>{{ localPart }}</NText>
        <CopyToClipboardButton v-if="localPartRaw" :content="localPartRaw" size="small" />
      </NFlex>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('domain')">
      <NFlex align="center" :size="8">
        <NText code>{{ domain }}</NText>
        <CopyToClipboardButton v-if="domainRaw" :content="domainRaw" size="small" />
      </NFlex>
    </NDescriptionsItem>
  </NDescriptions>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  isValid: boolean
  normalized: string
  normalizedRaw?: string | null
  localPart: string
  localPartRaw?: string | null
  domain: string
  domainRaw?: string | null
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "normalized": "Normalized Email",
    "localPart": "Local Part",
    "domain": "Domain"
  },
  "zh": {
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "normalized": "标准化邮箱",
    "localPart": "本地部分",
    "domain": "域名"
  },
  "zh-CN": {
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "normalized": "标准化邮箱",
    "localPart": "本地部分",
    "domain": "域名"
  },
  "zh-TW": {
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "normalized": "標準化電子郵件",
    "localPart": "本地部分",
    "domain": "網域"
  },
  "zh-HK": {
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "normalized": "標準化電郵",
    "localPart": "本地部分",
    "domain": "網域"
  },
  "es": {
    "status": "Estado",
    "valid": "Válido",
    "invalid": "Inválido",
    "normalized": "Correo normalizado",
    "localPart": "Parte local",
    "domain": "Dominio"
  },
  "fr": {
    "status": "Statut",
    "valid": "Valide",
    "invalid": "Invalide",
    "normalized": "E-mail normalisé",
    "localPart": "Partie locale",
    "domain": "Domaine"
  },
  "de": {
    "status": "Status",
    "valid": "Gültig",
    "invalid": "Ungültig",
    "normalized": "Normalisierte E-Mail",
    "localPart": "Lokaler Teil",
    "domain": "Domain"
  },
  "it": {
    "status": "Stato",
    "valid": "Valido",
    "invalid": "Non valido",
    "normalized": "Email normalizzata",
    "localPart": "Parte locale",
    "domain": "Dominio"
  },
  "ja": {
    "status": "状態",
    "valid": "有効",
    "invalid": "無効",
    "normalized": "正規化メール",
    "localPart": "ローカル部",
    "domain": "ドメイン"
  },
  "ko": {
    "status": "상태",
    "valid": "유효",
    "invalid": "무효",
    "normalized": "정규화된 이메일",
    "localPart": "로컬 부분",
    "domain": "도메인"
  },
  "ru": {
    "status": "Статус",
    "valid": "Действителен",
    "invalid": "Недействителен",
    "normalized": "Нормализованный email",
    "localPart": "Локальная часть",
    "domain": "Домен"
  },
  "pt": {
    "status": "Status",
    "valid": "Válido",
    "invalid": "Inválido",
    "normalized": "E-mail normalizado",
    "localPart": "Parte local",
    "domain": "Domínio"
  },
  "ar": {
    "status": "الحالة",
    "valid": "صالح",
    "invalid": "غير صالح",
    "normalized": "البريد الإلكتروني المعياري",
    "localPart": "الجزء المحلي",
    "domain": "النطاق"
  },
  "hi": {
    "status": "स्थिति",
    "valid": "मान्य",
    "invalid": "अमान्य",
    "normalized": "सामान्यीकृत ईमेल",
    "localPart": "लोकल भाग",
    "domain": "डोमेन"
  },
  "tr": {
    "status": "Durum",
    "valid": "Geçerli",
    "invalid": "Geçersiz",
    "normalized": "Normalleştirilmiş e-posta",
    "localPart": "Yerel bölüm",
    "domain": "Alan adı"
  },
  "nl": {
    "status": "Status",
    "valid": "Geldig",
    "invalid": "Ongeldig",
    "normalized": "Genormaliseerde e-mail",
    "localPart": "Lokaal deel",
    "domain": "Domein"
  },
  "sv": {
    "status": "Status",
    "valid": "Giltig",
    "invalid": "Ogiltig",
    "normalized": "Normaliserad e-post",
    "localPart": "Lokal del",
    "domain": "Domän"
  },
  "pl": {
    "status": "Status",
    "valid": "Poprawny",
    "invalid": "Niepoprawny",
    "normalized": "Znormalizowany e-mail",
    "localPart": "Część lokalna",
    "domain": "Domena"
  },
  "vi": {
    "status": "Trạng thái",
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ",
    "normalized": "Email chuẩn hóa",
    "localPart": "Phần cục bộ",
    "domain": "Tên miền"
  },
  "th": {
    "status": "สถานะ",
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง",
    "normalized": "อีเมลที่ปรับรูปแบบ",
    "localPart": "ส่วนโลคัล",
    "domain": "โดเมน"
  },
  "id": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Tidak valid",
    "normalized": "Email ternormalisasi",
    "localPart": "Bagian lokal",
    "domain": "Domain"
  },
  "he": {
    "status": "סטטוס",
    "valid": "תקין",
    "invalid": "לא תקין",
    "normalized": "דוא\"ל מנורמל",
    "localPart": "החלק המקומי",
    "domain": "דומיין"
  },
  "ms": {
    "status": "Status",
    "valid": "Sah",
    "invalid": "Tidak sah",
    "normalized": "E-mel dinormalkan",
    "localPart": "Bahagian lokal",
    "domain": "Domain"
  },
  "no": {
    "status": "Status",
    "valid": "Gyldig",
    "invalid": "Ugyldig",
    "normalized": "Normalisert e-post",
    "localPart": "Lokal del",
    "domain": "Domene"
  }
}
</i18n>
