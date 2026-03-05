<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DescriptionMarkdown } from '@shared/ui/base'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is JSON Diff Path?",
    "description": "JSON Diff Path compares two JSON documents and converts each structural change into a path-based diff record with both readable JSONPath locations and standardized JSON Pointer paths; it focuses on `add`, `remove`, and `replace` changes and can export a machine-readable RFC 6902 JSON Patch array for automation pipelines, API regression checks, and configuration migration reviews, while large inputs can be safely refreshed with `Compare Now`."
  },
  "zh": {
    "title": "什么是 JSON Diff Path?",
    "description": "JSON Diff Path 用于比较两份 JSON 文档，并将每一处结构变化转换为路径级差异记录，同时提供便于阅读排查的 JSONPath 与标准化 JSON Pointer 定位；工具聚焦 `add`、`remove`、`replace` 三类变更并可导出机器可读的 RFC 6902 JSON Patch 数组，适合 API 回归检查、配置迁移审查与自动化流水线，超大输入建议编辑后点击 `Compare Now` 刷新。"
  },
  "zh-CN": {
    "title": "什么是 JSON Diff Path?",
    "description": "JSON Diff Path 用于比较两份 JSON 文档，并将每一处结构变化转换为路径级差异记录，同时提供便于阅读排查的 JSONPath 与标准化 JSON Pointer 定位；工具聚焦 `add`、`remove`、`replace` 三类变更并可导出机器可读的 RFC 6902 JSON Patch 数组，适合 API 回归检查、配置迁移审查与自动化流水线，超大输入建议编辑后点击 `Compare Now` 刷新。"
  },
  "zh-TW": {
    "title": "什麼是 JSON Diff Path?",
    "description": "JSON Diff Path 用於比較兩份 JSON 文件，並將每一處結構變更轉換為路徑級差異紀錄，同時提供易於閱讀排查的 JSONPath 與標準化 JSON Pointer 定位；工具聚焦 `add`、`remove`、`replace` 三類變更並可匯出機器可讀的 RFC 6902 JSON Patch 陣列，適合 API 回歸檢查、設定遷移審查與自動化流程，大型輸入建議編輯後點擊 `Compare Now` 重新比對。"
  },
  "zh-HK": {
    "title": "什麼是 JSON Diff Path?",
    "description": "JSON Diff Path 用於比較兩份 JSON 文件，並將每一處結構變更轉換為路徑級差異紀錄，同時提供易於閱讀排查的 JSONPath 與標準化 JSON Pointer 定位；工具聚焦 `add`、`remove`、`replace` 三類變更並可匯出機器可讀的 RFC 6902 JSON Patch 陣列，適合 API 回歸檢查、設定遷移審查與自動化流程，大型輸入建議編輯後點擊 `Compare Now` 重新比對。"
  },
  "es": {
    "title": "¿Qué es JSON Diff Path?",
    "description": "JSON Diff Path compara dos documentos JSON y convierte cada cambio estructural en un registro de diferencias por ruta con ubicación JSONPath legible y ruta JSON Pointer estandarizada; se centra en cambios `add`, `remove` y `replace`, puede exportar un arreglo RFC 6902 JSON Patch legible por máquinas y sirve para regresión de respuestas API, revisión de migraciones de configuración y automatización con `Compare Now` para entradas grandes."
  },
  "fr": {
    "title": "Qu'est-ce que JSON Diff Path ?",
    "description": "JSON Diff Path compare deux documents JSON et transforme chaque changement structurel en différence basée sur le chemin avec localisation JSONPath lisible et chemin JSON Pointer standardisé ; l'outil se concentre sur les opérations `add`, `remove` et `replace`, exporte un tableau RFC 6902 JSON Patch exploitable par des scripts, et convient aux contrôles de régression API, aux revues de migration de configuration et aux gros volumes via `Compare Now`."
  },
  "de": {
    "title": "Was ist JSON Diff Path?",
    "description": "JSON Diff Path vergleicht zwei JSON-Dokumente und wandelt jede strukturelle Änderung in einen pfadbasierten Diff-Eintrag mit gut lesbarer JSONPath-Position und standardisiertem JSON-Pointer-Pfad um; es fokussiert auf `add`, `remove` und `replace`, exportiert ein maschinenlesbares RFC 6902 JSON Patch-Array und eignet sich für API-Regressionsprüfungen, Konfigurationsmigrationen und große Eingaben über `Compare Now`."
  },
  "it": {
    "title": "Che cos'è JSON Diff Path?",
    "description": "JSON Diff Path confronta due documenti JSON e trasforma ogni modifica strutturale in una differenza basata sul percorso con posizione JSONPath leggibile e percorso JSON Pointer standardizzato; lo strumento si concentra su `add`, `remove` e `replace`, esporta un array RFC 6902 JSON Patch leggibile dalle macchine ed è adatto a controlli di regressione API, revisioni di migrazione configurazione e input grandi tramite `Compare Now`."
  },
  "ja": {
    "title": "JSON Diff Path とは?",
    "description": "JSON Diff Path は 2 つの JSON ドキュメントを比較し、すべての構造変更を読みやすい JSONPath と標準化された JSON Pointer を備えたパス単位の差分レコードへ変換します。`add`、`remove`、`replace` を中心に扱い、機械処理しやすい RFC 6902 JSON Patch 配列を出力できるため、API 回帰チェック、設定移行レビュー、自動化処理に有効で、大きな入力は `Compare Now` で安全に更新できます。"
  },
  "ko": {
    "title": "JSON Diff Path란?",
    "description": "JSON Diff Path는 두 JSON 문서를 비교해 모든 구조 변경을 읽기 쉬운 JSONPath 위치와 표준화된 JSON Pointer 경로가 포함된 경로 기반 diff 기록으로 변환합니다. 도구는 `add`, `remove`, `replace` 변경에 집중하고 머신이 처리하기 좋은 RFC 6902 JSON Patch 배열을 내보내며, API 회귀 점검, 설정 마이그레이션 검토, 자동화 파이프라인 작업에 적합하고 큰 입력은 `Compare Now`로 갱신할 수 있습니다."
  },
  "ru": {
    "title": "Что такое JSON Diff Path?",
    "description": "JSON Diff Path сравнивает два JSON-документа и превращает каждое структурное изменение в запись различий по пути с читаемым JSONPath и стандартизованным JSON Pointer; инструмент сфокусирован на `add`, `remove`, `replace`, умеет экспортировать машиночитаемый массив RFC 6902 JSON Patch и подходит для регрессионной проверки API, ревью миграций конфигурации и обновления больших входов через `Compare Now`."
  },
  "pt": {
    "title": "O que é JSON Diff Path?",
    "description": "JSON Diff Path compara dois documentos JSON e transforma cada mudança estrutural em um registro de diferença por caminho com localização JSONPath legível e caminho JSON Pointer padronizado; a ferramenta foca em `add`, `remove` e `replace`, exporta um array RFC 6902 JSON Patch legível por máquina e é útil para regressão de respostas API, revisão de migração de configuração e entradas grandes atualizadas com `Compare Now`."
  },
  "ar": {
    "title": "ما هو JSON Diff Path؟",
    "description": "يقارن JSON Diff Path بين مستندَي JSON ويحوّل كل تغيير بنيوي إلى سجل فروقات قائم على المسار مع موقع JSONPath سهل القراءة ومسار JSON Pointer معياري؛ تركز الأداة على عمليات `add` و`remove` و`replace`، وتستطيع تصدير مصفوفة RFC 6902 JSON Patch قابلة للمعالجة آليًا، وهي مناسبة لفحوص تراجع API ومراجعة ترحيل الإعدادات والتعامل مع المدخلات الكبيرة عبر `Compare Now`."
  },
  "hi": {
    "title": "JSON Diff Path क्या है?",
    "description": "JSON Diff Path दो JSON दस्तावेज़ों की तुलना करके हर संरचनात्मक बदलाव को पाथ-आधारित diff रिकॉर्ड में बदलता है, जिसमें पढ़ने योग्य JSONPath लोकेशन और मानकीकृत JSON Pointer पाथ शामिल होते हैं; यह `add`, `remove`, `replace` ऑपरेशन पर केंद्रित है, मशीन-पठनीय RFC 6902 JSON Patch array एक्सपोर्ट करता है, और API regression जाँच, configuration migration review व बड़े इनपुट के लिए `Compare Now` वर्कफ़्लो में उपयोगी है।"
  },
  "tr": {
    "title": "JSON Diff Path nedir?",
    "description": "JSON Diff Path iki JSON belgesini karşılaştırır ve her yapısal değişikliği okunabilir JSONPath konumu ile standart JSON Pointer yolunu içeren yol tabanlı diff kaydına dönüştürür; araç `add`, `remove`, `replace` işlemlerine odaklanır, makine tarafından okunabilir RFC 6902 JSON Patch dizisi dışa aktarır ve API regresyon kontrolleri, yapılandırma geçiş incelemeleri ve büyük girdileri `Compare Now` ile yenilemek için uygundur."
  },
  "nl": {
    "title": "Wat is JSON Diff Path?",
    "description": "JSON Diff Path vergelijkt twee JSON-documenten en zet elke structurele wijziging om in een padgebaseerd diff-record met een leesbare JSONPath-locatie en een gestandaardiseerd JSON Pointer-pad; de tool richt zich op `add`, `remove` en `replace`, exporteert een machineleesbare RFC 6902 JSON Patch-array en is geschikt voor API-regressiecontroles, configuratiemigratie-reviews en grote invoer die je via `Compare Now` ververst."
  },
  "sv": {
    "title": "Vad är JSON Diff Path?",
    "description": "JSON Diff Path jämför två JSON-dokument och omvandlar varje strukturell ändring till en sökvägsbaserad diffpost med lättläst JSONPath-position och standardiserad JSON Pointer-sökväg; verktyget fokuserar på `add`, `remove` och `replace`, kan exportera en maskinläsbar RFC 6902 JSON Patch-array och passar för API-regressionskontroller, granskning av konfigurationsmigreringar och stora indata via `Compare Now`."
  },
  "pl": {
    "title": "Czym jest JSON Diff Path?",
    "description": "JSON Diff Path porównuje dwa dokumenty JSON i zamienia każdą zmianę strukturalną na wpis różnicy oparty na ścieżce z czytelną lokalizacją JSONPath oraz standaryzowaną ścieżką JSON Pointer; narzędzie skupia się na `add`, `remove`, `replace`, eksportuje maszynowo czytelną tablicę RFC 6902 JSON Patch i sprawdza się przy regresji API, przeglądzie migracji konfiguracji oraz dużych danych odświeżanych przez `Compare Now`."
  },
  "vi": {
    "title": "JSON Diff Path là gì?",
    "description": "JSON Diff Path so sánh hai tài liệu JSON và chuyển mọi thay đổi cấu trúc thành bản ghi diff theo đường dẫn với vị trí JSONPath dễ đọc và đường dẫn JSON Pointer chuẩn hóa; công cụ tập trung vào `add`, `remove`, `replace`, có thể xuất mảng RFC 6902 JSON Patch cho máy xử lý và phù hợp cho kiểm tra hồi quy API, rà soát migration cấu hình và dữ liệu lớn với `Compare Now`."
  },
  "th": {
    "title": "JSON Diff Path คืออะไร?",
    "description": "JSON Diff Path ใช้เปรียบเทียบเอกสาร JSON สองชุดและแปลงทุกการเปลี่ยนแปลงเชิงโครงสร้างให้เป็นรายการ diff ตามเส้นทาง พร้อมตำแหน่ง JSONPath ที่อ่านง่ายและเส้นทาง JSON Pointer มาตรฐาน; เครื่องมือเน้น `add`, `remove`, `replace`, ส่งออกอาร์เรย์ RFC 6902 JSON Patch ที่ระบบประมวลผลต่อได้ และเหมาะกับงาน regression ของ API, การทบทวน migration config และข้อมูลขนาดใหญ่ที่อัปเดตด้วย `Compare Now`."
  },
  "id": {
    "title": "Apa itu JSON Diff Path?",
    "description": "JSON Diff Path membandingkan dua dokumen JSON dan mengubah setiap perubahan struktur menjadi catatan diff berbasis jalur dengan lokasi JSONPath yang mudah dibaca serta jalur JSON Pointer terstandarisasi; alat ini berfokus pada `add`, `remove`, `replace`, dapat mengekspor array RFC 6902 JSON Patch yang bisa diproses mesin, dan cocok untuk pengecekan regresi API, review migrasi konfigurasi, serta input besar yang diperbarui lewat `Compare Now`."
  },
  "he": {
    "title": "מה זה JSON Diff Path?",
    "description": "JSON Diff Path משווה בין שני מסמכי JSON וממיר כל שינוי מבני לרשומת הבדלים מבוססת נתיב עם מיקום JSONPath קריא ונתיב JSON Pointer תקני; הכלי מתמקד ב-`add`, `remove`, `replace`, מייצא מערך RFC 6902 JSON Patch קריא למכונה ומתאים לבדיקות רגרסיה של API, סקירת מיגרציות קונפיגורציה ונתונים גדולים שמתעדכנים דרך `Compare Now`."
  },
  "ms": {
    "title": "Apakah JSON Diff Path?",
    "description": "JSON Diff Path membandingkan dua dokumen JSON dan menukar setiap perubahan struktur kepada rekod diff berasaskan laluan dengan lokasi JSONPath yang mudah dibaca serta laluan JSON Pointer yang terpiawai; alat ini memfokuskan `add`, `remove`, `replace`, boleh mengeksport tatasusunan RFC 6902 JSON Patch yang boleh diproses mesin, dan sesuai untuk semakan regresi API, semakan migrasi konfigurasi serta input besar yang dikemas kini melalui `Compare Now`."
  },
  "no": {
    "title": "Hva er JSON Diff Path?",
    "description": "JSON Diff Path sammenligner to JSON-dokumenter og gjør hver strukturell endring om til en stibasert diff-post med lesbar JSONPath-plassering og standardisert JSON Pointer-sti; verktøyet fokuserer på `add`, `remove` og `replace`, eksporterer en maskinlesbar RFC 6902 JSON Patch-array og passer for API-regresjonskontroll, konfigurasjonsmigreringer og store inndata som oppdateres via `Compare Now`."
  }
}
</i18n>
