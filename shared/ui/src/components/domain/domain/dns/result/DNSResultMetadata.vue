<template>
  <n-space>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-tag
          round
          :bordered="false"
          :type="props.result.Status === 0 ? 'success' : 'error'"
          size="small"
        >
          {{ DNSRCODEs?.[props.result.Status]?.name ?? t('common.unknown') }}
          <template #icon>
            <n-icon :component="props.result.Status === 0 ? CheckmarkCircle : CloseCircle" />
          </template>
        </n-tag>
      </template>
      <DNSRCODEDescription :rcode="props.result.Status" />
    </n-tooltip>

    <span v-for="info in tagsInfo" :key="info.key">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-tag round :bordered="false" :type="info.value ? 'success' : 'error'" size="small">
            {{ info.label }}
            <template #icon>
              <n-icon :component="info.value ? CheckmarkCircle : CloseCircle" />
            </template>
          </n-tag>
        </template>
        {{ info.description }}
      </n-tooltip>
    </span>
  </n-space>
</template>

<script lang="ts" setup>
import type { DNSJSONResponse } from '@utils/dns'
import { NSpace, NTag, NIcon, NTooltip } from 'naive-ui'
import CheckmarkCircle from '@vicons/ionicons5/CheckmarkCircle'
import CloseCircle from '@vicons/ionicons5/CloseCircle'
import { computed } from 'vue'
import { DNSRCODEs } from '@utils/dns'
import { useI18n } from 'vue-i18n'
import DNSRCODEDescription from './DNSRCODEDescription.vue'

const props = defineProps<{
  result: DNSJSONResponse
}>()

const { t } = useI18n()

const tagsInfo = computed(() => [
  {
    label: 'TC',
    description: t('dns.flags.tc'),
    key: 'TC',
    value: props.result.TC,
  },
  {
    label: 'RD',
    description: t('dns.flags.rd'),
    key: 'RD',
    value: props.result.RD,
  },
  {
    label: 'RA',
    description: t('dns.flags.ra'),
    key: 'RA',
    value: props.result.RA,
  },
  {
    label: 'AD',
    description: t('dns.flags.ad'),
    key: 'AD',
    value: props.result.AD,
  },
  {
    label: 'CD',
    description: t('dns.flags.cd'),
    key: 'CD',
    value: props.result.CD,
  },
])
</script>

<i18n lang="json">
{
  "en": {
    "dns": {
      "flags": {
        "tc": "Truncated Response",
        "rd": "Recursion Desired",
        "ra": "Recursion Available",
        "ad": "Authentic Data (DNSSEC)",
        "cd": "Checking Disabled (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Unknown"
    }
  },
  "zh": {
    "dns": {
      "flags": {
        "tc": "截断响应",
        "rd": "递归期望",
        "ra": "递归可用",
        "ad": "真实数据 (DNSSEC)",
        "cd": "检查禁用 (DNSSEC)"
      }
    },
    "common": {
      "unknown": "未知"
    }
  },
  "zh-CN": {
    "dns": {
      "flags": {
        "tc": "截断响应",
        "rd": "递归期望",
        "ra": "递归可用",
        "ad": "真实数据 (DNSSEC)",
        "cd": "检查禁用 (DNSSEC)"
      }
    },
    "common": {
      "unknown": "未知"
    }
  },
  "zh-TW": {
    "dns": {
      "flags": {
        "tc": "截斷回應",
        "rd": "遞迴期望",
        "ra": "遞迴可用",
        "ad": "真實資料 (DNSSEC)",
        "cd": "檢查停用 (DNSSEC)"
      }
    },
    "common": {
      "unknown": "未知"
    }
  },
  "zh-HK": {
    "dns": {
      "flags": {
        "tc": "截斷回應",
        "rd": "遞迴期望",
        "ra": "遞迴可用",
        "ad": "真實資料 (DNSSEC)",
        "cd": "檢查停用 (DNSSEC)"
      }
    },
    "common": {
      "unknown": "未知"
    }
  },
  "es": {
    "dns": {
      "flags": {
        "tc": "Respuesta Truncada",
        "rd": "Recursión Deseada",
        "ra": "Recursión Disponible",
        "ad": "Datos Auténticos (DNSSEC)",
        "cd": "Comprobación Deshabilitada (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Desconocido"
    }
  },
  "fr": {
    "dns": {
      "flags": {
        "tc": "Réponse Tronquée",
        "rd": "Récursion Souhaitée",
        "ra": "Récursion Disponible",
        "ad": "Données Authentiques (DNSSEC)",
        "cd": "Vérification Désactivée (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Inconnu"
    }
  },
  "de": {
    "dns": {
      "flags": {
        "tc": "Gekürzte Antwort",
        "rd": "Rekursion Gewünscht",
        "ra": "Rekursion Verfügbar",
        "ad": "Authentische Daten (DNSSEC)",
        "cd": "Prüfung Deaktiviert (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Unbekannt"
    }
  },
  "it": {
    "dns": {
      "flags": {
        "tc": "Risposta Troncata",
        "rd": "Ricorsione Desiderata",
        "ra": "Ricorsione Disponibile",
        "ad": "Dati Autentici (DNSSEC)",
        "cd": "Controllo Disabilitato (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Sconosciuto"
    }
  },
  "ja": {
    "dns": {
      "flags": {
        "tc": "切り詰められた応答",
        "rd": "再帰希望",
        "ra": "再帰利用可能",
        "ad": "認証済みデータ (DNSSEC)",
        "cd": "チェック無効 (DNSSEC)"
      }
    },
    "common": {
      "unknown": "不明"
    }
  },
  "ko": {
    "dns": {
      "flags": {
        "tc": "잘린 응답",
        "rd": "재귀 요구",
        "ra": "재귀 사용 가능",
        "ad": "인증된 데이터 (DNSSEC)",
        "cd": "검사 비활성화 (DNSSEC)"
      }
    },
    "common": {
      "unknown": "알 수 없음"
    }
  },
  "ru": {
    "dns": {
      "flags": {
        "tc": "Усеченный Ответ",
        "rd": "Рекурсия Желательна",
        "ra": "Рекурсия Доступна",
        "ad": "Аутентичные Данные (DNSSEC)",
        "cd": "Проверка Отключена (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Неизвестно"
    }
  },
  "pt": {
    "dns": {
      "flags": {
        "tc": "Resposta Truncada",
        "rd": "Recursão Desejada",
        "ra": "Recursão Disponível",
        "ad": "Dados Autênticos (DNSSEC)",
        "cd": "Verificação Desabilitada (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Desconhecido"
    }
  },
  "ar": {
    "dns": {
      "flags": {
        "tc": "استجابة مقطوعة",
        "rd": "التكرار مرغوب",
        "ra": "التكرار متاح",
        "ad": "بيانات أصلية (DNSSEC)",
        "cd": "التحقق معطل (DNSSEC)"
      }
    },
    "common": {
      "unknown": "غير معروف"
    }
  },
  "hi": {
    "dns": {
      "flags": {
        "tc": "कटा हुआ उत्तर",
        "rd": "पुनरावृत्ति वांछित",
        "ra": "पुनरावृत्ति उपलब्ध",
        "ad": "प्रामाणिक डेटा (DNSSEC)",
        "cd": "जांच अक्षम (DNSSEC)"
      }
    },
    "common": {
      "unknown": "अज्ञात"
    }
  },
  "tr": {
    "dns": {
      "flags": {
        "tc": "Kesilmiş Yanıt",
        "rd": "Özyineleme İstendi",
        "ra": "Özyineleme Mevcut",
        "ad": "Otantik Veri (DNSSEC)",
        "cd": "Denetim Devre Dışı (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Bilinmeyen"
    }
  },
  "nl": {
    "dns": {
      "flags": {
        "tc": "Afgekapte Reactie",
        "rd": "Recursie Gewenst",
        "ra": "Recursie Beschikbaar",
        "ad": "Authentieke Gegevens (DNSSEC)",
        "cd": "Controle Uitgeschakeld (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Onbekend"
    }
  },
  "sv": {
    "dns": {
      "flags": {
        "tc": "Trunkerat Svar",
        "rd": "Rekursion Önskad",
        "ra": "Rekursion Tillgänglig",
        "ad": "Autentisk Data (DNSSEC)",
        "cd": "Kontroll Inaktiverad (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Okänd"
    }
  },
  "pl": {
    "dns": {
      "flags": {
        "tc": "Obcięta Odpowiedź",
        "rd": "Rekursja Pożądana",
        "ra": "Rekursja Dostępna",
        "ad": "Autentyczne Dane (DNSSEC)",
        "cd": "Sprawdzanie Wyłączone (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Nieznane"
    }
  },
  "vi": {
    "dns": {
      "flags": {
        "tc": "Phản Hồi Bị Cắt",
        "rd": "Đệ Quy Mong Muốn",
        "ra": "Đệ Quy Có Sẵn",
        "ad": "Dữ Liệu Xác Thực (DNSSEC)",
        "cd": "Kiểm Tra Vô Hiệu Hóa (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Không Rõ"
    }
  },
  "th": {
    "dns": {
      "flags": {
        "tc": "การตอบสนองที่ถูกตัด",
        "rd": "ต้องการการเรียกซ้ำ",
        "ra": "การเรียกซ้ำพร้อมใช้งาน",
        "ad": "ข้อมูลแท้ (DNSSEC)",
        "cd": "การตรวจสอบปิดใช้งาน (DNSSEC)"
      }
    },
    "common": {
      "unknown": "ไม่ทราบ"
    }
  },
  "id": {
    "dns": {
      "flags": {
        "tc": "Respons Terpotong",
        "rd": "Rekursi Diinginkan",
        "ra": "Rekursi Tersedia",
        "ad": "Data Autentik (DNSSEC)",
        "cd": "Pemeriksaan Dinonaktifkan (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Tidak Diketahui"
    }
  },
  "he": {
    "dns": {
      "flags": {
        "tc": "תגובה קטועה",
        "rd": "רקורסיה רצויה",
        "ra": "רקורסיה זמינה",
        "ad": "נתונים אותנטיים (DNSSEC)",
        "cd": "בדיקה מושבתת (DNSSEC)"
      }
    },
    "common": {
      "unknown": "לא ידוע"
    }
  },
  "ms": {
    "dns": {
      "flags": {
        "tc": "Respons Terpotong",
        "rd": "Rekursi Dikehendaki",
        "ra": "Rekursi Tersedia",
        "ad": "Data Autentik (DNSSEC)",
        "cd": "Pemeriksaan Dilumpuhkan (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Tidak Diketahui"
    }
  },
  "no": {
    "dns": {
      "flags": {
        "tc": "Avkortet Svar",
        "rd": "Rekursjon Ønsket",
        "ra": "Rekursjon Tilgjengelig",
        "ad": "Autentiske Data (DNSSEC)",
        "cd": "Kontroll Deaktivert (DNSSEC)"
      }
    },
    "common": {
      "unknown": "Ukjent"
    }
  }
}
</i18n>
