import { $ } from '@qwik.dev/core'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

let dispatchSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  // `downloadFile` (`@zag-js/file-utils`) appends a real `<a download>` and
  // triggers it via `anchor.dispatchEvent(new MouseEvent('click'))` -- NOT
  // `anchor.click()` -- so spying on `dispatchEvent` (rather than letting
  // Chromium actually save a file to disk) is what actually observes it;
  // it also keeps the test deterministic and avoids depending on
  // Playwright's download handling infra.
  dispatchSpy = vi.spyOn(HTMLAnchorElement.prototype, 'dispatchEvent').mockImplementation(() => true)
})

afterEach(() => {
  dispatchSpy.mockRestore()
})

it('clicking the trigger downloads the given data as the named file', async () => {
  const screen = await render(<ComponentUnderTest fileName="hello.txt" mimeType="text/plain" data="hello world" />)

  await screen.getByTestId('trigger').click()

  await expect.poll(() => dispatchSpy.mock.instances.length).toBe(1)
  const anchor = dispatchSpy.mock.instances[0] as unknown as HTMLAnchorElement
  expect(anchor.download).toBe('hello.txt')
  expect(anchor.href).toContain('blob:')
})

it('resolves data$ (QRL) before downloading', async () => {
  const screen = await render(
    <ComponentUnderTest
      fileName="from-qrl.txt"
      mimeType="text/plain"
      data={undefined}
      data$={$(() => 'from a QRL')}
    />,
  )

  await screen.getByTestId('trigger').click()

  await expect.poll(() => dispatchSpy.mock.instances.length).toBe(1)
  const anchor = dispatchSpy.mock.instances[0] as unknown as HTMLAnchorElement
  expect(anchor.download).toBe('from-qrl.txt')
})

it('does not download when onClick$ calls preventDefault', async () => {
  const screen = await render(
    <ComponentUnderTest
      onClick$={$((event: Event) => {
        event.preventDefault()
      })}
    />,
  )

  await screen.getByTestId('trigger').click()

  await new Promise((resolve) => setTimeout(resolve, 100))
  expect(dispatchSpy.mock.instances.length).toBe(0)
})
