<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <p>{{ t('description') }}</p>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is Text Statistics?",
    "description": "Text statistics tools help you analyze written content by counting characters, words, sentences, and more. These metrics are useful for writers, students, and content creators who need to meet specific length requirements or estimate reading time."
  },
  "zh": {
    "title": "什么是文本统计？",
    "description": "文本统计工具通过统计字符、单词、句子等来帮助您分析书面内容。这些指标对于需要满足特定长度要求或估计阅读时间的作家、学生和内容创作者非常有用。"
  },
  "zh-CN": {
    "title": "什么是文本统计？",
    "description": "文本统计工具通过统计字符、单词、句子等来帮助您分析书面内容。这些指标对于需要满足特定长度要求或估计阅读时间的作家、学生和内容创作者非常有用。"
  },
  "zh-TW": {
    "title": "什麼是文字統計？",
    "description": "文字統計工具通過統計字元、字數、句子等來幫助您分析書面內容。這些指標對於需要滿足特定長度要求或估計閱讀時間的作家、學生和內容創作者非常有用。"
  },
  "zh-HK": {
    "title": "什麼是文字統計？",
    "description": "文字統計工具通過統計字元、字數、句子等來幫助您分析書面內容。這些指標對於需要滿足特定長度要求或估計閱讀時間的作家、學生和內容創作者非常有用。"
  },
  "es": {
    "title": "¿Qué son las estadísticas de texto?",
    "description": "Las herramientas de estadísticas de texto le ayudan a analizar contenido escrito contando caracteres, palabras, oraciones y más. Estas métricas son útiles para escritores, estudiantes y creadores de contenido que necesitan cumplir con requisitos de longitud específicos o estimar el tiempo de lectura."
  },
  "fr": {
    "title": "Qu'est-ce que les statistiques de texte ?",
    "description": "Les outils de statistiques de texte vous aident à analyser le contenu écrit en comptant les caractères, les mots, les phrases et plus encore. Ces métriques sont utiles pour les écrivains, les étudiants et les créateurs de contenu qui doivent respecter des exigences de longueur spécifiques ou estimer le temps de lecture."
  },
  "de": {
    "title": "Was ist Textstatistik?",
    "description": "Textstatistik-Tools helfen Ihnen, geschriebene Inhalte zu analysieren, indem sie Zeichen, Wörter, Sätze und mehr zählen. Diese Metriken sind nützlich für Autoren, Studenten und Content-Ersteller, die bestimmte Längenanforderungen erfüllen oder die Lesezeit schätzen müssen."
  },
  "it": {
    "title": "Cosa sono le statistiche del testo?",
    "description": "Gli strumenti di statistiche del testo ti aiutano ad analizzare i contenuti scritti contando caratteri, parole, frasi e altro. Queste metriche sono utili per scrittori, studenti e creatori di contenuti che devono soddisfare requisiti di lunghezza specifici o stimare il tempo di lettura."
  },
  "ja": {
    "title": "テキスト統計とは？",
    "description": "テキスト統計ツールは、文字、単語、文などをカウントして書かれたコンテンツを分析するのに役立ちます。これらの指標は、特定の長さの要件を満たしたり、読書時間を見積もる必要がある作家、学生、コンテンツクリエイターに役立ちます。"
  },
  "ko": {
    "title": "텍스트 통계란?",
    "description": "텍스트 통계 도구는 문자, 단어, 문장 등을 세어 작성된 콘텐츠를 분석하는 데 도움이 됩니다. 이러한 지표는 특정 길이 요구 사항을 충족하거나 읽기 시간을 추정해야 하는 작가, 학생 및 콘텐츠 제작자에게 유용합니다."
  },
  "ru": {
    "title": "Что такое статистика текста?",
    "description": "Инструменты статистики текста помогают анализировать письменный контент, подсчитывая символы, слова, предложения и многое другое. Эти метрики полезны для писателей, студентов и создателей контента, которым необходимо соблюдать определённые требования к объёму или оценить время чтения."
  },
  "pt": {
    "title": "O que é Estatísticas de Texto?",
    "description": "As ferramentas de estatísticas de texto ajudam você a analisar conteúdo escrito contando caracteres, palavras, frases e muito mais. Essas métricas são úteis para escritores, estudantes e criadores de conteúdo que precisam atender a requisitos de comprimento específicos ou estimar o tempo de leitura."
  },
  "ar": {
    "title": "ما هي إحصائيات النص؟",
    "description": "تساعدك أدوات إحصائيات النص في تحليل المحتوى المكتوب من خلال حساب الأحرف والكلمات والجمل والمزيد. هذه المقاييس مفيدة للكتاب والطلاب ومنشئي المحتوى الذين يحتاجون إلى تلبية متطلبات طول محددة أو تقدير وقت القراءة."
  },
  "hi": {
    "title": "टेक्स्ट आँकड़े क्या है?",
    "description": "टेक्स्ट आँकड़े उपकरण वर्णों, शब्दों, वाक्यों और अधिक की गणना करके लिखित सामग्री का विश्लेषण करने में आपकी मदद करते हैं। ये मेट्रिक्स लेखकों, छात्रों और सामग्री निर्माताओं के लिए उपयोगी हैं जिन्हें विशिष्ट लंबाई आवश्यकताओं को पूरा करना है या पढ़ने के समय का अनुमान लगाना है।"
  },
  "tr": {
    "title": "Metin İstatistikleri Nedir?",
    "description": "Metin istatistikleri araçları, karakter, kelime, cümle ve daha fazlasını sayarak yazılı içeriği analiz etmenize yardımcı olur. Bu metrikler, belirli uzunluk gereksinimlerini karşılaması veya okuma süresini tahmin etmesi gereken yazarlar, öğrenciler ve içerik oluşturucular için faydalıdır."
  },
  "nl": {
    "title": "Wat zijn tekststatistieken?",
    "description": "Tekststatistiek-tools helpen u geschreven inhoud te analyseren door tekens, woorden, zinnen en meer te tellen. Deze statistieken zijn nuttig voor schrijvers, studenten en contentmakers die aan specifieke lengtevereisten moeten voldoen of de leestijd moeten inschatten."
  },
  "sv": {
    "title": "Vad är textstatistik?",
    "description": "Textstatistikverktyg hjälper dig att analysera skrivet innehåll genom att räkna tecken, ord, meningar och mer. Dessa mätvärden är användbara för författare, studenter och innehållsskapare som behöver uppfylla specifika längdkrav eller uppskatta lästid."
  },
  "pl": {
    "title": "Czym są statystyki tekstu?",
    "description": "Narzędzia do statystyk tekstu pomagają analizować treści pisemne poprzez liczenie znaków, słów, zdań i innych. Te metryki są przydatne dla pisarzy, studentów i twórców treści, którzy muszą spełnić określone wymagania dotyczące długości lub oszacować czas czytania."
  },
  "vi": {
    "title": "Thống kê văn bản là gì?",
    "description": "Công cụ thống kê văn bản giúp bạn phân tích nội dung viết bằng cách đếm ký tự, từ, câu và nhiều hơn nữa. Các chỉ số này hữu ích cho các nhà văn, sinh viên và người sáng tạo nội dung cần đáp ứng các yêu cầu về độ dài cụ thể hoặc ước tính thời gian đọc."
  },
  "th": {
    "title": "สถิติข้อความคืออะไร?",
    "description": "เครื่องมือสถิติข้อความช่วยให้คุณวิเคราะห์เนื้อหาที่เขียนโดยการนับตัวอักษร คำ ประโยค และอื่นๆ ตัวชี้วัดเหล่านี้มีประโยชน์สำหรับนักเขียน นักเรียน และผู้สร้างเนื้อหาที่ต้องการตอบสนองข้อกำหนดความยาวเฉพาะหรือประมาณเวลาอ่าน"
  },
  "id": {
    "title": "Apa itu Statistik Teks?",
    "description": "Alat statistik teks membantu Anda menganalisis konten tertulis dengan menghitung karakter, kata, kalimat, dan lainnya. Metrik ini berguna bagi penulis, pelajar, dan pembuat konten yang perlu memenuhi persyaratan panjang tertentu atau memperkirakan waktu baca."
  },
  "he": {
    "title": "מהי סטטיסטיקת טקסט?",
    "description": "כלי סטטיסטיקת טקסט עוזרים לך לנתח תוכן כתוב על ידי ספירת תווים, מילים, משפטים ועוד. מדדים אלה שימושיים לכותבים, סטודנטים ויוצרי תוכן שצריכים לעמוד בדרישות אורך ספציפיות או להעריך זמן קריאה."
  },
  "ms": {
    "title": "Apakah Statistik Teks?",
    "description": "Alat statistik teks membantu anda menganalisis kandungan bertulis dengan mengira aksara, perkataan, ayat dan banyak lagi. Metrik ini berguna untuk penulis, pelajar dan pencipta kandungan yang perlu memenuhi keperluan panjang tertentu atau menganggarkan masa membaca."
  },
  "no": {
    "title": "Hva er tekststatistikk?",
    "description": "Tekststatistikkverktøy hjelper deg med å analysere skrevet innhold ved å telle tegn, ord, setninger og mer. Disse beregningene er nyttige for forfattere, studenter og innholdsskapere som må oppfylle spesifikke lengdekrav eller estimere lesetid."
  }
}
</i18n>
