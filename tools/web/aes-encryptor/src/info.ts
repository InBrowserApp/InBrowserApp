export { LockClosed20Regular as icon } from '@shared/icons/fluent'

export const toolID = 'aes-encryptor'
export const path = '/tools/aes-encryptor'
export const tags = ['encryption', 'aes', 'security', 'cipher', 'crypto']
export const features = ['offline']

export const meta = {
  en: {
    name: 'AES Encryptor',
    description:
      'Encrypt text or files using AES algorithm with GCM, CBC, and CTR modes. Supports password-based key derivation (PBKDF2) and raw key input with 128/192/256-bit key lengths',
  },
  zh: {
    name: 'AES 加密器',
    description:
      '使用 AES 算法加密文本或文件，支持 GCM、CBC 和 CTR 模式。支持基于密码的密钥派生 (PBKDF2) 和原始密钥输入，密钥长度支持 128/192/256 位',
  },
  'zh-CN': {
    name: 'AES 加密器',
    description:
      '使用 AES 算法加密文本或文件，支持 GCM、CBC 和 CTR 模式。支持基于密码的密钥派生 (PBKDF2) 和原始密钥输入，密钥长度支持 128/192/256 位',
  },
  'zh-TW': {
    name: 'AES 加密器',
    description:
      '使用 AES 演算法加密文字或檔案，支援 GCM、CBC 和 CTR 模式。支援基於密碼的金鑰衍生 (PBKDF2) 和原始金鑰輸入，金鑰長度支援 128/192/256 位元',
  },
  'zh-HK': {
    name: 'AES 加密器',
    description:
      '使用 AES 演算法加密文字或檔案，支援 GCM、CBC 和 CTR 模式。支援基於密碼的金鑰衍生 (PBKDF2) 和原始金鑰輸入，金鑰長度支援 128/192/256 位元',
  },
  es: {
    name: 'Encriptador AES',
    description:
      'Encripta texto o archivos usando el algoritmo AES con modos GCM, CBC y CTR. Soporta derivación de clave basada en contraseña (PBKDF2) y entrada de clave directa con longitudes de 128/192/256 bits',
  },
  fr: {
    name: 'Chiffreur AES',
    description:
      "Chiffrez du texte ou des fichiers avec l'algorithme AES en modes GCM, CBC et CTR. Prend en charge la dérivation de clé basée sur mot de passe (PBKDF2) et l'entrée de clé brute avec des longueurs de 128/192/256 bits",
  },
  de: {
    name: 'AES-Verschlüsseler',
    description:
      'Verschlüsseln Sie Text oder Dateien mit dem AES-Algorithmus in GCM-, CBC- und CTR-Modi. Unterstützt passwortbasierte Schlüsselableitung (PBKDF2) und direkte Schlüsseleingabe mit 128/192/256-Bit-Schlüssellängen',
  },
  it: {
    name: 'Crittografatore AES',
    description:
      "Cripta testo o file usando l'algoritmo AES con modalità GCM, CBC e CTR. Supporta la derivazione della chiave basata su password (PBKDF2) e l'input della chiave grezza con lunghezze di 128/192/256 bit",
  },
  ja: {
    name: 'AES 暗号化ツール',
    description:
      'AES アルゴリズムを使用して GCM、CBC、CTR モードでテキストまたはファイルを暗号化。パスワードベースの鍵導出 (PBKDF2) と 128/192/256 ビット鍵長の直接鍵入力をサポート',
  },
  ko: {
    name: 'AES 암호화 도구',
    description:
      'GCM, CBC, CTR 모드의 AES 알고리즘으로 텍스트 또는 파일 암호화. 비밀번호 기반 키 파생 (PBKDF2) 및 128/192/256비트 키 길이의 원시 키 입력 지원',
  },
  ru: {
    name: 'AES Шифратор',
    description:
      'Шифруйте текст или файлы с помощью алгоритма AES в режимах GCM, CBC и CTR. Поддерживает вывод ключа на основе пароля (PBKDF2) и прямой ввод ключа с длиной 128/192/256 бит',
  },
  pt: {
    name: 'Encriptador AES',
    description:
      'Encripte texto ou arquivos usando o algoritmo AES com modos GCM, CBC e CTR. Suporta derivação de chave baseada em senha (PBKDF2) e entrada de chave direta com comprimentos de 128/192/256 bits',
  },
  ar: {
    name: 'مشفر AES',
    description:
      'تشفير النص أو الملفات باستخدام خوارزمية AES مع أوضاع GCM و CBC و CTR. يدعم اشتقاق المفتاح القائم على كلمة المرور (PBKDF2) وإدخال المفتاح المباشر بأطوال 128/192/256 بت',
  },
  hi: {
    name: 'AES एन्क्रिप्टर',
    description:
      'GCM, CBC और CTR मोड के साथ AES एल्गोरिथम का उपयोग करके टेक्स्ट या फ़ाइलों को एन्क्रिप्ट करें। पासवर्ड-आधारित कुंजी व्युत्पत्ति (PBKDF2) और 128/192/256-बिट कुंजी लंबाई के साथ रॉ कुंजी इनपुट का समर्थन',
  },
  tr: {
    name: 'AES Şifreleyici',
    description:
      'GCM, CBC ve CTR modlarıyla AES algoritması kullanarak metin veya dosyaları şifreleyin. Parola tabanlı anahtar türetme (PBKDF2) ve 128/192/256-bit anahtar uzunluklarıyla ham anahtar girişini destekler',
  },
  nl: {
    name: 'AES-versleutelaar',
    description:
      'Versleutel tekst of bestanden met het AES-algoritme in GCM-, CBC- en CTR-modi. Ondersteunt wachtwoordgebaseerde sleutelafleiding (PBKDF2) en directe sleutelinvoer met 128/192/256-bit sleutellengtes',
  },
  sv: {
    name: 'AES-krypterare',
    description:
      'Kryptera text eller filer med AES-algoritmen i GCM-, CBC- och CTR-lägen. Stöder lösenordsbaserad nyckelderivering (PBKDF2) och direkt nyckelinmatning med 128/192/256-bitars nyckellängder',
  },
  pl: {
    name: 'Szyfrator AES',
    description:
      'Szyfruj tekst lub pliki za pomocą algorytmu AES w trybach GCM, CBC i CTR. Obsługuje wyprowadzanie klucza oparte na haśle (PBKDF2) i bezpośrednie wprowadzanie klucza o długości 128/192/256 bitów',
  },
  vi: {
    name: 'Công cụ mã hóa AES',
    description:
      'Mã hóa văn bản hoặc tệp bằng thuật toán AES với các chế độ GCM, CBC và CTR. Hỗ trợ dẫn xuất khóa dựa trên mật khẩu (PBKDF2) và nhập khóa trực tiếp với độ dài 128/192/256 bit',
  },
  th: {
    name: 'เครื่องมือเข้ารหัส AES',
    description:
      'เข้ารหัสข้อความหรือไฟล์ด้วยอัลกอริทึม AES ในโหมด GCM, CBC และ CTR รองรับการสร้างคีย์จากรหัสผ่าน (PBKDF2) และการป้อนคีย์โดยตรงที่ความยาว 128/192/256 บิต',
  },
  id: {
    name: 'Enkriptor AES',
    description:
      'Enkripsi teks atau file menggunakan algoritma AES dengan mode GCM, CBC, dan CTR. Mendukung derivasi kunci berbasis kata sandi (PBKDF2) dan input kunci langsung dengan panjang 128/192/256 bit',
  },
  he: {
    name: 'מצפין AES',
    description:
      'הצפן טקסט או קבצים באמצעות אלגוריתם AES במצבי GCM, CBC ו-CTR. תומך בגזירת מפתח מבוססת סיסמה (PBKDF2) וקלט מפתח ישיר באורכי 128/192/256 סיביות',
  },
  ms: {
    name: 'Penyulit AES',
    description:
      'Sulitkan teks atau fail menggunakan algoritma AES dengan mod GCM, CBC dan CTR. Menyokong terbitan kunci berasaskan kata laluan (PBKDF2) dan input kunci mentah dengan panjang 128/192/256 bit',
  },
  no: {
    name: 'AES-krypterer',
    description:
      'Krypter tekst eller filer med AES-algoritmen i GCM-, CBC- og CTR-moduser. Støtter passordbasert nøkkelutledning (PBKDF2) og direkte nøkkelinntasting med 128/192/256-biters nøkkellengder',
  },
}
