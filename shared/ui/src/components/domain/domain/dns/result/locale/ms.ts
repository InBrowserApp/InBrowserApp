export default {
  common: {
    unknown: 'Tidak Diketahui',
  },
  dns: {
    rcode: {
      '0': {
        description: 'Tiada Ralat',
      },
      '1': {
        description: 'Ralat Format',
      },
      '2': {
        description: 'Kegagalan Pelayan',
      },
      '3': {
        description: 'Domain Tidak Wujud',
      },
      '4': {
        description: 'Tidak Dilaksanakan',
      },
      '5': {
        description: 'Pertanyaan Ditolak',
      },
      '6': {
        description: 'Nama Wujud apabila tidak sepatutnya',
      },
      '7': {
        description: 'RR Set Wujud apabila tidak sepatutnya',
      },
      '8': {
        description: 'RR Set yang sepatutnya wujud tidak wujud',
      },
      '9': {
        description: 'Pelayan Tidak Berkuasa untuk zon',
      },
      '10': {
        description: 'Nama tidak terkandung dalam zon',
      },
      '11': {
        description: 'DSO-TYPE Tidak Dilaksanakan',
      },
      '16': {
        description: 'Versi OPT Buruk',
      },
      '17': {
        description: 'Kunci tidak dikenali',
      },
      '18': {
        description: 'Tandatangan di luar tetingkap masa',
      },
      '19': {
        description: 'Mod TKEY Buruk',
      },
      '20': {
        description: 'Nama kunci berganda',
      },
      '21': {
        description: 'Algoritma tidak disokong',
      },
      '22': {
        description: 'Pemotongan Buruk',
      },
      '23': {
        description: 'Cookie Pelayan Buruk/Hilang',
      },
    },
  },
} as const
