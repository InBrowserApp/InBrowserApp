<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description') }}</NText>
    <NText tag="p">{{ t('dataNote') }}</NText>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a PRC Resident ID?",
    "description": "The 18-digit PRC Resident ID number includes the address code, birthdate, sequence code, and checksum. This tool validates those parts and extracts gender and age.",
    "dataNote": "Region codes are based on the 2023 administrative division dataset."
  },
  "zh": {
    "title": "什么是中华人民共和国居民身份证号？",
    "description": "18 位居民身份证号包含地址码、出生日期、顺序码和校验位。本工具会验证这些部分并解析性别与年龄。",
    "dataNote": "行政区划代码基于 2023 年数据集。"
  },
  "zh-CN": {
    "title": "什么是中华人民共和国居民身份证号？",
    "description": "18 位居民身份证号包含地址码、出生日期、顺序码和校验位。本工具会验证这些部分并解析性别与年龄。",
    "dataNote": "行政区划代码基于 2023 年数据集。"
  },
  "zh-TW": {
    "title": "什麼是中華人民共和國居民身分證號？",
    "description": "18 位居民身分證號包含地址碼、出生日期、順序碼和校驗位。本工具會驗證這些部分並解析性別與年齡。",
    "dataNote": "行政區劃代碼基於 2023 年資料集。"
  },
  "zh-HK": {
    "title": "什麼是中華人民共和國居民身份證號？",
    "description": "18 位居民身份證號包含地址碼、出生日期、順序碼和校驗位。本工具會驗證這些部分並解析性別與年齡。",
    "dataNote": "行政區劃代碼基於 2023 年資料集。"
  },
  "es": {
    "title": "¿Qué es el ID de residente de la RPC?",
    "description": "El número de ID de residente de la RPC tiene 18 dígitos e incluye código de dirección, fecha de nacimiento, código de secuencia y checksum. Esta herramienta valida esas partes y extrae género y edad.",
    "dataNote": "Los códigos de región se basan en el conjunto de datos de divisiones administrativas de 2023."
  },
  "fr": {
    "title": "Qu'est-ce que l'ID de résident de la RPC ?",
    "description": "Le numéro d'ID de résident de la RPC comporte 18 chiffres et inclut le code d'adresse, la date de naissance, le code de séquence et la somme de contrôle. Cet outil valide ces éléments et déduit le genre et l'âge.",
    "dataNote": "Les codes de région sont basés sur le jeu de données 2023 des divisions administratives."
  },
  "de": {
    "title": "Was ist die PRC-Resident-ID?",
    "description": "Die 18-stellige PRC-Resident-ID enthält Adresscode, Geburtsdatum, Sequenzcode und Prüfsumme. Dieses Tool validiert diese Teile und leitet Geschlecht und Alter ab.",
    "dataNote": "Regioncodes basieren auf dem Verwaltungsdatensatz von 2023."
  },
  "it": {
    "title": "Cos'è l'ID residente della RPC?",
    "description": "Il numero di ID residente della RPC ha 18 cifre e include codice di indirizzo, data di nascita, codice di sequenza e checksum. Questo strumento valida queste parti ed estrae genere ed età.",
    "dataNote": "I codici di regione si basano sul dataset delle divisioni amministrative 2023."
  },
  "ja": {
    "title": "中国居民身份证番号とは？",
    "description": "18 桁の中国居民身份证番号には住所コード、生年月日、順序コード、チェックサムが含まれます。このツールはそれらを検証し、性別と年齢を算出します。",
    "dataNote": "地域コードは 2023 年の行政区画データセットに基づきます。"
  },
  "ko": {
    "title": "중국 주민 신분증 번호란?",
    "description": "18자리 주민 신분증 번호에는 주소 코드, 생년월일, 순번 코드, 체크섬이 포함됩니다. 이 도구는 이를 검증하고 성별과 나이를 추출합니다.",
    "dataNote": "지역 코드는 2023년 행정구역 데이터셋을 기반으로 합니다."
  },
  "ru": {
    "title": "Что такое ID резидента КНР?",
    "description": "18-значный ID резидента КНР включает код адреса, дату рождения, код последовательности и контрольную сумму. Этот инструмент проверяет эти части и определяет пол и возраст.",
    "dataNote": "Коды регионов основаны на наборе данных административных делений 2023 года."
  },
  "pt": {
    "title": "O que é o ID de residente da RPC?",
    "description": "O número de ID de residente da RPC tem 18 dígitos e inclui código de endereço, data de nascimento, código de sequência e checksum. Esta ferramenta valida essas partes e extrai gênero e idade.",
    "dataNote": "Os códigos de região são baseados no conjunto de dados de divisões administrativas de 2023."
  },
  "ar": {
    "title": "ما هو رقم هوية المقيم في جمهورية الصين الشعبية؟",
    "description": "رقم هوية المقيم في جمهورية الصين الشعبية يتكون من 18 رقمًا ويتضمن رمز العنوان وتاريخ الميلاد ورمز التسلسل والمجموع الاختباري. تتحقق هذه الأداة من هذه الأجزاء وتستخرج الجنس والعمر.",
    "dataNote": "رموز المناطق تعتمد على مجموعة بيانات التقسيمات الإدارية لعام 2023."
  },
  "hi": {
    "title": "पीआरसी निवासी आईडी क्या है?",
    "description": "18 अंकों का पीआरसी निवासी आईडी नंबर पता कोड, जन्म तिथि, अनुक्रम कोड और चेकसम शामिल करता है। यह टूल इन हिस्सों की जांच करता है और लिंग व आयु निकालता है।",
    "dataNote": "क्षेत्र कोड 2023 की प्रशासनिक विभाजन डेटा से लिए गए हैं।"
  },
  "tr": {
    "title": "PRC Resident ID nedir?",
    "description": "18 haneli PRC Resident ID, adres kodu, doğum tarihi, sıra kodu ve sağlama toplamı içerir. Bu araç bu parçaları doğrular ve cinsiyet ile yaşı çıkarır.",
    "dataNote": "Bölge kodları 2023 idari bölünmeler veri setine dayanır."
  },
  "nl": {
    "title": "Wat is een PRC Resident ID?",
    "description": "Het 18-cijferige PRC Resident ID bevat adrescode, geboortedatum, volgnummer en controlesom. Deze tool valideert deze onderdelen en haalt geslacht en leeftijd op.",
    "dataNote": "Regiocodes zijn gebaseerd op de administratieve indelingsdataset van 2023."
  },
  "sv": {
    "title": "Vad är ett PRC Resident ID?",
    "description": "Det 18-siffriga PRC Resident ID innehåller adresskod, födelsedatum, sekvenskod och kontrollsumma. Det här verktyget validerar dessa delar och tar fram kön och ålder.",
    "dataNote": "Regionskoderna baseras på 2023 års administrativa indelningsdataset."
  },
  "pl": {
    "title": "Czym jest ID mieszkańca ChRL?",
    "description": "18-cyfrowy numer ID mieszkańca ChRL zawiera kod adresu, datę urodzenia, kod sekwencji i sumę kontrolną. To narzędzie weryfikuje te elementy i określa płeć oraz wiek.",
    "dataNote": "Kody regionów oparto na zestawie danych podziału administracyjnego z 2023 roku."
  },
  "vi": {
    "title": "ID cư trú của Trung Quốc là gì?",
    "description": "Số ID cư trú 18 chữ số bao gồm mã địa chỉ, ngày sinh, mã thứ tự và checksum. Công cụ này xác thực các phần đó và suy ra giới tính, tuổi.",
    "dataNote": "Mã khu vực dựa trên bộ dữ liệu phân chia hành chính năm 2023."
  },
  "th": {
    "title": "รหัสประจำตัวผู้พำนักของจีนคืออะไร?",
    "description": "หมายเลขประจำตัวผู้พำนักแบบ 18 หลักประกอบด้วยรหัสที่อยู่ วันเกิด รหัสลำดับ และเช็คซัม เครื่องมือนี้จะตรวจสอบส่วนเหล่านี้และระบุเพศกับอายุ",
    "dataNote": "รหัสภูมิภาคอ้างอิงชุดข้อมูลการแบ่งเขตการปกครองปี 2023"
  },
  "id": {
    "title": "Apa itu ID penduduk Tiongkok?",
    "description": "Nomor ID penduduk 18 digit mencakup kode alamat, tanggal lahir, kode urutan, dan checksum. Alat ini memvalidasi bagian tersebut serta menurunkan jenis kelamin dan usia.",
    "dataNote": "Kode wilayah berdasarkan dataset pembagian administratif tahun 2023."
  },
  "he": {
    "title": "מהו מזהה תושב של סין?",
    "description": "מספר מזהה התושב בן 18 הספרות כולל קוד כתובת, תאריך לידה, קוד רצף וסכום ביקורת. כלי זה מאמת את החלקים הללו ומפיק מגדר וגיל.",
    "dataNote": "קודי האזור מבוססים על מערך הנתונים של החלוקה המנהלית לשנת 2023."
  },
  "ms": {
    "title": "Apakah ID penduduk PRC?",
    "description": "Nombor ID penduduk PRC 18 digit merangkumi kod alamat, tarikh lahir, kod urutan dan checksum. Alat ini mengesahkan bahagian tersebut serta mengekstrak jantina dan umur.",
    "dataNote": "Kod wilayah berdasarkan set data pembahagian pentadbiran 2023."
  },
  "no": {
    "title": "Hva er et PRC Resident ID?",
    "description": "Det 18-sifrede PRC Resident ID-nummeret inneholder adressekode, fødselsdato, sekvenskode og kontrollsum. Dette verktøyet validerer disse delene og utleder kjønn og alder.",
    "dataNote": "Regionskodene er basert på det administrative inndelingsdatasettet fra 2023."
  }
}
</i18n>
