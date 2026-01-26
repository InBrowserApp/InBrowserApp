<template>
  <DescriptionMarkdown :title="t('what-title')" :description="description" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const description = computed(() =>
  [
    t('what-p1'),
    '',
    t('what-p2'),
    '',
    t('what-p3'),
    '',
    `- ${t('what-b1')}`,
    `- ${t('what-b2')}`,
    `- ${t('what-b3')}`,
  ].join('\n'),
)
</script>

<i18n lang="json">
{
  "en": {
    "what-title": "What is Local Font Access?",
    "what-p1": "Local Font Access is a browser API that lists the fonts installed on your device.",
    "what-p2": "It only works in secure contexts and supported browsers, and requires user permission (local-fonts).",
    "what-p3": "The API returns FontData with family, fullName, postscriptName, and style metadata.",
    "what-b1": "Calls must be triggered by a user gesture.",
    "what-b2": "Permissions Policy can block access on some sites.",
    "what-b3": "This tool stays on-device and does not upload fonts."
  },
  "zh": {
    "what-title": "什么是 Local Font Access？",
    "what-p1": "Local Font Access 是浏览器 API，用于列出设备上安装的字体。",
    "what-p2": "它仅在安全上下文和受支持的浏览器中可用，并需要用户权限（local-fonts）。",
    "what-p3": "API 返回的 FontData 包含 family、fullName、postscriptName、style 等信息。",
    "what-b1": "调用必须由用户交互触发。",
    "what-b2": "Permissions Policy 可能会阻止访问。",
    "what-b3": "本工具在本地运行，不会上传字体。"
  },
  "zh-CN": {
    "what-title": "什么是 Local Font Access？",
    "what-p1": "Local Font Access 是浏览器 API，用于列出设备上安装的字体。",
    "what-p2": "它仅在安全上下文和受支持的浏览器中可用，并需要用户权限（local-fonts）。",
    "what-p3": "API 返回的 FontData 包含 family、fullName、postscriptName、style 等信息。",
    "what-b1": "调用必须由用户交互触发。",
    "what-b2": "Permissions Policy 可能会阻止访问。",
    "what-b3": "本工具在本地运行，不会上传字体。"
  },
  "zh-TW": {
    "what-title": "什麼是 Local Font Access？",
    "what-p1": "Local Font Access 是瀏覽器 API，可列出裝置上安裝的字型。",
    "what-p2": "僅在安全環境與支援的瀏覽器中可用，且需要使用者權限（local-fonts）。",
    "what-p3": "API 回傳的 FontData 包含 family、fullName、postscriptName、style 等資訊。",
    "what-b1": "呼叫必須由使用者互動觸發。",
    "what-b2": "Permissions Policy 可能會阻擋存取。",
    "what-b3": "本工具僅在本機運作，不會上傳字型。"
  },
  "zh-HK": {
    "what-title": "什麼是 Local Font Access？",
    "what-p1": "Local Font Access 是瀏覽器 API，可列出裝置上安裝的字體。",
    "what-p2": "僅在安全環境與支援的瀏覽器中可用，且需要使用者權限（local-fonts）。",
    "what-p3": "API 回傳的 FontData 包含 family、fullName、postscriptName、style 等資訊。",
    "what-b1": "呼叫必須由使用者互動觸發。",
    "what-b2": "Permissions Policy 可能會阻擋存取。",
    "what-b3": "本工具只在本機運作，不會上傳字體。"
  },
  "es": {
    "what-title": "¿Qué es Local Font Access?",
    "what-p1": "Local Font Access es una API del navegador que enumera las fuentes instaladas en tu dispositivo.",
    "what-p2": "Solo funciona en contextos seguros y navegadores compatibles, y requiere permiso del usuario (local-fonts).",
    "what-p3": "La API devuelve FontData con metadatos family, fullName, postscriptName y style.",
    "what-b1": "Las llamadas deben iniciarse con un gesto del usuario.",
    "what-b2": "Permissions Policy puede bloquear el acceso en algunos sitios.",
    "what-b3": "Esta herramienta se ejecuta localmente y no sube fuentes."
  },
  "fr": {
    "what-title": "Qu'est-ce que Local Font Access ?",
    "what-p1": "Local Font Access est une API du navigateur qui liste les polices installées sur votre appareil.",
    "what-p2": "Elle fonctionne uniquement en contexte sécurisé et sur des navigateurs compatibles, avec l'autorisation de l'utilisateur (local-fonts).",
    "what-p3": "L'API renvoie des FontData avec family, fullName, postscriptName et style.",
    "what-b1": "Les appels doivent être déclenchés par un geste utilisateur.",
    "what-b2": "Une Permissions Policy peut bloquer l'accès sur certains sites.",
    "what-b3": "Cet outil reste local et ne téléverse pas de polices."
  },
  "de": {
    "what-title": "Was ist Local Font Access?",
    "what-p1": "Local Font Access ist eine Browser-API, die lokal installierte Schriften auflistet.",
    "what-p2": "Sie funktioniert nur in sicheren Kontexten und unterstützten Browsern und erfordert Nutzerberechtigung (local-fonts).",
    "what-p3": "Die API liefert FontData mit family, fullName, postscriptName und style.",
    "what-b1": "Aufrufe müssen durch eine Nutzeraktion ausgelöst werden.",
    "what-b2": "Permissions Policy kann den Zugriff auf manchen Seiten blockieren.",
    "what-b3": "Dieses Tool bleibt lokal und lädt keine Schriften hoch."
  },
  "it": {
    "what-title": "Che cos'è Local Font Access?",
    "what-p1": "Local Font Access è un'API del browser che elenca i font installati sul dispositivo.",
    "what-p2": "Funziona solo in contesti sicuri e browser supportati, con permesso utente (local-fonts).",
    "what-p3": "L'API restituisce FontData con family, fullName, postscriptName e style.",
    "what-b1": "Le chiamate devono essere avviate da un gesto dell'utente.",
    "what-b2": "Permissions Policy può bloccare l'accesso su alcuni siti.",
    "what-b3": "Questo strumento resta locale e non carica font."
  },
  "ja": {
    "what-title": "Local Font Access とは？",
    "what-p1": "Local Font Access は端末にインストールされたフォントを列挙するブラウザー API です。",
    "what-p2": "安全なコンテキストと対応ブラウザーでのみ動作し、ユーザー権限（local-fonts）が必要です。",
    "what-p3": "API は family、fullName、postscriptName、style を含む FontData を返します。",
    "what-b1": "呼び出しはユーザー操作で行う必要があります。",
    "what-b2": "Permissions Policy によりブロックされる場合があります。",
    "what-b3": "このツールは端末内で動作し、フォントをアップロードしません。"
  },
  "ko": {
    "what-title": "Local Font Access란?",
    "what-p1": "Local Font Access는 기기에 설치된 폰트를 나열하는 브라우저 API입니다.",
    "what-p2": "보안 컨텍스트와 지원 브라우저에서만 동작하며 사용자 권한(local-fonts)이 필요합니다.",
    "what-p3": "API는 family, fullName, postscriptName, style 정보를 가진 FontData를 반환합니다.",
    "what-b1": "호출은 사용자 제스처로 트리거되어야 합니다.",
    "what-b2": "Permissions Policy가 접근을 차단할 수 있습니다.",
    "what-b3": "이 도구는 로컬에서 실행되며 폰트를 업로드하지 않습니다."
  },
  "ru": {
    "what-title": "Что такое Local Font Access?",
    "what-p1": "Local Font Access — это API браузера для перечисления установленных на устройстве шрифтов.",
    "what-p2": "Он работает только в безопасном контексте и поддерживаемых браузерах и требует разрешения (local-fonts).",
    "what-p3": "API возвращает FontData с полями family, fullName, postscriptName и style.",
    "what-b1": "Вызовы должны инициироваться пользовательским действием.",
    "what-b2": "Permissions Policy может блокировать доступ на некоторых сайтах.",
    "what-b3": "Этот инструмент работает локально и не загружает шрифты."
  },
  "pt": {
    "what-title": "O que é Local Font Access?",
    "what-p1": "Local Font Access é uma API do navegador que lista as fontes instaladas no dispositivo.",
    "what-p2": "Funciona apenas em contextos seguros e navegadores compatíveis, com permissão do usuário (local-fonts).",
    "what-p3": "A API retorna FontData com family, fullName, postscriptName e style.",
    "what-b1": "As chamadas devem ser iniciadas por um gesto do usuário.",
    "what-b2": "Permissions Policy pode bloquear o acesso em alguns sites.",
    "what-b3": "Esta ferramenta fica no dispositivo e não envia fontes."
  },
  "ar": {
    "what-title": "ما هو Local Font Access؟",
    "what-p1": "Local Font Access هي واجهة API للمتصفح تعرض الخطوط المثبتة على جهازك.",
    "what-p2": "تعمل فقط في سياق آمن وعلى المتصفحات المدعومة وتتطلب إذن المستخدم (local-fonts).",
    "what-p3": "تعيد API كائنات FontData تتضمن family وfullName وpostscriptName وstyle.",
    "what-b1": "يجب أن تُستدعى عبر تفاعل المستخدم.",
    "what-b2": "قد تمنعها Permissions Policy في بعض المواقع.",
    "what-b3": "هذه الأداة تعمل محليًا ولا ترفع الخطوط."
  },
  "hi": {
    "what-title": "Local Font Access क्या है?",
    "what-p1": "Local Font Access एक ब्राउज़र API है जो डिवाइस पर इंस्टॉल फ़ॉन्ट्स सूचीबद्ध करता है।",
    "what-p2": "यह केवल सुरक्षित संदर्भ और समर्थित ब्राउज़रों में काम करता है और उपयोगकर्ता अनुमति (local-fonts) मांगता है।",
    "what-p3": "API FontData लौटाता है जिसमें family, fullName, postscriptName और style होते हैं।",
    "what-b1": "कॉल यूज़र जेस्चर से शुरू होने चाहिए।",
    "what-b2": "Permissions Policy कुछ साइटों पर एक्सेस रोक सकती है।",
    "what-b3": "यह टूल लोकल पर चलता है और फ़ॉन्ट अपलोड नहीं करता।"
  },
  "tr": {
    "what-title": "Local Font Access nedir?",
    "what-p1": "Local Font Access, cihazda yüklü yazı tiplerini listeleyen bir tarayıcı API'sidir.",
    "what-p2": "Yalnızca güvenli bağlamlarda ve desteklenen tarayıcılarda çalışır, kullanıcı izni (local-fonts) gerekir.",
    "what-p3": "API, family, fullName, postscriptName ve style bilgilerini içeren FontData döndürür.",
    "what-b1": "Çağrılar kullanıcı etkileşimiyle tetiklenmelidir.",
    "what-b2": "Permissions Policy bazı sitelerde erişimi engelleyebilir.",
    "what-b3": "Bu araç yerelde çalışır ve font yüklemez."
  },
  "nl": {
    "what-title": "Wat is Local Font Access?",
    "what-p1": "Local Font Access is een browser-API die lokaal geïnstalleerde lettertypen opsomt.",
    "what-p2": "Werkt alleen in veilige contexten en ondersteunde browsers, met gebruikersrechten (local-fonts).",
    "what-p3": "De API retourneert FontData met family, fullName, postscriptName en style.",
    "what-b1": "Aanroepen moeten door een gebruikersactie worden gestart.",
    "what-b2": "Permissions Policy kan toegang blokkeren op sommige sites.",
    "what-b3": "Deze tool blijft lokaal en uploadt geen lettertypen."
  },
  "sv": {
    "what-title": "Vad är Local Font Access?",
    "what-p1": "Local Font Access är ett webbläsar-API som listar typsnitt installerade på enheten.",
    "what-p2": "Det fungerar bara i säkra kontexter och stödda webbläsare, och kräver användartillstånd (local-fonts).",
    "what-p3": "API:et returnerar FontData med family, fullName, postscriptName och style.",
    "what-b1": "Anrop måste triggas av en användargest.",
    "what-b2": "Permissions Policy kan blockera åtkomst på vissa webbplatser.",
    "what-b3": "Detta verktyg körs lokalt och laddar inte upp typsnitt."
  },
  "pl": {
    "what-title": "Czym jest Local Font Access?",
    "what-p1": "Local Font Access to API przeglądarki listujące fonty zainstalowane na urządzeniu.",
    "what-p2": "Działa tylko w bezpiecznych kontekstach i obsługiwanych przeglądarkach oraz wymaga zgody użytkownika (local-fonts).",
    "what-p3": "API zwraca FontData z polami family, fullName, postscriptName i style.",
    "what-b1": "Wywołania muszą być inicjowane przez użytkownika.",
    "what-b2": "Permissions Policy może blokować dostęp na niektórych stronach.",
    "what-b3": "To narzędzie działa lokalnie i nie wysyła fontów."
  },
  "vi": {
    "what-title": "Local Font Access là gì?",
    "what-p1": "Local Font Access là API trình duyệt liệt kê các phông chữ cài trên thiết bị.",
    "what-p2": "Chỉ hoạt động trong ngữ cảnh an toàn và trình duyệt hỗ trợ, cần quyền người dùng (local-fonts).",
    "what-p3": "API trả về FontData với family, fullName, postscriptName và style.",
    "what-b1": "Lệnh gọi phải được kích hoạt bằng thao tác người dùng.",
    "what-b2": "Permissions Policy có thể chặn truy cập trên một số trang.",
    "what-b3": "Công cụ này chạy cục bộ và không tải phông chữ lên."
  },
  "th": {
    "what-title": "Local Font Access คืออะไร?",
    "what-p1": "Local Font Access เป็น API ของเบราว์เซอร์ที่แสดงฟอนต์ที่ติดตั้งในอุปกรณ์",
    "what-p2": "ทำงานได้เฉพาะในบริบทที่ปลอดภัยและเบราว์เซอร์ที่รองรับ และต้องมีสิทธิ์ผู้ใช้ (local-fonts)",
    "what-p3": "API จะคืนค่า FontData ที่มี family, fullName, postscriptName และ style",
    "what-b1": "ต้องเรียกผ่านการโต้ตอบของผู้ใช้เท่านั้น",
    "what-b2": "Permissions Policy อาจบล็อกการเข้าถึงในบางเว็บไซต์",
    "what-b3": "เครื่องมือนี้ทำงานในเครื่องและไม่อัปโหลดฟอนต์"
  },
  "id": {
    "what-title": "Apa itu Local Font Access?",
    "what-p1": "Local Font Access adalah API browser yang menampilkan font terpasang di perangkat.",
    "what-p2": "Hanya bekerja di konteks aman dan browser yang mendukung, serta membutuhkan izin pengguna (local-fonts).",
    "what-p3": "API mengembalikan FontData dengan family, fullName, postscriptName, dan style.",
    "what-b1": "Pemanggilan harus dipicu oleh interaksi pengguna.",
    "what-b2": "Permissions Policy dapat memblokir akses di beberapa situs.",
    "what-b3": "Alat ini berjalan secara lokal dan tidak mengunggah font."
  },
  "he": {
    "what-title": "מה זה Local Font Access?",
    "what-p1": "Local Font Access הוא API של הדפדפן שמציג גופנים מותקנים במכשיר.",
    "what-p2": "פועל רק בהקשר מאובטח ובדפדפנים נתמכים ודורש הרשאת משתמש (local-fonts).",
    "what-p3": "ה-API מחזיר FontData עם family, fullName, postscriptName ו-style.",
    "what-b1": "יש להפעיל קריאות באמצעות מחווה של המשתמש.",
    "what-b2": "Permissions Policy יכולה לחסום גישה בחלק מהאתרים.",
    "what-b3": "הכלי פועל מקומית ולא מעלה גופנים."
  },
  "ms": {
    "what-title": "Apakah Local Font Access?",
    "what-p1": "Local Font Access ialah API pelayar untuk menyenaraikan fon yang dipasang pada peranti.",
    "what-p2": "Hanya berfungsi dalam konteks selamat dan pelayar yang disokong, serta memerlukan izin pengguna (local-fonts).",
    "what-p3": "API mengembalikan FontData dengan family, fullName, postscriptName dan style.",
    "what-b1": "Panggilan mesti dicetuskan oleh interaksi pengguna.",
    "what-b2": "Permissions Policy boleh menyekat akses di sesetengah laman.",
    "what-b3": "Alat ini berjalan secara tempatan dan tidak memuat naik fon."
  },
  "no": {
    "what-title": "Hva er Local Font Access?",
    "what-p1": "Local Font Access er et nettleser-API som lister fonter installert på enheten.",
    "what-p2": "Det fungerer bare i sikre kontekster og støttede nettlesere, og krever bruker­tillatelse (local-fonts).",
    "what-p3": "API-et returnerer FontData med family, fullName, postscriptName og style.",
    "what-b1": "Kall må trigges av en brukerhandling.",
    "what-b2": "Permissions Policy kan blokkere tilgang på enkelte nettsteder.",
    "what-b3": "Dette verktøyet kjører lokalt og laster ikke opp fonter."
  }
}
</i18n>
