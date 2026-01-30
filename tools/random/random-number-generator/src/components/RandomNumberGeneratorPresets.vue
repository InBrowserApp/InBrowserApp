<template>
  <n-flex align="center" :size="12" wrap>
    <n-text depth="3">{{ t('presets') }}</n-text>
    <n-button size="small" @click="emit('apply-preset', 'dice')" data-testid="preset-dice">
      {{ t('presetDice') }}
    </n-button>
    <n-button size="small" @click="emit('apply-preset', 'ten')" data-testid="preset-ten">
      {{ t('presetTen') }}
    </n-button>
    <n-button size="small" @click="emit('apply-preset', 'hundred')" data-testid="preset-hundred">
      {{ t('presetHundred') }}
    </n-button>
    <n-button size="small" @click="emit('apply-preset', 'lotto')" data-testid="preset-lotto">
      {{ t('presetLotto') }}
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NText } from 'naive-ui'

type PresetOption = 'dice' | 'ten' | 'hundred' | 'lotto'

const emit = defineEmits<{
  (event: 'apply-preset', preset: PresetOption): void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "presets": "Presets",
    "presetDice": "Dice (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Pick 6 (1-49)"
  },
  "zh": {
    "presets": "预设",
    "presetDice": "骰子（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "选 6（1-49）"
  },
  "zh-CN": {
    "presets": "预设",
    "presetDice": "骰子（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "选 6（1-49）"
  },
  "zh-TW": {
    "presets": "預設",
    "presetDice": "骰子（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "選 6（1-49）"
  },
  "zh-HK": {
    "presets": "預設",
    "presetDice": "骰子（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "選 6（1-49）"
  },
  "es": {
    "presets": "Preajustes",
    "presetDice": "Dado (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Elige 6 (1-49)"
  },
  "fr": {
    "presets": "Préréglages",
    "presetDice": "Dé (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Choisir 6 (1-49)"
  },
  "de": {
    "presets": "Voreinstellungen",
    "presetDice": "Würfel (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6 ziehen (1-49)"
  },
  "it": {
    "presets": "Preset",
    "presetDice": "Dado (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Scegli 6 (1-49)"
  },
  "ja": {
    "presets": "プリセット",
    "presetDice": "サイコロ（1-6）",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6つ選ぶ（1-49）"
  },
  "ko": {
    "presets": "프리셋",
    "presetDice": "주사위(1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6개 선택(1-49)"
  },
  "ru": {
    "presets": "Пресеты",
    "presetDice": "Кубик (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Выбрать 6 (1-49)"
  },
  "pt": {
    "presets": "Predefinições",
    "presetDice": "Dado (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Escolher 6 (1-49)"
  },
  "ar": {
    "presets": "إعدادات مسبقة",
    "presetDice": "نرد (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "اختر 6 (1-49)"
  },
  "hi": {
    "presets": "प्रीसेट",
    "presetDice": "पासा (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6 चुनें (1-49)"
  },
  "tr": {
    "presets": "Ön ayarlar",
    "presetDice": "Zar (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "6 seç (1-49)"
  },
  "nl": {
    "presets": "Voorinstellingen",
    "presetDice": "Dobbelsteen (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Kies 6 (1-49)"
  },
  "sv": {
    "presets": "Förinställningar",
    "presetDice": "Tärning (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Välj 6 (1-49)"
  },
  "pl": {
    "presets": "Ustawienia",
    "presetDice": "Kostka (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Wybierz 6 (1-49)"
  },
  "vi": {
    "presets": "Mẫu",
    "presetDice": "Xúc xắc (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Chọn 6 (1-49)"
  },
  "th": {
    "presets": "พรีเซ็ต",
    "presetDice": "ลูกเต๋า (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "เลือก 6 (1-49)"
  },
  "id": {
    "presets": "Preset",
    "presetDice": "Dadu (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Pilih 6 (1-49)"
  },
  "he": {
    "presets": "הגדרות מראש",
    "presetDice": "קובייה (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "בחר 6 (1-49)"
  },
  "ms": {
    "presets": "Pratetap",
    "presetDice": "Dadu (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Pilih 6 (1-49)"
  },
  "no": {
    "presets": "Forhåndsinnstillinger",
    "presetDice": "Terning (1-6)",
    "presetTen": "1-10",
    "presetHundred": "1-100",
    "presetLotto": "Velg 6 (1-49)"
  }
}
</i18n>
