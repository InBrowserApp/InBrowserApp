<template>
  <span class="blend-options" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlendMode } from '../types'

const { t } = useI18n()

const options = computed<{ label: string; value: BlendMode }[]>(() => [
  { label: t('blend.hard-light'), value: 'hard-light' },
  { label: t('blend.soft-light'), value: 'soft-light' },
  { label: t('blend.difference'), value: 'difference' },
  { label: t('blend.exclusion'), value: 'exclusion' },
  { label: t('blend.hue'), value: 'hue' },
  { label: t('blend.saturation'), value: 'saturation' },
  { label: t('blend.color'), value: 'color' },
  { label: t('blend.luminosity'), value: 'luminosity' },
])

defineExpose({ options })
</script>

<style scoped>
.blend-options {
  display: none;
}
</style>

<i18n lang="json">
{
  "en": {
    "blend": {
      "hard-light": "Hard light",
      "soft-light": "Soft light",
      "difference": "Difference",
      "exclusion": "Exclusion",
      "hue": "Hue",
      "saturation": "Saturation",
      "color": "Color",
      "luminosity": "Luminosity"
    }
  },
  "zh": {
    "blend": {
      "hard-light": "强光",
      "soft-light": "柔光",
      "difference": "差值",
      "exclusion": "排除",
      "hue": "色相",
      "saturation": "饱和度",
      "color": "颜色",
      "luminosity": "明度"
    }
  },
  "zh-CN": {
    "blend": {
      "hard-light": "强光",
      "soft-light": "柔光",
      "difference": "差值",
      "exclusion": "排除",
      "hue": "色相",
      "saturation": "饱和度",
      "color": "颜色",
      "luminosity": "明度"
    }
  },
  "zh-TW": {
    "blend": {
      "hard-light": "強光",
      "soft-light": "柔光",
      "difference": "差值",
      "exclusion": "排除",
      "hue": "色相",
      "saturation": "飽和度",
      "color": "顏色",
      "luminosity": "明度"
    }
  },
  "zh-HK": {
    "blend": {
      "hard-light": "強光",
      "soft-light": "柔光",
      "difference": "差值",
      "exclusion": "排除",
      "hue": "色相",
      "saturation": "飽和度",
      "color": "顏色",
      "luminosity": "明度"
    }
  },
  "es": {
    "blend": {
      "hard-light": "Luz fuerte",
      "soft-light": "Luz suave",
      "difference": "Diferencia",
      "exclusion": "Exclusión",
      "hue": "Tono",
      "saturation": "Saturación",
      "color": "Color",
      "luminosity": "Luminosidad"
    }
  },
  "fr": {
    "blend": {
      "hard-light": "Lumière crue",
      "soft-light": "Lumière tamisée",
      "difference": "Différence",
      "exclusion": "Exclusion",
      "hue": "Teinte",
      "saturation": "Saturation",
      "color": "Couleur",
      "luminosity": "Luminosité"
    }
  },
  "de": {
    "blend": {
      "hard-light": "Hartes Licht",
      "soft-light": "Weiches Licht",
      "difference": "Differenz",
      "exclusion": "Ausschluss",
      "hue": "Farbton",
      "saturation": "Sättigung",
      "color": "Farbe",
      "luminosity": "Luminanz"
    }
  },
  "it": {
    "blend": {
      "hard-light": "Luce intensa",
      "soft-light": "Luce soffusa",
      "difference": "Differenza",
      "exclusion": "Esclusione",
      "hue": "Tonalità",
      "saturation": "Saturazione",
      "color": "Colore",
      "luminosity": "Luminosità"
    }
  },
  "ja": {
    "blend": {
      "hard-light": "ハードライト",
      "soft-light": "ソフトライト",
      "difference": "差の絶対値",
      "exclusion": "除外",
      "hue": "色相",
      "saturation": "彩度",
      "color": "カラー",
      "luminosity": "輝度"
    }
  },
  "ko": {
    "blend": {
      "hard-light": "하드 라이트",
      "soft-light": "소프트 라이트",
      "difference": "차이",
      "exclusion": "제외",
      "hue": "색상",
      "saturation": "채도",
      "color": "컬러",
      "luminosity": "명도"
    }
  },
  "ru": {
    "blend": {
      "hard-light": "Жёсткий свет",
      "soft-light": "Мягкий свет",
      "difference": "Разница",
      "exclusion": "Исключение",
      "hue": "Тон",
      "saturation": "Насыщенность",
      "color": "Цвет",
      "luminosity": "Яркость"
    }
  },
  "pt": {
    "blend": {
      "hard-light": "Luz forte",
      "soft-light": "Luz suave",
      "difference": "Diferença",
      "exclusion": "Exclusão",
      "hue": "Matiz",
      "saturation": "Saturação",
      "color": "Cor",
      "luminosity": "Luminosidade"
    }
  },
  "ar": {
    "blend": {
      "hard-light": "ضوء قوي",
      "soft-light": "ضوء ناعم",
      "difference": "فرق",
      "exclusion": "استثناء",
      "hue": "صبغة",
      "saturation": "تشبع",
      "color": "لون",
      "luminosity": "لمعان"
    }
  },
  "hi": {
    "blend": {
      "hard-light": "हार्ड लाइट",
      "soft-light": "सॉफ्ट लाइट",
      "difference": "अंतर",
      "exclusion": "बहिष्करण",
      "hue": "ह्यू",
      "saturation": "संतृप्ति",
      "color": "रंग",
      "luminosity": "दीप्ति"
    }
  },
  "tr": {
    "blend": {
      "hard-light": "Sert ışık",
      "soft-light": "Yumuşak ışık",
      "difference": "Fark",
      "exclusion": "Dışlama",
      "hue": "Ton",
      "saturation": "Doygunluk",
      "color": "Renk",
      "luminosity": "Parlaklık"
    }
  },
  "nl": {
    "blend": {
      "hard-light": "Hard licht",
      "soft-light": "Zacht licht",
      "difference": "Verschil",
      "exclusion": "Uitsluiting",
      "hue": "Tint",
      "saturation": "Verzadiging",
      "color": "Kleur",
      "luminosity": "Helderheid"
    }
  },
  "sv": {
    "blend": {
      "hard-light": "Hårt ljus",
      "soft-light": "Mjukt ljus",
      "difference": "Skillnad",
      "exclusion": "Uteslutning",
      "hue": "Nyans",
      "saturation": "Mättnad",
      "color": "Färg",
      "luminosity": "Luminans"
    }
  },
  "pl": {
    "blend": {
      "hard-light": "Twarde światło",
      "soft-light": "Miękkie światło",
      "difference": "Różnica",
      "exclusion": "Wykluczenie",
      "hue": "Barwa",
      "saturation": "Nasycenie",
      "color": "Kolor",
      "luminosity": "Jasność"
    }
  },
  "vi": {
    "blend": {
      "hard-light": "Hard light",
      "soft-light": "Soft light",
      "difference": "Difference",
      "exclusion": "Exclusion",
      "hue": "Hue",
      "saturation": "Saturation",
      "color": "Color",
      "luminosity": "Luminosity"
    }
  },
  "th": {
    "blend": {
      "hard-light": "ฮาร์ดไลต์",
      "soft-light": "ซอฟต์ไลต์",
      "difference": "ต่าง",
      "exclusion": "ยกเว้น",
      "hue": "ฮิว",
      "saturation": "อิ่มสี",
      "color": "สี",
      "luminosity": "ความสว่าง"
    }
  },
  "id": {
    "blend": {
      "hard-light": "Hard light",
      "soft-light": "Soft light",
      "difference": "Difference",
      "exclusion": "Exclusion",
      "hue": "Hue",
      "saturation": "Saturation",
      "color": "Color",
      "luminosity": "Luminosity"
    }
  },
  "he": {
    "blend": {
      "hard-light": "אור קשה",
      "soft-light": "אור רך",
      "difference": "הפרש",
      "exclusion": "החרגה",
      "hue": "גוון",
      "saturation": "רוויה",
      "color": "צבע",
      "luminosity": "בהירות"
    }
  },
  "ms": {
    "blend": {
      "hard-light": "Hard light",
      "soft-light": "Soft light",
      "difference": "Difference",
      "exclusion": "Exclusion",
      "hue": "Hue",
      "saturation": "Saturation",
      "color": "Color",
      "luminosity": "Luminosity"
    }
  },
  "no": {
    "blend": {
      "hard-light": "Hardt lys",
      "soft-light": "Mykt lys",
      "difference": "Forskjell",
      "exclusion": "Ekskludering",
      "hue": "Fargetone",
      "saturation": "Metning",
      "color": "Farge",
      "luminosity": "Lysstyrke"
    }
  }
}
</i18n>
