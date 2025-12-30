<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <i18n-t keypath="description">
      <template #sos>
        <n-text code>... --- ...</n-text>
      </template>
    </i18n-t>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is Morse Code?",
    "description": "Morse code is a method of encoding text characters using sequences of dots (.) and dashes (-). Invented by Samuel Morse in the 1830s for telegraph communication, it represents each letter and number with a unique combination of short and long signals. For example, the famous distress signal SOS is encoded as {sos}. Morse code is still used today in aviation, amateur radio, and emergency signaling due to its simplicity and reliability."
  },
  "zh": {
    "title": "什么是 Morse 电码？",
    "description": "Morse 电码是一种使用点 (.) 和划 (-) 序列来编码文本字符的方法。它由 Samuel Morse 于 19 世纪 30 年代发明，用于电报通信，每个字母和数字都用短信号和长信号的独特组合表示。例如，著名的求救信号 SOS 编码为 {sos}。由于其简单性和可靠性，Morse 电码至今仍在航空、业余无线电和紧急信号中使用。"
  },
  "zh-CN": {
    "title": "什么是 Morse 电码？",
    "description": "Morse 电码是一种使用点 (.) 和划 (-) 序列来编码文本字符的方法。它由 Samuel Morse 于 19 世纪 30 年代发明，用于电报通信，每个字母和数字都用短信号和长信号的独特组合表示。例如，著名的求救信号 SOS 编码为 {sos}。由于其简单性和可靠性，Morse 电码至今仍在航空、业余无线电和紧急信号中使用。"
  },
  "zh-TW": {
    "title": "什麼是 Morse 電碼？",
    "description": "Morse 電碼是一種使用點 (.) 和劃 (-) 序列來編碼文字字元的方法。它由 Samuel Morse 於 19 世紀 30 年代發明，用於電報通訊，每個字母和數字都用短訊號和長訊號的獨特組合表示。例如，著名的求救訊號 SOS 編碼為 {sos}。由於其簡單性和可靠性，Morse 電碼至今仍在航空、業餘無線電和緊急訊號中使用。"
  },
  "zh-HK": {
    "title": "什麼是 Morse 電碼？",
    "description": "Morse 電碼是一種使用點 (.) 和劃 (-) 序列來編碼文字字元的方法。它由 Samuel Morse 於 19 世紀 30 年代發明，用於電報通訊，每個字母和數字都用短訊號和長訊號的獨特組合表示。例如，著名的求救訊號 SOS 編碼為 {sos}。由於其簡單性和可靠性，Morse 電碼至今仍在航空、業餘無線電和緊急訊號中使用。"
  },
  "es": {
    "title": "¿Qué es el Código Morse?",
    "description": "El código Morse es un método de codificación de caracteres de texto mediante secuencias de puntos (.) y rayas (-). Inventado por Samuel Morse en la década de 1830 para la comunicación telegráfica, representa cada letra y número con una combinación única de señales cortas y largas. Por ejemplo, la famosa señal de socorro SOS se codifica como {sos}. El código Morse todavía se utiliza hoy en día en aviación, radioafición y señalización de emergencia debido a su simplicidad y fiabilidad."
  },
  "fr": {
    "title": "Qu'est-ce que le code Morse ?",
    "description": "Le code Morse est une méthode d'encodage des caractères textuels utilisant des séquences de points (.) et de traits (-). Inventé par Samuel Morse dans les années 1830 pour la communication télégraphique, il représente chaque lettre et chiffre par une combinaison unique de signaux courts et longs. Par exemple, le célèbre signal de détresse SOS est codé {sos}. Le code Morse est encore utilisé aujourd'hui dans l'aviation, la radio amateur et la signalisation d'urgence en raison de sa simplicité et de sa fiabilité."
  },
  "de": {
    "title": "Was ist Morsecode?",
    "description": "Morsecode ist eine Methode zur Kodierung von Textzeichen mithilfe von Sequenzen aus Punkten (.) und Strichen (-). Er wurde von Samuel Morse in den 1830er Jahren für die Telegrafenkommunikation erfunden und stellt jeden Buchstaben und jede Zahl durch eine einzigartige Kombination aus kurzen und langen Signalen dar. Zum Beispiel wird das berühmte Notsignal SOS als {sos} kodiert. Morsecode wird heute noch in der Luftfahrt, im Amateurfunk und bei der Notfallsignalisierung verwendet, da er einfach und zuverlässig ist."
  },
  "it": {
    "title": "Cos'è il codice Morse?",
    "description": "Il codice Morse è un metodo di codifica dei caratteri testuali utilizzando sequenze di punti (.) e linee (-). Inventato da Samuel Morse negli anni '30 dell'Ottocento per la comunicazione telegrafica, rappresenta ogni lettera e numero con una combinazione unica di segnali brevi e lunghi. Ad esempio, il famoso segnale di soccorso SOS è codificato come {sos}. Il codice Morse è ancora utilizzato oggi nell'aviazione, nella radio amatoriale e nella segnalazione di emergenza grazie alla sua semplicità e affidabilità."
  },
  "ja": {
    "title": "Morse 符号とは？",
    "description": "Morse 符号は、点 (.) と線 (-) のシーケンスを使用してテキスト文字をエンコードする方法です。1830 年代に Samuel Morse によって電信通信用に発明され、各文字と数字を短い信号と長い信号のユニークな組み合わせで表現します。たとえば、有名な遭難信号 SOS は {sos} とエンコードされます。Morse 符号は、そのシンプルさと信頼性から、今日でも航空、アマチュア無線、緊急信号で使用されています。"
  },
  "ko": {
    "title": "Morse 부호란?",
    "description": "Morse 부호는 점 (.)과 대시 (-)의 시퀀스를 사용하여 텍스트 문자를 인코딩하는 방법입니다. 1830년대 Samuel Morse가 전신 통신을 위해 발명했으며, 각 문자와 숫자를 짧은 신호와 긴 신호의 고유한 조합으로 나타냅니다. 예를 들어, 유명한 조난 신호 SOS는 {sos}로 인코딩됩니다. Morse 부호는 단순성과 신뢰성 덕분에 오늘날에도 항공, 아마추어 무선 및 긴급 신호에서 사용됩니다."
  },
  "ru": {
    "title": "Что такое азбука Морзе?",
    "description": "Азбука Морзе — это метод кодирования текстовых символов с помощью последовательностей точек (.) и тире (-). Изобретённая Сэмюэлем Морзе в 1830-х годах для телеграфной связи, она представляет каждую букву и цифру уникальной комбинацией коротких и длинных сигналов. Например, знаменитый сигнал бедствия SOS кодируется как {sos}. Азбука Морзе до сих пор используется в авиации, любительском радио и аварийной сигнализации благодаря своей простоте и надёжности."
  },
  "pt": {
    "title": "O que é o Código Morse?",
    "description": "O código Morse é um método de codificação de caracteres de texto usando sequências de pontos (.) e traços (-). Inventado por Samuel Morse na década de 1830 para comunicação telegráfica, ele representa cada letra e número com uma combinação única de sinais curtos e longos. Por exemplo, o famoso sinal de socorro SOS é codificado como {sos}. O código Morse ainda é usado hoje na aviação, rádio amador e sinalização de emergência devido à sua simplicidade e confiabilidade."
  },
  "ar": {
    "title": "ما هي شفرة Morse؟",
    "description": "شفرة Morse هي طريقة لتشفير الأحرف النصية باستخدام تسلسلات من النقاط (.) والشرطات (-). اخترعها Samuel Morse في ثلاثينيات القرن التاسع عشر للاتصالات التلغرافية، وتمثل كل حرف ورقم بمزيج فريد من الإشارات القصيرة والطويلة. على سبيل المثال، يتم ترميز إشارة الاستغاثة الشهيرة SOS كـ {sos}. لا تزال شفرة Morse تُستخدم اليوم في الطيران والراديو الهواة وإشارات الطوارئ نظرًا لبساطتها وموثوقيتها."
  },
  "hi": {
    "title": "Morse कोड क्या है?",
    "description": "Morse कोड बिंदुओं (.) और डैश (-) के अनुक्रमों का उपयोग करके टेक्स्ट वर्णों को एन्कोड करने की एक विधि है। 1830 के दशक में Samuel Morse द्वारा टेलीग्राफ संचार के लिए आविष्कार किया गया, यह प्रत्येक अक्षर और संख्या को छोटे और लंबे संकेतों के एक अद्वितीय संयोजन के साथ दर्शाता है। उदाहरण के लिए, प्रसिद्ध संकट संकेत SOS को {sos} के रूप में एन्कोड किया जाता है। अपनी सरलता और विश्वसनीयता के कारण Morse कोड आज भी विमानन, एमेच्योर रेडियो और आपातकालीन सिग्नलिंग में उपयोग किया जाता है।"
  },
  "tr": {
    "title": "Morse Kodu Nedir?",
    "description": "Morse kodu, metin karakterlerini nokta (.) ve çizgi (-) dizileri kullanarak kodlama yöntemidir. 1830'larda Samuel Morse tarafından telgraf iletişimi için icat edilmiş olup, her harf ve sayıyı kısa ve uzun sinyallerin benzersiz bir kombinasyonuyla temsil eder. Örneğin, ünlü tehlike sinyali SOS, {sos} olarak kodlanır. Morse kodu, basitliği ve güvenilirliği nedeniyle bugün hâlâ havacılık, amatör telsiz ve acil durum sinyalizasyonunda kullanılmaktadır."
  },
  "nl": {
    "title": "Wat is Morse code?",
    "description": "Morse code is een methode om tekstkarakters te coderen met behulp van reeksen punten (.) en strepen (-). Uitgevonden door Samuel Morse in de jaren 1830 voor telegraafcommunicatie, vertegenwoordigt het elke letter en elk cijfer met een unieke combinatie van korte en lange signalen. Het beroemde noodsignaal SOS wordt bijvoorbeeld gecodeerd als {sos}. Morse code wordt vandaag de dag nog steeds gebruikt in de luchtvaart, amateurradio en noodsignalering vanwege zijn eenvoud en betrouwbaarheid."
  },
  "sv": {
    "title": "Vad är Morse-kod?",
    "description": "Morse-kod är en metod för att koda texttecken med hjälp av sekvenser av punkter (.) och streck (-). Den uppfanns av Samuel Morse på 1830-talet för telegrafkommunikation och representerar varje bokstav och siffra med en unik kombination av korta och långa signaler. Till exempel kodas den berömda nödsignalen SOS som {sos}. Morse-kod används fortfarande idag inom flyg, amatörradio och nödsignalering på grund av sin enkelhet och tillförlitlighet."
  },
  "pl": {
    "title": "Czym jest alfabet Morse'a?",
    "description": "Alfabet Morse'a to metoda kodowania znaków tekstowych za pomocą sekwencji kropek (.) i kresek (-). Wynaleziony przez Samuela Morse'a w latach 30. XIX wieku do komunikacji telegraficznej, reprezentuje każdą literę i cyfrę unikalną kombinacją krótkich i długich sygnałów. Na przykład słynny sygnał alarmowy SOS jest kodowany jako {sos}. Alfabet Morse'a jest nadal używany w lotnictwie, radiu amatorskim i sygnalizacji alarmowej ze względu na swoją prostotę i niezawodność."
  },
  "vi": {
    "title": "Mã Morse là gì?",
    "description": "Mã Morse là phương pháp mã hóa các ký tự văn bản bằng cách sử dụng các chuỗi dấu chấm (.) và gạch ngang (-). Được Samuel Morse phát minh vào những năm 1830 cho liên lạc điện báo, nó biểu thị mỗi chữ cái và số bằng một tổ hợp độc đáo của tín hiệu ngắn và dài. Ví dụ, tín hiệu cấp cứu nổi tiếng SOS được mã hóa là {sos}. Mã Morse vẫn được sử dụng ngày nay trong hàng không, radio nghiệp dư và tín hiệu khẩn cấp nhờ tính đơn giản và độ tin cậy của nó."
  },
  "th": {
    "title": "รหัส Morse คืออะไร?",
    "description": "รหัส Morse เป็นวิธีการเข้ารหัสอักขระข้อความโดยใช้ลำดับของจุด (.) และขีด (-) ถูกคิดค้นโดย Samuel Morse ในทศวรรษที่ 1830 สำหรับการสื่อสารทางโทรเลข โดยแสดงตัวอักษรและตัวเลขแต่ละตัวด้วยการผสมผสานที่ไม่ซ้ำกันของสัญญาณสั้นและยาว ตัวอย่างเช่น สัญญาณขอความช่วยเหลือที่มีชื่อเสียง SOS ถูกเข้ารหัสเป็น {sos} รหัส Morse ยังคงถูกใช้ในปัจจุบันในการบิน วิทยุสมัครเล่น และการส่งสัญญาณฉุกเฉินเนื่องจากความเรียบง่ายและความน่าเชื่อถือ"
  },
  "id": {
    "title": "Apa itu Kode Morse?",
    "description": "Kode Morse adalah metode pengkodean karakter teks menggunakan urutan titik (.) dan garis (-). Ditemukan oleh Samuel Morse pada tahun 1830-an untuk komunikasi telegraf, kode ini merepresentasikan setiap huruf dan angka dengan kombinasi unik sinyal pendek dan panjang. Misalnya, sinyal darurat terkenal SOS dikodekan sebagai {sos}. Kode Morse masih digunakan saat ini dalam penerbangan, radio amatir, dan sinyal darurat karena kesederhanaan dan keandalannya."
  },
  "he": {
    "title": "מהי קוד Morse?",
    "description": "קוד Morse הוא שיטה לקידוד תווי טקסט באמצעות רצפים של נקודות (.) וקווים (-). הומצא על ידי Samuel Morse בשנות ה-1830 לתקשורת טלגרף, הוא מייצג כל אות ומספר בשילוב ייחודי של אותות קצרים וארוכים. לדוגמה, אות המצוקה המפורסם SOS מקודד כ-{sos}. קוד Morse עדיין בשימוש כיום בתעופה, ברדיו חובבים ובאיתות חירום בזכות פשטותו ואמינותו."
  },
  "ms": {
    "title": "Apakah Kod Morse?",
    "description": "Kod Morse ialah kaedah pengekodan aksara teks menggunakan jujukan titik (.) dan sengkang (-). Dicipta oleh Samuel Morse pada tahun 1830-an untuk komunikasi telegraf, ia mewakili setiap huruf dan nombor dengan gabungan unik isyarat pendek dan panjang. Sebagai contoh, isyarat kecemasan terkenal SOS dikodkan sebagai {sos}. Kod Morse masih digunakan hari ini dalam penerbangan, radio amatur dan isyarat kecemasan kerana kesederhanaan dan kebolehpercayaannya."
  },
  "no": {
    "title": "Hva er Morse-kode?",
    "description": "Morse-kode er en metode for å kode teksttegn ved hjelp av sekvenser av punkter (.) og streker (-). Den ble oppfunnet av Samuel Morse på 1830-tallet for telegrafkommunikasjon, og representerer hver bokstav og tall med en unik kombinasjon av korte og lange signaler. For eksempel er det berømte nødsignalet SOS kodet som {sos}. Morse-kode brukes fortsatt i dag innen luftfart, amatørradio og nødsignalering på grunn av sin enkelhet og pålitelighet."
  }
}
</i18n>
