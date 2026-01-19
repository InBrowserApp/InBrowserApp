<template>
  {{ description }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  rcode: number
}>()

const description = computed(() => {
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  const i18nText = t(`dns.rcode.${props.rcode}.description`)
  if (i18nText === `dns.rcode.${props.rcode}.description`) {
    return t('common.unknown')
  }
  return i18nText
})
</script>

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
        "5": { "description": "Query Refused" },
        "6": { "description": "Name Exists when it should not" },
        "7": { "description": "RR Set Exists when it should not" },
        "8": { "description": "RR Set that should exist does not" },
        "9": { "description": "Server Not Authoritative for zone" },
        "10": { "description": "Name not contained in zone" },
        "11": { "description": "DSO-TYPE Not Implemented" },
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
        "0": { "description": "无错误" },
        "1": { "description": "格式错误" },
        "2": { "description": "服务器失败" },
        "3": { "description": "域名不存在" },
        "4": { "description": "功能未实现" },
        "5": { "description": "查询被拒绝" },
        "6": { "description": "域名已存在但不应存在" },
        "7": { "description": "RR集合已存在但不应存在" },
        "8": { "description": "RR集合应存在但不存在" },
        "9": { "description": "服务器对区域没有权威" },
        "10": { "description": "域名不在区域内" },
        "11": { "description": "DSO-TYPE 未实现" },
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
        "0": { "description": "无错误" },
        "1": { "description": "格式错误" },
        "2": { "description": "服务器失败" },
        "3": { "description": "域名不存在" },
        "4": { "description": "功能未实现" },
        "5": { "description": "查询被拒绝" },
        "6": { "description": "域名已存在但不应存在" },
        "7": { "description": "RR集合已存在但不应存在" },
        "8": { "description": "RR集合应存在但不存在" },
        "9": { "description": "服务器对区域没有权威" },
        "10": { "description": "域名不在区域内" },
        "11": { "description": "DSO-TYPE 未实现" },
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
        "0": { "description": "無錯誤" },
        "1": { "description": "格式錯誤" },
        "2": { "description": "伺服器失敗" },
        "3": { "description": "域名不存在" },
        "4": { "description": "功能未實現" },
        "5": { "description": "查詢被拒絕" },
        "6": { "description": "域名已存在但不應存在" },
        "7": { "description": "RR集合已存在但不應存在" },
        "8": { "description": "RR集合應存在但不存在" },
        "9": { "description": "伺服器對區域沒有權威" },
        "10": { "description": "域名不在區域內" },
        "11": { "description": "DSO-TYPE 未實現" },
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
        "0": { "description": "無錯誤" },
        "1": { "description": "格式錯誤" },
        "2": { "description": "伺服器失敗" },
        "3": { "description": "域名不存在" },
        "4": { "description": "功能未實現" },
        "5": { "description": "查詢被拒絕" },
        "6": { "description": "域名已存在但不應存在" },
        "7": { "description": "RR集合已存在但不應存在" },
        "8": { "description": "RR集合應存在但不存在" },
        "9": { "description": "伺服器對區域沒有權威" },
        "10": { "description": "域名不在區域內" },
        "11": { "description": "DSO-TYPE 未實現" },
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
        "0": { "description": "Sin Error" },
        "1": { "description": "Error de Formato" },
        "2": { "description": "Fallo del Servidor" },
        "3": { "description": "Dominio No Existente" },
        "4": { "description": "No Implementado" },
        "5": { "description": "Consulta Rechazada" },
        "6": { "description": "El Nombre Existe cuando no debería" },
        "7": { "description": "RR Set Existe cuando no debería" },
        "8": { "description": "RR Set que debería existir no existe" },
        "9": { "description": "Servidor No Autoritativo para la zona" },
        "10": { "description": "Nombre no contenido en la zona" },
        "11": { "description": "DSO-TYPE No Implementado" },
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
        "0": { "description": "Aucune Erreur" },
        "1": { "description": "Erreur de Format" },
        "2": { "description": "Échec du Serveur" },
        "3": { "description": "Domaine Non Existant" },
        "4": { "description": "Non Implémenté" },
        "5": { "description": "Requête Refusée" },
        "6": { "description": "Le Nom Existe quand il ne devrait pas" },
        "7": { "description": "RR Set Existe quand il ne devrait pas" },
        "8": { "description": "RR Set qui devrait exister n'existe pas" },
        "9": { "description": "Serveur Non Autoritaire pour la zone" },
        "10": { "description": "Nom non contenu dans la zone" },
        "11": { "description": "DSO-TYPE Non Implémenté" },
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
        "0": { "description": "Kein Fehler" },
        "1": { "description": "Format Fehler" },
        "2": { "description": "Server Fehler" },
        "3": { "description": "Domain Existiert Nicht" },
        "4": { "description": "Nicht Implementiert" },
        "5": { "description": "Anfrage Verweigert" },
        "6": { "description": "Name Existiert obwohl er nicht sollte" },
        "7": { "description": "RR Set Existiert obwohl es nicht sollte" },
        "8": { "description": "RR Set das existieren sollte existiert nicht" },
        "9": { "description": "Server Nicht Autoritativ für Zone" },
        "10": { "description": "Name nicht in Zone enthalten" },
        "11": { "description": "DSO-TYPE Nicht Implementiert" },
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
        "0": { "description": "Nessun Errore" },
        "1": { "description": "Errore di Formato" },
        "2": { "description": "Errore del Server" },
        "3": { "description": "Dominio Non Esistente" },
        "4": { "description": "Non Implementato" },
        "5": { "description": "Query Rifiutata" },
        "6": { "description": "Il Nome Esiste quando non dovrebbe" },
        "7": { "description": "RR Set Esiste quando non dovrebbe" },
        "8": { "description": "RR Set che dovrebbe esistere non esiste" },
        "9": { "description": "Server Non Autoritativo per la zona" },
        "10": { "description": "Nome non contenuto nella zona" },
        "11": { "description": "DSO-TYPE Non Implementato" },
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
        "0": { "description": "エラーなし" },
        "1": { "description": "フォーマットエラー" },
        "2": { "description": "サーバー障害" },
        "3": { "description": "存在しないドメイン" },
        "4": { "description": "未実装" },
        "5": { "description": "クエリ拒否" },
        "6": { "description": "存在すべきでない名前が存在" },
        "7": { "description": "存在すべきでないRRセットが存在" },
        "8": { "description": "存在すべきRRセットが存在しない" },
        "9": { "description": "ゾーンに対して権威のないサーバー" },
        "10": { "description": "名前がゾーンに含まれていない" },
        "11": { "description": "DSO-TYPE未実装" },
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
        "0": { "description": "오류 없음" },
        "1": { "description": "형식 오류" },
        "2": { "description": "서버 실패" },
        "3": { "description": "존재하지 않는 도메인" },
        "4": { "description": "구현되지 않음" },
        "5": { "description": "쿼리 거부됨" },
        "6": { "description": "존재해서는 안 되는 이름이 존재함" },
        "7": { "description": "존재해서는 안 되는 RR 세트가 존재함" },
        "8": { "description": "존재해야 하는 RR 세트가 존재하지 않음" },
        "9": { "description": "영역에 대해 권위가 없는 서버" },
        "10": { "description": "영역에 포함되지 않은 이름" },
        "11": { "description": "DSO-TYPE 구현되지 않음" },
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
        "0": { "description": "Нет Ошибки" },
        "1": { "description": "Ошибка Формата" },
        "2": { "description": "Сбой Сервера" },
        "3": { "description": "Несуществующий Домен" },
        "4": { "description": "Не Реализовано" },
        "5": { "description": "Запрос Отклонен" },
        "6": { "description": "Имя Существует когда не должно" },
        "7": { "description": "RR Набор Существует когда не должен" },
        "8": { "description": "RR Набор который должен существовать не существует" },
        "9": { "description": "Сервер Не Авторитетен для зоны" },
        "10": { "description": "Имя не содержится в зоне" },
        "11": { "description": "DSO-TYPE Не Реализован" },
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
        "0": { "description": "Sem Erro" },
        "1": { "description": "Erro de Formato" },
        "2": { "description": "Falha do Servidor" },
        "3": { "description": "Domínio Não Existente" },
        "4": { "description": "Não Implementado" },
        "5": { "description": "Consulta Recusada" },
        "6": { "description": "Nome Existe quando não deveria" },
        "7": { "description": "RR Set Existe quando não deveria" },
        "8": { "description": "RR Set que deveria existir não existe" },
        "9": { "description": "Servidor Não Autoritativo para a zona" },
        "10": { "description": "Nome não contido na zona" },
        "11": { "description": "DSO-TYPE Não Implementado" },
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
        "0": { "description": "لا يوجد خطأ" },
        "1": { "description": "خطأ في التنسيق" },
        "2": { "description": "فشل الخادم" },
        "3": { "description": "نطاق غير موجود" },
        "4": { "description": "غير مُنفذ" },
        "5": { "description": "الاستعلام مرفوض" },
        "6": { "description": "الاسم موجود عندما لا يجب أن يكون" },
        "7": { "description": "مجموعة RR موجودة عندما لا يجب أن تكون" },
        "8": { "description": "مجموعة RR التي يجب أن توجد غير موجودة" },
        "9": { "description": "الخادم غير موثق للمنطقة" },
        "10": { "description": "الاسم غير موجود في المنطقة" },
        "11": { "description": "DSO-TYPE غير منفذ" },
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
        "0": { "description": "कोई त्रुटि नहीं" },
        "1": { "description": "प्रारूप त्रुटि" },
        "2": { "description": "सर्वर विफलता" },
        "3": { "description": "अस्तित्वहीन डोमेन" },
        "4": { "description": "लागू नहीं किया गया" },
        "5": { "description": "क्वेरी अस्वीकृत" },
        "6": { "description": "नाम मौजूद है जब यह नहीं होना चाहिए" },
        "7": { "description": "RR सेट मौजूद है जब यह नहीं होना चाहिए" },
        "8": { "description": "RR सेट जो होना चाहिए वह मौजूद नहीं है" },
        "9": { "description": "सर्वर ज़ोन के लिए प्राधिकृत नहीं" },
        "10": { "description": "नाम ज़ोन में शामिल नहीं" },
        "11": { "description": "DSO-TYPE लागू नहीं किया गया" },
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
        "0": { "description": "Hata Yok" },
        "1": { "description": "Format Hatası" },
        "2": { "description": "Sunucu Hatası" },
        "3": { "description": "Var Olmayan Domain" },
        "4": { "description": "Uygulanmadı" },
        "5": { "description": "Sorgu Reddedildi" },
        "6": { "description": "İsim olmaması gerekirken var" },
        "7": { "description": "RR Seti olmaması gerekirken var" },
        "8": { "description": "Olması gereken RR Seti yok" },
        "9": { "description": "Sunucu bölge için yetkili değil" },
        "10": { "description": "İsim bölgede yer almıyor" },
        "11": { "description": "DSO-TYPE Uygulanmadı" },
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
        "0": { "description": "Geen Fout" },
        "1": { "description": "Format Fout" },
        "2": { "description": "Server Fout" },
        "3": { "description": "Niet-Bestaand Domein" },
        "4": { "description": "Niet Geïmplementeerd" },
        "5": { "description": "Query Geweigerd" },
        "6": { "description": "Naam Bestaat wanneer het niet zou moeten" },
        "7": { "description": "RR Set Bestaat wanneer het niet zou moeten" },
        "8": { "description": "RR Set die zou moeten bestaan bestaat niet" },
        "9": { "description": "Server Niet Autoritatief voor zone" },
        "10": { "description": "Naam niet opgenomen in zone" },
        "11": { "description": "DSO-TYPE Niet Geïmplementeerd" },
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
        "0": { "description": "Inget Fel" },
        "1": { "description": "Format Fel" },
        "2": { "description": "Server Fel" },
        "3": { "description": "Icke-Existerande Domän" },
        "4": { "description": "Inte Implementerat" },
        "5": { "description": "Fråga Nekad" },
        "6": { "description": "Namn Existerar när det inte borde" },
        "7": { "description": "RR Set Existerar när det inte borde" },
        "8": { "description": "RR Set som borde existera gör det inte" },
        "9": { "description": "Server Inte Auktoritativ för zon" },
        "10": { "description": "Namn inte innehållet i zon" },
        "11": { "description": "DSO-TYPE Inte Implementerat" },
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
        "0": { "description": "Brak Błędu" },
        "1": { "description": "Błąd Formatu" },
        "2": { "description": "Awaria Serwera" },
        "3": { "description": "Nieistniejąca Domena" },
        "4": { "description": "Nie Zaimplementowane" },
        "5": { "description": "Zapytanie Odrzucone" },
        "6": { "description": "Nazwa Istnieje gdy nie powinna" },
        "7": { "description": "RR Set Istnieje gdy nie powinien" },
        "8": { "description": "RR Set który powinien istnieć nie istnieje" },
        "9": { "description": "Serwer Nie Autorytatywny dla strefy" },
        "10": { "description": "Nazwa nie zawarta w strefie" },
        "11": { "description": "DSO-TYPE Nie Zaimplementowane" },
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
        "0": { "description": "Không Có Lỗi" },
        "1": { "description": "Lỗi Định Dạng" },
        "2": { "description": "Lỗi Máy Chủ" },
        "3": { "description": "Tên Miền Không Tồn Tại" },
        "4": { "description": "Chưa Được Triển Khai" },
        "5": { "description": "Truy Vấn Bị Từ Chối" },
        "6": { "description": "Tên Tồn Tại khi không nên" },
        "7": { "description": "RR Set Tồn Tại khi không nên" },
        "8": { "description": "RR Set nên tồn tại nhưng không tồn tại" },
        "9": { "description": "Máy Chủ Không Có Thẩm Quyền cho vùng" },
        "10": { "description": "Tên không được chứa trong vùng" },
        "11": { "description": "DSO-TYPE Chưa Được Triển Khai" },
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
        "0": { "description": "ไม่มีข้อผิดพลาด" },
        "1": { "description": "ข้อผิดพลาดรูปแบบ" },
        "2": { "description": "ความล้มเหลวของเซิร์ฟเวอร์" },
        "3": { "description": "โดเมนที่ไม่มีอยู่" },
        "4": { "description": "ไม่ได้นำมาใช้" },
        "5": { "description": "การสอบถามถูกปฏิเสธ" },
        "6": { "description": "ชื่อมีอยู่เมื่อไม่ควรมี" },
        "7": { "description": "RR Set มีอยู่เมื่อไม่ควรมี" },
        "8": { "description": "RR Set ที่ควรมีอยู่ไม่มี" },
        "9": { "description": "เซิร์ฟเวอร์ไม่มีอำนาจสำหรับโซน" },
        "10": { "description": "ชื่อไม่ได้อยู่ในโซน" },
        "11": { "description": "DSO-TYPE ไม่ได้นำมาใช้" },
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
        "0": { "description": "Tidak Ada Kesalahan" },
        "1": { "description": "Kesalahan Format" },
        "2": { "description": "Kegagalan Server" },
        "3": { "description": "Domain Tidak Ada" },
        "4": { "description": "Tidak Diimplementasikan" },
        "5": { "description": "Query Ditolak" },
        "6": { "description": "Nama Ada padahal seharusnya tidak" },
        "7": { "description": "RR Set Ada padahal seharusnya tidak" },
        "8": { "description": "RR Set yang seharusnya ada tidak ada" },
        "9": { "description": "Server Tidak Otoriter untuk zona" },
        "10": { "description": "Nama tidak terkandung dalam zona" },
        "11": { "description": "DSO-TYPE Tidak Diimplementasikan" },
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
        "0": { "description": "אין שגיאה" },
        "1": { "description": "שגיאת פורמט" },
        "2": { "description": "כשל שרת" },
        "3": { "description": "דומיין לא קיים" },
        "4": { "description": "לא מיושם" },
        "5": { "description": "שאילתה נדחתה" },
        "6": { "description": "השם קיים כאשר לא צריך" },
        "7": { "description": "RR Set קיים כאשר לא צריך" },
        "8": { "description": "RR Set שצריך להתקיים לא קיים" },
        "9": { "description": "השרת לא סמכותי לאזור" },
        "10": { "description": "השם לא כלול באזור" },
        "11": { "description": "DSO-TYPE לא מיושם" },
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
        "0": { "description": "Tiada Ralat" },
        "1": { "description": "Ralat Format" },
        "2": { "description": "Kegagalan Pelayan" },
        "3": { "description": "Domain Tidak Wujud" },
        "4": { "description": "Tidak Dilaksanakan" },
        "5": { "description": "Pertanyaan Ditolak" },
        "6": { "description": "Nama Wujud apabila tidak sepatutnya" },
        "7": { "description": "RR Set Wujud apabila tidak sepatutnya" },
        "8": { "description": "RR Set yang sepatutnya wujud tidak wujud" },
        "9": { "description": "Pelayan Tidak Berkuasa untuk zon" },
        "10": { "description": "Nama tidak terkandung dalam zon" },
        "11": { "description": "DSO-TYPE Tidak Dilaksanakan" },
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
        "0": { "description": "Ingen Feil" },
        "1": { "description": "Format Feil" },
        "2": { "description": "Server Feil" },
        "3": { "description": "Ikke-Eksisterende Domene" },
        "4": { "description": "Ikke Implementert" },
        "5": { "description": "Spørring Avvist" },
        "6": { "description": "Navn Eksisterer når det ikke burde" },
        "7": { "description": "RR Set Eksisterer når det ikke burde" },
        "8": { "description": "RR Set som burde eksistere gjør det ikke" },
        "9": { "description": "Server Ikke Autoritativ for sone" },
        "10": { "description": "Navn ikke inneholdt i sone" },
        "11": { "description": "DSO-TYPE Ikke Implementert" },
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
