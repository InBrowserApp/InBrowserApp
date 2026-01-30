<template>
  <ToolSection>
    <XmlToJsonOptions v-model:options="options" v-model:spaces="spaces" />
  </ToolSection>

  <ToolSection>
    <XmlToJsonToolbar
      :rendered-json="renderedJson"
      :download-url="downloadUrl"
      @import="importFromFile"
    />
  </ToolSection>
  <ToolSection>
    <XmlToJsonPanels v-model:xml="xml" :rendered-json="renderedJson" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import convert from 'xml-js'
import { fileOpen } from 'browser-fs-access'
import type { XmlToJsonOptionsConfig } from '../types'
import XmlToJsonOptions from './XmlToJsonOptions.vue'
import XmlToJsonPanels from './XmlToJsonPanels.vue'
import XmlToJsonToolbar from './XmlToJsonToolbar.vue'

const { t } = useI18n({ useScope: 'local' })

const xml = ref<string>(
  `<?xml version="1.0" encoding="utf-8"?>\n<note importance="high" logged="true">\n  <title>Happy</title>\n  <todo>Work</todo>\n  <todo>Play</todo>\n</note>`,
)
const spaces = ref<number>(2)

const options = reactive<XmlToJsonOptionsConfig>({
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

<i18n lang="json">
{
  "en": {
    "invalid-xml": "Invalid XML"
  },
  "zh": {
    "invalid-xml": "无效的 XML"
  },
  "zh-CN": {
    "invalid-xml": "无效的 XML"
  },
  "zh-TW": {
    "invalid-xml": "無效的 XML"
  },
  "zh-HK": {
    "invalid-xml": "無效的 XML"
  },
  "es": {
    "invalid-xml": "XML no válido"
  },
  "fr": {
    "invalid-xml": "XML invalide"
  },
  "de": {
    "invalid-xml": "Ungültiges XML"
  },
  "it": {
    "invalid-xml": "XML non valido"
  },
  "ja": {
    "invalid-xml": "無効なXML"
  },
  "ko": {
    "invalid-xml": "유효하지 않은 XML"
  },
  "ru": {
    "invalid-xml": "Недопустимый XML"
  },
  "pt": {
    "invalid-xml": "XML inválido"
  },
  "ar": {
    "invalid-xml": "XML غير صالح"
  },
  "hi": {
    "invalid-xml": "अमान्य XML"
  },
  "tr": {
    "invalid-xml": "Geçersiz XML"
  },
  "nl": {
    "invalid-xml": "Ongeldige XML"
  },
  "sv": {
    "invalid-xml": "Ogiltig XML"
  },
  "pl": {
    "invalid-xml": "Nieprawidłowy XML"
  },
  "vi": {
    "invalid-xml": "XML không hợp lệ"
  },
  "th": {
    "invalid-xml": "XML ไม่ถูกต้อง"
  },
  "id": {
    "invalid-xml": "XML tidak valid"
  },
  "he": {
    "invalid-xml": "XML לא תקין"
  },
  "ms": {
    "invalid-xml": "XML tidak sah"
  },
  "no": {
    "invalid-xml": "Ugyldig XML"
  }
}
</i18n>
