<template>
  <ArchiveUploadSection
    :archive-file="archiveFile"
    :archive-size-summary="archiveSizeSummary"
    :accepted-formats="acceptedFormats"
    :handle-before-upload="handleBeforeUpload"
    :on-choose-another-archive="chooseAnotherArchive"
  />

  <ArchiveEntriesSection
    v-model:search="search"
    :is-parsing="isParsing"
    :has-archive="Boolean(archiveHandle)"
    :has-error="Boolean(errorMessage)"
    :breadcrumbs="breadcrumbs"
    :can-go-to-parent-directory="canGoToParentDirectory"
    :is-exporting-all="isExportingAll"
    :export-progress-percent="exportProgressPercent"
    :can-export-all-entries="canExportAllEntries"
    :rows="rows"
    :table-row-props="tableRowProps"
    @go-to-directory="goToDirectory"
    @go-to-parent-directory="goToParentDirectory"
    @export-all-entries="exportAllEntries"
  />

  <ArchivePreviewModal
    v-model:show="isPreviewModalVisible"
    :selected-entry="selectedEntry"
    :selected-blob-url="selectedBlobUrl"
    :preview-kind="previewKind"
    :preview-text="previewText"
    :preview-language="previewLanguage"
    :is-loading-preview="isLoadingPreview"
    :download-name="downloadName"
    :should-show-copy-preview="shouldShowCopyPreview"
    :format-bytes="formatBytes"
    @after-leave="closePreviewModal"
  />

  <ToolSection v-if="errorMessage">
    <n-alert type="error" :title="t('error-title')">
      {{ errorMessage }}
    </n-alert>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import ArchiveEntriesSection from './ArchiveEntriesSection.vue'
import ArchivePreviewModal from './ArchivePreviewModal.vue'
import ArchiveUploadSection from './ArchiveUploadSection.vue'
import { type ArchiveViewerLogicLabels, useArchiveViewer } from './use-archive-viewer'

const { t } = useI18n()

const logicLabels = computed<ArchiveViewerLogicLabels>(() => ({
  unsupportedFormat: t('unsupported-format'),
  selectFileFailed: t('select-file-failed'),
  exportSucceeded: t('export-succeeded'),
  exportFailed: t('export-failed'),
  previewTooLarge: t('preview-too-large'),
  noPreview: t('no-preview'),
  parseFailed: t('parse-failed'),
}))

const {
  acceptedFormats,
  archiveFile,
  archiveHandle,
  archiveSizeSummary,
  breadcrumbs,
  canExportAllEntries,
  canGoToParentDirectory,
  chooseAnotherArchive,
  closePreviewModal,
  downloadName,
  errorMessage,
  exportAllEntries,
  exportProgressPercent,
  formatBytes,
  goToDirectory,
  goToParentDirectory,
  handleBeforeUpload,
  isExportingAll,
  isLoadingPreview,
  isParsing,
  isPreviewModalVisible,
  previewKind,
  previewLanguage,
  previewText,
  rows,
  search,
  selectedBlobUrl,
  selectedEntry,
  shouldShowCopyPreview,
  tableRowProps,
} = useArchiveViewer(logicLabels)
</script>

<i18n lang="json">
{
  "en": {
    "unsupported-format": "Unsupported file format. Please upload ZIP, TAR, GZ, or TGZ.",
    "select-file-failed": "Unable to select archive.",
    "export-succeeded": "Archive exported to local folder.",
    "export-failed": "Failed to export archive entries.",
    "preview-too-large": "Preview is limited to 1 MB. Download to inspect full content.",
    "no-preview": "Preview is not available for this file type.",
    "parse-failed": "Unable to parse archive.",
    "error-title": "Error"
  },
  "zh": {
    "unsupported-format": "不支持的文件格式，请上传 ZIP、TAR、GZ 或 TGZ。",
    "select-file-failed": "选择压缩包失败。",
    "export-succeeded": "压缩包已导出到本地文件夹。",
    "export-failed": "导出压缩包条目失败。",
    "preview-too-large": "预览限制为 1 MB，请下载后查看完整内容。",
    "no-preview": "此文件类型暂不支持预览。",
    "parse-failed": "无法解析压缩包。",
    "error-title": "错误"
  },
  "zh-CN": {
    "unsupported-format": "不支持的文件格式，请上传 ZIP、TAR、GZ 或 TGZ。",
    "select-file-failed": "选择压缩包失败。",
    "export-succeeded": "压缩包已导出到本地文件夹。",
    "export-failed": "导出压缩包条目失败。",
    "preview-too-large": "预览限制为 1 MB，请下载后查看完整内容。",
    "no-preview": "此文件类型暂不支持预览。",
    "parse-failed": "无法解析压缩包。",
    "error-title": "错误"
  },
  "zh-TW": {
    "unsupported-format": "不支援的檔案格式，請上傳 ZIP、TAR、GZ 或 TGZ。",
    "select-file-failed": "選擇壓縮檔失敗。",
    "export-succeeded": "壓縮檔已匯出到本機資料夾。",
    "export-failed": "匯出壓縮檔內容失敗。",
    "preview-too-large": "預覽限制為 1 MB，請下載後查看完整內容。",
    "no-preview": "此檔案類型暫不支援預覽。",
    "parse-failed": "無法解析壓縮檔。",
    "error-title": "錯誤"
  },
  "zh-HK": {
    "unsupported-format": "不支援的檔案格式，請上傳 ZIP、TAR、GZ 或 TGZ。",
    "select-file-failed": "選擇壓縮檔失敗。",
    "export-succeeded": "壓縮檔已匯出到本機資料夾。",
    "export-failed": "匯出壓縮檔內容失敗。",
    "preview-too-large": "預覽限制為 1 MB，請下載後查看完整內容。",
    "no-preview": "此檔案類型暫不支援預覽。",
    "parse-failed": "無法解析壓縮檔。",
    "error-title": "錯誤"
  },
  "es": {
    "unsupported-format": "Formato no compatible. Sube ZIP, TAR, GZ o TGZ.",
    "select-file-failed": "No se pudo seleccionar el archivo comprimido.",
    "export-succeeded": "Archivo exportado a la carpeta local.",
    "export-failed": "Error al exportar las entradas del archivo.",
    "preview-too-large": "La vista previa está limitada a 1 MB. Descarga para ver el contenido completo.",
    "no-preview": "No hay vista previa para este tipo de archivo.",
    "parse-failed": "No se pudo analizar el archivo comprimido.",
    "error-title": "Error"
  },
  "fr": {
    "unsupported-format": "Format non pris en charge. Importez ZIP, TAR, GZ ou TGZ.",
    "select-file-failed": "Impossible de sélectionner l’archive.",
    "export-succeeded": "Archive exportée vers le dossier local.",
    "export-failed": "Échec de l’export des entrées de l’archive.",
    "preview-too-large": "L’aperçu est limité à 1 Mo. Téléchargez pour voir le contenu complet.",
    "no-preview": "Aucun aperçu pour ce type de fichier.",
    "parse-failed": "Impossible d’analyser l’archive.",
    "error-title": "Erreur"
  },
  "de": {
    "unsupported-format": "Nicht unterstütztes Format. Bitte ZIP, TAR, GZ oder TGZ hochladen.",
    "select-file-failed": "Archiv konnte nicht ausgewählt werden.",
    "export-succeeded": "Archiv in lokalen Ordner exportiert.",
    "export-failed": "Archiv-Einträge konnten nicht exportiert werden.",
    "preview-too-large": "Die Vorschau ist auf 1 MB begrenzt. Zum vollständigen Inhalt herunterladen.",
    "no-preview": "Für diesen Dateityp ist keine Vorschau verfügbar.",
    "parse-failed": "Archiv konnte nicht analysiert werden.",
    "error-title": "Fehler"
  },
  "it": {
    "unsupported-format": "Formato non supportato. Carica ZIP, TAR, GZ o TGZ.",
    "select-file-failed": "Impossibile selezionare l’archivio.",
    "export-succeeded": "Archivio esportato nella cartella locale.",
    "export-failed": "Impossibile esportare le voci dell’archivio.",
    "preview-too-large": "L’anteprima è limitata a 1 MB. Scarica per vedere il contenuto completo.",
    "no-preview": "Anteprima non disponibile per questo tipo di file.",
    "parse-failed": "Impossibile analizzare l’archivio.",
    "error-title": "Errore"
  },
  "pt": {
    "unsupported-format": "Formato não suportado. Envie ZIP, TAR, GZ ou TGZ.",
    "select-file-failed": "Não foi possível selecionar o arquivo compactado.",
    "export-succeeded": "Arquivo exportado para a pasta local.",
    "export-failed": "Falha ao exportar entradas do arquivo.",
    "preview-too-large": "A visualização é limitada a 1 MB. Baixe para ver o conteúdo completo.",
    "no-preview": "Visualização não disponível para este tipo de arquivo.",
    "parse-failed": "Não foi possível analisar o arquivo compactado.",
    "error-title": "Erro"
  },
  "ru": {
    "unsupported-format": "Неподдерживаемый формат. Загрузите ZIP, TAR, GZ или TGZ.",
    "select-file-failed": "Не удалось выбрать архив.",
    "export-succeeded": "Архив экспортирован в локальную папку.",
    "export-failed": "Не удалось экспортировать содержимое архива.",
    "preview-too-large": "Предпросмотр ограничен 1 МБ. Скачайте файл, чтобы увидеть полное содержимое.",
    "no-preview": "Предпросмотр для этого типа файла недоступен.",
    "parse-failed": "Не удалось разобрать архив.",
    "error-title": "Ошибка"
  },
  "tr": {
    "unsupported-format": "Desteklenmeyen dosya biçimi. Lütfen ZIP, TAR, GZ veya TGZ yükleyin.",
    "select-file-failed": "Arşiv seçilemedi.",
    "export-succeeded": "Arşiv yerel klasöre aktarıldı.",
    "export-failed": "Arşiv girdileri aktarılamadı.",
    "preview-too-large": "Önizleme 1 MB ile sınırlıdır. Tam içeriği görmek için indirin.",
    "no-preview": "Bu dosya türü için önizleme yok.",
    "parse-failed": "Arşiv ayrıştırılamadı.",
    "error-title": "Hata"
  },
  "nl": {
    "unsupported-format": "Niet ondersteund formaat. Upload ZIP, TAR, GZ of TGZ.",
    "select-file-failed": "Archiefbestand kon niet worden geselecteerd.",
    "export-succeeded": "Archief geëxporteerd naar lokale map.",
    "export-failed": "Exporteren van archiefitems is mislukt.",
    "preview-too-large": "Voorbeeld is beperkt tot 1 MB. Download om volledige inhoud te bekijken.",
    "no-preview": "Voorbeeld is niet beschikbaar voor dit bestandstype.",
    "parse-failed": "Archief kon niet worden geparseerd.",
    "error-title": "Fout"
  },
  "sv": {
    "unsupported-format": "Formatet stöds inte. Ladda upp ZIP, TAR, GZ eller TGZ.",
    "select-file-failed": "Det gick inte att välja arkiv.",
    "export-succeeded": "Arkivet exporterades till lokal mapp.",
    "export-failed": "Kunde inte exportera arkivposter.",
    "preview-too-large": "Förhandsvisning är begränsad till 1 MB. Ladda ner för fullt innehåll.",
    "no-preview": "Förhandsvisning finns inte för den här filtypen.",
    "parse-failed": "Det gick inte att tolka arkivet.",
    "error-title": "Fel"
  },
  "pl": {
    "unsupported-format": "Nieobsługiwany format pliku. Prześlij ZIP, TAR, GZ lub TGZ.",
    "select-file-failed": "Nie udało się wybrać archiwum.",
    "export-succeeded": "Archiwum wyeksportowano do lokalnego folderu.",
    "export-failed": "Nie udało się wyeksportować wpisów archiwum.",
    "preview-too-large": "Podgląd jest ograniczony do 1 MB. Pobierz plik, aby zobaczyć całość.",
    "no-preview": "Podgląd jest niedostępny dla tego typu pliku.",
    "parse-failed": "Nie udało się przeanalizować archiwum.",
    "error-title": "Błąd"
  },
  "no": {
    "unsupported-format": "Ikke støttet filformat. Last opp ZIP, TAR, GZ eller TGZ.",
    "select-file-failed": "Kunne ikke velge arkiv.",
    "export-succeeded": "Arkivet ble eksportert til lokal mappe.",
    "export-failed": "Kunne ikke eksportere arkivoppføringer.",
    "preview-too-large": "Forhåndsvisning er begrenset til 1 MB. Last ned for å se alt innhold.",
    "no-preview": "Forhåndsvisning er ikke tilgjengelig for denne filtypen.",
    "parse-failed": "Kunne ikke tolke arkivet.",
    "error-title": "Feil"
  },
  "ja": {
    "unsupported-format": "未対応のファイル形式です。ZIP、TAR、GZ、TGZ をアップロードしてください。",
    "select-file-failed": "アーカイブを選択できませんでした。",
    "export-succeeded": "アーカイブをローカルフォルダーにエクスポートしました。",
    "export-failed": "アーカイブ内エントリのエクスポートに失敗しました。",
    "preview-too-large": "プレビューは 1 MB までです。全内容はダウンロードして確認してください。",
    "no-preview": "このファイル形式はプレビューできません。",
    "parse-failed": "アーカイブを解析できませんでした。",
    "error-title": "エラー"
  },
  "ko": {
    "unsupported-format": "지원되지 않는 파일 형식입니다. ZIP, TAR, GZ, TGZ를 업로드하세요.",
    "select-file-failed": "압축 파일을 선택할 수 없습니다.",
    "export-succeeded": "압축 파일을 로컬 폴더로 내보냈습니다.",
    "export-failed": "압축 항목 내보내기에 실패했습니다.",
    "preview-too-large": "미리보기는 1 MB로 제한됩니다. 전체 내용은 다운로드해서 확인하세요.",
    "no-preview": "이 파일 형식은 미리보기를 지원하지 않습니다.",
    "parse-failed": "압축 파일을 분석할 수 없습니다.",
    "error-title": "오류"
  },
  "ar": {
    "unsupported-format": "صيغة ملف غير مدعومة. يرجى رفع ZIP أو TAR أو GZ أو TGZ.",
    "select-file-failed": "تعذّر اختيار ملف الأرشيف.",
    "export-succeeded": "تم تصدير الأرشيف إلى مجلد محلي.",
    "export-failed": "فشل تصدير محتويات الأرشيف.",
    "preview-too-large": "المعاينة محدودة إلى 1 ميغابايت. نزّل الملف لرؤية المحتوى الكامل.",
    "no-preview": "المعاينة غير متاحة لهذا النوع من الملفات.",
    "parse-failed": "تعذّر تحليل الأرشيف.",
    "error-title": "خطأ"
  },
  "hi": {
    "unsupported-format": "असमर्थित फ़ाइल फ़ॉर्मेट। कृपया ZIP, TAR, GZ या TGZ अपलोड करें।",
    "select-file-failed": "आर्काइव फ़ाइल चुनना संभव नहीं हुआ।",
    "export-succeeded": "आर्काइव लोकल फ़ोल्डर में एक्सपोर्ट हो गया।",
    "export-failed": "आर्काइव एंट्रीज़ एक्सपोर्ट नहीं हो पाईं।",
    "preview-too-large": "प्रीव्यू 1 MB तक सीमित है। पूरा कंटेंट देखने के लिए डाउनलोड करें।",
    "no-preview": "इस फ़ाइल प्रकार के लिए प्रीव्यू उपलब्ध नहीं है।",
    "parse-failed": "आर्काइव पार्स नहीं किया जा सका।",
    "error-title": "त्रुटि"
  },
  "vi": {
    "unsupported-format": "Định dạng không hỗ trợ. Vui lòng tải lên ZIP, TAR, GZ hoặc TGZ.",
    "select-file-failed": "Không thể chọn tệp nén.",
    "export-succeeded": "Đã xuất tệp nén vào thư mục cục bộ.",
    "export-failed": "Xuất các mục trong tệp nén thất bại.",
    "preview-too-large": "Xem trước giới hạn 1 MB. Hãy tải xuống để xem đầy đủ nội dung.",
    "no-preview": "Không thể xem trước cho loại tệp này.",
    "parse-failed": "Không thể phân tích tệp nén.",
    "error-title": "Lỗi"
  },
  "th": {
    "unsupported-format": "ไม่รองรับรูปแบบไฟล์นี้ โปรดอัปโหลด ZIP, TAR, GZ หรือ TGZ",
    "select-file-failed": "ไม่สามารถเลือกไฟล์บีบอัดได้",
    "export-succeeded": "ส่งออกไฟล์บีบอัดไปยังโฟลเดอร์ในเครื่องแล้ว",
    "export-failed": "ส่งออกรายการในไฟล์บีบอัดไม่สำเร็จ",
    "preview-too-large": "พรีวิวจำกัดที่ 1 MB โปรดดาวน์โหลดเพื่อดูเนื้อหาทั้งหมด",
    "no-preview": "ไม่รองรับพรีวิวสำหรับไฟล์ประเภทนี้",
    "parse-failed": "ไม่สามารถวิเคราะห์ไฟล์บีบอัดได้",
    "error-title": "ข้อผิดพลาด"
  },
  "id": {
    "unsupported-format": "Format file tidak didukung. Unggah ZIP, TAR, GZ, atau TGZ.",
    "select-file-failed": "Tidak dapat memilih file arsip.",
    "export-succeeded": "Arsip berhasil diekspor ke folder lokal.",
    "export-failed": "Gagal mengekspor entri arsip.",
    "preview-too-large": "Pratinjau dibatasi 1 MB. Unduh untuk melihat isi lengkap.",
    "no-preview": "Pratinjau tidak tersedia untuk jenis file ini.",
    "parse-failed": "Tidak dapat memproses arsip.",
    "error-title": "Galat"
  },
  "he": {
    "unsupported-format": "פורמט קובץ לא נתמך. יש להעלות ZIP, TAR, GZ או TGZ.",
    "select-file-failed": "לא ניתן לבחור קובץ ארכיון.",
    "export-succeeded": "הארכיון יוצא לתיקייה מקומית.",
    "export-failed": "ייצוא פריטי הארכיון נכשל.",
    "preview-too-large": "התצוגה המקדימה מוגבלת ל־1 MB. הורד כדי לראות את כל התוכן.",
    "no-preview": "אין תצוגה מקדימה לסוג קובץ זה.",
    "parse-failed": "לא ניתן לפענח את הארכיון.",
    "error-title": "שגיאה"
  },
  "ms": {
    "unsupported-format": "Format fail tidak disokong. Sila muat naik ZIP, TAR, GZ, atau TGZ.",
    "select-file-failed": "Tidak dapat memilih fail arkib.",
    "export-succeeded": "Arkib dieksport ke folder setempat.",
    "export-failed": "Gagal mengeksport entri arkib.",
    "preview-too-large": "Pratonton terhad kepada 1 MB. Muat turun untuk lihat kandungan penuh.",
    "no-preview": "Pratonton tidak tersedia untuk jenis fail ini.",
    "parse-failed": "Tidak dapat menghuraikan arkib.",
    "error-title": "Ralat"
  }
}
</i18n>
