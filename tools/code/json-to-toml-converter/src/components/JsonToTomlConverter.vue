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
        <CopyToClipboardButton :content="renderedToml" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="converted.toml">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-toml') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('json')" :show-feedback="false">
        <n-input
          v-model:value="jsonText"
          type="textarea"
          autosize
          :placeholder="t('json-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('toml')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="renderedToml" language="toml" :hljs="hljs" word-wrap></n-code>
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
import { stringify as tomlStringify } from 'smol-toml'
import { NButton, NIcon, NCard, NFormItemGi, NGrid, NInput, NCode, NFlex } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import hljs from 'highlight.js/lib/core'
import ini from 'highlight.js/lib/languages/ini'
import { fileOpen } from 'browser-fs-access'

window.global = window

hljs.registerLanguage('toml', ini)

const { t } = useI18n()

const jsonText = ref<string>(`{
  "title": "TOML Example",
  "owner": {
    "name": "Tom Preston-Werner"
  },
  "database": {
    "ports": [8001, 8001, 8002],
    "enabled": true
  }
}`)

const renderedToml = computed<string>(() => {
  try {
    const parsed = JSON.parse(jsonText.value)
    return tomlStringify(parsed)
  } catch {
    return '# ' + t('invalid-json')
  }
})

const downloadBlob = computed(
  () => new Blob([renderedToml.value], { type: 'application/toml;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.json', '.txt'],
  })
  jsonText.value = await file.text()
}
</script>

<i18n lang="json">
{
  "en": {
    "json": "JSON",
    "json-placeholder": "Paste JSON here...",
    "toml": "TOML",
    "download-toml": "Download TOML",
    "import-from-file": "Import from file",
    "invalid-json": "Invalid JSON"
  },
  "zh": {
    "json": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "toml": "TOML",
    "download-toml": "下载 TOML",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON"
  },
  "zh-CN": {
    "json": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "toml": "TOML",
    "download-toml": "下载 TOML",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON"
  },
  "zh-TW": {
    "json": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "toml": "TOML",
    "download-toml": "下載 TOML",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON"
  },
  "zh-HK": {
    "json": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "toml": "TOML",
    "download-toml": "下載 TOML",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON"
  },
  "es": {
    "json": "JSON",
    "json-placeholder": "Pega JSON aquí...",
    "toml": "TOML",
    "download-toml": "Descargar TOML",
    "import-from-file": "Importar desde archivo",
    "invalid-json": "JSON inválido"
  },
  "fr": {
    "json": "JSON",
    "json-placeholder": "Collez du JSON ici...",
    "toml": "TOML",
    "download-toml": "Télécharger le TOML",
    "import-from-file": "Importer depuis un fichier",
    "invalid-json": "JSON invalide"
  },
  "de": {
    "json": "JSON",
    "json-placeholder": "JSON hier einfügen...",
    "toml": "TOML",
    "download-toml": "TOML herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-json": "Ungültiges JSON"
  },
  "it": {
    "json": "JSON",
    "json-placeholder": "Incolla JSON qui...",
    "toml": "TOML",
    "download-toml": "Scarica TOML",
    "import-from-file": "Importa da file",
    "invalid-json": "JSON non valido"
  },
  "ja": {
    "json": "JSON",
    "json-placeholder": "ここにJSONを貼り付け...",
    "toml": "TOML",
    "download-toml": "TOMLをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-json": "無効なJSON"
  },
  "ko": {
    "json": "JSON",
    "json-placeholder": "여기에 JSON 붙여넣기...",
    "toml": "TOML",
    "download-toml": "TOML 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-json": "유효하지 않은 JSON"
  },
  "ru": {
    "json": "JSON",
    "json-placeholder": "Вставьте JSON здесь...",
    "toml": "TOML",
    "download-toml": "Скачать TOML",
    "import-from-file": "Импорт из файла",
    "invalid-json": "Недопустимый JSON"
  },
  "pt": {
    "json": "JSON",
    "json-placeholder": "Cole JSON aqui...",
    "toml": "TOML",
    "download-toml": "Baixar TOML",
    "import-from-file": "Importar de arquivo",
    "invalid-json": "JSON inválido"
  },
  "ar": {
    "json": "JSON",
    "json-placeholder": "الصق JSON هنا...",
    "toml": "TOML",
    "download-toml": "تنزيل TOML",
    "import-from-file": "استيراد من ملف",
    "invalid-json": "JSON غير صالح"
  },
  "hi": {
    "json": "JSON",
    "json-placeholder": "यहाँ JSON पेस्ट करें...",
    "toml": "TOML",
    "download-toml": "TOML डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-json": "अमान्य JSON"
  },
  "tr": {
    "json": "JSON",
    "json-placeholder": "Buraya JSON yapıştırın...",
    "toml": "TOML",
    "download-toml": "TOML İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-json": "Geçersiz JSON"
  },
  "nl": {
    "json": "JSON",
    "json-placeholder": "Plak hier JSON...",
    "toml": "TOML",
    "download-toml": "TOML downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-json": "Ongeldige JSON"
  },
  "sv": {
    "json": "JSON",
    "json-placeholder": "Klistra in JSON här...",
    "toml": "TOML",
    "download-toml": "Ladda ner TOML",
    "import-from-file": "Importera från fil",
    "invalid-json": "Ogiltig JSON"
  },
  "pl": {
    "json": "JSON",
    "json-placeholder": "Wklej JSON tutaj...",
    "toml": "TOML",
    "download-toml": "Pobierz TOML",
    "import-from-file": "Importuj z pliku",
    "invalid-json": "Nieprawidłowy JSON"
  },
  "vi": {
    "json": "JSON",
    "json-placeholder": "Dán JSON vào đây...",
    "toml": "TOML",
    "download-toml": "Tải TOML",
    "import-from-file": "Nhập từ tệp",
    "invalid-json": "JSON không hợp lệ"
  },
  "th": {
    "json": "JSON",
    "json-placeholder": "วาง JSON ที่นี่...",
    "toml": "TOML",
    "download-toml": "ดาวน์โหลด TOML",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-json": "JSON ไม่ถูกต้อง"
  },
  "id": {
    "json": "JSON",
    "json-placeholder": "Tempel JSON di sini...",
    "toml": "TOML",
    "download-toml": "Unduh TOML",
    "import-from-file": "Impor dari file",
    "invalid-json": "JSON tidak valid"
  },
  "he": {
    "json": "JSON",
    "json-placeholder": "הדביקו JSON כאן...",
    "toml": "TOML",
    "download-toml": "הורד TOML",
    "import-from-file": "יבוא מקובץ",
    "invalid-json": "JSON לא תקין"
  },
  "ms": {
    "json": "JSON",
    "json-placeholder": "Tampal JSON di sini...",
    "toml": "TOML",
    "download-toml": "Muat turun TOML",
    "import-from-file": "Import dari fail",
    "invalid-json": "JSON tidak sah"
  },
  "no": {
    "json": "JSON",
    "json-placeholder": "Lim inn JSON her...",
    "toml": "TOML",
    "download-toml": "Last ned TOML",
    "import-from-file": "Importer fra fil",
    "invalid-json": "Ugyldig JSON"
  }
}
</i18n>
