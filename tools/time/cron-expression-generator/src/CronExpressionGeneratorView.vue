<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <!-- Output area -->
    <CronOutput :expression="expression" :human-description="humanDescription" />

    <!-- Quick presets -->
    <CronPresets @select="applyPreset" />

    <!-- Field configuration -->
    <ToolSectionHeader>{{ t('configureFields') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="16">
        <CronFieldBuilder v-model="minute" field-name="minute" />
        <CronFieldBuilder v-model="hour" field-name="hour" />
        <CronFieldBuilder v-model="dayOfMonth" field-name="dayOfMonth" />
        <CronFieldBuilder v-model="month" field-name="month" />
        <CronFieldBuilder v-model="dayOfWeek" field-name="dayOfWeek" />
      </n-flex>
    </ToolSection>

    <!-- Next run times -->
    <NextRunTimes :run-times="nextRunTimes" />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import * as toolInfo from './info'
import CronOutput from './components/CronOutput.vue'
import CronPresets from './components/CronPresets.vue'
import CronFieldBuilder from './components/CronFieldBuilder.vue'
import NextRunTimes from './components/NextRunTimes.vue'

const { t, locale } = useI18n()

// Field values with persistence
const minute = useStorage('tools:cron-expression-generator:minute', '*')
const hour = useStorage('tools:cron-expression-generator:hour', '*')
const dayOfMonth = useStorage('tools:cron-expression-generator:dayOfMonth', '*')
const month = useStorage('tools:cron-expression-generator:month', '*')
const dayOfWeek = useStorage('tools:cron-expression-generator:dayOfWeek', '*')

// Generated expression
const expression = computed(() => {
  return `${minute.value} ${hour.value} ${dayOfMonth.value} ${month.value} ${dayOfWeek.value}`
})

// Validation
const isValid = computed(() => {
  try {
    CronExpressionParser.parse(expression.value)
    return true
  } catch {
    return false
  }
})

// Human-readable description
const humanDescription = computed(() => {
  if (!isValid.value) return ''
  try {
    const cronstrueLocale = mapToCronstrueLocale(locale.value)
    return cronstrue.toString(expression.value, { locale: cronstrueLocale })
  } catch {
    return ''
  }
})

// Next run times
const nextRunTimes = computed(() => {
  if (!isValid.value) return []
  try {
    const interval = CronExpressionParser.parse(expression.value)
    const dates: Date[] = []
    for (let i = 0; i < 5; i++) {
      dates.push(interval.next().toDate())
    }
    return dates
  } catch {
    return []
  }
})

// Apply preset
function applyPreset(presetValue: string) {
  const parts = presetValue.split(' ')
  if (parts.length === 5) {
    minute.value = parts[0]!
    hour.value = parts[1]!
    dayOfMonth.value = parts[2]!
    month.value = parts[3]!
    dayOfWeek.value = parts[4]!
  }
}

// Map locale to cronstrue locale
function mapToCronstrueLocale(appLocale: string): string {
  const localeMap: Record<string, string> = {
    en: 'en',
    zh: 'zh_CN',
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW',
    'zh-HK': 'zh_TW',
    es: 'es',
    fr: 'fr',
    de: 'de',
    it: 'it',
    ja: 'ja',
    ko: 'ko',
    ru: 'ru',
    pt: 'pt_BR',
    ar: 'ar',
    hi: 'en',
    tr: 'tr',
    nl: 'nl',
    sv: 'sv',
    pl: 'pl',
    vi: 'vi',
    th: 'th',
    id: 'id',
    he: 'he',
    ms: 'en',
    no: 'nb',
  }
  return localeMap[appLocale] || 'en'
}
</script>

<i18n lang="json">
{
  "en": {
    "configureFields": "Configure Fields"
  },
  "zh": {
    "configureFields": "配置字段"
  },
  "zh-CN": {
    "configureFields": "配置字段"
  },
  "zh-TW": {
    "configureFields": "設定欄位"
  },
  "zh-HK": {
    "configureFields": "設定欄位"
  },
  "es": {
    "configureFields": "Configurar Campos"
  },
  "fr": {
    "configureFields": "Configurer les Champs"
  },
  "de": {
    "configureFields": "Felder Konfigurieren"
  },
  "it": {
    "configureFields": "Configura Campi"
  },
  "ja": {
    "configureFields": "フィールドを設定"
  },
  "ko": {
    "configureFields": "필드 구성"
  },
  "ru": {
    "configureFields": "Настроить Поля"
  },
  "pt": {
    "configureFields": "Configurar Campos"
  },
  "ar": {
    "configureFields": "تكوين الحقول"
  },
  "hi": {
    "configureFields": "फ़ील्ड कॉन्फ़िगर करें"
  },
  "tr": {
    "configureFields": "Alanları Yapılandır"
  },
  "nl": {
    "configureFields": "Velden Configureren"
  },
  "sv": {
    "configureFields": "Konfigurera Fält"
  },
  "pl": {
    "configureFields": "Konfiguruj Pola"
  },
  "vi": {
    "configureFields": "Cấu Hình Trường"
  },
  "th": {
    "configureFields": "กำหนดค่าฟิลด์"
  },
  "id": {
    "configureFields": "Konfigurasi Bidang"
  },
  "he": {
    "configureFields": "הגדר שדות"
  },
  "ms": {
    "configureFields": "Konfigurasikan Medan"
  },
  "no": {
    "configureFields": "Konfigurer Felt"
  }
}
</i18n>
