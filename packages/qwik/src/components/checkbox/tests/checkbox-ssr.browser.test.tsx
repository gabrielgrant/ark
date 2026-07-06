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
 * SKIPPED: vitest-browser-qwik's renderSSR cannot currently resume ANY
 * component in this setup — the qwikloader's segment fetches
 * (`<file>_<symbol>.js`) 404 on the vitest dev server, verified with a
 * trivial local `component$` (not zag-related; the URL even lacks the /@fs/
 * prefix). Re-enable once the harness serves SSR segment modules; until then
 * the wake path is exercised by the zag example app's Playwright e2e.
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
