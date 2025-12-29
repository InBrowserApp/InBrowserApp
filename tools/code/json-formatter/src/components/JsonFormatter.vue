<template>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-flex align="center">
        <n-button @click="importFromFile" text>
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>
      </n-flex>

      <n-flex>
        <n-flex align="center">
          <n-text :depth="3">{{ t('indent-size') }}:</n-text>
          <n-input-number
            v-model:value="indentSize"
            :min="1"
            :max="8"
            size="small"
            style="width: 80px"
          />
        </n-flex>
        <CopyToClipboardButton :content="formattedJson" />
        <n-button @click="downloadJson" text>
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-json') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('raw-json')" :show-feedback="false">
        <n-input
          v-model:value="jsonText"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 20 }"
          :placeholder="t('json-placeholder')"
          :status="hasJsonError ? 'error' : undefined"
        />
        <template v-if="hasJsonError" #feedback>
          <n-text type="error">{{ jsonError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :label="t('formatted-json')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="formattedJson" language="json" :hljs="hljs" word-wrap></n-code>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import {
  NButton,
  NIcon,
  NCard,
  NFormItemGi,
  NGrid,
  NInput,
  NCode,
  NFlex,
  NText,
  NInputNumber,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ArrowDownload16Regular, Document16Regular } from '@shared/icons/fluent'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('json', json)

const { t } = useI18n()

const jsonText = ref<string>(`{
  "hello": "world",
  "items": [1, 2, 3],
  "nested": { "a": true, "b": null }
}`)

const indentSize = ref<number>(2)

const jsonError = ref<string>('')
const hasJsonError = computed(() => jsonError.value !== '')

const formattedJson = computed<string>(() => {
  try {
    if (!jsonText.value.trim()) {
      return ''
    }

    const parsed = JSON.parse(jsonText.value)
    return JSON.stringify(parsed, null, indentSize.value)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return '# ' + t('invalid-json') + ': ' + errorMessage
  }
})

// Watch for changes to update error state separately
watch(
  [jsonText, indentSize],
  () => {
    try {
      if (!jsonText.value.trim()) {
        jsonError.value = ''
        return
      }
      JSON.parse(jsonText.value)
      jsonError.value = ''
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      jsonError.value = t('invalid-json') + ': ' + errorMessage
    }
  },
  { immediate: true },
)

function downloadJson(): void {
  const blob = new Blob([formattedJson.value], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'formatted.json'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({
      extensions: ['.json', '.txt'],
    })
    jsonText.value = await file.text()
  } catch {
    // User cancelled file selection - this is normal
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "import-from-file": "Import from file",
    "download-json": "Download JSON",
    "raw-json": "Raw JSON",
    "formatted-json": "Formatted JSON",
    "json-placeholder": "Paste your JSON here...",
    "invalid-json": "Invalid JSON",
    "indent-size": "Indent"
  },
  "zh": {
    "import-from-file": "从文件导入",
    "download-json": "下载 JSON",
    "raw-json": "原始 JSON",
    "formatted-json": "格式化的 JSON",
    "json-placeholder": "在此粘贴您的 JSON...",
    "invalid-json": "无效的 JSON",
    "indent-size": "缩进"
  },
  "zh-CN": {
    "import-from-file": "从文件导入",
    "download-json": "下载 JSON",
    "raw-json": "原始 JSON",
    "formatted-json": "格式化的 JSON",
    "json-placeholder": "在此粘贴您的 JSON...",
    "invalid-json": "无效的 JSON",
    "indent-size": "缩进"
  },
  "zh-TW": {
    "import-from-file": "從檔案匯入",
    "download-json": "下載 JSON",
    "raw-json": "原始 JSON",
    "formatted-json": "格式化的 JSON",
    "json-placeholder": "在此貼上您的 JSON...",
    "invalid-json": "無效的 JSON",
    "indent-size": "縮進"
  },
  "zh-HK": {
    "import-from-file": "從檔案匯入",
    "download-json": "下載 JSON",
    "raw-json": "原始 JSON",
    "formatted-json": "格式化的 JSON",
    "json-placeholder": "在此貼上您的 JSON...",
    "invalid-json": "無效的 JSON",
    "indent-size": "縮進"
  },
  "es": {
    "import-from-file": "Importar desde archivo",
    "download-json": "Descargar JSON",
    "raw-json": "JSON sin procesar",
    "formatted-json": "JSON formateado",
    "json-placeholder": "Pegue su JSON aquí...",
    "invalid-json": "JSON inválido",
    "indent-size": "Sangría"
  },
  "fr": {
    "import-from-file": "Importer depuis un fichier",
    "download-json": "Télécharger JSON",
    "raw-json": "JSON brut",
    "formatted-json": "JSON formaté",
    "json-placeholder": "Collez votre JSON ici...",
    "invalid-json": "JSON invalide",
    "indent-size": "Indentation"
  },
  "de": {
    "import-from-file": "Aus Datei importieren",
    "download-json": "JSON herunterladen",
    "raw-json": "Raw JSON",
    "formatted-json": "Formatiertes JSON",
    "json-placeholder": "JSON hier einfügen...",
    "invalid-json": "Ungültiges JSON",
    "indent-size": "Einrückung"
  },
  "it": {
    "import-from-file": "Importa da file",
    "download-json": "Scarica JSON",
    "raw-json": "JSON grezzo",
    "formatted-json": "JSON formattato",
    "json-placeholder": "Incolla il tuo JSON qui...",
    "invalid-json": "JSON non valido",
    "indent-size": "Indentazione"
  },
  "ja": {
    "import-from-file": "ファイルから読み込み",
    "download-json": "JSONをダウンロード",
    "raw-json": "生のJSON",
    "formatted-json": "フォーマット済みJSON",
    "json-placeholder": "ここにJSONを貼り付けてください...",
    "invalid-json": "無効なJSON",
    "indent-size": "インデント"
  },
  "ko": {
    "import-from-file": "파일에서 가져오기",
    "download-json": "JSON 다운로드",
    "raw-json": "원시 JSON",
    "formatted-json": "포맷된 JSON",
    "json-placeholder": "여기에 JSON을 붙여넣으세요...",
    "invalid-json": "유효하지 않은 JSON",
    "indent-size": "들여쓰기"
  },
  "ru": {
    "import-from-file": "Импорт из файла",
    "download-json": "Скачать JSON",
    "raw-json": "Сырой JSON",
    "formatted-json": "Форматированный JSON",
    "json-placeholder": "Вставьте ваш JSON здесь...",
    "invalid-json": "Некорректный JSON",
    "indent-size": "Отступ"
  },
  "pt": {
    "import-from-file": "Importar de arquivo",
    "download-json": "Baixar JSON",
    "raw-json": "JSON bruto",
    "formatted-json": "JSON formatado",
    "json-placeholder": "Cole seu JSON aqui...",
    "invalid-json": "JSON inválido",
    "indent-size": "Indentação"
  },
  "ar": {
    "import-from-file": "استيراد من ملف",
    "download-json": "تحميل JSON",
    "raw-json": "JSON الخام",
    "formatted-json": "JSON المنسق",
    "json-placeholder": "الصق JSON الخاص بك هنا...",
    "invalid-json": "JSON غير صالح",
    "indent-size": "المسافة البادئة"
  },
  "hi": {
    "import-from-file": "फ़ाइल से आयात करें",
    "download-json": "JSON डाउनलोड करें",
    "raw-json": "कच्चा JSON",
    "formatted-json": "स्वरूपित JSON",
    "json-placeholder": "अपना JSON यहां पेस्ट करें...",
    "invalid-json": "अमान्य JSON",
    "indent-size": "इंडेंट"
  },
  "tr": {
    "import-from-file": "Dosyadan içe aktar",
    "download-json": "JSON indir",
    "raw-json": "Ham JSON",
    "formatted-json": "Biçimlendirilmiş JSON",
    "json-placeholder": "JSON'unuzu buraya yapıştırın...",
    "invalid-json": "Geçersiz JSON",
    "indent-size": "Girinti"
  },
  "nl": {
    "import-from-file": "Importeren uit bestand",
    "download-json": "JSON downloaden",
    "raw-json": "Ruwe JSON",
    "formatted-json": "Geformatteerde JSON",
    "json-placeholder": "Plak hier uw JSON...",
    "invalid-json": "Ongeldige JSON",
    "indent-size": "Inspringing"
  },
  "sv": {
    "import-from-file": "Importera från fil",
    "download-json": "Ladda ner JSON",
    "raw-json": "Rå JSON",
    "formatted-json": "Formaterad JSON",
    "json-placeholder": "Klistra in din JSON här...",
    "invalid-json": "Ogiltig JSON",
    "indent-size": "Indrag"
  },
  "pl": {
    "import-from-file": "Importuj z pliku",
    "download-json": "Pobierz JSON",
    "raw-json": "Surowy JSON",
    "formatted-json": "Sformatowany JSON",
    "json-placeholder": "Wklej tutaj swój JSON...",
    "invalid-json": "Nieprawidłowy JSON",
    "indent-size": "Wcięcie"
  },
  "vi": {
    "import-from-file": "Nhập từ tệp",
    "download-json": "Tải xuống JSON",
    "raw-json": "JSON thô",
    "formatted-json": "JSON đã định dạng",
    "json-placeholder": "Dán JSON của bạn vào đây...",
    "invalid-json": "JSON không hợp lệ",
    "indent-size": "Thụt lề"
  },
  "th": {
    "import-from-file": "นำเข้าจากไฟล์",
    "download-json": "ดาวน์โหลด JSON",
    "raw-json": "JSON ดิบ",
    "formatted-json": "JSON ที่จัดรูปแบบแล้ว",
    "json-placeholder": "วาง JSON ของคุณที่นี่...",
    "invalid-json": "JSON ไม่ถูกต้อง",
    "indent-size": "การเยื้อง"
  },
  "id": {
    "import-from-file": "Impor dari file",
    "download-json": "Unduh JSON",
    "raw-json": "JSON mentah",
    "formatted-json": "JSON terformat",
    "json-placeholder": "Tempel JSON Anda di sini...",
    "invalid-json": "JSON tidak valid",
    "indent-size": "Indentasi"
  },
  "he": {
    "import-from-file": "ייבוא מקובץ",
    "download-json": "הורד JSON",
    "raw-json": "JSON גולמי",
    "formatted-json": "JSON מעוצב",
    "json-placeholder": "הדבק את ה-JSON שלך כאן...",
    "invalid-json": "JSON לא תקין",
    "indent-size": "הזחה"
  },
  "ms": {
    "import-from-file": "Import dari fail",
    "download-json": "Muat turun JSON",
    "raw-json": "JSON mentah",
    "formatted-json": "JSON berformat",
    "json-placeholder": "Tampal JSON anda di sini...",
    "invalid-json": "JSON tidak sah",
    "indent-size": "Inden"
  },
  "no": {
    "import-from-file": "Importer fra fil",
    "download-json": "Last ned JSON",
    "raw-json": "Rå JSON",
    "formatted-json": "Formatert JSON",
    "json-placeholder": "Lim inn JSON-en din her...",
    "invalid-json": "Ugyldig JSON",
    "indent-size": "Innrykk"
  }
}
</i18n>
