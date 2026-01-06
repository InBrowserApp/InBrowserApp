<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-text depth="2">{{ t('description') }}</n-text>
    <n-ul style="margin-top: 8px">
      <n-li><n-text strong>GCM</n-text>: {{ t('gcm') }}</n-li>
      <n-li><n-text strong>CBC</n-text>: {{ t('cbc') }}</n-li>
      <n-li><n-text strong>CTR</n-text>: {{ t('ctr') }}</n-li>
    </n-ul>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText, NUl, NLi } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is AES?",
    "description": "AES (Advanced Encryption Standard) is a symmetric encryption algorithm widely used for secure data encryption. It supports key lengths of 128, 192, or 256 bits.",
    "gcm": "Galois/Counter Mode - Provides both encryption and authentication. Recommended for most use cases.",
    "cbc": "Cipher Block Chaining - Classic mode, widely compatible. Requires padding.",
    "ctr": "Counter Mode - Stream cipher mode, no padding needed."
  },
  "zh": {
    "title": "什么是 AES？",
    "description": "AES（高级加密标准）是一种广泛用于安全数据加密的对称加密算法。支持 128、192 或 256 位密钥长度。",
    "gcm": "伽罗瓦/计数器模式 - 同时提供加密和认证。推荐用于大多数场景。",
    "cbc": "密码块链接模式 - 经典模式，兼容性好。需要填充。",
    "ctr": "计数器模式 - 流密码模式，无需填充。"
  },
  "zh-CN": {
    "title": "什么是 AES？",
    "description": "AES（高级加密标准）是一种广泛用于安全数据加密的对称加密算法。支持 128、192 或 256 位密钥长度。",
    "gcm": "伽罗瓦/计数器模式 - 同时提供加密和认证。推荐用于大多数场景。",
    "cbc": "密码块链接模式 - 经典模式，兼容性好。需要填充。",
    "ctr": "计数器模式 - 流密码模式，无需填充。"
  },
  "zh-TW": {
    "title": "什麼是 AES？",
    "description": "AES（進階加密標準）是一種廣泛用於安全資料加密的對稱加密演算法。支援 128、192 或 256 位元金鑰長度。",
    "gcm": "伽羅瓦/計數器模式 - 同時提供加密和認證。推薦用於大多數場景。",
    "cbc": "密碼區塊鏈結模式 - 經典模式，相容性好。需要填充。",
    "ctr": "計數器模式 - 串流密碼模式，無需填充。"
  },
  "zh-HK": {
    "title": "什麼是 AES？",
    "description": "AES（進階加密標準）是一種廣泛用於安全資料加密的對稱加密演算法。支援 128、192 或 256 位元金鑰長度。",
    "gcm": "伽羅瓦/計數器模式 - 同時提供加密和認證。推薦用於大多數場景。",
    "cbc": "密碼區塊鏈結模式 - 經典模式，相容性好。需要填充。",
    "ctr": "計數器模式 - 串流密碼模式，無需填充。"
  },
  "es": {
    "title": "¿Qué es AES?",
    "description": "AES (Estándar de Cifrado Avanzado) es un algoritmo de cifrado simétrico ampliamente utilizado para la encriptación segura de datos. Soporta longitudes de clave de 128, 192 o 256 bits.",
    "gcm": "Modo Galois/Contador - Proporciona cifrado y autenticación. Recomendado para la mayoría de casos.",
    "cbc": "Modo de Encadenamiento de Bloques - Modo clásico, ampliamente compatible. Requiere relleno.",
    "ctr": "Modo Contador - Modo de cifrado de flujo, sin necesidad de relleno."
  },
  "fr": {
    "title": "Qu'est-ce que AES ?",
    "description": "AES (Advanced Encryption Standard) est un algorithme de chiffrement symétrique largement utilisé pour le chiffrement sécurisé des données. Il prend en charge des longueurs de clé de 128, 192 ou 256 bits.",
    "gcm": "Mode Galois/Compteur - Fournit chiffrement et authentification. Recommandé pour la plupart des cas.",
    "cbc": "Mode de chaînage de blocs - Mode classique, largement compatible. Nécessite un remplissage.",
    "ctr": "Mode Compteur - Mode de chiffrement de flux, pas de remplissage nécessaire."
  },
  "de": {
    "title": "Was ist AES?",
    "description": "AES (Advanced Encryption Standard) ist ein symmetrischer Verschlüsselungsalgorithmus, der weit verbreitet für sichere Datenverschlüsselung verwendet wird. Er unterstützt Schlüssellängen von 128, 192 oder 256 Bit.",
    "gcm": "Galois/Counter-Modus - Bietet Verschlüsselung und Authentifizierung. Für die meisten Anwendungsfälle empfohlen.",
    "cbc": "Cipher Block Chaining-Modus - Klassischer Modus, weit kompatibel. Erfordert Padding.",
    "ctr": "Counter-Modus - Stromchiffre-Modus, kein Padding erforderlich."
  },
  "it": {
    "title": "Cos'è AES?",
    "description": "AES (Advanced Encryption Standard) è un algoritmo di crittografia simmetrica ampiamente utilizzato per la crittografia sicura dei dati. Supporta lunghezze di chiave di 128, 192 o 256 bit.",
    "gcm": "Modalità Galois/Counter - Fornisce crittografia e autenticazione. Consigliato per la maggior parte dei casi.",
    "cbc": "Modalità Cipher Block Chaining - Modalità classica, ampiamente compatibile. Richiede padding.",
    "ctr": "Modalità Counter - Modalità cifratura a flusso, nessun padding necessario."
  },
  "ja": {
    "title": "AES とは？",
    "description": "AES（Advanced Encryption Standard）は、安全なデータ暗号化に広く使用されている対称暗号化アルゴリズムです。128、192、256ビットの鍵長をサポートしています。",
    "gcm": "Galois/Counter モード - 暗号化と認証の両方を提供。ほとんどのケースで推奨。",
    "cbc": "Cipher Block Chaining モード - クラシックモード、広く互換性あり。パディングが必要。",
    "ctr": "Counter モード - ストリーム暗号モード、パディング不要。"
  },
  "ko": {
    "title": "AES란?",
    "description": "AES(Advanced Encryption Standard)는 안전한 데이터 암호화에 널리 사용되는 대칭 암호화 알고리즘입니다. 128, 192 또는 256비트 키 길이를 지원합니다.",
    "gcm": "Galois/Counter 모드 - 암호화와 인증을 모두 제공. 대부분의 경우 권장.",
    "cbc": "Cipher Block Chaining 모드 - 클래식 모드, 광범위하게 호환. 패딩 필요.",
    "ctr": "Counter 모드 - 스트림 암호 모드, 패딩 불필요."
  },
  "ru": {
    "title": "Что такое AES?",
    "description": "AES (Advanced Encryption Standard) — это симметричный алгоритм шифрования, широко используемый для безопасного шифрования данных. Поддерживает ключи длиной 128, 192 или 256 бит.",
    "gcm": "Режим Galois/Counter — обеспечивает шифрование и аутентификацию. Рекомендуется для большинства случаев.",
    "cbc": "Режим Cipher Block Chaining — классический режим, широко совместим. Требует дополнения.",
    "ctr": "Режим Counter — потоковый режим шифрования, дополнение не требуется."
  },
  "pt": {
    "title": "O que é AES?",
    "description": "AES (Advanced Encryption Standard) é um algoritmo de criptografia simétrica amplamente utilizado para criptografia segura de dados. Suporta comprimentos de chave de 128, 192 ou 256 bits.",
    "gcm": "Modo Galois/Counter - Fornece criptografia e autenticação. Recomendado para a maioria dos casos.",
    "cbc": "Modo Cipher Block Chaining - Modo clássico, amplamente compatível. Requer preenchimento.",
    "ctr": "Modo Counter - Modo de cifra de fluxo, sem necessidade de preenchimento."
  },
  "ar": {
    "title": "ما هو AES؟",
    "description": "AES (معيار التشفير المتقدم) هو خوارزمية تشفير متماثلة تُستخدم على نطاق واسع لتشفير البيانات الآمن. يدعم أطوال مفاتيح 128 أو 192 أو 256 بت.",
    "gcm": "وضع Galois/Counter - يوفر التشفير والمصادقة. موصى به لمعظم الحالات.",
    "cbc": "وضع تسلسل كتل التشفير - وضع كلاسيكي، متوافق على نطاق واسع. يتطلب الحشو.",
    "ctr": "وضع العداد - وضع تشفير التدفق، لا حاجة للحشو."
  },
  "hi": {
    "title": "AES क्या है?",
    "description": "AES (एडवांस्ड एन्क्रिप्शन स्टैंडर्ड) एक सममित एन्क्रिप्शन एल्गोरिथम है जो सुरक्षित डेटा एन्क्रिप्शन के लिए व्यापक रूप से उपयोग किया जाता है। यह 128, 192 या 256 बिट की कुंजी लंबाई का समर्थन करता है।",
    "gcm": "Galois/Counter मोड - एन्क्रिप्शन और प्रमाणीकरण दोनों प्रदान करता है। अधिकांश उपयोग के लिए अनुशंसित।",
    "cbc": "Cipher Block Chaining मोड - क्लासिक मोड, व्यापक रूप से संगत। पैडिंग आवश्यक।",
    "ctr": "Counter मोड - स्ट्रीम सिफर मोड, पैडिंग की आवश्यकता नहीं।"
  },
  "tr": {
    "title": "AES Nedir?",
    "description": "AES (Gelişmiş Şifreleme Standardı), güvenli veri şifreleme için yaygın olarak kullanılan bir simetrik şifreleme algoritmasıdır. 128, 192 veya 256 bit anahtar uzunluklarını destekler.",
    "gcm": "Galois/Counter Modu - Şifreleme ve kimlik doğrulama sağlar. Çoğu kullanım için önerilir.",
    "cbc": "Cipher Block Chaining Modu - Klasik mod, geniş uyumluluk. Dolgu gerektirir.",
    "ctr": "Counter Modu - Akış şifre modu, dolgu gerekmez."
  },
  "nl": {
    "title": "Wat is AES?",
    "description": "AES (Advanced Encryption Standard) is een symmetrisch versleutelingsalgoritme dat veel wordt gebruikt voor veilige gegevensversleuteling. Het ondersteunt sleutellengtes van 128, 192 of 256 bits.",
    "gcm": "Galois/Counter Mode - Biedt versleuteling en authenticatie. Aanbevolen voor de meeste gevallen.",
    "cbc": "Cipher Block Chaining Mode - Klassieke modus, breed compatibel. Vereist opvulling.",
    "ctr": "Counter Mode - Stream cipher modus, geen opvulling nodig."
  },
  "sv": {
    "title": "Vad är AES?",
    "description": "AES (Advanced Encryption Standard) är en symmetrisk krypteringsalgoritm som används i stor utsträckning för säker datakryptering. Den stöder nyckellängder på 128, 192 eller 256 bitar.",
    "gcm": "Galois/Counter-läge - Ger kryptering och autentisering. Rekommenderas för de flesta fall.",
    "cbc": "Cipher Block Chaining-läge - Klassiskt läge, bred kompatibilitet. Kräver utfyllnad.",
    "ctr": "Counter-läge - Strömchifferläge, ingen utfyllnad behövs."
  },
  "pl": {
    "title": "Czym jest AES?",
    "description": "AES (Advanced Encryption Standard) to symetryczny algorytm szyfrowania szeroko stosowany do bezpiecznego szyfrowania danych. Obsługuje klucze o długości 128, 192 lub 256 bitów.",
    "gcm": "Tryb Galois/Counter - Zapewnia szyfrowanie i uwierzytelnianie. Zalecany dla większości przypadków.",
    "cbc": "Tryb Cipher Block Chaining - Tryb klasyczny, szeroko kompatybilny. Wymaga dopełnienia.",
    "ctr": "Tryb Counter - Tryb szyfru strumieniowego, bez potrzeby dopełnienia."
  },
  "vi": {
    "title": "AES là gì?",
    "description": "AES (Advanced Encryption Standard) là thuật toán mã hóa đối xứng được sử dụng rộng rãi để mã hóa dữ liệu an toàn. Hỗ trợ độ dài khóa 128, 192 hoặc 256 bit.",
    "gcm": "Chế độ Galois/Counter - Cung cấp mã hóa và xác thực. Khuyến nghị cho hầu hết các trường hợp.",
    "cbc": "Chế độ Cipher Block Chaining - Chế độ cổ điển, tương thích rộng. Yêu cầu đệm.",
    "ctr": "Chế độ Counter - Chế độ mã hóa dòng, không cần đệm."
  },
  "th": {
    "title": "AES คืออะไร?",
    "description": "AES (Advanced Encryption Standard) เป็นอัลกอริทึมการเข้ารหัสแบบสมมาตรที่ใช้กันอย่างแพร่หลายสำหรับการเข้ารหัสข้อมูลที่ปลอดภัย รองรับความยาวคีย์ 128, 192 หรือ 256 บิต",
    "gcm": "โหมด Galois/Counter - ให้การเข้ารหัสและการยืนยันตัวตน แนะนำสำหรับกรณีส่วนใหญ่",
    "cbc": "โหมด Cipher Block Chaining - โหมดคลาสสิก เข้ากันได้กว้าง ต้องใช้การเติม",
    "ctr": "โหมด Counter - โหมดรหัสกระแส ไม่ต้องเติม"
  },
  "id": {
    "title": "Apa itu AES?",
    "description": "AES (Advanced Encryption Standard) adalah algoritma enkripsi simetris yang banyak digunakan untuk enkripsi data yang aman. Mendukung panjang kunci 128, 192, atau 256 bit.",
    "gcm": "Mode Galois/Counter - Menyediakan enkripsi dan autentikasi. Direkomendasikan untuk sebagian besar kasus.",
    "cbc": "Mode Cipher Block Chaining - Mode klasik, kompatibel luas. Memerlukan padding.",
    "ctr": "Mode Counter - Mode stream cipher, tidak perlu padding."
  },
  "he": {
    "title": "מה זה AES?",
    "description": "AES (Advanced Encryption Standard) הוא אלגוריתם הצפנה סימטרי הנמצא בשימוש נרחב להצפנת נתונים מאובטחת. תומך באורכי מפתח של 128, 192 או 256 סיביות.",
    "gcm": "מצב Galois/Counter - מספק הצפנה ואימות. מומלץ לרוב המקרים.",
    "cbc": "מצב Cipher Block Chaining - מצב קלאסי, תואם באופן נרחב. דורש מילוי.",
    "ctr": "מצב Counter - מצב צופן זרם, לא נדרש מילוי."
  },
  "ms": {
    "title": "Apa itu AES?",
    "description": "AES (Advanced Encryption Standard) ialah algoritma penyulitan simetri yang digunakan secara meluas untuk penyulitan data selamat. Menyokong panjang kunci 128, 192 atau 256 bit.",
    "gcm": "Mod Galois/Counter - Menyediakan penyulitan dan pengesahan. Disyorkan untuk kebanyakan kes.",
    "cbc": "Mod Cipher Block Chaining - Mod klasik, serasi secara meluas. Memerlukan pengisian.",
    "ctr": "Mod Counter - Mod sifir aliran, tiada pengisian diperlukan."
  },
  "no": {
    "title": "Hva er AES?",
    "description": "AES (Advanced Encryption Standard) er en symmetrisk krypteringsalgoritme som brukes mye for sikker datakryptering. Den støtter nøkkellengder på 128, 192 eller 256 biter.",
    "gcm": "Galois/Counter-modus - Gir kryptering og autentisering. Anbefalt for de fleste tilfeller.",
    "cbc": "Cipher Block Chaining-modus - Klassisk modus, bred kompatibilitet. Krever utfylling.",
    "ctr": "Counter-modus - Strømchiffermodus, ingen utfylling nødvendig."
  }
}
</i18n>
