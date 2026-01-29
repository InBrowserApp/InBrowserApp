<template>
  <ToolSection v-if="keys.length > 1">
    <n-form-item :label="t('keySelectLabel')" class="wide-form-item">
      <n-select v-model:value="selectedIndex" :options="options" />
    </n-form-item>
    <n-text depth="3" class="input-hint">{{ t('keySelectHint') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NSelect, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'

const { t } = useI18n()

type JwkWithKid = JsonWebKey & { kid?: string }

const props = defineProps<{
  keys: JsonWebKey[]
  modelValue: number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const selectedIndex = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value),
})

const options = computed(() =>
  props.keys.map((key, index) => ({
    label: formatKeyLabel(key as JwkWithKid, index),
    value: index,
  })),
)

function formatKeyLabel(key: JwkWithKid, index: number): string {
  const type = key.kty ? key.kty : t('unknownKey')
  const detail = key.crv ? ` ${key.crv}` : ''
  const kid = key.kid ? ` (${key.kid})` : ` #${index + 1}`
  return `${type}${detail}${kid}`
}
</script>

<style scoped>
.input-hint {
  display: block;
  margin-top: 8px;
}

.wide-form-item :deep(.n-form-item-blank) {
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "keySelectLabel": "Select Key",
    "keySelectHint": "Multiple keys detected. Choose which one to convert.",
    "unknownKey": "Key"
  },
  "zh": {
    "keySelectLabel": "选择密钥",
    "keySelectHint": "检测到多个密钥，请选择需要转换的条目。",
    "unknownKey": "密钥"
  },
  "zh-CN": {
    "keySelectLabel": "选择密钥",
    "keySelectHint": "检测到多个密钥，请选择需要转换的条目。",
    "unknownKey": "密钥"
  },
  "zh-TW": {
    "keySelectLabel": "選擇金鑰",
    "keySelectHint": "偵測到多個金鑰，請選擇要轉換的項目。",
    "unknownKey": "金鑰"
  },
  "zh-HK": {
    "keySelectLabel": "選擇金鑰",
    "keySelectHint": "偵測到多個金鑰，請選擇要轉換的項目。",
    "unknownKey": "金鑰"
  },
  "es": {
    "keySelectLabel": "Seleccionar clave",
    "keySelectHint": "Se detectaron varias claves. Elige cuál convertir.",
    "unknownKey": "Clave"
  },
  "fr": {
    "keySelectLabel": "Sélectionner la clé",
    "keySelectHint": "Plusieurs clés détectées. Choisissez celle à convertir.",
    "unknownKey": "Clé"
  },
  "de": {
    "keySelectLabel": "Schlüssel auswählen",
    "keySelectHint": "Mehrere Schlüssel erkannt. Wähle den zu konvertierenden aus.",
    "unknownKey": "Schlüssel"
  },
  "it": {
    "keySelectLabel": "Seleziona chiave",
    "keySelectHint": "Sono state rilevate più chiavi. Scegli quale convertire.",
    "unknownKey": "Chiave"
  },
  "ja": {
    "keySelectLabel": "キーを選択",
    "keySelectHint": "複数のキーを検出しました。変換するものを選択してください。",
    "unknownKey": "キー"
  },
  "ko": {
    "keySelectLabel": "키 선택",
    "keySelectHint": "여러 키가 감지되었습니다. 변환할 키를 선택하세요.",
    "unknownKey": "키"
  },
  "ru": {
    "keySelectLabel": "Выбор ключа",
    "keySelectHint": "Найдено несколько ключей. Выберите нужный.",
    "unknownKey": "Ключ"
  },
  "pt": {
    "keySelectLabel": "Selecionar chave",
    "keySelectHint": "Várias chaves detectadas. Escolha qual converter.",
    "unknownKey": "Chave"
  },
  "ar": {
    "keySelectLabel": "اختر المفتاح",
    "keySelectHint": "تم اكتشاف عدة مفاتيح. اختر ما تريد تحويله.",
    "unknownKey": "مفتاح"
  },
  "hi": {
    "keySelectLabel": "की चुनें",
    "keySelectHint": "कई कुंजियां मिलीं। जिसे कन्वर्ट करना है उसे चुनें।",
    "unknownKey": "कुंजी"
  },
  "tr": {
    "keySelectLabel": "Anahtar seç",
    "keySelectHint": "Birden fazla anahtar algılandı. Dönüştürülecek olanı seçin.",
    "unknownKey": "Anahtar"
  },
  "nl": {
    "keySelectLabel": "Selecteer sleutel",
    "keySelectHint": "Meerdere sleutels gedetecteerd. Kies welke je wilt converteren.",
    "unknownKey": "Sleutel"
  },
  "sv": {
    "keySelectLabel": "Välj nyckel",
    "keySelectHint": "Flera nycklar hittades. Välj vilken som ska konverteras.",
    "unknownKey": "Nyckel"
  },
  "pl": {
    "keySelectLabel": "Wybierz klucz",
    "keySelectHint": "Wykryto wiele kluczy. Wybierz ten do konwersji.",
    "unknownKey": "Klucz"
  },
  "vi": {
    "keySelectLabel": "Chọn khóa",
    "keySelectHint": "Phát hiện nhiều khóa. Chọn khóa cần chuyển đổi.",
    "unknownKey": "Khóa"
  },
  "th": {
    "keySelectLabel": "เลือกกุญแจ",
    "keySelectHint": "ตรวจพบหลายกุญแจ เลือกอันที่ต้องการแปลง.",
    "unknownKey": "กุญแจ"
  },
  "id": {
    "keySelectLabel": "Pilih kunci",
    "keySelectHint": "Beberapa kunci terdeteksi. Pilih yang akan dikonversi.",
    "unknownKey": "Kunci"
  },
  "he": {
    "keySelectLabel": "בחר מפתח",
    "keySelectHint": "זוהו מספר מפתחות. בחר את המפתח להמרה.",
    "unknownKey": "מפתח"
  },
  "ms": {
    "keySelectLabel": "Pilih kunci",
    "keySelectHint": "Beberapa kunci dikesan. Pilih yang hendak ditukar.",
    "unknownKey": "Kunci"
  },
  "no": {
    "keySelectLabel": "Velg nøkkel",
    "keySelectHint": "Flere nøkler oppdaget. Velg hvilken som skal konverteres.",
    "unknownKey": "Nøkkel"
  }
}
</i18n>
