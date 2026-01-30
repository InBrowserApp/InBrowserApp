<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <NText>{{ t('description') }}</NText>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a MIME Type?",
    "description": "MIME (Multipurpose Internet Mail Extensions) types are a standard way of indicating the nature and format of a document or file. They are used by web browsers and servers to determine how to handle files. MIME types consist of a type and a subtype, separated by a slash (e.g., text/html). The main categories are:"
  },
  "zh": {
    "title": "什么是 MIME 类型？",
    "description": "MIME（多用途互联网邮件扩展）类型是表示文档或文件性质和格式的标准方式。它们被 Web 浏览器和服务器用来确定如何处理文件。MIME 类型由类型和子类型组成，用斜杠分隔（例如，text/html）。主要类别包括："
  },
  "zh-CN": {
    "title": "什么是 MIME 类型？",
    "description": "MIME（多用途互联网邮件扩展）类型是表示文档或文件性质和格式的标准方式。它们被 Web 浏览器和服务器用来确定如何处理文件。MIME 类型由类型和子类型组成，用斜杠分隔（例如，text/html）。主要类别包括："
  },
  "zh-TW": {
    "title": "什麼是 MIME 類型？",
    "description": "MIME（多用途網際網路郵件延伸）類型是表示文件或檔案性質和格式的標準方式。它們被網頁瀏覽器和伺服器用來確定如何處理檔案。MIME 類型由類型和子類型組成，用斜線分隔（例如，text/html）。主要類別包括："
  },
  "zh-HK": {
    "title": "什麼是 MIME 類型？",
    "description": "MIME（多用途網際網路郵件延伸）類型是表示文件或檔案性質和格式的標準方式。它們被網頁瀏覽器和伺服器用來確定如何處理檔案。MIME 類型由類型和子類型組成，用斜線分隔（例如，text/html）。主要類別包括："
  },
  "es": {
    "title": "¿Qué es un Tipo MIME?",
    "description": "Los tipos MIME (Extensiones Multipropósito de Correo de Internet) son una forma estándar de indicar la naturaleza y el formato de un documento o archivo. Son utilizados por los navegadores web y servidores para determinar cómo manejar archivos. Los tipos MIME consisten en un tipo y un subtipo, separados por una barra diagonal (por ejemplo, text/html). Las categorías principales son:"
  },
  "fr": {
    "title": "Qu'est-ce qu'un Type MIME ?",
    "description": "Les types MIME (Extensions Multi-Usage du Courrier Internet) sont un moyen standard d'indiquer la nature et le format d'un document ou d'un fichier. Ils sont utilisés par les navigateurs web et les serveurs pour déterminer comment gérer les fichiers. Les types MIME consistent en un type et un sous-type, séparés par une barre oblique (par exemple, text/html). Les catégories principales sont :"
  },
  "de": {
    "title": "Was ist ein MIME-Typ?",
    "description": "MIME-Typen (Multipurpose Internet Mail Extensions) sind eine Standardmethode zur Angabe der Art und des Formats eines Dokuments oder einer Datei. Sie werden von Webbrowsern und Servern verwendet, um zu bestimmen, wie Dateien behandelt werden. MIME-Typen bestehen aus einem Typ und einem Untertyp, getrennt durch einen Schrägstrich (z.B. text/html). Die Hauptkategorien sind:"
  },
  "it": {
    "title": "Cos'è un Tipo MIME?",
    "description": "I tipi MIME (Multipurpose Internet Mail Extensions) sono un modo standard per indicare la natura e il formato di un documento o file. Sono utilizzati dai browser web e dai server per determinare come gestire i file. I tipi MIME consistono in un tipo e un sottotipo, separati da una barra (ad esempio, text/html). Le categorie principali sono:"
  },
  "ja": {
    "title": "MIME タイプとは？",
    "description": "MIME（多目的インターネットメール拡張）タイプは、ドキュメントやファイルの性質と形式を示す標準的な方法です。Web ブラウザやサーバーがファイルの処理方法を決定するために使用されます。MIME タイプは、タイプとサブタイプで構成され、スラッシュで区切られます（例：text/html）。主なカテゴリは次のとおりです："
  },
  "ko": {
    "title": "MIME 유형이란?",
    "description": "MIME(다목적 인터넷 메일 확장) 유형은 문서나 파일의 성격과 형식을 나타내는 표준 방법입니다. 웹 브라우저와 서버가 파일을 처리하는 방법을 결정하는 데 사용됩니다. MIME 유형은 유형과 하위 유형으로 구성되며 슬래시로 구분됩니다(예: text/html). 주요 범주는 다음과 같습니다:"
  },
  "ru": {
    "title": "Что такое MIME-тип?",
    "description": "MIME-типы (Multipurpose Internet Mail Extensions) — это стандартный способ указания природы и формата документа или файла. Они используются веб-браузерами и серверами для определения способа обработки файлов. MIME-типы состоят из типа и подтипа, разделенных косой чертой (например, text/html). Основные категории:"
  },
  "pt": {
    "title": "O que é um Tipo MIME?",
    "description": "Os tipos MIME (Extensões Multipropósito de Correio da Internet) são uma forma padrão de indicar a natureza e o formato de um documento ou arquivo. Eles são usados por navegadores web e servidores para determinar como lidar com arquivos. Os tipos MIME consistem em um tipo e um subtipo, separados por uma barra (por exemplo, text/html). As categorias principais são:"
  },
  "ar": {
    "title": "ما هو نوع MIME؟",
    "description": "أنواع MIME (ملحقات البريد الإلكتروني متعددة الأغراض) هي طريقة قياسية للإشارة إلى طبيعة وتنسيق المستند أو الملف. يتم استخدامها بواسطة متصفحات الويب والخوادم لتحديد كيفية التعامل مع الملفات. تتكون أنواع MIME من نوع ونوع فرعي، مفصولة بشرطة مائلة (على سبيل المثال، text/html). الفئات الرئيسية هي:"
  },
  "hi": {
    "title": "MIME प्रकार क्या है?",
    "description": "MIME (बहुउद्देशीय इंटरनेट मेल एक्सटेंशन) प्रकार एक दस्तावेज़ या फ़ाइल की प्रकृति और प्रारूप को इंगित करने का एक मानक तरीका है। वे वेब ब्राउज़र और सर्वर द्वारा यह निर्धारित करने के लिए उपयोग किए जाते हैं कि फ़ाइलों को कैसे संभालना है। MIME प्रकार एक प्रकार और एक उपप्रकार से मिलकर बनते हैं, जो एक स्लैश से अलग होते हैं (उदाहरण के लिए, text/html)। मुख्य श्रेणियां हैं:"
  },
  "tr": {
    "title": "MIME Türü Nedir?",
    "description": "MIME (Çok Amaçlı İnternet Posta Uzantıları) türleri, bir belge veya dosyanın doğasını ve biçimini belirtmenin standart bir yoludur. Web tarayıcıları ve sunucular tarafından dosyaların nasıl işleneceğini belirlemek için kullanılır. MIME türleri, bir tür ve bir alt türden oluşur ve eğik çizgi ile ayrılır (örneğin, text/html). Ana kategoriler şunlardır:"
  },
  "nl": {
    "title": "Wat is een MIME-type?",
    "description": "MIME-typen (Multipurpose Internet Mail Extensions) zijn een standaard manier om de aard en het formaat van een document of bestand aan te geven. Ze worden gebruikt door webbrowsers en servers om te bepalen hoe bestanden moeten worden behandeld. MIME-typen bestaan uit een type en een subtype, gescheiden door een schuine streep (bijvoorbeeld text/html). De hoofdcategorieën zijn:"
  },
  "sv": {
    "title": "Vad är en MIME-typ?",
    "description": "MIME-typer (Multipurpose Internet Mail Extensions) är ett standardiserat sätt att ange arten och formatet av ett dokument eller en fil. De används av webbläsare och servrar för att avgöra hur filer ska hanteras. MIME-typer består av en typ och en undertyp, separerade med ett snedstreck (t.ex. text/html). Huvudkategorierna är:"
  },
  "pl": {
    "title": "Czym jest typ MIME?",
    "description": "Typy MIME (Multipurpose Internet Mail Extensions) to standardowy sposób wskazywania natury i formatu dokumentu lub pliku. Są używane przez przeglądarki internetowe i serwery do określania sposobu obsługi plików. Typy MIME składają się z typu i podtypu, oddzielonych ukośnikiem (np. text/html). Główne kategorie to:"
  },
  "vi": {
    "title": "Loại MIME là gì?",
    "description": "Loại MIME (Multipurpose Internet Mail Extensions) là một cách tiêu chuẩn để chỉ ra bản chất và định dạng của tài liệu hoặc tệp. Chúng được sử dụng bởi trình duyệt web và máy chủ để xác định cách xử lý tệp. Loại MIME bao gồm một loại và một loại phụ, được phân tách bằng dấu gạch chéo (ví dụ: text/html). Các danh mục chính là:"
  },
  "th": {
    "title": "ประเภท MIME คืออะไร?",
    "description": "ประเภท MIME (Multipurpose Internet Mail Extensions) เป็นวิธีมาตรฐานในการระบุลักษณะและรูปแบบของเอกสารหรือไฟล์ ใช้โดยเว็บเบราว์เซอร์และเซิร์ฟเวอร์เพื่อกำหนดวิธีการจัดการไฟล์ ประเภท MIME ประกอบด้วยประเภทและประเภทย่อย คั่นด้วยเครื่องหมายทับ (เช่น text/html) หมวดหมู่หลักคือ:"
  },
  "id": {
    "title": "Apa itu Tipe MIME?",
    "description": "Tipe MIME (Multipurpose Internet Mail Extensions) adalah cara standar untuk menunjukkan sifat dan format dokumen atau file. Mereka digunakan oleh browser web dan server untuk menentukan cara menangani file. Tipe MIME terdiri dari tipe dan subtipe, dipisahkan oleh garis miring (misalnya, text/html). Kategori utama adalah:"
  },
  "he": {
    "title": "מהו סוג MIME?",
    "description": "סוגי MIME (הרחבות דואר אינטרנט רב-תכליתיות) הם דרך סטנדרטית לציין את האופי והפורמט של מסמך או קובץ. הם משמשים דפדפנים ושרתים כדי לקבוע כיצד לטפל בקבצים. סוגי MIME מורכבים מסוג ותת-סוג, מופרדים על ידי קו נטוי (למשל, text/html). הקטגוריות העיקריות הן:"
  },
  "ms": {
    "title": "Apakah Jenis MIME?",
    "description": "Jenis MIME (Sambungan Mel Internet Pelbagai Guna) ialah cara piawai untuk menunjukkan sifat dan format dokumen atau fail. Ia digunakan oleh pelayar web dan pelayan untuk menentukan cara mengendalikan fail. Jenis MIME terdiri daripada jenis dan subjenis, dipisahkan oleh garis miring (contohnya, text/html). Kategori utama ialah:"
  },
  "no": {
    "title": "Hva er en MIME-type?",
    "description": "MIME-typer (Multipurpose Internet Mail Extensions) er en standard måte å indikere arten og formatet til et dokument eller en fil på. De brukes av nettlesere og servere for å bestemme hvordan filer skal håndteres. MIME-typer består av en type og en undertype, atskilt med en skråstrek (for eksempel text/html). Hovedkategoriene er:"
  }
}
</i18n>
