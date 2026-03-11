import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DotenvDiagnosticsSection from './DotenvDiagnosticsSection.vue'

describe('DotenvDiagnosticsSection', () => {
  it('renders empty, warning, and error diagnostics states', async () => {
    const empty = mount(DotenvDiagnosticsSection, {
      props: {
        diagnostics: [],
      },
    })

    expect(empty.text()).toContain('No issues found.')

    const populated = mount(DotenvDiagnosticsSection, {
      props: {
        diagnostics: [
          {
            line: 2,
            code: 'duplicate_key',
            severity: 'warning',
            message: 'Duplicate key "TOKEN".',
          },
          {
            line: 4,
            code: 'missing_equals',
            severity: 'error',
            message: 'Expected "=" in assignment.',
          },
        ],
      },
    })

    expect(populated.text()).toContain('Warning')
    expect(populated.text()).toContain('Error')
    expect(populated.text()).toContain('Line 2')
    expect(populated.text()).toContain('Line 4')
  })
})
