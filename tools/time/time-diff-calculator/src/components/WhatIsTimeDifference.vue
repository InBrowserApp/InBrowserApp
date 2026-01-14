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
    "description": "A time difference is the elapsed time between two timestamps. Comparing local times requires their time zones because daylight saving can change offsets, so converting to UTC keeps the comparison unambiguous."
  },
  "zh": {
    "title": "什么是时间差？",
    "description": "时间差是两个时间点之间经过的时间。比较本地时间需要考虑时区，夏令时可能改变偏移，因此转换到 UTC 可避免歧义。"
  },
  "zh-CN": {
    "title": "什么是时间差？",
    "description": "时间差是两个时间点之间经过的时间。比较本地时间需要考虑时区，夏令时可能改变偏移，因此转换到 UTC 可避免歧义。"
  },
  "zh-TW": {
    "title": "什麼是時間差？",
    "description": "時間差是兩個時間點之間經過的時間。比較本地時間需要考慮時區，夏令時間可能改變偏移，因此轉換到 UTC 可避免歧義。"
  },
  "zh-HK": {
    "title": "什麼是時間差？",
    "description": "時間差是兩個時間點之間經過的時間。比較本地時間需要考慮時區，夏令時間可能改變偏移，因此轉換到 UTC 可避免歧義。"
  },
  "es": {
    "title": "¿Qué es la diferencia de tiempo?",
    "description": "La diferencia de tiempo es el tiempo transcurrido entre dos marcas de tiempo. Al comparar horas locales hay que considerar las zonas horarias, ya que el horario de verano puede cambiar el desfase; convertir a UTC evita ambigüedades."
  },
  "fr": {
    "title": "Qu'est-ce qu'une différence de temps ?",
    "description": "La différence de temps est le temps écoulé entre deux horodatages. Pour comparer des heures locales, il faut tenir compte des fuseaux horaires, car l'heure d'été peut modifier le décalage; convertir en UTC évite les ambiguïtés."
  },
  "de": {
    "title": "Was ist eine Zeitdifferenz?",
    "description": "Eine Zeitdifferenz ist die verstrichene Zeit zwischen zwei Zeitstempeln. Beim Vergleich lokaler Zeiten müssen die Zeitzonen berücksichtigt werden, da die Sommerzeit den Offset ändern kann; die Umrechnung in UTC vermeidet Mehrdeutigkeit."
  },
  "it": {
    "title": "Che cos'è la differenza di tempo?",
    "description": "La differenza di tempo è il tempo trascorso tra due istanti. Nel confrontare orari locali occorre considerare i fusi orari, perché l'ora legale può cambiare l'offset; convertire in UTC evita ambiguità."
  },
  "ja": {
    "title": "時間差とは？",
    "description": "時間差は2つのタイムスタンプの間に経過した時間です。ローカル時刻を比較するには時刻のタイムゾーンを考慮する必要があり、夏時間でオフセットが変わることがあるため、UTC に変換すると比較が明確になります。"
  },
  "ko": {
    "title": "시간 차이란?",
    "description": "시간 차이는 두 타임스탬프 사이의 경과 시간입니다. 로컬 시간을 비교하려면 시간대를 고려해야 하고 일광 절약 시간제로 오프셋이 변할 수 있으므로 UTC로 변환하면 비교가 명확해집니다."
  },
  "ru": {
    "title": "Что такое разница во времени?",
    "description": "Разница во времени — это промежуток между двумя метками времени. При сравнении локального времени нужно учитывать часовые пояса, так как летнее время может менять смещение; перевод в UTC устраняет неоднозначность."
  },
  "pt": {
    "title": "O que é diferença de tempo?",
    "description": "Diferença de tempo é o tempo decorrido entre duas marcas de tempo. Ao comparar horas locais, é preciso considerar os fusos horários, pois o horário de verão pode alterar o offset; converter para UTC evita ambiguidades."
  },
  "ar": {
    "title": "ما هو فرق الوقت؟",
    "description": "فرق الوقت هو الزمن المنقضي بين طابعين زمنيين. عند مقارنة الأوقات المحلية يجب مراعاة المناطق الزمنية لأن التوقيت الصيفي قد يغيّر الإزاحة، لذا فإن التحويل إلى UTC يجعل المقارنة غير ملتبسة."
  },
  "hi": {
    "title": "समय अंतर क्या है?",
    "description": "समय अंतर दो टाइमस्टैम्प के बीच का बीता हुआ समय है। स्थानीय समय की तुलना करते समय समय क्षेत्र को ध्यान में रखना जरूरी है, क्योंकि डेलाइट सेविंग ऑफ़सेट बदल सकती है; इसलिए UTC में बदलना तुलना को अस्पष्टता से बचाता है।"
  },
  "tr": {
    "title": "Zaman farkı nedir?",
    "description": "Zaman farkı, iki zaman damgası arasındaki geçen süredir. Yerel saatleri karşılaştırırken saat dilimlerini dikkate almak gerekir; yaz saati ofseti değiştirebileceği için UTC'ye dönüştürmek karşılaştırmayı netleştirir."
  },
  "nl": {
    "title": "Wat is tijdsverschil?",
    "description": "Tijdsverschil is de verstreken tijd tussen twee tijdstempels. Bij het vergelijken van lokale tijden moet je de tijdzones meenemen, omdat zomertijd de offset kan veranderen; omzetten naar UTC houdt de vergelijking eenduidig."
  },
  "sv": {
    "title": "Vad är en tidsdifferens?",
    "description": "En tidsdifferens är den förflutna tiden mellan två tidsstämplar. När du jämför lokala tider behöver du ta hänsyn till tidszoner, eftersom sommartid kan ändra offseten; konvertering till UTC gör jämförelsen entydig."
  },
  "pl": {
    "title": "Czym jest różnica czasu?",
    "description": "Różnica czasu to czas, który upłynął między dwoma znacznikami czasu. Porównując czas lokalny, trzeba uwzględnić strefy czasowe, bo czas letni może zmieniać przesunięcie; konwersja do UTC eliminuje niejednoznaczność."
  },
  "vi": {
    "title": "Chênh lệch thời gian là gì?",
    "description": "Chênh lệch thời gian là khoảng thời gian trôi qua giữa hai dấu thời gian. Khi so sánh giờ địa phương cần tính đến múi giờ, vì giờ mùa hè có thể thay đổi độ lệch; chuyển sang UTC giúp so sánh rõ ràng."
  },
  "th": {
    "title": "ความต่างของเวลาคืออะไร?",
    "description": "ความต่างของเวลา คือเวลาที่ผ่านไประหว่างสองเวลาประทับ เมื่อเปรียบเทียบเวลาในท้องถิ่นต้องคำนึงถึงเขตเวลา เพราะเวลาออมแสงอาจเปลี่ยนออฟเซ็ต ดังนั้นการแปลงเป็น UTC จะช่วยให้การเปรียบเทียบไม่กำกวม"
  },
  "id": {
    "title": "Apa itu selisih waktu?",
    "description": "Selisih waktu adalah waktu yang berlalu antara dua timestamp. Saat membandingkan waktu lokal, zona waktu harus diperhitungkan karena daylight saving dapat mengubah offset; konversi ke UTC menghindari ambiguitas."
  },
  "he": {
    "title": "מהו הפרש זמן?",
    "description": "הפרש זמן הוא הזמן שחלף בין שתי חותמות זמן. בעת השוואת זמנים מקומיים צריך להתחשב באזורי הזמן, משום שעון קיץ יכול לשנות את ההיסט; המרה ל‑UTC הופכת את ההשוואה לחד‑משמעית."
  },
  "ms": {
    "title": "Apakah perbezaan masa?",
    "description": "Perbezaan masa ialah tempoh masa yang berlalu antara dua cap masa. Apabila membandingkan masa setempat, zon masa perlu diambil kira kerana waktu musim panas boleh mengubah ofset; penukaran ke UTC mengelakkan kekaburan."
  },
  "no": {
    "title": "Hva er tidsforskjell?",
    "description": "Tidsforskjell er tiden som har gått mellom to tidsstempler. Når du sammenligner lokale tider må du ta hensyn til tidssoner, fordi sommertid kan endre offseten; konvertering til UTC gjør sammenligningen entydig."
  }
}
</i18n>
