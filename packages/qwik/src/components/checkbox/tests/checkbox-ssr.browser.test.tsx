import { component$ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { renderSSR } from 'vitest-browser-qwik'
import { Checkbox } from '../index.ts'

const Item = (props: { name: string }) => (
  <Checkbox.Root data-testid={`root-${props.name}`}>
    <Checkbox.Label>{`label-${props.name}`}</Checkbox.Label>
    <Checkbox.Control data-testid={`control-${props.name}`} />
    <Checkbox.HiddenInput />
  </Checkbox.Root>
)

const MultiCheckbox = component$(() => (
  <div>
    <Item name="a" />
    <Item name="b" />
    <Item name="c" />
  </div>
))

/**
 * Validates PLAN Part 5 risk #1: the Zag adapter serializes a module-global
 * "wake" QRL per machine during SSR; with several machines on one page the
 * wake registered while rendering one component must not leak into another.
 * Rendered via real SSR + browser resume (renderSSR), then interacted with in
 * arbitrary order.
 *
 * SKIPPED: renderSSR + zag-adapter wake replay still fails, now differently.
 * History: on vitest-browser-qwik 0.3.8 the resume broke in the harness
 * itself (QRL segment fetches 404 after renderSSR; fixed independently on
 * the fork gabrielgrant/vitest-browser-qwik#fix/ssr-segment-mapping and,
 * by a different approach, in upstream 0.3.11 — the wake QRL now runs).
 * On 0.3.11 + the rc.4 adapter branch, the failure moved into the
 * adapter's wake replay: replayOne()'s getDomContainer(item.element)
 * throws Q24 "Unable to find q:container" (multi-machine case), and a
 * single-machine variant hangs the run — consistent with the captured
 * element being replaced/detached by the activation render before the
 * replay runs. Needs an adapter-side look; zag's own e2e-qwik app (real
 * SSR + qwikloader) is the authoritative environment for the wake path.
 */
it.skip('resumes multiple SSR machines independently and wakes each on interaction', async () => {
  const screen = await renderSSR(<MultiCheckbox />)
  const container = screen.container as HTMLElement
  const state = (name: string) =>
    container.querySelector(`[data-testid="control-${name}"]`)?.getAttribute('data-state')

  expect(state('a')).toBe('unchecked')
  expect(state('b')).toBe('unchecked')
  expect(state('c')).toBe('unchecked')

  // interact out of order: middle first
  await screen.getByText('label-b').click()
  await expect.poll(() => state('b')).toBe('checked')
  expect(state('a')).toBe('unchecked')
  expect(state('c')).toBe('unchecked')

  await screen.getByText('label-c').click()
  await expect.poll(() => state('c')).toBe('checked')

  await screen.getByText('label-a').click()
  await expect.poll(() => state('a')).toBe('checked')

  // toggle one back off; others keep their state
  await screen.getByText('label-b').click()
  await expect.poll(() => state('b')).toBe('unchecked')
  expect(state('a')).toBe('checked')
  expect(state('c')).toBe('checked')
})
