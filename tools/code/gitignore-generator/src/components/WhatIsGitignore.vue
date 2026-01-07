<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('description') }}</n-text>
    <n-ul style="margin-top: 12px">
      <n-li>{{ t('point1') }}</n-li>
      <n-li>{{ t('point2') }}</n-li>
      <n-li>{{ t('point3') }}</n-li>
    </n-ul>
    <n-text style="margin-top: 12px; display: block">{{ t('templates') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText, NUl, NLi } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is .gitignore?",
    "description": "A .gitignore file specifies intentionally untracked files that Git should ignore. Files already tracked by Git are not affected.",
    "point1": "Build outputs (node_modules/, dist/, build/)",
    "point2": "IDE and editor files (.idea/, .vscode/)",
    "point3": "Operating system files (.DS_Store, Thumbs.db)",
    "templates": "This tool uses templates from the official GitHub gitignore repository, covering 150+ languages, frameworks, and environments."
  },
  "zh": {
    "title": "什么是 .gitignore？",
    "description": ".gitignore 文件指定了 Git 应该忽略的未跟踪文件。已被 Git 跟踪的文件不受影响。",
    "point1": "构建输出（node_modules/、dist/、build/）",
    "point2": "IDE 和编辑器文件（.idea/、.vscode/）",
    "point3": "操作系统文件（.DS_Store、Thumbs.db）",
    "templates": "此工具使用来自官方 GitHub gitignore 仓库的模板，涵盖 150 多种语言、框架和环境。"
  },
  "zh-CN": {
    "title": "什么是 .gitignore？",
    "description": ".gitignore 文件指定了 Git 应该忽略的未跟踪文件。已被 Git 跟踪的文件不受影响。",
    "point1": "构建输出（node_modules/、dist/、build/）",
    "point2": "IDE 和编辑器文件（.idea/、.vscode/）",
    "point3": "操作系统文件（.DS_Store、Thumbs.db）",
    "templates": "此工具使用来自官方 GitHub gitignore 仓库的模板，涵盖 150 多种语言、框架和环境。"
  },
  "zh-TW": {
    "title": "什麼是 .gitignore？",
    "description": ".gitignore 檔案指定了 Git 應該忽略的未追蹤檔案。已被 Git 追蹤的檔案不受影響。",
    "point1": "建置輸出（node_modules/、dist/、build/）",
    "point2": "IDE 和編輯器檔案（.idea/、.vscode/）",
    "point3": "作業系統檔案（.DS_Store、Thumbs.db）",
    "templates": "此工具使用來自官方 GitHub gitignore 儲存庫的模板，涵蓋 150 多種語言、框架和環境。"
  },
  "zh-HK": {
    "title": "什麼是 .gitignore？",
    "description": ".gitignore 檔案指定了 Git 應該忽略的未追蹤檔案。已被 Git 追蹤的檔案不受影響。",
    "point1": "建置輸出（node_modules/、dist/、build/）",
    "point2": "IDE 和編輯器檔案（.idea/、.vscode/）",
    "point3": "作業系統檔案（.DS_Store、Thumbs.db）",
    "templates": "此工具使用來自官方 GitHub gitignore 儲存庫的模板，涵蓋 150 多種語言、框架和環境。"
  },
  "es": {
    "title": "¿Qué es .gitignore?",
    "description": "Un archivo .gitignore especifica archivos no rastreados intencionalmente que Git debe ignorar. Los archivos ya rastreados por Git no se ven afectados.",
    "point1": "Salidas de compilación (node_modules/, dist/, build/)",
    "point2": "Archivos de IDE y editor (.idea/, .vscode/)",
    "point3": "Archivos del sistema operativo (.DS_Store, Thumbs.db)",
    "templates": "Esta herramienta utiliza plantillas del repositorio oficial de gitignore de GitHub, cubriendo más de 150 lenguajes, frameworks y entornos."
  },
  "fr": {
    "title": "Qu'est-ce que .gitignore ?",
    "description": "Un fichier .gitignore spécifie les fichiers intentionnellement non suivis que Git doit ignorer. Les fichiers déjà suivis par Git ne sont pas affectés.",
    "point1": "Sorties de compilation (node_modules/, dist/, build/)",
    "point2": "Fichiers IDE et éditeur (.idea/, .vscode/)",
    "point3": "Fichiers du système d'exploitation (.DS_Store, Thumbs.db)",
    "templates": "Cet outil utilise des modèles du dépôt officiel gitignore de GitHub, couvrant plus de 150 langages, frameworks et environnements."
  },
  "de": {
    "title": "Was ist .gitignore?",
    "description": "Eine .gitignore-Datei gibt absichtlich nicht verfolgte Dateien an, die Git ignorieren soll. Bereits von Git verfolgte Dateien sind nicht betroffen.",
    "point1": "Build-Ausgaben (node_modules/, dist/, build/)",
    "point2": "IDE- und Editor-Dateien (.idea/, .vscode/)",
    "point3": "Betriebssystem-Dateien (.DS_Store, Thumbs.db)",
    "templates": "Dieses Tool verwendet Vorlagen aus dem offiziellen GitHub gitignore Repository und deckt über 150 Sprachen, Frameworks und Umgebungen ab."
  },
  "it": {
    "title": "Cos'è .gitignore?",
    "description": "Un file .gitignore specifica i file intenzionalmente non tracciati che Git deve ignorare. I file già tracciati da Git non sono interessati.",
    "point1": "Output di build (node_modules/, dist/, build/)",
    "point2": "File IDE ed editor (.idea/, .vscode/)",
    "point3": "File del sistema operativo (.DS_Store, Thumbs.db)",
    "templates": "Questo strumento utilizza modelli dal repository ufficiale gitignore di GitHub, coprendo oltre 150 linguaggi, framework e ambienti."
  },
  "ja": {
    "title": ".gitignore とは？",
    "description": ".gitignore ファイルは、Git が無視すべき意図的に追跡されていないファイルを指定します。すでに Git によって追跡されているファイルは影響を受けません。",
    "point1": "ビルド出力（node_modules/、dist/、build/）",
    "point2": "IDE およびエディターファイル（.idea/、.vscode/）",
    "point3": "オペレーティングシステムファイル（.DS_Store、Thumbs.db）",
    "templates": "このツールは、GitHub の公式 gitignore リポジトリのテンプレートを使用し、150 以上の言語、フレームワーク、環境をカバーしています。"
  },
  "ko": {
    "title": ".gitignore란?",
    "description": ".gitignore 파일은 Git이 무시해야 하는 의도적으로 추적되지 않는 파일을 지정합니다. 이미 Git에서 추적 중인 파일은 영향을 받지 않습니다.",
    "point1": "빌드 출력 (node_modules/, dist/, build/)",
    "point2": "IDE 및 편집기 파일 (.idea/, .vscode/)",
    "point3": "운영 체제 파일 (.DS_Store, Thumbs.db)",
    "templates": "이 도구는 150개 이상의 언어, 프레임워크 및 환경을 다루는 공식 GitHub gitignore 저장소의 템플릿을 사용합니다."
  },
  "ru": {
    "title": "Что такое .gitignore?",
    "description": "Файл .gitignore указывает намеренно неотслеживаемые файлы, которые Git должен игнорировать. Файлы, уже отслеживаемые Git, не затрагиваются.",
    "point1": "Результаты сборки (node_modules/, dist/, build/)",
    "point2": "Файлы IDE и редактора (.idea/, .vscode/)",
    "point3": "Файлы операционной системы (.DS_Store, Thumbs.db)",
    "templates": "Этот инструмент использует шаблоны из официального репозитория gitignore GitHub, охватывая более 150 языков, фреймворков и сред."
  },
  "pt": {
    "title": "O que é .gitignore?",
    "description": "Um arquivo .gitignore especifica arquivos intencionalmente não rastreados que o Git deve ignorar. Arquivos já rastreados pelo Git não são afetados.",
    "point1": "Saídas de build (node_modules/, dist/, build/)",
    "point2": "Arquivos de IDE e editor (.idea/, .vscode/)",
    "point3": "Arquivos do sistema operacional (.DS_Store, Thumbs.db)",
    "templates": "Esta ferramenta usa modelos do repositório oficial gitignore do GitHub, cobrindo mais de 150 linguagens, frameworks e ambientes."
  },
  "ar": {
    "title": "ما هو .gitignore؟",
    "description": "يحدد ملف .gitignore الملفات غير المتعقبة عمداً التي يجب على Git تجاهلها. الملفات التي يتتبعها Git بالفعل لا تتأثر.",
    "point1": "مخرجات البناء (node_modules/، dist/، build/)",
    "point2": "ملفات IDE والمحرر (.idea/، .vscode/)",
    "point3": "ملفات نظام التشغيل (.DS_Store، Thumbs.db)",
    "templates": "تستخدم هذه الأداة قوالب من مستودع gitignore الرسمي على GitHub، وتغطي أكثر من 150 لغة وإطار عمل وبيئة."
  },
  "hi": {
    "title": ".gitignore क्या है?",
    "description": "एक .gitignore फ़ाइल जानबूझकर अनट्रैक की गई फ़ाइलों को निर्दिष्ट करती है जिन्हें Git को अनदेखा करना चाहिए। Git द्वारा पहले से ट्रैक की गई फ़ाइलें प्रभावित नहीं होती हैं।",
    "point1": "बिल्ड आउटपुट (node_modules/, dist/, build/)",
    "point2": "IDE और संपादक फ़ाइलें (.idea/, .vscode/)",
    "point3": "ऑपरेटिंग सिस्टम फ़ाइलें (.DS_Store, Thumbs.db)",
    "templates": "यह टूल आधिकारिक GitHub gitignore रिपॉजिटरी से टेम्पलेट का उपयोग करता है, जो 150+ भाषाओं, फ्रेमवर्क और वातावरण को कवर करता है।"
  },
  "tr": {
    "title": ".gitignore nedir?",
    "description": "Bir .gitignore dosyası, Git'in yoksayması gereken kasıtlı olarak izlenmeyen dosyaları belirtir. Zaten Git tarafından izlenen dosyalar etkilenmez.",
    "point1": "Derleme çıktıları (node_modules/, dist/, build/)",
    "point2": "IDE ve editör dosyaları (.idea/, .vscode/)",
    "point3": "İşletim sistemi dosyaları (.DS_Store, Thumbs.db)",
    "templates": "Bu araç, 150'den fazla dili, çerçeveyi ve ortamı kapsayan resmi GitHub gitignore deposundan şablonlar kullanır."
  },
  "nl": {
    "title": "Wat is .gitignore?",
    "description": "Een .gitignore-bestand specificeert opzettelijk niet-gevolgde bestanden die Git moet negeren. Bestanden die al door Git worden gevolgd, worden niet beïnvloed.",
    "point1": "Build-uitvoer (node_modules/, dist/, build/)",
    "point2": "IDE- en editorbestanden (.idea/, .vscode/)",
    "point3": "Besturingssysteembestanden (.DS_Store, Thumbs.db)",
    "templates": "Deze tool gebruikt sjablonen uit de officiële GitHub gitignore-repository, met dekking voor meer dan 150 talen, frameworks en omgevingen."
  },
  "sv": {
    "title": "Vad är .gitignore?",
    "description": "En .gitignore-fil specificerar avsiktligt ospårade filer som Git ska ignorera. Filer som redan spåras av Git påverkas inte.",
    "point1": "Byggutdata (node_modules/, dist/, build/)",
    "point2": "IDE- och redigerarfiler (.idea/, .vscode/)",
    "point3": "Operativsystemfiler (.DS_Store, Thumbs.db)",
    "templates": "Detta verktyg använder mallar från det officiella GitHub gitignore-repositoriet, som täcker 150+ språk, ramverk och miljöer."
  },
  "pl": {
    "title": "Czym jest .gitignore?",
    "description": "Plik .gitignore określa celowo nieśledzone pliki, które Git powinien ignorować. Pliki już śledzone przez Git nie są dotknięte.",
    "point1": "Wyjścia kompilacji (node_modules/, dist/, build/)",
    "point2": "Pliki IDE i edytora (.idea/, .vscode/)",
    "point3": "Pliki systemu operacyjnego (.DS_Store, Thumbs.db)",
    "templates": "To narzędzie używa szablonów z oficjalnego repozytorium gitignore GitHub, obejmującego ponad 150 języków, frameworków i środowisk."
  },
  "vi": {
    "title": ".gitignore là gì?",
    "description": "Tệp .gitignore chỉ định các tệp cố ý không được theo dõi mà Git nên bỏ qua. Các tệp đã được Git theo dõi không bị ảnh hưởng.",
    "point1": "Đầu ra build (node_modules/, dist/, build/)",
    "point2": "Tệp IDE và trình soạn thảo (.idea/, .vscode/)",
    "point3": "Tệp hệ điều hành (.DS_Store, Thumbs.db)",
    "templates": "Công cụ này sử dụng các mẫu từ kho gitignore chính thức của GitHub, bao gồm hơn 150 ngôn ngữ, framework và môi trường."
  },
  "th": {
    "title": ".gitignore คืออะไร?",
    "description": "ไฟล์ .gitignore ระบุไฟล์ที่ไม่ได้ติดตามโดยตั้งใจซึ่ง Git ควรเพิกเฉย ไฟล์ที่ Git ติดตามอยู่แล้วจะไม่ได้รับผลกระทบ",
    "point1": "ผลลัพธ์การ build (node_modules/, dist/, build/)",
    "point2": "ไฟล์ IDE และเอดิเตอร์ (.idea/, .vscode/)",
    "point3": "ไฟล์ระบบปฏิบัติการ (.DS_Store, Thumbs.db)",
    "templates": "เครื่องมือนี้ใช้เทมเพลตจากคลัง gitignore อย่างเป็นทางการของ GitHub ครอบคลุมภาษา เฟรมเวิร์ก และสภาพแวดล้อมมากกว่า 150 รายการ"
  },
  "id": {
    "title": "Apa itu .gitignore?",
    "description": "File .gitignore menentukan file yang sengaja tidak dilacak yang harus diabaikan Git. File yang sudah dilacak oleh Git tidak terpengaruh.",
    "point1": "Output build (node_modules/, dist/, build/)",
    "point2": "File IDE dan editor (.idea/, .vscode/)",
    "point3": "File sistem operasi (.DS_Store, Thumbs.db)",
    "templates": "Alat ini menggunakan template dari repositori gitignore resmi GitHub, mencakup 150+ bahasa, framework, dan lingkungan."
  },
  "he": {
    "title": "מה זה .gitignore?",
    "description": "קובץ .gitignore מציין קבצים שלא עוקבים אחריהם בכוונה ש-Git צריך להתעלם מהם. קבצים שכבר מעקב על ידי Git אינם מושפעים.",
    "point1": "פלטי בנייה (node_modules/, dist/, build/)",
    "point2": "קבצי IDE ועורך (.idea/, .vscode/)",
    "point3": "קבצי מערכת הפעלה (.DS_Store, Thumbs.db)",
    "templates": "כלי זה משתמש בתבניות ממאגר ה-gitignore הרשמי של GitHub, המכסה יותר מ-150 שפות, מסגרות וסביבות."
  },
  "ms": {
    "title": "Apakah .gitignore?",
    "description": "Fail .gitignore menentukan fail yang sengaja tidak dijejaki yang Git harus abaikan. Fail yang sudah dijejaki oleh Git tidak terjejas.",
    "point1": "Output binaan (node_modules/, dist/, build/)",
    "point2": "Fail IDE dan editor (.idea/, .vscode/)",
    "point3": "Fail sistem pengendalian (.DS_Store, Thumbs.db)",
    "templates": "Alat ini menggunakan templat dari repositori gitignore rasmi GitHub, meliputi 150+ bahasa, rangka kerja dan persekitaran."
  },
  "no": {
    "title": "Hva er .gitignore?",
    "description": "En .gitignore-fil spesifiserer bevisst usporede filer som Git skal ignorere. Filer som allerede spores av Git påvirkes ikke.",
    "point1": "Byggutdata (node_modules/, dist/, build/)",
    "point2": "IDE- og redigeringsfiler (.idea/, .vscode/)",
    "point3": "Operativsystemfiler (.DS_Store, Thumbs.db)",
    "templates": "Dette verktøyet bruker maler fra det offisielle GitHub gitignore-repositoriet, som dekker 150+ språk, rammeverk og miljøer."
  }
}
</i18n>
