<template>
  <div>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <NText>{{ t('description') }}</NText>
      <NUl>
        <NLi
          ><NText strong>{{ t('systemPorts') }}</NText> {{ t('systemPortsDesc') }}</NLi
        >
        <NLi
          ><NText strong>{{ t('registeredPorts') }}</NText> {{ t('registeredPortsDesc') }}</NLi
        >
        <NLi
          ><NText strong>{{ t('dynamicPorts') }}</NText> {{ t('dynamicPortsDesc') }}</NLi
        >
      </NUl>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText, NUl, NLi } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a Port Number?",
    "description": "A port number is a 16-bit unsigned integer (0-65535) used to identify specific processes or services on a networked device. Ports allow multiple network services to run on the same IP address.",
    "systemPorts": "System Ports (0-1023):",
    "systemPortsDesc": "Also called \"well-known ports\", reserved for common services like HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Registered Ports (1024-49151):",
    "registeredPortsDesc": "Used by applications and services registered with IANA, such as MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Dynamic Ports (49152-65535):",
    "dynamicPortsDesc": "Also called \"ephemeral ports\", used for temporary connections by client applications."
  },
  "zh": {
    "title": "什么是端口号？",
    "description": "端口号是一个 16 位无符号整数 (0-65535)，用于标识网络设备上的特定进程或服务。端口允许多个网络服务在同一 IP 地址上运行。",
    "systemPorts": "系统端口 (0-1023)：",
    "systemPortsDesc": "也称为\"知名端口\"，保留用于常见服务，如 HTTP (80)、HTTPS (443)、SSH (22)。",
    "registeredPorts": "注册端口 (1024-49151)：",
    "registeredPortsDesc": "由在 IANA 注册的应用程序和服务使用，如 MySQL (3306)、PostgreSQL (5432)。",
    "dynamicPorts": "动态端口 (49152-65535)：",
    "dynamicPortsDesc": "也称为\"临时端口\"，由客户端应用程序用于临时连接。"
  },
  "zh-CN": {
    "title": "什么是端口号？",
    "description": "端口号是一个 16 位无符号整数 (0-65535)，用于标识网络设备上的特定进程或服务。端口允许多个网络服务在同一 IP 地址上运行。",
    "systemPorts": "系统端口 (0-1023)：",
    "systemPortsDesc": "也称为\"知名端口\"，保留用于常见服务，如 HTTP (80)、HTTPS (443)、SSH (22)。",
    "registeredPorts": "注册端口 (1024-49151)：",
    "registeredPortsDesc": "由在 IANA 注册的应用程序和服务使用，如 MySQL (3306)、PostgreSQL (5432)。",
    "dynamicPorts": "动态端口 (49152-65535)：",
    "dynamicPortsDesc": "也称为\"临时端口\"，由客户端应用程序用于临时连接。"
  },
  "zh-TW": {
    "title": "什麼是連接埠號碼？",
    "description": "連接埠號碼是一個 16 位元無符號整數 (0-65535)，用於識別網路裝置上的特定程序或服務。連接埠允許多個網路服務在同一 IP 位址上執行。",
    "systemPorts": "系統連接埠 (0-1023)：",
    "systemPortsDesc": "也稱為「知名連接埠」，保留用於常見服務，如 HTTP (80)、HTTPS (443)、SSH (22)。",
    "registeredPorts": "註冊連接埠 (1024-49151)：",
    "registeredPortsDesc": "由在 IANA 註冊的應用程式和服務使用，如 MySQL (3306)、PostgreSQL (5432)。",
    "dynamicPorts": "動態連接埠 (49152-65535)：",
    "dynamicPortsDesc": "也稱為「臨時連接埠」，由用戶端應用程式用於臨時連線。"
  },
  "zh-HK": {
    "title": "什麼是連接埠號碼？",
    "description": "連接埠號碼是一個 16 位元無符號整數 (0-65535)，用於識別網絡裝置上的特定程序或服務。連接埠允許多個網絡服務在同一 IP 地址上運行。",
    "systemPorts": "系統連接埠 (0-1023)：",
    "systemPortsDesc": "也稱為「知名連接埠」，保留用於常見服務，如 HTTP (80)、HTTPS (443)、SSH (22)。",
    "registeredPorts": "註冊連接埠 (1024-49151)：",
    "registeredPortsDesc": "由在 IANA 註冊的應用程式和服務使用，如 MySQL (3306)、PostgreSQL (5432)。",
    "dynamicPorts": "動態連接埠 (49152-65535)：",
    "dynamicPortsDesc": "也稱為「臨時連接埠」，由客戶端應用程式用於臨時連接。"
  },
  "es": {
    "title": "Que es un Numero de Puerto?",
    "description": "Un numero de puerto es un entero sin signo de 16 bits (0-65535) utilizado para identificar procesos o servicios especificos en un dispositivo en red. Los puertos permiten que multiples servicios de red se ejecuten en la misma direccion IP.",
    "systemPorts": "Puertos del Sistema (0-1023):",
    "systemPortsDesc": "Tambien llamados \"puertos conocidos\", reservados para servicios comunes como HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Puertos Registrados (1024-49151):",
    "registeredPortsDesc": "Utilizados por aplicaciones y servicios registrados en IANA, como MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Puertos Dinamicos (49152-65535):",
    "dynamicPortsDesc": "Tambien llamados \"puertos efimeros\", utilizados para conexiones temporales por aplicaciones cliente."
  },
  "fr": {
    "title": "Qu'est-ce qu'un Numero de Port ?",
    "description": "Un numero de port est un entier non signe de 16 bits (0-65535) utilise pour identifier des processus ou services specifiques sur un appareil en reseau. Les ports permettent a plusieurs services reseau de fonctionner sur la meme adresse IP.",
    "systemPorts": "Ports Systeme (0-1023) :",
    "systemPortsDesc": "Egalement appeles \"ports bien connus\", reserves aux services courants comme HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Ports Enregistres (1024-49151) :",
    "registeredPortsDesc": "Utilises par les applications et services enregistres aupres de l'IANA, tels que MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Ports Dynamiques (49152-65535) :",
    "dynamicPortsDesc": "Egalement appeles \"ports ephemeres\", utilises pour les connexions temporaires par les applications clientes."
  },
  "de": {
    "title": "Was ist eine Portnummer?",
    "description": "Eine Portnummer ist eine 16-Bit-Ganzzahl ohne Vorzeichen (0-65535), die verwendet wird, um bestimmte Prozesse oder Dienste auf einem Netzwerkgerat zu identifizieren. Ports ermoglichen es, mehrere Netzwerkdienste auf derselben IP-Adresse auszufuhren.",
    "systemPorts": "Systemports (0-1023):",
    "systemPortsDesc": "Auch \"bekannte Ports\" genannt, reserviert fur gangige Dienste wie HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Registrierte Ports (1024-49151):",
    "registeredPortsDesc": "Verwendet von Anwendungen und Diensten, die bei der IANA registriert sind, wie MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Dynamische Ports (49152-65535):",
    "dynamicPortsDesc": "Auch \"ephemere Ports\" genannt, verwendet fur temporare Verbindungen durch Client-Anwendungen."
  },
  "it": {
    "title": "Cos'e un Numero di Porta?",
    "description": "Un numero di porta e un intero senza segno a 16 bit (0-65535) utilizzato per identificare processi o servizi specifici su un dispositivo di rete. Le porte consentono a piu servizi di rete di funzionare sullo stesso indirizzo IP.",
    "systemPorts": "Porte di Sistema (0-1023):",
    "systemPortsDesc": "Chiamate anche \"porte ben note\", riservate per servizi comuni come HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Porte Registrate (1024-49151):",
    "registeredPortsDesc": "Utilizzate da applicazioni e servizi registrati presso IANA, come MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Porte Dinamiche (49152-65535):",
    "dynamicPortsDesc": "Chiamate anche \"porte effimere\", utilizzate per connessioni temporanee dalle applicazioni client."
  },
  "ja": {
    "title": "ポート番号とは？",
    "description": "ポート番号は、ネットワークデバイス上の特定のプロセスやサービスを識別するために使用される 16 ビットの符号なし整数 (0-65535) です。ポートにより、複数のネットワークサービスが同じ IP アドレス上で動作できます。",
    "systemPorts": "システムポート (0-1023)：",
    "systemPortsDesc": "「ウェルノウンポート」とも呼ばれ、HTTP (80)、HTTPS (443)、SSH (22) などの一般的なサービス用に予約されています。",
    "registeredPorts": "登録済みポート (1024-49151)：",
    "registeredPortsDesc": "IANA に登録されたアプリケーションやサービスが使用します。例：MySQL (3306)、PostgreSQL (5432)。",
    "dynamicPorts": "動的ポート (49152-65535)：",
    "dynamicPortsDesc": "「エフェメラルポート」とも呼ばれ、クライアントアプリケーションによる一時的な接続に使用されます。"
  },
  "ko": {
    "title": "포트 번호란?",
    "description": "포트 번호는 네트워크 장치에서 특정 프로세스나 서비스를 식별하는 데 사용되는 16비트 부호 없는 정수 (0-65535)입니다. 포트를 통해 여러 네트워크 서비스가 동일한 IP 주소에서 실행될 수 있습니다.",
    "systemPorts": "시스템 포트 (0-1023):",
    "systemPortsDesc": "\"잘 알려진 포트\"라고도 하며, HTTP (80), HTTPS (443), SSH (22)와 같은 일반 서비스용으로 예약되어 있습니다.",
    "registeredPorts": "등록된 포트 (1024-49151):",
    "registeredPortsDesc": "IANA에 등록된 애플리케이션 및 서비스에서 사용합니다. 예: MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "동적 포트 (49152-65535):",
    "dynamicPortsDesc": "\"임시 포트\"라고도 하며, 클라이언트 애플리케이션의 임시 연결에 사용됩니다."
  },
  "ru": {
    "title": "Что такое номер порта?",
    "description": "Номер порта - это 16-битное беззнаковое целое число (0-65535), используемое для идентификации конкретных процессов или служб на сетевом устройстве. Порты позволяют нескольким сетевым службам работать на одном IP-адресе.",
    "systemPorts": "Системные порты (0-1023):",
    "systemPortsDesc": "Также называются \"общеизвестными портами\", зарезервированы для распространенных служб, таких как HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Зарегистрированные порты (1024-49151):",
    "registeredPortsDesc": "Используются приложениями и службами, зарегистрированными в IANA, такими как MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Динамические порты (49152-65535):",
    "dynamicPortsDesc": "Также называются \"эфемерными портами\", используются для временных соединений клиентскими приложениями."
  },
  "pt": {
    "title": "O que e um Numero de Porta?",
    "description": "Um numero de porta e um inteiro sem sinal de 16 bits (0-65535) usado para identificar processos ou servicos especificos em um dispositivo de rede. As portas permitem que varios servicos de rede sejam executados no mesmo endereco IP.",
    "systemPorts": "Portas do Sistema (0-1023):",
    "systemPortsDesc": "Tambem chamadas de \"portas bem conhecidas\", reservadas para servicos comuns como HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Portas Registradas (1024-49151):",
    "registeredPortsDesc": "Usadas por aplicativos e servicos registrados na IANA, como MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Portas Dinamicas (49152-65535):",
    "dynamicPortsDesc": "Tambem chamadas de \"portas efemeras\", usadas para conexoes temporarias por aplicativos cliente."
  },
  "ar": {
    "title": "ما هو رقم المنفذ؟",
    "description": "رقم المنفذ هو عدد صحيح بدون اشارة من 16 بت (0-65535) يستخدم لتحديد عمليات او خدمات معينة على جهاز شبكة. تسمح المنافذ بتشغيل خدمات شبكة متعددة على نفس عنوان IP.",
    "systemPorts": "منافذ النظام (0-1023):",
    "systemPortsDesc": "تسمى ايضا \"المنافذ المعروفة\"، محجوزة للخدمات الشائعة مثل HTTP (80) و HTTPS (443) و SSH (22).",
    "registeredPorts": "المنافذ المسجلة (1024-49151):",
    "registeredPortsDesc": "تستخدمها التطبيقات والخدمات المسجلة لدى IANA، مثل MySQL (3306) و PostgreSQL (5432).",
    "dynamicPorts": "المنافذ الديناميكية (49152-65535):",
    "dynamicPortsDesc": "تسمى ايضا \"المنافذ المؤقتة\"، تستخدم للاتصالات المؤقتة بواسطة تطبيقات العميل."
  },
  "hi": {
    "title": "पोर्ट नंबर क्या है?",
    "description": "पोर्ट नंबर एक 16-बिट अहस्ताक्षरित पूर्णांक (0-65535) है जिसका उपयोग नेटवर्क डिवाइस पर विशिष्ट प्रक्रियाओं या सेवाओं की पहचान के लिए किया जाता है। पोर्ट एक ही IP पते पर कई नेटवर्क सेवाओं को चलाने की अनुमति देते हैं।",
    "systemPorts": "सिस्टम पोर्ट (0-1023):",
    "systemPortsDesc": "\"प्रसिद्ध पोर्ट\" भी कहा जाता है, HTTP (80), HTTPS (443), SSH (22) जैसी सामान्य सेवाओं के लिए आरक्षित।",
    "registeredPorts": "पंजीकृत पोर्ट (1024-49151):",
    "registeredPortsDesc": "IANA के साथ पंजीकृत अनुप्रयोगों और सेवाओं द्वारा उपयोग किया जाता है, जैसे MySQL (3306), PostgreSQL (5432)।",
    "dynamicPorts": "गतिशील पोर्ट (49152-65535):",
    "dynamicPortsDesc": "\"अस्थायी पोर्ट\" भी कहा जाता है, क्लाइंट अनुप्रयोगों द्वारा अस्थायी कनेक्शन के लिए उपयोग किया जाता है।"
  },
  "tr": {
    "title": "Port Numarasi Nedir?",
    "description": "Port numarasi, bir ag cihazindaki belirli islemleri veya hizmetleri tanimlamak icin kullanilan 16 bitlik isaretsi bir tamsayidir (0-65535). Portlar, birden fazla ag hizmetinin ayni IP adresinde calismasina olanak tanir.",
    "systemPorts": "Sistem Portlari (0-1023):",
    "systemPortsDesc": "\"Bilinen portlar\" olarak da adlandirilir, HTTP (80), HTTPS (443), SSH (22) gibi yaygin hizmetler icin ayrilmistir.",
    "registeredPorts": "Kayitli Portlar (1024-49151):",
    "registeredPortsDesc": "IANA'ya kayitli uygulamalar ve hizmetler tarafindan kullanilir, ornegin MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Dinamik Portlar (49152-65535):",
    "dynamicPortsDesc": "\"Gecici portlar\" olarak da adlandirilir, istemci uygulamalari tarafindan gecici baglantilar icin kullanilir."
  },
  "nl": {
    "title": "Wat is een Poortnummer?",
    "description": "Een poortnummer is een 16-bits unsigned integer (0-65535) dat wordt gebruikt om specifieke processen of services op een netwerkapparaat te identificeren. Poorten maken het mogelijk dat meerdere netwerkservices op hetzelfde IP-adres draaien.",
    "systemPorts": "Systeempoorten (0-1023):",
    "systemPortsDesc": "Ook wel \"bekende poorten\" genoemd, gereserveerd voor gangbare services zoals HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Geregistreerde Poorten (1024-49151):",
    "registeredPortsDesc": "Gebruikt door applicaties en services die bij IANA zijn geregistreerd, zoals MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Dynamische Poorten (49152-65535):",
    "dynamicPortsDesc": "Ook wel \"kortstondige poorten\" genoemd, gebruikt voor tijdelijke verbindingen door clientapplicaties."
  },
  "sv": {
    "title": "Vad ar ett Portnummer?",
    "description": "Ett portnummer ar ett 16-bitars heltal utan tecken (0-65535) som anvands for att identifiera specifika processer eller tjanster pa en natverksenhet. Portar tillater flera natverkstjanster att koras pa samma IP-adress.",
    "systemPorts": "Systemportar (0-1023):",
    "systemPortsDesc": "Kallas ocksa \"valkanda portar\", reserverade for vanliga tjanster som HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Registrerade Portar (1024-49151):",
    "registeredPortsDesc": "Anvands av applikationer och tjanster registrerade hos IANA, sasom MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Dynamiska Portar (49152-65535):",
    "dynamicPortsDesc": "Kallas ocksa \"efemara portar\", anvands for tillfalliga anslutningar av klientapplikationer."
  },
  "pl": {
    "title": "Czym jest Numer Portu?",
    "description": "Numer portu to 16-bitowa liczba calkowita bez znaku (0-65535) uzywana do identyfikacji konkretnych procesow lub uslug na urzadzeniu sieciowym. Porty umozliwiaja dzialanie wielu uslug sieciowych pod tym samym adresem IP.",
    "systemPorts": "Porty Systemowe (0-1023):",
    "systemPortsDesc": "Nazywane rowniez \"dobrze znanymi portami\", zarezerwowane dla popularnych uslug jak HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Porty Zarejestrowane (1024-49151):",
    "registeredPortsDesc": "Uzywane przez aplikacje i uslugi zarejestrowane w IANA, takie jak MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Porty Dynamiczne (49152-65535):",
    "dynamicPortsDesc": "Nazywane rowniez \"portami efemerycznymi\", uzywane do tymczasowych polaczen przez aplikacje klienckie."
  },
  "vi": {
    "title": "So Cong la gi?",
    "description": "So cong la mot so nguyen khong dau 16 bit (0-65535) duoc su dung de xac dinh cac quy trinh hoac dich vu cu the tren thiet bi mang. Cong cho phep nhieu dich vu mang chay tren cung mot dia chi IP.",
    "systemPorts": "Cong He thong (0-1023):",
    "systemPortsDesc": "Con goi la \"cong noi tieng\", duoc danh rieng cho cac dich vu pho bien nhu HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Cong Da dang ky (1024-49151):",
    "registeredPortsDesc": "Duoc su dung boi cac ung dung va dich vu da dang ky voi IANA, nhu MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Cong Dong (49152-65535):",
    "dynamicPortsDesc": "Con goi la \"cong tam thoi\", duoc su dung cho cac ket noi tam thoi boi cac ung dung khach."
  },
  "th": {
    "title": "หมายเลขพอร์ตคืออะไร?",
    "description": "หมายเลขพอร์ตคือจำนวนเต็มไม่มีเครื่องหมาย 16 บิต (0-65535) ที่ใช้ระบุกระบวนการหรือบริการเฉพาะบนอุปกรณ์เครือข่าย พอร์ตช่วยให้บริการเครือข่ายหลายรายการทำงานบนที่อยู่ IP เดียวกันได้",
    "systemPorts": "พอร์ตระบบ (0-1023):",
    "systemPortsDesc": "เรียกอีกอย่างว่า \"พอร์ตที่รู้จักกันดี\" สงวนไว้สำหรับบริการทั่วไป เช่น HTTP (80), HTTPS (443), SSH (22)",
    "registeredPorts": "พอร์ตที่ลงทะเบียน (1024-49151):",
    "registeredPortsDesc": "ใช้โดยแอปพลิเคชันและบริการที่ลงทะเบียนกับ IANA เช่น MySQL (3306), PostgreSQL (5432)",
    "dynamicPorts": "พอร์ตไดนามิก (49152-65535):",
    "dynamicPortsDesc": "เรียกอีกอย่างว่า \"พอร์ตชั่วคราว\" ใช้สำหรับการเชื่อมต่อชั่วคราวโดยแอปพลิเคชันไคลเอนต์"
  },
  "id": {
    "title": "Apa itu Nomor Port?",
    "description": "Nomor port adalah bilangan bulat tak bertanda 16-bit (0-65535) yang digunakan untuk mengidentifikasi proses atau layanan tertentu pada perangkat jaringan. Port memungkinkan beberapa layanan jaringan berjalan pada alamat IP yang sama.",
    "systemPorts": "Port Sistem (0-1023):",
    "systemPortsDesc": "Juga disebut \"port terkenal\", dicadangkan untuk layanan umum seperti HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Port Terdaftar (1024-49151):",
    "registeredPortsDesc": "Digunakan oleh aplikasi dan layanan yang terdaftar di IANA, seperti MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Port Dinamis (49152-65535):",
    "dynamicPortsDesc": "Juga disebut \"port efemeral\", digunakan untuk koneksi sementara oleh aplikasi klien."
  },
  "he": {
    "title": "מהו מספר פורט?",
    "description": "מספר פורט הוא מספר שלם ללא סימן בן 16 סיביות (0-65535) המשמש לזיהוי תהליכים או שירותים ספציפיים בהתקן רשת. פורטים מאפשרים לשירותי רשת מרובים לפעול על אותה כתובת IP.",
    "systemPorts": "פורטים מערכתיים (0-1023):",
    "systemPortsDesc": "נקראים גם \"פורטים ידועים\", שמורים לשירותים נפוצים כמו HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "פורטים רשומים (1024-49151):",
    "registeredPortsDesc": "משמשים יישומים ושירותים הרשומים ב-IANA, כגון MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "פורטים דינמיים (49152-65535):",
    "dynamicPortsDesc": "נקראים גם \"פורטים זמניים\", משמשים לחיבורים זמניים על ידי יישומי לקוח."
  },
  "ms": {
    "title": "Apakah Nombor Port?",
    "description": "Nombor port ialah integer tidak bertanda 16-bit (0-65535) yang digunakan untuk mengenal pasti proses atau perkhidmatan tertentu pada peranti rangkaian. Port membenarkan pelbagai perkhidmatan rangkaian berjalan pada alamat IP yang sama.",
    "systemPorts": "Port Sistem (0-1023):",
    "systemPortsDesc": "Juga dipanggil \"port terkenal\", dikhaskan untuk perkhidmatan biasa seperti HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Port Berdaftar (1024-49151):",
    "registeredPortsDesc": "Digunakan oleh aplikasi dan perkhidmatan yang berdaftar dengan IANA, seperti MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Port Dinamik (49152-65535):",
    "dynamicPortsDesc": "Juga dipanggil \"port sementara\", digunakan untuk sambungan sementara oleh aplikasi klien."
  },
  "no": {
    "title": "Hva er et Portnummer?",
    "description": "Et portnummer er et 16-bits heltall uten fortegn (0-65535) som brukes til a identifisere spesifikke prosesser eller tjenester pa en nettverksenhet. Porter gjor det mulig for flere nettverkstjenester a kjore pa samme IP-adresse.",
    "systemPorts": "Systemporter (0-1023):",
    "systemPortsDesc": "Ogsa kalt \"velkjente porter\", reservert for vanlige tjenester som HTTP (80), HTTPS (443), SSH (22).",
    "registeredPorts": "Registrerte Porter (1024-49151):",
    "registeredPortsDesc": "Brukes av applikasjoner og tjenester registrert hos IANA, som MySQL (3306), PostgreSQL (5432).",
    "dynamicPorts": "Dynamiske Porter (49152-65535):",
    "dynamicPortsDesc": "Ogsa kalt \"efemere porter\", brukes for midlertidige tilkoblinger av klientapplikasjoner."
  }
}
</i18n>
