<template>
  <n-flex align="center" justify="space-between" :wrap="true" :size="12">
    <n-flex align="center" :wrap="true" :size="12">
      <n-button text @click="$emit('import')">
        <template #icon>
          <n-icon :component="Document16Regular" />
        </template>
        {{ t('import-from-file') }}
      </n-button>
      <n-button text @click="$emit('sample')">
        <template #icon>
          <n-icon :component="ClipboardPaste16Regular" />
        </template>
        {{ t('use-sample') }}
      </n-button>
      <n-button text @click="$emit('clear')">
        <template #icon>
          <n-icon :component="Delete16Regular" />
        </template>
        {{ t('clear') }}
      </n-button>
    </n-flex>

    <n-flex align="center" :wrap="true" :size="12">
      <CopyToClipboardButton :content="formattedSql" />
      <n-button
        tag="a"
        text
        :disabled="!downloadUrl"
        :href="downloadUrl ?? undefined"
        :download="downloadFilename"
      >
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download-formatted') }}
      </n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import ClipboardPaste16Regular from '@vicons/fluent/ClipboardPaste16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'

defineProps<{
  formattedSql: string
  downloadUrl: string | null
  downloadFilename: string
}>()

defineEmits<{
  import: []
  sample: []
  clear: []
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "zh": {
    "import-from-file": "从文件导入",
    "use-sample": "使用示例",
    "clear": "清空",
    "download-formatted": "下载格式化 SQL"
  },
  "zh-CN": {
    "import-from-file": "从文件导入",
    "use-sample": "使用示例",
    "clear": "清空",
    "download-formatted": "下载格式化 SQL"
  },
  "zh-TW": {
    "import-from-file": "從檔案匯入",
    "use-sample": "使用範例",
    "clear": "清除",
    "download-formatted": "下載格式化 SQL"
  },
  "zh-HK": {
    "import-from-file": "從檔案匯入",
    "use-sample": "使用範例",
    "clear": "清除",
    "download-formatted": "下載格式化 SQL"
  },
  "es": {
    "import-from-file": "Importar desde archivo",
    "use-sample": "Usar ejemplo",
    "clear": "Limpiar",
    "download-formatted": "Descargar SQL formateado"
  },
  "fr": {
    "import-from-file": "Importer depuis un fichier",
    "use-sample": "Utiliser un exemple",
    "clear": "Effacer",
    "download-formatted": "Télécharger le SQL formaté"
  },
  "de": {
    "import-from-file": "Aus Datei importieren",
    "use-sample": "Beispiel verwenden",
    "clear": "Leeren",
    "download-formatted": "Formatiertes SQL herunterladen"
  },
  "it": {
    "import-from-file": "Importa da file",
    "use-sample": "Usa esempio",
    "clear": "Pulisci",
    "download-formatted": "Scarica SQL formattato"
  },
  "ja": {
    "import-from-file": "ファイルから読み込む",
    "use-sample": "サンプルを使う",
    "clear": "クリア",
    "download-formatted": "整形済み SQL をダウンロード"
  },
  "ko": {
    "import-from-file": "파일에서 가져오기",
    "use-sample": "샘플 사용",
    "clear": "지우기",
    "download-formatted": "포맷된 SQL 다운로드"
  },
  "ru": {
    "import-from-file": "Импорт из файла",
    "use-sample": "Использовать пример",
    "clear": "Очистить",
    "download-formatted": "Скачать форматированный SQL"
  },
  "pt": {
    "import-from-file": "Importar de arquivo",
    "use-sample": "Usar exemplo",
    "clear": "Limpar",
    "download-formatted": "Baixar SQL formatado"
  },
  "ar": {
    "import-from-file": "استيراد من ملف",
    "use-sample": "استخدام مثال",
    "clear": "مسح",
    "download-formatted": "تنزيل SQL المنسق"
  },
  "hi": {
    "import-from-file": "फ़ाइल से आयात करें",
    "use-sample": "नमूना उपयोग करें",
    "clear": "साफ़ करें",
    "download-formatted": "फॉर्मेट किया हुआ SQL डाउनलोड करें"
  },
  "tr": {
    "import-from-file": "Dosyadan içe aktar",
    "use-sample": "Örneği kullan",
    "clear": "Temizle",
    "download-formatted": "Biçimlendirilmiş SQL indir"
  },
  "nl": {
    "import-from-file": "Importeren uit bestand",
    "use-sample": "Voorbeeld gebruiken",
    "clear": "Wissen",
    "download-formatted": "Geformatteerde SQL downloaden"
  },
  "sv": {
    "import-from-file": "Importera från fil",
    "use-sample": "Använd exempel",
    "clear": "Rensa",
    "download-formatted": "Ladda ner formaterad SQL"
  },
  "pl": {
    "import-from-file": "Importuj z pliku",
    "use-sample": "Użyj przykładu",
    "clear": "Wyczyść",
    "download-formatted": "Pobierz sformatowany SQL"
  },
  "vi": {
    "import-from-file": "Nhập từ tệp",
    "use-sample": "Dùng mẫu",
    "clear": "Xóa",
    "download-formatted": "Tải xuống SQL đã định dạng"
  },
  "th": {
    "import-from-file": "นำเข้าจากไฟล์",
    "use-sample": "ใช้ตัวอย่าง",
    "clear": "ล้าง",
    "download-formatted": "ดาวน์โหลด SQL ที่จัดรูปแบบแล้ว"
  },
  "id": {
    "import-from-file": "Impor dari file",
    "use-sample": "Gunakan contoh",
    "clear": "Bersihkan",
    "download-formatted": "Unduh SQL terformat"
  },
  "he": {
    "import-from-file": "ייבוא מקובץ",
    "use-sample": "השתמש בדוגמה",
    "clear": "נקה",
    "download-formatted": "הורד SQL מעוצב"
  },
  "ms": {
    "import-from-file": "Import daripada fail",
    "use-sample": "Guna contoh",
    "clear": "Kosongkan",
    "download-formatted": "Muat turun SQL berformat"
  },
  "no": {
    "import-from-file": "Importer fra fil",
    "use-sample": "Bruk eksempel",
    "clear": "Tøm",
    "download-formatted": "Last ned formatert SQL"
  }
}
</i18n>
