import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { parts } from './segment-group.anatomy.ts'
import { useSegmentGroupContext } from './use-segment-group-context.ts'

export interface SegmentGroupIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface SegmentGroupIndicatorProps extends HTMLProps<'div'>, SegmentGroupIndicatorBaseProps {}

export const SegmentGroupIndicator = component$<SegmentGroupIndicatorProps>((props) => {
  const api = useSegmentGroupContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), parts.indicator.attrs as Record<string, string>, props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
