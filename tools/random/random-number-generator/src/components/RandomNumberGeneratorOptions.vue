<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="16">
      <RandomNumberGeneratorPresets @apply-preset="applyPreset" />

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('min')" :show-feedback="false">
          <n-input-number
            v-model:value="minValue"
            :step="inputStep"
            :precision="inputPrecision"
            style="width: 100%"
            data-testid="min-input"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('max')" :show-feedback="false">
          <n-input-number
            v-model:value="maxValue"
            :step="inputStep"
            :precision="inputPrecision"
            style="width: 100%"
            data-testid="max-input"
          />
        </n-form-item-gi>
      </n-grid>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('count')" :show-feedback="false">
          <n-input-number
            v-model:value="count"
            :min="1"
            :max="maxCount"
            :step="1"
            style="width: 100%"
            data-testid="count-input"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('allowRepeat')" :show-feedback="false">
          <n-switch v-model:value="allowRepeat" data-testid="allow-repeat" />
        </n-form-item-gi>
      </n-grid>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('numberType')" :show-feedback="false">
          <n-radio-group v-model:value="numberType" data-testid="number-type">
            <n-radio-button value="integer">{{ t('integer') }}</n-radio-button>
            <n-radio-button value="decimal">{{ t('decimal') }}</n-radio-button>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi
          v-if="numberType === 'decimal'"
          :label="t('decimalPlaces')"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="decimalPlaces"
            :min="0"
            :max="maxDecimalPlaces"
            :step="1"
            style="width: 100%"
            data-testid="decimal-places"
          />
        </n-form-item-gi>
      </n-grid>

      <n-alert v-if="rangeError" type="error">
        {{ rangeError }}
      </n-alert>
      <n-alert v-else-if="countError" type="error">
        {{ countError }}
      </n-alert>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NFlex,
  NFormItemGi,
  NGrid,
  NInputNumber,
  NRadioButton,
  NRadioGroup,
  NSwitch,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import RandomNumberGeneratorPresets from './RandomNumberGeneratorPresets.vue'

type NumberType = 'integer' | 'decimal'

type PresetOption = 'dice' | 'ten' | 'hundred' | 'lotto'

defineProps<{
  inputStep: number
  inputPrecision: number
  maxCount: number
  maxDecimalPlaces: number
  rangeError: string
  countError: string
}>()

const emit = defineEmits<{
  (event: 'apply-preset', preset: PresetOption): void
}>()

const minValue = defineModel<number | null>('minValue', { required: true })
const maxValue = defineModel<number | null>('maxValue', { required: true })
const count = defineModel<number | null>('count', { required: true })
const allowRepeat = defineModel<boolean>('allowRepeat', { required: true })
const numberType = defineModel<NumberType>('numberType', { required: true })
const decimalPlaces = defineModel<number | null>('decimalPlaces', { required: true })

const { t } = useI18n()

const applyPreset = (preset: PresetOption) => {
  emit('apply-preset', preset)
}
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "min": "Min",
    "max": "Max",
    "count": "Count",
    "allowRepeat": "Allow duplicates",
    "numberType": "Number Type",
    "integer": "Integer",
    "decimal": "Decimal",
    "decimalPlaces": "Decimal Places"
  },
  "zh": {
    "options": "选项",
    "min": "最小值",
    "max": "最大值",
    "count": "数量",
    "allowRepeat": "允许重复",
    "numberType": "数字类型",
    "integer": "整数",
    "decimal": "小数",
    "decimalPlaces": "小数位数"
  },
  "zh-CN": {
    "options": "选项",
    "min": "最小值",
    "max": "最大值",
    "count": "数量",
    "allowRepeat": "允许重复",
    "numberType": "数字类型",
    "integer": "整数",
    "decimal": "小数",
    "decimalPlaces": "小数位数"
  },
  "zh-TW": {
    "options": "選項",
    "min": "最小值",
    "max": "最大值",
    "count": "數量",
    "allowRepeat": "允許重複",
    "numberType": "數字類型",
    "integer": "整數",
    "decimal": "小數",
    "decimalPlaces": "小數位數"
  },
  "zh-HK": {
    "options": "選項",
    "min": "最小值",
    "max": "最大值",
    "count": "數量",
    "allowRepeat": "允許重複",
    "numberType": "數字類型",
    "integer": "整數",
    "decimal": "小數",
    "decimalPlaces": "小數位數"
  },
  "es": {
    "options": "Opciones",
    "min": "Mínimo",
    "max": "Máximo",
    "count": "Cantidad",
    "allowRepeat": "Permitir repetidos",
    "numberType": "Tipo de número",
    "integer": "Entero",
    "decimal": "Decimal",
    "decimalPlaces": "Decimales"
  },
  "fr": {
    "options": "Options",
    "min": "Min",
    "max": "Max",
    "count": "Quantité",
    "allowRepeat": "Autoriser les doublons",
    "numberType": "Type de nombre",
    "integer": "Entier",
    "decimal": "Décimal",
    "decimalPlaces": "Décimales"
  },
  "de": {
    "options": "Optionen",
    "min": "Minimum",
    "max": "Maximum",
    "count": "Anzahl",
    "allowRepeat": "Wiederholungen erlauben",
    "numberType": "Zahlentyp",
    "integer": "Ganzzahl",
    "decimal": "Dezimal",
    "decimalPlaces": "Dezimalstellen"
  },
  "it": {
    "options": "Opzioni",
    "min": "Min",
    "max": "Max",
    "count": "Quantità",
    "allowRepeat": "Consenti duplicati",
    "numberType": "Tipo di numero",
    "integer": "Intero",
    "decimal": "Decimale",
    "decimalPlaces": "Cifre decimali"
  },
  "ja": {
    "options": "オプション",
    "min": "最小",
    "max": "最大",
    "count": "個数",
    "allowRepeat": "重複を許可",
    "numberType": "数値タイプ",
    "integer": "整数",
    "decimal": "小数",
    "decimalPlaces": "小数点以下"
  },
  "ko": {
    "options": "옵션",
    "min": "최소",
    "max": "최대",
    "count": "개수",
    "allowRepeat": "중복 허용",
    "numberType": "숫자 유형",
    "integer": "정수",
    "decimal": "소수",
    "decimalPlaces": "소수 자릿수"
  },
  "ru": {
    "options": "Параметры",
    "min": "Мин",
    "max": "Макс",
    "count": "Количество",
    "allowRepeat": "Разрешить повторы",
    "numberType": "Тип числа",
    "integer": "Целое",
    "decimal": "Десятичное",
    "decimalPlaces": "Знаков после запятой"
  },
  "pt": {
    "options": "Opções",
    "min": "Mínimo",
    "max": "Máximo",
    "count": "Quantidade",
    "allowRepeat": "Permitir repetidos",
    "numberType": "Tipo de número",
    "integer": "Inteiro",
    "decimal": "Decimal",
    "decimalPlaces": "Casas decimais"
  },
  "ar": {
    "options": "الخيارات",
    "min": "الحد الأدنى",
    "max": "الحد الأقصى",
    "count": "العدد",
    "allowRepeat": "السماح بالتكرار",
    "numberType": "نوع الرقم",
    "integer": "عدد صحيح",
    "decimal": "عشري",
    "decimalPlaces": "خانات عشرية"
  },
  "hi": {
    "options": "विकल्प",
    "min": "न्यूनतम",
    "max": "अधिकतम",
    "count": "संख्या",
    "allowRepeat": "दोहराव की अनुमति",
    "numberType": "संख्या प्रकार",
    "integer": "पूर्णांक",
    "decimal": "दशमलव",
    "decimalPlaces": "दशमलव स्थान"
  },
  "tr": {
    "options": "Seçenekler",
    "min": "Minimum",
    "max": "Maksimum",
    "count": "Adet",
    "allowRepeat": "Tekrara izin ver",
    "numberType": "Sayı türü",
    "integer": "Tam sayı",
    "decimal": "Ondalık",
    "decimalPlaces": "Ondalık basamak"
  },
  "nl": {
    "options": "Opties",
    "min": "Minimum",
    "max": "Maximum",
    "count": "Aantal",
    "allowRepeat": "Duplicaten toestaan",
    "numberType": "Getaltype",
    "integer": "Geheel",
    "decimal": "Decimaal",
    "decimalPlaces": "Decimalen"
  },
  "sv": {
    "options": "Alternativ",
    "min": "Min",
    "max": "Max",
    "count": "Antal",
    "allowRepeat": "Tillåt dubbletter",
    "numberType": "Taltyp",
    "integer": "Heltal",
    "decimal": "Decimal",
    "decimalPlaces": "Decimaler"
  },
  "pl": {
    "options": "Opcje",
    "min": "Min",
    "max": "Max",
    "count": "Liczba",
    "allowRepeat": "Zezwalaj na powtórzenia",
    "numberType": "Typ liczby",
    "integer": "Całkowita",
    "decimal": "Dziesiętna",
    "decimalPlaces": "Miejsca dziesiętne"
  },
  "vi": {
    "options": "Tùy chọn",
    "min": "Tối thiểu",
    "max": "Tối đa",
    "count": "Số lượng",
    "allowRepeat": "Cho phép trùng lặp",
    "numberType": "Loại số",
    "integer": "Số nguyên",
    "decimal": "Số thập phân",
    "decimalPlaces": "Chữ số thập phân"
  },
  "th": {
    "options": "ตัวเลือก",
    "min": "ต่ำสุด",
    "max": "สูงสุด",
    "count": "จำนวน",
    "allowRepeat": "อนุญาตซ้ำ",
    "numberType": "ชนิดตัวเลข",
    "integer": "จำนวนเต็ม",
    "decimal": "ทศนิยม",
    "decimalPlaces": "ตำแหน่งทศนิยม"
  },
  "id": {
    "options": "Opsi",
    "min": "Minimum",
    "max": "Maksimum",
    "count": "Jumlah",
    "allowRepeat": "Izinkan duplikat",
    "numberType": "Jenis angka",
    "integer": "Bilangan bulat",
    "decimal": "Desimal",
    "decimalPlaces": "Jumlah desimal"
  },
  "he": {
    "options": "אפשרויות",
    "min": "מינימום",
    "max": "מקסימום",
    "count": "כמות",
    "allowRepeat": "לאפשר כפילויות",
    "numberType": "סוג מספר",
    "integer": "שלם",
    "decimal": "עשרוני",
    "decimalPlaces": "ספרות עשרוניות"
  },
  "ms": {
    "options": "Pilihan",
    "min": "Minimum",
    "max": "Maksimum",
    "count": "Jumlah",
    "allowRepeat": "Benarkan pendua",
    "numberType": "Jenis nombor",
    "integer": "Integer",
    "decimal": "Perpuluhan",
    "decimalPlaces": "Tempat perpuluhan"
  },
  "no": {
    "options": "Alternativer",
    "min": "Minimum",
    "max": "Maksimum",
    "count": "Antall",
    "allowRepeat": "Tillat duplikater",
    "numberType": "Talltype",
    "integer": "Heltall",
    "decimal": "Desimal",
    "decimalPlaces": "Desimaler"
  }
}
</i18n>
