import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentHidden = (root: HTMLElement, id: string) =>
  root.querySelector(`[data-testid="content-${id}"]`)?.hasAttribute('hidden')

const expanded = (root: HTMLElement, id: string) =>
  root.querySelector(`[data-testid="trigger-${id}"]`)?.getAttribute('aria-expanded')

it('opens content on trigger click', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(contentHidden(root, 'features')).toBe(true)
  expect(expanded(root, 'features')).toBe('false')

  await screen.getByTestId('trigger-features').click()
  await expect.poll(() => contentHidden(root, 'features')).toBe(false)
  await expect.poll(() => expanded(root, 'features')).toBe('true')
})

it('switches content when a different trigger is clicked', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  await screen.getByTestId('trigger-features').click()
  await expect.poll(() => contentHidden(root, 'features')).toBe(false)

  await screen.getByTestId('trigger-docs').click()
  await expect.poll(() => contentHidden(root, 'docs')).toBe(false)
  await expect.poll(() => contentHidden(root, 'features')).toBe(true)
})

it('opens content on trigger hover', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(contentHidden(root, 'docs')).toBe(true)

  await screen.getByTestId('trigger-docs').hover()
  await expect.poll(() => contentHidden(root, 'docs'), { timeout: 3000 }).toBe(false)
})

it('renders link parts with the correct role and href', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  const link = root.querySelector('[data-testid="link-about"]')
  expect(link?.tagName.toLowerCase()).toBe('a')
  expect(link?.getAttribute('href')).toBe('#about')
})
