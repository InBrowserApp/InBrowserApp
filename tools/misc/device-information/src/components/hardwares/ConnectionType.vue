<template>
  <InfoStatistic :label="t('connection-type')" :value="connectionType" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

declare global {
  interface Navigator {
    readonly connection?: NetworkInformation
    readonly mozConnection?: NetworkInformation
    readonly webkitConnection?: NetworkInformation
  }

  interface NetworkInformation {
    readonly effectiveType?: string
    readonly type?: string
    readonly downlink?: number
  }
}

// Network Information
const connectionType = computed(() => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  return connection?.effectiveType || connection?.type || undefined
})
</script>

<i18n lang="json">
{
  "en": {
    "connection-type": "Connection Type"
  },
  "zh": {
    "connection-type": "连接类型"
  },
  "zh-CN": {
    "connection-type": "连接类型"
  },
  "zh-TW": {
    "connection-type": "連線類型"
  },
  "zh-HK": {
    "connection-type": "連線類型"
  },
  "es": {
    "connection-type": "Tipo de conexion"
  },
  "fr": {
    "connection-type": "Type de connexion"
  },
  "de": {
    "connection-type": "Verbindungstyp"
  },
  "it": {
    "connection-type": "Tipo di connessione"
  },
  "ja": {
    "connection-type": "接続タイプ"
  },
  "ko": {
    "connection-type": "연결 유형"
  },
  "ru": {
    "connection-type": "Тип соединения"
  },
  "pt": {
    "connection-type": "Tipo de conexao"
  },
  "ar": {
    "connection-type": "نوع الاتصال"
  },
  "hi": {
    "connection-type": "कनेक्शन प्रकार"
  },
  "tr": {
    "connection-type": "Baglanti Turu"
  },
  "nl": {
    "connection-type": "Verbindingstype"
  },
  "sv": {
    "connection-type": "Anslutningstyp"
  },
  "pl": {
    "connection-type": "Typ polaczenia"
  },
  "vi": {
    "connection-type": "Loai ket noi"
  },
  "th": {
    "connection-type": "ประเภทการเชื่อมต่อ"
  },
  "id": {
    "connection-type": "Jenis Koneksi"
  },
  "he": {
    "connection-type": "סוג חיבור"
  },
  "ms": {
    "connection-type": "Jenis Sambungan"
  },
  "no": {
    "connection-type": "Tilkoblingstype"
  }
}
</i18n>
