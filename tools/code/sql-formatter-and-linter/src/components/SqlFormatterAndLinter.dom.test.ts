import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'

const { formatMock } = vi.hoisted(() => ({
  formatMock: vi.fn((value: string, options: { language: string }) => {
    if (value.includes('SYNTAX_ERROR')) {
      throw new Error('Parse error: Unexpected token at line 2 column 7')
    }
    return `FORMATTED:${options.language}:${value.trim()}`
  }),
}))

vi.mock('sql-formatter', () => ({
  format: formatMock,
}))

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

import SqlFormatterAndLinter from './SqlFormatterAndLinter.vue'

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h3><slot /></h3>',
})

const SqlToolbarStub = defineComponent({
  name: 'SqlToolbar',
  props: ['formattedSql', 'downloadUrl', 'downloadFilename'],
  emits: ['import', 'sample', 'clear'],
  template: `
    <div class="toolbar" :data-formatted="formattedSql" :data-download="downloadFilename">
      <button class="import" @click="$emit('import')">import</button>
      <button class="sample" @click="$emit('sample')">sample</button>
      <button class="clear" @click="$emit('clear')">clear</button>
    </div>
  `,
})

const SqlFormatOptionsStub = defineComponent({
  name: 'SqlFormatOptions',
  props: [
    'dialect',
    'tabWidth',
    'useTabs',
    'linesBetweenQueries',
    'expressionWidth',
    'keywordCase',
    'dataTypeCase',
    'functionCase',
  ],
  emits: [
    'update:dialect',
    'update:tabWidth',
    'update:useTabs',
    'update:linesBetweenQueries',
    'update:expressionWidth',
    'update:keywordCase',
    'update:dataTypeCase',
    'update:functionCase',
  ],
  template: `
    <div class="format-options" :data-dialect="dialect">
      <button
        class="set-format-options"
        @click="
          $emit('update:dialect', 'mysql');
          $emit('update:tabWidth', 4);
          $emit('update:useTabs', true);
          $emit('update:linesBetweenQueries', 2);
          $emit('update:expressionWidth', 80);
          $emit('update:keywordCase', 'upper');
          $emit('update:dataTypeCase', 'upper');
          $emit('update:functionCase', 'lower');
        "
      >
        set format options
      </button>
    </div>
  `,
})

const SqlLintOptionsStub = defineComponent({
  name: 'SqlLintOptions',
  props: ['checkSelectStar', 'checkUnsafeMutation', 'requireSemicolon', 'maxLineLength'],
  emits: [
    'update:checkSelectStar',
    'update:checkUnsafeMutation',
    'update:requireSemicolon',
    'update:maxLineLength',
  ],
  template: `
    <div class="lint-options">
      <button
        class="set-lint-options"
        @click="
          $emit('update:checkSelectStar', false);
          $emit('update:checkUnsafeMutation', false);
          $emit('update:requireSemicolon', false);
          $emit('update:maxLineLength', 40);
        "
      >
        set lint options
      </button>
    </div>
  `,
})

const SqlInputOutputStub = defineComponent({
  name: 'SqlInputOutput',
  props: ['sourceSql', 'formattedSql', 'formatError'],
  emits: ['update:sourceSql'],
  template: `
    <div class="input-output" :data-source="sourceSql" :data-error="formatError" :data-formatted="formattedSql">
      <button class="set-invalid-source" @click="$emit('update:sourceSql', 'SYNTAX_ERROR')">invalid</button>
      <button class="set-valid-source" @click="$emit('update:sourceSql', 'SELECT * FROM users')">valid</button>
    </div>
  `,
})

const SqlLintResultStub = defineComponent({
  name: 'SqlLintResult',
  props: {
    issues: {
      type: Array,
      default: () => [],
    },
  },
  template:
    '<div class="lint-result" :data-count="issues.length" :data-codes="issues.map((issue) => issue.code).join(\',\')" />',
})

const flushFormatting = async () => {
  vi.advanceTimersByTime(300)
  await flushPromises()
}

const mountComponent = () =>
  mount(SqlFormatterAndLinter, {
    global: {
      stubs: {
        ToolSection: ToolSectionStub,
        ToolSectionHeader: ToolSectionHeaderStub,
        SqlToolbar: SqlToolbarStub,
        SqlFormatOptions: SqlFormatOptionsStub,
        SqlLintOptions: SqlLintOptionsStub,
        SqlInputOutput: SqlInputOutputStub,
        SqlLintResult: SqlLintResultStub,
      },
    },
  })

describe('SqlFormatterAndLinter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    formatMock.mockClear()
    fileOpenMock.mockReset()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats the initial sample on load', async () => {
    const wrapper = mountComponent()
    await flushFormatting()

    expect(formatMock).toHaveBeenCalled()
    expect(formatMock).toHaveBeenLastCalledWith(
      expect.stringContaining('SELECT id, email, created_at'),
      expect.objectContaining({ language: 'sql' }),
    )

    const inputOutput = wrapper.findComponent(SqlInputOutputStub)
    expect(inputOutput.props('formatError')).toBe('')
    expect(inputOutput.props('formattedSql')).toContain('FORMATTED:sql:')
  })

  it('updates formatter options when child model events are emitted', async () => {
    const wrapper = mountComponent()
    await flushFormatting()

    await wrapper.get('.set-format-options').trigger('click')
    await flushFormatting()

    expect(formatMock).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        language: 'mysql',
        tabWidth: 4,
        useTabs: true,
        linesBetweenQueries: 2,
        expressionWidth: 80,
        keywordCase: 'upper',
        dataTypeCase: 'upper',
        functionCase: 'lower',
      }),
    )
  })

  it('shows format errors and includes parse lint issue code', async () => {
    const wrapper = mountComponent()
    await flushFormatting()

    await wrapper.get('.set-invalid-source').trigger('click')
    await flushFormatting()

    const inputOutput = wrapper.findComponent(SqlInputOutputStub)
    expect(inputOutput.props('formatError')).toContain('Parse error')

    const lintResult = wrapper.find('.lint-result')
    expect(lintResult.attributes('data-codes')).toContain('parse-error')
  })

  it('imports SQL files and detects dialect from extension', async () => {
    fileOpenMock.mockResolvedValue({
      name: 'query.pgsql',
      text: async () => 'SELECT now();',
    })

    const wrapper = mountComponent()
    await flushFormatting()

    await wrapper.get('.import').trigger('click')
    await flushPromises()
    await flushFormatting()

    expect(formatMock).toHaveBeenLastCalledWith(
      expect.stringContaining('SELECT now()'),
      expect.objectContaining({ language: 'postgresql' }),
    )

    expect(wrapper.findComponent(SqlFormatOptionsStub).props('dialect')).toBe('postgresql')
    expect(wrapper.findComponent(SqlInputOutputStub).props('sourceSql')).toContain('SELECT now();')
  })

  it('normalizes invalid persisted dialect values', async () => {
    localStorage.setItem('tools:sql-formatter-and-linter:dialect', JSON.stringify('invalid'))

    const wrapper = mountComponent()
    await flushFormatting()

    expect(wrapper.findComponent(SqlFormatOptionsStub).props('dialect')).toBe('sql')
    expect(formatMock).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ language: 'sql' }),
    )
  })

  it('keeps current dialect when imported filename has no extension', async () => {
    fileOpenMock.mockResolvedValue({
      name: 'README',
      text: async () => 'SELECT 42;',
    })

    const wrapper = mountComponent()
    await flushFormatting()

    await wrapper.get('.import').trigger('click')
    await flushPromises()
    await flushFormatting()

    expect(wrapper.findComponent(SqlFormatOptionsStub).props('dialect')).toBe('sql')
  })

  it('shows fallback error message for non-Error throws', async () => {
    formatMock.mockImplementationOnce(() => {
      throw 'boom'
    })

    const wrapper = mountComponent()
    await flushFormatting()

    const inputOutput = wrapper.findComponent(SqlInputOutputStub)
    expect(inputOutput.props('formatError')).toBe('Formatting failed')
  })

  it('keeps current dialect for unknown file extensions', async () => {
    fileOpenMock.mockResolvedValue({
      name: 'query.unknown',
      text: async () => 'SELECT 99;',
    })

    const wrapper = mountComponent()
    await flushFormatting()

    await wrapper.get('.import').trigger('click')
    await flushPromises()
    await flushFormatting()

    expect(wrapper.findComponent(SqlFormatOptionsStub).props('dialect')).toBe('sql')
  })

  it('supports clear and sample actions', async () => {
    const wrapper = mountComponent()
    await flushFormatting()

    await wrapper.get('.clear').trigger('click')
    await flushFormatting()

    expect(wrapper.findComponent(SqlInputOutputStub).props('sourceSql')).toBe('')
    expect(wrapper.findComponent(SqlInputOutputStub).props('formattedSql')).toBe('')

    await wrapper.get('.sample').trigger('click')
    await flushFormatting()

    expect(wrapper.findComponent(SqlInputOutputStub).props('sourceSql')).toContain(
      'SELECT id, email',
    )
  })

  it('accepts lint option updates', async () => {
    const wrapper = mountComponent()
    await flushFormatting()

    await wrapper.get('.set-lint-options').trigger('click')
    await flushFormatting()

    expect(wrapper.findComponent(SqlLintOptionsStub).props('checkSelectStar')).toBe(false)
    expect(wrapper.findComponent(SqlLintOptionsStub).props('checkUnsafeMutation')).toBe(false)
    expect(wrapper.findComponent(SqlLintOptionsStub).props('requireSemicolon')).toBe(false)
    expect(wrapper.findComponent(SqlLintOptionsStub).props('maxLineLength')).toBe(40)
  })
})
