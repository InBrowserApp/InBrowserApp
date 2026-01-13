<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description') }}</NText>

    <NH3>{{ t('isbn10Title') }}</NH3>
    <NText tag="p">{{ t('isbn10Description') }}</NText>
    <NOl>
      <NLi>{{ t('isbn10Step1') }}</NLi>
      <NLi>{{ t('isbn10Step2') }}</NLi>
      <NLi>{{ t('isbn10Step3') }}</NLi>
    </NOl>

    <NH3>{{ t('isbn13Title') }}</NH3>
    <NText tag="p">{{ t('isbn13Description') }}</NText>
    <NOl>
      <NLi>{{ t('isbn13Step1') }}</NLi>
      <NLi>{{ t('isbn13Step2') }}</NLi>
      <NLi>{{ t('isbn13Step3') }}</NLi>
    </NOl>

    <NText tag="p">{{ t('conversionNote') }}</NText>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText, NH3, NOl, NLi } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is ISBN?",
    "description": "ISBN (International Standard Book Number) is an identifier for books and editions.",
    "isbn10Title": "ISBN-10 Check",
    "isbn10Description": "ISBN-10 has 9 data digits plus a check digit (X means 10).",
    "isbn10Step1": "Remove hyphens and spaces",
    "isbn10Step2": "Multiply digits by weights 10 to 2 and sum",
    "isbn10Step3": "The check digit makes the total divisible by 11",
    "isbn13Title": "ISBN-13 Check",
    "isbn13Description": "ISBN-13 has 12 data digits plus a check digit, usually starting with 978 or 979.",
    "isbn13Step1": "Multiply digits alternately by 1 and 3",
    "isbn13Step2": "Sum the first 12 digits",
    "isbn13Step3": "The check digit makes the total a multiple of 10",
    "conversionNote": "Valid ISBN-10 converts to ISBN-13 with prefix 978; only ISBN-13 with 978 converts back."
  },
  "zh": {
    "title": "什么是 ISBN？",
    "description": "ISBN（国际标准书号）是用于标识图书及其版本的编号。",
    "isbn10Title": "ISBN-10 校验",
    "isbn10Description": "ISBN-10 由 9 位数据和 1 位校验位组成（X 表示 10）。",
    "isbn10Step1": "移除短横线和空格",
    "isbn10Step2": "按权重 10 到 2 相乘并求和",
    "isbn10Step3": "校验位使总和能被 11 整除",
    "isbn13Title": "ISBN-13 校验",
    "isbn13Description": "ISBN-13 由 12 位数据和 1 位校验位组成，通常以 978 或 979 开头。",
    "isbn13Step1": "按 1 和 3 交替相乘",
    "isbn13Step2": "对前 12 位求和",
    "isbn13Step3": "校验位使总和成为 10 的倍数",
    "conversionNote": "有效 ISBN-10 可加前缀 978 转为 ISBN-13；只有前缀 978 的 ISBN-13 可转回。"
  },
  "zh-CN": {
    "title": "什么是 ISBN？",
    "description": "ISBN（国际标准书号）是用于标识图书及其版本的编号。",
    "isbn10Title": "ISBN-10 校验",
    "isbn10Description": "ISBN-10 由 9 位数据和 1 位校验位组成（X 表示 10）。",
    "isbn10Step1": "移除短横线和空格",
    "isbn10Step2": "按权重 10 到 2 相乘并求和",
    "isbn10Step3": "校验位使总和能被 11 整除",
    "isbn13Title": "ISBN-13 校验",
    "isbn13Description": "ISBN-13 由 12 位数据和 1 位校验位组成，通常以 978 或 979 开头。",
    "isbn13Step1": "按 1 和 3 交替相乘",
    "isbn13Step2": "对前 12 位求和",
    "isbn13Step3": "校验位使总和成为 10 的倍数",
    "conversionNote": "有效 ISBN-10 可加前缀 978 转为 ISBN-13；只有前缀 978 的 ISBN-13 可转回。"
  },
  "zh-TW": {
    "title": "什麼是 ISBN？",
    "description": "ISBN（國際標準書號）是用於標識書籍及其版本的編號。",
    "isbn10Title": "ISBN-10 校驗",
    "isbn10Description": "ISBN-10 由 9 位資料和 1 位校驗位組成（X 表示 10）。",
    "isbn10Step1": "移除連字號和空格",
    "isbn10Step2": "按權重 10 到 2 相乘並求和",
    "isbn10Step3": "校驗位使總和可被 11 整除",
    "isbn13Title": "ISBN-13 校驗",
    "isbn13Description": "ISBN-13 由 12 位資料和 1 位校驗位組成，通常以 978 或 979 開頭。",
    "isbn13Step1": "按 1 和 3 交替相乘",
    "isbn13Step2": "對前 12 位求和",
    "isbn13Step3": "校驗位使總和成為 10 的倍數",
    "conversionNote": "有效 ISBN-10 可加前綴 978 轉為 ISBN-13；只有前綴 978 的 ISBN-13 可轉回。"
  },
  "zh-HK": {
    "title": "什麼是 ISBN？",
    "description": "ISBN（國際標準書號）是用於標識書籍及其版本的編號。",
    "isbn10Title": "ISBN-10 校驗",
    "isbn10Description": "ISBN-10 由 9 位資料和 1 位校驗位組成（X 表示 10）。",
    "isbn10Step1": "移除連字號和空格",
    "isbn10Step2": "按權重 10 到 2 相乘並求和",
    "isbn10Step3": "校驗位使總和可被 11 整除",
    "isbn13Title": "ISBN-13 校驗",
    "isbn13Description": "ISBN-13 由 12 位資料和 1 位校驗位組成，通常以 978 或 979 開頭。",
    "isbn13Step1": "按 1 和 3 交替相乘",
    "isbn13Step2": "對前 12 位求和",
    "isbn13Step3": "校驗位使總和成為 10 的倍數",
    "conversionNote": "有效 ISBN-10 可加前綴 978 轉為 ISBN-13；只有前綴 978 的 ISBN-13 可轉回。"
  },
  "es": {
    "title": "¿Qué es ISBN?",
    "description": "ISBN (International Standard Book Number) es un identificador de libros y ediciones.",
    "isbn10Title": "Verificación ISBN-10",
    "isbn10Description": "ISBN-10 tiene 9 dígitos de datos y un dígito de control (X significa 10).",
    "isbn10Step1": "Elimina guiones y espacios",
    "isbn10Step2": "Multiplica por pesos de 10 a 2 y suma",
    "isbn10Step3": "El dígito de control hace que el total sea divisible por 11",
    "isbn13Title": "Verificación ISBN-13",
    "isbn13Description": "ISBN-13 tiene 12 dígitos de datos y un dígito de control, normalmente empieza con 978 o 979.",
    "isbn13Step1": "Multiplica alternando por 1 y 3",
    "isbn13Step2": "Suma los primeros 12 dígitos",
    "isbn13Step3": "El dígito de control hace que el total sea múltiplo de 10",
    "conversionNote": "Un ISBN-10 válido se convierte a ISBN-13 con prefijo 978; solo ISBN-13 con 978 se convierte de vuelta."
  },
  "fr": {
    "title": "Qu'est-ce que l'ISBN ?",
    "description": "L'ISBN (International Standard Book Number) est un identifiant pour les livres et éditions.",
    "isbn10Title": "Vérification ISBN-10",
    "isbn10Description": "ISBN-10 comporte 9 chiffres de données et un chiffre de contrôle (X signifie 10).",
    "isbn10Step1": "Retirez les tirets et les espaces",
    "isbn10Step2": "Multipliez par des poids de 10 à 2 et additionnez",
    "isbn10Step3": "Le chiffre de contrôle rend la somme divisible par 11",
    "isbn13Title": "Vérification ISBN-13",
    "isbn13Description": "ISBN-13 comporte 12 chiffres de données et un chiffre de contrôle, commence généralement par 978 ou 979.",
    "isbn13Step1": "Multipliez alternativement par 1 et 3",
    "isbn13Step2": "Additionnez les 12 premiers chiffres",
    "isbn13Step3": "Le chiffre de contrôle rend la somme multiple de 10",
    "conversionNote": "Un ISBN-10 valide devient ISBN-13 avec le préfixe 978 ; seuls les ISBN-13 avec 978 se reconvertissent."
  },
  "de": {
    "title": "Was ist ISBN?",
    "description": "ISBN (International Standard Book Number) ist eine Kennung für Bücher und Ausgaben.",
    "isbn10Title": "ISBN-10-Prüfung",
    "isbn10Description": "ISBN-10 hat 9 Datensiffern und eine Prüfziffer (X bedeutet 10).",
    "isbn10Step1": "Bindestriche und Leerzeichen entfernen",
    "isbn10Step2": "Mit Gewichten 10 bis 2 multiplizieren und summieren",
    "isbn10Step3": "Die Prüfziffer macht die Summe durch 11 teilbar",
    "isbn13Title": "ISBN-13-Prüfung",
    "isbn13Description": "ISBN-13 hat 12 Datensiffern und eine Prüfziffer, beginnt normalerweise mit 978 oder 979.",
    "isbn13Step1": "Abwechselnd mit 1 und 3 multiplizieren",
    "isbn13Step2": "Die ersten 12 Ziffern summieren",
    "isbn13Step3": "Die Prüfziffer macht die Summe zu einem Vielfachen von 10",
    "conversionNote": "Gültiges ISBN-10 wird mit Präfix 978 zu ISBN-13; nur ISBN-13 mit 978 ist rückkonvertierbar."
  },
  "it": {
    "title": "Che cos'è l'ISBN?",
    "description": "ISBN (International Standard Book Number) è un identificatore di libri ed edizioni.",
    "isbn10Title": "Verifica ISBN-10",
    "isbn10Description": "ISBN-10 ha 9 cifre di dati e una cifra di controllo (X significa 10).",
    "isbn10Step1": "Rimuovi trattini e spazi",
    "isbn10Step2": "Moltiplica per pesi da 10 a 2 e somma",
    "isbn10Step3": "La cifra di controllo rende la somma divisibile per 11",
    "isbn13Title": "Verifica ISBN-13",
    "isbn13Description": "ISBN-13 ha 12 cifre di dati e una cifra di controllo, di solito inizia con 978 o 979.",
    "isbn13Step1": "Moltiplica alternando per 1 e 3",
    "isbn13Step2": "Somma le prime 12 cifre",
    "isbn13Step3": "La cifra di controllo rende la somma un multiplo di 10",
    "conversionNote": "Un ISBN-10 valido si converte in ISBN-13 con prefisso 978; solo ISBN-13 con 978 può tornare indietro."
  },
  "ja": {
    "title": "ISBN とは？",
    "description": "ISBN（国際標準図書番号）は書籍や版の識別子です。",
    "isbn10Title": "ISBN-10 のチェック",
    "isbn10Description": "ISBN-10 は 9 桁のデータと 1 桁のチェックディジット（X は 10）から成ります。",
    "isbn10Step1": "ハイフンと空白を除去",
    "isbn10Step2": "重み 10 から 2 で掛けて合計",
    "isbn10Step3": "チェックディジットで合計が 11 の倍数になるようにする",
    "isbn13Title": "ISBN-13 のチェック",
    "isbn13Description": "ISBN-13 は 12 桁のデータと 1 桁のチェックディジットで、通常 978 または 979 で始まります。",
    "isbn13Step1": "1 と 3 を交互に掛ける",
    "isbn13Step2": "最初の 12 桁を合計",
    "isbn13Step3": "チェックディジットで合計を 10 の倍数にする",
    "conversionNote": "有効な ISBN-10 は 978 を付けて ISBN-13 に変換できます。978 の ISBN-13 のみ逆変換可能です。"
  },
  "ko": {
    "title": "ISBN이란?",
    "description": "ISBN(International Standard Book Number)은 책과 판을 식별하는 번호입니다.",
    "isbn10Title": "ISBN-10 검사",
    "isbn10Description": "ISBN-10은 9자리 데이터와 1자리 체크 디지트(X는 10)로 구성됩니다.",
    "isbn10Step1": "하이픈과 공백 제거",
    "isbn10Step2": "가중치 10~2로 곱해 합산",
    "isbn10Step3": "체크 디지트로 합계가 11의 배수가 되게 함",
    "isbn13Title": "ISBN-13 검사",
    "isbn13Description": "ISBN-13은 12자리 데이터와 1자리 체크 디지트로, 보통 978 또는 979로 시작합니다.",
    "isbn13Step1": "1과 3을 번갈아 곱함",
    "isbn13Step2": "앞 12자리를 합산",
    "isbn13Step3": "체크 디지트로 합계가 10의 배수가 되게 함",
    "conversionNote": "유효한 ISBN-10은 978 접두사로 ISBN-13으로 변환됩니다. 978로 시작하는 ISBN-13만 역변환됩니다."
  },
  "ru": {
    "title": "Что такое ISBN?",
    "description": "ISBN (International Standard Book Number) — идентификатор книг и изданий.",
    "isbn10Title": "Проверка ISBN-10",
    "isbn10Description": "ISBN-10 содержит 9 цифр данных и контрольную цифру (X означает 10).",
    "isbn10Step1": "Удалите дефисы и пробелы",
    "isbn10Step2": "Умножьте на веса от 10 до 2 и сложите",
    "isbn10Step3": "Контрольная цифра делает сумму кратной 11",
    "isbn13Title": "Проверка ISBN-13",
    "isbn13Description": "ISBN-13 содержит 12 цифр данных и контрольную цифру, обычно начинается с 978 или 979.",
    "isbn13Step1": "Умножайте поочередно на 1 и 3",
    "isbn13Step2": "Сложите первые 12 цифр",
    "isbn13Step3": "Контрольная цифра делает сумму кратной 10",
    "conversionNote": "Действительный ISBN-10 преобразуется в ISBN-13 с префиксом 978; обратно конвертируется только ISBN-13 с 978."
  },
  "pt": {
    "title": "O que é ISBN?",
    "description": "ISBN (International Standard Book Number) é um identificador de livros e edições.",
    "isbn10Title": "Verificação ISBN-10",
    "isbn10Description": "ISBN-10 tem 9 dígitos de dados e um dígito verificador (X significa 10).",
    "isbn10Step1": "Remova hífens e espaços",
    "isbn10Step2": "Multiplique por pesos de 10 a 2 e some",
    "isbn10Step3": "O dígito verificador torna a soma divisível por 11",
    "isbn13Title": "Verificação ISBN-13",
    "isbn13Description": "ISBN-13 tem 12 dígitos de dados e um dígito verificador, geralmente começa com 978 ou 979.",
    "isbn13Step1": "Multiplique alternando por 1 e 3",
    "isbn13Step2": "Some os primeiros 12 dígitos",
    "isbn13Step3": "O dígito verificador torna a soma múltipla de 10",
    "conversionNote": "ISBN-10 válido vira ISBN-13 com prefixo 978; apenas ISBN-13 com 978 pode voltar."
  },
  "ar": {
    "title": "ما هو ISBN؟",
    "description": "ISBN (International Standard Book Number) هو معرّف للكتب والإصدارات.",
    "isbn10Title": "فحص ISBN-10",
    "isbn10Description": "ISBN-10 يحتوي على 9 أرقام بيانات ورقم تحقق (X تعني 10).",
    "isbn10Step1": "أزل الشرطات والمسافات",
    "isbn10Step2": "اضرب بالأوزان من 10 إلى 2 واجمع",
    "isbn10Step3": "رقم التحقق يجعل المجموع قابلاً للقسمة على 11",
    "isbn13Title": "فحص ISBN-13",
    "isbn13Description": "ISBN-13 يحتوي على 12 رقم بيانات ورقم تحقق، ويبدأ عادة بـ 978 أو 979.",
    "isbn13Step1": "اضرب بالتناوب في 1 و3",
    "isbn13Step2": "اجمع أول 12 رقماً",
    "isbn13Step3": "رقم التحقق يجعل المجموع مضاعفاً لـ 10",
    "conversionNote": "ISBN-10 الصحيح يتحول إلى ISBN-13 مع بادئة 978؛ فقط ISBN-13 ببادئة 978 يمكن تحويله مرة أخرى."
  },
  "hi": {
    "title": "ISBN क्या है?",
    "description": "ISBN (International Standard Book Number) पुस्तकों और संस्करणों के लिए पहचान है।",
    "isbn10Title": "ISBN-10 जांच",
    "isbn10Description": "ISBN-10 में 9 डेटा अंक और एक चेक अंक होता है (X का मतलब 10)।",
    "isbn10Step1": "हाइफ़न और स्पेस हटाएं",
    "isbn10Step2": "10 से 2 तक के भार से गुणा कर जोड़ें",
    "isbn10Step3": "चेक अंक कुल को 11 से विभाज्य बनाता है",
    "isbn13Title": "ISBN-13 जांच",
    "isbn13Description": "ISBN-13 में 12 डेटा अंक और एक चेक अंक होता है, आमतौर पर 978 या 979 से शुरू होता है।",
    "isbn13Step1": "1 और 3 से बारी-बारी से गुणा करें",
    "isbn13Step2": "पहले 12 अंकों का योग लें",
    "isbn13Step3": "चेक अंक कुल को 10 का गुणक बनाता है",
    "conversionNote": "मान्य ISBN-10 को 978 प्रीफ़िक्स के साथ ISBN-13 में बदला जा सकता है; केवल 978 वाले ISBN-13 वापस बदलते हैं।"
  },
  "tr": {
    "title": "ISBN nedir?",
    "description": "ISBN (International Standard Book Number) kitaplar ve baskılar için bir tanımlayıcıdır.",
    "isbn10Title": "ISBN-10 Kontrolü",
    "isbn10Description": "ISBN-10, 9 veri rakamı ve bir kontrol basamağı içerir (X 10 anlamına gelir).",
    "isbn10Step1": "Tire ve boşlukları kaldırın",
    "isbn10Step2": "10'dan 2'ye ağırlıklarla çarpıp toplayın",
    "isbn10Step3": "Kontrol basamağı toplamı 11'in katı yapar",
    "isbn13Title": "ISBN-13 Kontrolü",
    "isbn13Description": "ISBN-13, 12 veri rakamı ve bir kontrol basamağı içerir; genellikle 978 veya 979 ile başlar.",
    "isbn13Step1": "1 ve 3 ile dönüşümlü çarpın",
    "isbn13Step2": "İlk 12 rakamı toplayın",
    "isbn13Step3": "Kontrol basamağı toplamı 10'un katı yapar",
    "conversionNote": "Geçerli ISBN-10, 978 önekiyle ISBN-13'e çevrilir; yalnızca 978 ile başlayan ISBN-13 geri çevrilebilir."
  },
  "nl": {
    "title": "Wat is ISBN?",
    "description": "ISBN (International Standard Book Number) is een identificatie voor boeken en edities.",
    "isbn10Title": "ISBN-10-controle",
    "isbn10Description": "ISBN-10 heeft 9 datacijfers en een controlecijfer (X betekent 10).",
    "isbn10Step1": "Verwijder koppeltekens en spaties",
    "isbn10Step2": "Vermenigvuldig met gewichten van 10 tot 2 en tel op",
    "isbn10Step3": "Het controlecijfer maakt de som deelbaar door 11",
    "isbn13Title": "ISBN-13-controle",
    "isbn13Description": "ISBN-13 heeft 12 datacijfers en een controlecijfer, meestal beginnend met 978 of 979.",
    "isbn13Step1": "Vermenigvuldig afwisselend met 1 en 3",
    "isbn13Step2": "Tel de eerste 12 cijfers op",
    "isbn13Step3": "Het controlecijfer maakt de som een veelvoud van 10",
    "conversionNote": "Een geldig ISBN-10 wordt ISBN-13 met prefix 978; alleen ISBN-13 met 978 kan terug."
  },
  "sv": {
    "title": "Vad är ISBN?",
    "description": "ISBN (International Standard Book Number) är en identifierare för böcker och utgåvor.",
    "isbn10Title": "ISBN-10-kontroll",
    "isbn10Description": "ISBN-10 har 9 datasiffror och en kontrollsiffra (X betyder 10).",
    "isbn10Step1": "Ta bort bindestreck och mellanslag",
    "isbn10Step2": "Multiplicera med vikter 10 till 2 och summera",
    "isbn10Step3": "Kontrollsiffran gör summan delbar med 11",
    "isbn13Title": "ISBN-13-kontroll",
    "isbn13Description": "ISBN-13 har 12 datasiffror och en kontrollsiffra, ofta med 978 eller 979.",
    "isbn13Step1": "Multiplicera växelvis med 1 och 3",
    "isbn13Step2": "Summera de första 12 siffrorna",
    "isbn13Step3": "Kontrollsiffran gör summan till en multipel av 10",
    "conversionNote": "Giltigt ISBN-10 blir ISBN-13 med prefix 978; endast ISBN-13 med 978 kan konverteras tillbaka."
  },
  "pl": {
    "title": "Czym jest ISBN?",
    "description": "ISBN (International Standard Book Number) to identyfikator książek i wydań.",
    "isbn10Title": "Sprawdzenie ISBN-10",
    "isbn10Description": "ISBN-10 ma 9 cyfr danych i cyfrę kontrolną (X oznacza 10).",
    "isbn10Step1": "Usuń myślniki i spacje",
    "isbn10Step2": "Pomnóż przez wagi od 10 do 2 i zsumuj",
    "isbn10Step3": "Cyfra kontrolna sprawia, że suma jest podzielna przez 11",
    "isbn13Title": "Sprawdzenie ISBN-13",
    "isbn13Description": "ISBN-13 ma 12 cyfr danych i cyfrę kontrolną, zwykle zaczyna się od 978 lub 979.",
    "isbn13Step1": "Mnoż naprzemiennie przez 1 i 3",
    "isbn13Step2": "Zsumuj pierwsze 12 cyfr",
    "isbn13Step3": "Cyfra kontrolna sprawia, że suma jest wielokrotnością 10",
    "conversionNote": "Poprawny ISBN-10 można zamienić na ISBN-13 z prefiksem 978; tylko ISBN-13 z 978 można zamienić z powrotem."
  },
  "vi": {
    "title": "ISBN là gì?",
    "description": "ISBN (International Standard Book Number) là mã định danh cho sách và phiên bản.",
    "isbn10Title": "Kiểm tra ISBN-10",
    "isbn10Description": "ISBN-10 có 9 chữ số dữ liệu và một chữ số kiểm tra (X nghĩa là 10).",
    "isbn10Step1": "Loại bỏ dấu gạch ngang và khoảng trắng",
    "isbn10Step2": "Nhân với trọng số 10 đến 2 và cộng lại",
    "isbn10Step3": "Chữ số kiểm tra làm tổng chia hết cho 11",
    "isbn13Title": "Kiểm tra ISBN-13",
    "isbn13Description": "ISBN-13 có 12 chữ số dữ liệu và một chữ số kiểm tra, thường bắt đầu bằng 978 hoặc 979.",
    "isbn13Step1": "Nhân xen kẽ với 1 và 3",
    "isbn13Step2": "Cộng 12 chữ số đầu tiên",
    "isbn13Step3": "Chữ số kiểm tra làm tổng là bội số của 10",
    "conversionNote": "ISBN-10 hợp lệ chuyển thành ISBN-13 với tiền tố 978; chỉ ISBN-13 có 978 mới chuyển ngược được."
  },
  "th": {
    "title": "ISBN คืออะไร?",
    "description": "ISBN (International Standard Book Number) คือรหัสระบุหนังสือและฉบับพิมพ์.",
    "isbn10Title": "การตรวจสอบ ISBN-10",
    "isbn10Description": "ISBN-10 มีตัวเลขข้อมูล 9 หลักและเลขตรวจสอบ 1 หลัก (X หมายถึง 10).",
    "isbn10Step1": "ลบเครื่องหมายขีดและช่องว่าง",
    "isbn10Step2": "คูณด้วยน้ำหนัก 10 ถึง 2 แล้วรวมผล",
    "isbn10Step3": "เลขตรวจสอบทำให้ผลรวมหารด้วย 11 ลงตัว",
    "isbn13Title": "การตรวจสอบ ISBN-13",
    "isbn13Description": "ISBN-13 มีตัวเลขข้อมูล 12 หลักและเลขตรวจสอบ 1 หลัก โดยมักเริ่มด้วย 978 หรือ 979.",
    "isbn13Step1": "คูณสลับด้วย 1 และ 3",
    "isbn13Step2": "รวม 12 หลักแรก",
    "isbn13Step3": "เลขตรวจสอบทำให้ผลรวมเป็นพหุคูณของ 10",
    "conversionNote": "ISBN-10 ที่ถูกต้องจะแปลงเป็น ISBN-13 ด้วยคำนำหน้า 978; เฉพาะ ISBN-13 ที่ขึ้นต้นด้วย 978 เท่านั้นที่แปลงกลับได้."
  },
  "id": {
    "title": "Apa itu ISBN?",
    "description": "ISBN (International Standard Book Number) adalah pengenal untuk buku dan edisi.",
    "isbn10Title": "Pemeriksaan ISBN-10",
    "isbn10Description": "ISBN-10 memiliki 9 digit data dan satu digit pemeriksa (X berarti 10).",
    "isbn10Step1": "Hapus tanda hubung dan spasi",
    "isbn10Step2": "Kalikan dengan bobot 10 hingga 2 lalu jumlahkan",
    "isbn10Step3": "Digit pemeriksa membuat jumlah habis dibagi 11",
    "isbn13Title": "Pemeriksaan ISBN-13",
    "isbn13Description": "ISBN-13 memiliki 12 digit data dan satu digit pemeriksa, biasanya diawali 978 atau 979.",
    "isbn13Step1": "Kalikan bergantian dengan 1 dan 3",
    "isbn13Step2": "Jumlahkan 12 digit pertama",
    "isbn13Step3": "Digit pemeriksa membuat jumlah menjadi kelipatan 10",
    "conversionNote": "ISBN-10 yang valid menjadi ISBN-13 dengan prefiks 978; hanya ISBN-13 dengan 978 yang dapat dikonversi kembali."
  },
  "he": {
    "title": "מהו ISBN?",
    "description": "ISBN (International Standard Book Number) הוא מזהה לספרים ולמהדורות.",
    "isbn10Title": "בדיקת ISBN-10",
    "isbn10Description": "ISBN-10 כולל 9 ספרות נתונים וספרת ביקורת (X פירושה 10).",
    "isbn10Step1": "הסר מקפים ורווחים",
    "isbn10Step2": "כפל במשקלים 10 עד 2 וסכם",
    "isbn10Step3": "ספרת הביקורת גורמת לסכום להתחלק ב-11",
    "isbn13Title": "בדיקת ISBN-13",
    "isbn13Description": "ISBN-13 כולל 12 ספרות נתונים וספרת ביקורת, בדרך כלל מתחיל ב-978 או 979.",
    "isbn13Step1": "כפל לסירוגין ב-1 וב-3",
    "isbn13Step2": "סכם את 12 הספרות הראשונות",
    "isbn13Step3": "ספרת הביקורת הופכת את הסכום לכפולה של 10",
    "conversionNote": "ISBN-10 תקין מומר ל-ISBN-13 עם קידומת 978; רק ISBN-13 עם 978 ניתן להמרה חזרה."
  },
  "ms": {
    "title": "Apakah ISBN?",
    "description": "ISBN (International Standard Book Number) ialah pengecam untuk buku dan edisi.",
    "isbn10Title": "Pemeriksaan ISBN-10",
    "isbn10Description": "ISBN-10 mempunyai 9 digit data dan satu digit semakan (X bermaksud 10).",
    "isbn10Step1": "Buang tanda sempang dan ruang",
    "isbn10Step2": "Darab dengan berat 10 hingga 2 dan jumlahkan",
    "isbn10Step3": "Digit semakan menjadikan jumlah boleh dibahagi dengan 11",
    "isbn13Title": "Pemeriksaan ISBN-13",
    "isbn13Description": "ISBN-13 mempunyai 12 digit data dan satu digit semakan, biasanya bermula dengan 978 atau 979.",
    "isbn13Step1": "Darab secara berselang dengan 1 dan 3",
    "isbn13Step2": "Jumlahkan 12 digit pertama",
    "isbn13Step3": "Digit semakan menjadikan jumlah gandaan 10",
    "conversionNote": "ISBN-10 yang sah menjadi ISBN-13 dengan awalan 978; hanya ISBN-13 dengan 978 boleh ditukar semula."
  },
  "no": {
    "title": "Hva er ISBN?",
    "description": "ISBN (International Standard Book Number) er en identifikator for bøker og utgaver.",
    "isbn10Title": "ISBN-10-sjekk",
    "isbn10Description": "ISBN-10 har 9 datasifre og et kontrollsiffer (X betyr 10).",
    "isbn10Step1": "Fjern bindestreker og mellomrom",
    "isbn10Step2": "Multipliser med vekter 10 til 2 og summer",
    "isbn10Step3": "Kontrollsifferet gjør summen delelig med 11",
    "isbn13Title": "ISBN-13-sjekk",
    "isbn13Description": "ISBN-13 har 12 datasifre og et kontrollsiffer, vanligvis med 978 eller 979.",
    "isbn13Step1": "Multipliser annenhver med 1 og 3",
    "isbn13Step2": "Summer de første 12 sifrene",
    "isbn13Step3": "Kontrollsifferet gjør summen til et multiplum av 10",
    "conversionNote": "Gyldig ISBN-10 blir ISBN-13 med prefiks 978; bare ISBN-13 med 978 kan konverteres tilbake."
  }
}
</i18n>
