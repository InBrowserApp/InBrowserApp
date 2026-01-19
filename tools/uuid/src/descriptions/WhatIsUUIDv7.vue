<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <i18n-t keypath="description">
      <template #uuid>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-text code>xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx</n-text>
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
    "title": "What is UUID v7?",
    "description": "UUID v7 is a 128-bit universally unique identifier that combines time-based and random components. It's typically represented as a 36-character string in the format {uuid}, where the 13th character is always \"7\" to indicate version 7. Unlike UUID v4, UUID v7 is time-ordered, making it suitable for use as a database primary key while maintaining global uniqueness. The first 48 bits contain a Unix timestamp in milliseconds, followed by random or sequence bits. This design provides both time-ordering and uniqueness, making it ideal for distributed systems where temporal ordering is important. UUID v7 is particularly useful for database records, event logging, and any system requiring both uniqueness and time-based sorting. Its time-ordered nature and guaranteed uniqueness make it a modern choice for many applications."
  },
  "zh": {
    "title": "什么是 UUID v7？",
    "description": "UUID v7 是一个结合了时间戳和随机组件的 128 位通用唯一标识符。它通常以 36 个字符的字符串形式表示，格式为 {uuid}，其中第 13 个字符始终为 \"7\" 表示版本 7。与 UUID v4 不同，UUID v7 是时间排序的，使其适合用作数据库主键，同时保持全局唯一性。前 48 位包含毫秒级的 Unix 时间戳，后跟随机或序列位。这种设计既提供了时间排序又保证了唯一性，使其成为需要时间排序的分布式系统的理想选择。UUID v7 特别适用于数据库记录、事件日志和任何需要唯一性和基于时间排序的系统。其时间排序特性和保证的唯一性使其成为许多应用的现代选择。"
  },
  "zh-CN": {
    "title": "什么是 UUID v7？",
    "description": "UUID v7 是一个结合了时间戳和随机组件的 128 位通用唯一标识符。它通常以 36 个字符的字符串形式表示，格式为 {uuid}，其中第 13 个字符始终为 \"7\" 表示版本 7。与 UUID v4 不同，UUID v7 是时间排序的，使其适合用作数据库主键，同时保持全局唯一性。前 48 位包含毫秒级的 Unix 时间戳，后跟随机或序列位。这种设计既提供了时间排序又保证了唯一性，使其成为需要时间排序的分布式系统的理想选择。UUID v7 特别适用于数据库记录、事件日志和任何需要唯一性和基于时间排序的系统。其时间排序特性和保证的唯一性使其成为许多应用的现代选择。"
  },
  "zh-TW": {
    "title": "什麼是 UUID v7？",
    "description": "UUID v7 是一個結合了時間戳和隨機組件的 128 位通用唯一識別碼。它通常以 36 個字元的字串形式表示，格式為 {uuid}，其中第 13 個字元始終為 \"7\" 表示版本 7。與 UUID v4 不同，UUID v7 是時間排序的，使其適合用作資料庫主鍵，同時保持全域唯一性。前 48 位包含毫秒級的 Unix 時間戳，後跟隨機或序列位。這種設計既提供了時間排序又保證了唯一性，使其成為需要時間排序的分散式系統的理想選擇。UUID v7 特別適用於資料庫記錄、事件日誌和任何需要唯一性和基於時間排序的系統。其時間排序特性和保證的唯一性使其成為許多應用的現代選擇。"
  },
  "zh-HK": {
    "title": "什麼是 UUID v7？",
    "description": "UUID v7 是一個結合了時間戳和隨機組件的 128 位通用唯一識別碼。它通常以 36 個字元的字串形式表示，格式為 {uuid}，其中第 13 個字元始終為 \"7\" 表示版本 7。與 UUID v4 不同，UUID v7 是時間排序的，使其適合用作資料庫主鍵，同時保持全域唯一性。前 48 位包含毫秒級的 Unix 時間戳，後跟隨機或序列位。這種設計既提供了時間排序又保證了唯一性，使其成為需要時間排序的分散式系統的理想選擇。UUID v7 特別適用於資料庫記錄、事件日誌和任何需要唯一性和基於時間排序的系統。其時間排序特性和保證的唯一性使其成為許多應用的現代選擇。"
  },
  "es": {
    "title": "¿Qué es UUID v7?",
    "description": "UUID v7 es un identificador único universal de 128 bits que combina componentes basados en tiempo y aleatorios. Típicamente se representa como una cadena de 36 caracteres en el formato {uuid}, donde el carácter 13 siempre es \"7\" para indicar la versión 7. A diferencia de UUID v4, UUID v7 está ordenado por tiempo, lo que lo hace adecuado para usar como clave primaria en bases de datos mientras mantiene la unicidad global. Los primeros 48 bits contienen una marca de tiempo Unix en milisegundos, seguidos de bits aleatorios o secuenciales. Este diseño proporciona tanto ordenamiento temporal como unicidad, lo que lo hace ideal para sistemas distribuidos donde el ordenamiento temporal es importante. UUID v7 es particularmente útil para registros de bases de datos, registro de eventos y cualquier sistema que requiera tanto unicidad como ordenamiento basado en tiempo. Su naturaleza ordenada por tiempo y unicidad garantizada lo convierten en una opción moderna para muchas aplicaciones."
  },
  "fr": {
    "title": "Qu'est-ce que l'UUID v7 ?",
    "description": "L'UUID v7 est un identifiant unique universel de 128 bits qui combine des composants temporels et aléatoires. Il est généralement représenté sous forme d'une chaîne de 36 caractères au format {uuid}, où le 13e caractère est toujours \"7\" pour indiquer la version 7. Contrairement à l'UUID v4, l'UUID v7 est ordonné par temps, ce qui le rend adapté pour être utilisé comme clé primaire de base de données tout en maintenant l'unicité globale. Les 48 premiers bits contiennent un horodatage Unix en millisecondes, suivi de bits aléatoires ou séquentiels. Cette conception offre à la fois un ordonnancement temporel et une unicité, ce qui le rend idéal pour les systèmes distribués où l'ordre temporel est important. L'UUID v7 est particulièrement utile pour les enregistrements de base de données, la journalisation des événements et tout système nécessitant à la fois l'unicité et le tri temporel. Sa nature ordonnée par temps et son unicité garantie en font un choix moderne pour de nombreuses applications."
  },
  "de": {
    "title": "Was ist UUID v7?",
    "description": "UUID v7 ist ein 128-Bit universell eindeutiger Bezeichner, der zeitbasierte und zufällige Komponenten kombiniert. Er wird typischerweise als 36-Zeichen-String im Format {uuid} dargestellt, wobei das 13. Zeichen immer \"7\" ist, um Version 7 anzuzeigen. Im Gegensatz zu UUID v4 ist UUID v7 zeitlich geordnet, was ihn als Primärschlüssel für Datenbanken geeignet macht, während die globale Eindeutigkeit erhalten bleibt. Die ersten 48 Bits enthalten einen Unix-Zeitstempel in Millisekunden, gefolgt von zufälligen oder sequentiellen Bits. Dieses Design bietet sowohl zeitliche Ordnung als auch Eindeutigkeit, was ihn ideal für verteilte Systeme macht, bei denen die zeitliche Ordnung wichtig ist. UUID v7 ist besonders nützlich für Datenbankeinträge, Ereignisprotokollierung und jedes System, das sowohl Eindeutigkeit als auch zeitbasierte Sortierung erfordert. Seine zeitlich geordnete Natur und garantierte Eindeutigkeit machen ihn zu einer modernen Wahl für viele Anwendungen."
  },
  "it": {
    "title": "Cos'è UUID v7?",
    "description": "UUID v7 è un identificatore univoco universale a 128 bit che combina componenti temporali e casuali. È tipicamente rappresentato come una stringa di 36 caratteri nel formato {uuid}, dove il 13° carattere è sempre \"7\" per indicare la versione 7. A differenza di UUID v4, UUID v7 è ordinato temporalmente, rendendolo adatto per l'uso come chiave primaria del database mantenendo l'unicità globale. I primi 48 bit contengono un timestamp Unix in millisecondi, seguiti da bit casuali o sequenziali. Questo design fornisce sia l'ordinamento temporale che l'unicità, rendendolo ideale per sistemi distribuiti dove l'ordinamento temporale è importante. UUID v7 è particolarmente utile per record di database, registrazione di eventi e qualsiasi sistema che richieda sia unicità che ordinamento basato sul tempo. La sua natura ordinata temporalmente e l'unicità garantita lo rendono una scelta moderna per molte applicazioni."
  },
  "ja": {
    "title": "UUID v7とは？",
    "description": "UUID v7は、時間ベースとランダムなコンポーネントを組み合わせた128ビットの汎用一意識別子です。通常、{uuid}という形式の36文字の文字列として表現され、13文字目は常にバージョン7を示す「7」です。UUID v4とは異なり、UUID v7は時間順序付けされており、グローバルな一意性を維持しながらデータベースの主キーとして使用するのに適しています。最初の48ビットにはミリ秒単位のUnixタイムスタンプが含まれ、その後にランダムまたはシーケンシャルなビットが続きます。この設計は時間順序付けと一意性の両方を提供し、時間順序が重要な分散システムに理想的です。UUID v7は特にデータベースレコード、イベントログ、および一意性と時間ベースのソートの両方を必要とするシステムに有用です。その時間順序付けの性質と保証された一意性により、多くのアプリケーションで現代的な選択肢となっています。"
  },
  "ko": {
    "title": "UUID v7란?",
    "description": "UUID v7는 시간 기반 및 랜덤 컴포넌트를 결합한 128비트 범용 고유 식별자입니다. 일반적으로 {uuid} 형식의 36자 문자열로 표현되며, 13번째 문자는 항상 버전 7을 나타내는 \"7\"입니다. UUID v4와 달리 UUID v7는 시간 순서가 지정되어 있어 전역 고유성을 유지하면서 데이터베이스 기본 키로 사용하기에 적합합니다. 처음 48비트에는 밀리초 단위의 Unix 타임스탬프가 포함되어 있으며, 그 뒤에 랜덤 또는 순차 비트가 이어집니다. 이 설계는 시간 순서 지정과 고유성을 모두 제공하여 시간 순서가 중요한 분산 시스템에 이상적입니다. UUID v7는 특히 데이터베이스 레코드, 이벤트 로깅 및 고유성과 시간 기반 정렬이 모두 필요한 시스템에 유용합니다. 시간 순서 지정 특성과 보장된 고유성으로 인해 많은 애플리케이션에서 현대적인 선택이 되었습니다."
  },
  "ru": {
    "title": "Что такое UUID v7?",
    "description": "UUID v7 - это 128-битный универсальный уникальный идентификатор, который сочетает в себе временные и случайные компоненты. Он обычно представляется в виде 36-символьной строки в формате {uuid}, где 13-й символ всегда \"7\" для обозначения версии 7. В отличие от UUID v4, UUID v7 упорядочен по времени, что делает его подходящим для использования в качестве первичного ключа базы данных при сохранении глобальной уникальности. Первые 48 бит содержат временную метку Unix в миллисекундах, за которой следуют случайные или последовательные биты. Этот дизайн обеспечивает как временное упорядочивание, так и уникальность, что делает его идеальным для распределенных систем, где важен временной порядок. UUID v7 особенно полезен для записей базы данных, регистрации событий и любых систем, требующих как уникальности, так и сортировки по времени. Его временная упорядоченность и гарантированная уникальность делают его современным выбором для многих приложений."
  },
  "pt": {
    "title": "O que é UUID v7?",
    "description": "UUID v7 é um identificador único universal de 128 bits que combina componentes baseados em tempo e aleatórios. É tipicamente representado como uma string de 36 caracteres no formato {uuid}, onde o 13º caractere é sempre \"7\" para indicar a versão 7. Diferente do UUID v4, o UUID v7 é ordenado por tempo, tornando-o adequado para uso como chave primária de banco de dados enquanto mantém a unicidade global. Os primeiros 48 bits contêm um timestamp Unix em milissegundos, seguidos por bits aleatórios ou sequenciais. Este design fornece tanto ordenação temporal quanto unicidade, tornando-o ideal para sistemas distribuídos onde a ordenação temporal é importante. UUID v7 é particularmente útil para registros de banco de dados, registro de eventos e qualquer sistema que requeira tanto unicidade quanto ordenação baseada em tempo. Sua natureza ordenada por tempo e unicidade garantida o tornam uma escolha moderna para muitas aplicações."
  },
  "ar": {
    "title": "ما هو UUID v7؟",
    "description": "UUID v7 هو معرف فريد عالمي 128 بت يجمع بين المكونات الزمنية والعشوائية. يتم تمثيله عادةً كسلسلة من 36 حرفًا بالتنسيق {uuid}، حيث يكون الحرف الثالث عشر دائمًا \"7\" للإشارة إلى الإصدار 7. على عكس UUID v4، فإن UUID v7 مرتب ترتيبًا زمنيًا، مما يجعله مناسبًا للاستخدام كمفتاح أساسي لقاعدة البيانات مع الحفاظ على التفرد العالمي. تحتوي البتات الـ 48 الأولى على طابع زمني يونكس بالمللي ثانية، متبوعًا ببتات عشوائية أو متسلسلة. يوفر هذا التصميم كلاً من الترتيب الزمني والتفرد، مما يجعله مثاليًا للأنظمة الموزعة حيث الترتيب الزمني مهم. UUID v7 مفيد بشكل خاص لسجلات قاعدة البيانات وتسجيل الأحداث وأي نظام يتطلب كلاً من التفرد والفرز القائم على الوقت. طبيعته المرتبة زمنيًا وتفرده المضمون يجعله خيارًا حديثًا للعديد من التطبيقات."
  },
  "hi": {
    "title": "UUID v7 क्या है?",
    "description": "UUID v7 एक 128-बिट सार्वभौमिक विशिष्ट पहचानकर्ता है जो समय-आधारित और यादृच्छिक घटकों को जोड़ता है। यह आमतौर पर {uuid} प्रारूप में 36-वर्ण स्ट्रिंग के रूप में प्रदर्शित होता है, जहां 13वां वर्ण हमेशा संस्करण 7 को इंगित करने के लिए \"7\" होता है। UUID v4 के विपरीत, UUID v7 समय-क्रमबद्ध है, जो इसे वैश्विक विशिष्टता बनाए रखते हुए डेटाबेस प्राथमिक कुंजी के रूप में उपयोग के लिए उपयुक्त बनाता है। पहले 48 बिट्स में मिलीसेकंड में यूनिक्स टाइमस्टैम्प होता है, उसके बाद यादृच्छिक या अनुक्रमिक बिट्स होते हैं। यह डिज़ाइन समय-क्रमबद्धता और विशिष्टता दोनों प्रदान करता है, जो इसे वितरित प्रणालियों के लिए आदर्श बनाता है जहां समय-क्रमबद्धता महत्वपूर्ण है। UUID v7 डेटाबेस रिकॉर्ड, इवेंट लॉगिंग और किसी भी ऐसे सिस्टम के लिए विशेष रूप से उपयोगी है जिसमें विशिष्टता और समय-आधारित क्रमबद्धता दोनों की आवश्यकता होती है। इसकी समय-क्रमबद्ध प्रकृति और गारंटीकृत विशिष्टता इसे कई अनुप्रयोगों के लिए एक आधुनिक विकल्प बनाती है।"
  },
  "tr": {
    "title": "UUID v7 nedir?",
    "description": "UUID v7, zaman tabanlı ve rastgele bileşenleri birleştiren 128-bit evrensel benzersiz tanımlayıcıdır. Genellikle {uuid} formatında 36 karakterlik bir dize olarak temsil edilir, burada 13. karakter her zaman sürüm 7'yi belirtmek için \"7\"dir. UUID v4'ün aksine, UUID v7 zaman sıralıdır, bu da onu global benzersizliği korurken veritabanı birincil anahtarı olarak kullanım için uygun kılar. İlk 48 bit milisaniye cinsinden bir Unix zaman damgası içerir, ardından rastgele veya sıralı bitler gelir. Bu tasarım hem zaman sıralaması hem de benzersizlik sağlar, bu da onu zaman sıralamasının önemli olduğu dağıtık sistemler için ideal kılar. UUID v7 özellikle veritabanı kayıtları, olay günlüğü ve hem benzersizlik hem de zaman tabanlı sıralama gerektiren herhangi bir sistem için kullanışlıdır. Zaman sıralı doğası ve garanti edilmiş benzersizliği onu birçok uygulama için modern bir seçim haline getirir."
  },
  "nl": {
    "title": "Wat is UUID v7?",
    "description": "UUID v7 is een 128-bits universeel unieke identifier die tijdsgebaseerde en willekeurige componenten combineert. Het wordt meestal weergegeven als een 36-tekens string in het formaat {uuid}, waarbij het 13e teken altijd \"7\" is om versie 7 aan te duiden. In tegenstelling tot UUID v4 is UUID v7 tijdgeordend, wat het geschikt maakt voor gebruik als primaire sleutel in databases terwijl de globale uniciteit behouden blijft. De eerste 48 bits bevatten een Unix-timestamp in milliseconden, gevolgd door willekeurige of sequentiële bits. Dit ontwerp biedt zowel tijdsordening als uniciteit, noemt het ideaal voor gedistribueerde systemen waar tijdsordening belangrijk is. UUID v7 is bijzonder nuttig voor databaserecords, gebeurtenisregistratie en elk systeem dat zowel uniciteit als tijdsgebaseerde sortering vereist. De tijdgeordende aard en gegarandeerde uniciteit maken het een moderne keuze voor vele toepassingen."
  },
  "sv": {
    "title": "Vad är UUID v7?",
    "description": "UUID v7 är en 128-bitars universellt unik identifierare som kombinerar tidsbaserade och slumpmässiga komponenter. Den visas vanligtvis som en 36-tecken sträng i formatet {uuid}, där det 13:e tecknet alltid är \"7\" för att ange version 7. Till skillnad från UUID v4 är UUID v7 tidsordnad, vilket gör den lämplig för användning som primärnyckel i databaser samtidigt som den behåller global unikhet. De första 48 bitarna innehåller en Unix-tidsstämpel i millisekunder, följt av slumpmässiga eller sekventiella bitar. Denna design ger både tidsordning och unikhet, vilket gör den idealisk för distribuerade system där tidsordning är viktig. UUID v7 är särskilt användbar för databasposter, händelseloggning och alla system som kräver både unikhet och tidsbaserad sortering. Dess tidsordnade natur och garanterade unikhet gör den till ett modernt val för många applikationer."
  },
  "pl": {
    "title": "Co to jest UUID v7?",
    "description": "UUID v7 to 128-bitowy uniwersalny unikalny identyfikator łączący komponenty czasowe i losowe. Jest zazwyczaj reprezentowany jako 36-znakowy ciąg w formacie {uuid}, gdzie 13. znak to zawsze \"7\" oznaczający wersję 7. W przeciwieństwie do UUID v4, UUID v7 jest uporządkowany czasowo, co czyni go odpowiednim do użycia jako klucz główny bazy danych przy zachowaniu globalnej unikalności. Pierwsze 48 bitów zawiera znacznik czasu Unix w milisekundach, po którym następują bity losowe lub sekwencyjne. Ten projekt zapewnia zarówno porządkowanie czasowe jak i unikalność, co czyni go idealnym dla systemów rozproszonych, gdzie porządkowanie czasowe jest ważne. UUID v7 jest szczególnie przydatny dla rekordów bazy danych, rejestrowania zdarzeń i każdego systemu wymagającego zarówno unikalności jak i sortowania czasowego. Jego czasowo uporządkowana natura i gwarantowana unikalność sprawiają, że jest to nowoczesny wybór dla wielu aplikacji."
  },
  "vi": {
    "title": "UUID v7 là gì?",
    "description": "UUID v7 là một định danh duy nhất phổ quát 128-bit kết hợp các thành phần dựa trên thời gian và ngẫu nhiên. Nó thường được biểu diễn dưới dạng chuỗi 36 ký tự theo định dạng {uuid}, trong đó ký tự thứ 13 luôn là \"7\" để chỉ phiên bản 7. Không giống như UUID v4, UUID v7 được sắp xếp theo thời gian, khiến nó phù hợp để sử dụng làm khóa chính của cơ sở dữ liệu trong khi vẫn duy trì tính duy nhất toàn cầu. 48 bit đầu tiên chứa dấu thời gian Unix tính bằng mili giây, theo sau là các bit ngẫu nhiên hoặc tuần tự. Thiết kế này cung cấp cả sắp xếp thời gian và tính duy nhất, khiến nó lý tưởng cho các hệ thống phân tán nơi sắp xếp thời gian quan trọng. UUID v7 đặc biệt hữu ích cho các bản ghi cơ sở dữ liệu, ghi nhật ký sự kiện và bất kỳ hệ thống nào yêu cầu cả tính duy nhất và sắp xếp dựa trên thời gian. Bản chất sắp xếp theo thời gian và tính duy nhất được đảm bảo của nó khiến nó trở thành lựa chọn hiện đại cho nhiều ứng dụng."
  },
  "th": {
    "title": "UUID v7 คืออะไร?",
    "description": "UUID v7 เป็นตัวระบุเฉพาะสากล 128 บิตที่รวมองค์ประกอบตามเวลาและสุ่มเข้าด้วยกัน โดยทั่วไปจะแสดงเป็นสตริง 36 ตัวอักษรในรูปแบบ {uuid} โดยที่ตัวอักษรที่ 13 จะเป็น \"7\" เสมอเพื่อระบุเวอร์ชัน 7 แตกต่างจาก UUID v4 UUID v7 มีการเรียงลำดับตามเวลาทำให้เหมาะสำหรับการใช้งานเป็นคีย์หลักของฐานข้อมูลในขณะที่ยังคงความเป็นเอกลักษณ์ทั่วโลก บิตแรก 48 บิตมีไทม์สแตมป์ Unix ในหน่วยมิลลิวินาที ตามด้วยบิตสุ่มหรือลำดับ การออกแบบนี้ให้ทั้งการเรียงลำดับตามเวลาและความเป็นเอกลักษณ์ทำให้เหมาะสำหรับระบบกระจายที่การเรียงลำดับตามเวลาสำคัญ UUID v7 มีประโยชน์อย่างยิ่งสำหรับบันทึกฐานข้อมูลการบันทึกเหตุการณ์และระบบใดๆ ที่ต้องการทั้งความเป็นเอกลักษณ์และการเรียงลำดับตามเวลา ลักษณะการเรียงลำดับตามเวลาและความเป็นเอกลักษณ์ที่รับประกันทำให้เป็นตัวเลือกที่ทันสมัยสำหรับแอปพลิเคชันจำนวนมาก"
  },
  "id": {
    "title": "Apa itu UUID v7?",
    "description": "UUID v7 adalah pengidentifikasi unik universal 128-bit yang menggabungkan komponen berbasis waktu dan acak. Biasanya direpresentasikan sebagai string 36 karakter dalam format {uuid}, di mana karakter ke-13 selalu \"7\" untuk menunjukkan versi 7. Berbeda dengan UUID v4, UUID v7 diurutkan berdasarkan waktu, membuatnya cocok untuk digunakan sebagai kunci utama database sambil mempertahankan keunikan global. 48 bit pertama berisi timestamp Unix dalam milidetik, diikuti oleh bit acak atau sekuensial. Desain ini memberikan pengurutan waktu dan keunikan, menjadikannya ideal untuk sistem terdistribusi di mana pengurutan waktu penting. UUID v7 sangat berguna untuk catatan database, pencatatan peristiwa, dan sistem apa pun yang memerlukan keunikan dan pengurutan berbasis waktu. Sifatnya yang diurutkan berdasarkan waktu dan keunikan yang dijamin menjadikannya pilihan modern untuk banyak aplikasi."
  },
  "he": {
    "title": "?UUID v7 מהו",
    "description": "UUID v7 הוא מזהה ייחודי אוניברסלי 128-ביט המשלב רכיבים מבוססי זמן ואקראיים. הוא מוצג בדרך כלל כמחרוזת של 36 תווים בפורמט {uuid}, כאשר התו ה-13 הוא תמיד \"7\" לציון גרסה 7. בניגוד ל-UUID v4, UUID v7 ממוין לפי זמן, מה שהופך אותו למתאים לשימוש כמפתח ראשי במסד נתונים תוך שמירה על ייחודיות גלובלית. 48 הביטים הראשונים מכילים חותמת זמן Unix במילישניות, ואחריהם ביטים אקראיים או רציפים. עיצוב זה מספק הן מיון זמני והן ייחודיות, מה שהופך אותו לאידיאלי עבור מערכות מבוזרות שבהן מיון זמני חשוב. UUID v7 שימושי במיוחד עבור רשומות מסד נתונים, תיעוד אירועים וכל מערכת הדורשת הן ייחודיות והן מיון מבוסס זמן. אופיו הממוין לפי זמן והייחודיות המובטחת שלו הופכים אותו לבחירה מודרנית עבור יישומים רבים."
  },
  "ms": {
    "title": "Apakah UUID v7?",
    "description": "UUID v7 ialah pengenalan unik sejagat 128-bit yang menggabungkan komponen berasaskan masa dan rawak. Ia biasanya dipaparkan sebagai rentetan 36 aksara dalam format {uuid}, di mana aksara ke-13 sentiasa \"7\" untuk menunjukkan versi 7. Berbeza dengan UUID v4, UUID v7 disusun mengikut masa, menjadikannya sesuai untuk digunakan sebagai kunci utama pangkalan data sambil mengekalkan keunikan global. 48 bit pertama mengandungi cap masa Unix dalam milisaat, diikuti oleh bit rawak atau berurutan. Reka bentuk ini menyediakan kedua-dua penyusunan masa dan keunikan, menjadikannya sesuai untuk sistem teragih di mana penyusunan masa adalah penting. UUID v7 amat berguna untuk rekod pangkalan data, pendaftaran peristiwa, dan mana-mana sistem yang memerlukan keunikan dan penyusunan berasaskan masa. Sifatnya yang disusun mengikut masa dan keunikan yang dijamin menjadikannya pilihan moden untuk banyak aplikasi."
  },
  "no": {
    "title": "Hva er UUID v7?",
    "description": "UUID v7 er en 128-bit universelt unik identifikator som kombinerer tidsbaserte og tilfeldige komponenter. Den vises typisk som en 36-tegns streng i formatet {uuid}, hvor det 13. tegnet alltid er \"7\" for å indikere versjon 7. I motsetning til UUID v4 er UUID v7 tidsordnet, noe som gjør den egnet for bruk som primærnøkkel i databaser samtidig som den opprettholder global unikhet. De første 48 bitene inneholder et Unix-tidsstempel i millisekunder, etterfulgt av tilfeldige eller sekvensielle biter. Dette designet gir både tidsordning og unikhet, noe som gjør den ideell for distribuerte systemer hvor tidsordning er viktig. UUID v7 er spesielt nyttig for databaserecorder, hendelseslogging og ethvert system som krever både unikhet og tidsbasert sortering. Dens tidsordnede natur og garanterte unikhet gjør den til et moderne valg for mange applikasjoner."
  }
}
</i18n>
