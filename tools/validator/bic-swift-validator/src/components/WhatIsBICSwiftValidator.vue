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
    <NText tag="p">{{ t('locationNote') }}</NText>
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
    "title": "What is BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), also called a SWIFT code, identifies financial institutions in international payments.",
    "structureTitle": "BIC Structure",
    "structureDescription": "A BIC is 8 or 11 characters: bank code (4 letters), country code (2 letters), location code (2 alphanumerics), and optional branch code (3 alphanumerics).",
    "validationTitle": "Validation Rules",
    "validationDescription": "Validation checks length, character set, and ISO 3166 country codes.",
    "step1": "Strip spaces and hyphens",
    "step2": "Ensure the format matches 8 or 11 characters",
    "step3": "Parse bank, country, location, and branch codes",
    "note": "Branch code \"XXX\" or an 8-character BIC indicates the primary office.",
    "locationNote": "Location code second character 0 indicates a test BIC; 1 indicates a passive participant."
  },
  "zh": {
    "title": "什么是 BIC/SWIFT？",
    "description": "BIC（银行识别码，也称 SWIFT 代码）用于国际支付中的金融机构识别。",
    "structureTitle": "BIC 结构",
    "structureDescription": "BIC 为 8 或 11 位：银行代码（4 位字母）、国家代码（2 位字母）、地区代码（2 位字母或数字）以及可选分行代码（3 位字母或数字）。",
    "validationTitle": "校验规则",
    "validationDescription": "校验会检查长度、字符集以及 ISO 3166 国家代码。",
    "step1": "移除空格和连字符",
    "step2": "确认格式为 8 或 11 位",
    "step3": "解析银行、国家、地区与分行代码",
    "note": "分行代码为 \"XXX\" 或 8 位 BIC 表示主行。",
    "locationNote": "地区代码的第二位为 0 表示测试 BIC；为 1 表示被动参与者。"
  },
  "zh-CN": {
    "title": "什么是 BIC/SWIFT？",
    "description": "BIC（银行识别码，也称 SWIFT 代码）用于国际支付中的金融机构识别。",
    "structureTitle": "BIC 结构",
    "structureDescription": "BIC 为 8 或 11 位：银行代码（4 位字母）、国家代码（2 位字母）、地区代码（2 位字母或数字）以及可选分行代码（3 位字母或数字）。",
    "validationTitle": "校验规则",
    "validationDescription": "校验会检查长度、字符集以及 ISO 3166 国家代码。",
    "step1": "移除空格和连字符",
    "step2": "确认格式为 8 或 11 位",
    "step3": "解析银行、国家、地区与分行代码",
    "note": "分行代码为 \"XXX\" 或 8 位 BIC 表示主行。",
    "locationNote": "地区代码的第二位为 0 表示测试 BIC；为 1 表示被动参与者。"
  },
  "zh-TW": {
    "title": "什麼是 BIC/SWIFT？",
    "description": "BIC（銀行識別碼，也稱 SWIFT 代碼）用於國際支付中的金融機構識別。",
    "structureTitle": "BIC 結構",
    "structureDescription": "BIC 為 8 或 11 位：銀行代碼（4 位字母）、國家代碼（2 位字母）、地區代碼（2 位字母或數字）以及可選分行代碼（3 位字母或數字）。",
    "validationTitle": "校驗規則",
    "validationDescription": "校驗會檢查長度、字元集以及 ISO 3166 國家代碼。",
    "step1": "移除空格和連字號",
    "step2": "確認格式為 8 或 11 位",
    "step3": "解析銀行、國家、地區與分行代碼",
    "note": "分行代碼為 \"XXX\" 或 8 位 BIC 表示主行。",
    "locationNote": "地區代碼的第二位為 0 表示測試 BIC；為 1 表示被動參與者。"
  },
  "zh-HK": {
    "title": "什麼是 BIC/SWIFT？",
    "description": "BIC（銀行識別碼，也稱 SWIFT 代碼）用於國際支付中的金融機構識別。",
    "structureTitle": "BIC 結構",
    "structureDescription": "BIC 為 8 或 11 位：銀行代碼（4 位字母）、國家代碼（2 位字母）、地區代碼（2 位字母或數字）以及可選分行代碼（3 位字母或數字）。",
    "validationTitle": "校驗規則",
    "validationDescription": "校驗會檢查長度、字元集以及 ISO 3166 國家代碼。",
    "step1": "移除空格和連字號",
    "step2": "確認格式為 8 或 11 位",
    "step3": "解析銀行、國家、地區與分行代碼",
    "note": "分行代碼為 \"XXX\" 或 8 位 BIC 表示主行。",
    "locationNote": "地區代碼的第二位為 0 表示測試 BIC；為 1 表示被動參與者。"
  },
  "es": {
    "title": "¿Qué es BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), también llamado código SWIFT, identifica instituciones financieras en pagos internacionales.",
    "structureTitle": "Estructura del BIC",
    "structureDescription": "Un BIC tiene 8 u 11 caracteres: código de banco (4 letras), código de país (2 letras), código de ubicación (2 alfanuméricos) y un código de sucursal opcional (3 alfanuméricos).",
    "validationTitle": "Reglas de validación",
    "validationDescription": "La validación comprueba longitud, conjunto de caracteres y códigos de país ISO 3166.",
    "step1": "Elimine espacios y guiones",
    "step2": "Verifique que el formato tenga 8 u 11 caracteres",
    "step3": "Analice los códigos de banco, país, ubicación y sucursal",
    "note": "El código de sucursal \"XXX\" o un BIC de 8 caracteres indica la oficina principal.",
    "locationNote": "El segundo carácter del código de ubicación 0 indica BIC de prueba; 1 indica participante pasivo."
  },
  "fr": {
    "title": "Qu'est-ce que le BIC/SWIFT ?",
    "description": "Le BIC (Bank Identifier Code), aussi appelé code SWIFT, identifie les institutions financières dans les paiements internationaux.",
    "structureTitle": "Structure du BIC",
    "structureDescription": "Un BIC comporte 8 ou 11 caractères : code banque (4 lettres), code pays (2 lettres), code de localisation (2 alphanumériques) et code d'agence optionnel (3 alphanumériques).",
    "validationTitle": "Règles de validation",
    "validationDescription": "La validation vérifie la longueur, le jeu de caractères et les codes pays ISO 3166.",
    "step1": "Supprimez les espaces et les tirets",
    "step2": "Vérifiez que le format a 8 ou 11 caractères",
    "step3": "Analysez les codes banque, pays, localisation et agence",
    "note": "Le code d'agence \"XXX\" ou un BIC à 8 caractères indique le siège.",
    "locationNote": "Le second caractère du code de localisation 0 indique un BIC de test ; 1 indique un participant passif."
  },
  "de": {
    "title": "Was ist BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), auch SWIFT-Code genannt, identifiziert Finanzinstitute bei internationalen Zahlungen.",
    "structureTitle": "BIC-Struktur",
    "structureDescription": "Ein BIC hat 8 oder 11 Zeichen: Bankcode (4 Buchstaben), Ländercode (2 Buchstaben), Standortcode (2 alphanumerisch) und optionaler Filialcode (3 alphanumerisch).",
    "validationTitle": "Validierungsregeln",
    "validationDescription": "Die Validierung prüft Länge, Zeichensatz und ISO-3166-Ländercodes.",
    "step1": "Leerzeichen und Bindestriche entfernen",
    "step2": "Prüfen, ob das Format 8 oder 11 Zeichen hat",
    "step3": "Bank-, Länder-, Standort- und Filialcode parsen",
    "note": "Der Filialcode \"XXX\" oder ein 8-stelliger BIC kennzeichnet die Hauptstelle.",
    "locationNote": "Das zweite Zeichen des Standortcodes 0 kennzeichnet einen Test-BIC; 1 kennzeichnet einen passiven Teilnehmer."
  },
  "it": {
    "title": "Che cos'è il BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), noto anche come codice SWIFT, identifica le istituzioni finanziarie nei pagamenti internazionali.",
    "structureTitle": "Struttura del BIC",
    "structureDescription": "Un BIC è lungo 8 o 11 caratteri: codice banca (4 lettere), codice paese (2 lettere), codice località (2 alfanumerici) e codice filiale opzionale (3 alfanumerici).",
    "validationTitle": "Regole di validazione",
    "validationDescription": "La validazione verifica lunghezza, set di caratteri e codici paese ISO 3166.",
    "step1": "Rimuovi spazi e trattini",
    "step2": "Verifica che il formato sia di 8 o 11 caratteri",
    "step3": "Analizza i codici banca, paese, località e filiale",
    "note": "Il codice filiale \"XXX\" o un BIC di 8 caratteri indica la sede principale.",
    "locationNote": "Il secondo carattere del codice località 0 indica un BIC di test; 1 indica un partecipante passivo."
  },
  "ja": {
    "title": "BIC/SWIFT とは？",
    "description": "BIC（Bank Identifier Code、SWIFT コード）は国際送金で金融機関を識別するコードです。",
    "structureTitle": "BIC の構造",
    "structureDescription": "BIC は 8 または 11 文字で、銀行コード（4 文字）、国コード（2 文字）、ロケーションコード（2 文字英数字）、任意の支店コード（3 文字英数字）で構成されます。",
    "validationTitle": "検証ルール",
    "validationDescription": "検証では長さ、文字種、ISO 3166 の国コードを確認します。",
    "step1": "空白とハイフンを除去",
    "step2": "8 または 11 文字の形式であることを確認",
    "step3": "銀行、国、ロケーション、支店コードを解析",
    "note": "支店コードが \"XXX\" または 8 文字の BIC は本店を示します。",
    "locationNote": "ロケーションコードの 2 文字目が 0 はテスト BIC、1 はパッシブ参加者を示します。"
  },
  "ko": {
    "title": "BIC/SWIFT란?",
    "description": "BIC(Bank Identifier Code), 또는 SWIFT 코드는 국제 결제에서 금융 기관을 식별합니다.",
    "structureTitle": "BIC 구조",
    "structureDescription": "BIC는 8 또는 11자로 구성되며, 은행 코드(4자), 국가 코드(2자), 위치 코드(2자 영숫자), 선택적 지점 코드(3자 영숫자)로 구성됩니다.",
    "validationTitle": "검증 규칙",
    "validationDescription": "검증은 길이, 문자 집합, ISO 3166 국가 코드를 확인합니다.",
    "step1": "공백과 하이픈 제거",
    "step2": "8 또는 11자 형식인지 확인",
    "step3": "은행, 국가, 위치, 지점 코드를 분석",
    "note": "지점 코드가 \"XXX\" 이거나 8자리 BIC는 본점을 의미합니다.",
    "locationNote": "위치 코드의 두 번째 문자가 0이면 테스트 BIC, 1이면 수동 참가자를 의미합니다."
  },
  "ru": {
    "title": "Что такое BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), также известный как код SWIFT, идентифицирует финансовые учреждения в международных платежах.",
    "structureTitle": "Структура BIC",
    "structureDescription": "BIC состоит из 8 или 11 символов: код банка (4 буквы), код страны (2 буквы), код местоположения (2 алфавитно-цифровых), необязательный код филиала (3 алфавитно-цифровых).",
    "validationTitle": "Правила проверки",
    "validationDescription": "Проверка включает длину, набор символов и коды стран ISO 3166.",
    "step1": "Удалите пробелы и дефисы",
    "step2": "Убедитесь, что формат 8 или 11 символов",
    "step3": "Разберите коды банка, страны, местоположения и филиала",
    "note": "Код филиала \"XXX\" или 8-символьный BIC означает головной офис.",
    "locationNote": "Второй символ кода местоположения 0 означает тестовый BIC; 1 означает пассивного участника."
  },
  "pt": {
    "title": "O que é BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), também chamado de código SWIFT, identifica instituições financeiras em pagamentos internacionais.",
    "structureTitle": "Estrutura do BIC",
    "structureDescription": "Um BIC tem 8 ou 11 caracteres: código do banco (4 letras), código do país (2 letras), código de localização (2 alfanuméricos) e código de agência opcional (3 alfanuméricos).",
    "validationTitle": "Regras de validação",
    "validationDescription": "A validação verifica comprimento, conjunto de caracteres e códigos de país ISO 3166.",
    "step1": "Remova espaços e hífens",
    "step2": "Verifique se o formato tem 8 ou 11 caracteres",
    "step3": "Analise os códigos de banco, país, localização e agência",
    "note": "O código de agência \"XXX\" ou um BIC de 8 caracteres indica a agência principal.",
    "locationNote": "O segundo caractere do código de localização 0 indica BIC de teste; 1 indica participante passivo."
  },
  "ar": {
    "title": "ما هو BIC/SWIFT؟",
    "description": "BIC (رمز تعريف البنك)، ويُعرف أيضًا برمز SWIFT، يحدد المؤسسات المالية في المدفوعات الدولية.",
    "structureTitle": "بنية BIC",
    "structureDescription": "يتكون BIC من 8 أو 11 حرفًا: رمز البنك (4 أحرف)، رمز الدولة (حرفان)، رمز الموقع (حرفان/رقمان) ورمز فرع اختياري (3 أحرف/أرقام).",
    "validationTitle": "قواعد التحقق",
    "validationDescription": "يتحقق من الطول ومجموعة الأحرف وأكواد الدول ISO 3166.",
    "step1": "أزل المسافات والواصلات",
    "step2": "تأكد من أن التنسيق 8 أو 11 حرفًا",
    "step3": "حلل رموز البنك والدولة والموقع والفرع",
    "note": "رمز الفرع \"XXX\" أو BIC من 8 أحرف يدل على المكتب الرئيسي.",
    "locationNote": "الحرف الثاني من رمز الموقع 0 يدل على BIC تجريبي؛ و1 يدل على مشارك سلبي."
  },
  "hi": {
    "title": "BIC/SWIFT क्या है?",
    "description": "BIC (Bank Identifier Code), जिसे SWIFT कोड भी कहा जाता है, अंतरराष्ट्रीय भुगतान में वित्तीय संस्थानों की पहचान करता है।",
    "structureTitle": "BIC संरचना",
    "structureDescription": "BIC 8 या 11 अक्षरों का होता है: बैंक कोड (4 अक्षर), देश कोड (2 अक्षर), लोकेशन कोड (2 अक्षर/अंक) और वैकल्पिक शाखा कोड (3 अक्षर/अंक)।",
    "validationTitle": "सत्यापन नियम",
    "validationDescription": "सत्यापन लंबाई, वर्ण सेट और ISO 3166 देश कोड की जांच करता है।",
    "step1": "स्पेस और हाइफ़न हटाएं",
    "step2": "सुनिश्चित करें कि प्रारूप 8 या 11 अक्षर है",
    "step3": "बैंक, देश, लोकेशन और शाखा कोड पार्स करें",
    "note": "शाखा कोड \"XXX\" या 8-अक्षर का BIC मुख्य कार्यालय को दर्शाता है।",
    "locationNote": "लोकेशन कोड का दूसरा अक्षर 0 होने पर टेस्ट BIC होता है; 1 होने पर पैसिव प्रतिभागी।"
  },
  "tr": {
    "title": "BIC/SWIFT nedir?",
    "description": "BIC (Bank Identifier Code), SWIFT kodu olarak da bilinir ve uluslararası ödemelerde finansal kurumları tanımlar.",
    "structureTitle": "BIC Yapısı",
    "structureDescription": "BIC 8 veya 11 karakterdir: banka kodu (4 harf), ülke kodu (2 harf), konum kodu (2 alfanümerik) ve isteğe bağlı şube kodu (3 alfanümerik).",
    "validationTitle": "Doğrulama Kuralları",
    "validationDescription": "Doğrulama uzunluğu, karakter setini ve ISO 3166 ülke kodlarını kontrol eder.",
    "step1": "Boşluk ve tireleri kaldırın",
    "step2": "Formatın 8 veya 11 karakter olduğundan emin olun",
    "step3": "Banka, ülke, konum ve şube kodlarını ayrıştırın",
    "note": "\"XXX\" şube kodu veya 8 karakterli BIC, ana şubeyi belirtir.",
    "locationNote": "Konum kodunun ikinci karakteri 0 ise test BIC; 1 ise pasif katılımcıdır."
  },
  "nl": {
    "title": "Wat is BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), ook wel SWIFT-code genoemd, identificeert financiële instellingen bij internationale betalingen.",
    "structureTitle": "BIC-structuur",
    "structureDescription": "Een BIC bestaat uit 8 of 11 tekens: bankcode (4 letters), landcode (2 letters), locatiecode (2 alfanumeriek) en optionele filiaalcode (3 alfanumeriek).",
    "validationTitle": "Validatieregels",
    "validationDescription": "Validatie controleert lengte, tekenset en ISO 3166-landcodes.",
    "step1": "Verwijder spaties en koppeltekens",
    "step2": "Controleer of het formaat 8 of 11 tekens is",
    "step3": "Analyseer bank-, land-, locatie- en filiaalcodes",
    "note": "Filiaalcode \"XXX\" of een BIC van 8 tekens geeft het hoofdkantoor aan.",
    "locationNote": "Het tweede teken van de locatiecode 0 duidt op een test-BIC; 1 duidt op een passieve deelnemer."
  },
  "sv": {
    "title": "Vad är BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), även kallad SWIFT-kod, identifierar finansinstitut i internationella betalningar.",
    "structureTitle": "BIC-struktur",
    "structureDescription": "En BIC har 8 eller 11 tecken: bankkod (4 bokstäver), landskod (2 bokstäver), platskod (2 alfanumeriska) och valfri filialkod (3 alfanumeriska).",
    "validationTitle": "Valideringsregler",
    "validationDescription": "Validering kontrollerar längd, teckenuppsättning och ISO 3166-landkoder.",
    "step1": "Ta bort mellanslag och bindestreck",
    "step2": "Kontrollera att formatet har 8 eller 11 tecken",
    "step3": "Analysera bank-, land-, plats- och filialkoder",
    "note": "Filialkod \"XXX\" eller en BIC med 8 tecken anger huvudkontoret.",
    "locationNote": "Det andra tecknet i platskoden 0 betyder test-BIC; 1 betyder passiv deltagare."
  },
  "pl": {
    "title": "Czym jest BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), nazywany też kodem SWIFT, identyfikuje instytucje finansowe w płatnościach międzynarodowych.",
    "structureTitle": "Struktura BIC",
    "structureDescription": "BIC ma 8 lub 11 znaków: kod banku (4 litery), kod kraju (2 litery), kod lokalizacji (2 alfanumeryczne) oraz opcjonalny kod oddziału (3 alfanumeryczne).",
    "validationTitle": "Zasady walidacji",
    "validationDescription": "Walidacja sprawdza długość, zestaw znaków oraz kody krajów ISO 3166.",
    "step1": "Usuń spacje i myślniki",
    "step2": "Upewnij się, że format ma 8 lub 11 znaków",
    "step3": "Analizuj kody banku, kraju, lokalizacji i oddziału",
    "note": "Kod oddziału \"XXX\" lub 8-znakowy BIC oznacza centralę.",
    "locationNote": "Drugi znak kodu lokalizacji 0 oznacza testowy BIC; 1 oznacza pasywnego uczestnika."
  },
  "vi": {
    "title": "BIC/SWIFT là gì?",
    "description": "BIC (Bank Identifier Code), còn gọi là mã SWIFT, dùng để nhận diện tổ chức tài chính trong thanh toán quốc tế.",
    "structureTitle": "Cấu trúc BIC",
    "structureDescription": "BIC có 8 hoặc 11 ký tự: mã ngân hàng (4 chữ), mã quốc gia (2 chữ), mã vị trí (2 ký tự chữ/số) và mã chi nhánh tùy chọn (3 ký tự chữ/số).",
    "validationTitle": "Quy tắc xác thực",
    "validationDescription": "Xác thực kiểm tra độ dài, bộ ký tự và mã quốc gia ISO 3166.",
    "step1": "Loại bỏ khoảng trắng và dấu gạch nối",
    "step2": "Đảm bảo định dạng có 8 hoặc 11 ký tự",
    "step3": "Phân tích mã ngân hàng, quốc gia, vị trí và chi nhánh",
    "note": "Mã chi nhánh \"XXX\" hoặc BIC 8 ký tự thể hiện trụ sở chính.",
    "locationNote": "Ký tự thứ hai của mã vị trí là 0 nghĩa là BIC thử nghiệm; 1 nghĩa là người tham gia thụ động."
  },
  "th": {
    "title": "BIC/SWIFT คืออะไร?",
    "description": "BIC (Bank Identifier Code) หรือรหัส SWIFT ใช้ระบุสถาบันการเงินในการชำระเงินระหว่างประเทศ",
    "structureTitle": "โครงสร้าง BIC",
    "structureDescription": "BIC มี 8 หรือ 11 ตัวอักษร: รหัสธนาคาร (4 ตัวอักษร), รหัสประเทศ (2 ตัวอักษร), รหัสตำแหน่ง (2 ตัวอักษร/ตัวเลข) และรหัสสาขาแบบเลือกได้ (3 ตัวอักษร/ตัวเลข)",
    "validationTitle": "กฎการตรวจสอบ",
    "validationDescription": "การตรวจสอบจะเช็คความยาว ชุดอักขระ และรหัสประเทศ ISO 3166",
    "step1": "ลบช่องว่างและเครื่องหมายขีด",
    "step2": "ตรวจสอบว่ารูปแบบมี 8 หรือ 11 ตัวอักษร",
    "step3": "แยกรหัสธนาคาร ประเทศ ตำแหน่ง และสาขา",
    "note": "รหัสสาขา \"XXX\" หรือ BIC 8 ตัวอักษรหมายถึงสำนักงานใหญ่",
    "locationNote": "อักขระที่สองของรหัสตำแหน่งเป็น 0 หมายถึง BIC ทดสอบ; 1 หมายถึงผู้เข้าร่วมแบบพาสซีฟ"
  },
  "id": {
    "title": "Apa itu BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), juga disebut kode SWIFT, mengidentifikasi lembaga keuangan dalam pembayaran internasional.",
    "structureTitle": "Struktur BIC",
    "structureDescription": "BIC terdiri dari 8 atau 11 karakter: kode bank (4 huruf), kode negara (2 huruf), kode lokasi (2 alfanumerik), dan kode cabang opsional (3 alfanumerik).",
    "validationTitle": "Aturan validasi",
    "validationDescription": "Validasi memeriksa panjang, set karakter, dan kode negara ISO 3166.",
    "step1": "Hapus spasi dan tanda hubung",
    "step2": "Pastikan format memiliki 8 atau 11 karakter",
    "step3": "Urai kode bank, negara, lokasi, dan cabang",
    "note": "Kode cabang \"XXX\" atau BIC 8 karakter menunjukkan kantor utama.",
    "locationNote": "Karakter kedua pada kode lokasi 0 menandakan BIC uji; 1 menandakan peserta pasif."
  },
  "he": {
    "title": "מהו BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), הידוע גם כקוד SWIFT, מזהה מוסדות פיננסיים בתשלומים בינלאומיים.",
    "structureTitle": "מבנה BIC",
    "structureDescription": "BIC הוא באורך 8 או 11 תווים: קוד בנק (4 אותיות), קוד מדינה (2 אותיות), קוד מיקום (2 תווים אלפאנומריים) וקוד סניף אופציונלי (3 תווים אלפאנומריים).",
    "validationTitle": "כללי אימות",
    "validationDescription": "האימות בודק אורך, קבוצת תווים וקודי מדינה ISO 3166.",
    "step1": "הסר רווחים ומקפים",
    "step2": "ודא שהפורמט הוא 8 או 11 תווים",
    "step3": "פרש קודי בנק, מדינה, מיקום וסניף",
    "note": "קוד סניף \"XXX\" או BIC בן 8 תווים מציין משרד ראשי.",
    "locationNote": "התו השני של קוד המיקום 0 מציין BIC לבדיקה; 1 מציין משתתף פסיבי."
  },
  "ms": {
    "title": "Apa itu BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), juga dipanggil kod SWIFT, mengenal pasti institusi kewangan dalam pembayaran antarabangsa.",
    "structureTitle": "Struktur BIC",
    "structureDescription": "BIC mempunyai 8 atau 11 aksara: kod bank (4 huruf), kod negara (2 huruf), kod lokasi (2 alfanumerik) dan kod cawangan pilihan (3 alfanumerik).",
    "validationTitle": "Peraturan pengesahan",
    "validationDescription": "Pengesahan menyemak panjang, set aksara dan kod negara ISO 3166.",
    "step1": "Buang ruang dan tanda sempang",
    "step2": "Pastikan format 8 atau 11 aksara",
    "step3": "Huraikan kod bank, negara, lokasi dan cawangan",
    "note": "Kod cawangan \"XXX\" atau BIC 8 aksara menunjukkan pejabat utama.",
    "locationNote": "Aksara kedua kod lokasi 0 menandakan BIC ujian; 1 menandakan peserta pasif."
  },
  "no": {
    "title": "Hva er BIC/SWIFT?",
    "description": "BIC (Bank Identifier Code), også kalt SWIFT-kode, identifiserer finansinstitusjoner i internasjonale betalinger.",
    "structureTitle": "BIC-struktur",
    "structureDescription": "En BIC er 8 eller 11 tegn: bankkode (4 bokstaver), landskode (2 bokstaver), stedskode (2 alfanumeriske) og valgfri avdelingskode (3 alfanumeriske).",
    "validationTitle": "Valideringsregler",
    "validationDescription": "Validering kontrollerer lengde, tegnsett og ISO 3166-landkoder.",
    "step1": "Fjern mellomrom og bindestreker",
    "step2": "Sjekk at formatet har 8 eller 11 tegn",
    "step3": "Tolk bank-, land-, sted- og avdelingskoder",
    "note": "Avdelingskode \"XXX\" eller en BIC med 8 tegn indikerer hovedkontoret.",
    "locationNote": "Det andre tegnet i stedskoden 0 indikerer test-BIC; 1 indikerer passiv deltaker."
  }
}
</i18n>
