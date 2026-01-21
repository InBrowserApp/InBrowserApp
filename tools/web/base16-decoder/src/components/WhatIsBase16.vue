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
    "title": "What is Base16 (Hex)?",
    "description": "Base16, also called hexadecimal (hex), is a binary-to-text encoding that represents each byte as two characters using digits 0-9 and letters A-F. It is widely used for inspecting bytes, checksums, and identifiers.\n\n**Common uses:**\n- Debugging and logging raw bytes\n- Representing hashes, keys, and IDs\n- Copy/paste-friendly encoding for binary data\n\n**Notes:**\n- Hex doubles the size of the original data (1 byte -> 2 chars)\n- This tool accepts optional `0x` prefixes and ignores whitespace"
  },
  "zh": {
    "title": "什么是 Base16（Hex）？",
    "description": "Base16，也叫十六进制（Hex），是一种二进制到文本的编码方式，用 0-9 和 A-F 表示数据，每个字节对应两个字符。它常用于查看字节数据、校验和以及标识符等场景。\n\n**常见用途：**\n- 调试和日志中查看原始字节\n- 表示哈希、密钥和 ID\n- 在只支持文本的场景中复制/粘贴二进制数据\n\n**注意：**\n- Hex 会让数据体积翻倍（1 字节 -> 2 字符）\n- 本工具支持可选的 `0x` 前缀并忽略空白字符"
  },
  "zh-CN": {
    "title": "什么是 Base16（Hex）？",
    "description": "Base16，也叫十六进制（Hex），是一种二进制到文本的编码方式，用 0-9 和 A-F 表示数据，每个字节对应两个字符。它常用于查看字节数据、校验和以及标识符等场景。\n\n**常见用途：**\n- 调试和日志中查看原始字节\n- 表示哈希、密钥和 ID\n- 在只支持文本的场景中复制/粘贴二进制数据\n\n**注意：**\n- Hex 会让数据体积翻倍（1 字节 -> 2 字符）\n- 本工具支持可选的 `0x` 前缀并忽略空白字符"
  },
  "zh-TW": {
    "title": "什麼是 Base16（Hex）？",
    "description": "Base16，也叫十六進位（Hex），是一種二進位到文字的編碼方式，用 0-9 和 A-F 表示資料，每個位元組對應兩個字元。它常用於檢視位元組資料、校驗和以及識別碼等情境。\n\n**常見用途：**\n- 在除錯與日誌中檢視原始位元組\n- 表示雜湊、金鑰與 ID\n- 在僅支援文字的場景中複製/貼上二進位資料\n\n**注意：**\n- Hex 會讓資料大小加倍（1 位元組 -> 2 字元）\n- 本工具支援可選的 `0x` 前綴並忽略空白字元"
  },
  "zh-HK": {
    "title": "什麼是 Base16（Hex）？",
    "description": "Base16，也叫十六進位（Hex），是一種二進位到文字的編碼方式，用 0-9 和 A-F 表示資料，每個位元組對應兩個字元。它常用於檢視位元組資料、校驗和以及識別碼等情境。\n\n**常見用途：**\n- 在除錯與日誌中檢視原始位元組\n- 表示雜湊、金鑰與 ID\n- 在僅支援文字的場景中複製/貼上二進位資料\n\n**注意：**\n- Hex 會讓資料大小加倍（1 位元組 -> 2 字元）\n- 本工具支援可選的 `0x` 前綴並忽略空白字元"
  },
  "es": {
    "title": "¿Qué es Base16 (Hex)?",
    "description": "Base16, también llamado hexadecimal (hex), es una codificación binario-a-texto que representa cada byte con dos caracteres usando 0-9 y A-F. Se usa para inspeccionar bytes, checksums e identificadores.\n\n**Usos comunes:**\n- Depuración y registros de bytes crudos\n- Representar hashes, claves e ID\n- Copiar/pegar datos binarios en canales de texto\n\n**Notas:**\n- Hex duplica el tamaño de los datos (1 byte -> 2 caracteres)\n- Esta herramienta acepta prefijos `0x` opcionales e ignora espacios en blanco"
  },
  "fr": {
    "title": "Qu'est-ce que Base16 (Hex) ?",
    "description": "Base16, aussi appelé hexadécimal (hex), est un encodage binaire-texte qui représente chaque octet par deux caractères 0-9 et A-F. Il est utilisé pour inspecter des octets, des checksums et des identifiants.\n\n**Usages courants :**\n- Débogage et journaux d'octets bruts\n- Représentation de hachages, clés et ID\n- Copier/coller des données binaires dans des canaux texte\n\n**Remarques :**\n- Hex double la taille des données (1 octet -> 2 caractères)\n- Cet outil accepte des préfixes `0x` optionnels et ignore les espaces"
  },
  "de": {
    "title": "Was ist Base16 (Hex)?",
    "description": "Base16, auch Hexadezimal (Hex) genannt, ist eine Binär-zu-Text-Kodierung, die jedes Byte mit zwei Zeichen (0-9 und A-F) darstellt. Sie wird häufig zum Anzeigen von Bytes, Prüfsummen und Kennungen verwendet.\n\n**Häufige Nutzung:**\n- Debugging und Logging roher Bytes\n- Darstellung von Hashes, Schlüsseln und IDs\n- Kopieren/Einfügen von Binärdaten in Textkanälen\n\n**Hinweise:**\n- Hex verdoppelt die Datenmenge (1 Byte -> 2 Zeichen)\n- Dieses Tool akzeptiert optionale `0x`-Präfixe und ignoriert Leerzeichen"
  },
  "it": {
    "title": "Cos'è Base16 (Hex)?",
    "description": "Base16, noto anche come esadecimale (hex), è una codifica da binario a testo che rappresenta ogni byte con due caratteri usando 0-9 e A-F. È usato per ispezionare byte, checksum e identificatori.\n\n**Usi comuni:**\n- Debug e log di byte grezzi\n- Rappresentare hash, chiavi e ID\n- Copiare/incollare dati binari in canali di testo\n\n**Note:**\n- Hex raddoppia la dimensione dei dati (1 byte -> 2 caratteri)\n- Questo strumento accetta prefissi `0x` opzionali e ignora gli spazi"
  },
  "ja": {
    "title": "Base16（Hex）とは？",
    "description": "Base16（16進数/Hex）は、バイナリをテキストに変換するエンコード方式で、0-9 と A-F の文字で各バイトを 2 文字として表します。バイト列の確認、チェックサム、識別子の表現によく使われます。\n\n**主な用途：**\n- デバッグやログで生バイトを確認\n- ハッシュ、鍵、ID の表現\n- テキストしか扱えない環境でのコピー/貼り付け\n\n**注意点：**\n- Hex はサイズが 2 倍になります（1 バイト -> 2 文字）\n- このツールは `0x` プレフィックスを任意で受け付け、空白を無視します"
  },
  "ko": {
    "title": "Base16(HEX)이란?",
    "description": "Base16(16진수, HEX)은 바이너리를 텍스트로 표현하는 인코딩으로, 0-9와 A-F를 사용해 각 바이트를 두 글자로 나타냅니다. 바이트 확인, 체크섬, 식별자 표현에 널리 쓰입니다.\n\n**일반적인 사용:**\n- 디버깅 및 로그에서 원시 바이트 확인\n- 해시, 키, ID 표현\n- 텍스트만 가능한 환경에서 바이너리 복사/붙여넣기\n\n**참고:**\n- Hex는 크기를 두 배로 만듭니다 (1 바이트 -> 2 글자)\n- 이 도구는 선택적인 `0x` 접두사를 허용하고 공백을 무시합니다"
  },
  "ru": {
    "title": "Что такое Base16 (Hex)?",
    "description": "Base16, или шестнадцатеричный (hex), — это кодирование «бинарные данные в текст», где каждый байт представлен двумя символами 0-9 и A-F. Часто используется для просмотра байтов, контрольных сумм и идентификаторов.\n\n**Обычно используется для:**\n- Отладки и логирования сырых байтов\n- Представления хэшей, ключей и идентификаторов\n- Удобного копирования бинарных данных в текстовых каналах\n\n**Примечания:**\n- Hex удваивает размер данных (1 байт -> 2 символа)\n- Инструмент принимает необязательный префикс `0x` и игнорирует пробелы"
  },
  "pt": {
    "title": "O que é Base16 (Hex)?",
    "description": "Base16, também conhecido como hexadecimal (hex), é uma codificação binário-para-texto que representa cada byte com dois caracteres usando 0-9 e A-F. É muito usado para inspecionar bytes, checksums e identificadores.\n\n**Usos comuns:**\n- Depuração e logs de bytes brutos\n- Representar hashes, chaves e IDs\n- Copiar/colar dados binários em canais de texto\n\n**Notas:**\n- Hex dobra o tamanho dos dados (1 byte -> 2 caracteres)\n- Esta ferramenta aceita prefixos `0x` opcionais e ignora espaços em branco"
  },
  "ar": {
    "title": "ما هو Base16 (Hex)؟",
    "description": "Base16، المعروف أيضًا بالست عشري (hex)، هو ترميز من البيانات الثنائية إلى نص يمثل كل بايت بحرفين باستخدام 0-9 و A-F. يُستخدم كثيرًا لعرض البايتات، والـ checksums، والمعرّفات.\n\n**استخدامات شائعة:**\n- تصحيح الأخطاء وتسجيل البايتات الخام\n- تمثيل التجزئات والمفاتيح والمعرّفات\n- نسخ/لصق البيانات الثنائية في قنوات نصية\n\n**ملاحظات:**\n- Hex يضاعف حجم البيانات (1 بايت -> حرفان)\n- تقبل هذه الأداة بادئات `0x` الاختيارية وتتجاهل المسافات"
  },
  "hi": {
    "title": "Base16 (Hex) क्या है?",
    "description": "Base16, जिसे hexadecimal (hex) भी कहते हैं, एक binary-to-text एन्कोडिंग है जो 0-9 और A-F का उपयोग करके हर byte को दो अक्षरों में दर्शाती है। इसका उपयोग bytes देखने, checksum और पहचानकर्ता दिखाने में होता है।\n\n**आम उपयोग:**\n- डिबगिंग और लॉग में raw bytes देखना\n- hash, keys और ID को दर्शाना\n- टेक्स्ट चैनलों में बाइनरी डेटा कॉपी/पेस्ट करना\n\n**नोट्स:**\n- Hex डेटा का आकार दोगुना कर देता है (1 byte -> 2 अक्षर)\n- यह टूल वैकल्पिक `0x` प्रीफ़िक्स स्वीकार करता है और whitespace को अनदेखा करता है"
  },
  "tr": {
    "title": "Base16 (Hex) nedir?",
    "description": "Base16, onaltılık (hex) olarak da bilinen, her baytı 0-9 ve A-F kullanarak iki karakterle gösteren bir ikiliden-metine kodlamadır. Baytları incelemek, checksum ve kimlikleri temsil etmek için yaygın kullanılır.\n\n**Yaygın kullanım:**\n- Hata ayıklama ve günlüklerde ham baytları görmek\n- Hash'leri, anahtarları ve ID'leri temsil etmek\n- Metin kanallarında ikili veriyi kopyala/yapıştır yapmak\n\n**Notlar:**\n- Hex verinin boyutunu iki katına çıkarır (1 bayt -> 2 karakter)\n- Bu araç isteğe bağlı `0x` öneklerini kabul eder ve boşlukları yok sayar"
  },
  "nl": {
    "title": "Wat is Base16 (Hex)?",
    "description": "Base16, ook wel hexadecimaal (hex) genoemd, is een binair-naar-tekst-codering die elke byte met twee tekens weergeeft met 0-9 en A-F. Het wordt gebruikt voor het inspecteren van bytes, checksums en identifiers.\n\n**Veelvoorkomend gebruik:**\n- Debuggen en loggen van ruwe bytes\n- Hashes, sleutels en ID's weergeven\n- Binaire data kopiëren/plakken in tekstkanalen\n\n**Opmerkingen:**\n- Hex verdubbelt de gegevensgrootte (1 byte -> 2 tekens)\n- Deze tool accepteert optionele `0x`-prefixen en negeert spaties"
  },
  "sv": {
    "title": "Vad är Base16 (Hex)?",
    "description": "Base16, även kallat hexadecimal (hex), är en binär-till-text-kodning som representerar varje byte med två tecken (0-9 och A-F). Det används för att inspektera bytes, checksummor och identifierare.\n\n**Vanliga användningar:**\n- Felsökning och loggning av råa bytes\n- Representera hashvärden, nycklar och ID:n\n- Kopiera/klistra in binärdata i textkanaler\n\n**Noteringar:**\n- Hex fördubblar datastorleken (1 byte -> 2 tecken)\n- Det här verktyget accepterar valfria `0x`-prefix och ignorerar blanksteg"
  },
  "pl": {
    "title": "Czym jest Base16 (Hex)?",
    "description": "Base16, znany też jako szesnastkowy (hex), to kodowanie binarne na tekst, które przedstawia każdy bajt jako dwa znaki 0-9 i A-F. Jest używane do podglądu bajtów, sum kontrolnych i identyfikatorów.\n\n**Typowe zastosowania:**\n- Debugowanie i logowanie surowych bajtów\n- Reprezentacja hashy, kluczy i ID\n- Kopiowanie/wklejanie danych binarnych w kanałach tekstowych\n\n**Uwagi:**\n- Hex podwaja rozmiar danych (1 bajt -> 2 znaki)\n- Narzędzie akceptuje opcjonalne prefiksy `0x` i ignoruje białe znaki"
  },
  "vi": {
    "title": "Base16 (Hex) là gì?",
    "description": "Base16, còn gọi là hexadecimal (hex), là kiểu mã hóa nhị phân sang văn bản, biểu diễn mỗi byte bằng hai ký tự 0-9 và A-F. Nó thường dùng để xem byte, checksum và định danh.\n\n**Cách dùng phổ biến:**\n- Gỡ lỗi và ghi log byte thô\n- Biểu diễn hash, khóa và ID\n- Sao chép/dán dữ liệu nhị phân trong kênh văn bản\n\n**Lưu ý:**\n- Hex làm dữ liệu tăng gấp đôi (1 byte -> 2 ký tự)\n- Công cụ này chấp nhận tiền tố `0x` tùy chọn và bỏ qua khoảng trắng"
  },
  "th": {
    "title": "Base16 (Hex) คืออะไร?",
    "description": "Base16 หรือ hexadecimal (hex) คือการเข้ารหัสจากไบนารีเป็นข้อความ โดยแทนแต่ละไบต์ด้วยอักขระ 2 ตัวที่ใช้ 0-9 และ A-F นิยมใช้สำหรับตรวจดูไบต์ เช็คซัม และตัวระบุ.\n\n**การใช้งานทั่วไป:**\n- ดีบักและบันทึกไบต์ดิบ\n- แทนค่าแฮช คีย์ และ ID\n- คัดลอก/วางข้อมูลไบนารีในช่องทางที่รองรับข้อความ\n\n**หมายเหตุ:**\n- Hex ทำให้ขนาดข้อมูลเพิ่มเป็นสองเท่า (1 ไบต์ -> 2 อักขระ)\n- เครื่องมือนี้รองรับคำนำหน้า `0x` แบบไม่บังคับและละเว้นช่องว่าง"
  },
  "id": {
    "title": "Apa itu Base16 (Hex)?",
    "description": "Base16, juga dikenal sebagai heksadesimal (hex), adalah encoding biner-ke-teks yang merepresentasikan setiap byte dengan dua karakter 0-9 dan A-F. Umum digunakan untuk inspeksi byte, checksum, dan identifikasi.\n\n**Penggunaan umum:**\n- Debugging dan logging byte mentah\n- Mewakili hash, kunci, dan ID\n- Menyalin/menempel data biner di kanal teks\n\n**Catatan:**\n- Hex menggandakan ukuran data (1 byte -> 2 karakter)\n- Alat ini menerima prefiks `0x` opsional dan mengabaikan spasi"
  },
  "he": {
    "title": "מה זה Base16 (Hex)?",
    "description": "Base16, הידוע גם כהקסדצימלי (hex), הוא קידוד בינארי-לטקסט שמייצג כל בית כשני תווים באמצעות 0-9 ו-A-F. הוא נפוץ לבדיקת בתים, checksums ומזהים.\n\n**שימושים נפוצים:**\n- ניפוי באגים ולוגים של בתים גולמיים\n- ייצוג hash, מפתחות ו-ID\n- העתקה/הדבקה של נתונים בינאריים בערוצי טקסט\n\n**הערות:**\n- Hex מכפיל את גודל הנתונים (1 byte -> 2 תווים)\n- הכלי מקבל תחיליות `0x` אופציונליות ומתעלם מרווחים"
  },
  "ms": {
    "title": "Apakah Base16 (Hex)?",
    "description": "Base16, juga dikenali sebagai heksadesimal (hex), ialah pengekodan binari-ke-teks yang mewakili setiap bait dengan dua aksara menggunakan 0-9 dan A-F. Ia digunakan untuk memeriksa bait, checksum dan pengecam.\n\n**Kegunaan biasa:**\n- Nyahpepijat dan log bait mentah\n- Mewakili hash, kunci dan ID\n- Salin/tampal data binari dalam saluran teks\n\n**Nota:**\n- Hex menggandakan saiz data (1 bait -> 2 aksara)\n- Alat ini menerima awalan `0x` pilihan dan mengabaikan ruang putih"
  },
  "no": {
    "title": "Hva er Base16 (Hex)?",
    "description": "Base16, også kalt heksadesimal (hex), er en binær-til-tekst-koding som representerer hver byte som to tegn med 0-9 og A-F. Den brukes ofte til å inspisere bytes, kontrollsummer og identifikatorer.\n\n**Vanlige bruksområder:**\n- Feilsøking og logging av rå bytes\n- Representasjon av hasher, nøkler og ID-er\n- Kopiere/lime inn binærdata i tekstkanaler\n\n**Merknader:**\n- Hex dobler datastørrelsen (1 byte -> 2 tegn)\n- Dette verktøyet godtar valgfrie `0x`-prefikser og ignorerer mellomrom"
  }
}
</i18n>
