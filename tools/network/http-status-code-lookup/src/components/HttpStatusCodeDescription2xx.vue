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
      "200": "The request has succeeded. The meaning of success depends on the HTTP method.",
      "201": "The request has been fulfilled and resulted in a new resource being created.",
      "202": "The request has been accepted for processing, but the processing has not been completed.",
      "204": "The server successfully processed the request and is not returning any content.",
      "206": "The server is delivering only part of the resource due to a range header sent by the client."
    }
  },
  "zh": {
    "description": {
      "200": "请求已成功。成功的含义取决于 HTTP 方法。",
      "201": "请求已完成，并导致创建了新资源。",
      "202": "请求已被接受处理，但处理尚未完成。",
      "204": "服务器成功处理了请求，但不返回任何内容。",
      "206": "由于客户端发送的范围头，服务器仅提供资源的一部分。"
    }
  },
  "zh-CN": {
    "description": {
      "200": "请求已成功。成功的含义取决于 HTTP 方法。",
      "201": "请求已完成，并导致创建了新资源。",
      "202": "请求已被接受处理，但处理尚未完成。",
      "204": "服务器成功处理了请求，但不返回任何内容。",
      "206": "由于客户端发送的范围头，服务器仅提供资源的一部分。"
    }
  },
  "zh-TW": {
    "description": {
      "200": "請求已成功。成功的含義取決於 HTTP 方法。",
      "201": "請求已完成，並導致創建了新資源。",
      "202": "請求已被接受處理，但處理尚未完成。",
      "204": "伺服器成功處理了請求，但不返回任何內容。",
      "206": "由於用戶端發送的範圍標頭，伺服器僅提供資源的一部分。"
    }
  },
  "zh-HK": {
    "description": {
      "200": "請求已成功。成功的含義取決於 HTTP 方法。",
      "201": "請求已完成，並導致創建了新資源。",
      "202": "請求已被接受處理，但處理尚未完成。",
      "204": "伺服器成功處理了請求，但不返回任何內容。",
      "206": "由於客戶端發送的範圍標頭，伺服器僅提供資源的一部分。"
    }
  },
  "es": {
    "description": {
      "200": "La solicitud ha tenido exito. El significado del exito depende del metodo HTTP.",
      "201": "La solicitud se ha cumplido y ha resultado en la creacion de un nuevo recurso.",
      "202": "La solicitud ha sido aceptada para su procesamiento, pero el procesamiento no se ha completado.",
      "204": "El servidor proceso exitosamente la solicitud y no esta devolviendo ningun contenido.",
      "206": "El servidor esta entregando solo una parte del recurso debido a un encabezado de rango enviado por el cliente."
    }
  },
  "fr": {
    "description": {
      "200": "La requete a reussi. La signification du succes depend de la methode HTTP.",
      "201": "La requete a ete satisfaite et a abouti a la creation d'une nouvelle ressource.",
      "202": "La requete a ete acceptee pour traitement, mais le traitement n'est pas termine.",
      "204": "Le serveur a traite avec succes la requete et ne renvoie aucun contenu.",
      "206": "Le serveur ne livre qu'une partie de la ressource en raison d'un en-tete de plage envoye par le client."
    }
  },
  "de": {
    "description": {
      "200": "Die Anfrage war erfolgreich. Die Bedeutung des Erfolgs hangt von der HTTP-Methode ab.",
      "201": "Die Anfrage wurde erfullt und fuhrte zur Erstellung einer neuen Ressource.",
      "202": "Die Anfrage wurde zur Verarbeitung akzeptiert, aber die Verarbeitung ist noch nicht abgeschlossen.",
      "204": "Der Server hat die Anfrage erfolgreich verarbeitet und gibt keinen Inhalt zuruck.",
      "206": "Der Server liefert nur einen Teil der Ressource aufgrund eines vom Client gesendeten Bereichs-Headers."
    }
  },
  "it": {
    "description": {
      "200": "La richiesta ha avuto successo. Il significato del successo dipende dal metodo HTTP.",
      "201": "La richiesta e stata soddisfatta e ha portato alla creazione di una nuova risorsa.",
      "202": "La richiesta e stata accettata per l'elaborazione, ma l'elaborazione non e stata completata.",
      "204": "Il server ha elaborato con successo la richiesta e non sta restituendo alcun contenuto.",
      "206": "Il server sta consegnando solo una parte della risorsa a causa di un'intestazione di intervallo inviata dal client."
    }
  },
  "ja": {
    "description": {
      "200": "リクエストは成功しました。成功の意味はHTTPメソッドによって異なります。",
      "201": "リクエストは完了し、新しいリソースの作成につながりました。",
      "202": "リクエストは処理のために受け入れられましたが、処理はまだ完了していません。",
      "204": "サーバーはリクエストを正常に処理しましたが、コンテンツを返していません。",
      "206": "クライアントが送信した範囲ヘッダーにより、サーバーはリソースの一部のみを配信しています。"
    }
  },
  "ko": {
    "description": {
      "200": "요청이 성공했습니다. 성공의 의미는 HTTP 메서드에 따라 다릅니다.",
      "201": "요청이 완료되어 새 리소스가 생성되었습니다.",
      "202": "요청이 처리되도록 수락되었지만 처리가 완료되지 않았습니다.",
      "204": "서버가 요청을 성공적으로 처리했으며 콘텐츠를 반환하지 않습니다.",
      "206": "클라이언트가 보낸 범위 헤더로 인해 서버가 리소스의 일부만 전달하고 있습니다."
    }
  },
  "ru": {
    "description": {
      "200": "Запрос успешен. Значение успеха зависит от HTTP-метода.",
      "201": "Запрос выполнен и привел к созданию нового ресурса.",
      "202": "Запрос принят для обработки, но обработка еще не завершена.",
      "204": "Сервер успешно обработал запрос и не возвращает никакого содержимого.",
      "206": "Сервер доставляет только часть ресурса из-за заголовка диапазона, отправленного клиентом."
    }
  },
  "pt": {
    "description": {
      "200": "A solicitacao foi bem-sucedida. O significado do sucesso depende do metodo HTTP.",
      "201": "A solicitacao foi atendida e resultou na criacao de um novo recurso.",
      "202": "A solicitacao foi aceita para processamento, mas o processamento nao foi concluido.",
      "204": "O servidor processou com sucesso a solicitacao e nao esta retornando nenhum conteudo.",
      "206": "O servidor esta entregando apenas parte do recurso devido a um cabecalho de intervalo enviado pelo cliente."
    }
  },
  "ar": {
    "description": {
      "200": "نجح الطلب. معنى النجاح يعتمد على طريقة HTTP.",
      "201": "تم تنفيذ الطلب وأدى إلى إنشاء مورد جديد.",
      "202": "تم قبول الطلب للمعالجة، لكن المعالجة لم تكتمل.",
      "204": "عالج الخادم الطلب بنجاح ولا يعيد أي محتوى.",
      "206": "يسلم الخادم جزءًا فقط من المورد بسبب رأس النطاق المرسل من العميل."
    }
  },
  "hi": {
    "description": {
      "200": "अनुरोध सफल रहा। सफलता का अर्थ HTTP विधि पर निर्भर करता है।",
      "201": "अनुरोध पूरा हो गया है और इसके परिणामस्वरूप एक नया संसाधन बनाया गया है।",
      "202": "अनुरोध को संसाधन के लिए स्वीकार कर लिया गया है, लेकिन संसाधन पूरा नहीं हुआ है।",
      "204": "सर्वर ने अनुरोध को सफलतापूर्वक संसाधित किया है और कोई सामग्री वापस नहीं कर रहा है।",
      "206": "क्लाइंट द्वारा भेजे गए रेंज हेडर के कारण सर्वर संसाधन का केवल एक हिस्सा वितरित कर रहा है।"
    }
  },
  "tr": {
    "description": {
      "200": "Istek basarili oldu. Basarinin anlami HTTP yöntemine baglidir.",
      "201": "Istek tamamlandi ve yeni bir kaynak olusturulmasina neden oldu.",
      "202": "Istek isleme için kabul edildi, ancak isleme tamamlanmadi.",
      "204": "Sunucu istegi basariyla isledi ve herhangi bir içerik döndürmüyor.",
      "206": "Sunucu, istemci tarafindan gönderilen bir aralik basligi nedeniyle kaynagin yalnizca bir kismini teslim ediyor."
    }
  },
  "nl": {
    "description": {
      "200": "Het verzoek is geslaagd. De betekenis van succes hangt af van de HTTP-methode.",
      "201": "Het verzoek is vervuld en heeft geleid tot het creëren van een nieuwe bron.",
      "202": "Het verzoek is geaccepteerd voor verwerking, maar de verwerking is nog niet voltooid.",
      "204": "De server heeft het verzoek succesvol verwerkt en retourneert geen inhoud.",
      "206": "De server levert slechts een deel van de bron vanwege een bereikheader die door de client is verzonden."
    }
  },
  "sv": {
    "description": {
      "200": "Begäran lyckades. Betydelsen av framgång beror på HTTP-metoden.",
      "201": "Begäran har uppfyllts och resulterade i att en ny resurs skapades.",
      "202": "Begäran har accepterats för bearbetning, men bearbetningen har inte slutförts.",
      "204": "Servern bearbetade begäran framgångsrikt och returnerar inget innehåll.",
      "206": "Servern levererar endast en del av resursen på grund av ett intervallhuvud som skickats av klienten."
    }
  },
  "pl": {
    "description": {
      "200": "Zadanie powiodlo sie. Znaczenie sukcesu zalezy od metody HTTP.",
      "201": "Zadanie zostalo spelnione i doprowadzilo do utworzenia nowego zasobu.",
      "202": "Zadanie zostalo przyjete do przetworzenia, ale przetwarzanie nie zostalo zakonczone.",
      "204": "Serwer pomyslnie przetworzyl zadanie i nie zwraca zadnej tresci.",
      "206": "Serwer dostarcza tylko czesc zasobu z powodu naglowka zakresu wyslanego przez klienta."
    }
  },
  "vi": {
    "description": {
      "200": "Yêu cầu đã thành công. Ý nghĩa của thành công phụ thuộc vào phương thức HTTP.",
      "201": "Yêu cầu đã được thực hiện và dẫn đến việc tạo một tài nguyên mới.",
      "202": "Yêu cầu đã được chấp nhận để xử lý, nhưng việc xử lý chưa hoàn thành.",
      "204": "Máy chủ đã xử lý thành công yêu cầu và không trả về nội dung nào.",
      "206": "Máy chủ chỉ cung cấp một phần tài nguyên do tiêu đề phạm vi được gửi bởi máy khách."
    }
  },
  "th": {
    "description": {
      "200": "คำขอนั้นสำเร็จ ความหมายของความสำเร็จขึ้นอยู่กับวิธี HTTP",
      "201": "คำขอได้รับการปฏิบัติและส่งผลให้มีการสร้างทรัพยากรใหม่",
      "202": "คำขอได้รับการยอมรับสำหรับการประมวลผล แต่การประมวลผลยังไม่เสร็จสมบูรณ์",
      "204": "เซิร์ฟเวอร์ประมวลผลคำขอสำเร็จและไม่ส่งคืนเนื้อหาใดๆ",
      "206": "เซิร์ฟเวอร์กำลังส่งมอบทรัพยากรเพียงบางส่วนเนื่องจากส่วนหัวของช่วงที่ส่งโดยไคลเอนต์"
    }
  },
  "id": {
    "description": {
      "200": "Permintaan berhasil. Arti keberhasilan bergantung pada metode HTTP.",
      "201": "Permintaan telah dipenuhi dan menghasilkan pembuatan sumber daya baru.",
      "202": "Permintaan telah diterima untuk diproses, tetapi pemrosesan belum selesai.",
      "204": "Server berhasil memproses permintaan dan tidak mengembalikan konten apa pun.",
      "206": "Server hanya mengirimkan sebagian sumber daya karena header rentang yang dikirim oleh klien."
    }
  },
  "he": {
    "description": {
      "200": "הבקשה הצליחה. משמעות ההצלחה תלויה בשיטת HTTP.",
      "201": "הבקשה מולאה והביאה ליצירת משאב חדש.",
      "202": "הבקשה התקבלה לעיבוד, אך העיבוד לא הושלם.",
      "204": "השרת עיבד בהצלחה את הבקשה ואינו מחזיר תוכן כלשהו.",
      "206": "השרת מספק רק חלק מהמשאב עקב כותרת טווח שנשלחה על ידי הלקוח."
    }
  },
  "ms": {
    "description": {
      "200": "Permintaan berjaya. Maksud kejayaan bergantung pada kaedah HTTP.",
      "201": "Permintaan telah dipenuhi dan mengakibatkan penciptaan sumber baharu.",
      "202": "Permintaan telah diterima untuk diproses, tetapi pemprosesan belum selesai.",
      "204": "Pelayan berjaya memproses permintaan dan tidak mengembalikan sebarang kandungan.",
      "206": "Pelayan hanya menyampaikan sebahagian sumber kerana pengepala julat yang dihantar oleh klien."
    }
  },
  "no": {
    "description": {
      "200": "Forespørselen var vellykket. Betydningen av suksess avhenger av HTTP-metoden.",
      "201": "Forespørselen har blitt oppfylt og resulterte i at en ny ressurs ble opprettet.",
      "202": "Forespørselen har blitt akseptert for behandling, men behandlingen er ikke fullført.",
      "204": "Serveren behandlet forespørselen vellykket og returnerer ikke noe innhold.",
      "206": "Serveren leverer bare en del av ressursen på grunn av et områdehode sendt av klienten."
    }
  }
}
</i18n>
