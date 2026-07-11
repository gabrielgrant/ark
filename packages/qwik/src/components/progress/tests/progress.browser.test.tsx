import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('renders the linear parts and reflects the value', async () => {
  const screen = await render(<ComponentUnderTest defaultValue={30} />)

  await expect.element(screen.getByTestId('root')).toHaveAttribute('data-state', 'loading')
  await expect.element(screen.getByTestId('value-text')).toHaveTextContent('30%')
  await expect.element(screen.getByTestId('range')).toHaveAttribute('data-part', 'range')
})

it('reflects the indeterminate state when value is null', async () => {
  const screen = await render(<ComponentUnderTest value={null} />)

  await expect.element(screen.getByTestId('root')).toHaveAttribute('data-state', 'indeterminate')
})
