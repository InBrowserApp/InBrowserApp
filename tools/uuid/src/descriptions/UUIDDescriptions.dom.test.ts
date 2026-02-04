import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsMaxUUID from './WhatIsMaxUUID.vue'
import WhatIsNilUUID from './WhatIsNilUUID.vue'
import WhatIsULID from './WhatIsULID.vue'
import WhatIsUUID from './WhatIsUUID.vue'
import WhatIsUUIDv1 from './WhatIsUUIDv1.vue'
import WhatIsUUIDv3 from './WhatIsUUIDv3.vue'
import WhatIsUUIDv4 from './WhatIsUUIDv4.vue'
import WhatIsUUIDv5 from './WhatIsUUIDv5.vue'
import WhatIsUUIDv6 from './WhatIsUUIDv6.vue'
import WhatIsUUIDv7 from './WhatIsUUIDv7.vue'

const cases = [
  {
    name: 'WhatIsUUID',
    component: WhatIsUUID,
    title: 'What is UUID?',
    snippet: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  },
  {
    name: 'WhatIsUUIDv1',
    component: WhatIsUUIDv1,
    title: 'What is UUID v1?',
    snippet: 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx',
  },
  {
    name: 'WhatIsUUIDv3',
    component: WhatIsUUIDv3,
    title: 'What is UUID v3?',
    snippet: '9073926b-929f-31c2-abc9-fad77ae3e8eb',
  },
  {
    name: 'WhatIsUUIDv4',
    component: WhatIsUUIDv4,
    title: 'What is UUID v4?',
    snippet: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
  },
  {
    name: 'WhatIsUUIDv5',
    component: WhatIsUUIDv5,
    title: 'What is UUID v5?',
    snippet: 'cfbff0d1-9375-5685-968c-48ce8b15ae17',
  },
  {
    name: 'WhatIsUUIDv6',
    component: WhatIsUUIDv6,
    title: 'What is UUID v6?',
    snippet: 'xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx',
  },
  {
    name: 'WhatIsUUIDv7',
    component: WhatIsUUIDv7,
    title: 'What is UUID v7?',
    snippet: 'xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx',
  },
  {
    name: 'WhatIsNilUUID',
    component: WhatIsNilUUID,
    title: 'What is Nil UUID?',
    snippet: '00000000-0000-0000-0000-000000000000',
  },
  {
    name: 'WhatIsMaxUUID',
    component: WhatIsMaxUUID,
    title: 'What is Max UUID?',
    snippet: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
  },
  {
    name: 'WhatIsULID',
    component: WhatIsULID,
    title: 'What is ULID?',
    snippet: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
  },
]

describe('UUID description blocks', () => {
  cases.forEach(({ name, component, title, snippet }) => {
    it(`renders ${name}`, () => {
      const wrapper = mount(component)

      expect(wrapper.text()).toContain(title)
      expect(wrapper.text()).toContain(snippet)
    })
  })
})
