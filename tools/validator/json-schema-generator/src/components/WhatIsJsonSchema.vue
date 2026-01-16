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
    "title": "What is JSON Schema?",
    "description": "JSON Schema is a standard for describing the shape of JSON data. It lets you define required fields, data types, ranges, and format rules so data can be validated consistently.\n\n**Common uses**\n- Validate API request and response payloads\n- Enforce configuration file structure\n- Document data contracts across teams"
  },
  "zh": {
    "title": "什么是 JSON Schema?",
    "description": "JSON Schema 是用于描述 JSON 数据结构的标准。它允许你定义必填字段、数据类型、范围和格式规则，从而一致地校验数据。\n\n**常见用途**\n- 校验 API 请求和响应数据\n- 约束配置文件结构\n- 作为团队间的数据契约"
  },
  "zh-CN": {
    "title": "什么是 JSON Schema?",
    "description": "JSON Schema 是用于描述 JSON 数据结构的标准。它允许你定义必填字段、数据类型、范围和格式规则，从而一致地校验数据。\n\n**常见用途**\n- 校验 API 请求和响应数据\n- 约束配置文件结构\n- 作为团队间的数据契约"
  },
  "zh-TW": {
    "title": "什麼是 JSON Schema?",
    "description": "JSON Schema 是用來描述 JSON 資料結構的標準。它可以定義必填欄位、資料型別、範圍與格式規則，讓資料能一致地被驗證。\n\n**常見用途**\n- 驗證 API 請求與回應資料\n- 約束設定檔結構\n- 作為團隊間的資料契約"
  },
  "zh-HK": {
    "title": "什麼是 JSON Schema?",
    "description": "JSON Schema 是用來描述 JSON 資料結構的標準。它可以定義必填欄位、資料型別、範圍與格式規則，讓資料能一致地被驗證。\n\n**常見用途**\n- 驗證 API 請求與回應資料\n- 約束設定檔結構\n- 作為團隊間的資料契約"
  },
  "es": {
    "title": "¿Qué es JSON Schema?",
    "description": "JSON Schema es un estándar para describir la estructura de los datos JSON. Permite definir campos obligatorios, tipos de datos, rangos y reglas de formato para validar los datos de forma consistente.\n\n**Usos comunes**\n- Validar cargas de solicitud y respuesta de API\n- Forzar la estructura de archivos de configuración\n- Documentar contratos de datos entre equipos"
  },
  "fr": {
    "title": "Qu'est-ce que JSON Schema?",
    "description": "JSON Schema est une norme qui décrit la structure des données JSON. Elle permet de définir les champs requis, les types de données, les plages et les règles de format afin de valider les données de manière cohérente.\n\n**Usages courants**\n- Valider les charges utiles des requêtes et réponses d'API\n- Imposer la structure des fichiers de configuration\n- Documenter les contrats de données entre équipes"
  },
  "de": {
    "title": "Was ist JSON Schema?",
    "description": "JSON Schema ist ein Standard zur Beschreibung der Struktur von JSON-Daten. Damit lassen sich Pflichtfelder, Datentypen, Bereiche und Formatregeln definieren, um Daten konsistent zu validieren.\n\n**Häufige Anwendungen**\n- API-Anfrage- und Antwortdaten validieren\n- Struktur von Konfigurationsdateien erzwingen\n- Datenverträge zwischen Teams dokumentieren"
  },
  "it": {
    "title": "Che cos'è JSON Schema?",
    "description": "JSON Schema è uno standard per descrivere la struttura dei dati JSON. Consente di definire campi obbligatori, tipi di dati, intervalli e regole di formato per validare i dati in modo coerente.\n\n**Usi comuni**\n- Validare i payload di richiesta e risposta delle API\n- Imporre la struttura dei file di configurazione\n- Documentare i contratti dati tra team"
  },
  "ja": {
    "title": "JSON Schema とは?",
    "description": "JSON Schema は JSON データの構造を記述するための標準です。必須フィールド、データ型、範囲、フォーマット規則を定義し、一貫した検証を行えます。\n\n**主な用途**\n- API のリクエスト／レスポンスを検証\n- 設定ファイルの構造を強制\n- チーム間のデータ契約を文書化"
  },
  "ko": {
    "title": "JSON Schema란?",
    "description": "JSON Schema는 JSON 데이터 구조를 설명하는 표준입니다. 필수 필드, 데이터 유형, 범위, 형식 규칙을 정의하여 일관되게 검증할 수 있습니다.\n\n**일반적인 사용 사례**\n- API 요청 및 응답 페이로드 검증\n- 구성 파일 구조 강제\n- 팀 간 데이터 계약 문서화"
  },
  "ru": {
    "title": "Что такое JSON Schema?",
    "description": "JSON Schema — это стандарт для описания структуры JSON-данных. Он позволяет задавать обязательные поля, типы данных, диапазоны и правила форматов для согласованной проверки.\n\n**Частые сценарии**\n- Проверка запросов и ответов API\n- Контроль структуры файлов конфигурации\n- Документирование контрактов данных между командами"
  },
  "pt": {
    "title": "O que é JSON Schema?",
    "description": "JSON Schema é um padrão para descrever a estrutura de dados JSON. Ele permite definir campos obrigatórios, tipos de dados, intervalos e regras de formato para validar os dados de forma consistente.\n\n**Usos comuns**\n- Validar payloads de requisição e resposta de APIs\n- Impor a estrutura de arquivos de configuração\n- Documentar contratos de dados entre equipes"
  },
  "ar": {
    "title": "ما هو JSON Schema؟",
    "description": "JSON Schema هو معيار لوصف بنية بيانات JSON. يتيح تحديد الحقول المطلوبة وأنواع البيانات والنطاقات وقواعد التنسيق للتحقق من البيانات بشكل متسق.\n\n**استخدامات شائعة**\n- التحقق من حمولات طلبات واستجابات API\n- فرض بنية ملفات الإعداد\n- توثيق عقود البيانات بين الفرق"
  },
  "hi": {
    "title": "JSON Schema क्या है?",
    "description": "JSON Schema JSON डेटा की संरचना का वर्णन करने का मानक है। यह आवश्यक फ़ील्ड, डेटा प्रकार, रेंज और फ़ॉर्मैट नियम परिभाषित करता है ताकि डेटा का सुसंगत सत्यापन हो सके।\n\n**आम उपयोग**\n- API अनुरोध और प्रतिक्रिया पेलोड सत्यापित करना\n- कॉन्फ़िग फ़ाइल संरचना लागू करना\n- टीमों के बीच डेटा अनुबंध दस्तावेज़ित करना"
  },
  "tr": {
    "title": "JSON Schema nedir?",
    "description": "JSON Schema, JSON verilerinin yapısını tanımlamak için kullanılan bir standarttır. Zorunlu alanları, veri türlerini, aralıkları ve biçim kurallarını tanımlayarak verileri tutarlı biçimde doğrulamayı sağlar.\n\n**Yaygın kullanım alanları**\n- API istek ve yanıt yüklerini doğrulama\n- Yapılandırma dosyası yapısını zorunlu kılma\n- Takımlar arası veri sözleşmelerini belgeleme"
  },
  "nl": {
    "title": "Wat is JSON Schema?",
    "description": "JSON Schema is een standaard om de structuur van JSON-gegevens te beschrijven. Hiermee kun je verplichte velden, datatypen, bereiken en formatregels definiëren voor consistente validatie.\n\n**Veelvoorkomende toepassingen**\n- API-request- en responsepayloads valideren\n- Structuur van configuratiebestanden afdwingen\n- Datacontracten tussen teams documenteren"
  },
  "sv": {
    "title": "Vad är JSON Schema?",
    "description": "JSON Schema är en standard för att beskriva strukturen på JSON-data. Den låter dig definiera obligatoriska fält, datatyper, intervall och formatregler för konsekvent validering.\n\n**Vanliga användningsområden**\n- Validera API-förfrågningar och svarspayloads\n- Tvinga struktur för konfigurationsfiler\n- Dokumentera datakontrakt mellan team"
  },
  "pl": {
    "title": "Czym jest JSON Schema?",
    "description": "JSON Schema to standard opisu struktury danych JSON. Pozwala definiować pola wymagane, typy danych, zakresy i reguły formatu, aby konsekwentnie walidować dane.\n\n**Typowe zastosowania**\n- Walidacja payloadów żądań i odpowiedzi API\n- Wymuszanie struktury plików konfiguracyjnych\n- Dokumentowanie kontraktów danych między zespołami"
  },
  "vi": {
    "title": "JSON Schema là gì?",
    "description": "JSON Schema là tiêu chuẩn mô tả cấu trúc dữ liệu JSON. Nó cho phép xác định các trường bắt buộc, kiểu dữ liệu, phạm vi và quy tắc định dạng để xác thực dữ liệu nhất quán.\n\n**Trường hợp sử dụng phổ biến**\n- Xác thực payload yêu cầu và phản hồi API\n- Áp đặt cấu trúc tệp cấu hình\n- Tài liệu hóa hợp đồng dữ liệu giữa các nhóm"
  },
  "th": {
    "title": "JSON Schema คืออะไร?",
    "description": "JSON Schema เป็นมาตรฐานสำหรับอธิบายโครงสร้างของข้อมูล JSON ช่วยกำหนดฟิลด์ที่จำเป็น ชนิดข้อมูล ช่วง และกฎรูปแบบ เพื่อให้ตรวจสอบข้อมูลได้อย่างสม่ำเสมอ\n\n**การใช้งานทั่วไป**\n- ตรวจสอบ payload ของคำขอและคำตอบ API\n- บังคับโครงสร้างไฟล์คอนฟิก\n- จัดทำเอกสารสัญญาข้อมูลระหว่างทีม"
  },
  "id": {
    "title": "Apa itu JSON Schema?",
    "description": "JSON Schema adalah standar untuk menggambarkan struktur data JSON. Ini memungkinkan Anda mendefinisikan bidang wajib, tipe data, rentang, dan aturan format agar data tervalidasi secara konsisten.\n\n**Penggunaan umum**\n- Memvalidasi payload permintaan dan respons API\n- Menegakkan struktur file konfigurasi\n- Mendokumentasikan kontrak data antar tim"
  },
  "he": {
    "title": "מהו JSON Schema?",
    "description": "JSON Schema הוא תקן לתיאור מבנה נתוני JSON. הוא מאפשר להגדיר שדות חובה, סוגי נתונים, טווחים וכללי פורמט כדי לאמת נתונים באופן עקבי.\n\n**שימושים נפוצים**\n- אימות מטעני בקשות ותגובות של API\n- אכיפת מבנה קבצי תצורה\n- תיעוד חוזי נתונים בין צוותים"
  },
  "ms": {
    "title": "Apakah itu JSON Schema?",
    "description": "JSON Schema ialah standard untuk menerangkan struktur data JSON. Ia membolehkan anda menetapkan medan wajib, jenis data, julat dan peraturan format untuk pengesahan yang konsisten.\n\n**Kegunaan biasa**\n- Mengesahkan payload permintaan dan respons API\n- Memaksa struktur fail konfigurasi\n- Mendokumentasikan kontrak data antara pasukan"
  },
  "no": {
    "title": "Hva er JSON Schema?",
    "description": "JSON Schema er en standard for å beskrive strukturen til JSON-data. Den lar deg definere obligatoriske felt, datatyper, intervaller og formatregler for konsekvent validering.\n\n**Vanlige bruksområder**\n- Validere API-forespørsler og responsdata\n- Håndheve struktur for konfigurasjonsfiler\n- Dokumentere datakontrakter mellom team"
  }
}
</i18n>
