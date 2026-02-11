<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>

    <template v-if="!file">
      <n-upload accept="image/*" @before-upload="handleBeforeUpload">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <Image24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ t('dropHint') }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ t('supportedFormatsHint') }}
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </template>

    <template v-else>
      <n-flex vertical :size="16">
        <n-flex align="center" :size="16">
          <n-image :src="previewUrl || ''" :alt="t('previewAlt')" width="160" />
          <n-flex vertical :size="4">
            <n-text strong>{{ file.name }}</n-text>
            <n-text depth="3">{{ filesize(file.size) }}</n-text>
            <n-text depth="3">{{ dimensionsText }}</n-text>
            <n-button size="small" @click="clearFile">
              <template #icon>
                <n-icon><Delete20Regular /></n-icon>
              </template>
              {{ t('removeFile') }}
            </n-button>
          </n-flex>
        </n-flex>
      </n-flex>
    </template>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NButton,
  NFlex,
  NIcon,
  NImage,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useMessage,
} from 'naive-ui'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { filesize } from 'filesize'
import Image24Regular from '@vicons/fluent/Image24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import type { UploadFileInfo } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageDimensions } from '../types'

interface Props {
  dimensions: ImageDimensions | null
}

const props = defineProps<Props>()
const file = defineModel<File | null>('file', { required: true })

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()
const previewUrl = useObjectUrl(file)

const dimensionsText = computed(() => {
  const width = Math.max(1, props.dimensions?.width ?? 1)
  const height = Math.max(1, props.dimensions?.height ?? 1)
  return t('dimensions') + ': ' + width + ' × ' + height
})

async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const selectedFile = data.file.file
  if (!selectedFile) return false

  if (data.fileList.length > 1) {
    message.error(t('onlyOneFile'))
    return false
  }

  if (!selectedFile.type.startsWith('image/')) {
    message.error(t('invalidFileType'))
    return false
  }

  file.value = selectedFile

  return false
}

function clearFile() {
  file.value = null
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "zh": {
    "uploadTitle": "上传图片",
    "dropHint": "点击或拖拽图片到这里上传",
    "supportedFormatsHint": "支持 PNG、JPEG、WebP 及大多数浏览器支持的图片格式",
    "removeFile": "移除图片",
    "onlyOneFile": "一次只能上传一张图片",
    "invalidFileType": "请选择有效的图片文件",
    "previewAlt": "已上传图片预览",
    "dimensions": "尺寸"
  },
  "zh-CN": {
    "uploadTitle": "上传图片",
    "dropHint": "点击或拖拽图片到这里上传",
    "supportedFormatsHint": "支持 PNG、JPEG、WebP 及大多数浏览器支持的图片格式",
    "removeFile": "移除图片",
    "onlyOneFile": "一次只能上传一张图片",
    "invalidFileType": "请选择有效的图片文件",
    "previewAlt": "已上传图片预览",
    "dimensions": "尺寸"
  },
  "zh-TW": {
    "uploadTitle": "上傳圖片",
    "dropHint": "點擊或拖曳圖片到這裡上傳",
    "supportedFormatsHint": "支援 PNG、JPEG、WebP 與大多數瀏覽器支援的圖片格式",
    "removeFile": "移除圖片",
    "onlyOneFile": "一次只能上傳一張圖片",
    "invalidFileType": "請選擇有效的圖片檔案",
    "previewAlt": "已上傳圖片預覽",
    "dimensions": "尺寸"
  },
  "zh-HK": {
    "uploadTitle": "上傳圖片",
    "dropHint": "點擊或拖曳圖片到這裡上傳",
    "supportedFormatsHint": "支援 PNG、JPEG、WebP 與大多數瀏覽器支援的圖片格式",
    "removeFile": "移除圖片",
    "onlyOneFile": "一次只能上傳一張圖片",
    "invalidFileType": "請選擇有效的圖片檔案",
    "previewAlt": "已上傳圖片預覽",
    "dimensions": "尺寸"
  },
  "es": {
    "uploadTitle": "Cargar imagen",
    "dropHint": "Haz clic o arrastra una imagen para subirla",
    "supportedFormatsHint": "Compatible con PNG, JPEG, WebP y la mayoría de formatos de imagen del navegador",
    "removeFile": "Quitar imagen",
    "onlyOneFile": "Solo se puede subir una imagen",
    "invalidFileType": "Selecciona un archivo de imagen válido",
    "previewAlt": "Vista previa de la imagen seleccionada",
    "dimensions": "Dimensiones"
  },
  "fr": {
    "uploadTitle": "Téléverser une image",
    "dropHint": "Cliquez ou glissez-déposez une image pour la téléverser",
    "supportedFormatsHint": "Prend en charge PNG, JPEG, WebP et la plupart des formats d’image du navigateur",
    "removeFile": "Supprimer l’image",
    "onlyOneFile": "Une seule image peut être téléversée",
    "invalidFileType": "Veuillez sélectionner un fichier image valide",
    "previewAlt": "Aperçu de l’image sélectionnée",
    "dimensions": "Dimensions"
  },
  "de": {
    "uploadTitle": "Bild hochladen",
    "dropHint": "Klicken oder Bild hierher ziehen zum Hochladen",
    "supportedFormatsHint": "Unterstützt PNG, JPEG, WebP und die meisten vom Browser unterstützten Bildformate",
    "removeFile": "Bild entfernen",
    "onlyOneFile": "Es kann nur ein Bild hochgeladen werden",
    "invalidFileType": "Bitte wähle eine gültige Bilddatei aus",
    "previewAlt": "Vorschau des ausgewählten Bildes",
    "dimensions": "Abmessungen"
  },
  "it": {
    "uploadTitle": "Carica immagine",
    "dropHint": "Fai clic o trascina un’immagine per caricarla",
    "supportedFormatsHint": "Supporta PNG, JPEG, WebP e la maggior parte dei formati immagine supportati dal browser",
    "removeFile": "Rimuovi immagine",
    "onlyOneFile": "È possibile caricare una sola immagine",
    "invalidFileType": "Seleziona un file immagine valido",
    "previewAlt": "Anteprima dell’immagine selezionata",
    "dimensions": "Dimensioni"
  },
  "ja": {
    "uploadTitle": "画像をアップロード",
    "dropHint": "クリックまたはドラッグして画像をアップロード",
    "supportedFormatsHint": "PNG、JPEG、WebP と主要なブラウザー対応画像形式をサポート",
    "removeFile": "画像を削除",
    "onlyOneFile": "アップロードできる画像は1枚のみです",
    "invalidFileType": "有効な画像ファイルを選択してください",
    "previewAlt": "選択した画像のプレビュー",
    "dimensions": "サイズ"
  },
  "ko": {
    "uploadTitle": "이미지 업로드",
    "dropHint": "클릭하거나 이미지를 드래그해 업로드하세요",
    "supportedFormatsHint": "PNG, JPEG, WebP 및 대부분의 브라우저 지원 이미지 형식을 지원합니다",
    "removeFile": "이미지 제거",
    "onlyOneFile": "이미지는 한 개만 업로드할 수 있습니다",
    "invalidFileType": "유효한 이미지 파일을 선택해 주세요",
    "previewAlt": "선택한 이미지 미리보기",
    "dimensions": "크기"
  },
  "ru": {
    "uploadTitle": "Загрузить изображение",
    "dropHint": "Нажмите или перетащите изображение для загрузки",
    "supportedFormatsHint": "Поддерживаются PNG, JPEG, WebP и большинство форматов изображений, поддерживаемых браузером",
    "removeFile": "Удалить изображение",
    "onlyOneFile": "Можно загрузить только одно изображение",
    "invalidFileType": "Выберите корректный файл изображения",
    "previewAlt": "Предпросмотр выбранного изображения",
    "dimensions": "Размеры"
  },
  "pt": {
    "uploadTitle": "Enviar imagem",
    "dropHint": "Clique ou arraste uma imagem para enviar",
    "supportedFormatsHint": "Compatível com PNG, JPEG, WebP e a maioria dos formatos de imagem suportados pelo navegador",
    "removeFile": "Remover imagem",
    "onlyOneFile": "Só é possível enviar uma imagem",
    "invalidFileType": "Selecione um arquivo de imagem válido",
    "previewAlt": "Pré-visualização da imagem selecionada",
    "dimensions": "Dimensões"
  },
  "ar": {
    "uploadTitle": "رفع صورة",
    "dropHint": "انقر أو اسحب صورة للرفع",
    "supportedFormatsHint": "يدعم PNG وJPEG وWebP ومعظم صيغ الصور التي يدعمها المتصفح",
    "removeFile": "إزالة الصورة",
    "onlyOneFile": "يمكن رفع صورة واحدة فقط",
    "invalidFileType": "يرجى اختيار ملف صورة صالح",
    "previewAlt": "معاينة الصورة المحددة",
    "dimensions": "الأبعاد"
  },
  "hi": {
    "uploadTitle": "इमेज अपलोड करें",
    "dropHint": "क्लिक करें या इमेज ड्रैग करके अपलोड करें",
    "supportedFormatsHint": "PNG, JPEG, WebP और ब्राउज़र द्वारा समर्थित अधिकांश इमेज फ़ॉर्मेट उपलब्ध हैं",
    "removeFile": "इमेज हटाएँ",
    "onlyOneFile": "एक समय में केवल एक इमेज अपलोड की जा सकती है",
    "invalidFileType": "कृपया मान्य इमेज फ़ाइल चुनें",
    "previewAlt": "चयनित इमेज का प्रीव्यू",
    "dimensions": "आयाम"
  },
  "tr": {
    "uploadTitle": "Görsel yükle",
    "dropHint": "Yüklemek için tıklayın veya görseli sürükleyin",
    "supportedFormatsHint": "PNG, JPEG, WebP ve tarayıcının desteklediği çoğu görsel biçimini destekler",
    "removeFile": "Görseli kaldır",
    "onlyOneFile": "Yalnızca bir görsel yüklenebilir",
    "invalidFileType": "Lütfen geçerli bir görsel dosyası seçin",
    "previewAlt": "Seçilen görsel önizlemesi",
    "dimensions": "Boyutlar"
  },
  "nl": {
    "uploadTitle": "Afbeelding uploaden",
    "dropHint": "Klik of sleep een afbeelding om te uploaden",
    "supportedFormatsHint": "Ondersteunt PNG, JPEG, WebP en de meeste door de browser ondersteunde afbeeldingsindelingen",
    "removeFile": "Afbeelding verwijderen",
    "onlyOneFile": "Er kan maar één afbeelding worden geüpload",
    "invalidFileType": "Selecteer een geldig afbeeldingsbestand",
    "previewAlt": "Voorbeeld van geselecteerde afbeelding",
    "dimensions": "Afmetingen"
  },
  "sv": {
    "uploadTitle": "Ladda upp bild",
    "dropHint": "Klicka eller dra en bild hit för att ladda upp",
    "supportedFormatsHint": "Stöder PNG, JPEG, WebP och de flesta bildformat som webbläsaren stöder",
    "removeFile": "Ta bort bild",
    "onlyOneFile": "Endast en bild kan laddas upp",
    "invalidFileType": "Välj en giltig bildfil",
    "previewAlt": "Förhandsvisning av vald bild",
    "dimensions": "Dimensioner"
  },
  "pl": {
    "uploadTitle": "Prześlij obraz",
    "dropHint": "Kliknij lub przeciągnij obraz, aby przesłać",
    "supportedFormatsHint": "Obsługuje PNG, JPEG, WebP i większość formatów obrazów obsługiwanych przez przeglądarkę",
    "removeFile": "Usuń obraz",
    "onlyOneFile": "Można przesłać tylko jeden obraz",
    "invalidFileType": "Wybierz prawidłowy plik obrazu",
    "previewAlt": "Podgląd wybranego obrazu",
    "dimensions": "Wymiary"
  },
  "vi": {
    "uploadTitle": "Tải ảnh lên",
    "dropHint": "Nhấp hoặc kéo thả ảnh để tải lên",
    "supportedFormatsHint": "Hỗ trợ PNG, JPEG, WebP và hầu hết định dạng ảnh được trình duyệt hỗ trợ",
    "removeFile": "Xóa ảnh",
    "onlyOneFile": "Chỉ có thể tải lên một ảnh",
    "invalidFileType": "Vui lòng chọn tệp ảnh hợp lệ",
    "previewAlt": "Xem trước ảnh đã chọn",
    "dimensions": "Kích thước"
  },
  "th": {
    "uploadTitle": "อัปโหลดรูปภาพ",
    "dropHint": "คลิกหรือลากรูปภาพเพื่ออัปโหลด",
    "supportedFormatsHint": "รองรับ PNG, JPEG, WebP และไฟล์รูปภาพส่วนใหญ่ที่เบราว์เซอร์รองรับ",
    "removeFile": "ลบรูปภาพ",
    "onlyOneFile": "อัปโหลดได้ครั้งละ 1 รูปเท่านั้น",
    "invalidFileType": "โปรดเลือกไฟล์รูปภาพที่ถูกต้อง",
    "previewAlt": "ตัวอย่างรูปภาพที่เลือก",
    "dimensions": "ขนาด"
  },
  "id": {
    "uploadTitle": "Unggah gambar",
    "dropHint": "Klik atau seret gambar untuk diunggah",
    "supportedFormatsHint": "Mendukung PNG, JPEG, WebP, dan sebagian besar format gambar yang didukung browser",
    "removeFile": "Hapus gambar",
    "onlyOneFile": "Hanya satu gambar yang dapat diunggah",
    "invalidFileType": "Pilih file gambar yang valid",
    "previewAlt": "Pratinjau gambar terpilih",
    "dimensions": "Dimensi"
  },
  "he": {
    "uploadTitle": "העלאת תמונה",
    "dropHint": "לחצו או גררו תמונה כדי להעלות",
    "supportedFormatsHint": "תומך ב‑PNG, JPEG, WebP וברוב פורמטי התמונות הנתמכים בדפדפן",
    "removeFile": "הסר תמונה",
    "onlyOneFile": "ניתן להעלות תמונה אחת בלבד",
    "invalidFileType": "יש לבחור קובץ תמונה תקין",
    "previewAlt": "תצוגה מקדימה של התמונה שנבחרה",
    "dimensions": "מידות"
  },
  "ms": {
    "uploadTitle": "Muat naik imej",
    "dropHint": "Klik atau seret imej untuk dimuat naik",
    "supportedFormatsHint": "Menyokong PNG, JPEG, WebP dan kebanyakan format imej yang disokong pelayar",
    "removeFile": "Buang imej",
    "onlyOneFile": "Hanya satu imej boleh dimuat naik",
    "invalidFileType": "Sila pilih fail imej yang sah",
    "previewAlt": "Pratonton imej yang dipilih",
    "dimensions": "Dimensi"
  },
  "no": {
    "uploadTitle": "Last opp bilde",
    "dropHint": "Klikk eller dra et bilde for å laste opp",
    "supportedFormatsHint": "Støtter PNG, JPEG, WebP og de fleste bildeformater som nettleseren støtter",
    "removeFile": "Fjern bilde",
    "onlyOneFile": "Bare ett bilde kan lastes opp",
    "invalidFileType": "Velg en gyldig bildefil",
    "previewAlt": "Forhåndsvisning av valgt bilde",
    "dimensions": "Dimensjoner"
  }
}
</i18n>
