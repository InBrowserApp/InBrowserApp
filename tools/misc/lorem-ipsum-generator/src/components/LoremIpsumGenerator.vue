<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="16">
      <n-tabs v-model:value="activeMode" type="segment" animated>
        <n-tab name="words">{{ t('words') }}</n-tab>
        <n-tab name="sentences">{{ t('sentences') }}</n-tab>
        <n-tab name="paragraphs">{{ t('paragraphs') }}</n-tab>
      </n-tabs>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('locale')">
          <n-select v-model:value="selectedLocale" :options="localeOptions" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('count')">
          <n-input-number v-model:value="count" :min="1" style="width: 100%" />
        </n-form-item-gi>
      </n-grid>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-input
        :value="generatedText"
        type="textarea"
        readonly
        :autosize="{ minRows: 4, maxRows: 12 }"
        :placeholder="t('placeholder')"
      />
      <n-flex>
        <CopyToClipboardButton :content="generatedText" />
        <RegenerateButton @click="regenerate" />
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NTabs, NTab, NFlex, NFormItemGi, NInputNumber, NSelect, NInput, NGrid } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import { useStorage } from '@vueuse/core'
import {
  Faker,
  base,
  en,
  zh_CN,
  zh_TW,
  ja,
  ko,
  de,
  fr,
  es,
  ru,
  pt_BR,
  ar,
  tr,
  nl,
  sv,
  pl,
  vi,
  th,
  id_ID,
  he,
} from '@faker-js/faker'

const { t } = useI18n()

// Mode selection
const activeMode = useStorage<'words' | 'sentences' | 'paragraphs'>(
  'tools:lorem-ipsum-generator:mode',
  'paragraphs',
)

// Count setting
const count = useStorage('tools:lorem-ipsum-generator:count', 3)

// Locale selection
const selectedLocale = useStorage('tools:lorem-ipsum-generator:locale', 'en')

const localeMap: Record<string, typeof en> = {
  en,
  zh_CN,
  zh_TW,
  ja,
  ko,
  de,
  fr,
  es,
  ru,
  pt_BR,
  ar,
  tr,
  nl,
  sv,
  pl,
  vi,
  th,
  id_ID,
  he,
}

const localeOptions = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh_CN' },
  { label: '繁體中文', value: 'zh_TW' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: 'Español', value: 'es' },
  { label: 'Русский', value: 'ru' },
  { label: 'Português', value: 'pt_BR' },
  { label: 'العربية', value: 'ar' },
  { label: 'Türkçe', value: 'tr' },
  { label: 'Nederlands', value: 'nl' },
  { label: 'Svenska', value: 'sv' },
  { label: 'Polski', value: 'pl' },
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'ไทย', value: 'th' },
  { label: 'Bahasa Indonesia', value: 'id_ID' },
  { label: 'עברית', value: 'he' },
]

// Regeneration trigger
const nonce = ref(0)
function regenerate() {
  nonce.value++
}

// Create faker instance based on selected locale
const faker = computed(() => {
  const locale = localeMap[selectedLocale.value] || en
  return new Faker({ locale: [locale, base, en] })
})

// Generate text
const generatedText = computed(() => {
  // Include nonce in dependency tracking for regeneration
  void nonce.value

  const c = count.value ?? 3
  switch (activeMode.value) {
    case 'words':
      return faker.value.lorem.words(c)
    case 'sentences':
      return faker.value.lorem.sentences(c)
    case 'paragraphs':
      return faker.value.lorem.paragraphs(c, '\n\n')
    default:
      return ''
  }
})

// Regenerate when mode changes
watch(activeMode, () => {
  regenerate()
})
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "words": "Words",
    "sentences": "Sentences",
    "paragraphs": "Paragraphs",
    "count": "Count",
    "locale": "Locale",
    "results": "Results",
    "placeholder": "Generated text will appear here..."
  },
  "zh": {
    "options": "选项",
    "words": "单词",
    "sentences": "句子",
    "paragraphs": "段落",
    "count": "数量",
    "locale": "语言",
    "results": "结果",
    "placeholder": "生成的文本将显示在这里..."
  },
  "zh-CN": {
    "options": "选项",
    "words": "单词",
    "sentences": "句子",
    "paragraphs": "段落",
    "count": "数量",
    "locale": "语言",
    "results": "结果",
    "placeholder": "生成的文本将显示在这里..."
  },
  "zh-TW": {
    "options": "選項",
    "words": "單詞",
    "sentences": "句子",
    "paragraphs": "段落",
    "count": "數量",
    "locale": "語言",
    "results": "結果",
    "placeholder": "產生的文字將顯示在這裡..."
  },
  "zh-HK": {
    "options": "選項",
    "words": "單詞",
    "sentences": "句子",
    "paragraphs": "段落",
    "count": "數量",
    "locale": "語言",
    "results": "結果",
    "placeholder": "產生的文字將顯示在這裡..."
  },
  "es": {
    "options": "Opciones",
    "words": "Palabras",
    "sentences": "Oraciones",
    "paragraphs": "Párrafos",
    "count": "Cantidad",
    "locale": "Idioma",
    "results": "Resultados",
    "placeholder": "El texto generado aparecerá aquí..."
  },
  "fr": {
    "options": "Options",
    "words": "Mots",
    "sentences": "Phrases",
    "paragraphs": "Paragraphes",
    "count": "Nombre",
    "locale": "Langue",
    "results": "Résultats",
    "placeholder": "Le texte généré apparaîtra ici..."
  },
  "de": {
    "options": "Optionen",
    "words": "Wörter",
    "sentences": "Sätze",
    "paragraphs": "Absätze",
    "count": "Anzahl",
    "locale": "Sprache",
    "results": "Ergebnisse",
    "placeholder": "Generierter Text erscheint hier..."
  },
  "it": {
    "options": "Opzioni",
    "words": "Parole",
    "sentences": "Frasi",
    "paragraphs": "Paragrafi",
    "count": "Quantità",
    "locale": "Lingua",
    "results": "Risultati",
    "placeholder": "Il testo generato apparirà qui..."
  },
  "ja": {
    "options": "オプション",
    "words": "単語",
    "sentences": "文",
    "paragraphs": "段落",
    "count": "数量",
    "locale": "言語",
    "results": "結果",
    "placeholder": "生成されたテキストがここに表示されます..."
  },
  "ko": {
    "options": "옵션",
    "words": "단어",
    "sentences": "문장",
    "paragraphs": "단락",
    "count": "개수",
    "locale": "언어",
    "results": "결과",
    "placeholder": "생성된 텍스트가 여기에 표시됩니다..."
  },
  "ru": {
    "options": "Параметры",
    "words": "Слова",
    "sentences": "Предложения",
    "paragraphs": "Абзацы",
    "count": "Количество",
    "locale": "Язык",
    "results": "Результаты",
    "placeholder": "Сгенерированный текст появится здесь..."
  },
  "pt": {
    "options": "Opções",
    "words": "Palavras",
    "sentences": "Frases",
    "paragraphs": "Parágrafos",
    "count": "Quantidade",
    "locale": "Idioma",
    "results": "Resultados",
    "placeholder": "O texto gerado aparecerá aqui..."
  },
  "ar": {
    "options": "الخيارات",
    "words": "كلمات",
    "sentences": "جمل",
    "paragraphs": "فقرات",
    "count": "العدد",
    "locale": "اللغة",
    "results": "النتائج",
    "placeholder": "سيظهر النص المُنشأ هنا..."
  },
  "hi": {
    "options": "विकल्प",
    "words": "शब्द",
    "sentences": "वाक्य",
    "paragraphs": "पैराग्राफ",
    "count": "गिनती",
    "locale": "भाषा",
    "results": "परिणाम",
    "placeholder": "जनरेट किया गया टेक्स्ट यहां दिखाई देगा..."
  },
  "tr": {
    "options": "Seçenekler",
    "words": "Kelimeler",
    "sentences": "Cümleler",
    "paragraphs": "Paragraflar",
    "count": "Sayı",
    "locale": "Dil",
    "results": "Sonuçlar",
    "placeholder": "Oluşturulan metin burada görünecek..."
  },
  "nl": {
    "options": "Opties",
    "words": "Woorden",
    "sentences": "Zinnen",
    "paragraphs": "Alinea's",
    "count": "Aantal",
    "locale": "Taal",
    "results": "Resultaten",
    "placeholder": "Gegenereerde tekst verschijnt hier..."
  },
  "sv": {
    "options": "Alternativ",
    "words": "Ord",
    "sentences": "Meningar",
    "paragraphs": "Stycken",
    "count": "Antal",
    "locale": "Språk",
    "results": "Resultat",
    "placeholder": "Genererad text visas här..."
  },
  "pl": {
    "options": "Opcje",
    "words": "Słowa",
    "sentences": "Zdania",
    "paragraphs": "Akapity",
    "count": "Ilość",
    "locale": "Język",
    "results": "Wyniki",
    "placeholder": "Wygenerowany tekst pojawi się tutaj..."
  },
  "vi": {
    "options": "Tùy chọn",
    "words": "Từ",
    "sentences": "Câu",
    "paragraphs": "Đoạn văn",
    "count": "Số lượng",
    "locale": "Ngôn ngữ",
    "results": "Kết quả",
    "placeholder": "Văn bản được tạo sẽ xuất hiện ở đây..."
  },
  "th": {
    "options": "ตัวเลือก",
    "words": "คำ",
    "sentences": "ประโยค",
    "paragraphs": "ย่อหน้า",
    "count": "จำนวน",
    "locale": "ภาษา",
    "results": "ผลลัพธ์",
    "placeholder": "ข้อความที่สร้างจะแสดงที่นี่..."
  },
  "id": {
    "options": "Opsi",
    "words": "Kata",
    "sentences": "Kalimat",
    "paragraphs": "Paragraf",
    "count": "Jumlah",
    "locale": "Bahasa",
    "results": "Hasil",
    "placeholder": "Teks yang dihasilkan akan muncul di sini..."
  },
  "he": {
    "options": "אפשרויות",
    "words": "מילים",
    "sentences": "משפטים",
    "paragraphs": "פסקאות",
    "count": "כמות",
    "locale": "שפה",
    "results": "תוצאות",
    "placeholder": "הטקסט שנוצר יופיע כאן..."
  },
  "ms": {
    "options": "Pilihan",
    "words": "Perkataan",
    "sentences": "Ayat",
    "paragraphs": "Perenggan",
    "count": "Bilangan",
    "locale": "Bahasa",
    "results": "Keputusan",
    "placeholder": "Teks yang dijana akan muncul di sini..."
  },
  "no": {
    "options": "Alternativer",
    "words": "Ord",
    "sentences": "Setninger",
    "paragraphs": "Avsnitt",
    "count": "Antall",
    "locale": "Språk",
    "results": "Resultater",
    "placeholder": "Generert tekst vises her..."
  }
}
</i18n>
