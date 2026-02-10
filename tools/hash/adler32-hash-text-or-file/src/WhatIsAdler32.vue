<template>
  <DescriptionMarkdown
    :title="t('what-is-adler32')"
    :description="t('what-is-adler32-description-markdown')"
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
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that outputs a 32-bit value (usually 8 hexadecimal characters). It is designed for accidental error detection, not for cryptographic security.\n\n**Key points:**\n- **Fast and deterministic**: The same input always returns the same output\n- **Integrity check**: Useful for transfer or storage corruption detection\n- **Not cryptographic**: Do not use for passwords, signatures, or anti-tampering\n\n**Common uses:**\n- File transfer checks\n- Archive/package verification\n- Lightweight integrity checks"
  },
  "zh": {
    "what-is-adler32": "什么是 Adler-32？",
    "what-is-adler32-description-markdown": "Adler-32 是一种快速校验和算法，输出 32 位结果（通常显示为 8 个十六进制字符）。它主要用于检测意外错误，不适用于加密安全场景。\n\n**关键点：**\n- **速度快且确定性强**：相同输入总会得到相同输出\n- **完整性校验**：适合检测传输或存储中的数据损坏\n- **非密码学算法**：不应用于密码、签名或防篡改\n\n**常见用途：**\n- 文件传输校验\n- 压缩包/归档文件校验\n- 轻量级完整性检查"
  },
  "zh-CN": {
    "what-is-adler32": "什么是 Adler-32？",
    "what-is-adler32-description-markdown": "Adler-32 是一种快速校验和算法，输出 32 位结果（通常显示为 8 个十六进制字符）。它主要用于检测意外错误，不适用于加密安全场景。\n\n**关键点：**\n- **速度快且确定性强**：相同输入总会得到相同输出\n- **完整性校验**：适合检测传输或存储中的数据损坏\n- **非密码学算法**：不应用于密码、签名或防篡改\n\n**常见用途：**\n- 文件传输校验\n- 压缩包/归档文件校验\n- 轻量级完整性检查"
  },
  "zh-TW": {
    "what-is-adler32": "什麼是 Adler-32？",
    "what-is-adler32-description-markdown": "Adler-32 是一種快速校驗和演算法，輸出 32 位元結果（通常顯示為 8 個十六進位字元）。它主要用於偵測意外錯誤，不適用於密碼學安全情境。\n\n**重點：**\n- **速度快且具決定性**：相同輸入一定得到相同輸出\n- **完整性檢查**：適合偵測傳輸或儲存中的資料損壞\n- **非密碼學演算法**：不應用於密碼、簽章或防竄改\n\n**常見用途：**\n- 檔案傳輸校驗\n- 壓縮檔/封裝檔校驗\n- 輕量級完整性檢查"
  },
  "zh-HK": {
    "what-is-adler32": "什麼是 Adler-32？",
    "what-is-adler32-description-markdown": "Adler-32 是一種快速校驗和演算法，輸出 32 位元結果（通常顯示為 8 個十六進位字元）。它主要用於偵測意外錯誤，不適用於密碼學安全情境。\n\n**重點：**\n- **速度快且具決定性**：相同輸入一定得到相同輸出\n- **完整性檢查**：適合偵測傳輸或儲存中的資料損壞\n- **非密碼學演算法**：不應用於密碼、簽章或防竄改\n\n**常見用途：**\n- 檔案傳輸校驗\n- 壓縮檔/封裝檔校驗\n- 輕量級完整性檢查"
  },
  "es": {
    "what-is-adler32": "¿Qué es Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 es un algoritmo de checksum rápido que produce un valor de 32 bits (normalmente 8 caracteres hexadecimales). Está diseñado para detectar errores accidentales, no para seguridad criptográfica.\n\n**Puntos clave:**\n- **Rápido y determinista**: La misma entrada siempre genera la misma salida\n- **Verificación de integridad**: Útil para detectar corrupción en transferencia o almacenamiento\n- **No criptográfico**: No usar para contraseñas, firmas ni protección antifraude\n\n**Usos comunes:**\n- Verificación de transferencia de archivos\n- Verificación de paquetes/archivos comprimidos\n- Comprobaciones ligeras de integridad"
  },
  "fr": {
    "what-is-adler32": "Qu’est-ce qu’Adler-32 ?",
    "what-is-adler32-description-markdown": "Adler-32 est un algorithme de somme de contrôle rapide qui renvoie une valeur sur 32 bits (généralement 8 caractères hexadécimaux). Il sert à détecter des erreurs accidentelles, pas à la sécurité cryptographique.\n\n**Points clés :**\n- **Rapide et déterministe** : la même entrée produit toujours la même sortie\n- **Vérification d’intégrité** : utile pour détecter les corruptions en transit ou en stockage\n- **Non cryptographique** : à ne pas utiliser pour mots de passe, signatures ou anti-altération\n\n**Usages courants :**\n- Vérification de transfert de fichiers\n- Vérification d’archives/packages\n- Contrôles d’intégrité légers"
  },
  "de": {
    "what-is-adler32": "Was ist Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 ist ein schneller Prüfsummen-Algorithmus, der einen 32-Bit-Wert ausgibt (meist 8 hexadezimale Zeichen). Er ist für die Erkennung zufälliger Fehler gedacht, nicht für kryptografische Sicherheit.\n\n**Wichtige Punkte:**\n- **Schnell und deterministisch**: Gleiche Eingabe ergibt immer gleiche Ausgabe\n- **Integritätsprüfung**: Nützlich zur Erkennung von Übertragungs- oder Speicherfehlern\n- **Nicht kryptografisch**: Nicht für Passwörter, Signaturen oder Manipulationsschutz verwenden\n\n**Häufige Einsatzfälle:**\n- Dateiübertragungs-Prüfung\n- Archiv-/Paket-Prüfung\n- Leichte Integritätsprüfungen"
  },
  "it": {
    "what-is-adler32": "Cos’è Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 è un algoritmo di checksum veloce che produce un valore a 32 bit (di solito 8 caratteri esadecimali). È pensato per rilevare errori accidentali, non per sicurezza crittografica.\n\n**Punti chiave:**\n- **Veloce e deterministico**: Lo stesso input produce sempre lo stesso output\n- **Controllo integrità**: Utile per rilevare corruzioni in trasferimento o archiviazione\n- **Non crittografico**: Non usare per password, firme o anti-manomissione\n\n**Usi comuni:**\n- Verifica trasferimento file\n- Verifica archivi/pacchetti\n- Controlli leggeri di integrità"
  },
  "ja": {
    "what-is-adler32": "Adler-32 とは？",
    "what-is-adler32-description-markdown": "Adler-32 は、32 ビット値（通常は 16 進数 8 桁）を出力する高速なチェックサムアルゴリズムです。偶発的なエラー検出を目的としており、暗号学的な安全性を提供するものではありません。\n\n**ポイント：**\n- **高速かつ決定的**：同じ入力は常に同じ出力になる\n- **整合性チェック**：転送時・保存時のデータ破損検出に有用\n- **暗号用途には不適**：パスワード、署名、改ざん対策には使用しない\n\n**主な用途：**\n- ファイル転送の検証\n- アーカイブ/パッケージの検証\n- 軽量な整合性チェック"
  },
  "ko": {
    "what-is-adler32": "Adler-32란 무엇인가요?",
    "what-is-adler32-description-markdown": "Adler-32는 32비트 값(보통 16진수 8자리)을 출력하는 빠른 체크섬 알고리즘입니다. 우발적인 오류 탐지를 위한 것이며, 암호학적 보안을 제공하지는 않습니다.\n\n**핵심 포인트:**\n- **빠르고 결정적**: 같은 입력은 항상 같은 출력\n- **무결성 확인**: 전송/저장 중 데이터 손상 감지에 유용\n- **암호학적 알고리즘 아님**: 비밀번호, 서명, 변조 방지 용도로 사용 금지\n\n**일반적인 사용처:**\n- 파일 전송 검증\n- 아카이브/패키지 검증\n- 경량 무결성 점검"
  },
  "ru": {
    "what-is-adler32": "Что такое Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 — это быстрый алгоритм контрольной суммы, выдающий 32-битное значение (обычно 8 шестнадцатеричных символов). Он предназначен для обнаружения случайных ошибок, а не для криптографической безопасности.\n\n**Ключевые моменты:**\n- **Быстрый и детерминированный**: одинаковый ввод всегда дает одинаковый результат\n- **Проверка целостности**: полезен для выявления повреждений при передаче и хранении\n- **Не криптографический**: не использовать для паролей, подписей и защиты от подмены\n\n**Типичные применения:**\n- Проверка передачи файлов\n- Проверка архивов/пакетов\n- Легкие проверки целостности"
  },
  "pt": {
    "what-is-adler32": "O que é Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 é um algoritmo de checksum rápido que gera um valor de 32 bits (normalmente 8 caracteres hexadecimais). Ele foi feito para detectar erros acidentais, não para segurança criptográfica.\n\n**Pontos-chave:**\n- **Rápido e determinístico**: A mesma entrada sempre gera a mesma saída\n- **Verificação de integridade**: Útil para detectar corrupção em transferência ou armazenamento\n- **Não criptográfico**: Não use para senhas, assinaturas ou proteção contra adulteração\n\n**Usos comuns:**\n- Verificação de transferência de arquivos\n- Verificação de pacotes/arquivos compactados\n- Checagens leves de integridade"
  },
  "ar": {
    "what-is-adler32": "ما هو Adler-32؟",
    "what-is-adler32-description-markdown": "Adler-32 هو خوارزمية تحقق سريعة تنتج قيمة بطول 32 بت (عادةً 8 أحرف سداسية عشرية). صُممت لاكتشاف الأخطاء غير المقصودة، وليست للأمان التشفيري.\n\n**نقاط مهمة:**\n- **سريعة وحتمية**: نفس الإدخال يعطي نفس الناتج دائمًا\n- **فحص سلامة البيانات**: مفيدة لاكتشاف التلف أثناء النقل أو التخزين\n- **ليست تشفيرية**: لا تستخدمها لكلمات المرور أو التواقيع أو منع العبث\n\n**الاستخدامات الشائعة:**\n- التحقق من نقل الملفات\n- التحقق من الحزم/الأرشيفات\n- فحوصات سلامة خفيفة"
  },
  "hi": {
    "what-is-adler32": "Adler-32 क्या है?",
    "what-is-adler32-description-markdown": "Adler-32 एक तेज़ चेकसम एल्गोरिदम है जो 32-बिट मान (आमतौर पर 8 हेक्स अक्षर) देता है। यह आकस्मिक त्रुटि पहचान के लिए बनाया गया है, क्रिप्टोग्राफिक सुरक्षा के लिए नहीं।\n\n**मुख्य बिंदु:**\n- **तेज़ और निर्धारक**: समान इनपुट पर हमेशा समान आउटपुट\n- **इंटीग्रिटी जांच**: ट्रांसफर या स्टोरेज में डेटा खराबी पहचानने में उपयोगी\n- **क्रिप्टोग्राफिक नहीं**: पासवर्ड, हस्ताक्षर या एंटी-टैंपरिंग के लिए उपयोग न करें\n\n**सामान्य उपयोग:**\n- फ़ाइल ट्रांसफर जांच\n- आर्काइव/पैकेज सत्यापन\n- हल्की इंटीग्रिटी जांच"
  },
  "tr": {
    "what-is-adler32": "Adler-32 nedir?",
    "what-is-adler32-description-markdown": "Adler-32, 32 bitlik bir değer (genellikle 8 hex karakter) üreten hızlı bir sağlama toplamı algoritmasıdır. Kriptografik güvenlik için değil, kazara oluşan hataları tespit etmek için tasarlanmıştır.\n\n**Önemli noktalar:**\n- **Hızlı ve deterministik**: Aynı girdi her zaman aynı çıktıyı verir\n- **Bütünlük kontrolü**: Aktarım veya depolama bozulmalarını tespit etmekte faydalıdır\n- **Kriptografik değildir**: Parola, imza veya kurcalama önleme için kullanılmamalıdır\n\n**Yaygın kullanım alanları:**\n- Dosya aktarım kontrolü\n- Arşiv/paket doğrulaması\n- Hafif bütünlük kontrolleri"
  },
  "nl": {
    "what-is-adler32": "Wat is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is een snelle checksum-algoritme die een 32-bits waarde oplevert (meestal 8 hexadecimale tekens). Het is bedoeld voor het detecteren van toevallige fouten, niet voor cryptografische beveiliging.\n\n**Belangrijke punten:**\n- **Snel en deterministisch**: Dezelfde invoer geeft altijd dezelfde uitvoer\n- **Integriteitscontrole**: Handig voor detectie van corruptie tijdens overdracht of opslag\n- **Niet cryptografisch**: Niet gebruiken voor wachtwoorden, handtekeningen of anti-tampering\n\n**Veelvoorkomende toepassingen:**\n- Controle van bestandsoverdracht\n- Verificatie van archieven/pakketten\n- Lichte integriteitscontroles"
  },
  "sv": {
    "what-is-adler32": "Vad är Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 är en snabb kontrollsummealgoritm som ger ett 32-bitars värde (vanligtvis 8 hextecken). Den är avsedd för att upptäcka oavsiktliga fel, inte för kryptografisk säkerhet.\n\n**Nyckelpunkter:**\n- **Snabb och deterministisk**: Samma indata ger alltid samma utdata\n- **Integritetskontroll**: Bra för att upptäcka korruption vid överföring eller lagring\n- **Inte kryptografisk**: Använd inte för lösenord, signaturer eller manipuleringsskydd\n\n**Vanliga användningar:**\n- Kontroll av filöverföring\n- Verifiering av arkiv/paket\n- Lätta integritetskontroller"
  },
  "pl": {
    "what-is-adler32": "Czym jest Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 to szybki algorytm sumy kontrolnej, który zwraca wartość 32-bitową (zwykle 8 znaków szesnastkowych). Służy do wykrywania przypadkowych błędów, a nie do bezpieczeństwa kryptograficznego.\n\n**Najważniejsze informacje:**\n- **Szybki i deterministyczny**: Ten sam input zawsze daje ten sam wynik\n- **Kontrola integralności**: Przydatny do wykrywania uszkodzeń podczas przesyłania lub przechowywania\n- **Nie jest kryptograficzny**: Nie używać do haseł, podpisów ani ochrony przed manipulacją\n\n**Typowe zastosowania:**\n- Kontrola transferu plików\n- Weryfikacja archiwów/paczek\n- Lekkie kontrole integralności"
  },
  "vi": {
    "what-is-adler32": "Adler-32 là gì?",
    "what-is-adler32-description-markdown": "Adler-32 là thuật toán checksum nhanh tạo ra giá trị 32-bit (thường là 8 ký tự hex). Nó dùng để phát hiện lỗi ngoài ý muốn, không phải cho bảo mật mật mã.\n\n**Điểm chính:**\n- **Nhanh và xác định**: Cùng đầu vào luôn cho cùng đầu ra\n- **Kiểm tra toàn vẹn**: Hữu ích để phát hiện hỏng dữ liệu khi truyền hoặc lưu trữ\n- **Không phải mật mã**: Không dùng cho mật khẩu, chữ ký hay chống giả mạo\n\n**Ứng dụng phổ biến:**\n- Kiểm tra truyền tệp\n- Xác minh gói/lưu trữ\n- Kiểm tra toàn vẹn nhẹ"
  },
  "th": {
    "what-is-adler32": "Adler-32 คืออะไร?",
    "what-is-adler32-description-markdown": "Adler-32 คืออัลกอริทึมเช็กซัมที่ทำงานได้รวดเร็วและให้ผลลัพธ์ 32 บิต (ปกติแสดงเป็นเลขฐานสิบหก 8 ตัวอักษร) ใช้สำหรับตรวจจับข้อผิดพลาดที่เกิดขึ้นโดยไม่ตั้งใจ ไม่ได้ออกแบบมาเพื่อความปลอดภัยเชิงเข้ารหัส\n\n**ประเด็นสำคัญ:**\n- **เร็วและให้ผลคงที่**: อินพุตเดิมได้เอาต์พุตเดิมเสมอ\n- **ตรวจสอบความสมบูรณ์ของข้อมูล**: เหมาะกับการตรวจจับข้อมูลเสียหายระหว่างส่งหรือจัดเก็บ\n- **ไม่ใช่อัลกอริทึมเข้ารหัส**: ไม่ควรใช้กับรหัสผ่าน ลายเซ็น หรือการป้องกันการแก้ไข\n\n**การใช้งานทั่วไป:**\n- ตรวจสอบการโอนไฟล์\n- ตรวจสอบไฟล์บีบอัด/แพ็กเกจ\n- ตรวจสอบความสมบูรณ์แบบเบา ๆ"
  },
  "id": {
    "what-is-adler32": "Apa itu Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 adalah algoritma checksum cepat yang menghasilkan nilai 32-bit (biasanya 8 karakter heksadesimal). Algoritma ini dirancang untuk mendeteksi kesalahan tidak sengaja, bukan untuk keamanan kriptografis.\n\n**Poin penting:**\n- **Cepat dan deterministik**: Input yang sama selalu menghasilkan output yang sama\n- **Pemeriksaan integritas**: Berguna untuk mendeteksi korupsi saat transfer atau penyimpanan\n- **Bukan kriptografis**: Jangan gunakan untuk kata sandi, tanda tangan, atau anti-manipulasi\n\n**Penggunaan umum:**\n- Pemeriksaan transfer file\n- Verifikasi arsip/paket\n- Pemeriksaan integritas ringan"
  },
  "he": {
    "what-is-adler32": "מה זה Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 הוא אלגוריתם סכום ביקורת מהיר שמחזיר ערך של 32 ביט (בדרך כלל 8 תווים הקסדצימליים). הוא מיועד לזיהוי שגיאות מקריות, ולא לאבטחה קריפטוגרפית.\n\n**נקודות מפתח:**\n- **מהיר ודטרמיניסטי**: אותו קלט מחזיר תמיד אותו פלט\n- **בדיקת שלמות**: שימושי לזיהוי פגיעה בנתונים בהעברה או באחסון\n- **לא קריפטוגרפי**: לא להשתמש לסיסמאות, חתימות או מניעת שיבוש\n\n**שימושים נפוצים:**\n- בדיקת העברת קבצים\n- אימות ארכיונים/חבילות\n- בדיקות שלמות קלות"
  },
  "ms": {
    "what-is-adler32": "Apakah Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 ialah algoritma checksum pantas yang menghasilkan nilai 32-bit (biasanya 8 aksara heksadesimal). Ia direka untuk mengesan ralat tidak sengaja, bukan untuk keselamatan kriptografi.\n\n**Perkara penting:**\n- **Pantas dan deterministik**: Input yang sama sentiasa menghasilkan output yang sama\n- **Semakan integriti**: Berguna untuk mengesan kerosakan semasa pemindahan atau penyimpanan\n- **Bukan kriptografi**: Jangan guna untuk kata laluan, tandatangan, atau anti-usik\n\n**Kegunaan biasa:**\n- Semakan pemindahan fail\n- Pengesahan arkib/pakej\n- Semakan integriti ringan"
  },
  "no": {
    "what-is-adler32": "Hva er Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 er en rask kontrollsumalgoritme som gir en 32-bits verdi (vanligvis 8 heksadesimale tegn). Den er laget for å oppdage tilfeldige feil, ikke for kryptografisk sikkerhet.\n\n**Nøkkelpunkter:**\n- **Rask og deterministisk**: Samme inndata gir alltid samme utdata\n- **Integritetskontroll**: Nyttig for å oppdage datakorrupsjon ved overføring eller lagring\n- **Ikke kryptografisk**: Ikke bruk for passord, signaturer eller tuklebeskyttelse\n\n**Vanlige bruksområder:**\n- Kontroll av filoverføring\n- Verifisering av arkiver/pakker\n- Lette integritetskontroller"
  }
}
</i18n>
