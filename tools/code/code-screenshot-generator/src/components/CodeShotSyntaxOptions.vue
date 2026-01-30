<template>
  <n-form-item-gi :label="t('language')" :show-feedback="false">
    <n-select v-model:value="languageProxy" :options="languageSelectOptions" size="small" />
  </n-form-item-gi>
  <n-form-item-gi :label="t('renderMode')" :show-feedback="false">
    <n-select v-model:value="renderModeProxy" :options="renderModeOptions" size="small" />
  </n-form-item-gi>
  <n-form-item-gi :label="t('theme')" :show-feedback="false">
    <n-select v-model:value="themeIdProxy" :options="themeOptions" size="small" />
  </n-form-item-gi>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NSelect } from 'naive-ui'
import type { RenderMode } from '../utils/render'
import { languageOptions } from '../utils/languages'
import { themes } from '../utils/themes'

const props = defineProps<{
  language: string
  renderMode: RenderMode
  themeId: string
}>()

const emit = defineEmits<{
  (e: 'update:language', value: string): void
  (e: 'update:renderMode', value: RenderMode): void
  (e: 'update:themeId', value: string): void
}>()

const { t } = useI18n()

const languageProxy = computed({
  get: () => props.language,
  set: (value: string) => emit('update:language', value),
})

const renderModeProxy = computed({
  get: () => props.renderMode,
  set: (value: RenderMode) => emit('update:renderMode', value),
})

const themeIdProxy = computed({
  get: () => props.themeId,
  set: (value: string) => emit('update:themeId', value),
})

const languageSelectOptions = computed(() =>
  languageOptions.map((option) => ({
    label: option.value === 'auto' ? t('languageAuto') : option.label,
    value: option.value,
  })),
)

const renderModeOptions = computed(() => [
  { label: t('renderModeHighlight'), value: 'highlight' },
  { label: t('renderModePlain'), value: 'plain' },
])

const themeOptions = computed(() =>
  themes.map((theme) => ({
    // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
    label: t(theme.labelKey),
    value: theme.id,
  })),
)
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "language": "Language",
    "languageAuto": "Auto",
    "renderMode": "Render mode",
    "renderModeHighlight": "Syntax highlight",
    "renderModePlain": "Plain text",
    "theme": "Theme",
    "theme.nebula": "Nebula",
    "theme.sunrise": "Sunrise",
    "theme.paper": "Paper",
    "theme.terminal": "Terminal"
  },
  "zh": {
    "language": "语言",
    "languageAuto": "自动",
    "renderMode": "渲染模式",
    "renderModeHighlight": "语法高亮",
    "renderModePlain": "纯文本",
    "theme": "主题",
    "theme.nebula": "星云",
    "theme.sunrise": "朝霞",
    "theme.paper": "纸感",
    "theme.terminal": "终端"
  },
  "zh-CN": {
    "language": "语言",
    "languageAuto": "自动",
    "renderMode": "渲染模式",
    "renderModeHighlight": "语法高亮",
    "renderModePlain": "纯文本",
    "theme": "主题",
    "theme.nebula": "星云",
    "theme.sunrise": "朝霞",
    "theme.paper": "纸感",
    "theme.terminal": "终端"
  },
  "zh-TW": {
    "language": "語言",
    "languageAuto": "自動",
    "renderMode": "渲染模式",
    "renderModeHighlight": "語法高亮",
    "renderModePlain": "純文字",
    "theme": "主題",
    "theme.nebula": "星雲",
    "theme.sunrise": "朝霞",
    "theme.paper": "紙感",
    "theme.terminal": "終端機"
  },
  "zh-HK": {
    "language": "語言",
    "languageAuto": "自動",
    "renderMode": "渲染模式",
    "renderModeHighlight": "語法高亮",
    "renderModePlain": "純文字",
    "theme": "主題",
    "theme.nebula": "星雲",
    "theme.sunrise": "朝霞",
    "theme.paper": "紙感",
    "theme.terminal": "終端機"
  },
  "es": {
    "language": "Idioma",
    "languageAuto": "Automático",
    "renderMode": "Modo de renderizado",
    "renderModeHighlight": "Resaltado de sintaxis",
    "renderModePlain": "Texto sin formato",
    "theme": "Tema",
    "theme.nebula": "Nébula",
    "theme.sunrise": "Amanecer",
    "theme.paper": "Papel",
    "theme.terminal": "Terminal"
  },
  "fr": {
    "language": "Langue",
    "languageAuto": "Auto",
    "renderMode": "Mode de rendu",
    "renderModeHighlight": "Surlignage syntaxique",
    "renderModePlain": "Texte brut",
    "theme": "Thème",
    "theme.nebula": "Nébuleuse",
    "theme.sunrise": "Aurore",
    "theme.paper": "Papier",
    "theme.terminal": "Terminal"
  },
  "de": {
    "language": "Sprache",
    "languageAuto": "Auto",
    "renderMode": "Render-Modus",
    "renderModeHighlight": "Syntax-Highlighting",
    "renderModePlain": "Klartext",
    "theme": "Thema",
    "theme.nebula": "Nebel",
    "theme.sunrise": "Sonnenaufgang",
    "theme.paper": "Papier",
    "theme.terminal": "Terminal"
  },
  "it": {
    "language": "Lingua",
    "languageAuto": "Auto",
    "renderMode": "Modalità di rendering",
    "renderModeHighlight": "Evidenziazione sintassi",
    "renderModePlain": "Testo semplice",
    "theme": "Tema",
    "theme.nebula": "Nebulosa",
    "theme.sunrise": "Alba",
    "theme.paper": "Carta",
    "theme.terminal": "Terminale"
  },
  "ja": {
    "language": "言語",
    "languageAuto": "自動",
    "renderMode": "描画モード",
    "renderModeHighlight": "シンタックスハイライト",
    "renderModePlain": "プレーンテキスト",
    "theme": "テーマ",
    "theme.nebula": "星雲",
    "theme.sunrise": "朝焼け",
    "theme.paper": "紙",
    "theme.terminal": "ターミナル"
  },
  "ko": {
    "language": "언어",
    "languageAuto": "자동",
    "renderMode": "렌더링 모드",
    "renderModeHighlight": "구문 강조",
    "renderModePlain": "일반 텍스트",
    "theme": "테마",
    "theme.nebula": "네뷸라",
    "theme.sunrise": "선라이즈",
    "theme.paper": "페이퍼",
    "theme.terminal": "터미널"
  },
  "ru": {
    "language": "Язык",
    "languageAuto": "Авто",
    "renderMode": "Режим рендеринга",
    "renderModeHighlight": "Подсветка синтаксиса",
    "renderModePlain": "Обычный текст",
    "theme": "Тема",
    "theme.nebula": "Туманность",
    "theme.sunrise": "Рассвет",
    "theme.paper": "Бумага",
    "theme.terminal": "Терминал"
  },
  "pt": {
    "language": "Idioma",
    "languageAuto": "Auto",
    "renderMode": "Modo de renderização",
    "renderModeHighlight": "Realce de sintaxe",
    "renderModePlain": "Texto simples",
    "theme": "Tema",
    "theme.nebula": "Nebulosa",
    "theme.sunrise": "Nascer do sol",
    "theme.paper": "Papel",
    "theme.terminal": "Terminal"
  },
  "ar": {
    "language": "اللغة",
    "languageAuto": "تلقائي",
    "renderMode": "وضع العرض",
    "renderModeHighlight": "تمييز الصياغة",
    "renderModePlain": "نص عادي",
    "theme": "السمة",
    "theme.nebula": "سديم",
    "theme.sunrise": "شروق",
    "theme.paper": "ورق",
    "theme.terminal": "طرفية"
  },
  "hi": {
    "language": "भाषा",
    "languageAuto": "स्वचालित",
    "renderMode": "रेंडर मोड",
    "renderModeHighlight": "सिंटैक्स हाइलाइट",
    "renderModePlain": "सादा टेक्स्ट",
    "theme": "थीम",
    "theme.nebula": "नेबुला",
    "theme.sunrise": "सनराइज़",
    "theme.paper": "पेपर",
    "theme.terminal": "टर्मिनल"
  },
  "tr": {
    "language": "Dil",
    "languageAuto": "Otomatik",
    "renderMode": "Render modu",
    "renderModeHighlight": "Sözdizimi vurgusu",
    "renderModePlain": "Düz metin",
    "theme": "Tema",
    "theme.nebula": "Nebula",
    "theme.sunrise": "Gündoğumu",
    "theme.paper": "Kağıt",
    "theme.terminal": "Terminal"
  },
  "nl": {
    "language": "Taal",
    "languageAuto": "Automatisch",
    "renderMode": "Render-modus",
    "renderModeHighlight": "Syntaxmarkering",
    "renderModePlain": "Platte tekst",
    "theme": "Thema",
    "theme.nebula": "Nebula",
    "theme.sunrise": "Zonsopkomst",
    "theme.paper": "Papier",
    "theme.terminal": "Terminal"
  },
  "sv": {
    "language": "Språk",
    "languageAuto": "Auto",
    "renderMode": "Renderingsläge",
    "renderModeHighlight": "Syntaxmarkering",
    "renderModePlain": "Ren text",
    "theme": "Tema",
    "theme.nebula": "Nebula",
    "theme.sunrise": "Soluppgång",
    "theme.paper": "Papper",
    "theme.terminal": "Terminal"
  },
  "pl": {
    "language": "Język",
    "languageAuto": "Auto",
    "renderMode": "Tryb renderowania",
    "renderModeHighlight": "Podświetlanie składni",
    "renderModePlain": "Zwykły tekst",
    "theme": "Motyw",
    "theme.nebula": "Mgławica",
    "theme.sunrise": "Wschód",
    "theme.paper": "Papier",
    "theme.terminal": "Terminal"
  },
  "vi": {
    "language": "Ngôn ngữ",
    "languageAuto": "Tự động",
    "renderMode": "Chế độ hiển thị",
    "renderModeHighlight": "Tô sáng cú pháp",
    "renderModePlain": "Văn bản thuần",
    "theme": "Chủ đề",
    "theme.nebula": "Tinh vân",
    "theme.sunrise": "Bình minh",
    "theme.paper": "Giấy",
    "theme.terminal": "Terminal"
  },
  "th": {
    "language": "ภาษา",
    "languageAuto": "อัตโนมัติ",
    "renderMode": "โหมดเรนเดอร์",
    "renderModeHighlight": "ไฮไลต์ไวยากรณ์",
    "renderModePlain": "ข้อความธรรมดา",
    "theme": "ธีม",
    "theme.nebula": "เนบิวลา",
    "theme.sunrise": "รุ่งอรุณ",
    "theme.paper": "กระดาษ",
    "theme.terminal": "เทอร์มินัล"
  },
  "id": {
    "language": "Bahasa",
    "languageAuto": "Otomatis",
    "renderMode": "Mode render",
    "renderModeHighlight": "Sorotan sintaks",
    "renderModePlain": "Teks biasa",
    "theme": "Tema",
    "theme.nebula": "Nebula",
    "theme.sunrise": "Sunrise",
    "theme.paper": "Kertas",
    "theme.terminal": "Terminal"
  },
  "he": {
    "language": "שפה",
    "languageAuto": "אוטומטי",
    "renderMode": "מצב עיבוד",
    "renderModeHighlight": "הדגשת תחביר",
    "renderModePlain": "טקסט רגיל",
    "theme": "ערכת נושא",
    "theme.nebula": "ערפילית",
    "theme.sunrise": "זריחה",
    "theme.paper": "נייר",
    "theme.terminal": "טרמינל"
  },
  "ms": {
    "language": "Bahasa",
    "languageAuto": "Auto",
    "renderMode": "Mod render",
    "renderModeHighlight": "Sorotan sintaks",
    "renderModePlain": "Teks biasa",
    "theme": "Tema",
    "theme.nebula": "Nebula",
    "theme.sunrise": "Matahari terbit",
    "theme.paper": "Kertas",
    "theme.terminal": "Terminal"
  },
  "no": {
    "language": "Språk",
    "languageAuto": "Auto",
    "renderMode": "Rendermodus",
    "renderModeHighlight": "Syntaksutheving",
    "renderModePlain": "Ren tekst",
    "theme": "Tema",
    "theme.nebula": "Tåke",
    "theme.sunrise": "Soloppgang",
    "theme.paper": "Papir",
    "theme.terminal": "Terminal"
  }
}
</i18n>
