<template>
  <DescriptionMarkdown :title="t('whatIsTitle')" :description="t('whatIsDescription')" />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "whatIsTitle": "What is a certificate and public key?",
    "whatIsDescription": "An X.509 certificate binds a public key to an identity and is commonly used in TLS and code signing. A public key can be shared to verify signatures or encrypt data while the private key remains secret. This tool parses certificates and public keys locally to show fields, validity, and fingerprints."
  },
  "zh": {
    "whatIsTitle": "什么是证书和公钥？",
    "whatIsDescription": "X.509 证书将公钥绑定到身份，常用于 TLS 和代码签名。公钥可以公开分享，用于验证签名或加密数据，而私钥保持机密。此工具在本地解析证书和公钥，展示字段、有效期和指纹。"
  },
  "zh-CN": {
    "whatIsTitle": "什么是证书和公钥？",
    "whatIsDescription": "X.509 证书将公钥绑定到身份，常用于 TLS 和代码签名。公钥可以公开分享，用于验证签名或加密数据，而私钥保持机密。此工具在本地解析证书和公钥，展示字段、有效期和指纹。"
  },
  "zh-TW": {
    "whatIsTitle": "什麼是憑證與公鑰？",
    "whatIsDescription": "X.509 憑證會將公鑰繫結到身分，常用於 TLS 與程式碼簽章。公鑰可公開分享，用於驗證簽章或加密資料，而私鑰保持機密。此工具在本機解析憑證與公鑰，顯示欄位、有效期與指紋。"
  },
  "zh-HK": {
    "whatIsTitle": "甚麼是證書與公鑰？",
    "whatIsDescription": "X.509 證書會將公鑰綁定到身分，常用於 TLS 和程式碼簽署。公鑰可公開分享，用於驗證簽署或加密資料，而私鑰保持機密。此工具在本機解析證書與公鑰，顯示欄位、有效期及指紋。"
  },
  "es": {
    "whatIsTitle": "¿Qué es un certificado y una clave pública?",
    "whatIsDescription": "Un certificado X.509 vincula una clave pública a una identidad y se usa comúnmente en TLS y en la firma de código. Una clave pública se puede compartir para verificar firmas o cifrar datos mientras la clave privada permanece secreta. Esta herramienta analiza certificados y claves públicas localmente para mostrar campos, validez y huellas digitales."
  },
  "fr": {
    "whatIsTitle": "Qu'est-ce qu'un certificat et une clé publique ?",
    "whatIsDescription": "Un certificat X.509 lie une clé publique à une identité et est couramment utilisé pour TLS et la signature de code. Une clé publique peut être partagée pour vérifier des signatures ou chiffrer des données tandis que la clé privée reste secrète. Cet outil analyse localement les certificats et les clés publiques pour afficher les champs, la validité et les empreintes."
  },
  "de": {
    "whatIsTitle": "Was ist ein Zertifikat und ein öffentlicher Schlüssel?",
    "whatIsDescription": "Ein X.509-Zertifikat bindet einen öffentlichen Schlüssel an eine Identität und wird häufig für TLS und Code-Signing verwendet. Ein öffentlicher Schlüssel kann geteilt werden, um Signaturen zu prüfen oder Daten zu verschlüsseln, während der private Schlüssel geheim bleibt. Dieses Tool analysiert Zertifikate und öffentliche Schlüssel lokal, um Felder, Gültigkeit und Fingerabdrücke anzuzeigen."
  },
  "it": {
    "whatIsTitle": "Che cos'è un certificato e una chiave pubblica?",
    "whatIsDescription": "Un certificato X.509 collega una chiave pubblica a un'identità ed è comunemente usato per TLS e la firma del codice. Una chiave pubblica può essere condivisa per verificare firme o cifrare dati, mentre la chiave privata rimane segreta. Questo strumento analizza localmente certificati e chiavi pubbliche per mostrare campi, validità e impronte digitali."
  },
  "ja": {
    "whatIsTitle": "証明書と公開鍵とは？",
    "whatIsDescription": "X.509 証明書は公開鍵を身元に結び付け、TLS やコード署名で広く利用されます。公開鍵は署名の検証やデータの暗号化に共有でき、秘密鍵は機密のまま保たれます。このツールは証明書と公開鍵をローカルで解析し、フィールド、有効期間、フィンガープリントを表示します。"
  },
  "ko": {
    "whatIsTitle": "인증서와 공개 키란?",
    "whatIsDescription": "X.509 인증서는 공개 키를 신원에 연결하며 TLS 및 코드 서명에 널리 사용됩니다. 공개 키는 서명 검증이나 데이터 암호화를 위해 공유할 수 있고, 개인 키는 비밀로 유지됩니다. 이 도구는 인증서와 공개 키를 로컬에서 분석해 필드, 유효 기간, 지문을 표시합니다."
  },
  "ru": {
    "whatIsTitle": "Что такое сертификат и открытый ключ?",
    "whatIsDescription": "Сертификат X.509 связывает открытый ключ с идентичностью и часто используется в TLS и подписании кода. Открытый ключ можно передавать для проверки подписей или шифрования данных, тогда как закрытый ключ остаётся секретным. Этот инструмент локально разбирает сертификаты и открытые ключи, показывая поля, срок действия и отпечатки."
  },
  "pt": {
    "whatIsTitle": "O que é um certificado e uma chave pública?",
    "whatIsDescription": "Um certificado X.509 associa uma chave pública a uma identidade e é comumente usado em TLS e assinatura de código. Uma chave pública pode ser compartilhada para verificar assinaturas ou criptografar dados enquanto a chave privada permanece secreta. Esta ferramenta analisa certificados e chaves públicas localmente para mostrar campos, validade e impressões digitais."
  },
  "ar": {
    "whatIsTitle": "ما هي الشهادة والمفتاح العام؟",
    "whatIsDescription": "تربط شهادة X.509 مفتاحًا عامًا بهوية وتُستخدم عادةً في TLS وتوقيع الشيفرة. يمكن مشاركة المفتاح العام للتحقق من التواقيع أو تشفير البيانات بينما يبقى المفتاح الخاص سريًا. تقوم هذه الأداة بتحليل الشهادات والمفاتيح العامة محليًا لعرض الحقول والصلاحية والبصمات."
  },
  "hi": {
    "whatIsTitle": "प्रमाणपत्र और सार्वजनिक कुंजी क्या हैं?",
    "whatIsDescription": "X.509 प्रमाणपत्र एक सार्वजनिक कुंजी को पहचान से जोड़ता है और आम तौर पर TLS और कोड साइनिंग में उपयोग होता है। सार्वजनिक कुंजी को हस्ताक्षरों की जाँच या डेटा एन्क्रिप्ट करने के लिए साझा किया जा सकता है, जबकि निजी कुंजी गोपनीय रहती है। यह टूल स्थानीय रूप से प्रमाणपत्रों और सार्वजनिक कुंजियों को पार्स करके फ़ील्ड, वैधता और फिंगरप्रिंट दिखाता है।"
  },
  "tr": {
    "whatIsTitle": "Sertifika ve genel anahtar nedir?",
    "whatIsDescription": "X.509 sertifikası bir genel anahtarı bir kimliğe bağlar ve genellikle TLS ile kod imzalama için kullanılır. Genel anahtar, imzaları doğrulamak veya verileri şifrelemek için paylaşılabilir; özel anahtar gizli kalır. Bu araç sertifikaları ve genel anahtarları yerel olarak ayrıştırarak alanları, geçerliliği ve parmak izlerini gösterir."
  },
  "nl": {
    "whatIsTitle": "Wat is een certificaat en een publieke sleutel?",
    "whatIsDescription": "Een X.509-certificaat koppelt een publieke sleutel aan een identiteit en wordt vaak gebruikt voor TLS en het ondertekenen van code. Een publieke sleutel kan worden gedeeld om handtekeningen te verifiëren of gegevens te versleutelen, terwijl de privésleutel geheim blijft. Deze tool analyseert certificaten en publieke sleutels lokaal om velden, geldigheid en vingerafdrukken te tonen."
  },
  "sv": {
    "whatIsTitle": "Vad är ett certifikat och en publik nyckel?",
    "whatIsDescription": "Ett X.509-certifikat binder en publik nyckel till en identitet och används ofta för TLS och kodsignering. En publik nyckel kan delas för att verifiera signaturer eller kryptera data medan den privata nyckeln förblir hemlig. Det här verktyget analyserar certifikat och publika nycklar lokalt för att visa fält, giltighet och fingeravtryck."
  },
  "pl": {
    "whatIsTitle": "Czym jest certyfikat i klucz publiczny?",
    "whatIsDescription": "Certyfikat X.509 wiąże klucz publiczny z tożsamością i jest powszechnie używany w TLS oraz podpisywaniu kodu. Klucz publiczny można udostępniać do weryfikacji podpisów lub szyfrowania danych, podczas gdy klucz prywatny pozostaje tajny. To narzędzie lokalnie analizuje certyfikaty i klucze publiczne, aby pokazać pola, ważność i odciski."
  },
  "vi": {
    "whatIsTitle": "Chứng chỉ và khóa công khai là gì?",
    "whatIsDescription": "Chứng chỉ X.509 gắn khóa công khai với danh tính và thường được dùng trong TLS và ký mã. Khóa công khai có thể được chia sẻ để xác minh chữ ký hoặc mã hóa dữ liệu, trong khi khóa riêng được giữ bí mật. Công cụ này phân tích chứng chỉ và khóa công khai cục bộ để hiển thị các trường, hiệu lực và dấu vân tay."
  },
  "th": {
    "whatIsTitle": "ใบรับรองและกุญแจสาธารณะคืออะไร?",
    "whatIsDescription": "ใบรับรอง X.509 ผูกกุญแจสาธารณะเข้ากับตัวตนและมักใช้กับ TLS และการลงนามโค้ด กุญแจสาธารณะสามารถแชร์เพื่อยืนยันลายเซ็นหรือเข้ารหัสข้อมูลได้ ในขณะที่กุญแจส่วนตัวยังคงเป็นความลับ เครื่องมือนี้วิเคราะห์ใบรับรองและกุญแจสาธารณะในเครื่องเพื่อแสดงฟิลด์ ระยะเวลาใช้งาน และลายนิ้วมือ"
  },
  "id": {
    "whatIsTitle": "Apa itu sertifikat dan kunci publik?",
    "whatIsDescription": "Sertifikat X.509 mengikat kunci publik ke identitas dan umum digunakan dalam TLS serta penandatanganan kode. Kunci publik dapat dibagikan untuk memverifikasi tanda tangan atau mengenkripsi data sementara kunci privat tetap rahasia. Alat ini mengurai sertifikat dan kunci publik secara lokal untuk menampilkan bidang, masa berlaku, dan sidik jari."
  },
  "he": {
    "whatIsTitle": "מהי תעודה ומהו מפתח ציבורי?",
    "whatIsDescription": "תעודת X.509 קושרת מפתח ציבורי לזהות ומשמשת בדרך כלל ב-TLS ובחתימת קוד. ניתן לשתף מפתח ציבורי כדי לאמת חתימות או להצפין נתונים בעוד שהמפתח הפרטי נשאר סודי. כלי זה מנתח תעודות ומפתחות ציבוריים מקומית כדי להציג שדות, תוקף וטביעות אצבע."
  },
  "ms": {
    "whatIsTitle": "Apakah sijil dan kunci awam?",
    "whatIsDescription": "Sijil X.509 mengikat kunci awam kepada identiti dan lazim digunakan dalam TLS serta tandatangan kod. Kunci awam boleh dikongsi untuk mengesahkan tandatangan atau menyulitkan data sementara kunci peribadi kekal rahsia. Alat ini menghurai sijil dan kunci awam secara tempatan untuk memaparkan medan, tempoh sah dan cap jari."
  },
  "no": {
    "whatIsTitle": "Hva er et sertifikat og en offentlig nøkkel?",
    "whatIsDescription": "Et X.509-sertifikat knytter en offentlig nøkkel til en identitet og brukes ofte i TLS og kodesignering. En offentlig nøkkel kan deles for å verifisere signaturer eller kryptere data, mens den private nøkkelen forblir hemmelig. Dette verktøyet analyserer sertifikater og offentlige nøkler lokalt for å vise felt, gyldighet og fingeravtrykk."
  }
}
</i18n>
