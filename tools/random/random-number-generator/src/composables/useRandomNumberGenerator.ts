import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import PlayIcon from '@vicons/fluent/Play16Regular'
import StopIcon from '@vicons/fluent/Stop16Regular'

type NumberType = 'integer' | 'decimal'

type HistoryEntry = {
  id: string
  values: string[]
}

const MAX_COUNT = 100
const MAX_DECIMAL_PLACES = 6
const MAX_HISTORY_ITEMS = 20

type RandomNumberMessages = {
  rangeError: () => string
  countError: (range: number) => string
  startRandom: () => string
  stopRandom: () => string
}

export function useRandomNumberGenerator(messages: RandomNumberMessages) {
  const minValue = useStorage<number | null>('tools:random-number-generator:min', 1)
  const maxValue = useStorage<number | null>('tools:random-number-generator:max', 100)
  const count = useStorage<number | null>('tools:random-number-generator:count', 1)
  const allowRepeat = useStorage<boolean>('tools:random-number-generator:allow-repeat', true)
  const numberType = useStorage<NumberType>('tools:random-number-generator:number-type', 'integer')
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
    if (!rangeInfo.value) return messages.rangeError()
    if (rangeInfo.value.range <= 0) return messages.rangeError()
    return ''
  })

  const countError = computed(() => {
    if (!rangeInfo.value) return ''
    if (!allowRepeat.value && normalizedCount.value > rangeInfo.value.range) {
      return messages.countError(rangeInfo.value.range)
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
  const rollingLabel = computed(() =>
    isRolling.value ? messages.stopRandom() : messages.startRandom(),
  )
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
    return Math.min(Math.max(Math.floor(value), 1), MAX_COUNT)
  }

  function normalizeDecimalPlaces(value: number | null | undefined): number {
    if (typeof value !== 'number' || Number.isNaN(value)) return 0
    return Math.min(Math.max(Math.floor(value), 0), MAX_DECIMAL_PLACES)
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
    historyEntries.value = [entry, ...historyEntries.value].slice(0, MAX_HISTORY_ITEMS)
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

  return {
    minValue,
    maxValue,
    count,
    allowRepeat,
    numberType,
    decimalPlaces,
    historyEntries,
    inputStep,
    inputPrecision,
    maxCount: MAX_COUNT,
    maxDecimalPlaces: MAX_DECIMAL_PLACES,
    rangeError,
    countError,
    formattedNumbers,
    outputText,
    isFullscreen,
    openFullscreen,
    closeFullscreen,
    canRoll,
    isRolling,
    rollingLabel,
    rollingIcon,
    toggleRolling,
    clearHistory,
    applyPreset,
  }
}
