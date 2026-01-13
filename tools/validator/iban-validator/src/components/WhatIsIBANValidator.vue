<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description') }}</NText>

    <NH3>{{ t('structureTitle') }}</NH3>
    <NText tag="p">{{ t('structureDescription') }}</NText>

    <NH3>{{ t('validationTitle') }}</NH3>
    <NText tag="p">{{ t('validationDescription') }}</NText>
    <NOl>
      <NLi>{{ t('step1') }}</NLi>
      <NLi>{{ t('step2') }}</NLi>
      <NLi>{{ t('step3') }}</NLi>
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
    "title": "What is IBAN?",
    "description": "IBAN (International Bank Account Number) is a standardized identifier for bank accounts used in international payments.",
    "structureTitle": "IBAN Structure",
    "structureDescription": "An IBAN starts with a two-letter country code, two check digits, and a country-specific BBAN.",
    "validationTitle": "Checksum Validation",
    "validationDescription": "IBAN validity is checked with the ISO 13616 mod-97 algorithm.",
    "step1": "Remove spaces and move the first four characters to the end",
    "step2": "Convert letters to numbers (A=10, B=11, ..., Z=35)",
    "step3": "Compute mod 97; a valid IBAN leaves a remainder of 1",
    "note": "Each country defines a fixed length and structure for the BBAN portion."
  },
  "zh": {
    "title": "什么是 IBAN？",
    "description": "IBAN（国际银行账户号码）是用于国际转账的标准化账户标识。",
    "structureTitle": "IBAN 结构",
    "structureDescription": "IBAN 以两位国家代码、两位校验位以及国家特定的 BBAN 组成。",
    "validationTitle": "校验验证",
    "validationDescription": "IBAN 使用 ISO 13616 的 mod-97 算法进行校验。",
    "step1": "移除空格并将前四个字符移到末尾",
    "step2": "将字母转换为数字（A=10，B=11，...，Z=35）",
    "step3": "计算 mod 97；有效 IBAN 的余数为 1",
    "note": "每个国家为 BBAN 部分定义固定长度和结构。"
  },
  "zh-CN": {
    "title": "什么是 IBAN？",
    "description": "IBAN（国际银行账户号码）是用于国际转账的标准化账户标识。",
    "structureTitle": "IBAN 结构",
    "structureDescription": "IBAN 以两位国家代码、两位校验位以及国家特定的 BBAN 组成。",
    "validationTitle": "校验验证",
    "validationDescription": "IBAN 使用 ISO 13616 的 mod-97 算法进行校验。",
    "step1": "移除空格并将前四个字符移到末尾",
    "step2": "将字母转换为数字（A=10，B=11，...，Z=35）",
    "step3": "计算 mod 97；有效 IBAN 的余数为 1",
    "note": "每个国家为 BBAN 部分定义固定长度和结构。"
  },
  "zh-TW": {
    "title": "什麼是 IBAN？",
    "description": "IBAN（國際銀行帳戶號碼）是用於國際轉帳的標準化帳戶識別。",
    "structureTitle": "IBAN 結構",
    "structureDescription": "IBAN 由兩位國家代碼、兩位校驗位以及國家特定的 BBAN 組成。",
    "validationTitle": "校驗驗證",
    "validationDescription": "IBAN 使用 ISO 13616 的 mod-97 演算法進行校驗。",
    "step1": "移除空格並將前四個字元移到末尾",
    "step2": "將字母轉換為數字（A=10，B=11，...，Z=35）",
    "step3": "計算 mod 97；有效 IBAN 的餘數為 1",
    "note": "每個國家為 BBAN 部分定義固定長度和結構。"
  },
  "zh-HK": {
    "title": "什麼是 IBAN？",
    "description": "IBAN（國際銀行帳戶號碼）是用於國際轉帳的標準化帳戶識別。",
    "structureTitle": "IBAN 結構",
    "structureDescription": "IBAN 由兩位國家代碼、兩位校驗位以及國家特定的 BBAN 組成。",
    "validationTitle": "校驗驗證",
    "validationDescription": "IBAN 使用 ISO 13616 的 mod-97 演算法進行校驗。",
    "step1": "移除空格並將前四個字元移到末尾",
    "step2": "將字母轉換為數字（A=10，B=11，...，Z=35）",
    "step3": "計算 mod 97；有效 IBAN 的餘數為 1",
    "note": "每個國家為 BBAN 部分定義固定長度和結構。"
  },
  "es": {
    "title": "¿Qué es IBAN?",
    "description": "IBAN (International Bank Account Number) es un identificador estandarizado para cuentas bancarias usado en pagos internacionales.",
    "structureTitle": "Estructura del IBAN",
    "structureDescription": "Un IBAN comienza con un código de país de dos letras, dos dígitos de control y un BBAN específico del país.",
    "validationTitle": "Validación de checksum",
    "validationDescription": "La validez del IBAN se comprueba con el algoritmo mod-97 de la norma ISO 13616.",
    "step1": "Elimine los espacios y mueva los primeros cuatro caracteres al final",
    "step2": "Convierta las letras a números (A=10, B=11, ..., Z=35)",
    "step3": "Calcule mod 97; un IBAN válido deja un resto de 1",
    "note": "Cada país define una longitud y estructura fija para la parte BBAN."
  },
  "fr": {
    "title": "Qu'est-ce que l'IBAN ?",
    "description": "L'IBAN (International Bank Account Number) est un identifiant standardisé des comptes bancaires utilisé pour les paiements internationaux.",
    "structureTitle": "Structure de l'IBAN",
    "structureDescription": "Un IBAN commence par un code pays à deux lettres, deux chiffres de contrôle et un BBAN spécifique au pays.",
    "validationTitle": "Validation de checksum",
    "validationDescription": "La validité de l'IBAN est vérifiée avec l'algorithme mod-97 de la norme ISO 13616.",
    "step1": "Supprimez les espaces et déplacez les quatre premiers caractères à la fin",
    "step2": "Convertissez les lettres en nombres (A=10, B=11, ..., Z=35)",
    "step3": "Calculez mod 97 ; un IBAN valide laisse un reste de 1",
    "note": "Chaque pays définit une longueur et une structure fixes pour la partie BBAN."
  },
  "de": {
    "title": "Was ist IBAN?",
    "description": "IBAN (International Bank Account Number) ist eine standardisierte Kennung für Bankkonten, die für internationale Zahlungen verwendet wird.",
    "structureTitle": "IBAN-Struktur",
    "structureDescription": "Eine IBAN beginnt mit einem zweibuchstabigen Ländercode, zwei Prüfziffern und einer länderspezifischen BBAN.",
    "validationTitle": "Prüfsummenprüfung",
    "validationDescription": "Die IBAN-Gültigkeit wird mit dem ISO-13616-Mod-97-Algorithmus geprüft.",
    "step1": "Leerzeichen entfernen und die ersten vier Zeichen ans Ende verschieben",
    "step2": "Buchstaben in Zahlen umwandeln (A=10, B=11, ..., Z=35)",
    "step3": "Mod 97 berechnen; eine gültige IBAN ergibt den Rest 1",
    "note": "Jedes Land definiert eine feste Länge und Struktur für den BBAN-Teil."
  },
  "it": {
    "title": "Che cos'è l'IBAN?",
    "description": "IBAN (International Bank Account Number) è un identificatore standardizzato dei conti bancari usato per pagamenti internazionali.",
    "structureTitle": "Struttura IBAN",
    "structureDescription": "Un IBAN inizia con un codice paese di due lettere, due cifre di controllo e un BBAN specifico del paese.",
    "validationTitle": "Validazione checksum",
    "validationDescription": "La validità dell'IBAN viene verificata con l'algoritmo mod-97 della norma ISO 13616.",
    "step1": "Rimuovi gli spazi e sposta i primi quattro caratteri alla fine",
    "step2": "Converti le lettere in numeri (A=10, B=11, ..., Z=35)",
    "step3": "Calcola mod 97; un IBAN valido lascia un resto di 1",
    "note": "Ogni paese definisce una lunghezza e una struttura fisse per la parte BBAN."
  },
  "ja": {
    "title": "IBAN とは？",
    "description": "IBAN（国際銀行口座番号）は、国際送金で使用される銀行口座の標準化された識別子です。",
    "structureTitle": "IBAN の構造",
    "structureDescription": "IBAN は 2 文字の国コード、2 桁のチェックディジット、国別の BBAN で構成されます。",
    "validationTitle": "チェックサム検証",
    "validationDescription": "IBAN の有効性は ISO 13616 の mod-97 アルゴリズムで検証します。",
    "step1": "空白を除去し、先頭 4 文字を末尾に移動",
    "step2": "文字を数値に変換（A=10、B=11、...、Z=35）",
    "step3": "mod 97 を計算し、余りが 1 なら有効",
    "note": "各国は BBAN 部分の固定長と構造を定義しています。"
  },
  "ko": {
    "title": "IBAN이란?",
    "description": "IBAN(International Bank Account Number)은 국제 결제에 사용되는 은행 계좌의 표준 식별자입니다.",
    "structureTitle": "IBAN 구조",
    "structureDescription": "IBAN은 2자리 국가 코드, 2자리 체크 디지트, 국가별 BBAN으로 구성됩니다.",
    "validationTitle": "체크섬 검증",
    "validationDescription": "IBAN 유효성은 ISO 13616 mod-97 알고리즘으로 검사합니다.",
    "step1": "공백을 제거하고 앞의 4문자를 끝으로 이동",
    "step2": "문자를 숫자로 변환 (A=10, B=11, ..., Z=35)",
    "step3": "mod 97을 계산해 나머지가 1이면 유효",
    "note": "각 국가는 BBAN 부분의 고정 길이와 구조를 정의합니다."
  },
  "ru": {
    "title": "Что такое IBAN?",
    "description": "IBAN (International Bank Account Number) — стандартизированный идентификатор банковских счетов для международных платежей.",
    "structureTitle": "Структура IBAN",
    "structureDescription": "IBAN начинается с двухбуквенного кода страны, двух контрольных цифр и BBAN, специфичного для страны.",
    "validationTitle": "Проверка контрольной суммы",
    "validationDescription": "Действительность IBAN проверяется алгоритмом mod-97 стандарта ISO 13616.",
    "step1": "Удалите пробелы и перенесите первые четыре символа в конец",
    "step2": "Преобразуйте буквы в числа (A=10, B=11, ..., Z=35)",
    "step3": "Вычислите mod 97; корректный IBAN дает остаток 1",
    "note": "Каждая страна определяет фиксированную длину и структуру части BBAN."
  },
  "pt": {
    "title": "O que é IBAN?",
    "description": "IBAN (International Bank Account Number) é um identificador padronizado de contas bancárias usado em pagamentos internacionais.",
    "structureTitle": "Estrutura do IBAN",
    "structureDescription": "Um IBAN começa com um código de país de duas letras, dois dígitos de controle e um BBAN específico do país.",
    "validationTitle": "Validação de checksum",
    "validationDescription": "A validade do IBAN é verificada pelo algoritmo mod-97 da ISO 13616.",
    "step1": "Remova os espaços e mova os quatro primeiros caracteres para o fim",
    "step2": "Converta letras em números (A=10, B=11, ..., Z=35)",
    "step3": "Calcule mod 97; um IBAN válido deixa resto 1",
    "note": "Cada país define um comprimento e estrutura fixos para a parte BBAN."
  },
  "ar": {
    "title": "ما هو IBAN؟",
    "description": "IBAN (رقم الحساب المصرفي الدولي) هو معرف موحد للحسابات المصرفية المستخدمة في المدفوعات الدولية.",
    "structureTitle": "بنية IBAN",
    "structureDescription": "يبدأ IBAN برمز بلد من حرفين، ورقمين للتحقق، و BBAN خاص بالبلد.",
    "validationTitle": "التحقق من المجموع الاختباري",
    "validationDescription": "يتم التحقق من صحة IBAN باستخدام خوارزمية mod-97 لمعيار ISO 13616.",
    "step1": "أزل المسافات وانقل أول أربعة أحرف إلى النهاية",
    "step2": "حوّل الحروف إلى أرقام (A=10، B=11، ...، Z=35)",
    "step3": "احسب mod 97؛ يترك IBAN الصحيح باقيًا قدره 1",
    "note": "يحدد كل بلد طولًا وبنية ثابتين لجزء BBAN."
  },
  "hi": {
    "title": "IBAN क्या है?",
    "description": "IBAN (International Bank Account Number) अंतरराष्ट्रीय भुगतान के लिए उपयोग होने वाला बैंक खातों का मानकीकृत पहचानकर्ता है।",
    "structureTitle": "IBAN संरचना",
    "structureDescription": "IBAN दो अक्षरों के देश कोड, दो चेक अंकों और देश-विशिष्ट BBAN से शुरू होता है।",
    "validationTitle": "चेकसम सत्यापन",
    "validationDescription": "IBAN की वैधता ISO 13616 के mod-97 एल्गोरिथम से जांची जाती है।",
    "step1": "स्पेस हटाएं और पहले चार अक्षरों को अंत में ले जाएं",
    "step2": "अक्षरों को संख्याओं में बदलें (A=10, B=11, ..., Z=35)",
    "step3": "mod 97 निकालें; वैध IBAN का शेष 1 होता है",
    "note": "हर देश BBAN भाग की एक निश्चित लंबाई और संरचना निर्धारित करता है।"
  },
  "tr": {
    "title": "IBAN nedir?",
    "description": "IBAN (International Bank Account Number), uluslararası ödemelerde kullanılan banka hesapları için standart bir tanımlayıcıdır.",
    "structureTitle": "IBAN Yapısı",
    "structureDescription": "IBAN, iki harfli ülke kodu, iki kontrol hanesi ve ülkeye özgü bir BBAN ile başlar.",
    "validationTitle": "Sağlama Toplamı Doğrulaması",
    "validationDescription": "IBAN geçerliliği ISO 13616 mod-97 algoritması ile kontrol edilir.",
    "step1": "Boşlukları kaldırın ve ilk dört karakteri sona taşıyın",
    "step2": "Harfleri sayılara dönüştürün (A=10, B=11, ..., Z=35)",
    "step3": "mod 97 hesaplayın; geçerli bir IBAN 1 kalanını verir",
    "note": "Her ülke BBAN bölümünün sabit bir uzunluk ve yapısını tanımlar."
  },
  "nl": {
    "title": "Wat is IBAN?",
    "description": "IBAN (International Bank Account Number) is een gestandaardiseerde identifier voor bankrekeningen die wordt gebruikt bij internationale betalingen.",
    "structureTitle": "IBAN-structuur",
    "structureDescription": "Een IBAN begint met een tweeletterige landcode, twee controlecijfers en een landspecifieke BBAN.",
    "validationTitle": "Checksum-validatie",
    "validationDescription": "De geldigheid van IBAN wordt gecontroleerd met het ISO 13616 mod-97-algoritme.",
    "step1": "Verwijder spaties en verplaats de eerste vier tekens naar het einde",
    "step2": "Zet letters om naar cijfers (A=10, B=11, ..., Z=35)",
    "step3": "Bereken mod 97; een geldige IBAN laat rest 1",
    "note": "Elk land definieert een vaste lengte en structuur voor het BBAN-deel."
  },
  "sv": {
    "title": "Vad är IBAN?",
    "description": "IBAN (International Bank Account Number) är en standardiserad identifierare för bankkonton som används vid internationella betalningar.",
    "structureTitle": "IBAN-struktur",
    "structureDescription": "Ett IBAN börjar med en tvåbokstavskod för land, två kontrollsiffror och en landspecifik BBAN.",
    "validationTitle": "Checksum-validering",
    "validationDescription": "IBAN:s giltighet kontrolleras med ISO 13616 mod-97-algoritmen.",
    "step1": "Ta bort mellanslag och flytta de första fyra tecknen till slutet",
    "step2": "Omvandla bokstäver till siffror (A=10, B=11, ..., Z=35)",
    "step3": "Beräkna mod 97; ett giltigt IBAN ger resten 1",
    "note": "Varje land definierar en fast längd och struktur för BBAN-delen."
  },
  "pl": {
    "title": "Czym jest IBAN?",
    "description": "IBAN (International Bank Account Number) to znormalizowany identyfikator rachunków bankowych używany w płatnościach międzynarodowych.",
    "structureTitle": "Struktura IBAN",
    "structureDescription": "IBAN zaczyna się od dwuliterowego kodu kraju, dwóch cyfr kontrolnych i krajowego BBAN.",
    "validationTitle": "Walidacja sumy kontrolnej",
    "validationDescription": "Poprawność IBAN sprawdza algorytm mod-97 normy ISO 13616.",
    "step1": "Usuń spacje i przenieś pierwsze cztery znaki na koniec",
    "step2": "Zamień litery na liczby (A=10, B=11, ..., Z=35)",
    "step3": "Oblicz mod 97; poprawny IBAN daje resztę 1",
    "note": "Każdy kraj określa stałą długość i strukturę części BBAN."
  },
  "vi": {
    "title": "IBAN là gì?",
    "description": "IBAN (International Bank Account Number) là mã nhận dạng tiêu chuẩn cho tài khoản ngân hàng dùng trong thanh toán quốc tế.",
    "structureTitle": "Cấu trúc IBAN",
    "structureDescription": "IBAN bắt đầu bằng mã quốc gia 2 chữ, 2 số kiểm tra và BBAN theo từng quốc gia.",
    "validationTitle": "Xác thực checksum",
    "validationDescription": "Tính hợp lệ của IBAN được kiểm tra bằng thuật toán mod-97 của ISO 13616.",
    "step1": "Xóa khoảng trắng và chuyển bốn ký tự đầu xuống cuối",
    "step2": "Chuyển chữ thành số (A=10, B=11, ..., Z=35)",
    "step3": "Tính mod 97; IBAN hợp lệ cho số dư 1",
    "note": "Mỗi quốc gia quy định độ dài và cấu trúc cố định cho phần BBAN."
  },
  "th": {
    "title": "IBAN คืออะไร?",
    "description": "IBAN (International Bank Account Number) เป็นรหัสมาตรฐานสำหรับบัญชีธนาคารที่ใช้ในการชำระเงินระหว่างประเทศ",
    "structureTitle": "โครงสร้าง IBAN",
    "structureDescription": "IBAN เริ่มด้วยรหัสประเทศ 2 ตัวอักษร ตามด้วยเลขตรวจสอบ 2 หลัก และ BBAN ของแต่ละประเทศ",
    "validationTitle": "การตรวจสอบ checksum",
    "validationDescription": "ความถูกต้องของ IBAN ตรวจด้วยอัลกอริทึม mod-97 ตามมาตรฐาน ISO 13616",
    "step1": "ลบช่องว่างและย้ายอักขระ 4 ตัวแรกไปไว้ท้ายสุด",
    "step2": "แปลงตัวอักษรเป็นตัวเลข (A=10, B=11, ..., Z=35)",
    "step3": "คำนวณ mod 97; IBAN ที่ถูกต้องจะมีเศษเท่ากับ 1",
    "note": "แต่ละประเทศกำหนดความยาวและโครงสร้างคงที่สำหรับส่วน BBAN"
  },
  "id": {
    "title": "Apa itu IBAN?",
    "description": "IBAN (International Bank Account Number) adalah pengenal standar untuk rekening bank yang digunakan dalam pembayaran internasional.",
    "structureTitle": "Struktur IBAN",
    "structureDescription": "IBAN dimulai dengan kode negara dua huruf, dua digit pemeriksa, dan BBAN khusus negara.",
    "validationTitle": "Validasi checksum",
    "validationDescription": "Keabsahan IBAN diperiksa dengan algoritma mod-97 ISO 13616.",
    "step1": "Hapus spasi dan pindahkan empat karakter pertama ke akhir",
    "step2": "Ubah huruf menjadi angka (A=10, B=11, ..., Z=35)",
    "step3": "Hitung mod 97; IBAN yang valid menghasilkan sisa 1",
    "note": "Setiap negara menentukan panjang dan struktur tetap untuk bagian BBAN."
  },
  "he": {
    "title": "מהו IBAN?",
    "description": "IBAN (International Bank Account Number) הוא מזהה תקני לחשבונות בנק המשמש בתשלומים בינלאומיים.",
    "structureTitle": "מבנה IBAN",
    "structureDescription": "IBAN מתחיל בקוד מדינה בן שתי אותיות, שתי ספרות ביקורת ו-BBAN ייחודי למדינה.",
    "validationTitle": "אימות checksum",
    "validationDescription": "תקינות ה-IBAN נבדקת באמצעות אלגוריתם mod-97 של ISO 13616.",
    "step1": "הסר רווחים והעבר את ארבעת התווים הראשונים לסוף",
    "step2": "המר אותיות למספרים (A=10, B=11, ..., Z=35)",
    "step3": "חשב mod 97; IBAN תקין משאיר שארית 1",
    "note": "כל מדינה מגדירה אורך ומבנה קבועים לחלק ה-BBAN."
  },
  "ms": {
    "title": "Apa itu IBAN?",
    "description": "IBAN (International Bank Account Number) ialah pengecam piawai untuk akaun bank yang digunakan dalam pembayaran antarabangsa.",
    "structureTitle": "Struktur IBAN",
    "structureDescription": "IBAN bermula dengan kod negara dua huruf, dua digit semakan, dan BBAN khusus negara.",
    "validationTitle": "Pengesahan checksum",
    "validationDescription": "Kesahan IBAN diperiksa dengan algoritma mod-97 ISO 13616.",
    "step1": "Buang ruang dan pindahkan empat aksara pertama ke hujung",
    "step2": "Tukar huruf kepada nombor (A=10, B=11, ..., Z=35)",
    "step3": "Kira mod 97; IBAN yang sah menghasilkan baki 1",
    "note": "Setiap negara menetapkan panjang dan struktur tetap untuk bahagian BBAN."
  },
  "no": {
    "title": "Hva er IBAN?",
    "description": "IBAN (International Bank Account Number) er en standardisert identifikator for bankkontoer som brukes ved internasjonale betalinger.",
    "structureTitle": "IBAN-struktur",
    "structureDescription": "En IBAN starter med en todelt landskode, to kontrollsifre og en landspesifikk BBAN.",
    "validationTitle": "Checksum-validering",
    "validationDescription": "IBANs gyldighet kontrolleres med ISO 13616 mod-97-algoritmen.",
    "step1": "Fjern mellomrom og flytt de fire første tegnene til slutten",
    "step2": "Konverter bokstaver til tall (A=10, B=11, ..., Z=35)",
    "step3": "Beregn mod 97; et gyldig IBAN gir resten 1",
    "note": "Hvert land definerer en fast lengde og struktur for BBAN-delen."
  }
}
</i18n>
