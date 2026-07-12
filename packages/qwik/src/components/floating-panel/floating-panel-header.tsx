import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFloatingPanelContext } from './use-floating-panel-context.ts'

export interface FloatingPanelHeaderBaseProps extends PolymorphicProps<'div'> {}
export interface FloatingPanelHeaderProps extends HTMLProps<'div'>, FloatingPanelHeaderBaseProps {}

export const FloatingPanelHeader = component$<FloatingPanelHeaderProps>((props) => {
  const api = useFloatingPanelContext()
  const headerProps = api ? mergeProps(api.getHeaderProps(), props) : props

  return (
    <ark.div {...headerProps}>
      <Slot />
    </ark.div>
  )
})
