import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFloatingPanelContext } from './use-floating-panel-context.ts'

export interface FloatingPanelBodyBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelBodyProps extends HTMLProps<'div'>, FloatingPanelBodyBaseProps {}

export const FloatingPanelBody = component$<FloatingPanelBodyProps>((props) => {
  const api = useFloatingPanelContext()
  const bodyProps = api ? mergeProps(api.getBodyProps(), props) : props

  return (
    <ark.div {...bodyProps}>
      <Slot />
    </ark.div>
  )
})
