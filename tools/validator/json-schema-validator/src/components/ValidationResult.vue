<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('resultTitle') }}</ToolSectionHeader>
    <n-spin :show="loading">
      <n-alert v-if="schemaError" type="error" :bordered="false">
        {{ schemaError }}
      </n-alert>
      <n-alert v-else-if="statusType === 'info'" type="info" :bordered="false">
        {{ t('emptyMessage') }}
      </n-alert>

      <ValidationSummary
        :state="state"
        :valid="valid"
        :status-type="statusType"
        :draft-value="draftValue"
        :draft-detected="draftDetected"
        :errors-count="errorsCount"
        :errors-json="errorsJson"
      />

      <ValidationErrorsTable :errors="errors" :status-type="statusType" />
    </n-spin>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert, NSpin } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import type { JsonSchemaValidationError } from '@utils/json-schema'
import ValidationErrorsTable from './ValidationErrorsTable.vue'
import ValidationSummary from './ValidationSummary.vue'

const props = defineProps<{
  state: 'empty' | 'schema-error' | 'validated'
  valid: boolean
  draftValue: string
  draftDetected: boolean
  errors: JsonSchemaValidationError[]
  errorsJson: string
  schemaError: string
  loading: boolean
}>()

const { t } = useI18n()

const statusType = computed<'success' | 'error' | 'info'>(() => {
  if (props.state === 'validated') {
    return props.valid ? 'success' : 'error'
  }
  if (props.state === 'schema-error') {
    return 'error'
  }
  return 'info'
})

const errorsCount = computed(() => props.errors.length)
</script>

<i18n lang="json">
{
  "en": {
    "resultTitle": "Validation Result",
    "emptyMessage": "Provide a valid JSON Schema and JSON data to see results"
  },
  "zh": {
    "resultTitle": "校验结果",
    "emptyMessage": "请输入有效的 JSON Schema 和 JSON 数据以查看结果"
  },
  "zh-CN": {
    "resultTitle": "校验结果",
    "emptyMessage": "请输入有效的 JSON Schema 和 JSON 数据以查看结果"
  },
  "zh-TW": {
    "resultTitle": "驗證結果",
    "emptyMessage": "請輸入有效的 JSON Schema 與 JSON 資料以查看結果"
  },
  "zh-HK": {
    "resultTitle": "驗證結果",
    "emptyMessage": "請輸入有效的 JSON Schema 與 JSON 資料以查看結果"
  },
  "es": {
    "resultTitle": "Resultado de validación",
    "emptyMessage": "Proporcione un JSON Schema y datos JSON válidos para ver resultados"
  },
  "fr": {
    "resultTitle": "Résultat de validation",
    "emptyMessage": "Fournissez un schéma JSON et des données JSON valides pour voir les résultats"
  },
  "de": {
    "resultTitle": "Validierungsergebnis",
    "emptyMessage": "Geben Sie ein gültiges JSON-Schema und JSON-Daten ein, um Ergebnisse zu sehen"
  },
  "it": {
    "resultTitle": "Risultato di validazione",
    "emptyMessage": "Fornisci un JSON Schema e dati JSON validi per vedere i risultati"
  },
  "ja": {
    "resultTitle": "検証結果",
    "emptyMessage": "有効な JSON Schema と JSON データを入力して結果を確認してください"
  },
  "ko": {
    "resultTitle": "검증 결과",
    "emptyMessage": "유효한 JSON 스키마와 JSON 데이터를 입력하면 결과가 표시됩니다"
  },
  "ru": {
    "resultTitle": "Результат проверки",
    "emptyMessage": "Введите корректный JSON Schema и JSON данные для просмотра результатов"
  },
  "pt": {
    "resultTitle": "Resultado da validação",
    "emptyMessage": "Forneça um JSON Schema e dados JSON válidos para ver os resultados"
  },
  "ar": {
    "resultTitle": "نتيجة التحقق",
    "emptyMessage": "قدّم JSON Schema وبيانات JSON صالحة لرؤية النتائج"
  },
  "hi": {
    "resultTitle": "सत्यापन परिणाम",
    "emptyMessage": "परिणाम देखने के लिए मान्य JSON Schema और JSON डेटा दें"
  },
  "tr": {
    "resultTitle": "Doğrulama sonucu",
    "emptyMessage": "Sonuçları görmek için geçerli JSON Schema ve JSON verisi sağlayın"
  },
  "nl": {
    "resultTitle": "Validatieresultaat",
    "emptyMessage": "Geef een geldig JSON Schema en JSON-gegevens om resultaten te zien"
  },
  "sv": {
    "resultTitle": "Valideringsresultat",
    "emptyMessage": "Ange giltigt JSON Schema och JSON-data för att se resultat"
  },
  "pl": {
    "resultTitle": "Wynik walidacji",
    "emptyMessage": "Podaj poprawny JSON Schema i dane JSON, aby zobaczyć wyniki"
  },
  "vi": {
    "resultTitle": "Kết quả xác thực",
    "emptyMessage": "Hãy cung cấp JSON Schema và dữ liệu JSON hợp lệ để xem kết quả"
  },
  "th": {
    "resultTitle": "ผลการตรวจสอบ",
    "emptyMessage": "โปรดระบุ JSON Schema และข้อมูล JSON ที่ถูกต้องเพื่อดูผลลัพธ์"
  },
  "id": {
    "resultTitle": "Hasil validasi",
    "emptyMessage": "Berikan JSON Schema dan data JSON yang valid untuk melihat hasil"
  },
  "he": {
    "resultTitle": "תוצאת אימות",
    "emptyMessage": "ספקו JSON Schema ונתוני JSON תקינים כדי לראות תוצאות"
  },
  "ms": {
    "resultTitle": "Keputusan pengesahan",
    "emptyMessage": "Sediakan JSON Schema dan data JSON yang sah untuk melihat hasil"
  },
  "no": {
    "resultTitle": "Valideringsresultat",
    "emptyMessage": "Oppgi et gyldig JSON Schema og JSON-data for å se resultater"
  }
}
</i18n>
