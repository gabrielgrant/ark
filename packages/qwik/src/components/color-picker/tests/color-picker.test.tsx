import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { parseColor } from '../index.ts'
import { ComponentUnderTest } from './basic.tsx'

describe('ColorPicker', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.getAttribute('data-state')).toBe('closed')
    expect(content?.hasAttribute('hidden')).toBe(true)
  })

  it('renders open with area, sliders and swatches', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="content"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-part="area"]')).toBeTruthy()
    expect(document.querySelector('[data-part="area-thumb"]')).toBeTruthy()
    expect(document.querySelectorAll('[data-part="channel-slider"]').length).toBe(2)
    expect(document.querySelectorAll('[data-part="channel-slider-thumb"]').length).toBe(2)
    expect(document.querySelectorAll('[data-part="swatch-trigger"]').length).toBe(2)
  })

  it('reflects a Color class-instance defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={parseColor('#ff0000')} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="hex-input"]')?.getAttribute('value')).toBe('#FF0000')
    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toContain('rgba(255, 0, 0, 1)')
  })

  it('shows only the view matching the current format', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open defaultFormat="hsla" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="rgba-view"]')?.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector('[data-testid="hsla-view"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('reflects the disabled state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trigger"]')?.hasAttribute('disabled')).toBe(true)
    expect(document.querySelector('[data-testid="hex-input"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('wires the channel slider thumb with slider aria attributes', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    const hueThumb = document.querySelector('[data-testid="hue-slider-thumb"]')
    expect(hueThumb?.getAttribute('role')).toBe('slider')
    expect(hueThumb?.getAttribute('aria-valuemax')).toBe('360')
    expect(hueThumb?.hasAttribute('aria-valuenow')).toBe(true)
  })

  it('serializes QRL callback props through SSR without crashing', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest
        open
        defaultValue={parseColor('hsl(200, 50%, 50%)')}
        onValueChange$={$(() => {})}
        onOpenChange$={$(() => {})}
        onFormatChange$={$(() => {})}
      />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })

  it('syncs the hidden input with the value', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={parseColor('#00ff00')} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="hidden-input"]')?.getAttribute('value')).toBe('rgba(0, 255, 0, 1)')
  })
})
