<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('optionsTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="8">
      <n-form-item-gi :label="t('optionDraft')" :show-feedback="false">
        <n-select v-model:value="draft" :options="draftOptions" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionInferRequired')" :show-feedback="false">
        <n-switch v-model:value="inferRequired" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionAllowAdditionalProperties')" :show-feedback="false">
        <n-switch v-model:value="allowAdditionalProperties" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionDetectFormat')" :show-feedback="false">
        <n-switch v-model:value="detectFormat" />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFormItemGi, NGrid, NSelect, NSwitch } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import type { JsonSchemaDraft } from '@utils/json-schema'

const { draftOptions } = defineProps<{
  draftOptions: { label: string; value: JsonSchemaDraft }[]
}>()

const draft = defineModel<JsonSchemaDraft>('draft', { required: true })
const inferRequired = defineModel<boolean>('inferRequired', { required: true })
const allowAdditionalProperties = defineModel<boolean>('allowAdditionalProperties', {
  required: true,
})
const detectFormat = defineModel<boolean>('detectFormat', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "optionsTitle": "Options",
    "optionDraft": "Schema draft",
    "optionInferRequired": "Infer required properties",
    "optionAllowAdditionalProperties": "Allow additional properties",
    "optionDetectFormat": "Detect string formats (uuid, email, uri, date-time)"
  },
  "zh": {
    "optionsTitle": "选项",
    "optionDraft": "Schema 草案",
    "optionInferRequired": "推断必填属性",
    "optionAllowAdditionalProperties": "允许额外属性",
    "optionDetectFormat": "检测字符串格式 (uuid, email, uri, date-time)"
  },
  "zh-CN": {
    "optionsTitle": "选项",
    "optionDraft": "Schema 草案",
    "optionInferRequired": "推断必填属性",
    "optionAllowAdditionalProperties": "允许额外属性",
    "optionDetectFormat": "检测字符串格式 (uuid, email, uri, date-time)"
  },
  "zh-TW": {
    "optionsTitle": "選項",
    "optionDraft": "Schema 草案",
    "optionInferRequired": "推斷必填屬性",
    "optionAllowAdditionalProperties": "允許額外屬性",
    "optionDetectFormat": "偵測字串格式 (uuid, email, uri, date-time)"
  },
  "zh-HK": {
    "optionsTitle": "選項",
    "optionDraft": "Schema 草案",
    "optionInferRequired": "推斷必填屬性",
    "optionAllowAdditionalProperties": "允許額外屬性",
    "optionDetectFormat": "偵測字串格式 (uuid, email, uri, date-time)"
  },
  "es": {
    "optionsTitle": "Opciones",
    "optionDraft": "Borrador del esquema",
    "optionInferRequired": "Inferir propiedades obligatorias",
    "optionAllowAdditionalProperties": "Permitir propiedades adicionales",
    "optionDetectFormat": "Detectar formatos de cadena (uuid, email, uri, date-time)"
  },
  "fr": {
    "optionsTitle": "Options",
    "optionDraft": "Version du schéma",
    "optionInferRequired": "Déduire les propriétés requises",
    "optionAllowAdditionalProperties": "Autoriser les propriétés supplémentaires",
    "optionDetectFormat": "Détecter les formats de chaîne (uuid, email, uri, date-time)"
  },
  "de": {
    "optionsTitle": "Optionen",
    "optionDraft": "Schema-Entwurf",
    "optionInferRequired": "Pflichtfelder ableiten",
    "optionAllowAdditionalProperties": "Zusätzliche Eigenschaften erlauben",
    "optionDetectFormat": "String-Formate erkennen (uuid, email, uri, date-time)"
  },
  "it": {
    "optionsTitle": "Opzioni",
    "optionDraft": "Bozza dello schema",
    "optionInferRequired": "Dedurre proprietà obbligatorie",
    "optionAllowAdditionalProperties": "Consenti proprietà aggiuntive",
    "optionDetectFormat": "Rileva formati stringa (uuid, email, uri, date-time)"
  },
  "ja": {
    "optionsTitle": "オプション",
    "optionDraft": "スキーマ草案",
    "optionInferRequired": "必須プロパティを推定",
    "optionAllowAdditionalProperties": "追加プロパティを許可",
    "optionDetectFormat": "文字列フォーマットを検出 (uuid, email, uri, date-time)"
  },
  "ko": {
    "optionsTitle": "옵션",
    "optionDraft": "스키마 드래프트",
    "optionInferRequired": "필수 속성 추론",
    "optionAllowAdditionalProperties": "추가 속성 허용",
    "optionDetectFormat": "문자열 형식 감지 (uuid, email, uri, date-time)"
  },
  "ru": {
    "optionsTitle": "Параметры",
    "optionDraft": "Черновик схемы",
    "optionInferRequired": "Определять обязательные свойства",
    "optionAllowAdditionalProperties": "Разрешить дополнительные свойства",
    "optionDetectFormat": "Определять форматы строк (uuid, email, uri, date-time)"
  },
  "pt": {
    "optionsTitle": "Opções",
    "optionDraft": "Rascunho do esquema",
    "optionInferRequired": "Inferir propriedades obrigatórias",
    "optionAllowAdditionalProperties": "Permitir propriedades adicionais",
    "optionDetectFormat": "Detectar formatos de string (uuid, email, uri, date-time)"
  },
  "ar": {
    "optionsTitle": "الخيارات",
    "optionDraft": "مسودة المخطط",
    "optionInferRequired": "استنتاج الخصائص المطلوبة",
    "optionAllowAdditionalProperties": "السماح بخصائص إضافية",
    "optionDetectFormat": "اكتشاف تنسيقات السلاسل (uuid, email, uri, date-time)"
  },
  "hi": {
    "optionsTitle": "विकल्प",
    "optionDraft": "स्कीमा ड्राफ्ट",
    "optionInferRequired": "आवश्यक प्रॉपर्टी अनुमानित करें",
    "optionAllowAdditionalProperties": "अतिरिक्त प्रॉपर्टी अनुमति दें",
    "optionDetectFormat": "स्ट्रिंग फॉर्मेट पहचानें (uuid, email, uri, date-time)"
  },
  "tr": {
    "optionsTitle": "Seçenekler",
    "optionDraft": "Şema taslağı",
    "optionInferRequired": "Zorunlu özellikleri çıkar",
    "optionAllowAdditionalProperties": "Ek özelliklere izin ver",
    "optionDetectFormat": "Dize biçimlerini algıla (uuid, email, uri, date-time)"
  },
  "nl": {
    "optionsTitle": "Opties",
    "optionDraft": "Schema-concept",
    "optionInferRequired": "Verplichte eigenschappen afleiden",
    "optionAllowAdditionalProperties": "Extra eigenschappen toestaan",
    "optionDetectFormat": "Stringformaten detecteren (uuid, email, uri, date-time)"
  },
  "sv": {
    "optionsTitle": "Alternativ",
    "optionDraft": "Schemakast",
    "optionInferRequired": "Härled obligatoriska egenskaper",
    "optionAllowAdditionalProperties": "Tillåt extra egenskaper",
    "optionDetectFormat": "Upptäck strängformat (uuid, email, uri, date-time)"
  },
  "pl": {
    "optionsTitle": "Opcje",
    "optionDraft": "Wersja schematu",
    "optionInferRequired": "Wnioskuj wymagane właściwości",
    "optionAllowAdditionalProperties": "Zezwalaj na dodatkowe właściwości",
    "optionDetectFormat": "Wykrywaj formaty ciągów (uuid, email, uri, date-time)"
  },
  "vi": {
    "optionsTitle": "Tùy chọn",
    "optionDraft": "Bản nháp schema",
    "optionInferRequired": "Suy luận thuộc tính bắt buộc",
    "optionAllowAdditionalProperties": "Cho phép thuộc tính bổ sung",
    "optionDetectFormat": "Phát hiện định dạng chuỗi (uuid, email, uri, date-time)"
  },
  "th": {
    "optionsTitle": "ตัวเลือก",
    "optionDraft": "ร่างสคีมา",
    "optionInferRequired": "อนุมานพร็อพเพอร์ตีที่จำเป็น",
    "optionAllowAdditionalProperties": "อนุญาตพร็อพเพอร์ตีเพิ่มเติม",
    "optionDetectFormat": "ตรวจจับรูปแบบสตริง (uuid, email, uri, date-time)"
  },
  "id": {
    "optionsTitle": "Opsi",
    "optionDraft": "Draf skema",
    "optionInferRequired": "Inferensi properti wajib",
    "optionAllowAdditionalProperties": "Izinkan properti tambahan",
    "optionDetectFormat": "Deteksi format string (uuid, email, uri, date-time)"
  },
  "he": {
    "optionsTitle": "אפשרויות",
    "optionDraft": "טיוטת סכימה",
    "optionInferRequired": "הסקת מאפיינים נדרשים",
    "optionAllowAdditionalProperties": "אפשר מאפיינים נוספים",
    "optionDetectFormat": "זיהוי פורמטים של מחרוזות (uuid, email, uri, date-time)"
  },
  "ms": {
    "optionsTitle": "Pilihan",
    "optionDraft": "Draf skema",
    "optionInferRequired": "Buat inferens sifat wajib",
    "optionAllowAdditionalProperties": "Benarkan sifat tambahan",
    "optionDetectFormat": "Kesan format rentetan (uuid, email, uri, date-time)"
  },
  "no": {
    "optionsTitle": "Alternativer",
    "optionDraft": "Skjemautkast",
    "optionInferRequired": "Utrede obligatoriske egenskaper",
    "optionAllowAdditionalProperties": "Tillat ekstra egenskaper",
    "optionDetectFormat": "Oppdag strengformater (uuid, email, uri, date-time)"
  }
}
</i18n>
