<template>
  <ToolSectionHeader>{{ t('durationTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:3" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('hours')" :show-feedback="false">
        <n-input-number
          :value="hours"
          :min="0"
          :precision="0"
          :disabled="running"
          class="monospace-input"
          data-testid="hours"
          style="width: 100%"
          @update:value="updateHours"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('minutes')" :show-feedback="false">
        <n-input-number
          :value="minutes"
          :min="0"
          :max="59"
          :precision="0"
          :disabled="running"
          class="monospace-input"
          data-testid="minutes"
          style="width: 100%"
          @update:value="updateMinutes"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('seconds')" :show-feedback="false">
        <n-input-number
          :value="seconds"
          :min="0"
          :max="59"
          :precision="0"
          :disabled="running"
          class="monospace-input"
          data-testid="seconds"
          style="width: 100%"
          @update:value="updateSeconds"
        />
      </n-form-item-gi>
    </n-grid>
    <n-text depth="3" class="input-hint">{{ t('durationHint') }}</n-text>
    <n-text depth="3" class="input-hint">{{ t('presets') }}</n-text>
    <n-space :size="8" wrap>
      <n-button
        v-for="preset in presetMinutes"
        :key="preset"
        size="small"
        :disabled="running"
        @click="applyPreset(preset)"
        :data-testid="`preset-${preset}`"
      >
        {{ t('presetMinutes', { minutes: preset }) }}
      </n-button>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFormItemGi, NGrid, NInputNumber, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  hours: number
  minutes: number
  seconds: number
  running: boolean
  presetMinutes: number[]
  updateHours: (value: number | null) => void
  updateMinutes: (value: number | null) => void
  updateSeconds: (value: number | null) => void
  applyPreset: (preset: number) => void
}>()

const { t } = useI18n()
</script>

<style scoped>
.monospace-input :deep(input) {
  font-family: var(--n-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.input-hint {
  display: block;
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "durationTitle": "Duration",
    "durationHint": "Set the countdown duration before starting.",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "presets": "Quick Presets",
    "presetMinutes": "{minutes} min"
  },
  "zh": {
    "durationTitle": "时长",
    "durationHint": "开始前请设置倒计时时长。",
    "hours": "小时",
    "minutes": "分钟",
    "seconds": "秒",
    "presets": "快速预设",
    "presetMinutes": "{minutes} 分钟"
  },
  "zh-CN": {
    "durationTitle": "时长",
    "durationHint": "开始前请设置倒计时时长。",
    "hours": "小时",
    "minutes": "分钟",
    "seconds": "秒",
    "presets": "快速预设",
    "presetMinutes": "{minutes} 分钟"
  },
  "zh-TW": {
    "durationTitle": "時長",
    "durationHint": "開始前請設定倒數計時時長。",
    "hours": "小時",
    "minutes": "分鐘",
    "seconds": "秒",
    "presets": "快速預設",
    "presetMinutes": "{minutes} 分鐘"
  },
  "zh-HK": {
    "durationTitle": "時長",
    "durationHint": "開始前請設定倒數計時時長。",
    "hours": "小時",
    "minutes": "分鐘",
    "seconds": "秒",
    "presets": "快速預設",
    "presetMinutes": "{minutes} 分鐘"
  },
  "es": {
    "durationTitle": "Duración",
    "durationHint": "Configura la duración antes de iniciar.",
    "hours": "Horas",
    "minutes": "Minutos",
    "seconds": "Segundos",
    "presets": "Ajustes rápidos",
    "presetMinutes": "{minutes} min"
  },
  "fr": {
    "durationTitle": "Durée",
    "durationHint": "Réglez la durée avant de démarrer.",
    "hours": "Heures",
    "minutes": "Minutes",
    "seconds": "Secondes",
    "presets": "Préréglages rapides",
    "presetMinutes": "{minutes} min"
  },
  "de": {
    "durationTitle": "Dauer",
    "durationHint": "Legen Sie die Dauer vor dem Start fest.",
    "hours": "Stunden",
    "minutes": "Minuten",
    "seconds": "Sekunden",
    "presets": "Schnellvorlagen",
    "presetMinutes": "{minutes} Min"
  },
  "it": {
    "durationTitle": "Durata",
    "durationHint": "Imposta la durata prima di avviare.",
    "hours": "Ore",
    "minutes": "Minuti",
    "seconds": "Secondi",
    "presets": "Preset rapidi",
    "presetMinutes": "{minutes} min"
  },
  "ja": {
    "durationTitle": "時間",
    "durationHint": "開始前にカウントダウン時間を設定してください。",
    "hours": "時間",
    "minutes": "分",
    "seconds": "秒",
    "presets": "クイックプリセット",
    "presetMinutes": "{minutes} 分"
  },
  "ko": {
    "durationTitle": "시간",
    "durationHint": "시작 전에 카운트다운 시간을 설정하세요.",
    "hours": "시간",
    "minutes": "분",
    "seconds": "초",
    "presets": "빠른 프리셋",
    "presetMinutes": "{minutes}분"
  },
  "ru": {
    "durationTitle": "Длительность",
    "durationHint": "Задайте длительность перед запуском.",
    "hours": "Часы",
    "minutes": "Минуты",
    "seconds": "Секунды",
    "presets": "Быстрые пресеты",
    "presetMinutes": "{minutes} мин"
  },
  "pt": {
    "durationTitle": "Duração",
    "durationHint": "Defina a duração antes de iniciar.",
    "hours": "Horas",
    "minutes": "Minutos",
    "seconds": "Segundos",
    "presets": "Predefinições rápidas",
    "presetMinutes": "{minutes} min"
  },
  "ar": {
    "durationTitle": "المدة",
    "durationHint": "اضبط مدة العد التنازلي قبل البدء.",
    "hours": "ساعات",
    "minutes": "دقائق",
    "seconds": "ثوانٍ",
    "presets": "إعدادات سريعة",
    "presetMinutes": "{minutes} دقيقة"
  },
  "hi": {
    "durationTitle": "अवधि",
    "durationHint": "शुरू करने से पहले अवधि सेट करें।",
    "hours": "घंटे",
    "minutes": "मिनट",
    "seconds": "सेकंड",
    "presets": "त्वरित प्रीसेट",
    "presetMinutes": "{minutes} मिनट"
  },
  "tr": {
    "durationTitle": "Süre",
    "durationHint": "Başlatmadan önce süreyi ayarlayın.",
    "hours": "Saat",
    "minutes": "Dakika",
    "seconds": "Saniye",
    "presets": "Hızlı ayarlar",
    "presetMinutes": "{minutes} dk"
  },
  "nl": {
    "durationTitle": "Duur",
    "durationHint": "Stel de duur in voordat je start.",
    "hours": "Uren",
    "minutes": "Minuten",
    "seconds": "Seconden",
    "presets": "Snelle presets",
    "presetMinutes": "{minutes} min"
  },
  "sv": {
    "durationTitle": "Varaktighet",
    "durationHint": "Ställ in varaktigheten innan du startar.",
    "hours": "Timmar",
    "minutes": "Minuter",
    "seconds": "Sekunder",
    "presets": "Snabbval",
    "presetMinutes": "{minutes} min"
  },
  "pl": {
    "durationTitle": "Czas",
    "durationHint": "Ustaw czas przed rozpoczęciem.",
    "hours": "Godziny",
    "minutes": "Minuty",
    "seconds": "Sekundy",
    "presets": "Szybkie ustawienia",
    "presetMinutes": "{minutes} min"
  },
  "vi": {
    "durationTitle": "Thời lượng",
    "durationHint": "Hãy đặt thời lượng trước khi bắt đầu.",
    "hours": "Giờ",
    "minutes": "Phút",
    "seconds": "Giây",
    "presets": "Cài đặt nhanh",
    "presetMinutes": "{minutes} phút"
  },
  "th": {
    "durationTitle": "ระยะเวลา",
    "durationHint": "ตั้งระยะเวลาก่อนเริ่มนับถอยหลัง",
    "hours": "ชั่วโมง",
    "minutes": "นาที",
    "seconds": "วินาที",
    "presets": "ตั้งค่าด่วน",
    "presetMinutes": "{minutes} นาที"
  },
  "id": {
    "durationTitle": "Durasi",
    "durationHint": "Atur durasi sebelum memulai.",
    "hours": "Jam",
    "minutes": "Menit",
    "seconds": "Detik",
    "presets": "Preset cepat",
    "presetMinutes": "{minutes} menit"
  },
  "he": {
    "durationTitle": "משך",
    "durationHint": "הגדר משך לפני ההתחלה.",
    "hours": "שעות",
    "minutes": "דקות",
    "seconds": "שניות",
    "presets": "קיצורים",
    "presetMinutes": "{minutes} דק'"
  },
  "ms": {
    "durationTitle": "Tempoh",
    "durationHint": "Tetapkan tempoh sebelum mula.",
    "hours": "Jam",
    "minutes": "Minit",
    "seconds": "Saat",
    "presets": "Pratetap pantas",
    "presetMinutes": "{minutes} min"
  },
  "no": {
    "durationTitle": "Varighet",
    "durationHint": "Angi varighet før du starter.",
    "hours": "Timer",
    "minutes": "Minutter",
    "seconds": "Sekunder",
    "presets": "Hurtigvalg",
    "presetMinutes": "{minutes} min"
  }
}
</i18n>
