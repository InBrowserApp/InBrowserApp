<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <!-- File Upload -->
    <FileUpload v-model:file="originalFile" />

    <!-- Optimization Options -->
    <OptimizationOptions
      v-if="originalFile"
      v-model:options="options"
      :is-optimizing="isOptimizing"
      @optimize="optimizeImage"
    />

    <!-- Results -->
    <OptimizationResults
      v-if="optimizedFile && originalFile"
      :original-file="originalFile"
      :optimized-file="optimizedFile"
    />

    <!-- Error Display -->
    <ErrorDisplay :error="error" />

    <HowToOptimizePNG />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { optimizePNG } from '@utils/image'
import type { OptimiseOptions } from '@jsquash/oxipng/meta'
import HowToOptimizePNG from './components/HowToOptimizePNG.vue'

// Components
import { FileUpload, OptimizationOptions, OptimizationResults, ErrorDisplay } from './components'

const { t } = useI18n()
const message = useMessage()

// State
const originalFile = ref<File | null>(null)
const optimizedFile = ref<Blob | null>(null)
const isOptimizing = ref(false)
const error = ref('')

// Options
const options = ref<OptimiseOptions>({
  level: 2,
  interlace: false,
  optimiseAlpha: true,
})

watch(originalFile, () => {
  error.value = ''
  optimizedFile.value = null
})

// Optimization
async function optimizeImage() {
  if (!originalFile.value) return

  isOptimizing.value = true
  error.value = ''

  try {
    const optimized = await optimizePNG(
      originalFile.value,
      JSON.parse(JSON.stringify(options.value)),
    )
    optimizedFile.value = optimized

    message.success(t('optimizationComplete'))
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('optimizationFailed')
    message.error(t('optimizationFailed'))
  } finally {
    isOptimizing.value = false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "optimizationComplete": "Image optimization completed!",
    "optimizationFailed": "Failed to optimize the image. Please try again."
  },
  "zh": {
    "optimizationComplete": "图片优化完成！",
    "optimizationFailed": "优化图片失败，请重试。"
  },
  "zh-CN": {
    "optimizationComplete": "图片优化完成！",
    "optimizationFailed": "优化图片失败，请重试。"
  },
  "zh-TW": {
    "optimizationComplete": "圖片最佳化完成！",
    "optimizationFailed": "最佳化圖片失敗，請重試。"
  },
  "zh-HK": {
    "optimizationComplete": "圖片最佳化完成！",
    "optimizationFailed": "最佳化圖片失敗，請重試。"
  },
  "es": {
    "optimizationComplete": "¡Optimización de imagen completada!",
    "optimizationFailed": "Error al optimizar la imagen. Inténtalo de nuevo."
  },
  "fr": {
    "optimizationComplete": "Optimisation de l'image terminée !",
    "optimizationFailed": "Échec de l'optimisation de l'image. Veuillez réessayer."
  },
  "de": {
    "optimizationComplete": "Bildoptimierung abgeschlossen!",
    "optimizationFailed": "Bildoptimierung fehlgeschlagen. Bitte versuchen Sie es erneut."
  },
  "it": {
    "optimizationComplete": "Ottimizzazione immagine completata!",
    "optimizationFailed": "Ottimizzazione immagine fallita. Riprova."
  },
  "ja": {
    "optimizationComplete": "画像の最適化が完了しました！",
    "optimizationFailed": "画像の最適化に失敗しました。再試行してください。"
  },
  "ko": {
    "optimizationComplete": "이미지 최적화가 완료되었습니다!",
    "optimizationFailed": "이미지 최적화에 실패했습니다. 다시 시도하세요."
  },
  "ru": {
    "optimizationComplete": "Оптимизация изображения завершена!",
    "optimizationFailed": "Не удалось оптимизировать изображение. Попробуйте снова."
  },
  "pt": {
    "optimizationComplete": "Otimização da imagem concluída!",
    "optimizationFailed": "Falha ao otimizar a imagem. Tente novamente."
  },
  "ar": {
    "optimizationComplete": "تم إكمال تحسين الصورة!",
    "optimizationFailed": "فشل في تحسين الصورة. حاول مرة أخرى."
  },
  "hi": {
    "optimizationComplete": "छवि अनुकूलन पूर्ण!",
    "optimizationFailed": "छवि अनुकूलन विफल। फिर से कोशिश करें।"
  },
  "tr": {
    "optimizationComplete": "Resim optimizasyonu tamamlandı!",
    "optimizationFailed": "Resim optimizasyonu başarısız. Tekrar deneyin."
  },
  "nl": {
    "optimizationComplete": "Afbeelding optimalisatie voltooid!",
    "optimizationFailed": "Afbeelding optimalisatie mislukt. Probeer opnieuw."
  },
  "sv": {
    "optimizationComplete": "Bildoptimering slutförd!",
    "optimizationFailed": "Bildoptimering misslyckades. Försök igen."
  },
  "pl": {
    "optimizationComplete": "Optymalizacja obrazu zakończona!",
    "optimizationFailed": "Optymalizacja obrazu nie powiodła się. Spróbuj ponownie."
  },
  "vi": {
    "optimizationComplete": "Tối ưu hóa hình ảnh hoàn tất!",
    "optimizationFailed": "Tối ưu hóa hình ảnh thất bại. Vui lòng thử lại."
  },
  "th": {
    "optimizationComplete": "การปรับปรุงภาพเสร็จสิ้น!",
    "optimizationFailed": "การปรับปรุงภาพล้มเหลว กรุณาลองใหม่"
  },
  "id": {
    "optimizationComplete": "Optimasi gambar selesai!",
    "optimizationFailed": "Optimasi gambar gagal. Silakan coba lagi."
  },
  "he": {
    "optimizationComplete": "אופטימיזציית התמונה הושלמה!",
    "optimizationFailed": "אופטימיזציית התמונה נכשלה. נסה שוב."
  },
  "ms": {
    "optimizationComplete": "Pengoptimuman imej selesai!",
    "optimizationFailed": "Pengoptimuman imej gagal. Sila cuba lagi."
  },
  "no": {
    "optimizationComplete": "Bildeoptimalisering fullført!",
    "optimizationFailed": "Bildeoptimalisering mislyktes. Prøv igjen."
  }
}
</i18n>
