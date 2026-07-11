import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (root: HTMLElement) => root.querySelector('[data-testid="content"]')?.getAttribute('data-state')

it('opens on trigger click, shows the level-2 list after clicking a level-1 item, and selects a leaf', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(contentState(root)).toBe('closed')

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(root)).toBe('open')

  expect(root.querySelector('[data-testid="item-india"]')).toBeFalsy()

  await screen.getByTestId('item-asia').click()
  await expect.element(screen.getByTestId('item-india')).toBeVisible()
  await expect.element(screen.getByTestId('item-japan')).toBeVisible()

  await screen.getByTestId('item-india').click()
  await expect.poll(() => contentState(root)).toBe('closed')

  const valueText = root.querySelector('[data-testid="value-text"]')
  await expect.poll(() => valueText?.textContent).toBe('Asia / India')
})

it('closes on escape', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(root)).toBe('open')

  await userEvent.keyboard('{Escape}')
  await expect.poll(() => contentState(root)).toBe('closed')
})

it('invokes the onValueChange$ QRL on leaf selection', async () => {
  const calls: Array<{ value: string[][] }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push({ value: details.value })
      })}
    />,
  )

  await screen.getByTestId('trigger').click()
  await screen.getByTestId('item-europe').click()
  await expect.element(screen.getByTestId('item-france')).toBeVisible()
  await screen.getByTestId('item-france').click()

  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ value: [['europe', 'france']] })
})
