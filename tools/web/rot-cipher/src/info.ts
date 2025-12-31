export { Key20Regular as icon } from '@shared/icons/fluent'

export const toolID = 'rot-cipher'
export const path = '/tools/rot-cipher'
export const tags = ['encryption', 'cipher', 'text', 'encoding', 'rot13', 'rot47']
export const features = ['offline']

export const meta = {
  en: {
    name: 'ROT Cipher Encrypt & Decrypt',
    description:
      'Encrypt and decrypt text using ROT13, ROT5, ROT18, and ROT47 cipher algorithms. Self-reversing encryption for letters, digits, and ASCII characters',
  },
  zh: {
    name: 'ROT 密码加密 & 解密',
    description:
      '使用 ROT13、ROT5、ROT18 和 ROT47 密码算法加密和解密文本。支持字母、数字和 ASCII 字符的自反加密',
  },
  'zh-CN': {
    name: 'ROT 密码加密 & 解密',
    description:
      '使用 ROT13、ROT5、ROT18 和 ROT47 密码算法加密和解密文本。支持字母、数字和 ASCII 字符的自反加密',
  },
  'zh-TW': {
    name: 'ROT 密碼加密 & 解密',
    description:
      '使用 ROT13、ROT5、ROT18 和 ROT47 密碼演算法加密和解密文字。支援字母、數字和 ASCII 字元的自反加密',
  },
  'zh-HK': {
    name: 'ROT 密碼加密 & 解密',
    description:
      '使用 ROT13、ROT5、ROT18 和 ROT47 密碼演算法加密和解密文字。支援字母、數字和 ASCII 字元的自反加密',
  },
  es: {
    name: 'Cifrado ROT Encriptar & Desencriptar',
    description:
      'Encripta y desencripta texto usando los algoritmos de cifrado ROT13, ROT5, ROT18 y ROT47. Encriptación autorreversible para letras, dígitos y caracteres ASCII',
  },
  fr: {
    name: 'Chiffrement ROT Crypter & Décrypter',
    description:
      'Chiffrez et déchiffrez du texte avec les algorithmes ROT13, ROT5, ROT18 et ROT47. Chiffrement auto-réversible pour les lettres, chiffres et caractères ASCII',
  },
  de: {
    name: 'ROT-Chiffre Ver- & Entschlüsselung',
    description:
      'Ver- und entschlüsseln Sie Text mit ROT13, ROT5, ROT18 und ROT47 Chiffrier-Algorithmen. Selbstumkehrende Verschlüsselung für Buchstaben, Ziffern und ASCII-Zeichen',
  },
  it: {
    name: 'Cifratura ROT Cripta & Decripta',
    description:
      'Cripta e decripta il testo usando gli algoritmi di cifratura ROT13, ROT5, ROT18 e ROT47. Crittografia auto-reversibile per lettere, cifre e caratteri ASCII',
  },
  ja: {
    name: 'ROT 暗号 暗号化 & 復号化',
    description:
      'ROT13、ROT5、ROT18、ROT47 暗号アルゴリズムでテキストを暗号化・復号化。文字、数字、ASCII 文字の自己可逆暗号化',
  },
  ko: {
    name: 'ROT 암호 암호화 & 복호화',
    description:
      'ROT13, ROT5, ROT18, ROT47 암호 알고리즘으로 텍스트 암호화 및 복호화. 문자, 숫자, ASCII 문자를 위한 자기 가역 암호화',
  },
  ru: {
    name: 'ROT-шифр Шифрование & Дешифрование',
    description:
      'Шифруйте и дешифруйте текст с помощью алгоритмов ROT13, ROT5, ROT18 и ROT47. Самообратимое шифрование для букв, цифр и символов ASCII',
  },
  pt: {
    name: 'Cifra ROT Encriptar & Desencriptar',
    description:
      'Encripte e desencripte texto usando os algoritmos de cifra ROT13, ROT5, ROT18 e ROT47. Encriptação auto-reversível para letras, dígitos e caracteres ASCII',
  },
  ar: {
    name: 'تشفير ROT تشفير وفك التشفير',
    description:
      'تشفير وفك تشفير النص باستخدام خوارزميات ROT13 و ROT5 و ROT18 و ROT47. تشفير ذاتي الانعكاس للحروف والأرقام وأحرف ASCII',
  },
  hi: {
    name: 'ROT सिफर एन्क्रिप्ट और डिक्रिप्ट',
    description:
      'ROT13, ROT5, ROT18 और ROT47 सिफर एल्गोरिदम का उपयोग करके टेक्स्ट को एन्क्रिप्ट और डिक्रिप्ट करें। अक्षरों, अंकों और ASCII वर्णों के लिए स्व-प्रतिवर्ती एन्क्रिप्शन',
  },
  tr: {
    name: 'ROT Şifre Şifreleme & Şifre Çözme',
    description:
      'ROT13, ROT5, ROT18 ve ROT47 şifre algoritmaları kullanarak metni şifreleyin ve şifresini çözün. Harfler, rakamlar ve ASCII karakterler için kendinden tersine çevrilebilir şifreleme',
  },
  nl: {
    name: 'ROT-cijfer Versleutelen & Ontsleutelen',
    description:
      'Versleutel en ontsleutel tekst met ROT13, ROT5, ROT18 en ROT47 versleutelingsalgoritmen. Zelf-omkeerbare versleuteling voor letters, cijfers en ASCII-tekens',
  },
  sv: {
    name: 'ROT-chiffer Kryptera & Dekryptera',
    description:
      'Kryptera och dekryptera text med ROT13, ROT5, ROT18 och ROT47 chifferalgoritmer. Självomvändbar kryptering för bokstäver, siffror och ASCII-tecken',
  },
  pl: {
    name: 'Szyfr ROT Szyfrowanie i Deszyfrowanie',
    description:
      'Szyfruj i deszyfruj tekst za pomocą algorytmów ROT13, ROT5, ROT18 i ROT47. Samoodwracalne szyfrowanie dla liter, cyfr i znaków ASCII',
  },
  vi: {
    name: 'Mã hóa ROT Mã hóa & Giải mã',
    description:
      'Mã hóa và giải mã văn bản bằng các thuật toán mã hóa ROT13, ROT5, ROT18 và ROT47. Mã hóa tự đảo ngược cho chữ cái, chữ số và ký tự ASCII',
  },
  th: {
    name: 'รหัส ROT เข้ารหัส & ถอดรหัส',
    description:
      'เข้ารหัสและถอดรหัสข้อความด้วยอัลกอริทึม ROT13, ROT5, ROT18 และ ROT47 การเข้ารหัสแบบย้อนกลับได้สำหรับตัวอักษร ตัวเลข และอักขระ ASCII',
  },
  id: {
    name: 'Sandi ROT Enkripsi & Dekripsi',
    description:
      'Enkripsi dan dekripsi teks menggunakan algoritma sandi ROT13, ROT5, ROT18, dan ROT47. Enkripsi yang dapat membalik diri sendiri untuk huruf, angka, dan karakter ASCII',
  },
  he: {
    name: 'צופן ROT הצפנה ופענוח',
    description:
      'הצפן ופענח טקסט באמצעות אלגוריתמי צופן ROT13, ROT5, ROT18 ו-ROT47. הצפנה הפיכה עצמית לאותיות, ספרות ותווי ASCII',
  },
  ms: {
    name: 'Sifer ROT Sulitkan & Nyahsulit',
    description:
      'Sulitkan dan nyahsulit teks menggunakan algoritma sifer ROT13, ROT5, ROT18 dan ROT47. Penyulitan boleh balik kendiri untuk huruf, digit dan aksara ASCII',
  },
  no: {
    name: 'ROT-siffer Krypter & Dekrypter',
    description:
      'Krypter og dekrypter tekst med ROT13, ROT5, ROT18 og ROT47 sifferalgoritmer. Selvreverserende kryptering for bokstaver, siffer og ASCII-tegn',
  },
}
