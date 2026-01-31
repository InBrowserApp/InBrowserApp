<template>
  <ToolSection v-if="!isJweMode">
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <n-grid :cols="3" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('mode')">
        <n-radio-group v-model:value="mode" name="mode">
          <n-space vertical :size="4">
            <n-radio value="GCM">GCM</n-radio>
            <n-radio value="CBC">CBC</n-radio>
            <n-radio value="CTR">CTR</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi :label="t('keyLength')">
        <n-radio-group v-model:value="keyLength" name="key-length">
          <n-space vertical :size="4">
            <n-radio :value="128">128-bit</n-radio>
            <n-radio :value="192">192-bit</n-radio>
            <n-radio :value="256">256-bit</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi :label="t('inputFormat')">
        <n-radio-group v-model:value="inputFormat" name="input-format">
          <n-space vertical :size="4">
            <n-radio value="base64">Base64</n-radio>
            <n-radio value="hex">Hex</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NGrid, NFormItemGi, NRadioGroup, NRadio, NSpace } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { AesMode, KeyLength, OutputFormat } from '@utils/aes'

defineProps<{
  isJweMode: boolean
}>()

const mode = defineModel<AesMode>('mode', { required: true })
const keyLength = defineModel<KeyLength>('keyLength', { required: true })
const inputFormat = defineModel<OutputFormat>('inputFormat', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "mode": "Mode",
    "keyLength": "Key Length",
    "inputFormat": "Format"
  },
  "zh": {
    "options": "选项",
    "mode": "模式",
    "keyLength": "密钥长度",
    "inputFormat": "格式"
  },
  "zh-CN": {
    "options": "选项",
    "mode": "模式",
    "keyLength": "密钥长度",
    "inputFormat": "格式"
  },
  "zh-TW": {
    "options": "選項",
    "mode": "模式",
    "keyLength": "密鑰長度",
    "inputFormat": "格式"
  },
  "zh-HK": {
    "options": "選項",
    "mode": "模式",
    "keyLength": "密鑰長度",
    "inputFormat": "格式"
  },
  "es": {
    "options": "Opciones",
    "mode": "Modo",
    "keyLength": "Longitud de la clave",
    "inputFormat": "Formato"
  },
  "fr": {
    "options": "Options",
    "mode": "Mode",
    "keyLength": "Longueur de la clé",
    "inputFormat": "Format"
  },
  "de": {
    "options": "Optionen",
    "mode": "Modus",
    "keyLength": "Schlüssellänge",
    "inputFormat": "Format"
  },
  "it": {
    "options": "Opzioni",
    "mode": "Modalità",
    "keyLength": "Lunghezza chiave",
    "inputFormat": "Formato"
  },
  "ja": {
    "options": "オプション",
    "mode": "モード",
    "keyLength": "キー長",
    "inputFormat": "フォーマット"
  },
  "ko": {
    "options": "옵션",
    "mode": "모드",
    "keyLength": "키 길이",
    "inputFormat": "형식"
  },
  "ru": {
    "options": "Опции",
    "mode": "Режим",
    "keyLength": "Длина ключа",
    "inputFormat": "Формат"
  },
  "pt": {
    "options": "Opções",
    "mode": "Modo",
    "keyLength": "Comprimento da chave",
    "inputFormat": "Formato"
  },
  "ar": {
    "options": "خيارات",
    "mode": "الوضع",
    "keyLength": "طول المفتاح",
    "inputFormat": "التنسيق"
  },
  "hi": {
    "options": "विकल्प",
    "mode": "मोड",
    "keyLength": "कुंजी की लंबाई",
    "inputFormat": "प्रारूप"
  },
  "tr": {
    "options": "Seçenekler",
    "mode": "Mod",
    "keyLength": "Anahtar uzunluğu",
    "inputFormat": "Biçim"
  },
  "nl": {
    "options": "Opties",
    "mode": "Modus",
    "keyLength": "Sleutellengte",
    "inputFormat": "Formaat"
  },
  "sv": {
    "options": "Alternativ",
    "mode": "Läge",
    "keyLength": "Nyckellängd",
    "inputFormat": "Format"
  },
  "pl": {
    "options": "Opcje",
    "mode": "Tryb",
    "keyLength": "Długość klucza",
    "inputFormat": "Format"
  },
  "vi": {
    "options": "Tùy chọn",
    "mode": "Chế độ",
    "keyLength": "Độ dài khóa",
    "inputFormat": "Định dạng"
  },
  "th": {
    "options": "ตัวเลือก",
    "mode": "โหมด",
    "keyLength": "ความยาวคีย์",
    "inputFormat": "รูปแบบ"
  },
  "id": {
    "options": "Opsi",
    "mode": "Mode",
    "keyLength": "Panjang kunci",
    "inputFormat": "Format"
  },
  "he": {
    "options": "אפשרויות",
    "mode": "מצב",
    "keyLength": "אורך מפתח",
    "inputFormat": "פורמט"
  },
  "ms": {
    "options": "Pilihan",
    "mode": "Mod",
    "keyLength": "Panjang kunci",
    "inputFormat": "Format"
  },
  "no": {
    "options": "Alternativer",
    "mode": "Modus",
    "keyLength": "Nøkkellengde",
    "inputFormat": "Format"
  }
}
</i18n>
