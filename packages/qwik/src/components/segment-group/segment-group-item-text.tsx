import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { parts } from './segment-group.anatomy.ts'
import { useSegmentGroupContext } from './use-segment-group-context.ts'
import { useSegmentGroupItemPropsContext } from './use-segment-group-item-props-context.ts'

export interface SegmentGroupItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface SegmentGroupItemTextProps extends HTMLProps<'span'>, SegmentGroupItemTextBaseProps {}

export const SegmentGroupItemText = component$<SegmentGroupItemTextProps>((props) => {
  const api = useSegmentGroupContext()
  const itemProps = useSegmentGroupItemPropsContext()
  const textProps = api ? mergeProps(api.getItemTextProps(itemProps), parts.itemText.attrs as Record<string, string>, props) : props

  return (
    <ark.span {...textProps}>
      <Slot />
    </ark.span>
  )
})
