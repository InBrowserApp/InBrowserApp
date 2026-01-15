<template>
  <ToolSection>
    <n-flex align="center" :size="12">
      <n-flex align="center">
        <n-switch v-model:value="options.compact" size="small" />
        <span>{{ t('opt-compact') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.ignoreComment" size="small" />
        <span>{{ t('opt-ignore-comment') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.fullTagEmptyElement" size="small" />
        <span>{{ t('opt-full-tag') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-input-number
          v-model:value="spaces"
          :min="0"
          :max="8"
          size="small"
          style="width: 120px"
        />
        <span>{{ t('opt-spaces') }}</span>
      </n-flex>
    </n-flex>
  </ToolSection>

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
        <CopyToClipboardButton :content="renderedXml" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="converted.xml">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-xml') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('json')" :show-feedback="false">
        <n-input
          v-model:value="json"
          type="textarea"
          autosize
          :placeholder="t('json-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('xml')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="renderedXml" language="xml" :hljs="hljs" word-wrap></n-code>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import convert from 'xml-js'
import {
  NButton,
  NIcon,
  NCard,
  NFormItemGi,
  NGrid,
  NInput,
  NCode,
  NFlex,
  NSwitch,
  NInputNumber,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ArrowDownload16Regular, Document16Regular } from '@shared/icons/fluent'
import hljs from 'highlight.js/lib/core'
import xmlLang from 'highlight.js/lib/languages/xml'
import { fileOpen } from 'browser-fs-access'
import { Buffer } from 'buffer'

hljs.registerLanguage('xml', xmlLang)

declare global {
  interface Window {
    Buffer: typeof Buffer
  }
}

const { t } = useI18n()

const json = ref<string>(`{"name":{"_text":"Ali"},"age":{"_text":"30"}}`)
const spaces = ref<number>(2)

const options = reactive({
  compact: true,
  ignoreComment: false,
  fullTagEmptyElement: false,
})

const renderedXml = computed<string>(() => {
  try {
    window.Buffer = Buffer
    return convert.json2xml(json.value, { ...options, spaces: spaces.value })
  } catch (e) {
    console.error(e)
    return '<!-- ' + t('invalid-json') + ' -->'
  }
})

const downloadBlob = computed(
  () => new Blob([renderedXml.value], { type: 'application/xml;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.json', '.txt'],
  })
  json.value = await file.text()
}
</script>

<i18n lang="json">
{
  "en": {
    "json": "JSON",
    "json-placeholder": "Paste JSON here...",
    "xml": "XML",
    "download-xml": "Download XML",
    "import-from-file": "Import from file",
    "invalid-json": "Invalid JSON",
    "opt-compact": "Compact",
    "opt-ignore-comment": "Ignore comment",
    "opt-full-tag": "Full tag for empty elements",
    "opt-spaces": "Spaces"
  },
  "zh": {
    "json": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "xml": "XML",
    "download-xml": "下载 XML",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON",
    "opt-compact": "紧凑模式",
    "opt-ignore-comment": "忽略注释",
    "opt-full-tag": "空元素使用完整标签",
    "opt-spaces": "缩进空格"
  },
  "zh-CN": {
    "json": "JSON",
    "json-placeholder": "在此粘贴 JSON...",
    "xml": "XML",
    "download-xml": "下载 XML",
    "import-from-file": "从文件导入",
    "invalid-json": "无效的 JSON",
    "opt-compact": "紧凑模式",
    "opt-ignore-comment": "忽略注释",
    "opt-full-tag": "空元素使用完整标签",
    "opt-spaces": "缩进空格"
  },
  "zh-TW": {
    "json": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "xml": "XML",
    "download-xml": "下載 XML",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON",
    "opt-compact": "精簡模式",
    "opt-ignore-comment": "忽略註解",
    "opt-full-tag": "空元素使用完整標籤",
    "opt-spaces": "縮排空格"
  },
  "zh-HK": {
    "json": "JSON",
    "json-placeholder": "在此貼上 JSON...",
    "xml": "XML",
    "download-xml": "下載 XML",
    "import-from-file": "從檔案匯入",
    "invalid-json": "無效的 JSON",
    "opt-compact": "精簡模式",
    "opt-ignore-comment": "忽略註解",
    "opt-full-tag": "空元素使用完整標籤",
    "opt-spaces": "縮排空格"
  },
  "es": {
    "json": "JSON",
    "json-placeholder": "Pega JSON aquí...",
    "xml": "XML",
    "download-xml": "Descargar XML",
    "import-from-file": "Importar desde archivo",
    "invalid-json": "JSON no válido",
    "opt-compact": "Compacto",
    "opt-ignore-comment": "Ignorar comentarios",
    "opt-full-tag": "Etiqueta completa para vacíos",
    "opt-spaces": "Espacios"
  },
  "fr": {
    "json": "JSON",
    "json-placeholder": "Collez du JSON ici...",
    "xml": "XML",
    "download-xml": "Télécharger le XML",
    "import-from-file": "Importer depuis un fichier",
    "invalid-json": "JSON invalide",
    "opt-compact": "Compact",
    "opt-ignore-comment": "Ignorer les commentaires",
    "opt-full-tag": "Balise complète pour vides",
    "opt-spaces": "Espaces"
  },
  "de": {
    "json": "JSON",
    "json-placeholder": "JSON hier einfügen...",
    "xml": "XML",
    "download-xml": "XML herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-json": "Ungültiges JSON",
    "opt-compact": "Kompakt",
    "opt-ignore-comment": "Kommentare ignorieren",
    "opt-full-tag": "Vollständiges Tag für leere Elemente",
    "opt-spaces": "Leerzeichen"
  },
  "it": {
    "json": "JSON",
    "json-placeholder": "Incolla JSON qui...",
    "xml": "XML",
    "download-xml": "Scarica XML",
    "import-from-file": "Importa da file",
    "invalid-json": "JSON non valido",
    "opt-compact": "Compatto",
    "opt-ignore-comment": "Ignora commenti",
    "opt-full-tag": "Tag completo per elementi vuoti",
    "opt-spaces": "Spazi"
  },
  "ja": {
    "json": "JSON",
    "json-placeholder": "ここにJSONを貼り付け...",
    "xml": "XML",
    "download-xml": "XMLをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-json": "無効なJSON",
    "opt-compact": "コンパクト",
    "opt-ignore-comment": "コメントを無視",
    "opt-full-tag": "空要素をフルタグで",
    "opt-spaces": "スペース"
  },
  "ko": {
    "json": "JSON",
    "json-placeholder": "여기에 JSON 붙여넣기...",
    "xml": "XML",
    "download-xml": "XML 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-json": "유효하지 않은 JSON",
    "opt-compact": "컴팩트",
    "opt-ignore-comment": "주석 무시",
    "opt-full-tag": "빈 요소에 전체 태그",
    "opt-spaces": "공백"
  },
  "ru": {
    "json": "JSON",
    "json-placeholder": "Вставьте JSON здесь...",
    "xml": "XML",
    "download-xml": "Скачать XML",
    "import-from-file": "Импорт из файла",
    "invalid-json": "Недопустимый JSON",
    "opt-compact": "Компактный",
    "opt-ignore-comment": "Игнорировать комментарии",
    "opt-full-tag": "Полный тег для пустых",
    "opt-spaces": "Пробелы"
  },
  "pt": {
    "json": "JSON",
    "json-placeholder": "Cole JSON aqui...",
    "xml": "XML",
    "download-xml": "Baixar XML",
    "import-from-file": "Importar de arquivo",
    "invalid-json": "JSON inválido",
    "opt-compact": "Compacto",
    "opt-ignore-comment": "Ignorar comentários",
    "opt-full-tag": "Tag completa para vazios",
    "opt-spaces": "Espaços"
  },
  "ar": {
    "json": "JSON",
    "json-placeholder": "الصق JSON هنا...",
    "xml": "XML",
    "download-xml": "تنزيل XML",
    "import-from-file": "استيراد من ملف",
    "invalid-json": "JSON غير صالح",
    "opt-compact": "مضغوط",
    "opt-ignore-comment": "تجاهل التعليقات",
    "opt-full-tag": "وسم كامل للعناصر الفارغة",
    "opt-spaces": "مسافات"
  },
  "hi": {
    "json": "JSON",
    "json-placeholder": "यहाँ JSON पेस्ट करें...",
    "xml": "XML",
    "download-xml": "XML डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-json": "अमान्य JSON",
    "opt-compact": "कम्पैक्ट",
    "opt-ignore-comment": "टिप्पणियाँ अनदेखी",
    "opt-full-tag": "रिक्त तत्वों के लिए पूर्ण टैग",
    "opt-spaces": "स्पेसेज़"
  },
  "tr": {
    "json": "JSON",
    "json-placeholder": "Buraya JSON yapıştırın...",
    "xml": "XML",
    "download-xml": "XML İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-json": "Geçersiz JSON",
    "opt-compact": "Kompakt",
    "opt-ignore-comment": "Yorumları yok say",
    "opt-full-tag": "Boş ögeler için tam etiket",
    "opt-spaces": "Boşluk"
  },
  "nl": {
    "json": "JSON",
    "json-placeholder": "Plak hier JSON...",
    "xml": "XML",
    "download-xml": "XML downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-json": "Ongeldige JSON",
    "opt-compact": "Compact",
    "opt-ignore-comment": "Reacties negeren",
    "opt-full-tag": "Volledige tag voor lege elementen",
    "opt-spaces": "Spaties"
  },
  "sv": {
    "json": "JSON",
    "json-placeholder": "Klistra in JSON här...",
    "xml": "XML",
    "download-xml": "Ladda ner XML",
    "import-from-file": "Importera från fil",
    "invalid-json": "Ogiltig JSON",
    "opt-compact": "Kompakt",
    "opt-ignore-comment": "Ignorera kommentarer",
    "opt-full-tag": "Fullständig tagg för tomma",
    "opt-spaces": "Blanksteg"
  },
  "pl": {
    "json": "JSON",
    "json-placeholder": "Wklej JSON tutaj...",
    "xml": "XML",
    "download-xml": "Pobierz XML",
    "import-from-file": "Importuj z pliku",
    "invalid-json": "Nieprawidłowy JSON",
    "opt-compact": "Kompaktowy",
    "opt-ignore-comment": "Ignoruj komentarze",
    "opt-full-tag": "Pełny znacznik dla pustych elementów",
    "opt-spaces": "Spacje"
  },
  "vi": {
    "json": "JSON",
    "json-placeholder": "Dán JSON vào đây...",
    "xml": "XML",
    "download-xml": "Tải XML",
    "import-from-file": "Nhập từ tệp",
    "invalid-json": "JSON không hợp lệ",
    "opt-compact": "Gọn",
    "opt-ignore-comment": "Bỏ qua nhận xét",
    "opt-full-tag": "Thẻ đầy đủ cho phần tử rỗng",
    "opt-spaces": "Khoảng trắng"
  },
  "th": {
    "json": "JSON",
    "json-placeholder": "วาง JSON ที่นี่...",
    "xml": "XML",
    "download-xml": "ดาวน์โหลด XML",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-json": "JSON ไม่ถูกต้อง",
    "opt-compact": "กระชับ",
    "opt-ignore-comment": "ละเว้นความคิดเห็น",
    "opt-full-tag": "แท็กเต็มสำหรับองค์ประกอบว่าง",
    "opt-spaces": "ช่องว่าง"
  },
  "id": {
    "json": "JSON",
    "json-placeholder": "Tempel JSON di sini...",
    "xml": "XML",
    "download-xml": "Unduh XML",
    "import-from-file": "Impor dari file",
    "invalid-json": "JSON tidak valid",
    "opt-compact": "Ringkas",
    "opt-ignore-comment": "Abaikan komentar",
    "opt-full-tag": "Tag lengkap untuk elemen kosong",
    "opt-spaces": "Spasi"
  },
  "he": {
    "json": "JSON",
    "json-placeholder": "הדביקו JSON כאן...",
    "xml": "XML",
    "download-xml": "הורד XML",
    "import-from-file": "יבוא מקובץ",
    "invalid-json": "JSON לא תקין",
    "opt-compact": "קומפקטי",
    "opt-ignore-comment": "התעלם מהערות",
    "opt-full-tag": "תג מלא לאלמנטים ריקים",
    "opt-spaces": "רווחים"
  },
  "ms": {
    "json": "JSON",
    "json-placeholder": "Tampal JSON di sini...",
    "xml": "XML",
    "download-xml": "Muat turun XML",
    "import-from-file": "Import dari fail",
    "invalid-json": "JSON tidak sah",
    "opt-compact": "Padat",
    "opt-ignore-comment": "Abaikan komen",
    "opt-full-tag": "Tag penuh untuk elemen kosong",
    "opt-spaces": "Ruang"
  },
  "no": {
    "json": "JSON",
    "json-placeholder": "Lim inn JSON her...",
    "xml": "XML",
    "download-xml": "Last ned XML",
    "import-from-file": "Importer fra fil",
    "invalid-json": "Ugyldig JSON",
    "opt-compact": "Kompakt",
    "opt-ignore-comment": "Ignorer kommentarer",
    "opt-full-tag": "Full tagg for tomme elementer",
    "opt-spaces": "Mellomrom"
  }
}
</i18n>
