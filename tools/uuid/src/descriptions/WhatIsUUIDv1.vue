<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <i18n-t keypath="description">
      <template #uuid>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-text code>xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx</n-text>
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
    "title": "What is UUID v1?",
    "description": "UUID v1 is a 128-bit universally unique identifier generated using a combination of the current timestamp, a clock sequence, and the device's MAC address. It's typically represented as a 36-character string in the format {uuid}, where the \"1\" indicates version 1. The timestamp component ensures that UUIDs are time-ordered, while the MAC address and clock sequence help prevent collisions even across different machines. Because UUID v1 encodes both time and hardware information, it provides strong uniqueness guarantees, but also raises privacy concerns, as it can potentially expose the exact time and origin of generation. It is commonly used in legacy systems or applications that require time-based sorting, though UUID v4 is generally preferred in modern software for its simplicity and better privacy."
  },
  "zh": {
    "title": "什么是 UUID v1？",
    "description": "UUID v1 是一个使用当前时间戳、时钟序列和设备 MAC 地址组合生成的 128 位通用唯一标识符。它通常以 36 个字符的字符串形式表示，格式为 {uuid}，其中 \"1\" 表示版本 1。时间戳组件确保 UUID 按时间排序，而 MAC 地址和时钟序列有助于防止不同机器之间的冲突。由于 UUID v1 同时编码了时间和硬件信息，它提供了强大的唯一性保证，但也带来了隐私问题，因为它可能会暴露生成的确切时间和来源。它通常用于遗留系统或需要基于时间排序的应用程序，尽管在现代软件中通常更倾向于使用 UUID v4，因为它更简单且具有更好的隐私性。"
  },
  "zh-CN": {
    "title": "什么是 UUID v1？",
    "description": "UUID v1 是一个使用当前时间戳、时钟序列和设备 MAC 地址组合生成的 128 位通用唯一标识符。它通常以 36 个字符的字符串形式表示，格式为 {uuid}，其中 \"1\" 表示版本 1。时间戳组件确保 UUID 按时间排序，而 MAC 地址和时钟序列有助于防止不同机器之间的冲突。由于 UUID v1 同时编码了时间和硬件信息，它提供了强大的唯一性保证，但也带来了隐私问题，因为它可能会暴露生成的确切时间和来源。它通常用于遗留系统或需要基于时间排序的应用程序，尽管在现代软件中通常更倾向于使用 UUID v4，因为它更简单且具有更好的隐私性。"
  },
  "zh-TW": {
    "title": "什麼是 UUID v1？",
    "description": "UUID v1 是一個使用當前時間戳、時鐘序列和設備 MAC 地址組合生成的 128 位通用唯一識別碼。它通常以 36 個字元的字串形式表示，格式為 {uuid}，其中 \"1\" 表示版本 1。時間戳組件確保 UUID 按時間排序，而 MAC 地址和時鐘序列有助於防止不同機器之間的衝突。由於 UUID v1 同時編碼了時間和硬體資訊，它提供了強大的唯一性保證，但也帶來了隱私問題，因為它可能會暴露生成的確切時間和來源。它通常用於遺留系統或需要基於時間排序的應用程式，儘管在現代軟體中通常更傾向於使用 UUID v4，因為它更簡單且具有更好的隱私性。"
  },
  "zh-HK": {
    "title": "什麼是 UUID v1？",
    "description": "UUID v1 是一個使用當前時間戳、時鐘序列和設備 MAC 地址組合生成的 128 位通用唯一識別碼。它通常以 36 個字元的字串形式表示，格式為 {uuid}，其中 \"1\" 表示版本 1。時間戳組件確保 UUID 按時間排序，而 MAC 地址和時鐘序列有助於防止不同機器之間的衝突。由於 UUID v1 同時編碼了時間和硬體資訊，它提供了強大的唯一性保證，但也帶來了隱私問題，因為它可能會暴露生成的確切時間和來源。它通常用於遺留系統或需要基於時間排序的應用程式，儘管在現代軟體中通常更傾向於使用 UUID v4，因為它更簡單且具有更好的隱私性。"
  },
  "es": {
    "title": "¿Qué es UUID v1?",
    "description": "UUID v1 es un identificador único universal de 128 bits generado utilizando una combinación de la marca de tiempo actual, una secuencia de reloj y la dirección MAC del dispositivo. Típicamente se representa como una cadena de 36 caracteres en el formato {uuid}, donde el \"1\" indica la versión 1. El componente de marca de tiempo asegura que los UUIDs estén ordenados cronológicamente, mientras que la dirección MAC y la secuencia de reloj ayudan a prevenir colisiones incluso entre diferentes máquinas. Debido a que UUID v1 codifica tanto información de tiempo como de hardware, proporciona fuertes garantías de unicidad, pero también plantea preocupaciones de privacidad, ya que puede exponer potencialmente el tiempo exacto y el origen de la generación. Se utiliza comúnmente en sistemas heredados o aplicaciones que requieren ordenamiento basado en tiempo, aunque UUID v4 es generalmente preferido en software moderno por su simplicidad y mejor privacidad."
  },
  "fr": {
    "title": "Qu'est-ce que l'UUID v1 ?",
    "description": "L'UUID v1 est un identifiant unique universel de 128 bits généré en utilisant une combinaison de l'horodatage actuel, une séquence d'horloge et l'adresse MAC de l'appareil. Il est généralement représenté sous forme d'une chaîne de 36 caractères au format {uuid}, où le \"1\" indique la version 1. Le composant d'horodatage garantit que les UUIDs sont ordonnés chronologiquement, tandis que l'adresse MAC et la séquence d'horloge aident à prévenir les collisions même entre différentes machines. Comme l'UUID v1 encode à la fois les informations temporelles et matérielles, il offre de solides garanties d'unicité, mais soulève également des préoccupations en matière de confidentialité, car il peut potentiellement révéler l'heure exacte et l'origine de la génération. Il est couramment utilisé dans les systèmes hérités ou les applications nécessitant un tri basé sur le temps, bien que l'UUID v4 soit généralement préféré dans les logiciels modernes pour sa simplicité et sa meilleure confidentialité."
  },
  "de": {
    "title": "Was ist UUID v1?",
    "description": "UUID v1 ist ein 128-Bit universell eindeutiger Bezeichner, der durch eine Kombination aus aktuellem Zeitstempel, einer Uhrsequenz und der MAC-Adresse des Geräts generiert wird. Er wird typischerweise als 36-Zeichen-String im Format {uuid} dargestellt, wobei die \"1\" die Version 1 anzeigt. Die Zeitstempel-Komponente stellt sicher, dass UUIDs zeitlich geordnet sind, während die MAC-Adresse und die Uhrsequenz helfen, Kollisionen auch über verschiedene Maschinen hinweg zu verhindern. Da UUID v1 sowohl Zeit- als auch Hardware-Informationen kodiert, bietet er starke Eindeutigkeitsgarantien, wirft aber auch Datenschutzbedenken auf, da er potenziell die genaue Zeit und den Ursprung der Generierung offenlegen kann. Er wird häufig in Legacy-Systemen oder Anwendungen verwendet, die zeitbasierte Sortierung erfordern, obwohl UUID v4 in moderner Software aufgrund seiner Einfachheit und besseren Privatsphäre generell bevorzugt wird."
  },
  "it": {
    "title": "Cos'è UUID v1?",
    "description": "UUID v1 è un identificatore univoco universale a 128 bit generato utilizzando una combinazione del timestamp corrente, una sequenza di clock e l'indirizzo MAC del dispositivo. È tipicamente rappresentato come una stringa di 36 caratteri nel formato {uuid}, dove l'\"1\" indica la versione 1. Il componente timestamp assicura che gli UUID siano ordinati temporalmente, mentre l'indirizzo MAC e la sequenza di clock aiutano a prevenire collisioni anche tra diverse macchine. Poiché UUID v1 codifica sia informazioni temporali che hardware, fornisce forti garanzie di unicità, ma solleva anche preoccupazioni per la privacy, in quanto può potenzialmente esporre l'ora esatta e l'origine della generazione. È comunemente utilizzato in sistemi legacy o applicazioni che richiedono ordinamento basato sul tempo, sebbene UUID v4 sia generalmente preferito nel software moderno per la sua semplicità e migliore privacy."
  },
  "ja": {
    "title": "UUID v1とは？",
    "description": "UUID v1は、現在のタイムスタンプ、クロックシーケンス、デバイスのMACアドレスを組み合わせて生成される128ビットの汎用一意識別子です。通常、{uuid}という形式の36文字の文字列として表現され、\"1\"はバージョン1を示します。タイムスタンプコンポーネントによりUUIDは時間順に並べられ、MACアドレスとクロックシーケンスは異なるマシン間でも衝突を防ぐのに役立ちます。UUID v1は時間とハードウェア情報の両方をエンコードするため、強力な一意性を保証しますが、生成の正確な時間と起源を潜在的に暴露する可能性があるため、プライバシーの懸念も生じます。レガシーシステムや時間ベースのソートが必要なアプリケーションで一般的に使用されますが、現代のソフトウェアではシンプルさとプライバシーの向上からUUID v4が一般的に好まれています。"
  },
  "ko": {
    "title": "UUID v1란?",
    "description": "UUID v1는 현재 타임스탬프, 클록 시퀀스, 장치의 MAC 주소를 조합하여 생성되는 128비트 범용 고유 식별자입니다. 일반적으로 {uuid} 형식의 36자 문자열로 표현되며, \"1\"은 버전 1을 나타냅니다. 타임스탬프 구성 요소는 UUID가 시간 순서대로 정렬되도록 보장하며, MAC 주소와 클록 시퀀스는 서로 다른 기기 간에도 충돌을 방지하는 데 도움이 됩니다. UUID v1는 시간과 하드웨어 정보를 모두 인코딩하기 때문에 강력한 고유성을 보장하지만, 생성의 정확한 시간과 출처를 잠재적으로 노출할 수 있어 개인정보 보호 문제를 제기합니다. 레거시 시스템이나 시간 기반 정렬이 필요한 애플리케이션에서 일반적으로 사용되지만, 현대 소프트웨어에서는 단순성과 더 나은 개인정보 보호를 위해 UUID v4가 일반적으로 선호됩니다."
  },
  "ru": {
    "title": "Что такое UUID v1?",
    "description": "UUID v1 - это 128-битный универсальный уникальный идентификатор, генерируемый с использованием комбинации текущей временной метки, последовательности часов и MAC-адреса устройства. Он обычно представляется в виде 36-символьной строки в формате {uuid}, где \"1\" указывает на версию 1. Компонент временной метки обеспечивает временную упорядоченность UUID, в то время как MAC-адрес и последовательность часов помогают предотвращать коллизии даже между разными машинами. Поскольку UUID v1 кодирует как временную, так и аппаратную информацию, он обеспечивает сильные гарантии уникальности, но также вызывает проблемы с конфиденциальностью, так как может потенциально раскрыть точное время и происхождение генерации. Он обычно используется в устаревших системах или приложениях, требующих сортировки по времени, хотя UUID v4 обычно предпочтительнее в современном программном обеспечении из-за его простоты и лучшей конфиденциальности."
  },
  "pt": {
    "title": "O que é UUID v1?",
    "description": "UUID v1 é um identificador único universal de 128 bits gerado usando uma combinação do timestamp atual, uma sequência de relógio e o endereço MAC do dispositivo. É tipicamente representado como uma string de 36 caracteres no formato {uuid}, onde o \"1\" indica a versão 1. O componente timestamp garante que os UUIDs sejam ordenados temporalmente, enquanto o endereço MAC e a sequência de relógio ajudam a prevenir colisões mesmo entre diferentes máquinas. Como o UUID v1 codifica tanto informações temporais quanto de hardware, ele fornece fortes garantias de unicidade, mas também levanta preocupações de privacidade, pois pode potencialmente expor o tempo exato e a origem da geração. É comumente usado em sistemas legados ou aplicações que requerem ordenação baseada em tempo, embora o UUID v4 seja geralmente preferido em software moderno por sua simplicidade e melhor privacidade."
  },
  "ar": {
    "title": "ما هو UUID v1؟",
    "description": "UUID v1 هو معرف فريد عالمي 128 بت يتم إنشاؤه باستخدام مزيج من الطابع الزمني الحالي وتسلسل الساعة وعنوان MAC للجهاز. يتم تمثيله عادةً كسلسلة من 36 حرفًا بالتنسيق {uuid}، حيث يشير \"1\" إلى الإصدار 1. يضمن مكون الطابع الزمني ترتيب UUIDs زمنيًا، بينما يساعد عنوان MAC وتسلسل الساعة في منع التصادمات حتى عبر الأجهزة المختلفة. نظرًا لأن UUID v1 يقوم بتشفير كل من معلومات الوقت والأجهزة، فإنه يوفر ضمانات قوية للتفرد، ولكنه يثير أيضًا مخاوف الخصوصية، حيث يمكن أن يكشف عن الوقت الدقيق وأصل التوليد. يستخدم عادةً في الأنظمة القديمة أو التطبيقات التي تتطلب الفرز على أساس الوقت، على الرغم من أن UUID v4 مفضل بشكل عام في البرامج الحديثة لبساطته وخصوصيته الأفضل."
  },
  "hi": {
    "title": "UUID v1 क्या है?",
    "description": "UUID v1 एक 128-बिट सार्वभौमिक विशिष्ट पहचानकर्ता है जो वर्तमान टाइमस्टैम्प, घड़ी अनुक्रम और डिवाइस के MAC पते के संयोजन का उपयोग करके उत्पन्न किया जाता है। यह आमतौर पर {uuid} प्रारूप में 36-वर्ण स्ट्रिंग के रूप में प्रदर्शित होता है, जहां \"1\" संस्करण 1 को इंगित करता है। टाइमस्टैम्प घटक सुनिश्चित करता है कि UUID समय-क्रमबद्ध हैं, जबकि MAC पता और घड़ी अनुक्रम विभिन्न मशीनों के बीच भी टकराव को रोकने में मदद करते हैं। क्योंकि UUID v1 समय और हार्डवेयर जानकारी दोनों को एनकोड करता है, यह मजबूत विशिष्टता गारंटी प्रदान करता है, लेकिन गोपनीयता चिंताओं को भी जन्म देता है, क्योंकि यह संभावित रूप से उत्पादन का सटीक समय और मूल प्रकट कर सकता है। यह आमतौर पर पुराने सिस्टम या समय-आधारित क्रमबद्धता की आवश्यकता वाले अनुप्रयोगों में उपयोग किया जाता है, हालांकि आधुनिक सॉफ्टवेयर में UUID v4 को इसकी सरलता और बेहतर गोपनीयता के लिए आमतौर पर पसंद किया जाता है।"
  },
  "tr": {
    "title": "UUID v1 nedir?",
    "description": "UUID v1, mevcut zaman damgası, saat dizisi ve cihazın MAC adresinin bir kombinasyonu kullanılarak oluşturulan 128-bit evrensel benzersiz tanımlayıcıdır. Genellikle {uuid} formatında 36 karakterlik bir dize olarak temsil edilir, burada \"1\" sürüm 1'i belirtir. Zaman damgası bileşeni UUID'lerin zaman sıralı olmasını sağlarken, MAC adresi ve saat dizisi farklı makineler arasında bile çakışmaları önlemeye yardımcı olur. UUID v1 hem zaman hem de donanım bilgilerini kodladığı için güçlü benzersizlik garantileri sağlar, ancak oluşturmanın tam zamanını ve kaynağını potansiyel olarak açığa çıkarabileceği için gizlilik endişelerini de beraberinde getirir. Genellikle eski sistemlerde veya zaman tabanlı sıralama gerektiren uygulamalarda kullanılır, ancak UUID v4 modern yazılımda basitliği ve daha iyi gizliliği nedeniyle genellikle tercih edilir."
  },
  "nl": {
    "title": "Wat is UUID v1?",
    "description": "UUID v1 is een 128-bits universeel unieke identifier die wordt gegenereerd met een combinatie van de huidige timestamp, een kloksequentie en het MAC-adres van het apparaat. Het wordt meestal weergegeven als een 36-tekens string in het formaat {uuid}, waarbij de \"1\" versie 1 aangeeft. De timestamp-component zorgt ervoor dat UUIDs tijdgeordend zijn, terwijl het MAC-adres en de kloksequentie helpen om botsingen te voorkomen, zelfs tussen verschillende machines. Omdat UUID v1 zowel tijd- als hardware-informatie codeert, biedt het sterke uniciteitsgaranties, maar roept het ook privacyzorgen op, omdat het mogelijk de exacte tijd en oorsprong van generatie kan onthullen. Het wordt veel gebruikt in legacy-systemen of toepassingen die tijdgebaseerde sortering vereisen, hoewel UUID v4 in moderne software over het algemeen de voorkeur geniet vanwege zijn eenvoud en betere privacy."
  },
  "sv": {
    "title": "Vad är UUID v1?",
    "description": "UUID v1 är en 128-bitars universellt unik identifierare som genereras med en kombination av aktuell tidsstämpel, klocksekvens och enhetens MAC-adress. Den visas vanligtvis som en 36-tecken sträng i formatet {uuid}, där \"1\" indikerar version 1. Tidsstämpelkomponenten säkerställer att UUID:er är tidsordnade, medan MAC-adressen och klocksekvensen hjälper till att förhindra kollisioner även mellan olika maskiner. Eftersom UUID v1 koder både tids- och hårdvaruinformation ger den starka unikhetsgarantier, men väcker också integritetsfrågor eftersom den potentiellt kan avslöja exakt tid och ursprung för genereringen. Den används vanligtvis i äldre system eller applikationer som kräver tidsbaserad sortering, även om UUID v4 generellt föredras i modern programvara för dess enkelhet och bättre integritet."
  },
  "pl": {
    "title": "Co to jest UUID v1?",
    "description": "UUID v1 to 128-bitowy uniwersalny unikalny identyfikator generowany przy użyciu kombinacji aktualnego znacznika czasu, sekwencji zegara i adresu MAC urządzenia. Jest zazwyczaj reprezentowany jako 36-znakowy ciąg w formacie {uuid}, gdzie \"1\" oznacza wersję 1. Składnik znacznika czasu zapewnia, że UUID są uporządkowane czasowo, podczas gdy adres MAC i sekwencja zegara pomagają zapobiegać kolizjom nawet między różnymi maszynami. Ponieważ UUID v1 koduje zarówno informacje czasowe, jak i sprzętowe, zapewnia silne gwarancje unikalności, ale budzi również obawy dotyczące prywatności, ponieważ może potencjalnie ujawnić dokładny czas i pochodzenie generowania. Jest powszechnie używany w systemach legacy lub aplikacjach wymagających sortowania opartego na czasie, chociaż UUID v4 jest generalnie preferowany we współczesnym oprogramowaniu ze względu na jego prostotę i lepszą prywatność."
  },
  "vi": {
    "title": "UUID v1 là gì?",
    "description": "UUID v1 là một định danh duy nhất phổ quát 128-bit được tạo bằng cách sử dụng kết hợp dấu thời gian hiện tại, chuỗi đồng hồ và địa chỉ MAC của thiết bị. Nó thường được biểu diễn dưới dạng chuỗi 36 ký tự theo định dạng {uuid}, trong đó \"1\" chỉ phiên bản 1. Thành phần dấu thời gian đảm bảo rằng UUID được sắp xếp theo thời gian, trong khi địa chỉ MAC và chuỗi đồng hồ giúp ngăn chặn va chạm ngay cả giữa các máy khác nhau. Vì UUID v1 mã hóa cả thông tin thời gian và phần cứng, nó cung cấp đảm bảo tính duy nhất mạnh mẽ, nhưng cũng nêu lên mối quan tâm về quyền riêng tư, vì nó có thể tiềm ẩn tiết lộ thời gian chính xác và nguồn gốc của việc tạo. Nó thường được sử dụng trong các hệ thống cũ hoặc ứng dụng yêu cầu sắp xếp dựa trên thời gian, mặc dù UUID v4 thường được ưa chuộng trong phần mềm hiện đại vì tính đơn giản và quyền riêng tư tốt hơn."
  },
  "th": {
    "title": "UUID v1 คืออะไร?",
    "description": "UUID v1 เป็นตัวระบุเฉพาะสากล 128 บิตที่สร้างขึ้นโดยใช้การรวมกันของเวลาปัจจุบัน ลำดับนาฬิกา และที่อยู่ MAC ของอุปกรณ์ โดยทั่วไปจะแสดงเป็นสตริง 36 ตัวอักษรในรูปแบบ {uuid} โดยที่ \"1\" ระบุเวอร์ชัน 1 ส่วนประกอบเวลาช่วยให้แน่ใจว่า UUID เรียงตามเวลา ในขณะที่ที่อยู่ MAC และลำดับนาฬิกาช่วยป้องกันการชนกันแม้ระหว่างเครื่องต่างๆ เนื่องจาก UUID v1 เข้ารหัสทั้งข้อมูลเวลาและฮาร์ดแวร์ จึงให้การรับประกันความไม่ซ้ำกันที่แข็งแกร่ง แต่ก็ก่อให้เกิดความกังวลเรื่องความเป็นส่วนตัว เนื่องจากอาจเปิดเผยเวลาที่แน่นอนและต้นกำเนิดของการสร้างได้ มักใช้ในระบบเก่าหรือแอปพลิเคชันที่ต้องการการเรียงลำดับตามเวลา แม้ว่า UUID v4 จะเป็นที่นิยมในซอฟต์แวร์สมัยใหม่เนื่องจากความเรียบง่ายและความเป็นส่วนตัวที่ดีกว่า"
  },
  "id": {
    "title": "Apa itu UUID v1?",
    "description": "UUID v1 adalah pengidentifikasi unik universal 128-bit yang dihasilkan menggunakan kombinasi timestamp saat ini, urutan jam, dan alamat MAC perangkat. Biasanya direpresentasikan sebagai string 36 karakter dalam format {uuid}, di mana \"1\" menunjukkan versi 1. Komponen timestamp memastikan bahwa UUID diurutkan berdasarkan waktu, sementara alamat MAC dan urutan jam membantu mencegah tabrakan bahkan di antara mesin yang berbeda. Karena UUID v1 mengkodekan informasi waktu dan perangkat keras, ia memberikan jaminan keunikan yang kuat, tetapi juga menimbulkan masalah privasi, karena berpotensi mengungkap waktu yang tepat dan asal generasi. Umumnya digunakan dalam sistem warisan atau aplikasi yang memerlukan pengurutan berbasis waktu, meskipun UUID v4 umumnya lebih disukai dalam perangkat lunak modern karena kesederhanaan dan privasi yang lebih baik."
  },
  "he": {
    "title": "?UUID v1 מהו",
    "description": "UUID v1 הוא מזהה ייחודי אוניברסלי 128-ביט שנוצר באמצעות שילוב של חותמת הזמן הנוכחית, רצף שעון וכתובת ה-MAC של המכשיר. הוא מוצג בדרך כלל כמחרוזת של 36 תווים בפורמט {uuid}, כאשר ה-\"1\" מציין גרסה 1. רכיב חותמת הזמן מוודא שה-UUID מסודרים לפי זמן, בעוד שכתובת ה-MAC ורצף השעון עוזרים למנוע התנגשויות אפילו בין מכונות שונות. מכיוון ש-UUID v1 מקודד מידע על זמן וחומרה, הוא מספק ערבויות ייחודיות חזקות, אך גם מעלה חששות פרטיות, שכן הוא עלול לחשוף את הזמן המדויק והמקור של היצירה. הוא משמש בדרך כלל במערכות מורשת או ביישומים הדורשים מיון מבוסס זמן, אם כי UUID v4 מועדף בדרך כלל בתוכנה מודרנית בשל פשטותו ופרטיותו הטובה יותר."
  },
  "ms": {
    "title": "Apakah UUID v1?",
    "description": "UUID v1 ialah pengenalan unik sejagat 128-bit yang dijana menggunakan gabungan cap masa semasa, urutan jam, dan alamat MAC peranti. Ia biasanya dipaparkan sebagai rentetan 36 aksara dalam format {uuid}, di mana \"1\" menunjukkan versi 1. Komponen cap masa memastikan UUID disusun mengikut masa, manakala alamat MAC dan urutan jam membantu mencegah perlanggaran walaupun antara mesin yang berbeza. Oleh kerana UUID v1 menyulitkan maklumat masa dan perkakasan, ia menyediakan jaminan keunikan yang kuat, tetapi juga menimbulkan kebimbangan privasi, kerana berpotensi mendedahkan masa yang tepat dan asal penjanaan. Ia digunakan secara meluas dalam sistem warisan atau aplikasi yang memerlukan susunan berasaskan masa, walaupun UUID v4 biasanya lebih disukai dalam perisian moden kerana kesederhanaan dan privasi yang lebih baik."
  },
  "no": {
    "title": "Hva er UUID v1?",
    "description": "UUID v1 er en 128-bit universelt unik identifikator som genereres ved hjelp av en kombinasjon av gjeldende tidsstempel, klokkesekvens og enhetens MAC-adresse. Den vises typisk som en 36-tegns streng i formatet {uuid}, hvor \"1\" indikerer versjon 1. Tidsstempelkomponenten sikrer at UUID-er er tidsordnet, mens MAC-adressen og klokkesekvensen hjelper til med å forhindre kollisjoner selv mellom forskjellige maskiner. Siden UUID v1 koder både tids- og maskinvareinformasjon, gir den sterke unikhetsgarantier, men reiser også personvernhensyn, da den potensielt kan avsløre nøyaktig tid og opprinnelse for genereringen. Den brukes vanligtvis i eldre systemer eller applikasjoner som krever tidsbasert sortering, selv om UUID v4 generellt foretrekkes i moderne programvare på grunn av sin enkelhet og bedre personvern."
  }
}
</i18n>
