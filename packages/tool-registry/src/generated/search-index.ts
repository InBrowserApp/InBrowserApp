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
