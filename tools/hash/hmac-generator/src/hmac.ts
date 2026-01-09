import type { HmacAlgorithm } from './types'
import HmacMD5 from 'crypto-js/hmac-md5'
import HmacSHA1 from 'crypto-js/hmac-sha1'
import HmacSHA224 from 'crypto-js/hmac-sha224'
import HmacSHA256 from 'crypto-js/hmac-sha256'
import HmacSHA384 from 'crypto-js/hmac-sha384'
import HmacSHA512 from 'crypto-js/hmac-sha512'
import HmacSHA3 from 'crypto-js/hmac-sha3'
import HmacRIPEMD160 from 'crypto-js/hmac-ripemd160'
import WordArray from 'crypto-js/lib-typedarrays'
import CryptoJS from 'crypto-js'

function wordArrayToArrayBuffer(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
  const words = wordArray.words
  const sigBytes = wordArray.sigBytes
  const u8 = new Uint8Array(sigBytes)
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2]! >>> (24 - (i % 4) * 8)) & 0xff
  }
  return u8.buffer
}

export async function generateHmac(
  message: string | Blob,
  secretKey: string,
  algorithm: HmacAlgorithm,
): Promise<ArrayBuffer> {
  // Convert Blob to string if needed
  let messageStr: string
  if (typeof message === 'string') {
    messageStr = message
  } else {
    const arrayBuffer = await message.arrayBuffer()
    // Use WordArray for binary data
    const wordArray = WordArray.create(arrayBuffer)
    return generateHmacFromWordArray(wordArray, secretKey, algorithm)
  }

  // For string input, use crypto-js directly
  return generateHmacFromString(messageStr, secretKey, algorithm)
}

function generateHmacFromString(
  message: string,
  secretKey: string,
  algorithm: HmacAlgorithm,
): ArrayBuffer {
  let result: CryptoJS.lib.WordArray

  switch (algorithm) {
    case 'MD5':
      result = HmacMD5(message, secretKey)
      break
    case 'SHA-1':
      result = HmacSHA1(message, secretKey)
      break
    case 'SHA-224':
      result = HmacSHA224(message, secretKey)
      break
    case 'SHA-256':
      result = HmacSHA256(message, secretKey)
      break
    case 'SHA-384':
      result = HmacSHA384(message, secretKey)
      break
    case 'SHA-512':
      result = HmacSHA512(message, secretKey)
      break
    case 'SHA3-256':
      result = HmacSHA3(message, secretKey)
      break
    case 'SHA3-384':
      result = HmacSHA3(message, secretKey)
      break
    case 'SHA3-512':
      result = HmacSHA3(message, secretKey)
      break
    case 'RIPEMD-160':
      result = HmacRIPEMD160(message, secretKey)
      break
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`)
  }

  return wordArrayToArrayBuffer(result)
}

function generateHmacFromWordArray(
  message: CryptoJS.lib.WordArray,
  secretKey: string,
  algorithm: HmacAlgorithm,
): ArrayBuffer {
  let result: CryptoJS.lib.WordArray

  switch (algorithm) {
    case 'MD5':
      result = HmacMD5(message, secretKey)
      break
    case 'SHA-1':
      result = HmacSHA1(message, secretKey)
      break
    case 'SHA-224':
      result = HmacSHA224(message, secretKey)
      break
    case 'SHA-256':
      result = HmacSHA256(message, secretKey)
      break
    case 'SHA-384':
      result = HmacSHA384(message, secretKey)
      break
    case 'SHA-512':
      result = HmacSHA512(message, secretKey)
      break
    case 'SHA3-256':
      result = HmacSHA3(message, secretKey)
      break
    case 'SHA3-384':
      result = HmacSHA3(message, secretKey)
      break
    case 'SHA3-512':
      result = HmacSHA3(message, secretKey)
      break
    case 'RIPEMD-160':
      result = HmacRIPEMD160(message, secretKey)
      break
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`)
  }

  return wordArrayToArrayBuffer(result)
}
