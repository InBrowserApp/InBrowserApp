<template>
  <ConversionResults
    :title="t('resultsTitle')"
    :count-label="t('resultCount', { count: results.length })"
    :results="results"
    :zip-blob="zipBlob"
    :is-zipping="isZipping"
    :download-zip-name="downloadZipName"
    :download-png-label="t('downloadPng')"
    :download-zip-label="t('downloadZip')"
    :original-label="t('original')"
    :output-label="t('output')"
    :saved-label="t('saved')"
    :dimensions-label="t('dimensions')"
    :file-size-label="t('fileSize')"
    :total-saved-label="t('totalSaved')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ConversionResults from './ConversionResults.vue'
import type { GifToApngResult } from '../types'

defineProps<{
  results: GifToApngResult[]
  zipBlob: Blob | null
  isZipping: boolean
  downloadZipName: string
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "resultsTitle": "Results",
    "resultCount": "Converted {count} files",
    "downloadPng": "Download PNG",
    "downloadZip": "Download ZIP",
    "original": "Original",
    "output": "Output",
    "saved": "Saved",
    "dimensions": "Dimensions",
    "fileSize": "File size",
    "totalSaved": "Total saved"
  },
  "zh": {
    "resultsTitle": "结果",
    "resultCount": "已转换 {count} 个文件",
    "downloadPng": "下载 PNG",
    "downloadZip": "下载 ZIP",
    "original": "原始",
    "output": "输出",
    "saved": "节省",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "totalSaved": "总共节省"
  },
  "zh-CN": {
    "resultsTitle": "结果",
    "resultCount": "已转换 {count} 个文件",
    "downloadPng": "下载 PNG",
    "downloadZip": "下载 ZIP",
    "original": "原始",
    "output": "输出",
    "saved": "节省",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "totalSaved": "总共节省"
  },
  "zh-TW": {
    "resultsTitle": "結果",
    "resultCount": "已轉換 {count} 個檔案",
    "downloadPng": "下載 PNG",
    "downloadZip": "下載 ZIP",
    "original": "原始",
    "output": "輸出",
    "saved": "節省",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "totalSaved": "總共節省"
  },
  "zh-HK": {
    "resultsTitle": "結果",
    "resultCount": "已轉換 {count} 個檔案",
    "downloadPng": "下載 PNG",
    "downloadZip": "下載 ZIP",
    "original": "原始",
    "output": "輸出",
    "saved": "節省",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "totalSaved": "總共節省"
  },
  "es": {
    "resultsTitle": "Resultados",
    "resultCount": "Convertidos {count} archivos",
    "downloadPng": "Descargar PNG",
    "downloadZip": "Descargar ZIP",
    "original": "Original",
    "output": "Salida",
    "saved": "Ahorro",
    "dimensions": "Dimensiones",
    "fileSize": "Tamaño",
    "totalSaved": "Ahorro total"
  },
  "fr": {
    "resultsTitle": "Résultats",
    "resultCount": "{count} fichiers convertis",
    "downloadPng": "Télécharger PNG",
    "downloadZip": "Télécharger ZIP",
    "original": "Original",
    "output": "Sortie",
    "saved": "Économie",
    "dimensions": "Dimensions",
    "fileSize": "Taille",
    "totalSaved": "Économie totale"
  },
  "de": {
    "resultsTitle": "Ergebnisse",
    "resultCount": "{count} Dateien konvertiert",
    "downloadPng": "PNG herunterladen",
    "downloadZip": "ZIP herunterladen",
    "original": "Original",
    "output": "Ausgabe",
    "saved": "Ersparnis",
    "dimensions": "Abmessungen",
    "fileSize": "Dateigröße",
    "totalSaved": "Gesamtersparnis"
  },
  "it": {
    "resultsTitle": "Risultati",
    "resultCount": "{count} file convertiti",
    "downloadPng": "Scarica PNG",
    "downloadZip": "Scarica ZIP",
    "original": "Originale",
    "output": "Output",
    "saved": "Risparmio",
    "dimensions": "Dimensioni",
    "fileSize": "Dimensione file",
    "totalSaved": "Risparmio totale"
  },
  "ja": {
    "resultsTitle": "結果",
    "resultCount": "{count} 件を変換",
    "downloadPng": "PNGをダウンロード",
    "downloadZip": "ZIPをダウンロード",
    "original": "元",
    "output": "出力",
    "saved": "削減",
    "dimensions": "サイズ",
    "fileSize": "ファイルサイズ",
    "totalSaved": "合計削減"
  },
  "ko": {
    "resultsTitle": "결과",
    "resultCount": "{count}개 파일 변환됨",
    "downloadPng": "PNG 다운로드",
    "downloadZip": "ZIP 다운로드",
    "original": "원본",
    "output": "출력",
    "saved": "절감",
    "dimensions": "크기",
    "fileSize": "파일 크기",
    "totalSaved": "총 절감"
  },
  "ru": {
    "resultsTitle": "Результаты",
    "resultCount": "Конвертировано файлов: {count}",
    "downloadPng": "Скачать PNG",
    "downloadZip": "Скачать ZIP",
    "original": "Оригинал",
    "output": "Результат",
    "saved": "Экономия",
    "dimensions": "Размеры",
    "fileSize": "Размер файла",
    "totalSaved": "Общая экономия"
  },
  "pt": {
    "resultsTitle": "Resultados",
    "resultCount": "{count} arquivos convertidos",
    "downloadPng": "Baixar PNG",
    "downloadZip": "Baixar ZIP",
    "original": "Original",
    "output": "Saída",
    "saved": "Economia",
    "dimensions": "Dimensões",
    "fileSize": "Tamanho do arquivo",
    "totalSaved": "Economia total"
  },
  "ar": {
    "resultsTitle": "النتائج",
    "resultCount": "تم تحويل {count} ملفات",
    "downloadPng": "تنزيل PNG",
    "downloadZip": "تنزيل ZIP",
    "original": "الأصل",
    "output": "الناتج",
    "saved": "التوفير",
    "dimensions": "الأبعاد",
    "fileSize": "حجم الملف",
    "totalSaved": "إجمالي التوفير"
  },
  "hi": {
    "resultsTitle": "परिणाम",
    "resultCount": "{count} फाइलें कन्वर्ट हुईं",
    "downloadPng": "PNG डाउनलोड करें",
    "downloadZip": "ZIP डाउनलोड करें",
    "original": "मूल",
    "output": "आउटपुट",
    "saved": "बचत",
    "dimensions": "आयाम",
    "fileSize": "फ़ाइल आकार",
    "totalSaved": "कुल बचत"
  },
  "tr": {
    "resultsTitle": "Sonuçlar",
    "resultCount": "{count} dosya dönüştürüldü",
    "downloadPng": "PNG indir",
    "downloadZip": "ZIP indir",
    "original": "Orijinal",
    "output": "Çıktı",
    "saved": "Tasarruf",
    "dimensions": "Boyutlar",
    "fileSize": "Dosya boyutu",
    "totalSaved": "Toplam tasarruf"
  },
  "nl": {
    "resultsTitle": "Resultaten",
    "resultCount": "{count} bestanden geconverteerd",
    "downloadPng": "PNG downloaden",
    "downloadZip": "ZIP downloaden",
    "original": "Origineel",
    "output": "Uitvoer",
    "saved": "Bespaard",
    "dimensions": "Afmetingen",
    "fileSize": "Bestandsgrootte",
    "totalSaved": "Totaal bespaard"
  },
  "sv": {
    "resultsTitle": "Resultat",
    "resultCount": "{count} filer konverterade",
    "downloadPng": "Ladda ner PNG",
    "downloadZip": "Ladda ner ZIP",
    "original": "Original",
    "output": "Utdata",
    "saved": "Sparat",
    "dimensions": "Dimensioner",
    "fileSize": "Filstorlek",
    "totalSaved": "Totalt sparat"
  },
  "pl": {
    "resultsTitle": "Wyniki",
    "resultCount": "Przekonwertowano {count} plików",
    "downloadPng": "Pobierz PNG",
    "downloadZip": "Pobierz ZIP",
    "original": "Oryginał",
    "output": "Wyjście",
    "saved": "Oszczędność",
    "dimensions": "Wymiary",
    "fileSize": "Rozmiar pliku",
    "totalSaved": "Łączna oszczędność"
  },
  "vi": {
    "resultsTitle": "Kết quả",
    "resultCount": "Đã chuyển {count} tệp",
    "downloadPng": "Tải PNG",
    "downloadZip": "Tải ZIP",
    "original": "Gốc",
    "output": "Đầu ra",
    "saved": "Tiết kiệm",
    "dimensions": "Kích thước",
    "fileSize": "Dung lượng",
    "totalSaved": "Tổng tiết kiệm"
  },
  "th": {
    "resultsTitle": "ผลลัพธ์",
    "resultCount": "แปลงแล้ว {count} ไฟล์",
    "downloadPng": "ดาวน์โหลด PNG",
    "downloadZip": "ดาวน์โหลด ZIP",
    "original": "ต้นฉบับ",
    "output": "ผลลัพธ์",
    "saved": "ประหยัด",
    "dimensions": "ขนาด",
    "fileSize": "ขนาดไฟล์",
    "totalSaved": "ประหยัดรวม"
  },
  "id": {
    "resultsTitle": "Hasil",
    "resultCount": "{count} file dikonversi",
    "downloadPng": "Unduh PNG",
    "downloadZip": "Unduh ZIP",
    "original": "Asli",
    "output": "Output",
    "saved": "Hemat",
    "dimensions": "Dimensi",
    "fileSize": "Ukuran file",
    "totalSaved": "Total hemat"
  },
  "he": {
    "resultsTitle": "תוצאות",
    "resultCount": "הומרו {count} קבצים",
    "downloadPng": "הורד PNG",
    "downloadZip": "הורד ZIP",
    "original": "מקור",
    "output": "פלט",
    "saved": "חיסכון",
    "dimensions": "ממדים",
    "fileSize": "גודל קובץ",
    "totalSaved": "חיסכון כולל"
  },
  "ms": {
    "resultsTitle": "Keputusan",
    "resultCount": "{count} fail ditukar",
    "downloadPng": "Muat turun PNG",
    "downloadZip": "Muat turun ZIP",
    "original": "Asal",
    "output": "Keluaran",
    "saved": "Jimat",
    "dimensions": "Dimensi",
    "fileSize": "Saiz fail",
    "totalSaved": "Jumlah jimat"
  },
  "no": {
    "resultsTitle": "Resultater",
    "resultCount": "{count} filer konvertert",
    "downloadPng": "Last ned PNG",
    "downloadZip": "Last ned ZIP",
    "original": "Original",
    "output": "Utdata",
    "saved": "Spart",
    "dimensions": "Dimensjoner",
    "fileSize": "Filstørrelse",
    "totalSaved": "Totalt spart"
  }
}
</i18n>
