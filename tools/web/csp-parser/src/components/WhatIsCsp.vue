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
    "title": "What is Content Security Policy (CSP)?",
    "description": "Content Security Policy is a browser security header that restricts where resources can be loaded from. It helps mitigate XSS and data injection by declaring allowed sources for scripts, styles, images, and more."
  },
  "zh": {
    "title": "什么是内容安全策略（CSP）？",
    "description": "内容安全策略（CSP）是一种浏览器安全头，用于限制资源的加载来源。通过声明脚本、样式、图片等允许的来源，CSP 可降低 XSS 与注入风险。"
  },
  "zh-CN": {
    "title": "什么是内容安全策略（CSP）？",
    "description": "内容安全策略（CSP）是一种浏览器安全头，用于限制资源的加载来源。通过声明脚本、样式、图片等允许的来源，CSP 可降低 XSS 与注入风险。"
  },
  "zh-TW": {
    "title": "什麼是內容安全政策（CSP）？",
    "description": "內容安全政策（CSP）是一種瀏覽器安全標頭，用於限制資源的載入來源。透過宣告腳本、樣式、圖片等允許的來源，可降低 XSS 與注入風險。"
  },
  "zh-HK": {
    "title": "什麼是內容安全政策（CSP）？",
    "description": "內容安全政策（CSP）是一種瀏覽器安全標頭，用於限制資源的載入來源。透過宣告腳本、樣式、圖片等允許的來源，可降低 XSS 與注入風險。"
  },
  "es": {
    "title": "¿Qué es Content Security Policy (CSP)?",
    "description": "Content Security Policy es un encabezado de seguridad del navegador que restringe de dónde se pueden cargar recursos. Ayuda a mitigar XSS e inyección de datos al declarar las fuentes permitidas para scripts, estilos, imágenes y más."
  },
  "fr": {
    "title": "Qu'est-ce que Content Security Policy (CSP) ?",
    "description": "Content Security Policy est un en-tête de sécurité du navigateur qui limite l'origine des ressources. Il aide à réduire les risques de XSS et d'injection de données en déclarant les sources autorisées pour scripts, styles, images, etc."
  },
  "de": {
    "title": "Was ist Content Security Policy (CSP)?",
    "description": "Content Security Policy ist ein Sicherheits-Header des Browsers, der festlegt, von wo Ressourcen geladen werden dürfen. Durch erlaubte Quellen für Skripte, Styles, Bilder usw. reduziert CSP XSS- und Injektionsrisiken."
  },
  "it": {
    "title": "Che cos'è Content Security Policy (CSP)?",
    "description": "Content Security Policy è un header di sicurezza del browser che limita le origini da cui caricare risorse. Aiuta a mitigare XSS e data injection dichiarando le fonti consentite per script, stili, immagini e altro."
  },
  "ja": {
    "title": "Content Security Policy（CSP）とは？",
    "description": "Content Security Policy は、リソースをどこから読み込めるかを制限するブラウザのセキュリティヘッダーです。スクリプトやスタイル、画像などの許可ソースを宣言し、XSS や注入攻撃を軽減します。"
  },
  "ko": {
    "title": "Content Security Policy(CSP)란?",
    "description": "Content Security Policy는 리소스를 어디에서 로드할 수 있는지 제한하는 브라우저 보안 헤더입니다. 스크립트, 스타일, 이미지 등의 허용 출처를 선언하여 XSS 및 데이터 주입 위험을 줄입니다."
  },
  "ru": {
    "title": "Что такое Content Security Policy (CSP)?",
    "description": "Content Security Policy — это защитный заголовок браузера, ограничивающий источники загрузки ресурсов. Он помогает снизить риск XSS и внедрения данных, задавая разрешённые источники для скриптов, стилей, изображений и т. д."
  },
  "pt": {
    "title": "O que é Content Security Policy (CSP)?",
    "description": "Content Security Policy é um cabeçalho de segurança do navegador que restringe de onde os recursos podem ser carregados. Ajuda a mitigar XSS e injeção de dados ao declarar as fontes permitidas para scripts, estilos, imagens e mais."
  },
  "ar": {
    "title": "ما هي Content Security Policy (CSP)؟",
    "description": "Content Security Policy هي ترويسة أمان للمتصفح تحدد مصادر تحميل الموارد. تساعد على الحد من XSS وحقن البيانات من خلال تحديد المصادر المسموح بها للسكريبتات والأنماط والصور وغيرها."
  },
  "hi": {
    "title": "Content Security Policy (CSP) क्या है?",
    "description": "Content Security Policy एक ब्राउज़र सुरक्षा हेडर है जो यह सीमित करता है कि संसाधन कहाँ से लोड किए जा सकते हैं। स्क्रिप्ट, स्टाइल, इमेज आदि के लिए अनुमत स्रोत घोषित करके यह XSS और डेटा इंजेक्शन के जोखिम को कम करता है।"
  },
  "tr": {
    "title": "Content Security Policy (CSP) nedir?",
    "description": "Content Security Policy, kaynakların hangi yerlerden yüklenebileceğini sınırlayan bir tarayıcı güvenlik başlığıdır. Komut dosyaları, stiller, görseller vb. için izinli kaynakları belirleyerek XSS ve veri enjeksiyonunu azaltır."
  },
  "nl": {
    "title": "Wat is Content Security Policy (CSP)?",
    "description": "Content Security Policy is een browserbeveiligingsheader die beperkt waar resources vandaan mogen komen. Door toegestane bronnen voor scripts, stijlen, afbeeldingen en meer te declareren, helpt CSP XSS en data-injectie te beperken."
  },
  "sv": {
    "title": "Vad är Content Security Policy (CSP)?",
    "description": "Content Security Policy är en säkerhetsrubrik i webbläsaren som begränsar var resurser får laddas från. Genom att ange tillåtna källor för skript, stilar, bilder m.m. minskar CSP risken för XSS och datainjektion."
  },
  "pl": {
    "title": "Czym jest Content Security Policy (CSP)?",
    "description": "Content Security Policy to nagłówek bezpieczeństwa przeglądarki, który ogranicza źródła ładowania zasobów. Deklarowanie dozwolonych źródeł dla skryptów, stylów, obrazów itd. pomaga ograniczyć XSS i wstrzykiwanie danych."
  },
  "vi": {
    "title": "Content Security Policy (CSP) là gì?",
    "description": "Content Security Policy là một header bảo mật của trình duyệt, giới hạn nơi có thể tải tài nguyên. Bằng cách khai báo nguồn cho phép đối với script, style, hình ảnh và hơn thế, CSP giúp giảm nguy cơ XSS và chèn dữ liệu."
  },
  "th": {
    "title": "Content Security Policy (CSP) คืออะไร?",
    "description": "Content Security Policy คือส่วนหัวความปลอดภัยของเบราว์เซอร์ที่จำกัดแหล่งที่มาของการโหลดทรัพยากร โดยกำหนดแหล่งที่อนุญาตสำหรับสคริปต์ สไตล์ รูปภาพ และอื่น ๆ เพื่อช่วยลดความเสี่ยง XSS และการฉีดข้อมูล"
  },
  "id": {
    "title": "Apa itu Content Security Policy (CSP)?",
    "description": "Content Security Policy adalah header keamanan browser yang membatasi sumber pemuatan resource. Dengan mendeklarasikan sumber yang diizinkan untuk skrip, gaya, gambar, dan lainnya, CSP membantu mengurangi risiko XSS dan injeksi data."
  },
  "he": {
    "title": "מהי Content Security Policy (CSP)?",
    "description": "Content Security Policy היא כותרת אבטחה בדפדפן שמגבילה מאילו מקורות ניתן לטעון משאבים. הצהרה על מקורות מותרי סקריפטים, סגנונות ותמונות מסייעת לצמצם XSS והזרקת נתונים."
  },
  "ms": {
    "title": "Apakah Content Security Policy (CSP)?",
    "description": "Content Security Policy ialah pengepala keselamatan pelayar yang mengehadkan sumber pemuatan. Dengan menyatakan sumber yang dibenarkan untuk skrip, gaya, imej dan lain-lain, CSP membantu mengurangkan risiko XSS dan suntikan data."
  },
  "no": {
    "title": "Hva er Content Security Policy (CSP)?",
    "description": "Content Security Policy er en sikkerhetsheader i nettleseren som begrenser hvor ressurser kan lastes fra. Ved å angi tillatte kilder for skript, stiler, bilder m.m. reduserer CSP risikoen for XSS og datainjeksjon."
  }
}
</i18n>
