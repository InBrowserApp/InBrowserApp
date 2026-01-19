<template>
  <n-grid :cols="4" :x-gap="12" :y-gap="12" responsive="screen" :item-responsive="true">
    <n-gi v-for="stat in displayStats" :key="stat.key" span="0:4 400:2 800:1">
      <n-card>
        <n-statistic :label="stat.label" :value="stat.value" />
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NGrid, NGi, NStatistic, NCard } from 'naive-ui'
import { formatTime, type TextStats } from '../utils/textStats'

const props = defineProps<{ stats: TextStats }>()
const { t } = useI18n()

const displayStats = computed(() => [
  { key: 'characters', value: props.stats.characters, label: t('characters') },
  {
    key: 'charactersNoSpaces',
    value: props.stats.charactersNoSpaces,
    label: t('charactersNoSpaces'),
  },
  { key: 'words', value: props.stats.words, label: t('words') },
  { key: 'lines', value: props.stats.lines, label: t('lines') },
  { key: 'paragraphs', value: props.stats.paragraphs, label: t('paragraphs') },
  { key: 'sentences', value: props.stats.sentences, label: t('sentences') },
  {
    key: 'readingTime',
    value: formatTime(props.stats.readingTimeMinutes),
    label: t('readingTime'),
  },
  {
    key: 'speakingTime',
    value: formatTime(props.stats.speakingTimeMinutes),
    label: t('speakingTime'),
  },
])
</script>

<i18n lang="json">
{
  "en": {
    "characters": "Characters",
    "charactersNoSpaces": "Characters (no spaces)",
    "words": "Words",
    "lines": "Lines",
    "paragraphs": "Paragraphs",
    "sentences": "Sentences",
    "readingTime": "Reading Time",
    "speakingTime": "Speaking Time"
  },
  "zh": {
    "characters": "字符数",
    "charactersNoSpaces": "字符数（不含空格）",
    "words": "单词数",
    "lines": "行数",
    "paragraphs": "段落数",
    "sentences": "句子数",
    "readingTime": "阅读时间",
    "speakingTime": "朗读时间"
  },
  "zh-CN": {
    "characters": "字符数",
    "charactersNoSpaces": "字符数（不含空格）",
    "words": "单词数",
    "lines": "行数",
    "paragraphs": "段落数",
    "sentences": "句子数",
    "readingTime": "阅读时间",
    "speakingTime": "朗读时间"
  },
  "zh-TW": {
    "characters": "字元數",
    "charactersNoSpaces": "字元數（不含空格）",
    "words": "字數",
    "lines": "行數",
    "paragraphs": "段落數",
    "sentences": "句子數",
    "readingTime": "閱讀時間",
    "speakingTime": "朗讀時間"
  },
  "zh-HK": {
    "characters": "字元數",
    "charactersNoSpaces": "字元數（不含空格）",
    "words": "字數",
    "lines": "行數",
    "paragraphs": "段落數",
    "sentences": "句子數",
    "readingTime": "閱讀時間",
    "speakingTime": "朗讀時間"
  },
  "es": {
    "characters": "Caracteres",
    "charactersNoSpaces": "Caracteres (sin espacios)",
    "words": "Palabras",
    "lines": "Líneas",
    "paragraphs": "Párrafos",
    "sentences": "Oraciones",
    "readingTime": "Tiempo de lectura",
    "speakingTime": "Tiempo de habla"
  },
  "fr": {
    "characters": "Caractères",
    "charactersNoSpaces": "Caractères (sans espaces)",
    "words": "Mots",
    "lines": "Lignes",
    "paragraphs": "Paragraphes",
    "sentences": "Phrases",
    "readingTime": "Temps de lecture",
    "speakingTime": "Temps de parole"
  },
  "de": {
    "characters": "Zeichen",
    "charactersNoSpaces": "Zeichen (ohne Leerzeichen)",
    "words": "Wörter",
    "lines": "Zeilen",
    "paragraphs": "Absätze",
    "sentences": "Sätze",
    "readingTime": "Lesezeit",
    "speakingTime": "Sprechzeit"
  },
  "it": {
    "characters": "Caratteri",
    "charactersNoSpaces": "Caratteri (senza spazi)",
    "words": "Parole",
    "lines": "Righe",
    "paragraphs": "Paragrafi",
    "sentences": "Frasi",
    "readingTime": "Tempo di lettura",
    "speakingTime": "Tempo di parlato"
  },
  "ja": {
    "characters": "文字数",
    "charactersNoSpaces": "文字数（空白除く）",
    "words": "単語数",
    "lines": "行数",
    "paragraphs": "段落数",
    "sentences": "文数",
    "readingTime": "読書時間",
    "speakingTime": "発話時間"
  },
  "ko": {
    "characters": "문자 수",
    "charactersNoSpaces": "문자 수 (공백 제외)",
    "words": "단어 수",
    "lines": "줄 수",
    "paragraphs": "단락 수",
    "sentences": "문장 수",
    "readingTime": "읽기 시간",
    "speakingTime": "말하기 시간"
  },
  "ru": {
    "characters": "Символы",
    "charactersNoSpaces": "Символы (без пробелов)",
    "words": "Слова",
    "lines": "Строки",
    "paragraphs": "Абзацы",
    "sentences": "Предложения",
    "readingTime": "Время чтения",
    "speakingTime": "Время произнесения"
  },
  "pt": {
    "characters": "Caracteres",
    "charactersNoSpaces": "Caracteres (sem espaços)",
    "words": "Palavras",
    "lines": "Linhas",
    "paragraphs": "Parágrafos",
    "sentences": "Frases",
    "readingTime": "Tempo de leitura",
    "speakingTime": "Tempo de fala"
  },
  "ar": {
    "characters": "الأحرف",
    "charactersNoSpaces": "الأحرف (بدون مسافات)",
    "words": "الكلمات",
    "lines": "الأسطر",
    "paragraphs": "الفقرات",
    "sentences": "الجمل",
    "readingTime": "وقت القراءة",
    "speakingTime": "وقت التحدث"
  },
  "hi": {
    "characters": "वर्ण",
    "charactersNoSpaces": "वर्ण (बिना रिक्त स्थान)",
    "words": "शब्द",
    "lines": "पंक्तियाँ",
    "paragraphs": "पैराग्राफ",
    "sentences": "वाक्य",
    "readingTime": "पढ़ने का समय",
    "speakingTime": "बोलने का समय"
  },
  "tr": {
    "characters": "Karakterler",
    "charactersNoSpaces": "Karakterler (boşluksuz)",
    "words": "Kelimeler",
    "lines": "Satırlar",
    "paragraphs": "Paragraflar",
    "sentences": "Cümleler",
    "readingTime": "Okuma Süresi",
    "speakingTime": "Konuşma Süresi"
  },
  "nl": {
    "characters": "Tekens",
    "charactersNoSpaces": "Tekens (zonder spaties)",
    "words": "Woorden",
    "lines": "Regels",
    "paragraphs": "Alinea's",
    "sentences": "Zinnen",
    "readingTime": "Leestijd",
    "speakingTime": "Spreektijd"
  },
  "sv": {
    "characters": "Tecken",
    "charactersNoSpaces": "Tecken (utan mellanslag)",
    "words": "Ord",
    "lines": "Rader",
    "paragraphs": "Stycken",
    "sentences": "Meningar",
    "readingTime": "Lästid",
    "speakingTime": "Taltid"
  },
  "pl": {
    "characters": "Znaki",
    "charactersNoSpaces": "Znaki (bez spacji)",
    "words": "Słowa",
    "lines": "Wiersze",
    "paragraphs": "Akapity",
    "sentences": "Zdania",
    "readingTime": "Czas czytania",
    "speakingTime": "Czas mówienia"
  },
  "vi": {
    "characters": "Ký tự",
    "charactersNoSpaces": "Ký tự (không có khoảng trắng)",
    "words": "Từ",
    "lines": "Dòng",
    "paragraphs": "Đoạn văn",
    "sentences": "Câu",
    "readingTime": "Thời gian đọc",
    "speakingTime": "Thời gian nói"
  },
  "th": {
    "characters": "ตัวอักษร",
    "charactersNoSpaces": "ตัวอักษร (ไม่รวมช่องว่าง)",
    "words": "คำ",
    "lines": "บรรทัด",
    "paragraphs": "ย่อหน้า",
    "sentences": "ประโยค",
    "readingTime": "เวลาอ่าน",
    "speakingTime": "เวลาพูด"
  },
  "id": {
    "characters": "Karakter",
    "charactersNoSpaces": "Karakter (tanpa spasi)",
    "words": "Kata",
    "lines": "Baris",
    "paragraphs": "Paragraf",
    "sentences": "Kalimat",
    "readingTime": "Waktu Baca",
    "speakingTime": "Waktu Bicara"
  },
  "he": {
    "characters": "תווים",
    "charactersNoSpaces": "תווים (ללא רווחים)",
    "words": "מילים",
    "lines": "שורות",
    "paragraphs": "פסקאות",
    "sentences": "משפטים",
    "readingTime": "זמן קריאה",
    "speakingTime": "זמן דיבור"
  },
  "ms": {
    "characters": "Aksara",
    "charactersNoSpaces": "Aksara (tanpa ruang)",
    "words": "Perkataan",
    "lines": "Baris",
    "paragraphs": "Perenggan",
    "sentences": "Ayat",
    "readingTime": "Masa Membaca",
    "speakingTime": "Masa Bercakap"
  },
  "no": {
    "characters": "Tegn",
    "charactersNoSpaces": "Tegn (uten mellomrom)",
    "words": "Ord",
    "lines": "Linjer",
    "paragraphs": "Avsnitt",
    "sentences": "Setninger",
    "readingTime": "Lesetid",
    "speakingTime": "Taletid"
  }
}
</i18n>
