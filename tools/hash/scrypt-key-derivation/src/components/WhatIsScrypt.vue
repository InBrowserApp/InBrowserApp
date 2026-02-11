<template>
  <DescriptionMarkdown
    :title="t('what-is-scrypt')"
    :description="t('what-is-scrypt-description')"
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
    "what-is-scrypt": "What is scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "zh": {
    "what-is-scrypt": "什么是 scrypt？",
    "what-is-scrypt-description": "scrypt 是一种内存困难型密码密钥派生函数（KDF），旨在让大规模暴力破解在 CPU 和内存成本上都变得更高。\n\n**要点：**\n- 主要参数为 N（成本因子）、r（块大小）和 p（并行度）\n- 需要较高内存，有助于提高 GPU/ASIC 破解成本\n- 基于密码 + 盐生成确定性的派生密钥\n\n**最佳实践：**\n- 每个密码都使用唯一且随机的盐\n- 在可接受性能范围内尽量提高 N/r/p 参数\n- 将参数与派生结果一同保存，便于后续验证"
  },
  "zh-CN": {
    "what-is-scrypt": "什么是 scrypt？",
    "what-is-scrypt-description": "scrypt 是一种内存困难型密码密钥派生函数（KDF），旨在让大规模暴力破解在 CPU 和内存成本上都变得更高。\n\n**要点：**\n- 主要参数为 N（成本因子）、r（块大小）和 p（并行度）\n- 需要较高内存，有助于提高 GPU/ASIC 破解成本\n- 基于密码 + 盐生成确定性的派生密钥\n\n**最佳实践：**\n- 每个密码都使用唯一且随机的盐\n- 在可接受性能范围内尽量提高 N/r/p 参数\n- 将参数与派生结果一同保存，便于后续验证"
  },
  "zh-TW": {
    "what-is-scrypt": "什麼是 scrypt？",
    "what-is-scrypt-description": "scrypt 是一種記憶體困難型密碼金鑰派生函式（KDF），旨在讓大規模暴力破解在 CPU 與記憶體成本上都更高。\n\n**要點：**\n- 主要參數為 N（成本因子）、r（區塊大小）與 p（並行度）\n- 需要較高記憶體，有助於提高 GPU/ASIC 破解成本\n- 基於密碼 + 鹽產生可重現的派生金鑰\n\n**最佳實務：**\n- 每個密碼都使用唯一且隨機的鹽\n- 在可接受效能範圍內盡量提高 N/r/p 參數\n- 將參數與派生結果一併保存，便於後續驗證"
  },
  "zh-HK": {
    "what-is-scrypt": "什麼是 scrypt？",
    "what-is-scrypt-description": "scrypt 是一種記憶體困難型密碼金鑰派生函式（KDF），旨在讓大規模暴力破解在 CPU 與記憶體成本上都更高。\n\n**要點：**\n- 主要參數為 N（成本因子）、r（區塊大小）與 p（並行度）\n- 需要較高記憶體，有助於提高 GPU/ASIC 破解成本\n- 基於密碼 + 鹽產生可重現的派生金鑰\n\n**最佳實務：**\n- 每個密碼都使用唯一且隨機的鹽\n- 在可接受效能範圍內盡量提高 N/r/p 參數\n- 將參數與派生結果一併保存，便於後續驗證"
  },
  "es": {
    "what-is-scrypt": "¿Qué es scrypt?",
    "what-is-scrypt-description": "scrypt es una función de derivación de claves (KDF) basada en contraseñas de memoria dura diseñada para encarecer los ataques de fuerza bruta tanto en la CPU como en la memoria.\n\n**Puntos clave:**\n- Utiliza N (factor de costo), r (tamaño de bloque) y p (paralelismo)\n- Las configuraciones más altas aumentan el costo de memoria y computación\n- Produce claves derivadas deterministas de contraseña + sal\n\n**Mejores prácticas:**\n- Utilice una sal aleatoria única por contraseña\n- Ajuste N/r/p para que coincida con su presupuesto de seguridad y rendimiento\n- Almacenar parámetros con la clave derivada para su verificación."
  },
  "fr": {
    "what-is-scrypt": "Qu'est-ce que scrypt ?",
    "what-is-scrypt-description": "scrypt est une fonction de dérivation de clé (KDF) basée sur un mot de passe et conçue pour rendre les attaques par force brute coûteuses en CPU et en mémoire.\n\n**Points clés :**\n- Utilise N (facteur de coût), r (taille de bloc) et p (parallélisme)\n- Des paramètres plus élevés augmentent la mémoire et les coûts de calcul\n- Produit des clés dérivées déterministes à partir de mot de passe + sel\n\n**Bonnes pratiques :**\n- Utilisez un sel aléatoire unique par mot de passe\n- Adaptez N/r/p à votre budget de sécurité et de performances\n- Stocker les paramètres avec la clé dérivée pour vérification"
  },
  "de": {
    "what-is-scrypt": "Was ist scrypt?",
    "what-is-scrypt-description": "scrypt ist eine speicherfeste, passwortbasierte Schlüsselableitungsfunktion (KDF), die darauf ausgelegt ist, Brute-Force-Angriffe sowohl in der CPU als auch im Speicher teuer zu machen.\n\n**Kernpunkte:**\n- Verwendet N (Kostenfaktor), r (Blockgröße) und p (Parallelität)\n- Höhere Einstellungen erhöhen den Speicher und die Rechenkosten\n- Erzeugt deterministisch abgeleitete Schlüssel aus Passwort + Salt\n\n**Best Practices:**\n- Verwenden Sie einen eindeutigen zufälligen Salt pro Passwort\n- Passen Sie N/r/p an Ihr Sicherheits- und Leistungsbudget an\n- Speichern Sie Parameter mit dem abgeleiteten Schlüssel zur Überprüfung"
  },
  "it": {
    "what-is-scrypt": "Cos'è scrypt?",
    "what-is-scrypt-description": "scrypt è una funzione di derivazione della chiave basata su password (KDF) progettata per rendere gli attacchi di forza bruta costosi sia nella CPU che nella memoria.\n\n**Punti chiave:**\n- Utilizza N (fattore di costo), r (dimensione del blocco) e p (parallelismo)\n- Impostazioni più elevate aumentano la memoria e i costi di elaborazione\n- Produce chiavi derivate deterministiche da password + salt\n\n**Migliori pratiche:**\n- Utilizza un sale casuale univoco per password\n- Ottimizza N/r/p per adattarlo al tuo budget in termini di sicurezza e prestazioni\n- Memorizza i parametri con la chiave derivata per la verifica"
  },
  "ja": {
    "what-is-scrypt": "scrypt とは？",
    "what-is-scrypt-description": "scrypt は、CPU とメモリの両方でブルート フォース攻撃を行うように設計されたメモリハードのパスワード ベースのキー導出関数 (KDF) です。\n\n**重要なポイント:**\n- N (コスト係数)、r (ブロック サイズ)、および p (並列処理) を使用します。\n- 設定を高くすると、メモリとコンピューティング コストが増加します\n- パスワード + ソルトから決定論的な派生キーを生成します\n\n**ベストプラクティス:**\n- パスワードごとに一意のランダム ソルトを使用する\n- セキュリティとパフォーマンスの予算に合わせて N/r/p を調整する\n- 検証用に派生キーを使用してパラメータを保存する"
  },
  "ko": {
    "what-is-scrypt": "scrypt란?",
    "what-is-scrypt-description": "scrypt는 CPU와 메모리 모두에서 무차별 대입 공격을 수행하는 데 비용이 많이 들도록 설계된 메모리 하드 암호 기반 키 파생 함수(KDF)입니다.\n\n**핵심 사항:**\n- N(비용 요소), r(블록 크기), p(병렬성)를 사용합니다.\n- 설정이 높을수록 메모리 및 컴퓨팅 비용이 증가합니다.\n- 비밀번호 + 솔트에서 결정론적 파생 키를 생성합니다.\n\n**모범 사례:**\n- 비밀번호별로 고유한 무작위 솔트 사용\n- 보안 및 성능 예산에 맞게 N/r/p 조정\n- 검증을 위해 파생된 키로 매개변수를 저장합니다."
  },
  "ru": {
    "what-is-scrypt": "Что такое scrypt?",
    "what-is-scrypt-description": "scrypt — это функция создания ключей на основе паролей (KDF), основанная на жестком запоминании, предназначенная для того, чтобы сделать атаки методом перебора дорогостоящими как для процессора, так и для памяти.\n\n**Ключевые моменты:**\n- Использует N (коэффициент стоимости), r (размер блока) и p (параллелизм).\n- Более высокие настройки увеличивают память и затраты на вычисления.\n- Создает детерминированные производные ключи из пароля + соли.\n\n**Лучшие практики:**\n- Используйте уникальную случайную соль для каждого пароля\n- Настройте N/r/p в соответствии с вашим бюджетом на безопасность и производительность.\n- Сохраните параметры с производным ключом для проверки."
  },
  "pt": {
    "what-is-scrypt": "O que é scrypt?",
    "what-is-scrypt-description": "scrypt é uma função de derivação de chave baseada em senha (KDF), projetada para tornar os ataques de força bruta caros tanto na CPU quanto na memória.\n\n**Pontos principais:**\n- Usa N (fator de custo), r (tamanho do bloco) e p (paralelismo)\n- Configurações mais altas aumentam a memória e o custo de computação\n- Produz chaves derivadas determinísticas de senha + sal\n\n**Melhores práticas:**\n- Use um sal aleatório exclusivo por senha\n- Ajuste o N/R/P para corresponder ao seu orçamento de segurança e desempenho\n- Armazene parâmetros com a chave derivada para verificação"
  },
  "ar": {
    "what-is-scrypt": "ما هو scrypt؟",
    "what-is-scrypt-description": "scrypt عبارة عن وظيفة اشتقاق مفتاح تعتمد على كلمة مرور الذاكرة الصلبة (KDF) مصممة لجعل هجمات القوة الغاشمة باهظة الثمن في كل من وحدة المعالجة المركزية والذاكرة.\n\n**النقاط الرئيسية:**\n- يستخدم N (عامل التكلفة)، وr (حجم الكتلة)، وp (التوازي)\n- تعمل الإعدادات الأعلى على زيادة الذاكرة وحساب التكلفة\n- تنتج مفاتيح مشتقة حتمية من كلمة المرور + الملح\n\n**أفضل الممارسات:**\n- استخدم ملحًا عشوائيًا فريدًا لكل كلمة مرور\n- قم بضبط N/r/p ليتوافق مع ميزانية الأمان والأداء لديك\n- تخزين المعلمات مع المفتاح المشتق للتحقق"
  },
  "hi": {
    "what-is-scrypt": "scrypt क्या है?",
    "what-is-scrypt-description": "स्क्रीप्ट एक मेमोरी-हार्ड पासवर्ड-आधारित कुंजी व्युत्पत्ति फ़ंक्शन (केडीएफ) है जिसे सीपीयू और मेमोरी दोनों में ब्रूट-फोर्स हमलों को महंगा बनाने के लिए डिज़ाइन किया गया है।\n\n**प्रमुख बिंदु:**\n- एन (लागत कारक), आर (ब्लॉक आकार), और पी (समानांतरता) का उपयोग करता है\n- उच्च सेटिंग्स मेमोरी और गणना लागत बढ़ाती हैं\n- पासवर्ड + नमक से नियतात्मक व्युत्पन्न कुंजियाँ उत्पन्न करता है\n\n**सर्वोत्तम प्रथाएं:**\n- प्रति पासवर्ड एक अद्वितीय यादृच्छिक नमक का उपयोग करें\n- अपने सुरक्षा और प्रदर्शन बजट से मेल खाने के लिए एन/आर/पी को ट्यून करें\n- सत्यापन के लिए व्युत्पन्न कुंजी के साथ पैरामीटर संग्रहीत करें"
  },
  "tr": {
    "what-is-scrypt": "scrypt nedir?",
    "what-is-scrypt-description": "scrypt, kaba kuvvet saldırılarını hem CPU hem de bellek açısından pahalı hale getirmek için tasarlanmış, belleğe dayanıklı parola tabanlı bir anahtar türetme işlevidir (KDF).\n\n**Anahtar noktalar:**\n- N (maliyet faktörü), r (blok boyutu) ve p (paralellik) kullanır\n- Daha yüksek ayarlar belleği ve bilgi işlem maliyetini artırır\n- Parola + tuzdan deterministik türetilmiş anahtarlar üretir\n\n**En iyi uygulamalar:**\n- Şifre başına benzersiz bir rastgele tuz kullanın\n- Güvenlik ve performans bütçenize uyacak şekilde N/r/p'yi ayarlayın\n- Doğrulama için parametreleri türetilmiş anahtarla saklayın"
  },
  "nl": {
    "what-is-scrypt": "Wat is scrypt?",
    "what-is-scrypt-description": "scrypt is een geheugen-harde, op wachtwoorden gebaseerde sleutelafleidingsfunctie (KDF) die is ontworpen om brute-force-aanvallen duur te maken in zowel de CPU als het geheugen.\n\n**Belangrijkste punten:**\n- Gebruikt N (kostenfactor), r (blokgrootte) en p (parallelisme)\n- Hogere instellingen verhogen het geheugen en de computerkosten\n- Produceert deterministisch afgeleide sleutels van wachtwoord + zout\n\n**Beste praktijken:**\n- Gebruik een unieke willekeurige salt per wachtwoord\n- Stem N/r/p af op uw beveiligings- en prestatiebudget\n- Sla parameters op met de afgeleide sleutel voor verificatie"
  },
  "sv": {
    "what-is-scrypt": "Vad är scrypt?",
    "what-is-scrypt-description": "scrypt är en minneshård lösenordsbaserad nyckelderivationsfunktion (KDF) designad för att göra brute-force-attacker dyra i både CPU och minne.\n\n**Huvudpunkter:**\n- Använder N (kostnadsfaktor), r (blockstorlek) och p (parallellism)\n- Högre inställningar ökar minnet och beräkningskostnaderna\n- Producerar deterministiskt härledda nycklar från lösenord + salt\n\n**Bästa metoder:**\n- Använd ett unikt slumpmässigt salt per lösenord\n- Ställ in N/r/p för att matcha din säkerhets- och prestandabudget\n- Lagra parametrar med den härledda nyckeln för verifiering"
  },
  "pl": {
    "what-is-scrypt": "Czym jest scrypt?",
    "what-is-scrypt-description": "scrypt to funkcja wyprowadzania klucza oparta na hasłach (KDF), która ogranicza pamięć, zaprojektowaną tak, aby ataki typu brute-force były kosztowne zarówno dla procesora, jak i pamięci.\n\n**Kluczowe punkty:**\n- Wykorzystuje N (współczynnik kosztu), r (rozmiar bloku) i p (równoległość)\n- Wyższe ustawienia zwiększają pamięć i koszt obliczeń\n- Tworzy deterministyczne klucze pochodne na podstawie hasła + soli\n\n**Najlepsze praktyki:**\n- Użyj unikalnej losowej soli na hasło\n- Dostosuj N/r/p do swojego budżetu na bezpieczeństwo i wydajność\n- Przechowuj parametry z kluczem pochodnym w celu weryfikacji"
  },
  "vi": {
    "what-is-scrypt": "scrypt là gì?",
    "what-is-scrypt-description": "scrypt là một hàm dẫn xuất khóa dựa trên mật khẩu cứng (KDF) được thiết kế để khiến các cuộc tấn công vũ phu trở nên tốn kém trong cả CPU và bộ nhớ.\n\n**Những điểm chính:**\n- Sử dụng N (hệ số chi phí), r (kích thước khối) và p (song song)\n- Cài đặt cao hơn sẽ tăng bộ nhớ và chi phí tính toán\n- Tạo các khóa có nguồn gốc xác định từ mật khẩu + muối\n\n**Thực tiễn tốt nhất:**\n- Sử dụng một loại muối ngẫu nhiên duy nhất cho mỗi mật khẩu\n- Điều chỉnh N/r/p để phù hợp với ngân sách bảo mật và hiệu suất của bạn\n- Lưu trữ các tham số bằng khóa dẫn xuất để xác minh"
  },
  "th": {
    "what-is-scrypt": "scrypt คืออะไร?",
    "what-is-scrypt-description": "scrypt เป็นฟังก์ชันการรับคีย์ที่ใช้รหัสผ่านแบบฮาร์ดรหัสผ่าน (KDF) ที่ออกแบบมาเพื่อทำให้การโจมตีแบบ brute-force มีราคาแพงทั้งใน CPU และหน่วยความจำ\n\n**ประเด็นสำคัญ:**\n- ใช้ N (ปัจจัยต้นทุน), r (ขนาดบล็อก) และ p (ความขนาน)\n- การตั้งค่าที่สูงขึ้นจะเพิ่มหน่วยความจำและต้นทุนการประมวลผล\n- สร้างคีย์ที่ได้รับตามที่กำหนดจากรหัสผ่าน + Salt\n\n**แนวทางปฏิบัติที่ดีที่สุด:**\n- ใช้เกลือสุ่มที่ไม่ซ้ำกันต่อรหัสผ่าน\n- ปรับแต่ง N/r/p เพื่อให้ตรงกับงบประมาณด้านความปลอดภัยและประสิทธิภาพของคุณ\n- จัดเก็บพารามิเตอร์ด้วยคีย์ที่ได้รับเพื่อการตรวจสอบ"
  },
  "id": {
    "what-is-scrypt": "Apa itu scrypt?",
    "what-is-scrypt-description": "scrypt adalah fungsi derivasi kunci berbasis kata sandi (KDF) yang dirancang untuk membuat serangan brute force menjadi mahal baik di CPU maupun memori.\n\n**Poin-poin penting:**\n- Menggunakan N (faktor biaya), r (ukuran blok), dan p (paralelisme)\n- Pengaturan yang lebih tinggi meningkatkan memori dan biaya komputasi\n- Menghasilkan kunci turunan deterministik dari kata sandi + garam\n\n**Praktik terbaik:**\n- Gunakan garam acak unik per kata sandi\n- Sesuaikan N/r/p agar sesuai dengan anggaran keamanan dan kinerja Anda\n- Simpan parameter dengan kunci turunan untuk verifikasi"
  },
  "he": {
    "what-is-scrypt": "מה זה scrypt?",
    "what-is-scrypt-description": "scrypt היא פונקציית גזירת מפתח המבוססת על סיסמה קשה בזיכרון (KDF) שנועדה לייקר התקפות של כוח גס הן במעבד והן בזיכרון.\n\n**נקודות מפתח:**\n- משתמש ב-N (גורם עלות), r (גודל בלוק) ו-p (מקביליות)\n- הגדרות גבוהות יותר מגדילות את הזיכרון ואת עלות המחשוב\n- מייצר מפתחות נגזרים דטרמיניסטיים מסיסמה + מלח\n\n**שיטות עבודה מומלצות:**\n- השתמש במלח אקראי ייחודי לכל סיסמה\n- כוונן את N/r/p כדי להתאים את תקציב האבטחה והביצועים שלך\n- אחסן פרמטרים עם המפתח הנגזר לאימות"
  },
  "ms": {
    "what-is-scrypt": "Apakah scrypt?",
    "what-is-scrypt-description": "scrypt ialah fungsi derivasi kunci (KDF) berasaskan kata laluan keras memori yang direka untuk menjadikan serangan brute-force mahal dalam kedua-dua CPU dan memori.\n\n**Perkara utama:**\n- Menggunakan N (faktor kos), r (saiz blok), dan p (paralelisme)\n- Tetapan yang lebih tinggi meningkatkan memori dan kos pengiraan\n- Menghasilkan kunci terbitan deterministik daripada kata laluan + garam\n\n**Amalan terbaik:**\n- Gunakan garam rawak unik bagi setiap kata laluan\n- Tala N/r/p untuk memadankan bajet keselamatan dan prestasi anda\n- Simpan parameter dengan kunci terbitan untuk pengesahan"
  },
  "no": {
    "what-is-scrypt": "Hva er scrypt?",
    "what-is-scrypt-description": "scrypt er en minnehard passordbasert nøkkelavledningsfunksjon (KDF) designet for å gjøre brute-force-angrep dyre både i CPU og minne.\n\n**Hovedpunkter:**\n- Bruker N (kostnadsfaktor), r (blokkstørrelse) og p (parallellisme)\n- Høyere innstillinger øker minnet og beregningskostnadene\n- Produserer deterministiske avledede nøkler fra passord + salt\n\n**Gode ​​fremgangsmåter:**\n- Bruk et unikt tilfeldig salt per passord\n- Still inn N/r/p for å matche sikkerhets- og ytelsesbudsjettet ditt\n- Lagre parametere med den avledede nøkkelen for verifisering"
  }
}
</i18n>
