import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { parts } from './segment-group.anatomy.ts'
import { useSegmentGroupContext } from './use-segment-group-context.ts'

export interface SegmentGroupLabelBaseProps extends PolymorphicProps<'span'> {}
export interface SegmentGroupLabelProps extends HTMLProps<'span'>, SegmentGroupLabelBaseProps {}

export const SegmentGroupLabel = component$<SegmentGroupLabelProps>((props) => {
  const api = useSegmentGroupContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), parts.label.attrs as Record<string, string>, props) : props

  return (
    <ark.span {...labelProps}>
      <Slot />
    </ark.span>
  )
})
