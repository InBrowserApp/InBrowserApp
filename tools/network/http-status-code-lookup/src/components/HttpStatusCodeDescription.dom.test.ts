import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HttpStatusCodeDescription from './HttpStatusCodeDescription.vue'
import HttpStatusCodeDescription1xx from './HttpStatusCodeDescription1xx.vue'
import HttpStatusCodeDescription2xx from './HttpStatusCodeDescription2xx.vue'
import HttpStatusCodeDescription3xx from './HttpStatusCodeDescription3xx.vue'
import HttpStatusCodeDescription4xxA from './HttpStatusCodeDescription4xxA.vue'
import HttpStatusCodeDescription4xxB from './HttpStatusCodeDescription4xxB.vue'
import HttpStatusCodeDescription4xxC from './HttpStatusCodeDescription4xxC.vue'
import HttpStatusCodeDescription5xx from './HttpStatusCodeDescription5xx.vue'

describe('HttpStatusCodeDescription', () => {
  it('selects the correct description component for code ranges', () => {
    const cases = [
      {
        code: 100,
        component: HttpStatusCodeDescription1xx,
        messageSnippet: 'request headers and the client should proceed',
      },
      {
        code: 204,
        component: HttpStatusCodeDescription2xx,
        messageSnippet: 'is not returning any content',
      },
      {
        code: 302,
        component: HttpStatusCodeDescription3xx,
        messageSnippet: 'changed temporarily',
      },
      {
        code: 404,
        component: HttpStatusCodeDescription4xxA,
        messageSnippet: 'resource could not be found',
      },
      {
        code: 410,
        component: HttpStatusCodeDescription4xxB,
        messageSnippet: 'no longer available',
      },
      {
        code: 418,
        component: HttpStatusCodeDescription4xxC,
        messageSnippet: 'IETF April Fools jokes',
      },
      {
        code: 500,
        component: HttpStatusCodeDescription5xx,
        messageSnippet: 'unexpected condition was encountered',
      },
    ]

    for (const { code, component, messageSnippet } of cases) {
      const wrapper = mount(HttpStatusCodeDescription, {
        props: { code },
      })

      expect(wrapper.findComponent(component).exists()).toBe(true)
      expect(wrapper.text()).toContain(messageSnippet)
      expect(wrapper.text()).not.toContain(`description.${code}`)
    }
  })
})
