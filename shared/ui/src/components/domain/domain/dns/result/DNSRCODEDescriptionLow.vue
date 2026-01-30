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
        "0": { "description": "No Error" },
        "1": { "description": "Format Error" },
        "2": { "description": "Server Failure" },
        "3": { "description": "Non-Existent Domain" },
        "4": { "description": "Not Implemented" },
        "5": { "description": "Query Refused" }
      }
    }
  },
  "zh": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "0": { "description": "无错误" },
        "1": { "description": "格式错误" },
        "2": { "description": "服务器失败" },
        "3": { "description": "域名不存在" },
        "4": { "description": "功能未实现" },
        "5": { "description": "查询被拒绝" }
      }
    }
  },
  "zh-CN": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "0": { "description": "无错误" },
        "1": { "description": "格式错误" },
        "2": { "description": "服务器失败" },
        "3": { "description": "域名不存在" },
        "4": { "description": "功能未实现" },
        "5": { "description": "查询被拒绝" }
      }
    }
  },
  "zh-TW": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "0": { "description": "無錯誤" },
        "1": { "description": "格式錯誤" },
        "2": { "description": "伺服器失敗" },
        "3": { "description": "域名不存在" },
        "4": { "description": "功能未實現" },
        "5": { "description": "查詢被拒絕" }
      }
    }
  },
  "zh-HK": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "0": { "description": "無錯誤" },
        "1": { "description": "格式錯誤" },
        "2": { "description": "伺服器失敗" },
        "3": { "description": "域名不存在" },
        "4": { "description": "功能未實現" },
        "5": { "description": "查詢被拒絕" }
      }
    }
  },
  "es": {
    "common": {
      "unknown": "Desconocido"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Sin Error" },
        "1": { "description": "Error de Formato" },
        "2": { "description": "Fallo del Servidor" },
        "3": { "description": "Dominio No Existente" },
        "4": { "description": "No Implementado" },
        "5": { "description": "Consulta Rechazada" }
      }
    }
  },
  "fr": {
    "common": {
      "unknown": "Inconnu"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Aucune Erreur" },
        "1": { "description": "Erreur de Format" },
        "2": { "description": "Échec du Serveur" },
        "3": { "description": "Domaine Non Existant" },
        "4": { "description": "Non Implémenté" },
        "5": { "description": "Requête Refusée" }
      }
    }
  },
  "de": {
    "common": {
      "unknown": "Unbekannt"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Kein Fehler" },
        "1": { "description": "Format Fehler" },
        "2": { "description": "Server Fehler" },
        "3": { "description": "Domain Existiert Nicht" },
        "4": { "description": "Nicht Implementiert" },
        "5": { "description": "Anfrage Verweigert" }
      }
    }
  },
  "it": {
    "common": {
      "unknown": "Sconosciuto"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Nessun Errore" },
        "1": { "description": "Errore di Formato" },
        "2": { "description": "Errore del Server" },
        "3": { "description": "Dominio Non Esistente" },
        "4": { "description": "Non Implementato" },
        "5": { "description": "Query Rifiutata" }
      }
    }
  },
  "ja": {
    "common": {
      "unknown": "不明"
    },
    "dns": {
      "rcode": {
        "0": { "description": "エラーなし" },
        "1": { "description": "フォーマットエラー" },
        "2": { "description": "サーバー障害" },
        "3": { "description": "存在しないドメイン" },
        "4": { "description": "未実装" },
        "5": { "description": "クエリ拒否" }
      }
    }
  },
  "ko": {
    "common": {
      "unknown": "알 수 없음"
    },
    "dns": {
      "rcode": {
        "0": { "description": "오류 없음" },
        "1": { "description": "형식 오류" },
        "2": { "description": "서버 실패" },
        "3": { "description": "존재하지 않는 도메인" },
        "4": { "description": "구현되지 않음" },
        "5": { "description": "쿼리 거부됨" }
      }
    }
  },
  "ru": {
    "common": {
      "unknown": "Неизвестно"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Нет Ошибки" },
        "1": { "description": "Ошибка Формата" },
        "2": { "description": "Сбой Сервера" },
        "3": { "description": "Несуществующий Домен" },
        "4": { "description": "Не Реализовано" },
        "5": { "description": "Запрос Отклонен" }
      }
    }
  },
  "pt": {
    "common": {
      "unknown": "Desconhecido"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Sem Erro" },
        "1": { "description": "Erro de Formato" },
        "2": { "description": "Falha do Servidor" },
        "3": { "description": "Domínio Não Existente" },
        "4": { "description": "Não Implementado" },
        "5": { "description": "Consulta Recusada" }
      }
    }
  },
  "ar": {
    "common": {
      "unknown": "غير معروف"
    },
    "dns": {
      "rcode": {
        "0": { "description": "لا يوجد خطأ" },
        "1": { "description": "خطأ في التنسيق" },
        "2": { "description": "فشل الخادم" },
        "3": { "description": "نطاق غير موجود" },
        "4": { "description": "غير مُنفذ" },
        "5": { "description": "الاستعلام مرفوض" }
      }
    }
  },
  "hi": {
    "common": {
      "unknown": "अज्ञात"
    },
    "dns": {
      "rcode": {
        "0": { "description": "कोई त्रुटि नहीं" },
        "1": { "description": "प्रारूप त्रुटि" },
        "2": { "description": "सर्वर विफलता" },
        "3": { "description": "अस्तित्वहीन डोमेन" },
        "4": { "description": "लागू नहीं किया गया" },
        "5": { "description": "क्वेरी अस्वीकृत" }
      }
    }
  },
  "tr": {
    "common": {
      "unknown": "Bilinmeyen"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Hata Yok" },
        "1": { "description": "Format Hatası" },
        "2": { "description": "Sunucu Hatası" },
        "3": { "description": "Var Olmayan Domain" },
        "4": { "description": "Uygulanmadı" },
        "5": { "description": "Sorgu Reddedildi" }
      }
    }
  },
  "nl": {
    "common": {
      "unknown": "Onbekend"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Geen Fout" },
        "1": { "description": "Format Fout" },
        "2": { "description": "Server Fout" },
        "3": { "description": "Niet-Bestaand Domein" },
        "4": { "description": "Niet Geïmplementeerd" },
        "5": { "description": "Query Geweigerd" }
      }
    }
  },
  "sv": {
    "common": {
      "unknown": "Okänd"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Inget Fel" },
        "1": { "description": "Format Fel" },
        "2": { "description": "Server Fel" },
        "3": { "description": "Icke-Existerande Domän" },
        "4": { "description": "Inte Implementerat" },
        "5": { "description": "Fråga Nekad" }
      }
    }
  },
  "pl": {
    "common": {
      "unknown": "Nieznany"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Brak Błędu" },
        "1": { "description": "Błąd Formatu" },
        "2": { "description": "Awaria Serwera" },
        "3": { "description": "Nieistniejąca Domena" },
        "4": { "description": "Niezaimplementowane" },
        "5": { "description": "Zapytanie Odrzucone" }
      }
    }
  },
  "vi": {
    "common": {
      "unknown": "Không rõ"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Không Lỗi" },
        "1": { "description": "Lỗi Định Dạng" },
        "2": { "description": "Lỗi Máy Chủ" },
        "3": { "description": "Tên Miền Không Tồn Tại" },
        "4": { "description": "Chưa Được Cài Đặt" },
        "5": { "description": "Truy Vấn Bị Từ Chối" }
      }
    }
  },
  "th": {
    "common": {
      "unknown": "ไม่ทราบ"
    },
    "dns": {
      "rcode": {
        "0": { "description": "ไม่มีข้อผิดพลาด" },
        "1": { "description": "ข้อผิดพลาดรูปแบบ" },
        "2": { "description": "เซิร์ฟเวอร์ล้มเหลว" },
        "3": { "description": "โดเมนไม่มีอยู่" },
        "4": { "description": "ไม่ได้ใช้งาน" },
        "5": { "description": "ปฏิเสธการค้นหา" }
      }
    }
  },
  "id": {
    "common": {
      "unknown": "Tidak Diketahui"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Tidak Ada Kesalahan" },
        "1": { "description": "Kesalahan Format" },
        "2": { "description": "Kegagalan Server" },
        "3": { "description": "Domain Tidak Ada" },
        "4": { "description": "Tidak Diimplementasikan" },
        "5": { "description": "Query Ditolak" }
      }
    }
  },
  "he": {
    "common": {
      "unknown": "לא ידוע"
    },
    "dns": {
      "rcode": {
        "0": { "description": "אין שגיאה" },
        "1": { "description": "שגיאת פורמט" },
        "2": { "description": "כשל שרת" },
        "3": { "description": "דומיין לא קיים" },
        "4": { "description": "לא מיושם" },
        "5": { "description": "שאילתה נדחתה" }
      }
    }
  },
  "ms": {
    "common": {
      "unknown": "Tidak Diketahui"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Tiada Ralat" },
        "1": { "description": "Ralat Format" },
        "2": { "description": "Kegagalan Pelayan" },
        "3": { "description": "Domain Tidak Wujud" },
        "4": { "description": "Tidak Dilaksanakan" },
        "5": { "description": "Pertanyaan Ditolak" }
      }
    }
  },
  "no": {
    "common": {
      "unknown": "Ukjent"
    },
    "dns": {
      "rcode": {
        "0": { "description": "Ingen Feil" },
        "1": { "description": "Format Feil" },
        "2": { "description": "Server Feil" },
        "3": { "description": "Ikke-Eksisterende Domene" },
        "4": { "description": "Ikke Implementert" },
        "5": { "description": "Spørring Avvist" }
      }
    }
  }
}
</i18n>
