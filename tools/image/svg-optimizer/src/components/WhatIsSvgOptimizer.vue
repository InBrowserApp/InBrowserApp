<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-p>{{ t('description') }}</n-p>
    <n-h4>{{ t('benefitsTitle') }}</n-h4>
    <n-ul>
      <n-li>{{ t('benefit1') }}</n-li>
      <n-li>{{ t('benefit2') }}</n-li>
      <n-li>{{ t('benefit3') }}</n-li>
      <n-li>{{ t('benefit4') }}</n-li>
    </n-ul>
    <n-h4>{{ t('whatGetsRemovedTitle') }}</n-h4>
    <n-ul>
      <n-li>{{ t('removed1') }}</n-li>
      <n-li>{{ t('removed2') }}</n-li>
      <n-li>{{ t('removed3') }}</n-li>
      <n-li>{{ t('removed4') }}</n-li>
      <n-li>{{ t('removed5') }}</n-li>
    </n-ul>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NP, NH4, NUl, NLi } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is SVG Optimization?",
    "description": "SVG optimization is the process of reducing the file size of SVG (Scalable Vector Graphics) files while maintaining visual quality. This tool uses SVGO, a powerful Node.js-based tool, to analyze and optimize SVG files.",
    "benefitsTitle": "Benefits of SVG Optimization",
    "benefit1": "Smaller file sizes mean faster page load times",
    "benefit2": "Reduced bandwidth usage for your visitors",
    "benefit3": "Better performance on mobile devices",
    "benefit4": "Cleaner, more maintainable SVG code",
    "whatGetsRemovedTitle": "What Gets Removed/Optimized",
    "removed1": "XML comments and processing instructions",
    "removed2": "Metadata and editor-specific data",
    "removed3": "Unused definitions and empty elements",
    "removed4": "Redundant attributes and groups",
    "removed5": "Unnecessary precision in path data and transforms"
  },
  "zh": {
    "title": "什么是 SVG 优化？",
    "description": "SVG 优化是在保持视觉质量的同时减小 SVG（可缩放矢量图形）文件大小的过程。此工具使用 SVGO，一个强大的基于 Node.js 的工具，来分析和优化 SVG 文件。",
    "benefitsTitle": "SVG 优化的好处",
    "benefit1": "较小的文件大小意味着更快的页面加载时间",
    "benefit2": "为访客减少带宽使用",
    "benefit3": "在移动设备上有更好的性能",
    "benefit4": "更简洁、更易维护的 SVG 代码",
    "whatGetsRemovedTitle": "哪些内容会被移除/优化",
    "removed1": "XML 注释和处理指令",
    "removed2": "元数据和编辑器特定的数据",
    "removed3": "未使用的定义和空元素",
    "removed4": "冗余的属性和组",
    "removed5": "路径数据和变换中不必要的精度"
  },
  "zh-CN": {
    "title": "什么是 SVG 优化？",
    "description": "SVG 优化是在保持视觉质量的同时减小 SVG（可缩放矢量图形）文件大小的过程。此工具使用 SVGO，一个强大的基于 Node.js 的工具，来分析和优化 SVG 文件。",
    "benefitsTitle": "SVG 优化的好处",
    "benefit1": "较小的文件大小意味着更快的页面加载时间",
    "benefit2": "为访客减少带宽使用",
    "benefit3": "在移动设备上有更好的性能",
    "benefit4": "更简洁、更易维护的 SVG 代码",
    "whatGetsRemovedTitle": "哪些内容会被移除/优化",
    "removed1": "XML 注释和处理指令",
    "removed2": "元数据和编辑器特定的数据",
    "removed3": "未使用的定义和空元素",
    "removed4": "冗余的属性和组",
    "removed5": "路径数据和变换中不必要的精度"
  },
  "zh-TW": {
    "title": "什麼是 SVG 優化？",
    "description": "SVG 優化是在保持視覺品質的同時減小 SVG（可縮放向量圖形）檔案大小的過程。此工具使用 SVGO，一個強大的基於 Node.js 的工具，來分析和優化 SVG 檔案。",
    "benefitsTitle": "SVG 優化的好處",
    "benefit1": "較小的檔案大小意味著更快的頁面載入時間",
    "benefit2": "為訪客減少頻寬使用",
    "benefit3": "在行動裝置上有更好的效能",
    "benefit4": "更簡潔、更易維護的 SVG 程式碼",
    "whatGetsRemovedTitle": "哪些內容會被移除/優化",
    "removed1": "XML 註解和處理指令",
    "removed2": "元資料和編輯器特定的資料",
    "removed3": "未使用的定義和空元素",
    "removed4": "冗餘的屬性和群組",
    "removed5": "路徑資料和變換中不必要的精度"
  },
  "zh-HK": {
    "title": "什麼是 SVG 優化？",
    "description": "SVG 優化是在保持視覺品質的同時減小 SVG（可縮放向量圖形）檔案大小的過程。此工具使用 SVGO，一個強大的基於 Node.js 的工具，來分析和優化 SVG 檔案。",
    "benefitsTitle": "SVG 優化的好處",
    "benefit1": "較小的檔案大小意味著更快的頁面載入時間",
    "benefit2": "為訪客減少頻寬使用",
    "benefit3": "在流動裝置上有更好的效能",
    "benefit4": "更簡潔、更易維護的 SVG 程式碼",
    "whatGetsRemovedTitle": "哪些內容會被移除/優化",
    "removed1": "XML 註解和處理指令",
    "removed2": "元資料和編輯器特定的資料",
    "removed3": "未使用的定義和空元素",
    "removed4": "冗餘的屬性和群組",
    "removed5": "路徑資料和變換中不必要的精度"
  },
  "es": {
    "title": "¿Qué es la optimización de SVG?",
    "description": "La optimización de SVG es el proceso de reducir el tamaño de los archivos SVG (Gráficos Vectoriales Escalables) mientras se mantiene la calidad visual. Esta herramienta utiliza SVGO, una poderosa herramienta basada en Node.js, para analizar y optimizar archivos SVG.",
    "benefitsTitle": "Beneficios de la optimización de SVG",
    "benefit1": "Archivos más pequeños significan tiempos de carga más rápidos",
    "benefit2": "Menor uso de ancho de banda para sus visitantes",
    "benefit3": "Mejor rendimiento en dispositivos móviles",
    "benefit4": "Código SVG más limpio y fácil de mantener",
    "whatGetsRemovedTitle": "Qué se elimina/optimiza",
    "removed1": "Comentarios XML e instrucciones de procesamiento",
    "removed2": "Metadatos y datos específicos del editor",
    "removed3": "Definiciones no utilizadas y elementos vacíos",
    "removed4": "Atributos y grupos redundantes",
    "removed5": "Precisión innecesaria en datos de ruta y transformaciones"
  },
  "fr": {
    "title": "Qu'est-ce que l'optimisation SVG ?",
    "description": "L'optimisation SVG est le processus de réduction de la taille des fichiers SVG (Scalable Vector Graphics) tout en maintenant la qualité visuelle. Cet outil utilise SVGO, un puissant outil basé sur Node.js, pour analyser et optimiser les fichiers SVG.",
    "benefitsTitle": "Avantages de l'optimisation SVG",
    "benefit1": "Des fichiers plus petits signifient des temps de chargement plus rapides",
    "benefit2": "Utilisation réduite de la bande passante pour vos visiteurs",
    "benefit3": "Meilleures performances sur les appareils mobiles",
    "benefit4": "Code SVG plus propre et plus facile à maintenir",
    "whatGetsRemovedTitle": "Ce qui est supprimé/optimisé",
    "removed1": "Commentaires XML et instructions de traitement",
    "removed2": "Métadonnées et données spécifiques à l'éditeur",
    "removed3": "Définitions inutilisées et éléments vides",
    "removed4": "Attributs et groupes redondants",
    "removed5": "Précision inutile dans les données de chemin et les transformations"
  },
  "de": {
    "title": "Was ist SVG-Optimierung?",
    "description": "SVG-Optimierung ist der Prozess der Reduzierung der Dateigröße von SVG-Dateien (Scalable Vector Graphics) bei gleichzeitiger Beibehaltung der visuellen Qualität. Dieses Tool verwendet SVGO, ein leistungsstarkes Node.js-basiertes Tool, um SVG-Dateien zu analysieren und zu optimieren.",
    "benefitsTitle": "Vorteile der SVG-Optimierung",
    "benefit1": "Kleinere Dateigrößen bedeuten schnellere Ladezeiten",
    "benefit2": "Reduzierter Bandbreitenverbrauch für Ihre Besucher",
    "benefit3": "Bessere Leistung auf mobilen Geräten",
    "benefit4": "Saubererer, besser wartbarer SVG-Code",
    "whatGetsRemovedTitle": "Was wird entfernt/optimiert",
    "removed1": "XML-Kommentare und Verarbeitungsanweisungen",
    "removed2": "Metadaten und editor-spezifische Daten",
    "removed3": "Unbenutzte Definitionen und leere Elemente",
    "removed4": "Redundante Attribute und Gruppen",
    "removed5": "Unnötige Präzision in Pfaddaten und Transformationen"
  },
  "it": {
    "title": "Cos'è l'ottimizzazione SVG?",
    "description": "L'ottimizzazione SVG è il processo di riduzione delle dimensioni dei file SVG (Scalable Vector Graphics) mantenendo la qualità visiva. Questo strumento utilizza SVGO, un potente strumento basato su Node.js, per analizzare e ottimizzare i file SVG.",
    "benefitsTitle": "Vantaggi dell'ottimizzazione SVG",
    "benefit1": "File più piccoli significano tempi di caricamento più rapidi",
    "benefit2": "Ridotto utilizzo della larghezza di banda per i visitatori",
    "benefit3": "Migliori prestazioni sui dispositivi mobili",
    "benefit4": "Codice SVG più pulito e facile da mantenere",
    "whatGetsRemovedTitle": "Cosa viene rimosso/ottimizzato",
    "removed1": "Commenti XML e istruzioni di elaborazione",
    "removed2": "Metadati e dati specifici dell'editor",
    "removed3": "Definizioni non utilizzate ed elementi vuoti",
    "removed4": "Attributi e gruppi ridondanti",
    "removed5": "Precisione non necessaria nei dati del percorso e nelle trasformazioni"
  },
  "ja": {
    "title": "SVG 最適化とは？",
    "description": "SVG 最適化は、視覚的な品質を維持しながら SVG（スケーラブル・ベクター・グラフィックス）ファイルのサイズを削減するプロセスです。このツールは、Node.js ベースの強力なツールである SVGO を使用して SVG ファイルを分析し最適化します。",
    "benefitsTitle": "SVG 最適化のメリット",
    "benefit1": "ファイルサイズが小さくなり、ページ読み込み時間が短縮されます",
    "benefit2": "訪問者の帯域幅使用量が削減されます",
    "benefit3": "モバイルデバイスでのパフォーマンスが向上します",
    "benefit4": "よりクリーンで保守しやすい SVG コード",
    "whatGetsRemovedTitle": "削除/最適化される内容",
    "removed1": "XML コメントと処理命令",
    "removed2": "メタデータとエディタ固有のデータ",
    "removed3": "未使用の定義と空の要素",
    "removed4": "冗長な属性とグループ",
    "removed5": "パスデータとトランスフォームの不要な精度"
  },
  "ko": {
    "title": "SVG 최적화란?",
    "description": "SVG 최적화는 시각적 품질을 유지하면서 SVG(확장 가능한 벡터 그래픽) 파일의 크기를 줄이는 과정입니다. 이 도구는 Node.js 기반의 강력한 도구인 SVGO를 사용하여 SVG 파일을 분석하고 최적화합니다.",
    "benefitsTitle": "SVG 최적화의 이점",
    "benefit1": "파일 크기가 작아지면 페이지 로딩 시간이 빨라집니다",
    "benefit2": "방문자의 대역폭 사용량이 줄어듭니다",
    "benefit3": "모바일 기기에서 성능이 향상됩니다",
    "benefit4": "더 깔끔하고 유지 관리가 쉬운 SVG 코드",
    "whatGetsRemovedTitle": "제거/최적화되는 항목",
    "removed1": "XML 주석 및 처리 명령",
    "removed2": "메타데이터 및 편집기별 데이터",
    "removed3": "사용하지 않는 정의 및 빈 요소",
    "removed4": "중복 속성 및 그룹",
    "removed5": "경로 데이터 및 변환의 불필요한 정밀도"
  },
  "ru": {
    "title": "Что такое оптимизация SVG?",
    "description": "Оптимизация SVG — это процесс уменьшения размера файлов SVG (масштабируемой векторной графики) при сохранении визуального качества. Этот инструмент использует SVGO, мощный инструмент на базе Node.js, для анализа и оптимизации файлов SVG.",
    "benefitsTitle": "Преимущества оптимизации SVG",
    "benefit1": "Меньший размер файлов означает более быструю загрузку страниц",
    "benefit2": "Снижение использования пропускной способности для посетителей",
    "benefit3": "Лучшая производительность на мобильных устройствах",
    "benefit4": "Более чистый и удобный в обслуживании код SVG",
    "whatGetsRemovedTitle": "Что удаляется/оптимизируется",
    "removed1": "XML-комментарии и инструкции обработки",
    "removed2": "Метаданные и данные, специфичные для редактора",
    "removed3": "Неиспользуемые определения и пустые элементы",
    "removed4": "Избыточные атрибуты и группы",
    "removed5": "Ненужная точность в данных пути и преобразованиях"
  },
  "pt": {
    "title": "O que é otimização de SVG?",
    "description": "A otimização de SVG é o processo de redução do tamanho de arquivos SVG (Gráficos Vetoriais Escaláveis) mantendo a qualidade visual. Esta ferramenta usa o SVGO, uma poderosa ferramenta baseada em Node.js, para analisar e otimizar arquivos SVG.",
    "benefitsTitle": "Benefícios da otimização de SVG",
    "benefit1": "Arquivos menores significam tempos de carregamento mais rápidos",
    "benefit2": "Uso reduzido de largura de banda para seus visitantes",
    "benefit3": "Melhor desempenho em dispositivos móveis",
    "benefit4": "Código SVG mais limpo e fácil de manter",
    "whatGetsRemovedTitle": "O que é removido/otimizado",
    "removed1": "Comentários XML e instruções de processamento",
    "removed2": "Metadados e dados específicos do editor",
    "removed3": "Definições não utilizadas e elementos vazios",
    "removed4": "Atributos e grupos redundantes",
    "removed5": "Precisão desnecessária em dados de caminho e transformações"
  },
  "ar": {
    "title": "ما هو تحسين SVG؟",
    "description": "تحسين SVG هو عملية تقليل حجم ملفات SVG (الرسومات المتجهة القابلة للتطوير) مع الحفاظ على الجودة المرئية. تستخدم هذه الأداة SVGO، أداة قوية قائمة على Node.js، لتحليل ملفات SVG وتحسينها.",
    "benefitsTitle": "فوائد تحسين SVG",
    "benefit1": "أحجام الملفات الأصغر تعني أوقات تحميل أسرع للصفحات",
    "benefit2": "تقليل استخدام النطاق الترددي للزوار",
    "benefit3": "أداء أفضل على الأجهزة المحمولة",
    "benefit4": "كود SVG أنظف وأسهل في الصيانة",
    "whatGetsRemovedTitle": "ما يتم إزالته/تحسينه",
    "removed1": "تعليقات XML وتعليمات المعالجة",
    "removed2": "البيانات الوصفية والبيانات الخاصة بالمحرر",
    "removed3": "التعريفات غير المستخدمة والعناصر الفارغة",
    "removed4": "السمات والمجموعات الزائدة",
    "removed5": "الدقة غير الضرورية في بيانات المسار والتحويلات"
  },
  "hi": {
    "title": "SVG अनुकूलन क्या है?",
    "description": "SVG अनुकूलन दृश्य गुणवत्ता बनाए रखते हुए SVG (स्केलेबल वेक्टर ग्राफिक्स) फ़ाइलों के फ़ाइल आकार को कम करने की प्रक्रिया है। यह टूल SVGO का उपयोग करता है, जो Node.js-आधारित एक शक्तिशाली टूल है, SVG फ़ाइलों का विश्लेषण और अनुकूलन करने के लिए।",
    "benefitsTitle": "SVG अनुकूलन के लाभ",
    "benefit1": "छोटे फ़ाइल आकार का मतलब तेज़ पेज लोड समय है",
    "benefit2": "आपके आगंतुकों के लिए कम बैंडविड्थ उपयोग",
    "benefit3": "मोबाइल उपकरणों पर बेहतर प्रदर्शन",
    "benefit4": "स्वच्छ, अधिक रखरखाव योग्य SVG कोड",
    "whatGetsRemovedTitle": "क्या हटाया/अनुकूलित किया जाता है",
    "removed1": "XML टिप्पणियां और प्रोसेसिंग निर्देश",
    "removed2": "मेटाडेटा और संपादक-विशिष्ट डेटा",
    "removed3": "अप्रयुक्त परिभाषाएं और खाली तत्व",
    "removed4": "अनावश्यक विशेषताएं और समूह",
    "removed5": "पथ डेटा और ट्रांसफॉर्म में अनावश्यक सटीकता"
  },
  "tr": {
    "title": "SVG Optimizasyonu Nedir?",
    "description": "SVG optimizasyonu, görsel kaliteyi korurken SVG (Ölçeklenebilir Vektör Grafikleri) dosyalarının boyutunu azaltma işlemidir. Bu araç, SVG dosyalarını analiz etmek ve optimize etmek için Node.js tabanlı güçlü bir araç olan SVGO'yu kullanır.",
    "benefitsTitle": "SVG Optimizasyonunun Faydaları",
    "benefit1": "Daha küçük dosya boyutları daha hızlı sayfa yüklenme süreleri demektir",
    "benefit2": "Ziyaretçileriniz için azaltılmış bant genişliği kullanımı",
    "benefit3": "Mobil cihazlarda daha iyi performans",
    "benefit4": "Daha temiz, bakımı daha kolay SVG kodu",
    "whatGetsRemovedTitle": "Ne Kaldırılır/Optimize Edilir",
    "removed1": "XML yorumları ve işleme talimatları",
    "removed2": "Meta veriler ve editöre özgü veriler",
    "removed3": "Kullanılmayan tanımlar ve boş öğeler",
    "removed4": "Gereksiz öznitelikler ve gruplar",
    "removed5": "Yol verileri ve dönüşümlerde gereksiz hassasiyet"
  },
  "nl": {
    "title": "Wat is SVG-optimalisatie?",
    "description": "SVG-optimalisatie is het proces van het verkleinen van SVG-bestanden (Scalable Vector Graphics) met behoud van visuele kwaliteit. Deze tool gebruikt SVGO, een krachtige op Node.js gebaseerde tool, om SVG-bestanden te analyseren en te optimaliseren.",
    "benefitsTitle": "Voordelen van SVG-optimalisatie",
    "benefit1": "Kleinere bestandsgroottes betekenen snellere laadtijden",
    "benefit2": "Verminderd bandbreedtegebruik voor uw bezoekers",
    "benefit3": "Betere prestaties op mobiele apparaten",
    "benefit4": "Schonere, beter onderhoudbare SVG-code",
    "whatGetsRemovedTitle": "Wat wordt verwijderd/geoptimaliseerd",
    "removed1": "XML-opmerkingen en verwerkingsinstructies",
    "removed2": "Metadata en editor-specifieke gegevens",
    "removed3": "Ongebruikte definities en lege elementen",
    "removed4": "Redundante attributen en groepen",
    "removed5": "Onnodige precisie in padgegevens en transformaties"
  },
  "sv": {
    "title": "Vad är SVG-optimering?",
    "description": "SVG-optimering är processen att minska filstorleken på SVG-filer (Scalable Vector Graphics) samtidigt som den visuella kvaliteten bibehålls. Detta verktyg använder SVGO, ett kraftfullt Node.js-baserat verktyg, för att analysera och optimera SVG-filer.",
    "benefitsTitle": "Fördelar med SVG-optimering",
    "benefit1": "Mindre filstorlekar innebär snabbare laddningstider",
    "benefit2": "Minskad bandbreddsanvändning för dina besökare",
    "benefit3": "Bättre prestanda på mobila enheter",
    "benefit4": "Renare, mer underhållbar SVG-kod",
    "whatGetsRemovedTitle": "Vad som tas bort/optimeras",
    "removed1": "XML-kommentarer och bearbetningsinstruktioner",
    "removed2": "Metadata och redigerarspecifik data",
    "removed3": "Oanvända definitioner och tomma element",
    "removed4": "Redundanta attribut och grupper",
    "removed5": "Onödig precision i sökvägsdata och transformationer"
  },
  "pl": {
    "title": "Czym jest optymalizacja SVG?",
    "description": "Optymalizacja SVG to proces zmniejszania rozmiaru plików SVG (Skalowalnej Grafiki Wektorowej) przy zachowaniu jakości wizualnej. To narzędzie używa SVGO, potężnego narzędzia opartego na Node.js, do analizy i optymalizacji plików SVG.",
    "benefitsTitle": "Korzyści z optymalizacji SVG",
    "benefit1": "Mniejsze rozmiary plików oznaczają szybsze czasy ładowania stron",
    "benefit2": "Zmniejszone zużycie pasma dla odwiedzających",
    "benefit3": "Lepsza wydajność na urządzeniach mobilnych",
    "benefit4": "Czystszy, łatwiejszy w utrzymaniu kod SVG",
    "whatGetsRemovedTitle": "Co jest usuwane/optymalizowane",
    "removed1": "Komentarze XML i instrukcje przetwarzania",
    "removed2": "Metadane i dane specyficzne dla edytora",
    "removed3": "Nieużywane definicje i puste elementy",
    "removed4": "Nadmiarowe atrybuty i grupy",
    "removed5": "Niepotrzebna precyzja w danych ścieżki i transformacjach"
  },
  "vi": {
    "title": "Tối ưu hóa SVG là gì?",
    "description": "Tối ưu hóa SVG là quá trình giảm kích thước tệp SVG (Đồ họa Vector có thể mở rộng) trong khi vẫn duy trì chất lượng hình ảnh. Công cụ này sử dụng SVGO, một công cụ mạnh mẽ dựa trên Node.js, để phân tích và tối ưu hóa các tệp SVG.",
    "benefitsTitle": "Lợi ích của việc tối ưu hóa SVG",
    "benefit1": "Kích thước tệp nhỏ hơn có nghĩa là thời gian tải trang nhanh hơn",
    "benefit2": "Giảm sử dụng băng thông cho khách truy cập",
    "benefit3": "Hiệu suất tốt hơn trên thiết bị di động",
    "benefit4": "Mã SVG sạch hơn, dễ bảo trì hơn",
    "whatGetsRemovedTitle": "Những gì được loại bỏ/tối ưu hóa",
    "removed1": "Nhận xét XML và hướng dẫn xử lý",
    "removed2": "Siêu dữ liệu và dữ liệu đặc thù của trình chỉnh sửa",
    "removed3": "Định nghĩa không sử dụng và phần tử trống",
    "removed4": "Thuộc tính và nhóm thừa",
    "removed5": "Độ chính xác không cần thiết trong dữ liệu đường dẫn và biến đổi"
  },
  "th": {
    "title": "การเพิ่มประสิทธิภาพ SVG คืออะไร?",
    "description": "การเพิ่มประสิทธิภาพ SVG คือกระบวนการลดขนาดไฟล์ SVG (Scalable Vector Graphics) ในขณะที่รักษาคุณภาพภาพ เครื่องมือนี้ใช้ SVGO ซึ่งเป็นเครื่องมือที่ทรงพลังที่ใช้ Node.js ในการวิเคราะห์และเพิ่มประสิทธิภาพไฟล์ SVG",
    "benefitsTitle": "ประโยชน์ของการเพิ่มประสิทธิภาพ SVG",
    "benefit1": "ขนาดไฟล์ที่เล็กลงหมายถึงเวลาโหลดหน้าเว็บที่เร็วขึ้น",
    "benefit2": "ลดการใช้แบนด์วิดท์สำหรับผู้เยี่ยมชม",
    "benefit3": "ประสิทธิภาพที่ดีขึ้นบนอุปกรณ์มือถือ",
    "benefit4": "โค้ด SVG ที่สะอาดขึ้นและบำรุงรักษาง่ายขึ้น",
    "whatGetsRemovedTitle": "สิ่งที่ถูกลบ/เพิ่มประสิทธิภาพ",
    "removed1": "ความคิดเห็น XML และคำสั่งการประมวลผล",
    "removed2": "ข้อมูลเมตาและข้อมูลเฉพาะของโปรแกรมแก้ไข",
    "removed3": "คำจำกัดความที่ไม่ได้ใช้และองค์ประกอบที่ว่างเปล่า",
    "removed4": "แอตทริบิวต์และกลุ่มที่ซ้ำซ้อน",
    "removed5": "ความแม่นยำที่ไม่จำเป็นในข้อมูลเส้นทางและการแปลง"
  },
  "id": {
    "title": "Apa itu Optimasi SVG?",
    "description": "Optimasi SVG adalah proses mengurangi ukuran file SVG (Scalable Vector Graphics) sambil mempertahankan kualitas visual. Alat ini menggunakan SVGO, alat berbasis Node.js yang kuat, untuk menganalisis dan mengoptimalkan file SVG.",
    "benefitsTitle": "Manfaat Optimasi SVG",
    "benefit1": "Ukuran file yang lebih kecil berarti waktu muat halaman yang lebih cepat",
    "benefit2": "Penggunaan bandwidth yang berkurang untuk pengunjung Anda",
    "benefit3": "Performa yang lebih baik pada perangkat seluler",
    "benefit4": "Kode SVG yang lebih bersih dan mudah dipelihara",
    "whatGetsRemovedTitle": "Apa yang Dihapus/Dioptimalkan",
    "removed1": "Komentar XML dan instruksi pemrosesan",
    "removed2": "Metadata dan data khusus editor",
    "removed3": "Definisi yang tidak digunakan dan elemen kosong",
    "removed4": "Atribut dan grup yang berlebihan",
    "removed5": "Presisi yang tidak perlu dalam data jalur dan transformasi"
  },
  "he": {
    "title": "מהי אופטימיזציה של SVG?",
    "description": "אופטימיזציה של SVG היא תהליך של הקטנת גודל קבצי SVG (גרפיקה וקטורית ניתנת להרחבה) תוך שמירה על איכות חזותית. כלי זה משתמש ב-SVGO, כלי חזק המבוסס על Node.js, לניתוח ואופטימיזציה של קבצי SVG.",
    "benefitsTitle": "יתרונות אופטימיזציה של SVG",
    "benefit1": "קבצים קטנים יותר פירושם זמני טעינת דף מהירים יותר",
    "benefit2": "שימוש מופחת ברוחב פס עבור המבקרים שלך",
    "benefit3": "ביצועים טובים יותר במכשירים ניידים",
    "benefit4": "קוד SVG נקי יותר וקל יותר לתחזוקה",
    "whatGetsRemovedTitle": "מה מוסר/מאופטם",
    "removed1": "הערות XML והוראות עיבוד",
    "removed2": "מטא-נתונים ונתונים ספציפיים לעורך",
    "removed3": "הגדרות שאינן בשימוש ואלמנטים ריקים",
    "removed4": "תכונות וקבוצות מיותרות",
    "removed5": "דיוק מיותר בנתוני נתיב ובטרנספורמציות"
  },
  "ms": {
    "title": "Apakah Pengoptimuman SVG?",
    "description": "Pengoptimuman SVG ialah proses mengurangkan saiz fail SVG (Grafik Vektor Berskala) sambil mengekalkan kualiti visual. Alat ini menggunakan SVGO, alat berkuasa berasaskan Node.js, untuk menganalisis dan mengoptimumkan fail SVG.",
    "benefitsTitle": "Faedah Pengoptimuman SVG",
    "benefit1": "Saiz fail yang lebih kecil bermakna masa muat halaman yang lebih pantas",
    "benefit2": "Penggunaan lebar jalur yang dikurangkan untuk pelawat anda",
    "benefit3": "Prestasi yang lebih baik pada peranti mudah alih",
    "benefit4": "Kod SVG yang lebih bersih dan mudah diselenggara",
    "whatGetsRemovedTitle": "Apa yang Dialih Keluar/Dioptimumkan",
    "removed1": "Komen XML dan arahan pemprosesan",
    "removed2": "Metadata dan data khusus editor",
    "removed3": "Definisi yang tidak digunakan dan elemen kosong",
    "removed4": "Atribut dan kumpulan yang berlebihan",
    "removed5": "Ketepatan yang tidak perlu dalam data laluan dan transformasi"
  },
  "no": {
    "title": "Hva er SVG-optimalisering?",
    "description": "SVG-optimalisering er prosessen med å redusere filstørrelsen på SVG-filer (Skalerbar Vektorgrafikk) samtidig som den visuelle kvaliteten opprettholdes. Dette verktøyet bruker SVGO, et kraftig Node.js-basert verktøy, for å analysere og optimalisere SVG-filer.",
    "benefitsTitle": "Fordeler med SVG-optimalisering",
    "benefit1": "Mindre filstørrelser betyr raskere lastetider",
    "benefit2": "Redusert båndbreddebruk for besøkende",
    "benefit3": "Bedre ytelse på mobile enheter",
    "benefit4": "Renere, mer vedlikeholdbar SVG-kode",
    "whatGetsRemovedTitle": "Hva som fjernes/optimaliseres",
    "removed1": "XML-kommentarer og behandlingsinstruksjoner",
    "removed2": "Metadata og redigeringsspesifikke data",
    "removed3": "Ubrukte definisjoner og tomme elementer",
    "removed4": "Overflødige attributter og grupper",
    "removed5": "Unødvendig presisjon i banedata og transformasjoner"
  }
}
</i18n>
