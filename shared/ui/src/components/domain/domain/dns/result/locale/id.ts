export default {
  common: {
    unknown: 'Tidak Diketahui',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Tidak Ada Kesalahan',
      },
      '1': {
        description: 'Kesalahan Format',
      },
      '2': {
        description: 'Kegagalan Server',
      },
      '3': {
        description: 'Domain Tidak Ada',
      },
      '4': {
        description: 'Tidak Diimplementasikan',
      },
      '5': {
        description: 'Query Ditolak',
      },
      '6': {
        description: 'Nama Ada padahal seharusnya tidak',
      },
      '7': {
        description: 'RR Set Ada padahal seharusnya tidak',
      },
      '8': {
        description: 'RR Set yang seharusnya ada tidak ada',
      },
      '9': {
        description: 'Server Tidak Otoriter untuk zona',
      },
      '10': {
        description: 'Nama tidak terkandung dalam zona',
      },
      '11': {
        description: 'DSO-TYPE Tidak Diimplementasikan',
      },
      '16': {
        description: 'Versi OPT Buruk',
      },
      '17': {
        description: 'Kunci tidak dikenali',
      },
      '18': {
        description: 'Tanda tangan di luar jendela waktu',
      },
      '19': {
        description: 'Mode TKEY Buruk',
      },
      '20': {
        description: 'Nama kunci duplikat',
      },
      '21': {
        description: 'Algoritma tidak didukung',
      },
      '22': {
        description: 'Pemotongan Buruk',
      },
      '23': {
        description: 'Cookie Server Buruk/Hilang',
      },
    },
  },
} as const
