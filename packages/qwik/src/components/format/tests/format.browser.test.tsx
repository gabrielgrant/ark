import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ByteUnderTest, NumberUnderTest } from './basic.tsx'

it('renders formatted number text after client resume', async () => {
  const screen = await render(<NumberUnderTest value={1234.5} />)
  await expect.element(screen.getByTestId('number')).toHaveTextContent('1,234.5')
})

it('renders formatted byte text after client resume', async () => {
  const screen = await render(<ByteUnderTest value={1500} />)
  await expect.element(screen.getByTestId('byte')).toHaveTextContent('1.5 kB')
})
