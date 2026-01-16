<template>
  <DescriptionMarkdown
    :title="t('what-is-ksuid')"
    :description="t('what-is-ksuid-description-markdown')"
  />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "what-is-ksuid": "What is KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) is a 27-character base62 identifier that embeds a 32-bit timestamp (seconds since 2014-05-13) and 128 bits of random data.\n\n**Key points:**\n- **Time-sortable**: lexicographic order follows creation time.\n- **High uniqueness**: 128 bits of randomness per ID.\n- **Second precision**: KSUID stores seconds, so millisecond inputs are rounded down."
  },
  "zh": {
    "what-is-ksuid": "什么是 KSUID？",
    "what-is-ksuid-description-markdown": "KSUID（K-Sortable Unique IDentifier）是一种 27 位 Base62 标识符，包含 32 位时间戳（自 2014-05-13 起的秒数）和 128 位随机数据。\n\n**要点：**\n- **按时间排序**：字典序与生成时间一致。\n- **高唯一性**：每个 ID 有 128 位随机性。\n- **秒级精度**：KSUID 只存秒，毫秒输入会向下取整。"
  },
  "zh-CN": {
    "what-is-ksuid": "什么是 KSUID？",
    "what-is-ksuid-description-markdown": "KSUID（K-Sortable Unique IDentifier）是一种 27 位 Base62 标识符，包含 32 位时间戳（自 2014-05-13 起的秒数）和 128 位随机数据。\n\n**要点：**\n- **按时间排序**：字典序与生成时间一致。\n- **高唯一性**：每个 ID 有 128 位随机性。\n- **秒级精度**：KSUID 只存秒，毫秒输入会向下取整。"
  },
  "zh-TW": {
    "what-is-ksuid": "什麼是 KSUID？",
    "what-is-ksuid-description-markdown": "KSUID（K-Sortable Unique IDentifier）是 27 位 Base62 識別碼，內含 32 位時間戳（自 2014-05-13 起的秒數）與 128 位隨機資料。\n\n**重點：**\n- **時間可排序**：字典序與建立時間一致。\n- **高唯一性**：每個 ID 含 128 位隨機性。\n- **秒級精度**：KSUID 只儲存秒，毫秒輸入會向下取整。"
  },
  "zh-HK": {
    "what-is-ksuid": "什麼是 KSUID？",
    "what-is-ksuid-description-markdown": "KSUID（K-Sortable Unique IDentifier）是 27 位 Base62 識別碼，包含 32 位時間戳（自 2014-05-13 起的秒數）和 128 位隨機資料。\n\n**重點：**\n- **時間可排序**：字典序與建立時間一致。\n- **高唯一性**：每個 ID 有 128 位隨機性。\n- **秒級精度**：KSUID 只儲存秒，毫秒輸入會向下取整。"
  },
  "es": {
    "what-is-ksuid": "¿Qué es KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) es un identificador base62 de 27 caracteres que incrusta un timestamp de 32 bits (segundos desde 2014-05-13) y 128 bits de datos aleatorios.\n\n**Puntos clave:**\n- **Ordenable por tiempo**: el orden lexicográfico sigue el tiempo de creación.\n- **Alta unicidad**: 128 bits de aleatoriedad por ID.\n- **Precisión de segundos**: KSUID solo guarda segundos, los milisegundos se redondean hacia abajo."
  },
  "fr": {
    "what-is-ksuid": "Qu'est-ce que KSUID ?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) est un identifiant base62 de 27 caractères qui intègre un timestamp de 32 bits (secondes depuis 2014-05-13) et 128 bits de données aléatoires.\n\n**Points clés :**\n- **Triable par le temps** : l'ordre lexicographique suit l'heure de création.\n- **Forte unicité** : 128 bits d'aléa par ID.\n- **Précision à la seconde** : KSUID stocke les secondes, les millisecondes sont arrondies vers le bas."
  },
  "de": {
    "what-is-ksuid": "Was ist KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) ist eine 27-stellige Base62-Kennung, die einen 32-Bit-Zeitstempel (Sekunden seit 2014-05-13) und 128 Bit Zufallsdaten enthält.\n\n**Kernpunkte:**\n- **Zeitlich sortierbar**: die lexikografische Reihenfolge folgt der Erstellzeit.\n- **Hohe Eindeutigkeit**: 128 Bit Zufall pro ID.\n- **Sekundenpräzision**: KSUID speichert Sekunden, Millisekunden werden abgerundet."
  },
  "it": {
    "what-is-ksuid": "Cos'è KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) è un identificatore base62 di 27 caratteri che incorpora un timestamp a 32 bit (secondi dal 2014-05-13) e 128 bit di dati casuali.\n\n**Punti chiave:**\n- **Ordinabile per tempo**: l'ordine lessicografico segue l'ora di creazione.\n- **Alta unicità**: 128 bit di casualità per ID.\n- **Precisione al secondo**: KSUID memorizza solo i secondi, i millisecondi vengono arrotondati verso il basso."
  },
  "ja": {
    "what-is-ksuid": "KSUIDとは？",
    "what-is-ksuid-description-markdown": "KSUID（K-Sortable Unique IDentifier）は、32 ビットのタイムスタンプ（2014-05-13 からの秒）と 128 ビットの乱数を含む、27 文字の Base62 識別子です。\n\n**ポイント：**\n- **時間順に並ぶ**：辞書順が生成時刻に一致します。\n- **高い一意性**：1 ID あたり 128 ビットの乱数。\n- **秒精度**：KSUID は秒のみを保持し、ミリ秒入力は切り捨てられます。"
  },
  "ko": {
    "what-is-ksuid": "KSUID란?",
    "what-is-ksuid-description-markdown": "KSUID(K-Sortable Unique IDentifier)는 32비트 타임스탬프(2014-05-13 이후의 초)와 128비트 랜덤 데이터를 포함하는 27자 Base62 식별자입니다.\n\n**핵심 포인트:**\n- **시간 정렬 가능**: 사전순이 생성 시간과 일치합니다.\n- **높은 고유성**: ID당 128비트 랜덤성.\n- **초 단위 정밀도**: KSUID는 초만 저장하며, 밀리초 입력은 내림됩니다."
  },
  "ru": {
    "what-is-ksuid": "Что такое KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) - это 27-символьный идентификатор base62, содержащий 32-битный временной штамп (секунды с 2014-05-13) и 128 бит случайных данных.\n\n**Ключевые моменты:**\n- **Сортируется по времени**: лексикографический порядок соответствует времени создания.\n- **Высокая уникальность**: 128 бит случайности на ID.\n- **Точность до секунд**: KSUID хранит секунды, миллисекунды округляются вниз."
  },
  "pt": {
    "what-is-ksuid": "O que é KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) é um identificador base62 de 27 caracteres que incorpora um timestamp de 32 bits (segundos desde 2014-05-13) e 128 bits de dados aleatórios.\n\n**Pontos-chave:**\n- **Ordenável por tempo**: a ordem lexicográfica segue o horário de criação.\n- **Alta unicidade**: 128 bits de aleatoriedade por ID.\n- **Precisão de segundos**: KSUID armazena segundos, milissegundos são arredondados para baixo."
  },
  "ar": {
    "what-is-ksuid": "ما هو KSUID؟",
    "what-is-ksuid-description-markdown": "‏KSUID (K-Sortable Unique IDentifier) هو معرّف base62 بطول 27 حرفًا يضم طابعًا زمنيًا 32 بت (الثواني منذ 2014-05-13) و128 بت من البيانات العشوائية.\n\n**نقاط أساسية:**\n- **قابل للترتيب زمنيًا**: الترتيب المعجمي يتبع وقت الإنشاء.\n- **تفرد عالٍ**: 128 بت من العشوائية لكل معرّف.\n- **دقة الثواني**: KSUID يخزن الثواني فقط، ويتم تقريب إدخال المللي ثانية إلى الأسفل."
  },
  "hi": {
    "what-is-ksuid": "KSUID क्या है?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) 27-वर्ण का Base62 पहचानकर्ता है जिसमें 32-बिट टाइमस्टैम्प (2014-05-13 से सेकंड) और 128-बिट यादृच्छिक डेटा होता है।\n\n**मुख्य बिंदु:**\n- **समय के अनुसार क्रमबद्ध**: लेक्सिकोग्राफिक क्रम निर्माण समय का अनुसरण करता है।\n- **उच्च अद्वितीयता**: प्रति ID 128-बिट रैंडमनेस।\n- **सेकंड की सटीकता**: KSUID केवल सेकंड रखता है, मिलीसेकंड इनपुट नीचे की ओर राउंड होता है।"
  },
  "tr": {
    "what-is-ksuid": "KSUID nedir?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier), 32 bit zaman damgası (2014-05-13'ten itibaren saniye) ve 128 bit rastgele veri içeren 27 karakterlik bir base62 kimliğidir.\n\n**Öne çıkanlar:**\n- **Zamana göre sıralanabilir**: leksikografik sıra oluşturulma zamanını izler.\n- **Yüksek benzersizlik**: ID başına 128 bit rastgelelik.\n- **Saniye hassasiyeti**: KSUID yalnızca saniyeleri saklar, milisaniye girdileri aşağı yuvarlanır."
  },
  "nl": {
    "what-is-ksuid": "Wat is KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) is een base62-id van 27 tekens met een 32-bit tijdstempel (seconden sinds 2014-05-13) en 128 bits willekeurige data.\n\n**Belangrijkste punten:**\n- **Tijd-sorteerbaar**: lexicografische volgorde volgt de aanmaaktijd.\n- **Hoge uniciteit**: 128 bits willekeur per ID.\n- **Secondeprecisie**: KSUID slaat seconden op, milliseconden worden naar beneden afgerond."
  },
  "sv": {
    "what-is-ksuid": "Vad är KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) är en 27-teckens base62-identifierare som innehåller en 32-bitars tidsstämpel (sekunder sedan 2014-05-13) och 128 bitars slumpdata.\n\n**Nyckelpunkter:**\n- **Tids-sorterbar**: lexikografisk ordning följer skapandetiden.\n- **Hög unikhet**: 128 bitars slump per ID.\n- **Sekundprecision**: KSUID lagrar bara sekunder, millisekunder avrundas nedåt."
  },
  "pl": {
    "what-is-ksuid": "Czym jest KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) to 27-znakowy identyfikator base62, który zawiera 32-bitowy znacznik czasu (sekundy od 2014-05-13) oraz 128 bitów danych losowych.\n\n**Kluczowe punkty:**\n- **Sortowalny czasowo**: porządek leksykograficzny odpowiada czasowi utworzenia.\n- **Wysoka unikalność**: 128 bitów losowości na ID.\n- **Precyzja do sekund**: KSUID przechowuje sekundy, milisekundy są zaokrąglane w dół."
  },
  "vi": {
    "what-is-ksuid": "KSUID là gì?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) là định danh base62 dài 27 ký tự, chứa dấu thời gian 32 bit (giây kể từ 2014-05-13) và 128 bit dữ liệu ngẫu nhiên.\n\n**Điểm chính:**\n- **Sắp xếp theo thời gian**: thứ tự từ điển theo thời điểm tạo.\n- **Độ duy nhất cao**: 128 bit ngẫu nhiên cho mỗi ID.\n- **Độ chính xác giây**: KSUID chỉ lưu giây, mili giây bị làm tròn xuống."
  },
  "th": {
    "what-is-ksuid": "KSUID คืออะไร?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) คือรหัส base62 ยาว 27 ตัวอักษร ที่บรรจุไทม์สแตมป์ 32 บิต (วินาทีตั้งแต่ 2014-05-13) และข้อมูลสุ่ม 128 บิต.\n\n**ประเด็นสำคัญ:**\n- **เรียงตามเวลาได้**: ลำดับแบบพจนานุกรมสอดคล้องกับเวลาสร้าง.\n- **ความเป็นเอกลักษณ์สูง**: สุ่ม 128 บิตต่อหนึ่ง ID.\n- **ความละเอียดระดับวินาที**: KSUID เก็บแค่วินาที อินพุตมิลลิวินาทีจะถูกปัดลง."
  },
  "id": {
    "what-is-ksuid": "Apa itu KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) adalah identifikator base62 sepanjang 27 karakter yang berisi timestamp 32-bit (detik sejak 2014-05-13) dan 128 bit data acak.\n\n**Poin utama:**\n- **Dapat diurutkan menurut waktu**: urutan leksikografis mengikuti waktu pembuatan.\n- **Keunikan tinggi**: 128 bit keacakan per ID.\n- **Presisi detik**: KSUID hanya menyimpan detik, input milidetik dibulatkan ke bawah."
  },
  "he": {
    "what-is-ksuid": "מהו KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) הוא מזהה base62 באורך 27 תווים שמשלב חותמת זמן של 32 ביט (שניות מאז 2014-05-13) ו-128 ביט של נתונים אקראיים.\n\n**נקודות מפתח:**\n- **מיון לפי זמן**: הסדר הלכסיקוגרפי עוקב אחרי זמן היצירה.\n- **ייחודיות גבוהה**: 128 ביט אקראיות לכל ID.\n- **דיוק של שניות**: KSUID שומר רק שניות, קלט במילישניות מעוגל כלפי מטה."
  },
  "ms": {
    "what-is-ksuid": "Apakah KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) ialah pengecam base62 27 aksara yang mengandungi cap masa 32 bit (saat sejak 2014-05-13) dan 128 bit data rawak.\n\n**Perkara utama:**\n- **Boleh diisih mengikut masa**: susunan leksikografik mengikut masa dicipta.\n- **Keunikan tinggi**: 128 bit rawak bagi setiap ID.\n- **Ketepatan saat**: KSUID hanya menyimpan saat, input milisaat dibundarkan ke bawah."
  },
  "no": {
    "what-is-ksuid": "Hva er KSUID?",
    "what-is-ksuid-description-markdown": "KSUID (K-Sortable Unique IDentifier) er en base62-identifikator på 27 tegn som inneholder en 32-bits tidsstempel (sekunder siden 2014-05-13) og 128 bit tilfeldig data.\n\n**Nøkkelpunkter:**\n- **Tids-sorterbar**: leksikografisk rekkefølge følger opprettelsestid.\n- **Høy unikhet**: 128 bit tilfeldighet per ID.\n- **Sekundpresisjon**: KSUID lagrer bare sekunder, millisekunder avrundes ned."
  }
}
</i18n>
