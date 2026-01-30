<template>
  <CsvToJsonToolbar
    v-model:show-settings="showSettings"
    :rendered-json="renderedJson"
    :download-url="downloadUrl ?? undefined"
    @import="importFromFile"
  />

  <n-collapse-transition :show="showSettings">
    <n-form label-placement="left" :show-feedback="false">
      <CsvToJsonSettingsBasics
        v-model:noheader="noheader"
        v-model:headers-text="headersText"
        v-model:delimiter="delimiter"
        v-model:quote="quote"
        v-model:trim="trim"
        v-model:check-type="checkType"
        v-model:skip-empty="skipEmpty"
        v-model:escape-char="escapeChar"
        v-model:newline="newline"
      />
      <CsvToJsonSettingsAdvanced
        v-model:preview="preview"
        v-model:comments="comments"
        v-model:fast-mode="fastMode"
        v-model:skip-first-n-lines="skipFirstNLines"
        v-model:delimiters-to-guess-text="delimitersToGuessText"
        v-model:include-columns="includeColumns"
        v-model:ignore-columns="ignoreColumns"
        v-model:spaces="spaces"
      />
    </n-form>
  </n-collapse-transition>

  <CsvToJsonEditor v-model:csv-text="csvText" :rendered-json="renderedJson" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { NCollapseTransition, NForm } from 'naive-ui'
import { fileOpen } from 'browser-fs-access'
import CsvToJsonEditor from './CsvToJsonEditor.vue'
import CsvToJsonSettingsAdvanced from './CsvToJsonSettingsAdvanced.vue'
import CsvToJsonSettingsBasics from './CsvToJsonSettingsBasics.vue'
import CsvToJsonToolbar from './CsvToJsonToolbar.vue'

const { t } = useI18n()

const csvText = useStorage<string>('csv2json:csvText', 'a,b,c\n1,2,3\n4,5,6')
const spaces = useStorage<number>('csv2json:spaces', 2)
const showSettings = useStorage<boolean>('csv2json:showSettings', false)

const noheader = useStorage<boolean>('csv2json:noheader', false)
const trim = useStorage<boolean>('csv2json:trim', true)
const checkType = useStorage<boolean>('csv2json:checkType', false)

const headersText = useStorage<string>('csv2json:headersText', '')
const delimiter = useStorage<string>('csv2json:delimiter', ',')
const quote = useStorage<string>('csv2json:quote', '"')
const includeColumns = useStorage<string>('csv2json:includeColumns', '')
const ignoreColumns = useStorage<string>('csv2json:ignoreColumns', '')
const skipEmpty = useStorage<'none' | 'true' | 'greedy'>('csv2json:skipEmpty', 'none')
const escapeChar = useStorage<string>('csv2json:escapeChar', '"')
type NewlineOption = '\n' | '\r' | '\r\n'
const newline = useStorage<NewlineOption | ''>('csv2json:newline', '')
const preview = useStorage<number>('csv2json:preview', 0)
const comments = useStorage<string>('csv2json:comments', '')
const fastMode = useStorage<boolean>('csv2json:fastMode', false)
const skipFirstNLines = useStorage<number>('csv2json:skipFirstNLines', 0)
const delimitersToGuessText = useStorage<string>('csv2json:delimitersToGuess', '')

const renderedJson = computed(() => {
  try {
    const hasCustomHeaders = noheader.value && headersText.value.trim().length > 0
    const effectiveHeader = !noheader.value || hasCustomHeaders
    const effectiveDelimiter = delimiter.value === 'auto' ? undefined : delimiter.value

    let input = csvText.value
    if (hasCustomHeaders) {
      const hdrs = headersText.value
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean)
        .join(effectiveDelimiter ?? ',')
      input = hdrs + '\n' + csvText.value
    }

    const result = Papa.parse(input, {
      delimiter: effectiveDelimiter,
      newline: (newline.value || undefined) as NewlineOption | undefined,
      quoteChar: quote.value,
      escapeChar: escapeChar.value || '"',
      header: effectiveHeader,
      dynamicTyping: checkType.value,
      fastMode: fastMode.value || undefined,
      skipEmptyLines:
        skipEmpty.value === 'none' ? false : skipEmpty.value === 'true' ? true : 'greedy',
      preview: preview.value > 0 ? preview.value : 0,
      comments: comments.value.trim() === '' ? false : comments.value,
      delimitersToGuess: delimitersToGuessText.value.trim()
        ? delimitersToGuessText.value
            .split(',')
            .map((s) => s.replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\n/g, '\n'))
        : undefined,
      skipFirstNLines: skipFirstNLines.value > 0 ? skipFirstNLines.value : 0,
      transformHeader: trim.value ? (h) => (typeof h === 'string' ? h.trim() : h) : undefined,
      transform: trim.value ? (v) => (typeof v === 'string' ? v.trim() : v) : undefined,
    }) as ParseResult<unknown>

    let data = result.data as unknown[]

    // Filter columns if needed (only when parsed as objects)
    if (effectiveHeader && (includeColumns.value || ignoreColumns.value)) {
      const includeRe = includeColumns.value ? new RegExp(includeColumns.value) : undefined
      const ignoreRe = ignoreColumns.value ? new RegExp(ignoreColumns.value) : undefined
      data = (data as Record<string, unknown>[]).map((row) => {
        const out: Record<string, unknown> = {}
        for (const key in row) {
          if (includeRe && !includeRe.test(key)) continue
          if (ignoreRe && ignoreRe.test(key)) continue
          out[key] = row[key]
        }
        return out
      })
    }

    return JSON.stringify(data, null, spaces.value)
  } catch {
    return '// ' + t('invalid-csv')
  }
})

const downloadBlob = computed(
  () => new Blob([renderedJson.value], { type: 'application/json;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.csv', '.txt'],
  })
  csvText.value = await file.text()
}
</script>

<i18n lang="json">
{
  "en": {
    "invalid-csv": "Invalid CSV"
  },
  "zh": {
    "invalid-csv": "无效的 CSV"
  },
  "zh-CN": {
    "invalid-csv": "无效的 CSV"
  },
  "zh-TW": {
    "invalid-csv": "無效的 CSV"
  },
  "zh-HK": {
    "invalid-csv": "無效的 CSV"
  },
  "es": {
    "invalid-csv": "CSV no válido"
  },
  "fr": {
    "invalid-csv": "CSV invalide"
  },
  "de": {
    "invalid-csv": "Ungültiges CSV"
  },
  "it": {
    "invalid-csv": "CSV non valido"
  },
  "ja": {
    "invalid-csv": "無効なCSV"
  },
  "ko": {
    "invalid-csv": "유효하지 않은 CSV"
  },
  "ru": {
    "invalid-csv": "Недопустимый CSV"
  },
  "pt": {
    "invalid-csv": "CSV inválido"
  },
  "ar": {
    "invalid-csv": "CSV غير صالح"
  },
  "hi": {
    "invalid-csv": "अमान्य CSV"
  },
  "tr": {
    "invalid-csv": "Geçersiz CSV"
  },
  "nl": {
    "invalid-csv": "Ongeldige CSV"
  },
  "sv": {
    "invalid-csv": "Ogiltig CSV"
  },
  "pl": {
    "invalid-csv": "Nieprawidłowy CSV"
  },
  "vi": {
    "invalid-csv": "CSV không hợp lệ"
  },
  "th": {
    "invalid-csv": "CSV ไม่ถูกต้อง"
  },
  "id": {
    "invalid-csv": "CSV tidak valid"
  },
  "he": {
    "invalid-csv": "CSV לא תקין"
  },
  "ms": {
    "invalid-csv": "CSV tidak sah"
  },
  "no": {
    "invalid-csv": "Ugyldig CSV"
  }
}
</i18n>
