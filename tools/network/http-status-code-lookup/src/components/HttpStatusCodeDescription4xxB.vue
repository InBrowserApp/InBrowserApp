<template>
  <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
  <span>{{ t(`description.${code}`) }}</span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  code: number
}>()

const { t } = useI18n()
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "description": {
      "410": "The resource requested is no longer available and will not be available again.",
      "411": "The request did not specify the length of its content, which is required by the requested resource.",
      "412": "The server does not meet one of the preconditions that the requester put on the request.",
      "413": "The request is larger than the server is willing or able to process.",
      "414": "The URI provided was too long for the server to process.",
      "415": "The request entity has a media type which the server or resource does not support.",
      "416": "The client has asked for a portion of the file, but the server cannot supply that portion.",
      "417": "The server cannot meet the requirements of the Expect request-header field."
    }
  },
  "zh": {
    "description": {
      "410": "请求的资源不再可用，并且不会再可用。",
      "411": "请求未指定其内容的长度，这是请求资源所需的。",
      "412": "服务器不满足请求者对请求设置的前提条件之一。",
      "413": "请求大于服务器愿意或能够处理的大小。",
      "414": "提供的 URI 太长，服务器无法处理。",
      "415": "请求实体具有服务器或资源不支持的媒体类型。",
      "416": "客户端请求文件的一部分，但服务器无法提供该部分。",
      "417": "服务器无法满足 Expect 请求头字段的要求。"
    }
  },
  "zh-CN": {
    "description": {
      "410": "请求的资源不再可用，并且不会再可用。",
      "411": "请求未指定其内容的长度，这是请求资源所需的。",
      "412": "服务器不满足请求者对请求设置的前提条件之一。",
      "413": "请求大于服务器愿意或能够处理的大小。",
      "414": "提供的 URI 太长，服务器无法处理。",
      "415": "请求实体具有服务器或资源不支持的媒体类型。",
      "416": "客户端请求文件的一部分，但服务器无法提供该部分。",
      "417": "服务器无法满足 Expect 请求头字段的要求。"
    }
  },
  "zh-TW": {
    "description": {
      "410": "請求的資源不再可用，並且不會再可用。",
      "411": "請求未指定其內容的長度，這是請求資源所需的。",
      "412": "伺服器不滿足請求者對請求設置的前提條件之一。",
      "413": "請求大於伺服器願意或能夠處理的大小。",
      "414": "提供的 URI 太長，伺服器無法處理。",
      "415": "請求實體具有伺服器或資源不支持的媒體類型。",
      "416": "用戶端請求檔案的一部分，但伺服器無法提供該部分。",
      "417": "伺服器無法滿足 Expect 請求標頭欄位的要求。"
    }
  },
  "zh-HK": {
    "description": {
      "410": "請求的資源不再可用，並且不會再可用。",
      "411": "請求未指定其內容的長度，這是請求資源所需的。",
      "412": "伺服器不滿足請求者對請求設置的前提條件之一。",
      "413": "請求大於伺服器願意或能夠處理的大小。",
      "414": "提供的 URI 太長，伺服器無法處理。",
      "415": "請求實體具有伺服器或資源不支持的媒體類型。",
      "416": "客戶端請求檔案的一部分，但伺服器無法提供該部分。",
      "417": "伺服器無法滿足 Expect 請求標頭欄位的要求。"
    }
  },
  "es": {
    "description": {
      "410": "El recurso solicitado ya no esta disponible y no volvera a estar disponible.",
      "411": "La solicitud no especifico la longitud de su contenido, que es requerida por el recurso solicitado.",
      "412": "El servidor no cumple con una de las precondiciones que el solicitante establecio en la solicitud.",
      "413": "La solicitud es mas grande de lo que el servidor esta dispuesto o puede procesar.",
      "414": "El URI proporcionado era demasiado largo para que el servidor lo procesara.",
      "415": "La entidad de solicitud tiene un tipo de medio que el servidor o recurso no soporta.",
      "416": "El cliente ha pedido una porcion del archivo, pero el servidor no puede suministrar esa porcion.",
      "417": "El servidor no puede cumplir con los requisitos del campo Expect del encabezado de solicitud."
    }
  },
  "fr": {
    "description": {
      "410": "La ressource demandee n'est plus disponible et ne sera plus disponible.",
      "411": "La requete n'a pas specifie la longueur de son contenu, ce qui est requis par la ressource demandee.",
      "412": "Le serveur ne repond pas a l'une des preconditions que le demandeur a mises sur la requete.",
      "413": "La requete est plus grande que ce que le serveur est pret ou capable de traiter.",
      "414": "L'URI fourni etait trop long pour que le serveur le traite.",
      "415": "L'entite de requete a un type de media que le serveur ou la ressource ne prend pas en charge.",
      "416": "Le client a demande une partie du fichier, mais le serveur ne peut pas fournir cette partie.",
      "417": "Le serveur ne peut pas repondre aux exigences du champ Expect de l'en-tete de requete."
    }
  },
  "de": {
    "description": {
      "410": "Die angeforderte Ressource ist nicht mehr verfugbar und wird nicht mehr verfugbar sein.",
      "411": "Die Anfrage hat die Lange ihres Inhalts nicht angegeben, was von der angeforderten Ressource erforderlich ist.",
      "412": "Der Server erfullt eine der Vorbedingungen nicht, die der Anfragende an die Anfrage gestellt hat.",
      "413": "Die Anfrage ist groser als der Server bereit oder in der Lage ist zu verarbeiten.",
      "414": "Die bereitgestellte URI war zu lang, um vom Server verarbeitet zu werden.",
      "415": "Die Anfrageentitat hat einen Medientyp, den der Server oder die Ressource nicht unterstutzt.",
      "416": "Der Client hat nach einem Teil der Datei gefragt, aber der Server kann diesen Teil nicht liefern.",
      "417": "Der Server kann die Anforderungen des Expect-Anfrage-Header-Felds nicht erfullen."
    }
  },
  "it": {
    "description": {
      "410": "La risorsa richiesta non e piu disponibile e non sara piu disponibile.",
      "411": "La richiesta non ha specificato la lunghezza del suo contenuto, che e richiesta dalla risorsa richiesta.",
      "412": "Il server non soddisfa una delle precondizioni che il richiedente ha posto sulla richiesta.",
      "413": "La richiesta e piu grande di quanto il server sia disposto o in grado di elaborare.",
      "414": "L'URI fornito era troppo lungo per essere elaborato dal server.",
      "415": "L'entita della richiesta ha un tipo di supporto che il server o la risorsa non supporta.",
      "416": "Il client ha chiesto una porzione del file, ma il server non puo fornire quella porzione.",
      "417": "Il server non puo soddisfare i requisiti del campo Expect dell'intestazione della richiesta."
    }
  },
  "ja": {
    "description": {
      "410": "要求されたリソースは利用できなくなり、今後も利用できません。",
      "411": "リクエストはコンテンツの長さを指定していませんでしたが、これは要求されたリソースで必要です。",
      "412": "サーバーは、リクエスターがリクエストに設定した前提条件の1つを満たしていません。",
      "413": "リクエストは、サーバーが処理する意思があるか、処理できるサイズよりも大きいです。",
      "414": "提供されたURIが長すぎて、サーバーが処理できませんでした。",
      "415": "リクエストエンティティには、サーバーまたはリソースがサポートしていないメディアタイプがあります。",
      "416": "クライアントはファイルの一部を要求しましたが、サーバーはその部分を提供できません。",
      "417": "サーバーは、Expectリクエストヘッダーフィールドの要件を満たすことができません。"
    }
  },
  "ko": {
    "description": {
      "410": "요청된 리소스가 더 이상 사용할 수 없으며 다시 사용할 수 없습니다.",
      "411": "요청이 콘텐츠 길이를 지정하지 않았으며, 이는 요청된 리소스에 필요합니다.",
      "412": "서버가 요청자가 요청에 설정한 전제 조건 중 하나를 충족하지 않습니다.",
      "413": "요청이 서버가 처리하려고 하거나 처리할 수 있는 것보다 큽니다.",
      "414": "제공된 URI가 너무 길어 서버가 처리할 수 없었습니다.",
      "415": "요청 엔터티에 서버 또는 리소스가 지원하지 않는 미디어 유형이 있습니다.",
      "416": "클라이언트가 파일의 일부를 요청했지만 서버가 해당 부분을 제공할 수 없습니다.",
      "417": "서버가 Expect 요청 헤더 필드의 요구 사항을 충족할 수 없습니다."
    }
  },
  "ru": {
    "description": {
      "410": "Запрошенный ресурс больше недоступен и больше не будет доступен.",
      "411": "Запрос не указал длину своего содержимого, что требуется запрошенным ресурсом.",
      "412": "Сервер не соответствует одному из предварительных условий, которые запрашивающая сторона установила для запроса.",
      "413": "Запрос больше, чем сервер готов или способен обработать.",
      "414": "Предоставленный URI был слишком длинным для обработки сервером.",
      "415": "Сущность запроса имеет тип медиа, который сервер или ресурс не поддерживает.",
      "416": "Клиент запросил часть файла, но сервер не может предоставить эту часть.",
      "417": "Сервер не может соответствовать требованиям поля Expect заголовка запроса."
    }
  },
  "pt": {
    "description": {
      "410": "O recurso solicitado nao esta mais disponivel e nao estara mais disponivel.",
      "411": "A solicitacao nao especificou o comprimento de seu conteudo, que e exigido pelo recurso solicitado.",
      "412": "O servidor nao atende a uma das pre-condicoes que o solicitante colocou na solicitacao.",
      "413": "A solicitacao e maior do que o servidor esta disposto ou e capaz de processar.",
      "414": "O URI fornecido era muito longo para o servidor processar.",
      "415": "A entidade da solicitacao tem um tipo de midia que o servidor ou recurso nao suporta.",
      "416": "O cliente pediu uma porcao do arquivo, mas o servidor nao pode fornecer essa porcao.",
      "417": "O servidor nao pode atender aos requisitos do campo Expect do cabecalho da solicitacao."
    }
  },
  "ar": {
    "description": {
      "410": "المورد المطلوب لم يعد متاحًا ولن يكون متاحًا مرة أخرى.",
      "411": "لم يحدد الطلب طول محتواه، وهو مطلوب من المورد المطلوب.",
      "412": "الخادم لا يلبي أحد الشروط المسبقة التي وضعها المستعلم على الطلب.",
      "413": "الطلب أكبر مما يرغب الخادم أو قادر على معالجته.",
      "414": "كان URI المقدم طويلًا جدًا للخادم لمعالجته.",
      "415": "كيان الطلب له نوع وسائط لا يدعمه الخادم أو المورد.",
      "416": "طلب العميل جزءًا من الملف، لكن الخادم لا يمكنه توفير ذلك الجزء.",
      "417": "لا يمكن للخادم تلبية متطلبات حقل Expect لرأس الطلب."
    }
  },
  "hi": {
    "description": {
      "410": "अनुरोधित संसाधन अब उपलब्ध नहीं है और फिर से उपलब्ध नहीं होगा।",
      "411": "अनुरोध ने अपनी सामग्री की लंबाई निर्दिष्ट नहीं की, जो अनुरोधित संसाधन द्वारा आवश्यक है।",
      "412": "सर्वर उन पूर्व शर्तों में से एक को पूरा नहीं करता है जो अनुरोधकर्ता ने अनुरोध पर रखी थीं।",
      "413": "अनुरोध सर्वर द्वारा संसाधित करने के लिए तैयार या सक्षम से अधिक बड़ा है।",
      "414": "प्रदान किया गया URI सर्वर द्वारा संसाधित करने के लिए बहुत लंबा था।",
      "415": "अनुरोध इकाई में एक मीडिया प्रकार है जिसे सर्वर या संसाधन समर्थन नहीं करता है।",
      "416": "क्लाइंट ने फ़ाइल के एक हिस्से के लिए पूछा है, लेकिन सर्वर उस हिस्से को आपूर्ति नहीं कर सकता है।",
      "417": "सर्वर अनुरोध हेडर फ़ील्ड Expect की आवश्यकताओं को पूरा नहीं कर सकता है।"
    }
  },
  "tr": {
    "description": {
      "410": "Istek edilen kaynak artik kullanilabilir degil ve tekrar kullanilabilir olmayacak.",
      "411": "Istek, içeriginin uzunlugunu belirtmedi, bu da istenen kaynak tarafindan gereklidir.",
      "412": "Sunucu, istek sahibinin istege koydugu ön kosullardan birini karsilamiyor.",
      "413": "Istek, sunucunun islemeye hazir oldugu veya isleyebilecegi boyuttan daha büyüktür.",
      "414": "Saglanan URI sunucunun islemesi için çok uzundu.",
      "415": "Istek varliginin sunucu veya kaynak tarafindan desteklenmeyen bir medya türü var.",
      "416": "Istemci dosyanin bir kismini istedi, ancak sunucu bu kismi saglayamaz.",
      "417": "Sunucu, istek baslik alani Expect'in gereksinimlerini karsilayamaz."
    }
  },
  "nl": {
    "description": {
      "410": "De gevraagde bron is niet meer beschikbaar en zal niet meer beschikbaar zijn.",
      "411": "Het verzoek heeft de lengte van de inhoud niet opgegeven, wat vereist is door de gevraagde bron.",
      "412": "De server voldoet niet aan een van de voorwaarden die de aanvrager aan het verzoek heeft gesteld.",
      "413": "Het verzoek is groter dan de server bereid is of kan verwerken.",
      "414": "De verstrekte URI was te lang voor de server om te verwerken.",
      "415": "De verzoekentiteit heeft een mediatype dat de server of bron niet ondersteunt.",
      "416": "De client heeft om een deel van het bestand gevraagd, maar de server kan dat deel niet leveren.",
      "417": "De server kan niet voldoen aan de vereisten van het Expect-verzoekheaderveld."
    }
  },
  "sv": {
    "description": {
      "410": "Den begärda resursen är inte längre tillgänglig och kommer inte att vara tillgänglig igen.",
      "411": "Begäran specificerade inte längden på sitt innehåll, vilket krävs av den begärda resursen.",
      "412": "Servern uppfyller inte en av förutsättningarna som begäraren ställde på begäran.",
      "413": "Begäran är större än servern är villig eller kan bearbeta.",
      "414": "Den angivna URI:n var för lång för att servern skulle kunna bearbeta den.",
      "415": "Begäranenheten har en mediatyp som servern eller resursen inte stöder.",
      "416": "Klienten har bett om en del av filen, men servern kan inte leverera den delen.",
      "417": "Servern kan inte uppfylla kraven för Expect-begäranhuvudfältet."
    }
  },
  "pl": {
    "description": {
      "410": "Zadany zasob nie jest juz dostepny i nie bedzie juz dostepny.",
      "411": "Zadanie nie okreslilo dlugosci swojej tresci, co jest wymagane przez zadany zasob.",
      "412": "Serwer nie spelnia jednego z warunkow wstepnych, które zglaszajacy ustawil na zadaniu.",
      "413": "Zadanie jest wieksze niz serwer jest gotowy lub zdolny przetworzyc.",
      "414": "Podany URI byl zbyt dlugi, aby serwer mogl go przetworzyc.",
      "415": "Jednostka zadania ma typ mediow, którego serwer lub zasob nie obsługuje.",
      "416": "Klient poprosil o czesc pliku, ale serwer nie moze dostarczyc tej czesci.",
      "417": "Serwer nie moze spelnic wymagan pola naglowka zadania Expect."
    }
  },
  "vi": {
    "description": {
      "410": "Tài nguyên được yêu cầu không còn khả dụng và sẽ không khả dụng nữa.",
      "411": "Yêu cầu không chỉ định độ dài nội dung của nó, điều này được yêu cầu bởi tài nguyên được yêu cầu.",
      "412": "Máy chủ không đáp ứng một trong các điều kiện tiên quyết mà người yêu cầu đặt trên yêu cầu.",
      "413": "Yêu cầu lớn hơn mức máy chủ sẵn sàng hoặc có thể xử lý.",
      "414": "URI được cung cấp quá dài để máy chủ xử lý.",
      "415": "Thực thể yêu cầu có loại phương tiện mà máy chủ hoặc tài nguyên không hỗ trợ.",
      "416": "Máy khách đã yêu cầu một phần của tệp, nhưng máy chủ không thể cung cấp phần đó.",
      "417": "Máy chủ không thể đáp ứng các yêu cầu của trường tiêu đề yêu cầu Expect."
    }
  },
  "th": {
    "description": {
      "410": "ทรัพยากรที่ร้องขอไม่สามารถใช้ได้อีกต่อไปและจะไม่สามารถใช้ได้อีก",
      "411": "คำขอไม่ได้ระบุความยาวของเนื้อหา ซึ่งจำเป็นสำหรับทรัพยากรที่ร้องขอ",
      "412": "เซิร์ฟเวอร์ไม่เป็นไปตามเงื่อนไขเบื้องต้นข้อใดข้อหนึ่งที่ผู้ร้องขอกำหนดไว้ในคำขอ",
      "413": "คำขอมีขนาดใหญ่กว่าเซิร์ฟเวอร์ที่ยินดีหรือสามารถประมวลผลได้",
      "414": "URI ที่ให้มามีความยาวเกินไปสำหรับเซิร์ฟเวอร์ที่จะประมวลผล",
      "415": "เอนทิตีของคำขอมีประเภทสื่อที่เซิร์ฟเวอร์หรือทรัพยากรไม่รองรับ",
      "416": "ไคลเอนต์ได้ขอส่วนหนึ่งของไฟล์ แต่เซิร์ฟเวอร์ไม่สามารถจัดหาส่วนนั้นได้",
      "417": "เซิร์ฟเวอร์ไม่สามารถเป็นไปตามข้อกำหนดของฟิลด์ส่วนหัวคำขอ Expect"
    }
  },
  "id": {
    "description": {
      "410": "Sumber daya yang diminta tidak lagi tersedia dan tidak akan tersedia lagi.",
      "411": "Permintaan tidak menentukan panjang kontennya, yang diperlukan oleh sumber daya yang diminta.",
      "412": "Server tidak memenuhi salah satu prasyarat yang ditetapkan pemohon pada permintaan.",
      "413": "Permintaan lebih besar daripada yang bersedia atau mampu diproses oleh server.",
      "414": "URI yang diberikan terlalu panjang untuk diproses oleh server.",
      "415": "Entitas permintaan memiliki jenis media yang tidak didukung oleh server atau sumber daya.",
      "416": "Klien telah meminta sebagian file, tetapi server tidak dapat menyediakan bagian tersebut.",
      "417": "Server tidak dapat memenuhi persyaratan bidang header permintaan Expect."
    }
  },
  "he": {
    "description": {
      "410": "המשאב המבוקש אינו זמין עוד ולא יהיה זמין שוב.",
      "411": "הבקשה לא ציינה את אורך התוכן שלה, הנדרש על ידי המשאב המבוקש.",
      "412": "השרת לא עומד באחד מתנאי הקדם שהמבקש הציב על הבקשה.",
      "413": "הבקשה גדולה יותר ממה שהשרת מוכן או מסוגל לעבד.",
      "414": "ה-URI שסופק היה ארוך מדי לשרת לעבד.",
      "415": "ישות הבקשה כוללת סוג מדיה שהשרת או המשאב אינם תומכים בו.",
      "416": "הלקוח ביקש חלק מהקובץ, אך השרת לא יכול לספק את החלק הזה.",
      "417": "השרת לא יכול לעמוד בדרישות שדה כותרת הבקשה Expect."
    }
  },
  "ms": {
    "description": {
      "410": "Sumber yang diminta tidak lagi tersedia dan tidak akan tersedia lagi.",
      "411": "Permintaan tidak menentukan panjang kandungannya, yang diperlukan oleh sumber yang diminta.",
      "412": "Pelayan tidak memenuhi salah satu prasyarat yang ditetapkan pemohon pada permintaan.",
      "413": "Permintaan lebih besar daripada yang pelayan sanggup atau mampu memproses.",
      "414": "URI yang diberikan terlalu panjang untuk pelayan memproses.",
      "415": "Entiti permintaan mempunyai jenis media yang tidak disokong oleh pelayan atau sumber.",
      "416": "Klien telah meminta sebahagian fail, tetapi pelayan tidak dapat membekalkan bahagian tersebut.",
      "417": "Pelayan tidak dapat memenuhi keperluan medan pengepala permintaan Expect."
    }
  },
  "no": {
    "description": {
      "410": "Den forespurte ressursen er ikke lenger tilgjengelig og vil ikke være tilgjengelig igjen.",
      "411": "Forespørselen spesifiserte ikke lengden på innholdet, som kreves av den forespurte ressursen.",
      "412": "Serveren oppfyller ikke en av forutsetningene som forespøreren satte på forespørselen.",
      "413": "Forespørselen er større enn serveren er villig til eller i stand til å behandle.",
      "414": "Den oppgitte URI-en var for lang for serveren å behandle.",
      "415": "Foresporselsentiteten har en medietype som serveren eller ressursen ikke støtter.",
      "416": "Klienten har bedt om en del av filen, men serveren kan ikke levere den delen.",
      "417": "Serveren kan ikke oppfylle kravene til Expect-foresporselshodefeltet."
    }
  }
}
</i18n>
