<template>
  <n-flex align="center" :size="12" wrap>
    <n-tag :type="scoreTagType" size="small">
      {{ strengthLabel }}
    </n-tag>
    <n-text depth="3">{{ t('entropy-bits', { bits: entropyBits }) }}</n-text>
    <n-text depth="3">{{ t('log10-guesses', { value: log10Guesses }) }}</n-text>
  </n-flex>

  <div class="strength-meter" role="presentation">
    <div
      class="strength-meter-fill"
      :class="`score-${analysis.score}`"
      :style="{ width: `${scorePercent}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { StrengthReport } from '../utils'

const { t } = useI18n()

const props = defineProps<{
  analysis: StrengthReport
}>()

const strengthLabel = computed(() => {
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  return t(`strength-${props.analysis.score}`)
})

const scorePercent = computed(() => (props.analysis.score + 1) * 20)

const scoreTagType = computed(() => {
  const scoreMap = ['error', 'warning', 'info', 'success', 'success'] as const
  return scoreMap[props.analysis.score]
})

const entropyBits = computed(() => props.analysis.entropyBits.toFixed(1))
const log10Guesses = computed(() => props.analysis.log10Guesses.toFixed(1))
</script>

<style scoped>
.strength-meter {
  height: 10px;
  background-color: var(--n-border-color);
  border-radius: 999px;
  overflow: hidden;
}

.strength-meter-fill {
  height: 100%;
  transition: width 0.2s ease;
}

.strength-meter-fill.score-0 {
  background-color: #d92d20;
}

.strength-meter-fill.score-1 {
  background-color: #f79009;
}

.strength-meter-fill.score-2 {
  background-color: #fdb022;
}

.strength-meter-fill.score-3 {
  background-color: #32d583;
}

.strength-meter-fill.score-4 {
  background-color: #12b76a;
}
</style>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "strength-0": "Very weak",
    "strength-1": "Weak",
    "strength-2": "Fair",
    "strength-3": "Strong",
    "strength-4": "Very strong",
    "entropy-bits": "Entropy: {bits} bits",
    "log10-guesses": "Guesses (log10): {value}"
  },
  "zh": {
    "strength-0": "非常弱",
    "strength-1": "较弱",
    "strength-2": "一般",
    "strength-3": "强",
    "strength-4": "非常强",
    "entropy-bits": "熵值：{bits} 位",
    "log10-guesses": "猜测次数（log10）：{value}"
  },
  "zh-CN": {
    "strength-0": "非常弱",
    "strength-1": "较弱",
    "strength-2": "一般",
    "strength-3": "强",
    "strength-4": "非常强",
    "entropy-bits": "熵值：{bits} 位",
    "log10-guesses": "猜测次数（log10）：{value}"
  },
  "zh-TW": {
    "strength-0": "非常弱",
    "strength-1": "較弱",
    "strength-2": "一般",
    "strength-3": "強",
    "strength-4": "非常強",
    "entropy-bits": "熵值：{bits} 位",
    "log10-guesses": "猜測次數（log10）：{value}"
  },
  "zh-HK": {
    "strength-0": "非常弱",
    "strength-1": "較弱",
    "strength-2": "一般",
    "strength-3": "強",
    "strength-4": "非常強",
    "entropy-bits": "熵值：{bits} 位",
    "log10-guesses": "猜測次數（log10）：{value}"
  },
  "es": {
    "strength-0": "Muy débil",
    "strength-1": "Débil",
    "strength-2": "Aceptable",
    "strength-3": "Fuerte",
    "strength-4": "Muy fuerte",
    "entropy-bits": "Entropía: {bits} bits",
    "log10-guesses": "Intentos (log10): {value}"
  },
  "fr": {
    "strength-0": "Très faible",
    "strength-1": "Faible",
    "strength-2": "Moyenne",
    "strength-3": "Forte",
    "strength-4": "Très forte",
    "entropy-bits": "Entropie : {bits} bits",
    "log10-guesses": "Essais (log10) : {value}"
  },
  "de": {
    "strength-0": "Sehr schwach",
    "strength-1": "Schwach",
    "strength-2": "Mittel",
    "strength-3": "Stark",
    "strength-4": "Sehr stark",
    "entropy-bits": "Entropie: {bits} Bits",
    "log10-guesses": "Versuche (log10): {value}"
  },
  "it": {
    "strength-0": "Molto debole",
    "strength-1": "Debole",
    "strength-2": "Discreta",
    "strength-3": "Forte",
    "strength-4": "Molto forte",
    "entropy-bits": "Entropia: {bits} bit",
    "log10-guesses": "Tentativi (log10): {value}"
  },
  "ja": {
    "strength-0": "非常に弱い",
    "strength-1": "弱い",
    "strength-2": "普通",
    "strength-3": "強い",
    "strength-4": "非常に強い",
    "entropy-bits": "エントロピー: {bits} ビット",
    "log10-guesses": "推測回数（log10）: {value}"
  },
  "ko": {
    "strength-0": "매우 약함",
    "strength-1": "약함",
    "strength-2": "보통",
    "strength-3": "강함",
    "strength-4": "매우 강함",
    "entropy-bits": "엔트로피: {bits}비트",
    "log10-guesses": "추측 횟수(log10): {value}"
  },
  "ru": {
    "strength-0": "Очень слабый",
    "strength-1": "Слабый",
    "strength-2": "Средний",
    "strength-3": "Сильный",
    "strength-4": "Очень сильный",
    "entropy-bits": "Энтропия: {bits} бит",
    "log10-guesses": "Попытки (log10): {value}"
  },
  "pt": {
    "strength-0": "Muito fraca",
    "strength-1": "Fraca",
    "strength-2": "Regular",
    "strength-3": "Forte",
    "strength-4": "Muito forte",
    "entropy-bits": "Entropia: {bits} bits",
    "log10-guesses": "Tentativas (log10): {value}"
  },
  "ar": {
    "strength-0": "ضعيفة جدًا",
    "strength-1": "ضعيفة",
    "strength-2": "متوسطة",
    "strength-3": "قوية",
    "strength-4": "قوية جدًا",
    "entropy-bits": "الإنتروبيا: {bits} بت",
    "log10-guesses": "محاولات (log10): {value}"
  },
  "hi": {
    "strength-0": "बहुत कमजोर",
    "strength-1": "कमजोर",
    "strength-2": "ठीक-ठाक",
    "strength-3": "मजबूत",
    "strength-4": "बहुत मजबूत",
    "entropy-bits": "एंट्रॉपी: {bits} बिट",
    "log10-guesses": "अनुमान (log10): {value}"
  },
  "tr": {
    "strength-0": "Çok zayıf",
    "strength-1": "Zayıf",
    "strength-2": "Orta",
    "strength-3": "Güçlü",
    "strength-4": "Çok güçlü",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Tahmin (log10): {value}"
  },
  "nl": {
    "strength-0": "Zeer zwak",
    "strength-1": "Zwak",
    "strength-2": "Redelijk",
    "strength-3": "Sterk",
    "strength-4": "Zeer sterk",
    "entropy-bits": "Entropie: {bits} bits",
    "log10-guesses": "Gissingen (log10): {value}"
  },
  "sv": {
    "strength-0": "Mycket svagt",
    "strength-1": "Svagt",
    "strength-2": "Okej",
    "strength-3": "Starkt",
    "strength-4": "Mycket starkt",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Gissningar (log10): {value}"
  },
  "pl": {
    "strength-0": "Bardzo słabe",
    "strength-1": "Słabe",
    "strength-2": "Przeciętne",
    "strength-3": "Silne",
    "strength-4": "Bardzo silne",
    "entropy-bits": "Entropia: {bits} bitów",
    "log10-guesses": "Próby (log10): {value}"
  },
  "vi": {
    "strength-0": "Rất yếu",
    "strength-1": "Yếu",
    "strength-2": "Trung bình",
    "strength-3": "Mạnh",
    "strength-4": "Rất mạnh",
    "entropy-bits": "Entropy: {bits} bit",
    "log10-guesses": "Số lần đoán (log10): {value}"
  },
  "th": {
    "strength-0": "อ่อนมาก",
    "strength-1": "อ่อน",
    "strength-2": "ปานกลาง",
    "strength-3": "แข็งแรง",
    "strength-4": "แข็งแรงมาก",
    "entropy-bits": "เอนโทรปี: {bits} บิต",
    "log10-guesses": "จำนวนเดา (log10): {value}"
  },
  "id": {
    "strength-0": "Sangat lemah",
    "strength-1": "Lemah",
    "strength-2": "Cukup",
    "strength-3": "Kuat",
    "strength-4": "Sangat kuat",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Perkiraan (log10): {value}"
  },
  "he": {
    "strength-0": "חלשה מאוד",
    "strength-1": "חלשה",
    "strength-2": "בינונית",
    "strength-3": "חזקה",
    "strength-4": "חזקה מאוד",
    "entropy-bits": "אנטרופיה: {bits} ביט",
    "log10-guesses": "ניסיונות (log10): {value}"
  },
  "ms": {
    "strength-0": "Sangat lemah",
    "strength-1": "Lemah",
    "strength-2": "Sederhana",
    "strength-3": "Kuat",
    "strength-4": "Sangat kuat",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Tebakan (log10): {value}"
  },
  "no": {
    "strength-0": "Svært svakt",
    "strength-1": "Svakt",
    "strength-2": "Greit",
    "strength-3": "Sterkt",
    "strength-4": "Svært sterkt",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Gjetninger (log10): {value}"
  }
}
</i18n>
