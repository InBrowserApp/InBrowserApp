<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('inputsTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi
        :label="t('schemaLabel')"
        :show-feedback="Boolean(schemaError)"
        :validation-status="schemaStatus"
      >
        <TextOrFileInput
          class="monospace-input"
          :value="schemaValue"
          :accept="accept"
          :placeholder="t('schemaPlaceholder')"
          :status="schemaStatus"
          :wrap-with-form-item="false"
          @update:value="$emit('update:schemaValue', $event)"
        />
        <template v-if="schemaError" #feedback>
          <n-text type="error">{{ t('invalidJson') }}: {{ schemaError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi
        :label="t('dataLabel')"
        :show-feedback="Boolean(dataError)"
        :validation-status="dataStatus"
      >
        <TextOrFileInput
          class="monospace-input"
          :value="dataValue"
          :accept="accept"
          :placeholder="t('dataPlaceholder')"
          :status="dataStatus"
          :wrap-with-form-item="false"
          @update:value="$emit('update:dataValue', $event)"
        />
        <template v-if="dataError" #feedback>
          <n-text type="error">{{ t('invalidJson') }}: {{ dataError }}</n-text>
        </template>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFormItemGi, NGrid, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { TextOrFileInput } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

defineProps<{
  schemaStatus?: 'success' | 'error'
  dataStatus?: 'success' | 'error'
  schemaError?: string
  dataError?: string
  schemaValue: string | File
  dataValue: string | File
}>()

defineEmits<{
  'update:schemaValue': [value: string | File]
  'update:dataValue': [value: string | File]
}>()

const { t } = useI18n()

const accept = '.json,.txt'
</script>

<style scoped>
.monospace-input :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "inputsTitle": "Schema & Data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON Data",
    "schemaPlaceholder": "Paste JSON Schema here...",
    "dataPlaceholder": "Paste JSON data here...",
    "invalidJson": "Invalid JSON"
  },
  "zh": {
    "inputsTitle": "Schema 与数据",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON 数据",
    "schemaPlaceholder": "在此粘贴 JSON Schema...",
    "dataPlaceholder": "在此粘贴 JSON 数据...",
    "invalidJson": "无效的 JSON"
  },
  "zh-CN": {
    "inputsTitle": "Schema 与数据",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON 数据",
    "schemaPlaceholder": "在此粘贴 JSON Schema...",
    "dataPlaceholder": "在此粘贴 JSON 数据...",
    "invalidJson": "无效的 JSON"
  },
  "zh-TW": {
    "inputsTitle": "Schema 與資料",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON 資料",
    "schemaPlaceholder": "在此貼上 JSON Schema...",
    "dataPlaceholder": "在此貼上 JSON 資料...",
    "invalidJson": "無效的 JSON"
  },
  "zh-HK": {
    "inputsTitle": "Schema 與資料",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON 資料",
    "schemaPlaceholder": "在此貼上 JSON Schema...",
    "dataPlaceholder": "在此貼上 JSON 資料...",
    "invalidJson": "無效的 JSON"
  },
  "es": {
    "inputsTitle": "Esquema y datos",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Datos JSON",
    "schemaPlaceholder": "Pegue el JSON Schema aquí...",
    "dataPlaceholder": "Pegue los datos JSON aquí...",
    "invalidJson": "JSON no válido"
  },
  "fr": {
    "inputsTitle": "Schéma et données",
    "schemaLabel": "Schéma JSON",
    "dataLabel": "Données JSON",
    "schemaPlaceholder": "Collez le schéma JSON ici...",
    "dataPlaceholder": "Collez les données JSON ici...",
    "invalidJson": "JSON invalide"
  },
  "de": {
    "inputsTitle": "Schema und Daten",
    "schemaLabel": "JSON-Schema",
    "dataLabel": "JSON-Daten",
    "schemaPlaceholder": "JSON-Schema hier einfügen...",
    "dataPlaceholder": "JSON-Daten hier einfügen...",
    "invalidJson": "Ungültiges JSON"
  },
  "it": {
    "inputsTitle": "Schema e dati",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Dati JSON",
    "schemaPlaceholder": "Incolla il JSON Schema qui...",
    "dataPlaceholder": "Incolla i dati JSON qui...",
    "invalidJson": "JSON non valido"
  },
  "ja": {
    "inputsTitle": "Schema とデータ",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON データ",
    "schemaPlaceholder": "ここに JSON Schema を貼り付け...",
    "dataPlaceholder": "ここに JSON データを貼り付け...",
    "invalidJson": "無効な JSON"
  },
  "ko": {
    "inputsTitle": "스키마와 데이터",
    "schemaLabel": "JSON 스키마",
    "dataLabel": "JSON 데이터",
    "schemaPlaceholder": "여기에 JSON 스키마를 붙여넣으세요...",
    "dataPlaceholder": "여기에 JSON 데이터를 붙여넣으세요...",
    "invalidJson": "유효하지 않은 JSON"
  },
  "ru": {
    "inputsTitle": "Схема и данные",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON данные",
    "schemaPlaceholder": "Вставьте JSON Schema сюда...",
    "dataPlaceholder": "Вставьте JSON данные сюда...",
    "invalidJson": "Недопустимый JSON"
  },
  "pt": {
    "inputsTitle": "Esquema e dados",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Dados JSON",
    "schemaPlaceholder": "Cole o JSON Schema aqui...",
    "dataPlaceholder": "Cole os dados JSON aqui...",
    "invalidJson": "JSON inválido"
  },
  "ar": {
    "inputsTitle": "المخطط والبيانات",
    "schemaLabel": "JSON Schema",
    "dataLabel": "بيانات JSON",
    "schemaPlaceholder": "ألصق JSON Schema هنا...",
    "dataPlaceholder": "ألصق بيانات JSON هنا...",
    "invalidJson": "JSON غير صالح"
  },
  "hi": {
    "inputsTitle": "स्कीमा और डेटा",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON डेटा",
    "schemaPlaceholder": "यहाँ JSON Schema पेस्ट करें...",
    "dataPlaceholder": "यहाँ JSON डेटा पेस्ट करें...",
    "invalidJson": "अमान्य JSON"
  },
  "tr": {
    "inputsTitle": "Şema ve veriler",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON verisi",
    "schemaPlaceholder": "JSON Schema'yı buraya yapıştırın...",
    "dataPlaceholder": "JSON verisini buraya yapıştırın...",
    "invalidJson": "Geçersiz JSON"
  },
  "nl": {
    "inputsTitle": "Schema en gegevens",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON-gegevens",
    "schemaPlaceholder": "Plak JSON Schema hier...",
    "dataPlaceholder": "Plak JSON-gegevens hier...",
    "invalidJson": "Ongeldige JSON"
  },
  "sv": {
    "inputsTitle": "Schema och data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON-data",
    "schemaPlaceholder": "Klistra in JSON Schema här...",
    "dataPlaceholder": "Klistra in JSON-data här...",
    "invalidJson": "Ogiltig JSON"
  },
  "pl": {
    "inputsTitle": "Schemat i dane",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Dane JSON",
    "schemaPlaceholder": "Wklej JSON Schema tutaj...",
    "dataPlaceholder": "Wklej dane JSON tutaj...",
    "invalidJson": "Nieprawidłowy JSON"
  },
  "vi": {
    "inputsTitle": "Schema và dữ liệu",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Dữ liệu JSON",
    "schemaPlaceholder": "Dán JSON Schema vào đây...",
    "dataPlaceholder": "Dán dữ liệu JSON vào đây...",
    "invalidJson": "JSON không hợp lệ"
  },
  "th": {
    "inputsTitle": "สคีมาและข้อมูล",
    "schemaLabel": "JSON Schema",
    "dataLabel": "ข้อมูล JSON",
    "schemaPlaceholder": "วาง JSON Schema ที่นี่...",
    "dataPlaceholder": "วางข้อมูล JSON ที่นี่...",
    "invalidJson": "JSON ไม่ถูกต้อง"
  },
  "id": {
    "inputsTitle": "Skema dan data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Data JSON",
    "schemaPlaceholder": "Tempel JSON Schema di sini...",
    "dataPlaceholder": "Tempel data JSON di sini...",
    "invalidJson": "JSON tidak valid"
  },
  "he": {
    "inputsTitle": "סכימה ונתונים",
    "schemaLabel": "JSON Schema",
    "dataLabel": "נתוני JSON",
    "schemaPlaceholder": "הדביקו JSON Schema כאן...",
    "dataPlaceholder": "הדביקו נתוני JSON כאן...",
    "invalidJson": "JSON לא תקין"
  },
  "ms": {
    "inputsTitle": "Skema dan data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Data JSON",
    "schemaPlaceholder": "Tampal JSON Schema di sini...",
    "dataPlaceholder": "Tampal data JSON di sini...",
    "invalidJson": "JSON tidak sah"
  },
  "no": {
    "inputsTitle": "Skjema og data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON-data",
    "schemaPlaceholder": "Lim inn JSON Schema her...",
    "dataPlaceholder": "Lim inn JSON-data her...",
    "invalidJson": "Ugyldig JSON"
  }
}
</i18n>
