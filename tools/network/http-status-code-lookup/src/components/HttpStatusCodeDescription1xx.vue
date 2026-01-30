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
      "100": "The server has received the request headers and the client should proceed to send the request body.",
      "101": "The requester has asked the server to switch protocols and the server has agreed.",
      "102": "The server has received and is processing the request, but no response is available yet.",
      "103": "Used to return some response headers before final HTTP message."
    }
  },
  "zh": {
    "description": {
      "100": "服务器已收到请求头，客户端应继续发送请求体。",
      "101": "请求者已要求服务器切换协议，服务器已同意。",
      "102": "服务器已收到并正在处理请求，但尚未有响应可用。",
      "103": "用于在最终 HTTP 消息之前返回一些响应头。"
    }
  },
  "zh-CN": {
    "description": {
      "100": "服务器已收到请求头，客户端应继续发送请求体。",
      "101": "请求者已要求服务器切换协议，服务器已同意。",
      "102": "服务器已收到并正在处理请求，但尚未有响应可用。",
      "103": "用于在最终 HTTP 消息之前返回一些响应头。"
    }
  },
  "zh-TW": {
    "description": {
      "100": "伺服器已收到請求標頭，用戶端應繼續發送請求體。",
      "101": "請求者已要求伺服器切換協議，伺服器已同意。",
      "102": "伺服器已收到並正在處理請求，但尚未有回應可用。",
      "103": "用於在最終 HTTP 訊息之前返回一些回應標頭。"
    }
  },
  "zh-HK": {
    "description": {
      "100": "伺服器已收到請求標頭，客戶端應繼續發送請求體。",
      "101": "請求者已要求伺服器切換協議，伺服器已同意。",
      "102": "伺服器已收到並正在處理請求，但尚未有回應可用。",
      "103": "用於在最終 HTTP 訊息之前返回一些回應標頭。"
    }
  },
  "es": {
    "description": {
      "100": "El servidor ha recibido los encabezados de la solicitud y el cliente debe proceder a enviar el cuerpo de la solicitud.",
      "101": "El solicitante ha pedido al servidor que cambie de protocolo y el servidor ha aceptado.",
      "102": "El servidor ha recibido y esta procesando la solicitud, pero aun no hay respuesta disponible.",
      "103": "Se utiliza para devolver algunos encabezados de respuesta antes del mensaje HTTP final."
    }
  },
  "fr": {
    "description": {
      "100": "Le serveur a recu les en-tetes de la requete et le client doit proceder a l'envoi du corps de la requete.",
      "101": "Le demandeur a demande au serveur de changer de protocole et le serveur a accepte.",
      "102": "Le serveur a recu et traite la requete, mais aucune reponse n'est encore disponible.",
      "103": "Utilise pour renvoyer certains en-tetes de reponse avant le message HTTP final."
    }
  },
  "de": {
    "description": {
      "100": "Der Server hat die Anfrage-Header erhalten und der Client sollte mit dem Senden des Anfragekorpers fortfahren.",
      "101": "Der Anfragende hat den Server gebeten, die Protokolle zu wechseln, und der Server hat zugestimmt.",
      "102": "Der Server hat die Anfrage erhalten und verarbeitet sie, aber es ist noch keine Antwort verfugbar.",
      "103": "Wird verwendet, um einige Antwort-Header vor der endgultigen HTTP-Nachricht zuruckzugeben."
    }
  },
  "it": {
    "description": {
      "100": "Il server ha ricevuto le intestazioni della richiesta e il client deve procedere all'invio del corpo della richiesta.",
      "101": "Il richiedente ha chiesto al server di cambiare protocollo e il server ha accettato.",
      "102": "Il server ha ricevuto e sta elaborando la richiesta, ma non e ancora disponibile alcuna risposta.",
      "103": "Utilizzato per restituire alcune intestazioni di risposta prima del messaggio HTTP finale."
    }
  },
  "ja": {
    "description": {
      "100": "サーバーはリクエストヘッダーを受信しました。クライアントはリクエストボディの送信を続行する必要があります。",
      "101": "リクエスターはサーバーにプロトコルの切り替えを要求し、サーバーは同意しました。",
      "102": "サーバーはリクエストを受信して処理中ですが、まだ応答は利用できません。",
      "103": "最終的なHTTPメッセージの前に、いくつかの応答ヘッダーを返すために使用されます。"
    }
  },
  "ko": {
    "description": {
      "100": "서버가 요청 헤더를 받았으며 클라이언트는 요청 본문 전송을 계속해야 합니다.",
      "101": "요청자가 서버에 프로토콜 전환을 요청했고 서버가 동의했습니다.",
      "102": "서버가 요청을 받아 처리 중이지만 아직 응답을 사용할 수 없습니다.",
      "103": "최종 HTTP 메시지 전에 일부 응답 헤더를 반환하는 데 사용됩니다."
    }
  },
  "ru": {
    "description": {
      "100": "Сервер получил заголовки запроса, и клиент должен продолжить отправку тела запроса.",
      "101": "Запрашивающая сторона попросила сервер переключить протоколы, и сервер согласился.",
      "102": "Сервер получил и обрабатывает запрос, но ответ еще недоступен.",
      "103": "Используется для возврата некоторых заголовков ответа перед окончательным HTTP-сообщением."
    }
  },
  "pt": {
    "description": {
      "100": "O servidor recebeu os cabecalhos da solicitacao e o cliente deve prosseguir para enviar o corpo da solicitacao.",
      "101": "O solicitante pediu ao servidor para trocar protocolos e o servidor concordou.",
      "102": "O servidor recebeu e esta processando a solicitacao, mas ainda nao ha resposta disponivel.",
      "103": "Usado para retornar alguns cabecalhos de resposta antes da mensagem HTTP final."
    }
  },
  "ar": {
    "description": {
      "100": "استلم الخادم رؤوس الطلب ويجب على العميل المتابعة لإرسال جسم الطلب.",
      "101": "طلب المستعلم من الخادم تبديل البروتوكولات ووافق الخادم.",
      "102": "استلم الخادم الطلب وهو يعالجه، لكن لا يوجد رد متاح بعد.",
      "103": "يستخدم لإرجاع بعض رؤوس الاستجابة قبل رسالة HTTP النهائية."
    }
  },
  "hi": {
    "description": {
      "100": "सर्वर ने अनुरोध हेडर प्राप्त कर लिए हैं और क्लाइंट को अनुरोध बॉडी भेजना जारी रखना चाहिए।",
      "101": "अनुरोधकर्ता ने सर्वर से प्रोटोकॉल बदलने के लिए कहा है और सर्वर सहमत हो गया है।",
      "102": "सर्वर ने अनुरोध प्राप्त किया है और इसे संसाधित कर रहा है, लेकिन अभी तक कोई प्रतिक्रिया उपलब्ध नहीं है।",
      "103": "अंतिम HTTP संदेश से पहले कुछ प्रतिक्रिया हेडर लौटाने के लिए उपयोग किया जाता है।"
    }
  },
  "tr": {
    "description": {
      "100": "Sunucu istek basliklarini aldi ve istemci istek gövdesini göndermeye devam etmelidir.",
      "101": "Istek sahibi sunucudan protokolleri degistirmesini istedi ve sunucu kabul etti.",
      "102": "Sunucu istegi aldi ve isliyor, ancak henüz yanit mevcut degil.",
      "103": "Son HTTP mesajindan önce bazi yanit basliklarini döndürmek için kullanilir."
    }
  },
  "nl": {
    "description": {
      "100": "De server heeft de verzoekheaders ontvangen en de client moet doorgaan met het verzenden van de verzoekbody.",
      "101": "De aanvrager heeft de server gevraagd om protocollen te wisselen en de server heeft ingestemd.",
      "102": "De server heeft het verzoek ontvangen en verwerkt het, maar er is nog geen antwoord beschikbaar.",
      "103": "Gebruikt om enkele antwoordheaders terug te geven vóór het definitieve HTTP-bericht."
    }
  },
  "sv": {
    "description": {
      "100": "Servern har mottagit begäranhuvudena och klienten bör fortsätta att skicka begärandekroppen.",
      "101": "Begäraren har bett servern att byta protokoll och servern har gått med på det.",
      "102": "Servern har mottagit och bearbetar begäran, men inget svar är tillgängligt ännu.",
      "103": "Används för att returnera vissa svarshuvuden före det slutliga HTTP-meddelandet."
    }
  },
  "pl": {
    "description": {
      "100": "Serwer otrzymal naglowki zadan i klient powinien kontynuowac wysylanie ciala zadania.",
      "101": "Zglaszajacy poprosil serwer o zmiane protokolow i serwer wyrazil zgode.",
      "102": "Serwer otrzymal i przetwarza zadanie, ale odpowiedz nie jest jeszcze dostepna.",
      "103": "Uzywane do zwracania niektórych naglowkow odpowiedzi przed ostateczna wiadomoscia HTTP."
    }
  },
  "vi": {
    "description": {
      "100": "Máy chủ đã nhận được các tiêu đề yêu cầu và máy khách nên tiếp tục gửi phần thân yêu cầu.",
      "101": "Người yêu cầu đã yêu cầu máy chủ chuyển đổi giao thức và máy chủ đã đồng ý.",
      "102": "Máy chủ đã nhận và đang xử lý yêu cầu, nhưng chưa có phản hồi.",
      "103": "Được sử dụng để trả về một số tiêu đề phản hồi trước thông điệp HTTP cuối cùng."
    }
  },
  "th": {
    "description": {
      "100": "เซิร์ฟเวอร์ได้รับส่วนหัวของคำขอแล้ว และไคลเอนต์ควรดำเนินการส่งเนื้อหาของคำขอต่อไป",
      "101": "ผู้ร้องขอได้ขอให้เซิร์ฟเวอร์เปลี่ยนโปรโตคอล และเซิร์ฟเวอร์ได้ตกลง",
      "102": "เซิร์ฟเวอร์ได้รับและกำลังประมวลผลคำขอ แต่ยังไม่มีคำตอบ",
      "103": "ใช้เพื่อส่งคืนส่วนหัวของคำตอบบางส่วนก่อนข้อความ HTTP สุดท้าย"
    }
  },
  "id": {
    "description": {
      "100": "Server telah menerima header permintaan dan klien harus melanjutkan untuk mengirim body permintaan.",
      "101": "Pemohon telah meminta server untuk beralih protokol dan server telah menyetujui.",
      "102": "Server telah menerima dan sedang memproses permintaan, tetapi belum ada respons yang tersedia.",
      "103": "Digunakan untuk mengembalikan beberapa header respons sebelum pesan HTTP akhir."
    }
  },
  "he": {
    "description": {
      "100": "השרת קיבל את כותרות הבקשה והלקוח צריך להמשיך לשלוח את גוף הבקשה.",
      "101": "המבקש ביקש מהשרת להחליף פרוטוקולים והשרת הסכים.",
      "102": "השרת קיבל ומעבד את הבקשה, אך עדיין אין תגובה זמינה.",
      "103": "משמש להחזרת כמה כותרות תגובה לפני הודעת HTTP הסופית."
    }
  },
  "ms": {
    "description": {
      "100": "Pelayan telah menerima pengepala permintaan dan klien harus meneruskan untuk menghantar badan permintaan.",
      "101": "Pemohon telah meminta pelayan menukar protokol dan pelayan telah bersetuju.",
      "102": "Pelayan telah menerima dan sedang memproses permintaan, tetapi tiada respons tersedia lagi.",
      "103": "Digunakan untuk mengembalikan beberapa pengepala respons sebelum mesej HTTP akhir."
    }
  },
  "no": {
    "description": {
      "100": "Serveren har mottatt foresporselshodene og klienten bor fortsette med å sende foresporselskroppen.",
      "101": "Forespøreren har bedt serveren om å bytte protokoller og serveren har gått med på det.",
      "102": "Serveren har mottatt og behandler forespørselen, men ingen respons er tilgjengelig ennå.",
      "103": "Brukes til å returnere noen responshoder før den endelige HTTP-meldingen."
    }
  }
}
</i18n>
