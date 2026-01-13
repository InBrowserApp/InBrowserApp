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
    "what-is-regex-description-markdown": "Regex (regular expression) is a pattern language for finding and replacing text.\n\n**Key points:**\n- Patterns describe characters, groups, and repetition.\n- Flags like g/i/m/s/u/y change matching behavior.\n- Replacement strings can reference groups with $1 or $&lt;name&gt;."
  },
  "zh": {
    "what-is-regex": "什么是正则？",
    "what-is-regex-description-markdown": "正则表达式（Regex）是一种用于查找和替换文本的模式语言。\n\n**要点：**\n- 模式描述字符、分组和重复。\n- g/i/m/s/u/y 等标志会改变匹配行为。\n- 替换字符串可以用 $1 或 $&lt;name&gt; 引用分组。"
  },
  "zh-CN": {
    "what-is-regex": "什么是正则？",
    "what-is-regex-description-markdown": "正则表达式（Regex）是一种用于查找和替换文本的模式语言。\n\n**要点：**\n- 模式描述字符、分组和重复。\n- g/i/m/s/u/y 等标志会改变匹配行为。\n- 替换字符串可以用 $1 或 $&lt;name&gt; 引用分组。"
  },
  "zh-TW": {
    "what-is-regex": "什麼是正則？",
    "what-is-regex-description-markdown": "正則表達式（Regex）是用於搜尋與替換文字的模式語言。\n\n**要點：**\n- 模式描述字元、群組與重複。\n- g/i/m/s/u/y 等旗標會改變匹配行為。\n- 取代字串可用 $1 或 $&lt;name&gt; 引用群組。"
  },
  "zh-HK": {
    "what-is-regex": "什麼是正則？",
    "what-is-regex-description-markdown": "正則表達式（Regex）是用於搜尋與替換文字的模式語言。\n\n**要點：**\n- 模式描述字元、群組與重複。\n- g/i/m/s/u/y 等旗標會改變匹配行為。\n- 取代字串可用 $1 或 $&lt;name&gt; 引用群組。"
  },
  "es": {
    "what-is-regex": "¿Qué es Regex?",
    "what-is-regex-description-markdown": "Regex (expresión regular) es un lenguaje de patrones para buscar y reemplazar texto.\n\n**Puntos clave:**\n- Los patrones describen caracteres, grupos y repeticiones.\n- Flags como g/i/m/s/u/y cambian el comportamiento de coincidencia.\n- Las cadenas de reemplazo pueden referenciar grupos con $1 o $&lt;name&gt;."
  },
  "fr": {
    "what-is-regex": "Qu'est-ce que Regex ?",
    "what-is-regex-description-markdown": "Regex (expression régulière) est un langage de motifs pour rechercher et remplacer du texte.\n\n**Points clés :**\n- Les motifs décrivent des caractères, des groupes et des répétitions.\n- Des indicateurs comme g/i/m/s/u/y modifient le comportement de correspondance.\n- Les chaînes de remplacement peuvent référencer des groupes avec $1 ou $&lt;name&gt;."
  },
  "de": {
    "what-is-regex": "Was ist Regex?",
    "what-is-regex-description-markdown": "Regex (regulärer Ausdruck) ist eine Mustersprache zum Suchen und Ersetzen von Text.\n\n**Kernpunkte:**\n- Muster beschreiben Zeichen, Gruppen und Wiederholungen.\n- Flags wie g/i/m/s/u/y ändern das Matching-Verhalten.\n- Ersetzungsstrings können Gruppen mit $1 oder $&lt;name&gt; referenzieren."
  },
  "it": {
    "what-is-regex": "Cos'è Regex?",
    "what-is-regex-description-markdown": "Regex (espressione regolare) è un linguaggio di pattern per cercare e sostituire testo.\n\n**Punti chiave:**\n- I pattern descrivono caratteri, gruppi e ripetizioni.\n- Flag come g/i/m/s/u/y cambiano il comportamento di matching.\n- Le stringhe di sostituzione possono riferire i gruppi con $1 o $&lt;name&gt;."
  },
  "ja": {
    "what-is-regex": "正規表現とは？",
    "what-is-regex-description-markdown": "Regex（正規表現）は、テキストの検索や置換に使うパターン言語です。\n\n**要点：**\n- パターンは文字、グループ、繰り返しを表現します。\n- g/i/m/s/u/y などのフラグで一致の挙動が変わります。\n- 置換文字列は $1 や $&lt;name&gt; でグループ参照できます。"
  },
  "ko": {
    "what-is-regex": "Regex란?",
    "what-is-regex-description-markdown": "Regex(정규식)는 텍스트를 찾고 바꾸기 위한 패턴 언어입니다.\n\n**핵심 포인트:**\n- 패턴은 문자, 그룹, 반복을 설명합니다.\n- g/i/m/s/u/y 같은 플래그가 매칭 동작을 바꿉니다.\n- 치환 문자열은 $1 또는 $&lt;name&gt;로 그룹을 참조할 수 있습니다."
  },
  "ru": {
    "what-is-regex": "Что такое Regex?",
    "what-is-regex-description-markdown": "Regex (регулярное выражение) — это язык шаблонов для поиска и замены текста.\n\n**Ключевые моменты:**\n- Шаблоны описывают символы, группы и повторения.\n- Флаги g/i/m/s/u/y меняют поведение сопоставления.\n- В строках замены можно ссылаться на группы через $1 или $&lt;name&gt;."
  },
  "pt": {
    "what-is-regex": "O que é Regex?",
    "what-is-regex-description-markdown": "Regex (expressão regular) é uma linguagem de padrões para buscar e substituir texto.\n\n**Pontos-chave:**\n- Padrões descrevem caracteres, grupos e repetições.\n- Flags como g/i/m/s/u/y alteram o comportamento de correspondência.\n- Strings de substituição podem referenciar grupos com $1 ou $&lt;name&gt;."
  },
  "ar": {
    "what-is-regex": "ما هو Regex؟",
    "what-is-regex-description-markdown": "Regex (التعبير النمطي) هي لغة أنماط للبحث عن النص واستبداله.\n\n**نقاط أساسية:**\n- الأنماط تصف الأحرف والمجموعات والتكرار.\n- الرايات g/i/m/s/u/y تغيّر سلوك المطابقة.\n- يمكن لسلاسل الاستبدال الإشارة إلى المجموعات باستخدام $1 أو $&lt;name&gt;."
  },
  "hi": {
    "what-is-regex": "Regex क्या है?",
    "what-is-regex-description-markdown": "Regex (रेगुलर एक्सप्रेशन) टेक्स्ट खोजने और बदलने के लिए पैटर्न भाषा है।\n\n**मुख्य बिंदु:**\n- पैटर्न वर्ण, समूह और दोहराव का वर्णन करते हैं।\n- g/i/m/s/u/y जैसे फ़्लैग्स मैचिंग व्यवहार बदलते हैं।\n- प्रतिस्थापन स्ट्रिंग में $1 या $&lt;name&gt; से समूह संदर्भित किए जा सकते हैं।"
  },
  "tr": {
    "what-is-regex": "Regex nedir?",
    "what-is-regex-description-markdown": "Regex (düzenli ifade) metni aramak ve değiştirmek için bir desen dilidir.\n\n**Önemli noktalar:**\n- Desenler karakterleri, grupları ve tekrarları tanımlar.\n- g/i/m/s/u/y gibi bayraklar eşleştirme davranışını değiştirir.\n- Değiştirme dizeleri $1 veya $&lt;name&gt; ile gruplara referans verebilir."
  },
  "nl": {
    "what-is-regex": "Wat is Regex?",
    "what-is-regex-description-markdown": "Regex (reguliere expressie) is een patroontaal om tekst te zoeken en te vervangen.\n\n**Belangrijke punten:**\n- Patronen beschrijven tekens, groepen en herhaling.\n- Vlaggen zoals g/i/m/s/u/y veranderen het matchgedrag.\n- Vervangingsstrings kunnen groepen refereren met $1 of $&lt;name&gt;."
  },
  "sv": {
    "what-is-regex": "Vad är Regex?",
    "what-is-regex-description-markdown": "Regex (reguljärt uttryck) är ett mönsterspråk för att söka och ersätta text.\n\n**Nyckelpunkter:**\n- Mönster beskriver tecken, grupper och upprepning.\n- Flaggor som g/i/m/s/u/y ändrar matchningsbeteendet.\n- Ersättningssträngar kan referera grupper med $1 eller $&lt;name&gt;."
  },
  "pl": {
    "what-is-regex": "Czym jest Regex?",
    "what-is-regex-description-markdown": "Regex (wyrażenie regularne) to język wzorców do wyszukiwania i zamiany tekstu.\n\n**Kluczowe punkty:**\n- Wzorce opisują znaki, grupy i powtórzenia.\n- Flagi g/i/m/s/u/y zmieniają zachowanie dopasowania.\n- Ciągi zamiany mogą odwoływać się do grup przez $1 lub $&lt;name&gt;."
  },
  "vi": {
    "what-is-regex": "Regex là gì?",
    "what-is-regex-description-markdown": "Regex (biểu thức chính quy) là ngôn ngữ mẫu để tìm và thay thế văn bản.\n\n**Điểm chính:**\n- Mẫu mô tả ký tự, nhóm và lặp lại.\n- Cờ g/i/m/s/u/y thay đổi hành vi khớp.\n- Chuỗi thay thế có thể tham chiếu nhóm bằng $1 hoặc $&lt;name&gt;."
  },
  "th": {
    "what-is-regex": "Regex คืออะไร?",
    "what-is-regex-description-markdown": "Regex (เรกซ์เพรสชัน) คือภาษารูปแบบสำหรับค้นหาและแทนที่ข้อความ\n\n**ประเด็นสำคัญ:**\n- รูปแบบอธิบายอักขระ กลุ่ม และการทำซ้ำ\n- แฟล็ก g/i/m/s/u/y เปลี่ยนพฤติกรรมการจับคู่\n- สตริงแทนที่สามารถอ้างอิงกลุ่มด้วย $1 หรือ $&lt;name&gt;"
  },
  "id": {
    "what-is-regex": "Apa itu Regex?",
    "what-is-regex-description-markdown": "Regex (ekspresi reguler) adalah bahasa pola untuk mencari dan mengganti teks.\n\n**Poin utama:**\n- Pola menggambarkan karakter, grup, dan pengulangan.\n- Flag seperti g/i/m/s/u/y mengubah perilaku pencocokan.\n- String penggantian dapat merujuk grup dengan $1 atau $&lt;name&gt;."
  },
  "he": {
    "what-is-regex": "מה זה Regex?",
    "what-is-regex-description-markdown": "Regex (ביטוי רגולרי) הוא שפת תבניות לחיפוש והחלפת טקסט.\n\n**נקודות מפתח:**\n- תבניות מתארות תווים, קבוצות וחזרות.\n- דגלים כמו g/i/m/s/u/y משנים את התנהגות ההתאמה.\n- מחרוזות החלפה יכולות להפנות לקבוצות באמצעות $1 או $&lt;name&gt;."
  },
  "ms": {
    "what-is-regex": "Apakah Regex?",
    "what-is-regex-description-markdown": "Regex (ungkapan biasa) ialah bahasa corak untuk mencari dan mengganti teks.\n\n**Perkara utama:**\n- Corak menerangkan aksara, kumpulan dan ulangan.\n- Flag seperti g/i/m/s/u/y mengubah tingkah laku padanan.\n- Rentetan penggantian boleh merujuk kumpulan dengan $1 atau $&lt;name&gt;."
  },
  "no": {
    "what-is-regex": "Hva er Regex?",
    "what-is-regex-description-markdown": "Regex (regulært uttrykk) er et mønsterspråk for å søke og erstatte tekst.\n\n**Nøkkelpunkter:**\n- Mønstre beskriver tegn, grupper og gjentakelser.\n- Flagg som g/i/m/s/u/y endrer matchingsatferd.\n- Erstatningsstrenger kan referere grupper med $1 eller $&lt;name&gt;."
  }
}
</i18n>
