<template>
  <n-grid cols="1 900:2" x-gap="16" y-gap="16">
    <n-gi>
      <n-flex vertical :size="12" class="result-card">
        <n-text strong>{{ t('add') }}</n-text>
        <n-descriptions :column="1" label-placement="left" bordered>
          <n-descriptions-item :label="t('date-time')">
            <n-flex align="center" :size="8">
              <code>{{ addedDateTime || '-' }}</code>
              <CopyToClipboardButton v-if="addedDateTime" :content="addedDateTime" size="tiny" />
            </n-flex>
          </n-descriptions-item>
          <n-descriptions-item :label="t('iso-8601')">
            <n-flex align="center" :size="8">
              <code>{{ addedIso || '-' }}</code>
              <CopyToClipboardButton v-if="addedIso" :content="addedIso" size="tiny" />
            </n-flex>
          </n-descriptions-item>
          <n-descriptions-item :label="t('unix-ms')">
            <n-flex align="center" :size="8">
              <code>{{ addedUnixMs || '-' }}</code>
              <CopyToClipboardButton v-if="addedUnixMs" :content="addedUnixMs" size="tiny" />
            </n-flex>
          </n-descriptions-item>
          <n-descriptions-item :label="t('unix-s')">
            <n-flex align="center" :size="8">
              <code>{{ addedUnixSeconds || '-' }}</code>
              <CopyToClipboardButton
                v-if="addedUnixSeconds"
                :content="addedUnixSeconds"
                size="tiny"
              />
            </n-flex>
          </n-descriptions-item>
        </n-descriptions>
      </n-flex>
    </n-gi>

    <n-gi>
      <n-flex vertical :size="12" class="result-card">
        <n-text strong>{{ t('subtract') }}</n-text>
        <n-descriptions :column="1" label-placement="left" bordered>
          <n-descriptions-item :label="t('date-time')">
            <n-flex align="center" :size="8">
              <code>{{ subtractedDateTime || '-' }}</code>
              <CopyToClipboardButton
                v-if="subtractedDateTime"
                :content="subtractedDateTime"
                size="tiny"
              />
            </n-flex>
          </n-descriptions-item>
          <n-descriptions-item :label="t('iso-8601')">
            <n-flex align="center" :size="8">
              <code>{{ subtractedIso || '-' }}</code>
              <CopyToClipboardButton v-if="subtractedIso" :content="subtractedIso" size="tiny" />
            </n-flex>
          </n-descriptions-item>
          <n-descriptions-item :label="t('unix-ms')">
            <n-flex align="center" :size="8">
              <code>{{ subtractedUnixMs || '-' }}</code>
              <CopyToClipboardButton
                v-if="subtractedUnixMs"
                :content="subtractedUnixMs"
                size="tiny"
              />
            </n-flex>
          </n-descriptions-item>
          <n-descriptions-item :label="t('unix-s')">
            <n-flex align="center" :size="8">
              <code>{{ subtractedUnixSeconds || '-' }}</code>
              <CopyToClipboardButton
                v-if="subtractedUnixSeconds"
                :content="subtractedUnixSeconds"
                size="tiny"
              />
            </n-flex>
          </n-descriptions-item>
        </n-descriptions>
      </n-flex>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NText, NFlex, NGrid, NGi, NDescriptions, NDescriptionsItem } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

defineProps<{
  addedDateTime: string
  addedIso: string
  addedUnixMs: string
  addedUnixSeconds: string
  subtractedDateTime: string
  subtractedIso: string
  subtractedUnixMs: string
  subtractedUnixSeconds: string
}>()

const { t } = useI18n()
</script>

<style scoped>
.result-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}
</style>

<i18n lang="json">
{
  "en": {
    "add": "Add",
    "subtract": "Subtract",
    "date-time": "Date & time",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix timestamp (ms)",
    "unix-s": "Unix timestamp (s)"
  },
  "zh": {
    "add": "加",
    "subtract": "减",
    "date-time": "日期与时间",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 时间戳（毫秒）",
    "unix-s": "Unix 时间戳（秒）"
  },
  "zh-CN": {
    "add": "加",
    "subtract": "减",
    "date-time": "日期与时间",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 时间戳（毫秒）",
    "unix-s": "Unix 时间戳（秒）"
  },
  "zh-TW": {
    "add": "加",
    "subtract": "減",
    "date-time": "日期與時間",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 時間戳記（毫秒）",
    "unix-s": "Unix 時間戳記（秒）"
  },
  "zh-HK": {
    "add": "加",
    "subtract": "減",
    "date-time": "日期與時間",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 時間戳記（毫秒）",
    "unix-s": "Unix 時間戳記（秒）"
  },
  "es": {
    "add": "Sumar",
    "subtract": "Restar",
    "date-time": "Fecha y hora",
    "iso-8601": "ISO 8601",
    "unix-ms": "Marca de tiempo Unix (ms)",
    "unix-s": "Marca de tiempo Unix (s)"
  },
  "fr": {
    "add": "Ajouter",
    "subtract": "Soustraire",
    "date-time": "Date et heure",
    "iso-8601": "ISO 8601",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "de": {
    "add": "Addieren",
    "subtract": "Subtrahieren",
    "date-time": "Datum und Uhrzeit",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-Zeitstempel (ms)",
    "unix-s": "Unix-Zeitstempel (s)"
  },
  "it": {
    "add": "Aggiungi",
    "subtract": "Sottrai",
    "date-time": "Data e ora",
    "iso-8601": "ISO 8601",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "ja": {
    "add": "加算",
    "subtract": "減算",
    "date-time": "日付と時刻",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix タイムスタンプ (ms)",
    "unix-s": "Unix タイムスタンプ (s)"
  },
  "ko": {
    "add": "더하기",
    "subtract": "빼기",
    "date-time": "날짜 및 시간",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 타임스탬프 (ms)",
    "unix-s": "Unix 타임스탬프 (s)"
  },
  "ru": {
    "add": "Добавить",
    "subtract": "Вычесть",
    "date-time": "Дата и время",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-метка времени (мс)",
    "unix-s": "Unix-метка времени (с)"
  },
  "pt": {
    "add": "Adicionar",
    "subtract": "Subtrair",
    "date-time": "Data e hora",
    "iso-8601": "ISO 8601",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "ar": {
    "add": "إضافة",
    "subtract": "طرح",
    "date-time": "التاريخ والوقت",
    "iso-8601": "ISO 8601",
    "unix-ms": "الطابع الزمني Unix (مللي ثانية)",
    "unix-s": "الطابع الزمني Unix (ثانية)"
  },
  "hi": {
    "add": "जोड़ें",
    "subtract": "घटाएं",
    "date-time": "तिथि और समय",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix टाइमस्टैम्प (मिलीसेकंड)",
    "unix-s": "Unix टाइमस्टैम्प (सेकंड)"
  },
  "tr": {
    "add": "Ekle",
    "subtract": "Çıkar",
    "date-time": "Tarih ve saat",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix zaman damgası (ms)",
    "unix-s": "Unix zaman damgası (s)"
  },
  "nl": {
    "add": "Optellen",
    "subtract": "Aftrekken",
    "date-time": "Datum en tijd",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-tijdstempel (ms)",
    "unix-s": "Unix-tijdstempel (s)"
  },
  "sv": {
    "add": "Lägg till",
    "subtract": "Subtrahera",
    "date-time": "Datum och tid",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-tidsstämpel (ms)",
    "unix-s": "Unix-tidsstämpel (s)"
  },
  "pl": {
    "add": "Dodaj",
    "subtract": "Odejmij",
    "date-time": "Data i czas",
    "iso-8601": "ISO 8601",
    "unix-ms": "Znacznik czasu Unix (ms)",
    "unix-s": "Znacznik czasu Unix (s)"
  },
  "vi": {
    "add": "Cộng",
    "subtract": "Trừ",
    "date-time": "Ngày và giờ",
    "iso-8601": "ISO 8601",
    "unix-ms": "Dấu thời gian Unix (ms)",
    "unix-s": "Dấu thời gian Unix (s)"
  },
  "th": {
    "add": "บวก",
    "subtract": "ลบ",
    "date-time": "วันที่และเวลา",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix timestamp (มิลลิวินาที)",
    "unix-s": "Unix timestamp (วินาที)"
  },
  "id": {
    "add": "Tambah",
    "subtract": "Kurangi",
    "date-time": "Tanggal dan waktu",
    "iso-8601": "ISO 8601",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "he": {
    "add": "הוסף",
    "subtract": "החסר",
    "date-time": "תאריך ושעה",
    "iso-8601": "ISO 8601",
    "unix-ms": "חותמת זמן Unix (מילישניות)",
    "unix-s": "חותמת זמן Unix (שניות)"
  },
  "ms": {
    "add": "Tambah",
    "subtract": "Tolak",
    "date-time": "Tarikh dan masa",
    "iso-8601": "ISO 8601",
    "unix-ms": "Cap masa Unix (ms)",
    "unix-s": "Cap masa Unix (s)"
  },
  "no": {
    "add": "Legg til",
    "subtract": "Trekk fra",
    "date-time": "Dato og tid",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-tidsstempel (ms)",
    "unix-s": "Unix-tidsstempel (s)"
  }
}
</i18n>
