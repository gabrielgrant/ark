import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCollapsibleContext } from './use-collapsible-context.ts'

export interface CollapsibleIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface CollapsibleIndicatorProps extends HTMLProps<'div'>, CollapsibleIndicatorBaseProps {}

export const CollapsibleIndicator = component$<CollapsibleIndicatorProps>((props) => {
  const api = useCollapsibleContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
