<template>
  <DescriptionMarkdown
    :title="t('what-is-sha224')"
    :description="t('what-is-sha224-description-markdown')"
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
    "what-is-sha224": "What is SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) is a cryptographic hash function that produces a 224-bit (28-byte) hash value, typically rendered as a 56-character hexadecimal number. It is part of the SHA-2 family of hash functions designed by the NSA and published by NIST.\n\n**Key characteristics:**\n- **Deterministic**: The same input always produces the same hash\n- **Fast computation**: Quick to compute for any given input\n- **Avalanche effect**: Small changes in input produce drastically different outputs\n- **Irreversible**: Computationally infeasible to reverse the hash to find the original input\n- **Collision resistant**: Very difficult to find two different inputs that produce the same hash\n\n**Common uses:**\n- Digital signatures and certificates\n- Blockchain and cryptocurrency (some systems use SHA-224)\n- Password storage (with proper salting)\n- File integrity verification\n- Proof of work algorithms"
  },
  "zh": {
    "what-is-sha224": "什么是 SHA-224？",
    "what-is-sha224-description-markdown": "SHA-224（安全散列算法 224 位）是一种加密散列函数，产生 224 位（28 字节）的散列值，通常呈现为 56 个字符的十六进制数。它是由 NSA 设计并由 NIST 发布的 SHA-2 散列函数系列的一部分。\n\n**主要特征：**\n- **确定性**：相同的输入总是产生相同的散列\n- **快速计算**：对于任何给定输入都能快速计算\n- **雪崩效应**：输入的微小变化会产生截然不同的输出\n- **不可逆**：从散列反推原始输入在计算上是不可行的\n- **抗碰撞**：很难找到产生相同散列的两个不同输入\n\n**常见用途：**\n- 数字签名和证书\n- 区块链和加密货币（一些系统使用 SHA-224）\n- 密码存储（配合适当的加盐）\n- 文件完整性验证\n- 工作量证明算法"
  },
  "zh-CN": {
    "what-is-sha224": "什么是 SHA-224？",
    "what-is-sha224-description-markdown": "SHA-224（安全散列算法 224 位）是一种加密散列函数，产生 224 位（28 字节）的散列值，通常呈现为 56 个字符的十六进制数。它是由 NSA 设计并由 NIST 发布的 SHA-2 散列函数系列的一部分。\n\n**主要特征：**\n- **确定性**：相同的输入总是产生相同的散列\n- **快速计算**：对于任何给定输入都能快速计算\n- **雪崩效应**：输入的微小变化会产生截然不同的输出\n- **不可逆**：从散列反推原始输入在计算上是不可行的\n- **抗碰撞**：很难找到产生相同散列的两个不同输入\n\n**常见用途：**\n- 数字签名和证书\n- 区块链和加密货币（一些系统使用 SHA-224）\n- 密码存储（配合适当的加盐）\n- 文件完整性验证\n- 工作量证明算法"
  },
  "zh-TW": {
    "what-is-sha224": "什麼是 SHA-224？",
    "what-is-sha224-description-markdown": "SHA-224（安全雜湊演算法 224 位元）是一種加密雜湊函數，產生 224 位元（28 位元組）的雜湊值，通常呈現為 56 個字元的十六進位數。它是由 NSA 設計並由 NIST 發布的 SHA-2 雜湊函數系列的一部分。\n\n**主要特徵：**\n- **確定性**：相同的輸入總是產生相同的雜湊\n- **快速計算**：對於任何給定輸入都能快速計算\n- **雪崩效應**：輸入的微小變化會產生截然不同的輸出\n- **不可逆**：從雜湊反推原始輸入在計算上是不可行的\n- **抗碰撞**：很難找到產生相同雜湊的兩個不同輸入\n\n**常見用途：**\n- 數位簽章和憑證\n- 區塊鏈和加密貨幣（一些系統使用 SHA-224）\n- 密碼儲存（配合適當的加鹽）\n- 檔案完整性驗證\n- 工作量證明演算法"
  },
  "zh-HK": {
    "what-is-sha224": "什麼是 SHA-224？",
    "what-is-sha224-description-markdown": "SHA-224（安全雜湊演算法 224 位元）是一種加密雜湊函數，產生 224 位元（28 位元組）的雜湊值，通常呈現為 56 個字元的十六進位數。它是由 NSA 設計並由 NIST 發布的 SHA-2 雜湊函數系列的一部分。\n\n**主要特徵：**\n- **確定性**：相同的輸入總是產生相同的雜湊\n- **快速計算**：對於任何給定輸入都能快速計算\n- **雪崩效應**：輸入的微小變化會產生截然不同的輸出\n- **不可逆**：從雜湊反推原始輸入在計算上是不可行的\n- **抗碰撞**：很難找到產生相同雜湊的兩個不同輸入\n\n**常見用途：**\n- 數碼簽署和證書\n- 區塊鏈和加密貨幣（一些系統使用 SHA-224）\n- 密碼儲存（配合適當的加鹽）\n- 檔案完整性驗證\n- 工作量證明演算法"
  },
  "es": {
    "what-is-sha224": "¿Qué es SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Algoritmo de Hash Seguro de 224 bits) es una función hash criptográfica que produce un valor hash de 224 bits (28 bytes), típicamente representado como un número hexadecimal de 56 caracteres. Es parte de la familia de funciones hash SHA-2 diseñadas por la NSA y publicadas por el NIST.\n\n**Características clave:**\n- **Determinístico**: La misma entrada siempre produce el mismo hash\n- **Computación rápida**: Rápido de calcular para cualquier entrada dada\n- **Efecto avalancha**: Pequeños cambios en la entrada producen salidas drásticamente diferentes\n- **Irreversible**: Es computacionalmente inviable revertir el hash para encontrar la entrada original\n- **Resistente a colisiones**: Muy difícil encontrar dos entradas diferentes que produzcan el mismo hash\n\n**Usos comunes:**\n- Firmas digitales y certificados\n- Blockchain y criptomonedas (algunos sistemas usan SHA-224)\n- Almacenamiento de contraseñas (con salado apropiado)\n- Verificación de integridad de archivos\n- Algoritmos de prueba de trabajo"
  },
  "fr": {
    "what-is-sha224": "Qu'est-ce que SHA-224 ?",
    "what-is-sha224-description-markdown": "SHA-224 (Algorithme de Hachage Sécurisé 224-bit) est une fonction de hachage cryptographique qui produit une valeur de hachage de 224 bits (28 octets), généralement rendue sous forme d'un nombre hexadécimal de 56 caractères. Il fait partie de la famille des fonctions de hachage SHA-2 conçues par la NSA et publiées par le NIST.\n\n**Caractéristiques clés :**\n- **Déterministe** : La même entrée produit toujours le même hachage\n- **Calcul rapide** : Rapide à calculer pour toute entrée donnée\n- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes\n- **Irréversible** : Il est informatiquement impossible d'inverser le hachage pour trouver l'entrée originale\n- **Résistant aux collisions** : Très difficile de trouver deux entrées différentes qui produisent le même hachage\n\n**Utilisations courantes :**\n- Signatures numériques et certificats\n- Blockchain et cryptomonnaies (certains systèmes utilisent SHA-224)\n- Stockage de mots de passe (avec salage approprié)\n- Vérification d'intégrité de fichiers\n- Algorithmes de preuve de travail"
  },
  "de": {
    "what-is-sha224": "Was ist SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-Bit) ist eine kryptographische Hash-Funktion, die einen 224-Bit (28-Byte) Hash-Wert erzeugt, der typischerweise als 56-stellige Hexadezimalzahl dargestellt wird. Es ist Teil der SHA-2-Familie von Hash-Funktionen, die von der NSA entworfen und vom NIST veröffentlicht wurden.\n\n**Hauptmerkmale:**\n- **Deterministisch**: Dieselbe Eingabe erzeugt immer denselben Hash\n- **Schnelle Berechnung**: Schnell zu berechnen für jede gegebene Eingabe\n- **Lawineneffekt**: Kleine Änderungen in der Eingabe erzeugen drastisch unterschiedliche Ausgaben\n- **Irreversibel**: Rechnerisch nicht machbar, den Hash umzukehren, um die ursprüngliche Eingabe zu finden\n- **Kollisionsresistent**: Sehr schwierig, zwei verschiedene Eingaben zu finden, die denselben Hash erzeugen\n\n**Häufige Verwendungen:**\n- Digitale Signaturen und Zertifikate\n- Blockchain und Kryptowährungen (einige Systeme verwenden SHA-224)\n- Passwort-Speicherung (mit angemessenem Salting)\n- Datei-Integritätsprüfung\n- Proof-of-Work-Algorithmen"
  },
  "it": {
    "what-is-sha224": "Cos'è SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) è una funzione hash crittografica che produce un valore hash di 224 bit (28 byte), tipicamente rappresentato come un numero esadecimale di 56 caratteri. Fa parte della famiglia di funzioni hash SHA-2 progettate dalla NSA e pubblicate dal NIST.\n\n**Caratteristiche chiave:**\n- **Deterministico**: Lo stesso input produce sempre lo stesso hash\n- **Calcolo veloce**: Veloce da calcolare per qualsiasi input dato\n- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi\n- **Irreversibile**: Computazionalmente impossibile invertire l'hash per trovare l'input originale\n- **Resistente alle collisioni**: Molto difficile trovare due input diversi che producano lo stesso hash\n\n**Usi comuni:**\n- Firme digitali e certificati\n- Blockchain e criptovalute (alcuni sistemi usano SHA-224)\n- Archiviazione password (con salting appropriato)\n- Verifica dell'integrità dei file\n- Algoritmi proof-of-work"
  },
  "ja": {
    "what-is-sha224": "SHA-224とは？",
    "what-is-sha224-description-markdown": "SHA-224（Secure Hash Algorithm 224ビット）は、224ビット（28バイト）のハッシュ値を生成する暗号学的ハッシュ関数で、通常56文字の16進数として表示されます。NSAによって設計され、NISTによって公開されたSHA-2ハッシュ関数ファミリーの一部です。\n\n**主な特徴：**\n- **決定論的**：同じ入力は常に同じハッシュを生成\n- **高速計算**：任意の入力に対して高速に計算\n- **雪崩効果**：入力の小さな変化が劇的に異なる出力を生成\n- **不可逆**：ハッシュを逆算して元の入力を見つけることは計算上不可能\n- **衝突耐性**：同じハッシュを生成する2つの異なる入力を見つけることは非常に困難\n\n**一般的な用途：**\n- デジタル署名と証明書\n- ブロックチェーンと暗号通貨（一部のシステムでSHA-224を使用）\n- パスワード保存（適切なソルト付き）\n- ファイル整合性検証\n- プルーフオブワークアルゴリズム"
  },
  "ko": {
    "what-is-sha224": "SHA-224이란?",
    "what-is-sha224-description-markdown": "SHA-224(Secure Hash Algorithm 224비트)은 224비트(28바이트) 해시 값을 생성하는 암호화 해시 함수로, 일반적으로 56자리 16진수로 표현됩니다. NSA에서 설계하고 NIST에서 발표한 SHA-2 해시 함수 계열의 일부입니다.\n\n**주요 특징:**\n- **결정론적**: 동일한 입력은 항상 동일한 해시를 생성\n- **빠른 계산**: 주어진 입력에 대해 빠르게 계산\n- **눈사태 효과**: 입력의 작은 변화가 완전히 다른 출력을 생성\n- **비가역적**: 해시를 역산하여 원본 입력을 찾는 것은 계산적으로 불가능\n- **충돌 저항성**: 동일한 해시를 생성하는 두 개의 다른 입력을 찾기 매우 어려움\n\n**일반적인 용도:**\n- 디지털 서명 및 인증서\n- 블록체인 및 암호화폐(일부 시스템에서 SHA-224 사용)\n- 비밀번호 저장(적절한 솔팅과 함께)\n- 파일 무결성 검증\n- 작업 증명 알고리즘"
  },
  "ru": {
    "what-is-sha224": "Что такое SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) — это криптографическая хеш-функция, которая производит 224-битное (28-байтовое) хеш-значение, обычно представляемое как 56-символьное шестнадцатеричное число. Это часть семейства хеш-функций SHA-2, разработанных АНБ и опубликованных NIST.\n\n**Ключевые характеристики:**\n- **Детерминированность**: Одинаковый ввод всегда производит одинаковый хеш\n- **Быстрое вычисление**: Быстро вычисляется для любого заданного ввода\n- **Эффект лавины**: Небольшие изменения во вводе производят кардинально разные выводы\n- **Необратимость**: Вычислительно невозможно обратить хеш для поиска исходного ввода\n- **Устойчивость к коллизиям**: Очень сложно найти два разных ввода, которые производят одинаковый хеш\n\n**Обычные применения:**\n- Цифровые подписи и сертификаты\n- Блокчейн и криптовалюты (некоторые системы используют SHA-224)\n- Хранение паролей (с соответствующим солением)\n- Проверка целостности файлов\n- Алгоритмы доказательства работы"
  },
  "pt": {
    "what-is-sha224": "O que é SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) é uma função hash criptográfica que produz um valor hash de 224 bits (28 bytes), tipicamente renderizado como um número hexadecimal de 56 caracteres. Faz parte da família de funções hash SHA-2 projetadas pela NSA e publicadas pelo NIST.\n\n**Características principais:**\n- **Determinístico**: A mesma entrada sempre produz o mesmo hash\n- **Computação rápida**: Rápido de calcular para qualquer entrada dada\n- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes\n- **Irreversível**: Computacionalmente inviável reverter o hash para encontrar a entrada original\n- **Resistente a colisões**: Muito difícil encontrar duas entradas diferentes que produzam o mesmo hash\n\n**Usos comuns:**\n- Assinaturas digitais e certificados\n- Blockchain e criptomoedas (alguns sistemas usam SHA-224)\n- Armazenamento de senhas (com salting apropriado)\n- Verificação de integridade de arquivos\n- Algoritmos de prova de trabalho"
  },
  "ar": {
    "what-is-sha224": "ما هو SHA-224؟",
    "what-is-sha224-description-markdown": "SHA-224 (خوارزمية التشفير الآمنة 224 بت) هي دالة تشفير تنتج قيمة تشفير بحجم 224 بت (28 بايت)، وتُعرض عادة كرقم سادس عشر مكون من 56 حرفاً. وهي جزء من عائلة دوال التشفير SHA-2 التي صممتها وكالة الأمن القومي ونشرتها المعهد الوطني للمعايير والتكنولوجيا.\n\n**الخصائص الرئيسية:**\n- **حتمية**: نفس المدخل ينتج دائماً نفس التشفير\n- **حوسبة سريعة**: سريعة الحساب لأي مدخل معطى\n- **تأثير الانهيار الجليدي**: تغييرات صغيرة في المدخل تنتج مخرجات مختلفة تماماً\n- **غير قابلة للعكس**: من المستحيل حاسوبياً عكس التشفير لإيجاد المدخل الأصلي\n- **مقاومة للتصادمات**: صعب جداً إيجاد مدخلين مختلفين ينتجان نفس التشفير\n\n**الاستخدامات الشائعة:**\n- التوقيعات الرقمية والشهادات\n- البلوك تشين والعملات المشفرة (بعض الأنظمة تستخدم SHA-224)\n- تخزين كلمات المرور (مع التمليح المناسب)\n- التحقق من سلامة الملفات\n- خوارزميات إثبات العمل"
  },
  "hi": {
    "what-is-sha224": "SHA-224 क्या है?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) एक क्रिप्टोग्राफिक हैश फ़ंक्शन है जो 224-बिट (28-बाइट) हैश वैल्यू उत्पन्न करता है, जो आमतौर पर 56-वर्ण हेक्साडेसिमल संख्या के रूप में प्रस्तुत होता है। यह NSA द्वारा डिज़ाइन किए गए और NIST द्वारा प्रकाशित SHA-2 हैश फ़ंक्शन परिवार का हिस्सा है।\n\n**मुख्य विशेषताएं:**\n- **निर्धारक**: समान इनपुट हमेशा समान हैश उत्पन्न करता है\n- **तेज़ गणना**: किसी भी दिए गए इनपुट के लिए तेज़ी से गणना\n- **हिमस्खलन प्रभाव**: इनपुट में छोटे बदलाव बेहद अलग आउटपुट उत्पन्न करते हैं\n- **अपरिवर्तनीय**: मूल इनपुट खोजने के लिए हैश को उलटना कम्प्यूटेशनल रूप से असंभव\n- **टक्कर प्रतिरोधी**: समान हैश उत्पन्न करने वाले दो अलग इनपुट खोजना बहुत कठिन\n\n**सामान्य उपयोग:**\n- डिजिटल हस्ताक्षर और प्रमाणपत्र\n- ब्लॉकचेन और क्रिप्टोकरेंसी (कुछ सिस्टम SHA-224 का उपयोग करते हैं)\n- पासवर्ड भंडारण (उचित नमकीन के साथ)\n- फ़ाइल अखंडता सत्यापन\n- कार्य प्रमाण एल्गोरिदम"
  },
  "tr": {
    "what-is-sha224": "SHA-224 nedir?",
    "what-is-sha224-description-markdown": "SHA-224 (Güvenli Hash Algoritması 224-bit), tipik olarak 56 karakterlik onaltılık sayı olarak gösterilen 224-bit (28-bayt) hash değeri üreten kriptografik bir hash fonksiyonudur. NSA tarafından tasarlanan ve NIST tarafından yayınlanan SHA-2 hash fonksiyon ailesinin bir parçasıdır.\n\n**Temel özellikler:**\n- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir\n- **Hızlı hesaplama**: Herhangi bir verilen girdi için hızla hesaplanır\n- **Çığ etkisi**: Girdideki küçük değişiklikler büyük ölçüde farklı çıktılar üretir\n- **Geri döndürülemez**: Hash'i tersine çevirerek orijinal girdiyi bulmak hesaplamalı olarak mümkün değildir\n- **Çarpışma dirençli**: Aynı hash'i üreten iki farklı girdi bulmak çok zordur\n\n**Yaygın kullanımlar:**\n- Dijital imzalar ve sertifikalar\n- Blok zinciri ve kripto para birimleri (bazı sistemler SHA-224 kullanır)\n- Şifre depolama (uygun tuzlama ile)\n- Dosya bütünlüğü doğrulama\n- İş kanıtı algoritmaları"
  },
  "nl": {
    "what-is-sha224": "Wat is SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) is een cryptografische hashfunctie die een 224-bit (28-byte) hashwaarde produceert, doorgaans weergegeven als een 56-karakter hexadecimaal getal. Het is onderdeel van de SHA-2 familie van hashfuncties ontworpen door de NSA en gepubliceerd door NIST.\n\n**Belangrijkste kenmerken:**\n- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash\n- **Snelle berekening**: Snel te berekenen voor elke gegeven invoer\n- **Lawine-effect**: Kleine veranderingen in invoer produceren drastisch verschillende uitvoer\n- **Onomkeerbaar**: Computationeel onhaalbaar om de hash om te keren om de oorspronkelijke invoer te vinden\n- **Botsingsbestendig**: Zeer moeilijk om twee verschillende invoeren te vinden die dezelfde hash produceren\n\n**Veelvoorkomende toepassingen:**\n- Digitale handtekeningen en certificaten\n- Blockchain en cryptocurrency (sommige systemen gebruiken SHA-224)\n- Wachtwoordopslag (met juiste zouting)\n- Bestandsintegriteitsverificatie\n- Proof-of-work algoritmes"
  },
  "sv": {
    "what-is-sha224": "Vad är SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) är en kryptografisk hashfunktion som producerar ett 224-bitars (28-byte) hashvärde, vanligtvis återgivet som ett 56-tecken hexadecimalt tal. Det är en del av SHA-2-familjen av hashfunktioner designade av NSA och publicerade av NIST.\n\n**Nyckelegenskaper:**\n- **Deterministisk**: Samma inmatning producerar alltid samma hash\n- **Snabb beräkning**: Snabb att beräkna för vilken given inmatning som helst\n- **Lavineffekt**: Små förändringar i inmatningen producerar drastiskt olika utmatningar\n- **Irreversibel**: Beräkningsmässigt omöjligt att vända hashen för att hitta den ursprungliga inmatningen\n- **Kollisionsresistent**: Mycket svårt att hitta två olika inmatningar som producerar samma hash\n\n**Vanliga användningar:**\n- Digitala signaturer och certifikat\n- Blockkedja och kryptovalutor (vissa system använder SHA-224)\n- Lösenordslagring (med lämplig saltning)\n- Filintegritetsverifiering\n- Proof-of-work algoritmer"
  },
  "pl": {
    "what-is-sha224": "Czym jest SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) to kryptograficzna funkcja skrótu, która produkuje 224-bitową (28-bajtową) wartość skrótu, zazwyczaj przedstawianą jako 56-znakową liczbę szesnastkową. Jest częścią rodziny funkcji skrótu SHA-2 zaprojektowanych przez NSA i opublikowanych przez NIST.\n\n**Kluczowe cechy:**\n- **Deterministyczna**: To samo wejście zawsze produkuje ten sam skrót\n- **Szybkie obliczenia**: Szybkie do obliczenia dla dowolnego danego wejścia\n- **Efekt lawiny**: Małe zmiany w wejściu powodują drastycznie różne wyjścia\n- **Nieodwracalna**: Obliczeniowo niemożliwe do odwrócenia skrótu w celu znalezienia oryginalnego wejścia\n- **Odporna na kolizje**: Bardzo trudno znaleźć dwa różne wejścia, które produkują ten sam skrót\n\n**Powszechne zastosowania:**\n- Podpisy cyfrowe i certyfikaty\n- Blockchain i kryptowaluty (niektóre systemy używają SHA-224)\n- Przechowywanie haseł (z odpowiednim soleniem)\n- Weryfikacja integralności plików\n- Algorytmy proof-of-work"
  },
  "vi": {
    "what-is-sha224": "SHA-224 là gì?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) là một hàm băm mật mã tạo ra giá trị băm 224-bit (28-byte), thường được hiển thị dưới dạng số thập lục phân 56 ký tự. Nó là một phần của họ hàm băm SHA-2 được thiết kế bởi NSA và xuất bản bởi NIST.\n\n**Đặc điểm chính:**\n- **Xác định**: Cùng một đầu vào luôn tạo ra cùng một băm\n- **Tính toán nhanh**: Nhanh chóng tính toán cho bất kỳ đầu vào nào\n- **Hiệu ứng tuyết lở**: Những thay đổi nhỏ trong đầu vào tạo ra đầu ra hoàn toàn khác biệt\n- **Không thể đảo ngược**: Không thể tính toán để đảo ngược băm để tìm đầu vào gốc\n- **Chống va chạm**: Rất khó tìm hai đầu vào khác nhau tạo ra cùng một băm\n\n**Sử dụng phổ biến:**\n- Chữ ký số và chứng chỉ\n- Blockchain và tiền điện tử (một số hệ thống sử dụng SHA-224)\n- Lưu trữ mật khẩu (với muối thích hợp)\n- Xác minh tính toàn vẹn tệp\n- Thuật toán proof-of-work"
  },
  "th": {
    "what-is-sha224": "SHA-224 คืออะไร?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) เป็นฟังก์ชันแฮชเข้ารหัสที่สร้างค่าแฮช 224-บิต (28-ไบต์) ซึ่งมักแสดงเป็นตัวเลขฐานสิบหก 56 ตัวอักษร เป็นส่วนหนึ่งของตระกูลฟังก์ชันแฮช SHA-2 ที่ออกแบบโดย NSA และเผยแพร่โดย NIST\n\n**คุณลักษณะสำคัญ:**\n- **กำหนดได้**: อินพุตเดียวกันจะสร้างแฮชเดียวกันเสมอ\n- **การคำนวณที่รวดเร็ว**: คำนวณได้อย่างรวดเร็วสำหรับอินพุตใดก็ตาม\n- **เอฟเฟกต์หิมะถล่ม**: การเปลี่ยนแปลงเล็กน้อยในอินพุตจะสร้างเอาต์พุตที่แตกต่างอย่างมาก\n- **ไม่สามารถย้อนกลับได้**: ไม่สามารถคำนวณเพื่อย้อนกลับแฮชเพื่อหาอินพุตต้นฉบับได้\n- **ต้านทานการชน**: หาอินพุตสองตัวที่แตกต่างกันแต่สร้างแฮชเดียวกันได้ยากมาก\n\n**การใช้งานทั่วไป:**\n- ลายเซ็นดิจิทัลและใบรับรอง\n- บล็อกเชนและสกุลเงินดิจิทัล (บางระบบใช้ SHA-224)\n- การจัดเก็บรหัสผ่าน (ด้วยการเกลือที่เหมาะสม)\n- การตรวจสอบความสมบูรณ์ของไฟล์\n- อัลกอริทึม proof-of-work"
  },
  "id": {
    "what-is-sha224": "Apa itu SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) adalah fungsi hash kriptografi yang menghasilkan nilai hash 224-bit (28-byte), biasanya ditampilkan sebagai angka heksadesimal 56 karakter. Ini adalah bagian dari keluarga fungsi hash SHA-2 yang dirancang oleh NSA dan diterbitkan oleh NIST.\n\n**Karakteristik utama:**\n- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama\n- **Komputasi cepat**: Cepat dihitung untuk input apa pun\n- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda\n- **Tidak dapat dibalik**: Secara komputasi tidak mungkin membalik hash untuk menemukan input asli\n- **Tahan collision**: Sangat sulit menemukan dua input berbeda yang menghasilkan hash yang sama\n\n**Penggunaan umum:**\n- Tanda tangan digital dan sertifikat\n- Blockchain dan cryptocurrency (beberapa sistem menggunakan SHA-224)\n- Penyimpanan kata sandi (dengan salting yang tepat)\n- Verifikasi integritas file\n- Algoritma proof-of-work"
  },
  "he": {
    "what-is-sha224": "מה זה SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) הוא פונקציית האש קריפטוגרפית המייצרת ערך האש של 224-ביט (28-בייט), המוצג בדרך כלל כמספר הקסדצימלי של 56 תווים. זה חלק ממשפחת פונקציות ההאש SHA-2 שעוצבו על ידי ה-NSA ופורסמו על ידי NIST.\n\n**מאפיינים עיקריים:**\n- **דטרמיניסטי**: אותו קלט תמיד מייצר אותו האש\n- **חישוב מהיר**: מהיר לחישוב עבור כל קלט נתון\n- **אפקט מפולת**: שינויים קטנים בקלט מייצרים פלטים שונים בתכלית\n- **בלתי הפיך**: בלתי אפשרי חישובית להפוך את ההאש כדי למצוא את הקלט המקורי\n- **עמיד להתנגשויות**: קשה מאוד למצוא שני קלטים שונים המייצרים אותו האש\n\n**שימושים נפוצים:**\n- חתימות דיגיטליות ותעודות\n- בלוקצ'יין ומטבעות קריפטו (מערכות מסוימות משתמשות ב-SHA-224)\n- אחסון סיסמאות (עם המלחה מתאימה)\n- אימות תקינות קבצים\n- אלגוריתמי הוכחת עבודה"
  },
  "ms": {
    "what-is-sha224": "Apakah SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) adalah fungsi hash kriptografi yang menghasilkan nilai hash 224-bit (28-byte), biasanya dipaparkan sebagai nombor heksadesimal 56 aksara. Ia adalah sebahagian daripada keluarga fungsi hash SHA-2 yang direka oleh NSA dan diterbitkan oleh NIST.\n\n**Ciri-ciri utama:**\n- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama\n- **Pengiraan pantas**: Pantas dikira untuk sebarang input yang diberikan\n- **Kesan runtuhan salji**: Perubahan kecil dalam input menghasilkan output yang sangat berbeza\n- **Tidak boleh dibalik**: Mustahil secara pengiraan untuk membalikkan hash untuk mencari input asal\n- **Tahan perlanggaran**: Sangat sukar untuk mencari dua input berbeza yang menghasilkan hash yang sama\n\n**Kegunaan biasa:**\n- Tandatangan digital dan sijil\n- Blockchain dan mata wang kripto (sesetengah sistem menggunakan SHA-224)\n- Penyimpanan kata laluan (dengan penggaraman yang sesuai)\n- Pengesahan integriti fail\n- Algoritma bukti kerja"
  },
  "no": {
    "what-is-sha224": "Hva er SHA-224?",
    "what-is-sha224-description-markdown": "SHA-224 (Secure Hash Algorithm 224-bit) er en kryptografisk hash-funksjon som produserer en 224-bits (28-byte) hash-verdi, vanligvis gjengitt som et 56-tegn heksadesimalt tall. Det er en del av SHA-2-familien av hash-funksjoner designet av NSA og publisert av NIST.\n\n**Nøkkelegenskaper:**\n- **Deterministisk**: Samme inndata produserer alltid samme hash\n- **Rask beregning**: Rask å beregne for enhver gitt inndata\n- **Snøskredeffekt**: Små endringer i inndata produserer drastisk forskjellige utdata\n- **Irreversibel**: Beregningsmessig umulig å reversere hashen for å finne opprinnelig inndata\n- **Kollisjonsresistent**: Svært vanskelig å finne to forskjellige inndata som produserer samme hash\n\n**Vanlige bruksområder:**\n- Digitale signaturer og sertifikater\n- Blokkjede og kryptovalutaer (noen systemer bruker SHA-224)\n- Passordlagring (med passende salting)\n- Filintegritetsverifisering\n- Proof-of-work algoritmer"
  }
}
</i18n>
