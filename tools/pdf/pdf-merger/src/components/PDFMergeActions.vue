<template>
  <ToolSectionHeader>{{ t('mergeTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text depth="3">{{ t('summary', { files: itemsCount, pages: totalPages }) }}</n-text>

      <n-flex vertical :size="6">
        <n-text strong>{{ t('outputName') }}</n-text>
        <n-input v-model:value="outputName" :placeholder="t('outputPlaceholder')" clearable />
      </n-flex>

      <n-flex justify="space-between" align="center" :wrap="false">
        <n-button tertiary :disabled="itemsCount === 0 || isMerging" @click="emit('clear')">
          <template #icon>
            <n-icon :component="Delete16Regular" />
          </template>
          {{ t('clearAll') }}
        </n-button>
        <n-button type="primary" :loading="isMerging" :disabled="!canMerge" @click="emit('merge')">
          <template #icon>
            <n-icon :component="DocumentAdd16Regular" />
          </template>
          {{ isMerging ? t('merging') : t('merge') }}
        </n-button>
      </n-flex>

      <n-alert v-if="errorMessage" type="error" :title="errorMessage" />

      <n-flex v-if="downloadUrl" align="center" justify="space-between" :wrap="false">
        <n-text>{{ t('mergedReady') }}</n-text>
        <n-button
          tag="a"
          type="primary"
          :href="downloadUrl ?? undefined"
          :download="downloadFilename"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NButton, NFlex, NIcon, NInput, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import DocumentAdd16Regular from '@vicons/fluent/DocumentAdd16Regular'

defineProps<{
  itemsCount: number
  totalPages: number
  canMerge: boolean
  isMerging: boolean
  errorMessage: string
  downloadUrl: string | null
  downloadFilename: string
}>()

const emit = defineEmits<{
  (event: 'clear'): void
  (event: 'merge'): void
}>()

const outputName = defineModel<string>('outputName', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "mergeTitle": "Merge and download",
    "summary": "{files} files · {pages} pages",
    "outputName": "Output filename",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Clear all",
    "merge": "Merge PDFs",
    "merging": "Merging...",
    "mergedReady": "Merged file is ready",
    "download": "Download"
  },
  "zh": {
    "mergeTitle": "合并并下载",
    "summary": "{files} 个文件 · {pages} 页",
    "outputName": "输出文件名",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "清空",
    "merge": "合并 PDF",
    "merging": "合并中...",
    "mergedReady": "合并文件已生成",
    "download": "下载"
  },
  "zh-CN": {
    "mergeTitle": "合并并下载",
    "summary": "{files} 个文件 · {pages} 页",
    "outputName": "输出文件名",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "清空",
    "merge": "合并 PDF",
    "merging": "合并中...",
    "mergedReady": "合并文件已生成",
    "download": "下载"
  },
  "zh-TW": {
    "mergeTitle": "合併並下載",
    "summary": "{files} 個檔案 · {pages} 頁",
    "outputName": "輸出檔名",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "清空",
    "merge": "合併 PDF",
    "merging": "合併中...",
    "mergedReady": "合併檔案已產生",
    "download": "下載"
  },
  "zh-HK": {
    "mergeTitle": "合併並下載",
    "summary": "{files} 個檔案 · {pages} 頁",
    "outputName": "輸出檔名",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "清空",
    "merge": "合併 PDF",
    "merging": "合併中...",
    "mergedReady": "合併檔案已產生",
    "download": "下載"
  },
  "es": {
    "mergeTitle": "Combinar y descargar",
    "summary": "{files} archivos · {pages} páginas",
    "outputName": "Nombre de archivo",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Borrar todo",
    "merge": "Combinar PDF",
    "merging": "Combinando...",
    "mergedReady": "El archivo combinado está listo",
    "download": "Descargar"
  },
  "fr": {
    "mergeTitle": "Fusionner et télécharger",
    "summary": "{files} fichiers · {pages} pages",
    "outputName": "Nom du fichier de sortie",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Tout effacer",
    "merge": "Fusionner les PDF",
    "merging": "Fusion en cours...",
    "mergedReady": "Le fichier fusionné est prêt",
    "download": "Télécharger"
  },
  "de": {
    "mergeTitle": "Zusammenführen und herunterladen",
    "summary": "{files} Dateien · {pages} Seiten",
    "outputName": "Ausgabedateiname",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Alles löschen",
    "merge": "PDFs zusammenführen",
    "merging": "Wird zusammengeführt...",
    "mergedReady": "Die zusammengeführte Datei ist bereit",
    "download": "Herunterladen"
  },
  "it": {
    "mergeTitle": "Unisci e scarica",
    "summary": "{files} file · {pages} pagine",
    "outputName": "Nome file di output",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Cancella tutto",
    "merge": "Unisci PDF",
    "merging": "Unione in corso...",
    "mergedReady": "Il file unito è pronto",
    "download": "Scarica"
  },
  "ja": {
    "mergeTitle": "結合してダウンロード",
    "summary": "{files} ファイル · {pages} ページ",
    "outputName": "出力ファイル名",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "すべてクリア",
    "merge": "PDF を結合",
    "merging": "結合中...",
    "mergedReady": "結合ファイルの準備ができました",
    "download": "ダウンロード"
  },
  "ko": {
    "mergeTitle": "병합 및 다운로드",
    "summary": "{files}개 파일 · {pages}페이지",
    "outputName": "출력 파일명",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "모두 지우기",
    "merge": "PDF 병합",
    "merging": "병합 중...",
    "mergedReady": "병합 파일이 준비되었습니다",
    "download": "다운로드"
  },
  "ru": {
    "mergeTitle": "Объединить и скачать",
    "summary": "{files} файлов · {pages} стр.",
    "outputName": "Имя выходного файла",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Очистить всё",
    "merge": "Объединить PDF",
    "merging": "Объединение...",
    "mergedReady": "Объединённый файл готов",
    "download": "Скачать"
  },
  "pt": {
    "mergeTitle": "Mesclar e baixar",
    "summary": "{files} arquivos · {pages} páginas",
    "outputName": "Nome do arquivo de saída",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Limpar tudo",
    "merge": "Mesclar PDFs",
    "merging": "Mesclando...",
    "mergedReady": "Arquivo mesclado pronto",
    "download": "Baixar"
  },
  "ar": {
    "mergeTitle": "دمج وتنزيل",
    "summary": "{files} ملفات · {pages} صفحات",
    "outputName": "اسم ملف الإخراج",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "مسح الكل",
    "merge": "دمج PDF",
    "merging": "جارٍ الدمج...",
    "mergedReady": "الملف المدمج جاهز",
    "download": "تنزيل"
  },
  "hi": {
    "mergeTitle": "मर्ज और डाउनलोड",
    "summary": "{files} फ़ाइलें · {pages} पेज",
    "outputName": "आउटपुट फ़ाइल नाम",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "सब साफ़ करें",
    "merge": "PDF मर्ज करें",
    "merging": "मर्ज हो रहा है...",
    "mergedReady": "मर्ज की गई फ़ाइल तैयार है",
    "download": "डाउनलोड"
  },
  "tr": {
    "mergeTitle": "Birleştir ve indir",
    "summary": "{files} dosya · {pages} sayfa",
    "outputName": "Çıktı dosya adı",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Tümünü temizle",
    "merge": "PDF'leri birleştir",
    "merging": "Birleştiriliyor...",
    "mergedReady": "Birleştirilmiş dosya hazır",
    "download": "İndir"
  },
  "nl": {
    "mergeTitle": "Samenvoegen en downloaden",
    "summary": "{files} bestanden · {pages} pagina's",
    "outputName": "Uitvoerbestandsnaam",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Alles wissen",
    "merge": "PDF's samenvoegen",
    "merging": "Bezig met samenvoegen...",
    "mergedReady": "Samengevoegd bestand is klaar",
    "download": "Downloaden"
  },
  "sv": {
    "mergeTitle": "Slå ihop och ladda ner",
    "summary": "{files} filer · {pages} sidor",
    "outputName": "Filnamn för utdata",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Rensa alla",
    "merge": "Slå ihop PDF",
    "merging": "Slår ihop...",
    "mergedReady": "Sammanfogad fil är klar",
    "download": "Ladda ner"
  },
  "pl": {
    "mergeTitle": "Scal i pobierz",
    "summary": "{files} plików · {pages} stron",
    "outputName": "Nazwa pliku wyjściowego",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Wyczyść wszystko",
    "merge": "Scal PDF",
    "merging": "Scalanie...",
    "mergedReady": "Scalony plik jest gotowy",
    "download": "Pobierz"
  },
  "vi": {
    "mergeTitle": "Gộp và tải xuống",
    "summary": "{files} tệp · {pages} trang",
    "outputName": "Tên tệp đầu ra",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Xóa tất cả",
    "merge": "Gộp PDF",
    "merging": "Đang gộp...",
    "mergedReady": "Tệp đã gộp sẵn sàng",
    "download": "Tải xuống"
  },
  "th": {
    "mergeTitle": "รวมและดาวน์โหลด",
    "summary": "{files} ไฟล์ · {pages} หน้า",
    "outputName": "ชื่อไฟล์ผลลัพธ์",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "ล้างทั้งหมด",
    "merge": "รวม PDF",
    "merging": "กำลังรวม...",
    "mergedReady": "ไฟล์ที่รวมพร้อมแล้ว",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "mergeTitle": "Gabung dan unduh",
    "summary": "{files} file · {pages} halaman",
    "outputName": "Nama file keluaran",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Bersihkan semua",
    "merge": "Gabung PDF",
    "merging": "Menggabungkan...",
    "mergedReady": "File gabungan siap",
    "download": "Unduh"
  },
  "he": {
    "mergeTitle": "מזג והורד",
    "summary": "{files} קבצים · {pages} עמודים",
    "outputName": "שם קובץ פלט",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "נקה הכל",
    "merge": "מזג PDF",
    "merging": "ממזג...",
    "mergedReady": "הקובץ הממוזג מוכן",
    "download": "הורד"
  },
  "ms": {
    "mergeTitle": "Gabung dan muat turun",
    "summary": "{files} fail · {pages} halaman",
    "outputName": "Nama fail output",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Kosongkan semua",
    "merge": "Gabung PDF",
    "merging": "Sedang menggabung...",
    "mergedReady": "Fail gabungan sedia",
    "download": "Muat turun"
  },
  "no": {
    "mergeTitle": "Slå sammen og last ned",
    "summary": "{files} filer · {pages} sider",
    "outputName": "Navn på utdatafil",
    "outputPlaceholder": "merged.pdf",
    "clearAll": "Tøm alle",
    "merge": "Slå sammen PDF",
    "merging": "Slår sammen...",
    "mergedReady": "Sammenslått fil er klar",
    "download": "Last ned"
  }
}
</i18n>
