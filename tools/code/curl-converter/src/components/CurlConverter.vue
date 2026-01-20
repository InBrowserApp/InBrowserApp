<template>
  <ToolSection>
    <n-flex align="center" justify="space-between" :wrap="true" :size="12">
      <n-flex align="center" :wrap="true" :size="12">
        <n-text depth="2">{{ t('output-language') }}</n-text>
        <n-select
          v-model:value="targetId"
          :options="targetOptions"
          filterable
          size="small"
          :placeholder="t('language-placeholder')"
          style="min-width: 220px"
        />
      </n-flex>
      <n-flex :wrap="true" :size="12">
        <n-button text @click="applySample">
          <template #icon>
            <n-icon :component="ClipboardPaste16Regular" />
          </template>
          {{ t('sample') }}
        </n-button>
        <n-button text @click="clearInput">
          <template #icon>
            <n-icon :component="Delete16Regular" />
          </template>
          {{ t('clear') }}
        </n-button>
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
      <n-form-item-gi :label="t('input-curl')" :show-feedback="false">
        <n-input
          v-model:value="curlInput"
          type="textarea"
          autosize
          :placeholder="t('curl-placeholder')"
        />
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
  NSelect,
  NSpace,
  NText,
} from 'naive-ui'
import type { SelectGroupOption, SelectOption } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import ClipboardPaste16Regular from '@vicons/fluent/ClipboardPaste16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import clojure from 'highlight.js/lib/languages/clojure'
import csharp from 'highlight.js/lib/languages/csharp'
import dart from 'highlight.js/lib/languages/dart'
import elixir from 'highlight.js/lib/languages/elixir'
import go from 'highlight.js/lib/languages/go'
import http from 'highlight.js/lib/languages/http'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import julia from 'highlight.js/lib/languages/julia'
import kotlin from 'highlight.js/lib/languages/kotlin'
import lua from 'highlight.js/lib/languages/lua'
import matlab from 'highlight.js/lib/languages/matlab'
import objectivec from 'highlight.js/lib/languages/objectivec'
import ocaml from 'highlight.js/lib/languages/ocaml'
import perl from 'highlight.js/lib/languages/perl'
import php from 'highlight.js/lib/languages/php'
import powershell from 'highlight.js/lib/languages/powershell'
import python from 'highlight.js/lib/languages/python'
import r from 'highlight.js/lib/languages/r'
import ruby from 'highlight.js/lib/languages/ruby'
import rust from 'highlight.js/lib/languages/rust'
import swift from 'highlight.js/lib/languages/swift'
import yaml from 'highlight.js/lib/languages/yaml'
import { convertCurlToTarget } from '../converter'
import { defaultTargetId, getTargetConfig, targetGroups } from '../targets'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('c', c)
hljs.registerLanguage('clojure', clojure)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('dart', dart)
hljs.registerLanguage('elixir', elixir)
hljs.registerLanguage('go', go)
hljs.registerLanguage('http', http)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('julia', julia)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('lua', lua)
hljs.registerLanguage('matlab', matlab)
hljs.registerLanguage('objectivec', objectivec)
hljs.registerLanguage('ocaml', ocaml)
hljs.registerLanguage('perl', perl)
hljs.registerLanguage('php', php)
hljs.registerLanguage('powershell', powershell)
hljs.registerLanguage('python', python)
hljs.registerLanguage('r', r)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('yaml', yaml)

const { t } = useI18n()

const sampleCurl = `curl -X POST 'https://api.example.com/v1/messages' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token' \\
  --data-raw '{"message":"Hello"}'`

const targetId = useStorage<string>('tools:curl-converter:target', defaultTargetId)
const curlInput = useStorage<string>('tools:curl-converter:curl-input', sampleCurl)

if (!getTargetConfig(targetId.value)) {
  targetId.value = defaultTargetId
}

const targetOptions: Array<SelectOption | SelectGroupOption> = targetGroups.map((group) => ({
  type: 'group',
  label: group.label,
  key: group.label,
  children: group.options.map((option) => ({
    label: option.label,
    value: option.id,
  })),
}))

const conversion = computed(() => convertCurlToTarget(curlInput.value, targetId.value))

const outputText = computed(() => conversion.value.output)
const warnings = computed(() => conversion.value.warnings)
const errorMessage = computed(() => conversion.value.error ?? '')

const selectedTarget = computed(() => getTargetConfig(targetId.value))
const outputLanguage = computed(() => selectedTarget.value?.hljs ?? 'plaintext')
const outputLabel = computed(() => {
  const label = selectedTarget.value?.label
  return label ? `${t('output-code')} (${label})` : t('output-code')
})
const downloadFilename = computed(() => {
  const extension = selectedTarget.value?.extension ?? '.txt'
  return `converted${extension}`
})

const downloadBlob = computed(
  () => new Blob([outputText.value], { type: 'text/plain;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

function applySample(): void {
  curlInput.value = sampleCurl
}

function clearInput(): void {
  curlInput.value = ''
}
</script>

<i18n lang="json">
{
  "en": {
    "output-language": "Output Language",
    "language-placeholder": "Select a language",
    "input-curl": "cURL Command",
    "output-code": "Converted Code",
    "curl-placeholder": "Paste a cURL command here...",
    "sample": "Use sample",
    "clear": "Clear",
    "download": "Download",
    "warnings-title": "Warnings",
    "errors-title": "Errors"
  },
  "zh": {
    "output-language": "输出语言",
    "language-placeholder": "选择语言",
    "input-curl": "cURL 命令",
    "output-code": "转换后的代码",
    "curl-placeholder": "在此粘贴 cURL 命令...",
    "sample": "使用示例",
    "clear": "清空",
    "download": "下载",
    "warnings-title": "警告",
    "errors-title": "错误"
  },
  "zh-CN": {
    "output-language": "输出语言",
    "language-placeholder": "选择语言",
    "input-curl": "cURL 命令",
    "output-code": "转换后的代码",
    "curl-placeholder": "在此粘贴 cURL 命令...",
    "sample": "使用示例",
    "clear": "清空",
    "download": "下载",
    "warnings-title": "警告",
    "errors-title": "错误"
  },
  "zh-TW": {
    "output-language": "輸出語言",
    "language-placeholder": "選擇語言",
    "input-curl": "cURL 命令",
    "output-code": "轉換後的程式碼",
    "curl-placeholder": "在此貼上 cURL 命令...",
    "sample": "使用範例",
    "clear": "清除",
    "download": "下載",
    "warnings-title": "警告",
    "errors-title": "錯誤"
  },
  "zh-HK": {
    "output-language": "輸出語言",
    "language-placeholder": "選擇語言",
    "input-curl": "cURL 命令",
    "output-code": "轉換後的程式碼",
    "curl-placeholder": "在此貼上 cURL 命令...",
    "sample": "使用範例",
    "clear": "清除",
    "download": "下載",
    "warnings-title": "警告",
    "errors-title": "錯誤"
  },
  "es": {
    "output-language": "Idioma de salida",
    "language-placeholder": "Selecciona un idioma",
    "input-curl": "Comando cURL",
    "output-code": "Código convertido",
    "curl-placeholder": "Pega un comando cURL aquí...",
    "sample": "Usar ejemplo",
    "clear": "Limpiar",
    "download": "Descargar",
    "warnings-title": "Advertencias",
    "errors-title": "Errores"
  },
  "fr": {
    "output-language": "Langue de sortie",
    "language-placeholder": "Sélectionner une langue",
    "input-curl": "Commande cURL",
    "output-code": "Code converti",
    "curl-placeholder": "Collez une commande cURL ici...",
    "sample": "Utiliser un exemple",
    "clear": "Effacer",
    "download": "Télécharger",
    "warnings-title": "Avertissements",
    "errors-title": "Erreurs"
  },
  "de": {
    "output-language": "Ausgabesprache",
    "language-placeholder": "Sprache auswählen",
    "input-curl": "cURL-Befehl",
    "output-code": "Konvertierter Code",
    "curl-placeholder": "Füge hier einen cURL-Befehl ein...",
    "sample": "Beispiel verwenden",
    "clear": "Leeren",
    "download": "Herunterladen",
    "warnings-title": "Warnungen",
    "errors-title": "Fehler"
  },
  "it": {
    "output-language": "Lingua di output",
    "language-placeholder": "Seleziona una lingua",
    "input-curl": "Comando cURL",
    "output-code": "Codice convertito",
    "curl-placeholder": "Incolla un comando cURL qui...",
    "sample": "Usa esempio",
    "clear": "Cancella",
    "download": "Scarica",
    "warnings-title": "Avvisi",
    "errors-title": "Errori"
  },
  "ja": {
    "output-language": "出力言語",
    "language-placeholder": "言語を選択",
    "input-curl": "cURL コマンド",
    "output-code": "変換後のコード",
    "curl-placeholder": "ここに cURL コマンドを貼り付け...",
    "sample": "サンプルを使用",
    "clear": "クリア",
    "download": "ダウンロード",
    "warnings-title": "警告",
    "errors-title": "エラー"
  },
  "ko": {
    "output-language": "출력 언어",
    "language-placeholder": "언어 선택",
    "input-curl": "cURL 명령",
    "output-code": "변환된 코드",
    "curl-placeholder": "여기에 cURL 명령을 붙여넣기...",
    "sample": "샘플 사용",
    "clear": "지우기",
    "download": "다운로드",
    "warnings-title": "경고",
    "errors-title": "오류"
  },
  "ru": {
    "output-language": "Язык вывода",
    "language-placeholder": "Выберите язык",
    "input-curl": "Команда cURL",
    "output-code": "Преобразованный код",
    "curl-placeholder": "Вставьте команду cURL здесь...",
    "sample": "Использовать пример",
    "clear": "Очистить",
    "download": "Скачать",
    "warnings-title": "Предупреждения",
    "errors-title": "Ошибки"
  },
  "pt": {
    "output-language": "Idioma de saída",
    "language-placeholder": "Selecione um idioma",
    "input-curl": "Comando cURL",
    "output-code": "Código convertido",
    "curl-placeholder": "Cole um comando cURL aqui...",
    "sample": "Usar exemplo",
    "clear": "Limpar",
    "download": "Baixar",
    "warnings-title": "Avisos",
    "errors-title": "Erros"
  },
  "ar": {
    "output-language": "لغة الإخراج",
    "language-placeholder": "اختر لغة",
    "input-curl": "أمر cURL",
    "output-code": "الكود المحول",
    "curl-placeholder": "الصق أمر cURL هنا...",
    "sample": "استخدم مثالاً",
    "clear": "مسح",
    "download": "تنزيل",
    "warnings-title": "تحذيرات",
    "errors-title": "أخطاء"
  },
  "hi": {
    "output-language": "आउटपुट भाषा",
    "language-placeholder": "भाषा चुनें",
    "input-curl": "cURL कमांड",
    "output-code": "परिवर्तित कोड",
    "curl-placeholder": "यहां cURL कमांड पेस्ट करें...",
    "sample": "उदाहरण उपयोग करें",
    "clear": "साफ़ करें",
    "download": "डाउनलोड",
    "warnings-title": "चेतावनियाँ",
    "errors-title": "त्रुटियाँ"
  },
  "tr": {
    "output-language": "Çıkış dili",
    "language-placeholder": "Dil seçin",
    "input-curl": "cURL komutu",
    "output-code": "Dönüştürülen kod",
    "curl-placeholder": "Buraya bir cURL komutu yapıştırın...",
    "sample": "Örnek kullan",
    "clear": "Temizle",
    "download": "İndir",
    "warnings-title": "Uyarılar",
    "errors-title": "Hatalar"
  },
  "nl": {
    "output-language": "Uitvoertaal",
    "language-placeholder": "Selecteer een taal",
    "input-curl": "cURL-opdracht",
    "output-code": "Geconverteerde code",
    "curl-placeholder": "Plak hier een cURL-opdracht...",
    "sample": "Voorbeeld gebruiken",
    "clear": "Wissen",
    "download": "Downloaden",
    "warnings-title": "Waarschuwingen",
    "errors-title": "Fouten"
  },
  "sv": {
    "output-language": "Utmatningsspråk",
    "language-placeholder": "Välj ett språk",
    "input-curl": "cURL-kommando",
    "output-code": "Konverterad kod",
    "curl-placeholder": "Klistra in ett cURL-kommando här...",
    "sample": "Använd exempel",
    "clear": "Rensa",
    "download": "Ladda ner",
    "warnings-title": "Varningar",
    "errors-title": "Fel"
  },
  "pl": {
    "output-language": "Język wyjścia",
    "language-placeholder": "Wybierz język",
    "input-curl": "Polecenie cURL",
    "output-code": "Przekonwertowany kod",
    "curl-placeholder": "Wklej tutaj polecenie cURL...",
    "sample": "Użyj przykładu",
    "clear": "Wyczyść",
    "download": "Pobierz",
    "warnings-title": "Ostrzeżenia",
    "errors-title": "Błędy"
  },
  "vi": {
    "output-language": "Ngôn ngữ đầu ra",
    "language-placeholder": "Chọn ngôn ngữ",
    "input-curl": "Lệnh cURL",
    "output-code": "Mã đã chuyển đổi",
    "curl-placeholder": "Dán lệnh cURL vào đây...",
    "sample": "Dùng mẫu",
    "clear": "Xóa",
    "download": "Tải xuống",
    "warnings-title": "Cảnh báo",
    "errors-title": "Lỗi"
  },
  "th": {
    "output-language": "ภาษาเอาต์พุต",
    "language-placeholder": "เลือกภาษา",
    "input-curl": "คำสั่ง cURL",
    "output-code": "โค้ดที่แปลงแล้ว",
    "curl-placeholder": "วางคำสั่ง cURL ที่นี่...",
    "sample": "ใช้ตัวอย่าง",
    "clear": "ล้าง",
    "download": "ดาวน์โหลด",
    "warnings-title": "คำเตือน",
    "errors-title": "ข้อผิดพลาด"
  },
  "id": {
    "output-language": "Bahasa keluaran",
    "language-placeholder": "Pilih bahasa",
    "input-curl": "Perintah cURL",
    "output-code": "Kode hasil konversi",
    "curl-placeholder": "Tempel perintah cURL di sini...",
    "sample": "Gunakan contoh",
    "clear": "Bersihkan",
    "download": "Unduh",
    "warnings-title": "Peringatan",
    "errors-title": "Kesalahan"
  },
  "he": {
    "output-language": "שפת פלט",
    "language-placeholder": "בחר שפה",
    "input-curl": "פקודת cURL",
    "output-code": "קוד שהומר",
    "curl-placeholder": "הדבק כאן פקודת cURL...",
    "sample": "השתמש בדוגמה",
    "clear": "נקה",
    "download": "הורדה",
    "warnings-title": "אזהרות",
    "errors-title": "שגיאות"
  },
  "ms": {
    "output-language": "Bahasa output",
    "language-placeholder": "Pilih bahasa",
    "input-curl": "Arahan cURL",
    "output-code": "Kod ditukar",
    "curl-placeholder": "Tampal arahan cURL di sini...",
    "sample": "Gunakan contoh",
    "clear": "Kosongkan",
    "download": "Muat turun",
    "warnings-title": "Amaran",
    "errors-title": "Ralat"
  },
  "no": {
    "output-language": "Utgangsspråk",
    "language-placeholder": "Velg et språk",
    "input-curl": "cURL-kommando",
    "output-code": "Konvertert kode",
    "curl-placeholder": "Lim inn en cURL-kommando her...",
    "sample": "Bruk eksempel",
    "clear": "Tøm",
    "download": "Last ned",
    "warnings-title": "Advarsler",
    "errors-title": "Feil"
  }
}
</i18n>
