<template>
  <ToolSectionHeader>{{ t('resultsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-empty v-if="!hasAnyInput" :description="t('emptyState')" />
      <template v-else>
        <n-flex justify="space-between" align="center" :wrap="true">
          <n-text>{{ t('activeCount', { count: activeCount }) }}</n-text>
          <n-flex :size="8">
            <CopyToClipboardButton :content="activeOutput" :disabled="activeCount === 0" />
            <n-button
              tag="a"
              text
              :disabled="activeCount === 0"
              :href="activeCount > 0 ? (downloadUrl ?? undefined) : undefined"
              :download="downloadName"
            >
              {{ t('download') }}
            </n-button>
          </n-flex>
        </n-flex>

        <n-tabs v-model:value="activeTab" type="segment" animated>
          <n-tab-pane
            name="common"
            :tab="t('commonTab', { count: comparison.commonItems.length })"
          />
          <n-tab-pane
            name="left-only"
            :tab="t('leftOnlyTab', { count: comparison.leftOnlyItems.length })"
          />
          <n-tab-pane
            name="right-only"
            :tab="t('rightOnlyTab', { count: comparison.rightOnlyItems.length })"
          />
          <n-tab-pane
            name="all-unique"
            :tab="t('allUniqueTab', { count: comparison.unionItems.length })"
          />
          <n-tab-pane
            name="left-duplicates"
            :tab="t('leftDuplicatesTab', { count: comparison.left.duplicateItems.length })"
          />
          <n-tab-pane
            name="right-duplicates"
            :tab="t('rightDuplicatesTab', { count: comparison.right.duplicateItems.length })"
          />
        </n-tabs>

        <n-input
          :value="activeOutput"
          type="textarea"
          readonly
          :autosize="{ minRows: 8, maxRows: 16 }"
        />
        <n-text v-if="activeCount === 0" depth="3">{{ t('noItems') }}</n-text>
      </template>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NEmpty, NFlex, NInput, NTabPane, NTabs, NText } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ListComparerTab, ListComparisonResult } from '../utils/listComparer'

defineProps<{
  comparison: ListComparisonResult
  hasAnyInput: boolean
  activeOutput: string
  activeCount: number
  downloadUrl?: string | null
  downloadName: string
}>()

const activeTab = defineModel<ListComparerTab>('activeTab', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "resultsTitle": "Result Sets",
    "emptyState": "Paste items into either list to see the comparison results.",
    "activeCount": "Active result: {count} rows",
    "download": "Download",
    "noItems": "No items in this result set.",
    "commonTab": "Common ({count})",
    "leftOnlyTab": "Only in A ({count})",
    "rightOnlyTab": "Only in B ({count})",
    "allUniqueTab": "All unique ({count})",
    "leftDuplicatesTab": "A duplicates ({count})",
    "rightDuplicatesTab": "B duplicates ({count})"
  },
  "zh": {
    "resultsTitle": "结果集合",
    "emptyState": "在任一列表中粘贴项目后即可查看比较结果。",
    "activeCount": "当前结果：{count} 行",
    "download": "下载",
    "noItems": "此结果集合中没有项目。",
    "commonTab": "共同项 ({count})",
    "leftOnlyTab": "仅在 A 中 ({count})",
    "rightOnlyTab": "仅在 B 中 ({count})",
    "allUniqueTab": "全部唯一值 ({count})",
    "leftDuplicatesTab": "A 重复项 ({count})",
    "rightDuplicatesTab": "B 重复项 ({count})"
  },
  "zh-CN": {
    "resultsTitle": "结果集合",
    "emptyState": "在任一列表中粘贴项目后即可查看比较结果。",
    "activeCount": "当前结果：{count} 行",
    "download": "下载",
    "noItems": "此结果集合中没有项目。",
    "commonTab": "共同项 ({count})",
    "leftOnlyTab": "仅在 A 中 ({count})",
    "rightOnlyTab": "仅在 B 中 ({count})",
    "allUniqueTab": "全部唯一值 ({count})",
    "leftDuplicatesTab": "A 重复项 ({count})",
    "rightDuplicatesTab": "B 重复项 ({count})"
  },
  "zh-TW": {
    "resultsTitle": "結果集合",
    "emptyState": "在任一列表中貼上項目後即可查看比較結果。",
    "activeCount": "目前結果：{count} 行",
    "download": "下載",
    "noItems": "此結果集合中沒有項目。",
    "commonTab": "共同項 ({count})",
    "leftOnlyTab": "僅在 A 中 ({count})",
    "rightOnlyTab": "僅在 B 中 ({count})",
    "allUniqueTab": "全部唯一值 ({count})",
    "leftDuplicatesTab": "A 重複項 ({count})",
    "rightDuplicatesTab": "B 重複項 ({count})"
  },
  "zh-HK": {
    "resultsTitle": "結果集合",
    "emptyState": "在任一列表中貼上項目後即可查看比較結果。",
    "activeCount": "目前結果：{count} 行",
    "download": "下載",
    "noItems": "此結果集合中沒有項目。",
    "commonTab": "共同項 ({count})",
    "leftOnlyTab": "僅在 A 中 ({count})",
    "rightOnlyTab": "僅在 B 中 ({count})",
    "allUniqueTab": "全部唯一值 ({count})",
    "leftDuplicatesTab": "A 重複項 ({count})",
    "rightDuplicatesTab": "B 重複項 ({count})"
  },
  "es": {
    "resultsTitle": "Conjuntos de resultados",
    "emptyState": "Pega elementos en cualquiera de las listas para ver los resultados.",
    "activeCount": "Resultado activo: {count} filas",
    "download": "Descargar",
    "noItems": "No hay elementos en este conjunto.",
    "commonTab": "Comunes ({count})",
    "leftOnlyTab": "Solo en A ({count})",
    "rightOnlyTab": "Solo en B ({count})",
    "allUniqueTab": "Todos los unicos ({count})",
    "leftDuplicatesTab": "Duplicados en A ({count})",
    "rightDuplicatesTab": "Duplicados en B ({count})"
  },
  "fr": {
    "resultsTitle": "Jeux de resultats",
    "emptyState": "Collez des elements dans l'une des listes pour voir les resultats.",
    "activeCount": "Resultat actif : {count} lignes",
    "download": "Telecharger",
    "noItems": "Aucun element dans ce resultat.",
    "commonTab": "Communs ({count})",
    "leftOnlyTab": "Seulement dans A ({count})",
    "rightOnlyTab": "Seulement dans B ({count})",
    "allUniqueTab": "Tous les uniques ({count})",
    "leftDuplicatesTab": "Doublons A ({count})",
    "rightDuplicatesTab": "Doublons B ({count})"
  },
  "de": {
    "resultsTitle": "Ergebnismengen",
    "emptyState": "Fugen Sie Elemente in eine der Listen ein, um Ergebnisse zu sehen.",
    "activeCount": "Aktives Ergebnis: {count} Zeilen",
    "download": "Herunterladen",
    "noItems": "Keine Eintrage in dieser Ergebnismenge.",
    "commonTab": "Gemeinsam ({count})",
    "leftOnlyTab": "Nur in A ({count})",
    "rightOnlyTab": "Nur in B ({count})",
    "allUniqueTab": "Alle eindeutigen ({count})",
    "leftDuplicatesTab": "A-Duplikate ({count})",
    "rightDuplicatesTab": "B-Duplikate ({count})"
  },
  "it": {
    "resultsTitle": "Set di risultati",
    "emptyState": "Incolla elementi in una delle liste per vedere i risultati.",
    "activeCount": "Risultato attivo: {count} righe",
    "download": "Scarica",
    "noItems": "Nessun elemento in questo set.",
    "commonTab": "Comuni ({count})",
    "leftOnlyTab": "Solo in A ({count})",
    "rightOnlyTab": "Solo in B ({count})",
    "allUniqueTab": "Tutti gli unici ({count})",
    "leftDuplicatesTab": "Duplicati A ({count})",
    "rightDuplicatesTab": "Duplicati B ({count})"
  },
  "ja": {
    "resultsTitle": "結果セット",
    "emptyState": "どちらかのリストに項目を貼り付けると比較結果が表示されます。",
    "activeCount": "現在の結果: {count} 行",
    "download": "ダウンロード",
    "noItems": "この結果セットには項目がありません。",
    "commonTab": "共通 ({count})",
    "leftOnlyTab": "A のみ ({count})",
    "rightOnlyTab": "B のみ ({count})",
    "allUniqueTab": "全ての一意値 ({count})",
    "leftDuplicatesTab": "A の重複 ({count})",
    "rightDuplicatesTab": "B の重複 ({count})"
  },
  "ko": {
    "resultsTitle": "결과 집합",
    "emptyState": "비교 결과를 보려면 어느 한쪽 목록에 항목을 붙여넣으세요.",
    "activeCount": "현재 결과: {count}행",
    "download": "다운로드",
    "noItems": "이 결과 집합에는 항목이 없습니다.",
    "commonTab": "공통 ({count})",
    "leftOnlyTab": "A에만 ({count})",
    "rightOnlyTab": "B에만 ({count})",
    "allUniqueTab": "모든 고유값 ({count})",
    "leftDuplicatesTab": "A 중복 ({count})",
    "rightDuplicatesTab": "B 중복 ({count})"
  },
  "ru": {
    "resultsTitle": "Наборы результатов",
    "emptyState": "Вставьте элементы в любой список, чтобы увидеть результаты сравнения.",
    "activeCount": "Активный результат: {count} строк",
    "download": "Скачать",
    "noItems": "В этом наборе нет элементов.",
    "commonTab": "Общие ({count})",
    "leftOnlyTab": "Только в A ({count})",
    "rightOnlyTab": "Только в B ({count})",
    "allUniqueTab": "Все уникальные ({count})",
    "leftDuplicatesTab": "Дубликаты A ({count})",
    "rightDuplicatesTab": "Дубликаты B ({count})"
  },
  "pt": {
    "resultsTitle": "Conjuntos de resultados",
    "emptyState": "Cole itens em qualquer lista para ver os resultados da comparacao.",
    "activeCount": "Resultado ativo: {count} linhas",
    "download": "Baixar",
    "noItems": "Nao ha itens neste conjunto.",
    "commonTab": "Em comum ({count})",
    "leftOnlyTab": "So em A ({count})",
    "rightOnlyTab": "So em B ({count})",
    "allUniqueTab": "Todos os unicos ({count})",
    "leftDuplicatesTab": "Duplicados A ({count})",
    "rightDuplicatesTab": "Duplicados B ({count})"
  },
  "ar": {
    "resultsTitle": "مجموعات النتائج",
    "emptyState": "الصق عناصر في أي قائمة لرؤية نتائج المقارنة.",
    "activeCount": "النتيجة الحالية: {count} صفوف",
    "download": "تنزيل",
    "noItems": "لا توجد عناصر في هذه المجموعة.",
    "commonTab": "المشترك ({count})",
    "leftOnlyTab": "فقط في A ({count})",
    "rightOnlyTab": "فقط في B ({count})",
    "allUniqueTab": "كل القيم الفريدة ({count})",
    "leftDuplicatesTab": "مكررات A ({count})",
    "rightDuplicatesTab": "مكررات B ({count})"
  },
  "hi": {
    "resultsTitle": "परिणाम सेट",
    "emptyState": "तुलना परिणाम देखने के लिए किसी भी सूची में आइटम पेस्ट करें।",
    "activeCount": "सक्रिय परिणाम: {count} पंक्तियां",
    "download": "डाउनलोड",
    "noItems": "इस परिणाम सेट में कोई आइटम नहीं है।",
    "commonTab": "समान ({count})",
    "leftOnlyTab": "केवल A में ({count})",
    "rightOnlyTab": "केवल B में ({count})",
    "allUniqueTab": "सभी अद्वितीय ({count})",
    "leftDuplicatesTab": "A डुप्लिकेट ({count})",
    "rightDuplicatesTab": "B डुप्लिकेट ({count})"
  },
  "tr": {
    "resultsTitle": "Sonuc kumeleri",
    "emptyState": "Karsilastirma sonuclarini gormek icin listelerden birine oge yapistirin.",
    "activeCount": "Etkin sonuc: {count} satir",
    "download": "Indir",
    "noItems": "Bu sonuc kumesinde oge yok.",
    "commonTab": "Ortak ({count})",
    "leftOnlyTab": "Yalnizca A ({count})",
    "rightOnlyTab": "Yalnizca B ({count})",
    "allUniqueTab": "Tum benzersizler ({count})",
    "leftDuplicatesTab": "A tekrarlar ({count})",
    "rightDuplicatesTab": "B tekrarlar ({count})"
  },
  "nl": {
    "resultsTitle": "Resultaatsets",
    "emptyState": "Plak items in een van de lijsten om de vergelijking te zien.",
    "activeCount": "Actief resultaat: {count} regels",
    "download": "Downloaden",
    "noItems": "Geen items in deze resultaatset.",
    "commonTab": "Gedeeld ({count})",
    "leftOnlyTab": "Alleen in A ({count})",
    "rightOnlyTab": "Alleen in B ({count})",
    "allUniqueTab": "Alle unieke ({count})",
    "leftDuplicatesTab": "A-duplicaten ({count})",
    "rightDuplicatesTab": "B-duplicaten ({count})"
  },
  "sv": {
    "resultsTitle": "Resultatuppsattningar",
    "emptyState": "Klistra in poster i en av listorna for att se resultaten.",
    "activeCount": "Aktivt resultat: {count} rader",
    "download": "Ladda ner",
    "noItems": "Inga poster i denna uppsattning.",
    "commonTab": "Gemensamma ({count})",
    "leftOnlyTab": "Endast i A ({count})",
    "rightOnlyTab": "Endast i B ({count})",
    "allUniqueTab": "Alla unika ({count})",
    "leftDuplicatesTab": "A-dubbletter ({count})",
    "rightDuplicatesTab": "B-dubbletter ({count})"
  },
  "pl": {
    "resultsTitle": "Zestawy wynikow",
    "emptyState": "Wklej elementy do dowolnej listy, aby zobaczyc wyniki porownania.",
    "activeCount": "Aktywny wynik: {count} wierszy",
    "download": "Pobierz",
    "noItems": "Brak elementow w tym zestawie.",
    "commonTab": "Wspolne ({count})",
    "leftOnlyTab": "Tylko w A ({count})",
    "rightOnlyTab": "Tylko w B ({count})",
    "allUniqueTab": "Wszystkie unikalne ({count})",
    "leftDuplicatesTab": "Duplikaty A ({count})",
    "rightDuplicatesTab": "Duplikaty B ({count})"
  },
  "vi": {
    "resultsTitle": "Tap ket qua",
    "emptyState": "Dan muc vao mot trong hai danh sach de xem ket qua so sanh.",
    "activeCount": "Ket qua hien tai: {count} dong",
    "download": "Tai xuong",
    "noItems": "Khong co muc nao trong tap ket qua nay.",
    "commonTab": "Chung ({count})",
    "leftOnlyTab": "Chi trong A ({count})",
    "rightOnlyTab": "Chi trong B ({count})",
    "allUniqueTab": "Tat ca duy nhat ({count})",
    "leftDuplicatesTab": "Trung lap A ({count})",
    "rightDuplicatesTab": "Trung lap B ({count})"
  },
  "th": {
    "resultsTitle": "ชุดผลลัพธ์",
    "emptyState": "วางข้อมูลในรายการใดก็ได้เพื่อดูผลการเปรียบเทียบ",
    "activeCount": "ผลลัพธ์ปัจจุบัน: {count} แถว",
    "download": "ดาวน์โหลด",
    "noItems": "ไม่มีรายการในชุดผลลัพธ์นี้",
    "commonTab": "ตรงกัน ({count})",
    "leftOnlyTab": "เฉพาะใน A ({count})",
    "rightOnlyTab": "เฉพาะใน B ({count})",
    "allUniqueTab": "ค่าที่ไม่ซ้ำทั้งหมด ({count})",
    "leftDuplicatesTab": "รายการซ้ำ A ({count})",
    "rightDuplicatesTab": "รายการซ้ำ B ({count})"
  },
  "id": {
    "resultsTitle": "Kumpulan hasil",
    "emptyState": "Tempel item ke salah satu daftar untuk melihat hasil perbandingan.",
    "activeCount": "Hasil aktif: {count} baris",
    "download": "Unduh",
    "noItems": "Tidak ada item di kumpulan hasil ini.",
    "commonTab": "Sama ({count})",
    "leftOnlyTab": "Hanya di A ({count})",
    "rightOnlyTab": "Hanya di B ({count})",
    "allUniqueTab": "Semua unik ({count})",
    "leftDuplicatesTab": "Duplikat A ({count})",
    "rightDuplicatesTab": "Duplikat B ({count})"
  },
  "he": {
    "resultsTitle": "קבוצות תוצאה",
    "emptyState": "הדבק פריטים באחת הרשימות כדי לראות את תוצאות ההשוואה.",
    "activeCount": "תוצאה פעילה: {count} שורות",
    "download": "הורד",
    "noItems": "אין פריטים בקבוצת תוצאה זו.",
    "commonTab": "משותפים ({count})",
    "leftOnlyTab": "רק ב-A ({count})",
    "rightOnlyTab": "רק ב-B ({count})",
    "allUniqueTab": "כל הייחודיים ({count})",
    "leftDuplicatesTab": "כפולים ב-A ({count})",
    "rightDuplicatesTab": "כפולים ב-B ({count})"
  },
  "ms": {
    "resultsTitle": "Set hasil",
    "emptyState": "Tampal item ke mana-mana senarai untuk melihat keputusan perbandingan.",
    "activeCount": "Hasil aktif: {count} baris",
    "download": "Muat turun",
    "noItems": "Tiada item dalam set hasil ini.",
    "commonTab": "Sama ({count})",
    "leftOnlyTab": "Hanya dalam A ({count})",
    "rightOnlyTab": "Hanya dalam B ({count})",
    "allUniqueTab": "Semua unik ({count})",
    "leftDuplicatesTab": "Pendua A ({count})",
    "rightDuplicatesTab": "Pendua B ({count})"
  },
  "no": {
    "resultsTitle": "Resultatsett",
    "emptyState": "Lim inn elementer i en av listene for a se sammenligningen.",
    "activeCount": "Aktivt resultat: {count} rader",
    "download": "Last ned",
    "noItems": "Ingen elementer i dette resultatsettet.",
    "commonTab": "Felles ({count})",
    "leftOnlyTab": "Bare i A ({count})",
    "rightOnlyTab": "Bare i B ({count})",
    "allUniqueTab": "Alle unike ({count})",
    "leftDuplicatesTab": "A-duplikater ({count})",
    "rightDuplicatesTab": "B-duplikater ({count})"
  }
}
</i18n>
