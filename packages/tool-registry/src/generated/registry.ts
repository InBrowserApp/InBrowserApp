import type { ToolRegistryEntry } from "../types"

export const toolRegistry: readonly ToolRegistryEntry[] = [
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

export const toolRegistryBySlug: Record<string, ToolRegistryEntry> = {
  "base64-encoder-decoder": {
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
  "csv-to-json-converter": {
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
  "image-resizer": {
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
  "json-formatter": {
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
  "json-schema-validator": {
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
  "json-to-csv-converter": {
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
  "json-to-toml-converter": {
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
  "json-to-xml-converter": {
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
  "json-to-yaml-converter": {
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
  "toml-to-json-converter": {
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
  "toml-to-yaml-converter": {
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
  "xml-to-json-converter": {
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
  "yaml-to-json-converter": {
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
  "yaml-to-toml-converter": {
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
}
