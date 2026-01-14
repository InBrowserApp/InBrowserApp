<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('description') }}</n-text>
    <n-ul style="margin-top: 12px">
      <n-li>{{ t('point-1') }}</n-li>
      <n-li>{{ t('point-2') }}</n-li>
      <n-li>{{ t('point-3') }}</n-li>
    </n-ul>
    <n-text style="margin-top: 12px; display: block">{{ t('tip') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText, NUl, NLi } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is Password Strength?",
    "description": "Password strength describes how resistant a password is to guessing and cracking attacks.",
    "point-1": "Longer passphrases increase entropy and are easier to remember.",
    "point-2": "Mixing uppercase, lowercase, numbers, and symbols improves variety.",
    "point-3": "Avoid reused, common, or leaked passwords.",
    "tip": "Use a password manager to generate and store unique passwords."
  },
  "zh": {
    "title": "什么是密码强度？",
    "description": "密码强度描述密码抵抗猜测和破解攻击的能力。",
    "point-1": "更长的口令短语熵更高，也更容易记住。",
    "point-2": "混合大小写、数字和符号可以增加多样性。",
    "point-3": "避免重复使用、常见或已泄露的密码。",
    "tip": "使用密码管理器生成并保存唯一密码。"
  },
  "zh-CN": {
    "title": "什么是密码强度？",
    "description": "密码强度描述密码抵抗猜测和破解攻击的能力。",
    "point-1": "更长的口令短语熵更高，也更容易记住。",
    "point-2": "混合大小写、数字和符号可以增加多样性。",
    "point-3": "避免重复使用、常见或已泄露的密码。",
    "tip": "使用密码管理器生成并保存唯一密码。"
  },
  "zh-TW": {
    "title": "什麼是密碼強度？",
    "description": "密碼強度描述密碼抵抗猜測與破解攻擊的能力。",
    "point-1": "更長的口令短語熵更高，也更容易記住。",
    "point-2": "混合大小寫、數字與符號可增加多樣性。",
    "point-3": "避免重複使用、常見或已洩露的密碼。",
    "tip": "使用密碼管理器產生並保存唯一密碼。"
  },
  "zh-HK": {
    "title": "乜嘢係密碼強度？",
    "description": "密碼強度描述密碼抵抗猜測同破解攻擊嘅能力。",
    "point-1": "更長嘅口令短語熵更高，亦更容易記住。",
    "point-2": "混合大小寫、數字同符號可增加多樣性。",
    "point-3": "避免重複使用、常見或已洩露嘅密碼。",
    "tip": "使用密碼管理器生成並保存唯一密碼。"
  },
  "es": {
    "title": "¿Qué es la fuerza de una contraseña?",
    "description": "La fuerza de la contraseña describe qué tan resistente es ante intentos de adivinación o cracking.",
    "point-1": "Las frases más largas aumentan la entropía y son más fáciles de recordar.",
    "point-2": "Mezclar mayúsculas, minúsculas, números y símbolos mejora la variedad.",
    "point-3": "Evita contraseñas reutilizadas, comunes o filtradas.",
    "tip": "Usa un gestor de contraseñas para generar y guardar contraseñas únicas."
  },
  "fr": {
    "title": "Qu'est-ce que la robustesse d'un mot de passe ?",
    "description": "La robustesse décrit la résistance d'un mot de passe aux tentatives de devinette ou de cassage.",
    "point-1": "Les phrases longues augmentent l'entropie et sont plus faciles à retenir.",
    "point-2": "Mélanger majuscules, minuscules, chiffres et symboles améliore la variété.",
    "point-3": "Évitez les mots de passe réutilisés, courants ou divulgués.",
    "tip": "Utilisez un gestionnaire pour générer et stocker des mots de passe uniques."
  },
  "de": {
    "title": "Was ist Passwortstärke?",
    "description": "Die Passwortstärke beschreibt, wie widerstandsfähig ein Passwort gegen Raten und Knacken ist.",
    "point-1": "Längere Passphrasen erhöhen die Entropie und sind leichter zu merken.",
    "point-2": "Eine Mischung aus Großbuchstaben, Kleinbuchstaben, Zahlen und Symbolen erhöht die Vielfalt.",
    "point-3": "Vermeiden Sie wiederverwendete, häufige oder geleakte Passwörter.",
    "tip": "Nutzen Sie einen Passwortmanager, um einzigartige Passwörter zu erstellen und zu speichern."
  },
  "it": {
    "title": "Che cos'è la forza di una password?",
    "description": "La forza della password descrive quanto resiste ai tentativi di indovinare o di cracking.",
    "point-1": "Frasi più lunghe aumentano l'entropia e sono più facili da ricordare.",
    "point-2": "Mescolare maiuscole, minuscole, numeri e simboli aumenta la varietà.",
    "point-3": "Evita password riutilizzate, comuni o compromesse.",
    "tip": "Usa un password manager per generare e salvare password uniche."
  },
  "ja": {
    "title": "パスワード強度とは？",
    "description": "パスワード強度は、推測や解析攻撃にどれだけ耐えられるかを示します。",
    "point-1": "長いパスフレーズはエントロピーが高く、覚えやすいです。",
    "point-2": "大文字・小文字・数字・記号の混在で多様性が増えます。",
    "point-3": "使い回しや一般的、流出したパスワードは避けましょう。",
    "tip": "パスワードマネージャーで一意のパスワードを生成・保管しましょう。"
  },
  "ko": {
    "title": "비밀번호 강도란?",
    "description": "비밀번호 강도는 추측이나 크래킹 공격에 얼마나 잘 견디는지를 나타냅니다.",
    "point-1": "더 긴 문구는 엔트로피를 높이고 기억하기 쉽습니다.",
    "point-2": "대문자, 소문자, 숫자, 기호를 섞으면 다양성이 향상됩니다.",
    "point-3": "재사용되었거나 흔한, 유출된 비밀번호는 피하세요.",
    "tip": "비밀번호 관리자 사용으로 고유한 비밀번호를 생성하고 저장하세요."
  },
  "ru": {
    "title": "Что такое стойкость пароля?",
    "description": "Стойкость пароля показывает, насколько он устойчив к угадыванию и взлому.",
    "point-1": "Длинные фразы повышают энтропию и проще запоминаются.",
    "point-2": "Смешивание букв разного регистра, цифр и символов повышает разнообразие.",
    "point-3": "Избегайте повторного использования, распространенных или утекших паролей.",
    "tip": "Используйте менеджер паролей для создания и хранения уникальных паролей."
  },
  "pt": {
    "title": "O que é força de senha?",
    "description": "A força da senha indica o quanto ela resiste a tentativas de adivinhação ou quebra.",
    "point-1": "Frases mais longas aumentam a entropia e são mais fáceis de lembrar.",
    "point-2": "Misturar maiúsculas, minúsculas, números e símbolos aumenta a variedade.",
    "point-3": "Evite senhas reutilizadas, comuns ou vazadas.",
    "tip": "Use um gerenciador para gerar e armazenar senhas únicas."
  },
  "ar": {
    "title": "ما هي قوة كلمة المرور؟",
    "description": "قوة كلمة المرور تصف مدى مقاومتها للتخمين والكسر.",
    "point-1": "العبارات الأطول تزيد الإنتروبيا وأسهل في التذكر.",
    "point-2": "مزج الأحرف الكبيرة والصغيرة والأرقام والرموز يزيد التنوع.",
    "point-3": "تجنب كلمات المرور المعاد استخدامها أو الشائعة أو المسرّبة.",
    "tip": "استخدم مدير كلمات مرور لإنشاء كلمات مرور فريدة وحفظها."
  },
  "hi": {
    "title": "पासवर्ड की मजबूती क्या है?",
    "description": "पासवर्ड की मजबूती बताती है कि वह अनुमान और क्रैकिंग हमलों के खिलाफ कितना मजबूत है।",
    "point-1": "लंबी पासफ्रेज़ एंट्रॉपी बढ़ाती है और याद रखना आसान बनाती है।",
    "point-2": "बड़े अक्षर, छोटे अक्षर, संख्याएं और प्रतीक मिलाने से विविधता बढ़ती है।",
    "point-3": "पुनः उपयोग किए गए, आम या लीक हुए पासवर्ड से बचें।",
    "tip": "एक पासवर्ड मैनेजर से अद्वितीय पासवर्ड बनाएं और सहेजें।"
  },
  "tr": {
    "title": "Parola gücü nedir?",
    "description": "Parola gücü, tahmin ve kırma saldırılarına karşı dayanıklılığı ifade eder.",
    "point-1": "Daha uzun parolalar entropiyi artırır ve hatırlaması daha kolaydır.",
    "point-2": "Büyük/küçük harf, sayı ve sembol karışımı çeşitliliği artırır.",
    "point-3": "Yeniden kullanılan, yaygın ya da sızmış parolalardan kaçının.",
    "tip": "Benzersiz parolalar için parola yöneticisi kullanın."
  },
  "nl": {
    "title": "Wat is wachtwoordsterkte?",
    "description": "Wachtwoordsterkte geeft aan hoe goed een wachtwoord bestand is tegen raden en kraken.",
    "point-1": "Langere wachtzinnen verhogen de entropie en zijn makkelijker te onthouden.",
    "point-2": "Een mix van hoofdletters, kleine letters, cijfers en symbolen vergroot de variatie.",
    "point-3": "Vermijd hergebruikte, veelvoorkomende of gelekte wachtwoorden.",
    "tip": "Gebruik een wachtwoordmanager om unieke wachtwoorden te maken en bewaren."
  },
  "sv": {
    "title": "Vad är lösenordsstyrka?",
    "description": "Lösenordsstyrka beskriver hur motståndskraftigt ett lösenord är mot gissning och knäckning.",
    "point-1": "Längre lösenfraser ökar entropin och är lättare att komma ihåg.",
    "point-2": "Blanda stora/små bokstäver, siffror och symboler för bättre variation.",
    "point-3": "Undvik återanvända, vanliga eller läckta lösenord.",
    "tip": "Använd en lösenordshanterare för unika lösenord."
  },
  "pl": {
    "title": "Czym jest siła hasła?",
    "description": "Siła hasła opisuje odporność na zgadywanie i łamanie.",
    "point-1": "Dłuższe frazy zwiększają entropię i są łatwiejsze do zapamiętania.",
    "point-2": "Mieszanie wielkich liter, małych liter, cyfr i symboli zwiększa różnorodność.",
    "point-3": "Unikaj haseł używanych ponownie, popularnych lub ujawnionych.",
    "tip": "Korzystaj z menedżera haseł do tworzenia i przechowywania unikalnych haseł."
  },
  "vi": {
    "title": "Độ mạnh mật khẩu là gì?",
    "description": "Độ mạnh mật khẩu thể hiện mức độ chống lại đoán và bẻ khóa.",
    "point-1": "Cụm từ dài hơn tăng entropy và dễ nhớ hơn.",
    "point-2": "Trộn chữ hoa, chữ thường, số và ký hiệu giúp tăng đa dạng.",
    "point-3": "Tránh mật khẩu tái sử dụng, phổ biến hoặc bị lộ.",
    "tip": "Dùng trình quản lý mật khẩu để tạo và lưu mật khẩu duy nhất."
  },
  "th": {
    "title": "ความแข็งแรงของรหัสผ่านคืออะไร?",
    "description": "ความแข็งแรงของรหัสผ่านบอกถึงการต้านทานต่อการเดาและการแคร็ก.",
    "point-1": "วลีที่ยาวขึ้นเพิ่มเอนโทรปีและจำง่ายกว่า.",
    "point-2": "ผสมตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และสัญลักษณ์ช่วยเพิ่มความหลากหลาย.",
    "point-3": "หลีกเลี่ยงรหัสผ่านที่ใช้ซ้ำ เป็นที่นิยม หรือรั่วไหล.",
    "tip": "ใช้โปรแกรมจัดการรหัสผ่านเพื่อสร้างและเก็บรหัสผ่านที่ไม่ซ้ำ."
  },
  "id": {
    "title": "Apa itu kekuatan kata sandi?",
    "description": "Kekuatan kata sandi menunjukkan ketahanannya terhadap tebakan dan cracking.",
    "point-1": "Frasa yang lebih panjang meningkatkan entropi dan lebih mudah diingat.",
    "point-2": "Menggabungkan huruf besar, kecil, angka, dan simbol meningkatkan variasi.",
    "point-3": "Hindari kata sandi yang digunakan ulang, umum, atau bocor.",
    "tip": "Gunakan pengelola kata sandi untuk membuat dan menyimpan kata sandi unik."
  },
  "he": {
    "title": "מהו חוזק סיסמה?",
    "description": "חוזק סיסמה מתאר עד כמה היא עמידה לניחוש ולפריצה.",
    "point-1": "ביטויים ארוכים יותר מעלים את האנטרופיה וקלים יותר לזכור.",
    "point-2": "שילוב אותיות גדולות, קטנות, מספרים וסמלים מגביר את הגיוון.",
    "point-3": "הימנעו מסיסמאות חוזרות, נפוצות או דלופות.",
    "tip": "השתמשו במנהל סיסמאות ליצירה ושמירה של סיסמאות ייחודיות."
  },
  "ms": {
    "title": "Apakah kekuatan kata laluan?",
    "description": "Kekuatan kata laluan menunjukkan ketahanan terhadap tekaan dan pemecahan.",
    "point-1": "Frasa lebih panjang meningkatkan entropi dan lebih mudah diingati.",
    "point-2": "Gabungan huruf besar, huruf kecil, nombor dan simbol menambah variasi.",
    "point-3": "Elakkan kata laluan yang digunakan semula, biasa atau bocor.",
    "tip": "Gunakan pengurus kata laluan untuk menjana dan menyimpan kata laluan unik."
  },
  "no": {
    "title": "Hva er passordstyrke?",
    "description": "Passordstyrke beskriver hvor motstandsdyktig et passord er mot gjetting og knekking.",
    "point-1": "Lengre passfraser gir høyere entropi og er lettere å huske.",
    "point-2": "Blanding av store/små bokstaver, tall og symboler øker variasjonen.",
    "point-3": "Unngå gjenbrukte, vanlige eller lekkede passord.",
    "tip": "Bruk en passordbehandler til å lage og lagre unike passord."
  }
}
</i18n>
