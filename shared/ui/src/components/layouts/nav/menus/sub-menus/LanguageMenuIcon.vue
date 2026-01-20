<template>
  <n-popselect
    :value="language ?? 'auto'"
    @update:value="handleUpdateValue"
    :options="options"
    trigger="click"
    scrollable
  >
    <n-button quaternary circle :aria-label="t('language-selector')">
      <template #icon>
        <n-icon>
          <icon />
        </n-icon>
      </template>
    </n-button>
  </n-popselect>
</template>

<script lang="ts" setup>
import { NIcon, NButton, NPopselect } from 'naive-ui'
import icon from '@vicons/ionicons5/LanguageOutline'
import { useSiteLanguage, supportedLanguages } from '@shared/locale'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const { language } = useSiteLanguage()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const options = [
  {
    label: t('auto'),
    value: 'auto',
  },
  {
    label: 'English',
    value: 'en',
  },
  {
    label: '简体中文',
    value: 'zh',
  },
  {
    label: '繁體中文',
    value: 'zh-TW',
  },
  {
    label: 'Español',
    value: 'es',
  },
  {
    label: 'Français',
    value: 'fr',
  },
  {
    label: 'Deutsch',
    value: 'de',
  },
  {
    label: 'Italiano',
    value: 'it',
  },
  {
    label: '日本語',
    value: 'ja',
  },
  {
    label: '한국어',
    value: 'ko',
  },
  {
    label: 'Русский',
    value: 'ru',
  },
  {
    label: 'Português',
    value: 'pt',
  },
  {
    label: 'العربية',
    value: 'ar',
  },
  {
    label: 'हिन्दी',
    value: 'hi',
  },
  {
    label: 'Türkçe',
    value: 'tr',
  },
  {
    label: 'Nederlands',
    value: 'nl',
  },
  {
    label: 'Svenska',
    value: 'sv',
  },
  {
    label: 'Polski',
    value: 'pl',
  },
  {
    label: 'Tiếng Việt',
    value: 'vi',
  },
  {
    label: 'ไทย',
    value: 'th',
  },
  {
    label: 'Bahasa Indonesia',
    value: 'id',
  },
  {
    label: 'עברית',
    value: 'he',
  },
  {
    label: 'Bahasa Melayu',
    value: 'ms',
  },
  {
    label: 'Norsk',
    value: 'no',
  },
]

function handleUpdateValue(value: string) {
  const currentPath = route.fullPath
  // Extract language from the first segment of the path
  const pathSegments = currentPath.split('/')
  const firstSegment = pathSegments[1]!
  const hasLanguagePrefix = (supportedLanguages as readonly string[]).includes(firstSegment)

  if (value === 'auto') {
    // Remove language prefix if it exists
    const newPath = hasLanguagePrefix ? '/' + pathSegments.slice(2).join('/') : currentPath
    router.push({
      path: newPath,
      force: true,
    })
  } else {
    // Add or replace language prefix
    const pathWithoutLang = hasLanguagePrefix ? '/' + pathSegments.slice(2).join('/') : currentPath
    const newPath = `/${value}${pathWithoutLang}`
    router.push({
      path: newPath,
      force: true,
    })
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "language-selector": "Select language",
    "auto": "Auto (Browser)"
  },
  "zh": {
    "language-selector": "选择语言",
    "auto": "自动（浏览器）"
  },
  "zh-CN": {
    "language-selector": "选择语言",
    "auto": "自动（浏览器）"
  },
  "zh-TW": {
    "language-selector": "選擇語言",
    "auto": "自動（瀏覽器）"
  },
  "zh-HK": {
    "language-selector": "選擇語言",
    "auto": "自動（瀏覽器）"
  },
  "es": {
    "language-selector": "Seleccionar idioma",
    "auto": "Automático (Navegador)"
  },
  "fr": {
    "language-selector": "Sélectionner la langue",
    "auto": "Automatique (Navigateur)"
  },
  "de": {
    "language-selector": "Sprache auswählen",
    "auto": "Automatisch (Browser)"
  },
  "it": {
    "language-selector": "Seleziona lingua",
    "auto": "Automatico (Browser)"
  },
  "ja": {
    "language-selector": "言語を選択",
    "auto": "自動（ブラウザ）"
  },
  "ko": {
    "language-selector": "언어 선택",
    "auto": "자동 (브라우저)"
  },
  "ru": {
    "language-selector": "Выбрать язык",
    "auto": "Автоматически (Браузер)"
  },
  "pt": {
    "language-selector": "Selecionar idioma",
    "auto": "Automático (Navegador)"
  },
  "ar": {
    "language-selector": "اختيار اللغة",
    "auto": "تلقائي (المتصفح)"
  },
  "hi": {
    "language-selector": "भाषा चुनें",
    "auto": "स्वचालित (ब्राउज़र)"
  },
  "tr": {
    "language-selector": "Dil seçin",
    "auto": "Otomatik (Tarayıcı)"
  },
  "nl": {
    "language-selector": "Taal selecteren",
    "auto": "Automatisch (Browser)"
  },
  "sv": {
    "language-selector": "Välj språk",
    "auto": "Automatisk (Webbläsare)"
  },
  "pl": {
    "language-selector": "Wybierz język",
    "auto": "Automatycznie (Przeglądarka)"
  },
  "vi": {
    "language-selector": "Chọn ngôn ngữ",
    "auto": "Tự động (Trình duyệt)"
  },
  "th": {
    "language-selector": "เลือกภาษา",
    "auto": "อัตโนมัติ (เบราว์เซอร์)"
  },
  "id": {
    "language-selector": "Pilih bahasa",
    "auto": "Otomatis (Browser)"
  },
  "he": {
    "language-selector": "בחר שפה",
    "auto": "אוטומטי (דפדפן)"
  },
  "ms": {
    "language-selector": "Pilih bahasa",
    "auto": "Automatik (Pelayar)"
  },
  "no": {
    "language-selector": "Velg språk",
    "auto": "Automatisk (Nettleser)"
  }
}
</i18n>
