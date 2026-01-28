<template>
  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-descriptions :column="1" label-placement="left" bordered>
      <n-descriptions-item :label="t('signed-duration')">
        <n-flex align="center" :size="8">
          <code>{{ signedDurationLabel || '-' }}</code>
          <CopyToClipboardButton
            v-if="signedDurationLabel"
            :content="signedDurationLabel"
            size="tiny"
          />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('absolute-duration')">
        <n-flex align="center" :size="8">
          <code>{{ absoluteDurationLabel || '-' }}</code>
          <CopyToClipboardButton
            v-if="absoluteDurationLabel"
            :content="absoluteDurationLabel"
            size="tiny"
          />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('iso-8601-duration')">
        <n-flex align="center" :size="8">
          <code>{{ isoDuration || '-' }}</code>
          <CopyToClipboardButton v-if="isoDuration" :content="isoDuration" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-milliseconds')">
        <n-flex align="center" :size="8">
          <code>{{ totalMilliseconds || '-' }}</code>
          <CopyToClipboardButton
            v-if="totalMilliseconds"
            :content="totalMilliseconds"
            size="tiny"
          />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-seconds')">
        <n-flex align="center" :size="8">
          <code>{{ totalSeconds || '-' }}</code>
          <CopyToClipboardButton v-if="totalSeconds" :content="totalSeconds" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-minutes')">
        <n-flex align="center" :size="8">
          <code>{{ totalMinutes || '-' }}</code>
          <CopyToClipboardButton v-if="totalMinutes" :content="totalMinutes" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-hours')">
        <n-flex align="center" :size="8">
          <code>{{ totalHours || '-' }}</code>
          <CopyToClipboardButton v-if="totalHours" :content="totalHours" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-days')">
        <n-flex align="center" :size="8">
          <code>{{ totalDays || '-' }}</code>
          <CopyToClipboardButton v-if="totalDays" :content="totalDays" size="tiny" />
        </n-flex>
      </n-descriptions-item>
    </n-descriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  signedDurationLabel: string
  absoluteDurationLabel: string
  isoDuration: string
  totalMilliseconds: string
  totalSeconds: string
  totalMinutes: string
  totalHours: string
  totalDays: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "results": "Results",
    "signed-duration": "Signed duration",
    "absolute-duration": "Absolute duration",
    "iso-8601-duration": "ISO 8601 duration",
    "total-milliseconds": "Total milliseconds",
    "total-seconds": "Total seconds",
    "total-minutes": "Total minutes",
    "total-hours": "Total hours",
    "total-days": "Total days"
  },
  "zh": {
    "results": "结果",
    "signed-duration": "带符号时长",
    "absolute-duration": "绝对时长",
    "iso-8601-duration": "ISO 8601 时长",
    "total-milliseconds": "总毫秒",
    "total-seconds": "总秒数",
    "total-minutes": "总分钟",
    "total-hours": "总小时",
    "total-days": "总天数"
  },
  "zh-CN": {
    "results": "结果",
    "signed-duration": "带符号时长",
    "absolute-duration": "绝对时长",
    "iso-8601-duration": "ISO 8601 时长",
    "total-milliseconds": "总毫秒",
    "total-seconds": "总秒数",
    "total-minutes": "总分钟",
    "total-hours": "总小时",
    "total-days": "总天数"
  },
  "zh-TW": {
    "results": "結果",
    "signed-duration": "帶符號時長",
    "absolute-duration": "絕對時長",
    "iso-8601-duration": "ISO 8601 時長",
    "total-milliseconds": "總毫秒",
    "total-seconds": "總秒數",
    "total-minutes": "總分鐘",
    "total-hours": "總小時",
    "total-days": "總天數"
  },
  "zh-HK": {
    "results": "結果",
    "signed-duration": "帶符號時長",
    "absolute-duration": "絕對時長",
    "iso-8601-duration": "ISO 8601 時長",
    "total-milliseconds": "總毫秒",
    "total-seconds": "總秒數",
    "total-minutes": "總分鐘",
    "total-hours": "總小時",
    "total-days": "總天數"
  },
  "es": {
    "results": "Resultados",
    "signed-duration": "Duración con signo",
    "absolute-duration": "Duración absoluta",
    "iso-8601-duration": "Duración ISO 8601",
    "total-milliseconds": "Milisegundos totales",
    "total-seconds": "Segundos totales",
    "total-minutes": "Minutos totales",
    "total-hours": "Horas totales",
    "total-days": "Días totales"
  },
  "fr": {
    "results": "Résultats",
    "signed-duration": "Durée signée",
    "absolute-duration": "Durée absolue",
    "iso-8601-duration": "Durée ISO 8601",
    "total-milliseconds": "Millisecondes totales",
    "total-seconds": "Secondes totales",
    "total-minutes": "Minutes totales",
    "total-hours": "Heures totales",
    "total-days": "Jours totaux"
  },
  "de": {
    "results": "Ergebnisse",
    "signed-duration": "Vorzeichenbehaftete Dauer",
    "absolute-duration": "Absolute Dauer",
    "iso-8601-duration": "ISO 8601-Dauer",
    "total-milliseconds": "Millisekunden gesamt",
    "total-seconds": "Sekunden gesamt",
    "total-minutes": "Minuten gesamt",
    "total-hours": "Stunden gesamt",
    "total-days": "Tage gesamt"
  },
  "it": {
    "results": "Risultati",
    "signed-duration": "Durata con segno",
    "absolute-duration": "Durata assoluta",
    "iso-8601-duration": "Durata ISO 8601",
    "total-milliseconds": "Millisecondi totali",
    "total-seconds": "Secondi totali",
    "total-minutes": "Minuti totali",
    "total-hours": "Ore totali",
    "total-days": "Giorni totali"
  },
  "ja": {
    "results": "結果",
    "signed-duration": "符号付き期間",
    "absolute-duration": "絶対期間",
    "iso-8601-duration": "ISO 8601 期間",
    "total-milliseconds": "合計ミリ秒",
    "total-seconds": "合計秒",
    "total-minutes": "合計分",
    "total-hours": "合計時間",
    "total-days": "合計日"
  },
  "ko": {
    "results": "결과",
    "signed-duration": "부호 있는 기간",
    "absolute-duration": "절대 기간",
    "iso-8601-duration": "ISO 8601 기간",
    "total-milliseconds": "총 밀리초",
    "total-seconds": "총 초",
    "total-minutes": "총 분",
    "total-hours": "총 시간",
    "total-days": "총 일"
  },
  "ru": {
    "results": "Результаты",
    "signed-duration": "Длительность со знаком",
    "absolute-duration": "Абсолютная длительность",
    "iso-8601-duration": "Длительность ISO 8601",
    "total-milliseconds": "Всего миллисекунд",
    "total-seconds": "Всего секунд",
    "total-minutes": "Всего минут",
    "total-hours": "Всего часов",
    "total-days": "Всего дней"
  },
  "pt": {
    "results": "Resultados",
    "signed-duration": "Duração com sinal",
    "absolute-duration": "Duração absoluta",
    "iso-8601-duration": "Duração ISO 8601",
    "total-milliseconds": "Milissegundos totais",
    "total-seconds": "Segundos totais",
    "total-minutes": "Minutos totais",
    "total-hours": "Horas totais",
    "total-days": "Dias totais"
  },
  "ar": {
    "results": "النتائج",
    "signed-duration": "المدة مع الإشارة",
    "absolute-duration": "المدة المطلقة",
    "iso-8601-duration": "مدة ISO 8601",
    "total-milliseconds": "إجمالي المللي ثانية",
    "total-seconds": "إجمالي الثواني",
    "total-minutes": "إجمالي الدقائق",
    "total-hours": "إجمالي الساعات",
    "total-days": "إجمالي الأيام"
  },
  "hi": {
    "results": "परिणाम",
    "signed-duration": "चिह्नित अवधि",
    "absolute-duration": "पूर्ण अवधि",
    "iso-8601-duration": "ISO 8601 अवधि",
    "total-milliseconds": "कुल मिलीसेकंड",
    "total-seconds": "कुल सेकंड",
    "total-minutes": "कुल मिनट",
    "total-hours": "कुल घंटे",
    "total-days": "कुल दिन"
  },
  "tr": {
    "results": "Sonuçlar",
    "signed-duration": "İşaretli süre",
    "absolute-duration": "Mutlak süre",
    "iso-8601-duration": "ISO 8601 süresi",
    "total-milliseconds": "Toplam milisaniye",
    "total-seconds": "Toplam saniye",
    "total-minutes": "Toplam dakika",
    "total-hours": "Toplam saat",
    "total-days": "Toplam gün"
  },
  "nl": {
    "results": "Resultaten",
    "signed-duration": "Gesigneerde duur",
    "absolute-duration": "Absolute duur",
    "iso-8601-duration": "ISO 8601-duur",
    "total-milliseconds": "Totaal milliseconden",
    "total-seconds": "Totaal seconden",
    "total-minutes": "Totaal minuten",
    "total-hours": "Totaal uren",
    "total-days": "Totaal dagen"
  },
  "sv": {
    "results": "Resultat",
    "signed-duration": "Signerad varaktighet",
    "absolute-duration": "Absolut varaktighet",
    "iso-8601-duration": "ISO 8601-varaktighet",
    "total-milliseconds": "Totala millisekunder",
    "total-seconds": "Totala sekunder",
    "total-minutes": "Totala minuter",
    "total-hours": "Totala timmar",
    "total-days": "Totala dagar"
  },
  "pl": {
    "results": "Wyniki",
    "signed-duration": "Czas trwania ze znakiem",
    "absolute-duration": "Bezwzględny czas trwania",
    "iso-8601-duration": "Czas trwania ISO 8601",
    "total-milliseconds": "Łącznie milisekund",
    "total-seconds": "Łącznie sekund",
    "total-minutes": "Łącznie minut",
    "total-hours": "Łącznie godzin",
    "total-days": "Łącznie dni"
  },
  "vi": {
    "results": "Kết quả",
    "signed-duration": "Thời lượng có dấu",
    "absolute-duration": "Thời lượng tuyệt đối",
    "iso-8601-duration": "Thời lượng ISO 8601",
    "total-milliseconds": "Tổng mili giây",
    "total-seconds": "Tổng giây",
    "total-minutes": "Tổng phút",
    "total-hours": "Tổng giờ",
    "total-days": "Tổng ngày"
  },
  "th": {
    "results": "ผลลัพธ์",
    "signed-duration": "ระยะเวลาพร้อมเครื่องหมาย",
    "absolute-duration": "ระยะเวลาสัมบูรณ์",
    "iso-8601-duration": "ระยะเวลา ISO 8601",
    "total-milliseconds": "มิลลิวินาทีทั้งหมด",
    "total-seconds": "วินาทีทั้งหมด",
    "total-minutes": "นาทีทั้งหมด",
    "total-hours": "ชั่วโมงทั้งหมด",
    "total-days": "วันทั้งหมด"
  },
  "id": {
    "results": "Hasil",
    "signed-duration": "Durasi bertanda",
    "absolute-duration": "Durasi absolut",
    "iso-8601-duration": "Durasi ISO 8601",
    "total-milliseconds": "Total milidetik",
    "total-seconds": "Total detik",
    "total-minutes": "Total menit",
    "total-hours": "Total jam",
    "total-days": "Total hari"
  },
  "he": {
    "results": "תוצאות",
    "signed-duration": "משך עם סימן",
    "absolute-duration": "משך מוחלט",
    "iso-8601-duration": "משך ISO 8601",
    "total-milliseconds": "סה\"כ מילישניות",
    "total-seconds": "סה\"כ שניות",
    "total-minutes": "סה\"כ דקות",
    "total-hours": "סה\"כ שעות",
    "total-days": "סה\"כ ימים"
  },
  "ms": {
    "results": "Keputusan",
    "signed-duration": "Durasi bertanda",
    "absolute-duration": "Durasi mutlak",
    "iso-8601-duration": "Durasi ISO 8601",
    "total-milliseconds": "Jumlah milisaat",
    "total-seconds": "Jumlah saat",
    "total-minutes": "Jumlah minit",
    "total-hours": "Jumlah jam",
    "total-days": "Jumlah hari"
  },
  "no": {
    "results": "Resultater",
    "signed-duration": "Varighet med fortegn",
    "absolute-duration": "Absolutt varighet",
    "iso-8601-duration": "ISO 8601-varighet",
    "total-milliseconds": "Totale millisekunder",
    "total-seconds": "Totale sekunder",
    "total-minutes": "Totale minutter",
    "total-hours": "Totale timer",
    "total-days": "Totale dager"
  }
}
</i18n>
