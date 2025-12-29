<template>
  <InfoStatistic :label="t('gpu-renderer')" :value="gpuRenderer" />
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
const gpuRenderer = computed(() => gpuInfo.value.renderer)
</script>

<i18n lang="json">
{
  "en": {
    "gpu-renderer": "GPU Renderer"
  },
  "zh": {
    "gpu-renderer": "GPU渲染器"
  },
  "zh-CN": {
    "gpu-renderer": "GPU渲染器"
  },
  "zh-TW": {
    "gpu-renderer": "GPU 渲染器"
  },
  "zh-HK": {
    "gpu-renderer": "GPU 渲染器"
  },
  "es": {
    "gpu-renderer": "Renderizador GPU"
  },
  "fr": {
    "gpu-renderer": "Moteur de rendu GPU"
  },
  "de": {
    "gpu-renderer": "GPU-Renderer"
  },
  "it": {
    "gpu-renderer": "Renderer GPU"
  },
  "ja": {
    "gpu-renderer": "GPUレンダラー"
  },
  "ko": {
    "gpu-renderer": "GPU 렌더러"
  },
  "ru": {
    "gpu-renderer": "GPU рендерер"
  },
  "pt": {
    "gpu-renderer": "Renderizador GPU"
  },
  "ar": {
    "gpu-renderer": "عارض GPU"
  },
  "hi": {
    "gpu-renderer": "GPU रेंडरर"
  },
  "tr": {
    "gpu-renderer": "GPU Isleyici"
  },
  "nl": {
    "gpu-renderer": "GPU-renderer"
  },
  "sv": {
    "gpu-renderer": "GPU-renderare"
  },
  "pl": {
    "gpu-renderer": "Renderer GPU"
  },
  "vi": {
    "gpu-renderer": "Trinh ket xuat GPU"
  },
  "th": {
    "gpu-renderer": "ตัวเรนเดอร์ GPU"
  },
  "id": {
    "gpu-renderer": "Renderer GPU"
  },
  "he": {
    "gpu-renderer": "מעבד גרפי GPU"
  },
  "ms": {
    "gpu-renderer": "Pemapar GPU"
  },
  "no": {
    "gpu-renderer": "GPU-renderer"
  }
}
</i18n>
