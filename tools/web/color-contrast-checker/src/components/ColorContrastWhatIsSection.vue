<template>
  <ToolSectionHeader>{{ t('what-is-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text>{{ t('what-is-definition') }}</n-text>
      <n-text>{{ t('what-is-method') }}</n-text>
      <div class="what-is-thresholds">
        <div class="what-is-subtitle">{{ t('what-is-thresholds-title') }}</div>
        <ul class="what-is-list">
          <li>{{ t('what-is-thresholds-aa') }}</li>
          <li>{{ t('what-is-thresholds-aaa') }}</li>
          <li>{{ t('what-is-thresholds-large') }}</li>
          <li>{{ t('what-is-thresholds-ui') }}</li>
        </ul>
      </div>
      <n-text depth="3">{{ t('what-is-tip') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<style scoped>
.what-is-subtitle {
  font-size: 13px;
  font-weight: 600;
}

.what-is-list {
  margin: 6px 0 0;
  padding-left: 18px;
}

.what-is-list li {
  margin: 4px 0;
}
</style>

<i18n lang="json">
{
  "en": {
    "what-is-title": "What is color contrast?",
    "what-is-definition": "Contrast ratio measures the difference in luminance between text (foreground) and its background on a scale from 1:1 (no contrast) to 21:1 (black on white).",
    "what-is-method": "This tool converts colors to sRGB, blends transparency before comparing colors, and uses the WCAG relative luminance formula.",
    "what-is-thresholds-title": "WCAG thresholds",
    "what-is-thresholds-aa": "AA: 4.5:1 for normal text, 3:1 for large text.",
    "what-is-thresholds-aaa": "AAA: 7:1 for normal text, 4.5:1 for large text.",
    "what-is-thresholds-large": "Large text is 18pt+ regular or 14pt+ bold.",
    "what-is-thresholds-ui": "UI components, icons, and graphical objects should aim for at least 3:1.",
    "what-is-tip": "Higher ratios improve readability, especially for thin fonts or small sizes."
  },
  "zh": {
    "what-is-title": "什么是颜色对比度？",
    "what-is-definition": "对比度比值衡量文本（前景）与背景之间的亮度差异，范围从 1:1（无对比）到 21:1（黑字白底）。",
    "what-is-method": "本工具会将颜色转换为 sRGB，先处理透明度混合，再按 WCAG 相对亮度公式计算。",
    "what-is-thresholds-title": "WCAG 阈值",
    "what-is-thresholds-aa": "AA：普通文本 4.5:1，大号文本 3:1。",
    "what-is-thresholds-aaa": "AAA：普通文本 7:1，大号文本 4.5:1。",
    "what-is-thresholds-large": "大号文本指 18pt+ 常规或 14pt+ 加粗。",
    "what-is-thresholds-ui": "UI 组件、图标和图形对象建议至少 3:1。",
    "what-is-tip": "更高的对比度更易读，尤其是细字重或小字号。"
  },
  "zh-CN": {
    "what-is-title": "什么是颜色对比度？",
    "what-is-definition": "对比度比值衡量文本（前景）与背景之间的亮度差异，范围从 1:1（无对比）到 21:1（黑字白底）。",
    "what-is-method": "本工具会将颜色转换为 sRGB，先处理透明度混合，再按 WCAG 相对亮度公式计算。",
    "what-is-thresholds-title": "WCAG 阈值",
    "what-is-thresholds-aa": "AA：普通文本 4.5:1，大号文本 3:1。",
    "what-is-thresholds-aaa": "AAA：普通文本 7:1，大号文本 4.5:1。",
    "what-is-thresholds-large": "大号文本指 18pt+ 常规或 14pt+ 加粗。",
    "what-is-thresholds-ui": "UI 组件、图标和图形对象建议至少 3:1。",
    "what-is-tip": "更高的对比度更易读，尤其是细字重或小字号。"
  },
  "zh-TW": {
    "what-is-title": "什麼是顏色對比度？",
    "what-is-definition": "對比度比值衡量文字（前景）與背景之間的亮度差異，範圍從 1:1（無對比）到 21:1（黑字白底）。",
    "what-is-method": "本工具會將顏色轉換為 sRGB，先處理透明度混合，再依 WCAG 相對亮度公式計算。",
    "what-is-thresholds-title": "WCAG 閾值",
    "what-is-thresholds-aa": "AA：一般文字 4.5:1，大字體 3:1。",
    "what-is-thresholds-aaa": "AAA：一般文字 7:1，大字體 4.5:1。",
    "what-is-thresholds-large": "大字體指 18pt+ 一般或 14pt+ 粗體。",
    "what-is-thresholds-ui": "UI 元件、圖示與圖形物件建議至少 3:1。",
    "what-is-tip": "較高的對比度更易讀，特別是細字重或小字體。"
  },
  "zh-HK": {
    "what-is-title": "什麼是顏色對比度？",
    "what-is-definition": "對比度比值衡量文字（前景）與背景之間的亮度差異，範圍從 1:1（無對比）到 21:1（黑字白底）。",
    "what-is-method": "本工具會將顏色轉換為 sRGB，先處理透明度混合，再依 WCAG 相對亮度公式計算。",
    "what-is-thresholds-title": "WCAG 閾值",
    "what-is-thresholds-aa": "AA：一般文字 4.5:1，大字體 3:1。",
    "what-is-thresholds-aaa": "AAA：一般文字 7:1，大字體 4.5:1。",
    "what-is-thresholds-large": "大字體指 18pt+ 一般或 14pt+ 粗體。",
    "what-is-thresholds-ui": "UI 元件、圖示與圖形物件建議至少 3:1。",
    "what-is-tip": "較高的對比度更易讀，特別是細字重或小字體。"
  },
  "es": {
    "what-is-title": "¿Qué es el contraste de color?",
    "what-is-definition": "La relación de contraste mide la diferencia de luminancia entre el texto (primer plano) y el fondo en una escala de 1:1 (sin contraste) a 21:1 (negro sobre blanco).",
    "what-is-method": "Esta herramienta convierte los colores a sRGB, mezcla la transparencia antes de comparar y usa la fórmula de luminancia relativa de la WCAG.",
    "what-is-thresholds-title": "Umbrales WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 para texto normal, 3:1 para texto grande.",
    "what-is-thresholds-aaa": "AAA: 7:1 para texto normal, 4.5:1 para texto grande.",
    "what-is-thresholds-large": "Texto grande es 18pt+ regular o 14pt+ en negrita.",
    "what-is-thresholds-ui": "Componentes de UI, iconos y gráficos deberían aspirar al menos a 3:1.",
    "what-is-tip": "Ratios más altos mejoran la legibilidad, especialmente con tipografías finas o tamaños pequeños."
  },
  "fr": {
    "what-is-title": "Qu'est-ce que le contraste de couleur ?",
    "what-is-definition": "Le ratio de contraste mesure la différence de luminance entre le texte (premier plan) et le fond sur une échelle de 1:1 (aucun contraste) à 21:1 (noir sur blanc).",
    "what-is-method": "Cet outil convertit les couleurs en sRGB, compose la transparence avant la comparaison et utilise la formule de luminance relative WCAG.",
    "what-is-thresholds-title": "Seuils WCAG",
    "what-is-thresholds-aa": "AA : 4.5:1 pour le texte normal, 3:1 pour le texte large.",
    "what-is-thresholds-aaa": "AAA : 7:1 pour le texte normal, 4.5:1 pour le texte large.",
    "what-is-thresholds-large": "Le texte large correspond à 18pt+ normal ou 14pt+ gras.",
    "what-is-thresholds-ui": "Les composants d'UI, icônes et éléments graphiques devraient viser au moins 3:1.",
    "what-is-tip": "Des ratios plus élevés améliorent la lisibilité, surtout pour les polices fines ou les petites tailles."
  },
  "de": {
    "what-is-title": "Was ist Farbkontrast?",
    "what-is-definition": "Das Kontrastverhältnis misst den Luminanzunterschied zwischen Text (Vordergrund) und Hintergrund auf einer Skala von 1:1 (kein Kontrast) bis 21:1 (Schwarz auf Weiß).",
    "what-is-method": "Dieses Tool konvertiert Farben in sRGB, mischt Transparenz vor dem Vergleich und verwendet die WCAG-Formel für relative Luminanz.",
    "what-is-thresholds-title": "WCAG-Grenzwerte",
    "what-is-thresholds-aa": "AA: 4.5:1 für normalen Text, 3:1 für großen Text.",
    "what-is-thresholds-aaa": "AAA: 7:1 für normalen Text, 4.5:1 für großen Text.",
    "what-is-thresholds-large": "Großer Text bedeutet 18pt+ normal oder 14pt+ fett.",
    "what-is-thresholds-ui": "UI-Komponenten, Icons und grafische Elemente sollten mindestens 3:1 erreichen.",
    "what-is-tip": "Höhere Verhältnisse verbessern die Lesbarkeit, besonders bei dünnen Schriftarten oder kleinen Größen."
  },
  "it": {
    "what-is-title": "Che cos'è il contrasto di colore?",
    "what-is-definition": "Il rapporto di contrasto misura la differenza di luminanza tra il testo (primo piano) e lo sfondo su una scala da 1:1 (nessun contrasto) a 21:1 (nero su bianco).",
    "what-is-method": "Questo strumento converte i colori in sRGB, fonde la trasparenza prima del confronto e usa la formula di luminanza relativa WCAG.",
    "what-is-thresholds-title": "Soglie WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 per testo normale, 3:1 per testo grande.",
    "what-is-thresholds-aaa": "AAA: 7:1 per testo normale, 4.5:1 per testo grande.",
    "what-is-thresholds-large": "Testo grande: 18pt+ normale o 14pt+ in grassetto.",
    "what-is-thresholds-ui": "Componenti UI, icone e grafica dovrebbero puntare ad almeno 3:1.",
    "what-is-tip": "Rapporti più alti migliorano la leggibilità, soprattutto con font sottili o dimensioni piccole."
  },
  "ja": {
    "what-is-title": "色のコントラストとは？",
    "what-is-definition": "コントラスト比は、文字（前景）と背景の輝度差を 1:1（差なし）〜 21:1（黒と白）で表します。",
    "what-is-method": "このツールは色を sRGB に変換し、透明度を合成してから WCAG の相対輝度式で計算します。",
    "what-is-thresholds-title": "WCAG の基準",
    "what-is-thresholds-aa": "AA：通常文字は 4.5:1、大きな文字は 3:1。",
    "what-is-thresholds-aaa": "AAA：通常文字は 7:1、大きな文字は 4.5:1。",
    "what-is-thresholds-large": "大きな文字は 18pt 以上、または 14pt 以上の太字。",
    "what-is-thresholds-ui": "UI コンポーネント、アイコン、図形は少なくとも 3:1 を推奨。",
    "what-is-tip": "高い比率ほど読みやすく、細いフォントや小さなサイズで特に有効です。"
  },
  "ko": {
    "what-is-title": "색상 대비란?",
    "what-is-definition": "대비 비율은 텍스트(전경)와 배경의 휘도 차이를 1:1(대비 없음)부터 21:1(흰 배경의 검정)까지로 표현합니다.",
    "what-is-method": "이 도구는 색상을 sRGB로 변환하고 투명도를 합성한 뒤 WCAG 상대 휘도 공식을 사용합니다.",
    "what-is-thresholds-title": "WCAG 기준",
    "what-is-thresholds-aa": "AA: 일반 텍스트 4.5:1, 큰 텍스트 3:1.",
    "what-is-thresholds-aaa": "AAA: 일반 텍스트 7:1, 큰 텍스트 4.5:1.",
    "what-is-thresholds-large": "큰 텍스트는 18pt 이상 또는 14pt 이상 굵게.",
    "what-is-thresholds-ui": "UI 구성요소, 아이콘, 그래픽은 최소 3:1을 권장합니다.",
    "what-is-tip": "비율이 높을수록 읽기 쉽고, 얇은 글꼴이나 작은 크기에서 특히 효과적입니다."
  },
  "ru": {
    "what-is-title": "Что такое цветовой контраст?",
    "what-is-definition": "Контрастное соотношение измеряет разницу яркости между текстом (передний план) и фоном по шкале от 1:1 (нет контраста) до 21:1 (черный на белом).",
    "what-is-method": "Этот инструмент преобразует цвета в sRGB, смешивает прозрачность перед сравнением и использует формулу относительной яркости WCAG.",
    "what-is-thresholds-title": "Пороги WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 для обычного текста, 3:1 для крупного текста.",
    "what-is-thresholds-aaa": "AAA: 7:1 для обычного текста, 4.5:1 для крупного текста.",
    "what-is-thresholds-large": "Крупный текст - это 18pt+ обычный или 14pt+ жирный.",
    "what-is-thresholds-ui": "Элементы UI, иконки и графика должны стремиться минимум к 3:1.",
    "what-is-tip": "Более высокие значения улучшают читаемость, особенно при тонких шрифтах или малых размерах."
  },
  "pt": {
    "what-is-title": "O que é contraste de cor?",
    "what-is-definition": "A razão de contraste mede a diferença de luminância entre o texto (primeiro plano) e o fundo numa escala de 1:1 (sem contraste) a 21:1 (preto no branco).",
    "what-is-method": "Esta ferramenta converte as cores para sRGB, mistura a transparência antes de comparar e usa a fórmula de luminância relativa da WCAG.",
    "what-is-thresholds-title": "Limiares WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 para texto normal, 3:1 para texto grande.",
    "what-is-thresholds-aaa": "AAA: 7:1 para texto normal, 4.5:1 para texto grande.",
    "what-is-thresholds-large": "Texto grande é 18pt+ normal ou 14pt+ em negrito.",
    "what-is-thresholds-ui": "Componentes de UI, ícones e gráficos devem visar pelo menos 3:1.",
    "what-is-tip": "Rácios mais altos melhoram a legibilidade, especialmente com fontes finas ou tamanhos pequenos."
  },
  "ar": {
    "what-is-title": "ما هو تباين الألوان؟",
    "what-is-definition": "تقيس نسبة التباين الفرق في الإضاءة بين النص (المقدمة) والخلفية على مقياس من 1:1 (بدون تباين) إلى 21:1 (أسود على أبيض).",
    "what-is-method": "تحوّل هذه الأداة الألوان إلى sRGB وتمزج الشفافية قبل المقارنة وتستخدم معادلة اللمعان النسبي وفق WCAG.",
    "what-is-thresholds-title": "عتبات WCAG",
    "what-is-thresholds-aa": "AA:‏ 4.5:1 للنص العادي، و3:1 للنص الكبير.",
    "what-is-thresholds-aaa": "AAA:‏ 7:1 للنص العادي، و4.5:1 للنص الكبير.",
    "what-is-thresholds-large": "النص الكبير هو 18pt+ عادي أو 14pt+ عريض.",
    "what-is-thresholds-ui": "عناصر واجهة المستخدم والأيقونات والعناصر الرسومية يُفضّل ألا تقل عن 3:1.",
    "what-is-tip": "النِّسَب الأعلى تحسّن القراءة، خاصة مع الخطوط الرفيعة أو الأحجام الصغيرة."
  },
  "hi": {
    "what-is-title": "रंग कंट्रास्ट क्या है?",
    "what-is-definition": "कंट्रास्ट अनुपात टेक्स्ट (फोरग्राउंड) और बैकग्राउंड के बीच चमक के अंतर को 1:1 (कोई कंट्रास्ट नहीं) से 21:1 (काला-सफेद) तक मापता है।",
    "what-is-method": "यह टूल रंगों को sRGB में बदलता है, तुलना से पहले पारदर्शिता मिलाता है और WCAG का रिलेटिव ल्यूमिनेंस फॉर्मूला उपयोग करता है।",
    "what-is-thresholds-title": "WCAG सीमाएँ",
    "what-is-thresholds-aa": "AA: सामान्य टेक्स्ट 4.5:1, बड़े टेक्स्ट 3:1.",
    "what-is-thresholds-aaa": "AAA: सामान्य टेक्स्ट 7:1, बड़े टेक्स्ट 4.5:1.",
    "what-is-thresholds-large": "बड़ा टेक्स्ट 18pt+ सामान्य या 14pt+ बोल्ड है।",
    "what-is-thresholds-ui": "UI घटक, आइकन और ग्राफिक्स को कम से कम 3:1 लक्ष्य रखना चाहिए।",
    "what-is-tip": "उच्च अनुपात पठनीयता बढ़ाते हैं, खासकर पतले फॉन्ट या छोटे आकार में।"
  },
  "tr": {
    "what-is-title": "Renk kontrastı nedir?",
    "what-is-definition": "Kontrast oranı, metin (ön plan) ile arka plan arasındaki parlaklık farkını 1:1 (kontrast yok) ile 21:1 (siyah üzerinde beyaz) arasında ölçer.",
    "what-is-method": "Bu araç renkleri sRGB'ye dönüştürür, karşılaştırmadan önce şeffaflığı harmanlar ve WCAG göreli parlaklık formülünü kullanır.",
    "what-is-thresholds-title": "WCAG eşikleri",
    "what-is-thresholds-aa": "AA: normal metin 4.5:1, büyük metin 3:1.",
    "what-is-thresholds-aaa": "AAA: normal metin 7:1, büyük metin 4.5:1.",
    "what-is-thresholds-large": "Büyük metin 18pt+ normal veya 14pt+ kalındır.",
    "what-is-thresholds-ui": "UI bileşenleri, simgeler ve grafikler en az 3:1 hedeflemelidir.",
    "what-is-tip": "Daha yüksek oranlar okunabilirliği artırır, özellikle ince yazı tiplerinde veya küçük boyutlarda."
  },
  "nl": {
    "what-is-title": "Wat is kleurcontrast?",
    "what-is-definition": "De contrastverhouding meet het luminantieverschil tussen tekst (voorgrond) en achtergrond op een schaal van 1:1 (geen contrast) tot 21:1 (zwart op wit).",
    "what-is-method": "Deze tool zet kleuren om naar sRGB, mengt transparantie vóór de vergelijking en gebruikt de WCAG-formule voor relatieve luminantie.",
    "what-is-thresholds-title": "WCAG-drempels",
    "what-is-thresholds-aa": "AA: 4.5:1 voor normale tekst, 3:1 voor grote tekst.",
    "what-is-thresholds-aaa": "AAA: 7:1 voor normale tekst, 4.5:1 voor grote tekst.",
    "what-is-thresholds-large": "Grote tekst is 18pt+ normaal of 14pt+ vet.",
    "what-is-thresholds-ui": "UI-componenten, pictogrammen en grafische elementen moeten minimaal 3:1 nastreven.",
    "what-is-tip": "Hogere verhoudingen verbeteren de leesbaarheid, vooral bij dunne lettertypes of kleine formaten."
  },
  "sv": {
    "what-is-title": "Vad är färgkontrast?",
    "what-is-definition": "Kontrastförhållandet mäter luminansskillnaden mellan text (förgrund) och bakgrund på en skala från 1:1 (ingen kontrast) till 21:1 (svart på vitt).",
    "what-is-method": "Det här verktyget konverterar färger till sRGB, blandar transparens innan jämförelse och använder WCAG:s relativa luminansformel.",
    "what-is-thresholds-title": "WCAG-gränser",
    "what-is-thresholds-aa": "AA: 4.5:1 för normal text, 3:1 för stor text.",
    "what-is-thresholds-aaa": "AAA: 7:1 för normal text, 4.5:1 för stor text.",
    "what-is-thresholds-large": "Stor text är 18pt+ normal eller 14pt+ fet.",
    "what-is-thresholds-ui": "UI-komponenter, ikoner och grafik bör sikta på minst 3:1.",
    "what-is-tip": "Högre värden förbättrar läsbarheten, särskilt med tunna typsnitt eller små storlekar."
  },
  "pl": {
    "what-is-title": "Czym jest kontrast kolorów?",
    "what-is-definition": "Współczynnik kontrastu mierzy różnicę luminancji między tekstem (pierwszy plan) a tłem w skali od 1:1 (brak kontrastu) do 21:1 (czerń na bieli).",
    "what-is-method": "To narzędzie konwertuje kolory do sRGB, miesza przezroczystość przed porównaniem i używa wzoru względnej luminancji WCAG.",
    "what-is-thresholds-title": "Progi WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 dla zwykłego tekstu, 3:1 dla dużego tekstu.",
    "what-is-thresholds-aaa": "AAA: 7:1 dla zwykłego tekstu, 4.5:1 dla dużego tekstu.",
    "what-is-thresholds-large": "Duży tekst to 18pt+ zwykły lub 14pt+ pogrubiony.",
    "what-is-thresholds-ui": "Elementy UI, ikony i grafika powinny dążyć do co najmniej 3:1.",
    "what-is-tip": "Wyższe wartości poprawiają czytelność, szczególnie przy cienkich fontach lub małych rozmiarach."
  },
  "vi": {
    "what-is-title": "Độ tương phản màu là gì?",
    "what-is-definition": "Tỷ lệ tương phản đo sự chênh lệch độ chói giữa chữ (tiền cảnh) và nền trên thang từ 1:1 (không tương phản) đến 21:1 (đen trên trắng).",
    "what-is-method": "Công cụ này chuyển màu sang sRGB, trộn độ trong suốt trước khi so sánh và dùng công thức độ chói tương đối theo WCAG.",
    "what-is-thresholds-title": "Ngưỡng WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 cho chữ thường, 3:1 cho chữ lớn.",
    "what-is-thresholds-aaa": "AAA: 7:1 cho chữ thường, 4.5:1 cho chữ lớn.",
    "what-is-thresholds-large": "Chữ lớn là 18pt+ thường hoặc 14pt+ đậm.",
    "what-is-thresholds-ui": "Thành phần UI, biểu tượng và đồ họa nên đạt ít nhất 3:1.",
    "what-is-tip": "Tỷ lệ cao hơn giúp dễ đọc hơn, nhất là với font mảnh hoặc cỡ nhỏ."
  },
  "th": {
    "what-is-title": "ความเปรียบต่างของสีคืออะไร?",
    "what-is-definition": "อัตราส่วนความเปรียบต่างวัดความแตกต่างของความสว่างระหว่างข้อความ (พื้นหน้า) กับพื้นหลัง ในช่วง 1:1 (ไม่มีความเปรียบต่าง) ถึง 21:1 (ดำบนขาว).",
    "what-is-method": "เครื่องมือนี้แปลงสีเป็น sRGB ผสมความโปร่งใสก่อนเปรียบเทียบ และใช้สูตรความสว่างสัมพัทธ์ของ WCAG.",
    "what-is-thresholds-title": "เกณฑ์ WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 สำหรับข้อความปกติ, 3:1 สำหรับข้อความขนาดใหญ่.",
    "what-is-thresholds-aaa": "AAA: 7:1 สำหรับข้อความปกติ, 4.5:1 สำหรับข้อความขนาดใหญ่.",
    "what-is-thresholds-large": "ข้อความขนาดใหญ่คือ 18pt+ ปกติ หรือ 14pt+ ตัวหนา.",
    "what-is-thresholds-ui": "องค์ประกอบ UI ไอคอน และกราฟิกควรมีอย่างน้อย 3:1.",
    "what-is-tip": "อัตราที่สูงขึ้นช่วยให้อ่านง่ายขึ้น โดยเฉพาะกับฟอนต์บางหรือขนาดเล็ก."
  },
  "id": {
    "what-is-title": "Apa itu kontras warna?",
    "what-is-definition": "Rasio kontras mengukur perbedaan luminansi antara teks (foreground) dan latar pada skala 1:1 (tanpa kontras) hingga 21:1 (hitam di atas putih).",
    "what-is-method": "Alat ini mengonversi warna ke sRGB, mencampur transparansi sebelum membandingkan, dan menggunakan rumus luminansi relatif WCAG.",
    "what-is-thresholds-title": "Ambang WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 untuk teks normal, 3:1 untuk teks besar.",
    "what-is-thresholds-aaa": "AAA: 7:1 untuk teks normal, 4.5:1 untuk teks besar.",
    "what-is-thresholds-large": "Teks besar adalah 18pt+ normal atau 14pt+ tebal.",
    "what-is-thresholds-ui": "Komponen UI, ikon, dan grafis sebaiknya minimal 3:1.",
    "what-is-tip": "Rasio yang lebih tinggi meningkatkan keterbacaan, terutama pada font tipis atau ukuran kecil."
  },
  "he": {
    "what-is-title": "מהו ניגוד צבעים?",
    "what-is-definition": "יחס הניגודיות מודד את ההבדל בלומיננס בין טקסט (קדמה) לרקע בסקאלה מ-1:1 (ללא ניגודיות) עד 21:1 (שחור על לבן).",
    "what-is-method": "הכלי ממיר צבעים ל-sRGB, מערבב שקיפות לפני ההשוואה ומשתמש בנוסחת הלומיננס היחסי של WCAG.",
    "what-is-thresholds-title": "ספי WCAG",
    "what-is-thresholds-aa": "AA: ‏4.5:1 לטקסט רגיל, 3:1 לטקסט גדול.",
    "what-is-thresholds-aaa": "AAA: ‏7:1 לטקסט רגיל, 4.5:1 לטקסט גדול.",
    "what-is-thresholds-large": "טקסט גדול הוא 18pt+ רגיל או 14pt+ מודגש.",
    "what-is-thresholds-ui": "רכיבי UI, אייקונים וגרפיקה צריכים לשאוף לפחות ל-3:1.",
    "what-is-tip": "יחסים גבוהים יותר משפרים קריאות, במיוחד עם גופנים דקים או גדלים קטנים."
  },
  "ms": {
    "what-is-title": "Apakah kontras warna?",
    "what-is-definition": "Nisbah kontras mengukur perbezaan luminans antara teks (hadapan) dan latar pada skala 1:1 (tiada kontras) hingga 21:1 (hitam di atas putih).",
    "what-is-method": "Alat ini menukar warna kepada sRGB, mengadun ketelusan sebelum perbandingan dan menggunakan formula luminans relatif WCAG.",
    "what-is-thresholds-title": "Ambang WCAG",
    "what-is-thresholds-aa": "AA: 4.5:1 untuk teks biasa, 3:1 untuk teks besar.",
    "what-is-thresholds-aaa": "AAA: 7:1 untuk teks biasa, 4.5:1 untuk teks besar.",
    "what-is-thresholds-large": "Teks besar ialah 18pt+ biasa atau 14pt+ tebal.",
    "what-is-thresholds-ui": "Komponen UI, ikon dan grafik sepatutnya sekurang-kurangnya 3:1.",
    "what-is-tip": "Nisbah lebih tinggi meningkatkan kebolehbacaan, terutama untuk fon nipis atau saiz kecil."
  },
  "no": {
    "what-is-title": "Hva er fargekontrast?",
    "what-is-definition": "Kontrastforholdet måler luminansforskjellen mellom tekst (forgrunn) og bakgrunn på en skala fra 1:1 (ingen kontrast) til 21:1 (svart på hvitt).",
    "what-is-method": "Dette verktøyet konverterer farger til sRGB, blander transparens før sammenligning og bruker WCAG-formelen for relativ luminans.",
    "what-is-thresholds-title": "WCAG-terskler",
    "what-is-thresholds-aa": "AA: 4.5:1 for normal tekst, 3:1 for stor tekst.",
    "what-is-thresholds-aaa": "AAA: 7:1 for normal tekst, 4.5:1 for stor tekst.",
    "what-is-thresholds-large": "Stor tekst er 18pt+ normal eller 14pt+ fet.",
    "what-is-thresholds-ui": "UI-komponenter, ikoner og grafikk bør sikte på minst 3:1.",
    "what-is-tip": "Høyere forhold forbedrer lesbarheten, spesielt med tynne skrifter eller små størrelser."
  }
}
</i18n>
