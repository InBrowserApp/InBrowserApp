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
    "title": "What is a duration?",
    "description": "A duration is the length of time you add to or subtract from a base time. ISO 8601 expresses durations as PnDTnHnMnS, with optional fractional seconds for milliseconds."
  },
  "zh": {
    "title": "什么是时长？",
    "description": "时长是从基准时间加上或减去的时间长度。ISO 8601 用 PnDTnHnMnS 表示时长，可用小数秒表示毫秒。"
  },
  "zh-CN": {
    "title": "什么是时长？",
    "description": "时长是从基准时间加上或减去的时间长度。ISO 8601 用 PnDTnHnMnS 表示时长，可用小数秒表示毫秒。"
  },
  "zh-TW": {
    "title": "什麼是時長？",
    "description": "時長是從基準時間加上或減去的時間長度。ISO 8601 以 PnDTnHnMnS 表示時長，可用小數秒表示毫秒。"
  },
  "zh-HK": {
    "title": "什麼是時長？",
    "description": "時長是從基準時間加上或減去的時間長度。ISO 8601 以 PnDTnHnMnS 表示時長，可用小數秒表示毫秒。"
  },
  "es": {
    "title": "¿Qué es una duración?",
    "description": "Una duración es el tiempo que se suma o se resta a una hora base. ISO 8601 expresa las duraciones como PnDTnHnMnS, con segundos fraccionarios opcionales para los milisegundos."
  },
  "fr": {
    "title": "Qu'est-ce qu'une durée ?",
    "description": "Une durée est le temps que l'on ajoute ou soustrait à une heure de base. ISO 8601 exprime les durées sous la forme PnDTnHnMnS, avec des secondes fractionnaires optionnelles pour les millisecondes."
  },
  "de": {
    "title": "Was ist eine Dauer?",
    "description": "Eine Dauer ist die Zeitspanne, die zu einer Basiszeit addiert oder davon abgezogen wird. ISO 8601 stellt Dauern als PnDTnHnMnS dar, mit optionalen Bruchteilen von Sekunden für Millisekunden."
  },
  "it": {
    "title": "Che cos'è una durata?",
    "description": "Una durata è il tempo che si aggiunge o si sottrae da un'ora base. ISO 8601 esprime le durate come PnDTnHnMnS, con secondi frazionari opzionali per i millisecondi."
  },
  "ja": {
    "title": "期間とは？",
    "description": "期間は基準時刻に加減する時間の長さです。ISO 8601 では PnDTnHnMnS で表し、ミリ秒は小数秒で任意に指定できます。"
  },
  "ko": {
    "title": "기간이란?",
    "description": "기간은 기준 시간에 더하거나 빼는 시간의 길이입니다. ISO 8601은 기간을 PnDTnHnMnS로 표현하며, 밀리초는 선택적으로 소수 초로 표시합니다."
  },
  "ru": {
    "title": "Что такое длительность?",
    "description": "Длительность — это время, которое добавляют или вычитают от базового времени. ISO 8601 записывает длительности как PnDTnHnMnS с необязательной дробной частью секунд для миллисекунд."
  },
  "pt": {
    "title": "O que é uma duração?",
    "description": "Uma duração é o tempo que se adiciona ou subtrai de uma hora base. A ISO 8601 expressa durações como PnDTnHnMnS, com segundos fracionários opcionais para milissegundos."
  },
  "ar": {
    "title": "ما هي المدة؟",
    "description": "المدة هي طول الوقت الذي يُضاف أو يُطرح من وقت أساس. يعبّر معيار ISO 8601 عن المدد بصيغة PnDTnHnMnS، مع ثوانٍ كسرية اختيارية لتمثيل الميلي ثانية."
  },
  "hi": {
    "title": "अवधि क्या है?",
    "description": "अवधि वह समय है जो आधार समय में जोड़ा या घटाया जाता है। ISO 8601 अवधि को PnDTnHnMnS के रूप में लिखता है, और मिलीसेकंड के लिए वैकल्पिक अंशीय सेकंड देता है।"
  },
  "tr": {
    "title": "Süre nedir?",
    "description": "Süre, temel zamana eklenen veya çıkarılan zaman uzunluğudur. ISO 8601 süreleri PnDTnHnMnS olarak ifade eder ve milisaniye için isteğe bağlı kesirli saniyeler kullanır."
  },
  "nl": {
    "title": "Wat is een duur?",
    "description": "Een duur is de tijd die je bij een basistijd optelt of aftrekt. ISO 8601 drukt duren uit als PnDTnHnMnS, met optionele fractieseconden voor milliseconden."
  },
  "sv": {
    "title": "Vad är en varaktighet?",
    "description": "En varaktighet är den tid som läggs till eller dras ifrån en basstid. ISO 8601 uttrycker varaktigheter som PnDTnHnMnS, med valfria bråkdelar av sekunder för millisekunder."
  },
  "pl": {
    "title": "Czym jest czas trwania?",
    "description": "Czas trwania to czas dodawany lub odejmowany od czasu bazowego. ISO 8601 zapisuje czasy trwania jako PnDTnHnMnS, z opcjonalnymi ułamkowymi sekundami dla milisekund."
  },
  "vi": {
    "title": "Thời lượng là gì?",
    "description": "Thời lượng là khoảng thời gian được cộng hoặc trừ khỏi thời gian gốc. ISO 8601 biểu diễn thời lượng theo PnDTnHnMnS, với phần thập phân của giây tùy chọn cho mili giây."
  },
  "th": {
    "title": "ระยะเวลาคืออะไร?",
    "description": "ระยะเวลาคือช่วงเวลาที่นำไปบวกหรือลบจากเวลาฐาน มาตรฐาน ISO 8601 แสดงระยะเวลาเป็น PnDTnHnMnS และรองรับวินาทีแบบทศนิยมเพื่อใช้แทนมิลลิวินาที"
  },
  "id": {
    "title": "Apa itu durasi?",
    "description": "Durasi adalah lamanya waktu yang ditambahkan atau dikurangkan dari waktu dasar. ISO 8601 menuliskan durasi sebagai PnDTnHnMnS, dengan pecahan detik opsional untuk milidetik."
  },
  "he": {
    "title": "מהו משך?",
    "description": "משך הוא הזמן שמוסיפים או מחסירים מזמן בסיס. ISO 8601 מציין משכים כ‑PnDTnHnMnS, עם שבריר שניות אופציונלי עבור מילישניות."
  },
  "ms": {
    "title": "Apakah durasi?",
    "description": "Durasi ialah tempoh yang ditambah atau ditolak daripada masa asas. ISO 8601 mengekspresikan durasi sebagai PnDTnHnMnS, dengan saat pecahan pilihan untuk milisaat."
  },
  "no": {
    "title": "Hva er en varighet?",
    "description": "Varighet er tiden som legges til eller trekkes fra en basistid. ISO 8601 uttrykker varigheter som PnDTnHnMnS, med valgfrie brøkdeler av sekunder for millisekunder."
  }
}
</i18n>
