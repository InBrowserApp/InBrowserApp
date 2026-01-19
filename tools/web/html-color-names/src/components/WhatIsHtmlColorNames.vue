<template>
  <div>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <NText>{{ t('description') }}</NText>
      <NUl>
        <NLi>
          <NText strong>{{ t('basicColorsTitle') }}</NText>
          {{ t('basicColorsDesc') }}
        </NLi>
        <NLi>
          <NText strong>{{ t('extendedColorsTitle') }}</NText>
          {{ t('extendedColorsDesc') }}
        </NLi>
        <NLi>
          <NText strong>{{ t('usageTitle') }}</NText>
          {{ t('usageDesc') }}
        </NLi>
      </NUl>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText, NUl, NLi } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What are HTML Color Names?",
    "description": "HTML color names are predefined color keywords that can be used in CSS and HTML to specify colors without using hexadecimal or RGB values. These names are supported by all modern browsers.",
    "basicColorsTitle": "Basic Colors:",
    "basicColorsDesc": "The original 16 HTML colors (black, white, red, green, blue, etc.) have been supported since the earliest versions of HTML.",
    "extendedColorsTitle": "Extended Colors:",
    "extendedColorsDesc": "CSS3 introduced 140+ named colors, including variations like \"aliceblue\", \"coral\", \"darkslategray\", and many more.",
    "usageTitle": "Usage:",
    "usageDesc": "Simply use the color name in your CSS, e.g., \"color: tomato;\" or \"background-color: steelblue;\"."
  },
  "zh": {
    "title": "什么是 HTML 颜色名称？",
    "description": "HTML 颜色名称是预定义的颜色关键字，可在 CSS 和 HTML 中使用，无需十六进制或 RGB 值即可指定颜色。所有现代浏览器都支持这些名称。",
    "basicColorsTitle": "基本颜色：",
    "basicColorsDesc": "最初的 16 种 HTML 颜色（黑色、白色、红色、绿色、蓝色等）从 HTML 早期版本起就已支持。",
    "extendedColorsTitle": "扩展颜色：",
    "extendedColorsDesc": "CSS3 引入了 140 多种命名颜色，包括 \"aliceblue\"、\"coral\"、\"darkslategray\" 等变体。",
    "usageTitle": "用法：",
    "usageDesc": "在 CSS 中直接使用颜色名称即可，例如 \"color: tomato;\" 或 \"background-color: steelblue;\"。"
  },
  "zh-CN": {
    "title": "什么是 HTML 颜色名称？",
    "description": "HTML 颜色名称是预定义的颜色关键字，可在 CSS 和 HTML 中使用，无需十六进制或 RGB 值即可指定颜色。所有现代浏览器都支持这些名称。",
    "basicColorsTitle": "基本颜色：",
    "basicColorsDesc": "最初的 16 种 HTML 颜色（黑色、白色、红色、绿色、蓝色等）从 HTML 早期版本起就已支持。",
    "extendedColorsTitle": "扩展颜色：",
    "extendedColorsDesc": "CSS3 引入了 140 多种命名颜色，包括 \"aliceblue\"、\"coral\"、\"darkslategray\" 等变体。",
    "usageTitle": "用法：",
    "usageDesc": "在 CSS 中直接使用颜色名称即可，例如 \"color: tomato;\" 或 \"background-color: steelblue;\"。"
  },
  "zh-TW": {
    "title": "什麼是 HTML 顏色名稱？",
    "description": "HTML 顏色名稱是預先定義的顏色關鍵字，可在 CSS 和 HTML 中使用，無需十六進位或 RGB 值即可指定顏色。所有現代瀏覽器都支援這些名稱。",
    "basicColorsTitle": "基本顏色：",
    "basicColorsDesc": "最初的 16 種 HTML 顏色（黑色、白色、紅色、綠色、藍色等）自 HTML 早期版本起就已支援。",
    "extendedColorsTitle": "擴展顏色：",
    "extendedColorsDesc": "CSS3 引入了 140 多種命名顏色，包括 \"aliceblue\"、\"coral\"、\"darkslategray\" 等變體。",
    "usageTitle": "用法：",
    "usageDesc": "在 CSS 中直接使用顏色名稱，例如 \"color: tomato;\" 或 \"background-color: steelblue;\"。"
  },
  "zh-HK": {
    "title": "什麼是 HTML 顏色名稱？",
    "description": "HTML 顏色名稱是預先定義的顏色關鍵字，可在 CSS 和 HTML 中使用，無需十六進位或 RGB 值即可指定顏色。所有現代瀏覽器都支援這些名稱。",
    "basicColorsTitle": "基本顏色：",
    "basicColorsDesc": "最初的 16 種 HTML 顏色（黑色、白色、紅色、綠色、藍色等）自 HTML 早期版本起就已支援。",
    "extendedColorsTitle": "擴展顏色：",
    "extendedColorsDesc": "CSS3 引入了 140 多種命名顏色，包括 \"aliceblue\"、\"coral\"、\"darkslategray\" 等變體。",
    "usageTitle": "用法：",
    "usageDesc": "在 CSS 中直接使用顏色名稱，例如 \"color: tomato;\" 或 \"background-color: steelblue;\"。"
  },
  "es": {
    "title": "¿Qué son los nombres de colores HTML?",
    "description": "Los nombres de colores HTML son palabras clave de color predefinidas que pueden usarse en CSS y HTML para especificar colores sin usar valores hexadecimales o RGB. Estos nombres son compatibles con todos los navegadores modernos.",
    "basicColorsTitle": "Colores básicos:",
    "basicColorsDesc": "Los 16 colores HTML originales (negro, blanco, rojo, verde, azul, etc.) se admiten desde las primeras versiones de HTML.",
    "extendedColorsTitle": "Colores extendidos:",
    "extendedColorsDesc": "CSS3 introdujo más de 140 colores con nombre, incluidas variaciones como \"aliceblue\", \"coral\", \"darkslategray\" y muchos más.",
    "usageTitle": "Uso:",
    "usageDesc": "Solo tienes que usar el nombre del color en tu CSS, por ejemplo, \"color: tomato;\" o \"background-color: steelblue;\"."
  },
  "fr": {
    "title": "Que sont les noms de couleurs HTML ?",
    "description": "Les noms de couleurs HTML sont des mots-clés de couleur prédéfinis utilisables en CSS et HTML pour spécifier des couleurs sans utiliser de valeurs hexadécimales ou RVB. Ces noms sont pris en charge par tous les navigateurs modernes.",
    "basicColorsTitle": "Couleurs de base :",
    "basicColorsDesc": "Les 16 couleurs HTML originales (noir, blanc, rouge, vert, bleu, etc.) sont prises en charge depuis les premières versions de HTML.",
    "extendedColorsTitle": "Couleurs étendues :",
    "extendedColorsDesc": "CSS3 a introduit plus de 140 couleurs nommées, dont des variantes comme \"aliceblue\", \"coral\", \"darkslategray\", et bien d'autres.",
    "usageTitle": "Utilisation :",
    "usageDesc": "Utilisez simplement le nom de la couleur dans votre CSS, par exemple \"color: tomato;\" ou \"background-color: steelblue;\"."
  },
  "de": {
    "title": "Was sind HTML-Farbnamen?",
    "description": "HTML-Farbnamen sind vordefinierte Farb-Schlüsselwörter, die in CSS und HTML verwendet werden können, um Farben ohne Hexadezimal- oder RGB-Werte anzugeben. Diese Namen werden von allen modernen Browsern unterstützt.",
    "basicColorsTitle": "Grundfarben:",
    "basicColorsDesc": "Die ursprünglichen 16 HTML-Farben (Schwarz, Weiß, Rot, Grün, Blau usw.) werden seit den frühesten HTML-Versionen unterstützt.",
    "extendedColorsTitle": "Erweiterte Farben:",
    "extendedColorsDesc": "CSS3 führte über 140 benannte Farben ein, darunter Varianten wie \"aliceblue\", \"coral\", \"darkslategray\" und viele mehr.",
    "usageTitle": "Verwendung:",
    "usageDesc": "Verwenden Sie einfach den Farbnamen in Ihrem CSS, z. B. \"color: tomato;\" oder \"background-color: steelblue;\"."
  },
  "it": {
    "title": "Cosa sono i nomi dei colori HTML?",
    "description": "I nomi dei colori HTML sono parole chiave di colore predefinite che possono essere usate in CSS e HTML per specificare colori senza usare valori esadecimali o RGB. Questi nomi sono supportati da tutti i browser moderni.",
    "basicColorsTitle": "Colori di base:",
    "basicColorsDesc": "I 16 colori HTML originali (nero, bianco, rosso, verde, blu, ecc.) sono supportati sin dalle prime versioni di HTML.",
    "extendedColorsTitle": "Colori estesi:",
    "extendedColorsDesc": "CSS3 ha introdotto oltre 140 colori con nome, incluse varianti come \"aliceblue\", \"coral\", \"darkslategray\" e molti altri.",
    "usageTitle": "Uso:",
    "usageDesc": "Basta usare il nome del colore nel CSS, ad esempio \"color: tomato;\" o \"background-color: steelblue;\"."
  },
  "ja": {
    "title": "HTMLの色名とは？",
    "description": "HTMLの色名は、CSSやHTMLで16進値やRGB値を使わずに色を指定できる、あらかじめ定義された色のキーワードです。これらの名前はすべての最新ブラウザでサポートされています。",
    "basicColorsTitle": "基本色:",
    "basicColorsDesc": "元の16色のHTMLカラー（黒、白、赤、緑、青など）は、HTMLの初期バージョンからサポートされています。",
    "extendedColorsTitle": "拡張色:",
    "extendedColorsDesc": "CSS3では \"aliceblue\"、\"coral\"、\"darkslategray\" などのバリエーションを含む140以上の名前付きカラーが導入されました。",
    "usageTitle": "使い方:",
    "usageDesc": "CSSで色名をそのまま使います。例: \"color: tomato;\" または \"background-color: steelblue;\"。"
  },
  "ko": {
    "title": "HTML 색상 이름이란?",
    "description": "HTML 색상 이름은 CSS와 HTML에서 16진수나 RGB 값 없이 색상을 지정할 수 있는 미리 정의된 색상 키워드입니다. 이 이름들은 모든 최신 브라우저에서 지원됩니다.",
    "basicColorsTitle": "기본 색상:",
    "basicColorsDesc": "HTML 초기부터 지원된 16가지 기본 색상(검정, 흰색, 빨강, 초록, 파랑 등)입니다.",
    "extendedColorsTitle": "확장 색상:",
    "extendedColorsDesc": "CSS3는 \"aliceblue\", \"coral\", \"darkslategray\" 등 다양한 변형을 포함해 140개 이상의 이름 있는 색상을 도입했습니다.",
    "usageTitle": "사용법:",
    "usageDesc": "CSS에서 색상 이름을 그대로 사용하면 됩니다. 예: \"color: tomato;\" 또는 \"background-color: steelblue;\"."
  },
  "ru": {
    "title": "Что такое названия цветов HTML?",
    "description": "Названия цветов HTML — это заранее определенные ключевые слова цвета, которые можно использовать в CSS и HTML для задания цвета без шестнадцатеричных или RGB значений. Эти имена поддерживаются всеми современными браузерами.",
    "basicColorsTitle": "Базовые цвета:",
    "basicColorsDesc": "Исходные 16 цветов HTML (черный, белый, красный, зеленый, синий и т. д.) поддерживаются с самых ранних версий HTML.",
    "extendedColorsTitle": "Расширенные цвета:",
    "extendedColorsDesc": "CSS3 ввел более 140 именованных цветов, включая варианты \"aliceblue\", \"coral\", \"darkslategray\" и многие другие.",
    "usageTitle": "Использование:",
    "usageDesc": "Просто используйте название цвета в CSS, например, \"color: tomato;\" или \"background-color: steelblue;\"."
  },
  "pt": {
    "title": "O que são nomes de cores HTML?",
    "description": "Nomes de cores HTML são palavras-chave de cor predefinidas que podem ser usadas em CSS e HTML para especificar cores sem usar valores hexadecimais ou RGB. Esses nomes são suportados por todos os navegadores modernos.",
    "basicColorsTitle": "Cores básicas:",
    "basicColorsDesc": "As 16 cores HTML originais (preto, branco, vermelho, verde, azul etc.) são suportadas desde as primeiras versões do HTML.",
    "extendedColorsTitle": "Cores estendidas:",
    "extendedColorsDesc": "O CSS3 introduziu mais de 140 cores nomeadas, incluindo variações como \"aliceblue\", \"coral\", \"darkslategray\" e muitas outras.",
    "usageTitle": "Uso:",
    "usageDesc": "Basta usar o nome da cor no seu CSS, por exemplo, \"color: tomato;\" ou \"background-color: steelblue;\"."
  },
  "ar": {
    "title": "ما هي أسماء ألوان HTML؟",
    "description": "أسماء ألوان HTML هي كلمات مفتاحية لونية محددة مسبقًا يمكن استخدامها في CSS وHTML لتحديد الألوان دون استخدام قيم سداسية عشرية أو قيم RGB. هذه الأسماء مدعومة في جميع المتصفحات الحديثة.",
    "basicColorsTitle": "الألوان الأساسية:",
    "basicColorsDesc": "الألوان الستة عشر الأصلية في HTML (الأسود، الأبيض، الأحمر، الأخضر، الأزرق، إلخ) مدعومة منذ الإصدارات الأولى من HTML.",
    "extendedColorsTitle": "الألوان الموسعة:",
    "extendedColorsDesc": "قدّم CSS3 أكثر من 140 لونًا مسمى، بما في ذلك تنويعات مثل \"aliceblue\" و\"coral\" و\"darkslategray\" وغيرها الكثير.",
    "usageTitle": "الاستخدام:",
    "usageDesc": "استخدم اسم اللون مباشرة في CSS، مثل \"color: tomato;\" أو \"background-color: steelblue;\"."
  },
  "hi": {
    "title": "HTML रंग नाम क्या हैं?",
    "description": "HTML रंग नाम पूर्वनिर्धारित रंग कीवर्ड हैं जिन्हें CSS और HTML में हेक्साडेसिमल या RGB मानों के बिना रंग निर्दिष्ट करने के लिए उपयोग किया जा सकता है। ये नाम सभी आधुनिक ब्राउज़र द्वारा समर्थित हैं।",
    "basicColorsTitle": "मूल रंग:",
    "basicColorsDesc": "HTML के मूल 16 रंग (काला, सफेद, लाल, हरा, नीला आदि) शुरुआती संस्करणों से समर्थित हैं।",
    "extendedColorsTitle": "विस्तारित रंग:",
    "extendedColorsDesc": "CSS3 ने \"aliceblue\", \"coral\", \"darkslategray\" जैसी विविधताओं सहित 140+ नामित रंग पेश किए।",
    "usageTitle": "उपयोग:",
    "usageDesc": "CSS में रंग नाम सीधे उपयोग करें, जैसे \"color: tomato;\" या \"background-color: steelblue;\"."
  },
  "tr": {
    "title": "HTML renk adları nedir?",
    "description": "HTML renk adları, CSS ve HTML'de onaltılık veya RGB değerleri kullanmadan renkleri belirtmek için kullanılabilen, önceden tanımlı renk anahtar sözcükleridir. Bu adlar tüm modern tarayıcılar tarafından desteklenir.",
    "basicColorsTitle": "Temel renkler:",
    "basicColorsDesc": "Orijinal 16 HTML rengi (siyah, beyaz, kırmızı, yeşil, mavi vb.) HTML'nin ilk sürümlerinden beri desteklenir.",
    "extendedColorsTitle": "Genişletilmiş renkler:",
    "extendedColorsDesc": "CSS3, \"aliceblue\", \"coral\", \"darkslategray\" gibi varyasyonlar dahil 140'tan fazla adlandırılmış renk getirdi.",
    "usageTitle": "Kullanım:",
    "usageDesc": "Renk adını CSS'de doğrudan kullanın, örn. \"color: tomato;\" veya \"background-color: steelblue;\"."
  },
  "nl": {
    "title": "Wat zijn HTML-kleurnamen?",
    "description": "HTML-kleurnamen zijn vooraf gedefinieerde kleur-trefwoorden die je in CSS en HTML kunt gebruiken om kleuren op te geven zonder hexadecimale of RGB-waarden. Deze namen worden door alle moderne browsers ondersteund.",
    "basicColorsTitle": "Basiskleuren:",
    "basicColorsDesc": "De oorspronkelijke 16 HTML-kleuren (zwart, wit, rood, groen, blauw, enz.) worden al sinds de vroegste HTML-versies ondersteund.",
    "extendedColorsTitle": "Uitgebreide kleuren:",
    "extendedColorsDesc": "CSS3 introduceerde meer dan 140 benoemde kleuren, waaronder varianten als \"aliceblue\", \"coral\", \"darkslategray\" en nog veel meer.",
    "usageTitle": "Gebruik:",
    "usageDesc": "Gebruik simpelweg de kleurnaam in je CSS, bijvoorbeeld \"color: tomato;\" of \"background-color: steelblue;\"."
  },
  "sv": {
    "title": "Vad är HTML-färgnamn?",
    "description": "HTML-färgnamn är fördefinierade färgnyckelord som kan användas i CSS och HTML för att ange färger utan att använda hexadecimala eller RGB-värden. Dessa namn stöds av alla moderna webbläsare.",
    "basicColorsTitle": "Grundfärger:",
    "basicColorsDesc": "De ursprungliga 16 HTML-färgerna (svart, vit, röd, grön, blå etc.) har stödts sedan de tidigaste HTML-versionerna.",
    "extendedColorsTitle": "Utökade färger:",
    "extendedColorsDesc": "CSS3 introducerade 140+ namngivna färger, inklusive varianter som \"aliceblue\", \"coral\", \"darkslategray\" med flera.",
    "usageTitle": "Användning:",
    "usageDesc": "Använd bara färgnamnet i din CSS, t.ex. \"color: tomato;\" eller \"background-color: steelblue;\"."
  },
  "pl": {
    "title": "Czym są nazwy kolorów HTML?",
    "description": "Nazwy kolorów HTML to predefiniowane słowa kluczowe kolorów, których można używać w CSS i HTML do określania kolorów bez wartości szesnastkowych lub RGB. Te nazwy są obsługiwane przez wszystkie nowoczesne przeglądarki.",
    "basicColorsTitle": "Podstawowe kolory:",
    "basicColorsDesc": "Oryginalne 16 kolorów HTML (czarny, biały, czerwony, zielony, niebieski itd.) są obsługiwane od najwcześniejszych wersji HTML.",
    "extendedColorsTitle": "Rozszerzone kolory:",
    "extendedColorsDesc": "CSS3 wprowadził ponad 140 nazwanych kolorów, w tym warianty takie jak \"aliceblue\", \"coral\", \"darkslategray\" i wiele innych.",
    "usageTitle": "Użycie:",
    "usageDesc": "Wystarczy użyć nazwy koloru w CSS, np. \"color: tomato;\" lub \"background-color: steelblue;\"."
  },
  "vi": {
    "title": "Tên màu HTML là gì?",
    "description": "Tên màu HTML là các từ khóa màu được định nghĩa sẵn, có thể dùng trong CSS và HTML để chỉ định màu mà không cần giá trị thập lục phân hoặc RGB. Các tên này được hỗ trợ bởi mọi trình duyệt hiện đại.",
    "basicColorsTitle": "Màu cơ bản:",
    "basicColorsDesc": "16 màu HTML gốc (đen, trắng, đỏ, xanh lá, xanh dương, v.v.) đã được hỗ trợ từ những phiên bản HTML đầu tiên.",
    "extendedColorsTitle": "Màu mở rộng:",
    "extendedColorsDesc": "CSS3 giới thiệu hơn 140 màu có tên, bao gồm các biến thể như \"aliceblue\", \"coral\", \"darkslategray\" và nhiều màu khác.",
    "usageTitle": "Cách dùng:",
    "usageDesc": "Chỉ cần dùng tên màu trong CSS, ví dụ \"color: tomato;\" hoặc \"background-color: steelblue;\"."
  },
  "th": {
    "title": "ชื่อสี HTML คืออะไร?",
    "description": "ชื่อสี HTML คือคีย์เวิร์ดสีที่กำหนดไว้ล่วงหน้า ซึ่งสามารถใช้ใน CSS และ HTML เพื่อระบุสีโดยไม่ต้องใช้ค่าเลขฐานสิบหกหรือค่า RGB ชื่อเหล่านี้รองรับโดยเบราว์เซอร์สมัยใหม่ทั้งหมด",
    "basicColorsTitle": "สีพื้นฐาน:",
    "basicColorsDesc": "สี HTML ดั้งเดิม 16 สี (ดำ ขาว แดง เขียว น้ำเงิน ฯลฯ) ได้รับการรองรับมาตั้งแต่ HTML รุ่นแรกๆ",
    "extendedColorsTitle": "สีเพิ่มเติม:",
    "extendedColorsDesc": "CSS3 เพิ่มสีที่มีชื่อมากกว่า 140 สี รวมถึงรูปแบบอย่าง \"aliceblue\", \"coral\", \"darkslategray\" และอีกมากมาย",
    "usageTitle": "การใช้งาน:",
    "usageDesc": "เพียงใช้ชื่อสีใน CSS เช่น \"color: tomato;\" หรือ \"background-color: steelblue;\"."
  },
  "id": {
    "title": "Apa itu Nama Warna HTML?",
    "description": "Nama warna HTML adalah kata kunci warna yang telah ditentukan sebelumnya dan dapat digunakan di CSS serta HTML untuk menentukan warna tanpa nilai heksadesimal atau RGB. Nama-nama ini didukung oleh semua browser modern.",
    "basicColorsTitle": "Warna dasar:",
    "basicColorsDesc": "16 warna HTML asli (hitam, putih, merah, hijau, biru, dll.) didukung sejak versi awal HTML.",
    "extendedColorsTitle": "Warna diperluas:",
    "extendedColorsDesc": "CSS3 memperkenalkan lebih dari 140 warna bernama, termasuk variasi seperti \"aliceblue\", \"coral\", \"darkslategray\", dan banyak lagi.",
    "usageTitle": "Penggunaan:",
    "usageDesc": "Cukup gunakan nama warna di CSS, misalnya \"color: tomato;\" atau \"background-color: steelblue;\"."
  },
  "he": {
    "title": "מהם שמות צבעי HTML?",
    "description": "שמות צבעי HTML הם מילות מפתח צבע מוגדרות מראש שאפשר להשתמש בהן ב-CSS וב-HTML כדי לציין צבעים בלי להשתמש בערכי הקסדצימלי או RGB. שמות אלו נתמכים בכל הדפדפנים המודרניים.",
    "basicColorsTitle": "צבעים בסיסיים:",
    "basicColorsDesc": "16 צבעי ה-HTML המקוריים (שחור, לבן, אדום, ירוק, כחול וכו') נתמכים מאז הגרסאות המוקדמות ביותר של HTML.",
    "extendedColorsTitle": "צבעים מורחבים:",
    "extendedColorsDesc": "CSS3 הציג יותר מ-140 צבעים בעלי שם, כולל וריאציות כמו \"aliceblue\", \"coral\", \"darkslategray\" ועוד רבים.",
    "usageTitle": "שימוש:",
    "usageDesc": "פשוט השתמשו בשם הצבע ב-CSS, למשל \"color: tomato;\" או \"background-color: steelblue;\"."
  },
  "ms": {
    "title": "Apakah Nama Warna HTML?",
    "description": "Nama warna HTML ialah kata kunci warna yang ditakrifkan terlebih dahulu dan boleh digunakan dalam CSS dan HTML untuk menentukan warna tanpa nilai heksadesimal atau RGB. Nama-nama ini disokong oleh semua pelayar moden.",
    "basicColorsTitle": "Warna asas:",
    "basicColorsDesc": "16 warna HTML asal (hitam, putih, merah, hijau, biru, dll.) telah disokong sejak versi HTML terawal.",
    "extendedColorsTitle": "Warna lanjutan:",
    "extendedColorsDesc": "CSS3 memperkenalkan lebih 140 warna bernama, termasuk variasi seperti \"aliceblue\", \"coral\", \"darkslategray\" dan banyak lagi.",
    "usageTitle": "Penggunaan:",
    "usageDesc": "Gunakan sahaja nama warna dalam CSS, contohnya \"color: tomato;\" atau \"background-color: steelblue;\"."
  },
  "no": {
    "title": "Hva er HTML-fargenavn?",
    "description": "HTML-fargenavn er forhåndsdefinerte fargenøkkelord som kan brukes i CSS og HTML for å angi farger uten å bruke heksadesimale eller RGB-verdier. Disse navnene støttes av alle moderne nettlesere.",
    "basicColorsTitle": "Grunnfarger:",
    "basicColorsDesc": "De opprinnelige 16 HTML-fargene (svart, hvit, rød, grønn, blå osv.) har vært støttet siden de tidligste HTML-versjonene.",
    "extendedColorsTitle": "Utvidede farger:",
    "extendedColorsDesc": "CSS3 introduserte mer enn 140 navngitte farger, inkludert varianter som \"aliceblue\", \"coral\", \"darkslategray\" og mange flere.",
    "usageTitle": "Bruk:",
    "usageDesc": "Bare bruk fargenavnet i CSS, for eksempel \"color: tomato;\" eller \"background-color: steelblue;\"."
  }
}
</i18n>
