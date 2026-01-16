<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ImageUpload v-model:file="originalFile" />

    <ConversionOptions
      v-if="originalFile"
      v-model:sizes="sizes"
      v-model:padding="padding"
      v-model:background-enabled="backgroundEnabled"
      v-model:background-color="backgroundColor"
      v-model:optimize="optimize"
      :is-converting="isConverting"
      :can-convert="canConvert"
      @convert="convertToIco"
    />

    <OutputSection
      v-if="outputBlob"
      :blob="outputBlob"
      :file-name="outputFileName"
      :sizes="selectedSizes"
    />

    <ErrorDisplay :error="error" />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { ImageUpload, ConversionOptions, OutputSection, ErrorDisplay } from './components'
import { convertImageToIco } from './utils/convert-image-to-ico'

const { t } = useI18n()
const message = useMessage()

const originalFile = ref<File | null>(null)
const outputBlob = ref<Blob | null>(null)
const error = ref('')
const isConverting = ref(false)

const sizes = ref<number[]>([16, 32, 48, 256])
const padding = ref(0)
const backgroundEnabled = ref(false)
const backgroundColor = ref('#ffffff')
const optimize = ref(true)

const selectedSizes = computed(() => Array.from(new Set(sizes.value)).sort((a, b) => b - a))

const canConvert = computed(
  () => !!originalFile.value && selectedSizes.value.length > 0 && !isConverting.value,
)

const outputFileName = computed(() => {
  if (!originalFile.value) return 'icon.ico'

  const fileName = originalFile.value.name
  const dotIndex = fileName.lastIndexOf('.')
  const baseName = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName

  return `${baseName || 'icon'}.ico`
})

watch([originalFile, sizes, padding, backgroundEnabled, backgroundColor, optimize], () => {
  error.value = ''
  outputBlob.value = null
})

async function convertToIco() {
  if (!originalFile.value) return
  if (selectedSizes.value.length === 0) {
    error.value = t('selectSizeError')
    return
  }

  isConverting.value = true
  error.value = ''

  try {
    const icoBlob = await convertImageToIco(originalFile.value, {
      sizes: selectedSizes.value,
      padding: padding.value,
      backgroundEnabled: backgroundEnabled.value,
      backgroundColor: backgroundColor.value,
      optimize: optimize.value,
    })

    outputBlob.value = icoBlob
    message.success(t('conversionComplete'))
  } catch (err) {
    const errorMessage = resolveErrorMessage(err)
    error.value = errorMessage
    message.error(errorMessage)
  } finally {
    isConverting.value = false
  }
}

function resolveErrorMessage(err: unknown) {
  if (err instanceof Error) {
    switch (err.message) {
      case 'NO_SIZES_SELECTED':
        return t('selectSizeError')
      case 'INVALID_IMAGE':
        return t('invalidImage')
      case 'CANVAS_CONTEXT_UNAVAILABLE':
        return t('canvasUnavailable')
      case 'INVALID_SIZE':
        return t('sizeTooLarge')
      default:
        return t('conversionFailed')
    }
  }

  return t('conversionFailed')
}
</script>

<i18n lang="json">
{
  "en": {
    "conversionComplete": "ICO generation complete!",
    "conversionFailed": "Failed to generate ICO. Please try again.",
    "selectSizeError": "Select at least one size to continue.",
    "invalidImage": "Failed to load the image. Please try another file.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "sizeTooLarge": "ICO size must be 256x256 or smaller."
  },
  "zh": {
    "conversionComplete": "ICO 生成完成！",
    "conversionFailed": "生成 ICO 失败，请重试。",
    "selectSizeError": "请至少选择一个尺寸。",
    "invalidImage": "图片加载失败，请尝试其他文件。",
    "canvasUnavailable": "当前浏览器不支持 Canvas。",
    "sizeTooLarge": "ICO 尺寸必须为 256x256 或更小。"
  },
  "zh-CN": {
    "conversionComplete": "ICO 生成完成！",
    "conversionFailed": "生成 ICO 失败，请重试。",
    "selectSizeError": "请至少选择一个尺寸。",
    "invalidImage": "图片加载失败，请尝试其他文件。",
    "canvasUnavailable": "当前浏览器不支持 Canvas。",
    "sizeTooLarge": "ICO 尺寸必须为 256x256 或更小。"
  },
  "zh-TW": {
    "conversionComplete": "ICO 產生完成！",
    "conversionFailed": "產生 ICO 失敗，請重試。",
    "selectSizeError": "請至少選擇一個尺寸。",
    "invalidImage": "圖片載入失敗，請嘗試其他檔案。",
    "canvasUnavailable": "目前瀏覽器不支援 Canvas。",
    "sizeTooLarge": "ICO 尺寸必須為 256x256 或更小。"
  },
  "zh-HK": {
    "conversionComplete": "ICO 產生完成！",
    "conversionFailed": "產生 ICO 失敗，請重試。",
    "selectSizeError": "請至少選擇一個尺寸。",
    "invalidImage": "圖片載入失敗，請嘗試其他檔案。",
    "canvasUnavailable": "目前瀏覽器不支援 Canvas。",
    "sizeTooLarge": "ICO 尺寸必須為 256x256 或更小。"
  },
  "es": {
    "conversionComplete": "¡Generación de ICO completada!",
    "conversionFailed": "No se pudo generar el ICO. Inténtalo de nuevo.",
    "selectSizeError": "Selecciona al menos un tamaño para continuar.",
    "invalidImage": "No se pudo cargar la imagen. Prueba con otro archivo.",
    "canvasUnavailable": "Canvas no está disponible en este navegador.",
    "sizeTooLarge": "El tamaño del ICO debe ser 256x256 o menor."
  },
  "fr": {
    "conversionComplete": "Génération de l'ICO terminée !",
    "conversionFailed": "Échec de la génération de l'ICO. Veuillez réessayer.",
    "selectSizeError": "Sélectionnez au moins une taille pour continuer.",
    "invalidImage": "Impossible de charger l'image. Essayez un autre fichier.",
    "canvasUnavailable": "Canvas n'est pas disponible dans ce navigateur.",
    "sizeTooLarge": "La taille ICO doit être de 256x256 ou moins."
  },
  "de": {
    "conversionComplete": "ICO-Erstellung abgeschlossen!",
    "conversionFailed": "ICO-Erstellung fehlgeschlagen. Bitte erneut versuchen.",
    "selectSizeError": "Wählen Sie mindestens eine Größe aus, um fortzufahren.",
    "invalidImage": "Bild konnte nicht geladen werden. Bitte wählen Sie eine andere Datei.",
    "canvasUnavailable": "Canvas ist in diesem Browser nicht verfügbar.",
    "sizeTooLarge": "Die ICO-Größe muss 256x256 oder kleiner sein."
  },
  "it": {
    "conversionComplete": "Generazione ICO completata!",
    "conversionFailed": "Generazione ICO non riuscita. Riprova.",
    "selectSizeError": "Seleziona almeno una dimensione per continuare.",
    "invalidImage": "Impossibile caricare l'immagine. Prova con un altro file.",
    "canvasUnavailable": "Canvas non è disponibile in questo browser.",
    "sizeTooLarge": "La dimensione ICO deve essere 256x256 o inferiore."
  },
  "ja": {
    "conversionComplete": "ICO の生成が完了しました！",
    "conversionFailed": "ICO の生成に失敗しました。もう一度お試しください。",
    "selectSizeError": "続行するには少なくとも1つのサイズを選択してください。",
    "invalidImage": "画像の読み込みに失敗しました。別のファイルを試してください。",
    "canvasUnavailable": "このブラウザでは Canvas が使用できません。",
    "sizeTooLarge": "ICO のサイズは 256x256 以下である必要があります。"
  },
  "ko": {
    "conversionComplete": "ICO 생성이 완료되었습니다!",
    "conversionFailed": "ICO 생성에 실패했습니다. 다시 시도하세요.",
    "selectSizeError": "계속하려면 최소 하나의 크기를 선택하세요.",
    "invalidImage": "이미지를 불러오지 못했습니다. 다른 파일을 시도하세요.",
    "canvasUnavailable": "이 브라우저에서는 Canvas를 사용할 수 없습니다.",
    "sizeTooLarge": "ICO 크기는 256x256 이하이어야 합니다."
  },
  "ru": {
    "conversionComplete": "Создание ICO завершено!",
    "conversionFailed": "Не удалось создать ICO. Попробуйте еще раз.",
    "selectSizeError": "Выберите хотя бы один размер, чтобы продолжить.",
    "invalidImage": "Не удалось загрузить изображение. Попробуйте другой файл.",
    "canvasUnavailable": "Canvas недоступен в этом браузере.",
    "sizeTooLarge": "Размер ICO должен быть 256x256 или меньше."
  },
  "pt": {
    "conversionComplete": "Geração de ICO concluída!",
    "conversionFailed": "Falha ao gerar ICO. Tente novamente.",
    "selectSizeError": "Selecione pelo menos um tamanho para continuar.",
    "invalidImage": "Falha ao carregar a imagem. Tente outro arquivo.",
    "canvasUnavailable": "Canvas não está disponível neste navegador.",
    "sizeTooLarge": "O tamanho do ICO deve ser 256x256 ou menor."
  },
  "ar": {
    "conversionComplete": "اكتملت عملية إنشاء ICO!",
    "conversionFailed": "فشل إنشاء ICO. حاول مرة أخرى.",
    "selectSizeError": "اختر حجمًا واحدًا على الأقل للمتابعة.",
    "invalidImage": "فشل تحميل الصورة. جرّب ملفًا آخر.",
    "canvasUnavailable": "Canvas غير متاح في هذا المتصفح.",
    "sizeTooLarge": "يجب أن يكون حجم ICO ‏256x256 أو أصغر."
  },
  "hi": {
    "conversionComplete": "ICO बनाना पूरा हुआ!",
    "conversionFailed": "ICO बनाने में विफल। कृपया फिर से कोशिश करें।",
    "selectSizeError": "जारी रखने के लिए कम से कम एक आकार चुनें।",
    "invalidImage": "छवि लोड करने में विफल। कोई दूसरा फ़ाइल आज़माएँ।",
    "canvasUnavailable": "इस ब्राउज़र में Canvas उपलब्ध नहीं है।",
    "sizeTooLarge": "ICO का आकार 256x256 या उससे छोटा होना चाहिए।"
  },
  "tr": {
    "conversionComplete": "ICO oluşturma tamamlandı!",
    "conversionFailed": "ICO oluşturulamadı. Lütfen tekrar deneyin.",
    "selectSizeError": "Devam etmek için en az bir boyut seçin.",
    "invalidImage": "Görsel yüklenemedi. Başka bir dosya deneyin.",
    "canvasUnavailable": "Canvas bu tarayıcıda kullanılabilir değil.",
    "sizeTooLarge": "ICO boyutu 256x256 veya daha küçük olmalıdır."
  },
  "nl": {
    "conversionComplete": "ICO-generatie voltooid!",
    "conversionFailed": "ICO genereren mislukt. Probeer het opnieuw.",
    "selectSizeError": "Selecteer minstens één grootte om door te gaan.",
    "invalidImage": "Afbeelding laden mislukt. Probeer een ander bestand.",
    "canvasUnavailable": "Canvas is niet beschikbaar in deze browser.",
    "sizeTooLarge": "ICO-formaat moet 256x256 of kleiner zijn."
  },
  "sv": {
    "conversionComplete": "ICO-generering klar!",
    "conversionFailed": "Det gick inte att generera ICO. Försök igen.",
    "selectSizeError": "Välj minst en storlek för att fortsätta.",
    "invalidImage": "Kunde inte läsa in bilden. Prova en annan fil.",
    "canvasUnavailable": "Canvas är inte tillgängligt i den här webbläsaren.",
    "sizeTooLarge": "ICO-storleken måste vara 256x256 eller mindre."
  },
  "pl": {
    "conversionComplete": "Generowanie ICO zakończone!",
    "conversionFailed": "Nie udało się wygenerować ICO. Spróbuj ponownie.",
    "selectSizeError": "Wybierz co najmniej jeden rozmiar, aby kontynuować.",
    "invalidImage": "Nie udało się wczytać obrazu. Spróbuj innego pliku.",
    "canvasUnavailable": "Canvas nie jest dostępny w tej przeglądarce.",
    "sizeTooLarge": "Rozmiar ICO musi być 256x256 lub mniejszy."
  },
  "vi": {
    "conversionComplete": "Tạo ICO hoàn tất!",
    "conversionFailed": "Không thể tạo ICO. Vui lòng thử lại.",
    "selectSizeError": "Chọn ít nhất một kích thước để tiếp tục.",
    "invalidImage": "Không thể tải ảnh. Hãy thử tệp khác.",
    "canvasUnavailable": "Canvas không khả dụng trên trình duyệt này.",
    "sizeTooLarge": "Kích thước ICO phải là 256x256 hoặc nhỏ hơn."
  },
  "th": {
    "conversionComplete": "สร้าง ICO เสร็จสิ้น!",
    "conversionFailed": "ไม่สามารถสร้าง ICO ได้ กรุณาลองใหม่อีกครั้ง",
    "selectSizeError": "เลือกอย่างน้อยหนึ่งขนาดเพื่อดำเนินการต่อ",
    "invalidImage": "ไม่สามารถโหลดรูปภาพได้ โปรดลองไฟล์อื่น",
    "canvasUnavailable": "Canvas ไม่พร้อมใช้งานในเบราว์เซอร์นี้",
    "sizeTooLarge": "ขนาด ICO ต้องเป็น 256x256 หรือน้อยกว่า"
  },
  "id": {
    "conversionComplete": "Pembuatan ICO selesai!",
    "conversionFailed": "Gagal membuat ICO. Silakan coba lagi.",
    "selectSizeError": "Pilih setidaknya satu ukuran untuk melanjutkan.",
    "invalidImage": "Gagal memuat gambar. Coba file lain.",
    "canvasUnavailable": "Canvas tidak tersedia di browser ini.",
    "sizeTooLarge": "Ukuran ICO harus 256x256 atau lebih kecil."
  },
  "he": {
    "conversionComplete": "יצירת ICO הושלמה!",
    "conversionFailed": "יצירת ICO נכשלה. נסה שוב.",
    "selectSizeError": "בחר לפחות גודל אחד כדי להמשיך.",
    "invalidImage": "טעינת התמונה נכשלה. נסה קובץ אחר.",
    "canvasUnavailable": "Canvas לא זמין בדפדפן זה.",
    "sizeTooLarge": "גודל ICO חייב להיות 256x256 או קטן יותר."
  },
  "ms": {
    "conversionComplete": "Penjanaan ICO selesai!",
    "conversionFailed": "Gagal menjana ICO. Sila cuba lagi.",
    "selectSizeError": "Pilih sekurang-kurangnya satu saiz untuk meneruskan.",
    "invalidImage": "Gagal memuatkan imej. Cuba fail lain.",
    "canvasUnavailable": "Canvas tidak tersedia dalam pelayar ini.",
    "sizeTooLarge": "Saiz ICO mesti 256x256 atau lebih kecil."
  },
  "no": {
    "conversionComplete": "ICO-generering fullført!",
    "conversionFailed": "Kunne ikke generere ICO. Prøv igjen.",
    "selectSizeError": "Velg minst én størrelse for å fortsette.",
    "invalidImage": "Kunne ikke laste bildet. Prøv en annen fil.",
    "canvasUnavailable": "Canvas er ikke tilgjengelig i denne nettleseren.",
    "sizeTooLarge": "ICO-størrelsen må være 256x256 eller mindre."
  }
}
</i18n>
