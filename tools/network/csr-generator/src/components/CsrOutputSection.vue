<template>
  <ToolSectionHeader v-show="csrOutput">{{ t('csrOutputTitle') }}</ToolSectionHeader>
  <ToolSection v-show="csrOutput">
    <n-input
      class="monospace-field"
      :value="csrOutput"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 14 }"
      readonly
    />
    <n-text v-show="keyAlgorithmLabel" depth="3" class="input-hint">
      {{ t('keyAlgorithmLabel', { algorithm: keyAlgorithmLabel }) }}
    </n-text>
  </ToolSection>
  <ToolSection v-show="csrOutput">
    <n-flex justify="space-between" align="center">
      <CopyToClipboardButton :content="csrOutput" />
      <n-button tag="a" text :href="csrDownloadUrl ?? undefined" download="request.csr">
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('downloadCsr') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NInput, NText } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

defineProps<{
  csrOutput: string
  csrDownloadUrl?: string | null
  keyAlgorithmLabel: string
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "csrOutputTitle": "CSR Output",
    "downloadCsr": "Download CSR",
    "keyAlgorithmLabel": "Key: {algorithm}"
  },
  "zh": {
    "csrOutputTitle": "CSR 输出",
    "downloadCsr": "下载 CSR",
    "keyAlgorithmLabel": "密钥：{algorithm}"
  },
  "zh-CN": {
    "csrOutputTitle": "CSR 输出",
    "downloadCsr": "下载 CSR",
    "keyAlgorithmLabel": "密钥：{algorithm}"
  },
  "zh-TW": {
    "csrOutputTitle": "CSR 輸出",
    "downloadCsr": "下載 CSR",
    "keyAlgorithmLabel": "金鑰：{algorithm}"
  },
  "zh-HK": {
    "csrOutputTitle": "CSR 輸出",
    "downloadCsr": "下載 CSR",
    "keyAlgorithmLabel": "金鑰：{algorithm}"
  },
  "es": {
    "csrOutputTitle": "Salida CSR",
    "downloadCsr": "Descargar CSR",
    "keyAlgorithmLabel": "Clave: {algorithm}"
  },
  "fr": {
    "csrOutputTitle": "Sortie CSR",
    "downloadCsr": "Télécharger le CSR",
    "keyAlgorithmLabel": "Clé : {algorithm}"
  },
  "de": {
    "csrOutputTitle": "CSR-Ausgabe",
    "downloadCsr": "CSR herunterladen",
    "keyAlgorithmLabel": "Schlüssel: {algorithm}"
  },
  "it": {
    "csrOutputTitle": "Output CSR",
    "downloadCsr": "Scarica CSR",
    "keyAlgorithmLabel": "Chiave: {algorithm}"
  },
  "ja": {
    "csrOutputTitle": "CSR 出力",
    "downloadCsr": "CSR をダウンロード",
    "keyAlgorithmLabel": "鍵: {algorithm}"
  },
  "ko": {
    "csrOutputTitle": "CSR 출력",
    "downloadCsr": "CSR 다운로드",
    "keyAlgorithmLabel": "키: {algorithm}"
  },
  "ru": {
    "csrOutputTitle": "Вывод CSR",
    "downloadCsr": "Скачать CSR",
    "keyAlgorithmLabel": "Ключ: {algorithm}"
  },
  "pt": {
    "csrOutputTitle": "Saída do CSR",
    "downloadCsr": "Baixar CSR",
    "keyAlgorithmLabel": "Chave: {algorithm}"
  },
  "ar": {
    "csrOutputTitle": "مخرجات CSR",
    "downloadCsr": "تنزيل CSR",
    "keyAlgorithmLabel": "المفتاح: {algorithm}"
  },
  "hi": {
    "csrOutputTitle": "CSR आउटपुट",
    "downloadCsr": "CSR डाउनलोड करें",
    "keyAlgorithmLabel": "कुंजी: {algorithm}"
  },
  "tr": {
    "csrOutputTitle": "CSR çıktısı",
    "downloadCsr": "CSR indir",
    "keyAlgorithmLabel": "Anahtar: {algorithm}"
  },
  "nl": {
    "csrOutputTitle": "CSR-uitvoer",
    "downloadCsr": "CSR downloaden",
    "keyAlgorithmLabel": "Sleutel: {algorithm}"
  },
  "sv": {
    "csrOutputTitle": "CSR-utdata",
    "downloadCsr": "Ladda ner CSR",
    "keyAlgorithmLabel": "Nyckel: {algorithm}"
  },
  "pl": {
    "csrOutputTitle": "Wyjście CSR",
    "downloadCsr": "Pobierz CSR",
    "keyAlgorithmLabel": "Klucz: {algorithm}"
  },
  "vi": {
    "csrOutputTitle": "Kết quả CSR",
    "downloadCsr": "Tải CSR",
    "keyAlgorithmLabel": "Khóa: {algorithm}"
  },
  "th": {
    "csrOutputTitle": "ผลลัพธ์ CSR",
    "downloadCsr": "ดาวน์โหลด CSR",
    "keyAlgorithmLabel": "คีย์: {algorithm}"
  },
  "id": {
    "csrOutputTitle": "Output CSR",
    "downloadCsr": "Unduh CSR",
    "keyAlgorithmLabel": "Kunci: {algorithm}"
  },
  "he": {
    "csrOutputTitle": "פלט CSR",
    "downloadCsr": "הורד CSR",
    "keyAlgorithmLabel": "מפתח: {algorithm}"
  },
  "ms": {
    "csrOutputTitle": "Output CSR",
    "downloadCsr": "Muat turun CSR",
    "keyAlgorithmLabel": "Kunci: {algorithm}"
  },
  "no": {
    "csrOutputTitle": "CSR-utdata",
    "downloadCsr": "Last ned CSR",
    "keyAlgorithmLabel": "Nøkkel: {algorithm}"
  }
}
</i18n>
