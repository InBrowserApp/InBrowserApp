<template>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-flex align="center">
        <n-button text @click="importFromFile">
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>
      </n-flex>

      <n-flex>
        <CopyToClipboardButton :content="renderedJson" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="converted.json">
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
      <n-form-item-gi :label="t('toml')" :show-feedback="false">
        <n-input
          v-model:value="tomlText"
          type="textarea"
          autosize
          :placeholder="t('toml-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('json')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="renderedJson" language="json" :hljs="hljs" word-wrap></n-code>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import { parse as tomlParse } from 'smol-toml'
import { NButton, NIcon, NCard, NFormItemGi, NGrid, NInput, NCode, NFlex } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('json', json)

const { t } = useI18n()

const tomlText = ref<string>(`title = "TOML Example"

[owner]
name = "Tom Preston-Werner"

[database]
ports = [8001, 8001, 8002]
enabled = true
`)

const renderedJson = computed<string>(() => {
  try {
    const parsed = tomlParse(tomlText.value) as unknown
    return JSON.stringify(parsed, null, 2)
  } catch {
    return '// ' + t('invalid-toml')
  }
})

const downloadBlob = computed(
  () => new Blob([renderedJson.value], { type: 'application/json;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.toml', '.txt'],
  })
  tomlText.value = await file.text()
}
</script>

<i18n lang="json">
{
  "en": {
    "toml": "TOML",
    "toml-placeholder": "Paste TOML here...",
    "json": "JSON",
    "download-json": "Download JSON",
    "import-from-file": "Import from file",
    "invalid-toml": "Invalid TOML"
  },
  "zh": {
    "toml": "TOML",
    "toml-placeholder": "在此粘贴 TOML...",
    "json": "JSON",
    "download-json": "下载 JSON",
    "import-from-file": "从文件导入",
    "invalid-toml": "无效的 TOML"
  },
  "zh-CN": {
    "toml": "TOML",
    "toml-placeholder": "在此粘贴 TOML...",
    "json": "JSON",
    "download-json": "下载 JSON",
    "import-from-file": "从文件导入",
    "invalid-toml": "无效的 TOML"
  },
  "zh-TW": {
    "toml": "TOML",
    "toml-placeholder": "在此貼上 TOML...",
    "json": "JSON",
    "download-json": "下載 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-toml": "無效的 TOML"
  },
  "zh-HK": {
    "toml": "TOML",
    "toml-placeholder": "在此貼上 TOML...",
    "json": "JSON",
    "download-json": "下載 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-toml": "無效的 TOML"
  },
  "es": {
    "toml": "TOML",
    "toml-placeholder": "Pega TOML aquí...",
    "json": "JSON",
    "download-json": "Descargar JSON",
    "import-from-file": "Importar desde archivo",
    "invalid-toml": "TOML inválido"
  },
  "fr": {
    "toml": "TOML",
    "toml-placeholder": "Collez du TOML ici...",
    "json": "JSON",
    "download-json": "Télécharger le JSON",
    "import-from-file": "Importer depuis un fichier",
    "invalid-toml": "TOML invalide"
  },
  "de": {
    "toml": "TOML",
    "toml-placeholder": "TOML hier einfügen...",
    "json": "JSON",
    "download-json": "JSON herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-toml": "Ungültiges TOML"
  },
  "it": {
    "toml": "TOML",
    "toml-placeholder": "Incolla TOML qui...",
    "json": "JSON",
    "download-json": "Scarica JSON",
    "import-from-file": "Importa da file",
    "invalid-toml": "TOML non valido"
  },
  "ja": {
    "toml": "TOML",
    "toml-placeholder": "ここにTOMLを貼り付け...",
    "json": "JSON",
    "download-json": "JSONをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-toml": "無効なTOML"
  },
  "ko": {
    "toml": "TOML",
    "toml-placeholder": "여기에 TOML 붙여넣기...",
    "json": "JSON",
    "download-json": "JSON 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-toml": "유효하지 않은 TOML"
  },
  "ru": {
    "toml": "TOML",
    "toml-placeholder": "Вставьте TOML здесь...",
    "json": "JSON",
    "download-json": "Скачать JSON",
    "import-from-file": "Импорт из файла",
    "invalid-toml": "Недопустимый TOML"
  },
  "pt": {
    "toml": "TOML",
    "toml-placeholder": "Cole TOML aqui...",
    "json": "JSON",
    "download-json": "Baixar JSON",
    "import-from-file": "Importar de arquivo",
    "invalid-toml": "TOML inválido"
  },
  "ar": {
    "toml": "TOML",
    "toml-placeholder": "الصق TOML هنا...",
    "json": "JSON",
    "download-json": "تنزيل JSON",
    "import-from-file": "استيراد من ملف",
    "invalid-toml": "TOML غير صالح"
  },
  "hi": {
    "toml": "TOML",
    "toml-placeholder": "यहाँ TOML पेस्ट करें...",
    "json": "JSON",
    "download-json": "JSON डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-toml": "अमान्य TOML"
  },
  "tr": {
    "toml": "TOML",
    "toml-placeholder": "Buraya TOML yapıştırın...",
    "json": "JSON",
    "download-json": "JSON İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-toml": "Geçersiz TOML"
  },
  "nl": {
    "toml": "TOML",
    "toml-placeholder": "Plak hier TOML...",
    "json": "JSON",
    "download-json": "JSON downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-toml": "Ongeldige TOML"
  },
  "sv": {
    "toml": "TOML",
    "toml-placeholder": "Klistra in TOML här...",
    "json": "JSON",
    "download-json": "Ladda ner JSON",
    "import-from-file": "Importera från fil",
    "invalid-toml": "Ogiltig TOML"
  },
  "pl": {
    "toml": "TOML",
    "toml-placeholder": "Wklej TOML tutaj...",
    "json": "JSON",
    "download-json": "Pobierz JSON",
    "import-from-file": "Importuj z pliku",
    "invalid-toml": "Nieprawidłowy TOML"
  },
  "vi": {
    "toml": "TOML",
    "toml-placeholder": "Dán TOML vào đây...",
    "json": "JSON",
    "download-json": "Tải JSON",
    "import-from-file": "Nhập từ tệp",
    "invalid-toml": "TOML không hợp lệ"
  },
  "th": {
    "toml": "TOML",
    "toml-placeholder": "วาง TOML ที่นี่...",
    "json": "JSON",
    "download-json": "ดาวน์โหลด JSON",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-toml": "TOML ไม่ถูกต้อง"
  },
  "id": {
    "toml": "TOML",
    "toml-placeholder": "Tempel TOML di sini...",
    "json": "JSON",
    "download-json": "Unduh JSON",
    "import-from-file": "Impor dari file",
    "invalid-toml": "TOML tidak valid"
  },
  "he": {
    "toml": "TOML",
    "toml-placeholder": "הדביקו TOML כאן...",
    "json": "JSON",
    "download-json": "הורד JSON",
    "import-from-file": "יבוא מקובץ",
    "invalid-toml": "TOML לא תקין"
  },
  "ms": {
    "toml": "TOML",
    "toml-placeholder": "Tampal TOML di sini...",
    "json": "JSON",
    "download-json": "Muat turun JSON",
    "import-from-file": "Import dari fail",
    "invalid-toml": "TOML tidak sah"
  },
  "no": {
    "toml": "TOML",
    "toml-placeholder": "Lim inn TOML her...",
    "json": "JSON",
    "download-json": "Last ned JSON",
    "import-from-file": "Importer fra fil",
    "invalid-toml": "Ugyldig TOML"
  }
}
</i18n>
