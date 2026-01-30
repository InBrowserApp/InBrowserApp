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
        <CopyToClipboardButton :content="renderedYaml" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="converted.yaml">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-yaml') }}
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
      <n-form-item-gi :label="t('yaml')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="renderedYaml" language="yaml" :hljs="hljs" word-wrap></n-code>
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
import { load as yamlLoad, dump as yamlDump } from 'js-yaml'
import { NButton, NIcon, NCard, NFormItemGi, NGrid, NInput, NCode, NFlex } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import hljs from 'highlight.js/lib/core'
import yaml from 'highlight.js/lib/languages/yaml'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('yaml', yaml)

const { t } = useI18n()

const jsonText = ref<string>(`{
  "hello": "world",
  "items": [1, 2, 3],
  "nested": { "a": true, "b": null }
}`)

const renderedYaml = computed<string>(() => {
  try {
    const parsed = JSON.parse(jsonText.value)
    return yamlDump(parsed, { noRefs: true, lineWidth: 120 })
  } catch {
    try {
      const parsed = yamlLoad(jsonText.value) as unknown
      return yamlDump(parsed, { noRefs: true, lineWidth: 120 })
    } catch {
      return '# ' + t('invalid-json')
    }
  }
})

const downloadBlob = computed(
  () => new Blob([renderedYaml.value], { type: 'text/yaml;charset=utf-8' }),
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
    "yaml": "YAML",
    "download-yaml": "Download YAML",
    "import-from-file": "Import from file",
    "invalid-json": "Invalid JSON or YAML"
  },
  "zh": {
    "json": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "yaml": "YAML",
    "download-yaml": "下载 YAML",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON 或 YAML"
  },
  "zh-CN": {
    "json": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "yaml": "YAML",
    "download-yaml": "下载 YAML",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON 或 YAML"
  },
  "zh-TW": {
    "json": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "yaml": "YAML",
    "download-yaml": "下載 YAML",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON 或 YAML"
  },
  "zh-HK": {
    "json": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "yaml": "YAML",
    "download-yaml": "下載 YAML",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON 或 YAML"
  },
  "es": {
    "json": "JSON",
    "json-placeholder": "Pega JSON aquí...",
    "yaml": "YAML",
    "download-yaml": "Descargar YAML",
    "import-from-file": "Importar desde archivo",
    "invalid-json": "JSON o YAML inválido"
  },
  "fr": {
    "json": "JSON",
    "json-placeholder": "Collez du JSON ici...",
    "yaml": "YAML",
    "download-yaml": "Télécharger le YAML",
    "import-from-file": "Importer depuis un fichier",
    "invalid-json": "JSON ou YAML invalide"
  },
  "de": {
    "json": "JSON",
    "json-placeholder": "JSON hier einfügen...",
    "yaml": "YAML",
    "download-yaml": "YAML herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-json": "Ungültiges JSON oder YAML"
  },
  "it": {
    "json": "JSON",
    "json-placeholder": "Incolla JSON qui...",
    "yaml": "YAML",
    "download-yaml": "Scarica YAML",
    "import-from-file": "Importa da file",
    "invalid-json": "JSON o YAML non valido"
  },
  "ja": {
    "json": "JSON",
    "json-placeholder": "ここにJSONを貼り付け...",
    "yaml": "YAML",
    "download-yaml": "YAMLをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-json": "無効なJSONまたはYAML"
  },
  "ko": {
    "json": "JSON",
    "json-placeholder": "여기에 JSON 붙여넣기...",
    "yaml": "YAML",
    "download-yaml": "YAML 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-json": "유효하지 않은 JSON 또는 YAML"
  },
  "ru": {
    "json": "JSON",
    "json-placeholder": "Вставьте JSON здесь...",
    "yaml": "YAML",
    "download-yaml": "Скачать YAML",
    "import-from-file": "Импорт из файла",
    "invalid-json": "Недопустимый JSON или YAML"
  },
  "pt": {
    "json": "JSON",
    "json-placeholder": "Cole JSON aqui...",
    "yaml": "YAML",
    "download-yaml": "Baixar YAML",
    "import-from-file": "Importar de arquivo",
    "invalid-json": "JSON ou YAML inválido"
  },
  "ar": {
    "json": "JSON",
    "json-placeholder": "الصق JSON هنا...",
    "yaml": "YAML",
    "download-yaml": "تنزيل YAML",
    "import-from-file": "استيراد من ملف",
    "invalid-json": "JSON أو YAML غير صالح"
  },
  "hi": {
    "json": "JSON",
    "json-placeholder": "यहाँ JSON पेस्ट करें...",
    "yaml": "YAML",
    "download-yaml": "YAML डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-json": "अमान्य JSON या YAML"
  },
  "tr": {
    "json": "JSON",
    "json-placeholder": "Buraya JSON yapıştırın...",
    "yaml": "YAML",
    "download-yaml": "YAML İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-json": "Geçersiz JSON veya YAML"
  },
  "nl": {
    "json": "JSON",
    "json-placeholder": "Plak hier JSON...",
    "yaml": "YAML",
    "download-yaml": "YAML downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-json": "Ongeldige JSON of YAML"
  },
  "sv": {
    "json": "JSON",
    "json-placeholder": "Klistra in JSON här...",
    "yaml": "YAML",
    "download-yaml": "Ladda ner YAML",
    "import-from-file": "Importera från fil",
    "invalid-json": "Ogiltig JSON eller YAML"
  },
  "pl": {
    "json": "JSON",
    "json-placeholder": "Wklej JSON tutaj...",
    "yaml": "YAML",
    "download-yaml": "Pobierz YAML",
    "import-from-file": "Importuj z pliku",
    "invalid-json": "Nieprawidłowy JSON lub YAML"
  },
  "vi": {
    "json": "JSON",
    "json-placeholder": "Dán JSON vào đây...",
    "yaml": "YAML",
    "download-yaml": "Tải YAML",
    "import-from-file": "Nhập từ tệp",
    "invalid-json": "JSON hoặc YAML không hợp lệ"
  },
  "th": {
    "json": "JSON",
    "json-placeholder": "วาง JSON ที่นี่...",
    "yaml": "YAML",
    "download-yaml": "ดาวน์โหลด YAML",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-json": "JSON หรือ YAML ไม่ถูกต้อง"
  },
  "id": {
    "json": "JSON",
    "json-placeholder": "Tempel JSON di sini...",
    "yaml": "YAML",
    "download-yaml": "Unduh YAML",
    "import-from-file": "Impor dari file",
    "invalid-json": "JSON atau YAML tidak valid"
  },
  "he": {
    "json": "JSON",
    "json-placeholder": "הדביקו JSON כאן...",
    "yaml": "YAML",
    "download-yaml": "הורד YAML",
    "import-from-file": "יבוא מקובץ",
    "invalid-json": "JSON או YAML לא תקין"
  },
  "ms": {
    "json": "JSON",
    "json-placeholder": "Tampal JSON di sini...",
    "yaml": "YAML",
    "download-yaml": "Muat turun YAML",
    "import-from-file": "Import dari fail",
    "invalid-json": "JSON atau YAML tidak sah"
  },
  "no": {
    "json": "JSON",
    "json-placeholder": "Lim inn JSON her...",
    "yaml": "YAML",
    "download-yaml": "Last ned YAML",
    "import-from-file": "Importer fra fil",
    "invalid-json": "Ugyldig JSON eller YAML"
  }
}
</i18n>
