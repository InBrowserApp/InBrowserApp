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
      "418": "This code was defined in 1998 as one of the traditional IETF April Fools jokes.",
      "422": "The request was well-formed but was unable to be followed due to semantic errors.",
      "425": "Indicates that the server is unwilling to risk processing a request that might be replayed.",
      "426": "The client should switch to a different protocol such as TLS/1.0.",
      "428": "The origin server requires the request to be conditional.",
      "429": "The user has sent too many requests in a given amount of time.",
      "431": "The server is unwilling to process the request because its header fields are too large.",
      "451": "The server is denying access to the resource as a consequence of a legal demand."
    }
  },
  "zh": {
    "description": {
      "418": "此代码在 1998 年定义为传统的 IETF 愚人节笑话之一。",
      "422": "请求格式正确，但由于语义错误而无法执行。",
      "425": "表示服务器不愿意冒险处理可能被重放的请求。",
      "426": "客户端应切换到不同的协议，例如 TLS/1.0。",
      "428": "源服务器要求请求是有条件的。",
      "429": "用户在给定时间内发送了太多请求。",
      "431": "服务器不愿意处理请求，因为其头字段太大。",
      "451": "由于法律要求，服务器拒绝访问资源。"
    }
  },
  "zh-CN": {
    "description": {
      "418": "此代码在 1998 年定义为传统的 IETF 愚人节笑话之一。",
      "422": "请求格式正确，但由于语义错误而无法执行。",
      "425": "表示服务器不愿意冒险处理可能被重放的请求。",
      "426": "客户端应切换到不同的协议，例如 TLS/1.0。",
      "428": "源服务器要求请求是有条件的。",
      "429": "用户在给定时间内发送了太多请求。",
      "431": "服务器不愿意处理请求，因为其头字段太大。",
      "451": "由于法律要求，服务器拒绝访问资源。"
    }
  },
  "zh-TW": {
    "description": {
      "418": "此代碼在 1998 年定義為傳統的 IETF 愚人節笑話之一。",
      "422": "請求格式正確，但由於語義錯誤而無法執行。",
      "425": "表示伺服器不願意冒險處理可能被重放的請求。",
      "426": "用戶端應切換到不同的協議，例如 TLS/1.0。",
      "428": "源伺服器要求請求是有條件的。",
      "429": "用戶在給定時間內發送了太多請求。",
      "431": "伺服器不願意處理請求，因為其標頭欄位太大。",
      "451": "由於法律要求，伺服器拒絕訪問資源。"
    }
  },
  "zh-HK": {
    "description": {
      "418": "此代碼在 1998 年定義為傳統的 IETF 愚人節笑話之一。",
      "422": "請求格式正確，但由於語義錯誤而無法執行。",
      "425": "表示伺服器不願意冒險處理可能被重放的請求。",
      "426": "客戶端應切換到不同的協議，例如 TLS/1.0。",
      "428": "源伺服器要求請求是有條件的。",
      "429": "用戶在給定時間內發送了太多請求。",
      "431": "伺服器不願意處理請求，因為其標頭欄位太大。",
      "451": "由於法律要求，伺服器拒絕訪問資源。"
    }
  },
  "es": {
    "description": {
      "418": "Este codigo fue definido en 1998 como una de las bromas tradicionales del Día de los Inocentes de IETF.",
      "422": "La solicitud estaba bien formada pero no se pudo seguir debido a errores semanticos.",
      "425": "Indica que el servidor no esta dispuesto a arriesgarse a procesar una solicitud que podria ser reproducida.",
      "426": "El cliente debe cambiar a un protocolo diferente como TLS/1.0.",
      "428": "El servidor de origen requiere que la solicitud sea condicional.",
      "429": "El usuario ha enviado demasiadas solicitudes en un periodo de tiempo determinado.",
      "431": "El servidor no esta dispuesto a procesar la solicitud porque sus campos de encabezado son demasiado grandes.",
      "451": "El servidor esta denegando el acceso al recurso como consecuencia de una demanda legal."
    }
  },
  "fr": {
    "description": {
      "418": "Ce code a ete defini en 1998 comme l'une des plaisanteries traditionnelles du poisson d'avril de l'IETF.",
      "422": "La requete etait bien formee mais n'a pas pu etre suivie en raison d'erreurs semantiques.",
      "425": "Indique que le serveur n'est pas pret a risquer de traiter une requete qui pourrait etre rejouee.",
      "426": "Le client doit passer a un protocole different tel que TLS/1.0.",
      "428": "Le serveur d'origine exige que la requete soit conditionnelle.",
      "429": "L'utilisateur a envoye trop de requetes dans un laps de temps donne.",
      "431": "Le serveur n'est pas pret a traiter la requete car ses champs d'en-tete sont trop grands.",
      "451": "Le serveur refuse l'acces a la ressource en consequence d'une demande legale."
    }
  },
  "de": {
    "description": {
      "418": "Dieser Code wurde 1998 als einer der traditionellen IETF-Aprilscherze definiert.",
      "422": "Die Anfrage war wohlgeformt, konnte aber aufgrund semantischer Fehler nicht befolgt werden.",
      "425": "Gibt an, dass der Server nicht bereit ist, das Risiko einzugehen, eine Anfrage zu verarbeiten, die moglicherweise wiedergegeben wird.",
      "426": "Der Client sollte zu einem anderen Protokoll wie TLS/1.0 wechseln.",
      "428": "Der Ursprungsserver erfordert, dass die Anfrage bedingt ist.",
      "429": "Der Benutzer hat in einem bestimmten Zeitraum zu viele Anfragen gesendet.",
      "431": "Der Server ist nicht bereit, die Anfrage zu verarbeiten, da ihre Header-Felder zu gro sind.",
      "451": "Der Server verweigert den Zugriff auf die Ressource als Folge einer rechtlichen Forderung."
    }
  },
  "it": {
    "description": {
      "418": "Questo codice e stato definito nel 1998 come uno degli scherzi tradizionali del pesce d'aprile dell'IETF.",
      "422": "La richiesta era ben formata ma non poteva essere seguita a causa di errori semantici.",
      "425": "Indica che il server non e disposto a rischiare di elaborare una richiesta che potrebbe essere riprodotta.",
      "426": "Il client dovrebbe passare a un protocollo diverso come TLS/1.0.",
      "428": "Il server di origine richiede che la richiesta sia condizionale.",
      "429": "L'utente ha inviato troppe richieste in un determinato periodo di tempo.",
      "431": "Il server non e disposto a elaborare la richiesta perche i suoi campi di intestazione sono troppo grandi.",
      "451": "Il server sta negando l'accesso alla risorsa come conseguenza di una richiesta legale."
    }
  },
  "ja": {
    "description": {
      "418": "このコードは1998年に、伝統的なIETFエイプリルフールのジョークの1つとして定義されました。",
      "422": "リクエストは適切に形成されていましたが、セマンティックエラーにより従うことができませんでした。",
      "425": "サーバーは、再生される可能性のあるリクエストを処理するリスクを負うことを望んでいないことを示します。",
      "426": "クライアントは、TLS/1.0などの別のプロトコルに切り替える必要があります。",
      "428": "オリジンサーバーは、リクエストが条件付きであることを要求します。",
      "429": "ユーザーは、指定された時間内にリクエストを送信しすぎました。",
      "431": "サーバーは、ヘッダーフィールドが大きすぎるため、リクエストを処理することを望んでいません。",
      "451": "サーバーは、法的要求の結果としてリソースへのアクセスを拒否しています。"
    }
  },
  "ko": {
    "description": {
      "418": "이 코드는 1998년 전통적인 IETF 만우절 농담 중 하나로 정의되었습니다.",
      "422": "요청이 잘 형성되었지만 의미론적 오류로 인해 따를 수 없었습니다.",
      "425": "서버가 재생될 수 있는 요청을 처리하는 위험을 감수하지 않으려 함을 나타냅니다.",
      "426": "클라이언트는 TLS/1.0과 같은 다른 프로토콜로 전환해야 합니다.",
      "428": "원본 서버는 요청이 조건부여야 합니다.",
      "429": "사용자가 지정된 시간 내에 너무 많은 요청을 보냈습니다.",
      "431": "서버가 헤더 필드가 너무 커서 요청을 처리하지 않으려 합니다.",
      "451": "서버가 법적 요구의 결과로 리소스에 대한 액세스를 거부하고 있습니다."
    }
  },
  "ru": {
    "description": {
      "418": "Этот код был определен в 1998 году как одна из традиционных шуток IETF на 1 апреля.",
      "422": "Запрос был правильно сформирован, но не мог быть выполнен из-за семантических ошибок.",
      "425": "Указывает, что сервер не желает рисковать обработкой запроса, который может быть воспроизведен.",
      "426": "Клиент должен переключиться на другой протокол, такой как TLS/1.0.",
      "428": "Исходный сервер требует, чтобы запрос был условным.",
      "429": "Пользователь отправил слишком много запросов за определенный период времени.",
      "431": "Сервер не желает обрабатывать запрос, потому что его поля заголовков слишком большие.",
      "451": "Сервер отказывает в доступе к ресурсу в результате правового требования."
    }
  },
  "pt": {
    "description": {
      "418": "Este codigo foi definido em 1998 como uma das piadas tradicionais do Dia da Mentira da IETF.",
      "422": "A solicitacao estava bem formada, mas nao pôde ser seguida devido a erros semanticos.",
      "425": "Indica que o servidor nao esta disposto a arriscar processar uma solicitacao que pode ser reproduzida.",
      "426": "O cliente deve mudar para um protocolo diferente, como TLS/1.0.",
      "428": "O servidor de origem requer que a solicitacao seja condicional.",
      "429": "O usuario enviou muitas solicitacoes em um determinado periodo de tempo.",
      "431": "O servidor nao esta disposto a processar a solicitacao porque seus campos de cabecalho sao muito grandes.",
      "451": "O servidor esta negando acesso ao recurso como consequencia de uma demanda legal."
    }
  },
  "ar": {
    "description": {
      "418": "تم تعريف هذا الرمز في عام 1998 كواحد من نكات كذبة أبريل التقليدية لـ IETF.",
      "422": "كان الطلب منسقًا جيدًا لكن لم يمكن اتباعه بسبب أخطاء دلالية.",
      "425": "يشير إلى أن الخادم غير مستعد للمخاطرة بمعالجة طلب قد يتم إعادة تشغيله.",
      "426": "يجب على العميل التبديل إلى بروتوكول مختلف مثل TLS/1.0.",
      "428": "يتطلب الخادم الأصلي أن يكون الطلب مشروطًا.",
      "429": "أرسل المستخدم طلبات كثيرة جدًا في فترة زمنية معينة.",
      "431": "الخادم غير مستعد لمعالجة الطلب لأن حقول الرأس كبيرة جدًا.",
      "451": "الخادم يرفض الوصول إلى المورد نتيجة لطلب قانوني."
    }
  },
  "hi": {
    "description": {
      "418": "इस कोड को 1998 में पारंपरिक IETF अप्रैल फूल मजाक में से एक के रूप में परिभाषित किया गया था।",
      "422": "अनुरोध अच्छी तरह से गठित था लेकिन अर्थ संबंधी त्रुटियों के कारण पालन नहीं किया जा सका।",
      "425": "इंगित करता है कि सर्वर एक अनुरोध को संसाधित करने का जोखिम उठाने को तैयार नहीं है जिसे फिर से चलाया जा सकता है।",
      "426": "क्लाइंट को TLS/1.0 जैसे अलग प्रोटोकॉल पर स्विच करना चाहिए।",
      "428": "मूल सर्वर के लिए अनुरोध को सशर्त होना आवश्यक है।",
      "429": "उपयोगकर्ता ने दिए गए समय में बहुत सारे अनुरोध भेजे हैं।",
      "431": "सर्वर अनुरोध को संसाधित करने को तैयार नहीं है क्योंकि इसके हेडर फ़ील्ड बहुत बड़े हैं।",
      "451": "सर्वर कानूनी मांग के परिणामस्वरूप संसाधन तक पहुंच से इनकार कर रहा है।"
    }
  },
  "tr": {
    "description": {
      "418": "Bu kod 1998'de geleneksel IETF Nisan 1 saka saka'larindan biri olarak tanimlandi.",
      "422": "Istek iyi biçimlendirilmisti ancak anlamsal hatalar nedeniyle takip edilemedi.",
      "425": "Sunucunun yeniden oynatilabilecek bir istegi isleme riskini almak istemedigini gösterir.",
      "426": "Istemci TLS/1.0 gibi farkli bir protokole geçmelidir.",
      "428": "Kaynak sunucu istegin kosullu olmasini gerektirir.",
      "429": "Kullanici belirli bir süre içinde çok fazla istek gönderdi.",
      "431": "Sunucu, baslik alanlari çok büyük oldugu için istegi islemek istemiyor.",
      "451": "Sunucu, yasal bir talep sonucunda kaynaga erisimi reddediyor."
    }
  },
  "nl": {
    "description": {
      "418": "Deze code werd in 1998 gedefinieerd als een van de traditionele IETF 1 april grappen.",
      "422": "Het verzoek was goed gevormd maar kon niet worden gevolgd vanwege semantische fouten.",
      "425": "Geeft aan dat de server niet bereid is het risico te nemen om een verzoek te verwerken dat mogelijk opnieuw wordt afgespeeld.",
      "426": "De client moet overschakelen naar een ander protocol zoals TLS/1.0.",
      "428": "De oorspronkelijke server vereist dat het verzoek voorwaardelijk is.",
      "429": "De gebruiker heeft te veel verzoeken verzonden in een bepaalde tijdsperiode.",
      "431": "De server is niet bereid het verzoek te verwerken omdat de headervelden te groot zijn.",
      "451": "De server weigert toegang tot de bron als gevolg van een juridische eis."
    }
  },
  "sv": {
    "description": {
      "418": "Denna kod definierades 1998 som en av de traditionella IETF aprilskämten.",
      "422": "Begäran var välformad men kunde inte följas på grund av semantiska fel.",
      "425": "Anger att servern inte är villig att riskera att bearbeta en begäran som kan spelas upp igen.",
      "426": "Klienten bör växla till ett annat protokoll som TLS/1.0.",
      "428": "Ursprungsservern kräver att begäran är villkorad.",
      "429": "Användaren har skickat för många begäranden under en given tidsperiod.",
      "431": "Servern är inte villig att bearbeta begäran eftersom dess huvudfält är för stora.",
      "451": "Servern nekar åtkomst till resursen som en följd av en juridisk begäran."
    }
  },
  "pl": {
    "description": {
      "418": "Ten kod zostal zdefiniowany w 1998 roku jako jeden z tradycyjnych zartow primaaprilisowych IETF.",
      "422": "Zadanie bylo dobrze sformulowane, ale nie mozna bylo mu sprostac z powodu bledow semantycznych.",
      "425": "Wskazuje, ze serwer nie jest sklonny ryzykowac przetwarzania zadania, które moze zostac odtworzone.",
      "426": "Klient powinien przejsc na inny protokol, taki jak TLS/1.0.",
      "428": "Serwer zrodlowy wymaga, aby zadanie bylo warunkowe.",
      "429": "Uzytkownik wyslal zbyt wiele zadan w danym okresie czasu.",
      "431": "Serwer nie jest sklonny przetwarzac zadania, poniewaz jego pola naglowkow sa zbyt duze.",
      "451": "Serwer odmawia dostepu do zasobu w konsekwencji zadanego prawnego."
    }
  },
  "vi": {
    "description": {
      "418": "Mã này được định nghĩa vào năm 1998 như một trong những trò đùa truyền thống của IETF vào ngày Cá tháng Tư.",
      "422": "Yêu cầu được định dạng tốt nhưng không thể được thực hiện do lỗi ngữ nghĩa.",
      "425": "Chỉ ra rằng máy chủ không sẵn sàng mạo hiểm xử lý một yêu cầu có thể được phát lại.",
      "426": "Máy khách nên chuyển sang một giao thức khác như TLS/1.0.",
      "428": "Máy chủ gốc yêu cầu yêu cầu phải có điều kiện.",
      "429": "Người dùng đã gửi quá nhiều yêu cầu trong một khoảng thời gian nhất định.",
      "431": "Máy chủ không sẵn sàng xử lý yêu cầu vì các trường tiêu đề của nó quá lớn.",
      "451": "Máy chủ đang từ chối quyền truy cập vào tài nguyên như một hậu quả của yêu cầu pháp lý."
    }
  },
  "th": {
    "description": {
      "418": "รหัสนี้ถูกกำหนดในปี 1998 เป็นหนึ่งในมุกตลกวันเมษาหน้าโง่แบบดั้งเดิมของ IETF",
      "422": "คำขอถูกจัดรูปแบบอย่างดี แต่ไม่สามารถปฏิบัติตามได้เนื่องจากข้อผิดพลาดทางความหมาย",
      "425": "ระบุว่าเซิร์ฟเวอร์ไม่เต็มใจที่จะเสี่ยงกับการประมวลผลคำขอที่อาจถูกเล่นซ้ำ",
      "426": "ไคลเอนต์ควรเปลี่ยนไปใช้โปรโตคอลอื่น เช่น TLS/1.0",
      "428": "เซิร์ฟเวอร์ต้นทางต้องการให้คำขอมีเงื่อนไข",
      "429": "ผู้ใช้ได้ส่งคำขอมากเกินไปในช่วงเวลาที่กำหนด",
      "431": "เซิร์ฟเวอร์ไม่เต็มใจที่จะประมวลผลคำขอเนื่องจากฟิลด์ส่วนหัวมีขนาดใหญ่เกินไป",
      "451": "เซิร์ฟเวอร์ปฏิเสธการเข้าถึงทรัพยากรอันเป็นผลมาจากคำขอทางกฎหมาย"
    }
  },
  "id": {
    "description": {
      "418": "Kode ini didefinisikan pada tahun 1998 sebagai salah satu lelucon tradisional April Mop IETF.",
      "422": "Permintaan terbentuk dengan baik tetapi tidak dapat diikuti karena kesalahan semantik.",
      "425": "Menunjukkan bahwa server tidak bersedia mengambil risiko memproses permintaan yang mungkin diputar ulang.",
      "426": "Klien harus beralih ke protokol yang berbeda seperti TLS/1.0.",
      "428": "Server asal memerlukan permintaan untuk bersyarat.",
      "429": "Pengguna telah mengirim terlalu banyak permintaan dalam periode waktu tertentu.",
      "431": "Server tidak bersedia memproses permintaan karena bidang headernya terlalu besar.",
      "451": "Server menolak akses ke sumber daya sebagai konsekuensi dari permintaan hukum."
    }
  },
  "he": {
    "description": {
      "418": "קוד זה הוגדר ב-1998 כאחד מבדיחות אחד באפריל המסורתיות של IETF.",
      "422": "הבקשה הייתה מעוצבת היטב אך לא ניתן היה לעקוב אחריה עקב שגיאות סמנטיות.",
      "425": "מציין שהשרת אינו מוכן לקחת סיכון בעיבוד בקשה שעשויה להיות משוחזרת.",
      "426": "הלקוח צריך לעבור לפרוטוקול אחר כמו TLS/1.0.",
      "428": "שרת המקור דורש שהבקשה תהיה מותנית.",
      "429": "המשתמש שלח יותר מדי בקשות בתקופת זמן נתונה.",
      "431": "השרת אינו מוכן לעבד את הבקשה מכיוון ששדות הכותרת שלו גדולים מדי.",
      "451": "השרת מסרב לגישה למשאב כתוצאה מדרישה משפטית."
    }
  },
  "ms": {
    "description": {
      "418": "Kod ini ditakrifkan pada tahun 1998 sebagai salah satu jenaka April Fool tradisional IETF.",
      "422": "Permintaan dibentuk dengan baik tetapi tidak dapat diikuti kerana ralat semantik.",
      "425": "Menunjukkan bahawa pelayan tidak sanggup mengambil risiko memproses permintaan yang mungkin dimainkan semula.",
      "426": "Klien harus beralih kepada protokol yang berbeza seperti TLS/1.0.",
      "428": "Pelayan asal memerlukan permintaan untuk bersyarat.",
      "429": "Pengguna telah menghantar terlalu banyak permintaan dalam tempoh masa tertentu.",
      "431": "Pelayan tidak sanggup memproses permintaan kerana medan pengepalanya terlalu besar.",
      "451": "Pelayan menolak akses kepada sumber sebagai akibat daripada permintaan undang-undang."
    }
  },
  "no": {
    "description": {
      "418": "Denne koden ble definert i 1998 som en av de tradisjonelle IETF-aprilspøkene.",
      "422": "Forespørselen var velformet, men kunne ikke følges på grunn av semantiske feil.",
      "425": "Angir at serveren ikke er villig til å risikere å behandle en forespørsel som kan bli spilt av igjen.",
      "426": "Klienten bør bytte til en annen protokoll som TLS/1.0.",
      "428": "Opprinnelsesserveren krever at forespørselen skal være betinget.",
      "429": "Brukeren har sendt for mange forespørsler i en gitt tidsperiode.",
      "431": "Serveren er ikke villig til å behandle forespørselen fordi hodefeltene er for store.",
      "451": "Serveren nekter tilgang til ressursen som en konsekvens av en juridisk forespørsel."
    }
  }
}
</i18n>
