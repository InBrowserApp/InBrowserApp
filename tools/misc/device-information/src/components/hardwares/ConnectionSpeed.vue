<template>
  <InfoStatistic :label="t('connection-speed')" :value="connectionSpeed" />
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
const connectionSpeed = computed(() => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const downlink = connection?.downlink
  return downlink ? `${downlink} Mbps` : undefined
})
</script>

<i18n lang="json">
{
  "en": {
    "connection-speed": "Connection Speed"
  },
  "zh": {
    "connection-speed": "连接速度"
  },
  "zh-CN": {
    "connection-speed": "连接速度"
  },
  "zh-TW": {
    "connection-speed": "連線速度"
  },
  "zh-HK": {
    "connection-speed": "連線速度"
  },
  "es": {
    "connection-speed": "Velocidad de conexion"
  },
  "fr": {
    "connection-speed": "Vitesse de connexion"
  },
  "de": {
    "connection-speed": "Verbindungsgeschwindigkeit"
  },
  "it": {
    "connection-speed": "Velocita di connessione"
  },
  "ja": {
    "connection-speed": "接続速度"
  },
  "ko": {
    "connection-speed": "연결 속도"
  },
  "ru": {
    "connection-speed": "Скорость соединения"
  },
  "pt": {
    "connection-speed": "Velocidade de conexao"
  },
  "ar": {
    "connection-speed": "سرعة الاتصال"
  },
  "hi": {
    "connection-speed": "कनेक्शन गति"
  },
  "tr": {
    "connection-speed": "Baglanti Hizi"
  },
  "nl": {
    "connection-speed": "Verbindingssnelheid"
  },
  "sv": {
    "connection-speed": "Anslutningshastighet"
  },
  "pl": {
    "connection-speed": "Predkosc polaczenia"
  },
  "vi": {
    "connection-speed": "Toc do ket noi"
  },
  "th": {
    "connection-speed": "ความเร็วการเชื่อมต่อ"
  },
  "id": {
    "connection-speed": "Kecepatan Koneksi"
  },
  "he": {
    "connection-speed": "מהירות חיבור"
  },
  "ms": {
    "connection-speed": "Kelajuan Sambungan"
  },
  "no": {
    "connection-speed": "Tilkoblingshastighet"
  }
}
</i18n>
