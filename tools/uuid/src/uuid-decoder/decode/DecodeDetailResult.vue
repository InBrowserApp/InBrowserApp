<template>
  <n-descriptions
    label-placement="left"
    bordered
    :column="1"
    content-style="width: 100%"
    class="decode-detail-result"
  >
    <n-descriptions-item label="UUID">
      <n-text code>{{ result.uuid }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('version')">
      <VersionDisplay :version="result.version" />
    </n-descriptions-item>
    <n-descriptions-item :label="t('variant')">
      <VariantDisplay :variant="result.variant" />
    </n-descriptions-item>
    <n-descriptions-item label="Base64">
      <n-text code>{{ result.base64 }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('integer')">
      <n-text code>{{ result.integer }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('octal')">
      <n-text code>{{ result.octal }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('binary')">
      <n-text code>{{ result.binary }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('algorithm')" v-if="result.algorithm">
      {{ t('algorithm.' + result.algorithm) }}
    </n-descriptions-item>
    <n-descriptions-item :label="t('macAddress')" v-if="result.macAddress">
      <n-text code>{{ result.macAddress }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('timestamp')" v-if="result.timestamp">
      <n-text code>{{ result.timestamp }}</n-text>
      (<n-time :time="result.timestamp" />, <n-time :time="result.timestamp" type="relative" />)
    </n-descriptions-item>
  </n-descriptions>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NText, NTime } from 'naive-ui'
import VersionDisplay from './VersionDisplay.vue'
import VariantDisplay from './VariantDisplay.vue'
import { useI18n } from 'vue-i18n'
import type { UUID } from '@utils/uuid'

const { t } = useI18n()

defineProps<{
  result: {
    uuid: UUID
    version: number
    variant: number
    base64: string
    integer: bigint
    octal: string
    binary: string
    algorithm?: 'sha1' | 'md5'
    macAddress?: string
    timestamp?: number
  }
}>()
</script>

<style scoped>
.decode-detail-result :deep(.n-descriptions-table-header) {
  white-space: nowrap;
}
</style>

<i18n lang="json">
{
  "en": {
    "version": "Version",
    "variant": "Variant",
    "algorithm": "Algorithm",
    "macAddress": "MAC Address",
    "timestamp": "Timestamp",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "integer": "Integer",
    "octal": "Octal",
    "binary": "Binary"
  },
  "zh": {
    "version": "版本",
    "variant": "变体",
    "algorithm": "算法",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC 地址",
    "timestamp": "时间戳",
    "integer": "整数",
    "octal": "八进制",
    "binary": "二进制"
  },
  "zh-CN": {
    "version": "版本",
    "variant": "变体",
    "algorithm": "算法",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC 地址",
    "timestamp": "时间戳",
    "integer": "整数",
    "octal": "八进制",
    "binary": "二进制"
  },
  "zh-TW": {
    "version": "版本",
    "variant": "變體",
    "algorithm": "演算法",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC 位址",
    "timestamp": "時間戳",
    "integer": "整數",
    "octal": "八進制",
    "binary": "二進制"
  },
  "zh-HK": {
    "version": "版本",
    "variant": "變體",
    "algorithm": "演算法",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC 位址",
    "timestamp": "時間戳",
    "integer": "整數",
    "octal": "八進制",
    "binary": "二進制"
  },
  "es": {
    "version": "Versión",
    "variant": "Variante",
    "algorithm": "Algoritmo",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "Dirección MAC",
    "timestamp": "Marca de tiempo",
    "integer": "Entero",
    "octal": "Octal",
    "binary": "Binario"
  },
  "fr": {
    "version": "Version",
    "variant": "Variante",
    "algorithm": "Algorithme",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "Adresse MAC",
    "timestamp": "Horodatage",
    "integer": "Entier",
    "octal": "Octal",
    "binary": "Binaire"
  },
  "de": {
    "version": "Version",
    "variant": "Variante",
    "algorithm": "Algorithmus",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC-Adresse",
    "timestamp": "Zeitstempel",
    "integer": "Ganzzahl",
    "octal": "Oktal",
    "binary": "Binär"
  },
  "it": {
    "version": "Versione",
    "variant": "Variante",
    "algorithm": "Algoritmo",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "Indirizzo MAC",
    "timestamp": "Timestamp",
    "integer": "Intero",
    "octal": "Ottale",
    "binary": "Binario"
  },
  "ja": {
    "version": "バージョン",
    "variant": "バリアント",
    "algorithm": "アルゴリズム",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC アドレス",
    "timestamp": "タイムスタンプ",
    "integer": "整数",
    "octal": "8進数",
    "binary": "2進数"
  },
  "ko": {
    "version": "버전",
    "variant": "변형",
    "algorithm": "알고리즘",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC 주소",
    "timestamp": "타임스탬프",
    "integer": "정수",
    "octal": "8진수",
    "binary": "2진수"
  },
  "ru": {
    "version": "Версия",
    "variant": "Вариант",
    "algorithm": "Алгоритм",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC-адрес",
    "timestamp": "Временная метка",
    "integer": "Целое число",
    "octal": "Восьмеричный",
    "binary": "Двоичный"
  },
  "pt": {
    "version": "Versão",
    "variant": "Variante",
    "algorithm": "Algoritmo",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "Endereço MAC",
    "timestamp": "Timestamp",
    "integer": "Inteiro",
    "octal": "Octal",
    "binary": "Binário"
  },
  "ar": {
    "version": "الإصدار",
    "variant": "المتغير",
    "algorithm": "الخوارزمية",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "عنوان MAC",
    "timestamp": "الطابع الزمني",
    "integer": "عدد صحيح",
    "octal": "ثماني",
    "binary": "ثنائي"
  },
  "hi": {
    "version": "संस्करण",
    "variant": "वेरिएंट",
    "algorithm": "एल्गोरिथम",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC पता",
    "timestamp": "टाइमस्टैम्प",
    "integer": "पूर्णांक",
    "octal": "अष्टाधारी",
    "binary": "द्विआधारी"
  },
  "tr": {
    "version": "Sürüm",
    "variant": "Varyant",
    "algorithm": "Algoritma",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC Adresi",
    "timestamp": "Zaman damgası",
    "integer": "Tamsayı",
    "octal": "Sekizli",
    "binary": "İkili"
  },
  "nl": {
    "version": "Versie",
    "variant": "Variant",
    "algorithm": "Algoritme",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC-adres",
    "timestamp": "Tijdstempel",
    "integer": "Geheel getal",
    "octal": "Octaal",
    "binary": "Binair"
  },
  "sv": {
    "version": "Version",
    "variant": "Variant",
    "algorithm": "Algoritm",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC-adress",
    "timestamp": "Tidsstämpel",
    "integer": "Heltal",
    "octal": "Oktal",
    "binary": "Binär"
  },
  "pl": {
    "version": "Wersja",
    "variant": "Wariant",
    "algorithm": "Algorytm",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "Adres MAC",
    "timestamp": "Znacznik czasu",
    "integer": "Liczba całkowita",
    "octal": "Ósemkowy",
    "binary": "Dwójkowy"
  },
  "vi": {
    "version": "Phiên bản",
    "variant": "Biến thể",
    "algorithm": "Thuật toán",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "Địa chỉ MAC",
    "timestamp": "Dấu thời gian",
    "integer": "Số nguyên",
    "octal": "Bát phân",
    "binary": "Nhị phân"
  },
  "th": {
    "version": "เวอร์ชัน",
    "variant": "ตัวแปร",
    "algorithm": "อัลกอริทึม",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "ที่อยู่ MAC",
    "timestamp": "การประทับเวลา",
    "integer": "จำนวนเต็ม",
    "octal": "ฐานแปด",
    "binary": "ฐานสอง"
  },
  "id": {
    "version": "Versi",
    "variant": "Varian",
    "algorithm": "Algoritma",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "Alamat MAC",
    "timestamp": "Timestamp",
    "integer": "Bilangan bulat",
    "octal": "Oktal",
    "binary": "Biner"
  },
  "he": {
    "version": "גרסה",
    "variant": "וריאנט",
    "algorithm": "אלגוריתם",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "כתובת MAC",
    "timestamp": "חותמת זמן",
    "integer": "מספר שלם",
    "octal": "אוקטלי",
    "binary": "בינארי"
  },
  "ms": {
    "version": "Versi",
    "variant": "Varian",
    "algorithm": "Algoritma",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "Alamat MAC",
    "timestamp": "Cop masa",
    "integer": "Integer",
    "octal": "Oktal",
    "binary": "Perduaan"
  },
  "no": {
    "version": "Versjon",
    "variant": "Variant",
    "algorithm": "Algoritme",
    "algorithm.sha1": "SHA1",
    "algorithm.md5": "MD5",
    "macAddress": "MAC-adresse",
    "timestamp": "Tidsstempel",
    "integer": "Heltall",
    "octal": "Oktal",
    "binary": "Binær"
  }
}
</i18n>
