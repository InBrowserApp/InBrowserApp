<template>
  <ToolSectionHeader>{{ t('cronExpression') }}</ToolSectionHeader>
  <ToolSection>
    <n-input
      v-model:value="expression"
      :placeholder="t('placeholder')"
      size="large"
      :status="validationResult.valid ? undefined : 'error'"
      clearable
    />
    <n-flex align="center" :size="8" style="margin-top: 8px">
      <n-text v-if="validationResult.valid" type="success">
        {{ t('valid') }}
      </n-text>
      <n-text v-else type="error">
        {{ validationResult.error || t('invalid') }}
      </n-text>
      <CopyToClipboardButton v-if="expression" :content="expression" />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NInput, NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { validateExpression } from '../utils/cron'

const expression = defineModel<string>('expression', { required: true })
const { t } = useI18n()

const validationResult = computed(() => {
  if (!expression.value.trim()) {
    return { valid: false, error: '' }
  }
  return validateExpression(expression.value)
})
</script>

<i18n lang="json">
{
  "en": {
    "cronExpression": "Cron Expression",
    "placeholder": "Enter cron expression (e.g., */5 * * * *)",
    "valid": "Valid expression",
    "invalid": "Invalid expression"
  },
  "zh": {
    "cronExpression": "Cron 表达式",
    "placeholder": "输入 Cron 表达式（例如：*/5 * * * *）",
    "valid": "有效的表达式",
    "invalid": "无效的表达式"
  },
  "zh-CN": {
    "cronExpression": "Cron 表达式",
    "placeholder": "输入 Cron 表达式（例如：*/5 * * * *）",
    "valid": "有效的表达式",
    "invalid": "无效的表达式"
  },
  "zh-TW": {
    "cronExpression": "Cron 表達式",
    "placeholder": "輸入 Cron 表達式（例如：*/5 * * * *）",
    "valid": "有效的表達式",
    "invalid": "無效的表達式"
  },
  "zh-HK": {
    "cronExpression": "Cron 表達式",
    "placeholder": "輸入 Cron 表達式（例如：*/5 * * * *）",
    "valid": "有效的表達式",
    "invalid": "無效的表達式"
  },
  "es": {
    "cronExpression": "Expresión Cron",
    "placeholder": "Ingrese expresión cron (ej., */5 * * * *)",
    "valid": "Expresión válida",
    "invalid": "Expresión inválida"
  },
  "fr": {
    "cronExpression": "Expression Cron",
    "placeholder": "Entrez une expression cron (ex., */5 * * * *)",
    "valid": "Expression valide",
    "invalid": "Expression invalide"
  },
  "de": {
    "cronExpression": "Cron-Ausdruck",
    "placeholder": "Cron-Ausdruck eingeben (z.B., */5 * * * *)",
    "valid": "Gültiger Ausdruck",
    "invalid": "Ungültiger Ausdruck"
  },
  "it": {
    "cronExpression": "Espressione Cron",
    "placeholder": "Inserisci espressione cron (es., */5 * * * *)",
    "valid": "Espressione valida",
    "invalid": "Espressione non valida"
  },
  "ja": {
    "cronExpression": "Cron 式",
    "placeholder": "Cron 式を入力（例：*/5 * * * *）",
    "valid": "有効な式",
    "invalid": "無効な式"
  },
  "ko": {
    "cronExpression": "Cron 표현식",
    "placeholder": "Cron 표현식 입력 (예: */5 * * * *)",
    "valid": "유효한 표현식",
    "invalid": "유효하지 않은 표현식"
  },
  "ru": {
    "cronExpression": "Cron-выражение",
    "placeholder": "Введите cron-выражение (напр., */5 * * * *)",
    "valid": "Действительное выражение",
    "invalid": "Недействительное выражение"
  },
  "pt": {
    "cronExpression": "Expressão Cron",
    "placeholder": "Digite expressão cron (ex., */5 * * * *)",
    "valid": "Expressão válida",
    "invalid": "Expressão inválida"
  },
  "ar": {
    "cronExpression": "تعبير Cron",
    "placeholder": "أدخل تعبير cron (مثال: */5 * * * *)",
    "valid": "تعبير صالح",
    "invalid": "تعبير غير صالح"
  },
  "hi": {
    "cronExpression": "Cron एक्सप्रेशन",
    "placeholder": "Cron एक्सप्रेशन दर्ज करें (जैसे, */5 * * * *)",
    "valid": "वैध एक्सप्रेशन",
    "invalid": "अवैध एक्सप्रेशन"
  },
  "tr": {
    "cronExpression": "Cron İfadesi",
    "placeholder": "Cron ifadesi girin (örn., */5 * * * *)",
    "valid": "Geçerli ifade",
    "invalid": "Geçersiz ifade"
  },
  "nl": {
    "cronExpression": "Cron Expressie",
    "placeholder": "Voer cron expressie in (bijv., */5 * * * *)",
    "valid": "Geldige expressie",
    "invalid": "Ongeldige expressie"
  },
  "sv": {
    "cronExpression": "Cron-uttryck",
    "placeholder": "Ange cron-uttryck (t.ex., */5 * * * *)",
    "valid": "Giltigt uttryck",
    "invalid": "Ogiltigt uttryck"
  },
  "pl": {
    "cronExpression": "Wyrażenie Cron",
    "placeholder": "Wprowadź wyrażenie cron (np., */5 * * * *)",
    "valid": "Prawidłowe wyrażenie",
    "invalid": "Nieprawidłowe wyrażenie"
  },
  "vi": {
    "cronExpression": "Biểu thức Cron",
    "placeholder": "Nhập biểu thức cron (vd., */5 * * * *)",
    "valid": "Biểu thức hợp lệ",
    "invalid": "Biểu thức không hợp lệ"
  },
  "th": {
    "cronExpression": "Cron Expression",
    "placeholder": "ป้อน cron expression (เช่น, */5 * * * *)",
    "valid": "expression ถูกต้อง",
    "invalid": "expression ไม่ถูกต้อง"
  },
  "id": {
    "cronExpression": "Ekspresi Cron",
    "placeholder": "Masukkan ekspresi cron (mis., */5 * * * *)",
    "valid": "Ekspresi valid",
    "invalid": "Ekspresi tidak valid"
  },
  "he": {
    "cronExpression": "ביטוי Cron",
    "placeholder": "הזן ביטוי cron (למשל, */5 * * * *)",
    "valid": "ביטוי תקין",
    "invalid": "ביטוי לא תקין"
  },
  "ms": {
    "cronExpression": "Ungkapan Cron",
    "placeholder": "Masukkan ungkapan cron (cth., */5 * * * *)",
    "valid": "Ungkapan sah",
    "invalid": "Ungkapan tidak sah"
  },
  "no": {
    "cronExpression": "Cron-uttrykk",
    "placeholder": "Skriv inn cron-uttrykk (f.eks., */5 * * * *)",
    "valid": "Gyldig uttrykk",
    "invalid": "Ugyldig uttrykk"
  }
}
</i18n>
