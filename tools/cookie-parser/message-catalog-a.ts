const MESSAGE_CATALOG_A = {
  ar: {
    configurationLabel: "خيارات",
    configurationDescription:
      "اختر ما إذا كان النص الملصق يجب تحليله كعنوان Cookie أو كعناوين Set-Cookie.",
    headerTypeLabel: "نوع الترويسة",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "الإدخال",
    inputDescription:
      "الصق نص ترويسات HTTP الخام هنا. بادئات الترويسة اختيارية.",
    inputPlaceholder: "الصق ترويسات Cookie أو Set-Cookie هنا...",
    outputLabel: "JSON المُحلَّل",
    outputDescription:
      "راجع بيانات ملفات تعريف الارتباط المنظمة، ثم انسخ JSON أو نزّله.",
    outputPlaceholder: "سيظهر JSON المحلل هنا...",
    copyOutputLabel: "نسخ JSON",
    downloadJsonLabel: "تنزيل JSON",
    copiedLabel: "تم النسخ",
    resetExampleLabel: "إعادة تعيين المثال",
    noCookiesFoundLabel: "لم يتم العثور على أي ملفات تعريف ارتباط",
    invalidSegmentsLabel: "تم تخطي المقاطع غير الصالحة",
  },
  de: {
    configurationLabel: "Optionen",
    configurationDescription:
      "Wähle aus, ob der eingefügte Text als Cookie-Header oder als Set-Cookie-Header geparst werden soll.",
    headerTypeLabel: "Header-Typ",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "Eingabe",
    inputDescription:
      "Füge hier rohen HTTP-Headertext ein. Header-Präfixe sind optional.",
    inputPlaceholder: "Cookie- oder Set-Cookie-Header hier einfügen...",
    outputLabel: "Geparstes JSON",
    outputDescription:
      "Prüfe die strukturierten Cookie-Daten und kopiere oder lade danach das JSON herunter.",
    outputPlaceholder: "Geparstes JSON erscheint hier...",
    copyOutputLabel: "JSON kopieren",
    downloadJsonLabel: "JSON herunterladen",
    copiedLabel: "Kopiert",
    resetExampleLabel: "Beispiel zurücksetzen",
    noCookiesFoundLabel: "Keine Cookies gefunden",
    invalidSegmentsLabel: "Ungültige Segmente übersprungen",
  },
  en: {
    configurationLabel: "Options",
    configurationDescription:
      "Choose whether the pasted text should be parsed as a Cookie header or Set-Cookie headers.",
    headerTypeLabel: "Header Type",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "Input",
    inputDescription:
      "Paste raw HTTP header text here. Header prefixes are optional.",
    inputPlaceholder: "Paste Cookie or Set-Cookie headers here...",
    outputLabel: "Parsed JSON",
    outputDescription:
      "Review the structured cookie data, then copy or download the JSON.",
    outputPlaceholder: "Parsed JSON will appear here...",
    copyOutputLabel: "Copy JSON",
    downloadJsonLabel: "Download JSON",
    copiedLabel: "Copied",
    resetExampleLabel: "Reset example",
    noCookiesFoundLabel: "No cookies found",
    invalidSegmentsLabel: "Skipped invalid segments",
  },
  es: {
    configurationLabel: "Opciones",
    configurationDescription:
      "Elige si el texto pegado debe analizarse como un encabezado Cookie o como encabezados Set-Cookie.",
    headerTypeLabel: "Tipo de encabezado",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "Entrada",
    inputDescription:
      "Pega aquí texto de encabezados HTTP en bruto. Los prefijos del encabezado son opcionales.",
    inputPlaceholder: "Pega encabezados Cookie o Set-Cookie aquí...",
    outputLabel: "JSON analizado",
    outputDescription:
      "Revisa los datos estructurados de las cookies y luego copia o descarga el JSON.",
    outputPlaceholder: "El JSON analizado aparecerá aquí...",
    copyOutputLabel: "Copiar JSON",
    downloadJsonLabel: "Descargar JSON",
    copiedLabel: "Copiado",
    resetExampleLabel: "Restablecer ejemplo",
    noCookiesFoundLabel: "No se encontraron cookies",
    invalidSegmentsLabel: "Se omitieron segmentos no válidos",
  },
  fr: {
    configurationLabel: "Options",
    configurationDescription:
      "Choisissez si le texte collé doit être analysé comme un en-tête Cookie ou comme des en-têtes Set-Cookie.",
    headerTypeLabel: "Type d’en-tête",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "Entrée",
    inputDescription:
      "Collez ici le texte brut des en-têtes HTTP. Les préfixes d’en-tête sont facultatifs.",
    inputPlaceholder: "Collez les en-têtes Cookie ou Set-Cookie ici...",
    outputLabel: "JSON analysé",
    outputDescription:
      "Vérifiez les données de cookies structurées, puis copiez ou téléchargez le JSON.",
    outputPlaceholder: "Le JSON analysé apparaîtra ici...",
    copyOutputLabel: "Copier le JSON",
    downloadJsonLabel: "Télécharger JSON",
    copiedLabel: "Copié",
    resetExampleLabel: "Réinitialiser l’exemple",
    noCookiesFoundLabel: "Aucun cookie trouvé",
    invalidSegmentsLabel: "Segments invalides ignorés",
  },
  he: {
    configurationLabel: "אפשרויות",
    configurationDescription:
      "בחרו אם הטקסט שהודבק צריך להתפרש ככותרת Cookie או ככותרות Set-Cookie.",
    headerTypeLabel: "סוג כותרת",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "קלט",
    inputDescription:
      "הדביקו כאן טקסט גולמי של כותרות HTTP. קידומות הכותרת אופציונליות.",
    inputPlaceholder: "הדביקו כאן כותרות Cookie או Set-Cookie...",
    outputLabel: "JSON מפוענח",
    outputDescription:
      "בדקו את נתוני העוגיות המובנים ואז העתיקו או הורידו את ה-JSON.",
    outputPlaceholder: "ה-JSON המפוענח יופיע כאן...",
    copyOutputLabel: "העתק JSON",
    downloadJsonLabel: "הורד JSON",
    copiedLabel: "הועתק",
    resetExampleLabel: "אפס דוגמה",
    noCookiesFoundLabel: "לא נמצאו עוגיות",
    invalidSegmentsLabel: "מקטעים לא תקינים דולגו",
  },
  hi: {
    configurationLabel: "विकल्प",
    configurationDescription:
      "चुनें कि चिपकाए गए टेक्स्ट को Cookie हेडर की तरह पार्स करना है या Set-Cookie हेडर्स की तरह।",
    headerTypeLabel: "हेडर प्रकार",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "इनपुट",
    inputDescription:
      "यहाँ raw HTTP header text पेस्ट करें। Header prefixes वैकल्पिक हैं।",
    inputPlaceholder: "यहां Cookie या Set-Cookie हेडर पेस्ट करें...",
    outputLabel: "पार्स किया गया JSON",
    outputDescription:
      "संरचित cookie डेटा की समीक्षा करें, फिर JSON को कॉपी या डाउनलोड करें।",
    outputPlaceholder: "पार्स किया गया JSON यहां दिखाई देगा...",
    copyOutputLabel: "JSON कॉपी करें",
    downloadJsonLabel: "JSON डाउनलोड करें",
    copiedLabel: "कॉपी किया गया",
    resetExampleLabel: "उदाहरण रीसेट करें",
    noCookiesFoundLabel: "कोई कुकी नहीं मिली",
    invalidSegmentsLabel: "अमान्य खंड छोड़ दिए गए",
  },
  id: {
    configurationLabel: "Opsi",
    configurationDescription:
      "Pilih apakah teks yang ditempel harus diurai sebagai header Cookie atau header Set-Cookie.",
    headerTypeLabel: "Jenis Header",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "Input",
    inputDescription:
      "Tempel teks header HTTP mentah di sini. Prefiks header bersifat opsional.",
    inputPlaceholder: "Tempel header Cookie atau Set-Cookie di sini...",
    outputLabel: "JSON hasil parsing",
    outputDescription:
      "Tinjau data cookie terstruktur, lalu salin atau unduh JSON-nya.",
    outputPlaceholder: "JSON hasil parsing akan muncul di sini...",
    copyOutputLabel: "Salin JSON",
    downloadJsonLabel: "Unduh JSON",
    copiedLabel: "Tersalin",
    resetExampleLabel: "Setel ulang contoh",
    noCookiesFoundLabel: "Cookie tidak ditemukan",
    invalidSegmentsLabel: "Segmen tidak valid dilewati",
  },
  it: {
    configurationLabel: "Opzioni",
    configurationDescription:
      "Scegli se il testo incollato deve essere analizzato come header Cookie o come header Set-Cookie.",
    headerTypeLabel: "Tipo di header",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "Input",
    inputDescription:
      "Incolla qui il testo grezzo degli header HTTP. I prefissi sono facoltativi.",
    inputPlaceholder: "Incolla qui gli header Cookie o Set-Cookie...",
    outputLabel: "JSON analizzato",
    outputDescription:
      "Controlla i dati cookie strutturati, poi copia o scarica il JSON.",
    outputPlaceholder: "Il JSON analizzato apparirà qui...",
    copyOutputLabel: "Copia JSON",
    downloadJsonLabel: "Scarica JSON",
    copiedLabel: "Copiato",
    resetExampleLabel: "Reimposta esempio",
    noCookiesFoundLabel: "Nessun cookie trovato",
    invalidSegmentsLabel: "Segmenti non validi ignorati",
  },
  ja: {
    configurationLabel: "オプション",
    configurationDescription:
      "貼り付けたテキストを Cookie ヘッダーとして解析するか、Set-Cookie ヘッダーとして解析するかを選択します。",
    headerTypeLabel: "ヘッダー種別",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "入力",
    inputDescription:
      "ここに生の HTTP ヘッダーテキストを貼り付けます。ヘッダープレフィックスは省略できます。",
    inputPlaceholder:
      "Cookie または Set-Cookie ヘッダーを貼り付けてください...",
    outputLabel: "解析済み JSON",
    outputDescription:
      "構造化された Cookie データを確認してから、JSON をコピーまたはダウンロードします。",
    outputPlaceholder: "解析済み JSON がここに表示されます...",
    copyOutputLabel: "JSON をコピー",
    downloadJsonLabel: "JSON をダウンロード",
    copiedLabel: "コピーしました",
    resetExampleLabel: "サンプルをリセット",
    noCookiesFoundLabel: "Cookie が見つかりません",
    invalidSegmentsLabel: "無効なセグメントをスキップしました",
  },
  ko: {
    configurationLabel: "옵션",
    configurationDescription:
      "붙여 넣은 텍스트를 Cookie 헤더로 파싱할지 Set-Cookie 헤더로 파싱할지 선택하세요.",
    headerTypeLabel: "헤더 유형",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "입력",
    inputDescription:
      "여기에 원시 HTTP 헤더 텍스트를 붙여 넣으세요. 헤더 접두사는 선택 사항입니다.",
    inputPlaceholder: "Cookie 또는 Set-Cookie 헤더를 붙여넣으세요...",
    outputLabel: "파싱된 JSON",
    outputDescription:
      "구조화된 쿠키 데이터를 검토한 뒤 JSON을 복사하거나 다운로드하세요.",
    outputPlaceholder: "파싱된 JSON이 여기에 표시됩니다...",
    copyOutputLabel: "JSON 복사",
    downloadJsonLabel: "JSON 다운로드",
    copiedLabel: "복사됨",
    resetExampleLabel: "예제 재설정",
    noCookiesFoundLabel: "쿠키를 찾을 수 없습니다",
    invalidSegmentsLabel: "유효하지 않은 항목을 건너뛰었습니다",
  },
  ms: {
    configurationLabel: "Pilihan",
    configurationDescription:
      "Pilih sama ada teks yang ditampal perlu dihuraikan sebagai pengepala Cookie atau pengepala Set-Cookie.",
    headerTypeLabel: "Jenis Pengepala",
    headerCookieLabel: "Cookie",
    headerSetCookieLabel: "Set-Cookie",
    inputLabel: "Input",
    inputDescription:
      "Tampal teks pengepala HTTP mentah di sini. Awalan pengepala adalah pilihan.",
    inputPlaceholder: "Tampal pengepala Cookie atau Set-Cookie di sini...",
    outputLabel: "JSON terhurai",
    outputDescription:
      "Semak data cookie berstruktur, kemudian salin atau muat turun JSON.",
    outputPlaceholder: "JSON terhurai akan dipaparkan di sini...",
    copyOutputLabel: "Salin JSON",
    downloadJsonLabel: "Muat turun JSON",
    copiedLabel: "Disalin",
    resetExampleLabel: "Tetapkan semula contoh",
    noCookiesFoundLabel: "Tiada cookie ditemui",
    invalidSegmentsLabel: "Segmen tidak sah dilangkau",
  },
} as const

export { MESSAGE_CATALOG_A }
