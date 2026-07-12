import type { StageTriggerProps } from '@zag-js/floating-panel'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFloatingPanelContext } from './use-floating-panel-context.ts'

export interface FloatingPanelStageTriggerBaseProps extends StageTriggerProps, PolymorphicProps<'button'> {}
export interface FloatingPanelStageTriggerProps
  extends Assign<HTMLProps<'button'>, FloatingPanelStageTriggerBaseProps> {}

export const FloatingPanelStageTrigger = component$<FloatingPanelStageTriggerProps>((props) => {
  const { stage, ...localProps } = props
  const api = useFloatingPanelContext()

  const rest = localProps as unknown as Record<string, unknown>
  const stageTriggerProps = api ? mergeProps(api.getStageTriggerProps({ stage }), rest) : rest

  return (
    <ark.button {...stageTriggerProps}>
      <Slot />
    </ark.button>
  )
})
