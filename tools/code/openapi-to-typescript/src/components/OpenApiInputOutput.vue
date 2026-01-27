<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('inputTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi
        :label="t('inputLabel')"
        :show-feedback="Boolean(inputError)"
        :validation-status="inputStatus"
      >
        <TextOrFileInput
          class="monospace-input"
          :value="openApiText"
          :accept="accept"
          :placeholder="t('inputPlaceholder')"
          :status="inputStatus"
          :wrap-with-form-item="false"
          @update:value="handleInput"
        />
        <template v-if="inputError" #feedback>
          <n-text type="error">{{ inputError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :label="t('outputLabel')" :show-feedback="false">
        <n-spin :show="isGenerating">
          <n-alert v-if="outputError" type="error" :bordered="false">
            {{ outputError }}
          </n-alert>
          <n-card v-else size="small">
            <n-code
              v-if="outputText"
              :code="outputText"
              language="typescript"
              :hljs="hljs"
              word-wrap
            />
            <n-text v-else depth="3">{{ t('outputEmpty') }}</n-text>
          </n-card>
          <n-text v-for="ref in externalRefs" :key="ref" depth="3" class="external-ref-item">
            {{ ref }}
          </n-text>
        </n-spin>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { TextOrFileInput } from '@shared/ui/base'
import { NAlert, NCard, NCode, NFormItemGi, NGrid, NSpin, NText } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'

hljs.registerLanguage('typescript', typescript)

defineProps<{
  openApiText: string
  accept: string
  inputError: string
  inputStatus?: 'error' | 'success'
  outputError: string
  outputText: string
  externalRefs: string[]
  isGenerating: boolean
  handleInput: (value: string | File) => void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.monospace-input :deep(textarea),
.monospace-input :deep(input) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.external-ref-item {
  display: block;
  margin-top: 2px;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "inputTitle": "OpenAPI Document",
    "inputLabel": "OpenAPI (JSON or YAML)",
    "inputPlaceholder": "Paste OpenAPI 3.0/3.1 JSON or YAML here...",
    "outputLabel": "TypeScript Output",
    "outputEmpty": "Provide a valid OpenAPI document to generate types."
  },
  "zh": {
    "inputTitle": "OpenAPI 文档",
    "inputLabel": "OpenAPI（JSON 或 YAML）",
    "inputPlaceholder": "在此粘贴 OpenAPI 3.0/3.1 的 JSON 或 YAML...",
    "outputLabel": "TypeScript 输出",
    "outputEmpty": "提供有效的 OpenAPI 文档以生成类型。"
  },
  "zh-CN": {
    "inputTitle": "OpenAPI 文档",
    "inputLabel": "OpenAPI（JSON 或 YAML）",
    "inputPlaceholder": "在此粘贴 OpenAPI 3.0/3.1 的 JSON 或 YAML...",
    "outputLabel": "TypeScript 输出",
    "outputEmpty": "提供有效的 OpenAPI 文档以生成类型。"
  },
  "zh-TW": {
    "inputTitle": "OpenAPI 文件",
    "inputLabel": "OpenAPI（JSON 或 YAML）",
    "inputPlaceholder": "在此貼上 OpenAPI 3.0/3.1 的 JSON 或 YAML...",
    "outputLabel": "TypeScript 輸出",
    "outputEmpty": "提供有效的 OpenAPI 文件以產生型別。"
  },
  "zh-HK": {
    "inputTitle": "OpenAPI 文件",
    "inputLabel": "OpenAPI（JSON 或 YAML）",
    "inputPlaceholder": "在此貼上 OpenAPI 3.0/3.1 的 JSON 或 YAML...",
    "outputLabel": "TypeScript 輸出",
    "outputEmpty": "提供有效的 OpenAPI 文件以產生型別。"
  },
  "es": {
    "inputTitle": "Documento OpenAPI",
    "inputLabel": "OpenAPI (JSON o YAML)",
    "inputPlaceholder": "Pega aquí OpenAPI 3.0/3.1 en JSON o YAML...",
    "outputLabel": "Salida TypeScript",
    "outputEmpty": "Proporciona un documento OpenAPI válido para generar tipos."
  },
  "fr": {
    "inputTitle": "Document OpenAPI",
    "inputLabel": "OpenAPI (JSON ou YAML)",
    "inputPlaceholder": "Collez ici un OpenAPI 3.0/3.1 en JSON ou YAML...",
    "outputLabel": "Sortie TypeScript",
    "outputEmpty": "Fournissez un document OpenAPI valide pour générer des types."
  },
  "de": {
    "inputTitle": "OpenAPI-Dokument",
    "inputLabel": "OpenAPI (JSON oder YAML)",
    "inputPlaceholder": "OpenAPI 3.0/3.1 als JSON oder YAML hier einfügen...",
    "outputLabel": "TypeScript-Ausgabe",
    "outputEmpty": "Gültiges OpenAPI-Dokument angeben, um Typen zu erzeugen."
  },
  "it": {
    "inputTitle": "Documento OpenAPI",
    "inputLabel": "OpenAPI (JSON o YAML)",
    "inputPlaceholder": "Incolla qui OpenAPI 3.0/3.1 in JSON o YAML...",
    "outputLabel": "Output TypeScript",
    "outputEmpty": "Fornisci un documento OpenAPI valido per generare i tipi."
  },
  "ja": {
    "inputTitle": "OpenAPI ドキュメント",
    "inputLabel": "OpenAPI（JSON または YAML）",
    "inputPlaceholder": "OpenAPI 3.0/3.1 の JSON または YAML を貼り付け...",
    "outputLabel": "TypeScript 出力",
    "outputEmpty": "有効な OpenAPI ドキュメントを指定すると型を生成します。"
  },
  "ko": {
    "inputTitle": "OpenAPI 문서",
    "inputLabel": "OpenAPI (JSON 또는 YAML)",
    "inputPlaceholder": "OpenAPI 3.0/3.1 JSON 또는 YAML을 붙여넣기...",
    "outputLabel": "TypeScript 출력",
    "outputEmpty": "유효한 OpenAPI 문서를 제공하면 타입을 생성합니다."
  },
  "ru": {
    "inputTitle": "Документ OpenAPI",
    "inputLabel": "OpenAPI (JSON или YAML)",
    "inputPlaceholder": "Вставьте OpenAPI 3.0/3.1 в JSON или YAML...",
    "outputLabel": "Вывод TypeScript",
    "outputEmpty": "Укажите корректный документ OpenAPI, чтобы сгенерировать типы."
  },
  "pt": {
    "inputTitle": "Documento OpenAPI",
    "inputLabel": "OpenAPI (JSON ou YAML)",
    "inputPlaceholder": "Cole aqui OpenAPI 3.0/3.1 em JSON ou YAML...",
    "outputLabel": "Saída TypeScript",
    "outputEmpty": "Forneça um documento OpenAPI válido para gerar tipos."
  },
  "ar": {
    "inputTitle": "مستند OpenAPI",
    "inputLabel": "OpenAPI (JSON أو YAML)",
    "inputPlaceholder": "الصق OpenAPI 3.0/3.1 بصيغة JSON أو YAML هنا...",
    "outputLabel": "مخرجات TypeScript",
    "outputEmpty": "قدّم مستند OpenAPI صالحًا لتوليد الأنواع."
  },
  "hi": {
    "inputTitle": "OpenAPI दस्तावेज़",
    "inputLabel": "OpenAPI (JSON या YAML)",
    "inputPlaceholder": "OpenAPI 3.0/3.1 JSON या YAML यहाँ पेस्ट करें...",
    "outputLabel": "TypeScript आउटपुट",
    "outputEmpty": "टाइप्स बनाने के लिए एक मान्य OpenAPI दस्तावेज़ दें।"
  },
  "tr": {
    "inputTitle": "OpenAPI Belgesi",
    "inputLabel": "OpenAPI (JSON veya YAML)",
    "inputPlaceholder": "OpenAPI 3.0/3.1 JSON veya YAML buraya yapıştırın...",
    "outputLabel": "TypeScript Çıktısı",
    "outputEmpty": "Tür üretmek için geçerli bir OpenAPI belgesi sağlayın."
  },
  "nl": {
    "inputTitle": "OpenAPI-document",
    "inputLabel": "OpenAPI (JSON of YAML)",
    "inputPlaceholder": "Plak hier OpenAPI 3.0/3.1 in JSON of YAML...",
    "outputLabel": "TypeScript-uitvoer",
    "outputEmpty": "Geef een geldig OpenAPI-document om typen te genereren."
  },
  "sv": {
    "inputTitle": "OpenAPI-dokument",
    "inputLabel": "OpenAPI (JSON eller YAML)",
    "inputPlaceholder": "Klistra in OpenAPI 3.0/3.1 i JSON eller YAML här...",
    "outputLabel": "TypeScript-utdata",
    "outputEmpty": "Ange ett giltigt OpenAPI-dokument för att generera typer."
  },
  "pl": {
    "inputTitle": "Dokument OpenAPI",
    "inputLabel": "OpenAPI (JSON lub YAML)",
    "inputPlaceholder": "Wklej tutaj OpenAPI 3.0/3.1 w JSON lub YAML...",
    "outputLabel": "Wyjście TypeScript",
    "outputEmpty": "Podaj poprawny dokument OpenAPI, aby wygenerować typy."
  },
  "vi": {
    "inputTitle": "Tài liệu OpenAPI",
    "inputLabel": "OpenAPI (JSON hoặc YAML)",
    "inputPlaceholder": "Dán OpenAPI 3.0/3.1 JSON hoặc YAML vào đây...",
    "outputLabel": "Đầu ra TypeScript",
    "outputEmpty": "Cung cấp tài liệu OpenAPI hợp lệ để tạo kiểu."
  },
  "th": {
    "inputTitle": "เอกสาร OpenAPI",
    "inputLabel": "OpenAPI (JSON หรือ YAML)",
    "inputPlaceholder": "วาง OpenAPI 3.0/3.1 แบบ JSON หรือ YAML ที่นี่...",
    "outputLabel": "ผลลัพธ์ TypeScript",
    "outputEmpty": "กรุณาใส่เอกสาร OpenAPI ที่ถูกต้องเพื่อสร้างชนิดข้อมูล"
  },
  "id": {
    "inputTitle": "Dokumen OpenAPI",
    "inputLabel": "OpenAPI (JSON atau YAML)",
    "inputPlaceholder": "Tempel OpenAPI 3.0/3.1 JSON atau YAML di sini...",
    "outputLabel": "Output TypeScript",
    "outputEmpty": "Berikan dokumen OpenAPI yang valid untuk menghasilkan tipe."
  },
  "he": {
    "inputTitle": "מסמך OpenAPI",
    "inputLabel": "OpenAPI (JSON או YAML)",
    "inputPlaceholder": "הדבק כאן OpenAPI 3.0/3.1 ב-JSON או YAML...",
    "outputLabel": "פלט TypeScript",
    "outputEmpty": "ספק מסמך OpenAPI תקין כדי ליצור טיפוסים."
  },
  "ms": {
    "inputTitle": "Dokumen OpenAPI",
    "inputLabel": "OpenAPI (JSON atau YAML)",
    "inputPlaceholder": "Tampal OpenAPI 3.0/3.1 JSON atau YAML di sini...",
    "outputLabel": "Output TypeScript",
    "outputEmpty": "Sediakan dokumen OpenAPI yang sah untuk menjana jenis."
  },
  "no": {
    "inputTitle": "OpenAPI-dokument",
    "inputLabel": "OpenAPI (JSON eller YAML)",
    "inputPlaceholder": "Lim inn OpenAPI 3.0/3.1 i JSON eller YAML her...",
    "outputLabel": "TypeScript-utdata",
    "outputEmpty": "Oppgi et gyldig OpenAPI-dokument for å generere typer."
  }
}
</i18n>
