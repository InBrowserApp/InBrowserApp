<template>
  <span class="blend-options" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlendMode } from '../types'

const { t } = useI18n()

const options = computed<{ label: string; value: BlendMode }[]>(() => [
  { label: t('blend.normal'), value: 'normal' },
  { label: t('blend.multiply'), value: 'multiply' },
  { label: t('blend.screen'), value: 'screen' },
  { label: t('blend.overlay'), value: 'overlay' },
  { label: t('blend.darken'), value: 'darken' },
  { label: t('blend.lighten'), value: 'lighten' },
  { label: t('blend.color-dodge'), value: 'color-dodge' },
  { label: t('blend.color-burn'), value: 'color-burn' },
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
      "normal": "Normal",
      "multiply": "Multiply",
      "screen": "Screen",
      "overlay": "Overlay",
      "darken": "Darken",
      "lighten": "Lighten",
      "color-dodge": "Color dodge",
      "color-burn": "Color burn"
    }
  },
  "zh": {
    "blend": {
      "normal": "正常",
      "multiply": "正片叠底",
      "screen": "滤色",
      "overlay": "叠加",
      "darken": "变暗",
      "lighten": "变亮",
      "color-dodge": "颜色减淡",
      "color-burn": "颜色加深"
    }
  },
  "zh-CN": {
    "blend": {
      "normal": "正常",
      "multiply": "正片叠底",
      "screen": "滤色",
      "overlay": "叠加",
      "darken": "变暗",
      "lighten": "变亮",
      "color-dodge": "颜色减淡",
      "color-burn": "颜色加深"
    }
  },
  "zh-TW": {
    "blend": {
      "normal": "正常",
      "multiply": "正片疊底",
      "screen": "濾色",
      "overlay": "疊加",
      "darken": "變暗",
      "lighten": "變亮",
      "color-dodge": "顏色減淡",
      "color-burn": "顏色加深"
    }
  },
  "zh-HK": {
    "blend": {
      "normal": "正常",
      "multiply": "正片疊底",
      "screen": "濾色",
      "overlay": "疊加",
      "darken": "變暗",
      "lighten": "變亮",
      "color-dodge": "顏色減淡",
      "color-burn": "顏色加深"
    }
  },
  "es": {
    "blend": {
      "normal": "Normal",
      "multiply": "Multiplicar",
      "screen": "Trama",
      "overlay": "Superponer",
      "darken": "Oscurecer",
      "lighten": "Aclarar",
      "color-dodge": "Sobreexponer",
      "color-burn": "Subexponer"
    }
  },
  "fr": {
    "blend": {
      "normal": "Normal",
      "multiply": "Produit",
      "screen": "Superposition",
      "overlay": "Incrustation",
      "darken": "Assombrir",
      "lighten": "Éclaircir",
      "color-dodge": "Densité couleur -",
      "color-burn": "Densité couleur +"
    }
  },
  "de": {
    "blend": {
      "normal": "Normal",
      "multiply": "Multiplizieren",
      "screen": "Negativ multiplizieren",
      "overlay": "Überlagern",
      "darken": "Abdunkeln",
      "lighten": "Aufhellen",
      "color-dodge": "Farbig abwedeln",
      "color-burn": "Farbig nachbelichten"
    }
  },
  "it": {
    "blend": {
      "normal": "Normale",
      "multiply": "Moltiplica",
      "screen": "Scherma",
      "overlay": "Sovrapponi",
      "darken": "Scurisci",
      "lighten": "Schiarisci",
      "color-dodge": "Scherma colore",
      "color-burn": "Brucia colore"
    }
  },
  "ja": {
    "blend": {
      "normal": "通常",
      "multiply": "乗算",
      "screen": "スクリーン",
      "overlay": "オーバーレイ",
      "darken": "比較（暗）",
      "lighten": "比較（明）",
      "color-dodge": "覆い焼き（カラー）",
      "color-burn": "焼き込み（カラー）"
    }
  },
  "ko": {
    "blend": {
      "normal": "일반",
      "multiply": "곱하기",
      "screen": "스크린",
      "overlay": "오버레이",
      "darken": "어둡게",
      "lighten": "밝게",
      "color-dodge": "색상 닷지",
      "color-burn": "색상 번"
    }
  },
  "ru": {
    "blend": {
      "normal": "Нормальный",
      "multiply": "Умножение",
      "screen": "Экран",
      "overlay": "Перекрытие",
      "darken": "Затемнение",
      "lighten": "Осветление",
      "color-dodge": "Осветление основы",
      "color-burn": "Затемнение основы"
    }
  },
  "pt": {
    "blend": {
      "normal": "Normal",
      "multiply": "Multiplicar",
      "screen": "Tela",
      "overlay": "Sobrepor",
      "darken": "Escurecer",
      "lighten": "Clarear",
      "color-dodge": "Subexposição de cor",
      "color-burn": "Superexposição de cor"
    }
  },
  "ar": {
    "blend": {
      "normal": "عادي",
      "multiply": "ضرب",
      "screen": "شاشة",
      "overlay": "تراكب",
      "darken": "تغميق",
      "lighten": "تفتيح",
      "color-dodge": "تفتيح اللون",
      "color-burn": "حرق اللون"
    }
  },
  "hi": {
    "blend": {
      "normal": "सामान्य",
      "multiply": "गुणा",
      "screen": "स्क्रीन",
      "overlay": "ओवरले",
      "darken": "गहरा",
      "lighten": "हल्का",
      "color-dodge": "कलर डॉज",
      "color-burn": "कलर बर्न"
    }
  },
  "tr": {
    "blend": {
      "normal": "Normal",
      "multiply": "Çarp",
      "screen": "Ekran",
      "overlay": "Kaplama",
      "darken": "Koyulaştır",
      "lighten": "Aydınlat",
      "color-dodge": "Renk açma",
      "color-burn": "Renk yakma"
    }
  },
  "nl": {
    "blend": {
      "normal": "Normaal",
      "multiply": "Vermenigvuldigen",
      "screen": "Scherm",
      "overlay": "Overlay",
      "darken": "Donkerder",
      "lighten": "Lichter",
      "color-dodge": "Kleur tegenhouden",
      "color-burn": "Kleur doordrukken"
    }
  },
  "sv": {
    "blend": {
      "normal": "Normal",
      "multiply": "Multiplicera",
      "screen": "Skärm",
      "overlay": "Överlagra",
      "darken": "Mörkare",
      "lighten": "Ljusa upp",
      "color-dodge": "Färgskärm",
      "color-burn": "Färgbränna"
    }
  },
  "pl": {
    "blend": {
      "normal": "Normalny",
      "multiply": "Mnożenie",
      "screen": "Ekran",
      "overlay": "Nakładka",
      "darken": "Przyciemnianie",
      "lighten": "Rozjaśnianie",
      "color-dodge": "Rozjaśnianie koloru",
      "color-burn": "Przyciemnianie koloru"
    }
  },
  "vi": {
    "blend": {
      "normal": "Bình thường",
      "multiply": "Nhân",
      "screen": "Screen",
      "overlay": "Overlay",
      "darken": "Tối",
      "lighten": "Sáng",
      "color-dodge": "Color dodge",
      "color-burn": "Color burn"
    }
  },
  "th": {
    "blend": {
      "normal": "ปกติ",
      "multiply": "คูณ",
      "screen": "สกรีน",
      "overlay": "โอเวอร์เลย์",
      "darken": "มืด",
      "lighten": "สว่าง",
      "color-dodge": "คัลเลอร์ดอดจ์",
      "color-burn": "คัลเลอร์เบิร์น"
    }
  },
  "id": {
    "blend": {
      "normal": "Normal",
      "multiply": "Multiply",
      "screen": "Screen",
      "overlay": "Overlay",
      "darken": "Darken",
      "lighten": "Lighten",
      "color-dodge": "Color dodge",
      "color-burn": "Color burn"
    }
  },
  "he": {
    "blend": {
      "normal": "רגיל",
      "multiply": "כפל",
      "screen": "מסך",
      "overlay": "כיסוי",
      "darken": "כהה",
      "lighten": "בהיר",
      "color-dodge": "דודג' צבע",
      "color-burn": "ברן צבע"
    }
  },
  "ms": {
    "blend": {
      "normal": "Normal",
      "multiply": "Multiply",
      "screen": "Screen",
      "overlay": "Overlay",
      "darken": "Gelapkan",
      "lighten": "Terangkan",
      "color-dodge": "Color dodge",
      "color-burn": "Color burn"
    }
  },
  "no": {
    "blend": {
      "normal": "Normal",
      "multiply": "Multipliser",
      "screen": "Skjerm",
      "overlay": "Overlegg",
      "darken": "Mørkere",
      "lighten": "Lysere",
      "color-dodge": "Farge dodge",
      "color-burn": "Farge burn"
    }
  }
}
</i18n>
