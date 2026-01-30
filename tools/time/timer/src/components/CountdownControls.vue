<template>
  <ToolSection>
    <n-flex :size="12" wrap justify="center">
      <n-button type="primary" @click="toggleRun" data-testid="start">
        <template #icon>
          <n-icon :component="toggleIcon" />
        </template>
        {{ toggleLabel }}
      </n-button>
      <n-button :disabled="!canReset" @click="reset" data-testid="reset">
        <template #icon>
          <n-icon :component="ArrowCounterclockwise16Regular" />
        </template>
        {{ t('reset') }}
      </n-button>
      <n-button
        v-show="fullscreenAvailable"
        @click="enterFullscreen"
        data-testid="fullscreen-enter"
      >
        <template #icon>
          <n-icon :component="FullScreenMaximize16Regular" />
        </template>
        {{ t('fullscreenEnter') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { NButton, NFlex, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'
import FullScreenMaximize16Regular from '@vicons/fluent/FullScreenMaximize16Regular'

defineProps<{
  toggleLabel: string
  toggleIcon: Component
  canReset: boolean
  fullscreenAvailable: boolean
  toggleRun: () => void
  reset: () => void
  enterFullscreen: () => void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "reset": "Reset",
    "fullscreenEnter": "Fullscreen"
  },
  "zh": {
    "reset": "重置",
    "fullscreenEnter": "全屏"
  },
  "zh-CN": {
    "reset": "重置",
    "fullscreenEnter": "全屏"
  },
  "zh-TW": {
    "reset": "重置",
    "fullscreenEnter": "全螢幕"
  },
  "zh-HK": {
    "reset": "重置",
    "fullscreenEnter": "全螢幕"
  },
  "es": {
    "reset": "Restablecer",
    "fullscreenEnter": "Pantalla completa"
  },
  "fr": {
    "reset": "Réinitialiser",
    "fullscreenEnter": "Plein écran"
  },
  "de": {
    "reset": "Zurücksetzen",
    "fullscreenEnter": "Vollbild"
  },
  "it": {
    "reset": "Reimposta",
    "fullscreenEnter": "Schermo intero"
  },
  "ja": {
    "reset": "リセット",
    "fullscreenEnter": "全画面"
  },
  "ko": {
    "reset": "초기화",
    "fullscreenEnter": "전체 화면"
  },
  "ru": {
    "reset": "Сброс",
    "fullscreenEnter": "Полноэкранный"
  },
  "pt": {
    "reset": "Redefinir",
    "fullscreenEnter": "Tela cheia"
  },
  "ar": {
    "reset": "إعادة ضبط",
    "fullscreenEnter": "ملء الشاشة"
  },
  "hi": {
    "reset": "रीसेट",
    "fullscreenEnter": "पूर्ण स्क्रीन"
  },
  "tr": {
    "reset": "Sıfırla",
    "fullscreenEnter": "Tam Ekran"
  },
  "nl": {
    "reset": "Reset",
    "fullscreenEnter": "Volledig scherm"
  },
  "sv": {
    "reset": "Återställ",
    "fullscreenEnter": "Fullskärm"
  },
  "pl": {
    "reset": "Reset",
    "fullscreenEnter": "Pełny ekran"
  },
  "vi": {
    "reset": "Đặt lại",
    "fullscreenEnter": "Toàn màn hình"
  },
  "th": {
    "reset": "รีเซ็ต",
    "fullscreenEnter": "เต็มหน้าจอ"
  },
  "id": {
    "reset": "Reset",
    "fullscreenEnter": "Layar penuh"
  },
  "he": {
    "reset": "אפס",
    "fullscreenEnter": "מסך מלא"
  },
  "ms": {
    "reset": "Tetapkan semula",
    "fullscreenEnter": "Skrin penuh"
  },
  "no": {
    "reset": "Tilbakestill",
    "fullscreenEnter": "Fullskjerm"
  }
}
</i18n>
