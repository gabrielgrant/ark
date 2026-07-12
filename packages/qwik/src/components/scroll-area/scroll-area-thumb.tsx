import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useScrollAreaContext } from './use-scroll-area-context.ts'
import { useScrollAreaScrollbarContext } from './use-scroll-area-scrollbar-context.ts'

export interface ScrollAreaThumbBaseProps extends PolymorphicProps<'div'> {}
export interface ScrollAreaThumbProps extends Assign<HTMLProps<'div'>, ScrollAreaThumbBaseProps> {}

export const ScrollAreaThumb = component$<ScrollAreaThumbProps>((props) => {
  const api = useScrollAreaContext()
  const scrollbarProps = useScrollAreaScrollbarContext()
  const thumbProps = api ? mergeProps(api.getThumbProps(scrollbarProps), props) : props

  return (
    <ark.div {...thumbProps}>
      <Slot />
    </ark.div>
  )
})
