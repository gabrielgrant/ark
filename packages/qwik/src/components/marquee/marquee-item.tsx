import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMarqueeContext } from './use-marquee-context.ts'

export interface MarqueeItemBaseProps extends PolymorphicProps<'div'> {}
export interface MarqueeItemProps extends Assign<HTMLProps<'div'>, MarqueeItemBaseProps> {}

export const MarqueeItem = component$<MarqueeItemProps>((props) => {
  const api = useMarqueeContext()
  const itemProps = api ? mergeProps(api.getItemProps(), props) : props

  return (
    <ark.div {...itemProps}>
      <Slot />
    </ark.div>
  )
})
