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
      "400": "The server cannot or will not process the request due to an apparent client error.",
      "401": "Authentication is required and has failed or has not yet been provided.",
      "403": "The request was valid, but the server is refusing action.",
      "404": "The requested resource could not be found but may be available in the future.",
      "405": "A request method is not supported for the requested resource.",
      "406": "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.",
      "408": "The server timed out waiting for the request.",
      "409": "The request could not be processed because of conflict in the request."
    }
  },
  "zh": {
    "description": {
      "400": "由于明显的客户端错误，服务器无法或不会处理请求。",
      "401": "需要身份验证，但已失败或尚未提供。",
      "403": "请求有效，但服务器拒绝执行操作。",
      "404": "找不到请求的资源，但将来可能可用。",
      "405": "请求的资源不支持该请求方法。",
      "406": "请求的资源只能生成根据请求中发送的 Accept 头不可接受的内容。",
      "408": "服务器等待请求超时。",
      "409": "由于请求中的冲突，无法处理请求。"
    }
  },
  "zh-CN": {
    "description": {
      "400": "由于明显的客户端错误，服务器无法或不会处理请求。",
      "401": "需要身份验证，但已失败或尚未提供。",
      "403": "请求有效，但服务器拒绝执行操作。",
      "404": "找不到请求的资源，但将来可能可用。",
      "405": "请求的资源不支持该请求方法。",
      "406": "请求的资源只能生成根据请求中发送的 Accept 头不可接受的内容。",
      "408": "服务器等待请求超时。",
      "409": "由于请求中的冲突，无法处理请求。"
    }
  },
  "zh-TW": {
    "description": {
      "400": "由於明顯的用戶端錯誤，伺服器無法或不會處理請求。",
      "401": "需要身份驗證，但已失敗或尚未提供。",
      "403": "請求有效，但伺服器拒絕執行操作。",
      "404": "找不到請求的資源，但將來可能可用。",
      "405": "請求的資源不支持該請求方法。",
      "406": "請求的資源只能生成根據請求中發送的 Accept 標頭不可接受的內容。",
      "408": "伺服器等待請求超時。",
      "409": "由於請求中的衝突，無法處理請求。"
    }
  },
  "zh-HK": {
    "description": {
      "400": "由於明顯的客戶端錯誤，伺服器無法或不會處理請求。",
      "401": "需要身份驗證，但已失敗或尚未提供。",
      "403": "請求有效，但伺服器拒絕執行操作。",
      "404": "找不到請求的資源，但將來可能可用。",
      "405": "請求的資源不支持該請求方法。",
      "406": "請求的資源只能生成根據請求中發送的 Accept 標頭不可接受的內容。",
      "408": "伺服器等待請求超時。",
      "409": "由於請求中的衝突，無法處理請求。"
    }
  },
  "es": {
    "description": {
      "400": "El servidor no puede o no procesara la solicitud debido a un error aparente del cliente.",
      "401": "Se requiere autenticacion y ha fallado o aun no se ha proporcionado.",
      "403": "La solicitud era valida, pero el servidor se niega a realizar la accion.",
      "404": "No se pudo encontrar el recurso solicitado, pero puede estar disponible en el futuro.",
      "405": "Un metodo de solicitud no es compatible con el recurso solicitado.",
      "406": "El recurso solicitado solo es capaz de generar contenido no aceptable segun los encabezados Accept enviados en la solicitud.",
      "408": "El servidor agoto el tiempo de espera de la solicitud.",
      "409": "La solicitud no se pudo procesar debido a un conflicto en la solicitud."
    }
  },
  "fr": {
    "description": {
      "400": "Le serveur ne peut pas ou ne traitera pas la requete en raison d'une erreur apparente du client.",
      "401": "L'authentification est requise et a echoue ou n'a pas encore ete fournie.",
      "403": "La requete etait valide, mais le serveur refuse d'agir.",
      "404": "La ressource demandee n'a pas pu etre trouvee mais pourrait etre disponible a l'avenir.",
      "405": "Une methode de requete n'est pas prise en charge pour la ressource demandee.",
      "406": "La ressource demandee est capable de generer uniquement du contenu non acceptable selon les en-tetes Accept envoyes dans la requete.",
      "408": "Le serveur a depasse le delai d'attente de la requete.",
      "409": "La requete n'a pas pu etre traitee en raison d'un conflit dans la requete."
    }
  },
  "de": {
    "description": {
      "400": "Der Server kann die Anfrage aufgrund eines offensichtlichen Client-Fehlers nicht oder wird sie nicht verarbeiten.",
      "401": "Authentifizierung ist erforderlich und fehlgeschlagen oder wurde noch nicht bereitgestellt.",
      "403": "Die Anfrage war gultig, aber der Server weigert sich zu handeln.",
      "404": "Die angeforderte Ressource konnte nicht gefunden werden, konnte aber in Zukunft verfugbar sein.",
      "405": "Eine Anfragemethode wird fur die angeforderte Ressource nicht unterstutzt.",
      "406": "Die angeforderte Ressource kann nur Inhalte generieren, die nach den in der Anfrage gesendeten Accept-Headern nicht akzeptabel sind.",
      "408": "Der Server hat beim Warten auf die Anfrage eine Zeituberschreitung erreicht.",
      "409": "Die Anfrage konnte aufgrund eines Konflikts in der Anfrage nicht verarbeitet werden."
    }
  },
  "it": {
    "description": {
      "400": "Il server non puo o non elaborera la richiesta a causa di un evidente errore del client.",
      "401": "L'autenticazione e richiesta e e fallita o non e ancora stata fornita.",
      "403": "La richiesta era valida, ma il server rifiuta di agire.",
      "404": "La risorsa richiesta non e stata trovata ma potrebbe essere disponibile in futuro.",
      "405": "Un metodo di richiesta non e supportato per la risorsa richiesta.",
      "406": "La risorsa richiesta e in grado di generare solo contenuti non accettabili secondo le intestazioni Accept inviate nella richiesta.",
      "408": "Il server ha raggiunto il timeout in attesa della richiesta.",
      "409": "La richiesta non poteva essere elaborata a causa di un conflitto nella richiesta."
    }
  },
  "ja": {
    "description": {
      "400": "明らかなクライアントエラーのため、サーバーはリクエストを処理できません。",
      "401": "認証が必要ですが、失敗したか、まだ提供されていません。",
      "403": "リクエストは有効でしたが、サーバーはアクションを拒否しています。",
      "404": "要求されたリソースが見つかりませんでしたが、将来利用可能になる可能性があります。",
      "405": "要求されたリソースでは、リクエストメソッドがサポートされていません。",
      "406": "要求されたリソースは、リクエストで送信されたAcceptヘッダーに従って受け入れられないコンテンツのみを生成できます。",
      "408": "サーバーはリクエストの待機中にタイムアウトしました。",
      "409": "リクエスト内の競合により、リクエストを処理できませんでした。"
    }
  },
  "ko": {
    "description": {
      "400": "명백한 클라이언트 오류로 인해 서버가 요청을 처리할 수 없거나 처리하지 않습니다.",
      "401": "인증이 필요하며 실패했거나 아직 제공되지 않았습니다.",
      "403": "요청이 유효했지만 서버가 작업을 거부하고 있습니다.",
      "404": "요청된 리소스를 찾을 수 없지만 나중에 사용할 수 있을 수 있습니다.",
      "405": "요청된 리소스에 대해 요청 메서드가 지원되지 않습니다.",
      "406": "요청된 리소스는 요청에서 보낸 Accept 헤더에 따라 허용되지 않는 콘텐츠만 생성할 수 있습니다.",
      "408": "서버가 요청 대기 중 시간 초과되었습니다.",
      "409": "요청의 충돌로 인해 요청을 처리할 수 없었습니다."
    }
  },
  "ru": {
    "description": {
      "400": "Сервер не может или не будет обрабатывать запрос из-за очевидной ошибки клиента.",
      "401": "Требуется аутентификация, и она не удалась или еще не предоставлена.",
      "403": "Запрос был действительным, но сервер отказывается выполнять действие.",
      "404": "Запрошенный ресурс не найден, но может быть доступен в будущем.",
      "405": "Метод запроса не поддерживается для запрошенного ресурса.",
      "406": "Запрошенный ресурс способен генерировать только содержимое, неприемлемое согласно заголовкам Accept, отправленным в запросе.",
      "408": "Сервер превысил время ожидания запроса.",
      "409": "Запрос не мог быть обработан из-за конфликта в запросе."
    }
  },
  "pt": {
    "description": {
      "400": "O servidor nao pode ou nao processara a solicitacao devido a um erro aparente do cliente.",
      "401": "A autenticacao e necessaria e falhou ou ainda nao foi fornecida.",
      "403": "A solicitacao era valida, mas o servidor esta recusando a acao.",
      "404": "O recurso solicitado nao foi encontrado, mas pode estar disponivel no futuro.",
      "405": "Um metodo de solicitacao nao e suportado para o recurso solicitado.",
      "406": "O recurso solicitado e capaz de gerar apenas conteudo nao aceitavel de acordo com os cabecalhos Accept enviados na solicitacao.",
      "408": "O servidor atingiu o tempo limite aguardando a solicitacao.",
      "409": "A solicitacao nao pôde ser processada devido a um conflito na solicitacao."
    }
  },
  "ar": {
    "description": {
      "400": "لا يمكن للخادم أو لن يعالج الطلب بسبب خطأ واضح من العميل.",
      "401": "المصادقة مطلوبة وفشلت أو لم يتم توفيرها بعد.",
      "403": "الطلب كان صالحًا، لكن الخادم يرفض الإجراء.",
      "404": "لم يتم العثور على المورد المطلوب لكن قد يكون متاحًا في المستقبل.",
      "405": "طريقة الطلب غير مدعومة للمورد المطلوب.",
      "406": "المورد المطلوب قادر على توليد محتوى غير مقبول فقط وفقًا لرؤوس Accept المرسلة في الطلب.",
      "408": "انتهت مهلة الخادم في انتظار الطلب.",
      "409": "لا يمكن معالجة الطلب بسبب تعارض في الطلب."
    }
  },
  "hi": {
    "description": {
      "400": "स्पष्ट क्लाइंट त्रुटि के कारण सर्वर अनुरोध को संसाधित नहीं कर सकता या नहीं करेगा।",
      "401": "प्रमाणीकरण आवश्यक है और विफल हो गया है या अभी तक प्रदान नहीं किया गया है।",
      "403": "अनुरोध वैध था, लेकिन सर्वर कार्रवाई से इनकार कर रहा है।",
      "404": "अनुरोधित संसाधन नहीं मिला लेकिन भविष्य में उपलब्ध हो सकता है।",
      "405": "अनुरोधित संसाधन के लिए अनुरोध विधि समर्थित नहीं है।",
      "406": "अनुरोधित संसाधन केवल उस सामग्री को उत्पन्न करने में सक्षम है जो अनुरोध में भेजे गए Accept हेडर के अनुसार स्वीकार्य नहीं है।",
      "408": "सर्वर ने अनुरोध की प्रतीक्षा करते समय समय सीमा समाप्त कर दी।",
      "409": "अनुरोध में संघर्ष के कारण अनुरोध को संसाधित नहीं किया जा सका।"
    }
  },
  "tr": {
    "description": {
      "400": "Sunucu, belirgin bir istemci hatasi nedeniyle istegi isleyemez veya islemeyecektir.",
      "401": "Kimlik dogrulama gereklidir ve basarisiz oldu veya henüz saglanmadi.",
      "403": "Istek geçerliydi, ancak sunucu eylemi reddediyor.",
      "404": "Istek edilen kaynak bulunamadi ancak gelecekte kullanilabilir olabilir.",
      "405": "Istek edilen kaynak için bir istek yöntemi desteklenmiyor.",
      "406": "Istek edilen kaynak, istekte gönderilen Accept basliklarina göre kabul edilemez içerik üretebilir.",
      "408": "Sunucu istegi beklerken zaman asimina ugradi.",
      "409": "Istekteki bir çakisma nedeniyle istek islenemedi."
    }
  },
  "nl": {
    "description": {
      "400": "De server kan het verzoek niet of zal het niet verwerken vanwege een duidelijk clientfout.",
      "401": "Authenticatie is vereist en is mislukt of nog niet verstrekt.",
      "403": "Het verzoek was geldig, maar de server weigert actie te ondernemen.",
      "404": "De gevraagde bron kon niet worden gevonden maar kan in de toekomst beschikbaar zijn.",
      "405": "Een verzoekmethode wordt niet ondersteund voor de gevraagde bron.",
      "406": "De gevraagde bron kan alleen inhoud genereren die niet acceptabel is volgens de Accept-headers die in het verzoek zijn verzonden.",
      "408": "De server heeft een time-out bereikt tijdens het wachten op het verzoek.",
      "409": "Het verzoek kon niet worden verwerkt vanwege een conflict in het verzoek."
    }
  },
  "sv": {
    "description": {
      "400": "Servern kan inte eller kommer inte att bearbeta begäran på grund av ett uppenbart klientfel.",
      "401": "Autentisering krävs och har misslyckats eller har inte ännu tillhandahållits.",
      "403": "Begäran var giltig, men servern vägrar att agera.",
      "404": "Den begärda resursen kunde inte hittas men kan vara tillgänglig i framtiden.",
      "405": "En begäranmetod stöds inte för den begärda resursen.",
      "406": "Den begärda resursen kan endast generera innehåll som inte är acceptabelt enligt Accept-huvudena som skickades i begäran.",
      "408": "Servern nådde timeout medan den väntade på begäran.",
      "409": "Begäran kunde inte bearbetas på grund av en konflikt i begäran."
    }
  },
  "pl": {
    "description": {
      "400": "Serwer nie moze lub nie bedzie przetwarzac zadania z powodu oczywistego bledu klienta.",
      "401": "Uwierzytelnianie jest wymagane i nie powiodlo sie lub nie zostalo jeszcze dostarczone.",
      "403": "Zadanie bylo wazne, ale serwer odmawia dzialania.",
      "404": "Nie mozna znalezc zadanego zasobu, ale moze byc dostepny w przyszlosci.",
      "405": "Metoda zadania nie jest obsługiwana dla zadanego zasobu.",
      "406": "Zadany zasob jest w stanie generowac tylko tresc nieakceptowalna zgodnie z naglowkami Accept wyslanymi w zadaniu.",
      "408": "Serwer osiagnal limit czasu podczas oczekiwania na zadanie.",
      "409": "Nie mozna przetworzyc zadania z powodu konfliktu w zadaniu."
    }
  },
  "vi": {
    "description": {
      "400": "Máy chủ không thể hoặc sẽ không xử lý yêu cầu do lỗi rõ ràng của máy khách.",
      "401": "Xác thực là bắt buộc và đã thất bại hoặc chưa được cung cấp.",
      "403": "Yêu cầu hợp lệ, nhưng máy chủ từ chối thực hiện hành động.",
      "404": "Không tìm thấy tài nguyên được yêu cầu nhưng có thể có sẵn trong tương lai.",
      "405": "Phương thức yêu cầu không được hỗ trợ cho tài nguyên được yêu cầu.",
      "406": "Tài nguyên được yêu cầu chỉ có thể tạo nội dung không chấp nhận được theo các tiêu đề Accept được gửi trong yêu cầu.",
      "408": "Máy chủ đã hết thời gian chờ yêu cầu.",
      "409": "Không thể xử lý yêu cầu do xung đột trong yêu cầu."
    }
  },
  "th": {
    "description": {
      "400": "เซิร์ฟเวอร์ไม่สามารถหรือจะไม่ประมวลผลคำขอเนื่องจากข้อผิดพลาดของไคลเอนต์ที่ชัดเจน",
      "401": "การรับรองความถูกต้องจำเป็นและล้มเหลวหรือยังไม่ได้รับ",
      "403": "คำขอถูกต้อง แต่เซิร์ฟเวอร์ปฏิเสธการดำเนินการ",
      "404": "ไม่พบทรัพยากรที่ร้องขอ แต่อาจมีให้ในอนาคต",
      "405": "วิธีการร้องขอไม่ได้รับการสนับสนุนสำหรับทรัพยากรที่ร้องขอ",
      "406": "ทรัพยากรที่ร้องขอสามารถสร้างเนื้อหาได้เฉพาะที่ไม่ยอมรับตามส่วนหัว Accept ที่ส่งในคำขอ",
      "408": "เซิร์ฟเวอร์หมดเวลารอคำขอ",
      "409": "ไม่สามารถประมวลผลคำขอได้เนื่องจากความขัดแย้งในคำขอ"
    }
  },
  "id": {
    "description": {
      "400": "Server tidak dapat atau tidak akan memproses permintaan karena kesalahan klien yang jelas.",
      "401": "Autentikasi diperlukan dan telah gagal atau belum disediakan.",
      "403": "Permintaan valid, tetapi server menolak untuk mengambil tindakan.",
      "404": "Sumber daya yang diminta tidak dapat ditemukan tetapi mungkin tersedia di masa depan.",
      "405": "Metode permintaan tidak didukung untuk sumber daya yang diminta.",
      "406": "Sumber daya yang diminta hanya mampu menghasilkan konten yang tidak dapat diterima menurut header Accept yang dikirim dalam permintaan.",
      "408": "Server mencapai batas waktu saat menunggu permintaan.",
      "409": "Permintaan tidak dapat diproses karena konflik dalam permintaan."
    }
  },
  "he": {
    "description": {
      "400": "השרת לא יכול או לא יעבד את הבקשה עקב שגיאת לקוח ברורה.",
      "401": "נדרש אימות ונכשל או עדיין לא סופק.",
      "403": "הבקשה הייתה תקפה, אך השרת מסרב לפעול.",
      "404": "לא ניתן למצוא את המשאב המבוקש אך הוא עשוי להיות זמין בעתיד.",
      "405": "שיטת בקשה אינה נתמכת עבור המשאב המבוקש.",
      "406": "המשאב המבוקש מסוגל ליצור רק תוכן שאינו מקובל לפי כותרות Accept שנשלחו בבקשה.",
      "408": "השרת הגיע לזמן קצוב בזמן שהמתין לבקשה.",
      "409": "לא ניתן היה לעבד את הבקשה עקב קונפליקט בבקשה."
    }
  },
  "ms": {
    "description": {
      "400": "Pelayan tidak boleh atau tidak akan memproses permintaan kerana ralat klien yang jelas.",
      "401": "Pengesahan diperlukan dan telah gagal atau belum disediakan.",
      "403": "Permintaan adalah sah, tetapi pelayan menolak untuk bertindak.",
      "404": "Sumber yang diminta tidak dapat ditemui tetapi mungkin tersedia pada masa hadapan.",
      "405": "Kaedah permintaan tidak disokong untuk sumber yang diminta.",
      "406": "Sumber yang diminta hanya mampu menjana kandungan yang tidak boleh diterima mengikut pengepala Accept yang dihantar dalam permintaan.",
      "408": "Pelayan mencapai masa tamat semasa menunggu permintaan.",
      "409": "Permintaan tidak dapat diproses kerana konflik dalam permintaan."
    }
  },
  "no": {
    "description": {
      "400": "Serveren kan ikke eller vil ikke behandle forespørselen på grunn av en åpenbar klientfeil.",
      "401": "Autentisering er påkrevd og har mislyktes eller har ikke blitt gitt ennå.",
      "403": "Forespørselen var gyldig, men serveren nekter å handle.",
      "404": "Den forespurte ressursen kunne ikke bli funnet, men kan være tilgjengelig i fremtiden.",
      "405": "En foresporselsmetode støttes ikke for den forespurte ressursen.",
      "406": "Den forespurte ressursen er bare i stand til å generere innhold som ikke er akseptabelt i henhold til Accept-hodene sendt i forespørselen.",
      "408": "Serveren nådde tidsavbrudd mens den ventet på forespørselen.",
      "409": "Forespørselen kunne ikke behandles på grunn av en konflikt i forespørselen."
    }
  }
}
</i18n>
