export default {
  common: {
    unknown: '未知',
  },
  dns: {
    rcode: {
      '0': {
        description: '无错误',
      },
      '1': {
        description: '格式错误',
      },
      '2': {
        description: '服务器失败',
      },
      '3': {
        description: '域名不存在',
      },
      '4': {
        description: '功能未实现',
      },
      '5': {
        description: '查询被拒绝',
      },
      '6': {
        description: '域名已存在但不应存在',
      },
      '7': {
        description: 'RR集合已存在但不应存在',
      },
      '8': {
        description: 'RR集合应存在但不存在',
      },
      '9': {
        description: '服务器对区域没有权威',
      },
      '10': {
        description: '域名不在区域内',
      },
      '11': {
        description: 'DSO-TYPE 未实现',
      },
      '16': {
        description: 'OPT 版本错误',
      },
      '17': {
        description: '密钥不可识别',
      },
      '18': {
        description: '签名超出时间窗口',
      },
      '19': {
        description: 'TKEY 模式错误',
      },
      '20': {
        description: '重复的密钥名称',
      },
      '21': {
        description: '算法不支持',
      },
      '22': {
        description: '截断错误',
      },
      '23': {
        description: '服务器 Cookie 错误/缺失',
      },
    },
  },
} as const
