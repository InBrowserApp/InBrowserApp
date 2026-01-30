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
    "uploadTitle": "Upload images",
    "dragDropOrClick": "Click or drag to upload images",
    "supportedFormats": "Supports PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Selected {count} images",
    "removeFile": "Remove",
    "clearAll": "Clear all",
    "invalidFileType": "Please select a valid image file",
    "duplicateFile": "This file is already added"
  },
  "zh": {
    "uploadTitle": "上传图片",
    "dragDropOrClick": "点击或拖拽上传图片",
    "supportedFormats": "支持 PNG、JPG、WebP、GIF、SVG",
    "selectedCount": "已选择 {count} 张图片",
    "removeFile": "移除",
    "clearAll": "清空全部",
    "invalidFileType": "请选择有效的图片文件",
    "duplicateFile": "该文件已添加"
  },
  "zh-CN": {
    "uploadTitle": "上传图片",
    "dragDropOrClick": "点击或拖拽上传图片",
    "supportedFormats": "支持 PNG、JPG、WebP、GIF、SVG",
    "selectedCount": "已选择 {count} 张图片",
    "removeFile": "移除",
    "clearAll": "清空全部",
    "invalidFileType": "请选择有效的图片文件",
    "duplicateFile": "该文件已添加"
  },
  "zh-TW": {
    "uploadTitle": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳上傳圖片",
    "supportedFormats": "支援 PNG、JPG、WebP、GIF、SVG",
    "selectedCount": "已選擇 {count} 張圖片",
    "removeFile": "移除",
    "clearAll": "清空全部",
    "invalidFileType": "請選擇有效的圖片檔案",
    "duplicateFile": "此檔案已加入"
  },
  "zh-HK": {
    "uploadTitle": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳上傳圖片",
    "supportedFormats": "支援 PNG、JPG、WebP、GIF、SVG",
    "selectedCount": "已選擇 {count} 張圖片",
    "removeFile": "移除",
    "clearAll": "清空全部",
    "invalidFileType": "請選擇有效的圖片檔案",
    "duplicateFile": "此檔案已加入"
  },
  "es": {
    "uploadTitle": "Subir imágenes",
    "dragDropOrClick": "Haz clic o arrastra para subir imágenes",
    "supportedFormats": "Admite PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Seleccionadas {count} imágenes",
    "removeFile": "Eliminar",
    "clearAll": "Borrar todo",
    "invalidFileType": "Por favor selecciona un archivo de imagen válido",
    "duplicateFile": "Este archivo ya está añadido"
  },
  "fr": {
    "uploadTitle": "Téléverser des images",
    "dragDropOrClick": "Cliquez ou glissez pour téléverser des images",
    "supportedFormats": "Prend en charge PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} images sélectionnées",
    "removeFile": "Supprimer",
    "clearAll": "Tout effacer",
    "invalidFileType": "Veuillez sélectionner un fichier image valide",
    "duplicateFile": "Ce fichier est déjà ajouté"
  },
  "de": {
    "uploadTitle": "Bilder hochladen",
    "dragDropOrClick": "Klicken oder ziehen Sie, um Bilder hochzuladen",
    "supportedFormats": "Unterstützt PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} Bilder ausgewählt",
    "removeFile": "Entfernen",
    "clearAll": "Alles löschen",
    "invalidFileType": "Bitte wählen Sie eine gültige Bilddatei",
    "duplicateFile": "Diese Datei ist bereits hinzugefügt"
  },
  "it": {
    "uploadTitle": "Carica immagini",
    "dragDropOrClick": "Clicca o trascina per caricare immagini",
    "supportedFormats": "Supporta PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} immagini selezionate",
    "removeFile": "Rimuovi",
    "clearAll": "Cancella tutto",
    "invalidFileType": "Seleziona un file immagine valido",
    "duplicateFile": "Questo file è già stato aggiunto"
  },
  "ja": {
    "uploadTitle": "画像をアップロード",
    "dragDropOrClick": "クリックまたはドラッグして画像をアップロード",
    "supportedFormats": "PNG、JPG、WebP、GIF、SVG に対応",
    "selectedCount": "{count} 枚の画像を選択",
    "removeFile": "削除",
    "clearAll": "すべてクリア",
    "invalidFileType": "有効な画像ファイルを選択してください",
    "duplicateFile": "このファイルは既に追加されています"
  },
  "ko": {
    "uploadTitle": "이미지 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 이미지 업로드",
    "supportedFormats": "PNG, JPG, WebP, GIF, SVG 지원",
    "selectedCount": "{count}개 이미지 선택됨",
    "removeFile": "제거",
    "clearAll": "모두 지우기",
    "invalidFileType": "유효한 이미지 파일을 선택하세요",
    "duplicateFile": "이 파일은 이미 추가되었습니다"
  },
  "ru": {
    "uploadTitle": "Загрузить изображения",
    "dragDropOrClick": "Нажмите или перетащите для загрузки изображений",
    "supportedFormats": "Поддерживает PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Выбрано изображений: {count}",
    "removeFile": "Удалить",
    "clearAll": "Очистить всё",
    "invalidFileType": "Пожалуйста, выберите допустимый файл изображения",
    "duplicateFile": "Этот файл уже добавлен"
  },
  "pt": {
    "uploadTitle": "Enviar imagens",
    "dragDropOrClick": "Clique ou arraste para enviar imagens",
    "supportedFormats": "Suporta PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} imagens selecionadas",
    "removeFile": "Remover",
    "clearAll": "Limpar tudo",
    "invalidFileType": "Selecione um arquivo de imagem válido",
    "duplicateFile": "Este arquivo já foi adicionado"
  },
  "ar": {
    "uploadTitle": "رفع الصور",
    "dragDropOrClick": "انقر أو اسحب لرفع الصور",
    "supportedFormats": "يدعم PNG وJPG وWebP وGIF وSVG",
    "selectedCount": "تم اختيار {count} صورة",
    "removeFile": "إزالة",
    "clearAll": "مسح الكل",
    "invalidFileType": "يرجى اختيار ملف صورة صالح",
    "duplicateFile": "هذا الملف تمت إضافته بالفعل"
  },
  "hi": {
    "uploadTitle": "इमेज अपलोड करें",
    "dragDropOrClick": "इमेज अपलोड करने के लिए क्लिक करें या ड्रैग करें",
    "supportedFormats": "PNG, JPG, WebP, GIF, SVG समर्थित",
    "selectedCount": "{count} इमेज चुनी गई",
    "removeFile": "हटाएँ",
    "clearAll": "सब साफ़ करें",
    "invalidFileType": "कृपया एक मान्य इमेज फ़ाइल चुनें",
    "duplicateFile": "यह फ़ाइल पहले से जोड़ी गई है"
  },
  "tr": {
    "uploadTitle": "Görselleri yükle",
    "dragDropOrClick": "Görselleri yüklemek için tıklayın veya sürükleyin",
    "supportedFormats": "PNG, JPG, WebP, GIF, SVG desteklenir",
    "selectedCount": "{count} görsel seçildi",
    "removeFile": "Kaldır",
    "clearAll": "Tümünü temizle",
    "invalidFileType": "Lütfen geçerli bir görsel dosyası seçin",
    "duplicateFile": "Bu dosya zaten eklendi"
  },
  "nl": {
    "uploadTitle": "Afbeeldingen uploaden",
    "dragDropOrClick": "Klik of sleep om afbeeldingen te uploaden",
    "supportedFormats": "Ondersteunt PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} afbeeldingen geselecteerd",
    "removeFile": "Verwijderen",
    "clearAll": "Alles wissen",
    "invalidFileType": "Selecteer een geldig afbeeldingsbestand",
    "duplicateFile": "Dit bestand is al toegevoegd"
  },
  "sv": {
    "uploadTitle": "Ladda upp bilder",
    "dragDropOrClick": "Klicka eller dra för att ladda upp bilder",
    "supportedFormats": "Stöder PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} bilder valda",
    "removeFile": "Ta bort",
    "clearAll": "Rensa alla",
    "invalidFileType": "Välj en giltig bildfil",
    "duplicateFile": "Den här filen är redan tillagd"
  },
  "pl": {
    "uploadTitle": "Prześlij obrazy",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać obrazy",
    "supportedFormats": "Obsługuje PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Wybrano {count} obrazów",
    "removeFile": "Usuń",
    "clearAll": "Wyczyść wszystko",
    "invalidFileType": "Wybierz prawidłowy plik obrazu",
    "duplicateFile": "Ten plik został już dodany"
  },
  "vi": {
    "uploadTitle": "Tải ảnh lên",
    "dragDropOrClick": "Nhấp hoặc kéo để tải ảnh lên",
    "supportedFormats": "Hỗ trợ PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Đã chọn {count} ảnh",
    "removeFile": "Xóa",
    "clearAll": "Xóa tất cả",
    "invalidFileType": "Vui lòng chọn tệp ảnh hợp lệ",
    "duplicateFile": "Tệp này đã được thêm"
  },
  "th": {
    "uploadTitle": "อัปโหลดรูปภาพ",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลดรูปภาพ",
    "supportedFormats": "รองรับ PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "เลือกแล้ว {count} รูป",
    "removeFile": "ลบ",
    "clearAll": "ล้างทั้งหมด",
    "invalidFileType": "โปรดเลือกไฟล์รูปภาพที่ถูกต้อง",
    "duplicateFile": "ไฟล์นี้ถูกเพิ่มแล้ว"
  },
  "id": {
    "uploadTitle": "Unggah gambar",
    "dragDropOrClick": "Klik atau seret untuk mengunggah gambar",
    "supportedFormats": "Mendukung PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} gambar dipilih",
    "removeFile": "Hapus",
    "clearAll": "Bersihkan semua",
    "invalidFileType": "Silakan pilih file gambar yang valid",
    "duplicateFile": "File ini sudah ditambahkan"
  },
  "he": {
    "uploadTitle": "העלאת תמונות",
    "dragDropOrClick": "לחץ או גרור כדי להעלות תמונות",
    "supportedFormats": "תומך ב-PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "נבחרו {count} תמונות",
    "removeFile": "הסר",
    "clearAll": "נקה הכל",
    "invalidFileType": "אנא בחר קובץ תמונה תקין",
    "duplicateFile": "הקובץ הזה כבר נוסף"
  },
  "ms": {
    "uploadTitle": "Muat naik imej",
    "dragDropOrClick": "Klik atau seret untuk memuat naik imej",
    "supportedFormats": "Menyokong PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} imej dipilih",
    "removeFile": "Buang",
    "clearAll": "Kosongkan semua",
    "invalidFileType": "Sila pilih fail imej yang sah",
    "duplicateFile": "Fail ini sudah ditambah"
  },
  "no": {
    "uploadTitle": "Last opp bilder",
    "dragDropOrClick": "Klikk eller dra for å laste opp bilder",
    "supportedFormats": "Støtter PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} bilder valgt",
    "removeFile": "Fjern",
    "clearAll": "Tøm alt",
    "invalidFileType": "Velg en gyldig bildefil",
    "duplicateFile": "Denne filen er allerede lagt til"
  }
}
</i18n>
