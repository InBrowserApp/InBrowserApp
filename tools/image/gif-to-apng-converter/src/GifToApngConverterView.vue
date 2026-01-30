<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <GifToApngUploadSection v-model:files="files" />

    <GifToApngOptionsSection
      v-if="files.length"
      v-model:scale="scale"
      v-model:speed="speed"
      v-model:loop-mode="loopMode"
      v-model:loop-count="loopCount"
      v-model:optimize="optimize"
      v-model:optimize-level="optimizeLevel"
      :min-scale="minScale"
      :max-scale="maxScale"
      :min-speed="minSpeed"
      :max-speed="maxSpeed"
      :is-converting="isConverting"
      :can-convert="canConvert"
      @convert="convertImages"
    />

    <GifToApngResultsSection
      v-if="results.length"
      :results="results"
      :zip-blob="zipBlob"
      :is-zipping="isZipping"
      :download-zip-name="zipName"
    />

    <ToolSection v-if="error">
      <n-alert type="warning" :show-icon="false">{{ error }}</n-alert>
    </ToolSection>

    <GifToApngNote />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NAlert } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import GifToApngNote from './components/GifToApngNote.vue'
import GifToApngOptionsSection from './components/GifToApngOptionsSection.vue'
import GifToApngResultsSection from './components/GifToApngResultsSection.vue'
import GifToApngUploadSection from './components/GifToApngUploadSection.vue'
import { convertGifToApng } from './utils/convert-gif-to-apng'
import { createApngZip } from './utils/create-apng-zip'
import type { GifLoopMode, GifToApngOptions, GifToApngResult } from './types'

const { t } = useI18n()
const message = useMessage()

const files = ref<File[]>([])
const scale = ref(100)
const speed = ref(1)
const loopMode = ref<GifLoopMode>('inherit')
const loopCount = ref<number | null>(null)
const optimize = ref(true)
const optimizeLevel = ref(2)
const results = ref<GifToApngResult[]>([])
const zipBlob = ref<Blob | null>(null)
const error = ref('')
const isConverting = ref(false)
const isZipping = ref(false)

const minScale = 10
const maxScale = 400
const minSpeed = 0.25
const maxSpeed = 4
const zipName = 'apng-images.zip'

const canConvert = computed(() => files.value.length > 0 && !isConverting.value)

let runId = 0

watch([files, scale, speed, loopMode, loopCount, optimize, optimizeLevel], () => {
  runId += 1
  results.value = []
  zipBlob.value = null
  error.value = ''
  isConverting.value = false
  isZipping.value = false
})

watch(loopMode, (mode) => {
  if (mode === 'custom' && loopCount.value === null) {
    loopCount.value = 1
  }
})

async function convertImages() {
  if (!files.value.length || isConverting.value) return

  const currentRun = ++runId
  isConverting.value = true
  isZipping.value = false
  error.value = ''
  results.value = []
  zipBlob.value = null

  const nameCounts = new Map<string, number>()
  const nextResults: GifToApngResult[] = []
  const errors: string[] = []

  try {
    for (const file of files.value) {
      const outputName = buildOutputName(file.name, nameCounts)
      try {
        const result = await convertGifToApng(file, buildConversionOptions(), outputName)
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
        const zip = await createApngZip(nextResults)
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

function buildConversionOptions(): GifToApngOptions {
  return {
    scale: scale.value,
    speed: speed.value,
    loopMode: loopMode.value,
    loopCount: loopCount.value ?? undefined,
    optimize: optimize.value,
    optimizeLevel: optimizeLevel.value,
  }
}

function resolveErrorMessage(err: unknown) {
  if (err instanceof Error) {
    switch (err.message) {
      case 'INVALID_GIF':
        return t('invalidGif')
      case 'EMPTY_GIF':
        return t('emptyGif')
      case 'INVALID_FRAME':
        return t('invalidFrame')
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
  const candidate = `${base}.png`
  const currentCount = nameCounts.get(candidate) ?? 0
  nameCounts.set(candidate, currentCount + 1)

  if (currentCount === 0) return candidate
  return `${base}-${currentCount + 1}.png`
}
</script>

<i18n lang="json">
{
  "en": {
    "convertSuccess": "Conversion completed!",
    "convertFailed": "Failed to convert GIFs. Please try again.",
    "partialFailed": "{count} files failed to convert.",
    "invalidGif": "Invalid GIF file.",
    "emptyGif": "The GIF contains no frames.",
    "invalidFrame": "Failed to decode GIF frames.",
    "canvasUnavailable": "Canvas rendering is unavailable.",
    "zipFailed": "Failed to create ZIP file."
  },
  "zh": {
    "convertSuccess": "转换完成！",
    "convertFailed": "转换失败，请重试。",
    "partialFailed": "有 {count} 个文件转换失败。",
    "invalidGif": "GIF 文件无效。",
    "emptyGif": "GIF 不包含帧。",
    "invalidFrame": "GIF 帧解码失败。",
    "canvasUnavailable": "无法使用画布渲染。",
    "zipFailed": "生成 ZIP 失败。"
  },
  "zh-CN": {
    "convertSuccess": "转换完成！",
    "convertFailed": "转换失败，请重试。",
    "partialFailed": "有 {count} 个文件转换失败。",
    "invalidGif": "GIF 文件无效。",
    "emptyGif": "GIF 不包含帧。",
    "invalidFrame": "GIF 帧解码失败。",
    "canvasUnavailable": "无法使用画布渲染。",
    "zipFailed": "生成 ZIP 失败。"
  },
  "zh-TW": {
    "convertSuccess": "轉換完成！",
    "convertFailed": "轉換失敗，請重試。",
    "partialFailed": "有 {count} 個檔案轉換失敗。",
    "invalidGif": "GIF 檔案無效。",
    "emptyGif": "GIF 不包含影格。",
    "invalidFrame": "GIF 影格解碼失敗。",
    "canvasUnavailable": "無法使用畫布渲染。",
    "zipFailed": "建立 ZIP 失敗。"
  },
  "zh-HK": {
    "convertSuccess": "轉換完成！",
    "convertFailed": "轉換失敗，請重試。",
    "partialFailed": "有 {count} 個檔案轉換失敗。",
    "invalidGif": "GIF 檔案無效。",
    "emptyGif": "GIF 不包含影格。",
    "invalidFrame": "GIF 影格解碼失敗。",
    "canvasUnavailable": "無法使用畫布渲染。",
    "zipFailed": "建立 ZIP 失敗。"
  },
  "es": {
    "convertSuccess": "¡Conversión completada!",
    "convertFailed": "No se pudieron convertir los GIF. Inténtalo de nuevo.",
    "partialFailed": "{count} archivos fallaron al convertir.",
    "invalidGif": "Archivo GIF no válido.",
    "emptyGif": "El GIF no contiene fotogramas.",
    "invalidFrame": "No se pudieron decodificar los fotogramas del GIF.",
    "canvasUnavailable": "El lienzo no está disponible.",
    "zipFailed": "No se pudo crear el ZIP."
  },
  "fr": {
    "convertSuccess": "Conversion terminée !",
    "convertFailed": "Échec de la conversion des GIF. Veuillez réessayer.",
    "partialFailed": "{count} fichiers n'ont pas été convertis.",
    "invalidGif": "Fichier GIF invalide.",
    "emptyGif": "Le GIF ne contient aucune image.",
    "invalidFrame": "Impossible de décoder les images du GIF.",
    "canvasUnavailable": "Le canvas n’est pas disponible.",
    "zipFailed": "Échec de la création du ZIP."
  },
  "de": {
    "convertSuccess": "Konvertierung abgeschlossen!",
    "convertFailed": "GIFs konnten nicht konvertiert werden. Bitte erneut versuchen.",
    "partialFailed": "{count} Dateien konnten nicht konvertiert werden.",
    "invalidGif": "Ungültige GIF-Datei.",
    "emptyGif": "Das GIF enthält keine Frames.",
    "invalidFrame": "GIF-Frames konnten nicht dekodiert werden.",
    "canvasUnavailable": "Canvas ist nicht verfügbar.",
    "zipFailed": "ZIP konnte nicht erstellt werden."
  },
  "it": {
    "convertSuccess": "Conversione completata!",
    "convertFailed": "Conversione GIF non riuscita. Riprova.",
    "partialFailed": "{count} file non sono stati convertiti.",
    "invalidGif": "File GIF non valido.",
    "emptyGif": "Il GIF non contiene fotogrammi.",
    "invalidFrame": "Impossibile decodificare i fotogrammi del GIF.",
    "canvasUnavailable": "Canvas non disponibile.",
    "zipFailed": "Creazione ZIP non riuscita."
  },
  "ja": {
    "convertSuccess": "変換が完了しました！",
    "convertFailed": "GIFの変換に失敗しました。再試行してください。",
    "partialFailed": "{count} 件のファイルで失敗しました。",
    "invalidGif": "無効なGIFファイルです。",
    "emptyGif": "GIFにフレームがありません。",
    "invalidFrame": "GIFフレームのデコードに失敗しました。",
    "canvasUnavailable": "キャンバスが使用できません。",
    "zipFailed": "ZIPの作成に失敗しました。"
  },
  "ko": {
    "convertSuccess": "변환 완료!",
    "convertFailed": "GIF 변환에 실패했습니다. 다시 시도하세요.",
    "partialFailed": "{count}개 파일 변환 실패.",
    "invalidGif": "유효하지 않은 GIF 파일입니다.",
    "emptyGif": "GIF에 프레임이 없습니다.",
    "invalidFrame": "GIF 프레임을 디코딩하지 못했습니다.",
    "canvasUnavailable": "캔버스를 사용할 수 없습니다.",
    "zipFailed": "ZIP 생성 실패."
  },
  "ru": {
    "convertSuccess": "Конвертация завершена!",
    "convertFailed": "Не удалось конвертировать GIF. Попробуйте снова.",
    "partialFailed": "Не удалось конвертировать файлов: {count}.",
    "invalidGif": "Некорректный GIF файл.",
    "emptyGif": "GIF не содержит кадров.",
    "invalidFrame": "Не удалось декодировать кадры GIF.",
    "canvasUnavailable": "Canvas недоступен.",
    "zipFailed": "Не удалось создать ZIP."
  },
  "pt": {
    "convertSuccess": "Conversão concluída!",
    "convertFailed": "Falha ao converter GIFs. Tente novamente.",
    "partialFailed": "{count} arquivos falharam na conversão.",
    "invalidGif": "Arquivo GIF inválido.",
    "emptyGif": "O GIF não contém quadros.",
    "invalidFrame": "Falha ao decodificar quadros do GIF.",
    "canvasUnavailable": "Canvas indisponível.",
    "zipFailed": "Falha ao criar ZIP."
  },
  "ar": {
    "convertSuccess": "تمت عملية التحويل!",
    "convertFailed": "فشل تحويل GIF. حاول مرة أخرى.",
    "partialFailed": "تعذر تحويل {count} ملفات.",
    "invalidGif": "ملف GIF غير صالح.",
    "emptyGif": "لا يحتوي GIF على إطارات.",
    "invalidFrame": "تعذر فك ترميز إطارات GIF.",
    "canvasUnavailable": "اللوحة غير متاحة.",
    "zipFailed": "فشل إنشاء ZIP."
  },
  "hi": {
    "convertSuccess": "कन्वर्ज़न पूरा हुआ!",
    "convertFailed": "GIF कन्वर्ज़न विफल। कृपया फिर से प्रयास करें।",
    "partialFailed": "{count} फाइलें कन्वर्ट नहीं हो सकीं।",
    "invalidGif": "अमान्य GIF फ़ाइल।",
    "emptyGif": "GIF में कोई फ्रेम नहीं है।",
    "invalidFrame": "GIF फ्रेम डिकोड नहीं हो सके।",
    "canvasUnavailable": "कैनवास उपलब्ध नहीं है।",
    "zipFailed": "ZIP बनाना विफल रहा।"
  },
  "tr": {
    "convertSuccess": "Dönüştürme tamamlandı!",
    "convertFailed": "GIF dönüştürme başarısız oldu. Lütfen tekrar deneyin.",
    "partialFailed": "{count} dosya dönüştürülemedi.",
    "invalidGif": "Geçersiz GIF dosyası.",
    "emptyGif": "GIF kare içermiyor.",
    "invalidFrame": "GIF kareleri çözümlenemedi.",
    "canvasUnavailable": "Canvas kullanılamıyor.",
    "zipFailed": "ZIP oluşturulamadı."
  },
  "nl": {
    "convertSuccess": "Conversie voltooid!",
    "convertFailed": "GIFs konden niet worden geconverteerd. Probeer opnieuw.",
    "partialFailed": "{count} bestanden konden niet worden geconverteerd.",
    "invalidGif": "Ongeldig GIF-bestand.",
    "emptyGif": "GIF bevat geen frames.",
    "invalidFrame": "GIF-frames konden niet worden gedecodeerd.",
    "canvasUnavailable": "Canvas is niet beschikbaar.",
    "zipFailed": "ZIP maken mislukt."
  },
  "sv": {
    "convertSuccess": "Konvertering klar!",
    "convertFailed": "Det gick inte att konvertera GIF. Försök igen.",
    "partialFailed": "{count} filer kunde inte konverteras.",
    "invalidGif": "Ogiltig GIF-fil.",
    "emptyGif": "GIF innehåller inga bildrutor.",
    "invalidFrame": "GIF-bildrutor kunde inte avkodas.",
    "canvasUnavailable": "Canvas är inte tillgängligt.",
    "zipFailed": "Kunde inte skapa ZIP."
  },
  "pl": {
    "convertSuccess": "Konwersja zakończona!",
    "convertFailed": "Nie udało się przekonwertować GIF. Spróbuj ponownie.",
    "partialFailed": "Nie udało się przekonwertować {count} plików.",
    "invalidGif": "Nieprawidłowy plik GIF.",
    "emptyGif": "GIF nie zawiera klatek.",
    "invalidFrame": "Nie udało się zdekodować klatek GIF.",
    "canvasUnavailable": "Canvas niedostępny.",
    "zipFailed": "Nie udało się utworzyć ZIP."
  },
  "vi": {
    "convertSuccess": "Chuyển đổi hoàn tất!",
    "convertFailed": "Không thể chuyển đổi GIF. Vui lòng thử lại.",
    "partialFailed": "{count} tệp không thể chuyển đổi.",
    "invalidGif": "Tệp GIF không hợp lệ.",
    "emptyGif": "GIF không có khung hình.",
    "invalidFrame": "Không thể giải mã khung GIF.",
    "canvasUnavailable": "Canvas không khả dụng.",
    "zipFailed": "Không thể tạo ZIP."
  },
  "th": {
    "convertSuccess": "แปลงเสร็จสิ้น!",
    "convertFailed": "แปลง GIF ไม่สำเร็จ โปรดลองอีกครั้ง",
    "partialFailed": "แปลงไม่สำเร็จ {count} ไฟล์",
    "invalidGif": "ไฟล์ GIF ไม่ถูกต้อง",
    "emptyGif": "GIF ไม่มีเฟรม",
    "invalidFrame": "ถอดรหัสเฟรม GIF ไม่สำเร็จ",
    "canvasUnavailable": "ไม่สามารถใช้แคนวาสได้",
    "zipFailed": "สร้าง ZIP ไม่สำเร็จ"
  },
  "id": {
    "convertSuccess": "Konversi selesai!",
    "convertFailed": "Gagal mengonversi GIF. Silakan coba lagi.",
    "partialFailed": "{count} file gagal dikonversi.",
    "invalidGif": "File GIF tidak valid.",
    "emptyGif": "GIF tidak memiliki frame.",
    "invalidFrame": "Gagal mendekode frame GIF.",
    "canvasUnavailable": "Canvas tidak tersedia.",
    "zipFailed": "Gagal membuat ZIP."
  },
  "he": {
    "convertSuccess": "ההמרה הושלמה!",
    "convertFailed": "ההמרה נכשלה. נסה שוב.",
    "partialFailed": "{count} קבצים נכשלו בהמרה.",
    "invalidGif": "קובץ GIF לא תקין.",
    "emptyGif": "ל-GIF אין מסגרות.",
    "invalidFrame": "פענוח מסגרות GIF נכשל.",
    "canvasUnavailable": "Canvas אינו זמין.",
    "zipFailed": "יצירת ZIP נכשלה."
  },
  "ms": {
    "convertSuccess": "Penukaran selesai!",
    "convertFailed": "Gagal menukar GIF. Sila cuba lagi.",
    "partialFailed": "{count} fail gagal ditukar.",
    "invalidGif": "Fail GIF tidak sah.",
    "emptyGif": "GIF tidak mempunyai bingkai.",
    "invalidFrame": "Gagal menyahkod bingkai GIF.",
    "canvasUnavailable": "Canvas tidak tersedia.",
    "zipFailed": "Gagal mencipta ZIP."
  },
  "no": {
    "convertSuccess": "Konvertering fullført!",
    "convertFailed": "Kunne ikke konvertere GIF. Prøv igjen.",
    "partialFailed": "{count} filer kunne ikke konverteres.",
    "invalidGif": "Ugyldig GIF-fil.",
    "emptyGif": "GIF inneholder ingen rammer.",
    "invalidFrame": "Kunne ikke dekode GIF-rammer.",
    "canvasUnavailable": "Canvas er ikke tilgjengelig.",
    "zipFailed": "Kunne ikke lage ZIP."
  }
}
</i18n>
