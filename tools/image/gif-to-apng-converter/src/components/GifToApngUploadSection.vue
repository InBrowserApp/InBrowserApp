<template>
  <ImageUpload
    v-model:files="files"
    :title="t('uploadTitle')"
    :drag-drop-text="t('dragDropOrClick')"
    :support-text="t('supportedFormats')"
    :selected-count-label="t('selectedCount', { count: files.length })"
    :remove-label="t('removeFile')"
    :clear-all-label="t('clearAll')"
    :invalid-type-message="t('invalidFileType')"
    :duplicate-message="t('duplicateFile')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ImageUpload from './ImageUpload.vue'

const { t } = useI18n({ useScope: 'local' })
const files = defineModel<File[]>('files', { required: true })
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload GIFs",
    "dragDropOrClick": "Click or drag to upload GIFs",
    "supportedFormats": "Supports GIF files",
    "selectedCount": "Selected {count} GIFs",
    "removeFile": "Remove",
    "clearAll": "Clear all",
    "invalidFileType": "Please select a valid GIF file",
    "duplicateFile": "This file is already added"
  },
  "zh": {
    "uploadTitle": "上传 GIF",
    "dragDropOrClick": "点击或拖拽上传 GIF",
    "supportedFormats": "支持 GIF 文件",
    "selectedCount": "已选择 {count} 个 GIF",
    "removeFile": "移除",
    "clearAll": "清空",
    "invalidFileType": "请选择有效的 GIF 文件",
    "duplicateFile": "该文件已添加"
  },
  "zh-CN": {
    "uploadTitle": "上传 GIF",
    "dragDropOrClick": "点击或拖拽上传 GIF",
    "supportedFormats": "支持 GIF 文件",
    "selectedCount": "已选择 {count} 个 GIF",
    "removeFile": "移除",
    "clearAll": "清空",
    "invalidFileType": "请选择有效的 GIF 文件",
    "duplicateFile": "该文件已添加"
  },
  "zh-TW": {
    "uploadTitle": "上傳 GIF",
    "dragDropOrClick": "點擊或拖曳上傳 GIF",
    "supportedFormats": "支援 GIF 檔案",
    "selectedCount": "已選擇 {count} 個 GIF",
    "removeFile": "移除",
    "clearAll": "清空",
    "invalidFileType": "請選擇有效的 GIF 檔案",
    "duplicateFile": "此檔案已新增"
  },
  "zh-HK": {
    "uploadTitle": "上傳 GIF",
    "dragDropOrClick": "點擊或拖曳上傳 GIF",
    "supportedFormats": "支援 GIF 檔案",
    "selectedCount": "已選擇 {count} 個 GIF",
    "removeFile": "移除",
    "clearAll": "清空",
    "invalidFileType": "請選擇有效的 GIF 檔案",
    "duplicateFile": "此檔案已新增"
  },
  "es": {
    "uploadTitle": "Subir GIF",
    "dragDropOrClick": "Haz clic o arrastra para subir GIF",
    "supportedFormats": "Admite archivos GIF",
    "selectedCount": "Seleccionados {count} GIF",
    "removeFile": "Eliminar",
    "clearAll": "Limpiar todo",
    "invalidFileType": "Selecciona un GIF válido",
    "duplicateFile": "Este archivo ya está añadido"
  },
  "fr": {
    "uploadTitle": "Télécharger des GIF",
    "dragDropOrClick": "Cliquez ou faites glisser pour téléverser des GIF",
    "supportedFormats": "Prend en charge les fichiers GIF",
    "selectedCount": "{count} GIF sélectionnés",
    "removeFile": "Supprimer",
    "clearAll": "Tout effacer",
    "invalidFileType": "Veuillez sélectionner un GIF valide",
    "duplicateFile": "Ce fichier est déjà ajouté"
  },
  "de": {
    "uploadTitle": "GIF hochladen",
    "dragDropOrClick": "Klicken oder ziehen, um GIFs hochzuladen",
    "supportedFormats": "Unterstützt GIF-Dateien",
    "selectedCount": "{count} GIF ausgewählt",
    "removeFile": "Entfernen",
    "clearAll": "Alles löschen",
    "invalidFileType": "Bitte eine gültige GIF-Datei auswählen",
    "duplicateFile": "Diese Datei ist bereits hinzugefügt"
  },
  "it": {
    "uploadTitle": "Carica GIF",
    "dragDropOrClick": "Fai clic o trascina per caricare GIF",
    "supportedFormats": "Supporta file GIF",
    "selectedCount": "Selezionati {count} GIF",
    "removeFile": "Rimuovi",
    "clearAll": "Cancella tutto",
    "invalidFileType": "Seleziona un GIF valido",
    "duplicateFile": "Questo file è già stato aggiunto"
  },
  "ja": {
    "uploadTitle": "GIFをアップロード",
    "dragDropOrClick": "クリックまたはドラッグでGIFをアップロード",
    "supportedFormats": "GIFファイルに対応",
    "selectedCount": "{count} 個のGIFを選択",
    "removeFile": "削除",
    "clearAll": "すべてクリア",
    "invalidFileType": "有効なGIFファイルを選択してください",
    "duplicateFile": "このファイルは既に追加されています"
  },
  "ko": {
    "uploadTitle": "GIF 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 GIF 업로드",
    "supportedFormats": "GIF 파일 지원",
    "selectedCount": "{count}개의 GIF 선택됨",
    "removeFile": "제거",
    "clearAll": "모두 지우기",
    "invalidFileType": "유효한 GIF 파일을 선택하세요",
    "duplicateFile": "이미 추가된 파일입니다"
  },
  "ru": {
    "uploadTitle": "Загрузить GIF",
    "dragDropOrClick": "Нажмите или перетащите, чтобы загрузить GIF",
    "supportedFormats": "Поддерживаются файлы GIF",
    "selectedCount": "Выбрано {count} GIF",
    "removeFile": "Удалить",
    "clearAll": "Очистить все",
    "invalidFileType": "Выберите корректный GIF файл",
    "duplicateFile": "Этот файл уже добавлен"
  },
  "pt": {
    "uploadTitle": "Enviar GIF",
    "dragDropOrClick": "Clique ou arraste para enviar GIFs",
    "supportedFormats": "Suporta arquivos GIF",
    "selectedCount": "{count} GIF selecionados",
    "removeFile": "Remover",
    "clearAll": "Limpar tudo",
    "invalidFileType": "Selecione um GIF válido",
    "duplicateFile": "Este arquivo já foi adicionado"
  },
  "ar": {
    "uploadTitle": "رفع ملفات GIF",
    "dragDropOrClick": "انقر أو اسحب لرفع ملفات GIF",
    "supportedFormats": "يدعم ملفات GIF",
    "selectedCount": "تم اختيار {count} ملف GIF",
    "removeFile": "إزالة",
    "clearAll": "مسح الكل",
    "invalidFileType": "يرجى اختيار ملف GIF صالح",
    "duplicateFile": "تمت إضافة هذا الملف بالفعل"
  },
  "hi": {
    "uploadTitle": "GIF अपलोड करें",
    "dragDropOrClick": "GIF अपलोड करने के लिए क्लिक या ड्रैग करें",
    "supportedFormats": "GIF फाइलें समर्थित",
    "selectedCount": "{count} GIF चुने गए",
    "removeFile": "हटाएं",
    "clearAll": "सब हटाएं",
    "invalidFileType": "कृपया एक मान्य GIF चुनें",
    "duplicateFile": "यह फ़ाइल पहले से जोड़ी गई है"
  },
  "tr": {
    "uploadTitle": "GIF yükle",
    "dragDropOrClick": "GIF yüklemek için tıkla veya sürükle",
    "supportedFormats": "GIF dosyalarını destekler",
    "selectedCount": "{count} GIF seçildi",
    "removeFile": "Kaldır",
    "clearAll": "Hepsini temizle",
    "invalidFileType": "Lütfen geçerli bir GIF seçin",
    "duplicateFile": "Bu dosya zaten eklendi"
  },
  "nl": {
    "uploadTitle": "GIF uploaden",
    "dragDropOrClick": "Klik of sleep om GIFs te uploaden",
    "supportedFormats": "Ondersteunt GIF-bestanden",
    "selectedCount": "{count} GIF geselecteerd",
    "removeFile": "Verwijderen",
    "clearAll": "Alles wissen",
    "invalidFileType": "Selecteer een geldig GIF-bestand",
    "duplicateFile": "Dit bestand is al toegevoegd"
  },
  "sv": {
    "uploadTitle": "Ladda upp GIF",
    "dragDropOrClick": "Klicka eller dra för att ladda upp GIF",
    "supportedFormats": "Stöder GIF-filer",
    "selectedCount": "{count} GIF valda",
    "removeFile": "Ta bort",
    "clearAll": "Rensa allt",
    "invalidFileType": "Välj en giltig GIF",
    "duplicateFile": "Den här filen är redan tillagd"
  },
  "pl": {
    "uploadTitle": "Prześlij GIF",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać GIF",
    "supportedFormats": "Obsługuje pliki GIF",
    "selectedCount": "Wybrano {count} GIF",
    "removeFile": "Usuń",
    "clearAll": "Wyczyść wszystko",
    "invalidFileType": "Wybierz prawidłowy GIF",
    "duplicateFile": "Ten plik jest już dodany"
  },
  "vi": {
    "uploadTitle": "Tải GIF",
    "dragDropOrClick": "Nhấp hoặc kéo để tải GIF",
    "supportedFormats": "Hỗ trợ tệp GIF",
    "selectedCount": "Đã chọn {count} GIF",
    "removeFile": "Xóa",
    "clearAll": "Xóa tất cả",
    "invalidFileType": "Vui lòng chọn GIF hợp lệ",
    "duplicateFile": "Tệp này đã được thêm"
  },
  "th": {
    "uploadTitle": "อัปโหลด GIF",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลด GIF",
    "supportedFormats": "รองรับไฟล์ GIF",
    "selectedCount": "เลือก {count} GIF",
    "removeFile": "ลบ",
    "clearAll": "ล้างทั้งหมด",
    "invalidFileType": "โปรดเลือกไฟล์ GIF ที่ถูกต้อง",
    "duplicateFile": "ไฟล์นี้ถูกเพิ่มแล้ว"
  },
  "id": {
    "uploadTitle": "Unggah GIF",
    "dragDropOrClick": "Klik atau seret untuk mengunggah GIF",
    "supportedFormats": "Mendukung file GIF",
    "selectedCount": "{count} GIF dipilih",
    "removeFile": "Hapus",
    "clearAll": "Hapus semua",
    "invalidFileType": "Silakan pilih GIF yang valid",
    "duplicateFile": "File ini sudah ditambahkan"
  },
  "he": {
    "uploadTitle": "העלאת GIF",
    "dragDropOrClick": "לחץ או גרור כדי להעלות GIF",
    "supportedFormats": "תומך בקבצי GIF",
    "selectedCount": "נבחרו {count} קובצי GIF",
    "removeFile": "הסר",
    "clearAll": "נקה הכל",
    "invalidFileType": "אנא בחר קובץ GIF תקין",
    "duplicateFile": "הקובץ כבר נוסף"
  },
  "ms": {
    "uploadTitle": "Muat naik GIF",
    "dragDropOrClick": "Klik atau seret untuk memuat naik GIF",
    "supportedFormats": "Menyokong fail GIF",
    "selectedCount": "{count} GIF dipilih",
    "removeFile": "Buang",
    "clearAll": "Kosongkan semua",
    "invalidFileType": "Sila pilih fail GIF yang sah",
    "duplicateFile": "Fail ini sudah ditambah"
  },
  "no": {
    "uploadTitle": "Last opp GIF",
    "dragDropOrClick": "Klikk eller dra for å laste opp GIF",
    "supportedFormats": "Støtter GIF-filer",
    "selectedCount": "{count} GIF valgt",
    "removeFile": "Fjern",
    "clearAll": "Tøm alle",
    "invalidFileType": "Velg en gyldig GIF",
    "duplicateFile": "Denne filen er allerede lagt til"
  }
}
</i18n>
