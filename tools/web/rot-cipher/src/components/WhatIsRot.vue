<template>
  <ToolSectionHeader>
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('description') }}</n-text>
    <n-p>
      <i18n-t keypath="example">
        <template #hello>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <n-text code>Hello</n-text>
        </template>
        <template #uryyb>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <n-text code>Uryyb</n-text>
        </template>
      </i18n-t>
    </n-p>
    <n-p>{{ t('self-reversing') }}</n-p>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText, NP } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is ROT Cipher?",
    "description": "ROT (Rotate) ciphers are simple letter substitution ciphers that replace each letter with another letter a fixed number of positions down the alphabet. ROT13, the most famous variant, shifts letters by 13 positions.",
    "example": "For example, {hello} becomes {uryyb} when encoded with ROT13.",
    "self-reversing": "ROT13 and ROT47 are self-reversing: applying the same algorithm twice returns the original text. This makes them useful for hiding spoilers, puzzle answers, or mildly obscuring text without needing a separate decrypt function."
  },
  "zh": {
    "title": "什么是 ROT 密码？",
    "description": "ROT（旋转）密码是一种简单的字母替换密码，将每个字母替换为字母表中固定位置后的另一个字母。最著名的变体 ROT13 将字母移位 13 个位置。",
    "example": "例如，{hello} 使用 ROT13 编码后变成 {uryyb}。",
    "self-reversing": "ROT13 和 ROT47 具有自反性：应用两次相同的算法即可恢复原始文本。这使得它们非常适合隐藏剧透、谜题答案或轻度混淆文本，而无需单独的解密功能。"
  },
  "zh-CN": {
    "title": "什么是 ROT 密码？",
    "description": "ROT（旋转）密码是一种简单的字母替换密码，将每个字母替换为字母表中固定位置后的另一个字母。最著名的变体 ROT13 将字母移位 13 个位置。",
    "example": "例如，{hello} 使用 ROT13 编码后变成 {uryyb}。",
    "self-reversing": "ROT13 和 ROT47 具有自反性：应用两次相同的算法即可恢复原始文本。这使得它们非常适合隐藏剧透、谜题答案或轻度混淆文本，而无需单独的解密功能。"
  },
  "zh-TW": {
    "title": "什麼是 ROT 密碼？",
    "description": "ROT（旋轉）密碼是一種簡單的字母替換密碼，將每個字母替換為字母表中固定位置後的另一個字母。最著名的變體 ROT13 將字母移位 13 個位置。",
    "example": "例如，{hello} 使用 ROT13 編碼後變成 {uryyb}。",
    "self-reversing": "ROT13 和 ROT47 具有自反性：套用兩次相同的演算法即可恢復原始文字。這使得它們非常適合隱藏劇透、謎題答案或輕度混淆文字，而無需單獨的解密功能。"
  },
  "zh-HK": {
    "title": "什麼是 ROT 密碼？",
    "description": "ROT（旋轉）密碼是一種簡單的字母替換密碼，將每個字母替換為字母表中固定位置後的另一個字母。最著名的變體 ROT13 將字母移位 13 個位置。",
    "example": "例如，{hello} 使用 ROT13 編碼後變成 {uryyb}。",
    "self-reversing": "ROT13 和 ROT47 具有自反性：套用兩次相同的演算法即可恢復原始文字。這使得它們非常適合隱藏劇透、謎題答案或輕度混淆文字，而無需單獨的解密功能。"
  },
  "es": {
    "title": "Que es el cifrado ROT?",
    "description": "Los cifrados ROT (Rotar) son cifrados de sustitucion de letras simples que reemplazan cada letra con otra letra un numero fijo de posiciones en el alfabeto. ROT13, la variante mas famosa, desplaza las letras 13 posiciones.",
    "example": "Por ejemplo, {hello} se convierte en {uryyb} cuando se codifica con ROT13.",
    "self-reversing": "ROT13 y ROT47 son autorreversibles: aplicar el mismo algoritmo dos veces devuelve el texto original. Esto los hace utiles para ocultar spoilers, respuestas de acertijos o texto ligeramente ofuscado sin necesidad de una funcion de descifrado separada."
  },
  "fr": {
    "title": "Qu'est-ce que le chiffrement ROT ?",
    "description": "Les chiffrements ROT (Rotation) sont de simples chiffrements par substitution de lettres qui remplacent chaque lettre par une autre lettre situee a un nombre fixe de positions dans l'alphabet. ROT13, la variante la plus celebre, decale les lettres de 13 positions.",
    "example": "Par exemple, {hello} devient {uryyb} lorsqu'il est encode avec ROT13.",
    "self-reversing": "ROT13 et ROT47 sont auto-reversibles : appliquer le meme algorithme deux fois renvoie le texte original. Cela les rend utiles pour cacher des spoilers, des reponses d'enigmes ou du texte legerement obscurci sans avoir besoin d'une fonction de dechiffrement separee."
  },
  "de": {
    "title": "Was ist die ROT-Chiffre?",
    "description": "ROT-Chiffren (Rotieren) sind einfache Buchstabenersetzungschiffren, die jeden Buchstaben durch einen anderen Buchstaben ersetzen, der eine feste Anzahl von Positionen im Alphabet entfernt ist. ROT13, die bekannteste Variante, verschiebt Buchstaben um 13 Positionen.",
    "example": "Zum Beispiel wird {hello} zu {uryyb}, wenn es mit ROT13 kodiert wird.",
    "self-reversing": "ROT13 und ROT47 sind selbstumkehrend: Das zweimalige Anwenden desselben Algorithmus gibt den Originaltext zuruck. Dies macht sie nutzlich zum Verstecken von Spoilern, Ratselantworten oder leicht verschleiertem Text, ohne eine separate Entschluesselungsfunktion zu benoetigen."
  },
  "it": {
    "title": "Cos'e la cifratura ROT?",
    "description": "Le cifrature ROT (Ruota) sono semplici cifrature a sostituzione di lettere che sostituiscono ogni lettera con un'altra lettera un numero fisso di posizioni nell'alfabeto. ROT13, la variante piu famosa, sposta le lettere di 13 posizioni.",
    "example": "Ad esempio, {hello} diventa {uryyb} quando codificato con ROT13.",
    "self-reversing": "ROT13 e ROT47 sono auto-reversibili: applicare lo stesso algoritmo due volte restituisce il testo originale. Questo li rende utili per nascondere spoiler, risposte di enigmi o testo leggermente offuscato senza bisogno di una funzione di decrittazione separata."
  },
  "ja": {
    "title": "ROT 暗号とは？",
    "description": "ROT（ローテート）暗号は、各文字をアルファベットの固定位置だけずらした別の文字に置き換える単純な文字置換暗号です。最も有名な変種である ROT13 は、文字を 13 位置シフトします。",
    "example": "例えば、{hello} は ROT13 でエンコードすると {uryyb} になります。",
    "self-reversing": "ROT13 と ROT47 は自己可逆です：同じアルゴリズムを 2 回適用すると元のテキストに戻ります。これにより、別の復号化関数を必要とせずに、ネタバレ、パズルの答え、または軽度に難読化されたテキストを隠すのに便利です。"
  },
  "ko": {
    "title": "ROT 암호란?",
    "description": "ROT(회전) 암호는 각 문자를 알파벳에서 고정된 위치만큼 떨어진 다른 문자로 대체하는 간단한 문자 치환 암호입니다. 가장 유명한 변형인 ROT13은 문자를 13자리 이동합니다.",
    "example": "예를 들어, {hello}는 ROT13으로 인코딩하면 {uryyb}가 됩니다.",
    "self-reversing": "ROT13과 ROT47은 자기 가역적입니다: 같은 알고리즘을 두 번 적용하면 원래 텍스트로 돌아갑니다. 이로 인해 별도의 복호화 기능 없이 스포일러, 퍼즐 답변 또는 약간 난독화된 텍스트를 숨기는 데 유용합니다."
  },
  "ru": {
    "title": "Что такое шифр ROT?",
    "description": "Шифры ROT (Rotate) - это простые шифры замены букв, которые заменяют каждую букву другой буквой на фиксированное количество позиций в алфавите. ROT13, самый известный вариант, сдвигает буквы на 13 позиций.",
    "example": "Например, {hello} становится {uryyb} при кодировании с помощью ROT13.",
    "self-reversing": "ROT13 и ROT47 являются самообратимыми: применение одного и того же алгоритма дважды возвращает исходный текст. Это делает их полезными для скрытия спойлеров, ответов на загадки или слегка запутанного текста без необходимости отдельной функции дешифрования."
  },
  "pt": {
    "title": "O que e a cifra ROT?",
    "description": "As cifras ROT (Rotacionar) sao cifras simples de substituicao de letras que substituem cada letra por outra letra um numero fixo de posicoes no alfabeto. ROT13, a variante mais famosa, desloca as letras em 13 posicoes.",
    "example": "Por exemplo, {hello} torna-se {uryyb} quando codificado com ROT13.",
    "self-reversing": "ROT13 e ROT47 sao auto-reversiveis: aplicar o mesmo algoritmo duas vezes retorna o texto original. Isso os torna uteis para esconder spoilers, respostas de quebra-cabecas ou texto levemente ofuscado sem precisar de uma funcao de descriptografia separada."
  },
  "ar": {
    "title": "ما هو تشفير ROT؟",
    "description": "تشفيرات ROT (التدوير) هي تشفيرات بسيطة لاستبدال الحروف تستبدل كل حرف بحرف آخر بعدد ثابت من المواضع في الأبجدية. ROT13، الإصدار الأكثر شهرة، يزيح الحروف بمقدار 13 موضعًا.",
    "example": "على سبيل المثال، {hello} يصبح {uryyb} عند تشفيره باستخدام ROT13.",
    "self-reversing": "ROT13 و ROT47 ذاتيا الانعكاس: تطبيق نفس الخوارزمية مرتين يعيد النص الأصلي. هذا يجعلها مفيدة لإخفاء المفسدات، إجابات الألغاز، أو النص المموه قليلاً دون الحاجة إلى وظيفة فك تشفير منفصلة."
  },
  "hi": {
    "title": "ROT सिफर क्या है?",
    "description": "ROT (रोटेट) सिफर सरल अक्षर प्रतिस्थापन सिफर हैं जो प्रत्येक अक्षर को वर्णमाला में एक निश्चित संख्या की स्थिति पर दूसरे अक्षर से बदल देते हैं। ROT13, सबसे प्रसिद्ध संस्करण, अक्षरों को 13 स्थानों पर स्थानांतरित करता है।",
    "example": "उदाहरण के लिए, {hello} ROT13 के साथ एन्कोड करने पर {uryyb} बन जाता है।",
    "self-reversing": "ROT13 और ROT47 स्व-प्रतिवर्ती हैं: एक ही एल्गोरिदम को दो बार लागू करने से मूल टेक्स्ट वापस मिल जाता है। यह उन्हें अलग डिक्रिप्ट फ़ंक्शन की आवश्यकता के बिना स्पॉइलर, पहेली उत्तर, या हल्के से अस्पष्ट टेक्स्ट छिपाने के लिए उपयोगी बनाता है।"
  },
  "tr": {
    "title": "ROT Sifresi Nedir?",
    "description": "ROT (Dondur) sifreleri, her harfi alfabede sabit sayida konum otesinde baska bir harfle degistiren basit harf degistirme sifreleridir. En unlu varyant olan ROT13, harfleri 13 konum kaydirir.",
    "example": "Ornegin, {hello} ROT13 ile kodlandiginda {uryyb} olur.",
    "self-reversing": "ROT13 ve ROT47 kendinden tersine cevrilebilir: ayni algoritmayı iki kez uygulamak orijinal metni dondurur. Bu, ayri bir sifre cozme islevine ihtiyac duymadan spoilerleri, bulmaca cevaplarini veya hafifce gizlenmis metni gizlemek icin onlari kullanisli kilar."
  },
  "nl": {
    "title": "Wat is het ROT-cijfer?",
    "description": "ROT-cijfers (Roteer) zijn eenvoudige lettersubstitutiecijfers die elke letter vervangen door een andere letter een vast aantal posities in het alfabet. ROT13, de bekendste variant, verschuift letters met 13 posities.",
    "example": "Bijvoorbeeld, {hello} wordt {uryyb} wanneer gecodeerd met ROT13.",
    "self-reversing": "ROT13 en ROT47 zijn zelf-omkeerbaar: het tweemaal toepassen van hetzelfde algoritme geeft de oorspronkelijke tekst terug. Dit maakt ze nuttig voor het verbergen van spoilers, puzzelantwoorden of licht verduisterde tekst zonder een aparte ontcijferfunctie nodig te hebben."
  },
  "sv": {
    "title": "Vad ar ROT-chiffer?",
    "description": "ROT-chiffer (Rotera) ar enkla bokstavssubstitutionschiffer som ersatter varje bokstav med en annan bokstav ett fast antal positioner i alfabetet. ROT13, den mest kanda varianten, forflyttar bokstaver med 13 positioner.",
    "example": "Till exempel blir {hello} {uryyb} nar det kodas med ROT13.",
    "self-reversing": "ROT13 och ROT47 ar sjalvreversibla: att tillampа samma algoritm tva ganger returnerar den ursprungliga texten. Detta gor dem anvndbara for att doljaа spoilers, pussellosningar eller latt forslorad text utan att behova en separat dekrypteringsfunktion."
  },
  "pl": {
    "title": "Czym jest szyfr ROT?",
    "description": "Szyfry ROT (Obrot) to proste szyfry podstawieniowe, ktore zastepuja kazda litere inna litera o stala liczbe pozycji w alfabecie. ROT13, najbardziej znana odmiana, przesuwa litery o 13 pozycji.",
    "example": "Na przyklad, {hello} staje sie {uryyb} po zakodowaniu za pomoca ROT13.",
    "self-reversing": "ROT13 i ROT47 sa samoodwracalne: dwukrotne zastosowanie tego samego algorytmu zwraca oryginalny tekst. Dzieki temu sa uzyteczne do ukrywania spoilerow, odpowiedzi na zagadki lub lekko zaciemnionego tekstu bez potrzeby oddzielnej funkcji deszyfrowania."
  },
  "vi": {
    "title": "Ma hoa ROT la gi?",
    "description": "Ma hoa ROT (Xoay) la cac ma hoa thay the chu cai don gian thay the moi chu cai bang mot chu cai khac o mot so vi tri co dinh trong bang chu cai. ROT13, bien the noi tieng nhat, dich chuyen cac chu cai 13 vi tri.",
    "example": "Vi du, {hello} tro thanh {uryyb} khi duoc ma hoa bang ROT13.",
    "self-reversing": "ROT13 va ROT47 tu dao nguoc: ap dung cung mot thuat toan hai lan se tra ve van ban goc. Dieu nay lam cho chung huu ich de an spoiler, cau tra loi cau do hoac van ban bi lam mo nhe ma khong can mot ham giai ma rieng."
  },
  "th": {
    "title": "รหัส ROT คืออะไร?",
    "description": "รหัส ROT (หมุน) เป็นรหัสแทนที่ตัวอักษรอย่างง่ายที่แทนที่ตัวอักษรแต่ละตัวด้วยตัวอักษรอื่นที่อยู่ห่างออกไปจำนวนตำแหน่งคงที่ในตัวอักษร ROT13 ซึ่งเป็นรูปแบบที่มีชื่อเสียงที่สุด เลื่อนตัวอักษร 13 ตำแหน่ง",
    "example": "ตัวอย่างเช่น {hello} จะกลายเป็น {uryyb} เมื่อเข้ารหัสด้วย ROT13",
    "self-reversing": "ROT13 และ ROT47 เป็นแบบย้อนกลับได้เอง: การใช้อัลกอริทึมเดียวกันสองครั้งจะคืนค่าข้อความต้นฉบับ ทำให้มีประโยชน์สำหรับการซ่อนสปอยล์ คำตอบปริศนา หรือข้อความที่ถูกทำให้คลุมเครือเล็กน้อยโดยไม่ต้องใช้ฟังก์ชันถอดรหัสแยกต่างหาก"
  },
  "id": {
    "title": "Apa itu Sandi ROT?",
    "description": "Sandi ROT (Putar) adalah sandi substitusi huruf sederhana yang mengganti setiap huruf dengan huruf lain sejumlah posisi tetap dalam alfabet. ROT13, varian paling terkenal, menggeser huruf sebanyak 13 posisi.",
    "example": "Misalnya, {hello} menjadi {uryyb} saat dikodekan dengan ROT13.",
    "self-reversing": "ROT13 dan ROT47 dapat membalik diri sendiri: menerapkan algoritma yang sama dua kali mengembalikan teks asli. Ini membuat mereka berguna untuk menyembunyikan spoiler, jawaban teka-teki, atau teks yang sedikit dikaburkan tanpa memerlukan fungsi dekripsi terpisah."
  },
  "he": {
    "title": "מהו צופן ROT?",
    "description": "צפני ROT (סיבוב) הם צפני החלפת אותיות פשוטים שמחליפים כל אות באות אחרת במספר קבוע של מיקומים באלפבית. ROT13, הגרסה המפורסמת ביותר, מזיזה אותיות ב-13 מיקומים.",
    "example": "לדוגמה, {hello} הופך ל-{uryyb} כאשר מקודד עם ROT13.",
    "self-reversing": "ROT13 ו-ROT47 הם הפיכים עצמית: הפעלת אותו אלגוריתם פעמיים מחזירה את הטקסט המקורי. זה הופך אותם לשימושיים להסתרת ספויילרים, תשובות לחידות, או טקסט מעורפל קלות ללא צורך בפונקציית פענוח נפרדת."
  },
  "ms": {
    "title": "Apakah Sifer ROT?",
    "description": "Sifer ROT (Putar) adalah sifer penggantian huruf mudah yang menggantikan setiap huruf dengan huruf lain pada bilangan tetap kedudukan dalam abjad. ROT13, varian paling terkenal, menganjak huruf sebanyak 13 kedudukan.",
    "example": "Sebagai contoh, {hello} menjadi {uryyb} apabila dikodkan dengan ROT13.",
    "self-reversing": "ROT13 dan ROT47 boleh balik sendiri: menggunakan algoritma yang sama dua kali mengembalikan teks asal. Ini menjadikan mereka berguna untuk menyembunyikan spoiler, jawapan teka-teki, atau teks yang sedikit dikaburkan tanpa memerlukan fungsi nyahsulit yang berasingan."
  },
  "no": {
    "title": "Hva er ROT-siffer?",
    "description": "ROT-siffer (Roter) er enkle bokstavsubstitusjonssiffer som erstatter hver bokstav med en annen bokstav et fast antall posisjoner i alfabetet. ROT13, den mest kjente varianten, forskyver bokstaver med 13 posisjoner.",
    "example": "For eksempel blir {hello} til {uryyb} nar det kodes med ROT13.",
    "self-reversing": "ROT13 og ROT47 er selvreverserende: a bruke samme algoritme to ganger returnerer den opprinnelige teksten. Dette gjor dem nyttige for a skjule spoilere, gatesvar eller lett tilsloret tekst uten a trenge en separat dekrypteringsfunksjon."
  }
}
</i18n>
