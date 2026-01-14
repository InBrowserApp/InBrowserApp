<template>
  <DescriptionMarkdown
    :title="t('what-is-regex')"
    :description="t('what-is-regex-description-markdown')"
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
    "what-is-regex": "What is Regex?",
    "what-is-regex-description-markdown": "Regex (regular expression) is a pattern language for finding and replacing text.\n\n**Key points:**\n- Patterns describe characters, groups, and repetition (like `[A-Z]+`, `(...)`, `{'|'}`).\n- Anchors `^` and `{'$'}` control where a match can start or end.\n- Flags like g/i/m/s/u/y change matching behavior.\n- Replacement strings can reference groups with {'$'}1 or {'$'}&lt;name&gt;.\n\n**Example:**\n- Pattern: `Order #([0-9]+)`\n- Replacement: `ID:{'$'}1`\n- Input: `Order #123` -> Output: `ID:123`\n\nUse regex carefully on very long text; some patterns can be slow."
  },
  "zh": {
    "what-is-regex": "什么是正则？",
    "what-is-regex-description-markdown": "正则表达式（Regex）是一种用于查找和替换文本的模式语言。\n\n**要点：**\n- 模式描述字符、分组和重复（如 `[A-Z]+`、`(...)`、`{'|'}`）。\n- 锚点 `^` 和 `{'$'}` 控制匹配从哪里开始或结束。\n- g/i/m/s/u/y 等标志会改变匹配行为。\n- 替换字符串可以用 {'$'}1 或 {'$'}&lt;name&gt; 引用分组。\n\n**示例：**\n- 模式：`Order #([0-9]+)`\n- 替换：`ID:{'$'}1`\n- 输入：`Order #123` -> 输出：`ID:123`\n\n对超长文本使用正则时要注意性能，一些模式可能很慢。"
  },
  "zh-CN": {
    "what-is-regex": "什么是正则？",
    "what-is-regex-description-markdown": "正则表达式（Regex）是一种用于查找和替换文本的模式语言。\n\n**要点：**\n- 模式描述字符、分组和重复（如 `[A-Z]+`、`(...)`、`{'|'}`）。\n- 锚点 `^` 和 `{'$'}` 控制匹配从哪里开始或结束。\n- g/i/m/s/u/y 等标志会改变匹配行为。\n- 替换字符串可以用 {'$'}1 或 {'$'}&lt;name&gt; 引用分组。\n\n**示例：**\n- 模式：`Order #([0-9]+)`\n- 替换：`ID:{'$'}1`\n- 输入：`Order #123` -> 输出：`ID:123`\n\n对超长文本使用正则时要注意性能，一些模式可能很慢。"
  },
  "zh-TW": {
    "what-is-regex": "什麼是正則？",
    "what-is-regex-description-markdown": "正則表達式（Regex）是用於搜尋與取代文字的模式語言。\n\n**要點：**\n- 模式描述字元、群組與重複（如 `[A-Z]+`、`(...)`、`{'|'}`）。\n- 錨點 `^` 和 `{'$'}` 控制匹配起點與終點。\n- g/i/m/s/u/y 等旗標會改變匹配行為。\n- 取代字串可用 {'$'}1 或 {'$'}&lt;name&gt; 引用群組。\n\n**範例：**\n- 模式：`Order #([0-9]+)`\n- 取代：`ID:{'$'}1`\n- 輸入：`Order #123` -> 輸出：`ID:123`\n\n處理很長的文字時要注意效能，某些模式可能很慢。"
  },
  "zh-HK": {
    "what-is-regex": "什麼是正則？",
    "what-is-regex-description-markdown": "正則表達式（Regex）是用於搜尋與取代文字的模式語言。\n\n**要點：**\n- 模式描述字元、群組與重複（如 `[A-Z]+`、`(...)`、`{'|'}`）。\n- 錨點 `^` 和 `{'$'}` 控制匹配起點與終點。\n- g/i/m/s/u/y 等旗標會改變匹配行為。\n- 取代字串可用 {'$'}1 或 {'$'}&lt;name&gt; 引用群組。\n\n**範例：**\n- 模式：`Order #([0-9]+)`\n- 取代：`ID:{'$'}1`\n- 輸入：`Order #123` -> 輸出：`ID:123`\n\n處理很長的文字時要注意效能，某些模式可能很慢。"
  },
  "es": {
    "what-is-regex": "¿Qué es Regex?",
    "what-is-regex-description-markdown": "Regex (expresión regular) es un lenguaje de patrones para buscar y reemplazar texto.\n\n**Puntos clave:**\n- Los patrones describen caracteres, grupos y repeticiones (como `[A-Z]+`, `(...)`, `{'|'}`).\n- Los anclajes `^` y `{'$'}` controlan dónde puede empezar o terminar una coincidencia.\n- Flags como g/i/m/s/u/y cambian el comportamiento de coincidencia.\n- Las cadenas de reemplazo pueden referenciar grupos con {'$'}1 o {'$'}&lt;name&gt;.\n\n**Ejemplo:**\n- Patrón: `Order #([0-9]+)`\n- Reemplazo: `ID:{'$'}1`\n- Entrada: `Order #123` -> Salida: `ID:123`\n\nUsa regex con cuidado en textos muy largos; algunos patrones pueden ser lentos."
  },
  "fr": {
    "what-is-regex": "Qu'est-ce que Regex ?",
    "what-is-regex-description-markdown": "Regex (expression régulière) est un langage de motifs pour rechercher et remplacer du texte.\n\n**Points clés :**\n- Les motifs décrivent des caractères, des groupes et des répétitions (comme `[A-Z]+`, `(...)`, `{'|'}`).\n- Les ancres `^` et `{'$'}` contrôlent où une correspondance peut commencer ou finir.\n- Des indicateurs comme g/i/m/s/u/y modifient le comportement de correspondance.\n- Les chaînes de remplacement peuvent référencer des groupes avec {'$'}1 ou {'$'}&lt;name&gt;.\n\n**Exemple :**\n- Motif : `Order #([0-9]+)`\n- Remplacement : `ID:{'$'}1`\n- Entrée : `Order #123` -> Sortie : `ID:123`\n\nUtilisez les regex avec prudence sur de très longs textes ; certains motifs peuvent être lents."
  },
  "de": {
    "what-is-regex": "Was ist Regex?",
    "what-is-regex-description-markdown": "Regex (regulärer Ausdruck) ist eine Mustersprache zum Suchen und Ersetzen von Text.\n\n**Kernpunkte:**\n- Muster beschreiben Zeichen, Gruppen und Wiederholungen (wie `[A-Z]+`, `(...)`, `{'|'}`).\n- Anker `^` und `{'$'}` steuern, wo ein Treffer beginnen oder enden kann.\n- Flags wie g/i/m/s/u/y ändern das Matching-Verhalten.\n- Ersetzungsstrings können Gruppen mit {'$'}1 oder {'$'}&lt;name&gt; referenzieren.\n\n**Beispiel:**\n- Muster: `Order #([0-9]+)`\n- Ersetzung: `ID:{'$'}1`\n- Eingabe: `Order #123` -> Ausgabe: `ID:123`\n\nBei sehr langen Texten vorsichtig einsetzen; manche Muster können langsam sein."
  },
  "it": {
    "what-is-regex": "Cos'è Regex?",
    "what-is-regex-description-markdown": "Regex (espressione regolare) è un linguaggio di pattern per cercare e sostituire testo.\n\n**Punti chiave:**\n- I pattern descrivono caratteri, gruppi e ripetizioni (come `[A-Z]+`, `(...)`, `{'|'}`).\n- Gli ancoraggi `^` e `{'$'}` controllano dove una corrispondenza può iniziare o finire.\n- Flag come g/i/m/s/u/y cambiano il comportamento di matching.\n- Le stringhe di sostituzione possono riferire i gruppi con {'$'}1 o {'$'}&lt;name&gt;.\n\n**Esempio:**\n- Pattern: `Order #([0-9]+)`\n- Sostituzione: `ID:{'$'}1`\n- Input: `Order #123` -> Output: `ID:123`\n\nUsa le regex con attenzione su testi molto lunghi; alcuni pattern possono essere lenti."
  },
  "ja": {
    "what-is-regex": "正規表現とは？",
    "what-is-regex-description-markdown": "Regex（正規表現）は、テキストの検索や置換に使うパターン言語です。\n\n**要点：**\n- パターンは文字、グループ、繰り返しを表現します（例：`[A-Z]+`、`(...)`、`{'|'}`）。\n- アンカー `^` と `{'$'}` は一致の開始や終了位置を制御します。\n- g/i/m/s/u/y などのフラグで一致の挙動が変わります。\n- 置換文字列は {'$'}1 や {'$'}&lt;name&gt; でグループ参照できます。\n\n**例：**\n- パターン：`Order #([0-9]+)`\n- 置換：`ID:{'$'}1`\n- 入力：`Order #123` -> 出力：`ID:123`\n\n長いテキストに対しては注意が必要で、パターンによっては遅くなることがあります。"
  },
  "ko": {
    "what-is-regex": "Regex란?",
    "what-is-regex-description-markdown": "Regex(정규식)는 텍스트를 찾고 바꾸기 위한 패턴 언어입니다.\n\n**핵심 포인트:**\n- 패턴은 문자, 그룹, 반복을 설명합니다(예: `[A-Z]+`, `(...)`, `{'|'}`).\n- 앵커 `^`와 `{'$'}`는 매칭의 시작/끝 위치를 제어합니다.\n- g/i/m/s/u/y 같은 플래그가 매칭 동작을 바꿉니다.\n- 치환 문자열은 {'$'}1 또는 {'$'}&lt;name&gt;로 그룹을 참조할 수 있습니다.\n\n**예시:**\n- 패턴: `Order #([0-9]+)`\n- 치환: `ID:{'$'}1`\n- 입력: `Order #123` -> 출력: `ID:123`\n\n아주 긴 텍스트에서는 주의하세요. 일부 패턴은 느릴 수 있습니다."
  },
  "ru": {
    "what-is-regex": "Что такое Regex?",
    "what-is-regex-description-markdown": "Regex (регулярное выражение) — это язык шаблонов для поиска и замены текста.\n\n**Ключевые моменты:**\n- Шаблоны описывают символы, группы и повторения (например, `[A-Z]+`, `(...)`, `{'|'}`).\n- Якоря `^` и `{'$'}` определяют, где совпадение может начинаться или заканчиваться.\n- Флаги g/i/m/s/u/y меняют поведение сопоставления.\n- В строках замены можно ссылаться на группы через {'$'}1 или {'$'}&lt;name&gt;.\n\n**Пример:**\n- Шаблон: `Order #([0-9]+)`\n- Замена: `ID:{'$'}1`\n- Ввод: `Order #123` -> Вывод: `ID:123`\n\nПри очень длинных текстах будьте осторожны: некоторые шаблоны могут быть медленными."
  },
  "pt": {
    "what-is-regex": "O que é Regex?",
    "what-is-regex-description-markdown": "Regex (expressão regular) é uma linguagem de padrões para buscar e substituir texto.\n\n**Pontos-chave:**\n- Padrões descrevem caracteres, grupos e repetições (como `[A-Z]+`, `(...)`, `{'|'}`).\n- Âncoras `^` e `{'$'}` controlam onde uma correspondência pode começar ou terminar.\n- Flags como g/i/m/s/u/y alteram o comportamento de correspondência.\n- Strings de substituição podem referenciar grupos com {'$'}1 ou {'$'}&lt;name&gt;.\n\n**Exemplo:**\n- Padrão: `Order #([0-9]+)`\n- Substituição: `ID:{'$'}1`\n- Entrada: `Order #123` -> Saída: `ID:123`\n\nUse regex com cuidado em textos muito longos; alguns padrões podem ser lentos."
  },
  "ar": {
    "what-is-regex": "ما هو Regex؟",
    "what-is-regex-description-markdown": "Regex (التعبير النمطي) هي لغة أنماط للبحث عن النص واستبداله.\n\n**نقاط أساسية:**\n- الأنماط تصف الأحرف والمجموعات والتكرار (مثل `[A-Z]+` و `(...)` و `{'|'}`).\n- العلامات `^` و `{'$'}` تتحكم في بداية أو نهاية التطابق.\n- الرايات g/i/m/s/u/y تغيّر سلوك المطابقة.\n- يمكن لسلاسل الاستبدال الإشارة إلى المجموعات باستخدام {'$'}1 أو {'$'}&lt;name&gt;.\n\n**مثال:**\n- النمط: `Order #([0-9]+)`\n- الاستبدال: `ID:{'$'}1`\n- الإدخال: `Order #123` -> الإخراج: `ID:123`\n\nاستخدم regex بحذر مع النصوص الطويلة جدا؛ بعض الأنماط قد تكون بطيئة."
  },
  "hi": {
    "what-is-regex": "Regex क्या है?",
    "what-is-regex-description-markdown": "Regex (रेगुलर एक्सप्रेशन) टेक्स्ट खोजने और बदलने के लिए पैटर्न भाषा है।\n\n**मुख्य बिंदु:**\n- पैटर्न वर्ण, समूह और दोहराव का वर्णन करते हैं (जैसे `[A-Z]+`, `(...)`, `{'|'}`).\n- एंकर `^` और `{'$'}` यह नियंत्रित करते हैं कि मैच कहां शुरू या समाप्त हो सकता है।\n- g/i/m/s/u/y जैसे फ़्लैग्स मैचिंग व्यवहार बदलते हैं।\n- प्रतिस्थापन स्ट्रिंग में {'$'}1 या {'$'}&lt;name&gt; से समूह संदर्भित किए जा सकते हैं।\n\n**उदाहरण:**\n- पैटर्न: `Order #([0-9]+)`\n- प्रतिस्थापन: `ID:{'$'}1`\n- इनपुट: `Order #123` -> आउटपुट: `ID:123`\n\nबहुत लंबे टेक्स्ट पर उपयोग करते समय सावधानी रखें; कुछ पैटर्न धीमे हो सकते हैं।"
  },
  "tr": {
    "what-is-regex": "Regex nedir?",
    "what-is-regex-description-markdown": "Regex (düzenli ifade) metni aramak ve değiştirmek için bir desen dilidir.\n\n**Önemli noktalar:**\n- Desenler karakterleri, grupları ve tekrarları tanımlar (ör. `[A-Z]+`, `(...)`, `{'|'}`).\n- Çapalar `^` ve `{'$'}` eşleşmenin nerede başlayıp bitebileceğini kontrol eder.\n- g/i/m/s/u/y gibi bayraklar eşleşme davranışını değiştirir.\n- Değiştirme dizeleri {'$'}1 veya {'$'}&lt;name&gt; ile gruplara referans verebilir.\n\n**Örnek:**\n- Desen: `Order #([0-9]+)`\n- Değiştirme: `ID:{'$'}1`\n- Girdi: `Order #123` -> Çıktı: `ID:123`\n\nÇok uzun metinlerde dikkatli olun; bazı desenler yavaş olabilir."
  },
  "nl": {
    "what-is-regex": "Wat is Regex?",
    "what-is-regex-description-markdown": "Regex (reguliere expressie) is een patroontaal om tekst te zoeken en te vervangen.\n\n**Belangrijke punten:**\n- Patronen beschrijven tekens, groepen en herhaling (zoals `[A-Z]+`, `(...)`, `{'|'}`).\n- Ankers `^` en `{'$'}` bepalen waar een match kan beginnen of eindigen.\n- Vlaggen zoals g/i/m/s/u/y veranderen het matchgedrag.\n- Vervangingsstrings kunnen groepen refereren met {'$'}1 of {'$'}&lt;name&gt;.\n\n**Voorbeeld:**\n- Patroon: `Order #([0-9]+)`\n- Vervanging: `ID:{'$'}1`\n- Invoer: `Order #123` -> Uitvoer: `ID:123`\n\nWees voorzichtig bij zeer lange teksten; sommige patronen kunnen traag zijn."
  },
  "sv": {
    "what-is-regex": "Vad är Regex?",
    "what-is-regex-description-markdown": "Regex (reguljärt uttryck) är ett mönsterspråk för att hitta och ersätta text.\n\n**Nyckelpunkter:**\n- Mönster beskriver tecken, grupper och upprepning (som `[A-Z]+`, `(...)`, `{'|'}`).\n- Ankare `^` och `{'$'}` styr var en träff kan börja eller sluta.\n- Flaggor som g/i/m/s/u/y ändrar matchningsbeteendet.\n- Ersättningssträngar kan referera grupper med {'$'}1 eller {'$'}&lt;name&gt;.\n\n**Exempel:**\n- Mönster: `Order #([0-9]+)`\n- Ersättning: `ID:{'$'}1`\n- Indata: `Order #123` -> Utdata: `ID:123`\n\nVar försiktig med mycket långa texter; vissa mönster kan vara långsamma."
  },
  "pl": {
    "what-is-regex": "Czym jest Regex?",
    "what-is-regex-description-markdown": "Regex (wyrażenie regularne) to język wzorców do wyszukiwania i zamiany tekstu.\n\n**Kluczowe punkty:**\n- Wzorce opisują znaki, grupy i powtórzenia (np. `[A-Z]+`, `(...)`, `{'|'}`).\n- Kotwice `^` i `{'$'}` kontrolują, gdzie dopasowanie może się zacząć lub skończyć.\n- Flagi g/i/m/s/u/y zmieniają zachowanie dopasowania.\n- Ciągi zamiany mogą odwoływać się do grup przez {'$'}1 lub {'$'}&lt;name&gt;.\n\n**Przykład:**\n- Wzorzec: `Order #([0-9]+)`\n- Zamiana: `ID:{'$'}1`\n- Wejście: `Order #123` -> Wyjście: `ID:123`\n\nUważaj przy bardzo długich tekstach; niektóre wzorce mogą być wolne."
  },
  "vi": {
    "what-is-regex": "Regex là gì?",
    "what-is-regex-description-markdown": "Regex (biểu thức chính quy) là ngôn ngữ mẫu để tìm và thay thế văn bản.\n\n**Điểm chính:**\n- Mẫu mô tả ký tự, nhóm và lặp lại (như `[A-Z]+`, `(...)`, `{'|'}`).\n- Neo `^` và `{'$'}` kiểm soát nơi bắt đầu hoặc kết thúc khớp.\n- Cờ g/i/m/s/u/y thay đổi hành vi khớp.\n- Chuỗi thay thế có thể tham chiếu nhóm bằng {'$'}1 hoặc {'$'}&lt;name&gt;.\n\n**Ví dụ:**\n- Mẫu: `Order #([0-9]+)`\n- Thay thế: `ID:{'$'}1`\n- Đầu vào: `Order #123` -> Đầu ra: `ID:123`\n\nHãy cẩn thận với văn bản rất dài; một số mẫu có thể chậm."
  },
  "th": {
    "what-is-regex": "Regex คืออะไร?",
    "what-is-regex-description-markdown": "Regex (เรกซ์เพรสชัน) คือภาษารูปแบบสำหรับค้นหาและแทนที่ข้อความ\n\n**ประเด็นสำคัญ:**\n- รูปแบบอธิบายอักขระ กลุ่ม และการทำซ้ำ (เช่น `[A-Z]+`, `(...)`, `{'|'}`).\n- แองเคอร์ `^` และ `{'$'}` ควบคุมตำแหน่งเริ่มหรือจบของการจับคู่\n- แฟล็ก g/i/m/s/u/y เปลี่ยนพฤติกรรมการจับคู่\n- สตริงแทนที่สามารถอ้างอิงกลุ่มด้วย {'$'}1 หรือ {'$'}&lt;name&gt;\n\n**ตัวอย่าง:**\n- รูปแบบ: `Order #([0-9]+)`\n- แทนที่: `ID:{'$'}1`\n- อินพุต: `Order #123` -> เอาต์พุต: `ID:123`\n\nใช้ regex อย่างระมัดระวังกับข้อความที่ยาวมาก เพราะบางรูปแบบอาจช้า"
  },
  "id": {
    "what-is-regex": "Apa itu Regex?",
    "what-is-regex-description-markdown": "Regex (ekspresi reguler) adalah bahasa pola untuk mencari dan mengganti teks.\n\n**Poin utama:**\n- Pola menggambarkan karakter, grup, dan pengulangan (seperti `[A-Z]+`, `(...)`, `{'|'}`).\n- Jangkar `^` dan `{'$'}` mengontrol di mana kecocokan bisa mulai atau berakhir.\n- Flag seperti g/i/m/s/u/y mengubah perilaku pencocokan.\n- String penggantian dapat merujuk grup dengan {'$'}1 atau {'$'}&lt;name&gt;.\n\n**Contoh:**\n- Pola: `Order #([0-9]+)`\n- Penggantian: `ID:{'$'}1`\n- Input: `Order #123` -> Output: `ID:123`\n\nGunakan regex dengan hati-hati pada teks yang sangat panjang; beberapa pola bisa lambat."
  },
  "he": {
    "what-is-regex": "מה זה Regex?",
    "what-is-regex-description-markdown": "Regex (ביטוי רגולרי) הוא שפת תבניות לחיפוש והחלפת טקסט.\n\n**נקודות מפתח:**\n- תבניות מתארות תווים, קבוצות וחזרות (כמו `[A-Z]+`, `(...)`, `{'|'}`).\n- עוגנים `^` ו-`{'$'}` שולטים במקום שבו התאמה יכולה להתחיל או להסתיים.\n- דגלים כמו g/i/m/s/u/y משנים את התנהגות ההתאמה.\n- מחרוזות החלפה יכולות להפנות לקבוצות באמצעות {'$'}1 או {'$'}&lt;name&gt;.\n\n**דוגמה:**\n- תבנית: `Order #([0-9]+)`\n- החלפה: `ID:{'$'}1`\n- קלט: `Order #123` -> פלט: `ID:123`\n\nהשתמשו ב-regex בזהירות בטקסטים ארוכים מאוד; חלק מהתבניות עשויות להיות איטיות."
  },
  "ms": {
    "what-is-regex": "Apakah Regex?",
    "what-is-regex-description-markdown": "Regex (ungkapan biasa) ialah bahasa corak untuk mencari dan mengganti teks.\n\n**Perkara utama:**\n- Corak menerangkan aksara, kumpulan dan ulangan (seperti `[A-Z]+`, `(...)`, `{'|'}`).\n- Sauh `^` dan `{'$'}` mengawal di mana padanan boleh bermula atau berakhir.\n- Flag seperti g/i/m/s/u/y mengubah tingkah laku padanan.\n- Rentetan penggantian boleh merujuk kumpulan dengan {'$'}1 atau {'$'}&lt;name&gt;.\n\n**Contoh:**\n- Corak: `Order #([0-9]+)`\n- Penggantian: `ID:{'$'}1`\n- Input: `Order #123` -> Output: `ID:123`\n\nGunakan regex dengan berhati-hati pada teks yang sangat panjang; sesetengah corak boleh menjadi perlahan."
  },
  "no": {
    "what-is-regex": "Hva er Regex?",
    "what-is-regex-description-markdown": "Regex (regulært uttrykk) er et mønsterspråk for å søke og erstatte tekst.\n\n**Nøkkelpunkter:**\n- Mønstre beskriver tegn, grupper og gjentakelser (som `[A-Z]+`, `(...)`, `{'|'}`).\n- Ankre `^` og `{'$'}` styrer hvor et treff kan starte eller slutte.\n- Flagg som g/i/m/s/u/y endrer matchingsatferd.\n- Erstatningsstrenger kan referere grupper med {'$'}1 eller {'$'}&lt;name&gt;.\n\n**Eksempel:**\n- Mønster: `Order #([0-9]+)`\n- Erstatning: `ID:{'$'}1`\n- Inndata: `Order #123` -> Utdata: `ID:123`\n\nVær forsiktig med veldig lange tekster; noen mønstre kan være trege."
  }
}
</i18n>
