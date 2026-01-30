<template>
  <n-card class="panel">
    <div class="panel__header">
      <div>
        <div class="panel__title">{{ t('presetsTitle') }}</div>
        <div class="panel__subtitle">{{ t('presetsSubtitle') }}</div>
      </div>
    </div>
    <n-grid cols="2 s:3" :x-gap="8" :y-gap="8" responsive="screen">
      <n-gi v-for="preset in presets" :key="preset.id">
        <n-button
          size="small"
          quaternary
          class="preset-button"
          :data-testid="`preset-${preset.id}`"
          @click="handleApplyPreset(preset.id)"
        >
          <n-flex align="center" :size="12" :wrap="false">
            <span
              class="preset-swatch"
              :style="presetSwatchStyleMap[preset.id]"
              aria-hidden="true"
            />
            <span class="preset-label">{{ presetLabelMap[preset.id] ?? preset.id }}</span>
          </n-flex>
        </n-button>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NCard, NFlex, NGi, NGrid } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { GradientPreset } from '../utils/presets'

defineProps<{
  presets: GradientPreset[]
  presetSwatchStyleMap: Record<string, Record<string, string>>
}>()

const emit = defineEmits<{
  (event: 'apply-preset', id: string): void
}>()

const { t } = useI18n()

const presetLabelMap = computed<Record<string, string>>(() => ({
  aurora: t('preset.aurora'),
  sunset: t('preset.sunset'),
  ocean: t('preset.ocean'),
  neon: t('preset.neon'),
  dawn: t('preset.dawn'),
  citrus: t('preset.citrus'),
}))

function handleApplyPreset(id: string) {
  emit('apply-preset', id)
}
</script>

<style scoped>
.preset-button {
  width: 100%;
  justify-content: center;
  gap: 12px;
}

.preset-swatch {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}
</style>

<i18n lang="json">
{
  "en": {
    "presetsTitle": "Presets",
    "presetsSubtitle": "Pick a polished starting point.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Sunset Wash",
      "ocean": "Ocean Depth",
      "neon": "Neon Mist",
      "dawn": "Soft Dawn",
      "citrus": "Citrus Glow"
    }
  },
  "zh": {
    "presetsTitle": "预设",
    "presetsSubtitle": "选择一个精心调校的起点。",
    "preset": {
      "aurora": "极光",
      "sunset": "日落薄雾",
      "ocean": "深海",
      "neon": "霓虹薄雾",
      "dawn": "柔和晨曦",
      "citrus": "柑橘光"
    }
  },
  "zh-CN": {
    "presetsTitle": "预设",
    "presetsSubtitle": "选择一个精心调校的起点。",
    "preset": {
      "aurora": "极光",
      "sunset": "日落薄雾",
      "ocean": "深海",
      "neon": "霓虹薄雾",
      "dawn": "柔和晨曦",
      "citrus": "柑橘光"
    }
  },
  "zh-TW": {
    "presetsTitle": "預設",
    "presetsSubtitle": "選擇一個精緻的起點。",
    "preset": {
      "aurora": "極光",
      "sunset": "日落薄霧",
      "ocean": "深海",
      "neon": "霓虹薄霧",
      "dawn": "柔和晨曦",
      "citrus": "柑橘光"
    }
  },
  "zh-HK": {
    "presetsTitle": "預設",
    "presetsSubtitle": "選擇一個精緻的起點。",
    "preset": {
      "aurora": "極光",
      "sunset": "日落薄霧",
      "ocean": "深海",
      "neon": "霓虹薄霧",
      "dawn": "柔和晨曦",
      "citrus": "柑橘光"
    }
  },
  "es": {
    "presetsTitle": "Preajustes",
    "presetsSubtitle": "Elige un punto de partida pulido.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Lavado del atardecer",
      "ocean": "Profundidad oceánica",
      "neon": "Niebla neón",
      "dawn": "Amanecer suave",
      "citrus": "Brillo cítrico"
    }
  },
  "fr": {
    "presetsTitle": "Préréglages",
    "presetsSubtitle": "Choisissez un point de départ soigné.",
    "preset": {
      "aurora": "Aurore",
      "sunset": "Lavage du coucher",
      "ocean": "Profondeur océanique",
      "neon": "Brume néon",
      "dawn": "Aube douce",
      "citrus": "Lueur citronnée"
    }
  },
  "de": {
    "presetsTitle": "Presets",
    "presetsSubtitle": "Wählen Sie einen hochwertigen Ausgangspunkt.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Sonnenuntergang",
      "ocean": "Ozeantiefe",
      "neon": "Neonnebel",
      "dawn": "Sanfte Morgendämmerung",
      "citrus": "Zitrusglühen"
    }
  },
  "it": {
    "presetsTitle": "Preset",
    "presetsSubtitle": "Scegli un punto di partenza raffinato.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Tramonto",
      "ocean": "Profondità oceanica",
      "neon": "Nebbia neon",
      "dawn": "Alba morbida",
      "citrus": "Bagliore agrumato"
    }
  },
  "ja": {
    "presetsTitle": "プリセット",
    "presetsSubtitle": "洗練された出発点を選択します。",
    "preset": {
      "aurora": "オーロラ",
      "sunset": "夕焼け",
      "ocean": "オーシャン",
      "neon": "ネオンミスト",
      "dawn": "ソフトドーン",
      "citrus": "シトラスグロー"
    }
  },
  "ko": {
    "presetsTitle": "프리셋",
    "presetsSubtitle": "완성된 시작점을 선택하세요.",
    "preset": {
      "aurora": "오로라",
      "sunset": "노을",
      "ocean": "오션",
      "neon": "네온 미스트",
      "dawn": "부드러운 새벽",
      "citrus": "시트러스 글로우"
    }
  },
  "ru": {
    "presetsTitle": "Пресеты",
    "presetsSubtitle": "Выберите готовую отправную точку.",
    "preset": {
      "aurora": "Аврора",
      "sunset": "Закат",
      "ocean": "Глубины океана",
      "neon": "Неоновый туман",
      "dawn": "Мягкий рассвет",
      "citrus": "Цитрусовое сияние"
    }
  },
  "pt": {
    "presetsTitle": "Predefinições",
    "presetsSubtitle": "Escolha um ponto de partida refinado.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Lavado do pôr do sol",
      "ocean": "Profundidade oceânica",
      "neon": "Néon",
      "dawn": "Amanhecer suave",
      "citrus": "Brilho cítrico"
    }
  },
  "ar": {
    "presetsTitle": "قوالب",
    "presetsSubtitle": "اختر نقطة بداية مصقولة.",
    "preset": {
      "aurora": "أورورا",
      "sunset": "غسق",
      "ocean": "عمق المحيط",
      "neon": "ضباب نيون",
      "dawn": "فجر ناعم",
      "citrus": "توهج الحمضيات"
    }
  },
  "hi": {
    "presetsTitle": "प्रीसेट",
    "presetsSubtitle": "एक सजा हुआ शुरुआती बिंदु चुनें।",
    "preset": {
      "aurora": "ऑरोरा",
      "sunset": "सनसेट वॉश",
      "ocean": "ओशन डेप्थ",
      "neon": "निऑन मिस्ट",
      "dawn": "सॉफ्ट डॉन",
      "citrus": "सिट्रस ग्लो"
    }
  },
  "tr": {
    "presetsTitle": "Ön ayarlar",
    "presetsSubtitle": "Parlak bir başlangıç seçin.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Gün batımı",
      "ocean": "Okyanus derinliği",
      "neon": "Neon sis",
      "dawn": "Yumuşak şafak",
      "citrus": "Narenciye parıltısı"
    }
  },
  "nl": {
    "presetsTitle": "Presets",
    "presetsSubtitle": "Kies een gepolijst startpunt.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Zonsondergang",
      "ocean": "Oceaan diepte",
      "neon": "Neon mist",
      "dawn": "Zachte dageraad",
      "citrus": "Citrusglans"
    }
  },
  "sv": {
    "presetsTitle": "Förval",
    "presetsSubtitle": "Välj en snygg startpunkt.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Solnedgång",
      "ocean": "Havsdepth",
      "neon": "Neondimma",
      "dawn": "Mjuk gryning",
      "citrus": "Citrusglöd"
    }
  },
  "pl": {
    "presetsTitle": "Presetty",
    "presetsSubtitle": "Wybierz dopracowany punkt startowy.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Zachód słońca",
      "ocean": "Głębia oceanu",
      "neon": "Neonowa mgła",
      "dawn": "Miękki świt",
      "citrus": "Cytrusowy blask"
    }
  },
  "vi": {
    "presetsTitle": "Mẫu",
    "presetsSubtitle": "Chọn một điểm bắt đầu đã được tinh chỉnh.",
    "preset": {
      "aurora": "Cực quang",
      "sunset": "Hoàng hôn",
      "ocean": "Độ sâu đại dương",
      "neon": "Sương neon",
      "dawn": "Bình minh nhẹ",
      "citrus": "Ánh cam quýt"
    }
  },
  "th": {
    "presetsTitle": "พรีเซ็ต",
    "presetsSubtitle": "เลือกจุดเริ่มต้นที่ถูกจัดมาอย่างดี",
    "preset": {
      "aurora": "ออโรรา",
      "sunset": "แสงยามเย็น",
      "ocean": "ความลึกของทะเล",
      "neon": "หมอกนีออน",
      "dawn": "รุ่งอรุณนุ่ม",
      "citrus": "ประกายซิตรัส"
    }
  },
  "id": {
    "presetsTitle": "Preset",
    "presetsSubtitle": "Pilih titik awal yang sudah dipoles.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Senja",
      "ocean": "Kedalaman laut",
      "neon": "Kabut neon",
      "dawn": "Fajar lembut",
      "citrus": "Kilau sitrus"
    }
  },
  "he": {
    "presetsTitle": "ערכות מוכנות",
    "presetsSubtitle": "בחרו נקודת התחלה מלוטשת.",
    "preset": {
      "aurora": "אורורה",
      "sunset": "שקיעה",
      "ocean": "עומק הים",
      "neon": "ערפל ניאון",
      "dawn": "שחר רך",
      "citrus": "זוהר הדרים"
    }
  },
  "ms": {
    "presetsTitle": "Pratetap",
    "presetsSubtitle": "Pilih titik mula yang kemas.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Senja",
      "ocean": "Kedalaman laut",
      "neon": "Kabut neon",
      "dawn": "Fajar lembut",
      "citrus": "Cahaya sitrus"
    }
  },
  "no": {
    "presetsTitle": "Forvalg",
    "presetsSubtitle": "Velg et polert utgangspunkt.",
    "preset": {
      "aurora": "Aurora",
      "sunset": "Solnedgang",
      "ocean": "Havdybde",
      "neon": "Neontåke",
      "dawn": "Myk daggry",
      "citrus": "Sitrusglød"
    }
  }
}
</i18n>
