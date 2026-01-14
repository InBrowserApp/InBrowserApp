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
    "title": "What is OpenAPI?",
    "description": "OpenAPI (formerly Swagger) is a specification for describing HTTP APIs in a machine-readable way. It defines endpoints, parameters, request/response bodies, authentication, and reusable schemas so tools can generate docs and code consistently.\n\n**Key parts**\n- `paths` and operations describe URLs, methods, and parameters\n- `components/schemas` define reusable data models\n- `security` and `servers` describe auth and environments\n\n**Why it matters**\n- Generate typed clients/servers and SDKs\n- Produce interactive documentation and mocks\n- Validate requests and responses in CI"
  },
  "zh": {
    "title": "什么是 OpenAPI?",
    "description": "OpenAPI（原 Swagger）是用于以机器可读方式描述 HTTP API 的规范。它定义了端点、参数、请求/响应体、认证以及可复用的 schema，使工具能够一致地生成文档和代码。\n\n**关键组成**\n- `paths` 与操作（operations）描述 URL、方法与参数\n- `components/schemas` 定义可复用的数据模型\n- `security` 与 `servers` 描述认证与环境\n\n**为什么重要**\n- 生成类型安全的客户端/服务端与 SDK\n- 生成可交互的文档与 mock\n- 在 CI 中校验请求与响应"
  },
  "zh-CN": {
    "title": "什么是 OpenAPI?",
    "description": "OpenAPI（原 Swagger）是用于以机器可读方式描述 HTTP API 的规范。它定义了端点、参数、请求/响应体、认证以及可复用的 schema，使工具能够一致地生成文档和代码。\n\n**关键组成**\n- `paths` 与操作（operations）描述 URL、方法与参数\n- `components/schemas` 定义可复用的数据模型\n- `security` 与 `servers` 描述认证与环境\n\n**为什么重要**\n- 生成类型安全的客户端/服务端与 SDK\n- 生成可交互的文档与 mock\n- 在 CI 中校验请求与响应"
  },
  "zh-TW": {
    "title": "什麼是 OpenAPI?",
    "description": "OpenAPI（原 Swagger）是用來以機器可讀方式描述 HTTP API 的規範。它定義端點、參數、請求/回應本文、驗證與可重用的 schema，讓工具能一致產生文件與程式碼。\n\n**關鍵組成**\n- `paths` 與操作（operations）描述 URL、方法與參數\n- `components/schemas` 定義可重用的資料模型\n- `security` 與 `servers` 描述驗證與環境\n\n**為什麼重要**\n- 產生型別安全的用戶端/伺服端與 SDK\n- 產生可互動的文件與 mock\n- 在 CI 中驗證請求與回應"
  },
  "zh-HK": {
    "title": "什麼是 OpenAPI?",
    "description": "OpenAPI（原 Swagger）是用來以機器可讀方式描述 HTTP API 的規範。它定義端點、參數、請求/回應本文、驗證與可重用的 schema，讓工具能一致產生文件與程式碼。\n\n**關鍵組成**\n- `paths` 與操作（operations）描述 URL、方法與參數\n- `components/schemas` 定義可重用的資料模型\n- `security` 與 `servers` 描述驗證與環境\n\n**為什麼重要**\n- 產生型別安全的用戶端/伺服端與 SDK\n- 產生可互動的文件與 mock\n- 在 CI 中驗證請求與回應"
  },
  "es": {
    "title": "¿Qué es OpenAPI?",
    "description": "OpenAPI (antes Swagger) es una especificación para describir APIs HTTP de forma legible por máquinas. Define endpoints, parámetros, cuerpos de solicitud/respuesta, autenticación y esquemas reutilizables para que las herramientas generen documentación y código de manera consistente.\n\n**Partes clave**\n- `paths` y operaciones describen URLs, métodos y parámetros\n- `components/schemas` define modelos de datos reutilizables\n- `security` y `servers` describen autenticación y entornos\n\n**Por qué importa**\n- Generar clientes/servidores tipados y SDKs\n- Producir documentación interactiva y mocks\n- Validar solicitudes y respuestas en CI"
  },
  "fr": {
    "title": "Qu'est-ce que OpenAPI ?",
    "description": "OpenAPI (anciennement Swagger) est une spécification pour décrire des API HTTP de manière lisible par machine. Elle définit les endpoints, paramètres, corps de requête/réponse, l'authentification et des schémas réutilisables afin que les outils génèrent documentation et code de façon cohérente.\n\n**Éléments clés**\n- `paths` et les opérations décrivent URLs, méthodes et paramètres\n- `components/schemas` définit des modèles de données réutilisables\n- `security` et `servers` décrivent l'authentification et les environnements\n\n**Pourquoi c'est important**\n- Générer des clients/serveurs typés et des SDK\n- Produire une documentation interactive et des mocks\n- Valider requêtes et réponses en CI"
  },
  "de": {
    "title": "Was ist OpenAPI?",
    "description": "OpenAPI (früher Swagger) ist eine Spezifikation zur maschinenlesbaren Beschreibung von HTTP-APIs. Sie definiert Endpunkte, Parameter, Request/Response-Bodies, Authentifizierung und wiederverwendbare Schemas, damit Tools Dokumentation und Code konsistent erzeugen können.\n\n**Kernbestandteile**\n- `paths` und Operations beschreiben URLs, Methoden und Parameter\n- `components/schemas` definiert wiederverwendbare Datenmodelle\n- `security` und `servers` beschreiben Auth und Umgebungen\n\n**Warum es wichtig ist**\n- Typisierte Clients/Server und SDKs generieren\n- Interaktive Dokumentation und Mocks erstellen\n- Requests und Responses in CI validieren"
  },
  "it": {
    "title": "Che cos'è OpenAPI?",
    "description": "OpenAPI (ex Swagger) è una specifica per descrivere API HTTP in modo leggibile dalle macchine. Definisce endpoint, parametri, corpi di richiesta/risposta, autenticazione e schemi riutilizzabili, così gli strumenti possono generare documentazione e codice in modo coerente.\n\n**Parti chiave**\n- `paths` e operazioni descrivono URL, metodi e parametri\n- `components/schemas` definisce modelli di dati riutilizzabili\n- `security` e `servers` descrivono autenticazione e ambienti\n\n**Perché è importante**\n- Generare client/server tipizzati e SDK\n- Produrre documentazione interattiva e mock\n- Validare richieste e risposte in CI"
  },
  "ja": {
    "title": "OpenAPI とは?",
    "description": "OpenAPI（旧 Swagger）は HTTP API を機械可読な形で記述するための仕様です。エンドポイント、パラメータ、リクエスト/レスポンス本文、認証、再利用可能なスキーマを定義し、ツールが一貫してドキュメントやコードを生成できるようにします。\n\n**主要な構成**\n- `paths` と operations が URL、メソッド、パラメータを記述\n- `components/schemas` が再利用可能なデータモデルを定義\n- `security` と `servers` が認証と環境を記述\n\n**重要な理由**\n- 型付きクライアント/サーバーや SDK を生成\n- インタラクティブなドキュメントとモックを作成\n- CI でリクエストとレスポンスを検証"
  },
  "ko": {
    "title": "OpenAPI란?",
    "description": "OpenAPI(이전 Swagger)는 HTTP API를 기계가 읽을 수 있게 설명하기 위한 명세입니다. 엔드포인트, 파라미터, 요청/응답 본문, 인증, 재사용 가능한 스키마를 정의하여 도구가 문서와 코드를 일관되게 생성할 수 있게 합니다.\n\n**핵심 구성**\n- `paths`와 operations가 URL, 메서드, 파라미터를 설명\n- `components/schemas`가 재사용 가능한 데이터 모델을 정의\n- `security`와 `servers`가 인증과 환경을 설명\n\n**중요한 이유**\n- 타입이 있는 클라이언트/서버 및 SDK 생성\n- 인터랙티브 문서와 목(mock) 생성\n- CI에서 요청과 응답을 검증"
  },
  "ru": {
    "title": "Что такое OpenAPI?",
    "description": "OpenAPI (ранее Swagger) — это спецификация для машинно-читаемого описания HTTP API. Она определяет эндпоинты, параметры, тела запросов/ответов, аутентификацию и переиспользуемые схемы, чтобы инструменты могли последовательно генерировать документацию и код.\n\n**Ключевые части**\n- `paths` и операции описывают URL, методы и параметры\n- `components/schemas` определяет переиспользуемые модели данных\n- `security` и `servers` описывают аутентификацию и окружения\n\n**Почему это важно**\n- Генерировать типизированные клиенты/серверы и SDK\n- Создавать интерактивную документацию и моки\n- Валидировать запросы и ответы в CI"
  },
  "pt": {
    "title": "O que é OpenAPI?",
    "description": "OpenAPI (antigo Swagger) é uma especificação para descrever APIs HTTP de forma legível por máquinas. Ela define endpoints, parâmetros, corpos de requisição/resposta, autenticação e schemas reutilizáveis para que as ferramentas gerem documentação e código de maneira consistente.\n\n**Partes principais**\n- `paths` e operações descrevem URLs, métodos e parâmetros\n- `components/schemas` define modelos de dados reutilizáveis\n- `security` e `servers` descrevem autenticação e ambientes\n\n**Por que importa**\n- Gerar clientes/servidores tipados e SDKs\n- Produzir documentação interativa e mocks\n- Validar requisições e respostas em CI"
  },
  "ar": {
    "title": "ما هو OpenAPI؟",
    "description": "OpenAPI (سابقًا Swagger) هو مواصفة لوصف واجهات برمجة تطبيقات HTTP بطريقة قابلة للقراءة آليًا. يعرّف النقاط الطرفية والمعلمات وأجسام الطلب/الاستجابة والمصادقة والمخططات القابلة لإعادة الاستخدام بحيث يمكن للأدوات توليد الوثائق والكود بشكل متسق.\n\n**الأجزاء الرئيسية**\n- `paths` والعمليات تصف عناوين URL والطرق والمعلمات\n- `components/schemas` تحدد نماذج بيانات قابلة لإعادة الاستخدام\n- `security` و `servers` يصفان المصادقة والبيئات\n\n**لماذا هذا مهم**\n- توليد عملاء/خوادم ذات أنواع و SDKs\n- إنتاج وثائق تفاعلية ونماذج محاكاة\n- التحقق من الطلبات والاستجابات في CI"
  },
  "hi": {
    "title": "OpenAPI क्या है?",
    "description": "OpenAPI (पहले Swagger) HTTP API का मशीन-पठनीय वर्णन करने के लिए एक स्पेसिफिकेशन है। यह एंडपॉइंट्स, पैरामीटर, अनुरोध/प्रतिक्रिया बॉडी, प्रमाणीकरण और पुन: उपयोग योग्य स्कीमा परिभाषित करता है ताकि टूल्स दस्तावेज़ और कोड को एकसमान तरीके से जनरेट कर सकें।\n\n**मुख्य भाग**\n- `paths` और operations URL, मेथड और पैरामीटर बताते हैं\n- `components/schemas` पुन: उपयोग योग्य डेटा मॉडल परिभाषित करता है\n- `security` और `servers` प्रमाणीकरण और वातावरण बताते हैं\n\n**यह क्यों महत्वपूर्ण है**\n- टाइप्ड क्लाइंट/सर्वर और SDK बनाना\n- इंटरैक्टिव दस्तावेज़ और मॉक बनाना\n- CI में अनुरोध और प्रतिक्रियाओं का सत्यापन"
  },
  "tr": {
    "title": "OpenAPI nedir?",
    "description": "OpenAPI (eski adıyla Swagger), HTTP API'lerini makine tarafından okunabilir şekilde tanımlayan bir belirtimdir. Uç noktaları, parametreleri, istek/yanıt gövdelerini, kimlik doğrulamayı ve yeniden kullanılabilir şemaları tanımlar; böylece araçlar dokümantasyon ve kodu tutarlı biçimde üretebilir.\n\n**Temel bölümler**\n- `paths` ve operations URL'leri, yöntemleri ve parametreleri açıklar\n- `components/schemas` yeniden kullanılabilir veri modellerini tanımlar\n- `security` ve `servers` kimlik doğrulama ve ortamları açıklar\n\n**Neden önemli**\n- Tipli istemci/sunucu ve SDK'lar üretmek\n- Etkileşimli dokümantasyon ve mock'lar oluşturmak\n- CI'da istek ve yanıtları doğrulamak"
  },
  "nl": {
    "title": "Wat is OpenAPI?",
    "description": "OpenAPI (voorheen Swagger) is een specificatie om HTTP-API's machineleesbaar te beschrijven. Het definieert endpoints, parameters, request/response-bodies, authenticatie en herbruikbare schema's zodat tools consistent documentatie en code kunnen genereren.\n\n**Belangrijke onderdelen**\n- `paths` en operations beschrijven URL's, methoden en parameters\n- `components/schemas` definieert herbruikbare datamodellen\n- `security` en `servers` beschrijven authenticatie en omgevingen\n\n**Waarom het belangrijk is**\n- Getypeerde clients/servers en SDK's genereren\n- Interactieve documentatie en mocks maken\n- Requests en responses in CI valideren"
  },
  "sv": {
    "title": "Vad är OpenAPI?",
    "description": "OpenAPI (tidigare Swagger) är en specifikation för att beskriva HTTP-API:er på ett maskinläsbart sätt. Den definierar endpoints, parametrar, request/response-body, autentisering och återanvändbara scheman så att verktyg kan generera dokumentation och kod konsekvent.\n\n**Viktiga delar**\n- `paths` och operations beskriver URL:er, metoder och parametrar\n- `components/schemas` definierar återanvändbara datamodeller\n- `security` och `servers` beskriver autentisering och miljöer\n\n**Varför det är viktigt**\n- Generera typade klienter/servrar och SDK:er\n- Skapa interaktiv dokumentation och mocks\n- Validera requests och responses i CI"
  },
  "pl": {
    "title": "Czym jest OpenAPI?",
    "description": "OpenAPI (dawniej Swagger) to specyfikacja do maszynowego opisu HTTP API. Definiuje endpointy, parametry, treści żądań/odpowiedzi, uwierzytelnianie i schematy wielokrotnego użytku, aby narzędzia mogły spójnie generować dokumentację i kod.\n\n**Kluczowe elementy**\n- `paths` i operations opisują URL-e, metody i parametry\n- `components/schemas` definiuje modele danych wielokrotnego użytku\n- `security` i `servers` opisują uwierzytelnianie i środowiska\n\n**Dlaczego to ważne**\n- Generowanie typowanych klientów/serwerów i SDK\n- Tworzenie interaktywnej dokumentacji i mocków\n- Walidacja żądań i odpowiedzi w CI"
  },
  "vi": {
    "title": "OpenAPI là gì?",
    "description": "OpenAPI (trước đây là Swagger) là một đặc tả để mô tả HTTP API theo cách máy có thể đọc được. Nó định nghĩa các endpoint, tham số, body yêu cầu/phản hồi, xác thực và schema tái sử dụng để các công cụ có thể tạo tài liệu và mã nguồn nhất quán.\n\n**Thành phần chính**\n- `paths` và operations mô tả URL, phương thức và tham số\n- `components/schemas` định nghĩa mô hình dữ liệu tái sử dụng\n- `security` và `servers` mô tả xác thực và môi trường\n\n**Vì sao quan trọng**\n- Tạo client/server có kiểu và SDK\n- Tạo tài liệu tương tác và mock\n- Xác thực request và response trong CI"
  },
  "th": {
    "title": "OpenAPI คืออะไร?",
    "description": "OpenAPI (เดิมคือ Swagger) เป็นสเปกสำหรับอธิบาย HTTP API ในรูปแบบที่เครื่องอ่านได้ โดยกำหนดเอ็นด์พอยต์ พารามิเตอร์ บอดีคำขอ/คำตอบ การยืนยันตัวตน และสคีมาที่ใช้ซ้ำได้ เพื่อให้เครื่องมือสร้างเอกสารและโค้ดได้อย่างสม่ำเสมอ\n\n**ส่วนสำคัญ**\n- `paths` และ operations อธิบาย URL เมธอด และพารามิเตอร์\n- `components/schemas` กำหนดโมเดลข้อมูลที่ใช้ซ้ำได้\n- `security` และ `servers` อธิบายการยืนยันตัวตนและสภาพแวดล้อม\n\n**ทำไมจึงสำคัญ**\n- สร้าง client/server ที่มีประเภทและ SDK\n- สร้างเอกสารแบบโต้ตอบและ mock\n- ตรวจสอบคำขอและคำตอบใน CI"
  },
  "id": {
    "title": "Apa itu OpenAPI?",
    "description": "OpenAPI (sebelumnya Swagger) adalah spesifikasi untuk mendeskripsikan HTTP API secara dapat dibaca mesin. Ia mendefinisikan endpoint, parameter, body request/response, autentikasi, dan schema yang dapat digunakan ulang agar alat dapat menghasilkan dokumentasi dan kode secara konsisten.\n\n**Bagian utama**\n- `paths` dan operations menjelaskan URL, metode, dan parameter\n- `components/schemas` mendefinisikan model data yang dapat digunakan ulang\n- `security` dan `servers` menjelaskan autentikasi dan lingkungan\n\n**Mengapa penting**\n- Menghasilkan client/server bertipe dan SDK\n- Membuat dokumentasi interaktif dan mock\n- Memvalidasi request dan response di CI"
  },
  "he": {
    "title": "מהו OpenAPI?",
    "description": "OpenAPI (לשעבר Swagger) הוא מפרט לתיאור HTTP API באופן קריא למכונה. הוא מגדיר נקודות קצה, פרמטרים, גוף בקשה/תגובה, אימות וסכמות לשימוש חוזר כדי שכלים יוכלו להפיק תיעוד וקוד באופן עקבי.\n\n**מרכיבים מרכזיים**\n- `paths` ו-operations מתארים כתובות URL, שיטות ופרמטרים\n- `components/schemas` מגדיר מודלים של נתונים לשימוש חוזר\n- `security` ו-`servers` מתארים אימות וסביבות\n\n**למה זה חשוב**\n- יצירת לקוחות/שרתים עם טיפוסים ו-SDKs\n- הפקת תיעוד אינטראקטיבי ו-mocks\n- אימות בקשות ותגובות ב-CI"
  },
  "ms": {
    "title": "Apakah OpenAPI?",
    "description": "OpenAPI (dahulunya Swagger) ialah spesifikasi untuk menerangkan HTTP API secara boleh dibaca mesin. Ia mentakrifkan endpoint, parameter, badan permintaan/Respons, pengesahan dan schema boleh guna semula supaya alat dapat menjana dokumentasi dan kod secara konsisten.\n\n**Bahagian utama**\n- `paths` dan operations menerangkan URL, kaedah dan parameter\n- `components/schemas` mentakrifkan model data boleh guna semula\n- `security` dan `servers` menerangkan pengesahan dan persekitaran\n\n**Mengapa ia penting**\n- Menjana klien/pelayan bertip dan SDK\n- Menghasilkan dokumentasi interaktif dan mock\n- Mengesahkan permintaan dan respons dalam CI"
  },
  "no": {
    "title": "Hva er OpenAPI?",
    "description": "OpenAPI (tidligere Swagger) er en spesifikasjon for å beskrive HTTP-API-er på en maskinlesbar måte. Den definerer endepunkter, parametere, forespørsels-/svarinnhold, autentisering og gjenbrukbare skjemaer slik at verktøy kan generere dokumentasjon og kode konsistent.\n\n**Viktige deler**\n- `paths` og operations beskriver URL-er, metoder og parametere\n- `components/schemas` definerer gjenbrukbare datamodeller\n- `security` og `servers` beskriver autentisering og miljøer\n\n**Hvorfor det er viktig**\n- Generere typede klienter/servre og SDK-er\n- Lage interaktiv dokumentasjon og mocks\n- Validere forespørsler og svar i CI"
  }
}
</i18n>
