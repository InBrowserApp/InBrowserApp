export default {
  common: {
    unknown: 'غير معروف',
  },
  dns: {
    rcode: {
      '0': {
        description: 'لا يوجد خطأ',
      },
      '1': {
        description: 'خطأ في التنسيق',
      },
      '2': {
        description: 'فشل الخادم',
      },
      '3': {
        description: 'نطاق غير موجود',
      },
      '4': {
        description: 'غير مُنفذ',
      },
      '5': {
        description: 'الاستعلام مرفوض',
      },
      '6': {
        description: 'الاسم موجود عندما لا يجب أن يكون',
      },
      '7': {
        description: 'مجموعة RR موجودة عندما لا يجب أن تكون',
      },
      '8': {
        description: 'مجموعة RR التي يجب أن توجد غير موجودة',
      },
      '9': {
        description: 'الخادم غير موثق للمنطقة',
      },
      '10': {
        description: 'الاسم غير موجود في المنطقة',
      },
      '11': {
        description: 'DSO-TYPE غير منفذ',
      },
      '16': {
        description: 'إصدار OPT سيء',
      },
      '17': {
        description: 'المفتاح غير معروف',
      },
      '18': {
        description: 'التوقيع خارج نافذة الوقت',
      },
      '19': {
        description: 'وضع TKEY سيء',
      },
      '20': {
        description: 'اسم مفتاح مكرر',
      },
      '21': {
        description: 'الخوارزمية غير مدعومة',
      },
      '22': {
        description: 'اقتطاع سيء',
      },
      '23': {
        description: 'كوكي الخادم سيء/مفقود',
      },
    },
  },
} as const
