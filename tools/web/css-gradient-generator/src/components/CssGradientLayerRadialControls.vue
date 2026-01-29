<template>
  <n-flex v-if="layerType === 'radial'" vertical :size="12">
    <div class="form-row">
      <div class="form-label">{{ t('shapeLabel') }}</div>
      <n-select v-model:value="layerShapeModel" :options="shapeOptions" />
    </div>
    <div class="form-row">
      <div class="form-label">{{ t('sizeLabel') }}</div>
      <n-select v-model:value="layerSizeModel" :options="sizeOptions" />
    </div>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { GradientType, RadialShape, RadialSize } from '../types'

const { t } = useI18n()

const props = defineProps<{
  layerType: GradientType
  layerShape: RadialShape
  layerSize: RadialSize
}>()

const emit = defineEmits<{
  (event: 'update:layerShape', value: RadialShape): void
  (event: 'update:layerSize', value: RadialSize): void
}>()

const layerShapeModel = computed({
  get: () => props.layerShape,
  set: (value: RadialShape) => emit('update:layerShape', value),
})

const layerSizeModel = computed({
  get: () => props.layerSize,
  set: (value: RadialSize) => emit('update:layerSize', value),
})

const shapeOptions = computed(() => [
  { label: t('shape.circle'), value: 'circle' },
  { label: t('shape.ellipse'), value: 'ellipse' },
])

const sizeOptions = computed(() => [
  { label: t('size.closest-side'), value: 'closest-side' },
  { label: t('size.closest-corner'), value: 'closest-corner' },
  { label: t('size.farthest-side'), value: 'farthest-side' },
  { label: t('size.farthest-corner'), value: 'farthest-corner' },
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
    "shapeLabel": "Shape",
    "sizeLabel": "Size",
    "shape": {
      "circle": "Circle",
      "ellipse": "Ellipse"
    },
    "size": {
      "closest-side": "Closest side",
      "closest-corner": "Closest corner",
      "farthest-side": "Farthest side",
      "farthest-corner": "Farthest corner"
    }
  },
  "zh": {
    "shapeLabel": "形状",
    "sizeLabel": "尺寸",
    "shape": {
      "circle": "圆形",
      "ellipse": "椭圆"
    },
    "size": {
      "closest-side": "最近边",
      "closest-corner": "最近角",
      "farthest-side": "最远边",
      "farthest-corner": "最远角"
    }
  },
  "zh-CN": {
    "shapeLabel": "形状",
    "sizeLabel": "尺寸",
    "shape": {
      "circle": "圆形",
      "ellipse": "椭圆"
    },
    "size": {
      "closest-side": "最近边",
      "closest-corner": "最近角",
      "farthest-side": "最远边",
      "farthest-corner": "最远角"
    }
  },
  "zh-TW": {
    "shapeLabel": "形狀",
    "sizeLabel": "尺寸",
    "shape": {
      "circle": "圓形",
      "ellipse": "橢圓"
    },
    "size": {
      "closest-side": "最近邊",
      "closest-corner": "最近角",
      "farthest-side": "最遠邊",
      "farthest-corner": "最遠角"
    }
  },
  "zh-HK": {
    "shapeLabel": "形狀",
    "sizeLabel": "尺寸",
    "shape": {
      "circle": "圓形",
      "ellipse": "橢圓"
    },
    "size": {
      "closest-side": "最近邊",
      "closest-corner": "最近角",
      "farthest-side": "最遠邊",
      "farthest-corner": "最遠角"
    }
  },
  "es": {
    "shapeLabel": "Forma",
    "sizeLabel": "Tamaño",
    "shape": {
      "circle": "Círculo",
      "ellipse": "Elipse"
    },
    "size": {
      "closest-side": "Lado más cercano",
      "closest-corner": "Esquina más cercana",
      "farthest-side": "Lado más lejano",
      "farthest-corner": "Esquina más lejana"
    }
  },
  "fr": {
    "shapeLabel": "Forme",
    "sizeLabel": "Taille",
    "shape": {
      "circle": "Cercle",
      "ellipse": "Ellipse"
    },
    "size": {
      "closest-side": "Côté le plus proche",
      "closest-corner": "Coin le plus proche",
      "farthest-side": "Côté le plus éloigné",
      "farthest-corner": "Coin le plus éloigné"
    }
  },
  "de": {
    "shapeLabel": "Form",
    "sizeLabel": "Größe",
    "shape": {
      "circle": "Kreis",
      "ellipse": "Ellipse"
    },
    "size": {
      "closest-side": "Nächste Seite",
      "closest-corner": "Nächste Ecke",
      "farthest-side": "Fernste Seite",
      "farthest-corner": "Fernste Ecke"
    }
  },
  "it": {
    "shapeLabel": "Forma",
    "sizeLabel": "Dimensione",
    "shape": {
      "circle": "Cerchio",
      "ellipse": "Ellisse"
    },
    "size": {
      "closest-side": "Lato più vicino",
      "closest-corner": "Angolo più vicino",
      "farthest-side": "Lato più lontano",
      "farthest-corner": "Angolo più lontano"
    }
  },
  "ja": {
    "shapeLabel": "形状",
    "sizeLabel": "サイズ",
    "shape": {
      "circle": "円",
      "ellipse": "楕円"
    },
    "size": {
      "closest-side": "最も近い辺",
      "closest-corner": "最も近い角",
      "farthest-side": "最も遠い辺",
      "farthest-corner": "最も遠い角"
    }
  },
  "ko": {
    "shapeLabel": "모양",
    "sizeLabel": "크기",
    "shape": {
      "circle": "원",
      "ellipse": "타원"
    },
    "size": {
      "closest-side": "가장 가까운 면",
      "closest-corner": "가장 가까운 모서리",
      "farthest-side": "가장 먼 면",
      "farthest-corner": "가장 먼 모서리"
    }
  },
  "ru": {
    "shapeLabel": "Форма",
    "sizeLabel": "Размер",
    "shape": {
      "circle": "Круг",
      "ellipse": "Эллипс"
    },
    "size": {
      "closest-side": "Ближайшая сторона",
      "closest-corner": "Ближайший угол",
      "farthest-side": "Самая дальняя сторона",
      "farthest-corner": "Самый дальний угол"
    }
  },
  "pt": {
    "shapeLabel": "Forma",
    "sizeLabel": "Tamanho",
    "shape": {
      "circle": "Círculo",
      "ellipse": "Elipse"
    },
    "size": {
      "closest-side": "Lado mais próximo",
      "closest-corner": "Canto mais próximo",
      "farthest-side": "Lado mais distante",
      "farthest-corner": "Canto mais distante"
    }
  },
  "ar": {
    "shapeLabel": "الشكل",
    "sizeLabel": "الحجم",
    "shape": {
      "circle": "دائري",
      "ellipse": "بيضاوي"
    },
    "size": {
      "closest-side": "أقرب جانب",
      "closest-corner": "أقرب زاوية",
      "farthest-side": "أبعد جانب",
      "farthest-corner": "أبعد زاوية"
    }
  },
  "hi": {
    "shapeLabel": "आकार",
    "sizeLabel": "आकार",
    "shape": {
      "circle": "वृत्त",
      "ellipse": "दीर्घवृत्त"
    },
    "size": {
      "closest-side": "सबसे नज़दीकी किनारा",
      "closest-corner": "सबसे नज़दीकी कोना",
      "farthest-side": "सबसे दूर किनारा",
      "farthest-corner": "सबसे दूर कोना"
    }
  },
  "tr": {
    "shapeLabel": "Şekil",
    "sizeLabel": "Boyut",
    "shape": {
      "circle": "Daire",
      "ellipse": "Elips"
    },
    "size": {
      "closest-side": "En yakın kenar",
      "closest-corner": "En yakın köşe",
      "farthest-side": "En uzak kenar",
      "farthest-corner": "En uzak köşe"
    }
  },
  "nl": {
    "shapeLabel": "Vorm",
    "sizeLabel": "Grootte",
    "shape": {
      "circle": "Cirkel",
      "ellipse": "Ellips"
    },
    "size": {
      "closest-side": "Dichtstbijzijnde zijde",
      "closest-corner": "Dichtstbijzijnde hoek",
      "farthest-side": "Verste zijde",
      "farthest-corner": "Verste hoek"
    }
  },
  "sv": {
    "shapeLabel": "Form",
    "sizeLabel": "Storlek",
    "shape": {
      "circle": "Cirkel",
      "ellipse": "Ellips"
    },
    "size": {
      "closest-side": "Närmaste sida",
      "closest-corner": "Närmaste hörn",
      "farthest-side": "Fjärraste sida",
      "farthest-corner": "Fjärraste hörn"
    }
  },
  "pl": {
    "shapeLabel": "Kształt",
    "sizeLabel": "Rozmiar",
    "shape": {
      "circle": "Koło",
      "ellipse": "Elipsa"
    },
    "size": {
      "closest-side": "Najbliższa krawędź",
      "closest-corner": "Najbliższy róg",
      "farthest-side": "Najdalsza krawędź",
      "farthest-corner": "Najdalszy róg"
    }
  },
  "vi": {
    "shapeLabel": "Hình dạng",
    "sizeLabel": "Kích thước",
    "shape": {
      "circle": "Tròn",
      "ellipse": "Elip"
    },
    "size": {
      "closest-side": "Cạnh gần nhất",
      "closest-corner": "Góc gần nhất",
      "farthest-side": "Cạnh xa nhất",
      "farthest-corner": "Góc xa nhất"
    }
  },
  "th": {
    "shapeLabel": "รูปทรง",
    "sizeLabel": "ขนาด",
    "shape": {
      "circle": "วงกลม",
      "ellipse": "วงรี"
    },
    "size": {
      "closest-side": "ด้านที่ใกล้ที่สุด",
      "closest-corner": "มุมที่ใกล้ที่สุด",
      "farthest-side": "ด้านที่ไกลที่สุด",
      "farthest-corner": "มุมที่ไกลที่สุด"
    }
  },
  "id": {
    "shapeLabel": "Bentuk",
    "sizeLabel": "Ukuran",
    "shape": {
      "circle": "Lingkaran",
      "ellipse": "Elips"
    },
    "size": {
      "closest-side": "Sisi terdekat",
      "closest-corner": "Sudut terdekat",
      "farthest-side": "Sisi terjauh",
      "farthest-corner": "Sudut terjauh"
    }
  },
  "he": {
    "shapeLabel": "צורה",
    "sizeLabel": "גודל",
    "shape": {
      "circle": "עיגול",
      "ellipse": "אליפסה"
    },
    "size": {
      "closest-side": "הצד הקרוב ביותר",
      "closest-corner": "הפינה הקרובה ביותר",
      "farthest-side": "הצד הרחוק ביותר",
      "farthest-corner": "הפינה הרחוקה ביותר"
    }
  },
  "ms": {
    "shapeLabel": "Bentuk",
    "sizeLabel": "Saiz",
    "shape": {
      "circle": "Bulatan",
      "ellipse": "Elips"
    },
    "size": {
      "closest-side": "Sisi terdekat",
      "closest-corner": "Bucu terdekat",
      "farthest-side": "Sisi terjauh",
      "farthest-corner": "Bucu terjauh"
    }
  },
  "no": {
    "shapeLabel": "Form",
    "sizeLabel": "Størrelse",
    "shape": {
      "circle": "Sirkel",
      "ellipse": "Ellipse"
    },
    "size": {
      "closest-side": "Nærmeste side",
      "closest-corner": "Nærmeste hjørne",
      "farthest-side": "Fjerneste side",
      "farthest-corner": "Fjerneste hjørne"
    }
  }
}
</i18n>
