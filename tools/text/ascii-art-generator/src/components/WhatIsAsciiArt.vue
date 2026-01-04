<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('description') }}</n-text>
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
    "title": "What is ASCII Art?",
    "description": "ASCII art is a graphic design technique that uses printable characters from the ASCII standard to create visual art. It originated in the early days of computing when graphics capabilities were limited. ASCII art can represent images, diagrams, or stylized text using only keyboard characters. FIGlet is a popular program that generates ASCII art text banners from ordinary text, supporting various font styles."
  },
  "zh": {
    "title": "什么是 ASCII 艺术？",
    "description": "ASCII 艺术是一种图形设计技术，使用 ASCII 标准中的可打印字符来创建视觉艺术。它起源于计算机发展早期，当时图形功能有限。ASCII 艺术可以仅使用键盘字符来表示图像、图表或风格化文本。FIGlet 是一个流行的程序，可以从普通文本生成 ASCII 艺术文字横幅，支持多种字体样式。"
  },
  "zh-CN": {
    "title": "什么是 ASCII 艺术？",
    "description": "ASCII 艺术是一种图形设计技术，使用 ASCII 标准中的可打印字符来创建视觉艺术。它起源于计算机发展早期，当时图形功能有限。ASCII 艺术可以仅使用键盘字符来表示图像、图表或风格化文本。FIGlet 是一个流行的程序，可以从普通文本生成 ASCII 艺术文字横幅，支持多种字体样式。"
  },
  "zh-TW": {
    "title": "什麼是 ASCII 藝術？",
    "description": "ASCII 藝術是一種圖形設計技術，使用 ASCII 標準中的可列印字元來創建視覺藝術。它起源於電腦發展早期，當時圖形功能有限。ASCII 藝術可以僅使用鍵盤字元來表示圖像、圖表或風格化文字。FIGlet 是一個流行的程式，可以從普通文字生成 ASCII 藝術文字橫幅，支援多種字型樣式。"
  },
  "zh-HK": {
    "title": "什麼是 ASCII 藝術？",
    "description": "ASCII 藝術是一種圖形設計技術，使用 ASCII 標準中的可列印字元來創建視覺藝術。它起源於電腦發展早期，當時圖形功能有限。ASCII 藝術可以僅使用鍵盤字元來表示圖像、圖表或風格化文字。FIGlet 是一個流行的程式，可以從普通文字生成 ASCII 藝術文字橫幅，支援多種字型樣式。"
  },
  "es": {
    "title": "Que es el Arte ASCII?",
    "description": "El arte ASCII es una tecnica de diseno grafico que utiliza caracteres imprimibles del estandar ASCII para crear arte visual. Se origino en los primeros dias de la informatica cuando las capacidades graficas eran limitadas. El arte ASCII puede representar imagenes, diagramas o texto estilizado usando solo caracteres del teclado. FIGlet es un programa popular que genera banners de texto en arte ASCII a partir de texto ordinario, soportando varios estilos de fuentes."
  },
  "fr": {
    "title": "Qu'est-ce que l'Art ASCII ?",
    "description": "L'art ASCII est une technique de conception graphique qui utilise des caracteres imprimables de la norme ASCII pour creer de l'art visuel. Il est ne aux debuts de l'informatique lorsque les capacites graphiques etaient limitees. L'art ASCII peut representer des images, des diagrammes ou du texte stylise en utilisant uniquement des caracteres du clavier. FIGlet est un programme populaire qui genere des bannieres de texte en art ASCII a partir de texte ordinaire, prenant en charge divers styles de polices."
  },
  "de": {
    "title": "Was ist ASCII-Kunst?",
    "description": "ASCII-Kunst ist eine Grafikdesign-Technik, die druckbare Zeichen aus dem ASCII-Standard verwendet, um visuelle Kunst zu erstellen. Sie entstand in den fruhen Tagen der Informatik, als die Grafikfahigkeiten begrenzt waren. ASCII-Kunst kann Bilder, Diagramme oder stilisierten Text nur mit Tastaturzeichen darstellen. FIGlet ist ein beliebtes Programm, das ASCII-Kunst-Textbanner aus normalem Text generiert und verschiedene Schriftstile unterstutzt."
  },
  "it": {
    "title": "Cos'e l'Arte ASCII?",
    "description": "L'arte ASCII e una tecnica di progettazione grafica che utilizza caratteri stampabili dallo standard ASCII per creare arte visiva. E nata nei primi giorni dell'informatica quando le capacita grafiche erano limitate. L'arte ASCII puo rappresentare immagini, diagrammi o testo stilizzato usando solo caratteri della tastiera. FIGlet e un programma popolare che genera banner di testo in arte ASCII da testo ordinario, supportando vari stili di caratteri."
  },
  "ja": {
    "title": "ASCII アートとは？",
    "description": "ASCII アートは、ASCII 標準の印刷可能な文字を使用してビジュアルアートを作成するグラフィックデザイン技法です。グラフィック機能が限られていたコンピューティングの初期に生まれました。ASCII アートは、キーボード文字のみを使用して画像、図表、またはスタイル化されたテキストを表現できます。FIGlet は、通常のテキストから ASCII アートのテキストバナーを生成する人気のプログラムで、さまざまなフォントスタイルをサポートしています。"
  },
  "ko": {
    "title": "ASCII 아트란?",
    "description": "ASCII 아트는 ASCII 표준의 인쇄 가능한 문자를 사용하여 시각 예술을 만드는 그래픽 디자인 기법입니다. 그래픽 기능이 제한적이었던 컴퓨팅 초기에 시작되었습니다. ASCII 아트는 키보드 문자만 사용하여 이미지, 다이어그램 또는 스타일화된 텍스트를 표현할 수 있습니다. FIGlet은 일반 텍스트에서 ASCII 아트 텍스트 배너를 생성하는 인기 있는 프로그램으로, 다양한 글꼴 스타일을 지원합니다."
  },
  "ru": {
    "title": "Что такое ASCII-арт?",
    "description": "ASCII-арт - это техника графического дизайна, использующая печатные символы стандарта ASCII для создания визуального искусства. Она возникла в ранние дни компьютерной эры, когда графические возможности были ограничены. ASCII-арт может представлять изображения, диаграммы или стилизованный текст, используя только символы клавиатуры. FIGlet - популярная программа, которая генерирует текстовые баннеры ASCII-арта из обычного текста, поддерживая различные стили шрифтов."
  },
  "pt": {
    "title": "O que e Arte ASCII?",
    "description": "A arte ASCII e uma tecnica de design grafico que usa caracteres imprimiveis do padrao ASCII para criar arte visual. Ela surgiu nos primeiros dias da computacao quando as capacidades graficas eram limitadas. A arte ASCII pode representar imagens, diagramas ou texto estilizado usando apenas caracteres do teclado. FIGlet e um programa popular que gera banners de texto em arte ASCII a partir de texto comum, suportando varios estilos de fontes."
  },
  "ar": {
    "title": "ما هو فن ASCII؟",
    "description": "فن ASCII هو تقنية تصميم رسومي تستخدم الاحرف القابلة للطباعة من معيار ASCII لانشاء فن بصري. نشا في الايام الاولى للحوسبة عندما كانت امكانيات الرسومات محدودة. يمكن لفن ASCII تمثيل الصور والرسوم البيانية او النص المنمق باستخدام احرف لوحة المفاتيح فقط. FIGlet هو برنامج شائع يولد لافتات نصية بفن ASCII من النص العادي، ويدعم انماط خطوط متنوعة."
  },
  "hi": {
    "title": "ASCII आर्ट क्या है?",
    "description": "ASCII आर्ट एक ग्राफिक डिज़ाइन तकनीक है जो विज़ुअल आर्ट बनाने के लिए ASCII मानक के प्रिंट करने योग्य अक्षरों का उपयोग करती है। यह कंप्यूटिंग के शुरुआती दिनों में उत्पन्न हुई जब ग्राफिक्स क्षमताएं सीमित थीं। ASCII आर्ट केवल कीबोर्ड अक्षरों का उपयोग करके छवियों, आरेखों या स्टाइलाइज़्ड टेक्स्ट का प्रतिनिधित्व कर सकता है। FIGlet एक लोकप्रिय प्रोग्राम है जो सामान्य टेक्स्ट से ASCII आर्ट टेक्स्ट बैनर बनाता है, विभिन्न फ़ॉन्ट शैलियों का समर्थन करता है।"
  },
  "tr": {
    "title": "ASCII Sanati Nedir?",
    "description": "ASCII sanati, gorsel sanat olusturmak icin ASCII standardindaki yazdirilabilir karakterleri kullanan bir grafik tasarim teknididir. Grafik yeteneklerinin sinirli oldugu bilgisayar doneminin ilk gunlerinde ortaya cikmistir. ASCII sanati, yalnizca klavye karakterlerini kullanarak resimleri, diyagramlari veya stilize metinleri temsil edebilir. FIGlet, siradan metinden ASCII sanati metin afisleri ureten ve cesitli yazi tipi stillerini destekleyen populer bir programdir."
  },
  "nl": {
    "title": "Wat is ASCII-kunst?",
    "description": "ASCII-kunst is een grafische ontwerptechniek die afdrukbare tekens uit de ASCII-standaard gebruikt om visuele kunst te creeren. Het ontstond in de vroege dagen van de computer toen grafische mogelijkheden beperkt waren. ASCII-kunst kan afbeeldingen, diagrammen of gestileerde tekst weergeven met alleen toetsenbordtekens. FIGlet is een populair programma dat ASCII-kunsttekstbanners genereert van gewone tekst en verschillende lettertypestijlen ondersteunt."
  },
  "sv": {
    "title": "Vad ar ASCII-konst?",
    "description": "ASCII-konst ar en grafisk designteknik som anvander utskrivbara tecken fran ASCII-standarden for att skapa visuell konst. Den uppstod i datorernas tidiga dagar nar grafikkapaciteten var begransad. ASCII-konst kan representera bilder, diagram eller stiliserad text med endast tangentbordstecken. FIGlet ar ett populart program som genererar ASCII-konsttextbanners fran vanlig text och stoder olika typsnittsstilar."
  },
  "pl": {
    "title": "Czym jest sztuka ASCII?",
    "description": "Sztuka ASCII to technika projektowania graficznego, ktora wykorzystuje drukowalne znaki ze standardu ASCII do tworzenia sztuki wizualnej. Powstala w poczatkach informatyki, gdy mozliwosci graficzne byly ograniczone. Sztuka ASCII moze reprezentowac obrazy, diagramy lub stylizowany tekst uzywajac tylko znakow klawiatury. FIGlet to popularny program, ktory generuje banery tekstowe w sztuce ASCII ze zwyklego tekstu, obslugujac rozne style czcionek."
  },
  "vi": {
    "title": "Nghe Thuat ASCII la gi?",
    "description": "Nghe thuat ASCII la mot ky thuat thiet ke do hoa su dung cac ky tu co the in duoc tu tieu chuan ASCII de tao ra nghe thuat thi giac. No bat nguon tu nhung ngay dau cua may tinh khi kha nang do hoa con han che. Nghe thuat ASCII co the bieu dien hinh anh, so do hoac van ban cach dieu chi bang cac ky tu ban phim. FIGlet la mot chuong trinh pho bien tao ra cac bieu ngu van ban nghe thuat ASCII tu van ban thuong, ho tro nhieu kieu phong chu khac nhau."
  },
  "th": {
    "title": "ASCII Art คืออะไร?",
    "description": "ASCII Art เป็นเทคนิคการออกแบบกราฟิกที่ใช้อักขระที่พิมพ์ได้จากมาตรฐาน ASCII เพื่อสร้างงานศิลปะภาพ มีต้นกำเนิดในยุคแรกของคอมพิวเตอร์เมื่อความสามารถด้านกราฟิกยังจำกัด ASCII Art สามารถแสดงภาพ แผนภาพ หรือข้อความที่มีสไตล์โดยใช้เฉพาะอักขระบนแป้นพิมพ์ FIGlet เป็นโปรแกรมยอดนิยมที่สร้างแบนเนอร์ข้อความ ASCII Art จากข้อความธรรมดา รองรับรูปแบบฟอนต์ต่างๆ"
  },
  "id": {
    "title": "Apa itu Seni ASCII?",
    "description": "Seni ASCII adalah teknik desain grafis yang menggunakan karakter yang dapat dicetak dari standar ASCII untuk membuat seni visual. Ini berasal dari masa-masa awal komputasi ketika kemampuan grafis terbatas. Seni ASCII dapat mewakili gambar, diagram, atau teks bergaya hanya menggunakan karakter keyboard. FIGlet adalah program populer yang menghasilkan banner teks seni ASCII dari teks biasa, mendukung berbagai gaya font."
  },
  "he": {
    "title": "מהי אמנות ASCII?",
    "description": "אמנות ASCII היא טכניקת עיצוב גרפי המשתמשת בתווים ניתנים להדפסה מתקן ASCII ליצירת אמנות חזותית. היא נולדה בימים הראשונים של המחשוב כאשר יכולות הגרפיקה היו מוגבלות. אמנות ASCII יכולה לייצג תמונות, דיאגרמות או טקסט מעוצב באמצעות תווי מקלדת בלבד. FIGlet היא תוכנית פופולרית שמייצרת באנרים של טקסט באמנות ASCII מטקסט רגיל, ותומכת בסגנונות גופנים שונים."
  },
  "ms": {
    "title": "Apakah Seni ASCII?",
    "description": "Seni ASCII adalah teknik reka bentuk grafik yang menggunakan aksara boleh cetak daripada standard ASCII untuk mencipta seni visual. Ia bermula pada zaman awal pengkomputeran apabila keupayaan grafik adalah terhad. Seni ASCII boleh mewakili imej, rajah, atau teks bergaya menggunakan aksara papan kekunci sahaja. FIGlet adalah program popular yang menjana sepanduk teks seni ASCII daripada teks biasa, menyokong pelbagai gaya fon."
  },
  "no": {
    "title": "Hva er ASCII-kunst?",
    "description": "ASCII-kunst er en grafisk designteknikk som bruker utskrivbare tegn fra ASCII-standarden for a lage visuell kunst. Den oppsto i de tidlige dagene av databehandling da grafikkmulighetene var begrenset. ASCII-kunst kan representere bilder, diagrammer eller stilisert tekst ved kun a bruke tastaturtegn. FIGlet er et populart program som genererer ASCII-kunsttekstbannere fra vanlig tekst og stotter ulike skriftstiler."
  }
}
</i18n>
