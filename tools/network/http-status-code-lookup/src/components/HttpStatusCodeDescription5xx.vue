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
      "500": "A generic error message, given when an unexpected condition was encountered.",
      "501": "The server either does not recognize the request method, or it lacks the ability to fulfill the request.",
      "502": "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
      "503": "The server is currently unavailable (because it is overloaded or down for maintenance).",
      "504": "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
      "505": "The server does not support the HTTP protocol version used in the request.",
      "506": "Transparent content negotiation for the request results in a circular reference.",
      "507": "The server is unable to store the representation needed to complete the request.",
      "508": "The server detected an infinite loop while processing the request.",
      "510": "Further extensions to the request are required for the server to fulfill it.",
      "511": "The client needs to authenticate to gain network access."
    }
  },
  "zh": {
    "description": {
      "500": "通用错误消息，在遇到意外情况时给出。",
      "501": "服务器无法识别请求方法，或缺乏满足请求的能力。",
      "502": "服务器充当网关或代理，并从上游服务器收到无效响应。",
      "503": "服务器当前不可用（因为过载或维护中）。",
      "504": "服务器充当网关或代理，但未从上游服务器收到及时响应。",
      "505": "服务器不支持请求中使用的 HTTP 协议版本。",
      "506": "请求的透明内容协商导致循环引用。",
      "507": "服务器无法存储完成请求所需的表示。",
      "508": "服务器在处理请求时检测到无限循环。",
      "510": "需要进一步扩展请求，服务器才能完成它。",
      "511": "客户端需要身份验证才能获得网络访问权限。"
    }
  },
  "zh-CN": {
    "description": {
      "500": "通用错误消息，在遇到意外情况时给出。",
      "501": "服务器无法识别请求方法，或缺乏满足请求的能力。",
      "502": "服务器充当网关或代理，并从上游服务器收到无效响应。",
      "503": "服务器当前不可用（因为过载或维护中）。",
      "504": "服务器充当网关或代理，但未从上游服务器收到及时响应。",
      "505": "服务器不支持请求中使用的 HTTP 协议版本。",
      "506": "请求的透明内容协商导致循环引用。",
      "507": "服务器无法存储完成请求所需的表示。",
      "508": "服务器在处理请求时检测到无限循环。",
      "510": "需要进一步扩展请求，服务器才能完成它。",
      "511": "客户端需要身份验证才能获得网络访问权限。"
    }
  },
  "zh-TW": {
    "description": {
      "500": "通用錯誤訊息，在遇到意外情況時給出。",
      "501": "伺服器無法識別請求方法，或缺乏滿足請求的能力。",
      "502": "伺服器充當閘道或代理，並從上游伺服器收到無效回應。",
      "503": "伺服器目前不可用（因為過載或維護中）。",
      "504": "伺服器充當閘道或代理，但未從上游伺服器收到及時回應。",
      "505": "伺服器不支持請求中使用的 HTTP 協議版本。",
      "506": "請求的透明內容協商導致循環引用。",
      "507": "伺服器無法儲存完成請求所需的表示。",
      "508": "伺服器在處理請求時檢測到無限循環。",
      "510": "需要進一步擴展請求，伺服器才能完成它。",
      "511": "用戶端需要身份驗證才能獲得網路訪問權限。"
    }
  },
  "zh-HK": {
    "description": {
      "500": "通用錯誤訊息，在遇到意外情況時給出。",
      "501": "伺服器無法識別請求方法，或缺乏滿足請求的能力。",
      "502": "伺服器充當閘道或代理，並從上游伺服器收到無效回應。",
      "503": "伺服器目前不可用（因為過載或維護中）。",
      "504": "伺服器充當閘道或代理，但未從上游伺服器收到及時回應。",
      "505": "伺服器不支持請求中使用的 HTTP 協議版本。",
      "506": "請求的透明內容協商導致循環引用。",
      "507": "伺服器無法儲存完成請求所需的表示。",
      "508": "伺服器在處理請求時檢測到無限循環。",
      "510": "需要進一步擴展請求，伺服器才能完成它。",
      "511": "客戶端需要身份驗證才能獲得網路訪問權限。"
    }
  },
  "es": {
    "description": {
      "500": "Un mensaje de error generico, dado cuando se encontro una condicion inesperada.",
      "501": "El servidor no reconoce el metodo de solicitud o carece de la capacidad para cumplir la solicitud.",
      "502": "El servidor estaba actuando como puerta de enlace o proxy y recibio una respuesta invalida del servidor ascendente.",
      "503": "El servidor no esta disponible actualmente (porque esta sobrecargado o en mantenimiento).",
      "504": "El servidor estaba actuando como puerta de enlace o proxy y no recibio una respuesta oportuna del servidor ascendente.",
      "505": "El servidor no soporta la version del protocolo HTTP utilizada en la solicitud.",
      "506": "La negociacion transparente de contenido para la solicitud resulta en una referencia circular.",
      "507": "El servidor no puede almacenar la representacion necesaria para completar la solicitud.",
      "508": "El servidor detecto un bucle infinito mientras procesaba la solicitud.",
      "510": "Se requieren extensiones adicionales a la solicitud para que el servidor la cumpla.",
      "511": "El cliente necesita autenticarse para obtener acceso a la red."
    }
  },
  "fr": {
    "description": {
      "500": "Un message d'erreur generique, donne lorsqu'une condition inattendue a ete rencontree.",
      "501": "Le serveur ne reconnait pas la methode de requete ou manque de la capacite de satisfaire la requete.",
      "502": "Le serveur agissait comme une passerelle ou un proxy et a recu une reponse invalide du serveur en amont.",
      "503": "Le serveur n'est actuellement pas disponible (car il est surcharge ou en maintenance).",
      "504": "Le serveur agissait comme une passerelle ou un proxy et n'a pas recu de reponse opportune du serveur en amont.",
      "505": "Le serveur ne prend pas en charge la version du protocole HTTP utilisee dans la requete.",
      "506": "La negociation transparente du contenu pour la requete aboutit a une reference circulaire.",
      "507": "Le serveur est incapable de stocker la representation necessaire pour completer la requete.",
      "508": "Le serveur a detecte une boucle infinie lors du traitement de la requete.",
      "510": "Des extensions supplementaires a la requete sont requises pour que le serveur la satisfasse.",
      "511": "Le client doit s'authentifier pour obtenir l'acces au reseau."
    }
  },
  "de": {
    "description": {
      "500": "Eine generische Fehlermeldung, die ausgegeben wird, wenn eine unerwartete Bedingung aufgetreten ist.",
      "501": "Der Server erkennt die Anfragemethode entweder nicht oder es fehlt ihm die Fahigkeit, die Anfrage zu erfullen.",
      "502": "Der Server fungierte als Gateway oder Proxy und erhielt eine ungultige Antwort vom Upstream-Server.",
      "503": "Der Server ist derzeit nicht verfugbar (weil er uberlastet ist oder zur Wartung ausgeschaltet ist).",
      "504": "Der Server fungierte als Gateway oder Proxy und erhielt keine rechtzeitige Antwort vom Upstream-Server.",
      "505": "Der Server unterstutzt die in der Anfrage verwendete HTTP-Protokollversion nicht.",
      "506": "Die transparente Inhaltsverhandlung fur die Anfrage fuhrt zu einer zirkularen Referenz.",
      "507": "Der Server kann die Darstellung nicht speichern, die zur Erfullung der Anfrage benotigt wird.",
      "508": "Der Server hat eine Endlosschleife beim Verarbeiten der Anfrage erkannt.",
      "510": "Weitere Erweiterungen der Anfrage sind erforderlich, damit der Server sie erfullen kann.",
      "511": "Der Client muss sich authentifizieren, um Netzwerkzugriff zu erhalten."
    }
  },
  "it": {
    "description": {
      "500": "Un messaggio di errore generico, dato quando e stata incontrata una condizione inaspettata.",
      "501": "Il server non riconosce il metodo di richiesta o manca della capacita di soddisfare la richiesta.",
      "502": "Il server stava agendo come gateway o proxy e ha ricevuto una risposta non valida dal server upstream.",
      "503": "Il server non e attualmente disponibile (perche e sovraccarico o in manutenzione).",
      "504": "Il server stava agendo come gateway o proxy e non ha ricevuto una risposta tempestiva dal server upstream.",
      "505": "Il server non supporta la versione del protocollo HTTP utilizzata nella richiesta.",
      "506": "La negoziazione trasparente del contenuto per la richiesta risulta in un riferimento circolare.",
      "507": "Il server e incapace di memorizzare la rappresentazione necessaria per completare la richiesta.",
      "508": "Il server ha rilevato un ciclo infinito durante l'elaborazione della richiesta.",
      "510": "Sono richieste ulteriori estensioni alla richiesta affinche il server la soddisfi.",
      "511": "Il client deve autenticarsi per ottenere l'accesso alla rete."
    }
  },
  "ja": {
    "description": {
      "500": "予期しない条件が発生したときに与えられる一般的なエラーメッセージ。",
      "501": "サーバーはリクエストメソッドを認識しないか、リクエストを満たす能力がありません。",
      "502": "サーバーはゲートウェイまたはプロキシとして機能し、アップストリームサーバーから無効な応答を受信しました。",
      "503": "サーバーは現在利用できません（過負荷またはメンテナンス中のため）。",
      "504": "サーバーはゲートウェイまたはプロキシとして機能していましたが、アップストリームサーバーからタイムリーな応答を受信しませんでした。",
      "505": "サーバーは、リクエストで使用されているHTTPプロトコルバージョンをサポートしていません。",
      "506": "リクエストの透過的なコンテンツネゴシエーションは、循環参照になります。",
      "507": "サーバーは、リクエストを完了するために必要な表現を保存できません。",
      "508": "サーバーは、リクエストの処理中に無限ループを検出しました。",
      "510": "サーバーがリクエストを満たすには、リクエストへのさらなる拡張が必要です。",
      "511": "クライアントはネットワークアクセスを取得するために認証する必要があります。"
    }
  },
  "ko": {
    "description": {
      "500": "예기치 않은 조건이 발생했을 때 제공되는 일반 오류 메시지입니다.",
      "501": "서버가 요청 메서드를 인식하지 못하거나 요청을 수행할 능력이 없습니다.",
      "502": "서버가 게이트웨이 또는 프록시로 작동했으며 업스트림 서버로부터 잘못된 응답을 받았습니다.",
      "503": "서버가 현재 사용할 수 없습니다(과부하 또는 유지 관리 중이기 때문).",
      "504": "서버가 게이트웨이 또는 프록시로 작동했지만 업스트림 서버로부터 적시에 응답을 받지 못했습니다.",
      "505": "서버가 요청에 사용된 HTTP 프로토콜 버전을 지원하지 않습니다.",
      "506": "요청에 대한 투명한 콘텐츠 협상이 순환 참조로 이어집니다.",
      "507": "서버가 요청을 완료하는 데 필요한 표현을 저장할 수 없습니다.",
      "508": "서버가 요청 처리 중 무한 루프를 감지했습니다.",
      "510": "서버가 요청을 수행하려면 요청에 대한 추가 확장이 필요합니다.",
      "511": "클라이언트가 네트워크 액세스를 얻으려면 인증해야 합니다."
    }
  },
  "ru": {
    "description": {
      "500": "Общее сообщение об ошибке, выдаваемое при возникновении неожиданного условия.",
      "501": "Сервер либо не распознает метод запроса, либо не имеет возможности выполнить запрос.",
      "502": "Сервер действовал как шлюз или прокси и получил неверный ответ от вышестоящего сервера.",
      "503": "Сервер в настоящее время недоступен (потому что он перегружен или находится на обслуживании).",
      "504": "Сервер действовал как шлюз или прокси и не получил своевременный ответ от вышестоящего сервера.",
      "505": "Сервер не поддерживает версию протокола HTTP, используемую в запросе.",
      "506": "Прозрачное согласование содержимого для запроса приводит к циклической ссылке.",
      "507": "Сервер не может сохранить представление, необходимое для завершения запроса.",
      "508": "Сервер обнаружил бесконечный цикл при обработке запроса.",
      "510": "Для выполнения запроса сервером требуются дальнейшие расширения запроса.",
      "511": "Клиенту необходимо пройти аутентификацию для получения доступа к сети."
    }
  },
  "pt": {
    "description": {
      "500": "Uma mensagem de erro generica, dada quando uma condicao inesperada foi encontrada.",
      "501": "O servidor nao reconhece o metodo de solicitacao ou carece da capacidade de atender a solicitacao.",
      "502": "O servidor estava atuando como um gateway ou proxy e recebeu uma resposta invalida do servidor upstream.",
      "503": "O servidor nao esta disponivel no momento (porque esta sobrecarregado ou em manutencao).",
      "504": "O servidor estava atuando como um gateway ou proxy e nao recebeu uma resposta oportuna do servidor upstream.",
      "505": "O servidor nao suporta a versao do protocolo HTTP usada na solicitacao.",
      "506": "A negociacao transparente de conteudo para a solicitacao resulta em uma referencia circular.",
      "507": "O servidor e incapaz de armazenar a representacao necessaria para completar a solicitacao.",
      "508": "O servidor detectou um loop infinito ao processar a solicitacao.",
      "510": "Sao necessarias extensoes adicionais a solicitacao para que o servidor a atenda.",
      "511": "O cliente precisa se autenticar para obter acesso a rede."
    }
  },
  "ar": {
    "description": {
      "500": "رسالة خطأ عامة، تُعطى عند مواجهة حالة غير متوقعة.",
      "501": "الخادم إما لا يتعرف على طريقة الطلب، أو يفتقر إلى القدرة على تنفيذ الطلب.",
      "502": "كان الخادم يعمل كبوابة أو وكيل وتلقى ردًا غير صالح من الخادم المنبع.",
      "503": "الخادم غير متاح حاليًا (لأنه مثقل أو متوقف للصيانة).",
      "504": "كان الخادم يعمل كبوابة أو وكيل ولم يتلق ردًا في الوقت المناسب من الخادم المنبع.",
      "505": "الخادم لا يدعم إصدار بروتوكول HTTP المستخدم في الطلب.",
      "506": "التفاوض الشفاف للمحتوى للطلب يؤدي إلى مرجع دائري.",
      "507": "الخادم غير قادر على تخزين التمثيل المطلوب لإكمال الطلب.",
      "508": "اكتشف الخادم حلقة لا نهائية أثناء معالجة الطلب.",
      "510": "مطلوب امتدادات إضافية للطلب حتى يتمكن الخادم من تنفيذه.",
      "511": "يحتاج العميل إلى المصادقة للحصول على وصول الشبكة."
    }
  },
  "hi": {
    "description": {
      "500": "एक सामान्य त्रुटि संदेश, जब एक अप्रत्याशित स्थिति का सामना किया गया था।",
      "501": "सर्वर या तो अनुरोध विधि को पहचानता नहीं है, या अनुरोध को पूरा करने की क्षमता की कमी है।",
      "502": "सर्वर गेटवे या प्रॉक्सी के रूप में कार्य कर रहा था और अपस्ट्रीम सर्वर से एक अमान्य प्रतिक्रिया प्राप्त की।",
      "503": "सर्वर वर्तमान में उपलब्ध नहीं है (क्योंकि यह अधिक लोड है या रखरखाव के लिए बंद है)।",
      "504": "सर्वर गेटवे या प्रॉक्सी के रूप में कार्य कर रहा था और अपस्ट्रीम सर्वर से समय पर प्रतिक्रिया प्राप्त नहीं की।",
      "505": "सर्वर अनुरोध में उपयोग किए गए HTTP प्रोटोकॉल संस्करण का समर्थन नहीं करता है।",
      "506": "अनुरोध के लिए पारदर्शी सामग्री वार्ता एक चक्रीय संदर्भ में परिणाम देती है।",
      "507": "सर्वर अनुरोध को पूरा करने के लिए आवश्यक प्रतिनिधित्व को संग्रहीत करने में असमर्थ है।",
      "508": "सर्वर ने अनुरोध को संसाधित करते समय एक अनंत लूप का पता लगाया।",
      "510": "सर्वर को इसे पूरा करने के लिए अनुरोध के लिए आगे के विस्तार की आवश्यकता है।",
      "511": "क्लाइंट को नेटवर्क एक्सेस प्राप्त करने के लिए प्रमाणित करने की आवश्यकता है।"
    }
  },
  "tr": {
    "description": {
      "500": "Beklenmeyen bir durumla karsilasildiginda verilen genel bir hata mesaji.",
      "501": "Sunucu istek yöntemini tanimiyor veya istegi yerine getirme yeteneginden yoksun.",
      "502": "Sunucu bir ağ geçidi veya proxy olarak çalisiyordu ve yukari akis sunucusundan geçersiz bir yanit aldi.",
      "503": "Sunucu su anda kullanilabilir degil (asiri yüklü oldugu veya bakim için kapali oldugu için).",
      "504": "Sunucu bir ağ geçidi veya proxy olarak çalisiyordu ve yukari akis sunucusundan zamaninda bir yanit aldi.",
      "505": "Sunucu istekte kullanilan HTTP protokol sürümünü desteklemiyor.",
      "506": "Istek için saydam içerik müzakere döngüsel bir referansla sonuçlanir.",
      "507": "Sunucu istegi tamamlamak için gereken temsili depolayamaz.",
      "508": "Sunucu istegi islerken sonsuz bir döngü tespit etti.",
      "510": "Sunucunun bunu yerine getirmesi için istege daha fazla uzanti gereklidir.",
      "511": "Istemcinin ağ erisimi kazanmak için kimlik dogrulamasi yapmasi gerekiyor."
    }
  },
  "nl": {
    "description": {
      "500": "Een generiek foutbericht, gegeven wanneer een onverwachte voorwaarde werd aangetroffen.",
      "501": "De server herkent de verzoekmethode niet of mist het vermogen om het verzoek te vervullen.",
      "502": "De server fungeerde als gateway of proxy en ontving een ongeldig antwoord van de upstream-server.",
      "503": "De server is momenteel niet beschikbaar (omdat deze overbelast is of voor onderhoud uitgeschakeld).",
      "504": "De server fungeerde als gateway of proxy en ontving geen tijdig antwoord van de upstream-server.",
      "505": "De server ondersteunt de HTTP-protocolversie die in het verzoek wordt gebruikt niet.",
      "506": "Transparante inhoudsonderhandeling voor het verzoek resulteert in een circulaire referentie.",
      "507": "De server kan de representatie die nodig is om het verzoek te voltooien niet opslaan.",
      "508": "De server heeft een oneindige lus gedetecteerd tijdens het verwerken van het verzoek.",
      "510": "Verdere uitbreidingen van het verzoek zijn vereist voor de server om het te vervullen.",
      "511": "De client moet zich authenticeren om netwerktoegang te krijgen."
    }
  },
  "sv": {
    "description": {
      "500": "Ett generiskt felmeddelande, ges när ett oväntat tillstånd påträffades.",
      "501": "Servern känner inte igen begäranmetoden eller saknar förmågan att uppfylla begäran.",
      "502": "Servern fungerade som en gateway eller proxy och fick ett ogiltigt svar från upstream-servern.",
      "503": "Servern är för närvarande inte tillgänglig (eftersom den är överbelastad eller nere för underhåll).",
      "504": "Servern fungerade som en gateway eller proxy och fick inte ett svar i tid från upstream-servern.",
      "505": "Servern stöder inte HTTP-protokollversionen som används i begäran.",
      "506": "Transparent innehållsförhandling för begäran resulterar i en cirkulär referens.",
      "507": "Servern kan inte lagra representationen som behövs för att slutföra begäran.",
      "508": "Servern upptäckte en oändlig loop medan den bearbetade begäran.",
      "510": "Ytterligare utökningar av begäran krävs för att servern ska kunna uppfylla den.",
      "511": "Klienten behöver autentisera sig för att få nätverksåtkomst."
    }
  },
  "pl": {
    "description": {
      "500": "Ogolny komunikat bledu, podany, gdy napotkano nieoczekiwany warunek.",
      "501": "Serwer nie rozpoznaje metody zadania lub brakuje mu zdolnosci do spelnienia zadania.",
      "502": "Serwer dzialal jako brama lub proxy i otrzymal nieprawidlowa odpowiedz z serwera upstream.",
      "503": "Serwer jest obecnie niedostepny (poniewaz jest przeciążony lub wylaczony do konserwacji).",
      "504": "Serwer dzialal jako brama lub proxy i nie otrzymal odpowiedniej odpowiedzi z serwera upstream.",
      "505": "Serwer nie obsługuje wersji protokolu HTTP uzywanej w zadaniu.",
      "506": "Przezroczyste negocjacje tresci dla zadania skutkuja cyklicznym odniesieniem.",
      "507": "Serwer nie jest w stanie przechowac reprezentacji potrzebnej do zakonczenia zadania.",
      "508": "Serwer wykryl nieskonczona petle podczas przetwarzania zadania.",
      "510": "Dalsze rozszerzenia zadania sa wymagane, aby serwer mogl je spelnic.",
      "511": "Klient musi sie uwierzytelnic, aby uzyskac dostep do sieci."
    }
  },
  "vi": {
    "description": {
      "500": "Thông báo lỗi chung, được đưa ra khi gặp phải điều kiện không mong đợi.",
      "501": "Máy chủ không nhận ra phương thức yêu cầu hoặc thiếu khả năng thực hiện yêu cầu.",
      "502": "Máy chủ đang hoạt động như một cổng hoặc proxy và nhận được phản hồi không hợp lệ từ máy chủ upstream.",
      "503": "Máy chủ hiện không khả dụng (vì quá tải hoặc đang bảo trì).",
      "504": "Máy chủ đang hoạt động như một cổng hoặc proxy và không nhận được phản hồi kịp thời từ máy chủ upstream.",
      "505": "Máy chủ không hỗ trợ phiên bản giao thức HTTP được sử dụng trong yêu cầu.",
      "506": "Thương lượng nội dung minh bạch cho yêu cầu dẫn đến tham chiếu vòng tròn.",
      "507": "Máy chủ không thể lưu trữ biểu diễn cần thiết để hoàn thành yêu cầu.",
      "508": "Máy chủ đã phát hiện một vòng lặp vô hạn trong khi xử lý yêu cầu.",
      "510": "Cần mở rộng thêm yêu cầu để máy chủ thực hiện nó.",
      "511": "Máy khách cần xác thực để có quyền truy cập mạng."
    }
  },
  "th": {
    "description": {
      "500": "ข้อความแสดงข้อผิดพลาดทั่วไป กำหนดเมื่อพบเงื่อนไขที่ไม่คาดคิด",
      "501": "เซิร์ฟเวอร์ไม่รู้จักวิธีการร้องขอ หรือขาดความสามารถในการปฏิบัติตามคำขอ",
      "502": "เซิร์ฟเวอร์ทำหน้าที่เป็นเกตเวย์หรือพร็อกซี่ และได้รับคำตอบที่ไม่ถูกต้องจากเซิร์ฟเวอร์ต้นทาง",
      "503": "เซิร์ฟเวอร์ไม่พร้อมใช้งานในขณะนี้ (เนื่องจากโอเวอร์โหลดหรือปิดเพื่อการบำรุงรักษา)",
      "504": "เซิร์ฟเวอร์ทำหน้าที่เป็นเกตเวย์หรือพร็อกซี่ และไม่ได้รับคำตอบทันเวลาจากเซิร์ฟเวอร์ต้นทาง",
      "505": "เซิร์ฟเวอร์ไม่รองรับเวอร์ชันโปรโตคอล HTTP ที่ใช้ในคำขอ",
      "506": "การเจรจาเนื้อหาอย่างโปร่งใสสำหรับคำขอส่งผลให้เกิดการอ้างอิงแบบวงกลม",
      "507": "เซิร์ฟเวอร์ไม่สามารถจัดเก็บการแสดงผลที่จำเป็นเพื่อทำให้คำขอสมบูรณ์",
      "508": "เซิร์ฟเวอร์ตรวจพบลูปไม่สิ้นสุดขณะประมวลผลคำขอ",
      "510": "ต้องมีการขยายคำขอเพิ่มเติมเพื่อให้เซิร์ฟเวอร์สามารถปฏิบัติตามได้",
      "511": "ไคลเอนต์ต้องรับรองความถูกต้องเพื่อให้ได้การเข้าถึงเครือข่าย"
    }
  },
  "id": {
    "description": {
      "500": "Pesan kesalahan generik, diberikan ketika kondisi yang tidak terduga ditemui.",
      "501": "Server tidak mengenali metode permintaan atau tidak memiliki kemampuan untuk memenuhi permintaan.",
      "502": "Server bertindak sebagai gateway atau proxy dan menerima respons yang tidak valid dari server upstream.",
      "503": "Server saat ini tidak tersedia (karena kelebihan beban atau sedang dalam pemeliharaan).",
      "504": "Server bertindak sebagai gateway atau proxy dan tidak menerima respons tepat waktu dari server upstream.",
      "505": "Server tidak mendukung versi protokol HTTP yang digunakan dalam permintaan.",
      "506": "Negosiasi konten transparan untuk permintaan menghasilkan referensi melingkar.",
      "507": "Server tidak dapat menyimpan representasi yang diperlukan untuk menyelesaikan permintaan.",
      "508": "Server mendeteksi loop tak terbatas saat memproses permintaan.",
      "510": "Ekstensi lebih lanjut ke permintaan diperlukan agar server dapat memenuhinya.",
      "511": "Klien perlu mengautentikasi untuk mendapatkan akses jaringan."
    }
  },
  "he": {
    "description": {
      "500": "הודעת שגיאה כללית, הניתנת כאשר נתקלו בתנאי בלתי צפוי.",
      "501": "השרת אינו מזהה את שיטת הבקשה או חסר לו היכולת למלא את הבקשה.",
      "502": "השרת פעל כשער או פרוקסי וקיבל תגובה לא תקפה מהשרת במעלה הזרם.",
      "503": "השרת אינו זמין כעת (מכיוון שהוא עמוס מדי או כבוי לתחזוקה).",
      "504": "השרת פעל כשער או פרוקסי ולא קיבל תגובה בזמן מהשרת במעלה הזרם.",
      "505": "השרת אינו תומך בגרסת פרוטוקול HTTP המשמשת בבקשה.",
      "506": "משא ומתן תוכן שקוף עבור הבקשה מביא להפנייה מעגלית.",
      "507": "השרת אינו מסוגל לאחסן את הייצוג הנדרש להשלמת הבקשה.",
      "508": "השרת זיהה לולאה אינסופית בעת עיבוד הבקשה.",
      "510": "נדרשות הרחבות נוספות לבקשה כדי שהשרת יוכל למלא אותה.",
      "511": "הלקוח צריך לאמת כדי לקבל גישה לרשת."
    }
  },
  "ms": {
    "description": {
      "500": "Mesej ralat generik, diberikan apabila keadaan yang tidak dijangka ditemui.",
      "501": "Pelayan tidak mengenali kaedah permintaan atau tidak mempunyai keupayaan untuk memenuhi permintaan.",
      "502": "Pelayan bertindak sebagai pintu masuk atau proksi dan menerima respons yang tidak sah daripada pelayan hulu.",
      "503": "Pelayan tidak tersedia pada masa ini (kerana terlebih muatan atau ditutup untuk penyelenggaraan).",
      "504": "Pelayan bertindak sebagai pintu masuk atau proksi dan tidak menerima respons tepat pada masanya daripada pelayan hulu.",
      "505": "Pelayan tidak menyokong versi protokol HTTP yang digunakan dalam permintaan.",
      "506": "Perundingan kandungan telus untuk permintaan mengakibatkan rujukan bulat.",
      "507": "Pelayan tidak dapat menyimpan perwakilan yang diperlukan untuk melengkapkan permintaan.",
      "508": "Pelayan mengesan gelung tak terhingga semasa memproses permintaan.",
      "510": "Sambungan lanjut kepada permintaan diperlukan untuk pelayan memenuhinya.",
      "511": "Klien perlu mengesahkan untuk mendapatkan akses rangkaian."
    }
  },
  "no": {
    "description": {
      "500": "En generisk feilmelding, gitt når en uventet tilstand ble påtruffet.",
      "501": "Serveren gjenkjenner enten ikke foresporselsmetoden eller mangler evnen til å oppfylle forespørselen.",
      "502": "Serveren fungerte som en gateway eller proxy og mottok et ugyldig svar fra upstream-serveren.",
      "503": "Serveren er for øyeblikket ikke tilgjengelig (fordi den er overbelastet eller nede for vedlikehold).",
      "504": "Serveren fungerte som en gateway eller proxy og mottok ikke et rettidig svar fra upstream-serveren.",
      "505": "Serveren støtter ikke HTTP-protokollversjonen som brukes i forespørselen.",
      "506": "Transparent innholdsforhandling for forespørselen resulterer i en sirkulær referanse.",
      "507": "Serveren er ikke i stand til å lagre representasjonen som trengs for å fullføre forespørselen.",
      "508": "Serveren oppdaget en uendelig løkke mens den behandlet forespørselen.",
      "510": "Ytterligere utvidelser til forespørselen er påkrevd for at serveren skal oppfylle den.",
      "511": "Klienten må autentisere seg for å få nettverkstilgang."
    }
  }
}
</i18n>
