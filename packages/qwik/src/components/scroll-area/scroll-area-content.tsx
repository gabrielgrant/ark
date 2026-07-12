import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useScrollAreaContext } from './use-scroll-area-context.ts'

export interface ScrollAreaContentBaseProps extends PolymorphicProps<'div'> {}
export interface ScrollAreaContentProps extends Assign<HTMLProps<'div'>, ScrollAreaContentBaseProps> {}

export const ScrollAreaContent = component$<ScrollAreaContentProps>((props) => {
  const api = useScrollAreaContext()
  const contentProps = api ? mergeProps(api.getContentProps(), props) : props

  return (
    <ark.div {...contentProps}>
      <Slot />
    </ark.div>
  )
})
