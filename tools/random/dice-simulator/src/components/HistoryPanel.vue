<template>
  <n-flex vertical :size="16">
    <n-flex justify="space-between" align="center">
      <n-text depth="3">{{ t('historyLimit', { count: maxHistory }) }}</n-text>
      <n-button size="small" @click="emit('clear')" :disabled="!history.length">
        {{ t('clearHistory') }}
      </n-button>
    </n-flex>

    <n-card embedded class="stats-card">
      <n-flex justify="space-between" align="center" :size="12">
        <n-text strong>{{ t('statsTitle', { faces: stats.faces }) }}</n-text>
        <n-text depth="3">{{ t('statsScope') }}</n-text>
      </n-flex>
      <div v-if="stats.samples === 0" class="stats-empty">
        <n-text depth="3">{{ t('statsEmpty', { faces: stats.faces }) }}</n-text>
      </div>
      <div v-else>
        <n-grid cols="2 m:4" responsive="screen" :x-gap="12" :y-gap="8" class="stats-grid">
          <n-gi>
            <n-text depth="3">{{ t('rolls') }}</n-text>
            <div class="stats-value">{{ stats.rolls }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">{{ t('samples') }}</n-text>
            <div class="stats-value">{{ stats.samples }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">{{ t('average') }}</n-text>
            <div class="stats-value">{{ formatNumber(stats.average) }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">{{ t('range') }}</n-text>
            <div class="stats-value">{{ stats.min }} - {{ stats.max }}</div>
          </n-gi>
        </n-grid>

        <div class="distribution">
          <n-text depth="3">{{ t('distribution') }}</n-text>
          <div class="distribution-list">
            <div v-for="item in stats.distribution" :key="item.value" class="distribution-row">
              <div class="distribution-label">{{ item.value }}</div>
              <n-progress
                :percentage="Math.round(item.bar * 100)"
                :show-indicator="false"
                status="success"
                :height="8"
              />
              <div class="distribution-count">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </n-card>

    <n-empty v-if="!history.length" :description="t('empty')" data-testid="history-empty" />

    <n-scrollbar v-else style="max-height: 320px">
      <div class="history-list" data-testid="history-list">
        <n-card v-for="entry in history" :key="entry.id" embedded class="history-card">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ formatTime(entry.createdAt) }}</n-text>
            <n-tag type="info">{{
              t('diceSummary', { count: entry.count, faces: entry.faces })
            }}</n-tag>
          </n-flex>
          <n-text depth="3">{{ t('total') }}: {{ entry.total }}</n-text>
          <n-text class="history-results">{{ previewResults(entry.results) }}</n-text>
          <n-flex justify="space-between" align="center" :size="8">
            <n-text depth="3">{{ t('resultsCount', { count: entry.results.length }) }}</n-text>
            <n-button size="small" @click="emit('select', entry)">{{ t('useRoll') }}</n-button>
          </n-flex>
        </n-card>
      </div>
    </n-scrollbar>
  </n-flex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NCard,
  NEmpty,
  NFlex,
  NGi,
  NGrid,
  NProgress,
  NScrollbar,
  NTag,
  NText,
} from 'naive-ui'

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

defineProps<{
  history: HistoryEntry[]
  stats: DiceStats
  maxHistory: number
}>()

const emit = defineEmits<{
  (e: 'clear'): void
  (e: 'select', entry: HistoryEntry): void
}>()

const { t } = useI18n()

function formatTime(value: string) {
  return new Date(value).toLocaleString()
}

function previewResults(results: number[]) {
  const limit = 16
  const preview = results.slice(0, limit).join(', ')
  if (results.length <= limit) return preview
  return `${preview} … +${results.length - limit}`
}

function formatNumber(value: number) {
  return value.toFixed(2)
}
</script>

<style scoped>
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-results {
  word-break: break-word;
}

.stats-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stats-grid {
  margin-top: 8px;
}

.stats-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.distribution {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-row {
  display: grid;
  grid-template-columns: 32px 1fr 42px;
  gap: 8px;
  align-items: center;
}

.distribution-label,
.distribution-count {
  font-size: 0.85rem;
  color: #5b6378;
}
</style>

<i18n lang="json">
{
  "en": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "zh": {
    "historyLimit": "仅保留最近 {count} 次记录。",
    "clearHistory": "清空历史",
    "statsTitle": "统计（d{faces}）",
    "statsScope": "仅统计当前面数的投掷",
    "statsEmpty": "暂无 d{faces} 的统计数据。",
    "rolls": "次数",
    "samples": "样本数",
    "average": "平均值",
    "range": "最小 / 最大",
    "distribution": "分布",
    "empty": "暂无历史记录。",
    "total": "总和",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "结果数：{count}",
    "useRoll": "使用"
  },
  "zh-CN": {
    "historyLimit": "仅保留最近 {count} 次记录。",
    "clearHistory": "清空历史",
    "statsTitle": "统计（d{faces}）",
    "statsScope": "仅统计当前面数的投掷",
    "statsEmpty": "暂无 d{faces} 的统计数据。",
    "rolls": "次数",
    "samples": "样本数",
    "average": "平均值",
    "range": "最小 / 最大",
    "distribution": "分布",
    "empty": "暂无历史记录。",
    "total": "总和",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "结果数：{count}",
    "useRoll": "使用"
  },
  "zh-TW": {
    "historyLimit": "僅保留最近 {count} 次紀錄。",
    "clearHistory": "清除歷史",
    "statsTitle": "統計（d{faces}）",
    "statsScope": "僅統計目前面數的擲骰",
    "statsEmpty": "尚無 d{faces} 的統計資料。",
    "rolls": "次數",
    "samples": "樣本數",
    "average": "平均值",
    "range": "最小 / 最大",
    "distribution": "分布",
    "empty": "尚無歷史紀錄。",
    "total": "總和",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "結果數：{count}",
    "useRoll": "使用"
  },
  "zh-HK": {
    "historyLimit": "僅保留最近 {count} 次紀錄。",
    "clearHistory": "清除歷史",
    "statsTitle": "統計（d{faces}）",
    "statsScope": "僅統計目前面數的擲骰",
    "statsEmpty": "尚無 d{faces} 的統計資料。",
    "rolls": "次數",
    "samples": "樣本數",
    "average": "平均值",
    "range": "最小 / 最大",
    "distribution": "分布",
    "empty": "尚無歷史紀錄。",
    "total": "總和",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "結果數：{count}",
    "useRoll": "使用"
  },
  "es": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "fr": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "de": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "it": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "ja": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "ko": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "ru": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "pt": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "ar": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "hi": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "tr": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "nl": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "sv": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "pl": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "vi": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "th": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "id": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "he": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "ms": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  },
  "no": {
    "historyLimit": "Shows the last {count} rolls.",
    "clearHistory": "Clear history",
    "statsTitle": "Statistics (d{faces})",
    "statsScope": "Based on current face count",
    "statsEmpty": "No rolls yet for d{faces}.",
    "rolls": "Rolls",
    "samples": "Samples",
    "average": "Average",
    "range": "Min / Max",
    "distribution": "Distribution",
    "empty": "No history yet.",
    "total": "Total",
    "diceSummary": "{count} × d{faces}",
    "resultsCount": "Results: {count}",
    "useRoll": "Use"
  }
}
</i18n>
