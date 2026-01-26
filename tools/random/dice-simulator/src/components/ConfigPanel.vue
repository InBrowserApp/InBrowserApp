<template>
  <n-flex vertical :size="16">
    <n-flex align="center" wrap :size="12" class="preset-row">
      <n-text depth="3">{{ t('presets') }}</n-text>
      <n-button
        v-for="preset in facePresets"
        :key="preset"
        size="small"
        :type="preset === faces ? 'primary' : 'default'"
        @click="setPreset(preset)"
        :data-testid="`preset-${preset}`"
      >
        {{ t('dicePreset', { faces: preset }) }}
      </n-button>
    </n-flex>

    <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
      <n-form-item-gi :label="t('faces')">
        <n-flex vertical :size="4" style="width: 100%">
          <n-input-number
            :value="faces"
            :min="2"
            :step="1"
            style="width: 100%"
            data-testid="faces-input"
            @update:value="updateFaces"
          />
          <n-text depth="3">{{ t('facesHint') }}</n-text>
        </n-flex>
      </n-form-item-gi>
      <n-form-item-gi :label="t('diceCount')">
        <n-flex vertical :size="4" style="width: 100%">
          <n-input-number
            :value="count"
            :min="1"
            :step="1"
            style="width: 100%"
            data-testid="count-input"
            @update:value="updateCount"
          />
          <n-text depth="3">{{ t('countHint') }}</n-text>
        </n-flex>
      </n-form-item-gi>
    </n-grid>

    <n-flex align="center" :size="12" wrap>
      <n-button type="primary" @click="emit('roll')" data-testid="roll-button">
        <template #icon>
          <n-icon :component="RollIcon" />
        </template>
        {{ t('roll') }}
      </n-button>
      <n-text v-if="showLargeHint" depth="3" data-testid="large-hint">
        {{ t('largeHint', { count }) }}
      </n-text>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NFormItemGi, NGrid, NIcon, NInputNumber, NText } from 'naive-ui'
import RollIcon from '@vicons/fluent/MathSymbols16Regular'

const { t } = useI18n()

const props = defineProps<{
  faces: number
  count: number
}>()

const emit = defineEmits<{
  (e: 'update:faces', value: number): void
  (e: 'update:count', value: number): void
  (e: 'roll'): void
}>()

const facePresets = [4, 6, 8, 10, 12, 20]

const showLargeHint = computed(() => props.count >= 200)

function setPreset(preset: number) {
  emit('update:faces', preset)
}

function updateFaces(value: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return
  emit('update:faces', Math.max(2, Math.floor(value)))
}

function updateCount(value: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return
  emit('update:count', Math.max(1, Math.floor(value)))
}
</script>

<style scoped>
.preset-row {
  align-items: center;
}
</style>

<i18n lang="json">
{
  "en": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "zh": {
    "presets": "预设",
    "faces": "面数",
    "diceCount": "骰子数量",
    "facesHint": "支持常见 d4/d6/d8/d10/d12/d20，并允许自定义任意面数。",
    "countHint": "不限制数量，但数量过大可能会变慢。",
    "dicePreset": "d{faces}",
    "roll": "开始投掷",
    "largeHint": "数量较大：{count} 颗骰子可能需要更长时间。"
  },
  "zh-CN": {
    "presets": "预设",
    "faces": "面数",
    "diceCount": "骰子数量",
    "facesHint": "支持常见 d4/d6/d8/d10/d12/d20，并允许自定义任意面数。",
    "countHint": "不限制数量，但数量过大可能会变慢。",
    "dicePreset": "d{faces}",
    "roll": "开始投掷",
    "largeHint": "数量较大：{count} 颗骰子可能需要更长时间。"
  },
  "zh-TW": {
    "presets": "預設",
    "faces": "面數",
    "diceCount": "骰子數量",
    "facesHint": "支援常見 d4/d6/d8/d10/d12/d20，並允許自訂任意面數。",
    "countHint": "不限制數量，但數量過大可能會較慢。",
    "dicePreset": "d{faces}",
    "roll": "開始擲骰",
    "largeHint": "數量較大：{count} 顆骰子可能需要更長時間。"
  },
  "zh-HK": {
    "presets": "預設",
    "faces": "面數",
    "diceCount": "骰子數量",
    "facesHint": "支援常見 d4/d6/d8/d10/d12/d20，並允許自訂任意面數。",
    "countHint": "不限制數量，但數量過大可能會較慢。",
    "dicePreset": "d{faces}",
    "roll": "開始擲骰",
    "largeHint": "數量較大：{count} 顆骰子可能需要更長時間。"
  },
  "es": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "fr": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "de": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "it": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "ja": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "ko": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "ru": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "pt": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "ar": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "hi": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "tr": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "nl": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "sv": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "pl": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "vi": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "th": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "id": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "he": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "ms": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  },
  "no": {
    "presets": "Presets",
    "faces": "Faces",
    "diceCount": "Dice",
    "facesHint": "Supports standard d4/d6/d8/d10/d12/d20 and any custom value.",
    "countHint": "No limit, but very large rolls may be slower.",
    "dicePreset": "d{faces}",
    "roll": "Roll Dice",
    "largeHint": "Large roll: {count} dice may take longer."
  }
}
</i18n>
