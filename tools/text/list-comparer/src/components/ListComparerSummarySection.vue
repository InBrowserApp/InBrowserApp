<template>
  <ToolSectionHeader>{{ t('summaryTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-alert type="info">{{ t('setModeHint') }}</n-alert>
      <ListComparerSummaryCards
        :left-items-label="t('leftItemsLabel')"
        :left-unique-label="t('leftUniqueLabel')"
        :right-items-label="t('rightItemsLabel')"
        :right-unique-label="t('rightUniqueLabel')"
        :common-label="t('commonLabel')"
        :left-only-label="t('leftOnlyLabel')"
        :right-only-label="t('rightOnlyLabel')"
        :left-duplicates-label="t('leftDuplicatesLabel')"
        :right-duplicates-label="t('rightDuplicatesLabel')"
        :left-total="comparison.left.totalCount"
        :left-unique="comparison.left.uniqueCount"
        :right-total="comparison.right.totalCount"
        :right-unique="comparison.right.uniqueCount"
        :common-count="comparison.commonItems.length"
        :left-only-count="comparison.leftOnlyItems.length"
        :right-only-count="comparison.rightOnlyItems.length"
        :left-duplicate-count="comparison.left.duplicateItems.length"
        :right-duplicate-count="comparison.right.duplicateItems.length"
      />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NFlex } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ListComparerSummaryCards from './ListComparerSummaryCards.vue'
import type { ListComparisonResult } from '../utils/listComparer'

defineProps<{
  comparison: ListComparisonResult
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "summaryTitle": "Comparison Summary",
    "setModeHint": "Results are set-based. Repeated items stay counted in the summary, but common and only-result tabs list each value once.",
    "leftItemsLabel": "List A items",
    "leftUniqueLabel": "Unique in A",
    "rightItemsLabel": "List B items",
    "rightUniqueLabel": "Unique in B",
    "commonLabel": "Common items",
    "leftOnlyLabel": "Only in A",
    "rightOnlyLabel": "Only in B",
    "leftDuplicatesLabel": "Duplicates in A",
    "rightDuplicatesLabel": "Duplicates in B"
  },
  "zh": {
    "summaryTitle": "比较摘要",
    "setModeHint": "结果按集合语义计算。重复项会计入摘要统计，但在共同项和独有项结果中只显示一次。",
    "leftItemsLabel": "列表 A 项数",
    "leftUniqueLabel": "A 中唯一值",
    "rightItemsLabel": "列表 B 项数",
    "rightUniqueLabel": "B 中唯一值",
    "commonLabel": "共同项",
    "leftOnlyLabel": "仅在 A 中",
    "rightOnlyLabel": "仅在 B 中",
    "leftDuplicatesLabel": "A 中重复项",
    "rightDuplicatesLabel": "B 中重复项"
  },
  "zh-CN": {
    "summaryTitle": "比较摘要",
    "setModeHint": "结果按集合语义计算。重复项会计入摘要统计，但在共同项和独有项结果中只显示一次。",
    "leftItemsLabel": "列表 A 项数",
    "leftUniqueLabel": "A 中唯一值",
    "rightItemsLabel": "列表 B 项数",
    "rightUniqueLabel": "B 中唯一值",
    "commonLabel": "共同项",
    "leftOnlyLabel": "仅在 A 中",
    "rightOnlyLabel": "仅在 B 中",
    "leftDuplicatesLabel": "A 中重复项",
    "rightDuplicatesLabel": "B 中重复项"
  },
  "zh-TW": {
    "summaryTitle": "比較摘要",
    "setModeHint": "結果以集合語義計算。重複項會計入摘要統計，但在共同項與獨有項分頁中只顯示一次。",
    "leftItemsLabel": "列表 A 項數",
    "leftUniqueLabel": "A 中唯一值",
    "rightItemsLabel": "列表 B 項數",
    "rightUniqueLabel": "B 中唯一值",
    "commonLabel": "共同項",
    "leftOnlyLabel": "僅在 A 中",
    "rightOnlyLabel": "僅在 B 中",
    "leftDuplicatesLabel": "A 中重複項",
    "rightDuplicatesLabel": "B 中重複項"
  },
  "zh-HK": {
    "summaryTitle": "比較摘要",
    "setModeHint": "結果以集合語義計算。重複項會計入摘要統計，但在共同項與獨有項分頁中只顯示一次。",
    "leftItemsLabel": "列表 A 項數",
    "leftUniqueLabel": "A 中唯一值",
    "rightItemsLabel": "列表 B 項數",
    "rightUniqueLabel": "B 中唯一值",
    "commonLabel": "共同項",
    "leftOnlyLabel": "僅在 A 中",
    "rightOnlyLabel": "僅在 B 中",
    "leftDuplicatesLabel": "A 中重複項",
    "rightDuplicatesLabel": "B 中重複項"
  },
  "es": {
    "summaryTitle": "Resumen de comparacion",
    "setModeHint": "Los resultados son por conjunto. Los repetidos siguen contandose en el resumen, pero las pestanas muestran cada valor una sola vez.",
    "leftItemsLabel": "Elementos de A",
    "leftUniqueLabel": "Unicos en A",
    "rightItemsLabel": "Elementos de B",
    "rightUniqueLabel": "Unicos en B",
    "commonLabel": "Elementos comunes",
    "leftOnlyLabel": "Solo en A",
    "rightOnlyLabel": "Solo en B",
    "leftDuplicatesLabel": "Duplicados en A",
    "rightDuplicatesLabel": "Duplicados en B"
  },
  "fr": {
    "summaryTitle": "Resume de comparaison",
    "setModeHint": "Les resultats suivent une logique d'ensemble. Les doublons comptent dans le resume, mais les onglets n'affichent chaque valeur qu'une fois.",
    "leftItemsLabel": "Elements de A",
    "leftUniqueLabel": "Uniques dans A",
    "rightItemsLabel": "Elements de B",
    "rightUniqueLabel": "Uniques dans B",
    "commonLabel": "Elements communs",
    "leftOnlyLabel": "Seulement dans A",
    "rightOnlyLabel": "Seulement dans B",
    "leftDuplicatesLabel": "Doublons dans A",
    "rightDuplicatesLabel": "Doublons dans B"
  },
  "de": {
    "summaryTitle": "Vergleichszusammenfassung",
    "setModeHint": "Die Ergebnisse sind mengenbasiert. Duplikate zahlen in die Zusammenfassung, erscheinen in den Ergebnis-Tabs aber nur einmal.",
    "leftItemsLabel": "Eintrage in A",
    "leftUniqueLabel": "Eindeutig in A",
    "rightItemsLabel": "Eintrage in B",
    "rightUniqueLabel": "Eindeutig in B",
    "commonLabel": "Gemeinsame Eintrage",
    "leftOnlyLabel": "Nur in A",
    "rightOnlyLabel": "Nur in B",
    "leftDuplicatesLabel": "Duplikate in A",
    "rightDuplicatesLabel": "Duplikate in B"
  },
  "it": {
    "summaryTitle": "Riepilogo confronto",
    "setModeHint": "I risultati sono basati su insiemi. I duplicati restano nel riepilogo, ma le schede dei risultati mostrano ogni valore una sola volta.",
    "leftItemsLabel": "Elementi in A",
    "leftUniqueLabel": "Unici in A",
    "rightItemsLabel": "Elementi in B",
    "rightUniqueLabel": "Unici in B",
    "commonLabel": "Elementi comuni",
    "leftOnlyLabel": "Solo in A",
    "rightOnlyLabel": "Solo in B",
    "leftDuplicatesLabel": "Duplicati in A",
    "rightDuplicatesLabel": "Duplicati in B"
  },
  "ja": {
    "summaryTitle": "比較サマリー",
    "setModeHint": "結果は集合ベースです。重複は集計に含まれますが、共通・差分タブでは各値を 1 回だけ表示します。",
    "leftItemsLabel": "A の項目数",
    "leftUniqueLabel": "A の一意数",
    "rightItemsLabel": "B の項目数",
    "rightUniqueLabel": "B の一意数",
    "commonLabel": "共通項目",
    "leftOnlyLabel": "A のみ",
    "rightOnlyLabel": "B のみ",
    "leftDuplicatesLabel": "A の重複",
    "rightDuplicatesLabel": "B の重複"
  },
  "ko": {
    "summaryTitle": "비교 요약",
    "setModeHint": "결과는 집합 기준으로 계산됩니다. 중복은 요약에 포함되지만 공통/차이 탭에서는 각 값이 한 번만 표시됩니다.",
    "leftItemsLabel": "A 항목 수",
    "leftUniqueLabel": "A 고유 수",
    "rightItemsLabel": "B 항목 수",
    "rightUniqueLabel": "B 고유 수",
    "commonLabel": "공통 항목",
    "leftOnlyLabel": "A에만 있음",
    "rightOnlyLabel": "B에만 있음",
    "leftDuplicatesLabel": "A 중복",
    "rightDuplicatesLabel": "B 중복"
  },
  "ru": {
    "summaryTitle": "Сводка сравнения",
    "setModeHint": "Результаты основаны на множествах. Повторы учитываются в сводке, но в вкладках выводятся только один раз.",
    "leftItemsLabel": "Элементы в A",
    "leftUniqueLabel": "Уникальные в A",
    "rightItemsLabel": "Элементы в B",
    "rightUniqueLabel": "Уникальные в B",
    "commonLabel": "Общие элементы",
    "leftOnlyLabel": "Только в A",
    "rightOnlyLabel": "Только в B",
    "leftDuplicatesLabel": "Дубликаты в A",
    "rightDuplicatesLabel": "Дубликаты в B"
  },
  "pt": {
    "summaryTitle": "Resumo da comparacao",
    "setModeHint": "Os resultados sao baseados em conjunto. Itens repetidos entram no resumo, mas cada valor aparece uma vez nas abas de resultado.",
    "leftItemsLabel": "Itens em A",
    "leftUniqueLabel": "Unicos em A",
    "rightItemsLabel": "Itens em B",
    "rightUniqueLabel": "Unicos em B",
    "commonLabel": "Itens em comum",
    "leftOnlyLabel": "So em A",
    "rightOnlyLabel": "So em B",
    "leftDuplicatesLabel": "Duplicados em A",
    "rightDuplicatesLabel": "Duplicados em B"
  },
  "ar": {
    "summaryTitle": "ملخص المقارنة",
    "setModeHint": "النتائج مبنية على المجموعات. العناصر المكررة تبقى في الملخص، لكن كل قيمة تظهر مرة واحدة فقط في تبويبات النتائج.",
    "leftItemsLabel": "عناصر A",
    "leftUniqueLabel": "الفريد في A",
    "rightItemsLabel": "عناصر B",
    "rightUniqueLabel": "الفريد في B",
    "commonLabel": "العناصر المشتركة",
    "leftOnlyLabel": "فقط في A",
    "rightOnlyLabel": "فقط في B",
    "leftDuplicatesLabel": "المكرر في A",
    "rightDuplicatesLabel": "المكرر في B"
  },
  "hi": {
    "summaryTitle": "तुलना सारांश",
    "setModeHint": "परिणाम सेट-आधारित हैं। डुप्लिकेट सारांश में गिने जाते हैं, लेकिन परिणाम टैब में हर मान केवल एक बार दिखता है।",
    "leftItemsLabel": "A में आइटम",
    "leftUniqueLabel": "A में अद्वितीय",
    "rightItemsLabel": "B में आइटम",
    "rightUniqueLabel": "B में अद्वितीय",
    "commonLabel": "समान आइटम",
    "leftOnlyLabel": "केवल A में",
    "rightOnlyLabel": "केवल B में",
    "leftDuplicatesLabel": "A में डुप्लिकेट",
    "rightDuplicatesLabel": "B में डुप्लिकेट"
  },
  "tr": {
    "summaryTitle": "Karsilastirma ozeti",
    "setModeHint": "Sonuclar kume temellidir. Tekrar eden ogeler ozette sayilir, ancak sonuc sekmelerinde her deger bir kez gorunur.",
    "leftItemsLabel": "A ogeleri",
    "leftUniqueLabel": "A'daki benzersizler",
    "rightItemsLabel": "B ogeleri",
    "rightUniqueLabel": "B'deki benzersizler",
    "commonLabel": "Ortak ogeler",
    "leftOnlyLabel": "Yalnizca A'da",
    "rightOnlyLabel": "Yalnizca B'de",
    "leftDuplicatesLabel": "A tekrarlar",
    "rightDuplicatesLabel": "B tekrarlar"
  },
  "nl": {
    "summaryTitle": "Vergelijkingsoverzicht",
    "setModeHint": "Resultaten zijn set-gebaseerd. Duplicaten tellen mee in het overzicht, maar elke waarde verschijnt slechts eenmaal in de resultattabs.",
    "leftItemsLabel": "Items in A",
    "leftUniqueLabel": "Uniek in A",
    "rightItemsLabel": "Items in B",
    "rightUniqueLabel": "Uniek in B",
    "commonLabel": "Gedeelde items",
    "leftOnlyLabel": "Alleen in A",
    "rightOnlyLabel": "Alleen in B",
    "leftDuplicatesLabel": "Duplicaten in A",
    "rightDuplicatesLabel": "Duplicaten in B"
  },
  "sv": {
    "summaryTitle": "Jamforelsesammanfattning",
    "setModeHint": "Resultaten ar mangdbaserade. Dubbletter raknas i sammanfattningen, men varje varde visas bara en gang i resultatflikarna.",
    "leftItemsLabel": "Poster i A",
    "leftUniqueLabel": "Unika i A",
    "rightItemsLabel": "Poster i B",
    "rightUniqueLabel": "Unika i B",
    "commonLabel": "Gemensamma poster",
    "leftOnlyLabel": "Endast i A",
    "rightOnlyLabel": "Endast i B",
    "leftDuplicatesLabel": "Dubbletter i A",
    "rightDuplicatesLabel": "Dubbletter i B"
  },
  "pl": {
    "summaryTitle": "Podsumowanie porownania",
    "setModeHint": "Wyniki sa oparte na zbiorach. Duplikaty pozostaja w podsumowaniu, ale w zakladkach wynikowych kazda wartosc pojawia sie tylko raz.",
    "leftItemsLabel": "Elementy w A",
    "leftUniqueLabel": "Unikalne w A",
    "rightItemsLabel": "Elementy w B",
    "rightUniqueLabel": "Unikalne w B",
    "commonLabel": "Wspolne elementy",
    "leftOnlyLabel": "Tylko w A",
    "rightOnlyLabel": "Tylko w B",
    "leftDuplicatesLabel": "Duplikaty w A",
    "rightDuplicatesLabel": "Duplikaty w B"
  },
  "vi": {
    "summaryTitle": "Tom tat so sanh",
    "setModeHint": "Ket qua duoc tinh theo tap hop. Muc trung lap van duoc tinh trong tom tat, nhung moi gia tri chi hien mot lan trong ket qua.",
    "leftItemsLabel": "Muc trong A",
    "leftUniqueLabel": "Duy nhat trong A",
    "rightItemsLabel": "Muc trong B",
    "rightUniqueLabel": "Duy nhat trong B",
    "commonLabel": "Muc chung",
    "leftOnlyLabel": "Chi trong A",
    "rightOnlyLabel": "Chi trong B",
    "leftDuplicatesLabel": "Trung lap trong A",
    "rightDuplicatesLabel": "Trung lap trong B"
  },
  "th": {
    "summaryTitle": "สรุปการเปรียบเทียบ",
    "setModeHint": "ผลลัพธ์ใช้แนวคิดแบบเซต รายการซ้ำยังนับในสรุป แต่ในแท็บผลลัพธ์แต่ละค่าจะแสดงเพียงครั้งเดียว",
    "leftItemsLabel": "รายการใน A",
    "leftUniqueLabel": "ไม่ซ้ำใน A",
    "rightItemsLabel": "รายการใน B",
    "rightUniqueLabel": "ไม่ซ้ำใน B",
    "commonLabel": "รายการที่ตรงกัน",
    "leftOnlyLabel": "มีเฉพาะใน A",
    "rightOnlyLabel": "มีเฉพาะใน B",
    "leftDuplicatesLabel": "รายการซ้ำใน A",
    "rightDuplicatesLabel": "รายการซ้ำใน B"
  },
  "id": {
    "summaryTitle": "Ringkasan perbandingan",
    "setModeHint": "Hasil memakai logika himpunan. Item duplikat tetap dihitung di ringkasan, tetapi setiap nilai hanya muncul sekali di tab hasil.",
    "leftItemsLabel": "Item di A",
    "leftUniqueLabel": "Unik di A",
    "rightItemsLabel": "Item di B",
    "rightUniqueLabel": "Unik di B",
    "commonLabel": "Item yang sama",
    "leftOnlyLabel": "Hanya di A",
    "rightOnlyLabel": "Hanya di B",
    "leftDuplicatesLabel": "Duplikat di A",
    "rightDuplicatesLabel": "Duplikat di B"
  },
  "he": {
    "summaryTitle": "סיכום השוואה",
    "setModeHint": "התוצאות מבוססות על קבוצות. כפילויות נספרות בסיכום, אך בכל לשונית תוצאה כל ערך מופיע פעם אחת בלבד.",
    "leftItemsLabel": "פריטים ב-A",
    "leftUniqueLabel": "ייחודיים ב-A",
    "rightItemsLabel": "פריטים ב-B",
    "rightUniqueLabel": "ייחודיים ב-B",
    "commonLabel": "פריטים משותפים",
    "leftOnlyLabel": "רק ב-A",
    "rightOnlyLabel": "רק ב-B",
    "leftDuplicatesLabel": "כפולים ב-A",
    "rightDuplicatesLabel": "כפולים ב-B"
  },
  "ms": {
    "summaryTitle": "Ringkasan perbandingan",
    "setModeHint": "Keputusan berasaskan set. Item pendua masih dikira dalam ringkasan, tetapi setiap nilai hanya muncul sekali dalam tab hasil.",
    "leftItemsLabel": "Item dalam A",
    "leftUniqueLabel": "Unik dalam A",
    "rightItemsLabel": "Item dalam B",
    "rightUniqueLabel": "Unik dalam B",
    "commonLabel": "Item sama",
    "leftOnlyLabel": "Hanya dalam A",
    "rightOnlyLabel": "Hanya dalam B",
    "leftDuplicatesLabel": "Pendua dalam A",
    "rightDuplicatesLabel": "Pendua dalam B"
  },
  "no": {
    "summaryTitle": "Sammendrag",
    "setModeHint": "Resultatene er mengdebaserte. Duplikater teller i sammendraget, men hver verdi vises bare en gang i resultatfanene.",
    "leftItemsLabel": "Elementer i A",
    "leftUniqueLabel": "Unike i A",
    "rightItemsLabel": "Elementer i B",
    "rightUniqueLabel": "Unike i B",
    "commonLabel": "Felles elementer",
    "leftOnlyLabel": "Bare i A",
    "rightOnlyLabel": "Bare i B",
    "leftDuplicatesLabel": "Duplikater i A",
    "rightDuplicatesLabel": "Duplikater i B"
  }
}
</i18n>
