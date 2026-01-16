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
    "title": "What is a VAT number?",
    "description": "A VAT (Value Added Tax) number identifies a business for VAT reporting and cross-border transactions.",
    "structureTitle": "VAT Number Structure",
    "structureDescription": "Most VAT numbers start with a two-letter country code followed by a country-specific identifier.",
    "validationTitle": "Validation Checks",
    "validationDescription": "VAT validation typically verifies the country code, format, and checksum when defined.",
    "step1": "Normalize the input (remove spaces and separators)",
    "step2": "Verify the country code and required format",
    "step3": "Calculate the checksum when available",
    "note": "This tool checks format and checksum only; it does not confirm registration status."
  },
  "zh": {
    "title": "什么是 VAT 号码？",
    "description": "VAT（增值税）号码用于标识企业的 VAT 申报与跨境交易。",
    "structureTitle": "VAT 号码结构",
    "structureDescription": "大多数 VAT 号码以两位国家代码开头，后面是国家特定的标识符。",
    "validationTitle": "校验检查",
    "validationDescription": "VAT 校验通常验证国家代码、格式以及（如适用）校验和。",
    "step1": "规范化输入（移除空格和分隔符）",
    "step2": "检查国家代码和所需格式",
    "step3": "在可用时计算校验和",
    "note": "此工具仅检查格式与校验和，不确认是否已注册。"
  },
  "zh-CN": {
    "title": "什么是 VAT 号码？",
    "description": "VAT（增值税）号码用于标识企业的 VAT 申报与跨境交易。",
    "structureTitle": "VAT 号码结构",
    "structureDescription": "大多数 VAT 号码以两位国家代码开头，后面是国家特定的标识符。",
    "validationTitle": "校验检查",
    "validationDescription": "VAT 校验通常验证国家代码、格式以及（如适用）校验和。",
    "step1": "规范化输入（移除空格和分隔符）",
    "step2": "检查国家代码和所需格式",
    "step3": "在可用时计算校验和",
    "note": "此工具仅检查格式与校验和，不确认是否已注册。"
  },
  "zh-TW": {
    "title": "什麼是 VAT 號碼？",
    "description": "VAT（增值稅）號碼用於識別企業的 VAT 申報與跨境交易。",
    "structureTitle": "VAT 號碼結構",
    "structureDescription": "大多數 VAT 號碼以兩位國家代碼開頭，後面是國家特定的識別碼。",
    "validationTitle": "驗證檢查",
    "validationDescription": "VAT 驗證通常會檢查國家代碼、格式以及（如適用）校驗和。",
    "step1": "規範化輸入（移除空格和分隔符）",
    "step2": "檢查國家代碼和所需格式",
    "step3": "在可用時計算校驗和",
    "note": "此工具僅檢查格式與校驗和，不確認是否已註冊。"
  },
  "zh-HK": {
    "title": "什麼是 VAT 號碼？",
    "description": "VAT（增值稅）號碼用於識別企業的 VAT 申報與跨境交易。",
    "structureTitle": "VAT 號碼結構",
    "structureDescription": "大多數 VAT 號碼以兩位國家代碼開頭，後面是國家特定的識別碼。",
    "validationTitle": "驗證檢查",
    "validationDescription": "VAT 驗證通常會檢查國家代碼、格式以及（如適用）校驗和。",
    "step1": "規範化輸入（移除空格和分隔符）",
    "step2": "檢查國家代碼和所需格式",
    "step3": "在可用時計算校驗和",
    "note": "此工具僅檢查格式與校驗和，不確認是否已註冊。"
  },
  "es": {
    "title": "¿Qué es un número de IVA?",
    "description": "Un número de IVA (Impuesto sobre el Valor Añadido) identifica a una empresa para declaraciones de IVA y operaciones transfronterizas.",
    "structureTitle": "Estructura del número de IVA",
    "structureDescription": "La mayoría de los números de IVA comienzan con un código de país de dos letras seguido de un identificador específico del país.",
    "validationTitle": "Comprobaciones de validación",
    "validationDescription": "La validación del IVA suele verificar el código de país, el formato y el checksum cuando está definido.",
    "step1": "Normalice la entrada (elimine espacios y separadores)",
    "step2": "Verifique el código de país y el formato requerido",
    "step3": "Calcule el checksum cuando esté disponible",
    "note": "Esta herramienta solo comprueba formato y checksum; no confirma el estado de registro."
  },
  "fr": {
    "title": "Qu'est-ce qu'un numéro de TVA ?",
    "description": "Un numéro de TVA (Taxe sur la valeur ajoutée) identifie une entreprise pour les déclarations de TVA et les transactions transfrontalières.",
    "structureTitle": "Structure du numéro de TVA",
    "structureDescription": "La plupart des numéros de TVA commencent par un code pays à deux lettres suivi d'un identifiant propre au pays.",
    "validationTitle": "Vérifications de validation",
    "validationDescription": "La validation TVA vérifie généralement le code pays, le format et la somme de contrôle lorsqu'elle est définie.",
    "step1": "Normalisez l'entrée (supprimez les espaces et les séparateurs)",
    "step2": "Vérifiez le code pays et le format requis",
    "step3": "Calculez la somme de contrôle lorsqu'elle est disponible",
    "note": "Cet outil ne vérifie que le format et la somme de contrôle ; il ne confirme pas l'enregistrement."
  },
  "de": {
    "title": "Was ist eine USt-IdNr.?",
    "description": "Eine USt-IdNr. identifiziert ein Unternehmen für Umsatzsteuer-Meldungen und grenzüberschreitende Transaktionen.",
    "structureTitle": "Aufbau der USt-IdNr.",
    "structureDescription": "Die meisten USt-IdNr. beginnen mit einem zweibuchstabigen Ländercode, gefolgt von einer länderspezifischen Kennung.",
    "validationTitle": "Validierungsprüfungen",
    "validationDescription": "Die USt-IdNr.-Validierung prüft in der Regel Ländercode, Format und Prüfsumme, sofern definiert.",
    "step1": "Eingabe normalisieren (Leerzeichen und Trennzeichen entfernen)",
    "step2": "Ländercode und erforderliches Format prüfen",
    "step3": "Prüfsumme berechnen, falls verfügbar",
    "note": "Dieses Tool prüft nur Format und Prüfsumme; es bestätigt keine Registrierung."
  },
  "it": {
    "title": "Cos'è la partita IVA?",
    "description": "La partita IVA identifica un'azienda per le dichiarazioni IVA e le transazioni transfrontaliere.",
    "structureTitle": "Struttura della partita IVA",
    "structureDescription": "La maggior parte delle partite IVA inizia con un codice paese di due lettere seguito da un identificatore specifico del paese.",
    "validationTitle": "Controlli di validazione",
    "validationDescription": "La validazione della partita IVA verifica di solito il codice paese, il formato e il checksum quando disponibile.",
    "step1": "Normalizza l'input (rimuovi spazi e separatori)",
    "step2": "Verifica il codice paese e il formato richiesto",
    "step3": "Calcola il checksum quando disponibile",
    "note": "Questo strumento controlla solo formato e checksum; non conferma la registrazione."
  },
  "ja": {
    "title": "VAT 番号とは？",
    "description": "VAT（付加価値税）番号は、VAT 申告や越境取引のために事業者を識別します。",
    "structureTitle": "VAT 番号の構造",
    "structureDescription": "多くの VAT 番号は 2 文字の国コードの後に国別の識別子が続きます。",
    "validationTitle": "検証チェック",
    "validationDescription": "VAT 検証では国コード、形式、チェックサム（定義されている場合）を確認します。",
    "step1": "入力を正規化（空白や区切りを削除）",
    "step2": "国コードと必要な形式を確認",
    "step3": "利用可能な場合はチェックサムを計算",
    "note": "このツールは形式とチェックサムのみを確認し、登録状況は確認しません。"
  },
  "ko": {
    "title": "VAT 번호란?",
    "description": "VAT(부가가치세) 번호는 VAT 신고와 국가 간 거래를 위해 사업자를 식별합니다.",
    "structureTitle": "VAT 번호 구조",
    "structureDescription": "대부분의 VAT 번호는 2자리 국가 코드 다음에 국가별 식별자가 옵니다.",
    "validationTitle": "검증 항목",
    "validationDescription": "VAT 검증은 일반적으로 국가 코드, 형식, 체크섬(정의된 경우)을 확인합니다.",
    "step1": "입력을 정규화합니다(공백과 구분 기호 제거)",
    "step2": "국가 코드와 필요한 형식을 확인",
    "step3": "가능한 경우 체크섬을 계산",
    "note": "이 도구는 형식과 체크섬만 확인하며 등록 상태는 확인하지 않습니다."
  },
  "ru": {
    "title": "Что такое номер НДС?",
    "description": "Номер НДС (налога на добавленную стоимость) идентифицирует компанию для отчетности по НДС и трансграничных операций.",
    "structureTitle": "Структура номера НДС",
    "structureDescription": "Большинство номеров НДС начинаются с двухбуквенного кода страны, за которым следует национальный идентификатор.",
    "validationTitle": "Проверки валидации",
    "validationDescription": "Проверка НДС обычно включает код страны, формат и контрольную сумму, если она определена.",
    "step1": "Нормализуйте ввод (удалите пробелы и разделители)",
    "step2": "Проверьте код страны и требуемый формат",
    "step3": "Рассчитайте контрольную сумму, если она доступна",
    "note": "Этот инструмент проверяет только формат и контрольную сумму; он не подтверждает регистрацию."
  },
  "pt": {
    "title": "O que é um número de IVA?",
    "description": "Um número de IVA identifica uma empresa para declarações de IVA e transações transfronteiriças.",
    "structureTitle": "Estrutura do número de IVA",
    "structureDescription": "A maioria dos números de IVA começa com um código de país de duas letras seguido de um identificador específico do país.",
    "validationTitle": "Verificações de validação",
    "validationDescription": "A validação do IVA normalmente verifica o código do país, o formato e o checksum quando definido.",
    "step1": "Normalize a entrada (remova espaços e separadores)",
    "step2": "Verifique o código do país e o formato exigido",
    "step3": "Calcule o checksum quando disponível",
    "note": "Esta ferramenta verifica apenas formato e checksum; não confirma o registro."
  },
  "ar": {
    "title": "ما هو رقم ضريبة القيمة المضافة؟",
    "description": "رقم ضريبة القيمة المضافة يعرّف المنشأة لأغراض الإقرارات الضريبية والمعاملات العابرة للحدود.",
    "structureTitle": "بنية رقم ضريبة القيمة المضافة",
    "structureDescription": "تبدأ معظم أرقام ضريبة القيمة المضافة برمز بلد من حرفين يليه معرّف خاص بالبلد.",
    "validationTitle": "عمليات التحقق",
    "validationDescription": "عادةً ما تتحقق عملية التحقق من رمز البلد والتنسيق والمجموع الاختباري عند توفره.",
    "step1": "طَبِّع الإدخال (أزل المسافات والفواصل)",
    "step2": "تحقق من رمز البلد والتنسيق المطلوب",
    "step3": "احسب المجموع الاختباري عند توفره",
    "note": "هذه الأداة تتحقق من التنسيق والمجموع الاختباري فقط؛ ولا تؤكد حالة التسجيل."
  },
  "hi": {
    "title": "VAT नंबर क्या है?",
    "description": "VAT (मूल्य वर्धित कर) नंबर VAT रिपोर्टिंग और सीमा-पार लेन-देन के लिए व्यवसाय की पहचान करता है।",
    "structureTitle": "VAT नंबर की संरचना",
    "structureDescription": "अधिकांश VAT नंबर दो-अक्षर वाले देश कोड से शुरू होते हैं, उसके बाद देश-विशिष्ट पहचानकर्ता होता है।",
    "validationTitle": "सत्यापन जांच",
    "validationDescription": "VAT सत्यापन आमतौर पर देश कोड, प्रारूप और उपलब्ध होने पर चेकसम की जांच करता है।",
    "step1": "इनपुट को सामान्यीकृत करें (स्पेस और विभाजक हटाएं)",
    "step2": "देश कोड और आवश्यक प्रारूप सत्यापित करें",
    "step3": "उपलब्ध होने पर चेकसम गणना करें",
    "note": "यह उपकरण केवल प्रारूप और चेकसम की जांच करता है; यह पंजीकरण की पुष्टि नहीं करता।"
  },
  "tr": {
    "title": "KDV numarası nedir?",
    "description": "KDV numarası, KDV beyanları ve sınır ötesi işlemler için bir işletmeyi tanımlar.",
    "structureTitle": "KDV numarası yapısı",
    "structureDescription": "Çoğu KDV numarası iki harfli bir ülke kodu ile başlar ve ülkeye özgü bir tanımlayıcıyla devam eder.",
    "validationTitle": "Doğrulama kontrolleri",
    "validationDescription": "KDV doğrulaması genellikle ülke kodunu, biçimi ve mevcutsa sağlama toplamını kontrol eder.",
    "step1": "Girdiyi normalize edin (boşlukları ve ayırıcıları kaldırın)",
    "step2": "Ülke kodunu ve gerekli biçimi doğrulayın",
    "step3": "Mümkünse sağlama toplamını hesaplayın",
    "note": "Bu araç yalnızca biçim ve sağlama toplamını kontrol eder; kayıt durumunu doğrulamaz."
  },
  "nl": {
    "title": "Wat is een btw-nummer?",
    "description": "Een btw-nummer identificeert een bedrijf voor btw-aangifte en grensoverschrijdende transacties.",
    "structureTitle": "Structuur van het btw-nummer",
    "structureDescription": "De meeste btw-nummers beginnen met een landcode van twee letters, gevolgd door een land-specifieke identificatie.",
    "validationTitle": "Validatiecontroles",
    "validationDescription": "Btw-validatie controleert meestal de landcode, het formaat en de controlesom wanneer die is gedefinieerd.",
    "step1": "Normaliseer de invoer (verwijder spaties en scheidingstekens)",
    "step2": "Controleer de landcode en het vereiste formaat",
    "step3": "Bereken de controlesom indien beschikbaar",
    "note": "Deze tool controleert alleen formaat en controlesom; registratie wordt niet bevestigd."
  },
  "sv": {
    "title": "Vad är ett VAT-nummer?",
    "description": "Ett VAT-nummer identifierar ett företag för momsrapportering och gränsöverskridande transaktioner.",
    "structureTitle": "VAT-nummerstruktur",
    "structureDescription": "De flesta VAT-nummer börjar med en tvåbokstavskod för land följt av en landspecifik identifierare.",
    "validationTitle": "Valideringskontroller",
    "validationDescription": "VAT-validering kontrollerar vanligtvis landskod, format och kontrollsumma när den finns.",
    "step1": "Normalisera indata (ta bort mellanslag och avgränsare)",
    "step2": "Kontrollera landskod och krävt format",
    "step3": "Beräkna kontrollsumma när det är möjligt",
    "note": "Det här verktyget kontrollerar bara format och kontrollsumma; det bekräftar inte registreringsstatus."
  },
  "pl": {
    "title": "Czym jest numer VAT?",
    "description": "Numer VAT identyfikuje firmę na potrzeby rozliczeń VAT i transakcji transgranicznych.",
    "structureTitle": "Struktura numeru VAT",
    "structureDescription": "Większość numerów VAT zaczyna się od dwuliterowego kodu kraju, po którym następuje identyfikator krajowy.",
    "validationTitle": "Kontrole weryfikacji",
    "validationDescription": "Walidacja VAT zwykle sprawdza kod kraju, format i sumę kontrolną, jeśli jest zdefiniowana.",
    "step1": "Znormalizuj dane wejściowe (usuń spacje i separatory)",
    "step2": "Sprawdź kod kraju i wymagany format",
    "step3": "Oblicz sumę kontrolną, jeśli jest dostępna",
    "note": "To narzędzie sprawdza tylko format i sumę kontrolną; nie potwierdza rejestracji."
  },
  "vi": {
    "title": "Số VAT là gì?",
    "description": "Số VAT (thuế giá trị gia tăng) xác định doanh nghiệp cho việc khai báo VAT và giao dịch xuyên biên giới.",
    "structureTitle": "Cấu trúc số VAT",
    "structureDescription": "Hầu hết số VAT bắt đầu bằng mã quốc gia gồm hai chữ cái, theo sau là định danh theo từng quốc gia.",
    "validationTitle": "Kiểm tra xác thực",
    "validationDescription": "Xác thực VAT thường kiểm tra mã quốc gia, định dạng và checksum khi có.",
    "step1": "Chuẩn hóa đầu vào (loại bỏ khoảng trắng và dấu phân tách)",
    "step2": "Kiểm tra mã quốc gia và định dạng yêu cầu",
    "step3": "Tính checksum khi có thể",
    "note": "Công cụ này chỉ kiểm tra định dạng và checksum; không xác nhận tình trạng đăng ký."
  },
  "th": {
    "title": "หมายเลข VAT คืออะไร?",
    "description": "หมายเลข VAT ใช้ระบุธุรกิจสำหรับการยื่นภาษีมูลค่าเพิ่มและธุรกรรมข้ามพรมแดน",
    "structureTitle": "โครงสร้างหมายเลข VAT",
    "structureDescription": "หมายเลข VAT ส่วนใหญ่เริ่มด้วยรหัสประเทศสองตัวอักษร ตามด้วยตัวระบุเฉพาะประเทศ",
    "validationTitle": "การตรวจสอบความถูกต้อง",
    "validationDescription": "การตรวจสอบ VAT มักตรวจรหัสประเทศ รูปแบบ และผลรวมตรวจสอบเมื่อมี",
    "step1": "ทำให้ข้อมูลเป็นมาตรฐาน (ลบช่องว่างและตัวคั่น)",
    "step2": "ตรวจสอบรหัสประเทศและรูปแบบที่กำหนด",
    "step3": "คำนวณผลรวมตรวจสอบเมื่อมี",
    "note": "เครื่องมือนี้ตรวจเฉพาะรูปแบบและผลรวมตรวจสอบเท่านั้น ไม่ยืนยันสถานะการลงทะเบียน"
  },
  "id": {
    "title": "Apa itu nomor VAT?",
    "description": "Nomor VAT mengidentifikasi bisnis untuk pelaporan VAT dan transaksi lintas batas.",
    "structureTitle": "Struktur nomor VAT",
    "structureDescription": "Sebagian besar nomor VAT diawali dengan kode negara dua huruf yang diikuti oleh identifikator khusus negara.",
    "validationTitle": "Pemeriksaan validasi",
    "validationDescription": "Validasi VAT biasanya memeriksa kode negara, format, dan checksum jika tersedia.",
    "step1": "Normalkan input (hapus spasi dan pemisah)",
    "step2": "Periksa kode negara dan format yang diperlukan",
    "step3": "Hitung checksum jika tersedia",
    "note": "Alat ini hanya memeriksa format dan checksum; tidak mengonfirmasi status pendaftaran."
  },
  "he": {
    "title": "מהו מספר מע״מ?",
    "description": "מספר מע״מ מזהה עסק לצורכי דיווח מע״מ ועסקאות חוצות גבולות.",
    "structureTitle": "מבנה מספר מע״מ",
    "structureDescription": "רוב מספרי המע״מ מתחילים בקוד מדינה בן שתי אותיות ולאחריו מזהה ייעודי למדינה.",
    "validationTitle": "בדיקות אימות",
    "validationDescription": "אימות מע״מ בודק בדרך כלל קוד מדינה, פורמט וסכום ביקורת כאשר הוא מוגדר.",
    "step1": "נרמל את הקלט (הסר רווחים ומפרידים)",
    "step2": "בדוק את קוד המדינה ואת הפורמט הנדרש",
    "step3": "חשב את סכום הביקורת כאשר הוא זמין",
    "note": "הכלי בודק רק פורמט וסכום ביקורת; הוא לא מאשר רישום."
  },
  "ms": {
    "title": "Apa itu nombor VAT?",
    "description": "Nombor VAT mengenal pasti perniagaan untuk pelaporan VAT dan transaksi rentas sempadan.",
    "structureTitle": "Struktur nombor VAT",
    "structureDescription": "Kebanyakan nombor VAT bermula dengan kod negara dua huruf diikuti pengenal khusus negara.",
    "validationTitle": "Pemeriksaan pengesahan",
    "validationDescription": "Pengesahan VAT biasanya menyemak kod negara, format dan checksum apabila tersedia.",
    "step1": "Normalkan input (buang ruang dan pemisah)",
    "step2": "Sahkan kod negara dan format yang diperlukan",
    "step3": "Kira checksum apabila tersedia",
    "note": "Alat ini hanya memeriksa format dan checksum; tidak mengesahkan status pendaftaran."
  },
  "no": {
    "title": "Hva er et MVA-nummer?",
    "description": "Et MVA-nummer identifiserer en virksomhet for MVA-rapportering og grensekryssende transaksjoner.",
    "structureTitle": "Struktur for MVA-nummer",
    "structureDescription": "De fleste MVA-numre starter med en landskode på to bokstaver etterfulgt av en landsspesifikk identifikator.",
    "validationTitle": "Valideringskontroller",
    "validationDescription": "MVA-validering kontrollerer vanligvis landskode, format og kontrollsum når den finnes.",
    "step1": "Normaliser inndata (fjern mellomrom og skilletegn)",
    "step2": "Sjekk landskode og påkrevd format",
    "step3": "Beregn kontrollsum når tilgjengelig",
    "note": "Dette verktøyet kontrollerer bare format og kontrollsum; det bekrefter ikke registreringsstatus."
  }
}
</i18n>
