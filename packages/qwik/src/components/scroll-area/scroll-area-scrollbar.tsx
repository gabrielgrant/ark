import type { ScrollbarProps } from '@zag-js/scroll-area'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useScrollAreaContext } from './use-scroll-area-context.ts'
import { ScrollAreaScrollbarProvider } from './use-scroll-area-scrollbar-context.ts'

const scrollbarPropKeys = ['orientation'] as const

const ownKeySet = new Set<string>(scrollbarPropKeys)

export interface ScrollAreaScrollbarBaseProps extends ScrollbarProps, PolymorphicProps<'div'> {}
export interface ScrollAreaScrollbarProps extends Assign<HTMLProps<'div'>, ScrollAreaScrollbarBaseProps> {}

export const ScrollAreaScrollbar = component$<ScrollAreaScrollbarProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const scrollbarProps = {} as ScrollbarProps
  for (const key of scrollbarPropKeys) {
    if (key in record) (scrollbarProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useScrollAreaContext()

  ScrollAreaScrollbarProvider(scrollbarProps)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const scrollbarDivProps = api ? mergeProps(api.getScrollbarProps(scrollbarProps), rest) : rest

  return (
    <ark.div {...scrollbarDivProps}>
      <Slot />
    </ark.div>
  )
})
