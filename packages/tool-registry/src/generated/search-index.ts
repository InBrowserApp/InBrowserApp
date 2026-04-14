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
