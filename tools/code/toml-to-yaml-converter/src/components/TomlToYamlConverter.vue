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
      <n-form-item-gi :label="t('toml')" :show-feedback="false">
        <n-input
          v-model:value="tomlText"
          type="textarea"
          autosize
          :placeholder="t('toml-placeholder')"
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
import { parse as tomlParse } from 'smol-toml'
import { dump as yamlDump } from 'js-yaml'
import { NButton, NIcon, NCard, NFormItemGi, NGrid, NInput, NCode, NFlex } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import hljs from 'highlight.js/lib/core'
import yaml from 'highlight.js/lib/languages/yaml'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('yaml', yaml)

const { t } = useI18n()

const tomlText = ref<string>(`title = "Example"

[owner]
name = "Alice"

[database]
ports = [5432, 5433]
`)

const renderedYaml = computed<string>(() => {
  try {
    const parsed = tomlParse(tomlText.value) as unknown
    return yamlDump(parsed, { noRefs: true, lineWidth: 120 })
  } catch {
    return '# ' + t('invalid-toml')
  }
})

const downloadBlob = computed(
  () => new Blob([renderedYaml.value], { type: 'text/yaml;charset=utf-8' }),
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
    "yaml": "YAML",
    "download-yaml": "Download YAML",
    "import-from-file": "Import from file",
    "invalid-toml": "Invalid TOML"
  },
  "zh": {
    "toml": "TOML",
    "toml-placeholder": "在此粘贴 TOML...",
    "yaml": "YAML",
    "download-yaml": "下载 YAML",
    "import-from-file": "从文件导入",
    "invalid-toml": "无效的 TOML"
  },
  "zh-CN": {
    "toml": "TOML",
    "toml-placeholder": "在此粘贴 TOML...",
    "yaml": "YAML",
    "download-yaml": "下载 YAML",
    "import-from-file": "从文件导入",
    "invalid-toml": "无效的 TOML"
  },
  "zh-TW": {
    "toml": "TOML",
    "toml-placeholder": "在此貼上 TOML...",
    "yaml": "YAML",
    "download-yaml": "下載 YAML",
    "import-from-file": "從檔案匯入",
    "invalid-toml": "無效的 TOML"
  },
  "zh-HK": {
    "toml": "TOML",
    "toml-placeholder": "在此貼上 TOML...",
    "yaml": "YAML",
    "download-yaml": "下載 YAML",
    "import-from-file": "從檔案匯入",
    "invalid-toml": "無效的 TOML"
  },
  "es": {
    "toml": "TOML",
    "toml-placeholder": "Pega TOML aquí...",
    "yaml": "YAML",
    "download-yaml": "Descargar YAML",
    "import-from-file": "Importar desde archivo",
    "invalid-toml": "TOML inválido"
  },
  "fr": {
    "toml": "TOML",
    "toml-placeholder": "Collez du TOML ici...",
    "yaml": "YAML",
    "download-yaml": "Télécharger le YAML",
    "import-from-file": "Importer depuis un fichier",
    "invalid-toml": "TOML invalide"
  },
  "de": {
    "toml": "TOML",
    "toml-placeholder": "TOML hier einfügen...",
    "yaml": "YAML",
    "download-yaml": "YAML herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-toml": "Ungültiges TOML"
  },
  "it": {
    "toml": "TOML",
    "toml-placeholder": "Incolla TOML qui...",
    "yaml": "YAML",
    "download-yaml": "Scarica YAML",
    "import-from-file": "Importa da file",
    "invalid-toml": "TOML non valido"
  },
  "ja": {
    "toml": "TOML",
    "toml-placeholder": "ここにTOMLを貼り付け...",
    "yaml": "YAML",
    "download-yaml": "YAMLをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-toml": "無効なTOML"
  },
  "ko": {
    "toml": "TOML",
    "toml-placeholder": "여기에 TOML 붙여넣기...",
    "yaml": "YAML",
    "download-yaml": "YAML 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-toml": "유효하지 않은 TOML"
  },
  "ru": {
    "toml": "TOML",
    "toml-placeholder": "Вставьте TOML здесь...",
    "yaml": "YAML",
    "download-yaml": "Скачать YAML",
    "import-from-file": "Импорт из файла",
    "invalid-toml": "Недопустимый TOML"
  },
  "pt": {
    "toml": "TOML",
    "toml-placeholder": "Cole TOML aqui...",
    "yaml": "YAML",
    "download-yaml": "Baixar YAML",
    "import-from-file": "Importar de arquivo",
    "invalid-toml": "TOML inválido"
  },
  "ar": {
    "toml": "TOML",
    "toml-placeholder": "الصق TOML هنا...",
    "yaml": "YAML",
    "download-yaml": "تنزيل YAML",
    "import-from-file": "استيراد من ملف",
    "invalid-toml": "TOML غير صالح"
  },
  "hi": {
    "toml": "TOML",
    "toml-placeholder": "यहाँ TOML पेस्ट करें...",
    "yaml": "YAML",
    "download-yaml": "YAML डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-toml": "अमान्य TOML"
  },
  "tr": {
    "toml": "TOML",
    "toml-placeholder": "Buraya TOML yapıştırın...",
    "yaml": "YAML",
    "download-yaml": "YAML İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-toml": "Geçersiz TOML"
  },
  "nl": {
    "toml": "TOML",
    "toml-placeholder": "Plak hier TOML...",
    "yaml": "YAML",
    "download-yaml": "YAML downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-toml": "Ongeldige TOML"
  },
  "sv": {
    "toml": "TOML",
    "toml-placeholder": "Klistra in TOML här...",
    "yaml": "YAML",
    "download-yaml": "Ladda ner YAML",
    "import-from-file": "Importera från fil",
    "invalid-toml": "Ogiltig TOML"
  },
  "pl": {
    "toml": "TOML",
    "toml-placeholder": "Wklej TOML tutaj...",
    "yaml": "YAML",
    "download-yaml": "Pobierz YAML",
    "import-from-file": "Importuj z pliku",
    "invalid-toml": "Nieprawidłowy TOML"
  },
  "vi": {
    "toml": "TOML",
    "toml-placeholder": "Dán TOML vào đây...",
    "yaml": "YAML",
    "download-yaml": "Tải YAML",
    "import-from-file": "Nhập từ tệp",
    "invalid-toml": "TOML không hợp lệ"
  },
  "th": {
    "toml": "TOML",
    "toml-placeholder": "วาง TOML ที่นี่...",
    "yaml": "YAML",
    "download-yaml": "ดาวน์โหลด YAML",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-toml": "TOML ไม่ถูกต้อง"
  },
  "id": {
    "toml": "TOML",
    "toml-placeholder": "Tempel TOML di sini...",
    "yaml": "YAML",
    "download-yaml": "Unduh YAML",
    "import-from-file": "Impor dari file",
    "invalid-toml": "TOML tidak valid"
  },
  "he": {
    "toml": "TOML",
    "toml-placeholder": "הדביקו TOML כאן...",
    "yaml": "YAML",
    "download-yaml": "הורד YAML",
    "import-from-file": "יבוא מקובץ",
    "invalid-toml": "TOML לא תקין"
  },
  "ms": {
    "toml": "TOML",
    "toml-placeholder": "Tampal TOML di sini...",
    "yaml": "YAML",
    "download-yaml": "Muat turun YAML",
    "import-from-file": "Import dari fail",
    "invalid-toml": "TOML tidak sah"
  },
  "no": {
    "toml": "TOML",
    "toml-placeholder": "Lim inn TOML her...",
    "yaml": "YAML",
    "download-yaml": "Last ned YAML",
    "import-from-file": "Importer fra fil",
    "invalid-toml": "Ugyldig TOML"
  }
}
</i18n>
