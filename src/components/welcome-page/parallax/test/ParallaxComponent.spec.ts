import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ParallaxComponent from './../ParallaxComponent.vue'
import { i18n } from '@/i18n'

describe('ParallaxComponent', () => {
  test('renders message', () => {
    const wrapper = mount(ParallaxComponent, {
        global: {
            plugins: [i18n]
        }
    })
    expect(wrapper.html()).toBeDefined()
  })
})