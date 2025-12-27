export const metadata = {
  id: 'roman-numeral-converter',
  tags: ['converters', 'roman', 'numeral', 'number'],
  features: ['offline'],

  meta: {
    en: {
      ui: {
        name: 'Roman Numeral ↔ Arabic Number Converter',
        description:
          'Bidirectional converter between Roman numerals and Arabic numbers. Supports standard Roman numerals from 1 to 3999 (I to MMMCMXCIX).',
        arabicNumber: 'Arabic Number (1-3999)',
        romanNumeral: 'Roman Numeral',
        arabicPlaceholder: 'Enter Arabic number...',
        romanPlaceholder: 'Enter Roman numeral...',
        copy: 'Copy',
        errorArabicRange: 'Please enter a number between 1 and 3999',
        errorInvalidRoman: 'Please enter a valid Roman numeral',
        whatIsTitle: 'What are Roman Numerals?',
        whatIsDescription:
          'Roman numerals are a numeral system originating in ancient Rome, using letters from the Latin alphabet to represent numbers. The basic symbols are I (1), V (5), X (10), L (50), C (100), D (500), and M (1000). Numbers are formed by combining these symbols according to specific rules: symbols are typically added together (VI = 6), but when a smaller numeral appears before a larger one, it is subtracted (IV = 4). This system was widely used throughout the Roman Empire and medieval Europe, and continues to be used today for decorative purposes, clock faces, movie copyright dates, and numbered lists.',
      },
    },
    zh: {
      ui: {
        name: '罗马数字 ↔ 阿拉伯数字转换器',
        description: '罗马数字与阿拉伯数字双向转换。支持标准罗马数字 1 到 3999（I 到 MMMCMXCIX）。',
        arabicNumber: '阿拉伯数字 (1-3999)',
        romanNumeral: '罗马数字',
        arabicPlaceholder: '输入阿拉伯数字...',
        romanPlaceholder: '输入罗马数字...',
        copy: '复制',
        errorArabicRange: '请输入 1 到 3999 之间的数字',
        errorInvalidRoman: '请输入有效的罗马数字',
        whatIsTitle: '什么是罗马数字？',
        whatIsDescription:
          '罗马数字是起源于古罗马的数字系统，使用拉丁字母来表示数字。基本符号是 I (1)、V (5)、X (10)、L (50)、C (100)、D (500) 和 M (1000)。数字通过按特定规则组合这些符号形成：符号通常相加（VI = 6），但当较小的数字出现在较大数字之前时，则相减（IV = 4）。这个系统在罗马帝国和中世纪欧洲广泛使用，至今仍用于装饰目的、钟表面、电影版权日期和编号列表。',
      },
    },
    'zh-CN': {
      ui: {
        name: '罗马数字 ↔ 阿拉伯数字转换器',
        description: '罗马数字与阿拉伯数字双向转换。支持标准罗马数字 1 到 3999（I 到 MMMCMXCIX）。',
        arabicNumber: '阿拉伯数字 (1-3999)',
        romanNumeral: '罗马数字',
        arabicPlaceholder: '输入阿拉伯数字...',
        romanPlaceholder: '输入罗马数字...',
        copy: '复制',
        errorArabicRange: '请输入 1 到 3999 之间的数字',
        errorInvalidRoman: '请输入有效的罗马数字',
        whatIsTitle: '什么是罗马数字？',
        whatIsDescription:
          '罗马数字是起源于古罗马的数字系统，使用拉丁字母来表示数字。基本符号是 I (1)、V (5)、X (10)、L (50)、C (100)、D (500) 和 M (1000)。数字通过按特定规则组合这些符号形成：符号通常相加（VI = 6），但当较小的数字出现在较大数字之前时，则相减（IV = 4）。这个系统在罗马帝国和中世纪欧洲广泛使用，至今仍用于装饰目的、钟表面、电影版权日期和编号列表。',
      },
    },
    'zh-TW': {
      ui: {
        name: '羅馬數字 ↔ 阿拉伯數字轉換器',
        description: '羅馬數字與阿拉伯數字雙向轉換。支援標準羅馬數字 1 到 3999（I 到 MMMCMXCIX）。',
        arabicNumber: '阿拉伯數字 (1-3999)',
        romanNumeral: '羅馬數字',
        arabicPlaceholder: '輸入阿拉伯數字...',
        romanPlaceholder: '輸入羅馬數字...',
        copy: '複製',
        errorArabicRange: '請輸入 1 到 3999 之間的數字',
        errorInvalidRoman: '請輸入有效的羅馬數字',
        whatIsTitle: '什麼是羅馬數字？',
        whatIsDescription:
          '羅馬數字是起源於古羅馬的數字系統，使用拉丁字母來表示數字。基本符號是 I (1)、V (5)、X (10)、L (50)、C (100)、D (500) 和 M (1000)。數字通過按特定規則組合這些符號形成：符號通常相加（VI = 6），但當較小的數字出現在較大數字之前時，則相減（IV = 4）。這個系統在羅馬帝國和中世紀歐洲廣泛使用，至今仍用於裝飾目的、鐘錶面、電影版權日期和編號列表。',
      },
    },
    'zh-HK': {
      ui: {
        name: '羅馬數字 ↔ 阿拉伯數字轉換器',
        description: '羅馬數字與阿拉伯數字雙向轉換。支援標準羅馬數字 1 到 3999（I 到 MMMCMXCIX）。',
        arabicNumber: '阿拉伯數字 (1-3999)',
        romanNumeral: '羅馬數字',
        arabicPlaceholder: '輸入阿拉伯數字...',
        romanPlaceholder: '輸入羅馬數字...',
        copy: '複製',
        errorArabicRange: '請輸入 1 到 3999 之間的數字',
        errorInvalidRoman: '請輸入有效的羅馬數字',
        whatIsTitle: '什麼是羅馬數字？',
        whatIsDescription:
          '羅馬數字是起源於古羅馬的數字系統，使用拉丁字母來表示數字。基本符號是 I (1)、V (5)、X (10)、L (50)、C (100)、D (500) 和 M (1000)。數字通過按特定規則組合這些符號形成：符號通常相加（VI = 6），但當較小的數字出現在較大數字之前時，則相減（IV = 4）。這個系統在羅馬帝國和中世紀歐洲廣泛使用，至今仍用於裝飾目的、鐘錶面、電影版權日期和編號列表。',
      },
    },
    es: {
      ui: {
        name: 'Conversor Arábigo ↔ Romano',
        description:
          'Conversor bidireccional entre números romanos y arábigos. Soporta números romanos estándar del 1 al 3999 (I a MMMCMXCIX).',
        arabicNumber: 'Número Arábigo (1-3999)',
        romanNumeral: 'Número Romano',
        arabicPlaceholder: 'Ingresa número arábigo...',
        romanPlaceholder: 'Ingresa número romano...',
        copy: 'Copiar',
        errorArabicRange: 'Por favor ingresa un número entre 1 y 3999',
        errorInvalidRoman: 'Por favor ingresa un número romano válido',
        whatIsTitle: '¿Qué son los números romanos?',
        whatIsDescription:
          'Los números romanos son un sistema numérico originario de la antigua Roma, que utiliza letras del alfabeto latino para representar números. Los símbolos básicos son I (1), V (5), X (10), L (50), C (100), D (500) y M (1000). Los números se forman combinando estos símbolos según reglas específicas: los símbolos normalmente se suman (VI = 6), pero cuando un numeral menor aparece antes que uno mayor, se resta (IV = 4). Este sistema fue ampliamente utilizado en el Imperio Romano y la Europa medieval, y continúa usándose hoy para propósitos decorativos, caras de relojes, fechas de derechos de autor de películas y listas numeradas.',
      },
    },
    fr: {
      ui: {
        name: 'Convertisseur Arabe ↔ Romain',
        description:
          'Convertisseur bidirectionnel entre les chiffres romains et arabes. Prend en charge les chiffres romains standard de 1 à 3999 (I à MMMCMXCIX).',
        arabicNumber: 'Nombre Arabe (1-3999)',
        romanNumeral: 'Nombre Romain',
        arabicPlaceholder: 'Entrez un nombre arabe...',
        romanPlaceholder: 'Entrez un nombre romain...',
        copy: 'Copier',
        errorArabicRange: 'Veuillez entrer un nombre entre 1 et 3999',
        errorInvalidRoman: 'Veuillez entrer un nombre romain valide',
        whatIsTitle: 'Que sont les chiffres romains ?',
        whatIsDescription:
          "Les chiffres romains sont un système numéral originaire de la Rome antique, utilisant des lettres de l'alphabet latin pour représenter les nombres. Les symboles de base sont I (1), V (5), X (10), L (50), C (100), D (500) et M (1000). Les nombres sont formés en combinant ces symboles selon des règles spécifiques : les symboles sont généralement additionnés (VI = 6), mais quand un chiffre plus petit apparaît avant un plus grand, il est soustrait (IV = 4). Ce système était largement utilisé dans l'Empire romain et l'Europe médiévale, et continue d'être utilisé aujourd'hui à des fins décoratives, sur les cadrans d'horloge, les dates de droits d'auteur de films et les listes numérotées.",
      },
    },
    de: {
      ui: {
        name: 'Arabisch ↔ Römisch Konverter',
        description:
          'Bidirektionaler Konverter zwischen römischen und arabischen Zahlen. Unterstützt Standard-Römerzahlen von 1 bis 3999 (I bis MMMCMXCIX).',
        arabicNumber: 'Arabische Zahl (1-3999)',
        romanNumeral: 'Römische Zahl',
        arabicPlaceholder: 'Arabische Zahl eingeben...',
        romanPlaceholder: 'Römische Zahl eingeben...',
        copy: 'Kopieren',
        errorArabicRange: 'Bitte geben Sie eine Zahl zwischen 1 und 3999 ein',
        errorInvalidRoman: 'Bitte geben Sie eine gültige römische Zahl ein',
        whatIsTitle: 'Was sind römische Zahlen?',
        whatIsDescription:
          'Römische Zahlen sind ein Zahlensystem, das im antiken Rom entstanden ist und Buchstaben des lateinischen Alphabets zur Darstellung von Zahlen verwendet. Die Grundsymbole sind I (1), V (5), X (10), L (50), C (100), D (500) und M (1000). Zahlen werden durch die Kombination dieser Symbole nach bestimmten Regeln gebildet: Symbole werden normalerweise addiert (VI = 6), aber wenn eine kleinere Zahl vor einer größeren steht, wird sie subtrahiert (IV = 4). Dieses System war im Römischen Reich und im mittelalterlichen Europa weit verbreitet und wird heute noch für dekorative Zwecke, Uhrengesichter, Film-Copyright-Daten und nummerierte Listen verwendet.',
      },
    },
    it: {
      ui: {
        name: 'Convertitore Arabo ↔ Romano',
        description:
          'Convertitore bidirezionale tra numeri romani e arabi. Supporta numeri romani standard da 1 a 3999 (I a MMMCMXCIX).',
        arabicNumber: 'Numero Arabo (1-3999)',
        romanNumeral: 'Numero Romano',
        arabicPlaceholder: 'Inserisci numero arabo...',
        romanPlaceholder: 'Inserisci numero romano...',
        copy: 'Copia',
        errorArabicRange: 'Inserisci un numero tra 1 e 3999',
        errorInvalidRoman: 'Inserisci un numero romano valido',
        whatIsTitle: 'Cosa sono i numeri romani?',
        whatIsDescription:
          "I numeri romani sono un sistema di numerazione originario dell'antica Roma, che utilizza lettere dell'alfabeto latino per rappresentare i numeri. I simboli base sono I (1), V (5), X (10), L (50), C (100), D (500) e M (1000). I numeri si formano combinando questi simboli secondo regole specifiche: i simboli sono tipicamente sommati (VI = 6), ma quando un numero più piccolo appare prima di uno più grande, viene sottratto (IV = 4). Questo sistema era ampiamente utilizzato nell'Impero Romano e nell'Europa medievale, e continua ad essere usato oggi per scopi decorativi, quadranti di orologi, date di copyright di film e liste numerate.",
      },
    },
    ja: {
      ui: {
        name: 'ローマ数字 ↔ アラビア数字コンバーター',
        description:
          'ローマ数字とアラビア数字の双方向変換。標準的なローマ数字 1 から 3999（I から MMMCMXCIX）をサポート。',
        arabicNumber: 'アラビア数字 (1-3999)',
        romanNumeral: 'ローマ数字',
        arabicPlaceholder: 'アラビア数字を入力...',
        romanPlaceholder: 'ローマ数字を入力...',
        copy: 'コピー',
        errorArabicRange: '1から3999の間の数字を入力してください',
        errorInvalidRoman: '有効なローマ数字を入力してください',
        whatIsTitle: 'ローマ数字とは？',
        whatIsDescription:
          'ローマ数字は古代ローマに起源を持つ記数法で、ラテン文字を使って数を表現します。基本記号は I (1)、V (5)、X (10)、L (50)、C (100)、D (500)、M (1000) です。数字は特定のルールに従ってこれらの記号を組み合わせて作られます：記号は通常足し算されます（VI = 6）が、小さい数字が大きい数字の前に現れる場合は引き算されます（IV = 4）。このシステムはローマ帝国と中世ヨーロッパで広く使用され、今日でも装飾目的、時計の文字盤、映画の著作権日付、番号付きリストに使用されています。',
      },
    },
    ko: {
      ui: {
        name: '아라비아 ↔ 로마 숫자 변환기',
        description:
          '로마 숫자와 아라비아 숫자 간 양방향 변환. 표준 로마 숫자 1~3999 (I~MMMCMXCIX) 지원.',
        arabicNumber: '아라비아 숫자 (1-3999)',
        romanNumeral: '로마 숫자',
        arabicPlaceholder: '아라비아 숫자 입력...',
        romanPlaceholder: '로마 숫자 입력...',
        copy: '복사',
        errorArabicRange: '1에서 3999 사이의 숫자를 입력하세요',
        errorInvalidRoman: '유효한 로마 숫자를 입력하세요',
        whatIsTitle: '로마 숫자란?',
        whatIsDescription:
          '로마 숫자는 고대 로마에서 시작된 수 체계로, 라틴 알파벳의 문자를 사용하여 숫자를 나타냅니다. 기본 기호는 I (1), V (5), X (10), L (50), C (100), D (500), M (1000)입니다. 숫자는 특정 규칙에 따라 이러한 기호를 조합하여 형성됩니다: 기호는 일반적으로 더해지지만 (VI = 6), 작은 숫자가 큰 숫자 앞에 나타날 때는 빼집니다 (IV = 4). 이 시스템은 로마 제국과 중세 유럽에서 널리 사용되었으며, 오늘날에도 장식용, 시계 문자판, 영화 저작권 날짜, 번호 매기기 목록에 계속 사용됩니다.',
      },
    },
    ru: {
      ui: {
        name: 'Конвертер Арабские ↔ Римские цифры',
        description:
          'Двунаправленный преобразователь римских и арабских цифр. Поддерживает стандартные римские цифры от 1 до 3999 (I до MMMCMXCIX).',
        arabicNumber: 'Арабское число (1-3999)',
        romanNumeral: 'Римское число',
        arabicPlaceholder: 'Введите арабское число...',
        romanPlaceholder: 'Введите римское число...',
        copy: 'Копировать',
        errorArabicRange: 'Пожалуйста, введите число от 1 до 3999',
        errorInvalidRoman: 'Пожалуйста, введите корректное римское число',
        whatIsTitle: 'Что такое римские цифры?',
        whatIsDescription:
          'Римские цифры — это система счисления, возникшая в Древнем Риме, использующая буквы латинского алфавита для представления чисел. Основные символы: I (1), V (5), X (10), L (50), C (100), D (500) и M (1000). Числа формируются путем комбинирования этих символов по определенным правилам: символы обычно складываются (VI = 6), но когда меньший символ стоит перед большим, он вычитается (IV = 4). Эта система широко использовалась в Римской империи и средневековой Европе и продолжает использоваться сегодня в декоративных целях, на циферблатах часов, в датах авторских прав фильмов и нумерованных списках.',
      },
    },
    pt: {
      ui: {
        name: 'Conversor Arábico ↔ Romano',
        description:
          'Conversor bidirecional entre números romanos e arábicos. Suporta números romanos padrão de 1 a 3999 (I a MMMCMXCIX).',
        arabicNumber: 'Número Arábico (1-3999)',
        romanNumeral: 'Número Romano',
        arabicPlaceholder: 'Insira número arábico...',
        romanPlaceholder: 'Insira número romano...',
        copy: 'Copiar',
        errorArabicRange: 'Por favor insira um número entre 1 e 3999',
        errorInvalidRoman: 'Por favor insira um número romano válido',
        whatIsTitle: 'O que são números romanos?',
        whatIsDescription:
          'Os números romanos são um sistema numérico originário da Roma antiga, usando letras do alfabeto latino para representar números. Os símbolos básicos são I (1), V (5), X (10), L (50), C (100), D (500) e M (1000). Os números são formados combinando esses símbolos de acordo com regras específicas: os símbolos são tipicamente somados (VI = 6), mas quando um numeral menor aparece antes de um maior, ele é subtraído (IV = 4). Este sistema foi amplamente usado no Império Romano e na Europa medieval, e continua sendo usado hoje para propósitos decorativos, faces de relógios, datas de direitos autorais de filmes e listas numeradas.',
      },
    },
    ar: {
      ui: {
        name: 'محول الأرقام العربية ↔ الرومانية',
        description:
          'محول ثنائي الاتجاه بين الأرقام الرومانية والعربية. يدعم الأرقام الرومانية القياسية من 1 إلى 3999 (I إلى MMMCMXCIX).',
        arabicNumber: 'رقم عربي (1-3999)',
        romanNumeral: 'رقم روماني',
        arabicPlaceholder: 'أدخل رقم عربي...',
        romanPlaceholder: 'أدخل رقم روماني...',
        copy: 'نسخ',
        errorArabicRange: 'يرجى إدخال رقم بين 1 و 3999',
        errorInvalidRoman: 'يرجى إدخال رقم روماني صحيح',
        whatIsTitle: 'ما هي الأرقام الرومانية؟',
        whatIsDescription:
          'الأرقام الرومانية هي نظام عددي نشأ في روما القديمة، يستخدم أحرف الأبجدية اللاتينية لتمثيل الأرقام. الرموز الأساسية هي I (1)، V (5)، X (10)، L (50)، C (100)، D (500)، و M (1000). تتكون الأرقام من خلال دمج هذه الرموز وفقاً لقواعد محددة: عادة ما تُجمع الرموز (VI = 6)، ولكن عندما يظهر رقم أصغر قبل رقم أكبر، يتم طرحه (IV = 4). استُخدم هذا النظام على نطاق واسع في الإمبراطورية الرومانية وأوروبا في العصور الوسطى، ولا يزال يُستخدم اليوم للأغراض الزخرفية، وأوجه الساعات، وتواريخ حقوق الطبع والنشر للأفلام، والقوائم المرقمة.',
      },
    },
    hi: {
      ui: {
        name: 'अरबी ↔ रोमन अंक कनवर्टर',
        description:
          'रोमन अंकों और अरबी संख्याओं के बीच द्विदिशीय कनवर्टर। मानक रोमन अंक 1 से 3999 (I से MMMCMXCIX) का समर्थन करता है।',
        arabicNumber: 'अरबी संख्या (1-3999)',
        romanNumeral: 'रोमन अंक',
        arabicPlaceholder: 'अरबी संख्या दर्ज करें...',
        romanPlaceholder: 'रोमन अंक दर्ज करें...',
        copy: 'कॉपी करें',
        errorArabicRange: 'कृपया 1 से 3999 के बीच की संख्या दर्ज करें',
        errorInvalidRoman: 'कृपया एक वैध रोमन अंक दर्ज करें',
        whatIsTitle: 'रोमन अंक क्या हैं?',
        whatIsDescription:
          'रोमन अंक एक संख्या प्रणाली है जिसकी उत्पत्ति प्राचीन रोम में हुई थी, जो संख्याओं को दर्शाने के लिए लैटिन वर्णमाला के अक्षरों का उपयोग करती है। मूल प्रतीक हैं I (1), V (5), X (10), L (50), C (100), D (500), और M (1000)। संख्याएं विशिष्ट नियमों के अनुसार इन प्रतीकों को मिलाकर बनाई जाती हैं: प्रतीकों को आम तौर पर जोड़ा जाता है (VI = 6), लेकिन जब कोई छोटी संख्या बड़ी संख्या के पहले आती है, तो इसे घटाया जाता है (IV = 4)। यह प्रणाली रोमन साम्राज्य और मध्यकालीन यूरोप में व्यापक रूप से उपयोग की जाती थी, और आज भी सजावटी उद्देश्यों, घड़ी के चेहरों, फिल्म कॉपीराइट तिथियों और क्रमांकित सूचियों के लिए उपयोग की जाती है।',
      },
    },
    tr: {
      ui: {
        name: 'Arap ↔ Roma Rakamları Dönüştürücü',
        description:
          'Roma rakamları ve Arap rakamları arasında çift yönlü dönüştürücü. Standart Roma rakamlarını 1-3999 (I-MMMCMXCIX) destekler.',
        arabicNumber: 'Arap Rakamı (1-3999)',
        romanNumeral: 'Roma Rakamı',
        arabicPlaceholder: 'Arap rakamı girin...',
        romanPlaceholder: 'Roma rakamı girin...',
        copy: 'Kopyala',
        errorArabicRange: 'Lütfen 1 ile 3999 arasında bir sayı girin',
        errorInvalidRoman: 'Lütfen geçerli bir Roma rakamı girin',
        whatIsTitle: 'Roma rakamları nedir?',
        whatIsDescription:
          "Roma rakamları, antik Roma'da ortaya çıkan ve sayıları temsil etmek için Latin alfabesinin harflerini kullanan bir sayı sistemidir. Temel semboller I (1), V (5), X (10), L (50), C (100), D (500) ve M (1000)'dir. Sayılar, bu sembolleri belirli kurallar doğrultusunda birleştirerek oluşturulur: semboller genellikle toplanır (VI = 6), ancak küçük bir rakam büyük bir rakamın önünde göründüğünde çıkarılır (IV = 4). Bu sistem Roma İmparatorluğu ve ortaçağ Avrupa'sında yaygın olarak kullanılmış olup, bugün hala dekoratif amaçlar, saat yüzleri, film telif hakkı tarihleri ve numaralı listeler için kullanılmaya devam etmektedir.",
      },
    },
    nl: {
      ui: {
        name: 'Arabisch ↔ Romeins Converter',
        description:
          'Bidirectionele converter tussen Romeinse en Arabische cijfers. Ondersteunt standaard Romeinse cijfers van 1 tot 3999 (I tot MMMCMXCIX).',
        arabicNumber: 'Arabisch Cijfer (1-3999)',
        romanNumeral: 'Romeins Cijfer',
        arabicPlaceholder: 'Voer Arabisch cijfer in...',
        romanPlaceholder: 'Voer Romeins cijfer in...',
        copy: 'Kopiëren',
        errorArabicRange: 'Voer een nummer in tussen 1 en 3999',
        errorInvalidRoman: 'Voer een geldig Romeins cijfer in',
        whatIsTitle: 'Wat zijn Romeinse cijfers?',
        whatIsDescription:
          'Romeinse cijfers zijn een cijfersysteem dat zijn oorsprong vindt in het oude Rome, waarbij letters van het Latijnse alfabet worden gebruikt om getallen weer te geven. De basissymbolen zijn I (1), V (5), X (10), L (50), C (100), D (500) en M (1000). Getallen worden gevormd door deze symbolen te combineren volgens specifieke regels: symbolen worden gewoonlijk opgeteld (VI = 6), maar wanneer een kleiner cijfer voor een groter cijfer verschijnt, wordt het afgetrokken (IV = 4). Dit systeem werd veel gebruikt in het Romeinse Rijk en het middeleeuwse Europa, en wordt vandaag de dag nog steeds gebruikt voor decoratieve doeleinden, klokgezichten, film auteursrechtdata en genummerde lijsten.',
      },
    },
    sv: {
      ui: {
        name: 'Arabiska ↔ Romerska Konverterare',
        description:
          'Bidirektionell konverterare mellan romerska och arabiska siffror. Stöder standard romerska siffror från 1 till 3999 (I till MMMCMXCIX).',

        arabicNumber: 'Arabisk siffra (1-3999)',
        romanNumeral: 'Romersk siffra',
        arabicPlaceholder: 'Ange arabisk siffra...',
        romanPlaceholder: 'Ange romersk siffra...',
        copy: 'Kopiera',
        errorArabicRange: 'Ange ett nummer mellan 1 och 3999',
        errorInvalidRoman: 'Ange en giltig romersk siffra',
        whatIsTitle: 'Vad är romerska siffror?',
        whatIsDescription:
          'Romerska siffror är ett talsystem som har sitt ursprung i antika Rom, som använder bokstäver från det latinska alfabetet för att representera tal. Grundsymbolerna är I (1), V (5), X (10), L (50), C (100), D (500) och M (1000). Tal bildas genom att kombinera dessa symboler enligt specifika regler: symboler adderas vanligtvis (VI = 6), men när en mindre siffra förekommer före en större, subtraheras den (IV = 4). Detta system användes allmänt i Romerska riket och medeltida Europa, och fortsätter att användas idag för dekorativa ändamål, klockfaces, film copyright-datum och numrerade listor.',
      },
    },
    pl: {
      ui: {
        name: 'Konwerter Arabskie ↔ Rzymskie',
        description:
          'Dwukierunkowy konwerter między cyframi rzymskimi i arabskimi. Obsługuje standardowe cyfry rzymskie od 1 do 3999 (I do MMMCMXCIX).',

        arabicNumber: 'Cyfra Arabska (1-3999)',
        romanNumeral: 'Cyfra Rzymska',
        arabicPlaceholder: 'Wprowadź cyfrę arabską...',
        romanPlaceholder: 'Wprowadź cyfrę rzymską...',
        copy: 'Kopiuj',
        errorArabicRange: 'Wprowadź liczbę od 1 do 3999',
        errorInvalidRoman: 'Wprowadź prawidłową cyfrę rzymską',
        whatIsTitle: 'Czym są cyfry rzymskie?',
        whatIsDescription:
          'Cyfry rzymskie to system liczbowy pochodzący ze starożytnego Rzymu, wykorzystujący litery alfabetu łacińskiego do reprezentowania liczb. Podstawowe symbole to I (1), V (5), X (10), L (50), C (100), D (500) i M (1000). Liczby tworzone są przez łączenie tych symboli zgodnie z określonymi zasadami: symbole są zwykle dodawane (VI = 6), ale gdy mniejsza cyfra pojawia się przed większą, jest odejmowana (IV = 4). System ten był szeroko używany w Cesarstwie Rzymskim i średniowiecznej Europie i nadal jest używany dziś w celach dekoracyjnych, na tarczach zegarów, datach praw autorskich filmów i listach numerowanych.',
      },
    },
    vi: {
      ui: {
        name: 'Trình Chuyển Đổi Ả Rập ↔ La Mã',
        description:
          'Trình chuyển đổi hai chiều giữa số La Mã và số Ả Rập. Hỗ trợ số La Mã tiêu chuẩn từ 1 đến 3999 (I đến MMMCMXCIX).',
        arabicNumber: 'Số Ả Rập (1-3999)',
        romanNumeral: 'Số La Mã',
        arabicPlaceholder: 'Nhập số Ả Rập...',
        romanPlaceholder: 'Nhập số La Mã...',
        copy: 'Sao chép',
        errorArabicRange: 'Vui lòng nhập một số từ 1 đến 3999',
        errorInvalidRoman: 'Vui lòng nhập một số La Mã hợp lệ',
        whatIsTitle: 'Số La Mã là gì?',
        whatIsDescription:
          'Số La Mã là một hệ thống số có nguồn gốc từ Roma cổ đại, sử dụng các chữ cái của bảng chữ cái Latin để biểu diễn số. Các ký hiệu cơ bản là I (1), V (5), X (10), L (50), C (100), D (500) và M (1000). Các số được tạo thành bằng cách kết hợp những ký hiệu này theo các quy tắc cụ thể: các ký hiệu thường được cộng lại với nhau (VI = 6), nhưng khi một số nhỏ hơn xuất hiện trước một số lớn hơn, nó được trừ đi (IV = 4). Hệ thống này đã được sử dụng rộng rãi trong Đế chế La Mã và châu Âu thời trung cổ, và tiếp tục được sử dụng ngày nay cho mục đích trang trí, mặt đồng hồ, ngày bản quyền phim và danh sách được đánh số.',
      },
    },
    th: {
      ui: {
        name: 'ตัวแปลงอารบิก ↔ โรมัน',
        description:
          'ตัวแปลงแบบสองทิศทางระหว่างตัวเลขโรมันและตัวเลขอารบิก รองรับตัวเลขโรมันมาตรฐาน 1 ถึง 3999 (I ถึง MMMCMXCIX)',

        arabicNumber: 'ตัวเลขอารบิก (1-3999)',
        romanNumeral: 'ตัวเลขโรมัน',
        arabicPlaceholder: 'ป้อนตัวเลขอารบิก...',
        romanPlaceholder: 'ป้อนตัวเลขโรมัน...',
        copy: 'คัดลอก',
        errorArabicRange: 'กรุณาป้อนตัวเลขระหว่าง 1 ถึง 3999',
        errorInvalidRoman: 'กรุณาป้อนตัวเลขโรมันที่ถูกต้อง',
        whatIsTitle: 'ตัวเลขโรมันคืออะไร?',
        whatIsDescription:
          'ตัวเลขโรมันเป็นระบบตัวเลขที่มีต้นกำเนิดในโรมโบราณ ใช้ตัวอักษรจากอักษรละตินเพื่อแสดงตัวเลข สัญลักษณ์พื้นฐานคือ I (1), V (5), X (10), L (50), C (100), D (500) และ M (1000) ตัวเลขเกิดจากการรวมสัญลักษณ์เหล่านี้ตามกฎเฉพาะ: สัญลักษณ์มักจะบวกกัน (VI = 6) แต่เมื่อตัวเลขที่เล็กกว่าปรากฏก่อนตัวเลขที่ใหญ่กว่า จะถูกลบ (IV = 4) ระบบนี้ถูกใช้อย่างแพร่หลายในจักรวรรดิโรมันและยุโรปในยุคกลาง และยังคงใช้ในปัจจุบันสำหรับวัตถุประสงค์ในการตกแต่ง หน้าปัดนาฬิกา วันที่ลิขสิทธิ์ภาพยนตร์ และรายการที่มีหมายเลข',
      },
    },
    id: {
      ui: {
        name: 'Konverter Arab ↔ Romawi',
        description:
          'Konverter dua arah antara angka Romawi dan Arab. Mendukung angka Romawi standar dari 1 hingga 3999 (I hingga MMMCMXCIX).',

        arabicNumber: 'Angka Arab (1-3999)',
        romanNumeral: 'Angka Romawi',
        arabicPlaceholder: 'Masukkan angka Arab...',
        romanPlaceholder: 'Masukkan angka Romawi...',
        copy: 'Salin',
        errorArabicRange: 'Masukkan angka antara 1 dan 3999',
        errorInvalidRoman: 'Masukkan angka Romawi yang valid',
        whatIsTitle: 'Apa itu angka Romawi?',
        whatIsDescription:
          'Angka Romawi adalah sistem angka yang berasal dari Roma kuno, menggunakan huruf-huruf dari alfabet Latin untuk mewakili angka. Simbol dasarnya adalah I (1), V (5), X (10), L (50), C (100), D (500), dan M (1000). Angka dibentuk dengan menggabungkan simbol-simbol ini sesuai aturan tertentu: simbol biasanya ditambahkan bersama (VI = 6), tetapi ketika angka yang lebih kecil muncul sebelum yang lebih besar, maka dikurangkan (IV = 4). Sistem ini banyak digunakan di Kekaisaran Romawi dan Eropa abad pertengahan, dan terus digunakan hingga hari ini untuk tujuan dekoratif, muka jam, tanggal hak cipta film, dan daftar bernomor.',
      },
    },
    he: {
      ui: {
        name: 'ממיר ערבי ↔ רומי',
        description:
          'ממיר דו-כיווני בין ספרות רומיות וערביות. תומך בספרות רומיות סטנדרטיות מ-1 עד 3999 (I עד MMMCMXCIX).',

        arabicNumber: 'מספר ערבי (1-3999)',
        romanNumeral: 'ספרה רומית',
        arabicPlaceholder: 'הזן מספר ערבי...',
        romanPlaceholder: 'הזן ספרה רומית...',
        copy: 'העתק',
        errorArabicRange: 'אנא הזן מספר בין 1 ל-3999',
        errorInvalidRoman: 'אנא הזן ספרה רומית תקינה',
        whatIsTitle: 'מה הן ספרות רומיות?',
        whatIsDescription:
          'ספרות רומיות הן מערכת ספרות שמקורה ברומא העתיקה, המשתמשת באותיות מהאלפבית הלטיני לייצוג מספרים. הסמלים הבסיסיים הם I (1), V (5), X (10), L (50), C (100), D (500) ו-M (1000). מספרים נוצרים על ידי שילוב של הסמלים הללו לפי כללים מסוימים: בדרך כלל הסמלים מתווספים יחדיו (VI = 6), אבל כאשר ספרה קטנה יותר מופיעה לפני גדולה יותר, היא נגרעת (IV = 4). מערכת זו הייתה בשימוש נרחב באימפריה הרומית ובאירופה של ימי הביניים, והיא ממשיכה להיות בשימוש היום למטרות דקורטיביות, פני שעונים, תאריכי זכויות יוצרים של סרטים ורשימות ממוספרות.',
      },
    },
    ms: {
      ui: {
        name: 'Penukar Arab ↔ Rom',
        description:
          'Penukar dua hala antara nombor Rom dan Arab. Menyokong nombor Rom standard dari 1 hingga 3999 (I hingga MMMCMXCIX).',
        arabicNumber: 'Nombor Arab (1-3999)',
        romanNumeral: 'Nombor Rom',
        arabicPlaceholder: 'Masukkan nombor Arab...',
        romanPlaceholder: 'Masukkan nombor Rom...',
        copy: 'Salin',
        errorArabicRange: 'Sila masukkan nombor antara 1 dan 3999',
        errorInvalidRoman: 'Sila masukkan nombor Rom yang sah',
        whatIsTitle: 'Apakah nombor Rom?',
        whatIsDescription:
          'Nombor Rom adalah sistem angka yang berasal dari Rom purba, menggunakan huruf-huruf dari abjad Latin untuk mewakili nombor. Simbol asas ialah I (1), V (5), X (10), L (50), C (100), D (500), dan M (1000). Nombor dibentuk dengan menggabungkan simbol-simbol ini mengikut peraturan tertentu: simbol biasanya ditambah bersama (VI = 6), tetapi apabila angka yang lebih kecil muncul sebelum yang lebih besar, ia dikurangkan (IV = 4). Sistem ini digunakan secara meluas di Empayar Rom dan Eropah zaman pertengahan, dan terus digunakan hari ini untuk tujuan hiasan, muka jam, tarikh hak cipta filem, dan senarai bernombor.',
      },
    },
    no: {
      ui: {
        name: 'Arabisk ↔ Romersk Konverterer',
        description:
          'Toveis konverterer mellom romerske og arabiske tall. Støtter standard romerske tall fra 1 til 3999 (I til MMMCMXCIX).',
        arabicNumber: 'Arabisk tall (1-3999)',
        romanNumeral: 'Romersk tall',
        arabicPlaceholder: 'Skriv inn arabisk tall...',
        romanPlaceholder: 'Skriv inn romersk tall...',
        copy: 'Kopier',
        errorArabicRange: 'Vennligst skriv inn et tall mellom 1 og 3999',
        errorInvalidRoman: 'Vennligst skriv inn et gyldig romersk tall',
        whatIsTitle: 'Hva er romerske tall?',
        whatIsDescription:
          'Romerske tall er et tallsystem som stammer fra antikkens Roma, som bruker bokstaver fra det latinske alfabetet for å representere tall. Grunnsymbolene er I (1), V (5), X (10), L (50), C (100), D (500) og M (1000). Tall dannes ved å kombinere disse symbolene i henhold til spesifikke regler: symboler legges vanligvis sammen (VI = 6), men når et mindre tall vises før et større, trekkes det fra (IV = 4). Dette systemet var mye brukt i Romerriket og middelalderens Europa, og brukes fortsatt i dag til dekorative formål, urskiver, film copyright-datoer og nummererte lister.',
      },
    },
  },
} as const
