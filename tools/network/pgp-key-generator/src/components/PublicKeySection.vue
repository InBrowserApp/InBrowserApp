<template>
  <ToolSection>
    <ToolSectionHeader>
      <n-flex align="center" :size="8">
        {{ t('publicKey') }}
        <n-tag size="small" type="info" :bordered="false">{{ t('shareThis') }}</n-tag>
      </n-flex>
    </ToolSectionHeader>
    <n-input
      :value="value"
      type="textarea"
      readonly
      :loading="loading"
      :autosize="{ minRows: 1, maxRows: 6 }"
      placeholder=""
      style="font-family: monospace"
    />
    <n-flex :size="8" style="margin-top: 8px">
      <CopyToClipboardButton :text="value" />
      <n-button text tag="a" :href="blobUrl" :download="filename">
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl } from '@vueuse/core'
import { NInput, NFlex, NButton, NIcon, NTag } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ArrowDownload16Regular } from '@shared/icons/fluent'

const props = defineProps<{
  value: string
  filename: string
  loading?: boolean
}>()

const { t } = useI18n()

const blob = computed(() => new Blob([props.value], { type: 'text/plain' }))
const blobUrl = useObjectUrl(blob)
</script>

<i18n lang="json">
{
  "en": { "publicKey": "Public Key", "shareThis": "Safe to share", "download": "Download" },
  "zh": { "publicKey": "公钥", "shareThis": "可安全分享", "download": "下载" },
  "zh-CN": { "publicKey": "公钥", "shareThis": "可安全分享", "download": "下载" },
  "zh-TW": { "publicKey": "公鑰", "shareThis": "可安全分享", "download": "下載" },
  "zh-HK": { "publicKey": "公鑰", "shareThis": "可安全分享", "download": "下載" },
  "es": {
    "publicKey": "Clave Pública",
    "shareThis": "Seguro para compartir",
    "download": "Descargar"
  },
  "fr": {
    "publicKey": "Clé Publique",
    "shareThis": "Peut être partagée",
    "download": "Télécharger"
  },
  "de": {
    "publicKey": "Öffentlicher Schlüssel",
    "shareThis": "Sicher zum Teilen",
    "download": "Herunterladen"
  },
  "it": {
    "publicKey": "Chiave Pubblica",
    "shareThis": "Sicuro da condividere",
    "download": "Scarica"
  },
  "ja": { "publicKey": "公開鍵", "shareThis": "共有可能", "download": "ダウンロード" },
  "ko": { "publicKey": "공개 키", "shareThis": "공유 가능", "download": "다운로드" },
  "ru": { "publicKey": "Открытый Ключ", "shareThis": "Можно делиться", "download": "Скачать" },
  "pt": {
    "publicKey": "Chave Pública",
    "shareThis": "Seguro para compartilhar",
    "download": "Baixar"
  },
  "ar": { "publicKey": "المفتاح العام", "shareThis": "آمن للمشاركة", "download": "تحميل" },
  "hi": {
    "publicKey": "सार्वजनिक कुंजी",
    "shareThis": "साझा करना सुरक्षित",
    "download": "डाउनलोड"
  },
  "tr": { "publicKey": "Genel Anahtar", "shareThis": "Paylaşılabilir", "download": "İndir" },
  "nl": {
    "publicKey": "Publieke Sleutel",
    "shareThis": "Veilig om te delen",
    "download": "Downloaden"
  },
  "sv": { "publicKey": "Publik Nyckel", "shareThis": "Säker att dela", "download": "Ladda ner" },
  "pl": {
    "publicKey": "Klucz Publiczny",
    "shareThis": "Bezpieczny do udostępnienia",
    "download": "Pobierz"
  },
  "vi": {
    "publicKey": "Khóa Công Khai",
    "shareThis": "An toàn để chia sẻ",
    "download": "Tải xuống"
  },
  "th": { "publicKey": "คีย์สาธารณะ", "shareThis": "แชร์ได้อย่างปลอดภัย", "download": "ดาวน์โหลด" },
  "id": { "publicKey": "Kunci Publik", "shareThis": "Aman untuk dibagikan", "download": "Unduh" },
  "he": { "publicKey": "מפתח ציבורי", "shareThis": "בטוח לשיתוף", "download": "הורדה" },
  "ms": {
    "publicKey": "Kunci Awam",
    "shareThis": "Selamat untuk dikongsi",
    "download": "Muat Turun"
  },
  "no": { "publicKey": "Offentlig Nøkkel", "shareThis": "Trygg å dele", "download": "Last ned" }
}
</i18n>
