import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Interaction tests — real browser via vitest-browser-qwik (see
 * vitest.browser.config.ts).
 */
it('advances the current step when the next trigger is clicked', async () => {
  const screen = await render(<ComponentUnderTest />)

  await expect.element(screen.getByTestId('trigger-0')).toHaveAttribute('data-current', '')
  await expect.element(screen.getByTestId('content-0')).not.toHaveAttribute('hidden')

  await screen.getByTestId('next-trigger').click()

  await expect.element(screen.getByTestId('trigger-1')).toHaveAttribute('data-current', '')
  await expect.element(screen.getByTestId('content-1')).not.toHaveAttribute('hidden')
  await expect.element(screen.getByTestId('trigger-0')).toHaveAttribute('data-complete', '')
})

it('moves back to the previous step when the prev trigger is clicked', async () => {
  const screen = await render(<ComponentUnderTest defaultStep={1} />)

  await expect.element(screen.getByTestId('trigger-1')).toHaveAttribute('data-current', '')

  await screen.getByTestId('prev-trigger').click()

  await expect.element(screen.getByTestId('trigger-0')).toHaveAttribute('data-current', '')
  await expect.element(screen.getByTestId('content-0')).not.toHaveAttribute('hidden')
})

it('reaches the completed content after advancing past the last step', async () => {
  const screen = await render(<ComponentUnderTest defaultStep={2} />)

  await expect.element(screen.getByTestId('completed-content')).toHaveAttribute('hidden')

  await screen.getByTestId('next-trigger').click()

  await expect.element(screen.getByTestId('completed-content')).not.toHaveAttribute('hidden')
})

it('invokes the onStepChange$ QRL when the next trigger is clicked', async () => {
  const calls: Array<{ step: number }> = []
  const screen = await render(
    <ComponentUnderTest
      onStepChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByTestId('next-trigger').click()

  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ step: 1 })
})
