import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('ClientOnly', () => {
  it('renders nothing live during SSR when no fallback is given', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    // The projected content is present only as a dormant `<q:template>`
    // projection marker (Qwik's resumability payload for the un-awoken
    // Slot) -- it is not part of the "live" (non-template) render output.
    // See R11 in PLAN.md: an unclaimed/conditionally-claimed `<Slot/>`
    // leaves exactly this marker.
    const clientContent = document.querySelector('[data-testid="client-content"]')
    expect(clientContent?.closest('q\\:template')).toBeTruthy()
  })

  it('renders the fallback live (outside any template marker) during SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest fallback={<div data-testid="fallback">Loading</div>} />,
      { qwikLoader: true },
    )

    const fallback = document.querySelector('[data-testid="fallback"]')
    expect(fallback?.textContent).toBe('Loading')
    expect(fallback?.closest('q\\:template')).toBeFalsy()

    const clientContent = document.querySelector('[data-testid="client-content"]')
    expect(clientContent?.closest('q\\:template')).toBeTruthy()
  })
})
