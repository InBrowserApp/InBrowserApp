<template>
  <DescriptionMarkdown
    :title="t('what-is-argon2')"
    :description="t('what-is-argon2-description-markdown')"
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
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\n\n**Key points:**\n- Use **Argon2id** by default for most applications\n- Store only the encoded hash string and never plain passwords\n- Tune memory and iterations based on acceptable login latency\n- Use a unique random salt per password\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "zh": {
    "what-is-argon2": "什么是 Argon2？",
    "what-is-argon2-description-markdown": "Argon2 是一种现代密码哈希算法，专门用于抵抗 GPU 和 ASIC 的暴力破解。它支持内存硬计算、可配置迭代次数和并行度，适合安全地存储密码。\n\n**要点：**\n- 大多数场景默认使用 **Argon2id**\n- 仅存储编码后的哈希字符串，不要存储明文密码\n- 根据可接受的登录延迟调优内存和迭代参数\n- 每个密码使用唯一且随机的盐值\n- 可选使用服务端密钥（pepper）增强保护"
  },
  "zh-CN": {
    "what-is-argon2": "什么是 Argon2？",
    "what-is-argon2-description-markdown": "Argon2 是一种现代密码哈希算法，专门用于抵抗 GPU 和 ASIC 的暴力破解。它支持内存硬计算、可配置迭代次数和并行度，适合安全地存储密码。\n\n**要点：**\n- 大多数场景默认使用 **Argon2id**\n- 仅存储编码后的哈希字符串，不要存储明文密码\n- 根据可接受的登录延迟调优内存和迭代参数\n- 每个密码使用唯一且随机的盐值\n- 可选使用服务端密钥（pepper）增强保护"
  },
  "zh-TW": {
    "what-is-argon2": "什麼是 Argon2？",
    "what-is-argon2-description-markdown": "Argon2 是一種現代密碼雜湊演算法，專門用於抵抗 GPU 與 ASIC 的暴力破解。它支援記憶體硬化計算、可設定的迭代次數與平行度，適合安全儲存密碼。\n\n**重點：**\n- 多數情境預設使用 **Argon2id**\n- 只儲存編碼後的雜湊字串，不要儲存明文密碼\n- 依可接受的登入延遲調整記憶體與迭代參數\n- 每組密碼都使用唯一且隨機的鹽值\n- 可選擇使用伺服器端密鑰（pepper）提升保護"
  },
  "zh-HK": {
    "what-is-argon2": "什麼是 Argon2？",
    "what-is-argon2-description-markdown": "Argon2 是一種現代密碼雜湊演算法，專門用於抵抗 GPU 與 ASIC 的暴力破解。它支援記憶體硬化計算、可設定的迭代次數與平行度，適合安全儲存密碼。\n\n**重點：**\n- 多數情境預設使用 **Argon2id**\n- 只儲存編碼後的雜湊字串，不要儲存明文密碼\n- 依可接受的登入延遲調整記憶體與迭代參數\n- 每組密碼都使用唯一且隨機的鹽值\n- 可選擇使用伺服器端密鑰（pepper）提升保護"
  },
  "es": {
    "what-is-argon2": "¿Qué es Argon2?",
    "what-is-argon2-description-markdown": "Argon2 es un algoritmo hash de contraseñas moderno diseñado para resistir los ataques GPU y ASIC. Admite cálculo con memoria dura, iteraciones configurables y paralelismo, lo que lo hace adecuado para el almacenamiento seguro de contraseñas.\n\n**Puntos clave:**\n- Utilice **Argon2id** de forma predeterminada para la mayoría de las aplicaciones.\n- Almacene sólo la cadena hash codificada y nunca contraseñas simples\n- Ajuste la memoria y las iteraciones según una latencia de inicio de sesión aceptable\n- Utilice una sal aleatoria única por contraseña\n- Opcionalmente use un secreto del lado del servidor (pepper) para protección adicional"
  },
  "fr": {
    "what-is-argon2": "Qu'est-ce que Argon2 ?",
    "what-is-argon2-description-markdown": "Argon2 est un algorithme de hachage de mot de passe moderne conçu pour résister aux attaques GPU et ASIC. Il prend en charge les calculs gourmands en mémoire, les itérations configurables et le parallélisme, ce qui le rend adapté au stockage sécurisé des mots de passe.\n\n**Points clés :**\n- Utilisez **Argon2id** par défaut pour la plupart des applications\n- Stockez uniquement la chaîne de hachage codée et jamais les mots de passe simples\n- Ajustez la mémoire et les itérations en fonction d'une latence de connexion acceptable\n- Utilisez un sel aléatoire unique par mot de passe\n- Utilisez éventuellement un secret côté serveur (pepper) pour une protection supplémentaire"
  },
  "de": {
    "what-is-argon2": "Was ist Argon2?",
    "what-is-argon2-description-markdown": "Argon2 ist ein moderner Passwort-Hashing-Algorithmus, der entwickelt wurde, um GPU- und ASIC-Angriffen zu widerstehen. Es unterstützt speicherintensive Berechnungen, konfigurierbare Iterationen und Parallelität und eignet sich daher für die sichere Speicherung von Passwörtern.\n\n**Wichtige Punkte:**\n- Verwenden Sie für die meisten Anwendungen standardmäßig **Argon2id**\n- Speichern Sie nur die verschlüsselte Hash-Zeichenfolge und niemals einfache Passwörter\n- Optimieren Sie Speicher und Iterationen basierend auf einer akzeptablen Anmeldelatenz\n- Verwenden Sie ein einzigartiges zufälliges Salt pro Passwort\n– Verwenden Sie optional ein serverseitiges Geheimnis (pepper) für zusätzlichen Schutz"
  },
  "it": {
    "what-is-argon2": "Cos'è Argon2?",
    "what-is-argon2-description-markdown": "Argon2 è un moderno algoritmo di hashing delle password progettato per resistere agli attacchi GPU e ASIC. Supporta calcoli impegnativi in ​​memoria, iterazioni configurabili e parallelismo, rendendolo adatto per l'archiviazione sicura delle password.\n\n**Punti chiave:**\n- Utilizza **Argon2id** per impostazione predefinita per la maggior parte delle applicazioni\n- Memorizza solo la stringa hash codificata e mai le password semplici\n- Ottimizza la memoria e le iterazioni in base alla latenza di accesso accettabile\n- Utilizza un sale casuale univoco per password\n- Facoltativamente, utilizza un segreto lato server (pepper) per una protezione aggiuntiva"
  },
  "ja": {
    "what-is-argon2": "Argon2とは何ですか?",
    "what-is-argon2-description-markdown": "Argon2 は、GPU および ASIC 攻撃に対抗するように設計された最新のパスワード ハッシュ アルゴリズムです。メモリを必要とする計算、構成可能な反復、並列処理をサポートしているため、安全なパスワード ストレージに適しています。\n\n**重要なポイント:**\n- ほとんどのアプリケーションではデフォルトで **Argon2id** を使用します\n- エンコードされたハッシュ文字列のみを保存し、プレーンなパスワードは決して保存しないでください。\n- 許容可能なログイン遅延に基づいてメモリと反復を調整する\n- パスワードごとに一意のランダムなソルトを使用する\n- オプションで、追加の保護のためにサーバー側シークレット (pepper) を使用します。"
  },
  "ko": {
    "what-is-argon2": "Argon2이란 무엇입니까?",
    "what-is-argon2-description-markdown": "Argon2은 GPU 및 ASIC 공격에 저항하도록 설계된 최신 비밀번호 해싱 알고리즘입니다. 메모리 하드 계산, 구성 가능한 반복 및 병렬성을 지원하므로 안전한 비밀번호 저장에 적합합니다.\n\n**핵심 사항:**\n- 대부분의 애플리케이션에서는 기본적으로 **Argon2id**을 사용합니다.\n- 인코딩된 해시 문자열만 저장하고 일반 비밀번호는 저장하지 않습니다.\n- 허용 가능한 로그인 대기 시간을 기준으로 메모리 및 반복 조정\n- 비밀번호별로 고유한 무작위 솔트 사용\n- 추가 보호를 위해 선택적으로 서버측 비밀(pepper)을 사용합니다."
  },
  "ru": {
    "what-is-argon2": "Что такое Argon2?",
    "what-is-argon2-description-markdown": "Argon2 — это современный алгоритм хеширования паролей, разработанный для защиты от атак GPU и ASIC. Он поддерживает вычисления с интенсивным использованием памяти, настраиваемые итерации и параллелизм, что делает его пригодным для безопасного хранения паролей.\n\n**Ключевые моменты:**\n- Используйте **Argon2id** по умолчанию для большинства приложений.\n- Храните только закодированную хэш-строку и никогда не храните простые пароли.\n- Настройте память и итерации на основе приемлемой задержки входа в систему.\n- Используйте уникальную случайную соль для каждого пароля.\n- При необходимости используйте секрет на стороне сервера (pepper) для дополнительной защиты."
  },
  "pt": {
    "what-is-argon2": "O que é Argon2?",
    "what-is-argon2-description-markdown": "Argon2 é um algoritmo moderno de hash de senha projetado para resistir a ataques GPU e ASIC. Ele suporta computação com muita memória, iterações configuráveis ​​e paralelismo, tornando-o adequado para armazenamento seguro de senhas.\n\n**Pontos principais:**\n- Use **Argon2id** por padrão para a maioria dos aplicativos\n- Armazene apenas a string hash codificada e nunca senhas simples\n- Ajuste a memória e as iterações com base na latência de login aceitável\n- Use um sal aleatório exclusivo por senha\n- Opcionalmente, use um segredo do lado do servidor (pepper) para proteção extra"
  },
  "ar": {
    "what-is-argon2": "ما هو Argon2؟",
    "what-is-argon2-description-markdown": "Argon2 هي خوارزمية حديثة لتجزئة كلمة المرور مصممة لمقاومة هجمات GPU وASIC. وهو يدعم حساب الذاكرة الصلبة، والتكرارات القابلة للتكوين، والتوازي، مما يجعله مناسبًا لتخزين كلمات المرور بشكل آمن.\n\n**النقاط الرئيسية:**\n- استخدم **Argon2id** بشكل افتراضي لمعظم التطبيقات\n- قم بتخزين سلسلة التجزئة المشفرة فقط وليس كلمات المرور العادية أبدًا\n- ضبط الذاكرة والتكرارات بناءً على زمن الوصول المقبول لتسجيل الدخول\n- استخدم ملحًا عشوائيًا فريدًا لكل كلمة مرور\n- استخدم بشكل اختياري سرًا من جانب الخادم (pepper) لمزيد من الحماية"
  },
  "hi": {
    "what-is-argon2": "Argon2 क्या है?",
    "what-is-argon2-description-markdown": "Argon2 एक आधुनिक पासवर्ड हैशिंग एल्गोरिदम है जिसे GPU और ASIC हमलों का विरोध करने के लिए डिज़ाइन किया गया है। यह मेमोरी-हार्ड गणना, कॉन्फ़िगर करने योग्य पुनरावृत्तियों और समानता का समर्थन करता है, जो इसे सुरक्षित पासवर्ड भंडारण के लिए उपयुक्त बनाता है।\n\n**मुख्य बिंदु:**\n- अधिकांश अनुप्रयोगों के लिए डिफ़ॉल्ट रूप से **Argon2id** का उपयोग करें\n- केवल एन्कोडेड हैश स्ट्रिंग को स्टोर करें और कभी भी सादा पासवर्ड न रखें\n- स्वीकार्य लॉगिन विलंबता के आधार पर मेमोरी और पुनरावृत्तियों को ट्यून करें\n- प्रति पासवर्ड एक अद्वितीय यादृच्छिक नमक का प्रयोग करें\n- अतिरिक्त सुरक्षा के लिए वैकल्पिक रूप से सर्वर-साइड सीक्रेट (pepper) का उपयोग करें"
  },
  "tr": {
    "what-is-argon2": "Argon2 nedir?",
    "what-is-argon2-description-markdown": "Argon2, GPU ve ASIC saldırılarına direnmek üzere tasarlanmış modern bir şifre karma algoritmasıdır. Bellek destekli hesaplamayı, yapılandırılabilir yinelemeleri ve paralelliği destekleyerek güvenli parola depolamaya uygun hale getirir.\n\n**Önemli noktalar:**\n- Çoğu uygulama için varsayılan olarak **Argon2id** kullanın\n- Yalnızca kodlanmış karma dizeyi saklayın ve asla düz şifreleri saklayın\n- Kabul edilebilir oturum açma gecikmesine göre belleği ve yinelemeleri ayarlayın\n- Şifre başına benzersiz bir rastgele tuz kullanın\n- Ekstra koruma için isteğe bağlı olarak sunucu tarafı sırrı (pepper) kullanın"
  },
  "nl": {
    "what-is-argon2": "Wat is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is een modern wachtwoordhashing-algoritme dat is ontworpen om GPU- en ASIC-aanvallen te weerstaan. Het ondersteunt geheugenharde berekeningen, configureerbare iteraties en parallellisme, waardoor het geschikt is voor veilige wachtwoordopslag.\n\n**Belangrijkste punten:**\n- Gebruik standaard **Argon2id** voor de meeste toepassingen\n- Bewaar alleen de gecodeerde hash-string en nooit gewone wachtwoorden\n- Stem het geheugen en de iteraties af op basis van aanvaardbare inloglatentie\n- Gebruik een unieke willekeurige salt per wachtwoord\n- Gebruik optioneel een server-side geheim (pepper) voor extra bescherming"
  },
  "sv": {
    "what-is-argon2": "Vad är Argon2?",
    "what-is-argon2-description-markdown": "Argon2 är en modern hashing-algoritm för lösenord designad för att motstå GPU och ASIC attacker. Den stöder minneshård beräkning, konfigurerbara iterationer och parallellitet, vilket gör den lämplig för säker lösenordslagring.\n\n**Nyckelpunkter:**\n- Använd **Argon2id** som standard för de flesta applikationer\n- Lagra endast den kodade hashsträngen och aldrig vanliga lösenord\n- Justera minne och iterationer baserat på acceptabel inloggningsfördröjning\n- Använd ett unikt slumpmässigt salt per lösenord\n- Använd eventuellt en hemlighet på serversidan (pepper) för extra skydd"
  },
  "pl": {
    "what-is-argon2": "Co to jest Argon2?",
    "what-is-argon2-description-markdown": "Argon2 to nowoczesny algorytm mieszający hasła, zaprojektowany tak, aby był odporny na ataki GPU i ASIC. Obsługuje obliczenia wymagające dużej pamięci, konfigurowalne iteracje i równoległość, dzięki czemu nadaje się do bezpiecznego przechowywania haseł.\n\n**Kluczowe punkty:**\n- W większości aplikacji domyślnie używaj **Argon2id**\n- Przechowuj tylko zakodowany ciąg skrótu i nigdy zwykłe hasła\n- Dostosuj pamięć i iteracje w oparciu o akceptowalne opóźnienia logowania\n- Użyj unikalnej losowej soli na hasło\n- Opcjonalnie użyj sekretu po stronie serwera (pepper) dla dodatkowej ochrony"
  },
  "vi": {
    "what-is-argon2": "Argon2 là gì?",
    "what-is-argon2-description-markdown": "Argon2 là thuật toán băm mật khẩu hiện đại được thiết kế để chống lại các cuộc tấn công GPU và ASIC. Nó hỗ trợ tính toán trên bộ nhớ cứng, lặp lại có thể định cấu hình và song song, khiến nó phù hợp để lưu trữ mật khẩu an toàn.\n\n**Các điểm chính:**\n- Sử dụng **Argon2id** theo mặc định cho hầu hết các ứng dụng\n- Chỉ lưu trữ chuỗi băm được mã hóa và không bao giờ lưu trữ mật khẩu đơn giản\n- Điều chỉnh bộ nhớ và số lần lặp dựa trên độ trễ đăng nhập chấp nhận được\n- Sử dụng một loại muối ngẫu nhiên duy nhất cho mỗi mật khẩu\n- Tùy chọn sử dụng bí mật phía máy chủ (pepper) để bảo vệ thêm"
  },
  "th": {
    "what-is-argon2": "Argon2 คืออะไร?",
    "what-is-argon2-description-markdown": "Argon2 เป็นอัลกอริธึมการแฮชรหัสผ่านสมัยใหม่ที่ออกแบบมาเพื่อต้านทานการโจมตี GPU และ ASIC รองรับการคำนวณที่ต้องใช้หน่วยความจำอย่างหนัก การวนซ้ำที่กำหนดค่าได้ และการขนาน ทำให้เหมาะสำหรับการจัดเก็บรหัสผ่านที่ปลอดภัย\n\n**ประเด็นสำคัญ:**\n- ใช้ **Argon2id** เป็นค่าเริ่มต้นสำหรับแอปพลิเคชันส่วนใหญ่\n- เก็บเฉพาะสตริงแฮชที่เข้ารหัสเท่านั้น และห้ามใช้รหัสผ่านธรรมดา\n- ปรับแต่งหน่วยความจำและการวนซ้ำตามเวลาแฝงในการเข้าสู่ระบบที่ยอมรับได้\n- ใช้เกลือสุ่มที่ไม่ซ้ำกันต่อรหัสผ่าน\n- เลือกใช้ความลับฝั่งเซิร์ฟเวอร์ (pepper) เพื่อการป้องกันเพิ่มเติม"
  },
  "id": {
    "what-is-argon2": "Apa itu Argon2?",
    "what-is-argon2-description-markdown": "Argon2 adalah algoritma hashing kata sandi modern yang dirancang untuk menahan serangan GPU dan ASIC. Ini mendukung komputasi yang membutuhkan memori, iterasi yang dapat dikonfigurasi, dan paralelisme, sehingga cocok untuk penyimpanan kata sandi yang aman.\n\n**Poin-poin penting:**\n- Gunakan **Argon2id** secara default untuk sebagian besar aplikasi\n- Simpan hanya string hash yang disandikan dan jangan pernah menyimpan kata sandi biasa\n- Sesuaikan memori dan iterasi berdasarkan latensi login yang dapat diterima\n- Gunakan garam acak unik per kata sandi\n- Secara opsional gunakan rahasia sisi server (pepper) untuk perlindungan ekstra"
  },
  "he": {
    "what-is-argon2": "מה זה Argon2?",
    "what-is-argon2-description-markdown": "Argon2 הוא אלגוריתם גיבוש סיסמאות מודרני שנועד לעמוד בפני התקפות GPU וASIC. הוא תומך בחישוב קשיח זיכרון, איטרציות הניתנות להגדרה ומקביליות, מה שהופך אותו למתאים לאחסון סיסמאות מאובטח.\n\n**נקודות מפתח:**\n- השתמש ב-**Argon2id** כברירת מחדל עבור רוב היישומים\n- אחסן רק את מחרוזת ה-hash המקודדת ולעולם לא סיסמאות רגילות\n- כוונן את הזיכרון והאיטרציות על סמך זמן השהייה מקובל לכניסה\n- השתמש במלח אקראי ייחודי לכל סיסמה\n- אפשר להשתמש בסוד בצד השרת (pepper) להגנה נוספת"
  },
  "ms": {
    "what-is-argon2": "Apakah Argon2?",
    "what-is-argon2-description-markdown": "Argon2 ialah algoritma pencincangan kata laluan moden yang direka untuk menentang serangan GPU dan ASIC. Ia menyokong pengiraan keras memori, lelaran boleh dikonfigurasikan, dan selari, menjadikannya sesuai untuk penyimpanan kata laluan yang selamat.\n\n**Isi penting:**\n- Gunakan **Argon2id** secara lalai untuk kebanyakan aplikasi\n- Simpan hanya rentetan cincang yang dikodkan dan tidak pernah kata laluan biasa\n- Menala memori dan lelaran berdasarkan kependaman log masuk yang boleh diterima\n- Gunakan garam rawak unik bagi setiap kata laluan\n- Secara pilihan, gunakan rahsia sebelah pelayan (pepper) untuk perlindungan tambahan"
  },
  "no": {
    "what-is-argon2": "Hva er Argon2?",
    "what-is-argon2-description-markdown": "Argon2 er en moderne passordhashing-algoritme designet for å motstå GPU og ASIC angrep. Den støtter minnehard beregning, konfigurerbare iterasjoner og parallellitet, noe som gjør den egnet for sikker passordlagring.\n\n**Nøkkelpunkter:**\n- Bruk **Argon2id** som standard for de fleste applikasjoner\n- Lagre bare den kodede hash-strengen og aldri vanlige passord\n- Juster minne og iterasjoner basert på akseptabel påloggingsforsinkelse\n- Bruk et unikt tilfeldig salt per passord\n- Bruk eventuelt en hemmelighet på serversiden (pepper) for ekstra beskyttelse"
  }
}
</i18n>
