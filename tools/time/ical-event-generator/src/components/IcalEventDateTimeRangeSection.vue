<template>
  <n-grid cols="1" y-gap="12" style="margin-top: 12px">
    <n-form-item-gi :label="`${t('start')} / ${t('end')}`" :show-feedback="!!rangeErrorMessage">
      <n-date-picker
        v-model:value="dateRangeModel"
        type="datetimerange"
        clearable
        style="width: 100%"
      />
      <template v-if="rangeErrorMessage" #feedback>
        <n-text type="error">{{ rangeErrorMessage }}</n-text>
      </template>
    </n-form-item-gi>
  </n-grid>
  <n-text v-if="isAllDay" depth="3" style="margin-top: 4px">
    {{ t('all-day-end-hint') }}
  </n-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDatePicker, NFormItemGi, NGrid, NText } from 'naive-ui'

type RangeErrorKey = 'invalid-date-time' | 'invalid-date' | 'end-before-start'

const props = defineProps<{
  rangeErrorKey?: RangeErrorKey
  isAllDay: boolean
}>()

const { t } = useI18n()

const dateRangeModel = defineModel<[number, number] | null>('dateRange', { required: true })

const rangeErrorMessages = computed<Record<RangeErrorKey, string>>(() => ({
  'invalid-date-time': t('invalid-date-time'),
  'invalid-date': t('invalid-date'),
  'end-before-start': t('end-before-start'),
}))

const rangeErrorMessage = computed(() =>
  props.rangeErrorKey ? rangeErrorMessages.value[props.rangeErrorKey] : '',
)
</script>

<i18n lang="json">
{
  "en": {
    "start": "Start",
    "end": "End",
    "invalid-date-time": "Invalid date/time",
    "invalid-date": "Invalid date",
    "end-before-start": "End must be after start",
    "all-day-end-hint": "All-day end date is exclusive. Use the next day for a one-day event."
  },
  "zh": {
    "start": "开始",
    "end": "结束",
    "invalid-date-time": "无效的日期/时间",
    "invalid-date": "无效的日期",
    "end-before-start": "结束时间必须晚于开始时间",
    "all-day-end-hint": "全天事件结束日期为排他日期，单日事件请使用下一天。"
  },
  "zh-CN": {
    "start": "开始",
    "end": "结束",
    "invalid-date-time": "无效的日期/时间",
    "invalid-date": "无效的日期",
    "end-before-start": "结束时间必须晚于开始时间",
    "all-day-end-hint": "全天事件结束日期为排他日期，单日事件请使用下一天。"
  },
  "zh-TW": {
    "start": "開始",
    "end": "結束",
    "invalid-date-time": "無效的日期/時間",
    "invalid-date": "無效的日期",
    "end-before-start": "結束時間必須晚於開始時間",
    "all-day-end-hint": "全天事件結束日期為排他日期，單日事件請使用下一天。"
  },
  "zh-HK": {
    "start": "開始",
    "end": "結束",
    "invalid-date-time": "無效的日期/時間",
    "invalid-date": "無效的日期",
    "end-before-start": "結束時間必須晚於開始時間",
    "all-day-end-hint": "全天事件結束日期為排他日期，單日事件請使用下一天。"
  },
  "es": {
    "start": "Inicio",
    "end": "Fin",
    "invalid-date-time": "Fecha/hora inválida",
    "invalid-date": "Fecha inválida",
    "end-before-start": "El fin debe ser posterior al inicio",
    "all-day-end-hint": "La fecha de fin de un evento de día completo es exclusiva. Usa el día siguiente para un evento de un día."
  },
  "fr": {
    "start": "Début",
    "end": "Fin",
    "invalid-date-time": "Date/heure invalide",
    "invalid-date": "Date invalide",
    "end-before-start": "La fin doit être après le début",
    "all-day-end-hint": "La date de fin d'un événement sur toute la journée est exclusive. Utilisez le jour suivant pour un événement d'un jour."
  },
  "de": {
    "start": "Start",
    "end": "Ende",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit",
    "invalid-date": "Ungültiges Datum",
    "end-before-start": "Ende muss nach dem Start liegen",
    "all-day-end-hint": "Das Enddatum ganztägiger Ereignisse ist exklusiv. Verwenden Sie den nächsten Tag für ein eintägiges Ereignis."
  },
  "it": {
    "start": "Inizio",
    "end": "Fine",
    "invalid-date-time": "Data/ora non valida",
    "invalid-date": "Data non valida",
    "end-before-start": "La fine deve essere successiva all'inizio",
    "all-day-end-hint": "La data di fine di un evento di un giorno intero è esclusiva. Usa il giorno successivo per un evento di un giorno."
  },
  "ja": {
    "start": "開始",
    "end": "終了",
    "invalid-date-time": "無効な日付/時刻",
    "invalid-date": "無効な日付",
    "end-before-start": "終了は開始より後である必要があります",
    "all-day-end-hint": "終日イベントの終了日は排他的です。1日のイベントは翌日を指定してください。"
  },
  "ko": {
    "start": "시작",
    "end": "종료",
    "invalid-date-time": "유효하지 않은 날짜/시간",
    "invalid-date": "유효하지 않은 날짜",
    "end-before-start": "종료는 시작 이후여야 합니다",
    "all-day-end-hint": "종일 이벤트의 종료 날짜는 배타적입니다. 하루짜리 이벤트는 다음 날을 사용하세요."
  },
  "ru": {
    "start": "Начало",
    "end": "Конец",
    "invalid-date-time": "Недопустимая дата/время",
    "invalid-date": "Недопустимая дата",
    "end-before-start": "Окончание должно быть после начала",
    "all-day-end-hint": "Дата окончания события на весь день является исключающей. Для события на один день используйте следующий день."
  },
  "pt": {
    "start": "Início",
    "end": "Fim",
    "invalid-date-time": "Data/hora inválida",
    "invalid-date": "Data inválida",
    "end-before-start": "O fim deve ser após o início",
    "all-day-end-hint": "A data de término de um evento de dia inteiro é exclusiva. Use o dia seguinte para um evento de um dia."
  },
  "ar": {
    "start": "البداية",
    "end": "النهاية",
    "invalid-date-time": "تاريخ/وقت غير صالح",
    "invalid-date": "تاريخ غير صالح",
    "end-before-start": "يجب أن تكون النهاية بعد البداية",
    "all-day-end-hint": "تاريخ نهاية حدث اليوم الكامل حصري. استخدم اليوم التالي لحدث ليوم واحد."
  },
  "hi": {
    "start": "शुरू",
    "end": "समाप्त",
    "invalid-date-time": "अमान्य तिथि/समय",
    "invalid-date": "अमान्य तिथि",
    "end-before-start": "समाप्ति समय शुरू के बाद होना चाहिए",
    "all-day-end-hint": "पूरे दिन के इवेंट की समाप्ति तिथि एक्सक्लूसिव होती है। एक दिन के इवेंट के लिए अगले दिन का उपयोग करें।"
  },
  "tr": {
    "start": "Başlangıç",
    "end": "Bitiş",
    "invalid-date-time": "Geçersiz tarih/saat",
    "invalid-date": "Geçersiz tarih",
    "end-before-start": "Bitiş başlangıçtan sonra olmalıdır",
    "all-day-end-hint": "Tüm gün etkinliklerde bitiş tarihi dışlayıcıdır. Bir günlük etkinlik için ertesi günü kullanın."
  },
  "nl": {
    "start": "Start",
    "end": "Einde",
    "invalid-date-time": "Ongeldige datum/tijd",
    "invalid-date": "Ongeldige datum",
    "end-before-start": "Einde moet na het begin liggen",
    "all-day-end-hint": "De einddatum van een hele dag is exclusief. Gebruik de volgende dag voor een eendaags evenement."
  },
  "sv": {
    "start": "Start",
    "end": "Slut",
    "invalid-date-time": "Ogiltigt datum/tid",
    "invalid-date": "Ogiltigt datum",
    "end-before-start": "Slutet måste vara efter start",
    "all-day-end-hint": "Slutdatumet för en heldagshändelse är exklusivt. Använd nästa dag för en endagshändelse."
  },
  "pl": {
    "start": "Start",
    "end": "Koniec",
    "invalid-date-time": "Nieprawidłowa data/godzina",
    "invalid-date": "Nieprawidłowa data",
    "end-before-start": "Koniec musi być po początku",
    "all-day-end-hint": "Data końcowa wydarzenia całodniowego jest wyłączna. Użyj następnego dnia dla wydarzenia jednodniowego."
  },
  "vi": {
    "start": "Bắt đầu",
    "end": "Kết thúc",
    "invalid-date-time": "Ngày/giờ không hợp lệ",
    "invalid-date": "Ngày không hợp lệ",
    "end-before-start": "Kết thúc phải sau khi bắt đầu",
    "all-day-end-hint": "Ngày kết thúc sự kiện cả ngày là độc quyền. Dùng ngày hôm sau cho sự kiện một ngày."
  },
  "th": {
    "start": "เริ่มต้น",
    "end": "สิ้นสุด",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง",
    "invalid-date": "วันที่ไม่ถูกต้อง",
    "end-before-start": "เวลาสิ้นสุดต้องหลังเวลาเริ่มต้น",
    "all-day-end-hint": "วันที่สิ้นสุดของกิจกรรมทั้งวันเป็นแบบไม่รวมวันนั้น ใช้วันถัดไปสำหรับกิจกรรมหนึ่งวัน"
  },
  "id": {
    "start": "Mulai",
    "end": "Selesai",
    "invalid-date-time": "Tanggal/waktu tidak valid",
    "invalid-date": "Tanggal tidak valid",
    "end-before-start": "Selesai harus setelah mulai",
    "all-day-end-hint": "Tanggal akhir acara seharian bersifat eksklusif. Gunakan hari berikutnya untuk acara satu hari."
  },
  "he": {
    "start": "התחלה",
    "end": "סיום",
    "invalid-date-time": "תאריך/שעה לא תקינים",
    "invalid-date": "תאריך לא תקין",
    "end-before-start": "הסיום חייב להיות אחרי ההתחלה",
    "all-day-end-hint": "תאריך הסיום של אירוע של יום שלם הוא בלעדי. השתמשו ביום הבא עבור אירוע של יום אחד."
  },
  "ms": {
    "start": "Mula",
    "end": "Tamat",
    "invalid-date-time": "Tarikh/masa tidak sah",
    "invalid-date": "Tarikh tidak sah",
    "end-before-start": "Tamat mesti selepas mula",
    "all-day-end-hint": "Tarikh tamat acara sepanjang hari adalah eksklusif. Gunakan hari berikutnya untuk acara satu hari."
  },
  "no": {
    "start": "Start",
    "end": "Slutt",
    "invalid-date-time": "Ugyldig dato/tid",
    "invalid-date": "Ugyldig dato",
    "end-before-start": "Slutt må være etter start",
    "all-day-end-hint": "Sluttdato for heldagshendelser er eksklusiv. Bruk neste dag for en endagshendelse."
  }
}
</i18n>
