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
      "300": "The request has more than one possible response. The user agent should choose one of them.",
      "301": "The URL of the requested resource has been changed permanently.",
      "302": "The URL of the requested resource has been changed temporarily.",
      "304": "Indicates that the resource has not been modified since the version specified by the request headers.",
      "307": "The server is redirecting the user agent to a different resource, as indicated by a Location header.",
      "308": "The resource is now permanently located at another URL, specified by the Location header."
    }
  },
  "zh": {
    "description": {
      "300": "请求有多个可能的响应。用户代理应选择其中一个。",
      "301": "请求资源的 URL 已永久更改。",
      "302": "请求资源的 URL 已临时更改。",
      "304": "表示自请求头指定的版本以来，资源未被修改。",
      "307": "服务器正在将用户代理重定向到不同的资源，如 Location 头所示。",
      "308": "资源现在永久位于另一个 URL，由 Location 头指定。"
    }
  },
  "zh-CN": {
    "description": {
      "300": "请求有多个可能的响应。用户代理应选择其中一个。",
      "301": "请求资源的 URL 已永久更改。",
      "302": "请求资源的 URL 已临时更改。",
      "304": "表示自请求头指定的版本以来，资源未被修改。",
      "307": "服务器正在将用户代理重定向到不同的资源，如 Location 头所示。",
      "308": "资源现在永久位于另一个 URL，由 Location 头指定。"
    }
  },
  "zh-TW": {
    "description": {
      "300": "請求有多個可能的回應。用戶代理應選擇其中一個。",
      "301": "請求資源的 URL 已永久更改。",
      "302": "請求資源的 URL 已臨時更改。",
      "304": "表示自請求標頭指定的版本以來，資源未被修改。",
      "307": "伺服器正在將用戶代理重新導向到不同的資源，如 Location 標頭所示。",
      "308": "資源現在永久位於另一個 URL，由 Location 標頭指定。"
    }
  },
  "zh-HK": {
    "description": {
      "300": "請求有多個可能的回應。用戶代理應選擇其中一個。",
      "301": "請求資源的 URL 已永久更改。",
      "302": "請求資源的 URL 已臨時更改。",
      "304": "表示自請求標頭指定的版本以來，資源未被修改。",
      "307": "伺服器正在將用戶代理重新導向到不同的資源，如 Location 標頭所示。",
      "308": "資源現在永久位於另一個 URL，由 Location 標頭指定。"
    }
  },
  "es": {
    "description": {
      "300": "La solicitud tiene mas de una respuesta posible. El agente de usuario debe elegir una de ellas.",
      "301": "La URL del recurso solicitado ha sido cambiada permanentemente.",
      "302": "La URL del recurso solicitado ha sido cambiada temporalmente.",
      "304": "Indica que el recurso no ha sido modificado desde la version especificada por los encabezados de la solicitud.",
      "307": "El servidor esta redirigiendo al agente de usuario a un recurso diferente, como se indica en un encabezado Location.",
      "308": "El recurso ahora esta permanentemente ubicado en otra URL, especificada por el encabezado Location."
    }
  },
  "fr": {
    "description": {
      "300": "La requete a plus d'une reponse possible. L'agent utilisateur doit en choisir une.",
      "301": "L'URL de la ressource demandee a ete modifiee de maniere permanente.",
      "302": "L'URL de la ressource demandee a ete modifiee temporairement.",
      "304": "Indique que la ressource n'a pas ete modifiee depuis la version specifiee par les en-tetes de la requete.",
      "307": "Le serveur redirige l'agent utilisateur vers une ressource differente, comme indique par un en-tete Location.",
      "308": "La ressource est maintenant situee de maniere permanente a une autre URL, specifiee par l'en-tete Location."
    }
  },
  "de": {
    "description": {
      "300": "Die Anfrage hat mehr als eine mogliche Antwort. Der Benutzer-Agent sollte eine davon wahlen.",
      "301": "Die URL der angeforderten Ressource wurde dauerhaft geandert.",
      "302": "Die URL der angeforderten Ressource wurde vorubergehend geandert.",
      "304": "Gibt an, dass die Ressource seit der von den Anfrage-Headern angegebenen Version nicht geandert wurde.",
      "307": "Der Server leitet den Benutzer-Agent zu einer anderen Ressource um, wie durch einen Location-Header angegeben.",
      "308": "Die Ressource befindet sich jetzt dauerhaft an einer anderen URL, die durch den Location-Header angegeben ist."
    }
  },
  "it": {
    "description": {
      "300": "La richiesta ha piu di una risposta possibile. L'agente utente dovrebbe sceglierne una.",
      "301": "L'URL della risorsa richiesta e stata modificata permanentemente.",
      "302": "L'URL della risorsa richiesta e stata modificata temporaneamente.",
      "304": "Indica che la risorsa non e stata modificata dalla versione specificata dalle intestazioni della richiesta.",
      "307": "Il server sta reindirizzando l'agente utente a una risorsa diversa, come indicato da un'intestazione Location.",
      "308": "La risorsa e ora permanentemente situata in un altro URL, specificato dall'intestazione Location."
    }
  },
  "ja": {
    "description": {
      "300": "リクエストには複数の可能な応答があります。ユーザーエージェントはそのうちの1つを選択する必要があります。",
      "301": "要求されたリソースのURLが永続的に変更されました。",
      "302": "要求されたリソースのURLが一時的に変更されました。",
      "304": "リクエストヘッダーで指定されたバージョン以降、リソースが変更されていないことを示します。",
      "307": "サーバーは、Locationヘッダーで示されているように、ユーザーエージェントを別のリソースにリダイレクトしています。",
      "308": "リソースは現在、Locationヘッダーで指定された別のURLに永続的に配置されています。"
    }
  },
  "ko": {
    "description": {
      "300": "요청에 여러 가지 가능한 응답이 있습니다. 사용자 에이전트는 그 중 하나를 선택해야 합니다.",
      "301": "요청된 리소스의 URL이 영구적으로 변경되었습니다.",
      "302": "요청된 리소스의 URL이 일시적으로 변경되었습니다.",
      "304": "요청 헤더로 지정된 버전 이후 리소스가 수정되지 않았음을 나타냅니다.",
      "307": "서버가 Location 헤더로 표시된 대로 사용자 에이전트를 다른 리소스로 리디렉션하고 있습니다.",
      "308": "리소스가 이제 Location 헤더로 지정된 다른 URL에 영구적으로 위치합니다."
    }
  },
  "ru": {
    "description": {
      "300": "Запрос имеет более одного возможного ответа. Агент пользователя должен выбрать один из них.",
      "301": "URL запрошенного ресурса был изменен навсегда.",
      "302": "URL запрошенного ресурса был изменен временно.",
      "304": "Указывает, что ресурс не был изменен с версии, указанной в заголовках запроса.",
      "307": "Сервер перенаправляет агента пользователя на другой ресурс, как указано в заголовке Location.",
      "308": "Ресурс теперь постоянно находится по другому URL, указанному в заголовке Location."
    }
  },
  "pt": {
    "description": {
      "300": "A solicitacao tem mais de uma resposta possivel. O agente do usuario deve escolher uma delas.",
      "301": "A URL do recurso solicitado foi alterada permanentemente.",
      "302": "A URL do recurso solicitado foi alterada temporariamente.",
      "304": "Indica que o recurso nao foi modificado desde a versao especificada pelos cabecalhos da solicitacao.",
      "307": "O servidor esta redirecionando o agente do usuario para um recurso diferente, conforme indicado por um cabecalho Location.",
      "308": "O recurso agora esta permanentemente localizado em outra URL, especificada pelo cabecalho Location."
    }
  },
  "ar": {
    "description": {
      "300": "الطلب له أكثر من رد محتمل. يجب على وكيل المستخدم اختيار واحد منها.",
      "301": "تم تغيير عنوان URL للمورد المطلوب بشكل دائم.",
      "302": "تم تغيير عنوان URL للمورد المطلوب مؤقتًا.",
      "304": "يشير إلى أن المورد لم يتم تعديله منذ الإصدار المحدد بواسطة رؤوس الطلب.",
      "307": "يعيد الخادم توجيه وكيل المستخدم إلى مورد مختلف، كما هو موضح برأس Location.",
      "308": "المورد موجود الآن بشكل دائم في عنوان URL آخر، محدد برأس Location."
    }
  },
  "hi": {
    "description": {
      "300": "अनुरोध में एक से अधिक संभावित प्रतिक्रियाएं हैं। उपयोगकर्ता एजेंट को उनमें से एक चुनना चाहिए।",
      "301": "अनुरोधित संसाधन का URL स्थायी रूप से बदल दिया गया है।",
      "302": "अनुरोधित संसाधन का URL अस्थायी रूप से बदल दिया गया है।",
      "304": "इंगित करता है कि अनुरोध हेडर द्वारा निर्दिष्ट संस्करण के बाद से संसाधन संशोधित नहीं किया गया है।",
      "307": "सर्वर उपयोगकर्ता एजेंट को एक अलग संसाधन पर पुनर्निर्देशित कर रहा है, जैसा कि Location हेडर द्वारा इंगित किया गया है।",
      "308": "संसाधन अब स्थायी रूप से दूसरे URL पर स्थित है, Location हेडर द्वारा निर्दिष्ट।"
    }
  },
  "tr": {
    "description": {
      "300": "Istegin birden fazla olası yaniti var. Kullanici aracisi bunlardan birini seçmelidir.",
      "301": "Istek edilen kaynagin URL'si kalici olarak degistirildi.",
      "302": "Istek edilen kaynagin URL'si geçici olarak degistirildi.",
      "304": "Kaynagin, istek basliklari tarafindan belirtilen sürümden bu yana degistirilmedigini gösterir.",
      "307": "Sunucu, bir Location basligiyla belirtildigi gibi kullanici aracisini farkli bir kaynaga yönlendiriyor.",
      "308": "Kaynak artik kalici olarak Location basligiyla belirtilen baska bir URL'de bulunuyor."
    }
  },
  "nl": {
    "description": {
      "300": "Het verzoek heeft meer dan één mogelijk antwoord. De user agent moet er één kiezen.",
      "301": "De URL van de gevraagde bron is permanent gewijzigd.",
      "302": "De URL van de gevraagde bron is tijdelijk gewijzigd.",
      "304": "Geeft aan dat de bron niet is gewijzigd sinds de versie die is opgegeven door de verzoekheaders.",
      "307": "De server leidt de user agent om naar een andere bron, zoals aangegeven door een Location-header.",
      "308": "De bron bevindt zich nu permanent op een andere URL, opgegeven door de Location-header."
    }
  },
  "sv": {
    "description": {
      "300": "Begäran har mer än ett möjligt svar. Användaragenten bör välja ett av dem.",
      "301": "URL:en för den begärda resursen har ändrats permanent.",
      "302": "URL:en för den begärda resursen har ändrats tillfälligt.",
      "304": "Anger att resursen inte har ändrats sedan versionen som anges av begäranhuvudena.",
      "307": "Servern omdirigerar användaragenten till en annan resurs, som anges av ett Location-huvud.",
      "308": "Resursen finns nu permanent på en annan URL, angiven av Location-huvudet."
    }
  },
  "pl": {
    "description": {
      "300": "Zadanie ma wiecej niz jedna mozliwa odpowiedz. Agent uzytkownika powinien wybrac jedna z nich.",
      "301": "URL zadanego zasobu zostal trwale zmieniony.",
      "302": "URL zadanego zasobu zostal tymczasowo zmieniony.",
      "304": "Wskazuje, ze zasob nie zostal zmodyfikowany od wersji okreslonej przez naglowki zadania.",
      "307": "Serwer przekierowuje agenta uzytkownika do innego zasobu, jak wskazuje naglowek Location.",
      "308": "Zasob jest teraz trwale zlokalizowany pod innym URL, okreslonym przez naglowek Location."
    }
  },
  "vi": {
    "description": {
      "300": "Yêu cầu có nhiều hơn một phản hồi có thể. Tác nhân người dùng nên chọn một trong số chúng.",
      "301": "URL của tài nguyên được yêu cầu đã được thay đổi vĩnh viễn.",
      "302": "URL của tài nguyên được yêu cầu đã được thay đổi tạm thời.",
      "304": "Chỉ ra rằng tài nguyên chưa được sửa đổi kể từ phiên bản được chỉ định bởi các tiêu đề yêu cầu.",
      "307": "Máy chủ đang chuyển hướng tác nhân người dùng đến một tài nguyên khác, như được chỉ định bởi tiêu đề Location.",
      "308": "Tài nguyên hiện đang được đặt vĩnh viễn tại một URL khác, được chỉ định bởi tiêu đề Location."
    }
  },
  "th": {
    "description": {
      "300": "คำขอมีคำตอบที่เป็นไปได้มากกว่าหนึ่งคำตอบ ตัวแทนผู้ใช้ควรเลือกหนึ่งในนั้น",
      "301": "URL ของทรัพยากรที่ร้องขอได้รับการเปลี่ยนแปลงอย่างถาวร",
      "302": "URL ของทรัพยากรที่ร้องขอได้รับการเปลี่ยนแปลงชั่วคราว",
      "304": "ระบุว่าทรัพยากรไม่ได้รับการแก้ไขตั้งแต่เวอร์ชันที่ระบุโดยส่วนหัวของคำขอ",
      "307": "เซิร์ฟเวอร์กำลังเปลี่ยนเส้นทางตัวแทนผู้ใช้ไปยังทรัพยากรอื่น ตามที่ระบุโดยส่วนหัว Location",
      "308": "ทรัพยากรอยู่ที่ URL อื่นอย่างถาวร ตามที่ระบุโดยส่วนหัว Location"
    }
  },
  "id": {
    "description": {
      "300": "Permintaan memiliki lebih dari satu respons yang mungkin. Agen pengguna harus memilih salah satunya.",
      "301": "URL sumber daya yang diminta telah diubah secara permanen.",
      "302": "URL sumber daya yang diminta telah diubah sementara.",
      "304": "Menunjukkan bahwa sumber daya belum dimodifikasi sejak versi yang ditentukan oleh header permintaan.",
      "307": "Server mengarahkan ulang agen pengguna ke sumber daya yang berbeda, seperti yang ditunjukkan oleh header Location.",
      "308": "Sumber daya sekarang secara permanen berada di URL lain, yang ditentukan oleh header Location."
    }
  },
  "he": {
    "description": {
      "300": "לבקשה יש יותר מתגובה אפשרית אחת. סוכן המשתמש צריך לבחור אחת מהן.",
      "301": "כתובת ה-URL של המשאב המבוקש שונתה לצמיתות.",
      "302": "כתובת ה-URL של המשאב המבוקש שונתה זמנית.",
      "304": "מציין שהמשאב לא שונה מאז הגרסה שצוינה על ידי כותרות הבקשה.",
      "307": "השרת מפנה את סוכן המשתמש למשאב אחר, כפי שמצוין על ידי כותרת Location.",
      "308": "המשאב נמצא כעת לצמיתות בכתובת URL אחרת, שצוינה על ידי כותרת Location."
    }
  },
  "ms": {
    "description": {
      "300": "Permintaan mempunyai lebih daripada satu respons yang mungkin. Ejen pengguna harus memilih salah satu daripadanya.",
      "301": "URL sumber yang diminta telah diubah secara kekal.",
      "302": "URL sumber yang diminta telah diubah sementara.",
      "304": "Menunjukkan bahawa sumber tidak diubah sejak versi yang ditentukan oleh pengepala permintaan.",
      "307": "Pelayan mengalihkan ejen pengguna ke sumber yang berbeza, seperti yang ditunjukkan oleh pengepala Location.",
      "308": "Sumber kini terletak secara kekal di URL lain, yang ditentukan oleh pengepala Location."
    }
  },
  "no": {
    "description": {
      "300": "Forespørselen har mer enn ett mulig svar. Brukeragenten bør velge ett av dem.",
      "301": "URL-en til den forespurte ressursen har blitt endret permanent.",
      "302": "URL-en til den forespurte ressursen har blitt endret midlertidig.",
      "304": "Angir at ressursen ikke har blitt endret siden versjonen spesifisert av foresporselshodene.",
      "307": "Serveren omdirigerer brukeragenten til en annen ressurs, som angitt av et Location-hode.",
      "308": "Ressursen er nå permanent lokalisert på en annen URL, spesifisert av Location-hodet."
    }
  }
}
</i18n>
