<template>
  <RandomNumberGeneratorOptions
    v-model:min-value="minValue"
    v-model:max-value="maxValue"
    v-model:count="count"
    v-model:allow-repeat="allowRepeat"
    v-model:number-type="numberType"
    v-model:decimal-places="decimalPlaces"
    :input-step="inputStep"
    :input-precision="inputPrecision"
    :max-count="maxCount"
    :max-decimal-places="maxDecimalPlaces"
    :range-error="rangeError"
    :count-error="countError"
    @apply-preset="applyPreset"
  />
  <RandomNumberGeneratorResults
    :formatted-numbers="formattedNumbers"
    :output-text="outputText"
    :can-roll="canRoll"
    :is-rolling="isRolling"
    :rolling-label="rollingLabel"
    :rolling-icon="rollingIcon"
    @toggle-rolling="toggleRolling"
    @open-fullscreen="openFullscreen"
  />
  <RandomNumberGeneratorHistory :history-entries="historyEntries" @clear-history="clearHistory" />
  <RandomNumberGeneratorFullscreen
    v-if="isFullscreen"
    :formatted-numbers="formattedNumbers"
    :can-roll="canRoll"
    :is-rolling="isRolling"
    :rolling-label="rollingLabel"
    :rolling-icon="rollingIcon"
    @toggle-rolling="toggleRolling"
    @close="closeFullscreen"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RandomNumberGeneratorFullscreen from './RandomNumberGeneratorFullscreen.vue'
import RandomNumberGeneratorHistory from './RandomNumberGeneratorHistory.vue'
import RandomNumberGeneratorOptions from './RandomNumberGeneratorOptions.vue'
import RandomNumberGeneratorResults from './RandomNumberGeneratorResults.vue'
import { useRandomNumberGenerator } from '../composables/useRandomNumberGenerator'

const { t } = useI18n()
const messages = {
  rangeError: () => t('rangeError'),
  countError: (range: number) => t('countError', { range }),
  startRandom: () => t('startRandom'),
  stopRandom: () => t('stopRandom'),
}

const {
  minValue,
  maxValue,
  count,
  allowRepeat,
  numberType,
  decimalPlaces,
  historyEntries,
  inputStep,
  inputPrecision,
  maxCount,
  maxDecimalPlaces,
  rangeError,
  countError,
  formattedNumbers,
  outputText,
  isFullscreen,
  openFullscreen,
  closeFullscreen,
  canRoll,
  isRolling,
  rollingLabel,
  rollingIcon,
  toggleRolling,
  clearHistory,
  applyPreset,
} = useRandomNumberGenerator(messages)
</script>

<i18n lang="json">
{
  "en": {
    "rangeError": "Min must be less than or equal to Max.",
    "countError": "Count exceeds the number of unique values in the range ({range}).",
    "startRandom": "Start random",
    "stopRandom": "Stop random"
  },
  "zh": {
    "rangeError": "最小值必须小于或等于最大值。",
    "countError": "数量超过了范围内唯一值的数量（{range}）。",
    "startRandom": "开始随机",
    "stopRandom": "结束随机"
  },
  "zh-CN": {
    "rangeError": "最小值必须小于或等于最大值。",
    "countError": "数量超过了范围内唯一值的数量（{range}）。",
    "startRandom": "开始随机",
    "stopRandom": "结束随机"
  },
  "zh-TW": {
    "rangeError": "最小值必須小於或等於最大值。",
    "countError": "數量超過範圍內唯一值的數量（{range}）。",
    "startRandom": "開始隨機",
    "stopRandom": "結束隨機"
  },
  "zh-HK": {
    "rangeError": "最小值必須小於或等於最大值。",
    "countError": "數量超過範圍內唯一值的數量（{range}）。",
    "startRandom": "開始隨機",
    "stopRandom": "結束隨機"
  },
  "es": {
    "rangeError": "El mínimo debe ser menor o igual que el máximo.",
    "countError": "La cantidad supera los valores únicos del rango ({range}).",
    "startRandom": "Iniciar aleatorio",
    "stopRandom": "Detener aleatorio"
  },
  "fr": {
    "rangeError": "Le minimum doit être inférieur ou égal au maximum.",
    "countError": "La quantité dépasse les valeurs uniques de la plage ({range}).",
    "startRandom": "Démarrer aléatoire",
    "stopRandom": "Arrêter aléatoire"
  },
  "de": {
    "rangeError": "Minimum muss kleiner oder gleich Maximum sein.",
    "countError": "Die Anzahl überschreitet die eindeutigen Werte im Bereich ({range}).",
    "startRandom": "Zufall starten",
    "stopRandom": "Zufall stoppen"
  },
  "it": {
    "rangeError": "Il minimo deve essere minore o uguale al massimo.",
    "countError": "La quantità supera i valori unici nell'intervallo ({range}).",
    "startRandom": "Avvia casuale",
    "stopRandom": "Ferma casuale"
  },
  "ja": {
    "rangeError": "最小値は最大値以下である必要があります。",
    "countError": "個数が範囲内のユニーク値数（{range}）を超えています。",
    "startRandom": "ランダム開始",
    "stopRandom": "ランダム停止"
  },
  "ko": {
    "rangeError": "최소값은 최대값보다 작거나 같아야 합니다.",
    "countError": "개수가 범위 내 고유 값 수({range})를 초과합니다.",
    "startRandom": "랜덤 시작",
    "stopRandom": "랜덤 중지"
  },
  "ru": {
    "rangeError": "Минимум должен быть меньше или равен максимуму.",
    "countError": "Количество превышает число уникальных значений в диапазоне ({range}).",
    "startRandom": "Начать случайно",
    "stopRandom": "Остановить случайно"
  },
  "pt": {
    "rangeError": "O mínimo deve ser menor ou igual ao máximo.",
    "countError": "A quantidade excede os valores únicos do intervalo ({range}).",
    "startRandom": "Iniciar aleatório",
    "stopRandom": "Parar aleatório"
  },
  "ar": {
    "rangeError": "يجب أن يكون الحد الأدنى أقل من أو يساوي الحد الأقصى.",
    "countError": "العدد يتجاوز القيم الفريدة ضمن النطاق ({range}).",
    "startRandom": "بدء عشوائي",
    "stopRandom": "إيقاف عشوائي"
  },
  "hi": {
    "rangeError": "न्यूनतम मान अधिकतम से कम या बराबर होना चाहिए।",
    "countError": "संख्या सीमा में अद्वितीय मानों ({range}) से अधिक है।",
    "startRandom": "रैंडम शुरू करें",
    "stopRandom": "रैंडम रोकें"
  },
  "tr": {
    "rangeError": "Minimum, maksimumdan küçük veya eşit olmalıdır.",
    "countError": "Adet, aralıktaki benzersiz değerleri aşıyor ({range}).",
    "startRandom": "Rastgele başlat",
    "stopRandom": "Rastgele durdur"
  },
  "nl": {
    "rangeError": "Minimum moet kleiner dan of gelijk zijn aan maximum.",
    "countError": "Aantal overschrijdt het aantal unieke waarden in het bereik ({range}).",
    "startRandom": "Willekeurig starten",
    "stopRandom": "Willekeurig stoppen"
  },
  "sv": {
    "rangeError": "Min måste vara mindre än eller lika med max.",
    "countError": "Antalet överskrider unika värden i intervallet ({range}).",
    "startRandom": "Starta slump",
    "stopRandom": "Stoppa slump"
  },
  "pl": {
    "rangeError": "Minimum musi być mniejsze lub równe maksimum.",
    "countError": "Liczba przekracza unikalne wartości w zakresie ({range}).",
    "startRandom": "Uruchom losowo",
    "stopRandom": "Zatrzymaj losowo"
  },
  "vi": {
    "rangeError": "Giá trị tối thiểu phải nhỏ hơn hoặc bằng giá trị tối đa.",
    "countError": "Số lượng vượt quá số giá trị duy nhất trong phạm vi ({range}).",
    "startRandom": "Bắt đầu ngẫu nhiên",
    "stopRandom": "Dừng ngẫu nhiên"
  },
  "th": {
    "rangeError": "ค่าต่ำสุดต้องน้อยกว่าหรือเท่ากับค่าสูงสุด",
    "countError": "จำนวนเกินค่าที่ไม่ซ้ำในช่วง ({range})",
    "startRandom": "เริ่มสุ่ม",
    "stopRandom": "หยุดสุ่ม"
  },
  "id": {
    "rangeError": "Minimum harus kurang dari atau sama dengan maksimum.",
    "countError": "Jumlah melebihi nilai unik dalam rentang ({range}).",
    "startRandom": "Mulai acak",
    "stopRandom": "Hentikan acak"
  },
  "he": {
    "rangeError": "המינימום חייב להיות קטן או שווה למקסימום.",
    "countError": "הכמות חורגת ממספר הערכים הייחודיים בטווח ({range}).",
    "startRandom": "התחל אקראי",
    "stopRandom": "עצור אקראי"
  },
  "ms": {
    "rangeError": "Minimum mesti kurang atau sama dengan maksimum.",
    "countError": "Jumlah melebihi nilai unik dalam julat ({range}).",
    "startRandom": "Mula rawak",
    "stopRandom": "Henti rawak"
  },
  "no": {
    "rangeError": "Minimum må være mindre enn eller lik maksimum.",
    "countError": "Antallet overstiger unike verdier i området ({range}).",
    "startRandom": "Start tilfeldig",
    "stopRandom": "Stopp tilfeldig"
  }
}
</i18n>
