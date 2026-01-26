export default {
  common: {
    unknown: '未知',
  },
  dns: {
    rcode: {
      '0': {
        description: '無錯誤',
      },
      '1': {
        description: '格式錯誤',
      },
      '2': {
        description: '伺服器失敗',
      },
      '3': {
        description: '域名不存在',
      },
      '4': {
        description: '功能未實現',
      },
      '5': {
        description: '查詢被拒絕',
      },
      '6': {
        description: '域名已存在但不應存在',
      },
      '7': {
        description: 'RR集合已存在但不應存在',
      },
      '8': {
        description: 'RR集合應存在但不存在',
      },
      '9': {
        description: '伺服器對區域沒有權威',
      },
      '10': {
        description: '域名不在區域內',
      },
      '11': {
        description: 'DSO-TYPE 未實現',
      },
      '16': {
        description: 'OPT 版本錯誤',
      },
      '17': {
        description: '金鑰不可識別',
      },
      '18': {
        description: '簽章超出時間窗口',
      },
      '19': {
        description: 'TKEY 模式錯誤',
      },
      '20': {
        description: '重複的金鑰名稱',
      },
      '21': {
        description: '演算法不支援',
      },
      '22': {
        description: '截斷錯誤',
      },
      '23': {
        description: '伺服器 Cookie 錯誤/缺失',
      },
    },
  },
} as const
