<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description') }}</NText>

    <NH3>{{ t('checksTitle') }}</NH3>
    <NOl>
      <NLi>{{ t('check1') }}</NLi>
      <NLi>{{ t('check2') }}</NLi>
      <NLi>{{ t('check3') }}</NLi>
    </NOl>

    <NText tag="p">{{ t('note') }}</NText>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText, NH3, NOl, NLi } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What does this validator check?",
    "description": "This tool validates email address syntax. It does not verify mailbox deliverability.",
    "checksTitle": "Checks performed",
    "check1": "Single {'@'} with local and domain parts",
    "check2": "Local part characters, dot placement, and length",
    "check3": "Domain labels, hyphen rules, and top-level domain",
    "note": "Internationalized domains must be in Punycode (ASCII)."
  },
  "zh": {
    "title": "这个验证器检查什么？",
    "description": "该工具仅验证邮箱地址语法，不验证邮箱是否存在。",
    "checksTitle": "检查项",
    "check1": "单个 {'@'}，包含本地部分和域名",
    "check2": "本地部分字符、点的位置与长度",
    "check3": "域名标签、连字符规则与顶级域名",
    "note": "国际化域名需要使用 Punycode（ASCII）。"
  },
  "zh-CN": {
    "title": "这个验证器检查什么？",
    "description": "该工具仅验证邮箱地址语法，不验证邮箱是否存在。",
    "checksTitle": "检查项",
    "check1": "单个 {'@'}，包含本地部分和域名",
    "check2": "本地部分字符、点的位置与长度",
    "check3": "域名标签、连字符规则与顶级域名",
    "note": "国际化域名需要使用 Punycode（ASCII）。"
  },
  "zh-TW": {
    "title": "這個驗證器檢查什麼？",
    "description": "此工具僅驗證電子郵件語法，不驗證郵箱是否存在。",
    "checksTitle": "檢查項目",
    "check1": "單一 {'@'}，包含本地部分與網域",
    "check2": "本地部分字元、點的位置與長度",
    "check3": "網域標籤、連字號規則與頂級網域",
    "note": "國際化網域需使用 Punycode（ASCII）。"
  },
  "zh-HK": {
    "title": "這個驗證器檢查甚麼？",
    "description": "此工具只驗證電郵語法，不會驗證郵箱是否存在。",
    "checksTitle": "檢查項目",
    "check1": "單一 {'@'}，包含本地部分與網域",
    "check2": "本地部分字元、點的位置與長度",
    "check3": "網域標籤、連字號規則與頂級網域",
    "note": "國際化網域需使用 Punycode（ASCII）。"
  },
  "es": {
    "title": "¿Qué comprueba este validador?",
    "description": "Esta herramienta valida la sintaxis del correo electrónico. No verifica la existencia del buzón.",
    "checksTitle": "Comprobaciones",
    "check1": "Un solo {'@'} con parte local y dominio",
    "check2": "Caracteres, puntos y longitud de la parte local",
    "check3": "Etiquetas de dominio, reglas de guiones y TLD",
    "note": "Los dominios internacionalizados deben estar en Punycode (ASCII)."
  },
  "fr": {
    "title": "Que vérifie ce validateur ?",
    "description": "Cet outil valide la syntaxe des adresses e-mail. Il ne vérifie pas l'existence de la boîte.",
    "checksTitle": "Vérifications",
    "check1": "Un seul {'@'} avec partie locale et domaine",
    "check2": "Caractères, points et longueur de la partie locale",
    "check3": "Étiquettes de domaine, règles de tirets et TLD",
    "note": "Les domaines internationalisés doivent être en Punycode (ASCII)."
  },
  "de": {
    "title": "Was prüft dieser Validator?",
    "description": "Dieses Tool prüft die E-Mail-Syntax. Es bestätigt nicht die Zustellbarkeit.",
    "checksTitle": "Prüfungen",
    "check1": "Genau ein {'@'} mit lokalem Teil und Domain",
    "check2": "Zeichen, Punktsetzung und Länge des lokalen Teils",
    "check3": "Domain-Labels, Bindestrichregeln und TLD",
    "note": "Internationalisierte Domains müssen in Punycode (ASCII) vorliegen."
  },
  "it": {
    "title": "Cosa verifica questo validatore?",
    "description": "Questo strumento valida la sintassi delle email. Non verifica l'esistenza della casella.",
    "checksTitle": "Controlli eseguiti",
    "check1": "Un solo {'@'} con parte locale e dominio",
    "check2": "Caratteri, punti e lunghezza della parte locale",
    "check3": "Etichette di dominio, regole dei trattini e TLD",
    "note": "I domini internazionalizzati devono essere in Punycode (ASCII)."
  },
  "ja": {
    "title": "この検証で何を確認しますか？",
    "description": "このツールはメールアドレスの構文のみを確認します。配信可否は確認しません。",
    "checksTitle": "チェック内容",
    "check1": "ローカル部とドメインを含む単一の {'@'}",
    "check2": "ローカル部の文字・ドット配置・長さ",
    "check3": "ドメインラベル、ハイフン規則、TLD",
    "note": "国際化ドメインは Punycode（ASCII）である必要があります。"
  },
  "ko": {
    "title": "이 검증기는 무엇을 확인하나요?",
    "description": "이 도구는 이메일 주소의 문법만 검증합니다. 실제 존재 여부는 확인하지 않습니다.",
    "checksTitle": "검사 항목",
    "check1": "로컬 부분과 도메인이 있는 단일 {'@'}",
    "check2": "로컬 부분 문자, 점 위치, 길이",
    "check3": "도메인 레이블, 하이픈 규칙, TLD",
    "note": "국제화 도메인은 Punycode(ASCII)여야 합니다."
  },
  "ru": {
    "title": "Что проверяет этот валидатор?",
    "description": "Инструмент проверяет только синтаксис email. Доставляемость не проверяется.",
    "checksTitle": "Проверки",
    "check1": "Один символ {'@'} с локальной частью и доменом",
    "check2": "Символы, точки и длина локальной части",
    "check3": "Метки домена, правила дефисов и TLD",
    "note": "Интернационализированные домены должны быть в Punycode (ASCII)."
  },
  "pt": {
    "title": "O que este validador verifica?",
    "description": "Esta ferramenta valida a sintaxe de e-mails. Não verifica a existência da caixa.",
    "checksTitle": "Verificações",
    "check1": "Um único {'@'} com parte local e domínio",
    "check2": "Caracteres, pontos e comprimento da parte local",
    "check3": "Rótulos de domínio, regras de hífen e TLD",
    "note": "Domínios internacionalizados devem estar em Punycode (ASCII)."
  },
  "ar": {
    "title": "ماذا يتحقق هذا المدقق؟",
    "description": "تتحقق هذه الأداة من صياغة البريد الإلكتروني فقط، ولا تتحقق من وجود الصندوق.",
    "checksTitle": "عمليات الفحص",
    "check1": "رمز {'@'} واحد مع الجزء المحلي والنطاق",
    "check2": "حروف الجزء المحلي والنقاط والطول",
    "check3": "تسميات النطاق وقواعد الشرطات و TLD",
    "note": "يجب أن تكون النطاقات الدولية بصيغة Punycode (ASCII)."
  },
  "hi": {
    "title": "यह सत्यापनकर्ता क्या जांचता है?",
    "description": "यह उपकरण केवल ईमेल की सिंटैक्स जांचता है। यह डिलीवरी की पुष्टि नहीं करता।",
    "checksTitle": "जांचें",
    "check1": "लोकल भाग और डोमेन के साथ एक ही {'@'}",
    "check2": "लोकल भाग के अक्षर, डॉट स्थिति और लंबाई",
    "check3": "डोमेन लेबल, हाइफ़न नियम और TLD",
    "note": "अंतरराष्ट्रीय डोमेन Punycode (ASCII) में होने चाहिए।"
  },
  "tr": {
    "title": "Bu doğrulayıcı neyi kontrol eder?",
    "description": "Bu araç yalnızca e-posta sözdizimini doğrular. Teslim edilebilirliği kontrol etmez.",
    "checksTitle": "Yapılan kontroller",
    "check1": "Yerel bölüm ve alan adı ile tek bir {'@'}",
    "check2": "Yerel bölüm karakterleri, nokta yerleşimi ve uzunluk",
    "check3": "Alan adı etiketleri, tire kuralları ve TLD",
    "note": "Uluslararası alan adları Punycode (ASCII) olmalıdır."
  },
  "nl": {
    "title": "Wat controleert deze validator?",
    "description": "Deze tool valideert alleen de e-mailsyntax. Hij controleert niet of de mailbox bestaat.",
    "checksTitle": "Controles",
    "check1": "Eén {'@'} met lokaal deel en domein",
    "check2": "Tekens, punten en lengte van het lokale deel",
    "check3": "Domeinlabels, koppeltekens en TLD",
    "note": "Geïnternationaliseerde domeinen moeten in Punycode (ASCII) staan."
  },
  "sv": {
    "title": "Vad kontrollerar den här valideraren?",
    "description": "Det här verktyget validerar bara e-postsyntax. Det kontrollerar inte leveransbarhet.",
    "checksTitle": "Kontroller",
    "check1": "Ett enda {'@'} med lokal del och domän",
    "check2": "Tecken, punkter och längd i den lokala delen",
    "check3": "Domänetiketter, bindestrecksregler och TLD",
    "note": "Internationaliserade domäner måste vara i Punycode (ASCII)."
  },
  "pl": {
    "title": "Co sprawdza ten walidator?",
    "description": "To narzędzie sprawdza tylko składnię e-maili. Nie potwierdza istnienia skrzynki.",
    "checksTitle": "Sprawdzenia",
    "check1": "Jeden znak {'@'} z częścią lokalną i domeną",
    "check2": "Znaki, kropki i długość części lokalnej",
    "check3": "Etykiety domen, zasady myślników i TLD",
    "note": "Domeny umiędzynarodowione muszą być w Punycode (ASCII)."
  },
  "vi": {
    "title": "Trình xác thực này kiểm tra gì?",
    "description": "Công cụ này chỉ kiểm tra cú pháp email. Không xác minh hộp thư có tồn tại.",
    "checksTitle": "Các kiểm tra",
    "check1": "Một {'@'} duy nhất với phần cục bộ và tên miền",
    "check2": "Ký tự, dấu chấm và độ dài của phần cục bộ",
    "check3": "Nhãn tên miền, quy tắc dấu gạch nối và TLD",
    "note": "Tên miền quốc tế phải ở dạng Punycode (ASCII)."
  },
  "th": {
    "title": "ตัวตรวจสอบนี้ตรวจอะไรบ้าง?",
    "description": "เครื่องมือนี้ตรวจสอบเฉพาะไวยากรณ์ของอีเมล ไม่ได้ยืนยันว่ามีอยู่จริง",
    "checksTitle": "รายการตรวจสอบ",
    "check1": "มี {'@'} เพียงตัวเดียว พร้อมส่วนโลคัลและโดเมน",
    "check2": "อักขระ ตำแหน่งจุด และความยาวของส่วนโลคัล",
    "check3": "ป้ายชื่อโดเมน กฎเครื่องหมายขีดกลาง และ TLD",
    "note": "โดเมนสากลต้องเป็น Punycode (ASCII)"
  },
  "id": {
    "title": "Apa yang diperiksa validator ini?",
    "description": "Alat ini hanya memvalidasi sintaks email. Tidak memeriksa keberadaan kotak surat.",
    "checksTitle": "Pemeriksaan",
    "check1": "Satu {'@'} dengan bagian lokal dan domain",
    "check2": "Karakter, titik, dan panjang bagian lokal",
    "check3": "Label domain, aturan tanda hubung, dan TLD",
    "note": "Domain internasional harus dalam Punycode (ASCII)."
  },
  "he": {
    "title": "מה בודק המאמת הזה?",
    "description": "הכלי בודק רק את תחביר הדוא\"ל. הוא לא מאמת את קיום התיבה.",
    "checksTitle": "בדיקות",
    "check1": "סימן {'@'} אחד עם חלק מקומי ודומיין",
    "check2": "תווים, נקודות ואורך החלק המקומי",
    "check3": "תוויות דומיין, כללי מקף ו‑TLD",
    "note": "דומיינים בינלאומיים חייבים להיות ב-Punycode (ASCII)."
  },
  "ms": {
    "title": "Apakah yang disemak oleh pengesah ini?",
    "description": "Alat ini hanya mengesahkan sintaks e-mel. Ia tidak mengesahkan kewujudan peti mel.",
    "checksTitle": "Semakan",
    "check1": "Satu {'@'} dengan bahagian lokal dan domain",
    "check2": "Aksara, titik dan panjang bahagian lokal",
    "check3": "Label domain, peraturan sempang dan TLD",
    "note": "Domain antarabangsa mesti dalam Punycode (ASCII)."
  },
  "no": {
    "title": "Hva sjekker denne validereren?",
    "description": "Dette verktøyet validerer bare e-postsyntax. Det sjekker ikke leverbarhet.",
    "checksTitle": "Sjekker",
    "check1": "Én {'@'} med lokal del og domene",
    "check2": "Tegn, punktplassering og lengde i lokal del",
    "check3": "Domenetiketter, bindestreksregler og TLD",
    "note": "Internasjonaliserte domener må være i Punycode (ASCII)."
  }
}
</i18n>
