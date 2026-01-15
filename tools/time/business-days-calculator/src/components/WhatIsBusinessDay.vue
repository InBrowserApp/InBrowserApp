<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a business day?",
    "description": "A business day is a working day when businesses are typically open. It usually excludes weekends and public holidays, but you can customize the definition for your schedule."
  },
  "zh": {
    "title": "什么是工作日？",
    "description": "工作日是企业通常营业的日子。一般不包含周末和法定节假日，但你可以根据需要自定义。"
  },
  "zh-CN": {
    "title": "什么是工作日？",
    "description": "工作日是企业通常营业的日子。一般不包含周末和法定节假日，但你可以根据需要自定义。"
  },
  "zh-TW": {
    "title": "什麼是工作日？",
    "description": "工作日是企業通常營業的日子。一般不包含週末與法定節假日，但你可以依需求自訂。"
  },
  "zh-HK": {
    "title": "什麼是工作日？",
    "description": "工作日是企業通常營業的日子。一般不包含週末與法定節假日，但你可以依需求自訂。"
  },
  "es": {
    "title": "¿Qué es un día hábil?",
    "description": "Un día hábil es un día laborable en el que las empresas suelen estar abiertas. Normalmente excluye fines de semana y festivos, pero puedes personalizar la definición."
  },
  "fr": {
    "title": "Qu'est-ce qu'un jour ouvré ?",
    "description": "Un jour ouvré est un jour de travail où les entreprises sont généralement ouvertes. Il exclut généralement les week-ends et jours fériés, mais vous pouvez personnaliser la définition."
  },
  "de": {
    "title": "Was ist ein Arbeitstag?",
    "description": "Ein Arbeitstag ist ein Werktag, an dem Unternehmen üblicherweise geöffnet sind. Er schließt in der Regel Wochenenden und Feiertage aus, aber du kannst die Definition anpassen."
  },
  "it": {
    "title": "Che cos'è un giorno lavorativo?",
    "description": "Un giorno lavorativo è un giorno in cui le attività sono normalmente aperte. Di solito esclude weekend e festività, ma puoi personalizzare la definizione."
  },
  "ja": {
    "title": "営業日とは？",
    "description": "営業日は企業が通常営業している日です。一般的に週末と祝日を除きますが、必要に応じて定義をカスタマイズできます。"
  },
  "ko": {
    "title": "영업일이란?",
    "description": "영업일은 보통 व्यवसाय체가 영업하는 날입니다. 일반적으로 주말과 공휴일을 제외하지만 필요에 따라 정의를 사용자 지정할 수 있습니다."
  },
  "ru": {
    "title": "Что такое рабочий день?",
    "description": "Рабочий день — это день, когда организации обычно открыты. Обычно исключаются выходные и праздники, но определение можно настроить."
  },
  "pt": {
    "title": "O que é um dia útil?",
    "description": "Um dia útil é um dia de trabalho em que as empresas normalmente estão abertas. Normalmente exclui fins de semana e feriados, mas você pode personalizar a definição."
  },
  "ar": {
    "title": "ما هو يوم العمل؟",
    "description": "يوم العمل هو يوم تكون فيه الشركات عادةً مفتوحة. عادةً ما يستبعد عطلات نهاية الأسبوع والعطلات الرسمية، لكن يمكنك تخصيص التعريف."
  },
  "hi": {
    "title": "कार्यदिवस क्या है?",
    "description": "कार्यदिवस वह दिन है जब व्यवसाय आमतौर पर खुले रहते हैं। इसमें सामान्यतः सप्ताहांत और सार्वजनिक छुट्टियां शामिल नहीं होतीं, लेकिन आप परिभाषा को अनुकूलित कर सकते हैं।"
  },
  "tr": {
    "title": "İş günü nedir?",
    "description": "İş günü, işletmelerin genellikle açık olduğu çalışma günüdür. Genellikle hafta sonlarını ve resmi tatilleri hariç tutar, ancak tanımı özelleştirebilirsiniz."
  },
  "nl": {
    "title": "Wat is een werkdag?",
    "description": "Een werkdag is een dag waarop bedrijven doorgaans open zijn. Meestal zijn weekenden en feestdagen uitgesloten, maar je kunt de definitie aanpassen."
  },
  "sv": {
    "title": "Vad är en arbetsdag?",
    "description": "En arbetsdag är en dag då företag vanligtvis har öppet. Den utesluter normalt helger och helgdagar, men du kan anpassa definitionen."
  },
  "pl": {
    "title": "Czym jest dzień roboczy?",
    "description": "Dzień roboczy to dzień, w którym firmy zwykle są otwarte. Zwykle wyklucza weekendy i święta, ale definicję można dostosować."
  },
  "vi": {
    "title": "Ngày làm việc là gì?",
    "description": "Ngày làm việc là ngày mà doanh nghiệp thường mở cửa. Thường không bao gồm cuối tuần và ngày lễ, nhưng bạn có thể tùy chỉnh định nghĩa."
  },
  "th": {
    "title": "วันทำงานคืออะไร?",
    "description": "วันทำงานคือวันที่ธุรกิจมักเปิดทำการ โดยทั่วไปจะไม่รวมวันสุดสัปดาห์และวันหยุดนักขัตฤกษ์ แต่คุณสามารถปรับแต่งนิยามได้"
  },
  "id": {
    "title": "Apa itu hari kerja?",
    "description": "Hari kerja adalah hari ketika bisnis biasanya buka. Umumnya tidak termasuk akhir pekan dan hari libur nasional, tetapi Anda bisa menyesuaikan definisinya."
  },
  "he": {
    "title": "מהו יום עבודה?",
    "description": "יום עבודה הוא יום שבו עסקים בדרך כלל פתוחים. בדרך כלל אינו כולל סופי שבוע וחגים, אך ניתן להתאים את ההגדרה."
  },
  "ms": {
    "title": "Apakah hari bekerja?",
    "description": "Hari bekerja ialah hari apabila perniagaan biasanya dibuka. Lazimnya tidak termasuk hujung minggu dan cuti umum, tetapi anda boleh menyesuaikan definisinya."
  },
  "no": {
    "title": "Hva er en arbeidsdag?",
    "description": "En arbeidsdag er en dag der bedrifter vanligvis er åpne. Den utelukker som regel helger og fridager, men du kan tilpasse definisjonen."
  }
}
</i18n>
