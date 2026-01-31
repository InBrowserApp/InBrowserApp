<template>
  <n-alert v-show="suggestionMessages.length" type="info" :show-icon="true" class="alert">
    <n-ul>
      <n-li v-for="message in suggestionMessages" :key="message">{{ message }}</n-li>
    </n-ul>
  </n-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert, NLi, NUl } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { StrengthSuggestionKey } from '../utils'

const props = defineProps<{
  suggestions: StrengthSuggestionKey[]
}>()

const { t } = useI18n()

const suggestionMessages = computed(() =>
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  props.suggestions.map((key) => t(`suggestion.${key}`)),
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
    "suggestion": {
      "use-longer": "Use a longer password or passphrase.",
      "add-uppercase": "Add uppercase letters.",
      "add-lowercase": "Add lowercase letters.",
      "add-numbers": "Add numbers.",
      "add-symbols": "Add symbols.",
      "avoid-common": "Avoid common passwords and leaked phrases.",
      "avoid-sequences": "Avoid sequences like 123 or abc.",
      "avoid-repetition": "Avoid repeated patterns."
    }
  },
  "zh": {
    "suggestion": {
      "use-longer": "使用更长的密码或口令短语。",
      "add-uppercase": "添加大写字母。",
      "add-lowercase": "添加小写字母。",
      "add-numbers": "添加数字。",
      "add-symbols": "添加符号。",
      "avoid-common": "避免常见密码和已泄露的短语。",
      "avoid-sequences": "避免 123 或 abc 之类的序列。",
      "avoid-repetition": "避免重复模式。"
    }
  },
  "zh-CN": {
    "suggestion": {
      "use-longer": "使用更长的密码或口令短语。",
      "add-uppercase": "添加大写字母。",
      "add-lowercase": "添加小写字母。",
      "add-numbers": "添加数字。",
      "add-symbols": "添加符号。",
      "avoid-common": "避免常见密码和已泄露的短语。",
      "avoid-sequences": "避免 123 或 abc 之类的序列。",
      "avoid-repetition": "避免重复模式。"
    }
  },
  "zh-TW": {
    "suggestion": {
      "use-longer": "使用更長的密碼或口令短語。",
      "add-uppercase": "加入大寫字母。",
      "add-lowercase": "加入小寫字母。",
      "add-numbers": "加入數字。",
      "add-symbols": "加入符號。",
      "avoid-common": "避免常見密碼和已洩露的短語。",
      "avoid-sequences": "避免 123 或 abc 等序列。",
      "avoid-repetition": "避免重複模式。"
    }
  },
  "zh-HK": {
    "suggestion": {
      "use-longer": "使用更長嘅密碼或口令短語。",
      "add-uppercase": "加入大寫字母。",
      "add-lowercase": "加入小寫字母。",
      "add-numbers": "加入數字。",
      "add-symbols": "加入符號。",
      "avoid-common": "避免常見密碼同已洩露嘅短語。",
      "avoid-sequences": "避免 123 或 abc 等序列。",
      "avoid-repetition": "避免重複模式。"
    }
  },
  "es": {
    "suggestion": {
      "use-longer": "Usa una contraseña o frase más larga.",
      "add-uppercase": "Añade letras mayúsculas.",
      "add-lowercase": "Añade letras minúsculas.",
      "add-numbers": "Añade números.",
      "add-symbols": "Añade símbolos.",
      "avoid-common": "Evita contraseñas comunes y filtradas.",
      "avoid-sequences": "Evita secuencias como 123 o abc.",
      "avoid-repetition": "Evita patrones repetidos."
    }
  },
  "fr": {
    "suggestion": {
      "use-longer": "Utilisez un mot de passe ou une phrase plus long.",
      "add-uppercase": "Ajoutez des lettres majuscules.",
      "add-lowercase": "Ajoutez des lettres minuscules.",
      "add-numbers": "Ajoutez des chiffres.",
      "add-symbols": "Ajoutez des symboles.",
      "avoid-common": "Évitez les mots de passe courants et divulgués.",
      "avoid-sequences": "Évitez les séquences comme 123 ou abc.",
      "avoid-repetition": "Évitez les motifs répétitifs."
    }
  },
  "de": {
    "suggestion": {
      "use-longer": "Verwenden Sie ein längeres Passwort oder eine Passphrase.",
      "add-uppercase": "Fügen Sie Großbuchstaben hinzu.",
      "add-lowercase": "Fügen Sie Kleinbuchstaben hinzu.",
      "add-numbers": "Fügen Sie Zahlen hinzu.",
      "add-symbols": "Fügen Sie Symbole hinzu.",
      "avoid-common": "Vermeiden Sie häufige und geleakte Passwörter.",
      "avoid-sequences": "Vermeiden Sie Sequenzen wie 123 oder abc.",
      "avoid-repetition": "Vermeiden Sie wiederholte Muster."
    }
  },
  "it": {
    "suggestion": {
      "use-longer": "Usa una password o una passphrase più lunga.",
      "add-uppercase": "Aggiungi lettere maiuscole.",
      "add-lowercase": "Aggiungi lettere minuscole.",
      "add-numbers": "Aggiungi numeri.",
      "add-symbols": "Aggiungi simboli.",
      "avoid-common": "Evita password comuni o compromesse.",
      "avoid-sequences": "Evita sequenze come 123 o abc.",
      "avoid-repetition": "Evita pattern ripetuti."
    }
  },
  "ja": {
    "suggestion": {
      "use-longer": "より長いパスワードやパスフレーズを使用してください。",
      "add-uppercase": "大文字を追加してください。",
      "add-lowercase": "小文字を追加してください。",
      "add-numbers": "数字を追加してください。",
      "add-symbols": "記号を追加してください。",
      "avoid-common": "一般的または流出したパスワードを避けてください。",
      "avoid-sequences": "123 や abc のような連続を避けてください。",
      "avoid-repetition": "繰り返しパターンを避けてください。"
    }
  },
  "ko": {
    "suggestion": {
      "use-longer": "더 긴 비밀번호 또는 구문을 사용하세요.",
      "add-uppercase": "대문자를 추가하세요.",
      "add-lowercase": "소문자를 추가하세요.",
      "add-numbers": "숫자를 추가하세요.",
      "add-symbols": "기호를 추가하세요.",
      "avoid-common": "흔하거나 유출된 비밀번호를 피하세요.",
      "avoid-sequences": "123 또는 abc 같은 연속을 피하세요.",
      "avoid-repetition": "반복 패턴을 피하세요."
    }
  },
  "ru": {
    "suggestion": {
      "use-longer": "Используйте более длинный пароль или фразу.",
      "add-uppercase": "Добавьте заглавные буквы.",
      "add-lowercase": "Добавьте строчные буквы.",
      "add-numbers": "Добавьте цифры.",
      "add-symbols": "Добавьте символы.",
      "avoid-common": "Избегайте распространенных и утекших паролей.",
      "avoid-sequences": "Избегайте последовательностей вроде 123 или abc.",
      "avoid-repetition": "Избегайте повторяющихся шаблонов."
    }
  },
  "pt": {
    "suggestion": {
      "use-longer": "Use uma senha ou frase mais longa.",
      "add-uppercase": "Adicione letras maiúsculas.",
      "add-lowercase": "Adicione letras minúsculas.",
      "add-numbers": "Adicione números.",
      "add-symbols": "Adicione símbolos.",
      "avoid-common": "Evite senhas comuns e vazadas.",
      "avoid-sequences": "Evite sequências como 123 ou abc.",
      "avoid-repetition": "Evite padrões repetidos."
    }
  },
  "ar": {
    "suggestion": {
      "use-longer": "استخدم كلمة مرور أو عبارة أطول.",
      "add-uppercase": "أضف أحرفًا كبيرة.",
      "add-lowercase": "أضف أحرفًا صغيرة.",
      "add-numbers": "أضف أرقامًا.",
      "add-symbols": "أضف رموزًا.",
      "avoid-common": "تجنب كلمات المرور الشائعة أو المسرّبة.",
      "avoid-sequences": "تجنب تسلسلات مثل 123 أو abc.",
      "avoid-repetition": "تجنب الأنماط المتكررة."
    }
  },
  "hi": {
    "suggestion": {
      "use-longer": "लंबा पासवर्ड या पासफ्रेज़ इस्तेमाल करें।",
      "add-uppercase": "बड़े अक्षर जोड़ें।",
      "add-lowercase": "छोटे अक्षर जोड़ें।",
      "add-numbers": "संख्याएँ जोड़ें।",
      "add-symbols": "चिह्न जोड़ें।",
      "avoid-common": "आम या लीक हुए पासवर्ड से बचें।",
      "avoid-sequences": "123 या abc जैसे क्रम से बचें।",
      "avoid-repetition": "दोहराव पैटर्न से बचें।"
    }
  },
  "tr": {
    "suggestion": {
      "use-longer": "Daha uzun bir parola veya ifade kullanın.",
      "add-uppercase": "Büyük harf ekleyin.",
      "add-lowercase": "Küçük harf ekleyin.",
      "add-numbers": "Rakam ekleyin.",
      "add-symbols": "Sembol ekleyin.",
      "avoid-common": "Yaygın ve sızmış parolalardan kaçının.",
      "avoid-sequences": "123 veya abc gibi dizilerden kaçının.",
      "avoid-repetition": "Tekrarlayan desenlerden kaçının."
    }
  },
  "nl": {
    "suggestion": {
      "use-longer": "Gebruik een langer wachtwoord of wachtzin.",
      "add-uppercase": "Voeg hoofdletters toe.",
      "add-lowercase": "Voeg kleine letters toe.",
      "add-numbers": "Voeg cijfers toe.",
      "add-symbols": "Voeg symbolen toe.",
      "avoid-common": "Vermijd veelvoorkomende of gelekte wachtwoorden.",
      "avoid-sequences": "Vermijd reeksen zoals 123 of abc.",
      "avoid-repetition": "Vermijd herhaalde patronen."
    }
  },
  "sv": {
    "suggestion": {
      "use-longer": "Använd ett längre lösenord eller lösenfras.",
      "add-uppercase": "Lägg till versaler.",
      "add-lowercase": "Lägg till gemener.",
      "add-numbers": "Lägg till siffror.",
      "add-symbols": "Lägg till symboler.",
      "avoid-common": "Undvik vanliga eller läckta lösenord.",
      "avoid-sequences": "Undvik sekvenser som 123 eller abc.",
      "avoid-repetition": "Undvik upprepade mönster."
    }
  },
  "pl": {
    "suggestion": {
      "use-longer": "Użyj dłuższego hasła lub frazy.",
      "add-uppercase": "Dodaj wielkie litery.",
      "add-lowercase": "Dodaj małe litery.",
      "add-numbers": "Dodaj cyfry.",
      "add-symbols": "Dodaj symbole.",
      "avoid-common": "Unikaj popularnych lub wyciekłych haseł.",
      "avoid-sequences": "Unikaj sekwencji jak 123 lub abc.",
      "avoid-repetition": "Unikaj powtarzających się wzorców."
    }
  },
  "vi": {
    "suggestion": {
      "use-longer": "Dùng mật khẩu hoặc cụm từ dài hơn.",
      "add-uppercase": "Thêm chữ in hoa.",
      "add-lowercase": "Thêm chữ thường.",
      "add-numbers": "Thêm số.",
      "add-symbols": "Thêm ký hiệu.",
      "avoid-common": "Tránh mật khẩu phổ biến hoặc đã lộ.",
      "avoid-sequences": "Tránh chuỗi như 123 hoặc abc.",
      "avoid-repetition": "Tránh mẫu lặp lại."
    }
  },
  "th": {
    "suggestion": {
      "use-longer": "ใช้รหัสผ่านหรือวลีที่ยาวขึ้น",
      "add-uppercase": "เพิ่มตัวอักษรพิมพ์ใหญ่",
      "add-lowercase": "เพิ่มตัวอักษรพิมพ์เล็ก",
      "add-numbers": "เพิ่มตัวเลข",
      "add-symbols": "เพิ่มสัญลักษณ์",
      "avoid-common": "หลีกเลี่ยงรหัสผ่านยอดนิยมและที่รั่วไหล",
      "avoid-sequences": "หลีกเลี่ยงลำดับอย่าง 123 หรือ abc",
      "avoid-repetition": "หลีกเลี่ยงรูปแบบซ้ำ"
    }
  },
  "id": {
    "suggestion": {
      "use-longer": "Gunakan kata sandi atau frasa yang lebih panjang.",
      "add-uppercase": "Tambahkan huruf kapital.",
      "add-lowercase": "Tambahkan huruf kecil.",
      "add-numbers": "Tambahkan angka.",
      "add-symbols": "Tambahkan simbol.",
      "avoid-common": "Hindari kata sandi umum atau yang bocor.",
      "avoid-sequences": "Hindari urutan seperti 123 atau abc.",
      "avoid-repetition": "Hindari pola berulang."
    }
  },
  "he": {
    "suggestion": {
      "use-longer": "השתמש בסיסמה או ביטוי ארוכים יותר.",
      "add-uppercase": "הוסף אותיות גדולות.",
      "add-lowercase": "הוסף אותיות קטנות.",
      "add-numbers": "הוסף מספרים.",
      "add-symbols": "הוסף סמלים.",
      "avoid-common": "הימנע מסיסמאות נפוצות או דלופות.",
      "avoid-sequences": "הימנע מרצפים כמו 123 או abc.",
      "avoid-repetition": "הימנע מדפוסים חוזרים."
    }
  },
  "ms": {
    "suggestion": {
      "use-longer": "Gunakan kata laluan atau frasa yang lebih panjang.",
      "add-uppercase": "Tambah huruf besar.",
      "add-lowercase": "Tambah huruf kecil.",
      "add-numbers": "Tambah nombor.",
      "add-symbols": "Tambah simbol.",
      "avoid-common": "Elakkan kata laluan biasa atau yang bocor.",
      "avoid-sequences": "Elakkan jujukan seperti 123 atau abc.",
      "avoid-repetition": "Elakkan corak berulang."
    }
  },
  "no": {
    "suggestion": {
      "use-longer": "Bruk et lengre passord eller en passfrase.",
      "add-uppercase": "Legg til store bokstaver.",
      "add-lowercase": "Legg til små bokstaver.",
      "add-numbers": "Legg til tall.",
      "add-symbols": "Legg til symboler.",
      "avoid-common": "Unngå vanlige eller lekkede passord.",
      "avoid-sequences": "Unngå sekvenser som 123 eller abc.",
      "avoid-repetition": "Unngå gjentatte mønstre."
    }
  }
}
</i18n>
