import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CSPDiagnosticsSection from './CSPDiagnosticsSection.vue'

describe('CSPDiagnosticsSection', () => {
  it('renders the empty state when there are no diagnostics', () => {
    const wrapper = mount(CSPDiagnosticsSection, {
      props: {
        diagnostics: [],
      },
    })

    expect(wrapper.text()).toContain('No issues detected.')
  })

  it('groups diagnostics by severity', () => {
    const wrapper = mount(CSPDiagnosticsSection, {
      props: {
        diagnostics: [
          { code: 'a', severity: 'error', message: 'Broken header' },
          { code: 'b', severity: 'warning', message: 'Unsafe inline' },
          { code: 'c', severity: 'info', message: 'Report only mode' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Errors')
    expect(wrapper.text()).toContain('Broken header')
    expect(wrapper.text()).toContain('Warnings')
    expect(wrapper.text()).toContain('Unsafe inline')
    expect(wrapper.text()).toContain('Notes')
    expect(wrapper.text()).toContain('Report only mode')
  })
})
