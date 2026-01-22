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
    "title": "What is a sitemap.xml?",
    "description": "A sitemap.xml lists the important URLs on your site so search engines can discover and crawl them more efficiently. Publish it at /sitemap.xml (or via a sitemap index) and submit it in Search Console tools."
  },
  "zh": {
    "title": "什么是 sitemap.xml？",
    "description": "sitemap.xml 用于列出站点的重要 URL，帮助搜索引擎更高效地发现并抓取页面。将其发布在 /sitemap.xml（或使用 Sitemap 索引）并提交到站长工具。"
  },
  "zh-CN": {
    "title": "什么是 sitemap.xml？",
    "description": "sitemap.xml 用于列出站点的重要 URL，帮助搜索引擎更高效地发现并抓取页面。将其发布在 /sitemap.xml（或使用 Sitemap 索引）并提交到站长工具。"
  },
  "zh-TW": {
    "title": "什麼是 sitemap.xml？",
    "description": "sitemap.xml 用於列出網站的重要 URL，幫助搜尋引擎更有效率地發現並抓取頁面。將其放在 /sitemap.xml（或使用 Sitemap 索引）並提交至站長工具。"
  },
  "zh-HK": {
    "title": "什麼是 sitemap.xml？",
    "description": "sitemap.xml 用於列出網站的重要 URL，幫助搜尋引擎更有效率地發現並抓取頁面。將其放在 /sitemap.xml（或使用 Sitemap 索引）並提交至站長工具。"
  },
  "es": {
    "title": "¿Qué es un sitemap.xml?",
    "description": "Un sitemap.xml enumera las URL importantes de tu sitio para que los buscadores las descubran y rastreen con mayor eficiencia. Publícalo en /sitemap.xml (o mediante un índice) y envíalo en Search Console."
  },
  "fr": {
    "title": "Qu'est-ce qu'un sitemap.xml ?",
    "description": "Un sitemap.xml répertorie les URL importantes de votre site afin que les moteurs de recherche les découvrent et les explorent plus efficacement. Publiez-le à /sitemap.xml (ou via un index) et soumettez-le dans les outils Search Console."
  },
  "de": {
    "title": "Was ist eine sitemap.xml?",
    "description": "Eine sitemap.xml listet die wichtigen URLs Ihrer Website auf, damit Suchmaschinen sie effizienter finden und crawlen können. Veröffentlichen Sie sie unter /sitemap.xml (oder über einen Index) und reichen Sie sie in der Search Console ein."
  },
  "it": {
    "title": "Che cos'è un sitemap.xml?",
    "description": "Un sitemap.xml elenca gli URL importanti del sito per aiutare i motori di ricerca a scoprirli e scansionarli in modo più efficiente. Pubblicalo in /sitemap.xml (o tramite un indice) e invialo alla Search Console."
  },
  "ja": {
    "title": "sitemap.xml とは？",
    "description": "sitemap.xml はサイトの重要な URL を列挙し、検索エンジンがより効率的に発見・クロールできるようにします。/sitemap.xml（またはインデックス）として公開し、Search Console で送信してください。"
  },
  "ko": {
    "title": "sitemap.xml이란?",
    "description": "sitemap.xml은 사이트의 중요한 URL을 나열하여 검색 엔진이 더 효율적으로 발견하고 크롤링하도록 돕습니다. /sitemap.xml(또는 인덱스)로 게시하고 Search Console에 제출하세요."
  },
  "ru": {
    "title": "Что такое sitemap.xml?",
    "description": "Файл sitemap.xml содержит важные URL вашего сайта, чтобы поисковые системы могли эффективнее находить и сканировать страницы. Опубликуйте его в /sitemap.xml (или через индекс) и отправьте в Search Console."
  },
  "pt": {
    "title": "O que é um sitemap.xml?",
    "description": "Um sitemap.xml lista as URLs importantes do seu site para que os motores de busca as descubram e rastreiem com mais eficiência. Publique-o em /sitemap.xml (ou via índice) e envie-o no Search Console."
  },
  "ar": {
    "title": "ما هو sitemap.xml؟",
    "description": "يُدرج ملف sitemap.xml عناوين URL المهمة في موقعك كي تكتشفها محركات البحث وتزحف إليها بكفاءة أكبر. انشره في /sitemap.xml (أو عبر فهرس) وقدّمه في أدوات Search Console."
  },
  "hi": {
    "title": "sitemap.xml क्या है?",
    "description": "sitemap.xml आपकी साइट के महत्वपूर्ण URL सूचीबद्ध करता है ताकि सर्च इंजन उन्हें अधिक कुशलता से खोज और क्रॉल कर सकें। इसे /sitemap.xml (या इंडेक्स के जरिए) पर प्रकाशित करें और Search Console में सबमिट करें।"
  },
  "tr": {
    "title": "sitemap.xml nedir?",
    "description": "sitemap.xml sitenizdeki önemli URL'leri listeler ve arama motorlarının bunları daha verimli keşfetmesini sağlar. /sitemap.xml (veya bir dizin) olarak yayınlayın ve Search Console'a gönderin."
  },
  "nl": {
    "title": "Wat is een sitemap.xml?",
    "description": "Een sitemap.xml bevat de belangrijke URL's van je site zodat zoekmachines ze efficiënter kunnen ontdekken en crawlen. Publiceer het op /sitemap.xml (of via een index) en dien het in bij Search Console."
  },
  "sv": {
    "title": "Vad är en sitemap.xml?",
    "description": "En sitemap.xml listar viktiga URL:er på din webbplats så att sökmotorer kan upptäcka och crawla dem mer effektivt. Publicera den på /sitemap.xml (eller via ett index) och skicka in den i Search Console."
  },
  "pl": {
    "title": "Czym jest sitemap.xml?",
    "description": "sitemap.xml zawiera ważne adresy URL Twojej witryny, aby wyszukiwarki mogły je skuteczniej odkrywać i indeksować. Opublikuj go pod /sitemap.xml (lub przez indeks) i prześlij w Search Console."
  },
  "vi": {
    "title": "sitemap.xml là gì?",
    "description": "sitemap.xml liệt kê các URL quan trọng của trang web để công cụ tìm kiếm khám phá và thu thập dữ liệu hiệu quả hơn. Hãy xuất bản tại /sitemap.xml (hoặc qua chỉ mục) và gửi trong Search Console."
  },
  "th": {
    "title": "sitemap.xml คืออะไร?",
    "description": "sitemap.xml จะรวบรวม URL สำคัญของเว็บไซต์เพื่อให้เครื่องมือค้นหาค้นพบและเก็บข้อมูลได้มีประสิทธิภาพมากขึ้น เผยแพร่ที่ /sitemap.xml (หรือผ่านดัชนี) แล้วส่งใน Search Console"
  },
  "id": {
    "title": "Apa itu sitemap.xml?",
    "description": "sitemap.xml mencantumkan URL penting di situs Anda agar mesin pencari dapat menemukannya dan merayapi lebih efisien. Publikasikan di /sitemap.xml (atau melalui indeks) dan kirimkan di Search Console."
  },
  "he": {
    "title": "מהו sitemap.xml?",
    "description": "sitemap.xml מציג את כתובות ה־URL החשובות באתר כדי שמנועי חיפוש יגלו ויסרקו אותן ביעילות רבה יותר. פרסמו אותו ב־/sitemap.xml (או דרך אינדקס) ושלחו ב־Search Console."
  },
  "ms": {
    "title": "Apakah sitemap.xml?",
    "description": "sitemap.xml menyenaraikan URL penting di laman anda supaya enjin carian dapat menemuinya dan merangkak dengan lebih cekap. Terbitkan di /sitemap.xml (atau melalui indeks) dan hantar di Search Console."
  },
  "no": {
    "title": "Hva er en sitemap.xml?",
    "description": "sitemap.xml lister viktige URL-er på nettstedet ditt slik at søkemotorer kan oppdage og crawle dem mer effektivt. Publiser den på /sitemap.xml (eller via en indeks) og send den i Search Console."
  }
}
</i18n>
