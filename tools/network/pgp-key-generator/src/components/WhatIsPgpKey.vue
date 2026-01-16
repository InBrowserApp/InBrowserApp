<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DescriptionMarkdown } from '@shared/ui/base'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a PGP Key?",
    "description": "**OpenPGP (PGP) keys** are asymmetric cryptographic key pairs used to encrypt data and sign messages.\n\n### What's in a key pair\n- **Public key**: Share it so others can encrypt to you or verify your signatures.\n- **Private key**: Keep it secret; it decrypts and creates signatures.\n- **Revocation certificate**: Lets you revoke a key if it is lost or compromised.\n\n### Key types and safety\nThis tool generates keys locally in your browser. ECC (Curve25519) is the default; RSA is available for compatibility. You can add a passphrase and an expiration date. Always back up your private key and revocation certificate, and verify fingerprints when sharing keys."
  },
  "zh": {
    "title": "什么是 PGP 密钥？",
    "description": "**OpenPGP（PGP）密钥**是用于加密数据和签名消息的非对称加密密钥对。\n\n### 密钥对包含什么\n- **公钥**：分享给他人以便他们向你加密或验证你的签名。\n- **私钥**：务必保密；用于解密和生成签名。\n- **吊销证书**：在密钥丢失或泄露时用于吊销密钥。\n\n### 密钥类型与安全性\n此工具在浏览器本地生成密钥。默认使用 ECC（Curve25519），也提供 RSA 以兼容旧系统。你可以设置密码短语和过期时间。务必备份私钥和吊销证书，并在分享密钥时核对指纹。"
  },
  "zh-CN": {
    "title": "什么是 PGP 密钥？",
    "description": "**OpenPGP（PGP）密钥**是用于加密数据和签名消息的非对称加密密钥对。\n\n### 密钥对包含什么\n- **公钥**：分享给他人以便他们向你加密或验证你的签名。\n- **私钥**：务必保密；用于解密和生成签名。\n- **吊销证书**：在密钥丢失或泄露时用于吊销密钥。\n\n### 密钥类型与安全性\n此工具在浏览器本地生成密钥。默认使用 ECC（Curve25519），也提供 RSA 以兼容旧系统。你可以设置密码短语和过期时间。务必备份私钥和吊销证书，并在分享密钥时核对指纹。"
  },
  "zh-TW": {
    "title": "什麼是 PGP 金鑰？",
    "description": "**OpenPGP（PGP）金鑰**是用來加密資料與簽署訊息的非對稱加密金鑰對。\n\n### 金鑰對包含什麼\n- **公鑰**：分享給他人，讓他們加密給你或驗證你的簽章。\n- **私鑰**：務必保密；用於解密與產生簽章。\n- **撤銷憑證**：在金鑰遺失或外洩時用於撤銷金鑰。\n\n### 金鑰類型與安全性\n此工具在瀏覽器本機產生金鑰。預設使用 ECC（Curve25519），也提供 RSA 以相容舊系統。你可以設定密碼短語與到期時間。務必備份私鑰與撤銷憑證，並在分享金鑰時核對指紋。"
  },
  "zh-HK": {
    "title": "什麼是 PGP 密鑰？",
    "description": "**OpenPGP（PGP）密鑰**是用來加密資料與簽署訊息的非對稱加密密鑰對。\n\n### 密鑰對包含什麼\n- **公鑰**：分享給他人，讓他們加密給你或驗證你的簽署。\n- **私鑰**：務必保密；用於解密與產生簽署。\n- **撤銷證書**：在密鑰遺失或外洩時用於撤銷密鑰。\n\n### 密鑰類型與安全性\n此工具在瀏覽器本機產生密鑰。預設使用 ECC（Curve25519），也提供 RSA 以相容舊系統。你可以設定密碼短語與到期時間。務必備份私鑰與撤銷證書，並在分享密鑰時核對指紋。"
  },
  "es": {
    "title": "¿Qué es una clave PGP?",
    "description": "**Las claves OpenPGP (PGP)** son pares de claves criptográficas asimétricas usadas para cifrar datos y firmar mensajes.\n\n### Qué incluye un par de claves\n- **Clave pública**: Compártala para que otros puedan cifrarte o verificar tus firmas.\n- **Clave privada**: Manténgala en secreto; descifra y crea firmas.\n- **Certificado de revocación**: Permite revocar una clave si se pierde o se ve comprometida.\n\n### Tipos de clave y seguridad\nEsta herramienta genera claves localmente en tu navegador. ECC (Curve25519) es el valor predeterminado; RSA está disponible por compatibilidad. Puedes añadir una frase de contraseña y una fecha de expiración. Haz copias de seguridad de tu clave privada y del certificado de revocación, y verifica las huellas digitales al compartir claves."
  },
  "fr": {
    "title": "Qu'est-ce qu'une clé PGP ?",
    "description": "**Les clés OpenPGP (PGP)** sont des paires de clés cryptographiques asymétriques utilisées pour chiffrer des données et signer des messages.\n\n### Ce qu'une paire de clés contient\n- **Clé publique** : Partagez-la pour que d'autres puissent chiffrer pour vous ou vérifier vos signatures.\n- **Clé privée** : Gardez-la secrète ; elle déchiffre et crée des signatures.\n- **Certificat de révocation** : Permet de révoquer une clé en cas de perte ou de compromission.\n\n### Types de clés et sécurité\nCet outil génère les clés localement dans votre navigateur. ECC (Curve25519) est le choix par défaut ; RSA est disponible pour la compatibilité. Vous pouvez ajouter une phrase de passe et une date d'expiration. Sauvegardez toujours votre clé privée et le certificat de révocation, et vérifiez les empreintes lors du partage des clés."
  },
  "de": {
    "title": "Was ist ein PGP-Schlüssel?",
    "description": "**OpenPGP (PGP)-Schlüssel** sind asymmetrische kryptografische Schlüsselpaare, mit denen Daten verschlüsselt und Nachrichten signiert werden.\n\n### Was ein Schlüsselpaar enthält\n- **Öffentlicher Schlüssel**: Teilen Sie ihn, damit andere für Sie verschlüsseln oder Ihre Signaturen prüfen können.\n- **Privater Schlüssel**: Halten Sie ihn geheim; er entschlüsselt und erstellt Signaturen.\n- **Widerrufszertifikat**: Ermöglicht das Widerrufen eines Schlüssels, wenn er verloren geht oder kompromittiert wird.\n\n### Schlüsseltypen und Sicherheit\nDieses Tool erzeugt Schlüssel lokal im Browser. ECC (Curve25519) ist Standard; RSA ist aus Kompatibilitätsgründen verfügbar. Sie können eine Passphrase und ein Ablaufdatum hinzufügen. Sichern Sie privaten Schlüssel und Widerrufszertifikat und prüfen Sie Fingerabdrücke beim Teilen von Schlüsseln."
  },
  "it": {
    "title": "Che cos'è una chiave PGP?",
    "description": "**Le chiavi OpenPGP (PGP)** sono coppie di chiavi crittografiche asimmetriche usate per cifrare dati e firmare messaggi.\n\n### Cosa contiene una coppia di chiavi\n- **Chiave pubblica**: Condividila per permettere ad altri di cifrare per te o verificare le tue firme.\n- **Chiave privata**: Mantienila segreta; decifra e crea firme.\n- **Certificato di revoca**: Consente di revocare una chiave se viene persa o compromessa.\n\n### Tipi di chiavi e sicurezza\nQuesto strumento genera le chiavi localmente nel browser. ECC (Curve25519) è l'impostazione predefinita; RSA è disponibile per compatibilità. Puoi aggiungere una passphrase e una data di scadenza. Esegui sempre il backup della chiave privata e del certificato di revoca e verifica le impronte quando condividi le chiavi."
  },
  "ja": {
    "title": "PGPキーとは？",
    "description": "**OpenPGP（PGP）キー**は、データを暗号化しメッセージに署名するための非対称暗号鍵ペアです。\n\n### キーペアの内容\n- **公開鍵**：共有して、相手があなた宛てに暗号化したり署名を検証できるようにします。\n- **秘密鍵**：秘密に保管します。復号と署名の作成に使います。\n- **失効証明書**：鍵を紛失したり漏えいした場合に取り消すために使います。\n\n### 鍵種別と安全性\nこのツールはブラウザ内でローカルに鍵を生成します。ECC（Curve25519）が既定で、互換性のためにRSAも選べます。パスフレーズと有効期限を設定できます。秘密鍵と失効証明書は必ずバックアップし、共有時にはフィンガープリントを確認してください。"
  },
  "ko": {
    "title": "PGP 키란?",
    "description": "**OpenPGP(PGP) 키**는 데이터를 암호화하고 메시지에 서명하기 위한 비대칭 암호 키 쌍입니다.\n\n### 키 쌍 구성\n- **공개 키**: 공유하여 다른 사람이 당신에게 암호화하거나 서명을 검증할 수 있게 합니다.\n- **개인 키**: 비밀로 보관합니다. 복호화와 서명 생성에 사용됩니다.\n- **폐기 인증서**: 키를 분실했거나 유출된 경우 키를 폐기할 수 있습니다.\n\n### 키 유형과 보안\n이 도구는 브라우저에서 로컬로 키를 생성합니다. ECC(Curve25519)가 기본이며, 호환성을 위해 RSA도 제공합니다. 암호문구와 만료 날짜를 추가할 수 있습니다. 개인 키와 폐기 인증서는 반드시 백업하고, 키를 공유할 때는 지문을 확인하세요."
  },
  "ru": {
    "title": "Что такое PGP-ключ?",
    "description": "**Ключи OpenPGP (PGP)** — это пары асимметричных криптографических ключей для шифрования данных и подписи сообщений.\n\n### Что входит в пару ключей\n- **Открытый ключ**: Делитесь им, чтобы другие могли шифровать для вас или проверять ваши подписи.\n- **Закрытый ключ**: Храните в секрете; он расшифровывает и создаёт подписи.\n- **Сертификат отзыва**: Позволяет отозвать ключ при потере или компрометации.\n\n### Типы ключей и безопасность\nЭтот инструмент генерирует ключи локально в вашем браузере. ECC (Curve25519) используется по умолчанию; RSA доступен для совместимости. Можно добавить парольную фразу и дату истечения. Всегда делайте резервные копии закрытого ключа и сертификата отзыва и проверяйте отпечатки при обмене ключами."
  },
  "pt": {
    "title": "O que é uma chave PGP?",
    "description": "**Chaves OpenPGP (PGP)** são pares de chaves criptográficas assimétricas usados para cifrar dados e assinar mensagens.\n\n### O que há em um par de chaves\n- **Chave pública**: Compartilhe para que outros possam cifrar para você ou verificar suas assinaturas.\n- **Chave privada**: Mantenha em segredo; ela descriptografa e cria assinaturas.\n- **Certificado de revogação**: Permite revogar uma chave se ela for perdida ou comprometida.\n\n### Tipos de chave e segurança\nEsta ferramenta gera chaves localmente no navegador. ECC (Curve25519) é o padrão; RSA está disponível por compatibilidade. Você pode adicionar uma frase-senha e uma data de expiração. Sempre faça backup da chave privada e do certificado de revogação e verifique as impressões digitais ao compartilhar chaves."
  },
  "ar": {
    "title": "ما هو مفتاح PGP؟",
    "description": "**مفاتيح OpenPGP (PGP)** هي أزواج مفاتيح تشفيرية غير متماثلة تُستخدم لتشفير البيانات وتوقيع الرسائل.\n\n### ما الذي يتضمنه زوج المفاتيح\n- **المفتاح العام**: شاركه ليتمكن الآخرون من التشفير إليك أو التحقق من توقيعاتك.\n- **المفتاح الخاص**: احتفظ به سريًا؛ فهو يفك التشفير ويُنشئ التواقيع.\n- **شهادة الإلغاء**: تتيح إلغاء المفتاح إذا فُقد أو تم اختراقه.\n\n### أنواع المفاتيح والأمان\nتُنشئ هذه الأداة المفاتيح محليًا في متصفحك. ECC (Curve25519) هو الافتراضي؛ وRSA متاح للتوافق. يمكنك إضافة عبارة مرور وتاريخ انتهاء. احرص دائمًا على نسخ المفتاح الخاص وشهادة الإلغاء احتياطيًا، وتحقق من البصمات عند مشاركة المفاتيح."
  },
  "hi": {
    "title": "PGP कुंजी क्या है?",
    "description": "**OpenPGP (PGP) कुंजियाँ** डेटा को एन्क्रिप्ट करने और संदेशों पर हस्ताक्षर करने के लिए उपयोग की जाने वाली असममित क्रिप्टोग्राफ़िक कुंजी जोड़ी हैं।\n\n### कुंजी जोड़ी में क्या होता है\n- **सार्वजनिक कुंजी**: इसे साझा करें ताकि अन्य लोग आपको एन्क्रिप्ट कर सकें या आपके हस्ताक्षरों की पुष्टि कर सकें।\n- **निजी कुंजी**: इसे गुप्त रखें; यह डिक्रिप्ट करती है और हस्ताक्षर बनाती है।\n- **निरस्तीकरण प्रमाणपत्र**: कुंजी खोने या समझौता होने पर उसे रद्द करने देता है।\n\n### कुंजी प्रकार और सुरक्षा\nयह टूल आपके ब्राउज़र में स्थानीय रूप से कुंजियाँ बनाता है। ECC (Curve25519) डिफ़ॉल्ट है; संगतता के लिए RSA उपलब्ध है। आप पासफ़्रेज़ और समाप्ति तिथि जोड़ सकते हैं। अपनी निजी कुंजी और निरस्तीकरण प्रमाणपत्र का बैकअप रखें, और साझा करते समय फिंगरप्रिंट सत्यापित करें।"
  },
  "tr": {
    "title": "PGP Anahtarı Nedir?",
    "description": "**OpenPGP (PGP) anahtarları**, verileri şifrelemek ve mesajları imzalamak için kullanılan asimetrik kriptografik anahtar çiftleridir.\n\n### Bir anahtar çiftinde neler vardır\n- **Genel anahtar**: Başkalarının size şifreli veri göndermesi veya imzalarınızı doğrulaması için paylaşın.\n- **Özel anahtar**: Gizli tutun; şifre çözer ve imza oluşturur.\n- **İptal sertifikası**: Anahtar kaybolursa veya ele geçirilirse iptal etmeyi sağlar.\n\n### Anahtar türleri ve güvenlik\nBu araç anahtarları tarayıcınızda yerel olarak üretir. ECC (Curve25519) varsayılandır; uyumluluk için RSA da vardır. Parola ifadesi ve bitiş tarihi ekleyebilirsiniz. Özel anahtarınızı ve iptal sertifikanızı mutlaka yedekleyin, anahtar paylaşırken parmak izlerini doğrulayın."
  },
  "nl": {
    "title": "Wat is een PGP-sleutel?",
    "description": "**OpenPGP (PGP)-sleutels** zijn asymmetrische cryptografische sleutelparen die worden gebruikt om gegevens te versleutelen en berichten te ondertekenen.\n\n### Wat een sleutelpaar bevat\n- **Publieke sleutel**: Deel deze zodat anderen voor jou kunnen versleutelen of je handtekeningen kunnen verifiëren.\n- **Privésleutel**: Houd deze geheim; hiermee ontcijfer je en maak je handtekeningen.\n- **Intrekkingscertificaat**: Hiermee kun je een sleutel intrekken als die verloren gaat of gecompromitteerd is.\n\n### Sleuteltypen en veiligheid\nDeze tool genereert sleutels lokaal in je browser. ECC (Curve25519) is standaard; RSA is beschikbaar voor compatibiliteit. Je kunt een wachtwoordzin en een vervaldatum toevoegen. Maak altijd een back-up van je privésleutel en het intrekkingscertificaat en controleer vingerafdrukken bij het delen van sleutels."
  },
  "sv": {
    "title": "Vad är en PGP-nyckel?",
    "description": "**OpenPGP (PGP)-nycklar** är asymmetriska kryptografiska nyckelpar som används för att kryptera data och signera meddelanden.\n\n### Vad ett nyckelpar innehåller\n- **Publik nyckel**: Dela den så att andra kan kryptera till dig eller verifiera dina signaturer.\n- **Privat nyckel**: Håll den hemlig; den dekrypterar och skapar signaturer.\n- **Återkallningscertifikat**: Gör det möjligt att återkalla en nyckel om den förloras eller komprometteras.\n\n### Nyckeltyper och säkerhet\nDet här verktyget genererar nycklar lokalt i din webbläsare. ECC (Curve25519) är standard; RSA finns för kompatibilitet. Du kan lägga till en lösenfras och ett utgångsdatum. Säkerhetskopiera alltid din privata nyckel och återkallningscertifikatet och verifiera fingeravtryck när du delar nycklar."
  },
  "pl": {
    "title": "Czym jest klucz PGP?",
    "description": "**Klucze OpenPGP (PGP)** to pary asymetrycznych kluczy kryptograficznych używane do szyfrowania danych i podpisywania wiadomości.\n\n### Co zawiera para kluczy\n- **Klucz publiczny**: Udostępnij go, aby inni mogli szyfrować dla Ciebie lub weryfikować Twoje podpisy.\n- **Klucz prywatny**: Zachowaj go w tajemnicy; służy do odszyfrowywania i tworzenia podpisów.\n- **Certyfikat unieważnienia**: Umożliwia unieważnienie klucza, gdy zostanie utracony lub skompromitowany.\n\n### Typy kluczy i bezpieczeństwo\nTo narzędzie generuje klucze lokalnie w przeglądarce. ECC (Curve25519) jest domyślny; RSA jest dostępny dla zgodności. Możesz dodać frazę hasła i datę wygaśnięcia. Zawsze wykonuj kopię zapasową klucza prywatnego i certyfikatu unieważnienia oraz weryfikuj odciski palca przy udostępnianiu kluczy."
  },
  "vi": {
    "title": "Khóa PGP là gì?",
    "description": "**Khóa OpenPGP (PGP)** là các cặp khóa mật mã bất đối xứng dùng để mã hóa dữ liệu và ký thông điệp.\n\n### Một cặp khóa gồm những gì\n- **Khóa công khai**: Chia sẻ để người khác có thể mã hóa cho bạn hoặc xác minh chữ ký của bạn.\n- **Khóa riêng tư**: Giữ bí mật; dùng để giải mã và tạo chữ ký.\n- **Chứng chỉ thu hồi**: Cho phép thu hồi khóa nếu bị mất hoặc bị lộ.\n\n### Loại khóa và an toàn\nCông cụ này tạo khóa cục bộ trong trình duyệt. ECC (Curve25519) là mặc định; RSA có sẵn để tương thích. Bạn có thể thêm cụm mật khẩu và ngày hết hạn. Luôn sao lưu khóa riêng tư và chứng chỉ thu hồi, và kiểm tra dấu vân tay khi chia sẻ khóa."
  },
  "th": {
    "title": "คีย์ PGP คืออะไร?",
    "description": "**คีย์ OpenPGP (PGP)** คือคู่คีย์เข้ารหัสแบบอสมมาตรที่ใช้เข้ารหัสข้อมูลและลงนามข้อความ\n\n### คู่คีย์ประกอบด้วยอะไรบ้าง\n- **คีย์สาธารณะ**: แชร์เพื่อให้ผู้อื่นเข้ารหัสให้คุณหรือยืนยันลายเซ็นของคุณ\n- **คีย์ส่วนตัว**: เก็บเป็นความลับ ใช้ถอดรหัสและสร้างลายเซ็น\n- **ใบรับรองการเพิกถอน**: ใช้เพิกถอนคีย์เมื่อสูญหายหรือถูกเจาะ\n\n### ประเภทคีย์และความปลอดภัย\nเครื่องมือนี้สร้างคีย์ในเบราว์เซอร์ของคุณแบบโลคัล โดยค่าเริ่มต้นคือ ECC (Curve25519) และมี RSA เพื่อความเข้ากันได้ คุณสามารถเพิ่มวลีรหัสผ่านและวันหมดอายุได้ ควรสำรองคีย์ส่วนตัวและใบรับรองการเพิกถอนเสมอ และตรวจสอบลายนิ้วมือเมื่อแชร์คีย์"
  },
  "id": {
    "title": "Apa itu Kunci PGP?",
    "description": "**Kunci OpenPGP (PGP)** adalah pasangan kunci kriptografi asimetris yang digunakan untuk mengenkripsi data dan menandatangani pesan.\n\n### Apa saja isi pasangan kunci\n- **Kunci publik**: Bagikan agar orang lain dapat mengenkripsi untuk Anda atau memverifikasi tanda tangan Anda.\n- **Kunci privat**: Jaga kerahasiaannya; digunakan untuk mendekripsi dan membuat tanda tangan.\n- **Sertifikat pencabutan**: Memungkinkan mencabut kunci jika hilang atau disusupi.\n\n### Jenis kunci dan keamanan\nAlat ini membuat kunci secara lokal di browser Anda. ECC (Curve25519) adalah default; RSA tersedia untuk kompatibilitas. Anda dapat menambahkan frasa sandi dan tanggal kedaluwarsa. Selalu cadangkan kunci privat dan sertifikat pencabutan, serta verifikasi sidik jari saat berbagi kunci."
  },
  "he": {
    "title": "מהו מפתח PGP?",
    "description": "**מפתחות OpenPGP (PGP)** הם זוגות מפתחות קריפטוגרפיים אסימטריים המשמשים להצפנת נתונים ולחתימת הודעות.\n\n### מה כולל זוג מפתחות\n- **מפתח ציבורי**: שתפו אותו כדי שאחרים יוכלו להצפין אליכם או לאמת את החתימות שלכם.\n- **מפתח פרטי**: שמרו עליו בסוד; הוא מפענח ויוצר חתימות.\n- **תעודת ביטול**: מאפשרת לבטל מפתח אם הוא אבד או נפרץ.\n\n### סוגי מפתחות ואבטחה\nכלי זה מייצר מפתחות מקומית בדפדפן. ECC (Curve25519) הוא ברירת המחדל; RSA זמין לתאימות. ניתן להוסיף ביטוי סיסמה ותאריך תפוגה. גבו תמיד את המפתח הפרטי ואת תעודת הביטול, ואמתו טביעות אצבע בעת שיתוף מפתחות."
  },
  "ms": {
    "title": "Apakah itu Kunci PGP?",
    "description": "**Kunci OpenPGP (PGP)** ialah pasangan kunci kriptografi asimetri yang digunakan untuk menyulitkan data dan menandatangani mesej.\n\n### Kandungan pasangan kunci\n- **Kunci awam**: Kongsi supaya orang lain boleh menyulitkan kepada anda atau mengesahkan tandatangan anda.\n- **Kunci peribadi**: Simpan secara rahsia; ia menyahsulit dan mencipta tandatangan.\n- **Sijil pembatalan**: Membolehkan anda membatalkan kunci jika hilang atau terjejas.\n\n### Jenis kunci dan keselamatan\nAlat ini menjana kunci secara tempatan dalam pelayar anda. ECC (Curve25519) ialah lalai; RSA tersedia untuk keserasian. Anda boleh menambah frasa kata laluan dan tarikh tamat. Sentiasa sandarkan kunci peribadi dan sijil pembatalan, dan sahkan cap jari apabila berkongsi kunci."
  },
  "no": {
    "title": "Hva er en PGP-nøkkel?",
    "description": "**OpenPGP (PGP)-nøkler** er asymmetriske kryptografiske nøkkelpar som brukes til å kryptere data og signere meldinger.\n\n### Hva et nøkkelpar inneholder\n- **Offentlig nøkkel**: Del den slik at andre kan kryptere til deg eller verifisere signaturene dine.\n- **Privat nøkkel**: Hold den hemmelig; den dekrypterer og lager signaturer.\n- **Tilbakekallingssertifikat**: Gjør det mulig å tilbakekalle en nøkkel hvis den blir mistet eller kompromittert.\n\n### Nøkkeltyper og sikkerhet\nDette verktøyet genererer nøkler lokalt i nettleseren. ECC (Curve25519) er standard; RSA er tilgjengelig for kompatibilitet. Du kan legge til en passfrase og en utløpsdato. Sikkerhetskopier alltid privat nøkkel og tilbakekallingssertifikat, og verifiser fingeravtrykk når du deler nøkler."
  }
}
</i18n>
