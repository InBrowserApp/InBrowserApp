<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <i18n-t keypath="description">
      <template #uuid>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-text code>xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx</n-text>
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
    "title": "What is UUID v6?",
    "description": "UUID v6 is a 128-bit universally unique identifier that improves upon UUID v1 by reordering the timestamp bits to enable better time-based sorting. It's typically represented as a 36-character string in the format {uuid}, where the \"6\" indicates version 6. Like UUID v1, it uses a combination of timestamp, clock sequence, and node ID, but the timestamp bits are arranged in a more logical order. This makes UUID v6 particularly useful for applications requiring time-ordered UUIDs while maintaining the same strong uniqueness guarantees as UUID v1. However, it still includes node information, which may raise similar privacy concerns as UUID v1. UUID v6 is ideal for modern distributed systems where time-based sorting is important, offering better timestamp handling than v1 while maintaining backward compatibility with its structure."
  },
  "zh": {
    "title": "什么是 UUID v6？",
    "description": "UUID v6 是一个 128 位通用唯一标识符，它通过重新排列时间戳位来改进 UUID v1，以实现更好的基于时间的排序。它通常以 36 个字符的字符串形式表示，格式为 {uuid}，其中 \"6\" 表示版本 6。与 UUID v1 一样，它使用时间戳、时钟序列和节点 ID 的组合，但时间戳位以更合理的顺序排列。这使得 UUID v6 特别适用于需要时间排序的 UUID 的应用程序，同时保持与 UUID v1 相同的强大唯一性保证。但是，它仍然包含节点信息，这可能会引起与 UUID v1 类似的隐私问题。UUID v6 非常适合需要基于时间排序的现代分布式系统，提供比 v1 更好的时间戳处理，同时保持与其结构的向后兼容性。"
  },
  "zh-CN": {
    "title": "什么是 UUID v6？",
    "description": "UUID v6 是一个 128 位通用唯一标识符，它通过重新排列时间戳位来改进 UUID v1，以实现更好的基于时间的排序。它通常以 36 个字符的字符串形式表示，格式为 {uuid}，其中 \"6\" 表示版本 6。与 UUID v1 一样，它使用时间戳、时钟序列和节点 ID 的组合，但时间戳位以更合理的顺序排列。这使得 UUID v6 特别适用于需要时间排序的 UUID 的应用程序，同时保持与 UUID v1 相同的强大唯一性保证。但是，它仍然包含节点信息，这可能会引起与 UUID v1 类似的隐私问题。UUID v6 非常适合需要基于时间排序的现代分布式系统，提供比 v1 更好的时间戳处理，同时保持与其结构的向后兼容性。"
  },
  "zh-TW": {
    "title": "什麼是 UUID v6？",
    "description": "UUID v6 是一個 128 位通用唯一識別碼，它通過重新排列時間戳位來改進 UUID v1，以實現更好的基於時間的排序。它通常以 36 個字元的字串形式表示，格式為 {uuid}，其中 \"6\" 表示版本 6。與 UUID v1 一樣，它使用時間戳、時鐘序列和節點 ID 的組合，但時間戳位以更合理的順序排列。這使得 UUID v6 特別適用於需要時間排序的 UUID 的應用程式，同時保持與 UUID v1 相同的強大唯一性保證。但是，它仍然包含節點資訊，這可能會引起與 UUID v1 類似的隱私問題。UUID v6 非常適合需要基於時間排序的現代分散式系統，提供比 v1 更好的時間戳處理，同時保持與其結構的向後相容性。"
  },
  "zh-HK": {
    "title": "什麼是 UUID v6？",
    "description": "UUID v6 是一個 128 位通用唯一識別碼，它通過重新排列時間戳位來改進 UUID v1，以實現更好的基於時間的排序。它通常以 36 個字元的字串形式表示，格式為 {uuid}，其中 \"6\" 表示版本 6。與 UUID v1 一樣，它使用時間戳、時鐘序列和節點 ID 的組合，但時間戳位以更合理的順序排列。這使得 UUID v6 特別適用於需要時間排序的 UUID 的應用程式，同時保持與 UUID v1 相同的強大唯一性保證。但是，它仍然包含節點資訊，這可能會引起與 UUID v1 類似的隱私問題。UUID v6 非常適合需要基於時間排序的現代分散式系統，提供比 v1 更好的時間戳處理，同時保持與其結構的向後相容性。"
  },
  "es": {
    "title": "¿Qué es UUID v6?",
    "description": "UUID v6 es un identificador único universal de 128 bits que mejora UUID v1 al reordenar los bits de marca de tiempo para permitir una mejor ordenación basada en tiempo. Típicamente se representa como una cadena de 36 caracteres en el formato {uuid}, donde el \"6\" indica la versión 6. Al igual que UUID v1, utiliza una combinación de marca de tiempo, secuencia de reloj e ID de nodo, pero los bits de marca de tiempo están organizados en un orden más lógico. Esto hace que UUID v6 sea particularmente útil para aplicaciones que requieren UUIDs ordenados por tiempo mientras mantiene las mismas garantías de unicidad que UUID v1. Sin embargo, aún incluye información del nodo, lo que puede plantear preocupaciones de privacidad similares a UUID v1. UUID v6 es ideal para sistemas distribuidos modernos donde la ordenación basada en tiempo es importante, ofreciendo un mejor manejo de marcas de tiempo que v1 mientras mantiene la compatibilidad con su estructura."
  },
  "fr": {
    "title": "Qu'est-ce que l'UUID v6 ?",
    "description": "L'UUID v6 est un identifiant unique universel de 128 bits qui améliore l'UUID v1 en réorganisant les bits d'horodatage pour permettre un meilleur tri basé sur le temps. Il est généralement représenté sous forme d'une chaîne de 36 caractères au format {uuid}, où le \"6\" indique la version 6. Comme l'UUID v1, il utilise une combinaison d'horodatage, de séquence d'horloge et d'ID de nœud, mais les bits d'horodatage sont disposés dans un ordre plus logique. Cela rend l'UUID v6 particulièrement utile pour les applications nécessitant des UUID ordonnés dans le temps tout en maintenant les mêmes garanties d'unicité que l'UUID v1. Cependant, il inclut toujours des informations sur le nœud, ce qui peut soulever des préoccupations de confidentialité similaires à l'UUID v1. L'UUID v6 est idéal pour les systèmes distribués modernes où le tri basé sur le temps est important, offrant une meilleure gestion des horodatages que v1 tout en maintenant la compatibilité avec sa structure."
  },
  "de": {
    "title": "Was ist UUID v6?",
    "description": "UUID v6 ist ein 128-Bit universell eindeutiger Bezeichner, der UUID v1 durch Neuanordnung der Zeitstempel-Bits verbessert, um eine bessere zeitbasierte Sortierung zu ermöglichen. Er wird typischerweise als 36-Zeichen-String im Format {uuid} dargestellt, wobei die \"6\" die Version 6 anzeigt. Wie UUID v1 verwendet er eine Kombination aus Zeitstempel, Uhrsequenz und Knoten-ID, aber die Zeitstempel-Bits sind in einer logischeren Reihenfolge angeordnet. Dies macht UUID v6 besonders nützlich für Anwendungen, die zeitlich geordnete UUIDs benötigen, während die gleichen Eindeutigkeitsgarantien wie bei UUID v1 beibehalten werden. Allerdings enthält er weiterhin Knoteninformationen, was ähnliche Datenschutzbedenken wie bei UUID v1 aufwerfen kann. UUID v6 ist ideal für moderne verteilte Systeme, bei denen zeitbasierte Sortierung wichtig ist, und bietet eine bessere Zeitstempelverarbeitung als v1 bei gleichzeitiger Beibehaltung der Kompatibilität mit seiner Struktur."
  },
  "it": {
    "title": "Cos'è UUID v6?",
    "description": "UUID v6 è un identificatore univoco universale a 128 bit che migliora UUID v1 riordinando i bit del timestamp per consentire un migliore ordinamento basato sul tempo. È tipicamente rappresentato come una stringa di 36 caratteri nel formato {uuid}, dove il \"6\" indica la versione 6. Come UUID v1, utilizza una combinazione di timestamp, sequenza di clock e ID del nodo, ma i bit del timestamp sono disposti in un ordine più logico. Questo rende UUID v6 particolarmente utile per applicazioni che richiedono UUID ordinati temporalmente mantenendo le stesse garanzie di unicità di UUID v1. Tuttavia, include ancora informazioni sul nodo, che possono sollevare preoccupazioni sulla privacy simili a UUID v1. UUID v6 è ideale per sistemi distribuiti moderni dove l'ordinamento basato sul tempo è importante, offrendo una migliore gestione dei timestamp rispetto a v1 mantenendo la compatibilità con la sua struttura."
  },
  "ja": {
    "title": "UUID v6とは？",
    "description": "UUID v6は、タイムスタンプビットを再配置してより良い時間ベースの並べ替えを可能にすることでUUID v1を改良した128ビットの汎用一意識別子です。通常、{uuid}という形式の36文字の文字列として表現され、\"6\"はバージョン6を示します。UUID v1と同様に、タイムスタンプ、クロックシーケンス、ノードIDの組み合わせを使用しますが、タイムスタンプビットがより論理的な順序で配置されています。これにより、UUID v6はUUID v1と同じ強力な一意性保証を維持しながら、時間順のUUIDを必要とするアプリケーションに特に適しています。ただし、ノード情報も含まれているため、UUID v1と同様のプライバシーの懸念が生じる可能性があります。UUID v6は、時間ベースの並べ替えが重要な現代の分散システムに理想的で、その構造との後方互換性を維持しながらv1よりも優れたタイムスタンプ処理を提供します。"
  },
  "ko": {
    "title": "UUID v6란?",
    "description": "UUID v6는 타임스탬프 비트를 재배열하여 더 나은 시간 기반 정렬을 가능하게 함으로써 UUID v1을 개선한 128비트 범용 고유 식별자입니다. 일반적으로 {uuid} 형식의 36자 문자열로 표현되며, \"6\"은 버전 6을 나타냅니다. UUID v1과 마찬가지로 타임스탬프, 클록 시퀀스, 노드 ID의 조합을 사용하지만, 타임스탬프 비트가 더 논리적인 순서로 배열되어 있습니다. 이로 인해 UUID v6는 UUID v1과 동일한 강력한 고유성 보장을 유지하면서 시간 순서가 지정된 UUID가 필요한 애플리케이션에 특히 유용합니다. 그러나 여전히 노드 정보를 포함하고 있어 UUID v1과 유사한 개인정보 보호 문제가 발생할 수 있습니다. UUID v6는 시간 기반 정렬이 중요한 현대 분산 시스템에 이상적이며, 구조와의 하위 호환성을 유지하면서 v1보다 더 나은 타임스탬프 처리를 제공합니다."
  },
  "ru": {
    "title": "Что такое UUID v6?",
    "description": "UUID v6 - это 128-битный универсальный уникальный идентификатор, который улучшает UUID v1 путем переупорядочивания битов временной метки для обеспечения лучшей сортировки по времени. Он обычно представляется в виде 36-символьной строки в формате {uuid}, где \"6\" указывает на версию 6. Как и UUID v1, он использует комбинацию временной метки, последовательности часов и ID узла, но биты временной метки расположены в более логичном порядке. Это делает UUID v6 особенно полезным для приложений, требующих упорядоченных по времени UUID, сохраняя те же гарантии уникальности, что и UUID v1. Однако он по-прежнему включает информацию об узле, что может вызывать проблемы с конфиденциальностью, аналогичные UUID v1. UUID v6 идеально подходит для современных распределенных систем, где важна сортировка по времени, предлагая лучшую обработку временных меток, чем v1, при сохранении обратной совместимости с его структурой."
  },
  "pt": {
    "title": "O que é UUID v6?",
    "description": "UUID v6 é um identificador único universal de 128 bits que melhora o UUID v1 ao reordenar os bits de timestamp para permitir uma melhor ordenação baseada em tempo. É tipicamente representado como uma string de 36 caracteres no formato {uuid}, onde o \"6\" indica a versão 6. Como o UUID v1, ele usa uma combinação de timestamp, sequência de relógio e ID do nó, mas os bits de timestamp são organizados em uma ordem mais lógica. Isso torna o UUID v6 particularmente útil para aplicações que requerem UUIDs ordenados por tempo enquanto mantém as mesmas garantias de unicidade do UUID v1. No entanto, ainda inclui informações do nó, o que pode levantar preocupações de privacidade similares ao UUID v1. UUID v6 é ideal para sistemas distribuídos modernos onde a ordenação baseada em tempo é importante, oferecendo melhor manipulação de timestamp que v1 enquanto mantém compatibilidade com sua estrutura."
  },
  "ar": {
    "title": "ما هو UUID v6؟",
    "description": "UUID v6 هو معرف فريد عالمي 128 بت يحسن UUID v1 من خلال إعادة ترتيب بتات الطابع الزمني للسماح بترتيب أفضل على أساس الوقت. يتم تمثيله عادةً كسلسلة من 36 حرفًا بالتنسيق {uuid}، حيث يشير \"6\" إلى الإصدار 6. مثل UUID v1، يستخدم مزيجًا من الطابع الزمني وتسلسل الساعة ومعرف العقدة، ولكن بتات الطابع الزمني مرتبة بترتيب أكثر منطقية. هذا يجعل UUID v6 مفيدًا بشكل خاص للتطبيقات التي تتطلب UUIDs مرتبة زمنياً مع الحفاظ على نفس ضمانات التفرد مثل UUID v1. ومع ذلك، لا يزال يتضمن معلومات العقدة، مما قد يثير مخاوف مماثلة بشأن الخصوصية مثل UUID v1. UUID v6 مثالي للأنظمة الموزعة الحديثة حيث يكون الترتيب على أساس الوقت مهمًا، ويوفر معالجة أفضل للطوابع الزمنية من v1 مع الحفاظ على التوافق مع هيكله."
  },
  "hi": {
    "title": "UUID v6 क्या है?",
    "description": "UUID v6 एक 128-बिट सार्वभौमिक विशिष्ट पहचानकर्ता है जो बेहतर समय-आधारित क्रमबद्धता को सक्षम करने के लिए टाइमस्टैम्प बिट्स को पुनर्व्यवस्थित करके UUID v1 को सुधारता है। यह आमतौर पर {uuid} प्रारूप में 36-वर्ण स्ट्रिंग के रूप में प्रदर्शित होता है, जहां \"6\" संस्करण 6 को इंगित करता है। UUID v1 की तरह, यह टाइमस्टैम्प, घड़ी अनुक्रम और नोड आईडी के संयोजन का उपयोग करता है, लेकिन टाइमस्टैम्प बिट्स अधिक तार्किक क्रम में व्यवस्थित हैं। यह UUID v6 को विशेष रूप से उन अनुप्रयोगों के लिए उपयोगी बनाता है जिन्हें समय-क्रमित UUID की आवश्यकता होती है, जबकि UUID v1 के समान विशिष्टता गारंटी बनाए रखता है। हालांकि, इसमें अभी भी नोड जानकारी शामिल है, जो UUID v1 के समान गोपनीयता चिंताएं उठा सकती है। UUID v6 आधुनिक वितरित प्रणालियों के लिए आदर्श है जहां समय-आधारित क्रमबद्धता महत्वपूर्ण है, जो अपनी संरचना के साथ संगतता बनाए रखते हुए v1 से बेहतर टाइमस्टैम्प प्रबंधन प्रदान करता है।"
  },
  "tr": {
    "title": "UUID v6 nedir?",
    "description": "UUID v6, zaman damgası bitlerini yeniden düzenleyerek daha iyi zaman tabanlı sıralamaya olanak sağlayan ve UUID v1'i geliştiren 128 bitlik evrensel benzersiz tanımlayıcıdır. Genellikle {uuid} formatında 36 karakterlik bir dize olarak temsil edilir, burada \"6\" sürüm 6'yı belirtir. UUID v1 gibi, zaman damgası, saat dizisi ve düğüm kimliğinin bir kombinasyonunu kullanır, ancak zaman damgası bitleri daha mantıksal bir düzende düzenlenmiştir. Bu, UUID v6'yı UUID v1 ile aynı benzersizlik garantilerini korurken zamana göre sıralanmış UUID'ler gerektiren uygulamalar için özellikle kullanışlı kılar. Ancak hala düğüm bilgilerini içerir, bu da UUID v1'e benzer gizlilik endişelerine neden olabilir. UUID v6, zaman tabanlı sıralamanın önemli olduğu modern dağıtık sistemler için idealdir ve yapısıyla geriye dönük uyumluluğu korurken v1'den daha iyi zaman damgası işleme sunar."
  },
  "nl": {
    "title": "Wat is UUID v6?",
    "description": "UUID v6 is een 128-bits universeel unieke identifier die UUID v1 verbetert door de timestamp-bits te herordenen voor betere tijdgebaseerde sortering. Het wordt meestal weergegeven als een 36-tekens string in het formaat {uuid}, waarbij de \"6\" versie 6 aangeeft. Net als UUID v1 gebruikt het een combinatie van timestamp, kloksequentie en node-ID, maar de timestamp-bits zijn in een logischere volgorde gerangschikt. Dit maakt UUID v6 bijzonder nuttig voor toepassingen die tijdgeordende UUID's vereisen terwijl dezelfde uniciteitgaranties als UUID v1 behouden blijven. Het bevat echter nog steeds node-informatie, wat vergelijkbare privacyzorgen als UUID v1 kan oproepen. UUID v6 is ideaal voor moderne gedistribueerde systemen waar tijdgebaseerde sortering belangrijk is, met betere timestamp-verwerking dan v1 terwijl de compatibiliteit met zijn structuur behouden blijft."
  },
  "sv": {
    "title": "Vad är UUID v6?",
    "description": "UUID v6 är en 128-bitars universellt unik identifierare som förbättrar UUID v1 genom att omordna tidsstämpelbitarna för att möjliggöra bättre tidsbaserad sortering. Den visas vanligtvis som en 36-teckens sträng i formatet {uuid}, där \"6\" indikerar version 6. Precis som UUID v1 använder den en kombination av tidsstämpel, klocksekvens och nod-ID, men tidsstämpelbitarna är arrangerade i en mer logisk ordning. Detta gör UUID v6 särskilt användbar för applikationer som kräver tidsordnade UUID:er medan samma unikhetsgarantier som UUID v1 bibehålls. Den innehåller dock fortfarande nodinformation, vilket kan väcka liknande integritetsfrågor som UUID v1. UUID v6 är idealisk för moderna distribuerade system där tidsbaserad sortering är viktig, och erbjuder bättre tidsstämpelhantering än v1 medan bakåtkompatibilitet med dess struktur bibehålls."
  },
  "pl": {
    "title": "Co to jest UUID v6?",
    "description": "UUID v6 to 128-bitowy uniwersalny unikalny identyfikator, który ulepsza UUID v1 poprzez zmianę kolejności bitów znacznika czasu, aby umożliwić lepsze sortowanie oparte na czasie. Jest zazwyczaj reprezentowany jako 36-znakowy ciąg w formacie {uuid}, gdzie \"6\" oznacza wersję 6. Podobnie jak UUID v1, wykorzystuje kombinację znacznika czasu, sekwencji zegara i ID węzła, ale bity znacznika czasu są ułożone w bardziej logicznej kolejności. To sprawia, że UUID v6 jest szczególnie przydatny w aplikacjach wymagających UUID-ów uporządkowanych czasowo, zachowując te same gwarancje unikalności co UUID v1. Jednak nadal zawiera informacje o węźle, co może budzić podobne obawy dotyczące prywatności jak UUID v1. UUID v6 jest idealny dla nowoczesnych systemów rozproszonych, gdzie ważne jest sortowanie oparte na czasie, oferując lepszą obsługę znaczników czasu niż v1, zachowując jednocześnie kompatybilność wsteczną ze swoją strukturą."
  },
  "vi": {
    "title": "UUID v6 là gì?",
    "description": "UUID v6 là một định danh duy nhất phổ quát 128-bit cải tiến từ UUID v1 bằng cách sắp xếp lại các bit dấu thời gian để cho phép sắp xếp theo thời gian tốt hơn. Nó thường được biểu diễn dưới dạng chuỗi 36 ký tự theo định dạng {uuid}, trong đó \"6\" chỉ phiên bản 6. Giống như UUID v1, nó sử dụng kết hợp dấu thời gian, chuỗi đồng hồ và ID nút, nhưng các bit dấu thời gian được sắp xếp theo thứ tự hợp lý hơn. Điều này làm cho UUID v6 đặc biệt hữu ích cho các ứng dụng yêu cầu UUID được sắp xếp theo thời gian trong khi vẫn duy trì các đảm bảo tính duy nhất như UUID v1. Tuy nhiên, nó vẫn bao gồm thông tin nút, điều này có thể gây ra các lo ngại về quyền riêng tư tương tự như UUID v1. UUID v6 lý tưởng cho các hệ thống phân tán hiện đại nơi việc sắp xếp theo thời gian là quan trọng, cung cấp xử lý dấu thời gian tốt hơn v1 trong khi vẫn duy trì khả năng tương thích với cấu trúc của nó."
  },
  "th": {
    "title": "UUID v6 คืออะไร?",
    "description": "UUID v6 เป็นตัวระบุเฉพาะสากล 128 บิตที่ปรับปรุง UUID v1 โดยการจัดเรียงบิตของเวลาใหม่เพื่อให้สามารถเรียงลำดับตามเวลาได้ดีขึ้น โดยทั่วไปจะแสดงเป็นสตริง 36 ตัวอักษรในรูปแบบ {uuid} โดยที่ \"6\" ระบุเวอร์ชัน 6 เช่นเดียวกับ UUID v1 มันใช้การผสมผสานของเวลา ลำดับนาฬิกา และ ID โหนด แต่บิตของเวลาถูกจัดเรียงในลำดับที่เป็นเหตุเป็นผลมากขึ้น สิ่งนี้ทำให้ UUID v6 มีประโยชน์อย่างยิ่งสำหรับแอปพลิเคชันที่ต้องการ UUID ที่เรียงตามเวลาในขณะที่ยังคงรักษาการรับประกันความไม่ซ้ำกันเช่นเดียวกับ UUID v1 อย่างไรก็ตาม ยังคงมีข้อมูลโหนดรวมอยู่ด้วย ซึ่งอาจก่อให้เกิดความกังวลด้านความเป็นส่วนตัวเช่นเดียวกับ UUID v1 UUID v6 เหมาะสำหรับระบบกระจายสมัยใหม่ที่การเรียงลำดับตามเวลามีความสำคัญ โดยให้การจัดการเวลาที่ดีกว่า v1 ในขณะที่ยังคงรักษาความเข้ากันได้กับโครงสร้างของมัน"
  },
  "id": {
    "title": "Apa itu UUID v6?",
    "description": "UUID v6 adalah pengidentifikasi unik universal 128-bit yang meningkatkan UUID v1 dengan menyusun ulang bit timestamp untuk memungkinkan pengurutan berbasis waktu yang lebih baik. Biasanya direpresentasikan sebagai string 36 karakter dalam format {uuid}, di mana \"6\" menunjukkan versi 6. Seperti UUID v1, ia menggunakan kombinasi timestamp, urutan jam, dan ID node, tetapi bit timestamp disusun dalam urutan yang lebih logis. Ini membuat UUID v6 sangat berguna untuk aplikasi yang memerlukan UUID yang diurutkan berdasarkan waktu sambil mempertahankan jaminan keunikan yang sama seperti UUID v1. Namun, ia masih menyertakan informasi node, yang dapat menimbulkan masalah privasi yang mirip dengan UUID v1. UUID v6 ideal untuk sistem terdistribusi modern di mana pengurutan berbasis waktu penting, menawarkan penanganan timestamp yang lebih baik daripada v1 sambil mempertahankan kompatibilitas dengan strukturnya."
  },
  "he": {
    "title": "?UUID v6 מהו",
    "description": "UUID v6 הוא מזהה ייחודי אוניברסלי 128-ביט שמשפר את UUID v1 על ידי סידור מחדש של ביטי חותמת הזמן כדי לאפשר מיון טוב יותר מבוסס זמן. הוא מוצג בדרך כלל כמחרוזת של 36 תווים בפורמט {uuid}, כאשר ה-\"6\" מציין גרסה 6. כמו UUID v1, הוא משתמש בשילוב של חותמת זמן, רצף שעון ומזהה צומת, אך ביטי חותמת הזמן מסודרים בסדר לוגי יותר. זה הופך את UUID v6 לשימושי במיוחד עבור יישומים הדורשים UUIDs ממוינים לפי זמן תוך שמירה על אותן ערבויות ייחודיות כמו UUID v1. עם זאת, הוא עדיין כולל מידע על הצומת, מה שעלול לעורר חששות פרטיות דומים ל-UUID v1. UUID v6 אידיאלי למערכות מבוזרות מודרניות שבהן מיון מבוסס זמן חשוב, ומציע טיפול טוב יותר בחותמות זמן מאשר v1 תוך שמירה על תאימות עם המבנה שלו."
  },
  "ms": {
    "title": "Apakah UUID v6?",
    "description": "UUID v6 ialah pengenalan unik sejagat 128-bit yang meningkatkan UUID v1 dengan menyusun semula bit cap masa untuk membolehkan susunan berasaskan masa yang lebih baik. Ia biasanya dipaparkan sebagai rentetan 36 aksara dalam format {uuid}, di mana \"6\" menunjukkan versi 6. Seperti UUID v1, ia menggunakan gabungan cap masa, urutan jam, dan ID nod, tetapi bit cap masa disusun dalam urutan yang lebih logik. Ini menjadikan UUID v6 amat berguna untuk aplikasi yang memerlukan UUID yang disusun mengikut masa sambil mengekalkan jaminan keunikan yang sama seperti UUID v1. Walau bagaimanapun, ia masih mengandungi maklumat nod, yang boleh menimbulkan kebimbangan privasi yang serupa dengan UUID v1. UUID v6 adalah ideal untuk sistem teragih moden di mana susunan berasaskan masa adalah penting, menawarkan pengendalian cap masa yang lebih baik daripada v1 sambil mengekalkan keserasian dengan strukturnya."
  },
  "no": {
    "title": "Hva er UUID v6?",
    "description": "UUID v6 er en 128-bit universelt unik identifikator som forbedrer UUID v1 ved å omorganisere tidsstempelbitene for å muliggjøre bedre tidsbasert sortering. Den vises typisk som en 36-tegns streng i formatet {uuid}, hvor \"6\" indikerer versjon 6. Som UUID v1 bruker den en kombinasjon av tidsstempel, klokkesekvens og node-ID, men tidsstempelbitene er arrangert i en mer logisk rekkefølge. Dette gjør UUID v6 spesielt nyttig for applikasjoner som krever tidsordnede UUID-er mens de samme unikhetsgarantiene som UUID v1 opprettholdes. Den inneholder imidlertid fortsatt nodeinformasjon, som kan reise lignende personvernhensyn som UUID v1. UUID v6 er ideell for moderne distribuerte systemer hvor tidsbasert sortering er viktig, og tilbyr bedre tidsstempelhåndtering enn v1 mens bakoverkompatibilitet med strukturen opprettholdes."
  }
}
</i18n>
