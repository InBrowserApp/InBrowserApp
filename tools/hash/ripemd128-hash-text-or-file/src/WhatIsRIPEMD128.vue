<template>
  <DescriptionMarkdown
    :title="t('what-is-ripemd-title', { bits: 128 })"
    :description="t('what-is-ripemd-description-markdown', { bits: 128, bytes: 16, hex: 32 })"
  />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "what-is-ripemd-title": "What is RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) is a cryptographic hash function that produces a {bits}-bit ({bytes}-byte) hash value, typically rendered as a {hex}-character hexadecimal number. It is part of the RIPEMD family developed in Europe as an alternative to MD4/MD5.\n\n**Key characteristics:**\n- **Deterministic**: The same input always produces the same hash\n- **Fast computation**: Quick to compute for any given input\n- **Avalanche effect**: Small changes in input produce drastically different outputs\n- **Fixed output size**: Always produces a {bits}-bit hash regardless of input size\n- **One-way**: Computationally infeasible to recover the original input from the hash\n\n**Common uses:**\n- Data integrity checks\n- Fingerprinting and deduplication\n- Legacy system compatibility"
  },
  "zh": {
    "what-is-ripemd-title": "什么是 RIPEMD-{bits}？",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits}（RACE 完整性原语评估消息摘要）是一种加密散列函数，产生 {bits} 位（{bytes} 字节）的散列值，通常呈现为 {hex} 个字符的十六进制数。它是由欧洲开发的 RIPEMD 散列函数家族的一部分，作为 MD4/MD5 的替代方案。\n\n**主要特征：**\n- **确定性**：相同的输入总是产生相同的散列\n- **快速计算**：对于任何给定输入都能快速计算\n- **雪崩效应**：输入的微小变化会产生截然不同的输出\n- **固定输出大小**：无论输入大小如何，始终产生 {bits} 位散列\n- **单向性**：从散列反推原始输入在计算上是不可行的\n\n**常见用途：**\n- 数据完整性检查\n- 指纹识别与去重\n- 遗留系统兼容性"
  },
  "zh-CN": {
    "what-is-ripemd-title": "什么是 RIPEMD-{bits}？",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits}（RACE 完整性原语评估消息摘要）是一种加密散列函数，产生 {bits} 位（{bytes} 字节）的散列值，通常呈现为 {hex} 个字符的十六进制数。它是由欧洲开发的 RIPEMD 散列函数家族的一部分，作为 MD4/MD5 的替代方案。\n\n**主要特征：**\n- **确定性**：相同的输入总是产生相同的散列\n- **快速计算**：对于任何给定输入都能快速计算\n- **雪崩效应**：输入的微小变化会产生截然不同的输出\n- **固定输出大小**：无论输入大小如何，始终产生 {bits} 位散列\n- **单向性**：从散列反推原始输入在计算上是不可行的\n\n**常见用途：**\n- 数据完整性检查\n- 指纹识别与去重\n- 遗留系统兼容性"
  },
  "zh-TW": {
    "what-is-ripemd-title": "什麼是 RIPEMD-{bits}？",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits}（RACE 完整性原語評估訊息摘要）是一種加密雜湊函數，產生 {bits} 位元（{bytes} 位元組）的雜湊值，通常呈現為 {hex} 個字元的十六進位數。它是歐洲開發的 RIPEMD 雜湊函數家族的一部分，作為 MD4/MD5 的替代方案。\n\n**主要特徵：**\n- **確定性**：相同的輸入總是產生相同的雜湊\n- **快速計算**：對於任何給定輸入都能快速計算\n- **雪崩效應**：輸入的微小變化會產生截然不同的輸出\n- **固定輸出大小**：無論輸入大小如何，始終產生 {bits} 位元雜湊\n- **單向性**：從雜湊反推原始輸入在計算上是不可行的\n\n**常見用途：**\n- 資料完整性檢查\n- 指紋識別與去重\n- 遺留系統相容性"
  },
  "zh-HK": {
    "what-is-ripemd-title": "什麼是 RIPEMD-{bits}？",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits}（RACE 完整性原語評估訊息摘要）是一種加密雜湊函數，產生 {bits} 位元（{bytes} 位元組）的雜湊值，通常呈現為 {hex} 個字元的十六進位數。它是歐洲開發的 RIPEMD 雜湊函數家族的一部分，作為 MD4/MD5 的替代方案。\n\n**主要特徵：**\n- **確定性**：相同的輸入總是產生相同的雜湊\n- **快速計算**：對於任何給定輸入都能快速計算\n- **雪崩效應**：輸入的微小變化會產生截然不同的輸出\n- **固定輸出大小**：無論輸入大小如何，始終產生 {bits} 位元雜湊\n- **單向性**：從雜湊反推原始輸入在計算上是不可行的\n\n**常見用途：**\n- 資料完整性檢查\n- 指紋識別與去重\n- 遺留系統相容性"
  },
  "es": {
    "what-is-ripemd-title": "¿Qué es RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) es una función hash criptográfica que produce un valor hash de {bits} bits ({bytes} bytes), normalmente representado como un número hexadecimal de {hex} caracteres. Es parte de la familia RIPEMD desarrollada en Europa como alternativa a MD4/MD5.\n\n**Características clave:**\n- **Determinístico**: La misma entrada siempre produce el mismo hash\n- **Computación rápida**: Rápido de calcular para cualquier entrada dada\n- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes\n- **Tamaño de salida fijo**: Siempre produce un hash de {bits} bits independientemente del tamaño de la entrada\n- **Unidireccional**: Es computacionalmente inviable recuperar la entrada original desde el hash\n\n**Usos comunes:**\n- Comprobaciones de integridad de datos\n- Huellas digitales y deduplicación\n- Compatibilidad con sistemas heredados"
  },
  "fr": {
    "what-is-ripemd-title": "Qu'est-ce que RIPEMD-{bits} ?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) est une fonction de hachage cryptographique qui produit une valeur de hachage de {bits} bits ({bytes} octets), généralement rendue sous forme d'un nombre hexadécimal de {hex} caractères. Il fait partie de la famille RIPEMD développée en Europe comme alternative à MD4/MD5.\n\n**Caractéristiques clés :**\n- **Déterministe** : La même entrée produit toujours le même hachage\n- **Calcul rapide** : Rapide à calculer pour toute entrée donnée\n- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes\n- **Taille de sortie fixe** : Produit toujours un hachage de {bits} bits quelle que soit la taille d'entrée\n- **À sens unique** : Il est informatiquement impossible de récupérer l'entrée originale à partir du hachage\n\n**Utilisations courantes :**\n- Vérification de l'intégrité des données\n- Empreintes et déduplication\n- Compatibilité avec des systèmes hérités"
  },
  "de": {
    "what-is-ripemd-title": "Was ist RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) ist eine kryptografische Hash-Funktion, die einen {bits}-Bit ({bytes}-Byte) Hash-Wert erzeugt, der typischerweise als {hex}-stellige Hexadezimalzahl dargestellt wird. Sie gehört zur in Europa entwickelten RIPEMD-Familie als Alternative zu MD4/MD5.\n\n**Hauptmerkmale:**\n- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash\n- **Schnelle Berechnung**: Schnell zu berechnen für jede gegebene Eingabe\n- **Lawineneffekt**: Kleine Änderungen in der Eingabe erzeugen drastisch unterschiedliche Ausgaben\n- **Feste Ausgabelänge**: Erzeugt immer einen {bits}-Bit-Hash unabhängig von der Eingabegröße\n- **Einweg**: Rechnerisch nicht machbar, die ursprüngliche Eingabe aus dem Hash abzuleiten\n\n**Häufige Verwendungen:**\n- Datenintegritätsprüfungen\n- Fingerprinting und Deduplizierung\n- Kompatibilität mit Altsystemen"
  },
  "it": {
    "what-is-ripemd-title": "Cos'è RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) è una funzione hash crittografica che produce un valore hash di {bits} bit ({bytes} byte), tipicamente rappresentato come un numero esadecimale di {hex} caratteri. Fa parte della famiglia RIPEMD sviluppata in Europa come alternativa a MD4/MD5.\n\n**Caratteristiche chiave:**\n- **Deterministico**: Lo stesso input produce sempre lo stesso hash\n- **Calcolo veloce**: Veloce da calcolare per qualsiasi input dato\n- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi\n- **Dimensione di output fissa**: Produce sempre un hash di {bits} bit indipendentemente dalla dimensione dell'input\n- **Unidirezionale**: È computazionalmente impraticabile recuperare l'input originale dall'hash\n\n**Usi comuni:**\n- Verifica dell'integrità dei dati\n- Fingerprinting e deduplicazione\n- Compatibilità con sistemi legacy"
  },
  "ja": {
    "what-is-ripemd-title": "RIPEMD-{bits}とは？",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits}（RACE Integrity Primitives Evaluation Message Digest）は、{bits}ビット（{bytes}バイト）のハッシュ値を生成する暗号学的ハッシュ関数で、通常{hex}文字の16進数として表示されます。MD4/MD5の代替として欧州で開発されたRIPEMDファミリーの一部です。\n\n**主な特徴：**\n- **決定論的**：同じ入力は常に同じハッシュを生成\n- **高速計算**：任意の入力に対して高速に計算\n- **雪崩効果**：入力の小さな変化が大きく異なる出力を生成\n- **固定出力サイズ**：入力サイズに関係なく常に{bits}ビット\n- **一方向性**：ハッシュから元の入力を復元することは計算上困難\n\n**一般的な用途：**\n- データ整合性チェック\n- フィンガープリンティングと重複排除\n- レガシーシステム互換"
  },
  "ko": {
    "what-is-ripemd-title": "RIPEMD-{bits}란?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits}(RACE Integrity Primitives Evaluation Message Digest)는 {bits}비트({bytes}바이트) 해시 값을 생성하는 암호화 해시 함수로, 일반적으로 {hex}자리 16진수로 표현됩니다. MD4/MD5의 대안으로 유럽에서 개발된 RIPEMD 계열의 일부입니다.\n\n**주요 특징:**\n- **결정론적**: 동일한 입력은 항상 동일한 해시를 생성\n- **빠른 계산**: 주어진 입력에 대해 빠르게 계산\n- **눈사태 효과**: 입력의 작은 변화가 완전히 다른 출력을 생성\n- **고정된 출력 크기**: 입력 크기와 무관하게 항상 {bits}비트 해시\n- **단방향성**: 해시로부터 원본 입력을 복구하는 것은 계산적으로 어렵습니다\n\n**일반적인 용도:**\n- 데이터 무결성 검사\n- 핑거프린팅 및 중복 제거\n- 레거시 시스템 호환성"
  },
  "ru": {
    "what-is-ripemd-title": "Что такое RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) — это криптографическая хеш‑функция, которая производит {bits}-битное ({bytes}-байтовое) хеш‑значение, обычно представляемое как {hex}-символьное шестнадцатеричное число. Она входит в семейство RIPEMD, разработанное в Европе как альтернатива MD4/MD5.\n\n**Ключевые характеристики:**\n- **Детерминированность**: Одинаковый ввод всегда производит одинаковый хеш\n- **Быстрое вычисление**: Быстро вычисляется для любого заданного ввода\n- **Эффект лавины**: Небольшие изменения во вводе производят кардинально разные выводы\n- **Фиксированный размер выхода**: Всегда производит {bits}-битный хеш независимо от размера ввода\n- **Односторонность**: Вычислительно нецелесообразно восстановить исходный ввод из хеша\n\n**Обычные применения:**\n- Проверка целостности данных\n- Фингерпринтинг и дедупликация\n- Совместимость с устаревшими системами"
  },
  "pt": {
    "what-is-ripemd-title": "O que é RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) é uma função hash criptográfica que produz um valor de hash de {bits} bits ({bytes} bytes), normalmente representado como um número hexadecimal de {hex} caracteres. Faz parte da família RIPEMD desenvolvida na Europa como alternativa ao MD4/MD5.\n\n**Características principais:**\n- **Determinístico**: A mesma entrada sempre produz o mesmo hash\n- **Computação rápida**: Rápido de calcular para qualquer entrada dada\n- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes\n- **Tamanho de saída fixo**: Sempre produz um hash de {bits} bits independentemente do tamanho da entrada\n- **Unidirecional**: É computacionalmente inviável recuperar a entrada original a partir do hash\n\n**Usos comuns:**\n- Verificação de integridade de dados\n- Impressões digitais e deduplicação\n- Compatibilidade com sistemas legados"
  },
  "ar": {
    "what-is-ripemd-title": "ما هو RIPEMD-{bits}؟",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits}‏ (RACE Integrity Primitives Evaluation Message Digest) هي دالة تجزئة تشفيرية تُنتج قيمة تجزئة بطول {bits} بت ({bytes} بايت)، وعادةً ما تُعرض كرقم سداسي عشري مكوّن من {hex} حرفًا. وهي جزء من عائلة RIPEMD التي طُوِّرت في أوروبا كبديل لـ MD4/MD5.\n\n**الخصائص الرئيسية:**\n- **حتمية**: نفس الإدخال ينتج دائمًا نفس التجزئة\n- **حساب سريع**: سريعة الحساب لأي إدخال معطى\n- **تأثير الانهيار الجليدي**: تغييرات صغيرة في الإدخال تنتج مخرجات مختلفة تمامًا\n- **حجم خرج ثابت**: تنتج دائمًا تجزئة بطول {bits} بت بغض النظر عن حجم الإدخال\n- **أحادية الاتجاه**: من غير العملي حسابيًا استرجاع الإدخال الأصلي من التجزئة\n\n**الاستخدامات الشائعة:**\n- فحوصات سلامة البيانات\n- البصمة وإزالة التكرار\n- التوافق مع الأنظمة القديمة"
  },
  "hi": {
    "what-is-ripemd-title": "RIPEMD-{bits} क्या है?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) एक क्रिप्टोग्राफिक हैश फ़ंक्शन है जो {bits}-बिट ({bytes}-बाइट) हैश मान उत्पन्न करता है, जिसे आमतौर पर {hex}-अक्षरों की हेक्साडेसिमल संख्या के रूप में प्रदर्शित किया जाता है। यह यूरोप में विकसित RIPEMD परिवार का हिस्सा है जो MD4/MD5 के विकल्प के रूप में बनाया गया था।\n\n**मुख्य विशेषताएं:**\n- **निर्धारक**: समान इनपुट हमेशा समान हैश उत्पन्न करता है\n- **तेज़ गणना**: किसी भी दिए गए इनपुट के लिए तेज़ी से गणना\n- **हिमस्खलन प्रभाव**: इनपुट में छोटे बदलाव बेहद अलग आउटपुट उत्पन्न करते हैं\n- **स्थिर आउटपुट आकार**: इनपुट आकार की परवाह किए बिना हमेशा {bits}-बिट हैश\n- **एक-तरफ़ा**: हैश से मूल इनपुट निकालना गणनात्मक रूप से अव्यावहारिक है\n\n**सामान्य उपयोग:**\n- डेटा अखंडता जांच\n- फिंगरप्रिंटिंग और डिडुप्लिकेशन\n- विरासत सिस्टम संगतता"
  },
  "tr": {
    "what-is-ripemd-title": "RIPEMD-{bits} nedir?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest), {bits} bit ({bytes} bayt) hash değeri üreten kriptografik bir hash fonksiyonudur ve genellikle {hex} karakterlik onaltılık sayı olarak gösterilir. MD4/MD5'e alternatif olarak Avrupa'da geliştirilen RIPEMD ailesinin bir parçasıdır.\n\n**Temel özellikler:**\n- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir\n- **Hızlı hesaplama**: Herhangi bir verilen girdi için hızla hesaplanır\n- **Çığ etkisi**: Girdideki küçük değişiklikler büyük ölçüde farklı çıktılar üretir\n- **Sabit çıktı boyutu**: Girdi boyutundan bağımsız olarak her zaman {bits} bit hash üretir\n- **Tek yönlü**: Hash'ten orijinal girdiyi geri elde etmek hesaplamalı olarak mümkün değildir\n\n**Yaygın kullanımlar:**\n- Veri bütünlüğü kontrolleri\n- Parmak izi çıkarma ve yinelemeyi kaldırma\n- Eski sistem uyumluluğu"
  },
  "nl": {
    "what-is-ripemd-title": "Wat is RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) is een cryptografische hashfunctie die een hashwaarde van {bits} bits ({bytes} bytes) produceert, meestal weergegeven als een {hex}-karakterig hexadecimaal getal. Het is onderdeel van de in Europa ontwikkelde RIPEMD-familie als alternatief voor MD4/MD5.\n\n**Belangrijkste kenmerken:**\n- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash\n- **Snelle berekening**: Snel te berekenen voor elke gegeven invoer\n- **Lawine-effect**: Kleine veranderingen in invoer produceren drastisch verschillende uitvoer\n- **Vaste uitvoergrootte**: Produceert altijd een {bits}-bit hash ongeacht de invoergrootte\n- **Eenrichtings**: Het is computationeel onhaalbaar om de oorspronkelijke invoer uit de hash te herstellen\n\n**Veelvoorkomende toepassingen:**\n- Gegevensintegriteitscontroles\n- Vingerafdrukken en deduplicatie\n- Compatibiliteit met legacy-systemen"
  },
  "sv": {
    "what-is-ripemd-title": "Vad är RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) är en kryptografisk hashfunktion som producerar ett hashvärde på {bits} bitar ({bytes} byte), vanligtvis återgivet som ett {hex}-tecken hexadecimalt tal. Den ingår i RIPEMD-familjen som utvecklades i Europa som ett alternativ till MD4/MD5.\n\n**Nyckelegenskaper:**\n- **Deterministisk**: Samma inmatning producerar alltid samma hash\n- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst\n- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar\n- **Fast utmatningsstorlek**: Producerar alltid en {bits}-bitars hash oavsett inmatningsstorlek\n- **Enkelriktad**: Det är beräkningsmässigt omöjligt att återställa den ursprungliga inmatningen från hashen\n\n**Vanliga användningar:**\n- Kontroller av dataintegritet\n- Fingeravtryck och deduplicering\n- Kompatibilitet med äldre system"
  },
  "pl": {
    "what-is-ripemd-title": "Czym jest RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) to kryptograficzna funkcja skrótu, która produkuje wartość skrótu {bits}-bitową ({bytes} bajtów), zwykle przedstawianą jako {hex}-znakową liczbę szesnastkową. Jest częścią rodziny RIPEMD opracowanej w Europie jako alternatywa dla MD4/MD5.\n\n**Kluczowe cechy:**\n- **Deterministyczna**: To samo wejście zawsze produkuje ten sam skrót\n- **Szybkie obliczenia**: Szybkie do obliczenia dla dowolnego danego wejścia\n- **Efekt lawiny**: Małe zmiany w wejściu powodują drastycznie różne wyjścia\n- **Stały rozmiar wyjścia**: Zawsze produkuje {bits}-bitowy skrót niezależnie od rozmiaru wejścia\n- **Jednokierunkowa**: Odzyskanie oryginalnego wejścia ze skrótu jest obliczeniowo niepraktyczne\n\n**Powszechne zastosowania:**\n- Kontrole integralności danych\n- Fingerprinting i deduplikacja\n- Zgodność ze starszymi systemami"
  },
  "vi": {
    "what-is-ripemd-title": "RIPEMD-{bits} là gì?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) là một hàm băm mật mã tạo ra giá trị băm {bits}-bit ({bytes}-byte), thường được hiển thị dưới dạng số thập lục phân {hex} ký tự. Đây là một phần của họ RIPEMD được phát triển ở châu Âu như một lựa chọn thay thế cho MD4/MD5.\n\n**Đặc điểm chính:**\n- **Xác định**: Cùng một đầu vào luôn tạo ra cùng một băm\n- **Tính toán nhanh**: Nhanh chóng tính toán cho bất kỳ đầu vào nào\n- **Hiệu ứng tuyết lở**: Những thay đổi nhỏ trong đầu vào tạo ra đầu ra hoàn toàn khác biệt\n- **Kích thước đầu ra cố định**: Luôn tạo ra băm {bits}-bit bất kể kích thước đầu vào\n- **Một chiều**: Việc khôi phục đầu vào gốc từ băm là không khả thi về mặt tính toán\n\n**Sử dụng phổ biến:**\n- Kiểm tra tính toàn vẹn dữ liệu\n- Dấu vân tay và khử trùng lặp\n- Tương thích hệ thống cũ"
  },
  "th": {
    "what-is-ripemd-title": "RIPEMD-{bits} คืออะไร?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) เป็นฟังก์ชันแฮชเข้ารหัสที่สร้างค่าแฮช {bits} บิต ({bytes} ไบต์) ซึ่งมักแสดงเป็นตัวเลขฐานสิบหก {hex} ตัวอักษร เป็นส่วนหนึ่งของตระกูล RIPEMD ที่พัฒนาในยุโรปเพื่อเป็นทางเลือกแทน MD4/MD5\n\n**คุณลักษณะสำคัญ:**\n- **กำหนดได้**: อินพุตเดียวกันจะสร้างแฮชเดียวกันเสมอ\n- **การคำนวณที่รวดเร็ว**: คำนวณได้อย่างรวดเร็วสำหรับอินพุตใดก็ตาม\n- **เอฟเฟกต์หิมะถล่ม**: การเปลี่ยนแปลงเล็กน้อยในอินพุตจะสร้างเอาต์พุตที่แตกต่างอย่างมาก\n- **ขนาดเอาต์พุตคงที่**: สร้างแฮช {bits} บิตเสมอไม่ว่าขนาดอินพุตจะเป็นเท่าใด\n- **ทางเดียว**: การกู้คืนอินพุตต้นฉบับจากแฮชทำได้ยากมากในเชิงคำนวณ\n\n**การใช้งานทั่วไป:**\n- การตรวจสอบความสมบูรณ์ของข้อมูล\n- การทำฟิงเกอร์พริ้นต์และการลบข้อมูลซ้ำ\n- ความเข้ากันได้กับระบบเดิม"
  },
  "id": {
    "what-is-ripemd-title": "Apa itu RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) adalah fungsi hash kriptografi yang menghasilkan nilai hash {bits}-bit ({bytes}-byte), biasanya ditampilkan sebagai angka heksadesimal {hex} karakter. Ini adalah bagian dari keluarga RIPEMD yang dikembangkan di Eropa sebagai alternatif untuk MD4/MD5.\n\n**Karakteristik utama:**\n- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama\n- **Komputasi cepat**: Cepat dihitung untuk input apa pun\n- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda\n- **Ukuran output tetap**: Selalu menghasilkan hash {bits}-bit terlepas dari ukuran input\n- **Satu arah**: Memulihkan input asli dari hash tidak praktis secara komputasi\n\n**Penggunaan umum:**\n- Pemeriksaan integritas data\n- Fingerprinting dan deduplikasi\n- Kompatibilitas sistem lama"
  },
  "he": {
    "what-is-ripemd-title": "מה זה RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits}‏ (RACE Integrity Primitives Evaluation Message Digest) הוא פונקציית האש קריפטוגרפית שמייצרת ערך האש באורך {bits} ביט ({bytes} בייט), בדרך כלל מוצג כמספר הקסדצימלי בן {hex} תווים. הוא חלק ממשפחת RIPEMD שפותחה באירופה כחלופה ל‑MD4/MD5.\n\n**מאפיינים עיקריים:**\n- **דטרמיניסטי**: אותו קלט תמיד מייצר אותו האש\n- **חישוב מהיר**: מהיר לחישוב עבור כל קלט נתון\n- **אפקט מפולת**: שינויים קטנים בקלט מייצרים פלטים שונים בתכלית\n- **גודל פלט קבוע**: תמיד מייצר האש באורך {bits} ביט ללא קשר לגודל הקלט\n- **חד‑כיווניות**: שחזור הקלט המקורי מתוך ההאש אינו מעשי חישובית\n\n**שימושים נפוצים:**\n- בדיקות שלמות נתונים\n- טביעת אצבע והסרת כפילויות\n- תאימות למערכות ישנות"
  },
  "ms": {
    "what-is-ripemd-title": "Apakah RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) ialah fungsi hash kriptografi yang menghasilkan nilai hash {bits}-bit ({bytes}-bait), biasanya dipaparkan sebagai nombor heksadesimal {hex} aksara. Ia merupakan sebahagian daripada keluarga RIPEMD yang dibangunkan di Eropah sebagai alternatif kepada MD4/MD5.\n\n**Ciri-ciri utama:**\n- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama\n- **Pengiraan pantas**: Pantas dikira untuk sebarang input yang diberikan\n- **Kesan runtuhan salji**: Perubahan kecil dalam input menghasilkan output yang sangat berbeza\n- **Saiz output tetap**: Sentiasa menghasilkan hash {bits}-bit tanpa mengira saiz input\n- **Sehala**: Mendapatkan kembali input asal daripada hash adalah tidak praktikal secara pengiraan\n\n**Kegunaan biasa:**\n- Pemeriksaan integriti data\n- Cap jari dan penyahpenduaan\n- Keserasian sistem lama"
  },
  "no": {
    "what-is-ripemd-title": "Hva er RIPEMD-{bits}?",
    "what-is-ripemd-description-markdown": "RIPEMD-{bits} (RACE Integrity Primitives Evaluation Message Digest) er en kryptografisk hash-funksjon som produserer en hashverdi på {bits} biter ({bytes} byte), vanligvis gjengitt som et {hex}-tegn heksadesimalt tall. Den er en del av RIPEMD-familien som ble utviklet i Europa som et alternativ til MD4/MD5.\n\n**Nøkkelegenskaper:**\n- **Deterministisk**: Samme inndata produserer alltid samme hash\n- **Rask beregning**: Rask å beregne for enhver gitt inndata\n- **Snøskredeffekt**: Små endringer i inndata produserer drastisk forskjellige utdata\n- **Fast utmatningsstørrelse**: Produserer alltid en {bits}-bits hash uavhengig av inndata-størrelse\n- **Enveis**: Det er beregningsmessig upraktisk å gjenopprette original inndata fra hashen\n\n**Vanlige bruksområder:**\n- Kontroller av dataintegritet\n- Fingeravtrykk og deduplisering\n- Kompatibilitet med eldre systemer"
  }
}
</i18n>
