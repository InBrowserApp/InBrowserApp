<template>
  <n-collapse-transition :show="airplaneModeStore.isAirplaneMode">
    <n-alert :title="t('airplane-mode-enabled')" type="warning">
      <template #icon>
        <n-icon><enableIcon /></n-icon>
      </template>
      {{ t('what-is-airplane-mode-description') }}
    </n-alert>
  </n-collapse-transition>
</template>

<script lang="ts" setup>
import { useAirplaneModeStore } from '@utils/airplane-mode'
import { NAlert, NCollapseTransition, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import enableIcon from '@vicons/material/AirplanemodeActiveRound'
const airplaneModeStore = useAirplaneModeStore()
const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "airplane-mode-enabled": "Airplane Mode Enabled",
    "what-is-airplane-mode-description": "When airplane mode is enabled, all network requests to external servers are blocked to ensure your data always stays on your device. Only requests within the same website (same origin) are allowed. Think of it as a privacy shield - your files and data never leave your browser, making our tools completely secure and private."
  },
  "zh": {
    "airplane-mode-enabled": "飞行模式已启用",
    "what-is-airplane-mode-description": "启用飞行模式时，所有对外部服务器的网络请求都会被阻止，确保你的数据始终保留在你的设备上。只有同一网站内部（同源）的请求才被允许。可以把它想象成一个隐私保护罩 - 你的文件和数据永远不会离开你的浏览器，让我们的工具完全安全和私密。"
  },
  "zh-CN": {
    "airplane-mode-enabled": "飞行模式已启用",
    "what-is-airplane-mode-description": "启用飞行模式时，所有对外部服务器的网络请求都会被阻止，确保你的数据始终保留在你的设备上。只有同一网站内部（同源）的请求才被允许。可以把它想象成一个隐私保护罩 - 你的文件和数据永远不会离开你的浏览器，让我们的工具完全安全和私密。"
  },
  "zh-TW": {
    "airplane-mode-enabled": "飛航模式已啟用",
    "what-is-airplane-mode-description": "啟用飛行模式時，所有對外部伺服器的網路請求都會被阻止，確保你的資料始終保留在你的裝置上。只有同一網站內部（同源）的請求才被允許。可以把它想像成一個隱私保護罩 - 你的檔案和資料永遠不會離開你的瀏覽器，讓我們的工具完全安全和私密。"
  },
  "zh-HK": {
    "airplane-mode-enabled": "飛行模式已啟用",
    "what-is-airplane-mode-description": "啟用飛行模式時，所有對外部伺服器的網路請求都會被阻止，確保你的資料始終保留在你的裝置上。只有同一網站內部（同源）的請求才被允許。可以把它想像成一個隱私保護罩 - 你的檔案和資料永遠不會離開你的瀏覽器，讓我們的工具完全安全和私密。"
  },
  "es": {
    "airplane-mode-enabled": "Modo Avión Habilitado",
    "what-is-airplane-mode-description": "Cuando el modo avión está habilitado, todas las solicitudes de red a servidores externos están bloqueadas para asegurar que tus datos siempre permanezcan en tu dispositivo. Solo se permiten solicitudes dentro del mismo sitio web (mismo origen). Piénsalo como un escudo de privacidad: tus archivos y datos nunca salen de tu navegador, haciendo que nuestras herramientas sean completamente seguras y privadas."
  },
  "fr": {
    "airplane-mode-enabled": "Mode Avion Activé",
    "what-is-airplane-mode-description": "Lorsque le mode avion est activé, toutes les requêtes réseau vers des serveurs externes sont bloquées pour s'assurer que vos données restent toujours sur votre appareil. Seules les requêtes au sein du même site web (même origine) sont autorisées. Considérez-le comme un bouclier de confidentialité - vos fichiers et données ne quittent jamais votre navigateur, rendant nos outils complètement sécurisés et privés."
  },
  "de": {
    "airplane-mode-enabled": "Flugmodus Aktiviert",
    "what-is-airplane-mode-description": "Wenn der Flugmodus aktiviert ist, werden alle Netzwerkanfragen an externe Server blockiert, um sicherzustellen, dass Ihre Daten immer auf Ihrem Gerät bleiben. Nur Anfragen innerhalb derselben Website (gleicher Ursprung) sind erlaubt. Stellen Sie es sich als Privatsphäre-Schild vor - Ihre Dateien und Daten verlassen nie Ihren Browser und machen unsere Tools vollständig sicher und privat."
  },
  "it": {
    "airplane-mode-enabled": "Modalità Aereo Attivata",
    "what-is-airplane-mode-description": "Quando la modalità aereo è abilitata, tutte le richieste di rete a server esterni vengono bloccate per assicurare che i tuoi dati rimangano sempre sul tuo dispositivo. Solo le richieste all'interno dello stesso sito web (stessa origine) sono consentite. Pensalo come uno scudo per la privacy - i tuoi file e dati non lasciano mai il tuo browser, rendendo i nostri strumenti completamente sicuri e privati."
  },
  "ja": {
    "airplane-mode-enabled": "機内モードが有効",
    "what-is-airplane-mode-description": "機内モードが有効になると、外部サーバーへのすべてのネットワークリクエストがブロックされ、データが常にあなたのデバイス上に留まることが保証されます。同じウェブサイト内（同一オリジン）のリクエストのみが許可されます。これをプライバシーシールドと考えてください - あなたのファイルとデータは決してブラウザから離れることなく、私たちのツールを完全に安全でプライベートにします。"
  },
  "ko": {
    "airplane-mode-enabled": "비행기 모드 활성화됨",
    "what-is-airplane-mode-description": "비행기 모드가 활성화되면 외부 서버로의 모든 네트워크 요청이 차단되어 데이터가 항상 기기에 머물도록 보장합니다. 같은 웹사이트 내부(동일 출처)의 요청만 허용됩니다. 이것을 개인정보 보호막이라고 생각하세요 - 파일과 데이터가 브라우저를 떠나지 않아 도구들이 완전히 안전하고 비공개가 됩니다."
  },
  "ru": {
    "airplane-mode-enabled": "Режим Полета Включен",
    "what-is-airplane-mode-description": "Когда режим полёта включён, все сетевые запросы к внешним серверам блокируются, чтобы гарантировать, что ваши данные всегда остаются на вашем устройстве. Разрешены только запросы в пределах того же веб-сайта (тот же источник). Думайте об этом как о щите конфиденциальности - ваши файлы и данные никогда не покидают ваш браузер, делая наши инструменты полностью безопасными и приватными."
  },
  "pt": {
    "airplane-mode-enabled": "Modo Avião Ativado",
    "what-is-airplane-mode-description": "Quando o modo avião está habilitado, todas as solicitações de rede para servidores externos são bloqueadas para garantir que seus dados sempre permaneçam no seu dispositivo. Apenas solicitações dentro do mesmo site (mesma origem) são permitidas. Pense nisso como um escudo de privacidade - seus arquivos e dados nunca saem do seu navegador, tornando nossas ferramentas completamente seguras e privadas."
  },
  "ar": {
    "airplane-mode-enabled": "وضع الطيران مفعل",
    "what-is-airplane-mode-description": "عند تمكين وضع الطيران، يتم حظر جميع طلبات الشبكة إلى الخوادم الخارجية لضمان بقاء بياناتك دائماً على جهازك. يُسمح فقط بالطلبات داخل نفس الموقع الإلكتروني (نفس المصدر). فكر في الأمر كدرع للخصوصية - ملفاتك وبياناتك لا تغادر متصفحك أبداً، مما يجعل أدواتنا آمنة وخاصة تماماً."
  },
  "hi": {
    "airplane-mode-enabled": "एयरप्लेन मोड सक्षम",
    "what-is-airplane-mode-description": "जब एयरप्लेन मोड सक्षम होता है, तो बाहरी सर्वर के लिए सभी नेटवर्क अनुरोध अवरुद्ध हो जाते हैं ताकि यह सुनिश्चित हो सके कि आपका डेटा हमेशा आपके डिवाइस पर ही रहे। केवल उसी वेबसाइट के भीतर (समान मूल) के अनुरोधों की अनुमति है। इसे एक गोपनीयता ढाल के रूप में सोचें - आपकी फाइलें और डेटा कभी भी आपके ब्राउज़र को नहीं छोड़ते, जिससे हमारे उपकरण पूरी तरह से सुरक्षित और निजी हो जाते हैं।"
  },
  "tr": {
    "airplane-mode-enabled": "Uçak Modu Etkin",
    "what-is-airplane-mode-description": "Uçak modu etkinleştirildiğinde, verilerinizin her zaman cihazınızda kalmasını sağlamak için dış sunuculara yapılan tüm ağ istekleri engellenir. Sadece aynı web sitesi içindeki (aynı kaynak) isteklere izin verilir. Bunu bir gizlilik kalkanı olarak düşünün - dosyalarınız ve verileriniz asla tarayıcınızı terk etmez, araçlarımızı tamamen güvenli ve özel hale getirir."
  },
  "nl": {
    "airplane-mode-enabled": "Vliegtuigmodus Ingeschakeld",
    "what-is-airplane-mode-description": "Wanneer vliegtuigmodus is ingeschakeld, worden alle netwerkverzoeken naar externe servers geblokkeerd om ervoor te zorgen dat uw gegevens altijd op uw apparaat blijven. Alleen verzoeken binnen dezelfde website (zelfde oorsprong) zijn toegestaan. Zie het als een privacyschild - uw bestanden en gegevens verlaten nooit uw browser, waardoor onze tools volledig veilig en privé zijn."
  },
  "sv": {
    "airplane-mode-enabled": "Flygplansläge Aktiverat",
    "what-is-airplane-mode-description": "När flygplansläge är aktiverat blockeras alla nätverksförfrågningar till externa servrar för att säkerställa att din data alltid stannar på din enhet. Endast förfrågningar inom samma webbplats (samma ursprung) tillåts. Tänk på det som en integritetssköld - dina filer och data lämnar aldrig din webbläsare, vilket gör våra verktyg helt säkra och privata."
  },
  "pl": {
    "airplane-mode-enabled": "Tryb Samolotowy Włączony",
    "what-is-airplane-mode-description": "Gdy tryb samolotowy jest włączony, wszystkie żądania sieciowe do zewnętrznych serwerów są blokowane, aby zapewnić, że Twoje dane zawsze pozostają na Twoim urządzeniu. Dozwolone są tylko żądania w obrębie tej samej strony internetowej (to samo pochodzenie). Pomyśl o tym jak o tarczy prywatności - Twoje pliki i dane nigdy nie opuszczają Twojej przeglądarki, czyniąc nasze narzędzia całkowicie bezpiecznymi i prywatnymi."
  },
  "vi": {
    "airplane-mode-enabled": "Chế Độ Máy Bay Đã Bật",
    "what-is-airplane-mode-description": "Khi chế độ máy bay được bật, tất cả các yêu cầu mạng đến máy chủ bên ngoài sẽ bị chặn để đảm bảo dữ liệu của bạn luôn ở trên thiết bị của bạn. Chỉ các yêu cầu trong cùng một trang web (cùng nguồn gốc) mới được phép. Hãy nghĩ về nó như một lá chắn bảo mật - các tệp và dữ liệu của bạn không bao giờ rời khỏi trình duyệt của bạn, làm cho các công cụ của chúng tôi hoàn toàn an toàn và riêng tư."
  },
  "th": {
    "airplane-mode-enabled": "โหมดเครื่องบิน เปิดใช้งาน",
    "what-is-airplane-mode-description": "เมื่อเปิดใช้โหมดเครื่องบิน คำขอเครือข่ายทั้งหมดไปยังเซิร์ฟเวอร์ภายนอกจะถูกบล็อกเพื่อให้แน่ใจว่าข้อมูลของคุณจะอยู่ในอุปกรณ์ของคุณเสมอ อนุญาตเฉพาะคำขอภายในเว็บไซต์เดียวกัน (ต้นทางเดียวกัน) เท่านั้น คิดว่ามันเป็นโล่ป้องกันความเป็นส่วนตัว - ไฟล์และข้อมูลของคุณจะไม่เคยออกจากเบราว์เซอร์ของคุณ ทำให้เครื่องมือของเราปลอดภัยและเป็นส่วนตัวอย่างสมบูรณ์"
  },
  "id": {
    "airplane-mode-enabled": "Mode Pesawat Diaktifkan",
    "what-is-airplane-mode-description": "Ketika mode pesawat diaktifkan, semua permintaan jaringan ke server eksternal diblokir untuk memastikan data Anda selalu tetap di perangkat Anda. Hanya permintaan dalam situs web yang sama (asal yang sama) yang diizinkan. Anggap saja sebagai perisai privasi - file dan data Anda tidak pernah meninggalkan browser Anda, membuat alat kami sepenuhnya aman dan pribadi."
  },
  "he": {
    "airplane-mode-enabled": "מצב טיסה מופעל",
    "what-is-airplane-mode-description": "כאשר מצב הטיסה מופעל, כל בקשות הרשת לשרתים חיצוניים חסומות כדי להבטיח שהנתונים שלך תמיד נשארים במכשיר שלך. רק בקשות בתוך אותו אתר (אותו מקור) מותרות. חשבו על זה כמגן פרטיות - הקבצים והנתונים שלכם אף פעם לא עוזבים את הדפדפן שלכם, מה שהופך את הכלים שלנו לבטוחים ופרטיים לחלוטין."
  },
  "ms": {
    "airplane-mode-enabled": "Mod Kapal Terbang Diaktifkan",
    "what-is-airplane-mode-description": "Apabila mod kapal terbang diaktifkan, semua permintaan rangkaian ke pelayan luaran disekat untuk memastikan data anda sentiasa kekal pada peranti anda. Hanya permintaan dalam laman web yang sama (asal yang sama) dibenarkan. Fikirkan ia sebagai perisai privasi - fail dan data anda tidak pernah meninggalkan pelayar anda, menjadikan alat kami sepenuhnya selamat dan peribadi."
  },
  "no": {
    "airplane-mode-enabled": "Flymodus Aktivert",
    "what-is-airplane-mode-description": "Når flymodus er aktivert, blokkeres alle nettverksforespørsler til eksterne servere for å sikre at dataene dine alltid forblir på enheten din. Kun forespørsler innenfor samme nettsted (samme opprinnelse) er tillatt. Tenk på det som et personvernskjold - filene og dataene dine forlater aldri nettleseren din, noe som gjør verktøyene våre helt sikre og private."
  }
}
</i18n>
