<template>
  <ToolSectionHeader>{{ t('presets') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex :size="8" wrap>
      <n-button
        v-for="preset in CRON_PRESETS"
        :key="preset.value"
        size="small"
        secondary
        @click="$emit('select', preset.value)"
      >
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
        {{ t(preset.label) }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const CRON_PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Every 30 minutes', value: '*/30 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at noon', value: '0 12 * * *' },
  { label: 'Every Sunday at midnight', value: '0 0 * * 0' },
  { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
  { label: 'First day of month', value: '0 0 1 * *' },
  { label: 'Every weekday at 9 AM', value: '0 9 * * 1-5' },
] as const

defineEmits<{
  select: [value: string]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "presets": "Quick Presets",
    "Every minute": "Every minute",
    "Every 5 minutes": "Every 5 minutes",
    "Every 15 minutes": "Every 15 minutes",
    "Every 30 minutes": "Every 30 minutes",
    "Every hour": "Every hour",
    "Every day at midnight": "Daily at midnight",
    "Every day at noon": "Daily at noon",
    "Every Sunday at midnight": "Every Sunday",
    "Every Monday at 9 AM": "Every Monday 9 AM",
    "First day of month": "Monthly",
    "Every weekday at 9 AM": "Weekdays 9 AM"
  },
  "zh": {
    "presets": "快速预设",
    "Every minute": "每分钟",
    "Every 5 minutes": "每5分钟",
    "Every 15 minutes": "每15分钟",
    "Every 30 minutes": "每30分钟",
    "Every hour": "每小时",
    "Every day at midnight": "每天午夜",
    "Every day at noon": "每天中午",
    "Every Sunday at midnight": "每周日",
    "Every Monday at 9 AM": "每周一9点",
    "First day of month": "每月",
    "Every weekday at 9 AM": "工作日9点"
  },
  "zh-CN": {
    "presets": "快速预设",
    "Every minute": "每分钟",
    "Every 5 minutes": "每5分钟",
    "Every 15 minutes": "每15分钟",
    "Every 30 minutes": "每30分钟",
    "Every hour": "每小时",
    "Every day at midnight": "每天午夜",
    "Every day at noon": "每天中午",
    "Every Sunday at midnight": "每周日",
    "Every Monday at 9 AM": "每周一9点",
    "First day of month": "每月",
    "Every weekday at 9 AM": "工作日9点"
  },
  "zh-TW": {
    "presets": "快速預設",
    "Every minute": "每分鐘",
    "Every 5 minutes": "每5分鐘",
    "Every 15 minutes": "每15分鐘",
    "Every 30 minutes": "每30分鐘",
    "Every hour": "每小時",
    "Every day at midnight": "每天午夜",
    "Every day at noon": "每天中午",
    "Every Sunday at midnight": "每週日",
    "Every Monday at 9 AM": "每週一9點",
    "First day of month": "每月",
    "Every weekday at 9 AM": "工作日9點"
  },
  "zh-HK": {
    "presets": "快速預設",
    "Every minute": "每分鐘",
    "Every 5 minutes": "每5分鐘",
    "Every 15 minutes": "每15分鐘",
    "Every 30 minutes": "每30分鐘",
    "Every hour": "每小時",
    "Every day at midnight": "每天午夜",
    "Every day at noon": "每天中午",
    "Every Sunday at midnight": "每週日",
    "Every Monday at 9 AM": "每週一9點",
    "First day of month": "每月",
    "Every weekday at 9 AM": "工作日9點"
  },
  "es": {
    "presets": "Preajustes rapidos",
    "Every minute": "Cada minuto",
    "Every 5 minutes": "Cada 5 minutos",
    "Every 15 minutes": "Cada 15 minutos",
    "Every 30 minutes": "Cada 30 minutos",
    "Every hour": "Cada hora",
    "Every day at midnight": "Diario a medianoche",
    "Every day at noon": "Diario al mediodia",
    "Every Sunday at midnight": "Cada domingo",
    "Every Monday at 9 AM": "Cada lunes 9 AM",
    "First day of month": "Mensual",
    "Every weekday at 9 AM": "Dias laborables 9 AM"
  },
  "fr": {
    "presets": "Preselections rapides",
    "Every minute": "Chaque minute",
    "Every 5 minutes": "Toutes les 5 minutes",
    "Every 15 minutes": "Toutes les 15 minutes",
    "Every 30 minutes": "Toutes les 30 minutes",
    "Every hour": "Chaque heure",
    "Every day at midnight": "Quotidien a minuit",
    "Every day at noon": "Quotidien a midi",
    "Every Sunday at midnight": "Chaque dimanche",
    "Every Monday at 9 AM": "Chaque lundi 9h",
    "First day of month": "Mensuel",
    "Every weekday at 9 AM": "Jours ouvrables 9h"
  },
  "de": {
    "presets": "Schnellvorlagen",
    "Every minute": "Jede Minute",
    "Every 5 minutes": "Alle 5 Minuten",
    "Every 15 minutes": "Alle 15 Minuten",
    "Every 30 minutes": "Alle 30 Minuten",
    "Every hour": "Jede Stunde",
    "Every day at midnight": "Taglich um Mitternacht",
    "Every day at noon": "Taglich um Mittag",
    "Every Sunday at midnight": "Jeden Sonntag",
    "Every Monday at 9 AM": "Jeden Montag 9 Uhr",
    "First day of month": "Monatlich",
    "Every weekday at 9 AM": "Wochentags 9 Uhr"
  },
  "it": {
    "presets": "Preset rapidi",
    "Every minute": "Ogni minuto",
    "Every 5 minutes": "Ogni 5 minuti",
    "Every 15 minutes": "Ogni 15 minuti",
    "Every 30 minutes": "Ogni 30 minuti",
    "Every hour": "Ogni ora",
    "Every day at midnight": "Ogni giorno a mezzanotte",
    "Every day at noon": "Ogni giorno a mezzogiorno",
    "Every Sunday at midnight": "Ogni domenica",
    "Every Monday at 9 AM": "Ogni lunedi alle 9",
    "First day of month": "Mensile",
    "Every weekday at 9 AM": "Giorni feriali alle 9"
  },
  "ja": {
    "presets": "クイックプリセット",
    "Every minute": "毎分",
    "Every 5 minutes": "5分ごと",
    "Every 15 minutes": "15分ごと",
    "Every 30 minutes": "30分ごと",
    "Every hour": "毎時",
    "Every day at midnight": "毎日深夜0時",
    "Every day at noon": "毎日正午",
    "Every Sunday at midnight": "毎週日曜日",
    "Every Monday at 9 AM": "毎週月曜9時",
    "First day of month": "毎月",
    "Every weekday at 9 AM": "平日9時"
  },
  "ko": {
    "presets": "빠른 프리셋",
    "Every minute": "매분",
    "Every 5 minutes": "5분마다",
    "Every 15 minutes": "15분마다",
    "Every 30 minutes": "30분마다",
    "Every hour": "매시간",
    "Every day at midnight": "매일 자정",
    "Every day at noon": "매일 정오",
    "Every Sunday at midnight": "매주 일요일",
    "Every Monday at 9 AM": "매주 월요일 9시",
    "First day of month": "매월",
    "Every weekday at 9 AM": "평일 9시"
  },
  "ru": {
    "presets": "Быстрые пресеты",
    "Every minute": "Каждую минуту",
    "Every 5 minutes": "Каждые 5 минут",
    "Every 15 minutes": "Каждые 15 минут",
    "Every 30 minutes": "Каждые 30 минут",
    "Every hour": "Каждый час",
    "Every day at midnight": "Ежедневно в полночь",
    "Every day at noon": "Ежедневно в полдень",
    "Every Sunday at midnight": "Каждое воскресенье",
    "Every Monday at 9 AM": "Каждый понедельник в 9",
    "First day of month": "Ежемесячно",
    "Every weekday at 9 AM": "Будни в 9"
  },
  "pt": {
    "presets": "Predefinicoes rapidas",
    "Every minute": "A cada minuto",
    "Every 5 minutes": "A cada 5 minutos",
    "Every 15 minutes": "A cada 15 minutos",
    "Every 30 minutes": "A cada 30 minutos",
    "Every hour": "A cada hora",
    "Every day at midnight": "Diariamente a meia-noite",
    "Every day at noon": "Diariamente ao meio-dia",
    "Every Sunday at midnight": "Todo domingo",
    "Every Monday at 9 AM": "Toda segunda 9h",
    "First day of month": "Mensal",
    "Every weekday at 9 AM": "Dias uteis 9h"
  },
  "ar": {
    "presets": "اعدادات سريعة",
    "Every minute": "كل دقيقة",
    "Every 5 minutes": "كل 5 دقائق",
    "Every 15 minutes": "كل 15 دقيقة",
    "Every 30 minutes": "كل 30 دقيقة",
    "Every hour": "كل ساعة",
    "Every day at midnight": "يوميا عند منتصف الليل",
    "Every day at noon": "يوميا عند الظهر",
    "Every Sunday at midnight": "كل احد",
    "Every Monday at 9 AM": "كل اثنين 9 صباحا",
    "First day of month": "شهريا",
    "Every weekday at 9 AM": "ايام العمل 9 صباحا"
  },
  "hi": {
    "presets": "त्वरित प्रीसेट",
    "Every minute": "हर मिनट",
    "Every 5 minutes": "हर 5 मिनट",
    "Every 15 minutes": "हर 15 मिनट",
    "Every 30 minutes": "हर 30 मिनट",
    "Every hour": "हर घंटे",
    "Every day at midnight": "रोज आधी रात",
    "Every day at noon": "रोज दोपहर",
    "Every Sunday at midnight": "हर रविवार",
    "Every Monday at 9 AM": "हर सोमवार 9 बजे",
    "First day of month": "मासिक",
    "Every weekday at 9 AM": "कार्यदिवस 9 बजे"
  },
  "tr": {
    "presets": "Hizli Onayarlar",
    "Every minute": "Her dakika",
    "Every 5 minutes": "Her 5 dakika",
    "Every 15 minutes": "Her 15 dakika",
    "Every 30 minutes": "Her 30 dakika",
    "Every hour": "Her saat",
    "Every day at midnight": "Her gun gece yarisi",
    "Every day at noon": "Her gun ogle",
    "Every Sunday at midnight": "Her pazar",
    "Every Monday at 9 AM": "Her pazartesi 9",
    "First day of month": "Aylik",
    "Every weekday at 9 AM": "Hafta ici 9"
  },
  "nl": {
    "presets": "Snelle presets",
    "Every minute": "Elke minuut",
    "Every 5 minutes": "Elke 5 minuten",
    "Every 15 minutes": "Elke 15 minuten",
    "Every 30 minutes": "Elke 30 minuten",
    "Every hour": "Elk uur",
    "Every day at midnight": "Dagelijks om middernacht",
    "Every day at noon": "Dagelijks om 12 uur",
    "Every Sunday at midnight": "Elke zondag",
    "Every Monday at 9 AM": "Elke maandag 9 uur",
    "First day of month": "Maandelijks",
    "Every weekday at 9 AM": "Werkdagen 9 uur"
  },
  "sv": {
    "presets": "Snabbval",
    "Every minute": "Varje minut",
    "Every 5 minutes": "Var 5:e minut",
    "Every 15 minutes": "Var 15:e minut",
    "Every 30 minutes": "Var 30:e minut",
    "Every hour": "Varje timme",
    "Every day at midnight": "Dagligen vid midnatt",
    "Every day at noon": "Dagligen vid middag",
    "Every Sunday at midnight": "Varje sondag",
    "Every Monday at 9 AM": "Varje mandag kl 9",
    "First day of month": "Manadsvis",
    "Every weekday at 9 AM": "Vardagar kl 9"
  },
  "pl": {
    "presets": "Szybkie ustawienia",
    "Every minute": "Co minute",
    "Every 5 minutes": "Co 5 minut",
    "Every 15 minutes": "Co 15 minut",
    "Every 30 minutes": "Co 30 minut",
    "Every hour": "Co godzine",
    "Every day at midnight": "Codziennie o polnocy",
    "Every day at noon": "Codziennie w poludnie",
    "Every Sunday at midnight": "Kazda niedziela",
    "Every Monday at 9 AM": "Kazdy poniedzialek o 9",
    "First day of month": "Miesieczne",
    "Every weekday at 9 AM": "Dni robocze o 9"
  },
  "vi": {
    "presets": "Cai dat nhanh",
    "Every minute": "Moi phut",
    "Every 5 minutes": "Moi 5 phut",
    "Every 15 minutes": "Moi 15 phut",
    "Every 30 minutes": "Moi 30 phut",
    "Every hour": "Moi gio",
    "Every day at midnight": "Hang ngay luc nua dem",
    "Every day at noon": "Hang ngay luc trua",
    "Every Sunday at midnight": "Moi chu nhat",
    "Every Monday at 9 AM": "Moi thu hai 9 gio",
    "First day of month": "Hang thang",
    "Every weekday at 9 AM": "Ngay thuong 9 gio"
  },
  "th": {
    "presets": "การตั้งค่าด่วน",
    "Every minute": "ทุกนาที",
    "Every 5 minutes": "ทุก 5 นาที",
    "Every 15 minutes": "ทุก 15 นาที",
    "Every 30 minutes": "ทุก 30 นาที",
    "Every hour": "ทุกชั่วโมง",
    "Every day at midnight": "ทุกวันเที่ยงคืน",
    "Every day at noon": "ทุกวันเที่ยง",
    "Every Sunday at midnight": "ทุกวันอาทิตย์",
    "Every Monday at 9 AM": "ทุกวันจันทร์ 9 โมง",
    "First day of month": "รายเดือน",
    "Every weekday at 9 AM": "วันทำงาน 9 โมง"
  },
  "id": {
    "presets": "Preset Cepat",
    "Every minute": "Setiap menit",
    "Every 5 minutes": "Setiap 5 menit",
    "Every 15 minutes": "Setiap 15 menit",
    "Every 30 minutes": "Setiap 30 menit",
    "Every hour": "Setiap jam",
    "Every day at midnight": "Setiap hari tengah malam",
    "Every day at noon": "Setiap hari siang",
    "Every Sunday at midnight": "Setiap Minggu",
    "Every Monday at 9 AM": "Setiap Senin jam 9",
    "First day of month": "Bulanan",
    "Every weekday at 9 AM": "Hari kerja jam 9"
  },
  "he": {
    "presets": "הגדרות מהירות",
    "Every minute": "כל דקה",
    "Every 5 minutes": "כל 5 דקות",
    "Every 15 minutes": "כל 15 דקות",
    "Every 30 minutes": "כל 30 דקות",
    "Every hour": "כל שעה",
    "Every day at midnight": "יומי בחצות",
    "Every day at noon": "יומי בצהריים",
    "Every Sunday at midnight": "כל יום ראשון",
    "Every Monday at 9 AM": "כל יום שני ב-9",
    "First day of month": "חודשי",
    "Every weekday at 9 AM": "ימי עבודה ב-9"
  },
  "ms": {
    "presets": "Pratetap Pantas",
    "Every minute": "Setiap minit",
    "Every 5 minutes": "Setiap 5 minit",
    "Every 15 minutes": "Setiap 15 minit",
    "Every 30 minutes": "Setiap 30 minit",
    "Every hour": "Setiap jam",
    "Every day at midnight": "Setiap hari tengah malam",
    "Every day at noon": "Setiap hari tengah hari",
    "Every Sunday at midnight": "Setiap Ahad",
    "Every Monday at 9 AM": "Setiap Isnin jam 9",
    "First day of month": "Bulanan",
    "Every weekday at 9 AM": "Hari bekerja jam 9"
  },
  "no": {
    "presets": "Hurtigvalg",
    "Every minute": "Hvert minutt",
    "Every 5 minutes": "Hvert 5. minutt",
    "Every 15 minutes": "Hvert 15. minutt",
    "Every 30 minutes": "Hvert 30. minutt",
    "Every hour": "Hver time",
    "Every day at midnight": "Daglig ved midnatt",
    "Every day at noon": "Daglig ved middag",
    "Every Sunday at midnight": "Hver sondag",
    "Every Monday at 9 AM": "Hver mandag kl 9",
    "First day of month": "Manedlig",
    "Every weekday at 9 AM": "Ukedager kl 9"
  }
}
</i18n>
