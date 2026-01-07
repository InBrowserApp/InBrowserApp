<template>
  <ToolSection>
    <n-flex justify="space-between" align="center" style="margin-bottom: 8px">
      <span class="section-label">{{ t('input') }}</span>
      <n-button size="small" quaternary @click="inputText = ''">
        {{ t('clear') }}
      </n-button>
    </n-flex>
    <n-input
      v-model:value="inputText"
      type="textarea"
      :placeholder="t('inputPlaceholder')"
      :autosize="{ minRows: 3, maxRows: 8 }"
    />
  </ToolSection>

  <ToolSection>
    <n-flex :gap="24" :wrap="true">
      <n-form-item :label="t('separator')" :show-feedback="false">
        <n-radio-group v-model:value="separator">
          <n-radio-button value="-">- ({{ t('hyphen') }})</n-radio-button>
          <n-radio-button value="_">_ ({{ t('underscore') }})</n-radio-button>
          <n-radio-button value=".">. ({{ t('dot') }})</n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item :label="t('case')" :show-feedback="false">
        <n-radio-group v-model:value="caseOption">
          <n-radio-button value="lower">{{ t('lowercase') }}</n-radio-button>
          <n-radio-button value="preserve">{{ t('preserve') }}</n-radio-button>
        </n-radio-group>
      </n-form-item>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <n-flex justify="space-between" align="center" style="margin-bottom: 8px">
      <span class="section-label">{{ t('output') }}</span>
      <CopyToClipboardButton :content="slugOutput" />
    </n-flex>
    <n-card embedded :content-style="{ padding: '12px 16px' }">
      <n-text v-if="slugOutput" code>{{ slugOutput }}</n-text>
      <n-text v-else depth="3">{{ t('outputPlaceholder') }}</n-text>
    </n-card>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import {
  NInput,
  NButton,
  NFlex,
  NFormItem,
  NRadioGroup,
  NRadioButton,
  NCard,
  NText,
} from 'naive-ui'
import { slugify } from 'transliteration'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

const { t } = useI18n()

const inputText = useStorage('tools:slug-generator:input', 'Hello World Example')
const separator = useStorage<'-' | '_' | '.'>('tools:slug-generator:separator', '-')
const caseOption = useStorage<'lower' | 'preserve'>('tools:slug-generator:case', 'lower')

const slugOutput = computed(() => {
  if (!inputText.value.trim()) return ''

  return slugify(inputText.value, {
    separator: separator.value,
    lowercase: caseOption.value === 'lower',
    trim: true,
  })
})
</script>

<style scoped>
.section-label {
  font-weight: 500;
}
</style>

<i18n lang="json">
{
  "en": {
    "input": "Input Text",
    "inputPlaceholder": "Enter text to convert to slug...",
    "output": "Generated Slug",
    "outputPlaceholder": "Slug will appear here...",
    "separator": "Separator",
    "hyphen": "hyphen",
    "underscore": "underscore",
    "dot": "dot",
    "case": "Case",
    "lowercase": "Lowercase",
    "preserve": "Preserve",
    "clear": "Clear"
  },
  "zh": {
    "input": "输入文本",
    "inputPlaceholder": "输入要转换为 slug 的文本...",
    "output": "生成的 Slug",
    "outputPlaceholder": "Slug 将显示在这里...",
    "separator": "分隔符",
    "hyphen": "连字符",
    "underscore": "下划线",
    "dot": "点",
    "case": "大小写",
    "lowercase": "小写",
    "preserve": "保留原样",
    "clear": "清空"
  },
  "zh-CN": {
    "input": "输入文本",
    "inputPlaceholder": "输入要转换为 slug 的文本...",
    "output": "生成的 Slug",
    "outputPlaceholder": "Slug 将显示在这里...",
    "separator": "分隔符",
    "hyphen": "连字符",
    "underscore": "下划线",
    "dot": "点",
    "case": "大小写",
    "lowercase": "小写",
    "preserve": "保留原样",
    "clear": "清空"
  },
  "zh-TW": {
    "input": "輸入文字",
    "inputPlaceholder": "輸入要轉換為 slug 的文字...",
    "output": "產生的 Slug",
    "outputPlaceholder": "Slug 將顯示在這裡...",
    "separator": "分隔符",
    "hyphen": "連字符",
    "underscore": "底線",
    "dot": "點",
    "case": "大小寫",
    "lowercase": "小寫",
    "preserve": "保留原樣",
    "clear": "清除"
  },
  "zh-HK": {
    "input": "輸入文字",
    "inputPlaceholder": "輸入要轉換為 slug 的文字...",
    "output": "產生的 Slug",
    "outputPlaceholder": "Slug 將顯示在這裡...",
    "separator": "分隔符",
    "hyphen": "連字符",
    "underscore": "底線",
    "dot": "點",
    "case": "大小寫",
    "lowercase": "小寫",
    "preserve": "保留原樣",
    "clear": "清除"
  },
  "es": {
    "input": "Texto de entrada",
    "inputPlaceholder": "Ingrese texto para convertir a slug...",
    "output": "Slug generado",
    "outputPlaceholder": "El slug aparecerá aquí...",
    "separator": "Separador",
    "hyphen": "guion",
    "underscore": "guion bajo",
    "dot": "punto",
    "case": "Mayúsculas",
    "lowercase": "Minúsculas",
    "preserve": "Preservar",
    "clear": "Limpiar"
  },
  "fr": {
    "input": "Texte d'entrée",
    "inputPlaceholder": "Entrez le texte à convertir en slug...",
    "output": "Slug généré",
    "outputPlaceholder": "Le slug apparaîtra ici...",
    "separator": "Séparateur",
    "hyphen": "tiret",
    "underscore": "underscore",
    "dot": "point",
    "case": "Casse",
    "lowercase": "Minuscules",
    "preserve": "Préserver",
    "clear": "Effacer"
  },
  "de": {
    "input": "Eingabetext",
    "inputPlaceholder": "Text zur Umwandlung in Slug eingeben...",
    "output": "Generierter Slug",
    "outputPlaceholder": "Slug wird hier angezeigt...",
    "separator": "Trennzeichen",
    "hyphen": "Bindestrich",
    "underscore": "Unterstrich",
    "dot": "Punkt",
    "case": "Groß-/Kleinschreibung",
    "lowercase": "Kleinbuchstaben",
    "preserve": "Beibehalten",
    "clear": "Leeren"
  },
  "it": {
    "input": "Testo di input",
    "inputPlaceholder": "Inserisci il testo da convertire in slug...",
    "output": "Slug generato",
    "outputPlaceholder": "Lo slug apparirà qui...",
    "separator": "Separatore",
    "hyphen": "trattino",
    "underscore": "underscore",
    "dot": "punto",
    "case": "Maiuscole/minuscole",
    "lowercase": "Minuscolo",
    "preserve": "Mantieni",
    "clear": "Cancella"
  },
  "ja": {
    "input": "入力テキスト",
    "inputPlaceholder": "slugに変換するテキストを入力...",
    "output": "生成されたSlug",
    "outputPlaceholder": "Slugがここに表示されます...",
    "separator": "区切り文字",
    "hyphen": "ハイフン",
    "underscore": "アンダースコア",
    "dot": "ドット",
    "case": "大文字/小文字",
    "lowercase": "小文字",
    "preserve": "維持",
    "clear": "クリア"
  },
  "ko": {
    "input": "입력 텍스트",
    "inputPlaceholder": "slug로 변환할 텍스트를 입력하세요...",
    "output": "생성된 Slug",
    "outputPlaceholder": "Slug가 여기에 표시됩니다...",
    "separator": "구분자",
    "hyphen": "하이픈",
    "underscore": "밑줄",
    "dot": "점",
    "case": "대소문자",
    "lowercase": "소문자",
    "preserve": "유지",
    "clear": "지우기"
  },
  "ru": {
    "input": "Входной текст",
    "inputPlaceholder": "Введите текст для преобразования в slug...",
    "output": "Сгенерированный Slug",
    "outputPlaceholder": "Slug появится здесь...",
    "separator": "Разделитель",
    "hyphen": "дефис",
    "underscore": "подчёркивание",
    "dot": "точка",
    "case": "Регистр",
    "lowercase": "Нижний регистр",
    "preserve": "Сохранить",
    "clear": "Очистить"
  },
  "pt": {
    "input": "Texto de entrada",
    "inputPlaceholder": "Digite o texto para converter em slug...",
    "output": "Slug gerado",
    "outputPlaceholder": "O slug aparecerá aqui...",
    "separator": "Separador",
    "hyphen": "hífen",
    "underscore": "sublinhado",
    "dot": "ponto",
    "case": "Maiúsculas/Minúsculas",
    "lowercase": "Minúsculas",
    "preserve": "Preservar",
    "clear": "Limpar"
  },
  "ar": {
    "input": "نص الإدخال",
    "inputPlaceholder": "أدخل النص للتحويل إلى slug...",
    "output": "Slug المُنشأ",
    "outputPlaceholder": "سيظهر الـ slug هنا...",
    "separator": "الفاصل",
    "hyphen": "شرطة",
    "underscore": "شرطة سفلية",
    "dot": "نقطة",
    "case": "حالة الأحرف",
    "lowercase": "أحرف صغيرة",
    "preserve": "الحفاظ",
    "clear": "مسح"
  },
  "hi": {
    "input": "इनपुट टेक्स्ट",
    "inputPlaceholder": "slug में बदलने के लिए टेक्स्ट दर्ज करें...",
    "output": "जनरेट किया गया Slug",
    "outputPlaceholder": "Slug यहाँ दिखाई देगा...",
    "separator": "विभाजक",
    "hyphen": "हाइफ़न",
    "underscore": "अंडरस्कोर",
    "dot": "डॉट",
    "case": "केस",
    "lowercase": "लोअरकेस",
    "preserve": "संरक्षित करें",
    "clear": "साफ़ करें"
  },
  "tr": {
    "input": "Giriş Metni",
    "inputPlaceholder": "Slug'a dönüştürülecek metni girin...",
    "output": "Oluşturulan Slug",
    "outputPlaceholder": "Slug burada görünecek...",
    "separator": "Ayırıcı",
    "hyphen": "tire",
    "underscore": "alt çizgi",
    "dot": "nokta",
    "case": "Büyük/Küçük Harf",
    "lowercase": "Küçük harf",
    "preserve": "Koru",
    "clear": "Temizle"
  },
  "nl": {
    "input": "Invoertekst",
    "inputPlaceholder": "Voer tekst in om naar slug te converteren...",
    "output": "Gegenereerde Slug",
    "outputPlaceholder": "Slug verschijnt hier...",
    "separator": "Scheidingsteken",
    "hyphen": "koppelteken",
    "underscore": "underscore",
    "dot": "punt",
    "case": "Hoofdletters",
    "lowercase": "Kleine letters",
    "preserve": "Behouden",
    "clear": "Wissen"
  },
  "sv": {
    "input": "Inmatningstext",
    "inputPlaceholder": "Ange text att konvertera till slug...",
    "output": "Genererad Slug",
    "outputPlaceholder": "Slug visas här...",
    "separator": "Separator",
    "hyphen": "bindestreck",
    "underscore": "understreck",
    "dot": "punkt",
    "case": "Skiftläge",
    "lowercase": "Gemener",
    "preserve": "Bevara",
    "clear": "Rensa"
  },
  "pl": {
    "input": "Tekst wejściowy",
    "inputPlaceholder": "Wprowadź tekst do konwersji na slug...",
    "output": "Wygenerowany Slug",
    "outputPlaceholder": "Slug pojawi się tutaj...",
    "separator": "Separator",
    "hyphen": "myślnik",
    "underscore": "podkreślenie",
    "dot": "kropka",
    "case": "Wielkość liter",
    "lowercase": "Małe litery",
    "preserve": "Zachowaj",
    "clear": "Wyczyść"
  },
  "vi": {
    "input": "Văn bản đầu vào",
    "inputPlaceholder": "Nhập văn bản để chuyển đổi thành slug...",
    "output": "Slug đã tạo",
    "outputPlaceholder": "Slug sẽ xuất hiện ở đây...",
    "separator": "Dấu phân cách",
    "hyphen": "gạch ngang",
    "underscore": "gạch dưới",
    "dot": "chấm",
    "case": "Chữ hoa/thường",
    "lowercase": "Chữ thường",
    "preserve": "Giữ nguyên",
    "clear": "Xóa"
  },
  "th": {
    "input": "ข้อความนำเข้า",
    "inputPlaceholder": "ป้อนข้อความเพื่อแปลงเป็น slug...",
    "output": "Slug ที่สร้างขึ้น",
    "outputPlaceholder": "Slug จะปรากฏที่นี่...",
    "separator": "ตัวคั่น",
    "hyphen": "ขีด",
    "underscore": "ขีดล่าง",
    "dot": "จุด",
    "case": "ตัวพิมพ์",
    "lowercase": "ตัวพิมพ์เล็ก",
    "preserve": "คงไว้",
    "clear": "ล้าง"
  },
  "id": {
    "input": "Teks Masukan",
    "inputPlaceholder": "Masukkan teks untuk dikonversi ke slug...",
    "output": "Slug yang Dihasilkan",
    "outputPlaceholder": "Slug akan muncul di sini...",
    "separator": "Pemisah",
    "hyphen": "tanda hubung",
    "underscore": "garis bawah",
    "dot": "titik",
    "case": "Huruf Besar/Kecil",
    "lowercase": "Huruf kecil",
    "preserve": "Pertahankan",
    "clear": "Hapus"
  },
  "he": {
    "input": "טקסט קלט",
    "inputPlaceholder": "הזן טקסט להמרה ל-slug...",
    "output": "Slug שנוצר",
    "outputPlaceholder": "ה-slug יופיע כאן...",
    "separator": "מפריד",
    "hyphen": "מקף",
    "underscore": "קו תחתון",
    "dot": "נקודה",
    "case": "רישיות",
    "lowercase": "אותיות קטנות",
    "preserve": "שמור",
    "clear": "נקה"
  },
  "ms": {
    "input": "Teks Input",
    "inputPlaceholder": "Masukkan teks untuk ditukar kepada slug...",
    "output": "Slug yang Dijana",
    "outputPlaceholder": "Slug akan muncul di sini...",
    "separator": "Pemisah",
    "hyphen": "sempang",
    "underscore": "garis bawah",
    "dot": "titik",
    "case": "Huruf Besar/Kecil",
    "lowercase": "Huruf kecil",
    "preserve": "Kekalkan",
    "clear": "Kosongkan"
  },
  "no": {
    "input": "Inndatatekst",
    "inputPlaceholder": "Skriv inn tekst for å konvertere til slug...",
    "output": "Generert Slug",
    "outputPlaceholder": "Slug vises her...",
    "separator": "Skilletegn",
    "hyphen": "bindestrek",
    "underscore": "understrek",
    "dot": "punktum",
    "case": "Store/små bokstaver",
    "lowercase": "Små bokstaver",
    "preserve": "Bevar",
    "clear": "Tøm"
  }
}
</i18n>
