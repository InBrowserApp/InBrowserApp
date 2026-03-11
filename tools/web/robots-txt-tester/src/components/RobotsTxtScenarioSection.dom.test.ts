import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RobotsTxtScenarioSection from './RobotsTxtScenarioSection.vue'

describe('RobotsTxtScenarioSection', () => {
  it('emits crawler presets and manual updates', async () => {
    const wrapper = mount(RobotsTxtScenarioSection, {
      props: {
        userAgent: 'Googlebot',
        target: '/private/public/report.html',
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    await buttons[2]!.trigger('click')
    await buttons[3]!.trigger('click')

    const inputs = wrapper.findAll('input')
    await inputs[0]!.setValue('AdsBot-Google')
    await inputs[1]!.setValue('/private/index.html')

    expect(wrapper.emitted('update:userAgent')).toEqual([
      ['*'],
      ['Googlebot'],
      ['Bingbot'],
      ['Applebot'],
      ['AdsBot-Google'],
    ])
    expect(wrapper.emitted('update:target')).toEqual([['/private/index.html']])
  })
})
