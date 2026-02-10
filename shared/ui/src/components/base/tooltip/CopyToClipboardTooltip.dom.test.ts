import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CopyToClipboardTooltip from './CopyToClipboardTooltip.vue'

const copySpy = vi.fn()

vi.mock('../../../composables/base/clipboard/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({
    copy: copySpy,
  }),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')

  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NTooltip: defineComponent({
      name: 'NTooltip',
      template:
        '<div class="tooltip"><div class="trigger"><slot name="trigger" /></div><div class="content"><slot /></div></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="icon"><slot /></span>',
    }),
  }
})

describe('CopyToClipboardTooltip', () => {
  beforeEach(() => {
    copySpy.mockReset()
  })

  it('renders tooltip text and exposes copy to the trigger slot', async () => {
    const wrapper = mount(CopyToClipboardTooltip, {
      props: {
        content: 'value',
      },
      slots: {
        default: ({ copy }: { copy: () => void }) =>
          h(
            defineComponent({
              render() {
                return h('button', { class: 'copy-btn', onClick: copy }, 'copy')
              },
            }),
          ),
      },
    })

    expect(wrapper.text()).toContain('tooltip')

    await wrapper.get('button.copy-btn').trigger('click')
    expect(copySpy).toHaveBeenCalledTimes(1)
  })
})
