<template>
  <div class="fullscreen-overlay" data-testid="fullscreen-overlay" @click.self="emit('close')">
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
        @click="emit('toggle-rolling')"
        data-testid="fullscreen-regenerate"
      >
        <template #icon>
          <n-icon :component="rollingIcon" />
        </template>
        <template #label>
          {{ rollingLabel }}
        </template>
      </RegenerateButton>
      <n-button text @click="emit('close')" data-testid="exit-fullscreen">
        <template #icon>
          <n-icon :component="ExitFullscreenIcon" />
        </template>
        {{ t('exitFullscreen') }}
      </n-button>
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NTag, useThemeVars } from 'naive-ui'
import { RegenerateButton } from '@shared/ui/base'
import ExitFullscreenIcon from '@vicons/fluent/FullScreenMinimize24Regular'
import type { Component } from 'vue'

defineProps<{
  formattedNumbers: string[]
  canRoll: boolean
  isRolling: boolean
  rollingLabel: string
  rollingIcon: Component
}>()

const emit = defineEmits<{
  (event: 'toggle-rolling'): void
  (event: 'close'): void
}>()

const { t } = useI18n()
const themeVars = useThemeVars()
</script>

<style scoped>
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
    "exitFullscreen": "Exit full screen"
  },
  "zh": {
    "exitFullscreen": "退出全屏"
  },
  "zh-CN": {
    "exitFullscreen": "退出全屏"
  },
  "zh-TW": {
    "exitFullscreen": "退出全螢幕"
  },
  "zh-HK": {
    "exitFullscreen": "退出全螢幕"
  },
  "es": {
    "exitFullscreen": "Salir de pantalla completa"
  },
  "fr": {
    "exitFullscreen": "Quitter le plein écran"
  },
  "de": {
    "exitFullscreen": "Vollbild verlassen"
  },
  "it": {
    "exitFullscreen": "Esci da schermo intero"
  },
  "ja": {
    "exitFullscreen": "全画面を終了"
  },
  "ko": {
    "exitFullscreen": "전체 화면 종료"
  },
  "ru": {
    "exitFullscreen": "Выйти из полноэкранного режима"
  },
  "pt": {
    "exitFullscreen": "Sair do modo tela cheia"
  },
  "ar": {
    "exitFullscreen": "الخروج من ملء الشاشة"
  },
  "hi": {
    "exitFullscreen": "पूर्ण स्क्रीन से बाहर निकलें"
  },
  "tr": {
    "exitFullscreen": "Tam ekrandan çık"
  },
  "nl": {
    "exitFullscreen": "Volledig scherm verlaten"
  },
  "sv": {
    "exitFullscreen": "Avsluta fullskärm"
  },
  "pl": {
    "exitFullscreen": "Wyjdź z pełnego ekranu"
  },
  "vi": {
    "exitFullscreen": "Thoát toàn màn hình"
  },
  "th": {
    "exitFullscreen": "ออกจากเต็มหน้าจอ"
  },
  "id": {
    "exitFullscreen": "Keluar layar penuh"
  },
  "he": {
    "exitFullscreen": "צא ממסך מלא"
  },
  "ms": {
    "exitFullscreen": "Keluar skrin penuh"
  },
  "no": {
    "exitFullscreen": "Avslutt fullskjerm"
  }
}
</i18n>
