import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFloatingPanelContext } from './use-floating-panel-context.ts'

export interface FloatingPanelTitleBaseProps extends PolymorphicProps<'h2'> {}
export interface FloatingPanelTitleProps extends HTMLProps<'h2'>, FloatingPanelTitleBaseProps {}

export const FloatingPanelTitle = component$<FloatingPanelTitleProps>((props) => {
  const api = useFloatingPanelContext()
  const titleProps = api ? mergeProps(api.getTitleProps(), props) : props

  return (
    <ark.h2 {...titleProps}>
      <Slot />
    </ark.h2>
  )
})
