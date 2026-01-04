<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is Data URI?",
    "description": "Data URI (or data URL) embeds small files directly inside text. Format: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Common uses:**\n- Inline images or fonts in HTML/CSS\n- Store small assets in JSON/configs\n\n**Notes:**\n- Best for small files; large strings can slow pages\n- Base64 is common for binary data"
  },
  "zh": {
    "title": "什么是 Data URI？",
    "description": "Data URI（也叫 data URL）可以把小文件直接嵌入到文本中。格式：`data:[mime][;charset][;base64],&lt;data&gt;`。\n\n**常见用途：**\n- 在 HTML/CSS 中内联图片或字体\n- 在 JSON/配置中保存小资源\n\n**注意：**\n- 适合小文件，过大会让页面变慢\n- 二进制通常使用 Base64"
  },
  "zh-CN": {
    "title": "什么是 Data URI？",
    "description": "Data URI（也叫 data URL）可以把小文件直接嵌入到文本中。格式：`data:[mime][;charset][;base64],&lt;data&gt;`。\n\n**常见用途：**\n- 在 HTML/CSS 中内联图片或字体\n- 在 JSON/配置中保存小资源\n\n**注意：**\n- 适合小文件，过大会让页面变慢\n- 二进制通常使用 Base64"
  },
  "zh-TW": {
    "title": "什麼是 Data URI？",
    "description": "Data URI（也叫 data URL）可以把小檔案直接嵌入到文字中。格式：`data:[mime][;charset][;base64],&lt;data&gt;`。\n\n**常見用途：**\n- 在 HTML/CSS 中內嵌圖片或字型\n- 在 JSON/設定中保存小資源\n\n**注意：**\n- 適合小檔案，過大會讓頁面變慢\n- 二進位通常使用 Base64"
  },
  "zh-HK": {
    "title": "什麼是 Data URI？",
    "description": "Data URI（也叫 data URL）可以把小檔案直接嵌入到文字中。格式：`data:[mime][;charset][;base64],&lt;data&gt;`。\n\n**常見用途：**\n- 在 HTML/CSS 中內嵌圖片或字型\n- 在 JSON/設定中保存小資源\n\n**注意：**\n- 適合小檔案，過大會讓頁面變慢\n- 二進位通常使用 Base64"
  },
  "es": {
    "title": "¿Qué es Data URI?",
    "description": "Data URI (o data URL) incrusta archivos pequeños directamente en el texto. Formato: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Usos comunes:**\n- Imágenes o fuentes incrustadas en HTML/CSS\n- Guardar recursos pequeños en JSON/configs\n\n**Notas:**\n- Ideal para archivos pequeños; cadenas grandes pueden ralentizar la página\n- Base64 es común para datos binarios"
  },
  "fr": {
    "title": "Qu'est-ce qu'un Data URI ?",
    "description": "Data URI (ou data URL) intègre de petits fichiers directement dans le texte. Format : `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Usages courants :**\n- Images ou polices en ligne dans HTML/CSS\n- Stocker de petits assets dans JSON/configs\n\n**Remarques :**\n- Idéal pour de petits fichiers ; les longues chaînes peuvent ralentir la page\n- Base64 est courant pour les données binaires"
  },
  "de": {
    "title": "Was ist Data URI?",
    "description": "Data URI (oder data URL) bettet kleine Dateien direkt in Text ein. Format: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Häufige Nutzung:**\n- Inline-Bilder oder -Schriften in HTML/CSS\n- Kleine Assets in JSON/Configs speichern\n\n**Hinweise:**\n- Geeignet für kleine Dateien; große Strings können Seiten verlangsamen\n- Base64 ist üblich für Binärdaten"
  },
  "it": {
    "title": "Cos'è Data URI?",
    "description": "Data URI (o data URL) incorpora piccoli file direttamente nel testo. Formato: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Usi comuni:**\n- Immagini o font inline in HTML/CSS\n- Salvare piccoli asset in JSON/config\n\n**Note:**\n- Ideale per file piccoli; stringhe grandi possono rallentare la pagina\n- Base64 è comune per dati binari"
  },
  "ja": {
    "title": "Data URI とは？",
    "description": "Data URI（data URL）は小さなファイルをテキスト内に直接埋め込みます。形式：`data:[mime][;charset][;base64],&lt;data&gt;`。\n\n**主な用途：**\n- HTML/CSS に画像やフォントをインライン埋め込み\n- JSON/設定に小さなリソースを保存\n\n**注意点：**\n- 小さなファイル向き。長い文字列はページを重くする場合があります\n- バイナリは Base64 が一般的です"
  },
  "ko": {
    "title": "Data URI란?",
    "description": "Data URI(또는 data URL)는 작은 파일을 텍스트에 직접 포함합니다. 형식: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**일반적인 용도:**\n- HTML/CSS에 이미지 또는 폰트 인라인 삽입\n- JSON/설정에 작은 리소스 저장\n\n**참고:**\n- 작은 파일에 적합하며, 긴 문자열은 페이지를 느리게 할 수 있습니다\n- 바이너리는 Base64가 일반적입니다"
  },
  "ru": {
    "title": "Что такое Data URI?",
    "description": "Data URI (или data URL) встраивает небольшие файлы прямо в текст. Формат: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Обычно используется для:**\n- Встраивания изображений или шрифтов в HTML/CSS\n- Хранения небольших ресурсов в JSON/настройках\n\n**Примечания:**\n- Подходит для небольших файлов; большие строки могут замедлять страницу\n- Base64 часто используется для бинарных данных"
  },
  "pt": {
    "title": "O que é Data URI?",
    "description": "Data URI (ou data URL) incorpora arquivos pequenos diretamente no texto. Formato: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Usos comuns:**\n- Imagens ou fontes inline em HTML/CSS\n- Guardar pequenos assets em JSON/configs\n\n**Notas:**\n- Ideal para arquivos pequenos; strings grandes podem deixar a página lenta\n- Base64 é comum para dados binários"
  },
  "ar": {
    "title": "ما هو Data URI؟",
    "description": "Data URI (أو data URL) يدمج الملفات الصغيرة مباشرة داخل النص. الصيغة: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**الاستخدامات الشائعة:**\n- تضمين الصور أو الخطوط داخل HTML/CSS\n- حفظ الموارد الصغيرة في JSON/الإعدادات\n\n**ملاحظات:**\n- مناسب للملفات الصغيرة؛ السلاسل الطويلة قد تبطئ الصفحة\n- Base64 شائع للبيانات الثنائية"
  },
  "hi": {
    "title": "Data URI क्या है?",
    "description": "Data URI (या data URL) छोटे फ़ाइलों को सीधे टेक्स्ट में एम्बेड करता है। फ़ॉर्मेट: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**सामान्य उपयोग:**\n- HTML/CSS में इमेज या फ़ॉन्ट इनलाइन\n- JSON/कॉन्फ़िग में छोटे एसेट्स स्टोर करना\n\n**नोट्स:**\n- छोटे फ़ाइलों के लिए बेहतर; बड़ी स्ट्रिंग्स पेज को धीमा कर सकती हैं\n- बाइनरी डेटा के लिए Base64 आम है"
  },
  "tr": {
    "title": "Data URI nedir?",
    "description": "Data URI (veya data URL) küçük dosyaları doğrudan metne gömer. Biçim: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Yaygın kullanım:**\n- HTML/CSS içinde görsel veya yazı tipi gömme\n- JSON/ayar dosyalarında küçük kaynakları saklama\n\n**Notlar:**\n- Küçük dosyalar için uygundur; büyük dizgeler sayfayı yavaşlatabilir\n- İkili veriler için Base64 yaygındır"
  },
  "nl": {
    "title": "Wat is Data URI?",
    "description": "Data URI (of data URL) plaatst kleine bestanden direct in tekst. Formaat: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Veelvoorkomend gebruik:**\n- Afbeeldingen of fonts inline in HTML/CSS\n- Kleine assets opslaan in JSON/configs\n\n**Opmerkingen:**\n- Geschikt voor kleine bestanden; lange strings kunnen pagina's vertragen\n- Base64 is gebruikelijk voor binaire data"
  },
  "sv": {
    "title": "Vad är Data URI?",
    "description": "Data URI (eller data URL) bäddar in små filer direkt i text. Format: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Vanliga användningar:**\n- Inline-bilder eller typsnitt i HTML/CSS\n- Lagra små resurser i JSON/konfig\n\n**Noteringar:**\n- Bäst för små filer; långa strängar kan göra sidor långsammare\n- Base64 är vanligt för binära data"
  },
  "pl": {
    "title": "Co to jest Data URI?",
    "description": "Data URI (lub data URL) osadza małe pliki bezpośrednio w tekście. Format: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Typowe zastosowania:**\n- Obrazy lub fonty inline w HTML/CSS\n- Przechowywanie małych zasobów w JSON/konfigach\n\n**Uwagi:**\n- Najlepsze dla małych plików; długie ciągi mogą spowolnić stronę\n- Base64 jest powszechne dla danych binarnych"
  },
  "vi": {
    "title": "Data URI là gì?",
    "description": "Data URI (hoặc data URL) nhúng các tệp nhỏ trực tiếp vào văn bản. Định dạng: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Cách dùng phổ biến:**\n- Ảnh hoặc phông chữ inline trong HTML/CSS\n- Lưu tài nguyên nhỏ trong JSON/cấu hình\n\n**Lưu ý:**\n- Phù hợp cho tệp nhỏ; chuỗi dài có thể làm chậm trang\n- Base64 thường dùng cho dữ liệu nhị phân"
  },
  "th": {
    "title": "Data URI คืออะไร?",
    "description": "Data URI (หรือ data URL) ฝังไฟล์ขนาดเล็กลงในข้อความโดยตรง รูปแบบ: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**การใช้งานทั่วไป:**\n- ฝังรูปภาพหรือฟอนต์ใน HTML/CSS\n- เก็บทรัพยากรขนาดเล็กใน JSON/คอนฟิก\n\n**หมายเหตุ:**\n- เหมาะกับไฟล์เล็ก; สตริงยาวอาจทำให้หน้าเว็บช้าลง\n- Base64 ใช้บ่อยกับข้อมูลไบนารี"
  },
  "id": {
    "title": "Apa itu Data URI?",
    "description": "Data URI (atau data URL) menyematkan file kecil langsung ke teks. Format: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Penggunaan umum:**\n- Gambar atau font inline di HTML/CSS\n- Menyimpan aset kecil di JSON/konfig\n\n**Catatan:**\n- Cocok untuk file kecil; string panjang bisa memperlambat halaman\n- Base64 umum untuk data biner"
  },
  "he": {
    "title": "מה זה Data URI?",
    "description": "Data URI (או data URL) מטמיע קבצים קטנים ישירות בטקסט. פורמט: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**שימושים נפוצים:**\n- הטמעת תמונות או גופנים בתוך HTML/CSS\n- שמירת נכסים קטנים ב-JSON/קונפיגים\n\n**הערות:**\n- מתאים לקבצים קטנים; מחרוזות ארוכות עלולות להאט את הדף\n- Base64 נפוץ לנתונים בינריים"
  },
  "ms": {
    "title": "Apa itu Data URI?",
    "description": "Data URI (atau data URL) menyematkan fail kecil terus ke dalam teks. Format: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Penggunaan biasa:**\n- Imej atau fon sebaris dalam HTML/CSS\n- Simpan aset kecil dalam JSON/konfig\n\n**Nota:**\n- Sesuai untuk fail kecil; rentetan panjang boleh memperlahankan halaman\n- Base64 biasa digunakan untuk data binari"
  },
  "no": {
    "title": "Hva er Data URI?",
    "description": "Data URI (eller data URL) bygger inn små filer direkte i tekst. Format: `data:[mime][;charset][;base64],&lt;data&gt;`.\n\n**Vanlige bruksområder:**\n- Inline-bilder eller skrifter i HTML/CSS\n- Lagre små ressurser i JSON/konfig\n\n**Merknader:**\n- Best for små filer; lange strenger kan gjøre siden treg\n- Base64 er vanlig for binære data"
  }
}
</i18n>
