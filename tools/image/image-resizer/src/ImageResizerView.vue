<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
      <n-gi>
        <ImageResizeInput v-model:file="imageFile" :dimensions="sourceDimensions" />
      </n-gi>

      <n-gi>
        <ResizeOptionsPanel
          v-model:options="options"
          :source-dimensions="sourceDimensions"
          :algorithms="algorithmOptions"
          :formats="formatOptions"
          :is-processing="isProcessing"
          :has-image="Boolean(imageFile)"
          @resize="runResize"
        />

        <ResizeResultPanel
          v-if="imageFile && result && downloadUrl"
          :original-file="imageFile"
          :result="result"
          :download-url="downloadUrl"
        />
      </n-gi>
    </n-grid>

    <ToolSection v-if="error">
      <n-alert type="warning" :title="t('errorTitle')" :show-icon="false">
        {{ error }}
      </n-alert>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NAlert, NGi, NGrid, useMessage } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import { ImageResizeInput, ResizeOptionsPanel, ResizeResultPanel } from './components'
import type { ImageDimensions, ResizeOptions, ResizeResult } from './types'
import { imageResizeAlgorithms, resizeImage } from './utils/resize-image'
import { getResizeOptionLabels } from './utils/option-labels'

const message = useMessage()
const { t, locale } = useI18n({ useScope: 'local' })

const imageFile = ref<File | null>(null)
const sourceDimensions = ref<ImageDimensions | null>(null)
const isProcessing = ref(false)
const error = ref('')
const result = ref<ResizeResult | null>(null)

const options = ref<ResizeOptions>({
  width: 1280,
  height: 720,
  keepAspectRatio: true,
  allowUpscale: true,
  algorithm: 'browser-high',
  outputFormat: 'original',
  quality: 92,
})

const resultBlob = computed(() => result.value?.blob ?? null)
const downloadUrl = useObjectUrl(resultBlob)

const optionLabels = computed(() => getResizeOptionLabels(locale.value))

watch(imageFile, async (file) => {
  result.value = null
  error.value = ''
  sourceDimensions.value = null

  if (!file) return

  try {
    const dimensions = await readImageDimensions(file)
    sourceDimensions.value = dimensions

    options.value = {
      ...options.value,
      width: dimensions.width,
      height: dimensions.height,
      allowUpscale: true,
    }
  } catch {
    error.value = t('invalidImageText')
  }
})

const algorithmOptions = computed<SelectOption[]>(() => {
  return imageResizeAlgorithms.map((item) => ({
    value: item.value,
    label: optionLabels.value.algorithms[item.value],
  }))
})

const formatOptions = computed<SelectOption[]>(() => [
  { value: 'original', label: optionLabels.value.formats.original },
  { value: 'png', label: optionLabels.value.formats.png },
  { value: 'jpeg', label: optionLabels.value.formats.jpeg },
  { value: 'webp', label: optionLabels.value.formats.webp },
])

async function runResize() {
  if (!imageFile.value) return

  isProcessing.value = true
  error.value = ''

  try {
    result.value = await resizeImage(imageFile.value, {
      ...options.value,
      allowUpscale: true,
    })
    message.success(t('resizeSuccessText'))
  } catch (reason) {
    result.value = null
    error.value = resolveErrorMessage(reason)
    message.error(error.value)
  } finally {
    isProcessing.value = false
  }
}

function resolveErrorMessage(reason: unknown) {
  if (reason instanceof Error) {
    if (reason.message === 'INVALID_IMAGE') return t('invalidImageText')
  }
  return t('resizeFailedText')
}

async function readImageDimensions(file: File): Promise<ImageDimensions> {
  if ('createImageBitmap' in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)
      const dimensions = {
        width: Math.max(1, bitmap.width),
        height: Math.max(1, bitmap.height),
      }
      bitmap.close?.()
      return dimensions
    } catch {
      // fallback to HTMLImageElement
    }
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('INVALID_IMAGE'))
      element.src = objectUrl
    })

    return {
      width: Math.max(1, image.naturalWidth || image.width || 1),
      height: Math.max(1, image.naturalHeight || image.height || 1),
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "errorTitle": "Resize Error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "zh": {
    "errorTitle": "缩放失败",
    "invalidImageText": "无法读取该图片文件，请更换一张图片。",
    "resizeSuccessText": "图片尺寸缩放完成。",
    "resizeFailedText": "图片尺寸缩放失败，请尝试其他设置或文件。"
  },
  "zh-CN": {
    "errorTitle": "缩放失败",
    "invalidImageText": "无法读取该图片文件，请更换一张图片。",
    "resizeSuccessText": "图片尺寸缩放完成。",
    "resizeFailedText": "图片尺寸缩放失败，请尝试其他设置或文件。"
  },
  "zh-TW": {
    "errorTitle": "縮放失敗",
    "invalidImageText": "無法讀取此圖片檔案，請更換其他圖片。",
    "resizeSuccessText": "圖片尺寸縮放完成。",
    "resizeFailedText": "圖片尺寸縮放失敗，請嘗試其他設定或檔案。"
  },
  "zh-HK": {
    "errorTitle": "縮放失敗",
    "invalidImageText": "無法讀取此圖片檔案，請更換其他圖片。",
    "resizeSuccessText": "圖片尺寸縮放完成。",
    "resizeFailedText": "圖片尺寸縮放失敗，請嘗試其他設定或檔案。"
  },
  "es": {
    "errorTitle": "Error de escalado",
    "invalidImageText": "No se pudo leer este archivo de imagen. Elige otra imagen.",
    "resizeSuccessText": "Imagen escalada correctamente.",
    "resizeFailedText": "No se pudo escalar la imagen. Prueba otra configuración o archivo."
  },
  "fr": {
    "errorTitle": "Erreur de redimensionnement",
    "invalidImageText": "Impossible de lire ce fichier image. Veuillez choisir une autre image.",
    "resizeSuccessText": "Image redimensionnée avec succès.",
    "resizeFailedText": "Échec du redimensionnement. Essayez un autre réglage ou fichier."
  },
  "de": {
    "errorTitle": "Skalierungsfehler",
    "invalidImageText": "Diese Bilddatei konnte nicht gelesen werden. Bitte wähle eine andere.",
    "resizeSuccessText": "Bild erfolgreich skaliert.",
    "resizeFailedText": "Bildskalierung fehlgeschlagen. Bitte versuche andere Einstellungen oder Datei."
  },
  "it": {
    "errorTitle": "Errore di ridimensionamento",
    "invalidImageText": "Impossibile leggere questo file immagine. Scegli un’altra immagine.",
    "resizeSuccessText": "Immagine ridimensionata con successo.",
    "resizeFailedText": "Ridimensionamento non riuscito. Prova altre impostazioni o file."
  },
  "ja": {
    "errorTitle": "リサイズエラー",
    "invalidImageText": "この画像ファイルを読み込めませんでした。別の画像を選択してください。",
    "resizeSuccessText": "画像のサイズ変更が完了しました。",
    "resizeFailedText": "画像のサイズ変更に失敗しました。別の設定またはファイルをお試しください。"
  },
  "ko": {
    "errorTitle": "크기 조절 오류",
    "invalidImageText": "이 이미지 파일을 읽을 수 없습니다. 다른 이미지를 선택해 주세요.",
    "resizeSuccessText": "이미지 크기 조절이 완료되었습니다.",
    "resizeFailedText": "이미지 크기 조절에 실패했습니다. 다른 설정이나 파일을 시도해 주세요."
  },
  "ru": {
    "errorTitle": "Ошибка масштабирования",
    "invalidImageText": "Не удалось прочитать этот файл изображения. Выберите другой файл.",
    "resizeSuccessText": "Изображение успешно масштабировано.",
    "resizeFailedText": "Не удалось масштабировать изображение. Попробуйте другие настройки или файл."
  },
  "pt": {
    "errorTitle": "Erro de redimensionamento",
    "invalidImageText": "Falha ao ler este arquivo de imagem. Escolha outra imagem.",
    "resizeSuccessText": "Imagem redimensionada com sucesso.",
    "resizeFailedText": "Falha ao redimensionar a imagem. Tente outra configuração ou arquivo."
  },
  "ar": {
    "errorTitle": "خطأ في التحجيم",
    "invalidImageText": "تعذر قراءة ملف الصورة هذا. يرجى اختيار صورة أخرى.",
    "resizeSuccessText": "تم تحجيم الصورة بنجاح.",
    "resizeFailedText": "فشل تحجيم الصورة. جرّب إعدادًا أو ملفًا آخر."
  },
  "hi": {
    "errorTitle": "स्केलिंग त्रुटि",
    "invalidImageText": "यह इमेज फ़ाइल पढ़ी नहीं जा सकी। कृपया दूसरी इमेज चुनें।",
    "resizeSuccessText": "इमेज सफलतापूर्वक स्केल हो गई।",
    "resizeFailedText": "इमेज स्केल नहीं हो सकी। कृपया दूसरी सेटिंग या फ़ाइल आज़माएँ।"
  },
  "tr": {
    "errorTitle": "Ölçekleme hatası",
    "invalidImageText": "Bu görsel dosyası okunamadı. Lütfen başka bir görsel seçin.",
    "resizeSuccessText": "Görsel başarıyla ölçeklendi.",
    "resizeFailedText": "Görsel ölçeklenemedi. Lütfen farklı bir ayar veya dosya deneyin."
  },
  "nl": {
    "errorTitle": "Schaalfout",
    "invalidImageText": "Dit afbeeldingsbestand kon niet worden gelezen. Kies een andere afbeelding.",
    "resizeSuccessText": "Afbeelding succesvol geschaald.",
    "resizeFailedText": "Afbeelding schalen mislukt. Probeer een andere instelling of bestand."
  },
  "sv": {
    "errorTitle": "Skalningsfel",
    "invalidImageText": "Det gick inte att läsa bildfilen. Välj en annan bild.",
    "resizeSuccessText": "Bilden har skalats klart.",
    "resizeFailedText": "Det gick inte att skala bilden. Prova en annan inställning eller fil."
  },
  "pl": {
    "errorTitle": "Błąd skalowania",
    "invalidImageText": "Nie udało się odczytać tego pliku obrazu. Wybierz inny obraz.",
    "resizeSuccessText": "Obraz został pomyślnie przeskalowany.",
    "resizeFailedText": "Skalowanie nie powiodło się. Spróbuj innych ustawień lub pliku."
  },
  "vi": {
    "errorTitle": "Lỗi thu phóng",
    "invalidImageText": "Không thể đọc tệp ảnh này. Vui lòng chọn ảnh khác.",
    "resizeSuccessText": "Thu phóng ảnh thành công.",
    "resizeFailedText": "Thu phóng ảnh thất bại. Vui lòng thử cài đặt hoặc tệp khác."
  },
  "th": {
    "errorTitle": "เกิดข้อผิดพลาดในการปรับขนาด",
    "invalidImageText": "ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ โปรดเลือกรูปภาพอื่น",
    "resizeSuccessText": "ปรับขนาดรูปภาพเรียบร้อยแล้ว",
    "resizeFailedText": "ปรับขนาดรูปภาพไม่สำเร็จ โปรดลองการตั้งค่าหรือไฟล์อื่น"
  },
  "id": {
    "errorTitle": "Kesalahan penskalaan",
    "invalidImageText": "Gagal membaca file gambar ini. Silakan pilih gambar lain.",
    "resizeSuccessText": "Gambar berhasil diskalakan.",
    "resizeFailedText": "Gagal menskalakan gambar. Coba pengaturan atau file lain."
  },
  "he": {
    "errorTitle": "שגיאת שינוי גודל",
    "invalidImageText": "לא ניתן לקרוא את קובץ התמונה הזה. נא לבחור תמונה אחרת.",
    "resizeSuccessText": "שינוי הגודל הושלם בהצלחה.",
    "resizeFailedText": "שינוי הגודל נכשל. נסו הגדרה או קובץ אחר."
  },
  "ms": {
    "errorTitle": "Ralat penskalaan",
    "invalidImageText": "Gagal membaca fail imej ini. Sila pilih imej lain.",
    "resizeSuccessText": "Imej berjaya diskalakan.",
    "resizeFailedText": "Gagal menskalakan imej. Cuba tetapan atau fail lain."
  },
  "no": {
    "errorTitle": "Skaleringsfeil",
    "invalidImageText": "Kunne ikke lese bildefilen. Velg et annet bilde.",
    "resizeSuccessText": "Bildet ble skalert.",
    "resizeFailedText": "Kunne ikke skalere bildet. Prøv en annen innstilling eller fil."
  }
}
</i18n>
