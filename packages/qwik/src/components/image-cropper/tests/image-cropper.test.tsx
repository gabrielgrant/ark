import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('ImageCropper', () => {
  it('renders the viewport, image, and selection', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="viewport"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="image"]')?.getAttribute('src')).toContain('data:image/png')
    expect(document.querySelector('[data-testid="selection"]')).toBeTruthy()
  })

  it('renders a handle for every position', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    for (const position of ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']) {
      const handle = document.querySelector(`[data-testid="handle-${position}"]`)
      expect(handle?.getAttribute('data-position')).toBe(position)
      expect(handle?.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('reflects axis on each grid line', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="grid-horizontal"]')?.getAttribute('data-axis')).toBe('horizontal')
    expect(document.querySelector('[data-testid="grid-vertical"]')?.getAttribute('data-axis')).toBe('vertical')
  })

  it('defaults the crop shape to rectangle and reflects a circle override', async () => {
    const { document: rectDoc } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })
    expect(rectDoc.querySelector('[data-testid="root"]')?.getAttribute('data-shape')).toBe('rectangle')

    const { document: circleDoc } = await ssrRenderToDom(<ComponentUnderTest cropShape="circle" />, {
      qwikLoader: true,
    })
    expect(circleDoc.querySelector('[data-testid="root"]')?.getAttribute('data-shape')).toBe('circle')
  })

  it('marks the selection as a slider with min/max/now aria attributes', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const selection = document.querySelector('[data-testid="selection"]')
    expect(selection?.getAttribute('role')).toBe('slider')
    expect(selection?.getAttribute('aria-valuemin')).toBe('0')
    expect(selection?.hasAttribute('aria-valuenow')).toBe(true)
  })

  it('disables the viewport and selection tabIndex when fixedCropArea is set', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest fixedCropArea />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="viewport"]')?.hasAttribute('data-disabled')).toBe(true)
    expect(document.querySelector('[data-testid="selection"]')?.hasAttribute('tabindex')).toBe(false)
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest
        onCropChange$={$(() => {})}
        onZoomChange$={$(() => {})}
        onRotationChange$={$(() => {})}
        onFlipChange$={$(() => {})}
      />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
  })
})
