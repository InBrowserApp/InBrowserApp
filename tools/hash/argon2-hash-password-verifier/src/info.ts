export const toolID = 'argon2-hash-password-verifier'
export { default as icon } from '@vicons/fluent/Key20Regular'
export const path = '/tools/argon2-hash-password-verifier'
export const tags = [
  'hash',
  'argon2',
  'password',
  'security',
  'crypto',
  'authentication',
  'verify',
  'validation',
]
export const features = ['offline']

export const meta = {
  en: {
    name: 'Argon2 Password Hash Verifier',
    description:
      'Verify whether a plain password matches an encoded Argon2 hash string, with optional secret support for keyed verification.',
  },
  zh: {
    name: 'Argon2 哈希密码验证器',
    description: '验证明文密码是否与编码的 Argon2 哈希字符串匹配，并支持可选密钥参与验证。',
  },
  'zh-CN': {
    name: 'Argon2 哈希密码验证器',
    description: '验证明文密码是否与编码的 Argon2 哈希字符串匹配，并支持可选密钥参与验证。',
  },
  'zh-TW': {
    name: 'Argon2 雜湊密碼驗證器',
    description: '驗證明文密碼是否與編碼的 Argon2 雜湊字串匹配，並支援可選密鑰參與驗證。',
  },
  'zh-HK': {
    name: 'Argon2 雜湊密碼驗證器',
    description: '驗證明文密碼是否與編碼的 Argon2 雜湊字串匹配，並支援可選密鑰參與驗證。',
  },
  es: {
    name: 'Argon2 Verificador de hash de contraseña',
    description:
      'Verifique si una contraseña simple coincide con una cadena hash Argon2 codificada, con soporte secreto opcional para verificación con clave.',
  },
  fr: {
    name: 'Argon2 Vérificateur de hachage de mot de passe',
    description:
      'Vérifiez si un mot de passe simple correspond à une chaîne de hachage Argon2 codée, avec prise en charge facultative du secret pour la vérification par clé.',
  },
  de: {
    name: 'Argon2 Passwort-Hash-Verifizierer',
    description:
      'Überprüfen Sie, ob ein einfaches Passwort mit einer verschlüsselten Argon2-Hash-Zeichenfolge übereinstimmt, mit optionaler geheimer Unterstützung für die Schlüsselüberprüfung.',
  },
  it: {
    name: 'Argon2 Verificatore hash password',
    description:
      'Verifica se una password semplice corrisponde a una stringa hash Argon2 codificata, con supporto segreto opzionale per la verifica con chiave.',
  },
  ja: {
    name: 'Argon2 パスワード ハッシュ検証ツール',
    description:
      'キー付き検証のオプションのシークレット サポートを使用して、プレーン パスワードがエンコードされた Argon2 ハッシュ文字列と一致するかどうかを検証します。',
  },
  ko: {
    name: 'Argon2 비밀번호 해시 검증기',
    description:
      '키 확인을 위한 선택적인 비밀 지원을 통해 일반 비밀번호가 인코딩된 Argon2 해시 문자열과 일치하는지 확인합니다.',
  },
  ru: {
    name: 'Argon2 Средство проверки хеша пароля',
    description:
      'Проверьте, соответствует ли простой пароль закодированной хеш-строке Argon2, с дополнительной поддержкой секрета для проверки с помощью ключа.',
  },
  pt: {
    name: 'Argon2 Verificador de hash de senha',
    description:
      'Verifique se uma senha simples corresponde a uma string hash codificada Argon2, com suporte secreto opcional para verificação com chave.',
  },
  ar: {
    name: 'Argon2 أداة التحقق من تجزئة كلمة المرور',
    description:
      'تحقق مما إذا كانت كلمة المرور العادية تتطابق مع سلسلة تجزئة Argon2 المشفرة، مع دعم سري اختياري للتحقق من المفاتيح.',
  },
  hi: {
    name: 'Argon2 पासवर्ड हैश सत्यापनकर्ता',
    description:
      'कुंजी सत्यापन के लिए वैकल्पिक गुप्त समर्थन के साथ, सत्यापित करें कि एक सादा पासवर्ड एन्कोडेड Argon2 हैश स्ट्रिंग से मेल खाता है या नहीं।',
  },
  tr: {
    name: 'Argon2 Şifre Karması Doğrulayıcı',
    description:
      'Anahtarlı doğrulama için isteğe bağlı gizli destekle, düz bir parolanın kodlanmış bir Argon2 karma dizesiyle eşleşip eşleşmediğini doğrulayın.',
  },
  nl: {
    name: 'Argon2 Wachtwoord-hashverificatie',
    description:
      'Controleer of een gewoon wachtwoord overeenkomt met een gecodeerde Argon2 hashstring, met optionele geheime ondersteuning voor sleutelverificatie.',
  },
  sv: {
    name: 'Argon2 Lösenordshashverifierare',
    description:
      'Verifiera om ett vanligt lösenord matchar en kodad Argon2 hashsträng, med valfritt hemligt stöd för nycklad verifiering.',
  },
  pl: {
    name: 'Argon2 Weryfikator skrótu hasła',
    description:
      'Sprawdź, czy zwykłe hasło pasuje do zakodowanego ciągu skrótu Argon2, z opcjonalną obsługą kluczy tajnych do weryfikacji kluczem.',
  },
  vi: {
    name: 'Argon2 Trình xác minh băm mật khẩu',
    description:
      'Xác minh xem mật khẩu đơn giản có khớp với chuỗi băm Argon2 được mã hóa hay không, với hỗ trợ bí mật tùy chọn để xác minh bằng khóa.',
  },
  th: {
    name: 'Argon2 ตัวตรวจสอบแฮชรหัสผ่าน',
    description:
      'ตรวจสอบว่ารหัสผ่านธรรมดาตรงกับสตริงแฮช Argon2 ที่เข้ารหัสหรือไม่ พร้อมตัวเลือกการสนับสนุนที่เป็นความลับสำหรับการยืนยันแบบใช้คีย์',
  },
  id: {
    name: 'Argon2 Pemverifikasi Hash Kata Sandi',
    description:
      'Verifikasi apakah kata sandi biasa cocok dengan string hash Argon2 yang dikodekan, dengan dukungan rahasia opsional untuk verifikasi kunci.',
  },
  he: {
    name: 'מאמת Hash סיסמה Argon2',
    description:
      'ודא אם סיסמה פשוטה תואמת למחרוזת hash מקודדת Argon2, עם תמיכה סודית אופציונלית עבור אימות מקודד.',
  },
  ms: {
    name: 'Argon2 Pengesah Cincang Kata Laluan',
    description:
      'Sahkan sama ada kata laluan biasa sepadan dengan rentetan cincang Argon2 yang dikodkan, dengan sokongan rahsia pilihan untuk pengesahan berkunci.',
  },
  no: {
    name: 'Argon2 Passord Hash Verifier',
    description:
      'Bekreft om et vanlig passord samsvarer med en kodet Argon2 hash-streng, med valgfri hemmelig støtte for nøkkelkontroll.',
  },
}
