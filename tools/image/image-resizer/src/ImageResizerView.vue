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
          :max-dimension="MAX_RESIZE_DIMENSION"
          :quality-disabled="qualityDisabled"
          :allow-upscale-label="t('allowUpscaleLabel')"
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
import { MAX_RESIZE_DIMENSION } from './utils/resize-limits'
import { getResizeOptionLabels } from './utils/option-labels'
import { isLossyQualityEnabled } from './utils/resize-output'

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
  outputFormat: 'auto',
  quality: 92,
})

const resultBlob = computed(() => result.value?.blob ?? null)
const downloadUrl = useObjectUrl(resultBlob)

const optionLabels = computed(() => getResizeOptionLabels(locale.value))
const qualityDisabled = computed(() => {
  if (!imageFile.value) return false
  return !isLossyQualityEnabled(imageFile.value.type, options.value.outputFormat)
})
let resizeRunToken = 0

watch(imageFile, async (file) => {
  resizeRunToken += 1
  result.value = null
  error.value = ''
  sourceDimensions.value = null

  if (!file) return

  const activeFile = file

  try {
    const dimensions = await readImageDimensions(activeFile)

    if (imageFile.value !== activeFile) return

    sourceDimensions.value = dimensions

    options.value = {
      ...options.value,
      width: dimensions.width,
      height: dimensions.height,
    }
  } catch {
    if (imageFile.value !== activeFile) return
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
  { value: 'auto', label: optionLabels.value.formats.auto },
  { value: 'png', label: optionLabels.value.formats.png },
  { value: 'jpeg', label: optionLabels.value.formats.jpeg },
  { value: 'webp', label: optionLabels.value.formats.webp },
])

watch(
  options,
  () => {
    resizeRunToken += 1
    result.value = null
    error.value = ''
  },
  { deep: true },
)

async function runResize() {
  const currentFile = imageFile.value
  if (!currentFile) return

  const runToken = ++resizeRunToken
  const resizeOptions = { ...options.value }

  isProcessing.value = true
  error.value = ''
  result.value = null

  try {
    const resized = await resizeImage(currentFile, resizeOptions)

    if (runToken !== resizeRunToken || imageFile.value !== currentFile) return

    result.value = resized
    message.success(t('resizeSuccessText'))
  } catch (reason) {
    if (runToken !== resizeRunToken || imageFile.value !== currentFile) return

    result.value = null
    error.value = resolveErrorMessage(reason)
    message.error(error.value)
  } finally {
    if (runToken === resizeRunToken) {
      isProcessing.value = false
    }
  }
}

function resolveErrorMessage(reason: unknown) {
  if (reason instanceof Error) {
    if (reason.message === 'INVALID_IMAGE') return t('invalidImageText')
    if (reason.message === 'OUTPUT_TOO_LARGE') return t('imageTooLargeText')
    if (reason.message === 'OUTPUT_TOO_LARGE_FOR_ALGORITHM') {
      return t('imageTooLargeForAlgorithmText')
    }
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
    "resizeFailedText": "Image resize failed. Please try another setting or file.",
    "allowUpscaleLabel": "Allow enlarging beyond original size",
    "imageTooLargeText": "This resize request is too large for the browser. Reduce the width or height and try again.",
    "imageTooLargeForAlgorithmText": "This image is too large for the selected algorithm. Choose Browser high quality or resize to a smaller size."
  },
  "zh": {
    "errorTitle": "缩放失败",
    "invalidImageText": "无法读取该图片文件，请更换一张图片。",
    "resizeSuccessText": "图片尺寸缩放完成。",
    "resizeFailedText": "图片尺寸缩放失败，请尝试其他设置或文件。",
    "allowUpscaleLabel": "允许放大到超过原始尺寸",
    "imageTooLargeText": "当前缩放请求对浏览器来说过大，请调小宽度或高度后重试。",
    "imageTooLargeForAlgorithmText": "当前图片对所选算法来说过大，请改用浏览器高质量或缩小目标尺寸。"
  },
  "zh-CN": {
    "errorTitle": "缩放失败",
    "invalidImageText": "无法读取该图片文件，请更换一张图片。",
    "resizeSuccessText": "图片尺寸缩放完成。",
    "resizeFailedText": "图片尺寸缩放失败，请尝试其他设置或文件。",
    "allowUpscaleLabel": "允许放大到超过原始尺寸",
    "imageTooLargeText": "当前缩放请求对浏览器来说过大，请调小宽度或高度后重试。",
    "imageTooLargeForAlgorithmText": "当前图片对所选算法来说过大，请改用浏览器高质量或缩小目标尺寸。"
  },
  "zh-TW": {
    "errorTitle": "縮放失敗",
    "invalidImageText": "無法讀取此圖片檔案，請更換其他圖片。",
    "resizeSuccessText": "圖片尺寸縮放完成。",
    "resizeFailedText": "圖片尺寸縮放失敗，請嘗試其他設定或檔案。",
    "allowUpscaleLabel": "允許放大超過原始尺寸",
    "imageTooLargeText": "目前的縮放要求對瀏覽器來說過大，請調小寬度或高度後再試一次。",
    "imageTooLargeForAlgorithmText": "目前圖片對所選演算法來說過大，請改用瀏覽器高品質或縮小目標尺寸。"
  },
  "zh-HK": {
    "errorTitle": "縮放失敗",
    "invalidImageText": "無法讀取此圖片檔案，請更換其他圖片。",
    "resizeSuccessText": "圖片尺寸縮放完成。",
    "resizeFailedText": "圖片尺寸縮放失敗，請嘗試其他設定或檔案。",
    "allowUpscaleLabel": "允許放大超過原始尺寸",
    "imageTooLargeText": "目前的縮放要求對瀏覽器來說過大，請調小寬度或高度後再試一次。",
    "imageTooLargeForAlgorithmText": "目前圖片對所選演算法來說過大，請改用瀏覽器高品質或縮小目標尺寸。"
  },
  "es": {
    "errorTitle": "Error de escalado",
    "invalidImageText": "No se pudo leer este archivo de imagen. Elige otra imagen.",
    "resizeSuccessText": "Imagen escalada correctamente.",
    "resizeFailedText": "No se pudo escalar la imagen. Prueba otra configuración o archivo.",
    "allowUpscaleLabel": "Permitir ampliar por encima del tamaño original",
    "imageTooLargeText": "Esta solicitud es demasiado grande para el navegador. Reduce el ancho o el alto e inténtalo de nuevo.",
    "imageTooLargeForAlgorithmText": "La imagen es demasiado grande para el algoritmo seleccionado. Usa Calidad alta del navegador o un tamaño menor."
  },
  "fr": {
    "errorTitle": "Erreur de redimensionnement",
    "invalidImageText": "Impossible de lire ce fichier image. Veuillez choisir une autre image.",
    "resizeSuccessText": "Image redimensionnée avec succès.",
    "resizeFailedText": "Échec du redimensionnement. Essayez un autre réglage ou fichier.",
    "allowUpscaleLabel": "Autoriser l’agrandissement au-delà de la taille d’origine",
    "imageTooLargeText": "Cette demande est trop grande pour le navigateur. Réduisez la largeur ou la hauteur puis réessayez.",
    "imageTooLargeForAlgorithmText": "Cette image est trop grande pour l’algorithme choisi. Utilisez la haute qualité du navigateur ou une taille plus petite."
  },
  "de": {
    "errorTitle": "Skalierungsfehler",
    "invalidImageText": "Diese Bilddatei konnte nicht gelesen werden. Bitte wähle eine andere.",
    "resizeSuccessText": "Bild erfolgreich skaliert.",
    "resizeFailedText": "Bildskalierung fehlgeschlagen. Bitte versuche andere Einstellungen oder Datei.",
    "allowUpscaleLabel": "Vergrößern über die Originalgröße hinaus erlauben",
    "imageTooLargeText": "Diese Skalierungsanfrage ist für den Browser zu groß. Bitte Breite oder Höhe reduzieren und erneut versuchen.",
    "imageTooLargeForAlgorithmText": "Dieses Bild ist für den gewählten Algorithmus zu groß. Nutze Browser-Hochqualität oder ein kleineres Zielmaß."
  },
  "it": {
    "errorTitle": "Errore di ridimensionamento",
    "invalidImageText": "Impossibile leggere questo file immagine. Scegli un’altra immagine.",
    "resizeSuccessText": "Immagine ridimensionata con successo.",
    "resizeFailedText": "Ridimensionamento non riuscito. Prova altre impostazioni o file.",
    "allowUpscaleLabel": "Consenti l’ingrandimento oltre la dimensione originale",
    "imageTooLargeText": "Questa richiesta è troppo grande per il browser. Riduci larghezza o altezza e riprova.",
    "imageTooLargeForAlgorithmText": "Questa immagine è troppo grande per l’algoritmo selezionato. Usa Alta qualità browser o una dimensione più piccola."
  },
  "ja": {
    "errorTitle": "リサイズエラー",
    "invalidImageText": "この画像ファイルを読み込めませんでした。別の画像を選択してください。",
    "resizeSuccessText": "画像のサイズ変更が完了しました。",
    "resizeFailedText": "画像のサイズ変更に失敗しました。別の設定またはファイルをお試しください。",
    "allowUpscaleLabel": "元のサイズを超える拡大を許可",
    "imageTooLargeText": "このリサイズ要求はブラウザーには大きすぎます。幅または高さを下げて再試行してください。",
    "imageTooLargeForAlgorithmText": "この画像は選択したアルゴリズムには大きすぎます。ブラウザー高品質に切り替えるか、より小さいサイズにしてください。"
  },
  "ko": {
    "errorTitle": "크기 조절 오류",
    "invalidImageText": "이 이미지 파일을 읽을 수 없습니다. 다른 이미지를 선택해 주세요.",
    "resizeSuccessText": "이미지 크기 조절이 완료되었습니다.",
    "resizeFailedText": "이미지 크기 조절에 실패했습니다. 다른 설정이나 파일을 시도해 주세요.",
    "allowUpscaleLabel": "원본 크기보다 크게 확대 허용",
    "imageTooLargeText": "현재 크기 조절 요청은 브라우저에서 처리하기에 너무 큽니다. 너비나 높이를 줄여 다시 시도하세요.",
    "imageTooLargeForAlgorithmText": "현재 이미지는 선택한 알고리즘에 비해 너무 큽니다. 브라우저 고품질로 바꾸거나 더 작은 크기를 사용하세요."
  },
  "ru": {
    "errorTitle": "Ошибка масштабирования",
    "invalidImageText": "Не удалось прочитать этот файл изображения. Выберите другой файл.",
    "resizeSuccessText": "Изображение успешно масштабировано.",
    "resizeFailedText": "Не удалось масштабировать изображение. Попробуйте другие настройки или файл.",
    "allowUpscaleLabel": "Разрешить увеличение больше исходного размера",
    "imageTooLargeText": "Этот запрос слишком большой для браузера. Уменьшите ширину или высоту и попробуйте снова.",
    "imageTooLargeForAlgorithmText": "Изображение слишком большое для выбранного алгоритма. Используйте высокое качество браузера или меньший размер."
  },
  "pt": {
    "errorTitle": "Erro de redimensionamento",
    "invalidImageText": "Falha ao ler este arquivo de imagem. Escolha outra imagem.",
    "resizeSuccessText": "Imagem redimensionada com sucesso.",
    "resizeFailedText": "Falha ao redimensionar a imagem. Tente outra configuração ou arquivo.",
    "allowUpscaleLabel": "Permitir ampliar além do tamanho original",
    "imageTooLargeText": "Esta solicitação é grande demais para o navegador. Reduza a largura ou a altura e tente novamente.",
    "imageTooLargeForAlgorithmText": "Esta imagem é grande demais para o algoritmo selecionado. Use alta qualidade do navegador ou um tamanho menor."
  },
  "ar": {
    "errorTitle": "خطأ في التحجيم",
    "invalidImageText": "تعذر قراءة ملف الصورة هذا. يرجى اختيار صورة أخرى.",
    "resizeSuccessText": "تم تحجيم الصورة بنجاح.",
    "resizeFailedText": "فشل تحجيم الصورة. جرّب إعدادًا أو ملفًا آخر.",
    "allowUpscaleLabel": "السماح بالتكبير إلى ما بعد الحجم الأصلي",
    "imageTooLargeText": "طلب التحجيم هذا كبير جدًا على المتصفح. قلّل العرض أو الارتفاع ثم أعد المحاولة.",
    "imageTooLargeForAlgorithmText": "هذه الصورة كبيرة جدًا على الخوارزمية المحددة. استخدم الجودة العالية للمتصفح أو حجمًا أصغر."
  },
  "hi": {
    "errorTitle": "स्केलिंग त्रुटि",
    "invalidImageText": "यह इमेज फ़ाइल पढ़ी नहीं जा सकी। कृपया दूसरी इमेज चुनें।",
    "resizeSuccessText": "इमेज सफलतापूर्वक स्केल हो गई।",
    "resizeFailedText": "इमेज स्केल नहीं हो सकी। कृपया दूसरी सेटिंग या फ़ाइल आज़माएँ।",
    "allowUpscaleLabel": "मूल आकार से बड़ा करने की अनुमति दें",
    "imageTooLargeText": "यह अनुरोध ब्राउज़र के लिए बहुत बड़ा है। चौड़ाई या ऊँचाई कम करके फिर कोशिश करें।",
    "imageTooLargeForAlgorithmText": "यह इमेज चुने गए एल्गोरिदम के लिए बहुत बड़ी है। ब्राउज़र हाई क्वालिटी चुनें या छोटा आकार रखें।"
  },
  "tr": {
    "errorTitle": "Ölçekleme hatası",
    "invalidImageText": "Bu görsel dosyası okunamadı. Lütfen başka bir görsel seçin.",
    "resizeSuccessText": "Görsel başarıyla ölçeklendi.",
    "resizeFailedText": "Görsel ölçeklenemedi. Lütfen farklı bir ayar veya dosya deneyin.",
    "allowUpscaleLabel": "Orijinal boyuttan daha büyük büyütmeye izin ver",
    "imageTooLargeText": "Bu istek tarayıcı için fazla büyük. Genişliği veya yüksekliği küçültüp tekrar deneyin.",
    "imageTooLargeForAlgorithmText": "Bu görsel seçilen algoritma için fazla büyük. Tarayıcı yüksek kaliteyi seçin veya daha küçük bir boyut kullanın."
  },
  "nl": {
    "errorTitle": "Schaalfout",
    "invalidImageText": "Dit afbeeldingsbestand kon niet worden gelezen. Kies een andere afbeelding.",
    "resizeSuccessText": "Afbeelding succesvol geschaald.",
    "resizeFailedText": "Afbeelding schalen mislukt. Probeer een andere instelling of bestand.",
    "allowUpscaleLabel": "Vergroten boven de oorspronkelijke grootte toestaan",
    "imageTooLargeText": "Deze aanvraag is te groot voor de browser. Verlaag de breedte of hoogte en probeer opnieuw.",
    "imageTooLargeForAlgorithmText": "Deze afbeelding is te groot voor het gekozen algoritme. Gebruik browser hoge kwaliteit of een kleiner formaat."
  },
  "sv": {
    "errorTitle": "Skalningsfel",
    "invalidImageText": "Det gick inte att läsa bildfilen. Välj en annan bild.",
    "resizeSuccessText": "Bilden har skalats klart.",
    "resizeFailedText": "Det gick inte att skala bilden. Prova en annan inställning eller fil.",
    "allowUpscaleLabel": "Tillåt förstoring över originalstorleken",
    "imageTooLargeText": "Den här begäran är för stor för webbläsaren. Minska bredden eller höjden och försök igen.",
    "imageTooLargeForAlgorithmText": "Den här bilden är för stor för den valda algoritmen. Välj webbläsarens höga kvalitet eller en mindre storlek."
  },
  "pl": {
    "errorTitle": "Błąd skalowania",
    "invalidImageText": "Nie udało się odczytać tego pliku obrazu. Wybierz inny obraz.",
    "resizeSuccessText": "Obraz został pomyślnie przeskalowany.",
    "resizeFailedText": "Skalowanie nie powiodło się. Spróbuj innych ustawień lub pliku.",
    "allowUpscaleLabel": "Zezwalaj na powiększanie ponad rozmiar oryginalny",
    "imageTooLargeText": "To żądanie jest zbyt duże dla przeglądarki. Zmniejsz szerokość lub wysokość i spróbuj ponownie.",
    "imageTooLargeForAlgorithmText": "Ten obraz jest zbyt duży dla wybranego algorytmu. Użyj wysokiej jakości przeglądarki albo mniejszego rozmiaru."
  },
  "vi": {
    "errorTitle": "Lỗi thu phóng",
    "invalidImageText": "Không thể đọc tệp ảnh này. Vui lòng chọn ảnh khác.",
    "resizeSuccessText": "Thu phóng ảnh thành công.",
    "resizeFailedText": "Thu phóng ảnh thất bại. Vui lòng thử cài đặt hoặc tệp khác.",
    "allowUpscaleLabel": "Cho phép phóng to vượt quá kích thước gốc",
    "imageTooLargeText": "Yêu cầu này quá lớn đối với trình duyệt. Hãy giảm chiều rộng hoặc chiều cao rồi thử lại.",
    "imageTooLargeForAlgorithmText": "Hình ảnh này quá lớn đối với thuật toán đã chọn. Hãy dùng chất lượng cao của trình duyệt hoặc kích thước nhỏ hơn."
  },
  "th": {
    "errorTitle": "เกิดข้อผิดพลาดในการปรับขนาด",
    "invalidImageText": "ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ โปรดเลือกรูปภาพอื่น",
    "resizeSuccessText": "ปรับขนาดรูปภาพเรียบร้อยแล้ว",
    "resizeFailedText": "ปรับขนาดรูปภาพไม่สำเร็จ โปรดลองการตั้งค่าหรือไฟล์อื่น",
    "allowUpscaleLabel": "อนุญาตให้ขยายเกินขนาดต้นฉบับ",
    "imageTooLargeText": "คำขอนี้ใหญ่เกินไปสำหรับเบราว์เซอร์ โปรดลดความกว้างหรือความสูงแล้วลองอีกครั้ง",
    "imageTooLargeForAlgorithmText": "รูปภาพนี้ใหญ่เกินไปสำหรับอัลกอริทึมที่เลือก โปรดใช้คุณภาพสูงของเบราว์เซอร์หรือขนาดที่เล็กลง"
  },
  "id": {
    "errorTitle": "Kesalahan penskalaan",
    "invalidImageText": "Gagal membaca file gambar ini. Silakan pilih gambar lain.",
    "resizeSuccessText": "Gambar berhasil diskalakan.",
    "resizeFailedText": "Gagal menskalakan gambar. Coba pengaturan atau file lain.",
    "allowUpscaleLabel": "Izinkan memperbesar melebihi ukuran asli",
    "imageTooLargeText": "Permintaan ini terlalu besar untuk browser. Kurangi lebar atau tinggi lalu coba lagi.",
    "imageTooLargeForAlgorithmText": "Gambar ini terlalu besar untuk algoritme yang dipilih. Gunakan kualitas tinggi browser atau ukuran yang lebih kecil."
  },
  "he": {
    "errorTitle": "שגיאת שינוי גודל",
    "invalidImageText": "לא ניתן לקרוא את קובץ התמונה הזה. נא לבחור תמונה אחרת.",
    "resizeSuccessText": "שינוי הגודל הושלם בהצלחה.",
    "resizeFailedText": "שינוי הגודל נכשל. נסו הגדרה או קובץ אחר.",
    "allowUpscaleLabel": "לאפשר הגדלה מעבר לגודל המקורי",
    "imageTooLargeText": "הבקשה הזו גדולה מדי עבור הדפדפן. הקטן את הרוחב או הגובה ונסה שוב.",
    "imageTooLargeForAlgorithmText": "התמונה הזו גדולה מדי עבור האלגוריתם שנבחר. השתמש באיכות הגבוהה של הדפדפן או בגודל קטן יותר."
  },
  "ms": {
    "errorTitle": "Ralat penskalaan",
    "invalidImageText": "Gagal membaca fail imej ini. Sila pilih imej lain.",
    "resizeSuccessText": "Imej berjaya diskalakan.",
    "resizeFailedText": "Gagal menskalakan imej. Cuba tetapan atau fail lain.",
    "allowUpscaleLabel": "Benarkan pembesaran melebihi saiz asal",
    "imageTooLargeText": "Permintaan ini terlalu besar untuk pelayar. Kurangkan lebar atau tinggi dan cuba lagi.",
    "imageTooLargeForAlgorithmText": "Imej ini terlalu besar untuk algoritma yang dipilih. Gunakan kualiti tinggi pelayar atau saiz yang lebih kecil."
  },
  "no": {
    "errorTitle": "Skaleringsfeil",
    "invalidImageText": "Kunne ikke lese bildefilen. Velg et annet bilde.",
    "resizeSuccessText": "Bildet ble skalert.",
    "resizeFailedText": "Kunne ikke skalere bildet. Prøv en annen innstilling eller fil.",
    "allowUpscaleLabel": "Tillat forstørring utover original størrelse",
    "imageTooLargeText": "Denne forespørselen er for stor for nettleseren. Reduser bredde eller høyde og prøv igjen.",
    "imageTooLargeForAlgorithmText": "Dette bildet er for stort for den valgte algoritmen. Bruk nettleserens høye kvalitet eller en mindre størrelse."
  }
}
</i18n>
