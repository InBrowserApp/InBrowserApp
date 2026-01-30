<template>
  <ToolSection>
    <div class="stopwatch-display">
      <div class="stopwatch-time" data-testid="elapsed">
        {{ formattedElapsed }}
      </div>
      <n-text depth="3">
        {{ running ? t('status-running') : t('status-paused') }}
      </n-text>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'

defineProps<{
  formattedElapsed: string
  running: boolean
}>()

const { t } = useI18n()
</script>

<style scoped>
.stopwatch-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
}

.stopwatch-time {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}
</style>

<i18n lang="json">
{
  "en": {
    "status-running": "Running",
    "status-paused": "Paused"
  },
  "zh": {
    "status-running": "计时中",
    "status-paused": "已暂停"
  },
  "zh-CN": {
    "status-running": "计时中",
    "status-paused": "已暂停"
  },
  "zh-TW": {
    "status-running": "計時中",
    "status-paused": "已暫停"
  },
  "zh-HK": {
    "status-running": "計時中",
    "status-paused": "已暫停"
  },
  "es": {
    "status-running": "En marcha",
    "status-paused": "Pausado"
  },
  "fr": {
    "status-running": "En cours",
    "status-paused": "En pause"
  },
  "de": {
    "status-running": "Läuft",
    "status-paused": "Pausiert"
  },
  "it": {
    "status-running": "In corso",
    "status-paused": "In pausa"
  },
  "ja": {
    "status-running": "計測中",
    "status-paused": "一時停止中"
  },
  "ko": {
    "status-running": "진행 중",
    "status-paused": "일시정지됨"
  },
  "ru": {
    "status-running": "Идет",
    "status-paused": "Пауза"
  },
  "pt": {
    "status-running": "Em andamento",
    "status-paused": "Pausado"
  },
  "ar": {
    "status-running": "قيد التشغيل",
    "status-paused": "متوقف مؤقتًا"
  },
  "hi": {
    "status-running": "चल रहा है",
    "status-paused": "रुका हुआ"
  },
  "tr": {
    "status-running": "Çalışıyor",
    "status-paused": "Duraklatıldı"
  },
  "nl": {
    "status-running": "Bezig",
    "status-paused": "Gepauzeerd"
  },
  "sv": {
    "status-running": "Pågår",
    "status-paused": "Pausad"
  },
  "pl": {
    "status-running": "Trwa",
    "status-paused": "Wstrzymany"
  },
  "vi": {
    "status-running": "Đang chạy",
    "status-paused": "Đã tạm dừng"
  },
  "th": {
    "status-running": "กำลังทำงาน",
    "status-paused": "หยุดชั่วคราว"
  },
  "id": {
    "status-running": "Berjalan",
    "status-paused": "Dijeda"
  },
  "he": {
    "status-running": "פועל",
    "status-paused": "מושהה"
  },
  "ms": {
    "status-running": "Sedang berjalan",
    "status-paused": "Dijeda"
  },
  "no": {
    "status-running": "Kjører",
    "status-paused": "Pauset"
  }
}
</i18n>
