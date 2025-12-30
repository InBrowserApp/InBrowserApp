import { describe, it, expect } from 'vitest'
import {
  splitIntoWords,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toScreamingSnakeCase,
  toKebabCase,
  toScreamingKebabCase,
  toDotCase,
  toPathCase,
  toTitleCase,
  toSentenceCase,
  toUpperCase,
  toLowerCase,
  convertCase,
} from './utils'

describe('splitIntoWords', () => {
  it('should return empty array for empty input', () => {
    expect(splitIntoWords('')).toEqual([])
    expect(splitIntoWords('   ')).toEqual([])
  })

  it('should split camelCase', () => {
    expect(splitIntoWords('camelCase')).toEqual(['camel', 'Case'])
    expect(splitIntoWords('myVariableName')).toEqual(['my', 'Variable', 'Name'])
  })

  it('should split PascalCase', () => {
    expect(splitIntoWords('PascalCase')).toEqual(['Pascal', 'Case'])
    expect(splitIntoWords('MyClassName')).toEqual(['My', 'Class', 'Name'])
  })

  it('should split snake_case', () => {
    expect(splitIntoWords('snake_case')).toEqual(['snake', 'case'])
    expect(splitIntoWords('my_variable_name')).toEqual(['my', 'variable', 'name'])
  })

  it('should split kebab-case', () => {
    expect(splitIntoWords('kebab-case')).toEqual(['kebab', 'case'])
    expect(splitIntoWords('my-component-name')).toEqual(['my', 'component', 'name'])
  })

  it('should split dot.case', () => {
    expect(splitIntoWords('dot.case')).toEqual(['dot', 'case'])
  })

  it('should split path/case', () => {
    expect(splitIntoWords('path/case')).toEqual(['path', 'case'])
  })

  it('should handle consecutive uppercase (acronyms)', () => {
    expect(splitIntoWords('XMLParser')).toEqual(['XML', 'Parser'])
    expect(splitIntoWords('parseHTML')).toEqual(['parse', 'HTML'])
  })

  it('should handle mixed separators', () => {
    expect(splitIntoWords('my_variable-name.test')).toEqual(['my', 'variable', 'name', 'test'])
  })

  it('should handle spaces', () => {
    expect(splitIntoWords('hello world')).toEqual(['hello', 'world'])
    expect(splitIntoWords('  multiple   spaces  ')).toEqual(['multiple', 'spaces'])
  })
})

describe('toCamelCase', () => {
  it('should return empty string for empty input', () => {
    expect(toCamelCase('')).toBe('')
  })

  it('should convert various inputs to camelCase', () => {
    expect(toCamelCase('hello world')).toBe('helloWorld')
    expect(toCamelCase('Hello World')).toBe('helloWorld')
    expect(toCamelCase('snake_case')).toBe('snakeCase')
    expect(toCamelCase('kebab-case')).toBe('kebabCase')
    expect(toCamelCase('PascalCase')).toBe('pascalCase')
  })

  it('should handle single word', () => {
    expect(toCamelCase('hello')).toBe('hello')
    expect(toCamelCase('HELLO')).toBe('hello')
  })
})

describe('toPascalCase', () => {
  it('should return empty string for empty input', () => {
    expect(toPascalCase('')).toBe('')
  })

  it('should convert various inputs to PascalCase', () => {
    expect(toPascalCase('hello world')).toBe('HelloWorld')
    expect(toPascalCase('snake_case')).toBe('SnakeCase')
    expect(toPascalCase('kebab-case')).toBe('KebabCase')
    expect(toPascalCase('camelCase')).toBe('CamelCase')
  })

  it('should handle single word', () => {
    expect(toPascalCase('hello')).toBe('Hello')
  })
})

describe('toSnakeCase', () => {
  it('should return empty string for empty input', () => {
    expect(toSnakeCase('')).toBe('')
  })

  it('should convert various inputs to snake_case', () => {
    expect(toSnakeCase('hello world')).toBe('hello_world')
    expect(toSnakeCase('HelloWorld')).toBe('hello_world')
    expect(toSnakeCase('camelCase')).toBe('camel_case')
    expect(toSnakeCase('kebab-case')).toBe('kebab_case')
  })
})

describe('toScreamingSnakeCase', () => {
  it('should return empty string for empty input', () => {
    expect(toScreamingSnakeCase('')).toBe('')
  })

  it('should convert various inputs to SCREAMING_SNAKE_CASE', () => {
    expect(toScreamingSnakeCase('hello world')).toBe('HELLO_WORLD')
    expect(toScreamingSnakeCase('camelCase')).toBe('CAMEL_CASE')
    expect(toScreamingSnakeCase('kebab-case')).toBe('KEBAB_CASE')
  })
})

describe('toKebabCase', () => {
  it('should return empty string for empty input', () => {
    expect(toKebabCase('')).toBe('')
  })

  it('should convert various inputs to kebab-case', () => {
    expect(toKebabCase('hello world')).toBe('hello-world')
    expect(toKebabCase('HelloWorld')).toBe('hello-world')
    expect(toKebabCase('camelCase')).toBe('camel-case')
    expect(toKebabCase('snake_case')).toBe('snake-case')
  })
})

describe('toScreamingKebabCase', () => {
  it('should return empty string for empty input', () => {
    expect(toScreamingKebabCase('')).toBe('')
  })

  it('should convert various inputs to SCREAMING-KEBAB-CASE', () => {
    expect(toScreamingKebabCase('hello world')).toBe('HELLO-WORLD')
    expect(toScreamingKebabCase('camelCase')).toBe('CAMEL-CASE')
  })
})

describe('toDotCase', () => {
  it('should return empty string for empty input', () => {
    expect(toDotCase('')).toBe('')
  })

  it('should convert various inputs to dot.case', () => {
    expect(toDotCase('hello world')).toBe('hello.world')
    expect(toDotCase('HelloWorld')).toBe('hello.world')
    expect(toDotCase('camelCase')).toBe('camel.case')
  })
})

describe('toPathCase', () => {
  it('should return empty string for empty input', () => {
    expect(toPathCase('')).toBe('')
  })

  it('should convert various inputs to path/case', () => {
    expect(toPathCase('hello world')).toBe('hello/world')
    expect(toPathCase('HelloWorld')).toBe('hello/world')
    expect(toPathCase('camelCase')).toBe('camel/case')
  })
})

describe('toTitleCase', () => {
  it('should return empty string for empty input', () => {
    expect(toTitleCase('')).toBe('')
  })

  it('should convert various inputs to Title Case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World')
    expect(toTitleCase('camelCase')).toBe('Camel Case')
    expect(toTitleCase('snake_case')).toBe('Snake Case')
  })
})

describe('toSentenceCase', () => {
  it('should return empty string for empty input', () => {
    expect(toSentenceCase('')).toBe('')
  })

  it('should convert various inputs to Sentence case', () => {
    expect(toSentenceCase('hello world')).toBe('Hello world')
    expect(toSentenceCase('camelCase')).toBe('Camel case')
    expect(toSentenceCase('HELLO WORLD')).toBe('Hello world')
  })
})

describe('toUpperCase', () => {
  it('should return empty string for empty input', () => {
    expect(toUpperCase('')).toBe('')
  })

  it('should convert various inputs to UPPERCASE', () => {
    expect(toUpperCase('hello world')).toBe('HELLO WORLD')
    expect(toUpperCase('camelCase')).toBe('CAMEL CASE')
  })
})

describe('toLowerCase', () => {
  it('should return empty string for empty input', () => {
    expect(toLowerCase('')).toBe('')
  })

  it('should convert various inputs to lowercase', () => {
    expect(toLowerCase('HELLO WORLD')).toBe('hello world')
    expect(toLowerCase('CamelCase')).toBe('camel case')
  })
})

describe('convertCase', () => {
  const input = 'helloWorld'

  it('should convert using all case types', () => {
    expect(convertCase(input, 'camelCase')).toBe('helloWorld')
    expect(convertCase(input, 'PascalCase')).toBe('HelloWorld')
    expect(convertCase(input, 'snake_case')).toBe('hello_world')
    expect(convertCase(input, 'SCREAMING_SNAKE_CASE')).toBe('HELLO_WORLD')
    expect(convertCase(input, 'kebab-case')).toBe('hello-world')
    expect(convertCase(input, 'SCREAMING-KEBAB-CASE')).toBe('HELLO-WORLD')
    expect(convertCase(input, 'dot.case')).toBe('hello.world')
    expect(convertCase(input, 'path/case')).toBe('hello/world')
    expect(convertCase(input, 'Title Case')).toBe('Hello World')
    expect(convertCase(input, 'Sentence case')).toBe('Hello world')
    expect(convertCase(input, 'UPPERCASE')).toBe('HELLO WORLD')
    expect(convertCase(input, 'lowercase')).toBe('hello world')
  })
})

describe('edge cases', () => {
  it('should handle numbers in input', () => {
    expect(splitIntoWords('test123')).toEqual(['test123'])
    expect(toCamelCase('test123')).toBe('test123')
  })

  it('should handle single character', () => {
    expect(splitIntoWords('a')).toEqual(['a'])
    expect(toCamelCase('a')).toBe('a')
  })

  it('should handle already formatted input', () => {
    expect(toSnakeCase('already_snake_case')).toBe('already_snake_case')
    expect(toKebabCase('already-kebab-case')).toBe('already-kebab-case')
  })
})
