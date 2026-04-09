## SQL Formatter & Linter क्या है?

SQL Formatter & Linter आपके ब्राउज़र में SQL queries को फिर से format करता है और साथ ही उन्हें high-signal issues के एक छोटे set के लिए जाँचता है। यह तब उपयोगी है जब आप cleaner query layout, consistent keyword casing, और `SELECT *` या बिना `WHERE` clause वाले `UPDATE` statements जैसे risky patterns पर त्वरित feedback चाहते हैं।

## इसका उपयोग कब करें

इस tool का उपयोग तब करें जब आप hand-written SQL की समीक्षा कर रहे हों, साझा करने से पहले pasted queries को साफ़ कर रहे हों, या अलग-अलग SQL dialects में formatting की तुलना कर रहे हों। यह ad hoc query review, pull request cleanup, और browser-only formatting के लिए अच्छा काम करता है, बिना आपका SQL किसी server पर भेजे।

## यह क्या जाँचता है

यह rewrite formatter और linter को अलग रखती है लेकिन उन्हें coordinated बनाए रखती है। Formatting `sql-formatter` के साथ dialect-aware layout options का उपयोग करती है, जबकि linting parse errors, missing semicolons, व्यापक `SELECT *` उपयोग, unsafe mutations, लंबे lines, और keyword case drift को surface करती है।
