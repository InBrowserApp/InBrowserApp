<template>
  <KsuidGeneratorOptions
    v-model:count="count"
    v-model:timestamp-mode="timestampMode"
    v-model:custom-date-ms="customDateMs"
    v-model:custom-unix-seconds="customUnixSeconds"
    :max-count="maxCount"
    :min-unix-seconds="minUnixSeconds"
    :max-unix-seconds="maxUnixSeconds"
    :timestamp-error="timestampError"
    @set-now="setNow"
  />
  <KsuidGeneratorResults
    :output="output"
    :generated-at-unix-seconds="generatedAtUnixSeconds"
    @regenerate="regenerate"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import KsuidGeneratorOptions from './KsuidGeneratorOptions.vue'
import KsuidGeneratorResults from './KsuidGeneratorResults.vue'
import {
  generateKsuid,
  isValidKsuidUnixSeconds,
  KSUID_EPOCH_SECONDS,
  MAX_KSUID_TIMESTAMP,
} from '../utils/ksuid'

const { t } = useI18n()

const maxCount = 100
const minUnixSeconds = KSUID_EPOCH_SECONDS
const maxUnixSeconds = KSUID_EPOCH_SECONDS + MAX_KSUID_TIMESTAMP

const count = useStorage<number | null>('tools:ksuid-generator:count', 5)
const timestampMode = useStorage<'now' | 'custom'>('tools:ksuid-generator:timestamp-mode', 'now')
const customUnixSeconds = useStorage<number | null>(
  'tools:ksuid-generator:custom-unix-seconds',
  Math.floor(Date.now() / 1000),
)

const customDateMs = computed<number | null>({
  get: () => {
    if (typeof customUnixSeconds.value !== 'number' || !Number.isFinite(customUnixSeconds.value)) {
      return null
    }
    return customUnixSeconds.value * 1000
  },
  set: (value: number | null) => {
    if (value === null) return
    customUnixSeconds.value = Math.floor(value / 1000)
  },
})

const timestampError = computed(() => {
  if (timestampMode.value !== 'custom') return ''
  if (typeof customUnixSeconds.value !== 'number' || !Number.isFinite(customUnixSeconds.value)) {
    return t('timestampInvalid')
  }
  if (customUnixSeconds.value < minUnixSeconds || customUnixSeconds.value > maxUnixSeconds) {
    return t('timestampOutOfRange', { min: minUnixSeconds, max: maxUnixSeconds })
  }
  return ''
})

const generatedIds = ref<string[]>([])
const generatedAtUnixSeconds = ref<number>(Math.floor(Date.now() / 1000))

function normalizeCount(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.min(Math.max(Math.floor(value), 1), maxCount)
}

function setNow() {
  customUnixSeconds.value = Math.floor(Date.now() / 1000)
}

function regenerate() {
  const normalizedCount = normalizeCount(count.value)
  if (count.value !== normalizedCount) {
    count.value = normalizedCount
  }

  const unixSeconds =
    timestampMode.value === 'custom' ? customUnixSeconds.value : Math.floor(Date.now() / 1000)

  if (typeof unixSeconds !== 'number' || !isValidKsuidUnixSeconds(unixSeconds)) {
    generatedIds.value = []
    return
  }

  generatedAtUnixSeconds.value = unixSeconds

  const results: string[] = []
  for (let i = 0; i < normalizedCount; i += 1) {
    results.push(generateKsuid(unixSeconds))
  }
  generatedIds.value = results
}

const output = computed(() => generatedIds.value.join('\n'))

watch([count, timestampMode, customUnixSeconds], regenerate, { immediate: true })
</script>

<i18n lang="json">
{
  "en": {
    "timestampInvalid": "Invalid timestamp.",
    "timestampOutOfRange": "Timestamp must be between {min} and {max} (Unix seconds)."
  },
  "zh": {
    "timestampInvalid": "时间戳无效。",
    "timestampOutOfRange": "时间戳必须在 {min} 到 {max} 之间（Unix 秒）。"
  },
  "zh-CN": {
    "timestampInvalid": "时间戳无效。",
    "timestampOutOfRange": "时间戳必须在 {min} 到 {max} 之间（Unix 秒）。"
  },
  "zh-TW": {
    "timestampInvalid": "時間戳無效。",
    "timestampOutOfRange": "時間戳必須介於 {min} 與 {max}（Unix 秒）。"
  },
  "zh-HK": {
    "timestampInvalid": "時間戳無效。",
    "timestampOutOfRange": "時間戳必須介於 {min} 與 {max}（Unix 秒）。"
  },
  "es": {
    "timestampInvalid": "Marca de tiempo no válida.",
    "timestampOutOfRange": "La marca de tiempo debe estar entre {min} y {max} (segundos Unix)."
  },
  "fr": {
    "timestampInvalid": "Horodatage invalide.",
    "timestampOutOfRange": "L'horodatage doit être entre {min} et {max} (secondes Unix)."
  },
  "de": {
    "timestampInvalid": "Ungültiger Zeitstempel.",
    "timestampOutOfRange": "Zeitstempel muss zwischen {min} und {max} liegen (Unix-Sekunden)."
  },
  "it": {
    "timestampInvalid": "Timestamp non valido.",
    "timestampOutOfRange": "Il timestamp deve essere tra {min} e {max} (secondi Unix)."
  },
  "ja": {
    "timestampInvalid": "無効なタイムスタンプです。",
    "timestampOutOfRange": "タイムスタンプは {min} から {max}（Unix 秒）の間である必要があります。"
  },
  "ko": {
    "timestampInvalid": "잘못된 타임스탬프입니다.",
    "timestampOutOfRange": "타임스탬프는 {min}에서 {max} 사이여야 합니다(Unix 초)."
  },
  "ru": {
    "timestampInvalid": "Недействительная временная метка.",
    "timestampOutOfRange": "Временная метка должна быть между {min} и {max} (Unix-секунды)."
  },
  "pt": {
    "timestampInvalid": "Timestamp inválido.",
    "timestampOutOfRange": "O timestamp deve estar entre {min} e {max} (segundos Unix)."
  },
  "ar": {
    "timestampInvalid": "طابع زمني غير صالح.",
    "timestampOutOfRange": "يجب أن يكون الطابع الزمني بين {min} و {max} (ثواني Unix)."
  },
  "hi": {
    "timestampInvalid": "अमान्य टाइमस्टैम्प।",
    "timestampOutOfRange": "टाइमस्टैम्प {min} और {max} (Unix सेकंड) के बीच होना चाहिए।"
  },
  "tr": {
    "timestampInvalid": "Geçersiz zaman damgası.",
    "timestampOutOfRange": "Zaman damgası {min} ile {max} arasında olmalıdır (Unix saniye)."
  },
  "nl": {
    "timestampInvalid": "Ongeldige tijdstempel.",
    "timestampOutOfRange": "De tijdstempel moet tussen {min} en {max} liggen (Unix-seconden)."
  },
  "sv": {
    "timestampInvalid": "Ogiltig tidsstämpel.",
    "timestampOutOfRange": "Tidsstämpeln måste vara mellan {min} och {max} (Unix-sekunder)."
  },
  "pl": {
    "timestampInvalid": "Nieprawidłowy znacznik czasu.",
    "timestampOutOfRange": "Znacznik czasu musi być między {min} a {max} (sekundy Unix)."
  },
  "vi": {
    "timestampInvalid": "Dấu thời gian không hợp lệ.",
    "timestampOutOfRange": "Dấu thời gian phải nằm giữa {min} và {max} (giây Unix)."
  },
  "th": {
    "timestampInvalid": "เวลาไม่ถูกต้อง",
    "timestampOutOfRange": "เวลาต้องอยู่ระหว่าง {min} และ {max} (วินาที Unix)"
  },
  "id": {
    "timestampInvalid": "Stempel waktu tidak valid.",
    "timestampOutOfRange": "Stempel waktu harus antara {min} dan {max} (detik Unix)."
  },
  "he": {
    "timestampInvalid": "חותמת זמן לא תקינה.",
    "timestampOutOfRange": "חותמת הזמן חייבת להיות בין {min} ל-{max} (שניות Unix)."
  },
  "ms": {
    "timestampInvalid": "Cap masa tidak sah.",
    "timestampOutOfRange": "Cap masa mesti antara {min} dan {max} (saat Unix)."
  },
  "no": {
    "timestampInvalid": "Ugyldig tidsstempel.",
    "timestampOutOfRange": "Tidsstempelet må være mellom {min} og {max} (Unix-sekunder)."
  }
}
</i18n>
