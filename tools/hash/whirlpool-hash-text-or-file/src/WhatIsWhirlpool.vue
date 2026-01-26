<template>
  <DescriptionMarkdown
    :title="t('what-is-whirlpool')"
    :description="t('what-is-whirlpool-description-markdown')"
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
    "what-is-whirlpool": "What is Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool is a cryptographic hash function. It produces a 512-bit (64-byte) hash value, typically shown as a 128-character hexadecimal string.\n\n**Key characteristics:**\n- **Deterministic**: The same input always produces the same hash\n- **Avalanche effect**: Small changes in input produce very different outputs\n- **Collision resistant**: Designed to make collisions hard to find\n\n**Common uses:**\n- Data integrity checks\n- Digital signatures\n- Secure identifiers"
  },
  "zh": {
    "what-is-whirlpool": "什么是 Whirlpool？",
    "what-is-whirlpool-description-markdown": "Whirlpool 是一种加密散列函数。它产生 512 位（64 字节）的散列值，通常表示为 128 个字符的十六进制字符串。\n\n**主要特征：**\n- **确定性**：相同输入总是产生相同的散列\n- **雪崩效应**：输入的微小变化会产生非常不同的输出\n- **抗碰撞**：设计上使得找到碰撞非常困难\n\n**常见用途：**\n- 数据完整性校验\n- 数字签名\n- 安全标识符"
  },
  "zh-CN": {
    "what-is-whirlpool": "什么是 Whirlpool？",
    "what-is-whirlpool-description-markdown": "Whirlpool 是一种加密散列函数。它产生 512 位（64 字节）的散列值，通常表示为 128 个字符的十六进制字符串。\n\n**主要特征：**\n- **确定性**：相同输入总是产生相同的散列\n- **雪崩效应**：输入的微小变化会产生非常不同的输出\n- **抗碰撞**：设计上使得找到碰撞非常困难\n\n**常见用途：**\n- 数据完整性校验\n- 数字签名\n- 安全标识符"
  },
  "zh-TW": {
    "what-is-whirlpool": "什麼是 Whirlpool？",
    "what-is-whirlpool-description-markdown": "Whirlpool 是一種加密雜湊函數。它產生 512 位元（64 位元組）的雜湊值，通常表示為 128 個字元的十六進位字串。\n\n**主要特徵：**\n- **確定性**：相同輸入總是產生相同的雜湊\n- **雪崩效應**：輸入的微小變化會產生非常不同的輸出\n- **抗碰撞**：設計上使得找到碰撞非常困難\n\n**常見用途：**\n- 資料完整性檢查\n- 數位簽章\n- 安全識別碼"
  },
  "zh-HK": {
    "what-is-whirlpool": "什麼是 Whirlpool？",
    "what-is-whirlpool-description-markdown": "Whirlpool 是一種加密雜湊函數。它產生 512 位元（64 位元組）的雜湊值，通常表示為 128 個字元的十六進位字串。\n\n**主要特徵：**\n- **確定性**：相同輸入總是產生相同的雜湊\n- **雪崩效應**：輸入的微小變化會產生非常不同的輸出\n- **抗碰撞**：設計上使得找到碰撞非常困難\n\n**常見用途：**\n- 資料完整性檢查\n- 數位簽章\n- 安全識別碼"
  },
  "es": {
    "what-is-whirlpool": "¿Qué es Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool es una función hash criptográfica. Produce un valor hash de 512 bits (64 bytes), normalmente mostrado como una cadena hexadecimal de 128 caracteres.\n\n**Características clave:**\n- **Determinista**: La misma entrada siempre produce el mismo hash\n- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas muy diferentes\n- **Resistente a colisiones**: Diseñada para dificultar encontrar colisiones\n\n**Usos comunes:**\n- Verificación de integridad de datos\n- Firmas digitales\n- Identificadores seguros"
  },
  "fr": {
    "what-is-whirlpool": "Qu'est-ce que Whirlpool ?",
    "what-is-whirlpool-description-markdown": "Whirlpool est une fonction de hachage cryptographique. Elle produit une valeur de hachage de 512 bits (64 octets), généralement affichée comme une chaîne hexadécimale de 128 caractères.\n\n**Caractéristiques clés :**\n- **Déterministe** : La même entrée produit toujours le même hachage\n- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties très différentes\n- **Résistant aux collisions** : Conçue pour rendre les collisions difficiles à trouver\n\n**Utilisations courantes :**\n- Vérification d'intégrité des données\n- Signatures numériques\n- Identifiants sécurisés"
  },
  "de": {
    "what-is-whirlpool": "Was ist Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool ist eine kryptografische Hash-Funktion. Sie erzeugt einen 512-Bit-(64-Byte-)Hashwert, der typischerweise als 128-stellige Hexadezimalzeichenkette dargestellt wird.\n\n**Hauptmerkmale:**\n- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash\n- **Lawineneffekt**: Kleine Änderungen der Eingabe erzeugen sehr unterschiedliche Ausgaben\n- **Kollisionsresistent**: Entwickelt, um Kollisionen schwer auffindbar zu machen\n\n**Häufige Verwendungen:**\n- Datenintegritätsprüfungen\n- Digitale Signaturen\n- Sichere Kennungen"
  },
  "it": {
    "what-is-whirlpool": "Cos'è Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool è una funzione hash crittografica. Produce un valore hash di 512 bit (64 byte), di solito mostrato come una stringa esadecimale di 128 caratteri.\n\n**Caratteristiche chiave:**\n- **Deterministica**: Lo stesso input produce sempre lo stesso hash\n- **Effetto valanga**: Piccoli cambiamenti nell'input producono output molto diversi\n- **Resistente alle collisioni**: Progettata per rendere difficile trovare collisioni\n\n**Usi comuni:**\n- Verifiche di integrità dei dati\n- Firme digitali\n- Identificatori sicuri"
  },
  "ja": {
    "what-is-whirlpool": "Whirlpoolとは？",
    "what-is-whirlpool-description-markdown": "Whirlpool は暗号学的ハッシュ関数です。512 ビット（64 バイト）のハッシュ値を生成し、通常は 128 文字の 16 進文字列で表示されます。\n\n**主な特徴：**\n- **決定論的**：同じ入力は常に同じハッシュを生成\n- **雪崩効果**：入力の小さな変化が非常に異なる出力を生成\n- **衝突耐性**：衝突を見つけにくいよう設計\n\n**一般的な用途：**\n- データ整合性チェック\n- デジタル署名\n- 安全な識別子"
  },
  "ko": {
    "what-is-whirlpool": "Whirlpool란?",
    "what-is-whirlpool-description-markdown": "Whirlpool는 암호학적 해시 함수입니다. 512비트(64바이트) 해시 값을 생성하며, 보통 128자 16진수 문자열로 표시됩니다.\n\n**주요 특징:**\n- **결정론적**: 같은 입력은 항상 같은 해시를 생성\n- **눈사태 효과**: 입력의 작은 변화가 매우 다른 출력 생성\n- **충돌 저항성**: 충돌을 찾기 어렵도록 설계됨\n\n**일반적인 용도:**\n- 데이터 무결성 검사\n- 디지털 서명\n- 안전한 식별자"
  },
  "ru": {
    "what-is-whirlpool": "Что такое Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool — криптографическая хеш-функция. Она производит 512-битное (64-байтовое) хеш-значение, обычно отображаемое как 128-символьная шестнадцатеричная строка.\n\n**Ключевые характеристики:**\n- **Детерминированная**: Один и тот же ввод всегда дает один и тот же хеш\n- **Эффект лавины**: Небольшие изменения ввода дают очень разные результаты\n- **Устойчивость к коллизиям**: Спроектирована так, чтобы коллизии было трудно найти\n\n**Обычные применения:**\n- Проверка целостности данных\n- Цифровые подписи\n- Безопасные идентификаторы"
  },
  "pt": {
    "what-is-whirlpool": "O que é Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool é uma função hash criptográfica. Ela produz um valor hash de 512 bits (64 bytes), normalmente mostrado como uma string hexadecimal de 128 caracteres.\n\n**Características principais:**\n- **Determinístico**: A mesma entrada sempre produz o mesmo hash\n- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas muito diferentes\n- **Resistente a colisões**: Projetada para tornar colisões difíceis de encontrar\n\n**Usos comuns:**\n- Verificação de integridade de dados\n- Assinaturas digitais\n- Identificadores seguros"
  },
  "ar": {
    "what-is-whirlpool": "ما هو Whirlpool؟",
    "what-is-whirlpool-description-markdown": "Whirlpool هي دالة تجزئة تشفيرية. تنتج قيمة تجزئة بطول 512 بت (64 بايت)، وعادة ما تُعرض كسلسلة سداسية عشرية من 128 حرفًا.\n\n**الخصائص الرئيسية:**\n- **حتمية**: نفس الإدخال ينتج نفس التجزئة دائمًا\n- **تأثير الانهيار الجليدي**: تغييرات صغيرة في الإدخال تُنتج مخرجات مختلفة جدًا\n- **مقاومة التصادمات**: مصممة لجعل العثور على تصادمات أمرًا صعبًا\n\n**الاستخدامات الشائعة:**\n- التحقق من سلامة البيانات\n- التوقيعات الرقمية\n- معرّفات آمنة"
  },
  "hi": {
    "what-is-whirlpool": "Whirlpool क्या है?",
    "what-is-whirlpool-description-markdown": "Whirlpool एक क्रिप्टोग्राफिक हैश फ़ंक्शन है। यह 512-बिट (64-बाइट) हैश मान उत्पन्न करता है, जिसे आमतौर पर 128-अक्षरों की हेक्साडेसिमल स्ट्रिंग के रूप में दिखाया जाता है।\n\n**मुख्य विशेषताएं:**\n- **निर्धारक**: वही इनपुट हमेशा वही हैश देता है\n- **हिमस्खलन प्रभाव**: इनपुट में छोटे बदलाव बहुत अलग आउटपुट देते हैं\n- **टक्कर प्रतिरोधी**: टकराव ढूंढना कठिन बनाने के लिए डिज़ाइन किया गया\n\n**सामान्य उपयोग:**\n- डेटा अखंडता जांच\n- डिजिटल हस्ताक्षर\n- सुरक्षित पहचानकर्ता"
  },
  "tr": {
    "what-is-whirlpool": "Whirlpool nedir?",
    "what-is-whirlpool-description-markdown": "Whirlpool, kriptografik bir hash fonksiyonudur. 512 bit (64 bayt) bir hash değeri üretir ve genellikle 128 karakterlik onaltılık bir dize olarak gösterilir.\n\n**Temel özellikler:**\n- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir\n- **Çığ etkisi**: Girdideki küçük değişiklikler çok farklı çıktılar üretir\n- **Çarpışma dirençli**: Çarpışmaları bulmayı zorlaştıracak şekilde tasarlanmıştır\n\n**Yaygın kullanımlar:**\n- Veri bütünlüğü kontrolleri\n- Dijital imzalar\n- Güvenli tanımlayıcılar"
  },
  "nl": {
    "what-is-whirlpool": "Wat is Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool is een cryptografische hashfunctie. Ze produceert een 512-bit (64-byte) hashwaarde, meestal weergegeven als een hexadecimale string van 128 tekens.\n\n**Belangrijkste kenmerken:**\n- **Deterministisch**: Dezelfde invoer levert altijd dezelfde hash op\n- **Lawine-effect**: Kleine wijzigingen in de invoer geven zeer verschillende uitvoer\n- **Botsingsbestendig**: Ontworpen om het vinden van botsingen moeilijk te maken\n\n**Veelvoorkomende toepassingen:**\n- Integriteitscontroles van gegevens\n- Digitale handtekeningen\n- Veilige identifiers"
  },
  "sv": {
    "what-is-whirlpool": "Vad är Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool är en kryptografisk hashfunktion. Den producerar ett 512-bitars (64-byte) hashvärde, vanligtvis visat som en 128-teckens hexsträng.\n\n**Nyckelegenskaper:**\n- **Deterministisk**: Samma inmatning ger alltid samma hash\n- **Lavineffekt**: Små förändringar i inmatningen ger mycket olika utdata\n- **Kollisionsresistent**: Utformad för att göra kollisioner svåra att hitta\n\n**Vanliga användningar:**\n- Dataintegritetskontroller\n- Digitala signaturer\n- Säkra identifierare"
  },
  "pl": {
    "what-is-whirlpool": "Czym jest Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool to kryptograficzna funkcja skrótu. Tworzy 512-bitową (64-bajtową) wartość skrótu, zwykle przedstawianą jako 128-znakowy ciąg szesnastkowy.\n\n**Kluczowe cechy:**\n- **Deterministyczna**: To samo wejście zawsze daje ten sam skrót\n- **Efekt lawiny**: Małe zmiany wejścia dają bardzo różne wyniki\n- **Odporna na kolizje**: Zaprojektowana tak, aby utrudniać znalezienie kolizji\n\n**Typowe zastosowania:**\n- Kontrole integralności danych\n- Podpisy cyfrowe\n- Bezpieczne identyfikatory"
  },
  "vi": {
    "what-is-whirlpool": "Whirlpool là gì?",
    "what-is-whirlpool-description-markdown": "Whirlpool là hàm băm mật mã. Hàm tạo giá trị băm 512-bit (64 byte), thường hiển thị dưới dạng chuỗi thập lục phân 128 ký tự.\n\n**Đặc điểm chính:**\n- **Xác định**: Cùng một đầu vào luôn cho cùng một băm\n- **Hiệu ứng tuyết lở**: Thay đổi nhỏ ở đầu vào tạo ra đầu ra rất khác\n- **Chống va chạm**: Được thiết kế để khó tìm va chạm\n\n**Ứng dụng phổ biến:**\n- Kiểm tra toàn vẹn dữ liệu\n- Chữ ký số\n- Định danh an toàn"
  },
  "th": {
    "what-is-whirlpool": "Whirlpool คืออะไร?",
    "what-is-whirlpool-description-markdown": "Whirlpool เป็นฟังก์ชันแฮชเชิงเข้ารหัส ให้ค่าแฮช 512 บิต (64 ไบต์) โดยมักแสดงเป็นสตริงเลขฐานสิบหก 128 ตัวอักษร\n\n**คุณลักษณะสำคัญ:**\n- **กำหนดได้**: อินพุตเดียวกันให้แฮชเหมือนเดิมเสมอ\n- **เอฟเฟกต์หิมะถล่ม**: การเปลี่ยนแปลงเล็กน้อยในอินพุตทำให้ได้ผลลัพธ์ที่ต่างมาก\n- **ต้านทานการชน**: ออกแบบมาให้หาการชนได้ยาก\n\n**การใช้งานทั่วไป:**\n- การตรวจสอบความสมบูรณ์ของข้อมูล\n- ลายเซ็นดิจิทัล\n- ตัวระบุที่ปลอดภัย"
  },
  "id": {
    "what-is-whirlpool": "Apa itu Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool adalah fungsi hash kriptografi. Fungsi ini menghasilkan nilai hash 512-bit (64 byte), biasanya ditampilkan sebagai string heksadesimal 128 karakter.\n\n**Karakteristik utama:**\n- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama\n- **Efek avalanche**: Perubahan kecil pada input menghasilkan output yang sangat berbeda\n- **Tahan collision**: Dirancang agar collision sulit ditemukan\n\n**Penggunaan umum:**\n- Pemeriksaan integritas data\n- Tanda tangan digital\n- Pengidentifikasi aman"
  },
  "he": {
    "what-is-whirlpool": "מה זה Whirlpool?",
    "what-is-whirlpool-description-markdown": "‏Whirlpool היא פונקציית גיבוב קריפטוגרפית. היא מפיקה ערך גיבוב של 512 ביט (64 בתים), בדרך כלל כמחרוזת הקסדצימלית באורך 128 תווים.\n\n**מאפיינים עיקריים:**\n- **דטרמיניסטית**: אותו קלט תמיד מפיק אותו גיבוב\n- **אפקט מפולת**: שינויים קטנים בקלט גורמים לפלט שונה מאוד\n- **עמידה להתנגשויות**: מתוכננת כך שקשה למצוא התנגשויות\n\n**שימושים נפוצים:**\n- בדיקות שלמות נתונים\n- חתימות דיגיטליות\n- מזהים מאובטחים"
  },
  "ms": {
    "what-is-whirlpool": "Apakah Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool ialah fungsi hash kriptografi. Ia menghasilkan nilai hash 512-bit (64 bait), biasanya dipaparkan sebagai rentetan heksadesimal 128 aksara.\n\n**Ciri-ciri utama:**\n- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama\n- **Kesan runtuhan salji**: Perubahan kecil pada input menghasilkan output yang sangat berbeza\n- **Tahan perlanggaran**: Direka untuk menyukarkan pencarian perlanggaran\n\n**Kegunaan biasa:**\n- Pemeriksaan integriti data\n- Tandatangan digital\n- Pengenal pasti selamat"
  },
  "no": {
    "what-is-whirlpool": "Hva er Whirlpool?",
    "what-is-whirlpool-description-markdown": "Whirlpool er en kryptografisk hashfunksjon. Den produserer en 512-bit (64-byte) hashverdi, vanligvis vist som en 128-tegns heksadesimal streng.\n\n**Nøkkelegenskaper:**\n- **Deterministisk**: Samme inndata gir alltid samme hash\n- **Snøskredeffekt**: Små endringer i inndata gir svært ulike utdata\n- **Kollisjonsresistent**: Utformet for å gjøre kollisjoner vanskelige å finne\n\n**Vanlige bruksområder:**\n- Dataintegritetskontroller\n- Digitale signaturer\n- Sikre identifikatorer"
  }
}
</i18n>
