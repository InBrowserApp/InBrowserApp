<template>
  <ToolSectionHeader>{{ t('details') }}</ToolSectionHeader>
  <ToolSection>
    <n-descriptions :column="1" label-placement="left">
      <n-descriptions-item :label="t('mime-type')">
        <n-text code>{{ mimeType }}</n-text>
      </n-descriptions-item>
      <n-descriptions-item :label="t('encoding')">
        {{ isBase64 ? t('base64') : t('url-encoded') }}
      </n-descriptions-item>
      <n-descriptions-item :label="t('size')">
        {{ formatBytes(size) }}
      </n-descriptions-item>
    </n-descriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  mimeType: string
  isBase64: boolean
  size: number
}>()

const { t } = useI18n()

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<i18n lang="json">
{
  "en": {
    "details": "Details",
    "mime-type": "MIME Type",
    "encoding": "Encoding",
    "base64": "Base64",
    "url-encoded": "URL-encoded",
    "size": "Size"
  },
  "zh": {
    "details": "详情",
    "mime-type": "MIME 类型",
    "encoding": "编码",
    "base64": "Base64",
    "url-encoded": "URL 编码",
    "size": "大小"
  },
  "zh-CN": {
    "details": "详情",
    "mime-type": "MIME 类型",
    "encoding": "编码",
    "base64": "Base64",
    "url-encoded": "URL 编码",
    "size": "大小"
  },
  "zh-TW": {
    "details": "詳細資訊",
    "mime-type": "MIME 類型",
    "encoding": "編碼",
    "base64": "Base64",
    "url-encoded": "URL 編碼",
    "size": "大小"
  },
  "zh-HK": {
    "details": "詳細資訊",
    "mime-type": "MIME 類型",
    "encoding": "編碼",
    "base64": "Base64",
    "url-encoded": "URL 編碼",
    "size": "大小"
  },
  "es": {
    "details": "Detalles",
    "mime-type": "Tipo MIME",
    "encoding": "Codificación",
    "base64": "Base64",
    "url-encoded": "Codificado URL",
    "size": "Tamaño"
  },
  "fr": {
    "details": "Détails",
    "mime-type": "Type MIME",
    "encoding": "Encodage",
    "base64": "Base64",
    "url-encoded": "Encodé URL",
    "size": "Taille"
  },
  "de": {
    "details": "Details",
    "mime-type": "MIME-Typ",
    "encoding": "Kodierung",
    "base64": "Base64",
    "url-encoded": "URL-kodiert",
    "size": "Größe"
  },
  "it": {
    "details": "Dettagli",
    "mime-type": "Tipo MIME",
    "encoding": "Codifica",
    "base64": "Base64",
    "url-encoded": "Codificato URL",
    "size": "Dimensione"
  },
  "ja": {
    "details": "詳細",
    "mime-type": "MIME タイプ",
    "encoding": "エンコード",
    "base64": "Base64",
    "url-encoded": "URL エンコード",
    "size": "サイズ"
  },
  "ko": {
    "details": "세부 정보",
    "mime-type": "MIME 유형",
    "encoding": "인코딩",
    "base64": "Base64",
    "url-encoded": "URL 인코딩",
    "size": "크기"
  },
  "ru": {
    "details": "Детали",
    "mime-type": "Тип MIME",
    "encoding": "Кодировка",
    "base64": "Base64",
    "url-encoded": "URL-кодирование",
    "size": "Размер"
  },
  "pt": {
    "details": "Detalhes",
    "mime-type": "Tipo MIME",
    "encoding": "Codificação",
    "base64": "Base64",
    "url-encoded": "Codificado URL",
    "size": "Tamanho"
  },
  "ar": {
    "details": "التفاصيل",
    "mime-type": "نوع MIME",
    "encoding": "الترميز",
    "base64": "Base64",
    "url-encoded": "مرمز URL",
    "size": "الحجم"
  },
  "hi": {
    "details": "विवरण",
    "mime-type": "MIME प्रकार",
    "encoding": "एन्कोडिंग",
    "base64": "Base64",
    "url-encoded": "URL एन्कोडेड",
    "size": "आकार"
  },
  "tr": {
    "details": "Ayrıntılar",
    "mime-type": "MIME Türü",
    "encoding": "Kodlama",
    "base64": "Base64",
    "url-encoded": "URL kodlu",
    "size": "Boyut"
  },
  "nl": {
    "details": "Details",
    "mime-type": "MIME-type",
    "encoding": "Codering",
    "base64": "Base64",
    "url-encoded": "URL-gecodeerd",
    "size": "Grootte"
  },
  "sv": {
    "details": "Detaljer",
    "mime-type": "MIME-typ",
    "encoding": "Kodning",
    "base64": "Base64",
    "url-encoded": "URL-kodad",
    "size": "Storlek"
  },
  "pl": {
    "details": "Szczegóły",
    "mime-type": "Typ MIME",
    "encoding": "Kodowanie",
    "base64": "Base64",
    "url-encoded": "Kodowane URL",
    "size": "Rozmiar"
  },
  "vi": {
    "details": "Chi tiết",
    "mime-type": "Loại MIME",
    "encoding": "Mã hóa",
    "base64": "Base64",
    "url-encoded": "Mã hóa URL",
    "size": "Kích thước"
  },
  "th": {
    "details": "รายละเอียด",
    "mime-type": "ชนิด MIME",
    "encoding": "การเข้ารหัส",
    "base64": "Base64",
    "url-encoded": "เข้ารหัส URL",
    "size": "ขนาด"
  },
  "id": {
    "details": "Detail",
    "mime-type": "Tipe MIME",
    "encoding": "Enkode",
    "base64": "Base64",
    "url-encoded": "Di-encode URL",
    "size": "Ukuran"
  },
  "he": {
    "details": "פרטים",
    "mime-type": "סוג MIME",
    "encoding": "קידוד",
    "base64": "Base64",
    "url-encoded": "בקידוד URL",
    "size": "גודל"
  },
  "ms": {
    "details": "Butiran",
    "mime-type": "Jenis MIME",
    "encoding": "Pengekodan",
    "base64": "Base64",
    "url-encoded": "URL dikodkan",
    "size": "Saiz"
  },
  "no": {
    "details": "Detaljer",
    "mime-type": "MIME-type",
    "encoding": "Koding",
    "base64": "Base64",
    "url-encoded": "URL-kodet",
    "size": "Størrelse"
  }
}
</i18n>
