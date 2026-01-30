<template>
  <n-grid cols="1" y-gap="12">
    <n-form-item-gi :label="t('all-day')" :show-feedback="false">
      <n-switch v-model:value="isAllDayModel" />
    </n-form-item-gi>
  </n-grid>

  <n-grid v-if="!isAllDayModel" cols="1 900:2" x-gap="12" y-gap="12" style="margin-top: 12px">
    <n-form-item-gi :label="t('time-zone')" :show-feedback="false" content-style="width: 100%">
      <n-flex vertical :size="4" style="width: 100%">
        <n-select
          v-model:value="timeZoneModel"
          :options="timeZoneOptions"
          filterable
          :placeholder="t('timezone-placeholder')"
          style="width: 100%"
        />
        <n-text v-if="offsetLabel" depth="3"> {{ t('offset') }}: {{ offsetLabel }} </n-text>
      </n-flex>
    </n-form-item-gi>
    <n-form-item-gi :label="t('output-mode')" :show-feedback="false">
      <n-radio-group v-model:value="outputModeModel">
        <n-flex :size="12">
          <n-radio value="utc">{{ t('output-utc') }}</n-radio>
          <n-radio value="tzid">{{ t('output-tzid') }}</n-radio>
        </n-flex>
      </n-radio-group>
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NFormItemGi, NGrid, NRadio, NRadioGroup, NSelect, NSwitch, NText } from 'naive-ui'

type OutputMode = 'utc' | 'tzid'

const { timeZoneOptions, offsetLabel } = withDefaults(
  defineProps<{
    timeZoneOptions: Array<{ label: string; value: string }>
    offsetLabel?: string
  }>(),
  {
    offsetLabel: '',
  },
)

const isAllDayModel = defineModel<boolean>('isAllDay', { required: true })
const timeZoneModel = defineModel<string>('timeZone', { required: true })
const outputModeModel = defineModel<OutputMode>('outputMode', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "all-day": "All-day event",
    "time-zone": "Time zone",
    "timezone-placeholder": "Select a time zone",
    "offset": "Offset",
    "output-mode": "Output mode",
    "output-utc": "UTC (Z)",
    "output-tzid": "Local time (TZID)"
  },
  "zh": {
    "all-day": "全天事件",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "offset": "偏移",
    "output-mode": "输出模式",
    "output-utc": "UTC (Z)",
    "output-tzid": "本地时间 (TZID)"
  },
  "zh-CN": {
    "all-day": "全天事件",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "offset": "偏移",
    "output-mode": "输出模式",
    "output-utc": "UTC (Z)",
    "output-tzid": "本地时间 (TZID)"
  },
  "zh-TW": {
    "all-day": "全天事件",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "offset": "偏移",
    "output-mode": "輸出模式",
    "output-utc": "UTC (Z)",
    "output-tzid": "本地時間 (TZID)"
  },
  "zh-HK": {
    "all-day": "全天事件",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "offset": "偏移",
    "output-mode": "輸出模式",
    "output-utc": "UTC (Z)",
    "output-tzid": "本地時間 (TZID)"
  },
  "es": {
    "all-day": "Evento de día completo",
    "time-zone": "Zona horaria",
    "timezone-placeholder": "Selecciona una zona horaria",
    "offset": "Desfase",
    "output-mode": "Modo de salida",
    "output-utc": "UTC (Z)",
    "output-tzid": "Hora local (TZID)"
  },
  "fr": {
    "all-day": "Événement sur toute la journée",
    "time-zone": "Fuseau horaire",
    "timezone-placeholder": "Sélectionner un fuseau horaire",
    "offset": "Décalage",
    "output-mode": "Mode de sortie",
    "output-utc": "UTC (Z)",
    "output-tzid": "Heure locale (TZID)"
  },
  "de": {
    "all-day": "Ganztägiges Ereignis",
    "time-zone": "Zeitzone",
    "timezone-placeholder": "Zeitzone auswählen",
    "offset": "Offset",
    "output-mode": "Ausgabemodus",
    "output-utc": "UTC (Z)",
    "output-tzid": "Ortszeit (TZID)"
  },
  "it": {
    "all-day": "Evento di un giorno intero",
    "time-zone": "Fuso orario",
    "timezone-placeholder": "Seleziona un fuso orario",
    "offset": "Offset",
    "output-mode": "Modalità di output",
    "output-utc": "UTC (Z)",
    "output-tzid": "Ora locale (TZID)"
  },
  "ja": {
    "all-day": "終日イベント",
    "time-zone": "タイムゾーン",
    "timezone-placeholder": "タイムゾーンを選択",
    "offset": "オフセット",
    "output-mode": "出力モード",
    "output-utc": "UTC (Z)",
    "output-tzid": "ローカル時刻 (TZID)"
  },
  "ko": {
    "all-day": "종일 이벤트",
    "time-zone": "시간대",
    "timezone-placeholder": "시간대 선택",
    "offset": "오프셋",
    "output-mode": "출력 모드",
    "output-utc": "UTC (Z)",
    "output-tzid": "로컬 시간 (TZID)"
  },
  "ru": {
    "all-day": "Событие на весь день",
    "time-zone": "Часовой пояс",
    "timezone-placeholder": "Выберите часовой пояс",
    "offset": "Смещение",
    "output-mode": "Режим вывода",
    "output-utc": "UTC (Z)",
    "output-tzid": "Местное время (TZID)"
  },
  "pt": {
    "all-day": "Evento de dia inteiro",
    "time-zone": "Fuso horário",
    "timezone-placeholder": "Selecione um fuso horário",
    "offset": "Offset",
    "output-mode": "Modo de saída",
    "output-utc": "UTC (Z)",
    "output-tzid": "Hora local (TZID)"
  },
  "ar": {
    "all-day": "حدث طوال اليوم",
    "time-zone": "المنطقة الزمنية",
    "timezone-placeholder": "اختر منطقة زمنية",
    "offset": "الإزاحة",
    "output-mode": "وضع الإخراج",
    "output-utc": "UTC (Z)",
    "output-tzid": "الوقت المحلي (TZID)"
  },
  "hi": {
    "all-day": "पूरे दिन का इवेंट",
    "time-zone": "समय क्षेत्र",
    "timezone-placeholder": "समय क्षेत्र चुनें",
    "offset": "ऑफ़सेट",
    "output-mode": "आउटपुट मोड",
    "output-utc": "UTC (Z)",
    "output-tzid": "स्थानीय समय (TZID)"
  },
  "tr": {
    "all-day": "Tüm gün etkinlik",
    "time-zone": "Saat dilimi",
    "timezone-placeholder": "Saat dilimi seçin",
    "offset": "Ofset",
    "output-mode": "Çıktı modu",
    "output-utc": "UTC (Z)",
    "output-tzid": "Yerel saat (TZID)"
  },
  "nl": {
    "all-day": "Hele dag-evenement",
    "time-zone": "Tijdzone",
    "timezone-placeholder": "Selecteer een tijdzone",
    "offset": "Offset",
    "output-mode": "Uitvoermodus",
    "output-utc": "UTC (Z)",
    "output-tzid": "Lokale tijd (TZID)"
  },
  "sv": {
    "all-day": "Heldagshändelse",
    "time-zone": "Tidszon",
    "timezone-placeholder": "Välj en tidszon",
    "offset": "Offset",
    "output-mode": "Utdata-läge",
    "output-utc": "UTC (Z)",
    "output-tzid": "Lokal tid (TZID)"
  },
  "pl": {
    "all-day": "Wydarzenie całodniowe",
    "time-zone": "Strefa czasowa",
    "timezone-placeholder": "Wybierz strefę czasową",
    "offset": "Przesunięcie",
    "output-mode": "Tryb wyjścia",
    "output-utc": "UTC (Z)",
    "output-tzid": "Czas lokalny (TZID)"
  },
  "vi": {
    "all-day": "Sự kiện cả ngày",
    "time-zone": "Múi giờ",
    "timezone-placeholder": "Chọn múi giờ",
    "offset": "Độ lệch",
    "output-mode": "Chế độ xuất",
    "output-utc": "UTC (Z)",
    "output-tzid": "Giờ địa phương (TZID)"
  },
  "th": {
    "all-day": "กิจกรรมทั้งวัน",
    "time-zone": "เขตเวลา",
    "timezone-placeholder": "เลือกเขตเวลา",
    "offset": "ออฟเซ็ต",
    "output-mode": "โหมดเอาต์พุต",
    "output-utc": "UTC (Z)",
    "output-tzid": "เวลาท้องถิ่น (TZID)"
  },
  "id": {
    "all-day": "Acara seharian",
    "time-zone": "Zona waktu",
    "timezone-placeholder": "Pilih zona waktu",
    "offset": "Offset",
    "output-mode": "Mode output",
    "output-utc": "UTC (Z)",
    "output-tzid": "Waktu lokal (TZID)"
  },
  "he": {
    "all-day": "אירוע של יום שלם",
    "time-zone": "אזור זמן",
    "timezone-placeholder": "בחר אזור זמן",
    "offset": "היסט",
    "output-mode": "מצב פלט",
    "output-utc": "UTC (Z)",
    "output-tzid": "שעה מקומית (TZID)"
  },
  "ms": {
    "all-day": "Acara sepanjang hari",
    "time-zone": "Zon masa",
    "timezone-placeholder": "Pilih zon masa",
    "offset": "Ofset",
    "output-mode": "Mod output",
    "output-utc": "UTC (Z)",
    "output-tzid": "Masa tempatan (TZID)"
  },
  "no": {
    "all-day": "Heldagshendelse",
    "time-zone": "Tidssone",
    "timezone-placeholder": "Velg en tidssone",
    "offset": "Offset",
    "output-mode": "Utdatamodus",
    "output-utc": "UTC (Z)",
    "output-tzid": "Lokal tid (TZID)"
  }
}
</i18n>
