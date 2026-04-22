type RotType = "rot13" | "rot5" | "rot18" | "rot47"

function rot13Char(character: string) {
  const code = character.charCodeAt(0)

  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + 13) % 26) + 65)
  }

  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + 13) % 26) + 97)
  }

  return character
}

function rot5Char(character: string) {
  const code = character.charCodeAt(0)

  if (code >= 48 && code <= 57) {
    return String.fromCharCode(((code - 48 + 5) % 10) + 48)
  }

  return character
}

function rot18Char(character: string) {
  const code = character.charCodeAt(0)

  if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
    return rot13Char(character)
  }

  if (code >= 48 && code <= 57) {
    return rot5Char(character)
  }

  return character
}

function rot47Char(character: string) {
  const code = character.charCodeAt(0)

  if (code >= 33 && code <= 126) {
    return String.fromCharCode(((code - 33 + 47) % 94) + 33)
  }

  return character
}

function rot(text: string, type: RotType) {
  let result = ""

  for (const character of text) {
    switch (type) {
      case "rot13":
        result += rot13Char(character)
        break
      case "rot5":
        result += rot5Char(character)
        break
      case "rot18":
        result += rot18Char(character)
        break
      case "rot47":
        result += rot47Char(character)
        break
    }
  }

  return result
}

export { rot, rot13Char, rot18Char, rot47Char, rot5Char }
export type { RotType }
