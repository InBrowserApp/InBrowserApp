<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <i18n-t keypath="description">
      <template #example>
        <n-text code>chmod 755 script.sh</n-text>
      </template>
    </i18n-t>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is chmod?",
    "description": "chmod (change mode) is a Unix/Linux command used to change file and directory permissions. Permissions are represented in two formats: numeric (octal) notation like 755, or symbolic notation like rwxr-xr-x. Each digit in the numeric format represents permissions for owner, group, and others respectively, where 4 = read (r), 2 = write (w), and 1 = execute (x). These values are added together: 7 (4+2+1) means full access, 5 (4+1) means read and execute, 4 means read-only. For example, {example} gives the owner full permissions while allowing others to read and execute the file."
  },
  "zh": {
    "title": "什么是 chmod？",
    "description": "chmod（change mode）是一个用于更改文件和目录权限的 Unix/Linux 命令。权限有两种表示格式：数字（八进制）表示法（如 755）或符号表示法（如 rwxr-xr-x）。数字格式中的每一位分别代表所有者、用户组和其他用户的权限，其中 4 = 读取（r），2 = 写入（w），1 = 执行（x）。这些值相加：7（4+2+1）表示完全访问权限，5（4+1）表示读取和执行权限，4 表示只读权限。例如，{example} 给予所有者完全权限，同时允许其他人读取和执行该文件。"
  },
  "zh-CN": {
    "title": "什么是 chmod？",
    "description": "chmod（change mode）是一个用于更改文件和目录权限的 Unix/Linux 命令。权限有两种表示格式：数字（八进制）表示法（如 755）或符号表示法（如 rwxr-xr-x）。数字格式中的每一位分别代表所有者、用户组和其他用户的权限，其中 4 = 读取（r），2 = 写入（w），1 = 执行（x）。这些值相加：7（4+2+1）表示完全访问权限，5（4+1）表示读取和执行权限，4 表示只读权限。例如，{example} 给予所有者完全权限，同时允许其他人读取和执行该文件。"
  },
  "zh-TW": {
    "title": "什麼是 chmod？",
    "description": "chmod（change mode）是一個用於更改檔案和目錄權限的 Unix/Linux 指令。權限有兩種表示格式：數字（八進位）表示法（如 755）或符號表示法（如 rwxr-xr-x）。數字格式中的每一位分別代表擁有者、群組和其他使用者的權限，其中 4 = 讀取（r），2 = 寫入（w），1 = 執行（x）。這些值相加：7（4+2+1）表示完全存取權限，5（4+1）表示讀取和執行權限，4 表示唯讀權限。例如，{example} 給予擁有者完全權限，同時允許其他人讀取和執行該檔案。"
  },
  "zh-HK": {
    "title": "什麼是 chmod？",
    "description": "chmod（change mode）是一個用於更改檔案和目錄權限的 Unix/Linux 指令。權限有兩種表示格式：數字（八進制）表示法（如 755）或符號表示法（如 rwxr-xr-x）。數字格式中的每一位分別代表擁有者、群組和其他使用者的權限，其中 4 = 讀取（r），2 = 寫入（w），1 = 執行（x）。這些值相加：7（4+2+1）表示完全存取權限，5（4+1）表示讀取和執行權限，4 表示唯讀權限。例如，{example} 給予擁有者完全權限，同時允許其他人讀取和執行該檔案。"
  },
  "es": {
    "title": "Que es chmod?",
    "description": "chmod (change mode) es un comando de Unix/Linux utilizado para cambiar los permisos de archivos y directorios. Los permisos se representan en dos formatos: notacion numerica (octal) como 755, o notacion simbolica como rwxr-xr-x. Cada digito en el formato numerico representa los permisos para el propietario, grupo y otros respectivamente, donde 4 = lectura (r), 2 = escritura (w) y 1 = ejecucion (x). Estos valores se suman: 7 (4+2+1) significa acceso completo, 5 (4+1) significa lectura y ejecucion, 4 significa solo lectura. Por ejemplo, {example} otorga al propietario permisos completos mientras permite a otros leer y ejecutar el archivo."
  },
  "fr": {
    "title": "Qu'est-ce que chmod ?",
    "description": "chmod (change mode) est une commande Unix/Linux utilisee pour modifier les permissions des fichiers et repertoires. Les permissions sont representees sous deux formats : notation numerique (octale) comme 755, ou notation symbolique comme rwxr-xr-x. Chaque chiffre dans le format numerique represente les permissions pour le proprietaire, le groupe et les autres respectivement, ou 4 = lecture (r), 2 = ecriture (w) et 1 = execution (x). Ces valeurs s'additionnent : 7 (4+2+1) signifie acces complet, 5 (4+1) signifie lecture et execution, 4 signifie lecture seule. Par exemple, {example} donne au proprietaire tous les droits tout en permettant aux autres de lire et d'executer le fichier."
  },
  "de": {
    "title": "Was ist chmod?",
    "description": "chmod (change mode) ist ein Unix/Linux-Befehl zum Andern von Datei- und Verzeichnisberechtigungen. Berechtigungen werden in zwei Formaten dargestellt: numerische (oktale) Notation wie 755 oder symbolische Notation wie rwxr-xr-x. Jede Ziffer im numerischen Format reprasentiert die Berechtigungen fur Eigentumer, Gruppe und Andere, wobei 4 = Lesen (r), 2 = Schreiben (w) und 1 = Ausfuhren (x). Diese Werte werden addiert: 7 (4+2+1) bedeutet Vollzugriff, 5 (4+1) bedeutet Lesen und Ausfuhren, 4 bedeutet nur Lesen. Zum Beispiel gibt {example} dem Eigentumer volle Berechtigungen, wahrend andere die Datei lesen und ausfuhren konnen."
  },
  "it": {
    "title": "Cos'e chmod?",
    "description": "chmod (change mode) e un comando Unix/Linux utilizzato per modificare i permessi di file e directory. I permessi sono rappresentati in due formati: notazione numerica (ottale) come 755, o notazione simbolica come rwxr-xr-x. Ogni cifra nel formato numerico rappresenta i permessi per proprietario, gruppo e altri rispettivamente, dove 4 = lettura (r), 2 = scrittura (w) e 1 = esecuzione (x). Questi valori si sommano: 7 (4+2+1) significa accesso completo, 5 (4+1) significa lettura ed esecuzione, 4 significa sola lettura. Ad esempio, {example} concede al proprietario i permessi completi consentendo agli altri di leggere ed eseguire il file."
  },
  "ja": {
    "title": "chmod とは？",
    "description": "chmod（change mode）は、ファイルやディレクトリのパーミッションを変更するための Unix/Linux コマンドです。パーミッションは 2 つの形式で表されます：755 のような数値（8進数）表記、または rwxr-xr-x のような記号表記です。数値形式の各桁は、それぞれ所有者、グループ、その他のユーザーのパーミッションを表し、4 = 読み取り（r）、2 = 書き込み（w）、1 = 実行（x）です。これらの値を合計します：7（4+2+1）はフルアクセス、5（4+1）は読み取りと実行、4 は読み取り専用を意味します。例えば、{example} は所有者にフルパーミッションを与え、他のユーザーにはファイルの読み取りと実行を許可します。"
  },
  "ko": {
    "title": "chmod란 무엇인가요?",
    "description": "chmod(change mode)는 파일 및 디렉토리 권한을 변경하는 데 사용되는 Unix/Linux 명령어입니다. 권한은 755와 같은 숫자(8진수) 표기법 또는 rwxr-xr-x와 같은 기호 표기법의 두 가지 형식으로 표현됩니다. 숫자 형식의 각 자릿수는 각각 소유자, 그룹, 기타 사용자의 권한을 나타내며, 4 = 읽기(r), 2 = 쓰기(w), 1 = 실행(x)입니다. 이 값들을 합산합니다: 7(4+2+1)은 전체 액세스, 5(4+1)는 읽기 및 실행, 4는 읽기 전용을 의미합니다. 예를 들어, {example}은 소유자에게 전체 권한을 부여하고 다른 사용자에게는 파일을 읽고 실행할 수 있도록 허용합니다."
  },
  "ru": {
    "title": "Что такое chmod?",
    "description": "chmod (change mode) — это команда Unix/Linux, используемая для изменения прав доступа к файлам и каталогам. Права представляются в двух форматах: числовая (восьмеричная) запись, например 755, или символьная запись, например rwxr-xr-x. Каждая цифра в числовом формате представляет права для владельца, группы и остальных соответственно, где 4 = чтение (r), 2 = запись (w) и 1 = выполнение (x). Эти значения складываются: 7 (4+2+1) означает полный доступ, 5 (4+1) — чтение и выполнение, 4 — только чтение. Например, {example} дает владельцу полные права, позволяя остальным читать и выполнять файл."
  },
  "pt": {
    "title": "O que e chmod?",
    "description": "chmod (change mode) e um comando Unix/Linux usado para alterar permissoes de arquivos e diretorios. As permissoes sao representadas em dois formatos: notacao numerica (octal) como 755, ou notacao simbolica como rwxr-xr-x. Cada digito no formato numerico representa as permissoes para proprietario, grupo e outros respectivamente, onde 4 = leitura (r), 2 = escrita (w) e 1 = execucao (x). Esses valores sao somados: 7 (4+2+1) significa acesso total, 5 (4+1) significa leitura e execucao, 4 significa somente leitura. Por exemplo, {example} da ao proprietario permissoes totais enquanto permite que outros leiam e executem o arquivo."
  },
  "ar": {
    "title": "ما هو chmod؟",
    "description": "chmod (تغيير الوضع) هو أمر Unix/Linux يُستخدم لتغيير صلاحيات الملفات والمجلدات. تُمثَّل الصلاحيات بصيغتين: الترميز الرقمي (الثماني) مثل 755، أو الترميز الرمزي مثل rwxr-xr-x. كل رقم في الصيغة الرقمية يمثل الصلاحيات للمالك والمجموعة والآخرين على التوالي، حيث 4 = قراءة (r)، 2 = كتابة (w)، و 1 = تنفيذ (x). تُجمع هذه القيم: 7 (4+2+1) تعني وصول كامل، 5 (4+1) تعني قراءة وتنفيذ، 4 تعني قراءة فقط. على سبيل المثال، {example} يمنح المالك صلاحيات كاملة بينما يسمح للآخرين بقراءة وتنفيذ الملف."
  },
  "hi": {
    "title": "chmod क्या है?",
    "description": "chmod (change mode) एक Unix/Linux कमांड है जिसका उपयोग फ़ाइल और डायरेक्टरी अनुमतियों को बदलने के लिए किया जाता है। अनुमतियाँ दो प्रारूपों में दर्शाई जाती हैं: संख्यात्मक (ऑक्टल) नोटेशन जैसे 755, या सांकेतिक नोटेशन जैसे rwxr-xr-x। संख्यात्मक प्रारूप में प्रत्येक अंक क्रमशः स्वामी, समूह और अन्य के लिए अनुमतियों को दर्शाता है, जहाँ 4 = पढ़ना (r), 2 = लिखना (w), और 1 = निष्पादित करना (x)। ये मान जोड़े जाते हैं: 7 (4+2+1) का अर्थ है पूर्ण पहुँच, 5 (4+1) का अर्थ है पढ़ना और निष्पादित करना, 4 का अर्थ है केवल पढ़ना। उदाहरण के लिए, {example} स्वामी को पूर्ण अनुमतियाँ देता है जबकि अन्य को फ़ाइल पढ़ने और निष्पादित करने की अनुमति देता है।"
  },
  "tr": {
    "title": "chmod nedir?",
    "description": "chmod (change mode), dosya ve dizin izinlerini degistirmek icin kullanilan bir Unix/Linux komutudur. Izinler iki formatta temsil edilir: 755 gibi sayisal (sekizlik) gosterim veya rwxr-xr-x gibi sembolik gosterim. Sayisal formattaki her rakam sirasiyla sahip, grup ve diger kullanicilar icin izinleri temsil eder; burada 4 = okuma (r), 2 = yazma (w) ve 1 = calistirma (x). Bu degerler toplanir: 7 (4+2+1) tam erisim, 5 (4+1) okuma ve calistirma, 4 yalnizca okuma anlamina gelir. Ornegin, {example} sahibine tam izinler verirken digerlerinin dosyayi okumasina ve calistirmasina izin verir."
  },
  "nl": {
    "title": "Wat is chmod?",
    "description": "chmod (change mode) is een Unix/Linux-opdracht die wordt gebruikt om bestands- en maprechten te wijzigen. Rechten worden weergegeven in twee formaten: numerieke (octale) notatie zoals 755, of symbolische notatie zoals rwxr-xr-x. Elk cijfer in het numerieke formaat vertegenwoordigt de rechten voor eigenaar, groep en anderen respectievelijk, waarbij 4 = lezen (r), 2 = schrijven (w) en 1 = uitvoeren (x). Deze waarden worden opgeteld: 7 (4+2+1) betekent volledige toegang, 5 (4+1) betekent lezen en uitvoeren, 4 betekent alleen-lezen. Bijvoorbeeld, {example} geeft de eigenaar volledige rechten terwijl anderen het bestand mogen lezen en uitvoeren."
  },
  "sv": {
    "title": "Vad ar chmod?",
    "description": "chmod (change mode) ar ett Unix/Linux-kommando som anvands for att andra fil- och katalogbehorigheter. Behorigheter representeras i tva format: numerisk (oktal) notation som 755, eller symbolisk notation som rwxr-xr-x. Varje siffra i det numeriska formatet representerar behorigheter for agare, grupp och andra respektive, dar 4 = lasa (r), 2 = skriva (w) och 1 = kora (x). Dessa varden laggs ihop: 7 (4+2+1) innebar full atkomst, 5 (4+1) innebar lasa och kora, 4 innebar endast lasa. Till exempel ger {example} agaren fulla behorigheter medan andra far lasa och kora filen."
  },
  "pl": {
    "title": "Czym jest chmod?",
    "description": "chmod (change mode) to polecenie Unix/Linux uzywane do zmiany uprawnien plikow i katalogow. Uprawnienia sa reprezentowane w dwoch formatach: notacja numeryczna (osemkowa) jak 755 lub notacja symboliczna jak rwxr-xr-x. Kazda cyfra w formacie numerycznym reprezentuje uprawnienia odpowiednio dla wlasciciela, grupy i innych, gdzie 4 = odczyt (r), 2 = zapis (w) i 1 = wykonanie (x). Te wartosci sa sumowane: 7 (4+2+1) oznacza pelny dostep, 5 (4+1) oznacza odczyt i wykonanie, 4 oznacza tylko odczyt. Na przyklad {example} daje wlascicielowi pelne uprawnienia, pozwalajac innym czytac i uruchamiac plik."
  },
  "vi": {
    "title": "chmod la gi?",
    "description": "chmod (change mode) la mot lenh Unix/Linux duoc su dung de thay doi quyen truy cap tep va thu muc. Quyen duoc bieu dien o hai dinh dang: ky hieu so (bat phan) nhu 755, hoac ky hieu ky tu nhu rwxr-xr-x. Moi chu so trong dinh dang so dai dien cho quyen cua chu so huu, nhom va nguoi khac tuong ung, trong do 4 = doc (r), 2 = ghi (w) va 1 = thuc thi (x). Cac gia tri nay duoc cong lai: 7 (4+2+1) nghia la toan quyen, 5 (4+1) nghia la doc va thuc thi, 4 nghia la chi doc. Vi du, {example} cap cho chu so huu toan quyen trong khi cho phep nguoi khac doc va thuc thi tep."
  },
  "th": {
    "title": "chmod คืออะไร?",
    "description": "chmod (change mode) เป็นคำสั่ง Unix/Linux ที่ใช้เปลี่ยนสิทธิ์การเข้าถึงไฟล์และไดเรกทอรี สิทธิ์จะแสดงในสองรูปแบบ: รูปแบบตัวเลข (ฐานแปด) เช่น 755 หรือรูปแบบสัญลักษณ์ เช่น rwxr-xr-x ตัวเลขแต่ละหลักในรูปแบบตัวเลขแสดงถึงสิทธิ์ของเจ้าของ กลุ่ม และผู้อื่นตามลำดับ โดย 4 = อ่าน (r), 2 = เขียน (w) และ 1 = รัน (x) ค่าเหล่านี้จะถูกรวมกัน: 7 (4+2+1) หมายถึงสิทธิ์เต็ม, 5 (4+1) หมายถึงอ่านและรัน, 4 หมายถึงอ่านอย่างเดียว ตัวอย่างเช่น {example} ให้สิทธิ์เต็มแก่เจ้าของในขณะที่อนุญาตให้ผู้อื่นอ่านและรันไฟล์"
  },
  "id": {
    "title": "Apa itu chmod?",
    "description": "chmod (change mode) adalah perintah Unix/Linux yang digunakan untuk mengubah izin file dan direktori. Izin direpresentasikan dalam dua format: notasi numerik (oktal) seperti 755, atau notasi simbolik seperti rwxr-xr-x. Setiap digit dalam format numerik mewakili izin untuk pemilik, grup, dan lainnya masing-masing, di mana 4 = baca (r), 2 = tulis (w), dan 1 = eksekusi (x). Nilai-nilai ini dijumlahkan: 7 (4+2+1) berarti akses penuh, 5 (4+1) berarti baca dan eksekusi, 4 berarti hanya baca. Misalnya, {example} memberikan pemilik izin penuh sementara mengizinkan yang lain untuk membaca dan mengeksekusi file."
  },
  "he": {
    "title": "מה זה chmod?",
    "description": "chmod (change mode) היא פקודת Unix/Linux המשמשת לשינוי הרשאות קבצים ותיקיות. הרשאות מיוצגות בשני פורמטים: סימון מספרי (אוקטלי) כמו 755, או סימון סמלי כמו rwxr-xr-x. כל ספרה בפורמט המספרי מייצגת הרשאות לבעלים, לקבוצה ולאחרים בהתאמה, כאשר 4 = קריאה (r), 2 = כתיבה (w) ו-1 = הרצה (x). ערכים אלה מסוכמים: 7 (4+2+1) פירושו גישה מלאה, 5 (4+1) פירושו קריאה והרצה, 4 פירושו קריאה בלבד. לדוגמה, {example} נותן לבעלים הרשאות מלאות תוך שהוא מאפשר לאחרים לקרוא ולהריץ את הקובץ."
  },
  "ms": {
    "title": "Apa itu chmod?",
    "description": "chmod (change mode) adalah arahan Unix/Linux yang digunakan untuk menukar kebenaran fail dan direktori. Kebenaran diwakili dalam dua format: notasi numerik (oktal) seperti 755, atau notasi simbolik seperti rwxr-xr-x. Setiap digit dalam format numerik mewakili kebenaran untuk pemilik, kumpulan, dan lain-lain masing-masing, di mana 4 = baca (r), 2 = tulis (w), dan 1 = laksana (x). Nilai-nilai ini dijumlahkan: 7 (4+2+1) bermaksud akses penuh, 5 (4+1) bermaksud baca dan laksana, 4 bermaksud baca sahaja. Contohnya, {example} memberikan pemilik kebenaran penuh sambil membenarkan yang lain membaca dan melaksanakan fail."
  },
  "no": {
    "title": "Hva er chmod?",
    "description": "chmod (change mode) er en Unix/Linux-kommando som brukes til a endre fil- og katalogrettigheter. Rettigheter representeres i to formater: numerisk (oktal) notasjon som 755, eller symbolsk notasjon som rwxr-xr-x. Hvert siffer i det numeriske formatet representerer rettigheter for eier, gruppe og andre henholdsvis, der 4 = les (r), 2 = skriv (w) og 1 = kjor (x). Disse verdiene legges sammen: 7 (4+2+1) betyr full tilgang, 5 (4+1) betyr les og kjor, 4 betyr kun lesing. For eksempel gir {example} eieren fulle rettigheter mens andre far lese og kjore filen."
  }
}
</i18n>
