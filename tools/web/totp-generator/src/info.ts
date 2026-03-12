export { default as icon } from '@vicons/fluent/ShieldKeyhole20Regular'
export const toolID = 'totp-generator'
export const path = '/tools/totp-generator'
export const tags = [
  'totp',
  'otp',
  '2fa',
  'mfa',
  'authentication',
  'otpauth',
  'security',
  'generator',
]
export const features = ['offline']
export const meta = {
  en: {
    name: 'TOTP Generator & otpauth URI Parser',
    description:
      'Generate live TOTP codes from Base32 secrets or otpauth URIs, inspect issuer/account settings, and debug time windows locally.',
  },
  zh: {
    name: 'TOTP 生成器与 otpauth URI 解析器',
    description:
      '从 Base32 密钥或 otpauth URI 本地生成实时 TOTP 验证码，查看 issuer/account 参数并调试时间窗。',
  },
  'zh-CN': {
    name: 'TOTP 生成器与 otpauth URI 解析器',
    description:
      '从 Base32 密钥或 otpauth URI 本地生成实时 TOTP 验证码，查看 issuer/account 参数并调试时间窗。',
  },
  'zh-TW': {
    name: 'TOTP 產生器與 otpauth URI 解析器',
    description:
      '從 Base32 密鑰或 otpauth URI 在本機產生即時 TOTP 驗證碼，查看 issuer/account 參數並除錯時間窗。',
  },
  'zh-HK': {
    name: 'TOTP 產生器與 otpauth URI 解析器',
    description:
      '從 Base32 密鑰或 otpauth URI 在本機產生即時 TOTP 驗證碼，查看 issuer/account 參數並除錯時間窗。',
  },
  es: {
    name: 'Generador TOTP y Analizador otpauth URI',
    description:
      'Genera códigos TOTP locales a partir de secretos Base32 o URIs otpauth, revisa issuer/account y depura ventanas de tiempo.',
  },
  fr: {
    name: 'Générateur TOTP et Analyseur d’URI otpauth',
    description:
      'Générez localement des codes TOTP à partir de secrets Base32 ou d’URI otpauth, inspectez issuer/account et déboguez les fenêtres de temps.',
  },
  de: {
    name: 'TOTP-Generator und otpauth-URI-Parser',
    description:
      'Erzeugen Sie lokal TOTP-Codes aus Base32-Geheimnissen oder otpauth-URIs, prüfen Sie issuer/account und debuggen Sie Zeitfenster.',
  },
  it: {
    name: 'Generatore TOTP e Parser URI otpauth',
    description:
      'Genera codici TOTP locali da segreti Base32 o URI otpauth, controlla issuer/account e analizza le finestre temporali.',
  },
  ja: {
    name: 'TOTP ジェネレーターと otpauth URI 解析',
    description:
      'Base32 シークレットや otpauth URI からローカルで TOTP を生成し、issuer/account を確認して時間窓をデバッグします。',
  },
  ko: {
    name: 'TOTP 생성기 및 otpauth URI 파서',
    description:
      'Base32 시크릿이나 otpauth URI에서 로컬 TOTP 코드를 생성하고 issuer/account 설정과 시간 창을 확인합니다.',
  },
  ru: {
    name: 'Генератор TOTP и Парсер otpauth URI',
    description:
      'Локально создавайте TOTP-коды из секретов Base32 или URI otpauth, проверяйте issuer/account и отлаживайте временные окна.',
  },
  pt: {
    name: 'Gerador TOTP e Analisador de URI otpauth',
    description:
      'Gere códigos TOTP locais a partir de segredos Base32 ou URIs otpauth, revise issuer/account e depure janelas de tempo.',
  },
  ar: {
    name: 'مولد TOTP ومحلل URI otpauth',
    description:
      'أنشئ رموز TOTP محلياً من أسرار Base32 أو عناوين otpauth URI مع فحص issuer/account وتصحيح نوافذ الوقت.',
  },
  hi: {
    name: 'TOTP जेनरेटर और otpauth URI पार्सर',
    description:
      'Base32 secret या otpauth URI से लोकल TOTP code बनाएं, issuer/account देखें और time windows debug करें।',
  },
  tr: {
    name: 'TOTP Oluşturucu ve otpauth URI Çözücü',
    description:
      'Base32 gizli anahtarları veya otpauth URI’lerini kullanarak yerelde TOTP kodu üretin, issuer/account alanlarını inceleyin ve zaman pencerelerini hata ayıklayın.',
  },
  nl: {
    name: 'TOTP-generator en otpauth-URI-parser',
    description:
      'Genereer lokaal TOTP-codes uit Base32-geheimen of otpauth-URI’s, bekijk issuer/account en debug tijdvensters.',
  },
  sv: {
    name: 'TOTP-generator och otpauth-URI-parser',
    description:
      'Generera lokala TOTP-koder från Base32-hemligheter eller otpauth-URI:er, granska issuer/account och felsök tidsfönster.',
  },
  pl: {
    name: 'Generator TOTP i Parser URI otpauth',
    description:
      'Generuj lokalnie kody TOTP z sekretów Base32 lub URI otpauth, sprawdzaj issuer/account i debuguj okna czasowe.',
  },
  vi: {
    name: 'Trình tạo TOTP và Bộ phân tích URI otpauth',
    description:
      'Tạo mã TOTP cục bộ từ bí mật Base32 hoặc URI otpauth, xem issuer/account và gỡ lỗi các cửa sổ thời gian.',
  },
  th: {
    name: 'เครื่องมือสร้าง TOTP และตัวแยกวิเคราะห์ otpauth URI',
    description:
      'สร้างรหัส TOTP ในเครื่องจากคีย์ลับ Base32 หรือ otpauth URI ตรวจสอบ issuer/account และดีบักช่วงเวลาได้',
  },
  id: {
    name: 'Generator TOTP & Parser URI otpauth',
    description:
      'Hasilkan kode TOTP lokal dari secret Base32 atau URI otpauth, periksa issuer/account, dan debug jendela waktu.',
  },
  he: {
    name: 'מחולל TOTP ומפענח URI otpauth',
    description:
      'צור קודי TOTP מקומיים מסודות Base32 או מ-otpauth URI, בדוק issuer/account ופתור בעיות חלונות זמן.',
  },
  ms: {
    name: 'Penjana TOTP & Penghurai URI otpauth',
    description:
      'Jana kod TOTP tempatan daripada rahsia Base32 atau URI otpauth, semak issuer/account dan nyahpepijat tetingkap masa.',
  },
  no: {
    name: 'TOTP-generator og otpauth-URI-parser',
    description:
      'Generer lokale TOTP-koder fra Base32-hemmeligheter eller otpauth-URI-er, se issuer/account og feilsøk tidsvinduer.',
  },
}
