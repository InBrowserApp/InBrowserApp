<template>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <div class="field-label">
            <span>{{ t('input-label') }}</span>
            <span class="field-action">
              <n-button text :disabled="!canUseCurrent" @click="emit('use-current')">
                <template #icon>
                  <n-icon :component="GlobePerson20Regular" />
                </template>
                {{ t('use-current') }}
              </n-button>
            </span>
          </div>
        </template>
        <n-input
          v-model:value="userAgent"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 14 }"
          :placeholder="t('input-placeholder')"
          :status="inputStatus"
        />
        <template #feedback>
          <n-text v-show="inputError" type="error">{{ t('input-error') }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <div class="field-label">
            <span>{{ t('json-output') }}</span>
            <span class="field-action">
              <CopyToClipboardButton v-if="hasOutput" :content="renderedJson" />
            </span>
          </div>
        </template>
        <n-card v-if="hasOutput" size="small">
          <n-code :code="renderedJson" language="json" :hljs="hljs" word-wrap />
        </n-card>
        <n-empty v-else :description="t('empty-state')" />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import type { FormValidationStatus } from 'naive-ui'
import { NButton, NCard, NCode, NEmpty, NFormItemGi, NGrid, NIcon, NInput, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import GlobePerson20Regular from '@vicons/fluent/GlobePerson20Regular'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'

defineProps<{
  inputStatus?: FormValidationStatus
  inputError: boolean
  canUseCurrent: boolean
  hasOutput: boolean
  renderedJson: string
}>()

const emit = defineEmits<{
  'use-current': []
}>()

const userAgent = defineModel<string>('userAgent', { required: true })

hljs.registerLanguage('json', jsonLang)

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "use-current": "Use my user agent",
    "input-label": "User Agent",
    "input-placeholder": "Paste a user agent string here...",
    "input-error": "Enter a user agent string to parse.",
    "json-output": "JSON Output",
    "empty-state": "Paste a user agent string to see parsed details."
  },
  "zh": {
    "use-current": "使用我的用户代理",
    "input-label": "用户代理（User-Agent）",
    "input-placeholder": "在此粘贴 User-Agent 字符串...",
    "input-error": "请输入要解析的 User-Agent 字符串。",
    "json-output": "JSON 输出",
    "empty-state": "粘贴 User-Agent 字符串以查看解析结果。"
  },
  "zh-CN": {
    "use-current": "使用我的用户代理",
    "input-label": "用户代理（User-Agent）",
    "input-placeholder": "在此粘贴 User-Agent 字符串...",
    "input-error": "请输入要解析的 User-Agent 字符串。",
    "json-output": "JSON 输出",
    "empty-state": "粘贴 User-Agent 字符串以查看解析结果。"
  },
  "zh-TW": {
    "use-current": "使用我的使用者代理",
    "input-label": "使用者代理（User-Agent）",
    "input-placeholder": "在此貼上 User-Agent 字串...",
    "input-error": "請輸入要解析的 User-Agent 字串。",
    "json-output": "JSON 輸出",
    "empty-state": "貼上 User-Agent 字串以查看解析結果。"
  },
  "zh-HK": {
    "use-current": "使用我的使用者代理",
    "input-label": "使用者代理（User-Agent）",
    "input-placeholder": "在此貼上 User-Agent 字串...",
    "input-error": "請輸入要解析的 User-Agent 字串。",
    "json-output": "JSON 輸出",
    "empty-state": "貼上 User-Agent 字串以查看解析結果。"
  },
  "es": {
    "use-current": "Usar mi user agent",
    "input-label": "User Agent",
    "input-placeholder": "Pega una cadena de user agent aquí...",
    "input-error": "Introduce una cadena de user agent para analizar.",
    "json-output": "Salida JSON",
    "empty-state": "Pega una cadena de user agent para ver los detalles."
  },
  "fr": {
    "use-current": "Utiliser mon user agent",
    "input-label": "User Agent",
    "input-placeholder": "Collez une chaîne User-Agent ici...",
    "input-error": "Saisissez une chaîne User-Agent à analyser.",
    "json-output": "Sortie JSON",
    "empty-state": "Collez une chaîne User-Agent pour voir les détails."
  },
  "de": {
    "use-current": "Meinen User Agent verwenden",
    "input-label": "User Agent",
    "input-placeholder": "User-Agent-String hier einfügen...",
    "input-error": "Gib einen User-Agent-String zum Parsen ein.",
    "json-output": "JSON-Ausgabe",
    "empty-state": "Füge einen User-Agent-String ein, um Details zu sehen."
  },
  "it": {
    "use-current": "Usa il mio user agent",
    "input-label": "User Agent",
    "input-placeholder": "Incolla qui una stringa User-Agent...",
    "input-error": "Inserisci una stringa User-Agent da analizzare.",
    "json-output": "Output JSON",
    "empty-state": "Incolla una stringa User-Agent per vedere i dettagli."
  },
  "ja": {
    "use-current": "現在のユーザーエージェントを使用",
    "input-label": "ユーザーエージェント（User-Agent）",
    "input-placeholder": "User-Agent 文字列をここに貼り付け...",
    "input-error": "解析する User-Agent 文字列を入力してください。",
    "json-output": "JSON 出力",
    "empty-state": "User-Agent 文字列を貼り付けて解析結果を表示します。"
  },
  "ko": {
    "use-current": "내 사용자 에이전트 사용",
    "input-label": "사용자 에이전트",
    "input-placeholder": "User-Agent 문자열을 여기에 붙여넣기...",
    "input-error": "파싱할 User-Agent 문자열을 입력하세요.",
    "json-output": "JSON 출력",
    "empty-state": "User-Agent 문자열을 붙여넣어 결과를 확인하세요."
  },
  "ru": {
    "use-current": "Использовать мой user agent",
    "input-label": "User Agent",
    "input-placeholder": "Вставьте строку User-Agent здесь...",
    "input-error": "Введите строку User-Agent для разбора.",
    "json-output": "Вывод JSON",
    "empty-state": "Вставьте строку User-Agent, чтобы увидеть результаты."
  },
  "pt": {
    "use-current": "Usar meu user agent",
    "input-label": "User Agent",
    "input-placeholder": "Cole uma string User-Agent aqui...",
    "input-error": "Insira uma string User-Agent para analisar.",
    "json-output": "Saída JSON",
    "empty-state": "Cole uma string User-Agent para ver os detalhes."
  },
  "ar": {
    "use-current": "استخدم وكيل المستخدم الخاص بي",
    "input-label": "وكيل المستخدم",
    "input-placeholder": "الصق سلسلة User-Agent هنا...",
    "input-error": "أدخل سلسلة User-Agent لتحليلها.",
    "json-output": "مخرجات JSON",
    "empty-state": "الصق سلسلة User-Agent لعرض التفاصيل."
  },
  "hi": {
    "use-current": "मेरा User-Agent उपयोग करें",
    "input-label": "User-Agent",
    "input-placeholder": "User-Agent स्ट्रिंग यहाँ पेस्ट करें...",
    "input-error": "विश्लेषण के लिए User-Agent स्ट्रिंग दर्ज करें।",
    "json-output": "JSON आउटपुट",
    "empty-state": "परिणाम देखने के लिए User-Agent स्ट्रिंग पेस्ट करें।"
  },
  "tr": {
    "use-current": "Kendi user agent'ımı kullan",
    "input-label": "User Agent",
    "input-placeholder": "User-Agent dizesini buraya yapıştırın...",
    "input-error": "Ayrıştırmak için bir User-Agent dizesi girin.",
    "json-output": "JSON çıktısı",
    "empty-state": "Ayrıntıları görmek için bir User-Agent dizesi yapıştırın."
  },
  "nl": {
    "use-current": "Gebruik mijn user agent",
    "input-label": "User Agent",
    "input-placeholder": "Plak hier een User-Agent-string...",
    "input-error": "Voer een User-Agent-string in om te parseren.",
    "json-output": "JSON-uitvoer",
    "empty-state": "Plak een User-Agent-string om details te zien."
  },
  "sv": {
    "use-current": "Använd min user agent",
    "input-label": "User Agent",
    "input-placeholder": "Klistra in en User-Agent-sträng här...",
    "input-error": "Ange en User-Agent-sträng att tolka.",
    "json-output": "JSON-utdata",
    "empty-state": "Klistra in en User-Agent-sträng för att se detaljer."
  },
  "pl": {
    "use-current": "Użyj mojego user agenta",
    "input-label": "User Agent",
    "input-placeholder": "Wklej tutaj ciąg User-Agent...",
    "input-error": "Wprowadź ciąg User-Agent do analizy.",
    "json-output": "Wyjście JSON",
    "empty-state": "Wklej ciąg User-Agent, aby zobaczyć szczegóły."
  },
  "vi": {
    "use-current": "Dùng User-Agent của tôi",
    "input-label": "User Agent",
    "input-placeholder": "Dán chuỗi User-Agent vào đây...",
    "input-error": "Nhập chuỗi User-Agent để phân tích.",
    "json-output": "Kết quả JSON",
    "empty-state": "Dán chuỗi User-Agent để xem chi tiết."
  },
  "th": {
    "use-current": "ใช้ User-Agent ของฉัน",
    "input-label": "User Agent",
    "input-placeholder": "วางสตริง User-Agent ที่นี่...",
    "input-error": "กรุณากรอกสตริง User-Agent เพื่อวิเคราะห์",
    "json-output": "เอาต์พุต JSON",
    "empty-state": "วางสตริง User-Agent เพื่อดูรายละเอียด"
  },
  "id": {
    "use-current": "Gunakan user agent saya",
    "input-label": "User Agent",
    "input-placeholder": "Tempel string User-Agent di sini...",
    "input-error": "Masukkan string User-Agent untuk dianalisis.",
    "json-output": "Keluaran JSON",
    "empty-state": "Tempel string User-Agent untuk melihat detail."
  },
  "he": {
    "use-current": "השתמש ב‑User-Agent שלי",
    "input-label": "User-Agent",
    "input-placeholder": "הדביקו כאן מחרוזת User-Agent...",
    "input-error": "הזינו מחרוזת User-Agent לניתוח.",
    "json-output": "פלט JSON",
    "empty-state": "הדביקו מחרוזת User-Agent כדי לראות פרטים."
  },
  "ms": {
    "use-current": "Gunakan user agent saya",
    "input-label": "User Agent",
    "input-placeholder": "Tampal rentetan User-Agent di sini...",
    "input-error": "Masukkan rentetan User-Agent untuk dianalisis.",
    "json-output": "Output JSON",
    "empty-state": "Tampal rentetan User-Agent untuk melihat butiran."
  },
  "no": {
    "use-current": "Bruk min user agent",
    "input-label": "User Agent",
    "input-placeholder": "Lim inn en User-Agent-streng her...",
    "input-error": "Skriv inn en User-Agent-streng for å analysere.",
    "json-output": "JSON-utdata",
    "empty-state": "Lim inn en User-Agent-streng for å se detaljer."
  }
}
</i18n>

<style scoped>
.field-label {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}

.field-action {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
}
</style>
