export default {
  common: {
    unknown: '알 수 없음',
  },
  dns: {
    rcode: {
      '0': {
        description: '오류 없음',
      },
      '1': {
        description: '형식 오류',
      },
      '2': {
        description: '서버 실패',
      },
      '3': {
        description: '존재하지 않는 도메인',
      },
      '4': {
        description: '구현되지 않음',
      },
      '5': {
        description: '쿼리 거부됨',
      },
      '6': {
        description: '존재해서는 안 되는 이름이 존재함',
      },
      '7': {
        description: '존재해서는 안 되는 RR 세트가 존재함',
      },
      '8': {
        description: '존재해야 하는 RR 세트가 존재하지 않음',
      },
      '9': {
        description: '영역에 대해 권위가 없는 서버',
      },
      '10': {
        description: '영역에 포함되지 않은 이름',
      },
      '11': {
        description: 'DSO-TYPE 구현되지 않음',
      },
      '16': {
        description: '잘못된 OPT 버전',
      },
      '17': {
        description: '인식되지 않는 키',
      },
      '18': {
        description: '시간 창 밖의 서명',
      },
      '19': {
        description: '잘못된 TKEY 모드',
      },
      '20': {
        description: '중복된 키 이름',
      },
      '21': {
        description: '지원되지 않는 알고리즘',
      },
      '22': {
        description: '잘못된 절단',
      },
      '23': {
        description: '잘못된/누락된 서버 쿠키',
      },
    },
  },
} as const
