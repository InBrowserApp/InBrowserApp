<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DescriptionMarkdown } from '@shared/ui/base'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a list comparer?",
    "description": "A list comparer splits text into items, normalizes them with rules such as trimming or case-insensitive matching, and then compares the resulting sets. It is useful for checking tags, email addresses, package names, IDs, or any copied data where you need overlap, differences, and duplicate detection without uploading data."
  },
  "zh": {
    "title": "什么是列表比较器？",
    "description": "列表比较器会先按分隔规则把文本拆成项目，再根据去空白、忽略大小写等规则做归一化，最后比较得到的集合。它适合用于检查标签、邮箱、包名、ID 或任何复制来的数据，找出交集、差集和重复项，而且无需上传数据。"
  },
  "zh-CN": {
    "title": "什么是列表比较器？",
    "description": "列表比较器会先按分隔规则把文本拆成项目，再根据去空白、忽略大小写等规则做归一化，最后比较得到的集合。它适合用于检查标签、邮箱、包名、ID 或任何复制来的数据，找出交集、差集和重复项，而且无需上传数据。"
  },
  "zh-TW": {
    "title": "什麼是列表比較器？",
    "description": "列表比較器會先依分隔規則將文字拆成項目，再依去除空白、忽略大小寫等規則做正規化，最後比較得到的集合。它很適合用來檢查標籤、信箱、套件名稱、ID 或任何貼上的資料，找出交集、差集與重複項，而且不需上傳資料。"
  },
  "zh-HK": {
    "title": "什麼是列表比較器？",
    "description": "列表比較器會先依分隔規則將文字拆成項目，再依去除空白、忽略大小寫等規則做正規化，最後比較得到的集合。它很適合用來檢查標籤、信箱、套件名稱、ID 或任何貼上的資料，找出交集、差集與重複項，而且不需上傳資料。"
  },
  "es": {
    "title": "¿Que es un comparador de listas?",
    "description": "Un comparador de listas divide el texto en elementos, los normaliza con reglas como recorte o coincidencia sin mayusculas y luego compara los conjuntos resultantes. Sirve para revisar etiquetas, correos, nombres de paquetes, IDs o cualquier dato copiado sin subir informacion."
  },
  "fr": {
    "title": "Qu'est-ce qu'un comparateur de listes ?",
    "description": "Un comparateur de listes decoupe le texte en elements, les normalise avec des regles comme le trim ou la casse insensible, puis compare les ensembles obtenus. Il est utile pour verifier des tags, des emails, des noms de paquets, des identifiants ou toute donnee copiee sans televersement."
  },
  "de": {
    "title": "Was ist ein Listenvergleich?",
    "description": "Ein Listenvergleich zerlegt Text in Eintrage, normalisiert sie mit Regeln wie Trimmen oder gross-/kleinschreibungsunabhangigem Abgleich und vergleicht dann die resultierenden Mengen. Das ist hilfreich fur Tags, E-Mail-Adressen, Paketnamen, IDs oder andere kopierte Daten ohne Upload."
  },
  "it": {
    "title": "Che cos'e un comparatore di liste?",
    "description": "Un comparatore di liste divide il testo in elementi, li normalizza con regole come trim o confronto senza distinzione tra maiuscole e minuscole, quindi confronta gli insiemi risultanti. E utile per tag, email, nomi di pacchetti, ID o altri dati copiati senza caricarli."
  },
  "ja": {
    "title": "リスト比較ツールとは？",
    "description": "リスト比較ツールは、テキストを項目に分割し、トリムや大文字小文字の無視などのルールで正規化してから集合を比較します。タグ、メールアドレス、パッケージ名、ID などのコピー済みデータの差分確認に役立ち、データをアップロードする必要もありません。"
  },
  "ko": {
    "title": "목록 비교 도구란?",
    "description": "목록 비교 도구는 텍스트를 항목으로 나누고 공백 제거, 대소문자 무시 같은 규칙으로 정규화한 뒤 결과 집합을 비교합니다. 태그, 이메일, 패키지 이름, ID 같은 복사한 데이터를 업로드 없이 비교할 때 유용합니다."
  },
  "ru": {
    "title": "Что такое сравнение списков?",
    "description": "Инструмент сравнения списков разбивает текст на элементы, нормализует их по правилам вроде обрезки пробелов или игнорирования регистра, а затем сравнивает полученные множества. Это удобно для тегов, email, названий пакетов, ID и любых скопированных данных без загрузки на сервер."
  },
  "pt": {
    "title": "O que e um comparador de listas?",
    "description": "Um comparador de listas divide o texto em itens, normaliza com regras como trim e comparacao sem maiusculas, e depois compara os conjuntos resultantes. Ele e util para tags, emails, nomes de pacotes, IDs e outros dados copiados sem precisar enviar nada."
  },
  "ar": {
    "title": "ما هو مقارن القوائم؟",
    "description": "يقسم مقارن القوائم النص إلى عناصر، ثم يطبعها وفق قواعد مثل حذف الفراغات أو تجاهل حالة الأحرف، وبعد ذلك يقارن المجموعات الناتجة. يفيد ذلك في مقارنة الوسوم والبريد الإلكتروني وأسماء الحزم والمعرفات وأي بيانات منسوخة دون رفعها."
  },
  "hi": {
    "title": "सूची तुलना उपकरण क्या है?",
    "description": "सूची तुलना उपकरण टेक्स्ट को आइटम में बांटता है, फिर trim या case-insensitive matching जैसी नियमों से उन्हें सामान्य करता है और उसके बाद बने सेट की तुलना करता है। यह टैग, ईमेल, पैकेज नाम, ID और अन्य कॉपी किए गए डेटा के लिए उपयोगी है, बिना डेटा अपलोड किए।"
  },
  "tr": {
    "title": "Liste karsilastirici nedir?",
    "description": "Bir liste karsilastirici metni ogelere ayirir, kirpma veya buyuk/kucuk harf duyarsiz eslestirme gibi kurallarla normallestirir ve sonra ortaya cikan kumeleri karsilastirir. Etiketler, e-postalar, paket adlari, kimlikler ve diger kopyalanmis veriler icin yukleme yapmadan kullanislidir."
  },
  "nl": {
    "title": "Wat is een lijstvergelijker?",
    "description": "Een lijstvergelijker splitst tekst in items, normaliseert die met regels zoals trimmen of hoofdletterongevoelige matching en vergelijkt daarna de resulterende sets. Handig voor tags, e-mails, pakketnamen, IDs en andere gekopieerde data zonder upload."
  },
  "sv": {
    "title": "Vad ar en listjamforare?",
    "description": "En listjamforare delar upp text i poster, normaliserar dem med regler som trimning eller skiftlageokanslig matchning och jamfor sedan de resulterande mangderna. Det ar anvandbart for taggar, e-postadresser, paketnamn, ID:n och annan kopierad data utan uppladdning."
  },
  "pl": {
    "title": "Czym jest porownywarka list?",
    "description": "Porownywarka list dzieli tekst na elementy, normalizuje je wedlug zasad takich jak przycinanie lub ignorowanie wielkosci liter, a nastepnie porownuje otrzymane zbiory. Przydaje sie do tagow, adresow email, nazw pakietow, ID i innych skopiowanych danych bez wysylania ich."
  },
  "vi": {
    "title": "Cong cu so sanh danh sach la gi?",
    "description": "Cong cu so sanh danh sach tach van ban thanh cac muc, chuan hoa chung bang cac quy tac nhu cat khoang trang hoac bo qua chu hoa chu thuong, sau do so sanh cac tap ket qua. Rat huu ich cho the, email, ten goi, ID va du lieu sao chep ma khong can tai len."
  },
  "th": {
    "title": "ตัวเปรียบเทียบรายการคืออะไร",
    "description": "ตัวเปรียบเทียบรายการจะตัดข้อความเป็นรายการย่อย ปรับรูปแบบตามกฎอย่างการตัดช่องว่างหรือไม่สนตัวพิมพ์ใหญ่เล็ก แล้วจึงเปรียบเทียบเซตที่ได้ เหมาะสำหรับแท็ก อีเมล ชื่อแพ็กเกจ ID และข้อมูลที่คัดลอกมาโดยไม่ต้องอัปโหลด"
  },
  "id": {
    "title": "Apa itu pembanding daftar?",
    "description": "Pembanding daftar memecah teks menjadi item, menormalkannya dengan aturan seperti trim atau pencocokan tanpa huruf besar kecil, lalu membandingkan himpunan hasilnya. Cocok untuk tag, email, nama paket, ID, dan data salinan lain tanpa perlu mengunggah data."
  },
  "he": {
    "title": "מהו משווה רשימות?",
    "description": "משווה רשימות מפצל טקסט לפריטים, מנרמל אותם לפי כללים כמו הסרת רווחים או התאמה ללא רישיות, ואז משווה בין הקבוצות שנוצרו. זה שימושי לתגים, כתובות דוא\"ל, שמות חבילות, מזהים וכל נתון מועתק אחר בלי להעלות אותו."
  },
  "ms": {
    "title": "Apakah pembanding senarai?",
    "description": "Pembanding senarai memecahkan teks kepada item, menormalkannya dengan peraturan seperti trim atau padanan tanpa huruf besar kecil, kemudian membandingkan set yang terhasil. Ia berguna untuk tag, emel, nama pakej, ID dan data salinan lain tanpa memuat naik data."
  },
  "no": {
    "title": "Hva er en liste-sammenligner?",
    "description": "En liste-sammenligner deler tekst opp i elementer, normaliserer dem med regler som trimming eller sammenligning uten store/sma bokstaver, og sammenligner deretter de resulterende mengdene. Dette er nyttig for tagger, e-postadresser, pakkenavn, ID-er og andre kopierte data uten opplasting."
  }
}
</i18n>
