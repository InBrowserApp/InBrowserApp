<template>
  <NFlex vertical :size="16">
    <NUpload
      v-if="!imagePreview"
      :show-file-list="false"
      accept="image/*"
      :max="1"
      @before-upload="handleBeforeUpload"
    >
      <NUploadDragger>
        <NFlex vertical align="center" :size="12">
          <NIcon :size="48" :depth="3">
            <ImageAdd24Regular />
          </NIcon>
          <NText>{{ t('dragDropOrClick') }}</NText>
          <NText depth="3" style="font-size: 12px">
            {{ t('supportedFormats') }}
          </NText>
        </NFlex>
      </NUploadDragger>
    </NUpload>

    <template v-else>
      <NFlex justify="center">
        <img :src="imagePreview" class="preview-image" />
      </NFlex>
      <NFlex justify="center">
        <NButton @click="clearFile">
          <template #icon>
            <NIcon><ArrowUpload24Regular /></NIcon>
          </template>
          {{ t('uploadAnother') }}
        </NButton>
      </NFlex>
    </template>
  </NFlex>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl } from '@vueuse/core'
import { NFlex, NUpload, NUploadDragger, NIcon, NText, NButton } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import ImageAdd24Regular from '@vicons/fluent/ImageAdd24Regular'
import ArrowUpload24Regular from '@vicons/fluent/ArrowUpload24Regular'
import { readQRFromFile } from '../qr-reader'

const emit = defineEmits<{
  decoded: [data: string]
  error: [message: string]
}>()

const { t } = useI18n()

const file = defineModel<File | null>('file', { default: null })
const imagePreview = useObjectUrl(computed(() => file.value))

async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const uploadedFile = data.file.file
  if (!uploadedFile) return false

  file.value = uploadedFile

  try {
    const result = await readQRFromFile(uploadedFile)
    if (result) {
      emit('decoded', result)
    } else {
      emit('error', t('noQRCodeFound'))
    }
  } catch {
    emit('error', t('failedToReadImage'))
  }

  return false
}

function clearFile() {
  file.value = null
}

watch(file, (newFile) => {
  if (!newFile) {
    emit('error', '')
  }
})
</script>

<style scoped>
.preview-image {
  max-width: 300px;
  max-height: 300px;
  object-fit: contain;
}
</style>

<i18n lang="json">
{
  "en": {
    "dragDropOrClick": "Click or drag image to upload",
    "supportedFormats": "Supports PNG, JPG, WebP, GIF, BMP, SVG and other image files",
    "uploadAnother": "Upload Another",
    "noQRCodeFound": "No QR code found in the image",
    "failedToReadImage": "Failed to read the image"
  },
  "zh": {
    "dragDropOrClick": "点击或拖拽图片上传",
    "supportedFormats": "支持 PNG、JPG、WebP、GIF、BMP、SVG 等图片文件",
    "uploadAnother": "上传另一个",
    "noQRCodeFound": "图片中未找到二维码",
    "failedToReadImage": "读取图片失败"
  },
  "zh-CN": {
    "dragDropOrClick": "点击或拖拽图片上传",
    "supportedFormats": "支持 PNG、JPG、WebP、GIF、BMP、SVG 等图片文件",
    "uploadAnother": "上传另一个",
    "noQRCodeFound": "图片中未找到二维码",
    "failedToReadImage": "读取图片失败"
  },
  "zh-TW": {
    "dragDropOrClick": "點擊或拖曳圖片上傳",
    "supportedFormats": "支援 PNG、JPG、WebP、GIF、BMP、SVG 等圖片檔案",
    "uploadAnother": "上传另一个",
    "noQRCodeFound": "圖片中未找到 QR Code",
    "failedToReadImage": "讀取圖片失敗"
  },
  "zh-HK": {
    "dragDropOrClick": "點擊或拖曳圖片上傳",
    "supportedFormats": "支援 PNG、JPG、WebP、GIF、BMP、SVG 等圖片檔案",
    "uploadAnother": "上传另一个",
    "noQRCodeFound": "圖片中未找到 QR Code",
    "failedToReadImage": "讀取圖片失敗"
  },
  "es": {
    "dragDropOrClick": "Haga clic o arrastre la imagen para cargar",
    "supportedFormats": "Soporta PNG, JPG, WebP, GIF, BMP, SVG y otros archivos de imagen",
    "uploadAnother": "Subir otro",
    "noQRCodeFound": "No se encontro codigo QR en la imagen",
    "failedToReadImage": "Error al leer la imagen"
  },
  "fr": {
    "dragDropOrClick": "Cliquez ou faites glisser l'image pour telecharger",
    "supportedFormats": "Prend en charge PNG, JPG, WebP, GIF, BMP, SVG et autres fichiers image",
    "uploadAnother": "Telecharger un autre",
    "noQRCodeFound": "Aucun code QR trouve dans l'image",
    "failedToReadImage": "Echec de la lecture de l'image"
  },
  "de": {
    "dragDropOrClick": "Klicken oder Bild ziehen zum Hochladen",
    "supportedFormats": "Unterstutzt PNG, JPG, WebP, GIF, BMP, SVG und andere Bilddateien",
    "uploadAnother": "Anderes hochladen",
    "noQRCodeFound": "Kein QR-Code im Bild gefunden",
    "failedToReadImage": "Bild konnte nicht gelesen werden"
  },
  "it": {
    "dragDropOrClick": "Clicca o trascina l'immagine per caricare",
    "supportedFormats": "Supporta PNG, JPG, WebP, GIF, BMP, SVG e altri file immagine",
    "uploadAnother": "Carica un altro",
    "noQRCodeFound": "Nessun codice QR trovato nell'immagine",
    "failedToReadImage": "Impossibile leggere l'immagine"
  },
  "ja": {
    "dragDropOrClick": "クリックまたは画像をドラッグしてアップロード",
    "supportedFormats": "PNG、JPG、WebP、GIF、BMP、SVG などの画像ファイルをサポート",
    "uploadAnother": "別の画像をアップロード",
    "noQRCodeFound": "画像にQRコードが見つかりません",
    "failedToReadImage": "画像の読み取りに失敗しました"
  },
  "ko": {
    "dragDropOrClick": "클릭하거나 이미지를 드래그하여 업로드",
    "supportedFormats": "PNG, JPG, WebP, GIF, BMP, SVG 등 이미지 파일 지원",
    "uploadAnother": "다른 이미지 업로드",
    "noQRCodeFound": "이미지에서 QR 코드를 찾을 수 없습니다",
    "failedToReadImage": "이미지를 읽을 수 없습니다"
  },
  "ru": {
    "dragDropOrClick": "Нажмите или перетащите изображение для загрузки",
    "supportedFormats": "Поддерживает PNG, JPG, WebP, GIF, BMP, SVG и другие изображения",
    "uploadAnother": "Загрузить другое",
    "noQRCodeFound": "QR-код не найден на изображении",
    "failedToReadImage": "Не удалось прочитать изображение"
  },
  "pt": {
    "dragDropOrClick": "Clique ou arraste a imagem para carregar",
    "supportedFormats": "Suporta PNG, JPG, WebP, GIF, BMP, SVG e outros arquivos de imagem",
    "uploadAnother": "Carregar outro",
    "noQRCodeFound": "Nenhum codigo QR encontrado na imagem",
    "failedToReadImage": "Falha ao ler a imagem"
  },
  "ar": {
    "dragDropOrClick": "انقر أو اسحب الصورة للتحميل",
    "supportedFormats": "يدعم PNG، JPG، WebP، GIF، BMP، SVG وملفات الصور الأخرى",
    "uploadAnother": "تحميل آخر",
    "noQRCodeFound": "لم يتم العثور على رمز QR في الصورة",
    "failedToReadImage": "فشل في قراءة الصورة"
  },
  "hi": {
    "dragDropOrClick": "अपलोड करने के लिए क्लिक करें या छवि खींचें",
    "supportedFormats": "PNG, JPG, WebP, GIF, BMP, SVG और अन्य छवि फ़ाइलें समर्थित",
    "uploadAnother": "एक और अपलोड करें",
    "noQRCodeFound": "छवि में कोई QR कोड नहीं मिला",
    "failedToReadImage": "छवि पढ़ने में विफल"
  },
  "tr": {
    "dragDropOrClick": "Yuklemek icin tiklayin veya gorsel suruklein",
    "supportedFormats": "PNG, JPG, WebP, GIF, BMP, SVG ve diger gorsel dosyalari desteklenir",
    "uploadAnother": "Baskasini yukle",
    "noQRCodeFound": "Gorselde QR kodu bulunamadi",
    "failedToReadImage": "Gorsel okunamadi"
  },
  "nl": {
    "dragDropOrClick": "Klik of sleep afbeelding om te uploaden",
    "supportedFormats": "Ondersteunt PNG, JPG, WebP, GIF, BMP, SVG en andere afbeeldingsbestanden",
    "uploadAnother": "Andere uploaden",
    "noQRCodeFound": "Geen QR-code gevonden in de afbeelding",
    "failedToReadImage": "Kan afbeelding niet lezen"
  },
  "sv": {
    "dragDropOrClick": "Klicka eller dra bild for att ladda upp",
    "supportedFormats": "Stoder PNG, JPG, WebP, GIF, BMP, SVG och andra bildfiler",
    "uploadAnother": "Ladda upp en annan",
    "noQRCodeFound": "Ingen QR-kod hittades i bilden",
    "failedToReadImage": "Kunde inte lasa bilden"
  },
  "pl": {
    "dragDropOrClick": "Kliknij lub przeciagnij obraz, aby przeslac",
    "supportedFormats": "Obsluguje PNG, JPG, WebP, GIF, BMP, SVG i inne pliki graficzne",
    "uploadAnother": "Przeslij inny",
    "noQRCodeFound": "Nie znaleziono kodu QR na obrazie",
    "failedToReadImage": "Nie udalo sie odczytac obrazu"
  },
  "vi": {
    "dragDropOrClick": "Nhan hoac keo anh de tai len",
    "supportedFormats": "Ho tro PNG, JPG, WebP, GIF, BMP, SVG va cac file anh khac",
    "uploadAnother": "Tai len anh khac",
    "noQRCodeFound": "Khong tim thay ma QR trong anh",
    "failedToReadImage": "Khong the doc anh"
  },
  "th": {
    "dragDropOrClick": "คลิกหรือลากรูปภาพเพื่ออัปโหลด",
    "supportedFormats": "รองรับ PNG, JPG, WebP, GIF, BMP, SVG และไฟล์รูปภาพอื่นๆ",
    "uploadAnother": "อัปโหลดรูปอื่น",
    "noQRCodeFound": "ไม่พบ QR Code ในรูปภาพ",
    "failedToReadImage": "ไม่สามารถอ่านรูปภาพได้"
  },
  "id": {
    "dragDropOrClick": "Klik atau seret gambar untuk mengunggah",
    "supportedFormats": "Mendukung PNG, JPG, WebP, GIF, BMP, SVG dan file gambar lainnya",
    "uploadAnother": "Unggah lainnya",
    "noQRCodeFound": "Tidak ada kode QR ditemukan di gambar",
    "failedToReadImage": "Gagal membaca gambar"
  },
  "he": {
    "dragDropOrClick": "לחץ או גרור תמונה להעלאה",
    "supportedFormats": "תומך ב-PNG, JPG, WebP, GIF, BMP, SVG וקבצי תמונה אחרים",
    "uploadAnother": "העלה אחר",
    "noQRCodeFound": "לא נמצא קוד QR בתמונה",
    "failedToReadImage": "נכשל בקריאת התמונה"
  },
  "ms": {
    "dragDropOrClick": "Klik atau seret imej untuk memuat naik",
    "supportedFormats": "Menyokong PNG, JPG, WebP, GIF, BMP, SVG dan fail imej lain",
    "uploadAnother": "Muat naik yang lain",
    "noQRCodeFound": "Tiada kod QR ditemui dalam imej",
    "failedToReadImage": "Gagal membaca imej"
  },
  "no": {
    "dragDropOrClick": "Klikk eller dra bilde for a laste opp",
    "supportedFormats": "Stotter PNG, JPG, WebP, GIF, BMP, SVG og andre bildefiler",
    "uploadAnother": "Last opp en annen",
    "noQRCodeFound": "Ingen QR-kode funnet i bildet",
    "failedToReadImage": "Kunne ikke lese bildet"
  }
}
</i18n>
