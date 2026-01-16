<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <p>{{ t('description') }}</p>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What are Unicode Invisible Characters?",
    "description": "Unicode invisible characters are characters that do not display but still affect spacing, line breaks, or text direction. They are often used for formatting but can hide in copied text, so this tool highlights them and can export a cleaned version."
  },
  "zh": {
    "title": "什么是 Unicode 不可见字符？",
    "description": "Unicode 不可见字符是看不见但仍会影响间距、换行或文本方向的字符。它们常用于排版，但也可能隐藏在复制的文本中，因此此工具会高亮它们并可导出清理后的文本。"
  },
  "zh-CN": {
    "title": "什么是 Unicode 不可见字符？",
    "description": "Unicode 不可见字符是看不见但仍会影响间距、换行或文本方向的字符。它们常用于排版，但也可能隐藏在复制的文本中，因此此工具会高亮它们并可导出清理后的文本。"
  },
  "zh-TW": {
    "title": "什麼是 Unicode 不可見字元？",
    "description": "Unicode 不可見字元是看不見但仍會影響間距、換行或文字方向的字元。它們常用於排版，但也可能隱藏在複製的文字中，因此此工具會高亮它們並可匯出清理後的文字。"
  },
  "zh-HK": {
    "title": "什麼是 Unicode 不可見字元？",
    "description": "Unicode 不可見字元是看不見但仍會影響間距、換行或文字方向的字元。它們常用於排版，但也可能隱藏在複製的文字中，因此此工具會高亮它們並可匯出清理後的文字。"
  },
  "es": {
    "title": "¿Qué son los caracteres invisibles de Unicode?",
    "description": "Los caracteres invisibles de Unicode son caracteres que no se muestran pero aun así afectan el espaciado, los saltos de línea o la dirección del texto. A menudo se usan para el formato, pero pueden ocultarse en texto copiado, por lo que esta herramienta los resalta y puede exportar una versión limpia."
  },
  "fr": {
    "title": "Que sont les caractères invisibles Unicode ?",
    "description": "Les caractères invisibles Unicode sont des caractères qui ne s'affichent pas mais influencent tout de même l'espacement, les sauts de ligne ou la direction du texte. Ils sont souvent utilisés pour la mise en forme, mais peuvent se cacher dans du texte copié, donc cet outil les met en évidence et peut exporter une version nettoyée."
  },
  "de": {
    "title": "Was sind unsichtbare Unicode-Zeichen?",
    "description": "Unsichtbare Unicode-Zeichen sind Zeichen, die nicht angezeigt werden, aber dennoch Abstände, Zeilenumbrüche oder die Textrichtung beeinflussen. Sie werden oft zur Formatierung verwendet, können sich aber in kopiertem Text verstecken, daher hebt dieses Tool sie hervor und kann eine bereinigte Version exportieren."
  },
  "it": {
    "title": "Cosa sono i caratteri invisibili Unicode?",
    "description": "I caratteri invisibili Unicode sono caratteri che non vengono visualizzati ma influenzano comunque spaziatura, a capo o direzione del testo. Sono spesso usati per la formattazione, ma possono nascondersi nel testo copiato, quindi questo strumento li evidenzia e può esportare una versione pulita."
  },
  "ja": {
    "title": "Unicode の不可視文字とは？",
    "description": "Unicode の不可視文字は表示されないものの、間隔、改行、または文字方向に影響する文字です。書式設定に使われることが多い一方、コピーしたテキストに紛れ込むことがあるため、このツールはそれらを強調表示し、クリーンなテキストを出力できます。"
  },
  "ko": {
    "title": "Unicode 보이지 않는 문자란?",
    "description": "Unicode 보이지 않는 문자는 화면에 표시되지 않지만 공백, 줄 바꿈 또는 텍스트 방향에 영향을 주는 문자입니다. 서식 지정에 자주 쓰이지만 복사한 텍스트에 숨어 있을 수 있어, 이 도구는 이를 표시하고 정리된 버전을 내보낼 수 있습니다."
  },
  "ru": {
    "title": "Что такое невидимые символы Unicode?",
    "description": "Невидимые символы Unicode - это символы, которые не отображаются, но все равно влияют на пробелы, переносы строк или направление текста. Они часто используются для форматирования, но могут скрываться в скопированном тексте, поэтому этот инструмент их подсвечивает и может экспортировать очищенную версию."
  },
  "pt": {
    "title": "O que são caracteres invisíveis do Unicode?",
    "description": "Caracteres invisíveis do Unicode são caracteres que não aparecem, mas ainda afetam o espaçamento, as quebras de linha ou a direção do texto. Eles são frequentemente usados para formatação, mas podem se esconder em texto copiado, então esta ferramenta os destaca e pode exportar uma versão limpa."
  },
  "ar": {
    "title": "ما هي أحرف Unicode غير المرئية؟",
    "description": "أحرف Unicode غير المرئية هي أحرف لا تظهر لكنها ما زالت تؤثر في المسافات أو فواصل الأسطر أو اتجاه النص. تُستخدم غالبًا للتنسيق، لكنها قد تختبئ في نص منسوخ، لذلك تبرزها هذه الأداة ويمكنها تصدير نسخة منقاة."
  },
  "hi": {
    "title": "Unicode के अदृश्य वर्ण क्या हैं?",
    "description": "Unicode के अदृश्य वर्ण ऐसे वर्ण हैं जो दिखाई नहीं देते लेकिन फिर भी स्पेसिंग, लाइन ब्रेक या पाठ की दिशा को प्रभावित करते हैं। ये अक्सर फॉर्मैटिंग के लिए उपयोग किए जाते हैं, लेकिन कॉपी किए गए टेक्स्ट में छिप सकते हैं, इसलिए यह टूल उन्हें हाइलाइट करता है और साफ़ संस्करण निर्यात कर सकता है।"
  },
  "tr": {
    "title": "Unicode görünmez karakterler nedir?",
    "description": "Unicode görünmez karakterler, görünmeyen ancak boşlukları, satır sonlarını veya metin yönünü etkileyen karakterlerdir. Genellikle biçimlendirme için kullanılırlar, ancak kopyalanan metinde gizlenebilirler; bu araç onları vurgular ve temizlenmiş bir sürümü dışa aktarabilir."
  },
  "nl": {
    "title": "Wat zijn onzichtbare Unicode-tekens?",
    "description": "Onzichtbare Unicode-tekens zijn tekens die niet worden weergegeven maar toch invloed hebben op spaties, regelafbrekingen of de tekstrichting. Ze worden vaak gebruikt voor opmaak, maar kunnen zich verbergen in gekopieerde tekst, daarom markeert deze tool ze en kan een opgeschoonde versie exporteren."
  },
  "sv": {
    "title": "Vad är osynliga Unicode-tecken?",
    "description": "Osynliga Unicode-tecken är tecken som inte visas men ändå påverkar mellanrum, radbrytningar eller textriktning. De används ofta för formatering, men kan gömma sig i kopierad text, därför markerar det här verktyget dem och kan exportera en rensad version."
  },
  "pl": {
    "title": "Czym są niewidoczne znaki Unicode?",
    "description": "Niewidoczne znaki Unicode to znaki, które się nie wyświetlają, ale wciąż wpływają na odstępy, łamanie linii lub kierunek tekstu. Często służą do formatowania, ale mogą ukrywać się w skopiowanym tekście, dlatego to narzędzie je podświetla i może wyeksportować oczyszczoną wersję."
  },
  "vi": {
    "title": "Ký tự Unicode vô hình là gì?",
    "description": "Ký tự Unicode vô hình là các ký tự không hiển thị nhưng vẫn ảnh hưởng đến khoảng trắng, xuống dòng hoặc hướng văn bản. Chúng thường dùng để định dạng, nhưng có thể ẩn trong văn bản đã sao chép, vì vậy công cụ này sẽ làm nổi bật chúng và có thể xuất ra phiên bản đã làm sạch."
  },
  "th": {
    "title": "อักขระ Unicode ที่มองไม่เห็นคืออะไร?",
    "description": "อักขระ Unicode ที่มองไม่เห็นคืออักขระที่ไม่แสดงผล แต่ยังคงส่งผลต่อช่องว่าง การขึ้นบรรทัดใหม่ หรือทิศทางของข้อความ มักใช้เพื่อการจัดรูปแบบ แต่สามารถซ่อนอยู่ในข้อความที่คัดลอกมาได้ ดังนั้นเครื่องมือนี้จะไฮไลต์และสามารถส่งออกเวอร์ชันที่ทำความสะอาดแล้วได้"
  },
  "id": {
    "title": "Apa itu karakter tak terlihat Unicode?",
    "description": "Karakter tak terlihat Unicode adalah karakter yang tidak tampil tetapi tetap memengaruhi spasi, pergantian baris, atau arah teks. Karakter ini sering digunakan untuk pemformatan, tetapi bisa tersembunyi dalam teks yang disalin, sehingga alat ini menyorotnya dan dapat mengekspor versi yang dibersihkan."
  },
  "he": {
    "title": "מהם תווי Unicode בלתי נראים?",
    "description": "תווי Unicode בלתי נראים הם תווים שאינם מוצגים אך עדיין משפיעים על רווחים, שבירת שורה או כיוון הטקסט. הם משמשים לעיתים קרובות לעיצוב, אך יכולים להסתתר בטקסט שהועתק, לכן הכלי הזה מדגיש אותם ויכול לייצא גרסה נקייה."
  },
  "ms": {
    "title": "Apakah aksara Unicode tidak kelihatan?",
    "description": "Aksara Unicode tidak kelihatan ialah aksara yang tidak dipaparkan tetapi masih mempengaruhi jarak, pemisah baris atau arah teks. Ia sering digunakan untuk pemformatan tetapi boleh tersembunyi dalam teks yang disalin, jadi alat ini menyorotnya dan boleh mengeksport versi yang dibersihkan."
  },
  "no": {
    "title": "Hva er usynlige Unicode-tegn?",
    "description": "Usynlige Unicode-tegn er tegn som ikke vises, men som likevel påvirker mellomrom, linjeskift eller tekstretning. De brukes ofte til formatering, men kan skjule seg i kopiert tekst, så dette verktøyet markerer dem og kan eksportere en renset versjon."
  }
}
</i18n>
