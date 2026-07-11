import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { parts } from './segment-group.anatomy.ts'
import { useSegmentGroupContext } from './use-segment-group-context.ts'
import { useSegmentGroupItemPropsContext } from './use-segment-group-item-props-context.ts'

export interface SegmentGroupItemControlBaseProps extends PolymorphicProps<'div'> {}
export interface SegmentGroupItemControlProps extends HTMLProps<'div'>, SegmentGroupItemControlBaseProps {}

export const SegmentGroupItemControl = component$<SegmentGroupItemControlProps>((props) => {
  const api = useSegmentGroupContext()
  const itemProps = useSegmentGroupItemPropsContext()
  const controlProps = api ? mergeProps(api.getItemControlProps(itemProps), parts.itemControl.attrs as Record<string, string>, props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
