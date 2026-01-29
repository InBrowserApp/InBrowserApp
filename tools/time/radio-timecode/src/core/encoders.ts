import { bpcSignalForSecond } from './encoders/bpc'
import { dcf77SignalForSecond } from './encoders/dcf77'
import { jjySignalForSecond } from './encoders/jjy'
import { msfSignalForSecond } from './encoders/msf'
import { wwvbSignalForSecond } from './encoders/wwvb'
import type { SecondSignal, StationId } from './encoders/types'

export type { SecondSignal, StationId, Window } from './encoders/types'

export function getStationSignal(stationId: StationId, date: Date): SecondSignal {
  switch (stationId) {
    case 'jjy-40':
    case 'jjy-60':
      return jjySignalForSecond(date)
    case 'bpc':
      return bpcSignalForSecond(date)
    case 'dcf77':
      return dcf77SignalForSecond(date)
    case 'msf':
      return msfSignalForSecond(date)
    case 'wwvb':
      return wwvbSignalForSecond(date)
    default:
      return { windows: [], symbol: '-' }
  }
}
