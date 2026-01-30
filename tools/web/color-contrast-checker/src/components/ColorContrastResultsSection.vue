<template>
  <ToolSectionHeader>{{ t('results-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-statistic :label="t('ratio-label')" :value="ratioLabel" data-testid="ratio-value" />
      <n-text v-if="!hasValidInputs" depth="3">{{ t('invalid-input') }}</n-text>
      <n-flex v-else wrap :size="8">
        <n-tag
          v-for="check in checks"
          :key="check.key"
          :type="check.pass ? 'success' : 'error'"
          :data-testid="`status-${check.key}`"
        >
          {{ labelMap[check.key] }}: {{ check.pass ? t('pass') : t('fail') }}
        </n-tag>
      </n-flex>
      <n-text depth="3">{{ t('alpha-note') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NStatistic, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

type ContrastCheck = {
  key: 'aa-normal' | 'aa-large' | 'aaa-normal' | 'aaa-large'
  pass: boolean
}

const props = defineProps<{
  ratio: number | null
  checks: ContrastCheck[]
  hasValidInputs: boolean
}>()

const { t } = useI18n()

const ratioLabel = computed(() => (props.ratio === null ? '--' : `${props.ratio.toFixed(2)}:1`))

const labelMap = computed(() => ({
  'aa-normal': t('aa-normal'),
  'aa-large': t('aa-large'),
  'aaa-normal': t('aaa-normal'),
  'aaa-large': t('aaa-large'),
}))
</script>

<i18n lang="json">
{
  "en": {
    "results-title": "Results",
    "ratio-label": "Contrast ratio",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (large)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (large)",
    "pass": "Pass",
    "fail": "Fail",
    "invalid-input": "Enter valid colors to see results.",
    "alpha-note": "Transparent colors are blended over white for contrast."
  },
  "zh": {
    "results-title": "结果",
    "ratio-label": "对比度",
    "aa-normal": "AA（普通）",
    "aa-large": "AA（大号）",
    "aaa-normal": "AAA（普通）",
    "aaa-large": "AAA（大号）",
    "pass": "通过",
    "fail": "未通过",
    "invalid-input": "请输入有效颜色以查看结果。",
    "alpha-note": "包含透明度的颜色会先与白色混合后计算对比度。"
  },
  "zh-CN": {
    "results-title": "结果",
    "ratio-label": "对比度",
    "aa-normal": "AA（普通）",
    "aa-large": "AA（大号）",
    "aaa-normal": "AAA（普通）",
    "aaa-large": "AAA（大号）",
    "pass": "通过",
    "fail": "未通过",
    "invalid-input": "请输入有效颜色以查看结果。",
    "alpha-note": "包含透明度的颜色会先与白色混合后计算对比度。"
  },
  "zh-TW": {
    "results-title": "結果",
    "ratio-label": "對比度",
    "aa-normal": "AA（一般）",
    "aa-large": "AA（大字體）",
    "aaa-normal": "AAA（一般）",
    "aaa-large": "AAA（大字體）",
    "pass": "通過",
    "fail": "未通過",
    "invalid-input": "請輸入有效顏色以查看結果。",
    "alpha-note": "含透明度的顏色會先與白色混合後計算對比度。"
  },
  "zh-HK": {
    "results-title": "結果",
    "ratio-label": "對比度",
    "aa-normal": "AA（一般）",
    "aa-large": "AA（大字體）",
    "aaa-normal": "AAA（一般）",
    "aaa-large": "AAA（大字體）",
    "pass": "通過",
    "fail": "未通過",
    "invalid-input": "請輸入有效顏色以查看結果。",
    "alpha-note": "含透明度的顏色會先與白色混合後計算對比度。"
  },
  "es": {
    "results-title": "Resultados",
    "ratio-label": "Relación de contraste",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (grande)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (grande)",
    "pass": "Aprobado",
    "fail": "No aprobado",
    "invalid-input": "Introduce colores válidos para ver resultados.",
    "alpha-note": "Los colores transparentes se mezclan con blanco para el contraste."
  },
  "fr": {
    "results-title": "Résultats",
    "ratio-label": "Rapport de contraste",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (grand)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (grand)",
    "pass": "Réussi",
    "fail": "Échoué",
    "invalid-input": "Saisissez des couleurs valides pour voir les résultats.",
    "alpha-note": "Les couleurs transparentes sont mélangées avec du blanc pour le contraste."
  },
  "de": {
    "results-title": "Ergebnisse",
    "ratio-label": "Kontrastverhältnis",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (groß)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (groß)",
    "pass": "Bestanden",
    "fail": "Nicht bestanden",
    "invalid-input": "Gib gültige Farben ein, um Ergebnisse zu sehen.",
    "alpha-note": "Transparente Farben werden für den Kontrast über Weiß gemischt."
  },
  "it": {
    "results-title": "Risultati",
    "ratio-label": "Rapporto di contrasto",
    "aa-normal": "AA (normale)",
    "aa-large": "AA (grande)",
    "aaa-normal": "AAA (normale)",
    "aaa-large": "AAA (grande)",
    "pass": "Superato",
    "fail": "Non superato",
    "invalid-input": "Inserisci colori validi per vedere i risultati.",
    "alpha-note": "I colori trasparenti vengono miscelati con il bianco per il contrasto."
  },
  "ja": {
    "results-title": "結果",
    "ratio-label": "コントラスト比",
    "aa-normal": "AA（通常）",
    "aa-large": "AA（大きい）",
    "aaa-normal": "AAA（通常）",
    "aaa-large": "AAA（大きい）",
    "pass": "合格",
    "fail": "不合格",
    "invalid-input": "有効な色を入力すると結果が表示されます。",
    "alpha-note": "透明な色は白と合成してコントラストを計算します。"
  },
  "ko": {
    "results-title": "결과",
    "ratio-label": "대비 비율",
    "aa-normal": "AA (일반)",
    "aa-large": "AA (큰 글자)",
    "aaa-normal": "AAA (일반)",
    "aaa-large": "AAA (큰 글자)",
    "pass": "통과",
    "fail": "실패",
    "invalid-input": "유효한 색상을 입력하면 결과가 표시됩니다.",
    "alpha-note": "투명 색상은 흰색과 합성해 대비를 계산합니다."
  },
  "ru": {
    "results-title": "Результаты",
    "ratio-label": "Контраст",
    "aa-normal": "AA (обычный)",
    "aa-large": "AA (крупный)",
    "aaa-normal": "AAA (обычный)",
    "aaa-large": "AAA (крупный)",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "invalid-input": "Введите корректные цвета, чтобы увидеть результаты.",
    "alpha-note": "Прозрачные цвета смешиваются с белым для контраста."
  },
  "pt": {
    "results-title": "Resultados",
    "ratio-label": "Razão de contraste",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (grande)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (grande)",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "invalid-input": "Digite cores válidas para ver os resultados.",
    "alpha-note": "Cores transparentes são mescladas com branco para o contraste."
  },
  "ar": {
    "results-title": "النتائج",
    "ratio-label": "نسبة التباين",
    "aa-normal": "AA (عادي)",
    "aa-large": "AA (كبير)",
    "aaa-normal": "AAA (عادي)",
    "aaa-large": "AAA (كبير)",
    "pass": "ناجح",
    "fail": "غير ناجح",
    "invalid-input": "أدخل ألوانًا صالحة لعرض النتائج.",
    "alpha-note": "يتم مزج الألوان الشفافة مع الأبيض لحساب التباين."
  },
  "hi": {
    "results-title": "परिणाम",
    "ratio-label": "कंट्रास्ट अनुपात",
    "aa-normal": "AA (सामान्य)",
    "aa-large": "AA (बड़ा)",
    "aaa-normal": "AAA (सामान्य)",
    "aaa-large": "AAA (बड़ा)",
    "pass": "पास",
    "fail": "फेल",
    "invalid-input": "परिणाम देखने के लिए मान्य रंग दर्ज करें।",
    "alpha-note": "पारदर्शी रंगों को कंट्रास्ट के लिए सफेद पर मिलाया जाता है।"
  },
  "tr": {
    "results-title": "Sonuçlar",
    "ratio-label": "Kontrast oranı",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (büyük)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (büyük)",
    "pass": "Geçti",
    "fail": "Geçmedi",
    "invalid-input": "Sonuçları görmek için geçerli renkler girin.",
    "alpha-note": "Saydam renkler kontrast için beyazla karıştırılır."
  },
  "nl": {
    "results-title": "Resultaten",
    "ratio-label": "Contrastverhouding",
    "aa-normal": "AA (normaal)",
    "aa-large": "AA (groot)",
    "aaa-normal": "AAA (normaal)",
    "aaa-large": "AAA (groot)",
    "pass": "Geslaagd",
    "fail": "Niet geslaagd",
    "invalid-input": "Voer geldige kleuren in om resultaten te zien.",
    "alpha-note": "Transparante kleuren worden voor contrast met wit gemengd."
  },
  "sv": {
    "results-title": "Resultat",
    "ratio-label": "Kontrastförhållande",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (stor)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (stor)",
    "pass": "Godkänd",
    "fail": "Underkänd",
    "invalid-input": "Ange giltiga färger för att se resultat.",
    "alpha-note": "Transparenta färger blandas med vitt för kontrast."
  },
  "pl": {
    "results-title": "Wyniki",
    "ratio-label": "Współczynnik kontrastu",
    "aa-normal": "AA (normalny)",
    "aa-large": "AA (duży)",
    "aaa-normal": "AAA (normalny)",
    "aaa-large": "AAA (duży)",
    "pass": "Zaliczony",
    "fail": "Nie zaliczony",
    "invalid-input": "Wprowadź poprawne kolory, aby zobaczyć wyniki.",
    "alpha-note": "Przezroczyste kolory są mieszane z bielą dla kontrastu."
  },
  "vi": {
    "results-title": "Kết quả",
    "ratio-label": "Tỷ lệ tương phản",
    "aa-normal": "AA (thường)",
    "aa-large": "AA (lớn)",
    "aaa-normal": "AAA (thường)",
    "aaa-large": "AAA (lớn)",
    "pass": "Đạt",
    "fail": "Không đạt",
    "invalid-input": "Nhập màu hợp lệ để xem kết quả.",
    "alpha-note": "Màu trong suốt được trộn với trắng để tính tương phản."
  },
  "th": {
    "results-title": "ผลลัพธ์",
    "ratio-label": "อัตราส่วนความต่างสี",
    "aa-normal": "AA (ปกติ)",
    "aa-large": "AA (ใหญ่)",
    "aaa-normal": "AAA (ปกติ)",
    "aaa-large": "AAA (ใหญ่)",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "invalid-input": "กรอกสีที่ถูกต้องเพื่อดูผลลัพธ์",
    "alpha-note": "สีที่โปร่งใสจะถูกผสมกับสีขาวเพื่อคำนวณความต่างสี"
  },
  "id": {
    "results-title": "Hasil",
    "ratio-label": "Rasio kontras",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (besar)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (besar)",
    "pass": "Lulus",
    "fail": "Tidak lulus",
    "invalid-input": "Masukkan warna valid untuk melihat hasil.",
    "alpha-note": "Warna transparan dicampur dengan putih untuk kontras."
  },
  "he": {
    "results-title": "תוצאות",
    "ratio-label": "יחס ניגודיות",
    "aa-normal": "AA (רגיל)",
    "aa-large": "AA (גדול)",
    "aaa-normal": "AAA (רגיל)",
    "aaa-large": "AAA (גדול)",
    "pass": "עבר",
    "fail": "נכשל",
    "invalid-input": "הזן צבעים תקינים כדי לראות תוצאות.",
    "alpha-note": "צבעים שקופים מתמזגים עם לבן לצורך הניגודיות."
  },
  "ms": {
    "results-title": "Keputusan",
    "ratio-label": "Nisbah kontras",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (besar)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (besar)",
    "pass": "Lulus",
    "fail": "Gagal",
    "invalid-input": "Masukkan warna yang sah untuk melihat keputusan.",
    "alpha-note": "Warna lutsinar dicampur dengan putih untuk kontras."
  },
  "no": {
    "results-title": "Resultater",
    "ratio-label": "Kontrastforhold",
    "aa-normal": "AA (normal)",
    "aa-large": "AA (stor)",
    "aaa-normal": "AAA (normal)",
    "aaa-large": "AAA (stor)",
    "pass": "Bestått",
    "fail": "Ikke bestått",
    "invalid-input": "Skriv inn gyldige farger for å se resultater.",
    "alpha-note": "Gjennomsiktige farger blandes med hvitt for kontrast."
  }
}
</i18n>
