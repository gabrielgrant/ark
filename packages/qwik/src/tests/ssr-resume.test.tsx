/// <reference types="vite/client" />
import type { Component } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'

/**
 * Every value a component leaves in SSR state must deserialize when the client
 * resumes. A failure here means the component renders on the server but its
 * state (and so its machine) never wakes in the browser.
 *
 * The resume deserialization path is the same one the browser runs
 * (DomContainer.$getObjectById$), so this catches resume crashes headlessly.
 * See PLAN.md rule R21 for the failure mode it guards against.
 */
const fixtures = import.meta.glob<{ ComponentUnderTest?: Component }>('../components/*/tests/basic.tsx', {
  eager: true,
})

// fixtures that cannot render without props
const requiredProps: Record<string, Record<string, unknown>> = {
  highlight: { text: 'The quick brown fox', query: 'quick' },
}

const cases = Object.entries(fixtures)
  .filter(([, mod]) => mod.ComponentUnderTest)
  .map(([path, mod]) => [path.split('/')[2], mod.ComponentUnderTest as Component] as const)

describe('SSR state resumes', () => {
  it('finds component fixtures', () => {
    expect(cases.length).toBeGreaterThan(40)
  })

  it.each(cases)('%s', async (name, ComponentUnderTest) => {
    const { container, document } = await ssrRenderToDom(<ComponentUnderTest {...requiredProps[name]} />, {
      qwikLoader: true,
    })
    const state = document.querySelector('script[type="qwik/state"]')?.textContent
    const rootCount = state ? JSON.parse(state).length / 2 : 0

    const failures: string[] = []
    for (let id = 0; id < rootCount; id++) {
      try {
        container.$getObjectById$(id)
      } catch (error) {
        failures.push(`root ${id}: ${(error as Error).message}`)
      }
    }
    expect(failures).toEqual([])
  })
})
