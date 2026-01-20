<template>
  <ToolSection>
    <n-flex align="center" justify="space-between" wrap>
      <n-flex align="center" wrap>
        <n-button text @click="loadSample">
          <template #icon>
            <n-icon :component="Wand16Regular" />
          </template>
          {{ t('actionsSample') }}
        </n-button>
      </n-flex>
      <n-flex align="center" wrap>
        <CopyToClipboardButton :content="schemaText" />
        <n-button
          tag="a"
          text
          :href="downloadUrl ?? undefined"
          download="schema.json"
          :disabled="!downloadUrl"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('actionsDownload') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

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
          :value="inputText"
          :accept="accept"
          :placeholder="t('inputPlaceholder')"
          :status="inputStatus"
          :wrap-with-form-item="false"
          @update:value="handleInput"
        />
        <template v-if="inputError" #feedback>
          <n-text type="error">{{ inputError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :label="t('outputLabel')" :show-feedback="false">
        <n-card size="small">
          <n-alert v-if="outputError" type="error" :bordered="false">
            {{ outputError }}
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
import { computed } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NSelect,
  NSwitch,
  NText,
} from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Wand16Regular from '@vicons/fluent/Wand16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, TextOrFileInput } from '@shared/ui/base'
import { generateJsonSchema, type JsonSchemaDraft } from '@utils/json-schema'

hljs.registerLanguage('json', json)

const { t } = useI18n()
const accept = '.json,.txt'

const sampleJson = `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "age": 36,
  "active": true,
  "website": "https://example.com",
  "tags": ["math", "poetry"],
  "address": {
    "street": "123 Main St",
    "city": "London",
    "postalCode": "SW1A 1AA"
  },
  "projects": [
    { "name": "Analytical Engine", "year": 1843 },
    { "name": "Notes", "year": 1842, "url": "https://example.com/notes" }
  ],
  "lastSeen": "2024-01-20T10:12:30Z",
  "metadata": null
}`

const inputText = useStorage('tools:json-schema-generator:input', sampleJson)
const draft = useStorage<JsonSchemaDraft>('tools:json-schema-generator:draft', '2020-12')
const inferRequired = useStorage('tools:json-schema-generator:infer-required', true)
const allowAdditionalProperties = useStorage(
  'tools:json-schema-generator:allow-additional-properties',
  true,
)
const detectFormat = useStorage('tools:json-schema-generator:detect-format', true)

const draftOptions = [
  { label: '2020-12', value: '2020-12' },
  { label: '2019-09', value: '2019-09' },
  { label: 'Draft-07', value: 'draft-07' },
]

const inputState = computed(() => parseJson(inputText.value))
const hasInput = computed(() => inputText.value.trim().length > 0)
const inputStatus = computed(() => {
  if (!hasInput.value) return undefined
  return inputState.value.error ? 'error' : 'success'
})
const inputError = computed(() =>
  inputState.value.error ? `${t('invalidJson')}: ${inputState.value.error}` : '',
)

const schemaText = computed(() => {
  if (!hasInput.value || inputState.value.error) {
    return ''
  }

  const schema = generateJsonSchema(inputState.value.value, {
    draft: draft.value,
    inferRequired: inferRequired.value,
    allowAdditionalProperties: allowAdditionalProperties.value,
    detectFormat: detectFormat.value,
  })

  return JSON.stringify(schema, null, 2)
})

const outputError = computed(() => (inputState.value.error ? inputError.value : ''))

const downloadBlob = computed(() => {
  if (!schemaText.value) return null
  return new Blob([schemaText.value], { type: 'application/json;charset=utf-8' })
})
const downloadUrl = useObjectUrl(downloadBlob)

function loadSample() {
  inputText.value = sampleJson
}

async function handleInput(value: string | File) {
  if (typeof value === 'string') {
    inputText.value = value
    return
  }
  try {
    inputText.value = await value.text()
  } catch {
    inputText.value = ''
  }
}

function parseJson(input: string): { value?: unknown; error?: string } {
  if (!input.trim()) return {}
  try {
    return { value: JSON.parse(input) }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { error: message }
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "actionsSample": "Use sample",
    "actionsDownload": "Download schema",
    "inputTitle": "JSON Input",
    "inputLabel": "JSON Data",
    "inputPlaceholder": "Paste JSON data here...",
    "outputLabel": "Generated Schema",
    "outputEmpty": "Provide valid JSON data to generate a schema",
    "optionsTitle": "Options",
    "optionDraft": "Schema draft",
    "optionInferRequired": "Infer required properties",
    "optionAllowAdditionalProperties": "Allow additional properties",
    "optionDetectFormat": "Detect string formats (uuid, email, uri, date-time)",
    "invalidJson": "Invalid JSON"
  },
  "zh": {
    "actionsSample": "使用示例",
    "actionsDownload": "下载 Schema",
    "inputTitle": "JSON 输入",
    "inputLabel": "JSON 数据",
    "inputPlaceholder": "在此粘贴 JSON 数据...",
    "outputLabel": "生成的 Schema",
    "outputEmpty": "请输入有效的 JSON 数据以生成 Schema",
    "optionsTitle": "选项",
    "optionDraft": "Schema 草案",
    "optionInferRequired": "推断必填属性",
    "optionAllowAdditionalProperties": "允许额外属性",
    "optionDetectFormat": "检测字符串格式 (uuid, email, uri, date-time)",
    "invalidJson": "无效的 JSON"
  },
  "zh-CN": {
    "actionsSample": "使用示例",
    "actionsDownload": "下载 Schema",
    "inputTitle": "JSON 输入",
    "inputLabel": "JSON 数据",
    "inputPlaceholder": "在此粘贴 JSON 数据...",
    "outputLabel": "生成的 Schema",
    "outputEmpty": "请输入有效的 JSON 数据以生成 Schema",
    "optionsTitle": "选项",
    "optionDraft": "Schema 草案",
    "optionInferRequired": "推断必填属性",
    "optionAllowAdditionalProperties": "允许额外属性",
    "optionDetectFormat": "检测字符串格式 (uuid, email, uri, date-time)",
    "invalidJson": "无效的 JSON"
  },
  "zh-TW": {
    "actionsSample": "使用範例",
    "actionsDownload": "下載 Schema",
    "inputTitle": "JSON 輸入",
    "inputLabel": "JSON 資料",
    "inputPlaceholder": "在此貼上 JSON 資料...",
    "outputLabel": "生成的 Schema",
    "outputEmpty": "請輸入有效的 JSON 資料以產生 Schema",
    "optionsTitle": "選項",
    "optionDraft": "Schema 草案",
    "optionInferRequired": "推斷必填屬性",
    "optionAllowAdditionalProperties": "允許額外屬性",
    "optionDetectFormat": "偵測字串格式 (uuid, email, uri, date-time)",
    "invalidJson": "無效的 JSON"
  },
  "zh-HK": {
    "actionsSample": "使用範例",
    "actionsDownload": "下載 Schema",
    "inputTitle": "JSON 輸入",
    "inputLabel": "JSON 資料",
    "inputPlaceholder": "在此貼上 JSON 資料...",
    "outputLabel": "生成的 Schema",
    "outputEmpty": "請輸入有效的 JSON 資料以產生 Schema",
    "optionsTitle": "選項",
    "optionDraft": "Schema 草案",
    "optionInferRequired": "推斷必填屬性",
    "optionAllowAdditionalProperties": "允許額外屬性",
    "optionDetectFormat": "偵測字串格式 (uuid, email, uri, date-time)",
    "invalidJson": "無效的 JSON"
  },
  "es": {
    "actionsSample": "Usar ejemplo",
    "actionsDownload": "Descargar esquema",
    "inputTitle": "Entrada JSON",
    "inputLabel": "Datos JSON",
    "inputPlaceholder": "Pegue los datos JSON aquí...",
    "outputLabel": "Esquema generado",
    "outputEmpty": "Proporcione datos JSON válidos para generar un esquema",
    "optionsTitle": "Opciones",
    "optionDraft": "Borrador del esquema",
    "optionInferRequired": "Inferir propiedades obligatorias",
    "optionAllowAdditionalProperties": "Permitir propiedades adicionales",
    "optionDetectFormat": "Detectar formatos de cadena (uuid, email, uri, date-time)",
    "invalidJson": "JSON no válido"
  },
  "fr": {
    "actionsSample": "Utiliser l'exemple",
    "actionsDownload": "Télécharger le schéma",
    "inputTitle": "Entrée JSON",
    "inputLabel": "Données JSON",
    "inputPlaceholder": "Collez les données JSON ici...",
    "outputLabel": "Schéma généré",
    "outputEmpty": "Fournissez des données JSON valides pour générer un schéma",
    "optionsTitle": "Options",
    "optionDraft": "Version du schéma",
    "optionInferRequired": "Déduire les propriétés requises",
    "optionAllowAdditionalProperties": "Autoriser les propriétés supplémentaires",
    "optionDetectFormat": "Détecter les formats de chaîne (uuid, email, uri, date-time)",
    "invalidJson": "JSON invalide"
  },
  "de": {
    "actionsSample": "Beispiel verwenden",
    "actionsDownload": "Schema herunterladen",
    "inputTitle": "JSON-Eingabe",
    "inputLabel": "JSON-Daten",
    "inputPlaceholder": "JSON-Daten hier einfügen...",
    "outputLabel": "Generiertes Schema",
    "outputEmpty": "Geben Sie gültige JSON-Daten ein, um ein Schema zu erzeugen",
    "optionsTitle": "Optionen",
    "optionDraft": "Schema-Entwurf",
    "optionInferRequired": "Pflichtfelder ableiten",
    "optionAllowAdditionalProperties": "Zusätzliche Eigenschaften erlauben",
    "optionDetectFormat": "String-Formate erkennen (uuid, email, uri, date-time)",
    "invalidJson": "Ungültiges JSON"
  },
  "it": {
    "actionsSample": "Usa esempio",
    "actionsDownload": "Scarica schema",
    "inputTitle": "Input JSON",
    "inputLabel": "Dati JSON",
    "inputPlaceholder": "Incolla i dati JSON qui...",
    "outputLabel": "Schema generato",
    "outputEmpty": "Fornisci dati JSON validi per generare uno schema",
    "optionsTitle": "Opzioni",
    "optionDraft": "Bozza dello schema",
    "optionInferRequired": "Dedurre proprietà obbligatorie",
    "optionAllowAdditionalProperties": "Consenti proprietà aggiuntive",
    "optionDetectFormat": "Rileva formati stringa (uuid, email, uri, date-time)",
    "invalidJson": "JSON non valido"
  },
  "ja": {
    "actionsSample": "サンプルを使用",
    "actionsDownload": "スキーマをダウンロード",
    "inputTitle": "JSON 入力",
    "inputLabel": "JSON データ",
    "inputPlaceholder": "ここに JSON データを貼り付け...",
    "outputLabel": "生成されたスキーマ",
    "outputEmpty": "有効な JSON データを入力してスキーマを生成してください",
    "optionsTitle": "オプション",
    "optionDraft": "スキーマ草案",
    "optionInferRequired": "必須プロパティを推定",
    "optionAllowAdditionalProperties": "追加プロパティを許可",
    "optionDetectFormat": "文字列フォーマットを検出 (uuid, email, uri, date-time)",
    "invalidJson": "無効な JSON"
  },
  "ko": {
    "actionsSample": "샘플 사용",
    "actionsDownload": "스키마 다운로드",
    "inputTitle": "JSON 입력",
    "inputLabel": "JSON 데이터",
    "inputPlaceholder": "여기에 JSON 데이터를 붙여넣으세요...",
    "outputLabel": "생성된 스키마",
    "outputEmpty": "유효한 JSON 데이터를 입력하면 스키마가 생성됩니다",
    "optionsTitle": "옵션",
    "optionDraft": "스키마 드래프트",
    "optionInferRequired": "필수 속성 추론",
    "optionAllowAdditionalProperties": "추가 속성 허용",
    "optionDetectFormat": "문자열 형식 감지 (uuid, email, uri, date-time)",
    "invalidJson": "유효하지 않은 JSON"
  },
  "ru": {
    "actionsSample": "Использовать пример",
    "actionsDownload": "Скачать схему",
    "inputTitle": "Ввод JSON",
    "inputLabel": "Данные JSON",
    "inputPlaceholder": "Вставьте данные JSON сюда...",
    "outputLabel": "Сгенерированная схема",
    "outputEmpty": "Введите корректные данные JSON, чтобы сгенерировать схему",
    "optionsTitle": "Параметры",
    "optionDraft": "Черновик схемы",
    "optionInferRequired": "Определять обязательные свойства",
    "optionAllowAdditionalProperties": "Разрешить дополнительные свойства",
    "optionDetectFormat": "Определять форматы строк (uuid, email, uri, date-time)",
    "invalidJson": "Неверный JSON"
  },
  "pt": {
    "actionsSample": "Usar exemplo",
    "actionsDownload": "Baixar esquema",
    "inputTitle": "Entrada JSON",
    "inputLabel": "Dados JSON",
    "inputPlaceholder": "Cole os dados JSON aqui...",
    "outputLabel": "Esquema gerado",
    "outputEmpty": "Forneça dados JSON válidos para gerar um esquema",
    "optionsTitle": "Opções",
    "optionDraft": "Rascunho do esquema",
    "optionInferRequired": "Inferir propriedades obrigatórias",
    "optionAllowAdditionalProperties": "Permitir propriedades adicionais",
    "optionDetectFormat": "Detectar formatos de string (uuid, email, uri, date-time)",
    "invalidJson": "JSON inválido"
  },
  "ar": {
    "actionsSample": "استخدم مثالاً",
    "actionsDownload": "تنزيل المخطط",
    "inputTitle": "إدخال JSON",
    "inputLabel": "بيانات JSON",
    "inputPlaceholder": "الصق بيانات JSON هنا...",
    "outputLabel": "المخطط المُولّد",
    "outputEmpty": "أدخل بيانات JSON صالحة لتوليد مخطط",
    "optionsTitle": "الخيارات",
    "optionDraft": "مسودة المخطط",
    "optionInferRequired": "استنتاج الخصائص المطلوبة",
    "optionAllowAdditionalProperties": "السماح بخصائص إضافية",
    "optionDetectFormat": "اكتشاف تنسيقات السلاسل (uuid, email, uri, date-time)",
    "invalidJson": "JSON غير صالح"
  },
  "hi": {
    "actionsSample": "उदाहरण उपयोग करें",
    "actionsDownload": "स्कीमा डाउनलोड करें",
    "inputTitle": "JSON इनपुट",
    "inputLabel": "JSON डेटा",
    "inputPlaceholder": "यहाँ JSON डेटा पेस्ट करें...",
    "outputLabel": "जनरेट किया गया स्कीमा",
    "outputEmpty": "स्कीमा बनाने के लिए मान्य JSON डेटा प्रदान करें",
    "optionsTitle": "विकल्प",
    "optionDraft": "स्कीमा ड्राफ्ट",
    "optionInferRequired": "आवश्यक प्रॉपर्टी अनुमानित करें",
    "optionAllowAdditionalProperties": "अतिरिक्त प्रॉपर्टी अनुमति दें",
    "optionDetectFormat": "स्ट्रिंग फॉर्मेट पहचानें (uuid, email, uri, date-time)",
    "invalidJson": "अमान्य JSON"
  },
  "tr": {
    "actionsSample": "Örnek kullan",
    "actionsDownload": "Şemayı indir",
    "inputTitle": "JSON Girdisi",
    "inputLabel": "JSON Verisi",
    "inputPlaceholder": "JSON verisini buraya yapıştırın...",
    "outputLabel": "Oluşturulan Şema",
    "outputEmpty": "Şema oluşturmak için geçerli JSON verisi sağlayın",
    "optionsTitle": "Seçenekler",
    "optionDraft": "Şema taslağı",
    "optionInferRequired": "Zorunlu özellikleri çıkar",
    "optionAllowAdditionalProperties": "Ek özelliklere izin ver",
    "optionDetectFormat": "Dize biçimlerini algıla (uuid, email, uri, date-time)",
    "invalidJson": "Geçersiz JSON"
  },
  "nl": {
    "actionsSample": "Voorbeeld gebruiken",
    "actionsDownload": "Schema downloaden",
    "inputTitle": "JSON-invoer",
    "inputLabel": "JSON-gegevens",
    "inputPlaceholder": "Plak hier JSON-gegevens...",
    "outputLabel": "Gegenereerd schema",
    "outputEmpty": "Voer geldige JSON-gegevens in om een schema te genereren",
    "optionsTitle": "Opties",
    "optionDraft": "Schema-concept",
    "optionInferRequired": "Verplichte eigenschappen afleiden",
    "optionAllowAdditionalProperties": "Extra eigenschappen toestaan",
    "optionDetectFormat": "Stringformaten detecteren (uuid, email, uri, date-time)",
    "invalidJson": "Ongeldig JSON"
  },
  "sv": {
    "actionsSample": "Använd exempel",
    "actionsDownload": "Ladda ner schema",
    "inputTitle": "JSON-inmatning",
    "inputLabel": "JSON-data",
    "inputPlaceholder": "Klistra in JSON-data här...",
    "outputLabel": "Genererat schema",
    "outputEmpty": "Ange giltig JSON-data för att generera ett schema",
    "optionsTitle": "Alternativ",
    "optionDraft": "Schemakast",
    "optionInferRequired": "Härled obligatoriska egenskaper",
    "optionAllowAdditionalProperties": "Tillåt extra egenskaper",
    "optionDetectFormat": "Upptäck strängformat (uuid, email, uri, date-time)",
    "invalidJson": "Ogiltig JSON"
  },
  "pl": {
    "actionsSample": "Użyj przykładu",
    "actionsDownload": "Pobierz schemat",
    "inputTitle": "Wejście JSON",
    "inputLabel": "Dane JSON",
    "inputPlaceholder": "Wklej dane JSON tutaj...",
    "outputLabel": "Wygenerowany schemat",
    "outputEmpty": "Podaj poprawne dane JSON, aby wygenerować schemat",
    "optionsTitle": "Opcje",
    "optionDraft": "Wersja schematu",
    "optionInferRequired": "Wnioskuj wymagane właściwości",
    "optionAllowAdditionalProperties": "Zezwalaj na dodatkowe właściwości",
    "optionDetectFormat": "Wykrywaj formaty ciągów (uuid, email, uri, date-time)",
    "invalidJson": "Nieprawidłowy JSON"
  },
  "vi": {
    "actionsSample": "Dùng mẫu",
    "actionsDownload": "Tải schema",
    "inputTitle": "Đầu vào JSON",
    "inputLabel": "Dữ liệu JSON",
    "inputPlaceholder": "Dán dữ liệu JSON ở đây...",
    "outputLabel": "Schema được tạo",
    "outputEmpty": "Cung cấp dữ liệu JSON hợp lệ để tạo schema",
    "optionsTitle": "Tùy chọn",
    "optionDraft": "Bản nháp schema",
    "optionInferRequired": "Suy luận thuộc tính bắt buộc",
    "optionAllowAdditionalProperties": "Cho phép thuộc tính bổ sung",
    "optionDetectFormat": "Phát hiện định dạng chuỗi (uuid, email, uri, date-time)",
    "invalidJson": "JSON không hợp lệ"
  },
  "th": {
    "actionsSample": "ใช้ตัวอย่าง",
    "actionsDownload": "ดาวน์โหลดสคีมา",
    "inputTitle": "อินพุต JSON",
    "inputLabel": "ข้อมูล JSON",
    "inputPlaceholder": "วางข้อมูล JSON ที่นี่...",
    "outputLabel": "สคีมาที่สร้างแล้ว",
    "outputEmpty": "กรุณาใส่ข้อมูล JSON ที่ถูกต้องเพื่อสร้างสคีมา",
    "optionsTitle": "ตัวเลือก",
    "optionDraft": "ร่างสคีมา",
    "optionInferRequired": "อนุมานพร็อพเพอร์ตีที่จำเป็น",
    "optionAllowAdditionalProperties": "อนุญาตพร็อพเพอร์ตีเพิ่มเติม",
    "optionDetectFormat": "ตรวจจับรูปแบบสตริง (uuid, email, uri, date-time)",
    "invalidJson": "JSON ไม่ถูกต้อง"
  },
  "id": {
    "actionsSample": "Gunakan contoh",
    "actionsDownload": "Unduh skema",
    "inputTitle": "Input JSON",
    "inputLabel": "Data JSON",
    "inputPlaceholder": "Tempel data JSON di sini...",
    "outputLabel": "Skema yang dihasilkan",
    "outputEmpty": "Berikan data JSON yang valid untuk menghasilkan skema",
    "optionsTitle": "Opsi",
    "optionDraft": "Draf skema",
    "optionInferRequired": "Inferensi properti wajib",
    "optionAllowAdditionalProperties": "Izinkan properti tambahan",
    "optionDetectFormat": "Deteksi format string (uuid, email, uri, date-time)",
    "invalidJson": "JSON tidak valid"
  },
  "he": {
    "actionsSample": "השתמש בדוגמה",
    "actionsDownload": "הורד סכימה",
    "inputTitle": "קלט JSON",
    "inputLabel": "נתוני JSON",
    "inputPlaceholder": "הדבק נתוני JSON כאן...",
    "outputLabel": "סכימה שנוצרה",
    "outputEmpty": "ספק נתוני JSON תקינים כדי ליצור סכימה",
    "optionsTitle": "אפשרויות",
    "optionDraft": "טיוטת סכימה",
    "optionInferRequired": "הסקת מאפיינים נדרשים",
    "optionAllowAdditionalProperties": "אפשר מאפיינים נוספים",
    "optionDetectFormat": "זיהוי פורמטים של מחרוזות (uuid, email, uri, date-time)",
    "invalidJson": "JSON לא תקין"
  },
  "ms": {
    "actionsSample": "Guna contoh",
    "actionsDownload": "Muat turun skema",
    "inputTitle": "Input JSON",
    "inputLabel": "Data JSON",
    "inputPlaceholder": "Tampal data JSON di sini...",
    "outputLabel": "Skema yang dijana",
    "outputEmpty": "Sediakan data JSON yang sah untuk menjana skema",
    "optionsTitle": "Pilihan",
    "optionDraft": "Draf skema",
    "optionInferRequired": "Buat inferens sifat wajib",
    "optionAllowAdditionalProperties": "Benarkan sifat tambahan",
    "optionDetectFormat": "Kesan format rentetan (uuid, email, uri, date-time)",
    "invalidJson": "JSON tidak sah"
  },
  "no": {
    "actionsSample": "Bruk eksempel",
    "actionsDownload": "Last ned skjema",
    "inputTitle": "JSON-inndata",
    "inputLabel": "JSON-data",
    "inputPlaceholder": "Lim inn JSON-data her...",
    "outputLabel": "Generert skjema",
    "outputEmpty": "Oppgi gyldige JSON-data for å generere et skjema",
    "optionsTitle": "Alternativer",
    "optionDraft": "Skjemautkast",
    "optionInferRequired": "Utrede obligatoriske egenskaper",
    "optionAllowAdditionalProperties": "Tillat ekstra egenskaper",
    "optionDetectFormat": "Oppdag strengformater (uuid, email, uri, date-time)",
    "invalidJson": "Ugyldig JSON"
  }
}
</i18n>
