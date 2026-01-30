<template>
  <ToolSection>
    <n-flex :size="12" wrap justify="center">
      <n-button type="primary" :disabled="running" data-testid="start" @click="emit('start')">
        <template #icon>
          <n-icon :component="Play16Regular" />
        </template>
        {{ hasElapsed ? t('resume') : t('start') }}
      </n-button>
      <n-button :disabled="!running" data-testid="pause" @click="emit('pause')">
        <template #icon>
          <n-icon :component="Pause16Regular" />
        </template>
        {{ t('pause') }}
      </n-button>
      <n-button :disabled="!canLap" data-testid="lap" @click="emit('lap')">
        <template #icon>
          <n-icon :component="Flag16Regular" />
        </template>
        {{ t('lap') }}
      </n-button>
      <n-button :disabled="!canReset" data-testid="reset" @click="emit('reset')">
        <template #icon>
          <n-icon :component="ArrowCounterclockwise16Regular" />
        </template>
        {{ t('reset') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'
import Flag16Regular from '@vicons/fluent/Flag16Regular'
import Pause16Regular from '@vicons/fluent/Pause16Regular'
import Play16Regular from '@vicons/fluent/Play16Regular'

defineProps<{
  running: boolean
  hasElapsed: boolean
  canLap: boolean
  canReset: boolean
}>()

const emit = defineEmits<{
  (event: 'start'): void
  (event: 'pause'): void
  (event: 'lap'): void
  (event: 'reset'): void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "start": "Start",
    "resume": "Resume",
    "pause": "Pause",
    "lap": "Lap",
    "reset": "Reset"
  },
  "zh": {
    "start": "开始",
    "resume": "继续",
    "pause": "暂停",
    "lap": "计次",
    "reset": "重置"
  },
  "zh-CN": {
    "start": "开始",
    "resume": "继续",
    "pause": "暂停",
    "lap": "计次",
    "reset": "重置"
  },
  "zh-TW": {
    "start": "開始",
    "resume": "繼續",
    "pause": "暫停",
    "lap": "計次",
    "reset": "重置"
  },
  "zh-HK": {
    "start": "開始",
    "resume": "繼續",
    "pause": "暫停",
    "lap": "計次",
    "reset": "重置"
  },
  "es": {
    "start": "Iniciar",
    "resume": "Reanudar",
    "pause": "Pausar",
    "lap": "Vuelta",
    "reset": "Restablecer"
  },
  "fr": {
    "start": "Démarrer",
    "resume": "Reprendre",
    "pause": "Pause",
    "lap": "Tour",
    "reset": "Réinitialiser"
  },
  "de": {
    "start": "Start",
    "resume": "Fortsetzen",
    "pause": "Pause",
    "lap": "Runde",
    "reset": "Zurücksetzen"
  },
  "it": {
    "start": "Avvia",
    "resume": "Riprendi",
    "pause": "Pausa",
    "lap": "Giro",
    "reset": "Reimposta"
  },
  "ja": {
    "start": "開始",
    "resume": "再開",
    "pause": "一時停止",
    "lap": "ラップ",
    "reset": "リセット"
  },
  "ko": {
    "start": "시작",
    "resume": "재개",
    "pause": "일시정지",
    "lap": "랩",
    "reset": "초기화"
  },
  "ru": {
    "start": "Старт",
    "resume": "Продолжить",
    "pause": "Пауза",
    "lap": "Круг",
    "reset": "Сброс"
  },
  "pt": {
    "start": "Iniciar",
    "resume": "Retomar",
    "pause": "Pausar",
    "lap": "Volta",
    "reset": "Redefinir"
  },
  "ar": {
    "start": "بدء",
    "resume": "استئناف",
    "pause": "إيقاف مؤقت",
    "lap": "لفة",
    "reset": "إعادة ضبط"
  },
  "hi": {
    "start": "शुरू",
    "resume": "फिर से शुरू करें",
    "pause": "रोकें",
    "lap": "लैप",
    "reset": "रीसेट"
  },
  "tr": {
    "start": "Başlat",
    "resume": "Sürdür",
    "pause": "Duraklat",
    "lap": "Tur",
    "reset": "Sıfırla"
  },
  "nl": {
    "start": "Start",
    "resume": "Hervatten",
    "pause": "Pauze",
    "lap": "Ronde",
    "reset": "Reset"
  },
  "sv": {
    "start": "Starta",
    "resume": "Fortsätt",
    "pause": "Pausa",
    "lap": "Varv",
    "reset": "Återställ"
  },
  "pl": {
    "start": "Start",
    "resume": "Wznów",
    "pause": "Pauza",
    "lap": "Okrążenie",
    "reset": "Resetuj"
  },
  "vi": {
    "start": "Bắt đầu",
    "resume": "Tiếp tục",
    "pause": "Tạm dừng",
    "lap": "Vòng",
    "reset": "Đặt lại"
  },
  "th": {
    "start": "เริ่ม",
    "resume": "ทำต่อ",
    "pause": "หยุดชั่วคราว",
    "lap": "รอบ",
    "reset": "รีเซ็ต"
  },
  "id": {
    "start": "Mulai",
    "resume": "Lanjutkan",
    "pause": "Jeda",
    "lap": "Putaran",
    "reset": "Reset"
  },
  "he": {
    "start": "התחל",
    "resume": "המשך",
    "pause": "השהה",
    "lap": "הקפה",
    "reset": "אפס"
  },
  "ms": {
    "start": "Mula",
    "resume": "Sambung",
    "pause": "Jeda",
    "lap": "Pusingan",
    "reset": "Set semula"
  },
  "no": {
    "start": "Start",
    "resume": "Fortsett",
    "pause": "Pause",
    "lap": "Runde",
    "reset": "Nullstill"
  }
}
</i18n>
