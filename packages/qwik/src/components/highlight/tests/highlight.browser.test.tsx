import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('renders the highlighted markup after client resume', async () => {
  const screen = await render(<ComponentUnderTest text="The quick brown fox" query="quick" />)

  await expect.element(screen.getByTestId('root')).toHaveTextContent('The quick brown fox')
  const mark = screen.container.querySelector('mark')
  expect(mark?.textContent).toBe('quick')
})
