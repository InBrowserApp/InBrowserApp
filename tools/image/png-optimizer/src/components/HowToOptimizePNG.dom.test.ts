import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowToOptimizePNG from './HowToOptimizePNG.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('HowToOptimizePNG', () => {
  it('renders guidance content', () => {
    const wrapper = mount(HowToOptimizePNG, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
  })
})
