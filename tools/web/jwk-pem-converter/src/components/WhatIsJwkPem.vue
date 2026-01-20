<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text depth="2">{{ t('description1') }}</n-text>
    <n-text depth="2" style="margin-top: 8px; display: block">
      {{ t('description2') }}
    </n-text>
    <n-text depth="2" style="margin-top: 8px; display: block">
      {{ t('description3') }}
    </n-text>
    <n-ul style="margin-top: 12px">
      <n-li>{{ t('bullet1') }}</n-li>
      <n-li>{{ t('bullet2') }}</n-li>
      <n-li>{{ t('bullet3') }}</n-li>
    </n-ul>
  </ToolSection>
</template>

<script setup lang="ts">
import { NLi, NText, NUl } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is JWK ↔ PEM conversion?",
    "description1": "JWK (JSON Web Key) is a JSON-based format for cryptographic keys used in JOSE/JWT systems. A JWK can represent RSA, EC, or OKP keys and may appear inside a JWK Set (JWKS).",
    "description2": "PEM is a Base64-encoded ASN.1/DER key wrapped with header lines like BEGIN PUBLIC KEY or BEGIN PRIVATE KEY, and it's common in TLS, OpenSSL, and many SDKs.",
    "description3": "This tool converts keys in both directions, preserving the key material while choosing public (SPKI) or private (PKCS8) output. Supported types include RSA, EC (P-256/384/521), and OKP (Ed25519/X25519/Ed448/X448), and everything runs locally in your browser.",
    "bullet1": "Use a JWK/JWKS key with systems that only accept PEM.",
    "bullet2": "Export PEM keys for JWT libraries, API gateways, or key distribution.",
    "bullet3": "Share public keys safely without exposing private key data."
  },
  "zh": {
    "title": "什么是 JWK ↔ PEM 转换？",
    "description1": "JWK（JSON Web Key）是用于 JOSE/JWT 系统的 JSON 密钥格式。它可以表示 RSA、EC 或 OKP 密钥，也可以作为 JWK Set（JWKS）中的一项出现。",
    "description2": "PEM 是用 Base64 编码的 ASN.1/DER 密钥，带有类似 BEGIN PUBLIC KEY 或 BEGIN PRIVATE KEY 的头部行，常见于 TLS、OpenSSL 和许多 SDK。",
    "description3": "该工具可双向转换密钥，在选择公钥（SPKI）或私钥（PKCS8）输出时保持密钥材料不变。支持 RSA、EC（P-256/384/521）和 OKP（Ed25519/X25519/Ed448/X448），并且全部在浏览器本地完成。",
    "bullet1": "将 JWK/JWKS 密钥用于只接受 PEM 的系统。",
    "bullet2": "导出 PEM 供 JWT 库、API 网关或密钥分发使用。",
    "bullet3": "安全分享公钥而不暴露私钥数据。"
  },
  "zh-CN": {
    "title": "什么是 JWK ↔ PEM 转换？",
    "description1": "JWK（JSON Web Key）是用于 JOSE/JWT 系统的 JSON 密钥格式。它可以表示 RSA、EC 或 OKP 密钥，也可以作为 JWK Set（JWKS）中的一项出现。",
    "description2": "PEM 是用 Base64 编码的 ASN.1/DER 密钥，带有类似 BEGIN PUBLIC KEY 或 BEGIN PRIVATE KEY 的头部行，常见于 TLS、OpenSSL 和许多 SDK。",
    "description3": "该工具可双向转换密钥，在选择公钥（SPKI）或私钥（PKCS8）输出时保持密钥材料不变。支持 RSA、EC（P-256/384/521）和 OKP（Ed25519/X25519/Ed448/X448），并且全部在浏览器本地完成。",
    "bullet1": "将 JWK/JWKS 密钥用于只接受 PEM 的系统。",
    "bullet2": "导出 PEM 供 JWT 库、API 网关或密钥分发使用。",
    "bullet3": "安全分享公钥而不暴露私钥数据。"
  },
  "zh-TW": {
    "title": "什麼是 JWK ↔ PEM 轉換？",
    "description1": "JWK（JSON Web Key）是用於 JOSE/JWT 系統的 JSON 金鑰格式。它可以表示 RSA、EC 或 OKP 金鑰，也可能出現在 JWK Set（JWKS）中。",
    "description2": "PEM 是以 Base64 編碼的 ASN.1/DER 金鑰，帶有像 BEGIN PUBLIC KEY 或 BEGIN PRIVATE KEY 的標頭行，常見於 TLS、OpenSSL 與許多 SDK。",
    "description3": "此工具可雙向轉換金鑰，在選擇公鑰（SPKI）或私鑰（PKCS8）輸出時保留金鑰材料。支援 RSA、EC（P-256/384/521）與 OKP（Ed25519/X25519/Ed448/X448），並全程在瀏覽器本機完成。",
    "bullet1": "讓 JWK/JWKS 金鑰可用於只接受 PEM 的系統。",
    "bullet2": "匯出 PEM 供 JWT 函式庫、API 閘道或金鑰發佈使用。",
    "bullet3": "安全分享公鑰而不暴露私鑰資料。"
  },
  "zh-HK": {
    "title": "什麼是 JWK ↔ PEM 轉換？",
    "description1": "JWK（JSON Web Key）是用於 JOSE/JWT 系統的 JSON 金鑰格式。它可以表示 RSA、EC 或 OKP 金鑰，也可能出現在 JWK Set（JWKS）中。",
    "description2": "PEM 是以 Base64 編碼的 ASN.1/DER 金鑰，帶有像 BEGIN PUBLIC KEY 或 BEGIN PRIVATE KEY 的標頭行，常見於 TLS、OpenSSL 與許多 SDK。",
    "description3": "此工具可雙向轉換金鑰，在選擇公鑰（SPKI）或私鑰（PKCS8）輸出時保留金鑰材料。支援 RSA、EC（P-256/384/521）與 OKP（Ed25519/X25519/Ed448/X448），並全程在瀏覽器本機完成。",
    "bullet1": "讓 JWK/JWKS 金鑰可用於只接受 PEM 的系統。",
    "bullet2": "匯出 PEM 供 JWT 函式庫、API 閘道或金鑰發佈使用。",
    "bullet3": "安全分享公鑰而不暴露私鑰資料。"
  },
  "es": {
    "title": "¿Qué es la conversión JWK ↔ PEM?",
    "description1": "JWK (JSON Web Key) es un formato JSON para claves criptográficas usado en sistemas JOSE/JWT. Puede representar claves RSA, EC u OKP y puede aparecer dentro de un JWK Set (JWKS).",
    "description2": "PEM es una clave ASN.1/DER codificada en Base64 con encabezados como BEGIN PUBLIC KEY o BEGIN PRIVATE KEY, común en TLS, OpenSSL y muchas SDK.",
    "description3": "Esta herramienta convierte claves en ambos sentidos, preservando el material de clave al elegir salida pública (SPKI) o privada (PKCS8). Soporta RSA, EC (P-256/384/521) y OKP (Ed25519/X25519/Ed448/X448), y todo se ejecuta localmente en tu navegador.",
    "bullet1": "Usa una clave JWK/JWKS en sistemas que solo aceptan PEM.",
    "bullet2": "Exporta claves PEM para bibliotecas JWT, pasarelas de API o distribución de claves.",
    "bullet3": "Comparte claves públicas de forma segura sin exponer datos de la clave privada."
  },
  "fr": {
    "title": "Qu'est-ce que la conversion JWK ↔ PEM ?",
    "description1": "JWK (JSON Web Key) est un format JSON pour les clés cryptographiques utilisé dans les systèmes JOSE/JWT. Il peut représenter des clés RSA, EC ou OKP et peut apparaître dans un JWK Set (JWKS).",
    "description2": "PEM est une clé ASN.1/DER encodée en Base64 avec des en-têtes tels que BEGIN PUBLIC KEY ou BEGIN PRIVATE KEY, courante dans TLS, OpenSSL et de nombreux SDK.",
    "description3": "Cet outil convertit les clés dans les deux sens, en préservant le matériau de clé lors du choix d'une sortie publique (SPKI) ou privée (PKCS8). Il prend en charge RSA, EC (P-256/384/521) et OKP (Ed25519/X25519/Ed448/X448), et tout fonctionne localement dans votre navigateur.",
    "bullet1": "Utilisez une clé JWK/JWKS avec des systèmes qui n'acceptent que le PEM.",
    "bullet2": "Exportez des clés PEM pour des bibliothèques JWT, des passerelles API ou la distribution de clés.",
    "bullet3": "Partagez des clés publiques en toute sécurité sans exposer les données de clé privée."
  },
  "de": {
    "title": "Was ist die JWK ↔ PEM-Konvertierung?",
    "description1": "JWK (JSON Web Key) ist ein JSON-basiertes Format für kryptografische Schlüssel, das in JOSE/JWT-Systemen verwendet wird. Es kann RSA-, EC- oder OKP-Schlüssel darstellen und in einem JWK Set (JWKS) enthalten sein.",
    "description2": "PEM ist ein Base64-kodierter ASN.1/DER-Schlüssel mit Kopfzeilen wie BEGIN PUBLIC KEY oder BEGIN PRIVATE KEY und ist in TLS, OpenSSL und vielen SDKs üblich.",
    "description3": "Dieses Tool konvertiert Schlüssel in beide Richtungen und bewahrt das Schlüsselmaterial, während öffentliche (SPKI) oder private (PKCS8) Ausgaben gewählt werden. Unterstützt werden RSA, EC (P-256/384/521) und OKP (Ed25519/X25519/Ed448/X448), alles lokal im Browser.",
    "bullet1": "Nutzen Sie einen JWK/JWKS-Schlüssel in Systemen, die nur PEM akzeptieren.",
    "bullet2": "Exportieren Sie PEM-Schlüssel für JWT-Bibliotheken, API-Gateways oder die Schlüsselverteilung.",
    "bullet3": "Teilen Sie öffentliche Schlüssel sicher, ohne private Schlüsseldaten preiszugeben."
  },
  "it": {
    "title": "Cos'è la conversione JWK ↔ PEM?",
    "description1": "JWK (JSON Web Key) è un formato JSON per chiavi crittografiche usato nei sistemi JOSE/JWT. Può rappresentare chiavi RSA, EC o OKP e può apparire in un JWK Set (JWKS).",
    "description2": "PEM è una chiave ASN.1/DER codificata in Base64 con intestazioni come BEGIN PUBLIC KEY o BEGIN PRIVATE KEY, comune in TLS, OpenSSL e molti SDK.",
    "description3": "Questo strumento converte le chiavi in entrambe le direzioni, preservando il materiale della chiave scegliendo un output pubblico (SPKI) o privato (PKCS8). Supporta RSA, EC (P-256/384/521) e OKP (Ed25519/X25519/Ed448/X448), e funziona tutto localmente nel browser.",
    "bullet1": "Usa una chiave JWK/JWKS in sistemi che accettano solo PEM.",
    "bullet2": "Esporta chiavi PEM per librerie JWT, gateway API o distribuzione delle chiavi.",
    "bullet3": "Condividi in modo sicuro le chiavi pubbliche senza esporre dati della chiave privata."
  },
  "ja": {
    "title": "JWK ↔ PEM 変換とは？",
    "description1": "JWK（JSON Web Key）は JOSE/JWT で使われる JSON 形式の鍵表現です。RSA、EC、OKP の鍵を表せ、JWK Set（JWKS）としてまとめられることもあります。",
    "description2": "PEM は Base64 でエンコードされた ASN.1/DER 鍵で、BEGIN PUBLIC KEY や BEGIN PRIVATE KEY のヘッダーを持ち、TLS、OpenSSL、さまざまな SDK で一般的です。",
    "description3": "このツールは鍵を双方向に変換し、公鍵（SPKI）または秘密鍵（PKCS8）を選んでも鍵素材を保持します。RSA、EC（P-256/384/521）、OKP（Ed25519/X25519/Ed448/X448）に対応し、すべてブラウザー内で完結します。",
    "bullet1": "PEM しか受け付けないシステムで JWK/JWKS 鍵を使えます。",
    "bullet2": "JWT ライブラリや API ゲートウェイ向けに PEM 鍵を出力できます。",
    "bullet3": "秘密鍵を公開せずに公開鍵を安全に共有できます。"
  },
  "ko": {
    "title": "JWK ↔ PEM 변환이란?",
    "description1": "JWK(JSON Web Key)은 JOSE/JWT 시스템에서 사용하는 JSON 기반 키 형식입니다. RSA, EC, OKP 키를 표현할 수 있으며 JWK Set(JWKS)로 묶일 수도 있습니다.",
    "description2": "PEM은 Base64로 인코딩된 ASN.1/DER 키로, BEGIN PUBLIC KEY 또는 BEGIN PRIVATE KEY 같은 헤더를 가지며 TLS, OpenSSL, 다양한 SDK에서 흔히 사용됩니다.",
    "description3": "이 도구는 키를 양방향으로 변환하며, 공개키(SPKI) 또는 개인키(PKCS8)를 선택해도 키 소재를 보존합니다. RSA, EC(P-256/384/521), OKP(Ed25519/X25519/Ed448/X448)를 지원하고 모든 처리는 브라우저에서 로컬로 이뤄집니다.",
    "bullet1": "PEM만 받는 시스템에서 JWK/JWKS 키를 사용할 수 있습니다.",
    "bullet2": "JWT 라이브러리, API 게이트웨이 또는 키 배포용으로 PEM 키를 내보낼 수 있습니다.",
    "bullet3": "개인키 데이터를 노출하지 않고 공개키를 안전하게 공유할 수 있습니다."
  },
  "ru": {
    "title": "Что такое преобразование JWK ↔ PEM?",
    "description1": "JWK (JSON Web Key) — это JSON-формат криптографических ключей, используемый в системах JOSE/JWT. Он может представлять ключи RSA, EC или OKP и может быть частью JWK Set (JWKS).",
    "description2": "PEM — это ключ ASN.1/DER, закодированный в Base64 и обёрнутый заголовками вроде BEGIN PUBLIC KEY или BEGIN PRIVATE KEY. Он широко используется в TLS, OpenSSL и многих SDK.",
    "description3": "Этот инструмент конвертирует ключи в обе стороны, сохраняя материал ключа при выборе публичного (SPKI) или приватного (PKCS8) вывода. Поддерживаются RSA, EC (P-256/384/521) и OKP (Ed25519/X25519/Ed448/X448), и всё выполняется локально в браузере.",
    "bullet1": "Используйте ключ JWK/JWKS в системах, принимающих только PEM.",
    "bullet2": "Экспортируйте PEM-ключи для библиотек JWT, API-шлюзов или распространения ключей.",
    "bullet3": "Безопасно делитесь публичными ключами, не раскрывая данные приватного ключа."
  },
  "pt": {
    "title": "O que é a conversão JWK ↔ PEM?",
    "description1": "JWK (JSON Web Key) é um formato JSON para chaves criptográficas usado em sistemas JOSE/JWT. Ele pode representar chaves RSA, EC ou OKP e pode aparecer em um JWK Set (JWKS).",
    "description2": "PEM é uma chave ASN.1/DER codificada em Base64 com cabeçalhos como BEGIN PUBLIC KEY ou BEGIN PRIVATE KEY, comum em TLS, OpenSSL e muitos SDKs.",
    "description3": "Esta ferramenta converte chaves em ambos os sentidos, preservando o material da chave ao escolher saída pública (SPKI) ou privada (PKCS8). Suporta RSA, EC (P-256/384/521) e OKP (Ed25519/X25519/Ed448/X448), e tudo roda localmente no navegador.",
    "bullet1": "Use uma chave JWK/JWKS em sistemas que aceitam apenas PEM.",
    "bullet2": "Exporte chaves PEM para bibliotecas JWT, gateways de API ou distribuição de chaves.",
    "bullet3": "Compartilhe chaves públicas com segurança sem expor dados da chave privada."
  },
  "ar": {
    "title": "ما هي عملية التحويل بين JWK و PEM؟",
    "description1": "JWK ‏(JSON Web Key) هو تنسيق JSON لمفاتيح التشفير يُستخدم في أنظمة JOSE/JWT. يمكنه تمثيل مفاتيح RSA أو EC أو OKP وقد يأتي ضمن مجموعة JWK ‏(JWKS).",
    "description2": "PEM هو مفتاح ASN.1/DER مُرمّز بـ Base64 مع أسطر ترويسة مثل BEGIN PUBLIC KEY أو BEGIN PRIVATE KEY، وهو شائع في TLS وOpenSSL والعديد من حزم SDK.",
    "description3": "تقوم هذه الأداة بتحويل المفاتيح في الاتجاهين مع الحفاظ على مادة المفتاح عند اختيار إخراج عام (SPKI) أو خاص (PKCS8). تدعم RSA وEC ‏(P-256/384/521) وOKP ‏(Ed25519/X25519/Ed448/X448)، وكل شيء يعمل محلياً داخل المتصفح.",
    "bullet1": "استخدم مفتاح JWK/JWKS مع أنظمة لا تقبل إلا PEM.",
    "bullet2": "صدّر مفاتيح PEM لمكتبات JWT أو بوابات API أو توزيع المفاتيح.",
    "bullet3": "شارك المفاتيح العامة بأمان دون كشف بيانات المفتاح الخاص."
  },
  "hi": {
    "title": "JWK ↔ PEM रूपांतरण क्या है?",
    "description1": "JWK (JSON Web Key) एक JSON आधारित क्रिप्टोग्राफ़िक कुंजी प्रारूप है, जो JOSE/JWT सिस्टम में उपयोग होता है। यह RSA, EC या OKP कुंजियों का प्रतिनिधित्व कर सकता है और JWK Set (JWKS) में भी आ सकता है।",
    "description2": "PEM एक Base64-एन्कोडेड ASN.1/DER कुंजी है, जिसमें BEGIN PUBLIC KEY या BEGIN PRIVATE KEY जैसी हेडर पंक्तियाँ होती हैं, और यह TLS, OpenSSL तथा कई SDK में सामान्य है।",
    "description3": "यह टूल दोनों दिशाओं में कुंजियाँ बदलता है और सार्वजनिक (SPKI) या निजी (PKCS8) आउटपुट चुनते समय कुंजी सामग्री को सुरक्षित रखता है। यह RSA, EC (P-256/384/521) और OKP (Ed25519/X25519/Ed448/X448) को सपोर्ट करता है, और सब कुछ आपके ब्राउज़र में लोकल रूप से चलता है।",
    "bullet1": "JWK/JWKS कुंजी को उन सिस्टमों में उपयोग करें जो केवल PEM स्वीकार करते हैं।",
    "bullet2": "JWT लाइब्रेरी, API गेटवे या कुंजी वितरण के लिए PEM कुंजियाँ एक्सपोर्ट करें।",
    "bullet3": "निजी कुंजी डेटा उजागर किए बिना सार्वजनिक कुंजियाँ सुरक्षित रूप से साझा करें।"
  },
  "tr": {
    "title": "JWK ↔ PEM dönüştürme nedir?",
    "description1": "JWK (JSON Web Key), JOSE/JWT sistemlerinde kullanılan JSON tabanlı bir kriptografik anahtar biçimidir. RSA, EC veya OKP anahtarlarını temsil edebilir ve bir JWK Set (JWKS) içinde yer alabilir.",
    "description2": "PEM, BEGIN PUBLIC KEY veya BEGIN PRIVATE KEY gibi başlık satırlarına sahip Base64 kodlu ASN.1/DER anahtardır; TLS, OpenSSL ve birçok SDK'da yaygındır.",
    "description3": "Bu araç anahtarları iki yönde de dönüştürür; açık (SPKI) veya gizli (PKCS8) çıktı seçilirken anahtar materyalini korur. RSA, EC (P-256/384/521) ve OKP (Ed25519/X25519/Ed448/X448) desteklenir ve her şey tarayıcıda yerel olarak çalışır.",
    "bullet1": "Yalnızca PEM kabul eden sistemlerde JWK/JWKS anahtarlarını kullanın.",
    "bullet2": "JWT kütüphaneleri, API ağ geçitleri veya anahtar dağıtımı için PEM anahtarlarını dışa aktarın.",
    "bullet3": "Özel anahtar verilerini açığa çıkarmadan açık anahtarları güvenle paylaşın."
  },
  "nl": {
    "title": "Wat is JWK ↔ PEM-conversie?",
    "description1": "JWK (JSON Web Key) is een JSON-formaat voor cryptografische sleutels dat wordt gebruikt in JOSE/JWT-systemen. Het kan RSA-, EC- of OKP-sleutels representeren en kan voorkomen in een JWK Set (JWKS).",
    "description2": "PEM is een Base64-gecodeerde ASN.1/DER-sleutel met kopregels zoals BEGIN PUBLIC KEY of BEGIN PRIVATE KEY, en is gebruikelijk in TLS, OpenSSL en veel SDK's.",
    "description3": "Deze tool converteert sleutels in beide richtingen en behoudt het sleutelmateriaal wanneer je publieke (SPKI) of private (PKCS8) output kiest. Ondersteunt RSA, EC (P-256/384/521) en OKP (Ed25519/X25519/Ed448/X448), en alles draait lokaal in je browser.",
    "bullet1": "Gebruik een JWK/JWKS-sleutel met systemen die alleen PEM accepteren.",
    "bullet2": "Exporteer PEM-sleutels voor JWT-bibliotheken, API-gateways of sleutel-distributie.",
    "bullet3": "Deel publieke sleutels veilig zonder private-sleuteldata bloot te leggen."
  },
  "sv": {
    "title": "Vad är JWK ↔ PEM-konvertering?",
    "description1": "JWK (JSON Web Key) är ett JSON-baserat format för kryptografiska nycklar som används i JOSE/JWT-system. Det kan representera RSA-, EC- eller OKP-nycklar och kan förekomma i en JWK Set (JWKS).",
    "description2": "PEM är en Base64-kodad ASN.1/DER-nyckel med rubriker som BEGIN PUBLIC KEY eller BEGIN PRIVATE KEY och är vanlig i TLS, OpenSSL och många SDK:er.",
    "description3": "Det här verktyget konverterar nycklar åt båda håll och bevarar nyckelmaterialet när du väljer offentlig (SPKI) eller privat (PKCS8) utdata. Stöd för RSA, EC (P-256/384/521) och OKP (Ed25519/X25519/Ed448/X448), och allt körs lokalt i webbläsaren.",
    "bullet1": "Använd en JWK/JWKS-nyckel i system som bara accepterar PEM.",
    "bullet2": "Exportera PEM-nycklar för JWT-bibliotek, API-gateways eller nyckeldistribution.",
    "bullet3": "Dela offentliga nycklar säkert utan att exponera privata nyckeldata."
  },
  "pl": {
    "title": "Czym jest konwersja JWK ↔ PEM?",
    "description1": "JWK (JSON Web Key) to format JSON dla kluczy kryptograficznych używany w systemach JOSE/JWT. Może reprezentować klucze RSA, EC lub OKP i może występować w JWK Set (JWKS).",
    "description2": "PEM to klucz ASN.1/DER zakodowany w Base64 z nagłówkami takimi jak BEGIN PUBLIC KEY lub BEGIN PRIVATE KEY, powszechny w TLS, OpenSSL i wielu SDK.",
    "description3": "Narzędzie konwertuje klucze w obu kierunkach, zachowując materiał klucza przy wyborze wyjścia publicznego (SPKI) lub prywatnego (PKCS8). Obsługuje RSA, EC (P-256/384/521) i OKP (Ed25519/X25519/Ed448/X448), a wszystko działa lokalnie w przeglądarce.",
    "bullet1": "Użyj klucza JWK/JWKS w systemach, które akceptują tylko PEM.",
    "bullet2": "Eksportuj klucze PEM dla bibliotek JWT, bramek API lub dystrybucji kluczy.",
    "bullet3": "Udostępniaj klucze publiczne bezpiecznie, nie ujawniając danych klucza prywatnego."
  },
  "vi": {
    "title": "Chuyển đổi JWK ↔ PEM là gì?",
    "description1": "JWK (JSON Web Key) là định dạng JSON cho khóa mật mã dùng trong hệ thống JOSE/JWT. Nó có thể biểu diễn khóa RSA, EC hoặc OKP và có thể nằm trong JWK Set (JWKS).",
    "description2": "PEM là khóa ASN.1/DER được mã hóa Base64 với các dòng tiêu đề như BEGIN PUBLIC KEY hoặc BEGIN PRIVATE KEY, phổ biến trong TLS, OpenSSL và nhiều SDK.",
    "description3": "Công cụ này chuyển đổi khóa theo cả hai chiều, giữ nguyên vật liệu khóa khi chọn đầu ra công khai (SPKI) hoặc riêng tư (PKCS8). Hỗ trợ RSA, EC (P-256/384/521) và OKP (Ed25519/X25519/Ed448/X448), và mọi thứ chạy cục bộ trong trình duyệt.",
    "bullet1": "Dùng khóa JWK/JWKS với các hệ thống chỉ chấp nhận PEM.",
    "bullet2": "Xuất khóa PEM cho thư viện JWT, cổng API hoặc phân phối khóa.",
    "bullet3": "Chia sẻ khóa công khai an toàn mà không lộ dữ liệu khóa riêng."
  },
  "th": {
    "title": "การแปลง JWK ↔ PEM คืออะไร?",
    "description1": "JWK (JSON Web Key) เป็นรูปแบบ JSON สำหรับกุญแจคริปโตที่ใช้ในระบบ JOSE/JWT สามารถแทนกุญแจ RSA, EC หรือ OKP และอาจอยู่ใน JWK Set (JWKS) ได้",
    "description2": "PEM คือกุญแจ ASN.1/DER ที่เข้ารหัสด้วย Base64 พร้อมบรรทัดหัวเช่น BEGIN PUBLIC KEY หรือ BEGIN PRIVATE KEY และพบได้ทั่วไปใน TLS, OpenSSL และ SDK ต่าง ๆ",
    "description3": "เครื่องมือนี้แปลงกุญแจได้ทั้งสองทิศทาง โดยคงวัสดุกุญแจไว้เมื่อเลือกเอาต์พุตสาธารณะ (SPKI) หรือส่วนตัว (PKCS8) รองรับ RSA, EC (P-256/384/521) และ OKP (Ed25519/X25519/Ed448/X448) และทำงานทั้งหมดในเบราว์เซอร์ของคุณ",
    "bullet1": "ใช้กุญแจ JWK/JWKS กับระบบที่รับเฉพาะ PEM",
    "bullet2": "ส่งออกกุญแจ PEM สำหรับไลบรารี JWT เกตเวย์ API หรือการกระจายกุญแจ",
    "bullet3": "แชร์กุญแจสาธารณะอย่างปลอดภัยโดยไม่เปิดเผยข้อมูลกุญแจส่วนตัว"
  },
  "id": {
    "title": "Apa itu konversi JWK ↔ PEM?",
    "description1": "JWK (JSON Web Key) adalah format JSON untuk kunci kriptografi yang digunakan dalam sistem JOSE/JWT. JWK dapat merepresentasikan kunci RSA, EC, atau OKP dan bisa berada dalam JWK Set (JWKS).",
    "description2": "PEM adalah kunci ASN.1/DER yang dikodekan Base64 dengan baris header seperti BEGIN PUBLIC KEY atau BEGIN PRIVATE KEY, umum di TLS, OpenSSL, dan banyak SDK.",
    "description3": "Alat ini mengonversi kunci dua arah, menjaga materi kunci saat memilih output publik (SPKI) atau privat (PKCS8). Mendukung RSA, EC (P-256/384/521), dan OKP (Ed25519/X25519/Ed448/X448), dan semuanya berjalan lokal di browser Anda.",
    "bullet1": "Gunakan kunci JWK/JWKS pada sistem yang hanya menerima PEM.",
    "bullet2": "Ekspor kunci PEM untuk pustaka JWT, gateway API, atau distribusi kunci.",
    "bullet3": "Bagikan kunci publik dengan aman tanpa mengekspos data kunci privat."
  },
  "he": {
    "title": "מהי המרה בין JWK ל‑PEM?",
    "description1": "JWK ‏(JSON Web Key) הוא פורמט JSON למפתחות קריפטוגרפיים המשמש במערכות JOSE/JWT. הוא יכול לייצג מפתחות RSA, EC או OKP ויכול להופיע בתוך JWK Set ‏(JWKS).",
    "description2": "PEM הוא מפתח ASN.1/DER שמקודד ב‑Base64 עם שורות כותרת כמו BEGIN PUBLIC KEY או BEGIN PRIVATE KEY, והוא נפוץ ב‑TLS, OpenSSL וב‑SDK רבים.",
    "description3": "הכלי ממיר מפתחות לשני הכיוונים, תוך שמירה על חומר המפתח בעת בחירת פלט ציבורי (SPKI) או פרטי (PKCS8). נתמכים RSA, EC ‏(P-256/384/521) ו‑OKP ‏(Ed25519/X25519/Ed448/X448), והכול פועל מקומית בדפדפן.",
    "bullet1": "השתמשו במפתח JWK/JWKS במערכות שמקבלות רק PEM.",
    "bullet2": "ייצאו מפתחות PEM לספריות JWT, לשערי API או להפצת מפתחות.",
    "bullet3": "שתפו מפתחות ציבוריים בבטחה בלי לחשוף נתוני מפתח פרטי."
  },
  "ms": {
    "title": "Apakah penukaran JWK ↔ PEM?",
    "description1": "JWK (JSON Web Key) ialah format JSON untuk kunci kriptografi yang digunakan dalam sistem JOSE/JWT. Ia boleh mewakili kunci RSA, EC atau OKP dan boleh berada dalam JWK Set (JWKS).",
    "description2": "PEM ialah kunci ASN.1/DER yang dikod Base64 dengan baris pengepala seperti BEGIN PUBLIC KEY atau BEGIN PRIVATE KEY, lazim dalam TLS, OpenSSL dan banyak SDK.",
    "description3": "Alat ini menukar kunci dua hala, mengekalkan bahan kunci ketika memilih output awam (SPKI) atau peribadi (PKCS8). Menyokong RSA, EC (P-256/384/521) dan OKP (Ed25519/X25519/Ed448/X448), dan semuanya berjalan secara tempatan dalam pelayar.",
    "bullet1": "Gunakan kunci JWK/JWKS dalam sistem yang hanya menerima PEM.",
    "bullet2": "Eksport kunci PEM untuk pustaka JWT, gerbang API atau pengedaran kunci.",
    "bullet3": "Kongsi kunci awam dengan selamat tanpa mendedahkan data kunci peribadi."
  },
  "no": {
    "title": "Hva er JWK ↔ PEM-konvertering?",
    "description1": "JWK (JSON Web Key) er et JSON-basert format for kryptografiske nøkler brukt i JOSE/JWT-systemer. Det kan representere RSA-, EC- eller OKP-nøkler og kan forekomme i et JWK Set (JWKS).",
    "description2": "PEM er en Base64-kodet ASN.1/DER-nøkkel med overskriftslinjer som BEGIN PUBLIC KEY eller BEGIN PRIVATE KEY, og er vanlig i TLS, OpenSSL og mange SDK-er.",
    "description3": "Dette verktøyet konverterer nøkler begge veier og bevarer nøkkelmaterialet når du velger offentlig (SPKI) eller privat (PKCS8) utdata. Det støtter RSA, EC (P-256/384/521) og OKP (Ed25519/X25519/Ed448/X448), og alt kjører lokalt i nettleseren.",
    "bullet1": "Bruk en JWK/JWKS-nøkkel i systemer som bare aksepterer PEM.",
    "bullet2": "Eksporter PEM-nøkler for JWT-biblioteker, API-gateways eller nøkkeldistribusjon.",
    "bullet3": "Del offentlige nøkler trygt uten å eksponere private nøkkeldata."
  }
}
</i18n>
