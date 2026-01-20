<template>
  <ToolSection>
    <n-flex align="center" justify="space-between" :wrap="true" :size="12">
      <n-flex align="center" :wrap="true" :size="12">
        <n-text depth="2">{{ t('mode') }}</n-text>
        <n-radio-group v-model:value="mode" size="small">
          <n-radio-button value="curl-to-fetch">{{ t('curl-to-fetch') }}</n-radio-button>
          <n-radio-button value="fetch-to-curl">{{ t('fetch-to-curl') }}</n-radio-button>
        </n-radio-group>
      </n-flex>
      <n-flex :wrap="true" :size="12">
        <n-button text @click="applySample">{{ t('sample') }}</n-button>
        <n-button text @click="clearInput">{{ t('clear') }}</n-button>
        <CopyToClipboardButton :content="outputText" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" :download="downloadFilename">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <n-alert v-if="errorMessage" type="error" :title="t('errors-title')" :show-icon="true">
    {{ errorMessage }}
  </n-alert>
  <n-alert v-if="warnings.length" type="warning" :title="t('warnings-title')" :show-icon="true">
    <n-space vertical :size="4">
      <div v-for="warning in warnings" :key="warning">{{ warning }}</div>
    </n-space>
  </n-alert>

  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="inputLabel" :show-feedback="false">
        <n-input
          v-model:value="inputText"
          type="textarea"
          autosize
          :placeholder="inputPlaceholder"
        />
        <n-text v-if="showFetchHint" depth="3" class="input-hint">
          {{ t('fetch-hint') }}
        </n-text>
      </n-form-item-gi>
      <n-form-item-gi :label="outputLabel" :show-feedback="false">
        <n-card size="small">
          <n-code :code="outputText" :language="outputLanguage" :hljs="hljs" word-wrap />
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NRadioButton,
  NRadioGroup,
  NSpace,
  NText,
} from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'
import { convertCurlToFetch, convertFetchToCurl } from '../converter'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('bash', bash)

type Mode = 'curl-to-fetch' | 'fetch-to-curl'

const { t } = useI18n()

const sampleCurl = `curl -X POST 'https://api.example.com/v1/messages' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token' \\
  --data-raw '{"message":"Hello"}'`

const sampleFetch = `const response = await fetch('https://api.example.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token'
  },
  body: JSON.stringify({ message: 'Hello' })
})`

const mode = useStorage<Mode>('tools:curl-fetch-converter:mode', 'curl-to-fetch')
const curlInput = useStorage<string>('tools:curl-fetch-converter:curl-input', sampleCurl)
const fetchInput = useStorage<string>('tools:curl-fetch-converter:fetch-input', sampleFetch)

const inputText = computed({
  get: () => (mode.value === 'curl-to-fetch' ? curlInput.value : fetchInput.value),
  set: (value: string) => {
    if (mode.value === 'curl-to-fetch') {
      curlInput.value = value
    } else {
      fetchInput.value = value
    }
  },
})

const conversion = computed(() => {
  return mode.value === 'curl-to-fetch'
    ? convertCurlToFetch(curlInput.value)
    : convertFetchToCurl(fetchInput.value)
})

const outputText = computed(() => conversion.value.output)
const warnings = computed(() => conversion.value.warnings)
const errorMessage = computed(() => conversion.value.error ?? '')

const outputLanguage = computed(() => (mode.value === 'curl-to-fetch' ? 'javascript' : 'bash'))
const downloadFilename = computed(() =>
  mode.value === 'curl-to-fetch' ? 'converted.js' : 'converted.sh',
)
const inputLabel = computed(() =>
  mode.value === 'curl-to-fetch' ? t('input-curl') : t('input-fetch'),
)
const outputLabel = computed(() =>
  mode.value === 'curl-to-fetch' ? t('output-fetch') : t('output-curl'),
)
const inputPlaceholder = computed(() =>
  mode.value === 'curl-to-fetch' ? t('curl-placeholder') : t('fetch-placeholder'),
)
const showFetchHint = computed(() => mode.value === 'fetch-to-curl')

const downloadBlob = computed(() =>
  new Blob([outputText.value], {
    type:
      mode.value === 'curl-to-fetch'
        ? 'text/javascript;charset=utf-8'
        : 'text/plain;charset=utf-8',
  }),
)
const downloadUrl = useObjectUrl(downloadBlob)

function applySample(): void {
  inputText.value = mode.value === 'curl-to-fetch' ? sampleCurl : sampleFetch
}

function clearInput(): void {
  inputText.value = ''
}
</script>

<i18n lang="json">
{
  "en": {
    "mode": "Mode",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL Command",
    "input-fetch": "Fetch Snippet",
    "output-fetch": "Fetch Code",
    "output-curl": "cURL Command",
    "curl-placeholder": "Paste a cURL command here...",
    "fetch-placeholder": "Paste a fetch() snippet here...",
    "fetch-hint": "Supports fetch(url, options) with literal values.",
    "sample": "Use sample",
    "clear": "Clear",
    "download": "Download",
    "warnings-title": "Warnings",
    "errors-title": "Errors"
  },
  "zh": {
    "mode": "模式",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL 命令",
    "input-fetch": "Fetch 片段",
    "output-fetch": "Fetch 代码",
    "output-curl": "cURL 命令",
    "curl-placeholder": "在此粘贴 cURL 命令...",
    "fetch-placeholder": "在此粘贴 fetch() 代码...",
    "fetch-hint": "支持 fetch(url, options) 且值为字面量。",
    "sample": "使用示例",
    "clear": "清空",
    "download": "下载",
    "warnings-title": "警告",
    "errors-title": "错误"
  },
  "zh-CN": {
    "mode": "模式",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL 命令",
    "input-fetch": "Fetch 片段",
    "output-fetch": "Fetch 代码",
    "output-curl": "cURL 命令",
    "curl-placeholder": "在此粘贴 cURL 命令...",
    "fetch-placeholder": "在此粘贴 fetch() 代码...",
    "fetch-hint": "支持 fetch(url, options) 且值为字面量。",
    "sample": "使用示例",
    "clear": "清空",
    "download": "下载",
    "warnings-title": "警告",
    "errors-title": "错误"
  },
  "zh-TW": {
    "mode": "模式",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL 命令",
    "input-fetch": "Fetch 片段",
    "output-fetch": "Fetch 程式碼",
    "output-curl": "cURL 命令",
    "curl-placeholder": "在此貼上 cURL 命令...",
    "fetch-placeholder": "在此貼上 fetch() 程式碼...",
    "fetch-hint": "支援 fetch(url, options) 且值為字面量。",
    "sample": "使用範例",
    "clear": "清除",
    "download": "下載",
    "warnings-title": "警告",
    "errors-title": "錯誤"
  },
  "zh-HK": {
    "mode": "模式",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL 命令",
    "input-fetch": "Fetch 片段",
    "output-fetch": "Fetch 程式碼",
    "output-curl": "cURL 命令",
    "curl-placeholder": "在此貼上 cURL 命令...",
    "fetch-placeholder": "在此貼上 fetch() 程式碼...",
    "fetch-hint": "支援 fetch(url, options) 且值為字面量。",
    "sample": "使用範例",
    "clear": "清除",
    "download": "下載",
    "warnings-title": "警告",
    "errors-title": "錯誤"
  },
  "es": {
    "mode": "Modo",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Comando cURL",
    "input-fetch": "Fragmento Fetch",
    "output-fetch": "Código Fetch",
    "output-curl": "Comando cURL",
    "curl-placeholder": "Pega un comando cURL aquí...",
    "fetch-placeholder": "Pega un fragmento fetch() aquí...",
    "fetch-hint": "Admite fetch(url, options) con valores literales.",
    "sample": "Usar ejemplo",
    "clear": "Borrar",
    "download": "Descargar",
    "warnings-title": "Advertencias",
    "errors-title": "Errores"
  },
  "fr": {
    "mode": "Mode",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Commande cURL",
    "input-fetch": "Extrait Fetch",
    "output-fetch": "Code Fetch",
    "output-curl": "Commande cURL",
    "curl-placeholder": "Collez une commande cURL ici...",
    "fetch-placeholder": "Collez un extrait fetch() ici...",
    "fetch-hint": "Prend en charge fetch(url, options) avec des valeurs littérales.",
    "sample": "Utiliser l'exemple",
    "clear": "Effacer",
    "download": "Télécharger",
    "warnings-title": "Avertissements",
    "errors-title": "Erreurs"
  },
  "de": {
    "mode": "Modus",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL-Befehl",
    "input-fetch": "Fetch-Snippet",
    "output-fetch": "Fetch-Code",
    "output-curl": "cURL-Befehl",
    "curl-placeholder": "Füge hier einen cURL-Befehl ein...",
    "fetch-placeholder": "Füge hier ein fetch()-Snippet ein...",
    "fetch-hint": "Unterstützt fetch(url, options) mit Literalwerten.",
    "sample": "Beispiel verwenden",
    "clear": "Leeren",
    "download": "Herunterladen",
    "warnings-title": "Warnungen",
    "errors-title": "Fehler"
  },
  "it": {
    "mode": "Modalità",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Comando cURL",
    "input-fetch": "Snippet Fetch",
    "output-fetch": "Codice Fetch",
    "output-curl": "Comando cURL",
    "curl-placeholder": "Incolla qui un comando cURL...",
    "fetch-placeholder": "Incolla qui uno snippet fetch()...",
    "fetch-hint": "Supporta fetch(url, options) con valori letterali.",
    "sample": "Usa esempio",
    "clear": "Cancella",
    "download": "Scarica",
    "warnings-title": "Avvisi",
    "errors-title": "Errori"
  },
  "ja": {
    "mode": "モード",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL コマンド",
    "input-fetch": "Fetch スニペット",
    "output-fetch": "Fetch コード",
    "output-curl": "cURL コマンド",
    "curl-placeholder": "ここに cURL コマンドを貼り付け...",
    "fetch-placeholder": "ここに fetch() スニペットを貼り付け...",
    "fetch-hint": "fetch(url, options) のリテラル値に対応。",
    "sample": "サンプルを使用",
    "clear": "クリア",
    "download": "ダウンロード",
    "warnings-title": "警告",
    "errors-title": "エラー"
  },
  "ko": {
    "mode": "모드",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL 명령",
    "input-fetch": "Fetch 스니펫",
    "output-fetch": "Fetch 코드",
    "output-curl": "cURL 명령",
    "curl-placeholder": "여기에 cURL 명령을 붙여넣기...",
    "fetch-placeholder": "여기에 fetch() 스니펫을 붙여넣기...",
    "fetch-hint": "리터럴 값의 fetch(url, options)를 지원합니다.",
    "sample": "샘플 사용",
    "clear": "지우기",
    "download": "다운로드",
    "warnings-title": "경고",
    "errors-title": "오류"
  },
  "ru": {
    "mode": "Режим",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Команда cURL",
    "input-fetch": "Фрагмент Fetch",
    "output-fetch": "Код Fetch",
    "output-curl": "Команда cURL",
    "curl-placeholder": "Вставьте команду cURL здесь...",
    "fetch-placeholder": "Вставьте фрагмент fetch() здесь...",
    "fetch-hint": "Поддерживает fetch(url, options) с литеральными значениями.",
    "sample": "Использовать пример",
    "clear": "Очистить",
    "download": "Скачать",
    "warnings-title": "Предупреждения",
    "errors-title": "Ошибки"
  },
  "pt": {
    "mode": "Modo",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Comando cURL",
    "input-fetch": "Trecho Fetch",
    "output-fetch": "Código Fetch",
    "output-curl": "Comando cURL",
    "curl-placeholder": "Cole um comando cURL aqui...",
    "fetch-placeholder": "Cole um trecho fetch() aqui...",
    "fetch-hint": "Suporta fetch(url, options) com valores literais.",
    "sample": "Usar exemplo",
    "clear": "Limpar",
    "download": "Baixar",
    "warnings-title": "Avisos",
    "errors-title": "Erros"
  },
  "ar": {
    "mode": "الوضع",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "أمر cURL",
    "input-fetch": "مقطع Fetch",
    "output-fetch": "كود Fetch",
    "output-curl": "أمر cURL",
    "curl-placeholder": "الصق أمر cURL هنا...",
    "fetch-placeholder": "الصق مقطع fetch() هنا...",
    "fetch-hint": "يدعم fetch(url, options) بقيم حرفية.",
    "sample": "استخدم المثال",
    "clear": "مسح",
    "download": "تنزيل",
    "warnings-title": "تحذيرات",
    "errors-title": "أخطاء"
  },
  "hi": {
    "mode": "मोड",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL कमांड",
    "input-fetch": "Fetch स्निपेट",
    "output-fetch": "Fetch कोड",
    "output-curl": "cURL कमांड",
    "curl-placeholder": "यहाँ cURL कमांड पेस्ट करें...",
    "fetch-placeholder": "यहाँ fetch() स्निपेट पेस्ट करें...",
    "fetch-hint": "fetch(url, options) के literal मान समर्थित हैं।",
    "sample": "नमूना उपयोग करें",
    "clear": "साफ करें",
    "download": "डाउनलोड",
    "warnings-title": "चेतावनियाँ",
    "errors-title": "त्रुटियाँ"
  },
  "tr": {
    "mode": "Mod",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL Komutu",
    "input-fetch": "Fetch Parçası",
    "output-fetch": "Fetch Kodu",
    "output-curl": "cURL Komutu",
    "curl-placeholder": "Buraya bir cURL komutu yapıştırın...",
    "fetch-placeholder": "Buraya fetch() parçası yapıştırın...",
    "fetch-hint": "fetch(url, options) literal değerlerini destekler.",
    "sample": "Örnek kullan",
    "clear": "Temizle",
    "download": "İndir",
    "warnings-title": "Uyarılar",
    "errors-title": "Hatalar"
  },
  "nl": {
    "mode": "Modus",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL-opdracht",
    "input-fetch": "Fetch-fragment",
    "output-fetch": "Fetch-code",
    "output-curl": "cURL-opdracht",
    "curl-placeholder": "Plak hier een cURL-opdracht...",
    "fetch-placeholder": "Plak hier een fetch()-fragment...",
    "fetch-hint": "Ondersteunt fetch(url, options) met letterlijke waarden.",
    "sample": "Voorbeeld gebruiken",
    "clear": "Wissen",
    "download": "Downloaden",
    "warnings-title": "Waarschuwingen",
    "errors-title": "Fouten"
  },
  "sv": {
    "mode": "Läge",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL-kommando",
    "input-fetch": "Fetch-utdrag",
    "output-fetch": "Fetch-kod",
    "output-curl": "cURL-kommando",
    "curl-placeholder": "Klistra in ett cURL-kommando här...",
    "fetch-placeholder": "Klistra in ett fetch()-utdrag här...",
    "fetch-hint": "Stödjer fetch(url, options) med litterala värden.",
    "sample": "Använd exempel",
    "clear": "Rensa",
    "download": "Ladda ner",
    "warnings-title": "Varningar",
    "errors-title": "Fel"
  },
  "pl": {
    "mode": "Tryb",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Polecenie cURL",
    "input-fetch": "Fragment Fetch",
    "output-fetch": "Kod Fetch",
    "output-curl": "Polecenie cURL",
    "curl-placeholder": "Wklej tutaj polecenie cURL...",
    "fetch-placeholder": "Wklej tutaj fragment fetch()...",
    "fetch-hint": "Obsługuje fetch(url, options) z wartościami literałowymi.",
    "sample": "Użyj przykładu",
    "clear": "Wyczyść",
    "download": "Pobierz",
    "warnings-title": "Ostrzeżenia",
    "errors-title": "Błędy"
  },
  "vi": {
    "mode": "Chế độ",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Lệnh cURL",
    "input-fetch": "Đoạn Fetch",
    "output-fetch": "Mã Fetch",
    "output-curl": "Lệnh cURL",
    "curl-placeholder": "Dán lệnh cURL vào đây...",
    "fetch-placeholder": "Dán đoạn fetch() vào đây...",
    "fetch-hint": "Hỗ trợ fetch(url, options) với giá trị literal.",
    "sample": "Dùng ví dụ",
    "clear": "Xóa",
    "download": "Tải xuống",
    "warnings-title": "Cảnh báo",
    "errors-title": "Lỗi"
  },
  "th": {
    "mode": "โหมด",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "คำสั่ง cURL",
    "input-fetch": "สไนเป็ต Fetch",
    "output-fetch": "โค้ด Fetch",
    "output-curl": "คำสั่ง cURL",
    "curl-placeholder": "วางคำสั่ง cURL ที่นี่...",
    "fetch-placeholder": "วางสไนเป็ต fetch() ที่นี่...",
    "fetch-hint": "รองรับ fetch(url, options) ที่เป็นค่าแบบลิเทอรัล",
    "sample": "ใช้ตัวอย่าง",
    "clear": "ล้าง",
    "download": "ดาวน์โหลด",
    "warnings-title": "คำเตือน",
    "errors-title": "ข้อผิดพลาด"
  },
  "id": {
    "mode": "Mode",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Perintah cURL",
    "input-fetch": "Cuplikan Fetch",
    "output-fetch": "Kode Fetch",
    "output-curl": "Perintah cURL",
    "curl-placeholder": "Tempel perintah cURL di sini...",
    "fetch-placeholder": "Tempel cuplikan fetch() di sini...",
    "fetch-hint": "Mendukung fetch(url, options) dengan nilai literal.",
    "sample": "Gunakan contoh",
    "clear": "Bersihkan",
    "download": "Unduh",
    "warnings-title": "Peringatan",
    "errors-title": "Kesalahan"
  },
  "he": {
    "mode": "מצב",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "פקודת cURL",
    "input-fetch": "קטע Fetch",
    "output-fetch": "קוד Fetch",
    "output-curl": "פקודת cURL",
    "curl-placeholder": "הדביקו פקודת cURL כאן...",
    "fetch-placeholder": "הדביקו קטע fetch() כאן...",
    "fetch-hint": "תומך ב‑fetch(url, options) עם ערכים ליטרליים.",
    "sample": "השתמשו בדוגמה",
    "clear": "נקה",
    "download": "הורדה",
    "warnings-title": "אזהרות",
    "errors-title": "שגיאות"
  },
  "ms": {
    "mode": "Mod",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "Arahan cURL",
    "input-fetch": "Petikan Fetch",
    "output-fetch": "Kod Fetch",
    "output-curl": "Arahan cURL",
    "curl-placeholder": "Tampal arahan cURL di sini...",
    "fetch-placeholder": "Tampal petikan fetch() di sini...",
    "fetch-hint": "Menyokong fetch(url, options) dengan nilai literal.",
    "sample": "Guna contoh",
    "clear": "Kosongkan",
    "download": "Muat turun",
    "warnings-title": "Amaran",
    "errors-title": "Ralat"
  },
  "no": {
    "mode": "Modus",
    "curl-to-fetch": "cURL → Fetch",
    "fetch-to-curl": "Fetch → cURL",
    "input-curl": "cURL-kommando",
    "input-fetch": "Fetch-utdrag",
    "output-fetch": "Fetch-kode",
    "output-curl": "cURL-kommando",
    "curl-placeholder": "Lim inn en cURL-kommando her...",
    "fetch-placeholder": "Lim inn et fetch()-utdrag her...",
    "fetch-hint": "Støtter fetch(url, options) med literale verdier.",
    "sample": "Bruk eksempel",
    "clear": "Tøm",
    "download": "Last ned",
    "warnings-title": "Advarsler",
    "errors-title": "Feil"
  }
}
</i18n>

<style scoped>
.input-hint {
  display: block;
  margin-top: 6px;
}
</style>
