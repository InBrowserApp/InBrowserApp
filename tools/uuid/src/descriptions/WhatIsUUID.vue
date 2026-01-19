<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <i18n-t keypath="description">
      <template #uuid>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-text code>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</n-text>
      </template>
    </i18n-t>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is UUID?",
    "description": "A UUID (Universally Unique Identifier) is a 128-bit identifier that is designed to be unique across space and time. It is represented as {uuid}. UUIDs are used to uniquely identify information in computer systems without requiring a central registration authority. They are commonly used in databases, distributed systems, and software applications to ensure unique identification of resources, objects, or records. UUIDs are particularly useful in distributed systems where multiple systems need to generate unique identifiers independently."
  },
  "zh": {
    "title": "什么是 UUID？",
    "description": "UUID（通用唯一标识符）是一个 128 位的标识符，设计用于在空间和时间上保持唯一性。它表示为 {uuid}。UUID 用于在计算机系统中唯一标识信息，无需中央注册机构。它们通常用于数据库、分布式系统和软件应用程序，以确保资源、对象或记录的唯一标识。UUID 在分布式系统中特别有用，因为多个系统需要独立生成唯一标识符。"
  },
  "zh-CN": {
    "title": "什么是 UUID？",
    "description": "UUID（通用唯一标识符）是一个 128 位的标识符，设计用于在空间和时间上保持唯一性。它表示为 {uuid}。UUID 用于在计算机系统中唯一标识信息，无需中央注册机构。它们通常用于数据库、分布式系统和软件应用程序，以确保资源、对象或记录的唯一标识。UUID 在分布式系统中特别有用，因为多个系统需要独立生成唯一标识符。"
  },
  "zh-TW": {
    "title": "什麼是 UUID？",
    "description": "UUID（通用唯一識別碼）是一個 128 位的識別碼，設計用於在空間和時間上保持唯一性。它表示為 {uuid}。UUID 用於在計算機系統中唯一識別信息，無需中央註冊機構。它們通常用於數據庫、分佈式系統和軟件應用程序，以確保資源、對象或記錄的唯一識別。UUID 在分佈式系統中特別有用，因為多個系統需要獨立生成唯一識別碼。"
  },
  "zh-HK": {
    "title": "什麼是 UUID？",
    "description": "UUID（通用唯一識別碼）是一個 128 位的識別碼，設計用於在空間和時間上保持唯一性。它表示為 {uuid}。UUID 用於在計算機系統中唯一識別信息，無需中央註冊機構。它們通常用於數據庫、分佈式系統和軟件應用程序，以確保資源、對象或記錄的唯一識別。UUID 在分佈式系統中特別有用，因為多個系統需要獨立生成唯一識別碼。"
  },
  "es": {
    "title": "¿Qué es UUID?",
    "description": "Un UUID (Identificador Único Universal) es un identificador de 128 bits diseñado para ser único en el espacio y el tiempo. Se representa como {uuid}. Los UUID se utilizan para identificar de forma única la información en sistemas informáticos sin necesidad de una autoridad central de registro. Se utilizan comúnmente en bases de datos, sistemas distribuidos y aplicaciones de software para garantizar la identificación única de recursos, objetos o registros. Los UUID son particularmente útiles en sistemas distribuidos donde múltiples sistemas necesitan generar identificadores únicos de forma independiente."
  },
  "fr": {
    "title": "Qu'est-ce que UUID ?",
    "description": "Un UUID (Identifiant Unique Universel) est un identifiant de 128 bits conçu pour être unique dans l'espace et le temps. Il est représenté comme {uuid}. Les UUID sont utilisés pour identifier de manière unique les informations dans les systèmes informatiques sans nécessiter d'autorité centrale d'enregistrement. Ils sont couramment utilisés dans les bases de données, les systèmes distribués et les applications logicielles pour garantir l'identification unique des ressources, objets ou enregistrements. Les UUID sont particulièrement utiles dans les systèmes distribués où plusieurs systèmes doivent générer des identifiants uniques de manière indépendante."
  },
  "de": {
    "title": "Was ist UUID?",
    "description": "Eine UUID (Universally Unique Identifier) ist ein 128-Bit-Identifikator, der so konzipiert ist, dass er im Raum und in der Zeit eindeutig ist. Sie wird als {uuid} dargestellt. UUIDs werden verwendet, um Informationen in Computersystemen eindeutig zu identifizieren, ohne dass eine zentrale Registrierungsstelle erforderlich ist. Sie werden häufig in Datenbanken, verteilten Systemen und Softwareanwendungen verwendet, um die eindeutige Identifizierung von Ressourcen, Objekten oder Datensätzen zu gewährleisten. UUIDs sind besonders nützlich in verteilten Systemen, in denen mehrere Systeme unabhängig voneinander eindeutige Identifikatoren generieren müssen."
  },
  "it": {
    "title": "Cos'è UUID?",
    "description": "Un UUID (Identificatore Universale Unico) è un identificatore a 128 bit progettato per essere unico nello spazio e nel tempo. È rappresentato come {uuid}. Gli UUID vengono utilizzati per identificare in modo univoco le informazioni nei sistemi informatici senza richiedere un'autorità centrale di registrazione. Sono comunemente utilizzati in database, sistemi distribuiti e applicazioni software per garantire l'identificazione univoca di risorse, oggetti o record. Gli UUID sono particolarmente utili nei sistemi distribuiti dove più sistemi devono generare identificatori univoci in modo indipendente."
  },
  "ja": {
    "title": "UUIDとは？",
    "description": "UUID（Universally Unique Identifier）は、空間と時間において一意であるように設計された128ビットの識別子です。{uuid}として表されます。UUIDは、中央登録機関を必要とせずに、コンピュータシステム内の情報を一意に識別するために使用されます。データベース、分散システム、ソフトウェアアプリケーションで一般的に使用され、リソース、オブジェクト、またはレコードの一意の識別を保証します。UUIDは、複数のシステムが独立して一意の識別子を生成する必要がある分散システムで特に有用です。"
  },
  "ko": {
    "title": "UUID란?",
    "description": "UUID(Universally Unique Identifier)는 공간과 시간에서 고유하도록 설계된 128비트 식별자입니다. {uuid}로 표현됩니다. UUID는 중앙 등록 기관 없이 컴퓨터 시스템에서 정보를 고유하게 식별하는 데 사용됩니다. 데이터베이스, 분산 시스템 및 소프트웨어 애플리케이션에서 일반적으로 사용되어 리소스, 객체 또는 레코드의 고유 식별을 보장합니다. UUID는 여러 시스템이 독립적으로 고유 식별자를 생성해야 하는 분산 시스템에서 특히 유용합니다."
  },
  "ru": {
    "title": "Что такое UUID?",
    "description": "UUID (Universally Unique Identifier) - это 128-битный идентификатор, разработанный для обеспечения уникальности в пространстве и времени. Он представляется как {uuid}. UUID используются для уникальной идентификации информации в компьютерных системах без необходимости центрального органа регистрации. Они обычно используются в базах данных, распределенных системах и программных приложениях для обеспечения уникальной идентификации ресурсов, объектов или записей. UUID особенно полезны в распределенных системах, где несколько систем должны независимо генерировать уникальные идентификаторы."
  },
  "pt": {
    "title": "O que é UUID?",
    "description": "Um UUID (Identificador Único Universal) é um identificador de 128 bits projetado para ser único no espaço e no tempo. É representado como {uuid}. UUIDs são usados para identificar de forma única informações em sistemas de computador sem a necessidade de uma autoridade central de registro. Eles são comumente usados em bancos de dados, sistemas distribuídos e aplicações de software para garantir a identificação única de recursos, objetos ou registros. UUIDs são particularmente úteis em sistemas distribuídos onde múltiplos sistemas precisam gerar identificadores únicos de forma independente."
  },
  "ar": {
    "title": "ما هو UUID؟",
    "description": "UUID (المعرف الفريد العالمي) هو معرف 128 بت مصمم ليكون فريدًا في المكان والزمان. يتم تمثيله كـ {uuid}. يتم استخدام UUID لتحديد المعلومات بشكل فريد في أنظمة الكمبيوتر دون الحاجة إلى سلطة تسجيل مركزية. يتم استخدامها بشكل شائع في قواعد البيانات والأنظمة الموزعة وتطبيقات البرمجيات لضمان التعريف الفريد للموارد أو الكائنات أو السجلات. UUID مفيدة بشكل خاص في الأنظمة الموزعة حيث تحتاج أنظمة متعددة إلى إنشاء معرفات فريدة بشكل مستقل."
  },
  "hi": {
    "title": "UUID क्या है?",
    "description": "UUID (यूनिवर्सली यूनीक आइडेंटिफायर) एक 128-बिट आइडेंटिफायर है जो स्पेस और टाइम में यूनीक होने के लिए डिज़ाइन किया गया है। इसे {uuid} के रूप में दर्शाया जाता है। UUID का उपयोग कंप्यूटर सिस्टम में जानकारी को यूनीकली आइडेंटिफाई करने के लिए किया जाता है, बिना किसी सेंट्रल रजिस्ट्रेशन अथॉरिटी की आवश्यकता के। इनका उपयोग आमतौर पर डेटाबेस, डिस्ट्रीब्यूटेड सिस्टम और सॉफ्टवेयर एप्लिकेशन में रिसोर्स, ऑब्जेक्ट या रिकॉर्ड की यूनीक आइडेंटिफिकेशन सुनिश्चित करने के लिए किया जाता है। UUID विशेष रूप से डिस्ट्रीब्यूटेड सिस्टम में उपयोगी होते हैं जहां कई सिस्टम को स्वतंत्र रूप से यूनीक आइडेंटिफायर जनरेट करने की आवश्यकता होती है।"
  },
  "tr": {
    "title": "UUID nedir?",
    "description": "UUID (Evrensel Benzersiz Tanımlayıcı), uzay ve zamanda benzersiz olacak şekilde tasarlanmış 128 bitlik bir tanımlayıcıdır. {uuid} olarak temsil edilir. UUID'ler, merkezi bir kayıt otoritesine ihtiyaç duymadan bilgisayar sistemlerindeki bilgileri benzersiz şekilde tanımlamak için kullanılır. Kaynakların, nesnelerin veya kayıtların benzersiz tanımlanmasını sağlamak için veritabanlarında, dağıtık sistemlerde ve yazılım uygulamalarında yaygın olarak kullanılırlar. UUID'ler, birden fazla sistemin bağımsız olarak benzersiz tanımlayıcılar oluşturması gereken dağıtık sistemlerde özellikle faydalıdır."
  },
  "nl": {
    "title": "Wat is UUID?",
    "description": "Een UUID (Universally Unique Identifier) is een 128-bits identificatiecode die is ontworpen om uniek te zijn in ruimte en tijd. Het wordt weergegeven als {uuid}. UUID's worden gebruikt om informatie in computersystemen uniek te identificeren zonder dat er een centrale registratieautoriteit nodig is. Ze worden veel gebruikt in databases, gedistribueerde systemen en softwaretoepassingen om unieke identificatie van resources, objecten of records te garanderen. UUID's zijn vooral nuttig in gedistribueerde systemen waar meerdere systemen onafhankelijk unieke identificatiecodes moeten genereren."
  },
  "sv": {
    "title": "Vad är UUID?",
    "description": "En UUID (Universally Unique Identifier) är en 128-bitars identifierare som är utformad för att vara unik i rum och tid. Den representeras som {uuid}. UUID:er används för att unikt identifiera information i datorsystem utan att kräva en central registreringsmyndighet. De används vanligtvis i databaser, distribuerade system och programvaruapplikationer för att säkerställa unik identifiering av resurser, objekt eller poster. UUID:er är särskilt användbara i distribuerade system där flera system behöver generera unika identifierare oberoende av varandra."
  },
  "pl": {
    "title": "Co to jest UUID?",
    "description": "UUID (Universally Unique Identifier) to 128-bitowy identyfikator zaprojektowany tak, aby był unikalny w przestrzeni i czasie. Jest reprezentowany jako {uuid}. UUID są używane do unikalnej identyfikacji informacji w systemach komputerowych bez konieczności posiadania centralnego organu rejestracyjnego. Są powszechnie używane w bazach danych, systemach rozproszonych i aplikacjach oprogramowania do zapewnienia unikalnej identyfikacji zasobów, obiektów lub rekordów. UUID są szczególnie przydatne w systemach rozproszonych, gdzie wiele systemów musi niezależnie generować unikalne identyfikatory."
  },
  "vi": {
    "title": "UUID là gì?",
    "description": "UUID (Universally Unique Identifier) là một định danh 128-bit được thiết kế để duy nhất trong không gian và thời gian. Nó được biểu diễn dưới dạng {uuid}. UUID được sử dụng để định danh duy nhất thông tin trong hệ thống máy tính mà không cần cơ quan đăng ký trung tâm. Chúng thường được sử dụng trong cơ sở dữ liệu, hệ thống phân tán và ứng dụng phần mềm để đảm bảo định danh duy nhất của tài nguyên, đối tượng hoặc bản ghi. UUID đặc biệt hữu ích trong các hệ thống phân tán nơi nhiều hệ thống cần tạo định danh duy nhất một cách độc lập."
  },
  "th": {
    "title": "UUID คืออะไร?",
    "description": "UUID (Universally Unique Identifier) เป็นตัวระบุ 128 บิตที่ออกแบบมาให้ไม่ซ้ำกันในพื้นที่และเวลา แสดงเป็น {uuid} UUID ใช้เพื่อระบุข้อมูลในระบบคอมพิวเตอร์อย่างไม่ซ้ำกันโดยไม่ต้องมีหน่วยงานลงทะเบียนกลาง มักใช้ในฐานข้อมูล ระบบกระจาย และแอปพลิเคชันซอฟต์แวร์เพื่อรับประกันการระบุที่ไม่ซ้ำกันของทรัพยากร วัตถุ หรือบันทึก UUID มีประโยชน์อย่างยิ่งในระบบกระจายที่หลายระบบต้องสร้างตัวระบุที่ไม่ซ้ำกันอย่างอิสระ"
  },
  "id": {
    "title": "Apa itu UUID?",
    "description": "UUID (Universally Unique Identifier) adalah pengidentifikasi 128-bit yang dirancang untuk menjadi unik dalam ruang dan waktu. Ini direpresentasikan sebagai {uuid}. UUID digunakan untuk mengidentifikasi informasi secara unik dalam sistem komputer tanpa memerlukan otoritas pendaftaran pusat. Ini umumnya digunakan dalam database, sistem terdistribusi, dan aplikasi perangkat lunak untuk memastikan identifikasi unik dari sumber daya, objek, atau catatan. UUID sangat berguna dalam sistem terdistribusi di mana beberapa sistem perlu menghasilkan pengidentifikasi unik secara independen."
  },
  "he": {
    "title": "?UUID מהו",
    "description": "UUID (מזהה ייחודי אוניברסלי) הוא מזהה 128-ביט שתוכנן להיות ייחודי במרחב ובזמן. הוא מיוצג כ-{uuid}. UUID משמשים לזיהוי ייחודי של מידע במערכות מחשב ללא צורך בגוף רישום מרכזי. הם משמשים בדרך כלל במסדי נתונים, מערכות מבוזרות ואפליקציות תוכנה כדי להבטיח זיהוי ייחודי של משאבים, אובייקטים או רשומות. UUID שימושיים במיוחד במערכות מבוזרות שבהן מספר מערכות צריכות ליצור מזהים ייחודיים באופן עצמאי."
  },
  "ms": {
    "title": "Apakah UUID?",
    "description": "UUID (Universally Unique Identifier) ialah pengenalan 128-bit yang direka untuk menjadi unik dalam ruang dan masa. Ia diwakili sebagai {uuid}. UUID digunakan untuk mengenal pasti maklumat secara unik dalam sistem komputer tanpa memerlukan pihak berkuasa pendaftaran pusat. Ia biasanya digunakan dalam pangkalan data, sistem teragih dan aplikasi perisian untuk memastikan pengenalan unik sumber, objek atau rekod. UUID amat berguna dalam sistem teragih di mana beberapa sistem perlu menjana pengenalan unik secara bebas."
  },
  "no": {
    "title": "Hva er UUID?",
    "description": "En UUID (Universally Unique Identifier) er en 128-bits identifikator som er designet for å være unik i rom og tid. Den er representert som {uuid}. UUID-er brukes for å unikt identifisere informasjon i datasystemer uten å kreve en sentral registreringsmyndighet. De brukes vanligvis i databaser, distribuerte systemer og programvareapplikasjoner for å sikre unik identifikasjon av ressurser, objekter eller poster. UUID-er er spesielt nyttige i distribuerte systemer der flere systemer må generere unike identifikatorer uavhengig av hverandre."
  }
}
</i18n>
