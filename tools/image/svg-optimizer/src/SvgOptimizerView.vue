<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <SvgInput v-model:svg-string="svgString" v-model:file-name="fileName" />
    <OptimizationOptions v-if="svgString" v-model:options="options" :is-optimizing="isOptimizing" />
    <OptimizationResults
      v-if="optimizedSvg"
      :original-svg="svgString"
      :optimized-svg="optimizedSvg"
      :file-name="fileName"
    />
    <WhatIsSvgOptimizer />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStorage, watchDebounced } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import {
  SvgInput,
  OptimizationOptions,
  OptimizationResults,
  WhatIsSvgOptimizer,
  type OptimizationOptionsType,
} from './components'

const { t } = useI18n()
const message = useMessage()

const svgString = ref('')
const fileName = ref('')
const optimizedSvg = ref('')
const isOptimizing = ref(false)

const options = useStorage<OptimizationOptionsType>('tools:svg-optimizer:options', {
  multipass: true,
  removeComments: true,
  removeMetadata: true,
  cleanupIds: true,
  convertColors: true,
  removeDimensions: false,
  inlineStyles: false,
})

// Auto-optimize when svgString changes
watch(svgString, (newValue) => {
  if (newValue) {
    optimizeSvg()
  } else {
    optimizedSvg.value = ''
  }
})

// Re-optimize when options change (debounced)
watchDebounced(
  options,
  () => {
    if (svgString.value) {
      optimizeSvg()
    }
  },
  { debounce: 300, deep: true },
)

async function optimizeSvg() {
  if (!svgString.value) return

  isOptimizing.value = true
  optimizedSvg.value = ''

  try {
    const { optimize } = await import('svgo/browser')

    const plugins: Array<Record<string, unknown>> = [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // SVGO preset-default enables these by default
            // Set to false to disable (when user unchecks the option)
            removeComments: options.value.removeComments,
            removeMetadata: options.value.removeMetadata,
            cleanupIds: options.value.cleanupIds,
            convertColors: options.value.convertColors,
            inlineStyles: options.value.inlineStyles,
          },
        },
      },
    ]

    if (options.value.removeDimensions) {
      plugins.push({ name: 'removeDimensions' })
    }

    const config = {
      multipass: options.value.multipass,
      plugins,
    }

    const result = optimize(svgString.value, config as unknown as Parameters<typeof optimize>[1])

    optimizedSvg.value = result.data
    message.success(t('optimizeSuccess'))
  } catch (error) {
    console.error('SVG optimization failed:', error)
    message.error(t('optimizeFailed'))
  } finally {
    isOptimizing.value = false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "optimizeSuccess": "SVG optimized successfully!",
    "optimizeFailed": "Failed to optimize SVG"
  },
  "zh": {
    "optimizeSuccess": "SVG 优化成功！",
    "optimizeFailed": "SVG 优化失败"
  },
  "zh-CN": {
    "optimizeSuccess": "SVG 优化成功！",
    "optimizeFailed": "SVG 优化失败"
  },
  "zh-TW": {
    "optimizeSuccess": "SVG 優化成功！",
    "optimizeFailed": "SVG 優化失敗"
  },
  "zh-HK": {
    "optimizeSuccess": "SVG 優化成功！",
    "optimizeFailed": "SVG 優化失敗"
  },
  "es": {
    "optimizeSuccess": "¡SVG optimizado con éxito!",
    "optimizeFailed": "Error al optimizar SVG"
  },
  "fr": {
    "optimizeSuccess": "SVG optimisé avec succès !",
    "optimizeFailed": "Échec de l'optimisation du SVG"
  },
  "de": {
    "optimizeSuccess": "SVG erfolgreich optimiert!",
    "optimizeFailed": "SVG-Optimierung fehlgeschlagen"
  },
  "it": {
    "optimizeSuccess": "SVG ottimizzato con successo!",
    "optimizeFailed": "Ottimizzazione SVG fallita"
  },
  "ja": {
    "optimizeSuccess": "SVG の最適化に成功しました！",
    "optimizeFailed": "SVG の最適化に失敗しました"
  },
  "ko": {
    "optimizeSuccess": "SVG 최적화 성공!",
    "optimizeFailed": "SVG 최적화 실패"
  },
  "ru": {
    "optimizeSuccess": "SVG успешно оптимизирован!",
    "optimizeFailed": "Не удалось оптимизировать SVG"
  },
  "pt": {
    "optimizeSuccess": "SVG otimizado com sucesso!",
    "optimizeFailed": "Falha ao otimizar SVG"
  },
  "ar": {
    "optimizeSuccess": "تم تحسين SVG بنجاح!",
    "optimizeFailed": "فشل في تحسين SVG"
  },
  "hi": {
    "optimizeSuccess": "SVG सफलतापूर्वक अनुकूलित!",
    "optimizeFailed": "SVG अनुकूलन विफल"
  },
  "tr": {
    "optimizeSuccess": "SVG başarıyla optimize edildi!",
    "optimizeFailed": "SVG optimize edilemedi"
  },
  "nl": {
    "optimizeSuccess": "SVG succesvol geoptimaliseerd!",
    "optimizeFailed": "SVG-optimalisatie mislukt"
  },
  "sv": {
    "optimizeSuccess": "SVG optimerad framgångsrikt!",
    "optimizeFailed": "Misslyckades med att optimera SVG"
  },
  "pl": {
    "optimizeSuccess": "SVG zoptymalizowane pomyślnie!",
    "optimizeFailed": "Nie udało się zoptymalizować SVG"
  },
  "vi": {
    "optimizeSuccess": "Tối ưu hóa SVG thành công!",
    "optimizeFailed": "Không thể tối ưu hóa SVG"
  },
  "th": {
    "optimizeSuccess": "เพิ่มประสิทธิภาพ SVG สำเร็จ!",
    "optimizeFailed": "ไม่สามารถเพิ่มประสิทธิภาพ SVG ได้"
  },
  "id": {
    "optimizeSuccess": "SVG berhasil dioptimalkan!",
    "optimizeFailed": "Gagal mengoptimalkan SVG"
  },
  "he": {
    "optimizeSuccess": "SVG אופטם בהצלחה!",
    "optimizeFailed": "נכשל באופטימיזציה של SVG"
  },
  "ms": {
    "optimizeSuccess": "SVG berjaya dioptimumkan!",
    "optimizeFailed": "Gagal mengoptimumkan SVG"
  },
  "no": {
    "optimizeSuccess": "SVG optimalisert vellykket!",
    "optimizeFailed": "Kunne ikke optimalisere SVG"
  }
}
</i18n>
