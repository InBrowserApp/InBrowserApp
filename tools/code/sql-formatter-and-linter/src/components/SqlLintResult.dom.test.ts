import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SqlLintResult from './SqlLintResult.vue'
import type { SqlLintIssue } from '../sqlLint'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div class="alert"><slot /></div>',
    }),
    NTable: defineComponent({
      name: 'NTable',
      template: '<table class="table"><slot /></table>',
    }),
    NTag: defineComponent({
      name: 'NTag',
      template: '<span class="tag"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      props: ['code'],
      template: '<span class="text"><slot /></span>',
    }),
  }
})

const issues: SqlLintIssue[] = [
  {
    code: 'parse-error',
    severity: 'error',
    message: 'Unexpected token',
    line: 1,
    column: 1,
  },
  {
    code: 'no-select-star',
    severity: 'warning',
    message: 'Avoid SELECT *',
    line: 2,
    column: 3,
  },
  {
    code: 'missing-semicolon',
    severity: 'info',
    message: 'Missing semicolon',
    line: 4,
    column: 20,
  },
]

describe('SqlLintResult', () => {
  it('shows a success alert when no issues exist', () => {
    const wrapper = mount(SqlLintResult, {
      props: {
        issues: [],
      },
    })

    expect(wrapper.find('.alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('No lint issues found.')
  })

  it('renders summary and table for existing issues', () => {
    const wrapper = mount(SqlLintResult, {
      props: {
        issues,
      },
    })

    expect(wrapper.find('.alert').exists()).toBe(false)
    expect(wrapper.text()).toContain('Summary')
    expect(wrapper.text()).toContain('Errors 1')
    expect(wrapper.text()).toContain('Warnings 1')
    expect(wrapper.text()).toContain('Info 1')
    expect(wrapper.find('.table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.findAll('.tag')).toHaveLength(3)
    expect(wrapper.text()).toContain('1:1')
    expect(wrapper.text()).toContain('2:3')
    expect(wrapper.text()).toContain('4:20')
  })
})
