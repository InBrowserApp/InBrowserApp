export default {
  common: {
    unknown: '不明',
  },
  dns: {
    rcode: {
      '0': {
        description: 'エラーなし',
      },
      '1': {
        description: 'フォーマットエラー',
      },
      '2': {
        description: 'サーバー障害',
      },
      '3': {
        description: '存在しないドメイン',
      },
      '4': {
        description: '未実装',
      },
      '5': {
        description: 'クエリ拒否',
      },
      '6': {
        description: '存在すべきでない名前が存在',
      },
      '7': {
        description: '存在すべきでないRRセットが存在',
      },
      '8': {
        description: '存在すべきRRセットが存在しない',
      },
      '9': {
        description: 'ゾーンに対して権威のないサーバー',
      },
      '10': {
        description: '名前がゾーンに含まれていない',
      },
      '11': {
        description: 'DSO-TYPE未実装',
      },
      '16': {
        description: '不正なOPTバージョン',
      },
      '17': {
        description: '認識されないキー',
      },
      '18': {
        description: '時間窓外の署名',
      },
      '19': {
        description: '不正なTKEYモード',
      },
      '20': {
        description: '重複するキー名',
      },
      '21': {
        description: 'サポートされていないアルゴリズム',
      },
      '22': {
        description: '不正な切り捨て',
      },
      '23': {
        description: '不正/欠損サーバークッキー',
      },
    },
  },
} as const
