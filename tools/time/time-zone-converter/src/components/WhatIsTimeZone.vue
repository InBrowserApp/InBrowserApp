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
    "title": "What is a time zone?",
    "description": "A time zone is a region that shares the same standard time, defined by an offset from UTC (e.g., UTC+08:00). Some regions observe daylight saving time, which shifts the offset seasonally."
  },
  "zh": {
    "title": "什么是时区？",
    "description": "时区是共享同一标准时间的区域，通常以相对 UTC 的偏移定义（如 UTC+08:00）。部分地区实行夏令时，会在季节性调整偏移。"
  },
  "zh-CN": {
    "title": "什么是时区？",
    "description": "时区是共享同一标准时间的区域，通常以相对 UTC 的偏移定义（如 UTC+08:00）。部分地区实行夏令时，会在季节性调整偏移。"
  },
  "zh-TW": {
    "title": "什麼是時區？",
    "description": "時區是共享同一標準時間的區域，通常以相對 UTC 的偏移定義（如 UTC+08:00）。部分地區實行夏令時間，會隨季節調整偏移。"
  },
  "zh-HK": {
    "title": "什麼是時區？",
    "description": "時區是共享同一標準時間的區域，通常以相對 UTC 的偏移定義（如 UTC+08:00）。部分地區實行夏令時間，會隨季節調整偏移。"
  },
  "es": {
    "title": "¿Qué es una zona horaria?",
    "description": "Una zona horaria es una región que comparte la misma hora estándar, definida por un desfase respecto a UTC (p. ej., UTC+08:00). Algunas regiones aplican horario de verano, que ajusta el desfase según la temporada."
  },
  "fr": {
    "title": "Qu'est-ce qu'un fuseau horaire ?",
    "description": "Un fuseau horaire est une région qui partage la même heure standard, définie par un décalage par rapport à l'UTC (ex. UTC+08:00). Certaines régions appliquent l'heure d'été, ce qui modifie le décalage selon la saison."
  },
  "de": {
    "title": "Was ist eine Zeitzone?",
    "description": "Eine Zeitzone ist eine Region mit derselben Standardzeit, definiert durch einen Versatz zu UTC (z. B. UTC+08:00). Einige Regionen nutzen Sommerzeit, wodurch sich der Versatz saisonal ändert."
  },
  "it": {
    "title": "Che cos'è un fuso orario?",
    "description": "Un fuso orario è una regione che condivide la stessa ora standard, definita da un offset rispetto a UTC (es. UTC+08:00). Alcune regioni adottano l'ora legale, che modifica l'offset stagionalmente."
  },
  "ja": {
    "title": "タイムゾーンとは？",
    "description": "タイムゾーンは同じ標準時を共有する地域で、UTC からのオフセット（例: UTC+08:00）で定義されます。地域によっては夏時間を採用し、季節によってオフセットが変わります。"
  },
  "ko": {
    "title": "시간대란?",
    "description": "시간대는 동일한 표준시를 공유하는 지역으로, UTC에 대한 오프셋(예: UTC+08:00)으로 정의됩니다. 일부 지역은 일광 절약 시간을 적용해 계절에 따라 오프셋이 바뀝니다."
  },
  "ru": {
    "title": "Что такое часовой пояс?",
    "description": "Часовой пояс — это регион с одинаковым стандартным временем, определяемым смещением относительно UTC (например, UTC+08:00). В некоторых регионах действует летнее время, из-за чего смещение сезонно меняется."
  },
  "pt": {
    "title": "O que é um fuso horário?",
    "description": "Um fuso horário é uma região que compartilha a mesma hora padrão, definida por um offset em relação ao UTC (ex.: UTC+08:00). Algumas regiões adotam horário de verão, que altera o offset sazonalmente."
  },
  "ar": {
    "title": "ما هي المنطقة الزمنية؟",
    "description": "المنطقة الزمنية هي منطقة تشترك في نفس التوقيت القياسي، وتُعرّف بإزاحة عن UTC (مثل UTC+08:00). بعض المناطق تطبق التوقيت الصيفي، مما يغيّر الإزاحة موسميًا."
  },
  "hi": {
    "title": "समय क्षेत्र क्या है?",
    "description": "समय क्षेत्र वह क्षेत्र है जो समान मानक समय साझा करता है, जिसे UTC से ऑफ़सेट (उदा., UTC+08:00) द्वारा परिभाषित किया जाता है। कुछ क्षेत्र डेलाइट सेविंग लागू करते हैं, जिससे ऑफ़सेट मौसम के अनुसार बदलता है।"
  },
  "tr": {
    "title": "Saat dilimi nedir?",
    "description": "Saat dilimi, aynı standart saati paylaşan ve UTC'ye göre bir ofsetle (örn. UTC+08:00) tanımlanan bir bölgedir. Bazı bölgeler yaz saatini uygular ve ofset mevsimsel olarak değişir."
  },
  "nl": {
    "title": "Wat is een tijdzone?",
    "description": "Een tijdzone is een regio die dezelfde standaardtijd deelt, gedefinieerd door een offset ten opzichte van UTC (bijv. UTC+08:00). Sommige regio's gebruiken zomertijd, waardoor de offset per seizoen verandert."
  },
  "sv": {
    "title": "Vad är en tidszon?",
    "description": "En tidszon är en region som delar samma standardtid, definierad av en offset mot UTC (t.ex. UTC+08:00). Vissa regioner använder sommartid, vilket ändrar offseten säsongsvis."
  },
  "pl": {
    "title": "Czym jest strefa czasowa?",
    "description": "Strefa czasowa to region, który dzieli ten sam czas standardowy, zdefiniowany przesunięciem względem UTC (np. UTC+08:00). Niektóre regiony stosują czas letni, co sezonowo zmienia przesunięcie."
  },
  "vi": {
    "title": "Múi giờ là gì?",
    "description": "Múi giờ là một khu vực dùng cùng giờ chuẩn, được xác định bởi độ lệch so với UTC (ví dụ UTC+08:00). Một số khu vực áp dụng giờ mùa hè, khiến độ lệch thay đổi theo mùa."
  },
  "th": {
    "title": "เขตเวลาคืออะไร?",
    "description": "เขตเวลาคือภูมิภาคที่ใช้เวลาแบบมาตรฐานเดียวกัน กำหนดด้วยออฟเซ็ตเทียบกับ UTC (เช่น UTC+08:00) บางภูมิภาคใช้เวลาออมแสง ทำให้ออฟเซ็ตเปลี่ยนไปตามฤดูกาล"
  },
  "id": {
    "title": "Apa itu zona waktu?",
    "description": "Zona waktu adalah wilayah yang berbagi waktu standar yang sama, ditentukan oleh offset terhadap UTC (mis., UTC+08:00). Beberapa wilayah menerapkan daylight saving, sehingga offset berubah secara musiman."
  },
  "he": {
    "title": "מהו אזור זמן?",
    "description": "אזור זמן הוא אזור שמשתף את אותו זמן תקני, המוגדר לפי היסט מול UTC (לדוגמה, UTC+08:00). באזורים מסוימים נהוג שעון קיץ, שמשנה את ההיסט באופן עונתי."
  },
  "ms": {
    "title": "Apakah zon masa?",
    "description": "Zon masa ialah wilayah yang berkongsi masa piawai yang sama, ditakrifkan oleh ofset berbanding UTC (cth., UTC+08:00). Sesetengah wilayah menggunakan waktu musim panas, menyebabkan ofset berubah mengikut musim."
  },
  "no": {
    "title": "Hva er en tidssone?",
    "description": "En tidssone er en region som deler samme standardtid, definert av en offset fra UTC (f.eks. UTC+08:00). Noen regioner bruker sommertid, som endrer offseten sesongmessig."
  }
}
</i18n>
