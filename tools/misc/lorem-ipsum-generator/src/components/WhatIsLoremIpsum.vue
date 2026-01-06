<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('description') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is Lorem Ipsum?",
    "description": "Lorem Ipsum is dummy text used in the printing and typesetting industry. It has been the industry's standard placeholder text since the 1500s. Designers and developers use it to fill layouts before final content is available, allowing them to focus on visual design without being distracted by readable content."
  },
  "zh": {
    "title": "什么是 Lorem Ipsum？",
    "description": "Lorem Ipsum 是印刷和排版行业中使用的占位文本。自 16 世纪以来，它一直是行业标准的占位文本。设计师和开发人员在最终内容可用之前使用它来填充布局，使他们能够专注于视觉设计而不受可读内容的干扰。"
  },
  "zh-CN": {
    "title": "什么是 Lorem Ipsum？",
    "description": "Lorem Ipsum 是印刷和排版行业中使用的占位文本。自 16 世纪以来，它一直是行业标准的占位文本。设计师和开发人员在最终内容可用之前使用它来填充布局，使他们能够专注于视觉设计而不受可读内容的干扰。"
  },
  "zh-TW": {
    "title": "什麼是 Lorem Ipsum？",
    "description": "Lorem Ipsum 是印刷和排版行業中使用的佔位文字。自 16 世紀以來，它一直是行業標準的佔位文字。設計師和開發人員在最終內容可用之前使用它來填充版面，使他們能夠專注於視覺設計而不受可讀內容的干擾。"
  },
  "zh-HK": {
    "title": "什麼是 Lorem Ipsum？",
    "description": "Lorem Ipsum 是印刷和排版行業中使用的佔位文字。自 16 世紀以來，它一直是行業標準的佔位文字。設計師和開發人員在最終內容可用之前使用它來填充版面，使他們能夠專注於視覺設計而不受可讀內容的干擾。"
  },
  "es": {
    "title": "¿Qué es Lorem Ipsum?",
    "description": "Lorem Ipsum es texto de relleno utilizado en la industria de la impresión y la tipografía. Ha sido el texto de marcador de posición estándar de la industria desde el siglo XVI. Los diseñadores y desarrolladores lo utilizan para llenar diseños antes de que el contenido final esté disponible, permitiéndoles centrarse en el diseño visual sin distraerse con contenido legible."
  },
  "fr": {
    "title": "Qu'est-ce que Lorem Ipsum ?",
    "description": "Lorem Ipsum est un texte de remplissage utilisé dans l'industrie de l'impression et de la composition. C'est le texte de remplissage standard de l'industrie depuis les années 1500. Les designers et développeurs l'utilisent pour remplir les mises en page avant que le contenu final soit disponible, leur permettant de se concentrer sur le design visuel sans être distraits par un contenu lisible."
  },
  "de": {
    "title": "Was ist Lorem Ipsum?",
    "description": "Lorem Ipsum ist Blindtext, der in der Druck- und Satzindustrie verwendet wird. Es ist seit den 1500er Jahren der Standardplatzhaltertext der Branche. Designer und Entwickler verwenden ihn, um Layouts zu füllen, bevor der endgültige Inhalt verfügbar ist, sodass sie sich auf das visuelle Design konzentrieren können, ohne von lesbarem Inhalt abgelenkt zu werden."
  },
  "it": {
    "title": "Cos'è Lorem Ipsum?",
    "description": "Lorem Ipsum è un testo fittizio utilizzato nell'industria della stampa e della composizione tipografica. È stato il testo segnaposto standard del settore sin dal 1500. Designer e sviluppatori lo utilizzano per riempire i layout prima che il contenuto finale sia disponibile, permettendo loro di concentrarsi sul design visivo senza essere distratti da contenuti leggibili."
  },
  "ja": {
    "title": "Lorem Ipsum とは？",
    "description": "Lorem Ipsum は、印刷・組版業界で使用されるダミーテキストです。1500年代から業界標準のプレースホルダーテキストとして使用されています。デザイナーや開発者は、最終的なコンテンツが利用可能になる前にレイアウトを埋めるために使用し、読み取り可能なコンテンツに気を取られることなく、ビジュアルデザインに集中できます。"
  },
  "ko": {
    "title": "Lorem Ipsum이란?",
    "description": "Lorem Ipsum은 인쇄 및 조판 산업에서 사용되는 더미 텍스트입니다. 1500년대부터 업계 표준 플레이스홀더 텍스트로 사용되어 왔습니다. 디자이너와 개발자는 최종 콘텐츠가 준비되기 전에 레이아웃을 채우기 위해 사용하며, 읽을 수 있는 콘텐츠에 방해받지 않고 시각적 디자인에 집중할 수 있습니다."
  },
  "ru": {
    "title": "Что такое Lorem Ipsum?",
    "description": "Lorem Ipsum — это текст-заполнитель, используемый в полиграфической и типографской индустрии. Он является стандартным текстом-заполнителем в отрасли с 1500-х годов. Дизайнеры и разработчики используют его для заполнения макетов до того, как будет доступен окончательный контент, что позволяет им сосредоточиться на визуальном дизайне, не отвлекаясь на читаемый контент."
  },
  "pt": {
    "title": "O que é Lorem Ipsum?",
    "description": "Lorem Ipsum é um texto fictício usado na indústria de impressão e tipografia. Tem sido o texto de preenchimento padrão da indústria desde os anos 1500. Designers e desenvolvedores o utilizam para preencher layouts antes que o conteúdo final esteja disponível, permitindo-lhes focar no design visual sem serem distraídos por conteúdo legível."
  },
  "ar": {
    "title": "ما هو Lorem Ipsum؟",
    "description": "Lorem Ipsum هو نص وهمي يُستخدم في صناعة الطباعة والتنضيد. وقد كان النص البديل القياسي في الصناعة منذ القرن السادس عشر. يستخدمه المصممون والمطورون لملء التخطيطات قبل توفر المحتوى النهائي، مما يسمح لهم بالتركيز على التصميم المرئي دون تشتيت الانتباه بمحتوى قابل للقراءة."
  },
  "hi": {
    "title": "Lorem Ipsum क्या है?",
    "description": "Lorem Ipsum प्रिंटिंग और टाइपसेटिंग उद्योग में उपयोग किया जाने वाला डमी टेक्स्ट है। यह 1500 के दशक से उद्योग का मानक प्लेसहोल्डर टेक्स्ट रहा है। डिज़ाइनर और डेवलपर इसका उपयोग अंतिम सामग्री उपलब्ध होने से पहले लेआउट भरने के लिए करते हैं, जिससे वे पढ़ने योग्य सामग्री से विचलित हुए बिना दृश्य डिज़ाइन पर ध्यान केंद्रित कर सकते हैं।"
  },
  "tr": {
    "title": "Lorem Ipsum Nedir?",
    "description": "Lorem Ipsum, baskı ve dizgi endüstrisinde kullanılan sahte metindir. 1500'lerden beri endüstrinin standart yer tutucu metni olmuştur. Tasarımcılar ve geliştiriciler, son içerik hazır olmadan önce düzenleri doldurmak için kullanırlar, bu da okunabilir içerikle dikkatlerinin dağılmadan görsel tasarıma odaklanmalarını sağlar."
  },
  "nl": {
    "title": "Wat is Lorem Ipsum?",
    "description": "Lorem Ipsum is dummy tekst die wordt gebruikt in de druk- en zetindustrie. Het is sinds de jaren 1500 de standaard placeholder tekst van de industrie. Ontwerpers en ontwikkelaars gebruiken het om lay-outs te vullen voordat de definitieve inhoud beschikbaar is, zodat ze zich kunnen concentreren op het visuele ontwerp zonder afgeleid te worden door leesbare inhoud."
  },
  "sv": {
    "title": "Vad är Lorem Ipsum?",
    "description": "Lorem Ipsum är dummytext som används inom tryck- och typografiindustrin. Det har varit branschens standardplatshållartext sedan 1500-talet. Designers och utvecklare använder det för att fylla layouter innan det slutliga innehållet är tillgängligt, vilket gör att de kan fokusera på visuell design utan att distraheras av läsbart innehåll."
  },
  "pl": {
    "title": "Czym jest Lorem Ipsum?",
    "description": "Lorem Ipsum to tekst zastępczy używany w branży drukarskiej i składu. Jest standardowym tekstem zastępczym w branży od XVI wieku. Projektanci i programiści używają go do wypełniania układów, zanim dostępna będzie ostateczna treść, co pozwala im skupić się na projektowaniu wizualnym bez rozpraszania się czytelną treścią."
  },
  "vi": {
    "title": "Lorem Ipsum là gì?",
    "description": "Lorem Ipsum là văn bản giả được sử dụng trong ngành in ấn và sắp chữ. Nó đã là văn bản giữ chỗ tiêu chuẩn của ngành từ những năm 1500. Các nhà thiết kế và nhà phát triển sử dụng nó để điền vào bố cục trước khi nội dung cuối cùng có sẵn, cho phép họ tập trung vào thiết kế hình ảnh mà không bị phân tâm bởi nội dung có thể đọc được."
  },
  "th": {
    "title": "Lorem Ipsum คืออะไร?",
    "description": "Lorem Ipsum คือข้อความจำลองที่ใช้ในอุตสาหกรรมการพิมพ์และการจัดพิมพ์ เป็นข้อความตัวยึดตำแหน่งมาตรฐานของอุตสาหกรรมตั้งแต่ศตวรรษที่ 16 นักออกแบบและนักพัฒนาใช้เพื่อเติมเลย์เอาต์ก่อนที่เนื้อหาสุดท้ายจะพร้อมใช้งาน ช่วยให้พวกเขาสามารถมุ่งเน้นที่การออกแบบภาพโดยไม่ถูกรบกวนจากเนื้อหาที่อ่านได้"
  },
  "id": {
    "title": "Apa itu Lorem Ipsum?",
    "description": "Lorem Ipsum adalah teks dummy yang digunakan dalam industri percetakan dan penyusunan huruf. Ini telah menjadi teks placeholder standar industri sejak tahun 1500-an. Desainer dan pengembang menggunakannya untuk mengisi tata letak sebelum konten akhir tersedia, memungkinkan mereka fokus pada desain visual tanpa terganggu oleh konten yang dapat dibaca."
  },
  "he": {
    "title": "מה זה Lorem Ipsum?",
    "description": "Lorem Ipsum הוא טקסט דמה המשמש בתעשיית הדפוס והסדר. הוא היה טקסט ממלא המקום הסטנדרטי של התעשייה מאז שנות ה-1500. מעצבים ומפתחים משתמשים בו כדי למלא פריסות לפני שהתוכן הסופי זמין, מה שמאפשר להם להתמקד בעיצוב חזותי מבלי להסיח את דעתם על ידי תוכן קריא."
  },
  "ms": {
    "title": "Apakah Lorem Ipsum?",
    "description": "Lorem Ipsum ialah teks tiruan yang digunakan dalam industri percetakan dan penataan huruf. Ia telah menjadi teks pemegang tempat standard industri sejak tahun 1500-an. Pereka dan pembangun menggunakannya untuk mengisi susun atur sebelum kandungan akhir tersedia, membolehkan mereka menumpukan pada reka bentuk visual tanpa terganggu oleh kandungan yang boleh dibaca."
  },
  "no": {
    "title": "Hva er Lorem Ipsum?",
    "description": "Lorem Ipsum er dummytekst brukt i trykkeri- og settingsindustrien. Det har vært bransjens standard plassholdertekst siden 1500-tallet. Designere og utviklere bruker det til å fylle layouter før det endelige innholdet er tilgjengelig, slik at de kan fokusere på visuell design uten å bli distrahert av lesbart innhold."
  }
}
</i18n>
