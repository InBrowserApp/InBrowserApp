export default {
  common: {
    unknown: 'Bilinmeyen',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Hata Yok',
      },
      '1': {
        description: 'Format Hatası',
      },
      '2': {
        description: 'Sunucu Hatası',
      },
      '3': {
        description: 'Var Olmayan Domain',
      },
      '4': {
        description: 'Uygulanmadı',
      },
      '5': {
        description: 'Sorgu Reddedildi',
      },
      '6': {
        description: 'İsim olmaması gerekirken var',
      },
      '7': {
        description: 'RR Seti olmaması gerekirken var',
      },
      '8': {
        description: 'Olması gereken RR Seti yok',
      },
      '9': {
        description: 'Sunucu bölge için yetkili değil',
      },
      '10': {
        description: 'İsim bölgede yer almıyor',
      },
      '11': {
        description: 'DSO-TYPE Uygulanmadı',
      },
      '16': {
        description: 'Kötü OPT Sürümü',
      },
      '17': {
        description: 'Anahtar tanınmadı',
      },
      '18': {
        description: 'İmza zaman penceresinin dışında',
      },
      '19': {
        description: 'Kötü TKEY Modu',
      },
      '20': {
        description: 'Tekrarlanan anahtar adı',
      },
      '21': {
        description: 'Algoritma desteklenmiyor',
      },
      '22': {
        description: 'Kötü Kesme',
      },
      '23': {
        description: "Kötü/Eksik Sunucu Cookie'si",
      },
    },
  },
} as const
