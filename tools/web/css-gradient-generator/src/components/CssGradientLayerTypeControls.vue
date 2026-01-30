<template>
  <n-flex vertical :size="12">
    <div class="form-row">
      <div class="form-label">{{ t('gradientType') }}</div>
      <n-select v-model:value="layerTypeModel" :options="typeOptions" />
    </div>
    <div v-if="layerTypeModel !== 'radial'" class="form-row">
      <div class="form-label">{{ t('angle') }}</div>
      <n-input-number v-model:value="layerAngleModel" :min="0" :max="360" />
    </div>
    <div v-if="layerTypeModel !== 'linear'" class="form-row">
      <div class="form-label">{{ t('centerX') }}</div>
      <div class="form-controls">
        <n-slider v-model:value="layerCenterXModel" :min="0" :max="100" />
        <n-input-number v-model:value="layerCenterXModel" :min="0" :max="100" size="small" />
      </div>
    </div>
    <div v-if="layerTypeModel !== 'linear'" class="form-row">
      <div class="form-label">{{ t('centerY') }}</div>
      <div class="form-controls">
        <n-slider v-model:value="layerCenterYModel" :min="0" :max="100" />
        <n-input-number v-model:value="layerCenterYModel" :min="0" :max="100" size="small" />
      </div>
    </div>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NInputNumber, NSelect, NSlider } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { GradientType } from '../types'

const layerType = defineModel<GradientType>('layerType', { required: true })
const layerAngle = defineModel<number>('layerAngle', { required: true })
const layerCenterX = defineModel<number>('layerCenterX', { required: true })
const layerCenterY = defineModel<number>('layerCenterY', { required: true })

const { t } = useI18n()

const layerTypeModel = computed({
  get: () => layerType.value,
  set: (value: GradientType) => {
    layerType.value = value
  },
})

const layerAngleModel = computed({
  get: () => layerAngle.value,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    layerAngle.value = value
  },
})

const layerCenterXModel = computed({
  get: () => layerCenterX.value,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    layerCenterX.value = value
  },
})

const layerCenterYModel = computed({
  get: () => layerCenterY.value,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    layerCenterY.value = value
  },
})

const typeOptions = computed(() => [
  { label: t('type.linear'), value: 'linear' },
  { label: t('type.radial'), value: 'radial' },
  { label: t('type.conic'), value: 'conic' },
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

.form-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 220px;
}
</style>

<i18n lang="json">
{
  "en": {
    "gradientType": "Gradient type",
    "angle": "Angle",
    "centerX": "Center X",
    "centerY": "Center Y",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Conic"
    }
  },
  "zh": {
    "gradientType": "渐变类型",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "type": {
      "linear": "线性",
      "radial": "径向",
      "conic": "圆锥"
    }
  },
  "zh-CN": {
    "gradientType": "渐变类型",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "type": {
      "linear": "线性",
      "radial": "径向",
      "conic": "圆锥"
    }
  },
  "zh-TW": {
    "gradientType": "漸層類型",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "type": {
      "linear": "線性",
      "radial": "放射",
      "conic": "圓錐"
    }
  },
  "zh-HK": {
    "gradientType": "漸層類型",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "type": {
      "linear": "線性",
      "radial": "放射",
      "conic": "圓錐"
    }
  },
  "es": {
    "gradientType": "Tipo de gradiente",
    "angle": "Ángulo",
    "centerX": "Centro X",
    "centerY": "Centro Y",
    "type": {
      "linear": "Lineal",
      "radial": "Radial",
      "conic": "Cónico"
    }
  },
  "fr": {
    "gradientType": "Type de dégradé",
    "angle": "Angle",
    "centerX": "Centre X",
    "centerY": "Centre Y",
    "type": {
      "linear": "Linéaire",
      "radial": "Radial",
      "conic": "Conique"
    }
  },
  "de": {
    "gradientType": "Verlaufsart",
    "angle": "Winkel",
    "centerX": "Zentrum X",
    "centerY": "Zentrum Y",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konisch"
    }
  },
  "it": {
    "gradientType": "Tipo di gradiente",
    "angle": "Angolo",
    "centerX": "Centro X",
    "centerY": "Centro Y",
    "type": {
      "linear": "Lineare",
      "radial": "Radiale",
      "conic": "Conico"
    }
  },
  "ja": {
    "gradientType": "グラデーション種類",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "type": {
      "linear": "線形",
      "radial": "放射",
      "conic": "円錐"
    }
  },
  "ko": {
    "gradientType": "그라디언트 유형",
    "angle": "각도",
    "centerX": "중심 X",
    "centerY": "중심 Y",
    "type": {
      "linear": "선형",
      "radial": "방사형",
      "conic": "원뿔형"
    }
  },
  "ru": {
    "gradientType": "Тип градиента",
    "angle": "Угол",
    "centerX": "Центр X",
    "centerY": "Центр Y",
    "type": {
      "linear": "Линейный",
      "radial": "Радиальный",
      "conic": "Конический"
    }
  },
  "pt": {
    "gradientType": "Tipo de gradiente",
    "angle": "Ângulo",
    "centerX": "Centro X",
    "centerY": "Centro Y",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Cônico"
    }
  },
  "ar": {
    "gradientType": "نوع التدرج",
    "angle": "الزاوية",
    "centerX": "المركز X",
    "centerY": "المركز Y",
    "type": {
      "linear": "خطي",
      "radial": "شعاعي",
      "conic": "مخروطي"
    }
  },
  "hi": {
    "gradientType": "ग्रेडिएंट प्रकार",
    "angle": "कोण",
    "centerX": "केंद्र X",
    "centerY": "केंद्र Y",
    "type": {
      "linear": "रेखीय",
      "radial": "रेडियल",
      "conic": "कोनिक"
    }
  },
  "tr": {
    "gradientType": "Gradyan türü",
    "angle": "Açı",
    "centerX": "Merkez X",
    "centerY": "Merkez Y",
    "type": {
      "linear": "Doğrusal",
      "radial": "Radyal",
      "conic": "Konik"
    }
  },
  "nl": {
    "gradientType": "Gradienttype",
    "angle": "Hoek",
    "centerX": "Middelpunt X",
    "centerY": "Middelpunt Y",
    "type": {
      "linear": "Lineair",
      "radial": "Radiaal",
      "conic": "Conisch"
    }
  },
  "sv": {
    "gradientType": "Gradienttyp",
    "angle": "Vinkel",
    "centerX": "Center X",
    "centerY": "Center Y",
    "type": {
      "linear": "Linjär",
      "radial": "Radiell",
      "conic": "Konisk"
    }
  },
  "pl": {
    "gradientType": "Typ gradientu",
    "angle": "Kąt",
    "centerX": "Środek X",
    "centerY": "Środek Y",
    "type": {
      "linear": "Liniowy",
      "radial": "Radialny",
      "conic": "Stożkowy"
    }
  },
  "vi": {
    "gradientType": "Loại gradient",
    "angle": "Góc",
    "centerX": "Tâm X",
    "centerY": "Tâm Y",
    "type": {
      "linear": "Tuyến tính",
      "radial": "Xuyên tâm",
      "conic": "Hình nón"
    }
  },
  "th": {
    "gradientType": "ชนิดไล่สี",
    "angle": "มุม",
    "centerX": "ศูนย์กลาง X",
    "centerY": "ศูนย์กลาง Y",
    "type": {
      "linear": "เชิงเส้น",
      "radial": "รัศมี",
      "conic": "กรวย"
    }
  },
  "id": {
    "gradientType": "Jenis gradien",
    "angle": "Sudut",
    "centerX": "Pusat X",
    "centerY": "Pusat Y",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konik"
    }
  },
  "he": {
    "gradientType": "סוג גרדיאנט",
    "angle": "זווית",
    "centerX": "מרכז X",
    "centerY": "מרכז Y",
    "type": {
      "linear": "ליניארי",
      "radial": "רדיאלי",
      "conic": "קוני"
    }
  },
  "ms": {
    "gradientType": "Jenis gradien",
    "angle": "Sudut",
    "centerX": "Pusat X",
    "centerY": "Pusat Y",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konik"
    }
  },
  "no": {
    "gradientType": "Gradienttype",
    "angle": "Vinkel",
    "centerX": "Senter X",
    "centerY": "Senter Y",
    "type": {
      "linear": "Lineær",
      "radial": "Radial",
      "conic": "Konisk"
    }
  }
}
</i18n>
