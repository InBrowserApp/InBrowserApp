<template>
  <DescriptionMarkdown
    :title="t('what-is-sm3')"
    :description="t('what-is-sm3-description-markdown')"
  />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "what-is-sm3": "What is SM3?",
    "what-is-sm3-description-markdown": "SM3 is a cryptographic hash function standardized in China (GM/T 0004-2012). It produces a 256-bit (32-byte) hash value, typically shown as a 64-character hexadecimal string.\n\n**Key characteristics:**\n- **Deterministic**: The same input always produces the same hash\n- **Avalanche effect**: Small changes in input produce very different outputs\n- **Collision resistant**: Designed to make collisions hard to find\n\n**Common uses:**\n- Data integrity checks\n- Digital signatures (SM2)\n- Secure identifiers"
  },
  "zh": {
    "what-is-sm3": "什么是 SM3？",
    "what-is-sm3-description-markdown": "SM3 是中国国家标准（GM/T 0004-2012）中的加密散列函数。它产生 256 位（32 字节）的散列值，通常表示为 64 个字符的十六进制字符串。\n\n**主要特征：**\n- **确定性**：相同输入总是产生相同的散列\n- **雪崩效应**：输入的微小变化会产生非常不同的输出\n- **抗碰撞**：设计上使得找到碰撞非常困难\n\n**常见用途：**\n- 数据完整性校验\n- 数字签名（SM2）\n- 安全标识符"
  },
  "zh-CN": {
    "what-is-sm3": "什么是 SM3？",
    "what-is-sm3-description-markdown": "SM3 是中国国家标准（GM/T 0004-2012）中的加密散列函数。它产生 256 位（32 字节）的散列值，通常表示为 64 个字符的十六进制字符串。\n\n**主要特征：**\n- **确定性**：相同输入总是产生相同的散列\n- **雪崩效应**：输入的微小变化会产生非常不同的输出\n- **抗碰撞**：设计上使得找到碰撞非常困难\n\n**常见用途：**\n- 数据完整性校验\n- 数字签名（SM2）\n- 安全标识符"
  },
  "zh-TW": {
    "what-is-sm3": "什麼是 SM3？",
    "what-is-sm3-description-markdown": "SM3 是中國國家標準（GM/T 0004-2012）中的加密雜湊函數。它產生 256 位元（32 位元組）的雜湊值，通常表示為 64 個字元的十六進位字串。\n\n**主要特徵：**\n- **確定性**：相同輸入總是產生相同的雜湊\n- **雪崩效應**：輸入的微小變化會產生非常不同的輸出\n- **抗碰撞**：設計上使得找到碰撞非常困難\n\n**常見用途：**\n- 資料完整性檢查\n- 數位簽章（SM2）\n- 安全識別碼"
  },
  "zh-HK": {
    "what-is-sm3": "什麼是 SM3？",
    "what-is-sm3-description-markdown": "SM3 是中國國家標準（GM/T 0004-2012）中的加密雜湊函數。它產生 256 位元（32 位元組）的雜湊值，通常表示為 64 個字元的十六進位字串。\n\n**主要特徵：**\n- **確定性**：相同輸入總是產生相同的雜湊\n- **雪崩效應**：輸入的微小變化會產生非常不同的輸出\n- **抗碰撞**：設計上使得找到碰撞非常困難\n\n**常見用途：**\n- 資料完整性檢查\n- 數位簽章（SM2）\n- 安全識別碼"
  },
  "es": {
    "what-is-sm3": "¿Qué es SM3?",
    "what-is-sm3-description-markdown": "SM3 es una función hash criptográfica estandarizada en China (GM/T 0004-2012). Produce un valor hash de 256 bits (32 bytes), normalmente mostrado como una cadena hexadecimal de 64 caracteres.\n\n**Características clave:**\n- **Determinista**: La misma entrada siempre produce el mismo hash\n- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas muy diferentes\n- **Resistente a colisiones**: Diseñada para dificultar encontrar colisiones\n\n**Usos comunes:**\n- Verificación de integridad de datos\n- Firmas digitales (SM2)\n- Identificadores seguros"
  },
  "fr": {
    "what-is-sm3": "Qu'est-ce que SM3 ?",
    "what-is-sm3-description-markdown": "SM3 est une fonction de hachage cryptographique normalisée en Chine (GM/T 0004-2012). Elle produit une valeur de hachage de 256 bits (32 octets), généralement affichée comme une chaîne hexadécimale de 64 caractères.\n\n**Caractéristiques clés :**\n- **Déterministe** : La même entrée produit toujours le même hachage\n- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties très différentes\n- **Résistant aux collisions** : Conçue pour rendre les collisions difficiles à trouver\n\n**Utilisations courantes :**\n- Vérification d'intégrité des données\n- Signatures numériques (SM2)\n- Identifiants sécurisés"
  },
  "de": {
    "what-is-sm3": "Was ist SM3?",
    "what-is-sm3-description-markdown": "SM3 ist eine in China standardisierte kryptografische Hash-Funktion (GM/T 0004-2012). Sie erzeugt einen 256-Bit-(32-Byte-)Hashwert, der typischerweise als 64-stellige Hexadezimalzeichenkette dargestellt wird.\n\n**Hauptmerkmale:**\n- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash\n- **Lawineneffekt**: Kleine Änderungen der Eingabe erzeugen sehr unterschiedliche Ausgaben\n- **Kollisionsresistent**: Entwickelt, um Kollisionen schwer auffindbar zu machen\n\n**Häufige Verwendungen:**\n- Datenintegritätsprüfungen\n- Digitale Signaturen (SM2)\n- Sichere Kennungen"
  },
  "it": {
    "what-is-sm3": "Cos'è SM3?",
    "what-is-sm3-description-markdown": "SM3 è una funzione hash crittografica standardizzata in Cina (GM/T 0004-2012). Produce un valore hash di 256 bit (32 byte), di solito mostrato come una stringa esadecimale di 64 caratteri.\n\n**Caratteristiche chiave:**\n- **Deterministica**: Lo stesso input produce sempre lo stesso hash\n- **Effetto valanga**: Piccoli cambiamenti nell'input producono output molto diversi\n- **Resistente alle collisioni**: Progettata per rendere difficile trovare collisioni\n\n**Usi comuni:**\n- Verifiche di integrità dei dati\n- Firme digitali (SM2)\n- Identificatori sicuri"
  },
  "ja": {
    "what-is-sm3": "SM3とは？",
    "what-is-sm3-description-markdown": "SM3 は中国で標準化された暗号学的ハッシュ関数です（GM/T 0004-2012）。256 ビット（32 バイト）のハッシュ値を生成し、通常は 64 文字の 16 進文字列で表示されます。\n\n**主な特徴：**\n- **決定論的**：同じ入力は常に同じハッシュを生成\n- **雪崩効果**：入力の小さな変化が非常に異なる出力を生成\n- **衝突耐性**：衝突を見つけにくいよう設計\n\n**一般的な用途：**\n- データ整合性チェック\n- デジタル署名（SM2）\n- 安全な識別子"
  },
  "ko": {
    "what-is-sm3": "SM3란?",
    "what-is-sm3-description-markdown": "SM3는 중국에서 표준화된 암호학적 해시 함수입니다(GM/T 0004-2012). 256비트(32바이트) 해시 값을 생성하며, 보통 64자 16진수 문자열로 표시됩니다.\n\n**주요 특징:**\n- **결정론적**: 같은 입력은 항상 같은 해시를 생성\n- **눈사태 효과**: 입력의 작은 변화가 매우 다른 출력 생성\n- **충돌 저항성**: 충돌을 찾기 어렵도록 설계됨\n\n**일반적인 용도:**\n- 데이터 무결성 검사\n- 디지털 서명(SM2)\n- 안전한 식별자"
  },
  "ru": {
    "what-is-sm3": "Что такое SM3?",
    "what-is-sm3-description-markdown": "SM3 — криптографическая хеш-функция, стандартизированная в Китае (GM/T 0004-2012). Она производит 256-битное (32-байтовое) хеш-значение, обычно отображаемое как 64-символьная шестнадцатеричная строка.\n\n**Ключевые характеристики:**\n- **Детерминированная**: Один и тот же ввод всегда дает один и тот же хеш\n- **Эффект лавины**: Небольшие изменения ввода дают очень разные результаты\n- **Устойчивость к коллизиям**: Спроектирована так, чтобы коллизии было трудно найти\n\n**Обычные применения:**\n- Проверка целостности данных\n- Цифровые подписи (SM2)\n- Безопасные идентификаторы"
  },
  "pt": {
    "what-is-sm3": "O que é SM3?",
    "what-is-sm3-description-markdown": "SM3 é uma função hash criptográfica padronizada na China (GM/T 0004-2012). Ela produz um valor hash de 256 bits (32 bytes), normalmente mostrado como uma string hexadecimal de 64 caracteres.\n\n**Características principais:**\n- **Determinístico**: A mesma entrada sempre produz o mesmo hash\n- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas muito diferentes\n- **Resistente a colisões**: Projetada para tornar colisões difíceis de encontrar\n\n**Usos comuns:**\n- Verificação de integridade de dados\n- Assinaturas digitais (SM2)\n- Identificadores seguros"
  },
  "ar": {
    "what-is-sm3": "ما هو SM3؟",
    "what-is-sm3-description-markdown": "‏SM3 هي دالة تجزئة تشفيرية موحدة في الصين (GM/T 0004-2012). تنتج قيمة تجزئة بطول 256 بت (32 بايت)، وعادة ما تُعرض كسلسلة سداسية عشرية من 64 حرفًا.\n\n**الخصائص الرئيسية:**\n- **حتمية**: نفس الإدخال ينتج نفس التجزئة دائمًا\n- **تأثير الانهيار الجليدي**: تغييرات صغيرة في الإدخال تُنتج مخرجات مختلفة جدًا\n- **مقاومة التصادمات**: مصممة لجعل العثور على تصادمات أمرًا صعبًا\n\n**الاستخدامات الشائعة:**\n- التحقق من سلامة البيانات\n- التوقيعات الرقمية (SM2)\n- معرّفات آمنة"
  },
  "hi": {
    "what-is-sm3": "SM3 क्या है?",
    "what-is-sm3-description-markdown": "SM3 चीन में मानकीकृत (GM/T 0004-2012) एक क्रिप्टोग्राफिक हैश फ़ंक्शन है। यह 256-बिट (32-बाइट) हैश मान उत्पन्न करता है, जिसे आमतौर पर 64-अक्षरों की हेक्साडेसिमल स्ट्रिंग के रूप में दिखाया जाता है।\n\n**मुख्य विशेषताएं:**\n- **निर्धारक**: वही इनपुट हमेशा वही हैश देता है\n- **हिमस्खलन प्रभाव**: इनपुट में छोटे बदलाव बहुत अलग आउटपुट देते हैं\n- **टक्कर प्रतिरोधी**: टकराव ढूंढना कठिन बनाने के लिए डिज़ाइन किया गया\n\n**सामान्य उपयोग:**\n- डेटा अखंडता जांच\n- डिजिटल हस्ताक्षर (SM2)\n- सुरक्षित पहचानकर्ता"
  },
  "tr": {
    "what-is-sm3": "SM3 nedir?",
    "what-is-sm3-description-markdown": "SM3, Çin'de standardlaştırılmış bir kriptografik hash fonksiyonudur (GM/T 0004-2012). 256 bit (32 bayt) bir hash değeri üretir ve genellikle 64 karakterlik onaltılık bir dize olarak gösterilir.\n\n**Temel özellikler:**\n- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir\n- **Çığ etkisi**: Girdideki küçük değişiklikler çok farklı çıktılar üretir\n- **Çarpışma dirençli**: Çarpışmaları bulmayı zorlaştıracak şekilde tasarlanmıştır\n\n**Yaygın kullanımlar:**\n- Veri bütünlüğü kontrolleri\n- Dijital imzalar (SM2)\n- Güvenli tanımlayıcılar"
  },
  "nl": {
    "what-is-sm3": "Wat is SM3?",
    "what-is-sm3-description-markdown": "SM3 is een cryptografische hashfunctie die in China is gestandaardiseerd (GM/T 0004-2012). Ze produceert een 256-bit (32-byte) hashwaarde, meestal weergegeven als een hexadecimale string van 64 tekens.\n\n**Belangrijkste kenmerken:**\n- **Deterministisch**: Dezelfde invoer levert altijd dezelfde hash op\n- **Lawine-effect**: Kleine wijzigingen in de invoer geven zeer verschillende uitvoer\n- **Botsingsbestendig**: Ontworpen om het vinden van botsingen moeilijk te maken\n\n**Veelvoorkomende toepassingen:**\n- Integriteitscontroles van gegevens\n- Digitale handtekeningen (SM2)\n- Veilige identifiers"
  },
  "sv": {
    "what-is-sm3": "Vad är SM3?",
    "what-is-sm3-description-markdown": "SM3 är en kryptografisk hashfunktion standardiserad i Kina (GM/T 0004-2012). Den producerar ett 256-bitars (32-byte) hashvärde, vanligtvis visat som en 64-teckens hexsträng.\n\n**Nyckelegenskaper:**\n- **Deterministisk**: Samma inmatning ger alltid samma hash\n- **Lavineffekt**: Små förändringar i inmatningen ger mycket olika utdata\n- **Kollisionsresistent**: Utformad för att göra kollisioner svåra att hitta\n\n**Vanliga användningar:**\n- Dataintegritetskontroller\n- Digitala signaturer (SM2)\n- Säkra identifierare"
  },
  "pl": {
    "what-is-sm3": "Czym jest SM3?",
    "what-is-sm3-description-markdown": "SM3 to kryptograficzna funkcja skrótu standaryzowana w Chinach (GM/T 0004-2012). Tworzy 256-bitową (32-bajtową) wartość skrótu, zwykle przedstawianą jako 64-znakowy ciąg szesnastkowy.\n\n**Kluczowe cechy:**\n- **Deterministyczna**: To samo wejście zawsze daje ten sam skrót\n- **Efekt lawiny**: Małe zmiany wejścia dają bardzo różne wyniki\n- **Odporna na kolizje**: Zaprojektowana tak, aby utrudniać znalezienie kolizji\n\n**Typowe zastosowania:**\n- Kontrole integralności danych\n- Podpisy cyfrowe (SM2)\n- Bezpieczne identyfikatory"
  },
  "vi": {
    "what-is-sm3": "SM3 là gì?",
    "what-is-sm3-description-markdown": "SM3 là hàm băm mật mã được tiêu chuẩn hóa tại Trung Quốc (GM/T 0004-2012). Hàm tạo giá trị băm 256-bit (32 byte), thường hiển thị dưới dạng chuỗi thập lục phân 64 ký tự.\n\n**Đặc điểm chính:**\n- **Xác định**: Cùng một đầu vào luôn cho cùng một băm\n- **Hiệu ứng tuyết lở**: Thay đổi nhỏ ở đầu vào tạo ra đầu ra rất khác\n- **Chống va chạm**: Được thiết kế để khó tìm va chạm\n\n**Ứng dụng phổ biến:**\n- Kiểm tra toàn vẹn dữ liệu\n- Chữ ký số (SM2)\n- Định danh an toàn"
  },
  "th": {
    "what-is-sm3": "SM3 คืออะไร?",
    "what-is-sm3-description-markdown": "SM3 เป็นฟังก์ชันแฮชเชิงเข้ารหัสที่ได้มาตรฐานในจีน (GM/T 0004-2012) ให้ค่าแฮช 256 บิต (32 ไบต์) โดยมักแสดงเป็นสตริงเลขฐานสิบหก 64 ตัวอักษร\n\n**คุณลักษณะสำคัญ:**\n- **กำหนดได้**: อินพุตเดียวกันให้แฮชเหมือนเดิมเสมอ\n- **เอฟเฟกต์หิมะถล่ม**: การเปลี่ยนแปลงเล็กน้อยในอินพุตทำให้ได้ผลลัพธ์ที่ต่างมาก\n- **ต้านทานการชน**: ออกแบบมาให้หาการชนได้ยาก\n\n**การใช้งานทั่วไป:**\n- การตรวจสอบความสมบูรณ์ของข้อมูล\n- ลายเซ็นดิจิทัล (SM2)\n- ตัวระบุที่ปลอดภัย"
  },
  "id": {
    "what-is-sm3": "Apa itu SM3?",
    "what-is-sm3-description-markdown": "SM3 adalah fungsi hash kriptografi yang distandarkan di Tiongkok (GM/T 0004-2012). Fungsi ini menghasilkan nilai hash 256-bit (32 byte), biasanya ditampilkan sebagai string heksadesimal 64 karakter.\n\n**Karakteristik utama:**\n- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama\n- **Efek avalanche**: Perubahan kecil pada input menghasilkan output yang sangat berbeda\n- **Tahan collision**: Dirancang agar collision sulit ditemukan\n\n**Penggunaan umum:**\n- Pemeriksaan integritas data\n- Tanda tangan digital (SM2)\n- Pengidentifikasi aman"
  },
  "he": {
    "what-is-sm3": "מה זה SM3?",
    "what-is-sm3-description-markdown": "‏SM3 היא פונקציית גיבוב קריפטוגרפית שמתוקננת בסין (GM/T 0004-2012). היא מפיקה ערך גיבוב של 256 ביט (32 בתים), בדרך כלל כמחרוזת הקסדצימלית באורך 64 תווים.\n\n**מאפיינים עיקריים:**\n- **דטרמיניסטית**: אותו קלט תמיד מפיק אותו גיבוב\n- **אפקט מפולת**: שינויים קטנים בקלט גורמים לפלט שונה מאוד\n- **עמידה להתנגשויות**: מתוכננת כך שקשה למצוא התנגשויות\n\n**שימושים נפוצים:**\n- בדיקות שלמות נתונים\n- חתימות דיגיטליות (SM2)\n- מזהים מאובטחים"
  },
  "ms": {
    "what-is-sm3": "Apakah SM3?",
    "what-is-sm3-description-markdown": "SM3 ialah fungsi hash kriptografi yang dinormakan di China (GM/T 0004-2012). Ia menghasilkan nilai hash 256-bit (32 bait), biasanya dipaparkan sebagai rentetan heksadesimal 64 aksara.\n\n**Ciri-ciri utama:**\n- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama\n- **Kesan runtuhan salji**: Perubahan kecil pada input menghasilkan output yang sangat berbeza\n- **Tahan perlanggaran**: Direka untuk menyukarkan pencarian perlanggaran\n\n**Kegunaan biasa:**\n- Pemeriksaan integriti data\n- Tandatangan digital (SM2)\n- Pengenal pasti selamat"
  },
  "no": {
    "what-is-sm3": "Hva er SM3?",
    "what-is-sm3-description-markdown": "SM3 er en kryptografisk hashfunksjon standardisert i Kina (GM/T 0004-2012). Den produserer en 256-bit (32-byte) hashverdi, vanligvis vist som en 64-tegns heksadesimal streng.\n\n**Nøkkelegenskaper:**\n- **Deterministisk**: Samme inndata gir alltid samme hash\n- **Snøskredeffekt**: Små endringer i inndata gir svært ulike utdata\n- **Kollisjonsresistent**: Utformet for å gjøre kollisjoner vanskelige å finne\n\n**Vanlige bruksområder:**\n- Dataintegritetskontroller\n- Digitale signaturer (SM2)\n- Sikre identifikatorer"
  }
}
</i18n>
