import type { ResizeAlgorithm, ResizeOutputFormat } from '../types'

interface ResizeOptionLabelSet {
  algorithms: Record<ResizeAlgorithm, string>
  formats: Record<ResizeOutputFormat, string>
}

const labelsByLocale: Record<string, ResizeOptionLabelSet> = {
  en: {
    algorithms: {
      'browser-high': 'Browser high quality',
      bicubic: 'Bicubic interpolation',
      bilinear: 'Bilinear interpolation',
      lanczos3: 'Lanczos filter (radius 3)',
      nearest: 'Nearest neighbor',
    },
    formats: {
      original: 'Keep original format',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  zh: {
    algorithms: {
      'browser-high': '浏览器高质量',
      bicubic: '双三次插值',
      bilinear: '双线性插值',
      lanczos3: 'Lanczos（半径 3）',
      nearest: '最近邻',
    },
    formats: {
      original: '保留原始格式',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  'zh-CN': {
    algorithms: {
      'browser-high': '浏览器高质量',
      bicubic: '双三次插值',
      bilinear: '双线性插值',
      lanczos3: 'Lanczos（半径 3）',
      nearest: '最近邻',
    },
    formats: {
      original: '保留原始格式',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  'zh-TW': {
    algorithms: {
      'browser-high': '瀏覽器高品質',
      bicubic: '雙三次插值',
      bilinear: '雙線性插值',
      lanczos3: 'Lanczos（半徑 3）',
      nearest: '最近鄰',
    },
    formats: {
      original: '保留原始格式',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  'zh-HK': {
    algorithms: {
      'browser-high': '瀏覽器高品質',
      bicubic: '雙三次插值',
      bilinear: '雙線性插值',
      lanczos3: 'Lanczos（半徑 3）',
      nearest: '最近鄰',
    },
    formats: {
      original: '保留原始格式',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  es: {
    algorithms: {
      'browser-high': 'Alta calidad del navegador',
      bicubic: 'Interpolación bicúbica',
      bilinear: 'Interpolación bilineal',
      lanczos3: 'Filtro Lanczos (radio 3)',
      nearest: 'Vecino más cercano',
    },
    formats: {
      original: 'Conservar formato original',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  fr: {
    algorithms: {
      'browser-high': 'Haute qualité navigateur',
      bicubic: 'Interpolation bicubique',
      bilinear: 'Interpolation bilinéaire',
      lanczos3: 'Filtre Lanczos (rayon 3)',
      nearest: 'Voisin le plus proche',
    },
    formats: {
      original: 'Conserver le format d’origine',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  de: {
    algorithms: {
      'browser-high': 'Browser-Hochqualität',
      bicubic: 'Bikubische Interpolation',
      bilinear: 'Bilineare Interpolation',
      lanczos3: 'Lanczos-Filter (Radius 3)',
      nearest: 'Nächster Nachbar',
    },
    formats: {
      original: 'Originalformat beibehalten',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  it: {
    algorithms: {
      'browser-high': 'Alta qualità browser',
      bicubic: 'Interpolazione bicubica',
      bilinear: 'Interpolazione bilineare',
      lanczos3: 'Filtro Lanczos (raggio 3)',
      nearest: 'Vicino più prossimo',
    },
    formats: {
      original: 'Mantieni formato originale',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  ja: {
    algorithms: {
      'browser-high': 'ブラウザー高品質',
      bicubic: 'バイキュービック補間',
      bilinear: 'バイリニア補間',
      lanczos3: 'Lanczos（半径 3）',
      nearest: '最近傍',
    },
    formats: {
      original: '元の形式を保持',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  ko: {
    algorithms: {
      'browser-high': '브라우저 고품질',
      bicubic: '바이큐빅 보간',
      bilinear: '바이리니어 보간',
      lanczos3: 'Lanczos(반경 3)',
      nearest: '최근접 이웃',
    },
    formats: {
      original: '원본 형식 유지',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  ru: {
    algorithms: {
      'browser-high': 'Высокое качество браузера',
      bicubic: 'Бикубическая интерполяция',
      bilinear: 'Билинейная интерполяция',
      lanczos3: 'Lanczos (радиус 3)',
      nearest: 'Ближайший сосед',
    },
    formats: {
      original: 'Сохранить исходный формат',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  pt: {
    algorithms: {
      'browser-high': 'Alta qualidade do navegador',
      bicubic: 'Interpolação bicúbica',
      bilinear: 'Interpolação bilinear',
      lanczos3: 'Filtro Lanczos (raio 3)',
      nearest: 'Vizinho mais próximo',
    },
    formats: {
      original: 'Manter formato original',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  ar: {
    algorithms: {
      'browser-high': 'جودة عالية من المتصفح',
      bicubic: 'استيفاء تكعيبي',
      bilinear: 'استيفاء ثنائي',
      lanczos3: 'مرشح Lanczos (نصف قطر 3)',
      nearest: 'أقرب جار',
    },
    formats: {
      original: 'الاحتفاظ بالتنسيق الأصلي',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  hi: {
    algorithms: {
      'browser-high': 'ब्राउज़र हाई क्वालिटी',
      bicubic: 'बाइक्यूबिक इंटरपोलेशन',
      bilinear: 'बिलिनियर इंटरपोलेशन',
      lanczos3: 'लैंज़ोस फ़िल्टर (रेडियस 3)',
      nearest: 'नियरस्ट नेबर',
    },
    formats: {
      original: 'मूल फ़ॉर्मेट रखें',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  tr: {
    algorithms: {
      'browser-high': 'Tarayıcı yüksek kalite',
      bicubic: 'Bikübik enterpolasyon',
      bilinear: 'Bilineer enterpolasyon',
      lanczos3: 'Lanczos filtresi (yarıçap 3)',
      nearest: 'En yakın komşu',
    },
    formats: {
      original: 'Orijinal formatı koru',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  nl: {
    algorithms: {
      'browser-high': 'Browser hoge kwaliteit',
      bicubic: 'Bicubische interpolatie',
      bilinear: 'Bilineaire interpolatie',
      lanczos3: 'Lanczos-filter (straal 3)',
      nearest: 'Dichtstbijzijnde buur',
    },
    formats: {
      original: 'Origineel formaat behouden',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  sv: {
    algorithms: {
      'browser-high': 'Hög webbläsarkvalitet',
      bicubic: 'Bikubisk interpolering',
      bilinear: 'Bilinjär interpolering',
      lanczos3: 'Lanczos-filter (radie 3)',
      nearest: 'Närmaste granne',
    },
    formats: {
      original: 'Behåll originalformat',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  pl: {
    algorithms: {
      'browser-high': 'Wysoka jakość przeglądarki',
      bicubic: 'Interpolacja bikubiczna',
      bilinear: 'Interpolacja biliniowa',
      lanczos3: 'Filtr Lanczosa (promień 3)',
      nearest: 'Najbliższy sąsiad',
    },
    formats: {
      original: 'Zachowaj format oryginalny',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  vi: {
    algorithms: {
      'browser-high': 'Chất lượng cao của trình duyệt',
      bicubic: 'Nội suy bicubic',
      bilinear: 'Nội suy bilinear',
      lanczos3: 'Bộ lọc Lanczos (bán kính 3)',
      nearest: 'Láng giềng gần nhất',
    },
    formats: {
      original: 'Giữ định dạng gốc',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  th: {
    algorithms: {
      'browser-high': 'คุณภาพสูงของเบราว์เซอร์',
      bicubic: 'ไบคิวบิก',
      bilinear: 'บิลิเนียร์',
      lanczos3: 'Lanczos (รัศมี 3)',
      nearest: 'เพื่อนบ้านใกล้สุด',
    },
    formats: {
      original: 'คงรูปแบบเดิม',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  id: {
    algorithms: {
      'browser-high': 'Kualitas tinggi browser',
      bicubic: 'Interpolasi bikubik',
      bilinear: 'Interpolasi bilinear',
      lanczos3: 'Filter Lanczos (radius 3)',
      nearest: 'Tetangga terdekat',
    },
    formats: {
      original: 'Pertahankan format asli',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  he: {
    algorithms: {
      'browser-high': 'איכות גבוהה בדפדפן',
      bicubic: 'אינטרפולציה דו-קובית',
      bilinear: 'אינטרפולציה ביליניארית',
      lanczos3: 'מסנן Lanczos (רדיוס 3)',
      nearest: 'שכן קרוב ביותר',
    },
    formats: {
      original: 'שמור פורמט מקורי',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  ms: {
    algorithms: {
      'browser-high': 'Kualiti tinggi pelayar',
      bicubic: 'Interpolasi bikubik',
      bilinear: 'Interpolasi bilinear',
      lanczos3: 'Penapis Lanczos (jejari 3)',
      nearest: 'Jiran terdekat',
    },
    formats: {
      original: 'Kekalkan format asal',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
  no: {
    algorithms: {
      'browser-high': 'Høy nettleserkvalitet',
      bicubic: 'Bikubisk interpolasjon',
      bilinear: 'Bilineær interpolasjon',
      lanczos3: 'Lanczos-filter (radius 3)',
      nearest: 'Nærmeste nabo',
    },
    formats: {
      original: 'Behold originalformat',
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WebP',
    },
  },
}

function normalizeLocale(locale: string) {
  const normalized = locale.toLowerCase()

  if (normalized === 'zh') return 'zh'
  if (normalized === 'zh-cn') return 'zh-CN'
  if (normalized === 'zh-tw') return 'zh-TW'
  if (normalized === 'zh-hk') return 'zh-HK'

  return normalized
}

export function getResizeOptionLabels(locale: string): ResizeOptionLabelSet {
  const normalized = normalizeLocale(locale)
  const fallback = labelsByLocale.en as ResizeOptionLabelSet
  return labelsByLocale[normalized] ?? fallback
}
