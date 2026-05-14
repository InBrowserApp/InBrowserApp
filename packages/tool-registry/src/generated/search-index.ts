import type { ToolSearchIndexEntry } from "../types"

export const toolSearchIndex: readonly ToolSearchIndexEntry[] = [
  {
    slug: "adler32-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "adler32",
      "checksum",
      "integrity",
      "file",
      "text",
      "error-detection",
    ],
    locales: {
      ar: {
        name: "تجزئة Adler-32 للنص أو الملف",
        description:
          "أنشئ قيم Adler-32 للنصوص أو الملفات. احسب قيماً سريعة للتحقق من سلامة البيانات واكتشاف الأخطاء",
      },
      de: {
        name: "Adler-32-Hash für Text oder Datei",
        description:
          "Erzeuge Adler-32-Prüfsummen für Text oder Dateien. Berechne schnelle Prüfsummen zur Integritätsprüfung und Fehlererkennung",
      },
      en: {
        name: "Adler-32 Hash Text or File",
        description:
          "Generate Adler-32 checksums for text input or file upload. Calculate fast checksums for data integrity verification and error detection",
      },
      es: {
        name: "Hash Adler-32 de Texto o Archivo",
        description:
          "Genera checksums Adler-32 para texto o archivos. Calcula checksums rápidos para verificar integridad y detectar errores",
      },
      fr: {
        name: "Hash Adler-32 de Texte ou Fichier",
        description:
          "Générez des sommes de contrôle Adler-32 pour du texte ou des fichiers. Calculez des checksums rapides pour vérifier l’intégrité et détecter les erreurs",
      },
      he: {
        name: "האש Adler-32 טקסט או קובץ",
        description:
          "צור סכומי ביקורת Adler-32 עבור טקסט או קבצים. חשב סכומים מהירים לאימות שלמות נתונים ולזיהוי שגיאות",
      },
      hi: {
        name: "Adler-32 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए Adler-32 चेकसम बनाएं। डेटा अखंडता सत्यापन और त्रुटि पहचान के लिए तेज़ चेकसम की गणना करें",
      },
      id: {
        name: "Hash Adler-32 Teks atau File",
        description:
          "Buat checksum Adler-32 untuk teks atau file. Hitung checksum cepat untuk verifikasi integritas data dan deteksi kesalahan",
      },
      it: {
        name: "Hash Adler-32 di Testo o File",
        description:
          "Genera checksum Adler-32 per testo o file. Calcola checksum rapidi per verificare l’integrità dei dati e rilevare errori",
      },
      ja: {
        name: "Adler-32 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードに対して Adler-32 チェックサムを生成します。データ整合性の確認とエラー検出のために高速チェックサムを計算します",
      },
      ko: {
        name: "Adler-32 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대해 Adler-32 체크섬을 생성합니다. 데이터 무결성 검증과 오류 감지를 위한 빠른 체크섬을 계산합니다",
      },
      ms: {
        name: "Hash Adler-32 Teks atau Fail",
        description:
          "Jana checksum Adler-32 untuk teks atau fail. Kira checksum pantas bagi pengesahan integriti data dan pengesanan ralat",
      },
      nl: {
        name: "Adler-32-hash tekst of bestand",
        description:
          "Genereer Adler-32-checksums voor tekst of bestanden. Bereken snelle checksums voor integriteitscontrole en foutdetectie",
      },
      no: {
        name: "Adler-32-hash tekst eller fil",
        description:
          "Generer Adler-32-kontrollsummer for tekst eller filer. Beregn raske kontrollsummer for dataintegritet og feildeteksjon",
      },
      pl: {
        name: "Hash Adler-32 tekstu lub pliku",
        description:
          "Generuj sumy kontrolne Adler-32 dla tekstu lub plików. Obliczaj szybkie sumy do weryfikacji integralności danych i wykrywania błędów",
      },
      pt: {
        name: "Hash Adler-32 de Texto ou Arquivo",
        description:
          "Gere checksums Adler-32 para texto ou arquivos. Calcule checksums rápidos para verificar integridade de dados e detectar erros",
      },
      ru: {
        name: "Adler-32-хеш текста или файла",
        description:
          "Создавайте контрольные суммы Adler-32 для текста и файлов. Вычисляйте быстрые суммы для проверки целостности данных и обнаружения ошибок",
      },
      sv: {
        name: "Adler-32-hash text eller fil",
        description:
          "Generera Adler-32-kontrollsummor för text eller filer. Beräkna snabba checksummor för integritetskontroll och feldetektering",
      },
      th: {
        name: "แฮช Adler-32 ข้อความหรือไฟล์",
        description:
          "สร้างค่า Adler-32 สำหรับข้อความหรือไฟล์ คำนวณเช็กซัมแบบรวดเร็วเพื่อยืนยันความสมบูรณ์ของข้อมูลและตรวจจับข้อผิดพลาด",
      },
      tr: {
        name: "Adler-32 Hash Metin veya Dosya",
        description:
          "Metin veya dosya için Adler-32 sağlama toplamı üretin. Veri bütünlüğü doğrulaması ve hata tespiti için hızlı checksum hesaplayın",
      },
      vi: {
        name: "Hash Adler-32 văn bản hoặc tệp",
        description:
          "Tạo checksum Adler-32 cho văn bản hoặc tệp. Tính checksum nhanh để kiểm tra tính toàn vẹn dữ liệu và phát hiện lỗi",
      },
      "zh-CN": {
        name: "Adler-32 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 Adler-32 校验和。计算快速校验值，用于数据完整性验证和错误检测",
      },
      "zh-TW": {
        name: "Adler-32 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 Adler-32 校驗和。計算快速校驗值，用於資料完整性驗證與錯誤偵測",
      },
    },
  },
  {
    slug: "aes-encryptor",
    category: "web",
    icon: "lock",
    tags: [
      "aes",
      "encrypt",
      "encryption",
      "crypto",
      "cipher",
      "password",
      "pbkdf2",
      "gcm",
      "file",
      "offline",
    ],
    locales: {
      ar: {
        name: "مشفر AES",
        description:
          "شفّر النصوص أو الملفات في متصفحك باستخدام AES-GCM أو AES-CBC أو AES-CTR مع مفتاح مشتق من كلمة مرور أو مفتاح خام بالنظام الست عشري.",
      },
      de: {
        name: "AES Encryptor",
        description:
          "Verschluesseln Sie Text oder Dateien in Ihrem Browser mit AES-GCM, AES-CBC oder AES-CTR und einem aus einem Passwort abgeleiteten Schluessel oder einem rohen hexadezimalen Schluessel.",
      },
      en: {
        name: "AES Encryptor",
        description:
          "Encrypt text or files in your browser with AES-GCM, AES-CBC, or AES-CTR using a password-derived key or a raw hexadecimal key.",
      },
      es: {
        name: "Cifrador AES",
        description:
          "Cifra texto o archivos en tu navegador con AES-GCM, AES-CBC o AES-CTR usando una clave derivada de una contraseña o una clave hexadecimal sin procesar.",
      },
      fr: {
        name: "Chiffreur AES",
        description:
          "Chiffrez du texte ou des fichiers dans votre navigateur avec AES-GCM, AES-CBC ou AES-CTR en utilisant une clé dérivée d’un mot de passe ou une clé hexadécimale brute.",
      },
      he: {
        name: "מצפין AES",
        description:
          "הצפינו טקסט או קבצים בדפדפן שלכם עם AES-GCM, AES-CBC, או AES-CTR באמצעות מפתח שנגזר מסיסמה או מפתח הקסדצימלי גולמי.",
      },
      hi: {
        name: "AES Encryptor",
        description:
          "पासवर्ड से निकाली गई कुंजी या कच्ची हेक्साडेसिमल कुंजी का उपयोग करके अपने ब्राउज़र में AES-GCM, AES-CBC, या AES-CTR से टेक्स्ट या फ़ाइलें एन्क्रिप्ट करें।",
      },
      id: {
        name: "AES Encryptor",
        description:
          "Enkripsi teks atau file di browser Anda dengan AES-GCM, AES-CBC, atau AES-CTR menggunakan kunci turunan kata sandi atau kunci heksadesimal mentah.",
      },
      it: {
        name: "Cifratore AES",
        description:
          "Cifra testo o file nel tuo browser con AES-GCM, AES-CBC o AES-CTR usando una chiave derivata da password o una chiave esadecimale grezza.",
      },
      ja: {
        name: "AES Encryptor",
        description:
          "パスワードから導出したキー、または未加工の16進数キーを使って、AES-GCM、AES-CBC、AES-CTRでブラウザー内のテキストやファイルを暗号化します。",
      },
      ko: {
        name: "AES 암호화 도구",
        description:
          "브라우저에서 비밀번호로 파생한 키 또는 원시 16진수 키를 사용해 AES-GCM, AES-CBC, AES-CTR로 텍스트나 파일을 암호화합니다.",
      },
      ms: {
        name: "Penyulit AES",
        description:
          "Sulitkan teks atau fail dalam pelayar anda dengan AES-GCM, AES-CBC, atau AES-CTR menggunakan kunci yang diterbitkan daripada kata laluan atau kunci heksadesimal mentah.",
      },
      nl: {
        name: "AES Encryptor",
        description:
          "Versleutel tekst of bestanden in je browser met AES-GCM, AES-CBC of AES-CTR met een uit een wachtwoord afgeleide sleutel of een ruwe hexadecimale sleutel.",
      },
      no: {
        name: "AES-kryptering",
        description:
          "Krypter tekst eller filer i nettleseren med AES-GCM, AES-CBC eller AES-CTR ved hjelp av en passordavledet nøkkel eller en rå heksadesimal nøkkel.",
      },
      pl: {
        name: "Szyfrator AES",
        description:
          "Szyfruj tekst lub pliki w przeglądarce za pomocą AES-GCM, AES-CBC albo AES-CTR, używając klucza wyprowadzonego z hasła lub surowego klucza szesnastkowego.",
      },
      pt: {
        name: "Criptografador AES",
        description:
          "Criptografe texto ou arquivos no navegador com AES-GCM, AES-CBC ou AES-CTR usando uma chave derivada de senha ou uma chave hexadecimal bruta.",
      },
      ru: {
        name: "AES Encryptor",
        description:
          "Шифруйте текст или файлы в браузере с помощью AES-GCM, AES-CBC или AES-CTR, используя ключ, полученный из пароля, или необработанный шестнадцатеричный ключ.",
      },
      sv: {
        name: "AES-krypterare",
        description:
          "Kryptera text eller filer i webbläsaren med AES-GCM, AES-CBC eller AES-CTR med en lösenordsbaserad nyckel eller en rå hexadecimal nyckel.",
      },
      th: {
        name: "เครื่องมือเข้ารหัส AES",
        description:
          "เข้ารหัสข้อความหรือไฟล์ในเบราว์เซอร์ด้วย AES-GCM, AES-CBC หรือ AES-CTR โดยใช้คีย์ที่ได้จากรหัสผ่านหรือคีย์เลขฐานสิบหกแบบดิบ",
      },
      tr: {
        name: "AES Şifreleyici",
        description:
          "Parola türetilmiş bir anahtar veya ham onaltılık anahtar kullanarak tarayıcınızda metinleri ya da dosyaları AES-GCM, AES-CBC veya AES-CTR ile şifreleyin.",
      },
      vi: {
        name: "Trình mã hóa AES",
        description:
          "Mã hóa văn bản hoặc tệp ngay trong trình duyệt bằng AES-GCM, AES-CBC hoặc AES-CTR với khóa dẫn xuất từ mật khẩu hoặc khóa thô dạng thập lục phân.",
      },
      "zh-CN": {
        name: "AES 加密器",
        description:
          "在浏览器中使用 AES-GCM、AES-CBC 或 AES-CTR 加密文本或文件，可使用由密码派生的密钥或原始十六进制密钥。",
      },
      "zh-TW": {
        name: "AES 加密器",
        description:
          "使用由密碼衍生的金鑰或原始十六進位金鑰，在瀏覽器中以 AES-GCM、AES-CBC 或 AES-CTR 加密文字或檔案。",
      },
    },
  },
  {
    slug: "ascii-art-generator",
    category: "text",
    icon: "binary",
    tags: ["ascii", "art", "text", "generator", "figlet", "banner", "font"],
    locales: {
      ar: {
        name: "مولّد فن ASCII",
        description:
          "حوّل النصوص إلى فن ASCII باستخدام خطوط figlet متنوعة. اكتب كلمة أو عبارة، واختر خطًا، وانسخ النتيجة.",
      },
      de: {
        name: "ASCII-Art-Generator",
        description:
          "Text in ASCII-Art umwandeln mit verschiedenen Figlet-Schriftarten. Wort oder Satz eingeben, Schriftart wählen und das Ergebnis kopieren.",
      },
      en: {
        name: "ASCII Art Generator",
        description:
          "Convert text to ASCII art using various figlet fonts. Type a word or phrase, pick a font, and copy the result.",
      },
      es: {
        name: "Generador de arte ASCII",
        description:
          "Convierte texto en arte ASCII usando diversas fuentes figlet. Escribe una palabra o frase, elige una fuente y copia el resultado.",
      },
      fr: {
        name: "Générateur d'art ASCII",
        description:
          "Convertissez du texte en art ASCII avec différentes polices figlet. Saisissez un mot ou une phrase, choisissez une police et copiez le résultat.",
      },
      he: {
        name: "מחולל אמנות ASCII",
        description:
          "המרת טקסט לאמנות ASCII באמצעות גופני figlet מגוונים. הקלידו מילה או ביטוי, בחרו גופן והעתיקו את התוצאה.",
      },
      hi: {
        name: "ASCII आर्ट जनरेटर",
        description:
          "विभिन्न figlet फ़ॉन्ट का उपयोग करके टेक्स्ट को ASCII आर्ट में बदलें। कोई शब्द या वाक्यांश टाइप करें, फ़ॉन्ट चुनें और परिणाम कॉपी करें।",
      },
      id: {
        name: "Generator Seni ASCII",
        description:
          "Ubah teks menjadi seni ASCII menggunakan berbagai font figlet. Ketik kata atau frasa, pilih font, lalu salin hasilnya.",
      },
      it: {
        name: "Generatore di ASCII Art",
        description:
          "Converti il testo in ASCII art utilizzando vari font figlet. Digita una parola o una frase, scegli un font e copia il risultato.",
      },
      ja: {
        name: "ASCIIアートジェネレーター",
        description:
          "さまざまなfigletフォントを使ってテキストをASCIIアートに変換します。単語やフレーズを入力し、フォントを選んで結果をコピーできます。",
      },
      ko: {
        name: "ASCII 아트 생성기",
        description:
          "다양한 figlet 글꼴을 사용하여 텍스트를 ASCII 아트로 변환합니다. 단어나 문구를 입력하고, 글꼴을 선택한 후 결과를 복사하세요.",
      },
      ms: {
        name: "Penjana Seni ASCII",
        description:
          "Tukar teks kepada seni ASCII menggunakan pelbagai fon figlet. Taipkan perkataan atau frasa, pilih fon, dan salin hasilnya.",
      },
      nl: {
        name: "ASCII-kunstgenerator",
        description:
          "Converteer tekst naar ASCII-kunst met verschillende figlet-lettertypen. Typ een woord of zin, kies een lettertype en kopieer het resultaat.",
      },
      no: {
        name: "ASCII Art-generator",
        description:
          "Konverter tekst til ASCII-kunst med ulike figlet-skrifttyper. Skriv inn et ord eller en setning, velg en skrifttype og kopier resultatet.",
      },
      pl: {
        name: "Generator ASCII Art",
        description:
          "Konwertuj tekst na grafikę ASCII za pomocą czcionek figlet. Wpisz wyraz lub frazę, wybierz czcionkę i skopiuj wynik.",
      },
      pt: {
        name: "Gerador de Arte ASCII",
        description:
          "Converta texto em arte ASCII usando diversas fontes figlet. Digite uma palavra ou frase, escolha uma fonte e copie o resultado.",
      },
      ru: {
        name: "Генератор ASCII-арта",
        description:
          "Преобразуйте текст в ASCII-арт с помощью различных шрифтов figlet. Введите слово или фразу, выберите шрифт и скопируйте результат.",
      },
      sv: {
        name: "ASCII-konstgenerator",
        description:
          "Konvertera text till ASCII-konst med olika figlet-typsnitt. Skriv ett ord eller en fras, välj ett typsnitt och kopiera resultatet.",
      },
      th: {
        name: "ตัวสร้าง ASCII Art",
        description:
          "แปลงข้อความเป็น ASCII Art ด้วยฟอนต์ figlet หลากหลายรูปแบบ พิมพ์คำหรือวลี เลือกฟอนต์ แล้วคัดลอกผลลัพธ์",
      },
      tr: {
        name: "ASCII Sanat Oluşturucu",
        description:
          "Çeşitli figlet fontları kullanarak metni ASCII sanatına dönüştürün. Bir kelime veya ifade yazın, font seçin ve sonucu kopyalayın.",
      },
      vi: {
        name: "Trình tạo ASCII Art",
        description:
          "Chuyển đổi văn bản thành ASCII art bằng nhiều phông chữ figlet khác nhau. Nhập một từ hoặc cụm từ, chọn phông chữ và sao chép kết quả.",
      },
      "zh-CN": {
        name: "ASCII 艺术字生成器",
        description:
          "使用多种 figlet 字体将文本转换为 ASCII 艺术字。输入单词或短语，选择字体，然后复制结果。",
      },
      "zh-TW": {
        name: "ASCII 藝術產生器",
        description:
          "使用多種 figlet 字型將文字轉換為 ASCII 藝術。輸入文字或短語，選擇字型，然後複製結果。",
      },
    },
  },
  {
    slug: "barcode-generator",
    category: "image",
    icon: "image",
    tags: ["barcode", "code128", "ean", "upc", "generator", "image"],
    locales: {
      ar: {
        name: "مولد الباركود",
        description:
          "أنشئ باركود (CODE128 وEAN وUPC وغيرها) وحمّله بصيغ PNG أو SVG أو JPEG أو WebP.",
      },
      de: {
        name: "Barcode-Generator",
        description:
          "Erzeugen Sie Barcodes (CODE128, EAN, UPC usw.) und laden Sie sie als PNG, SVG, JPEG oder WebP herunter.",
      },
      en: {
        name: "Barcode Generator",
        description:
          "Generate barcodes (CODE128, EAN, UPC, etc.) and download as PNG, SVG, JPEG, or WebP.",
      },
      es: {
        name: "Generador de Códigos de Barras",
        description:
          "Genera códigos de barras (CODE128, EAN, UPC, etc.) y descárgalos como PNG, SVG, JPEG o WebP.",
      },
      fr: {
        name: "Générateur de Codes-barres",
        description:
          "Générez des codes‑barres (CODE128, EAN, UPC, etc.) et téléchargez-les en PNG, SVG, JPEG ou WebP.",
      },
      he: {
        name: "מחולל ברקוד",
        description:
          "צור ברקודים (CODE128, EAN, UPC ועוד) והורד כ‑PNG, SVG, JPEG או WebP.",
      },
      hi: {
        name: "बारकोड जनरेटर",
        description:
          "ब्राउज़र में बारकोड (CODE128, EAN, UPC आदि) बनाएँ और PNG, SVG, JPEG या WebP के रूप में डाउनलोड करें।",
      },
      id: {
        name: "Generator Kode Batang",
        description:
          "Buat kode batang (CODE128, EAN, UPC, dll.) dan unduh sebagai PNG, SVG, JPEG, atau WebP.",
      },
      it: {
        name: "Generatore di Codici a Barre",
        description:
          "Genera codici a barre (CODE128, EAN, UPC, ecc.) e scaricali in PNG, SVG, JPEG o WebP.",
      },
      ja: {
        name: "バーコードジェネレーター",
        description:
          "バーコード（CODE128、EAN、UPC など）を生成し、PNG / SVG / JPEG / WebP でダウンロード。",
      },
      ko: {
        name: "바코드 생성기",
        description:
          "브라우저에서 바코드(CODE128, EAN, UPC 등)를 생성하고 PNG / SVG / JPEG / WebP로 다운로드합니다.",
      },
      ms: {
        name: "Penjana Kod Bar",
        description:
          "Jana kod bar (CODE128, EAN, UPC, dll.) dan muat turun sebagai PNG, SVG, JPEG atau WebP.",
      },
      nl: {
        name: "Barcodegenerator",
        description:
          "Genereer barcodes (CODE128, EAN, UPC, enz.) en download als PNG, SVG, JPEG of WebP.",
      },
      no: {
        name: "Strekkodegenerator",
        description:
          "Generer strekkoder (CODE128, EAN, UPC m.fl.) og last ned som PNG, SVG, JPEG eller WebP.",
      },
      pl: {
        name: "Generator kodów kreskowych",
        description:
          "Generuj kody kreskowe (CODE128, EAN, UPC itd.) i pobieraj jako PNG, SVG, JPEG lub WebP.",
      },
      pt: {
        name: "Gerador de Código de Barras",
        description:
          "Gere códigos de barras (CODE128, EAN, UPC, etc.) e faça download em PNG, SVG, JPEG ou WebP.",
      },
      ru: {
        name: "Генератор штрихкодов",
        description:
          "Создавайте штрихкоды (CODE128, EAN, UPC и др.) и скачивайте их в PNG, SVG, JPEG или WebP.",
      },
      sv: {
        name: "Streckkodsgenerator",
        description:
          "Skapa streckkoder (CODE128, EAN, UPC m.fl.) och ladda ner som PNG, SVG, JPEG eller WebP.",
      },
      th: {
        name: "ตัวสร้างบาร์โค้ด",
        description:
          "สร้างบาร์โค้ด (CODE128, EAN, UPC เป็นต้น) และดาวน์โหลดเป็น PNG, SVG, JPEG หรือ WebP",
      },
      tr: {
        name: "Barkod Oluşturucu",
        description:
          "Barkodlar (CODE128, EAN, UPC vb.) oluşturun ve PNG, SVG, JPEG veya WebP olarak indirin.",
      },
      vi: {
        name: "Trình tạo mã vạch",
        description:
          "Tạo mã vạch (CODE128, EAN, UPC, v.v.) và tải về dưới dạng PNG, SVG, JPEG hoặc WebP.",
      },
      "zh-CN": {
        name: "条形码生成器",
        description:
          "在浏览器内生成条形码（CODE128、EAN、UPC 等），并可下载为 PNG / SVG / JPEG / WebP。",
      },
      "zh-TW": {
        name: "條碼產生器",
        description:
          "在瀏覽器內產生條碼（CODE128、EAN、UPC 等），可下載為 PNG / SVG / JPEG / WebP。",
      },
    },
  },
  {
    slug: "base16-decoder",
    category: "web",
    icon: "binary",
    tags: [
      "base16",
      "hex",
      "hexadecimal",
      "decode",
      "decoder",
      "binary",
      "text",
      "file",
    ],
    locales: {
      ar: {
        name: "مُفكِّك Base16",
        description:
          "يفك ترميز نصوص أو ملفات Base16 (Hex) إلى بايتات خام للفحص والاختبار والأدوات.",
      },
      de: {
        name: "Base16-Dekoder",
        description:
          "Dekodiert Base16 (Hex)-Text oder -Dateien in Rohbytes für Inspektion, Tests und Tools.",
      },
      en: {
        name: "Base16 Decoder",
        description:
          "Decode Base16 (Hex) text or files into raw bytes for inspection, testing, and tooling.",
      },
      es: {
        name: "Decodificador Base16",
        description:
          "Decodifica texto o archivos Base16 (Hex) a bytes sin procesar para inspección, pruebas y herramientas.",
      },
      fr: {
        name: "Décodeur Base16",
        description:
          "Décode du texte ou des fichiers Base16 (Hex) en octets bruts pour l’inspection, les tests et les outils.",
      },
      he: {
        name: "מפענח Base16",
        description:
          "מפענח טקסט או קבצים Base16 (Hex) לבייטים גולמיים לצורך בדיקה, ניסוי וכלים.",
      },
      hi: {
        name: "Base16 डिकोडर",
        description:
          "Base16 (Hex) टेक्स्ट या फ़ाइलों को कच्चे बाइट्स में डिकोड करें ताकि निरीक्षण, परीक्षण और टूलिंग में उपयोग हो।",
      },
      id: {
        name: "Decoder Base16",
        description:
          "Decode teks atau file Base16 (Hex) menjadi byte mentah untuk inspeksi, pengujian, dan alat.",
      },
      it: {
        name: "Decodificatore Base16",
        description:
          "Decodifica testo o file Base16 (Hex) in byte grezzi per ispezione, test e strumenti.",
      },
      ja: {
        name: "Base16 デコーダー",
        description:
          "Base16（Hex）のテキストやファイルを生バイトにデコードし、検査やテストに使用。",
      },
      ko: {
        name: "Base16 디코더",
        description:
          "Base16(Hex) 텍스트나 파일을 원시 바이트로 디코딩하여 검사, 테스트, 도구에 활용.",
      },
      ms: {
        name: "Penyahkod Base16",
        description:
          "Nyahkod teks atau fail Base16 (Hex) kepada bait mentah untuk pemeriksaan, ujian dan alat.",
      },
      nl: {
        name: "Base16-decoder",
        description:
          "Decodeer Base16 (Hex)-tekst of -bestanden naar ruwe bytes voor inspectie, testen en tools.",
      },
      no: {
        name: "Base16-dekoder",
        description:
          "Dekoder Base16 (Hex)-tekst eller filer til rå byte for inspeksjon, testing og verktøy.",
      },
      pl: {
        name: "Dekoder Base16",
        description:
          "Dekoduj tekst lub pliki Base16 (Hex) do surowych bajtów do inspekcji, testów i narzędzi.",
      },
      pt: {
        name: "Decodificador Base16",
        description:
          "Decodifica texto ou arquivos Base16 (Hex) em bytes brutos para inspeção, testes e ferramentas.",
      },
      ru: {
        name: "Base16-декодер",
        description:
          "Декодирует текст или файлы Base16 (Hex) в сырые байты для проверки, тестирования и инструментов.",
      },
      sv: {
        name: "Base16-avkodare",
        description:
          "Avkoda Base16 (Hex)-text eller filer till råa byte för inspektion, testning och verktyg.",
      },
      th: {
        name: "ตัวถอดรหัส Base16",
        description:
          "ถอดรหัสข้อความหรือไฟล์ Base16 (Hex) เป็นไบต์ดิบสำหรับการตรวจสอบ การทดสอบ และเครื่องมือ",
      },
      tr: {
        name: "Base16 Kod Çözücü",
        description:
          "Base16 (Hex) metin veya dosyalarını inceleme, test ve araçlar için ham baytlara dönüştürür.",
      },
      vi: {
        name: "Bộ giải mã Base16",
        description:
          "Giải mã văn bản hoặc tệp Base16 (Hex) thành byte thô để kiểm tra, thử nghiệm và công cụ.",
      },
      "zh-CN": {
        name: "Base16 解码器",
        description:
          "将 Base16（Hex）文本或文件解码为原始字节，用于检查、测试和工具处理。",
      },
      "zh-TW": {
        name: "Base16 解碼器",
        description:
          "將 Base16（Hex）文字或檔案解碼為原始位元組，用於檢視、測試和工具處理。",
      },
    },
  },
  {
    slug: "base16-encoder",
    category: "web",
    icon: "binary",
    tags: [
      "base16",
      "hex",
      "hexadecimal",
      "encode",
      "encoder",
      "binary",
      "text",
      "file",
    ],
    locales: {
      ar: {
        name: "مُرمِّز Base16",
        description:
          "ترميز النص أو الملفات إلى Base16 (Hex) لنقل البيانات وتصحيح الأخطاء وتطوير الويب.",
      },
      de: {
        name: "Base16-Encoder",
        description:
          "Kodiert Text oder Dateien in Base16 (Hex) für Datenübertragung, Debugging und Webentwicklung.",
      },
      en: {
        name: "Base16 Encoder",
        description:
          "Encode text or files to Base16 (Hex) for data transport, debugging, and web development.",
      },
      es: {
        name: "Codificador Base16",
        description:
          "Codifica texto o archivos a Base16 (Hex) para transmisión de datos, depuración y desarrollo web.",
      },
      fr: {
        name: "Encodeur Base16",
        description:
          "Encode du texte ou des fichiers en Base16 (Hex) pour la transmission de données, le débogage et le développement web.",
      },
      he: {
        name: "מקודד Base16",
        description:
          "מקודד טקסט או קבצים ל-Base16 (Hex) להעברת נתונים, ניפוי שגיאות ופיתוח אתרים.",
      },
      hi: {
        name: "Base16 एनकोडर",
        description:
          "टेक्स्ट या फ़ाइलों को Base16 (Hex) में एनकोड करें ताकि डेटा ट्रांसमिशन, डीबगिंग और वेब डेवलपमेंट में उपयोग हो।",
      },
      id: {
        name: "Encoder Base16",
        description:
          "Encode teks atau file ke Base16 (Hex) untuk transmisi data, debugging, dan pengembangan web.",
      },
      it: {
        name: "Codificatore Base16",
        description:
          "Codifica testo o file in Base16 (Hex) per trasmissione dati, debug e sviluppo web.",
      },
      ja: {
        name: "Base16 エンコーダー",
        description:
          "テキストやファイルをBase16（Hex）にエンコードし、データ転送、デバッグ、Web開発に利用。",
      },
      ko: {
        name: "Base16 인코더",
        description:
          "텍스트나 파일을 Base16(Hex)로 인코딩하여 데이터 전송, 디버깅 및 웹 개발에 활용.",
      },
      ms: {
        name: "Pengekod Base16",
        description:
          "Kod teks atau fail ke Base16 (Hex) untuk penghantaran data, penyahpepijatan dan pembangunan web.",
      },
      nl: {
        name: "Base16-encoder",
        description:
          "Codeer tekst of bestanden naar Base16 (Hex) voor gegevensoverdracht, debuggen en webontwikkeling.",
      },
      no: {
        name: "Base16-koder",
        description:
          "Kod tekst eller filer til Base16 (Hex) for dataoverføring, feilsøking og webutvikling.",
      },
      pl: {
        name: "Koder Base16",
        description:
          "Koduj tekst lub pliki do Base16 (Hex) w celu transmisji danych, debugowania i tworzenia stron WWW.",
      },
      pt: {
        name: "Codificador Base16",
        description:
          "Codifica texto ou arquivos em Base16 (Hex) para transmissão de dados, depuração e desenvolvimento web.",
      },
      ru: {
        name: "Base16-кодировщик",
        description:
          "Кодирует текст или файлы в Base16 (Hex) для передачи данных, отладки и веб-разработки.",
      },
      sv: {
        name: "Base16-kodare",
        description:
          "Koda text eller filer till Base16 (Hex) för dataöverföring, felsökning och webbutveckling.",
      },
      th: {
        name: "ตัวเข้ารหัส Base16",
        description:
          "เข้ารหัสข้อความหรือไฟล์เป็น Base16 (Hex) สำหรับการส่งข้อมูล การดีบัก และการพัฒนาเว็บ",
      },
      tr: {
        name: "Base16 Kodlayıcı",
        description:
          "Veri iletimi, hata ayıklama ve web geliştirme için metni veya dosyaları Base16 (Hex) olarak kodlar.",
      },
      vi: {
        name: "Bộ mã hóa Base16",
        description:
          "Mã hóa văn bản hoặc tệp sang Base16 (Hex) cho truyền dữ liệu, gỡ lỗi và phát triển web.",
      },
      "zh-CN": {
        name: "Base16 编码器",
        description:
          "将文本或文件编码为 Base16（Hex），用于数据传输、调试和 Web 开发。",
      },
      "zh-TW": {
        name: "Base16 編碼器",
        description:
          "將文字或檔案編碼為 Base16（Hex），用於資料傳輸、除錯和 Web 開發。",
      },
    },
  },
  {
    slug: "base32-decoder",
    category: "web",
    icon: "binary",
    tags: ["base32", "decode", "decoder", "binary", "text", "file", "rfc4648"],
    locales: {
      ar: {
        name: "مُفكِّك ترميز Base32",
        description:
          "فك ترميز نصوص أو ملفات Base32 إلى البيانات الأصلية للنقل والتخزين والتكامل.",
      },
      de: {
        name: "Base32-Decoder",
        description:
          "Dekodiert Base32-Text oder -Dateien zurück zu Originaldaten für Übertragung, Speicherung und Integration.",
      },
      en: {
        name: "Base32 Decoder",
        description:
          "Decode Base32 text or files back to original data for transport, storage, and integration.",
      },
      es: {
        name: "Decodificador Base32",
        description:
          "Decodifica texto o archivos Base32 de vuelta a los datos originales para transmisión, almacenamiento e integración.",
      },
      fr: {
        name: "Décodeur Base32",
        description:
          "Décode le texte ou les fichiers Base32 pour revenir aux données d'origine, pour la transmission, le stockage et l'intégration.",
      },
      he: {
        name: "מפענח Base32",
        description:
          "מפענח טקסט או קבצים ב-Base32 חזרה לנתונים המקוריים להעברה, אחסון ואינטגרציה.",
      },
      hi: {
        name: "Base32 डिकोडर",
        description:
          "Base32 टेक्स्ट या फ़ाइलों को मूल डेटा में डिकोड करें ताकि ट्रांसमिशन, स्टोरेज और इंटीग्रेशन हो सके।",
      },
      id: {
        name: "Decoder Base32",
        description:
          "Dekode teks atau file Base32 kembali ke data asli untuk transmisi, penyimpanan, dan integrasi.",
      },
      it: {
        name: "Decodificatore Base32",
        description:
          "Decodifica testo o file Base32 per tornare ai dati originali per trasmissione, archiviazione e integrazione.",
      },
      ja: {
        name: "Base32 デコーダー",
        description:
          "Base32のテキストやファイルを元のデータにデコードし、転送、保存、統合に利用。",
      },
      ko: {
        name: "Base32 디코더",
        description:
          "Base32 텍스트나 파일을 원래 데이터로 디코딩하여 전송, 저장 및 통합에 사용.",
      },
      ms: {
        name: "Penyahkod Base32",
        description:
          "Nyahkod teks atau fail Base32 kembali kepada data asal untuk penghantaran, penyimpanan dan integrasi.",
      },
      nl: {
        name: "Base32-decoder",
        description:
          "Decodeer Base32-tekst of -bestanden terug naar originele gegevens voor overdracht, opslag en integratie.",
      },
      no: {
        name: "Base32-dekoder",
        description:
          "Dekoder Base32-tekst eller -filer tilbake til originaldata for overføring, lagring og integrasjon.",
      },
      pl: {
        name: "Dekoder Base32",
        description:
          "Dekoduj tekst lub pliki Base32 z powrotem do danych źródłowych dla transmisji, przechowywania i integracji.",
      },
      pt: {
        name: "Decodificador Base32",
        description:
          "Decodifica texto ou arquivos Base32 de volta aos dados originais para transmissão, armazenamento e integração.",
      },
      ru: {
        name: "Base32-декодер",
        description:
          "Декодирует Base32-текст или файлы обратно в исходные данные для передачи, хранения и интеграции.",
      },
      sv: {
        name: "Base32-avkodare",
        description:
          "Avkoda Base32-text eller -filer tillbaka till originaldata för överföring, lagring och integration.",
      },
      th: {
        name: "ตัวถอดรหัส Base32",
        description:
          "ถอดรหัสข้อความหรือไฟล์ Base32 กลับเป็นข้อมูลต้นฉบับเพื่อการส่งข้อมูล การจัดเก็บ และการเชื่อมต่อ.",
      },
      tr: {
        name: "Base32 Kod Çözücü",
        description:
          "Base32 metinlerini veya dosyalarını özgün veriye geri döndürerek aktarım, depolama ve entegrasyonda kullanır.",
      },
      vi: {
        name: "Bộ giải mã Base32",
        description:
          "Giải mã văn bản hoặc tệp Base32 về dữ liệu gốc để truyền tải, lưu trữ và tích hợp.",
      },
      "zh-CN": {
        name: "Base32 解码器",
        description:
          "将 Base32 文本或文件解码还原为原始数据，用于传输、存储和集成。",
      },
      "zh-TW": {
        name: "Base32 解碼器",
        description:
          "將 Base32 文字或檔案解碼還原為原始資料，用於傳輸、儲存和整合。",
      },
    },
  },
  {
    slug: "base32-encoder",
    category: "web",
    icon: "binary",
    tags: ["base32", "encode", "encoder", "binary", "text", "file", "rfc4648"],
    locales: {
      ar: {
        name: "مُرمِّز Base32",
        description:
          "ترميز النص أو الملفات إلى Base32 لنقل البيانات والتخزين وتطوير الويب.",
      },
      de: {
        name: "Base32-Encoder",
        description:
          "Kodiert Text oder Dateien in Base32 für Datenübertragung, Speicherung und Webentwicklung.",
      },
      en: {
        name: "Base32 Encoder",
        description:
          "Encode text or files to Base32 for data transport, storage, and web development.",
      },
      es: {
        name: "Codificador Base32",
        description:
          "Codifica texto o archivos a Base32 para transmisión de datos, almacenamiento y desarrollo web.",
      },
      fr: {
        name: "Encodeur Base32",
        description:
          "Encode du texte ou des fichiers en Base32 pour la transmission de données, le stockage et le développement web.",
      },
      he: {
        name: "מקודד Base32",
        description:
          "מקודד טקסט או קבצים ל-Base32 להעברת נתונים, אחסון ופיתוח אתרים.",
      },
      hi: {
        name: "Base32 एनकोडर",
        description:
          "टेक्स्ट या फ़ाइलों को Base32 में एनकोड करें ताकि डेटा ट्रांसमिशन, स्टोरेज और वेब डेवलपमेंट में उपयोग हो।",
      },
      id: {
        name: "Encoder Base32",
        description:
          "Encode teks atau file ke Base32 untuk transmisi data, penyimpanan, dan pengembangan web.",
      },
      it: {
        name: "Codificatore Base32",
        description:
          "Codifica testo o file in Base32 per trasmissione dati, archiviazione e sviluppo web.",
      },
      ja: {
        name: "Base32 エンコーダー",
        description:
          "テキストやファイルをBase32にエンコードし、データ転送、保存、Web開発に利用。",
      },
      ko: {
        name: "Base32 인코더",
        description:
          "텍스트나 파일을 Base32로 인코딩하여 데이터 전송, 저장 및 웹 개발에 활용.",
      },
      ms: {
        name: "Pengekod Base32",
        description:
          "Kod teks atau fail ke Base32 untuk penghantaran data, penyimpanan dan pembangunan web.",
      },
      nl: {
        name: "Base32-encoder",
        description:
          "Codeer tekst of bestanden naar Base32 voor gegevensoverdracht, opslag en webontwikkeling.",
      },
      no: {
        name: "Base32-koder",
        description:
          "Kod tekst eller filer til Base32 for dataoverføring, lagring og webutvikling.",
      },
      pl: {
        name: "Koder Base32",
        description:
          "Koduj tekst lub pliki do Base32 w celu transmisji danych, przechowywania i tworzenia stron WWW.",
      },
      pt: {
        name: "Codificador Base32",
        description:
          "Codifica texto ou arquivos em Base32 para transmissão de dados, armazenamento e desenvolvimento web.",
      },
      ru: {
        name: "Base32-кодировщик",
        description:
          "Кодирует текст или файлы в Base32 для передачи данных, хранения и веб-разработки.",
      },
      sv: {
        name: "Base32-kodare",
        description:
          "Koda text eller filer till Base32 för dataöverföring, lagring och webbutveckling.",
      },
      th: {
        name: "ตัวเข้ารหัส Base32",
        description:
          "เข้ารหัสข้อความหรือไฟล์เป็น Base32 สำหรับการส่งข้อมูล การจัดเก็บ และการพัฒนาเว็บ",
      },
      tr: {
        name: "Base32 Kodlayıcı",
        description:
          "Veri iletimi, depolama ve web geliştirme için metni veya dosyaları Base32'ye kodlar.",
      },
      vi: {
        name: "Bộ mã hóa Base32",
        description:
          "Mã hóa văn bản hoặc tệp sang Base32 cho truyền dữ liệu, lưu trữ và phát triển web.",
      },
      "zh-CN": {
        name: "Base32 编码器",
        description:
          "将文本或文件编码为 Base32，用于数据传输、存储和 Web 开发。",
      },
      "zh-TW": {
        name: "Base32 編碼器",
        description:
          "將文字或檔案編碼為 Base32，用於資料傳輸、儲存和 Web 開發。",
      },
    },
  },
  {
    slug: "base58-decoder",
    category: "web",
    icon: "binary",
    tags: [
      "base58",
      "decode",
      "decoder",
      "decoding",
      "text",
      "file",
      "converter",
      "binary",
      "web",
    ],
    locales: {
      ar: {
        name: "مُفكِّك ترميز Base58",
        description:
          "فك ترميز نصوص أو ملفات Base58 إلى البيانات الأصلية للنقل والتخزين والتكامل.",
      },
      de: {
        name: "Base58-Decoder",
        description:
          "Dekodiert Base58-Text oder -Dateien zurück zu Originaldaten für Übertragung, Speicherung und Integration.",
      },
      en: {
        name: "Base58 Decoder",
        description:
          "Decode Base58 text or files back to original data for transport, storage, and integration.",
      },
      es: {
        name: "Decodificador Base58",
        description:
          "Decodifica texto o archivos Base58 de vuelta a los datos originales para transmisión, almacenamiento e integración.",
      },
      fr: {
        name: "Décodeur Base58",
        description:
          "Décode le texte ou les fichiers Base58 pour revenir aux données d'origine, pour la transmission, le stockage et l'intégration.",
      },
      he: {
        name: "מפענח Base58",
        description:
          "מפענח טקסט או קבצים ב-Base58 חזרה לנתונים המקוריים להעברה, אחסון ואינטגרציה.",
      },
      hi: {
        name: "Base58 डिकोडर",
        description:
          "Base58 टेक्स्ट या फ़ाइलों को मूल डेटा में डिकोड करें ताकि ट्रांसमिशन, स्टोरेज और इंटीग्रेशन हो सके।",
      },
      id: {
        name: "Decoder Base58",
        description:
          "Dekode teks atau file Base58 kembali ke data asli untuk transmisi, penyimpanan, dan integrasi.",
      },
      it: {
        name: "Decodificatore Base58",
        description:
          "Decodifica testo o file Base58 per tornare ai dati originali per trasmissione, archiviazione e integrazione.",
      },
      ja: {
        name: "Base58 デコーダー",
        description:
          "Base58のテキストやファイルを元のデータにデコードし、転送、保存、統合に利用。",
      },
      ko: {
        name: "Base58 디코더",
        description:
          "Base58 텍스트나 파일을 원래 데이터로 디코딩하여 전송, 저장 및 통합에 사용.",
      },
      ms: {
        name: "Penyahkod Base58",
        description:
          "Nyahkod teks atau fail Base58 kembali kepada data asal untuk penghantaran, penyimpanan dan integrasi.",
      },
      nl: {
        name: "Base58-decoder",
        description:
          "Decodeer Base58-tekst of -bestanden terug naar originele gegevens voor overdracht, opslag en integratie.",
      },
      no: {
        name: "Base58-dekoder",
        description:
          "Dekoder Base58-tekst eller -filer tilbake til originaldata for overføring, lagring og integrasjon.",
      },
      pl: {
        name: "Dekoder Base58",
        description:
          "Dekoduj tekst lub pliki Base58 z powrotem do danych źródłowych dla transmisji, przechowywania i integracji.",
      },
      pt: {
        name: "Decodificador Base58",
        description:
          "Decodifica texto ou arquivos Base58 de volta aos dados originais para transmissão, armazenamento e integração.",
      },
      ru: {
        name: "Base58-декодер",
        description:
          "Декодирует Base58-текст или файлы обратно в исходные данные для передачи, хранения и интеграции.",
      },
      sv: {
        name: "Base58-avkodare",
        description:
          "Avkoda Base58-text eller -filer tillbaka till originaldata för överföring, lagring och integration.",
      },
      th: {
        name: "ตัวถอดรหัส Base58",
        description:
          "ถอดรหัสข้อความหรือไฟล์ Base58 กลับเป็นข้อมูลต้นฉบับเพื่อการส่งข้อมูล การจัดเก็บ และการเชื่อมต่อ.",
      },
      tr: {
        name: "Base58 Kod Çözücü",
        description:
          "Base58 metinlerini veya dosyalarını özgün veriye geri döndürerek aktarım, depolama ve entegrasyonda kullanır.",
      },
      vi: {
        name: "Bộ giải mã Base58",
        description:
          "Giải mã văn bản hoặc tệp Base58 về dữ liệu gốc để truyền tải, lưu trữ và tích hợp.",
      },
      "zh-CN": {
        name: "Base58 解码器",
        description:
          "将 Base58 文本或文件解码还原为原始数据，用于传输、存储和集成。",
      },
      "zh-TW": {
        name: "Base58 解碼器",
        description:
          "將 Base58 文字或檔案解碼還原為原始資料，用於傳輸、儲存和整合。",
      },
    },
  },
  {
    slug: "base58-encoder",
    category: "crypto",
    icon: "binary",
    tags: [
      "base58",
      "encoder",
      "encoding",
      "bitcoin",
      "ripple",
      "text",
      "file",
      "crypto",
    ],
    locales: {
      ar: {
        name: "مُرمِّز Base58",
        description:
          "ترميز النص أو الملفات إلى Base58 لنقل البيانات والتخزين وتطوير الويب.",
      },
      de: {
        name: "Base58-Encoder",
        description:
          "Kodiert Text oder Dateien in Base58 für Datenübertragung, Speicherung und Webentwicklung.",
      },
      en: {
        name: "Base58 Encoder",
        description:
          "Encode text or files to Base58 for data transport, storage, and web development.",
      },
      es: {
        name: "Codificador Base58",
        description:
          "Codifica texto o archivos a Base58 para transmisión de datos, almacenamiento y desarrollo web.",
      },
      fr: {
        name: "Encodeur Base58",
        description:
          "Encode du texte ou des fichiers en Base58 pour la transmission de données, le stockage et le développement web.",
      },
      he: {
        name: "מקודד Base58",
        description:
          "מקודד טקסט או קבצים ל-Base58 להעברת נתונים, אחסון ופיתוח אתרים.",
      },
      hi: {
        name: "Base58 एनकोडर",
        description:
          "टेक्स्ट या फ़ाइलों को Base58 में एनकोड करें ताकि डेटा ट्रांसमिशन, स्टोरेज और वेब डेवलपमेंट में उपयोग हो।",
      },
      id: {
        name: "Encoder Base58",
        description:
          "Encode teks atau file ke Base58 untuk transmisi data, penyimpanan, dan pengembangan web.",
      },
      it: {
        name: "Codificatore Base58",
        description:
          "Codifica testo o file in Base58 per trasmissione dati, archiviazione e sviluppo web.",
      },
      ja: {
        name: "Base58 エンコーダー",
        description:
          "テキストやファイルをBase58にエンコードし、データ転送、保存、Web開発に利用。",
      },
      ko: {
        name: "Base58 인코더",
        description:
          "텍스트나 파일을 Base58로 인코딩하여 데이터 전송, 저장 및 웹 개발에 활용.",
      },
      ms: {
        name: "Pengekod Base58",
        description:
          "Kod teks atau fail ke Base58 untuk penghantaran data, penyimpanan dan pembangunan web.",
      },
      nl: {
        name: "Base58-encoder",
        description:
          "Codeer tekst of bestanden naar Base58 voor gegevensoverdracht, opslag en webontwikkeling.",
      },
      no: {
        name: "Base58-koder",
        description:
          "Kod tekst eller filer til Base58 for dataoverføring, lagring og webutvikling.",
      },
      pl: {
        name: "Koder Base58",
        description:
          "Koduj tekst lub pliki do Base58 w celu transmisji danych, przechowywania i tworzenia stron WWW.",
      },
      pt: {
        name: "Codificador Base58",
        description:
          "Codifica texto ou arquivos em Base58 para transmissão de dados, armazenamento e desenvolvimento web.",
      },
      ru: {
        name: "Base58-кодировщик",
        description:
          "Кодирует текст или файлы в Base58 для передачи данных, хранения и веб-разработки.",
      },
      sv: {
        name: "Base58-kodare",
        description:
          "Koda text eller filer till Base58 för dataöverföring, lagring och webbutveckling.",
      },
      th: {
        name: "ตัวเข้ารหัส Base58",
        description:
          "เข้ารหัสข้อความหรือไฟล์เป็น Base58 สำหรับการส่งข้อมูล การจัดเก็บ และการพัฒนาเว็บ",
      },
      tr: {
        name: "Base58 Kodlayıcı",
        description:
          "Veri iletimi, depolama ve web geliştirme için metni veya dosyaları Base58'ye kodlar.",
      },
      vi: {
        name: "Bộ mã hóa Base58",
        description:
          "Mã hóa văn bản hoặc tệp sang Base58 cho truyền dữ liệu, lưu trữ và phát triển web.",
      },
      "zh-CN": {
        name: "Base58 编码器",
        description:
          "将文本或文件编码为 Base58，用于数据传输、存储和 Web 开发。",
      },
      "zh-TW": {
        name: "Base58 編碼器",
        description:
          "將文字或檔案編碼為 Base58，用於資料傳輸、儲存和 Web 開發。",
      },
    },
  },
  {
    slug: "base64-encoder-decoder",
    category: "text",
    icon: "binary",
    tags: ["base64", "encoding", "decoding", "text", "unicode"],
    locales: {
      ar: {
        name: "مُرمِّز ومُفكِّك ترميز Base64",
        description:
          "رمِّز النص العادي إلى Base64 وفك ترميز Base64 إلى نص Unicode مباشرة في متصفحك.",
      },
      de: {
        name: "Base64-Encoder und -Decoder",
        description:
          "Kodieren Sie Klartext in Base64 und dekodieren Sie Base64 zurück in Unicode-Text direkt in Ihrem Browser.",
      },
      en: {
        name: "Base64 Encoder and Decoder",
        description:
          "Encode plain text to Base64 and decode Base64 back to Unicode text directly in your browser.",
      },
      es: {
        name: "Codificador y decodificador Base64",
        description:
          "Codifica texto plano a Base64 y decodifica Base64 de vuelta a texto Unicode directamente en tu navegador.",
      },
      fr: {
        name: "Encodeur et décodeur Base64",
        description:
          "Encodez du texte brut en Base64 et décodez du Base64 en texte Unicode directement dans votre navigateur.",
      },
      he: {
        name: "מקודד ומפענח Base64",
        description:
          "קודדו טקסט רגיל ל-Base64 ופענחו Base64 בחזרה לטקסט Unicode ישירות בדפדפן שלכם.",
      },
      hi: {
        name: "Base64 एनकोडर और डिकोडर",
        description:
          "सादे टेक्स्ट को Base64 में एनकोड करें और Base64 को Unicode टेक्स्ट में डिकोड करें, सीधे अपने ब्राउज़र में।",
      },
      id: {
        name: "Encoder dan Decoder Base64",
        description:
          "Encode teks biasa menjadi Base64 dan decode Base64 kembali menjadi teks Unicode langsung di peramban Anda.",
      },
      it: {
        name: "Codificatore e decodificatore Base64",
        description:
          "Codifica testo semplice in Base64 e decodifica Base64 in testo Unicode direttamente nel tuo browser.",
      },
      ja: {
        name: "Base64 エンコーダー / デコーダー",
        description:
          "プレーンテキストを Base64 にエンコードし、Base64 を Unicode テキストにデコードする処理をブラウザ内で直接実行します。",
      },
      ko: {
        name: "Base64 인코더 및 디코더",
        description:
          "일반 텍스트를 Base64로 인코딩하고 Base64를 유니코드 텍스트로 디코딩하는 작업을 브라우저에서 바로 수행합니다.",
      },
      ms: {
        name: "Pengekod dan Penyahkod Base64",
        description:
          "Kodkan teks biasa kepada Base64 dan nyahkod Base64 kembali kepada teks Unicode terus dalam pelayar anda.",
      },
      nl: {
        name: "Base64-encoder en -decoder",
        description:
          "Codeer platte tekst naar Base64 en decodeer Base64 terug naar Unicode-tekst rechtstreeks in je browser.",
      },
      no: {
        name: "Base64-koder og -dekoder",
        description:
          "Kod vanlig tekst til Base64 og dekod Base64 tilbake til Unicode-tekst direkte i nettleseren din.",
      },
      pl: {
        name: "Koder i dekoder Base64",
        description:
          "Koduj zwykły tekst do Base64 i dekoduj Base64 z powrotem na tekst Unicode bezpośrednio w przeglądarce.",
      },
      pt: {
        name: "Codificador e decodificador Base64",
        description:
          "Codifique texto simples para Base64 e decodifique Base64 de volta para texto Unicode diretamente no seu navegador.",
      },
      ru: {
        name: "Кодировщик и декодировщик Base64",
        description:
          "Кодируйте обычный текст в Base64 и декодируйте Base64 обратно в текст Unicode прямо в браузере.",
      },
      sv: {
        name: "Base64-kodare och avkodare",
        description:
          "Koda vanlig text till Base64 och avkoda Base64 tillbaka till Unicode-text direkt i din webbläsare.",
      },
      th: {
        name: "ตัวเข้ารหัสและถอดรหัส Base64",
        description:
          "เข้ารหัสข้อความธรรมดาเป็น Base64 และถอดรหัส Base64 กลับเป็นข้อความ Unicode ได้โดยตรงในเบราว์เซอร์ของคุณ",
      },
      tr: {
        name: "Base64 Kodlayıcı ve Çözücü",
        description:
          "Düz metni Base64 olarak kodlayın ve Base64'ü Unicode metne doğrudan tarayıcınızda geri çözün.",
      },
      vi: {
        name: "Bộ mã hóa và giải mã Base64",
        description:
          "Mã hóa văn bản thuần sang Base64 và giải mã Base64 trở lại thành văn bản Unicode ngay trong trình duyệt của bạn.",
      },
      "zh-CN": {
        name: "Base64 编码器 / 解码器",
        description:
          "直接在浏览器中把纯文本编码为 Base64，或把 Base64 解码回 Unicode 文本。",
      },
      "zh-TW": {
        name: "Base64 編碼與解碼工具",
        description:
          "直接在瀏覽器中將純文字編碼為 Base64，或將 Base64 解碼回 Unicode 文字。",
      },
    },
  },
  {
    slug: "base85-decoder",
    category: "web",
    icon: "binary",
    tags: [
      "base85",
      "ascii85",
      "z85",
      "decode",
      "decoder",
      "binary",
      "text",
      "file",
      "web",
    ],
    locales: {
      ar: {
        name: "مُفكِّك ترميز Base85",
        description:
          "فك ترميز نصوص أو ملفات Base85 إلى البيانات الأصلية للنقل والتخزين والتكامل.",
      },
      de: {
        name: "Base85-Decoder",
        description:
          "Dekodiert Base85-Text oder -Dateien zurück zu Originaldaten für Übertragung, Speicherung und Integration.",
      },
      en: {
        name: "Base85 Decoder",
        description:
          "Decode Base85 text or files back to original data for transport, storage, and integration.",
      },
      es: {
        name: "Decodificador Base85",
        description:
          "Decodifica texto o archivos Base85 de vuelta a los datos originales para transmisión, almacenamiento e integración.",
      },
      fr: {
        name: "Décodeur Base85",
        description:
          "Décode le texte ou les fichiers Base85 pour revenir aux données d'origine, pour la transmission, le stockage et l'intégration.",
      },
      he: {
        name: "מפענח Base85",
        description:
          "מפענח טקסט או קבצים ב-Base85 חזרה לנתונים המקוריים להעברה, אחסון ואינטגרציה.",
      },
      hi: {
        name: "Base85 डिकोडर",
        description:
          "Base85 टेक्स्ट या फ़ाइलों को मूल डेटा में डिकोड करें ताकि ट्रांसमिशन, स्टोरेज और इंटीग्रेशन हो सके।",
      },
      id: {
        name: "Decoder Base85",
        description:
          "Dekode teks atau file Base85 kembali ke data asli untuk transmisi, penyimpanan, dan integrasi.",
      },
      it: {
        name: "Decodificatore Base85",
        description:
          "Decodifica testo o file Base85 per tornare ai dati originali per trasmissione, archiviazione e integrazione.",
      },
      ja: {
        name: "Base85 デコーダー",
        description:
          "Base85のテキストやファイルを元のデータにデコードし、転送、保存、統合に利用。",
      },
      ko: {
        name: "Base85 디코더",
        description:
          "Base85 텍스트나 파일을 원래 데이터로 디코딩하여 전송, 저장 및 통합에 사용.",
      },
      ms: {
        name: "Penyahkod Base85",
        description:
          "Nyahkod teks atau fail Base85 kembali kepada data asal untuk penghantaran, penyimpanan dan integrasi.",
      },
      nl: {
        name: "Base85-decoder",
        description:
          "Decodeer Base85-tekst of -bestanden terug naar originele gegevens voor overdracht, opslag en integratie.",
      },
      no: {
        name: "Base85-dekoder",
        description:
          "Dekoder Base85-tekst eller -filer tilbake til originaldata for overføring, lagring og integrasjon.",
      },
      pl: {
        name: "Dekoder Base85",
        description:
          "Dekoduj tekst lub pliki Base85 z powrotem do danych źródłowych dla transmisji, przechowywania i integracji.",
      },
      pt: {
        name: "Decodificador Base85",
        description:
          "Decodifica texto ou arquivos Base85 de volta aos dados originais para transmissão, armazenamento e integração.",
      },
      ru: {
        name: "Base85-декодер",
        description:
          "Декодирует Base85-текст или файлы обратно в исходные данные для передачи, хранения и интеграции.",
      },
      sv: {
        name: "Base85-avkodare",
        description:
          "Avkoda Base85-text eller -filer tillbaka till originaldata för överföring, lagring och integration.",
      },
      th: {
        name: "ตัวถอดรหัส Base85",
        description:
          "ถอดรหัสข้อความหรือไฟล์ Base85 กลับเป็นข้อมูลต้นฉบับเพื่อการส่งข้อมูล การจัดเก็บ และการเชื่อมต่อ.",
      },
      tr: {
        name: "Base85 Kod Çözücü",
        description:
          "Base85 metinlerini veya dosyalarını özgün veriye geri döndürerek aktarım, depolama ve entegrasyonda kullanır.",
      },
      vi: {
        name: "Bộ giải mã Base85",
        description:
          "Giải mã văn bản hoặc tệp Base85 về dữ liệu gốc để truyền tải, lưu trữ và tích hợp.",
      },
      "zh-CN": {
        name: "Base85 解码器",
        description:
          "将 Base85 文本或文件解码还原为原始数据，用于传输、存储和集成。",
      },
      "zh-TW": {
        name: "Base85 解碼器",
        description:
          "將 Base85 文字或檔案解碼還原為原始資料，用於傳輸、儲存和整合。",
      },
    },
  },
  {
    slug: "base85-encoder",
    category: "web",
    icon: "binary",
    tags: [
      "base85",
      "ascii85",
      "z85",
      "encoder",
      "encoding",
      "text",
      "file",
      "binary",
      "web",
    ],
    locales: {
      ar: {
        name: "مُرمِّز Base85",
        description:
          "ترميز النص أو الملفات إلى Base85 لنقل البيانات والتخزين وتطوير الويب.",
      },
      de: {
        name: "Base85-Encoder",
        description:
          "Kodiert Text oder Dateien in Base85 für Datenübertragung, Speicherung und Webentwicklung.",
      },
      en: {
        name: "Base85 Encoder",
        description:
          "Encode text or files to Base85 for data transport, storage, and web development.",
      },
      es: {
        name: "Codificador Base85",
        description:
          "Codifica texto o archivos a Base85 para transmisión de datos, almacenamiento y desarrollo web.",
      },
      fr: {
        name: "Encodeur Base85",
        description:
          "Encode du texte ou des fichiers en Base85 pour la transmission de données, le stockage et le développement web.",
      },
      he: {
        name: "מקודד Base85",
        description:
          "מקודד טקסט או קבצים ל-Base85 להעברת נתונים, אחסון ופיתוח אתרים.",
      },
      hi: {
        name: "Base85 एनकोडर",
        description:
          "टेक्स्ट या फ़ाइलों को Base85 में एनकोड करें ताकि डेटा ट्रांसमिशन, स्टोरेज और वेब डेवलपमेंट में उपयोग हो।",
      },
      id: {
        name: "Encoder Base85",
        description:
          "Encode teks atau file ke Base85 untuk transmisi data, penyimpanan, dan pengembangan web.",
      },
      it: {
        name: "Codificatore Base85",
        description:
          "Codifica testo o file in Base85 per trasmissione dati, archiviazione e sviluppo web.",
      },
      ja: {
        name: "Base85 エンコーダー",
        description:
          "テキストやファイルをBase85にエンコードし、データ転送、保存、Web開発に利用。",
      },
      ko: {
        name: "Base85 인코더",
        description:
          "텍스트나 파일을 Base85로 인코딩하여 데이터 전송, 저장 및 웹 개발에 활용.",
      },
      ms: {
        name: "Pengekod Base85",
        description:
          "Kod teks atau fail ke Base85 untuk penghantaran data, penyimpanan dan pembangunan web.",
      },
      nl: {
        name: "Base85-encoder",
        description:
          "Codeer tekst of bestanden naar Base85 voor gegevensoverdracht, opslag en webontwikkeling.",
      },
      no: {
        name: "Base85-koder",
        description:
          "Kod tekst eller filer til Base85 for dataoverføring, lagring og webutvikling.",
      },
      pl: {
        name: "Koder Base85",
        description:
          "Koduj tekst lub pliki do Base85 w celu transmisji danych, przechowywania i tworzenia stron WWW.",
      },
      pt: {
        name: "Codificador Base85",
        description:
          "Codifica texto ou arquivos em Base85 para transmissão de dados, armazenamento e desenvolvimento web.",
      },
      ru: {
        name: "Base85-кодировщик",
        description:
          "Кодирует текст или файлы в Base85 для передачи данных, хранения и веб-разработки.",
      },
      sv: {
        name: "Base85-kodare",
        description:
          "Koda text eller filer till Base85 för dataöverföring, lagring och webbutveckling.",
      },
      th: {
        name: "ตัวเข้ารหัส Base85",
        description:
          "เข้ารหัสข้อความหรือไฟล์เป็น Base85 สำหรับการส่งข้อมูล การจัดเก็บ และการพัฒนาเว็บ",
      },
      tr: {
        name: "Base85 Kodlayıcı",
        description:
          "Veri iletimi, depolama ve web geliştirme için metni veya dosyaları Base85'ye kodlar.",
      },
      vi: {
        name: "Bộ mã hóa Base85",
        description:
          "Mã hóa văn bản hoặc tệp sang Base85 cho truyền dữ liệu, lưu trữ và phát triển web.",
      },
      "zh-CN": {
        name: "Base85 编码器",
        description:
          "将文本或文件编码为 Base85，用于数据传输、存储和 Web 开发。",
      },
      "zh-TW": {
        name: "Base85 編碼器",
        description:
          "將文字或檔案編碼為 Base85，用於資料傳輸、儲存和 Web 開發。",
      },
    },
  },
  {
    slug: "basic-auth-decoder",
    category: "web",
    icon: "lock",
    tags: [
      "basic",
      "auth",
      "authorization",
      "header",
      "base64",
      "username",
      "password",
      "http",
      "network",
      "decode",
      "decoder",
    ],
    locales: {
      ar: {
        name: "مفكك تشفير المصادقة الأساسية",
        description:
          "فك تشفير ترويسة HTTP Basic Authorization لاستخراج اسم المستخدم وكلمة المرور من Base64. مفيد لاستكشاف الأخطاء وإصلاحها واختبار واجهة برمجة التطبيقات",
      },
      de: {
        name: "Basic-Auth-Decoder",
        description:
          "Dekodieren Sie den HTTP Basic Authorization Header, um Benutzername und Passwort aus Base64 zu extrahieren. Nützlich zum Debuggen und API-Tests",
      },
      en: {
        name: "Basic Auth Decoder",
        description:
          "Decode HTTP Basic Authorization header to extract username and password from Base64. Useful for debugging and API testing",
      },
      es: {
        name: "Decodificador de Basic Auth",
        description:
          "Decodifica el encabezado HTTP Basic Authorization para extraer usuario y contraseña desde Base64. Útil para depuración y pruebas de API",
      },
      fr: {
        name: "Décodeur d'Authentification Basique",
        description:
          "Décode l'en-tête HTTP Basic Authorization pour extraire le nom d'utilisateur et le mot de passe depuis Base64. Utile pour le débogage et les tests d'API",
      },
      he: {
        name: "מפענח Basic Auth",
        description:
          "פענוח כותרת HTTP Basic Authorization כדי לחלץ שם משתמש וסיסמה מ-Base64. שימושי לניפוי שגיאות ובדיקות API",
      },
      hi: {
        name: "बेसिक ऑथ डिकोडर",
        description:
          "HTTP Basic Authorization हेडर को डिकोड कर Base64 से उपयोगकर्ता नाम और पासवर्ड निकालें। डिबगिंग और API परीक्षण के लिए उपयोगी",
      },
      id: {
        name: "Decoder Basic Auth",
        description:
          "Dekode header HTTP Basic Authorization untuk mengekstrak nama pengguna dan kata sandi dari Base64. Berguna untuk debugging dan pengujian API",
      },
      it: {
        name: "Decoder Basic Auth",
        description:
          "Decodifica l'intestazione HTTP Basic Authorization per estrarre nome utente e password da Base64. Utile per il debugging e i test API",
      },
      ja: {
        name: "Basic Auth デコーダー",
        description:
          "HTTP Basic Authorization ヘッダーをデコードして、Base64 からユーザー名とパスワードを抽出します。デバッグや API テストに有用",
      },
      ko: {
        name: "Basic Auth 디코더",
        description:
          "HTTP Basic Authorization 헤더를 디코딩하여 Base64에서 사용자 이름과 비밀번호를 추출합니다. 디버깅 및 API 테스트에 유용",
      },
      ms: {
        name: "Penyahkod Basic Auth",
        description:
          "Nyahkod pengepala HTTP Basic Authorization untuk mengekstrak nama pengguna dan kata laluan daripada Base64. Berguna untuk penyahpepijatan dan ujian API",
      },
      nl: {
        name: "Basic Auth-decoder",
        description:
          "Decodeer de HTTP Basic Authorization-header om gebruikersnaam en wachtwoord uit Base64 te halen. Handig voor debuggen en API-tests",
      },
      no: {
        name: "Basic Auth-dekoder",
        description:
          "Dekodér HTTP Basic Authorization-headeren for å hente brukernavn og passord fra Base64. Nyttig for feilsøking og API-testing",
      },
      pl: {
        name: "Dekoder Basic Auth",
        description:
          "Zdekoduj nagłówek HTTP Basic Authorization, aby wyodrębnić nazwę użytkownika i hasło z Base64. Przydatne do debugowania i testowania API",
      },
      pt: {
        name: "Decodificador de Basic Auth",
        description:
          "Decodifique o cabeçalho HTTP Basic Authorization para extrair nome de usuário e senha do Base64. Útil para depuração e testes de API",
      },
      ru: {
        name: "Декодер Basic Auth",
        description:
          "Декодируйте заголовок HTTP Basic Authorization, чтобы извлечь имя пользователя и пароль из Base64. Полезно для отладки и тестирования API",
      },
      sv: {
        name: "Basic Auth-avkodare",
        description:
          "Avkoda HTTP Basic Authorization-rubriken för att extrahera användarnamn och lösenord från Base64. Användbart för felsökning och API-testning",
      },
      th: {
        name: "เครื่องมือถอดรหัส Basic Auth",
        description:
          "ถอดรหัสส่วนหัว HTTP Basic Authorization เพื่อดึงชื่อผู้ใช้และรหัสผ่านจาก Base64 มีประโยชน์สำหรับการดีบักและการทดสอบ API",
      },
      tr: {
        name: "Basic Auth Çözücü",
        description:
          "HTTP Basic Authorization başlığını çözüp Base64’ten kullanıcı adı ve parolayı çıkarın. Hata ayıklama ve API testi için yararlı",
      },
      vi: {
        name: "Trình giải mã Basic Auth",
        description:
          "Giải mã tiêu đề HTTP Basic Authorization để trích xuất tên người dùng và mật khẩu từ Base64. Hữu ích cho gỡ lỗi và kiểm thử API",
      },
      "zh-CN": {
        name: "Basic Auth 解码器",
        description:
          "解码 HTTP Basic Authorization 头，从 Base64 中提取用户名和密码。用于调试和 API 测试",
      },
      "zh-TW": {
        name: "Basic Auth 解碼器",
        description:
          "解碼 HTTP Basic Authorization 標頭，從 Base64 提取使用者名稱與密碼。用於除錯與 API 測試",
      },
    },
  },
  {
    slug: "basic-auth-generator",
    category: "web",
    icon: "lock",
    tags: [
      "basic",
      "auth",
      "authorization",
      "header",
      "base64",
      "username",
      "password",
      "http",
      "network",
    ],
    locales: {
      ar: {
        name: "مولد المصادقة الأساسية",
        description:
          "إنشاء ترويسة HTTP Basic Authorization عن طريق ترميز اسم المستخدم وكلمة المرور بصيغة Base64. أنشئ بيانات اعتماد بسرعة لاختبار واجهات برمجة التطبيقات والتطوير",
      },
      de: {
        name: "Basic-Auth-Generator",
        description:
          "Generieren Sie den HTTP Basic Authorization Header, indem Sie Benutzername und Passwort als Base64 kodieren. Erstellen Sie schnell Anmeldedaten für API-Tests und Entwicklung",
      },
      en: {
        name: "Basic Auth Generator",
        description:
          "Generate HTTP Basic Authorization header by encoding username and password as Base64. Quickly create credentials for API testing and development",
      },
      es: {
        name: "Generador de Basic Auth",
        description:
          "Genera el encabezado HTTP Basic Authorization codificando usuario y contraseña en Base64. Crea credenciales rápidamente para pruebas de API y desarrollo",
      },
      fr: {
        name: "Générateur d'Authentification Basique",
        description:
          "Générez l'en-tête HTTP Basic Authorization en encodant le nom d'utilisateur et le mot de passe en Base64. Créez rapidement des identifiants pour les tests d'API et le développement",
      },
      he: {
        name: "מחולל Basic Auth",
        description:
          "צרו כותרת HTTP Basic Authorization על ידי קידוד שם משתמש וסיסמה ל-Base64. צרו במהירות אישורי גישה לבדיקת API ופיתוח",
      },
      hi: {
        name: "बेसिक ऑथ जेनरेटर",
        description:
          "उपयोगकर्ता नाम और पासवर्ड को Base64 में एन्कोड करके HTTP Basic Authorization हेडर जनरेट करें। API परीक्षण और विकास के लिए जल्दी से क्रेडेंशियल्स बनाएं",
      },
      id: {
        name: "Generator Basic Auth",
        description:
          "Hasilkan header HTTP Basic Authorization dengan mengenkode nama pengguna dan kata sandi sebagai Base64. Buat kredensial dengan cepat untuk pengujian dan pengembangan API",
      },
      it: {
        name: "Generatore Basic Auth",
        description:
          "Genera l'intestazione HTTP Basic Authorization codificando nome utente e password in Base64. Crea rapidamente credenziali per test API e sviluppo",
      },
      ja: {
        name: "Basic Auth ジェネレーター",
        description:
          "ユーザー名とパスワードをBase64でエンコードしてHTTP Basic Authorizationヘッダーを生成します。APIテストと開発のための認証情報を迅速に作成",
      },
      ko: {
        name: "Basic Auth 생성기",
        description:
          "사용자 이름과 비밀번호를 Base64로 인코딩하여 HTTP Basic Authorization 헤더를 생성합니다. API 테스트 및 개발을 위한 자격 증명을 빠르게 생성",
      },
      ms: {
        name: "Penjana Basic Auth",
        description:
          "Jana pengepala HTTP Basic Authorization dengan mengekod nama pengguna dan kata laluan sebagai Base64. Cipta kelayakan dengan cepat untuk ujian dan pembangunan API",
      },
      nl: {
        name: "Basic Auth-generator",
        description:
          "Genereer de HTTP Basic Authorization-header door gebruikersnaam en wachtwoord als Base64 te encoderen. Maak snel inloggegevens voor API-tests en ontwikkeling",
      },
      no: {
        name: "Basic Auth-generator",
        description:
          "Generer HTTP Basic Authorization-header ved å kode brukernavn og passord som Base64. Opprett raskt legitimasjon for API-testing og utvikling",
      },
      pl: {
        name: "Generator Basic Auth",
        description:
          "Generuj nagłówek HTTP Basic Authorization, kodując nazwę użytkownika i hasło w Base64. Szybko twórz poświadczenia do testowania i tworzenia interfejsów API",
      },
      pt: {
        name: "Gerador de Basic Auth",
        description:
          "Gere o cabeçalho HTTP Basic Authorization codificando nome de usuário e senha em Base64. Crie rapidamente credenciais para teste e desenvolvimento de API",
      },
      ru: {
        name: "Генератор Basic Auth",
        description:
          "Генерируйте заголовок HTTP Basic Authorization, кодируя имя пользователя и пароль в Base64. Быстро создавайте учетные данные для тестирования API и разработки",
      },
      sv: {
        name: "Basic Auth-generator",
        description:
          "Generera HTTP Basic Authorization-headern genom att koda användarnamn och lösenord som Base64. Skapa snabbt autentiseringsuppgifter för API-testning och utveckling",
      },
      th: {
        name: "เครื่องมือสร้าง Basic Auth",
        description:
          "สร้างส่วนหัว HTTP Basic Authorization โดยการเข้ารหัสชื่อผู้ใช้และรหัสผ่านเป็น Base64 สร้างข้อมูลรับรองอย่างรวดเร็วสำหรับการทดสอบและพัฒนา API",
      },
      tr: {
        name: "Basic Auth Üretici",
        description:
          "Kullanıcı adı ve şifreyi Base64 olarak kodlayarak HTTP Basic Authorization başlığını oluşturun. API testi ve geliştirme için hızlıca kimlik bilgileri oluşturun",
      },
      vi: {
        name: "Trình tạo Basic Auth",
        description:
          "Tạo tiêu đề HTTP Basic Authorization bằng cách mã hóa tên người dùng và mật khẩu ở dạng Base64. Tạo nhanh thông tin xác thực cho kiểm thử và phát triển API",
      },
      "zh-CN": {
        name: "Basic Auth 生成器",
        description:
          "通过将用户名和密码编码为 Base64 生成 HTTP Basic Authorization 头。快速创建用于 API 测试和开发的凭证",
      },
      "zh-TW": {
        name: "Basic Auth 產生器",
        description:
          "透過將使用者名稱與密碼編碼為 Base64 來產生 HTTP Basic Authorization 標頭。快速建立用於 API 測試與開發的認證資料",
      },
    },
  },
  {
    slug: "bic-swift-validator",
    category: "text",
    icon: "file-text",
    tags: ["bic", "swift", "validator", "bank", "finance"],
    locales: {
      ar: {
        name: "مدقق BIC/SWIFT",
        description:
          "يتحقق من رموز BIC/SWIFT ويحلل تفاصيل البنك والبلد والفرع.",
      },
      de: {
        name: "BIC/SWIFT-Validator",
        description:
          "Validiert BIC/SWIFT-Codes und analysiert Bank-, Länder- und Filialdetails.",
      },
      en: {
        name: "BIC/SWIFT Validator",
        description:
          "Validate BIC/SWIFT codes and parse bank, country, and branch details.",
      },
      es: {
        name: "Validador BIC/SWIFT",
        description:
          "Valida códigos BIC/SWIFT y analiza detalles de banco, país y sucursal.",
      },
      fr: {
        name: "Validateur BIC/SWIFT",
        description:
          "Valide les codes BIC/SWIFT et analyse la banque, le pays et la succursale.",
      },
      he: {
        name: "מאמת BIC/SWIFT",
        description: "מאמת קודי BIC/SWIFT ומפרק פרטי בנק, מדינה וסניף.",
      },
      hi: {
        name: "BIC/SWIFT सत्यापनकर्ता",
        description: "BIC/SWIFT कोड सत्यापित करें और बैंक, देश व शाखा विवरण देखें।",
      },
      id: {
        name: "Validator BIC/SWIFT",
        description:
          "Memvalidasi kode BIC/SWIFT dan mengurai detail bank, negara, dan cabang.",
      },
      it: {
        name: "Validatore BIC/SWIFT",
        description:
          "Valida i codici BIC/SWIFT e analizza banca, paese e filiale.",
      },
      ja: {
        name: "BIC/SWIFT 検証",
        description:
          "BIC/SWIFT コードを検証し、銀行・国・支店情報を解析します。",
      },
      ko: {
        name: "BIC/SWIFT 검증기",
        description:
          "BIC/SWIFT 코드를 검증하고 은행, 국가, 지점 정보를 분석합니다.",
      },
      ms: {
        name: "Pengesah BIC/SWIFT",
        description:
          "Mengesahkan kod BIC/SWIFT dan menghuraikan bank, negara dan cawangan.",
      },
      nl: {
        name: "BIC/SWIFT-validator",
        description:
          "Valideert BIC/SWIFT-codes en analyseert bank-, land- en filialgegevens.",
      },
      no: {
        name: "BIC/SWIFT-validerer",
        description:
          "Validerer BIC/SWIFT-koder og analyserer bank, land og avdeling.",
      },
      pl: {
        name: "Walidator BIC/SWIFT",
        description:
          "Weryfikuje kody BIC/SWIFT i analizuje bank, kraj oraz oddział.",
      },
      pt: {
        name: "Validador BIC/SWIFT",
        description:
          "Valida códigos BIC/SWIFT e analisa banco, país e agência.",
      },
      ru: {
        name: "Валидатор BIC/SWIFT",
        description:
          "Проверяет коды BIC/SWIFT и анализирует банк, страну и филиал.",
      },
      sv: {
        name: "BIC/SWIFT-validerare",
        description:
          "Validerar BIC/SWIFT-koder och tolkar bank-, land- och filialdetaljer.",
      },
      th: {
        name: "ตัวตรวจสอบ BIC/SWIFT",
        description:
          "ตรวจสอบรหัส BIC/SWIFT และแยกรายละเอียดธนาคาร ประเทศ และสาขา.",
      },
      tr: {
        name: "BIC/SWIFT Doğrulayıcı",
        description:
          "BIC/SWIFT kodlarını doğrular ve banka, ülke ve şube bilgilerini analiz eder.",
      },
      vi: {
        name: "Trình xác thực BIC/SWIFT",
        description:
          "Xác thực mã BIC/SWIFT và phân tích ngân hàng, quốc gia và chi nhánh.",
      },
      "zh-CN": {
        name: "BIC/SWIFT 验证器",
        description: "验证 BIC/SWIFT 代码并解析银行、国家和分行信息。",
      },
      "zh-TW": {
        name: "BIC/SWIFT 驗證器",
        description: "驗證 BIC/SWIFT 代碼並解析銀行、國家和分行資訊。",
      },
    },
  },
  {
    slug: "bip39-mnemonic-generator",
    category: "random",
    icon: "lock",
    tags: [
      "bip39",
      "mnemonic",
      "seed phrase",
      "wallet",
      "entropy",
      "crypto",
      "generator",
      "validator",
    ],
    locales: {
      ar: {
        name: "مولد العبارات التذكّرية BIP39",
        description:
          "أنشئ عبارات BIP39 التذكّرية وتحقق منها وحوّلها داخل المتصفح.",
      },
      de: {
        name: "BIP39-Mnemonik-Generator",
        description:
          "BIP39-Mnemonikphrasen im Browser erzeugen, prüfen und umwandeln.",
      },
      en: {
        name: "BIP39 Mnemonic Generator",
        description:
          "Generate, validate, and convert BIP39 mnemonic phrases in your browser.",
      },
      es: {
        name: "Generador de frases mnemónicas BIP39",
        description:
          "Genera, valida y convierte frases mnemónicas BIP39 en el navegador.",
      },
      fr: {
        name: "Générateur de phrases mnémoniques BIP39",
        description:
          "Générez, validez et convertissez des phrases mnémoniques BIP39 dans le navigateur.",
      },
      he: {
        name: "מחולל מנמוניקות BIP39",
        description: "צור, אמת והמר ביטויי BIP39 ישירות בדפדפן.",
      },
      hi: {
        name: "BIP39 निमोनिक जनरेटर",
        description:
          "ब्राउज़र में BIP39 निमोनिक वाक्यांश बनाएँ, सत्यापित करें और रूपांतरित करें।",
      },
      id: {
        name: "Generator Mnemonik BIP39",
        description:
          "Buat, validasi, dan konversi frasa mnemonik BIP39 langsung di browser.",
      },
      it: {
        name: "Generatore di frasi mnemoniche BIP39",
        description:
          "Genera, valida e converti frasi mnemoniche BIP39 direttamente nel browser.",
      },
      ja: {
        name: "BIP39 ニーモニック生成ツール",
        description:
          "ブラウザー内で BIP39 ニーモニックの生成、検証、変換を行います。",
      },
      ko: {
        name: "BIP39 니모닉 생성기",
        description: "브라우저에서 BIP39 니모닉을 생성, 검증, 변환합니다.",
      },
      ms: {
        name: "Penjana Mnemonik BIP39",
        description:
          "Jana, sahkan dan tukar frasa mnemonik BIP39 terus dalam pelayar.",
      },
      nl: {
        name: "BIP39-mnemonicgenerator",
        description:
          "Genereer, valideer en converteer BIP39-mnemonics in de browser.",
      },
      no: {
        name: "BIP39-mnemonikkgenerator",
        description:
          "Generer, valider og konverter BIP39-mnemonikker i nettleseren.",
      },
      pl: {
        name: "Generator fraz mnemonicznych BIP39",
        description:
          "Generuj, weryfikuj i konwertuj frazy mnemoniczne BIP39 w przeglądarce.",
      },
      pt: {
        name: "Gerador de frases mnemônicas BIP39",
        description:
          "Gere, valide e converta frases mnemônicas BIP39 no navegador.",
      },
      ru: {
        name: "Генератор мнемонических фраз BIP39",
        description:
          "Создавайте, проверяйте и конвертируйте мнемонические фразы BIP39 прямо в браузере.",
      },
      sv: {
        name: "BIP39-mnemonicgenerator",
        description:
          "Generera, validera och konvertera BIP39-mnemonics i webbläsaren.",
      },
      th: {
        name: "เครื่องมือสร้างวลีช่วยจำ BIP39",
        description: "สร้าง ตรวจสอบ และแปลงวลีช่วยจำ BIP39 ได้โดยตรงในเบราว์เซอร์",
      },
      tr: {
        name: "BIP39 anımsatıcı üreticisi",
        description:
          "BIP39 anımsatıcı ifadeleri tarayıcıda oluşturun, doğrulayın ve dönüştürün.",
      },
      vi: {
        name: "Trình tạo cụm từ ghi nhớ BIP39",
        description:
          "Tạo, xác thực và chuyển đổi cụm từ ghi nhớ BIP39 ngay trong trình duyệt.",
      },
      "zh-CN": {
        name: "BIP39 助记词生成器",
        description: "在浏览器中生成、验证和转换 BIP39 助记词。",
      },
      "zh-TW": {
        name: "BIP39 助記詞產生器",
        description: "在瀏覽器中產生、驗證與轉換 BIP39 助記詞。",
      },
    },
  },
  {
    slug: "blake2b-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "blake2",
      "blake2b",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة BLAKE2b للنص أو الملف",
        description:
          "إنشاء تجزئة BLAKE2b لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "BLAKE2b-Hash für Text oder Datei",
        description:
          "Generieren Sie BLAKE2b-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "BLAKE2b Hash Text or File",
        description:
          "Generate BLAKE2b hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash BLAKE2b de Texto o Archivo",
        description:
          "Genera hash BLAKE2b para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash BLAKE2b de Texte ou Fichier",
        description:
          "Générez un hash BLAKE2b pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש BLAKE2b טקסט או קובץ",
        description:
          "צור האש BLAKE2b עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "BLAKE2b हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए BLAKE2b हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash BLAKE2b Teks atau File",
        description:
          "Buat hash BLAKE2b untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash BLAKE2b di Testo o File",
        description:
          "Genera hash BLAKE2b per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "BLAKE2b ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのBLAKE2bハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "BLAKE2b 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 BLAKE2b 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash BLAKE2b Teks atau Fail",
        description:
          "Jana hash BLAKE2b untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "BLAKE2b-hash tekst of bestand",
        description:
          "Genereer BLAKE2b-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "BLAKE2b-hash tekst eller fil",
        description:
          "Generer BLAKE2b-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash BLAKE2b tekstu lub pliku",
        description:
          "Generuj hash BLAKE2b dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash BLAKE2b de Texto ou Arquivo",
        description:
          "Gere hash BLAKE2b para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "BLAKE2b-хеш текста или файла",
        description:
          "Генерируйте BLAKE2b-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "BLAKE2b-hash text eller fil",
        description:
          "Generera BLAKE2b-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช BLAKE2b ข้อความหรือไฟล์",
        description:
          "สร้างแฮช BLAKE2b สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "BLAKE2b Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için BLAKE2b hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash BLAKE2b văn bản hoặc tệp",
        description:
          "Tạo hash BLAKE2b cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "BLAKE2b 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 BLAKE2b 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "BLAKE2b 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 BLAKE2b 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "blake2s-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "blake2",
      "blake2s",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة BLAKE2s للنص أو الملف",
        description:
          "إنشاء تجزئة BLAKE2s لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "BLAKE2s-Hash für Text oder Datei",
        description:
          "Generieren Sie BLAKE2s-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "BLAKE2s Hash Text or File",
        description:
          "Generate BLAKE2s hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash BLAKE2s de Texto o Archivo",
        description:
          "Genera hash BLAKE2s para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash BLAKE2s de Texte ou Fichier",
        description:
          "Générez un hash BLAKE2s pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש BLAKE2s טקסט או קובץ",
        description:
          "צור האש BLAKE2s עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "BLAKE2s हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए BLAKE2s हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash BLAKE2s Teks atau File",
        description:
          "Buat hash BLAKE2s untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash BLAKE2s di Testo o File",
        description:
          "Genera hash BLAKE2s per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "BLAKE2s ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのBLAKE2sハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "BLAKE2s 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 BLAKE2s 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash BLAKE2s Teks atau Fail",
        description:
          "Jana hash BLAKE2s untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "BLAKE2s-hash tekst of bestand",
        description:
          "Genereer BLAKE2s-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "BLAKE2s-hash tekst eller fil",
        description:
          "Generer BLAKE2s-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash BLAKE2s tekstu lub pliku",
        description:
          "Generuj hash BLAKE2s dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash BLAKE2s de Texto ou Arquivo",
        description:
          "Gere hash BLAKE2s para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "BLAKE2s-хеш текста или файла",
        description:
          "Генерируйте BLAKE2s-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "BLAKE2s-hash text eller fil",
        description:
          "Generera BLAKE2s-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช BLAKE2s ข้อความหรือไฟล์",
        description:
          "สร้างแฮช BLAKE2s สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "BLAKE2s Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için BLAKE2s hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash BLAKE2s văn bản hoặc tệp",
        description:
          "Tạo hash BLAKE2s cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "BLAKE2s 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 BLAKE2s 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "BLAKE2s 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 BLAKE2s 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "blake3-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "blake3", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة BLAKE3 للنص أو الملف",
        description:
          "إنشاء تجزئة BLAKE3 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "BLAKE3-Hash für Text oder Datei",
        description:
          "Generieren Sie BLAKE3-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "BLAKE3 Hash Text or File",
        description:
          "Generate BLAKE3 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash BLAKE3 de Texto o Archivo",
        description:
          "Genera hash BLAKE3 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash BLAKE3 de Texte ou Fichier",
        description:
          "Générez un hash BLAKE3 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש BLAKE3 טקסט או קובץ",
        description:
          "צור האש BLAKE3 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "BLAKE3 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए BLAKE3 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash BLAKE3 Teks atau File",
        description:
          "Buat hash BLAKE3 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash BLAKE3 di Testo o File",
        description:
          "Genera hash BLAKE3 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "BLAKE3 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのBLAKE3ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "BLAKE3 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 BLAKE3 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash BLAKE3 Teks atau Fail",
        description:
          "Jana hash BLAKE3 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "BLAKE3-hash tekst of bestand",
        description:
          "Genereer BLAKE3-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "BLAKE3-hash tekst eller fil",
        description:
          "Generer BLAKE3-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash BLAKE3 tekstu lub pliku",
        description:
          "Generuj hash BLAKE3 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash BLAKE3 de Texto ou Arquivo",
        description:
          "Gere hash BLAKE3 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "BLAKE3-хеш текста или файла",
        description:
          "Генерируйте BLAKE3-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "BLAKE3-hash text eller fil",
        description:
          "Generera BLAKE3-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช BLAKE3 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช BLAKE3 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "BLAKE3 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için BLAKE3 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash BLAKE3 văn bản hoặc tệp",
        description:
          "Tạo hash BLAKE3 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "BLAKE3 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 BLAKE3 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "BLAKE3 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 BLAKE3 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "business-days-calculator",
    category: "time",
    icon: "clock3",
    tags: ["time", "date", "business-day", "calculator", "holiday", "schedule"],
    locales: {
      ar: {
        name: "حاسبة أيام العمل",
        description:
          "احسب أيام العمل بين التواريخ وأضف أو اطرح أيام عمل مع عطلات نهاية الأسبوع والعطلات المخصصة.",
      },
      de: {
        name: "Arbeitstage-Rechner",
        description:
          "Zählt Arbeitstage zwischen Daten und addiert oder subtrahiert Arbeitstage mit benutzerdefinierten Wochenenden und Feiertagen.",
      },
      en: {
        name: "Business Days Calculator",
        description:
          "Count business days between dates, and add or subtract business days with custom weekends and holidays.",
      },
      es: {
        name: "Calculadora de días hábiles",
        description:
          "Cuenta los días hábiles entre fechas y suma o resta días hábiles con fines de semana y festivos personalizados.",
      },
      fr: {
        name: "Calculateur de jours ouvrés",
        description:
          "Compte les jours ouvrés entre deux dates et ajoute ou soustrait des jours ouvrés avec des week-ends et jours fériés personnalisés.",
      },
      he: {
        name: "מחשבון ימי עבודה",
        description:
          "סופר ימי עבודה בין תאריכים ומוסיף או מחסיר ימי עבודה עם סופי שבוע וחגים מותאמים.",
      },
      hi: {
        name: "कार्यदिवस कैलकुलेटर",
        description:
          "तिथियों के बीच कार्यदिवस गिनें और कस्टम सप्ताहांत व छुट्टियों के साथ कार्यदिवस जोड़ें या घटाएं।",
      },
      id: {
        name: "Kalkulator hari kerja",
        description:
          "Menghitung hari kerja antara tanggal serta menambah atau mengurangi hari kerja dengan akhir pekan dan hari libur khusus.",
      },
      it: {
        name: "Calcolatore di giorni lavorativi",
        description:
          "Conta i giorni lavorativi tra date e aggiunge o sottrae giorni lavorativi con weekend e festività personalizzati.",
      },
      ja: {
        name: "営業日計算ツール",
        description:
          "日付間の営業日を数え、カスタム週末と祝日で営業日を加減します。",
      },
      ko: {
        name: "영업일 계산기",
        description:
          "날짜 사이의 영업일을 계산하고 사용자 지정 주말과 휴일로 영업일을 더하거나 뺍니다.",
      },
      ms: {
        name: "Pengira hari bekerja",
        description:
          "Kira hari bekerja antara tarikh dan tambah atau tolak hari bekerja dengan hujung minggu dan cuti yang disesuaikan.",
      },
      nl: {
        name: "Werkdagen-rekenmachine",
        description:
          "Tel werkdagen tussen datums en tel werkdagen op of trek ze af met aangepaste weekenden en feestdagen.",
      },
      no: {
        name: "Kalkulator for arbeidsdager",
        description:
          "Tell arbeidsdager mellom datoer og legg til eller trekk fra arbeidsdager med egendefinerte helger og fridager.",
      },
      pl: {
        name: "Kalkulator dni roboczych",
        description:
          "Zlicza dni robocze między datami oraz dodaje lub odejmuje dni robocze z niestandardowymi weekendami i świętami.",
      },
      pt: {
        name: "Calculadora de dias úteis",
        description:
          "Conta dias úteis entre datas e adiciona ou subtrai dias úteis com fins de semana e feriados personalizados.",
      },
      ru: {
        name: "Калькулятор рабочих дней",
        description:
          "Подсчитывает рабочие дни между датами и добавляет или вычитает рабочие дни с настраиваемыми выходными и праздниками.",
      },
      sv: {
        name: "Arbetsdagskalkylator",
        description:
          "Räkna arbetsdagar mellan datum och lägg till eller dra ifrån arbetsdagar med anpassade helger och helgdagar.",
      },
      th: {
        name: "เครื่องคำนวณวันทำงาน",
        description:
          "นับวันทำงานระหว่างวันที่ และบวกหรือลบวันทำงานด้วยวันหยุดสุดสัปดาห์และวันหยุดที่กำหนดเอง",
      },
      tr: {
        name: "İş Günü Hesaplayıcı",
        description:
          "Tarihler arasındaki iş günlerini sayar ve özel hafta sonları ile tatillerle iş günlerini ekler veya çıkarır.",
      },
      vi: {
        name: "Máy tính ngày làm việc",
        description:
          "Đếm ngày làm việc giữa các ngày và cộng hoặc trừ ngày làm việc với cuối tuần và ngày lễ tùy chỉnh.",
      },
      "zh-CN": {
        name: "工作日计算器",
        description:
          "统计日期之间的工作日，并按自定义周末和节假日进行工作日加减。",
      },
      "zh-TW": {
        name: "工作日計算器",
        description:
          "統計日期之間的工作日，並依自訂週末與節假日進行工作日加減。",
      },
    },
  },
  {
    slug: "case-converter",
    category: "text",
    icon: "case-sensitive",
    tags: [
      "case",
      "converter",
      "camelCase",
      "PascalCase",
      "snake_case",
      "kebab-case",
      "text",
      "naming",
      "convention",
    ],
    locales: {
      ar: {
        name: "محوّل حالة الأحرف",
        description:
          "حوّل النص بين اصطلاحات التسمية المختلفة: camelCase وPascalCase وsnake_case وkebab-case والمزيد.",
      },
      de: {
        name: "Schreibweisenkonverter",
        description:
          "Text zwischen verschiedenen Namenskonventionen umwandeln: camelCase, PascalCase, snake_case, kebab-case und mehr.",
      },
      en: {
        name: "Case Converter",
        description:
          "Convert text between different naming conventions: camelCase, PascalCase, snake_case, kebab-case, and more.",
      },
      es: {
        name: "Conversor de mayúsculas y minúsculas",
        description:
          "Convierte texto entre diferentes convenciones de nomenclatura: camelCase, PascalCase, snake_case, kebab-case y más.",
      },
      fr: {
        name: "Convertisseur de casse",
        description:
          "Convertissez du texte entre différentes conventions de nommage : camelCase, PascalCase, snake_case, kebab-case, et plus encore.",
      },
      he: {
        name: "ממיר רישיות",
        description:
          "המרת טקסט בין מוסכמות שמות שונות: camelCase,‏ PascalCase,‏ snake_case,‏ kebab-case ועוד.",
      },
      hi: {
        name: "केस कन्वर्टर",
        description:
          "टेक्स्ट को विभिन्न नामकरण शैलियों में बदलें: camelCase, PascalCase, snake_case, kebab-case, और अन्य।",
      },
      id: {
        name: "Konverter Huruf Besar-Kecil",
        description:
          "Konversi teks antar konvensi penamaan: camelCase, PascalCase, snake_case, kebab-case, dan lainnya.",
      },
      it: {
        name: "Convertitore di maiuscole/minuscole",
        description:
          "Converti il testo tra diverse convenzioni di denominazione: camelCase, PascalCase, snake_case, kebab-case e altro.",
      },
      ja: {
        name: "ケースコンバーター",
        description:
          "camelCase、PascalCase、snake_case、kebab-case など、さまざまな命名規則間でテキストを変換します。",
      },
      ko: {
        name: "대소문자 변환기",
        description:
          "camelCase, PascalCase, snake_case, kebab-case 등 다양한 명명 규칙 간에 텍스트를 변환합니다.",
      },
      ms: {
        name: "Penukar Kes Huruf",
        description:
          "Tukar teks antara konvensyen penamaan yang berbeza: camelCase, PascalCase, snake_case, kebab-case dan banyak lagi.",
      },
      nl: {
        name: "Hoofdletterconverter",
        description:
          "Converteer tekst tussen verschillende naamgevingsconventies: camelCase, PascalCase, snake_case, kebab-case en meer.",
      },
      no: {
        name: "Konvertering av store/små bokstaver",
        description:
          "Konverter tekst mellom ulike navnekonvensjoner: camelCase, PascalCase, snake_case, kebab-case og flere.",
      },
      pl: {
        name: "Konwerter wielkości liter",
        description:
          "Konwertuj tekst pomiędzy różnymi konwencjami nazewnictwa: camelCase, PascalCase, snake_case, kebab-case i inne.",
      },
      pt: {
        name: "Conversor de Maiusculas/Minusculas",
        description:
          "Converta texto entre diferentes convenções de nomenclatura: camelCase, PascalCase, snake_case, kebab-case e mais.",
      },
      ru: {
        name: "Конвертер регистра",
        description:
          "Преобразуйте текст между различными соглашениями об именовании: camelCase, PascalCase, snake_case, kebab-case и другими.",
      },
      sv: {
        name: "Konvertera skiftläge",
        description:
          "Konvertera text mellan olika namnkonventioner: camelCase, PascalCase, snake_case, kebab-case med mera.",
      },
      th: {
        name: "ตัวแปลงรูปแบบตัวอักษร",
        description:
          "แปลงข้อความระหว่างรูปแบบการตั้งชื่อต่าง ๆ: camelCase, PascalCase, snake_case, kebab-case และอื่น ๆ",
      },
      tr: {
        name: "Harf Durumu Dönüştürücü",
        description:
          "Metni farklı adlandırma kuralları arasında dönüştürün: camelCase, PascalCase, snake_case, kebab-case ve daha fazlası.",
      },
      vi: {
        name: "Chuyển đổi kiểu chữ",
        description:
          "Chuyển đổi văn bản giữa các quy ước đặt tên khác nhau: camelCase, PascalCase, snake_case, kebab-case và nhiều kiểu khác.",
      },
      "zh-CN": {
        name: "大小写转换器",
        description:
          "在不同命名约定之间转换文本：camelCase、PascalCase、snake_case、kebab-case 等。",
      },
      "zh-TW": {
        name: "大小寫轉換器",
        description:
          "在不同命名慣例之間轉換文字：camelCase、PascalCase、snake_case、kebab-case 等。",
      },
    },
  },
  {
    slug: "chinese-uppercase-number-converter",
    category: "misc",
    icon: "binary",
    tags: ["converter", "number", "chinese", "uppercase", "currency", "rmb"],
    locales: {
      ar: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      de: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      en: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      es: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      fr: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      he: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      hi: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      id: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      it: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      ja: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      ko: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      ms: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      nl: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      no: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      pl: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      pt: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      ru: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      sv: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      th: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      tr: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      vi: {
        name: "Number ↔ Chinese Uppercase Converter",
        description:
          "Bidirectional converter between numbers and Chinese uppercase amounts. Supports RMB-style units and up to 2 decimal places.",
      },
      "zh-CN": {
        name: "数字 ↔ 中文大写数字转换器",
        description:
          "数字与中文金额大写双向转换，支持元/角/分、负数与两位小数。",
      },
      "zh-TW": {
        name: "數字 ↔ 中文大寫數字轉換器",
        description:
          "數字與中文金額大寫雙向轉換，支援元/角/分、負數與兩位小數。",
      },
    },
  },
  {
    slug: "chmod-calculator",
    category: "developer",
    icon: "lock",
    tags: ["chmod", "permission", "unix", "linux", "file", "calculator"],
    locales: {
      ar: {
        name: "حاسبة Chmod",
        description:
          "حساب أذونات ملفات Unix بين الترميز الرقمي (755) والرمزي (rwxr-xr-x)",
      },
      de: {
        name: "Chmod-Rechner",
        description:
          "Unix-Dateiberechtigungen zwischen numerischer (755) und symbolischer (rwxr-xr-x) Notation umrechnen",
      },
      en: {
        name: "Chmod Calculator",
        description:
          "Calculate Unix file permissions between numeric (755) and symbolic (rwxr-xr-x) notation",
      },
      es: {
        name: "Calculadora Chmod",
        description:
          "Calcula permisos de archivos Unix entre notación numérica (755) y simbólica (rwxr-xr-x)",
      },
      fr: {
        name: "Calculateur Chmod",
        description:
          "Convertir les permissions de fichiers Unix entre notation numérique (755) et symbolique (rwxr-xr-x)",
      },
      he: {
        name: "מחשבון Chmod",
        description:
          "המרת הרשאות קבצים ב-Unix בין סימון מספרי (755) לסימון סמלי (rwxr-xr-x)",
      },
      hi: {
        name: "Chmod कैलकुलेटर",
        description:
          "संख्यात्मक (755) और प्रतीकात्मक (rwxr-xr-x) नोटेशन के बीच Unix फ़ाइल अनुमतियों की गणना करें",
      },
      id: {
        name: "Kalkulator Chmod",
        description:
          "Konversi izin file Unix antara notasi numerik (755) dan simbolik (rwxr-xr-x)",
      },
      it: {
        name: "Calcolatore Chmod",
        description:
          "Calcola i permessi dei file Unix tra notazione numerica (755) e simbolica (rwxr-xr-x)",
      },
      ja: {
        name: "Chmod 計算機",
        description:
          "Unix ファイル権限を数値 (755) と記号 (rwxr-xr-x) 表記の間で変換",
      },
      ko: {
        name: "Chmod 계산기",
        description:
          "Unix 파일 권한을 숫자 (755)와 기호 (rwxr-xr-x) 표기법 간에 변환",
      },
      ms: {
        name: "Kalkulator Chmod",
        description:
          "Tukar kebenaran fail Unix antara notasi angka (755) dan simbolik (rwxr-xr-x)",
      },
      nl: {
        name: "Chmod-calculator",
        description:
          "Unix-bestandsrechten converteren tussen numerieke (755) en symbolische (rwxr-xr-x) notatie",
      },
      no: {
        name: "Chmod-kalkulator",
        description:
          "Konverter Unix-filtillatelser mellom numerisk (755) og symbolsk (rwxr-xr-x) notasjon",
      },
      pl: {
        name: "Kalkulator Chmod",
        description:
          "Konwertuj uprawnienia plików Unix między notacją numeryczną (755) a symboliczną (rwxr-xr-x)",
      },
      pt: {
        name: "Calculadora Chmod",
        description:
          "Calcular permissões de arquivos Unix entre notação numérica (755) e simbólica (rwxr-xr-x)",
      },
      ru: {
        name: "Калькулятор Chmod",
        description:
          "Конвертация прав доступа Unix между числовой (755) и символьной (rwxr-xr-x) нотацией",
      },
      sv: {
        name: "Chmod-kalkylator",
        description:
          "Konvertera Unix-filrättigheter mellan numerisk (755) och symbolisk (rwxr-xr-x) notation",
      },
      th: {
        name: "เครื่องคำนวณ Chmod",
        description:
          "แปลงสิทธิ์ไฟล์ Unix ระหว่างรูปแบบตัวเลข (755) และสัญลักษณ์ (rwxr-xr-x)",
      },
      tr: {
        name: "Chmod Hesaplayıcı",
        description:
          "Unix dosya izinlerini sayısal (755) ve sembolik (rwxr-xr-x) gösterim arasında dönüştür",
      },
      vi: {
        name: "Máy tính Chmod",
        description:
          "Chuyển đổi quyền tệp Unix giữa ký hiệu số (755) và ký hiệu (rwxr-xr-x)",
      },
      "zh-CN": {
        name: "Chmod 计算器",
        description:
          "在数字 (755) 和符号 (rwxr-xr-x) 表示法之间转换 Unix 文件权限",
      },
      "zh-TW": {
        name: "Chmod 計算器",
        description:
          "在數字 (755) 和符號 (rwxr-xr-x) 表示法之間轉換 Unix 檔案權限",
      },
    },
  },
  {
    slug: "cidr-parser",
    category: "network",
    icon: "network",
    tags: ["cidr", "ip", "network", "subnet", "ipv4", "ipv6", "parser"],
    locales: {
      ar: {
        name: "محلل CIDR",
        description:
          "تحليل تدوين CIDR للحصول على معلومات مفصلة حول عناوين IP والشبكات، يدعم تنسيقات IPv4 و IPv6. احصل فوراً على عنوان الشبكة وعنوان البث ونطاق عناوين IP القابلة للاستخدام",
      },
      de: {
        name: "CIDR-Parser",
        description:
          "Analysieren Sie CIDR-Notation, um detaillierte Informationen über IP-Adressen und Netzwerke zu erhalten, unterstützt IPv4- und IPv6-Formate. Erhalten Sie sofort Netzwerkadresse, Broadcast-Adresse und Bereich nutzbarer IPs",
      },
      en: {
        name: "CIDR Parser",
        description:
          "Parse CIDR notation to inspect IPv4 or IPv6 network ranges, masks, and integer boundaries directly in the browser.",
      },
      es: {
        name: "Analizador CIDR",
        description:
          "Analiza la notación CIDR para obtener información detallada sobre direcciones IP y redes, compatible con formatos IPv4 e IPv6. Obtén la dirección de red, dirección de difusión y rango de IPs utilizables instantáneamente",
      },
      fr: {
        name: "Analyseur CIDR",
        description:
          "Analysez la notation CIDR pour obtenir des informations détaillées sur les adresses IP et les réseaux, prenant en charge les formats IPv4 et IPv6. Obtenez l'adresse réseau, l'adresse de diffusion et la plage d'IP utilisables instantanément",
      },
      he: {
        name: "מנתח CIDR",
        description:
          "נתח סימון CIDR כדי לקבל מידע מפורט על כתובות IP ורשתות, תומך בפורמטים IPv4 ו-IPv6. קבל מיידית כתובת רשת, כתובת שידור וטווח של IPs שמישים",
      },
      hi: {
        name: "CIDR पार्सर",
        description:
          "IP पतों और नेटवर्क के बारे में विस्तृत जानकारी प्राप्त करने के लिए CIDR नोटेशन को पार्स करें, IPv4 और IPv6 प्रारूपों का समर्थन करता है। तुरंत नेटवर्क पता, ब्रॉडकास्ट पता और उपयोग योग्य IP की रेंज प्राप्त करें",
      },
      id: {
        name: "Parser CIDR",
        description:
          "Parse notasi CIDR untuk mendapatkan informasi detail tentang alamat IP dan jaringan, mendukung format IPv4 dan IPv6. Dapatkan alamat jaringan, alamat broadcast, dan rentang IP yang dapat digunakan secara instan",
      },
      it: {
        name: "Parser CIDR",
        description:
          "Analizza la notazione CIDR per ottenere informazioni dettagliate su indirizzi IP e reti, supportando formati IPv4 e IPv6. Ottieni istantaneamente indirizzo di rete, indirizzo broadcast e range di IP utilizzabili",
      },
      ja: {
        name: "CIDR パーサー",
        description:
          "CIDR 記法を解析して IP アドレスとネットワークの詳細情報を取得します。IPv4 と IPv6 形式をサポート。ネットワークアドレス、ブロードキャストアドレス、使用可能な IP 範囲を即座に取得",
      },
      ko: {
        name: "CIDR 파서",
        description:
          "CIDR 표기법을 분석하여 IP 주소와 네트워크의 자세한 정보를 얻습니다. IPv4 및 IPv6 형식을 지원합니다. 네트워크 주소, 브로드캐스트 주소 및 사용 가능한 IP 범위를 즉시 확인하세요",
      },
      ms: {
        name: "Parser CIDR",
        description:
          "Hurai notasi CIDR untuk mendapatkan maklumat terperinci tentang alamat IP dan rangkaian, menyokong format IPv4 dan IPv6. Dapatkan alamat rangkaian, alamat siaran dan julat IP yang boleh digunakan dengan serta-merta",
      },
      nl: {
        name: "CIDR-parser",
        description:
          "Parseer CIDR-notatie om gedetailleerde informatie over IP-adressen en netwerken te krijgen, ondersteunt IPv4- en IPv6-formaten. Verkrijg direct netwerkadres, broadcast-adres en bereik van bruikbare IPs",
      },
      no: {
        name: "CIDR-parser",
        description:
          "Parse CIDR-notasjon for å få detaljert informasjon om IP-adresser og nettverk, støtter IPv4- og IPv6-formater. Få nettverksadresse, kringkastingsadresse og område med brukbare IPer øyeblikkelig",
      },
      pl: {
        name: "Parser CIDR",
        description:
          "Analizuj notację CIDR, aby uzyskać szczegółowe informacje o adresach IP i sieciach, obsługuje formaty IPv4 i IPv6. Natychmiast uzyskaj adres sieci, adres rozgłoszeniowy i zakres użytecznych IP",
      },
      pt: {
        name: "Parser CIDR",
        description:
          "Analise a notação CIDR para obter informações detalhadas sobre endereços IP e redes, suportando formatos IPv4 e IPv6. Obtenha instantaneamente endereço de rede, endereço de broadcast e faixa de IPs utilizáveis",
      },
      ru: {
        name: "CIDR-парсер",
        description:
          "Анализируйте CIDR-нотацию для получения детальной информации об IP-адресах и сетях, поддерживает форматы IPv4 и IPv6. Мгновенно получайте сетевой адрес, широковещательный адрес и диапазон используемых IP",
      },
      sv: {
        name: "CIDR-parser",
        description:
          "Analysera CIDR-notation för att få detaljerad information om IP-adresser och nätverk, stöder IPv4- och IPv6-format. Få omedelbart nätverksadress, broadcast-adress och intervall av användbara IPs",
      },
      th: {
        name: "ตัวแยกวิเคราะห์ CIDR",
        description:
          "แยกวิเคราะห์รูปแบบ CIDR เพื่อรับข้อมูลโดยละเอียดเกี่ยวกับที่อยู่ IP และเครือข่าย รองรับรูปแบบ IPv4 และ IPv6 รับที่อยู่เครือข่าย ที่อยู่ broadcast และช่วง IP ที่ใช้ได้ทันที",
      },
      tr: {
        name: "CIDR Ayrıştırıcı",
        description:
          "IP adresleri ve ağlar hakkında ayrıntılı bilgi almak için CIDR notasyonunu ayrıştırın, IPv4 ve IPv6 formatlarını destekler. Ağ adresi, yayın adresi ve kullanılabilir IP aralığını anında alın",
      },
      vi: {
        name: "Trình phân tích CIDR",
        description:
          "Phân tích ký hiệu CIDR để có thông tin chi tiết về địa chỉ IP và mạng, hỗ trợ định dạng IPv4 và IPv6. Nhận ngay địa chỉ mạng, địa chỉ broadcast và dải IP có thể sử dụng",
      },
      "zh-CN": {
        name: "CIDR 解析器",
        description:
          "解析 CIDR 记号以获取 IP 地址和网络的详细信息，支持 IPv4 和 IPv6 格式。立即获取网络地址、广播地址和可用 IP 范围",
      },
      "zh-TW": {
        name: "CIDR 解析器",
        description:
          "解析 CIDR 記號以獲取 IP 位址和網路的詳細資訊，支援 IPv4 和 IPv6 格式。立即獲取網路位址、廣播位址和可用 IP 範圍",
      },
    },
  },
  {
    slug: "cidrs-merger-excluder",
    category: "network",
    icon: "network",
    tags: ["cidr", "ip", "network", "merge", "exclude", "ipv4", "ipv6"],
    locales: {
      ar: {
        name: "أداة دمج واستبعاد CIDR",
        description:
          "ادمج كتل CIDR لعناوين IPv4 وIPv6، واطرح الشبكات المستبعدة، وانسخ قائمة CIDR الناتجة بأقل عدد ممكن.",
      },
      de: {
        name: "CIDRs zusammenführen & ausschließen",
        description:
          "Führe IPv4- und IPv6-CIDR-Blöcke zusammen, ziehe ausgeschlossene Netzwerke ab und kopiere die minimale resultierende CIDR-Liste.",
      },
      en: {
        name: "CIDRs Merger & Excluder",
        description:
          "Merge IPv4 and IPv6 CIDR blocks, subtract excluded networks, and copy the minimal resulting CIDR list.",
      },
      es: {
        name: "Fusionador y excluidor de CIDR",
        description:
          "Fusiona bloques CIDR IPv4 e IPv6, resta las redes excluidas y copia la lista CIDR resultante mínima.",
      },
      fr: {
        name: "Fusion et exclusion de CIDR",
        description:
          "Fusionnez des blocs CIDR IPv4 et IPv6, soustrayez les réseaux exclus, puis copiez la liste CIDR minimale obtenue.",
      },
      he: {
        name: "ממזג ומחריג CIDR",
        description:
          "מזגו בלוקי CIDR של IPv4 ו-IPv6, החסירו רשתות מוחרגות, והעתיקו את רשימת ה-CIDR המינימלית שמתקבלת.",
      },
      hi: {
        name: "CIDRs मर्जर और एक्सक्लूडर",
        description:
          "IPv4 और IPv6 CIDR ब्लॉकों को मर्ज करें, बाहर रखे गए नेटवर्क घटाएं, और न्यूनतम परिणामी CIDR सूची कॉपी करें।",
      },
      id: {
        name: "Penggabung & Pengecuali CIDR",
        description:
          "Gabungkan blok CIDR IPv4 dan IPv6, kurangi jaringan yang dikecualikan, lalu salin daftar CIDR hasil minimal.",
      },
      it: {
        name: "Unificatore ed esclusore di CIDR",
        description:
          "Unisci blocchi CIDR IPv4 e IPv6, sottrai le reti escluse e copia l'elenco CIDR risultante minimo.",
      },
      ja: {
        name: "CIDR 結合・除外ツール",
        description:
          "IPv4 と IPv6 の CIDR ブロックを結合し、除外ネットワークを差し引いて、最小の結果 CIDR リストをコピーできます。",
      },
      ko: {
        name: "CIDR 병합 및 제외 도구",
        description:
          "IPv4 및 IPv6 CIDR 블록을 병합하고, 제외할 네트워크를 빼낸 뒤, 최소 결과 CIDR 목록을 복사합니다.",
      },
      ms: {
        name: "Penggabung & Pengecuali CIDR",
        description:
          "Gabungkan blok CIDR IPv4 dan IPv6, tolak rangkaian yang dikecualikan, dan salin senarai CIDR hasil yang minimum.",
      },
      nl: {
        name: "CIDR's samenvoegen en uitsluiten",
        description:
          "Voeg IPv4- en IPv6-CIDR-blokken samen, trek uitgesloten netwerken af en kopieer de minimale resulterende CIDR-lijst.",
      },
      no: {
        name: "CIDR-fletting og -utelukking",
        description:
          "Flett IPv4- og IPv6-CIDR-blokker, trekk fra utelukkede nettverk, og kopier den minimale resulterende CIDR-listen.",
      },
      pl: {
        name: "Scalanie i wykluczanie CIDR",
        description:
          "Scalaj bloki CIDR IPv4 i IPv6, odejmuj wykluczone sieci i kopiuj minimalną wynikową listę CIDR.",
      },
      pt: {
        name: "Mesclador e Excludor de CIDRs",
        description:
          "Mescle blocos CIDR IPv4 e IPv6, subtraia redes excluídas e copie a lista CIDR resultante mínima.",
      },
      ru: {
        name: "Объединение и исключение CIDR",
        description:
          "Объединяйте CIDR-блоки IPv4 и IPv6, вычитайте исключенные сети и копируйте минимальный итоговый список CIDR.",
      },
      sv: {
        name: "CIDR-sammanslagare och exkluderare",
        description:
          "Slå samman IPv4- och IPv6-CIDR-block, dra bort exkluderade nätverk och kopiera den minimala resulterande CIDR-listan.",
      },
      th: {
        name: "ตัวรวมและตัด CIDR",
        description:
          "รวมบล็อก CIDR ของ IPv4 และ IPv6, ลบเครือข่ายที่ยกเว้น และคัดลอกรายการ CIDR ผลลัพธ์ที่สั้นที่สุด",
      },
      tr: {
        name: "CIDR Birleştirici ve Hariç Tutucu",
        description:
          "IPv4 ve IPv6 CIDR bloklarını birleştirin, hariç tutulan ağları çıkarın ve ortaya çıkan en küçük CIDR listesini kopyalayın.",
      },
      vi: {
        name: "Công cụ gộp và loại trừ CIDR",
        description:
          "Gộp các khối CIDR IPv4 và IPv6, trừ các mạng bị loại trừ, rồi sao chép danh sách CIDR kết quả tối giản.",
      },
      "zh-CN": {
        name: "CIDR 合并与排除工具",
        description:
          "合并 IPv4 和 IPv6 CIDR 块，扣除排除的网络，并复制最小化后的结果 CIDR 列表。",
      },
      "zh-TW": {
        name: "CIDR 合併與排除工具",
        description:
          "合併 IPv4 與 IPv6 CIDR 區塊、扣除要排除的網路，並複製最精簡的結果 CIDR 清單。",
      },
    },
  },
  {
    slug: "code-screenshot-generator",
    category: "developer",
    icon: "braces",
    tags: ["code", "screenshot", "image", "svg", "png", "jpeg", "webp", "html"],
    locales: {
      ar: {
        name: "Code Screenshot Generator",
        description:
          "أنشئ لقطات شاشة للكود مع تمييز الصياغة وصدّرها بصيغ SVG أو PNG أو JPEG أو WebP أو HTML.",
      },
      de: {
        name: "Code Screenshot Generator",
        description:
          "Erstelle Code-Screenshots mit Syntaxhervorhebung und exportiere sie als SVG, PNG, JPEG, WebP oder HTML.",
      },
      en: {
        name: "Code Screenshot Generator",
        description:
          "Generate syntax-highlighted code screenshots and export them as SVG, PNG, JPEG, WebP, or HTML.",
      },
      es: {
        name: "Generador de capturas de código",
        description:
          "Genera capturas de código con resaltado de sintaxis y expórtalas como SVG, PNG, JPEG, WebP o HTML.",
      },
      fr: {
        name: "Code Screenshot Generator",
        description:
          "Générez des captures d'écran de code avec coloration syntaxique et exportez-les en SVG, PNG, JPEG, WebP ou HTML.",
      },
      he: {
        name: "מחולל צילומי מסך לקוד",
        description:
          "צרו צילומי מסך של קוד עם הדגשת תחביר וייצאו אותם כ-SVG, PNG, JPEG, WebP או HTML.",
      },
      hi: {
        name: "Code Screenshot Generator",
        description:
          "सिंटैक्स-हाइलाइट किए गए कोड स्क्रीनशॉट बनाएं और उन्हें SVG, PNG, JPEG, WebP या HTML के रूप में एक्सपोर्ट करें।",
      },
      id: {
        name: "Code Screenshot Generator",
        description:
          "Buat screenshot kode dengan penyorotan sintaks dan ekspor sebagai SVG, PNG, JPEG, WebP, atau HTML.",
      },
      it: {
        name: "Code Screenshot Generator",
        description:
          "Genera screenshot di codice con evidenziazione della sintassi ed esportali come SVG, PNG, JPEG, WebP o HTML.",
      },
      ja: {
        name: "Code Screenshot Generator",
        description:
          "シンタックスハイライト付きのコードスクリーンショットを生成し、SVG、PNG、JPEG、WebP、HTML として書き出します。",
      },
      ko: {
        name: "Code Screenshot Generator",
        description:
          "구문 강조가 적용된 코드 스크린샷을 생성하고 SVG, PNG, JPEG, WebP 또는 HTML로 내보내세요.",
      },
      ms: {
        name: "Code Screenshot Generator",
        description:
          "Jana tangkapan skrin kod dengan penyerlahan sintaks dan eksport sebagai SVG, PNG, JPEG, WebP, atau HTML.",
      },
      nl: {
        name: "Code Screenshot Generator",
        description:
          "Genereer code-screenshots met syntaxmarkering en exporteer ze als SVG, PNG, JPEG, WebP of HTML.",
      },
      no: {
        name: "Code Screenshot Generator",
        description:
          "Lag syntaksuthevede kode-skjermbilder og eksporter dem som SVG, PNG, JPEG, WebP eller HTML.",
      },
      pl: {
        name: "Generator zrzutów ekranu kodu",
        description:
          "Generuj zrzuty ekranu kodu z podświetlaniem składni i eksportuj je jako SVG, PNG, JPEG, WebP lub HTML.",
      },
      pt: {
        name: "Code Screenshot Generator",
        description:
          "Gere capturas de tela de código com realce de sintaxe e exporte-as como SVG, PNG, JPEG, WebP ou HTML.",
      },
      ru: {
        name: "Code Screenshot Generator",
        description:
          "Создавайте скриншоты кода с подсветкой синтаксиса и экспортируйте их как SVG, PNG, JPEG, WebP или HTML.",
      },
      sv: {
        name: "Code Screenshot Generator",
        description:
          "Skapa syntaxmarkerade kodskärmbilder och exportera dem som SVG, PNG, JPEG, WebP eller HTML.",
      },
      th: {
        name: "Code Screenshot Generator",
        description:
          "สร้างภาพหน้าจอโค้ดพร้อมไฮไลต์ไวยากรณ์ และส่งออกเป็น SVG, PNG, JPEG, WebP หรือ HTML",
      },
      tr: {
        name: "Code Screenshot Generator",
        description:
          "Sözdizimi vurgulu kod ekran görüntüleri oluşturun ve bunları SVG, PNG, JPEG, WebP veya HTML olarak dışa aktarın.",
      },
      vi: {
        name: "Code Screenshot Generator",
        description:
          "Tạo ảnh chụp mã có tô sáng cú pháp và xuất dưới dạng SVG, PNG, JPEG, WebP hoặc HTML.",
      },
      "zh-CN": {
        name: "Code Screenshot Generator",
        description:
          "生成带语法高亮的代码截图，并导出为 SVG、PNG、JPEG、WebP 或 HTML。",
      },
      "zh-TW": {
        name: "Code Screenshot Generator",
        description:
          "產生具語法醒目提示的程式碼截圖，並匯出為 SVG、PNG、JPEG、WebP 或 HTML。",
      },
    },
  },
  {
    slug: "color-contrast-checker",
    category: "web",
    icon: "image",
    tags: [
      "color",
      "contrast",
      "accessibility",
      "wcag",
      "a11y",
      "foreground",
      "background",
    ],
    locales: {
      ar: {
        name: "مدقق تباين الألوان",
        description:
          "يفحص نسبة التباين وفق WCAG بين لون النص والخلفية مع مستويات AA/AAA للنص العادي والكبير.",
      },
      de: {
        name: "Farbkontrast-Prüfer",
        description:
          "Prüft das WCAG-Kontrastverhältnis zwischen Vorder- und Hintergrundfarben, einschließlich AA/AAA für normalen und großen Text.",
      },
      en: {
        name: "Color Contrast Checker",
        description:
          "Check WCAG contrast ratios for foreground and background colors, including AA/AAA for normal and large text.",
      },
      es: {
        name: "Comprobador de Contraste de Color",
        description:
          "Comprueba la relación de contraste WCAG entre colores de texto y fondo, con niveles AA/AAA para texto normal y grande.",
      },
      fr: {
        name: "Vérificateur de Contraste des Couleurs",
        description:
          "Vérifiez le ratio de contraste WCAG entre couleurs de texte et de fond, avec niveaux AA/AAA pour texte normal et grand.",
      },
      he: {
        name: "בודק ניגודיות צבעים",
        description:
          "בודק את יחס הניגודיות לפי WCAG בין צבע הטקסט והרקע, כולל AA/AAA לטקסט רגיל וגדול.",
      },
      hi: {
        name: "रंग कंट्रास्ट चेकर",
        description:
          "टेक्स्ट और बैकग्राउंड रंगों के बीच WCAG कंट्रास्ट अनुपात जांचें, सामान्य व बड़े टेक्स्ट के लिए AA/AAA सहित।",
      },
      id: {
        name: "Pemeriksa Kontras Warna",
        description:
          "Periksa rasio kontras WCAG antara warna teks dan latar belakang, termasuk AA/AAA untuk teks normal dan besar.",
      },
      it: {
        name: "Verificatore di Contrasto Colori",
        description:
          "Controlla il rapporto di contrasto WCAG tra colori di testo e sfondo, con livelli AA/AAA per testo normale e grande.",
      },
      ja: {
        name: "色コントラストチェッカー",
        description:
          "前景色と背景色の WCAG コントラスト比を確認し、通常/大きな文字の AA/AAA を判定します。",
      },
      ko: {
        name: "색상 대비 검사기",
        description:
          "전경과 배경 색상의 WCAG 대비 비율을 확인하고 일반/큰 글자 AA/AAA를 판정합니다.",
      },
      ms: {
        name: "Pemeriksa Kontras Warna",
        description:
          "Semak nisbah kontras WCAG antara warna teks dan latar belakang, termasuk AA/AAA untuk teks biasa dan besar.",
      },
      nl: {
        name: "Kleurcontrastcontrole",
        description:
          "Controleer de WCAG-contrastverhouding tussen voor- en achtergrondkleuren, inclusief AA/AAA voor normale en grote tekst.",
      },
      no: {
        name: "Fargekontrast-sjekk",
        description:
          "Sjekk WCAG-kontrastforholdet mellom forgrunns- og bakgrunnsfarger, inkludert AA/AAA for normal og stor tekst.",
      },
      pl: {
        name: "Sprawdzanie Kontrastu Kolorów",
        description:
          "Sprawdza współczynnik kontrastu WCAG między kolorem tekstu i tła, w tym AA/AAA dla tekstu normalnego i dużego.",
      },
      pt: {
        name: "Verificador de Contraste de Cores",
        description:
          "Verifique a taxa de contraste WCAG entre cores de texto e fundo, com níveis AA/AAA para texto normal e grande.",
      },
      ru: {
        name: "Проверка Контраста Цветов",
        description:
          "Проверяет коэффициент контрастности WCAG для цветов текста и фона, включая AA/AAA для обычного и крупного текста.",
      },
      sv: {
        name: "Färgkontrastkontroll",
        description:
          "Kontrollerar WCAG-kontrastförhållandet mellan förgrunds- och bakgrundsfärger, inklusive AA/AAA för normal och stor text.",
      },
      th: {
        name: "ตัวตรวจสอบความต่างสี",
        description:
          "ตรวจสอบอัตราส่วนความต่างสีตาม WCAG ระหว่างสีข้อความและพื้นหลัง รวมถึง AA/AAA สำหรับข้อความปกติและขนาดใหญ่",
      },
      tr: {
        name: "Renk Kontrast Denetleyici",
        description:
          "Ön plan ve arka plan renkleri arasındaki WCAG kontrast oranını kontrol eder; normal ve büyük metin için AA/AAA dahil.",
      },
      vi: {
        name: "Trình Kiểm Tra Tương Phản Màu",
        description:
          "Kiểm tra tỷ lệ tương phản WCAG giữa màu chữ và nền, bao gồm AA/AAA cho chữ thường và chữ lớn.",
      },
      "zh-CN": {
        name: "颜色对比度检查器",
        description:
          "检查前景与背景颜色的 WCAG 对比度，包括普通与大号文字的 AA/AAA 标准。",
      },
      "zh-TW": {
        name: "顏色對比度檢查器",
        description:
          "檢查前景與背景顏色的 WCAG 對比度，包括一般與大字體的 AA/AAA 標準。",
      },
    },
  },
  {
    slug: "color-converter",
    category: "web",
    icon: "image",
    tags: [
      "color",
      "converter",
      "hex",
      "rgb",
      "hsl",
      "hsv",
      "hwb",
      "lab",
      "lch",
      "cmyk",
      "css",
    ],
    locales: {
      ar: {
        name: "محول الألوان",
        description:
          "تحويل الألوان بين تنسيقات HEX و RGB و HSL و HSV و HWB و LAB و LCH و CMYK والكلمات المفتاحية CSS. تحويل ثنائي الاتجاه في الوقت الفعلي مع دعم قناة ألفا.",
      },
      de: {
        name: "Farbkonverter",
        description:
          "Konvertieren Sie Farben zwischen HEX-, RGB-, HSL-, HSV-, HWB-, LAB-, LCH-, CMYK-Formaten und CSS-Schlüsselwörtern. Echtzeit-Bidirektionalkonvertierung mit Alpha-Kanal-Unterstützung.",
      },
      en: {
        name: "Color Converter",
        description:
          "Convert colors between HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK and CSS keywords. Real-time bidirectional conversion with alpha channel support.",
      },
      es: {
        name: "Convertidor de Colores",
        description:
          "Convierte colores entre formatos HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK y palabras clave CSS. Conversión bidireccional en tiempo real con soporte de canal alfa.",
      },
      fr: {
        name: "Convertisseur de Couleurs",
        description:
          "Convertir les couleurs entre les formats HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK et mots-clés CSS. Conversion bidirectionnelle en temps réel avec support du canal alpha.",
      },
      he: {
        name: "ממיר צבעים",
        description:
          "המר צבעים בין פורמטים HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK ומילות מפתח CSS. המרה דו-כיוונית בזמן אמת עם תמיכה בערוץ אלפא.",
      },
      hi: {
        name: "रंग कनवर्टर",
        description:
          "HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK और CSS कीवर्ड प्रारूपों के बीच रंग परिवर्तित करें। अल्फा चैनल समर्थन के साथ वास्तविक समय द्विदिशात्मक रूपांतरण।",
      },
      id: {
        name: "Konverter Warna",
        description:
          "Konversi warna antara format HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK, dan kata kunci CSS. Konversi dua arah waktu nyata dengan dukungan saluran alfa.",
      },
      it: {
        name: "Convertitore di Colori",
        description:
          "Converti i colori tra i formati HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK e parole chiave CSS. Conversione bidirezionale in tempo reale con supporto del canale alfa.",
      },
      ja: {
        name: "カラーコンバーター",
        description:
          "HEX、RGB、HSL、HSV、HWB、LAB、LCH、CMYK、CSSキーワード形式間で色を変換します。アルファチャンネルをサポートしたリアルタイム双方向変換。",
      },
      ko: {
        name: "색상 변환기",
        description:
          "HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK 및 CSS 키워드 형식 간 색상을 변환합니다. 알파 채널을 지원하는 실시간 양방향 변환.",
      },
      ms: {
        name: "Penukar Warna",
        description:
          "Tukar warna antara format HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK dan kata kunci CSS. Penukaran dua hala masa nyata dengan sokongan saluran alfa.",
      },
      nl: {
        name: "Kleurconverter",
        description:
          "Converteer kleuren tussen HEX-, RGB-, HSL-, HSV-, HWB-, LAB-, LCH-, CMYK-formaten en CSS-sleutelwoorden. Realtime bidirectionele conversie met ondersteuning voor alfakanaal.",
      },
      no: {
        name: "Fargekonverterer",
        description:
          "Konverter farger mellom HEX-, RGB-, HSL-, HSV-, HWB-, LAB-, LCH-, CMYK-formater og CSS-nøkkelord. Toveis konvertering i sanntid med støtte for alfakanal.",
      },
      pl: {
        name: "Konwerter Kolorów",
        description:
          "Konwertuj kolory między formatami HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK i słowami kluczowymi CSS. Dwukierunkowa konwersja w czasie rzeczywistym z obsługą kanału alfa.",
      },
      pt: {
        name: "Conversor de Cores",
        description:
          "Converta cores entre os formatos HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK e palavras-chave CSS. Conversão bidirecional em tempo real com suporte a canal alfa.",
      },
      ru: {
        name: "Конвертер Цветов",
        description:
          "Преобразование цветов между форматами HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK и ключевыми словами CSS. Двунаправленное преобразование в реальном времени с поддержкой альфа-канала.",
      },
      sv: {
        name: "Färgkonverterare",
        description:
          "Konvertera färger mellan HEX-, RGB-, HSL-, HSV-, HWB-, LAB-, LCH-, CMYK-format och CSS-nyckelord. Realtids dubbelriktad konvertering med stöd för alfakanal.",
      },
      th: {
        name: "ตัวแปลงสี",
        description:
          "แปลงสีระหว่างรูปแบบ HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK และคำสำคัญ CSS การแปลงแบบสองทิศทางในเวลาจริงพร้อมรองรับช่องอัลฟา",
      },
      tr: {
        name: "Renk Dönüştürücü",
        description:
          "HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK ve CSS anahtar kelimeleri formatları arasında renkleri dönüştürün. Alfa kanal desteği ile gerçek zamanlı çift yönlü dönüşüm.",
      },
      vi: {
        name: "Trình Chuyển Đổi Màu",
        description:
          "Chuyển đổi màu giữa các định dạng HEX, RGB, HSL, HSV, HWB, LAB, LCH, CMYK và từ khóa CSS. Chuyển đổi hai chiều thời gian thực với hỗ trợ kênh alpha.",
      },
      "zh-CN": {
        name: "颜色转换器",
        description:
          "在 HEX、RGB、HSL、HSV、HWB、LAB、LCH、CMYK 和 CSS 关键字格式之间转换颜色。支持 Alpha 通道的实时双向转换。",
      },
      "zh-TW": {
        name: "顏色轉換器",
        description:
          "在 HEX、RGB、HSL、HSV、HWB、LAB、LCH、CMYK 和 CSS 關鍵字格式之間轉換顏色。支援 Alpha 通道的即時雙向轉換。",
      },
    },
  },
  {
    slug: "color-picker",
    category: "web",
    icon: "image",
    tags: ["color", "picker", "eyedropper", "image", "hex", "rgb"],
    locales: {
      ar: {
        name: "أداة انتقاء الألوان",
        description:
          "التقط الألوان من الشاشة أو الصور. التقط البكسلات وانسخ قيم HEX وRGB وHSL وHSV وCMYK فوراً.",
      },
      de: {
        name: "Farbwähler",
        description:
          "Nehmen Sie Farben vom Bildschirm oder aus Bildern auf. Pixel samplen und HEX-, RGB-, HSL-, HSV- und CMYK-Werte sofort kopieren.",
      },
      en: {
        name: "Color Picker",
        description:
          "Pick colors from your screen or images. Sample pixels and copy HEX, RGB, HSL, HSV, and CMYK values instantly.",
      },
      es: {
        name: "Selector de Colores",
        description:
          "Toma colores de la pantalla o imágenes. Muestrea píxeles y copia valores HEX, RGB, HSL, HSV y CMYK al instante.",
      },
      fr: {
        name: "Sélecteur de Couleurs",
        description:
          "Prélevez des couleurs depuis l'écran ou des images. Échantillonnez des pixels et copiez instantanément les valeurs HEX, RGB, HSL, HSV et CMYK.",
      },
      he: {
        name: "בוחר צבעים",
        description:
          "בחר צבעים מהמסך או מתמונות. דגום פיקסלים והעתק מיד ערכי HEX, RGB, HSL, HSV ו‑CMYK.",
      },
      hi: {
        name: "कलर पिकर",
        description:
          "स्क्रीन या चित्रों से रंग चुनें। पिक्सल सैंपल करें और HEX, RGB, HSL, HSV और CMYK मान तुरंत कॉपी करें।",
      },
      id: {
        name: "Pemilih Warna",
        description:
          "Ambil warna dari layar atau gambar. Sampel piksel dan salin nilai HEX, RGB, HSL, HSV, dan CMYK secara instan.",
      },
      it: {
        name: "Selettore di Colori",
        description:
          "Preleva colori dallo schermo o dalle immagini. Campiona i pixel e copia subito i valori HEX, RGB, HSL, HSV e CMYK.",
      },
      ja: {
        name: "カラーピッカー",
        description:
          "画面や画像から色を取得。ピクセルをサンプルして HEX、RGB、HSL、HSV、CMYK の値をすぐにコピー。",
      },
      ko: {
        name: "색상 선택기",
        description:
          "화면이나 이미지에서 색상을 추출합니다. 픽셀을 샘플링하고 HEX, RGB, HSL, HSV, CMYK 값을 즉시 복사합니다.",
      },
      ms: {
        name: "Pemilih Warna",
        description:
          "Pilih warna dari skrin atau imej. Sampel piksel dan salin nilai HEX, RGB, HSL, HSV dan CMYK serta-merta.",
      },
      nl: {
        name: "Kleurkiezer",
        description:
          "Kies kleuren van het scherm of afbeeldingen. Sample pixels en kopieer HEX-, RGB-, HSL-, HSV- en CMYK-waarden direct.",
      },
      no: {
        name: "Fargevelger",
        description:
          "Velg farger fra skjermen eller bilder. Sampl piksler og kopier HEX-, RGB-, HSL-, HSV- og CMYK-verdier med en gang.",
      },
      pl: {
        name: "Próbnik Kolorów",
        description:
          "Pobieraj kolory z ekranu lub obrazów. Próbkuj piksele i natychmiast kopiuj wartości HEX, RGB, HSL, HSV i CMYK.",
      },
      pt: {
        name: "Seletor de Cores",
        description:
          "Escolha cores da tela ou de imagens. Amostre pixels e copie instantaneamente valores HEX, RGB, HSL, HSV e CMYK.",
      },
      ru: {
        name: "Пипетка Цвета",
        description:
          "Берите цвета с экрана или изображений. Отбирайте пиксели и сразу копируйте значения HEX, RGB, HSL, HSV и CMYK.",
      },
      sv: {
        name: "Färgväljare",
        description:
          "Plocka färger från skärmen eller bilder. Sampla pixlar och kopiera HEX-, RGB-, HSL-, HSV- och CMYK-värden direkt.",
      },
      th: {
        name: "ตัวเลือกสี",
        description:
          "เลือกสีจากหน้าจอหรือภาพ ใช้พิกเซลตัวอย่างและคัดลอกค่า HEX, RGB, HSL, HSV และ CMYK ทันที",
      },
      tr: {
        name: "Renk Seçici",
        description:
          "Ekrandan veya görsellerden renk seçin. Pikselleri örnekleyin ve HEX, RGB, HSL, HSV ve CMYK değerlerini anında kopyalayın.",
      },
      vi: {
        name: "Bộ Chọn Màu",
        description:
          "Lấy màu từ màn hình hoặc hình ảnh. Lấy mẫu pixel và sao chép nhanh các giá trị HEX, RGB, HSL, HSV và CMYK.",
      },
      "zh-CN": {
        name: "取色器",
        description:
          "从屏幕或图片取色，采样像素并即时复制 HEX、RGB、HSL、HSV 和 CMYK 值。",
      },
      "zh-TW": {
        name: "取色器",
        description:
          "從螢幕或圖片取色，取樣像素並即時複製 HEX、RGB、HSL、HSV 與 CMYK 值。",
      },
    },
  },
  {
    slug: "cookie-parser",
    category: "web",
    icon: "network",
    tags: [
      "cookie",
      "set-cookie",
      "header",
      "http",
      "parser",
      "json",
      "browser",
      "security",
    ],
    locales: {
      ar: {
        name: "محلل ملفات تعريف الارتباط",
        description: "حلّل ترويسات Cookie و Set-Cookie إلى JSON منظم للفحص.",
      },
      de: {
        name: "Cookie-Parser",
        description:
          "Parst Cookie- und Set-Cookie-Header in strukturiertes JSON zur Prüfung.",
      },
      en: {
        name: "Cookie Parser",
        description:
          "Parse Cookie and Set-Cookie headers into structured JSON for inspection.",
      },
      es: {
        name: "Analizador de Cookies",
        description:
          "Analiza encabezados Cookie y Set-Cookie en JSON estructurado para inspección.",
      },
      fr: {
        name: "Analyseur de Cookies",
        description:
          "Analyse les en-têtes Cookie et Set-Cookie en JSON structuré pour inspection.",
      },
      he: {
        name: "מפרש Cookie",
        description:
          "מפרק כותרות Cookie ו-Set-Cookie ל-JSON מובנה לצורך בדיקה.",
      },
      hi: {
        name: "कुकी पार्सर",
        description: "Cookie और Set-Cookie हेडर को संरचित JSON में पार्स करके जांचें।",
      },
      id: {
        name: "Pengurai Cookie",
        description:
          "Mengurai header Cookie dan Set-Cookie ke JSON terstruktur untuk inspeksi.",
      },
      it: {
        name: "Parser di Cookie",
        description:
          "Analizza gli header Cookie e Set-Cookie in JSON strutturato per l’ispezione.",
      },
      ja: {
        name: "Cookie パーサー",
        description:
          "Cookie と Set-Cookie ヘッダーを構造化 JSON に解析して確認できます。",
      },
      ko: {
        name: "쿠키 파서",
        description:
          "Cookie 및 Set-Cookie 헤더를 구조화된 JSON으로 파싱해 확인합니다.",
      },
      ms: {
        name: "Penghurai Cookie",
        description:
          "Huraikan pengepala Cookie dan Set-Cookie kepada JSON berstruktur untuk pemeriksaan.",
      },
      nl: {
        name: "Cookie-parser",
        description:
          "Parseert Cookie- en Set-Cookie-headers naar gestructureerde JSON voor inspectie.",
      },
      no: {
        name: "Cookie-parser",
        description:
          "Parser Cookie- og Set-Cookie-headere til strukturert JSON for inspeksjon.",
      },
      pl: {
        name: "Parser Cookie",
        description:
          "Parsuje nagłówki Cookie i Set-Cookie do uporządkowanego JSON-a do wglądu.",
      },
      pt: {
        name: "Analisador de Cookies",
        description:
          "Analisa cabeçalhos Cookie e Set-Cookie em JSON estruturado para inspeção.",
      },
      ru: {
        name: "Парсер Cookie",
        description:
          "Разбирает заголовки Cookie и Set-Cookie в структурированный JSON для проверки.",
      },
      sv: {
        name: "Cookie-parser",
        description:
          "Tolkar Cookie- och Set-Cookie-header till strukturerad JSON för granskning.",
      },
      th: {
        name: "ตัวแยกวิเคราะห์คุกกี้",
        description:
          "แยกวิเคราะห์ส่วนหัว Cookie และ Set-Cookie เป็น JSON ที่มีโครงสร้างเพื่อการตรวจสอบ",
      },
      tr: {
        name: "Cookie Ayrıştırıcı",
        description:
          "Cookie ve Set-Cookie başlıklarını inceleme için yapılandırılmış JSON’a ayrıştırır.",
      },
      vi: {
        name: "Trình phân tích Cookie",
        description:
          "Phân tích header Cookie và Set-Cookie thành JSON có cấu trúc để kiểm tra.",
      },
      "zh-CN": {
        name: "Cookie 解析器",
        description: "解析 Cookie 与 Set-Cookie 头为结构化 JSON，便于查看。",
      },
      "zh-TW": {
        name: "Cookie 解析器",
        description: "解析 Cookie 與 Set-Cookie 標頭為結構化 JSON，方便檢視。",
      },
    },
  },
  {
    slug: "crc-checksum-calculator",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "crc",
      "checksum",
      "integrity",
      "file",
      "text",
      "error-detection",
    ],
    locales: {
      ar: {
        name: "حاسبة المجموع الاختباري CRC",
        description:
          "أنشئ مجاميع CRC الاختبارية لإدخال نصي أو ملف مرفوع. قارن متغيرات CRC-8 وCRC-16 وCRC-24 وCRC-32 وCRC-64 الشائعة لفحوصات سلامة البيانات",
      },
      de: {
        name: "CRC-Prüfsummenrechner",
        description:
          "Erzeuge CRC-Prüfsummen für Texteingaben oder Datei-Uploads. Vergleiche gängige CRC-8-, CRC-16-, CRC-24-, CRC-32- und CRC-64-Varianten für Datenintegritätsprüfungen",
      },
      en: {
        name: "CRC Checksum Calculator",
        description:
          "Generate CRC checksums for text input or file upload. Compare common CRC-8, CRC-16, CRC-24, CRC-32, and CRC-64 variants for data integrity checks",
      },
      es: {
        name: "Calculadora de suma de verificación CRC",
        description:
          "Genera sumas de verificación CRC para entrada de texto o carga de archivos. Compara variantes comunes de CRC-8, CRC-16, CRC-24, CRC-32 y CRC-64 para comprobaciones de integridad de datos",
      },
      fr: {
        name: "Calculateur de sommes de contrôle CRC",
        description:
          "Générez des sommes de contrôle CRC pour une saisie de texte ou un fichier importé. Comparez les variantes courantes CRC-8, CRC-16, CRC-24, CRC-32 et CRC-64 pour les contrôles d’intégrité des données",
      },
      he: {
        name: "מחשבון סכומי ביקורת CRC",
        description:
          "צור סכומי ביקורת CRC עבור קלט טקסט או העלאת קובץ. השווה בין וריאנטים נפוצים של CRC-8, CRC-16, CRC-24, CRC-32 ו-CRC-64 לבדיקות שלמות נתונים",
      },
      hi: {
        name: "CRC चेकसम कैलकुलेटर",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए CRC चेकसम जेनरेट करें। डेटा अखंडता जाँचों के लिए सामान्य CRC-8, CRC-16, CRC-24, CRC-32 और CRC-64 वेरिएंट की तुलना करें",
      },
      id: {
        name: "Kalkulator Checksum CRC",
        description:
          "Buat checksum CRC untuk input teks atau upload file. Bandingkan varian umum CRC-8, CRC-16, CRC-24, CRC-32, dan CRC-64 untuk pemeriksaan integritas data",
      },
      it: {
        name: "Calcolatore di checksum CRC",
        description:
          "Genera checksum CRC per input di testo o caricamenti di file. Confronta le varianti comuni CRC-8, CRC-16, CRC-24, CRC-32 e CRC-64 per controlli di integrità dei dati",
      },
      ja: {
        name: "CRC チェックサム計算機",
        description:
          "テキスト入力またはファイルアップロードから CRC チェックサムを生成します。データ整合性チェック向けに、一般的な CRC-8、CRC-16、CRC-24、CRC-32、CRC-64 バリアントを比較できます",
      },
      ko: {
        name: "CRC 체크섬 계산기",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 CRC 체크섬을 생성합니다. 데이터 무결성 검사를 위해 일반적인 CRC-8, CRC-16, CRC-24, CRC-32, CRC-64 변형을 비교하세요",
      },
      ms: {
        name: "Kalkulator Checksum CRC",
        description:
          "Jana checksum CRC untuk input teks atau muat naik fail. Bandingkan varian CRC-8, CRC-16, CRC-24, CRC-32 dan CRC-64 yang biasa digunakan untuk semakan integriti data",
      },
      nl: {
        name: "CRC-checksumcalculator",
        description:
          "Genereer CRC-checksums voor tekstinvoer of bestandsupload. Vergelijk gangbare CRC-8-, CRC-16-, CRC-24-, CRC-32- en CRC-64-varianten voor controles op gegevensintegriteit",
      },
      no: {
        name: "CRC-kontrollsumkalkulator",
        description:
          "Generer CRC-kontrollsummer for tekstinndata eller filopplasting. Sammenlign vanlige CRC-8-, CRC-16-, CRC-24-, CRC-32- og CRC-64-varianter for dataintegritetskontroller",
      },
      pl: {
        name: "Kalkulator sum kontrolnych CRC",
        description:
          "Generuj sumy kontrolne CRC dla wprowadzonego tekstu lub przesłanego pliku. Porównuj popularne warianty CRC-8, CRC-16, CRC-24, CRC-32 i CRC-64 do kontroli integralności danych",
      },
      pt: {
        name: "Calculadora de Checksum CRC",
        description:
          "Gere checksums CRC para entrada de texto ou upload de arquivo. Compare variantes comuns de CRC-8, CRC-16, CRC-24, CRC-32 e CRC-64 para verificações de integridade de dados",
      },
      ru: {
        name: "Калькулятор контрольных сумм CRC",
        description:
          "Создавайте контрольные суммы CRC для текстового ввода или импортированного файла. Сравнивайте распространенные варианты CRC-8, CRC-16, CRC-24, CRC-32 и CRC-64 для проверок целостности данных",
      },
      sv: {
        name: "CRC-kontrollsummekalkylator",
        description:
          "Generera CRC-kontrollsummor för textinmatning eller filuppladdning. Jämför vanliga CRC-8-, CRC-16-, CRC-24-, CRC-32- och CRC-64-varianter för kontroller av dataintegritet",
      },
      th: {
        name: "เครื่องคำนวณเช็กซัม CRC",
        description:
          "สร้างเช็กซัม CRC สำหรับข้อความที่ป้อนหรือไฟล์ที่อัปโหลด เปรียบเทียบตัวแปร CRC-8, CRC-16, CRC-24, CRC-32 และ CRC-64 ที่ใช้กันทั่วไปสำหรับการตรวจสอบความสมบูรณ์ของข้อมูล",
      },
      tr: {
        name: "CRC Sağlama Toplamı Hesaplayıcısı",
        description:
          "Metin girişi veya dosya yüklemesi için CRC sağlama toplamları oluşturun. Veri bütünlüğü kontrolleri için yaygın CRC-8, CRC-16, CRC-24, CRC-32 ve CRC-64 varyantlarını karşılaştırın",
      },
      vi: {
        name: "Trình tính checksum CRC",
        description:
          "Tạo checksum CRC cho đầu vào văn bản hoặc tệp tải lên. So sánh các biến thể CRC-8, CRC-16, CRC-24, CRC-32 và CRC-64 phổ biến để kiểm tra tính toàn vẹn dữ liệu",
      },
      "zh-CN": {
        name: "CRC 校验和计算器",
        description:
          "为文本输入或文件上传生成 CRC 校验和。比较常见的 CRC-8、CRC-16、CRC-24、CRC-32 和 CRC-64 变体，用于数据完整性检查",
      },
      "zh-TW": {
        name: "CRC 校驗和計算器",
        description:
          "為文字輸入或檔案上傳產生 CRC 校驗和。比較常見的 CRC-8、CRC-16、CRC-24、CRC-32 和 CRC-64 變體，用於資料完整性檢查",
      },
    },
  },
  {
    slug: "credit-card-validator",
    category: "text",
    icon: "credit-card",
    tags: ["credit-card", "validator", "luhn", "payment", "finance"],
    locales: {
      ar: {
        name: "مدقق بطاقة الائتمان",
        description:
          "التحقق من أرقام بطاقات الائتمان باستخدام خوارزمية Luhn وتحديد العلامة التجارية",
      },
      de: {
        name: "Kreditkarten-Validator",
        description:
          "Validiert Kreditkartennummern mit dem Luhn-Algorithmus und identifiziert die Kartenmarke",
      },
      en: {
        name: "Credit Card Validator",
        description:
          "Validate credit card numbers using Luhn algorithm and identify card brand",
      },
      es: {
        name: "Validador de Tarjeta de Crédito",
        description:
          "Valida números de tarjeta de crédito usando el algoritmo de Luhn e identifica la marca",
      },
      fr: {
        name: "Validateur de Carte de Crédit",
        description:
          "Valide les numéros de carte de crédit avec l'algorithme de Luhn et identifie la marque",
      },
      he: {
        name: "מאמת כרטיס אשראי",
        description:
          "אימות מספרי כרטיסי אשראי באמצעות אלגוריתם Luhn וזיהוי מותג הכרטיס",
      },
      hi: {
        name: "क्रेडिट कार्ड सत्यापनकर्ता",
        description:
          "Luhn एल्गोरिथम का उपयोग करके क्रेडिट कार्ड नंबर सत्यापित करें और कार्ड ब्रांड पहचानें",
      },
      id: {
        name: "Validator Kartu Kredit",
        description:
          "Validasi nomor kartu kredit menggunakan algoritma Luhn dan identifikasi merek kartu",
      },
      it: {
        name: "Validatore Carta di Credito",
        description:
          "Valida i numeri delle carte di credito usando l'algoritmo di Luhn e identifica il brand",
      },
      ja: {
        name: "クレジットカード番号検証",
        description:
          "Luhnアルゴリズムでクレジットカード番号を検証し、カードブランドを識別",
      },
      ko: {
        name: "신용카드 번호 검증기",
        description:
          "Luhn 알고리즘으로 신용카드 번호를 검증하고 카드 브랜드를 식별",
      },
      ms: {
        name: "Pengesah Kad Kredit",
        description:
          "Sahkan nombor kad kredit menggunakan algoritma Luhn dan kenal pasti jenama kad",
      },
      nl: {
        name: "Creditcard Validator",
        description:
          "Valideer creditcardnummers met het Luhn-algoritme en identificeer het kaartmerk",
      },
      no: {
        name: "Kredittkortvalidator",
        description:
          "Valider kredittkortnumre med Luhn-algoritmen og identifiser kortmerket",
      },
      pl: {
        name: "Walidator Karty Kredytowej",
        description:
          "Weryfikuj numery kart kredytowych algorytmem Luhna i identyfikuj markę karty",
      },
      pt: {
        name: "Validador de Cartão de Crédito",
        description:
          "Valida números de cartão de crédito usando o algoritmo de Luhn e identifica a bandeira",
      },
      ru: {
        name: "Валидатор Кредитных Карт",
        description:
          "Проверка номеров кредитных карт с помощью алгоритма Луна и определение бренда карты",
      },
      sv: {
        name: "Kreditkortsvalidator",
        description:
          "Validera kreditkortsnummer med Luhn-algoritmen och identifiera kortmärket",
      },
      th: {
        name: "ตรวจสอบบัตรเครดิต",
        description: "ตรวจสอบหมายเลขบัตรเครดิตด้วยอัลกอริทึม Luhn และระบุแบรนด์บัตร",
      },
      tr: {
        name: "Kredi Kartı Doğrulayıcı",
        description:
          "Luhn algoritması ile kredi kartı numaralarını doğrulayın ve kart markasını belirleyin",
      },
      vi: {
        name: "Trình Xác Thực Thẻ Tín Dụng",
        description:
          "Xác thực số thẻ tín dụng bằng thuật toán Luhn và nhận dạng thương hiệu thẻ",
      },
      "zh-CN": {
        name: "信用卡号验证器",
        description: "使用 Luhn 算法验证信用卡号并识别卡品牌",
      },
      "zh-TW": {
        name: "信用卡號驗證器",
        description: "使用 Luhn 演算法驗證信用卡號並識別卡品牌",
      },
    },
  },
  {
    slug: "cron-expression-generator",
    category: "time",
    icon: "clock3",
    tags: ["cron", "generator", "schedule", "time", "unix"],
    locales: {
      ar: {
        name: "مولد تعبيرات Cron",
        description:
          "أنشئ تعبيرات Cron خماسية الحقول باستخدام عناصر تحكم مرئية وإعدادات مسبقة ومعاينات لمرات التشغيل القادمة.",
      },
      de: {
        name: "Cron-Ausdrucksgenerator",
        description:
          "Erstellen Sie Cron-Ausdrücke mit fünf Feldern über visuelle Steuerelemente, Voreinstellungen und Vorschauen der nächsten Ausführungen.",
      },
      en: {
        name: "Cron Expression Generator",
        description:
          "Build five-field cron expressions with visual controls, presets, and upcoming run previews.",
      },
      es: {
        name: "Generador de expresiones cron",
        description:
          "Crea expresiones cron de cinco campos con controles visuales, preajustes y vistas previas de próximas ejecuciones.",
      },
      fr: {
        name: "Cron Expression Generator",
        description:
          "Créez des expressions cron à cinq champs avec des contrôles visuels, des préréglages et des aperçus des prochaines exécutions.",
      },
      he: {
        name: "מחולל ביטויי Cron",
        description:
          "בנה ביטויי cron בני חמישה שדות עם פקדים חזותיים, הגדרות מוכנות ותצוגות מקדימות של ההרצות הבאות.",
      },
      hi: {
        name: "Cron Expression Generator",
        description:
          "दृश्य नियंत्रणों, प्रीसेट और आगामी रन पूर्वावलोकन के साथ पांच-फ़ील्ड cron expressions बनाएं।",
      },
      id: {
        name: "Generator Ekspresi Cron",
        description:
          "Buat ekspresi cron lima bidang dengan kontrol visual, preset, dan pratinjau eksekusi mendatang.",
      },
      it: {
        name: "Cron Expression Generator",
        description:
          "Crea espressioni cron a cinque campi con controlli visuali, preset e anteprime delle prossime esecuzioni.",
      },
      ja: {
        name: "Cron Expression Generator",
        description:
          "視覚的なコントロール、プリセット、今後の実行プレビューを使って、5 フィールドの cron 式を作成します。",
      },
      ko: {
        name: "Cron 표현식 생성기",
        description:
          "시각적 컨트롤, 프리셋, 다음 실행 미리보기로 5개 필드 cron 표현식을 만드세요.",
      },
      ms: {
        name: "Cron Expression Generator",
        description:
          "Bina ungkapan cron lima medan dengan kawalan visual, pratetap, dan pratonton larian akan datang.",
      },
      nl: {
        name: "Cron-expressiegenerator",
        description:
          "Maak cron-expressies met vijf velden via visuele bediening, presets en previews van komende uitvoeringen.",
      },
      no: {
        name: "Generator for cron-uttrykk",
        description:
          "Lag cron-uttrykk med fem felt ved hjelp av visuelle kontroller, forhåndsvalg og forhåndsvisning av kommende kjøringer.",
      },
      pl: {
        name: "Generator wyrażeń cron",
        description:
          "Twórz pięciopolowe wyrażenia cron za pomocą kontrolek wizualnych, presetów i podglądu nadchodzących uruchomień.",
      },
      pt: {
        name: "Gerador de Expressões Cron",
        description:
          "Crie expressões cron de cinco campos com controles visuais, predefinições e prévias das próximas execuções.",
      },
      ru: {
        name: "Генератор cron-выражений",
        description:
          "Создавайте пятикомпонентные cron-выражения с визуальными элементами управления, пресетами и предварительным просмотром предстоящих запусков.",
      },
      sv: {
        name: "Generator för cron-uttryck",
        description:
          "Skapa cron-uttryck med fem fält med visuella kontroller, förinställningar och förhandsvisningar av kommande körningar.",
      },
      th: {
        name: "Cron Expression Generator",
        description:
          "สร้างนิพจน์ cron แบบห้าฟิลด์ด้วยตัวควบคุมแบบภาพ พรีเซ็ต และตัวอย่างการรันที่จะเกิดขึ้น",
      },
      tr: {
        name: "Cron İfadesi Oluşturucu",
        description:
          "Görsel kontroller, ön ayarlar ve yaklaşan çalıştırma önizlemeleriyle beş alanlı cron ifadeleri oluşturun.",
      },
      vi: {
        name: "Cron Expression Generator",
        description:
          "Tạo biểu thức cron năm trường bằng điều khiển trực quan, mẫu có sẵn và bản xem trước các lần chạy sắp tới.",
      },
      "zh-CN": {
        name: "Cron 表达式生成器",
        description:
          "使用可视化控件、预设和即将运行预览来构建五字段 cron 表达式。",
      },
      "zh-TW": {
        name: "Cron 表達式產生器",
        description:
          "使用視覺化控制項、預設與後續執行預覽，建立五欄位 cron 表達式。",
      },
    },
  },
  {
    slug: "cron-expression-parser",
    category: "time",
    icon: "clock3",
    tags: ["cron", "schedule", "parser", "unix", "time", "automation"],
    locales: {
      ar: {
        name: "محلل تعبيرات Cron",
        description:
          "حلّل جداول Cron وتحقق منها واشرحها مع تفاصيل الحقول وأوقات التشغيل القادمة.",
      },
      de: {
        name: "Cron Expression Parser",
        description:
          "Analysieren, validieren und erklären Sie Cron-Zeitpläne mit Felddetails und kommenden Ausführungszeiten.",
      },
      en: {
        name: "Cron Expression Parser",
        description:
          "Parse, validate, and explain cron schedules with field details and upcoming run times.",
      },
      es: {
        name: "Cron Expression Parser",
        description:
          "Analiza, valida y explica programaciones cron con detalles de campos y próximas ejecuciones.",
      },
      fr: {
        name: "Analyseur d’expressions cron",
        description:
          "Analysez, validez et expliquez les planifications cron avec le détail des champs et les prochaines heures d’exécution.",
      },
      he: {
        name: "מנתח ביטויי Cron",
        description:
          "נתח, אמת והסבר לוחות זמנים של Cron עם פרטי שדות וזמני הרצה קרובים.",
      },
      hi: {
        name: "Cron Expression Parser",
        description:
          "फ़ील्ड विवरण और आगामी रन समयों के साथ cron शेड्यूल को पार्स, मान्य और समझाएँ।",
      },
      id: {
        name: "Cron Expression Parser",
        description:
          "Uraikan, validasi, dan jelaskan jadwal cron dengan detail field dan waktu eksekusi berikutnya.",
      },
      it: {
        name: "Cron Expression Parser",
        description:
          "Analizza, convalida e spiega le pianificazioni cron con dettagli sui campi e prossimi orari di esecuzione.",
      },
      ja: {
        name: "Cron Expression Parser",
        description:
          "cron スケジュールを解析、検証、説明し、フィールドの詳細と今後の実行時刻を確認できます。",
      },
      ko: {
        name: "Cron 표현식 파서",
        description:
          "필드 세부 정보와 예정된 실행 시간을 통해 cron 일정을 파싱, 검증하고 설명합니다.",
      },
      ms: {
        name: "Penghurai Ungkapan Cron",
        description:
          "Huraikan, sahkan dan jelaskan jadual cron dengan butiran medan dan masa pelaksanaan akan datang.",
      },
      nl: {
        name: "Cron Expression Parser",
        description:
          "Ontleed, valideer en verklaar cron-schema's met velddetails en aankomende uitvoeringstijden.",
      },
      no: {
        name: "Cron Expression Parser",
        description:
          "Tolk, valider og forklar cron-planer med feltdetaljer og kommende kjøretidspunkter.",
      },
      pl: {
        name: "Parser wyrażeń cron",
        description:
          "Analizuj, waliduj i objaśniaj harmonogramy cron ze szczegółami pól oraz nadchodzącymi czasami uruchomień.",
      },
      pt: {
        name: "Cron Expression Parser",
        description:
          "Analise, valide e explique agendamentos cron com detalhes dos campos e próximos horários de execução.",
      },
      ru: {
        name: "Парсер cron-выражений",
        description:
          "Разбирайте, проверяйте и объясняйте расписания cron с деталями полей и ближайшими запусками.",
      },
      sv: {
        name: "Cron Expression Parser",
        description:
          "Tolka, validera och förklara cron-scheman med fältdetaljer och kommande körningstider.",
      },
      th: {
        name: "ตัวแยกวิเคราะห์นิพจน์ cron",
        description:
          "แยกวิเคราะห์ ตรวจสอบความถูกต้อง และอธิบายกำหนดการ cron พร้อมรายละเอียดของแต่ละฟิลด์และเวลารันถัดไป",
      },
      tr: {
        name: "Cron İfadesi Ayrıştırıcı",
        description:
          "Cron zamanlamalarını alan ayrıntıları ve yaklaşan çalıştırma zamanlarıyla ayrıştırın, doğrulayın ve açıklayın.",
      },
      vi: {
        name: "Trình phân tích biểu thức cron",
        description:
          "Phân tích cú pháp, xác thực và giải thích lịch cron với chi tiết từng trường và các thời điểm chạy sắp tới.",
      },
      "zh-CN": {
        name: "Cron 表达式解析器",
        description:
          "解析、验证并解释 Cron 调度，并显示字段详情和后续运行时间。",
      },
      "zh-TW": {
        name: "Cron 表達式解析器",
        description:
          "解析、驗證並說明 cron 排程，包含欄位細節與即將執行的時間。",
      },
    },
  },
  {
    slug: "css-box-shadow-generator",
    category: "web",
    icon: "image",
    tags: ["css", "box-shadow", "shadow", "design", "generator"],
    locales: {
      ar: {
        name: "مولد ظل الصندوق CSS",
        description:
          "أنشئ قيم CSS box-shadow متعددة الطبقات مع معاينة مباشرة وخيار inset وعناصر تحكم دقيقة.",
      },
      de: {
        name: "CSS-Box-Shadow-Generator",
        description:
          "Erstelle mehrschichtige CSS-Box-Shadow-Werte mit Live-Vorschau, Inset-Option und präziser Steuerung.",
      },
      en: {
        name: "CSS Box Shadow Generator",
        description:
          "Create multi-layer CSS box-shadow values with live preview, inset toggles, and precise controls.",
      },
      es: {
        name: "Generador de Sombras CSS",
        description:
          "Crea valores CSS box-shadow de múltiples capas con vista previa en vivo, opción inset y controles precisos.",
      },
      fr: {
        name: "Générateur d'ombres CSS",
        description:
          "Créez des box-shadow CSS multicouches avec aperçu en direct, option inset et contrôles précis.",
      },
      he: {
        name: "מחולל Box Shadow של CSS",
        description:
          "צור ערכי CSS box-shadow מרובי שכבות עם תצוגה חיה, אפשרות inset ובקרות מדויקות.",
      },
      hi: {
        name: "CSS बॉक्स शैडो जनरेटर",
        description:
          "लाइव प्रीव्यू, inset टॉगल और सटीक नियंत्रणों के साथ मल्टी-लेयर CSS box-shadow मान बनाएं।",
      },
      id: {
        name: "Generator Box Shadow CSS",
        description:
          "Buat nilai CSS box-shadow berlapis dengan pratinjau langsung, opsi inset, dan kontrol yang presisi.",
      },
      it: {
        name: "Generatore di Ombre CSS",
        description:
          "Crea valori CSS box-shadow multilivello con anteprima live, opzione inset e controlli precisi.",
      },
      ja: {
        name: "CSS ボックスシャドウ生成器",
        description:
          "複数レイヤーの CSS box-shadow をライブプレビュー、inset 切替、精密コントロールで作成。",
      },
      ko: {
        name: "CSS 박스 섀도 생성기",
        description:
          "라이브 미리보기, inset 토글, 정밀 컨트롤로 다중 레이어 CSS box-shadow 값을 생성합니다.",
      },
      ms: {
        name: "Penjana Box Shadow CSS",
        description:
          "Cipta nilai CSS box-shadow berbilang lapisan dengan pratonton langsung, pilihan inset dan kawalan tepat.",
      },
      nl: {
        name: "CSS Box Shadow-generator",
        description:
          "Maak meerlagige CSS box-shadow-waarden met live preview, inset-optie en nauwkeurige bediening.",
      },
      no: {
        name: "CSS Box Shadow-generator",
        description:
          "Lag flerlagede CSS box-shadow-verdier med live forhåndsvisning, inset-alternativ og presise kontroller.",
      },
      pl: {
        name: "Generator CSS Box Shadow",
        description:
          "Twórz wielowarstwowe wartości CSS box-shadow z podglądem na żywo, opcją inset i precyzyjną kontrolą.",
      },
      pt: {
        name: "Gerador de Box Shadow CSS",
        description:
          "Crie valores CSS box-shadow em múltiplas camadas com pré-visualização ao vivo, opção inset e controles precisos.",
      },
      ru: {
        name: "Генератор CSS Box Shadow",
        description:
          "Создавайте многослойные значения CSS box-shadow с живым превью, inset-переключателем и точными настройками.",
      },
      sv: {
        name: "CSS Box Shadow-generator",
        description:
          "Skapa flerskiktade CSS box-shadow-värden med liveförhandsvisning, inset-alternativ och exakta kontroller.",
      },
      th: {
        name: "เครื่องมือสร้างเงากล่อง CSS",
        description:
          "สร้างค่า CSS box-shadow หลายชั้น พร้อมพรีวิวแบบเรียลไทม์ ตัวเลือก inset และการควบคุมที่ละเอียด.",
      },
      tr: {
        name: "CSS Box Shadow Oluşturucu",
        description:
          "Canlı önizleme, inset seçeneği ve hassas kontrollerle çok katmanlı CSS box-shadow değerleri oluşturun.",
      },
      vi: {
        name: "Trình tạo Box Shadow CSS",
        description:
          "Tạo giá trị CSS box-shadow nhiều lớp với xem trước trực tiếp, tùy chọn inset và điều khiển chi tiết.",
      },
      "zh-CN": {
        name: "CSS 阴影生成器",
        description:
          "生成多层 CSS box-shadow，提供实时预览、内阴影开关与精细参数控制。",
      },
      "zh-TW": {
        name: "CSS 陰影產生器",
        description:
          "產生多層 CSS box-shadow，提供即時預覽、內陰影切換與精細參數控制。",
      },
    },
  },
  {
    slug: "css-gradient-generator",
    category: "web",
    icon: "image",
    tags: ["css", "gradient", "background", "design", "generator"],
    locales: {
      ar: {
        name: "مولد تدرجات CSS",
        description:
          "أنشئ تدرجات خطية وشعاعية ومخروطية مع نقاط ألوان قابلة للسحب، وأوضاع مزج، وCSS جاهز للاستخدام.",
      },
      de: {
        name: "CSS-Gradient-Generator",
        description:
          "Erstellen Sie lineare, radiale und konische Verläufe mit ziehbaren Farbstopps, Mischmodi und einsatzbereitem CSS.",
      },
      en: {
        name: "CSS Gradient Generator",
        description:
          "Create layered linear, radial, and conic gradients with draggable color stops, blend modes, and export-ready CSS.",
      },
      es: {
        name: "Generador de Gradientes CSS",
        description:
          "Crea gradientes lineales, radiales y cónicos con paradas de color arrastrables, modos de mezcla y CSS listo para usar.",
      },
      fr: {
        name: "Générateur de Dégradés CSS",
        description:
          "Créez des dégradés linéaires, radiaux et coniques avec des points de couleur déplaçables, des modes de fusion et du CSS prêt à l’emploi.",
      },
      he: {
        name: "מחולל גרדיאנטים CSS",
        description:
          "צרו גרדיאנטים ליניאריים, רדיאליים וקוניים עם נקודות צבע ניתנות לגרירה, מצבי מיזוג ו-CSS מוכן לשימוש.",
      },
      hi: {
        name: "CSS ग्रेडिएंट जनरेटर",
        description:
          "ड्रैग किए जा सकने वाले रंग स्टॉप्स के साथ लीनियर, रेडियल और कोनिक ग्रेडिएंट बनाएँ, ब्लेंड मोड्स और तैयार-टू-यूज़ CSS के साथ।",
      },
      id: {
        name: "Pembuat Gradien CSS",
        description:
          "Buat gradien linear, radial, dan konik dengan pemberhentian warna yang bisa diseret, mode blend, dan CSS siap pakai.",
      },
      it: {
        name: "Generatore di Gradienti CSS",
        description:
          "Crea gradienti lineari, radiali e conici con punti colore trascinabili, modalità di fusione e CSS pronto all’uso.",
      },
      ja: {
        name: "CSS グラデーションジェネレーター",
        description:
          "ドラッグ可能な色停止点で線形・放射・円錐グラデーションを作成し、ブレンドモードと即使用できる CSS を出力します。",
      },
      ko: {
        name: "CSS 그라디언트 생성기",
        description:
          "드래그 가능한 색상 스톱으로 선형, 방사형, 원뿔형 그라디언트를 만들고 블렌드 모드 및 바로 쓸 수 있는 CSS를 출력합니다.",
      },
      ms: {
        name: "Penjana Gradien CSS",
        description:
          "Cipta gradien linear, radial dan kon dengan hentian warna boleh diseret, mod campuran dan CSS sedia guna.",
      },
      nl: {
        name: "CSS-Gradientgenerator",
        description:
          "Maak lineaire, radiale en conische gradients met versleepbare kleurstops, mengmodi en direct bruikbare CSS.",
      },
      no: {
        name: "CSS-gradientgenerator",
        description:
          "Lag lineære, radiale og koniske gradienter med flyttbare fargestopp, blandemoduser og ferdig CSS.",
      },
      pl: {
        name: "Generator Gradientów CSS",
        description:
          "Twórz gradienty liniowe, radialne i stożkowe z przeciąganymi punktami kolorów, trybami mieszania i gotowym CSS.",
      },
      pt: {
        name: "Gerador de Gradientes CSS",
        description:
          "Crie gradientes lineares, radiais e cônicos com paradas de cor arrastáveis, modos de mesclagem e CSS pronto para uso.",
      },
      ru: {
        name: "Генератор CSS-градиентов",
        description:
          "Создавайте линейные, радиальные и конические градиенты с перетаскиваемыми цветовыми стопами, режимами смешивания и готовым CSS.",
      },
      sv: {
        name: "CSS-Gradientgenerator",
        description:
          "Skapa linjära, radiella och koniska gradienter med dragbara färgstopp, blandningslägen och färdig CSS.",
      },
      th: {
        name: "ตัวสร้างไล่สี CSS",
        description:
          "สร้างไล่สีแบบเชิงเส้น แบบรัศมี และแบบกรวย พร้อมจุดสีลากได้ โหมดผสมสี และ CSS ที่พร้อมใช้.",
      },
      tr: {
        name: "CSS Gradyan Oluşturucu",
        description:
          "Sürüklenebilir renk duraklarıyla doğrusal, radyal ve konik gradyanlar oluşturun; karışım modları ve kullanıma hazır CSS ile.",
      },
      vi: {
        name: "Trình tạo Gradient CSS",
        description:
          "Tạo gradient tuyến tính, xuyên tâm và hình nón với điểm dừng màu kéo thả, chế độ hòa trộn và CSS sẵn dùng.",
      },
      "zh-CN": {
        name: "CSS 渐变生成器",
        description:
          "创建可拖拽色标的线性、径向与圆锥渐变，支持混合模式并输出可直接使用的 CSS。",
      },
      "zh-TW": {
        name: "CSS 漸層產生器",
        description:
          "建立可拖曳色標的線性、放射與圓錐漸層，支援混合模式並輸出可直接使用的 CSS。",
      },
    },
  },
  {
    slug: "csv-to-json-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "csv", "json", "converter"],
    locales: {
      ar: {
        name: "محول CSV → JSON",
        description:
          "حوّل CSV إلى JSON. الصق CSV أو استورد ملفًا؛ اضبط الخيارات (الرؤوس، الفاصل، التشذيب، إلخ)، عاين، انسخ ونزّل.",
      },
      de: {
        name: "CSV → JSON Konverter",
        description:
          "Wandelt CSV in JSON um. CSV einfügen oder Datei importieren; Optionen (Header, Trennzeichen, Trim usw.) anpassen, Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "CSV → JSON Converter",
        description:
          "Convert CSV to JSON. Paste CSV or import a file; adjust options (headers, delimiter, trim, etc.), preview, copy, and download.",
      },
      es: {
        name: "Convertidor CSV → JSON",
        description:
          "Convierte CSV a JSON. Pega CSV o importa un archivo; ajusta opciones (encabezados, delimitador, trim, etc.), previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur CSV → JSON",
        description:
          "Convertissez CSV en JSON. Collez du CSV ou importez un fichier ; réglez les options (en-têtes, délimiteur, trim, etc.), prévisualisez, copiez et téléchargez.",
      },
      he: {
        name: "ממיר CSV → JSON",
        description:
          "המרת CSV ל‑JSON. הדביקו CSV או ייבאו קובץ; התאימו אפשרויות (כותרות, מפריד, חיתוך וכו׳), תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "CSV → JSON परिवर्तक",
        description:
          "CSV को JSON में बदलें। CSV पेस्ट करें या फ़ाइल आयात करें; विकल्प (हेडर, डिलिमिटर, ट्रिम आदि) समायोजित करें, पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi CSV → JSON",
        description:
          "Konversi CSV ke JSON. Tempel CSV atau impor berkas; sesuaikan opsi (header, delimiter, trim, dll.), pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore CSV → JSON",
        description:
          "Converti CSV in JSON. Incolla CSV o importa un file; regola le opzioni (intestazioni, delimitatore, trim, ecc.), anteprima, copia e download.",
      },
      ja: {
        name: "CSV → JSON 変換",
        description:
          "CSV を JSON に変換。CSV を貼り付けるかファイルを読み込み、（ヘッダー、区切り、トリム など）オプション調整、プレビュー、コピー、ダウンロード。",
      },
      ko: {
        name: "CSV → JSON 변환기",
        description:
          "CSV를 JSON으로 변환합니다. CSV 붙여넣기 또는 파일 가져오기; 옵션(헤더, 구분자, 트림 등) 조정, 미리보기, 복사 및 다운로드.",
      },
      ms: {
        name: "Penukar CSV → JSON",
        description:
          "Tukar CSV kepada JSON. Tampal CSV atau import fail; laraskan pilihan (pengepala, pemisah, trim, dll.), pratonton, salin dan muat turun.",
      },
      nl: {
        name: "CSV → JSON-converter",
        description:
          "Zet CSV om naar JSON. Plak CSV of importeer een bestand; stel opties (headers, scheidingsteken, trim, enz.) in, bekijk, kopieer en download.",
      },
      no: {
        name: "CSV → JSON-omformer",
        description:
          "Konverter CSV til JSON. Lim inn CSV eller importer en fil; juster alternativer (overskrifter, skilletegn, trim osv.), forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter CSV → JSON",
        description:
          "Konwertuj CSV na JSON. Wklej CSV lub zaimportuj plik; dostosuj opcje (nagłówki, separator, przycinanie itp.), podglądaj, kopiuj i pobieraj.",
      },
      pt: {
        name: "Conversor CSV → JSON",
        description:
          "Converta CSV para JSON. Cole CSV ou importe um arquivo; ajuste opções (cabeçalhos, delimitador, trim etc.), visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер CSV → JSON",
        description:
          "Преобразуйте CSV в JSON. Вставьте CSV или импортируйте файл; настройте опции (заголовки, разделитель, trim и т. д.), просматривайте, копируйте и загружайте.",
      },
      sv: {
        name: "CSV → JSON-omvandlare",
        description:
          "Konvertera CSV till JSON. Klistra in CSV eller importera en fil; justera alternativ (huvuden, avgränsare, trim m.m.), förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง CSV → JSON",
        description:
          "แปลง CSV เป็น JSON วาง CSV หรือ นำเข้าไฟล์; ปรับตัวเลือก (หัวข้อ, ตัวคั่น, trim ฯลฯ) แสดงตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "CSV → JSON Dönüştürücü",
        description:
          "CSV’yi JSON’a dönüştürün. CSV yapıştırın veya dosya içe aktarın; seçenekleri (başlıklar, ayraç, kırpma vb.) ayarlayın, önizleyin, kopyalayın ve indirin.",
      },
      vi: {
        name: "Trình chuyển CSV → JSON",
        description:
          "Chuyển CSV sang JSON. Dán CSV hoặc nhập tệp; điều chỉnh tùy chọn (tiêu đề, dấu phân cách, trim, v.v.), xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "CSV 转 JSON 转换器",
        description:
          "将 CSV 转为 JSON。粘贴 CSV 或导入文件；调整选项（表头、分隔符、裁剪 等），预览、复制并下载。",
      },
      "zh-TW": {
        name: "CSV 轉 JSON 轉換器",
        description:
          "將 CSV 轉為 JSON。貼上 CSV 或匯入檔案；調整選項（表頭、分隔符、裁剪 等），預覽、複製並下載。",
      },
    },
  },
  {
    slug: "cuid2-generator",
    category: "developer",
    icon: "lock",
    tags: [
      "cuid2",
      "id",
      "identifier",
      "unique",
      "random",
      "generator",
      "token",
      "slug",
      "security",
    ],
    locales: {
      ar: {
        name: "مولد CUID2",
        description:
          "أنشئ معرّفات CUID2 آمنة وقليلة التصادم داخل المتصفح مع إمكانية ضبط الطول وعدد العناصر في الدفعة.",
      },
      de: {
        name: "CUID2-Generator",
        description:
          "Erzeuge sichere, kollisionsarme CUID2-IDs direkt im Browser mit anpassbarer Länge und Stapelgröße.",
      },
      en: {
        name: "CUID2 Generator",
        description:
          "Generate secure, collision-resistant CUID2 IDs in your browser with adjustable length and batch count.",
      },
      es: {
        name: "Generador de CUID2",
        description:
          "Genera identificadores CUID2 seguros y resistentes a colisiones en tu navegador con longitud y tamaño de lote ajustables.",
      },
      fr: {
        name: "Générateur de CUID2",
        description:
          "Générez des identifiants CUID2 sûrs et résistants aux collisions dans votre navigateur, avec longueur et taille de lot ajustables.",
      },
      he: {
        name: "מחולל CUID2",
        description:
          "צרו מזהי CUID2 מאובטחים ובעלי סיכוי נמוך להתנגשות ישירות בדפדפן, עם אורך וגודל אצווה הניתנים להתאמה.",
      },
      hi: {
        name: "CUID2 जनरेटर",
        description:
          "ब्राउज़र में सुरक्षित और कम टकराव वाले CUID2 ID बनाएँ, जहाँ लंबाई और बैच आकार दोनों समायोज्य हों।",
      },
      id: {
        name: "Generator CUID2",
        description:
          "Buat ID CUID2 yang aman dan tahan benturan langsung di browser dengan panjang dan ukuran batch yang bisa disesuaikan.",
      },
      it: {
        name: "Generatore CUID2",
        description:
          "Genera ID CUID2 sicuri e resistenti alle collisioni nel browser, con lunghezza e dimensione del lotto regolabili.",
      },
      ja: {
        name: "CUID2 ジェネレーター",
        description:
          "長さとバッチ件数を調整しながら、安全で衝突しにくい CUID2 ID をブラウザ内で生成します。",
      },
      ko: {
        name: "CUID2 생성기",
        description:
          "길이와 배치 수량을 조절하면서 충돌 가능성이 낮은 안전한 CUID2 ID를 브라우저에서 생성합니다.",
      },
      ms: {
        name: "Penjana CUID2",
        description:
          "Jana ID CUID2 yang selamat dan tahan perlanggaran dalam pelayar dengan panjang dan saiz kelompok yang boleh dilaraskan.",
      },
      nl: {
        name: "CUID2-generator",
        description:
          "Genereer veilige CUID2-ID’s met weinig kans op botsingen in je browser, met instelbare lengte en batchgrootte.",
      },
      no: {
        name: "CUID2-generator",
        description:
          "Generer sikre CUID2-ID-er med lav kollisjonsrisiko i nettleseren, med justerbar lengde og batchstørrelse.",
      },
      pl: {
        name: "Generator CUID2",
        description:
          "Generuj bezpieczne identyfikatory CUID2 o niskim ryzyku kolizji bezpośrednio w przeglądarce, z regulowaną długością i wielkością partii.",
      },
      pt: {
        name: "Gerador de CUID2",
        description:
          "Gere IDs CUID2 seguros e resistentes a colisões no navegador, com comprimento e tamanho de lote ajustáveis.",
      },
      ru: {
        name: "Генератор CUID2",
        description:
          "Создавайте безопасные идентификаторы CUID2 с низким риском коллизий прямо в браузере, настраивая длину и размер пакета.",
      },
      sv: {
        name: "CUID2-generator",
        description:
          "Generera säkra CUID2-ID:n med låg kollisionsrisk i webbläsaren, med justerbar längd och batchstorlek.",
      },
      th: {
        name: "ตัวสร้าง CUID2",
        description:
          "สร้าง ID แบบ CUID2 ที่ปลอดภัยและมีโอกาสชนกันต่ำในเบราว์เซอร์ พร้อมปรับความยาวและขนาดแบตช์ได้",
      },
      tr: {
        name: "CUID2 Oluşturucu",
        description:
          "Uzunluğu ve toplu üretim boyutunu ayarlayarak güvenli ve çakışmaya dayanıklı CUID2 kimlikleri tarayıcıda üretin.",
      },
      vi: {
        name: "Trình tạo CUID2",
        description:
          "Tạo ID CUID2 an toàn, ít va chạm ngay trong trình duyệt với độ dài và kích thước lô có thể điều chỉnh.",
      },
      "zh-CN": {
        name: "CUID2 生成器",
        description:
          "在浏览器内生成安全、低碰撞的 CUID2 标识符，支持自定义长度和批量数量。",
      },
      "zh-TW": {
        name: "CUID2 產生器",
        description:
          "在瀏覽器內產生安全、低碰撞的 CUID2 識別碼，支援自訂長度與批次數量。",
      },
    },
  },
  {
    slug: "curl-converter",
    category: "developer",
    icon: "braces",
    tags: ["code", "curl", "http", "converter", "api"],
    locales: {
      ar: {
        name: "محول cURL",
        description: "حوّل أوامر cURL إلى كود لعدة لغات وعملاء HTTP.",
      },
      de: {
        name: "cURL-Konverter",
        description:
          "Konvertiert cURL-Befehle in Code für viele Sprachen und HTTP-Clients.",
      },
      en: {
        name: "cURL Converter",
        description:
          "Convert cURL commands into code for many languages and HTTP clients.",
      },
      es: {
        name: "Conversor de cURL",
        description:
          "Convierte comandos cURL en código para muchos lenguajes y clientes HTTP.",
      },
      fr: {
        name: "Convertisseur cURL",
        description:
          "Convertit des commandes cURL en code pour de nombreux langages et clients HTTP.",
      },
      he: {
        name: "ממיר cURL",
        description: "ממיר פקודות cURL לקוד עבור שפות רבות ולקוחות HTTP.",
      },
      hi: {
        name: "cURL कन्वर्टर",
        description: "cURL कमांड को कई भाषाओं और HTTP क्लाइंट कोड में बदलें।",
      },
      id: {
        name: "Pengonversi cURL",
        description:
          "Mengonversi perintah cURL menjadi kode untuk banyak bahasa dan klien HTTP.",
      },
      it: {
        name: "Convertitore cURL",
        description:
          "Converte comandi cURL in codice per molti linguaggi e client HTTP.",
      },
      ja: {
        name: "cURL 変換",
        description:
          "cURL コマンドを多言語・多様な HTTP クライアント向けのコードに変換します。",
      },
      ko: {
        name: "cURL 변환기",
        description:
          "cURL 명령을 다양한 언어와 HTTP 클라이언트 코드로 변환합니다.",
      },
      ms: {
        name: "Penukar cURL",
        description:
          "Menukar arahan cURL kepada kod untuk banyak bahasa dan klien HTTP.",
      },
      nl: {
        name: "cURL-converter",
        description:
          "Zet cURL-opdrachten om naar code voor veel talen en HTTP-clients.",
      },
      no: {
        name: "cURL-omformer",
        description:
          "Konverterer cURL-kommandoer til kode for mange språk og HTTP-klienter.",
      },
      pl: {
        name: "Konwerter cURL",
        description:
          "Konwertuje polecenia cURL na kod dla wielu języków i klientów HTTP.",
      },
      pt: {
        name: "Conversor de cURL",
        description:
          "Converte comandos cURL em código para muitas linguagens e clientes HTTP.",
      },
      ru: {
        name: "Конвертер cURL",
        description:
          "Преобразует команды cURL в код для многих языков и HTTP-клиентов.",
      },
      sv: {
        name: "cURL-omvandlare",
        description:
          "Konverterar cURL-kommandon till kod för många språk och HTTP-klienter.",
      },
      th: {
        name: "ตัวแปลง cURL",
        description: "แปลงคำสั่ง cURL เป็นโค้ดสำหรับหลายภาษาและไคลเอนต์ HTTP",
      },
      tr: {
        name: "cURL Dönüştürücü",
        description:
          "cURL komutlarını birçok dil ve HTTP istemcisi için koda dönüştürür.",
      },
      vi: {
        name: "Trình chuyển đổi cURL",
        description:
          "Chuyển đổi lệnh cURL thành mã cho nhiều ngôn ngữ và client HTTP.",
      },
      "zh-CN": {
        name: "cURL 转换器",
        description: "将 cURL 命令转换为多种语言与 HTTP 客户端代码。",
      },
      "zh-TW": {
        name: "cURL 轉換器",
        description: "將 cURL 命令轉換為多種語言與 HTTP 客戶端程式碼。",
      },
    },
  },
  {
    slug: "current-network-time",
    category: "network",
    icon: "network",
    tags: ["time", "clock", "timezone", "network"],
    locales: {
      ar: {
        name: "الوقت الشبكي الحالي",
        description:
          "احصل على الوقت الشبكي الحالي وقارنه مع وقت النظام المحلي. اعرض الوقت الشبكي الدقيق واكتشف أي اختلافات زمنية.",
      },
      de: {
        name: "Aktuelle Netzwerkzeit",
        description:
          "Ermitteln Sie die aktuelle Netzwerkzeit und vergleichen Sie sie mit Ihrer lokalen Systemzeit. Zeigen Sie die genaue Netzwerkzeit an und erkennen Sie Zeitunterschiede.",
      },
      en: {
        name: "Current Network Time",
        description:
          "Get the current network time and compare it with your local system time. View accurate network time and detect any time differences.",
      },
      es: {
        name: "Hora de Red Actual",
        description:
          "Obtén la hora actual de la red y compárala con tu hora local del sistema. Ve la hora de red precisa y detecta cualquier diferencia horaria.",
      },
      fr: {
        name: "Heure Réseau Actuelle",
        description:
          "Obtenez l'heure réseau actuelle et comparez-la avec votre heure système locale. Visualisez l'heure réseau précise et détectez toute différence horaire.",
      },
      he: {
        name: "זמן הרשת הנוכחי",
        description:
          "קבל את זמן הרשת הנוכחי והשווה אותו לזמן המערכת המקומי שלך. הצג זמן רשת מדויק וזהה הבדלי זמן.",
      },
      hi: {
        name: "वर्तमान नेटवर्क समय",
        description:
          "वर्तमान नेटवर्क समय प्राप्त करें और इसे अपने स्थानीय सिस्टम समय से तुलना करें। सटीक नेटवर्क समय देखें और किसी भी समय अंतर का पता लगाएं।",
      },
      id: {
        name: "Waktu Jaringan Saat Ini",
        description:
          "Dapatkan waktu jaringan saat ini dan bandingkan dengan waktu sistem lokal Anda. Lihat waktu jaringan yang akurat dan deteksi perbedaan waktu.",
      },
      it: {
        name: "Ora di Rete Corrente",
        description:
          "Ottieni l'ora di rete corrente e confrontala con l'ora locale del sistema. Visualizza l'ora di rete precisa e rileva eventuali differenze temporali.",
      },
      ja: {
        name: "現在のネットワーク時刻",
        description:
          "現在のネットワーク時刻を取得し、ローカルシステム時刻と比較します。正確なネットワーク時刻を表示し、時刻の差異を検出します。",
      },
      ko: {
        name: "현재 네트워크 시간",
        description:
          "현재 네트워크 시간을 가져와 로컬 시스템 시간과 비교합니다. 정확한 네트워크 시간을 확인하고 시간 차이를 감지하세요.",
      },
      ms: {
        name: "Masa Rangkaian Semasa",
        description:
          "Dapatkan masa rangkaian semasa dan bandingkan dengan masa sistem tempatan anda. Lihat masa rangkaian yang tepat dan kesan sebarang perbezaan masa.",
      },
      nl: {
        name: "Huidige Netwerktijd",
        description:
          "Verkrijg de huidige netwerktijd en vergelijk deze met uw lokale systeemtijd. Bekijk de nauwkeurige netwerktijd en detecteer eventuele tijdverschillen.",
      },
      no: {
        name: "Gjeldende Nettverkstid",
        description:
          "Få gjeldende nettverkstid og sammenlign den med din lokale systemtid. Vis nøyaktig nettverkstid og oppdag eventuelle tidsforskjeller.",
      },
      pl: {
        name: "Aktualny Czas Sieciowy",
        description:
          "Pobierz aktualny czas sieciowy i porównaj go z lokalnym czasem systemowym. Wyświetl dokładny czas sieciowy i wykryj wszelkie różnice czasowe.",
      },
      pt: {
        name: "Hora de Rede Atual",
        description:
          "Obtenha a hora de rede atual e compare-a com sua hora local do sistema. Visualize a hora de rede precisa e detecte qualquer diferença horária.",
      },
      ru: {
        name: "Текущее Сетевое Время",
        description:
          "Получите текущее сетевое время и сравните его с вашим локальным системным временем. Просматривайте точное сетевое время и обнаруживайте любые временные различия.",
      },
      sv: {
        name: "Aktuell Nätverkstid",
        description:
          "Hämta aktuell nätverkstid och jämför den med din lokala systemtid. Visa exakt nätverkstid och upptäck eventuella tidsskillnader.",
      },
      th: {
        name: "เวลาเครือข่ายปัจจุบัน",
        description:
          "รับเวลาเครือข่ายปัจจุบันและเปรียบเทียบกับเวลาระบบในเครื่องของคุณ ดูเวลาเครือข่ายที่แม่นยำและตรวจจับความแตกต่างของเวลา",
      },
      tr: {
        name: "Mevcut Ağ Saati",
        description:
          "Mevcut ağ saatini alın ve yerel sistem saatinizle karşılaştırın. Doğru ağ saatini görüntüleyin ve herhangi bir zaman farkını tespit edin.",
      },
      vi: {
        name: "Thời Gian Mạng Hiện Tại",
        description:
          "Lấy thời gian mạng hiện tại và so sánh với thời gian hệ thống cục bộ của bạn. Xem thời gian mạng chính xác và phát hiện bất kỳ sự khác biệt thời gian nào.",
      },
      "zh-CN": {
        name: "当前网络时间",
        description:
          "从网络获取当前时间，并与您的本地系统时间进行比较。查看准确的网络时间并检测任何时间差异。",
      },
      "zh-TW": {
        name: "目前網路時間",
        description:
          "從網路取得目前時間，並與您的本機系統時間進行比較。檢視準確的網路時間並偵測任何時間差異。",
      },
    },
  },
  {
    slug: "data-uri-to-file-converter",
    category: "web",
    icon: "file-text",
    tags: [
      "data uri",
      "data url",
      "base64",
      "file",
      "converter",
      "decode",
      "mime type",
      "preview",
    ],
    locales: {
      ar: {
        name: "محول Data URI إلى ملف",
        description:
          "يفك ترميز سلاسل Data URI إلى ملفات، ويتحقق من نوع MIME والترميز، ثم يحمّل النتيجة دون اتصال.",
      },
      de: {
        name: "Data-URI-zu-Datei-Konverter",
        description:
          "Dekodiert Data-URI-Strings zu Dateien, prüft MIME-Typ und Kodierung und lädt das Ergebnis offline herunter.",
      },
      en: {
        name: "Data URI to File Converter",
        description:
          "Decode Data URI strings into files, inspect MIME type and encoding, and download the result offline.",
      },
      es: {
        name: "Convertidor de Data URI a archivo",
        description:
          "Decodifica cadenas Data URI en archivos, inspecciona el tipo MIME y la codificación, y descarga el resultado sin conexión.",
      },
      fr: {
        name: "Convertisseur de Data URI en fichier",
        description:
          "Décode les chaînes Data URI en fichiers, inspecte le type MIME et l’encodage, puis télécharge le résultat hors ligne.",
      },
      he: {
        name: "ממיר Data URI לקובץ",
        description:
          "מפענח מחרוזות Data URI לקבצים, בודק סוג MIME וקידוד, ומוריד את התוצאה ללא חיבור.",
      },
      hi: {
        name: "Data URI से फ़ाइल कन्वर्टर",
        description:
          "Data URI स्ट्रिंग को फ़ाइल में डिकोड करें, MIME प्रकार और एन्कोडिंग देखें, और परिणाम ऑफ़लाइन डाउनलोड करें।",
      },
      id: {
        name: "Konverter Data URI ke file",
        description:
          "Mendekode string Data URI menjadi file, memeriksa tipe MIME dan encoding, lalu mengunduh hasilnya secara offline.",
      },
      it: {
        name: "Convertitore da Data URI a file",
        description:
          "Decodifica stringhe Data URI in file, controlla il tipo MIME e la codifica e scarica il risultato offline.",
      },
      ja: {
        name: "Data URI からファイル変換",
        description:
          "Data URI 文字列をファイルにデコードし、MIME タイプとエンコードを確認してオフラインでダウンロードします。",
      },
      ko: {
        name: "Data URI → 파일 변환기",
        description:
          "Data URI 문자열을 파일로 디코딩하고 MIME 유형과 인코딩을 확인한 뒤 오프라인으로 다운로드합니다.",
      },
      ms: {
        name: "Penukar Data URI ke fail",
        description:
          "Menyahkod rentetan Data URI kepada fail, semak jenis MIME dan pengekodan, kemudian muat turun hasil secara luar talian.",
      },
      nl: {
        name: "Data URI naar bestand-converter",
        description:
          "Decodeert Data URI-strings naar bestanden, bekijkt het MIME-type en de codering en downloadt het resultaat offline.",
      },
      no: {
        name: "Data URI til fil-konverterer",
        description:
          "Dekoder Data URI-strenger til filer, kontrollerer MIME-type og koding og laster ned resultatet offline.",
      },
      pl: {
        name: "Konwerter Data URI na plik",
        description:
          "Dekoduje ciągi Data URI do plików, sprawdza typ MIME i kodowanie oraz pobiera wynik offline.",
      },
      pt: {
        name: "Conversor de Data URI para arquivo",
        description:
          "Decodifica strings Data URI em arquivos, verifica o tipo MIME e a codificação e baixa o resultado offline.",
      },
      ru: {
        name: "Конвертер Data URI в файл",
        description:
          "Декодирует строки Data URI в файлы, проверяет MIME-тип и кодировку и скачивает результат офлайн.",
      },
      sv: {
        name: "Data URI till fil-konverterare",
        description:
          "Avkodar Data URI-strängar till filer, kontrollerar MIME-typ och kodning och laddar ner resultatet offline.",
      },
      th: {
        name: "ตัวแปลง Data URI เป็นไฟล์",
        description:
          "ถอดรหัสสตริง Data URI เป็นไฟล์ ตรวจสอบชนิด MIME และการเข้ารหัส แล้วดาวน์โหลดผลลัพธ์แบบออฟไลน์",
      },
      tr: {
        name: "Data URI’den Dosyaya Dönüştürücü",
        description:
          "Data URI dizgelerini dosyaya dönüştürür, MIME türü ve kodlamayı kontrol eder ve sonucu çevrimdışı indirir.",
      },
      vi: {
        name: "Trình chuyển Data URI sang tệp",
        description:
          "Giải mã chuỗi Data URI thành tệp, kiểm tra loại MIME và mã hóa, rồi tải xuống kết quả ngoại tuyến.",
      },
      "zh-CN": {
        name: "Data URI 转文件转换器",
        description:
          "将 Data URI 字符串解码为文件，查看 MIME 类型与编码并下载，离线可用。",
      },
      "zh-TW": {
        name: "Data URI 轉檔案轉換器",
        description:
          "將 Data URI 字串解碼為檔案，查看 MIME 類型與編碼並下載，離線可用。",
      },
    },
  },
  {
    slug: "device-information",
    category: "misc",
    icon: "wrench",
    tags: ["device", "browser", "hardware", "screen", "system", "diagnostics"],
    locales: {
      ar: {
        name: "معلومات الجهاز",
        description:
          "افحص تفاصيل المتصفح والشاشة والعتاد والشبكة والتخزين والإمكانات من جهازك الحالي دون رفع أي شيء.",
      },
      de: {
        name: "Geräteinformationen",
        description:
          "Prüfen Sie Browser-, Anzeige-, Hardware-, Netzwerk-, Speicher- und Funktionsdetails Ihres aktuellen Geräts, ohne etwas hochzuladen.",
      },
      en: {
        name: "Device Information",
        description:
          "Inspect browser, display, hardware, network, storage, and capability details from your current device without uploading anything.",
      },
      es: {
        name: "Información del dispositivo",
        description:
          "Inspecciona detalles del navegador, pantalla, hardware, red, almacenamiento y capacidades de tu dispositivo actual sin subir nada.",
      },
      fr: {
        name: "Informations sur l'appareil",
        description:
          "Inspectez les détails du navigateur, de l'affichage, du matériel, du réseau, du stockage et des capacités de votre appareil actuel sans rien envoyer.",
      },
      he: {
        name: "מידע על המכשיר",
        description:
          "בדקו פרטי דפדפן, תצוגה, חומרה, רשת, אחסון ויכולות מהמכשיר הנוכחי שלכם, בלי להעלות שום דבר.",
      },
      hi: {
        name: "डिवाइस की जानकारी",
        description:
          "अपने मौजूदा डिवाइस से ब्राउज़र, डिस्प्ले, हार्डवेयर, नेटवर्क, स्टोरेज और क्षमता विवरण देखें, बिना कुछ अपलोड किए।",
      },
      id: {
        name: "Informasi Perangkat",
        description:
          "Periksa detail browser, layar, perangkat keras, jaringan, penyimpanan, dan kapabilitas dari perangkat Anda saat ini tanpa mengunggah apa pun.",
      },
      it: {
        name: "Device Information",
        description:
          "Ispeziona dettagli su browser, display, hardware, rete, archiviazione e funzionalità del dispositivo corrente senza caricare nulla.",
      },
      ja: {
        name: "デバイス情報",
        description:
          "現在のデバイスから、ブラウザ、ディスプレイ、ハードウェア、ネットワーク、ストレージ、機能の詳細をアップロードなしで確認します。",
      },
      ko: {
        name: "기기 정보",
        description:
          "아무것도 업로드하지 않고 현재 기기에서 브라우저, 디스플레이, 하드웨어, 네트워크, 저장소 및 기능 세부 정보를 확인합니다.",
      },
      ms: {
        name: "Maklumat Peranti",
        description:
          "Periksa butiran pelayar, paparan, perkakasan, rangkaian, storan dan keupayaan daripada peranti semasa anda tanpa memuat naik apa-apa.",
      },
      nl: {
        name: "Apparaatinformatie",
        description:
          "Inspecteer gegevens over browser, scherm, hardware, netwerk, opslag en mogelijkheden van je huidige apparaat zonder iets te uploaden.",
      },
      no: {
        name: "Enhetsinformasjon",
        description:
          "Inspiser detaljer om nettleser, skjerm, maskinvare, nettverk, lagring og funksjoner fra den nåværende enheten din uten å laste opp noe.",
      },
      pl: {
        name: "Informacje o urządzeniu",
        description:
          "Sprawdź informacje o przeglądarce, ekranie, sprzęcie, sieci, pamięci i obsługiwanych funkcjach bieżącego urządzenia bez przesyłania czegokolwiek.",
      },
      pt: {
        name: "Informações do Dispositivo",
        description:
          "Inspecione detalhes de navegador, tela, hardware, rede, armazenamento e capacidades do seu dispositivo atual sem enviar nada.",
      },
      ru: {
        name: "Информация об устройстве",
        description:
          "Проверьте сведения о браузере, дисплее, оборудовании, сети, хранилище и возможностях текущего устройства без отправки данных.",
      },
      sv: {
        name: "Enhetsinformation",
        description:
          "Inspektera uppgifter om webbläsare, skärm, hårdvara, nätverk, lagring och funktionsstöd från din nuvarande enhet utan att ladda upp något.",
      },
      th: {
        name: "ข้อมูลอุปกรณ์",
        description:
          "ตรวจสอบรายละเอียดเบราว์เซอร์ จอแสดงผล ฮาร์ดแวร์ เครือข่าย พื้นที่เก็บข้อมูล และความสามารถของอุปกรณ์ปัจจุบันโดยไม่อัปโหลดสิ่งใด",
      },
      tr: {
        name: "Cihaz Bilgileri",
        description:
          "Geçerli cihazınızdan tarayıcı, ekran, donanım, ağ, depolama ve yetenek ayrıntılarını hiçbir şey yüklemeden inceleyin.",
      },
      vi: {
        name: "Thông tin thiết bị",
        description:
          "Kiểm tra thông tin chi tiết về trình duyệt, màn hình, phần cứng, mạng, lưu trữ và khả năng hỗ trợ từ thiết bị hiện tại của bạn mà không tải lên bất cứ thứ gì.",
      },
      "zh-CN": {
        name: "设备信息",
        description:
          "检查当前设备在浏览器中可见的浏览器、显示、硬件、网络、存储和功能详情，无需上传任何内容。",
      },
      "zh-TW": {
        name: "裝置資訊",
        description:
          "從目前裝置檢視瀏覽器、顯示器、硬體、網路、儲存空間與功能支援詳細資料，不需上傳任何內容。",
      },
    },
  },
  {
    slug: "docker-run-to-compose-converter",
    category: "developer",
    icon: "network",
    tags: ["code", "docker", "compose", "converter", "devops"],
    locales: {
      ar: {
        name: "محول Docker Run إلى Compose",
        description: "حوّل أوامر docker run إلى ملف docker-compose.yml.",
      },
      de: {
        name: "Docker Run zu Compose Konverter",
        description:
          "Konvertiert docker run-Befehle in eine docker-compose.yml-Datei.",
      },
      en: {
        name: "Docker Run to Compose Converter",
        description:
          "Convert docker run commands into a docker-compose.yml file.",
      },
      es: {
        name: "Convertidor Docker Run a Compose",
        description:
          "Convierte comandos docker run en un archivo docker-compose.yml.",
      },
      fr: {
        name: "Convertisseur Docker Run vers Compose",
        description:
          "Convertit des commandes docker run en fichier docker-compose.yml.",
      },
      he: {
        name: "ממיר Docker Run ל-Compose",
        description: "ממיר פקודות docker run לקובץ docker-compose.yml.",
      },
      hi: {
        name: "Docker Run से Compose परिवर्तक",
        description: "docker run कमांड को docker-compose.yml फ़ाइल में बदलें।",
      },
      id: {
        name: "Pengonversi Docker Run ke Compose",
        description:
          "Mengonversi perintah docker run menjadi file docker-compose.yml.",
      },
      it: {
        name: "Convertitore Docker Run in Compose",
        description:
          "Converte comandi docker run in un file docker-compose.yml.",
      },
      ja: {
        name: "Docker Run → Compose 変換",
        description:
          "docker run コマンドを docker-compose.yml ファイルに変換します。",
      },
      ko: {
        name: "Docker Run → Compose 변환기",
        description: "docker run 명령을 docker-compose.yml 파일로 변환합니다.",
      },
      ms: {
        name: "Penukar Docker Run ke Compose",
        description:
          "Menukar arahan docker run kepada fail docker-compose.yml.",
      },
      nl: {
        name: "Docker Run naar Compose-converter",
        description:
          "Zet docker run-opdrachten om naar een docker-compose.yml-bestand.",
      },
      no: {
        name: "Docker Run til Compose-omformer",
        description:
          "Konverterer docker run-kommandoer til en docker-compose.yml-fil.",
      },
      pl: {
        name: "Konwerter Docker Run do Compose",
        description:
          "Konwertuje polecenia docker run na plik docker-compose.yml.",
      },
      pt: {
        name: "Conversor Docker Run para Compose",
        description:
          "Converte comandos docker run em um arquivo docker-compose.yml.",
      },
      ru: {
        name: "Конвертер Docker Run в Compose",
        description:
          "Преобразует команды docker run в файл docker-compose.yml.",
      },
      sv: {
        name: "Docker Run till Compose-omvandlare",
        description:
          "Konverterar docker run-kommandon till en docker-compose.yml-fil.",
      },
      th: {
        name: "ตัวแปลง Docker Run เป็น Compose",
        description: "แปลงคำสั่ง docker run เป็นไฟล์ docker-compose.yml",
      },
      tr: {
        name: "Docker Run'dan Compose'a Dönüştürücü",
        description:
          "docker run komutlarını docker-compose.yml dosyasına dönüştürür.",
      },
      vi: {
        name: "Trình chuyển Docker Run sang Compose",
        description: "Chuyển lệnh docker run thành tệp docker-compose.yml.",
      },
      "zh-CN": {
        name: "Docker Run 转 Compose 转换器",
        description: "将 docker run 命令转换为 docker-compose.yml 文件。",
      },
      "zh-TW": {
        name: "Docker Run 轉 Compose 轉換器",
        description: "將 docker run 命令轉換為 docker-compose.yml 檔案。",
      },
    },
  },
  {
    slug: "duration-calculator",
    category: "time",
    icon: "globe",
    tags: [
      "time",
      "duration",
      "calculator",
      "iso-8601",
      "timezone",
      "timestamp",
    ],
    locales: {
      ar: {
        name: "حاسبة إضافة/طرح المدة",
        description:
          "أضف أو اطرح مدد ISO 8601 من وقت أساسي في أي منطقة زمنية بدقة الميلي ثانية.",
      },
      de: {
        name: "Dauer-Addieren/Subtrahieren-Rechner",
        description:
          "Fügen Sie ISO 8601-Dauern zu einer Basiszeit in jeder Zeitzone hinzu oder ziehen Sie sie ab, mit Millisekundenpräzision.",
      },
      en: {
        name: "Duration Add/Subtract Calculator",
        description:
          "Add or subtract ISO 8601 durations from a base time in any time zone, with millisecond precision.",
      },
      es: {
        name: "Calculadora de suma/resta de duración",
        description:
          "Suma o resta duraciones ISO 8601 desde una hora base en cualquier zona horaria, con precisión de milisegundos.",
      },
      fr: {
        name: "Calculateur d'ajout/soustraction de durée",
        description:
          "Ajoutez ou soustrayez des durées ISO 8601 à partir d'une heure de base dans n'importe quel fuseau horaire, avec une précision à la milliseconde.",
      },
      he: {
        name: "מחשבון הוספה/חיסור משך",
        description:
          "הוסף או החסר משכי ISO 8601 מזמן בסיס בכל אזור זמן, בדיוק של מילישניות.",
      },
      hi: {
        name: "अवधि जोड़ें/घटाएं कैलकुलेटर",
        description:
          "आधार समय से किसी भी समय क्षेत्र में ISO 8601 अवधि जोड़ें या घटाएं, मिलीसेकंड सटीकता के साथ।",
      },
      id: {
        name: "Kalkulator tambah/kurangi durasi",
        description:
          "Tambahkan atau kurangi durasi ISO 8601 dari waktu dasar di zona waktu mana pun, dengan presisi milidetik.",
      },
      it: {
        name: "Calcolatore di somma/sottrazione della durata",
        description:
          "Aggiungi o sottrai durate ISO 8601 da un'ora base in qualsiasi fuso orario, con precisione al millisecondo.",
      },
      ja: {
        name: "期間の加算/減算計算ツール",
        description:
          "基準時刻から任意のタイムゾーンで ISO 8601 期間を加算/減算し、ミリ秒精度で計算します。",
      },
      ko: {
        name: "기간 더하기/빼기 계산기",
        description:
          "기준 시간에서 어떤 시간대든 ISO 8601 기간을 더하거나 빼며 밀리초 정밀도를 제공합니다.",
      },
      ms: {
        name: "Pengira tambah/tolak durasi",
        description:
          "Tambah atau tolak durasi ISO 8601 daripada masa asas di mana-mana zon masa, dengan ketepatan milisaat.",
      },
      nl: {
        name: "Duur optellen/aftrekken-calculator",
        description:
          "Tel ISO 8601-duren op bij of af van een basistijd in elke tijdzone, met millisecondeprecisie.",
      },
      no: {
        name: "Kalkulator for legg til/trekk fra varighet",
        description:
          "Legg til eller trekk fra ISO 8601-varigheter fra en basistid i hvilken som helst tidssone, med millisekundpresisjon.",
      },
      pl: {
        name: "Kalkulator dodawania/odejmowania czasu trwania",
        description:
          "Dodawaj lub odejmuj czasy trwania ISO 8601 od czasu bazowego w dowolnej strefie czasowej z dokładnością do milisekundy.",
      },
      pt: {
        name: "Calculadora de adicionar/subtrair duração",
        description:
          "Some ou subtraia durações ISO 8601 de uma hora base em qualquer fuso horário, com precisão de milissegundos.",
      },
      ru: {
        name: "Калькулятор сложения/вычитания длительности",
        description:
          "Добавляйте или вычитайте длительности ISO 8601 от базового времени в любом часовом поясе с точностью до миллисекунд.",
      },
      sv: {
        name: "Lägg till/ta bort varaktighet-räknare",
        description:
          "Lägg till eller dra av ISO 8601-varaktigheter från en basstid i valfri tidszon med millisekundprecision.",
      },
      th: {
        name: "เครื่องคำนวณบวก/ลบระยะเวลา",
        description:
          "บวกหรือลบระยะเวลา ISO 8601 จากเวลาฐานในทุกเขตเวลา ด้วยความละเอียดระดับมิลลิวินาที",
      },
      tr: {
        name: "Süre Ekle/Çıkar Hesaplayıcı",
        description:
          "Herhangi bir saat dilimindeki temel zamandan ISO 8601 sürelerini milisaniye hassasiyetinde ekleyin veya çıkarın.",
      },
      vi: {
        name: "Máy tính cộng/trừ thời lượng",
        description:
          "Cộng hoặc trừ thời lượng ISO 8601 từ thời gian gốc ở bất kỳ múi giờ nào, với độ chính xác đến mili giây.",
      },
      "zh-CN": {
        name: "时长加减计算器",
        description: "在任意时区，从基准时间加减 ISO 8601 时长，精确到毫秒。",
      },
      "zh-TW": {
        name: "時長加減計算器",
        description: "在任何時區，從基準時間加減 ISO 8601 時長，精確到毫秒。",
      },
    },
  },
  {
    slug: "email-validator",
    category: "text",
    icon: "file-text",
    tags: ["email", "validator", "format", "address"],
    locales: {
      ar: {
        name: "مدقق البريد الإلكتروني",
        description:
          "يتحقق من عناوين البريد الإلكتروني عبر فحوصات الصياغة والطول والنطاق.",
      },
      de: {
        name: "E-Mail-Validator",
        description:
          "Validiert E-Mail-Adressen mit Syntax-, Längen- und Domain-Prüfungen.",
      },
      en: {
        name: "Email Validator",
        description:
          "Validate email addresses with syntax, length, and domain checks.",
      },
      es: {
        name: "Validador de correo electrónico",
        description:
          "Valida direcciones de correo electrónico con comprobaciones de sintaxis, longitud y dominio.",
      },
      fr: {
        name: "Validateur d'e-mail",
        description:
          "Valide les adresses e-mail avec des contrôles de syntaxe, de longueur et de domaine.",
      },
      he: {
        name: 'מאמת דוא"ל',
        description: 'מאמת כתובות דוא"ל עם בדיקות תחביר, אורך ודומיין.',
      },
      hi: {
        name: "ईमेल सत्यापनकर्ता",
        description: "ईमेल पतों को सिंटैक्स, लंबाई और डोमेन जांच के साथ सत्यापित करता है।",
      },
      id: {
        name: "Validator email",
        description:
          "Memvalidasi alamat email dengan pemeriksaan sintaks, panjang, dan domain.",
      },
      it: {
        name: "Validatore email",
        description:
          "Convalida indirizzi email con controlli di sintassi, lunghezza e dominio.",
      },
      ja: {
        name: "メール検証",
        description: "メールアドレスを構文・長さ・ドメインで検証します。",
      },
      ko: {
        name: "이메일 검증기",
        description: "이메일 주소를 문법, 길이, 도메인 규칙으로 검증합니다.",
      },
      ms: {
        name: "Pengesah e-mel",
        description:
          "Sahkan alamat e-mel dengan semakan sintaks, panjang dan domain.",
      },
      nl: {
        name: "E-mail-validator",
        description:
          "Valideert e-mailadressen met syntax-, lengte- en domeincontroles.",
      },
      no: {
        name: "E-post-validerer",
        description:
          "Validerer e-postadresser med syntaks-, lengde- og domenesjekker.",
      },
      pl: {
        name: "Walidator e-mail",
        description:
          "Waliduje adresy e-mail z kontrolą składni, długości i domeny.",
      },
      pt: {
        name: "Validador de e-mail",
        description:
          "Valida endereços de e-mail com verificações de sintaxe, comprimento e domínio.",
      },
      ru: {
        name: "Валидатор электронной почты",
        description:
          "Проверяет адреса электронной почты по синтаксису, длине и домену.",
      },
      sv: {
        name: "E-post-validerare",
        description:
          "Validerar e-postadresser med syntax-, längd- och domänkontroller.",
      },
      th: {
        name: "ตัวตรวจสอบอีเมล",
        description: "ตรวจสอบอีเมลด้วยการตรวจไวยากรณ์ ความยาว และโดเมน",
      },
      tr: {
        name: "E-posta Doğrulayıcı",
        description:
          "E-posta adreslerini sözdizimi, uzunluk ve alan adı kontrolleriyle doğrular.",
      },
      vi: {
        name: "Trình xác thực email",
        description:
          "Xác thực địa chỉ email với kiểm tra cú pháp, độ dài và tên miền.",
      },
      "zh-CN": {
        name: "邮箱验证器",
        description: "验证邮箱地址，检查语法、长度和域名。",
      },
      "zh-TW": {
        name: "電子郵件驗證器",
        description: "驗證電子郵件地址，檢查語法、長度與網域。",
      },
    },
  },
  {
    slug: "eu-vat-number-validator",
    category: "text",
    icon: "file-text",
    tags: ["vat", "tax", "validator", "business", "finance", "eu"],
    locales: {
      ar: {
        name: "مُحقِّق أرقام ضريبة القيمة المضافة للاتحاد الأوروبي",
        description:
          "تحقَّق من أرقام ضريبة القيمة المضافة للاتحاد الأوروبي عبر رمز الدولة والتنسيق والمجموع الاختباري — بالكامل داخل متصفحك، دون رفع أي شيء.",
      },
      de: {
        name: "EU-USt-IdNr.-Validator",
        description:
          "Validieren Sie EU-Umsatzsteuer-Identifikationsnummern nach Ländercode, Format und Prüfsumme – vollständig in Ihrem Browser, nichts wird hochgeladen.",
      },
      en: {
        name: "EU VAT Number Validator",
        description:
          "Validate EU VAT numbers by country code, format, and checksum — fully in your browser, nothing uploaded.",
      },
      es: {
        name: "Validador de números de IVA de la UE",
        description:
          "Valida números de IVA de la UE por código de país, formato y suma de verificación — todo en tu navegador, sin subir nada.",
      },
      fr: {
        name: "Validateur de numéro de TVA intracommunautaire",
        description:
          "Validez les numéros de TVA de l'UE par code pays, format et somme de contrôle — entièrement dans votre navigateur, rien n'est envoyé.",
      },
      he: {
        name: 'מאמת מספרי מע"מ של האיחוד האירופי',
        description:
          'אמתו מספרי מע"מ של האיחוד האירופי לפי קוד מדינה, פורמט וסכום ביקורת — הכול בדפדפן שלכם, שום דבר לא מועלה.',
      },
      hi: {
        name: "EU VAT नंबर सत्यापनकर्ता",
        description:
          "EU VAT नंबरों को देश कोड, प्रारूप और चेकसम के आधार पर सत्यापित करें — पूरी तरह आपके ब्राउज़र में, कुछ भी अपलोड नहीं होता।",
      },
      id: {
        name: "Validator Nomor PPN Uni Eropa",
        description:
          "Validasi nomor PPN Uni Eropa berdasarkan kode negara, format, dan checksum — sepenuhnya di browser Anda, tidak ada yang diunggah.",
      },
      it: {
        name: "Validatore di partite IVA UE",
        description:
          "Valida le partite IVA dell'UE per codice paese, formato e checksum — interamente nel tuo browser, nulla viene caricato.",
      },
      ja: {
        name: "EU VAT番号バリデーター",
        description:
          "EUのVAT番号を国コード、フォーマット、チェックサムで検証します。すべてブラウザ内で動作し、データはアップロードされません。",
      },
      ko: {
        name: "EU 부가가치세 번호 검증기",
        description:
          "국가 코드, 형식, 체크섬을 기준으로 EU VAT 번호를 검증합니다 — 브라우저 내에서 완전히 처리되며 아무것도 업로드되지 않습니다.",
      },
      ms: {
        name: "Pengesah Nombor VAT EU",
        description:
          "Sahkan nombor VAT EU mengikut kod negara, format, dan checksum — sepenuhnya dalam pelayar anda, tiada apa yang dimuat naik.",
      },
      nl: {
        name: "EU-btw-nummer-validator",
        description:
          "Valideer EU-btw-nummers op landcode, formaat en controlegetal — volledig in je browser, er wordt niets geüpload.",
      },
      no: {
        name: "EU MVA-nummervalidator",
        description:
          "Valider EU-MVA-nummer etter landkode, format og kontrollsiffer — fullstendig i nettleseren din, ingenting lastes opp.",
      },
      pl: {
        name: "Walidator numerów VAT UE",
        description:
          "Sprawdzaj numery VAT UE pod kątem kodu kraju, formatu i sumy kontrolnej — w całości w przeglądarce, nic nie jest wysyłane.",
      },
      pt: {
        name: "Validador de Número de IVA da UE",
        description:
          "Valide números de IVA da UE por código de país, formato e checksum — totalmente no seu navegador, nada é enviado.",
      },
      ru: {
        name: "Валидатор НДС-номеров ЕС",
        description:
          "Проверяйте НДС-номера ЕС по коду страны, формату и контрольной сумме — полностью в браузере, без загрузки данных.",
      },
      sv: {
        name: "EU-momsnummervalidator",
        description:
          "Validera EU-momsnummer efter landskod, format och kontrollsumma — helt i din webbläsare, inget laddas upp.",
      },
      th: {
        name: "ตัวตรวจสอบหมายเลข VAT ของสหภาพยุโรป",
        description:
          "ตรวจสอบหมายเลข VAT ของสหภาพยุโรปตามรหัสประเทศ รูปแบบ และ checksum ทำงานในเบราว์เซอร์ของคุณทั้งหมด ไม่มีการอัปโหลดข้อมูล",
      },
      tr: {
        name: "AB KDV Numarası Doğrulayıcı",
        description:
          "AB KDV numaralarını ülke kodu, biçim ve sağlama toplamına göre doğrulayın — tamamen tarayıcınızda, hiçbir şey yüklenmez.",
      },
      vi: {
        name: "Trình xác thực mã số thuế VAT EU",
        description:
          "Xác thực mã số VAT của EU theo mã quốc gia, định dạng và checksum — hoàn toàn trong trình duyệt của bạn, không tải lên bất cứ đâu.",
      },
      "zh-CN": {
        name: "欧盟 VAT 号码校验器",
        description:
          "按国家代码、格式和校验位验证欧盟 VAT 号码 —— 完全在浏览器中运行，不上传任何数据。",
      },
      "zh-TW": {
        name: "歐盟 VAT 號碼驗證器",
        description:
          "依國家代碼、格式與校驗碼驗證歐盟 VAT 號碼——完全在瀏覽器中執行，不上傳任何資料。",
      },
    },
  },
  {
    slug: "file-to-data-uri-converter",
    category: "web",
    icon: "file-text",
    tags: ["data-uri", "data-url", "file", "converter", "base64", "encoding"],
    locales: {
      ar: {
        name: "محول ملف إلى Data URI",
        description:
          "حوّل الملفات إلى سلاسل Data URI لدمجها في HTML أو CSS أو JSON. يعمل بالكامل دون اتصال.",
      },
      de: {
        name: "Datei-zu-Data-URI-Konverter",
        description:
          "Wandelt Dateien in Data-URI-Strings um, um sie in HTML, CSS oder JSON einzubetten. Funktioniert vollständig offline.",
      },
      en: {
        name: "File to Data URI Converter",
        description:
          "Convert files into Data URI strings for embedding in HTML, CSS, or JSON. Works fully offline.",
      },
      es: {
        name: "Convertidor de archivo a Data URI",
        description:
          "Convierte archivos en cadenas Data URI para incrustarlos en HTML, CSS o JSON. Funciona totalmente sin conexión.",
      },
      fr: {
        name: "Convertisseur de fichier en Data URI",
        description:
          "Convertit des fichiers en chaînes Data URI pour l’intégration dans HTML, CSS ou JSON. Fonctionne entièrement hors ligne.",
      },
      he: {
        name: "ממיר קובץ ל-Data URI",
        description:
          "ממיר קבצים למחרוזות Data URI לשילוב ב-HTML, CSS או JSON. עובד לחלוטין ללא חיבור.",
      },
      hi: {
        name: "फ़ाइल से Data URI कन्वर्टर",
        description:
          "फ़ाइलों को Data URI स्ट्रिंग में बदलें ताकि उन्हें HTML, CSS या JSON में एम्बेड किया जा सके। पूरी तरह ऑफ़लाइन काम करता है।",
      },
      id: {
        name: "Konverter file ke Data URI",
        description:
          "Mengonversi file menjadi string Data URI untuk disematkan ke HTML, CSS, atau JSON. Berfungsi sepenuhnya offline.",
      },
      it: {
        name: "Convertitore da file a Data URI",
        description:
          "Converte file in stringhe Data URI per l'inserimento in HTML, CSS o JSON. Funziona completamente offline.",
      },
      ja: {
        name: "ファイルから Data URI 変換",
        description:
          "ファイルを Data URI 文字列に変換し、HTML、CSS、JSON へ埋め込めます。完全オフラインで動作します。",
      },
      ko: {
        name: "파일 → Data URI 변환기",
        description:
          "파일을 Data URI 문자열로 변환하여 HTML, CSS 또는 JSON에 삽입할 수 있습니다. 완전 오프라인으로 작동합니다.",
      },
      ms: {
        name: "Penukar fail ke Data URI",
        description:
          "Menukar fail kepada rentetan Data URI untuk disematkan dalam HTML, CSS atau JSON. Berfungsi sepenuhnya luar talian.",
      },
      nl: {
        name: "Bestand naar Data URI-converter",
        description:
          "Zet bestanden om in Data URI-strings om in HTML, CSS of JSON te embedden. Werkt volledig offline.",
      },
      no: {
        name: "Fil til Data URI-konverterer",
        description:
          "Konverterer filer til Data URI-strenger for innbygging i HTML, CSS eller JSON. Fungerer helt offline.",
      },
      pl: {
        name: "Konwerter pliku na Data URI",
        description:
          "Konwertuje pliki na ciągi Data URI do osadzania w HTML, CSS lub JSON. Działa całkowicie offline.",
      },
      pt: {
        name: "Conversor de arquivo para Data URI",
        description:
          "Converte arquivos em strings Data URI para incorporação em HTML, CSS ou JSON. Funciona totalmente offline.",
      },
      ru: {
        name: "Конвертер файла в Data URI",
        description:
          "Преобразует файлы в строки Data URI для встраивания в HTML, CSS или JSON. Полностью работает офлайн.",
      },
      sv: {
        name: "Fil till Data URI-konverterare",
        description:
          "Konverterar filer till Data URI-strängar för inbäddning i HTML, CSS eller JSON. Fungerar helt offline.",
      },
      th: {
        name: "ตัวแปลงไฟล์เป็น Data URI",
        description:
          "แปลงไฟล์เป็นสตริง Data URI เพื่อฝังใน HTML, CSS หรือ JSON ทำงานแบบออฟไลน์ทั้งหมด",
      },
      tr: {
        name: "Dosyadan Data URI Dönüştürücü",
        description:
          "Dosyaları HTML, CSS veya JSON içine gömmek için Data URI dizgelerine dönüştürür. Tamamen çevrimdışı çalışır.",
      },
      vi: {
        name: "Trình chuyển đổi tệp sang Data URI",
        description:
          "Chuyển tệp thành chuỗi Data URI để nhúng vào HTML, CSS hoặc JSON. Hoạt động hoàn toàn ngoại tuyến.",
      },
      "zh-CN": {
        name: "文件转 Data URI 转换器",
        description:
          "将文件转换为 Data URI 字符串，便于嵌入 HTML、CSS 或 JSON，完全离线。",
      },
      "zh-TW": {
        name: "檔案轉 Data URI 轉換器",
        description:
          "將檔案轉換為 Data URI 字串，方便嵌入 HTML、CSS 或 JSON，完全離線。",
      },
    },
  },
  {
    slug: "gitignore-generator",
    category: "developer",
    icon: "file-text",
    tags: ["code", "git", "gitignore", "generator", "template", "github"],
    locales: {
      ar: {
        name: "مولد .gitignore",
        description:
          "قم بإنشاء ملفات .gitignore لمشاريعك عن طريق اختيار القوالب",
      },
      de: {
        name: ".gitignore Generator",
        description:
          "Generieren Sie .gitignore-Dateien für Ihre Projekte durch Auswahl von Vorlagen",
      },
      en: {
        name: ".gitignore Generator",
        description:
          "Generate .gitignore files for your projects by selecting templates",
      },
      es: {
        name: "Generador de .gitignore",
        description:
          "Genera archivos .gitignore para tus proyectos seleccionando plantillas",
      },
      fr: {
        name: "Générateur .gitignore",
        description:
          "Générez des fichiers .gitignore pour vos projets en sélectionnant des modèles",
      },
      he: {
        name: "מחולל .gitignore",
        description: "צור קבצי .gitignore לפרויקטים שלך על ידי בחירת תבניות",
      },
      hi: {
        name: ".gitignore जनरेटर",
        description: "टेम्पलेट चुनकर अपनी परियोजनाओं के लिए .gitignore फाइलें उत्पन्न करें",
      },
      id: {
        name: "Generator .gitignore",
        description:
          "Buat file .gitignore untuk proyek Anda dengan memilih template",
      },
      it: {
        name: "Generatore .gitignore",
        description:
          "Genera file .gitignore per i tuoi progetti selezionando i template",
      },
      ja: {
        name: ".gitignore ジェネレーター",
        description:
          "テンプレートを選択してプロジェクト用の .gitignore ファイルを生成",
      },
      ko: {
        name: ".gitignore 생성기",
        description: "템플릿을 선택하여 프로젝트용 .gitignore 파일 생성",
      },
      ms: {
        name: "Penjana .gitignore",
        description:
          "Jana fail .gitignore untuk projek anda dengan memilih templat",
      },
      nl: {
        name: ".gitignore Generator",
        description:
          "Genereer .gitignore bestanden voor uw projecten door sjablonen te selecteren",
      },
      no: {
        name: ".gitignore Generator",
        description:
          "Generer .gitignore-filer for prosjektene dine ved å velge maler",
      },
      pl: {
        name: "Generator .gitignore",
        description:
          "Generuj pliki .gitignore dla swoich projektów, wybierając szablony",
      },
      pt: {
        name: "Gerador de .gitignore",
        description:
          "Gere arquivos .gitignore para seus projetos selecionando modelos",
      },
      ru: {
        name: "Генератор .gitignore",
        description:
          "Создавайте файлы .gitignore для ваших проектов, выбирая шаблоны",
      },
      sv: {
        name: ".gitignore Generator",
        description:
          "Generera .gitignore-filer för dina projekt genom att välja mallar",
      },
      th: {
        name: "ตัวสร้าง .gitignore",
        description: "สร้างไฟล์ .gitignore สำหรับโปรเจกต์ของคุณโดยเลือกเทมเพลต",
      },
      tr: {
        name: ".gitignore Oluşturucu",
        description:
          "Şablonları seçerek projeleriniz için .gitignore dosyaları oluşturun",
      },
      vi: {
        name: "Trình tạo .gitignore",
        description: "Tạo tệp .gitignore cho dự án của bạn bằng cách chọn mẫu",
      },
      "zh-CN": {
        name: ".gitignore 生成器",
        description: "通过选择模板为您的项目生成 .gitignore 文件",
      },
      "zh-TW": {
        name: ".gitignore 產生器",
        description: "透過選擇模板為您的專案產生 .gitignore 檔案",
      },
    },
  },
  {
    slug: "hmac-generator",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "hmac",
      "security",
      "crypto",
      "signature",
      "mac",
      "authentication",
    ],
    locales: {
      ar: {
        name: "مولد HMAC",
        description:
          "أنشئ توقيعات HMAC (رمز المصادقة على الرسائل المستند إلى التجزئة) للنص أو الملفات. يدعم خوارزميات SHA-1 و SHA-256 و SHA-384 و SHA-512 مع تنسيقات إخراج سداسية عشرية و base64.",
      },
      de: {
        name: "HMAC-Generator",
        description:
          "Generieren Sie HMAC (Hash-based Message Authentication Code) Signaturen für Text oder Dateien. Unterstützt SHA-1, SHA-256, SHA-384 und SHA-512 Algorithmen mit hexadezimalen und base64 Ausgabeformaten.",
      },
      en: {
        name: "HMAC Generator",
        description:
          "Generate HMAC (Hash-based Message Authentication Code) signatures for text or file input. Supports SHA-1, SHA-256, SHA-384, and SHA-512 algorithms with hex and base64 output formats.",
      },
      es: {
        name: "Generador HMAC",
        description:
          "Genere firmas HMAC (Código de Autenticación de Mensajes basado en Hash) para texto o archivos. Admite algoritmos SHA-1, SHA-256, SHA-384 y SHA-512 con formatos de salida hexadecimal y base64.",
      },
      fr: {
        name: "Générateur HMAC",
        description:
          "Générez des signatures HMAC (Code d'Authentification de Message basé sur le Hachage) pour du texte ou des fichiers. Prend en charge les algorithmes SHA-1, SHA-256, SHA-384 et SHA-512 avec formats de sortie hexadécimal et base64.",
      },
      he: {
        name: "מחולל HMAC",
        description:
          "צור חתימות HMAC (קוד אימות הודעות מבוסס Hash) עבור טקסט או קובץ. תומך באלגוריתמים SHA-1, SHA-256, SHA-384 ו-SHA-512 עם פורמטי פלט הקסדצימלי ו-base64.",
      },
      hi: {
        name: "HMAC जनरेटर",
        description:
          "टेक्स्ट या फ़ाइल इनपुट के लिए HMAC (हैश-आधारित संदेश प्रमाणीकरण कोड) हस्ताक्षर उत्पन्न करें। SHA-1, SHA-256, SHA-384, और SHA-512 एल्गोरिदम का समर्थन करता है जिसमें हेक्स और base64 आउटपुट प्रारूप हैं।",
      },
      id: {
        name: "Generator HMAC",
        description:
          "Hasilkan tanda tangan HMAC (Hash-based Message Authentication Code) untuk teks atau file. Mendukung algoritma SHA-1, SHA-256, SHA-384, dan SHA-512 dengan format output heksadesimal dan base64.",
      },
      it: {
        name: "Generatore HMAC",
        description:
          "Genera firme HMAC (Hash-based Message Authentication Code) per testo o file. Supporta algoritmi SHA-1, SHA-256, SHA-384 e SHA-512 con formati di output esadecimale e base64.",
      },
      ja: {
        name: "HMAC ジェネレーター",
        description:
          "テキストまたはファイル入力の HMAC（ハッシュベースメッセージ認証コード）署名を生成します。SHA-1、SHA-256、SHA-384、SHA-512 アルゴリズムをサポートし、16進数と base64 出力形式を提供します。",
      },
      ko: {
        name: "HMAC 생성기",
        description:
          "텍스트 또는 파일 입력에 대한 HMAC (해시 기반 메시지 인증 코드) 서명을 생성합니다. SHA-1, SHA-256, SHA-384, SHA-512 알고리즘을 지원하며 16진수 및 base64 출력 형식을 제공합니다.",
      },
      ms: {
        name: "Penjana HMAC",
        description:
          "Jana tandatangan HMAC (Kod Pengesahan Mesej berasaskan Hash) untuk teks atau fail. Menyokong algoritma SHA-1, SHA-256, SHA-384, dan SHA-512 dengan format output heksadesimal dan base64.",
      },
      nl: {
        name: "HMAC Generator",
        description:
          "Genereer HMAC (Hash-based Message Authentication Code) handtekeningen voor tekst of bestanden. Ondersteunt SHA-1, SHA-256, SHA-384 en SHA-512 algoritmen met hexadecimale en base64 uitvoerformaten.",
      },
      no: {
        name: "HMAC-generator",
        description:
          "Generer HMAC (Hash-based Message Authentication Code) signaturer for tekst eller filer. Støtter SHA-1, SHA-256, SHA-384 og SHA-512 algoritmer med heksadesimale og base64 utdataformater.",
      },
      pl: {
        name: "Generator HMAC",
        description:
          "Generuj podpisy HMAC (kod uwierzytelniania wiadomości oparty na hashu) dla tekstu lub plików. Obsługuje algorytmy SHA-1, SHA-256, SHA-384 i SHA-512 z formatami wyjściowymi szesnastkowymi i base64.",
      },
      pt: {
        name: "Gerador HMAC",
        description:
          "Gere assinaturas HMAC (Código de Autenticação de Mensagem baseado em Hash) para texto ou arquivos. Suporta algoritmos SHA-1, SHA-256, SHA-384 e SHA-512 com formatos de saída hexadecimal e base64.",
      },
      ru: {
        name: "Генератор HMAC",
        description:
          "Генерируйте HMAC (код аутентификации сообщений на основе хеша) подписи для текста или файлов. Поддерживает алгоритмы SHA-1, SHA-256, SHA-384 и SHA-512 с выводом в шестнадцатеричном формате и base64.",
      },
      sv: {
        name: "HMAC-generator",
        description:
          "Generera HMAC (Hash-based Message Authentication Code) signaturer för text eller filer. Stöder SHA-1, SHA-256, SHA-384 och SHA-512 algoritmer med hexadecimala och base64 utdataformat.",
      },
      th: {
        name: "เครื่องมือสร้าง HMAC",
        description:
          "สร้างลายเซ็น HMAC (รหัสการตรวจสอบความถูกต้องของข้อความที่ใช้แฮช) สำหรับข้อความหรือไฟล์ รองรับอัลกอริทึม SHA-1, SHA-256, SHA-384 และ SHA-512 พร้อมรูปแบบเอาต์พุตเลขฐานสิบหกและ base64",
      },
      tr: {
        name: "HMAC Oluşturucu",
        description:
          "Metin veya dosya girişi için HMAC (Hash Tabanlı Mesaj Kimlik Doğrulama Kodu) imzaları oluşturun. SHA-1, SHA-256, SHA-384 ve SHA-512 algoritmalarını destekler ve onaltılık ve base64 çıktı formatları sunar.",
      },
      vi: {
        name: "Trình tạo HMAC",
        description:
          "Tạo chữ ký HMAC (Mã xác thực thông điệp dựa trên Hash) cho văn bản hoặc tệp đầu vào. Hỗ trợ các thuật toán SHA-1, SHA-256, SHA-384 và SHA-512 với định dạng đầu ra thập lục phân và base64.",
      },
      "zh-CN": {
        name: "HMAC 生成器",
        description:
          "为文本或文件生成 HMAC（基于哈希的消息认证码）签名。支持 SHA-1、SHA-256、SHA-384 和 SHA-512 算法，提供十六进制和 Base64 输出格式。",
      },
      "zh-TW": {
        name: "HMAC 產生器",
        description:
          "為文字或檔案產生 HMAC（基於雜湊的訊息驗證碼）簽章。支援 SHA-1、SHA-256、SHA-384 和 SHA-512 演算法，提供十六進位和 Base64 輸出格式。",
      },
    },
  },
  {
    slug: "html-color-names",
    category: "web",
    icon: "image",
    tags: ["html", "css", "color", "named-color", "hex", "rgb", "reference"],
    locales: {
      ar: {
        name: "أسماء ألوان HTML",
        description:
          "استعرض وابحث عن أكثر من 140 لون مسمى CSS/HTML مع قيم HEX و RGB",
      },
      de: {
        name: "HTML-Farbnamen",
        description:
          "Durchsuchen und suchen Sie über 140 CSS/HTML-benannte Farben mit HEX- und RGB-Werten",
      },
      en: {
        name: "HTML Color Names",
        description:
          "Browse and search 140+ CSS/HTML named colors with HEX and RGB values",
      },
      es: {
        name: "Nombres de colores HTML",
        description:
          "Examina y busca más de 140 colores nombrados CSS/HTML con valores HEX y RGB",
      },
      fr: {
        name: "Noms de couleurs HTML",
        description:
          "Parcourez et recherchez plus de 140 couleurs nommées CSS/HTML avec des valeurs HEX et RGB",
      },
      he: {
        name: "שמות צבעים HTML",
        description:
          "עיין וחפש יותר מ-140 צבעים שנקראו CSS/HTML עם ערכי HEX ו-RGB",
      },
      hi: {
        name: "HTML रंग नाम",
        description:
          "140+ CSS/HTML नामित रंगों को ब्राउज़ करें और खोजें जिनमें HEX और RGB मान हों",
      },
      id: {
        name: "Nama Warna HTML",
        description:
          "Jelajahi dan cari lebih dari 140 warna bernama CSS/HTML dengan nilai HEX dan RGB",
      },
      it: {
        name: "Nomi colori HTML",
        description:
          "Sfoglia e cerca oltre 140 colori denominati CSS/HTML con valori HEX e RGB",
      },
      ja: {
        name: "HTML 色名",
        description:
          "140+ の CSS/HTML 名前付き色を検索して閲覧し、HEX および RGB 値を確認",
      },
      ko: {
        name: "HTML 색 이름",
        description:
          "140+ 개의 CSS/HTML 명명된 색을 검색하고 HEX 및 RGB 값 확인",
      },
      ms: {
        name: "Nama-nama Warna HTML",
        description:
          "Layari dan cari lebih dari 140 warna bernama CSS/HTML dengan nilai HEX dan RGB",
      },
      nl: {
        name: "HTML-kleurnamen",
        description:
          "Blader door en zoek meer dan 140 CSS/HTML-gekleurde namen met HEX- en RGB-waarden",
      },
      no: {
        name: "HTML-fargenavn",
        description:
          "Bla gjennom og søk etter over 140 CSS/HTML-navngivne farger med HEX- og RGB-verdier",
      },
      pl: {
        name: "Nazwy kolorów HTML",
        description:
          "Przeglądaj i wyszukuj ponad 140 nazwanych kolorów CSS/HTML z wartościami HEX i RGB",
      },
      pt: {
        name: "Nomes de cores HTML",
        description:
          "Procure e explore mais de 140 cores nomeadas CSS/HTML com valores HEX e RGB",
      },
      ru: {
        name: "Названия цветов HTML",
        description:
          "Просмотрите и найдите более 140 именованных цветов CSS/HTML с шестнадцатеричными и RGB значениями",
      },
      sv: {
        name: "HTML-färgnamn",
        description:
          "Bläddra och sök över 140 CSS/HTML-namngivna färger med HEX- och RGB-värden",
      },
      th: {
        name: "ชื่อสีของ HTML",
        description: "เรียกดูและค้นหาสี CSS/HTML ที่มีชื่อกว่า 140 สีพร้อมค่า HEX และ RGB",
      },
      tr: {
        name: "HTML Renk Adları",
        description:
          "HEX ve RGB değerleri ile 140+ CSS/HTML adlandırılmış renklere göz atın ve arayın",
      },
      vi: {
        name: "Tên màu HTML",
        description:
          "Duyệt và tìm kiếm hơn 140 màu được đặt tên CSS/HTML với giá trị HEX và RGB",
      },
      "zh-CN": {
        name: "HTML 颜色名称",
        description:
          "浏览和搜索 140+ 个 CSS/HTML 命名颜色及其十六进制和 RGB 值",
      },
      "zh-TW": {
        name: "HTML 顏色名稱",
        description:
          "瀏覽和搜尋 140+ 個 CSS/HTML 命名顏色及其十六進制和 RGB 值",
      },
    },
  },
  {
    slug: "html-entity-encoder-decoder",
    category: "web",
    icon: "globe",
    tags: ["html", "entity", "encoding", "decoding", "escape", "web"],
    locales: {
      ar: {
        name: "مشفر ومفكك كيانات HTML",
        description:
          "تشفير وفك تشفير كيانات HTML. تحويل الأحرف الخاصة إلى كيانات HTML مسماة أو عشرية أو سداسية عشرية والعكس",
      },
      de: {
        name: "HTML-Entitäten Encoder & Decoder",
        description:
          "Kodiert und dekodiert HTML-Entitäten. Konvertiert Sonderzeichen in benannte, dezimale oder hexadezimale HTML-Entitäten und umgekehrt",
      },
      en: {
        name: "HTML Entity Encoder & Decoder",
        description:
          "Encode and decode HTML entities. Convert special characters to named, decimal, or hexadecimal HTML entities and vice versa",
      },
      es: {
        name: "Codificador y Decodificador de Entidades HTML",
        description:
          "Codifica y decodifica entidades HTML. Convierte caracteres especiales a entidades HTML con nombre, decimales o hexadecimales y viceversa",
      },
      fr: {
        name: "Encodeur et Décodeur d'Entités HTML",
        description:
          "Encode et décode les entités HTML. Convertit les caractères spéciaux en entités HTML nommées, décimales ou hexadécimales et vice versa",
      },
      he: {
        name: "מקודד ומפענח ישויות HTML",
        description:
          "קידוד ופענוח ישויות HTML. המרת תווים מיוחדים לישויות HTML בשם, עשרוניות או הקסדצימליות ולהיפך",
      },
      hi: {
        name: "HTML एंटिटी एनकोडर और डिकोडर",
        description:
          "HTML एंटिटी को एनकोड और डिकोड करें। विशेष वर्णों को नामित, दशमलव या हेक्साडेसिमल HTML एंटिटी में बदलें और इसके विपरीत",
      },
      id: {
        name: "Encoder & Decoder Entitas HTML",
        description:
          "Encode dan decode entitas HTML. Konversi karakter khusus ke entitas HTML bernama, desimal, atau heksadesimal dan sebaliknya",
      },
      it: {
        name: "Codificatore e Decodificatore Entità HTML",
        description:
          "Codifica e decodifica entità HTML. Converte caratteri speciali in entità HTML con nome, decimali o esadecimali e viceversa",
      },
      ja: {
        name: "HTML エンティティ エンコーダ & デコーダ",
        description:
          "HTML エンティティのエンコードとデコード。特殊文字を名前付き、10 進数、または 16 進数の HTML エンティティに変換、またはその逆を行います",
      },
      ko: {
        name: "HTML 엔티티 인코더 & 디코더",
        description:
          "HTML 엔티티를 인코딩 및 디코딩합니다. 특수 문자를 이름, 10진수 또는 16진수 HTML 엔티티로 변환하거나 그 반대로 변환합니다",
      },
      ms: {
        name: "Pengekod & Penyahkod Entiti HTML",
        description:
          "Mengekod dan menyahkod entiti HTML. Tukar aksara khas kepada entiti HTML bernama, perpuluhan atau perenambelasan dan sebaliknya",
      },
      nl: {
        name: "HTML-entiteit Encoder & Decoder",
        description:
          "Codeer en decodeer HTML-entiteiten. Converteer speciale tekens naar benoemde, decimale of hexadecimale HTML-entiteiten en vice versa",
      },
      no: {
        name: "HTML-entitet Koder & Dekoder",
        description:
          "Kod og dekod HTML-entiteter. Konverter spesialtegn til navngitte, desimale eller heksadesimale HTML-entiteter og omvendt",
      },
      pl: {
        name: "Koder i Dekoder Encji HTML",
        description:
          "Koduj i dekoduj encje HTML. Konwertuj znaki specjalne na nazwane, dziesiętne lub szesnastkowe encje HTML i odwrotnie",
      },
      pt: {
        name: "Codificador e Decodificador de Entidades HTML",
        description:
          "Codifica e decodifica entidades HTML. Converte caracteres especiais em entidades HTML nomeadas, decimais ou hexadecimais e vice-versa",
      },
      ru: {
        name: "Кодировщик и декодировщик HTML-сущностей",
        description:
          "Кодирование и декодирование HTML-сущностей. Преобразование специальных символов в именованные, десятичные или шестнадцатеричные HTML-сущности и обратно",
      },
      sv: {
        name: "HTML-entitet Kodare & Avkodare",
        description:
          "Koda och avkoda HTML-entiteter. Konvertera specialtecken till namngivna, decimala eller hexadecimala HTML-entiteter och vice versa",
      },
      th: {
        name: "ตัวเข้ารหัสและถอดรหัส HTML Entity",
        description:
          "เข้ารหัสและถอดรหัส HTML entity แปลงอักขระพิเศษเป็น HTML entity แบบชื่อ ทศนิยม หรือเลขฐานสิบหก และในทางกลับกัน",
      },
      tr: {
        name: "HTML Varlık Kodlayıcı ve Çözücü",
        description:
          "HTML varlıklarını kodlayın ve çözün. Özel karakterleri adlandırılmış, ondalık veya onaltılık HTML varlıklarına dönüştürün veya tersini yapın",
      },
      vi: {
        name: "Bộ Mã Hóa & Giải Mã Thực Thể HTML",
        description:
          "Mã hóa và giải mã thực thể HTML. Chuyển đổi các ký tự đặc biệt thành thực thể HTML có tên, thập phân hoặc thập lục phân và ngược lại",
      },
      "zh-CN": {
        name: "HTML 实体编码 & 解码",
        description:
          "编码和解码 HTML 实体。将特殊字符转换为命名、十进制或十六进制 HTML 实体，或将实体解码为原始字符",
      },
      "zh-TW": {
        name: "HTML 實體編碼 & 解碼",
        description:
          "編碼和解碼 HTML 實體。將特殊字元轉換為命名、十進制或十六進制 HTML 實體，或將實體解碼為原始字元",
      },
    },
  },
  {
    slug: "html-to-markdown-converter",
    category: "text",
    icon: "file-text",
    tags: ["document", "html", "markdown", "converter"],
    locales: {
      ar: {
        name: "محول HTML إلى Markdown",
        description:
          "حوّل HTML الخام إلى Markdown مع أنماط قابلة للتعديل للعناوين والقوائم وكتل الشيفرة. الصق الوسوم أو استورد ملفًا، ثم انسخ النتيجة أو نزّلها.",
      },
      de: {
        name: "HTML-zu-Markdown-Konverter",
        description:
          "Wandle rohes HTML mit anpassbaren Stilen für Überschriften, Listen und Codeblöcke in Markdown um. Füge Markup ein oder importiere eine Datei und kopiere oder lade das Ergebnis herunter.",
      },
      en: {
        name: "HTML to Markdown Converter",
        description:
          "Convert raw HTML into Markdown with adjustable heading, list, and code block styles. Paste markup or import a file, then copy or download the result.",
      },
      es: {
        name: "Conversor de HTML a Markdown",
        description:
          "Convierte HTML sin procesar en Markdown con estilos ajustables de encabezados, listas y bloques de código. Pega el marcado o importa un archivo, y luego copia o descarga el resultado.",
      },
      fr: {
        name: "Convertisseur HTML vers Markdown",
        description:
          "Convertissez du HTML brut en Markdown avec des styles ajustables pour les titres, les listes et les blocs de code. Collez le balisage ou importez un fichier, puis copiez ou téléchargez le résultat.",
      },
      he: {
        name: "ממיר HTML ל-Markdown",
        description:
          "המר HTML גולמי ל-Markdown עם סגנונות הניתנים להתאמה לכותרות, רשימות ובלוקי קוד. הדביקו סימון או ייבאו קובץ, ואז העתיקו או הורידו את התוצאה.",
      },
      hi: {
        name: "HTML से Markdown कन्वर्टर",
        description:
          "समायोज्य हेडिंग, सूची और कोड ब्लॉक शैलियों के साथ कच्चे HTML को Markdown में बदलें। मार्कअप पेस्ट करें या फ़ाइल आयात करें, फिर परिणाम कॉपी या डाउनलोड करें।",
      },
      id: {
        name: "Konverter HTML ke Markdown",
        description:
          "Ubah HTML mentah menjadi Markdown dengan gaya judul, daftar, dan blok kode yang dapat disesuaikan. Tempel markup atau impor berkas, lalu salin atau unduh hasilnya.",
      },
      it: {
        name: "Convertitore da HTML a Markdown",
        description:
          "Converti HTML grezzo in Markdown con stili regolabili per titoli, elenchi e blocchi di codice. Incolla il markup o importa un file, poi copia o scarica il risultato.",
      },
      ja: {
        name: "HTML から Markdown への変換",
        description:
          "見出し、リスト、コードブロックの形式を調整しながら、生の HTML を Markdown に変換します。マークアップを貼り付けるかファイルを読み込み、結果をコピーまたはダウンロードできます。",
      },
      ko: {
        name: "HTML to Markdown 변환기",
        description:
          "제목, 목록, 코드 블록 스타일을 조정하면서 원시 HTML을 Markdown으로 변환합니다. 마크업을 붙여넣거나 파일을 가져온 뒤 결과를 복사하거나 다운로드하세요.",
      },
      ms: {
        name: "Penukar HTML ke Markdown",
        description:
          "Tukar HTML mentah kepada Markdown dengan gaya tajuk, senarai dan blok kod yang boleh dilaraskan. Tampal markup atau import fail, kemudian salin atau muat turun hasilnya.",
      },
      nl: {
        name: "HTML-naar-Markdown-converter",
        description:
          "Zet ruwe HTML om naar Markdown met instelbare stijlen voor koppen, lijsten en codeblokken. Plak de markup of importeer een bestand en kopieer of download daarna het resultaat.",
      },
      no: {
        name: "HTML til Markdown-konverter",
        description:
          "Konverter rå HTML til Markdown med justerbare stiler for overskrifter, lister og kodeblokker. Lim inn markup eller importer en fil, og kopier eller last ned resultatet.",
      },
      pl: {
        name: "Konwerter HTML do Markdown",
        description:
          "Konwertuj surowy HTML do Markdown z regulowanymi stylami nagłówków, list i bloków kodu. Wklej znacznik lub zaimportuj plik, a następnie skopiuj albo pobierz wynik.",
      },
      pt: {
        name: "Conversor de HTML para Markdown",
        description:
          "Converta HTML bruto em Markdown com estilos ajustáveis para títulos, listas e blocos de código. Cole a marcação ou importe um arquivo e depois copie ou baixe o resultado.",
      },
      ru: {
        name: "Конвертер HTML в Markdown",
        description:
          "Преобразуйте исходный HTML в Markdown с настраиваемыми стилями заголовков, списков и блоков кода. Вставьте разметку или импортируйте файл, затем скопируйте или скачайте результат.",
      },
      sv: {
        name: "HTML till Markdown-konverterare",
        description:
          "Konvertera rå HTML till Markdown med justerbara stilar för rubriker, listor och kodblock. Klistra in markeringen eller importera en fil och kopiera eller ladda sedan ner resultatet.",
      },
      th: {
        name: "ตัวแปลง HTML เป็น Markdown",
        description:
          "แปลง HTML แบบดิบเป็น Markdown พร้อมปรับรูปแบบหัวข้อ รายการ และบล็อกโค้ดได้ วางมาร์กอัปหรือนำเข้าไฟล์ แล้วคัดลอกหรือดาวน์โหลดผลลัพธ์",
      },
      tr: {
        name: "HTML'den Markdown'a Dönüştürücü",
        description:
          "Ham HTML'yi ayarlanabilir başlık, liste ve kod bloğu stilleriyle Markdown'a dönüştürün. İşaretlemeyi yapıştırın veya bir dosya içe aktarın, ardından sonucu kopyalayın ya da indirin.",
      },
      vi: {
        name: "Trình chuyển HTML sang Markdown",
        description:
          "Chuyển HTML thô sang Markdown với kiểu tiêu đề, danh sách và khối mã có thể điều chỉnh. Dán mã đánh dấu hoặc nhập tệp, rồi sao chép hoặc tải xuống kết quả.",
      },
      "zh-CN": {
        name: "HTML 转 Markdown 转换器",
        description:
          "使用可调的标题、列表和代码块样式，将原始 HTML 转为 Markdown。粘贴标记或导入文件，然后复制或下载结果。",
      },
      "zh-TW": {
        name: "HTML 轉 Markdown 轉換器",
        description:
          "使用可調整的標題、清單與程式碼區塊樣式，將原始 HTML 轉成 Markdown。貼上標記或匯入檔案，然後複製或下載結果。",
      },
    },
  },
  {
    slug: "http-status-code-lookup",
    category: "network",
    icon: "network",
    tags: ["http", "status", "code", "network", "reference"],
    locales: {
      ar: {
        name: "البحث عن رموز حالة HTTP",
        description: "البحث وتصفح رموز حالة HTTP ومعانيها",
      },
      de: {
        name: "HTTP-Statuscode-Suche",
        description:
          "HTTP-Statuscodes und ihre Bedeutungen suchen und durchsuchen",
      },
      en: {
        name: "HTTP Status Code Lookup",
        description: "Search and browse HTTP status codes and their meanings",
      },
      es: {
        name: "Consulta de Códigos de Estado HTTP",
        description:
          "Buscar y explorar códigos de estado HTTP y sus significados",
      },
      fr: {
        name: "Recherche de Codes de Statut HTTP",
        description:
          "Rechercher et parcourir les codes de statut HTTP et leurs significations",
      },
      he: {
        name: "חיפוש קוד סטטוס HTTP",
        description: "חפש ועיין בקודי סטטוס HTTP ומשמעויותיהם",
      },
      hi: {
        name: "HTTP स्थिति कोड खोज",
        description: "HTTP स्थिति कोड और उनके अर्थ खोजें और ब्राउज़ करें",
      },
      id: {
        name: "Pencarian Kode Status HTTP",
        description: "Cari dan jelajahi kode status HTTP dan artinya",
      },
      it: {
        name: "Ricerca Codici di Stato HTTP",
        description:
          "Cerca e sfoglia i codici di stato HTTP e i loro significati",
      },
      ja: {
        name: "HTTP ステータスコード検索",
        description: "HTTP ステータスコードとその意味を検索・閲覧",
      },
      ko: {
        name: "HTTP 상태 코드 조회",
        description: "HTTP 상태 코드와 그 의미 검색 및 탐색",
      },
      ms: {
        name: "Carian Kod Status HTTP",
        description: "Cari dan semak kod status HTTP dan maksudnya",
      },
      nl: {
        name: "HTTP Statuscode Opzoeken",
        description: "Zoek en blader door HTTP statuscodes en hun betekenissen",
      },
      no: {
        name: "HTTP Statuskodesok",
        description: "Sok og bla gjennom HTTP statuskoder og deres betydninger",
      },
      pl: {
        name: "Wyszukiwanie Kodów Statusu HTTP",
        description: "Wyszukuj i przeglądaj kody statusu HTTP i ich znaczenia",
      },
      pt: {
        name: "Consulta de Códigos de Status HTTP",
        description:
          "Pesquisar e navegar por códigos de status HTTP e seus significados",
      },
      ru: {
        name: "Поиск HTTP Кодов Состояния",
        description: "Поиск и просмотр HTTP кодов состояния и их значений",
      },
      sv: {
        name: "HTTP Statuskodsökning",
        description:
          "Sök och bläddra bland HTTP statuskoder och deras betydelser",
      },
      th: {
        name: "ค้นหารหัสสถานะ HTTP",
        description: "ค้นหาและเรียกดูรหัสสถานะ HTTP และความหมาย",
      },
      tr: {
        name: "HTTP Durum Kodu Arama",
        description: "HTTP durum kodlarını ve anlamlarını arayın ve göz atın",
      },
      vi: {
        name: "Tra Cứu Mã Trạng Thái HTTP",
        description:
          "Tìm kiếm và duyệt các mã trạng thái HTTP và ý nghĩa của chúng",
      },
      "zh-CN": {
        name: "HTTP 状态码查询",
        description: "搜索和浏览 HTTP 状态码及其含义",
      },
      "zh-TW": {
        name: "HTTP 狀態碼查詢",
        description: "搜尋和瀏覽 HTTP 狀態碼及其含義",
      },
    },
  },
  {
    slug: "iban-validator",
    category: "text",
    icon: "file-text",
    tags: ["iban", "validator", "bank", "finance", "payment"],
    locales: {
      ar: {
        name: "مدقق IBAN",
        description: "يتحقق من IBAN بطول البلد والتنسيق والمجموع الاختباري.",
      },
      de: {
        name: "IBAN-Validator",
        description: "Validiert IBANs mit Länder-Länge, Format und Prüfsumme.",
      },
      en: {
        name: "IBAN Validator",
        description:
          "Validate IBAN numbers with country length, format, and checksum checks.",
      },
      es: {
        name: "Validador de IBAN",
        description:
          "Valida números IBAN con longitud de país, formato y checksum.",
      },
      fr: {
        name: "Validateur d'IBAN",
        description:
          "Valide les IBAN avec la longueur du pays, le format et la somme de contrôle.",
      },
      he: {
        name: "מאמת IBAN",
        description: "מאמת IBAN לפי אורך מדינה, פורמט וסכום ביקורת.",
      },
      hi: {
        name: "IBAN सत्यापनकर्ता",
        description: "देश की लंबाई, प्रारूप और चेकसम के साथ IBAN सत्यापित करें।",
      },
      id: {
        name: "Validator IBAN",
        description:
          "Memvalidasi IBAN berdasarkan panjang negara, format, dan checksum.",
      },
      it: {
        name: "Validatore IBAN",
        description:
          "Valida gli IBAN con lunghezza del paese, formato e checksum.",
      },
      ja: {
        name: "IBAN 検証",
        description: "国別の長さ、形式、チェックサムで IBAN を検証します。",
      },
      ko: {
        name: "IBAN 검증기",
        description: "국가별 길이, 형식, 체크섬으로 IBAN을 검증합니다.",
      },
      ms: {
        name: "Pengesah IBAN",
        description:
          "Mengesahkan IBAN berdasarkan panjang negara, format dan checksum.",
      },
      nl: {
        name: "IBAN-validator",
        description: "Valideert IBAN's met landlengte, formaat en controlesom.",
      },
      no: {
        name: "IBAN-validerer",
        description: "Validerer IBAN med landlengde, format og kontrollsum.",
      },
      pl: {
        name: "Walidator IBAN",
        description:
          "Weryfikuje IBAN pod kątem długości kraju, formatu i sumy kontrolnej.",
      },
      pt: {
        name: "Validador de IBAN",
        description:
          "Valida IBANs com comprimento do país, formato e checksum.",
      },
      ru: {
        name: "Валидатор IBAN",
        description:
          "Проверяет IBAN по длине страны, формату и контрольной сумме.",
      },
      sv: {
        name: "IBAN-validerare",
        description: "Validerar IBAN med landlängd, format och kontrollsumma.",
      },
      th: {
        name: "ตัวตรวจสอบ IBAN",
        description: "ตรวจสอบ IBAN ตามความยาวประเทศ รูปแบบ และผลรวมตรวจสอบ",
      },
      tr: {
        name: "IBAN Doğrulayıcı",
        description:
          "IBAN'ları ülke uzunluğu, biçim ve sağlama toplamı ile doğrular.",
      },
      vi: {
        name: "Trình xác thực IBAN",
        description:
          "Xác thực IBAN theo độ dài quốc gia, định dạng và checksum.",
      },
      "zh-CN": {
        name: "IBAN 验证器",
        description: "验证 IBAN 号码，检查国家长度、格式和校验和。",
      },
      "zh-TW": {
        name: "IBAN 驗證器",
        description: "驗證 IBAN 號碼，檢查國家長度、格式和校驗和。",
      },
    },
  },
  {
    slug: "ical-event-generator",
    category: "time",
    icon: "clock3",
    tags: ["calendar", "event", "generator", "ical", "ics", "reminder", "time"],
    locales: {
      ar: {
        name: "مولد أحداث iCal",
        description:
          "أنشئ أحداث تقويم .ics مع المناطق الزمنية وقواعد التكرار والتنبيهات.",
      },
      de: {
        name: "iCal-Ereignisgenerator",
        description:
          "Erstellen Sie .ics-Kalendereignisse mit Zeitzonen, Wiederholungsregeln und Erinnerungen.",
      },
      en: {
        name: "iCal Event Generator",
        description:
          "Create .ics calendar events with time zones, recurrence rules, and reminders.",
      },
      es: {
        name: "Generador de eventos iCal",
        description:
          "Crea eventos de calendario .ics con zonas horarias, reglas de recurrencia y recordatorios.",
      },
      fr: {
        name: "Générateur d'événements iCal",
        description:
          "Créez des événements de calendrier .ics avec fuseaux horaires, règles de récurrence et rappels.",
      },
      he: {
        name: "מחולל אירועי iCal",
        description:
          "צרו אירועי יומן .ics עם אזורי זמן, כללי חזרתיות ותזכורות.",
      },
      hi: {
        name: "iCal इवेंट जेनरेटर",
        description:
          "समय क्षेत्र, पुनरावृत्ति नियम और रिमाइंडर के साथ .ics कैलेंडर इवेंट बनाएं।",
      },
      id: {
        name: "Generator acara iCal",
        description:
          "Buat acara kalender .ics dengan zona waktu, aturan pengulangan, dan pengingat.",
      },
      it: {
        name: "Generatore di eventi iCal",
        description:
          "Crea eventi calendario .ics con fusi orari, regole di ricorrenza e promemoria.",
      },
      ja: {
        name: "iCal イベント生成ツール",
        description:
          "タイムゾーン、繰り返しルール、リマインダー付きの .ics イベントを作成します。",
      },
      ko: {
        name: "iCal 이벤트 생성기",
        description:
          "시간대, 반복 규칙, 알림이 포함된 .ics 일정 이벤트를 생성합니다.",
      },
      ms: {
        name: "Penjana acara iCal",
        description:
          "Cipta acara kalendar .ics dengan zon masa, peraturan ulangan dan peringatan.",
      },
      nl: {
        name: "iCal-evenementgenerator",
        description:
          "Maak .ics-agenda-items met tijdzones, herhalingsregels en herinneringen.",
      },
      no: {
        name: "iCal-hendelsesgenerator",
        description:
          "Lag .ics-kalenderhendelser med tidssoner, gjentakelsesregler og påminnelser.",
      },
      pl: {
        name: "Generator wydarzeń iCal",
        description:
          "Twórz wydarzenia kalendarza .ics ze strefami czasowymi, regułami cykliczności i przypomnieniami.",
      },
      pt: {
        name: "Gerador de eventos iCal",
        description:
          "Crie eventos de calendário .ics com fusos horários, regras de recorrência e lembretes.",
      },
      ru: {
        name: "Генератор событий iCal",
        description:
          "Создавайте события календаря .ics с часовыми поясами, правилами повторения и напоминаниями.",
      },
      sv: {
        name: "iCal-händelsegenerator",
        description:
          "Skapa .ics-kalenderhändelser med tidszoner, upprepningsregler och påminnelser.",
      },
      th: {
        name: "ตัวสร้างอีเวนต์ iCal",
        description: "สร้างอีเวนต์ปฏิทิน .ics พร้อมเขตเวลา กฎการทำซ้ำ และการเตือน",
      },
      tr: {
        name: "iCal Etkinlik Oluşturucu",
        description:
          "Saat dilimleri, yineleme kuralları ve hatırlatıcılarla .ics takvim etkinlikleri oluşturun.",
      },
      vi: {
        name: "Trình tạo sự kiện iCal",
        description:
          "Tạo sự kiện lịch .ics với múi giờ, quy tắc lặp lại và nhắc nhở.",
      },
      "zh-CN": {
        name: "iCal 事件生成器",
        description: "创建包含时区、重复规则和提醒的 .ics 日历事件。",
      },
      "zh-TW": {
        name: "iCal 事件產生器",
        description: "建立包含時區、重複規則與提醒的 .ics 行事曆事件。",
      },
    },
  },
  {
    slug: "image-metadata-cleaner",
    category: "image",
    icon: "image",
    tags: [
      "image",
      "metadata",
      "exif",
      "privacy",
      "xmp",
      "iptc",
      "icc",
      "cleaner",
      "strip",
    ],
    locales: {
      ar: {
        name: "منظف بيانات الصور (EXIF)",
        description:
          "يزيل بيانات EXIF/XMP/IPTC/ICC من الصور بدون إعادة ترميز. يحافظ على التنسيق الأصلي ويعمل دون اتصال.",
      },
      de: {
        name: "Bildmetadaten-Bereiniger (EXIF)",
        description:
          "Entfernt EXIF/XMP/IPTC/ICC-Metadaten aus Bildern ohne Neukodierung. Behält das Originalformat und funktioniert offline.",
      },
      en: {
        name: "Image Metadata Cleaner (EXIF)",
        description:
          "Remove EXIF/XMP/IPTC/ICC metadata from images without re-encoding. Keeps the original format and works offline.",
      },
      es: {
        name: "Limpiador de Metadatos de Imagen (EXIF)",
        description:
          "Elimina metadatos EXIF/XMP/IPTC/ICC de imágenes sin recodificar. Mantiene el formato original y funciona sin conexión.",
      },
      fr: {
        name: "Nettoyeur de Métadonnées d'Image (EXIF)",
        description:
          "Supprime les métadonnées EXIF/XMP/IPTC/ICC des images sans réencodage. Conserve le format original et fonctionne hors ligne.",
      },
      he: {
        name: "מנקה מטא-נתונים לתמונות (EXIF)",
        description:
          "מסיר מטא-נתונים מסוג EXIF/XMP/IPTC/ICC מתמונות ללא קידוד מחדש. שומר על הפורמט המקורי ופועל במצב לא מקוון.",
      },
      hi: {
        name: "छवि मेटाडेटा क्लीनर (EXIF)",
        description:
          "बिना पुनः एन्कोड किए छवियों से EXIF/XMP/IPTC/ICC मेटाडेटा हटाता है। मूल प्रारूप बनाए रखता है और ऑफलाइन चलता है।",
      },
      id: {
        name: "Pembersih Metadata Gambar (EXIF)",
        description:
          "Menghapus metadata EXIF/XMP/IPTC/ICC dari gambar tanpa enkode ulang. Menjaga format asli dan bekerja offline.",
      },
      it: {
        name: "Pulitore Metadati Immagini (EXIF)",
        description:
          "Rimuove i metadati EXIF/XMP/IPTC/ICC dalle immagini senza ricodifica. Mantiene il formato originale e funziona offline.",
      },
      ja: {
        name: "画像メタデータクリーナー（EXIF）",
        description:
          "再エンコードせずに画像の EXIF/XMP/IPTC/ICC メタデータを削除。元の形式を保持しオフラインで動作。",
      },
      ko: {
        name: "이미지 메타데이터 클리너 (EXIF)",
        description:
          "재인코딩 없이 이미지의 EXIF/XMP/IPTC/ICC 메타데이터를 제거합니다. 원본 형식을 유지하고 오프라인에서 작동합니다.",
      },
      ms: {
        name: "Pembersih Metadata Imej (EXIF)",
        description:
          "Buang metadata EXIF/XMP/IPTC/ICC daripada imej tanpa pengekodan semula. Kekalkan format asal dan berfungsi di luar talian.",
      },
      nl: {
        name: "Afbeeldingsmetadata-opschoner (EXIF)",
        description:
          "Verwijdert EXIF/XMP/IPTC/ICC-metadata uit afbeeldingen zonder hercodering. Behoudt het originele formaat en werkt offline.",
      },
      no: {
        name: "Bilde-metadata-renser (EXIF)",
        description:
          "Fjerner EXIF/XMP/IPTC/ICC-metadata fra bilder uten omkoding. Beholder originalformatet og fungerer offline.",
      },
      pl: {
        name: "Czyściciel metadanych obrazu (EXIF)",
        description:
          "Usuwa metadane EXIF/XMP/IPTC/ICC z obrazów bez ponownego kodowania. Zachowuje oryginalny format i działa offline.",
      },
      pt: {
        name: "Limpador de Metadados de Imagem (EXIF)",
        description:
          "Remove metadados EXIF/XMP/IPTC/ICC de imagens sem recodificar. Mantém o formato original e funciona offline.",
      },
      ru: {
        name: "Очистка метаданных изображений (EXIF)",
        description:
          "Удаляет метаданные EXIF/XMP/IPTC/ICC из изображений без перекодирования. Сохраняет исходный формат и работает офлайн.",
      },
      sv: {
        name: "Bildmetadata-rensare (EXIF)",
        description:
          "Tar bort EXIF/XMP/IPTC/ICC-metadata från bilder utan omkodning. Behåller originalformatet och fungerar offline.",
      },
      th: {
        name: "ตัวล้างข้อมูลเมตาของภาพ (EXIF)",
        description:
          "ลบเมตาดาตา EXIF/XMP/IPTC/ICC จากภาพโดยไม่ต้องเข้ารหัสใหม่ คงรูปแบบเดิมและทำงานแบบออฟไลน์",
      },
      tr: {
        name: "Görüntü Meta Verisi Temizleyici (EXIF)",
        description:
          "Görüntülerden EXIF/XMP/IPTC/ICC meta verilerini yeniden kodlama olmadan kaldırır. Orijinal formatı korur ve çevrimdışı çalışır.",
      },
      vi: {
        name: "Trình dọn siêu dữ liệu ảnh (EXIF)",
        description:
          "Xóa siêu dữ liệu EXIF/XMP/IPTC/ICC khỏi ảnh mà không cần mã hóa lại. Giữ nguyên định dạng và hoạt động ngoại tuyến.",
      },
      "zh-CN": {
        name: "图片元数据清理器（EXIF）",
        description:
          "无需重新编码，移除图片中的 EXIF/XMP/IPTC/ICC 等元数据，保留原始格式并离线运行。",
      },
      "zh-TW": {
        name: "圖片元資料清理器（EXIF）",
        description:
          "無需重新編碼，移除圖片中的 EXIF/XMP/IPTC/ICC 等元資料，保留原始格式並離線運行。",
      },
    },
  },
  {
    slug: "image-palette-extractor",
    category: "image",
    icon: "image",
    tags: [
      "image",
      "palette",
      "color",
      "extractor",
      "dominant",
      "css",
      "design",
    ],
    locales: {
      ar: {
        name: "مستخرج لوحات ألوان الصور",
        description:
          "استخرج الألوان السائدة من الصور وصدّر اللوحات كقوائم HEX أو متغيرات CSS أو JSON.",
      },
      de: {
        name: "Bildpaletten-Extraktor",
        description:
          "Extrahiere dominante Farben aus Bildern und exportiere Paletten als HEX, CSS-Variablen oder JSON.",
      },
      en: {
        name: "Image Palette Extractor",
        description:
          "Extract dominant colors from images and export palettes as HEX, CSS variables, or JSON.",
      },
      es: {
        name: "Extractor de paletas de imágenes",
        description:
          "Extrae colores dominantes de imágenes y exporta paletas como HEX, variables CSS o JSON.",
      },
      fr: {
        name: "Image Palette Extractor",
        description:
          "Extrayez les couleurs dominantes d'images et exportez les palettes au format HEX, variables CSS ou JSON.",
      },
      he: {
        name: "מחלץ פלטות מתמונות",
        description:
          "חלץ צבעים דומיננטיים מתמונות וייצא פלטות כ‑HEX, כמשתני CSS או כ‑JSON.",
      },
      hi: {
        name: "Image Palette Extractor",
        description:
          "इमेज से प्रमुख रंग निकालें और पैलेट को HEX, CSS variables या JSON के रूप में निर्यात करें।",
      },
      id: {
        name: "Ekstraktor Palet Gambar",
        description:
          "Ekstrak warna dominan dari gambar dan ekspor palet sebagai HEX, variabel CSS, atau JSON.",
      },
      it: {
        name: "Estrattore di palette da immagini",
        description:
          "Estrai i colori dominanti dalle immagini ed esporta le palette come HEX, variabili CSS o JSON.",
      },
      ja: {
        name: "Image Palette Extractor",
        description:
          "画像から主要な色を抽出し、パレットをHEX、CSS変数、JSONとしてエクスポートします。",
      },
      ko: {
        name: "이미지 팔레트 추출기",
        description:
          "이미지에서 주요 색상을 추출하고 팔레트를 HEX, CSS 변수 또는 JSON으로 내보내세요.",
      },
      ms: {
        name: "Pengekstrak Palet Imej",
        description:
          "Ekstrak warna dominan daripada imej dan eksport palet sebagai HEX, pemboleh ubah CSS, atau JSON.",
      },
      nl: {
        name: "Image Palette Extractor",
        description:
          "Haal dominante kleuren uit afbeeldingen en exporteer paletten als HEX, CSS-variabelen of JSON.",
      },
      no: {
        name: "Bildepalett-uttrekker",
        description:
          "Hent dominerende farger fra bilder og eksporter paletter som HEX, CSS-variabler eller JSON.",
      },
      pl: {
        name: "Image Palette Extractor",
        description:
          "Wyodrębniaj dominujące kolory z obrazów i eksportuj palety jako HEX, zmienne CSS lub JSON.",
      },
      pt: {
        name: "Extrator de paleta de imagens",
        description:
          "Extraia cores dominantes de imagens e exporte paletas como HEX, variáveis CSS ou JSON.",
      },
      ru: {
        name: "Извлечение палитры из изображения",
        description:
          "Извлекайте доминирующие цвета из изображений и экспортируйте палитры как HEX, переменные CSS или JSON.",
      },
      sv: {
        name: "Image Palette Extractor",
        description:
          "Extrahera dominerande färger från bilder och exportera paletter som HEX, CSS-variabler eller JSON.",
      },
      th: {
        name: "ตัวดึงพาเล็ตสีจากรูปภาพ",
        description: "ดึงสีหลักจากรูปภาพและส่งออกพาเล็ตเป็น HEX, ตัวแปร CSS หรือ JSON",
      },
      tr: {
        name: "Image Palette Extractor",
        description:
          "Görsellerden baskın renkleri çıkarın ve paletleri HEX, CSS değişkenleri veya JSON olarak dışa aktarın.",
      },
      vi: {
        name: "Image Palette Extractor",
        description:
          "Trích xuất các màu chủ đạo từ hình ảnh và xuất bảng màu dưới dạng HEX, biến CSS hoặc JSON.",
      },
      "zh-CN": {
        name: "图像调色板提取器",
        description:
          "从图像中提取主色，并将调色板导出为 HEX、CSS 变量或 JSON。",
      },
      "zh-TW": {
        name: "圖片調色盤擷取器",
        description:
          "從圖片擷取主要色彩，並將調色盤匯出為 HEX、CSS 變數或 JSON。",
      },
    },
  },
  {
    slug: "image-resizer",
    category: "image",
    icon: "image",
    tags: ["image", "resize", "scale", "photo", "export"],
    locales: {
      ar: {
        name: "أداة تغيير حجم الصور",
        description:
          "غيّر أبعاد الصور مباشرة في متصفحك وصدّر النتيجة بصيغة PNG أو JPEG أو WebP.",
      },
      de: {
        name: "Bildgrößenänderung",
        description:
          "Ändere Bildabmessungen direkt im Browser und exportiere das Ergebnis als PNG, JPEG oder WebP.",
      },
      en: {
        name: "Image Resizer",
        description:
          "Resize image dimensions directly in your browser and export the result as PNG, JPEG, or WebP.",
      },
      es: {
        name: "Redimensionador de imágenes",
        description:
          "Cambia las dimensiones de las imágenes directamente en tu navegador y exporta el resultado como PNG, JPEG o WebP.",
      },
      fr: {
        name: "Redimensionneur d'images",
        description:
          "Redimensionnez les images directement dans votre navigateur et exportez le résultat en PNG, JPEG ou WebP.",
      },
      he: {
        name: "כלי שינוי גודל תמונות",
        description:
          "שנה את ממדי התמונות ישירות בדפדפן שלך וייצא את התוצאה כ-PNG, JPEG או WebP.",
      },
      hi: {
        name: "इमेज रिसाइज़र",
        description:
          "अपने ब्राउज़र में सीधे इमेज के आयाम बदलें और परिणाम को PNG, JPEG या WebP के रूप में निर्यात करें।",
      },
      id: {
        name: "Pengubah Ukuran Gambar",
        description:
          "Ubah dimensi gambar langsung di peramban Anda dan ekspor hasilnya sebagai PNG, JPEG, atau WebP.",
      },
      it: {
        name: "Ridimensionatore di immagini",
        description:
          "Ridimensiona le immagini direttamente nel browser ed esporta il risultato come PNG, JPEG o WebP.",
      },
      ja: {
        name: "画像リサイザー",
        description:
          "ブラウザ上で直接画像のサイズを変更し、結果を PNG、JPEG、または WebP としてエクスポートします。",
      },
      ko: {
        name: "이미지 리사이저",
        description:
          "브라우저에서 직접 이미지 크기를 조정하고 결과를 PNG, JPEG 또는 WebP로 내보냅니다.",
      },
      ms: {
        name: "Pengubah Saiz Imej",
        description:
          "Ubah dimensi imej terus dalam pelayar anda dan eksport hasilnya sebagai PNG, JPEG atau WebP.",
      },
      nl: {
        name: "Afbeelding verkleiner",
        description:
          "Wijzig afbeeldingsafmetingen rechtstreeks in je browser en exporteer het resultaat als PNG, JPEG of WebP.",
      },
      no: {
        name: "Bildestørrelsesendrer",
        description:
          "Endre bildestørrelser direkte i nettleseren din og eksporter resultatet som PNG, JPEG eller WebP.",
      },
      pl: {
        name: "Zmiana rozmiaru obrazów",
        description:
          "Zmieniaj wymiary obrazów bezpośrednio w przeglądarce i eksportuj wynik jako PNG, JPEG lub WebP.",
      },
      pt: {
        name: "Redimensionador de imagens",
        description:
          "Redimensione imagens diretamente no navegador e exporte o resultado como PNG, JPEG ou WebP.",
      },
      ru: {
        name: "Изменение размера изображений",
        description:
          "Изменяйте размеры изображений прямо в браузере и экспортируйте результат в PNG, JPEG или WebP.",
      },
      sv: {
        name: "Bildstorleksändrare",
        description:
          "Ändra bildstorlek direkt i webbläsaren och exportera resultatet som PNG, JPEG eller WebP.",
      },
      th: {
        name: "เครื่องมือปรับขนาดรูปภาพ",
        description:
          "ปรับขนาดรูปภาพได้โดยตรงในเบราว์เซอร์ของคุณและส่งออกผลลัพธ์เป็น PNG, JPEG หรือ WebP",
      },
      tr: {
        name: "Görüntü Yeniden Boyutlandırıcı",
        description:
          "Görüntü boyutlarını doğrudan tarayıcınızda değiştirin ve sonucu PNG, JPEG veya WebP olarak dışa aktarın.",
      },
      vi: {
        name: "Công cụ thay đổi kích thước ảnh",
        description:
          "Thay đổi kích thước ảnh trực tiếp trong trình duyệt và xuất kết quả dưới dạng PNG, JPEG hoặc WebP.",
      },
      "zh-CN": {
        name: "图片尺寸缩放",
        description: "直接在浏览器中缩放图片尺寸，并导出为 PNG、JPEG 或 WebP。",
      },
      "zh-TW": {
        name: "圖片尺寸調整器",
        description:
          "直接在瀏覽器中調整圖片尺寸,並將結果匯出為 PNG、JPEG 或 WebP。",
      },
    },
  },
  {
    slug: "image-to-ico",
    category: "image",
    icon: "image",
    tags: ["image", "ico", "favicon", "icon", "converter"],
    locales: {
      ar: {
        name: "محول الصور إلى ICO",
        description:
          "حوّل الصور إلى ملفات ICO للأيقونات المفضلة وأيقونات التطبيقات.",
      },
      de: {
        name: "Bild-zu-ICO-Konverter",
        description:
          "Konvertieren Sie Bilder in ICO-Dateien für Favicons und App-Symbole.",
      },
      en: {
        name: "Image to ICO Converter",
        description:
          "Convert images into ICO files for favicons and app icons.",
      },
      es: {
        name: "Convertidor de imagen a ICO",
        description:
          "Convierte imágenes en archivos ICO para favicons e iconos de apps.",
      },
      fr: {
        name: "Convertisseur d'image en ICO",
        description:
          "Convertissez des images en fichiers ICO pour les favicons et les icônes d'applications.",
      },
      he: {
        name: "ממיר תמונה ל-ICO",
        description: "המר תמונות לקבצי ICO עבור פייביקונים ואייקוני אפליקציה.",
      },
      hi: {
        name: "इमेज से ICO कन्वर्टर",
        description: "छवियों को फेविकॉन और ऐप आइकन के लिए ICO फ़ाइलों में बदलें।",
      },
      id: {
        name: "Konverter gambar ke ICO",
        description:
          "Ubah gambar menjadi file ICO untuk favicon dan ikon aplikasi.",
      },
      it: {
        name: "Convertitore da immagine a ICO",
        description:
          "Converti immagini in file ICO per favicon e icone delle app.",
      },
      ja: {
        name: "画像からICOへのコンバーター",
        description:
          "画像をファビコンやアプリアイコン用の ICO ファイルに変換。",
      },
      ko: {
        name: "이미지 ICO 변환기",
        description: "이미지를 파비콘 및 앱 아이콘용 ICO 파일로 변환합니다.",
      },
      ms: {
        name: "Penukar imej ke ICO",
        description:
          "Tukar imej kepada fail ICO untuk favicon dan ikon aplikasi.",
      },
      nl: {
        name: "Afbeelding naar ICO-converter",
        description:
          "Converteer afbeeldingen naar ICO-bestanden voor favicons en app-pictogrammen.",
      },
      no: {
        name: "Bilde til ICO-konverterer",
        description:
          "Konverter bilder til ICO-filer for favicons og appikoner.",
      },
      pl: {
        name: "Konwerter obrazu na ICO",
        description:
          "Konwertuj obrazy na pliki ICO dla favicon i ikon aplikacji.",
      },
      pt: {
        name: "Conversor de imagem para ICO",
        description:
          "Converta imagens em arquivos ICO para favicons e ícones de aplicativos.",
      },
      ru: {
        name: "Конвертер изображений в ICO",
        description:
          "Преобразуйте изображения в файлы ICO для фавиконов и значков приложений.",
      },
      sv: {
        name: "Bild till ICO-konverterare",
        description:
          "Konvertera bilder till ICO-filer för favicons och appikoner.",
      },
      th: {
        name: "ตัวแปลงรูปภาพเป็น ICO",
        description: "แปลงรูปภาพเป็นไฟล์ ICO สำหรับแฟวคอนและไอคอนแอป",
      },
      tr: {
        name: "Görüntüden ICO'ya Dönüştürücü",
        description:
          "Görüntüleri favicon ve uygulama simgeleri için ICO dosyalarına dönüştürün.",
      },
      vi: {
        name: "Trình chuyển ảnh sang ICO",
        description:
          "Chuyển ảnh sang tệp ICO cho favicon và biểu tượng ứng dụng.",
      },
      "zh-CN": {
        name: "图片转 ICO 转换器",
        description: "将图片转换为用于网站图标和应用图标的 ICO 文件。",
      },
      "zh-TW": {
        name: "圖片轉 ICO 轉換器",
        description: "將圖片轉換為用於網站圖示與應用圖示的 ICO 檔案。",
      },
    },
  },
  {
    slug: "imei-validator",
    category: "text",
    icon: "binary",
    tags: ["imei", "validator", "mobile", "device", "checksum"],
    locales: {
      ar: {
        name: "مدقق IMEI",
        description: "يتحقق من IMEI المكوّن من 15 رقمًا عبر التنسيق وفحص Luhn.",
      },
      de: {
        name: "IMEI-Validator",
        description: "Prüft 15-stellige IMEI auf Format und Luhn-Prüfsumme.",
      },
      en: {
        name: "IMEI Validator",
        description:
          "Validate 15-digit IMEI numbers with format and Luhn checksum checks.",
      },
      es: {
        name: "Validador de IMEI",
        description:
          "Valida IMEI de 15 dígitos con comprobaciones de formato y checksum Luhn.",
      },
      fr: {
        name: "Validateur IMEI",
        description:
          "Valide les IMEI à 15 chiffres avec contrôle de format et checksum Luhn.",
      },
      he: {
        name: "מאמת IMEI",
        description:
          "מאמת מספרי IMEI בני 15 ספרות עם בדיקות פורמט וסכום ביקורת Luhn.",
      },
      hi: {
        name: "IMEI सत्यापनकर्ता",
        description: "15 अंकों के IMEI को प्रारूप और Luhn चेकसम से सत्यापित करें।",
      },
      id: {
        name: "Validator IMEI",
        description:
          "Memvalidasi IMEI 15 digit dengan pemeriksaan format dan checksum Luhn.",
      },
      it: {
        name: "Validatore IMEI",
        description:
          "Convalida IMEI a 15 cifre con controlli di formato e checksum Luhn.",
      },
      ja: {
        name: "IMEI 検証",
        description: "15 桁の IMEI を形式と Luhn チェックサムで検証します。",
      },
      ko: {
        name: "IMEI 검증기",
        description: "15자리 IMEI의 형식과 Luhn 체크섬을 검증합니다.",
      },
      ms: {
        name: "Pengesah IMEI",
        description:
          "Sahkan IMEI 15 digit dengan semakan format dan checksum Luhn.",
      },
      nl: {
        name: "IMEI-validator",
        description:
          "Valideer 15-cijferige IMEI met formaat- en Luhn-controles.",
      },
      no: {
        name: "IMEI-validerer",
        description:
          "Validerer 15-sifrede IMEI med format- og Luhn-kontroller.",
      },
      pl: {
        name: "Walidator IMEI",
        description:
          "Sprawdza 15-cyfrowy IMEI pod kątem formatu i sumy kontrolnej Luhna.",
      },
      pt: {
        name: "Validador de IMEI",
        description:
          "Valida IMEIs de 15 dígitos com verificações de formato e checksum de Luhn.",
      },
      ru: {
        name: "Валидатор IMEI",
        description:
          "Проверяет 15-значный IMEI по формату и контрольной сумме Луна.",
      },
      sv: {
        name: "IMEI-validerare",
        description:
          "Validera 15-siffriga IMEI med format- och Luhn-kontroller.",
      },
      th: {
        name: "ตัวตรวจสอบ IMEI",
        description: "ตรวจสอบ IMEI 15 หลักด้วยรูปแบบและเช็กซัม Luhn",
      },
      tr: {
        name: "IMEI Doğrulayıcı",
        description:
          "15 haneli IMEI numaralarını biçim ve Luhn sağlama toplamı ile doğrular.",
      },
      vi: {
        name: "Trình xác thực IMEI",
        description:
          "Xác thực IMEI 15 chữ số bằng kiểm tra định dạng và checksum Luhn.",
      },
      "zh-CN": {
        name: "IMEI 验证器",
        description: "验证 15 位 IMEI，检查格式和 Luhn 校验位。",
      },
      "zh-TW": {
        name: "IMEI 驗證器",
        description: "驗證 15 位 IMEI，檢查格式與 Luhn 校驗位。",
      },
    },
  },
  {
    slug: "ip-cidr-normalizer",
    category: "network",
    icon: "network",
    tags: ["ip", "cidr", "ipv4", "ipv6", "normalize", "network"],
    locales: {
      ar: {
        name: "معايير IP/CIDR",
        description:
          "يعير عناوين IP وتسجيل CIDR لتنسيقات IPv4 و IPv6. أدخل أي IP أو نطاق CIDR للحصول على التنسيق الموحد فوراً.",
      },
      de: {
        name: "IP/CIDR-Normalisierer",
        description:
          "Normalisiert IP-Adressen und CIDR-Notation für IPv4- und IPv6-Formate. Geben Sie eine beliebige IP oder einen CIDR-Bereich ein, um das standardisierte Format sofort zu erhalten.",
      },
      en: {
        name: "IP/CIDR Normalizer",
        description:
          "Normalize IP addresses and CIDR notation for both IPv4 and IPv6 formats. Enter any IP or CIDR range to get the standardized format instantly.",
      },
      es: {
        name: "Normalizador IP/CIDR",
        description:
          "Normaliza direcciones IP y notación CIDR para formatos IPv4 e IPv6. Introduce cualquier IP o rango CIDR para obtener el formato estandarizado al instante.",
      },
      fr: {
        name: "Normalisateur IP/CIDR",
        description:
          "Normalisez les adresses IP et la notation CIDR pour les formats IPv4 et IPv6. Saisissez n'importe quelle IP ou plage CIDR pour obtenir le format standardisé instantanément.",
      },
      he: {
        name: "מנרמל IP/CIDR",
        description:
          "מנרמל כתובות IP וסימון CIDR עבור פורמטים IPv4 ו-IPv6. הזן כל IP או טווח CIDR כדי לקבל את הפורמט הסטנדרטי מיידית.",
      },
      hi: {
        name: "IP/CIDR सामान्यकरण उपकरण",
        description:
          "IPv4 और IPv6 प्रारूपों के लिए IP पतों और CIDR संकेतन को सामान्य बनाता है। किसी भी IP या CIDR श्रेणी को दर्ज करें और तुरंत मानकीकृत प्रारूप प्राप्त करें।",
      },
      id: {
        name: "Normalizer IP/CIDR",
        description:
          "Menormalkan alamat IP dan notasi CIDR untuk format IPv4 dan IPv6. Masukkan IP atau rentang CIDR apa pun untuk mendapatkan format standar secara instan.",
      },
      it: {
        name: "Normalizzatore IP/CIDR",
        description:
          "Normalizza indirizzi IP e notazione CIDR per formati IPv4 e IPv6. Inserisci qualsiasi IP o intervallo CIDR per ottenere il formato standardizzato istantaneamente.",
      },
      ja: {
        name: "IP/CIDR 正規化ツール",
        description:
          "IPv4 と IPv6 形式の IP アドレスと CIDR 記法を正規化します。任意の IP や CIDR 範囲を入力すると、標準化された形式を即座に取得できます。",
      },
      ko: {
        name: "IP/CIDR 정규화 도구",
        description:
          "IPv4 및 IPv6 형식의 IP 주소와 CIDR 표기법을 정규화합니다. 임의의 IP 또는 CIDR 범위를 입력하여 표준화된 형식을 즉시 얻으세요.",
      },
      ms: {
        name: "Penormal IP/CIDR",
        description:
          "Menormalkan alamat IP dan notasi CIDR untuk format IPv4 dan IPv6. Masukkan mana-mana IP atau julat CIDR untuk mendapatkan format piawai dengan serta-merta.",
      },
      nl: {
        name: "IP/CIDR Normalizer",
        description:
          "Normaliseert IP-adressen en CIDR-notatie voor IPv4- en IPv6-formaten. Voer een willekeurig IP-adres of CIDR-bereik in om het gestandaardiseerde formaat direct te krijgen.",
      },
      no: {
        name: "IP/CIDR-normalizer",
        description:
          "Normaliserer IP-adresser og CIDR-notasjon for IPv4- og IPv6-formater. Skriv inn hvilken som helst IP eller CIDR-område for å få det standardiserte formatet øyeblikkelig.",
      },
      pl: {
        name: "Normalizator IP/CIDR",
        description:
          "Normalizuje adresy IP i notację CIDR dla formatów IPv4 i IPv6. Wprowadź dowolny adres IP lub zakres CIDR, aby natychmiast uzyskać znormalizowany format.",
      },
      pt: {
        name: "Normalizador IP/CIDR",
        description:
          "Normaliza endereços IP e notação CIDR para formatos IPv4 e IPv6. Digite qualquer IP ou intervalo CIDR para obter o formato padronizado instantaneamente.",
      },
      ru: {
        name: "Нормализатор IP/CIDR",
        description:
          "Нормализует IP-адреса и CIDR-нотацию для форматов IPv4 и IPv6. Введите любой IP или диапазон CIDR, чтобы мгновенно получить стандартизированный формат.",
      },
      sv: {
        name: "IP/CIDR-normaliserare",
        description:
          "Normaliserar IP-adresser och CIDR-notation för IPv4- och IPv6-format. Ange valfri IP eller CIDR-intervall för att få det standardiserade formatet omedelbart.",
      },
      th: {
        name: "เครื่องมือปรับมาตรฐาน IP/CIDR",
        description:
          "ปรับมาตรฐานที่อยู่ IP และรูปแบบ CIDR สำหรับรูปแบบ IPv4 และ IPv6 ป้อน IP หรือช่วง CIDR ใดก็ได้เพื่อรับรูปแบบมาตรฐานทันที",
      },
      tr: {
        name: "IP/CIDR Normalleştirici",
        description:
          "IPv4 ve IPv6 formatları için IP adreslerini ve CIDR notasyonunu normalleştirir. Herhangi bir IP veya CIDR aralığı girin ve standartlaştırılmış formatı anında alın.",
      },
      vi: {
        name: "Công cụ chuẩn hóa IP/CIDR",
        description:
          "Chuẩn hóa địa chỉ IP và ký hiệu CIDR cho định dạng IPv4 và IPv6. Nhập bất kỳ IP hoặc dải CIDR nào để nhận định dạng chuẩn ngay lập tức.",
      },
      "zh-CN": {
        name: "IP/CIDR 规范化工具",
        description:
          "规范化 IP 地址和 CIDR 表示法，支持 IPv4 和 IPv6 格式。输入任何 IP 或 CIDR 范围，立即获得标准化格式。",
      },
      "zh-TW": {
        name: "IP/CIDR 標準化工具",
        description:
          "標準化 IP 位址和 CIDR 表示法，支援 IPv4 和 IPv6 格式。輸入任何 IP 或 CIDR 範圍，立即獲得標準化格式。",
      },
    },
  },
  {
    slug: "ip-range-to-cidr-converter",
    category: "network",
    icon: "network",
    tags: ["ip", "cidr", "network", "range", "ipv4", "ipv6", "subnet"],
    locales: {
      ar: {
        name: "نطاق IP لتحويل CIDR",
        description:
          "قم بتحويل عناوين البداية والنهاية IPv4 أو IPv6 إلى الحد الأدنى من كتل CIDR التي تغطي النطاق بالضبط.",
      },
      de: {
        name: "IP-Bereich-zu-CIDR-Konverter",
        description:
          "Konvertieren Sie IPv4- oder IPv6-Start- und Endadressen in den minimalen Satz von CIDR-Blöcken, der den Bereich genau abdeckt.",
      },
      en: {
        name: "IP Range to CIDR Converter",
        description:
          "Convert IPv4 or IPv6 start and end addresses into the minimal set of CIDR blocks that exactly covers the range.",
      },
      es: {
        name: "Convertidor de rango IP a CIDR",
        description:
          "Convierta las direcciones de inicio y finalización de IPv4 o IPv6 en el conjunto mínimo de bloques CIDR que cubra exactamente el rango.",
      },
      fr: {
        description:
          "Convertissez les adresses de début et de fin IPv4 ou IPv6 en un ensemble minimal de blocs CIDR qui couvrent exactement la plage.",
        name: "Convertisseur de plage IP en CIDR",
      },
      he: {
        name: "ממיר IP ל-CIDR",
        description:
          "המר כתובות התחלה וסיום IPv4 או IPv6 לקבוצה המינימלית של בלוקים CIDR המכסה בדיוק את הטווח.",
      },
      hi: {
        name: "आईपी ​​रेंज से सीआईडीआर कनवर्टर",
        description:
          "IPv4 या IPv6 आरंभ और अंत पतों को CIDR ब्लॉक के न्यूनतम सेट में बदलें जो बिल्कुल सीमा को कवर करता है।",
      },
      id: {
        name: "Rentang IP ke Konverter CIDR",
        description:
          "Ubah alamat awal dan akhir IPv4 atau IPv6 menjadi kumpulan blok CIDR minimal yang mencakup rentang tersebut secara tepat.",
      },
      it: {
        name: "Convertitore da intervallo IP a CIDR",
        description:
          "Converti gli indirizzi iniziali e finali IPv4 o IPv6 nel set minimo di blocchi CIDR che copre esattamente l'intervallo.",
      },
      ja: {
        name: "IP範囲からCIDRへのコンバータ",
        description:
          "IPv4 または IPv6 の開始アドレスと終了アドレスを、その範囲を正確にカバーする最小限の CIDR ブロックのセットに変換します。",
      },
      ko: {
        description:
          "IPv4 또는 IPv6 시작 및 끝 주소를 해당 범위를 정확하게 포함하는 최소 CIDR 블록 세트로 변환합니다.",
        name: "IP 범위-CIDR 변환기",
      },
      ms: {
        name: "Julat IP kepada Penukar CIDR",
        description:
          "Tukar alamat mula dan tamat IPv4 atau IPv6 ke dalam set minimum blok CIDR yang betul-betul meliputi julat.",
      },
      nl: {
        name: "IP-bereik naar CIDR-converter",
        description:
          "Converteer IPv4- of IPv6-start- en eindadressen naar de minimale set CIDR-blokken die precies het bereik dekt.",
      },
      no: {
        name: "IP Range til CIDR Converter",
        description:
          "Konverter IPv4- eller IPv6-start- og sluttadresser til det minimale settet med CIDR-blokker som nøyaktig dekker området.",
      },
      pl: {
        name: "Konwerter zakresu IP na CIDR",
        description:
          "Konwertuj adresy początkowe i końcowe IPv4 lub IPv6 na minimalny zestaw bloków CIDR, który dokładnie pokrywa zakres.",
      },
      pt: {
        description:
          "Converta endereços iniciais e finais IPv4 ou IPv6 no conjunto mínimo de blocos CIDR que cobre exatamente o intervalo.",
        name: "Conversor de intervalo IP para CIDR",
      },
      ru: {
        name: "Конвертер диапазона IP в CIDR",
        description:
          "Преобразуйте начальные и конечные адреса IPv4 или IPv6 в минимальный набор блоков CIDR, который точно покрывает диапазон.",
      },
      sv: {
        name: "IP-intervall till CIDR-omvandlare",
        description:
          "Konvertera IPv4- eller IPv6-start- och slutadresser till den minimala uppsättningen CIDR-block som exakt täcker intervallet.",
      },
      th: {
        name: "ช่วง IP เป็น CIDR Converter",
        description:
          "แปลงที่อยู่เริ่มต้นและสิ้นสุดของ IPv4 หรือ IPv6 ให้เป็นชุดบล็อก CIDR ขั้นต่ำที่ครอบคลุมช่วงดังกล่าวทุกประการ",
      },
      tr: {
        name: "IP Aralığından CIDR'ye Dönüştürücü",
        description:
          "IPv4 veya IPv6 başlangıç ​​ve bitiş adreslerini, aralığı tam olarak kapsayan minimum CIDR blokları kümesine dönüştürün.",
      },
      vi: {
        name: "Bộ chuyển đổi dải IP sang CIDR",
        description:
          "Chuyển đổi địa chỉ bắt đầu và kết thúc IPv4 hoặc IPv6 thành tập hợp khối CIDR tối thiểu bao phủ chính xác phạm vi.",
      },
      "zh-CN": {
        description:
          "将 IPv4 或 IPv6 起始地址和结束地址转换为精确覆盖范围的最小 CIDR 块集。",
        name: "IP 范围到 CIDR 转换器",
      },
      "zh-TW": {
        name: "IP 範圍到 CIDR 轉換器",
        description:
          "將 IPv4 或 IPv6 起始位址和結束位址轉換為精確覆蓋範圍的最小 CIDR 區塊集。",
      },
    },
  },
  {
    slug: "ipv6-address-to-mac-address-converter",
    category: "network",
    icon: "network",
    tags: ["ipv6", "mac", "eui-64", "link-local", "network", "converter"],
    locales: {
      ar: {
        name: "محول عنوان IPv6 إلى عنوان MAC",
        description:
          "يحول عناوين IPv6 إلى عناوين MAC. أدخل أي عنوان IPv6 لاستخراج عنوان MAC المقابل فوراً.",
      },
      de: {
        name: "IPv6-Adresse zu MAC-Adresse Konverter",
        description:
          "Konvertiert IPv6-Adressen zu MAC-Adressen. Geben Sie eine beliebige IPv6-Adresse ein, um die entsprechende MAC-Adresse sofort zu extrahieren.",
      },
      en: {
        name: "IPv6 Address to MAC Address Converter",
        description:
          "Convert IPv6 addresses to MAC addresses. Enter any IPv6 address to extract the corresponding MAC address instantly.",
      },
      es: {
        name: "Convertidor de dirección IPv6 a dirección MAC",
        description:
          "Convierte direcciones IPv6 a direcciones MAC. Introduce cualquier dirección IPv6 para extraer la dirección MAC correspondiente al instante.",
      },
      fr: {
        name: "Convertisseur d'adresse IPv6 en adresse MAC",
        description:
          "Convertit les adresses IPv6 en adresses MAC. Saisissez n'importe quelle adresse IPv6 pour extraire l'adresse MAC correspondante instantanément.",
      },
      he: {
        name: "ממיר כתובת IPv6 לכתובת MAC",
        description:
          "ממיר כתובות IPv6 לכתובות MAC. הזן כל כתובת IPv6 כדי לחלץ את כתובת ה-MAC המתאימה מיידית.",
      },
      hi: {
        name: "IPv6 पते से MAC पता कनवर्टर",
        description:
          "IPv6 पतों को MAC पतों में परिवर्तित करता है। किसी भी IPv6 पते को दर्ज करें और संबंधित MAC पता तुरंत निकालें।",
      },
      id: {
        name: "Konverter alamat IPv6 ke alamat MAC",
        description:
          "Mengonversi alamat IPv6 menjadi alamat MAC. Masukkan alamat IPv6 apa pun untuk mengekstrak alamat MAC yang sesuai secara instan.",
      },
      it: {
        name: "Convertitore da indirizzo IPv6 a indirizzo MAC",
        description:
          "Converte indirizzi IPv6 in indirizzi MAC. Inserisci qualsiasi indirizzo IPv6 per estrarre il corrispondente indirizzo MAC istantaneamente.",
      },
      ja: {
        name: "IPv6 アドレスから MAC アドレスへの変換ツール",
        description:
          "IPv6 アドレスを MAC アドレスに変換します。任意の IPv6 アドレスを入力すると、対応する MAC アドレスを即座に抽出できます。",
      },
      ko: {
        name: "IPv6 주소를 MAC 주소로 변환",
        description:
          "IPv6 주소를 MAC 주소로 변환합니다. 임의의 IPv6 주소를 입력하여 해당하는 MAC 주소를 즉시 추출하세요.",
      },
      ms: {
        name: "Penukar alamat IPv6 kepada alamat MAC",
        description:
          "Menukar alamat IPv6 kepada alamat MAC. Masukkan mana-mana alamat IPv6 untuk mengekstrak alamat MAC yang berkaitan dengan serta-merta.",
      },
      nl: {
        name: "IPv6-adres naar MAC-adres-converter",
        description:
          "Converteert IPv6-adressen naar MAC-adressen. Voer een willekeurig IPv6-adres in om het overeenkomstige MAC-adres direct te extraheren.",
      },
      no: {
        name: "Konverterer for IPv6-adresse til MAC-adresse",
        description:
          "Konverterer IPv6-adresser til MAC-adresser. Skriv inn hvilken som helst IPv6-adresse for å trekke ut den tilsvarende MAC-adressen øyeblikkelig.",
      },
      pl: {
        name: "Konwerter adresu IPv6 na adres MAC",
        description:
          "Konwertuje adresy IPv6 na adresy MAC. Wprowadź dowolny adres IPv6, aby natychmiast wyodrębnić odpowiadający adres MAC.",
      },
      pt: {
        name: "Conversor de endereço IPv6 para endereço MAC",
        description:
          "Converte endereços IPv6 em endereços MAC. Digite qualquer endereço IPv6 para extrair o endereço MAC correspondente instantaneamente.",
      },
      ru: {
        name: "Конвертер адреса IPv6 в MAC-адрес",
        description:
          "Преобразует IPv6-адреса в MAC-адреса. Введите любой IPv6-адрес, чтобы мгновенно извлечь соответствующий MAC-адрес.",
      },
      sv: {
        name: "Konverterare för IPv6-adress till MAC-adress",
        description:
          "Konverterar IPv6-adresser till MAC-adresser. Ange valfri IPv6-adress för att extrahera motsvarande MAC-adress omedelbart.",
      },
      th: {
        name: "เครื่องมือแปลงที่อยู่ IPv6 เป็นที่อยู่ MAC",
        description:
          "แปลงที่อยู่ IPv6 เป็นที่อยู่ MAC ป้อนที่อยู่ IPv6 ใดก็ได้เพื่อสกัดที่อยู่ MAC ที่สอดคล้องกันทันที",
      },
      tr: {
        name: "IPv6 Adresinden MAC Adresine Dönüştürücü",
        description:
          "IPv6 adreslerini MAC adreslerine dönüştürür. Herhangi bir IPv6 adresi girin ve karşılık gelen MAC adresini anında çıkarın.",
      },
      vi: {
        name: "Trình chuyển đổi địa chỉ IPv6 sang địa chỉ MAC",
        description:
          "Chuyển đổi địa chỉ IPv6 thành địa chỉ MAC. Nhập bất kỳ địa chỉ IPv6 nào để trích xuất địa chỉ MAC tương ứng ngay lập tức.",
      },
      "zh-CN": {
        name: "IPv6 地址转 MAC 地址转换器",
        description:
          "将 IPv6 地址转换为 MAC 地址。输入任何 IPv6 地址，立即提取对应的 MAC 地址。",
      },
      "zh-TW": {
        name: "IPv6 位址轉 MAC 位址轉換器",
        description:
          "將 IPv6 位址轉換為 MAC 位址。輸入任何 IPv6 位址，立即提取對應的 MAC 位址。",
      },
    },
  },
  {
    slug: "isbn-validator",
    category: "text",
    icon: "file-text",
    tags: ["isbn", "validator", "checksum", "book", "publishing"],
    locales: {
      ar: {
        name: "مدقق ISBN",
        description: "تحقق من ISBN-10/ISBN-13 وأرقام التحقق ونتائج التحويل",
      },
      de: {
        name: "ISBN-Validator",
        description:
          "Prüfen Sie ISBN-10/ISBN-13, Prüfziffern und Konvertierungen",
      },
      en: {
        name: "ISBN Validator",
        description:
          "Validate ISBN-10/ISBN-13 numbers, check digits, and conversions",
      },
      es: {
        name: "Validador de ISBN",
        description:
          "Valida ISBN-10/ISBN-13, el dígito de control y las conversiones",
      },
      fr: {
        name: "Validateur ISBN",
        description:
          "Validez les ISBN-10/ISBN-13, les chiffres de contrôle et les conversions",
      },
      he: {
        name: "מאמת ISBN",
        description: "אמת ISBN-10/ISBN-13, ספרת ביקורת והמרות",
      },
      hi: {
        name: "ISBN सत्यापनकर्ता",
        description: "ISBN-10/ISBN-13 सत्यापित करें, चेक अंक और रूपांतरण देखें",
      },
      id: {
        name: "Validator ISBN",
        description: "Validasi ISBN-10/ISBN-13, digit pemeriksa, dan konversi",
      },
      it: {
        name: "Validatore ISBN",
        description: "Valida ISBN-10/ISBN-13, cifra di controllo e conversioni",
      },
      ja: {
        name: "ISBN 検証",
        description:
          "ISBN-10/ISBN-13 を検証し、チェックディジットと変換結果を確認します",
      },
      ko: {
        name: "ISBN 검증기",
        description:
          "ISBN-10/ISBN-13을 검증하고 체크 디지트와 변환 결과를 확인합니다",
      },
      ms: {
        name: "Pengesah ISBN",
        description: "Sahkan ISBN-10/ISBN-13, digit semakan dan penukaran",
      },
      nl: {
        name: "ISBN-validator",
        description: "Valideer ISBN-10/ISBN-13, controlecijfers en conversies",
      },
      no: {
        name: "ISBN-validator",
        description:
          "Valider ISBN-10/ISBN-13, kontrollsiffer og konverteringer",
      },
      pl: {
        name: "Walidator ISBN",
        description: "Waliduj ISBN-10/ISBN-13, cyfry kontrolne i konwersje",
      },
      pt: {
        name: "Validador de ISBN",
        description: "Valide ISBN-10/ISBN-13, dígito verificador e conversões",
      },
      ru: {
        name: "Валидатор ISBN",
        description:
          "Проверяйте ISBN-10/ISBN-13, контрольные цифры и результаты конвертации",
      },
      sv: {
        name: "ISBN-validator",
        description:
          "Validera ISBN-10/ISBN-13, kontrollsiffror och konverteringar",
      },
      th: {
        name: "ตัวตรวจสอบ ISBN",
        description: "ตรวจสอบ ISBN-10/ISBN-13 เลขตรวจสอบ และการแปลง",
      },
      tr: {
        name: "ISBN Doğrulayıcı",
        description:
          "ISBN-10/ISBN-13 doğrulama, kontrol basamağı ve dönüşümler",
      },
      vi: {
        name: "Trình xác thực ISBN",
        description: "Xác thực ISBN-10/ISBN-13, chữ số kiểm tra và chuyển đổi",
      },
      "zh-CN": {
        name: "ISBN 验证器",
        description: "验证 ISBN-10/ISBN-13，检查校验位并提供转换结果",
      },
      "zh-TW": {
        name: "ISBN 驗證器",
        description: "驗證 ISBN-10/ISBN-13，檢查校驗位並提供轉換結果",
      },
    },
  },
  {
    slug: "jmespath-tester",
    category: "json",
    icon: "search",
    tags: ["code", "jmespath", "json", "query", "filter", "search", "data"],
    locales: {
      ar: {
        name: "مختبر JMESPath",
        description: "قيّم تعبيرات JMESPath على بيانات JSON وتحقق من النتيجة.",
      },
      de: {
        name: "JMESPath-Tester",
        description:
          "Evaluieren Sie JMESPath-Ausdrücke auf JSON-Daten und prüfen Sie das Ergebnis.",
      },
      en: {
        name: "JMESPath Tester",
        description:
          "Evaluate JMESPath expressions against JSON data and inspect the result.",
      },
      es: {
        name: "Probador de JMESPath",
        description:
          "Evalúa expresiones JMESPath en datos JSON y revisa el resultado.",
      },
      fr: {
        name: "Testeur JMESPath",
        description:
          "Évaluez des expressions JMESPath sur des données JSON et inspectez le résultat.",
      },
      he: {
        name: "בודק JMESPath",
        description: "הערך ביטויי JMESPath על נתוני JSON ובדוק את התוצאה.",
      },
      hi: {
        name: "JMESPath परीक्षक",
        description: "JSON डेटा पर JMESPath अभिव्यक्तियाँ चलाएँ और परिणाम देखें।",
      },
      id: {
        name: "Penguji JMESPath",
        description:
          "Evaluasi ekspresi JMESPath pada data JSON dan periksa hasilnya.",
      },
      it: {
        name: "Tester JMESPath",
        description:
          "Valuta espressioni JMESPath su dati JSON e ispeziona il risultato.",
      },
      ja: {
        name: "JMESPath テスター",
        description:
          "JSON データに対して JMESPath 式を評価し、結果を確認します。",
      },
      ko: {
        name: "JMESPath 테스트기",
        description:
          "JSON 데이터에 JMESPath 표현식을 평가하고 결과를 확인합니다.",
      },
      ms: {
        name: "Penguji JMESPath",
        description:
          "Nilai ungkapan JMESPath pada data JSON dan semak hasilnya.",
      },
      nl: {
        name: "JMESPath-tester",
        description:
          "Evalueer JMESPath-expressies op JSON-data en bekijk het resultaat.",
      },
      no: {
        name: "JMESPath-tester",
        description:
          "Evaluer JMESPath-uttrykk på JSON-data og inspiser resultatet.",
      },
      pl: {
        name: "Tester JMESPath",
        description: "Oceń wyrażenia JMESPath na danych JSON i sprawdź wynik.",
      },
      pt: {
        name: "Testador de JMESPath",
        description:
          "Avalie expressões JMESPath em dados JSON e inspecione o resultado.",
      },
      ru: {
        name: "Тестер JMESPath",
        description:
          "Выполняйте выражения JMESPath над JSON-данными и проверяйте результат.",
      },
      sv: {
        name: "JMESPath-testare",
        description:
          "Utvärdera JMESPath-uttryck på JSON-data och granska resultatet.",
      },
      th: {
        name: "เครื่องมือทดสอบ JMESPath",
        description: "ประเมินนิพจน์ JMESPath กับข้อมูล JSON และตรวจสอบผลลัพธ์",
      },
      tr: {
        name: "JMESPath Test Aracı",
        description:
          "JSON verileri üzerinde JMESPath ifadelerini değerlendirin ve sonucu inceleyin.",
      },
      vi: {
        name: "Trình kiểm tra JMESPath",
        description:
          "Đánh giá biểu thức JMESPath trên dữ liệu JSON và xem kết quả.",
      },
      "zh-CN": {
        name: "JMESPath 测试器",
        description: "对 JSON 数据运行 JMESPath 表达式并查看结果。",
      },
      "zh-TW": {
        name: "JMESPath 測試器",
        description: "對 JSON 資料執行 JMESPath 表達式並檢視結果。",
      },
    },
  },
  {
    slug: "json-diff-path",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "json", "diff", "patch", "pointer", "compare", "jsonpath"],
    locales: {
      ar: {
        name: "JSON Diff Path",
        description:
          "قارن مستندَي JSON وأنشئ فروقًا قائمة على المسارات مع مسارات JSON Pointer ومخرجات JSON Patch وفق RFC 6902.",
      },
      de: {
        name: "JSON Diff Path",
        description:
          "Zwei JSON-Dokumente vergleichen und pfadbasierte Diffs mit JSON-Pointer-Pfaden und RFC-6902-JSON-Patch-Ausgabe erzeugen.",
      },
      en: {
        name: "JSON Diff Path",
        description:
          "Compare two JSON documents and generate path-based diffs with JSON Pointer paths and RFC 6902 JSON Patch output.",
      },
      es: {
        name: "Ruta de diferencias JSON",
        description:
          "Compara dos documentos JSON y genera diferencias por ruta con rutas JSON Pointer y salida JSON Patch RFC 6902.",
      },
      fr: {
        name: "JSON Diff Path",
        description:
          "Comparez deux documents JSON et générez des diffs basés sur les chemins avec des chemins JSON Pointer et une sortie JSON Patch RFC 6902.",
      },
      he: {
        name: "JSON Diff Path",
        description:
          "השוואה בין שני מסמכי JSON והפקת הבדלים מבוססי נתיב עם נתיבי JSON Pointer ופלט JSON Patch לפי RFC 6902.",
      },
      hi: {
        name: "JSON Diff Path",
        description:
          "दो JSON दस्तावेज़ों की तुलना करें और JSON Pointer paths तथा RFC 6902 JSON Patch output के साथ path-based diffs जनरेट करें।",
      },
      id: {
        name: "JSON Diff Path",
        description:
          "Bandingkan dua dokumen JSON dan hasilkan diff berbasis path dengan path JSON Pointer serta output JSON Patch RFC 6902.",
      },
      it: {
        name: "JSON Diff Path",
        description:
          "Confronta due documenti JSON e genera diff basati sui percorsi con percorsi JSON Pointer e output JSON Patch RFC 6902.",
      },
      ja: {
        name: "JSON Diff Path",
        description:
          "2つの JSON ドキュメントを比較し、JSON Pointer パスと RFC 6902 JSON Patch 出力を使ったパスベースの差分を生成します。",
      },
      ko: {
        name: "JSON Diff Path",
        description:
          "두 JSON 문서를 비교해 JSON Pointer 경로와 RFC 6902 JSON Patch 출력을 포함한 경로 기반 diff를 생성합니다.",
      },
      ms: {
        name: "JSON Diff Path",
        description:
          "Bandingkan dua dokumen JSON dan jana perbezaan berasaskan laluan dengan laluan JSON Pointer dan output JSON Patch RFC 6902.",
      },
      nl: {
        name: "JSON Diff Path",
        description:
          "Vergelijk twee JSON-documenten en genereer padgebaseerde verschillen met JSON Pointer-paden en RFC 6902 JSON Patch-uitvoer.",
      },
      no: {
        name: "JSON Diff Path",
        description:
          "Sammenlign to JSON-dokumenter og generer sti-baserte diff-resultater med JSON Pointer-stier og RFC 6902 JSON Patch-utdata.",
      },
      pl: {
        name: "JSON Diff Path",
        description:
          "Porównuje dwa dokumenty JSON i generuje różnice oparte na ścieżkach z użyciem ścieżek JSON Pointer oraz wyjścia RFC 6902 JSON Patch.",
      },
      pt: {
        name: "JSON Diff Path",
        description:
          "Compare dois documentos JSON e gere diffs por caminho com caminhos JSON Pointer e saída JSON Patch RFC 6902.",
      },
      ru: {
        name: "JSON Diff Path",
        description:
          "Сравнивает два JSON-документа и формирует диффы на основе путей с JSON Pointer-путями и выводом RFC 6902 JSON Patch.",
      },
      sv: {
        name: "JSON Diff Path",
        description:
          "Jämför två JSON-dokument och genererar sökvägsbaserade diffar med JSON Pointer-sökvägar och RFC 6902 JSON Patch-utdata.",
      },
      th: {
        name: "ตัวเปรียบเทียบเส้นทาง JSON",
        description:
          "เปรียบเทียบเอกสาร JSON สองชุดและสร้าง diff ตามเส้นทาง พร้อมเอาต์พุต JSON Pointer และ JSON Patch ตาม RFC 6902",
      },
      tr: {
        name: "JSON Diff Path",
        description:
          "İki JSON belgesini karşılaştırır ve JSON Pointer yolları ile RFC 6902 JSON Patch çıktısı içeren yola dayalı farklar üretir.",
      },
      vi: {
        name: "JSON Diff Path",
        description:
          "So sánh hai tài liệu JSON và tạo diff theo đường dẫn với các đường dẫn JSON Pointer và đầu ra JSON Patch RFC 6902.",
      },
      "zh-CN": {
        name: "JSON Diff Path",
        description:
          "比较两个 JSON 文档，并生成基于路径的差异，同时输出 JSON Pointer 路径和符合 RFC 6902 的 JSON Patch。",
      },
      "zh-TW": {
        name: "JSON 差異路徑",
        description:
          "比較兩份 JSON 文件，並產生以路徑為基礎的差異，輸出 JSON Pointer 路徑與 RFC 6902 JSON Patch。",
      },
    },
  },
  {
    slug: "json-formatter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "json", "formatter", "prettifier"],
    locales: {
      ar: {
        name: "منسق JSON",
        description:
          "نسق وجمّل JSON بالإزاحة المناسبة. الصق JSON أو استورد ملفًا؛ معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "JSON-Formatierer",
        description:
          "JSON formatieren und verschönern mit ordentlicher Einrückung. JSON einfügen oder Datei importieren; Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "JSON Formatter",
        description:
          "Format and prettify JSON with proper indentation. Paste JSON or import a file; preview, copy, and download.",
      },
      es: {
        name: "Formateador JSON",
        description:
          "Formatear y embellecer JSON con sangría apropiada. Pega JSON o importa un archivo; previsualiza, copia y descarga.",
      },
      fr: {
        name: "Formateur JSON",
        description:
          "Formatez et embellissez le JSON avec une indentation appropriée. Collez du JSON ou importez un fichier ; aperçu, copie et téléchargement.",
      },
      he: {
        name: "מעצב JSON",
        description:
          "עיצוב ויפוי JSON עם הזחות נכונות. הדביקו JSON או ייבאו קובץ; תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "JSON फॉर्मेटर",
        description:
          "उचित इंडेंटेशन के साथ JSON को फॉर्मेट और सुंदर बनाएं। JSON पेस्ट करें या फ़ाइल आयात करें; पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pemformat JSON",
        description:
          "Format dan percantik JSON dengan indentasi yang tepat. Tempel JSON atau impor berkas; pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Formattatore JSON",
        description:
          "Formatta e abbellisce il JSON con indentazione appropriata. Incolla JSON o importa un file; anteprima, copia e download.",
      },
      ja: {
        name: "JSON フォーマッター",
        description:
          "適切なインデントでJSONをフォーマット・整形。JSONを貼り付けるかファイルを読み込み、プレビュー・コピー・ダウンロード。",
      },
      ko: {
        name: "JSON 포맷터",
        description:
          "적절한 들여쓰기로 JSON을 포맷하고 정리합니다. JSON 붙여넣기 또는 파일 가져오기; 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Pemformat JSON",
        description:
          "Format dan percantikkan JSON dengan indentasi yang sesuai. Tampal JSON atau import fail; pratonton, salin dan muat turun.",
      },
      nl: {
        name: "JSON-formatter",
        description:
          "Formatteer en mooier maken van JSON met juiste inspringing. Plak JSON of importeer een bestand; bekijk, kopieer en download.",
      },
      no: {
        name: "JSON-formater",
        description:
          "Formater og forskjønne JSON med riktig innrykk. Lim inn JSON eller importer en fil; forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Formatter JSON",
        description:
          "Formatuj i upiększaj JSON z odpowiednimi wcięciami. Wklej JSON lub zaimportuj plik; podgląd, kopiowanie i pobieranie.",
      },
      pt: {
        name: "Formatador JSON",
        description:
          "Formate e embeleze JSON com indentação apropriada. Cole JSON ou importe um arquivo; visualize, copie e baixe.",
      },
      ru: {
        name: "JSON форматировщик",
        description:
          "Форматируйте и украсьте JSON с правильной индентацией. Вставьте JSON или импортируйте файл; просмотр, копирование и загрузка.",
      },
      sv: {
        name: "JSON-formaterare",
        description:
          "Formatera och försköna JSON med korrekt indentering. Klistra in JSON eller importera en fil; förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวจัดรูปแบบ JSON",
        description:
          "จัดรูปแบบและทำให้ JSON สวยงามด้วยการเยื้องที่เหมาะสม วาง JSON หรือ นำเข้าไฟล์; ดูตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "JSON Biçimlendirici",
        description:
          "JSON'u uygun girinti ile biçimlendirin ve güzelleştirin. JSON yapıştırın veya dosya içe aktarın; önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình định dạng JSON",
        description:
          "Định dạng và làm đẹp JSON với thụt lề phù hợp. Dán JSON hoặc nhập tệp; xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "JSON 格式化器",
        description:
          "格式化和美化JSON，并提供正确的缩进。粘贴JSON或导入文件；预览、复制并下载。",
      },
      "zh-TW": {
        name: "JSON 格式化器",
        description:
          "格式化和美化JSON，並提供正確的縮進。貼上JSON或匯入檔案；預覽、複製並下載。",
      },
    },
  },
  {
    slug: "json-schema-generator",
    category: "json",
    icon: "braces",
    tags: ["json", "schema", "generator", "developer"],
    locales: {
      ar: {
        name: "مولد مخطط JSON",
        description: "ينشئ مخطط JSON من بيانات JSON نموذجية",
      },
      de: {
        name: "JSON-Schema-Generator",
        description: "Erstellt ein JSON Schema aus Beispiel-JSON-Daten",
      },
      en: {
        name: "JSON Schema Generator",
        description: "Generate JSON Schema from example JSON data",
      },
      es: {
        name: "Generador de JSON Schema",
        description: "Genera JSON Schema a partir de datos JSON de ejemplo",
      },
      fr: {
        name: "Générateur de JSON Schema",
        description: "Génère un JSON Schema à partir de données JSON d'exemple",
      },
      he: {
        name: "מחולל JSON Schema",
        description: "יוצר JSON Schema מתוך נתוני JSON לדוגמה",
      },
      hi: {
        name: "JSON स्कीमा जनरेटर",
        description: "उदाहरण JSON डेटा से JSON Schema जनरेट करें",
      },
      id: {
        name: "Generator JSON Schema",
        description: "Menghasilkan JSON Schema dari data JSON contoh",
      },
      it: {
        name: "Generatore di JSON Schema",
        description: "Genera JSON Schema da dati JSON di esempio",
      },
      ja: {
        name: "JSON Schema ジェネレーター",
        description: "例の JSON データから JSON Schema を生成します",
      },
      ko: {
        name: "JSON 스키마 생성기",
        description: "예시 JSON 데이터에서 JSON Schema를 생성합니다",
      },
      ms: {
        name: "Penjana JSON Schema",
        description: "Menjana JSON Schema daripada data JSON contoh",
      },
      nl: {
        name: "JSON Schema-generator",
        description:
          "Genereert JSON Schema op basis van voorbeeld-JSON-gegevens",
      },
      no: {
        name: "JSON Schema-generator",
        description: "Genererer JSON Schema fra eksempeldata i JSON",
      },
      pl: {
        name: "Generator JSON Schema",
        description:
          "Generuje JSON Schema na podstawie przykładowych danych JSON",
      },
      pt: {
        name: "Gerador de JSON Schema",
        description: "Gera JSON Schema a partir de dados JSON de exemplo",
      },
      ru: {
        name: "Генератор JSON Schema",
        description: "Создает JSON Schema из примеров JSON-данных",
      },
      sv: {
        name: "JSON Schema-generator",
        description: "Genererar JSON Schema från exempel-JSON-data",
      },
      th: {
        name: "ตัวสร้าง JSON Schema",
        description: "สร้าง JSON Schema จากข้อมูล JSON ตัวอย่าง",
      },
      tr: {
        name: "JSON Schema Oluşturucu",
        description: "Örnek JSON verilerinden JSON Schema oluşturur",
      },
      vi: {
        name: "Trình tạo JSON Schema",
        description: "Tạo JSON Schema từ dữ liệu JSON mẫu",
      },
      "zh-CN": {
        name: "JSON Schema 生成器",
        description: "从示例 JSON 数据生成 JSON Schema",
      },
      "zh-TW": {
        name: "JSON Schema 產生器",
        description: "從範例 JSON 資料產生 JSON Schema",
      },
    },
  },
  {
    slug: "json-schema-validator",
    category: "json",
    icon: "braces",
    tags: ["json", "schema", "validator", "developer", "api"],
    locales: {
      ar: {
        name: "مدقق JSON Schema",
        description:
          "تحقق من بيانات JSON مقابل JSON Schema مع اكتشاف تلقائي للمسودة وإخراج أخطاء قابل للقراءة.",
      },
      de: {
        name: "JSON-Schema-Validator",
        description:
          "Validieren Sie JSON-Daten gegen ein JSON Schema mit Draft-Erkennung und lesbarer Fehlerausgabe.",
      },
      en: {
        name: "JSON Schema Validator",
        description:
          "Validate JSON data against a JSON Schema with draft-aware validation and readable error output.",
      },
      es: {
        name: "Validador de JSON Schema",
        description:
          "Valida datos JSON contra un JSON Schema con detección de borrador y mensajes de error legibles.",
      },
      fr: {
        name: "Validateur JSON Schema",
        description:
          "Validez des données JSON par rapport à un JSON Schema avec détection du brouillon et sortie d'erreurs lisible.",
      },
      he: {
        name: "מאמת JSON Schema",
        description:
          "אמת נתוני JSON מול JSON Schema עם זיהוי טיוטה ופלט שגיאות קריא.",
      },
      hi: {
        name: "JSON Schema वैलिडेटर",
        description:
          "ड्राफ्ट-जागरूक सत्यापन और पठनीय त्रुटि आउटपुट के साथ JSON डेटा को JSON Schema के विरुद्ध सत्यापित करें।",
      },
      id: {
        name: "Validator JSON Schema",
        description:
          "Validasi data JSON terhadap JSON Schema dengan deteksi draft dan keluaran kesalahan yang mudah dibaca.",
      },
      it: {
        name: "Validatore JSON Schema",
        description:
          "Convalida i dati JSON rispetto a un JSON Schema con rilevamento del draft e output di errori leggibile.",
      },
      ja: {
        name: "JSON Schema バリデーター",
        description:
          "ドラフトを自動検出し、読みやすいエラー出力で JSON データを JSON Schema に対して検証します。",
      },
      ko: {
        name: "JSON Schema 검증기",
        description:
          "드래프트 자동 감지 및 읽기 쉬운 오류 출력으로 JSON 데이터를 JSON Schema에 대해 검증합니다.",
      },
      ms: {
        name: "Pengesah JSON Schema",
        description:
          "Sahkan data JSON terhadap JSON Schema dengan pengesanan draf dan output ralat yang mudah dibaca.",
      },
      nl: {
        name: "JSON Schema Validator",
        description:
          "Valideer JSON-gegevens tegen een JSON Schema met draft-bewuste validatie en leesbare foutmeldingen.",
      },
      no: {
        name: "JSON Schema-validator",
        description:
          "Valider JSON-data mot et JSON Schema med draft-bevisst validering og lesbar feilutskrift.",
      },
      pl: {
        name: "Walidator JSON Schema",
        description:
          "Waliduj dane JSON względem JSON Schema z automatycznym wykrywaniem wersji draftu i czytelnymi komunikatami błędów.",
      },
      pt: {
        name: "Validador de JSON Schema",
        description:
          "Valide dados JSON contra um JSON Schema com detecção de rascunho e saída de erros legível.",
      },
      ru: {
        name: "Валидатор JSON Schema",
        description:
          "Проверяйте данные JSON по JSON Schema с автоопределением черновика и читаемым выводом ошибок.",
      },
      sv: {
        name: "JSON Schema-validerare",
        description:
          "Validera JSON-data mot ett JSON Schema med draft-medveten validering och läsbar felutskrift.",
      },
      th: {
        name: "ตัวตรวจสอบ JSON Schema",
        description:
          "ตรวจสอบข้อมูล JSON เทียบกับ JSON Schema พร้อมการตรวจจับ draft และผลลัพธ์ข้อผิดพลาดที่อ่านง่าย",
      },
      tr: {
        name: "JSON Schema Doğrulayıcı",
        description:
          "JSON verilerini, taslak farkındalıklı doğrulama ve okunabilir hata çıktısı ile bir JSON Schema'ya karşı doğrulayın.",
      },
      vi: {
        name: "Trình xác thực JSON Schema",
        description:
          "Xác thực dữ liệu JSON theo JSON Schema với khả năng nhận diện draft và xuất lỗi dễ đọc.",
      },
      "zh-CN": {
        name: "JSON Schema 校验器",
        description:
          "根据 JSON Schema 校验 JSON 数据，支持草案识别，并输出可读的错误信息。",
      },
      "zh-TW": {
        name: "JSON Schema 驗證器",
        description:
          "依據 JSON Schema 驗證 JSON 資料，支援草案偵測並輸出易讀的錯誤訊息。",
      },
    },
  },
  {
    slug: "json-to-csv-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "json", "csv", "converter"],
    locales: {
      ar: {
        name: "محول JSON → CSV",
        description:
          "حوّل JSON إلى CSV. الصق JSON أو استورد ملفًا؛ اضبط الخيارات، عاين، انسخ ونزّل.",
      },
      de: {
        name: "JSON → CSV Konverter",
        description:
          "Wandelt JSON in CSV um. JSON einfügen oder Datei importieren; Optionen anpassen, Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "JSON → CSV Converter",
        description:
          "Convert JSON to CSV. Paste JSON or import a file; adjust options, preview, copy, and download.",
      },
      es: {
        name: "Convertidor JSON → CSV",
        description:
          "Convierte JSON a CSV. Pega JSON o importa un archivo; ajusta opciones, previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur JSON → CSV",
        description:
          "Convertissez JSON en CSV. Collez du JSON ou importez un fichier ; réglez les options, prévisualisez, copiez et téléchargez.",
      },
      he: {
        name: "ממיר JSON → CSV",
        description:
          "המרת JSON ל‑CSV. הדביקו JSON או ייבאו קובץ; התאימו אפשרויות, תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "JSON → CSV परिवर्तक",
        description:
          "JSON को CSV में बदलें। JSON पेस्ट करें या फ़ाइल आयात करें; विकल्प समायोजित करें, पूर्वावलोकन करें, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi JSON → CSV",
        description:
          "Konversi JSON ke CSV. Tempel JSON atau impor berkas; sesuaikan opsi, pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore JSON → CSV",
        description:
          "Converti JSON in CSV. Incolla JSON o importa un file; regola le opzioni, anteprima, copia e download.",
      },
      ja: {
        name: "JSON → CSV 変換",
        description:
          "JSON を CSV に変換。JSON を貼り付けるかファイルを読み込み、オプション調整、プレビュー、コピー、ダウンロード。",
      },
      ko: {
        name: "JSON → CSV 변환기",
        description:
          "JSON을 CSV로 변환합니다. JSON 붙여넣기 또는 파일 가져오기; 옵션 조정, 미리보기, 복사 및 다운로드.",
      },
      ms: {
        name: "Penukar JSON → CSV",
        description:
          "Tukar JSON kepada CSV. Tampal JSON atau import fail; laraskan pilihan, pratonton, salin dan muat turun.",
      },
      nl: {
        name: "JSON → CSV-converter",
        description:
          "Zet JSON om naar CSV. Plak JSON of importeer een bestand; stel opties in, bekijk, kopieer en download.",
      },
      no: {
        name: "JSON → CSV-omformer",
        description:
          "Konverter JSON til CSV. Lim inn JSON eller importer en fil; juster alternativer, forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter JSON → CSV",
        description:
          "Konwertuj JSON na CSV. Wklej JSON lub zaimportuj plik; dostosuj opcje, podglądaj, kopiuj i pobieraj.",
      },
      pt: {
        name: "Conversor JSON → CSV",
        description:
          "Converta JSON para CSV. Cole JSON ou importe um arquivo; ajuste opções, visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер JSON → CSV",
        description:
          "Преобразуйте JSON в CSV. Вставьте JSON или импортируйте файл; настройте опции, просматривайте, копируйте и загружайте.",
      },
      sv: {
        name: "JSON → CSV-omvandlare",
        description:
          "Konvertera JSON till CSV. Klistra in JSON eller importera en fil; justera alternativ, förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง JSON → CSV",
        description:
          "แปลง JSON เป็น CSV วาง JSON หรือ นำเข้าไฟล์; ปรับตัวเลือก แสดงตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "JSON → CSV Dönüştürücü",
        description:
          "JSON’i CSV’ye dönüştürün. JSON yapıştırın veya dosya içe aktarın; seçenekleri ayarlayın, önizleyin, kopyalayın ve indirin.",
      },
      vi: {
        name: "Trình chuyển JSON → CSV",
        description:
          "Chuyển JSON sang CSV. Dán JSON hoặc nhập tệp; điều chỉnh tùy chọn, xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "JSON 转 CSV 转换器",
        description:
          "将 JSON 转为 CSV。粘贴 JSON 或导入文件；调整选项、预览、复制并下载。",
      },
      "zh-TW": {
        name: "JSON 轉 CSV 轉換器",
        description:
          "將 JSON 轉為 CSV。貼上 JSON 或匯入檔案；調整選項、預覽、複製並下載。",
      },
    },
  },
  {
    slug: "json-to-toml-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "json", "toml", "converter"],
    locales: {
      ar: {
        name: "محول JSON → TOML",
        description:
          "حوّل JSON إلى TOML. الصق JSON أو استورد ملفًا؛ معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "JSON → TOML Konverter",
        description:
          "Wandelt JSON in TOML um. JSON einfügen oder Datei importieren; Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "JSON → TOML Converter",
        description:
          "Convert JSON to TOML. Paste JSON or import a file; preview, copy, and download.",
      },
      es: {
        name: "Convertidor JSON → TOML",
        description:
          "Convierte JSON a TOML. Pega JSON o importa un archivo; previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur JSON → TOML",
        description:
          "Convertissez JSON en TOML. Collez du JSON ou importez un fichier ; aperçu, copie et téléchargement.",
      },
      he: {
        name: "ממיר JSON → TOML",
        description:
          "המרת JSON ל‑TOML. הדביקו JSON או ייבאו קובץ; תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "JSON → TOML परिवर्तक",
        description:
          "JSON को TOML में बदलें। JSON पेस्ट करें या फ़ाइल आयात करें; पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi JSON → TOML",
        description:
          "Konversi JSON ke TOML. Tempel JSON atau impor berkas; pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore JSON → TOML",
        description:
          "Converti JSON in TOML. Incolla JSON o importa un file; anteprima, copia e download.",
      },
      ja: {
        name: "JSON → TOML 変換",
        description:
          "JSON を TOML に変換。JSON を貼り付けるかファイルを読み込み、プレビュー・コピー・ダウンロード。",
      },
      ko: {
        name: "JSON → TOML 변환기",
        description:
          "JSON을 TOML로 변환합니다. JSON 붙여넣기 또는 파일 가져오기; 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Penukar JSON → TOML",
        description:
          "Tukar JSON kepada TOML. Tampal JSON atau import fail; pratonton, salin dan muat turun.",
      },
      nl: {
        name: "JSON → TOML-converter",
        description:
          "Zet JSON om naar TOML. Plak JSON of importeer een bestand; bekijk, kopieer en download.",
      },
      no: {
        name: "JSON → TOML-omformer",
        description:
          "Konverter JSON til TOML. Lim inn JSON eller importer en fil; forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter JSON → TOML",
        description:
          "Konwertuj JSON na TOML. Wklej JSON lub zaimportuj plik; podgląd, kopiowanie i pobieranie.",
      },
      pt: {
        name: "Conversor JSON → TOML",
        description:
          "Converta JSON para TOML. Cole JSON ou importe um arquivo; visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер JSON → TOML",
        description:
          "Преобразуйте JSON в TOML. Вставьте JSON или импортируйте файл; просмотр, копирование и загрузка.",
      },
      sv: {
        name: "JSON → TOML-omvandlare",
        description:
          "Konvertera JSON till TOML. Klistra in JSON eller importera en fil; förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง JSON → TOML",
        description:
          "แปลง JSON เป็น TOML วาง JSON หรือ นำเข้าไฟล์; ดูตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "JSON → TOML Dönüştürücü",
        description:
          "JSON’u TOML’a dönüştürün. JSON yapıştırın وya dosya içe aktarın; önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình chuyển JSON → TOML",
        description:
          "Chuyển JSON sang TOML. Dán JSON hoặc nhập tệp; xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "JSON 转 TOML 转换器",
        description:
          "将 JSON 转为 TOML。粘贴 JSON 或导入文件；预览、复制并下载。",
      },
      "zh-TW": {
        name: "JSON 轉 TOML 轉換器",
        description:
          "將 JSON 轉為 TOML。貼上 JSON 或匯入檔案；預覽、複製並下載。",
      },
    },
  },
  {
    slug: "json-to-xml-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "json", "xml", "converter"],
    locales: {
      ar: {
        name: "محول JSON → XML",
        description:
          "حوّل JSON إلى XML. الصق JSON أو استورد ملفًا؛ معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "JSON → XML Konverter",
        description:
          "Wandelt JSON in XML um. JSON einfügen oder Datei importieren; Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "JSON → XML Converter",
        description:
          "Convert JSON to XML. Paste JSON or import a file; preview, copy, and download.",
      },
      es: {
        name: "Convertidor JSON → XML",
        description:
          "Convierte JSON a XML. Pega JSON o importa un archivo; previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur JSON → XML",
        description:
          "Convertissez JSON en XML. Collez du JSON ou importez un fichier ; aperçu, copie et téléchargement.",
      },
      he: {
        name: "ממיר JSON → XML",
        description:
          "המרת JSON ל‑XML. הדביקו JSON או ייבאו קובץ; תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "JSON → XML परिवर्तक",
        description:
          "JSON को XML में बदलें। JSON पेस्ट करें या फ़ाइल आयात करें; पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi JSON → XML",
        description:
          "Konversi JSON ke XML. Tempel JSON atau impor berkas; pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore JSON → XML",
        description:
          "Converti JSON in XML. Incolla JSON o importa un file; anteprima, copia e download.",
      },
      ja: {
        name: "JSON → XML 変換",
        description:
          "JSON を XML に変換。JSON を貼り付けるかファイルを読み込み、プレビュー・コピー・ダウンロード。",
      },
      ko: {
        name: "JSON → XML 변환기",
        description:
          "JSON을 XML로 변환합니다. JSON 붙여넣기 또는 파일 가져오기; 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Penukar JSON → XML",
        description:
          "Tukar JSON kepada XML. Tampal JSON atau import fail; pratonton, salin dan muat turun.",
      },
      nl: {
        name: "JSON → XML-converter",
        description:
          "Zet JSON om naar XML. Plak JSON of importeer een bestand; bekijk, kopieer en download.",
      },
      no: {
        name: "JSON → XML-omformer",
        description:
          "Konverter JSON til XML. Lim inn JSON eller importer en fil; forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter JSON → XML",
        description:
          "Konwertuj JSON na XML. Wklej JSON lub zaimportuj plik; podgląd, kopiowanie i pobieranie.",
      },
      pt: {
        name: "Conversor JSON → XML",
        description:
          "Converta JSON para XML. Cole JSON ou importe um arquivo; visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер JSON → XML",
        description:
          "Преобразуйте JSON в XML. Вставьте JSON или импортируйте файл; просмотр, копирование и загрузка.",
      },
      sv: {
        name: "JSON → XML-omvandlare",
        description:
          "Konvertera JSON till XML. Klistra in JSON eller importera en fil; förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง JSON → XML",
        description:
          "แปลง JSON เป็น XML วาง JSON หรือ นำเข้าไฟล์; ดูตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "JSON → XML Dönüştürücü",
        description:
          "JSON’u XML’a dönüştürün. JSON yapıştırın وya dosya içe aktarın; önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình chuyển JSON → XML",
        description:
          "Chuyển JSON sang XML. Dán JSON hoặc nhập tệp; xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "JSON 转 XML 转换器",
        description:
          "将 JSON 转为 XML。粘贴 JSON 或导入文件；预览、复制并下载。",
      },
      "zh-TW": {
        name: "JSON 轉 XML 轉換器",
        description:
          "將 JSON 轉為 XML。貼上 JSON 或匯入檔案；預覽、複製並下載。",
      },
    },
  },
  {
    slug: "json-to-yaml-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "json", "yaml", "converter"],
    locales: {
      ar: {
        name: "محول JSON → YAML",
        description:
          "حوّل JSON إلى YAML. الصق JSON أو استورد ملفًا؛ معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "JSON → YAML Konverter",
        description:
          "Wandelt JSON in YAML um. JSON einfügen oder Datei importieren; Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "JSON → YAML Converter",
        description:
          "Convert JSON to YAML. Paste JSON or import a file; preview, copy, and download.",
      },
      es: {
        name: "Convertidor JSON → YAML",
        description:
          "Convierte JSON a YAML. Pega JSON o importa un archivo; previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur JSON → YAML",
        description:
          "Convertissez JSON en YAML. Collez du JSON ou importez un fichier ; aperçu, copie et téléchargement.",
      },
      he: {
        name: "ממיר JSON → YAML",
        description:
          "המרת JSON ל‑YAML. הדביקו JSON או ייבאו קובץ; תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "JSON → YAML परिवर्तक",
        description:
          "JSON को YAML में बदलें। JSON पेस्ट करें या फ़ाइल आयात करें; पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi JSON → YAML",
        description:
          "Konversi JSON ke YAML. Tempel JSON atau impor berkas; pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore JSON → YAML",
        description:
          "Converti JSON in YAML. Incolla JSON o importa un file; anteprima, copia e download.",
      },
      ja: {
        name: "JSON → YAML 変換",
        description:
          "JSON を YAML に変換。JSON を貼り付けるかファイルを読み込み、プレビュー・コピー・ダウンロード。",
      },
      ko: {
        name: "JSON → YAML 변환기",
        description:
          "JSON을 YAML로 변환합니다. JSON 붙여넣기 또는 파일 가져오기; 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Penukar JSON → YAML",
        description:
          "Tukar JSON kepada YAML. Tampal JSON atau import fail; pratonton, salin dan muat turun.",
      },
      nl: {
        name: "JSON → YAML-converter",
        description:
          "Zet JSON om naar YAML. Plak JSON of importeer een bestand; bekijk, kopieer en download.",
      },
      no: {
        name: "JSON → YAML-omformer",
        description:
          "Konverter JSON til YAML. Lim inn JSON eller importer en fil; forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter JSON → YAML",
        description:
          "Konwertuj JSON na YAML. Wklej JSON lub zaimportuj plik; podgląd, kopiowanie i pobieranie.",
      },
      pt: {
        name: "Conversor JSON → YAML",
        description:
          "Converta JSON para YAML. Cole JSON ou importe um arquivo; visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер JSON → YAML",
        description:
          "Преобразуйте JSON в YAML. Вставьте JSON или импортируйте файл; просмотр, копирование и загрузка.",
      },
      sv: {
        name: "JSON → YAML-omvandlare",
        description:
          "Konvertera JSON till YAML. Klistra in JSON eller importera en fil; förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง JSON → YAML",
        description:
          "แปลง JSON เป็น YAML วาง JSON หรือ นำเข้าไฟล์; ดูตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "JSON → YAML Dönüştürücü",
        description:
          "JSON’u YAML’a dönüştürün. JSON yapıştırın veya dosya içe aktarın; önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình chuyển JSON → YAML",
        description:
          "Chuyển JSON sang YAML. Dán JSON hoặc nhập tệp; xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "JSON 转 YAML 转换器",
        description:
          "将 JSON 转为 YAML。粘贴 JSON 或导入文件；预览、复制并下载。",
      },
      "zh-TW": {
        name: "JSON 轉 YAML 轉換器",
        description:
          "將 JSON 轉為 YAML。貼上 JSON 或匯入檔案；預覽、複製並下載。",
      },
    },
  },
  {
    slug: "jsonpath-tester",
    category: "json",
    icon: "search",
    tags: ["code", "jsonpath", "json", "query", "filter", "selector", "data"],
    locales: {
      ar: {
        name: "مختبر JSONPath",
        description:
          "اختبر استعلامات JSONPath على بيانات JSON واعرض القيم والمسارات المطابقة.",
      },
      de: {
        name: "JSONPath-Tester",
        description:
          "Teste JSONPath-Abfragen auf JSON-Daten und zeige passende Werte und Pfade an.",
      },
      en: {
        name: "JSONPath Tester",
        description:
          "Test JSONPath queries against JSON data and view matched values and paths.",
      },
      es: {
        name: "Probador de JSONPath",
        description:
          "Prueba consultas JSONPath en datos JSON y visualiza valores y rutas coincidentes.",
      },
      fr: {
        name: "Testeur JSONPath",
        description:
          "Testez des requêtes JSONPath sur des données JSON et affichez les valeurs et chemins correspondants.",
      },
      he: {
        name: "בודק JSONPath",
        description:
          "בדוק שאילתות JSONPath על נתוני JSON והצג ערכים ונתיבים תואמים.",
      },
      hi: {
        name: "JSONPath परीक्षक",
        description: "JSON डेटा पर JSONPath क्वेरी चलाएँ और मेल खाते मान व पथ देखें।",
      },
      id: {
        name: "Penguji JSONPath",
        description:
          "Uji kueri JSONPath pada data JSON dan lihat nilai serta jalur yang cocok.",
      },
      it: {
        name: "Tester JSONPath",
        description:
          "Testa query JSONPath su dati JSON e visualizza valori e percorsi corrispondenti.",
      },
      ja: {
        name: "JSONPath テスター",
        description:
          "JSON データに対して JSONPath クエリを実行し、一致した値とパスを表示します。",
      },
      ko: {
        name: "JSONPath 테스트기",
        description:
          "JSON 데이터에 JSONPath 쿼리를 실행하고 일치하는 값과 경로를 확인합니다.",
      },
      ms: {
        name: "Penguji JSONPath",
        description:
          "Uji pertanyaan JSONPath pada data JSON dan lihat nilai serta laluan yang sepadan.",
      },
      nl: {
        name: "JSONPath-tester",
        description:
          "Test JSONPath-query's op JSON-data en bekijk overeenkomende waarden en paden.",
      },
      no: {
        name: "JSONPath-tester",
        description:
          "Test JSONPath-spørringer på JSON-data og se samsvarende verdier og stier.",
      },
      pl: {
        name: "Tester JSONPath",
        description:
          "Testuj zapytania JSONPath na danych JSON i wyświetl pasujące wartości oraz ścieżki.",
      },
      pt: {
        name: "Testador de JSONPath",
        description:
          "Teste consultas JSONPath em dados JSON e visualize valores e caminhos correspondentes.",
      },
      ru: {
        name: "Тестер JSONPath",
        description:
          "Проверяйте запросы JSONPath на данных JSON и просматривайте совпавшие значения и пути.",
      },
      sv: {
        name: "JSONPath-testare",
        description:
          "Testa JSONPath-frågor på JSON-data och visa matchande värden och sökvägar.",
      },
      th: {
        name: "เครื่องมือทดสอบ JSONPath",
        description: "ทดสอบคำสั่ง JSONPath กับข้อมูล JSON และดูค่ากับเส้นทางที่ตรงกัน",
      },
      tr: {
        name: "JSONPath Test Aracı",
        description:
          "JSON verileri üzerinde JSONPath sorgularını test edin ve eşleşen değerleri ile yolları görüntüleyin.",
      },
      vi: {
        name: "Trình kiểm tra JSONPath",
        description:
          "Kiểm tra truy vấn JSONPath trên dữ liệu JSON và xem các giá trị cùng đường dẫn khớp.",
      },
      "zh-CN": {
        name: "JSONPath 测试器",
        description: "对 JSON 数据运行 JSONPath 查询，查看匹配的值和路径。",
      },
      "zh-TW": {
        name: "JSONPath 測試器",
        description: "對 JSON 資料執行 JSONPath 查詢，檢視匹配的值與路徑。",
      },
    },
  },
  {
    slug: "jwk-pem-converter",
    category: "web",
    icon: "lock",
    tags: [
      "jwk",
      "pem",
      "key",
      "rsa",
      "ec",
      "okp",
      "ed25519",
      "x25519",
      "crypto",
      "convert",
      "security",
    ],
    locales: {
      ar: {
        name: "محول JWK ↔ PEM",
        description:
          "حوّل مفاتيح JWK وPEM محليًا. يدعم تنسيقات مفاتيح RSA وEC وOKP.",
      },
      de: {
        name: "JWK ↔ PEM Konverter",
        description:
          "Konvertiert JWK- und PEM-Schlüssel lokal. Unterstützt RSA-, EC- und OKP-Schlüsselformate.",
      },
      en: {
        name: "JWK ↔ PEM Converter",
        description:
          "Convert JWK and PEM keys locally. Supports RSA, EC, and OKP key formats.",
      },
      es: {
        name: "Conversor JWK ↔ PEM",
        description:
          "Convierte claves JWK y PEM localmente. Compatible con formatos de clave RSA, EC y OKP.",
      },
      fr: {
        name: "Convertisseur JWK ↔ PEM",
        description:
          "Convertit les clés JWK et PEM localement. Prend en charge les formats de clés RSA, EC et OKP.",
      },
      he: {
        name: "ממיר JWK ↔ PEM",
        description:
          "ממיר מפתחות JWK ו‑PEM מקומית. תומך בפורמטי מפתחות RSA, EC ו‑OKP.",
      },
      hi: {
        name: "JWK ↔ PEM कन्वर्टर",
        description:
          "JWK और PEM कुंजियों को लोकली कन्वर्ट करें। RSA, EC और OKP कुंजी फ़ॉर्मैट समर्थित।",
      },
      id: {
        name: "Konverter JWK ↔ PEM",
        description:
          "Konversi kunci JWK dan PEM secara lokal. Mendukung format kunci RSA, EC, dan OKP.",
      },
      it: {
        name: "Convertitore JWK ↔ PEM",
        description:
          "Converte chiavi JWK e PEM in locale. Supporta i formati di chiave RSA, EC e OKP.",
      },
      ja: {
        name: "JWK ↔ PEM 変換",
        description:
          "JWK と PEM の鍵をローカルで変換します。RSA、EC、OKP の鍵形式に対応。",
      },
      ko: {
        name: "JWK ↔ PEM 변환기",
        description:
          "JWK와 PEM 키를 로컬에서 변환합니다. RSA, EC, OKP 키 형식을 지원합니다.",
      },
      ms: {
        name: "Penukar JWK ↔ PEM",
        description:
          "Tukar kunci JWK dan PEM secara tempatan. Menyokong format kunci RSA, EC dan OKP.",
      },
      nl: {
        name: "JWK ↔ PEM-converter",
        description:
          "Converteer JWK- en PEM-sleutels lokaal. Ondersteunt RSA-, EC- en OKP-sleutelformaten.",
      },
      no: {
        name: "JWK ↔ PEM-konverter",
        description:
          "Konverter JWK- og PEM-nøkler lokalt. Støtter RSA-, EC- og OKP-nøkkelformater.",
      },
      pl: {
        name: "Konwerter JWK ↔ PEM",
        description:
          "Lokalna konwersja kluczy JWK i PEM. Obsługuje formaty kluczy RSA, EC i OKP.",
      },
      pt: {
        name: "Conversor JWK ↔ PEM",
        description:
          "Converta chaves JWK e PEM localmente. Suporta formatos de chave RSA, EC e OKP.",
      },
      ru: {
        name: "Конвертер JWK ↔ PEM",
        description:
          "Локально преобразует ключи JWK и PEM. Поддерживает форматы ключей RSA, EC и OKP.",
      },
      sv: {
        name: "JWK ↔ PEM-omvandlare",
        description:
          "Konvertera JWK- och PEM-nycklar lokalt. Stöd för RSA-, EC- och OKP-nyckelformat.",
      },
      th: {
        name: "ตัวแปลง JWK ↔ PEM",
        description: "แปลงคีย์ JWK และ PEM แบบโลคัล รองรับรูปแบบคีย์ RSA, EC และ OKP",
      },
      tr: {
        name: "JWK ↔ PEM Dönüştürücü",
        description:
          "JWK ve PEM anahtarlarını yerelde dönüştürür. RSA, EC ve OKP anahtar biçimlerini destekler.",
      },
      vi: {
        name: "Trình chuyển đổi JWK ↔ PEM",
        description:
          "Chuyển đổi khóa JWK và PEM cục bộ. Hỗ trợ các định dạng khóa RSA, EC và OKP.",
      },
      "zh-CN": {
        name: "JWK ↔ PEM 转换器",
        description: "本地转换 JWK 与 PEM 密钥，支持 RSA、EC 与 OKP 密钥格式",
      },
      "zh-TW": {
        name: "JWK ↔ PEM 轉換器",
        description: "在本機轉換 JWK 與 PEM 金鑰，支援 RSA、EC 與 OKP 金鑰格式",
      },
    },
  },
  {
    slug: "keccak-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "keccak",
      "keccak-256",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة Keccak للنص أو الملف",
        description:
          "إنشاء تجزئة Keccak لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "Keccak-Hash für Text oder Datei",
        description:
          "Generieren Sie Keccak-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "Keccak Hash Text or File",
        description:
          "Generate Keccak hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash Keccak de Texto o Archivo",
        description:
          "Genera hash Keccak para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash Keccak de Texte ou Fichier",
        description:
          "Générez un hash Keccak pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש Keccak טקסט או קובץ",
        description:
          "צור האש Keccak עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "Keccak हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए Keccak हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash Keccak Teks atau File",
        description:
          "Buat hash Keccak untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash Keccak di Testo o File",
        description:
          "Genera hash Keccak per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "Keccak ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのKeccakハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "Keccak 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 Keccak 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash Keccak Teks atau Fail",
        description:
          "Jana hash Keccak untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "Keccak-hash tekst of bestand",
        description:
          "Genereer Keccak-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "Keccak-hash tekst eller fil",
        description:
          "Generer Keccak-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash Keccak tekstu lub pliku",
        description:
          "Generuj hash Keccak dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash Keccak de Texto ou Arquivo",
        description:
          "Gere hash Keccak para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "Keccak-хеш текста или файла",
        description:
          "Генерируйте Keccak-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "Keccak-hash text eller fil",
        description:
          "Generera Keccak-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช Keccak ข้อความหรือไฟล์",
        description:
          "สร้างแฮช Keccak สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "Keccak Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için Keccak hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash Keccak văn bản hoặc tệp",
        description:
          "Tạo hash Keccak cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "Keccak 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 Keccak 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "Keccak 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 Keccak 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "ksuid-generator",
    category: "developer",
    icon: "lock",
    tags: [
      "ksuid",
      "id",
      "identifier",
      "unique",
      "sortable",
      "timestamp",
      "random",
      "generator",
      "uuid",
      "ulid",
    ],
    locales: {
      ar: {
        name: "مولد KSUID",
        description:
          "أنشئ معرفات فريدة قابلة للفرز (KSUID) في المتصفح مع طابع زمني اختياري.",
      },
      de: {
        name: "KSUID-Generator",
        description:
          "Erzeuge sortierbare eindeutige Kennungen (KSUID) im Browser mit optionalem Zeitstempel.",
      },
      en: {
        name: "KSUID Generator",
        description:
          "Generate K-Sortable Unique Identifiers (KSUIDs) in-browser with optional custom timestamps.",
      },
      es: {
        name: "Generador de KSUID",
        description:
          "Genera identificadores únicos ordenables (KSUID) en el navegador con marca de tiempo opcional.",
      },
      fr: {
        name: "Générateur de KSUID",
        description:
          "Générez des identifiants uniques triables (KSUID) dans le navigateur avec horodatage optionnel.",
      },
      he: {
        name: "מחולל KSUID",
        description:
          "צור מזהים ייחודיים ניתנים למיון (KSUID) בדפדפן עם חותמת זמן אופציונלית.",
      },
      hi: {
        name: "KSUID जनरेटर",
        description:
          "ब्राउज़र में KSUID (क्रमबद्ध होने योग्य यूनिक आईडी) बनाएँ, वैकल्पिक टाइमस्टैम्प के साथ।",
      },
      id: {
        name: "Generator KSUID",
        description:
          "Hasilkan pengenal unik yang dapat diurutkan (KSUID) di browser dengan cap waktu opsional.",
      },
      it: {
        name: "Generatore di KSUID",
        description:
          "Genera identificatori univoci ordinabili (KSUID) nel browser con timestamp opzionale.",
      },
      ja: {
        name: "KSUIDジェネレーター",
        description:
          "ブラウザ内でKSUID（並べ替え可能な一意ID）を生成。任意のタイムスタンプに対応。",
      },
      ko: {
        name: "KSUID 생성기",
        description:
          "브라우저에서 KSUID(정렬 가능한 고유 ID)를 생성하고 선택적으로 타임스탬프를 지정합니다.",
      },
      ms: {
        name: "Penjana KSUID",
        description:
          "Jana pengecam unik boleh diisih (KSUID) dalam pelayar dengan cap masa pilihan.",
      },
      nl: {
        name: "KSUID-generator",
        description:
          "Genereer sorteerbare unieke identifiers (KSUID) in de browser met optionele tijdstempel.",
      },
      no: {
        name: "KSUID-generator",
        description:
          "Generer sorterbare unike identifikatorer (KSUID) i nettleseren med valgfri tidsstempel.",
      },
      pl: {
        name: "Generator KSUID",
        description:
          "Generuj sortowalne unikalne identyfikatory (KSUID) w przeglądarce z opcjonalnym znacznikiem czasu.",
      },
      pt: {
        name: "Gerador de KSUID",
        description:
          "Gere identificadores únicos ordenáveis (KSUID) no navegador com carimbo de data/hora opcional.",
      },
      ru: {
        name: "Генератор KSUID",
        description:
          "Создавайте сортируемые уникальные идентификаторы (KSUID) в браузере с необязательной временной меткой.",
      },
      sv: {
        name: "KSUID-generator",
        description:
          "Skapa sorterbara unika identifierare (KSUID) i webbläsaren med valfri tidsstämpel.",
      },
      th: {
        name: "ตัวสร้าง KSUID",
        description:
          "สร้างตัวระบุไม่ซ้ำที่จัดเรียงได้ (KSUID) ในเบราว์เซอร์ พร้อมตัวประทับเวลาแบบเลือกได้.",
      },
      tr: {
        name: "KSUID Oluşturucu",
        description:
          "Tarayıcıda sıralanabilir benzersiz tanımlayıcılar (KSUID) üretin, isteğe bağlı zaman damgasıyla.",
      },
      vi: {
        name: "Trình tạo KSUID",
        description:
          "Tạo định danh duy nhất có thể sắp xếp (KSUID) trong trình duyệt với dấu thời gian tùy chọn.",
      },
      "zh-CN": {
        name: "KSUID 生成器",
        description:
          "在浏览器内生成 KSUID（可排序唯一标识），支持自定义时间戳。",
      },
      "zh-TW": {
        name: "KSUID 產生器",
        description:
          "在瀏覽器內產生 KSUID（可排序的唯一識別），支援自訂時間戳。",
      },
    },
  },
  {
    slug: "list-comparer",
    category: "text",
    icon: "file-text",
    tags: ["list", "compare", "diff", "dedupe", "text"],
    locales: {
      ar: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      de: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      en: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      es: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      fr: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      he: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      hi: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      id: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      it: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      ja: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      ko: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      ms: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      nl: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      no: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      pl: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      pt: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      ru: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      sv: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      th: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      tr: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      vi: {
        name: "List Comparer",
        description:
          "Compare two lists, surface overlap and exclusions, and export the exact set you need before a sync or cleanup.",
      },
      "zh-CN": {
        name: "列表比较",
        description:
          "比较两份列表，找出重合项、差异项和重复项，并导出你真正要处理的结果集。",
      },
      "zh-TW": {
        name: "列表比較",
        description:
          "比較兩份列表，找出重疊項、差異項與重複項，並匯出你真正要處理的結果集。",
      },
    },
  },
  {
    slug: "local-font-book",
    category: "web",
    icon: "globe",
    tags: ["web", "font", "typography", "local-fonts", "design", "reference"],
    locales: {
      ar: {
        name: "كتالوج الخطوط المحلية",
        description:
          "استعرض الخطوط المثبتة على جهازك وعاينها باستخدام Local Font Access.",
      },
      de: {
        name: "Lokales Schriftartenbuch",
        description:
          "Durchsuchen und Vorschau der lokal installierten Schriften mit Local Font Access.",
      },
      en: {
        name: "Local Font Book",
        description:
          "Browse and preview fonts installed on your device using the Local Font Access API.",
      },
      es: {
        name: "Catálogo de fuentes locales",
        description:
          "Explora y previsualiza las fuentes instaladas en tu dispositivo con Local Font Access.",
      },
      fr: {
        name: "Catalogue des polices locales",
        description:
          "Parcourez et prévisualisez les polices installées sur votre appareil via Local Font Access.",
      },
      he: {
        name: "קטלוג גופנים מקומיים",
        description:
          "עיין וראה תצוגה מקדימה של גופנים מותקנים באמצעות Local Font Access.",
      },
      hi: {
        name: "लोकल फ़ॉन्ट कैटलॉग",
        description:
          "Local Font Access API से डिवाइस पर मौजूद फ़ॉन्ट्स ब्राउज़ और प्रीव्यू करें।",
      },
      id: {
        name: "Katalog font lokal",
        description:
          "Telusuri dan pratinjau font yang terpasang di perangkat dengan Local Font Access.",
      },
      it: {
        name: "Catalogo dei font locali",
        description:
          "Sfoglia e visualizza in anteprima i font installati sul dispositivo con Local Font Access.",
      },
      ja: {
        name: "ローカルフォントカタログ",
        description:
          "Local Font Access API で端末のフォントを閲覧・プレビューします。",
      },
      ko: {
        name: "로컬 폰트 카탈로그",
        description:
          "Local Font Access API로 기기에 설치된 폰트를 찾아 미리보기합니다.",
      },
      ms: {
        name: "Katalog fon tempatan",
        description:
          "Semak imbas dan pratonton fon yang dipasang pada peranti menggunakan Local Font Access.",
      },
      nl: {
        name: "Lokale lettertypecatalogus",
        description:
          "Blader door en bekijk geïnstalleerde lettertypen met Local Font Access.",
      },
      no: {
        name: "Katalog over lokale fonter",
        description:
          "Bla gjennom og forhåndsvis fonter installert på enheten med Local Font Access.",
      },
      pl: {
        name: "Katalog lokalnych fontów",
        description:
          "Przeglądaj i podglądaj fonty zainstalowane na urządzeniu dzięki Local Font Access.",
      },
      pt: {
        name: "Catálogo de fontes locais",
        description:
          "Navegue e visualize as fontes instaladas no seu dispositivo com o Local Font Access.",
      },
      ru: {
        name: "Каталог локальных шрифтов",
        description:
          "Просматривайте и предварительно просматривайте установленные на устройстве шрифты через Local Font Access.",
      },
      sv: {
        name: "Katalog över lokala typsnitt",
        description:
          "Bläddra och förhandsgranska installerade typsnitt med Local Font Access.",
      },
      th: {
        name: "แคตตาล็อกฟอนต์ในเครื่อง",
        description: "เรียกดูและพรีวิวฟอนต์ที่ติดตั้งในอุปกรณ์ด้วย Local Font Access.",
      },
      tr: {
        name: "Yerel Yazı Tipi Kataloğu",
        description:
          "Local Font Access ile cihazınızdaki yazı tiplerini tarayın ve önizleyin.",
      },
      vi: {
        name: "Sổ tay phông chữ cục bộ",
        description:
          "Duyệt và xem trước phông chữ cài trên thiết bị bằng Local Font Access.",
      },
      "zh-CN": {
        name: "本地字体册",
        description: "使用 Local Font Access API 浏览并预览设备上的字体。",
      },
      "zh-TW": {
        name: "本地字型冊",
        description: "使用 Local Font Access API 瀏覽並預覽裝置上的字型。",
      },
    },
  },
  {
    slug: "lorem-ipsum-generator",
    category: "text",
    icon: "file-text",
    tags: [
      "lorem",
      "ipsum",
      "placeholder",
      "dummy",
      "text",
      "generator",
      "copywriting",
      "layout",
    ],
    locales: {
      ar: {
        name: "مولد Lorem Ipsum",
        description:
          "أنشئ نص Lorem Ipsum البديل بكلمات أو جمل أو فقرات قابلة للتخصيص. يدعم لغات متعددة.",
      },
      de: {
        name: "Lorem Ipsum Generator",
        description:
          "Generieren Sie Lorem Ipsum Platzhaltertext mit konfigurierbaren Wörtern, Sätzen oder Absätzen. Unterstützt mehrere Sprachen.",
      },
      en: {
        name: "Lorem Ipsum Generator",
        description:
          "Generate Lorem Ipsum placeholder text with configurable words, sentences, or paragraphs. Supports multiple locales.",
      },
      es: {
        name: "Generador de Lorem Ipsum",
        description:
          "Genera texto de relleno Lorem Ipsum con palabras, oraciones o párrafos configurables. Soporta múltiples idiomas.",
      },
      fr: {
        name: "Générateur Lorem Ipsum",
        description:
          "Générez du texte de remplissage Lorem Ipsum avec des mots, phrases ou paragraphes configurables. Prend en charge plusieurs langues.",
      },
      he: {
        name: "מחולל Lorem Ipsum",
        description:
          "צור טקסט ממלא מקום Lorem Ipsum עם מילים, משפטים או פסקאות הניתנים להגדרה. תומך במספר שפות.",
      },
      hi: {
        name: "Lorem Ipsum जनरेटर",
        description:
          "कॉन्फ़िगर करने योग्य शब्दों, वाक्यों या पैराग्राफ के साथ Lorem Ipsum प्लेसहोल्डर टेक्स्ट जनरेट करें। कई भाषाओं का समर्थन करता है।",
      },
      id: {
        name: "Generator Lorem Ipsum",
        description:
          "Hasilkan teks placeholder Lorem Ipsum dengan kata, kalimat, atau paragraf yang dapat dikonfigurasi. Mendukung banyak bahasa.",
      },
      it: {
        name: "Generatore Lorem Ipsum",
        description:
          "Genera testo segnaposto Lorem Ipsum con parole, frasi o paragrafi configurabili. Supporta più lingue.",
      },
      ja: {
        name: "Lorem Ipsum ジェネレーター",
        description:
          "単語、文、または段落の数を設定できる Lorem Ipsum プレースホルダーテキストを生成します。複数の言語に対応。",
      },
      ko: {
        name: "Lorem Ipsum 생성기",
        description:
          "단어, 문장 또는 단락 수를 설정할 수 있는 Lorem Ipsum 플레이스홀더 텍스트를 생성합니다. 여러 언어를 지원합니다.",
      },
      ms: {
        name: "Penjana Lorem Ipsum",
        description:
          "Jana teks pemegang tempat Lorem Ipsum dengan perkataan, ayat atau perenggan yang boleh dikonfigurasikan. Menyokong pelbagai bahasa.",
      },
      nl: {
        name: "Lorem Ipsum Generator",
        description:
          "Genereer Lorem Ipsum placeholder tekst met configureerbare woorden, zinnen of alinea's. Ondersteunt meerdere talen.",
      },
      no: {
        name: "Lorem Ipsum-generator",
        description:
          "Generer Lorem Ipsum plassholdertekst med konfigurerbare ord, setninger eller avsnitt. Støtter flere språk.",
      },
      pl: {
        name: "Generator Lorem Ipsum",
        description:
          "Generuj tekst zastępczy Lorem Ipsum z konfigurowalną liczbą słów, zdań lub akapitów. Obsługuje wiele języków.",
      },
      pt: {
        name: "Gerador de Lorem Ipsum",
        description:
          "Gere texto de preenchimento Lorem Ipsum com palavras, frases ou parágrafos configuráveis. Suporta vários idiomas.",
      },
      ru: {
        name: "Генератор Lorem Ipsum",
        description:
          "Генерируйте текст-заполнитель Lorem Ipsum с настраиваемым количеством слов, предложений или абзацев. Поддержка нескольких языков.",
      },
      sv: {
        name: "Lorem Ipsum-generator",
        description:
          "Generera Lorem Ipsum platshållartext med konfigurerbara ord, meningar eller stycken. Stöder flera språk.",
      },
      th: {
        name: "ตัวสร้าง Lorem Ipsum",
        description:
          "สร้างข้อความตัวยึดตำแหน่ง Lorem Ipsum ด้วยจำนวนคำ ประโยค หรือย่อหน้าที่กำหนดได้ รองรับหลายภาษา",
      },
      tr: {
        name: "Lorem Ipsum Oluşturucu",
        description:
          "Yapılandırılabilir kelimeler, cümleler veya paragraflarla Lorem Ipsum yer tutucu metin oluşturun. Birden fazla dili destekler.",
      },
      vi: {
        name: "Trình tạo Lorem Ipsum",
        description:
          "Tạo văn bản giữ chỗ Lorem Ipsum với số từ, câu hoặc đoạn văn có thể cấu hình. Hỗ trợ nhiều ngôn ngữ.",
      },
      "zh-CN": {
        name: "Lorem Ipsum 生成器",
        description:
          "生成 Lorem Ipsum 占位文本，可配置单词、句子或段落数量，支持多种语言。",
      },
      "zh-TW": {
        name: "Lorem Ipsum 產生器",
        description:
          "產生 Lorem Ipsum 佔位文字，可設定單詞、句子或段落數量，支援多種語言。",
      },
    },
  },
  {
    slug: "mac-address-to-ipv6-link-local-address-converter",
    category: "network",
    icon: "network",
    tags: ["mac", "ipv6", "eui-64", "link-local", "network", "converter"],
    locales: {
      ar: {
        name: "محول عنوان MAC إلى عنوان IPv6 المحلي للرابط",
        description:
          "يحول عناوين MAC إلى عناوين IPv6 link local. أدخل أي عنوان MAC للحصول على عنوان IPv6 link local المقابل فوراً.",
      },
      de: {
        name: "Konverter von MAC-Adresse zu IPv6-Link-Local-Adresse",
        description:
          "Konvertiert MAC-Adressen zu IPv6 Link Local Adressen. Geben Sie eine beliebige MAC-Adresse ein, um die entsprechende IPv6 Link Local Adresse sofort zu erhalten.",
      },
      en: {
        name: "MAC Address to IPv6 Link-Local Address Converter",
        description:
          "Convert MAC addresses to IPv6 link-local addresses. Enter any MAC address and optionally add an interface name to generate the scoped result instantly.",
      },
      es: {
        name: "Convertidor de dirección MAC a dirección IPv6 de enlace local",
        description:
          "Convierte direcciones MAC a direcciones IPv6 link local. Introduce cualquier dirección MAC para obtener la dirección IPv6 link local correspondiente al instante.",
      },
      fr: {
        name: "Convertisseur d'adresse MAC en adresse IPv6 de lien local",
        description:
          "Convertit les adresses MAC en adresses IPv6 link local. Saisissez n'importe quelle adresse MAC pour obtenir l'adresse IPv6 link local correspondante instantanément.",
      },
      he: {
        name: "ממיר כתובת MAC לכתובת IPv6 מקומית לקישור",
        description:
          "ממיר כתובות MAC לכתובות IPv6 link local. הזן כל כתובת MAC כדי לקבל את כתובת ה-IPv6 link local המתאימה מיידית.",
      },
      hi: {
        name: "MAC पते से IPv6 लिंक-लोकल पते का कनवर्टर",
        description:
          "MAC पतों को IPv6 लिंक लोकल पतों में परिवर्तित करता है। किसी भी MAC पते को दर्ज करें और संबंधित IPv6 लिंक लोकल पता तुरंत प्राप्त करें।",
      },
      id: {
        name: "Konverter alamat MAC ke alamat IPv6 link-local",
        description:
          "Mengonversi alamat MAC menjadi alamat IPv6 link local. Masukkan alamat MAC apa pun untuk mendapatkan alamat IPv6 link local yang sesuai secara instan.",
      },
      it: {
        name: "Convertitore da indirizzo MAC a indirizzo IPv6 link-local",
        description:
          "Converte indirizzi MAC in indirizzi IPv6 link local. Inserisci qualsiasi indirizzo MAC per ottenere il corrispondente indirizzo IPv6 link local istantaneamente.",
      },
      ja: {
        name: "MAC アドレスから IPv6 リンクローカルアドレスへの変換ツール",
        description:
          "MAC アドレスを IPv6 リンクローカルアドレスに変換します。任意の MAC アドレスを入力すると、対応する IPv6 リンクローカルアドレスを即座に取得できます。",
      },
      ko: {
        name: "MAC 주소를 IPv6 링크 로컬 주소로 변환",
        description:
          "MAC 주소를 IPv6 링크 로컬 주소로 변환합니다. 임의의 MAC 주소를 입력하여 해당하는 IPv6 링크 로컬 주소를 즉시 얻으세요.",
      },
      ms: {
        name: "Penukar alamat MAC kepada alamat IPv6 link-local",
        description:
          "Menukar alamat MAC kepada alamat IPv6 link local. Masukkan mana-mana alamat MAC untuk mendapatkan alamat IPv6 link local yang berkaitan dengan serta-merta.",
      },
      nl: {
        name: "MAC-adres naar IPv6 link-local-adres-converter",
        description:
          "Converteert MAC-adressen naar IPv6 link local adressen. Voer een willekeurig MAC-adres in om het overeenkomstige IPv6 link local adres direct te krijgen.",
      },
      no: {
        name: "Konverterer for MAC-adresse til IPv6 link-local-adresse",
        description:
          "Konverterer MAC-adresser til IPv6 link local-adresser. Skriv inn hvilken som helst MAC-adresse for å få den tilsvarende IPv6 link local-adressen øyeblikkelig.",
      },
      pl: {
        name: "Konwerter adresu MAC na adres IPv6 link-local",
        description:
          "Konwertuje adresy MAC na adresy IPv6 link local. Wprowadź dowolny adres MAC, aby natychmiast uzyskać odpowiadający adres IPv6 link local.",
      },
      pt: {
        name: "Conversor de endereço MAC para endereço IPv6 link-local",
        description:
          "Converte endereços MAC em endereços IPv6 link local. Digite qualquer endereço MAC para obter o endereço IPv6 link local correspondente instantaneamente.",
      },
      ru: {
        name: "Конвертер MAC-адреса в локальный IPv6-адрес канала",
        description:
          "Преобразует MAC-адреса в IPv6 link local адреса. Введите любой MAC-адрес, чтобы мгновенно получить соответствующий IPv6 link local адрес.",
      },
      sv: {
        name: "Konverterare för MAC-adress till IPv6 link-local-adress",
        description:
          "Konverterar MAC-adresser till IPv6 link local-adresser. Ange valfri MAC-adress för att få motsvarande IPv6 link local-adress omedelbart.",
      },
      th: {
        name: "เครื่องมือแปลงที่อยู่ MAC เป็นที่อยู่ IPv6 Link-Local",
        description:
          "แปลงที่อยู่ MAC เป็นที่อยู่ IPv6 link local ป้อนที่อยู่ MAC ใดก็ได้เพื่อรับที่อยู่ IPv6 link local ที่สอดคล้องกันทันที",
      },
      tr: {
        name: "MAC adresinden IPv6 link-local adresine dönüştürücü",
        description:
          "MAC adreslerini IPv6 link local adreslerine dönüştürür. Herhangi bir MAC adresi girin ve karşılık gelen IPv6 link local adresini anında alın.",
      },
      vi: {
        name: "Trình chuyển đổi địa chỉ MAC sang địa chỉ IPv6 link-local",
        description:
          "Chuyển đổi địa chỉ MAC thành địa chỉ IPv6 link local. Nhập bất kỳ địa chỉ MAC nào để nhận địa chỉ IPv6 link local tương ứng ngay lập tức.",
      },
      "zh-CN": {
        name: "MAC 地址转 IPv6 链路本地地址转换器",
        description:
          "将 MAC 地址转换为 IPv6 链路本地地址。输入任何 MAC 地址，立即获得对应的 IPv6 链路本地地址。",
      },
      "zh-TW": {
        name: "MAC 位址轉 IPv6 鏈路本地位址轉換器",
        description:
          "將 MAC 位址轉換為 IPv6 鏈路本地位址。輸入任何 MAC 位址，立即獲得對應的 IPv6 鏈路本地位址。",
      },
    },
  },
  {
    slug: "markdown-previewer",
    category: "document",
    icon: "file-text",
    tags: ["document", "markdown", "preview"],
    locales: {
      ar: {
        name: "معاين Markdown",
        description:
          "معاينة Markdown مباشرة مع التنقية، جدول المحتويات، تصدير HTML والطباعة.",
      },
      de: {
        name: "Markdown-Vorschau",
        description:
          "Markdown live mit Bereinigung, Inhaltsverzeichnis, HTML-Export und Drucken.",
      },
      en: {
        name: "Markdown Previewer",
        description:
          "Preview Markdown live with a synchronized outline, HTML sanitization toggle, export-ready HTML, and clean/slate themes.",
      },
      es: {
        name: "Visor de Markdown",
        description:
          "Previsualiza Markdown en vivo con limpieza, índice, exportación HTML e impresión.",
      },
      fr: {
        name: "Aperçu Markdown",
        description:
          "Aperçu Markdown en direct avec nettoyage, sommaire, export HTML et impression.",
      },
      he: {
        name: "מציג Markdown",
        description:
          "תצוגה מקדימה חיה של Markdown עם סינון, תוכן עניינים, ייצוא HTML והדפסה.",
      },
      hi: {
        name: "Markdown प्रीव्यूअर",
        description:
          "Markdown का लाइव प्रीव्यू, साफ़-सफ़ाई, सामग्री सूची, HTML निर्यात और प्रिंट।",
      },
      id: {
        name: "Pratinjau Markdown",
        description:
          "Pratinjau Markdown secara langsung dengan pembersihan, daftar isi, ekspor HTML, dan cetak.",
      },
      it: {
        name: "Anteprima Markdown",
        description:
          "Anteprima Markdown in tempo reale con sanificazione, sommario, export HTML e stampa.",
      },
      ja: {
        name: "Markdown プレビューア",
        description:
          "Markdown をリアルタイムにプレビュー。サニタイズ、目次、HTML 書き出し、印刷に対応。",
      },
      ko: {
        name: "Markdown 미리보기",
        description:
          "실시간 Markdown 미리보기, 정화, 목차, HTML 내보내기, 인쇄 지원.",
      },
      ms: {
        name: "Pratonton Markdown",
        description:
          "Pratonton Markdown secara langsung dengan pembersihan, jadual kandungan, eksport HTML dan cetak.",
      },
      nl: {
        name: "Markdown-voorvertoner",
        description:
          "Live Markdown-voorbeeld met opschoning, inhoudsopgave, HTML-export en afdrukken.",
      },
      no: {
        name: "Markdown-forhåndsviser",
        description:
          "Forhåndsvis Markdown direkte med rensing, innholdsfortegnelse, HTML-eksport og utskrift.",
      },
      pl: {
        name: "Podgląd Markdown",
        description:
          "Podgląd Markdown na żywo z oczyszczaniem, spisem treści, eksportem HTML i drukiem.",
      },
      pt: {
        name: "Visualizador de Markdown",
        description:
          "Pré-visualize Markdown ao vivo com limpeza, sumário, exportação HTML e impressão.",
      },
      ru: {
        name: "Просмотр Markdown",
        description:
          "Живой просмотр Markdown с очисткой, оглавлением, экспортом HTML и печатью.",
      },
      sv: {
        name: "Markdown-förhandsgranskare",
        description:
          "Liveförhandsgranska Markdown med sanering, innehållsförteckning, HTML-export och utskrift.",
      },
      th: {
        name: "ตัวอย่าง Markdown",
        description:
          "ดูตัวอย่าง Markdown แบบเรียลไทม์ พร้อมการทำความสะอาด สารบัญ ส่งออก HTML และพิมพ์",
      },
      tr: {
        name: "Markdown Önizleyici",
        description:
          "Markdown'u canlı önizleyin; temizleme, içerik tablosu, HTML dışa aktarma ve yazdırma.",
      },
      vi: {
        name: "Trình xem Markdown",
        description:
          "Xem trước Markdown trực tiếp, có làm sạch, mục lục, xuất HTML và in.",
      },
      "zh-CN": {
        name: "Markdown 预览器",
        description:
          "实时预览 Markdown，支持同步目录、HTML 净化切换、导出独立 HTML，以及简洁/深色预览主题。",
      },
      "zh-TW": {
        name: "Markdown 預覽器",
        description:
          "即時預覽 Markdown，支援同步目錄、HTML 淨化切換、匯出獨立 HTML，以及簡潔/深色預覽主題。",
      },
    },
  },
  {
    slug: "markdown-to-html-converter",
    category: "developer",
    icon: "file-text",
    tags: ["markdown", "html", "converter", "preview", "sanitize", "docs"],
    locales: {
      ar: {
        name: "محول Markdown → HTML",
        description:
          "حوّل Markdown إلى HTML باستخدام marked، مع خيار التنقية عبر DOMPurify. معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "Markdown → HTML Konverter",
        description:
          "Wandelt Markdown mit marked in HTML um, optional mit DOMPurify säubern. Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "Markdown to HTML Converter",
        description:
          "Convert Markdown to HTML using marked, optionally sanitize with DOMPurify. Preview, copy, and download.",
      },
      es: {
        name: "Convertidor Markdown → HTML",
        description:
          "Convierte Markdown a HTML con marked y, opcionalmente, sanea con DOMPurify. Previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur Markdown → HTML",
        description:
          "Convertissez Markdown en HTML avec marked, avec nettoyage DOMPurify en option. Aperçu, copie et téléchargement.",
      },
      he: {
        name: "ממיר Markdown → HTML",
        description:
          "המר Markdown ל־HTML בעזרת marked, עם סינון אופציונלי ב־DOMPurify. תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "Markdown → HTML परिवर्तक",
        description:
          "marked से Markdown को HTML में बदलें, वैकल्पिक रूप से DOMPurify से स्वच्छ करें। पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi Markdown → HTML",
        description:
          "Konversi Markdown ke HTML dengan marked dan opsional bersihkan dengan DOMPurify. Pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore Markdown → HTML",
        description:
          "Converti Markdown in HTML con marked e, opzionalmente, sanifica con DOMPurify. Anteprima, copia e download.",
      },
      ja: {
        name: "Markdown → HTML 変換",
        description:
          "marked で Markdown を HTML に変換し、必要に応じて DOMPurify でサニタイズ。プレビュー、コピー、ダウンロード。",
      },
      ko: {
        name: "Markdown → HTML 변환기",
        description:
          "marked로 Markdown을 HTML로 변환하고 필요 시 DOMPurify로 정화합니다. 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Penukar Markdown → HTML",
        description:
          "Tukar Markdown kepada HTML dengan marked dan pilihan pembersihan DOMPurify. Pratonton, salin dan muat turun.",
      },
      nl: {
        name: "Markdown → HTML-converter",
        description:
          "Zet Markdown om naar HTML met marked, optioneel schoonmaken met DOMPurify. Voorbeeld, kopiëren en downloaden.",
      },
      no: {
        name: "Markdown → HTML-omformer",
        description:
          "Konverter Markdown til HTML med marked, valgfritt rense med DOMPurify. Forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter Markdown → HTML",
        description:
          "Konwertuj Markdown do HTML używając marked, opcjonalnie oczyszczaj DOMPurify. Podgląd, kopiuj i pobieraj.",
      },
      pt: {
        name: "Conversor Markdown → HTML",
        description:
          "Converta Markdown em HTML com marked e, opcionalmente, higienize com DOMPurify. Pré-visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер Markdown → HTML",
        description:
          "Преобразуйте Markdown в HTML с помощью marked и при необходимости очищайте DOMPurify. Предпросмотр, копирование и загрузка.",
      },
      sv: {
        name: "Markdown → HTML-omvandlare",
        description:
          "Konvertera Markdown till HTML med marked, valfritt sanera med DOMPurify. Förhandsvisa, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง Markdown → HTML",
        description:
          "แปลง Markdown เป็น HTML ด้วย marked และเลือกทำความสะอาดด้วย DOMPurify แสดงตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "Markdown → HTML Dönüştürücü",
        description:
          "Markdown’u marked ile HTML’e dönüştür, isteğe bağlı DOMPurify ile temizle. Önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình chuyển Markdown → HTML",
        description:
          "Chuyển Markdown sang HTML bằng marked, tùy chọn làm sạch với DOMPurify. Xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "Markdown 转 HTML 转换器",
        description:
          "使用 marked 将 Markdown 转为 HTML，可选 DOMPurify 清理。预览、复制并下载。",
      },
      "zh-TW": {
        name: "Markdown 轉 HTML 轉換器",
        description:
          "使用 marked 將 Markdown 轉為 HTML，可選 DOMPurify 清理。預覽、複製並下載。",
      },
    },
  },
  {
    slug: "md4-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "md4", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة MD4 للنص أو الملف",
        description:
          "أنشئ تجزئات MD4 لإدخال النص أو تحميل الملفات. الأنسب للتوافق مع الأنظمة القديمة وفحوصات سلامة البيانات غير الحرجة أمنياً",
      },
      de: {
        name: "MD4-Hash für Text oder Datei",
        description:
          "Erstellen Sie MD4-Hashes für Texteingaben oder Datei-Uploads. Am besten geeignet für Legacy-Kompatibilität und nicht sicherheitskritische Integritätsprüfungen",
      },
      en: {
        name: "MD4 Hash Text or File",
        description:
          "Generate MD4 hashes for text input or file upload. Best for legacy compatibility and non-security-critical integrity checks.",
      },
      es: {
        name: "Hash MD4 de Texto o Archivo",
        description:
          "Genera hashes MD4 para texto o archivos. Más adecuado para compatibilidad heredada y comprobaciones de integridad no críticas para la seguridad.",
      },
      fr: {
        name: "Hash MD4 de Texte ou Fichier",
        description:
          "Générez des hachages MD4 pour du texte ou des fichiers. Convient surtout à la compatibilité avec les systèmes hérités et aux vérifications d’intégrité non critiques pour la sécurité.",
      },
      he: {
        name: "האש MD4 טקסט או קובץ",
        description:
          "צור ערכי MD4 עבור קלט טקסט או העלאת קבצים. מתאים בעיקר לתאימות למערכות ישנות ולבדיקות תקינות שאינן קריטיות לאבטחה.",
      },
      hi: {
        name: "MD4 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए MD4 हैश बनाएं। यह पुराने सिस्टम के साथ संगतता और गैर-सुरक्षा-महत्वपूर्ण अखंडता जांच के लिए सबसे उपयुक्त है।",
      },
      id: {
        name: "Hash MD4 Teks atau File",
        description:
          "Buat hash MD4 untuk input teks atau unggahan file. Paling cocok untuk kompatibilitas sistem lama dan pemeriksaan integritas yang tidak kritis terhadap keamanan.",
      },
      it: {
        name: "Hash MD4 di Testo o File",
        description:
          "Genera hash MD4 per testo o file. Ideale soprattutto per compatibilità con sistemi legacy e controlli di integrità non critici per la sicurezza.",
      },
      ja: {
        name: "MD4 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力やファイルアップロード向けに MD4 ハッシュを生成します。主にレガシー互換性や、セキュリティ上重要ではない整合性確認に適しています。",
      },
      ko: {
        name: "MD4 해시 텍스트 또는 파일",
        description:
          "텍스트 입력이나 파일 업로드용 MD4 해시를 생성합니다. 레거시 호환성과 보안상 중요하지 않은 무결성 검사에 가장 적합합니다.",
      },
      ms: {
        name: "Hash MD4 Teks atau Fail",
        description:
          "Jana hash MD4 untuk input teks atau muat naik fail. Paling sesuai untuk keserasian sistem lama dan semakan integriti yang tidak kritikal terhadap keselamatan.",
      },
      nl: {
        name: "MD4-hash tekst of bestand",
        description:
          "Genereer MD4-hashes voor tekstinvoer of bestandsuploads. Vooral geschikt voor legacy-compatibiliteit en integriteitscontroles die niet beveiligingskritisch zijn.",
      },
      no: {
        name: "MD4-hash tekst eller fil",
        description:
          "Generer MD4-hasher for tekstinndata eller filopplasting. Best egnet for kompatibilitet med eldre systemer og integritetskontroller som ikke er sikkerhetskritiske.",
      },
      pl: {
        name: "Hash MD4 tekstu lub pliku",
        description:
          "Generuj hashe MD4 dla tekstu lub plików. Najlepiej nadaje się do zgodności ze starszymi systemami i kontroli integralności, które nie są krytyczne dla bezpieczeństwa.",
      },
      pt: {
        name: "Hash MD4 de Texto ou Arquivo",
        description:
          "Gere hashes MD4 para texto ou arquivos. Mais adequado para compatibilidade legada e verificações de integridade que não são críticas para a segurança.",
      },
      ru: {
        name: "MD4-хеш текста или файла",
        description:
          "Создавайте MD4-хеши для текста или файлов. Лучше всего подходит для совместимости с устаревшими системами и проверок целостности, не критичных для безопасности.",
      },
      sv: {
        name: "MD4-hash text eller fil",
        description:
          "Generera MD4-hashar för textinmatning eller filuppladdning. Passar bäst för kompatibilitet med äldre system och integritetskontroller som inte är säkerhetskritiska.",
      },
      th: {
        name: "แฮช MD4 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช MD4 สำหรับข้อความหรือการอัปโหลดไฟล์ เหมาะที่สุดสำหรับความเข้ากันได้กับระบบเดิมและการตรวจสอบความสมบูรณ์ที่ไม่สำคัญต่อความปลอดภัย",
      },
      tr: {
        name: "MD4 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için MD4 hash'leri oluşturun. En çok eski sistem uyumluluğu ve güvenlik açısından kritik olmayan bütünlük kontrolleri için uygundur.",
      },
      vi: {
        name: "Hash MD4 văn bản hoặc tệp",
        description:
          "Tạo hash MD4 cho văn bản hoặc tệp tải lên. Phù hợp nhất cho khả năng tương thích với hệ thống cũ và các kiểm tra toàn vẹn không quan trọng về bảo mật.",
      },
      "zh-CN": {
        name: "MD4 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 MD4 哈希值。更适合遗留系统兼容和非安全关键的完整性校验。",
      },
      "zh-TW": {
        name: "MD4 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 MD4 雜湊值。更適合遺留系統相容與非安全關鍵的完整性檢查。",
      },
    },
  },
  {
    slug: "md5-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "md5", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة MD5 للنص أو الملف",
        description:
          "أنشئ تجزئات MD5 لإدخال النص أو تحميل الملفات. الأنسب للتوافق مع الأنظمة القديمة وفحوصات سلامة البيانات غير الحرجة أمنياً",
      },
      de: {
        name: "MD5-Hash für Text oder Datei",
        description:
          "Erstellen Sie MD5-Hashes für Texteingaben oder Datei-Uploads. Am besten geeignet für Legacy-Kompatibilität und nicht sicherheitskritische Integritätsprüfungen",
      },
      en: {
        name: "MD5 Hash Text or File",
        description:
          "Generate MD5 hashes for text input or file upload. Best for legacy compatibility and non-security-critical integrity checks.",
      },
      es: {
        name: "Hash MD5 de Texto o Archivo",
        description:
          "Genera hashes MD5 para texto o archivos. Más adecuado para compatibilidad heredada y comprobaciones de integridad no críticas para la seguridad.",
      },
      fr: {
        name: "Hash MD5 de Texte ou Fichier",
        description:
          "Générez des hachages MD5 pour du texte ou des fichiers. Convient surtout à la compatibilité avec les systèmes hérités et aux vérifications d’intégrité non critiques pour la sécurité.",
      },
      he: {
        name: "האש MD5 טקסט או קובץ",
        description:
          "צור ערכי MD5 עבור קלט טקסט או העלאת קבצים. מתאים בעיקר לתאימות למערכות ישנות ולבדיקות תקינות שאינן קריטיות לאבטחה.",
      },
      hi: {
        name: "MD5 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए MD5 हैश बनाएं। यह पुराने सिस्टम के साथ संगतता और गैर-सुरक्षा-महत्वपूर्ण अखंडता जांच के लिए सबसे उपयुक्त है।",
      },
      id: {
        name: "Hash MD5 Teks atau File",
        description:
          "Buat hash MD5 untuk input teks atau unggahan file. Paling cocok untuk kompatibilitas sistem lama dan pemeriksaan integritas yang tidak kritis terhadap keamanan.",
      },
      it: {
        name: "Hash MD5 di Testo o File",
        description:
          "Genera hash MD5 per testo o file. Ideale soprattutto per compatibilità con sistemi legacy e controlli di integrità non critici per la sicurezza.",
      },
      ja: {
        name: "MD5 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力やファイルアップロード向けに MD5 ハッシュを生成します。主にレガシー互換性や、セキュリティ上重要ではない整合性確認に適しています。",
      },
      ko: {
        name: "MD5 해시 텍스트 또는 파일",
        description:
          "텍스트 입력이나 파일 업로드용 MD5 해시를 생성합니다. 레거시 호환성과 보안상 중요하지 않은 무결성 검사에 가장 적합합니다.",
      },
      ms: {
        name: "Hash MD5 Teks atau Fail",
        description:
          "Jana hash MD5 untuk input teks atau muat naik fail. Paling sesuai untuk keserasian sistem lama dan semakan integriti yang tidak kritikal terhadap keselamatan.",
      },
      nl: {
        name: "MD5-hash tekst of bestand",
        description:
          "Genereer MD5-hashes voor tekstinvoer of bestandsuploads. Vooral geschikt voor legacy-compatibiliteit en integriteitscontroles die niet beveiligingskritisch zijn.",
      },
      no: {
        name: "MD5-hash tekst eller fil",
        description:
          "Generer MD5-hasher for tekstinndata eller filopplasting. Best egnet for kompatibilitet med eldre systemer og integritetskontroller som ikke er sikkerhetskritiske.",
      },
      pl: {
        name: "Hash MD5 tekstu lub pliku",
        description:
          "Generuj hashe MD5 dla tekstu lub plików. Najlepiej nadaje się do zgodności ze starszymi systemami i kontroli integralności, które nie są krytyczne dla bezpieczeństwa.",
      },
      pt: {
        name: "Hash MD5 de Texto ou Arquivo",
        description:
          "Gere hashes MD5 para texto ou arquivos. Mais adequado para compatibilidade legada e verificações de integridade que não são críticas para a segurança.",
      },
      ru: {
        name: "MD5-хеш текста или файла",
        description:
          "Создавайте MD5-хеши для текста или файлов. Лучше всего подходит для совместимости с устаревшими системами и проверок целостности, не критичных для безопасности.",
      },
      sv: {
        name: "MD5-hash text eller fil",
        description:
          "Generera MD5-hashar för textinmatning eller filuppladdning. Passar bäst för kompatibilitet med äldre system och integritetskontroller som inte är säkerhetskritiska.",
      },
      th: {
        name: "แฮช MD5 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช MD5 สำหรับข้อความหรือการอัปโหลดไฟล์ เหมาะที่สุดสำหรับความเข้ากันได้กับระบบเดิมและการตรวจสอบความสมบูรณ์ที่ไม่สำคัญต่อความปลอดภัย",
      },
      tr: {
        name: "MD5 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için MD5 hash'leri oluşturun. En çok eski sistem uyumluluğu ve güvenlik açısından kritik olmayan bütünlük kontrolleri için uygundur.",
      },
      vi: {
        name: "Hash MD5 văn bản hoặc tệp",
        description:
          "Tạo hash MD5 cho văn bản hoặc tệp tải lên. Phù hợp nhất cho khả năng tương thích với hệ thống cũ và các kiểm tra toàn vẹn không quan trọng về bảo mật.",
      },
      "zh-CN": {
        name: "MD5 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 MD5 哈希值。更适合遗留系统兼容和非安全关键的完整性校验。",
      },
      "zh-TW": {
        name: "MD5 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 MD5 雜湊值。更適合遺留系統相容與非安全關鍵的完整性檢查。",
      },
    },
  },
  {
    slug: "mime-type-lookup",
    category: "network",
    icon: "network",
    tags: ["mime", "mime-type", "content-type", "file-extension", "reference"],
    locales: {
      ar: {
        name: "البحث عن أنواع MIME",
        description: "البحث وتصفح أنواع MIME وامتدادات الملفات الخاصة بها",
      },
      de: {
        name: "MIME-Typ-Suche",
        description:
          "MIME-Typen und ihre Dateierweiterungen suchen und durchsuchen",
      },
      en: {
        name: "MIME Type Lookup",
        description: "Search and browse MIME types and their file extensions",
      },
      es: {
        name: "Consulta de Tipos MIME",
        description:
          "Buscar y explorar tipos MIME y sus extensiones de archivo",
      },
      fr: {
        name: "Recherche de Types MIME",
        description:
          "Rechercher et parcourir les types MIME et leurs extensions de fichier",
      },
      he: {
        name: "חיפוש סוג MIME",
        description: "חפש ועיין בסוגי MIME והרחבות הקבצים שלהם",
      },
      hi: {
        name: "MIME प्रकार खोज",
        description: "MIME प्रकार और उनके फ़ाइल एक्सटेंशन खोजें और ब्राउज़ करें",
      },
      id: {
        name: "Pencarian Tipe MIME",
        description: "Cari dan jelajahi tipe MIME dan ekstensi file mereka",
      },
      it: {
        name: "Ricerca Tipi MIME",
        description: "Cerca e sfoglia i tipi MIME e le loro estensioni di file",
      },
      ja: {
        name: "MIME タイプ検索",
        description: "MIME タイプとそのファイル拡張子を検索・閲覧",
      },
      ko: {
        name: "MIME 타입 조회",
        description: "MIME 타입과 파일 확장자 검색 및 탐색",
      },
      ms: {
        name: "Carian Jenis MIME",
        description: "Cari dan semak jenis MIME dan sambungan fail mereka",
      },
      nl: {
        name: "MIME Type Opzoeken",
        description: "Zoek en blader door MIME types en hun bestandsextensies",
      },
      no: {
        name: "MIME-typesøk",
        description: "Søk og bla gjennom MIME-typer og deres filendelser",
      },
      pl: {
        name: "Wyszukiwanie Typów MIME",
        description:
          "Wyszukuj i przeglądaj typy MIME i ich rozszerzenia plików",
      },
      pt: {
        name: "Consulta de Tipos MIME",
        description:
          "Pesquisar e navegar por tipos MIME e suas extensões de arquivo",
      },
      ru: {
        name: "Поиск MIME Типов",
        description: "Поиск и просмотр MIME типов и их расширений файлов",
      },
      sv: {
        name: "MIME-typsökning",
        description: "Sök och bläddra bland MIME-typer och deras filtillägg",
      },
      th: {
        name: "ค้นหาประเภท MIME",
        description: "ค้นหาและเรียกดูประเภท MIME และนามสกุลไฟล์",
      },
      tr: {
        name: "MIME Türü Arama",
        description: "MIME türlerini ve dosya uzantılarını arayın ve göz atın",
      },
      vi: {
        name: "Tra Cứu Loại MIME",
        description:
          "Tìm kiếm và duyệt các loại MIME và phần mở rộng tệp của chúng",
      },
      "zh-CN": {
        name: "MIME 类型查询",
        description: "搜索和浏览 MIME 类型及其文件扩展名",
      },
      "zh-TW": {
        name: "MIME 類型查詢",
        description: "搜尋和瀏覽 MIME 類型及其檔案副檔名",
      },
    },
  },
  {
    slug: "morse-code-converter",
    category: "misc",
    icon: "file-text",
    tags: [
      "morse",
      "morse code",
      "text converter",
      "encoder",
      "decoder",
      "audio",
    ],
    locales: {
      ar: {
        name: "محول شفرة مورس",
        description: "تحويل النص إلى شفرة مورس والعكس مع دعم تشغيل الصوت",
      },
      de: {
        name: "Morsecode-Konverter",
        description:
          "Text in Morsecode umwandeln und umgekehrt mit Audiowiedergabe",
      },
      en: {
        name: "Morse Code Converter",
        description:
          "Convert text to Morse code and vice versa with audio playback support",
      },
      es: {
        name: "Convertidor de Código Morse",
        description:
          "Convierte texto a código Morse y viceversa con soporte de reproducción de audio",
      },
      fr: {
        name: "Convertisseur de Code Morse",
        description:
          "Convertir du texte en code Morse et inversement avec support audio",
      },
      he: {
        name: "ממיר קוד מורס",
        description: "המר טקסט לקוד מורס ולהיפך עם תמיכה בהשמעת אודיו",
      },
      hi: {
        name: "मोर्स कोड कनवर्टर",
        description: "ऑडियो प्लेबैक के साथ टेक्स्ट को मोर्स कोड में बदलें और इसके विपरीत",
      },
      id: {
        name: "Konverter Kode Morse",
        description:
          "Konversi teks ke kode Morse dan sebaliknya dengan dukungan pemutaran audio",
      },
      it: {
        name: "Convertitore Codice Morse",
        description:
          "Converti testo in codice Morse e viceversa con supporto audio",
      },
      ja: {
        name: "モールス信号変換",
        description: "テキストとモールス信号を相互変換、音声再生対応",
      },
      ko: {
        name: "모스 부호 변환기",
        description: "텍스트와 모스 부호 상호 변환, 오디오 재생 지원",
      },
      ms: {
        name: "Penukar Kod Morse",
        description:
          "Tukar teks kepada kod Morse dan sebaliknya dengan sokongan main balik audio",
      },
      nl: {
        name: "Morsecode Converter",
        description:
          "Converteer tekst naar morsecode en vice versa met audio ondersteuning",
      },
      no: {
        name: "Morsekode-konverterer",
        description:
          "Konverter tekst til morsekode og omvendt med lydavspilling",
      },
      pl: {
        name: "Konwerter Kodu Morse'a",
        description:
          "Konwertuj tekst na kod Morse'a i odwrotnie z obsługą odtwarzania dźwięku",
      },
      pt: {
        name: "Conversor de Código Morse",
        description:
          "Converta texto para código Morse e vice-versa com suporte a áudio",
      },
      ru: {
        name: "Конвертер кода Морзе",
        description:
          "Преобразование текста в код Морзе и обратно с поддержкой воспроизведения звука",
      },
      sv: {
        name: "Morsekod-konverterare",
        description:
          "Konvertera text till morsekod och vice versa med ljuduppspelning",
      },
      th: {
        name: "ตัวแปลงรหัสมอร์ส",
        description: "แปลงข้อความเป็นรหัสมอร์สและในทางกลับกัน พร้อมเล่นเสียง",
      },
      tr: {
        name: "Mors Kodu Dönüştürücü",
        description: "Metni Mors koduna ve tersine ses desteğiyle dönüştürün",
      },
      vi: {
        name: "Bộ Chuyển Đổi Mã Morse",
        description:
          "Chuyển đổi văn bản sang mã Morse và ngược lại với hỗ trợ phát âm thanh",
      },
      "zh-CN": {
        name: "摩尔斯电码转换器",
        description: "文本与摩尔斯电码相互转换，支持音频播放",
      },
      "zh-TW": {
        name: "摩爾斯電碼轉換器",
        description: "文字與摩爾斯電碼相互轉換，支援音訊播放",
      },
    },
  },
  {
    slug: "murmurhash3-x86-32-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "murmurhash3",
      "murmur",
      "x86-32",
      "checksum",
      "performance",
      "file",
      "text",
      "fast",
    ],
    locales: {
      ar: {
        name: "تجزئة MurmurHash3 (x86 32-bit) للنص أو الملف",
        description:
          "إنشاء تجزئة MurmurHash3 x86 32-bit لإدخال النص أو تحميل الملف. احسب مجاميع التحقق 32 بت غير المشفرة السريعة للتحقق من سلامة البيانات والتجزئة الموجهة للأداء",
      },
      de: {
        name: "MurmurHash3 (x86 32-bit)-Hash für Text oder Datei",
        description:
          "Generieren Sie MurmurHash3 x86 32-bit-Hash für Texteingabe oder Datei-Upload. Berechnen Sie schnelle 32-Bit nicht-kryptographische Prüfsummen zur Datenintegritätsprüfung und leistungsorientierten Hashing",
      },
      en: {
        name: "MurmurHash3 (x86 32-bit) Hash Text or File",
        description:
          "Generate MurmurHash3 x86 32-bit hash for text input or file upload. Calculate fast 32-bit non-cryptographic checksums for data integrity verification and performance-oriented hashing",
      },
      es: {
        name: "Hash MurmurHash3 (x86 32-bit) de Texto o Archivo",
        description:
          "Genera hash MurmurHash3 x86 32-bit para entrada de texto o carga de archivo. Calcula sumas de verificación de 32 bits no criptográficas rápidas para verificación de integridad de datos y hashing orientado al rendimiento",
      },
      fr: {
        name: "Hash MurmurHash3 (x86 32-bit) de Texte ou Fichier",
        description:
          "Générez un hash MurmurHash3 x86 32-bit pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle 32 bits non cryptographiques rapides pour la vérification de l'intégrité des données et le hachage orienté performance",
      },
      he: {
        name: "האש MurmurHash3 (x86 32-bit) טקסט או קובץ",
        description:
          "צור האש MurmurHash3 x86 32-bit עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה 32-ביט לא קריפטוגרפיים מהירים לאימות שלמות נתונים והאשינג מוכוון ביצועים",
      },
      hi: {
        name: "MurmurHash3 (x86 32-bit) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए MurmurHash3 x86 32-bit हैश जेनरेट करें। डेटा अखंडता सत्यापन और प्रदर्शन-उन्मुख हैशिंग के लिए तेज़ 32-बिट गैर-क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash MurmurHash3 (x86 32-bit) Teks atau File",
        description:
          "Buat hash MurmurHash3 x86 32-bit untuk input teks atau upload file. Hitung checksum 32-bit non-kriptografi cepat untuk verifikasi integritas data dan hashing berorientasi kinerja",
      },
      it: {
        name: "Hash MurmurHash3 (x86 32-bit) di Testo o File",
        description:
          "Genera hash MurmurHash3 x86 32-bit per input di testo o caricamento file. Calcola checksum a 32 bit non crittografici veloci per la verifica dell'integrità dei dati e hashing orientato alle prestazioni",
      },
      ja: {
        name: "MurmurHash3 (x86 32-bit) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのMurmurHash3 x86 32-bitハッシュを生成します。データ整合性検証とパフォーマンス重視のハッシュ化のための高速32ビット非暗号化チェックサムを計算",
      },
      ko: {
        name: "MurmurHash3 (x86 32-bit) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 MurmurHash3 x86 32-bit 해시를 생성합니다. 데이터 무결성 검증 및 성능 지향 해싱을 위한 빠른 32비트 비암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash MurmurHash3 (x86 32-bit) Teks atau Fail",
        description:
          "Jana hash MurmurHash3 x86 32-bit untuk input teks atau muat naik fail. Kira checksum 32-bit bukan kriptografi pantas untuk pengesahan integriti data dan hash berorientasikan prestasi",
      },
      nl: {
        name: "MurmurHash3 (x86 32-bit)-hash tekst of bestand",
        description:
          "Genereer MurmurHash3 x86 32-bit-hash voor tekstinvoer of bestandsupload. Bereken snelle 32-bit niet-cryptografische checksums voor gegevensintegriteitsverificatie en prestatiegerichte hashing",
      },
      no: {
        name: "MurmurHash3 (x86 32-bit)-hash tekst eller fil",
        description:
          "Generer MurmurHash3 x86 32-bit-hash for tekstinndata eller filopplasting. Beregn raske 32-bits ikke-kryptografiske sjekksummer for dataintegritetsverifisering og ytelsesrettet hashing",
      },
      pl: {
        name: "Hash MurmurHash3 (x86 32-bit) tekstu lub pliku",
        description:
          "Generuj hash MurmurHash3 x86 32-bit dla wprowadzania tekstu lub przesyłania pliku. Obliczaj szybkie 32-bitowe nie-kryptograficzne sumy kontrolne do weryfikacji integralności danych i hashowania zorientowanego na wydajność",
      },
      pt: {
        name: "Hash MurmurHash3 (x86 32-bit) de Texto ou Arquivo",
        description:
          "Gere hash MurmurHash3 x86 32-bit para entrada de texto ou upload de arquivo. Calcule checksums de 32 bits não criptográficos rápidos para verificação de integridade de dados e hashing orientado a performance",
      },
      ru: {
        name: "MurmurHash3 (x86 32-bit)-хеш текста или файла",
        description:
          "Генерируйте MurmurHash3 x86 32-bit-хеш для текстового ввода или загрузки файла. Вычисляйте быстрые 32-битные некриптографические контрольные суммы для проверки целостности данных и производительного хеширования",
      },
      sv: {
        name: "MurmurHash3 (x86 32-bit)-hash text eller fil",
        description:
          "Generera MurmurHash3 x86 32-bit-hash för textinmatning eller filuppladdning. Beräkna snabba 32-bitars icke-kryptografiska kontrollsummor för dataintegritetsverifiering och prestandaorienterad hash",
      },
      th: {
        name: "แฮช MurmurHash3 (x86 32-bit) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช MurmurHash3 x86 32-bit สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัม 32-บิตที่ไม่ใช่การเข้ารหัสที่รวดเร็วสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและการแฮชที่เน้นประสิทธิภาพ",
      },
      tr: {
        name: "MurmurHash3 (x86 32-bit) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için MurmurHash3 x86 32-bit hash oluşturun. Veri bütünlüğü doğrulaması ve performans odaklı hash için hızlı 32-bit kriptografik olmayan sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash MurmurHash3 (x86 32-bit) văn bản hoặc tệp",
        description:
          "Tạo hash MurmurHash3 x86 32-bit cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum 32-bit không mã hóa nhanh để xác minh tính toàn vẹn dữ liệu và băm hướng hiệu suất",
      },
      "zh-CN": {
        name: "MurmurHash3 (x86 32-bit) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 MurmurHash3 x86 32-bit 哈希值。计算快速 32 位非加密校验和，用于数据完整性验证和性能导向的哈希计算",
      },
      "zh-TW": {
        name: "MurmurHash3 (x86 32-bit) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 MurmurHash3 x86 32-bit 雜湊值。計算快速 32 位元非加密校驗和，用於資料完整性驗證和效能導向的雜湊計算",
      },
    },
  },
  {
    slug: "my-ip-address",
    category: "network",
    icon: "network",
    tags: ["ip", "ipv4", "ipv6", "webrtc", "geolocation", "isp"],
    locales: {
      ar: {
        name: "عنوان IP الخاص بي",
        description:
          "اكتشف عنوان IP العام الخاص بك واحصل على معلومات مفصلة حول اتصالك بالإنترنت بما في ذلك الموقع الجغرافي وتفاصيل مزود الخدمة ومعلومات الشبكة",
      },
      de: {
        name: "Meine IP-Adresse",
        description:
          "Entdecken Sie Ihre öffentliche IP-Adresse und erhalten Sie detaillierte Informationen über Ihre Internetverbindung einschließlich Geolokalisierung, ISP-Details und Netzwerkinformationen",
      },
      en: {
        name: "My IP Address",
        description:
          "Discover your public IP address and get detailed information about your internet connection including geolocation, ISP details, and network information",
      },
      es: {
        name: "Mi Dirección IP",
        description:
          "Descubre tu dirección IP pública y obtén información detallada sobre tu conexión a internet incluyendo geolocalización, detalles del ISP e información de red",
      },
      fr: {
        name: "Mon Adresse IP",
        description:
          "Découvrez votre adresse IP publique et obtenez des informations détaillées sur votre connexion internet incluant la géolocalisation, les détails du FAI et les informations réseau",
      },
      he: {
        name: "כתובת ה-IP שלי",
        description:
          "גלה את כתובת ה-IP הציבורית שלך וקבל מידע מפורט על חיבור האינטרנט שלך כולל מיקום גיאוגרפי, פרטי ספק האינטרנט ומידע רשת",
      },
      hi: {
        name: "मेरा IP पता",
        description:
          "अपना सार्वजनिक IP पता खोजें और भौगोलिक स्थान, ISP विवरण और नेटवर्क जानकारी सहित अपने इंटरनेट कनेक्शन के बारे में विस्तृत जानकारी प्राप्त करें",
      },
      id: {
        name: "Alamat IP Saya",
        description:
          "Temukan alamat IP publik Anda dan dapatkan informasi rinci tentang koneksi internet Anda termasuk geolokasi, detail ISP, dan informasi jaringan",
      },
      it: {
        name: "Il Mio Indirizzo IP",
        description:
          "Scopri il tuo indirizzo IP pubblico e ottieni informazioni dettagliate sulla tua connessione internet inclusa geolocalizzazione, dettagli ISP e informazioni di rete",
      },
      ja: {
        name: "私の IP アドレス",
        description:
          "パブリック IP アドレスを発見し、地理的位置、ISP の詳細、ネットワーク情報を含むインターネット接続の詳細情報を取得します",
      },
      ko: {
        name: "내 IP 주소",
        description:
          "공용 IP 주소를 발견하고 지리적 위치, ISP 세부 정보 및 네트워크 정보를 포함한 인터넷 연결에 대한 자세한 정보를 얻으세요",
      },
      ms: {
        name: "Alamat IP Saya",
        description:
          "Temui alamat IP awam anda dan dapatkan maklumat terperinci tentang sambungan internet anda termasuk geolokasi, butiran ISP dan maklumat rangkaian",
      },
      nl: {
        name: "Mijn IP-adres",
        description:
          "Ontdek uw openbare IP-adres en krijg gedetailleerde informatie over uw internetverbinding inclusief geolocatie, ISP-details en netwerkinformatie",
      },
      no: {
        name: "Min IP-adresse",
        description:
          "Oppdag din offentlige IP-adresse og få detaljert informasjon om internettforbindelsen din inkludert geolokalisering, ISP-detaljer og nettverksinformasjon",
      },
      pl: {
        name: "Mój Adres IP",
        description:
          "Odkryj swój publiczny adres IP i uzyskaj szczegółowe informacje o swoim połączeniu internetowym, w tym geolokalizację, szczegóły dostawcy internetowego i informacje o sieci",
      },
      pt: {
        name: "Meu Endereço IP",
        description:
          "Descubra seu endereço IP público e obtenha informações detalhadas sobre sua conexão com a internet incluindo geolocalização, detalhes do ISP e informações de rede",
      },
      ru: {
        name: "Мой IP-адрес",
        description:
          "Узнайте свой публичный IP-адрес и получите подробную информацию о вашем интернет-соединении, включая геолокацию, данные провайдера и сетевую информацию",
      },
      sv: {
        name: "Min IP-adress",
        description:
          "Upptäck din offentliga IP-adress och få detaljerad information om din internetanslutning inklusive geolokalisering, ISP-detaljer och nätverksinformation",
      },
      th: {
        name: "IP Address ของฉัน",
        description:
          "ค้นพบ IP address สาธารณะของคุณและรับข้อมูลรายละเอียดเกี่ยวกับการเชื่อมต่ออินเทอร์เน็ตของคุณ รวมถึงตำแหน่งทางภูมิศาสตร์ รายละเอียด ISP และข้อมูลเครือข่าย",
      },
      tr: {
        name: "IP Adresim",
        description:
          "Genel IP adresinizi keşfedin ve coğrafi konum, ISS ayrıntıları ve ağ bilgileri dahil olmak üzere internet bağlantınız hakkında ayrıntılı bilgi alın",
      },
      vi: {
        name: "Địa Chỉ IP Của Tôi",
        description:
          "Khám phá địa chỉ IP công cộng của bạn và nhận thông tin chi tiết về kết nối internet của bạn bao gồm vị trí địa lý, thông tin ISP và thông tin mạng",
      },
      "zh-CN": {
        name: "我的 IP 地址",
        description:
          "发现您的公共 IP 地址并获取有关您的互联网连接的详细信息，包括地理位置、ISP 详细信息和网络信息",
      },
      "zh-TW": {
        name: "我的 IP 位址",
        description:
          "發現您的公共 IP 位址並獲取有關您的網際網路連線的詳細資訊，包括地理位置、ISP 詳細資訊和網路資訊",
      },
    },
  },
  {
    slug: "nanoid-generator",
    category: "developer",
    icon: "lock",
    tags: [
      "nanoid",
      "id",
      "identifier",
      "unique",
      "random",
      "generator",
      "token",
      "url",
    ],
    locales: {
      ar: {
        name: "مولد NanoID",
        description:
          "أنشئ NanoID آمنة لعناوين URL في المتصفح مع طول وحروف أبجدية مسبقة قابلة للتخصيص.",
      },
      de: {
        name: "NanoID-Generator",
        description:
          "Erzeuge URL-sichere NanoIDs im Browser mit anpassbarer Länge und Alphabet-Voreinstellungen.",
      },
      en: {
        name: "NanoID Generator",
        description:
          "Generate URL-safe NanoIDs in the browser with custom length and alphabet presets.",
      },
      es: {
        name: "Generador de NanoID",
        description:
          "Genera NanoID seguros para URL en el navegador con longitud y alfabetos preestablecidos personalizables.",
      },
      fr: {
        name: "Générateur de NanoID",
        description:
          "Générez des NanoID compatibles URL dans le navigateur avec une longueur et des alphabets préréglés personnalisables.",
      },
      he: {
        name: "מחולל NanoID",
        description:
          "צור NanoID בטוחות ל-URL בדפדפן עם אורך וקבוצות תווים מוגדרות מראש.",
      },
      hi: {
        name: "NanoID जनरेटर",
        description:
          "ब्राउज़र में URL-सुरक्षित NanoID बनाएँ, कस्टम लंबाई और वर्णमाला प्रीसेट के साथ।",
      },
      id: {
        name: "Generator NanoID",
        description:
          "Hasilkan NanoID aman untuk URL di browser dengan panjang dan preset alfabet yang dapat disesuaikan.",
      },
      it: {
        name: "Generatore NanoID",
        description:
          "Genera NanoID compatibili con URL nel browser con lunghezza e alfabeti predefiniti personalizzabili.",
      },
      ja: {
        name: "NanoID ジェネレーター",
        description:
          "ブラウザ内で URL 安全な NanoID を生成。長さと文字集合のプリセットをカスタマイズできます。",
      },
      ko: {
        name: "NanoID 생성기",
        description:
          "브라우저에서 URL 안전한 NanoID를 생성하고 길이와 알파벳 프리셋을 사용자 지정합니다.",
      },
      ms: {
        name: "Penjana NanoID",
        description:
          "Jana NanoID selamat URL dalam pelayar dengan panjang dan pratetap abjad tersuai.",
      },
      nl: {
        name: "NanoID-generator",
        description:
          "Genereer URL-veilige NanoID's in de browser met aanpasbare lengte en alfabetpresets.",
      },
      no: {
        name: "NanoID-generator",
        description:
          "Generer URL-sikre NanoID-er i nettleseren med tilpasset lengde og alfabetforhåndsinnstillinger.",
      },
      pl: {
        name: "Generator NanoID",
        description:
          "Generuj NanoID bezpieczne dla URL w przeglądarce z niestandardową długością i zestawami znaków.",
      },
      pt: {
        name: "Gerador de NanoID",
        description:
          "Gere NanoIDs seguros para URL no navegador com comprimento e alfabetos predefinidos personalizáveis.",
      },
      ru: {
        name: "Генератор NanoID",
        description:
          "Создавайте безопасные для URL NanoID в браузере с настраиваемой длиной и наборами символов.",
      },
      sv: {
        name: "NanoID-generator",
        description:
          "Skapa URL-säkra NanoID i webbläsaren med anpassad längd och alfabetförinställningar.",
      },
      th: {
        name: "ตัวสร้าง NanoID",
        description:
          "สร้าง NanoID ที่ปลอดภัยสำหรับ URL ในเบราว์เซอร์ พร้อมความยาวและชุดอักขระที่ปรับได้.",
      },
      tr: {
        name: "NanoID Oluşturucu",
        description:
          "Tarayıcıda URL-güvenli NanoID'ler üretin; uzunluk ve alfabe ön ayarlarını özelleştirin.",
      },
      vi: {
        name: "Trình tạo NanoID",
        description:
          "Tạo NanoID an toàn cho URL trong trình duyệt với độ dài và bảng chữ cái đặt trước tùy chỉnh.",
      },
      "zh-CN": {
        name: "NanoID 生成器",
        description:
          "在浏览器内生成 URL 安全的 NanoID，支持自定义长度和字符集预设。",
      },
      "zh-TW": {
        name: "NanoID 產生器",
        description:
          "在瀏覽器內產生 URL 安全的 NanoID，支援自訂長度與字元集預設。",
      },
    },
  },
  {
    slug: "number-base-converter",
    category: "web",
    icon: "binary",
    tags: [
      "number base",
      "base converter",
      "binary",
      "hexadecimal",
      "radix",
      "developer tools",
    ],
    locales: {
      ar: {
        name: "محول الأنظمة العددية",
        description:
          "تحويل الأرقام بين الثنائي والثماني والعشري والست عشري وbase32 وbase36 وbase62 وbase64 والأنظمة المخصصة (2-64).",
      },
      de: {
        name: "Zahlenbasis-Konverter",
        description:
          "Konvertiert Zahlen zwischen Binär, Oktal, Dezimal, Hexadezimal, Base32, Base36, Base62, Base64 und benutzerdefinierten Basen (2-64).",
      },
      en: {
        name: "Number Base Converter",
        description:
          "Convert numbers between binary, octal, decimal, hexadecimal, base32, base36, base62, base64, and custom bases from 2 to 64.",
      },
      es: {
        name: "Convertidor de Base Numérica",
        description:
          "Convierte números entre binario, octal, decimal, hexadecimal, base32, base36, base62, base64 y bases personalizadas (2-64).",
      },
      fr: {
        name: "Convertisseur de Base Numérique",
        description:
          "Convertit les nombres entre binaire, octal, décimal, hexadécimal, base32, base36, base62, base64 et bases personnalisées (2-64).",
      },
      he: {
        name: "ממיר בסיסי מספרים",
        description:
          "המרת מספרים בין בינארי, אוקטלי, עשרוני, הקסדצימלי, base32, base36, base62, base64 ובסיסים מותאמים אישית (2-64).",
      },
      hi: {
        name: "संख्या आधार परिवर्तक",
        description:
          "बाइनरी, ऑक्टल, डेसिमल, हेक्स, बेस32, बेस36, बेस62, बेस64 और कस्टम बेस (2-64) के बीच संख्याओं को परिवर्तित करें।",
      },
      id: {
        name: "Konverter Basis Bilangan",
        description:
          "Konversi angka antara biner, oktal, desimal, heksadesimal, base32, base36, base62, base64, dan basis kustom (2-64).",
      },
      it: {
        name: "Convertitore di Base Numerica",
        description:
          "Converte numeri tra binario, ottale, decimale, esadecimale, base32, base36, base62, base64 e basi personalizzate (2-64).",
      },
      ja: {
        name: "基数変換ツール",
        description:
          "2進数、8進数、10進数、16進数、32/36/62/64進数、カスタム基数 (2-64) の間で数値を変換します。",
      },
      ko: {
        name: "진법 변환기",
        description:
          "2진수, 8진수, 10진수, 16진수, 32/36/62/64진수 및 사용자 정의 진법 (2-64) 간에 숫자를 변환합니다.",
      },
      ms: {
        name: "Penukar Asas Nombor",
        description:
          "Tukar nombor antara binari, oktal, perpuluhan, heksadesimal, base32, base36, base62, base64 dan asas tersuai (2-64).",
      },
      nl: {
        name: "Getallenbase Converter",
        description:
          "Converteer getallen tussen binair, octaal, decimaal, hexadecimaal, base32, base36, base62, base64 en aangepaste bases (2-64).",
      },
      no: {
        name: "Tallbase-konverterer",
        description:
          "Konverter tall mellom binær, oktal, desimal, heksadesimal, base32, base36, base62, base64 og egendefinerte baser (2-64).",
      },
      pl: {
        name: "Konwerter Bazy Liczbowej",
        description:
          "Konwertuj liczby między binarnym, ósemkowym, dziesiętnym, szesnastkowym, base32, base36, base62, base64 i niestandardowymi bazami (2-64).",
      },
      pt: {
        name: "Conversor de Base Numérica",
        description:
          "Converte números entre binário, octal, decimal, hexadecimal, base32, base36, base62, base64 e bases personalizadas (2-64).",
      },
      ru: {
        name: "Конвертер Систем Счисления",
        description:
          "Преобразование чисел между двоичной, восьмеричной, десятичной, шестнадцатеричной, base32, base36, base62, base64 и пользовательскими системами (2-64).",
      },
      sv: {
        name: "Talbas-konverterare",
        description:
          "Konvertera tal mellan binärt, oktalt, decimalt, hexadecimalt, base32, base36, base62, base64 och anpassade baser (2-64).",
      },
      th: {
        name: "ตัวแปลงฐานเลข",
        description:
          "แปลงตัวเลขระหว่างฐานสอง ฐานแปด ฐานสิบ ฐานสิบหก base32 base36 base62 base64 และฐานที่กำหนดเอง (2-64)",
      },
      tr: {
        name: "Sayı Tabanı Dönüştürücü",
        description:
          "Sayıları ikili, sekizli, onlu, onaltılı, base32, base36, base62, base64 ve özel tabanlar (2-64) arasında dönüştürün.",
      },
      vi: {
        name: "Chuyển Đổi Cơ Số",
        description:
          "Chuyển đổi số giữa nhị phân, bát phân, thập phân, thập lục phân, base32, base36, base62, base64 và cơ số tùy chỉnh (2-64).",
      },
      "zh-CN": {
        name: "进制转换器",
        description:
          "在二进制、八进制、十进制、十六进制、32/36/62/64 进制和自定义进制 (2-64) 之间转换数字。",
      },
      "zh-TW": {
        name: "進制轉換器",
        description:
          "在二進制、八進制、十進制、十六進制、32/36/62/64 進制和自定義進制 (2-64) 之間轉換數字。",
      },
    },
  },
  {
    slug: "openapi-to-typescript-converter",
    category: "developer",
    icon: "braces",
    tags: ["code", "openapi", "typescript", "schema", "converter", "api"],
    locales: {
      ar: {
        name: "محول OpenAPI إلى TypeScript",
        description:
          "حوّل مستندات OpenAPI 3.x إلى أنواع TypeScript مباشرة في المتصفح مع خيارات التوليد الشائعة في openapi-typescript.",
      },
      de: {
        name: "OpenAPI-zu-TypeScript-Konverter",
        description:
          "OpenAPI-3.x-Dokumente direkt im Browser mit gängigen openapi-typescript-Optionen in TypeScript-Typen umwandeln.",
      },
      en: {
        name: "OpenAPI to TypeScript Converter",
        description:
          "Convert OpenAPI 3.x documents into TypeScript types entirely in your browser with common openapi-typescript generation options.",
      },
      es: {
        name: "Convertidor de OpenAPI a TypeScript",
        description:
          "Convierte documentos OpenAPI 3.x en tipos de TypeScript directamente en tu navegador con las opciones de generación habituales de openapi-typescript.",
      },
      fr: {
        name: "Convertisseur OpenAPI vers TypeScript",
        description:
          "Convertissez des documents OpenAPI 3.x en types TypeScript directement dans votre navigateur, avec des options courantes de génération openapi-typescript.",
      },
      he: {
        name: "ממיר OpenAPI ל-TypeScript",
        description:
          "המרת מסמכי OpenAPI 3.x לסוגי TypeScript ישירות בדפדפן, עם אפשרויות נפוצות של openapi-typescript.",
      },
      hi: {
        name: "OpenAPI से TypeScript कन्वर्टर",
        description:
          "ब्राउज़र में OpenAPI 3.x दस्तावेज़ों को TypeScript प्रकारों में बदलें, common openapi-typescript generation options के साथ।",
      },
      id: {
        name: "Konverter OpenAPI ke TypeScript",
        description:
          "Ubah dokumen OpenAPI 3.x menjadi tipe TypeScript sepenuhnya di browser dengan opsi generasi openapi-typescript yang umum.",
      },
      it: {
        name: "Convertitore da OpenAPI a TypeScript",
        description:
          "Converti documenti OpenAPI 3.x in tipi TypeScript direttamente nel browser con le opzioni comuni di generazione di openapi-typescript.",
      },
      ja: {
        name: "OpenAPI → TypeScript",
        description:
          "OpenAPI 3.x ドキュメントから、よく使う openapi-typescript の生成オプション付きで TypeScript 型をブラウザ内だけで変換します。",
      },
      ko: {
        name: "OpenAPI to TypeScript 변환기",
        description:
          "일반적인 openapi-typescript 생성 옵션을 사용해 OpenAPI 3.x 문서를 브라우저에서 바로 TypeScript 타입으로 변환합니다.",
      },
      ms: {
        name: "Penukar OpenAPI ke TypeScript",
        description:
          "Tukar dokumen OpenAPI 3.x kepada jenis TypeScript sepenuhnya dalam pelayar anda dengan pilihan penjanaan openapi-typescript yang biasa.",
      },
      nl: {
        name: "OpenAPI naar TypeScript-converter",
        description:
          "Zet OpenAPI 3.x-documenten rechtstreeks in je browser om naar TypeScript-types met gangbare openapi-typescript-generatieopties.",
      },
      no: {
        name: "OpenAPI til TypeScript-konvertering",
        description:
          "Konverter OpenAPI 3.x-dokumenter til TypeScript-typer helt i nettleseren, med vanlige openapi-typescript-innstillinger.",
      },
      pl: {
        name: "Konwerter OpenAPI do TypeScript",
        description:
          "Konwertuj dokumenty OpenAPI 3.x na typy TypeScript bezpośrednio w przeglądarce, z popularnymi opcjami generowania openapi-typescript.",
      },
      pt: {
        name: "Conversor de OpenAPI para TypeScript",
        description:
          "Converta documentos OpenAPI 3.x em tipos TypeScript totalmente no navegador, com opções comuns de geração do openapi-typescript.",
      },
      ru: {
        name: "Конвертер OpenAPI в TypeScript",
        description:
          "Преобразуйте документы OpenAPI 3.x в типы TypeScript прямо в браузере с распространенными параметрами генерации openapi-typescript.",
      },
      sv: {
        name: "OpenAPI till TypeScript-konverterare",
        description:
          "Konvertera OpenAPI 3.x-dokument till TypeScript-typer direkt i webbläsaren med vanliga openapi-typescript-inställningar.",
      },
      th: {
        name: "ตัวแปลง OpenAPI เป็น TypeScript",
        description:
          "แปลงเอกสาร OpenAPI 3.x เป็น TypeScript types ได้ทั้งหมดในเบราว์เซอร์ พร้อมตัวเลือกสร้างโค้ดแบบ openapi-typescript ที่ใช้บ่อย",
      },
      tr: {
        name: "OpenAPI'den TypeScript'e Dönüştürücü",
        description:
          "OpenAPI 3.x belgelerini tarayıcınızda tamamen TypeScript türlerine dönüştürün; yaygın openapi-typescript üretim seçenekleriyle.",
      },
      vi: {
        name: "Bộ chuyển OpenAPI sang TypeScript",
        description:
          "Chuyển tài liệu OpenAPI 3.x thành kiểu TypeScript ngay trong trình duyệt với các tùy chọn tạo openapi-typescript phổ biến.",
      },
      "zh-CN": {
        name: "OpenAPI 转 TypeScript 生成器",
        description:
          "在浏览器中将 OpenAPI 3.x 文档转换为 TypeScript 类型，并提供常见的 openapi-typescript 生成选项。",
      },
      "zh-TW": {
        name: "OpenAPI 轉 TypeScript 轉換器",
        description:
          "在瀏覽器中，將 OpenAPI 3.x 文件直接轉換為 TypeScript 型別，並支援常見的 openapi-typescript 產生選項。",
      },
    },
  },
  {
    slug: "password-strength-checker",
    category: "text",
    icon: "lock",
    tags: ["password", "security", "strength", "validator"],
    locales: {
      ar: {
        name: "مدقق قوة كلمة المرور",
        description:
          "قيّم القوة عبر الإنتروبيا والتركيب وفحص الأنماط مع نصائح لتحسين الأمان.",
      },
      de: {
        name: "Passwortstärke-Checker",
        description:
          "Bewertet die Passwortstärke anhand von Entropie, Zusammensetzung und Mustern und gibt Tipps zur Sicherheit.",
      },
      en: {
        name: "Password Strength Checker",
        description:
          "Assess password strength with entropy, composition, and pattern checks plus tips to improve security.",
      },
      es: {
        name: "Comprobador de Fuerza de Contraseña",
        description:
          "Evalúa la fortaleza con entropía, composición y patrones, y ofrece sugerencias para mejorar la seguridad.",
      },
      fr: {
        name: "Vérificateur de Robustesse de Mot de Passe",
        description:
          "Évalue la robustesse via entropie, composition et motifs, avec des conseils pour améliorer la sécurité.",
      },
      he: {
        name: "בודק חוזק סיסמה",
        description:
          "מעריך חוזק באמצעות אנטרופיה, הרכב ובדיקות דפוסים ומספק טיפים לשיפור האבטחה.",
      },
      hi: {
        name: "पासवर्ड मजबूती जांचकर्ता",
        description:
          "एंट्रॉपी, संरचना और पैटर्न जांच के साथ मजबूती का आकलन करें और सुरक्षा सुझाव पाएं।",
      },
      id: {
        name: "Pemeriksa Kekuatan Kata Sandi",
        description:
          "Menilai kekuatan dengan entropi, komposisi, dan pola, serta memberi saran untuk meningkatkan keamanan.",
      },
      it: {
        name: "Verificatore di Forza Password",
        description:
          "Valuta la forza con entropia, composizione e pattern, con suggerimenti per migliorare la sicurezza.",
      },
      ja: {
        name: "パスワード強度チェッカー",
        description:
          "エントロピーや構成、パターン検査で強度を評価し、安全性向上のヒントを提供します。",
      },
      ko: {
        name: "비밀번호 강도 검사기",
        description:
          "엔트로피, 구성, 패턴 검사를 통해 강도를 평가하고 보안을 높이는 팁을 제공합니다.",
      },
      ms: {
        name: "Pemeriksa Kekuatan Kata Laluan",
        description:
          "Menilai kekuatan dengan entropi, komposisi dan corak, serta memberi cadangan untuk meningkatkan keselamatan.",
      },
      nl: {
        name: "Wachtwoordsterkte Checker",
        description:
          "Beoordeelt sterkte met entropie-, samenstellings- en patroonchecks, plus tips voor betere veiligheid.",
      },
      no: {
        name: "Passordstyrke-sjekk",
        description:
          "Vurderer passordstyrke med entropi, sammensetning og mønstre, og gir tips for bedre sikkerhet.",
      },
      pl: {
        name: "Sprawdzanie Siły Hasła",
        description:
          "Ocenia siłę hasła na podstawie entropii, składu i wzorców oraz podaje wskazówki bezpieczeństwa.",
      },
      pt: {
        name: "Verificador de Força de Senha",
        description:
          "Avalia a força com entropia, composição e padrões, além de dicas para melhorar a segurança.",
      },
      ru: {
        name: "Проверка Стойкости Пароля",
        description:
          "Оценивает стойкость по энтропии, составу и шаблонам и дает советы по повышению безопасности.",
      },
      sv: {
        name: "Lösenordsstyrke-kontroll",
        description:
          "Bedömer lösenordsstyrka med entropi-, sammansättnings- och mönsterkontroller samt tips för säkerhet.",
      },
      th: {
        name: "ตัวตรวจสอบความแข็งแรงของรหัสผ่าน",
        description:
          "ประเมินความแข็งแรงด้วยเอนโทรปี องค์ประกอบ และรูปแบบ พร้อมคำแนะนำเพื่อเพิ่มความปลอดภัย.",
      },
      tr: {
        name: "Parola Gücü Denetleyici",
        description:
          "Entropi, bileşim ve desen kontrolleriyle gücü değerlendirir ve güvenliği artırmak için öneriler sunar.",
      },
      vi: {
        name: "Kiểm tra độ mạnh mật khẩu",
        description:
          "Đánh giá độ mạnh bằng entropy, thành phần ký tự và mẫu, kèm gợi ý cải thiện bảo mật.",
      },
      "zh-CN": {
        name: "密码强度检测",
        description:
          "通过熵值、字符组成和模式检测评估密码强度，并提供提升安全性的建议。",
      },
      "zh-TW": {
        name: "密碼強度檢測",
        description:
          "透過熵值、字元組成與模式檢查評估密碼強度，並提供提升安全性的建議。",
      },
    },
  },
  {
    slug: "pbkdf2-key-derivation",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "kdf", "pbkdf2", "password", "key", "crypto", "security"],
    locales: {
      ar: {
        name: "اشتقاق مفاتيح PBKDF2",
        description:
          "اشتق المفاتيح من كلمة مرور وملح باستخدام PBKDF2. اضبط عدد التكرارات وخوارزمية الهاش وطول الإخراج مع نتائج بصيغة hex أو base64.",
      },
      de: {
        name: "PBKDF2-Schlüsselableitung",
        description:
          "Leiten Sie Schlüssel aus Passwort und Salt mit PBKDF2 ab. Konfigurieren Sie Iterationen, Hash-Algorithmus und Ausgabelänge mit Hex- oder Base64-Ausgabe.",
      },
      en: {
        name: "PBKDF2 Key Derivation",
        description:
          "Derive keys from a password and salt with PBKDF2. Configure iterations, hash algorithm, and output length with hex or base64 output.",
      },
      es: {
        name: "Derivación de Claves PBKDF2",
        description:
          "Deriva claves a partir de una contraseña y una sal con PBKDF2. Configura iteraciones, algoritmo hash y longitud de salida con resultados en hex o base64.",
      },
      fr: {
        name: "Dérivation de Clé PBKDF2",
        description:
          "Dérivez des clés à partir d’un mot de passe et d’un sel avec PBKDF2. Configurez les itérations, l’algorithme de hachage et la longueur de sortie en hex ou base64.",
      },
      he: {
        name: "נגזרת מפתח PBKDF2",
        description:
          "גזור מפתחות מסיסמה וממלח באמצעות PBKDF2. הגדר איטרציות, אלגוריתם גיבוב ואורך פלט עם תוצאות hex או base64.",
      },
      hi: {
        name: "PBKDF2 कुंजी व्युत्पत्ति",
        description:
          "PBKDF2 के साथ पासवर्ड और सॉल्ट से कुंजियाँ व्युत्पन्न करें। इटरेशन, हैश एल्गोरिदम और आउटपुट लंबाई सेट करें, आउटपुट hex या base64 में।",
      },
      id: {
        name: "Derivasi Kunci PBKDF2",
        description:
          "Derivasi kunci dari kata sandi dan salt dengan PBKDF2. Atur iterasi, algoritma hash, dan panjang output dengan hasil hex atau base64.",
      },
      it: {
        name: "Derivazione Chiave PBKDF2",
        description:
          "Deriva chiavi da password e salt con PBKDF2. Configura iterazioni, algoritmo hash e lunghezza dell’output con risultati in hex o base64.",
      },
      ja: {
        name: "PBKDF2 鍵導出",
        description:
          "PBKDF2 を使ってパスワードとソルトから鍵を導出します。反復回数、ハッシュアルゴリズム、出力長を設定し、16進数またはBase64で出力します。",
      },
      ko: {
        name: "PBKDF2 키 파생",
        description:
          "PBKDF2로 비밀번호와 솔트에서 키를 파생합니다. 반복 횟수, 해시 알고리즘, 출력 길이를 설정하고 hex 또는 base64로 출력합니다.",
      },
      ms: {
        name: "Derivasi Kunci PBKDF2",
        description:
          "Derivasi kunci daripada kata laluan dan salt dengan PBKDF2. Tetapkan iterasi, algoritma hash dan panjang output dengan hasil hex atau base64.",
      },
      nl: {
        name: "PBKDF2-sleutelafleiding",
        description:
          "Leid sleutels af uit een wachtwoord en salt met PBKDF2. Stel iteraties, hash-algoritme en uitvoerlengte in met hex- of base64-uitvoer.",
      },
      no: {
        name: "PBKDF2-nøkkelavledning",
        description:
          "Avled nøkler fra passord og salt med PBKDF2. Konfigurer iterasjoner, hash‑algoritme og utdata‑lengde med hex- eller base64‑utdata.",
      },
      pl: {
        name: "Wyprowadzanie klucza PBKDF2",
        description:
          "Wyprowadzaj klucze z hasła i soli za pomocą PBKDF2. Ustaw iteracje, algorytm hash i długość wyjścia z wynikiem w hex lub base64.",
      },
      pt: {
        name: "Derivação de Chaves PBKDF2",
        description:
          "Derive chaves a partir de senha e salt com PBKDF2. Configure iterações, algoritmo hash e comprimento de saída com resultado em hex ou base64.",
      },
      ru: {
        name: "Вывод ключей PBKDF2",
        description:
          "Выводите ключи из пароля и соли с PBKDF2. Настраивайте число итераций, хэш‑алгоритм и длину вывода с результатом в hex или base64.",
      },
      sv: {
        name: "PBKDF2-nyckelhärledning",
        description:
          "Härled nycklar från lösenord och salt med PBKDF2. Konfigurera iterationer, hash-algoritm och utmatningslängd med hex- eller base64‑utdata.",
      },
      th: {
        name: "การสร้างคีย์ PBKDF2",
        description:
          "สร้างคีย์จากรหัสผ่านและซอลต์ด้วย PBKDF2 ปรับจำนวนรอบ อัลกอริทึมแฮช และความยาวผลลัพธ์ พร้อมเอาต์พุตแบบ hex หรือ base64",
      },
      tr: {
        name: "PBKDF2 Anahtar Türetme",
        description:
          "PBKDF2 ile parola ve tuzdan anahtar türetin. Yineleme sayısı, hash algoritması ve çıktı uzunluğunu ayarlayın; hex veya base64 çıktı alın.",
      },
      vi: {
        name: "Suy xuất khóa PBKDF2",
        description:
          "Suy xuất khóa từ mật khẩu và muối bằng PBKDF2. Cấu hình số vòng lặp, thuật toán băm và độ dài đầu ra với kết quả hex hoặc base64.",
      },
      "zh-CN": {
        name: "PBKDF2 密钥派生",
        description:
          "使用 PBKDF2 从密码和盐派生密钥。可配置迭代次数、哈希算法和输出长度，支持十六进制或 Base64 输出。",
      },
      "zh-TW": {
        name: "PBKDF2 金鑰派生",
        description:
          "使用 PBKDF2 從密碼和鹽派生金鑰。可設定迭代次數、雜湊演算法與輸出長度，支援十六進位或 Base64 輸出。",
      },
    },
  },
  {
    slug: "placeholder-image-generator",
    category: "image",
    icon: "image",
    tags: [
      "placeholder",
      "image",
      "generator",
      "gradient",
      "png",
      "jpeg",
      "svg",
      "webp",
    ],
    locales: {
      ar: {
        name: "مولد الصور النائبة",
        description:
          "أنشئ صور نائبة بأبعاد وألوان وتدرجات ونص مخصص. صدّر بصيغ PNG أو JPG أو SVG أو WebP مع دعم Retina.",
      },
      de: {
        name: "Platzhalter-Bildgenerator",
        description:
          "Erstellen Sie Platzhalterbilder mit benutzerdefinierten Abmessungen, Farben, Verläufen und Text. Export als PNG, JPG, SVG oder WebP mit Retina-Unterstützung.",
      },
      en: {
        name: "Placeholder Image Generator",
        description:
          "Generate placeholder images with custom dimensions, colors, gradients, and text. Export as PNG, JPG, SVG, or WebP with Retina support.",
      },
      es: {
        name: "Generador de Imágenes de Marcador",
        description:
          "Genera imágenes de marcador con dimensiones, colores, degradados y texto personalizados. Exporta como PNG, JPG, SVG o WebP con soporte Retina.",
      },
      fr: {
        name: "Générateur d'Images Placeholder",
        description:
          "Générez des images placeholder avec dimensions, couleurs, dégradés et texte personnalisés. Exportez en PNG, JPG, SVG ou WebP avec support Retina.",
      },
      he: {
        name: "מחולל תמונות שומר מקום",
        description:
          "צרו תמונות שומר מקום עם ממדים, צבעים, מעברי צבע וטקסט מותאמים אישית. ייצוא כ-PNG, JPG, SVG או WebP עם תמיכת Retina.",
      },
      hi: {
        name: "प्लेसहोल्डर छवि जनरेटर",
        description:
          "कस्टम आयाम, रंग, ग्रेडिएंट और टेक्स्ट के साथ प्लेसहोल्डर छवियाँ बनाएँ। Retina समर्थन के साथ PNG, JPG, SVG या WebP में निर्यात करें।",
      },
      id: {
        name: "Generator Gambar Placeholder",
        description:
          "Buat gambar placeholder dengan dimensi, warna, gradien, dan teks khusus. Ekspor sebagai PNG, JPG, SVG, atau WebP dengan dukungan Retina.",
      },
      it: {
        name: "Generatore di Immagini Segnaposto",
        description:
          "Genera immagini segnaposto con dimensioni, colori, sfumature e testo personalizzati. Esporta come PNG, JPG, SVG o WebP con supporto Retina.",
      },
      ja: {
        name: "プレースホルダー画像ジェネレーター",
        description:
          "カスタムサイズ、色、グラデーション、テキストのプレースホルダー画像を生成。PNG、JPG、SVG、WebP形式でRetina対応出力。",
      },
      ko: {
        name: "플레이스홀더 이미지 생성기",
        description:
          "사용자 정의 크기, 색상, 그라데이션 및 텍스트로 플레이스홀더 이미지를 생성합니다. Retina 지원 PNG, JPG, SVG, WebP로 내보내기.",
      },
      ms: {
        name: "Penjana Imej Pemegang Tempat",
        description:
          "Jana imej pemegang tempat dengan dimensi, warna, kecerunan dan teks tersuai. Eksport sebagai PNG, JPG, SVG atau WebP dengan sokongan Retina.",
      },
      nl: {
        name: "Plaatshouder Afbeelding Generator",
        description:
          "Genereer plaatshouder afbeeldingen met aangepaste afmetingen, kleuren, verlopen en tekst. Exporteer als PNG, JPG, SVG of WebP met Retina-ondersteuning.",
      },
      no: {
        name: "Plassholder-bildegenerator",
        description:
          "Generer plassholderbilder med tilpassede dimensjoner, farger, gradienter og tekst. Eksporter som PNG, JPG, SVG eller WebP med Retina-støtte.",
      },
      pl: {
        name: "Generator obrazów zastępczych",
        description:
          "Generuj obrazy zastępcze z niestandardowymi wymiarami, kolorami, gradientami i tekstem. Eksportuj jako PNG, JPG, SVG lub WebP z obsługą Retina.",
      },
      pt: {
        name: "Gerador de Imagens Placeholder",
        description:
          "Gere imagens placeholder com dimensões, cores, gradientes e texto personalizados. Exporte como PNG, JPG, SVG ou WebP com suporte Retina.",
      },
      ru: {
        name: "Генератор изображений-заполнителей",
        description:
          "Создавайте изображения-заполнители с настраиваемыми размерами, цветами, градиентами и текстом. Экспорт в PNG, JPG, SVG или WebP с поддержкой Retina.",
      },
      sv: {
        name: "Platshållarbildgenerator",
        description:
          "Generera platshållarbilder med anpassade dimensioner, färger, gradienter och text. Exportera som PNG, JPG, SVG eller WebP med Retina-stöd.",
      },
      th: {
        name: "ตัวสร้างภาพตัวยึดตำแหน่ง",
        description:
          "สร้างภาพตัวยึดตำแหน่งด้วยขนาด สี การไล่ระดับสี และข้อความที่กำหนดเอง ส่งออกเป็น PNG, JPG, SVG หรือ WebP พร้อมรองรับ Retina",
      },
      tr: {
        name: "Yer Tutucu Görüntü Oluşturucu",
        description:
          "Özel boyutlar, renkler, degradeler ve metin ile yer tutucu görüntüler oluşturun. Retina desteğiyle PNG, JPG, SVG veya WebP olarak dışa aktarın.",
      },
      vi: {
        name: "Trình tạo ảnh giữ chỗ",
        description:
          "Tạo ảnh giữ chỗ với kích thước, màu sắc, gradient và văn bản tùy chỉnh. Xuất dưới dạng PNG, JPG, SVG hoặc WebP với hỗ trợ Retina.",
      },
      "zh-CN": {
        name: "占位图生成器",
        description:
          "生成自定义尺寸、颜色、渐变和文字的占位图。支持 PNG、JPG、SVG、WebP 格式及 Retina 高清输出。",
      },
      "zh-TW": {
        name: "佔位圖產生器",
        description:
          "產生自訂尺寸、顏色、漸層和文字的佔位圖。支援 PNG、JPG、SVG、WebP 格式及 Retina 高清輸出。",
      },
    },
  },
  {
    slug: "port-number-lookup",
    category: "network",
    icon: "network",
    tags: ["port", "tcp", "udp", "iana", "reference"],
    locales: {
      ar: {
        name: "البحث عن أرقام المنافذ",
        description: "البحث وتصفح أرقام منافذ الشبكة الشائعة",
      },
      de: {
        name: "Port-Nummern-Suche",
        description: "Suchen und durchsuchen Sie gängige Netzwerk-Portnummern",
      },
      en: {
        name: "Port Number Lookup",
        description: "Search and browse common network port numbers",
      },
      es: {
        name: "Consulta de Puertos",
        description: "Buscar y explorar números de puertos de red comunes",
      },
      fr: {
        name: "Recherche de Ports",
        description:
          "Rechercher et parcourir les numéros de ports réseau courants",
      },
      he: {
        name: "חיפוש מספרי פורט",
        description: "חפש ועיין במספרי פורט רשת נפוצים",
      },
      hi: {
        name: "पोर्ट नंबर खोज",
        description: "सामान्य नेटवर्क पोर्ट नंबर खोजें और ब्राउज़ करें",
      },
      id: {
        name: "Pencarian Nomor Port",
        description: "Cari dan jelajahi nomor port jaringan umum",
      },
      it: {
        name: "Ricerca Porte",
        description: "Cerca e sfoglia i numeri di porta di rete comuni",
      },
      ja: {
        name: "ポート番号検索",
        description: "一般的なネットワークポート番号を検索・閲覧",
      },
      ko: {
        name: "포트 번호 조회",
        description: "일반적인 네트워크 포트 번호 검색 및 탐색",
      },
      ms: {
        name: "Carian Nombor Port",
        description: "Cari dan semak nombor port rangkaian biasa",
      },
      nl: {
        name: "Poortnummer Opzoeken",
        description: "Zoek en blader door veelvoorkomende netwerkpoortnummers",
      },
      no: {
        name: "Portnummersok",
        description: "Sok og bla gjennom vanlige nettverksportnumre",
      },
      pl: {
        name: "Wyszukiwanie Portów",
        description: "Wyszukuj i przeglądaj popularne numery portów sieciowych",
      },
      pt: {
        name: "Consulta de Portas",
        description: "Pesquisar e navegar por números de portas de rede comuns",
      },
      ru: {
        name: "Поиск Портов",
        description: "Поиск и просмотр распространённых сетевых портов",
      },
      sv: {
        name: "Portnummerssökning",
        description: "Sök och bläddra bland vanliga nätverksportnummer",
      },
      th: {
        name: "ค้นหาหมายเลขพอร์ต",
        description: "ค้นหาและเรียกดูหมายเลขพอร์ตเครือข่ายทั่วไป",
      },
      tr: {
        name: "Port Numarası Arama",
        description: "Yaygın ağ port numaralarını arayın ve göz atın",
      },
      vi: {
        name: "Tra Cứu Số Cổng",
        description: "Tìm kiếm và duyệt các số cổng mạng phổ biến",
      },
      "zh-CN": {
        name: "端口号查询",
        description: "搜索和浏览常见网络端口号",
      },
      "zh-TW": {
        name: "連接埠號碼查詢",
        description: "搜尋和瀏覽常見網路連接埠號碼",
      },
    },
  },
  {
    slug: "prc-id-validator",
    category: "text",
    icon: "file-text",
    tags: ["resident-id", "validator", "china", "prc", "identity", "checksum"],
    locales: {
      ar: {
        name: "مدقق هوية المقيم في جمهورية الصين الشعبية",
        description:
          "يتحقق من أرقام هوية المقيم ويفك ترميز المنطقة وتاريخ الميلاد والمجموع الاختباري",
      },
      de: {
        name: "PRC-Resident-ID-Validator",
        description:
          "Validiert PRC-Resident-IDs und dekodiert Region, Geburtsdatum und Prüfsumme",
      },
      en: {
        name: "PRC Resident ID Validator",
        description:
          "Validate PRC Resident ID numbers, decode region, birthdate, and checksum",
      },
      es: {
        name: "Validador de ID de residente de la RPC",
        description:
          "Valida IDs de residente de la RPC y analiza región, fecha de nacimiento y checksum",
      },
      fr: {
        name: "Validateur d'ID de résident de la RPC",
        description:
          "Valide les ID de résident de la RPC et décode la région, la date de naissance et la somme de contrôle",
      },
      he: {
        name: "מאמת מזהה תושב סין",
        description:
          "מאמת מספרי מזהה תושב ומפענח אזור, תאריך לידה וסכום ביקורת",
      },
      hi: {
        name: "पीआरसी निवासी आईडी सत्यापनकर्ता",
        description:
          "पीआरसी निवासी आईडी नंबर सत्यापित करें और क्षेत्र, जन्म तिथि व चेकसम निकालें",
      },
      id: {
        name: "Validator ID penduduk Tiongkok",
        description:
          "Memvalidasi ID penduduk Tiongkok dan menguraikan wilayah, tanggal lahir, serta checksum",
      },
      it: {
        name: "Validatore ID residente RPC",
        description:
          "Valida gli ID residente RPC e decodifica regione, data di nascita e checksum",
      },
      ja: {
        name: "中国居民身份证検証",
        description:
          "中国居民身份证番号を検証し、地域・生年月日・チェックサムを解析します",
      },
      ko: {
        name: "중국 주민 신분증 검증기",
        description:
          "중국 주민 신분증 번호를 검증하고 지역, 생년월일, 체크섬을 해석합니다",
      },
      ms: {
        name: "Pengesah ID penduduk PRC",
        description:
          "Mengesahkan ID penduduk PRC dan menyahkod wilayah, tarikh lahir serta checksum",
      },
      nl: {
        name: "PRC Resident-ID-validator",
        description:
          "Valideert PRC Resident-ID's en decodeert regio, geboortedatum en controlesom",
      },
      no: {
        name: "PRC Resident-ID-validator",
        description:
          "Validerer PRC Resident-ID og dekoder region, fødselsdato og kontrollsum",
      },
      pl: {
        name: "Walidator ID mieszkańca ChRL",
        description:
          "Waliduje ID mieszkańca ChRL i dekoduje region, datę urodzenia oraz sumę kontrolną",
      },
      pt: {
        name: "Validador de ID de residente da RPC",
        description:
          "Valida IDs de residente da RPC e decodifica região, data de nascimento e checksum",
      },
      ru: {
        name: "Валидатор ID резидента КНР",
        description:
          "Проверяет ID резидента КНР и расшифровывает регион, дату рождения и контрольную сумму",
      },
      sv: {
        name: "PRC Resident-ID-validator",
        description:
          "Validerar PRC Resident-ID och tolkar region, födelsedatum och kontrollsumma",
      },
      th: {
        name: "ตัวตรวจสอบบัตรประจำตัวผู้พำนักจีน",
        description: "ตรวจสอบหมายเลขประจำตัวผู้พำนักและถอดรหัสภูมิภาค วันเกิด และเช็คซัม",
      },
      tr: {
        name: "PRC Resident ID Doğrulayıcı",
        description:
          "PRC Resident ID numaralarını doğrular, bölge, doğum tarihi ve sağlama toplamını çözümler",
      },
      vi: {
        name: "Trình xác thực ID cư trú Trung Quốc",
        description:
          "Xác thực ID cư trú và giải mã khu vực, ngày sinh, checksum",
      },
      "zh-CN": {
        name: "中华人民共和国居民身份证解析与验证器",
        description: "验证居民身份证号并解析地区、出生日期与校验位",
      },
      "zh-TW": {
        name: "中華人民共和國居民身分證解析與驗證器",
        description: "驗證居民身分證號並解析地區、出生日期與校驗位",
      },
    },
  },
  {
    slug: "prettier-code-formatter",
    category: "developer",
    icon: "braces",
    tags: [
      "code",
      "formatter",
      "prettier",
      "javascript",
      "typescript",
      "json",
      "html",
      "css",
      "markdown",
      "yaml",
    ],
    locales: {
      ar: {
        name: "منسق كود Prettier",
        description:
          "نسق ملفات JavaScript وTypeScript وJSON وHTML وCSS وMarkdown وYAML وGraphQL والملفات المرتبطة بها باستخدام Prettier مباشرةً في متصفحك.",
      },
      de: {
        name: "Prettier-Code-Formatierer",
        description:
          "JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL und verwandte Dateien direkt im Browser mit Prettier formatieren.",
      },
      en: {
        name: "Prettier Code Formatter",
        description:
          "Format JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL, and related files with Prettier directly in your browser.",
      },
      es: {
        name: "Formateador de código Prettier",
        description:
          "Da formato con Prettier directamente en el navegador a JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL y archivos relacionados.",
      },
      fr: {
        name: "Formatteur de code Prettier",
        description:
          "Formatez JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL et les fichiers associés avec Prettier directement dans votre navigateur.",
      },
      he: {
        name: "מפרמט קוד Prettier",
        description:
          "עצבו JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL וקבצים קרובים להם ישירות בדפדפן עם Prettier.",
      },
      hi: {
        name: "Prettier कोड फ़ॉर्मैटर",
        description:
          "JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL और संबंधित फ़ाइलों को अपने ब्राउज़र में सीधे Prettier से फ़ॉर्मैट करें।",
      },
      id: {
        name: "Pemformat Kode Prettier",
        description:
          "Format JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL, dan file terkait dengan Prettier langsung di browser Anda.",
      },
      it: {
        name: "Formatter di codice Prettier",
        description:
          "Formatta JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL e file correlati con Prettier direttamente nel browser.",
      },
      ja: {
        name: "Prettier コードフォーマッター",
        description:
          "Prettier を使って JavaScript、TypeScript、JSON、HTML、CSS、Markdown、YAML、GraphQL などの関連ファイルをブラウザ上で直接整形します。",
      },
      ko: {
        name: "Prettier 코드 포맷터",
        description:
          "JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL 및 관련 파일을 브라우저에서 Prettier로 바로 포맷합니다.",
      },
      ms: {
        name: "Pemformat Kod Prettier",
        description:
          "Format JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL dan fail berkaitan dengan Prettier terus di pelayar anda.",
      },
      nl: {
        name: "Prettier-codeformatter",
        description:
          "Formatteer JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL en verwante bestanden rechtstreeks in je browser met Prettier.",
      },
      no: {
        name: "Prettier-kodeformatterer",
        description:
          "Formater JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL og relaterte filer med Prettier direkte i nettleseren.",
      },
      pl: {
        name: "Formatowanie kodu Prettier",
        description:
          "Formatuj JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL i powiązane pliki za pomocą Prettier bezpośrednio w przeglądarce.",
      },
      pt: {
        name: "Formatador de Código Prettier",
        description:
          "Formate JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL e arquivos relacionados com o Prettier diretamente no navegador.",
      },
      ru: {
        name: "Форматировщик кода Prettier",
        description:
          "Форматируйте JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL и связанные файлы с помощью Prettier прямо в браузере.",
      },
      sv: {
        name: "Prettier-kodformaterare",
        description:
          "Formatera JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL och relaterade filer med Prettier direkt i webbläsaren.",
      },
      th: {
        name: "Prettier ตัวจัดรูปแบบโค้ด",
        description:
          "จัดรูปแบบ JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL และไฟล์ที่เกี่ยวข้องด้วย Prettier ได้โดยตรงในเบราว์เซอร์",
      },
      tr: {
        name: "Prettier Kod Biçimlendirici",
        description:
          "JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL ve ilgili dosyaları doğrudan tarayıcınızda Prettier ile biçimlendirin.",
      },
      vi: {
        name: "Trình định dạng mã Prettier",
        description:
          "Định dạng JavaScript, TypeScript, JSON, HTML, CSS, Markdown, YAML, GraphQL và các tệp liên quan bằng Prettier ngay trong trình duyệt.",
      },
      "zh-CN": {
        name: "Prettier 代码格式化工具",
        description:
          "直接在浏览器中用 Prettier 格式化 JavaScript、TypeScript、JSON、HTML、CSS、Markdown、YAML、GraphQL 及相关文件。",
      },
      "zh-TW": {
        name: "Prettier 程式碼格式化工具",
        description:
          "直接在瀏覽器中用 Prettier 格式化 JavaScript、TypeScript、JSON、HTML、CSS、Markdown、YAML、GraphQL 與相關檔案。",
      },
    },
  },
  {
    slug: "radio-timecode",
    category: "time",
    icon: "clock3",
    tags: [
      "time",
      "clock",
      "radio",
      "timecode",
      "sync",
      "jjy",
      "bpc",
      "dcf77",
      "msf",
      "wwvb",
      "signal",
      "offline",
    ],
    locales: {
      ar: {
        name: "مزامنة رموز التوقيت الراديوية",
        description:
          "ولّد محليًا صوت رموز توقيت راديوية وفق JJY أو BPC أو DCF77 أو MSF أو WWVB للمساعدة في مزامنة الساعات المتوافقة التي تُضبط بالراديو.",
      },
      de: {
        name: "Funkzeitcode-Synchronisierung",
        description:
          "Erzeuge JJY-, BPC-, DCF77-, MSF- oder WWVB-Funkzeitcode-Audio lokal, um kompatible Funkuhren beim Synchronisieren zu unterstützen.",
      },
      en: {
        name: "Radio Timecode Sync",
        description:
          "Generate JJY, BPC, DCF77, MSF, or WWVB radio timecode audio locally to help sync compatible radio-controlled clocks.",
      },
      es: {
        name: "Sincronización de códigos horarios de radio",
        description:
          "Genera audio de códigos horarios de radio JJY, BPC, DCF77, MSF o WWVB localmente para ayudar a sincronizar relojes radiocontrolados compatibles.",
      },
      fr: {
        name: "Synchronisation de code horaire radio",
        description:
          "Générez localement un signal audio de code horaire radio JJY, BPC, DCF77, MSF ou WWVB pour aider à synchroniser les horloges radio-pilotées compatibles.",
      },
      he: {
        name: "סנכרון קוד זמן רדיו",
        description:
          "צרו באופן מקומי שמע של קוד זמן רדיו JJY, BPC, DCF77, MSF או WWVB כדי לעזור בסנכרון שעונים מבוקרי-רדיו תואמים.",
      },
      hi: {
        name: "रेडियो टाइमकोड सिंक",
        description:
          "संगत रेडियो-नियंत्रित घड़ियों को सिंक करने में मदद के लिए JJY, BPC, DCF77, MSF या WWVB रेडियो टाइमकोड ऑडियो स्थानीय रूप से जनरेट करें।",
      },
      id: {
        name: "Sinkronisasi kode waktu radio",
        description:
          "Buat audio kode waktu radio JJY, BPC, DCF77, MSF, atau WWVB secara lokal untuk membantu menyinkronkan jam yang dikendalikan radio dan kompatibel.",
      },
      it: {
        name: "Sincronizzazione del codice orario radio",
        description:
          "Genera localmente audio con codice orario radio JJY, BPC, DCF77, MSF o WWVB per aiutare a sincronizzare orologi radiocontrollati compatibili.",
      },
      ja: {
        name: "電波タイムコード同期",
        description:
          "JJY、BPC、DCF77、MSF、WWVB の電波タイムコード音声をローカルで生成し、対応する電波時計の同期を支援します。",
      },
      ko: {
        name: "라디오 타임코드 동기화",
        description:
          "호환되는 전파 시계 동기화를 돕기 위해 JJY, BPC, DCF77, MSF 또는 WWVB 라디오 타임코드 오디오를 로컬에서 생성합니다.",
      },
      ms: {
        name: "Penyegerakan kod masa radio",
        description:
          "Jana audio kod masa radio JJY, BPC, DCF77, MSF, atau WWVB secara setempat untuk membantu menyegerakkan jam kawalan radio yang serasi.",
      },
      nl: {
        name: "Radiotijdcode-synchronisatie",
        description:
          "Genereer lokaal JJY-, BPC-, DCF77-, MSF- of WWVB-radiotijdcode-audio om compatibele radiogestuurde klokken te helpen synchroniseren.",
      },
      no: {
        name: "Synkronisering av radiotidskode",
        description:
          "Generer JJY-, BPC-, DCF77-, MSF- eller WWVB-radiotidskode-lyd lokalt for å hjelpe med å synkronisere kompatible radiostyrte klokker.",
      },
      pl: {
        name: "Synchronizacja radiowego kodu czasu",
        description:
          "Generuj lokalnie dźwiękowe kody czasu radiowego JJY, BPC, DCF77, MSF lub WWVB, aby pomóc synchronizować zgodne zegary sterowane radiowo.",
      },
      pt: {
        name: "Sincronização de código horário por rádio",
        description:
          "Gere localmente áudio de código horário de rádio JJY, BPC, DCF77, MSF ou WWVB para ajudar a sincronizar relógios radiocontrolados compatíveis.",
      },
      ru: {
        name: "Синхронизация радиокода времени",
        description:
          "Локально генерируйте аудиосигнал радиокода времени JJY, BPC, DCF77, MSF или WWVB, чтобы синхронизировать совместимые часы с радиосинхронизацией.",
      },
      sv: {
        name: "Radiotidskodssynkronisering",
        description:
          "Generera radiotidskodsljud för JJY, BPC, DCF77, MSF eller WWVB lokalt för att hjälpa till att synkronisera kompatibla radiostyrda klockor.",
      },
      th: {
        name: "ซิงก์ไทม์โค้ดวิทยุ",
        description:
          "สร้างเสียงไทม์โค้ดวิทยุ JJY, BPC, DCF77, MSF หรือ WWVB ภายในเครื่อง เพื่อช่วยซิงก์นาฬิกาที่ควบคุมด้วยวิทยุซึ่งรองรับ",
      },
      tr: {
        name: "Radyo Zaman Kodu Eşitleme",
        description:
          "Uyumlu radyo kontrollü saatleri eşitlemeye yardımcı olmak için JJY, BPC, DCF77, MSF veya WWVB radyo zaman kodu sesini yerel olarak oluşturun.",
      },
      vi: {
        name: "Đồng bộ mã thời gian vô tuyến",
        description:
          "Tạo âm thanh mã thời gian vô tuyến JJY, BPC, DCF77, MSF hoặc WWVB ngay trên thiết bị để giúp đồng bộ các đồng hồ điều khiển bằng sóng vô tuyến tương thích.",
      },
      "zh-CN": {
        name: "无线电时间码同步",
        description:
          "在本地生成 JJY、BPC、DCF77、MSF 或 WWVB 无线电时间码音频，帮助同步兼容的电波钟。",
      },
      "zh-TW": {
        name: "無線電時碼同步",
        description:
          "在本機產生 JJY、BPC、DCF77、MSF 或 WWVB 無線電時碼音訊，協助同步相容的電波鐘。",
      },
    },
  },
  {
    slug: "random-number-generator",
    category: "random",
    icon: "binary",
    tags: ["random", "number", "generator", "dice", "lottery", "draw"],
    locales: {
      ar: {
        name: "مولد أرقام عشوائية",
        description:
          "أنشئ أرقامًا عشوائية بنطاق وعدد مخصصين مع خيار الأرقام العشرية.",
      },
      de: {
        name: "Zufallszahlengenerator",
        description:
          "Erzeuge Zufallszahlen mit benutzerdefiniertem Bereich und Anzahl, optional mit Dezimalstellen.",
      },
      en: {
        name: "Random Number Generator",
        description:
          "Generate random numbers with custom ranges, counts, and optional decimals.",
      },
      es: {
        name: "Generador de números aleatorios",
        description:
          "Genera números aleatorios con rango y cantidad personalizados, con opción de decimales.",
      },
      fr: {
        name: "Générateur de nombres aléatoires",
        description:
          "Générez des nombres aléatoires avec une plage et une quantité personnalisées, avec option décimale.",
      },
      he: {
        name: "מחולל מספרים אקראיים",
        description:
          "צור מספרים אקראיים עם טווח וכמות מותאמים, עם אפשרות לעשרוניות.",
      },
      hi: {
        name: "रैंडम नंबर जनरेटर",
        description: "कस्टम रेंज और संख्या के साथ रैंडम नंबर बनाएं, दशमलव का विकल्प सहित।",
      },
      id: {
        name: "Generator angka acak",
        description:
          "Buat angka acak dengan rentang dan jumlah khusus, dengan opsi desimal.",
      },
      it: {
        name: "Generatore di numeri casuali",
        description:
          "Genera numeri casuali con intervallo e quantità personalizzati, con decimali opzionali.",
      },
      ja: {
        name: "乱数生成器",
        description: "範囲と個数を指定して乱数を生成し、小数にも対応します。",
      },
      ko: {
        name: "난수 생성기",
        description: "범위와 개수를 지정해 난수를 생성하고 소수도 지원합니다.",
      },
      ms: {
        name: "Penjana nombor rawak",
        description:
          "Jana nombor rawak dengan julat dan jumlah tersuai, dengan pilihan perpuluhan.",
      },
      nl: {
        name: "Randomgetallengenerator",
        description:
          "Genereer willekeurige getallen met aangepast bereik en aantal, optioneel met decimalen.",
      },
      no: {
        name: "Tilfeldig tallgenerator",
        description:
          "Generer tilfeldige tall med tilpasset område og antall, med valgfrie desimaler.",
      },
      pl: {
        name: "Generator liczb losowych",
        description:
          "Generuj liczby losowe z niestandardowym zakresem i liczbą, z opcjonalnymi miejscami dziesiętnymi.",
      },
      pt: {
        name: "Gerador de números aleatórios",
        description:
          "Gere números aleatórios com intervalo e quantidade personalizados, com opção de decimais.",
      },
      ru: {
        name: "Генератор случайных чисел",
        description:
          "Создавайте случайные числа с настраиваемым диапазоном и количеством, с поддержкой десятичных.",
      },
      sv: {
        name: "Slumptalsgenerator",
        description:
          "Generera slumptal med anpassat intervall och antal, med valfria decimaler.",
      },
      th: {
        name: "ตัวสร้างตัวเลขสุ่ม",
        description: "สร้างตัวเลขสุ่มด้วยช่วงและจำนวนที่กำหนดเอง พร้อมตัวเลือกทศนิยม",
      },
      tr: {
        name: "Rastgele Sayı Üretici",
        description:
          "Özel aralık ve miktarla rastgele sayılar üretin, isteğe bağlı ondalıklarla.",
      },
      vi: {
        name: "Trình tạo số ngẫu nhiên",
        description:
          "Tạo số ngẫu nhiên với khoảng và số lượng tùy chỉnh, có tùy chọn số thập phân.",
      },
      "zh-CN": {
        name: "随机数生成器",
        description: "生成指定范围与数量的随机数字，支持小数。",
      },
      "zh-TW": {
        name: "隨機數產生器",
        description: "產生指定範圍與數量的隨機數字，支援小數。",
      },
    },
  },
  {
    slug: "random-password-generator",
    category: "random",
    icon: "lock",
    tags: [
      "random",
      "password",
      "passphrase",
      "pin",
      "security",
      "generator",
      "bip39",
    ],
    locales: {
      ar: {
        name: "مولد كلمات المرور العشوائية",
        description:
          "أنشئ كلمات مرور وعبارات مرور ورموزًا مجمعة وأرقام PIN داخل المتصفح.",
      },
      de: {
        name: "Zufalls-Passwortgenerator",
        description:
          "Erzeuge Passwörter, Passphrasen, gruppierte Codes und PINs direkt im Browser.",
      },
      en: {
        name: "Random Password Generator",
        description:
          "Generate passwords, passphrases, grouped codes, and PINs in your browser.",
      },
      es: {
        name: "Generador de contraseñas aleatorias",
        description:
          "Genera contraseñas, frases de paso, códigos agrupados y PIN en tu navegador.",
      },
      fr: {
        name: "Générateur de mots de passe aléatoires",
        description:
          "Générez des mots de passe, phrases de passe, codes groupés et PIN dans votre navigateur.",
      },
      he: {
        name: "מחולל סיסמאות אקראיות",
        description:
          "צרו סיסמאות, ביטויי סיסמה, קודים מקובצים וקודי PIN בדפדפן.",
      },
      hi: {
        name: "रैंडम पासवर्ड जेनरेटर",
        description: "अपने ब्राउज़र में पासवर्ड, पासफ़्रेज़, समूहित कोड और PIN बनाएं।",
      },
      id: {
        name: "Generator Kata Sandi Acak",
        description:
          "Buat kata sandi, frasa sandi, kode berkelompok, dan PIN di browser.",
      },
      it: {
        name: "Generatore di password casuali",
        description:
          "Genera password, frasi segrete, codici a blocchi e PIN nel browser.",
      },
      ja: {
        name: "ランダムパスワード生成器",
        description:
          "ブラウザ内でパスワード、パスフレーズ、グループ化コード、PIN を生成します。",
      },
      ko: {
        name: "랜덤 비밀번호 생성기",
        description:
          "브라우저에서 비밀번호, 패스프레이즈, 그룹형 코드, PIN을 생성합니다.",
      },
      ms: {
        name: "Penjana Kata Laluan Rawak",
        description:
          "Jana kata laluan, frasa laluan, kod berkelompok dan PIN dalam pelayar anda.",
      },
      nl: {
        name: "Willekeurige wachtwoordgenerator",
        description:
          "Genereer wachtwoorden, wachtzinnen, gegroepeerde codes en pincodes in je browser.",
      },
      no: {
        name: "Generator for tilfeldige passord",
        description:
          "Generer passord, passfraser, grupperte koder og PIN-koder i nettleseren.",
      },
      pl: {
        name: "Generator losowych haseł",
        description:
          "Generuj hasła, frazy hasłowe, pogrupowane kody i PIN-y w przeglądarce.",
      },
      pt: {
        name: "Gerador de senhas aleatórias",
        description:
          "Gere senhas, frases-senha, códigos em blocos e PINs no navegador.",
      },
      ru: {
        name: "Генератор случайных паролей",
        description:
          "Генерируйте пароли, парольные фразы, коды по блокам и PIN прямо в браузере.",
      },
      sv: {
        name: "Generator för slumpmässiga lösenord",
        description:
          "Generera lösenord, lösenfraser, grupperade koder och PIN-koder i webbläsaren.",
      },
      th: {
        name: "เครื่องสร้างรหัสผ่านแบบสุ่ม",
        description: "สร้างรหัสผ่าน วลีรหัสผ่าน รหัสแบบแบ่งกลุ่ม และ PIN ได้ในเบราว์เซอร์",
      },
      tr: {
        name: "Rastgele Parola Oluşturucu",
        description:
          "Tarayıcınızda parolalar, parola ifadeleri, gruplanmış kodlar ve PIN'ler oluşturun.",
      },
      vi: {
        name: "Trình tạo mật khẩu ngẫu nhiên",
        description:
          "Tạo mật khẩu, cụm mật khẩu, mã theo nhóm và mã PIN ngay trong trình duyệt.",
      },
      "zh-CN": {
        name: "随机密码生成器",
        description: "在浏览器中生成随机密码、口令短语、分组代码和数字 PIN。",
      },
      "zh-TW": {
        name: "隨機密碼產生器",
        description: "在瀏覽器中產生隨機密碼、口令短語、分組代碼和數字 PIN。",
      },
    },
  },
  {
    slug: "regex-tester-replacer",
    category: "text",
    icon: "search",
    tags: ["regex", "text", "replace", "match", "pattern"],
    locales: {
      ar: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      de: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      en: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      es: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      fr: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      he: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      hi: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      id: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      it: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      ja: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      ko: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      ms: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      nl: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      no: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      pl: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      pt: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      ru: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      sv: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      th: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      tr: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      vi: {
        name: "Regex Tester & Replacer",
        description:
          "Test regular expressions, inspect matches, and preview replacements against real text.",
      },
      "zh-CN": {
        name: "正则测试与替换",
        description:
          "测试正则表达式、检查匹配结果，并直接预览替换后的文本输出。",
      },
      "zh-TW": {
        name: "正則測試與取代",
        description:
          "測試正則表達式、檢查匹配結果，並直接預覽取代後的文字輸出。",
      },
    },
  },
  {
    slug: "ripemd128-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "ripemd128",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة RIPEMD-128 للنص أو الملف",
        description:
          "إنشاء تجزئة RIPEMD-128 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "RIPEMD-128-Hash für Text oder Datei",
        description:
          "Generieren Sie RIPEMD-128-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "RIPEMD-128 Hash Text or File",
        description:
          "Generate RIPEMD-128 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash RIPEMD-128 de Texto o Archivo",
        description:
          "Genera hash RIPEMD-128 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash RIPEMD-128 de Texte ou Fichier",
        description:
          "Générez un hash RIPEMD-128 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש RIPEMD-128 טקסט או קובץ",
        description:
          "צור האש RIPEMD-128 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "RIPEMD-128 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए RIPEMD-128 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash RIPEMD-128 Teks atau File",
        description:
          "Buat hash RIPEMD-128 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash RIPEMD-128 di Testo o File",
        description:
          "Genera hash RIPEMD-128 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "RIPEMD-128 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのRIPEMD-128ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "RIPEMD-128 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 RIPEMD-128 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash RIPEMD-128 Teks atau Fail",
        description:
          "Jana hash RIPEMD-128 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "RIPEMD-128-hash tekst of bestand",
        description:
          "Genereer RIPEMD-128-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "RIPEMD-128-hash tekst eller fil",
        description:
          "Generer RIPEMD-128-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash RIPEMD-128 tekstu lub pliku",
        description:
          "Generuj hash RIPEMD-128 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash RIPEMD-128 de Texto ou Arquivo",
        description:
          "Gere hash RIPEMD-128 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "RIPEMD-128-хеш текста или файла",
        description:
          "Генерируйте RIPEMD-128-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "RIPEMD-128-hash text eller fil",
        description:
          "Generera RIPEMD-128-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช RIPEMD-128 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช RIPEMD-128 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "RIPEMD-128 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için RIPEMD-128 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash RIPEMD-128 văn bản hoặc tệp",
        description:
          "Tạo hash RIPEMD-128 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "RIPEMD-128 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 RIPEMD-128 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "RIPEMD-128 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 RIPEMD-128 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "ripemd160-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "ripemd160",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة RIPEMD-160 للنص أو الملف",
        description:
          "إنشاء تجزئة RIPEMD-160 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "RIPEMD-160-Hash für Text oder Datei",
        description:
          "Generieren Sie RIPEMD-160-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "RIPEMD-160 Hash Text or File",
        description:
          "Generate RIPEMD-160 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash RIPEMD-160 de Texto o Archivo",
        description:
          "Genera hash RIPEMD-160 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash RIPEMD-160 de Texte ou Fichier",
        description:
          "Générez un hash RIPEMD-160 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש RIPEMD-160 טקסט או קובץ",
        description:
          "צור האש RIPEMD-160 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "RIPEMD-160 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए RIPEMD-160 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash RIPEMD-160 Teks atau File",
        description:
          "Buat hash RIPEMD-160 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash RIPEMD-160 di Testo o File",
        description:
          "Genera hash RIPEMD-160 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "RIPEMD-160 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのRIPEMD-160ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "RIPEMD-160 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 RIPEMD-160 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash RIPEMD-160 Teks atau Fail",
        description:
          "Jana hash RIPEMD-160 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "RIPEMD-160-hash tekst of bestand",
        description:
          "Genereer RIPEMD-160-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "RIPEMD-160-hash tekst eller fil",
        description:
          "Generer RIPEMD-160-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash RIPEMD-160 tekstu lub pliku",
        description:
          "Generuj hash RIPEMD-160 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash RIPEMD-160 de Texto ou Arquivo",
        description:
          "Gere hash RIPEMD-160 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "RIPEMD-160-хеш текста или файла",
        description:
          "Генерируйте RIPEMD-160-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "RIPEMD-160-hash text eller fil",
        description:
          "Generera RIPEMD-160-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช RIPEMD-160 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช RIPEMD-160 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "RIPEMD-160 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için RIPEMD-160 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash RIPEMD-160 văn bản hoặc tệp",
        description:
          "Tạo hash RIPEMD-160 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "RIPEMD-160 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 RIPEMD-160 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "RIPEMD-160 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 RIPEMD-160 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "ripemd256-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "ripemd256",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة RIPEMD-256 للنص أو الملف",
        description:
          "إنشاء تجزئة RIPEMD-256 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "RIPEMD-256-Hash für Text oder Datei",
        description:
          "Generieren Sie RIPEMD-256-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "RIPEMD-256 Hash Text or File",
        description:
          "Generate RIPEMD-256 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash RIPEMD-256 de Texto o Archivo",
        description:
          "Genera hash RIPEMD-256 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash RIPEMD-256 de Texte ou Fichier",
        description:
          "Générez un hash RIPEMD-256 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש RIPEMD-256 טקסט או קובץ",
        description:
          "צור האש RIPEMD-256 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "RIPEMD-256 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए RIPEMD-256 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash RIPEMD-256 Teks atau File",
        description:
          "Buat hash RIPEMD-256 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash RIPEMD-256 di Testo o File",
        description:
          "Genera hash RIPEMD-256 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "RIPEMD-256 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのRIPEMD-256ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "RIPEMD-256 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 RIPEMD-256 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash RIPEMD-256 Teks atau Fail",
        description:
          "Jana hash RIPEMD-256 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "RIPEMD-256-hash tekst of bestand",
        description:
          "Genereer RIPEMD-256-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "RIPEMD-256-hash tekst eller fil",
        description:
          "Generer RIPEMD-256-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash RIPEMD-256 tekstu lub pliku",
        description:
          "Generuj hash RIPEMD-256 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash RIPEMD-256 de Texto ou Arquivo",
        description:
          "Gere hash RIPEMD-256 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "RIPEMD-256-хеш текста или файла",
        description:
          "Генерируйте RIPEMD-256-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "RIPEMD-256-hash text eller fil",
        description:
          "Generera RIPEMD-256-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช RIPEMD-256 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช RIPEMD-256 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "RIPEMD-256 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için RIPEMD-256 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash RIPEMD-256 văn bản hoặc tệp",
        description:
          "Tạo hash RIPEMD-256 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "RIPEMD-256 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 RIPEMD-256 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "RIPEMD-256 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 RIPEMD-256 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "robots-txt-generator",
    category: "web",
    icon: "globe",
    tags: [
      "robots",
      "robots-txt",
      "seo",
      "crawler",
      "sitemap",
      "generator",
      "web",
    ],
    locales: {
      ar: {
        name: "مولد robots.txt",
        description:
          "أنشئ ملفات robots.txt مع قواعد user-agent ومسارات السماح/المنع وروابط sitemap.",
      },
      de: {
        name: "robots.txt-Generator",
        description:
          "Erstellen Sie robots.txt-Dateien mit User-Agent-Regeln, Allow/Disallow-Pfaden und Sitemap-Links.",
      },
      en: {
        name: "robots.txt Generator",
        description:
          "Generate robots.txt files with user-agent rules, allow/disallow paths, and sitemap links.",
      },
      es: {
        name: "Generador de robots.txt",
        description:
          "Genera archivos robots.txt con reglas de user-agent, rutas allow/disallow y enlaces de sitemap.",
      },
      fr: {
        name: "Générateur robots.txt",
        description:
          "Générez des fichiers robots.txt avec des règles user-agent, des chemins allow/disallow et des liens de sitemap.",
      },
      he: {
        name: "מחולל robots.txt",
        description:
          "צור קובצי robots.txt עם כללי User-agent, נתיבי Allow/Disallow וקישורי Sitemap.",
      },
      hi: {
        name: "robots.txt जनरेटर",
        description:
          "User-agent नियमों, Allow/Disallow पाथ और Sitemap लिंक के साथ robots.txt फ़ाइलें बनाएं।",
      },
      id: {
        name: "Generator robots.txt",
        description:
          "Buat file robots.txt dengan aturan user-agent, jalur allow/disallow, dan tautan sitemap.",
      },
      it: {
        name: "Generatore robots.txt",
        description:
          "Genera file robots.txt con regole user-agent, percorsi allow/disallow e link alla sitemap.",
      },
      ja: {
        name: "robots.txt ジェネレーター",
        description:
          "User-agent ルール、Allow/Disallow のパス、Sitemap リンクを含む robots.txt を生成します。",
      },
      ko: {
        name: "robots.txt 생성기",
        description:
          "User-agent 규칙, Allow/Disallow 경로, Sitemap 링크가 포함된 robots.txt를 생성합니다.",
      },
      ms: {
        name: "Penjana robots.txt",
        description:
          "Jana fail robots.txt dengan peraturan user-agent, laluan allow/disallow, dan pautan sitemap.",
      },
      nl: {
        name: "robots.txt Generator",
        description:
          "Genereer robots.txt-bestanden met user-agentregels, allow/disallow-paden en sitemap-links.",
      },
      no: {
        name: "robots.txt-generator",
        description:
          "Generer robots.txt-filer med user-agent-regler, allow/disallow-stier og sitemap-lenker.",
      },
      pl: {
        name: "Generator robots.txt",
        description:
          "Generuj pliki robots.txt z regułami User-agent, ścieżkami Allow/Disallow i linkami do sitemap.",
      },
      pt: {
        name: "Gerador de robots.txt",
        description:
          "Gere arquivos robots.txt com regras de user-agent, caminhos allow/disallow e links de sitemap.",
      },
      ru: {
        name: "Генератор robots.txt",
        description:
          "Создавайте файлы robots.txt с правилами User-agent, путями Allow/Disallow и ссылками Sitemap.",
      },
      sv: {
        name: "robots.txt-generator",
        description:
          "Generera robots.txt-filer med user-agent-regler, allow/disallow-sökvägar och sitemap-länkar.",
      },
      th: {
        name: "ตัวสร้าง robots.txt",
        description:
          "สร้างไฟล์ robots.txt พร้อมกฎ user-agent เส้นทาง allow/disallow และลิงก์ sitemap",
      },
      tr: {
        name: "robots.txt Oluşturucu",
        description:
          "User-agent kuralları, Allow/Disallow yolları ve Sitemap bağlantılarıyla robots.txt dosyaları oluşturun.",
      },
      vi: {
        name: "Trình tạo robots.txt",
        description:
          "Tạo tệp robots.txt với quy tắc user-agent, đường dẫn allow/disallow và liên kết sitemap.",
      },
      "zh-CN": {
        name: "robots.txt 生成器",
        description:
          "生成 robots.txt 文件，包含 User-agent 规则、Allow/Disallow 路径和 Sitemap 链接。",
      },
      "zh-TW": {
        name: "robots.txt 產生器",
        description:
          "產生 robots.txt 檔案，包含 User-agent 規則、Allow/Disallow 路徑與 Sitemap 連結。",
      },
    },
  },
  {
    slug: "roman-numeral-converter",
    category: "misc",
    icon: "binary",
    tags: [
      "roman numeral",
      "arabic number",
      "number converter",
      "history",
      "education",
    ],
    locales: {
      ar: {
        name: "محول الأرقام العربية ↔ الرومانية",
        description:
          "محول ثنائي الاتجاه بين الأرقام الرومانية والعربية. يدعم الأرقام الرومانية القياسية من 1 إلى 3999 (I إلى MMMCMXCIX).",
      },
      de: {
        name: "Arabisch ↔ Römisch Konverter",
        description:
          "Bidirektionaler Konverter zwischen römischen und arabischen Zahlen. Unterstützt Standard-Römerzahlen von 1 bis 3999 (I bis MMMCMXCIX).",
      },
      en: {
        name: "Roman Numeral ↔ Arabic Number Converter",
        description:
          "Bidirectional converter between Roman numerals and Arabic numbers. Supports standard Roman numerals from 1 to 3999 (I to MMMCMXCIX).",
      },
      es: {
        name: "Conversor Arábigo ↔ Romano",
        description:
          "Conversor bidireccional entre números romanos y arábigos. Soporta números romanos estándar del 1 al 3999 (I a MMMCMXCIX).",
      },
      fr: {
        name: "Convertisseur Arabe ↔ Romain",
        description:
          "Convertisseur bidirectionnel entre les chiffres romains et arabes. Prend en charge les chiffres romains standard de 1 à 3999 (I à MMMCMXCIX).",
      },
      he: {
        name: "ממיר ערבי ↔ רומי",
        description:
          "ממיר דו-כיווני בין ספרות רומיות וערביות. תומך בספרות רומיות סטנדרטיות מ-1 עד 3999 (I עד MMMCMXCIX).",
      },
      hi: {
        name: "अरबी ↔ रोमन अंक कनवर्टर",
        description:
          "रोमन अंकों और अरबी संख्याओं के बीच द्विदिशीय कनवर्टर। मानक रोमन अंक 1 से 3999 (I से MMMCMXCIX) का समर्थन करता है।",
      },
      id: {
        name: "Konverter Arab ↔ Romawi",
        description:
          "Konverter dua arah antara angka Romawi dan Arab. Mendukung angka Romawi standar dari 1 hingga 3999 (I hingga MMMCMXCIX).",
      },
      it: {
        name: "Convertitore Arabo ↔ Romano",
        description:
          "Convertitore bidirezionale tra numeri romani e arabi. Supporta numeri romani standard da 1 a 3999 (I a MMMCMXCIX).",
      },
      ja: {
        name: "ローマ数字 ↔ アラビア数字コンバーター",
        description:
          "ローマ数字とアラビア数字の双方向変換。標準的なローマ数字 1 から 3999（I から MMMCMXCIX）をサポート。",
      },
      ko: {
        name: "아라비아 ↔ 로마 숫자 변환기",
        description:
          "로마 숫자와 아라비아 숫자 간 양방향 변환. 표준 로마 숫자 1~3999 (I~MMMCMXCIX) 지원.",
      },
      ms: {
        name: "Penukar Arab ↔ Rom",
        description:
          "Penukar dua hala antara nombor Rom dan Arab. Menyokong nombor Rom standard dari 1 hingga 3999 (I hingga MMMCMXCIX).",
      },
      nl: {
        name: "Arabisch ↔ Romeins Converter",
        description:
          "Bidirectionele converter tussen Romeinse en Arabische cijfers. Ondersteunt standaard Romeinse cijfers van 1 tot 3999 (I tot MMMCMXCIX).",
      },
      no: {
        name: "Arabisk ↔ Romersk Konverterer",
        description:
          "Toveis konverterer mellom romerske og arabiske tall. Støtter standard romerske tall fra 1 til 3999 (I til MMMCMXCIX).",
      },
      pl: {
        name: "Konwerter Arabskie ↔ Rzymskie",
        description:
          "Dwukierunkowy konwerter między cyframi rzymskimi i arabskimi. Obsługuje standardowe cyfry rzymskie od 1 do 3999 (I do MMMCMXCIX).",
      },
      pt: {
        name: "Conversor Arábico ↔ Romano",
        description:
          "Conversor bidirecional entre números romanos e arábicos. Suporta números romanos padrão de 1 a 3999 (I a MMMCMXCIX).",
      },
      ru: {
        name: "Конвертер Арабские ↔ Римские цифры",
        description:
          "Двунаправленный преобразователь римских и арабских цифр. Поддерживает стандартные римские цифры от 1 до 3999 (I до MMMCMXCIX).",
      },
      sv: {
        name: "Arabiska ↔ Romerska Konverterare",
        description:
          "Bidirektionell konverterare mellan romerska och arabiska siffror. Stöder standard romerska siffror från 1 till 3999 (I till MMMCMXCIX).",
      },
      th: {
        name: "ตัวแปลงอารบิก ↔ โรมัน",
        description:
          "ตัวแปลงแบบสองทิศทางระหว่างตัวเลขโรมันและตัวเลขอารบิก รองรับตัวเลขโรมันมาตรฐาน 1 ถึง 3999 (I ถึง MMMCMXCIX)",
      },
      tr: {
        name: "Arap ↔ Roma Rakamları Dönüştürücü",
        description:
          "Roma rakamları ve Arap rakamları arasında çift yönlü dönüştürücü. Standart Roma rakamlarını 1-3999 (I-MMMCMXCIX) destekler.",
      },
      vi: {
        name: "Trình Chuyển Đổi Ả Rập ↔ La Mã",
        description:
          "Trình chuyển đổi hai chiều giữa số La Mã và số Ả Rập. Hỗ trợ số La Mã tiêu chuẩn từ 1 đến 3999 (I đến MMMCMXCIX).",
      },
      "zh-CN": {
        name: "罗马数字 ↔ 阿拉伯数字转换器",
        description:
          "罗马数字与阿拉伯数字双向转换。支持标准罗马数字 1 到 3999（I 到 MMMCMXCIX）。",
      },
      "zh-TW": {
        name: "羅馬數字 ↔ 阿拉伯數字轉換器",
        description:
          "羅馬數字與阿拉伯數字雙向轉換。支援標準羅馬數字 1 到 3999（I 到 MMMCMXCIX）。",
      },
    },
  },
  {
    slug: "rot-cipher",
    category: "web",
    icon: "lock",
    tags: ["cipher", "rot13", "rot47", "encryption", "decryption", "text"],
    locales: {
      ar: {
        name: "تشفير ROT تشفير وفك التشفير",
        description:
          "تشفير وفك تشفير النص باستخدام خوارزميات ROT13 و ROT5 و ROT18 و ROT47. تشفير ذاتي الانعكاس للحروف والأرقام وأحرف ASCII",
      },
      de: {
        name: "ROT-Chiffre Ver- & Entschlüsselung",
        description:
          "Ver- und entschlüsseln Sie Text mit ROT13, ROT5, ROT18 und ROT47 Chiffrier-Algorithmen. Selbstumkehrende Verschlüsselung für Buchstaben, Ziffern und ASCII-Zeichen",
      },
      en: {
        name: "ROT Cipher Encrypt & Decrypt",
        description:
          "Encrypt and decrypt text using ROT13, ROT5, ROT18, and ROT47 cipher algorithms. Self-reversing encryption for letters, digits, and ASCII characters",
      },
      es: {
        name: "Cifrado ROT Encriptar & Desencriptar",
        description:
          "Encripta y desencripta texto usando los algoritmos de cifrado ROT13, ROT5, ROT18 y ROT47. Encriptación autorreversible para letras, dígitos y caracteres ASCII",
      },
      fr: {
        name: "Chiffrement ROT Crypter & Décrypter",
        description:
          "Chiffrez et déchiffrez du texte avec les algorithmes ROT13, ROT5, ROT18 et ROT47. Chiffrement auto-réversible pour les lettres, chiffres et caractères ASCII",
      },
      he: {
        name: "צופן ROT הצפנה ופענוח",
        description:
          "הצפן ופענח טקסט באמצעות אלגוריתמי צופן ROT13, ROT5, ROT18 ו-ROT47. הצפנה הפיכה עצמית לאותיות, ספרות ותווי ASCII",
      },
      hi: {
        name: "ROT सिफर एन्क्रिप्ट और डिक्रिप्ट",
        description:
          "ROT13, ROT5, ROT18 और ROT47 सिफर एल्गोरिदम का उपयोग करके टेक्स्ट को एन्क्रिप्ट और डिक्रिप्ट करें। अक्षरों, अंकों और ASCII वर्णों के लिए स्व-प्रतिवर्ती एन्क्रिप्शन",
      },
      id: {
        name: "Sandi ROT Enkripsi & Dekripsi",
        description:
          "Enkripsi dan dekripsi teks menggunakan algoritma sandi ROT13, ROT5, ROT18, dan ROT47. Enkripsi yang dapat membalik diri sendiri untuk huruf, angka, dan karakter ASCII",
      },
      it: {
        name: "Cifratura ROT Cripta & Decripta",
        description:
          "Cripta e decripta il testo usando gli algoritmi di cifratura ROT13, ROT5, ROT18 e ROT47. Crittografia auto-reversibile per lettere, cifre e caratteri ASCII",
      },
      ja: {
        name: "ROT 暗号 暗号化 & 復号化",
        description:
          "ROT13、ROT5、ROT18、ROT47 暗号アルゴリズムでテキストを暗号化・復号化。文字、数字、ASCII 文字の自己可逆暗号化",
      },
      ko: {
        name: "ROT 암호 암호화 & 복호화",
        description:
          "ROT13, ROT5, ROT18, ROT47 암호 알고리즘으로 텍스트 암호화 및 복호화. 문자, 숫자, ASCII 문자를 위한 자기 가역 암호화",
      },
      ms: {
        name: "Sifer ROT Sulitkan & Nyahsulit",
        description:
          "Sulitkan dan nyahsulit teks menggunakan algoritma sifer ROT13, ROT5, ROT18 dan ROT47. Penyulitan boleh balik kendiri untuk huruf, digit dan aksara ASCII",
      },
      nl: {
        name: "ROT-cijfer Versleutelen & Ontsleutelen",
        description:
          "Versleutel en ontsleutel tekst met ROT13, ROT5, ROT18 en ROT47 versleutelingsalgoritmen. Zelf-omkeerbare versleuteling voor letters, cijfers en ASCII-tekens",
      },
      no: {
        name: "ROT-siffer Krypter & Dekrypter",
        description:
          "Krypter og dekrypter tekst med ROT13, ROT5, ROT18 og ROT47 sifferalgoritmer. Selvreverserende kryptering for bokstaver, siffer og ASCII-tegn",
      },
      pl: {
        name: "Szyfr ROT Szyfrowanie i Deszyfrowanie",
        description:
          "Szyfruj i deszyfruj tekst za pomocą algorytmów ROT13, ROT5, ROT18 i ROT47. Samoodwracalne szyfrowanie dla liter, cyfr i znaków ASCII",
      },
      pt: {
        name: "Cifra ROT Encriptar & Desencriptar",
        description:
          "Encripte e desencripte texto usando os algoritmos de cifra ROT13, ROT5, ROT18 e ROT47. Encriptação auto-reversível para letras, dígitos e caracteres ASCII",
      },
      ru: {
        name: "ROT-шифр Шифрование & Дешифрование",
        description:
          "Шифруйте и дешифруйте текст с помощью алгоритмов ROT13, ROT5, ROT18 и ROT47. Самообратимое шифрование для букв, цифр и символов ASCII",
      },
      sv: {
        name: "ROT-chiffer Kryptera & Dekryptera",
        description:
          "Kryptera och dekryptera text med ROT13, ROT5, ROT18 och ROT47 chifferalgoritmer. Självomvändbar kryptering för bokstäver, siffror och ASCII-tecken",
      },
      th: {
        name: "รหัส ROT เข้ารหัส & ถอดรหัส",
        description:
          "เข้ารหัสและถอดรหัสข้อความด้วยอัลกอริทึม ROT13, ROT5, ROT18 และ ROT47 การเข้ารหัสแบบย้อนกลับได้สำหรับตัวอักษร ตัวเลข และอักขระ ASCII",
      },
      tr: {
        name: "ROT Şifre Şifreleme & Şifre Çözme",
        description:
          "ROT13, ROT5, ROT18 ve ROT47 şifre algoritmaları kullanarak metni şifreleyin ve şifresini çözün. Harfler, rakamlar ve ASCII karakterler için kendinden tersine çevrilebilir şifreleme",
      },
      vi: {
        name: "Mã hóa ROT Mã hóa & Giải mã",
        description:
          "Mã hóa và giải mã văn bản bằng các thuật toán mã hóa ROT13, ROT5, ROT18 và ROT47. Mã hóa tự đảo ngược cho chữ cái, chữ số và ký tự ASCII",
      },
      "zh-CN": {
        name: "ROT 密码加密 & 解密",
        description:
          "使用 ROT13、ROT5、ROT18 和 ROT47 密码算法加密和解密文本。支持字母、数字和 ASCII 字符的自反加密",
      },
      "zh-TW": {
        name: "ROT 密碼加密 & 解密",
        description:
          "使用 ROT13、ROT5、ROT18 和 ROT47 密碼演算法加密和解密文字。支援字母、數字和 ASCII 字元的自反加密",
      },
    },
  },
  {
    slug: "sha1-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "sha1", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة SHA-1 للنص أو الملف",
        description:
          "أنشئ تجزئات SHA-1 لإدخال النص أو تحميل الملفات. الأنسب للتوافق مع الأنظمة القديمة وفحوصات سلامة البيانات غير الحرجة أمنياً",
      },
      de: {
        name: "SHA-1-Hash für Text oder Datei",
        description:
          "Erstellen Sie SHA-1-Hashes für Texteingaben oder Datei-Uploads. Am besten geeignet für Legacy-Kompatibilität und nicht sicherheitskritische Integritätsprüfungen",
      },
      en: {
        name: "SHA-1 Hash Text or File",
        description:
          "Generate SHA-1 hashes for text input or file upload. Best for legacy compatibility and non-security-critical integrity checks.",
      },
      es: {
        name: "Hash SHA-1 de Texto o Archivo",
        description:
          "Genera hashes SHA-1 para texto o archivos. Más adecuado para compatibilidad heredada y comprobaciones de integridad no críticas para la seguridad.",
      },
      fr: {
        name: "Hash SHA-1 de Texte ou Fichier",
        description:
          "Générez des hachages SHA-1 pour du texte ou des fichiers. Convient surtout à la compatibilité avec les systèmes hérités et aux vérifications d’intégrité non critiques pour la sécurité.",
      },
      he: {
        name: "האש SHA-1 טקסט או קובץ",
        description:
          "צור ערכי SHA-1 עבור קלט טקסט או העלאת קבצים. מתאים בעיקר לתאימות למערכות ישנות ולבדיקות תקינות שאינן קריטיות לאבטחה.",
      },
      hi: {
        name: "SHA-1 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA-1 हैश बनाएं। यह पुराने सिस्टम के साथ संगतता और गैर-सुरक्षा-महत्वपूर्ण अखंडता जांच के लिए सबसे उपयुक्त है।",
      },
      id: {
        name: "Hash SHA-1 Teks atau File",
        description:
          "Buat hash SHA-1 untuk input teks atau unggahan file. Paling cocok untuk kompatibilitas sistem lama dan pemeriksaan integritas yang tidak kritis terhadap keamanan.",
      },
      it: {
        name: "Hash SHA-1 di Testo o File",
        description:
          "Genera hash SHA-1 per testo o file. Ideale soprattutto per compatibilità con sistemi legacy e controlli di integrità non critici per la sicurezza.",
      },
      ja: {
        name: "SHA-1 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力やファイルアップロード向けに SHA-1 ハッシュを生成します。主にレガシー互換性や、セキュリティ上重要ではない整合性確認に適しています。",
      },
      ko: {
        name: "SHA-1 해시 텍스트 또는 파일",
        description:
          "텍스트 입력이나 파일 업로드용 SHA-1 해시를 생성합니다. 레거시 호환성과 보안상 중요하지 않은 무결성 검사에 가장 적합합니다.",
      },
      ms: {
        name: "Hash SHA-1 Teks atau Fail",
        description:
          "Jana hash SHA-1 untuk input teks atau muat naik fail. Paling sesuai untuk keserasian sistem lama dan semakan integriti yang tidak kritikal terhadap keselamatan.",
      },
      nl: {
        name: "SHA-1-hash tekst of bestand",
        description:
          "Genereer SHA-1-hashes voor tekstinvoer of bestandsuploads. Vooral geschikt voor legacy-compatibiliteit en integriteitscontroles die niet beveiligingskritisch zijn.",
      },
      no: {
        name: "SHA-1-hash tekst eller fil",
        description:
          "Generer SHA-1-hasher for tekstinndata eller filopplasting. Best egnet for kompatibilitet med eldre systemer og integritetskontroller som ikke er sikkerhetskritiske.",
      },
      pl: {
        name: "Hash SHA-1 tekstu lub pliku",
        description:
          "Generuj hashe SHA-1 dla tekstu lub plików. Najlepiej nadaje się do zgodności ze starszymi systemami i kontroli integralności, które nie są krytyczne dla bezpieczeństwa.",
      },
      pt: {
        name: "Hash SHA-1 de Texto ou Arquivo",
        description:
          "Gere hashes SHA-1 para texto ou arquivos. Mais adequado para compatibilidade legada e verificações de integridade que não são críticas para a segurança.",
      },
      ru: {
        name: "SHA-1-хеш текста или файла",
        description:
          "Создавайте SHA-1-хеши для текста или файлов. Лучше всего подходит для совместимости с устаревшими системами и проверок целостности, не критичных для безопасности.",
      },
      sv: {
        name: "SHA-1-hash text eller fil",
        description:
          "Generera SHA-1-hashar för textinmatning eller filuppladdning. Passar bäst för kompatibilitet med äldre system och integritetskontroller som inte är säkerhetskritiska.",
      },
      th: {
        name: "แฮช SHA-1 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA-1 สำหรับข้อความหรือการอัปโหลดไฟล์ เหมาะที่สุดสำหรับความเข้ากันได้กับระบบเดิมและการตรวจสอบความสมบูรณ์ที่ไม่สำคัญต่อความปลอดภัย",
      },
      tr: {
        name: "SHA-1 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA-1 hash'leri oluşturun. En çok eski sistem uyumluluğu ve güvenlik açısından kritik olmayan bütünlük kontrolleri için uygundur.",
      },
      vi: {
        name: "Hash SHA-1 văn bản hoặc tệp",
        description:
          "Tạo hash SHA-1 cho văn bản hoặc tệp tải lên. Phù hợp nhất cho khả năng tương thích với hệ thống cũ và các kiểm tra toàn vẹn không quan trọng về bảo mật.",
      },
      "zh-CN": {
        name: "SHA-1 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA-1 哈希值。更适合遗留系统兼容和非安全关键的完整性校验。",
      },
      "zh-TW": {
        name: "SHA-1 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA-1 雜湊值。更適合遺留系統相容與非安全關鍵的完整性檢查。",
      },
    },
  },
  {
    slug: "sha224-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "sha224", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة SHA-224 للنص أو الملف",
        description:
          "إنشاء تجزئة SHA-224 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA-224-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA-224-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA-224 Hash Text or File",
        description:
          "Generate SHA-224 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA-224 de Texto o Archivo",
        description:
          "Genera hash SHA-224 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA-224 de Texte ou Fichier",
        description:
          "Générez un hash SHA-224 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA-224 טקסט או קובץ",
        description:
          "צור האש SHA-224 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA-224 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA-224 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA-224 Teks atau File",
        description:
          "Buat hash SHA-224 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA-224 di Testo o File",
        description:
          "Genera hash SHA-224 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA-224 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA-224ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA-224 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA-224 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA-224 Teks atau Fail",
        description:
          "Jana hash SHA-224 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA-224-hash tekst of bestand",
        description:
          "Genereer SHA-224-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA-224-hash tekst eller fil",
        description:
          "Generer SHA-224-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA-224 tekstu lub pliku",
        description:
          "Generuj hash SHA-224 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA-224 de Texto ou Arquivo",
        description:
          "Gere hash SHA-224 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA-224-хеш текста или файла",
        description:
          "Генерируйте SHA-224-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA-224-hash text eller fil",
        description:
          "Generera SHA-224-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA-224 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA-224 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA-224 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA-224 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA-224 văn bản hoặc tệp",
        description:
          "Tạo hash SHA-224 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA-224 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA-224 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA-224 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA-224 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha256-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "sha256", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة SHA-256 للنص أو الملف",
        description:
          "إنشاء تجزئة SHA-256 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA-256-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA-256-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA-256 Hash Text or File",
        description:
          "Generate SHA-256 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA-256 de Texto o Archivo",
        description:
          "Genera hash SHA-256 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA-256 de Texte ou Fichier",
        description:
          "Générez un hash SHA-256 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA-256 טקסט או קובץ",
        description:
          "צור האש SHA-256 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA-256 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA-256 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA-256 Teks atau File",
        description:
          "Buat hash SHA-256 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA-256 di Testo o File",
        description:
          "Genera hash SHA-256 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA-256 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA-256ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA-256 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA-256 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA-256 Teks atau Fail",
        description:
          "Jana hash SHA-256 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA-256-hash tekst of bestand",
        description:
          "Genereer SHA-256-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA-256-hash tekst eller fil",
        description:
          "Generer SHA-256-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA-256 tekstu lub pliku",
        description:
          "Generuj hash SHA-256 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA-256 de Texto ou Arquivo",
        description:
          "Gere hash SHA-256 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA-256-хеш текста или файла",
        description:
          "Генерируйте SHA-256-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA-256-hash text eller fil",
        description:
          "Generera SHA-256-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA-256 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA-256 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA-256 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA-256 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA-256 văn bản hoặc tệp",
        description:
          "Tạo hash SHA-256 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA-256 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA-256 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA-256 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA-256 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha3-224-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "sha3",
      "sha3-224",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة SHA3-224 (FIPS 202) للنص أو الملف",
        description:
          "إنشاء تجزئة SHA3-224 (FIPS 202) لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA3-224 (FIPS 202)-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA3-224 (FIPS 202)-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA3-224 (FIPS 202) Hash Text or File",
        description:
          "Generate SHA3-224 (FIPS 202) hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA3-224 (FIPS 202) de Texto o Archivo",
        description:
          "Genera hash SHA3-224 (FIPS 202) para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA3-224 (FIPS 202) de Texte ou Fichier",
        description:
          "Générez un hash SHA3-224 (FIPS 202) pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA3-224 (FIPS 202) טקסט או קובץ",
        description:
          "צור האש SHA3-224 (FIPS 202) עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA3-224 (FIPS 202) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA3-224 (FIPS 202) हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA3-224 (FIPS 202) Teks atau File",
        description:
          "Buat hash SHA3-224 (FIPS 202) untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA3-224 (FIPS 202) di Testo o File",
        description:
          "Genera hash SHA3-224 (FIPS 202) per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA3-224 (FIPS 202) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA3-224 (FIPS 202)ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA3-224 (FIPS 202) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA3-224 (FIPS 202) 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA3-224 (FIPS 202) Teks atau Fail",
        description:
          "Jana hash SHA3-224 (FIPS 202) untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA3-224 (FIPS 202)-hash tekst of bestand",
        description:
          "Genereer SHA3-224 (FIPS 202)-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA3-224 (FIPS 202)-hash tekst eller fil",
        description:
          "Generer SHA3-224 (FIPS 202)-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA3-224 (FIPS 202) tekstu lub pliku",
        description:
          "Generuj hash SHA3-224 (FIPS 202) dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA3-224 (FIPS 202) de Texto ou Arquivo",
        description:
          "Gere hash SHA3-224 (FIPS 202) para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA3-224 (FIPS 202)-хеш текста или файла",
        description:
          "Генерируйте SHA3-224 (FIPS 202)-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA3-224 (FIPS 202)-hash text eller fil",
        description:
          "Generera SHA3-224 (FIPS 202)-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA3-224 (FIPS 202) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA3-224 (FIPS 202) สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA3-224 (FIPS 202) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA3-224 (FIPS 202) hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA3-224 (FIPS 202) văn bản hoặc tệp",
        description:
          "Tạo hash SHA3-224 (FIPS 202) cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA3-224 (FIPS 202) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA3-224 (FIPS 202) 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA3-224 (FIPS 202) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA3-224 (FIPS 202) 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha3-256-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "sha3",
      "sha3-256",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة SHA3-256 (FIPS 202) للنص أو الملف",
        description:
          "إنشاء تجزئة SHA3-256 (FIPS 202) لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA3-256 (FIPS 202)-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA3-256 (FIPS 202)-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA3-256 (FIPS 202) Hash Text or File",
        description:
          "Generate SHA3-256 (FIPS 202) hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA3-256 (FIPS 202) de Texto o Archivo",
        description:
          "Genera hash SHA3-256 (FIPS 202) para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA3-256 (FIPS 202) de Texte ou Fichier",
        description:
          "Générez un hash SHA3-256 (FIPS 202) pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA3-256 (FIPS 202) טקסט או קובץ",
        description:
          "צור האש SHA3-256 (FIPS 202) עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA3-256 (FIPS 202) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA3-256 (FIPS 202) हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA3-256 (FIPS 202) Teks atau File",
        description:
          "Buat hash SHA3-256 (FIPS 202) untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA3-256 (FIPS 202) di Testo o File",
        description:
          "Genera hash SHA3-256 (FIPS 202) per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA3-256 (FIPS 202) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA3-256 (FIPS 202)ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA3-256 (FIPS 202) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA3-256 (FIPS 202) 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA3-256 (FIPS 202) Teks atau Fail",
        description:
          "Jana hash SHA3-256 (FIPS 202) untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA3-256 (FIPS 202)-hash tekst of bestand",
        description:
          "Genereer SHA3-256 (FIPS 202)-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA3-256 (FIPS 202)-hash tekst eller fil",
        description:
          "Generer SHA3-256 (FIPS 202)-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA3-256 (FIPS 202) tekstu lub pliku",
        description:
          "Generuj hash SHA3-256 (FIPS 202) dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA3-256 (FIPS 202) de Texto ou Arquivo",
        description:
          "Gere hash SHA3-256 (FIPS 202) para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA3-256 (FIPS 202)-хеш текста или файла",
        description:
          "Генерируйте SHA3-256 (FIPS 202)-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA3-256 (FIPS 202)-hash text eller fil",
        description:
          "Generera SHA3-256 (FIPS 202)-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA3-256 (FIPS 202) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA3-256 (FIPS 202) สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA3-256 (FIPS 202) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA3-256 (FIPS 202) hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA3-256 (FIPS 202) văn bản hoặc tệp",
        description:
          "Tạo hash SHA3-256 (FIPS 202) cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA3-256 (FIPS 202) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA3-256 (FIPS 202) 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA3-256 (FIPS 202) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA3-256 (FIPS 202) 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha3-384-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "sha3",
      "sha3-384",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة SHA3-384 (FIPS 202) للنص أو الملف",
        description:
          "إنشاء تجزئة SHA3-384 (FIPS 202) لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA3-384 (FIPS 202)-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA3-384 (FIPS 202)-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA3-384 (FIPS 202) Hash Text or File",
        description:
          "Generate SHA3-384 (FIPS 202) hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA3-384 (FIPS 202) de Texto o Archivo",
        description:
          "Genera hash SHA3-384 (FIPS 202) para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA3-384 (FIPS 202) de Texte ou Fichier",
        description:
          "Générez un hash SHA3-384 (FIPS 202) pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA3-384 (FIPS 202) טקסט או קובץ",
        description:
          "צור האש SHA3-384 (FIPS 202) עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA3-384 (FIPS 202) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA3-384 (FIPS 202) हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA3-384 (FIPS 202) Teks atau File",
        description:
          "Buat hash SHA3-384 (FIPS 202) untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA3-384 (FIPS 202) di Testo o File",
        description:
          "Genera hash SHA3-384 (FIPS 202) per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA3-384 (FIPS 202) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA3-384 (FIPS 202)ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA3-384 (FIPS 202) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA3-384 (FIPS 202) 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA3-384 (FIPS 202) Teks atau Fail",
        description:
          "Jana hash SHA3-384 (FIPS 202) untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA3-384 (FIPS 202)-hash tekst of bestand",
        description:
          "Genereer SHA3-384 (FIPS 202)-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA3-384 (FIPS 202)-hash tekst eller fil",
        description:
          "Generer SHA3-384 (FIPS 202)-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA3-384 (FIPS 202) tekstu lub pliku",
        description:
          "Generuj hash SHA3-384 (FIPS 202) dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA3-384 (FIPS 202) de Texto ou Arquivo",
        description:
          "Gere hash SHA3-384 (FIPS 202) para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA3-384 (FIPS 202)-хеш текста или файла",
        description:
          "Генерируйте SHA3-384 (FIPS 202)-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA3-384 (FIPS 202)-hash text eller fil",
        description:
          "Generera SHA3-384 (FIPS 202)-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA3-384 (FIPS 202) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA3-384 (FIPS 202) สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA3-384 (FIPS 202) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA3-384 (FIPS 202) hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA3-384 (FIPS 202) văn bản hoặc tệp",
        description:
          "Tạo hash SHA3-384 (FIPS 202) cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA3-384 (FIPS 202) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA3-384 (FIPS 202) 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA3-384 (FIPS 202) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA3-384 (FIPS 202) 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha3-512-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "sha3",
      "sha3-512",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة SHA3-512 (FIPS 202) للنص أو الملف",
        description:
          "إنشاء تجزئة SHA3-512 (FIPS 202) لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA3-512 (FIPS 202)-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA3-512 (FIPS 202)-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA3-512 (FIPS 202) Hash Text or File",
        description:
          "Generate SHA3-512 (FIPS 202) hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA3-512 (FIPS 202) de Texto o Archivo",
        description:
          "Genera hash SHA3-512 (FIPS 202) para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA3-512 (FIPS 202) de Texte ou Fichier",
        description:
          "Générez un hash SHA3-512 (FIPS 202) pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA3-512 (FIPS 202) טקסט או קובץ",
        description:
          "צור האש SHA3-512 (FIPS 202) עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA3-512 (FIPS 202) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA3-512 (FIPS 202) हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA3-512 (FIPS 202) Teks atau File",
        description:
          "Buat hash SHA3-512 (FIPS 202) untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA3-512 (FIPS 202) di Testo o File",
        description:
          "Genera hash SHA3-512 (FIPS 202) per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA3-512 (FIPS 202) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA3-512 (FIPS 202)ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA3-512 (FIPS 202) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA3-512 (FIPS 202) 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA3-512 (FIPS 202) Teks atau Fail",
        description:
          "Jana hash SHA3-512 (FIPS 202) untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA3-512 (FIPS 202)-hash tekst of bestand",
        description:
          "Genereer SHA3-512 (FIPS 202)-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA3-512 (FIPS 202)-hash tekst eller fil",
        description:
          "Generer SHA3-512 (FIPS 202)-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA3-512 (FIPS 202) tekstu lub pliku",
        description:
          "Generuj hash SHA3-512 (FIPS 202) dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA3-512 (FIPS 202) de Texto ou Arquivo",
        description:
          "Gere hash SHA3-512 (FIPS 202) para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA3-512 (FIPS 202)-хеш текста или файла",
        description:
          "Генерируйте SHA3-512 (FIPS 202)-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA3-512 (FIPS 202)-hash text eller fil",
        description:
          "Generera SHA3-512 (FIPS 202)-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA3-512 (FIPS 202) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA3-512 (FIPS 202) สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA3-512 (FIPS 202) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA3-512 (FIPS 202) hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA3-512 (FIPS 202) văn bản hoặc tệp",
        description:
          "Tạo hash SHA3-512 (FIPS 202) cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA3-512 (FIPS 202) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA3-512 (FIPS 202) 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA3-512 (FIPS 202) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA3-512 (FIPS 202) 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha384-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "sha384", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة SHA-384 للنص أو الملف",
        description:
          "إنشاء تجزئة SHA-384 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA-384-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA-384-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA-384 Hash Text or File",
        description:
          "Generate SHA-384 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA-384 de Texto o Archivo",
        description:
          "Genera hash SHA-384 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA-384 de Texte ou Fichier",
        description:
          "Générez un hash SHA-384 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA-384 טקסט או קובץ",
        description:
          "צור האש SHA-384 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA-384 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA-384 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA-384 Teks atau File",
        description:
          "Buat hash SHA-384 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA-384 di Testo o File",
        description:
          "Genera hash SHA-384 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA-384 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA-384ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA-384 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA-384 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA-384 Teks atau Fail",
        description:
          "Jana hash SHA-384 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA-384-hash tekst of bestand",
        description:
          "Genereer SHA-384-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA-384-hash tekst eller fil",
        description:
          "Generer SHA-384-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA-384 tekstu lub pliku",
        description:
          "Generuj hash SHA-384 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA-384 de Texto ou Arquivo",
        description:
          "Gere hash SHA-384 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA-384-хеш текста или файла",
        description:
          "Генерируйте SHA-384-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA-384-hash text eller fil",
        description:
          "Generera SHA-384-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA-384 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA-384 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA-384 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA-384 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA-384 văn bản hoặc tệp",
        description:
          "Tạo hash SHA-384 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA-384 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA-384 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA-384 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA-384 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha512-224-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "sha512",
      "sha512-224",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة SHA-512/224 (FIPS 180-4) للنص أو الملف",
        description:
          "إنشاء تجزئة SHA-512/224 (FIPS 180-4) لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA-512/224 (FIPS 180-4)-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA-512/224 (FIPS 180-4)-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA-512/224 (FIPS 180-4) Hash Text or File",
        description:
          "Generate SHA-512/224 (FIPS 180-4) hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA-512/224 (FIPS 180-4) de Texto o Archivo",
        description:
          "Genera hash SHA-512/224 (FIPS 180-4) para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA-512/224 (FIPS 180-4) de Texte ou Fichier",
        description:
          "Générez un hash SHA-512/224 (FIPS 180-4) pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA-512/224 (FIPS 180-4) טקסט או קובץ",
        description:
          "צור האש SHA-512/224 (FIPS 180-4) עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA-512/224 (FIPS 180-4) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA-512/224 (FIPS 180-4) हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA-512/224 (FIPS 180-4) Teks atau File",
        description:
          "Buat hash SHA-512/224 (FIPS 180-4) untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA-512/224 (FIPS 180-4) di Testo o File",
        description:
          "Genera hash SHA-512/224 (FIPS 180-4) per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA-512/224 (FIPS 180-4) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA-512/224 (FIPS 180-4)ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA-512/224 (FIPS 180-4) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA-512/224 (FIPS 180-4) 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA-512/224 (FIPS 180-4) Teks atau Fail",
        description:
          "Jana hash SHA-512/224 (FIPS 180-4) untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA-512/224 (FIPS 180-4)-hash tekst of bestand",
        description:
          "Genereer SHA-512/224 (FIPS 180-4)-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA-512/224 (FIPS 180-4)-hash tekst eller fil",
        description:
          "Generer SHA-512/224 (FIPS 180-4)-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA-512/224 (FIPS 180-4) tekstu lub pliku",
        description:
          "Generuj hash SHA-512/224 (FIPS 180-4) dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA-512/224 (FIPS 180-4) de Texto ou Arquivo",
        description:
          "Gere hash SHA-512/224 (FIPS 180-4) para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA-512/224 (FIPS 180-4)-хеш текста или файла",
        description:
          "Генерируйте SHA-512/224 (FIPS 180-4)-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA-512/224 (FIPS 180-4)-hash text eller fil",
        description:
          "Generera SHA-512/224 (FIPS 180-4)-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA-512/224 (FIPS 180-4) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA-512/224 (FIPS 180-4) สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA-512/224 (FIPS 180-4) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA-512/224 (FIPS 180-4) hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA-512/224 (FIPS 180-4) văn bản hoặc tệp",
        description:
          "Tạo hash SHA-512/224 (FIPS 180-4) cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA-512/224 (FIPS 180-4) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA-512/224 (FIPS 180-4) 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA-512/224 (FIPS 180-4) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA-512/224 (FIPS 180-4) 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha512-256-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "sha512",
      "sha512-256",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة SHA-512/256 (FIPS 180-4) للنص أو الملف",
        description:
          "إنشاء تجزئة SHA-512/256 (FIPS 180-4) لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA-512/256 (FIPS 180-4)-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA-512/256 (FIPS 180-4)-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA-512/256 (FIPS 180-4) Hash Text or File",
        description:
          "Generate SHA-512/256 (FIPS 180-4) hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA-512/256 (FIPS 180-4) de Texto o Archivo",
        description:
          "Genera hash SHA-512/256 (FIPS 180-4) para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA-512/256 (FIPS 180-4) de Texte ou Fichier",
        description:
          "Générez un hash SHA-512/256 (FIPS 180-4) pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA-512/256 (FIPS 180-4) טקסט או קובץ",
        description:
          "צור האש SHA-512/256 (FIPS 180-4) עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA-512/256 (FIPS 180-4) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA-512/256 (FIPS 180-4) हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA-512/256 (FIPS 180-4) Teks atau File",
        description:
          "Buat hash SHA-512/256 (FIPS 180-4) untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA-512/256 (FIPS 180-4) di Testo o File",
        description:
          "Genera hash SHA-512/256 (FIPS 180-4) per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA-512/256 (FIPS 180-4) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA-512/256 (FIPS 180-4)ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA-512/256 (FIPS 180-4) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA-512/256 (FIPS 180-4) 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA-512/256 (FIPS 180-4) Teks atau Fail",
        description:
          "Jana hash SHA-512/256 (FIPS 180-4) untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA-512/256 (FIPS 180-4)-hash tekst of bestand",
        description:
          "Genereer SHA-512/256 (FIPS 180-4)-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA-512/256 (FIPS 180-4)-hash tekst eller fil",
        description:
          "Generer SHA-512/256 (FIPS 180-4)-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA-512/256 (FIPS 180-4) tekstu lub pliku",
        description:
          "Generuj hash SHA-512/256 (FIPS 180-4) dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA-512/256 (FIPS 180-4) de Texto ou Arquivo",
        description:
          "Gere hash SHA-512/256 (FIPS 180-4) para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA-512/256 (FIPS 180-4)-хеш текста или файла",
        description:
          "Генерируйте SHA-512/256 (FIPS 180-4)-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA-512/256 (FIPS 180-4)-hash text eller fil",
        description:
          "Generera SHA-512/256 (FIPS 180-4)-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA-512/256 (FIPS 180-4) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA-512/256 (FIPS 180-4) สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA-512/256 (FIPS 180-4) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA-512/256 (FIPS 180-4) hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA-512/256 (FIPS 180-4) văn bản hoặc tệp",
        description:
          "Tạo hash SHA-512/256 (FIPS 180-4) cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA-512/256 (FIPS 180-4) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA-512/256 (FIPS 180-4) 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA-512/256 (FIPS 180-4) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA-512/256 (FIPS 180-4) 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sha512-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "sha512", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة SHA-512 للنص أو الملف",
        description:
          "إنشاء تجزئة SHA-512 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SHA-512-Hash für Text oder Datei",
        description:
          "Generieren Sie SHA-512-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SHA-512 Hash Text or File",
        description:
          "Generate SHA-512 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SHA-512 de Texto o Archivo",
        description:
          "Genera hash SHA-512 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SHA-512 de Texte ou Fichier",
        description:
          "Générez un hash SHA-512 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SHA-512 טקסט או קובץ",
        description:
          "צור האש SHA-512 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SHA-512 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SHA-512 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SHA-512 Teks atau File",
        description:
          "Buat hash SHA-512 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SHA-512 di Testo o File",
        description:
          "Genera hash SHA-512 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SHA-512 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSHA-512ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SHA-512 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SHA-512 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SHA-512 Teks atau Fail",
        description:
          "Jana hash SHA-512 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SHA-512-hash tekst of bestand",
        description:
          "Genereer SHA-512-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SHA-512-hash tekst eller fil",
        description:
          "Generer SHA-512-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SHA-512 tekstu lub pliku",
        description:
          "Generuj hash SHA-512 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SHA-512 de Texto ou Arquivo",
        description:
          "Gere hash SHA-512 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SHA-512-хеш текста или файла",
        description:
          "Генерируйте SHA-512-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SHA-512-hash text eller fil",
        description:
          "Generera SHA-512-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SHA-512 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHA-512 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SHA-512 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SHA-512 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SHA-512 văn bản hoặc tệp",
        description:
          "Tạo hash SHA-512 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SHA-512 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHA-512 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SHA-512 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHA-512 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "shake128-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "shake",
      "shake128",
      "xof",
      "fips-202",
      "crypto",
      "file",
      "text",
    ],
    locales: {
      ar: {
        name: "تجزئة SHAKE128 (FIPS 202) للنص أو الملف",
        description:
          "أنشئ تجزئات SHAKE128 ‏(FIPS 202) للنصوص أو الملفات المرفوعة. ينتج هذا أرقام XOF بطول متغير لاستخدامها في المجاميع الاختبارية التشفيرية، وهاشات البروتوكولات، وسير عمل سلامة البيانات.",
      },
      de: {
        name: "SHAKE128 (FIPS 202)-Hash für Text oder Datei",
        description:
          "Erzeuge SHAKE128-(FIPS 202)-Hashes für Texteingaben oder Datei-Uploads. Liefere XOF-Digests mit variabler Länge für kryptografische Prüfsummen, Protokoll-Hashing und Datenintegritäts-Workflows.",
      },
      en: {
        name: "SHAKE128 (FIPS 202) Hash Text or File",
        description:
          "Generate SHAKE128 (FIPS 202) hashes for text input or file upload. Produce variable-length XOF digests for cryptographic checksums, protocol hashing, and data integrity workflows.",
      },
      es: {
        name: "Hash SHAKE128 (FIPS 202) de Texto o Archivo",
        description:
          "Genera hashes SHAKE128 (FIPS 202) para texto o archivos. Produce resúmenes XOF de longitud variable para sumas de verificación criptográficas, hash de protocolos y flujos de integridad de datos.",
      },
      fr: {
        name: "Hash SHAKE128 (FIPS 202) de Texte ou Fichier",
        description:
          "Générez des hachages SHAKE128 (FIPS 202) pour du texte ou des fichiers. Produisez des empreintes XOF à longueur variable pour des sommes de contrôle cryptographiques, le hachage de protocoles et les flux d’intégrité des données.",
      },
      he: {
        name: "האש SHAKE128 (FIPS 202) טקסט או קובץ",
        description:
          "צור גיבובי SHAKE128 ‏(FIPS 202) לטקסט או לקבצים שהועלו. הכלי מפיק תקצירי XOF באורך משתנה עבור בדיקות שלמות קריפטוגרפיות, גיבוב פרוטוקולים וזרימות עבודה של תקינות נתונים.",
      },
      hi: {
        name: "SHAKE128 (FIPS 202) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट या फ़ाइलों के लिए SHAKE128 (FIPS 202) हैश बनाएँ। यह टूल परिवर्तनीय लंबाई वाले XOF डाइजेस्ट देता है, जो क्रिप्टोग्राफ़िक चेकसम, प्रोटोकॉल हैशिंग और डेटा इंटीग्रिटी वर्कफ़्लो के लिए उपयोगी हैं।",
      },
      id: {
        name: "Hash SHAKE128 (FIPS 202) Teks atau File",
        description:
          "Buat hash SHAKE128 (FIPS 202) untuk teks atau file. Hasilkan digest XOF dengan panjang variabel untuk checksum kriptografis, hashing protokol, dan alur kerja integritas data.",
      },
      it: {
        name: "Hash SHAKE128 (FIPS 202) di Testo o File",
        description:
          "Genera hash SHAKE128 (FIPS 202) per testo o file. Produce digest XOF a lunghezza variabile per checksum crittografici, hashing di protocolli e flussi di integrità dei dati.",
      },
      ja: {
        name: "SHAKE128 (FIPS 202) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力やファイルアップロード向けに SHAKE128 (FIPS 202) ハッシュを生成します。可変長の XOF ダイジェストを出力し、暗号チェックサム、プロトコルハッシュ、データ整合性ワークフローに役立ちます。",
      },
      ko: {
        name: "SHAKE128 (FIPS 202) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력이나 파일 업로드에 대해 SHAKE128 (FIPS 202) 해시를 생성합니다. 가변 길이 XOF 다이제스트를 출력해 암호 체크섬, 프로토콜 해싱, 데이터 무결성 워크플로에 활용할 수 있습니다.",
      },
      ms: {
        name: "Hash SHAKE128 (FIPS 202) Teks atau Fail",
        description:
          "Hasilkan hash SHAKE128 (FIPS 202) untuk teks atau fail. Dapatkan digest XOF dengan panjang berubah-ubah untuk checksum kriptografi, penghashan protokol dan aliran kerja integriti data.",
      },
      nl: {
        name: "SHAKE128 (FIPS 202)-hash tekst of bestand",
        description:
          "Genereer SHAKE128-(FIPS 202)-hashes voor tekst of bestanden. Produceer XOF-digests met variabele lengte voor cryptografische controlesommen, protocolhashing en workflows rond gegevensintegriteit.",
      },
      no: {
        name: "SHAKE128 (FIPS 202)-hash tekst eller fil",
        description:
          "Generer SHAKE128-hasher (FIPS 202) for tekst eller filer. Få XOF-digester med variabel lengde for kryptografiske kontrollsummer, protokoll-hashing og arbeidsflyter for dataintegritet.",
      },
      pl: {
        name: "Hash SHAKE128 (FIPS 202) tekstu lub pliku",
        description:
          "Generuj hashe SHAKE128 (FIPS 202) dla tekstu lub plików. Otrzymuj skróty XOF o zmiennej długości do kryptograficznych sum kontrolnych, haszowania protokołów i procesów integralności danych.",
      },
      pt: {
        name: "Hash SHAKE128 (FIPS 202) de Texto ou Arquivo",
        description:
          "Gere hashes SHAKE128 (FIPS 202) para texto ou arquivos. Produza digests XOF de comprimento variável para checksums criptográficos, hash de protocolos e fluxos de integridade de dados.",
      },
      ru: {
        name: "SHAKE128 (FIPS 202)-хеш текста или файла",
        description:
          "Создавайте хеши SHAKE128 (FIPS 202) для текста или файлов. Инструмент выдаёт XOF-дайджесты переменной длины для криптографических контрольных сумм, хеширования протоколов и сценариев проверки целостности данных.",
      },
      sv: {
        name: "SHAKE128 (FIPS 202)-hash text eller fil",
        description:
          "Generera SHAKE128-hashar (FIPS 202) för text eller filer. Få XOF-digester med variabel längd för kryptografiska kontrollsummor, protokollhashning och arbetsflöden för dataintegritet.",
      },
      th: {
        name: "แฮช SHAKE128 (FIPS 202) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHAKE128 (FIPS 202) สำหรับข้อความหรือไฟล์ที่อัปโหลด เอาต์พุตเป็น XOF แบบความยาวแปรผัน เหมาะกับเช็กซัมเชิงเข้ารหัส การแฮชในโปรโตคอล และงานด้านความถูกต้องของข้อมูล",
      },
      tr: {
        name: "SHAKE128 (FIPS 202) Hash Metin veya Dosya",
        description:
          "Metin veya dosyalar için SHAKE128 (FIPS 202) hashleri üretin. Kriptografik sağlama toplamları, protokol hashleme ve veri bütünlüğü iş akışları için değişken uzunluklu XOF çıktıları alın.",
      },
      vi: {
        name: "Hash SHAKE128 (FIPS 202) văn bản hoặc tệp",
        description:
          "Tạo hash SHAKE128 (FIPS 202) cho văn bản hoặc tệp. Công cụ tạo digest XOF có độ dài linh hoạt cho checksum mật mã, băm giao thức và quy trình toàn vẹn dữ liệu.",
      },
      "zh-CN": {
        name: "SHAKE128 (FIPS 202) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHAKE128 (FIPS 202) 哈希值。输出可变长度的 XOF 摘要，用于加密校验和、协议哈希和数据完整性工作流。",
      },
      "zh-TW": {
        name: "SHAKE128 (FIPS 202) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHAKE128 (FIPS 202) 雜湊值。輸出可變長度的 XOF 摘要，用於加密校驗和、協定雜湊與資料完整性流程。",
      },
    },
  },
  {
    slug: "shake256-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "shake",
      "shake256",
      "xof",
      "fips-202",
      "crypto",
      "file",
      "text",
    ],
    locales: {
      ar: {
        name: "تجزئة SHAKE256 (FIPS 202) للنص أو الملف",
        description:
          "أنشئ تجزئات SHAKE256 ‏(FIPS 202) للنصوص أو الملفات المرفوعة. ينتج هذا أرقام XOF بطول متغير لاستخدامها في المجاميع الاختبارية التشفيرية، وهاشات البروتوكولات، وسير عمل سلامة البيانات.",
      },
      de: {
        name: "SHAKE256 (FIPS 202)-Hash für Text oder Datei",
        description:
          "Erzeuge SHAKE256-(FIPS 202)-Hashes für Texteingaben oder Datei-Uploads. Liefere XOF-Digests mit variabler Länge für kryptografische Prüfsummen, Protokoll-Hashing und Datenintegritäts-Workflows.",
      },
      en: {
        name: "SHAKE256 (FIPS 202) Hash Text or File",
        description:
          "Generate SHAKE256 (FIPS 202) hashes for text input or file upload. Produce variable-length XOF digests for cryptographic checksums, protocol hashing, and data integrity workflows.",
      },
      es: {
        name: "Hash SHAKE256 (FIPS 202) de Texto o Archivo",
        description:
          "Genera hashes SHAKE256 (FIPS 202) para texto o archivos. Produce resúmenes XOF de longitud variable para sumas de verificación criptográficas, hash de protocolos y flujos de integridad de datos.",
      },
      fr: {
        name: "Hash SHAKE256 (FIPS 202) de Texte ou Fichier",
        description:
          "Générez des hachages SHAKE256 (FIPS 202) pour du texte ou des fichiers. Produisez des empreintes XOF à longueur variable pour des sommes de contrôle cryptographiques, le hachage de protocoles et les flux d’intégrité des données.",
      },
      he: {
        name: "האש SHAKE256 (FIPS 202) טקסט או קובץ",
        description:
          "צור גיבובי SHAKE256 ‏(FIPS 202) לטקסט או לקבצים שהועלו. הכלי מפיק תקצירי XOF באורך משתנה עבור בדיקות שלמות קריפטוגרפיות, גיבוב פרוטוקולים וזרימות עבודה של תקינות נתונים.",
      },
      hi: {
        name: "SHAKE256 (FIPS 202) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट या फ़ाइलों के लिए SHAKE256 (FIPS 202) हैश बनाएँ। यह टूल परिवर्तनीय लंबाई वाले XOF डाइजेस्ट देता है, जो क्रिप्टोग्राफ़िक चेकसम, प्रोटोकॉल हैशिंग और डेटा इंटीग्रिटी वर्कफ़्लो के लिए उपयोगी हैं।",
      },
      id: {
        name: "Hash SHAKE256 (FIPS 202) Teks atau File",
        description:
          "Buat hash SHAKE256 (FIPS 202) untuk teks atau file. Hasilkan digest XOF dengan panjang variabel untuk checksum kriptografis, hashing protokol, dan alur kerja integritas data.",
      },
      it: {
        name: "Hash SHAKE256 (FIPS 202) di Testo o File",
        description:
          "Genera hash SHAKE256 (FIPS 202) per testo o file. Produce digest XOF a lunghezza variabile per checksum crittografici, hashing di protocolli e flussi di integrità dei dati.",
      },
      ja: {
        name: "SHAKE256 (FIPS 202) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力やファイルアップロード向けに SHAKE256 (FIPS 202) ハッシュを生成します。可変長の XOF ダイジェストを出力し、暗号チェックサム、プロトコルハッシュ、データ整合性ワークフローに役立ちます。",
      },
      ko: {
        name: "SHAKE256 (FIPS 202) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력이나 파일 업로드에 대해 SHAKE256 (FIPS 202) 해시를 생성합니다. 가변 길이 XOF 다이제스트를 출력해 암호 체크섬, 프로토콜 해싱, 데이터 무결성 워크플로에 활용할 수 있습니다.",
      },
      ms: {
        name: "Hash SHAKE256 (FIPS 202) Teks atau Fail",
        description:
          "Hasilkan hash SHAKE256 (FIPS 202) untuk teks atau fail. Dapatkan digest XOF dengan panjang berubah-ubah untuk checksum kriptografi, penghashan protokol dan aliran kerja integriti data.",
      },
      nl: {
        name: "SHAKE256 (FIPS 202)-hash tekst of bestand",
        description:
          "Genereer SHAKE256-(FIPS 202)-hashes voor tekst of bestanden. Produceer XOF-digests met variabele lengte voor cryptografische controlesommen, protocolhashing en workflows rond gegevensintegriteit.",
      },
      no: {
        name: "SHAKE256 (FIPS 202)-hash tekst eller fil",
        description:
          "Generer SHAKE256-hasher (FIPS 202) for tekst eller filer. Få XOF-digester med variabel lengde for kryptografiske kontrollsummer, protokoll-hashing og arbeidsflyter for dataintegritet.",
      },
      pl: {
        name: "Hash SHAKE256 (FIPS 202) tekstu lub pliku",
        description:
          "Generuj hashe SHAKE256 (FIPS 202) dla tekstu lub plików. Otrzymuj skróty XOF o zmiennej długości do kryptograficznych sum kontrolnych, haszowania protokołów i procesów integralności danych.",
      },
      pt: {
        name: "Hash SHAKE256 (FIPS 202) de Texto ou Arquivo",
        description:
          "Gere hashes SHAKE256 (FIPS 202) para texto ou arquivos. Produza digests XOF de comprimento variável para checksums criptográficos, hash de protocolos e fluxos de integridade de dados.",
      },
      ru: {
        name: "SHAKE256 (FIPS 202)-хеш текста или файла",
        description:
          "Создавайте хеши SHAKE256 (FIPS 202) для текста или файлов. Инструмент выдаёт XOF-дайджесты переменной длины для криптографических контрольных сумм, хеширования протоколов и сценариев проверки целостности данных.",
      },
      sv: {
        name: "SHAKE256 (FIPS 202)-hash text eller fil",
        description:
          "Generera SHAKE256-hashar (FIPS 202) för text eller filer. Få XOF-digester med variabel längd för kryptografiska kontrollsummor, protokollhashning och arbetsflöden för dataintegritet.",
      },
      th: {
        name: "แฮช SHAKE256 (FIPS 202) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SHAKE256 (FIPS 202) สำหรับข้อความหรือไฟล์ที่อัปโหลด เอาต์พุตเป็น XOF แบบความยาวแปรผัน เหมาะกับเช็กซัมเชิงเข้ารหัส การแฮชในโปรโตคอล และงานด้านความถูกต้องของข้อมูล",
      },
      tr: {
        name: "SHAKE256 (FIPS 202) Hash Metin veya Dosya",
        description:
          "Metin veya dosyalar için SHAKE256 (FIPS 202) hashleri üretin. Kriptografik sağlama toplamları, protokol hashleme ve veri bütünlüğü iş akışları için değişken uzunluklu XOF çıktıları alın.",
      },
      vi: {
        name: "Hash SHAKE256 (FIPS 202) văn bản hoặc tệp",
        description:
          "Tạo hash SHAKE256 (FIPS 202) cho văn bản hoặc tệp. Công cụ tạo digest XOF có độ dài linh hoạt cho checksum mật mã, băm giao thức và quy trình toàn vẹn dữ liệu.",
      },
      "zh-CN": {
        name: "SHAKE256 (FIPS 202) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SHAKE256 (FIPS 202) 哈希值。输出可变长度的 XOF 摘要，用于加密校验和、协议哈希和数据完整性工作流。",
      },
      "zh-TW": {
        name: "SHAKE256 (FIPS 202) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SHAKE256 (FIPS 202) 雜湊值。輸出可變長度的 XOF 摘要，用於加密校驗和、協定雜湊與資料完整性流程。",
      },
    },
  },
  {
    slug: "sitemap-xml-generator",
    category: "web",
    icon: "globe",
    tags: ["sitemap", "xml", "seo", "crawler", "generator", "website"],
    locales: {
      ar: {
        name: "منشئ Sitemap XML",
        description:
          "أنشئ ملفات sitemap.xml أو فهارس sitemap من قوائم URL مرتبة دون مغادرة المتصفح.",
      },
      de: {
        name: "Sitemap-XML-Generator",
        description:
          "Erstelle sitemap.xml-Dateien oder Sitemap-Indizes aus sauberen URL-Listen direkt im Browser.",
      },
      en: {
        name: "Sitemap XML Generator",
        description:
          "Generate sitemap.xml files or sitemap indexes from clean URL lists without leaving the browser.",
      },
      es: {
        name: "Generador XML de sitemaps",
        description:
          "Genera archivos sitemap.xml o índices de sitemap desde listas limpias de URL sin salir del navegador.",
      },
      fr: {
        name: "Générateur XML de sitemap",
        description:
          "Créez des fichiers sitemap.xml ou des index de sitemaps à partir de listes d’URL propres, directement dans le navigateur.",
      },
      he: {
        name: "מחולל Sitemap XML",
        description:
          "צרו קובצי sitemap.xml או אינדקסים של sitemap מרשימות URL נקיות בלי לצאת מהדפדפן.",
      },
      hi: {
        name: "Sitemap XML जेनरेटर",
        description:
          "ब्राउज़र छोड़े बिना साफ URL सूचियों से sitemap.xml फ़ाइलें या sitemap index बनाएं।",
      },
      id: {
        name: "Pembuat Sitemap XML",
        description:
          "Buat berkas sitemap.xml atau indeks sitemap dari daftar URL yang rapi tanpa meninggalkan browser.",
      },
      it: {
        name: "Generatore XML di sitemap",
        description:
          "Genera file sitemap.xml o indici sitemap da liste di URL pulite senza lasciare il browser.",
      },
      ja: {
        name: "サイトマップ XML ジェネレーター",
        description:
          "ブラウザー内で、整理された URL リストから sitemap.xml ファイルまたはサイトマップインデックスを生成します。",
      },
      ko: {
        name: "사이트맵 XML 생성기",
        description:
          "브라우저를 떠나지 않고 정리된 URL 목록에서 sitemap.xml 파일이나 사이트맵 인덱스를 생성합니다.",
      },
      ms: {
        name: "Penjana Sitemap XML",
        description:
          "Jana fail sitemap.xml atau indeks sitemap daripada senarai URL yang kemas tanpa meninggalkan pelayar.",
      },
      nl: {
        name: "Sitemap XML-generator",
        description:
          "Genereer sitemap.xml-bestanden of sitemapindexen vanuit nette URL-lijsten zonder de browser te verlaten.",
      },
      no: {
        name: "Sitemap XML-generator",
        description:
          "Generer sitemap.xml-filer eller sitemapindekser fra ryddige URL-lister uten å forlate nettleseren.",
      },
      pl: {
        name: "Generator Sitemap XML",
        description:
          "Generuj pliki sitemap.xml albo indeksy sitemap z uporządkowanych list URL bez opuszczania przeglądarki.",
      },
      pt: {
        name: "Gerador de XML de Sitemap",
        description:
          "Gere arquivos sitemap.xml ou índices de sitemap a partir de listas limpas de URL sem sair do navegador.",
      },
      ru: {
        name: "Генератор Sitemap XML",
        description:
          "Создавайте файлы sitemap.xml или индексы sitemap из чистых списков URL прямо в браузере.",
      },
      sv: {
        name: "Sitemap XML-generator",
        description:
          "Generera sitemap.xml-filer eller sitemapindex från rena URL-listor direkt i webbläsaren.",
      },
      th: {
        name: "ตัวสร้าง Sitemap XML",
        description:
          "สร้างไฟล์ sitemap.xml หรือดัชนี sitemap จากรายการ URL ที่สะอาดโดยไม่ต้องออกจากเบราว์เซอร์",
      },
      tr: {
        name: "Sitemap XML Oluşturucu",
        description:
          "Tarayıcıdan ayrılmadan temiz URL listelerinden sitemap.xml dosyaları veya sitemap indeksleri oluşturun.",
      },
      vi: {
        name: "Trình tạo Sitemap XML",
        description:
          "Tạo tệp sitemap.xml hoặc chỉ mục sitemap từ danh sách URL gọn gàng ngay trong trình duyệt.",
      },
      "zh-CN": {
        name: "Sitemap XML 生成器",
        description:
          "直接在浏览器里根据 URL 清单生成 sitemap.xml 或 sitemap index，无需切换到其他工具。",
      },
      "zh-TW": {
        name: "Sitemap XML 產生器",
        description:
          "直接在瀏覽器中根據 URL 清單產生 sitemap.xml 或 sitemap index，不必切換到其他工具。",
      },
    },
  },
  {
    slug: "slug-generator",
    category: "web",
    icon: "globe",
    tags: ["slug", "url", "seo", "permalink", "text", "converter"],
    locales: {
      ar: {
        name: "مولد Slug",
        description:
          "تحويل النص إلى slug متوافق مع عناوين URL لتحسين محركات البحث والروابط الدائمة",
      },
      de: {
        name: "Slug-Generator",
        description:
          "Konvertiert Text in URL-freundliche Slugs für SEO und Permalinks",
      },
      en: {
        name: "Slug Generator",
        description:
          "Convert text into URL-friendly slugs. Supports Unicode transliteration for Chinese, Japanese, Korean, Cyrillic, and more.",
      },
      es: {
        name: "Generador de Slug",
        description:
          "Convierte texto en slugs amigables para URLs, SEO y enlaces permanentes",
      },
      fr: {
        name: "Générateur de Slug",
        description:
          "Convertit le texte en slugs compatibles URL pour le SEO et les permaliens",
      },
      he: {
        name: "מחולל Slug",
        description:
          "המרת טקסט ל-slug ידידותי לכתובות URL עבור SEO וקישורים קבועים",
      },
      hi: {
        name: "Slug जेनरेटर",
        description: "टेक्स्ट को SEO और पर्मालिंक के लिए URL-अनुकूल slug में बदलें",
      },
      id: {
        name: "Generator Slug",
        description:
          "Konversi teks menjadi slug yang ramah URL untuk SEO dan tautan permanen",
      },
      it: {
        name: "Generatore di Slug",
        description:
          "Converte il testo in slug compatibili con URL per SEO e permalink",
      },
      ja: {
        name: "Slug ジェネレーター",
        description:
          "テキストを SEO やパーマリンク用の URL フレンドリーな slug に変換",
      },
      ko: {
        name: "Slug 생성기",
        description: "텍스트를 SEO 및 퍼머링크용 URL 친화적인 slug로 변환",
      },
      ms: {
        name: "Penjana Slug",
        description:
          "Tukar teks kepada slug mesra URL untuk SEO dan pautan kekal",
      },
      nl: {
        name: "Slug Generator",
        description:
          "Converteer tekst naar URL-vriendelijke slugs voor SEO en permalinks",
      },
      no: {
        name: "Slug-generator",
        description:
          "Konverter tekst til URL-vennlige slugs for SEO og permalenker",
      },
      pl: {
        name: "Generator Slug",
        description:
          "Konwertuj tekst na przyjazne dla URL slugi do SEO i linków bezpośrednich",
      },
      pt: {
        name: "Gerador de Slug",
        description:
          "Converte texto em slugs amigáveis para URL, SEO e links permanentes",
      },
      ru: {
        name: "Генератор Slug",
        description:
          "Преобразует текст в URL-совместимые slug для SEO и постоянных ссылок",
      },
      sv: {
        name: "Slug-generator",
        description:
          "Konvertera text till URL-vänliga slugs för SEO och permalänkar",
      },
      th: {
        name: "ตัวสร้าง Slug",
        description: "แปลงข้อความเป็น slug ที่เข้ากันได้กับ URL สำหรับ SEO และลิงก์ถาวร",
      },
      tr: {
        name: "Slug Oluşturucu",
        description:
          "Metni SEO ve kalıcı bağlantılar için URL dostu slug'lara dönüştürün",
      },
      vi: {
        name: "Tạo Slug",
        description:
          "Chuyển đổi văn bản thành slug thân thiện với URL cho SEO và liên kết cố định",
      },
      "zh-CN": {
        name: "Slug 生成器",
        description:
          "将文本转换为 URL 友好的 slug，支持中文、日文、韩文、西里尔文等多语言 Unicode 转写",
      },
      "zh-TW": {
        name: "Slug 產生器",
        description:
          "將文字轉換為網址友善的 slug，支援中文、日文、韓文、西里爾文等多語言 Unicode 轉寫",
      },
    },
  },
  {
    slug: "sm3-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: ["hash", "sm3", "checksum", "security", "file", "text", "crypto"],
    locales: {
      ar: {
        name: "تجزئة SM3 للنص أو الملف",
        description:
          "إنشاء تجزئة SM3 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "SM3-Hash für Text oder Datei",
        description:
          "Generieren Sie SM3-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "SM3 Hash Text or File",
        description:
          "Generate SM3 hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash SM3 de Texto o Archivo",
        description:
          "Genera hash SM3 para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash SM3 de Texte ou Fichier",
        description:
          "Générez un hash SM3 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש SM3 טקסט או קובץ",
        description:
          "צור האש SM3 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "SM3 हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए SM3 हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash SM3 Teks atau File",
        description:
          "Buat hash SM3 untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash SM3 di Testo o File",
        description:
          "Genera hash SM3 per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "SM3 ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのSM3ハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "SM3 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 SM3 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash SM3 Teks atau Fail",
        description:
          "Jana hash SM3 untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "SM3-hash tekst of bestand",
        description:
          "Genereer SM3-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "SM3-hash tekst eller fil",
        description:
          "Generer SM3-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash SM3 tekstu lub pliku",
        description:
          "Generuj hash SM3 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash SM3 de Texto ou Arquivo",
        description:
          "Gere hash SM3 para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "SM3-хеш текста или файла",
        description:
          "Генерируйте SM3-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "SM3-hash text eller fil",
        description:
          "Generera SM3-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช SM3 ข้อความหรือไฟล์",
        description:
          "สร้างแฮช SM3 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "SM3 Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için SM3 hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash SM3 văn bản hoặc tệp",
        description:
          "Tạo hash SM3 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "SM3 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 SM3 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "SM3 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 SM3 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "sql-formatter-and-linter",
    category: "developer",
    icon: "braces",
    tags: ["code", "sql", "formatter", "linter", "query", "database"],
    locales: {
      ar: {
        name: "منسق SQL ومدقق",
        description:
          "نسّق استعلامات SQL في متصفحك، واضبط قواعد التنسيق الحساسة للغة، واكتشف مشكلات التدقيق الشائعة قبل نسخ النتيجة أو تنزيلها.",
      },
      de: {
        name: "SQL-Formatter & Linter",
        description:
          "SQL-Abfragen direkt im Browser formatieren, layoutbezogene Regeln mit Dialektunterstützung anpassen und gängige Lint-Probleme erkennen, bevor du das Ergebnis kopierst oder herunterlädst.",
      },
      en: {
        name: "SQL Formatter & Linter",
        description:
          "Format SQL queries in your browser, tune dialect-aware layout rules, and catch common lint issues before you copy or download the result.",
      },
      es: {
        name: "Formateador y linter de SQL",
        description:
          "Formatea consultas SQL en tu navegador, ajusta reglas de diseño según el dialecto y detecta problemas comunes de lint antes de copiar o descargar el resultado.",
      },
      fr: {
        name: "Formateur et linter SQL",
        description:
          "Formatez des requêtes SQL dans votre navigateur, ajustez les règles de mise en page selon le dialecte et détectez les problèmes de lint courants avant de copier ou télécharger le résultat.",
      },
      he: {
        name: "מעצב SQL ובודק תקינות",
        description:
          "עצב שאילתות SQL בדפדפן, כוונן כללי פריסה תלויי דיאלקט, וזיהוי בעיות lint נפוצות לפני שאתה מעתיק או מוריד את התוצאה.",
      },
      hi: {
        name: "SQL फ़ॉर्मैटर और लिंटर",
        description:
          "अपने ब्राउज़र में SQL क्वेरी को फ़ॉर्मैट करें, dialect-aware layout rules को समायोजित करें, और परिणाम को कॉपी या डाउनलोड करने से पहले सामान्य lint समस्याएँ पकड़ें।",
      },
      id: {
        name: "SQL Formatter & Linter",
        description:
          "Format kueri SQL di browser Anda, sesuaikan aturan tata letak yang peka terhadap dialek, dan tangkap masalah linting umum sebelum Anda menyalin atau mengunduh hasilnya.",
      },
      it: {
        name: "SQL Formatter & Linter",
        description:
          "Formatta query SQL nel browser, regola le opzioni di layout in base al dialect e segnala i problemi di lint più comuni prima di copiare o scaricare il risultato.",
      },
      ja: {
        name: "SQL フォーマッタ & リンター",
        description:
          "ブラウザ内で SQL クエリを整形し、方言に応じたレイアウトルールを調整し、結果をコピーまたはダウンロードする前に一般的な lint の問題を検出します。",
      },
      ko: {
        name: "SQL Formatter & Linter",
        description:
          "브라우저에서 SQL 쿼리를 포맷하고, 방언 인식 레이아웃 규칙을 조정하며, 결과를 복사하거나 다운로드하기 전에 흔한 lint 문제를 찾아냅니다.",
      },
      ms: {
        name: "Pemformat dan Linter SQL",
        description:
          "Format pertanyaan SQL dalam pelayar anda, laraskan peraturan susun atur yang peka terhadap dialek, dan kesan isu lint biasa sebelum anda menyalin atau memuat turun hasilnya.",
      },
      nl: {
        name: "SQL Formatter & Linter",
        description:
          "Formatteer SQL-query's in je browser, stem dialectbewuste lay-outregels af en vang veelvoorkomende lintproblemen op voordat je het resultaat kopieert of downloadt.",
      },
      no: {
        name: "SQL-formatter og linter",
        description:
          "Formater SQL-spørringer i nettleseren, juster dialektbevisste oppsettregler, og fang opp vanlige linter-feil før du kopierer eller laster ned resultatet.",
      },
      pl: {
        name: "SQL Formatter & Linter",
        description:
          "Formatuj zapytania SQL w przeglądarce, dostosowuj reguły układu zależne od dialektu i wykrywaj typowe problemy lintowania, zanim skopiujesz lub pobierzesz wynik.",
      },
      pt: {
        name: "Formatador e Linter de SQL",
        description:
          "Formate consultas SQL no navegador, ajuste regras de layout sensíveis ao dialeto e detecte problemas comuns de lint antes de copiar ou baixar o resultado.",
      },
      ru: {
        name: "SQL Formatter & Linter",
        description:
          "Форматируйте SQL-запросы прямо в браузере, настраивайте правила компоновки с учётом диалекта и находите распространённые проблемы lint до копирования или скачивания результата.",
      },
      sv: {
        name: "SQL-formaterare och linter",
        description:
          "Formatera SQL-frågor i webbläsaren, finjustera dialektmedvetna layoutregler och fånga vanliga lint-problem innan du kopierar eller laddar ner resultatet.",
      },
      th: {
        name: "SQL Formatter & Linter",
        description:
          "จัดรูปแบบคำสั่ง SQL ในเบราว์เซอร์ของคุณ ปรับกฎการจัดวางให้เหมาะกับแต่ละ dialect และตรวจจับปัญหา lint ทั่วไปก่อนที่คุณจะคัดลอกหรือดาวน์โหลดผลลัพธ์",
      },
      tr: {
        name: "SQL Biçimlendirici ve Linter",
        description:
          "SQL sorgularını tarayıcınızda biçimlendirin, diyalekt farkındalığına sahip yerleşim kurallarını ayarlayın ve sonucu kopyalamadan ya da indirmeden önce yaygın lint hatalarını yakalayın.",
      },
      vi: {
        name: "SQL Formatter & Linter",
        description:
          "Định dạng truy vấn SQL ngay trong trình duyệt, tinh chỉnh các quy tắc bố cục theo dialect và phát hiện các lỗi lint phổ biến trước khi bạn sao chép hoặc tải xuống kết quả.",
      },
      "zh-CN": {
        name: "SQL 格式化器与 Linter",
        description:
          "在浏览器中格式化 SQL 查询，调整与方言相关的布局规则，并在复制或下载结果前捕获常见的 lint 问题。",
      },
      "zh-TW": {
        name: "SQL 格式化與 Linter",
        description:
          "在瀏覽器中格式化 SQL 查詢，調整符合方言的版面規則，並在複製或下載結果前找出常見的 Lint 問題。",
      },
    },
  },
  {
    slug: "sri-hash-generator",
    category: "crypto",
    icon: "lock",
    tags: [
      "sri",
      "hash",
      "integrity",
      "security",
      "web",
      "subresource",
      "sha256",
      "sha384",
      "sha512",
    ],
    locales: {
      ar: {
        name: "مولد تجزئة SRI",
        description:
          "إنشاء تجزئات سلامة الموارد الفرعية (SRI) لموارد الويب. إنشاء تجزئات SHA-256 أو SHA-384 أو SHA-512 لضمان سلامة النصوص الخارجية وأوراق الأنماط والموارد الأخرى",
      },
      de: {
        name: "SRI-Hash-Generator",
        description:
          "Generiert Subresource Integrity (SRI) Hashes für Web-Ressourcen. Erstellen Sie SHA-256-, SHA-384- oder SHA-512-Hashes, um die Integrität externer Skripte, Stylesheets und anderer Ressourcen sicherzustellen",
      },
      en: {
        name: "SRI Hash Generator",
        description:
          "Generate Subresource Integrity (SRI) hashes for web resources. Create SHA-256, SHA-384, or SHA-512 hashes to ensure the integrity of external scripts, stylesheets, and other resources",
      },
      es: {
        name: "Generador de Hash SRI",
        description:
          "Genera hashes de Integridad de Subrecursos (SRI) para recursos web. Crea hashes SHA-256, SHA-384 o SHA-512 para asegurar la integridad de scripts externos, hojas de estilo y otros recursos",
      },
      fr: {
        name: "Générateur de Hash SRI",
        description:
          "Génère des hashes d'Intégrité de Sous-ressources (SRI) pour les ressources web. Créez des hashes SHA-256, SHA-384 ou SHA-512 pour assurer l'intégrité des scripts externes, feuilles de style et autres ressources",
      },
      he: {
        name: "מחולל האש SRI",
        description:
          "צור האשים של שלמות תת-משאבים (SRI) למשאבי אינטרנט. צור האשים SHA-256, SHA-384 או SHA-512 כדי להבטיח את שלמות סקריפטים חיצוניים, גיליונות סגנון ומשאבים אחרים",
      },
      hi: {
        name: "SRI हैश जेनरेटर",
        description:
          "वेब संसाधनों के लिए सबरिसोर्स इंटेग्रिटी (SRI) हैश जेनरेट करें। बाहरी स्क्रिप्ट, स्टाइलशीट और अन्य संसाधनों की अखंडता सुनिश्चित करने के लिए SHA-256, SHA-384 या SHA-512 हैश बनाएं",
      },
      id: {
        name: "Generator Hash SRI",
        description:
          "Buat hash Subresource Integrity (SRI) untuk sumber daya web. Buat hash SHA-256, SHA-384 atau SHA-512 untuk memastikan integritas skrip eksternal, stylesheet, dan sumber daya lainnya",
      },
      it: {
        name: "Generatore di Hash SRI",
        description:
          "Genera hash di Integrità delle Sottoresorse (SRI) per risorse web. Crea hash SHA-256, SHA-384 o SHA-512 per garantire l'integrità di script esterni, fogli di stile e altre risorse",
      },
      ja: {
        name: "SRI ハッシュジェネレーター",
        description:
          "ウェブリソース用のサブリソース整合性（SRI）ハッシュを生成します。外部スクリプト、スタイルシート、その他のリソースの整合性を確保するためのSHA-256、SHA-384、SHA-512ハッシュを作成",
      },
      ko: {
        name: "SRI 해시 생성기",
        description:
          "웹 리소스용 서브리소스 무결성(SRI) 해시를 생성합니다. 외부 스크립트, 스타일시트 및 기타 리소스의 무결성을 보장하기 위한 SHA-256, SHA-384 또는 SHA-512 해시를 생성하세요",
      },
      ms: {
        name: "Penjana Hash SRI",
        description:
          "Jana hash Subresource Integrity (SRI) untuk sumber web. Cipta hash SHA-256, SHA-384 atau SHA-512 untuk memastikan integriti skrip luaran, stylesheet dan sumber lain",
      },
      nl: {
        name: "SRI Hash Generator",
        description:
          "Genereer Subresource Integrity (SRI) hashes voor webresources. Maak SHA-256, SHA-384 of SHA-512 hashes om de integriteit van externe scripts, stylesheets en andere resources te waarborgen",
      },
      no: {
        name: "SRI Hash-generator",
        description:
          "Generer Subresource Integrity (SRI) hash-verdier for webressurser. Opprett SHA-256, SHA-384 eller SHA-512 hash-verdier for å sikre integriteten til eksterne skript, stylesheets og andre ressurser",
      },
      pl: {
        name: "Generator Hash SRI",
        description:
          "Generuj hashe Subresource Integrity (SRI) dla zasobów internetowych. Twórz hashe SHA-256, SHA-384 lub SHA-512 aby zapewnić integralność zewnętrznych skryptów, arkuszy stylów i innych zasobów",
      },
      pt: {
        name: "Gerador de Hash SRI",
        description:
          "Gere hashes de Integridade de Sub-recursos (SRI) para recursos web. Crie hashes SHA-256, SHA-384 ou SHA-512 para garantir a integridade de scripts externos, folhas de estilo e outros recursos",
      },
      ru: {
        name: "Генератор SRI-хешей",
        description:
          "Генерируйте хеши целостности подресурсов (SRI) для веб-ресурсов. Создавайте SHA-256, SHA-384 или SHA-512 хеши для обеспечения целостности внешних скриптов, таблиц стилей и других ресурсов",
      },
      sv: {
        name: "SRI Hash-generator",
        description:
          "Generera Subresource Integrity (SRI) hash-värden för webbresurser. Skapa SHA-256, SHA-384 eller SHA-512 hash-värden för att säkerställa integriteten hos externa skript, stilmallar och andra resurser",
      },
      th: {
        name: "เครื่องมือสร้าง Hash SRI",
        description:
          "สร้างแฮช Subresource Integrity (SRI) สำหรับทรัพยากรเว็บ สร้างแฮช SHA-256, SHA-384 หรือ SHA-512 เพื่อรับประกันความสมบูรณ์ของสคริปต์ภายนอก สไตล์ชีต และทรัพยากรอื่นๆ",
      },
      tr: {
        name: "SRI Hash Üretici",
        description:
          "Web kaynakları için Alt Kaynak Bütünlüğü (SRI) hash'leri oluşturun. Harici komut dosyaları, stil sayfaları ve diğer kaynakların bütünlüğünü sağlamak için SHA-256, SHA-384 veya SHA-512 hash'leri oluşturun",
      },
      vi: {
        name: "Trình tạo Hash SRI",
        description:
          "Tạo hash Subresource Integrity (SRI) cho tài nguyên web. Tạo hash SHA-256, SHA-384 hoặc SHA-512 để đảm bảo tính toàn vẹn của các script bên ngoài, stylesheet và các tài nguyên khác",
      },
      "zh-CN": {
        name: "SRI 哈希生成器",
        description:
          "为网页资源生成子资源完整性（SRI）哈希值。创建 SHA-256、SHA-384 或 SHA-512 哈希值以确保外部脚本、样式表和其他资源的完整性",
      },
      "zh-TW": {
        name: "SRI 雜湊產生器",
        description:
          "為網頁資源產生子資源完整性（SRI）雜湊值。建立 SHA-256、SHA-384 或 SHA-512 雜湊值以確保外部腳本、樣式表和其他資源的完整性",
      },
    },
  },
  {
    slug: "ssh-public-key-fingerprint",
    category: "network",
    icon: "lock",
    tags: [
      "ssh",
      "public-key",
      "fingerprint",
      "sha256",
      "md5",
      "authorized-keys",
      "openssh",
      "security",
      "network",
    ],
    locales: {
      ar: {
        name: "بصمة مفتاح SSH العام",
        description:
          "أنشئ بصمات SHA-256 وMD5 لمفاتيح OpenSSH العامة، وأسطر authorized_keys، وكتل مفاتيح SSH2 العامة.",
      },
      de: {
        name: "SSH-Public-Key-Fingerprint",
        description:
          "Erzeugen Sie SHA-256- und MD5-Fingerprints für OpenSSH-Public-Keys, authorized_keys-Zeilen und SSH2-Public-Key-Blöcke.",
      },
      en: {
        name: "SSH Public Key Fingerprint",
        description:
          "Generate SHA-256 and MD5 fingerprints for OpenSSH public keys, authorized_keys lines, and SSH2 public key blocks.",
      },
      es: {
        name: "Huella de clave pública SSH",
        description:
          "Genera huellas SHA-256 y MD5 para claves públicas OpenSSH, líneas authorized_keys y bloques de clave pública SSH2.",
      },
      fr: {
        name: "Empreinte de clé publique SSH",
        description:
          "Générez des empreintes SHA-256 et MD5 pour les clés publiques OpenSSH, les lignes authorized_keys et les blocs de clés publiques SSH2.",
      },
      he: {
        name: "טביעת אצבע של מפתח ציבורי SSH",
        description:
          "יצירת טביעות אצבע SHA-256 ו-MD5 עבור מפתחות ציבוריים של OpenSSH, שורות authorized_keys ובלוקי מפתח ציבורי SSH2.",
      },
      hi: {
        name: "SSH सार्वजनिक कुंजी फिंगरप्रिंट",
        description:
          "OpenSSH सार्वजनिक कुंजियों, authorized_keys पंक्तियों और SSH2 सार्वजनिक कुंजी ब्लॉकों के लिए SHA-256 और MD5 फिंगरप्रिंट जेनरेट करें।",
      },
      id: {
        name: "Sidik Jari Kunci Publik SSH",
        description:
          "Buat sidik jari SHA-256 dan MD5 untuk kunci publik OpenSSH, baris authorized_keys, dan blok kunci publik SSH2.",
      },
      it: {
        name: "Fingerprint della chiave pubblica SSH",
        description:
          "Genera fingerprint SHA-256 e MD5 per chiavi pubbliche OpenSSH, righe authorized_keys e blocchi di chiavi pubbliche SSH2.",
      },
      ja: {
        name: "SSH 公開鍵フィンガープリント",
        description:
          "OpenSSH 公開鍵、authorized_keys の行、SSH2 公開鍵ブロックから SHA-256 と MD5 のフィンガープリントを生成します。",
      },
      ko: {
        name: "SSH 공개 키 지문",
        description:
          "OpenSSH 공개 키, authorized_keys 줄, SSH2 공개 키 블록의 SHA-256 및 MD5 지문을 생성합니다.",
      },
      ms: {
        name: "Cap Jari Kunci Awam SSH",
        description:
          "Jana cap jari SHA-256 dan MD5 untuk kunci awam OpenSSH, baris authorized_keys, dan blok kunci awam SSH2.",
      },
      nl: {
        name: "SSH Public Key Fingerprint",
        description:
          "Genereer SHA-256- en MD5-fingerprints voor OpenSSH-public keys, authorized_keys-regels en SSH2-public-key-blokken.",
      },
      no: {
        name: "SSH offentlig nøkkelfingeravtrykk",
        description:
          "Generer SHA-256- og MD5-fingeravtrykk for offentlige OpenSSH-nøkler, authorized_keys-linjer og SSH2-blokker med offentlige nøkler.",
      },
      pl: {
        name: "Odcisk klucza publicznego SSH",
        description:
          "Generuj odciski SHA-256 i MD5 dla kluczy publicznych OpenSSH, wierszy authorized_keys oraz bloków kluczy publicznych SSH2.",
      },
      pt: {
        name: "Impressão digital de chave pública SSH",
        description:
          "Gere impressões digitais SHA-256 e MD5 para chaves públicas OpenSSH, linhas de authorized_keys e blocos de chave pública SSH2.",
      },
      ru: {
        name: "Отпечаток открытого ключа SSH",
        description:
          "Создавайте отпечатки SHA-256 и MD5 для открытых ключей OpenSSH, строк authorized_keys и блоков открытых ключей SSH2.",
      },
      sv: {
        name: "SSH Public Key Fingerprint",
        description:
          "Generera SHA-256- och MD5-fingeravtryck för publika OpenSSH-nycklar, authorized_keys-rader och SSH2-block med publika nycklar.",
      },
      th: {
        name: "ลายนิ้วมือคีย์สาธารณะ SSH",
        description:
          "สร้างลายนิ้วมือ SHA-256 และ MD5 สำหรับคีย์สาธารณะ OpenSSH, บรรทัด authorized_keys และบล็อกคีย์สาธารณะ SSH2",
      },
      tr: {
        name: "SSH Ortak Anahtar Parmak İzi",
        description:
          "OpenSSH ortak anahtarları, authorized_keys satırları ve SSH2 ortak anahtar blokları için SHA-256 ve MD5 parmak izleri oluşturun.",
      },
      vi: {
        name: "Vân tay khóa công khai SSH",
        description:
          "Tạo vân tay SHA-256 và MD5 cho khóa công khai OpenSSH, dòng authorized_keys và khối khóa công khai SSH2.",
      },
      "zh-CN": {
        name: "SSH 公钥指纹",
        description:
          "为 OpenSSH 公钥、authorized_keys 行和 SSH2 公钥块生成 SHA-256 与 MD5 指纹。",
      },
      "zh-TW": {
        name: "SSH 公開金鑰指紋",
        description:
          "為 OpenSSH 公開金鑰、authorized_keys 行與 SSH2 公開金鑰區塊產生 SHA-256 和 MD5 指紋。",
      },
    },
  },
  {
    slug: "stopwatch",
    category: "developer",
    icon: "wrench",
    tags: ["time", "stopwatch", "lap", "timer", "elapsed"],
    locales: {
      ar: {
        name: "ساعة إيقاف",
        description:
          "تتبّع الوقت المنقضي باستخدام بدء وإيقاف مؤقت ولفة وإعادة ضبط.",
      },
      de: {
        name: "Stoppuhr",
        description:
          "Erfassen Sie die verstrichene Zeit mit Start-, Pause-, Runden- und Reset-Steuerung.",
      },
      en: {
        name: "Stopwatch",
        description:
          "Track elapsed time with start, pause, lap, and reset controls.",
      },
      es: {
        name: "Cronómetro",
        description:
          "Registra el tiempo transcurrido con controles de iniciar, pausar, vuelta y restablecer.",
      },
      fr: {
        name: "Chronomètre",
        description:
          "Suivez le temps écoulé avec les contrôles démarrer, pause, tour et réinitialisation.",
      },
      he: {
        name: "סטופר",
        description: "עקבו אחר הזמן שחלף עם התחל, השהה, הקפה ואיפוס.",
      },
      hi: {
        name: "स्टॉपवॉच",
        description: "शुरू, रोकें, लैप और रीसेट नियंत्रण के साथ बीता समय ट्रैक करें।",
      },
      id: {
        name: "Stopwatch",
        description:
          "Lacak waktu berlalu dengan kontrol mulai, jeda, putaran, dan reset.",
      },
      it: {
        name: "Cronometro",
        description:
          "Tieni traccia del tempo trascorso con avvio, pausa, giro e reset.",
      },
      ja: {
        name: "ストップウォッチ",
        description:
          "開始、停止（一時停止）、ラップ、リセットで経過時間を計測します。",
      },
      ko: {
        name: "스톱워치",
        description: "시작, 일시정지, 랩, 초기화로 경과 시간을 기록합니다.",
      },
      ms: {
        name: "Jam randik",
        description:
          "Jejak masa berlalu dengan mula, jeda, pusingan, dan set semula.",
      },
      nl: {
        name: "Stopwatch",
        description:
          "Houd de verstreken tijd bij met start-, pauze-, ronde- en resetknoppen.",
      },
      no: {
        name: "Stoppeklokke",
        description:
          "Følg med på medgått tid med start, pause, runde og nullstill.",
      },
      pl: {
        name: "Stoper",
        description:
          "Śledź czas upływu za pomocą startu, pauzy, okrążenia i resetu.",
      },
      pt: {
        name: "Cronômetro",
        description:
          "Acompanhe o tempo decorrido com iniciar, pausar, volta e redefinir.",
      },
      ru: {
        name: "Секундомер",
        description:
          "Измеряйте прошедшее время с помощью старта, паузы, круга и сброса.",
      },
      sv: {
        name: "Stoppur",
        description: "Följ förloppstid med start, paus, varv och återställ.",
      },
      th: {
        name: "นาฬิกาจับเวลา",
        description: "ติดตามเวลาที่ผ่านไปด้วยเริ่ม หยุดชั่วคราว รอบ และรีเซ็ต",
      },
      tr: {
        name: "Kronometre",
        description:
          "Başlat, duraklat, tur ve sıfırla kontrolleriyle geçen süreyi takip edin.",
      },
      vi: {
        name: "Đồng hồ bấm giờ",
        description:
          "Theo dõi thời gian đã trôi qua với bắt đầu, tạm dừng, vòng và đặt lại.",
      },
      "zh-CN": {
        name: "秒表",
        description: "使用开始、暂停、计次和重置控制来记录经过的时间。",
      },
      "zh-TW": {
        name: "秒錶",
        description: "使用開始、暫停、計次和重置控制來記錄經過的時間。",
      },
    },
  },
  {
    slug: "svg-to-image-converter",
    category: "image",
    icon: "image",
    tags: ["image", "svg", "converter", "png", "jpeg", "webp"],
    locales: {
      ar: {
        name: "محول SVG إلى صورة",
        description: "حوّل ملفات SVG إلى صور PNG أو JPEG أو WebP",
      },
      de: {
        name: "SVG-zu-Bild-Konverter",
        description:
          "Konvertieren Sie SVG-Dateien in PNG-, JPEG- oder WebP-Bilder",
      },
      en: {
        name: "SVG to Image Converter",
        description: "Convert SVG files to PNG, JPEG, or WebP images",
      },
      es: {
        name: "Convertidor de SVG a imagen",
        description: "Convierte archivos SVG en imágenes PNG, JPEG o WebP",
      },
      fr: {
        name: "Convertisseur SVG en image",
        description:
          "Convertissez des fichiers SVG en images PNG, JPEG ou WebP",
      },
      he: {
        name: "ממיר SVG לתמונה",
        description: "המר קבצי SVG לתמונות PNG, JPEG או WebP",
      },
      hi: {
        name: "SVG से इमेज कन्वर्टर",
        description: "SVG फ़ाइलों को PNG, JPEG या WebP छवियों में बदलें",
      },
      id: {
        name: "Konverter SVG ke gambar",
        description: "Ubah file SVG menjadi gambar PNG, JPEG, atau WebP",
      },
      it: {
        name: "Convertitore da SVG a immagine",
        description: "Converti file SVG in immagini PNG, JPEG o WebP",
      },
      ja: {
        name: "SVG 画像コンバーター",
        description: "SVG ファイルを PNG、JPEG、WebP 画像に変換",
      },
      ko: {
        name: "SVG 이미지 변환기",
        description: "SVG 파일을 PNG, JPEG 또는 WebP 이미지로 변환",
      },
      ms: {
        name: "Penukar SVG ke imej",
        description: "Tukar fail SVG kepada imej PNG, JPEG atau WebP",
      },
      nl: {
        name: "SVG-naar-afbeelding converter",
        description:
          "Converteer SVG-bestanden naar PNG-, JPEG- of WebP-afbeeldingen",
      },
      no: {
        name: "SVG-til-bilde-konverterer",
        description: "Konverter SVG-filer til PNG-, JPEG- eller WebP-bilder",
      },
      pl: {
        name: "Konwerter SVG na obraz",
        description: "Konwertuj pliki SVG na obrazy PNG, JPEG lub WebP",
      },
      pt: {
        name: "Conversor de SVG para imagem",
        description: "Converta arquivos SVG em imagens PNG, JPEG ou WebP",
      },
      ru: {
        name: "Конвертер SVG в изображения",
        description: "Преобразуйте файлы SVG в изображения PNG, JPEG или WebP",
      },
      sv: {
        name: "SVG-till-bild-konverterare",
        description: "Konvertera SVG-filer till PNG-, JPEG- eller WebP-bilder",
      },
      th: {
        name: "ตัวแปลง SVG เป็นรูปภาพ",
        description: "แปลงไฟล์ SVG เป็นรูปภาพ PNG, JPEG หรือ WebP",
      },
      tr: {
        name: "SVG'den Görüntü Dönüştürücü",
        description:
          "SVG dosyalarını PNG, JPEG veya WebP görüntülerine dönüştürün",
      },
      vi: {
        name: "Trình chuyển SVG sang ảnh",
        description: "Chuyển tệp SVG thành ảnh PNG, JPEG hoặc WebP",
      },
      "zh-CN": {
        name: "SVG 转图片转换器",
        description: "将 SVG 文件转换为 PNG、JPEG 或 WebP 图片",
      },
      "zh-TW": {
        name: "SVG 轉圖片轉換器",
        description: "將 SVG 檔案轉換為 PNG、JPEG 或 WebP 圖片",
      },
    },
  },
  {
    slug: "text-diff",
    category: "text",
    icon: "file-text",
    tags: ["text", "diff", "compare", "document", "code", "review"],
    locales: {
      ar: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      de: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      en: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      es: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      fr: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      he: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      hi: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      id: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      it: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      ja: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      ko: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      ms: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      nl: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      no: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      pl: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      pt: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      ru: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      sv: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      th: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      tr: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      vi: {
        name: "Text Diff",
        description:
          "Compare two drafts side by side, inspect changed lines, and export a clean unified diff without leaving the browser.",
      },
      "zh-CN": {
        name: "文本对比",
        description:
          "在浏览器中并排比较两份文本、查看逐行改动，并导出干净的统一 diff。",
      },
      "zh-TW": {
        name: "文字比對",
        description:
          "在瀏覽器中並排比較兩份文本、查看逐行變更，並匯出乾淨的統一 diff。",
      },
    },
  },
  {
    slug: "text-statistics",
    category: "text",
    icon: "file-text",
    tags: [
      "text",
      "statistics",
      "word",
      "count",
      "character",
      "line",
      "paragraph",
    ],
    locales: {
      ar: {
        name: "إحصائيات النص",
        description:
          "تحليل النص للحصول على عدد الأحرف والكلمات والأسطر والفقرات والجمل مع تقدير وقت القراءة",
      },
      de: {
        name: "Textstatistik",
        description:
          "Analysieren Sie Text, um Zeichen-, Wort-, Zeilen-, Absatz- und Satzzählungen mit Lesezeitschätzungen zu erhalten",
      },
      en: {
        name: "Text Statistics",
        description:
          "Turn any draft into a live writing dashboard with multilingual counts, vocabulary signals, structure clues, and reading-time estimates.",
      },
      es: {
        name: "Estadísticas de Texto",
        description:
          "Analiza texto para obtener recuentos de caracteres, palabras, líneas, párrafos y oraciones con estimaciones de tiempo de lectura",
      },
      fr: {
        name: "Statistiques de Texte",
        description:
          "Analysez le texte pour obtenir le nombre de caractères, mots, lignes, paragraphes et phrases avec des estimations de temps de lecture",
      },
      he: {
        name: "סטטיסטיקת טקסט",
        description:
          "נתח טקסט כדי לקבל ספירת תווים, מילים, שורות, פסקאות ומשפטים עם הערכות זמן קריאה",
      },
      hi: {
        name: "टेक्स्ट आँकड़े",
        description:
          "पढ़ने के समय के अनुमान के साथ वर्ण, शब्द, पंक्ति, पैराग्राफ और वाक्य गणना प्राप्त करने के लिए टेक्स्ट का विश्लेषण करें",
      },
      id: {
        name: "Statistik Teks",
        description:
          "Analisis teks untuk mendapatkan jumlah karakter, kata, baris, paragraf, dan kalimat dengan perkiraan waktu baca",
      },
      it: {
        name: "Statistiche del Testo",
        description:
          "Analizza il testo per ottenere conteggi di caratteri, parole, righe, paragrafi e frasi con stime del tempo di lettura",
      },
      ja: {
        name: "テキスト統計",
        description:
          "テキストを分析して、文字数、単語数、行数、段落数、文数と読書時間の見積もりを取得",
      },
      ko: {
        name: "텍스트 통계",
        description:
          "텍스트를 분석하여 문자, 단어, 줄, 단락, 문장 수와 예상 읽기 시간을 확인",
      },
      ms: {
        name: "Statistik Teks",
        description:
          "Analisis teks untuk mendapatkan kiraan aksara, perkataan, baris, perenggan dan ayat dengan anggaran masa membaca",
      },
      nl: {
        name: "Tekststatistieken",
        description:
          "Analyseer tekst om aantallen tekens, woorden, regels, alineas en zinnen te krijgen met leestijdschattingen",
      },
      no: {
        name: "Tekststatistikk",
        description:
          "Analyser tekst for å få antall tegn, ord, linjer, avsnitt og setninger med estimert lesetid",
      },
      pl: {
        name: "Statystyki Tekstu",
        description:
          "Analizuj tekst, aby uzyskać liczbę znaków, słów, wierszy, akapitów i zdań z szacowanym czasem czytania",
      },
      pt: {
        name: "Estatísticas de Texto",
        description:
          "Analise o texto para obter contagens de caracteres, palavras, linhas, parágrafos e frases com estimativas de tempo de leitura",
      },
      ru: {
        name: "Статистика Текста",
        description:
          "Анализ текста для подсчёта символов, слов, строк, абзацев и предложений с оценкой времени чтения",
      },
      sv: {
        name: "Textstatistik",
        description:
          "Analysera text för att få antal tecken, ord, rader, stycken och meningar med uppskattad lästid",
      },
      th: {
        name: "สถิติข้อความ",
        description:
          "วิเคราะห์ข้อความเพื่อรับจำนวนตัวอักษร คำ บรรทัด ย่อหน้า และประโยค พร้อมประมาณเวลาอ่าน",
      },
      tr: {
        name: "Metin İstatistikleri",
        description:
          "Okuma süresi tahminleriyle birlikte karakter, kelime, satır, paragraf ve cümle sayılarını almak için metni analiz edin",
      },
      vi: {
        name: "Thống Kê Văn Bản",
        description:
          "Phân tích văn bản để đếm ký tự, từ, dòng, đoạn văn và câu cùng với ước tính thời gian đọc",
      },
      "zh-CN": {
        name: "文本统计",
        description:
          "把任意草稿变成实时写作分析面板，查看多语言计数、词汇信号、结构线索和阅读时长估算。",
      },
      "zh-TW": {
        name: "文字統計",
        description:
          "把任何草稿變成即時寫作分析面板，查看多語言計數、詞彙訊號、結構線索與閱讀時間估算。",
      },
    },
  },
  {
    slug: "time-diff-calculator",
    category: "time",
    icon: "clock3",
    tags: ["time", "difference", "duration", "calculator", "timezone", "utc"],
    locales: {
      ar: {
        name: "حاسبة فرق الوقت",
        description:
          "قارن بين وقتين محليين في منطقتين زمنيتين مختلفتين واحصل على فرق الوقت بالإشارة والقيمة المطلقة وبصيغة ISO 8601 وبالوحدات الإجمالية.",
      },
      de: {
        name: "Zeitdifferenz-Rechner",
        description:
          "Vergleichen Sie zwei lokale Zeiten in verschiedenen Zeitzonen und erhalten Sie die Differenz mit Vorzeichen, absolut, als ISO 8601 und in Gesamteinheiten.",
      },
      en: {
        name: "Time Difference Calculator",
        description:
          "Compare two local times across time zones and get signed, absolute, ISO 8601, and total-unit differences.",
      },
      es: {
        name: "Calculadora de diferencia de tiempo",
        description:
          "Compara dos horas locales en distintas zonas horarias y obtén diferencias con signo, absolutas, en ISO 8601 y en unidades totales.",
      },
      fr: {
        name: "Calculateur de différence de temps",
        description:
          "Comparez deux heures locales dans différents fuseaux horaires et obtenez des écarts signés, absolus, en ISO 8601 et en unités totales.",
      },
      he: {
        name: "מחשבון הפרש זמן",
        description:
          "השוו בין שני זמנים מקומיים באזורי זמן שונים וקבלו את ההפרש עם סימן, בערך מוחלט, בפורמט ISO 8601 וביחידות כוללות.",
      },
      hi: {
        name: "समय अंतर कैलकुलेटर",
        description:
          "अलग-अलग समय क्षेत्रों के दो स्थानीय समयों की तुलना करें और signed, absolute, ISO 8601 तथा कुल इकाइयों में अंतर पाएं।",
      },
      id: {
        name: "Kalkulator selisih waktu",
        description:
          "Bandingkan dua waktu lokal di zona waktu berbeda dan dapatkan selisih bertanda, absolut, ISO 8601, dan dalam satuan total.",
      },
      it: {
        name: "Calcolatore della differenza di tempo",
        description:
          "Confronta due orari locali in fusi orari diversi e ottieni la differenza con segno, assoluta, in ISO 8601 e in unità totali.",
      },
      ja: {
        name: "時間差計算ツール",
        description:
          "異なるタイムゾーンにある2つのローカル時刻を比較し、符号付き・絶対値・ISO 8601・合計単位の差分を求めます。",
      },
      ko: {
        name: "시간 차이 계산기",
        description:
          "서로 다른 시간대의 두 로컬 시간을 비교하고 부호 있는 차이, 절대 차이, ISO 8601, 총 단위 차이를 계산합니다.",
      },
      ms: {
        name: "Kalkulator perbezaan masa",
        description:
          "Bandingkan dua masa setempat dalam zon masa berbeza dan dapatkan perbezaan bertanda, mutlak, ISO 8601 dan dalam unit jumlah.",
      },
      nl: {
        name: "Tijdsverschilcalculator",
        description:
          "Vergelijk twee lokale tijden in verschillende tijdzones en krijg verschillen met teken, absolute verschillen, ISO 8601 en totale eenheden.",
      },
      no: {
        name: "Kalkulator for tidsforskjell",
        description:
          "Sammenlign to lokale tider i ulike tidssoner og få forskjeller med fortegn, absolutte forskjeller, som ISO 8601 og i totale enheter.",
      },
      pl: {
        name: "Kalkulator różnicy czasu",
        description:
          "Porównuj dwa czasy lokalne w różnych strefach czasowych i otrzymuj różnicę ze znakiem, bezwzględną, w ISO 8601 i w jednostkach łącznych.",
      },
      pt: {
        name: "Calculadora de diferença de tempo",
        description:
          "Compare dois horários locais em fusos diferentes e obtenha diferenças com sinal, absolutas, em ISO 8601 e em unidades totais.",
      },
      ru: {
        name: "Калькулятор разницы во времени",
        description:
          "Сравнивайте два локальных времени в разных часовых поясах и получайте разницу со знаком, абсолютную, в ISO 8601 и в суммарных единицах.",
      },
      sv: {
        name: "Tidsdifferenskalkylator",
        description:
          "Jämför två lokala tider i olika tidszoner och få skillnader med tecken, absoluta skillnader, ISO 8601 och totala enheter.",
      },
      th: {
        name: "เครื่องคำนวณความต่างของเวลา",
        description:
          "เปรียบเทียบเวลาท้องถิ่นสองค่าในเขตเวลาที่ต่างกัน แล้วดูผลต่างแบบมีเครื่องหมาย แบบค่าสัมบูรณ์ แบบ ISO 8601 และแบบหน่วยรวม",
      },
      tr: {
        name: "Zaman farkı hesaplayıcısı",
        description:
          "Farklı saat dilimlerindeki iki yerel saati karşılaştırın ve işaretli, mutlak, ISO 8601 ve toplam birim farklarını görün.",
      },
      vi: {
        name: "Trình tính chênh lệch thời gian",
        description:
          "So sánh hai thời điểm địa phương ở các múi giờ khác nhau và nhận chênh lệch có dấu, tuyệt đối, theo ISO 8601 và theo tổng đơn vị.",
      },
      "zh-CN": {
        name: "时间差计算器",
        description:
          "比较不同时区中的两个本地时间，计算带符号、绝对值、ISO 8601 和总单位形式的时间差。",
      },
      "zh-TW": {
        name: "時間差計算器",
        description:
          "比較不同時區中的兩個本地時間，計算帶符號、絕對值、ISO 8601 與總單位形式的時間差。",
      },
    },
  },
  {
    slug: "time-zone-converter",
    category: "time",
    icon: "globe",
    tags: ["time", "timezone", "converter", "utc", "offset", "dst", "clock"],
    locales: {
      ar: {
        name: "محول المناطق الزمنية",
        description:
          "حوّل التاريخ والوقت بين المناطق الزمنية مع دعم التوقيت الصيفي. قارن الإزاحات وانسخ تنسيقات ISO/UTC.",
      },
      de: {
        name: "Zeitzonen-Konverter",
        description:
          "Wandelt Datum und Uhrzeit zwischen Zeitzonen mit Sommerzeit-Unterstützung um. Vergleiche Offsets und kopiere ISO/UTC-Formate.",
      },
      en: {
        name: "Time Zone Converter",
        description:
          "Convert a date and time between time zones with daylight saving support. Compare offsets and copy ISO/UTC formats.",
      },
      es: {
        name: "Convertidor de Zona Horaria",
        description:
          "Convierte fecha y hora entre zonas horarias con soporte de horario de verano. Compara desfases y copia formatos ISO/UTC.",
      },
      fr: {
        name: "Convertisseur de fuseau horaire",
        description:
          "Convertit une date et une heure entre fuseaux horaires avec prise en charge de l'heure d'été. Compare les décalages et copie les formats ISO/UTC.",
      },
      he: {
        name: "ממיר אזורי זמן",
        description:
          "המר תאריך ושעה בין אזורי זמן עם תמיכה בשעון קיץ. השווה היסטים והעתק פורמטים ISO/UTC.",
      },
      hi: {
        name: "समय क्षेत्र परिवर्तक",
        description:
          "डे-लाइट सेविंग के समर्थन के साथ समय क्षेत्रों के बीच दिनांक और समय रूपांतरित करें। ऑफ़सेट की तुलना करें और ISO/UTC प्रारूप कॉपी करें।",
      },
      id: {
        name: "Konverter Zona Waktu",
        description:
          "Konversi tanggal dan waktu antar zona waktu dengan dukungan daylight saving. Bandingkan offset dan salin format ISO/UTC.",
      },
      it: {
        name: "Convertitore di fuso orario",
        description:
          "Converte data e ora tra fusi orari con supporto dell'ora legale. Confronta gli offset e copia i formati ISO/UTC.",
      },
      ja: {
        name: "タイムゾーン変換",
        description:
          "夏時間に対応して日時をタイムゾーン間で変換します。オフセットを比較し、ISO/UTC 形式をコピーできます。",
      },
      ko: {
        name: "시간대 변환기",
        description:
          "일광 절약 시간제를 지원하여 시간대를 넘나드는 날짜/시간을 변환합니다. 오프셋을 비교하고 ISO/UTC 형식을 복사할 수 있습니다.",
      },
      ms: {
        name: "Penukar Zon Masa",
        description:
          "Tukar tarikh dan masa antara zon masa dengan sokongan waktu musim panas. Bandingkan ofset dan salin format ISO/UTC.",
      },
      nl: {
        name: "Tijdzoneconverter",
        description:
          "Converteer datum en tijd tussen tijdzones met ondersteuning voor zomertijd. Vergelijk offsets en kopieer ISO/UTC-indelingen.",
      },
      no: {
        name: "Tidssonekonverterer",
        description:
          "Konverter dato og tid mellom tidssoner med støtte for sommertid. Sammenlign offset og kopier ISO/UTC-formater.",
      },
      pl: {
        name: "Konwerter stref czasowych",
        description:
          "Konwertuje datę i godzinę między strefami czasowymi z obsługą czasu letniego. Porównuj przesunięcia i kopiuj formaty ISO/UTC.",
      },
      pt: {
        name: "Conversor de fuso horário",
        description:
          "Converte data e hora entre fusos horários com suporte ao horário de verão. Compare offsets e copie formatos ISO/UTC.",
      },
      ru: {
        name: "Конвертер часовых поясов",
        description:
          "Преобразует дату и время между часовыми поясами с учетом летнего времени. Сравнивайте смещения и копируйте форматы ISO/UTC.",
      },
      sv: {
        name: "Tidszonskonverterare",
        description:
          "Konverterar datum och tid mellan tidszoner med stöd för sommartid. Jämför offset och kopiera ISO/UTC-format.",
      },
      th: {
        name: "ตัวแปลงเขตเวลา",
        description:
          "แปลงวันที่และเวลาระหว่างเขตเวลา พร้อมรองรับเวลาออมแสง เปรียบเทียบออฟเซ็ตและคัดลอกรูปแบบ ISO/UTC",
      },
      tr: {
        name: "Saat Dilimi Dönüştürücü",
        description:
          "Yaz saati desteğiyle tarih ve saati saat dilimleri arasında dönüştürür. Ofsetleri karşılaştırın ve ISO/UTC biçimlerini kopyalayın.",
      },
      vi: {
        name: "Bộ chuyển đổi múi giờ",
        description:
          "Chuyển đổi ngày giờ giữa các múi giờ với hỗ trợ giờ mùa hè. So sánh độ lệch và sao chép định dạng ISO/UTC.",
      },
      "zh-CN": {
        name: "时区转换器",
        description:
          "在不同时区之间转换日期和时间，支持夏令时。对比时区偏移并复制 ISO/UTC 格式。",
      },
      "zh-TW": {
        name: "時區轉換器",
        description:
          "在不同時區之間轉換日期與時間，支援夏令時間。比較時區偏移並複製 ISO/UTC 格式。",
      },
    },
  },
  {
    slug: "timer",
    category: "time",
    icon: "clock3",
    tags: ["time", "timer", "countdown", "alarm", "fullscreen"],
    locales: {
      ar: {
        name: "مؤقّت",
        description:
          "اضبط عدادًا تنازليًا مع صوت واهتزاز وإشعارات المتصفح بشكل اختياري.",
      },
      de: {
        name: "Timer",
        description:
          "Stellen Sie einen Countdown mit optionalem Ton, Vibration und Browser-Benachrichtigungen ein.",
      },
      en: {
        name: "Timer",
        description:
          "Set a countdown timer with optional sound, vibration, and browser notifications.",
      },
      es: {
        name: "Temporizador",
        description:
          "Configura una cuenta atrás con sonido, vibración y notificaciones del navegador opcionales.",
      },
      fr: {
        name: "Minuteur",
        description:
          "Réglez un compte à rebours avec son, vibration et notifications du navigateur en option.",
      },
      he: {
        name: "טיימר",
        description: "הגדר ספירה לאחור עם צליל, רטט והתראות דפדפן אופציונליים.",
      },
      hi: {
        name: "टाइमर",
        description:
          "काउंटडाउन टाइमर सेट करें, और चाहें तो ध्वनि, कंपन और ब्राउज़र सूचनाएँ सक्षम करें।",
      },
      id: {
        name: "Timer",
        description:
          "Atur hitung mundur dengan suara, getaran, dan notifikasi browser opsional.",
      },
      it: {
        name: "Timer",
        description:
          "Imposta un conto alla rovescia con suono, vibrazione e notifiche del browser opzionali.",
      },
      ja: {
        name: "タイマー",
        description:
          "カウントダウンを設定し、任意で音・振動・ブラウザ通知を利用できます。",
      },
      ko: {
        name: "타이머",
        description:
          "카운트다운을 설정하고 필요 시 소리, 진동, 브라우저 알림을 사용합니다.",
      },
      ms: {
        name: "Pemasa",
        description:
          "Tetapkan kira detik dengan bunyi, getaran dan pemberitahuan pelayar secara pilihan.",
      },
      nl: {
        name: "Timer",
        description:
          "Stel een afteltimer in met optioneel geluid, trilling en browsermeldingen.",
      },
      no: {
        name: "Nedtelling",
        description:
          "Still inn en nedtelling med valgfri lyd, vibrasjon og nettleservarsler.",
      },
      pl: {
        name: "Minutnik",
        description:
          "Ustaw odliczanie z opcjonalnym dźwiękiem, wibracją i powiadomieniami przeglądarki.",
      },
      pt: {
        name: "Temporizador",
        description:
          "Defina um cronômetro regressivo com som, vibração e notificações do navegador opcionais.",
      },
      ru: {
        name: "Таймер",
        description:
          "Настройте обратный отсчёт с дополнительным звуком, вибрацией и уведомлениями браузера.",
      },
      sv: {
        name: "Timer",
        description:
          "Ställ in en nedräkning med valfritt ljud, vibration och webbläsaraviseringar.",
      },
      th: {
        name: "ตัวตั้งเวลา",
        description:
          "ตั้งเวลานับถอยหลังพร้อมเสียง การสั่น และการแจ้งเตือนจากเบราว์เซอร์ตามต้องการ",
      },
      tr: {
        name: "Zamanlayıcı",
        description:
          "İsteğe bağlı ses, titreşim ve tarayıcı bildirimleriyle bir geri sayım ayarlayın.",
      },
      vi: {
        name: "Bộ hẹn giờ",
        description:
          "Đặt đếm ngược với âm thanh, rung và thông báo trình duyệt tùy chọn.",
      },
      "zh-CN": {
        name: "倒计时器",
        description: "设置倒计时，结束时可使用提示音、震动和浏览器通知。",
      },
      "zh-TW": {
        name: "倒數計時器",
        description: "設定倒數計時，結束時可使用提示音、震動與瀏覽器通知。",
      },
    },
  },
  {
    slug: "toml-to-json-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "json", "toml", "converter"],
    locales: {
      ar: {
        name: "محول TOML → JSON",
        description:
          "حوّل TOML إلى JSON. الصق TOML أو استورد ملفًا؛ معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "TOML → JSON Konverter",
        description:
          "Wandelt TOML in JSON um. TOML einfügen oder Datei importieren; Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "TOML → JSON Converter",
        description:
          "Convert TOML to JSON. Paste TOML or import a file; preview, copy, and download.",
      },
      es: {
        name: "Convertidor TOML → JSON",
        description:
          "Convierte TOML a JSON. Pega TOML o importa un archivo; previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur TOML → JSON",
        description:
          "Convertissez TOML en JSON. Collez du TOML ou importez un fichier ; aperçu, copie et téléchargement.",
      },
      he: {
        name: "ממיר TOML → JSON",
        description:
          "המרת TOML ל‑JSON. הדביקו TOML או ייבאו קובץ; תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "TOML → JSON परिवर्तक",
        description:
          "TOML को JSON में बदलें। TOML पेस्ट करें या फ़ाइल आयात करें; पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi TOML → JSON",
        description:
          "Konversi TOML ke JSON. Tempel TOML atau impor berkas; pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore TOML → JSON",
        description:
          "Converti TOML in JSON. Incolla TOML o importa un file; anteprima, copia e download.",
      },
      ja: {
        name: "TOML → JSON 変換",
        description:
          "TOML を JSON に変換。TOML を貼り付けるかファイルを読み込み、プレビュー・コピー・ダウンロード。",
      },
      ko: {
        name: "TOML → JSON 변환기",
        description:
          "TOML을 JSON로 변환합니다. TOML 붙여넣기 또는 파일 가져오기; 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Penukar TOML → JSON",
        description:
          "Tukar TOML kepada JSON. Tampal TOML atau import fail; pratonton, salin dan muat turun.",
      },
      nl: {
        name: "TOML → JSON-converter",
        description:
          "Zet TOML om naar JSON. Plak TOML of importeer een bestand; bekijk, kopieer en download.",
      },
      no: {
        name: "TOML → JSON-omformer",
        description:
          "Konverter TOML til JSON. Lim inn TOML eller importer en fil; forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter TOML → JSON",
        description:
          "Konwertuj TOML na JSON. Wklej TOML lub zaimportuj plik; podgląd, kopiowanie i pobieranie.",
      },
      pt: {
        name: "Conversor TOML → JSON",
        description:
          "Converta TOML para JSON. Cole TOML ou importe um arquivo; visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер TOML → JSON",
        description:
          "Преобразуйте TOML в JSON. Вставьте TOML или импортируйте файл; просмотр, копирование и загрузка.",
      },
      sv: {
        name: "TOML → JSON-omvandlare",
        description:
          "Konvertera TOML till JSON. Klistra in TOML eller importera en fil; förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง TOML → JSON",
        description:
          "แปลง TOML เป็น JSON วาง TOML หรือ นำเข้าไฟล์; ดูตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "TOML → JSON Dönüştürücü",
        description:
          "TOML’u JSON’a dönüştürün. TOML yapıştırın veya dosya içe aktarın; önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình chuyển TOML → JSON",
        description:
          "Chuyển TOML sang JSON. Dán TOML hoặc nhập tệp; xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "TOML 转 JSON 转换器",
        description:
          "将 TOML 转为 JSON。粘贴 TOML 或导入文件；预览、复制并下载。",
      },
      "zh-TW": {
        name: "TOML 轉 JSON 轉換器",
        description:
          "將 TOML 轉為 JSON。貼上 TOML 或匯入檔案；預覽、複製並下載。",
      },
    },
  },
  {
    slug: "toml-to-yaml-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "toml", "yaml", "converter"],
    locales: {
      ar: {
        name: "محول TOML → YAML",
        description:
          "حوّل TOML إلى YAML. الصق TOML أو استورد ملفًا؛ معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "TOML → YAML Konverter",
        description:
          "Wandelt TOML in YAML um. TOML einfügen oder Datei importieren; Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "TOML → YAML Converter",
        description:
          "Convert TOML to YAML. Paste TOML or import a file; preview, copy, and download.",
      },
      es: {
        name: "Convertidor TOML → YAML",
        description:
          "Convierte TOML a YAML. Pega TOML o importa un archivo; previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur TOML → YAML",
        description:
          "Convertissez TOML en YAML. Collez du TOML ou importez un fichier ; aperçu, copie et téléchargement.",
      },
      he: {
        name: "ממיר TOML → YAML",
        description:
          "המרת TOML ל‑YAML. הדביקו TOML או ייבאו קובץ; תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "TOML → YAML परिवर्तक",
        description:
          "TOML को YAML में बदलें। TOML पेस्ट करें या फ़ाइल आयात करें; पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi TOML → YAML",
        description:
          "Konversi TOML ke YAML. Tempel TOML atau impor berkas; pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore TOML → YAML",
        description:
          "Converti TOML in YAML. Incolla TOML o importa un file; anteprima, copia e download.",
      },
      ja: {
        name: "TOML → YAML 変換",
        description:
          "TOML を YAML に変換。TOML を貼り付けるかファイルを読み込み、プレビュー・コピー・ダウンロード。",
      },
      ko: {
        name: "TOML → YAML 변환기",
        description:
          "TOML을 YAML로 변환합니다. TOML 붙여넣기 또는 파일 가져오기; 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Penukar TOML → YAML",
        description:
          "Tukar TOML kepada YAML. Tampal TOML atau import fail; pratonton, salin dan muat turun.",
      },
      nl: {
        name: "TOML → YAML-converter",
        description:
          "Zet TOML om naar YAML. Plak TOML of importeer een bestand; bekijk, kopieer en download.",
      },
      no: {
        name: "TOML → YAML-omformer",
        description:
          "Konverter TOML til YAML. Lim inn TOML eller importer en fil; forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter TOML → YAML",
        description:
          "Konwertuj TOML na YAML. Wklej TOML lub zaimportuj plik; podgląd, kopiowanie i pobieranie.",
      },
      pt: {
        name: "Conversor TOML → YAML",
        description:
          "Converta TOML para YAML. Cole TOML ou importe um arquivo; visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер TOML → YAML",
        description:
          "Преобразуйте TOML в YAML. Вставьте TOML или импортируйте файл; просмотр, копирование и загрузка.",
      },
      sv: {
        name: "TOML → YAML-omvandlare",
        description:
          "Konvertera TOML till YAML. Klistra in TOML eller importera en fil; förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง TOML → YAML",
        description:
          "แปลง TOML เป็น YAML วาง TOML หรือ นำเข้าไฟล์; ดูตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "TOML → YAML Dönüştürücü",
        description:
          "TOML’u YAML’a dönüştürün. TOML yapıştırın veya dosya içe aktarın; önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình chuyển TOML → YAML",
        description:
          "Chuyển TOML sang YAML. Dán TOML hoặc nhập tệp; xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "TOML 转 YAML 转换器",
        description:
          "将 TOML 转为 YAML。粘贴 TOML 或导入文件；预览、复制并下载。",
      },
      "zh-TW": {
        name: "TOML 轉 YAML 轉換器",
        description:
          "將 TOML 轉為 YAML。貼上 TOML 或匯入檔案；預覽、複製並下載。",
      },
    },
  },
  {
    slug: "unicode-escape-unescape",
    category: "web",
    icon: "globe",
    tags: ["unicode", "escape", "unescape", "encoding", "text"],
    locales: {
      ar: {
        name: "تحويل Unicode",
        description:
          "تحويل أحرف Unicode من وإلى صيغ متعددة بما في ذلك \\uXXXX و \\u{XXXXX} وكيانات HTML وترميز URL وترميز U+XXXX",
      },
      de: {
        name: "Unicode Escape / Unescape",
        description:
          "Unicode-Zeichen in verschiedenen Formaten escapen und unescapen, einschließlich \\uXXXX, \\u{XXXXX}, HTML-Entitäten, URL-Kodierung und U+XXXX-Notation",
      },
      en: {
        name: "Unicode Escape / Unescape",
        description:
          "Escape and unescape Unicode characters in various formats including \\uXXXX, \\u{XXXXX}, HTML entities, URL encoding, and U+XXXX notation",
      },
      es: {
        name: "Escape / Unescape Unicode",
        description:
          "Escapar y desescapar caracteres Unicode en varios formatos incluyendo \\uXXXX, \\u{XXXXX}, entidades HTML, codificación URL y notación U+XXXX",
      },
      fr: {
        name: "Échappement / Désechappement Unicode",
        description:
          "Échapper et désechapper les caractères Unicode dans divers formats incluant \\uXXXX, \\u{XXXXX}, entités HTML, encodage URL et notation U+XXXX",
      },
      he: {
        name: "Unicode Escape / Unescape",
        description:
          "המרת תווי Unicode לפורמטים שונים כולל \\uXXXX, \\u{XXXXX}, ישויות HTML, קידוד URL וסימון U+XXXX",
      },
      hi: {
        name: "Unicode एस्केप / अनएस्केप",
        description:
          "\\uXXXX, \\u{XXXXX}, HTML एंटिटी, URL एन्कोडिंग और U+XXXX नोटेशन सहित विभिन्न प्रारूपों में Unicode वर्णों को एस्केप और अनएस्केप करें",
      },
      id: {
        name: "Unicode Escape / Unescape",
        description:
          "Escape dan unescape karakter Unicode dalam berbagai format termasuk \\uXXXX, \\u{XXXXX}, entitas HTML, encoding URL, dan notasi U+XXXX",
      },
      it: {
        name: "Escape / Unescape Unicode",
        description:
          "Esegui escape e unescape di caratteri Unicode in vari formati inclusi \\uXXXX, \\u{XXXXX}, entità HTML, codifica URL e notazione U+XXXX",
      },
      ja: {
        name: "Unicode エスケープ / アンエスケープ",
        description:
          "\\uXXXX、\\u{XXXXX}、HTML エンティティ、URL エンコーディング、U+XXXX 表記を含む様々な形式で Unicode 文字をエスケープ・アンエスケープ",
      },
      ko: {
        name: "Unicode 이스케이프 / 언이스케이프",
        description:
          "\\uXXXX, \\u{XXXXX}, HTML 엔티티, URL 인코딩, U+XXXX 표기법을 포함한 다양한 형식으로 Unicode 문자를 이스케이프 및 언이스케이프",
      },
      ms: {
        name: "Unicode Escape / Unescape",
        description:
          "Escape dan unescape aksara Unicode dalam pelbagai format termasuk \\uXXXX, \\u{XXXXX}, entiti HTML, pengekodan URL dan notasi U+XXXX",
      },
      nl: {
        name: "Unicode Escape / Unescape",
        description:
          "Unicode-tekens escapen en unescapen in verschillende formaten waaronder \\uXXXX, \\u{XXXXX}, HTML-entiteiten, URL-codering en U+XXXX-notatie",
      },
      no: {
        name: "Unicode Escape / Unescape",
        description:
          "Escape og unescape Unicode-tegn i ulike formater inkludert \\uXXXX, \\u{XXXXX}, HTML-entiteter, URL-koding og U+XXXX-notasjon",
      },
      pl: {
        name: "Unicode Escape / Unescape",
        description:
          "Kodowanie i dekodowanie znaków Unicode w różnych formatach w tym \\uXXXX, \\u{XXXXX}, encje HTML, kodowanie URL i notacja U+XXXX",
      },
      pt: {
        name: "Escape / Unescape Unicode",
        description:
          "Escape e unescape de caracteres Unicode em vários formatos incluindo \\uXXXX, \\u{XXXXX}, entidades HTML, codificação URL e notação U+XXXX",
      },
      ru: {
        name: "Unicode экранирование / деэкранирование",
        description:
          "Экранирование и деэкранирование символов Unicode в различных форматах, включая \\uXXXX, \\u{XXXXX}, HTML-сущности, URL-кодирование и нотацию U+XXXX",
      },
      sv: {
        name: "Unicode Escape / Unescape",
        description:
          "Escape och unescape Unicode-tecken i olika format inklusive \\uXXXX, \\u{XXXXX}, HTML-entiteter, URL-kodning och U+XXXX-notation",
      },
      th: {
        name: "Unicode Escape / Unescape",
        description:
          "แปลงอักขระ Unicode ไปและกลับในรูปแบบต่างๆ รวมถึง \\uXXXX, \\u{XXXXX}, HTML entities, การเข้ารหัส URL และสัญลักษณ์ U+XXXX",
      },
      tr: {
        name: "Unicode Kaçış / Kaçış Geri Alma",
        description:
          "\\uXXXX, \\u{XXXXX}, HTML varlıkları, URL kodlama ve U+XXXX gösterimi dahil çeşitli formatlarda Unicode karakterlerini kaçış ve kaçış geri alma",
      },
      vi: {
        name: "Unicode Escape / Unescape",
        description:
          "Chuyển đổi ký tự Unicode sang và từ các định dạng bao gồm \\uXXXX, \\u{XXXXX}, thực thể HTML, mã hóa URL và ký hiệu U+XXXX",
      },
      "zh-CN": {
        name: "Unicode 转义 / 反转义",
        description:
          "将 Unicode 字符转义和反转义为多种格式，包括 \\uXXXX、\\u{XXXXX}、HTML 实体、URL 编码和 U+XXXX 表示法",
      },
      "zh-TW": {
        name: "Unicode 轉義 / 反轉義",
        description:
          "將 Unicode 字元轉義和反轉義為多種格式，包括 \\uXXXX、\\u{XXXXX}、HTML 實體、URL 編碼和 U+XXXX 表示法",
      },
    },
  },
  {
    slug: "unicode-invisible-character-checker",
    category: "text",
    icon: "search",
    tags: ["unicode", "text", "invisible", "bidi", "whitespace"],
    locales: {
      ar: {
        name: "أداة فحص الأحرف غير المرئية في Unicode",
        description:
          "تكشف أحرف العرض الصفري وعناصر التحكم ثنائية الاتجاه والمسافات الخاصة وتصدر نسخة منظفة.",
      },
      de: {
        name: "Unicode-Unsichtbarzeichen-Prüfer",
        description:
          "Erkennt Nullbreite-, Bidi-Steuer- und Sonderleerzeichen und exportiert eine bereinigte Version.",
      },
      en: {
        name: "Unicode Invisible Character Checker",
        description:
          "Detect zero-width, bidi control, and special whitespace characters, then export a cleaned version.",
      },
      es: {
        name: "Comprobador de caracteres invisibles Unicode",
        description:
          "Detecta caracteres de ancho cero, control bidi y espacios especiales, y exporta una versión limpia.",
      },
      fr: {
        name: "Vérificateur de caractères invisibles Unicode",
        description:
          "Détecte les caractères à largeur nulle, les contrôles bidi et les espaces spéciaux, puis exporte une version nettoyée.",
      },
      he: {
        name: "בודק תווים בלתי נראים של Unicode",
        description:
          "מזהה תווים ברוחב אפס, בקרות bidi ורווחים מיוחדים, ומייצא גרסה נקייה.",
      },
      hi: {
        name: "यूनिकोड अदृश्य वर्ण जाँचक",
        description:
          "शून्य-चौड़ाई, बिडी नियंत्रण और विशेष रिक्त वर्णों का पता लगाता है और साफ़ संस्करण निर्यात करता है।",
      },
      id: {
        name: "Pemeriksa karakter tak terlihat Unicode",
        description:
          "Mendeteksi karakter lebar nol, kontrol bidi, dan spasi khusus, lalu mengekspor versi yang dibersihkan.",
      },
      it: {
        name: "Verificatore di caratteri invisibili Unicode",
        description:
          "Rileva caratteri a larghezza zero, controlli bidi e spazi speciali ed esporta una versione pulita.",
      },
      ja: {
        name: "Unicode不可視文字チェッカー",
        description:
          "ゼロ幅、双方向制御、特殊空白文字を検出し、クリーンなバージョンをエクスポートします。",
      },
      ko: {
        name: "유니코드 보이지 않는 문자 검사기",
        description:
          "제로 폭, 양방향 제어 및 특수 공백 문자를 감지하고 정리된 버전을 내보냅니다.",
      },
      ms: {
        name: "Pemeriksa aksara tidak kelihatan Unicode",
        description:
          "Mengesan aksara lebar sifar, kawalan bidi dan ruang khas, dan mengeksport versi yang dibersihkan.",
      },
      nl: {
        name: "Unicode onzichtbare-tekenscontrole",
        description:
          "Detecteert nulbreedte-, bidi-besturing- en speciale spatie-tekens en exporteert een opgeschoonde versie.",
      },
      no: {
        name: "Unicode-kontroll av usynlige tegn",
        description:
          "Oppdager nullbredde-, bidi-kontroll- og spesialmellomromstegn og eksporterer en renset versjon.",
      },
      pl: {
        name: "Sprawdzanie niewidocznych znaków Unicode",
        description:
          "Wykrywa znaki o zerowej szerokości, sterowanie bidi i specjalne spacje oraz eksportuje oczyszczoną wersję.",
      },
      pt: {
        name: "Verificador de caracteres invisíveis Unicode",
        description:
          "Detecta caracteres de largura zero, controles bidi e espaços especiais e exporta uma versão limpa.",
      },
      ru: {
        name: "Проверка невидимых символов Unicode",
        description:
          "Обнаруживает символы нулевой ширины, управляющие bidi и специальные пробелы и экспортирует очищенную версию.",
      },
      sv: {
        name: "Unicode osynliga tecken-kontroll",
        description:
          "Upptäcker nollbredds-, bidi-kontroll- och specialblankstegstecken och exporterar en rensad version.",
      },
      th: {
        name: "ตัวตรวจสอบอักขระที่มองไม่เห็นของ Unicode",
        description:
          "ตรวจจับอักขระกว้างศูนย์ การควบคุมแบบ bidi และช่องว่างพิเศษ แล้วส่งออกเวอร์ชันที่ทำความสะอาดแล้ว",
      },
      tr: {
        name: "Unicode Görünmez Karakter Denetleyici",
        description:
          "Sıfır genişlikli, bidi kontrol ve özel boşluk karakterlerini algılar ve temizlenmiş sürümü dışa aktarır.",
      },
      vi: {
        name: "Trình kiểm tra ký tự ẩn Unicode",
        description:
          "Phát hiện ký tự độ rộng bằng 0, điều khiển bidi và khoảng trắng đặc biệt, rồi xuất phiên bản đã làm sạch.",
      },
      "zh-CN": {
        name: "Unicode 不可见字符检查",
        description: "检测零宽、双向控制和特殊空白字符，并导出清理后的版本。",
      },
      "zh-TW": {
        name: "Unicode 不可見字元檢查",
        description: "偵測零寬、雙向控制與特殊空白字元，並匯出清理後的版本。",
      },
    },
  },
  {
    slug: "unicode-punycode-converter",
    category: "network",
    icon: "network",
    tags: ["dns", "domain", "punycode", "idn", "network"],
    locales: {
      ar: {
        name: "محول Unicode ↔ Punycode",
        description:
          "حوّل نطاقات Unicode (IDN) وASCII (Punycode) في كلا الاتجاهين",
      },
      de: {
        name: "Unicode ↔ Punycode Konverter",
        description:
          "Konvertieren Sie Unicode- (IDN) und ASCII- (Punycode) Domains in beide Richtungen",
      },
      en: {
        name: "Unicode ↔ Punycode Converter",
        description:
          "Convert Unicode (IDN) and ASCII (Punycode) domains both ways",
      },
      es: {
        name: "Convertidor Unicode ↔ Punycode",
        description:
          "Convierte dominios Unicode (IDN) y ASCII (Punycode) en ambos sentidos",
      },
      fr: {
        name: "Convertisseur Unicode ↔ Punycode",
        description:
          "Convertissez les domaines Unicode (IDN) et ASCII (Punycode) dans les deux sens",
      },
      he: {
        name: "ממיר Unicode ↔ Punycode",
        description:
          "המרת דומיינים של Unicode (IDN) ו‑ASCII (Punycode) בשני הכיוונים",
      },
      hi: {
        name: "Unicode ↔ Punycode परिवर्तक",
        description:
          "Unicode (IDN) और ASCII (Punycode) डोमेन को दोनों दिशाओं में बदलें",
      },
      id: {
        name: "Pengonversi Unicode ↔ Punycode",
        description:
          "Konversi domain Unicode (IDN) dan ASCII (Punycode) dua arah",
      },
      it: {
        name: "Convertitore Unicode ↔ Punycode",
        description:
          "Converte domini Unicode (IDN) e ASCII (Punycode) in entrambe le direzioni",
      },
      ja: {
        name: "Unicode ↔ Punycode 変換ツール",
        description:
          "Unicode（IDN）と ASCII（Punycode）のドメイン名を双方向に変換",
      },
      ko: {
        name: "Unicode ↔ Punycode 변환기",
        description: "Unicode(IDN)와 ASCII(Punycode) 도메인을 양방향으로 변환",
      },
      ms: {
        name: "Penukar Unicode ↔ Punycode",
        description: "Tukar domain Unicode (IDN) dan ASCII (Punycode) dua hala",
      },
      nl: {
        name: "Unicode ↔ Punycode Converter",
        description:
          "Zet Unicode (IDN) en ASCII (Punycode) domeinen in beide richtingen om",
      },
      no: {
        name: "Unicode ↔ Punycode‑konverter",
        description:
          "Konverter Unicode‑ (IDN) og ASCII‑ (Punycode) domener begge veier",
      },
      pl: {
        name: "Konwerter Unicode ↔ Punycode",
        description:
          "Dwukierunkowa konwersja domen Unicode (IDN) i ASCII (Punycode)",
      },
      pt: {
        name: "Conversor Unicode ↔ Punycode",
        description:
          "Converta domínios Unicode (IDN) e ASCII (Punycode) nos dois sentidos",
      },
      ru: {
        name: "Конвертер Unicode ↔ Punycode",
        description:
          "Двустороннее преобразование доменов Unicode (IDN) и ASCII (Punycode)",
      },
      sv: {
        name: "Unicode ↔ Punycode‑omvandlare",
        description:
          "Omvandla Unicode (IDN) och ASCII (Punycode) domäner i båda riktningarna",
      },
      th: {
        name: "ตัวแปลง Unicode ↔ Punycode",
        description: "แปลงโดเมน Unicode (IDN) และ ASCII (Punycode) ได้สองทิศทาง",
      },
      tr: {
        name: "Unicode ↔ Punycode Dönüştürücü",
        description:
          "Unicode (IDN) ve ASCII (Punycode) alan adlarını çift yönlü dönüştürün",
      },
      vi: {
        name: "Bộ chuyển đổi Unicode ↔ Punycode",
        description:
          "Chuyển đổi tên miền Unicode (IDN) và ASCII (Punycode) hai chiều",
      },
      "zh-CN": {
        name: "Unicode ↔ Punycode 转换器",
        description: "双向转换 Unicode（IDN）与 ASCII（Punycode）域名",
      },
      "zh-TW": {
        name: "Unicode ↔ Punycode 轉換器",
        description: "雙向轉換 Unicode（IDN）與 ASCII（Punycode）網域",
      },
    },
  },
  {
    slug: "unix-timestamp-converter",
    category: "developer",
    icon: "binary",
    tags: [
      "unix",
      "timestamp",
      "epoch",
      "time",
      "date",
      "converter",
      "seconds",
      "milliseconds",
      "nanoseconds",
    ],
    locales: {
      ar: {
        name: "محول الطابع الزمني Unix",
        description:
          "تحويل الطوابع الزمنية Unix إلى تواريخ قابلة للقراءة والعكس. يدعم الكشف التلقائي عن الثواني والمللي ثانية والنانو ثانية.",
      },
      de: {
        name: "Unix-Zeitstempel-Konverter",
        description:
          "Konvertiert Unix-Zeitstempel in lesbare Daten und umgekehrt. Unterstützt automatische Erkennung von Sekunden, Millisekunden und Nanosekunden.",
      },
      en: {
        name: "Unix Timestamp Converter",
        description:
          "Convert Unix timestamps to human-readable dates and vice versa. Supports auto-detection of seconds, milliseconds, and nanoseconds.",
      },
      es: {
        name: "Convertidor de Marca de Tiempo Unix",
        description:
          "Convierte marcas de tiempo Unix a fechas legibles y viceversa. Soporta detección automática de segundos, milisegundos y nanosegundos.",
      },
      fr: {
        name: "Convertisseur de Timestamp Unix",
        description:
          "Convertit les timestamps Unix en dates lisibles et vice versa. Prend en charge la détection automatique des secondes, millisecondes et nanosecondes.",
      },
      he: {
        name: "ממיר חותמת זמן Unix",
        description:
          "המר חותמות זמן Unix לתאריכים קריאים ולהיפך. תומך בזיהוי אוטומטי של שניות, אלפיות שנייה וננושניות.",
      },
      hi: {
        name: "Unix टाइमस्टैम्प कनवर्टर",
        description:
          "Unix टाइमस्टैम्प को पढ़ने योग्य तिथियों में बदलें और इसके विपरीत। सेकंड, मिलीसेकंड और नैनोसेकंड की स्वचालित पहचान का समर्थन करता है।",
      },
      id: {
        name: "Konverter Timestamp Unix",
        description:
          "Konversi timestamp Unix ke tanggal yang dapat dibaca dan sebaliknya. Mendukung deteksi otomatis detik, milidetik, dan nanodetik.",
      },
      it: {
        name: "Convertitore Timestamp Unix",
        description:
          "Converte i timestamp Unix in date leggibili e viceversa. Supporta il rilevamento automatico di secondi, millisecondi e nanosecondi.",
      },
      ja: {
        name: "Unixタイムスタンプ変換",
        description:
          "Unixタイムスタンプを読みやすい日付に変換し、その逆も可能。秒、ミリ秒、ナノ秒の自動検出に対応。",
      },
      ko: {
        name: "Unix 타임스탬프 변환기",
        description:
          "Unix 타임스탬프를 읽기 쉬운 날짜로 변환하고 그 반대도 가능합니다. 초, 밀리초, 나노초 자동 감지를 지원합니다.",
      },
      ms: {
        name: "Penukar Cap Masa Unix",
        description:
          "Tukar cap masa Unix kepada tarikh yang boleh dibaca dan sebaliknya. Menyokong pengesanan automatik saat, milisaat dan nanosaat.",
      },
      nl: {
        name: "Unix Tijdstempel Converter",
        description:
          "Converteer Unix-tijdstempels naar leesbare datums en omgekeerd. Ondersteunt automatische detectie van seconden, milliseconden en nanoseconden.",
      },
      no: {
        name: "Unix Tidsstempel Konverterer",
        description:
          "Konverter Unix-tidsstempler til lesbare datoer og omvendt. Støtter automatisk deteksjon av sekunder, millisekunder og nanosekunder.",
      },
      pl: {
        name: "Konwerter Znacznika Czasu Unix",
        description:
          "Konwertuj znaczniki czasu Unix na czytelne daty i odwrotnie. Obsługuje automatyczne wykrywanie sekund, milisekund i nanosekund.",
      },
      pt: {
        name: "Conversor de Timestamp Unix",
        description:
          "Converte timestamps Unix em datas legíveis e vice-versa. Suporta detecção automática de segundos, milissegundos e nanossegundos.",
      },
      ru: {
        name: "Конвертер Unix-меток времени",
        description:
          "Преобразует метки времени Unix в читаемые даты и обратно. Поддерживает автоматическое определение секунд, миллисекунд и наносекунд.",
      },
      sv: {
        name: "Unix Tidsstämpel Konverterare",
        description:
          "Konvertera Unix-tidsstämplar till läsbara datum och vice versa. Stödjer automatisk detektering av sekunder, millisekunder och nanosekunder.",
      },
      th: {
        name: "ตัวแปลง Unix Timestamp",
        description:
          "แปลง Unix timestamp เป็นวันที่ที่อ่านได้และในทางกลับกัน รองรับการตรวจจับอัตโนมัติของวินาที มิลลิวินาที และนาโนวินาที",
      },
      tr: {
        name: "Unix Zaman Damgası Dönüştürücü",
        description:
          "Unix zaman damgalarını okunabilir tarihlere dönüştürün ve tam tersi. Saniye, milisaniye ve nanosaniye otomatik algılamayı destekler.",
      },
      vi: {
        name: "Bộ Chuyển Đổi Dấu Thời Gian Unix",
        description:
          "Chuyển đổi dấu thời gian Unix thành ngày tháng dễ đọc và ngược lại. Hỗ trợ tự động phát hiện giây, mili giây và nano giây.",
      },
      "zh-CN": {
        name: "Unix 时间戳转换器",
        description:
          "将 Unix 时间戳转换为可读日期，或将日期转换为时间戳。支持自动检测秒、毫秒和纳秒。",
      },
      "zh-TW": {
        name: "Unix 時間戳記轉換器",
        description:
          "將 Unix 時間戳記轉換為可讀日期，或將日期轉換為時間戳記。支援自動偵測秒、毫秒和奈秒。",
      },
    },
  },
  {
    slug: "url-component-encoder-decoder",
    category: "web",
    icon: "globe",
    tags: ["url", "encoding", "decoding", "percent", "uri", "text"],
    locales: {
      ar: {
        name: "مُرمز/مُفكك تشفير مكونات URL",
        description:
          "ترميز وفك تشفير مكونات عناوين URL بالترميز بالنسبة المئوية. تحويل الأحرف الخاصة إلى تنسيق آمن لعناوين URL والعكس لتطوير الويب واستخدام واجهة برمجة التطبيقات",
      },
      de: {
        name: "URL-Komponenten-Encoder/Decoder",
        description:
          "Kodiert und dekodiert URL-Komponenten mit Prozent-Kodierung. Konvertiert Sonderzeichen in URL-sicheres Format und umgekehrt für Webentwicklung und API-Nutzung",
      },
      en: {
        name: "URL Component Encoder and Decoder",
        description:
          "Encode and decode URL components with percent encoding. Convert special characters to URL-safe format and vice versa for web development and API usage",
      },
      es: {
        name: "Codificador/Decodificador de Componentes URL",
        description:
          "Codifica y decodifica componentes de URL con codificación por porcentaje. Convierte caracteres especiales a formato seguro para URL y viceversa para desarrollo web y uso de API",
      },
      fr: {
        name: "Encodeur/Décodeur de Composants d'URL",
        description:
          "Encode et décode les composants d'URL avec l'encodage par pourcentage. Convertit les caractères spéciaux au format sûr pour les URL et vice versa pour le développement web et l'utilisation d'API",
      },
      he: {
        name: "מקודד/מפענח רכיבי URL",
        description:
          "קידוד ופענוח רכיבי URL עם קידוד אחוזים. המרת תווים מיוחדים לפורמט בטוח עבור URL ולהיפך לפיתוח אתרים ושימוש ב-API",
      },
      hi: {
        name: "URL घटक एनकोडर/डिकोडर",
        description:
          "प्रतिशत एन्कोडिंग के साथ URL घटक एन्कोड और डिकोड करें। विशेष वर्णों को URL-सुरक्षित प्रारूप में परिवर्तित करें और वेब डेवलपमेंट और API उपयोग के लिए इसके विपरीत",
      },
      id: {
        name: "Encoder/Decoder Komponen URL",
        description:
          "Encode dan decode komponen URL dengan encoding persen. Konversi karakter khusus ke format aman URL dan sebaliknya untuk pengembangan web dan penggunaan API",
      },
      it: {
        name: "Codificatore/Decodificatore Componenti URL",
        description:
          "Codifica e decodifica componenti URL con codifica percentuale. Converte caratteri speciali in formato sicuro per URL e viceversa per sviluppo web e utilizzo API",
      },
      ja: {
        name: "URL コンポーネント エンコーダー/デコーダー",
        description:
          "パーセントエンコーディングを使用してURLコンポーネントをエンコード・デコードします。特殊文字をURL安全形式に変換し、その逆も行い、Web開発とAPI使用に対応",
      },
      ko: {
        name: "URL 컴포넌트 인코더/디코더",
        description:
          "퍼센트 인코딩을 사용하여 URL 컴포넌트를 인코딩 및 디코딩합니다. 특수 문자를 URL 안전 형식으로 변환하고 그 반대로도 변환하여 웹 개발 및 API 사용에 활용",
      },
      ms: {
        name: "Pengekod/Penyahkod Komponen URL",
        description:
          "Kod dan nyahkod komponen URL dengan pengekodan peratus. Tukar aksara khas kepada format selamat URL dan sebaliknya untuk pembangunan web dan penggunaan API",
      },
      nl: {
        name: "URL-component encoder/decoder",
        description:
          "Codeer en decodeer URL-componenten met procentcodering. Converteer speciale tekens naar URL-veilig formaat en omgekeerd voor webontwikkeling en API-gebruik",
      },
      no: {
        name: "URL-komponent koder/dekoder",
        description:
          "Kod og dekod URL-komponenter med prosentkoding. Konverter spesialtegn til URL-trygt format og omvendt for webutvikling og API-bruk",
      },
      pl: {
        name: "Koder/Dekoder Komponentów URL",
        description:
          "Koduj i dekoduj komponenty URL za pomocą kodowania procentowego. Konwertuj znaki specjalne na format bezpieczny dla URL-i i odwrotnie dla rozwoju stron internetowych i użycia API",
      },
      pt: {
        name: "Codificador/Decodificador de Componentes URL",
        description:
          "Codifica e decodifica componentes de URL com codificação por porcentagem. Converte caracteres especiais para formato seguro de URL e vice-versa para desenvolvimento web e uso de API",
      },
      ru: {
        name: "URL-кодировщик/декодер компонентов",
        description:
          "Кодирует и декодирует компоненты URL с процентным кодированием. Преобразует специальные символы в URL-безопасный формат и наоборот для веб-разработки и использования API",
      },
      sv: {
        name: "URL-komponent kodare/avkodare",
        description:
          "Koda och avkoda URL-komponenter med procentkodning. Konvertera specialtecken till URL-säkert format och vice versa för webbutveckling och API-användning",
      },
      th: {
        name: "ตัวเข้ารหัส/ถอดรหัสองค์ประกอบ URL",
        description:
          "เข้ารหัสและถอดรหัสองค์ประกอบ URL ด้วยการเข้ารหัสแบบเปอร์เซ็นต์ แปลงอักขระพิเศษเป็นรูปแบบที่ปลอดภัยสำหรับ URL และในทางกลับกันสำหรับการพัฒนาเว็บและการใช้ API",
      },
      tr: {
        name: "URL Bileşen Kodlayıcı/Kod Çözücü",
        description:
          "Yüzde kodlaması ile URL bileşenlerini kodlayın ve kod çözün. Özel karakterleri URL güvenli formatına dönüştürün ve web geliştirme ve API kullanımı için tersini yapın",
      },
      vi: {
        name: "Bộ mã hóa/giải mã thành phần URL",
        description:
          "Mã hóa và giải mã thành phần URL bằng mã hóa phần trăm. Chuyển đổi ký tự đặc biệt sang định dạng an toàn cho URL và ngược lại cho phát triển web và sử dụng API",
      },
      "zh-CN": {
        name: "URL 组件编码器/解码器",
        description:
          "使用百分号编码对 URL 组件进行编码和解码。将特殊字符转换为 URL 安全格式，反之亦然，用于 Web 开发和 API 使用",
      },
      "zh-TW": {
        name: "URL 組件編碼器/解碼器",
        description:
          "使用百分號編碼對 URL 組件進行編碼和解碼。將特殊字元轉換為 URL 安全格式，反之亦然，用於 Web 開發和 API 使用",
      },
    },
  },
  {
    slug: "url-parser-builder",
    category: "web",
    icon: "globe",
    tags: ["url", "parser", "builder", "uri", "query", "protocol", "hostname"],
    locales: {
      ar: {
        name: "محلل ومنشئ URL",
        description:
          "يحلل عناوين URL إلى مكونات ويعيد بناءها من البروتوكول وبيانات الاعتماد والمضيف والمسار ومعلمات الاستعلام والجزء داخل محرر منظم واحد.",
      },
      de: {
        name: "URL-Parser und -Builder",
        description:
          "Zerlegt URLs in ihre Bestandteile und setzt sie in einem strukturierten Editor aus Protokoll, Zugangsdaten, Host, Pfad, Query-Parametern und Fragment wieder zusammen.",
      },
      en: {
        name: "URL Parser and Builder",
        description:
          "Parse URLs into components and rebuild them from protocol, credentials, host, path, query parameters, and fragment in one structured editor.",
      },
      es: {
        name: "Analizador y Constructor de URL",
        description:
          "Analiza URL en componentes y vuelve a construirlas desde protocolo, credenciales, host, ruta, parámetros de consulta y fragmento en un editor estructurado.",
      },
      fr: {
        name: "Analyseur et Constructeur d'URL",
        description:
          "Analyse les URL en composants et les reconstruit à partir du protocole, des identifiants, de l'hôte, du chemin, des paramètres de requête et du fragment dans un éditeur structuré.",
      },
      he: {
        name: "מנתח ובונה URL",
        description:
          "מפרק כתובות URL לרכיבים ובונה אותן מחדש מתוך הפרוטוקול, פרטי ההתחברות, המארח, הנתיב, פרמטרי השאילתה והקטע בעורך מובנה אחד.",
      },
      hi: {
        name: "URL पार्सर और बिल्डर",
        description:
          "URL को उसके घटकों में विभाजित करें और प्रोटोकॉल, क्रेडेंशियल, होस्ट, पथ, क्वेरी पैरामीटर और फ़्रैगमेंट से एक संरचित एडिटर में फिर से बनाएँ।",
      },
      id: {
        name: "Parser dan Builder URL",
        description:
          "Mengurai URL menjadi komponen lalu menyusunnya kembali dari protokol, kredensial, host, jalur, parameter kueri, dan fragmen dalam satu editor terstruktur.",
      },
      it: {
        name: "Parser e Builder URL",
        description:
          "Analizza gli URL nei loro componenti e li ricostruisce da protocollo, credenziali, host, percorso, parametri di query e frammento in un editor strutturato.",
      },
      ja: {
        name: "URL パーサー/ビルダー",
        description:
          "URL を各コンポーネントに分解し、プロトコル、認証情報、ホスト、パス、クエリパラメータ、フラグメントから 1 つの構造化エディタで再構築します。",
      },
      ko: {
        name: "URL 파서/빌더",
        description:
          "URL을 각 구성 요소로 분해하고 프로토콜, 자격 증명, 호스트, 경로, 쿼리 매개변수, 프래그먼트에서 하나의 구조화된 편집기로 다시 구성합니다.",
      },
      ms: {
        name: "Penghurai dan Pembina URL",
        description:
          "Menghuraikan URL kepada komponen dan membinanya semula daripada protokol, kelayakan, hos, laluan, parameter pertanyaan dan serpihan dalam satu editor berstruktur.",
      },
      nl: {
        name: "URL Parser en Builder",
        description:
          "Ontleedt URL's in onderdelen en bouwt ze opnieuw op uit protocol, inloggegevens, host, pad, queryparameters en fragment in één gestructureerde editor.",
      },
      no: {
        name: "URL-parser og bygger",
        description:
          "Parser URL-er i komponenter og bygger dem opp igjen fra protokoll, legitimasjon, vert, sti, spørringsparametere og fragment i én strukturert editor.",
      },
      pl: {
        name: "Parser i konstruktor URL",
        description:
          "Rozbija adresy URL na składniki i składa je ponownie z protokołu, poświadczeń, hosta, ścieżki, parametrów zapytania i fragmentu w jednym uporządkowanym edytorze.",
      },
      pt: {
        name: "Analisador e Construtor de URL",
        description:
          "Analisa URLs em componentes e os reconstrói a partir de protocolo, credenciais, host, caminho, parâmetros de consulta e fragmento em um editor estruturado.",
      },
      ru: {
        name: "Парсер и конструктор URL",
        description:
          "Разбирает URL на компоненты и собирает их обратно из протокола, учетных данных, хоста, пути, параметров запроса и фрагмента в одном структурированном редакторе.",
      },
      sv: {
        name: "URL-parser och byggare",
        description:
          "Delar upp URL:er i komponenter och bygger ihop dem igen från protokoll, inloggningsuppgifter, värd, sökväg, frågeparametrar och fragment i en strukturerad editor.",
      },
      th: {
        name: "ตัวแยกวิเคราะห์และสร้าง URL",
        description:
          "แยก URL ออกเป็นส่วนประกอบ และสร้างกลับจากโปรโตคอล ข้อมูลรับรอง โฮสต์ เส้นทาง พารามิเตอร์คิวรี และส่วนท้ายภายในตัวแก้ไขแบบมีโครงสร้างเดียว",
      },
      tr: {
        name: "URL Ayrıştırıcı ve Oluşturucu",
        description:
          "URL'leri bileşenlerine ayırır ve protokol, kimlik bilgileri, ana makine, yol, sorgu parametreleri ve parça üzerinden tek bir yapılandırılmış düzenleyicide yeniden oluşturur.",
      },
      vi: {
        name: "Bộ phân tích và tạo URL",
        description:
          "Phân tích URL thành các thành phần và xây dựng lại từ giao thức, thông tin xác thực, máy chủ, đường dẫn, tham số truy vấn và phân đoạn trong một trình chỉnh sửa có cấu trúc.",
      },
      "zh-CN": {
        name: "URL 解析器/构建器",
        description:
          "将 URL 拆解为各个组成部分，并在同一个结构化编辑器中从协议、凭据、主机、路径、查询参数和片段重新构建 URL。",
      },
      "zh-TW": {
        name: "URL 解析器/建構器",
        description:
          "將 URL 拆解為各個組成部分，並在同一個結構化編輯器中從協定、憑證、主機、路徑、查詢參數與片段重新建構 URL。",
      },
    },
  },
  {
    slug: "user-agent-parser",
    category: "web",
    icon: "globe",
    tags: [
      "web",
      "user-agent",
      "ua",
      "parser",
      "browser",
      "device",
      "os",
      "engine",
    ],
    locales: {
      ar: {
        name: "محلل User-Agent",
        description:
          "يحلل سلاسل User-Agent لتحديد المتصفح ونظام التشغيل والجهاز والمحرك ووحدة المعالجة المركزية. يعمل دون اتصال.",
      },
      de: {
        name: "User-Agent-Parser",
        description:
          "Analysiert User-Agent-Strings, um Browser, Betriebssystem, Gerät, Engine und CPU zu erkennen. Funktioniert offline.",
      },
      en: {
        name: "User-Agent Parser",
        description:
          "Parse user agent strings to identify browser, OS, device, engine, and CPU details. Works entirely offline.",
      },
      es: {
        name: "Analizador de User-Agent",
        description:
          "Analiza cadenas User-Agent para identificar navegador, sistema operativo, dispositivo, motor y CPU. Funciona sin conexión.",
      },
      fr: {
        name: "Analyseur d’User-Agent",
        description:
          "Analyse les chaînes User-Agent pour identifier le navigateur, l’OS, l’appareil, le moteur et le CPU. Fonctionne hors ligne.",
      },
      he: {
        name: "מנתח User-Agent",
        description:
          "מנתח מחרוזות User-Agent כדי לזהות דפדפן, מערכת הפעלה, מכשיר, מנוע ו‑CPU. פועל במצב לא מקוון.",
      },
      hi: {
        name: "User-Agent पार्सर",
        description:
          "User-Agent स्ट्रिंग्स को पार्स करके ब्राउज़र, OS, डिवाइस, इंजन और CPU जानकारी पहचानता है। पूरी तरह ऑफ़लाइन काम करता है।",
      },
      id: {
        name: "Parser User-Agent",
        description:
          "Mengurai string User-Agent untuk mengidentifikasi browser, sistem operasi, perangkat, engine, dan CPU. Berfungsi offline.",
      },
      it: {
        name: "Parser User-Agent",
        description:
          "Analizza stringhe User-Agent per identificare browser, sistema operativo, dispositivo, engine e CPU. Funziona offline.",
      },
      ja: {
        name: "ユーザーエージェント（User-Agent）解析",
        description:
          "User-Agent 文字列を解析してブラウザ、OS、デバイス、エンジン、CPU 情報を特定します。オフラインで動作します。",
      },
      ko: {
        name: "User-Agent 파서",
        description:
          "User-Agent 문자열을 분석하여 브라우저, OS, 디바이스, 엔진, CPU 정보를 식별합니다. 오프라인에서 동작합니다.",
      },
      ms: {
        name: "Penghurai User-Agent",
        description:
          "Menghurai rentetan User-Agent untuk mengenal pasti pelayar, sistem operasi, peranti, enjin dan CPU. Berfungsi luar talian.",
      },
      nl: {
        name: "User-Agent-parser",
        description:
          "Parseert User-Agent-strings om browser, besturingssysteem, apparaat, engine en CPU te identificeren. Werkt offline.",
      },
      no: {
        name: "User-Agent-parser",
        description:
          "Analyserer User-Agent-strenger for å identifisere nettleser, operativsystem, enhet, motor og CPU. Fungerer offline.",
      },
      pl: {
        name: "Parser User-Agent",
        description:
          "Analizuje ciągi User-Agent, aby zidentyfikować przeglądarkę, system operacyjny, urządzenie, silnik i CPU. Działa offline.",
      },
      pt: {
        name: "Analisador de User-Agent",
        description:
          "Analisa strings de User-Agent para identificar navegador, sistema operacional, dispositivo, motor e CPU. Funciona offline.",
      },
      ru: {
        name: "Парсер User-Agent",
        description:
          "Анализирует строки User-Agent для определения браузера, ОС, устройства, движка и CPU. Работает офлайн.",
      },
      sv: {
        name: "User-Agent-parser",
        description:
          "Tolkar User-Agent-strängar för att identifiera webbläsare, operativsystem, enhet, motor och CPU. Fungerar offline.",
      },
      th: {
        name: "ตัววิเคราะห์ User-Agent",
        description:
          "วิเคราะห์สตริง User-Agent เพื่อระบุเบราว์เซอร์ ระบบปฏิบัติการ อุปกรณ์ เอนจิน และ CPU ทำงานแบบออฟไลน์",
      },
      tr: {
        name: "User-Agent Ayrıştırıcı",
        description:
          "User-Agent dizelerini analiz ederek tarayıcı, işletim sistemi, cihaz, motor ve CPU bilgilerini belirler. Çevrimdışı çalışır.",
      },
      vi: {
        name: "Trình phân tích User-Agent",
        description:
          "Phân tích chuỗi User-Agent để nhận diện trình duyệt, hệ điều hành, thiết bị, engine và CPU. Hoạt động ngoại tuyến.",
      },
      "zh-CN": {
        name: "用户代理（User-Agent）解析器",
        description:
          "解析 User-Agent 字符串，识别浏览器、操作系统、设备、引擎与 CPU 信息。全程离线。",
      },
      "zh-TW": {
        name: "使用者代理（User-Agent）解析器",
        description:
          "解析 User-Agent 字串，識別瀏覽器、作業系統、裝置、引擎與 CPU 資訊。全程離線。",
      },
    },
  },
  {
    slug: "vin-validator",
    category: "text",
    icon: "car",
    tags: ["vin", "validator", "vehicle", "checksum"],
    locales: {
      ar: {
        name: "مدقق رقم VIN",
        description: "تحقق من أرقام VIN من حيث الطول والأحرف ورقم التحقق",
      },
      de: {
        name: "VIN-Validator",
        description:
          "VINs mit Regeln zu Länge, Zeichen und Prüfziffer validieren",
      },
      en: {
        name: "VIN Validator",
        description:
          "Validate VINs with length, character, and check digit rules",
      },
      es: {
        name: "Validador de VIN",
        description:
          "Valida VINs con reglas de longitud, caracteres y dígito de control",
      },
      fr: {
        name: "Validateur de NIV",
        description:
          "Validez les NIV avec les règles de longueur, de caractères et de chiffre de contrôle",
      },
      he: {
        name: "מאמת VIN",
        description: "אימות מספרי VIN עם בדיקת אורך, תווים וספרת ביקורת",
      },
      hi: {
        name: "VIN वैलिडेटर",
        description: "लंबाई, अक्षर और चेक डिजिट नियमों से VIN की जाँच करें",
      },
      id: {
        name: "Validator VIN",
        description:
          "Validasi VIN dengan aturan panjang, karakter, dan digit cek",
      },
      it: {
        name: "Validatore VIN",
        description:
          "Valida i VIN con regole di lunghezza, caratteri e cifra di controllo",
      },
      ja: {
        name: "VINバリデーター",
        description: "桁数、使用文字、チェックディジットのルールでVINを検証",
      },
      ko: {
        name: "VIN 검증기",
        description: "길이, 문자 및 체크 디짓 규칙으로 VIN을 검증합니다",
      },
      ms: {
        name: "Pengesah VIN",
        description:
          "Sahkan VIN dengan peraturan panjang, aksara dan digit semak",
      },
      nl: {
        name: "VIN-validator",
        description: "Valideer VIN's op lengte, tekens en controlecijferregels",
      },
      no: {
        name: "VIN-validator",
        description:
          "Valider VIN med regler for lengde, tegn og kontrollsiffer",
      },
      pl: {
        name: "Walidator VIN",
        description:
          "Waliduj numery VIN z kontrolą długości, znaków i cyfry kontrolnej",
      },
      pt: {
        name: "Validador de VIN",
        description:
          "Valide VINs com regras de comprimento, caracteres e digito verificador",
      },
      ru: {
        name: "Валидатор VIN",
        description:
          "Проверка VIN по длине, допустимым символам и контрольной цифре",
      },
      sv: {
        name: "VIN-validator",
        description:
          "Validera VIN med regler för längd, tecken och kontrollsiffra",
      },
      th: {
        name: "ตรวจสอบ VIN",
        description: "ตรวจสอบ VIN ด้วยกฎความยาว อักขระ และเลขตรวจสอบ",
      },
      tr: {
        name: "VIN Doğrulayıcı",
        description:
          "Uzunluk, karakter ve kontrol basamağı kurallarıyla VIN doğrulayın",
      },
      vi: {
        name: "Kiểm tra VIN",
        description:
          "Xác thực VIN theo quy tắc độ dài, ký tự và chữ số kiểm tra",
      },
      "zh-CN": {
        name: "VIN 验证器",
        description: "通过长度、字符和校验位规则验证车辆识别号（VIN）",
      },
      "zh-TW": {
        name: "VIN 驗證器",
        description: "依據長度、字元及校驗碼規則驗證車輛識別號碼（VIN）",
      },
    },
  },
  {
    slug: "whirlpool-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "whirlpool",
      "checksum",
      "security",
      "file",
      "text",
      "crypto",
    ],
    locales: {
      ar: {
        name: "تجزئة Whirlpool للنص أو الملف",
        description:
          "إنشاء تجزئة Whirlpool لإدخال النص أو تحميل الملف. احسب مجاميع التحقق المشفرة الآمنة للتحقق من سلامة البيانات وأغراض الأمان",
      },
      de: {
        name: "Whirlpool-Hash für Text oder Datei",
        description:
          "Generieren Sie Whirlpool-Hash für Texteingabe oder Datei-Upload. Berechnen Sie sichere kryptographische Prüfsummen zur Datenintegritätsprüfung und für Sicherheitszwecke",
      },
      en: {
        name: "Whirlpool Hash Text or File",
        description:
          "Generate Whirlpool hash for text input or file upload. Calculate secure cryptographic checksums for data integrity verification and security purposes",
      },
      es: {
        name: "Hash Whirlpool de Texto o Archivo",
        description:
          "Genera hash Whirlpool para entrada de texto o carga de archivo. Calcula sumas de verificación criptográficas seguras para verificación de integridad de datos y propósitos de seguridad",
      },
      fr: {
        name: "Hash Whirlpool de Texte ou Fichier",
        description:
          "Générez un hash Whirlpool pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle cryptographiques sécurisées pour la vérification de l'intégrité des données et à des fins de sécurité",
      },
      he: {
        name: "האש Whirlpool טקסט או קובץ",
        description:
          "צור האש Whirlpool עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה קריפטוגרפיים בטוחים לאימות שלמות נתונים ומטרות אבטחה",
      },
      hi: {
        name: "Whirlpool हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए Whirlpool हैश जेनरेट करें। डेटा अखंडता सत्यापन और सुरक्षा उद्देश्यों के लिए सुरक्षित क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash Whirlpool Teks atau File",
        description:
          "Buat hash Whirlpool untuk input teks atau upload file. Hitung checksum kriptografi yang aman untuk verifikasi integritas data dan tujuan keamanan",
      },
      it: {
        name: "Hash Whirlpool di Testo o File",
        description:
          "Genera hash Whirlpool per input di testo o caricamento file. Calcola checksum crittografici sicuri per la verifica dell'integrità dei dati e scopi di sicurezza",
      },
      ja: {
        name: "Whirlpool ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのWhirlpoolハッシュを生成します。データ整合性検証とセキュリティ目的のための安全な暗号化チェックサムを計算",
      },
      ko: {
        name: "Whirlpool 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 Whirlpool 해시를 생성합니다. 데이터 무결성 검증 및 보안 목적을 위한 안전한 암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash Whirlpool Teks atau Fail",
        description:
          "Jana hash Whirlpool untuk input teks atau muat naik fail. Kira checksum kriptografi selamat untuk pengesahan integriti data dan tujuan keselamatan",
      },
      nl: {
        name: "Whirlpool-hash tekst of bestand",
        description:
          "Genereer Whirlpool-hash voor tekstinvoer of bestandsupload. Bereken veilige cryptografische checksums voor gegevensintegriteitsverificatie en beveiligingsdoeleinden",
      },
      no: {
        name: "Whirlpool-hash tekst eller fil",
        description:
          "Generer Whirlpool-hash for tekstinndata eller filopplasting. Beregn sikre kryptografiske sjekksummer for dataintegritetsverifisering og sikkerhetsformål",
      },
      pl: {
        name: "Hash Whirlpool tekstu lub pliku",
        description:
          "Generuj hash Whirlpool dla wprowadzania tekstu lub przesyłania pliku. Obliczaj bezpieczne sumy kontrolne kryptograficzne do weryfikacji integralności danych i celów bezpieczeństwa",
      },
      pt: {
        name: "Hash Whirlpool de Texto ou Arquivo",
        description:
          "Gere hash Whirlpool para entrada de texto ou upload de arquivo. Calcule checksums criptográficos seguros para verificação de integridade de dados e propósitos de segurança",
      },
      ru: {
        name: "Whirlpool-хеш текста или файла",
        description:
          "Генерируйте Whirlpool-хеш для текстового ввода или загрузки файла. Вычисляйте безопасные криптографические контрольные суммы для проверки целостности данных и целей безопасности",
      },
      sv: {
        name: "Whirlpool-hash text eller fil",
        description:
          "Generera Whirlpool-hash för textinmatning eller filuppladdning. Beräkna säkra kryptografiska kontrollsummor för dataintegritetsverifiering och säkerhetsändamål",
      },
      th: {
        name: "แฮช Whirlpool ข้อความหรือไฟล์",
        description:
          "สร้างแฮช Whirlpool สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัมเข้ารหัสที่ปลอดภัยสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและวัตถุประสงค์ด้านความปลอดภัย",
      },
      tr: {
        name: "Whirlpool Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için Whirlpool hash oluşturun. Veri bütünlüğü doğrulaması ve güvenlik amaçları için güvenli kriptografik sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash Whirlpool văn bản hoặc tệp",
        description:
          "Tạo hash Whirlpool cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum mã hóa an toàn để xác minh tính toàn vẹn dữ liệu và mục đích bảo mật",
      },
      "zh-CN": {
        name: "Whirlpool 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 Whirlpool 哈希值。计算安全的加密校验和，用于数据完整性验证和安全目的",
      },
      "zh-TW": {
        name: "Whirlpool 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 Whirlpool 雜湊值。計算安全的加密校驗和，用於資料完整性驗證和安全目的",
      },
    },
  },
  {
    slug: "xml-to-json-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "xml", "json", "converter"],
    locales: {
      ar: {
        name: "محول XML → JSON",
        description:
          "حوّل XML إلى JSON. الصق XML أو استورد ملفًا؛ اضبط الخيارات، عاين، انسخ ونزّل.",
      },
      de: {
        name: "XML → JSON Konverter",
        description:
          "Wandelt XML in JSON um. XML einfügen oder Datei importieren; Optionen anpassen, Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "XML → JSON Converter",
        description:
          "Convert XML to JSON. Paste XML or import a file; adjust options, preview, copy, and download.",
      },
      es: {
        name: "Convertidor XML → JSON",
        description:
          "Convierte XML a JSON. Pega XML o importa un archivo; ajusta opciones, previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur XML → JSON",
        description:
          "Convertissez XML en JSON. Collez du XML ou importez un fichier ; réglez les options, prévisualisez, copiez et téléchargez.",
      },
      he: {
        name: "ממיר XML → JSON",
        description:
          "המרת XML ל‑JSON. הדביקו XML או ייבאו קובץ; התאימו אפשרויות, תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "XML → JSON परिवर्तक",
        description:
          "XML को JSON में बदलें। XML पेस्ट करें या फ़ाइल आयात करें; विकल्प समायोजित करें, पूर्वावलोकन करें, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi XML → JSON",
        description:
          "Konversi XML ke JSON. Tempel XML atau impor berkas; sesuaikan opsi, pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore XML → JSON",
        description:
          "Converti XML in JSON. Incolla XML o importa un file; regola le opzioni, anteprima, copia e download.",
      },
      ja: {
        name: "XML → JSON 変換",
        description:
          "XML を JSON に変換。XML を貼り付けるかファイルを読み込み、オプション調整、プレビュー、コピー、ダウンロード。",
      },
      ko: {
        name: "XML → JSON 변환기",
        description:
          "XML을 JSON으로 변환합니다. XML 붙여넣기 또는 파일 가져오기; 옵션 조정, 미리보기, 복사 및 다운로드.",
      },
      ms: {
        name: "Penukar XML → JSON",
        description:
          "Tukar XML kepada JSON. Tampal XML atau import fail; laraskan pilihan, pratonton, salin dan muat turun.",
      },
      nl: {
        name: "XML → JSON-converter",
        description:
          "Zet XML om naar JSON. Plak XML of importeer een bestand; stel opties in, bekijk, kopieer en download.",
      },
      no: {
        name: "XML → JSON-omformer",
        description:
          "Konverter XML til JSON. Lim inn XML eller importer en fil; juster alternativer, forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter XML → JSON",
        description:
          "Konwertuj XML na JSON. Wklej XML lub zaimportuj plik; dostosuj opcje, podglądaj, kopiuj i pobieraj.",
      },
      pt: {
        name: "Conversor XML → JSON",
        description:
          "Converta XML para JSON. Cole XML ou importe um arquivo; ajuste opções, visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер XML → JSON",
        description:
          "Преобразуйте XML в JSON. Вставьте XML или импортируйте файл; настраивайте опции, просматривайте, копируйте и загружайте.",
      },
      sv: {
        name: "XML → JSON-omvandlare",
        description:
          "Konvertera XML till JSON. Klistra in XML eller importera en fil; justera alternativ, förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง XML → JSON",
        description:
          "แปลง XML เป็น JSON วาง XML หรือ นำเข้าไฟล์; ปรับตัวเลือก แสดงตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "XML → JSON Dönüştürücü",
        description:
          "XML’i JSON’a dönüştürün. XML yapıştırın veya dosya içe aktarın; seçenekleri ayarlayın, önizleyin, kopyalayın ve indirin.",
      },
      vi: {
        name: "Trình chuyển XML → JSON",
        description:
          "Chuyển XML sang JSON. Dán XML hoặc nhập tệp; điều chỉnh tùy chọn, xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "XML 转 JSON 转换器",
        description:
          "将 XML 转为 JSON。粘贴 XML 或导入文件；调整选项、预览、复制并下载。",
      },
      "zh-TW": {
        name: "XML 轉 JSON 轉換器",
        description:
          "將 XML 轉為 JSON。貼上 XML 或匯入檔案；調整選項、預覽、複製並下載。",
      },
    },
  },
  {
    slug: "xxhash-xxh3-128-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "xxhash",
      "xxh3",
      "xxh3-128",
      "checksum",
      "performance",
      "file",
      "text",
      "fast",
      "seed",
    ],
    locales: {
      ar: {
        name: "تجزئة xxHash (XXH3 128) للنص أو الملف",
        description:
          "إنشاء تجزئة xxHash XXH3 128 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق 128 بت غير المشفرة السريعة للتحقق من سلامة البيانات والتجزئة الموجهة للأداء",
      },
      de: {
        name: "xxHash (XXH3 128)-Hash für Text oder Datei",
        description:
          "Generieren Sie xxHash XXH3 128-Hash für Texteingabe oder Datei-Upload. Berechnen Sie schnelle 128-Bit nicht-kryptographische Prüfsummen zur Datenintegritätsprüfung und leistungsorientierten Hashing",
      },
      en: {
        name: "xxHash (XXH3 128) Hash Text or File",
        description:
          "Generate xxHash XXH3 128 hash for text input or file upload. Calculate fast 128-bit non-cryptographic checksums for data integrity verification and performance-oriented hashing",
      },
      es: {
        name: "Hash xxHash (XXH3 128) de Texto o Archivo",
        description:
          "Genera hash xxHash XXH3 128 para entrada de texto o carga de archivo. Calcula sumas de verificación de 128 bits no criptográficas rápidas para verificación de integridad de datos y hashing orientado al rendimiento",
      },
      fr: {
        name: "Hash xxHash (XXH3 128) de Texte ou Fichier",
        description:
          "Générez un hash xxHash XXH3 128 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle 128 bits non cryptographiques rapides pour la vérification de l'intégrité des données et le hachage orienté performance",
      },
      he: {
        name: "האש xxHash (XXH3 128) טקסט או קובץ",
        description:
          "צור האש xxHash XXH3 128 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה 128-ביט לא קריפטוגרפיים מהירים לאימות שלמות נתונים והאשינג מוכוון ביצועים",
      },
      hi: {
        name: "xxHash (XXH3 128) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए xxHash XXH3 128 हैश जेनरेट करें। डेटा अखंडता सत्यापन और प्रदर्शन-उन्मुख हैशिंग के लिए तेज़ 128-बिट गैर-क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash xxHash (XXH3 128) Teks atau File",
        description:
          "Buat hash xxHash XXH3 128 untuk input teks atau upload file. Hitung checksum 128-bit non-kriptografi cepat untuk verifikasi integritas data dan hashing berorientasi kinerja",
      },
      it: {
        name: "Hash xxHash (XXH3 128) di Testo o File",
        description:
          "Genera hash xxHash XXH3 128 per input di testo o caricamento file. Calcola checksum a 128 bit non crittografici veloci per la verifica dell'integrità dei dati e hashing orientato alle prestazioni",
      },
      ja: {
        name: "xxHash (XXH3 128) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのxxHash XXH3 128ハッシュを生成します。データ整合性検証とパフォーマンス重視のハッシュ化のための高速128ビット非暗号化チェックサムを計算",
      },
      ko: {
        name: "xxHash (XXH3 128) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 xxHash XXH3 128 해시를 생성합니다. 데이터 무결성 검증 및 성능 지향 해싱을 위한 빠른 128비트 비암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash xxHash (XXH3 128) Teks atau Fail",
        description:
          "Jana hash xxHash XXH3 128 untuk input teks atau muat naik fail. Kira checksum 128-bit bukan kriptografi pantas untuk pengesahan integriti data dan hash berorientasikan prestasi",
      },
      nl: {
        name: "xxHash (XXH3 128)-hash tekst of bestand",
        description:
          "Genereer xxHash XXH3 128-hash voor tekstinvoer of bestandsupload. Bereken snelle 128-bit niet-cryptografische checksums voor gegevensintegriteitsverificatie en prestatiegerichte hashing",
      },
      no: {
        name: "xxHash (XXH3 128)-hash tekst eller fil",
        description:
          "Generer xxHash XXH3 128-hash for tekstinndata eller filopplasting. Beregn raske 128-bits ikke-kryptografiske sjekksummer for dataintegritetsverifisering og ytelsesrettet hashing",
      },
      pl: {
        name: "Hash xxHash (XXH3 128) tekstu lub pliku",
        description:
          "Generuj hash xxHash XXH3 128 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj szybkie 128-bitowe nie-kryptograficzne sumy kontrolne do weryfikacji integralności danych i hashowania zorientowanego na wydajność",
      },
      pt: {
        name: "Hash xxHash (XXH3 128) de Texto ou Arquivo",
        description:
          "Gere hash xxHash XXH3 128 para entrada de texto ou upload de arquivo. Calcule checksums de 128 bits não criptográficos rápidos para verificação de integridade de dados e hashing orientado a performance",
      },
      ru: {
        name: "xxHash (XXH3 128)-хеш текста или файла",
        description:
          "Генерируйте xxHash XXH3 128-хеш для текстового ввода или загрузки файла. Вычисляйте быстрые 128-битные некриптографические контрольные суммы для проверки целостности данных и производительного хеширования",
      },
      sv: {
        name: "xxHash (XXH3 128)-hash text eller fil",
        description:
          "Generera xxHash XXH3 128-hash för textinmatning eller filuppladdning. Beräkna snabba 128-bitars icke-kryptografiska kontrollsummor för dataintegritetsverifiering och prestandaorienterad hash",
      },
      th: {
        name: "แฮช xxHash (XXH3 128) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช xxHash XXH3 128 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัม 128-บิตที่ไม่ใช่การเข้ารหัสที่รวดเร็วสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและการแฮชที่เน้นประสิทธิภาพ",
      },
      tr: {
        name: "xxHash (XXH3 128) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için xxHash XXH3 128 hash oluşturun. Veri bütünlüğü doğrulaması ve performans odaklı hash için hızlı 128-bit kriptografik olmayan sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash xxHash (XXH3 128) văn bản hoặc tệp",
        description:
          "Tạo hash xxHash XXH3 128 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum 128-bit không mã hóa nhanh để xác minh tính toàn vẹn dữ liệu và băm hướng hiệu suất",
      },
      "zh-CN": {
        name: "xxHash (XXH3 128) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 xxHash XXH3 128 哈希值。计算快速 128 位非加密校验和，用于数据完整性验证和性能导向的哈希计算",
      },
      "zh-TW": {
        name: "xxHash (XXH3 128) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 xxHash XXH3 128 雜湊值。計算快速 128 位元非加密校驗和，用於資料完整性驗證和效能導向的雜湊計算",
      },
    },
  },
  {
    slug: "xxhash-xxh3-64-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "xxhash",
      "xxh3",
      "xxh3-64",
      "checksum",
      "performance",
      "file",
      "text",
      "fast",
    ],
    locales: {
      ar: {
        name: "تجزئة xxHash (XXH3 64) للنص أو الملف",
        description:
          "إنشاء تجزئة xxHash XXH3 64 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق 64 بت غير المشفرة السريعة للتحقق من سلامة البيانات والتجزئة الموجهة للأداء",
      },
      de: {
        name: "xxHash (XXH3 64)-Hash für Text oder Datei",
        description:
          "Generieren Sie xxHash XXH3 64-Hash für Texteingabe oder Datei-Upload. Berechnen Sie schnelle 64-Bit nicht-kryptographische Prüfsummen zur Datenintegritätsprüfung und leistungsorientierten Hashing",
      },
      en: {
        name: "xxHash (XXH3 64) Hash Text or File",
        description:
          "Generate xxHash XXH3 64 hash for text input or file upload. Calculate fast 64-bit non-cryptographic checksums for data integrity verification and performance-oriented hashing",
      },
      es: {
        name: "Hash xxHash (XXH3 64) de Texto o Archivo",
        description:
          "Genera hash xxHash XXH3 64 para entrada de texto o carga de archivo. Calcula sumas de verificación de 64 bits no criptográficas rápidas para verificación de integridad de datos y hashing orientado al rendimiento",
      },
      fr: {
        name: "Hash xxHash (XXH3 64) de Texte ou Fichier",
        description:
          "Générez un hash xxHash XXH3 64 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle 64 bits non cryptographiques rapides pour la vérification de l'intégrité des données et le hachage orienté performance",
      },
      he: {
        name: "האש xxHash (XXH3 64) טקסט או קובץ",
        description:
          "צור האש xxHash XXH3 64 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה 64-ביט לא קריפטוגרפיים מהירים לאימות שלמות נתונים והאשינג מוכוון ביצועים",
      },
      hi: {
        name: "xxHash (XXH3 64) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए xxHash XXH3 64 हैश जेनरेट करें। डेटा अखंडता सत्यापन और प्रदर्शन-उन्मुख हैशिंग के लिए तेज़ 64-बिट गैर-क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash xxHash (XXH3 64) Teks atau File",
        description:
          "Buat hash xxHash XXH3 64 untuk input teks atau upload file. Hitung checksum 64-bit non-kriptografi cepat untuk verifikasi integritas data dan hashing berorientasi kinerja",
      },
      it: {
        name: "Hash xxHash (XXH3 64) di Testo o File",
        description:
          "Genera hash xxHash XXH3 64 per input di testo o caricamento file. Calcola checksum a 64 bit non crittografici veloci per la verifica dell'integrità dei dati e hashing orientato alle prestazioni",
      },
      ja: {
        name: "xxHash (XXH3 64) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのxxHash XXH3 64ハッシュを生成します。データ整合性検証とパフォーマンス重視のハッシュ化のための高速64ビット非暗号化チェックサムを計算",
      },
      ko: {
        name: "xxHash (XXH3 64) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 xxHash XXH3 64 해시를 생성합니다. 데이터 무결성 검증 및 성능 지향 해싱을 위한 빠른 64비트 비암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash xxHash (XXH3 64) Teks atau Fail",
        description:
          "Jana hash xxHash XXH3 64 untuk input teks atau muat naik fail. Kira checksum 64-bit bukan kriptografi pantas untuk pengesahan integriti data dan hash berorientasikan prestasi",
      },
      nl: {
        name: "xxHash (XXH3 64)-hash tekst of bestand",
        description:
          "Genereer xxHash XXH3 64-hash voor tekstinvoer of bestandsupload. Bereken snelle 64-bit niet-cryptografische checksums voor gegevensintegriteitsverificatie en prestatiegerichte hashing",
      },
      no: {
        name: "xxHash (XXH3 64)-hash tekst eller fil",
        description:
          "Generer xxHash XXH3 64-hash for tekstinndata eller filopplasting. Beregn raske 64-bits ikke-kryptografiske sjekksummer for dataintegritetsverifisering og ytelsesrettet hashing",
      },
      pl: {
        name: "Hash xxHash (XXH3 64) tekstu lub pliku",
        description:
          "Generuj hash xxHash XXH3 64 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj szybkie 64-bitowe nie-kryptograficzne sumy kontrolne do weryfikacji integralności danych i hashowania zorientowanego na wydajność",
      },
      pt: {
        name: "Hash xxHash (XXH3 64) de Texto ou Arquivo",
        description:
          "Gere hash xxHash XXH3 64 para entrada de texto ou upload de arquivo. Calcule checksums de 64 bits não criptográficos rápidos para verificação de integridade de dados e hashing orientado a performance",
      },
      ru: {
        name: "xxHash (XXH3 64)-хеш текста или файла",
        description:
          "Генерируйте xxHash XXH3 64-хеш для текстового ввода или загрузки файла. Вычисляйте быстрые 64-битные некриптографические контрольные суммы для проверки целостности данных и производительного хеширования",
      },
      sv: {
        name: "xxHash (XXH3 64)-hash text eller fil",
        description:
          "Generera xxHash XXH3 64-hash för textinmatning eller filuppladdning. Beräkna snabba 64-bitars icke-kryptografiska kontrollsummor för dataintegritetsverifiering och prestandaorienterad hash",
      },
      th: {
        name: "แฮช xxHash (XXH3 64) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช xxHash XXH3 64 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัม 64-บิตที่ไม่ใช่การเข้ารหัสที่รวดเร็วสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและการแฮชที่เน้นประสิทธิภาพ",
      },
      tr: {
        name: "xxHash (XXH3 64) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için xxHash XXH3 64 hash oluşturun. Veri bütünlüğü doğrulaması ve performans odaklı hash için hızlı 64-bit kriptografik olmayan sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash xxHash (XXH3 64) văn bản hoặc tệp",
        description:
          "Tạo hash xxHash XXH3 64 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum 64-bit không mã hóa nhanh để xác minh tính toàn vẹn dữ liệu và băm hướng hiệu suất",
      },
      "zh-CN": {
        name: "xxHash (XXH3 64) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 xxHash XXH3 64 哈希值。计算快速 64 位非加密校验和，用于数据完整性验证和性能导向的哈希计算",
      },
      "zh-TW": {
        name: "xxHash (XXH3 64) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 xxHash XXH3 64 雜湊值。計算快速 64 位元非加密校驗和，用於資料完整性驗證和效能導向的雜湊計算",
      },
    },
  },
  {
    slug: "xxhash-xxh32-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "xxhash",
      "xxh32",
      "checksum",
      "performance",
      "file",
      "text",
      "fast",
    ],
    locales: {
      ar: {
        name: "تجزئة xxHash (XXH32) للنص أو الملف",
        description:
          "إنشاء تجزئة xxHash XXH32 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق 32 بت غير المشفرة السريعة للتحقق من سلامة البيانات والتجزئة الموجهة للأداء",
      },
      de: {
        name: "xxHash (XXH32)-Hash für Text oder Datei",
        description:
          "Generieren Sie xxHash XXH32-Hash für Texteingabe oder Datei-Upload. Berechnen Sie schnelle 32-Bit nicht-kryptographische Prüfsummen zur Datenintegritätsprüfung und leistungsorientierten Hashing",
      },
      en: {
        name: "xxHash (XXH32) Hash Text or File",
        description:
          "Generate xxHash XXH32 hash for text input or file upload. Calculate fast 32-bit non-cryptographic checksums for data integrity verification and performance-oriented hashing",
      },
      es: {
        name: "Hash xxHash (XXH32) de Texto o Archivo",
        description:
          "Genera hash xxHash XXH32 para entrada de texto o carga de archivo. Calcula sumas de verificación de 32 bits no criptográficas rápidas para verificación de integridad de datos y hashing orientado al rendimiento",
      },
      fr: {
        name: "Hash xxHash (XXH32) de Texte ou Fichier",
        description:
          "Générez un hash xxHash XXH32 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle 32 bits non cryptographiques rapides pour la vérification de l'intégrité des données et le hachage orienté performance",
      },
      he: {
        name: "האש xxHash (XXH32) טקסט או קובץ",
        description:
          "צור האש xxHash XXH32 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה 32-ביט לא קריפטוגרפיים מהירים לאימות שלמות נתונים והאשינג מוכוון ביצועים",
      },
      hi: {
        name: "xxHash (XXH32) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए xxHash XXH32 हैश जेनरेट करें। डेटा अखंडता सत्यापन और प्रदर्शन-उन्मुख हैशिंग के लिए तेज़ 32-बिट गैर-क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash xxHash (XXH32) Teks atau File",
        description:
          "Buat hash xxHash XXH32 untuk input teks atau upload file. Hitung checksum 32-bit non-kriptografi cepat untuk verifikasi integritas data dan hashing berorientasi kinerja",
      },
      it: {
        name: "Hash xxHash (XXH32) di Testo o File",
        description:
          "Genera hash xxHash XXH32 per input di testo o caricamento file. Calcola checksum a 32 bit non crittografici veloci per la verifica dell'integrità dei dati e hashing orientato alle prestazioni",
      },
      ja: {
        name: "xxHash (XXH32) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのxxHash XXH32ハッシュを生成します。データ整合性検証とパフォーマンス重視のハッシュ化のための高速32ビット非暗号化チェックサムを計算",
      },
      ko: {
        name: "xxHash (XXH32) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 xxHash XXH32 해시를 생성합니다. 데이터 무결성 검증 및 성능 지향 해싱을 위한 빠른 32비트 비암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash xxHash (XXH32) Teks atau Fail",
        description:
          "Jana hash xxHash XXH32 untuk input teks atau muat naik fail. Kira checksum 32-bit bukan kriptografi pantas untuk pengesahan integriti data dan hash berorientasikan prestasi",
      },
      nl: {
        name: "xxHash (XXH32)-hash tekst of bestand",
        description:
          "Genereer xxHash XXH32-hash voor tekstinvoer of bestandsupload. Bereken snelle 32-bit niet-cryptografische checksums voor gegevensintegriteitsverificatie en prestatiegerichte hashing",
      },
      no: {
        name: "xxHash (XXH32)-hash tekst eller fil",
        description:
          "Generer xxHash XXH32-hash for tekstinndata eller filopplasting. Beregn raske 32-bits ikke-kryptografiske sjekksummer for dataintegritetsverifisering og ytelsesrettet hashing",
      },
      pl: {
        name: "Hash xxHash (XXH32) tekstu lub pliku",
        description:
          "Generuj hash xxHash XXH32 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj szybkie 32-bitowe nie-kryptograficzne sumy kontrolne do weryfikacji integralności danych i hashowania zorientowanego na wydajność",
      },
      pt: {
        name: "Hash xxHash (XXH32) de Texto ou Arquivo",
        description:
          "Gere hash xxHash XXH32 para entrada de texto ou upload de arquivo. Calcule checksums de 32 bits não criptográficos rápidos para verificação de integridade de dados e hashing orientado a performance",
      },
      ru: {
        name: "xxHash (XXH32)-хеш текста или файла",
        description:
          "Генерируйте xxHash XXH32-хеш для текстового ввода или загрузки файла. Вычисляйте быстрые 32-битные некриптографические контрольные суммы для проверки целостности данных и производительного хеширования",
      },
      sv: {
        name: "xxHash (XXH32)-hash text eller fil",
        description:
          "Generera xxHash XXH32-hash för textinmatning eller filuppladdning. Beräkna snabba 32-bitars icke-kryptografiska kontrollsummor för dataintegritetsverifiering och prestandaorienterad hash",
      },
      th: {
        name: "แฮช xxHash (XXH32) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช xxHash XXH32 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัม 32-บิตที่ไม่ใช่การเข้ารหัสที่รวดเร็วสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและการแฮชที่เน้นประสิทธิภาพ",
      },
      tr: {
        name: "xxHash (XXH32) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için xxHash XXH32 hash oluşturun. Veri bütünlüğü doğrulaması ve performans odaklı hash için hızlı 32-bit kriptografik olmayan sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash xxHash (XXH32) văn bản hoặc tệp",
        description:
          "Tạo hash xxHash XXH32 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum 32-bit không mã hóa nhanh để xác minh tính toàn vẹn dữ liệu và băm hướng hiệu suất",
      },
      "zh-CN": {
        name: "xxHash (XXH32) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 xxHash XXH32 哈希值。计算快速 32 位非加密校验和，用于数据完整性验证和性能导向的哈希计算",
      },
      "zh-TW": {
        name: "xxHash (XXH32) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 xxHash XXH32 雜湊值。計算快速 32 位元非加密校驗和，用於資料完整性驗證和效能導向的雜湊計算",
      },
    },
  },
  {
    slug: "xxhash-xxh64-hash-text-or-file",
    category: "crypto",
    icon: "lock",
    tags: [
      "hash",
      "xxhash",
      "xxh64",
      "checksum",
      "performance",
      "file",
      "text",
      "fast",
    ],
    locales: {
      ar: {
        name: "تجزئة xxHash (XXH64) للنص أو الملف",
        description:
          "إنشاء تجزئة xxHash XXH64 لإدخال النص أو تحميل الملف. احسب مجاميع التحقق 64 بت غير المشفرة السريعة للتحقق من سلامة البيانات والتجزئة الموجهة للأداء",
      },
      de: {
        name: "xxHash (XXH64)-Hash für Text oder Datei",
        description:
          "Generieren Sie xxHash XXH64-Hash für Texteingabe oder Datei-Upload. Berechnen Sie schnelle 64-Bit nicht-kryptographische Prüfsummen zur Datenintegritätsprüfung und leistungsorientierten Hashing",
      },
      en: {
        name: "xxHash (XXH64) Hash Text or File",
        description:
          "Generate xxHash XXH64 hash for text input or file upload. Calculate fast 64-bit non-cryptographic checksums for data integrity verification and performance-oriented hashing",
      },
      es: {
        name: "Hash xxHash (XXH64) de Texto o Archivo",
        description:
          "Genera hash xxHash XXH64 para entrada de texto o carga de archivo. Calcula sumas de verificación de 64 bits no criptográficas rápidas para verificación de integridad de datos y hashing orientado al rendimiento",
      },
      fr: {
        name: "Hash xxHash (XXH64) de Texte ou Fichier",
        description:
          "Générez un hash xxHash XXH64 pour la saisie de texte ou le téléchargement de fichier. Calculez des sommes de contrôle 64 bits non cryptographiques rapides pour la vérification de l'intégrité des données et le hachage orienté performance",
      },
      he: {
        name: "האש xxHash (XXH64) טקסט או קובץ",
        description:
          "צור האש xxHash XXH64 עבור קלט טקסט או העלאת קובץ. חשב סכומי בדיקה 64-ביט לא קריפטוגרפיים מהירים לאימות שלמות נתונים והאשינג מוכוון ביצועים",
      },
      hi: {
        name: "xxHash (XXH64) हैश टेक्स्ट या फ़ाइल",
        description:
          "टेक्स्ट इनपुट या फ़ाइल अपलोड के लिए xxHash XXH64 हैश जेनरेट करें। डेटा अखंडता सत्यापन और प्रदर्शन-उन्मुख हैशिंग के लिए तेज़ 64-बिट गैर-क्रिप्टोग्राफिक चेकसम की गणना करें",
      },
      id: {
        name: "Hash xxHash (XXH64) Teks atau File",
        description:
          "Buat hash xxHash XXH64 untuk input teks atau upload file. Hitung checksum 64-bit non-kriptografi cepat untuk verifikasi integritas data dan hashing berorientasi kinerja",
      },
      it: {
        name: "Hash xxHash (XXH64) di Testo o File",
        description:
          "Genera hash xxHash XXH64 per input di testo o caricamento file. Calcola checksum a 64 bit non crittografici veloci per la verifica dell'integrità dei dati e hashing orientato alle prestazioni",
      },
      ja: {
        name: "xxHash (XXH64) ハッシュ テキストまたはファイル",
        description:
          "テキスト入力またはファイルアップロードのxxHash XXH64ハッシュを生成します。データ整合性検証とパフォーマンス重視のハッシュ化のための高速64ビット非暗号化チェックサムを計算",
      },
      ko: {
        name: "xxHash (XXH64) 해시 텍스트 또는 파일",
        description:
          "텍스트 입력 또는 파일 업로드에 대한 xxHash XXH64 해시를 생성합니다. 데이터 무결성 검증 및 성능 지향 해싱을 위한 빠른 64비트 비암호화 체크섬을 계산하세요",
      },
      ms: {
        name: "Hash xxHash (XXH64) Teks atau Fail",
        description:
          "Jana hash xxHash XXH64 untuk input teks atau muat naik fail. Kira checksum 64-bit bukan kriptografi pantas untuk pengesahan integriti data dan hash berorientasikan prestasi",
      },
      nl: {
        name: "xxHash (XXH64)-hash tekst of bestand",
        description:
          "Genereer xxHash XXH64-hash voor tekstinvoer of bestandsupload. Bereken snelle 64-bit niet-cryptografische checksums voor gegevensintegriteitsverificatie en prestatiegerichte hashing",
      },
      no: {
        name: "xxHash (XXH64)-hash tekst eller fil",
        description:
          "Generer xxHash XXH64-hash for tekstinndata eller filopplasting. Beregn raske 64-bits ikke-kryptografiske sjekksummer for dataintegritetsverifisering og ytelsesrettet hashing",
      },
      pl: {
        name: "Hash xxHash (XXH64) tekstu lub pliku",
        description:
          "Generuj hash xxHash XXH64 dla wprowadzania tekstu lub przesyłania pliku. Obliczaj szybkie 64-bitowe nie-kryptograficzne sumy kontrolne do weryfikacji integralności danych i hashowania zorientowanego na wydajność",
      },
      pt: {
        name: "Hash xxHash (XXH64) de Texto ou Arquivo",
        description:
          "Gere hash xxHash XXH64 para entrada de texto ou upload de arquivo. Calcule checksums de 64 bits não criptográficos rápidos para verificação de integridade de dados e hashing orientado a performance",
      },
      ru: {
        name: "xxHash (XXH64)-хеш текста или файла",
        description:
          "Генерируйте xxHash XXH64-хеш для текстового ввода или загрузки файла. Вычисляйте быстрые 64-битные некриптографические контрольные суммы для проверки целостности данных и производительного хеширования",
      },
      sv: {
        name: "xxHash (XXH64)-hash text eller fil",
        description:
          "Generera xxHash XXH64-hash för textinmatning eller filuppladdning. Beräkna snabba 64-bitars icke-kryptografiska kontrollsummor för dataintegritetsverifiering och prestandaorienterad hash",
      },
      th: {
        name: "แฮช xxHash (XXH64) ข้อความหรือไฟล์",
        description:
          "สร้างแฮช xxHash XXH64 สำหรับการป้อนข้อความหรือการอัปโหลดไฟล์ คำนวณเช็คซัม 64-บิตที่ไม่ใช่การเข้ารหัสที่รวดเร็วสำหรับการตรวจสอบความสมบูรณ์ของข้อมูลและการแฮชที่เน้นประสิทธิภาพ",
      },
      tr: {
        name: "xxHash (XXH64) Hash Metin veya Dosya",
        description:
          "Metin girişi veya dosya yükleme için xxHash XXH64 hash oluşturun. Veri bütünlüğü doğrulaması ve performans odaklı hash için hızlı 64-bit kriptografik olmayan sağlama toplamları hesaplayın",
      },
      vi: {
        name: "Hash xxHash (XXH64) văn bản hoặc tệp",
        description:
          "Tạo hash xxHash XXH64 cho đầu vào văn bản hoặc tải lên tệp. Tính toán checksum 64-bit không mã hóa nhanh để xác minh tính toàn vẹn dữ liệu và băm hướng hiệu suất",
      },
      "zh-CN": {
        name: "xxHash (XXH64) 哈希文本或文件",
        description:
          "为文本输入或文件上传生成 xxHash XXH64 哈希值。计算快速 64 位非加密校验和，用于数据完整性验证和性能导向的哈希计算",
      },
      "zh-TW": {
        name: "xxHash (XXH64) 雜湊文字或檔案",
        description:
          "為文字輸入或檔案上傳產生 xxHash XXH64 雜湊值。計算快速 64 位元非加密校驗和，用於資料完整性驗證和效能導向的雜湊計算",
      },
    },
  },
  {
    slug: "yaml-to-json-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "json", "yaml", "converter"],
    locales: {
      ar: {
        name: "محول YAML → JSON",
        description:
          "حوّل YAML إلى JSON. الصق YAML أو استورد ملفًا؛ معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "YAML → JSON Konverter",
        description:
          "Wandelt YAML in JSON um. YAML einfügen oder Datei importieren; Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "YAML → JSON Converter",
        description:
          "Convert YAML to JSON. Paste YAML or import a file; preview, copy, and download.",
      },
      es: {
        name: "Convertidor YAML → JSON",
        description:
          "Convierte YAML a JSON. Pega YAML o importa un archivo; previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur YAML → JSON",
        description:
          "Convertissez YAML en JSON. Collez du YAML ou importez un fichier ; aperçu, copie et téléchargement.",
      },
      he: {
        name: "ממיר YAML → JSON",
        description:
          "המרת YAML ל‑JSON. הדביקו YAML או ייבאו קובץ; תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "YAML → JSON परिवर्तक",
        description:
          "YAML को JSON में बदलें। YAML पेस्ट करें या फ़ाइल आयात करें; पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi YAML → JSON",
        description:
          "Konversi YAML ke JSON. Tempel YAML atau impor berkas; pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore YAML → JSON",
        description:
          "Converti YAML in JSON. Incolla YAML o importa un file; anteprima, copia e download.",
      },
      ja: {
        name: "YAML → JSON 変換",
        description:
          "YAML を JSON に変換。YAML を貼り付けるかファイルを読み込み、プレビュー・コピー・ダウンロード。",
      },
      ko: {
        name: "YAML → JSON 변환기",
        description:
          "YAML을 JSON로 변환합니다. YAML 붙여넣기 또는 파일 가져오기; 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Penukar YAML → JSON",
        description:
          "Tukar YAML kepada JSON. Tampal YAML atau import fail; pratonton, salin dan muat turun.",
      },
      nl: {
        name: "YAML → JSON-converter",
        description:
          "Zet YAML om naar JSON. Plak YAML of importeer een bestand; bekijk, kopieer en download.",
      },
      no: {
        name: "YAML → JSON-omformer",
        description:
          "Konverter YAML til JSON. Lim inn YAML eller importer en fil; forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter YAML → JSON",
        description:
          "Konwertuj YAML na JSON. Wklej YAML lub zaimportuj plik; podgląd, kopiowanie i pobieranie.",
      },
      pt: {
        name: "Conversor YAML → JSON",
        description:
          "Converta YAML para JSON. Cole YAML ou importe um arquivo; visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер YAML → JSON",
        description:
          "Преобразуйте YAML в JSON. Вставьте YAML или импортируйте файл; просмотр, копирование и загрузка.",
      },
      sv: {
        name: "YAML → JSON-omvandlare",
        description:
          "Konvertera YAML till JSON. Klistra in YAML eller importera en fil; förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง YAML → JSON",
        description:
          "แปลง YAML เป็น JSON วาง YAML หรือ นำเข้าไฟล์; ดูตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "YAML → JSON Dönüştürücü",
        description:
          "YAML’u JSON’a dönüştürün. YAML yapıştırın veya dosya içe aktarın; önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình chuyển YAML → JSON",
        description:
          "Chuyển YAML sang JSON. Dán YAML hoặc nhập tệp; xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "YAML 转 JSON 转换器",
        description:
          "将 YAML 转为 JSON。粘贴 YAML 或导入文件；预览、复制并下载。",
      },
      "zh-TW": {
        name: "YAML 轉 JSON 轉換器",
        description:
          "將 YAML 轉為 JSON。貼上 YAML 或匯入檔案；預覽、複製並下載。",
      },
    },
  },
  {
    slug: "yaml-to-toml-converter",
    category: "json",
    icon: "file-json-2",
    tags: ["code", "yaml", "toml", "converter"],
    locales: {
      ar: {
        name: "محول YAML → TOML",
        description:
          "حوّل YAML إلى TOML. الصق YAML أو استورد ملفًا؛ معاينة ونسخ وتنزيل.",
      },
      de: {
        name: "YAML → TOML Konverter",
        description:
          "Wandelt YAML in TOML um. YAML einfügen oder Datei importieren; Vorschau, kopieren und herunterladen.",
      },
      en: {
        name: "YAML → TOML Converter",
        description:
          "Convert YAML to TOML. Paste YAML or import a file; preview, copy, and download.",
      },
      es: {
        name: "Convertidor YAML → TOML",
        description:
          "Convierte YAML a TOML. Pega YAML o importa un archivo; previsualiza, copia y descarga.",
      },
      fr: {
        name: "Convertisseur YAML → TOML",
        description:
          "Convertissez YAML en TOML. Collez du YAML ou importez un fichier ; aperçu, copie et téléchargement.",
      },
      he: {
        name: "ממיר YAML → TOML",
        description:
          "המרת YAML ל‑TOML. הדביקו YAML או ייבאו קובץ; תצוגה מקדימה, העתקה והורדה.",
      },
      hi: {
        name: "YAML → TOML परिवर्तक",
        description:
          "YAML को TOML में बदलें। YAML पेस्ट करें या फ़ाइल आयात करें; पूर्वावलोकन, कॉपी और डाउनलोड करें।",
      },
      id: {
        name: "Pengonversi YAML → TOML",
        description:
          "Konversi YAML ke TOML. Tempel YAML atau impor berkas; pratinjau, salin, dan unduh.",
      },
      it: {
        name: "Convertitore YAML → TOML",
        description:
          "Converti YAML in TOML. Incolla YAML o importa un file; anteprima, copia e download.",
      },
      ja: {
        name: "YAML → TOML 変換",
        description:
          "YAML を TOML に変換。YAML を貼り付けるかファイルを読み込み、プレビュー・コピー・ダウンロード。",
      },
      ko: {
        name: "YAML → TOML 변환기",
        description:
          "YAML을 TOML로 변환합니다. YAML 붙여넣기 또는 파일 가져오기; 미리보기, 복사, 다운로드.",
      },
      ms: {
        name: "Penukar YAML → TOML",
        description:
          "Tukar YAML kepada TOML. Tampal YAML atau import fail; pratonton, salin dan muat turun.",
      },
      nl: {
        name: "YAML → TOML-converter",
        description:
          "Zet YAML om naar TOML. Plak YAML of importeer een bestand; bekijk, kopieer en download.",
      },
      no: {
        name: "YAML → TOML-omformer",
        description:
          "Konverter YAML til TOML. Lim inn YAML eller importer en fil; forhåndsvis, kopier og last ned.",
      },
      pl: {
        name: "Konwerter YAML → TOML",
        description:
          "Konwertuj YAML na TOML. Wklej YAML lub zaimportuj plik; podgląd, kopiowanie i pobieranie.",
      },
      pt: {
        name: "Conversor YAML → TOML",
        description:
          "Converta YAML para TOML. Cole YAML ou importe um arquivo; visualize, copie e baixe.",
      },
      ru: {
        name: "Конвертер YAML → TOML",
        description:
          "Преобразуйте YAML в TOML. Вставьте YAML или импортируйте файл; просмотр, копирование и загрузка.",
      },
      sv: {
        name: "YAML → TOML-omvandlare",
        description:
          "Konvertera YAML till TOML. Klistra in YAML eller importera en fil; förhandsgranska, kopiera och ladda ner.",
      },
      th: {
        name: "ตัวแปลง YAML → TOML",
        description:
          "แปลง YAML เป็น TOML วาง YAML หรือ นำเข้าไฟล์; ดูตัวอย่าง คัดลอก และดาวน์โหลด",
      },
      tr: {
        name: "YAML → TOML Dönüştürücü",
        description:
          "YAML’u TOML’a dönüştürün. YAML yapıştırın veya dosya içe aktarın; önizleme, kopyalama ve indirme.",
      },
      vi: {
        name: "Trình chuyển YAML → TOML",
        description:
          "Chuyển YAML sang TOML. Dán YAML hoặc nhập tệp; xem trước, sao chép và tải xuống.",
      },
      "zh-CN": {
        name: "YAML 转 TOML 转换器",
        description:
          "将 YAML 转为 TOML。粘贴 YAML 或导入文件；预览、复制并下载。",
      },
      "zh-TW": {
        name: "YAML 轉 TOML 轉換器",
        description:
          "將 YAML 轉為 TOML。貼上 YAML 或匯入檔案；預覽、複製並下載。",
      },
    },
  },
]
