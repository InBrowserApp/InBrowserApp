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
    "title": "What is a time difference?",
    "description": "A time difference is the elapsed time between two timestamps. When comparing local times, time zones and daylight saving can shift the offset, so converting to UTC avoids ambiguity. A duration is the length of time you add or subtract from a base time."
  },
  "zh": {
    "title": "什么是时间差？",
    "description": "时间差是两个时间点之间经过的时间。比较本地时间时，时区和夏令时会改变偏移，因此转换到 UTC 可避免歧义。时长指从基准时间加上或减去的时间长度。"
  },
  "zh-CN": {
    "title": "什么是时间差？",
    "description": "时间差是两个时间点之间经过的时间。比较本地时间时，时区和夏令时会改变偏移，因此转换到 UTC 可避免歧义。时长指从基准时间加上或减去的时间长度。"
  },
  "zh-TW": {
    "title": "什麼是時間差？",
    "description": "時間差是兩個時間點之間經過的時間。比較本地時間時，時區與夏令時間會改變偏移，因此轉換到 UTC 可避免歧義。時長是從基準時間加上或減去的時間長度。"
  },
  "zh-HK": {
    "title": "什麼是時間差？",
    "description": "時間差是兩個時間點之間經過的時間。比較本地時間時，時區與夏令時間會改變偏移，因此轉換到 UTC 可避免歧義。時長是從基準時間加上或減去的時間長度。"
  },
  "es": {
    "title": "¿Qué es la diferencia de tiempo?",
    "description": "La diferencia de tiempo es el tiempo transcurrido entre dos marcas de tiempo. Al comparar horas locales, las zonas horarias y el horario de verano pueden cambiar el desfase, por lo que convertir a UTC evita ambigüedades. Una duración es el tiempo que se suma o se resta a una hora base."
  },
  "fr": {
    "title": "Qu'est-ce qu'une différence de temps ?",
    "description": "La différence de temps est le temps écoulé entre deux horodatages. Lorsqu'on compare des heures locales, les fuseaux horaires et l'heure d'été peuvent modifier le décalage, donc convertir en UTC évite les ambiguïtés. Une durée est le temps que l'on ajoute ou soustrait à une heure de base."
  },
  "de": {
    "title": "Was ist eine Zeitdifferenz?",
    "description": "Eine Zeitdifferenz ist die verstrichene Zeit zwischen zwei Zeitstempeln. Beim Vergleich lokaler Zeiten können Zeitzonen und Sommerzeit den Offset verschieben, daher vermeidet die Umrechnung in UTC Mehrdeutigkeiten. Eine Dauer ist die Zeitspanne, die zu einer Basiszeit addiert oder davon abgezogen wird."
  },
  "it": {
    "title": "Che cos'è la differenza di tempo?",
    "description": "La differenza di tempo è il tempo trascorso tra due istanti. Quando si confrontano orari locali, fusi orari e ora legale possono spostare l'offset, quindi la conversione in UTC evita ambiguità. Una durata è il tempo che si aggiunge o si sottrae da un'ora base."
  },
  "ja": {
    "title": "時間差とは？",
    "description": "時間差は2つの時刻の間に経過した時間です。ローカル時刻を比較すると、タイムゾーンや夏時間でオフセットが変わるため、UTC に変換すると曖昧さを避けられます。期間は基準時刻に加減する時間の長さです。"
  },
  "ko": {
    "title": "시간 차이란?",
    "description": "시간 차이는 두 타임스탬프 사이의 경과 시간입니다. 로컬 시간을 비교할 때 시간대와 일광 절약 시간제가 오프셋을 바꿀 수 있으므로 UTC로 변환하면 모호함을 줄일 수 있습니다. 기간은 기준 시간에 더하거나 빼는 시간의 길이입니다."
  },
  "ru": {
    "title": "Что такое разница во времени?",
    "description": "Разница во времени — это промежуток между двумя метками времени. При сравнении локального времени часовые пояса и летнее время могут менять смещение, поэтому перевод в UTC помогает избежать неоднозначности. Длительность — это время, которое добавляют или вычитают от базового времени."
  },
  "pt": {
    "title": "O que é diferença de tempo?",
    "description": "Diferença de tempo é o tempo decorrido entre duas marcas de tempo. Ao comparar horas locais, fusos horários e horário de verão podem mudar o offset, então converter para UTC evita ambiguidades. Uma duração é o tempo que se adiciona ou subtrai de uma hora base."
  },
  "ar": {
    "title": "ما هو فرق الوقت؟",
    "description": "فرق الوقت هو الزمن المنقضي بين طابعين زمنيين. عند مقارنة الأوقات المحلية قد تغيّر المناطق الزمنية والتوقيت الصيفي الإزاحة، لذا فإن التحويل إلى UTC يتجنب الغموض. المدة هي طول الوقت الذي يُضاف أو يُطرح من وقت أساس."
  },
  "hi": {
    "title": "समय अंतर क्या है?",
    "description": "समय अंतर दो टाइमस्टैम्प के बीच का बीता हुआ समय है। स्थानीय समय की तुलना करते समय समय क्षेत्र और डेलाइट सेविंग ऑफ़सेट को बदल सकते हैं, इसलिए UTC में बदलना अस्पष्टता से बचाता है। अवधि वह समय है जो आधार समय में जोड़ा या घटाया जाता है।"
  },
  "tr": {
    "title": "Zaman farkı nedir?",
    "description": "Zaman farkı, iki zaman damgası arasındaki geçen süredir. Yerel saatleri karşılaştırırken saat dilimleri ve yaz saati ofseti değiştirebilir; bu yüzden UTC'ye çevirmek belirsizliği önler. Süre, temel zamana eklenen veya çıkarılan zaman uzunluğudur."
  },
  "nl": {
    "title": "Wat is tijdsverschil?",
    "description": "Tijdsverschil is de verstreken tijd tussen twee tijdstempels. Bij het vergelijken van lokale tijden kunnen tijdzones en zomertijd de offset wijzigen; daarom voorkomt omzetten naar UTC ambiguïteit. Een duur is de tijd die je bij een basistijd optelt of aftrekt."
  },
  "sv": {
    "title": "Vad är en tidsdifferens?",
    "description": "En tidsdifferens är den förflutna tiden mellan två tidsstämplar. När man jämför lokala tider kan tidszoner och sommartid ändra offseten, därför undviker konvertering till UTC tvetydighet. En varaktighet är den tid som läggs till eller dras ifrån en basstid."
  },
  "pl": {
    "title": "Czym jest różnica czasu?",
    "description": "Różnica czasu to czas, który upłynął między dwoma znacznikami czasu. Podczas porównywania czasu lokalnego strefy czasowe i czas letni mogą zmieniać przesunięcie, więc konwersja do UTC eliminuje niejednoznaczność. Czas trwania to czas dodawany lub odejmowany od czasu bazowego."
  },
  "vi": {
    "title": "Chênh lệch thời gian là gì?",
    "description": "Chênh lệch thời gian là khoảng thời gian trôi qua giữa hai dấu thời gian. Khi so sánh giờ địa phương, múi giờ và giờ mùa hè có thể thay đổi độ lệch, vì vậy chuyển sang UTC giúp tránh mơ hồ. Thời lượng là khoảng thời gian được cộng hoặc trừ khỏi thời gian gốc."
  },
  "th": {
    "title": "ความต่างของเวลาคืออะไร?",
    "description": "ความต่างของเวลา คือเวลาที่ผ่านไประหว่างสองเวลาประทับ เมื่อเปรียบเทียบเวลาในท้องถิ่น เขตเวลาและเวลาออมแสงอาจเปลี่ยนออฟเซ็ต การแปลงเป็น UTC จึงช่วยลดความกำกวม ระยะเวลาคือช่วงเวลาที่นำไปบวกหรือลบจากเวลาฐาน"
  },
  "id": {
    "title": "Apa itu selisih waktu?",
    "description": "Selisih waktu adalah waktu yang berlalu antara dua timestamp. Saat membandingkan waktu lokal, zona waktu dan daylight saving dapat mengubah offset, sehingga konversi ke UTC menghindari ambiguitas. Durasi adalah lamanya waktu yang ditambahkan atau dikurangkan dari waktu dasar."
  },
  "he": {
    "title": "מהו הפרש זמן?",
    "description": "הפרש זמן הוא הזמן שחלף בין שתי חותמות זמן. בעת השוואת זמנים מקומיים, אזורי זמן ושעון קיץ יכולים לשנות את ההיסט, לכן המרה ל‑UTC מונעת עמימות. משך הוא הזמן שמוסיפים או מחסירים מזמן בסיס."
  },
  "ms": {
    "title": "Apakah perbezaan masa?",
    "description": "Perbezaan masa ialah tempoh masa yang berlalu antara dua cap masa. Apabila membandingkan masa setempat, zon masa dan waktu musim panas boleh mengubah ofset, jadi penukaran ke UTC mengelakkan kekaburan. Durasi ialah tempoh yang ditambah atau ditolak daripada masa asas."
  },
  "no": {
    "title": "Hva er tidsforskjell?",
    "description": "Tidsforskjell er tiden som har gått mellom to tidsstempler. Når du sammenligner lokale tider kan tidssoner og sommertid endre offseten, så konvertering til UTC unngår tvetydighet. Varighet er tiden som legges til eller trekkes fra en basistid."
  }
}
</i18n>
