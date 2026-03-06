type PageNumberOptionLabels = {
  formatSimple: string
  formatWithTotal: string
  topLeft: string
  topCenter: string
  topRight: string
  bottomLeft: string
  bottomCenter: string
  bottomRight: string
}

const OPTION_LABELS: Record<string, PageNumberOptionLabels> = {
  en: {
    formatSimple: 'Number only',
    formatWithTotal: 'Number and total',
    topLeft: 'Top left',
    topCenter: 'Top center',
    topRight: 'Top right',
    bottomLeft: 'Bottom left',
    bottomCenter: 'Bottom center',
    bottomRight: 'Bottom right',
  },
  zh: {
    formatSimple: '仅编号',
    formatWithTotal: '编号和总页数',
    topLeft: '左上',
    topCenter: '顶部居中',
    topRight: '右上',
    bottomLeft: '左下',
    bottomCenter: '底部居中',
    bottomRight: '右下',
  },
  'zh-CN': {
    formatSimple: '仅编号',
    formatWithTotal: '编号和总页数',
    topLeft: '左上',
    topCenter: '顶部居中',
    topRight: '右上',
    bottomLeft: '左下',
    bottomCenter: '底部居中',
    bottomRight: '右下',
  },
  'zh-TW': {
    formatSimple: '僅編號',
    formatWithTotal: '編號和總頁數',
    topLeft: '左上',
    topCenter: '頂部置中',
    topRight: '右上',
    bottomLeft: '左下',
    bottomCenter: '底部置中',
    bottomRight: '右下',
  },
  'zh-HK': {
    formatSimple: '僅編號',
    formatWithTotal: '編號和總頁數',
    topLeft: '左上',
    topCenter: '頂部置中',
    topRight: '右上',
    bottomLeft: '左下',
    bottomCenter: '底部置中',
    bottomRight: '右下',
  },
  es: {
    formatSimple: 'Solo número',
    formatWithTotal: 'Número y total',
    topLeft: 'Arriba izquierda',
    topCenter: 'Arriba centro',
    topRight: 'Arriba derecha',
    bottomLeft: 'Abajo izquierda',
    bottomCenter: 'Abajo centro',
    bottomRight: 'Abajo derecha',
  },
  fr: {
    formatSimple: 'Numéro seul',
    formatWithTotal: 'Numéro et total',
    topLeft: 'Haut gauche',
    topCenter: 'Haut centre',
    topRight: 'Haut droite',
    bottomLeft: 'Bas gauche',
    bottomCenter: 'Bas centre',
    bottomRight: 'Bas droite',
  },
  de: {
    formatSimple: 'Nur Nummer',
    formatWithTotal: 'Nummer und Gesamt',
    topLeft: 'Oben links',
    topCenter: 'Oben mittig',
    topRight: 'Oben rechts',
    bottomLeft: 'Unten links',
    bottomCenter: 'Unten mittig',
    bottomRight: 'Unten rechts',
  },
  it: {
    formatSimple: 'Solo numero',
    formatWithTotal: 'Numero e totale',
    topLeft: 'In alto a sinistra',
    topCenter: 'In alto al centro',
    topRight: 'In alto a destra',
    bottomLeft: 'In basso a sinistra',
    bottomCenter: 'In basso al centro',
    bottomRight: 'In basso a destra',
  },
  ja: {
    formatSimple: '番号のみ',
    formatWithTotal: '番号と総ページ数',
    topLeft: '左上',
    topCenter: '上中央',
    topRight: '右上',
    bottomLeft: '左下',
    bottomCenter: '下中央',
    bottomRight: '右下',
  },
  ko: {
    formatSimple: '번호만',
    formatWithTotal: '번호와 전체',
    topLeft: '왼쪽 위',
    topCenter: '상단 중앙',
    topRight: '오른쪽 위',
    bottomLeft: '왼쪽 아래',
    bottomCenter: '하단 중앙',
    bottomRight: '오른쪽 아래',
  },
  ru: {
    formatSimple: 'Только номер',
    formatWithTotal: 'Номер и всего',
    topLeft: 'Сверху слева',
    topCenter: 'Сверху по центру',
    topRight: 'Сверху справа',
    bottomLeft: 'Снизу слева',
    bottomCenter: 'Снизу по центру',
    bottomRight: 'Снизу справа',
  },
  pt: {
    formatSimple: 'Apenas número',
    formatWithTotal: 'Número e total',
    topLeft: 'Superior esquerdo',
    topCenter: 'Superior central',
    topRight: 'Superior direito',
    bottomLeft: 'Inferior esquerdo',
    bottomCenter: 'Inferior central',
    bottomRight: 'Inferior direito',
  },
  ar: {
    formatSimple: 'الرقم فقط',
    formatWithTotal: 'الرقم والإجمالي',
    topLeft: 'أعلى اليسار',
    topCenter: 'أعلى الوسط',
    topRight: 'أعلى اليمين',
    bottomLeft: 'أسفل اليسار',
    bottomCenter: 'أسفل الوسط',
    bottomRight: 'أسفل اليمين',
  },
  hi: {
    formatSimple: 'केवल संख्या',
    formatWithTotal: 'संख्या और कुल',
    topLeft: 'ऊपर बायां',
    topCenter: 'ऊपर मध्य',
    topRight: 'ऊपर दायां',
    bottomLeft: 'नीचे बायां',
    bottomCenter: 'नीचे मध्य',
    bottomRight: 'नीचे दायां',
  },
  tr: {
    formatSimple: 'Sadece numara',
    formatWithTotal: 'Numara ve toplam',
    topLeft: 'Sol üst',
    topCenter: 'Üst orta',
    topRight: 'Sağ üst',
    bottomLeft: 'Sol alt',
    bottomCenter: 'Alt orta',
    bottomRight: 'Sağ alt',
  },
  nl: {
    formatSimple: 'Alleen nummer',
    formatWithTotal: 'Nummer en totaal',
    topLeft: 'Linksboven',
    topCenter: 'Boven midden',
    topRight: 'Rechtsboven',
    bottomLeft: 'Linksonder',
    bottomCenter: 'Onder midden',
    bottomRight: 'Rechtsonder',
  },
  sv: {
    formatSimple: 'Endast nummer',
    formatWithTotal: 'Nummer och totalt',
    topLeft: 'Övre vänster',
    topCenter: 'Övre mitten',
    topRight: 'Övre höger',
    bottomLeft: 'Nedre vänster',
    bottomCenter: 'Nedre mitten',
    bottomRight: 'Nedre höger',
  },
  pl: {
    formatSimple: 'Tylko numer',
    formatWithTotal: 'Numer i łącznie',
    topLeft: 'Góra lewa',
    topCenter: 'Góra środek',
    topRight: 'Góra prawa',
    bottomLeft: 'Dół lewa',
    bottomCenter: 'Dół środek',
    bottomRight: 'Dół prawa',
  },
  vi: {
    formatSimple: 'Chỉ số trang',
    formatWithTotal: 'Số trang và tổng',
    topLeft: 'Trên trái',
    topCenter: 'Trên giữa',
    topRight: 'Trên phải',
    bottomLeft: 'Dưới trái',
    bottomCenter: 'Dưới giữa',
    bottomRight: 'Dưới phải',
  },
  th: {
    formatSimple: 'เฉพาะเลขหน้า',
    formatWithTotal: 'เลขหน้าและทั้งหมด',
    topLeft: 'ซ้ายบน',
    topCenter: 'กึ่งกลางบน',
    topRight: 'ขวาบน',
    bottomLeft: 'ซ้ายล่าง',
    bottomCenter: 'กึ่งกลางล่าง',
    bottomRight: 'ขวาล่าง',
  },
  id: {
    formatSimple: 'Hanya nomor',
    formatWithTotal: 'Nomor dan total',
    topLeft: 'Kiri atas',
    topCenter: 'Tengah atas',
    topRight: 'Kanan atas',
    bottomLeft: 'Kiri bawah',
    bottomCenter: 'Tengah bawah',
    bottomRight: 'Kanan bawah',
  },
  he: {
    formatSimple: 'מספר בלבד',
    formatWithTotal: 'מספר וסה"כ',
    topLeft: 'למעלה משמאל',
    topCenter: 'למעלה במרכז',
    topRight: 'למעלה מימין',
    bottomLeft: 'למטה משמאל',
    bottomCenter: 'למטה במרכז',
    bottomRight: 'למטה מימין',
  },
  ms: {
    formatSimple: 'Nombor sahaja',
    formatWithTotal: 'Nombor dan jumlah',
    topLeft: 'Kiri atas',
    topCenter: 'Tengah atas',
    topRight: 'Kanan atas',
    bottomLeft: 'Kiri bawah',
    bottomCenter: 'Tengah bawah',
    bottomRight: 'Kanan bawah',
  },
  no: {
    formatSimple: 'Kun nummer',
    formatWithTotal: 'Nummer og totalt',
    topLeft: 'Øverst til venstre',
    topCenter: 'Øverst i midten',
    topRight: 'Øverst til høyre',
    bottomLeft: 'Nederst til venstre',
    bottomCenter: 'Nederst i midten',
    bottomRight: 'Nederst til høyre',
  },
}

const FALLBACK_OPTION_LABELS: PageNumberOptionLabels = {
  formatSimple: 'Number only',
  formatWithTotal: 'Number and total',
  topLeft: 'Top left',
  topCenter: 'Top center',
  topRight: 'Top right',
  bottomLeft: 'Bottom left',
  bottomCenter: 'Bottom center',
  bottomRight: 'Bottom right',
}

const normalizeLocale = (locale: string): string => {
  if (OPTION_LABELS[locale]) {
    return locale
  }

  const baseLocale = locale.split('-')[0]
  if (baseLocale && OPTION_LABELS[baseLocale]) {
    return baseLocale
  }

  return 'en'
}

export const resolvePageNumberOptionLabels = (locale: string): PageNumberOptionLabels => {
  const normalized = normalizeLocale(locale)
  const labels = OPTION_LABELS[normalized]
  if (labels) {
    return labels
  }

  return FALLBACK_OPTION_LABELS
}
