<template>
  <ToolSection>
    <n-flex vertical :size="12" align="center">
      <!-- Expression display -->
      <n-flex align="center" :size="12">
        <n-text code style="font-size: 1.5em; padding: 8px 16px">
          {{ expression }}
        </n-text>
        <CopyToClipboardButton :content="expression" />
      </n-flex>

      <!-- Human-readable description -->
      <n-text v-if="humanDescription" depth="2" style="text-align: center">
        {{ humanDescription }}
      </n-text>
      <n-text v-else depth="3" style="text-align: center">
        {{ t('invalidExpression') }}
      </n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  expression: string
  humanDescription: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "invalidExpression": "Invalid cron expression"
  },
  "zh": {
    "invalidExpression": "无效的 cron 表达式"
  },
  "zh-CN": {
    "invalidExpression": "无效的 cron 表达式"
  },
  "zh-TW": {
    "invalidExpression": "無效的 cron 表達式"
  },
  "zh-HK": {
    "invalidExpression": "無效的 cron 表達式"
  },
  "es": {
    "invalidExpression": "Expresion cron invalida"
  },
  "fr": {
    "invalidExpression": "Expression cron invalide"
  },
  "de": {
    "invalidExpression": "Ungultiger Cron-Ausdruck"
  },
  "it": {
    "invalidExpression": "Espressione cron non valida"
  },
  "ja": {
    "invalidExpression": "無効な cron 式"
  },
  "ko": {
    "invalidExpression": "잘못된 cron 표현식"
  },
  "ru": {
    "invalidExpression": "Недопустимое выражение cron"
  },
  "pt": {
    "invalidExpression": "Expressao cron invalida"
  },
  "ar": {
    "invalidExpression": "تعبير cron غير صالح"
  },
  "hi": {
    "invalidExpression": "अमान्य cron अभिव्यक्ति"
  },
  "tr": {
    "invalidExpression": "Gecersiz cron ifadesi"
  },
  "nl": {
    "invalidExpression": "Ongeldige cron-expressie"
  },
  "sv": {
    "invalidExpression": "Ogiltigt cron-uttryck"
  },
  "pl": {
    "invalidExpression": "Nieprawidlowe wyrazenie cron"
  },
  "vi": {
    "invalidExpression": "Bieu thuc cron khong hop le"
  },
  "th": {
    "invalidExpression": "นิพจน์ cron ไม่ถูกต้อง"
  },
  "id": {
    "invalidExpression": "Ekspresi cron tidak valid"
  },
  "he": {
    "invalidExpression": "ביטוי cron לא חוקי"
  },
  "ms": {
    "invalidExpression": "Ungkapan cron tidak sah"
  },
  "no": {
    "invalidExpression": "Ugyldig cron-uttrykk"
  }
}
</i18n>
