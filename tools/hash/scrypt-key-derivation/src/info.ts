export const toolID = 'scrypt-key-derivation'
export { default as icon } from '@vicons/fluent/Key20Regular'
export const path = '/tools/scrypt-key-derivation'
export const tags = ['hash', 'kdf', 'scrypt', 'password', 'key', 'crypto', 'security']
export const features = ['offline']

export const meta = {
  en: {
    name: 'scrypt Key Derivation',
    description:
      'Derive keys from a password and salt with scrypt. Configure N (cost factor), r (block size), p (parallelism), and output length with hex or base64 output.',
  },
  zh: {
    name: 'scrypt 密钥派生',
    description:
      '使用 scrypt 从密码和盐派生密钥。可配置 N（成本因子）、r（块大小）、p（并行度）和输出长度，支持十六进制或 Base64 输出。',
  },
  'zh-CN': {
    name: 'scrypt 密钥派生',
    description:
      '使用 scrypt 从密码和盐派生密钥。可配置 N（成本因子）、r（块大小）、p（并行度）和输出长度，支持十六进制或 Base64 输出。',
  },
  'zh-TW': {
    name: 'scrypt 金鑰派生',
    description:
      '使用 scrypt 從密碼和鹽派生金鑰。可設定 N（成本因子）、r（區塊大小）、p（並行度）與輸出長度，支援十六進位或 Base64 輸出。',
  },
  'zh-HK': {
    name: 'scrypt 金鑰派生',
    description:
      '使用 scrypt 從密碼和鹽派生金鑰。可設定 N（成本因子）、r（區塊大小）、p（並行度）與輸出長度，支援十六進位或 Base64 輸出。',
  },
  es: {
    name: 'Derivación de Claves scrypt',
    description:
      'Deriva claves a partir de una contraseña y una sal con scrypt. Configura iteraciones, algoritmo hash y longitud de salida con resultados en hex o base64.',
  },
  fr: {
    name: 'Dérivation de Clé scrypt',
    description:
      'Dérivez des clés à partir d’un mot de passe et d’un sel avec scrypt. Configurez les itérations, l’algorithme de hachage et la longueur de sortie en hex ou base64.',
  },
  de: {
    name: 'scrypt-Schlüsselableitung',
    description:
      'Leiten Sie Schlüssel aus Passwort und Salt mit scrypt ab. Konfigurieren Sie Iterationen, Hash-Algorithmus und Ausgabelänge mit Hex- oder Base64-Ausgabe.',
  },
  it: {
    name: 'Derivazione Chiave scrypt',
    description:
      'Deriva chiavi da password e salt con scrypt. Configura iterazioni, algoritmo hash e lunghezza dell’output con risultati in hex o base64.',
  },
  ja: {
    name: 'scrypt 鍵導出',
    description:
      'scrypt を使ってパスワードとソルトから鍵を導出します。反復回数、ハッシュアルゴリズム、出力長を設定し、16進数またはBase64で出力します。',
  },
  ko: {
    name: 'scrypt 키 파생',
    description:
      'scrypt로 비밀번호와 솔트에서 키를 파생합니다. 반복 횟수, 해시 알고리즘, 출력 길이를 설정하고 hex 또는 base64로 출력합니다.',
  },
  ru: {
    name: 'Вывод ключей scrypt',
    description:
      'Выводите ключи из пароля и соли с scrypt. Настраивайте число итераций, хэш‑алгоритм и длину вывода с результатом в hex или base64.',
  },
  pt: {
    name: 'Derivação de Chaves scrypt',
    description:
      'Derive chaves a partir de senha e salt com scrypt. Configure iterações, algoritmo hash e comprimento de saída com resultado em hex ou base64.',
  },
  ar: {
    name: 'اشتقاق مفاتيح scrypt',
    description:
      'اشتق المفاتيح من كلمة مرور وملح باستخدام scrypt. اضبط عدد التكرارات وخوارزمية الهاش وطول الإخراج مع نتائج بصيغة hex أو base64.',
  },
  hi: {
    name: 'scrypt कुंजी व्युत्पत्ति',
    description:
      'scrypt के साथ पासवर्ड और सॉल्ट से कुंजियाँ व्युत्पन्न करें। इटरेशन, हैश एल्गोरिदम और आउटपुट लंबाई सेट करें, आउटपुट hex या base64 में।',
  },
  tr: {
    name: 'scrypt Anahtar Türetme',
    description:
      'scrypt ile parola ve tuzdan anahtar türetin. Yineleme sayısı, hash algoritması ve çıktı uzunluğunu ayarlayın; hex veya base64 çıktı alın.',
  },
  nl: {
    name: 'scrypt-sleutelafleiding',
    description:
      'Leid sleutels af uit een wachtwoord en salt met scrypt. Stel iteraties, hash-algoritme en uitvoerlengte in met hex- of base64-uitvoer.',
  },
  sv: {
    name: 'scrypt-nyckelhärledning',
    description:
      'Härled nycklar från lösenord och salt med scrypt. Konfigurera iterationer, hash-algoritm och utmatningslängd med hex- eller base64‑utdata.',
  },
  pl: {
    name: 'Wyprowadzanie klucza scrypt',
    description:
      'Wyprowadzaj klucze z hasła i soli za pomocą scrypt. Ustaw iteracje, algorytm hash i długość wyjścia z wynikiem w hex lub base64.',
  },
  vi: {
    name: 'Suy xuất khóa scrypt',
    description:
      'Suy xuất khóa từ mật khẩu và muối bằng scrypt. Cấu hình số vòng lặp, thuật toán băm và độ dài đầu ra với kết quả hex hoặc base64.',
  },
  th: {
    name: 'การสร้างคีย์ scrypt',
    description:
      'สร้างคีย์จากรหัสผ่านและซอลต์ด้วย scrypt ปรับจำนวนรอบ อัลกอริทึมแฮช และความยาวผลลัพธ์ พร้อมเอาต์พุตแบบ hex หรือ base64',
  },
  id: {
    name: 'Derivasi Kunci scrypt',
    description:
      'Derivasi kunci dari kata sandi dan salt dengan scrypt. Atur iterasi, algoritma hash, dan panjang output dengan hasil hex atau base64.',
  },
  he: {
    name: 'נגזרת מפתח scrypt',
    description:
      'גזור מפתחות מסיסמה וממלח באמצעות scrypt. הגדר איטרציות, אלגוריתם גיבוב ואורך פלט עם תוצאות hex או base64.',
  },
  ms: {
    name: 'Derivasi Kunci scrypt',
    description:
      'Derivasi kunci daripada kata laluan dan salt dengan scrypt. Tetapkan iterasi, algoritma hash dan panjang output dengan hasil hex atau base64.',
  },
  no: {
    name: 'scrypt-nøkkelavledning',
    description:
      'Avled nøkler fra passord og salt med scrypt. Konfigurer iterasjoner, hash‑algoritme og utdata‑lengde med hex- eller base64‑utdata.',
  },
}
