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
    "title": "What is a User-Agent?",
    "description": "A User-Agent (UA) string identifies the browser or app making a request and usually includes browser, OS, device, and engine details. Because UA strings can be spoofed, treat them as hints rather than security signals."
  },
  "zh": {
    "title": "什么是用户代理？",
    "description": "User-Agent（UA）字符串用于标识发起请求的浏览器或应用，通常包含浏览器、操作系统、设备和引擎信息。由于 UA 可以被伪造，应将其视为参考而非安全依据。"
  },
  "zh-CN": {
    "title": "什么是用户代理？",
    "description": "User-Agent（UA）字符串用于标识发起请求的浏览器或应用，通常包含浏览器、操作系统、设备和引擎信息。由于 UA 可以被伪造，应将其视为参考而非安全依据。"
  },
  "zh-TW": {
    "title": "什麼是使用者代理？",
    "description": "User-Agent（UA）字串用於識別發出請求的瀏覽器或應用程式，通常包含瀏覽器、作業系統、裝置與引擎資訊。由於 UA 可被偽造，應視為參考而非安全依據。"
  },
  "zh-HK": {
    "title": "什麼是使用者代理？",
    "description": "User-Agent（UA）字串用於識別發出請求的瀏覽器或應用程式，通常包含瀏覽器、作業系統、裝置與引擎資訊。由於 UA 可被偽造，應視為參考而非安全依據。"
  },
  "es": {
    "title": "¿Qué es un User-Agent?",
    "description": "Una cadena User-Agent (UA) identifica el navegador o la app que realiza una solicitud y suele incluir navegador, SO, dispositivo y motor. Como puede falsificarse, úsala como pista y no como señal de seguridad."
  },
  "fr": {
    "title": "Qu'est-ce qu'un User-Agent ?",
    "description": "Une chaîne User-Agent (UA) identifie le navigateur ou l'application qui fait une requête et inclut généralement navigateur, OS, appareil et moteur. Comme elle peut être falsifiée, utilisez-la comme un indice plutôt qu'un signal de sécurité."
  },
  "de": {
    "title": "Was ist ein User-Agent?",
    "description": "Ein User-Agent (UA)-String identifiziert den Browser oder die App, die eine Anfrage stellt, und enthält meist Browser-, Betriebssystem-, Geräte- und Engine-Details. Da UA-Strings gefälscht werden können, sollte man sie als Hinweis und nicht als Sicherheitssignal verwenden."
  },
  "it": {
    "title": "Che cos'è un User-Agent?",
    "description": "Una stringa User-Agent (UA) identifica il browser o l'app che invia una richiesta e di solito include informazioni su browser, sistema operativo, dispositivo e motore. Poiché può essere falsificata, usala come indizio e non come segnale di sicurezza."
  },
  "ja": {
    "title": "User-Agent とは？",
    "description": "User-Agent（UA）文字列はリクエストを行うブラウザやアプリを識別し、通常はブラウザ、OS、デバイス、エンジン情報を含みます。UA は偽装できるため、セキュリティ判断ではなく参考情報として扱ってください。"
  },
  "ko": {
    "title": "User-Agent란?",
    "description": "User-Agent(UA) 문자열은 요청을 보내는 브라우저나 앱을 식별하며 보통 브라우저, OS, 디바이스, 엔진 정보를 포함합니다. UA는 위조될 수 있으므로 보안 신호가 아닌 참고 정보로 사용하세요."
  },
  "ru": {
    "title": "Что такое User-Agent?",
    "description": "Строка User-Agent (UA) идентифицирует браузер или приложение, выполняющее запрос, и обычно содержит сведения о браузере, ОС, устройстве и движке. Поскольку UA можно подделать, используйте её как подсказку, а не как сигнал безопасности."
  },
  "pt": {
    "title": "O que é um User-Agent?",
    "description": "Uma string User-Agent (UA) identifica o navegador ou app que faz uma requisição e geralmente inclui navegador, SO, dispositivo e motor. Como pode ser falsificada, trate-a como uma dica e não como um sinal de segurança."
  },
  "ar": {
    "title": "ما هو User-Agent؟",
    "description": "سلسلة User-Agent (UA) تُعرّف المتصفح أو التطبيق الذي يجري الطلب، وغالبًا ما تتضمن معلومات المتصفح ونظام التشغيل والجهاز والمحرك. ولأنها قابلة للتزوير، استخدمها كإشارة إرشادية لا كإشارة أمنية."
  },
  "hi": {
    "title": "User-Agent क्या है?",
    "description": "User-Agent (UA) स्ट्रिंग अनुरोध करने वाले ब्राउज़र या ऐप की पहचान करती है और आमतौर पर ब्राउज़र, OS, डिवाइस और इंजन की जानकारी देती है। क्योंकि इसे spoof किया जा सकता है, इसे सुरक्षा संकेत नहीं बल्कि संदर्भ के रूप में उपयोग करें।"
  },
  "tr": {
    "title": "User-Agent nedir?",
    "description": "User-Agent (UA) dizesi isteği yapan tarayıcıyı veya uygulamayı tanımlar ve genellikle tarayıcı, işletim sistemi, cihaz ve motor bilgilerini içerir. Sahte olabileceği için güvenlik sinyali değil, ipucu olarak kullanın."
  },
  "nl": {
    "title": "Wat is een User-Agent?",
    "description": "Een User-Agent (UA)-string identificeert de browser of app die een verzoek doet en bevat meestal browser-, OS-, apparaat- en enginegegevens. Omdat UA-strings te vervalsen zijn, gebruik ze als hint en niet als beveiligingssignaal."
  },
  "sv": {
    "title": "Vad är en User-Agent?",
    "description": "En User-Agent (UA)-sträng identifierar webbläsaren eller appen som gör en begäran och innehåller vanligtvis information om webbläsare, OS, enhet och motor. Eftersom UA-strängar kan förfalskas bör de ses som ledtrådar, inte som säkerhetssignaler."
  },
  "pl": {
    "title": "Czym jest User-Agent?",
    "description": "Ciąg User-Agent (UA) identyfikuje przeglądarkę lub aplikację wykonującą żądanie i zwykle zawiera informacje o przeglądarce, systemie, urządzeniu i silniku. Ponieważ można go sfałszować, traktuj go jako wskazówkę, a nie sygnał bezpieczeństwa."
  },
  "vi": {
    "title": "User-Agent là gì?",
    "description": "Chuỗi User-Agent (UA) xác định trình duyệt hoặc ứng dụng gửi yêu cầu và thường bao gồm thông tin về trình duyệt, hệ điều hành, thiết bị và engine. Vì có thể bị giả mạo, hãy coi đây là gợi ý chứ không phải tín hiệu bảo mật."
  },
  "th": {
    "title": "User-Agent คืออะไร?",
    "description": "สตริง User-Agent (UA) ใช้ระบุเบราว์เซอร์หรือแอปที่ส่งคำขอ และมักมีข้อมูลเบราว์เซอร์ ระบบปฏิบัติการ อุปกรณ์ และเอนจิน เนื่องจากสามารถปลอมได้ ให้ใช้เป็นข้อมูลอ้างอิง ไม่ใช่สัญญาณความปลอดภัย"
  },
  "id": {
    "title": "Apa itu User-Agent?",
    "description": "String User-Agent (UA) mengidentifikasi browser atau aplikasi yang mengirim permintaan dan biasanya berisi info browser, OS, perangkat, dan engine. Karena dapat dipalsukan, gunakan sebagai petunjuk, bukan sinyal keamanan."
  },
  "he": {
    "title": "מהו User-Agent?",
    "description": "מחרוזת User-Agent (UA) מזהה את הדפדפן או האפליקציה שמבצעים בקשה, ובדרך כלל כוללת פרטי דפדפן, מערכת הפעלה, מכשיר ומנוע. מכיוון שניתן לזייף אותה, השתמשו בה כרמז ולא כאות אבטחה."
  },
  "ms": {
    "title": "Apakah User-Agent?",
    "description": "Rentetan User-Agent (UA) mengenal pasti pelayar atau aplikasi yang membuat permintaan dan biasanya mengandungi maklumat pelayar, OS, peranti dan enjin. Oleh kerana ia boleh dipalsukan, gunakan sebagai petunjuk, bukan isyarat keselamatan."
  },
  "no": {
    "title": "Hva er en User-Agent?",
    "description": "En User-Agent (UA)-streng identifiserer nettleseren eller appen som gjør en forespørsel, og inneholder vanligvis info om nettleser, OS, enhet og motor. Siden UA-strenger kan forfalskes, bør de brukes som hint, ikke sikkerhetssignal."
  }
}
</i18n>
