<template>
  <ConversionResults
    :title="t('resultsTitle')"
    :count-label="t('resultCount', { count: results.length })"
    :results="results"
    :zip-blob="zipBlob"
    :is-zipping="isZipping"
    :download-zip-name="downloadZipName"
    :download-avif-label="t('downloadAvif')"
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
import type { AvifConversionResult } from '../types'

defineProps<{
  results: AvifConversionResult[]
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
    "resultCount": "Converted {count} images",
    "downloadAvif": "Download AVIF",
    "downloadZip": "Download AVIF ZIP",
    "original": "Original",
    "output": "Output",
    "saved": "Saved",
    "dimensions": "Dimensions",
    "fileSize": "File size",
    "totalSaved": "Total saved"
  },
  "zh": {
    "resultsTitle": "结果",
    "resultCount": "已转换 {count} 张图片",
    "downloadAvif": "下载 AVIF",
    "downloadZip": "下载 AVIF ZIP",
    "original": "原始",
    "output": "输出",
    "saved": "节省",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "totalSaved": "总共节省"
  },
  "zh-CN": {
    "resultsTitle": "结果",
    "resultCount": "已转换 {count} 张图片",
    "downloadAvif": "下载 AVIF",
    "downloadZip": "下载 AVIF ZIP",
    "original": "原始",
    "output": "输出",
    "saved": "节省",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "totalSaved": "总共节省"
  },
  "zh-TW": {
    "resultsTitle": "結果",
    "resultCount": "已轉換 {count} 張圖片",
    "downloadAvif": "下載 AVIF",
    "downloadZip": "下載 AVIF ZIP",
    "original": "原始",
    "output": "輸出",
    "saved": "節省",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "totalSaved": "總共節省"
  },
  "zh-HK": {
    "resultsTitle": "結果",
    "resultCount": "已轉換 {count} 張圖片",
    "downloadAvif": "下載 AVIF",
    "downloadZip": "下載 AVIF ZIP",
    "original": "原始",
    "output": "輸出",
    "saved": "節省",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "totalSaved": "總共節省"
  },
  "es": {
    "resultsTitle": "Resultados",
    "resultCount": "Convertidas {count} imágenes",
    "downloadAvif": "Descargar AVIF",
    "downloadZip": "Descargar ZIP AVIF",
    "original": "Original",
    "output": "Salida",
    "saved": "Ahorro",
    "dimensions": "Dimensiones",
    "fileSize": "Tamaño de archivo",
    "totalSaved": "Ahorro total"
  },
  "fr": {
    "resultsTitle": "Résultats",
    "resultCount": "{count} images converties",
    "downloadAvif": "Télécharger AVIF",
    "downloadZip": "Télécharger le ZIP AVIF",
    "original": "Original",
    "output": "Sortie",
    "saved": "Économie",
    "dimensions": "Dimensions",
    "fileSize": "Taille du fichier",
    "totalSaved": "Économie totale"
  },
  "de": {
    "resultsTitle": "Ergebnisse",
    "resultCount": "{count} Bilder konvertiert",
    "downloadAvif": "AVIF herunterladen",
    "downloadZip": "AVIF ZIP herunterladen",
    "original": "Original",
    "output": "Ausgabe",
    "saved": "Ersparnis",
    "dimensions": "Abmessungen",
    "fileSize": "Dateigröße",
    "totalSaved": "Gesamtersparnis"
  },
  "it": {
    "resultsTitle": "Risultati",
    "resultCount": "{count} immagini convertite",
    "downloadAvif": "Scarica AVIF",
    "downloadZip": "Scarica ZIP AVIF",
    "original": "Originale",
    "output": "Output",
    "saved": "Risparmio",
    "dimensions": "Dimensioni",
    "fileSize": "Dimensione file",
    "totalSaved": "Risparmio totale"
  },
  "ja": {
    "resultsTitle": "結果",
    "resultCount": "{count} 枚の画像を変換",
    "downloadAvif": "AVIF をダウンロード",
    "downloadZip": "AVIF ZIP をダウンロード",
    "original": "元",
    "output": "出力",
    "saved": "削減",
    "dimensions": "サイズ",
    "fileSize": "ファイルサイズ",
    "totalSaved": "合計削減"
  },
  "ko": {
    "resultsTitle": "결과",
    "resultCount": "{count}개 이미지 변환됨",
    "downloadAvif": "AVIF 다운로드",
    "downloadZip": "AVIF ZIP 다운로드",
    "original": "원본",
    "output": "출력",
    "saved": "절감",
    "dimensions": "크기",
    "fileSize": "파일 크기",
    "totalSaved": "총 절감"
  },
  "ru": {
    "resultsTitle": "Результаты",
    "resultCount": "Конвертировано изображений: {count}",
    "downloadAvif": "Скачать AVIF",
    "downloadZip": "Скачать ZIP AVIF",
    "original": "Исходное",
    "output": "Результат",
    "saved": "Экономия",
    "dimensions": "Размеры",
    "fileSize": "Размер файла",
    "totalSaved": "Общая экономия"
  },
  "pt": {
    "resultsTitle": "Resultados",
    "resultCount": "{count} imagens convertidas",
    "downloadAvif": "Baixar AVIF",
    "downloadZip": "Baixar ZIP AVIF",
    "original": "Original",
    "output": "Saída",
    "saved": "Economia",
    "dimensions": "Dimensões",
    "fileSize": "Tamanho do arquivo",
    "totalSaved": "Economia total"
  },
  "ar": {
    "resultsTitle": "النتائج",
    "resultCount": "تم تحويل {count} صورة",
    "downloadAvif": "تنزيل AVIF",
    "downloadZip": "تنزيل ZIP AVIF",
    "original": "الأصل",
    "output": "النتيجة",
    "saved": "توفير",
    "dimensions": "الأبعاد",
    "fileSize": "حجم الملف",
    "totalSaved": "إجمالي التوفير"
  },
  "hi": {
    "resultsTitle": "परिणाम",
    "resultCount": "{count} इमेज बदली गई",
    "downloadAvif": "AVIF डाउनलोड करें",
    "downloadZip": "AVIF ZIP डाउनलोड करें",
    "original": "मूल",
    "output": "आउटपुट",
    "saved": "बचत",
    "dimensions": "आकार",
    "fileSize": "फ़ाइल आकार",
    "totalSaved": "कुल बचत"
  },
  "tr": {
    "resultsTitle": "Sonuçlar",
    "resultCount": "{count} görsel dönüştürüldü",
    "downloadAvif": "AVIF indir",
    "downloadZip": "AVIF ZIP indir",
    "original": "Orijinal",
    "output": "Çıktı",
    "saved": "Tasarruf",
    "dimensions": "Boyutlar",
    "fileSize": "Dosya boyutu",
    "totalSaved": "Toplam tasarruf"
  },
  "nl": {
    "resultsTitle": "Resultaten",
    "resultCount": "{count} afbeeldingen geconverteerd",
    "downloadAvif": "AVIF downloaden",
    "downloadZip": "AVIF ZIP downloaden",
    "original": "Origineel",
    "output": "Uitvoer",
    "saved": "Besparing",
    "dimensions": "Afmetingen",
    "fileSize": "Bestandsgrootte",
    "totalSaved": "Totale besparing"
  },
  "sv": {
    "resultsTitle": "Resultat",
    "resultCount": "{count} bilder konverterade",
    "downloadAvif": "Ladda ner AVIF",
    "downloadZip": "Ladda ner AVIF ZIP",
    "original": "Original",
    "output": "Utdata",
    "saved": "Sparat",
    "dimensions": "Dimensioner",
    "fileSize": "Filstorlek",
    "totalSaved": "Totalt sparat"
  },
  "pl": {
    "resultsTitle": "Wyniki",
    "resultCount": "Skonwertowano {count} obrazów",
    "downloadAvif": "Pobierz AVIF",
    "downloadZip": "Pobierz ZIP AVIF",
    "original": "Oryginał",
    "output": "Wynik",
    "saved": "Oszczędność",
    "dimensions": "Wymiary",
    "fileSize": "Rozmiar pliku",
    "totalSaved": "Łączna oszczędność"
  },
  "vi": {
    "resultsTitle": "Kết quả",
    "resultCount": "Đã chuyển đổi {count} ảnh",
    "downloadAvif": "Tải AVIF",
    "downloadZip": "Tải ZIP AVIF",
    "original": "Gốc",
    "output": "Kết quả",
    "saved": "Tiết kiệm",
    "dimensions": "Kích thước",
    "fileSize": "Dung lượng tệp",
    "totalSaved": "Tổng tiết kiệm"
  },
  "th": {
    "resultsTitle": "ผลลัพธ์",
    "resultCount": "แปลงแล้ว {count} รูป",
    "downloadAvif": "ดาวน์โหลด AVIF",
    "downloadZip": "ดาวน์โหลด ZIP AVIF",
    "original": "ต้นฉบับ",
    "output": "ผลลัพธ์",
    "saved": "ประหยัด",
    "dimensions": "ขนาด",
    "fileSize": "ขนาดไฟล์",
    "totalSaved": "ประหยัดทั้งหมด"
  },
  "id": {
    "resultsTitle": "Hasil",
    "resultCount": "{count} gambar dikonversi",
    "downloadAvif": "Unduh AVIF",
    "downloadZip": "Unduh ZIP AVIF",
    "original": "Asli",
    "output": "Hasil",
    "saved": "Hemat",
    "dimensions": "Dimensi",
    "fileSize": "Ukuran file",
    "totalSaved": "Total hemat"
  },
  "he": {
    "resultsTitle": "תוצאות",
    "resultCount": "הומרו {count} תמונות",
    "downloadAvif": "הורד AVIF",
    "downloadZip": "הורד ZIP AVIF",
    "original": "מקור",
    "output": "פלט",
    "saved": "חיסכון",
    "dimensions": "ממדים",
    "fileSize": "גודל קובץ",
    "totalSaved": "חיסכון כולל"
  },
  "ms": {
    "resultsTitle": "Keputusan",
    "resultCount": "{count} imej ditukar",
    "downloadAvif": "Muat turun AVIF",
    "downloadZip": "Muat turun ZIP AVIF",
    "original": "Asal",
    "output": "Output",
    "saved": "Penjimatan",
    "dimensions": "Dimensi",
    "fileSize": "Saiz fail",
    "totalSaved": "Jumlah penjimatan"
  },
  "no": {
    "resultsTitle": "Resultater",
    "resultCount": "{count} bilder konvertert",
    "downloadAvif": "Last ned AVIF",
    "downloadZip": "Last ned AVIF ZIP",
    "original": "Original",
    "output": "Utdata",
    "saved": "Spart",
    "dimensions": "Dimensjoner",
    "fileSize": "Filstørrelse",
    "totalSaved": "Totalt spart"
  }
}
</i18n>
