<template>
  <ToolSectionHeader>{{ t('count-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="range-card">
          <n-form-item :label="t('start-date')">
            <n-date-picker v-model:value="startDate" type="date" style="width: 100%" />
          </n-form-item>
          <n-form-item :label="t('end-date')">
            <n-date-picker v-model:value="endDate" type="date" style="width: 100%" />
          </n-form-item>
          <n-flex align="center" :size="12">
            <n-switch v-model:value="includeEndpoints" />
            <n-text>{{ t('include-endpoints') }}</n-text>
          </n-flex>
          <n-text v-if="rangeWarning" type="error">{{ rangeWarning }}</n-text>
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="12" class="range-card">
          <n-descriptions :column="1" label-placement="left" bordered>
            <n-descriptions-item :label="t('business-days')">
              <n-flex align="center" :size="8">
                <code>{{ businessDaysLabel || '-' }}</code>
                <CopyToClipboardButton
                  v-if="businessDaysLabel"
                  :content="businessDaysLabel"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('total-days')">
              <n-flex align="center" :size="8">
                <code>{{ totalDaysLabel || '-' }}</code>
                <CopyToClipboardButton
                  v-if="totalDaysLabel"
                  :content="totalDaysLabel"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('weekend-days-count')">
              <n-flex align="center" :size="8">
                <code>{{ weekendDaysLabel || '-' }}</code>
                <CopyToClipboardButton
                  v-if="weekendDaysLabel"
                  :content="weekendDaysLabel"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('holiday-days-count')">
              <n-flex align="center" :size="8">
                <code>{{ holidayDaysLabel || '-' }}</code>
                <CopyToClipboardButton
                  v-if="holidayDaysLabel"
                  :content="holidayDaysLabel"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
          </n-descriptions>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NDatePicker,
  NDescriptions,
  NDescriptionsItem,
  NFlex,
  NFormItem,
  NGi,
  NGrid,
  NSwitch,
  NText,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

const props = defineProps<{
  businessDaysLabel: string
  totalDaysLabel: string
  weekendDaysLabel: string
  holidayDaysLabel: string
  isRangeReversed: boolean
}>()
const startDate = defineModel<number | null>('startDate', { required: true })
const endDate = defineModel<number | null>('endDate', { required: true })
const includeEndpoints = defineModel<boolean>('includeEndpoints', { required: true })

const { t } = useI18n()

const rangeWarning = computed(() => (props.isRangeReversed ? t('range-swapped') : ''))
</script>

<style scoped>
.range-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}
</style>

<i18n lang="json">
{
  "en": {
    "count-title": "Count Business Days",
    "start-date": "Start date",
    "end-date": "End date",
    "include-endpoints": "Include start/end dates",
    "range-swapped": "End date is before start date; results use swapped dates.",
    "business-days": "Business days",
    "total-days": "Total days",
    "weekend-days-count": "Weekend days",
    "holiday-days-count": "Holidays (weekdays)"
  },
  "zh": {
    "count-title": "工作日统计",
    "start-date": "开始日期",
    "end-date": "结束日期",
    "include-endpoints": "包含开始/结束日期",
    "range-swapped": "结束日期早于开始日期；结果已使用交换后的日期。",
    "business-days": "工作日",
    "total-days": "总天数",
    "weekend-days-count": "周末天数",
    "holiday-days-count": "节假日（工作日）"
  },
  "zh-CN": {
    "count-title": "工作日统计",
    "start-date": "开始日期",
    "end-date": "结束日期",
    "include-endpoints": "包含开始/结束日期",
    "range-swapped": "结束日期早于开始日期；结果已使用交换后的日期。",
    "business-days": "工作日",
    "total-days": "总天数",
    "weekend-days-count": "周末天数",
    "holiday-days-count": "节假日（工作日）"
  },
  "zh-TW": {
    "count-title": "工作日統計",
    "start-date": "開始日期",
    "end-date": "結束日期",
    "include-endpoints": "包含開始/結束日期",
    "range-swapped": "結束日期早於開始日期；結果已使用交換後的日期。",
    "business-days": "工作日",
    "total-days": "總天數",
    "weekend-days-count": "週末天數",
    "holiday-days-count": "節假日（工作日）"
  },
  "zh-HK": {
    "count-title": "工作日統計",
    "start-date": "開始日期",
    "end-date": "結束日期",
    "include-endpoints": "包含開始/結束日期",
    "range-swapped": "結束日期早於開始日期；結果已使用交換後的日期。",
    "business-days": "工作日",
    "total-days": "總天數",
    "weekend-days-count": "週末天數",
    "holiday-days-count": "節假日（工作日）"
  },
  "es": {
    "count-title": "Contar días hábiles",
    "start-date": "Fecha de inicio",
    "end-date": "Fecha de fin",
    "include-endpoints": "Incluir fechas de inicio/fin",
    "range-swapped": "La fecha de fin es anterior a la de inicio; los resultados usan las fechas intercambiadas.",
    "business-days": "Días hábiles",
    "total-days": "Días totales",
    "weekend-days-count": "Fines de semana",
    "holiday-days-count": "Festivos (días laborables)"
  },
  "fr": {
    "count-title": "Compter les jours ouvrés",
    "start-date": "Date de début",
    "end-date": "Date de fin",
    "include-endpoints": "Inclure les dates de début/fin",
    "range-swapped": "La date de fin est antérieure à la date de début ; résultats calculés avec les dates inversées.",
    "business-days": "Jours ouvrés",
    "total-days": "Jours totaux",
    "weekend-days-count": "Week-ends",
    "holiday-days-count": "Jours fériés (en semaine)"
  },
  "de": {
    "count-title": "Arbeitstage zählen",
    "start-date": "Startdatum",
    "end-date": "Enddatum",
    "include-endpoints": "Start-/Enddatum einschließen",
    "range-swapped": "Enddatum liegt vor dem Startdatum; Ergebnisse verwenden vertauschte Daten.",
    "business-days": "Arbeitstage",
    "total-days": "Gesamttage",
    "weekend-days-count": "Wochenenden",
    "holiday-days-count": "Feiertage (Werktage)"
  },
  "it": {
    "count-title": "Conta giorni lavorativi",
    "start-date": "Data di inizio",
    "end-date": "Data di fine",
    "include-endpoints": "Includi date di inizio/fine",
    "range-swapped": "La data di fine è precedente alla data di inizio; risultati calcolati con date invertite.",
    "business-days": "Giorni lavorativi",
    "total-days": "Giorni totali",
    "weekend-days-count": "Weekend",
    "holiday-days-count": "Festività (giorni feriali)"
  },
  "ja": {
    "count-title": "営業日を数える",
    "start-date": "開始日",
    "end-date": "終了日",
    "include-endpoints": "開始日/終了日を含める",
    "range-swapped": "終了日が開始日より前のため、日付を入れ替えて計算しました。",
    "business-days": "営業日",
    "total-days": "合計日数",
    "weekend-days-count": "週末",
    "holiday-days-count": "祝日（平日）"
  },
  "ko": {
    "count-title": "영업일 계산",
    "start-date": "시작일",
    "end-date": "종료일",
    "include-endpoints": "시작/종료일 포함",
    "range-swapped": "종료일이 시작일보다 이전입니다. 날짜를 바꿔 계산했습니다.",
    "business-days": "영업일",
    "total-days": "전체 일수",
    "weekend-days-count": "주말",
    "holiday-days-count": "공휴일(평일)"
  },
  "ru": {
    "count-title": "Подсчет рабочих дней",
    "start-date": "Дата начала",
    "end-date": "Дата окончания",
    "include-endpoints": "Включать даты начала/окончания",
    "range-swapped": "Дата окончания раньше даты начала; результаты рассчитаны с перестановкой дат.",
    "business-days": "Рабочие дни",
    "total-days": "Всего дней",
    "weekend-days-count": "Выходные",
    "holiday-days-count": "Праздники (будни)"
  },
  "pt": {
    "count-title": "Contar dias úteis",
    "start-date": "Data de início",
    "end-date": "Data de término",
    "include-endpoints": "Incluir datas de início/fim",
    "range-swapped": "A data de término é anterior à data de início; resultados usam datas trocadas.",
    "business-days": "Dias úteis",
    "total-days": "Dias totais",
    "weekend-days-count": "Fins de semana",
    "holiday-days-count": "Feriados (dias úteis)"
  },
  "ar": {
    "count-title": "حساب أيام العمل",
    "start-date": "تاريخ البدء",
    "end-date": "تاريخ الانتهاء",
    "include-endpoints": "تضمين تاريخي البدء/الانتهاء",
    "range-swapped": "تاريخ الانتهاء يسبق تاريخ البدء؛ تم الحساب بعد تبديل التواريخ.",
    "business-days": "أيام العمل",
    "total-days": "إجمالي الأيام",
    "weekend-days-count": "عطلة نهاية الأسبوع",
    "holiday-days-count": "العطلات (أيام عمل)"
  },
  "hi": {
    "count-title": "कार्यदिवस गिनें",
    "start-date": "आरंभ तिथि",
    "end-date": "समाप्ति तिथि",
    "include-endpoints": "आरंभ/समाप्ति तिथियां शामिल करें",
    "range-swapped": "समाप्ति तिथि आरंभ तिथि से पहले है; परिणामों में तिथियां बदलकर ली गई हैं।",
    "business-days": "कार्यदिवस",
    "total-days": "कुल दिन",
    "weekend-days-count": "सप्ताहांत",
    "holiday-days-count": "छुट्टियां (कार्यदिवस)"
  },
  "tr": {
    "count-title": "İş günü say",
    "start-date": "Başlangıç tarihi",
    "end-date": "Bitiş tarihi",
    "include-endpoints": "Başlangıç/bitiş tarihlerini dahil et",
    "range-swapped": "Bitiş tarihi başlangıç tarihinden önce; sonuçlar tarihler değiştirilerek hesaplandı.",
    "business-days": "İş günleri",
    "total-days": "Toplam gün",
    "weekend-days-count": "Hafta sonları",
    "holiday-days-count": "Tatiller (hafta içi)"
  },
  "nl": {
    "count-title": "Werkdagen tellen",
    "start-date": "Startdatum",
    "end-date": "Einddatum",
    "include-endpoints": "Start-/einddatum opnemen",
    "range-swapped": "Einddatum ligt vóór startdatum; resultaten gebruiken omgewisselde datums.",
    "business-days": "Werkdagen",
    "total-days": "Totaal dagen",
    "weekend-days-count": "Weekenden",
    "holiday-days-count": "Feestdagen (werkdagen)"
  },
  "sv": {
    "count-title": "Räkna arbetsdagar",
    "start-date": "Startdatum",
    "end-date": "Slutdatum",
    "include-endpoints": "Inkludera start-/slutdatum",
    "range-swapped": "Slutdatum är före startdatum; resultaten använder ombytta datum.",
    "business-days": "Arbetsdagar",
    "total-days": "Totalt antal dagar",
    "weekend-days-count": "Helger",
    "holiday-days-count": "Helgdagar (vardagar)"
  },
  "pl": {
    "count-title": "Licz dni robocze",
    "start-date": "Data początkowa",
    "end-date": "Data końcowa",
    "include-endpoints": "Uwzględnij daty początku/końca",
    "range-swapped": "Data końcowa jest wcześniejsza od początkowej; wyniki używają zamienionych dat.",
    "business-days": "Dni robocze",
    "total-days": "Łącznie dni",
    "weekend-days-count": "Weekend",
    "holiday-days-count": "Święta (dni robocze)"
  },
  "vi": {
    "count-title": "Đếm ngày làm việc",
    "start-date": "Ngày bắt đầu",
    "end-date": "Ngày kết thúc",
    "include-endpoints": "Bao gồm ngày bắt đầu/kết thúc",
    "range-swapped": "Ngày kết thúc trước ngày bắt đầu; kết quả dùng ngày đã hoán đổi.",
    "business-days": "Ngày làm việc",
    "total-days": "Tổng số ngày",
    "weekend-days-count": "Cuối tuần",
    "holiday-days-count": "Ngày lễ (ngày làm việc)"
  },
  "th": {
    "count-title": "นับวันทำงาน",
    "start-date": "วันที่เริ่มต้น",
    "end-date": "วันที่สิ้นสุด",
    "include-endpoints": "รวมวันที่เริ่มต้น/สิ้นสุด",
    "range-swapped": "วันที่สิ้นสุดก่อนวันที่เริ่มต้น; ผลลัพธ์ใช้วันที่ที่สลับแล้ว",
    "business-days": "วันทำงาน",
    "total-days": "จำนวนวันทั้งหมด",
    "weekend-days-count": "วันสุดสัปดาห์",
    "holiday-days-count": "วันหยุด (วันทำงาน)"
  },
  "id": {
    "count-title": "Hitung hari kerja",
    "start-date": "Tanggal mulai",
    "end-date": "Tanggal selesai",
    "include-endpoints": "Sertakan tanggal mulai/selesai",
    "range-swapped": "Tanggal selesai sebelum tanggal mulai; hasil menggunakan tanggal yang ditukar.",
    "business-days": "Hari kerja",
    "total-days": "Total hari",
    "weekend-days-count": "Akhir pekan",
    "holiday-days-count": "Hari libur (hari kerja)"
  },
  "he": {
    "count-title": "ספירת ימי עבודה",
    "start-date": "תאריך התחלה",
    "end-date": "תאריך סיום",
    "include-endpoints": "כלול תאריכי התחלה/סיום",
    "range-swapped": "תאריך הסיום מוקדם מתאריך ההתחלה; התוצאות משתמשות בתאריכים שהוחלפו.",
    "business-days": "ימי עבודה",
    "total-days": "סה\"כ ימים",
    "weekend-days-count": "סופי שבוע",
    "holiday-days-count": "חגים (ימי חול)"
  },
  "ms": {
    "count-title": "Kira hari bekerja",
    "start-date": "Tarikh mula",
    "end-date": "Tarikh tamat",
    "include-endpoints": "Sertakan tarikh mula/tamat",
    "range-swapped": "Tarikh tamat lebih awal daripada tarikh mula; keputusan menggunakan tarikh yang ditukar.",
    "business-days": "Hari bekerja",
    "total-days": "Jumlah hari",
    "weekend-days-count": "Hujung minggu",
    "holiday-days-count": "Cuti umum (hari bekerja)"
  },
  "no": {
    "count-title": "Tell arbeidsdager",
    "start-date": "Startdato",
    "end-date": "Sluttdato",
    "include-endpoints": "Inkluder start-/sluttdato",
    "range-swapped": "Sluttdato er før startdato; resultatene bruker byttede datoer.",
    "business-days": "Arbeidsdager",
    "total-days": "Totale dager",
    "weekend-days-count": "Helger",
    "holiday-days-count": "Fridager (hverdager)"
  }
}
</i18n>
