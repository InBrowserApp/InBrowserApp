<template>
  <n-descriptions :column="1" bordered label-placement="left">
    <n-descriptions-item :label="t('length')">
      <n-text depth="3">{{ analysis.length }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('unique')">
      <n-text depth="3">{{ analysis.uniqueCount }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('character-sets')">
      <n-flex align="center" :size="6" wrap>
        <n-tag v-for="tag in characterTags" :key="tag" size="small">{{ tag }}</n-tag>
      </n-flex>
    </n-descriptions-item>
    <n-descriptions-item :label="t('crack-offline')">
      <n-text depth="3">{{ offlineTimeLabel }}</n-text>
    </n-descriptions-item>
    <n-descriptions-item :label="t('crack-online')">
      <n-text depth="3">{{ onlineTimeLabel }}</n-text>
    </n-descriptions-item>
  </n-descriptions>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { DurationDisplay, StrengthReport } from '../utils'

const { t } = useI18n()

const props = defineProps<{
  analysis: StrengthReport
}>()

const characterTags = computed(() => {
  const entries = [
    { label: 'a-z', enabled: props.analysis.composition.lower },
    { label: 'A-Z', enabled: props.analysis.composition.upper },
    { label: '0-9', enabled: props.analysis.composition.digit },
    { label: '#@$', enabled: props.analysis.composition.symbol },
  ]
  return entries.filter((entry) => entry.enabled).map((entry) => entry.label)
})

const offlineTimeLabel = computed(() => formatDurationLabel(props.analysis.crackTimes.offlineFast))

const onlineTimeLabel = computed(() =>
  formatDurationLabel(props.analysis.crackTimes.onlineThrottled),
)

function formatDurationLabel(duration: DurationDisplay): string {
  if (duration.isUnderSecond) return t('duration-under-second')
  return t('duration-format', {
    value: duration.value,
    // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
    unit: t(`unit.${duration.unit}`),
  })
}
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "length": "Length",
    "unique": "Unique characters",
    "character-sets": "Character sets",
    "crack-offline": "Crack time (offline, 1e10/s)",
    "crack-online": "Crack time (online, 100/s)",
    "duration-format": "About {value} {unit}",
    "duration-under-second": "Less than 1 second",
    "unit": {
      "seconds": "seconds",
      "minutes": "minutes",
      "hours": "hours",
      "days": "days",
      "months": "months",
      "years": "years"
    }
  },
  "zh": {
    "length": "长度",
    "unique": "唯一字符数",
    "character-sets": "字符集",
    "crack-offline": "破解时间（离线 1e10/秒）",
    "crack-online": "破解时间（在线 100/秒）",
    "duration-format": "约 {value} {unit}",
    "duration-under-second": "少于 1 秒",
    "unit": {
      "seconds": "秒",
      "minutes": "分钟",
      "hours": "小时",
      "days": "天",
      "months": "个月",
      "years": "年"
    }
  },
  "zh-CN": {
    "length": "长度",
    "unique": "唯一字符数",
    "character-sets": "字符集",
    "crack-offline": "破解时间（离线 1e10/秒）",
    "crack-online": "破解时间（在线 100/秒）",
    "duration-format": "约 {value} {unit}",
    "duration-under-second": "少于 1 秒",
    "unit": {
      "seconds": "秒",
      "minutes": "分钟",
      "hours": "小时",
      "days": "天",
      "months": "个月",
      "years": "年"
    }
  },
  "zh-TW": {
    "length": "長度",
    "unique": "唯一字元數",
    "character-sets": "字元集",
    "crack-offline": "破解時間（離線 1e10/秒）",
    "crack-online": "破解時間（線上 100/秒）",
    "duration-format": "約 {value} {unit}",
    "duration-under-second": "少於 1 秒",
    "unit": {
      "seconds": "秒",
      "minutes": "分鐘",
      "hours": "小時",
      "days": "天",
      "months": "個月",
      "years": "年"
    }
  },
  "zh-HK": {
    "length": "長度",
    "unique": "唯一字元數",
    "character-sets": "字元集",
    "crack-offline": "破解時間（離線 1e10/秒）",
    "crack-online": "破解時間（線上 100/秒）",
    "duration-format": "約 {value} {unit}",
    "duration-under-second": "少於 1 秒",
    "unit": {
      "seconds": "秒",
      "minutes": "分鐘",
      "hours": "小時",
      "days": "天",
      "months": "個月",
      "years": "年"
    }
  },
  "es": {
    "length": "Longitud",
    "unique": "Caracteres únicos",
    "character-sets": "Conjuntos de caracteres",
    "crack-offline": "Tiempo de ruptura (offline, 1e10/s)",
    "crack-online": "Tiempo de ruptura (online, 100/s)",
    "duration-format": "Aproximadamente {value} {unit}",
    "duration-under-second": "Menos de 1 segundo",
    "unit": {
      "seconds": "segundos",
      "minutes": "minutos",
      "hours": "horas",
      "days": "días",
      "months": "meses",
      "years": "años"
    }
  },
  "fr": {
    "length": "Longueur",
    "unique": "Caractères uniques",
    "character-sets": "Jeux de caractères",
    "crack-offline": "Temps de cassage (offline, 1e10/s)",
    "crack-online": "Temps de cassage (en ligne, 100/s)",
    "duration-format": "Environ {value} {unit}",
    "duration-under-second": "Moins d'une seconde",
    "unit": {
      "seconds": "secondes",
      "minutes": "minutes",
      "hours": "heures",
      "days": "jours",
      "months": "mois",
      "years": "années"
    }
  },
  "de": {
    "length": "Länge",
    "unique": "Eindeutige Zeichen",
    "character-sets": "Zeichensätze",
    "crack-offline": "Knackzeit (offline, 1e10/s)",
    "crack-online": "Knackzeit (online, 100/s)",
    "duration-format": "Etwa {value} {unit}",
    "duration-under-second": "Weniger als 1 Sekunde",
    "unit": {
      "seconds": "Sekunden",
      "minutes": "Minuten",
      "hours": "Stunden",
      "days": "Tage",
      "months": "Monate",
      "years": "Jahre"
    }
  },
  "it": {
    "length": "Lunghezza",
    "unique": "Caratteri unici",
    "character-sets": "Set di caratteri",
    "crack-offline": "Tempo di crack (offline, 1e10/s)",
    "crack-online": "Tempo di crack (online, 100/s)",
    "duration-format": "Circa {value} {unit}",
    "duration-under-second": "Meno di 1 secondo",
    "unit": {
      "seconds": "secondi",
      "minutes": "minuti",
      "hours": "ore",
      "days": "giorni",
      "months": "mesi",
      "years": "anni"
    }
  },
  "ja": {
    "length": "長さ",
    "unique": "ユニーク文字数",
    "character-sets": "文字種",
    "crack-offline": "解析時間（オフライン 1e10/秒）",
    "crack-online": "解析時間（オンライン 100/秒）",
    "duration-format": "約 {value} {unit}",
    "duration-under-second": "1 秒未満",
    "unit": {
      "seconds": "秒",
      "minutes": "分",
      "hours": "時間",
      "days": "日",
      "months": "か月",
      "years": "年"
    }
  },
  "ko": {
    "length": "길이",
    "unique": "고유 문자 수",
    "character-sets": "문자 집합",
    "crack-offline": "해독 시간(오프라인 1e10/초)",
    "crack-online": "해독 시간(온라인 100/초)",
    "duration-format": "약 {value} {unit}",
    "duration-under-second": "1초 미만",
    "unit": {
      "seconds": "초",
      "minutes": "분",
      "hours": "시간",
      "days": "일",
      "months": "개월",
      "years": "년"
    }
  },
  "ru": {
    "length": "Длина",
    "unique": "Уникальные символы",
    "character-sets": "Наборы символов",
    "crack-offline": "Время взлома (оффлайн, 1e10/с)",
    "crack-online": "Время взлома (онлайн, 100/с)",
    "duration-format": "Около {value} {unit}",
    "duration-under-second": "Меньше 1 секунды",
    "unit": {
      "seconds": "секунд",
      "minutes": "минут",
      "hours": "часов",
      "days": "дней",
      "months": "месяцев",
      "years": "лет"
    }
  },
  "pt": {
    "length": "Comprimento",
    "unique": "Caracteres únicos",
    "character-sets": "Conjuntos de caracteres",
    "crack-offline": "Tempo de quebra (offline, 1e10/s)",
    "crack-online": "Tempo de quebra (online, 100/s)",
    "duration-format": "Cerca de {value} {unit}",
    "duration-under-second": "Menos de 1 segundo",
    "unit": {
      "seconds": "segundos",
      "minutes": "minutos",
      "hours": "horas",
      "days": "dias",
      "months": "meses",
      "years": "anos"
    }
  },
  "ar": {
    "length": "الطول",
    "unique": "حروف فريدة",
    "character-sets": "مجموعات الأحرف",
    "crack-offline": "زمن الكسر (غير متصل 1e10/ث)",
    "crack-online": "زمن الكسر (متصل 100/ث)",
    "duration-format": "حوالي {value} {unit}",
    "duration-under-second": "أقل من ثانية واحدة",
    "unit": {
      "seconds": "ثوانٍ",
      "minutes": "دقائق",
      "hours": "ساعات",
      "days": "أيام",
      "months": "أشهر",
      "years": "سنوات"
    }
  },
  "hi": {
    "length": "लंबाई",
    "unique": "अद्वितीय अक्षर",
    "character-sets": "करेक्टर सेट",
    "crack-offline": "क्रैक समय (ऑफलाइन 1e10/से)",
    "crack-online": "क्रैक समय (ऑनलाइन 100/से)",
    "duration-format": "लगभग {value} {unit}",
    "duration-under-second": "1 सेकंड से कम",
    "unit": {
      "seconds": "सेकंड",
      "minutes": "मिनट",
      "hours": "घंटे",
      "days": "दिन",
      "months": "महीने",
      "years": "वर्ष"
    }
  },
  "tr": {
    "length": "Uzunluk",
    "unique": "Benzersiz karakterler",
    "character-sets": "Karakter kümeleri",
    "crack-offline": "Kırma süresi (offline, 1e10/sn)",
    "crack-online": "Kırma süresi (online, 100/sn)",
    "duration-format": "Yaklaşık {value} {unit}",
    "duration-under-second": "1 saniyeden kısa",
    "unit": {
      "seconds": "saniye",
      "minutes": "dakika",
      "hours": "saat",
      "days": "gün",
      "months": "ay",
      "years": "yıl"
    }
  },
  "nl": {
    "length": "Lengte",
    "unique": "Unieke tekens",
    "character-sets": "Tekensets",
    "crack-offline": "Kraaktijd (offline, 1e10/s)",
    "crack-online": "Kraaktijd (online, 100/s)",
    "duration-format": "Ongeveer {value} {unit}",
    "duration-under-second": "Minder dan 1 seconde",
    "unit": {
      "seconds": "seconden",
      "minutes": "minuten",
      "hours": "uur",
      "days": "dagen",
      "months": "maanden",
      "years": "jaar"
    }
  },
  "sv": {
    "length": "Längd",
    "unique": "Unika tecken",
    "character-sets": "Teckenuppsättningar",
    "crack-offline": "Knäckningstid (offline, 1e10/s)",
    "crack-online": "Knäckningstid (online, 100/s)",
    "duration-format": "Cirka {value} {unit}",
    "duration-under-second": "Mindre än 1 sekund",
    "unit": {
      "seconds": "sekunder",
      "minutes": "minuter",
      "hours": "timmar",
      "days": "dagar",
      "months": "månader",
      "years": "år"
    }
  },
  "pl": {
    "length": "Długość",
    "unique": "Unikalne znaki",
    "character-sets": "Zestawy znaków",
    "crack-offline": "Czas złamania (offline, 1e10/s)",
    "crack-online": "Czas złamania (online, 100/s)",
    "duration-format": "Około {value} {unit}",
    "duration-under-second": "Mniej niż 1 sekunda",
    "unit": {
      "seconds": "sekund",
      "minutes": "minut",
      "hours": "godzin",
      "days": "dni",
      "months": "miesięcy",
      "years": "lat"
    }
  },
  "vi": {
    "length": "Độ dài",
    "unique": "Ký tự duy nhất",
    "character-sets": "Tập ký tự",
    "crack-offline": "Thời gian bẻ (offline, 1e10/s)",
    "crack-online": "Thời gian bẻ (online, 100/s)",
    "duration-format": "Khoảng {value} {unit}",
    "duration-under-second": "Nhỏ hơn 1 giây",
    "unit": {
      "seconds": "giây",
      "minutes": "phút",
      "hours": "giờ",
      "days": "ngày",
      "months": "tháng",
      "years": "năm"
    }
  },
  "th": {
    "length": "ความยาว",
    "unique": "อักขระไม่ซ้ำ",
    "character-sets": "ชุดอักขระ",
    "crack-offline": "เวลาแคร็ก (ออฟไลน์ 1e10/วินาที)",
    "crack-online": "เวลาแคร็ก (ออนไลน์ 100/วินาที)",
    "duration-format": "ประมาณ {value} {unit}",
    "duration-under-second": "น้อยกว่า 1 วินาที",
    "unit": {
      "seconds": "วินาที",
      "minutes": "นาที",
      "hours": "ชั่วโมง",
      "days": "วัน",
      "months": "เดือน",
      "years": "ปี"
    }
  },
  "id": {
    "length": "Panjang",
    "unique": "Karakter unik",
    "character-sets": "Set karakter",
    "crack-offline": "Waktu pecah (offline, 1e10/detik)",
    "crack-online": "Waktu pecah (online, 100/detik)",
    "duration-format": "Sekitar {value} {unit}",
    "duration-under-second": "Kurang dari 1 detik",
    "unit": {
      "seconds": "detik",
      "minutes": "menit",
      "hours": "jam",
      "days": "hari",
      "months": "bulan",
      "years": "tahun"
    }
  },
  "he": {
    "length": "אורך",
    "unique": "תווים ייחודיים",
    "character-sets": "קבוצות תווים",
    "crack-offline": "זמן פיצוח (אופליין, 1e10/שניה)",
    "crack-online": "זמן פיצוח (אונליין, 100/שניה)",
    "duration-format": "בערך {value} {unit}",
    "duration-under-second": "פחות משנייה אחת",
    "unit": {
      "seconds": "שניות",
      "minutes": "דקות",
      "hours": "שעות",
      "days": "ימים",
      "months": "חודשים",
      "years": "שנים"
    }
  },
  "ms": {
    "length": "Panjang",
    "unique": "Aksara unik",
    "character-sets": "Set aksara",
    "crack-offline": "Masa pecah (offline, 1e10/s)",
    "crack-online": "Masa pecah (online, 100/s)",
    "duration-format": "Kira-kira {value} {unit}",
    "duration-under-second": "Kurang daripada 1 saat",
    "unit": {
      "seconds": "saat",
      "minutes": "minit",
      "hours": "jam",
      "days": "hari",
      "months": "bulan",
      "years": "tahun"
    }
  },
  "no": {
    "length": "Lengde",
    "unique": "Unike tegn",
    "character-sets": "Tegnsett",
    "crack-offline": "Knekktid (offline, 1e10/s)",
    "crack-online": "Knekktid (online, 100/s)",
    "duration-format": "Omtrent {value} {unit}",
    "duration-under-second": "Mindre enn 1 sekund",
    "unit": {
      "seconds": "sekunder",
      "minutes": "minutter",
      "hours": "timer",
      "days": "dager",
      "months": "måneder",
      "years": "år"
    }
  }
}
</i18n>
