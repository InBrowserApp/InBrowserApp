<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('input-code')" :show-feedback="false">
      <n-input
        v-model:value="sourceCode"
        class="code-input"
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 24 }"
        :placeholder="t('input-placeholder')"
        :status="formatError ? 'error' : undefined"
      />
      <template v-if="formatError" #feedback>
        <n-text type="error">{{ formatError }}</n-text>
      </template>
    </n-form-item-gi>

    <n-form-item-gi :label="t('formatted-code')" :show-feedback="false">
      <n-card size="small">
        <n-code :code="formattedCode" :language="highlightLanguage" :hljs="hljs" word-wrap></n-code>
      </n-card>
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NCard, NCode, NFormItemGi, NGrid, NInput, NText } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import less from 'highlight.js/lib/languages/less'
import graphql from 'highlight.js/lib/languages/graphql'
import handlebars from 'highlight.js/lib/languages/handlebars'
import markdown from 'highlight.js/lib/languages/markdown'
import yaml from 'highlight.js/lib/languages/yaml'

defineProps<{
  formattedCode: string
  formatError: string
  highlightLanguage: string
}>()
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('less', less)
hljs.registerLanguage('graphql', graphql)
hljs.registerLanguage('handlebars', handlebars)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('yaml', yaml)

const sourceCode = defineModel<string>('sourceCode', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "input-code": "Input code",
    "formatted-code": "Formatted code",
    "input-placeholder": "Paste your code here..."
  },
  "zh": {
    "input-code": "输入代码",
    "formatted-code": "格式化代码",
    "input-placeholder": "在此粘贴你的代码..."
  },
  "zh-CN": {
    "input-code": "输入代码",
    "formatted-code": "格式化代码",
    "input-placeholder": "在此粘贴你的代码..."
  },
  "zh-TW": {
    "input-code": "輸入程式碼",
    "formatted-code": "格式化程式碼",
    "input-placeholder": "在此貼上你的程式碼..."
  },
  "zh-HK": {
    "input-code": "輸入程式碼",
    "formatted-code": "格式化程式碼",
    "input-placeholder": "在此貼上你的程式碼..."
  },
  "es": {
    "input-code": "Código de entrada",
    "formatted-code": "Código formateado",
    "input-placeholder": "Pega tu código aquí..."
  },
  "fr": {
    "input-code": "Code d'entrée",
    "formatted-code": "Code formaté",
    "input-placeholder": "Collez votre code ici..."
  },
  "de": {
    "input-code": "Eingabecode",
    "formatted-code": "Formatierter Code",
    "input-placeholder": "Code hier einfügen..."
  },
  "it": {
    "input-code": "Codice di input",
    "formatted-code": "Codice formattato",
    "input-placeholder": "Incolla il tuo codice qui..."
  },
  "ja": {
    "input-code": "入力コード",
    "formatted-code": "整形コード",
    "input-placeholder": "ここにコードを貼り付け..."
  },
  "ko": {
    "input-code": "입력 코드",
    "formatted-code": "형식화된 코드",
    "input-placeholder": "여기에 코드를 붙여넣기..."
  },
  "ru": {
    "input-code": "Входной код",
    "formatted-code": "Отформатированный код",
    "input-placeholder": "Вставьте код сюда..."
  },
  "pt": {
    "input-code": "Código de entrada",
    "formatted-code": "Código formatado",
    "input-placeholder": "Cole seu código aqui..."
  },
  "ar": {
    "input-code": "إدخال الكود",
    "formatted-code": "الكود المنسق",
    "input-placeholder": "الصق الكود هنا..."
  },
  "hi": {
    "input-code": "इनपुट कोड",
    "formatted-code": "फ़ॉर्मेटेड कोड",
    "input-placeholder": "यहां अपना कोड पेस्ट करें..."
  },
  "tr": {
    "input-code": "Girdi kodu",
    "formatted-code": "Biçimlendirilmiş kod",
    "input-placeholder": "Kodunuzu buraya yapıştırın..."
  },
  "nl": {
    "input-code": "Invoercode",
    "formatted-code": "Geformatteerde code",
    "input-placeholder": "Plak je code hier..."
  },
  "sv": {
    "input-code": "Indatakod",
    "formatted-code": "Formaterad kod",
    "input-placeholder": "Klistra in din kod här..."
  },
  "pl": {
    "input-code": "Kod wejściowy",
    "formatted-code": "Sformatowany kod",
    "input-placeholder": "Wklej tutaj swój kod..."
  },
  "vi": {
    "input-code": "Mã đầu vào",
    "formatted-code": "Mã đã định dạng",
    "input-placeholder": "Dán mã của bạn tại đây..."
  },
  "th": {
    "input-code": "โค้ดนำเข้า",
    "formatted-code": "โค้ดที่จัดรูปแบบแล้ว",
    "input-placeholder": "วางโค้ดของคุณที่นี่..."
  },
  "id": {
    "input-code": "Kode masukan",
    "formatted-code": "Kode yang diformat",
    "input-placeholder": "Tempel kode Anda di sini..."
  },
  "he": {
    "input-code": "קוד קלט",
    "formatted-code": "קוד מעוצב",
    "input-placeholder": "הדבק את הקוד כאן..."
  },
  "ms": {
    "input-code": "Kod input",
    "formatted-code": "Kod diformat",
    "input-placeholder": "Tampal kod anda di sini..."
  },
  "no": {
    "input-code": "Inndata-kode",
    "formatted-code": "Formatert kode",
    "input-placeholder": "Lim inn koden din her..."
  }
}
</i18n>
