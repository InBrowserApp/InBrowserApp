<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <i18n-t keypath="description">
      <template #uuid>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-text code>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</n-text>
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
    "title": "What is UUID v4?",
    "description": "UUID v4 is a 128-bit universally unique identifier generated using cryptographically secure random numbers. It's typically represented as a 36-character string in the format {uuid}, where the 13th character is always \"4\" to indicate version 4, and the 17th character represents the variant (commonly one of \"8\", \"9\", \"a\", or \"b\"). Because most of its bits are randomly generated, UUID v4 provides a very high degree of uniqueness without relying on a central authority or coordination. It does not encode information like timestamps or hardware identifiers, making it suitable for privacy-focused applications. UUID v4 is widely used for identifying resources in distributed systems, database records, API tokens, file names, and more. Its simplicity, global uniqueness, and ease of generation make it a popular choice in software development."
  },
  "zh": {
    "title": "什么是 UUID v4？",
    "description": "UUID v4 是一个使用加密安全随机数生成的 128 位通用唯一标识符。它通常以 36 个字符的字符串形式表示，格式为 {uuid}，其中第 13 个字符始终为 \"4\" 表示版本 4，第 17 个字符表示变体（通常为 \"8\"、\"9\"、\"a\" 或 \"b\" 之一）。由于大多数位都是随机生成的，UUID v4 提供了非常高的唯一性，无需依赖中央机构或协调。它不编码时间戳或硬件标识符等信息，因此适合注重隐私的应用。UUID v4 广泛用于分布式系统中的资源标识、数据库记录、API 令牌、文件名等。其简单性、全局唯一性和易于生成的特点使其成为软件开发中的热门选择。"
  },
  "zh-CN": {
    "title": "什么是 UUID v4？",
    "description": "UUID v4 是一个使用加密安全随机数生成的 128 位通用唯一标识符。它通常以 36 个字符的字符串形式表示，格式为 {uuid}，其中第 13 个字符始终为 \"4\" 表示版本 4，第 17 个字符表示变体（通常为 \"8\"、\"9\"、\"a\" 或 \"b\" 之一）。由于大多数位都是随机生成的，UUID v4 提供了非常高的唯一性，无需依赖中央机构或协调。它不编码时间戳或硬件标识符等信息，因此适合注重隐私的应用。UUID v4 广泛用于分布式系统中的资源标识、数据库记录、API 令牌、文件名等。其简单性、全局唯一性和易于生成的特点使其成为软件开发中的热门选择。"
  },
  "zh-TW": {
    "title": "什麼是 UUID v4？",
    "description": "UUID v4 是一個使用加密安全隨機數生成的 128 位通用唯一識別碼。它通常以 36 個字元的字串形式表示，格式為 {uuid}，其中第 13 個字元始終為 \"4\" 表示版本 4，第 17 個字元表示變體（通常為 \"8\"、\"9\"、\"a\" 或 \"b\" 之一）。由於大多數位都是隨機生成的，UUID v4 提供了非常高的唯一性，無需依賴中央機構或協調。它不編碼時間戳或硬體識別碼等資訊，因此適合注重隱私的應用。UUID v4 廣泛用於分散式系統中的資源識別、資料庫記錄、API 令牌、檔案名稱等。其簡單性、全域唯一性和易於生成的特點使其成為軟體開發中的熱門選擇。"
  },
  "zh-HK": {
    "title": "什麼是 UUID v4？",
    "description": "UUID v4 是一個使用加密安全隨機數生成的 128 位通用唯一識別碼。它通常以 36 個字元的字串形式表示，格式為 {uuid}，其中第 13 個字元始終為 \"4\" 表示版本 4，第 17 個字元表示變體（通常為 \"8\"、\"9\"、\"a\" 或 \"b\" 之一）。由於大多數位都是隨機生成的，UUID v4 提供了非常高的唯一性，無需依賴中央機構或協調。它不編碼時間戳或硬體識別碼等資訊，因此適合注重隱私的應用。UUID v4 廣泛用於分散式系統中的資源識別、資料庫記錄、API 令牌、檔案名稱等。其簡單性、全域唯一性和易於生成的特點使其成為軟體開發中的熱門選擇。"
  },
  "es": {
    "title": "¿Qué es UUID v4?",
    "description": "UUID v4 es un identificador único universal de 128 bits generado utilizando números aleatorios criptográficamente seguros. Típicamente se representa como una cadena de 36 caracteres en el formato {uuid}, donde el carácter 13 siempre es \"4\" para indicar la versión 4, y el carácter 17 representa la variante (comúnmente uno de \"8\", \"9\", \"a\" o \"b\"). Debido a que la mayoría de sus bits son generados aleatoriamente, UUID v4 proporciona un alto grado de unicidad sin depender de una autoridad central o coordinación. No codifica información como marcas de tiempo o identificadores de hardware, lo que lo hace adecuado para aplicaciones centradas en la privacidad. UUID v4 se usa ampliamente para identificar recursos en sistemas distribuidos, registros de bases de datos, tokens de API, nombres de archivos y más. Su simplicidad, unicidad global y facilidad de generación lo convierten en una opción popular en el desarrollo de software."
  },
  "fr": {
    "title": "Qu'est-ce que l'UUID v4 ?",
    "description": "L'UUID v4 est un identifiant unique universel de 128 bits généré à l'aide de nombres aléatoires cryptographiquement sécurisés. Il est généralement représenté sous forme d'une chaîne de 36 caractères au format {uuid}, où le 13e caractère est toujours \"4\" pour indiquer la version 4, et le 17e caractère représente la variante (généralement l'un des caractères \"8\", \"9\", \"a\" ou \"b\"). Comme la plupart de ses bits sont générés aléatoirement, l'UUID v4 offre un très haut degré d'unicité sans dépendre d'une autorité centrale ou d'une coordination. Il ne code pas d'informations comme des horodatages ou des identifiants matériels, ce qui le rend adapté aux applications axées sur la confidentialité. L'UUID v4 est largement utilisé pour identifier des ressources dans des systèmes distribués, des enregistrements de base de données, des jetons API, des noms de fichiers, et plus encore. Sa simplicité, son unicité globale et sa facilité de génération en font un choix populaire dans le développement logiciel."
  },
  "de": {
    "title": "Was ist UUID v4?",
    "description": "UUID v4 ist ein 128-Bit universell eindeutiger Bezeichner, der mit kryptographisch sicheren Zufallszahlen generiert wird. Er wird typischerweise als 36-Zeichen-String im Format {uuid} dargestellt, wobei das 13. Zeichen immer \"4\" ist, um Version 4 anzuzeigen, und das 17. Zeichen die Variante darstellt (üblicherweise eines von \"8\", \"9\", \"a\" oder \"b\"). Da die meisten Bits zufällig generiert werden, bietet UUID v4 einen sehr hohen Grad an Eindeutigkeit ohne Abhängigkeit von einer zentralen Autorität oder Koordination. Er kodiert keine Informationen wie Zeitstempel oder Hardware-Identifikatoren, was ihn für datenschutzorientierte Anwendungen geeignet macht. UUID v4 wird häufig zur Identifizierung von Ressourcen in verteilten Systemen, Datenbankeinträgen, API-Tokens, Dateinamen und mehr verwendet. Seine Einfachheit, globale Eindeutigkeit und einfache Generierung machen ihn zu einer beliebten Wahl in der Softwareentwicklung."
  },
  "it": {
    "title": "Cos'è UUID v4?",
    "description": "UUID v4 è un identificatore univoco universale a 128 bit generato utilizzando numeri casuali crittograficamente sicuri. È tipicamente rappresentato come una stringa di 36 caratteri nel formato {uuid}, dove il 13° carattere è sempre \"4\" per indicare la versione 4, e il 17° carattere rappresenta la variante (comunemente uno tra \"8\", \"9\", \"a\" o \"b\"). Poiché la maggior parte dei suoi bit sono generati casualmente, UUID v4 fornisce un grado molto elevato di unicità senza dipendere da un'autorità centrale o coordinamento. Non codifica informazioni come timestamp o identificatori hardware, rendendolo adatto per applicazioni focalizzate sulla privacy. UUID v4 è ampiamente utilizzato per identificare risorse in sistemi distribuiti, record di database, token API, nomi di file e altro ancora. La sua semplicità, unicità globale e facilità di generazione lo rendono una scelta popolare nello sviluppo software."
  },
  "ja": {
    "title": "UUID v4とは？",
    "description": "UUID v4は、暗号学的に安全な乱数を使用して生成される128ビットの汎用一意識別子です。通常、{uuid}という形式の36文字の文字列として表現され、13文字目は常にバージョン4を示す「4」で、17文字目はバリアント（通常は「8」、「9」、「a」、「b」のいずれか）を表します。ほとんどのビットがランダムに生成されるため、UUID v4は中央機関や調整に依存せずに非常に高い一意性を提供します。タイムスタンプやハードウェア識別子などの情報をエンコードしないため、プライバシー重視のアプリケーションに適しています。UUID v4は分散システム、データベースレコード、APIトークン、ファイル名などでのリソース識別に広く使用されています。そのシンプルさ、グローバルな一意性、生成の容易さから、ソフトウェア開発で人気のある選択肢となっています。"
  },
  "ko": {
    "title": "UUID v4란?",
    "description": "UUID v4는 암호학적으로 안전한 난수를 사용하여 생성되는 128비트 범용 고유 식별자입니다. 일반적으로 {uuid} 형식의 36자 문자열로 표현되며, 13번째 문자는 항상 버전 4를 나타내는 \"4\"이고, 17번째 문자는 변형(일반적으로 \"8\", \"9\", \"a\", \"b\" 중 하나)을 나타냅니다. 대부분의 비트가 무작위로 생성되기 때문에 UUID v4는 중앙 기관이나 조정에 의존하지 않고도 매우 높은 고유성을 제공합니다. 타임스탬프나 하드웨어 식별자와 같은 정보를 인코딩하지 않아 개인정보 중심 애플리케이션에 적합합니다. UUID v4는 분산 시스템, 데이터베이스 레코드, API 토큰, 파일 이름 등에서 리소스 식별에 널리 사용됩니다. 그 단순성, 전역적 고유성, 생성 용이성으로 인해 소프트웨어 개발에서 인기 있는 선택이 되었습니다."
  },
  "ru": {
    "title": "Что такое UUID v4?",
    "description": "UUID v4 - это 128-битный универсальный уникальный идентификатор, генерируемый с использованием криптографически стойких случайных чисел. Он обычно представляется в виде 36-символьной строки в формате {uuid}, где 13-й символ всегда \"4\" для обозначения версии 4, а 17-й символ представляет вариант (обычно один из \"8\", \"9\", \"a\" или \"b\"). Поскольку большинство его битов генерируются случайным образом, UUID v4 обеспечивает очень высокую степень уникальности без зависимости от центрального органа или координации. Он не кодирует информацию, такую как временные метки или идентификаторы оборудования, что делает его подходящим для приложений, ориентированных на конфиденциальность. UUID v4 широко используется для идентификации ресурсов в распределенных системах, записях базы данных, токенах API, именам файлов и многом другом. Его простота, глобальная уникальность и легкость генерации делают его популярным выбором в разработке программного обеспечения."
  },
  "pt": {
    "title": "O que é UUID v4?",
    "description": "UUID v4 é um identificador único universal de 128 bits gerado usando números aleatórios criptograficamente seguros. É tipicamente representado como uma string de 36 caracteres no formato {uuid}, onde o 13º caractere é sempre \"4\" para indicar a versão 4, e o 17º caractere representa a variante (comumente um de \"8\", \"9\", \"a\" ou \"b\"). Como a maioria de seus bits são gerados aleatoriamente, UUID v4 fornece um grau muito alto de unicidade sem depender de uma autoridade central ou coordenação. Ele não codifica informações como timestamps ou identificadores de hardware, tornando-o adequado para aplicações focadas em privacidade. UUID v4 é amplamente usado para identificar recursos em sistemas distribuídos, registros de banco de dados, tokens de API, nomes de arquivos e mais. Sua simplicidade, unicidade global e facilidade de geração o tornam uma escolha popular no desenvolvimento de software."
  },
  "ar": {
    "title": "ما هو UUID v4؟",
    "description": "UUID v4 هو معرف فريد عالمي 128 بت يتم إنشاؤه باستخدام أرقام عشوائية آمنة التشفير. يتم تمثيله عادةً كسلسلة من 36 حرفًا بالتنسيق {uuid}، حيث يكون الحرف الثالث عشر دائمًا \"4\" للإشارة إلى الإصدار 4، والحرف السابع عشر يمثل المتغير (عادةً أحد الأحرف \"8\" أو \"9\" أو \"a\" أو \"b\"). نظرًا لأن معظم بتاته يتم إنشاؤها بشكل عشوائي، يوفر UUID v4 درجة عالية جدًا من التفرد دون الاعتماد على سلطة مركزية أو تنسيق. لا يقوم بتشفير معلومات مثل الطوابع الزمنية أو معرفات الأجهزة، مما يجعله مناسبًا للتطبيقات التي تركز على الخصوصية. يستخدم UUID v4 على نطاق واسع لتحديد الموارد في الأنظمة الموزعة وسجلات قواعد البيانات ورمزات API وأسماء الملفات والمزيد. تجعله بساطته وتفرده العالمي وسهولة إنشائه خيارًا شائعًا في تطوير البرمجيات."
  },
  "hi": {
    "title": "UUID v4 क्या है?",
    "description": "UUID v4 एक 128-बिट सार्वभौमिक विशिष्ट पहचानकर्ता है जो क्रिप्टोग्राफिक रूप से सुरक्षित यादृच्छिक संख्याओं का उपयोग करके उत्पन्न किया जाता है। यह आमतौर पर {uuid} प्रारूप में 36-वर्ण स्ट्रिंग के रूप में प्रदर्शित होता है, जहां 13वां वर्ण हमेशा संस्करण 4 को इंगित करने के लिए \"4\" होता है, और 17वां वर्ण वेरिएंट का प्रतिनिधित्व करता है (आमतौर पर \"8\", \"9\", \"a\" या \"b\" में से एक)। चूंकि इसके अधिकांश बिट यादृच्छिक रूप से उत्पन्न होते हैं, UUID v4 केंद्रीय प्राधिकरण या समन्वय पर निर्भर किए बिना बहुत उच्च स्तर की विशिष्टता प्रदान करता है। यह टाइमस्टैम्प या हार्डवेयर पहचानकर्ताओं जैसी जानकारी को एनकोड नहीं करता है, जिससे यह गोपनीयता-केंद्रित अनुप्रयोगों के लिए उपयुक्त है। UUID v4 का व्यापक रूप से वितरित प्रणालियों, डेटाबेस रिकॉर्ड, API टोकन, फ़ाइल नामों और अधिक में संसाधनों की पहचान के लिए उपयोग किया जाता है। इसकी सरलता, वैश्विक विशिष्टता और उत्पादन में आसानी इसे सॉफ्टवेयर विकास में एक लोकप्रिय विकल्प बनाती है।"
  },
  "tr": {
    "title": "UUID v4 nedir?",
    "description": "UUID v4, kriptografik olarak güvenli rastgele sayılar kullanılarak oluşturulan 128-bit evrensel benzersiz tanımlayıcıdır. Genellikle {uuid} formatında 36 karakterlik bir dize olarak temsil edilir, burada 13. karakter her zaman sürüm 4'ü belirtmek için \"4\"dür ve 17. karakter varyantı temsil eder (genellikle \"8\", \"9\", \"a\" veya \"b\"den biri). Bitlerinin çoğu rastgele oluşturulduğu için, UUID v4 merkezi bir otoriteye veya koordinasyona ihtiyaç duymadan çok yüksek bir benzersizlik derecesi sağlar. Zaman damgaları veya donanım tanımlayıcıları gibi bilgileri kodlamaz, bu da onu gizlilik odaklı uygulamalar için uygun kılar. UUID v4, dağıtık sistemlerde, veritabanı kayıtlarında, API tokenlarında, dosya adlarında ve daha fazlasında kaynakları tanımlamak için yaygın olarak kullanılır. Basitliği, küresel benzersizliği ve oluşturma kolaylığı onu yazılım geliştirmede popüler bir seçim haline getirir."
  },
  "nl": {
    "title": "Wat is UUID v4?",
    "description": "UUID v4 is een 128-bits universeel unieke identifier die wordt gegenereerd met cryptografisch veilige willekeurige getallen. Het wordt meestal weergegeven als een 36-tekens string in het formaat {uuid}, waarbij het 13e teken altijd \"4\" is om versie 4 aan te duiden, en het 17e teken de variant vertegenwoordigt (meestal een van \"8\", \"9\", \"a\" of \"b\"). Omdat de meeste bits willekeurig worden gegenereerd, biedt UUID v4 een zeer hoge mate van uniciteit zonder afhankelijk te zijn van een centrale autoriteit of coördinatie. Het codeert geen informatie zoals timestamps of hardware-identifiers, wat het geschikt maakt voor privacy-gerichte toepassingen. UUID v4 wordt veel gebruikt voor het identificeren van resources in gedistribueerde systemen, databaserecords, API-tokens, bestandsnamen en meer. De eenvoud, wereldwijde uniciteit en gemakkelijke generatie maken het een populaire keuze in softwareontwikkeling."
  },
  "sv": {
    "title": "Vad är UUID v4?",
    "description": "UUID v4 är en 128-bitars universellt unik identifierare som genereras med kryptografiskt säkra slumpmässiga tal. Den visas vanligtvis som en 36-tecken sträng i formatet {uuid}, där det 13:e tecknet alltid är \"4\" för att ange version 4, och det 17:e tecknet representerar varianten (vanligtvis ett av \"8\", \"9\", \"a\" eller \"b\"). Eftersom de flesta av dess bitar genereras slumpmässigt ger UUID v4 en mycket hög grad av unikhet utan att förlita sig på en central myndighet eller koordinering. Den kodar inte information som tidsstämplar eller hårdvaruidentifierare, vilket gör den lämplig för integritetsfokuserade applikationer. UUID v4 används i stor utsträckning för att identifiera resurser i distribuerade system, databasposter, API-tokens, filnamn och mer. Dess enkelhet, globala unikhet och enkel generering gör den till ett populärt val inom mjukvaruutveckling."
  },
  "pl": {
    "title": "Co to jest UUID v4?",
    "description": "UUID v4 to 128-bitowy uniwersalny unikalny identyfikator generowany przy użyciu kryptograficznie bezpiecznych liczb losowych. Jest zazwyczaj reprezentowany jako 36-znakowy ciąg w formacie {uuid}, gdzie 13. znak to zawsze \"4\" oznaczający wersję 4, a 17. znak reprezentuje wariant (zazwyczaj jeden z \"8\", \"9\", \"a\" lub \"b\"). Ponieważ większość jego bitów jest generowana losowo, UUID v4 zapewnia bardzo wysoki stopień unikalności bez polegania na centralnym organie lub koordynacji. Nie koduje informacji takich jak znaczniki czasu czy identyfikatory sprzętowe, co czyni go odpowiednim dla aplikacji ukierunkowanych na prywatność. UUID v4 jest szeroko stosowany do identyfikacji zasobów w systemach rozproszonych, rekordach baz danych, tokenach API, nazwach plików i innych. Jego prostota, globalna unikalność i łatwość generowania sprawiają, że jest popularnym wyborem w rozwoju oprogramowania."
  },
  "vi": {
    "title": "UUID v4 là gì?",
    "description": "UUID v4 là một định danh duy nhất phổ quát 128-bit được tạo bằng cách sử dụng các số ngẫu nhiên an toàn về mặt mật mã. Nó thường được biểu diễn dưới dạng chuỗi 36 ký tự theo định dạng {uuid}, trong đó ký tự thứ 13 luôn là \"4\" để chỉ phiên bản 4, và ký tự thứ 17 đại diện cho biến thể (thường là một trong các ký tự \"8\", \"9\", \"a\" hoặc \"b\"). Vì hầu hết các bit của nó được tạo ngẫu nhiên, UUID v4 cung cấp mức độ duy nhất rất cao mà không cần phụ thuộc vào cơ quan trung ương hoặc điều phối. Nó không mã hóa thông tin như dấu thời gian hoặc định danh phần cứng, khiến nó phù hợp cho các ứng dụng tập trung vào quyền riêng tư. UUID v4 được sử dụng rộng rãi để xác định tài nguyên trong các hệ thống phân tán, bản ghi cơ sở dữ liệu, token API, tên tệp và hơn thế nữa. Tính đơn giản, tính duy nhất toàn cầu và dễ tạo của nó khiến nó trở thành lựa chọn phổ biến trong phát triển phần mềm."
  },
  "th": {
    "title": "UUID v4 คืออะไร?",
    "description": "UUID v4 เป็นตัวระบุเฉพาะสากล 128 บิตที่สร้างขึ้นโดยใช้ตัวเลขสุ่มที่ปลอดภัยทางคริปโตกราฟี โดยทั่วไปจะแสดงเป็นสตริง 36 ตัวอักษรในรูปแบบ {uuid} โดยที่ตัวอักษรที่ 13 จะเป็น \"4\" เสมอเพื่อระบุเวอร์ชัน 4 และตัวอักษรที่ 17 แทนตัวแปร (โดยทั่วไปคือ \"8\", \"9\", \"a\" หรือ \"b\" ตัวใดตัวหนึ่ง) เนื่องจากบิตส่วนใหญ่ถูกสร้างขึ้นแบบสุ่ม UUID v4 จึงให้ความไม่ซ้ำกันในระดับสูงมากโดยไม่ต้องพึ่งพาอำนาจกลางหรือการประสานงาน ไม่ได้เข้ารหัสข้อมูลเช่นการประทับเวลาหรือตัวระบุฮาร์ดแวร์ ทำให้เหมาะสำหรับแอปพลิเคชันที่เน้นความเป็นส่วนตัว UUID v4 ถูกใช้อย่างแพร่หลายในการระบุทรัพยากรในระบบกระจาย บันทึกฐานข้อมูล โทเค็น API ชื่อไฟล์ และอื่นๆ ความเรียบง่าย ความไม่ซ้ำกันทั่วโลก และความง่ายในการสร้างทำให้เป็นตัวเลือกยอดนิยมในการพัฒนาซอฟต์แวร์"
  },
  "id": {
    "title": "Apa itu UUID v4?",
    "description": "UUID v4 adalah pengidentifikasi unik universal 128-bit yang dihasilkan menggunakan angka acak yang aman secara kriptografis. Biasanya direpresentasikan sebagai string 36 karakter dalam format {uuid}, di mana karakter ke-13 selalu \"4\" untuk menunjukkan versi 4, dan karakter ke-17 mewakili varian (biasanya salah satu dari \"8\", \"9\", \"a\", atau \"b\"). Karena sebagian besar bitnya dihasilkan secara acak, UUID v4 memberikan tingkat keunikan yang sangat tinggi tanpa bergantung pada otoritas pusat atau koordinasi. Tidak mengkodekan informasi seperti timestamp atau pengidentifikasi perangkat keras, membuatnya cocok untuk aplikasi yang berfokus pada privasi. UUID v4 banyak digunakan untuk mengidentifikasi sumber daya dalam sistem terdistribusi, catatan database, token API, nama file, dan lainnya. Kesederhanaan, keunikan global, dan kemudahan pembuatannya menjadikannya pilihan populer dalam pengembangan perangkat lunak."
  },
  "he": {
    "title": "?UUID v4 מהו",
    "description": "UUID v4 הוא מזהה ייחודי אוניברסלי 128-ביט שנוצר באמצעות מספרים אקראיים מאובטחים קריפטוגרפית. הוא מוצג בדרך כלל כמחרוזת של 36 תווים בפורמט {uuid}, כאשר התו ה-13 הוא תמיד \"4\" לציון גרסה 4, והתו ה-17 מייצג את הווריאנט (בדרך כלל אחד מהתווים \"8\", \"9\", \"a\" או \"b\"). מכיוון שרוב הביטים שלו נוצרים באופן אקראי, UUID v4 מספק רמה גבוהה מאוד של ייחודיות ללא תלות בסמכות מרכזית או תיאום. הוא אינו מקודד מידע כמו חותמות זמן או מזהי חומרה, מה שהופך אותו למתאים ליישומים המתמקדים בפרטיות. UUID v4 משמש באופן נרחב לזיהוי משאבים במערכות מבוזרות, רשומות מסד נתונים, אסימוני API, שמות קבצים ועוד. הפשטות שלו, הייחודיות הגלובלית והקלות ביצירה הופכים אותו לבחירה פופולרית בפיתוח תוכנה."
  },
  "ms": {
    "title": "Apakah UUID v4?",
    "description": "UUID v4 ialah pengenalan unik sejagat 128-bit yang dijana menggunakan nombor rawak yang selamat secara kriptografi. Ia biasanya dipaparkan sebagai rentetan 36 aksara dalam format {uuid}, di mana aksara ke-13 sentiasa \"4\" untuk menunjukkan versi 4, dan aksara ke-17 mewakili varian (biasanya salah satu daripada \"8\", \"9\", \"a\" atau \"b\"). Oleh kerana kebanyakan bitnya dijana secara rawak, UUID v4 menyediakan tahap keunikan yang sangat tinggi tanpa bergantung pada pihak berkuasa pusat atau penyelarasan. Ia tidak menyulitkan maklumat seperti cap masa atau pengenalan perkakasan, menjadikannya sesuai untuk aplikasi yang memberi tumpuan kepada privasi. UUID v4 digunakan secara meluas untuk mengenal pasti sumber dalam sistem teragih, rekod pangkalan data, token API, nama fail dan banyak lagi. Kesederhanaan, keunikan global dan kemudahan penjanaan menjadikannya pilihan popular dalam pembangunan perisian."
  },
  "no": {
    "title": "Hva er UUID v4?",
    "description": "UUID v4 er en 128-bit universelt unik identifikator som genereres ved hjelp av kryptografisk sikre tilfeldige tall. Den vises typisk som en 36-tegns streng i formatet {uuid}, hvor det 13. tegnet alltid er \"4\" for å indikere versjon 4, og det 17. tegnet representerer varianten (vanligvis en av \"8\", \"9\", \"a\" eller \"b\"). Siden de fleste av bitene genereres tilfeldig, gir UUID v4 en svært høy grad av unikhet uten å være avhengig av en sentral myndighet eller koordinering. Den koder ikke informasjon som tidsstempler eller maskinvareidentifikatorer, noe som gjør den egnet for personvernfokuserte applikasjoner. UUID v4 brukes mye til å identifisere ressurser i distribuerte systemer, databaserecorder, API-tokens, filnavn og mer. Dens enkelhet, globale unikhet og enkel generering gjør den til et populært valg i programvareutvikling."
  }
}
</i18n>
