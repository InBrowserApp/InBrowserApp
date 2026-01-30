<template>
  <RandomNumberGeneratorOptions
    v-model:min-value="minValue"
    v-model:max-value="maxValue"
    v-model:count="count"
    v-model:allow-repeat="allowRepeat"
    v-model:number-type="numberType"
    v-model:decimal-places="decimalPlaces"
    :input-step="inputStep"
    :input-precision="inputPrecision"
    :max-count="maxCount"
    :max-decimal-places="maxDecimalPlaces"
    :range-error="rangeError"
    :count-error="countError"
    @apply-preset="applyPreset"
  />
  <RandomNumberGeneratorResults
    :formatted-numbers="formattedNumbers"
    :output-text="outputText"
    :can-roll="canRoll"
    :is-rolling="isRolling"
    :rolling-label="rollingLabel"
    :rolling-icon="rollingIcon"
    @toggle-rolling="toggleRolling"
    @open-fullscreen="openFullscreen"
  />
  <RandomNumberGeneratorHistory :history-entries="historyEntries" @clear-history="clearHistory" />
  <RandomNumberGeneratorFullscreen
    v-if="isFullscreen"
    :formatted-numbers="formattedNumbers"
    :can-roll="canRoll"
    :is-rolling="isRolling"
    :rolling-label="rollingLabel"
    :rolling-icon="rollingIcon"
    @toggle-rolling="toggleRolling"
    @close="closeFullscreen"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import RandomNumberGeneratorFullscreen from './RandomNumberGeneratorFullscreen.vue'
import RandomNumberGeneratorHistory from './RandomNumberGeneratorHistory.vue'
import RandomNumberGeneratorOptions from './RandomNumberGeneratorOptions.vue'
import RandomNumberGeneratorResults from './RandomNumberGeneratorResults.vue'
import PlayIcon from '@vicons/fluent/Play16Regular'
import StopIcon from '@vicons/fluent/Stop16Regular'

const { t } = useI18n()

const maxCount = 100
const maxDecimalPlaces = 6
const maxHistoryItems = 20

type HistoryEntry = {
  id: string
  values: string[]
}

const minValue = useStorage<number | null>('tools:random-number-generator:min', 1)
const maxValue = useStorage<number | null>('tools:random-number-generator:max', 100)
const count = useStorage<number | null>('tools:random-number-generator:count', 1)
const allowRepeat = useStorage<boolean>('tools:random-number-generator:allow-repeat', true)
const numberType = useStorage<'integer' | 'decimal'>(
  'tools:random-number-generator:number-type',
  'integer',
)
const decimalPlaces = useStorage<number | null>('tools:random-number-generator:decimal-places', 2)
const historyEntries = useStorage<HistoryEntry[]>('tools:random-number-generator:history', [])

const normalizedCount = computed(() => normalizeCount(count.value))
const normalizedDecimalPlaces = computed(() => normalizeDecimalPlaces(decimalPlaces.value))

const inputPrecision = computed(() =>
  numberType.value === 'decimal' ? normalizedDecimalPlaces.value : 0,
)

const inputStep = computed(() => {
  if (numberType.value !== 'decimal') {
    return 1
  }
  const factor = Math.pow(10, normalizedDecimalPlaces.value)
  return 1 / factor
})

const rangeInfo = computed(() => {
  if (typeof minValue.value !== 'number' || Number.isNaN(minValue.value)) {
    return null
  }
  if (typeof maxValue.value !== 'number' || Number.isNaN(maxValue.value)) {
    return null
  }

  const min = minValue.value
  const max = maxValue.value
  const factor = numberType.value === 'decimal' ? Math.pow(10, normalizedDecimalPlaces.value) : 1
  const scaledMin = numberType.value === 'decimal' ? Math.ceil(min * factor) : Math.ceil(min)
  const scaledMax = numberType.value === 'decimal' ? Math.floor(max * factor) : Math.floor(max)
  const range = scaledMax - scaledMin + 1

  return {
    factor,
    scaledMin,
    scaledMax,
    range,
  }
})

const rangeError = computed(() => {
  if (!rangeInfo.value) return t('rangeError')
  if (rangeInfo.value.range <= 0) return t('rangeError')
  return ''
})

const countError = computed(() => {
  if (!rangeInfo.value) return ''
  if (!allowRepeat.value && normalizedCount.value > rangeInfo.value.range) {
    return t('countError', { range: rangeInfo.value.range })
  }
  return ''
})

const generatedNumbers = ref<number[]>([])

const formattedNumbers = computed(() =>
  generatedNumbers.value.map((value) => formatNumber(value, normalizedDecimalPlaces.value)),
)

const hasResults = computed(() => formattedNumbers.value.length > 0)
const outputText = computed(() => formattedNumbers.value.join('\n'))

const isFullscreen = ref(false)
const isRolling = ref(false)
const rollingIntervalMs = 80
let rollingRafId: number | null = null
let rollingLastTick = 0
let hasSkippedInitialHistory = false

const canRoll = computed(() => !rangeError.value && !countError.value)
const rollingLabel = computed(() => (isRolling.value ? t('stopRandom') : t('startRandom')))
const rollingIcon = computed(() => (isRolling.value ? StopIcon : PlayIcon))

function openFullscreen() {
  if (!hasResults.value) return
  isFullscreen.value = true
}

function closeFullscreen() {
  isFullscreen.value = false
}

function normalizeCount(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.min(Math.max(Math.floor(value), 1), maxCount)
}

function normalizeDecimalPlaces(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  return Math.min(Math.max(Math.floor(value), 0), maxDecimalPlaces)
}

function formatNumber(value: number, decimals: number) {
  const normalizedValue = Object.is(value, -0) ? 0 : value
  if (numberType.value === 'decimal') {
    return normalizedValue.toFixed(decimals)
  }
  return String(normalizedValue)
}

function buildHistorySnapshot() {
  return generatedNumbers.value.map((value) => formatNumber(value, normalizedDecimalPlaces.value))
}

function addHistoryEntry(values: string[]) {
  if (!values.length) return
  const signature = values.join('|')
  const latest = historyEntries.value[0]
  if (latest && latest.values.join('|') === signature) return
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    values: [...values],
  }
  historyEntries.value = [entry, ...historyEntries.value].slice(0, maxHistoryItems)
}

function clearHistory() {
  historyEntries.value = []
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateOnce() {
  const normalized = normalizeCount(count.value)
  if (count.value !== normalized) {
    count.value = normalized
  }

  const normalizedPlaces = normalizeDecimalPlaces(decimalPlaces.value)
  if (decimalPlaces.value !== normalizedPlaces) {
    decimalPlaces.value = normalizedPlaces
  }

  if (rangeError.value || countError.value || !rangeInfo.value) {
    generatedNumbers.value = []
    if (isRolling.value) {
      stopRolling()
    }
    return
  }

  const { factor, scaledMin, scaledMax } = rangeInfo.value
  const results: number[] = []

  if (allowRepeat.value) {
    for (let i = 0; i < normalized; i += 1) {
      results.push(randomInt(scaledMin, scaledMax) / factor)
    }
  } else {
    const used = new Set<number>()
    while (results.length < normalized) {
      const value = randomInt(scaledMin, scaledMax)
      if (used.has(value)) continue
      used.add(value)
      results.push(value / factor)
    }
  }

  generatedNumbers.value = results
}

function startRolling() {
  if (isRolling.value || !canRoll.value) return
  isRolling.value = true
  rollingLastTick = 0
  generateOnce()

  const tick = (timestamp: number) => {
    if (!isRolling.value) return
    if (!rollingLastTick) {
      rollingLastTick = timestamp
    } else if (timestamp - rollingLastTick >= rollingIntervalMs) {
      generateOnce()
      rollingLastTick = timestamp
    }
    rollingRafId = window.requestAnimationFrame(tick)
  }

  rollingRafId = window.requestAnimationFrame(tick)
}

function stopRolling() {
  if (!isRolling.value) return
  if (rollingRafId !== null) {
    window.cancelAnimationFrame(rollingRafId)
    rollingRafId = null
  }
  isRolling.value = false
  rollingLastTick = 0
  addHistoryEntry(buildHistorySnapshot())
}

function toggleRolling() {
  if (isRolling.value) {
    stopRolling()
  } else {
    startRolling()
  }
}

function applyPreset(preset: 'dice' | 'ten' | 'hundred' | 'lotto') {
  switch (preset) {
    case 'dice':
      minValue.value = 1
      maxValue.value = 6
      count.value = 1
      allowRepeat.value = true
      numberType.value = 'integer'
      break
    case 'ten':
      minValue.value = 1
      maxValue.value = 10
      count.value = 1
      allowRepeat.value = true
      numberType.value = 'integer'
      break
    case 'hundred':
      minValue.value = 1
      maxValue.value = 100
      count.value = 1
      allowRepeat.value = true
      numberType.value = 'integer'
      break
    case 'lotto':
      minValue.value = 1
      maxValue.value = 49
      count.value = 6
      allowRepeat.value = false
      numberType.value = 'integer'
      break
  }
}

watch([minValue, maxValue, count, allowRepeat, numberType, decimalPlaces], generateOnce, {
  immediate: true,
})

watch(generatedNumbers, () => {
  if (!hasSkippedInitialHistory) {
    hasSkippedInitialHistory = true
    return
  }
  if (isRolling.value) return
  addHistoryEntry(buildHistorySnapshot())
})

onBeforeUnmount(() => {
  stopRolling()
})
</script>

<i18n lang="json">
{
  "en": {
    "rangeError": "Min must be less than or equal to Max.",
    "countError": "Count exceeds the number of unique values in the range ({range}).",
    "startRandom": "Start random",
    "stopRandom": "Stop random"
  },
  "zh": {
    "rangeError": "最小值必须小于或等于最大值。",
    "countError": "数量超过了范围内唯一值的数量（{range}）。",
    "startRandom": "开始随机",
    "stopRandom": "结束随机"
  },
  "zh-CN": {
    "rangeError": "最小值必须小于或等于最大值。",
    "countError": "数量超过了范围内唯一值的数量（{range}）。",
    "startRandom": "开始随机",
    "stopRandom": "结束随机"
  },
  "zh-TW": {
    "rangeError": "最小值必須小於或等於最大值。",
    "countError": "數量超過範圍內唯一值的數量（{range}）。",
    "startRandom": "開始隨機",
    "stopRandom": "結束隨機"
  },
  "zh-HK": {
    "rangeError": "最小值必須小於或等於最大值。",
    "countError": "數量超過範圍內唯一值的數量（{range}）。",
    "startRandom": "開始隨機",
    "stopRandom": "結束隨機"
  },
  "es": {
    "rangeError": "El mínimo debe ser menor o igual que el máximo.",
    "countError": "La cantidad supera los valores únicos del rango ({range}).",
    "startRandom": "Iniciar aleatorio",
    "stopRandom": "Detener aleatorio"
  },
  "fr": {
    "rangeError": "Le minimum doit être inférieur ou égal au maximum.",
    "countError": "La quantité dépasse les valeurs uniques de la plage ({range}).",
    "startRandom": "Démarrer aléatoire",
    "stopRandom": "Arrêter aléatoire"
  },
  "de": {
    "rangeError": "Minimum muss kleiner oder gleich Maximum sein.",
    "countError": "Die Anzahl überschreitet die eindeutigen Werte im Bereich ({range}).",
    "startRandom": "Zufall starten",
    "stopRandom": "Zufall stoppen"
  },
  "it": {
    "rangeError": "Il minimo deve essere minore o uguale al massimo.",
    "countError": "La quantità supera i valori unici nell'intervallo ({range}).",
    "startRandom": "Avvia casuale",
    "stopRandom": "Ferma casuale"
  },
  "ja": {
    "rangeError": "最小値は最大値以下である必要があります。",
    "countError": "個数が範囲内のユニーク値数（{range}）を超えています。",
    "startRandom": "ランダム開始",
    "stopRandom": "ランダム停止"
  },
  "ko": {
    "rangeError": "최소값은 최대값보다 작거나 같아야 합니다.",
    "countError": "개수가 범위 내 고유 값 수({range})를 초과합니다.",
    "startRandom": "랜덤 시작",
    "stopRandom": "랜덤 중지"
  },
  "ru": {
    "rangeError": "Минимум должен быть меньше или равен максимуму.",
    "countError": "Количество превышает число уникальных значений в диапазоне ({range}).",
    "startRandom": "Начать случайно",
    "stopRandom": "Остановить случайно"
  },
  "pt": {
    "rangeError": "O mínimo deve ser menor ou igual ao máximo.",
    "countError": "A quantidade excede os valores únicos do intervalo ({range}).",
    "startRandom": "Iniciar aleatório",
    "stopRandom": "Parar aleatório"
  },
  "ar": {
    "rangeError": "يجب أن يكون الحد الأدنى أقل من أو يساوي الحد الأقصى.",
    "countError": "العدد يتجاوز القيم الفريدة ضمن النطاق ({range}).",
    "startRandom": "بدء عشوائي",
    "stopRandom": "إيقاف عشوائي"
  },
  "hi": {
    "rangeError": "न्यूनतम मान अधिकतम से कम या बराबर होना चाहिए।",
    "countError": "संख्या सीमा में अद्वितीय मानों ({range}) से अधिक है।",
    "startRandom": "रैंडम शुरू करें",
    "stopRandom": "रैंडम रोकें"
  },
  "tr": {
    "rangeError": "Minimum, maksimumdan küçük veya eşit olmalıdır.",
    "countError": "Adet, aralıktaki benzersiz değerleri aşıyor ({range}).",
    "startRandom": "Rastgele başlat",
    "stopRandom": "Rastgele durdur"
  },
  "nl": {
    "rangeError": "Minimum moet kleiner dan of gelijk zijn aan maximum.",
    "countError": "Aantal overschrijdt het aantal unieke waarden in het bereik ({range}).",
    "startRandom": "Willekeurig starten",
    "stopRandom": "Willekeurig stoppen"
  },
  "sv": {
    "rangeError": "Min måste vara mindre än eller lika med max.",
    "countError": "Antalet överskrider unika värden i intervallet ({range}).",
    "startRandom": "Starta slump",
    "stopRandom": "Stoppa slump"
  },
  "pl": {
    "rangeError": "Minimum musi być mniejsze lub równe maksimum.",
    "countError": "Liczba przekracza unikalne wartości w zakresie ({range}).",
    "startRandom": "Uruchom losowo",
    "stopRandom": "Zatrzymaj losowo"
  },
  "vi": {
    "rangeError": "Giá trị tối thiểu phải nhỏ hơn hoặc bằng giá trị tối đa.",
    "countError": "Số lượng vượt quá số giá trị duy nhất trong phạm vi ({range}).",
    "startRandom": "Bắt đầu ngẫu nhiên",
    "stopRandom": "Dừng ngẫu nhiên"
  },
  "th": {
    "rangeError": "ค่าต่ำสุดต้องน้อยกว่าหรือเท่ากับค่าสูงสุด",
    "countError": "จำนวนเกินค่าที่ไม่ซ้ำในช่วง ({range})",
    "startRandom": "เริ่มสุ่ม",
    "stopRandom": "หยุดสุ่ม"
  },
  "id": {
    "rangeError": "Minimum harus kurang dari atau sama dengan maksimum.",
    "countError": "Jumlah melebihi nilai unik dalam rentang ({range}).",
    "startRandom": "Mulai acak",
    "stopRandom": "Hentikan acak"
  },
  "he": {
    "rangeError": "המינימום חייב להיות קטן או שווה למקסימום.",
    "countError": "הכמות חורגת ממספר הערכים הייחודיים בטווח ({range}).",
    "startRandom": "התחל אקראי",
    "stopRandom": "עצור אקראי"
  },
  "ms": {
    "rangeError": "Minimum mesti kurang atau sama dengan maksimum.",
    "countError": "Jumlah melebihi nilai unik dalam julat ({range}).",
    "startRandom": "Mula rawak",
    "stopRandom": "Henti rawak"
  },
  "no": {
    "rangeError": "Minimum må være mindre enn eller lik maksimum.",
    "countError": "Antallet overstiger unike verdier i området ({range}).",
    "startRandom": "Start tilfeldig",
    "stopRandom": "Stopp tilfeldig"
  }
}
</i18n>
