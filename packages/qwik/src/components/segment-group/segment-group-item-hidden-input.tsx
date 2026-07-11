import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSegmentGroupContext } from './use-segment-group-context.ts'
import { useSegmentGroupItemPropsContext } from './use-segment-group-item-props-context.ts'

export interface SegmentGroupItemHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface SegmentGroupItemHiddenInputProps extends HTMLProps<'input'>, SegmentGroupItemHiddenInputBaseProps {}

export const SegmentGroupItemHiddenInput = component$<SegmentGroupItemHiddenInputProps>((props) => {
  const api = useSegmentGroupContext()
  const itemProps = useSegmentGroupItemPropsContext()
  const inputProps = api ? mergeProps(api.getItemHiddenInputProps(itemProps), props) : props

  return <ark.input {...inputProps} />
})
