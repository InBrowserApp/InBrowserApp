export const toolID = 'argon2-hash-password'
export { default as icon } from '@vicons/fluent/Key20Regular'
export const path = '/tools/argon2-hash-password'
export const tags = ['hash', 'argon2', 'password', 'security', 'crypto', 'authentication']
export const features = ['offline']

export const meta = {
  en: {
    name: 'Argon2 Password Hash Generator',
    description:
      'Generate Argon2id, Argon2i, or Argon2d password hashes with configurable iterations, memory, parallelism, hash length, salt, and optional secret.',
  },
  zh: {
    name: 'Argon2 哈希密码生成器',
    description:
      '生成 Argon2id、Argon2i 或 Argon2d 密码哈希。支持配置迭代次数、内存大小、并行度、哈希长度、盐值和可选密钥。',
  },
  'zh-CN': {
    name: 'Argon2 哈希密码生成器',
    description:
      '生成 Argon2id、Argon2i 或 Argon2d 密码哈希。支持配置迭代次数、内存大小、并行度、哈希长度、盐值和可选密钥。',
  },
  'zh-TW': {
    name: 'Argon2 雜湊密碼產生器',
    description:
      '產生 Argon2id、Argon2i 或 Argon2d 密碼雜湊。支援設定迭代次數、記憶體大小、平行度、雜湊長度、鹽值與可選密鑰。',
  },
  'zh-HK': {
    name: 'Argon2 雜湊密碼產生器',
    description:
      '產生 Argon2id、Argon2i 或 Argon2d 密碼雜湊。支援設定迭代次數、記憶體大小、平行度、雜湊長度、鹽值與可選密鑰。',
  },
  es: {
    name: 'Argon2 Generador de hash de contraseña',
    description:
      'Genere hashes de contraseña Argon2id, Argon2i o Argon2d con iteraciones configurables, memoria, paralelismo, longitud de hash, sal y secreto opcional.',
  },
  fr: {
    name: 'Argon2 Générateur de hachage de mot de passe',
    description:
      'Générez des hachages de mot de passe Argon2id, Argon2i ou Argon2d avec des itérations, de la mémoire, du parallélisme, de la longueur de hachage, du sel et un secret facultatif configurables.',
  },
  de: {
    name: 'Argon2 Passwort-Hash-Generator',
    description:
      'Generieren Sie Argon2id-, Argon2i- oder Argon2d-Passwort-Hashes mit konfigurierbaren Iterationen, Speicher, Parallelität, Hash-Länge, Salt und optionalem Geheimnis.',
  },
  it: {
    name: 'Argon2 Generatore di hash password',
    description:
      'Genera hash delle password Argon2id, Argon2i o Argon2d con iterazioni configurabili, memoria, parallelismo, lunghezza hash, salt e segreto facoltativo.',
  },
  ja: {
    name: 'Argon2 パスワード ハッシュ ジェネレーター',
    description:
      '構成可能な反復、メモリ、並列処理、ハッシュ長、ソルト、およびオプションのシークレットを使用して、Argon2id、Argon2i、または Argon2d パスワード ハッシュを生成します。',
  },
  ko: {
    name: 'Argon2 비밀번호 해시 생성기',
    description:
      '구성 가능한 반복, 메모리, 병렬 처리, 해시 길이, 솔트 및 선택적 비밀을 사용하여 Argon2id, Argon2i 또는 Argon2d 암호 해시를 생성합니다.',
  },
  ru: {
    name: 'Argon2 Генератор хэшей паролей',
    description:
      'Генерируйте хэши паролей Argon2id, Argon2i или Argon2d с настраиваемыми итерациями, памятью, параллелизмом, длиной хеша, солью и необязательным секретом.',
  },
  pt: {
    name: 'Argon2 Gerador de hash de senha',
    description:
      'Gere hashes de senha Argon2id, Argon2i ou Argon2d com iterações configuráveis, memória, paralelismo, comprimento de hash, salt e segredo opcional.',
  },
  ar: {
    name: 'Argon2 مولد تجزئة كلمة المرور',
    description:
      'قم بإنشاء تجزئات كلمة المرور Argon2id، أو Argon2i، أو Argon2d بتكرارات قابلة للتكوين، وذاكرة، وتوازي، وطول التجزئة، والملح، والسر الاختياري.',
  },
  hi: {
    name: 'Argon2 पासवर्ड हैश जेनरेटर',
    description:
      'कॉन्फ़िगर करने योग्य पुनरावृत्तियों, मेमोरी, समानता, हैश लंबाई, नमक और वैकल्पिक रहस्य के साथ Argon2id, Argon2i, या Argon2d पासवर्ड हैश उत्पन्न करें।',
  },
  tr: {
    name: 'Argon2 Şifre Karması Oluşturucu',
    description:
      'Yapılandırılabilir yinelemeler, bellek, paralellik, karma uzunluğu, tuz ve isteğe bağlı sır ile Argon2id, Argon2i veya Argon2d parola karmaları oluşturun.',
  },
  nl: {
    name: 'Argon2 Wachtwoord-hashgenerator',
    description:
      'Genereer Argon2id, Argon2i of Argon2d wachtwoordhashes met configureerbare iteraties, geheugen, parallellisme, hashlengte, salt en optioneel geheim.',
  },
  sv: {
    name: 'Argon2 Lösenordshashgenerator',
    description:
      'Generera Argon2id, Argon2i eller Argon2d lösenordshashar med konfigurerbara iterationer, minne, parallellism, hashlängd, salt och valfri hemlighet.',
  },
  pl: {
    name: 'Argon2 Generator skrótu hasła',
    description:
      'Generuj skróty haseł Argon2id, Argon2i lub Argon2d z konfigurowalnymi iteracjami, pamięcią, równoległością, długością skrótu, solą i opcjonalnym sekretem.',
  },
  vi: {
    name: 'Argon2 Trình tạo hàm băm mật khẩu',
    description:
      'Tạo hàm băm mật khẩu Argon2id, Argon2i hoặc Argon2d với các lần lặp có thể định cấu hình, bộ nhớ, tính song song, độ dài hàm băm, muối và bí mật tùy chọn.',
  },
  th: {
    name: 'Argon2 ตัวสร้างแฮชรหัสผ่าน',
    description:
      'สร้างแฮชรหัสผ่าน Argon2id, Argon2i หรือ Argon2d พร้อมการวนซ้ำ หน่วยความจำ ความขนาน ความยาวแฮช Salt และความลับเสริมที่กำหนดค่าได้',
  },
  id: {
    name: 'Argon2 Pembuat Hash Kata Sandi',
    description:
      'Hasilkan hash kata sandi Argon2id, Argon2i, atau Argon2d dengan iterasi, memori, paralelisme, panjang hash, garam, dan rahasia opsional yang dapat dikonfigurasi.',
  },
  he: {
    name: 'Argon2 מחולל Hash של סיסמא',
    description:
      'צור גיבוב סיסמה Argon2id, Argon2i או Argon2d עם איטרציות הניתנות להגדרה, זיכרון, מקביליות, אורך גיבוב, מלח וסוד אופציונלי.',
  },
  ms: {
    name: 'Argon2 Penjana Hash Kata Laluan',
    description:
      'Hasilkan cincang kata laluan Argon2id, Argon2i atau Argon2d dengan lelaran boleh dikonfigurasikan, memori, selari, panjang cincang, garam dan rahsia pilihan.',
  },
  no: {
    name: 'Argon2 Passordhash-generator',
    description:
      'Generer Argon2id, Argon2i eller Argon2d passordhasher med konfigurerbare iterasjoner, minne, parallellitet, hashlengde, salt og valgfri hemmelighet.',
  },
}
