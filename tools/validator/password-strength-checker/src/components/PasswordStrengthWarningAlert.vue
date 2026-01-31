<template>
  <n-alert v-show="warningMessages.length" type="warning" :show-icon="true" class="alert">
    <n-ul>
      <n-li v-for="message in warningMessages" :key="message">{{ message }}</n-li>
    </n-ul>
  </n-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert, NLi, NUl } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { StrengthWarningKey } from '../utils'

const props = defineProps<{
  warnings: StrengthWarningKey[]
}>()

const { t } = useI18n()

const warningMessages = computed(() =>
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  props.warnings.map((key) => t(`warning.${key}`)),
)
</script>

<style scoped>
.alert :deep(.n-alert-body) {
  width: 100%;
}
</style>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "warning": {
      "common": "This is a very common password.",
      "short": "The password is too short.",
      "sequence": "Sequential patterns are easy to guess.",
      "repeat": "Repeated patterns reduce strength.",
      "singleClass": "Using only one character type lowers strength."
    }
  },
  "zh": {
    "warning": {
      "common": "这是非常常见的密码。",
      "short": "密码过短。",
      "sequence": "连续模式容易被猜中。",
      "repeat": "重复模式会降低强度。",
      "singleClass": "仅使用一种字符类型会降低强度。"
    }
  },
  "zh-CN": {
    "warning": {
      "common": "这是非常常见的密码。",
      "short": "密码过短。",
      "sequence": "连续模式容易被猜中。",
      "repeat": "重复模式会降低强度。",
      "singleClass": "仅使用一种字符类型会降低强度。"
    }
  },
  "zh-TW": {
    "warning": {
      "common": "這是非常常見的密碼。",
      "short": "密碼過短。",
      "sequence": "連續模式容易被猜中。",
      "repeat": "重複模式會降低強度。",
      "singleClass": "僅使用一種字元類型會降低強度。"
    }
  },
  "zh-HK": {
    "warning": {
      "common": "呢個係非常常見嘅密碼。",
      "short": "密碼太短。",
      "sequence": "連續模式容易被估中。",
      "repeat": "重複模式會降低強度。",
      "singleClass": "只用一種字元類型會降低強度。"
    }
  },
  "es": {
    "warning": {
      "common": "Esta es una contraseña muy común.",
      "short": "La contraseña es demasiado corta.",
      "sequence": "Las secuencias son fáciles de adivinar.",
      "repeat": "Los patrones repetidos reducen la fuerza.",
      "singleClass": "Usar solo un tipo de carácter reduce la fuerza."
    }
  },
  "fr": {
    "warning": {
      "common": "C'est un mot de passe très courant.",
      "short": "Le mot de passe est trop court.",
      "sequence": "Les séquences sont faciles à deviner.",
      "repeat": "Les motifs répétés réduisent la robustesse.",
      "singleClass": "Utiliser un seul type de caractère réduit la robustesse."
    }
  },
  "de": {
    "warning": {
      "common": "Dies ist ein sehr häufiges Passwort.",
      "short": "Das Passwort ist zu kurz.",
      "sequence": "Sequenzen sind leicht zu erraten.",
      "repeat": "Wiederholte Muster verringern die Stärke.",
      "singleClass": "Nur eine Zeichenart zu verwenden verringert die Stärke."
    }
  },
  "it": {
    "warning": {
      "common": "Questa è una password molto comune.",
      "short": "La password è troppo corta.",
      "sequence": "Le sequenze sono facili da indovinare.",
      "repeat": "I pattern ripetuti riducono la forza.",
      "singleClass": "Usare un solo tipo di carattere riduce la forza."
    }
  },
  "ja": {
    "warning": {
      "common": "非常に一般的なパスワードです。",
      "short": "パスワードが短すぎます。",
      "sequence": "連続パターンは推測されやすいです。",
      "repeat": "繰り返しパターンは強度を下げます。",
      "singleClass": "1種類の文字だけだと強度が下がります。"
    }
  },
  "ko": {
    "warning": {
      "common": "매우 흔한 비밀번호입니다.",
      "short": "비밀번호가 너무 짧습니다.",
      "sequence": "연속 패턴은 쉽게 추측됩니다.",
      "repeat": "반복 패턴은 강도를 낮춥니다.",
      "singleClass": "한 가지 문자 유형만 사용하면 강도가 낮아집니다."
    }
  },
  "ru": {
    "warning": {
      "common": "Это очень распространенный пароль.",
      "short": "Пароль слишком короткий.",
      "sequence": "Последовательности легко угадываются.",
      "repeat": "Повторяющиеся шаблоны снижают прочность.",
      "singleClass": "Использование только одного типа символов снижает прочность."
    }
  },
  "pt": {
    "warning": {
      "common": "Esta é uma senha muito comum.",
      "short": "A senha é muito curta.",
      "sequence": "Sequências são fáceis de adivinhar.",
      "repeat": "Padrões repetidos reduzem a força.",
      "singleClass": "Usar apenas um tipo de caractere reduz a força."
    }
  },
  "ar": {
    "warning": {
      "common": "هذه كلمة مرور شائعة جدًا.",
      "short": "كلمة المرور قصيرة جدًا.",
      "sequence": "التسلسلات سهلة التخمين.",
      "repeat": "الأنماط المتكررة تقلل القوة.",
      "singleClass": "استخدام نوع واحد من الأحرف يقلل القوة."
    }
  },
  "hi": {
    "warning": {
      "common": "यह बहुत आम पासवर्ड है।",
      "short": "पासवर्ड बहुत छोटा है।",
      "sequence": "क्रम आसान होते हैं।",
      "repeat": "दोहराव पैटर्न मजबूती घटाते हैं।",
      "singleClass": "केवल एक प्रकार के अक्षर इस्तेमाल करने से मजबूती घटती है।"
    }
  },
  "tr": {
    "warning": {
      "common": "Bu çok yaygın bir paroladır.",
      "short": "Parola çok kısa.",
      "sequence": "Ardışık diziler kolayca tahmin edilir.",
      "repeat": "Tekrarlayan desenler gücü düşürür.",
      "singleClass": "Tek bir karakter türü kullanmak gücü düşürür."
    }
  },
  "nl": {
    "warning": {
      "common": "Dit is een zeer veelvoorkomend wachtwoord.",
      "short": "Het wachtwoord is te kort.",
      "sequence": "Reeksen zijn makkelijk te raden.",
      "repeat": "Herhaalde patronen verlagen de sterkte.",
      "singleClass": "Slechts één tekentype gebruiken verlaagt de sterkte."
    }
  },
  "sv": {
    "warning": {
      "common": "Det här är ett mycket vanligt lösenord.",
      "short": "Lösenordet är för kort.",
      "sequence": "Sekvenser är lätta att gissa.",
      "repeat": "Upprepade mönster minskar styrkan.",
      "singleClass": "Att bara använda en teckentyp minskar styrkan."
    }
  },
  "pl": {
    "warning": {
      "common": "To bardzo popularne hasło.",
      "short": "Hasło jest zbyt krótkie.",
      "sequence": "Sekwencje są łatwe do odgadnięcia.",
      "repeat": "Powtarzające się wzorce obniżają siłę.",
      "singleClass": "Użycie tylko jednego typu znaków obniża siłę."
    }
  },
  "vi": {
    "warning": {
      "common": "Đây là mật khẩu rất phổ biến.",
      "short": "Mật khẩu quá ngắn.",
      "sequence": "Chuỗi liên tiếp dễ đoán.",
      "repeat": "Mẫu lặp lại làm giảm độ mạnh.",
      "singleClass": "Chỉ dùng một loại ký tự làm giảm độ mạnh."
    }
  },
  "th": {
    "warning": {
      "common": "นี่เป็นรหัสผ่านที่พบบ่อยมาก",
      "short": "รหัสผ่านสั้นเกินไป",
      "sequence": "ลำดับต่อเนื่องเดาง่าย",
      "repeat": "รูปแบบซ้ำทำให้ความแข็งแรงลดลง",
      "singleClass": "ใช้ประเภทอักขระเพียงแบบเดียวทำให้ความแข็งแรงลดลง"
    }
  },
  "id": {
    "warning": {
      "common": "Ini adalah kata sandi yang sangat umum.",
      "short": "Kata sandi terlalu pendek.",
      "sequence": "Urutan mudah ditebak.",
      "repeat": "Pola berulang mengurangi kekuatan.",
      "singleClass": "Hanya satu jenis karakter menurunkan kekuatan."
    }
  },
  "he": {
    "warning": {
      "common": "זו סיסמה נפוצה מאוד.",
      "short": "הסיסמה קצרה מדי.",
      "sequence": "רצפים קלים לניחוש.",
      "repeat": "דפוסים חוזרים מפחיתים את החוזק.",
      "singleClass": "שימוש בסוג תווים אחד מפחית את החוזק."
    }
  },
  "ms": {
    "warning": {
      "common": "Ini kata laluan yang sangat biasa.",
      "short": "Kata laluan terlalu pendek.",
      "sequence": "Jujukan mudah diteka.",
      "repeat": "Corak berulang mengurangkan kekuatan.",
      "singleClass": "Hanya satu jenis aksara menurunkan kekuatan."
    }
  },
  "no": {
    "warning": {
      "common": "Dette er et svært vanlig passord.",
      "short": "Passordet er for kort.",
      "sequence": "Sekvenser er lette å gjette.",
      "repeat": "Gjentatte mønstre reduserer styrken.",
      "singleClass": "Kun én tegnkategori reduserer styrken."
    }
  }
}
</i18n>
