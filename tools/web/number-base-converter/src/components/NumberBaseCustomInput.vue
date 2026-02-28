<template>
  <ToolSection>
    <n-flex justify="space-between" align="center" class="section-header">
      <n-flex align="center" :size="8">
        <span class="section-title">{{ t('customBase') }}</span>
        <n-input-number
          v-model:value="customBaseValue"
          :min="2"
          :max="64"
          size="small"
          class="base-input"
        />
      </n-flex>
      <CopyToClipboardButton :content="custom" size="small" />
    </n-flex>
    <n-input
      :value="custom"
      :status="customStatus"
      :placeholder="t('enterCustom')"
      class="monospace-input"
      @update:value="onInput('custom', $event)"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInput, NInputNumber } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  custom: string
  customStatus?: 'success' | 'warning' | 'error'
  onInput: (source: 'custom', value: string) => void
}>()

const customBaseValue = defineModel<number>('customBaseValue', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "customBase": "Custom Base",
    "enterCustom": "Enter number..."
  },
  "zh": {
    "customBase": "自定义进制",
    "enterCustom": "输入数字..."
  },
  "zh-CN": {
    "customBase": "自定义进制",
    "enterCustom": "输入数字..."
  },
  "zh-TW": {
    "customBase": "自訂進制",
    "enterCustom": "輸入數字..."
  },
  "zh-HK": {
    "customBase": "自訂進制",
    "enterCustom": "輸入數字..."
  },
  "es": {
    "customBase": "Base personalizada",
    "enterCustom": "Ingrese numero..."
  },
  "fr": {
    "customBase": "Base personnalisee",
    "enterCustom": "Entrez nombre..."
  },
  "de": {
    "customBase": "Benutzerdefinierte Basis",
    "enterCustom": "Zahl eingeben..."
  },
  "it": {
    "customBase": "Base personalizzata",
    "enterCustom": "Inserisci numero..."
  },
  "ja": {
    "customBase": "カスタム基数",
    "enterCustom": "数値を入力..."
  },
  "ko": {
    "customBase": "사용자 정의 진수",
    "enterCustom": "숫자 입력..."
  },
  "ru": {
    "customBase": "Пользовательская база",
    "enterCustom": "Введите число..."
  },
  "pt": {
    "customBase": "Base personalizada",
    "enterCustom": "Digite numero..."
  },
  "ar": {
    "customBase": "قاعدة مخصصة",
    "enterCustom": "ادخل رقم..."
  },
  "hi": {
    "customBase": "कस्टम बेस",
    "enterCustom": "संख्या दर्ज करें..."
  },
  "tr": {
    "customBase": "Ozel taban",
    "enterCustom": "Sayi girin..."
  },
  "nl": {
    "customBase": "Aangepaste basis",
    "enterCustom": "Voer nummer in..."
  },
  "sv": {
    "customBase": "Anpassad bas",
    "enterCustom": "Ange nummer..."
  },
  "pl": {
    "customBase": "Niestandardowa podstawa",
    "enterCustom": "Wprowadz liczbe..."
  },
  "vi": {
    "customBase": "Co so tuy chinh",
    "enterCustom": "Nhap so..."
  },
  "th": {
    "customBase": "ฐานกำหนดเอง",
    "enterCustom": "ป้อนตัวเลข..."
  },
  "id": {
    "customBase": "Basis kustom",
    "enterCustom": "Masukkan angka..."
  },
  "he": {
    "customBase": "בסיס מותאם אישית",
    "enterCustom": "הזן מספר..."
  },
  "ms": {
    "customBase": "Asas tersuai",
    "enterCustom": "Masukkan nombor..."
  },
  "no": {
    "customBase": "Egendefinert base",
    "enterCustom": "Skriv inn nummer..."
  }
}
</i18n>

<style scoped>
.section-header {
  margin-bottom: 8px;
}

.section-title {
  font-weight: 500;
  font-size: 14px;
}

.base-input {
  width: 90px;
}

.monospace-input :deep(input) {
  font-family: var(--n-font-family-mono, monospace);
}
</style>
