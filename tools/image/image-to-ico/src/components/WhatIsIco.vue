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
    "title": "What is ICO?",
    "description": "ICO is an icon file format used by Windows and browsers for favicons and app icons. A single ICO can bundle multiple square sizes, so each platform can pick the best match.\n\n**Common uses**\n- Classic browser favicons\n- Windows app and shortcut icons\n- Bundling many sizes into one file"
  },
  "zh": {
    "title": "什么是 ICO？",
    "description": "ICO 是一种图标文件格式，Windows 和浏览器常用于网站图标与应用图标。一个 ICO 可以同时包含多种正方形尺寸，方便不同平台选择合适的大小。\n\n**常见用途：**\n- 传统浏览器的 favicon\n- Windows 应用与快捷方式图标\n- 将多个尺寸打包到一个文件"
  },
  "zh-CN": {
    "title": "什么是 ICO？",
    "description": "ICO 是一种图标文件格式，Windows 和浏览器常用于网站图标与应用图标。一个 ICO 可以同时包含多种正方形尺寸，方便不同平台选择合适的大小。\n\n**常见用途：**\n- 传统浏览器的 favicon\n- Windows 应用与快捷方式图标\n- 将多个尺寸打包到一个文件"
  },
  "zh-TW": {
    "title": "什麼是 ICO？",
    "description": "ICO 是一種圖示檔案格式，Windows 與瀏覽器常用於網站圖示與應用圖示。一個 ICO 可以同時包含多種正方形尺寸，方便不同平台選擇合適的大小。\n\n**常見用途：**\n- 傳統瀏覽器的 favicon\n- Windows 應用與捷徑圖示\n- 將多個尺寸打包到一個檔案"
  },
  "zh-HK": {
    "title": "什麼是 ICO？",
    "description": "ICO 是一種圖示檔案格式，Windows 與瀏覽器常用於網站圖示與應用圖示。一個 ICO 可以同時包含多種正方形尺寸，方便不同平台選擇合適的大小。\n\n**常見用途：**\n- 傳統瀏覽器的 favicon\n- Windows 應用與捷徑圖示\n- 將多個尺寸打包到一個檔案"
  },
  "es": {
    "title": "¿Qué es ICO?",
    "description": "ICO es un formato de archivo de iconos usado por Windows y los navegadores para favicons e iconos de apps. Un solo ICO puede incluir varios tamaños cuadrados para que cada plataforma elija el más adecuado.\n\n**Usos comunes:**\n- Favicons clásicos del navegador\n- Iconos de aplicaciones y accesos directos en Windows\n- Agrupar muchos tamaños en un solo archivo"
  },
  "fr": {
    "title": "Qu'est-ce qu'un ICO ?",
    "description": "ICO est un format de fichier d'icône utilisé par Windows et les navigateurs pour les favicons et les icônes d'applications. Un seul ICO peut contenir plusieurs tailles carrées afin que chaque plateforme choisisse la meilleure.\n\n**Usages courants :**\n- Favicons des navigateurs classiques\n- Icônes d'applications et de raccourcis Windows\n- Regrouper plusieurs tailles dans un seul fichier"
  },
  "de": {
    "title": "Was ist ICO?",
    "description": "ICO ist ein Icon-Dateiformat, das von Windows und Browsern für Favicons und App-Symbole verwendet wird. Eine einzelne ICO-Datei kann mehrere quadratische Größen enthalten, damit jede Plattform die passende wählen kann.\n\n**Häufige Nutzung:**\n- Klassische Browser-Favicons\n- Windows-App- und Verknüpfungssymbole\n- Mehrere Größen in einer Datei bündeln"
  },
  "it": {
    "title": "Cos'è ICO?",
    "description": "ICO è un formato di file di icone usato da Windows e dai browser per favicon e icone delle app. Un singolo ICO può contenere più dimensioni quadrate, così ogni piattaforma può scegliere quella migliore.\n\n**Usi comuni:**\n- Favicon dei browser classici\n- Icone di app e collegamenti di Windows\n- Raggruppare più dimensioni in un solo file"
  },
  "ja": {
    "title": "ICO とは？",
    "description": "ICO は Windows やブラウザでファビコンやアプリアイコンに使われるアイコンファイル形式です。1 つの ICO に複数の正方形サイズをまとめられるため、各プラットフォームが最適なサイズを選べます。\n\n**主な用途：**\n- 従来のブラウザのファビコン\n- Windows のアプリ/ショートカットアイコン\n- 複数サイズを 1 つのファイルにまとめる"
  },
  "ko": {
    "title": "ICO란?",
    "description": "ICO는 Windows와 브라우저에서 파비콘과 앱 아이콘에 사용하는 아이콘 파일 형식입니다. 하나의 ICO에 여러 정사각형 크기를 담을 수 있어 플랫폼이 가장 적합한 크기를 선택할 수 있습니다.\n\n**주요 용도:**\n- 클래식 브라우저 파비콘\n- Windows 앱 및 바로가기 아이콘\n- 여러 크기를 하나의 파일로 묶기"
  },
  "ru": {
    "title": "Что такое ICO?",
    "description": "ICO — это формат файла иконок, который Windows и браузеры используют для фавиконов и значков приложений. Один ICO может содержать несколько квадратных размеров, чтобы платформа выбрала подходящий.\n\n**Типичные случаи:**\n- Классические фавиконы браузеров\n- Значки приложений и ярлыков Windows\n- Объединение нескольких размеров в одном файле"
  },
  "pt": {
    "title": "O que é ICO?",
    "description": "ICO é um formato de arquivo de ícones usado pelo Windows e pelos navegadores para favicons e ícones de apps. Um único ICO pode incluir vários tamanhos quadrados para que cada plataforma escolha o melhor.\n\n**Usos comuns:**\n- Favicons clássicos de navegadores\n- Ícones de apps e atalhos do Windows\n- Agrupar vários tamanhos em um único arquivo"
  },
  "ar": {
    "title": "ما هو ICO؟",
    "description": "ICO هو تنسيق ملف للأيقونات تستخدمه Windows والمتصفحات لأيقونات المواقع والتطبيقات. يمكن لملف ICO واحد أن يتضمن عدة أحجام مربعة بحيث تختار كل منصة الحجم الأنسب.\n\n**الاستخدامات الشائعة:**\n- أيقونات المتصفح الكلاسيكية (favicon)\n- أيقونات تطبيقات واختصارات Windows\n- تجميع عدة أحجام في ملف واحد"
  },
  "hi": {
    "title": "ICO क्या है?",
    "description": "ICO एक आइकन फ़ाइल फ़ॉर्मेट है जिसका उपयोग Windows और ब्राउज़र फ़ेविकॉन और ऐप आइकन के लिए करते हैं। एक ही ICO में कई वर्गाकार आकार शामिल किए जा सकते हैं ताकि हर प्लेटफ़ॉर्म उपयुक्त आकार चुन सके।\n\n**सामान्य उपयोग:**\n- क्लासिक ब्राउज़र फ़ेविकॉन\n- Windows ऐप और शॉर्टकट आइकन\n- कई आकारों को एक फ़ाइल में समेटना"
  },
  "tr": {
    "title": "ICO nedir?",
    "description": "ICO, Windows ve tarayıcıların favicon ve uygulama simgeleri için kullandığı bir simge dosya biçimidir. Tek bir ICO, birden çok kare boyutu içererek her platformun en uygun boyutu seçmesini sağlar.\n\n**Yaygın kullanım:**\n- Klasik tarayıcı favikonları\n- Windows uygulama ve kısayol simgeleri\n- Birden çok boyutu tek dosyada toplama"
  },
  "nl": {
    "title": "Wat is ICO?",
    "description": "ICO is een pictogrambestandformaat dat door Windows en browsers wordt gebruikt voor favicons en app-pictogrammen. Eén ICO kan meerdere vierkante groottes bevatten zodat elk platform de beste keuze kan maken.\n\n**Veelvoorkomend gebruik:**\n- Klassieke browserfavicons\n- Windows-app- en snelkoppelingpictogrammen\n- Meerdere groottes bundelen in één bestand"
  },
  "sv": {
    "title": "Vad är ICO?",
    "description": "ICO är ett ikonfilformat som används av Windows och webbläsare för favicons och appikoner. En enda ICO kan innehålla flera kvadratiska storlekar så att varje plattform kan välja bäst passande.\n\n**Vanliga användningar:**\n- Klassiska webbläsarfavicons\n- Windows-app- och genvägsikoner\n- Samla flera storlekar i en fil"
  },
  "pl": {
    "title": "Czym jest ICO?",
    "description": "ICO to format plików ikon używany przez Windows i przeglądarki dla favicon i ikon aplikacji. Jeden plik ICO może zawierać wiele kwadratowych rozmiarów, aby platforma mogła wybrać najlepszy.\n\n**Typowe zastosowania:**\n- Klasyczne favicony przeglądarek\n- Ikony aplikacji i skrótów Windows\n- Łączenie wielu rozmiarów w jednym pliku"
  },
  "vi": {
    "title": "ICO là gì?",
    "description": "ICO là định dạng tệp biểu tượng mà Windows và trình duyệt dùng cho favicon và biểu tượng ứng dụng. Một tệp ICO có thể chứa nhiều kích thước vuông để mỗi nền tảng chọn kích thước phù hợp.\n\n**Cách dùng phổ biến:**\n- Favicon trình duyệt cổ điển\n- Biểu tượng ứng dụng và lối tắt trên Windows\n- Gộp nhiều kích thước vào một tệp"
  },
  "th": {
    "title": "ICO คืออะไร?",
    "description": "ICO คือรูปแบบไฟล์ไอคอนที่ Windows และเบราว์เซอร์ใช้สำหรับ favicon และไอคอนแอป ไฟล์ ICO หนึ่งไฟล์สามารถรวมหลายขนาดแบบสี่เหลี่ยมเพื่อให้แต่ละแพลตฟอร์มเลือกขนาดที่เหมาะสมได้\n\n**การใช้งานทั่วไป:**\n- favicon ของเบราว์เซอร์แบบคลาสสิก\n- ไอคอนแอปและทางลัดบน Windows\n- รวมหลายขนาดไว้ในไฟล์เดียว"
  },
  "id": {
    "title": "Apa itu ICO?",
    "description": "ICO adalah format file ikon yang digunakan Windows dan browser untuk favicon serta ikon aplikasi. Satu file ICO dapat memuat beberapa ukuran persegi agar setiap platform memilih ukuran terbaik.\n\n**Penggunaan umum:**\n- Favicon browser klasik\n- Ikon aplikasi dan pintasan Windows\n- Menggabungkan banyak ukuran dalam satu file"
  },
  "he": {
    "title": "מהו ICO?",
    "description": "ICO הוא פורמט קובץ אייקון שבו משתמשים Windows ודפדפנים עבור פביקונים ואייקוני אפליקציות. קובץ ICO אחד יכול לכלול כמה גדלים מרובעים כדי שכל פלטפורמה תבחר את המתאים ביותר.\n\n**שימושים נפוצים:**\n- פביקונים קלאסיים של דפדפנים\n- אייקונים לאפליקציות ולקיצורי דרך ב‑Windows\n- איחוד כמה גדלים בקובץ אחד"
  },
  "ms": {
    "title": "Apakah ICO?",
    "description": "ICO ialah format fail ikon yang digunakan oleh Windows dan pelayar untuk favicon dan ikon aplikasi. Satu fail ICO boleh mengandungi pelbagai saiz segi empat supaya setiap platform memilih yang paling sesuai.\n\n**Kegunaan biasa:**\n- Favicon pelayar klasik\n- Ikon aplikasi dan pintasan Windows\n- Menggabungkan banyak saiz dalam satu fail"
  },
  "no": {
    "title": "Hva er ICO?",
    "description": "ICO er et ikonfilformat som brukes av Windows og nettlesere for favikoner og appikoner. Én ICO kan inneholde flere kvadratiske størrelser slik at hver plattform kan velge den som passer best.\n\n**Vanlige bruksområder:**\n- Klassiske nettleserfavikoner\n- Windows-app- og snarveisikoner\n- Samle flere størrelser i én fil"
  }
}
</i18n>
