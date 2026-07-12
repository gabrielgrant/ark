import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useScrollAreaContext } from './use-scroll-area-context.ts'

export interface ScrollAreaCornerBaseProps extends PolymorphicProps<'div'> {}
export interface ScrollAreaCornerProps extends Assign<HTMLProps<'div'>, ScrollAreaCornerBaseProps> {}

export const ScrollAreaCorner = component$<ScrollAreaCornerProps>((props) => {
  const api = useScrollAreaContext()
  const cornerProps = api ? mergeProps(api.getCornerProps(), props) : props

  return (
    <ark.div {...cornerProps}>
      <Slot />
    </ark.div>
  )
})
