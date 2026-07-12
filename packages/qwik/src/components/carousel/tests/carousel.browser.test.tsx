import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('next-trigger moves data-current/aria-hidden to the neighboring slide', async () => {
  const calls: Array<{ page: number }> = []
  const screen = await render(
    <ComponentUnderTest
      onPageChange$={$((details) => {
        calls.push({ page: details.page })
      })}
    />,
  )
  const root = screen.container as HTMLElement

  const currentIndicator = () => root.querySelector('[data-part="indicator"][data-current]')?.getAttribute('data-testid')

  await expect.poll(currentIndicator).toBe('indicator-0')

  await screen.getByTestId('next-trigger').click()
  await expect.poll(currentIndicator).toBe('indicator-1')
  await expect.poll(() => calls.at(-1)).toEqual({ page: 1 })

  await expect.poll(() => root.querySelector('[data-testid="item-1"]')?.hasAttribute('aria-hidden')).toBe(false)
  await expect.element(screen.getByTestId('item-0')).toHaveAttribute('aria-hidden', 'true')
})
