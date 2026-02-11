<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('source-sql')" :show-feedback="false">
      <n-input
        v-model:value="sourceSql"
        type="textarea"
        :autosize="{ minRows: 12, maxRows: 26 }"
        :placeholder="t('input-placeholder')"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('formatted-sql')" :show-feedback="false">
      <n-alert v-if="formatError" type="error" :bordered="false">{{ formatError }}</n-alert>
      <n-card v-else size="small">
        <n-code v-if="formattedSql" :code="formattedSql" language="sql" :hljs="hljs" word-wrap />
        <n-text v-else depth="3">{{ t('output-empty') }}</n-text>
      </n-card>
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NCard, NCode, NFormItemGi, NGrid, NInput, NText } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import sql from 'highlight.js/lib/languages/sql'

defineProps<{
  formattedSql: string
  formatError: string
}>()

const sourceSql = defineModel<string>('sourceSql', { required: true })

hljs.registerLanguage('sql', sql)

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "zh": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此粘贴 SQL，支持多语句。",
    "output-empty": "格式化后的 SQL 将显示在这里。"
  },
  "zh-CN": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此粘贴 SQL，支持多语句。",
    "output-empty": "格式化后的 SQL 将显示在这里。"
  },
  "zh-TW": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此貼上 SQL，支援多語句。",
    "output-empty": "格式化後的 SQL 會顯示在這裡。"
  },
  "zh-HK": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此貼上 SQL，支援多語句。",
    "output-empty": "格式化後的 SQL 會顯示在這裡。"
  },
  "es": {
    "source-sql": "SQL de origen",
    "formatted-sql": "SQL formateado",
    "input-placeholder": "Pega SQL aquí; se admiten múltiples sentencias.",
    "output-empty": "El SQL formateado aparecerá aquí."
  },
  "fr": {
    "source-sql": "SQL source",
    "formatted-sql": "SQL formaté",
    "input-placeholder": "Collez du SQL ici ; plusieurs requêtes sont prises en charge.",
    "output-empty": "Le SQL formaté s’affichera ici."
  },
  "de": {
    "source-sql": "Quell-SQL",
    "formatted-sql": "Formatiertes SQL",
    "input-placeholder": "SQL hier einfügen; mehrere Anweisungen werden unterstützt.",
    "output-empty": "Formatiertes SQL erscheint hier."
  },
  "it": {
    "source-sql": "SQL sorgente",
    "formatted-sql": "SQL formattato",
    "input-placeholder": "Incolla SQL qui; sono supportate più istruzioni.",
    "output-empty": "L’SQL formattato apparirà qui."
  },
  "ja": {
    "source-sql": "元の SQL",
    "formatted-sql": "整形済み SQL",
    "input-placeholder": "ここに SQL を貼り付けてください。複数文に対応します。",
    "output-empty": "整形後の SQL がここに表示されます。"
  },
  "ko": {
    "source-sql": "원본 SQL",
    "formatted-sql": "포맷된 SQL",
    "input-placeholder": "SQL을 여기에 붙여 넣으세요. 여러 문장을 지원합니다.",
    "output-empty": "포맷된 SQL이 여기에 표시됩니다."
  },
  "ru": {
    "source-sql": "Исходный SQL",
    "formatted-sql": "Форматированный SQL",
    "input-placeholder": "Вставьте SQL сюда; поддерживаются несколько выражений.",
    "output-empty": "Здесь появится форматированный SQL."
  },
  "pt": {
    "source-sql": "SQL de origem",
    "formatted-sql": "SQL formatado",
    "input-placeholder": "Cole SQL aqui; múltiplas instruções são suportadas.",
    "output-empty": "O SQL formatado aparecerá aqui."
  },
  "ar": {
    "source-sql": "SQL المصدر",
    "formatted-sql": "SQL المنسق",
    "input-placeholder": "الصق SQL هنا؛ يتم دعم عبارات متعددة.",
    "output-empty": "سيظهر SQL المنسق هنا."
  },
  "hi": {
    "source-sql": "स्रोत SQL",
    "formatted-sql": "फॉर्मेट किया हुआ SQL",
    "input-placeholder": "यहाँ SQL पेस्ट करें; कई स्टेटमेंट समर्थित हैं।",
    "output-empty": "फॉर्मेट किया हुआ SQL यहाँ दिखेगा।"
  },
  "tr": {
    "source-sql": "Kaynak SQL",
    "formatted-sql": "Biçimlendirilmiş SQL",
    "input-placeholder": "SQL’i buraya yapıştırın; birden çok ifade desteklenir.",
    "output-empty": "Biçimlendirilmiş SQL burada görünür."
  },
  "nl": {
    "source-sql": "Bron-SQL",
    "formatted-sql": "Geformatteerde SQL",
    "input-placeholder": "Plak hier SQL; meerdere statements worden ondersteund.",
    "output-empty": "Geformatteerde SQL verschijnt hier."
  },
  "sv": {
    "source-sql": "Käll-SQL",
    "formatted-sql": "Formaterad SQL",
    "input-placeholder": "Klistra in SQL här; flera satser stöds.",
    "output-empty": "Formaterad SQL visas här."
  },
  "pl": {
    "source-sql": "Źródłowy SQL",
    "formatted-sql": "Sformatowany SQL",
    "input-placeholder": "Wklej tutaj SQL; obsługiwanych jest wiele instrukcji.",
    "output-empty": "Sformatowany SQL pojawi się tutaj."
  },
  "vi": {
    "source-sql": "SQL nguồn",
    "formatted-sql": "SQL đã định dạng",
    "input-placeholder": "Dán SQL vào đây; hỗ trợ nhiều câu lệnh.",
    "output-empty": "SQL đã định dạng sẽ hiển thị tại đây."
  },
  "th": {
    "source-sql": "SQL ต้นฉบับ",
    "formatted-sql": "SQL ที่จัดรูปแบบแล้ว",
    "input-placeholder": "วาง SQL ที่นี่ รองรับหลายคำสั่ง",
    "output-empty": "SQL ที่จัดรูปแบบแล้วจะแสดงที่นี่"
  },
  "id": {
    "source-sql": "SQL sumber",
    "formatted-sql": "SQL terformat",
    "input-placeholder": "Tempel SQL di sini; beberapa pernyataan didukung.",
    "output-empty": "SQL terformat akan ditampilkan di sini."
  },
  "he": {
    "source-sql": "SQL מקורי",
    "formatted-sql": "SQL מעוצב",
    "input-placeholder": "הדבק כאן SQL; נתמכות כמה פקודות.",
    "output-empty": "ה-SQL המעוצב יופיע כאן."
  },
  "ms": {
    "source-sql": "SQL sumber",
    "formatted-sql": "SQL berformat",
    "input-placeholder": "Tampal SQL di sini; berbilang pernyataan disokong.",
    "output-empty": "SQL berformat akan dipaparkan di sini."
  },
  "no": {
    "source-sql": "Kilde-SQL",
    "formatted-sql": "Formatert SQL",
    "input-placeholder": "Lim inn SQL her; flere setninger støttes.",
    "output-empty": "Formatert SQL vises her."
  }
}
</i18n>
