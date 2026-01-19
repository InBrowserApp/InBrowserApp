<template>
  <ToolSection v-if="result || resultBinary || error">
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <n-alert v-if="error" type="error" :title="t('error')">{{ error }}</n-alert>
    <template v-else>
      <n-tabs v-model:value="activeTab" type="line">
        <n-tab-pane name="text" :tab="t('textTab')">
          <n-input
            :value="result"
            type="textarea"
            readonly
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </n-tab-pane>
        <n-tab-pane name="hex" :tab="t('hexTab')">
          <n-input
            :value="resultHex"
            type="textarea"
            readonly
            :autosize="{ minRows: 3, maxRows: 10 }"
            style="font-family: monospace"
          />
        </n-tab-pane>
      </n-tabs>
      <n-space style="margin-top: 8px">
        <CopyToClipboardButton :content="activeTab === 'text' ? result : resultHex" />
        <n-popover trigger="click">
          <template #trigger>
            <n-button text>
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('download') }}
            </n-button>
          </template>
          <n-flex vertical :size="8">
            <n-button
              v-for="link in downloadLinks"
              :key="link.label"
              tag="a"
              text
              :href="link.url ?? undefined"
              :download="link.filename"
              :disabled="!link.url"
            >
              {{ link.label }}
            </n-button>
          </n-flex>
        </n-popover>
      </n-space>
    </template>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NSpace, NAlert, NInput, NButton, NIcon, NPopover, NFlex, NTabs, NTabPane } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ArrowDownload16Regular } from '@shared/icons/fluent'

const props = defineProps<{
  result: string
  resultHex: string
  resultBinary: ArrayBuffer | null
  error: string
}>()

const { t } = useI18n()

const activeTab = ref<'text' | 'hex'>('text')
const textBlob = computed(() => new Blob([props.result], { type: 'text/plain' }))
const binaryBlob = computed(() => {
  if (!props.resultBinary) return null
  return new Blob([props.resultBinary], { type: 'application/octet-stream' })
})
const textUrl = useObjectUrl(textBlob)
const binaryUrl = useObjectUrl(binaryBlob)
const downloadLinks = computed(() => {
  const links = [{ label: 'Text (.txt)', url: textUrl.value, filename: 'decrypted.txt' }]
  if (props.resultBinary) {
    links.push({ label: 'Binary (.bin)', url: binaryUrl.value, filename: 'decrypted.bin' })
  }
  return links
})
</script>

<i18n lang="json">
{
  "en": {
    "result": "Result",
    "textTab": "Text",
    "hexTab": "Hex",
    "error": "Error",
    "download": "Download"
  },
  "zh": {
    "result": "结果",
    "textTab": "文本",
    "hexTab": "十六进制",
    "error": "错误",
    "download": "下载"
  },
  "zh-CN": {
    "result": "结果",
    "textTab": "文本",
    "hexTab": "十六进制",
    "error": "错误",
    "download": "下载"
  },
  "zh-TW": {
    "result": "結果",
    "textTab": "文本",
    "hexTab": "十六進位",
    "error": "錯誤",
    "download": "下載"
  },
  "zh-HK": {
    "result": "結果",
    "textTab": "文本",
    "hexTab": "十六進位",
    "error": "錯誤",
    "download": "下載"
  },
  "es": {
    "result": "Resultado",
    "textTab": "Texto",
    "hexTab": "Hex",
    "error": "Error",
    "download": "Descargar"
  },
  "fr": {
    "result": "Résultat",
    "textTab": "Texte",
    "hexTab": "Hex",
    "error": "Erreur",
    "download": "Télécharger"
  },
  "de": {
    "result": "Ergebnis",
    "textTab": "Text",
    "hexTab": "Hex",
    "error": "Fehler",
    "download": "Herunterladen"
  },
  "it": {
    "result": "Risultato",
    "textTab": "Testo",
    "hexTab": "Esadecimale",
    "error": "Errore",
    "download": "Scarica"
  },
  "ja": {
    "result": "結果",
    "textTab": "テキスト",
    "hexTab": "16進数",
    "error": "エラー",
    "download": "ダウンロード"
  },
  "ko": {
    "result": "결과",
    "textTab": "텍스트",
    "hexTab": "16진수",
    "error": "오류",
    "download": "다운로드"
  },
  "ru": {
    "result": "Результат",
    "textTab": "Текст",
    "hexTab": "Hex",
    "error": "Ошибка",
    "download": "Скачать"
  },
  "pt": {
    "result": "Resultado",
    "textTab": "Texto",
    "hexTab": "Hex",
    "error": "Erro",
    "download": "Baixar"
  },
  "ar": {
    "result": "النتيجة",
    "textTab": "نص",
    "hexTab": "سداسي عشري",
    "error": "خطأ",
    "download": "تحميل"
  },
  "hi": {
    "result": "परिणाम",
    "textTab": "पाठ",
    "hexTab": "हेक्स",
    "error": "त्रुटि",
    "download": "डाउनलोड करें"
  },
  "tr": {
    "result": "Sonuç",
    "textTab": "Metin",
    "hexTab": "Onaltılık",
    "error": "Hata",
    "download": "İndir"
  },
  "nl": {
    "result": "Resultaat",
    "textTab": "Tekst",
    "hexTab": "Hex",
    "error": "Fout",
    "download": "Downloaden"
  },
  "sv": {
    "result": "Resultat",
    "textTab": "Text",
    "hexTab": "Hex",
    "error": "Fel",
    "download": "Ladda ner"
  },
  "pl": {
    "result": "Wynik",
    "textTab": "Tekst",
    "hexTab": "Hex",
    "error": "Błąd",
    "download": "Pobierz"
  },
  "vi": {
    "result": "Kết quả",
    "textTab": "Văn bản",
    "hexTab": "Thập lục phân",
    "error": "Lỗi",
    "download": "Tải xuống"
  },
  "th": {
    "result": "ผลลัพธ์",
    "textTab": "ข้อความ",
    "hexTab": "ฐานสิบหก",
    "error": "ข้อผิดพลาด",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "result": "Hasil",
    "textTab": "Teks",
    "hexTab": "Heksadesimal",
    "error": "Kesalahan",
    "download": "Unduh"
  },
  "he": {
    "result": "תוצאה",
    "textTab": "טקסט",
    "hexTab": "הקסדצימלי",
    "error": "שגיאה",
    "download": "הורד"
  },
  "ms": {
    "result": "Hasil",
    "textTab": "Teks",
    "hexTab": "Heksadesimal",
    "error": "Ralat",
    "download": "Muat turun"
  },
  "no": {
    "result": "Resultat",
    "textTab": "Tekst",
    "hexTab": "Hex",
    "error": "Feil",
    "download": "Last ned"
  }
}
</i18n>
