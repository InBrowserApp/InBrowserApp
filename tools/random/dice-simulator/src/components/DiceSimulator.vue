<template>
  <ToolSectionHeader>{{ t('setup') }}</ToolSectionHeader>
  <ToolSection>
    <ConfigPanel v-model:faces="facesInput" v-model:count="countInput" @roll="rollDice" />
  </ToolSection>

  <ToolSectionHeader>{{ t('stage') }}</ToolSectionHeader>
  <ToolSection>
    <DiceStage3D
      ref="stageRef"
      :results="results"
      :faces="rollFaces"
      :roll-id="rollId"
      :max-visible="maxVisibleDice"
      @settled="updateStageSnapshot"
    />
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <ResultsPanel
      :results="results"
      :faces="rollFaces"
      :count="rollCount"
      :total="total"
      :roll-time="rollTime"
      :stage-image-blob="stageImageBlob"
      :stage-image-url="stageImageUrl"
    />
  </ToolSection>

  <ToolSectionHeader>{{ t('history') }}</ToolSectionHeader>
  <ToolSection>
    <HistoryPanel
      :history="history"
      :stats="stats"
      :max-history="historyLimit"
      @clear="clearHistory"
      @select="applyHistory"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ConfigPanel from './ConfigPanel.vue'
import DiceStage3D from './DiceStage3D.vue'
import ResultsPanel from './ResultsPanel.vue'
import HistoryPanel from './HistoryPanel.vue'

interface HistoryEntry {
  id: string
  faces: number
  count: number
  results: number[]
  total: number
  createdAt: string
}

interface DiceStats {
  faces: number
  rolls: number
  samples: number
  average: number
  min: number
  max: number
  distribution: Array<{ value: number; count: number; ratio: number; bar: number }>
}

const { t } = useI18n()

const historyLimit = 100
const maxVisibleDice = 60

const facesInput = useStorage<number>('tools:dice-simulator:faces', 6)
const countInput = useStorage<number>('tools:dice-simulator:count', 2)
const history = useStorage<HistoryEntry[]>('tools:dice-simulator:history', [])

const results = ref<number[]>([])
const rollId = ref(0)
const rollTime = ref<string | null>(null)
const rollConfig = ref<{ faces: number; count: number } | null>(null)

const stageRef = ref<{ exportImage: (scale?: number) => Promise<Blob | null> } | null>(null)
const stageImageBlob = ref<Blob | null>(null)
const stageImageUrlRef = useObjectUrl(stageImageBlob)
const stageImageUrl = computed(() => stageImageUrlRef.value ?? null)

const safeFaces = computed(() => normalizeFaces(facesInput.value))
const safeCount = computed(() => normalizeCount(countInput.value))

const rollFaces = computed(() => rollConfig.value?.faces ?? safeFaces.value)
const rollCount = computed(() => rollConfig.value?.count ?? safeCount.value)

const total = computed(() => results.value.reduce((sum, value) => sum + value, 0))

const stats = computed<DiceStats>(() => buildStats(history.value, safeFaces.value))

watch(
  safeFaces,
  (value) => {
    if (facesInput.value !== value) facesInput.value = value
  },
  { immediate: true },
)

watch(
  safeCount,
  (value) => {
    if (countInput.value !== value) countInput.value = value
  },
  { immediate: true },
)

function normalizeFaces(value: number | null | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 6
  return Math.max(2, Math.floor(value))
}

function normalizeCount(value: number | null | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.max(1, Math.floor(value))
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const randomBuffer = new Uint32Array(1)

function randomInt(max: number) {
  if (max <= 0) return 1
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const limit = Math.floor(0x100000000 / max) * max
    let value = 0
    do {
      crypto.getRandomValues(randomBuffer)
      value = randomBuffer[0] ?? 0
    } while (value >= limit)
    return (value % max) + 1
  }
  return Math.floor(Math.random() * max) + 1
}

function rollDice() {
  const faces = safeFaces.value
  const count = safeCount.value
  const rolled = Array.from({ length: count }, () => randomInt(faces))
  results.value = rolled
  rollId.value += 1
  rollTime.value = new Date().toISOString()
  rollConfig.value = { faces, count }

  const entry: HistoryEntry = {
    id: generateId(),
    faces,
    count,
    results: rolled,
    total: rolled.reduce((sum, value) => sum + value, 0),
    createdAt: rollTime.value,
  }
  history.value = [entry, ...history.value].slice(0, historyLimit)
}

function applyHistory(entry: HistoryEntry) {
  facesInput.value = entry.faces
  countInput.value = entry.count
  results.value = entry.results
  rollTime.value = entry.createdAt
  rollConfig.value = { faces: entry.faces, count: entry.count }
  rollId.value += 1
}

function clearHistory() {
  history.value = []
}

async function updateStageSnapshot() {
  stageImageBlob.value = (await stageRef.value?.exportImage()) ?? null
}

function buildStats(entries: HistoryEntry[], faces: number): DiceStats {
  const filtered = entries.filter((entry) => entry.faces === faces)
  const counts = Array.from({ length: faces }, () => 0)
  let samples = 0
  let total = 0
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY

  filtered.forEach((entry) => {
    entry.results.forEach((value) => {
      if (value >= 1 && value <= faces) {
        const index = value - 1
        counts[index] = (counts[index] ?? 0) + 1
      }
      samples += 1
      total += value
      min = Math.min(min, value)
      max = Math.max(max, value)
    })
  })

  const maxCount = Math.max(0, ...counts)

  return {
    faces,
    rolls: filtered.length,
    samples,
    average: samples ? total / samples : 0,
    min: samples ? min : 0,
    max: samples ? max : 0,
    distribution: counts.map((count, index) => ({
      value: index + 1,
      count,
      ratio: samples ? count / samples : 0,
      bar: maxCount ? count / maxCount : 0,
    })),
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "zh": {
    "setup": "设置",
    "stage": "3D 画面",
    "results": "结果",
    "history": "历史"
  },
  "zh-CN": {
    "setup": "设置",
    "stage": "3D 画面",
    "results": "结果",
    "history": "历史"
  },
  "zh-TW": {
    "setup": "設定",
    "stage": "3D 畫面",
    "results": "結果",
    "history": "歷史"
  },
  "zh-HK": {
    "setup": "設定",
    "stage": "3D 畫面",
    "results": "結果",
    "history": "歷史"
  },
  "es": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "fr": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "de": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "it": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "ja": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "ko": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "ru": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "pt": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "ar": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "hi": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "tr": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "nl": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "sv": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "pl": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "vi": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "th": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "id": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "he": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "ms": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  },
  "no": {
    "setup": "Setup",
    "stage": "3D Stage",
    "results": "Results",
    "history": "History"
  }
}
</i18n>
