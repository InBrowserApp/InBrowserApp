<template>
  <div>
    <ToolSectionHeader>{{ t('unit') }}</ToolSectionHeader>
    <ToolSection>
      <n-radio-group v-model:value="unit">
        <n-flex :size="16">
          <n-radio value="auto">{{ t('auto') }}</n-radio>
          <n-radio value="seconds">{{ t('seconds') }}</n-radio>
          <n-radio value="milliseconds">{{ t('milliseconds') }}</n-radio>
          <n-radio value="nanoseconds">{{ t('nanoseconds') }}</n-radio>
        </n-flex>
      </n-radio-group>
    </ToolSection>
    <ToolSection v-if="props.showDetected">
      <n-text depth="3">
        {{ t('detected') }}: {{ detectedUnitLabel }} ({{ props.digitCount }} {{ t('digits') }})
      </n-text>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NRadioGroup, NRadio, NFlex, NText } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'

type TimestampUnit = 'auto' | 'seconds' | 'milliseconds' | 'nanoseconds'

const props = defineProps<{
  showDetected: boolean
  detectedUnit: TimestampUnit
  digitCount: number
}>()

const unit = defineModel<TimestampUnit>('unit', { required: true })

const { t } = useI18n()

const detectedUnitLabel = computed(() => {
  switch (props.detectedUnit) {
    case 'seconds':
      return t('seconds')
    case 'milliseconds':
      return t('milliseconds')
    case 'nanoseconds':
      return t('nanoseconds')
    default:
      return t('milliseconds')
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "unit": "Unit",
    "auto": "Auto",
    "seconds": "Seconds",
    "milliseconds": "Milliseconds",
    "nanoseconds": "Nanoseconds",
    "detected": "Detected",
    "digits": "digits"
  },
  "zh": {
    "unit": "单位",
    "auto": "自动",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "nanoseconds": "纳秒",
    "detected": "检测到",
    "digits": "位"
  },
  "zh-CN": {
    "unit": "单位",
    "auto": "自动",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "nanoseconds": "纳秒",
    "detected": "检测到",
    "digits": "位"
  },
  "zh-TW": {
    "unit": "單位",
    "auto": "自動",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "nanoseconds": "奈秒",
    "detected": "偵測到",
    "digits": "位"
  },
  "zh-HK": {
    "unit": "單位",
    "auto": "自動",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "nanoseconds": "納秒",
    "detected": "偵測到",
    "digits": "位"
  },
  "es": {
    "unit": "Unidad",
    "auto": "Auto",
    "seconds": "Segundos",
    "milliseconds": "Milisegundos",
    "nanoseconds": "Nanosegundos",
    "detected": "Detectado",
    "digits": "dígitos"
  },
  "fr": {
    "unit": "Unité",
    "auto": "Auto",
    "seconds": "Secondes",
    "milliseconds": "Millisecondes",
    "nanoseconds": "Nanosecondes",
    "detected": "Détecté",
    "digits": "chiffres"
  },
  "de": {
    "unit": "Einheit",
    "auto": "Auto",
    "seconds": "Sekunden",
    "milliseconds": "Millisekunden",
    "nanoseconds": "Nanosekunden",
    "detected": "Erkannt",
    "digits": "Ziffern"
  },
  "it": {
    "unit": "Unità",
    "auto": "Auto",
    "seconds": "Secondi",
    "milliseconds": "Millisecondi",
    "nanoseconds": "Nanosecondi",
    "detected": "Rilevato",
    "digits": "cifre"
  },
  "ja": {
    "unit": "単位",
    "auto": "自動",
    "seconds": "秒",
    "milliseconds": "ミリ秒",
    "nanoseconds": "ナノ秒",
    "detected": "検出",
    "digits": "桁"
  },
  "ko": {
    "unit": "단위",
    "auto": "자동",
    "seconds": "초",
    "milliseconds": "밀리초",
    "nanoseconds": "나노초",
    "detected": "감지됨",
    "digits": "자리"
  },
  "ru": {
    "unit": "Единица",
    "auto": "Авто",
    "seconds": "Секунды",
    "milliseconds": "Миллисекунды",
    "nanoseconds": "Наносекунды",
    "detected": "Обнаружено",
    "digits": "цифр"
  },
  "pt": {
    "unit": "Unidade",
    "auto": "Auto",
    "seconds": "Segundos",
    "milliseconds": "Milissegundos",
    "nanoseconds": "Nanossegundos",
    "detected": "Detectado",
    "digits": "dígitos"
  },
  "ar": {
    "unit": "الوحدة",
    "auto": "تلقائي",
    "seconds": "ثواني",
    "milliseconds": "ملي ثانية",
    "nanoseconds": "نانو ثانية",
    "detected": "تم الكشف",
    "digits": "أرقام"
  },
  "hi": {
    "unit": "इकाई",
    "auto": "स्वचालित",
    "seconds": "सेकंड",
    "milliseconds": "मिलीसेकंड",
    "nanoseconds": "नैनोसेकंड",
    "detected": "पता लगाया",
    "digits": "अंक"
  },
  "tr": {
    "unit": "Birim",
    "auto": "Otomatik",
    "seconds": "Saniye",
    "milliseconds": "Milisaniye",
    "nanoseconds": "Nanosaniye",
    "detected": "Algılandı",
    "digits": "basamak"
  },
  "nl": {
    "unit": "Eenheid",
    "auto": "Auto",
    "seconds": "Seconden",
    "milliseconds": "Milliseconden",
    "nanoseconds": "Nanoseconden",
    "detected": "Gedetecteerd",
    "digits": "cijfers"
  },
  "sv": {
    "unit": "Enhet",
    "auto": "Auto",
    "seconds": "Sekunder",
    "milliseconds": "Millisekunder",
    "nanoseconds": "Nanosekunder",
    "detected": "Upptäckt",
    "digits": "siffror"
  },
  "pl": {
    "unit": "Jednostka",
    "auto": "Auto",
    "seconds": "Sekundy",
    "milliseconds": "Milisekundy",
    "nanoseconds": "Nanosekundy",
    "detected": "Wykryto",
    "digits": "cyfr"
  },
  "vi": {
    "unit": "Đơn vị",
    "auto": "Tự động",
    "seconds": "Giây",
    "milliseconds": "Mili giây",
    "nanoseconds": "Nano giây",
    "detected": "Phát hiện",
    "digits": "chữ số"
  },
  "th": {
    "unit": "หน่วย",
    "auto": "อัตโนมัติ",
    "seconds": "วินาที",
    "milliseconds": "มิลลิวินาที",
    "nanoseconds": "นาโนวินาที",
    "detected": "ตรวจพบ",
    "digits": "หลัก"
  },
  "id": {
    "unit": "Unit",
    "auto": "Otomatis",
    "seconds": "Detik",
    "milliseconds": "Milidetik",
    "nanoseconds": "Nanodetik",
    "detected": "Terdeteksi",
    "digits": "digit"
  },
  "he": {
    "unit": "יחידה",
    "auto": "אוטומטי",
    "seconds": "שניות",
    "milliseconds": "אלפיות שנייה",
    "nanoseconds": "ננושניות",
    "detected": "זוהה",
    "digits": "ספרות"
  },
  "ms": {
    "unit": "Unit",
    "auto": "Auto",
    "seconds": "Saat",
    "milliseconds": "Milisaat",
    "nanoseconds": "Nanosaat",
    "detected": "Dikesan",
    "digits": "digit"
  },
  "no": {
    "unit": "Enhet",
    "auto": "Auto",
    "seconds": "Sekunder",
    "milliseconds": "Millisekunder",
    "nanoseconds": "Nanosekunder",
    "detected": "Oppdaget",
    "digits": "sifre"
  }
}
</i18n>
