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
    "description": "JSON Diff Path compares two JSON documents and lists exactly what changed by path. It outputs both JSONPath-style locations and JSON Pointer paths, and can generate RFC 6902 JSON Patch operations for downstream automation."
  },
  "zh": {
    "title": "什么是 JSON Diff Path?",
    "description": "JSON Diff Path 用于比较两份 JSON 文档，并按路径列出具体变化。它同时输出 JSONPath 风格路径与 JSON Pointer 路径，并可生成 RFC 6902 JSON Patch 结果，便于后续自动化处理。"
  },
  "zh-CN": {
    "title": "什么是 JSON Diff Path?",
    "description": "JSON Diff Path 用于比较两份 JSON 文档，并按路径列出具体变化。它同时输出 JSONPath 风格路径与 JSON Pointer 路径，并可生成 RFC 6902 JSON Patch 结果，便于后续自动化处理。"
  },
  "zh-TW": {
    "title": "什麼是 JSON Diff Path?",
    "description": "JSON Diff Path 用於比較兩份 JSON 文件，並依路徑列出具體變更。它同時輸出 JSONPath 風格路徑與 JSON Pointer 路徑，並可產生 RFC 6902 JSON Patch，方便後續自動化處理。"
  },
  "zh-HK": {
    "title": "什麼是 JSON Diff Path?",
    "description": "JSON Diff Path 用於比較兩份 JSON 文件，並依路徑列出具體變更。它同時輸出 JSONPath 風格路徑與 JSON Pointer 路徑，並可產生 RFC 6902 JSON Patch，方便後續自動化處理。"
  },
  "es": {
    "title": "¿Qué es JSON Diff Path?",
    "description": "JSON Diff Path compara dos documentos JSON y enumera exactamente qué cambió en cada ruta. Genera ubicaciones estilo JSONPath y rutas JSON Pointer, y también puede producir operaciones JSON Patch RFC 6902 para automatización."
  },
  "fr": {
    "title": "Qu'est-ce que JSON Diff Path ?",
    "description": "JSON Diff Path compare deux documents JSON et liste précisément ce qui a changé par chemin. Il produit des emplacements au format JSONPath et des chemins JSON Pointer, et peut générer des opérations JSON Patch RFC 6902 pour l'automatisation."
  },
  "de": {
    "title": "Was ist JSON Diff Path?",
    "description": "JSON Diff Path vergleicht zwei JSON-Dokumente und zeigt genau, was sich an welchem Pfad geändert hat. Es gibt sowohl JSONPath-ähnliche Positionen als auch JSON-Pointer-Pfade aus und kann RFC-6902-JSON-Patch-Operationen für Automatisierung erzeugen."
  },
  "it": {
    "title": "Che cos'è JSON Diff Path?",
    "description": "JSON Diff Path confronta due documenti JSON e mostra esattamente cosa è cambiato per ogni percorso. Produce sia posizioni in stile JSONPath sia percorsi JSON Pointer e può generare operazioni JSON Patch RFC 6902 per l'automazione."
  },
  "ja": {
    "title": "JSON Diff Path とは?",
    "description": "JSON Diff Path は 2 つの JSON ドキュメントを比較し、どのパスがどう変化したかを正確に一覧化します。JSONPath 形式の位置と JSON Pointer パスを出力し、RFC 6902 JSON Patch の操作も生成できるため自動化に利用できます。"
  },
  "ko": {
    "title": "JSON Diff Path란?",
    "description": "JSON Diff Path는 두 JSON 문서를 비교해 어떤 경로에서 무엇이 바뀌었는지 정확히 보여줍니다. JSONPath 스타일 위치와 JSON Pointer 경로를 함께 출력하며, 자동화를 위해 RFC 6902 JSON Patch 작업도 생성할 수 있습니다."
  },
  "ru": {
    "title": "Что такое JSON Diff Path?",
    "description": "JSON Diff Path сравнивает два JSON-документа и точно показывает, что изменилось по каждому пути. Он выводит позиции в стиле JSONPath и пути JSON Pointer, а также может генерировать операции JSON Patch RFC 6902 для автоматизации."
  },
  "pt": {
    "title": "O que é JSON Diff Path?",
    "description": "JSON Diff Path compara dois documentos JSON e lista exatamente o que mudou em cada caminho. Ele gera localizações no estilo JSONPath e caminhos JSON Pointer, e também pode criar operações JSON Patch RFC 6902 para automação."
  },
  "ar": {
    "title": "ما هو JSON Diff Path؟",
    "description": "يقارن JSON Diff Path بين مستندَي JSON ويعرض بدقة ما الذي تغيّر حسب المسار. يوفّر مواقع بنمط JSONPath ومسارات JSON Pointer، ويمكنه أيضًا توليد عمليات JSON Patch وفق RFC 6902 لأغراض الأتمتة."
  },
  "hi": {
    "title": "JSON Diff Path क्या है?",
    "description": "JSON Diff Path दो JSON दस्तावेज़ों की तुलना करता है और पाथ के अनुसार क्या बदला है यह स्पष्ट रूप से दिखाता है। यह JSONPath-शैली लोकेशन और JSON Pointer पाथ दोनों देता है, और ऑटोमेशन के लिए RFC 6902 JSON Patch ऑपरेशन भी बना सकता है।"
  },
  "tr": {
    "title": "JSON Diff Path nedir?",
    "description": "JSON Diff Path iki JSON belgesini karşılaştırır ve hangi yolda tam olarak neyin değiştiğini listeler. JSONPath tarzı konumlar ve JSON Pointer yolları üretir; ayrıca otomasyon için RFC 6902 JSON Patch işlemleri oluşturabilir."
  },
  "nl": {
    "title": "Wat is JSON Diff Path?",
    "description": "JSON Diff Path vergelijkt twee JSON-documenten en laat precies zien wat per pad is veranderd. Het geeft zowel JSONPath-achtige locaties als JSON Pointer-paden en kan RFC 6902 JSON Patch-bewerkingen genereren voor automatisering."
  },
  "sv": {
    "title": "Vad är JSON Diff Path?",
    "description": "JSON Diff Path jämför två JSON-dokument och listar exakt vad som ändrats per sökväg. Det ger både JSONPath-liknande positioner och JSON Pointer-sökvägar och kan generera RFC 6902 JSON Patch-operationer för automatisering."
  },
  "pl": {
    "title": "Czym jest JSON Diff Path?",
    "description": "JSON Diff Path porównuje dwa dokumenty JSON i dokładnie pokazuje, co zmieniło się na każdej ścieżce. Zwraca lokalizacje w stylu JSONPath oraz ścieżki JSON Pointer i może generować operacje JSON Patch RFC 6902 do automatyzacji."
  },
  "vi": {
    "title": "JSON Diff Path là gì?",
    "description": "JSON Diff Path so sánh hai tài liệu JSON và liệt kê chính xác phần thay đổi theo từng đường dẫn. Công cụ xuất cả vị trí kiểu JSONPath và đường dẫn JSON Pointer, đồng thời có thể tạo các thao tác JSON Patch RFC 6902 để tự động hóa."
  },
  "th": {
    "title": "JSON Diff Path คืออะไร?",
    "description": "JSON Diff Path ใช้เปรียบเทียบเอกสาร JSON สองชุดและแสดงอย่างชัดเจนว่าอะไรเปลี่ยนไปในแต่ละเส้นทาง โดยส่งออกทั้งตำแหน่งแบบ JSONPath และเส้นทาง JSON Pointer และยังสร้างคำสั่ง JSON Patch ตาม RFC 6902 สำหรับงานอัตโนมัติได้"
  },
  "id": {
    "title": "Apa itu JSON Diff Path?",
    "description": "JSON Diff Path membandingkan dua dokumen JSON dan menampilkan dengan tepat perubahan pada setiap jalur. Alat ini menghasilkan lokasi bergaya JSONPath dan jalur JSON Pointer, serta dapat membuat operasi JSON Patch RFC 6902 untuk otomasi."
  },
  "he": {
    "title": "מה זה JSON Diff Path?",
    "description": "JSON Diff Path משווה בין שני מסמכי JSON ומציג בדיוק מה השתנה בכל נתיב. הוא מפיק גם מיקומים בסגנון JSONPath וגם נתיבי JSON Pointer, ויכול ליצור פעולות JSON Patch לפי RFC 6902 לצורכי אוטומציה."
  },
  "ms": {
    "title": "Apakah JSON Diff Path?",
    "description": "JSON Diff Path membandingkan dua dokumen JSON dan menyenaraikan dengan tepat apa yang berubah mengikut laluan. Ia mengeluarkan lokasi gaya JSONPath dan laluan JSON Pointer, serta boleh menjana operasi JSON Patch RFC 6902 untuk automasi."
  },
  "no": {
    "title": "Hva er JSON Diff Path?",
    "description": "JSON Diff Path sammenligner to JSON-dokumenter og viser nøyaktig hva som er endret per sti. Verktøyet gir både JSONPath-lignende posisjoner og JSON Pointer-stier, og kan generere RFC 6902 JSON Patch-operasjoner for automatisering."
  }
}
</i18n>
