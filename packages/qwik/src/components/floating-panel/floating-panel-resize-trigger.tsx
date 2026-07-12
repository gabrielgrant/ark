import type { ResizeTriggerProps } from '@zag-js/floating-panel'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFloatingPanelContext } from './use-floating-panel-context.ts'

export interface FloatingPanelResizeTriggerBaseProps extends ResizeTriggerProps, PolymorphicProps<'div'> {}
export interface FloatingPanelResizeTriggerProps
  extends Assign<HTMLProps<'div'>, FloatingPanelResizeTriggerBaseProps> {}

export const FloatingPanelResizeTrigger = component$<FloatingPanelResizeTriggerProps>((props) => {
  const { axis, ...localProps } = props
  const api = useFloatingPanelContext()

  const rest = localProps as unknown as Record<string, unknown>
  const resizeTriggerProps = api ? mergeProps(api.getResizeTriggerProps({ axis }), rest) : rest

  return (
    <ark.div {...resizeTriggerProps}>
      <Slot />
    </ark.div>
  )
})
