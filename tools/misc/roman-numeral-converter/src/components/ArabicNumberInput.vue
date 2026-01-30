<template>
  <ToolSectionHeader>{{ t('arabicNumber') }}</ToolSectionHeader>
  <ToolSection>
    <n-form-item :show-label="false">
      <n-input-number
        v-model:value="value"
        :min="1"
        :max="3999"
        style="width: 100%"
        :placeholder="t('arabicPlaceholder')"
        size="large"
      />
    </n-form-item>
    <CopyToClipboardButton :content="value" />
  </ToolSection>
</template>

<script setup lang="ts">
import { NInputNumber, NFormItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

const value = defineModel<number>('value', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "arabicNumber": "Arabic Number (1-3999)",
    "arabicPlaceholder": "Enter Arabic number..."
  },
  "zh": {
    "arabicNumber": "阿拉伯数字 (1-3999)",
    "arabicPlaceholder": "输入阿拉伯数字..."
  },
  "zh-CN": {
    "arabicNumber": "阿拉伯数字 (1-3999)",
    "arabicPlaceholder": "输入阿拉伯数字..."
  },
  "zh-TW": {
    "arabicNumber": "阿拉伯數字 (1-3999)",
    "arabicPlaceholder": "輸入阿拉伯數字..."
  },
  "zh-HK": {
    "arabicNumber": "阿拉伯數字 (1-3999)",
    "arabicPlaceholder": "輸入阿拉伯數字..."
  },
  "es": {
    "arabicNumber": "Número Arábigo (1-3999)",
    "arabicPlaceholder": "Ingresa número arábigo..."
  },
  "fr": {
    "arabicNumber": "Nombre Arabe (1-3999)",
    "arabicPlaceholder": "Entrez un nombre arabe..."
  },
  "de": {
    "arabicNumber": "Arabische Zahl (1-3999)",
    "arabicPlaceholder": "Arabische Zahl eingeben..."
  },
  "it": {
    "arabicNumber": "Numero Arabo (1-3999)",
    "arabicPlaceholder": "Inserisci numero arabo..."
  },
  "ja": {
    "arabicNumber": "アラビア数字 (1-3999)",
    "arabicPlaceholder": "アラビア数字を入力..."
  },
  "ko": {
    "arabicNumber": "아라비아 숫자 (1-3999)",
    "arabicPlaceholder": "아라비아 숫자 입력..."
  },
  "ru": {
    "arabicNumber": "Арабская цифра (1-3999)",
    "arabicPlaceholder": "Введите арабскую цифру..."
  },
  "pt": {
    "arabicNumber": "Número Arábico (1-3999)",
    "arabicPlaceholder": "Digite número arábico..."
  },
  "ar": {
    "arabicNumber": "الرقم العربي (1-3999)",
    "arabicPlaceholder": "أدخل الرقم العربي..."
  },
  "hi": {
    "arabicNumber": "अरबी संख्या (1-3999)",
    "arabicPlaceholder": "अरबी संख्या दर्ज करें..."
  },
  "tr": {
    "arabicNumber": "Arap Rakamı (1-3999)",
    "arabicPlaceholder": "Arap rakamı girin..."
  },
  "nl": {
    "arabicNumber": "Arabisch Cijfer (1-3999)",
    "arabicPlaceholder": "Voer Arabisch cijfer in..."
  },
  "sv": {
    "arabicNumber": "Arabisk Siffra (1-3999)",
    "arabicPlaceholder": "Ange arabisk siffra..."
  },
  "pl": {
    "arabicNumber": "Cyfra Arabska (1-3999)",
    "arabicPlaceholder": "Wprowadź cyfrę arabską..."
  },
  "vi": {
    "arabicNumber": "Số Ả Rập (1-3999)",
    "arabicPlaceholder": "Nhập số Ả Rập..."
  },
  "th": {
    "arabicNumber": "ตัวเลขอารบิก (1-3999)",
    "arabicPlaceholder": "ป้อนตัวเลขอารบิก..."
  },
  "id": {
    "arabicNumber": "Angka Arab (1-3999)",
    "arabicPlaceholder": "Masukkan angka Arab..."
  },
  "he": {
    "arabicNumber": "מספר ערבי (1-3999)",
    "arabicPlaceholder": "הכנס מספר ערבי..."
  },
  "ms": {
    "arabicNumber": "Nombor Arab (1-3999)",
    "arabicPlaceholder": "Masukkan nombor Arab..."
  },
  "no": {
    "arabicNumber": "Arabisk Tall (1-3999)",
    "arabicPlaceholder": "Skriv inn arabisk tall..."
  }
}
</i18n>
