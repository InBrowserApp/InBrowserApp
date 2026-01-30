export const DIGITS_SIMPLIFIED = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
export const DIGITS_TRADITIONAL = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖']
export const SMALL_UNITS = ['', '拾', '佰', '仟']
export const GROUP_UNITS_SIMPLIFIED = ['', '万', '亿', '兆']
export const GROUP_UNITS_TRADITIONAL = ['', '萬', '億', '兆']
export const CURRENCY_SIMPLIFIED = '元'
export const CURRENCY_TRADITIONAL = '圓'
export const NEGATIVE_SIMPLIFIED = '负'
export const NEGATIVE_TRADITIONAL = '負'
export const COMPLETE_TEXT = '整'
export const ZERO_TEXT = '零'
export const JIAO_UNIT = '角'
export const FEN_UNIT = '分'

export const MAX_INTEGER_LENGTH = 15
export const MAX_INTEGER = '999999999999999'
export const MAX_INTEGER_VALUE = 999999999999999n

export const DIGIT_VALUES: Record<string, number> = {
  零: 0,
  〇: 0,
  壹: 1,
  贰: 2,
  貳: 2,
  叁: 3,
  參: 3,
  肆: 4,
  伍: 5,
  陆: 6,
  陸: 6,
  柒: 7,
  捌: 8,
  玖: 9,
  两: 2,
  兩: 2,
}

export const SMALL_UNIT_VALUES: Record<string, bigint> = {
  拾: 10n,
  佰: 100n,
  仟: 1000n,
}

export const BIG_UNIT_VALUES: Record<string, bigint> = {
  万: 10000n,
  萬: 10000n,
  亿: 100000000n,
  億: 100000000n,
  兆: 1000000000000n,
}

export const NORMALIZE_MAP: Record<string, string> = {
  貳: '贰',
  參: '叁',
  陸: '陆',
  萬: '万',
  億: '亿',
  圆: '元',
  圓: '元',
  正: '整',
  負: '负',
  兩: '两',
  〇: '零',
}
