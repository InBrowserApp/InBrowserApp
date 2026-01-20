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
    "title": "What is a robots.txt generator?",
    "description": "A robots.txt generator helps you combine user-agent rules, allow/disallow paths, and sitemap links to create a robots.txt file. Publish it at the site root as /robots.txt so crawlers can read it."
  },
  "zh": {
    "title": "什么是 robots.txt 生成器？",
    "description": "robots.txt 生成器可帮助你组合 User-agent 规则、允许/禁止路径和 Sitemap 链接来生成 robots.txt。将文件发布到站点根目录的 /robots.txt 供爬虫读取。"
  },
  "zh-CN": {
    "title": "什么是 robots.txt 生成器？",
    "description": "robots.txt 生成器可帮助你组合 User-agent 规则、允许/禁止路径和 Sitemap 链接来生成 robots.txt。将文件发布到站点根目录的 /robots.txt 供爬虫读取。"
  },
  "zh-TW": {
    "title": "什麼是 robots.txt 產生器？",
    "description": "robots.txt 產生器可協助你組合 User-agent 規則、允許/禁止路徑與 Sitemap 連結來生成 robots.txt。將檔案放在網站根目錄的 /robots.txt 供爬蟲讀取。"
  },
  "zh-HK": {
    "title": "什麼是 robots.txt 產生器？",
    "description": "robots.txt 產生器可協助你組合 User-agent 規則、允許/禁止路徑與 Sitemap 連結來生成 robots.txt。將檔案放在網站根目錄的 /robots.txt 供爬蟲讀取。"
  },
  "es": {
    "title": "¿Qué es un generador de robots.txt?",
    "description": "Un generador de robots.txt ayuda a combinar reglas de user-agent, rutas allow/disallow y enlaces de sitemap para crear el archivo robots.txt. Publícalo en la raíz del sitio como /robots.txt para que los rastreadores lo lean."
  },
  "fr": {
    "title": "Qu'est-ce qu'un générateur de robots.txt ?",
    "description": "Un générateur de robots.txt aide à combiner des règles user-agent, des chemins allow/disallow et des liens de sitemap pour créer le fichier robots.txt. Publiez-le à la racine du site sous /robots.txt pour que les robots le lisent."
  },
  "de": {
    "title": "Was ist ein robots.txt-Generator?",
    "description": "Ein robots.txt-Generator hilft, User-Agent-Regeln, Allow/Disallow-Pfade und Sitemap-Links zu kombinieren, um eine robots.txt zu erstellen. Veröffentlichen Sie sie im Stammverzeichnis der Website als /robots.txt, damit Crawler sie lesen können."
  },
  "it": {
    "title": "Cos'è un generatore di robots.txt?",
    "description": "Un generatore di robots.txt aiuta a combinare regole user-agent, percorsi allow/disallow e link alla sitemap per creare il file robots.txt. Pubblicalo nella root del sito come /robots.txt affinché i crawler possano leggerlo."
  },
  "ja": {
    "title": "robots.txt ジェネレーターとは？",
    "description": "robots.txt ジェネレーターは、User-agent ルールや Allow/Disallow のパス、Sitemap リンクを組み合わせて robots.txt を作成します。サイトのルートに /robots.txt として配置し、クローラーが読み取れるようにします。"
  },
  "ko": {
    "title": "robots.txt 생성기란?",
    "description": "robots.txt 생성기는 User-agent 규칙, Allow/Disallow 경로, Sitemap 링크를 조합해 robots.txt 파일을 작성하도록 도와줍니다. 사이트 루트에 /robots.txt로 배포해 크롤러가 읽을 수 있게 하세요."
  },
  "ru": {
    "title": "Что такое генератор robots.txt?",
    "description": "Генератор robots.txt помогает объединять правила User-agent, пути Allow/Disallow и ссылки Sitemap для создания файла robots.txt. Разместите его в корне сайта как /robots.txt, чтобы роботы могли его читать."
  },
  "pt": {
    "title": "O que é um gerador de robots.txt?",
    "description": "Um gerador de robots.txt ajuda a combinar regras de user-agent, caminhos allow/disallow e links de sitemap para criar o arquivo robots.txt. Publique-o na raiz do site como /robots.txt para que os crawlers possam lê-lo."
  },
  "ar": {
    "title": "ما هو مُولّد robots.txt؟",
    "description": "يساعد مُولّد robots.txt على تجميع قواعد user-agent ومسارات السماح/المنع وروابط sitemap لإنشاء ملف robots.txt. انشره في جذر الموقع باسم /robots.txt ليقرأه الزواحف."
  },
  "hi": {
    "title": "robots.txt जनरेटर क्या है?",
    "description": "robots.txt जनरेटर user-agent नियम, allow/disallow पाथ और sitemap लिंक को जोड़कर robots.txt फ़ाइल बनाने में मदद करता है। इसे साइट के रूट में /robots.txt के रूप में प्रकाशित करें ताकि क्रॉलर इसे पढ़ सकें।"
  },
  "tr": {
    "title": "robots.txt oluşturucu nedir?",
    "description": "robots.txt oluşturucu, user-agent kurallarını, allow/disallow yollarını ve sitemap bağlantılarını birleştirerek robots.txt dosyası oluşturmanıza yardımcı olur. Dosyayı sitenin köküne /robots.txt olarak yayımlayın ki tarama botları okuyabilsin."
  },
  "nl": {
    "title": "Wat is een robots.txt-generator?",
    "description": "Een robots.txt-generator helpt om user-agentregels, allow/disallow-paden en sitemaplinks te combineren tot een robots.txt-bestand. Publiceer het in de hoofdmap van de site als /robots.txt zodat crawlers het kunnen lezen."
  },
  "sv": {
    "title": "Vad är en robots.txt-generator?",
    "description": "En robots.txt-generator hjälper dig att kombinera user-agent-regler, allow/disallow-sökvägar och sitemap-länkar för att skapa en robots.txt-fil. Publicera den i webbplatsens rot som /robots.txt så att crawlers kan läsa den."
  },
  "pl": {
    "title": "Co to jest generator robots.txt?",
    "description": "Generator robots.txt pomaga łączyć reguły User-agent, ścieżki Allow/Disallow i linki do sitemap, aby utworzyć plik robots.txt. Umieść go w katalogu głównym witryny jako /robots.txt, aby roboty mogły go odczytać."
  },
  "vi": {
    "title": "Trình tạo robots.txt là gì?",
    "description": "Trình tạo robots.txt giúp kết hợp các quy tắc user-agent, đường dẫn allow/disallow và liên kết sitemap để tạo tệp robots.txt. Hãy đặt tệp ở thư mục gốc của trang dưới dạng /robots.txt để trình thu thập có thể đọc."
  },
  "th": {
    "title": "robots.txt generator คืออะไร?",
    "description": "robots.txt generator ช่วยรวมกฎ user-agent เส้นทาง allow/disallow และลิงก์ sitemap เพื่อสร้างไฟล์ robots.txt ให้วางไว้ที่รากเว็บไซต์เป็น /robots.txt เพื่อให้บอตอ่านได้"
  },
  "id": {
    "title": "Apa itu generator robots.txt?",
    "description": "Generator robots.txt membantu menggabungkan aturan user-agent, jalur allow/disallow, dan tautan sitemap untuk membuat berkas robots.txt. Publikasikan di root situs sebagai /robots.txt agar crawler dapat membacanya."
  },
  "he": {
    "title": "מהו מחולל robots.txt?",
    "description": "מחולל robots.txt עוזר לשלב כללי User-agent, נתיבי Allow/Disallow וקישורי Sitemap כדי ליצור קובץ robots.txt. פרסמו אותו בשורש האתר כ־/robots.txt כדי שסורקים יוכלו לקרוא אותו."
  },
  "ms": {
    "title": "Apakah penjana robots.txt?",
    "description": "Penjana robots.txt membantu menggabungkan peraturan user-agent, laluan allow/disallow dan pautan sitemap untuk menghasilkan fail robots.txt. Terbitkan fail ini di akar laman sebagai /robots.txt supaya perayap boleh membacanya."
  },
  "no": {
    "title": "Hva er en robots.txt-generator?",
    "description": "En robots.txt-generator hjelper deg å kombinere user-agent-regler, allow/disallow-stier og sitemap-lenker for å lage en robots.txt-fil. Publiser den i rotkatalogen som /robots.txt slik at crawlere kan lese den."
  }
}
</i18n>
