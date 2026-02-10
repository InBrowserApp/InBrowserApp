import * as Comlink from 'comlink'
import crc1 from 'crc/calculators/crc1'
import crc8 from 'crc/calculators/crc8'
import crc81wire from 'crc/calculators/crc81wire'
import crc8dvbs2 from 'crc/calculators/crc8dvbs2'
import crc16 from 'crc/calculators/crc16'
import crc16ccitt from 'crc/calculators/crc16ccitt'
import crc16modbus from 'crc/calculators/crc16modbus'
import crc16kermit from 'crc/calculators/crc16kermit'
import crc16xmodem from 'crc/calculators/crc16xmodem'
import crc24 from 'crc/calculators/crc24'
import crc32 from 'crc/calculators/crc32'
import crc32mpeg from 'crc/calculators/crc32mpeg2'
import crcjam from 'crc/calculators/crcjam'
import { crc64Calculators } from './crc64'

type CalculatorResult = number | bigint

type CalculatorConfig = {
  name: string
  bits: number
  calculator: (input: Uint8Array) => CalculatorResult
}

const toUnsignedHex = (value: CalculatorResult, bits: number): string => {
  const width = Math.ceil(bits / 4)
  if (typeof value === 'bigint') {
    return BigInt.asUintN(bits, value).toString(16).padStart(width, '0')
  }

  const modulo = 2 ** bits
  const normalized = ((value % modulo) + modulo) % modulo
  return normalized.toString(16).padStart(width, '0')
}

const calculators: CalculatorConfig[] = [
  {
    name: 'CRC1',
    bits: 1,
    calculator: crc1,
  },
  {
    name: 'CRC8',
    bits: 8,
    calculator: crc8,
  },
  {
    name: 'CRC8 1-Wire',
    bits: 8,
    calculator: crc81wire,
  },
  {
    name: 'CRC8 DVB-S2',
    bits: 8,
    calculator: crc8dvbs2,
  },
  {
    name: 'CRC16',
    bits: 16,
    calculator: crc16,
  },
  {
    name: 'CRC16 CCITT',
    bits: 16,
    calculator: crc16ccitt,
  },
  {
    name: 'CRC16 Modbus',
    bits: 16,
    calculator: crc16modbus,
  },
  {
    name: 'CRC16 Kermit',
    bits: 16,
    calculator: crc16kermit,
  },
  {
    name: 'CRC16 XModem',
    bits: 16,
    calculator: crc16xmodem,
  },
  {
    name: 'CRC24',
    bits: 24,
    calculator: crc24,
  },
  {
    name: 'CRC32',
    bits: 32,
    calculator: crc32,
  },
  {
    name: 'CRC32 MPEG-2',
    bits: 32,
    calculator: crc32mpeg,
  },
  {
    name: 'CRCJAM',
    bits: 32,
    calculator: crcjam,
  },
  ...crc64Calculators,
]

class CRCCalculator {
  async calculate(data: Blob) {
    const buffer = await data.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    const results = calculators.map(({ name, bits, calculator }) => {
      const crc = toUnsignedHex(calculator(uint8Array), bits)
      return {
        name,
        crc,
      }
    })
    return results
  }
}

export type CRCCalculatorType = typeof CRCCalculator

Comlink.expose(CRCCalculator)
