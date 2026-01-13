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
    "whatIsDescription": "An X.509 certificate is a signed document that binds a public key to an identity (person, organization, or domain). It includes the subject, issuer (CA), validity period, serial number, signature algorithm, and extensions such as Subject Alternative Name (SAN) and key usage. The public key can be shared to verify signatures or encrypt data, while the private key stays secret to sign or decrypt. Fingerprints are hashes used to compare certificates and detect changes. This tool parses certificates and public keys locally to display these fields, validity, and fingerprints."
  },
  "zh": {
    "whatIsTitle": "什么是证书和公钥？",
    "whatIsDescription": "X.509 证书是一份已签名的文档，将公钥绑定到身份（个人、组织或域名）。它包含主体、颁发者（CA）、有效期、序列号、签名算法，以及主题备用名称（SAN）、密钥用法等扩展。公钥可以公开分享，用于验证签名或加密数据，而私钥保持机密，用于签名或解密。指纹是用于比对证书并检测变化的哈希值。此工具在本地解析证书和公钥，展示这些字段、有效期和指纹。"
  },
  "zh-CN": {
    "whatIsTitle": "什么是证书和公钥？",
    "whatIsDescription": "X.509 证书是一份已签名的文档，将公钥绑定到身份（个人、组织或域名）。它包含主体、颁发者（CA）、有效期、序列号、签名算法，以及主题备用名称（SAN）、密钥用法等扩展。公钥可以公开分享，用于验证签名或加密数据，而私钥保持机密，用于签名或解密。指纹是用于比对证书并检测变化的哈希值。此工具在本地解析证书和公钥，展示这些字段、有效期和指纹。"
  },
  "zh-TW": {
    "whatIsTitle": "什麼是憑證與公鑰？",
    "whatIsDescription": "X.509 憑證是一份已簽署的文件，將公鑰綁定到身分（個人、組織或網域）。它包含主體、簽發者（CA）、有效期、序號、簽章演算法，以及主體替代名稱（SAN）、金鑰用途等擴充。公鑰可公開分享，用於驗證簽章或加密資料，而私鑰保持機密，用於簽章或解密。指紋是用來比對憑證並偵測變更的雜湊值。此工具在本機解析憑證與公鑰，顯示這些欄位、有效期與指紋。"
  },
  "zh-HK": {
    "whatIsTitle": "甚麼是證書與公鑰？",
    "whatIsDescription": "X.509 證書是一份已簽署的文件，將公鑰綁定到身分（個人、機構或網域）。它包含主體、簽發者（CA）、有效期、序號、簽署算法，以及主體替代名稱（SAN）、密鑰用途等擴展。公鑰可公開分享，用於驗證簽署或加密資料，而私鑰保持機密，用於簽署或解密。指紋是用來比對證書並偵測變更的雜湊值。此工具在本機解析證書與公鑰，顯示這些欄位、有效期及指紋。"
  },
  "es": {
    "whatIsTitle": "¿Qué es un certificado y una clave pública?",
    "whatIsDescription": "Un certificado X.509 es un documento firmado que vincula una clave pública a una identidad (persona, organización o dominio). Incluye el sujeto, el emisor (CA), el periodo de validez, el número de serie, el algoritmo de firma y extensiones como Subject Alternative Name (SAN) y uso de clave. La clave pública puede compartirse para verificar firmas o cifrar datos, mientras que la clave privada se mantiene secreta para firmar o descifrar. Las huellas digitales son hashes usados para comparar certificados y detectar cambios. Esta herramienta analiza certificados y claves públicas localmente para mostrar estos campos, la validez y las huellas digitales."
  },
  "fr": {
    "whatIsTitle": "Qu'est-ce qu'un certificat et une clé publique ?",
    "whatIsDescription": "Un certificat X.509 est un document signé qui associe une clé publique à une identité (personne, organisation ou domaine). Il contient le sujet, l'émetteur (CA), la période de validité, le numéro de série, l'algorithme de signature et des extensions comme Subject Alternative Name (SAN) et l'usage de clé. La clé publique peut être partagée pour vérifier des signatures ou chiffrer des données, tandis que la clé privée reste secrète pour signer ou déchiffrer. Les empreintes sont des hachages utilisés pour comparer les certificats et détecter des changements. Cet outil analyse localement les certificats et les clés publiques pour afficher ces champs, la validité et les empreintes."
  },
  "de": {
    "whatIsTitle": "Was ist ein Zertifikat und ein öffentlicher Schlüssel?",
    "whatIsDescription": "Ein X.509-Zertifikat ist ein signiertes Dokument, das einen öffentlichen Schlüssel an eine Identität (Person, Organisation oder Domain) bindet. Es enthält Subject, Aussteller (CA), Gültigkeitszeitraum, Seriennummer, Signaturalgorithmus und Erweiterungen wie Subject Alternative Name (SAN) und Key Usage. Der öffentliche Schlüssel kann geteilt werden, um Signaturen zu prüfen oder Daten zu verschlüsseln, während der private Schlüssel geheim bleibt, um zu signieren oder zu entschlüsseln. Fingerabdrücke sind Hashes, die zum Vergleichen von Zertifikaten und zum Erkennen von Änderungen dienen. Dieses Tool analysiert Zertifikate und öffentliche Schlüssel lokal, um diese Felder, die Gültigkeit und die Fingerabdrücke anzuzeigen."
  },
  "it": {
    "whatIsTitle": "Che cos'è un certificato e una chiave pubblica?",
    "whatIsDescription": "Un certificato X.509 è un documento firmato che associa una chiave pubblica a un'identità (persona, organizzazione o dominio). Include il soggetto, l'emittente (CA), il periodo di validità, il numero di serie, l'algoritmo di firma ed estensioni come Subject Alternative Name (SAN) e uso della chiave. La chiave pubblica può essere condivisa per verificare firme o cifrare dati, mentre la chiave privata resta segreta per firmare o decifrare. Le impronte digitali sono hash usati per confrontare i certificati e rilevare modifiche. Questo strumento analizza localmente certificati e chiavi pubbliche per mostrare questi campi, la validità e le impronte digitali."
  },
  "ja": {
    "whatIsTitle": "証明書と公開鍵とは？",
    "whatIsDescription": "X.509 証明書は公開鍵を身元（個人・組織・ドメイン）に結び付ける署名済み文書です。Subject、発行者（CA）、有効期間、シリアル番号、署名アルゴリズム、Subject Alternative Name（SAN）やキー使用法などの拡張が含まれます。公開鍵は署名の検証やデータの暗号化に共有でき、秘密鍵は署名や復号に使うため機密のまま保持します。フィンガープリントは証明書を比較して変更を検出するためのハッシュです。このツールは証明書と公開鍵をローカルで解析し、これらの項目、有効期間、フィンガープリントを表示します。"
  },
  "ko": {
    "whatIsTitle": "인증서와 공개 키란?",
    "whatIsDescription": "X.509 인증서는 공개 키를 신원(개인, 조직, 도메인)에 연결하는 서명된 문서입니다. Subject, 발급자(CA), 유효 기간, 일련 번호, 서명 알고리즘, Subject Alternative Name(SAN) 및 키 사용과 같은 확장을 포함합니다. 공개 키는 서명 검증이나 데이터 암호화를 위해 공유할 수 있고, 개인 키는 서명 또는 복호화를 위해 비밀로 유지됩니다. 지문은 인증서를 비교하고 변경을 감지하는 데 쓰이는 해시입니다. 이 도구는 인증서와 공개 키를 로컬에서 분석해 이러한 필드, 유효 기간, 지문을 표시합니다."
  },
  "ru": {
    "whatIsTitle": "Что такое сертификат и открытый ключ?",
    "whatIsDescription": "Сертификат X.509 — это подписанный документ, который связывает открытый ключ с идентичностью (человек, организация или домен). Он содержит subject, издателя (CA), срок действия, серийный номер, алгоритм подписи и расширения, такие как Subject Alternative Name (SAN) и назначение ключа. Открытый ключ можно передавать для проверки подписей или шифрования данных, а закрытый ключ хранится в секрете для подписи или расшифровки. Отпечатки — это хэши, используемые для сравнения сертификатов и обнаружения изменений. Этот инструмент локально разбирает сертификаты и открытые ключи, чтобы показывать эти поля, срок действия и отпечатки."
  },
  "pt": {
    "whatIsTitle": "O que é um certificado e uma chave pública?",
    "whatIsDescription": "Um certificado X.509 é um documento assinado que vincula uma chave pública a uma identidade (pessoa, organização ou domínio). Ele inclui o sujeito, o emissor (CA), o período de validade, o número de série, o algoritmo de assinatura e extensões como Subject Alternative Name (SAN) e uso de chave. A chave pública pode ser compartilhada para verificar assinaturas ou criptografar dados, enquanto a chave privada permanece secreta para assinar ou descriptografar. As impressões digitais são hashes usados para comparar certificados e detectar mudanças. Esta ferramenta analisa certificados e chaves públicas localmente para mostrar esses campos, a validade e as impressões digitais."
  },
  "ar": {
    "whatIsTitle": "ما هي الشهادة والمفتاح العام؟",
    "whatIsDescription": "شهادة X.509 هي مستند موقَّع يربط مفتاحًا عامًا بهوية (شخص أو مؤسسة أو نطاق). تتضمن الموضوع والجهة المُصدِرة (CA) وفترة الصلاحية والرقم التسلسلي وخوارزمية التوقيع وامتدادات مثل Subject Alternative Name (SAN) واستخدام المفتاح. يمكن مشاركة المفتاح العام للتحقق من التواقيع أو تشفير البيانات، بينما يبقى المفتاح الخاص سريًا للتوقيع أو فك التشفير. البصمات هي تجزئات تُستخدم لمقارنة الشهادات واكتشاف التغييرات. تقوم هذه الأداة بتحليل الشهادات والمفاتيح العامة محليًا لعرض هذه الحقول والصلاحية والبصمات."
  },
  "hi": {
    "whatIsTitle": "प्रमाणपत्र और सार्वजनिक कुंजी क्या हैं?",
    "whatIsDescription": "X.509 प्रमाणपत्र एक हस्ताक्षरित दस्तावेज़ है जो सार्वजनिक कुंजी को पहचान (व्यक्ति, संगठन या डोमेन) से जोड़ता है। इसमें विषय, जारीकर्ता (CA), वैधता अवधि, क्रम संख्या, हस्ताक्षर एल्गोरिथ्म और Subject Alternative Name (SAN) व कुंजी उपयोग जैसी एक्सटेंशन शामिल होते हैं। सार्वजनिक कुंजी को हस्ताक्षरों की जाँच या डेटा एन्क्रिप्ट करने के लिए साझा किया जा सकता है, जबकि निजी कुंजी हस्ताक्षर या डिक्रिप्ट करने के लिए गोपनीय रहती है। फिंगरप्रिंट वे हैश हैं जो प्रमाणपत्रों की तुलना और बदलाव का पता लगाने के लिए उपयोग होते हैं। यह टूल स्थानीय रूप से प्रमाणपत्रों और सार्वजनिक कुंजियों को पार्स करके इन फ़ील्ड्स, वैधता और फिंगरप्रिंट दिखाता है।"
  },
  "tr": {
    "whatIsTitle": "Sertifika ve genel anahtar nedir?",
    "whatIsDescription": "X.509 sertifikası, bir genel anahtarı bir kimliğe (kişi, kuruluş veya alan adı) bağlayan imzalı bir belgedir. Subject, düzenleyici (CA), geçerlilik süresi, seri numarası, imza algoritması ve Subject Alternative Name (SAN) ile anahtar kullanımı gibi uzantıları içerir. Genel anahtar, imzaları doğrulamak veya verileri şifrelemek için paylaşılabilir; özel anahtar ise imzalama veya çözme için gizli tutulur. Parmak izleri, sertifikaları karşılaştırmak ve değişiklikleri tespit etmek için kullanılan hashlerdir. Bu araç sertifikaları ve genel anahtarları yerel olarak ayrıştırarak bu alanları, geçerliliği ve parmak izlerini gösterir."
  },
  "nl": {
    "whatIsTitle": "Wat is een certificaat en een publieke sleutel?",
    "whatIsDescription": "Een X.509-certificaat is een ondertekend document dat een publieke sleutel aan een identiteit (persoon, organisatie of domein) koppelt. Het bevat het subject, de uitgever (CA), geldigheidsperiode, serienummer, ondertekeningsalgoritme en extensies zoals Subject Alternative Name (SAN) en key usage. De publieke sleutel kan worden gedeeld om handtekeningen te verifiëren of gegevens te versleutelen, terwijl de privésleutel geheim blijft om te ondertekenen of te ontsleutelen. Vingerafdrukken zijn hashes die worden gebruikt om certificaten te vergelijken en wijzigingen te detecteren. Deze tool analyseert certificaten en publieke sleutels lokaal om deze velden, de geldigheid en de vingerafdrukken te tonen."
  },
  "sv": {
    "whatIsTitle": "Vad är ett certifikat och en publik nyckel?",
    "whatIsDescription": "Ett X.509-certifikat är ett signerat dokument som binder en publik nyckel till en identitet (person, organisation eller domän). Det innehåller subject, utfärdare (CA), giltighetsperiod, serienummer, signaturalgoritm och tillägg som Subject Alternative Name (SAN) och key usage. Den publika nyckeln kan delas för att verifiera signaturer eller kryptera data, medan den privata nyckeln hålls hemlig för att signera eller dekryptera. Fingeravtryck är hashvärden som används för att jämföra certifikat och upptäcka ändringar. Det här verktyget analyserar certifikat och publika nycklar lokalt för att visa dessa fält, giltighet och fingeravtryck."
  },
  "pl": {
    "whatIsTitle": "Czym jest certyfikat i klucz publiczny?",
    "whatIsDescription": "Certyfikat X.509 to podpisany dokument, który wiąże klucz publiczny z tożsamością (osoba, organizacja lub domena). Zawiera subject, wystawcę (CA), okres ważności, numer seryjny, algorytm podpisu oraz rozszerzenia takie jak Subject Alternative Name (SAN) i użycie klucza. Klucz publiczny można udostępniać do weryfikacji podpisów lub szyfrowania danych, a klucz prywatny pozostaje tajny do podpisywania lub odszyfrowywania. Odciski palca to hashe używane do porównywania certyfikatów i wykrywania zmian. To narzędzie lokalnie analizuje certyfikaty i klucze publiczne, aby wyświetlić te pola, ważność i odciski palca."
  },
  "vi": {
    "whatIsTitle": "Chứng chỉ và khóa công khai là gì?",
    "whatIsDescription": "Chứng chỉ X.509 là một tài liệu được ký, gắn khóa công khai với danh tính (cá nhân, tổ chức hoặc tên miền). Nó bao gồm subject, bên phát hành (CA), thời hạn hiệu lực, số sê-ri, thuật toán chữ ký và các phần mở rộng như Subject Alternative Name (SAN) và mức sử dụng khóa. Khóa công khai có thể được chia sẻ để xác minh chữ ký hoặc mã hóa dữ liệu, trong khi khóa riêng được giữ bí mật để ký hoặc giải mã. Dấu vân tay là các giá trị băm dùng để so sánh chứng chỉ và phát hiện thay đổi. Công cụ này phân tích chứng chỉ và khóa công khai cục bộ để hiển thị các trường này, hiệu lực và dấu vân tay."
  },
  "th": {
    "whatIsTitle": "ใบรับรองและกุญแจสาธารณะคืออะไร?",
    "whatIsDescription": "ใบรับรอง X.509 เป็นเอกสารที่ลงนามซึ่งผูกกุญแจสาธารณะกับตัวตน (บุคคล องค์กร หรือโดเมน) ภายในประกอบด้วย subject ผู้ให้การรับรอง (CA) ระยะเวลาใช้งาน หมายเลขซีเรียล อัลกอริทึมการลงนาม และส่วนขยายอย่าง Subject Alternative Name (SAN) และการใช้งานกุญแจ กุญแจสาธารณะสามารถแชร์เพื่อยืนยันลายเซ็นหรือเข้ารหัสข้อมูลได้ ขณะที่กุญแจส่วนตัวเก็บเป็นความลับเพื่อใช้ลงนามหรือถอดรหัส ลายนิ้วมือคือค่าแฮชที่ใช้เปรียบเทียบใบรับรองและตรวจจับการเปลี่ยนแปลง เครื่องมือนี้วิเคราะห์ใบรับรองและกุญแจสาธารณะในเครื่องเพื่อแสดงข้อมูลเหล่านี้ ระยะเวลาใช้งาน และลายนิ้วมือ"
  },
  "id": {
    "whatIsTitle": "Apa itu sertifikat dan kunci publik?",
    "whatIsDescription": "Sertifikat X.509 adalah dokumen bertanda tangan yang mengikat kunci publik ke identitas (orang, organisasi, atau domain). Dokumen ini berisi subjek, penerbit (CA), masa berlaku, nomor seri, algoritme tanda tangan, serta ekstensi seperti Subject Alternative Name (SAN) dan penggunaan kunci. Kunci publik dapat dibagikan untuk memverifikasi tanda tangan atau mengenkripsi data, sementara kunci privat tetap rahasia untuk menandatangani atau mendekripsi. Sidik jari adalah hash yang digunakan untuk membandingkan sertifikat dan mendeteksi perubahan. Alat ini mengurai sertifikat dan kunci publik secara lokal untuk menampilkan bidang-bidang ini, masa berlaku, dan sidik jari."
  },
  "he": {
    "whatIsTitle": "מהי תעודה ומהו מפתח ציבורי?",
    "whatIsDescription": "תעודת X.509 היא מסמך חתום שקושר מפתח ציבורי לזהות (אדם, ארגון או דומיין). היא כוללת Subject, מנפיק (CA), תקופת תוקף, מספר סידורי, אלגוריתם חתימה ותוספים כמו Subject Alternative Name (SAN) ושימוש במפתח. ניתן לשתף מפתח ציבורי כדי לאמת חתימות או להצפין נתונים, בעוד שהמפתח הפרטי נשמר בסוד כדי לחתום או לפענח. טביעות אצבע הן ערכי hash שמשמשים להשוואת תעודות ולזיהוי שינויים. כלי זה מנתח תעודות ומפתחות ציבוריים מקומית כדי להציג שדות אלה, תוקף וטביעות אצבע."
  },
  "ms": {
    "whatIsTitle": "Apakah sijil dan kunci awam?",
    "whatIsDescription": "Sijil X.509 ialah dokumen bertandatangan yang mengikat kunci awam kepada identiti (individu, organisasi atau domain). Ia merangkumi subject, pengeluar (CA), tempoh sah, nombor siri, algoritma tandatangan, serta sambungan seperti Subject Alternative Name (SAN) dan penggunaan kunci. Kunci awam boleh dikongsi untuk mengesahkan tandatangan atau menyulitkan data, manakala kunci peribadi kekal rahsia untuk menandatangani atau menyahsulit. Cap jari ialah hash yang digunakan untuk membandingkan sijil dan mengesan perubahan. Alat ini menghurai sijil dan kunci awam secara tempatan untuk memaparkan medan ini, tempoh sah dan cap jari."
  },
  "no": {
    "whatIsTitle": "Hva er et sertifikat og en offentlig nøkkel?",
    "whatIsDescription": "Et X.509-sertifikat er et signert dokument som binder en offentlig nøkkel til en identitet (person, organisasjon eller domene). Det inneholder subject, utsteder (CA), gyldighetsperiode, serienummer, signaturalgoritme og utvidelser som Subject Alternative Name (SAN) og nøkkelbruk. Den offentlige nøkkelen kan deles for å verifisere signaturer eller kryptere data, mens den private nøkkelen holdes hemmelig for å signere eller dekryptere. Fingeravtrykk er hasher som brukes til å sammenligne sertifikater og oppdage endringer. Dette verktøyet analyserer sertifikater og offentlige nøkler lokalt for å vise disse feltene, gyldighet og fingeravtrykk."
  }
}
</i18n>
