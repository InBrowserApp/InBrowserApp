<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('description') }}</n-text>
    <n-ul style="margin-top: 12px">
      <n-li>{{ t('example1') }}</n-li>
      <n-li>{{ t('example2') }}</n-li>
      <n-li>{{ t('example3') }}</n-li>
    </n-ul>
    <n-text style="margin-top: 12px; display: block">{{ t('benefits') }}</n-text>
  </ToolSection>
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
    "title": "What is a Slug?",
    "description": "A slug is a URL-friendly version of a string, typically used for creating human-readable and SEO-friendly URLs. It converts text by removing special characters, replacing spaces with hyphens, and converting to lowercase.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"My Blog Post Title\" → \"my-blog-post-title\"",
    "example3": "\"Product: iPhone 15 Pro\" → \"product-iphone-15-pro\"",
    "benefits": "Slugs improve URL readability, help with SEO, and make links easier to share and remember."
  },
  "zh": {
    "title": "什么是 Slug？",
    "description": "Slug 是字符串的 URL 友好版本，通常用于创建人类可读且对 SEO 友好的 URL。它通过移除特殊字符、用连字符替换空格并转换为小写来转换文本。",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"我的博客文章标题\" → \"wo-de-bo-ke-wen-zhang-biao-ti\"",
    "example3": "\"产品：iPhone 15 Pro\" → \"chan-pin-iphone-15-pro\"",
    "benefits": "Slug 提高了 URL 的可读性，有助于 SEO，并使链接更容易分享和记忆。"
  },
  "zh-CN": {
    "title": "什么是 Slug？",
    "description": "Slug 是字符串的 URL 友好版本，通常用于创建人类可读且对 SEO 友好的 URL。它通过移除特殊字符、用连字符替换空格并转换为小写来转换文本。",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"我的博客文章标题\" → \"wo-de-bo-ke-wen-zhang-biao-ti\"",
    "example3": "\"产品：iPhone 15 Pro\" → \"chan-pin-iphone-15-pro\"",
    "benefits": "Slug 提高了 URL 的可读性，有助于 SEO，并使链接更容易分享和记忆。"
  },
  "zh-TW": {
    "title": "什麼是 Slug？",
    "description": "Slug 是字串的網址友善版本，通常用於建立人類可讀且對 SEO 友善的網址。它透過移除特殊字元、用連字符取代空格並轉換為小寫來轉換文字。",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"我的部落格文章標題\" → \"wo-de-bu-luo-ge-wen-zhang-biao-ti\"",
    "example3": "\"產品：iPhone 15 Pro\" → \"chan-pin-iphone-15-pro\"",
    "benefits": "Slug 提高了網址的可讀性，有助於 SEO，並使連結更容易分享和記憶。"
  },
  "zh-HK": {
    "title": "什麼是 Slug？",
    "description": "Slug 是字串的網址友善版本，通常用於建立人類可讀且對 SEO 友善的網址。它透過移除特殊字元、用連字符取代空格並轉換為小寫來轉換文字。",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"我的部落格文章標題\" → \"wo-de-bu-luo-ge-wen-zhang-biao-ti\"",
    "example3": "\"產品：iPhone 15 Pro\" → \"chan-pin-iphone-15-pro\"",
    "benefits": "Slug 提高了網址的可讀性，有助於 SEO，並使連結更容易分享和記憶。"
  },
  "es": {
    "title": "¿Qué es un Slug?",
    "description": "Un slug es una versión amigable para URLs de una cadena de texto, típicamente usada para crear URLs legibles y amigables para SEO. Convierte el texto eliminando caracteres especiales, reemplazando espacios con guiones y convirtiendo a minúsculas.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Mi Título de Blog\" → \"mi-titulo-de-blog\"",
    "example3": "\"Producto: iPhone 15 Pro\" → \"producto-iphone-15-pro\"",
    "benefits": "Los slugs mejoran la legibilidad de las URLs, ayudan con el SEO y hacen que los enlaces sean más fáciles de compartir y recordar."
  },
  "fr": {
    "title": "Qu'est-ce qu'un Slug ?",
    "description": "Un slug est une version compatible URL d'une chaîne de caractères, généralement utilisée pour créer des URLs lisibles et optimisées pour le SEO. Il convertit le texte en supprimant les caractères spéciaux, en remplaçant les espaces par des tirets et en convertissant en minuscules.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Mon Titre de Blog\" → \"mon-titre-de-blog\"",
    "example3": "\"Produit : iPhone 15 Pro\" → \"produit-iphone-15-pro\"",
    "benefits": "Les slugs améliorent la lisibilité des URLs, aident au SEO et rendent les liens plus faciles à partager et à mémoriser."
  },
  "de": {
    "title": "Was ist ein Slug?",
    "description": "Ein Slug ist eine URL-freundliche Version eines Strings, die typischerweise verwendet wird, um lesbare und SEO-freundliche URLs zu erstellen. Er konvertiert Text, indem Sonderzeichen entfernt, Leerzeichen durch Bindestriche ersetzt und in Kleinbuchstaben umgewandelt werden.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Mein Blog-Titel\" → \"mein-blog-titel\"",
    "example3": "\"Produkt: iPhone 15 Pro\" → \"produkt-iphone-15-pro\"",
    "benefits": "Slugs verbessern die URL-Lesbarkeit, helfen bei SEO und machen Links einfacher zu teilen und zu merken."
  },
  "it": {
    "title": "Cos'è uno Slug?",
    "description": "Uno slug è una versione di una stringa compatibile con gli URL, tipicamente usata per creare URL leggibili e ottimizzati per la SEO. Converte il testo rimuovendo i caratteri speciali, sostituendo gli spazi con trattini e convertendo in minuscolo.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Il Mio Titolo del Blog\" → \"il-mio-titolo-del-blog\"",
    "example3": "\"Prodotto: iPhone 15 Pro\" → \"prodotto-iphone-15-pro\"",
    "benefits": "Gli slug migliorano la leggibilità degli URL, aiutano con la SEO e rendono i link più facili da condividere e ricordare."
  },
  "ja": {
    "title": "Slugとは？",
    "description": "Slugは文字列のURL対応バージョンで、通常は人間が読みやすくSEOに優しいURLを作成するために使用されます。特殊文字を削除し、スペースをハイフンに置き換え、小文字に変換することでテキストを変換します。",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"私のブログタイトル\" → \"si-noburogutaitoru\"",
    "example3": "\"製品：iPhone 15 Pro\" → \"zhi-pin-iphone-15-pro\"",
    "benefits": "SlugはURLの可読性を向上させ、SEOに役立ち、リンクを共有しやすく覚えやすくします。"
  },
  "ko": {
    "title": "Slug란 무엇인가요?",
    "description": "Slug는 문자열의 URL 친화적인 버전으로, 일반적으로 사람이 읽을 수 있고 SEO에 친화적인 URL을 만드는 데 사용됩니다. 특수 문자를 제거하고, 공백을 하이픈으로 바꾸고, 소문자로 변환하여 텍스트를 변환합니다.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"내 블로그 제목\" → \"nae-beullogeu-jemok\"",
    "example3": "\"제품: iPhone 15 Pro\" → \"jepum-iphone-15-pro\"",
    "benefits": "Slug는 URL 가독성을 향상시키고, SEO에 도움이 되며, 링크를 공유하고 기억하기 쉽게 만듭니다."
  },
  "ru": {
    "title": "Что такое Slug?",
    "description": "Slug — это URL-совместимая версия строки, обычно используемая для создания читаемых и SEO-оптимизированных URL-адресов. Он преобразует текст, удаляя специальные символы, заменяя пробелы дефисами и переводя в нижний регистр.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Мой Заголовок Блога\" → \"moj-zagolovok-bloga\"",
    "example3": "\"Продукт: iPhone 15 Pro\" → \"produkt-iphone-15-pro\"",
    "benefits": "Slug улучшает читаемость URL, помогает с SEO и делает ссылки более удобными для распространения и запоминания."
  },
  "pt": {
    "title": "O que é um Slug?",
    "description": "Um slug é uma versão amigável para URL de uma string, tipicamente usada para criar URLs legíveis e otimizadas para SEO. Ele converte o texto removendo caracteres especiais, substituindo espaços por hífens e convertendo para minúsculas.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Meu Título de Blog\" → \"meu-titulo-de-blog\"",
    "example3": "\"Produto: iPhone 15 Pro\" → \"produto-iphone-15-pro\"",
    "benefits": "Slugs melhoram a legibilidade das URLs, ajudam com SEO e tornam os links mais fáceis de compartilhar e lembrar."
  },
  "ar": {
    "title": "ما هو الـ Slug؟",
    "description": "الـ Slug هو نسخة متوافقة مع عناوين URL من النص، تُستخدم عادةً لإنشاء عناوين URL قابلة للقراءة وصديقة لمحركات البحث. يقوم بتحويل النص عن طريق إزالة الأحرف الخاصة، واستبدال المسافات بشرطات، وتحويلها إلى أحرف صغيرة.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"عنوان مدونتي\" → \"anwan-mdwnty\"",
    "example3": "\"منتج: iPhone 15 Pro\" → \"mntj-iphone-15-pro\"",
    "benefits": "تحسن الـ Slugs قابلية قراءة عناوين URL، وتساعد في تحسين محركات البحث، وتجعل الروابط أسهل للمشاركة والتذكر."
  },
  "hi": {
    "title": "Slug क्या है?",
    "description": "Slug एक स्ट्रिंग का URL-अनुकूल संस्करण है, जो आमतौर पर मानव-पठनीय और SEO-अनुकूल URL बनाने के लिए उपयोग किया जाता है। यह विशेष वर्णों को हटाकर, स्पेस को हाइफ़न से बदलकर और लोअरकेस में बदलकर टेक्स्ट को परिवर्तित करता है।",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"मेरा ब्लॉग शीर्षक\" → \"mera-blog-shirshak\"",
    "example3": "\"उत्पाद: iPhone 15 Pro\" → \"utpad-iphone-15-pro\"",
    "benefits": "Slug URL की पठनीयता में सुधार करते हैं, SEO में मदद करते हैं, और लिंक को साझा करने और याद रखने में आसान बनाते हैं।"
  },
  "tr": {
    "title": "Slug Nedir?",
    "description": "Slug, bir dizenin URL dostu sürümüdür ve genellikle okunabilir ve SEO dostu URL'ler oluşturmak için kullanılır. Özel karakterleri kaldırarak, boşlukları tirelerle değiştirerek ve küçük harfe dönüştürerek metni dönüştürür.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Blog Başlığım\" → \"blog-basligim\"",
    "example3": "\"Ürün: iPhone 15 Pro\" → \"urun-iphone-15-pro\"",
    "benefits": "Slug'lar URL okunabilirliğini artırır, SEO'ya yardımcı olur ve bağlantıları paylaşmayı ve hatırlamayı kolaylaştırır."
  },
  "nl": {
    "title": "Wat is een Slug?",
    "description": "Een slug is een URL-vriendelijke versie van een string, meestal gebruikt om leesbare en SEO-vriendelijke URL's te maken. Het converteert tekst door speciale tekens te verwijderen, spaties te vervangen door koppeltekens en om te zetten naar kleine letters.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Mijn Blogtitel\" → \"mijn-blogtitel\"",
    "example3": "\"Product: iPhone 15 Pro\" → \"product-iphone-15-pro\"",
    "benefits": "Slugs verbeteren de leesbaarheid van URL's, helpen met SEO en maken links gemakkelijker te delen en te onthouden."
  },
  "sv": {
    "title": "Vad är en Slug?",
    "description": "En slug är en URL-vänlig version av en sträng, vanligtvis använd för att skapa läsbara och SEO-vänliga URL:er. Den konverterar text genom att ta bort specialtecken, ersätta mellanslag med bindestreck och konvertera till gemener.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Min Bloggtitel\" → \"min-bloggtitel\"",
    "example3": "\"Produkt: iPhone 15 Pro\" → \"produkt-iphone-15-pro\"",
    "benefits": "Slugs förbättrar URL-läsbarheten, hjälper med SEO och gör länkar enklare att dela och komma ihåg."
  },
  "pl": {
    "title": "Czym jest Slug?",
    "description": "Slug to przyjazna dla URL wersja ciągu znaków, zwykle używana do tworzenia czytelnych i przyjaznych dla SEO adresów URL. Konwertuje tekst, usuwając znaki specjalne, zamieniając spacje na myślniki i konwertując na małe litery.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Mój Tytuł Bloga\" → \"moj-tytul-bloga\"",
    "example3": "\"Produkt: iPhone 15 Pro\" → \"produkt-iphone-15-pro\"",
    "benefits": "Slugi poprawiają czytelność URL, pomagają w SEO i ułatwiają udostępnianie i zapamiętywanie linków."
  },
  "vi": {
    "title": "Slug là gì?",
    "description": "Slug là phiên bản thân thiện với URL của một chuỗi, thường được sử dụng để tạo các URL dễ đọc và thân thiện với SEO. Nó chuyển đổi văn bản bằng cách loại bỏ các ký tự đặc biệt, thay thế khoảng trắng bằng dấu gạch ngang và chuyển thành chữ thường.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Tiêu Đề Blog Của Tôi\" → \"tieu-de-blog-cua-toi\"",
    "example3": "\"Sản phẩm: iPhone 15 Pro\" → \"san-pham-iphone-15-pro\"",
    "benefits": "Slug cải thiện khả năng đọc URL, hỗ trợ SEO và giúp các liên kết dễ chia sẻ và ghi nhớ hơn."
  },
  "th": {
    "title": "Slug คืออะไร?",
    "description": "Slug คือเวอร์ชันที่เป็นมิตรกับ URL ของสตริง โดยทั่วไปใช้เพื่อสร้าง URL ที่อ่านง่ายและเป็นมิตรกับ SEO มันแปลงข้อความโดยการลบอักขระพิเศษ แทนที่ช่องว่างด้วยขีด และแปลงเป็นตัวพิมพ์เล็ก",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"หัวข้อบล็อกของฉัน\" → \"hawkhxbilxgkhxngchan\"",
    "example3": "\"ผลิตภัณฑ์: iPhone 15 Pro\" → \"phlitphanth-iphone-15-pro\"",
    "benefits": "Slug ช่วยปรับปรุงความสามารถในการอ่าน URL ช่วยในเรื่อง SEO และทำให้ลิงก์แชร์และจำได้ง่ายขึ้น"
  },
  "id": {
    "title": "Apa itu Slug?",
    "description": "Slug adalah versi ramah URL dari sebuah string, biasanya digunakan untuk membuat URL yang mudah dibaca dan ramah SEO. Ini mengonversi teks dengan menghapus karakter khusus, mengganti spasi dengan tanda hubung, dan mengubahnya menjadi huruf kecil.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Judul Blog Saya\" → \"judul-blog-saya\"",
    "example3": "\"Produk: iPhone 15 Pro\" → \"produk-iphone-15-pro\"",
    "benefits": "Slug meningkatkan keterbacaan URL, membantu SEO, dan membuat tautan lebih mudah dibagikan dan diingat."
  },
  "he": {
    "title": "מה זה Slug?",
    "description": "Slug הוא גרסה ידידותית ל-URL של מחרוזת, המשמשת בדרך כלל ליצירת כתובות URL קריאות וידידותיות ל-SEO. הוא ממיר טקסט על ידי הסרת תווים מיוחדים, החלפת רווחים במקפים והמרה לאותיות קטנות.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"כותרת הבלוג שלי\" → \"kotrת-hblwg-shly\"",
    "example3": "\"מוצר: iPhone 15 Pro\" → \"mwzr-iphone-15-pro\"",
    "benefits": "Slugs משפרים את קריאות ה-URL, עוזרים ל-SEO ומקלים על שיתוף וזכירת קישורים."
  },
  "ms": {
    "title": "Apakah Slug?",
    "description": "Slug ialah versi mesra URL bagi rentetan, biasanya digunakan untuk mencipta URL yang boleh dibaca dan mesra SEO. Ia menukar teks dengan membuang aksara khas, menggantikan ruang dengan sempang, dan menukar kepada huruf kecil.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Tajuk Blog Saya\" → \"tajuk-blog-saya\"",
    "example3": "\"Produk: iPhone 15 Pro\" → \"produk-iphone-15-pro\"",
    "benefits": "Slug meningkatkan kebolehbacaan URL, membantu SEO, dan menjadikan pautan lebih mudah dikongsi dan diingat."
  },
  "no": {
    "title": "Hva er en Slug?",
    "description": "En slug er en URL-vennlig versjon av en streng, vanligvis brukt for å lage lesbare og SEO-vennlige URL-er. Den konverterer tekst ved å fjerne spesialtegn, erstatte mellomrom med bindestreker og konvertere til små bokstaver.",
    "example1": "\"Hello World!\" → \"hello-world\"",
    "example2": "\"Min Bloggtittel\" → \"min-bloggtittel\"",
    "example3": "\"Produkt: iPhone 15 Pro\" → \"produkt-iphone-15-pro\"",
    "benefits": "Slugs forbedrer URL-lesbarheten, hjelper med SEO og gjør lenker enklere å dele og huske."
  }
}
</i18n>
