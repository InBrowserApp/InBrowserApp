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
        "6": { "description": "Name Exists when it should not" },
        "7": { "description": "RR Set Exists when it should not" },
        "8": { "description": "RR Set that should exist does not" },
        "9": { "description": "Server Not Authoritative for zone" },
        "10": { "description": "Name not contained in zone" },
        "11": { "description": "DSO-TYPE Not Implemented" }
      }
    }
  },
  "zh": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "6": { "description": "域名已存在但不应存在" },
        "7": { "description": "RR集合已存在但不应存在" },
        "8": { "description": "RR集合应存在但不存在" },
        "9": { "description": "服务器对区域没有权威" },
        "10": { "description": "域名不在区域内" },
        "11": { "description": "DSO-TYPE 未实现" }
      }
    }
  },
  "zh-CN": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "6": { "description": "域名已存在但不应存在" },
        "7": { "description": "RR集合已存在但不应存在" },
        "8": { "description": "RR集合应存在但不存在" },
        "9": { "description": "服务器对区域没有权威" },
        "10": { "description": "域名不在区域内" },
        "11": { "description": "DSO-TYPE 未实现" }
      }
    }
  },
  "zh-TW": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "6": { "description": "域名已存在但不應存在" },
        "7": { "description": "RR集合已存在但不應存在" },
        "8": { "description": "RR集合應存在但不存在" },
        "9": { "description": "伺服器對區域沒有權威" },
        "10": { "description": "域名不在區域內" },
        "11": { "description": "DSO-TYPE 未實現" }
      }
    }
  },
  "zh-HK": {
    "common": {
      "unknown": "未知"
    },
    "dns": {
      "rcode": {
        "6": { "description": "域名已存在但不應存在" },
        "7": { "description": "RR集合已存在但不應存在" },
        "8": { "description": "RR集合應存在但不存在" },
        "9": { "description": "伺服器對區域沒有權威" },
        "10": { "description": "域名不在區域內" },
        "11": { "description": "DSO-TYPE 未實現" }
      }
    }
  },
  "es": {
    "common": {
      "unknown": "Desconocido"
    },
    "dns": {
      "rcode": {
        "6": { "description": "El Nombre Existe cuando no debería" },
        "7": { "description": "RR Set Existe cuando no debería" },
        "8": { "description": "RR Set que debería existir no existe" },
        "9": { "description": "Servidor No Autoritativo para la zona" },
        "10": { "description": "Nombre no contenido en la zona" },
        "11": { "description": "DSO-TYPE No Implementado" }
      }
    }
  },
  "fr": {
    "common": {
      "unknown": "Inconnu"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Le Nom Existe quand il ne devrait pas" },
        "7": { "description": "RR Set Existe quand il ne devrait pas" },
        "8": { "description": "RR Set qui devrait exister n'existe pas" },
        "9": { "description": "Serveur Non Autoritaire pour la zone" },
        "10": { "description": "Nom non contenu dans la zone" },
        "11": { "description": "DSO-TYPE Non Implémenté" }
      }
    }
  },
  "de": {
    "common": {
      "unknown": "Unbekannt"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Name Existiert obwohl er nicht sollte" },
        "7": { "description": "RR Set Existiert obwohl es nicht sollte" },
        "8": { "description": "RR Set das existieren sollte existiert nicht" },
        "9": { "description": "Server Nicht Autoritativ für Zone" },
        "10": { "description": "Name nicht in Zone enthalten" },
        "11": { "description": "DSO-TYPE Nicht Implementiert" }
      }
    }
  },
  "it": {
    "common": {
      "unknown": "Sconosciuto"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Il Nome Esiste quando non dovrebbe" },
        "7": { "description": "RR Set Esiste quando non dovrebbe" },
        "8": { "description": "RR Set che dovrebbe esistere non esiste" },
        "9": { "description": "Server Non Autoritativo per la zona" },
        "10": { "description": "Nome non contenuto nella zona" },
        "11": { "description": "DSO-TYPE Non Implementato" }
      }
    }
  },
  "ja": {
    "common": {
      "unknown": "不明"
    },
    "dns": {
      "rcode": {
        "6": { "description": "存在すべきでない名前が存在" },
        "7": { "description": "存在すべきでないRRセットが存在" },
        "8": { "description": "存在すべきRRセットが存在しない" },
        "9": { "description": "ゾーンに対して権威のないサーバー" },
        "10": { "description": "名前がゾーンに含まれていない" },
        "11": { "description": "DSO-TYPE未実装" }
      }
    }
  },
  "ko": {
    "common": {
      "unknown": "알 수 없음"
    },
    "dns": {
      "rcode": {
        "6": { "description": "존재해서는 안 되는 이름이 존재함" },
        "7": { "description": "존재해서는 안 되는 RR 세트가 존재함" },
        "8": { "description": "존재해야 하는 RR 세트가 존재하지 않음" },
        "9": { "description": "영역에 대해 권위가 없는 서버" },
        "10": { "description": "영역에 포함되지 않은 이름" },
        "11": { "description": "DSO-TYPE 구현되지 않음" }
      }
    }
  },
  "ru": {
    "common": {
      "unknown": "Неизвестно"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Имя Существует когда не должно" },
        "7": { "description": "RR Набор Существует когда не должен" },
        "8": { "description": "RR Набор который должен существовать не существует" },
        "9": { "description": "Сервер Не Авторитетен для зоны" },
        "10": { "description": "Имя не содержится в зоне" },
        "11": { "description": "DSO-TYPE Не Реализован" }
      }
    }
  },
  "pt": {
    "common": {
      "unknown": "Desconhecido"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Nome Existe quando não deveria" },
        "7": { "description": "RR Set Existe quando não deveria" },
        "8": { "description": "RR Set que deveria existir não existe" },
        "9": { "description": "Servidor Não Autoritativo para a zona" },
        "10": { "description": "Nome não contido na zona" },
        "11": { "description": "DSO-TYPE Não Implementado" }
      }
    }
  },
  "ar": {
    "common": {
      "unknown": "غير معروف"
    },
    "dns": {
      "rcode": {
        "6": { "description": "الاسم موجود عندما لا يجب أن يكون" },
        "7": { "description": "مجموعة RR موجودة عندما لا يجب أن تكون" },
        "8": { "description": "مجموعة RR التي يجب أن توجد غير موجودة" },
        "9": { "description": "الخادم غير موثق للمنطقة" },
        "10": { "description": "الاسم غير موجود في المنطقة" },
        "11": { "description": "DSO-TYPE غير منفذ" }
      }
    }
  },
  "hi": {
    "common": {
      "unknown": "अज्ञात"
    },
    "dns": {
      "rcode": {
        "6": { "description": "नाम मौजूद है जब यह नहीं होना चाहिए" },
        "7": { "description": "RR सेट मौजूद है जब यह नहीं होना चाहिए" },
        "8": { "description": "RR सेट जो होना चाहिए वह मौजूद नहीं है" },
        "9": { "description": "सर्वर ज़ोन के लिए प्राधिकृत नहीं" },
        "10": { "description": "नाम ज़ोन में शामिल नहीं" },
        "11": { "description": "DSO-TYPE लागू नहीं किया गया" }
      }
    }
  },
  "tr": {
    "common": {
      "unknown": "Bilinmeyen"
    },
    "dns": {
      "rcode": {
        "6": { "description": "İsim olmaması gerekirken var" },
        "7": { "description": "RR Seti olmaması gerekirken var" },
        "8": { "description": "Olması gereken RR Seti yok" },
        "9": { "description": "Sunucu bölge için yetkili değil" },
        "10": { "description": "İsim bölgede yer almıyor" },
        "11": { "description": "DSO-TYPE Uygulanmadı" }
      }
    }
  },
  "nl": {
    "common": {
      "unknown": "Onbekend"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Naam Bestaat wanneer het niet zou moeten" },
        "7": { "description": "RR Set Bestaat wanneer het niet zou moeten" },
        "8": { "description": "RR Set die zou moeten bestaan bestaat niet" },
        "9": { "description": "Server Niet Autoritatief voor zone" },
        "10": { "description": "Naam niet opgenomen in zone" },
        "11": { "description": "DSO-TYPE Niet Geïmplementeerd" }
      }
    }
  },
  "sv": {
    "common": {
      "unknown": "Okänd"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Namn Existerar när det inte borde" },
        "7": { "description": "RR Set Existerar när det inte borde" },
        "8": { "description": "RR Set som borde existera gör det inte" },
        "9": { "description": "Server Inte Auktoritativ för zon" },
        "10": { "description": "Namn inte innehållet i zon" },
        "11": { "description": "DSO-TYPE Inte Implementerat" }
      }
    }
  },
  "pl": {
    "common": {
      "unknown": "Nieznany"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Nazwa Istnieje gdy nie powinna" },
        "7": { "description": "RR Set Istnieje gdy nie powinien" },
        "8": { "description": "RR Set który powinien istnieć nie istnieje" },
        "9": { "description": "Serwer Nieautorytatywny dla strefy" },
        "10": { "description": "Nazwa nie zawarta w strefie" },
        "11": { "description": "DSO-TYPE Niezaimplementowane" }
      }
    }
  },
  "vi": {
    "common": {
      "unknown": "Không rõ"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Tên tồn tại khi không nên" },
        "7": { "description": "RR Set tồn tại khi không nên" },
        "8": { "description": "RR Set đáng lẽ tồn tại nhưng không tồn tại" },
        "9": { "description": "Máy chủ không có thẩm quyền cho vùng" },
        "10": { "description": "Tên không nằm trong vùng" },
        "11": { "description": "DSO-TYPE Chưa Được Cài Đặt" }
      }
    }
  },
  "th": {
    "common": {
      "unknown": "ไม่ทราบ"
    },
    "dns": {
      "rcode": {
        "6": { "description": "ชื่อมีอยู่เมื่อไม่ควรมี" },
        "7": { "description": "RR Set มีอยู่เมื่อไม่ควรมี" },
        "8": { "description": "RR Set ที่ควรมีไม่มีอยู่" },
        "9": { "description": "เซิร์ฟเวอร์ไม่เป็นผู้มีอำนาจสำหรับโซน" },
        "10": { "description": "ชื่อไม่อยู่ในโซน" },
        "11": { "description": "DSO-TYPE ยังไม่ได้ใช้งาน" }
      }
    }
  },
  "id": {
    "common": {
      "unknown": "Tidak Diketahui"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Nama Ada ketika seharusnya tidak ada" },
        "7": { "description": "RR Set Ada ketika seharusnya tidak ada" },
        "8": { "description": "RR Set yang seharusnya ada tidak ada" },
        "9": { "description": "Server Tidak Otoritatif untuk zona" },
        "10": { "description": "Nama tidak terkandung dalam zona" },
        "11": { "description": "DSO-TYPE Tidak Diimplementasikan" }
      }
    }
  },
  "he": {
    "common": {
      "unknown": "לא ידוע"
    },
    "dns": {
      "rcode": {
        "6": { "description": "שם קיים כשלא צריך" },
        "7": { "description": "RR Set קיים כשלא צריך" },
        "8": { "description": "RR Set שאמור להתקיים לא קיים" },
        "9": { "description": "שרת לא סמכותי לאזור" },
        "10": { "description": "שם לא כלול באזור" },
        "11": { "description": "DSO-TYPE לא מיושם" }
      }
    }
  },
  "ms": {
    "common": {
      "unknown": "Tidak Diketahui"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Nama wujud apabila tidak sepatutnya" },
        "7": { "description": "RR Set wujud apabila tidak sepatutnya" },
        "8": { "description": "RR Set yang sepatutnya wujud tidak wujud" },
        "9": { "description": "Pelayan Tidak Berwibawa untuk zon" },
        "10": { "description": "Nama tidak terkandung dalam zon" },
        "11": { "description": "DSO-TYPE Tidak Dilaksanakan" }
      }
    }
  },
  "no": {
    "common": {
      "unknown": "Ukjent"
    },
    "dns": {
      "rcode": {
        "6": { "description": "Navn Eksisterer når det ikke burde" },
        "7": { "description": "RR Set Eksisterer når det ikke burde" },
        "8": { "description": "RR Set som burde eksistere gjør det ikke" },
        "9": { "description": "Server Ikke Autoritativ for sone" },
        "10": { "description": "Navn ikke inneholdt i sone" },
        "11": { "description": "DSO-TYPE Ikke Implementert" }
      }
    }
  }
}
</i18n>
