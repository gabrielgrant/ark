import { component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, ark } from '../factory.tsx'
import { type UseHighlightProps, useHighlight } from './use-highlight.ts'

export interface HighlightBaseProps extends UseHighlightProps {}
export interface HighlightProps extends Assign<HTMLProps<'mark'>, HighlightBaseProps> {}

export const Highlight = component$<HighlightProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  if (typeof record.text !== 'string') {
    throw new Error('[ark-ui/highlight] text must be a string')
  }

  const highlightPropKeys = ['query', 'text', 'ignoreCase', 'matchAll', 'exactMatch'] as const
  const ownKeySet = new Set<string>(highlightPropKeys)

  const highlightProps = {} as UseHighlightProps
  for (const key of highlightPropKeys) {
    if (key in record) (highlightProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const chunks = useHighlight(highlightProps)

  return (
    <>
      {chunks.map((chunk, index) =>
        chunk.match ? (
          <ark.mark key={index} {...rest}>
            {chunk.text}
          </ark.mark>
        ) : (
          chunk.text
        ),
      )}
    </>
  )
})
