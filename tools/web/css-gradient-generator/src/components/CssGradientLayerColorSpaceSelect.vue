<template>
  <div class="form-row">
    <div class="form-label">{{ t('colorSpaceLabel') }}</div>
    <n-select v-model:value="layerColorSpaceModel" :options="colorSpaceOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { ColorSpace } from '../types'

const { t } = useI18n()

const layerColorSpaceModel = defineModel<ColorSpace>('layerColorSpace', { required: true })

const colorSpaceOptions = computed(() => [
  { label: t('colorSpace.srgb'), value: 'srgb' },
  { label: t('colorSpace.oklch'), value: 'oklch' },
])
</script>

<style scoped>
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.form-label {
  font-size: 13px;
  color: var(--n-text-color-3);
}
</style>

<i18n lang="json">
{
  "en": {
    "colorSpaceLabel": "Interpolation",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "zh": {
    "colorSpaceLabel": "插值空间",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "zh-CN": {
    "colorSpaceLabel": "插值空间",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "zh-TW": {
    "colorSpaceLabel": "插值空間",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "zh-HK": {
    "colorSpaceLabel": "插值空間",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "es": {
    "colorSpaceLabel": "Interpolación",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "fr": {
    "colorSpaceLabel": "Interpolation",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "de": {
    "colorSpaceLabel": "Interpolation",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "it": {
    "colorSpaceLabel": "Interpolazione",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "ja": {
    "colorSpaceLabel": "補間",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "ko": {
    "colorSpaceLabel": "보간",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "ru": {
    "colorSpaceLabel": "Интерполяция",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "pt": {
    "colorSpaceLabel": "Interpolação",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "ar": {
    "colorSpaceLabel": "الاستيفاء",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "hi": {
    "colorSpaceLabel": "इंटरपोलेशन",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "tr": {
    "colorSpaceLabel": "Enterpolasyon",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "nl": {
    "colorSpaceLabel": "Interpolatie",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "sv": {
    "colorSpaceLabel": "Interpolering",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "pl": {
    "colorSpaceLabel": "Interpolacja",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "vi": {
    "colorSpaceLabel": "Nội suy",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "th": {
    "colorSpaceLabel": "การอินเตอร์โพเลต",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "id": {
    "colorSpaceLabel": "Interpolasi",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "he": {
    "colorSpaceLabel": "אינטרפולציה",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "ms": {
    "colorSpaceLabel": "Interpolasi",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  },
  "no": {
    "colorSpaceLabel": "Interpolasjon",
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    }
  }
}
</i18n>
