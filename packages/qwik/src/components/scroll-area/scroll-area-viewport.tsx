import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useScrollAreaContext } from './use-scroll-area-context.ts'

export interface ScrollAreaViewportBaseProps extends PolymorphicProps<'div'> {}
export interface ScrollAreaViewportProps extends Assign<HTMLProps<'div'>, ScrollAreaViewportBaseProps> {}

export const ScrollAreaViewport = component$<ScrollAreaViewportProps>((props) => {
  const api = useScrollAreaContext()
  const viewportProps = api ? mergeProps(api.getViewportProps(), props) : props

  return (
    <ark.div {...viewportProps}>
      <Slot />
    </ark.div>
  )
})
