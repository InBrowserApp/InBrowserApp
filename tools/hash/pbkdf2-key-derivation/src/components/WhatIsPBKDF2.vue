<template>
  <DescriptionMarkdown :title="t('what-is-pbkdf2')" :description="t('what-is-pbkdf2-description')" />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "what-is-pbkdf2": "What is PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) derives a cryptographic key from a password using a salt and many iterations. It slows down brute-force attacks and produces different keys when the salt changes.\n\n**Key points:**\n- Uses HMAC with a chosen hash (SHA-1/SHA-256/etc.)\n- Iterations increase computation cost\n- Output length is configurable\n\n**Best practices:**\n- Use a unique, random salt\n- Prefer higher iterations within acceptable performance\n- For new systems, consider memory-hard KDFs like Argon2 or scrypt"
  },
  "zh": {
    "what-is-pbkdf2": "什么是 PBKDF2？",
    "what-is-pbkdf2-description": "PBKDF2（基于密码的密钥派生函数 2）使用盐值和多次迭代从密码派生加密密钥。它可以减缓暴力破解，并在盐值变化时生成不同的密钥。\n\n**要点：**\n- 使用 HMAC + 指定哈希（SHA-1/SHA-256 等）\n- 迭代次数越高，计算成本越高\n- 输出长度可配置\n\n**最佳实践：**\n- 为每个密码使用唯一的随机盐\n- 在可接受性能内尽量提高迭代次数\n- 新系统可考虑 Argon2 或 scrypt 等内存困难型 KDF"
  },
  "zh-CN": {
    "what-is-pbkdf2": "什么是 PBKDF2？",
    "what-is-pbkdf2-description": "PBKDF2（基于密码的密钥派生函数 2）使用盐值和多次迭代从密码派生加密密钥。它可以减缓暴力破解，并在盐值变化时生成不同的密钥。\n\n**要点：**\n- 使用 HMAC + 指定哈希（SHA-1/SHA-256 等）\n- 迭代次数越高，计算成本越高\n- 输出长度可配置\n\n**最佳实践：**\n- 为每个密码使用唯一的随机盐\n- 在可接受性能内尽量提高迭代次数\n- 新系统可考虑 Argon2 或 scrypt 等内存困难型 KDF"
  },
  "zh-TW": {
    "what-is-pbkdf2": "什麼是 PBKDF2？",
    "what-is-pbkdf2-description": "PBKDF2（基於密碼的金鑰派生函式 2）使用鹽值與多次迭代從密碼派生加密金鑰。它可減緩暴力破解，並在鹽值改變時產生不同的金鑰。\n\n**要點：**\n- 使用 HMAC + 指定雜湊（SHA-1/SHA-256 等）\n- 迭代次數越高，計算成本越高\n- 輸出長度可設定\n\n**最佳實務：**\n- 為每個密碼使用唯一且隨機的鹽\n- 在可接受效能內提高迭代次數\n- 新系統可考慮 Argon2 或 scrypt 等記憶體困難型 KDF"
  },
  "zh-HK": {
    "what-is-pbkdf2": "什麼是 PBKDF2？",
    "what-is-pbkdf2-description": "PBKDF2（基於密碼的金鑰派生函式 2）使用鹽值與多次迭代從密碼派生加密金鑰。它可減緩暴力破解，並在鹽值改變時產生不同的金鑰。\n\n**要點：**\n- 使用 HMAC + 指定雜湊（SHA-1/SHA-256 等）\n- 迭代次數越高，計算成本越高\n- 輸出長度可設定\n\n**最佳實務：**\n- 為每個密碼使用唯一且隨機的鹽\n- 在可接受效能內提高迭代次數\n- 新系統可考慮 Argon2 或 scrypt 等記憶體困難型 KDF"
  },
  "es": {
    "what-is-pbkdf2": "¿Qué es PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) deriva una clave criptográfica a partir de una contraseña usando una sal y muchas iteraciones. Ralentiza los ataques de fuerza bruta y produce claves diferentes cuando la sal cambia.\n\n**Puntos clave:**\n- Usa HMAC con un hash elegido (SHA-1/SHA-256/etc.)\n- Más iteraciones aumentan el costo de cómputo\n- La longitud de salida es configurable\n\n**Buenas prácticas:**\n- Use una sal única y aleatoria\n- Prefiera más iteraciones dentro del rendimiento aceptable\n- Para sistemas nuevos, considere KDF con memoria como Argon2 o scrypt"
  },
  "fr": {
    "what-is-pbkdf2": "Qu'est-ce que PBKDF2 ?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) dérive une clé cryptographique à partir d’un mot de passe en utilisant un sel et de nombreuses itérations. Il ralentit les attaques par force brute et produit des clés différentes lorsque le sel change.\n\n**Points clés :**\n- Utilise HMAC avec un hash choisi (SHA-1/SHA-256/etc.)\n- Plus d’itérations augmentent le coût de calcul\n- La longueur de sortie est configurable\n\n**Bonnes pratiques :**\n- Utilisez un sel unique et aléatoire\n- Préférez plus d’itérations dans des limites de performance acceptables\n- Pour les nouveaux systèmes, envisagez Argon2 ou scrypt"
  },
  "de": {
    "what-is-pbkdf2": "Was ist PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) leitet aus einem Passwort mit Salt und vielen Iterationen einen kryptografischen Schlüssel ab. Es verlangsamt Brute-Force-Angriffe und erzeugt unterschiedliche Schlüssel, wenn sich das Salt ändert.\n\n**Kernpunkte:**\n- Verwendet HMAC mit einem gewählten Hash (SHA-1/SHA-256 usw.)\n- Mehr Iterationen erhöhen den Rechenaufwand\n- Die Ausgabelänge ist konfigurierbar\n\n**Best Practices:**\n- Verwenden Sie ein einzigartiges, zufälliges Salt\n- Bevorzugen Sie höhere Iterationen bei akzeptabler Performance\n- Für neue Systeme Argon2 oder scrypt in Betracht ziehen"
  },
  "it": {
    "what-is-pbkdf2": "Cos'è PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) deriva una chiave crittografica da una password usando un salt e molte iterazioni. Rallenta gli attacchi brute‑force e produce chiavi diverse quando il salt cambia.\n\n**Punti chiave:**\n- Usa HMAC con un hash scelto (SHA-1/SHA-256/ecc.)\n- Più iterazioni aumentano il costo di calcolo\n- La lunghezza dell’output è configurabile\n\n**Buone pratiche:**\n- Usa un salt unico e casuale\n- Preferisci più iterazioni entro limiti di performance accettabili\n- Per sistemi nuovi considera Argon2 o scrypt"
  },
  "ja": {
    "what-is-pbkdf2": "PBKDF2 とは？",
    "what-is-pbkdf2-description": "PBKDF2（パスワードベース鍵導出関数 2）は、ソルトと多数の反復を用いてパスワードから暗号鍵を導出します。総当たり攻撃を遅らせ、ソルトが変わると異なる鍵を生成します。\n\n**ポイント：**\n- HMAC と選択したハッシュ（SHA-1/SHA-256 など）を使用\n- 反復回数を増やすほど計算コストが増加\n- 出力長は設定可能\n\n**ベストプラクティス：**\n- 一意でランダムなソルトを使用\n- 許容できる範囲で反復回数を増やす\n- 新規システムでは Argon2 や scrypt を検討"
  },
  "ko": {
    "what-is-pbkdf2": "PBKDF2란?",
    "what-is-pbkdf2-description": "PBKDF2(Password-Based Key Derivation Function 2)는 솔트와 많은 반복을 사용해 비밀번호에서 암호 키를 파생합니다. 무차별 대입 공격을 느리게 만들고 솔트가 바뀌면 다른 키를 생성합니다.\n\n**핵심 포인트:**\n- 선택한 해시(SHA-1/SHA-256 등)와 HMAC 사용\n- 반복 횟수가 많을수록 계산 비용 증가\n- 출력 길이 설정 가능\n\n**모범 사례:**\n- 고유하고 무작위인 솔트를 사용\n- 성능이 허용되는 범위 내에서 반복 횟수 증가\n- 신규 시스템에는 Argon2 또는 scrypt 고려"
  },
  "ru": {
    "what-is-pbkdf2": "Что такое PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) выводит криптографический ключ из пароля с использованием соли и множества итераций. Это замедляет перебор и даёт разные ключи при изменении соли.\n\n**Ключевые моменты:**\n- Использует HMAC с выбранным хешем (SHA-1/SHA-256 и т. д.)\n- Больше итераций — выше вычислительные затраты\n- Длину вывода можно настроить\n\n**Рекомендации:**\n- Используйте уникальную случайную соль\n- Повышайте число итераций в пределах допустимой производительности\n- Для новых систем рассмотрите Argon2 или scrypt"
  },
  "pt": {
    "what-is-pbkdf2": "O que é PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) deriva uma chave criptográfica de uma senha usando salt e muitas iterações. Ele desacelera ataques de força bruta e produz chaves diferentes quando o salt muda.\n\n**Pontos principais:**\n- Usa HMAC com um hash escolhido (SHA-1/SHA-256/etc.)\n- Mais iterações aumentam o custo de computação\n- O comprimento de saída é configurável\n\n**Boas práticas:**\n- Use um salt único e aleatório\n- Prefira mais iterações dentro de uma performance aceitável\n- Para sistemas novos, considere Argon2 ou scrypt"
  },
  "ar": {
    "what-is-pbkdf2": "ما هو PBKDF2؟",
    "what-is-pbkdf2-description": "PBKDF2 (دالة اشتقاق المفاتيح المعتمدة على كلمة المرور 2) يشتق مفتاحًا تشفيريًا من كلمة مرور باستخدام الملح وعدد كبير من التكرارات. يبطئ هجمات القوة الغاشمة ويُنتج مفاتيح مختلفة عند تغيير الملح.\n\n**نقاط أساسية:**\n- يستخدم HMAC مع هاش مُختار (SHA-1/SHA-256/إلخ)\n- زيادة التكرارات تزيد تكلفة الحساب\n- طول الإخراج قابل للضبط\n\n**أفضل الممارسات:**\n- استخدم ملحًا فريدًا وعشوائيًا\n- فضّل عدد تكرارات أعلى ضمن أداء مقبول\n- للأنظمة الجديدة، فكّر في Argon2 أو scrypt"
  },
  "hi": {
    "what-is-pbkdf2": "PBKDF2 क्या है?",
    "what-is-pbkdf2-description": "PBKDF2 (पासवर्ड-आधारित कुंजी व्युत्पत्ति फ़ंक्शन 2) सॉल्ट और कई इटरेशन का उपयोग करके पासवर्ड से क्रिप्टोग्राफिक कुंजी व्युत्पन्न करता है। यह brute‑force हमलों को धीमा करता है और सॉल्ट बदलने पर अलग कुंजियाँ देता है।\n\n**मुख्य बिंदु:**\n- चुने हुए हैश (SHA-1/SHA-256 आदि) के साथ HMAC का उपयोग\n- अधिक इटरेशन से गणना लागत बढ़ती है\n- आउटपुट लंबाई कॉन्फ़िगर की जा सकती है\n\n**सर्वोत्तम अभ्यास:**\n- प्रत्येक पासवर्ड के लिए यूनिक, रैंडम सॉल्ट उपयोग करें\n- स्वीकार्य प्रदर्शन के भीतर अधिक इटरेशन चुनें\n- नए सिस्टम के लिए Argon2 या scrypt पर विचार करें"
  },
  "tr": {
    "what-is-pbkdf2": "PBKDF2 nedir?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2), tuz ve çok sayıda yineleme kullanarak paroladan kriptografik anahtar türetir. Kaba kuvvet saldırılarını yavaşlatır ve tuz değiştiğinde farklı anahtarlar üretir.\n\n**Temel noktalar:**\n- Seçilen bir hash (SHA-1/SHA-256 vb.) ile HMAC kullanır\n- Daha fazla yineleme daha yüksek hesaplama maliyeti demektir\n- Çıktı uzunluğu yapılandırılabilir\n\n**En iyi uygulamalar:**\n- Benzersiz ve rastgele bir tuz kullanın\n- Kabul edilebilir performans içinde yinelemeyi artırın\n- Yeni sistemler için Argon2 veya scrypt düşünün"
  },
  "nl": {
    "what-is-pbkdf2": "Wat is PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) leidt een cryptografische sleutel af uit een wachtwoord met een salt en veel iteraties. Het vertraagt brute‑force‑aanvallen en levert verschillende sleutels op wanneer de salt verandert.\n\n**Belangrijke punten:**\n- Gebruikt HMAC met een gekozen hash (SHA-1/SHA-256/etc.)\n- Meer iteraties verhogen de rekenkosten\n- Uitvoerlengte is configureerbaar\n\n**Best practices:**\n- Gebruik een unieke, willekeurige salt\n- Kies meer iteraties binnen acceptabele prestaties\n- Overweeg Argon2 of scrypt voor nieuwe systemen"
  },
  "sv": {
    "what-is-pbkdf2": "Vad är PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) härleder en kryptografisk nyckel från ett lösenord med salt och många iterationer. Det bromsar brute‑force‑attacker och ger olika nycklar när saltet ändras.\n\n**Nyckelpunkter:**\n- Använder HMAC med vald hash (SHA-1/SHA-256 osv.)\n- Fler iterationer ökar beräkningskostnaden\n- Utmatningslängden är konfigurerbar\n\n**Bästa praxis:**\n- Använd ett unikt, slumpmässigt salt\n- Välj fler iterationer inom acceptabel prestanda\n- För nya system, överväg Argon2 eller scrypt"
  },
  "pl": {
    "what-is-pbkdf2": "Czym jest PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) wyprowadza klucz kryptograficzny z hasła, używając soli i wielu iteracji. Spowalnia ataki brute‑force i generuje różne klucze, gdy sól się zmienia.\n\n**Kluczowe punkty:**\n- Używa HMAC z wybranym hashem (SHA-1/SHA-256 itp.)\n- Więcej iteracji zwiększa koszt obliczeń\n- Długość wyjścia jest konfigurowalna\n\n**Dobre praktyki:**\n- Używaj unikalnej, losowej soli\n- Wybieraj więcej iteracji w granicach akceptowalnej wydajności\n- Dla nowych systemów rozważ Argon2 lub scrypt"
  },
  "vi": {
    "what-is-pbkdf2": "PBKDF2 là gì?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) suy xuất khóa mật mã từ mật khẩu bằng muối và nhiều vòng lặp. Nó làm chậm tấn công brute‑force và tạo khóa khác nhau khi muối thay đổi.\n\n**Điểm chính:**\n- Dùng HMAC với hàm băm đã chọn (SHA-1/SHA-256, v.v.)\n- Nhiều vòng lặp hơn làm tăng chi phí tính toán\n- Độ dài đầu ra có thể cấu hình\n\n**Thực hành tốt:**\n- Dùng muối ngẫu nhiên, duy nhất\n- Tăng số vòng lặp trong phạm vi hiệu năng chấp nhận được\n- Với hệ thống mới, cân nhắc Argon2 hoặc scrypt"
  },
  "th": {
    "what-is-pbkdf2": "PBKDF2 คืออะไร?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) สร้างคีย์เข้ารหัสจากรหัสผ่านด้วยซอลต์และการวนซ้ำจำนวนมาก ช่วยชะลอการโจมตีแบบ brute‑force และให้คีย์ที่ต่างกันเมื่อซอลต์เปลี่ยนไป\n\n**ประเด็นสำคัญ:**\n- ใช้ HMAC กับแฮชที่เลือก (SHA-1/SHA-256 เป็นต้น)\n- จำนวนรอบมากขึ้นทำให้ต้นทุนการคำนวณสูงขึ้น\n- ความยาวผลลัพธ์สามารถกำหนดได้\n\n**แนวทางที่ดี:**\n- ใช้ซอลต์แบบสุ่มและไม่ซ้ำ\n- เพิ่มจำนวนรอบภายในประสิทธิภาพที่ยอมรับได้\n- ระบบใหม่ควรพิจารณา Argon2 หรือ scrypt"
  },
  "id": {
    "what-is-pbkdf2": "Apa itu PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) menurunkan kunci kriptografis dari kata sandi dengan salt dan banyak iterasi. Ini memperlambat serangan brute‑force dan menghasilkan kunci yang berbeda saat salt berubah.\n\n**Poin utama:**\n- Menggunakan HMAC dengan hash yang dipilih (SHA-1/SHA-256/dll.)\n- Lebih banyak iterasi meningkatkan biaya komputasi\n- Panjang output dapat dikonfigurasi\n\n**Praktik terbaik:**\n- Gunakan salt unik dan acak\n- Pilih iterasi lebih tinggi dalam batas performa yang wajar\n- Untuk sistem baru, pertimbangkan Argon2 atau scrypt"
  },
  "he": {
    "what-is-pbkdf2": "מה זה PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) גוזר מפתח קריפטוגרפי מסיסמה באמצעות מלח והרבה איטרציות. הוא מאט התקפות brute‑force ומייצר מפתחות שונים כשהמלח משתנה.\n\n**נקודות עיקריות:**\n- משתמש ב‑HMAC עם האש נבחר (SHA-1/SHA-256 וכו')\n- יותר איטרציות מגדילות את עלות החישוב\n- אורך הפלט ניתן להגדרה\n\n**שיטות מומלצות:**\n- השתמשו במלח ייחודי ואקראי\n- העדיפו יותר איטרציות במסגרת ביצועים סבירים\n- למערכות חדשות שקלו Argon2 או scrypt"
  },
  "ms": {
    "what-is-pbkdf2": "Apakah PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) menghasilkan kunci kriptografi daripada kata laluan dengan salt dan banyak iterasi. Ia memperlahankan serangan brute‑force dan menghasilkan kunci berbeza apabila salt berubah.\n\n**Perkara utama:**\n- Menggunakan HMAC dengan hash terpilih (SHA-1/SHA-256 dll.)\n- Lebih banyak iterasi meningkatkan kos pengiraan\n- Panjang output boleh dikonfigurasi\n\n**Amalan terbaik:**\n- Gunakan salt yang unik dan rawak\n- Pilih iterasi lebih tinggi dalam prestasi yang boleh diterima\n- Untuk sistem baharu, pertimbangkan Argon2 atau scrypt"
  },
  "no": {
    "what-is-pbkdf2": "Hva er PBKDF2?",
    "what-is-pbkdf2-description": "PBKDF2 (Password-Based Key Derivation Function 2) avleder en kryptografisk nøkkel fra et passord ved hjelp av salt og mange iterasjoner. Den bremser brute‑force‑angrep og gir ulike nøkler når saltet endres.\n\n**Hovedpunkter:**\n- Bruker HMAC med valgt hash (SHA-1/SHA-256 osv.)\n- Flere iterasjoner øker beregningskostnaden\n- Utdata‑lengden kan konfigureres\n\n**Beste praksis:**\n- Bruk et unikt, tilfeldig salt\n- Velg flere iterasjoner innen akseptabel ytelse\n- For nye systemer, vurder Argon2 eller scrypt"
  }
}
</i18n>
