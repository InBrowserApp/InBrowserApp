import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import RobotsTxtInputs from './RobotsTxtInputs.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

describe('RobotsTxtInputs', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
  })

  it('emits example, imported, cleared, and typed values', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => 'User-agent: *\nDisallow: /tmp/',
    })

    const wrapper = mount(RobotsTxtInputs, {
      props: {
        modelValue: '',
        exampleValue: 'User-agent: *',
        groupCount: 1,
        sitemapCount: 2,
        warningCount: 3,
        otherDirectiveCount: 4,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    await flushPromises()
    await buttons[2]!.trigger('click')
    await wrapper.find('textarea').setValue('User-agent: Bingbot')

    expect(wrapper.emitted('update:modelValue')).toEqual([
      ['User-agent: *'],
      ['User-agent: *\nDisallow: /tmp/'],
      [''],
      ['User-agent: Bingbot'],
    ])
  })

  it('ignores canceled file selection', async () => {
    fileOpenMock.mockRejectedValueOnce(new Error('canceled'))

    const wrapper = mount(RobotsTxtInputs, {
      props: {
        modelValue: 'User-agent: *',
        exampleValue: 'User-agent: *',
        groupCount: 0,
        sitemapCount: 0,
        warningCount: 0,
        otherDirectiveCount: 0,
      },
    })

    await wrapper.findAll('button')[1]!.trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
