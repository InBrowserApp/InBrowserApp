<template>
  <div class="fullscreen-controls" data-testid="fullscreen-controls">
    <n-flex :size="8" align="center">
      <n-button type="primary" @click="toggleRun" data-testid="fullscreen-start">
        <template #icon>
          <n-icon :component="toggleIcon" />
        </template>
        {{ toggleLabel }}
      </n-button>
      <n-button :disabled="!canReset" @click="reset" data-testid="fullscreen-reset">
        <template #icon>
          <n-icon :component="ArrowCounterclockwise16Regular" />
        </template>
        {{ t('reset') }}
      </n-button>
      <n-button @click="exitFullscreen" data-testid="fullscreen-exit">
        <template #icon>
          <n-icon :component="FullScreenMinimize24Regular" />
        </template>
        {{ t('fullscreenExit') }}
      </n-button>
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { NButton, NFlex, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'
import FullScreenMinimize24Regular from '@vicons/fluent/FullScreenMinimize24Regular'

defineProps<{
  toggleLabel: string
  toggleIcon: Component
  canReset: boolean
  toggleRun: () => void
  reset: () => void
  exitFullscreen: () => void
}>()

const { t } = useI18n()
</script>

<style scoped>
.fullscreen-controls {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 2;
}
</style>

<i18n lang="json">
{
  "en": {
    "reset": "Reset",
    "fullscreenExit": "Exit fullscreen"
  },
  "zh": {
    "reset": "重置",
    "fullscreenExit": "退出全屏"
  },
  "zh-CN": {
    "reset": "重置",
    "fullscreenExit": "退出全屏"
  },
  "zh-TW": {
    "reset": "重置",
    "fullscreenExit": "退出全螢幕"
  },
  "zh-HK": {
    "reset": "重置",
    "fullscreenExit": "退出全螢幕"
  },
  "es": {
    "reset": "Restablecer",
    "fullscreenExit": "Salir de pantalla completa"
  },
  "fr": {
    "reset": "Réinitialiser",
    "fullscreenExit": "Quitter le plein écran"
  },
  "de": {
    "reset": "Zurücksetzen",
    "fullscreenExit": "Vollbild verlassen"
  },
  "it": {
    "reset": "Reimposta",
    "fullscreenExit": "Esci da schermo intero"
  },
  "ja": {
    "reset": "リセット",
    "fullscreenExit": "全画面を終了"
  },
  "ko": {
    "reset": "초기화",
    "fullscreenExit": "전체 화면 종료"
  },
  "ru": {
    "reset": "Сброс",
    "fullscreenExit": "Выйти из полноэкранного режима"
  },
  "pt": {
    "reset": "Redefinir",
    "fullscreenExit": "Sair da tela cheia"
  },
  "ar": {
    "reset": "إعادة ضبط",
    "fullscreenExit": "الخروج من ملء الشاشة"
  },
  "hi": {
    "reset": "रीसेट",
    "fullscreenExit": "पूर्ण स्क्रीन से बाहर"
  },
  "tr": {
    "reset": "Sıfırla",
    "fullscreenExit": "Tam ekrandan çık"
  },
  "nl": {
    "reset": "Reset",
    "fullscreenExit": "Volledig scherm verlaten"
  },
  "sv": {
    "reset": "Återställ",
    "fullscreenExit": "Avsluta helskärm"
  },
  "pl": {
    "reset": "Reset",
    "fullscreenExit": "Wyjdź z pełnego ekranu"
  },
  "vi": {
    "reset": "Đặt lại",
    "fullscreenExit": "Thoát toàn màn hình"
  },
  "th": {
    "reset": "รีเซ็ต",
    "fullscreenExit": "ออกจากเต็มหน้าจอ"
  },
  "id": {
    "reset": "Reset",
    "fullscreenExit": "Keluar dari layar penuh"
  },
  "he": {
    "reset": "אפס",
    "fullscreenExit": "צא ממסך מלא"
  },
  "ms": {
    "reset": "Tetapkan semula",
    "fullscreenExit": "Keluar skrin penuh"
  },
  "no": {
    "reset": "Tilbakestill",
    "fullscreenExit": "Avslutt fullskjerm"
  }
}
</i18n>
