<template>
  {{ description }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  rcode: number
}>()

const { t } = useI18n()

const description = computed(() => {
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  const i18nText = t(`dns.rcode.${props.rcode}.description`)
  if (i18nText === `dns.rcode.${props.rcode}.description`) {
    return t('common.unknown')
  }
  return i18nText
})
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "common": {
      "unknown": "Unknown"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Bad OPT Version" },
        "17": { "description": "Key not recognized" },
        "18": { "description": "Signature out of time window" },
        "19": { "description": "Bad TKEY Mode" },
        "20": { "description": "Duplicate key name" },
        "21": { "description": "Algorithm not supported" },
        "22": { "description": "Bad Truncation" },
        "23": { "description": "Bad/missing Server Cookie" }
      }
    }
  },
  "zh": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "16": { "description": "OPT 版本错误" },
        "17": { "description": "密钥不可识别" },
        "18": { "description": "签名超出时间窗口" },
        "19": { "description": "TKEY 模式错误" },
        "20": { "description": "重复的密钥名称" },
        "21": { "description": "算法不支持" },
        "22": { "description": "截断错误" },
        "23": { "description": "服务器 Cookie 错误/缺失" }
      }
    }
  },
  "zh-CN": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "16": { "description": "OPT 版本错误" },
        "17": { "description": "密钥不可识别" },
        "18": { "description": "签名超出时间窗口" },
        "19": { "description": "TKEY 模式错误" },
        "20": { "description": "重复的密钥名称" },
        "21": { "description": "算法不支持" },
        "22": { "description": "截断错误" },
        "23": { "description": "服务器 Cookie 错误/缺失" }
      }
    }
  },
  "zh-TW": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "16": { "description": "OPT 版本錯誤" },
        "17": { "description": "金鑰不可識別" },
        "18": { "description": "簽章超出時間窗口" },
        "19": { "description": "TKEY 模式錯誤" },
        "20": { "description": "重複的金鑰名稱" },
        "21": { "description": "演算法不支援" },
        "22": { "description": "截斷錯誤" },
        "23": { "description": "伺服器 Cookie 錯誤/缺失" }
      }
    }
  },
  "zh-HK": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "16": { "description": "OPT 版本錯誤" },
        "17": { "description": "金鑰不可識別" },
        "18": { "description": "簽章超出時間窗口" },
        "19": { "description": "TKEY 模式錯誤" },
        "20": { "description": "重複的金鑰名稱" },
        "21": { "description": "演算法不支援" },
        "22": { "description": "截斷錯誤" },
        "23": { "description": "伺服器 Cookie 錯誤/缺失" }
      }
    }
  },
  "es": {
    "common": {
      "unknown": "Desconocido"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Versión OPT Incorrecta" },
        "17": { "description": "Clave no reconocida" },
        "18": { "description": "Firma fuera de la ventana de tiempo" },
        "19": { "description": "Modo TKEY Incorrecto" },
        "20": { "description": "Nombre de clave duplicado" },
        "21": { "description": "Algoritmo no soportado" },
        "22": { "description": "Truncamiento Incorrecto" },
        "23": { "description": "Cookie del Servidor Incorrecto/Faltante" }
      }
    }
  },
  "fr": {
    "common": {
      "unknown": "Inconnu"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Mauvaise Version OPT" },
        "17": { "description": "Clé non reconnue" },
        "18": { "description": "Signature hors de la fenêtre de temps" },
        "19": { "description": "Mauvais Mode TKEY" },
        "20": { "description": "Nom de clé en double" },
        "21": { "description": "Algorithme non supporté" },
        "22": { "description": "Mauvaise Troncature" },
        "23": { "description": "Cookie Serveur Mauvais/Manquant" }
      }
    }
  },
  "de": {
    "common": {
      "unknown": "Unbekannt"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Schlechte OPT Version" },
        "17": { "description": "Schlüssel nicht erkannt" },
        "18": { "description": "Signatur außerhalb des Zeitfensters" },
        "19": { "description": "Schlechter TKEY Modus" },
        "20": { "description": "Doppelter Schlüsselname" },
        "21": { "description": "Algorithmus nicht unterstützt" },
        "22": { "description": "Schlechte Kürzung" },
        "23": { "description": "Schlechter/Fehlender Server Cookie" }
      }
    }
  },
  "it": {
    "common": {
      "unknown": "Sconosciuto"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Versione OPT Errata" },
        "17": { "description": "Chiave non riconosciuta" },
        "18": { "description": "Firma fuori dalla finestra temporale" },
        "19": { "description": "Modalità TKEY Errata" },
        "20": { "description": "Nome chiave duplicato" },
        "21": { "description": "Algoritmo non supportato" },
        "22": { "description": "Troncamento Errato" },
        "23": { "description": "Cookie Server Errato/Mancante" }
      }
    }
  },
  "ja": {
    "common": {
      "unknown": "不明"
    },
    "dns": {
      "rcode": {
        "16": { "description": "不正なOPTバージョン" },
        "17": { "description": "認識されないキー" },
        "18": { "description": "時間窓外の署名" },
        "19": { "description": "不正なTKEYモード" },
        "20": { "description": "重複するキー名" },
        "21": { "description": "サポートされていないアルゴリズム" },
        "22": { "description": "不正な切り捨て" },
        "23": { "description": "不正/欠損サーバークッキー" }
      }
    }
  },
  "ko": {
    "common": {
      "unknown": "알 수 없음"
    },
    "dns": {
      "rcode": {
        "16": { "description": "잘못된 OPT 버전" },
        "17": { "description": "인식되지 않는 키" },
        "18": { "description": "시간 창 밖의 서명" },
        "19": { "description": "잘못된 TKEY 모드" },
        "20": { "description": "중복된 키 이름" },
        "21": { "description": "지원되지 않는 알고리즘" },
        "22": { "description": "잘못된 절단" },
        "23": { "description": "잘못된/누락된 서버 쿠키" }
      }
    }
  },
  "ru": {
    "common": {
      "unknown": "Неизвестно"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Плохая Версия OPT" },
        "17": { "description": "Ключ не распознан" },
        "18": { "description": "Подпись вне временного окна" },
        "19": { "description": "Плохой Режим TKEY" },
        "20": { "description": "Дублированное имя ключа" },
        "21": { "description": "Алгоритм не поддерживается" },
        "22": { "description": "Плохое Усечение" },
        "23": { "description": "Плохой/Отсутствующий Серверный Cookie" }
      }
    }
  },
  "pt": {
    "common": {
      "unknown": "Desconhecido"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Versão OPT Ruim" },
        "17": { "description": "Chave não reconhecida" },
        "18": { "description": "Assinatura fora da janela de tempo" },
        "19": { "description": "Modo TKEY Ruim" },
        "20": { "description": "Nome de chave duplicado" },
        "21": { "description": "Algoritmo não suportado" },
        "22": { "description": "Truncamento Ruim" },
        "23": { "description": "Cookie do Servidor Ruim/Ausente" }
      }
    }
  },
  "ar": {
    "common": {
      "unknown": "غير معروف"
    },
    "dns": {
      "rcode": {
        "16": { "description": "إصدار OPT سيء" },
        "17": { "description": "المفتاح غير معروف" },
        "18": { "description": "التوقيع خارج نافذة الوقت" },
        "19": { "description": "وضع TKEY سيء" },
        "20": { "description": "اسم مفتاح مكرر" },
        "21": { "description": "الخوارزمية غير مدعومة" },
        "22": { "description": "اقتطاع سيء" },
        "23": { "description": "كوكي الخادم سيء/مفقود" }
      }
    }
  },
  "hi": {
    "common": {
      "unknown": "अज्ञात"
    },
    "dns": {
      "rcode": {
        "16": { "description": "खराब OPT संस्करण" },
        "17": { "description": "कुंजी पहचानी नहीं गई" },
        "18": { "description": "समय विंडो के बाहर हस्ताक्षर" },
        "19": { "description": "खराब TKEY मोड" },
        "20": { "description": "डुप्लिकेट कुंजी नाम" },
        "21": { "description": "एल्गोरिदम समर्थित नहीं" },
        "22": { "description": "खराब ट्रंकेशन" },
        "23": { "description": "खराब/लापता सर्वर कुकी" }
      }
    }
  },
  "tr": {
    "common": {
      "unknown": "Bilinmeyen"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Kötü OPT Sürümü" },
        "17": { "description": "Anahtar tanınmadı" },
        "18": { "description": "İmza zaman penceresinin dışında" },
        "19": { "description": "Kötü TKEY Modu" },
        "20": { "description": "Tekrarlanan anahtar adı" },
        "21": { "description": "Algoritma desteklenmiyor" },
        "22": { "description": "Kötü Kesme" },
        "23": { "description": "Kötü/Eksik Sunucu Cookie'si" }
      }
    }
  },
  "nl": {
    "common": {
      "unknown": "Onbekend"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Slechte OPT Versie" },
        "17": { "description": "Sleutel niet herkend" },
        "18": { "description": "Handtekening buiten tijdvenster" },
        "19": { "description": "Slechte TKEY Modus" },
        "20": { "description": "Dubbele sleutelnaam" },
        "21": { "description": "Algoritme niet ondersteund" },
        "22": { "description": "Slechte Afkapping" },
        "23": { "description": "Slechte/Ontbrekende Server Cookie" }
      }
    }
  },
  "sv": {
    "common": {
      "unknown": "Okänd"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Dålig OPT Version" },
        "17": { "description": "Nyckel inte igenkänd" },
        "18": { "description": "Signatur utanför tidsfönster" },
        "19": { "description": "Dåligt TKEY Läge" },
        "20": { "description": "Duplicerat nyckelnamn" },
        "21": { "description": "Algoritm inte stödd" },
        "22": { "description": "Dålig Trunkering" },
        "23": { "description": "Dålig/Saknad Server Cookie" }
      }
    }
  },
  "pl": {
    "common": {
      "unknown": "Nieznany"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Zła Wersja OPT" },
        "17": { "description": "Klucz nie rozpoznany" },
        "18": { "description": "Podpis poza oknem czasowym" },
        "19": { "description": "Zły Tryb TKEY" },
        "20": { "description": "Zduplikowana nazwa klucza" },
        "21": { "description": "Algorytm nie obsługiwany" },
        "22": { "description": "Złe Obcięcie" },
        "23": { "description": "Zły/Brakujący Cookie Serwera" }
      }
    }
  },
  "vi": {
    "common": {
      "unknown": "Không rõ"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Phiên Bản OPT Xấu" },
        "17": { "description": "Khóa không được nhận dạng" },
        "18": { "description": "Chữ ký ngoài cửa sổ thời gian" },
        "19": { "description": "Chế Độ TKEY Xấu" },
        "20": { "description": "Tên khóa trùng lặp" },
        "21": { "description": "Thuật toán không được hỗ trợ" },
        "22": { "description": "Cắt Bớt Xấu" },
        "23": { "description": "Cookie Máy Chủ Xấu/Thiếu" }
      }
    }
  },
  "th": {
    "common": {
      "unknown": "ไม่ทราบ"
    },
    "dns": {
      "rcode": {
        "16": { "description": "เวอร์ชัน OPT ไม่ถูกต้อง" },
        "17": { "description": "คีย์ไม่รู้จัก" },
        "18": { "description": "ลายเซ็นนอกหน้าต่างเวลา" },
        "19": { "description": "โหมด TKEY ไม่ถูกต้อง" },
        "20": { "description": "ชื่อคีย์ซ้ำ" },
        "21": { "description": "อัลกอริธึมไม่รองรับ" },
        "22": { "description": "การตัดทอนไม่ถูกต้อง" },
        "23": { "description": "คุกกี้เซิร์ฟเวอร์ไม่ถูกต้อง/ขาดหายไป" }
      }
    }
  },
  "id": {
    "common": {
      "unknown": "Tidak Diketahui"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Versi OPT Buruk" },
        "17": { "description": "Kunci tidak dikenali" },
        "18": { "description": "Tanda tangan di luar jendela waktu" },
        "19": { "description": "Mode TKEY Buruk" },
        "20": { "description": "Nama kunci duplikat" },
        "21": { "description": "Algoritma tidak didukung" },
        "22": { "description": "Pemotongan Buruk" },
        "23": { "description": "Cookie Server Buruk/Hilang" }
      }
    }
  },
  "he": {
    "common": {
      "unknown": "לא ידוע"
    },
    "dns": {
      "rcode": {
        "16": { "description": "גרסת OPT רעה" },
        "17": { "description": "מפתח לא מזוהה" },
        "18": { "description": "חתימה מחוץ לחלון הזמן" },
        "19": { "description": "מצב TKEY רע" },
        "20": { "description": "שם מפתח כפול" },
        "21": { "description": "אלגוריתם לא נתמך" },
        "22": { "description": "קיצור רע" },
        "23": { "description": "עוגיית שרת רעה/חסרה" }
      }
    }
  },
  "ms": {
    "common": {
      "unknown": "Tidak Diketahui"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Versi OPT Buruk" },
        "17": { "description": "Kunci tidak dikenali" },
        "18": { "description": "Tandatangan di luar tetingkap masa" },
        "19": { "description": "Mod TKEY Buruk" },
        "20": { "description": "Nama kunci berganda" },
        "21": { "description": "Algoritma tidak disokong" },
        "22": { "description": "Pemotongan Buruk" },
        "23": { "description": "Cookie Pelayan Buruk/Hilang" }
      }
    }
  },
  "no": {
    "common": {
      "unknown": "Ukjent"
    },
    "dns": {
      "rcode": {
        "16": { "description": "Dårlig OPT Versjon" },
        "17": { "description": "Nøkkel ikke gjenkjent" },
        "18": { "description": "Signatur utenfor tidsvindu" },
        "19": { "description": "Dårlig TKEY Modus" },
        "20": { "description": "Duplisert nøkkelnavn" },
        "21": { "description": "Algoritme ikke støttet" },
        "22": { "description": "Dårlig Avkorting" },
        "23": { "description": "Dårlig/Manglende Server Cookie" }
      }
    }
  }
}
</i18n>
