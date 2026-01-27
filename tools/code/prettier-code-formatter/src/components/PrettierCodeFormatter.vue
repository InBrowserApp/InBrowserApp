<template>
  <ToolSection>
    <PrettierToolbar
      :formatted-code="formattedCode"
      :download-url="downloadUrl"
      :download-filename="downloadFilename"
      @import="importFromFile"
    />
  </ToolSection>

  <ToolSection>
    <PrettierOptionsForm
      v-model:language="language"
      v-model:print-width="printWidth"
      v-model:tab-width="tabWidth"
      v-model:use-tabs="useTabs"
      v-model:semi="semi"
      v-model:single-quote="singleQuote"
      v-model:trailing-comma="trailingComma"
      :language-keys="languageKeys"
      :supports-semi="supportsSemi"
      :supports-single-quote="supportsSingleQuote"
      :supports-trailing-comma="supportsTrailingComma"
    />
  </ToolSection>

  <ToolSection>
    <PrettierInputOutput
      v-model:source-code="sourceCode"
      :formatted-code="formattedCode"
      :format-error="formatError"
      :highlight-language="highlightLanguage"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounce, useObjectUrl } from '@vueuse/core'
import { ToolSection } from '@shared/ui/tool'
import { fileOpen } from 'browser-fs-access'
import { format } from 'prettier/standalone'
import { extensionToLanguage, fileExtensions, languageConfigs, languageKeys } from '../languages'
import type { LanguageKey } from '../languages'
import PrettierInputOutput from './PrettierInputOutput.vue'
import PrettierOptionsForm from './PrettierOptionsForm.vue'
import PrettierToolbar from './PrettierToolbar.vue'

const { t } = useI18n({ useScope: 'local' })

const language = ref<LanguageKey>('javascript')
const sourceCode = ref<string>(languageConfigs[language.value].sample)
const formattedCode = ref<string>('')
const formatError = ref<string>('')

const printWidth = ref<number>(80)
const tabWidth = ref<number>(2)
const useTabs = ref<boolean>(false)
const semi = ref<boolean>(true)
const singleQuote = ref<boolean>(false)
const trailingComma = ref<'none' | 'es5' | 'all'>('es5')

const debouncedSource = useDebounce(sourceCode, 300)

const activeLanguageConfig = computed(() => languageConfigs[language.value])
const highlightLanguage = computed(() => activeLanguageConfig.value.highlight)
const downloadFilename = computed(() => {
  const extension = activeLanguageConfig.value.extensions[0] ?? '.txt'
  return `formatted${extension}`
})
const downloadBlob = computed(() => {
  if (!formattedCode.value.trim()) return null
  return new Blob([formattedCode.value], { type: 'text/plain;charset=utf-8' })
})
const downloadUrl = useObjectUrl(downloadBlob)

const supportsTrailingComma = computed(
  () => activeLanguageConfig.value.supportsTrailingComma === true,
)
const supportsSemi = computed(() => activeLanguageConfig.value.supportsSemi === true)
const supportsSingleQuote = computed(() => activeLanguageConfig.value.supportsSingleQuote === true)

let formatToken = 0

watch(language, (next, previous) => {
  const previousSample = languageConfigs[previous].sample
  if (!sourceCode.value.trim() || sourceCode.value === previousSample) {
    sourceCode.value = languageConfigs[next].sample
  }
})

watch(
  () => [
    debouncedSource.value,
    language.value,
    printWidth.value,
    tabWidth.value,
    useTabs.value,
    semi.value,
    singleQuote.value,
    trailingComma.value,
  ],
  () => {
    void formatCode(debouncedSource.value)
  },
  { immediate: true },
)

async function formatCode(value: string): Promise<void> {
  const token = ++formatToken
  if (!value.trim()) {
    formattedCode.value = ''
    formatError.value = ''
    return
  }

  const config = activeLanguageConfig.value

  try {
    const result = await format(value, {
      parser: config.parser,
      plugins: config.plugins,
      printWidth: printWidth.value,
      tabWidth: tabWidth.value,
      useTabs: useTabs.value,
      semi: supportsSemi.value ? semi.value : true,
      singleQuote: supportsSingleQuote.value ? singleQuote.value : false,
      trailingComma: supportsTrailingComma.value ? trailingComma.value : 'none',
    })

    if (token !== formatToken) {
      return
    }

    formattedCode.value = result
    formatError.value = ''
  } catch (error) {
    if (token !== formatToken) {
      return
    }

    const errorMessage = error instanceof Error ? error.message : t('format-error')
    formattedCode.value = ''
    formatError.value = errorMessage
  }
}

function detectLanguage(filename: string): LanguageKey | null {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/)
  const extension = match?.[1]
  if (!extension) {
    return null
  }
  return extensionToLanguage[extension] ?? null
}

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({ extensions: fileExtensions })
    sourceCode.value = await file.text()
    const detected = detectLanguage(file.name)
    if (detected) {
      language.value = detected
    }
  } catch {
    // User cancelled file selection - this is normal
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "format-error": "Formatting failed"
  },
  "zh": {
    "format-error": "格式化失败"
  },
  "zh-CN": {
    "format-error": "格式化失败"
  },
  "zh-TW": {
    "format-error": "格式化失敗"
  },
  "zh-HK": {
    "format-error": "格式化失敗"
  },
  "es": {
    "format-error": "Error al formatear"
  },
  "fr": {
    "format-error": "Échec du formatage"
  },
  "de": {
    "format-error": "Formatierung fehlgeschlagen"
  },
  "it": {
    "format-error": "Formattazione non riuscita"
  },
  "ja": {
    "format-error": "整形に失敗しました"
  },
  "ko": {
    "format-error": "형식화 실패"
  },
  "ru": {
    "format-error": "Ошибка форматирования"
  },
  "pt": {
    "format-error": "Falha na formatação"
  },
  "ar": {
    "format-error": "فشل التنسيق"
  },
  "hi": {
    "format-error": "फ़ॉर्मेटिंग विफल"
  },
  "tr": {
    "format-error": "Biçimlendirme başarısız"
  },
  "nl": {
    "format-error": "Formatteren mislukt"
  },
  "sv": {
    "format-error": "Formatering misslyckades"
  },
  "pl": {
    "format-error": "Formatowanie nie powiodło się"
  },
  "vi": {
    "format-error": "Định dạng thất bại"
  },
  "th": {
    "format-error": "จัดรูปแบบล้มเหลว"
  },
  "id": {
    "format-error": "Gagal memformat"
  },
  "he": {
    "format-error": "העיצוב נכשל"
  },
  "ms": {
    "format-error": "Format gagal"
  },
  "no": {
    "format-error": "Formatering mislyktes"
  }
}
</i18n>
