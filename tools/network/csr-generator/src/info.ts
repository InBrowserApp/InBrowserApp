export { default as icon } from '@vicons/fluent/Key24Regular'
export const toolID = 'csr-generator'
export const path = '/tools/csr-generator'
export const tags = ['csr', 'pkcs10', 'x509', 'certificate', 'tls', 'key', 'security']
export const features = ['offline']

export const meta = {
  en: {
    name: 'CSR Generator',
    description:
      'Generate PKCS#10 certificate signing requests locally. Create new keys or import existing private keys, set subject and SAN, and export PEM.',
  },
  zh: {
    name: 'CSR 生成器',
    description:
      '本地生成 PKCS#10 证书签名请求。创建新密钥或导入已有私钥，填写主体与 SAN，并导出 PEM。',
  },
  'zh-CN': {
    name: 'CSR 生成器',
    description:
      '本地生成 PKCS#10 证书签名请求。创建新密钥或导入已有私钥，填写主体与 SAN，并导出 PEM。',
  },
  'zh-TW': {
    name: 'CSR 產生器',
    description:
      '在本機產生 PKCS#10 憑證簽章請求。建立新金鑰或匯入既有私鑰，填寫主體與 SAN，並匯出 PEM。',
  },
  'zh-HK': {
    name: 'CSR 產生器',
    description:
      '在本機產生 PKCS#10 證書簽名請求。建立新金鑰或匯入已有私鑰，填寫主體與 SAN，並匯出 PEM。',
  },
  es: {
    name: 'Generador de CSR',
    description:
      'Genera solicitudes de firma de certificado PKCS#10 localmente. Crea nuevas claves o importa claves privadas existentes, configura sujeto y SAN, y exporta PEM.',
  },
  fr: {
    name: 'Générateur de CSR',
    description:
      'Générez localement des requêtes de signature de certificat PKCS#10. Créez de nouvelles clés ou importez des clés privées existantes, définissez le sujet et le SAN, et exportez en PEM.',
  },
  de: {
    name: 'CSR-Generator',
    description:
      'Erstellen Sie lokal PKCS#10-Zertifikatsanfragen. Neue Schlüssel erstellen oder vorhandene Private Keys importieren, Subject und SAN setzen und PEM exportieren.',
  },
  it: {
    name: 'Generatore CSR',
    description:
      'Genera richieste di firma certificato PKCS#10 in locale. Crea nuove chiavi o importa chiavi private esistenti, imposta soggetto e SAN ed esporta in PEM.',
  },
  ja: {
    name: 'CSR 生成ツール',
    description:
      'PKCS#10 の証明書署名要求をローカルで生成します。新規鍵の作成や既存秘密鍵のインポート、Subject と SAN の設定、PEM の出力ができます。',
  },
  ko: {
    name: 'CSR 생성기',
    description:
      '로컬에서 PKCS#10 인증서 서명 요청을 생성합니다. 새 키를 만들거나 기존 개인 키를 가져오고, 주체와 SAN을 설정한 뒤 PEM으로 내보냅니다.',
  },
  ru: {
    name: 'Генератор CSR',
    description:
      'Локально создавайте запросы на подпись сертификата PKCS#10. Создавайте новые ключи или импортируйте существующие приватные ключи, задавайте Subject и SAN и экспортируйте PEM.',
  },
  pt: {
    name: 'Gerador de CSR',
    description:
      'Gere solicitações de assinatura de certificado PKCS#10 localmente. Crie novas chaves ou importe chaves privadas existentes, defina assunto e SAN e exporte PEM.',
  },
  ar: {
    name: 'مولّد CSR',
    description:
      'أنشئ طلبات توقيع شهادات PKCS#10 محلياً. أنشئ مفاتيح جديدة أو استورد مفاتيح خاصة موجودة، واضبط الموضوع و SAN وصدّر PEM.',
  },
  hi: {
    name: 'CSR जनरेटर',
    description:
      'स्थानीय रूप से PKCS#10 प्रमाणपत्र हस्ताक्षर अनुरोध बनाएँ। नई कुंजियाँ बनाएं या मौजूदा निजी कुंजियाँ आयात करें, Subject और SAN सेट करें, और PEM निर्यात करें।',
  },
  tr: {
    name: 'CSR Üretici',
    description:
      'Yerel olarak PKCS#10 sertifika imzalama istekleri üretin. Yeni anahtarlar oluşturun veya mevcut özel anahtarları içe aktarın, konu ve SAN ayarlayın ve PEM dışa aktarın.',
  },
  nl: {
    name: 'CSR-generator',
    description:
      'Genereer lokaal PKCS#10-certificaataanvragen. Maak nieuwe sleutels of importeer bestaande privésleutels, stel subject en SAN in en exporteer PEM.',
  },
  sv: {
    name: 'CSR-generator',
    description:
      'Skapa PKCS#10-certifikatsförfrågningar lokalt. Skapa nya nycklar eller importera befintliga privata nycklar, ange subject och SAN och exportera PEM.',
  },
  pl: {
    name: 'Generator CSR',
    description:
      'Generuj lokalnie żądania podpisu certyfikatu PKCS#10. Twórz nowe klucze lub importuj istniejące klucze prywatne, ustaw subject i SAN oraz eksportuj PEM.',
  },
  vi: {
    name: 'Trình tạo CSR',
    description:
      'Tạo yêu cầu ký chứng chỉ PKCS#10 ngay trên máy. Tạo khóa mới hoặc nhập khóa riêng có sẵn, đặt Subject và SAN, rồi xuất PEM.',
  },
  th: {
    name: 'เครื่องมือสร้าง CSR',
    description:
      'สร้างคำขอลงนามใบรับรอง PKCS#10 แบบโลคัล สร้างคีย์ใหม่หรือนำเข้าคีย์ส่วนตัว ตั้งค่า Subject และ SAN แล้วส่งออก PEM.',
  },
  id: {
    name: 'Generator CSR',
    description:
      'Buat permintaan penandatanganan sertifikat PKCS#10 secara lokal. Buat kunci baru atau impor kunci privat yang ada, atur subject dan SAN, lalu ekspor PEM.',
  },
  he: {
    name: 'מחולל CSR',
    description:
      'יצירת בקשות חתימה לתעודות PKCS#10 באופן מקומי. יצירת מפתחות חדשים או ייבוא מפתחות פרטיים קיימים, הגדרת Subject ו‑SAN וייצוא PEM.',
  },
  ms: {
    name: 'Penjana CSR',
    description:
      'Hasilkan permintaan tandatangan sijil PKCS#10 secara tempatan. Jana kunci baharu atau import kunci peribadi sedia ada, tetapkan subject dan SAN, dan eksport PEM.',
  },
  no: {
    name: 'CSR-generator',
    description:
      'Generer PKCS#10-sertifikatforespørsler lokalt. Lag nye nøkler eller importer eksisterende private nøkler, sett subject og SAN og eksporter PEM.',
  },
}
