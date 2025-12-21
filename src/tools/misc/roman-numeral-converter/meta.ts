import type { ToolMetadata } from '@/types/tool'

export const metadata: ToolMetadata = {
  id: 'roman-numeral-converter',
  domain: 'misc',
  path: 'tools/roman-numeral-converter',
  tags: ['misc', 'converter', 'roman', 'numeral', 'number'],
  features: ['offline'],
  subPaths: [],
  
  meta: {
    en: {
      name: 'Roman Numeral ↔ Arabic Number Converter',
      description: 'Bidirectional converter between Roman numerals and Arabic numbers. Supports standard Roman numerals from 1 to 3999 (I to MMMCMXCIX).',
      ui: {
        arabicNumber: 'Arabic Number (1-3999)',
        romanNumeral: 'Roman Numeral',
        arabicPlaceholder: 'Enter Arabic number...',
        romanPlaceholder: 'Enter Roman numeral...',
      }
    },
    zh: {
      name: '罗马数字 ↔ 阿拉伯数字转换器',
      description: '罗马数字与阿拉伯数字双向转换。支持标准罗马数字 1 到 3999（I 到 MMMCMXCIX）。',
      ui: {
        arabicNumber: '阿拉伯数字 (1-3999)',
        romanNumeral: '罗马数字',
        arabicPlaceholder: '输入阿拉伯数字...',
        romanPlaceholder: '输入罗马数字...',
      }
    },
    'zh-CN': {
      name: '罗马数字 ↔ 阿拉伯数字转换器',
      description: '罗马数字与阿拉伯数字双向转换。支持标准罗马数字 1 到 3999（I 到 MMMCMXCIX）。',
      ui: {
        arabicNumber: '阿拉伯数字 (1-3999)',
        romanNumeral: '罗马数字',
        arabicPlaceholder: '输入阿拉伯数字...',
        romanPlaceholder: '输入罗马数字...',
      }
    },
    'zh-TW': {
      name: '羅馬數字 ↔ 阿拉伯數字轉換器',
      description: '羅馬數字與阿拉伯數字雙向轉換。支援標準羅馬數字 1 到 3999（I 到 MMMCMXCIX）。',
      ui: {
        arabicNumber: '阿拉伯數字 (1-3999)',
        romanNumeral: '羅馬數字',
        arabicPlaceholder: '輸入阿拉伯數字...',
        romanPlaceholder: '輸入羅馬數字...',
      }
    },
    'zh-HK': {
      name: '羅馬數字 ↔ 阿拉伯數字轉換器',
      description: '羅馬數字與阿拉伯數字雙向轉換。支援標準羅馬數字 1 到 3999（I 到 MMMCMXCIX）。',
      ui: {
        arabicNumber: '阿拉伯數字 (1-3999)',
        romanNumeral: '羅馬數字',
        arabicPlaceholder: '輸入阿拉伯數字...',
        romanPlaceholder: '輸入羅馬數字...',
      }
    },
    es: {
      name: 'Conversor Arábigo ↔ Romano',
      description: 'Conversor bidireccional entre números romanos y arábigos. Soporta números romanos estándar del 1 al 3999 (I a MMMCMXCIX).',
      ui: {
        arabicNumber: 'Número Arábigo (1-3999)',
        romanNumeral: 'Número Romano',
        arabicPlaceholder: 'Ingresa número arábigo...',
        romanPlaceholder: 'Ingresa número romano...',
      }
    },
    fr: {
      name: 'Convertisseur Arabe ↔ Romain',
      description: 'Convertisseur bidirectionnel entre les chiffres romains et arabes. Prend en charge les chiffres romains standard de 1 à 3999 (I à MMMCMXCIX).',
      ui: {
        arabicNumber: 'Nombre Arabe (1-3999)',
        romanNumeral: 'Nombre Romain',
        arabicPlaceholder: 'Entrez un nombre arabe...',
        romanPlaceholder: 'Entrez un nombre romain...',
      }
    },
    de: {
      name: 'Arabisch ↔ Römisch Konverter',
      description: 'Bidirektionaler Konverter zwischen römischen und arabischen Zahlen. Unterstützt Standard-Römerzahlen von 1 bis 3999 (I bis MMMCMXCIX).',
      ui: {
        arabicNumber: 'Arabische Zahl (1-3999)',
        romanNumeral: 'Römische Zahl',
        arabicPlaceholder: 'Arabische Zahl eingeben...',
        romanPlaceholder: 'Römische Zahl eingeben...',
      }
    },
    it: {
      name: 'Convertitore Arabo ↔ Romano',
      description: 'Convertitore bidirezionale tra numeri romani e arabi. Supporta numeri romani standard da 1 a 3999 (I a MMMCMXCIX).',
      ui: {
        arabicNumber: 'Numero Arabo (1-3999)',
        romanNumeral: 'Numero Romano',
        arabicPlaceholder: 'Inserisci numero arabo...',
        romanPlaceholder: 'Inserisci numero romano...',
      }
    },
    ja: {
      name: 'ローマ数字 ↔ アラビア数字コンバーター',
      description: 'ローマ数字とアラビア数字の双方向変換。標準的なローマ数字 1 から 3999（I から MMMCMXCIX）をサポート。',
      ui: {
        arabicNumber: 'アラビア数字 (1-3999)',
        romanNumeral: 'ローマ数字',
        arabicPlaceholder: 'アラビア数字を入力...',
        romanPlaceholder: 'ローマ数字を入力...',
      }
    },
    ko: {
      name: '아라비아 ↔ 로마 숫자 변환기',
      description: '로마 숫자와 아라비아 숫자 간 양방향 변환. 표준 로마 숫자 1~3999 (I~MMMCMXCIX) 지원.',
      ui: {
        arabicNumber: '아라비아 숫자 (1-3999)',
        romanNumeral: '로마 숫자',
        arabicPlaceholder: '아라비아 숫자 입력...',
        romanPlaceholder: '로마 숫자 입력...',
      }
    },
    ru: {
      name: 'Конвертер Арабские ↔ Римские цифры',
      description: 'Двунаправленный преобразователь римских и арабских цифр. Поддерживает стандартные римские цифры от 1 до 3999 (I до MMMCMXCIX).',
      ui: {
        arabicNumber: 'Арабское число (1-3999)',
        romanNumeral: 'Римское число',
        arabicPlaceholder: 'Введите арабское число...',
        romanPlaceholder: 'Введите римское число...',
      }
    },
    pt: {
      name: 'Conversor Arábico ↔ Romano',
      description: 'Conversor bidirecional entre números romanos e arábicos. Suporta números romanos padrão de 1 a 3999 (I a MMMCMXCIX).',
      ui: {
        arabicNumber: 'Número Arábico (1-3999)',
        romanNumeral: 'Número Romano',
        arabicPlaceholder: 'Insira número arábico...',
        romanPlaceholder: 'Insira número romano...',
      }
    },
    ar: {
      name: 'محول الأرقام العربية ↔ الرومانية',
      description: 'محول ثنائي الاتجاه بين الأرقام الرومانية والعربية. يدعم الأرقام الرومانية القياسية من 1 إلى 3999 (I إلى MMMCMXCIX).',
      ui: {
        arabicNumber: 'رقم عربي (1-3999)',
        romanNumeral: 'رقم روماني',
        arabicPlaceholder: 'أدخل رقم عربي...',
        romanPlaceholder: 'أدخل رقم روماني...',
      }
    },
    hi: {
      name: 'अरबी ↔ रोमन अंक कनवर्टर',
      description: 'रोमन अंकों और अरबी संख्याओं के बीच द्विदिशीय कनवर्टर। मानक रोमन अंक 1 से 3999 (I से MMMCMXCIX) का समर्थन करता है।',
      ui: {
        arabicNumber: 'अरबी संख्या (1-3999)',
        romanNumeral: 'रोमन अंक',
        arabicPlaceholder: 'अरबी संख्या दर्ज करें...',
        romanPlaceholder: 'रोमन अंक दर्ज करें...',
      }
    },
    tr: {
      name: 'Arap ↔ Roma Rakamları Dönüştürücü',
      description: 'Roma rakamları ve Arap rakamları arasında çift yönlü dönüştürücü. Standart Roma rakamlarını 1-3999 (I-MMMCMXCIX) destekler.',
      ui: {
        arabicNumber: 'Arap Rakamı (1-3999)',
        romanNumeral: 'Roma Rakamı',
        arabicPlaceholder: 'Arap rakamı girin...',
        romanPlaceholder: 'Roma rakamı girin...',
      }
    },
    nl: {
      name: 'Arabisch ↔ Romeins Converter',
      description: 'Bidirectionele converter tussen Romeinse en Arabische cijfers. Ondersteunt standaard Romeinse cijfers van 1 tot 3999 (I tot MMMCMXCIX).',
      ui: {
        arabicNumber: 'Arabisch Cijfer (1-3999)',
        romanNumeral: 'Romeins Cijfer',
        arabicPlaceholder: 'Voer Arabisch cijfer in...',
        romanPlaceholder: 'Voer Romeins cijfer in...',
      }
    },
    sv: {
      name: 'Arabiska ↔ Romerska Konverterare',
      description: 'Bidirektionell konverterare mellan romerska och arabiska siffror. Stöder standard romerska siffror från 1 till 3999 (I till MMMCMXCIX).',
      ui: {
        arabicNumber: 'Arabisk siffra (1-3999)',
        romanNumeral: 'Romersk siffra',
        arabicPlaceholder: 'Ange arabisk siffra...',
        romanPlaceholder: 'Ange romersk siffra...',
      }
    },
    pl: {
      name: 'Konwerter Arabskie ↔ Rzymskie',
      description: 'Dwukierunkowy konwerter między cyframi rzymskimi i arabskimi. Obsługuje standardowe cyfry rzymskie od 1 do 3999 (I do MMMCMXCIX).',
      ui: {
        arabicNumber: 'Cyfra Arabska (1-3999)',
        romanNumeral: 'Cyfra Rzymska',
        arabicPlaceholder: 'Wprowadź cyfrę arabską...',
        romanPlaceholder: 'Wprowadź cyfrę rzymską...',
      }
    },
    vi: {
      name: 'Trình Chuyển Đổi Ả Rập ↔ La Mã',
      description: 'Trình chuyển đổi hai chiều giữa số La Mã và số Ả Rập. Hỗ trợ số La Mã tiêu chuẩn từ 1 đến 3999 (I đến MMMCMXCIX).',
      ui: {
        arabicNumber: 'Số Ả Rập (1-3999)',
        romanNumeral: 'Số La Mã',
        arabicPlaceholder: 'Nhập số Ả Rập...',
        romanPlaceholder: 'Nhập số La Mã...',
      }
    },
    th: {
      name: 'ตัวแปลงอารบิก ↔ โรมัน',
      description: 'ตัวแปลงแบบสองทิศทางระหว่างตัวเลขโรมันและตัวเลขอารบิก รองรับตัวเลขโรมันมาตรฐาน 1 ถึง 3999 (I ถึง MMMCMXCIX)',
      ui: {
        arabicNumber: 'ตัวเลขอารบิก (1-3999)',
        romanNumeral: 'ตัวเลขโรมัน',
        arabicPlaceholder: 'ป้อนตัวเลขอารบิก...',
        romanPlaceholder: 'ป้อนตัวเลขโรมัน...',
      }
    },
    id: {
      name: 'Konverter Arab ↔ Romawi',
      description: 'Konverter dua arah antara angka Romawi dan Arab. Mendukung angka Romawi standar dari 1 hingga 3999 (I hingga MMMCMXCIX).',
      ui: {
        arabicNumber: 'Angka Arab (1-3999)',
        romanNumeral: 'Angka Romawi',
        arabicPlaceholder: 'Masukkan angka Arab...',
        romanPlaceholder: 'Masukkan angka Romawi...',
      }
    },
    he: {
      name: 'ממיר ערבי ↔ רומי',
      description: 'ממיר דו-כיווני בין ספרות רומיות וערביות. תומך בספרות רומיות סטנדרטיות מ-1 עד 3999 (I עד MMMCMXCIX).',
      ui: {
        arabicNumber: 'מספר ערבי (1-3999)',
        romanNumeral: 'ספרה רומית',
        arabicPlaceholder: 'הזן מספר ערבי...',
        romanPlaceholder: 'הזן ספרה רומית...',
      }
    },
    ms: {
      name: 'Penukar Arab ↔ Rom',
      description: 'Penukar dua hala antara nombor Rom dan Arab. Menyokong nombor Rom standard dari 1 hingga 3999 (I hingga MMMCMXCIX).',
      ui: {
        arabicNumber: 'Nombor Arab (1-3999)',
        romanNumeral: 'Nombor Rom',
        arabicPlaceholder: 'Masukkan nombor Arab...',
        romanPlaceholder: 'Masukkan nombor Rom...',
      }
    },
    no: {
      name: 'Arabisk ↔ Romersk Konverterer',
      description: 'Toveis konverterer mellom romerske og arabiske tall. Støtter standard romerske tall fra 1 til 3999 (I til MMMCMXCIX).',
      ui: {
        arabicNumber: 'Arabisk tall (1-3999)',
        romanNumeral: 'Romersk tall',
        arabicPlaceholder: 'Skriv inn arabisk tall...',
        romanPlaceholder: 'Skriv inn romersk tall...',
      }
    },
  },
  
  type: 'vue-island',
  component: './RomanConverter.vue',
}
