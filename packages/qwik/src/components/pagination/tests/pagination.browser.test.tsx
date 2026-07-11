import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('next-trigger and prev-trigger move aria-current to the neighboring page item', async () => {
  const calls: Array<{ page: number }> = []
  const screen = await render(
    <ComponentUnderTest
      count={100}
      pageSize={10}
      onPageChange$={$((details) => {
        calls.push({ page: details.page })
      })}
    />,
  )
  const root = screen.container as HTMLElement

  const currentPage = () => root.querySelector('[aria-current="page"]')?.getAttribute('data-testid')

  await expect.poll(currentPage).toBe('item-1')

  await screen.getByTestId('next-trigger').click()
  await expect.poll(currentPage).toBe('item-2')
  await expect.poll(() => calls.at(-1)).toEqual({ page: 2 })

  await screen.getByTestId('prev-trigger').click()
  await expect.poll(currentPage).toBe('item-1')
  await expect.poll(() => calls.at(-1)).toEqual({ page: 1 })
})
