import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Highlight', () => {
  it('wraps the matched query in a mark element', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest text="The quick brown fox" query="quick" />, {
      qwikLoader: true,
    })

    const root = document.querySelector('[data-testid="root"]')
    expect(root?.textContent).toBe('The quick brown fox')

    const mark = root?.querySelector('mark')
    expect(mark?.textContent).toBe('quick')
  })

  it('leaves the text unmarked when there is no match', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest text="The quick brown fox" query="slow" />, {
      qwikLoader: true,
    })

    const root = document.querySelector('[data-testid="root"]')
    expect(root?.textContent).toBe('The quick brown fox')
    expect(root?.querySelector('mark')).toBeFalsy()
  })

  it('highlights every match when matchAll is set', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest text="cat bat cat mat cat" query="cat" matchAll />,
      { qwikLoader: true },
    )

    const marks = document.querySelectorAll('[data-testid="root"] mark')
    expect(marks.length).toBe(3)
  })

  it('is case-insensitive when ignoreCase is set', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest text="Hello World" query="world" ignoreCase />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="root"] mark')?.textContent).toBe('World')
  })

  it('highlights multiple distinct queries', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest text="The quick brown fox jumps" query={['quick', 'fox']} matchAll />,
      { qwikLoader: true },
    )

    const marks = Array.from(document.querySelectorAll('[data-testid="root"] mark')).map((el) => el.textContent)
    expect(marks).toEqual(['quick', 'fox'])
  })

  it('forwards extra props onto the mark element', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest text="The quick brown fox" query="quick" class="highlighted" />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-testid="root"] mark')?.className).toBe('highlighted')
  })

  it('throws when text is not a string', async () => {
    // @ts-expect-error -- intentionally invalid input for the runtime guard
    await expect(ssrRenderToDom(<ComponentUnderTest text={undefined} query="quick" />, { qwikLoader: true })).rejects.toThrow(
      '[ark-ui/highlight] text must be a string',
    )
  })
})
