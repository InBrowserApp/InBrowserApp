<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('inputTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi
        :label="t('inputLabel')"
        :show-feedback="Boolean(inputError)"
        :validation-status="inputStatus"
      >
        <TextOrFileInput
          class="monospace-input"
          :value="inputValue"
          :accept="accept"
          :placeholder="t('inputPlaceholder')"
          :status="inputStatus"
          :wrap-with-form-item="false"
          @update:value="$emit('update:inputValue', $event)"
        />
        <template v-if="inputError" #feedback>
          <n-text type="error">{{ t('invalidJson') }}: {{ inputError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :label="t('outputLabel')" :show-feedback="false">
        <n-card size="small">
          <n-alert v-if="outputError" type="error" :bordered="false">
            {{ t('invalidJson') }}: {{ outputError }}
          </n-alert>
          <n-code
            v-else-if="schemaText"
            :code="schemaText"
            language="json"
            :hljs="hljs"
            word-wrap
          />
          <n-text v-else depth="3">{{ t('outputEmpty') }}</n-text>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NCard, NCode, NFormItemGi, NGrid, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { TextOrFileInput } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'

defineProps<{
  inputValue: string | File
  inputStatus?: 'success' | 'error'
  inputError?: string
  schemaText: string
  outputError?: string
}>()

defineEmits<{
  'update:inputValue': [value: string | File]
}>()

hljs.registerLanguage('json', json)

const { t } = useI18n()

const accept = '.json,.txt'
</script>

<i18n lang="json">
{
  "en": {
    "inputTitle": "JSON Input",
    "inputLabel": "JSON Data",
    "inputPlaceholder": "Paste JSON data here...",
    "outputLabel": "Generated Schema",
    "outputEmpty": "Provide valid JSON data to generate a schema",
    "invalidJson": "Invalid JSON"
  },
  "zh": {
    "inputTitle": "JSON 输入",
    "inputLabel": "JSON 数据",
    "inputPlaceholder": "在此粘贴 JSON 数据...",
    "outputLabel": "生成的 Schema",
    "outputEmpty": "请输入有效的 JSON 数据以生成 Schema",
    "invalidJson": "无效的 JSON"
  },
  "zh-CN": {
    "inputTitle": "JSON 输入",
    "inputLabel": "JSON 数据",
    "inputPlaceholder": "在此粘贴 JSON 数据...",
    "outputLabel": "生成的 Schema",
    "outputEmpty": "请输入有效的 JSON 数据以生成 Schema",
    "invalidJson": "无效的 JSON"
  },
  "zh-TW": {
    "inputTitle": "JSON 輸入",
    "inputLabel": "JSON 資料",
    "inputPlaceholder": "在此貼上 JSON 資料...",
    "outputLabel": "生成的 Schema",
    "outputEmpty": "請輸入有效的 JSON 資料以產生 Schema",
    "invalidJson": "無效的 JSON"
  },
  "zh-HK": {
    "inputTitle": "JSON 輸入",
    "inputLabel": "JSON 資料",
    "inputPlaceholder": "在此貼上 JSON 資料...",
    "outputLabel": "生成的 Schema",
    "outputEmpty": "請輸入有效的 JSON 資料以產生 Schema",
    "invalidJson": "無效的 JSON"
  },
  "es": {
    "inputTitle": "Entrada JSON",
    "inputLabel": "Datos JSON",
    "inputPlaceholder": "Pegue los datos JSON aquí...",
    "outputLabel": "Esquema generado",
    "outputEmpty": "Proporcione datos JSON válidos para generar un esquema",
    "invalidJson": "JSON no válido"
  },
  "fr": {
    "inputTitle": "Entrée JSON",
    "inputLabel": "Données JSON",
    "inputPlaceholder": "Collez les données JSON ici...",
    "outputLabel": "Schéma généré",
    "outputEmpty": "Fournissez des données JSON valides pour générer un schéma",
    "invalidJson": "JSON invalide"
  },
  "de": {
    "inputTitle": "JSON-Eingabe",
    "inputLabel": "JSON-Daten",
    "inputPlaceholder": "JSON-Daten hier einfügen...",
    "outputLabel": "Generiertes Schema",
    "outputEmpty": "Geben Sie gültige JSON-Daten ein, um ein Schema zu erzeugen",
    "invalidJson": "Ungültiges JSON"
  },
  "it": {
    "inputTitle": "Input JSON",
    "inputLabel": "Dati JSON",
    "inputPlaceholder": "Incolla i dati JSON qui...",
    "outputLabel": "Schema generato",
    "outputEmpty": "Fornisci dati JSON validi per generare uno schema",
    "invalidJson": "JSON non valido"
  },
  "ja": {
    "inputTitle": "JSON 入力",
    "inputLabel": "JSON データ",
    "inputPlaceholder": "ここに JSON データを貼り付け...",
    "outputLabel": "生成されたスキーマ",
    "outputEmpty": "有効な JSON データを入力してスキーマを生成してください",
    "invalidJson": "無効な JSON"
  },
  "ko": {
    "inputTitle": "JSON 입력",
    "inputLabel": "JSON 데이터",
    "inputPlaceholder": "여기에 JSON 데이터를 붙여넣으세요...",
    "outputLabel": "생성된 스키마",
    "outputEmpty": "유효한 JSON 데이터를 입력하면 스키마가 생성됩니다",
    "invalidJson": "유효하지 않은 JSON"
  },
  "ru": {
    "inputTitle": "Ввод JSON",
    "inputLabel": "Данные JSON",
    "inputPlaceholder": "Вставьте данные JSON сюда...",
    "outputLabel": "Сгенерированная схема",
    "outputEmpty": "Введите корректные данные JSON, чтобы сгенерировать схему",
    "invalidJson": "Неверный JSON"
  },
  "pt": {
    "inputTitle": "Entrada JSON",
    "inputLabel": "Dados JSON",
    "inputPlaceholder": "Cole os dados JSON aqui...",
    "outputLabel": "Esquema gerado",
    "outputEmpty": "Forneça dados JSON válidos para gerar um esquema",
    "invalidJson": "JSON inválido"
  },
  "ar": {
    "inputTitle": "إدخال JSON",
    "inputLabel": "بيانات JSON",
    "inputPlaceholder": "الصق بيانات JSON هنا...",
    "outputLabel": "المخطط المُولّد",
    "outputEmpty": "أدخل بيانات JSON صالحة لتوليد مخطط",
    "invalidJson": "JSON غير صالح"
  },
  "hi": {
    "inputTitle": "JSON इनपुट",
    "inputLabel": "JSON डेटा",
    "inputPlaceholder": "यहाँ JSON डेटा पेस्ट करें...",
    "outputLabel": "जनरेट किया गया स्कीमा",
    "outputEmpty": "स्कीमा बनाने के लिए मान्य JSON डेटा प्रदान करें",
    "invalidJson": "अमान्य JSON"
  },
  "tr": {
    "inputTitle": "JSON Girdisi",
    "inputLabel": "JSON Verisi",
    "inputPlaceholder": "JSON verisini buraya yapıştırın...",
    "outputLabel": "Oluşturulan Şema",
    "outputEmpty": "Şema oluşturmak için geçerli JSON verisi sağlayın",
    "invalidJson": "Geçersiz JSON"
  },
  "nl": {
    "inputTitle": "JSON-invoer",
    "inputLabel": "JSON-gegevens",
    "inputPlaceholder": "Plak hier JSON-gegevens...",
    "outputLabel": "Gegenereerd schema",
    "outputEmpty": "Voer geldige JSON-gegevens in om een schema te genereren",
    "invalidJson": "Ongeldig JSON"
  },
  "sv": {
    "inputTitle": "JSON-inmatning",
    "inputLabel": "JSON-data",
    "inputPlaceholder": "Klistra in JSON-data här...",
    "outputLabel": "Genererat schema",
    "outputEmpty": "Ange giltig JSON-data för att generera ett schema",
    "invalidJson": "Ogiltig JSON"
  },
  "pl": {
    "inputTitle": "Wejście JSON",
    "inputLabel": "Dane JSON",
    "inputPlaceholder": "Wklej dane JSON tutaj...",
    "outputLabel": "Wygenerowany schemat",
    "outputEmpty": "Podaj poprawne dane JSON, aby wygenerować schemat",
    "invalidJson": "Nieprawidłowy JSON"
  },
  "vi": {
    "inputTitle": "Đầu vào JSON",
    "inputLabel": "Dữ liệu JSON",
    "inputPlaceholder": "Dán dữ liệu JSON ở đây...",
    "outputLabel": "Schema được tạo",
    "outputEmpty": "Cung cấp dữ liệu JSON hợp lệ để tạo schema",
    "invalidJson": "JSON không hợp lệ"
  },
  "th": {
    "inputTitle": "อินพุต JSON",
    "inputLabel": "ข้อมูล JSON",
    "inputPlaceholder": "วางข้อมูล JSON ที่นี่...",
    "outputLabel": "สคีมาที่สร้างแล้ว",
    "outputEmpty": "กรุณาใส่ข้อมูล JSON ที่ถูกต้องเพื่อสร้างสคีมา",
    "invalidJson": "JSON ไม่ถูกต้อง"
  },
  "id": {
    "inputTitle": "Input JSON",
    "inputLabel": "Data JSON",
    "inputPlaceholder": "Tempel data JSON di sini...",
    "outputLabel": "Skema yang dihasilkan",
    "outputEmpty": "Berikan data JSON yang valid untuk menghasilkan skema",
    "invalidJson": "JSON tidak valid"
  },
  "he": {
    "inputTitle": "קלט JSON",
    "inputLabel": "נתוני JSON",
    "inputPlaceholder": "הדבק נתוני JSON כאן...",
    "outputLabel": "סכימה שנוצרה",
    "outputEmpty": "ספק נתוני JSON תקינים כדי ליצור סכימה",
    "invalidJson": "JSON לא תקין"
  },
  "ms": {
    "inputTitle": "Input JSON",
    "inputLabel": "Data JSON",
    "inputPlaceholder": "Tampal data JSON di sini...",
    "outputLabel": "Skema yang dijana",
    "outputEmpty": "Sediakan data JSON yang sah untuk menjana skema",
    "invalidJson": "JSON tidak sah"
  },
  "no": {
    "inputTitle": "JSON-inndata",
    "inputLabel": "JSON-data",
    "inputPlaceholder": "Lim inn JSON-data her...",
    "outputLabel": "Generert skjema",
    "outputEmpty": "Oppgi gyldige JSON-data for å generere et skjema",
    "invalidJson": "Ugyldig JSON"
  }
}
</i18n>
