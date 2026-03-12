import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { TextOrFileInput } from '@shared/ui/base'
import DotenvInputSection from './DotenvInputSection.vue'

describe('DotenvInputSection', () => {
  it('configures dotenv-specific file extensions and emits sample loading', async () => {
    const wrapper = mount(DotenvInputSection, {
      props: {
        value: '',
        'onUpdate:value': () => {},
        onLoadSample: () => {},
      },
    })

    expect(wrapper.findComponent(TextOrFileInput).props('accept')).toBe(
      '.env,.env.local,.env.development,.env.production,.env.test,.env.example,.txt,.conf',
    )
    expect(wrapper.text()).toContain('Runs locally in your browser')

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('load-sample')).toEqual([[]])
  })
})
