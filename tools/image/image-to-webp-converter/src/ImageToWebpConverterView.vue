<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ImageToWebpUploadSection v-model:files="files" />

    <ImageToWebpOptionsSection
      v-if="files.length"
      v-model:scale="scale"
      v-model:quality="quality"
      v-model:method="method"
      v-model:lossless="lossless"
      v-model:advanced-enabled="advancedEnabled"
      v-model:target-size="targetSize"
      v-model:target-psnr="targetPsnr"
      v-model:near-lossless="nearLossless"
      v-model:alpha-quality="alphaQuality"
      v-model:sns-strength="snsStrength"
      v-model:filter-strength="filterStrength"
      v-model:filter-sharpness="filterSharpness"
      v-model:filter-type="filterType"
      v-model:partitions="partitions"
      v-model:segments="segments"
      v-model:pass-count="passCount"
      v-model:exact-mode="exactMode"
      v-model:sharp-yuv-mode="sharpYuvMode"
      :min-scale="minScale"
      :max-scale="maxScale"
      :is-converting="isConverting"
      :can-convert="canConvert"
      @convert="convertImages"
    />

    <ImageToWebpResultsSection
      v-if="results.length"
      :results="results"
      :zip-blob="zipBlob"
      :is-zipping="isZipping"
      :download-zip-name="zipName"
    />

    <ToolSection v-if="error">
      <n-alert type="warning" :show-icon="false">{{ error }}</n-alert>
    </ToolSection>

    <ImageToWebpNote />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NAlert } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import ImageToWebpNote from './components/ImageToWebpNote.vue'
import ImageToWebpOptionsSection from './components/ImageToWebpOptionsSection.vue'
import ImageToWebpResultsSection from './components/ImageToWebpResultsSection.vue'
import ImageToWebpUploadSection from './components/ImageToWebpUploadSection.vue'
import { convertImageToWebp } from './utils/convert-image-to-webp'
import { createWebpZip } from './utils/create-webp-zip'
import type { WebpConversionOptions, WebpConversionResult } from './types'

const { t } = useI18n()
const message = useMessage()

type TriState = 'default' | 'on' | 'off'

const files = ref<File[]>([])
const scale = ref(100)
const quality = ref(80)
const method = ref(4)
const lossless = ref(false)
const advancedEnabled = ref(false)
const targetSize = ref<number | null>(null)
const targetPsnr = ref<number | null>(null)
const nearLossless = ref<number | null>(null)
const alphaQuality = ref<number | null>(null)
const snsStrength = ref<number | null>(null)
const filterStrength = ref<number | null>(null)
const filterSharpness = ref<number | null>(null)
const filterType = ref<number | null>(null)
const partitions = ref<number | null>(null)
const segments = ref<number | null>(null)
const passCount = ref<number | null>(null)
const exactMode = ref<TriState>('default')
const sharpYuvMode = ref<TriState>('default')
const results = ref<WebpConversionResult[]>([])
const zipBlob = ref<Blob | null>(null)
const error = ref('')
const isConverting = ref(false)
const isZipping = ref(false)

const minScale = 10
const maxScale = 400
const zipName = 'webp-images.zip'

const canConvert = computed(() => files.value.length > 0 && !isConverting.value)

let runId = 0

watch(
  [
    files,
    scale,
    quality,
    method,
    lossless,
    advancedEnabled,
    targetSize,
    targetPsnr,
    nearLossless,
    alphaQuality,
    snsStrength,
    filterStrength,
    filterSharpness,
    filterType,
    partitions,
    segments,
    passCount,
    exactMode,
    sharpYuvMode,
  ],
  () => {
    runId += 1
    results.value = []
    zipBlob.value = null
    error.value = ''
    isConverting.value = false
    isZipping.value = false
  },
)

async function convertImages() {
  if (!files.value.length || isConverting.value) return

  const currentRun = ++runId
  isConverting.value = true
  isZipping.value = false
  error.value = ''
  results.value = []
  zipBlob.value = null

  const nameCounts = new Map<string, number>()
  const nextResults: WebpConversionResult[] = []
  const errors: string[] = []

  try {
    for (const file of files.value) {
      const outputName = buildOutputName(file.name, nameCounts)
      try {
        const result = await convertImageToWebp(file, buildConversionOptions(), outputName)
        if (currentRun !== runId) return
        nextResults.push(result)
      } catch (err) {
        errors.push(resolveErrorMessage(err))
      }
    }

    if (currentRun !== runId) return
    results.value = nextResults

    if (nextResults.length > 1) {
      isZipping.value = true
      try {
        const zip = await createWebpZip(nextResults)
        if (currentRun !== runId) return
        zipBlob.value = zip
      } catch {
        if (currentRun !== runId) return
        const zipError = t('zipFailed')
        error.value = zipError
        message.error(zipError)
      } finally {
        if (currentRun === runId) {
          isZipping.value = false
        }
      }
    }

    if (errors.length) {
      const errorMessage = nextResults.length
        ? t('partialFailed', { count: errors.length })
        : (errors[0] ?? t('convertFailed'))
      error.value = errorMessage
      message.error(errorMessage)
    } else if (nextResults.length) {
      message.success(t('convertSuccess'))
    } else {
      error.value = t('convertFailed')
      message.error(error.value)
    }
  } finally {
    if (currentRun === runId) {
      isConverting.value = false
    }
  }
}

function buildConversionOptions(): WebpConversionOptions {
  const options: WebpConversionOptions = {
    scale: scale.value,
    quality: quality.value,
    method: method.value,
    lossless: lossless.value,
  }

  if (!advancedEnabled.value) return options

  if (targetSize.value !== null && Number.isFinite(targetSize.value)) {
    options.targetSize = Math.max(0, Math.round(targetSize.value * 1024))
  }
  if (targetPsnr.value !== null && Number.isFinite(targetPsnr.value)) {
    options.targetPsnr = targetPsnr.value
  }
  if (nearLossless.value !== null && Number.isFinite(nearLossless.value)) {
    options.nearLossless = nearLossless.value
  }
  if (alphaQuality.value !== null && Number.isFinite(alphaQuality.value)) {
    options.alphaQuality = alphaQuality.value
  }
  if (snsStrength.value !== null && Number.isFinite(snsStrength.value)) {
    options.snsStrength = snsStrength.value
  }
  if (filterStrength.value !== null && Number.isFinite(filterStrength.value)) {
    options.filterStrength = filterStrength.value
  }
  if (filterSharpness.value !== null && Number.isFinite(filterSharpness.value)) {
    options.filterSharpness = filterSharpness.value
  }
  if (filterType.value !== null && Number.isFinite(filterType.value)) {
    options.filterType = filterType.value
  }
  if (partitions.value !== null && Number.isFinite(partitions.value)) {
    options.partitions = partitions.value
  }
  if (segments.value !== null && Number.isFinite(segments.value)) {
    options.segments = segments.value
  }
  if (passCount.value !== null && Number.isFinite(passCount.value)) {
    options.pass = passCount.value
  }
  const exactValue = resolveTriState(exactMode.value)
  if (exactValue !== undefined) {
    options.exact = exactValue
  }
  const sharpYuvValue = resolveTriState(sharpYuvMode.value)
  if (sharpYuvValue !== undefined) {
    options.useSharpYuv = sharpYuvValue
  }

  return options
}

function resolveTriState(value: TriState) {
  if (value === 'on') return true
  if (value === 'off') return false
  return undefined
}

function resolveErrorMessage(err: unknown) {
  if (err instanceof Error) {
    switch (err.message) {
      case 'INVALID_IMAGE':
        return t('invalidImage')
      case 'CANVAS_CONTEXT_UNAVAILABLE':
        return t('canvasUnavailable')
      default:
        return t('convertFailed')
    }
  }
  return t('convertFailed')
}

function buildOutputName(name: string, nameCounts: Map<string, number>) {
  const base = name.replace(/\.[^/.]+$/, '') || 'image'
  const candidate = `${base}.webp`
  const currentCount = nameCounts.get(candidate) ?? 0
  nameCounts.set(candidate, currentCount + 1)

  if (currentCount === 0) return candidate
  return `${base}-${currentCount + 1}.webp`
}
</script>

<i18n lang="json">
{
  "en": {
    "convertSuccess": "Conversion completed!",
    "convertFailed": "Failed to convert images. Please try again.",
    "partialFailed": "Some files failed to convert ({count}).",
    "zipFailed": "Failed to create ZIP. Please try again.",
    "invalidImage": "Failed to load the image. Please try another file.",
    "canvasUnavailable": "Canvas is not available in this browser."
  },
  "zh": {
    "convertSuccess": "转换完成！",
    "convertFailed": "转换失败，请重试。",
    "partialFailed": "部分文件转换失败（{count}）。",
    "zipFailed": "生成 ZIP 失败，请重试。",
    "invalidImage": "图片加载失败，请尝试其他文件。",
    "canvasUnavailable": "当前浏览器不支持 Canvas。"
  },
  "zh-CN": {
    "convertSuccess": "转换完成！",
    "convertFailed": "转换失败，请重试。",
    "partialFailed": "部分文件转换失败（{count}）。",
    "zipFailed": "生成 ZIP 失败，请重试。",
    "invalidImage": "图片加载失败，请尝试其他文件。",
    "canvasUnavailable": "当前浏览器不支持 Canvas。"
  },
  "zh-TW": {
    "convertSuccess": "轉換完成！",
    "convertFailed": "轉換失敗，請重試。",
    "partialFailed": "部分檔案轉換失敗（{count}）。",
    "zipFailed": "產生 ZIP 失敗，請重試。",
    "invalidImage": "圖片載入失敗，請嘗試其他檔案。",
    "canvasUnavailable": "目前瀏覽器不支援 Canvas。"
  },
  "zh-HK": {
    "convertSuccess": "轉換完成！",
    "convertFailed": "轉換失敗，請重試。",
    "partialFailed": "部分檔案轉換失敗（{count}）。",
    "zipFailed": "產生 ZIP 失敗，請重試。",
    "invalidImage": "圖片載入失敗，請嘗試其他檔案。",
    "canvasUnavailable": "目前瀏覽器不支援 Canvas。"
  },
  "es": {
    "convertSuccess": "¡Conversión completada!",
    "convertFailed": "Error al convertir las imágenes. Inténtalo de nuevo.",
    "partialFailed": "Algunos archivos no se pudieron convertir ({count}).",
    "zipFailed": "No se pudo crear el ZIP. Inténtalo de nuevo.",
    "invalidImage": "No se pudo cargar la imagen. Prueba con otro archivo.",
    "canvasUnavailable": "Canvas no está disponible en este navegador."
  },
  "fr": {
    "convertSuccess": "Conversion terminée !",
    "convertFailed": "Échec de la conversion des images. Veuillez réessayer.",
    "partialFailed": "Certains fichiers n'ont pas été convertis ({count}).",
    "zipFailed": "Échec de la création du ZIP. Veuillez réessayer.",
    "invalidImage": "Impossible de charger l'image. Essayez un autre fichier.",
    "canvasUnavailable": "Canvas n'est pas disponible dans ce navigateur."
  },
  "de": {
    "convertSuccess": "Konvertierung abgeschlossen!",
    "convertFailed": "Bilder konnten nicht konvertiert werden. Bitte erneut versuchen.",
    "partialFailed": "Einige Dateien konnten nicht konvertiert werden ({count}).",
    "zipFailed": "ZIP konnte nicht erstellt werden. Bitte erneut versuchen.",
    "invalidImage": "Bild konnte nicht geladen werden. Bitte andere Datei versuchen.",
    "canvasUnavailable": "Canvas ist in diesem Browser nicht verfügbar."
  },
  "it": {
    "convertSuccess": "Conversione completata!",
    "convertFailed": "Conversione immagini fallita. Riprova.",
    "partialFailed": "Alcuni file non sono stati convertiti ({count}).",
    "zipFailed": "Impossibile creare lo ZIP. Riprova.",
    "invalidImage": "Impossibile caricare l'immagine. Prova un altro file.",
    "canvasUnavailable": "Canvas non è disponibile in questo browser."
  },
  "ja": {
    "convertSuccess": "変換が完了しました！",
    "convertFailed": "画像の変換に失敗しました。もう一度お試しください。",
    "partialFailed": "一部のファイルを変換できませんでした（{count}）。",
    "zipFailed": "ZIP の作成に失敗しました。もう一度お試しください。",
    "invalidImage": "画像の読み込みに失敗しました。別のファイルをお試しください。",
    "canvasUnavailable": "このブラウザは Canvas をサポートしていません。"
  },
  "ko": {
    "convertSuccess": "변환 완료!",
    "convertFailed": "이미지 변환에 실패했습니다. 다시 시도하세요.",
    "partialFailed": "일부 파일을 변환하지 못했습니다({count}).",
    "zipFailed": "ZIP 생성에 실패했습니다. 다시 시도하세요.",
    "invalidImage": "이미지를 불러오지 못했습니다. 다른 파일을 시도하세요.",
    "canvasUnavailable": "이 브라우저는 Canvas를 지원하지 않습니다."
  },
  "ru": {
    "convertSuccess": "Конвертация завершена!",
    "convertFailed": "Не удалось конвертировать изображения. Попробуйте снова.",
    "partialFailed": "Некоторые файлы не удалось конвертировать ({count}).",
    "zipFailed": "Не удалось создать ZIP. Попробуйте снова.",
    "invalidImage": "Не удалось загрузить изображение. Попробуйте другой файл.",
    "canvasUnavailable": "Canvas недоступен в этом браузере."
  },
  "pt": {
    "convertSuccess": "Conversão concluída!",
    "convertFailed": "Falha ao converter imagens. Tente novamente.",
    "partialFailed": "Alguns arquivos não foram convertidos ({count}).",
    "zipFailed": "Falha ao criar o ZIP. Tente novamente.",
    "invalidImage": "Não foi possível carregar a imagem. Tente outro arquivo.",
    "canvasUnavailable": "Canvas não está disponível neste navegador."
  },
  "ar": {
    "convertSuccess": "اكتمل التحويل!",
    "convertFailed": "فشل تحويل الصور. حاول مرة أخرى.",
    "partialFailed": "تعذر تحويل بعض الملفات ({count}).",
    "zipFailed": "تعذر إنشاء ملف ZIP. حاول مرة أخرى.",
    "invalidImage": "تعذر تحميل الصورة. جرّب ملفًا آخر.",
    "canvasUnavailable": "Canvas غير متاح في هذا المتصفح."
  },
  "hi": {
    "convertSuccess": "रूपांतरण पूर्ण!",
    "convertFailed": "इमेज बदलने में विफल। कृपया फिर से प्रयास करें।",
    "partialFailed": "कुछ फ़ाइलें नहीं बदली जा सकीं ({count}).",
    "zipFailed": "ZIP बनाना विफल रहा। कृपया फिर से प्रयास करें।",
    "invalidImage": "इमेज लोड नहीं हो सकी। कोई अन्य फ़ाइल आज़माएँ।",
    "canvasUnavailable": "इस ब्राउज़र में Canvas उपलब्ध नहीं है।"
  },
  "tr": {
    "convertSuccess": "Dönüştürme tamamlandı!",
    "convertFailed": "Görseller dönüştürülemedi. Lütfen tekrar deneyin.",
    "partialFailed": "Bazı dosyalar dönüştürülemedi ({count}).",
    "zipFailed": "ZIP oluşturulamadı. Lütfen tekrar deneyin.",
    "invalidImage": "Görsel yüklenemedi. Başka bir dosya deneyin.",
    "canvasUnavailable": "Canvas bu tarayıcıda kullanılamıyor."
  },
  "nl": {
    "convertSuccess": "Conversie voltooid!",
    "convertFailed": "Afbeeldingen konden niet worden geconverteerd. Probeer opnieuw.",
    "partialFailed": "Sommige bestanden konden niet worden geconverteerd ({count}).",
    "zipFailed": "ZIP maken mislukt. Probeer opnieuw.",
    "invalidImage": "Afbeelding kon niet worden geladen. Probeer een ander bestand.",
    "canvasUnavailable": "Canvas is niet beschikbaar in deze browser."
  },
  "sv": {
    "convertSuccess": "Konverteringen klar!",
    "convertFailed": "Det gick inte att konvertera bilderna. Försök igen.",
    "partialFailed": "Vissa filer kunde inte konverteras ({count}).",
    "zipFailed": "Det gick inte att skapa ZIP. Försök igen.",
    "invalidImage": "Det gick inte att ladda bilden. Prova en annan fil.",
    "canvasUnavailable": "Canvas är inte tillgängligt i den här webbläsaren."
  },
  "pl": {
    "convertSuccess": "Konwersja zakończona!",
    "convertFailed": "Nie udało się przekonwertować obrazów. Spróbuj ponownie.",
    "partialFailed": "Niektórych plików nie udało się przekonwertować ({count}).",
    "zipFailed": "Nie udało się utworzyć ZIP. Spróbuj ponownie.",
    "invalidImage": "Nie udało się wczytać obrazu. Spróbuj innego pliku.",
    "canvasUnavailable": "Canvas nie jest dostępny w tej przeglądarce."
  },
  "vi": {
    "convertSuccess": "Chuyển đổi hoàn tất!",
    "convertFailed": "Chuyển đổi ảnh thất bại. Vui lòng thử lại.",
    "partialFailed": "Một số tệp không thể chuyển đổi ({count}).",
    "zipFailed": "Không thể tạo ZIP. Vui lòng thử lại.",
    "invalidImage": "Không thể tải ảnh. Vui lòng thử tệp khác.",
    "canvasUnavailable": "Canvas không khả dụng trên trình duyệt này."
  },
  "th": {
    "convertSuccess": "แปลงเสร็จแล้ว!",
    "convertFailed": "แปลงรูปภาพไม่สำเร็จ โปรดลองอีกครั้ง",
    "partialFailed": "บางไฟล์ไม่สามารถแปลงได้ ({count}).",
    "zipFailed": "สร้าง ZIP ไม่สำเร็จ โปรดลองอีกครั้ง",
    "invalidImage": "โหลดรูปภาพไม่สำเร็จ โปรดลองไฟล์อื่น",
    "canvasUnavailable": "Canvas ไม่พร้อมใช้งานในเบราว์เซอร์นี้"
  },
  "id": {
    "convertSuccess": "Konversi selesai!",
    "convertFailed": "Gagal mengonversi gambar. Silakan coba lagi.",
    "partialFailed": "Beberapa file tidak dapat dikonversi ({count}).",
    "zipFailed": "Gagal membuat ZIP. Silakan coba lagi.",
    "invalidImage": "Gagal memuat gambar. Coba file lain.",
    "canvasUnavailable": "Canvas tidak tersedia di browser ini."
  },
  "he": {
    "convertSuccess": "ההמרה הושלמה!",
    "convertFailed": "המרת התמונות נכשלה. נסה שוב.",
    "partialFailed": "חלק מהקבצים לא הומרו ({count}).",
    "zipFailed": "יצירת ZIP נכשלה. נסה שוב.",
    "invalidImage": "לא ניתן היה לטעון את התמונה. נסה קובץ אחר.",
    "canvasUnavailable": "Canvas לא זמין בדפדפן זה."
  },
  "ms": {
    "convertSuccess": "Penukaran selesai!",
    "convertFailed": "Gagal menukar imej. Sila cuba lagi.",
    "partialFailed": "Sebahagian fail tidak dapat ditukar ({count}).",
    "zipFailed": "Gagal membuat ZIP. Sila cuba lagi.",
    "invalidImage": "Gagal memuatkan imej. Cuba fail lain.",
    "canvasUnavailable": "Canvas tidak tersedia dalam pelayar ini."
  },
  "no": {
    "convertSuccess": "Konvertering fullført!",
    "convertFailed": "Kunne ikke konvertere bildene. Prøv igjen.",
    "partialFailed": "Noen filer kunne ikke konverteres ({count}).",
    "zipFailed": "Kunne ikke opprette ZIP. Prøv igjen.",
    "invalidImage": "Kunne ikke laste bildet. Prøv en annen fil.",
    "canvasUnavailable": "Canvas er ikke tilgjengelig i denne nettleseren."
  }
}
</i18n>
