export const toolID = 'pbkdf2-key-derivation'
export { default as icon } from '@vicons/fluent/Key20Regular'
export const path = '/tools/pbkdf2-key-derivation'
export const tags = ['hash', 'kdf', 'pbkdf2', 'password', 'key', 'crypto', 'security']
export const features = ['offline']

export const meta = {
  en: {
    name: 'PBKDF2 Key Derivation',
    description:
      'Derive keys from a password and salt with PBKDF2. Configure iterations, hash algorithm, and output length with hex or base64 output.',
  },
  zh: {
    name: 'PBKDF2 密钥派生',
    description:
      '使用 PBKDF2 从密码和盐派生密钥。可配置迭代次数、哈希算法和输出长度，支持十六进制或 Base64 输出。',
  },
  'zh-CN': {
    name: 'PBKDF2 密钥派生',
    description:
      '使用 PBKDF2 从密码和盐派生密钥。可配置迭代次数、哈希算法和输出长度，支持十六进制或 Base64 输出。',
  },
  'zh-TW': {
    name: 'PBKDF2 金鑰派生',
    description:
      '使用 PBKDF2 從密碼和鹽派生金鑰。可設定迭代次數、雜湊演算法與輸出長度，支援十六進位或 Base64 輸出。',
  },
  'zh-HK': {
    name: 'PBKDF2 金鑰派生',
    description:
      '使用 PBKDF2 從密碼和鹽派生金鑰。可設定迭代次數、雜湊演算法與輸出長度，支援十六進位或 Base64 輸出。',
  },
  es: {
    name: 'Derivación de Claves PBKDF2',
    description:
      'Deriva claves a partir de una contraseña y una sal con PBKDF2. Configura iteraciones, algoritmo hash y longitud de salida con resultados en hex o base64.',
  },
  fr: {
    name: 'Dérivation de Clé PBKDF2',
    description:
      'Dérivez des clés à partir d’un mot de passe et d’un sel avec PBKDF2. Configurez les itérations, l’algorithme de hachage et la longueur de sortie en hex ou base64.',
  },
  de: {
    name: 'PBKDF2-Schlüsselableitung',
    description:
      'Leiten Sie Schlüssel aus Passwort und Salt mit PBKDF2 ab. Konfigurieren Sie Iterationen, Hash-Algorithmus und Ausgabelänge mit Hex- oder Base64-Ausgabe.',
  },
  it: {
    name: 'Derivazione Chiave PBKDF2',
    description:
      'Deriva chiavi da password e salt con PBKDF2. Configura iterazioni, algoritmo hash e lunghezza dell’output con risultati in hex o base64.',
  },
  ja: {
    name: 'PBKDF2 鍵導出',
    description:
      'PBKDF2 を使ってパスワードとソルトから鍵を導出します。反復回数、ハッシュアルゴリズム、出力長を設定し、16進数またはBase64で出力します。',
  },
  ko: {
    name: 'PBKDF2 키 파생',
    description:
      'PBKDF2로 비밀번호와 솔트에서 키를 파생합니다. 반복 횟수, 해시 알고리즘, 출력 길이를 설정하고 hex 또는 base64로 출력합니다.',
  },
  ru: {
    name: 'Вывод ключей PBKDF2',
    description:
      'Выводите ключи из пароля и соли с PBKDF2. Настраивайте число итераций, хэш‑алгоритм и длину вывода с результатом в hex или base64.',
  },
  pt: {
    name: 'Derivação de Chaves PBKDF2',
    description:
      'Derive chaves a partir de senha e salt com PBKDF2. Configure iterações, algoritmo hash e comprimento de saída com resultado em hex ou base64.',
  },
  ar: {
    name: 'اشتقاق مفاتيح PBKDF2',
    description:
      'اشتق المفاتيح من كلمة مرور وملح باستخدام PBKDF2. اضبط عدد التكرارات وخوارزمية الهاش وطول الإخراج مع نتائج بصيغة hex أو base64.',
  },
  hi: {
    name: 'PBKDF2 कुंजी व्युत्पत्ति',
    description:
      'PBKDF2 के साथ पासवर्ड और सॉल्ट से कुंजियाँ व्युत्पन्न करें। इटरेशन, हैश एल्गोरिदम और आउटपुट लंबाई सेट करें, आउटपुट hex या base64 में।',
  },
  tr: {
    name: 'PBKDF2 Anahtar Türetme',
    description:
      'PBKDF2 ile parola ve tuzdan anahtar türetin. Yineleme sayısı, hash algoritması ve çıktı uzunluğunu ayarlayın; hex veya base64 çıktı alın.',
  },
  nl: {
    name: 'PBKDF2-sleutelafleiding',
    description:
      'Leid sleutels af uit een wachtwoord en salt met PBKDF2. Stel iteraties, hash-algoritme en uitvoerlengte in met hex- of base64-uitvoer.',
  },
  sv: {
    name: 'PBKDF2-nyckelhärledning',
    description:
      'Härled nycklar från lösenord och salt med PBKDF2. Konfigurera iterationer, hash-algoritm och utmatningslängd med hex- eller base64‑utdata.',
  },
  pl: {
    name: 'Wyprowadzanie klucza PBKDF2',
    description:
      'Wyprowadzaj klucze z hasła i soli za pomocą PBKDF2. Ustaw iteracje, algorytm hash i długość wyjścia z wynikiem w hex lub base64.',
  },
  vi: {
    name: 'Suy xuất khóa PBKDF2',
    description:
      'Suy xuất khóa từ mật khẩu và muối bằng PBKDF2. Cấu hình số vòng lặp, thuật toán băm và độ dài đầu ra với kết quả hex hoặc base64.',
  },
  th: {
    name: 'การสร้างคีย์ PBKDF2',
    description:
      'สร้างคีย์จากรหัสผ่านและซอลต์ด้วย PBKDF2 ปรับจำนวนรอบ อัลกอริทึมแฮช และความยาวผลลัพธ์ พร้อมเอาต์พุตแบบ hex หรือ base64',
  },
  id: {
    name: 'Derivasi Kunci PBKDF2',
    description:
      'Derivasi kunci dari kata sandi dan salt dengan PBKDF2. Atur iterasi, algoritma hash, dan panjang output dengan hasil hex atau base64.',
  },
  he: {
    name: 'נגזרת מפתח PBKDF2',
    description:
      'גזור מפתחות מסיסמה וממלח באמצעות PBKDF2. הגדר איטרציות, אלגוריתם גיבוב ואורך פלט עם תוצאות hex או base64.',
  },
  ms: {
    name: 'Derivasi Kunci PBKDF2',
    description:
      'Derivasi kunci daripada kata laluan dan salt dengan PBKDF2. Tetapkan iterasi, algoritma hash dan panjang output dengan hasil hex atau base64.',
  },
  no: {
    name: 'PBKDF2-nøkkelavledning',
    description:
      'Avled nøkler fra passord og salt med PBKDF2. Konfigurer iterasjoner, hash‑algoritme og utdata‑lengde med hex- eller base64‑utdata.',
  },
}
