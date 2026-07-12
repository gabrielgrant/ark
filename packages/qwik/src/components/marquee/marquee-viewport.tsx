import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMarqueeContext } from './use-marquee-context.ts'

export interface MarqueeViewportBaseProps extends PolymorphicProps<'div'> {}
export interface MarqueeViewportProps extends Assign<HTMLProps<'div'>, MarqueeViewportBaseProps> {}

export const MarqueeViewport = component$<MarqueeViewportProps>((props) => {
  const api = useMarqueeContext()
  const viewportProps = api ? mergeProps(api.getViewportProps(), props) : props

  return (
    <ark.div {...viewportProps}>
      <Slot />
    </ark.div>
  )
})
