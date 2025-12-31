export type RotType = 'rot13' | 'rot5' | 'rot18' | 'rot47'

// ROT13: Rotate letters by 13 positions
function rot13Char(char: string): string {
  const code = char.charCodeAt(0)
  // A-Z (65-90)
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + 13) % 26) + 65)
  }
  // a-z (97-122)
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + 13) % 26) + 97)
  }
  return char
}

// ROT5: Rotate digits by 5 positions
function rot5Char(char: string): string {
  const code = char.charCodeAt(0)
  // 0-9 (48-57)
  if (code >= 48 && code <= 57) {
    return String.fromCharCode(((code - 48 + 5) % 10) + 48)
  }
  return char
}

// ROT47: Rotate printable ASCII by 47 positions
function rot47Char(char: string): string {
  const code = char.charCodeAt(0)
  // Printable ASCII: ! to ~ (33-126), 94 characters
  if (code >= 33 && code <= 126) {
    return String.fromCharCode(((code - 33 + 47) % 94) + 33)
  }
  return char
}

// ROT18: Combine ROT13 + ROT5
function rot18Char(char: string): string {
  const code = char.charCodeAt(0)
  // Letters: apply ROT13
  if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
    return rot13Char(char)
  }
  // Digits: apply ROT5
  if (code >= 48 && code <= 57) {
    return rot5Char(char)
  }
  return char
}

export function rot(text: string, type: RotType): string {
  let result = ''
  for (const char of text) {
    switch (type) {
      case 'rot13':
        result += rot13Char(char)
        break
      case 'rot5':
        result += rot5Char(char)
        break
      case 'rot18':
        result += rot18Char(char)
        break
      case 'rot47':
        result += rot47Char(char)
        break
    }
  }
  return result
}
