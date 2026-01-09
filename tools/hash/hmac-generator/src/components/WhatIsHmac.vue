<template>
  <DescriptionMarkdown :title="t('what-is-hmac')" :description="t('what-is-hmac-description')" />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "what-is-hmac": "What is HMAC?",
    "what-is-hmac-description": "HMAC (Hash-based Message Authentication Code) is a cryptographic mechanism that combines a secret key with a hash function to verify both the data integrity and authenticity of a message.\n\n**How it works:**\n1. The secret key is combined with the message\n2. A hash function (like SHA-256) processes the combined data\n3. The result is a fixed-size authentication code\n\n**Common use cases:**\n- **API Authentication**: Signing API requests to verify the sender\n- **JWT Tokens**: Used in HS256/HS384/HS512 algorithms\n- **Message Verification**: Ensuring data hasn't been tampered with\n- **Webhook Signatures**: Validating webhook payloads\n\n**Security notes:**\n- Always use a strong, random secret key\n- Keep your secret key confidential\n- SHA-256 or higher is recommended for new applications\n- SHA-1 is considered weak and should be avoided for security-critical uses"
  },
  "zh": {
    "what-is-hmac": "什么是 HMAC？",
    "what-is-hmac-description": "HMAC（基于哈希的消息认证码）是一种加密机制，它将密钥与哈希函数结合，用于验证消息的数据完整性和真实性。\n\n**工作原理：**\n1. 密钥与消息组合\n2. 哈希函数（如 SHA-256）处理组合后的数据\n3. 生成固定长度的认证码\n\n**常见用途：**\n- **API 认证**：签名 API 请求以验证发送者身份\n- **JWT 令牌**：用于 HS256/HS384/HS512 算法\n- **消息验证**：确保数据未被篡改\n- **Webhook 签名**：验证 webhook 负载\n\n**安全提示：**\n- 始终使用强随机密钥\n- 保持密钥的机密性\n- 新应用推荐使用 SHA-256 或更高版本\n- SHA-1 被认为较弱，应避免用于安全关键场景"
  },
  "zh-CN": {
    "what-is-hmac": "什么是 HMAC？",
    "what-is-hmac-description": "HMAC（基于哈希的消息认证码）是一种加密机制，它将密钥与哈希函数结合，用于验证消息的数据完整性和真实性。\n\n**工作原理：**\n1. 密钥与消息组合\n2. 哈希函数（如 SHA-256）处理组合后的数据\n3. 生成固定长度的认证码\n\n**常见用途：**\n- **API 认证**：签名 API 请求以验证发送者身份\n- **JWT 令牌**：用于 HS256/HS384/HS512 算法\n- **消息验证**：确保数据未被篡改\n- **Webhook 签名**：验证 webhook 负载\n\n**安全提示：**\n- 始终使用强随机密钥\n- 保持密钥的机密性\n- 新应用推荐使用 SHA-256 或更高版本\n- SHA-1 被认为较弱，应避免用于安全关键场景"
  },
  "zh-TW": {
    "what-is-hmac": "什麼是 HMAC？",
    "what-is-hmac-description": "HMAC（基於雜湊的訊息驗證碼）是一種加密機制，它將密鑰與雜湊函數結合，用於驗證訊息的資料完整性和真實性。\n\n**工作原理：**\n1. 密鑰與訊息組合\n2. 雜湊函數（如 SHA-256）處理組合後的資料\n3. 產生固定長度的驗證碼\n\n**常見用途：**\n- **API 認證**：簽署 API 請求以驗證傳送者身分\n- **JWT 權杖**：用於 HS256/HS384/HS512 演算法\n- **訊息驗證**：確保資料未被竄改\n- **Webhook 簽章**：驗證 webhook 負載\n\n**安全提示：**\n- 始終使用強隨機密鑰\n- 保持密鑰的機密性\n- 新應用推薦使用 SHA-256 或更高版本\n- SHA-1 被認為較弱，應避免用於安全關鍵場景"
  },
  "zh-HK": {
    "what-is-hmac": "什麼是 HMAC？",
    "what-is-hmac-description": "HMAC（基於雜湊的訊息驗證碼）是一種加密機制，它將密鑰與雜湊函數結合，用於驗證訊息的資料完整性和真實性。\n\n**工作原理：**\n1. 密鑰與訊息組合\n2. 雜湊函數（如 SHA-256）處理組合後的資料\n3. 產生固定長度的驗證碼\n\n**常見用途：**\n- **API 認證**：簽署 API 請求以驗證傳送者身分\n- **JWT 權杖**：用於 HS256/HS384/HS512 演算法\n- **訊息驗證**：確保資料未被竄改\n- **Webhook 簽章**：驗證 webhook 負載\n\n**安全提示：**\n- 始終使用強隨機密鑰\n- 保持密鑰的機密性\n- 新應用推薦使用 SHA-256 或更高版本\n- SHA-1 被認為較弱，應避免用於安全關鍵場景"
  },
  "es": {
    "what-is-hmac": "¿Qué es HMAC?",
    "what-is-hmac-description": "HMAC (Código de Autenticación de Mensajes basado en Hash) es un mecanismo criptográfico que combina una clave secreta con una función hash para verificar tanto la integridad como la autenticidad de un mensaje.\n\n**Cómo funciona:**\n1. La clave secreta se combina con el mensaje\n2. Una función hash (como SHA-256) procesa los datos combinados\n3. El resultado es un código de autenticación de tamaño fijo\n\n**Casos de uso comunes:**\n- **Autenticación de API**: Firmar solicitudes de API para verificar el remitente\n- **Tokens JWT**: Utilizado en algoritmos HS256/HS384/HS512\n- **Verificación de Mensajes**: Asegurar que los datos no han sido manipulados\n- **Firmas de Webhook**: Validar cargas útiles de webhook\n\n**Notas de seguridad:**\n- Siempre use una clave secreta fuerte y aleatoria\n- Mantenga su clave secreta confidencial\n- Se recomienda SHA-256 o superior para nuevas aplicaciones\n- SHA-1 se considera débil y debe evitarse para usos críticos de seguridad"
  },
  "fr": {
    "what-is-hmac": "Qu'est-ce que HMAC ?",
    "what-is-hmac-description": "HMAC (Code d'Authentification de Message basé sur le Hachage) est un mécanisme cryptographique qui combine une clé secrète avec une fonction de hachage pour vérifier à la fois l'intégrité et l'authenticité d'un message.\n\n**Comment ça fonctionne :**\n1. La clé secrète est combinée avec le message\n2. Une fonction de hachage (comme SHA-256) traite les données combinées\n3. Le résultat est un code d'authentification de taille fixe\n\n**Cas d'usage courants :**\n- **Authentification API**: Signature des requêtes API pour vérifier l'expéditeur\n- **Jetons JWT**: Utilisé dans les algorithmes HS256/HS384/HS512\n- **Vérification de Message**: S'assurer que les données n'ont pas été altérées\n- **Signatures Webhook**: Validation des charges utiles de webhook\n\n**Notes de sécurité :**\n- Utilisez toujours une clé secrète forte et aléatoire\n- Gardez votre clé secrète confidentielle\n- SHA-256 ou supérieur est recommandé pour les nouvelles applications\n- SHA-1 est considéré comme faible et devrait être évité pour les usages critiques en sécurité"
  },
  "de": {
    "what-is-hmac": "Was ist HMAC?",
    "what-is-hmac-description": "HMAC (Hash-based Message Authentication Code) ist ein kryptografischer Mechanismus, der einen geheimen Schlüssel mit einer Hash-Funktion kombiniert, um sowohl die Datenintegrität als auch die Authentizität einer Nachricht zu verifizieren.\n\n**Wie es funktioniert:**\n1. Der geheime Schlüssel wird mit der Nachricht kombiniert\n2. Eine Hash-Funktion (wie SHA-256) verarbeitet die kombinierten Daten\n3. Das Ergebnis ist ein Authentifizierungscode fester Größe\n\n**Häufige Anwendungsfälle:**\n- **API-Authentifizierung**: Signierung von API-Anfragen zur Überprüfung des Absenders\n- **JWT-Tokens**: Verwendet in HS256/HS384/HS512-Algorithmen\n- **Nachrichtenverifizierung**: Sicherstellen, dass Daten nicht manipuliert wurden\n- **Webhook-Signaturen**: Validierung von Webhook-Payloads\n\n**Sicherheitshinweise:**\n- Verwenden Sie immer einen starken, zufälligen geheimen Schlüssel\n- Halten Sie Ihren geheimen Schlüssel vertraulich\n- SHA-256 oder höher wird für neue Anwendungen empfohlen\n- SHA-1 gilt als schwach und sollte für sicherheitskritische Zwecke vermieden werden"
  },
  "it": {
    "what-is-hmac": "Cos'è HMAC?",
    "what-is-hmac-description": "HMAC (Hash-based Message Authentication Code) è un meccanismo crittografico che combina una chiave segreta con una funzione hash per verificare sia l'integrità che l'autenticità di un messaggio.\n\n**Come funziona:**\n1. La chiave segreta viene combinata con il messaggio\n2. Una funzione hash (come SHA-256) elabora i dati combinati\n3. Il risultato è un codice di autenticazione di dimensione fissa\n\n**Casi d'uso comuni:**\n- **Autenticazione API**: Firma delle richieste API per verificare il mittente\n- **Token JWT**: Utilizzato negli algoritmi HS256/HS384/HS512\n- **Verifica del Messaggio**: Garantire che i dati non siano stati manomessi\n- **Firme Webhook**: Validazione dei payload webhook\n\n**Note sulla sicurezza:**\n- Utilizzare sempre una chiave segreta forte e casuale\n- Mantenere la chiave segreta riservata\n- SHA-256 o superiore è consigliato per le nuove applicazioni\n- SHA-1 è considerato debole e dovrebbe essere evitato per usi critici di sicurezza"
  },
  "ja": {
    "what-is-hmac": "HMAC とは？",
    "what-is-hmac-description": "HMAC（ハッシュベースメッセージ認証コード）は、秘密鍵とハッシュ関数を組み合わせてメッセージのデータ整合性と真正性の両方を検証する暗号化メカニズムです。\n\n**仕組み：**\n1. 秘密鍵とメッセージを組み合わせます\n2. ハッシュ関数（SHA-256 など）が組み合わせたデータを処理します\n3. 結果は固定サイズの認証コードになります\n\n**一般的な使用例：**\n- **API 認証**：送信者を検証するための API リクエストの署名\n- **JWT トークン**：HS256/HS384/HS512 アルゴリズムで使用\n- **メッセージ検証**：データが改ざんされていないことを確認\n- **Webhook 署名**：webhook ペイロードの検証\n\n**セキュリティに関する注意：**\n- 常に強力でランダムな秘密鍵を使用してください\n- 秘密鍵を機密に保ってください\n- 新しいアプリケーションには SHA-256 以上が推奨されます\n- SHA-1 は弱いと考えられており、セキュリティ上重要な用途では避けるべきです"
  },
  "ko": {
    "what-is-hmac": "HMAC이란 무엇인가요?",
    "what-is-hmac-description": "HMAC (해시 기반 메시지 인증 코드)은 비밀 키와 해시 함수를 결합하여 메시지의 데이터 무결성과 진위성을 모두 검증하는 암호화 메커니즘입니다.\n\n**작동 방식:**\n1. 비밀 키가 메시지와 결합됩니다\n2. 해시 함수 (예: SHA-256)가 결합된 데이터를 처리합니다\n3. 결과는 고정 크기의 인증 코드입니다\n\n**일반적인 사용 사례:**\n- **API 인증**: 발신자를 확인하기 위해 API 요청 서명\n- **JWT 토큰**: HS256/HS384/HS512 알고리즘에서 사용\n- **메시지 검증**: 데이터가 변조되지 않았는지 확인\n- **Webhook 서명**: webhook 페이로드 검증\n\n**보안 참고 사항:**\n- 항상 강력하고 무작위적인 비밀 키를 사용하세요\n- 비밀 키를 기밀로 유지하세요\n- 새로운 애플리케이션에는 SHA-256 이상이 권장됩니다\n- SHA-1은 약한 것으로 간주되며 보안에 중요한 용도에는 사용하지 않아야 합니다"
  },
  "ru": {
    "what-is-hmac": "Что такое HMAC?",
    "what-is-hmac-description": "HMAC (код аутентификации сообщений на основе хеша) — это криптографический механизм, который объединяет секретный ключ с хеш-функцией для проверки как целостности, так и подлинности сообщения.\n\n**Как это работает:**\n1. Секретный ключ объединяется с сообщением\n2. Хеш-функция (например, SHA-256) обрабатывает объединенные данные\n3. Результатом является код аутентификации фиксированного размера\n\n**Распространенные случаи использования:**\n- **Аутентификация API**: Подпись API-запросов для проверки отправителя\n- **JWT-токены**: Используется в алгоритмах HS256/HS384/HS512\n- **Проверка сообщений**: Гарантия того, что данные не были изменены\n- **Подписи вебхуков**: Проверка полезной нагрузки вебхуков\n\n**Примечания по безопасности:**\n- Всегда используйте надежный случайный секретный ключ\n- Храните свой секретный ключ в тайне\n- Для новых приложений рекомендуется SHA-256 или выше\n- SHA-1 считается слабым и его следует избегать для критичных по безопасности применений"
  },
  "pt": {
    "what-is-hmac": "O que é HMAC?",
    "what-is-hmac-description": "HMAC (Código de Autenticação de Mensagem baseado em Hash) é um mecanismo criptográfico que combina uma chave secreta com uma função hash para verificar tanto a integridade quanto a autenticidade de uma mensagem.\n\n**Como funciona:**\n1. A chave secreta é combinada com a mensagem\n2. Uma função hash (como SHA-256) processa os dados combinados\n3. O resultado é um código de autenticação de tamanho fixo\n\n**Casos de uso comuns:**\n- **Autenticação de API**: Assinatura de solicitações de API para verificar o remetente\n- **Tokens JWT**: Usado em algoritmos HS256/HS384/HS512\n- **Verificação de Mensagem**: Garantir que os dados não foram adulterados\n- **Assinaturas de Webhook**: Validação de payloads de webhook\n\n**Notas de segurança:**\n- Sempre use uma chave secreta forte e aleatória\n- Mantenha sua chave secreta confidencial\n- SHA-256 ou superior é recomendado para novas aplicações\n- SHA-1 é considerado fraco e deve ser evitado para usos críticos de segurança"
  },
  "ar": {
    "what-is-hmac": "ما هو HMAC؟",
    "what-is-hmac-description": "HMAC (رمز المصادقة على الرسائل المستند إلى التجزئة) هو آلية تشفير تجمع بين مفتاح سري ودالة تجزئة للتحقق من سلامة البيانات وصحة الرسالة.\n\n**كيف يعمل:**\n1. يتم دمج المفتاح السري مع الرسالة\n2. تقوم دالة التجزئة (مثل SHA-256) بمعالجة البيانات المدمجة\n3. النتيجة هي رمز مصادقة ذو حجم ثابت\n\n**حالات الاستخدام الشائعة:**\n- **مصادقة API**: توقيع طلبات API للتحقق من المرسل\n- **رموز JWT**: يُستخدم في خوارزميات HS256/HS384/HS512\n- **التحقق من الرسائل**: التأكد من عدم العبث بالبيانات\n- **توقيعات Webhook**: التحقق من صحة حمولات webhook\n\n**ملاحظات أمنية:**\n- استخدم دائمًا مفتاحًا سريًا قويًا وعشوائيًا\n- حافظ على سرية مفتاحك السري\n- يُوصى باستخدام SHA-256 أو أعلى للتطبيقات الجديدة\n- يُعتبر SHA-1 ضعيفًا ويجب تجنبه للاستخدامات الحرجة أمنيًا"
  },
  "hi": {
    "what-is-hmac": "HMAC क्या है?",
    "what-is-hmac-description": "HMAC (हैश-आधारित संदेश प्रमाणीकरण कोड) एक क्रिप्टोग्राफिक तंत्र है जो किसी संदेश की डेटा अखंडता और प्रामाणिकता दोनों को सत्यापित करने के लिए एक गुप्त कुंजी को हैश फ़ंक्शन के साथ जोड़ता है।\n\n**यह कैसे काम करता है:**\n1. गुप्त कुंजी को संदेश के साथ जोड़ा जाता है\n2. एक हैश फ़ंक्शन (जैसे SHA-256) संयुक्त डेटा को संसाधित करता है\n3. परिणाम एक निश्चित आकार का प्रमाणीकरण कोड है\n\n**सामान्य उपयोग के मामले:**\n- **API प्रमाणीकरण**: प्रेषक को सत्यापित करने के लिए API अनुरोधों पर हस्ताक्षर करना\n- **JWT टोकन**: HS256/HS384/HS512 एल्गोरिदम में उपयोग किया जाता है\n- **संदेश सत्यापन**: यह सुनिश्चित करना कि डेटा के साथ छेड़छाड़ नहीं की गई है\n- **Webhook हस्ताक्षर**: webhook पेलोड को मान्य करना\n\n**सुरक्षा नोट्स:**\n- हमेशा एक मजबूत, यादृच्छिक गुप्त कुंजी का उपयोग करें\n- अपनी गुप्त कुंजी को गोपनीय रखें\n- नए अनुप्रयोगों के लिए SHA-256 या उच्चतर की सिफारिश की जाती है\n- SHA-1 को कमजोर माना जाता है और सुरक्षा-महत्वपूर्ण उपयोगों के लिए इससे बचना चाहिए"
  },
  "tr": {
    "what-is-hmac": "HMAC nedir?",
    "what-is-hmac-description": "HMAC (Hash Tabanlı Mesaj Kimlik Doğrulama Kodu), bir mesajın hem veri bütünlüğünü hem de özgünlüğünü doğrulamak için gizli bir anahtarı bir hash fonksiyonu ile birleştiren kriptografik bir mekanizmadır.\n\n**Nasıl çalışır:**\n1. Gizli anahtar mesajla birleştirilir\n2. Bir hash fonksiyonu (SHA-256 gibi) birleştirilmiş verileri işler\n3. Sonuç, sabit boyutlu bir kimlik doğrulama kodudur\n\n**Yaygın kullanım durumları:**\n- **API Kimlik Doğrulaması**: Göndereni doğrulamak için API isteklerini imzalama\n- **JWT Token'ları**: HS256/HS384/HS512 algoritmalarında kullanılır\n- **Mesaj Doğrulama**: Verilerin kurcalanmadığından emin olma\n- **Webhook İmzaları**: Webhook yüklerini doğrulama\n\n**Güvenlik notları:**\n- Her zaman güçlü, rastgele bir gizli anahtar kullanın\n- Gizli anahtarınızı gizli tutun\n- Yeni uygulamalar için SHA-256 veya üzeri önerilir\n- SHA-1 zayıf kabul edilir ve güvenlik açısından kritik kullanımlar için kaçınılmalıdır"
  },
  "nl": {
    "what-is-hmac": "Wat is HMAC?",
    "what-is-hmac-description": "HMAC (Hash-based Message Authentication Code) is een cryptografisch mechanisme dat een geheime sleutel combineert met een hash-functie om zowel de data-integriteit als de authenticiteit van een bericht te verifiëren.\n\n**Hoe het werkt:**\n1. De geheime sleutel wordt gecombineerd met het bericht\n2. Een hash-functie (zoals SHA-256) verwerkt de gecombineerde gegevens\n3. Het resultaat is een authenticatiecode van vaste grootte\n\n**Veelvoorkomende gebruikssituaties:**\n- **API-authenticatie**: Ondertekening van API-verzoeken om de afzender te verifiëren\n- **JWT-tokens**: Gebruikt in HS256/HS384/HS512-algoritmen\n- **Berichtverificatie**: Zorgen dat gegevens niet zijn gemanipuleerd\n- **Webhook-handtekeningen**: Validatie van webhook-payloads\n\n**Beveiligingsnotities:**\n- Gebruik altijd een sterke, willekeurige geheime sleutel\n- Houd uw geheime sleutel vertrouwelijk\n- SHA-256 of hoger wordt aanbevolen voor nieuwe applicaties\n- SHA-1 wordt als zwak beschouwd en moet worden vermeden voor beveiligingskritische toepassingen"
  },
  "sv": {
    "what-is-hmac": "Vad är HMAC?",
    "what-is-hmac-description": "HMAC (Hash-based Message Authentication Code) är en kryptografisk mekanism som kombinerar en hemlig nyckel med en hashfunktion för att verifiera både dataintegritet och äkthet hos ett meddelande.\n\n**Hur det fungerar:**\n1. Den hemliga nyckeln kombineras med meddelandet\n2. En hashfunktion (som SHA-256) bearbetar den kombinerade datan\n3. Resultatet är en autentiseringskod med fast storlek\n\n**Vanliga användningsfall:**\n- **API-autentisering**: Signering av API-förfrågningar för att verifiera avsändaren\n- **JWT-tokens**: Används i HS256/HS384/HS512-algoritmer\n- **Meddelandeverifiering**: Säkerställa att data inte har manipulerats\n- **Webhook-signaturer**: Validering av webhook-nyttolaster\n\n**Säkerhetsanteckningar:**\n- Använd alltid en stark, slumpmässig hemlig nyckel\n- Håll din hemliga nyckel konfidentiell\n- SHA-256 eller högre rekommenderas för nya applikationer\n- SHA-1 anses vara svag och bör undvikas för säkerhetskritiska användningsområden"
  },
  "pl": {
    "what-is-hmac": "Co to jest HMAC?",
    "what-is-hmac-description": "HMAC (kod uwierzytelniania wiadomości oparty na hashu) to mechanizm kryptograficzny, który łączy tajny klucz z funkcją hash w celu weryfikacji zarówno integralności danych, jak i autentyczności wiadomości.\n\n**Jak to działa:**\n1. Tajny klucz jest łączony z wiadomością\n2. Funkcja hash (jak SHA-256) przetwarza połączone dane\n3. Wynikiem jest kod uwierzytelniający o stałym rozmiarze\n\n**Typowe przypadki użycia:**\n- **Uwierzytelnianie API**: Podpisywanie żądań API w celu weryfikacji nadawcy\n- **Tokeny JWT**: Używane w algorytmach HS256/HS384/HS512\n- **Weryfikacja wiadomości**: Zapewnienie, że dane nie zostały zmanipulowane\n- **Podpisy webhook**: Walidacja ładunków webhook\n\n**Uwagi dotyczące bezpieczeństwa:**\n- Zawsze używaj silnego, losowego tajnego klucza\n- Zachowaj poufność swojego tajnego klucza\n- SHA-256 lub wyższe jest zalecane dla nowych aplikacji\n- SHA-1 jest uważany za słaby i powinien być unikany w zastosowaniach krytycznych dla bezpieczeństwa"
  },
  "vi": {
    "what-is-hmac": "HMAC là gì?",
    "what-is-hmac-description": "HMAC (Mã xác thực thông điệp dựa trên Hash) là một cơ chế mật mã kết hợp khóa bí mật với hàm băm để xác minh cả tính toàn vẹn dữ liệu và tính xác thực của tin nhắn.\n\n**Cách hoạt động:**\n1. Khóa bí mật được kết hợp với tin nhắn\n2. Một hàm băm (như SHA-256) xử lý dữ liệu kết hợp\n3. Kết quả là một mã xác thực có kích thước cố định\n\n**Các trường hợp sử dụng phổ biến:**\n- **Xác thực API**: Ký các yêu cầu API để xác minh người gửi\n- **Token JWT**: Được sử dụng trong các thuật toán HS256/HS384/HS512\n- **Xác minh Tin nhắn**: Đảm bảo dữ liệu không bị giả mạo\n- **Chữ ký Webhook**: Xác thực payload webhook\n\n**Lưu ý bảo mật:**\n- Luôn sử dụng khóa bí mật mạnh và ngẫu nhiên\n- Giữ khóa bí mật của bạn được bảo mật\n- SHA-256 hoặc cao hơn được khuyến nghị cho các ứng dụng mới\n- SHA-1 được coi là yếu và nên tránh sử dụng cho các mục đích bảo mật quan trọng"
  },
  "th": {
    "what-is-hmac": "HMAC คืออะไร?",
    "what-is-hmac-description": "HMAC (รหัสการตรวจสอบความถูกต้องของข้อความที่ใช้แฮช) เป็นกลไกการเข้ารหัสที่รวมคีย์ลับกับฟังก์ชันแฮชเพื่อตรวจสอบทั้งความสมบูรณ์ของข้อมูลและความถูกต้องของข้อความ\n\n**วิธีการทำงาน:**\n1. คีย์ลับถูกรวมกับข้อความ\n2. ฟังก์ชันแฮช (เช่น SHA-256) ประมวลผลข้อมูลที่รวมกัน\n3. ผลลัพธ์คือรหัสการตรวจสอบความถูกต้องขนาดคงที่\n\n**กรณีการใช้งานทั่วไป:**\n- **การตรวจสอบสิทธิ์ API**: การเซ็นคำขอ API เพื่อตรวจสอบผู้ส่ง\n- **โทเค็น JWT**: ใช้ในอัลกอริทึม HS256/HS384/HS512\n- **การตรวจสอบข้อความ**: ตรวจสอบให้แน่ใจว่าข้อมูลไม่ถูกแก้ไข\n- **ลายเซ็น Webhook**: ตรวจสอบความถูกต้องของเพย์โหลด webhook\n\n**ข้อควรระวังด้านความปลอดภัย:**\n- ใช้คีย์ลับที่แข็งแกร่งและสุ่มเสมอ\n- รักษาคีย์ลับของคุณให้เป็นความลับ\n- แนะนำให้ใช้ SHA-256 หรือสูงกว่าสำหรับแอปพลิเคชันใหม่\n- SHA-1 ถือว่าอ่อนแอและควรหลีกเลี่ยงสำหรับการใช้งานที่สำคัญด้านความปลอดภัย"
  },
  "id": {
    "what-is-hmac": "Apa itu HMAC?",
    "what-is-hmac-description": "HMAC (Hash-based Message Authentication Code) adalah mekanisme kriptografi yang menggabungkan kunci rahasia dengan fungsi hash untuk memverifikasi integritas data dan keaslian pesan.\n\n**Cara kerjanya:**\n1. Kunci rahasia digabungkan dengan pesan\n2. Fungsi hash (seperti SHA-256) memproses data gabungan\n3. Hasilnya adalah kode autentikasi berukuran tetap\n\n**Kasus penggunaan umum:**\n- **Autentikasi API**: Menandatangani permintaan API untuk memverifikasi pengirim\n- **Token JWT**: Digunakan dalam algoritma HS256/HS384/HS512\n- **Verifikasi Pesan**: Memastikan data tidak dirusak\n- **Tanda Tangan Webhook**: Memvalidasi payload webhook\n\n**Catatan keamanan:**\n- Selalu gunakan kunci rahasia yang kuat dan acak\n- Jaga kerahasiaan kunci rahasia Anda\n- SHA-256 atau lebih tinggi direkomendasikan untuk aplikasi baru\n- SHA-1 dianggap lemah dan harus dihindari untuk penggunaan kritis keamanan"
  },
  "he": {
    "what-is-hmac": "מה זה HMAC?",
    "what-is-hmac-description": "HMAC (קוד אימות הודעות מבוסס Hash) הוא מנגנון קריפטוגרפי המשלב מפתח סודי עם פונקציית hash כדי לאמת הן את שלמות הנתונים והן את האותנטיות של הודעה.\n\n**איך זה עובד:**\n1. המפתח הסודי משולב עם ההודעה\n2. פונקציית hash (כמו SHA-256) מעבדת את הנתונים המשולבים\n3. התוצאה היא קוד אימות בגודל קבוע\n\n**מקרי שימוש נפוצים:**\n- **אימות API**: חתימה על בקשות API לאימות השולח\n- **טוקני JWT**: נעשה שימוש באלגוריתמים HS256/HS384/HS512\n- **אימות הודעה**: הבטחה שהנתונים לא שונו\n- **חתימות Webhook**: אימות מטענים של webhook\n\n**הערות אבטחה:**\n- תמיד השתמש במפתח סודי חזק ואקראי\n- שמור על סודיות המפתח הסודי שלך\n- SHA-256 או גבוה יותר מומלץ עבור יישומים חדשים\n- SHA-1 נחשב חלש ויש להימנע ממנו לשימושים קריטיים לאבטחה"
  },
  "ms": {
    "what-is-hmac": "Apakah HMAC?",
    "what-is-hmac-description": "HMAC (Kod Pengesahan Mesej berasaskan Hash) ialah mekanisme kriptografi yang menggabungkan kunci rahsia dengan fungsi hash untuk mengesahkan kedua-dua integriti data dan ketulenan mesej.\n\n**Cara ia berfungsi:**\n1. Kunci rahsia digabungkan dengan mesej\n2. Fungsi hash (seperti SHA-256) memproses data gabungan\n3. Hasilnya adalah kod pengesahan bersaiz tetap\n\n**Kes penggunaan biasa:**\n- **Pengesahan API**: Menandatangani permintaan API untuk mengesahkan penghantar\n- **Token JWT**: Digunakan dalam algoritma HS256/HS384/HS512\n- **Pengesahan Mesej**: Memastikan data tidak diusik\n- **Tandatangan Webhook**: Mengesahkan muatan webhook\n\n**Nota keselamatan:**\n- Sentiasa gunakan kunci rahsia yang kuat dan rawak\n- Simpan kunci rahsia anda dengan selamat\n- SHA-256 atau lebih tinggi disyorkan untuk aplikasi baru\n- SHA-1 dianggap lemah dan harus dielakkan untuk kegunaan kritikal keselamatan"
  },
  "no": {
    "what-is-hmac": "Hva er HMAC?",
    "what-is-hmac-description": "HMAC (Hash-based Message Authentication Code) er en kryptografisk mekanisme som kombinerer en hemmelig nøkkel med en hash-funksjon for å verifisere både dataintegritet og autentisitet til en melding.\n\n**Hvordan det fungerer:**\n1. Den hemmelige nøkkelen kombineres med meldingen\n2. En hash-funksjon (som SHA-256) behandler de kombinerte dataene\n3. Resultatet er en autentiseringskode med fast størrelse\n\n**Vanlige brukstilfeller:**\n- **API-autentisering**: Signering av API-forespørsler for å verifisere avsenderen\n- **JWT-tokens**: Brukt i HS256/HS384/HS512-algoritmer\n- **Meldingsverifisering**: Sikre at data ikke har blitt manipulert\n- **Webhook-signaturer**: Validering av webhook-payloads\n\n**Sikkerhetsmerknader:**\n- Bruk alltid en sterk, tilfeldig hemmelig nøkkel\n- Hold din hemmelige nøkkel konfidensiell\n- SHA-256 eller høyere anbefales for nye applikasjoner\n- SHA-1 anses som svak og bør unngås for sikkerhetskritiske bruksområder"
  }
}
</i18n>
