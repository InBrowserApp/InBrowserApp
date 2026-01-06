<template>
  <div>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <NText>{{ t('description') }}</NText>
      <NUl>
        <NLi>
          <NText strong>{{ t('informationalTitle') }}</NText> {{ t('informationalDesc') }}
        </NLi>
        <NLi>
          <NText strong>{{ t('successTitle') }}</NText> {{ t('successDesc') }}
        </NLi>
        <NLi>
          <NText strong>{{ t('redirectionTitle') }}</NText> {{ t('redirectionDesc') }}
        </NLi>
        <NLi>
          <NText strong>{{ t('clientErrorTitle') }}</NText> {{ t('clientErrorDesc') }}
        </NLi>
        <NLi>
          <NText strong>{{ t('serverErrorTitle') }}</NText> {{ t('serverErrorDesc') }}
        </NLi>
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
    "title": "What is an HTTP Status Code?",
    "description": "HTTP status codes are three-digit numbers returned by a server to indicate the result of a client's request. They are grouped into five categories:",
    "informationalTitle": "1xx Informational:",
    "informationalDesc": "Indicates that the request was received and the process is continuing.",
    "successTitle": "2xx Success:",
    "successDesc": "Indicates that the request was successfully received, understood, and accepted.",
    "redirectionTitle": "3xx Redirection:",
    "redirectionDesc": "Indicates that further action needs to be taken to complete the request.",
    "clientErrorTitle": "4xx Client Error:",
    "clientErrorDesc": "Indicates that the client made an error in the request (e.g., 404 Not Found, 401 Unauthorized).",
    "serverErrorTitle": "5xx Server Error:",
    "serverErrorDesc": "Indicates that the server encountered an error while processing the request (e.g., 500 Internal Server Error, 503 Service Unavailable)."
  },
  "zh": {
    "title": "什么是 HTTP 状态码？",
    "description": "HTTP 状态码是服务器返回的三位数字，用于指示客户端请求的结果。它们分为五个类别：",
    "informationalTitle": "1xx 信息性：",
    "informationalDesc": "表示请求已收到，处理正在进行中。",
    "successTitle": "2xx 成功：",
    "successDesc": "表示请求已成功接收、理解和接受。",
    "redirectionTitle": "3xx 重定向：",
    "redirectionDesc": "表示需要采取进一步操作才能完成请求。",
    "clientErrorTitle": "4xx 客户端错误：",
    "clientErrorDesc": "表示客户端在请求中出现了错误（例如，404 未找到，401 未授权）。",
    "serverErrorTitle": "5xx 服务器错误：",
    "serverErrorDesc": "表示服务器在处理请求时遇到错误（例如，500 内部服务器错误，503 服务不可用）。"
  },
  "zh-CN": {
    "title": "什么是 HTTP 状态码？",
    "description": "HTTP 状态码是服务器返回的三位数字，用于指示客户端请求的结果。它们分为五个类别：",
    "informationalTitle": "1xx 信息性：",
    "informationalDesc": "表示请求已收到，处理正在进行中。",
    "successTitle": "2xx 成功：",
    "successDesc": "表示请求已成功接收、理解和接受。",
    "redirectionTitle": "3xx 重定向：",
    "redirectionDesc": "表示需要采取进一步操作才能完成请求。",
    "clientErrorTitle": "4xx 客户端错误：",
    "clientErrorDesc": "表示客户端在请求中出现了错误（例如，404 未找到，401 未授权）。",
    "serverErrorTitle": "5xx 服务器错误：",
    "serverErrorDesc": "表示服务器在处理请求时遇到错误（例如，500 内部服务器错误，503 服务不可用）。"
  },
  "zh-TW": {
    "title": "什麼是 HTTP 狀態碼？",
    "description": "HTTP 狀態碼是伺服器返回的三位數字，用於指示用戶端請求的結果。它們分為五個類別：",
    "informationalTitle": "1xx 資訊性：",
    "informationalDesc": "表示請求已收到，處理正在進行中。",
    "successTitle": "2xx 成功：",
    "successDesc": "表示請求已成功接收、理解和接受。",
    "redirectionTitle": "3xx 重新導向：",
    "redirectionDesc": "表示需要採取進一步操作才能完成請求。",
    "clientErrorTitle": "4xx 用戶端錯誤：",
    "clientErrorDesc": "表示用戶端在請求中出現了錯誤（例如，404 找不到，401 未授權）。",
    "serverErrorTitle": "5xx 伺服器錯誤：",
    "serverErrorDesc": "表示伺服器在處理請求時遇到錯誤（例如，500 內部伺服器錯誤，503 服務無法使用）。"
  },
  "zh-HK": {
    "title": "什麼是 HTTP 狀態碼？",
    "description": "HTTP 狀態碼是伺服器返回的三位數字，用於指示客戶端請求的結果。它們分為五個類別：",
    "informationalTitle": "1xx 資訊性：",
    "informationalDesc": "表示請求已收到，處理正在進行中。",
    "successTitle": "2xx 成功：",
    "successDesc": "表示請求已成功接收、理解和接受。",
    "redirectionTitle": "3xx 重新導向：",
    "redirectionDesc": "表示需要採取進一步操作才能完成請求。",
    "clientErrorTitle": "4xx 客戶端錯誤：",
    "clientErrorDesc": "表示客戶端在請求中出現了錯誤（例如，404 找不到，401 未授權）。",
    "serverErrorTitle": "5xx 伺服器錯誤：",
    "serverErrorDesc": "表示伺服器在處理請求時遇到錯誤（例如，500 內部伺服器錯誤，503 服務無法使用）。"
  },
  "es": {
    "title": "Que es un Codigo de Estado HTTP?",
    "description": "Los codigos de estado HTTP son numeros de tres digitos devueltos por un servidor para indicar el resultado de una solicitud del cliente. Se agrupan en cinco categorias:",
    "informationalTitle": "1xx Informativo:",
    "informationalDesc": "Indica que la solicitud fue recibida y el proceso continua.",
    "successTitle": "2xx Exito:",
    "successDesc": "Indica que la solicitud fue recibida, entendida y aceptada exitosamente.",
    "redirectionTitle": "3xx Redireccion:",
    "redirectionDesc": "Indica que se necesita tomar una accion adicional para completar la solicitud.",
    "clientErrorTitle": "4xx Error del Cliente:",
    "clientErrorDesc": "Indica que el cliente cometio un error en la solicitud (por ejemplo, 404 No Encontrado, 401 No Autorizado).",
    "serverErrorTitle": "5xx Error del Servidor:",
    "serverErrorDesc": "Indica que el servidor encontro un error al procesar la solicitud (por ejemplo, 500 Error Interno del Servidor, 503 Servicio No Disponible)."
  },
  "fr": {
    "title": "Qu'est-ce qu'un Code de Statut HTTP ?",
    "description": "Les codes de statut HTTP sont des nombres a trois chiffres renvoyes par un serveur pour indiquer le resultat d'une requete du client. Ils sont groupes en cinq categories:",
    "informationalTitle": "1xx Informationnel:",
    "informationalDesc": "Indique que la requete a ete recue et que le processus se poursuit.",
    "successTitle": "2xx Succes:",
    "successDesc": "Indique que la requete a ete recue, comprise et acceptee avec succes.",
    "redirectionTitle": "3xx Redirection:",
    "redirectionDesc": "Indique qu'une action supplementaire doit etre entreprise pour completer la requete.",
    "clientErrorTitle": "4xx Erreur Client:",
    "clientErrorDesc": "Indique que le client a commis une erreur dans la requete (par exemple, 404 Non Trouve, 401 Non Autorise).",
    "serverErrorTitle": "5xx Erreur Serveur:",
    "serverErrorDesc": "Indique que le serveur a rencontre une erreur lors du traitement de la requete (par exemple, 500 Erreur Interne du Serveur, 503 Service Indisponible)."
  },
  "de": {
    "title": "Was ist ein HTTP-Statuscode?",
    "description": "HTTP-Statuscodes sind dreistellige Zahlen, die von einem Server zuruckgegeben werden, um das Ergebnis einer Client-Anfrage anzugeben. Sie sind in funf Kategorien gruppiert:",
    "informationalTitle": "1xx Informationell:",
    "informationalDesc": "Zeigt an, dass die Anfrage empfangen wurde und der Prozess fortgesetzt wird.",
    "successTitle": "2xx Erfolg:",
    "successDesc": "Zeigt an, dass die Anfrage erfolgreich empfangen, verstanden und akzeptiert wurde.",
    "redirectionTitle": "3xx Weiterleitung:",
    "redirectionDesc": "Zeigt an, dass weitere Maanahmen erforderlich sind, um die Anfrage abzuschliessen.",
    "clientErrorTitle": "4xx Client-Fehler:",
    "clientErrorDesc": "Zeigt an, dass der Client einen Fehler in der Anfrage gemacht hat (z.B. 404 Nicht Gefunden, 401 Nicht Autorisiert).",
    "serverErrorTitle": "5xx Server-Fehler:",
    "serverErrorDesc": "Zeigt an, dass der Server beim Verarbeiten der Anfrage einen Fehler festgestellt hat (z.B. 500 Interner Serverfehler, 503 Dienst Nicht Verfugbar)."
  },
  "it": {
    "title": "Cos'e un Codice di Stato HTTP?",
    "description": "I codici di stato HTTP sono numeri a tre cifre restituiti da un server per indicare il risultato di una richiesta del client. Sono raggruppati in cinque categorie:",
    "informationalTitle": "1xx Informativo:",
    "informationalDesc": "Indica che la richiesta e stata ricevuta e il processo continua.",
    "successTitle": "2xx Successo:",
    "successDesc": "Indica che la richiesta e stata ricevuta, compresa e accettata con successo.",
    "redirectionTitle": "3xx Reindirizzamento:",
    "redirectionDesc": "Indica che e necessario intraprendere ulteriori azioni per completare la richiesta.",
    "clientErrorTitle": "4xx Errore Client:",
    "clientErrorDesc": "Indica che il client ha commesso un errore nella richiesta (ad esempio, 404 Non Trovato, 401 Non Autorizzato).",
    "serverErrorTitle": "5xx Errore Server:",
    "serverErrorDesc": "Indica che il server ha riscontrato un errore durante l'elaborazione della richiesta (ad esempio, 500 Errore Interno del Server, 503 Servizio Non Disponibile)."
  },
  "ja": {
    "title": "HTTP ステータスコードとは？",
    "description": "HTTP ステータスコードは、クライアントのリクエストの結果を示すためにサーバーが返す3桁の数字です。5つのカテゴリに分類されます：",
    "informationalTitle": "1xx 情報：",
    "informationalDesc": "リクエストが受信され、処理が継続中であることを示します。",
    "successTitle": "2xx 成功：",
    "successDesc": "リクエストが正常に受信、理解、承認されたことを示します。",
    "redirectionTitle": "3xx リダイレクト：",
    "redirectionDesc": "リクエストを完了するために追加のアクションが必要であることを示します。",
    "clientErrorTitle": "4xx クライアントエラー：",
    "clientErrorDesc": "クライアントがリクエストでエラーを起こしたことを示します（例：404 見つかりません、401 認証が必要）。",
    "serverErrorTitle": "5xx サーバーエラー：",
    "serverErrorDesc": "サーバーがリクエストの処理中にエラーに遭遇したことを示します（例：500 内部サーバーエラー、503 サービス利用不可）。"
  },
  "ko": {
    "title": "HTTP 상태 코드란?",
    "description": "HTTP 상태 코드는 클라이언트 요청의 결과를 나타내기 위해 서버가 반환하는 세 자리 숫자입니다. 다섯 가지 범주로 그룹화됩니다:",
    "informationalTitle": "1xx 정보성:",
    "informationalDesc": "요청이 수신되었으며 프로세스가 계속 진행 중임을 나타냅니다.",
    "successTitle": "2xx 성공:",
    "successDesc": "요청이 성공적으로 수신되고 이해되고 수락되었음을 나타냅니다.",
    "redirectionTitle": "3xx 리디렉션:",
    "redirectionDesc": "요청을 완료하기 위해 추가 조치가 필요함을 나타냅니다.",
    "clientErrorTitle": "4xx 클라이언트 오류:",
    "clientErrorDesc": "클라이언트가 요청에서 오류를 발생시켰음을 나타냅니다 (예: 404 찾을 수 없음, 401 인증되지 않음).",
    "serverErrorTitle": "5xx 서버 오류:",
    "serverErrorDesc": "서버가 요청을 처리하는 동안 오류가 발생했음을 나타냅니다 (예: 500 내부 서버 오류, 503 서비스를 사용할 수 없음)."
  },
  "ru": {
    "title": "Что такое HTTP Код Состояния?",
    "description": "HTTP коды состояния - это трехзначные числа, возвращаемые сервером для указания результата запроса клиента. Они сгруппированы в пять категорий:",
    "informationalTitle": "1xx Информационные:",
    "informationalDesc": "Указывает, что запрос был получен и процесс продолжается.",
    "successTitle": "2xx Успех:",
    "successDesc": "Указывает, что запрос был успешно получен, понят и принят.",
    "redirectionTitle": "3xx Перенаправление:",
    "redirectionDesc": "Указывает, что необходимо предпринять дальнейшие действия для завершения запроса.",
    "clientErrorTitle": "4xx Ошибка Клиента:",
    "clientErrorDesc": "Указывает, что клиент допустил ошибку в запросе (например, 404 Не Найдено, 401 Не Авторизован).",
    "serverErrorTitle": "5xx Ошибка Сервера:",
    "serverErrorDesc": "Указывает, что сервер столкнулся с ошибкой при обработке запроса (например, 500 Внутренняя Ошибка Сервера, 503 Служба Недоступна)."
  },
  "pt": {
    "title": "O que e um Codigo de Status HTTP?",
    "description": "Os codigos de status HTTP sao numeros de tres digitos retornados por um servidor para indicar o resultado de uma solicitacao do cliente. Eles sao agrupados em cinco categorias:",
    "informationalTitle": "1xx Informativo:",
    "informationalDesc": "Indica que a solicitacao foi recebida e o processo esta continuando.",
    "successTitle": "2xx Sucesso:",
    "successDesc": "Indica que a solicitacao foi recebida, compreendida e aceita com sucesso.",
    "redirectionTitle": "3xx Redirecionamento:",
    "redirectionDesc": "Indica que uma acao adicional precisa ser tomada para completar a solicitacao.",
    "clientErrorTitle": "4xx Erro do Cliente:",
    "clientErrorDesc": "Indica que o cliente cometeu um erro na solicitacao (por exemplo, 404 Nao Encontrado, 401 Nao Autorizado).",
    "serverErrorTitle": "5xx Erro do Servidor:",
    "serverErrorDesc": "Indica que o servidor encontrou um erro ao processar a solicitacao (por exemplo, 500 Erro Interno do Servidor, 503 Servico Indisponivel)."
  },
  "ar": {
    "title": "ما هو رمز حالة HTTP؟",
    "description": "رموز حالة HTTP هي ارقام من ثلاثة اعداد ترجعها الخادم للإشارة إلى نتيجة طلب العميل. يتم تجميعها في خمس فئات:",
    "informationalTitle": "1xx معلوماتي:",
    "informationalDesc": "يشير إلى ان الطلب تم استلامه والعملية مستمرة.",
    "successTitle": "2xx نجاح:",
    "successDesc": "يشير إلى ان الطلب تم استلامه وفهمه وقبوله بنجاح.",
    "redirectionTitle": "3xx اعادة توجيه:",
    "redirectionDesc": "يشير إلى انه يجب اتخاذ اجراءات اضافية لإكمال الطلب.",
    "clientErrorTitle": "4xx خطأ العميل:",
    "clientErrorDesc": "يشير إلى ان العميل ارتكب خطأ في الطلب (على سبيل المثال، 404 غير موجود، 401 غير مصرح).",
    "serverErrorTitle": "5xx خطأ الخادم:",
    "serverErrorDesc": "يشير إلى ان الخادم واجه خطأ اثناء معالجة الطلب (على سبيل المثال، 500 خطأ داخلي في الخادم، 503 الخدمة غير متاحة)."
  },
  "hi": {
    "title": "HTTP स्थिति कोड क्या है?",
    "description": "HTTP स्थिति कोड तीन अंकों वाली संख्याएं हैं जो क्लाइंट के अनुरोध के परिणाम को इंगित करने के लिए सर्वर द्वारा वापस की जाती हैं। उन्हें पांच श्रेणियों में समूहीकृत किया गया है:",
    "informationalTitle": "1xx सूचनात्मक:",
    "informationalDesc": "इंगित करता है कि अनुरोध प्राप्त किया गया था और प्रक्रिया जारी है।",
    "successTitle": "2xx सफलता:",
    "successDesc": "इंगित करता है कि अनुरोध सफलतापूर्वक प्राप्त, समझा और स्वीकार किया गया था।",
    "redirectionTitle": "3xx पुनर्निर्देशन:",
    "redirectionDesc": "इंगित करता है कि अनुरोध को पूरा करने के लिए आगे की कार्रवाई करने की आवश्यकता है।",
    "clientErrorTitle": "4xx क्लाइंट त्रुटि:",
    "clientErrorDesc": "इंगित करता है कि क्लाइंट ने अनुरोध में त्रुटि की है (उदाहरण के लिए, 404 नहीं मिला, 401 अधिकृत नहीं)।",
    "serverErrorTitle": "5xx सर्वर त्रुटि:",
    "serverErrorDesc": "इंगित करता है कि सर्वर ने अनुरोध को संसाधित करते समय त्रुटि का सामना किया है (उदाहरण के लिए, 500 आंतरिक सर्वर त्रुटि, 503 सेवा उपलब्ध नहीं)।"
  },
  "tr": {
    "title": "HTTP Durum Kodu Nedir?",
    "description": "HTTP durum kodlari, bir istemcinin isteginin sonucunu belirtmek icin bir sunucu tarafindan dondurulen uc haneli sayilardir. Bes kategoriye ayrilirlar:",
    "informationalTitle": "1xx Bilgilendirici:",
    "informationalDesc": "Istegin alindigini ve surecin devam ettigini gosterir.",
    "successTitle": "2xx Basarili:",
    "successDesc": "Istegin basariyla alindigini, anlasildigini ve kabul edildigini gosterir.",
    "redirectionTitle": "3xx Yonlendirme:",
    "redirectionDesc": "Istegi tamamlamak icin daha fazla eylem yapilmasi gerektigini gosterir.",
    "clientErrorTitle": "4xx Istekci Hatasi:",
    "clientErrorDesc": "Istekcinin istekte bir hata yaptigini gosterir (ornegin, 404 Bulunamadi, 401 Yetkisiz).",
    "serverErrorTitle": "5xx Sunucu Hatasi:",
    "serverErrorDesc": "Sunucunun istegi islerken bir hatayla karsilastigini gosterir (ornegin, 500 Ic Sunucu Hatasi, 503 Servis Kullanilamiyor)."
  },
  "nl": {
    "title": "Wat is een HTTP Statuscode?",
    "description": "HTTP statuscodes zijn driecijferige nummers die door een server worden teruggestuurd om het resultaat van een clientverzoek aan te geven. Ze zijn gegroepeerd in vijf categorieen:",
    "informationalTitle": "1xx Informatief:",
    "informationalDesc": "Geeft aan dat het verzoek is ontvangen en dat het proces wordt voortgezet.",
    "successTitle": "2xx Succesvol:",
    "successDesc": "Geeft aan dat het verzoek succesvol is ontvangen, begrepen en geaccepteerd.",
    "redirectionTitle": "3xx Omleiding:",
    "redirectionDesc": "Geeft aan dat verdere actie moet worden ondernomen om het verzoek te voltooien.",
    "clientErrorTitle": "4xx Clientfout:",
    "clientErrorDesc": "Geeft aan dat de client een fout heeft gemaakt in het verzoek (bijvoorbeeld, 404 Niet Gevonden, 401 Niet Geautoriseerd).",
    "serverErrorTitle": "5xx Serverfout:",
    "serverErrorDesc": "Geeft aan dat de server een fout heeft aangetroffen bij het verwerken van het verzoek (bijvoorbeeld, 500 Interne Serverfout, 503 Service Niet Beschikbaar)."
  },
  "sv": {
    "title": "Vad ar en HTTP Statuskod?",
    "description": "HTTP statuskoder ar tresiffriga nummer som returneras av en server for att ange resultatet av en klientbegaran. De ar grupperade i fem kategorier:",
    "informationalTitle": "1xx Informativ:",
    "informationalDesc": "Anger att begaran har mottagits och att processen fortsatter.",
    "successTitle": "2xx Framgangsrik:",
    "successDesc": "Anger att begaran har mottagits, forstatts och accepterats framgangsrikt.",
    "redirectionTitle": "3xx Omdirigering:",
    "redirectionDesc": "Anger att ytterligare atgarder maste vidtas for att slutföra begaran.",
    "clientErrorTitle": "4xx Klientfel:",
    "clientErrorDesc": "Anger att klienten har gjort ett fel i begaran (t.ex. 404 Hittades Inte, 401 Obehorig).",
    "serverErrorTitle": "5xx Serverfel:",
    "serverErrorDesc": "Anger att servern stotte pa ett fel vid bearbetning av begaran (t.ex. 500 Internt Serverfel, 503 Tjanst Ej Tillganglig)."
  },
  "pl": {
    "title": "Czym jest Kod Statusu HTTP?",
    "description": "Kody statusu HTTP to trzycyfrowe numery zwracane przez serwer w celu wskazania wyniku zadania klienta. Sa pogrupowane w piec kategorii:",
    "informationalTitle": "1xx Informacyjny:",
    "informationalDesc": "Oznacza, ze zadanie zostalo odebrane i proces jest kontynuowany.",
    "successTitle": "2xx Sukces:",
    "successDesc": "Oznacza, ze zadanie zostalo pomyslnie odebrane, zrozumiane i zaakceptowane.",
    "redirectionTitle": "3xx Przekierowanie:",
    "redirectionDesc": "Oznacza, ze nalezy podjac dalsze dzialania w celu ukonczenia zadania.",
    "clientErrorTitle": "4xx Blad Klienta:",
    "clientErrorDesc": "Oznacza, ze klient popelnil blad w zadaniu (np. 404 Nie Znaleziono, 401 Nieautoryzowany).",
    "serverErrorTitle": "5xx Blad Serwera:",
    "serverErrorDesc": "Oznacza, ze serwer napotkal blad podczas przetwarzania zadania (np. 500 Wewnetrzny Blad Serwera, 503 Usluga Niedostepna)."
  },
  "vi": {
    "title": "Ma Trang Thai HTTP la gi?",
    "description": "Ma trang thai HTTP la cac so co ba chu so duoc tra ve boi may chu de chi ket qua cua yeu cau cua may khach. Chung duoc nhom thanh nam loai:",
    "informationalTitle": "1xx Thong tin:",
    "informationalDesc": "Chi ra rang yeu cau da duoc nhan va qua trinh dang tiep tuc.",
    "successTitle": "2xx Thanh cong:",
    "successDesc": "Chi ra rang yeu cau da duoc nhan, hieu va chap nhan thanh cong.",
    "redirectionTitle": "3xx Chuyen huong:",
    "redirectionDesc": "Chi ra rang can thuc hien hanh dong bo sung de hoan thanh yeu cau.",
    "clientErrorTitle": "4xx Loi May Khach:",
    "clientErrorDesc": "Chi ra rang may khach da gap loi trong yeu cau (vi du, 404 Khong Tim Thay, 401 Chua Xac Thuc).",
    "serverErrorTitle": "5xx Loi May Chu:",
    "serverErrorDesc": "Chi ra rang may chu da gap loi khi xu ly yeu cau (vi du, 500 Loi May Chu Noi Bo, 503 Dich Vu Khong Kha Dung)."
  },
  "th": {
    "title": "รหัสสถานะ HTTP คืออะไร?",
    "description": "รหัสสถานะ HTTP เป็นตัวเลขสามหลักที่ส่งกลับโดยเซิร์ฟเวอร์เพื่อระบุผลลัพธ์ของคำขอของไคลเอนต์ ถูกจัดกลุ่มเป็นห้าประเภท:",
    "informationalTitle": "1xx ข้อมูล:",
    "informationalDesc": "ระบุว่าคำขอได้รับการรับและกระบวนการกำลังดำเนินการต่อ",
    "successTitle": "2xx สำเร็จ:",
    "successDesc": "ระบุว่าคำขอได้รับการรับ เข้าใจ และยอมรับสำเร็จ",
    "redirectionTitle": "3xx เปลี่ยนเส้นทาง:",
    "redirectionDesc": "ระบุว่าจำเป็นต้องดำเนินการเพิ่มเติมเพื่อให้คำขอเสร็จสมบูรณ์",
    "clientErrorTitle": "4xx ข้อผิดพลาดของไคลเอนต์:",
    "clientErrorDesc": "ระบุว่าไคลเอนต์ทำผิดพลาดในคำขอ (เช่น 404 ไม่พบ 401 ไม่ได้รับอนุญาต)",
    "serverErrorTitle": "5xx ข้อผิดพลาดของเซิร์ฟเวอร์:",
    "serverErrorDesc": "ระบุว่าเซิร์ฟเวอร์พบข้อผิดพลาดขณะประมวลผลคำขอ (เช่น 500 ข้อผิดพลาดภายในเซิร์ฟเวอร์ 503 บริการไม่พร้อมใช้งาน)"
  },
  "id": {
    "title": "Apa itu Kode Status HTTP?",
    "description": "Kode status HTTP adalah angka tiga digit yang dikembalikan oleh server untuk menunjukkan hasil permintaan klien. Mereka dikelompokkan menjadi lima kategori:",
    "informationalTitle": "1xx Informasional:",
    "informationalDesc": "Menunjukkan bahwa permintaan telah diterima dan proses sedang berlanjut.",
    "successTitle": "2xx Berhasil:",
    "successDesc": "Menunjukkan bahwa permintaan telah berhasil diterima, dipahami, dan diterima.",
    "redirectionTitle": "3xx Pengalihan:",
    "redirectionDesc": "Menunjukkan bahwa tindakan lebih lanjut perlu diambil untuk menyelesaikan permintaan.",
    "clientErrorTitle": "4xx Kesalahan Klien:",
    "clientErrorDesc": "Menunjukkan bahwa klien membuat kesalahan dalam permintaan (misalnya, 404 Tidak Ditemukan, 401 Tidak Diizinkan).",
    "serverErrorTitle": "5xx Kesalahan Server:",
    "serverErrorDesc": "Menunjukkan bahwa server mengalami kesalahan saat memproses permintaan (misalnya, 500 Kesalahan Internal Server, 503 Layanan Tidak Tersedia)."
  },
  "he": {
    "title": "מהו קוד סטטוס HTTP?",
    "description": "קודי סטטוס HTTP הם מספרים תלת-ספרתיים המוחזרים על ידי שרת כדי לציין את תוצאת בקשת הלקוח. הם מקובצים לחמש קטגוריות:",
    "informationalTitle": "1xx מידע:",
    "informationalDesc": "מציין שהבקשה התקבלה והתהליך נמשך.",
    "successTitle": "2xx הצלחה:",
    "successDesc": "מציין שהבקשה התקבלה, הובנה ואושרה בהצלחה.",
    "redirectionTitle": "3xx הפניה מחדש:",
    "redirectionDesc": "מציין שיש לנקוט בפעולה נוספת כדי להשלים את הבקשה.",
    "clientErrorTitle": "4xx שגיאת לקוח:",
    "clientErrorDesc": "מציין שהלקוח ביצע שגיאה בבקשה (למשל, 404 לא נמצא, 401 לא מורשה).",
    "serverErrorTitle": "5xx שגיאת שרת:",
    "serverErrorDesc": "מציין שהשרת נתקל בשגיאה בעת עיבוד הבקשה (למשל, 500 שגיאת שרת פנימית, 503 השירות אינו זמין)."
  },
  "ms": {
    "title": "Apakah Kod Status HTTP?",
    "description": "Kod status HTTP ialah nombor tiga digit yang dikembalikan oleh pelayan untuk menunjukkan hasil permintaan pelanggan. Ia dikumpulkan kepada lima kategori:",
    "informationalTitle": "1xx Maklumat:",
    "informationalDesc": "Menunjukkan bahawa permintaan telah diterima dan proses sedang diteruskan.",
    "successTitle": "2xx Berjaya:",
    "successDesc": "Menunjukkan bahawa permintaan telah berjaya diterima, difahami dan diterima.",
    "redirectionTitle": "3xx Ubah hala:",
    "redirectionDesc": "Menunjukkan bahawa tindakan lanjut perlu diambil untuk melengkapkan permintaan.",
    "clientErrorTitle": "4xx Ralat Pelanggan:",
    "clientErrorDesc": "Menunjukkan bahawa pelanggan membuat kesilapan dalam permintaan (contohnya, 404 Tidak Dijumpai, 401 Tidak Dibenarkan).",
    "serverErrorTitle": "5xx Ralat Pelayan:",
    "serverErrorDesc": "Menunjukkan bahawa pelayan menghadapi ralat semasa memproses permintaan (contohnya, 500 Ralat Pelayan Dalaman, 503 Perkhidmatan Tidak Tersedia)."
  },
  "no": {
    "title": "Hva er en HTTP Statuskode?",
    "description": "HTTP statuskoder er tresifrede tall som returneres av en server for a angi resultatet av en klientforesporsel. De er gruppert i fem kategorier:",
    "informationalTitle": "1xx Informativ:",
    "informationalDesc": "Angir at foresporselen ble mottatt og prosessen fortsetter.",
    "successTitle": "2xx Vellykket:",
    "successDesc": "Angir at foresporselen ble mottatt, forstatt og akseptert vellykket.",
    "redirectionTitle": "3xx Omdirigering:",
    "redirectionDesc": "Angir at ytterligere handling ma tas for a fullfore foresporselen.",
    "clientErrorTitle": "4xx Klientfeil:",
    "clientErrorDesc": "Angir at klienten gjorde en feil i foresporselen (f.eks. 404 Ikke Funnet, 401 Ikke Autorisert).",
    "serverErrorTitle": "5xx Serverfeil:",
    "serverErrorDesc": "Angir at serveren stot pa en feil under behandling av foresporselen (f.eks. 500 Intern Serverfeil, 503 Tjeneste Ikke Tilgjengelig)."
  }
}
</i18n>
