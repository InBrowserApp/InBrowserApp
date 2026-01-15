<template>
  <ToolSection>
    <n-flex align="center" :size="12">
      <n-flex align="center">
        <n-switch v-model:value="options.compact" size="small" />
        <span>{{ t('opt-compact') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.ignoreDeclaration" size="small" />
        <span>{{ t('opt-ignore-declaration') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.ignoreInstruction" size="small" />
        <span>{{ t('opt-ignore-instruction') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.ignoreAttributes" size="small" />
        <span>{{ t('opt-ignore-attributes') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.ignoreText" size="small" />
        <span>{{ t('opt-ignore-text') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.ignoreCdata" size="small" />
        <span>{{ t('opt-ignore-cdata') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.ignoreDoctype" size="small" />
        <span>{{ t('opt-ignore-doctype') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.ignoreComment" size="small" />
        <span>{{ t('opt-ignore-comment') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.trim" size="small" />
        <span>{{ t('opt-trim') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.nativeType" size="small" />
        <span>{{ t('opt-native-type') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.alwaysArray" size="small" :disabled="!options.compact" />
        <span :class="{ [$style.disabled]: !options.compact }">{{ t('opt-always-array') }}</span>
      </n-flex>
      <n-flex align="center">
        <n-switch v-model:value="options.alwaysChildren" size="small" :disabled="options.compact" />
        <span :class="{ [$style.disabled]: options.compact }">{{ t('opt-always-children') }}</span>
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
      <n-form-item-gi :label="t('xml')" :show-feedback="false">
        <n-input v-model:value="xml" type="textarea" autosize :placeholder="t('xml-placeholder')" />
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
import jsonLang from 'highlight.js/lib/languages/json'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('json', jsonLang)

const { t } = useI18n()

const xml = ref<string>(
  `<?xml version="1.0" encoding="utf-8"?>\n<note importance="high" logged="true">\n  <title>Happy</title>\n  <todo>Work</todo>\n  <todo>Play</todo>\n</note>`,
)
const spaces = ref<number>(2)

const options = reactive({
  compact: true,
  ignoreDeclaration: false,
  ignoreInstruction: false,
  ignoreAttributes: false,
  ignoreText: false,
  ignoreCdata: false,
  ignoreDoctype: false,
  ignoreComment: false,
  trim: false,
  nativeType: false,
  alwaysArray: false,
  alwaysChildren: false,
})

const renderedJson = computed<string>(() => {
  try {
    return convert.xml2json(xml.value, { ...options, spaces: spaces.value })
  } catch {
    return '// ' + t('invalid-xml')
  }
})

const downloadBlob = computed(
  () => new Blob([renderedJson.value], { type: 'application/json;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.xml', '.txt'],
  })
  xml.value = await file.text()
}
</script>

<style module>
.disabled {
  color: rgba(0, 0, 0, 0.38);
}
</style>

<i18n lang="json">
{
  "en": {
    "xml": "XML",
    "xml-placeholder": "Paste XML here...",
    "json": "JSON",
    "download-json": "Download JSON",
    "import-from-file": "Import from file",
    "invalid-xml": "Invalid XML",
    "opt-compact": "Compact",
    "opt-ignore-declaration": "Ignore declaration",
    "opt-ignore-instruction": "Ignore instruction",
    "opt-ignore-attributes": "Ignore attributes",
    "opt-ignore-text": "Ignore text",
    "opt-ignore-cdata": "Ignore CDATA",
    "opt-ignore-doctype": "Ignore DOCTYPE",
    "opt-ignore-comment": "Ignore comment",
    "opt-trim": "Trim text",
    "opt-native-type": "Native types",
    "opt-always-array": "Always array (compact)",
    "opt-always-children": "Always children (non-compact)",
    "opt-spaces": "Spaces"
  },
  "zh": {
    "xml": "XML",
    "xml-placeholder": "在此粘贴 XML...",
    "json": "JSON",
    "download-json": "下载 JSON",
    "import-from-file": "从文件导入",
    "invalid-xml": "无效的 XML",
    "opt-compact": "紧凑模式",
    "opt-ignore-declaration": "忽略声明",
    "opt-ignore-instruction": "忽略处理指令",
    "opt-ignore-attributes": "忽略属性",
    "opt-ignore-text": "忽略文本",
    "opt-ignore-cdata": "忽略 CDATA",
    "opt-ignore-doctype": "忽略 DOCTYPE",
    "opt-ignore-comment": "忽略注释",
    "opt-trim": "裁剪文本",
    "opt-native-type": "原生类型",
    "opt-always-array": "总为数组（紧凑）",
    "opt-always-children": "总含子元素（非紧凑）",
    "opt-spaces": "缩进空格"
  },
  "zh-CN": {
    "xml": "XML",
    "xml-placeholder": "在此粘贴 XML...",
    "json": "JSON",
    "download-json": "下载 JSON",
    "import-from-file": "从文件导入",
    "invalid-xml": "无效的 XML",
    "opt-compact": "紧凑模式",
    "opt-ignore-declaration": "忽略声明",
    "opt-ignore-instruction": "忽略处理指令",
    "opt-ignore-attributes": "忽略属性",
    "opt-ignore-text": "忽略文本",
    "opt-ignore-cdata": "忽略 CDATA",
    "opt-ignore-doctype": "忽略 DOCTYPE",
    "opt-ignore-comment": "忽略注释",
    "opt-trim": "裁剪文本",
    "opt-native-type": "原生类型",
    "opt-always-array": "总为数组（紧凑）",
    "opt-always-children": "总含子元素（非紧凑）",
    "opt-spaces": "缩进空格"
  },
  "zh-TW": {
    "xml": "XML",
    "xml-placeholder": "在此貼上 XML...",
    "json": "JSON",
    "download-json": "下載 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-xml": "無效的 XML",
    "opt-compact": "精簡模式",
    "opt-ignore-declaration": "忽略宣告",
    "opt-ignore-instruction": "忽略處理指令",
    "opt-ignore-attributes": "忽略屬性",
    "opt-ignore-text": "忽略文字",
    "opt-ignore-cdata": "忽略 CDATA",
    "opt-ignore-doctype": "忽略 DOCTYPE",
    "opt-ignore-comment": "忽略註解",
    "opt-trim": "裁剪文字",
    "opt-native-type": "原生型別",
    "opt-always-array": "一律陣列（精簡）",
    "opt-always-children": "一律含子元素（非精簡）",
    "opt-spaces": "縮排空格"
  },
  "zh-HK": {
    "xml": "XML",
    "xml-placeholder": "在此貼上 XML...",
    "json": "JSON",
    "download-json": "下載 JSON",
    "import-from-file": "從檔案匯入",
    "invalid-xml": "無效的 XML",
    "opt-compact": "精簡模式",
    "opt-ignore-declaration": "忽略宣告",
    "opt-ignore-instruction": "忽略處理指令",
    "opt-ignore-attributes": "忽略屬性",
    "opt-ignore-text": "忽略文字",
    "opt-ignore-cdata": "忽略 CDATA",
    "opt-ignore-doctype": "忽略 DOCTYPE",
    "opt-ignore-comment": "忽略註解",
    "opt-trim": "裁剪文字",
    "opt-native-type": "原生型別",
    "opt-always-array": "一律陣列（精簡）",
    "opt-always-children": "一律含子元素（非精簡）",
    "opt-spaces": "縮排空格"
  },
  "es": {
    "xml": "XML",
    "xml-placeholder": "Pega XML aquí...",
    "json": "JSON",
    "download-json": "Descargar JSON",
    "import-from-file": "Importar desde archivo",
    "invalid-xml": "XML no válido",
    "opt-compact": "Compacto",
    "opt-ignore-declaration": "Ignorar declaración",
    "opt-ignore-instruction": "Ignorar instrucción",
    "opt-ignore-attributes": "Ignorar atributos",
    "opt-ignore-text": "Ignorar texto",
    "opt-ignore-cdata": "Ignorar CDATA",
    "opt-ignore-doctype": "Ignorar DOCTYPE",
    "opt-ignore-comment": "Ignorar comentarios",
    "opt-trim": "Recortar texto",
    "opt-native-type": "Tipos nativos",
    "opt-always-array": "Siempre arreglo (compacto)",
    "opt-always-children": "Siempre hijos (no compacto)",
    "opt-spaces": "Espacios"
  },
  "fr": {
    "xml": "XML",
    "xml-placeholder": "Collez du XML ici...",
    "json": "JSON",
    "download-json": "Télécharger le JSON",
    "import-from-file": "Importer depuis un fichier",
    "invalid-xml": "XML invalide",
    "opt-compact": "Compact",
    "opt-ignore-declaration": "Ignorer la déclaration",
    "opt-ignore-instruction": "Ignorer l'instruction",
    "opt-ignore-attributes": "Ignorer les attributs",
    "opt-ignore-text": "Ignorer le texte",
    "opt-ignore-cdata": "Ignorer CDATA",
    "opt-ignore-doctype": "Ignorer DOCTYPE",
    "opt-ignore-comment": "Ignorer les commentaires",
    "opt-trim": "Rogner le texte",
    "opt-native-type": "Types natifs",
    "opt-always-array": "Toujours tableau (compact)",
    "opt-always-children": "Toujours enfants (non compact)",
    "opt-spaces": "Espaces"
  },
  "de": {
    "xml": "XML",
    "xml-placeholder": "XML hier einfügen...",
    "json": "JSON",
    "download-json": "JSON herunterladen",
    "import-from-file": "Aus Datei importieren",
    "invalid-xml": "Ungültiges XML",
    "opt-compact": "Kompakt",
    "opt-ignore-declaration": "Deklaration ignorieren",
    "opt-ignore-instruction": "Anweisung ignorieren",
    "opt-ignore-attributes": "Attribute ignorieren",
    "opt-ignore-text": "Text ignorieren",
    "opt-ignore-cdata": "CDATA ignorieren",
    "opt-ignore-doctype": "DOCTYPE ignorieren",
    "opt-ignore-comment": "Kommentare ignorieren",
    "opt-trim": "Text kürzen",
    "opt-native-type": "Native Typen",
    "opt-always-array": "Immer Array (kompakt)",
    "opt-always-children": "Immer Kinder (nicht kompakt)",
    "opt-spaces": "Leerzeichen"
  },
  "it": {
    "xml": "XML",
    "xml-placeholder": "Incolla XML qui...",
    "json": "JSON",
    "download-json": "Scarica JSON",
    "import-from-file": "Importa da file",
    "invalid-xml": "XML non valido",
    "opt-compact": "Compatto",
    "opt-ignore-declaration": "Ignora dichiarazione",
    "opt-ignore-instruction": "Ignora istruzione",
    "opt-ignore-attributes": "Ignora attributi",
    "opt-ignore-text": "Ignora testo",
    "opt-ignore-cdata": "Ignora CDATA",
    "opt-ignore-doctype": "Ignora DOCTYPE",
    "opt-ignore-comment": "Ignora commenti",
    "opt-trim": "Taglia testo",
    "opt-native-type": "Tipi nativi",
    "opt-always-array": "Sempre array (compatto)",
    "opt-always-children": "Sempre figli (non compatto)",
    "opt-spaces": "Spazi"
  },
  "ja": {
    "xml": "XML",
    "xml-placeholder": "ここにXMLを貼り付け...",
    "json": "JSON",
    "download-json": "JSONをダウンロード",
    "import-from-file": "ファイルからインポート",
    "invalid-xml": "無効なXML",
    "opt-compact": "コンパクト",
    "opt-ignore-declaration": "宣言を無視",
    "opt-ignore-instruction": "命令を無視",
    "opt-ignore-attributes": "属性を無視",
    "opt-ignore-text": "テキストを無視",
    "opt-ignore-cdata": "CDATAを無視",
    "opt-ignore-doctype": "DOCTYPEを無視",
    "opt-ignore-comment": "コメントを無視",
    "opt-trim": "テキストのトリム",
    "opt-native-type": "ネイティブ型",
    "opt-always-array": "常に配列（コンパクト）",
    "opt-always-children": "常に子要素（非コンパクト）",
    "opt-spaces": "スペース"
  },
  "ko": {
    "xml": "XML",
    "xml-placeholder": "여기에 XML 붙여넣기...",
    "json": "JSON",
    "download-json": "JSON 다운로드",
    "import-from-file": "파일에서 가져오기",
    "invalid-xml": "유효하지 않은 XML",
    "opt-compact": "컴팩트",
    "opt-ignore-declaration": "선언 무시",
    "opt-ignore-instruction": "지시문 무시",
    "opt-ignore-attributes": "속성 무시",
    "opt-ignore-text": "텍스트 무시",
    "opt-ignore-cdata": "CDATA 무시",
    "opt-ignore-doctype": "DOCTYPE 무시",
    "opt-ignore-comment": "주석 무시",
    "opt-trim": "텍스트 다듬기",
    "opt-native-type": "네이티브 타입",
    "opt-always-array": "항상 배열(컴팩트)",
    "opt-always-children": "항상 자식(비컴팩트)",
    "opt-spaces": "공백"
  },
  "ru": {
    "xml": "XML",
    "xml-placeholder": "Вставьте XML здесь...",
    "json": "JSON",
    "download-json": "Скачать JSON",
    "import-from-file": "Импорт из файла",
    "invalid-xml": "Недопустимый XML",
    "opt-compact": "Компактный",
    "opt-ignore-declaration": "Игнорировать декларацию",
    "opt-ignore-instruction": "Игнорировать инструкцию",
    "opt-ignore-attributes": "Игнорировать атрибуты",
    "opt-ignore-text": "Игнорировать текст",
    "opt-ignore-cdata": "Игнорировать CDATA",
    "opt-ignore-doctype": "Игнорировать DOCTYPE",
    "opt-ignore-comment": "Игнорировать комментарии",
    "opt-trim": "Обрезать текст",
    "opt-native-type": "Нативные типы",
    "opt-always-array": "Всегда массив (компакт)",
    "opt-always-children": "Всегда дети (некомпакт)",
    "opt-spaces": "Пробелы"
  },
  "pt": {
    "xml": "XML",
    "xml-placeholder": "Cole XML aqui...",
    "json": "JSON",
    "download-json": "Baixar JSON",
    "import-from-file": "Importar de arquivo",
    "invalid-xml": "XML inválido",
    "opt-compact": "Compacto",
    "opt-ignore-declaration": "Ignorar declaração",
    "opt-ignore-instruction": "Ignorar instrução",
    "opt-ignore-attributes": "Ignorar atributos",
    "opt-ignore-text": "Ignorar texto",
    "opt-ignore-cdata": "Ignorar CDATA",
    "opt-ignore-doctype": "Ignorar DOCTYPE",
    "opt-ignore-comment": "Ignorar comentários",
    "opt-trim": "Aparar texto",
    "opt-native-type": "Tipos nativos",
    "opt-always-array": "Sempre array (compacto)",
    "opt-always-children": "Sempre filhos (não compacto)",
    "opt-spaces": "Espaços"
  },
  "ar": {
    "xml": "XML",
    "xml-placeholder": "الصق XML هنا...",
    "json": "JSON",
    "download-json": "تنزيل JSON",
    "import-from-file": "استيراد من ملف",
    "invalid-xml": "XML غير صالح",
    "opt-compact": "مضغوط",
    "opt-ignore-declaration": "تجاهل التصريح",
    "opt-ignore-instruction": "تجاهل التعليمة",
    "opt-ignore-attributes": "تجاهل السمات",
    "opt-ignore-text": "تجاهل النص",
    "opt-ignore-cdata": "تجاهل CDATA",
    "opt-ignore-doctype": "تجاهل DOCTYPE",
    "opt-ignore-comment": "تجاهل التعليقات",
    "opt-trim": "اقتطاع النص",
    "opt-native-type": "أنواع أصلية",
    "opt-always-array": "دائماً مصفوفة (مضغوط)",
    "opt-always-children": "دائماً أبناء (غير مضغوط)",
    "opt-spaces": "مسافات"
  },
  "hi": {
    "xml": "XML",
    "xml-placeholder": "यहाँ XML पेस्ट करें...",
    "json": "JSON",
    "download-json": "JSON डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें",
    "invalid-xml": "अमान्य XML",
    "opt-compact": "कम्पैक्ट",
    "opt-ignore-declaration": "घोषणा अनदेखी",
    "opt-ignore-instruction": "निर्देश अनदेखी",
    "opt-ignore-attributes": "एट्रिब्यूट्स अनदेखी",
    "opt-ignore-text": "टेक्स्ट अनदेखी",
    "opt-ignore-cdata": "CDATA अनदेखी",
    "opt-ignore-doctype": "DOCTYPE अनदेखी",
    "opt-ignore-comment": "टिप्पणी अनदेखी",
    "opt-trim": "टेक्स्ट ट्रिम",
    "opt-native-type": "नेटिव प्रकार",
    "opt-always-array": "हमेशा एरे (कम्पैक्ट)",
    "opt-always-children": "हमेशा चाइल्ड्रन (नॉन-कम्पैक्ट)",
    "opt-spaces": "स्पेसेज़"
  },
  "tr": {
    "xml": "XML",
    "xml-placeholder": "Buraya XML yapıştırın...",
    "json": "JSON",
    "download-json": "JSON İndir",
    "import-from-file": "Dosyadan içe aktar",
    "invalid-xml": "Geçersiz XML",
    "opt-compact": "Kompakt",
    "opt-ignore-declaration": "Bildirimi yok say",
    "opt-ignore-instruction": "Talimatı yok say",
    "opt-ignore-attributes": "Öznitelikleri yok say",
    "opt-ignore-text": "Metni yok say",
    "opt-ignore-cdata": "CDATA'yı yok say",
    "opt-ignore-doctype": "DOCTYPE'u yok say",
    "opt-ignore-comment": "Yorumları yok say",
    "opt-trim": "Metni kırp",
    "opt-native-type": "Yerel türler",
    "opt-always-array": "Her zaman dizi (kompakt)",
    "opt-always-children": "Her zaman çocuklar (kompakt değil)",
    "opt-spaces": "Boşluk"
  },
  "nl": {
    "xml": "XML",
    "xml-placeholder": "Plak hier XML...",
    "json": "JSON",
    "download-json": "JSON downloaden",
    "import-from-file": "Importeren uit bestand",
    "invalid-xml": "Ongeldige XML",
    "opt-compact": "Compact",
    "opt-ignore-declaration": "Declaratie negeren",
    "opt-ignore-instruction": "Instructie negeren",
    "opt-ignore-attributes": "Attributen negeren",
    "opt-ignore-text": "Tekst negeren",
    "opt-ignore-cdata": "CDATA negeren",
    "opt-ignore-doctype": "DOCTYPE negeren",
    "opt-ignore-comment": "Reacties negeren",
    "opt-trim": "Tekst inkorten",
    "opt-native-type": "Natieve typen",
    "opt-always-array": "Altijd array (compact)",
    "opt-always-children": "Altijd children (niet-compact)",
    "opt-spaces": "Spaties"
  },
  "sv": {
    "xml": "XML",
    "xml-placeholder": "Klistra in XML här...",
    "json": "JSON",
    "download-json": "Ladda ner JSON",
    "import-from-file": "Importera från fil",
    "invalid-xml": "Ogiltig XML",
    "opt-compact": "Kompakt",
    "opt-ignore-declaration": "Ignorera deklaration",
    "opt-ignore-instruction": "Ignorera instruktion",
    "opt-ignore-attributes": "Ignorera attribut",
    "opt-ignore-text": "Ignorera text",
    "opt-ignore-cdata": "Ignorera CDATA",
    "opt-ignore-doctype": "Ignorera DOCTYPE",
    "opt-ignore-comment": "Ignorera kommentarer",
    "opt-trim": "Trimma text",
    "opt-native-type": "Inbyggda typer",
    "opt-always-array": "Alltid array (kompakt)",
    "opt-always-children": "Alltid barn (ej kompakt)",
    "opt-spaces": "Blanksteg"
  },
  "pl": {
    "xml": "XML",
    "xml-placeholder": "Wklej tutaj XML...",
    "json": "JSON",
    "download-json": "Pobierz JSON",
    "import-from-file": "Importuj z pliku",
    "invalid-xml": "Nieprawidłowy XML",
    "opt-compact": "Kompaktowy",
    "opt-ignore-declaration": "Ignoruj deklarację",
    "opt-ignore-instruction": "Ignoruj instrukcję",
    "opt-ignore-attributes": "Ignoruj atrybuty",
    "opt-ignore-text": "Ignoruj tekst",
    "opt-ignore-cdata": "Ignoruj CDATA",
    "opt-ignore-doctype": "Ignoruj DOCTYPE",
    "opt-ignore-comment": "Ignoruj komentarze",
    "opt-trim": "Przytnij tekst",
    "opt-native-type": "Typy natywne",
    "opt-always-array": "Zawsze tablica (kompakt)",
    "opt-always-children": "Zawsze dzieci (niekompakt)",
    "opt-spaces": "Spacje"
  },
  "vi": {
    "xml": "XML",
    "xml-placeholder": "Dán XML vào đây...",
    "json": "JSON",
    "download-json": "Tải JSON",
    "import-from-file": "Nhập từ tệp",
    "invalid-xml": "XML không hợp lệ",
    "opt-compact": "Gọn",
    "opt-ignore-declaration": "Bỏ qua khai báo",
    "opt-ignore-instruction": "Bỏ qua chỉ thị",
    "opt-ignore-attributes": "Bỏ qua thuộc tính",
    "opt-ignore-text": "Bỏ qua văn bản",
    "opt-ignore-cdata": "Bỏ qua CDATA",
    "opt-ignore-doctype": "Bỏ qua DOCTYPE",
    "opt-ignore-comment": "Bỏ qua nhận xét",
    "opt-trim": "Cắt gọn văn bản",
    "opt-native-type": "Kiểu nguyên bản",
    "opt-always-array": "Luôn mảng (gọn)",
    "opt-always-children": "Luôn có con (không gọn)",
    "opt-spaces": "Khoảng trắng"
  },
  "th": {
    "xml": "XML",
    "xml-placeholder": "วาง XML ที่นี่...",
    "json": "JSON",
    "download-json": "ดาวน์โหลด JSON",
    "import-from-file": "นำเข้าจากไฟล์",
    "invalid-xml": "XML ไม่ถูกต้อง",
    "opt-compact": "กระชับ",
    "opt-ignore-declaration": "ละเว้นประกาศ",
    "opt-ignore-instruction": "ละเว้นคำสั่ง",
    "opt-ignore-attributes": "ละเว้นแอตทริบิวต์",
    "opt-ignore-text": "ละเว้นข้อความ",
    "opt-ignore-cdata": "ละเว้น CDATA",
    "opt-ignore-doctype": "ละเว้น DOCTYPE",
    "opt-ignore-comment": "ละเว้นความคิดเห็น",
    "opt-trim": "ตัดแต่งข้อความ",
    "opt-native-type": "ชนิดเนทีฟ",
    "opt-always-array": "เป็นอาเรย์เสมอ (กระชับ)",
    "opt-always-children": "มีลูกเสมอ (ไม่กระชับ)",
    "opt-spaces": "ช่องว่าง"
  },
  "id": {
    "xml": "XML",
    "xml-placeholder": "Tempel XML di sini...",
    "json": "JSON",
    "download-json": "Unduh JSON",
    "import-from-file": "Impor dari file",
    "invalid-xml": "XML tidak valid",
    "opt-compact": "Ringkas",
    "opt-ignore-declaration": "Abaikan deklarasi",
    "opt-ignore-instruction": "Abaikan instruksi",
    "opt-ignore-attributes": "Abaikan atribut",
    "opt-ignore-text": "Abaikan teks",
    "opt-ignore-cdata": "Abaikan CDATA",
    "opt-ignore-doctype": "Abaikan DOCTYPE",
    "opt-ignore-comment": "Abaikan komentar",
    "opt-trim": "Pangkas teks",
    "opt-native-type": "Tipe native",
    "opt-always-array": "Selalu array (ringkas)",
    "opt-always-children": "Selalu anak (tidak ringkas)",
    "opt-spaces": "Spasi"
  },
  "he": {
    "xml": "XML",
    "xml-placeholder": "הדביקו XML כאן...",
    "json": "JSON",
    "download-json": "הורד JSON",
    "import-from-file": "יבוא מקובץ",
    "invalid-xml": "XML לא תקין",
    "opt-compact": "קומפקטי",
    "opt-ignore-declaration": "התעלם מהצהרה",
    "opt-ignore-instruction": "התעלם מהוראה",
    "opt-ignore-attributes": "התעלם ממאפיינים",
    "opt-ignore-text": "התעלם מטקסט",
    "opt-ignore-cdata": "התעלם מ‑CDATA",
    "opt-ignore-doctype": "התעלם מ‑DOCTYPE",
    "opt-ignore-comment": "התעלם מהערות",
    "opt-trim": "קיצוץ טקסט",
    "opt-native-type": "סוגים מקוריים",
    "opt-always-array": "תמיד מערך (קומפקטי)",
    "opt-always-children": "תמיד ילדים (לא קומפקטי)",
    "opt-spaces": "רווחים"
  },
  "ms": {
    "xml": "XML",
    "xml-placeholder": "Tampal XML di sini...",
    "json": "JSON",
    "download-json": "Muat turun JSON",
    "import-from-file": "Import dari fail",
    "invalid-xml": "XML tidak sah",
    "opt-compact": "Padat",
    "opt-ignore-declaration": "Abaikan deklarasi",
    "opt-ignore-instruction": "Abaikan arahan",
    "opt-ignore-attributes": "Abaikan atribut",
    "opt-ignore-text": "Abaikan teks",
    "opt-ignore-cdata": "Abaikan CDATA",
    "opt-ignore-doctype": "Abaikan DOCTYPE",
    "opt-ignore-comment": "Abaikan komen",
    "opt-trim": "Potong teks",
    "opt-native-type": "Jenis asli",
    "opt-always-array": "Sentiasa array (padat)",
    "opt-always-children": "Sentiasa anak (tidak padat)",
    "opt-spaces": "Ruang"
  },
  "no": {
    "xml": "XML",
    "xml-placeholder": "Lim inn XML her...",
    "json": "JSON",
    "download-json": "Last ned JSON",
    "import-from-file": "Importer fra fil",
    "invalid-xml": "Ugyldig XML",
    "opt-compact": "Kompakt",
    "opt-ignore-declaration": "Ignorer deklarasjon",
    "opt-ignore-instruction": "Ignorer instruksjon",
    "opt-ignore-attributes": "Ignorer attributter",
    "opt-ignore-text": "Ignorer tekst",
    "opt-ignore-cdata": "Ignorer CDATA",
    "opt-ignore-doctype": "Ignorer DOCTYPE",
    "opt-ignore-comment": "Ignorer kommentarer",
    "opt-trim": "Trim tekst",
    "opt-native-type": "Native typer",
    "opt-always-array": "Alltid array (kompakt)",
    "opt-always-children": "Alltid children (ikke-kompakt)",
    "opt-spaces": "Mellomrom"
  }
}
</i18n>
