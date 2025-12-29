<template>
  <InfoStatistic :label="t('gpu-vendor')" :value="gpuVendor" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

// GPU Information
const getWebGLDebugInfo = () => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        return {
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || null,
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || null,
        }
      }
    }
    return { renderer: null, vendor: null }
  } catch {
    return { renderer: null, vendor: null }
  }
}

const gpuInfo = computed(() => getWebGLDebugInfo())
const gpuVendor = computed(() => gpuInfo.value.vendor)
</script>

<i18n lang="json">
{
  "en": {
    "gpu-vendor": "GPU Vendor"
  },
  "zh": {
    "gpu-vendor": "GPU厂商"
  },
  "zh-CN": {
    "gpu-vendor": "GPU厂商"
  },
  "zh-TW": {
    "gpu-vendor": "GPU 廠商"
  },
  "zh-HK": {
    "gpu-vendor": "GPU 廠商"
  },
  "es": {
    "gpu-vendor": "Fabricante de GPU"
  },
  "fr": {
    "gpu-vendor": "Fabricant GPU"
  },
  "de": {
    "gpu-vendor": "GPU-Hersteller"
  },
  "it": {
    "gpu-vendor": "Produttore GPU"
  },
  "ja": {
    "gpu-vendor": "GPUベンダー"
  },
  "ko": {
    "gpu-vendor": "GPU 제조사"
  },
  "ru": {
    "gpu-vendor": "Производитель GPU"
  },
  "pt": {
    "gpu-vendor": "Fabricante da GPU"
  },
  "ar": {
    "gpu-vendor": "شركة GPU"
  },
  "hi": {
    "gpu-vendor": "GPU विक्रेता"
  },
  "tr": {
    "gpu-vendor": "GPU Ureticisi"
  },
  "nl": {
    "gpu-vendor": "GPU-fabrikant"
  },
  "sv": {
    "gpu-vendor": "GPU-tillverkare"
  },
  "pl": {
    "gpu-vendor": "Producent GPU"
  },
  "vi": {
    "gpu-vendor": "Nha san xuat GPU"
  },
  "th": {
    "gpu-vendor": "ผู้ผลิต GPU"
  },
  "id": {
    "gpu-vendor": "Vendor GPU"
  },
  "he": {
    "gpu-vendor": "יצרן GPU"
  },
  "ms": {
    "gpu-vendor": "Vendor GPU"
  },
  "no": {
    "gpu-vendor": "GPU-leverandor"
  }
}
</i18n>
