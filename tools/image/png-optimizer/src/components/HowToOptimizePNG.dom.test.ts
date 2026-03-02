import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HowToOptimizePNG from './HowToOptimizePNG.vue'

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

    expect(wrapper.text()).toContain('How We Optimize PNG Images')
    expect(wrapper.text()).toContain(
      'This tool uses Oxipng, a multithreaded lossless PNG/APNG compression optimizer written in Rust. It provides excellent compression performance while maintaining image quality. Key optimization features include: Optimization levels (0 to 6), where higher levels provide better compression but take longer. Alpha optimization improves compression for transparent images by altering fully transparent pixel colors. Interlacing option for progressive image loading. The optimization process is entirely client-side, ensuring your images never leave your device for maximum privacy.',
    )
  })
})
