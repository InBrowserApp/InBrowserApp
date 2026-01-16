<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>

    <n-flex vertical :size="8">
      <n-text>
        <strong>{{ t('sizesIncluded') }}:</strong> {{ sizesLabel }}
      </n-text>
      <n-text>
        <strong>{{ t('fileSize') }}:</strong> {{ formattedSize }}
      </n-text>
      <n-button tag="a" type="primary" secondary :href="downloadUrl || ''" :download="fileName">
        <template #icon>
          <n-icon><ArrowDownload24Regular /></n-icon>
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
import { filesize } from 'filesize'
import { NButton, NIcon, NText, NFlex } from 'naive-ui'
import { ArrowDownload24Regular } from '@shared/icons/fluent'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  blob: Blob
  fileName: string
  sizes: number[]
}>()

const { t } = useI18n()

const sizesLabel = computed(() => props.sizes.map((size) => `${size}x${size}`).join(', '))

const formattedSize = computed(() => filesize(props.blob.size))

const downloadUrl = useObjectUrl(() => props.blob)
</script>

<i18n lang="json">
{
  "en": {
    "output": "Output",
    "sizesIncluded": "Included sizes",
    "fileSize": "File size",
    "download": "Download ICO"
  },
  "zh": {
    "output": "输出",
    "sizesIncluded": "包含尺寸",
    "fileSize": "文件大小",
    "download": "下载 ICO"
  },
  "zh-CN": {
    "output": "输出",
    "sizesIncluded": "包含尺寸",
    "fileSize": "文件大小",
    "download": "下载 ICO"
  },
  "zh-TW": {
    "output": "輸出",
    "sizesIncluded": "包含尺寸",
    "fileSize": "檔案大小",
    "download": "下載 ICO"
  },
  "zh-HK": {
    "output": "輸出",
    "sizesIncluded": "包含尺寸",
    "fileSize": "檔案大小",
    "download": "下載 ICO"
  },
  "es": {
    "output": "Salida",
    "sizesIncluded": "Tamaños incluidos",
    "fileSize": "Tamaño de archivo",
    "download": "Descargar ICO"
  },
  "fr": {
    "output": "Résultat",
    "sizesIncluded": "Tailles incluses",
    "fileSize": "Taille du fichier",
    "download": "Télécharger ICO"
  },
  "de": {
    "output": "Ausgabe",
    "sizesIncluded": "Enthaltene Größen",
    "fileSize": "Dateigröße",
    "download": "ICO herunterladen"
  },
  "it": {
    "output": "Output",
    "sizesIncluded": "Dimensioni incluse",
    "fileSize": "Dimensione file",
    "download": "Scarica ICO"
  },
  "ja": {
    "output": "出力",
    "sizesIncluded": "含まれるサイズ",
    "fileSize": "ファイルサイズ",
    "download": "ICO をダウンロード"
  },
  "ko": {
    "output": "출력",
    "sizesIncluded": "포함된 크기",
    "fileSize": "파일 크기",
    "download": "ICO 다운로드"
  },
  "ru": {
    "output": "Результат",
    "sizesIncluded": "Включенные размеры",
    "fileSize": "Размер файла",
    "download": "Скачать ICO"
  },
  "pt": {
    "output": "Saída",
    "sizesIncluded": "Tamanhos incluídos",
    "fileSize": "Tamanho do arquivo",
    "download": "Baixar ICO"
  },
  "ar": {
    "output": "الإخراج",
    "sizesIncluded": "الأحجام المضمنة",
    "fileSize": "حجم الملف",
    "download": "تنزيل ICO"
  },
  "hi": {
    "output": "आउटपुट",
    "sizesIncluded": "शामिल आकार",
    "fileSize": "फ़ाइल आकार",
    "download": "ICO डाउनलोड करें"
  },
  "tr": {
    "output": "Çıktı",
    "sizesIncluded": "Dahil edilen boyutlar",
    "fileSize": "Dosya boyutu",
    "download": "ICO indir"
  },
  "nl": {
    "output": "Uitvoer",
    "sizesIncluded": "Inbegrepen groottes",
    "fileSize": "Bestandsgrootte",
    "download": "ICO downloaden"
  },
  "sv": {
    "output": "Utdata",
    "sizesIncluded": "Inkluderade storlekar",
    "fileSize": "Filstorlek",
    "download": "Ladda ner ICO"
  },
  "pl": {
    "output": "Wynik",
    "sizesIncluded": "Dołączone rozmiary",
    "fileSize": "Rozmiar pliku",
    "download": "Pobierz ICO"
  },
  "vi": {
    "output": "Kết quả",
    "sizesIncluded": "Kích thước bao gồm",
    "fileSize": "Kích thước tệp",
    "download": "Tải ICO"
  },
  "th": {
    "output": "ผลลัพธ์",
    "sizesIncluded": "ขนาดที่รวม",
    "fileSize": "ขนาดไฟล์",
    "download": "ดาวน์โหลด ICO"
  },
  "id": {
    "output": "Keluaran",
    "sizesIncluded": "Ukuran yang disertakan",
    "fileSize": "Ukuran file",
    "download": "Unduh ICO"
  },
  "he": {
    "output": "פלט",
    "sizesIncluded": "גדלים כלולים",
    "fileSize": "גודל קובץ",
    "download": "הורד ICO"
  },
  "ms": {
    "output": "Output",
    "sizesIncluded": "Saiz disertakan",
    "fileSize": "Saiz fail",
    "download": "Muat turun ICO"
  },
  "no": {
    "output": "Utdata",
    "sizesIncluded": "Inkluderte størrelser",
    "fileSize": "Filstørrelse",
    "download": "Last ned ICO"
  }
}
</i18n>
