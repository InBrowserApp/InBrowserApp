import type { ToolSearchIndexEntry } from "../types"

export const toolSearchIndex: readonly ToolSearchIndexEntry[] = [
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
]
