<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <i18n-t keypath="description">
      <template #uuid>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-text code>ffffffff-ffff-ffff-ffff-ffffffffffff</n-text>
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
    "title": "What is Max UUID?",
    "description": "A Max UUID is a special UUID where all bits are set to one (represented as F in hexadecimal). It is represented as {uuid}. This UUID is used to represent the maximum possible UUID value. It is commonly used in databases and systems to indicate the upper bound of UUID ranges or as a special marker for maximum values. The Max UUID is unique in that it is the only UUID that is guaranteed to be all Fs, making it easily identifiable and useful for special cases in UUID handling."
  },
  "zh": {
    "title": "什么是 Max UUID？",
    "description": "Max UUID 是一个特殊的 UUID，其中所有位都设置为1（在十六进制中表示为F）。它表示为 {uuid}。此 UUID 用于表示最大可能的 UUID 值。它通常用于数据库和系统中，以指示 UUID 范围的上限或作为最大值的特殊标记。Max UUID 的独特之处在于它是唯一保证全为F的 UUID，使其易于识别，并在 UUID 处理的特殊情况下非常有用。"
  },
  "zh-CN": {
    "title": "什么是 Max UUID？",
    "description": "Max UUID 是一个特殊的 UUID，其中所有位都设置为1（在十六进制中表示为F）。它表示为 {uuid}。此 UUID 用于表示最大可能的 UUID 值。它通常用于数据库和系统中，以指示 UUID 范围的上限或作为最大值的特殊标记。Max UUID 的独特之处在于它是唯一保证全为F的 UUID，使其易于识别，并在 UUID 处理的特殊情况下非常有用。"
  },
  "zh-TW": {
    "title": "什麼是 Max UUID？",
    "description": "Max UUID 是一個特殊的 UUID，其中所有位都設置為1（在十六進制中表示為F）。它表示為 {uuid}。此 UUID 用於表示最大可能的 UUID 值。它通常用於數據庫和系統中，以指示 UUID 範圍的上限或作為最大值的特殊標記。Max UUID 的獨特之處在於它是唯一保證全為F的 UUID，使其易於識別，並在 UUID 處理的特殊情況下非常有用。"
  },
  "zh-HK": {
    "title": "什麼是 Max UUID？",
    "description": "Max UUID 是一個特殊的 UUID，其中所有位都設置為1（在十六進制中表示為F）。它表示為 {uuid}。此 UUID 用於表示最大可能的 UUID 值。它通常用於數據庫和系統中，以指示 UUID 範圍的上限或作為最大值的特殊標記。Max UUID 的獨特之處在於它是唯一保證全為F的 UUID，使其易於識別，並在 UUID 處理的特殊情況下非常有用。"
  },
  "es": {
    "title": "¿Qué es Max UUID?",
    "description": "Un Max UUID es un UUID especial donde todos los bits están establecidos en uno (representado como F en hexadecimal). Se representa como {uuid}. Este UUID se utiliza para representar el valor máximo posible de UUID. Se usa comúnmente en bases de datos y sistemas para indicar el límite superior de rangos de UUID o como un marcador especial para valores máximos. El Max UUID es único en que es el único UUID que está garantizado que sea todo Fs, lo que lo hace fácilmente identificable y útil para casos especiales en el manejo de UUID."
  },
  "fr": {
    "title": "Qu'est-ce que Max UUID ?",
    "description": "Un Max UUID est un UUID spécial où tous les bits sont définis à un (représenté comme F en hexadécimal). Il est représenté comme {uuid}. Cet UUID est utilisé pour représenter la valeur UUID maximale possible. Il est couramment utilisé dans les bases de données et les systèmes pour indiquer la limite supérieure des plages d'UUID ou comme marqueur spécial pour les valeurs maximales. Le Max UUID est unique en ce qu'il est le seul UUID garanti d'être entièrement composé de Fs, ce qui le rend facilement identifiable et utile pour les cas spéciaux dans la gestion des UUID."
  },
  "de": {
    "title": "Was ist Max UUID?",
    "description": "Ein Max UUID ist eine spezielle UUID, bei der alle Bits auf Eins gesetzt sind (dargestellt als F in Hexadezimal). Sie wird als {uuid} dargestellt. Diese UUID wird verwendet, um den maximal möglichen UUID-Wert darzustellen. Sie wird häufig in Datenbanken und Systemen verwendet, um die obere Grenze von UUID-Bereichen anzuzeigen oder als spezieller Marker für Maximalwerte. Die Max UUID ist einzigartig darin, dass sie die einzige UUID ist, die garantiert nur aus Fs besteht, was sie leicht erkennbar und nützlich für Sonderfälle in der UUID-Verarbeitung macht."
  },
  "it": {
    "title": "Cos'è Max UUID?",
    "description": "Un Max UUID è un UUID speciale in cui tutti i bit sono impostati a uno (rappresentato come F in esadecimale). È rappresentato come {uuid}. Questo UUID viene utilizzato per rappresentare il valore UUID massimo possibile. È comunemente usato nei database e nei sistemi per indicare il limite superiore degli intervalli UUID o come marcatore speciale per i valori massimi. Il Max UUID è unico in quanto è l'unico UUID garantito di essere composto interamente da Fs, rendendolo facilmente identificabile e utile per casi speciali nella gestione degli UUID."
  },
  "ja": {
    "title": "Max UUIDとは？",
    "description": "Max UUIDは、すべてのビットが1に設定された特別なUUIDです（16進数ではFとして表されます）。{uuid}として表されます。このUUIDは、可能な最大のUUID値を表すために使用されます。データベースやシステムで一般的に使用され、UUID範囲の上限を示したり、最大値の特別なマーカーとして使用されます。Max UUIDは、すべてがFであることが保証されている唯一のUUIDであり、UUID処理の特殊なケースで識別しやすく有用です。"
  },
  "ko": {
    "title": "Max UUID란?",
    "description": "Max UUID는 모든 비트가 1로 설정된 특별한 UUID입니다(16진수에서는 F로 표현됨). {uuid}으로 표현됩니다. 이 UUID는 가능한 최대 UUID 값을 나타내는 데 사용됩니다. 데이터베이스와 시스템에서 일반적으로 사용되며, UUID 범위의 상한을 나타내거나 최대값의 특별한 마커로 사용됩니다. Max UUID는 모든 비트가 F라는 것이 보장되는 유일한 UUID로, UUID 처리의 특수한 경우에 쉽게 식별할 수 있고 유용합니다."
  },
  "ru": {
    "title": "Что такое Max UUID?",
    "description": "Max UUID - это специальный UUID, в котором все биты установлены в единицу (представляется как F в шестнадцатеричной системе). Он представляется как {uuid}. Этот UUID используется для представления максимально возможного значения UUID. Он обычно используется в базах данных и системах для указания верхней границы диапазонов UUID или в качестве специального маркера для максимальных значений. Max UUID уникален тем, что это единственный UUID, который гарантированно состоит из всех Fs, что делает его легко идентифицируемым и полезным для особых случаев в обработке UUID."
  },
  "pt": {
    "title": "O que é Max UUID?",
    "description": "Um Max UUID é um UUID especial onde todos os bits estão definidos como um (representado como F em hexadecimal). É representado como {uuid}. Este UUID é usado para representar o valor UUID máximo possível. É comumente usado em bancos de dados e sistemas para indicar o limite superior de intervalos UUID ou como um marcador especial para valores máximos. O Max UUID é único por ser o único UUID que é garantido ser composto inteiramente de Fs, tornando-o facilmente identificável e útil para casos especiais no tratamento de UUID."
  },
  "ar": {
    "title": "ما هو Max UUID؟",
    "description": "Max UUID هو UUID خاص حيث يتم تعيين جميع البتات إلى واحد (يتم تمثيله كـ F في النظام الست عشري). يتم تمثيله كـ {uuid}. يستخدم هذا UUID لتمثيل أقصى قيمة UUID ممكنة. يستخدم عادة في قواعد البيانات والأنظمة للإشارة إلى الحد الأعلى لنطاقات UUID أو كعلامة خاصة للقيم القصوى. Max UUID فريد من نوعه لأنه UUID الوحيد الذي يضمن أن يكون جميع أجزائه Fs، مما يجعله سهل التعرف عليه ومفيدًا للحالات الخاصة في معالجة UUID."
  },
  "hi": {
    "title": "Max UUID क्या है?",
    "description": "Max UUID एक विशेष UUID है जहां सभी बिट्स एक पर सेट किए गए हैं (हेक्साडेसिमल में F के रूप में दर्शाया गया)। इसे {uuid} के रूप में दर्शाया जाता है। यह UUID संभव अधिकतम UUID मान का प्रतिनिधित्व करने के लिए उपयोग किया जाता है। यह आमतौर पर डेटाबेस और सिस्टम में UUID रेंज की ऊपरी सीमा को इंगित करने या अधिकतम मानों के लिए विशेष मार्कर के रूप में उपयोग किया जाता है। Max UUID इस मायने में अद्वितीय है कि यह एकमात्र UUID है जो पूरी तरह से Fs होने की गारंटी है, जो इसे UUID हैंडलिंग के विशेष मामलों में आसानी से पहचानने योग्य और उपयोगी बनाता है।"
  },
  "tr": {
    "title": "Max UUID nedir?",
    "description": "Max UUID, tüm bitlerin bir olarak ayarlandığı özel bir UUID'dir (onaltılık sistemde F olarak temsil edilir). {uuid} olarak temsil edilir. Bu UUID, mümkün olan en yüksek UUID değerini temsil etmek için kullanılır. Genellikle veritabanlarında ve sistemlerde UUID aralıklarının üst sınırını belirtmek veya maksimum değerler için özel bir işaretleyici olarak kullanılır. Max UUID, tamamen Fs'den oluşması garanti edilen tek UUID olması bakımından benzersizdir, bu da onu UUID işlemedeki özel durumlar için kolayca tanımlanabilir ve kullanışlı kılar."
  },
  "nl": {
    "title": "Wat is Max UUID?",
    "description": "Een Max UUID is een speciale UUID waarbij alle bits op één zijn gezet (weergegeven als F in hexadecimaal). Het wordt weergegeven als {uuid}. Deze UUID wordt gebruikt om de maximaal mogelijke UUID-waarde weer te geven. Het wordt vaak gebruikt in databases en systemen om de bovengrens van UUID-bereiken aan te geven of als speciale marker voor maximale waarden. De Max UUID is uniek omdat het de enige UUID is die gegarandeerd volledig uit Fs bestaat, wat het gemakkelijk identificeerbaar en nuttig maakt voor speciale gevallen in UUID-verwerking."
  },
  "sv": {
    "title": "Vad är Max UUID?",
    "description": "En Max UUID är en speciell UUID där alla bitar är satta till ett (representeras som F i hexadecimal). Den representeras som {uuid}. Denna UUID används för att representera det maximalt möjliga UUID-värdet. Den används vanligtvis i databaser och system för att indikera den övre gränsen för UUID-intervall eller som en specialmarkör för maximala värden. Max UUID är unik genom att vara den enda UUID som garanterat består av endast Fs, vilket gör den lätt att identifiera och användbar för specialfall i UUID-hantering."
  },
  "pl": {
    "title": "Co to jest Max UUID?",
    "description": "Max UUID to specjalny UUID, w którym wszystkie bity są ustawione na jeden (reprezentowane jako F w systemie szesnastkowym). Jest reprezentowany jako {uuid}. Ten UUID jest używany do reprezentowania maksymalnej możliwej wartości UUID. Jest powszechnie używany w bazach danych i systemach do wskazywania górnej granicy zakresów UUID lub jako symbol zastępczy dla wartości maksymalnych. Max UUID jest unikalny, ponieważ jest jedynym UUID, który jest gwarantowany jako składający się w całości z Fs, co czyni go łatwym do zidentyfikowania i przydatnym w szczególnych przypadkach obsługi UUID."
  },
  "vi": {
    "title": "Max UUID là gì?",
    "description": "Max UUID là một UUID đặc biệt trong đó tất cả các bit đều được đặt thành một (được biểu diễn dưới dạng F trong hệ thập lục phân). Nó được biểu diễn dưới dạng {uuid}. UUID này được sử dụng để biểu diễn giá trị UUID tối đa có thể. Nó thường được sử dụng trong cơ sở dữ liệu và hệ thống để chỉ ra giới hạn trên của phạm vi UUID hoặc làm dấu hiệu đặc biệt cho các giá trị tối đa. Max UUID là duy nhất ở chỗ nó là UUID duy nhất được đảm bảo toàn bộ là Fs, làm cho nó dễ dàng nhận dạng và hữu ích cho các trường hợp đặc biệt trong xử lý UUID."
  },
  "th": {
    "title": "Max UUID คืออะไร?",
    "description": "Max UUID เป็น UUID พิเศษที่บิตทั้งหมดถูกตั้งค่าเป็นหนึ่ง (แสดงเป็น F ในเลขฐานสิบหก) แสดงเป็น {uuid} UUID นี้ใช้เพื่อแสดงค่า UUID สูงสุดที่เป็นไปได้ มักใช้ในฐานข้อมูลและระบบเพื่อระบุขีดจำกัดบนของช่วง UUID หรือเป็นเครื่องหมายพิเศษสำหรับค่าสูงสุด Max UUID มีเอกลักษณ์เฉพาะตัวตรงที่เป็น UUID เดียวที่รับประกันว่าจะเป็น Fs ทั้งหมด ทำให้ง่ายต่อการระบุและมีประโยชน์สำหรับกรณีพิเศษในการจัดการ UUID"
  },
  "id": {
    "title": "Apa itu Max UUID?",
    "description": "Max UUID adalah UUID khusus di mana semua bit diatur ke satu (direpresentasikan sebagai F dalam heksadesimal). Ini direpresentasikan sebagai {uuid}. UUID ini digunakan untuk merepresentasikan nilai UUID maksimum yang mungkin. Ini umumnya digunakan dalam database dan sistem untuk menunjukkan batas atas rentang UUID atau sebagai penanda khusus untuk nilai maksimum. Max UUID unik karena merupakan satu-satunya UUID yang dijamin seluruhnya terdiri dari Fs, membuatnya mudah diidentifikasi dan berguna untuk kasus khusus dalam penanganan UUID."
  },
  "he": {
    "title": "?Max UUID מהו",
    "description": "Max UUID הוא UUID מיוחד שבו כל הביטים מוגדרים לאחד (מיוצג כ-F במערכת הקסדצימלית). הוא מיוצג כ-{uuid}. UUID זה משמש לייצוג ערך ה-UUID המקסימלי האפשרי. הוא משמש בדרך כלל במסדי נתונים ומערכות כדי לציין את הגבול העליון של טווחי UUID או כסמן מיוחד לערכים מקסימליים. ה-Max UUID הוא ייחודי בכך שהוא ה-UUID היחיד שהוא מובטח להיות מורכב כולו מ-Fs, מה שהופך אותו לזיהוי קל ושימושי למקרים מיוחדים בטיפול ב-UUID."
  },
  "ms": {
    "title": "Apakah Max UUID?",
    "description": "Max UUID ialah UUID khas di mana semua bit ditetapkan kepada satu (diwakili sebagai F dalam perenambelasan). Ia diwakili sebagai {uuid}. UUID ini digunakan untuk mewakili nilai UUID maksimum yang mungkin. Ia biasanya digunakan dalam pangkalan data dan sistem untuk menunjukkan had atas julat UUID atau sebagai penanda khas untuk nilai maksimum. Max UUID adalah unik kerana ia adalah satu-satunya UUID yang dijamin terdiri sepenuhnya daripada Fs, menjadikannya mudah dikenal pasti dan berguna untuk kes khas dalam pengendalian UUID."
  },
  "no": {
    "title": "Hva er Max UUID?",
    "description": "En Max UUID er en spesiell UUID der alle biter er satt til én (representert som F i heksadesimal). Den er representert som {uuid}. Denne UUID-en brukes for å representere den maksimalt mulige UUID-verdien. Den brukes vanligvis i databaser og systemer for å indikere øvre grense for UUID-områder eller som en spesiell markør for maksimale verdier. Max UUID er unik ved at den er den eneste UUID-en som er garantert å være helt Fs, noe som gjør den lett å identifisere og nyttig for spesielle tilfeller i UUID-håndtering."
  }
}
</i18n>
