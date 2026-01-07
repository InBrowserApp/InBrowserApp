<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ImageUpload v-model:file="imageFile" />

    <template v-if="imageFile">
      <ImagePreview :file="imageFile" @clear="clearFile" />

      <ExifDataDisplay v-if="exifData && !error" :data="exifData" :is-loading="isLoading" />

      <ExifActions v-if="exifData && !error" :exif-data="exifData" />
    </template>

    <ToolSection v-if="error">
      <n-alert type="warning" :title="t('error')">
        {{ error }}
      </n-alert>
    </ToolSection>

    <ToolSection v-if="imageFile && !isLoading && !exifData && !error">
      <n-empty :description="t('noExifData')" />
    </ToolSection>

    <WhatIsExif />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as exifr from 'exifr'
import { NAlert, NEmpty } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import ImageUpload from './components/ImageUpload.vue'
import ImagePreview from './components/ImagePreview.vue'
import ExifDataDisplay from './components/ExifDataDisplay.vue'
import ExifActions from './components/ExifActions.vue'
import WhatIsExif from './components/WhatIsExif.vue'

export interface ExifData {
  [key: string]: unknown
}

const { t } = useI18n()

const imageFile = ref<File | null>(null)
const exifData = ref<ExifData | null>(null)
const isLoading = ref(false)
const error = ref('')

function clearFile() {
  imageFile.value = null
  exifData.value = null
  error.value = ''
}

watch(imageFile, async (file) => {
  if (!file) {
    exifData.value = null
    error.value = ''
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const data = await exifr.parse(file, {
      exif: true,
      iptc: true,
      xmp: true,
      icc: true,
      gps: true,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    })

    if (data && Object.keys(data).length > 0) {
      exifData.value = data
    } else {
      exifData.value = null
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('parseError')
    exifData.value = null
  } finally {
    isLoading.value = false
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "error": "Error",
    "noExifData": "This image does not contain EXIF metadata",
    "parseError": "Failed to parse image metadata"
  },
  "zh": {
    "error": "错误",
    "noExifData": "此图片不包含 EXIF 元数据",
    "parseError": "解析图片元数据失败"
  },
  "zh-CN": {
    "error": "错误",
    "noExifData": "此图片不包含 EXIF 元数据",
    "parseError": "解析图片元数据失败"
  },
  "zh-TW": {
    "error": "錯誤",
    "noExifData": "此圖片不包含 EXIF 元資料",
    "parseError": "解析圖片元資料失敗"
  },
  "zh-HK": {
    "error": "錯誤",
    "noExifData": "此圖片不包含 EXIF 元資料",
    "parseError": "解析圖片元資料失敗"
  },
  "es": {
    "error": "Error",
    "noExifData": "Esta imagen no contiene metadatos EXIF",
    "parseError": "Error al analizar los metadatos de la imagen"
  },
  "fr": {
    "error": "Erreur",
    "noExifData": "Cette image ne contient pas de métadonnées EXIF",
    "parseError": "Échec de l'analyse des métadonnées de l'image"
  },
  "de": {
    "error": "Fehler",
    "noExifData": "Dieses Bild enthält keine EXIF-Metadaten",
    "parseError": "Fehler beim Analysieren der Bildmetadaten"
  },
  "it": {
    "error": "Errore",
    "noExifData": "Questa immagine non contiene metadati EXIF",
    "parseError": "Impossibile analizzare i metadati dell'immagine"
  },
  "ja": {
    "error": "エラー",
    "noExifData": "この画像にはEXIFメタデータが含まれていません",
    "parseError": "画像メタデータの解析に失敗しました"
  },
  "ko": {
    "error": "오류",
    "noExifData": "이 이미지에는 EXIF 메타데이터가 없습니다",
    "parseError": "이미지 메타데이터 분석에 실패했습니다"
  },
  "ru": {
    "error": "Ошибка",
    "noExifData": "Это изображение не содержит метаданных EXIF",
    "parseError": "Не удалось проанализировать метаданные изображения"
  },
  "pt": {
    "error": "Erro",
    "noExifData": "Esta imagem não contém metadados EXIF",
    "parseError": "Falha ao analisar metadados da imagem"
  },
  "ar": {
    "error": "خطأ",
    "noExifData": "هذه الصورة لا تحتوي على بيانات EXIF",
    "parseError": "فشل في تحليل بيانات الصورة"
  },
  "hi": {
    "error": "त्रुटि",
    "noExifData": "इस छवि में EXIF मेटाडेटा नहीं है",
    "parseError": "छवि मेटाडेटा पार्स करने में विफल"
  },
  "tr": {
    "error": "Hata",
    "noExifData": "Bu görüntü EXIF meta verisi içermiyor",
    "parseError": "Görüntü meta verisi ayrıştırılamadı"
  },
  "nl": {
    "error": "Fout",
    "noExifData": "Deze afbeelding bevat geen EXIF-metadata",
    "parseError": "Kan metadata van afbeelding niet analyseren"
  },
  "sv": {
    "error": "Fel",
    "noExifData": "Denna bild innehåller inga EXIF-metadata",
    "parseError": "Kunde inte analysera bildmetadata"
  },
  "pl": {
    "error": "Błąd",
    "noExifData": "Ten obraz nie zawiera metadanych EXIF",
    "parseError": "Nie udało się przeanalizować metadanych obrazu"
  },
  "vi": {
    "error": "Lỗi",
    "noExifData": "Hình ảnh này không chứa dữ liệu EXIF",
    "parseError": "Không thể phân tích dữ liệu hình ảnh"
  },
  "th": {
    "error": "ข้อผิดพลาด",
    "noExifData": "ภาพนี้ไม่มีข้อมูล EXIF",
    "parseError": "ไม่สามารถวิเคราะห์ข้อมูลภาพได้"
  },
  "id": {
    "error": "Kesalahan",
    "noExifData": "Gambar ini tidak mengandung metadata EXIF",
    "parseError": "Gagal menganalisis metadata gambar"
  },
  "he": {
    "error": "שגיאה",
    "noExifData": "תמונה זו אינה מכילה נתוני EXIF",
    "parseError": "נכשל בניתוח נתוני התמונה"
  },
  "ms": {
    "error": "Ralat",
    "noExifData": "Imej ini tidak mengandungi metadata EXIF",
    "parseError": "Gagal menganalisis metadata imej"
  },
  "no": {
    "error": "Feil",
    "noExifData": "Dette bildet inneholder ikke EXIF-metadata",
    "parseError": "Kunne ikke analysere bildemetadata"
  }
}
</i18n>
