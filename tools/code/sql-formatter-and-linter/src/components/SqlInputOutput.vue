<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :show-feedback="false" label-style="width: 100%">
      <template #label>
        <n-flex align="center" justify="space-between" :wrap="false" style="width: 100%">
          <span>{{ t('source-sql') }}</span>
          <n-flex :size="8" :wrap="true">
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
        </n-flex>
      </template>
      <n-input
        v-model:value="sourceSql"
        type="textarea"
        :autosize="{ minRows: 12, maxRows: 26 }"
        :placeholder="t('input-placeholder')"
      />
    </n-form-item-gi>

    <n-form-item-gi :show-feedback="false" label-style="width: 100%">
      <template #label>
        <n-flex align="center" justify="space-between" :wrap="false" style="width: 100%">
          <span>{{ t('formatted-sql') }}</span>
          <n-flex :size="8" :wrap="true">
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
      <n-alert v-if="formatError" type="error" :bordered="false">{{ formatError }}</n-alert>
      <n-card v-else size="small">
        <n-code v-if="formattedSql" :code="formattedSql" language="sql" :hljs="hljs" word-wrap />
        <n-text v-else depth="3">{{ t('output-empty') }}</n-text>
      </n-card>
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
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
  NInput,
  NText,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import ClipboardPaste16Regular from '@vicons/fluent/ClipboardPaste16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import hljs from 'highlight.js/lib/core'
import sql from 'highlight.js/lib/languages/sql'

defineProps<{
  formattedSql: string
  formatError: string
  downloadUrl: string | null
  downloadFilename: string
}>()

defineEmits<{
  import: []
  sample: []
  clear: []
}>()

const sourceSql = defineModel<string>('sourceSql', { required: true })

hljs.registerLanguage('sql', sql)

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here.",
    "import-from-file": "Import from file",
    "use-sample": "Use sample",
    "clear": "Clear",
    "download-formatted": "Download formatted SQL"
  },
  "zh": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此粘贴 SQL，支持多语句。",
    "output-empty": "格式化后的 SQL 将显示在这里。",
    "import-from-file": "从文件导入",
    "use-sample": "使用示例",
    "clear": "清空",
    "download-formatted": "下载格式化 SQL"
  },
  "zh-CN": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此粘贴 SQL，支持多语句。",
    "output-empty": "格式化后的 SQL 将显示在这里。",
    "import-from-file": "从文件导入",
    "use-sample": "使用示例",
    "clear": "清空",
    "download-formatted": "下载格式化 SQL"
  },
  "zh-TW": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此貼上 SQL，支援多語句。",
    "output-empty": "格式化後的 SQL 會顯示在這裡。",
    "import-from-file": "從檔案匯入",
    "use-sample": "使用範例",
    "clear": "清除",
    "download-formatted": "下載格式化 SQL"
  },
  "zh-HK": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此貼上 SQL，支援多語句。",
    "output-empty": "格式化後的 SQL 會顯示在這裡。",
    "import-from-file": "從檔案匯入",
    "use-sample": "使用範例",
    "clear": "清除",
    "download-formatted": "下載格式化 SQL"
  },
  "es": {
    "source-sql": "SQL de origen",
    "formatted-sql": "SQL formateado",
    "input-placeholder": "Pega SQL aquí; se admiten múltiples sentencias.",
    "output-empty": "El SQL formateado aparecerá aquí.",
    "import-from-file": "Importar desde archivo",
    "use-sample": "Usar ejemplo",
    "clear": "Limpiar",
    "download-formatted": "Descargar SQL formateado"
  },
  "fr": {
    "source-sql": "SQL source",
    "formatted-sql": "SQL formaté",
    "input-placeholder": "Collez du SQL ici ; plusieurs requêtes sont prises en charge.",
    "output-empty": "Le SQL formaté s’affichera ici.",
    "import-from-file": "Importer depuis un fichier",
    "use-sample": "Utiliser un exemple",
    "clear": "Effacer",
    "download-formatted": "Télécharger le SQL formaté"
  },
  "de": {
    "source-sql": "Quell-SQL",
    "formatted-sql": "Formatiertes SQL",
    "input-placeholder": "SQL hier einfügen; mehrere Anweisungen werden unterstützt.",
    "output-empty": "Formatiertes SQL erscheint hier.",
    "import-from-file": "Aus Datei importieren",
    "use-sample": "Beispiel verwenden",
    "clear": "Leeren",
    "download-formatted": "Formatiertes SQL herunterladen"
  },
  "it": {
    "source-sql": "SQL sorgente",
    "formatted-sql": "SQL formattato",
    "input-placeholder": "Incolla SQL qui; sono supportate più istruzioni.",
    "output-empty": "L’SQL formattato apparirà qui.",
    "import-from-file": "Importa da file",
    "use-sample": "Usa esempio",
    "clear": "Pulisci",
    "download-formatted": "Scarica SQL formattato"
  },
  "ja": {
    "source-sql": "元の SQL",
    "formatted-sql": "整形済み SQL",
    "input-placeholder": "ここに SQL を貼り付けてください。複数文に対応します。",
    "output-empty": "整形後の SQL がここに表示されます。",
    "import-from-file": "ファイルから読み込む",
    "use-sample": "サンプルを使う",
    "clear": "クリア",
    "download-formatted": "整形済み SQL をダウンロード"
  },
  "ko": {
    "source-sql": "원본 SQL",
    "formatted-sql": "포맷된 SQL",
    "input-placeholder": "SQL을 여기에 붙여 넣으세요. 여러 문장을 지원합니다.",
    "output-empty": "포맷된 SQL이 여기에 표시됩니다.",
    "import-from-file": "파일에서 가져오기",
    "use-sample": "샘플 사용",
    "clear": "지우기",
    "download-formatted": "포맷된 SQL 다운로드"
  },
  "ru": {
    "source-sql": "Исходный SQL",
    "formatted-sql": "Форматированный SQL",
    "input-placeholder": "Вставьте SQL сюда; поддерживаются несколько выражений.",
    "output-empty": "Здесь появится форматированный SQL.",
    "import-from-file": "Импорт из файла",
    "use-sample": "Использовать пример",
    "clear": "Очистить",
    "download-formatted": "Скачать форматированный SQL"
  },
  "pt": {
    "source-sql": "SQL de origem",
    "formatted-sql": "SQL formatado",
    "input-placeholder": "Cole SQL aqui; múltiplas instruções são suportadas.",
    "output-empty": "O SQL formatado aparecerá aqui.",
    "import-from-file": "Importar de arquivo",
    "use-sample": "Usar exemplo",
    "clear": "Limpar",
    "download-formatted": "Baixar SQL formatado"
  },
  "ar": {
    "source-sql": "SQL المصدر",
    "formatted-sql": "SQL المنسق",
    "input-placeholder": "الصق SQL هنا؛ يتم دعم عبارات متعددة.",
    "output-empty": "سيظهر SQL المنسق هنا.",
    "import-from-file": "استيراد من ملف",
    "use-sample": "استخدام مثال",
    "clear": "مسح",
    "download-formatted": "تنزيل SQL المنسق"
  },
  "hi": {
    "source-sql": "स्रोत SQL",
    "formatted-sql": "फॉर्मेट किया हुआ SQL",
    "input-placeholder": "यहाँ SQL पेस्ट करें; कई स्टेटमेंट समर्थित हैं।",
    "output-empty": "फॉर्मेट किया हुआ SQL यहाँ दिखेगा।",
    "import-from-file": "फ़ाइल से आयात करें",
    "use-sample": "नमूना उपयोग करें",
    "clear": "साफ़ करें",
    "download-formatted": "फॉर्मेट किया हुआ SQL डाउनलोड करें"
  },
  "tr": {
    "source-sql": "Kaynak SQL",
    "formatted-sql": "Biçimlendirilmiş SQL",
    "input-placeholder": "SQL’i buraya yapıştırın; birden çok ifade desteklenir.",
    "output-empty": "Biçimlendirilmiş SQL burada görünür.",
    "import-from-file": "Dosyadan içe aktar",
    "use-sample": "Örneği kullan",
    "clear": "Temizle",
    "download-formatted": "Biçimlendirilmiş SQL indir"
  },
  "nl": {
    "source-sql": "Bron-SQL",
    "formatted-sql": "Geformatteerde SQL",
    "input-placeholder": "Plak hier SQL; meerdere statements worden ondersteund.",
    "output-empty": "Geformatteerde SQL verschijnt hier.",
    "import-from-file": "Importeren uit bestand",
    "use-sample": "Voorbeeld gebruiken",
    "clear": "Wissen",
    "download-formatted": "Geformatteerde SQL downloaden"
  },
  "sv": {
    "source-sql": "Käll-SQL",
    "formatted-sql": "Formaterad SQL",
    "input-placeholder": "Klistra in SQL här; flera satser stöds.",
    "output-empty": "Formaterad SQL visas här.",
    "import-from-file": "Importera från fil",
    "use-sample": "Använd exempel",
    "clear": "Rensa",
    "download-formatted": "Ladda ner formaterad SQL"
  },
  "pl": {
    "source-sql": "Źródłowy SQL",
    "formatted-sql": "Sformatowany SQL",
    "input-placeholder": "Wklej tutaj SQL; obsługiwanych jest wiele instrukcji.",
    "output-empty": "Sformatowany SQL pojawi się tutaj.",
    "import-from-file": "Importuj z pliku",
    "use-sample": "Użyj przykładu",
    "clear": "Wyczyść",
    "download-formatted": "Pobierz sformatowany SQL"
  },
  "vi": {
    "source-sql": "SQL nguồn",
    "formatted-sql": "SQL đã định dạng",
    "input-placeholder": "Dán SQL vào đây; hỗ trợ nhiều câu lệnh.",
    "output-empty": "SQL đã định dạng sẽ hiển thị tại đây.",
    "import-from-file": "Nhập từ tệp",
    "use-sample": "Dùng mẫu",
    "clear": "Xóa",
    "download-formatted": "Tải xuống SQL đã định dạng"
  },
  "th": {
    "source-sql": "SQL ต้นฉบับ",
    "formatted-sql": "SQL ที่จัดรูปแบบแล้ว",
    "input-placeholder": "วาง SQL ที่นี่ รองรับหลายคำสั่ง",
    "output-empty": "SQL ที่จัดรูปแบบแล้วจะแสดงที่นี่",
    "import-from-file": "นำเข้าจากไฟล์",
    "use-sample": "ใช้ตัวอย่าง",
    "clear": "ล้าง",
    "download-formatted": "ดาวน์โหลด SQL ที่จัดรูปแบบแล้ว"
  },
  "id": {
    "source-sql": "SQL sumber",
    "formatted-sql": "SQL terformat",
    "input-placeholder": "Tempel SQL di sini; beberapa pernyataan didukung.",
    "output-empty": "SQL terformat akan ditampilkan di sini.",
    "import-from-file": "Impor dari file",
    "use-sample": "Gunakan contoh",
    "clear": "Bersihkan",
    "download-formatted": "Unduh SQL terformat"
  },
  "he": {
    "source-sql": "SQL מקורי",
    "formatted-sql": "SQL מעוצב",
    "input-placeholder": "הדבק כאן SQL; נתמכות כמה פקודות.",
    "output-empty": "ה-SQL המעוצב יופיע כאן.",
    "import-from-file": "ייבוא מקובץ",
    "use-sample": "השתמש בדוגמה",
    "clear": "נקה",
    "download-formatted": "הורד SQL מעוצב"
  },
  "ms": {
    "source-sql": "SQL sumber",
    "formatted-sql": "SQL berformat",
    "input-placeholder": "Tampal SQL di sini; berbilang pernyataan disokong.",
    "output-empty": "SQL berformat akan dipaparkan di sini.",
    "import-from-file": "Import daripada fail",
    "use-sample": "Guna contoh",
    "clear": "Kosongkan",
    "download-formatted": "Muat turun SQL berformat"
  },
  "no": {
    "source-sql": "Kilde-SQL",
    "formatted-sql": "Formatert SQL",
    "input-placeholder": "Lim inn SQL her; flere setninger støttes.",
    "output-empty": "Formatert SQL vises her.",
    "import-from-file": "Importer fra fil",
    "use-sample": "Bruk eksempel",
    "clear": "Tøm",
    "download-formatted": "Last ned formatert SQL"
  }
}
</i18n>
