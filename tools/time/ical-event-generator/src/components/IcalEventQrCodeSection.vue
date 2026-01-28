<template>
  <ToolSectionHeader>{{ t('qr-code') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="16">
      <QRCodePreview
        :text="text"
        :error-correction-level="qrOptions.errorCorrectionLevel"
        :width="qrOptions.width"
        :margin="qrOptions.margin"
        :dark="qrOptions.dark"
        :light="qrOptions.light"
      />
      <QRCodeDownloadButtons
        :text="text"
        :error-correction-level="qrOptions.errorCorrectionLevel"
        :width="qrOptions.width"
        :margin="qrOptions.margin"
        :dark="qrOptions.dark"
        :light="qrOptions.light"
      />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import QRCodePreview from './QRCodePreview.vue'
import QRCodeDownloadButtons from './QRCodeDownloadButtons.vue'

type QrOptions = {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  width: number
  margin: number
  dark: string
  light: string
}

defineProps<{
  text: string
  qrOptions: QrOptions
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "qr-code": "QR code"
  },
  "zh": {
    "qr-code": "二维码"
  },
  "zh-CN": {
    "qr-code": "二维码"
  },
  "zh-TW": {
    "qr-code": "QR Code"
  },
  "zh-HK": {
    "qr-code": "QR Code"
  },
  "es": {
    "qr-code": "Código QR"
  },
  "fr": {
    "qr-code": "Code QR"
  },
  "de": {
    "qr-code": "QR-Code"
  },
  "it": {
    "qr-code": "Codice QR"
  },
  "ja": {
    "qr-code": "QRコード"
  },
  "ko": {
    "qr-code": "QR 코드"
  },
  "ru": {
    "qr-code": "QR-код"
  },
  "pt": {
    "qr-code": "QR Code"
  },
  "ar": {
    "qr-code": "رمز QR"
  },
  "hi": {
    "qr-code": "QR कोड"
  },
  "tr": {
    "qr-code": "QR kod"
  },
  "nl": {
    "qr-code": "QR-code"
  },
  "sv": {
    "qr-code": "QR-kod"
  },
  "pl": {
    "qr-code": "Kod QR"
  },
  "vi": {
    "qr-code": "Mã QR"
  },
  "th": {
    "qr-code": "คิวอาร์โค้ด"
  },
  "id": {
    "qr-code": "Kode QR"
  },
  "he": {
    "qr-code": "QR"
  },
  "ms": {
    "qr-code": "Kod QR"
  },
  "no": {
    "qr-code": "QR-kode"
  }
}
</i18n>
