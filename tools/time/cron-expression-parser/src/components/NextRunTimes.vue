<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-data-table
      v-if="runTimes.length > 0"
      :columns="columns"
      :data="tableData"
      :bordered="false"
      size="small"
    />
    <n-text v-else depth="3">{{ t('noTimes') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDataTable, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  runTimes: Date[]
}>()

const { t, locale } = useI18n()

const columns = computed(() => [
  {
    title: '#',
    key: 'index',
    width: 50,
  },
  {
    title: t('dateTime'),
    key: 'dateTime',
  },
  {
    title: t('relative'),
    key: 'relative',
  },
])

const tableData = computed(() =>
  props.runTimes.map((date, index) => ({
    key: index,
    index: index + 1,
    dateTime: formatDateTime(date),
    relative: formatRelative(date),
  })),
)

function formatDateTime(date: Date): string {
  return date.toLocaleString(locale.value, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function formatRelative(date: Date): string {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return t('inDays', { n: days })
  }
  if (hours > 0) {
    return t('inHours', { n: hours })
  }
  if (minutes > 0) {
    return t('inMinutes', { n: minutes })
  }
  return t('inSeconds', { n: seconds })
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Next 10 Executions",
    "dateTime": "Date & Time",
    "relative": "Relative",
    "noTimes": "Enter a valid cron expression to see execution times",
    "inDays": "in {n} day(s)",
    "inHours": "in {n} hour(s)",
    "inMinutes": "in {n} minute(s)",
    "inSeconds": "in {n} second(s)"
  },
  "zh": {
    "title": "下 10 次执行时间",
    "dateTime": "日期和时间",
    "relative": "相对时间",
    "noTimes": "输入有效的 Cron 表达式以查看执行时间",
    "inDays": "{n} 天后",
    "inHours": "{n} 小时后",
    "inMinutes": "{n} 分钟后",
    "inSeconds": "{n} 秒后"
  },
  "zh-CN": {
    "title": "下 10 次执行时间",
    "dateTime": "日期和时间",
    "relative": "相对时间",
    "noTimes": "输入有效的 Cron 表达式以查看执行时间",
    "inDays": "{n} 天后",
    "inHours": "{n} 小时后",
    "inMinutes": "{n} 分钟后",
    "inSeconds": "{n} 秒后"
  },
  "zh-TW": {
    "title": "下 10 次執行時間",
    "dateTime": "日期和時間",
    "relative": "相對時間",
    "noTimes": "輸入有效的 Cron 表達式以查看執行時間",
    "inDays": "{n} 天後",
    "inHours": "{n} 小時後",
    "inMinutes": "{n} 分鐘後",
    "inSeconds": "{n} 秒後"
  },
  "zh-HK": {
    "title": "下 10 次執行時間",
    "dateTime": "日期和時間",
    "relative": "相對時間",
    "noTimes": "輸入有效的 Cron 表達式以查看執行時間",
    "inDays": "{n} 天後",
    "inHours": "{n} 小時後",
    "inMinutes": "{n} 分鐘後",
    "inSeconds": "{n} 秒後"
  },
  "es": {
    "title": "Próximas 10 Ejecuciones",
    "dateTime": "Fecha y Hora",
    "relative": "Relativo",
    "noTimes": "Ingrese una expresión cron válida para ver los tiempos de ejecución",
    "inDays": "en {n} día(s)",
    "inHours": "en {n} hora(s)",
    "inMinutes": "en {n} minuto(s)",
    "inSeconds": "en {n} segundo(s)"
  },
  "fr": {
    "title": "10 Prochaines Exécutions",
    "dateTime": "Date et Heure",
    "relative": "Relatif",
    "noTimes": "Entrez une expression cron valide pour voir les temps d'exécution",
    "inDays": "dans {n} jour(s)",
    "inHours": "dans {n} heure(s)",
    "inMinutes": "dans {n} minute(s)",
    "inSeconds": "dans {n} seconde(s)"
  },
  "de": {
    "title": "Nächste 10 Ausführungen",
    "dateTime": "Datum & Uhrzeit",
    "relative": "Relativ",
    "noTimes": "Geben Sie einen gültigen Cron-Ausdruck ein, um Ausführungszeiten zu sehen",
    "inDays": "in {n} Tag(en)",
    "inHours": "in {n} Stunde(n)",
    "inMinutes": "in {n} Minute(n)",
    "inSeconds": "in {n} Sekunde(n)"
  },
  "it": {
    "title": "Prossime 10 Esecuzioni",
    "dateTime": "Data e Ora",
    "relative": "Relativo",
    "noTimes": "Inserisci un'espressione cron valida per vedere i tempi di esecuzione",
    "inDays": "tra {n} giorno/i",
    "inHours": "tra {n} ora/e",
    "inMinutes": "tra {n} minuto/i",
    "inSeconds": "tra {n} secondo/i"
  },
  "ja": {
    "title": "次の 10 回の実行",
    "dateTime": "日時",
    "relative": "相対時間",
    "noTimes": "実行時間を表示するには有効な Cron 式を入力してください",
    "inDays": "{n} 日後",
    "inHours": "{n} 時間後",
    "inMinutes": "{n} 分後",
    "inSeconds": "{n} 秒後"
  },
  "ko": {
    "title": "다음 10회 실행",
    "dateTime": "날짜 및 시간",
    "relative": "상대 시간",
    "noTimes": "실행 시간을 보려면 유효한 Cron 표현식을 입력하세요",
    "inDays": "{n}일 후",
    "inHours": "{n}시간 후",
    "inMinutes": "{n}분 후",
    "inSeconds": "{n}초 후"
  },
  "ru": {
    "title": "Следующие 10 выполнений",
    "dateTime": "Дата и Время",
    "relative": "Относительное",
    "noTimes": "Введите действительное cron-выражение для отображения времени выполнения",
    "inDays": "через {n} день/дней",
    "inHours": "через {n} час/часов",
    "inMinutes": "через {n} минуту/минут",
    "inSeconds": "через {n} секунду/секунд"
  },
  "pt": {
    "title": "Próximas 10 Execuções",
    "dateTime": "Data e Hora",
    "relative": "Relativo",
    "noTimes": "Digite uma expressão cron válida para ver os horários de execução",
    "inDays": "em {n} dia(s)",
    "inHours": "em {n} hora(s)",
    "inMinutes": "em {n} minuto(s)",
    "inSeconds": "em {n} segundo(s)"
  },
  "ar": {
    "title": "عمليات التنفيذ العشر التالية",
    "dateTime": "التاريخ والوقت",
    "relative": "نسبي",
    "noTimes": "أدخل تعبير cron صالح لعرض أوقات التنفيذ",
    "inDays": "بعد {n} يوم/أيام",
    "inHours": "بعد {n} ساعة/ساعات",
    "inMinutes": "بعد {n} دقيقة/دقائق",
    "inSeconds": "بعد {n} ثانية/ثواني"
  },
  "hi": {
    "title": "अगले 10 निष्पादन",
    "dateTime": "दिनांक और समय",
    "relative": "सापेक्ष",
    "noTimes": "निष्पादन समय देखने के लिए एक वैध Cron एक्सप्रेशन दर्ज करें",
    "inDays": "{n} दिन में",
    "inHours": "{n} घंटे में",
    "inMinutes": "{n} मिनट में",
    "inSeconds": "{n} सेकंड में"
  },
  "tr": {
    "title": "Sonraki 10 Çalıştırma",
    "dateTime": "Tarih ve Saat",
    "relative": "Göreli",
    "noTimes": "Çalıştırma zamanlarını görmek için geçerli bir cron ifadesi girin",
    "inDays": "{n} gün içinde",
    "inHours": "{n} saat içinde",
    "inMinutes": "{n} dakika içinde",
    "inSeconds": "{n} saniye içinde"
  },
  "nl": {
    "title": "Volgende 10 Uitvoeringen",
    "dateTime": "Datum & Tijd",
    "relative": "Relatief",
    "noTimes": "Voer een geldige cron-expressie in om uitvoeringstijden te zien",
    "inDays": "over {n} dag(en)",
    "inHours": "over {n} uur",
    "inMinutes": "over {n} minuut/minuten",
    "inSeconds": "over {n} seconde(n)"
  },
  "sv": {
    "title": "Nästa 10 Körningar",
    "dateTime": "Datum & Tid",
    "relative": "Relativt",
    "noTimes": "Ange ett giltigt cron-uttryck för att se körningstider",
    "inDays": "om {n} dag(ar)",
    "inHours": "om {n} timme/timmar",
    "inMinutes": "om {n} minut(er)",
    "inSeconds": "om {n} sekund(er)"
  },
  "pl": {
    "title": "Następne 10 Wykonań",
    "dateTime": "Data i Czas",
    "relative": "Względny",
    "noTimes": "Wprowadź prawidłowe wyrażenie cron, aby zobaczyć czasy wykonania",
    "inDays": "za {n} dzień/dni",
    "inHours": "za {n} godzinę/godzin",
    "inMinutes": "za {n} minutę/minut",
    "inSeconds": "za {n} sekundę/sekund"
  },
  "vi": {
    "title": "10 Lần Thực Thi Tiếp Theo",
    "dateTime": "Ngày & Giờ",
    "relative": "Tương đối",
    "noTimes": "Nhập biểu thức cron hợp lệ để xem thời gian thực thi",
    "inDays": "trong {n} ngày",
    "inHours": "trong {n} giờ",
    "inMinutes": "trong {n} phút",
    "inSeconds": "trong {n} giây"
  },
  "th": {
    "title": "10 การดำเนินการถัดไป",
    "dateTime": "วันที่และเวลา",
    "relative": "สัมพัทธ์",
    "noTimes": "ป้อน cron expression ที่ถูกต้องเพื่อดูเวลาดำเนินการ",
    "inDays": "ใน {n} วัน",
    "inHours": "ใน {n} ชั่วโมง",
    "inMinutes": "ใน {n} นาที",
    "inSeconds": "ใน {n} วินาที"
  },
  "id": {
    "title": "10 Eksekusi Berikutnya",
    "dateTime": "Tanggal & Waktu",
    "relative": "Relatif",
    "noTimes": "Masukkan ekspresi cron yang valid untuk melihat waktu eksekusi",
    "inDays": "dalam {n} hari",
    "inHours": "dalam {n} jam",
    "inMinutes": "dalam {n} menit",
    "inSeconds": "dalam {n} detik"
  },
  "he": {
    "title": "10 ההרצות הבאות",
    "dateTime": "תאריך ושעה",
    "relative": "יחסי",
    "noTimes": "הזן ביטוי cron תקין כדי לראות זמני הרצה",
    "inDays": "בעוד {n} יום/ימים",
    "inHours": "בעוד {n} שעה/שעות",
    "inMinutes": "בעוד {n} דקה/דקות",
    "inSeconds": "בעוד {n} שנייה/שניות"
  },
  "ms": {
    "title": "10 Pelaksanaan Seterusnya",
    "dateTime": "Tarikh & Masa",
    "relative": "Relatif",
    "noTimes": "Masukkan ungkapan cron yang sah untuk melihat masa pelaksanaan",
    "inDays": "dalam {n} hari",
    "inHours": "dalam {n} jam",
    "inMinutes": "dalam {n} minit",
    "inSeconds": "dalam {n} saat"
  },
  "no": {
    "title": "Neste 10 Kjøringer",
    "dateTime": "Dato og Tid",
    "relative": "Relativ",
    "noTimes": "Skriv inn et gyldig cron-uttrykk for å se kjøretider",
    "inDays": "om {n} dag(er)",
    "inHours": "om {n} time(r)",
    "inMinutes": "om {n} minutt(er)",
    "inSeconds": "om {n} sekund(er)"
  }
}
</i18n>
