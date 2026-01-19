<template>
  <n-h2 prefix="bar" align-text>{{ t('title') }}</n-h2>
  <n-p class="dev-talk">{{ t('description') }}</n-p>
</template>

<script setup lang="ts">
import { NH2, NP } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.dev-talk {
  font-size: 1.2em;
  text-indent: 2em;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "The Developer Says",
    "description": "I've always wanted simple, no-login tools that just work — whether it's editing a document, converting a file, or tweaking an image. But most web tools rely heavily on backend servers, which often means slower load times and privacy trade-offs. So I built InBrowser.App: a collection of web apps that run entirely in your browser, with minimal server dependencies. Your data stays on your device. Fast, private, and always ready to use — just the way tools should be."
  },
  "zh": {
    "title": "开发者说",
    "description": "我一直想要一些简单、免登录且打开即用的工具，比如编辑文档、转换文件或者处理图片。然而大多数在线工具依赖后端服务，加载缓慢，还存在隐私风险。因此，我构建了 InBrowser.App：一个几乎完全在浏览器运行的工具集，最小化对服务器的依赖。你的数据始终保留在你的设备上，快速、安全、随时可用——真正好的工具就该如此。"
  },
  "zh-CN": {
    "title": "开发者说",
    "description": "我一直想要一些简单、免登录且打开即用的工具，比如编辑文档、转换文件或者处理图片。然而大多数在线工具依赖后端服务，加载缓慢，还存在隐私风险。因此，我构建了 InBrowser.App：一个几乎完全在浏览器运行的工具集，最小化对服务器的依赖。你的数据始终保留在你的设备上，快速、安全、随时可用——真正好的工具就该如此。"
  },
  "zh-TW": {
    "title": "開發者說",
    "description": "我一直想要一些簡單、免登入且開啟即用的工具，比如編輯文件、轉換檔案或處理圖片。然而多數線上工具依賴後端服務，載入較慢，也有隱私疑慮。因此，我打造了 InBrowser.App：一組幾乎完全在瀏覽器中運行的工具，將伺服器依賴降到最低。你的資料始終留在你的裝置上，快速、私密、隨時可用——好工具就該如此。"
  },
  "zh-HK": {
    "title": "開發者說",
    "description": "我一直想要一些簡單、免登入且開啟即用的工具，例如編輯文件、轉換檔案或處理圖片。但大多數線上工具依賴後端服務，載入慢，亦有私隱疑慮。因此，我打造了 InBrowser.App：一套幾乎完全在瀏覽器內運行的工具，盡量減少對伺服器的依賴。你的資料始終留在裝置上，快速、私密、隨時可用——好工具就應如此。"
  },
  "es": {
    "title": "El desarrollador dice",
    "description": "Siempre quise herramientas simples, sin inicio de sesión y que funcionen al instante: editar documentos, convertir archivos o retocar imágenes. Pero la mayoría de las herramientas web dependen mucho de servidores, lo que suele implicar cargas más lentas y concesiones de privacidad. Por eso creé InBrowser.App: una colección de aplicaciones web que funcionan totalmente en tu navegador y minimizan la dependencia del servidor. Tus datos se quedan en tu dispositivo. Rápido, privado y siempre listo para usar, como deberían ser las herramientas."
  },
  "fr": {
    "title": "Le développeur dit",
    "description": "J'ai toujours voulu des outils simples, sans connexion, qui fonctionnent immédiatement — éditer un document, convertir un fichier ou retoucher une image. Mais la plupart des outils web dépendent fortement de serveurs, ce qui signifie souvent des chargements plus lents et des compromis sur la confidentialité. J'ai donc créé InBrowser.App : une collection d'apps web qui tournent entièrement dans votre navigateur, avec un minimum de dépendances serveur. Vos données restent sur votre appareil. Rapide, privé et toujours prêt — comme devraient l'être les outils."
  },
  "de": {
    "title": "Der Entwickler sagt",
    "description": "Ich wollte schon immer einfache Tools ohne Login, die sofort funktionieren – ob Dokumente bearbeiten, Dateien konvertieren oder Bilder anpassen. Doch die meisten Web-Tools hängen stark von Servern ab, was oft längere Ladezeiten und Abstriche beim Datenschutz bedeutet. Deshalb habe ich InBrowser.App gebaut: eine Sammlung von Web-Apps, die komplett im Browser laufen und die Serverabhängigkeit minimieren. Deine Daten bleiben auf deinem Gerät. Schnell, privat und jederzeit einsatzbereit – so sollten Tools sein."
  },
  "it": {
    "title": "Lo sviluppatore dice",
    "description": "Ho sempre voluto strumenti semplici, senza login e subito funzionanti — per modificare documenti, convertire file o ritoccare immagini. Ma la maggior parte degli strumenti web dipende dai server, con tempi di caricamento più lenti e compromessi sulla privacy. Per questo ho creato InBrowser.App: una raccolta di app web che funzionano interamente nel tuo browser, con dipendenze minime dal server. I tuoi dati restano sul tuo dispositivo. Veloce, privato e sempre pronto — proprio come dovrebbero essere gli strumenti."
  },
  "ja": {
    "title": "開発者の言葉",
    "description": "ログイン不要で、すぐ使えるシンプルなツールが欲しかった。文書の編集、ファイルの変換、画像の調整など。けれど多くのWebツールはサーバーに大きく依存し、読み込みが遅く、プライバシー面でも妥協が必要になる。そこで InBrowser.App を作りました。ブラウザの中で完結して動くツール群で、サーバー依存を最小限にしています。データは端末に留まります。速く、プライベートで、いつでも使える——ツールはこうあるべきです。"
  },
  "ko": {
    "title": "개발자의 한마디",
    "description": "로그인 없이 바로 쓸 수 있는 단순한 도구를 늘 원했습니다. 문서 편집, 파일 변환, 이미지 손질처럼요. 하지만 대부분의 웹 도구는 서버에 크게 의존해 로딩이 느리고 프라이버시에도 타협이 필요했습니다. 그래서 InBrowser.App을 만들었습니다. 브라우저 안에서 완전히 동작하고 서버 의존을 최소화한 웹 앱 모음입니다. 데이터는 기기 안에 머뭅니다. 빠르고, 사적이며, 언제든 쓸 수 있는—도구는 원래 그래야 하니까요."
  },
  "ru": {
    "title": "Слово разработчика",
    "description": "Мне всегда хотелось простых инструментов без входа, которые сразу работают — редактирование документов, конвертация файлов, обработка изображений. Но большинство веб-инструментов сильно зависят от серверов, а это обычно означает более долгую загрузку и компромиссы в приватности. Поэтому я сделал InBrowser.App: набор веб-приложений, которые полностью работают в вашем браузере и минимально зависят от сервера. Ваши данные остаются на устройстве. Быстро, приватно и всегда готово — так и должны работать инструменты."
  },
  "pt": {
    "title": "O desenvolvedor diz",
    "description": "Sempre quis ferramentas simples, sem login e que funcionem de imediato — editar documentos, converter arquivos ou ajustar imagens. Mas a maioria das ferramentas web depende bastante de servidores, o que costuma significar carregamento mais lento e concessões de privacidade. Por isso criei o InBrowser.App: uma coleção de aplicativos web que rodam totalmente no seu navegador, com mínima dependência do servidor. Seus dados ficam no seu dispositivo. Rápido, privado e sempre pronto para usar — como as ferramentas deveriam ser."
  },
  "ar": {
    "title": "يقول المطور",
    "description": "لطالما أردت أدوات بسيطة تعمل بلا تسجيل دخول وبشكل فوري — سواء لتحرير مستند أو تحويل ملف أو تعديل صورة. لكن معظم أدوات الويب تعتمد كثيرًا على الخوادم، ما يعني غالبًا تحميلًا أبطأ وتنازلات في الخصوصية. لذلك أنشأت InBrowser.App: مجموعة من تطبيقات الويب التي تعمل بالكامل داخل المتصفح مع أقل قدر من الاعتماد على الخادم. تبقى بياناتك على جهازك. سريع، خاص، وجاهز دائمًا — هكذا يجب أن تكون الأدوات."
  },
  "hi": {
    "title": "डेवलपर का कहना",
    "description": "मैं हमेशा ऐसे सरल टूल चाहता था जो बिना लॉगिन के तुरंत काम करें — दस्तावेज़ संपादित करना, फ़ाइलें कन्वर्ट करना या तस्वीरों को ठीक करना। लेकिन ज़्यादातर वेब टूल बैकएंड सर्वर पर बहुत निर्भर होते हैं, जिससे लोड समय धीमा होता है और प्राइवेसी पर समझौते करने पड़ते हैं। इसलिए मैंने InBrowser.App बनाया: वेब ऐप्स का एक संग्रह जो पूरी तरह आपके ब्राउज़र में चलता है और सर्वर निर्भरता को न्यूनतम रखता है। आपका डेटा आपके डिवाइस पर ही रहता है। तेज़, निजी और हमेशा तैयार — जैसे टूल होने चाहिए।"
  },
  "tr": {
    "title": "Geliştirici diyor",
    "description": "Her zaman basit, giriş gerektirmeyen ve hemen çalışan araçlar istedim — belge düzenlemek, dosya dönüştürmek ya da görselleri düzeltmek gibi. Ancak çoğu web aracı sunuculara fazlasıyla bağımlı; bu da daha yavaş yükleme süreleri ve gizlilikten ödünler anlamına geliyor. Bu yüzden InBrowser.App'i yaptım: tamamen tarayıcınızda çalışan ve sunucu bağımlılığını en aza indiren web uygulamaları koleksiyonu. Verileriniz cihazınızda kalır. Hızlı, özel ve her zaman kullanıma hazır — araçlar böyle olmalı."
  },
  "nl": {
    "title": "De ontwikkelaar zegt",
    "description": "Ik wilde altijd eenvoudige, loginvrije tools die meteen werken — of het nu gaat om documenten bewerken, bestanden omzetten of afbeeldingen bijwerken. Maar de meeste webtools leunen zwaar op servers, wat vaak tragere laadtijden en privacy-compromissen betekent. Daarom bouwde ik InBrowser.App: een verzameling webapps die volledig in je browser draaien en de serverafhankelijkheid minimaliseren. Je gegevens blijven op je apparaat. Snel, privé en altijd klaar voor gebruik — zo zouden tools moeten zijn."
  },
  "sv": {
    "title": "Utvecklaren säger",
    "description": "Jag har alltid velat ha enkla verktyg utan inloggning som fungerar direkt — oavsett om det gäller att redigera dokument, konvertera filer eller justera bilder. Men de flesta webbverktyg är starkt beroende av servrar, vilket ofta innebär långsammare laddning och kompromisser med integriteten. Därför byggde jag InBrowser.App: en samling webbappar som körs helt i din webbläsare med minimal serverberoende. Dina data stannar på din enhet. Snabbt, privat och alltid redo — som verktyg borde vara."
  },
  "pl": {
    "title": "Słowo dewelopera",
    "description": "Zawsze chciałem prostych narzędzi bez logowania, które działają od razu — do edycji dokumentów, konwersji plików czy poprawy obrazów. Jednak większość narzędzi webowych mocno polega na serwerach, co zwykle oznacza wolniejsze ładowanie i kompromisy w prywatności. Dlatego stworzyłem InBrowser.App: zestaw aplikacji webowych działających całkowicie w przeglądarce, z minimalną zależnością od serwera. Twoje dane pozostają na urządzeniu. Szybko, prywatnie i zawsze gotowe — tak powinny działać narzędzia."
  },
  "vi": {
    "title": "Lời chia sẻ của nhà phát triển",
    "description": "Tôi luôn muốn những công cụ đơn giản, không cần đăng nhập và hoạt động ngay lập tức — chỉnh sửa tài liệu, chuyển đổi tệp hay tinh chỉnh hình ảnh. Nhưng hầu hết công cụ web phụ thuộc nhiều vào máy chủ, thường khiến tải chậm và phải đánh đổi quyền riêng tư. Vì vậy tôi đã tạo InBrowser.App: một bộ sưu tập ứng dụng web chạy hoàn toàn trong trình duyệt, với mức phụ thuộc máy chủ tối thiểu. Dữ liệu của bạn ở lại trên thiết bị. Nhanh, riêng tư và luôn sẵn sàng — đúng như công cụ nên có."
  },
  "th": {
    "title": "คำบอกเล่าจากผู้พัฒนา",
    "description": "ผมอยากได้เครื่องมือที่เรียบง่าย ไม่ต้องล็อกอิน และใช้งานได้ทันทีเสมอ — ไม่ว่าจะเป็นการแก้ไขเอกสาร แปลงไฟล์ หรือปรับแต่งรูปภาพ แต่เครื่องมือเว็บส่วนใหญ่พึ่งพาเซิร์ฟเวอร์มาก ทำให้โหลดช้าและต้องแลกกับความเป็นส่วนตัว ดังนั้นผมจึงสร้าง InBrowser.App: ชุดแอปเว็บที่ทำงานทั้งหมดในเบราว์เซอร์ โดยลดการพึ่งพาเซิร์ฟเวอร์ให้เหลือน้อยที่สุด ข้อมูลของคุณอยู่บนอุปกรณ์ของคุณเสมอ รวดเร็ว เป็นส่วนตัว และพร้อมใช้งานตลอดเวลา — เครื่องมือควรเป็นแบบนี้"
  },
  "id": {
    "title": "Kata Pengembang",
    "description": "Saya selalu menginginkan alat yang sederhana, tanpa login, dan langsung berfungsi — untuk mengedit dokumen, mengonversi file, atau menyunting gambar. Namun sebagian besar alat web sangat bergantung pada server, yang sering berarti waktu muat lebih lambat dan kompromi privasi. Karena itu saya membuat InBrowser.App: kumpulan aplikasi web yang berjalan sepenuhnya di browser Anda dengan ketergantungan server minimal. Data Anda tetap di perangkat Anda. Cepat, privat, dan selalu siap digunakan — begitulah seharusnya alat bekerja."
  },
  "he": {
    "title": "המפתח אומר",
    "description": "תמיד רציתי כלים פשוטים, בלי התחברות ושעובדים מיד — לעריכת מסמכים, המרת קבצים או התאמת תמונות. אבל רוב כלי הווב נשענים מאוד על שרתים, מה שבדרך כלל פירושו טעינה איטית יותר ופשרות בפרטיות. לכן יצרתי את InBrowser.App: אוסף של אפליקציות ווב שפועלות כולן בדפדפן עם תלות מינימלית בשרת. הנתונים שלך נשארים במכשיר. מהיר, פרטי ותמיד זמין — כך כלים צריכים להיות."
  },
  "ms": {
    "title": "Kata Pembangun",
    "description": "Saya sentiasa mahukan alat yang mudah, tanpa log masuk dan berfungsi serta-merta — untuk mengedit dokumen, menukar fail atau melaras imej. Tetapi kebanyakan alat web sangat bergantung pada pelayan, yang selalunya bermaksud masa muat yang lebih perlahan dan kompromi privasi. Oleh itu saya membina InBrowser.App: koleksi aplikasi web yang berjalan sepenuhnya dalam pelayar anda dengan kebergantungan pelayan yang minimum. Data anda kekal pada peranti anda. Pantas, peribadi dan sentiasa sedia — begitulah sepatutnya alat."
  },
  "no": {
    "title": "Utvikleren sier",
    "description": "Jeg har alltid ønsket enkle verktøy uten innlogging som fungerer med en gang — for å redigere dokumenter, konvertere filer eller justere bilder. Men de fleste nettverktøy er sterkt avhengige av servere, noe som ofte betyr tregere lasting og kompromisser på personvern. Derfor laget jeg InBrowser.App: en samling nettapper som kjører helt i nettleseren med minimal serveravhengighet. Dataene dine blir på enheten din. Raskt, privat og alltid klart — slik verktøy bør være."
  }
}
</i18n>
