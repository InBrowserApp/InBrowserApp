<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What are SHA-256 and MD5 fingerprints?",
    "description": "SSH fingerprints are hashes of a public key used to compare keys safely.\n\n- **SHA-256**: modern default, shown as base64.\n- **MD5**: legacy format, shown as hex with colons."
  },
  "zh": {
    "title": "什么是 SHA-256 和 MD5 指纹？",
    "description": "SSH 指纹是公钥的哈希，用于安全地比对密钥。\n\n- **SHA-256**：现代默认格式，以 base64 显示。\n- **MD5**：旧式格式，以带冒号的十六进制显示。"
  },
  "zh-CN": {
    "title": "什么是 SHA-256 和 MD5 指纹？",
    "description": "SSH 指纹是公钥的哈希，用于安全地比对密钥。\n\n- **SHA-256**：现代默认格式，以 base64 显示。\n- **MD5**：旧式格式，以带冒号的十六进制显示。"
  },
  "zh-TW": {
    "title": "什麼是 SHA-256 與 MD5 指紋？",
    "description": "SSH 指紋是公鑰的雜湊，用於安全地比對金鑰。\n\n- **SHA-256**：現代預設格式，以 base64 顯示。\n- **MD5**：舊式格式，以帶冒號的十六進位顯示。"
  },
  "zh-HK": {
    "title": "什麼是 SHA-256 與 MD5 指紋？",
    "description": "SSH 指紋是公鑰的雜湊，用於安全地比對密鑰。\n\n- **SHA-256**：現代預設格式，以 base64 顯示。\n- **MD5**：舊式格式，以帶冒號的十六進位顯示。"
  },
  "es": {
    "title": "¿Qué son las huellas SHA-256 y MD5?",
    "description": "Las huellas SSH son hashes de una clave pública usados para comparar claves de forma segura.\n\n- **SHA-256**: formato moderno por defecto, se muestra en base64.\n- **MD5**: formato heredado, se muestra en hex con dos puntos."
  },
  "fr": {
    "title": "Que sont les empreintes SHA-256 et MD5 ?",
    "description": "Les empreintes SSH sont des hashes d'une clé publique utilisés pour comparer les clés en toute sécurité.\n\n- **SHA-256** : format moderne par défaut, affiché en base64.\n- **MD5** : format hérité, affiché en hexadécimal avec des deux-points."
  },
  "de": {
    "title": "Was sind SHA-256- und MD5-Fingerabdrücke?",
    "description": "SSH-Fingerabdrücke sind Hashes eines öffentlichen Schlüssels, die zum sicheren Vergleichen von Schlüsseln dienen.\n\n- **SHA-256**: moderner Standard, als base64 angezeigt.\n- **MD5**: veraltetes Format, als Hex mit Doppelpunkten angezeigt."
  },
  "it": {
    "title": "Cosa sono le impronte SHA-256 e MD5?",
    "description": "Le impronte SSH sono hash di una chiave pubblica usati per confrontare le chiavi in modo sicuro.\n\n- **SHA-256**: formato moderno predefinito, mostrato in base64.\n- **MD5**: formato legacy, mostrato in esadecimale con due punti."
  },
  "ja": {
    "title": "SHA-256 と MD5 のフィンガープリントとは？",
    "description": "SSH フィンガープリントは公開鍵のハッシュで、安全に鍵を比較するために使われます。\n\n- **SHA-256**：現代のデフォルトで、base64 表記。\n- **MD5**：レガシー形式で、コロン区切りの16進表記。"
  },
  "ko": {
    "title": "SHA-256 및 MD5 지문이란?",
    "description": "SSH 지문은 공개 키의 해시로, 키를 안전하게 비교할 때 사용합니다.\n\n- **SHA-256**: 현대 기본 형식이며 base64로 표시됩니다.\n- **MD5**: 레거시 형식이며 콜론 구분 16진수로 표시됩니다."
  },
  "ru": {
    "title": "Что такое отпечатки SHA-256 и MD5?",
    "description": "SSH-отпечатки — это хеши публичного ключа, которые используют для безопасного сравнения ключей.\n\n- **SHA-256**: современный формат по умолчанию, отображается в base64.\n- **MD5**: устаревший формат, отображается в hex с двоеточиями."
  },
  "pt": {
    "title": "O que são impressões digitais SHA-256 e MD5?",
    "description": "As impressões digitais SSH são hashes de uma chave pública usados para comparar chaves com segurança.\n\n- **SHA-256**: formato moderno padrão, exibido em base64.\n- **MD5**: formato legado, exibido em hex com dois-pontos."
  },
  "ar": {
    "title": "ما هي بصمات SHA-256 وMD5؟",
    "description": "بصمات SSH هي قيم هاش لمفتاح عام تُستخدم لمقارنة المفاتيح بأمان.\n\n- **SHA-256**: التنسيق الحديث الافتراضي، معروض بصيغة base64.\n- **MD5**: تنسيق قديم، معروض بصيغة سداسية مع نقطتين."
  },
  "hi": {
    "title": "SHA-256 और MD5 फ़िंगरप्रिंट क्या हैं?",
    "description": "SSH फ़िंगरप्रिंट सार्वजनिक कुंजी के हैश होते हैं, जिनका उपयोग कुंजियों को सुरक्षित रूप से तुलना करने के लिए किया जाता है।\n\n- **SHA-256**: आधुनिक डिफ़ॉल्ट प्रारूप, base64 में दिखाया जाता है।\n- **MD5**: पुराना प्रारूप, कोलन वाले हेक्स में दिखाया जाता है।"
  },
  "tr": {
    "title": "SHA-256 ve MD5 parmak izleri nedir?",
    "description": "SSH parmak izleri, anahtarları güvenle karşılaştırmak için kullanılan genel anahtar hashleridir.\n\n- **SHA-256**: modern varsayılan biçim, base64 olarak gösterilir.\n- **MD5**: eski biçim, iki noktalı hex olarak gösterilir."
  },
  "nl": {
    "title": "Wat zijn SHA-256- en MD5-vingerafdrukken?",
    "description": "SSH-vingerafdrukken zijn hashes van een publieke sleutel die worden gebruikt om sleutels veilig te vergelijken.\n\n- **SHA-256**: moderne standaard, weergegeven in base64.\n- **MD5**: verouderd formaat, weergegeven in hex met dubbele punten."
  },
  "sv": {
    "title": "Vad är SHA-256- och MD5-fingeravtryck?",
    "description": "SSH-fingeravtryck är hashvärden av en publik nyckel som används för att jämföra nycklar säkert.\n\n- **SHA-256**: modern standard, visas i base64.\n- **MD5**: äldre format, visas i hex med kolon."
  },
  "pl": {
    "title": "Czym są odciski SHA-256 i MD5?",
    "description": "Odciski SSH to hasze klucza publicznego używane do bezpiecznego porównywania kluczy.\n\n- **SHA-256**: nowoczesny domyślny format, wyświetlany w base64.\n- **MD5**: starszy format, wyświetlany w hex z dwukropkami."
  },
  "vi": {
    "title": "Dấu vân tay SHA-256 và MD5 là gì?",
    "description": "Dấu vân tay SSH là các giá trị băm của khóa công khai dùng để so sánh khóa an toàn.\n\n- **SHA-256**: định dạng hiện đại mặc định, hiển thị ở base64.\n- **MD5**: định dạng cũ, hiển thị ở hex có dấu hai chấm."
  },
  "th": {
    "title": "ลายนิ้วมือ SHA-256 และ MD5 คืออะไร?",
    "description": "ลายนิ้วมือ SSH คือค่าแฮชของคีย์สาธารณะ ใช้เพื่อเปรียบเทียบคีย์อย่างปลอดภัย\n\n- **SHA-256**: รูปแบบเริ่มต้นสมัยใหม่ แสดงเป็น base64\n- **MD5**: รูปแบบเดิม แสดงเป็นเลขฐานสิบหกคั่นด้วยโคลอน"
  },
  "id": {
    "title": "Apa itu sidik jari SHA-256 dan MD5?",
    "description": "Sidik jari SSH adalah hash dari kunci publik yang digunakan untuk membandingkan kunci dengan aman.\n\n- **SHA-256**: format modern bawaan, ditampilkan dalam base64.\n- **MD5**: format lama, ditampilkan dalam hex dengan tanda titik dua."
  },
  "he": {
    "title": "מהם טביעות אצבע SHA-256 ו-MD5?",
    "description": "טביעות אצבע של SSH הן ערכי האש של מפתח ציבורי המשמשים להשוואה בטוחה של מפתחות.\n\n- **SHA-256**: פורמט מודרני כברירת מחדל, מוצג ב-base64.\n- **MD5**: פורמט ישן, מוצג בהקס עם נקודתיים."
  },
  "ms": {
    "title": "Apakah cap jari SHA-256 dan MD5?",
    "description": "Cap jari SSH ialah hash kunci awam yang digunakan untuk membandingkan kunci dengan selamat.\n\n- **SHA-256**: format moden lalai, dipaparkan dalam base64.\n- **MD5**: format lama, dipaparkan dalam hex dengan tanda noktah berganda."
  },
  "no": {
    "title": "Hva er SHA-256- og MD5-fingeravtrykk?",
    "description": "SSH-fingeravtrykk er hasher av en offentlig nøkkel som brukes for å sammenligne nøkler sikkert.\n\n- **SHA-256**: moderne standard, vist i base64.\n- **MD5**: eldre format, vist i hex med kolon."
  }
}
</i18n>
