<template>
  <ToolSection>
    <n-form-item :label="t('outputTypeLabel')" class="wide-form-item">
      <n-radio-group v-model:value="outputType">
        <n-radio-button value="public">{{ t('outputTypePublic') }}</n-radio-button>
        <n-radio-button value="private">{{ t('outputTypePrivate') }}</n-radio-button>
      </n-radio-group>
    </n-form-item>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFormItem, NRadioButton, NRadioGroup } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import type { PemOutputType } from '../utils/jwkPem'

const { t } = useI18n()

const outputType = defineModel<PemOutputType>()
</script>

<style scoped>
.wide-form-item :deep(.n-form-item-blank) {
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "outputTypeLabel": "PEM Output Type",
    "outputTypePublic": "Public Key (SPKI)",
    "outputTypePrivate": "Private Key (PKCS8)"
  },
  "zh": {
    "outputTypeLabel": "PEM 输出类型",
    "outputTypePublic": "公钥 (SPKI)",
    "outputTypePrivate": "私钥 (PKCS8)"
  },
  "zh-CN": {
    "outputTypeLabel": "PEM 输出类型",
    "outputTypePublic": "公钥 (SPKI)",
    "outputTypePrivate": "私钥 (PKCS8)"
  },
  "zh-TW": {
    "outputTypeLabel": "PEM 輸出類型",
    "outputTypePublic": "公鑰 (SPKI)",
    "outputTypePrivate": "私鑰 (PKCS8)"
  },
  "zh-HK": {
    "outputTypeLabel": "PEM 輸出類型",
    "outputTypePublic": "公鑰 (SPKI)",
    "outputTypePrivate": "私鑰 (PKCS8)"
  },
  "es": {
    "outputTypeLabel": "Tipo de salida PEM",
    "outputTypePublic": "Clave pública (SPKI)",
    "outputTypePrivate": "Clave privada (PKCS8)"
  },
  "fr": {
    "outputTypeLabel": "Type de sortie PEM",
    "outputTypePublic": "Clé publique (SPKI)",
    "outputTypePrivate": "Clé privée (PKCS8)"
  },
  "de": {
    "outputTypeLabel": "PEM-Ausgabetyp",
    "outputTypePublic": "Öffentlicher Schlüssel (SPKI)",
    "outputTypePrivate": "Privater Schlüssel (PKCS8)"
  },
  "it": {
    "outputTypeLabel": "Tipo di output PEM",
    "outputTypePublic": "Chiave pubblica (SPKI)",
    "outputTypePrivate": "Chiave privata (PKCS8)"
  },
  "ja": {
    "outputTypeLabel": "PEM 出力タイプ",
    "outputTypePublic": "公開鍵 (SPKI)",
    "outputTypePrivate": "秘密鍵 (PKCS8)"
  },
  "ko": {
    "outputTypeLabel": "PEM 출력 유형",
    "outputTypePublic": "공개 키 (SPKI)",
    "outputTypePrivate": "개인 키 (PKCS8)"
  },
  "ru": {
    "outputTypeLabel": "Тип вывода PEM",
    "outputTypePublic": "Публичный ключ (SPKI)",
    "outputTypePrivate": "Приватный ключ (PKCS8)"
  },
  "pt": {
    "outputTypeLabel": "Tipo de saída PEM",
    "outputTypePublic": "Chave pública (SPKI)",
    "outputTypePrivate": "Chave privada (PKCS8)"
  },
  "ar": {
    "outputTypeLabel": "نوع إخراج PEM",
    "outputTypePublic": "مفتاح عام (SPKI)",
    "outputTypePrivate": "مفتاح خاص (PKCS8)"
  },
  "hi": {
    "outputTypeLabel": "PEM आउटपुट प्रकार",
    "outputTypePublic": "पब्लिक की (SPKI)",
    "outputTypePrivate": "प्राइवेट की (PKCS8)"
  },
  "tr": {
    "outputTypeLabel": "PEM Çıktı Türü",
    "outputTypePublic": "Açık Anahtar (SPKI)",
    "outputTypePrivate": "Özel Anahtar (PKCS8)"
  },
  "nl": {
    "outputTypeLabel": "PEM-uitvoertype",
    "outputTypePublic": "Publieke sleutel (SPKI)",
    "outputTypePrivate": "Privésleutel (PKCS8)"
  },
  "sv": {
    "outputTypeLabel": "PEM-utdatatyp",
    "outputTypePublic": "Publik nyckel (SPKI)",
    "outputTypePrivate": "Privat nyckel (PKCS8)"
  },
  "pl": {
    "outputTypeLabel": "Typ wyjścia PEM",
    "outputTypePublic": "Klucz publiczny (SPKI)",
    "outputTypePrivate": "Klucz prywatny (PKCS8)"
  },
  "vi": {
    "outputTypeLabel": "Loại đầu ra PEM",
    "outputTypePublic": "Khóa công khai (SPKI)",
    "outputTypePrivate": "Khóa riêng (PKCS8)"
  },
  "th": {
    "outputTypeLabel": "ชนิดเอาต์พุต PEM",
    "outputTypePublic": "กุญแจสาธารณะ (SPKI)",
    "outputTypePrivate": "กุญแจส่วนตัว (PKCS8)"
  },
  "id": {
    "outputTypeLabel": "Tipe output PEM",
    "outputTypePublic": "Kunci publik (SPKI)",
    "outputTypePrivate": "Kunci privat (PKCS8)"
  },
  "he": {
    "outputTypeLabel": "סוג פלט PEM",
    "outputTypePublic": "מפתח ציבורי (SPKI)",
    "outputTypePrivate": "מפתח פרטי (PKCS8)"
  },
  "ms": {
    "outputTypeLabel": "Jenis output PEM",
    "outputTypePublic": "Kunci awam (SPKI)",
    "outputTypePrivate": "Kunci peribadi (PKCS8)"
  },
  "no": {
    "outputTypeLabel": "PEM-utdatatyp",
    "outputTypePublic": "Offentlig nøkkel (SPKI)",
    "outputTypePrivate": "Privat nøkkel (PKCS8)"
  }
}
</i18n>
