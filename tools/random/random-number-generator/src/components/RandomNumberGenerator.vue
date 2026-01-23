<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="16">
      <n-flex align="center" :size="12" wrap>
        <n-text depth="3">{{ t('presets') }}</n-text>
        <n-button size="small" @click="applyPreset('dice')" data-testid="preset-dice">
          {{ t('presetDice') }}
        </n-button>
        <n-button size="small" @click="applyPreset('ten')" data-testid="preset-ten">
          {{ t('presetTen') }}
        </n-button>
        <n-button size="small" @click="applyPreset('hundred')" data-testid="preset-hundred">
          {{ t('presetHundred') }}
        </n-button>
        <n-button size="small" @click="applyPreset('lotto')" data-testid="preset-lotto">
          {{ t('presetLotto') }}
        </n-button>
      </n-flex>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('min')" :show-feedback="false">
          <n-input-number
            v-model:value="minValue"
            :step="inputStep"
            :precision="inputPrecision"
            style="width: 100%"
            data-testid="min-input"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('max')" :show-feedback="false">
          <n-input-number
            v-model:value="maxValue"
            :step="inputStep"
            :precision="inputPrecision"
            style="width: 100%"
            data-testid="max-input"
          />
        </n-form-item-gi>
      </n-grid>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('count')" :show-feedback="false">
          <n-input-number
            v-model:value="count"
            :min="1"
            :max="maxCount"
            :step="1"
            style="width: 100%"
            data-testid="count-input"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('allowRepeat')" :show-feedback="false">
          <n-switch v-model:value="allowRepeat" data-testid="allow-repeat" />
        </n-form-item-gi>
      </n-grid>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('numberType')" :show-feedback="false">
          <n-radio-group v-model:value="numberType" data-testid="number-type">
            <n-radio-button value="integer">{{ t('integer') }}</n-radio-button>
            <n-radio-button value="decimal">{{ t('decimal') }}</n-radio-button>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi
          v-if="numberType === 'decimal'"
          :label="t('decimalPlaces')"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="decimalPlaces"
            :min="0"
            :max="maxDecimalPlaces"
            :step="1"
            style="width: 100%"
            data-testid="decimal-places"
          />
        </n-form-item-gi>
      </n-grid>

      <n-alert v-if="rangeError" type="error">
        {{ rangeError }}
      </n-alert>
      <n-alert v-else-if="countError" type="error">
        {{ countError }}
      </n-alert>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-card
        embedded
        :content-style="{ padding: '12px 16px' }"
        data-testid="results-card"
        class="results-card"
        :class="{ 'is-clickable': hasResults }"
        @click="openFullscreen"
      >
        <div class="results-display">
          <div v-if="formattedNumbers.length === 1" class="hero-number" data-testid="hero-number">
            {{ formattedNumbers[0] }}
          </div>
          <n-flex v-else-if="formattedNumbers.length" wrap :size="16" class="results-tags">
            <n-tag v-for="(value, index) in formattedNumbers" :key="`${value}-${index}`" round>
              {{ value }}
            </n-tag>
          </n-flex>
          <n-text v-else depth="3">{{ t('placeholder') }}</n-text>
        </div>
      </n-card>

      <n-flex :size="12">
        <RegenerateButton
          :disabled="!canRoll && !isRolling"
          @click="toggleRolling"
          data-testid="regenerate"
        >
          <template #icon>
            <n-icon :component="rollingIcon" />
          </template>
          <template #label>
            {{ rollingLabel }}
          </template>
        </RegenerateButton>
        <CopyToClipboardButton :content="outputText" />
        <n-button
          text
          tag="a"
          :href="outputText ? downloadUrl : undefined"
          :download="downloadName"
          :disabled="!outputText"
          data-testid="download-results"
        >
          <template #icon>
            <n-icon :component="DownloadIcon" />
          </template>
          {{ t('download') }}
        </n-button>
        <n-button
          text
          :disabled="!hasResults"
          @click="openFullscreen"
          data-testid="enter-fullscreen"
        >
          <template #icon>
            <n-icon :component="EnterFullscreenIcon" />
          </template>
          {{ t('enterFullscreen') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('history') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="end">
        <n-button
          text
          size="small"
          :disabled="!hasHistory"
          @click="clearHistory"
          data-testid="clear-history"
        >
          {{ t('clearHistory') }}
        </n-button>
      </n-flex>

      <n-card v-if="!hasHistory" embedded :content-style="{ padding: '12px 16px' }">
        <n-text depth="3">{{ t('historyEmpty') }}</n-text>
      </n-card>

      <n-flex v-else vertical :size="12" class="history-list">
        <n-card
          v-for="entry in historyEntries"
          :key="entry.id"
          embedded
          :content-style="{ padding: '10px 14px' }"
          class="history-card"
        >
          <n-flex wrap :size="12" class="history-tags">
            <n-tag v-for="(value, index) in entry.values" :key="`${entry.id}-${index}`" round>
              {{ value }}
            </n-tag>
          </n-flex>
        </n-card>
      </n-flex>
    </n-flex>
  </ToolSection>

  <div
    v-if="isFullscreen"
    class="fullscreen-overlay"
    data-testid="fullscreen-overlay"
    @click.self="closeFullscreen"
  >
    <div class="fullscreen-content">
      <div v-if="formattedNumbers.length === 1" class="fullscreen-number">
        {{ formattedNumbers[0] }}
      </div>
      <n-flex v-else-if="formattedNumbers.length" wrap :size="20" class="fullscreen-tags">
        <n-tag v-for="(value, index) in formattedNumbers" :key="`${value}-${index}`" round>
          {{ value }}
        </n-tag>
      </n-flex>
    </div>
    <n-flex class="fullscreen-actions" align="center" :size="12">
      <RegenerateButton
        :disabled="!canRoll && !isRolling"
        @click="toggleRolling"
        data-testid="fullscreen-regenerate"
      >
        <template #icon>
          <n-icon :component="rollingIcon" />
        </template>
        <template #label>
          {{ rollingLabel }}
        </template>
      </RegenerateButton>
      <n-button text @click="closeFullscreen" data-testid="exit-fullscreen">
        <template #icon>
          <n-icon :component="ExitFullscreenIcon" />
        </template>
        {{ t('exitFullscreen') }}
      </n-button>
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NCard,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInputNumber,
  NRadioButton,
  NRadioGroup,
  NSwitch,
  NTag,
  NText,
  useThemeVars,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import DownloadIcon from '@vicons/fluent/ArrowDownload16Regular'
import EnterFullscreenIcon from '@vicons/fluent/FullScreenMaximize16Regular'
import ExitFullscreenIcon from '@vicons/fluent/FullScreenMinimize24Regular'
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
const hasHistory = computed(() => historyEntries.value.length > 0)
const outputText = computed(() => formattedNumbers.value.join('\n'))

const downloadName = 'random-numbers.txt'
const downloadBlob = computed(() => (outputText.value ? new Blob([outputText.value]) : null))
const downloadUrl = useObjectUrl(downloadBlob)
const themeVars = useThemeVars()
const isFullscreen = ref(false)
const isRolling = ref(false)
const rollingIntervalMs = 80
let rollingTimer: number | null = null
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
  return generatedNumbers.value.map((value) =>
    formatNumber(value, normalizedDecimalPlaces.value),
  )
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
  rollingTimer = window.setInterval(generateOnce, rollingIntervalMs)
  generateOnce()
}

function stopRolling() {
  if (!isRolling.value) return
  if (rollingTimer !== null) {
    window.clearInterval(rollingTimer)
    rollingTimer = null
  }
  isRolling.value = false
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

<style scoped>
.results-card {
  cursor: default;
}

.results-card.is-clickable {
  cursor: pointer;
}

.results-display {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  text-align: center;
  width: 100%;
}

.results-tags {
  justify-content: center;
  width: 100%;
  align-items: center;
}

.results-tags :deep(.n-tag) {
  height: auto;
  min-height: 2.8rem;
  min-width: 3.4ch;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.results-tags :deep(.n-tag__content) {
  font-size: clamp(1.4rem, 3.8vw, 2.6rem);
  font-weight: 600;
  line-height: 1;
  padding: 12px 20px;
  text-align: center;
}

.hero-number {
  font-size: clamp(2.75rem, 8vw, 4.75rem);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.history-list {
  width: 100%;
}

.history-card {
  width: 100%;
}

.history-tags {
  align-items: center;
  justify-content: flex-start;
}

.history-tags :deep(.n-tag) {
  height: auto;
  min-height: 2.2rem;
  min-width: 2.8ch;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.history-tags :deep(.n-tag__content) {
  font-size: clamp(1rem, 2.6vw, 1.6rem);
  font-weight: 600;
  line-height: 1;
  padding: 8px 12px;
  text-align: center;
}

.fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: v-bind('themeVars.bodyColor');
  color: v-bind('themeVars.textColorBase');
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: auto;
}

.fullscreen-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: min(1200px, 100%);
}

.fullscreen-number {
  font-size: clamp(3rem, 14vw, 7rem);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
}

.fullscreen-tags {
  justify-content: center;
  align-items: center;
  width: 100%;
}

.fullscreen-tags :deep(.n-tag) {
  height: auto;
  min-height: 3.4rem;
  min-width: 4ch;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-tags :deep(.n-tag__content) {
  font-size: clamp(2.6rem, 8.5vw, 5rem);
  font-weight: 600;
  line-height: 1;
  padding: 18px 28px;
  text-align: center;
}

.fullscreen-actions {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1;
}

.fullscreen-actions :deep(button) {
  font-size: 1.05rem;
}
</style>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "presets": "Presets",
    "presetDice": "Dice (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Pick 6 (1-49)",
    "min": "Min",
    "max": "Max",
    "count": "Count",
    "allowRepeat": "Allow duplicates",
    "numberType": "Number Type",
    "integer": "Integer",
    "decimal": "Decimal",
    "decimalPlaces": "Decimal Places",
    "results": "Results",
    "placeholder": "Numbers will appear here...",
    "download": "Download",
    "rangeError": "Min must be less than or equal to Max.",
    "countError": "Count exceeds the number of unique values in the range ({range}).",
    "enterFullscreen": "Full screen",
    "exitFullscreen": "Exit full screen",
    "startRandom": "Start random",
    "stopRandom": "Stop random",
    "history": "History",
    "historyEmpty": "No history yet.",
    "clearHistory": "Clear history"
  },
  "zh": {
    "options": "选项",
    "presets": "预设",
    "presetDice": "骰子（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "选 6（1-49）",
    "min": "最小值",
    "max": "最大值",
    "count": "数量",
    "allowRepeat": "允许重复",
    "numberType": "数字类型",
    "integer": "整数",
    "decimal": "小数",
    "decimalPlaces": "小数位数",
    "results": "结果",
    "placeholder": "数字会显示在这里...",
    "download": "下载",
    "rangeError": "最小值必须小于或等于最大值。",
    "countError": "数量超过了范围内唯一值的数量（{range}）。",
    "enterFullscreen": "全屏",
    "exitFullscreen": "退出全屏",
    "startRandom": "开始随机",
    "stopRandom": "结束随机",
    "history": "历史记录",
    "historyEmpty": "暂无历史记录。",
    "clearHistory": "清空历史"
  },
  "zh-CN": {
    "options": "选项",
    "presets": "预设",
    "presetDice": "骰子（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "选 6（1-49）",
    "min": "最小值",
    "max": "最大值",
    "count": "数量",
    "allowRepeat": "允许重复",
    "numberType": "数字类型",
    "integer": "整数",
    "decimal": "小数",
    "decimalPlaces": "小数位数",
    "results": "结果",
    "placeholder": "数字会显示在这里...",
    "download": "下载",
    "rangeError": "最小值必须小于或等于最大值。",
    "countError": "数量超过了范围内唯一值的数量（{range}）。",
    "enterFullscreen": "全屏",
    "exitFullscreen": "退出全屏",
    "startRandom": "开始随机",
    "stopRandom": "结束随机",
    "history": "历史记录",
    "historyEmpty": "暂无历史记录。",
    "clearHistory": "清空历史"
  },
  "zh-TW": {
    "options": "選項",
    "presets": "預設",
    "presetDice": "骰子（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "選 6（1-49）",
    "min": "最小值",
    "max": "最大值",
    "count": "數量",
    "allowRepeat": "允許重複",
    "numberType": "數字類型",
    "integer": "整數",
    "decimal": "小數",
    "decimalPlaces": "小數位數",
    "results": "結果",
    "placeholder": "數字會顯示在這裡...",
    "download": "下載",
    "rangeError": "最小值必須小於或等於最大值。",
    "countError": "數量超過範圍內唯一值的數量（{range}）。",
    "enterFullscreen": "全螢幕",
    "exitFullscreen": "退出全螢幕",
    "startRandom": "開始隨機",
    "stopRandom": "結束隨機",
    "history": "歷史記錄",
    "historyEmpty": "尚無歷史記錄。",
    "clearHistory": "清空歷史"
  },
  "zh-HK": {
    "options": "選項",
    "presets": "預設",
    "presetDice": "骰子（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "選 6（1-49）",
    "min": "最小值",
    "max": "最大值",
    "count": "數量",
    "allowRepeat": "允許重複",
    "numberType": "數字類型",
    "integer": "整數",
    "decimal": "小數",
    "decimalPlaces": "小數位數",
    "results": "結果",
    "placeholder": "數字會顯示在這裡...",
    "download": "下載",
    "rangeError": "最小值必須小於或等於最大值。",
    "countError": "數量超過範圍內唯一值的數量（{range}）。",
    "enterFullscreen": "全螢幕",
    "exitFullscreen": "退出全螢幕",
    "startRandom": "開始隨機",
    "stopRandom": "結束隨機",
    "history": "歷史記錄",
    "historyEmpty": "尚無歷史記錄。",
    "clearHistory": "清空歷史"
  },
  "es": {
    "options": "Opciones",
    "presets": "Preajustes",
    "presetDice": "Dado (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Elige 6 (1-49)",
    "min": "Mínimo",
    "max": "Máximo",
    "count": "Cantidad",
    "allowRepeat": "Permitir repetidos",
    "numberType": "Tipo de número",
    "integer": "Entero",
    "decimal": "Decimal",
    "decimalPlaces": "Decimales",
    "results": "Resultados",
    "placeholder": "Los números aparecerán aquí...",
    "download": "Descargar",
    "rangeError": "El mínimo debe ser menor o igual que el máximo.",
    "countError": "La cantidad supera los valores únicos del rango ({range}).",
    "enterFullscreen": "Pantalla completa",
    "exitFullscreen": "Salir de pantalla completa",
    "startRandom": "Iniciar aleatorio",
    "stopRandom": "Detener aleatorio",
    "history": "Historial",
    "historyEmpty": "Aún no hay historial.",
    "clearHistory": "Borrar historial"
  },
  "fr": {
    "options": "Options",
    "presets": "Préréglages",
    "presetDice": "Dé (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Choisir 6 (1-49)",
    "min": "Min",
    "max": "Max",
    "count": "Quantité",
    "allowRepeat": "Autoriser les doublons",
    "numberType": "Type de nombre",
    "integer": "Entier",
    "decimal": "Décimal",
    "decimalPlaces": "Décimales",
    "results": "Résultats",
    "placeholder": "Les nombres apparaîtront ici...",
    "download": "Télécharger",
    "rangeError": "Le minimum doit être inférieur ou égal au maximum.",
    "countError": "La quantité dépasse les valeurs uniques de la plage ({range}).",
    "enterFullscreen": "Plein écran",
    "exitFullscreen": "Quitter le plein écran",
    "startRandom": "Démarrer aléatoire",
    "stopRandom": "Arrêter aléatoire",
    "history": "Historique",
    "historyEmpty": "Aucun historique pour le moment.",
    "clearHistory": "Effacer l'historique"
  },
  "de": {
    "options": "Optionen",
    "presets": "Voreinstellungen",
    "presetDice": "Würfel (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6 ziehen (1-49)",
    "min": "Minimum",
    "max": "Maximum",
    "count": "Anzahl",
    "allowRepeat": "Wiederholungen erlauben",
    "numberType": "Zahlentyp",
    "integer": "Ganzzahl",
    "decimal": "Dezimal",
    "decimalPlaces": "Dezimalstellen",
    "results": "Ergebnisse",
    "placeholder": "Zahlen erscheinen hier...",
    "download": "Herunterladen",
    "rangeError": "Minimum muss kleiner oder gleich Maximum sein.",
    "countError": "Die Anzahl überschreitet die eindeutigen Werte im Bereich ({range}).",
    "enterFullscreen": "Vollbild",
    "exitFullscreen": "Vollbild verlassen",
    "startRandom": "Zufall starten",
    "stopRandom": "Zufall stoppen",
    "history": "Verlauf",
    "historyEmpty": "Noch kein Verlauf.",
    "clearHistory": "Verlauf löschen"
  },
  "it": {
    "options": "Opzioni",
    "presets": "Preset",
    "presetDice": "Dado (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Scegli 6 (1-49)",
    "min": "Min",
    "max": "Max",
    "count": "Quantità",
    "allowRepeat": "Consenti duplicati",
    "numberType": "Tipo di numero",
    "integer": "Intero",
    "decimal": "Decimale",
    "decimalPlaces": "Cifre decimali",
    "results": "Risultati",
    "placeholder": "I numeri appariranno qui...",
    "download": "Scarica",
    "rangeError": "Il minimo deve essere minore o uguale al massimo.",
    "countError": "La quantità supera i valori unici nell'intervallo ({range}).",
    "enterFullscreen": "Schermo intero",
    "exitFullscreen": "Esci da schermo intero",
    "startRandom": "Avvia casuale",
    "stopRandom": "Ferma casuale",
    "history": "Cronologia",
    "historyEmpty": "Nessuna cronologia.",
    "clearHistory": "Cancella cronologia"
  },
  "ja": {
    "options": "オプション",
    "presets": "プリセット",
    "presetDice": "サイコロ（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6つ選ぶ（1-49）",
    "min": "最小",
    "max": "最大",
    "count": "個数",
    "allowRepeat": "重複を許可",
    "numberType": "数値タイプ",
    "integer": "整数",
    "decimal": "小数",
    "decimalPlaces": "小数点以下",
    "results": "結果",
    "placeholder": "数値はここに表示されます...",
    "download": "ダウンロード",
    "rangeError": "最小値は最大値以下である必要があります。",
    "countError": "個数が範囲内のユニーク値数（{range}）を超えています。",
    "enterFullscreen": "全画面",
    "exitFullscreen": "全画面を終了",
    "startRandom": "ランダム開始",
    "stopRandom": "ランダム停止",
    "history": "履歴",
    "historyEmpty": "履歴はまだありません。",
    "clearHistory": "履歴をクリア"
  },
  "ko": {
    "options": "옵션",
    "presets": "프리셋",
    "presetDice": "주사위(1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6개 선택(1-49)",
    "min": "최소",
    "max": "최대",
    "count": "개수",
    "allowRepeat": "중복 허용",
    "numberType": "숫자 유형",
    "integer": "정수",
    "decimal": "소수",
    "decimalPlaces": "소수 자릿수",
    "results": "결과",
    "placeholder": "숫자가 여기에 표시됩니다...",
    "download": "다운로드",
    "rangeError": "최소값은 최대값보다 작거나 같아야 합니다.",
    "countError": "개수가 범위 내 고유 값 수({range})를 초과합니다.",
    "enterFullscreen": "전체 화면",
    "exitFullscreen": "전체 화면 종료",
    "startRandom": "랜덤 시작",
    "stopRandom": "랜덤 중지",
    "history": "기록",
    "historyEmpty": "기록이 아직 없습니다.",
    "clearHistory": "기록 지우기"
  },
  "ru": {
    "options": "Параметры",
    "presets": "Пресеты",
    "presetDice": "Кубик (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Выбрать 6 (1-49)",
    "min": "Мин",
    "max": "Макс",
    "count": "Количество",
    "allowRepeat": "Разрешить повторы",
    "numberType": "Тип числа",
    "integer": "Целое",
    "decimal": "Десятичное",
    "decimalPlaces": "Знаков после запятой",
    "results": "Результаты",
    "placeholder": "Числа появятся здесь...",
    "download": "Скачать",
    "rangeError": "Минимум должен быть меньше или равен максимуму.",
    "countError": "Количество превышает число уникальных значений в диапазоне ({range}).",
    "enterFullscreen": "Полный экран",
    "exitFullscreen": "Выйти из полноэкранного режима",
    "startRandom": "Начать случайно",
    "stopRandom": "Остановить случайно",
    "history": "История",
    "historyEmpty": "Истории пока нет.",
    "clearHistory": "Очистить историю"
  },
  "pt": {
    "options": "Opções",
    "presets": "Predefinições",
    "presetDice": "Dado (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Escolher 6 (1-49)",
    "min": "Mínimo",
    "max": "Máximo",
    "count": "Quantidade",
    "allowRepeat": "Permitir repetidos",
    "numberType": "Tipo de número",
    "integer": "Inteiro",
    "decimal": "Decimal",
    "decimalPlaces": "Casas decimais",
    "results": "Resultados",
    "placeholder": "Os números aparecerão aqui...",
    "download": "Baixar",
    "rangeError": "O mínimo deve ser menor ou igual ao máximo.",
    "countError": "A quantidade excede os valores únicos do intervalo ({range}).",
    "enterFullscreen": "Tela cheia",
    "exitFullscreen": "Sair do modo tela cheia",
    "startRandom": "Iniciar aleatório",
    "stopRandom": "Parar aleatório",
    "history": "Histórico",
    "historyEmpty": "Ainda não há histórico.",
    "clearHistory": "Limpar histórico"
  },
  "ar": {
    "options": "الخيارات",
    "presets": "إعدادات مسبقة",
    "presetDice": "نرد (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "اختر 6 (1-49)",
    "min": "الحد الأدنى",
    "max": "الحد الأقصى",
    "count": "العدد",
    "allowRepeat": "السماح بالتكرار",
    "numberType": "نوع الرقم",
    "integer": "عدد صحيح",
    "decimal": "عشري",
    "decimalPlaces": "خانات عشرية",
    "results": "النتائج",
    "placeholder": "ستظهر الأرقام هنا...",
    "download": "تنزيل",
    "rangeError": "يجب أن يكون الحد الأدنى أقل من أو يساوي الحد الأقصى.",
    "countError": "العدد يتجاوز القيم الفريدة ضمن النطاق ({range}).",
    "enterFullscreen": "ملء الشاشة",
    "exitFullscreen": "الخروج من ملء الشاشة",
    "startRandom": "بدء عشوائي",
    "stopRandom": "إيقاف عشوائي",
    "history": "السجل",
    "historyEmpty": "لا يوجد سجل بعد.",
    "clearHistory": "مسح السجل"
  },
  "hi": {
    "options": "विकल्प",
    "presets": "प्रीसेट",
    "presetDice": "पासा (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6 चुनें (1-49)",
    "min": "न्यूनतम",
    "max": "अधिकतम",
    "count": "संख्या",
    "allowRepeat": "दोहराव की अनुमति",
    "numberType": "संख्या प्रकार",
    "integer": "पूर्णांक",
    "decimal": "दशमलव",
    "decimalPlaces": "दशमलव स्थान",
    "results": "परिणाम",
    "placeholder": "संख्याएँ यहाँ दिखाई देंगी...",
    "download": "डाउनलोड",
    "rangeError": "न्यूनतम मान अधिकतम से कम या बराबर होना चाहिए।",
    "countError": "संख्या सीमा में अद्वितीय मानों ({range}) से अधिक है।",
    "enterFullscreen": "पूर्ण स्क्रीन",
    "exitFullscreen": "पूर्ण स्क्रीन से बाहर निकलें",
    "startRandom": "रैंडम शुरू करें",
    "stopRandom": "रैंडम रोकें",
    "history": "इतिहास",
    "historyEmpty": "अभी कोई इतिहास नहीं है।",
    "clearHistory": "इतिहास साफ करें"
  },
  "tr": {
    "options": "Seçenekler",
    "presets": "Ön ayarlar",
    "presetDice": "Zar (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6 seç (1-49)",
    "min": "Minimum",
    "max": "Maksimum",
    "count": "Adet",
    "allowRepeat": "Tekrara izin ver",
    "numberType": "Sayı türü",
    "integer": "Tam sayı",
    "decimal": "Ondalık",
    "decimalPlaces": "Ondalık basamak",
    "results": "Sonuçlar",
    "placeholder": "Sayılar burada görünecek...",
    "download": "İndir",
    "rangeError": "Minimum, maksimumdan küçük veya eşit olmalıdır.",
    "countError": "Adet, aralıktaki benzersiz değerleri aşıyor ({range}).",
    "enterFullscreen": "Tam ekran",
    "exitFullscreen": "Tam ekrandan çık",
    "startRandom": "Rastgele başlat",
    "stopRandom": "Rastgele durdur",
    "history": "Geçmiş",
    "historyEmpty": "Henüz geçmiş yok.",
    "clearHistory": "Geçmişi temizle"
  },
  "nl": {
    "options": "Opties",
    "presets": "Voorinstellingen",
    "presetDice": "Dobbelsteen (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Kies 6 (1-49)",
    "min": "Minimum",
    "max": "Maximum",
    "count": "Aantal",
    "allowRepeat": "Duplicaten toestaan",
    "numberType": "Getaltype",
    "integer": "Geheel",
    "decimal": "Decimaal",
    "decimalPlaces": "Decimalen",
    "results": "Resultaten",
    "placeholder": "Getallen verschijnen hier...",
    "download": "Downloaden",
    "rangeError": "Minimum moet kleiner dan of gelijk zijn aan maximum.",
    "countError": "Aantal overschrijdt het aantal unieke waarden in het bereik ({range}).",
    "enterFullscreen": "Volledig scherm",
    "exitFullscreen": "Volledig scherm verlaten",
    "startRandom": "Willekeurig starten",
    "stopRandom": "Willekeurig stoppen",
    "history": "Geschiedenis",
    "historyEmpty": "Nog geen geschiedenis.",
    "clearHistory": "Geschiedenis wissen"
  },
  "sv": {
    "options": "Alternativ",
    "presets": "Förinställningar",
    "presetDice": "Tärning (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Välj 6 (1-49)",
    "min": "Min",
    "max": "Max",
    "count": "Antal",
    "allowRepeat": "Tillåt dubbletter",
    "numberType": "Taltyp",
    "integer": "Heltal",
    "decimal": "Decimal",
    "decimalPlaces": "Decimaler",
    "results": "Resultat",
    "placeholder": "Tal visas här...",
    "download": "Ladda ner",
    "rangeError": "Min måste vara mindre än eller lika med max.",
    "countError": "Antalet överskrider unika värden i intervallet ({range}).",
    "enterFullscreen": "Fullskärm",
    "exitFullscreen": "Avsluta fullskärm",
    "startRandom": "Starta slump",
    "stopRandom": "Stoppa slump",
    "history": "Historik",
    "historyEmpty": "Ingen historik ännu.",
    "clearHistory": "Rensa historik"
  },
  "pl": {
    "options": "Opcje",
    "presets": "Ustawienia",
    "presetDice": "Kostka (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Wybierz 6 (1-49)",
    "min": "Min",
    "max": "Max",
    "count": "Liczba",
    "allowRepeat": "Zezwalaj na powtórzenia",
    "numberType": "Typ liczby",
    "integer": "Całkowita",
    "decimal": "Dziesiętna",
    "decimalPlaces": "Miejsca dziesiętne",
    "results": "Wyniki",
    "placeholder": "Liczby pojawią się tutaj...",
    "download": "Pobierz",
    "rangeError": "Minimum musi być mniejsze lub równe maksimum.",
    "countError": "Liczba przekracza unikalne wartości w zakresie ({range}).",
    "enterFullscreen": "Pełny ekran",
    "exitFullscreen": "Wyjdź z pełnego ekranu",
    "startRandom": "Uruchom losowo",
    "stopRandom": "Zatrzymaj losowo",
    "history": "Historia",
    "historyEmpty": "Brak historii.",
    "clearHistory": "Wyczyść historię"
  },
  "vi": {
    "options": "Tùy chọn",
    "presets": "Mẫu",
    "presetDice": "Xúc xắc (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Chọn 6 (1-49)",
    "min": "Tối thiểu",
    "max": "Tối đa",
    "count": "Số lượng",
    "allowRepeat": "Cho phép trùng lặp",
    "numberType": "Loại số",
    "integer": "Số nguyên",
    "decimal": "Số thập phân",
    "decimalPlaces": "Chữ số thập phân",
    "results": "Kết quả",
    "placeholder": "Các số sẽ hiển thị ở đây...",
    "download": "Tải xuống",
    "rangeError": "Giá trị tối thiểu phải nhỏ hơn hoặc bằng giá trị tối đa.",
    "countError": "Số lượng vượt quá số giá trị duy nhất trong phạm vi ({range}).",
    "enterFullscreen": "Toàn màn hình",
    "exitFullscreen": "Thoát toàn màn hình",
    "startRandom": "Bắt đầu ngẫu nhiên",
    "stopRandom": "Dừng ngẫu nhiên",
    "history": "Lịch sử",
    "historyEmpty": "Chưa có lịch sử.",
    "clearHistory": "Xóa lịch sử"
  },
  "th": {
    "options": "ตัวเลือก",
    "presets": "พรีเซ็ต",
    "presetDice": "ลูกเต๋า (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "เลือก 6 (1-49)",
    "min": "ต่ำสุด",
    "max": "สูงสุด",
    "count": "จำนวน",
    "allowRepeat": "อนุญาตซ้ำ",
    "numberType": "ชนิดตัวเลข",
    "integer": "จำนวนเต็ม",
    "decimal": "ทศนิยม",
    "decimalPlaces": "ตำแหน่งทศนิยม",
    "results": "ผลลัพธ์",
    "placeholder": "ตัวเลขจะแสดงที่นี่...",
    "download": "ดาวน์โหลด",
    "rangeError": "ค่าต่ำสุดต้องน้อยกว่าหรือเท่ากับค่าสูงสุด",
    "countError": "จำนวนเกินค่าที่ไม่ซ้ำในช่วง ({range})",
    "enterFullscreen": "เต็มหน้าจอ",
    "exitFullscreen": "ออกจากเต็มหน้าจอ",
    "startRandom": "เริ่มสุ่ม",
    "stopRandom": "หยุดสุ่ม",
    "history": "ประวัติ",
    "historyEmpty": "ยังไม่มีประวัติ",
    "clearHistory": "ล้างประวัติ"
  },
  "id": {
    "options": "Opsi",
    "presets": "Preset",
    "presetDice": "Dadu (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Pilih 6 (1-49)",
    "min": "Minimum",
    "max": "Maksimum",
    "count": "Jumlah",
    "allowRepeat": "Izinkan duplikat",
    "numberType": "Jenis angka",
    "integer": "Bilangan bulat",
    "decimal": "Desimal",
    "decimalPlaces": "Jumlah desimal",
    "results": "Hasil",
    "placeholder": "Angka akan muncul di sini...",
    "download": "Unduh",
    "rangeError": "Minimum harus kurang dari atau sama dengan maksimum.",
    "countError": "Jumlah melebihi nilai unik dalam rentang ({range}).",
    "enterFullscreen": "Layar penuh",
    "exitFullscreen": "Keluar layar penuh",
    "startRandom": "Mulai acak",
    "stopRandom": "Hentikan acak",
    "history": "Riwayat",
    "historyEmpty": "Belum ada riwayat.",
    "clearHistory": "Hapus riwayat"
  },
  "he": {
    "options": "אפשרויות",
    "presets": "הגדרות מראש",
    "presetDice": "קובייה (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "בחר 6 (1-49)",
    "min": "מינימום",
    "max": "מקסימום",
    "count": "כמות",
    "allowRepeat": "לאפשר כפילויות",
    "numberType": "סוג מספר",
    "integer": "שלם",
    "decimal": "עשרוני",
    "decimalPlaces": "ספרות עשרוניות",
    "results": "תוצאות",
    "placeholder": "מספרים יופיעו כאן...",
    "download": "הורדה",
    "rangeError": "המינימום חייב להיות קטן או שווה למקסימום.",
    "countError": "הכמות חורגת ממספר הערכים הייחודיים בטווח ({range}).",
    "enterFullscreen": "מסך מלא",
    "exitFullscreen": "צא ממסך מלא",
    "startRandom": "התחל אקראי",
    "stopRandom": "עצור אקראי",
    "history": "היסטוריה",
    "historyEmpty": "אין היסטוריה עדיין.",
    "clearHistory": "נקה היסטוריה"
  },
  "ms": {
    "options": "Pilihan",
    "presets": "Pratetap",
    "presetDice": "Dadu (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Pilih 6 (1-49)",
    "min": "Minimum",
    "max": "Maksimum",
    "count": "Jumlah",
    "allowRepeat": "Benarkan pendua",
    "numberType": "Jenis nombor",
    "integer": "Integer",
    "decimal": "Perpuluhan",
    "decimalPlaces": "Tempat perpuluhan",
    "results": "Hasil",
    "placeholder": "Nombor akan muncul di sini...",
    "download": "Muat turun",
    "rangeError": "Minimum mesti kurang atau sama dengan maksimum.",
    "countError": "Jumlah melebihi nilai unik dalam julat ({range}).",
    "enterFullscreen": "Skrin penuh",
    "exitFullscreen": "Keluar skrin penuh",
    "startRandom": "Mula rawak",
    "stopRandom": "Henti rawak",
    "history": "Sejarah",
    "historyEmpty": "Belum ada sejarah.",
    "clearHistory": "Padam sejarah"
  },
  "no": {
    "options": "Alternativer",
    "presets": "Forhåndsinnstillinger",
    "presetDice": "Terning (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Velg 6 (1-49)",
    "min": "Minimum",
    "max": "Maksimum",
    "count": "Antall",
    "allowRepeat": "Tillat duplikater",
    "numberType": "Talltype",
    "integer": "Heltall",
    "decimal": "Desimal",
    "decimalPlaces": "Desimaler",
    "results": "Resultater",
    "placeholder": "Tallene vises her...",
    "download": "Last ned",
    "rangeError": "Minimum må være mindre enn eller lik maksimum.",
    "countError": "Antallet overstiger unike verdier i området ({range}).",
    "enterFullscreen": "Fullskjerm",
    "exitFullscreen": "Avslutt fullskjerm",
    "startRandom": "Start tilfeldig",
    "stopRandom": "Stopp tilfeldig",
    "history": "Historikk",
    "historyEmpty": "Ingen historikk ennå.",
    "clearHistory": "Tøm historikk"
  }
}
</i18n>
