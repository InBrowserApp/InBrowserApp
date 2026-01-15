<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ImageUpload v-model:file="imageFile" />

    <template v-if="imageFile">
      <ImagePreview :file="imageFile" @clear="clearFile" />

      <ToolSection>
        <n-flex vertical :size="12">
          <n-text depth="3">{{ t('note') }}</n-text>
          <n-button type="primary" :loading="isCleaning" @click="cleanMetadata">
            <template #icon>
              <n-icon :component="DeleteIcon" />
            </template>
            {{ isCleaning ? t('cleaningMetadata') : t('cleanMetadata') }}
          </n-button>
        </n-flex>
      </ToolSection>
    </template>

    <ToolSection v-if="cleanedBlob && imageFile">
      <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
      <n-flex vertical :size="24">
        <n-grid cols="1 700:3" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <n-statistic :label="t('removed')">
              {{ formattedRemovedBytes }}
            </n-statistic>
          </n-grid-item>
          <n-grid-item>
            <n-statistic :value="reductionPercent" :label="t('reduction')">
              <template #suffix>%</template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item>
            <n-statistic :label="t('fileSize')">
              {{ formattedCleanedSize }} / {{ formattedOriginalSize }}
            </n-statistic>
          </n-grid-item>
        </n-grid>

        <n-flex justify="center" style="width: 100%">
          <n-button
            tag="a"
            type="primary"
            :href="blobUrl"
            :download="downloadName"
            style="width: 100%"
          >
            <template #icon>
              <n-icon :component="DownloadIcon" />
            </template>
            {{ t('downloadCleaned') }}
          </n-button>
        </n-flex>
      </n-flex>
    </ToolSection>

    <ToolSection v-if="error">
      <n-alert type="warning" :title="t('error')">
        {{ error }}
      </n-alert>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { filesize } from 'filesize'
import { useObjectUrl } from '@vueuse/core'
import { NAlert, NButton, NFlex, NGrid, NGridItem, NIcon, NStatistic, NText } from 'naive-ui'
import { ArrowDownload24Regular as DownloadIcon, Delete24Regular as DeleteIcon } from '@shared/icons/fluent'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { stripImageMetadata } from '@utils/image'
import * as toolInfo from './info'
import ImagePreview from './components/ImagePreview.vue'
import ImageUpload from './components/ImageUpload.vue'

const { t } = useI18n()
const message = useMessage()

const imageFile = ref<File | null>(null)
const cleanedBlob = ref<Blob | null>(null)
const removedBytes = ref(0)
const isCleaning = ref(false)
const error = ref('')

const formattedOriginalSize = computed(() =>
  imageFile.value ? (filesize(imageFile.value.size) as string) : '',
)
const formattedCleanedSize = computed(() =>
  cleanedBlob.value ? (filesize(cleanedBlob.value.size) as string) : '',
)
const formattedRemovedBytes = computed(() => filesize(removedBytes.value) as string)
const reductionPercent = computed(() => {
  if (!imageFile.value || !cleanedBlob.value) return 0
  if (imageFile.value.size === 0) return 0
  const reduction = ((imageFile.value.size - cleanedBlob.value.size) / imageFile.value.size) * 100
  return Math.max(0, Math.round(reduction))
})
const downloadName = computed(() => imageFile.value?.name || 'cleaned-image')
const blobUrl = useObjectUrl(cleanedBlob)

function clearFile() {
  imageFile.value = null
  cleanedBlob.value = null
  removedBytes.value = 0
  error.value = ''
}

watch(imageFile, () => {
  cleanedBlob.value = null
  removedBytes.value = 0
  error.value = ''
})

async function cleanMetadata() {
  if (!imageFile.value || isCleaning.value) return

  isCleaning.value = true
  error.value = ''
  cleanedBlob.value = null
  removedBytes.value = 0

  try {
    const buffer = await imageFile.value.arrayBuffer()
    const result = stripImageMetadata(new Uint8Array(buffer))
    const cleanedBytes = new Uint8Array(result.cleaned)
    const mimeType = imageFile.value.type || formatToMime(result.format)
    cleanedBlob.value = new Blob([cleanedBytes.buffer], { type: mimeType })
    removedBytes.value = Math.max(0, imageFile.value.size - cleanedBlob.value.size)
    message.success(t('cleaningComplete'))
  } catch (err) {
    cleanedBlob.value = null
    removedBytes.value = 0
    error.value = toErrorMessage(err)
    message.error(error.value)
  } finally {
    isCleaning.value = false
  }
}

function formatToMime(format: 'jpeg' | 'png' | 'webp'): string {
  if (format === 'jpeg') return 'image/jpeg'
  if (format === 'png') return 'image/png'
  return 'image/webp'
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message === 'Unsupported image format') {
    return t('unsupportedFormat')
  }
  return err instanceof Error ? err.message : t('cleaningFailed')
}

</script>

<i18n lang="json">
{
  "en": {
    "cleanMetadata": "Clean metadata",
    "cleaningMetadata": "Cleaning metadata...",
    "results": "Cleaning results",
    "removed": "Metadata removed",
    "reduction": "Size reduction",
    "fileSize": "File size",
    "downloadCleaned": "Download cleaned image",
    "note": "Runs locally in your browser. No uploads.",
    "error": "Error",
    "unsupportedFormat": "Unsupported format. Please upload JPEG, PNG, or WebP.",
    "cleaningComplete": "Metadata cleaned.",
    "cleaningFailed": "Failed to clean metadata. Please try again."
  },
  "zh": {
    "cleanMetadata": "清理元数据",
    "cleaningMetadata": "正在清理元数据...",
    "results": "清理结果",
    "removed": "已移除元数据",
    "reduction": "大小减少",
    "fileSize": "文件大小",
    "downloadCleaned": "下载清理后的图片",
    "note": "本地浏览器处理，不会上传文件。",
    "error": "错误",
    "unsupportedFormat": "不支持的格式，请上传 JPEG、PNG 或 WebP。",
    "cleaningComplete": "元数据已清理。",
    "cleaningFailed": "清理元数据失败，请重试。"
  },
  "zh-CN": {
    "cleanMetadata": "清理元数据",
    "cleaningMetadata": "正在清理元数据...",
    "results": "清理结果",
    "removed": "已移除元数据",
    "reduction": "大小减少",
    "fileSize": "文件大小",
    "downloadCleaned": "下载清理后的图片",
    "note": "本地浏览器处理，不会上传文件。",
    "error": "错误",
    "unsupportedFormat": "不支持的格式，请上传 JPEG、PNG 或 WebP。",
    "cleaningComplete": "元数据已清理。",
    "cleaningFailed": "清理元数据失败，请重试。"
  },
  "zh-TW": {
    "cleanMetadata": "清理元資料",
    "cleaningMetadata": "正在清理元資料...",
    "results": "清理結果",
    "removed": "已移除的元資料",
    "reduction": "大小減少",
    "fileSize": "檔案大小",
    "downloadCleaned": "下載清理後的圖片",
    "note": "在瀏覽器本地處理，不會上傳檔案。",
    "error": "錯誤",
    "unsupportedFormat": "不支援的格式，請上傳 JPEG、PNG 或 WebP。",
    "cleaningComplete": "元資料已清理。",
    "cleaningFailed": "清理元資料失敗，請重試。"
  },
  "zh-HK": {
    "cleanMetadata": "清理元資料",
    "cleaningMetadata": "正在清理元資料...",
    "results": "清理結果",
    "removed": "已移除的元資料",
    "reduction": "大小減少",
    "fileSize": "檔案大小",
    "downloadCleaned": "下載清理後的圖片",
    "note": "在瀏覽器本地處理，不會上傳檔案。",
    "error": "錯誤",
    "unsupportedFormat": "不支援的格式，請上傳 JPEG、PNG 或 WebP。",
    "cleaningComplete": "元資料已清理。",
    "cleaningFailed": "清理元資料失敗，請重試。"
  },
  "es": {
    "cleanMetadata": "Limpiar metadatos",
    "cleaningMetadata": "Limpiando metadatos...",
    "results": "Resultados de limpieza",
    "removed": "Metadatos eliminados",
    "reduction": "Reducción de tamaño",
    "fileSize": "Tamaño del archivo",
    "downloadCleaned": "Descargar imagen limpiada",
    "note": "Se procesa localmente en el navegador. No se sube ningún archivo.",
    "error": "Error",
    "unsupportedFormat": "Formato no compatible. Sube JPEG, PNG o WebP.",
    "cleaningComplete": "Metadatos limpiados.",
    "cleaningFailed": "No se pudo limpiar los metadatos. Inténtalo de nuevo."
  },
  "fr": {
    "cleanMetadata": "Nettoyer les métadonnées",
    "cleaningMetadata": "Nettoyage des métadonnées...",
    "results": "Résultats du nettoyage",
    "removed": "Métadonnées supprimées",
    "reduction": "Réduction de taille",
    "fileSize": "Taille du fichier",
    "downloadCleaned": "Télécharger l'image nettoyée",
    "note": "Traitement local dans le navigateur. Aucun fichier n'est envoyé.",
    "error": "Erreur",
    "unsupportedFormat": "Format non pris en charge. Importez JPEG, PNG ou WebP.",
    "cleaningComplete": "Métadonnées nettoyées.",
    "cleaningFailed": "Échec du nettoyage des métadonnées. Veuillez réessayer."
  },
  "de": {
    "cleanMetadata": "Metadaten bereinigen",
    "cleaningMetadata": "Metadaten werden bereinigt...",
    "results": "Bereinigungsergebnisse",
    "removed": "Entfernte Metadaten",
    "reduction": "Größenreduktion",
    "fileSize": "Dateigröße",
    "downloadCleaned": "Bereinigtes Bild herunterladen",
    "note": "Lokal im Browser verarbeitet. Keine Uploads.",
    "error": "Fehler",
    "unsupportedFormat": "Nicht unterstütztes Format. Bitte JPEG, PNG oder WebP hochladen.",
    "cleaningComplete": "Metadaten bereinigt.",
    "cleaningFailed": "Metadaten konnten nicht bereinigt werden. Bitte erneut versuchen."
  },
  "it": {
    "cleanMetadata": "Pulisci metadati",
    "cleaningMetadata": "Pulizia metadati...",
    "results": "Risultati della pulizia",
    "removed": "Metadati rimossi",
    "reduction": "Riduzione dimensione",
    "fileSize": "Dimensione file",
    "downloadCleaned": "Scarica immagine pulita",
    "note": "Elaborazione locale nel browser. Nessun caricamento.",
    "error": "Errore",
    "unsupportedFormat": "Formato non supportato. Carica JPEG, PNG o WebP.",
    "cleaningComplete": "Metadati puliti.",
    "cleaningFailed": "Impossibile pulire i metadati. Riprova."
  },
  "ja": {
    "cleanMetadata": "メタデータを削除",
    "cleaningMetadata": "メタデータを削除中...",
    "results": "削除結果",
    "removed": "削除したメタデータ",
    "reduction": "サイズ削減",
    "fileSize": "ファイルサイズ",
    "downloadCleaned": "クリーン画像をダウンロード",
    "note": "ブラウザ内で処理します。アップロードされません。",
    "error": "エラー",
    "unsupportedFormat": "未対応の形式です。JPEG、PNG、WebP をアップロードしてください。",
    "cleaningComplete": "メタデータを削除しました。",
    "cleaningFailed": "メタデータの削除に失敗しました。再試行してください。"
  },
  "ko": {
    "cleanMetadata": "메타데이터 정리",
    "cleaningMetadata": "메타데이터 정리 중...",
    "results": "정리 결과",
    "removed": "제거된 메타데이터",
    "reduction": "크기 감소",
    "fileSize": "파일 크기",
    "downloadCleaned": "정리된 이미지 다운로드",
    "note": "브라우저에서 로컬로 처리됩니다. 업로드되지 않습니다.",
    "error": "오류",
    "unsupportedFormat": "지원하지 않는 형식입니다. JPEG, PNG 또는 WebP를 업로드하세요.",
    "cleaningComplete": "메타데이터가 정리되었습니다.",
    "cleaningFailed": "메타데이터 정리에 실패했습니다. 다시 시도하세요."
  },
  "ru": {
    "cleanMetadata": "Очистить метаданные",
    "cleaningMetadata": "Очистка метаданных...",
    "results": "Результаты очистки",
    "removed": "Удаленные метаданные",
    "reduction": "Сокращение размера",
    "fileSize": "Размер файла",
    "downloadCleaned": "Скачать очищенное изображение",
    "note": "Обработка локально в браузере. Файлы не загружаются.",
    "error": "Ошибка",
    "unsupportedFormat": "Неподдерживаемый формат. Загрузите JPEG, PNG или WebP.",
    "cleaningComplete": "Метаданные очищены.",
    "cleaningFailed": "Не удалось очистить метаданные. Попробуйте снова."
  },
  "pt": {
    "cleanMetadata": "Limpar metadados",
    "cleaningMetadata": "Limpando metadados...",
    "results": "Resultados da limpeza",
    "removed": "Metadados removidos",
    "reduction": "Redução de tamanho",
    "fileSize": "Tamanho do arquivo",
    "downloadCleaned": "Baixar imagem limpa",
    "note": "Processado localmente no navegador. Nenhum upload.",
    "error": "Erro",
    "unsupportedFormat": "Formato não suportado. Envie JPEG, PNG ou WebP.",
    "cleaningComplete": "Metadados limpos.",
    "cleaningFailed": "Falha ao limpar metadados. Tente novamente."
  },
  "ar": {
    "cleanMetadata": "تنظيف البيانات الوصفية",
    "cleaningMetadata": "جارٍ تنظيف البيانات الوصفية...",
    "results": "نتائج التنظيف",
    "removed": "البيانات الوصفية المُزالة",
    "reduction": "تقليل الحجم",
    "fileSize": "حجم الملف",
    "downloadCleaned": "تنزيل الصورة المنظفة",
    "note": "يتم المعالجة محليًا في المتصفح. لا يتم رفع الملفات.",
    "error": "خطأ",
    "unsupportedFormat": "تنسيق غير مدعوم. يرجى رفع JPEG أو PNG أو WebP.",
    "cleaningComplete": "تم تنظيف البيانات الوصفية.",
    "cleaningFailed": "فشل في تنظيف البيانات الوصفية. حاول مرة أخرى."
  },
  "hi": {
    "cleanMetadata": "मेटाडेटा साफ़ करें",
    "cleaningMetadata": "मेटाडेटा साफ़ किया जा रहा है...",
    "results": "सफाई परिणाम",
    "removed": "हटाया गया मेटाडेटा",
    "reduction": "आकार में कमी",
    "fileSize": "फ़ाइल आकार",
    "downloadCleaned": "साफ़ की गई छवि डाउनलोड करें",
    "note": "ब्राउज़र में स्थानीय रूप से प्रोसेस होता है। कोई अपलोड नहीं।",
    "error": "त्रुटि",
    "unsupportedFormat": "असमर्थित फ़ॉर्मैट। कृपया JPEG, PNG या WebP अपलोड करें।",
    "cleaningComplete": "मेटाडेटा साफ़ किया गया।",
    "cleaningFailed": "मेटाडेटा साफ़ करने में विफल। फिर से कोशिश करें।"
  },
  "tr": {
    "cleanMetadata": "Meta verileri temizle",
    "cleaningMetadata": "Meta veriler temizleniyor...",
    "results": "Temizleme sonuçları",
    "removed": "Kaldırılan meta veriler",
    "reduction": "Boyut azaltma",
    "fileSize": "Dosya boyutu",
    "downloadCleaned": "Temizlenmiş resmi indir",
    "note": "Tarayıcıda yerel olarak işlenir. Yükleme yapılmaz.",
    "error": "Hata",
    "unsupportedFormat": "Desteklenmeyen format. JPEG, PNG veya WebP yükleyin.",
    "cleaningComplete": "Meta veriler temizlendi.",
    "cleaningFailed": "Meta veriler temizlenemedi. Tekrar deneyin."
  },
  "nl": {
    "cleanMetadata": "Metadaten opschonen",
    "cleaningMetadata": "Metadaten worden opgeschoond...",
    "results": "Opschoningsresultaten",
    "removed": "Verwijderde metadaten",
    "reduction": "Grootte-reductie",
    "fileSize": "Bestandsgrootte",
    "downloadCleaned": "Opgeschoonde afbeelding downloaden",
    "note": "Lokaal in de browser verwerkt. Geen uploads.",
    "error": "Fout",
    "unsupportedFormat": "Niet ondersteund formaat. Upload JPEG, PNG of WebP.",
    "cleaningComplete": "Metadaten opgeschoond.",
    "cleaningFailed": "Metadaten opschonen mislukt. Probeer het opnieuw."
  },
  "sv": {
    "cleanMetadata": "Rensa metadata",
    "cleaningMetadata": "Rensar metadata...",
    "results": "Rensningsresultat",
    "removed": "Borttagen metadata",
    "reduction": "Storleksminskning",
    "fileSize": "Filstorlek",
    "downloadCleaned": "Ladda ner rensad bild",
    "note": "Bearbetas lokalt i webbläsaren. Inga uppladdningar.",
    "error": "Fel",
    "unsupportedFormat": "Formatet stöds inte. Ladda upp JPEG, PNG eller WebP.",
    "cleaningComplete": "Metadata rensad.",
    "cleaningFailed": "Kunde inte rensa metadata. Försök igen."
  },
  "pl": {
    "cleanMetadata": "Wyczyść metadane",
    "cleaningMetadata": "Czyszczenie metadanych...",
    "results": "Wyniki czyszczenia",
    "removed": "Usunięte metadane",
    "reduction": "Zmniejszenie rozmiaru",
    "fileSize": "Rozmiar pliku",
    "downloadCleaned": "Pobierz oczyszczony obraz",
    "note": "Przetwarzanie lokalne w przeglądarce. Bez przesyłania.",
    "error": "Błąd",
    "unsupportedFormat": "Nieobsługiwany format. Prześlij JPEG, PNG lub WebP.",
    "cleaningComplete": "Metadane wyczyszczone.",
    "cleaningFailed": "Nie udało się wyczyścić metadanych. Spróbuj ponownie."
  },
  "vi": {
    "cleanMetadata": "Làm sạch siêu dữ liệu",
    "cleaningMetadata": "Đang làm sạch siêu dữ liệu...",
    "results": "Kết quả làm sạch",
    "removed": "Siêu dữ liệu đã xóa",
    "reduction": "Giảm kích thước",
    "fileSize": "Kích thước tệp",
    "downloadCleaned": "Tải ảnh đã làm sạch",
    "note": "Xử lý cục bộ trong trình duyệt. Không tải lên.",
    "error": "Lỗi",
    "unsupportedFormat": "Định dạng không hỗ trợ. Vui lòng tải JPEG, PNG hoặc WebP.",
    "cleaningComplete": "Đã làm sạch siêu dữ liệu.",
    "cleaningFailed": "Không thể làm sạch siêu dữ liệu. Vui lòng thử lại."
  },
  "th": {
    "cleanMetadata": "ล้างเมตาดาตา",
    "cleaningMetadata": "กำลังล้างเมตาดาตา...",
    "results": "ผลลัพธ์การล้าง",
    "removed": "เมตาดาตาที่ลบแล้ว",
    "reduction": "ลดขนาด",
    "fileSize": "ขนาดไฟล์",
    "downloadCleaned": "ดาวน์โหลดรูปที่ล้างแล้ว",
    "note": "ประมวลผลในเบราว์เซอร์แบบโลคัล ไม่มีการอัปโหลด",
    "error": "ข้อผิดพลาด",
    "unsupportedFormat": "รูปแบบไม่รองรับ โปรดอัปโหลด JPEG, PNG หรือ WebP",
    "cleaningComplete": "ล้างเมตาดาตาแล้ว",
    "cleaningFailed": "ล้างเมตาดาตาไม่สำเร็จ โปรดลองอีกครั้ง"
  },
  "id": {
    "cleanMetadata": "Bersihkan metadata",
    "cleaningMetadata": "Membersihkan metadata...",
    "results": "Hasil pembersihan",
    "removed": "Metadata yang dihapus",
    "reduction": "Pengurangan ukuran",
    "fileSize": "Ukuran file",
    "downloadCleaned": "Unduh gambar yang dibersihkan",
    "note": "Diproses secara lokal di browser. Tidak ada unggahan.",
    "error": "Kesalahan",
    "unsupportedFormat": "Format tidak didukung. Unggah JPEG, PNG, atau WebP.",
    "cleaningComplete": "Metadata dibersihkan.",
    "cleaningFailed": "Gagal membersihkan metadata. Silakan coba lagi."
  },
  "he": {
    "cleanMetadata": "נקה מטא-נתונים",
    "cleaningMetadata": "מנקה מטא-נתונים...",
    "results": "תוצאות הניקוי",
    "removed": "מטא-נתונים שהוסרו",
    "reduction": "הפחתת גודל",
    "fileSize": "גודל הקובץ",
    "downloadCleaned": "הורד תמונה נקייה",
    "note": "מעובד מקומית בדפדפן. אין העלאה.",
    "error": "שגיאה",
    "unsupportedFormat": "פורמט לא נתמך. אנא העלה JPEG, PNG או WebP.",
    "cleaningComplete": "המטא-נתונים נוקו.",
    "cleaningFailed": "נכשל בניקוי המטא-נתונים. נסה שוב."
  },
  "ms": {
    "cleanMetadata": "Bersihkan metadata",
    "cleaningMetadata": "Membersihkan metadata...",
    "results": "Hasil pembersihan",
    "removed": "Metadata yang dibuang",
    "reduction": "Pengurangan saiz",
    "fileSize": "Saiz fail",
    "downloadCleaned": "Muat turun imej yang dibersihkan",
    "note": "Diproses secara tempatan di pelayar. Tiada muat naik.",
    "error": "Ralat",
    "unsupportedFormat": "Format tidak disokong. Muat naik JPEG, PNG atau WebP.",
    "cleaningComplete": "Metadata dibersihkan.",
    "cleaningFailed": "Gagal membersihkan metadata. Cuba lagi."
  },
  "no": {
    "cleanMetadata": "Rens metadata",
    "cleaningMetadata": "Renser metadata...",
    "results": "Rense-resultater",
    "removed": "Fjernet metadata",
    "reduction": "Størrelsesreduksjon",
    "fileSize": "Filstørrelse",
    "downloadCleaned": "Last ned renset bilde",
    "note": "Behandles lokalt i nettleseren. Ingen opplasting.",
    "error": "Feil",
    "unsupportedFormat": "Formatet støttes ikke. Last opp JPEG, PNG eller WebP.",
    "cleaningComplete": "Metadata renset.",
    "cleaningFailed": "Kunne ikke rense metadata. Prøv igjen."
  }
}
</i18n>
