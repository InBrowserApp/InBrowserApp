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
      <n-form-item-gi :label="t('yaml')" :show-feedback="false">
        <n-input
          v-model:value="yamlText"
          type="textarea"
          autosize
          :placeholder="t('yaml-placeholder')"
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
import { load as yamlLoad } from 'js-yaml'
import { stringify as tomlStringify } from 'smol-toml'
import { NButton, NIcon, NCard, NFormItemGi, NGrid, NInput, NCode, NFlex } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import hljs from 'highlight.js/lib/core'
import ini from 'highlight.js/lib/languages/ini'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('toml', ini)

const { t } = useI18n()

const yamlText = ref<string>(`hello: world
items:
  - 1
  - 2
  - 3
nested:
  a: true
`)

const renderedToml = computed<string>(() => {
  try {
    const parsed = yamlLoad(yamlText.value) as unknown
    console.log(parsed)
    return tomlStringify(parsed)
  } catch {
    return '# ' + t('invalid-yaml')
  }
})

const downloadBlob = computed(
  () => new Blob([renderedToml.value], { type: 'application/toml;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.yaml', '.yml', '.txt'],
  })
  yamlText.value = await file.text()
}
</script>

<i18n lang="json">
{
  "en": {
    "yaml": "YAML",
    "yaml-placeholder": "Paste YAML here...",
    "toml": "TOML",
    "download-toml": "Download TOML",
    "import-from-file": "Import from file",
    "invalid-yaml": "Invalid YAML"
  },
  "zh": {
    "yaml": "YAML",
    "yaml-placeholder": "在此粘贴 YAML...",
    "toml": "TOML",
    "download-toml": "下载 TOML",
    "import-from-file": "从文件导入",
    "invalid-yaml": "无效的 YAML"
  },
  "zh-CN": {
    "yaml": "YAML",
    "yaml-placeholder": "在此粘贴 YAML...",
    "toml": "TOML",
    "download-toml": "下载 TOML",
    "import-from-file": "从文件导入",
    "invalid-yaml": "无效的 YAML"
  },
  "zh-TW": {
    "yaml": "YAML",
    "yaml-placeholder": "在此貼上 YAML...",
    "toml": "TOML",
    "download-toml": "下載 TOML",
    "import-from-file": "從檔案匯入",
    "invalid-yaml": "無效的 YAML"
  },
  "zh-HK": {
    "yaml": "YAML",
    "yaml-placeholder": "在此貼上 YAML...",
    "toml": "TOML",
    "download-toml": "下載 TOML",
    "import-from-file": "從檔案匯入",
    "invalid-yaml": "無效的 YAML"
  },
  "es": {
    "yaml": "YAML",
    "yaml-placeholder": "Pega YAML aquí...",
    "toml": "TOML",
    "download-toml": "Descargar TOML",
    "import-from-file": "Importar desde archivo",
    "invalid-yaml": "YAML inválido"
  },
  "fr": {
    "yaml": "YAML",
    "yaml-placeholder": "Collez du YAML ici...",
    "toml": "TOML",
    "download-toml": "Télécharger le TOML",
    "import-from-file": "Importer depuis un fichier",
    "invalid-yaml": "YAML invalide"
  },
  "de": {
    "yaml": "YAML",
    "yaml-placeholder": "YAML hier einfügen...",
    "toml": "TOML",
    "download-toml": "TOML herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-yaml": "Ungültiges YAML"
  },
  "it": {
    "yaml": "YAML",
    "yaml-placeholder": "Incolla YAML qui...",
    "toml": "TOML",
    "download-toml": "Scarica TOML",
    "import-from-file": "Importa da file",
    "invalid-yaml": "YAML non valido"
  },
  "ja": {
    "yaml": "YAML",
    "yaml-placeholder": "ここにYAMLを貼り付け...",
    "toml": "TOML",
    "download-toml": "TOMLをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-yaml": "無効なYAML"
  },
  "ko": {
    "yaml": "YAML",
    "yaml-placeholder": "여기에 YAML 붙여넣기...",
    "toml": "TOML",
    "download-toml": "TOML 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-yaml": "유효하지 않은 YAML"
  },
  "ru": {
    "yaml": "YAML",
    "yaml-placeholder": "Вставьте YAML здесь...",
    "toml": "TOML",
    "download-toml": "Скачать TOML",
    "import-from-file": "Импорт из файла",
    "invalid-yaml": "Недопустимый YAML"
  },
  "pt": {
    "yaml": "YAML",
    "yaml-placeholder": "Cole YAML aqui...",
    "toml": "TOML",
    "download-toml": "Baixar TOML",
    "import-from-file": "Importar de arquivo",
    "invalid-yaml": "YAML inválido"
  },
  "ar": {
    "yaml": "YAML",
    "yaml-placeholder": "الصق YAML هنا...",
    "toml": "TOML",
    "download-toml": "تنزيل TOML",
    "import-from-file": "استيراد من ملف",
    "invalid-yaml": "YAML غير صالح"
  },
  "hi": {
    "yaml": "YAML",
    "yaml-placeholder": "यहाँ YAML पेस्ट करें...",
    "toml": "TOML",
    "download-toml": "TOML डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-yaml": "अमान्य YAML"
  },
  "tr": {
    "yaml": "YAML",
    "yaml-placeholder": "Buraya YAML yapıştırın...",
    "toml": "TOML",
    "download-toml": "TOML İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-yaml": "Geçersiz YAML"
  },
  "nl": {
    "yaml": "YAML",
    "yaml-placeholder": "Plak hier YAML...",
    "toml": "TOML",
    "download-toml": "TOML downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-yaml": "Ongeldige YAML"
  },
  "sv": {
    "yaml": "YAML",
    "yaml-placeholder": "Klistra in YAML här...",
    "toml": "TOML",
    "download-toml": "Ladda ner TOML",
    "import-from-file": "Importera från fil",
    "invalid-yaml": "Ogiltig YAML"
  },
  "pl": {
    "yaml": "YAML",
    "yaml-placeholder": "Wklej YAML tutaj...",
    "toml": "TOML",
    "download-toml": "Pobierz TOML",
    "import-from-file": "Importuj z pliku",
    "invalid-yaml": "Nieprawidłowy YAML"
  },
  "vi": {
    "yaml": "YAML",
    "yaml-placeholder": "Dán YAML vào đây...",
    "toml": "TOML",
    "download-toml": "Tải TOML",
    "import-from-file": "Nhập từ tệp",
    "invalid-yaml": "YAML không hợp lệ"
  },
  "th": {
    "yaml": "YAML",
    "yaml-placeholder": "วาง YAML ที่นี่...",
    "toml": "TOML",
    "download-toml": "ดาวน์โหลด TOML",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-yaml": "YAML ไม่ถูกต้อง"
  },
  "id": {
    "yaml": "YAML",
    "yaml-placeholder": "Tempel YAML di sini...",
    "toml": "TOML",
    "download-toml": "Unduh TOML",
    "import-from-file": "Impor dari file",
    "invalid-yaml": "YAML tidak valid"
  },
  "he": {
    "yaml": "YAML",
    "yaml-placeholder": "הדביקו YAML כאן...",
    "toml": "TOML",
    "download-toml": "הורד TOML",
    "import-from-file": "יבוא מקובץ",
    "invalid-yaml": "YAML לא תקין"
  },
  "ms": {
    "yaml": "YAML",
    "yaml-placeholder": "Tampal YAML di sini...",
    "toml": "TOML",
    "download-toml": "Muat turun TOML",
    "import-from-file": "Import dari fail",
    "invalid-yaml": "YAML tidak sah"
  },
  "no": {
    "yaml": "YAML",
    "yaml-placeholder": "Lim inn YAML her...",
    "toml": "TOML",
    "download-toml": "Last ned TOML",
    "import-from-file": "Importer fra fil",
    "invalid-yaml": "Ugyldig YAML"
  }
}
</i18n>
