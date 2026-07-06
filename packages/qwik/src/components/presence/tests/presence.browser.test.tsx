import { component$, useSignal, useStyles$ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { Presence } from '../index.ts'

const Toggle = component$<{ lazyMount?: boolean; unmountOnExit?: boolean; animated?: boolean }>((props) => {
  const present = useSignal(false)
  if (props.animated) {
    useStyles$(`
      [data-scope="presence"][data-state="closed"] { animation: presence-fade 150ms forwards; }
      @keyframes presence-fade { from { opacity: 1 } to { opacity: 0 } }
    `)
  }
  return (
    <div>
      <button type="button" onClick$={() => (present.value = !present.value)}>
        Toggle
      </button>
      <Presence
        present={present.value}
        lazyMount={props.lazyMount}
        unmountOnExit={props.unmountOnExit}
        data-testid="presence"
      >
        Content
      </Presence>
    </div>
  )
})

it('mounts lazily and toggles hidden with presence state', async () => {
  const screen = await render(<Toggle lazyMount />)
  const query = () => (screen.container as HTMLElement).querySelector('[data-testid="presence"]')

  expect(query()).toBeNull()

  await screen.getByText('Toggle').click()
  await expect.poll(() => query()?.getAttribute('data-state')).toBe('open')
  expect(query()?.hasAttribute('hidden')).toBe(false)

  await screen.getByText('Toggle').click()
  await expect.poll(() => query()?.getAttribute('data-state')).toBe('closed')
})

it('keeps the node mounted during the exit animation, then unmounts', async () => {
  const screen = await render(<Toggle unmountOnExit animated />)
  const query = () => (screen.container as HTMLElement).querySelector('[data-testid="presence"]')

  await screen.getByText('Toggle').click()
  await expect.poll(() => query()?.getAttribute('data-state')).toBe('open')

  await screen.getByText('Toggle').click()
  // still mounted while the 150ms exit animation runs
  expect(query()).not.toBeNull()
  // unmounted after animationend reaches the presence machine
  await expect.poll(() => query(), { timeout: 3000 }).toBeNull()
})
