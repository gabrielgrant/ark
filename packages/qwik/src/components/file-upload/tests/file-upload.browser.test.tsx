import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Trigger-click file dialogs cannot work headless (no OS-level file picker in
 * Chromium under test), so -- like solid/react's own approach of calling
 * `setFiles` directly -- files are set programmatically. Here that means
 * assigning a `DataTransfer`'s file list to the hidden `<input type="file">`
 * and dispatching a real `input` event, which is exactly what the zag
 * machine's `getHiddenInputProps().onInput` listens for.
 */
it('setting files on the hidden input renders an accepted-file item', async () => {
  const calls: Array<{ acceptedCount: number }> = []
  const screen = await render(
    <ComponentUnderTest
      onFileChange$={$((details) => {
        calls.push({ acceptedCount: details.acceptedFiles.length })
      })}
    />,
  )

  const input = screen.getByTestId('hidden-input').element() as HTMLInputElement
  const file = new File(['hello world'], 'test.jpg', { type: 'image/jpg' })
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)
  input.files = dataTransfer.files
  input.dispatchEvent(new Event('input', { bubbles: true }))

  await expect.element(screen.getByTestId('item-test.jpg')).toBeInTheDocument()
  await expect.element(screen.getByTestId('item-name-test.jpg')).toHaveTextContent('test.jpg')
  await expect.poll(() => calls.at(-1)).toEqual({ acceptedCount: 1 })

  await screen.getByTestId('item-delete-test.jpg').click()
  await expect.element(screen.getByTestId('item-test.jpg')).not.toBeInTheDocument()
})
