<template>
  <n-flex vertical :size="12" class="duration-card">
    <n-text strong>{{ t('duration') }}</n-text>

    <n-form-item-gi :label="t('duration-iso')" :show-feedback="durationIsoInvalid">
      <n-flex align="center" :size="8">
        <n-input
          v-model:value="durationIsoInputModel"
          :placeholder="t('duration-placeholder')"
          :status="durationIsoStatus"
          style="flex: 1"
        />
        <CopyToClipboardButton
          v-if="normalizedDurationIso"
          :content="normalizedDurationIso"
          size="small"
        />
      </n-flex>
      <template v-if="durationIsoInvalid" #feedback>
        <n-text type="error">{{ t('invalid-duration') }}</n-text>
      </template>
    </n-form-item-gi>

    <n-text depth="3">{{ t('duration-hint') }}</n-text>

    <n-grid cols="2 900:5" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('days')">
        <n-input-number
          v-model:value="durationDaysModel"
          :min="0"
          :precision="0"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('hours')">
        <n-input-number
          v-model:value="durationHoursModel"
          :min="0"
          :precision="0"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('minutes')">
        <n-input-number
          v-model:value="durationMinutesModel"
          :min="0"
          :precision="0"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('seconds')">
        <n-input-number
          v-model:value="durationSecondsModel"
          :min="0"
          :precision="0"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('milliseconds')">
        <n-input-number
          v-model:value="durationMillisecondsModel"
          :min="0"
          :precision="0"
          style="width: 100%"
        />
      </n-form-item-gi>
    </n-grid>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NInput, NInputNumber, NText, NFlex, NGrid, NFormItemGi } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import type { FormValidationStatus } from 'naive-ui'
import type { DurationParts } from '../utils/duration'

const props = defineProps<{
  durationIsoInput: string
  durationIsoStatus?: FormValidationStatus
  durationIsoInvalid: boolean
  normalizedDurationIso: string
  durationParts: DurationParts
}>()

const emit = defineEmits<{
  (event: 'update:durationIsoInput', value: string): void
  (event: 'update:durationParts', value: DurationParts): void
}>()

const { t } = useI18n()

const durationIsoInputModel = computed({
  get: () => props.durationIsoInput,
  set: (value) => emit('update:durationIsoInput', value),
})

const updateDurationParts = (patch: Partial<DurationParts>) => {
  emit('update:durationParts', {
    ...props.durationParts,
    ...patch,
  })
}

const durationDaysModel = computed({
  get: () => props.durationParts.days,
  set: (value) => updateDurationParts({ days: value ?? 0 }),
})

const durationHoursModel = computed({
  get: () => props.durationParts.hours,
  set: (value) => updateDurationParts({ hours: value ?? 0 }),
})

const durationMinutesModel = computed({
  get: () => props.durationParts.minutes,
  set: (value) => updateDurationParts({ minutes: value ?? 0 }),
})

const durationSecondsModel = computed({
  get: () => props.durationParts.seconds,
  set: (value) => updateDurationParts({ seconds: value ?? 0 }),
})

const durationMillisecondsModel = computed({
  get: () => props.durationParts.milliseconds,
  set: (value) => updateDurationParts({ milliseconds: value ?? 0 }),
})
</script>

<style scoped>
.duration-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}
</style>

<i18n lang="json">
{
  "en": {
    "duration": "Duration",
    "duration-iso": "ISO 8601 duration",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Supports PnDTnHnMnS with optional milliseconds.",
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "milliseconds": "Milliseconds",
    "invalid-duration": "Invalid duration"
  },
  "zh": {
    "duration": "时长",
    "duration-iso": "ISO 8601 时长",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "支持 PnDTnHnMnS，可包含毫秒。",
    "days": "天",
    "hours": "小时",
    "minutes": "分钟",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "invalid-duration": "无效的时长"
  },
  "zh-CN": {
    "duration": "时长",
    "duration-iso": "ISO 8601 时长",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "支持 PnDTnHnMnS，可包含毫秒。",
    "days": "天",
    "hours": "小时",
    "minutes": "分钟",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "invalid-duration": "无效的时长"
  },
  "zh-TW": {
    "duration": "時長",
    "duration-iso": "ISO 8601 時長",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "支援 PnDTnHnMnS，可包含毫秒。",
    "days": "天",
    "hours": "小時",
    "minutes": "分鐘",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "invalid-duration": "無效的時長"
  },
  "zh-HK": {
    "duration": "時長",
    "duration-iso": "ISO 8601 時長",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "支援 PnDTnHnMnS，可包含毫秒。",
    "days": "天",
    "hours": "小時",
    "minutes": "分鐘",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "invalid-duration": "無效的時長"
  },
  "es": {
    "duration": "Duración",
    "duration-iso": "Duración ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Admite PnDTnHnMnS con milisegundos opcionales.",
    "days": "Días",
    "hours": "Horas",
    "minutes": "Minutos",
    "seconds": "Segundos",
    "milliseconds": "Milisegundos",
    "invalid-duration": "Duración inválida"
  },
  "fr": {
    "duration": "Durée",
    "duration-iso": "Durée ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Prend en charge PnDTnHnMnS avec millisecondes en option.",
    "days": "Jours",
    "hours": "Heures",
    "minutes": "Minutes",
    "seconds": "Secondes",
    "milliseconds": "Millisecondes",
    "invalid-duration": "Durée invalide"
  },
  "de": {
    "duration": "Dauer",
    "duration-iso": "ISO 8601-Dauer",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Unterstützt PnDTnHnMnS mit optionalen Millisekunden.",
    "days": "Tage",
    "hours": "Stunden",
    "minutes": "Minuten",
    "seconds": "Sekunden",
    "milliseconds": "Millisekunden",
    "invalid-duration": "Ungültige Dauer"
  },
  "it": {
    "duration": "Durata",
    "duration-iso": "Durata ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Supporta PnDTnHnMnS con millisecondi opzionali.",
    "days": "Giorni",
    "hours": "Ore",
    "minutes": "Minuti",
    "seconds": "Secondi",
    "milliseconds": "Millisecondi",
    "invalid-duration": "Durata non valida"
  },
  "ja": {
    "duration": "期間",
    "duration-iso": "ISO 8601 期間",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "PnDTnHnMnS に対応（ミリ秒は任意）。",
    "days": "日",
    "hours": "時間",
    "minutes": "分",
    "seconds": "秒",
    "milliseconds": "ミリ秒",
    "invalid-duration": "無効な期間"
  },
  "ko": {
    "duration": "기간",
    "duration-iso": "ISO 8601 기간",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "PnDTnHnMnS 형식 지원(밀리초 선택).",
    "days": "일",
    "hours": "시간",
    "minutes": "분",
    "seconds": "초",
    "milliseconds": "밀리초",
    "invalid-duration": "유효하지 않은 기간"
  },
  "ru": {
    "duration": "Длительность",
    "duration-iso": "Длительность ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Поддерживает PnDTnHnMnS с необязательными миллисекундами.",
    "days": "Дни",
    "hours": "Часы",
    "minutes": "Минуты",
    "seconds": "Секунды",
    "milliseconds": "Миллисекунды",
    "invalid-duration": "Недопустимая длительность"
  },
  "pt": {
    "duration": "Duração",
    "duration-iso": "Duração ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Suporta PnDTnHnMnS com milissegundos opcionais.",
    "days": "Dias",
    "hours": "Horas",
    "minutes": "Minutos",
    "seconds": "Segundos",
    "milliseconds": "Milisegundos",
    "invalid-duration": "Duração inválida"
  },
  "ar": {
    "duration": "المدة",
    "duration-iso": "مدة ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "يدعم PnDTnHnMnS مع مللي ثانية اختيارية.",
    "days": "أيام",
    "hours": "ساعات",
    "minutes": "دقائق",
    "seconds": "ثوانٍ",
    "milliseconds": "مللي ثانية",
    "invalid-duration": "مدة غير صالحة"
  },
  "hi": {
    "duration": "अवधि",
    "duration-iso": "ISO 8601 अवधि",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "PnDTnHnMnS समर्थित (मिलीसेकंड वैकल्पिक)।",
    "days": "दिन",
    "hours": "घंटे",
    "minutes": "मिनट",
    "seconds": "सेकंड",
    "milliseconds": "मिलीसेकंड",
    "invalid-duration": "अमान्य अवधि"
  },
  "tr": {
    "duration": "Süre",
    "duration-iso": "ISO 8601 süresi",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "PnDTnHnMnS destekler (isteğe bağlı milisaniye).",
    "days": "Gün",
    "hours": "Saat",
    "minutes": "Dakika",
    "seconds": "Saniye",
    "milliseconds": "Milisaniye",
    "invalid-duration": "Geçersiz süre"
  },
  "nl": {
    "duration": "Duur",
    "duration-iso": "ISO 8601-duur",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Ondersteunt PnDTnHnMnS met optionele milliseconden.",
    "days": "Dagen",
    "hours": "Uren",
    "minutes": "Minuten",
    "seconds": "Seconden",
    "milliseconds": "Milliseconden",
    "invalid-duration": "Ongeldige duur"
  },
  "sv": {
    "duration": "Varaktighet",
    "duration-iso": "ISO 8601-varaktighet",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Stödjer PnDTnHnMnS med valfria millisekunder.",
    "days": "Dagar",
    "hours": "Timmar",
    "minutes": "Minuter",
    "seconds": "Sekunder",
    "milliseconds": "Millisekunder",
    "invalid-duration": "Ogiltig varaktighet"
  },
  "pl": {
    "duration": "Czas trwania",
    "duration-iso": "Czas trwania ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Obsługuje PnDTnHnMnS z opcjonalnymi milisekundami.",
    "days": "Dni",
    "hours": "Godziny",
    "minutes": "Minuty",
    "seconds": "Sekundy",
    "milliseconds": "Milisekundy",
    "invalid-duration": "Nieprawidłowy czas trwania"
  },
  "vi": {
    "duration": "Thời lượng",
    "duration-iso": "Thời lượng ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Hỗ trợ PnDTnHnMnS với mili giây tùy chọn.",
    "days": "Ngày",
    "hours": "Giờ",
    "minutes": "Phút",
    "seconds": "Giây",
    "milliseconds": "Mili giây",
    "invalid-duration": "Thời lượng không hợp lệ"
  },
  "th": {
    "duration": "ระยะเวลา",
    "duration-iso": "ระยะเวลา ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "รองรับ PnDTnHnMnS พร้อมมิลลิวินาทีเป็นตัวเลือก",
    "days": "วัน",
    "hours": "ชั่วโมง",
    "minutes": "นาที",
    "seconds": "วินาที",
    "milliseconds": "มิลลิวินาที",
    "invalid-duration": "ระยะเวลาไม่ถูกต้อง"
  },
  "id": {
    "duration": "Durasi",
    "duration-iso": "Durasi ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Mendukung PnDTnHnMnS dengan milidetik opsional.",
    "days": "Hari",
    "hours": "Jam",
    "minutes": "Menit",
    "seconds": "Detik",
    "milliseconds": "Milidetik",
    "invalid-duration": "Durasi tidak valid"
  },
  "he": {
    "duration": "משך",
    "duration-iso": "משך ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "תומך ב‑PnDTnHnMnS עם מילישניות אופציונליות.",
    "days": "ימים",
    "hours": "שעות",
    "minutes": "דקות",
    "seconds": "שניות",
    "milliseconds": "מילישניות",
    "invalid-duration": "משך לא תקין"
  },
  "ms": {
    "duration": "Durasi",
    "duration-iso": "Durasi ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Menyokong PnDTnHnMnS dengan milisaat pilihan.",
    "days": "Hari",
    "hours": "Jam",
    "minutes": "Minit",
    "seconds": "Saat",
    "milliseconds": "Milisaat",
    "invalid-duration": "Durasi tidak sah"
  },
  "no": {
    "duration": "Varighet",
    "duration-iso": "ISO 8601-varighet",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Støtter PnDTnHnMnS med valgfrie millisekunder.",
    "days": "Dager",
    "hours": "Timer",
    "minutes": "Minutter",
    "seconds": "Sekunder",
    "milliseconds": "Millisekunder",
    "invalid-duration": "Ugyldig varighet"
  }
}
</i18n>
