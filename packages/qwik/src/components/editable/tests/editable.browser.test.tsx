import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('edits and submits a value via the edit trigger and Enter key', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="Gabriel" />)

  await screen.getByTestId('edit-trigger').click()
  await expect.element(screen.getByTestId('input')).toBeVisible()

  await screen.getByTestId('input').fill('Ada')
  await userEvent.keyboard('{Enter}')

  await expect.element(screen.getByTestId('preview')).toHaveTextContent('Ada')
  await expect.element(screen.getByTestId('preview')).toBeVisible()
})

it('activates edit mode when the preview is focused (default activationMode)', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="Gabriel" />)

  await screen.getByTestId('preview').click()

  await expect.element(screen.getByTestId('input')).toBeVisible()
  await expect.element(screen.getByTestId('preview')).not.toBeVisible()
})

it('cancels an edit and reverts the value', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="Gabriel" />)

  await screen.getByTestId('edit-trigger').click()
  await expect.element(screen.getByTestId('input')).toBeVisible()

  await screen.getByTestId('input').fill('Someone Else')
  await screen.getByTestId('cancel-trigger').click()

  await expect.element(screen.getByTestId('preview')).toHaveTextContent('Gabriel')
})

it('invokes the onValueChange$ QRL as the user types', async () => {
  const calls: Array<{ value: string }> = []
  const screen = await render(
    <ComponentUnderTest
      defaultValue="Gabriel"
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByTestId('edit-trigger').click()
  await screen.getByTestId('input').fill('Ada')

  await expect.poll(() => calls.length).toBeGreaterThan(0)
  expect(calls.at(-1)?.value).toBe('Ada')
})
