import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HttpStatusCodeDescription from './HttpStatusCodeDescription.vue'
import HttpStatusCodeDescription1xx from './HttpStatusCodeDescription1xx.vue'
import HttpStatusCodeDescription2xx from './HttpStatusCodeDescription2xx.vue'
import HttpStatusCodeDescription3xx from './HttpStatusCodeDescription3xx.vue'
import HttpStatusCodeDescription4xxA from './HttpStatusCodeDescription4xxA.vue'
import HttpStatusCodeDescription4xxB from './HttpStatusCodeDescription4xxB.vue'
import HttpStatusCodeDescription4xxC from './HttpStatusCodeDescription4xxC.vue'
import HttpStatusCodeDescription5xx from './HttpStatusCodeDescription5xx.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('HttpStatusCodeDescription', () => {
  it('selects the correct description component for code ranges', () => {
    const cases = [
      { code: 100, component: HttpStatusCodeDescription1xx },
      { code: 204, component: HttpStatusCodeDescription2xx },
      { code: 302, component: HttpStatusCodeDescription3xx },
      { code: 404, component: HttpStatusCodeDescription4xxA },
      { code: 410, component: HttpStatusCodeDescription4xxB },
      { code: 418, component: HttpStatusCodeDescription4xxC },
      { code: 500, component: HttpStatusCodeDescription5xx },
    ]

    for (const { code, component } of cases) {
      const wrapper = mount(HttpStatusCodeDescription, {
        props: { code },
      })

      expect(wrapper.findComponent(component).exists()).toBe(true)
      expect(wrapper.text()).toContain(`description.${code}`)
    }
  })
})
