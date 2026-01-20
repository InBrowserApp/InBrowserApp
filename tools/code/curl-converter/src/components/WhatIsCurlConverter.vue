<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DescriptionMarkdown } from '@shared/ui/base'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a cURL Converter?",
    "description": "A cURL converter turns a cURL command into code for many languages and HTTP clients. It helps you reuse an API request across stacks without rewriting headers, bodies, or auth.\n\n**Credit**\nPowered by [curlconverter](https://curlconverter.com) by Nick Carneiro."
  },
  "zh": {
    "title": "什么是 cURL 转换器?",
    "description": "cURL 转换器会将 cURL 命令转换为多种语言与 HTTP 客户端代码，方便在不同技术栈中复用同一 API 请求，而无需重写请求头、请求体或认证。\n\n**致谢**\n由 [curlconverter](https://curlconverter.com)（Nick Carneiro）提供支持。"
  },
  "zh-CN": {
    "title": "什么是 cURL 转换器?",
    "description": "cURL 转换器会将 cURL 命令转换为多种语言与 HTTP 客户端代码，方便在不同技术栈中复用同一 API 请求，而无需重写请求头、请求体或认证。\n\n**致谢**\n由 [curlconverter](https://curlconverter.com)（Nick Carneiro）提供支持。"
  },
  "zh-TW": {
    "title": "什麼是 cURL 轉換器?",
    "description": "cURL 轉換器會將 cURL 命令轉換為多種語言與 HTTP 客戶端程式碼，方便在不同技術棧中重用同一 API 請求，而無需重寫標頭、請求本文或驗證。\n\n**致謝**\n由 [curlconverter](https://curlconverter.com)（Nick Carneiro）提供支援。"
  },
  "zh-HK": {
    "title": "什麼是 cURL 轉換器?",
    "description": "cURL 轉換器會將 cURL 命令轉換為多種語言與 HTTP 客戶端程式碼，方便在不同技術棧中重用同一 API 請求，而無需重寫標頭、請求本文或驗證。\n\n**致謝**\n由 [curlconverter](https://curlconverter.com)（Nick Carneiro）提供支援。"
  },
  "es": {
    "title": "¿Qué es un conversor de cURL?",
    "description": "Un conversor de cURL transforma un comando cURL en código para muchos lenguajes y clientes HTTP. Te ayuda a reutilizar una solicitud de API en distintos stacks sin reescribir encabezados, cuerpo ni autenticación.\n\n**Crédito**\nCon tecnología de [curlconverter](https://curlconverter.com) por Nick Carneiro."
  },
  "fr": {
    "title": "Qu'est-ce qu'un convertisseur cURL ?",
    "description": "Un convertisseur cURL transforme une commande cURL en code pour de nombreux langages et clients HTTP. Il permet de réutiliser une requête d'API entre différents stacks sans réécrire les en-têtes, le corps ou l'auth.\n\n**Crédit**\nPropulsé par [curlconverter](https://curlconverter.com) de Nick Carneiro."
  },
  "de": {
    "title": "Was ist ein cURL-Konverter?",
    "description": "Ein cURL-Konverter wandelt einen cURL-Befehl in Code für viele Sprachen und HTTP-Clients um. So kannst du eine API-Anfrage über verschiedene Stacks hinweg wiederverwenden, ohne Header, Body oder Auth neu zu schreiben.\n\n**Credit**\nPowered by [curlconverter](https://curlconverter.com) von Nick Carneiro."
  },
  "it": {
    "title": "Che cos'è un convertitore cURL?",
    "description": "Un convertitore cURL trasforma un comando cURL in codice per molti linguaggi e client HTTP. Aiuta a riutilizzare una richiesta API tra stack diversi senza riscrivere header, body o autenticazione.\n\n**Crediti**\nBasato su [curlconverter](https://curlconverter.com) di Nick Carneiro."
  },
  "ja": {
    "title": "cURL コンバーターとは?",
    "description": "cURL コンバーターは cURL コマンドを多言語・多様な HTTP クライアント向けのコードに変換します。ヘッダー、本文、認証を書き直さずに API リクエストを複数の環境で再利用できます。\n\n**クレジット**\n[curlconverter](https://curlconverter.com)（Nick Carneiro）提供。"
  },
  "ko": {
    "title": "cURL 변환기란?",
    "description": "cURL 변환기는 cURL 명령을 다양한 언어와 HTTP 클라이언트 코드로 바꿉니다. 헤더, 본문, 인증을 다시 작성하지 않고도 여러 스택에서 API 요청을 재사용할 수 있습니다.\n\n**크레딧**\n[curlconverter](https://curlconverter.com) (Nick Carneiro) 기반."
  },
  "ru": {
    "title": "Что такое конвертер cURL?",
    "description": "Конвертер cURL превращает команду cURL в код для многих языков и HTTP‑клиентов. Это позволяет переиспользовать API‑запросы между разными стеками без переписывания заголовков, тела или авторизации.\n\n**Благодарность**\nОсновано на [curlconverter](https://curlconverter.com) от Nick Carneiro."
  },
  "pt": {
    "title": "O que é um conversor de cURL?",
    "description": "Um conversor de cURL transforma um comando cURL em código para muitas linguagens e clientes HTTP. Ele ajuda a reutilizar uma requisição de API em diferentes stacks sem reescrever cabeçalhos, corpo ou autenticação.\n\n**Crédito**\nCom tecnologia [curlconverter](https://curlconverter.com) de Nick Carneiro."
  },
  "ar": {
    "title": "ما هو محول cURL؟",
    "description": "محول cURL يحول أمر cURL إلى كود لعدة لغات وعملاء HTTP. يساعدك على إعادة استخدام طلب API عبر بيئات مختلفة دون إعادة كتابة الرؤوس أو الجسم أو المصادقة.\n\n**إشادة**\nمدعوم بواسطة [curlconverter](https://curlconverter.com) من Nick Carneiro."
  },
  "hi": {
    "title": "cURL कन्वर्टर क्या है?",
    "description": "cURL कन्वर्टर cURL कमांड को कई भाषाओं और HTTP क्लाइंट कोड में बदलता है। इससे आप हेडर, बॉडी या ऑथ फिर से लिखे बिना अलग-अलग स्टैक में एक ही API रिक्वेस्ट का पुन: उपयोग कर सकते हैं।\n\n**श्रेय**\n[curlconverter](https://curlconverter.com) (Nick Carneiro) द्वारा समर्थित।"
  },
  "tr": {
    "title": "cURL dönüştürücü nedir?",
    "description": "Bir cURL dönüştürücü, cURL komutunu birçok dil ve HTTP istemcisi için koda çevirir. Başlıkları, gövdeyi veya kimlik doğrulamayı yeniden yazmadan API isteklerini farklı stack'lerde yeniden kullanmanı sağlar.\n\n**Kredi**\n[curlconverter](https://curlconverter.com) (Nick Carneiro) tarafından desteklenir."
  },
  "nl": {
    "title": "Wat is een cURL-converter?",
    "description": "Een cURL-converter zet een cURL-opdracht om naar code voor veel talen en HTTP-clients. Hiermee kun je dezelfde API-aanvraag in verschillende stacks hergebruiken zonder headers, body of auth opnieuw te schrijven.\n\n**Credit**\nMogelijk gemaakt door [curlconverter](https://curlconverter.com) van Nick Carneiro."
  },
  "sv": {
    "title": "Vad är en cURL-omvandlare?",
    "description": "En cURL-omvandlare gör om ett cURL-kommando till kod för många språk och HTTP-klienter. Den hjälper dig att återanvända en API-begäran över olika stackar utan att skriva om headers, body eller auth.\n\n**Kredit**\nDrivs av [curlconverter](https://curlconverter.com) av Nick Carneiro."
  },
  "pl": {
    "title": "Czym jest konwerter cURL?",
    "description": "Konwerter cURL zamienia polecenie cURL na kod dla wielu języków i klientów HTTP. Pozwala ponownie używać żądań API w różnych stosach bez przepisywania nagłówków, treści lub uwierzytelniania.\n\n**Uznanie**\nOparty na [curlconverter](https://curlconverter.com) autorstwa Nick Carneiro."
  },
  "vi": {
    "title": "Trình chuyển đổi cURL là gì?",
    "description": "Trình chuyển đổi cURL biến một lệnh cURL thành mã cho nhiều ngôn ngữ và client HTTP. Nó giúp bạn tái sử dụng yêu cầu API giữa các stack khác nhau mà không phải viết lại header, body hay xác thực.\n\n**Ghi công**\nĐược hỗ trợ bởi [curlconverter](https://curlconverter.com) của Nick Carneiro."
  },
  "th": {
    "title": "ตัวแปลง cURL คืออะไร?",
    "description": "ตัวแปลง cURL จะแปลงคำสั่ง cURL เป็นโค้ดสำหรับหลายภาษาและไคลเอนต์ HTTP ช่วยให้คุณนำคำขอ API ไปใช้ซ้ำในสแตกต่าง ๆ ได้โดยไม่ต้องเขียนส่วนหัว บอดี หรือการยืนยันตัวตนใหม่\n\n**เครดิต**\nขับเคลื่อนโดย [curlconverter](https://curlconverter.com) โดย Nick Carneiro."
  },
  "id": {
    "title": "Apa itu pengonversi cURL?",
    "description": "Pengonversi cURL mengubah perintah cURL menjadi kode untuk banyak bahasa dan klien HTTP. Ini membantu Anda menggunakan kembali permintaan API di berbagai stack tanpa menulis ulang header, body, atau autentikasi.\n\n**Kredit**\nDidukung oleh [curlconverter](https://curlconverter.com) oleh Nick Carneiro."
  },
  "he": {
    "title": "מהו ממיר cURL?",
    "description": "ממיר cURL הופך פקודת cURL לקוד עבור שפות רבות ולקוחות HTTP. זה עוזר להשתמש מחדש בבקשת API בין סטאקים שונים בלי לשכתב כותרות, גוף או אימות.\n\n**קרדיט**\nמופעל על־ידי [curlconverter](https://curlconverter.com) מאת Nick Carneiro."
  },
  "ms": {
    "title": "Apakah penukar cURL?",
    "description": "Penukar cURL menukarkan arahan cURL kepada kod untuk banyak bahasa dan klien HTTP. Ia membantu anda menggunakan semula permintaan API merentas stack tanpa menulis semula pengepala, isi atau pengesahan.\n\n**Kredit**\nDikuasakan oleh [curlconverter](https://curlconverter.com) oleh Nick Carneiro."
  },
  "no": {
    "title": "Hva er en cURL-omformer?",
    "description": "En cURL-omformer gjør en cURL-kommando om til kode for mange språk og HTTP-klienter. Den hjelper deg å gjenbruke en API-forespørsel på tvers av ulike stacker uten å skrive om headere, body eller auth.\n\n**Kreditt**\nDrevet av [curlconverter](https://curlconverter.com) av Nick Carneiro."
  }
}
</i18n>
